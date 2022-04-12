---
layout: post
title:  "使用 FastAPI 开发 RESTAPI 服务"
date:   2022-04-12 08:00:00 +0800
categories: Python
tags: [FastAPI, RESTAPI]
---

## 创建项目
### 创建目录
```shell
mkdir project
cd project
```

### 创建虚拟环境
```shell
python -m venv env
source env/bin/activate
# 退出命令 deactivate
```

### 创建 requirements.txt 文件
```txt
fastapi
python-multipart
aiofiles
uvicorn
gunicorn
```

### 安装需要的库
```shell
pip install -r requirements.txt -i https://mirrors.aliyun.com/pypi/simple/
```

### 项目目录结构
```
project
├── app
│   ├── __init__.py
│   ├── dependencies.py
│   ├── main.py
│   └── routers
│       ├── __init__.py
│       ├── files.py
│       └── users.py
└── requirements.txt
```

main.py
```py
import uvicorn

from fastapi import FastAPI

from .routers import users
from .routers import files


app = FastAPI(title='REST API Interface', version='1.0', 
              description="基于 FastAPI 的 REST API 接口。")


app.include_router(users.router)
app.include_router(files.router)


@app.get('/')
async def index():
    return {'Hello': 'World!'}


if __name__ == '__main__':
    uvicorn.run(app, host='0.0.0.0', port=8000)
```

dependencies.py
```py
import inspect

from typing import Type
from pydantic import BaseModel
from fastapi import Form


def as_form(cls: Type[BaseModel]):
    new_parameters = []

    for field_name, model_field in cls.__fields__.items():
        model_field: ModelField  # type: ignore

        new_parameters.append(
             inspect.Parameter(
                 model_field.alias,
                 inspect.Parameter.POSITIONAL_ONLY,
                 default=Form(...) if model_field.required else Form(model_field.default),
                 annotation=model_field.outer_type_,
             )
         )

    async def as_form_func(**data):
        return cls(**data)

    sig = inspect.signature(as_form_func)
    sig = sig.replace(parameters=new_parameters)
    as_form_func.__signature__ = sig  # type: ignore
    setattr(cls, 'as_form', as_form_func)
    return cls
```

routers/users.py
```py
from typing import Optional
from fastapi import APIRouter, Form
from pydantic import BaseModel

from ..dependencies import as_form


router = APIRouter(tags=['Users'])


@as_form
class User(BaseModel):
    name: str
    age: Optional[int] = None


@router.post("/users", tags=['User'])
async def create_user(name: str = Form(...), age: Optional[int] = Form(None)):
    return User(name=name, age=age)


@router.put("/users/{name}", tags=['User'])
async def update_user(name: str, age: Optional[int] = Form(None)):
    return User(name=name, age=age)


@router.post("/users_by_json", tags=['User'])
async def create_user(user: User):
    return user


@router.put("/users_by_json/{name}", tags=['User'])
async def update_user(name: str, user: Optional[User] = None):
    return user


@router.get("/users/{name}", tags=['User'])
async def read_user(name: str):
    return User(name=name)


@router.get("/users", tags=['User'])
async def read_user(name: str, age: Optional[int] = None):
    return User(name=name, age=age)
```

