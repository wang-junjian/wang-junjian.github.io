---
layout: single
title:  "使用 wrk 对 FastAPI 上传和下载文件的基准测试"
date:   2022-04-11 08:00:00 +0800
categories: 工作日志 测试 Python
tags: [FastAPI, RESTAPI, wrk, File, async, uvicorn, Linux]
---

> 服务器 CPU 40核，内存 256G，操作系统 Ubuntu 20.04，Python3.9

## RESTAPI
### 基于 FastAPI 实现的文件上传和下载
```py
router = APIRouter(prefix='/file_benchmarking', tags=['Files'])


@router.post('/upload/binary/chunk/async_func/async_r_sync_w', tags=['Upload', 'binary'])
async def upload_binary_chunk_async_func_async_r_sync_w(request: Request):
    file_path = get_random_filename()
    with open(file_path, "wb") as file:
        async for chunk in request.stream():
            file.write(chunk)
    return {'file_path': file_path}


@router.post('/upload/binary/chunk/async_func/async_rw', tags=['Upload', 'binary'])
async def upload_binary_chunk_async_func_async_rw(request: Request):
    file_path = get_random_filename()
    async with aiofiles.open(file_path, "wb") as file:
        async for chunk in request.stream():
            await file.write(chunk)
    return {'file_path': file_path}


@router.post('/upload/formdata/async_func/async_rw', tags=['Upload', 'form-data'])
async def upload_formdata_async_func_async_rw(file: UploadFile):
    file_path = get_random_filename()
    async with aiofiles.open(file_path, 'wb') as f:
        content = await file.read()
        await f.write(content)

    return {'file_path': file_path}


@router.post('/upload/formdata/chunk/async_func/async_rw', tags=['Upload', 'form-data'])
async def upload_formdata_chunk_async_func_async_rw(file: UploadFile):
    file_path = get_random_filename()
    async with aiofiles.open(file_path, 'wb') as f:
        while chunk := await file.read(CHUNK_SIZE):
            await f.write(chunk)

    return {'file_path': file_path}


@router.post('/upload/formdata/sync_func', tags=['Upload', 'form-data'])
def upload_formdata_sync_func(file: UploadFile = File(...)):
    file_path = get_random_filename()
    with open(file_path, 'wb') as f:
        content = file.file.read()
        f.write(content)

    return {'file_path': file_path}


class JSON(BaseModel):
    base64: str


@router.post('/upload/raw/json/base64/sync_rw', tags=['Upload', 'base64'])
async def upload_raw_json_base64_sync_rw(json: JSON):
    data = base64.b64decode(json.base64)
    file_path = get_random_filename()
    with open(file_path, "wb") as file:
        file.write(data)
    return {'file_path': file_path}


@router.get('/download/chunk/async_func/async_r', tags=['Download'], response_class=StreamingResponse)
async def download_chunk_async_func_async_r():
    random_file = RandomFile()
    file_path = random_file.get_random_file()
    
    # FastAPI 的源代码中会把这个同步的代码放到线程池中转换成异步代码，和自己手写的异步代码效率持平。
    # def iterfile(file_path, chunk_size):
    #     with open(file_path, 'rb') as f:
    #         while chunk := f.read(chunk_size):
    #             yield chunk

    async def iterfile(file_path, chunk_size):
        async with aiofiles.open(file_path, 'rb') as f:
            while chunk := await f.read(chunk_size):
                yield chunk

    return StreamingResponse(iterfile(file_path, CHUNK_SIZE), media_type="application/octet-stream")


@router.get('/download/async_func/sync_r', tags=['Download'], response_class=FileResponse)
async def download_async_func_sync_r():
    random_file = RandomFile()
    return random_file.get_random_file()


@router.get('/download/sync_func', tags=['Download'], response_class=FileResponse)
def download_sync_func():
    random_file = RandomFile()
    return random_file.get_random_file()
```

### 上传文件
* binary
  * /file_benchmarking/upload/binary/chunk/async_func/async_r_sync_w
  * /file_benchmarking/upload/binary/chunk/async_func/async_rw
* form-data
  * /file_benchmarking/upload/formdata/async_func/async_rw
  * /file_benchmarking/upload/formdata/chunk/async_func/async_rw
  * /file_benchmarking/upload/formdata/sync_func
* raw (base64)
  * /file_benchmarking/upload/raw/json/base64/sync_rw

### 下载文件
  * /file_benchmarking/download/chunk/async_func/async_r
  * /file_benchmarking/download/async_func/sync_r
  * /file_benchmarking/download/sync_func

## 测试准备
### 图片文件
这里使用的测试图片 health.jpg (256kb)

### 基准工具 wrk
```shell
wrk -c100 -t$(nproc) -d10 --latency -s $LUA_FILE  $RESTAPI
```

### wrk lua 脚本
#### binary
wrk 的 lua 脚本：postfile_binary.lua 
```lua
wrk.method = "POST"
local f = io.open("health.jpg", "rb")
wrk.body   = f:read("*all")
wrk.headers["Content-Type"] = "application/octet-stream"
```

