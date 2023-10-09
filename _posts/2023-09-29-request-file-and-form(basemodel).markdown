---
layout: post
title:  "FastAPI : Request File and Form(BaseModel)"
date:   2023-09-29 08:00:00 +0800
categories: RESTAPI
tags: [FastAPI, POST, Form, File]
---

## 两种方法

### (file: UploadFile = File(...), mask: Json = Form(default=None))

```py
from pydantic import BaseModel, Json, ValidationError
from fastapi import APIRouter, File, UploadFile, HTTPException, Form, Depends

class Box(BaseModel):
    x: int
    y: int
    w: int
    h: int

router = APIRouter()

@router.post("/test")
async def test(file: UploadFile = File(...), 
               mask: Json = Form(default=None), 
               n: int = Form(default=0)) -> str:
    try:
        mask = Box.model_validate(mask)
    except Exception as e:
        raise HTTPException(status_code=422, detail=e.errors())

    result = {}
    result['file'] = file.filename
    result['file_size'] = file.size
    result['mask'] = mask.dict()
    result['n'] = n

    return json.dumps(result)
```

### (file: UploadFile = File(...), mask: Box = Depends(validate_json(Box)))

```py
from pydantic import BaseModel, Json, ValidationError
from fastapi import APIRouter, File, UploadFile, HTTPException, Form, Depends

class Box(BaseModel):
    x: int
    y: int
    w: int
    h: int

router = APIRouter()

def validate_json(model: type[BaseModel]):
    def wrapper(mask = Form(...)):
        try:
            return model.parse_raw(mask)
        except ValidationError as e:
            raise HTTPException(status_code=422, detail=e.errors())

    return wrapper

@router.post("/test1")
async def test1(file: UploadFile = File(...), 
                mask: Box = Depends(validate_json(Box)), 
                n: int = Form(default=0)) -> str:
    result = {}
    result['file'] = file.filename
    result['file_size'] = file.size
    result['mask'] = mask.dict()
    result['n'] = n

    return json.dumps(result)
```

## CURL 测试

```sh
curl --location 'http://127.0.0.1:8000/ocr/test1' \
    --form 'file=@"/Users/junjian/test.png"' \
    --form 'mask="{\"x\": 0, \"y\": 0, \"w\": 0, \"h\": 0}"' \
    --form 'n="1"'
```

## 参考资料
* [Request Forms and Files](https://fastapi.tiangolo.com/tutorial/request-forms-and-files/)
* [Form Data](https://fastapi.tiangolo.com/tutorial/request-forms/)
* [Request Files](https://fastapi.tiangolo.com/tutorial/request-files/)
* [FastAPI - How to upload file via form?](https://stackoverflow.com/questions/70796124/fastapi-how-to-upload-file-via-form)
