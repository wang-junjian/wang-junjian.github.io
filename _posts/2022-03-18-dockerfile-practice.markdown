---
layout: post
title:  "Dockerfile实践"
date:   2022-03-18 00:00:00 +0800
categories: 实践 Dockerfile
tags: [Dockerfile, Python, OpenCV, pip, localtime, timezone]
---

## Python 开发环境
### 构建 Python, OpenCV 开发环境的镜像
```dockerfile
FROM ubuntu:20.04
LABEL maintainer="wang-junjian@qq.com"

# 设置 apt 源（阿里云），设置完必须 update。
RUN sed -i 's/archive.ubuntu.com/mirrors.aliyun.com/g' /etc/apt/sources.list && \
    apt update

RUN apt install curl vim -y

# 安装 Python 和 pip，通过安装 build-essential, python3-dev 可以在安装 whl 依赖库需要编译时用到。
RUN apt install build-essential python3 python3-dev -y && \
    ln -s /usr/bin/python3 /usr/bin/python && \
    curl https://bootstrap.pypa.io/get-pip.py | python3 -

# 设置 pypi 源（阿里云）
RUN pip config set global.index-url https://mirrors.aliyun.com/pypi/simple/

# 安装 OpenCV，通过关闭交互变量，让安装自动化。
RUN DEBIAN_FRONTEND=noninteractive apt install libgl1-mesa-glx libglib2.0-dev -y && \
    pip install numpy opencv-python
```

* DEBIAN_FRONTEND
* 加速
    * apt 源
    * pypi 源
* 安装
    * gcc
    * pip
    * Python
    * OpenCV

构建镜像
```shell
docker build -t gouchicao/ubuntu:20.04-python3-opencv4 .
```

### 构建 Python 应用的镜像
```dockerfile
FROM gouchicao/ubuntu:20.04-python3-opencv4
LABEL maintainer="wang-junjian@qq.com"

WORKDIR /code

COPY requirements.txt /code/requirements.txt
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

COPY . /code

CMD ["python", "main.py"]
```

* requirements.txt 优先把 requirements.txt 文件拷贝到镜像中，然后安装依赖库，最后把程序代码拷贝进镜像中，主要是代码变动的频率比库变动的频率高，这样避免了每次都要重新安装依赖的库，加快构建镜像的速度。

## 系统
### 指定本地时区
```dockerfile
ARG TIME_ZONE=Asia/Shanghai
RUN DEBIAN_FRONTEND=noninteractive apt-get install tzdata -y && \
    ln -fs /usr/share/zoneinfo/$TIME_ZONE /etc/localtime && \
    echo $TIME_ZONE > /etc/timezone
```
* /etc/localtime 修改时区
* /etc/timezone  描述本机所属时区
* timedatectl    显示修改好的效果
参考资料
* [linux时区（/etc/localtime和/etc/timezone）](https://www.malaoshi.top/show_1EF5oe42EiBO.html)
* [在 Linux 中查看你的时区](https://linux.cn/article-7970-1.html)