routers/files.py
```py
import json
import tempfile
import aiofiles

from enum import Enum

from fastapi import APIRouter
from fastapi import Depends, Form, UploadFile
from fastapi.responses import StreamingResponse

from starlette.requests import Request

from .users import User


CHUNK_SIZE = 262144 #256*1024


router = APIRouter(prefix='/files', tags=['Files'])


@router.post('/upload/file', summary='上传速度快 binary')
async def create_file(request: Request):
    file_path = f'test/image.jpg'
    with open(file_path, "wb") as file:
        async for chunk in request.stream():
            file.write(chunk)
    return {'file_path': file_path}


@router.post('/upload/tempfile', summary='上传文件，存储为临时文件 binary')
async def create_tempfile(request: Request):
    with tempfile.NamedTemporaryFile() as file:
        file_path = file.name
        async for chunk in request.stream():
            file.write(chunk)
        file.flush()
        
    return {'file_path': file_path}


@router.post("/upload/files", summary='上传多文件 form-data')
async def create_files(files: list[UploadFile]):
    """
    Form Data: https://fastapi.tiangolo.com/tutorial/request-forms/
    """

    file_paths = []
    for file in files:
        file_path = f'test/{file.filename}'
        file_paths.append(file_path)

        async with aiofiles.open(file_path, 'wb') as f:
            content = await file.read()
            await f.write(content)

    return {'file_path': file_paths}


@router.post('/upload/file_and_json', summary='上传文件和JSON数据 form-data')
async def create_uploadfile_and_json(file: UploadFile, data: str = Form(...)):
    file_path = f'test/{file.filename}'
    async with aiofiles.open(file_path, 'wb') as f:
        content = await file.read()
        await f.write(content)

    d = json.loads(data)
    d['file_path'] = file_path

    return d


@router.post('/upload/file_and_model', summary='上传文件和模型对象 form-data')
async def create_uploadfile_and_model(file: UploadFile, user: User = Depends(User.as_form)):
    """
    下面的参考链接还有点问题，User.age 是可选参数，但是请求需要设置，不然出错: 422 Unprocessable Entity。这里已经修复了。
    https://stackoverflow.com/questions/60127234/how-to-use-a-pydantic-model-with-form-data-in-fastapi
    """
    file_path = f'test/{file.filename}'
    async with aiofiles.open(file_path, 'wb') as f:
        content = await file.read()
        await f.write(content)

    return user


@router.get('/download/file', response_class=StreamingResponse, summary='下载速度快')
async def read_file():
    file_path = 'app/assets/image.jpg'

    async def iterfile(file_path, chunk_size):
        async with aiofiles.open(file_path, 'rb') as f:
            while chunk := await f.read(chunk_size):
                yield chunk

    return StreamingResponse(iterfile(file_path, CHUNK_SIZE), media_type="application/octet-stream")


class MediaType(str, Enum):
    jpg = 'jpg'
    png = 'png'
    mp4 = 'mp4'

    def get_type(self):
        types = {self.jpg: 'image/jpeg', self.png: 'image/png', self.mp4: 'video/mp4'}
        return types[self]

    def get_file(self):
        files = {self.jpg: 'image.jpg', self.png: 'image.png', self.mp4: 'video.mp4'}
        return files[self]


@router.get('/{media_type}', response_class=StreamingResponse)
async def read_media_file(media_type: MediaType):
    """
    MIME 类型: https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Basics_of_HTTP/MIME_types
    HTTP 响应代码: https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Status
    """

    file_path = f'app/assets/{media_type.get_file()}'

    async def iterfile(file_path, chunk_size):
        async with aiofiles.open(file_path, 'rb') as f:
            while chunk := await f.read(chunk_size):
                yield chunk

    return StreamingResponse(iterfile(file_path, CHUNK_SIZE), media_type=media_type.get_type())
```

## 运行
### 调试
```shell
uvicorn app.main:app --reload
```

### uvicorn
```shell
uvicorn app.main:app --host 0.0.0.0 --workers 4
```

### gunicorn + uvicorn
```shell
gunicorn app.main:app --bind 0.0.0.0 --workers 4 --worker-class uvicorn.workers.UvicornWorker
```

