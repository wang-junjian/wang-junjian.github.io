---
layout: post
title:  "FastAPI 开发 RESTAPI 实践"
date:   2023-10-04 08:00:00 +0800
categories: RESTAPI
tags: [FastAPI]
---

## 调试
### 运行 FastAPI 项目中的文件，出现 ModuleNotFoundError: No module named 'app'
```py
python app/aimodels/ocr_aimodel.py
Traceback (most recent call last):
  File "/Users/junjian/GitHub/gouchicao/WALL-E-AI/app/aimodels/ocr_aimodel.py", line 3, in <module>
    from app.config import *
ModuleNotFoundError: No module named 'app'
```

```bash
export PYTHONPATH=$PWD
```

## Swagger UI
### 控制 API 的显示
```py
app = FastAPI(...)

@app.get("/", include_in_schema=False)
async def root():
```

### 控制 BaseModel 的显示
```py
app = FastAPI(swagger_ui_parameters={"defaultModelsExpandDepth": -1})
```
* -1: schema section hidden
* 0: schema section is closed
* 1: schema section is open (default)

* [FastAPI - @Schema(hidden=True) not working when trying to hide the schema section on swagger docs](https://stackoverflow.com/questions/70793174/fastapi-schemahidden-true-not-working-when-trying-to-hide-the-schema-sectio)


## [Generate Client](https://fastapi.tiangolo.com/advanced/generate-clients/)
* [OpenAPI Generator](https://openapi-generator.tech/)
