---
layout: post
title:  "Dockerfile OpenCV4 Ubuntu20.04"
date:   2021-01-09 00:00:00 +0800
categories: Docker
tags: [Docker, Dockerfile, OpenCV4, Ubuntu]
---

## Dockerfile
```dockerfile
FROM ubuntu:20.04
LABEL maintainer="wang-junjian@qq.com"

#auto install tzdata(opencv depend)
ENV DEBIAN_FRONTEND=noninteractive

RUN sed -i s@/archive.ubuntu.com/@/mirrors.aliyun.com/@g /etc/apt/sources.list
RUN apt-get update && apt-get install -y \
    python3 python3-pip \
    libglib2.0-dev libgl1-mesa-glx \
    && rm -rf /var/lib/apt/lists/*

RUN ln -s /usr/bin/python3 /usr/bin/python && \
    ln -s /usr/bin/pip3 /usr/bin/pip
RUN pip install --no-cache-dir -i https://mirrors.aliyun.com/pypi/simple/ \
    opencv-python opencv-contrib-python

#set your localtime
RUN ln -fs /usr/share/zoneinfo/Asia/Shanghai /etc/localtime

WORKDIR /

CMD bash
```

## Pull
```shell
docker pull gouchicao/opencv4:ubuntu20.04
```

## FAQ
1. ImportError: libGL.so.1: cannot open shared object file: No such file or directory
```py
>>> import cv2
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
  File "/usr/local/lib/python3.8/dist-packages/cv2/__init__.py", line 5, in <module>
    from .cv2 import *
ImportError: libGL.so.1: cannot open shared object file: No such file or directory
```
> apt install -y libgl1-mesa-glx

2. ImportError: libgthread-2.0.so.0: cannot open shared object file: No such file or directory
```py
>>> import cv2
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
  File "/usr/local/lib/python3.8/dist-packages/cv2/__init__.py", line 5, in <module>
    from .cv2 import *
ImportError: libgthread-2.0.so.0: cannot open shared object file: No such file or directory
```
> apt install -y libglib2.0-dev

3. 需要交互，不能自动化安装。
```shell
apt install libglib2.0-dev 
Setting up tzdata (2020f-0ubuntu0.20.04.1) ...
debconf: unable to initialize frontend: Dialog
debconf: (No usable dialog-like program is installed, so the dialog based frontend cannot be used. at /usr/share/perl5/Debconf/FrontEnd/Dialog.pm line 76.)
debconf: falling back to frontend: Readline
Configuring tzdata
#------------------
Please select the geographic area in which you live. Subsequent configuration questions will narrow this down by presenting a list of cities, representing the time zones in which they are located.
#1. Africa  2. America  3. Antarctica  4. Australia  5. Arctic  6. Asia  7. Atlantic  8. Europe  9. Indian  10. Pacific  11. SystemV  12. US  13. Etc
Geographic area: 
```
> ENV DEBIAN_FRONTEND=noninteractive