## 参考资料
* [FastAPI](https://fastapi.tiangolo.com/zh/)
* [Uvicorn - An ASGI web server, for Python.](https://www.uvicorn.org)
* [Streaming video with FastAPI](https://stribny.name/blog/fastapi-video/)
* [The OpenAPI Specification Explained](https://oai.github.io/Documentation/specification.html)
* [OpenAPI 规范](https://openapi.apifox.cn)
* [enum](https://docs.python.org/3/library/enum.html)
* [Python单例模式(Singleton)的N种实现](https://zhuanlan.zhihu.com/p/37534850)
* [MIME 类型](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Basics_of_HTTP/MIME_types)
* [Sending binary data along with a REST API request](https://blog.marcinbudny.com/2014/02/sending-binary-data-along-with-rest-api.html)
* [Uploading large files by chunking – featuring Python Flask and Dropzone.js](https://codecalamity.com/uploading-large-files-by-chunking-featuring-python-flask-and-dropzone-js/)
* [How to read big file in Python](https://www.iditect.com/guide/python/python_howto_read_big_file_in_chunks.html)
* [How to use Starlettes Streaming response with FastAPI](https://github.com/tiangolo/fastapi/issues/483)
* [Streaming Large Files](https://bleepcoder.com/fastapi/415877370/question-streaming-large-files)
* [When return a big file by FileResponse, How to realize resuming transfer on the server side](https://github.com/tiangolo/fastapi/issues/1896)
* [Using StreamingResponse to stream videos with seeking capabilities](https://github.com/tiangolo/fastapi/issues/1240)
* [Python: How do I return an image in fastAPI?](https://pyquestions.com/how-do-i-return-an-image-in-fastapi)
* [How to return xlsx file from memory in fastapi?](https://stackoverflow.com/questions/63465155/how-to-return-xlsx-file-from-memory-in-fastapi)
* [Response file stream from S3 FastAPI](https://stackoverflow.com/questions/69617252/response-file-stream-from-s3-fastapi)
* [Request with Forms and Files requires the 'File' parameter to be listed first](https://github.com/tiangolo/fastapi/issues/4384)
* [stream body full when sent from FastAPI, empty when received by requests](https://stackoverflow.com/questions/65376633/stream-body-full-when-sent-from-fastapi-empty-when-received-by-requests)
* [How do you save multitype/form data to a hard file in Python with FastAPI UploadFile?](https://stackoverflow.com/questions/64686917/how-do-you-save-multitype-form-data-to-a-hard-file-in-python-with-fastapi-upload)
* [Handling File Uploads with FastAPI](https://ianrufus.com/blog/2020/12/fastapi-file-upload/)
* [Real-time data streaming using FastAPI and WebSockets](https://stribny.name/blog/2020/07/real-time-data-streaming-using-fastapi-and-websockets/)
* [Streaming Large Files](https://github.com/tiangolo/fastapi/issues/58)
* [FastAPI Form Data](https://fastapi.tiangolo.com/pt/tutorial/request-forms/)
* [fastapi throws 400 bad request when I upload a large file](https://stackoverflow.com/questions/67712596/fastapi-throws-400-bad-request-when-i-upload-a-large-file)
* [Read dynamic FormData with FastApi](https://stackoverflow.com/questions/64411188/read-dynamic-formdata-with-fastapi)
* [FastAPI Custom Response - HTML, Stream, File, others](https://fastapi.tiangolo.com/advanced/custom-response/?h=streaming#using-streamingresponse-with-file-like-objects)
* [emojipedia](https://emojipedia.org)
* [How to use a Pydantic model with Form data in FastAPI?](https://stackoverflow.com/questions/60127234/how-to-use-a-pydantic-model-with-form-data-in-fastapi)
* [How to add both file and JSON body in a FastAPI POST request?](https://stackoverflow.com/questions/65504438/how-to-add-both-file-and-json-body-in-a-fastapi-post-request/70640522#70640522)
* [Advanced Usage](https://www.python-httpx.org/advanced/#multipart-file-encoding)
* [How to Upload Files using FastAPI](https://www.tutorialsbuddy.com/python-fastapi-upload-files)
* [Better way to send an in-memory file?](https://github.com/tiangolo/fastapi/issues/1277)
* [Fastapi：FastAPI和Uvicorn运行同步且速度非常慢](https://bleepcoder.com/fastapi/612256546/fastapi-and-uvicorn-is-running-synchronously-and-very-slow)
* [FastAPI, return a File response with the output of a sql query](https://stackoverflow.com/questions/61140398/fastapi-return-a-file-response-with-the-output-of-a-sql-query)
* [元数据和文档 URL](https://fastapi.tiangolo.com/zh/tutorial/metadata/)