#### form-data
生成通过 HTTP POST 发送二进制数据的文件。
```shell
python make_http_postdata.py make health.jpg postdata
```
```
file: /home/wjj/test/postdata
boundary: gouchicao0123456789
```

wrk 的 lua 脚本：postfile_formdata.lua 
```lua
wrk.method = "POST"
local f = io.open("postdata", "rb")
wrk.body   = f:read("*all")
wrk.headers["Content-Type"] = "multipart/form-data; boundary=gouchicao0123456789"
```

#### raw (base64)
生成 json 格式的 base64 文件数据
```shell
echo -n '{"base64": "' > postdata.json
base64 -w0 health.jpg >> postdata.json
echo -n '"}' >> postdata.json
```

wrk 的 lua 脚本：postfile_json.lua 
```lua
wrk.method = "POST"
local f = io.open("postdata.json", "rb")
wrk.body   = f:read("*all")
wrk.headers["Content-Type"] = "application/json"
```

### 部署 FastAPI 应用
#### uvicorn
```shell
uvicorn app.main:app --host 0.0.0.0 --workers $(nproc)
```

## 测试
### 上传文件
#### binary
/file_benchmarking/upload/binary/chunk/async_func/async_r_sync_w
```shell
wrk -c100 -t$(nproc) -d10 --latency -s postfile_binary.lua  "http://172.16.33.159:8000/file_benchmarking/upload/binary/chunk/async_func/async_r_sync_w"
Requests/sec:   4557.54
```

/file_benchmarking/upload/binary/chunk/async_func/async_rw
```shell
wrk -c100 -t$(nproc) -d10 --latency -s postfile_binary.lua  "http://172.16.33.159:8000/file_benchmarking/upload/binary/chunk/async_func/async_rw"
Requests/sec:   4293.37
```

#### form-data
/file_benchmarking/upload/formdata/async_func/async_rw
```shell
wrk -c100 -t$(nproc) -d10 --latency -s postfile_formdata.lua  "http://172.16.33.159:8000/file_benchmarking/upload/formdata/async_func/async_rw"
Requests/sec:   2676.75
```

/file_benchmarking/upload/formdata/chunk/async_func/async_rw
```shell
wrk -c100 -t$(nproc) -d10 --latency -s postfile_formdata.lua  "http://172.16.33.159:8000/file_benchmarking/upload/formdata/chunk/async_func/async_rw"
Requests/sec:   2715.66
```

/file_benchmarking/upload/formdata/sync_func
```shell
wrk -c100 -t$(nproc) -d10 --latency -s postfile_formdata.lua  "http://172.16.33.159:8000/file_benchmarking/upload/formdata/sync_func"
Requests/sec:   2740.36
```

#### raw (base64)
/file_benchmarking/upload/raw/json/base64/sync_rw
```shell
wrk -c100 -t$(nproc) -d10 --latency -s postfile_json.lua  "http://172.16.33.159:8000/file_benchmarking/upload/raw/json/base64/sync_rw"
Requests/sec:   3417.90
```

### 下载文件
/file_benchmarking/download/chunk/async_func/async_r
```shell
wrk -c100 -t$(nproc) -d10 --latency "http://172.16.33.159:8000/file_benchmarking/download/chunk/async_func/async_r"
Requests/sec:   4555.21
```

/file_benchmarking/download/async_func/sync_r
```shell
wrk -c100 -t$(nproc) -d10 --latency "http://172.16.33.159:8000/file_benchmarking/download/async_func/sync_r"
Requests/sec:   1528.95
```

/file_benchmarking/download/sync_func
```shell
wrk -c100 -t$(nproc) -d10 --latency "http://172.16.33.159:8000/file_benchmarking/download/sync_func"
Requests/sec:   1526.50
```

## 总结
* 上传文件，binary 比 form-data 效率高🚀
* 上传文件，读写都用异步并没有带来效率的提升，反而是异步读同步写的效率最高🚀
* 上传和下载文件，都是采用 chunk 的方式的效率高🚀

### 效率最高的上传和下载API
```py
@router.post('/upload/binary/chunk/async_func/async_r_sync_w')
async def upload_binary_chunk_async_func_async_r_sync_w(request: Request):
    file_path = 'test.jpg'

    with open(file_path, "wb") as file:
        async for chunk in request.stream():
            file.write(chunk)

    return {'file_path': file_path}


@router.get('/download/chunk/async_func/async_r', response_class=StreamingResponse)
async def download_chunk_async_func_async_r():
    file_path = 'test.jpg'
    
    async def iterfile(file_path, chunk_size):
        async with aiofiles.open(file_path, 'rb') as f:
            while chunk := await f.read(chunk_size):
                yield chunk

    return StreamingResponse(iterfile(file_path, CHUNK_SIZE), media_type="application/octet-stream")
```

## 参考资料
* [FastAPI](https://fastapi.tiangolo.com/zh/)
* [Uvicorn - An ASGI web server, for Python.](https://www.uvicorn.org)
