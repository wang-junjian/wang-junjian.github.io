---
layout: post
title:  "将 API 密钥身份验证添加到 FastAPI 应用程序"
date:   2023-10-13 08:00:00 +0800
categories: API_KEY
tags: [API_KEY, Authentication, FastAPI]
---

## API_KEY
### 方法一
```py
from fastapi import Security, HTTPException, status
from fastapi.security.api_key import APIKeyHeader


API_KEY="123456"
API_KEY_NAME = "X-API-KEY"
api_key_header = APIKeyHeader(name=API_KEY_NAME, auto_error=True)

async def get_api_key(api_key: str = Security(api_key_header)):
    if api_key != API_KEY:
        raise HTTPException(
             status_code=status.HTTP_401_UNAUTHORIZED,
             detail="Invalid API Key"
        )


@app.get('/index', dependencies=[Security(get_api_key)])
async def index():
    return {"message": "Hello World"}
```

APIKeyHeader 的源码

```py
class APIKeyHeader(APIKeyBase):
    def __init__(
        self,
        *,
        name: str,
        scheme_name: Optional[str] = None,
        description: Optional[str] = None,
        auto_error: bool = True,
    ):
        self.model: APIKey = APIKey(
            **{"in": APIKeyIn.header},  # type: ignore[arg-type]
            name=name,
            description=description,
        )
        self.scheme_name = scheme_name or self.__class__.__name__
        self.auto_error = auto_error

    async def __call__(self, request: Request) -> Optional[str]:
        api_key = request.headers.get(self.model.name)
        if not api_key:
            if self.auto_error:
                raise HTTPException(
                    status_code=HTTP_403_FORBIDDEN, detail="Not authenticated"
                )
            else:
                return None
        return api_key
```

如果 `auto_error=True`（默认），那么当 api_key 不存在时，会抛出 HTTPException 异常，返回 403 状态码。

如果 `auto_error=False`，那么当 api_key 不存在时，会返回 None。那么自定义函数 `get_api_key` 才会被调用。


### 方法二
```py
from fastapi import Security, HTTPException, status
from fastapi.security.api_key import APIKeyHeader, APIKey


API_KEY="123456"
API_KEY_NAME = "X-API-KEY"
api_key_header = APIKeyHeader(name=API_KEY_NAME, auto_error=True)

async def get_api_key(api_key: str = Security(api_key_header)):
    if api_key != API_KEY:
        raise HTTPException(
             status_code=status.HTTP_401_UNAUTHORIZED,
             detail="Invalid API Key"
        )


@app.get('/index')
async def index(api_key: APIKey = Security(get_api_key)):
    return {"message": "Hello World"}
```


## 参考资料
* [FastAPI 安全性](https://fastapi.tiangolo.com/zh/tutorial/security/)
* [FastAPI Security](https://fastapi.tiangolo.com/tutorial/security/)
* [OAuth2 实现密码哈希与 Bearer JWT 令牌验证](https://fastapi.tiangolo.com/zh/tutorial/security/oauth2-jwt/)
* [Adding API Key Authorization](https://retz.dev/blog/adding-api-key-authorization)
* [Adding API Key Authentication to a FastAPI application](https://joshdimella.com/blog/adding-api-key-auth-to-fast-api)
* [FastApi - api key as parameter secure enough](https://stackoverflow.com/questions/67942766/fastapi-api-key-as-parameter-secure-enough)
* [Build and Secure an API in Python with FastAPI](https://developer.okta.com/blog/2020/12/17/build-and-secure-an-api-in-python-with-fastapi)
* [API Keys: API Authentication Methods & Examples](https://blog.stoplight.io/api-keys-best-practices-to-authenticate-apis)
* [Response Status Code](https://fastapi.tiangolo.com/tutorial/response-status-code/)
* [ApiKey Header documentation #142](https://github.com/tiangolo/fastapi/issues/142)
* [Adding API Key Authentication to a FastAPI application](https://www.cnblogs.com/bitterteaer/p/17705337.html)
