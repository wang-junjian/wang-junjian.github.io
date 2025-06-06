---
layout: single
title:  "构建基于PaddlePaddle开发服务镜像"
date:   2022-03-17 00:00:00 +0800
categories: Dockerfile
tags: [PaddlePaddle, Dockerfile, Python, OpenCV, pip]
---

## 构建镜像
```dockerfile
FROM paddlepaddle/paddle:2.2.2-gpu-cuda10.2-cudnn7
LABEL maintainer="wang-junjian@qq.com"

RUN apt-get update && apt-get install libjpeg-dev zlib1g-dev -y

RUN pip install -i https://mirrors.aliyun.com/pypi/simple/ \
    numpy fastapi paddleocr opencv-python

EXPOSE 20000

WORKDIR /inference-serving
ADD . ./

CMD ["python", "app.py"]
```

**官方推荐：非安培架构的GPU，推荐使用CUDA10.2，性能更优。**

## 自己构建 paddlepaddle 镜像
通过官方的 Docker Hub 没有找到 runtime 版本，想着节省几个G的空间，于是考虑自己来构建。

```dockerfile
FROM nvidia/cuda:10.2-runtime-ubuntu18.04
LABEL maintainer="wang-junjian@qq.com"

ENV DEBIAN_FRONTEND=noninteractive

RUN rm /etc/apt/sources.list.d/cuda.list /etc/apt/sources.list.d/nvidia-ml.list && \
    sed -i 's/archive.ubuntu.com/mirrors.aliyun.com/g' /etc/apt/sources.list && \
    apt-get update && \
    apt-get install libgl1-mesa-glx libglib2.0-dev libjpeg-dev zlib1g-dev -y

RUN apt autoremove python3.6 -y && apt-get install python3.8 -y && \
    apt install build-essential python3.8-dev curl -y && \
    curl https://bootstrap.pypa.io/get-pip.py | python3.8 -

RUN ln -s /usr/bin/python3.8 /usr/bin/python

RUN pip3 install paddlepaddle-gpu==2.2.2 -i https://mirror.baidu.com/pypi/simple
```

* 自动化安装 OpenCV
    > 因为 OpenCV 库依赖 tzdata 时区库，默认安装时后等待用户选择才能继续安装，通过设置环境变量 DEBIAN_FRONTEND=noninteractive ，可以自动化安装。
* 安装 OpenCV 依赖的库
    > apt-get install libgl1-mesa-glx libglib2.0-dev
* 安装 Pillow 依赖的库
    > apt-get install libjpeg-dev zlib1g-dev
* 为什么选择 Python3.8 ？
    > 因为程序使用了 asyncio 模块，所以需要 Python3.8 以上的版本。
* 如何在 Ubuntu18.04 系统上安装 Python3.8 ？
    > 基镜像默认安装的 Python3.6 版本，卸载后，使用 apt install python3 安装后还是 Python3.6 版本。所以需要在安装的时候明确指定小版本号，apt install python3.8。
* 如何安装 Python3.8 对应的 pip ？
    > 在安装 pip （apt install python3-pip）时，又是安装的 Python3.6 版本。所以使用下面命令 curl https://bootstrap.pypa.io/get-pip.py | python3.8 -

花了接近2天终于构建完成，少了5个G。开始运行程序了，发现不能用，因为 paddlepaddle 连从 cpu 拷贝数据到 gpu 都需要用到 cudnn。看样子这个深度学习框架还真是。。。
```shell
    self.input_tensor.copy_from_cpu(img)
  File "/usr/local/lib/python3.8/dist-packages/paddle/fluid/inference/wrapper.py", line 35, in tensor_copy_from_cpu
    self.copy_from_cpu_bind(data)
RuntimeError: (PreconditionNotMet) Cannot load cudnn shared library. Cannot invoke method cudnnGetVersion.
  [Hint: cudnn_dso_handle should not be null.] (at /paddle/paddle/fluid/platform/dynload/cudnn.cc:59)
```

## 参考资料
* [飞桨安装](https://www.paddlepaddle.org.cn/install/quick?docurl=/documentation/docs/zh/install/pip/linux-pip.html)
* [How to get PIP for python](https://stackoverflow.com/questions/23191910/how-to-get-pip-for-python)
* [apt-get install tzdata非交互式](https://qastack.cn/programming/44331836/apt-get-install-tzdata-noninteractive)
