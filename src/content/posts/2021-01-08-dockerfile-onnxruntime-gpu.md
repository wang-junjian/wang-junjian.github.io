---
layout: single
title:  "Dockerfile ONNXRuntime GPU"
date:   2021-01-08 00:00:00 +0800
categories: Docker
tags: [Docker, Dockerfile, ONNXRuntime, CUDA]
---

```dockerfile
FROM nvidia/cuda:11.1-cudnn8-devel-ubuntu20.04 AS builder
LABEL maintainer="wang-junjian@qq.com"

#E: Failed to fetch https://developer.download.nvidia.cn/compute/cuda/repos/ubuntu2004/x86_64/by-hash/SHA256/f10fc2a7a0d072ddcf141af2ef28f1e97ab4b3a5c3b9bbe34ed845d174fb4979  404  Not Found [IP: 61.155.167.2 443]
#E: Some index files failed to download. They have been ignored, or old ones used instead.
RUN rm /etc/apt/sources.list.d/cuda.list /etc/apt/sources.list.d/nvidia-ml.list

RUN sed -i 's/archive.ubuntu.com/mirrors.aliyun.com/g' /etc/apt/sources.list && \
    apt-get update && \
    apt-get install language-pack-en git python3 python3-pip -y && \
    DEBIAN_FRONTEND=noninteractive apt-get install cmake -y && \
    locale-gen en_US.UTF-8 && \
    update-locale LANG=en_US.UTF-8

RUN pip3 install numpy -i https://mirrors.aliyun.com/pypi/simple/

RUN git clone --recursive https://github.com/microsoft/onnxruntime.git
WORKDIR /onnxruntime
RUN ./build.sh --parallel --build_shared_lib --enable_pybind --build_wheel \
    --use_cuda --cudnn_home /usr/include/x86_64-linux-gnu/ \
    --cuda_home /usr/local/cuda/ --config Release --skip_tests


FROM nvidia/cuda:11.1-cudnn8-runtime-ubuntu20.04
LABEL maintainer="wang-junjian@qq.com"

RUN rm /etc/apt/sources.list.d/cuda.list /etc/apt/sources.list.d/nvidia-ml.list && \
    sed -i 's/archive.ubuntu.com/mirrors.aliyun.com/g' /etc/apt/sources.list && \
    apt-get update && \
    DEBIAN_FRONTEND=noninteractive apt-get install libgl1-mesa-glx libglib2.0-dev -y && \
    apt-get install python3 python3-pip -y

RUN pip3 config set global.index-url https://mirrors.aliyun.com/pypi/simple/ && \
    pip3 install numpy opencv-python

ARG ONNXRUNTIME_INSTALL_PACKAGE=onnxruntime_gpu-1.6.0-cp38-cp38-linux_x86_64.whl
COPY --from=builder /onnxruntime/build/Linux/Release/dist/$ONNXRUNTIME_INSTALL_PACKAGE /tmp
RUN pip3 install /tmp/$ONNXRUNTIME_INSTALL_PACKAGE
```
