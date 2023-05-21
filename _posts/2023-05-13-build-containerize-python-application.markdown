---
layout: post
title:  "构建容器化 Python 应用程序"
date:   2023-05-13 08:00:00 +0800
categories: Python
tags: [Dockerfile, Docker, Cache, pip, apt, venv, wheel, 知识扩展]
---

这里使用 [Ultralytics Serving](https://github.com/gouchicao/ultralytics-serving) 作为示例，它是一个基于 [FastAPI](https://fastapi.tiangolo.com/) 和 [Ultralytics YOLOv8](https://github.com/ultralytics/ultralytics) 的模型推理服务。

## 选择 [Python 镜像](https://hub.docker.com/_/python)

| Tag | Python Version | OS Version | Size |
| --- | --- | --- | --- |
| 3.10        | 3.10 | Debian GNU/Linux 11 (bullseye) | 861MB |
| 3.10-slim   | 3.10 | Debian GNU/Linux 11 (bullseye) | 114MB |
| 3.10-alpine | 3.10 | Alpine Linux 3.15.0            | 44.7MB |

## 克隆 Ultralytics Serving
```bash
git clone https://github.com/gouchicao/ultralytics-serving.git
cd ultralytics-serving
```

## 编写 Dockerfile
采用两阶段构建，第一阶段安装依赖环境和编译应用，第二阶段发布应用。第二阶段可以使用小一点的镜像，比如 `python:3.10-slim` 或 `python:3.10-alpine`。

### 普通版本
```dockerfile
FROM python:3.10 AS builder

ENV APP_HOME=/ultralytics-serving

WORKDIR ${APP_HOME}

# 提前安装，因为 cpu 版本需要指定 index-url。
RUN pip install --no-cache-dir torch torchvision \
    --index-url https://download.pytorch.org/whl/cpu

COPY ./requirements.txt ${APP_HOME}/requirements.txt
RUN pip install --no-cache-dir --upgrade -r ${APP_HOME}/requirements.txt

# 编译应用
COPY ./app ${APP_HOME}/app
RUN find ${APP_HOME}/app -name '*.py[co]' -delete \
    && python -m compileall -b ${APP_HOME}/app \
    && find ${APP_HOME}/app -name '*.py' -delete


# 发布应用
FROM python:3.10

ENV APP_HOME=/ultralytics-serving

WORKDIR ${APP_HOME}

RUN apt-get update \
    && apt-get install -y libgl1-mesa-glx \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

COPY --from=builder /usr/local/lib/python3.10/site-packages /usr/local/lib/python3.10/site-packages
COPY --from=builder /usr/local/bin /usr/local/bin
COPY --from=builder ${APP_HOME}/app ${APP_HOME}/app

EXPOSE 80

COPY ./asserts ${APP_HOME}/asserts
COPY ./static ${APP_HOME}/static

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "80"]
# CMD ["gunicorn", "-w", "4", "-k", "uvicorn.workers.UvicornWorker", "app.main:app", "--bind", "0.0.0.0:80"]
```

### 🚀 加速构建版本 👍
这里使用了 Docker 缓存机制（pip 缓存、apt 缓存），配置了 pip 镜像源和 apt 镜像源，加速构建。

```dockerfile
FROM python:3.10 AS builder

ENV APP_HOME=/ultralytics-serving

WORKDIR ${APP_HOME}

# 提前安装，因为 cpu 版本需要指定 index-url。
RUN --mount=type=cache,target=/root/.cache/pip \
    pip install torch torchvision \
    --index-url https://download.pytorch.org/whl/cpu

RUN pip config set global.index-url https://mirrors.aliyun.com/pypi/simple/

COPY ./requirements.txt ${APP_HOME}/requirements.txt
RUN --mount=type=cache,target=/root/.cache/pip \
    pip install -r ${APP_HOME}/requirements.txt

# 编译应用
COPY ./app ${APP_HOME}/app
RUN find ${APP_HOME}/app -name '*.py[co]' -delete \
    && python -m compileall -b ${APP_HOME}/app \
    && find ${APP_HOME}/app -name '*.py' -delete


# 发布应用
FROM python:3.10-slim

ENV APP_HOME=/ultralytics-serving

WORKDIR ${APP_HOME}

RUN sed -i '1i\
deb https://mirrors.aliyun.com/debian/ bullseye main non-free contrib\
# deb-src https://mirrors.aliyun.com/debian/ bullseye main non-free contrib\
deb https://mirrors.aliyun.com/debian-security/ bullseye-security main\
# deb-src https://mirrors.aliyun.com/debian-security/ bullseye-security main\
deb https://mirrors.aliyun.com/debian/ bullseye-updates main non-free contrib\
# deb-src https://mirrors.aliyun.com/debian/ bullseye-updates main non-free contrib\
deb https://mirrors.aliyun.com/debian/ bullseye-backports main non-free contrib\
# deb-src https://mirrors.aliyun.com/debian/ bullseye-backports main non-free contrib\
' /etc/apt/sources.list

RUN rm -f /etc/apt/apt.conf.d/docker-clean; echo 'Binary::apt::APT::Keep-Downloaded-Packages "true";' > /etc/apt/apt.conf.d/keep-cache
RUN --mount=type=cache,target=/var/cache/apt,sharing=locked --mount=type=cache,target=l,sharing=locked \
    apt update && \
    apt-get install libglib2.0-0 libsm6 libxrender1 libxext6 libgl1-mesa-glx --no-install-recommends -y && \
    rm -rf /var/lib/apt/lists/*

COPY --from=builder /usr/local/lib/python3.10/site-packages /usr/local/lib/python3.10/site-packages
COPY --from=builder /usr/local/bin /usr/local/bin
COPY --from=builder ${APP_HOME}/app ${APP_HOME}/app

EXPOSE 80

COPY ./asserts ${APP_HOME}/asserts
COPY ./static ${APP_HOME}/static

CMD ["gunicorn", "--worker-tmp-dir", "/dev/shm", "-w", "4", "-k", "uvicorn.workers.UvicornWorker", "app.main:app", "--bind", "0.0.0.0:80"]
```

这里在第二阶段，使用 `python:3.10-slim` 镜像替代 `python:3.10` 镜像，因为 `python:3.10-slim` 镜像体积更小，构建更快。只需要安装依赖的动态库即可。

| 镜像 | 镜像大小 | 应用大小 |
| --- | --- | --- |
| python:3.10      | 861MB | 1.93GB |
| python:3.10-slim | 114MB | 1.18GB |


#### 使用共享内存支架进行Gunicorn心跳

Gunicorn使用基于文件的心跳系统来确保所有分叉的工人进程都是活的。

在大多数情况下，心跳文件可以在“/tmp”中找到，它通常通过tmpfs在内存中。由于Docker默认不利用tmpfs，因此文件将存储在磁盘支持的文件系统中。这可能会导致问题，例如随机冻结，因为心跳系统使用os.fchmod，如果目录实际上在磁盘支持的文件系统上，它可能会阻止工人。

幸运的是，有一个简单的修复：通过--worker-tmp-dir标志将心跳目录更改为内存映射目录。

### 使用虚拟环境
```dockerfile
FROM python:3.10 AS builder

ENV APP_HOME=/ultralytics-serving

WORKDIR ${APP_HOME}

ENV VIRTUAL_ENV=/venv
RUN python -m venv $VIRTUAL_ENV
# RUN python -m venv venv && . venv/bin/activate    # 不知道为什么这样写不行
ENV PATH="${VIRTUAL_ENV}/bin:$PATH"

# 提前安装，因为 cpu 版本需要指定 index-url。
RUN --mount=type=cache,target=/root/.cache/pip \
    pip install torch torchvision \
    --index-url https://download.pytorch.org/whl/cpu

RUN pip config set global.index-url https://mirrors.aliyun.com/pypi/simple/

COPY ./requirements.txt ${APP_HOME}/requirements.txt
RUN --mount=type=cache,target=/root/.cache/pip \
    pip install -r ${APP_HOME}/requirements.txt

# 编译应用
COPY ./app ${APP_HOME}/app
RUN find ${APP_HOME}/app -name '*.py[co]' -delete \
    && python -m compileall -b ${APP_HOME}/app \
    && find ${APP_HOME}/app -name '*.py' -delete


# 发布应用
FROM python:3.10-slim

ENV APP_HOME=/ultralytics-serving

WORKDIR ${APP_HOME}

RUN sed -i '1i\
deb https://mirrors.aliyun.com/debian/ bullseye main non-free contrib\
# deb-src https://mirrors.aliyun.com/debian/ bullseye main non-free contrib\
deb https://mirrors.aliyun.com/debian-security/ bullseye-security main\
# deb-src https://mirrors.aliyun.com/debian-security/ bullseye-security main\
deb https://mirrors.aliyun.com/debian/ bullseye-updates main non-free contrib\
# deb-src https://mirrors.aliyun.com/debian/ bullseye-updates main non-free contrib\
deb https://mirrors.aliyun.com/debian/ bullseye-backports main non-free contrib\
# deb-src https://mirrors.aliyun.com/debian/ bullseye-backports main non-free contrib\
' /etc/apt/sources.list

RUN rm -f /etc/apt/apt.conf.d/docker-clean; echo 'Binary::apt::APT::Keep-Downloaded-Packages "true";' > /etc/apt/apt.conf.d/keep-cache
RUN --mount=type=cache,target=/var/cache/apt,sharing=locked --mount=type=cache,target=l,sharing=locked \
    apt update && \
    apt-get install libglib2.0-0 libsm6 libxrender1 libxext6 libgl1-mesa-glx --no-install-recommends -y && \
    rm -rf /var/lib/apt/lists/*

ENV VIRTUAL_ENV=/venv
COPY --from=builder ${VIRTUAL_ENV} ${VIRTUAL_ENV}
COPY --from=builder ${APP_HOME}/app ${APP_HOME}/app

EXPOSE 80

COPY ./asserts ${APP_HOME}/asserts
COPY ./static ${APP_HOME}/static

ENV PATH="${VIRTUAL_ENV}/bin:$PATH"
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "80"]
```

### 把依赖的包打包成 wheel
这个方法应用在镜像构建中不太好，会增大镜像，上面是 1.18GB，这里就变成了 1.58GB，感觉不适合应用于镜像的构建。

```dockerfile
FROM python:3.10 AS builder

ENV APP_HOME=/ultralytics-serving

WORKDIR ${APP_HOME}

RUN pip config set global.index-url https://mirrors.aliyun.com/pypi/simple/

COPY ./requirements.txt ${APP_HOME}/requirements.txt

RUN --mount=type=cache,target=/root/.cache/pip \
    pip wheel --no-deps --wheel-dir /wheels -r ${APP_HOME}/requirements.txt

# 编译应用
COPY ./app ${APP_HOME}/app
RUN find ${APP_HOME}/app -name '*.py[co]' -delete \
    && python -m compileall -b ${APP_HOME}/app \
    && find ${APP_HOME}/app -name '*.py' -delete


# 发布应用
FROM python:3.10-slim

ENV APP_HOME=/ultralytics-serving

WORKDIR ${APP_HOME}

RUN sed -i '1i\
deb https://mirrors.aliyun.com/debian/ bullseye main non-free contrib\
# deb-src https://mirrors.aliyun.com/debian/ bullseye main non-free contrib\
deb https://mirrors.aliyun.com/debian-security/ bullseye-security main\
# deb-src https://mirrors.aliyun.com/debian-security/ bullseye-security main\
deb https://mirrors.aliyun.com/debian/ bullseye-updates main non-free contrib\
# deb-src https://mirrors.aliyun.com/debian/ bullseye-updates main non-free contrib\
deb https://mirrors.aliyun.com/debian/ bullseye-backports main non-free contrib\
# deb-src https://mirrors.aliyun.com/debian/ bullseye-backports main non-free contrib\
' /etc/apt/sources.list

RUN rm -f /etc/apt/apt.conf.d/docker-clean; echo 'Binary::apt::APT::Keep-Downloaded-Packages "true";' > /etc/apt/apt.conf.d/keep-cache
RUN --mount=type=cache,target=/var/cache/apt,sharing=locked --mount=type=cache,target=l,sharing=locked \
    apt update && \
    apt-get install libglib2.0-0 libsm6 libxrender1 libxext6 libgl1-mesa-glx --no-install-recommends -y && \
    rm -rf /var/lib/apt/lists/*


# 提前安装，因为 cpu 版本需要指定 index-url。
RUN --mount=type=cache,target=/root/.cache/pip \
    pip install torch torchvision \
    --index-url https://download.pytorch.org/whl/cpu

COPY --from=builder /wheels /wheels

RUN --mount=type=cache,target=/root/.cache/pip \
    pip install /wheels/*

COPY --from=builder ${APP_HOME}/app ${APP_HOME}/app

EXPOSE 80

COPY ./asserts ${APP_HOME}/asserts
COPY ./static ${APP_HOME}/static

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "80"]
```

`pip wheel --no-deps --wheel-dir /wheels -r ${APP_HOME}/requirements.txt` 这条命令是在 Python 环境下使用 pip 工具执行的，其作用是将 requirements.txt 文件中所列出的依赖包编译成 wheel 文件并存储到指定目录 /wheels 中，同时不使用缓存，并且不包含依赖关系。其中：

- pip：Python 包管理工具，用于安装和管理 Python 包。
- wheel：Python 的包分发格式，可以简化包的安装过程。
- --no-cache-dir：不使用缓存，每次都重新下载依赖包。
- --no-deps：不安装依赖包，只安装 requirements.txt 文件中直接列出的包。
- --wheel-dir：指定编译后的 wheel 文件存储目录。
- -r requirements.txt：指定依赖包列表，从 requirements.txt 文件中读取。

## 构建镜像
```bash
docker buildx build --platform=linux/arm64 --progress=plain --rm -f Dockerfile -t ultralytics-serving:arm64 .
```

* [Overview of Docker Build](https://docs.docker.com/build/)

## 测试
```bash
docker run --rm -it -p 80:80 ultralytics-serving:arm64
```

## 知识扩展
### ENV PYTHONDONTWRITEBYTECODE 1
`PYTHONDONTWRITEBYTECODE`：如果将其设置为1，则Python不会在导入模块时生成.pyc文件，从而避免了.pyc文件的生成，这对于容器化部署等场景比较有用。如果不设置该环境变量，则Python会在导入模块时生成.pyc文件，用于缓存编译后的字节码，以提高下次导入模块的速度。但是，如果在多个环境中运行同一个容器，可能会出现.pyc文件不兼容的问题。

**避免生成.pyc文件，提高容器化部署的兼容性。**

### ENV PYTHONUNBUFFERED 1
`PYTHONUNBUFFERED`：如果将其设置为1，则Python的标准输出和标准错误输出不会被缓存，即输出会立即被打印出来。如果不设置该环境变量，则Python的输出会被缓存，直到缓存区满了或者Python程序运行结束才会一次性打印出来。在容器化部署等场景中，如果不设置该环境变量，可能会导致程序输出不及时，从而难以排查问题。

**立即输出Python程序的标准输出和标准错误输出，方便排查问题。**

### top -d 
加上"-d"参数是指定top命令的刷新周期，即每隔多少秒刷新一次。默认情况下，top命令的刷新周期是3秒，加上"-d"参数后，可以根据需要自定义刷新周期，比如使用"top -d 5"表示每5秒刷新一次。这样可以更方便地实时监控系统的运行状态。


## 参考资料
* [Docker Best Practices for Python Developers](https://testdriven.io/blog/docker-best-practices/)
* [Fast Docker Builds With Caching (Not Only) For Python](https://towardsdatascience.com/fast-docker-builds-with-caching-for-python-533ddc3b0057)
* [Python 镜像](https://hub.docker.com/_/python)
* [Buildkit, buildx and docker-compose](https://github.com/FernandoMiguel/Buildkit#mounttypecache)
* [Best practices for containerizing Python applications with Docker](https://snyk.io/blog/best-practices-containerizing-python-docker/)
* [Can You Mount a Volume While Building Your Docker Image to Cache Dependencies?](https://vsupalov.com/cache-docker-build-dependencies-without-volume-mounting/)
* [Speed up pip downloads in Docker with BuildKit’s new caching](https://pythonspeed.com/articles/docker-cache-pip-downloads/)
* [ImportError: libgthread-2.0.so.0: cannot open shared object file: No such file or directory when importing cv2 using Docker container](https://stackoverflow.com/questions/62786028/importerror-libgthread-2-0-so-0-cannot-open-shared-object-file-no-such-file-o)
* [python/3.10/slim-bullseye/Dockerfile](https://github.com/docker-library/python/blob/master/3.10/slim-bullseye/Dockerfile)
* [python/generate-stackbrew-library.sh](https://github.com/docker-library/python/blob/3239fa479d4f3010db822a2e562cdfcbd553d200/generate-stackbrew-library.sh)
