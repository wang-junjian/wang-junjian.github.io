---
layout: post
title:  "FastAPI 开发 RESTAPI 实践"
date:   2023-10-04 08:00:00 +0800
categories: RESTAPI
tags: [FastAPI, markdown, CSS, requirements.txt, PYTHONPATH]
---

## 首页

### 重定向到 Swagger UI
```py
@app.get("/", include_in_schema=False)
async def index():
    return RedirectResponse('/docs', status_code=303)
```

### 使用 route 的 docstring 作为首页内容

```py
@app.get("/", response_class=HTMLResponse, include_in_schema=False)
async def index():
    # 需要过滤的路由
    filted_routes = [
        "/openapi.json",
        "/docs",
        "/docs/oauth2-redirect",
        "/redoc",
        "/static",
        "/"
    ]
    
    routes = []
    for route in app.routes:
        if route.path not in filted_routes:
            routes.append(route)

    HTML_TEMPLATE = """
        <center>
            <div class="main">
                <h1 class="title">{title}</h1>
                <small><pre class="version">{version}</pre></small>
            </div>
            <a href="docs" target="_blank" class="link">Swagger UI</a> <a href="redoc" target="_blank" class="link">ReDoc</a>
        </center>
        <div style="max-width: 100%;" class="content">
            <style>
                .main .title {{ display: inline-block; }}
                .main .version {{ display: inline-block; background-color: #7e8491; font-size: 15px; padding: 4px; border-radius: 15px;}}
                .content h1 {{ background-color: #6ec896; }}
                img {{ max-width: 100%; }}
                table {{ width: 100%; border-collapse: collapse; }} table th {{ background-color: #a3a3a3; color: #fff; }} table tr:nth-child(even) {{ background-color: #f2f2f2; }}
                pre {{ background-color: #f0f0f0; }}
                .link {{ color: #6969e8; font-size: 20px; font-weight: bold; text-decoration: none; margin-right: 10px;}}
                .link:hover {{ color: #9669ff; }}
            </style>
            {html_content}
        </div>
    """

    html_content = ""
    for route in routes:
        html_content += markdown(
            f"# {route.methods} {route.path} {route.summary}\n{textwrap.dedent(route.endpoint.__doc__)}",
            extensions=['fenced_code', 'tables'] # extra
        )

    html_content = HTML_TEMPLATE.format(
        title=TITLE, version=VERSION, 
        html_content=html_content
    )

    return HTMLResponse(content=html_content, status_code=200)
```

#### Markdown to HTML
安装

```bash
pip install markdown
```

使用

```py
from markdown import markdown
print(markdown("# Title"))
```
```
<h1>Title</h1>
```

##### 转换表格

```py
md = """
  | EasyOCR | PaddleOCR |
  | ------- | --------- |
  | 1.7.1   | 2.5.1     |
"""

html = markdown(md, extensions=['tables'])
print(html)
```
```html
<table>
<thead>
<tr>
<th>EasyOCR</th>
<th>PaddleOCR</th>
</tr>
</thead>
<tbody>
<tr>
<td>1.7.1</td>
<td>2.5.1</td>
</tr>
</tbody>
</table>
```

##### 代码高亮显示

同时使用 `fenced_code` 和 `codehilite` 扩展

```py
md = """
    ```py
    from markdown import markdown
    html = markdown("# Title")
    ```
"""
html = markdown(md, extensions=['fenced_code', 'codehilite'])
print(html)
```

中文：生成将应用于 `.codehilite` 类的 CSS 样式
  
```bash
pygmentize -S monokai -f html -a .codehilite > static/css/codehilite.css
```

在 HTML 中引用

```html
<link rel="stylesheet" href="/static/css/codehilite.css"/>
```

* [Using Markdown as a Python Library](https://python-markdown.github.io/reference/)
* [Python-Markdown 3.5 documentation » Extensions](https://python-markdown.github.io/extensions/)
* [Convert Markdown to HTML with Python](https://www.devdungeon.com/content/convert-markdown-html-python)
* [Convert Markdown tables to html tables using Python](https://stackoverflow.com/questions/47048906/convert-markdown-tables-to-html-tables-using-python)


#### CSS：层叠样式表

* [CSS：层叠样式表 align-items](https://developer.mozilla.org/zh-CN/docs/Web/CSS/align-items)


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

### HTMLResponse 响应
*[How to return a HTMLResponse with FastAPI](https://stackoverflow.com/questions/65296604/how-to-return-a-htmlresponse-with-fastapi)


## requirements.txt

### 公共包 requirements_common.txt
```txt
--extra-index-url https://pypi.tuna.tsinghua.edu.cn/simple
python-dotenv
fastapi[all]
uvicorn[standard]
gunicorn
aiofiles
markdown
```

### 项目包 requirements.txt
```txt
-r requirements_common.txt

--extra-index-url https://download.pytorch.org/whl/cpu
torch==2.0.1
torchvision==0.15.2

--extra-index-url https://pypi.tuna.tsinghua.edu.cn/simple

# EasyOCR
easyocr

# PaddleOCR
numpy<1.24      # paddleocr 依赖
paddlepaddle
PyMuPDF==1.21.1 # paddleocr 依赖
paddleocr
```

* [--extra-index-url not work in python requirements.txt](https://stackoverflow.com/questions/72025164/extra-index-url-not-work-in-python-requirements-txt)
* [--extra-index-url in requirements.txt #8103](https://github.com/pypa/pip/issues/8103)


## 调试
### 运行 FastAPI 项目中的文件，出现 ModuleNotFoundError: No module named 'app'

在终端下运行脚本，出现下面的错误。

```py
python app/aimodels/ocr_aimodel.py
```
```bash
Traceback (most recent call last):
  File "/Users/junjian/GitHub/gouchicao/WALL-E-AI/app/aimodels/ocr_aimodel.py", line 3, in <module>
    from app.config import *
ModuleNotFoundError: No module named 'app'
```

#### 手动 - 设置环境变量 PYTHONPATH

```bash
export PYTHONPATH=$PWD
```

#### 自动 - 在 env/bin/activate 文件中设置环境变量 PYTHONPATH

在 `env/bin/activate` 文件中加入下面的代码，每次`新建终端`时，都会自动执行。

```bash
$ vim env/bin/activate
```
```
# HACK: ModuleNotFoundError: No module named 'app'
export PYTHONPATH=$PWD
```

* [ModuleNotFoundError: No module named 'app.routes'](https://stackoverflow.com/questions/68505216/modulenotfounderror-no-module-named-app-routes)
* [ModuleNotFoundError: No module named 'app' using uvicorn, fastapi #2582](https://github.com/tiangolo/fastapi/issues/2582)
* [How to correctly set PYTHONPATH for Visual Studio Code](https://stackoverflow.com/questions/53653083/how-to-correctly-set-pythonpath-for-visual-studio-code)



## [Generate Client](https://fastapi.tiangolo.com/advanced/generate-clients/)
* [OpenAPI Generator](https://openapi-generator.tech/)


## 参考资料
* [使用 FastAPI 构建机器学习微服务](https://developer.nvidia.com/zh-cn/blog/building-a-machine-learning-microservice-with-fastapi/)
