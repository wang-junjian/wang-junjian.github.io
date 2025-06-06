---
layout: single
title:  "构建基于 ONNXRuntime 的推理服务"
date:   2022-02-09 00:00:00 +0800
categories: AI
tags: [ONNX, ONNXRuntime, GPU, CUDA, Docker, Dockerfile, pip]
---

## 构建 ONNXRuntime-GPU 镜像
### 编写 requirements.txt
```shell
$ vim requirements.txt
```
```
flask
connexion[swagger-ui]
connexion
gunicorn
numpy
opencv-python
scikit-image
psutil
pynvml
onnxruntime-gpu
```

### 编写 Dockerfile
需要带 cudnn 库的 CUDA 作为基镜像
```shell
$ vim Dockerfile
```
```dockerfile
FROM nvidia/cuda:11.4.0-cudnn8-runtime-ubuntu20.04
LABEL maintainer="wang-junjian@qq.com"

RUN rm /etc/apt/sources.list.d/cuda.list /etc/apt/sources.list.d/nvidia-ml.list && \
    sed -i 's/archive.ubuntu.com/mirrors.aliyun.com/g' /etc/apt/sources.list && \
    apt-get update && \
    DEBIAN_FRONTEND=noninteractive apt-get install libgl1-mesa-glx libglib2.0-dev -y && \
    apt-get install python3 python3-pip -y

COPY requirements.txt /tmp/requirements.txt

RUN pip3 config set global.index-url https://mirrors.aliyun.com/pypi/simple/ && \
    pip3 install --upgrade --default-timeout=100000 -r /tmp/requirements.txt
RUN ln -s /usr/bin/python3 /usr/bin/python
```

### 构建镜像
```shell
docker build -t gouchicao/onnxruntime:1.10-cuda11.4-ubuntu20.04 .
```

### 测试镜像
#### 运行容器
```shell
docker run --runtime=nvidia --rm -it -v /home/wjj/inference-serving:/inference-serving gouchicao/onnxruntime:1.10-cuda11.4-ubuntu20.04 bash
```

#### 运行 Python 脚本
```shell
$ python
```
```py
import onnxruntime as ort
model_path='/inference-serving/models/running/onnx_files/yolov5_r4_person.onnx'
providers = [
    ('CUDAExecutionProvider', {
        'device_id': 0,
        'arena_extend_strategy': 'kNextPowerOfTwo',
        'gpu_mem_limit': 2 * 1024 * 1024 * 1024,
        'cudnn_conv_algo_search': 'EXHAUSTIVE',
        'do_copy_in_default_stream': True,
    }),
    'CPUExecutionProvider',
]
session = ort.InferenceSession(model_path, providers=providers)
```

### 发布镜像
```shell
docker push gouchicao/onnxruntime:1.10-cuda11.4-ubuntu20.04
```

## 基于 ONNXRuntime-GPU 镜像构建推理服务
### 编写 Dockerfile
```shell
$ vim Dockerfile
```
```dockerfile
FROM gouchicao/onnxruntime:1.10-cuda11.4-ubuntu20.04
LABEL maintainer="wang-junjian@qq.com"

WORKDIR /inference-serving

ADD . ./

ENV CUDA_VISIBLE_DEVICES=0
ENV MODEL_YAML_FILENAME=yolov5_person.yaml

ARG PORT=6666
ENV INFERENCE_SERVING_PORT=$PORT
EXPOSE $PORT

CMD ["python", "app/main.py"]
```

### 构建镜像
```shell
docker build -t inference-serving .
```

### 测试推理服务
```shell
docker run --runtime=nvidia --rm -t -p 12345:6666 -e MODEL_YAML_FILENAME=yolov5_sign.yaml inference-serving
```
