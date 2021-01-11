---
layout: post
title:  "Building ONNX Runtime"
date:   2021-01-08 00:00:00 +0800
categories: Linux
tags: [Linux, Ubuntu, GPU, CUDA, Docker, ONNX, ONNXRuntime]
---

## NVIDIA CUDA
### 单步构建
* 下载onnxruntime源代码
```shell
git clone --recursive https://github.com/microsoft/onnxruntime.git
```

* 拉取容器（编译环境）
```shell
docker pull nvidia/cuda:11.1-cudnn8-devel-ubuntu20.04
```

* 运行容器
```shell
docker run -it --name build-onnxruntime-gpu --runtime nvidia \
    -v $(pwd)/onnxruntime:/onnxruntime -w /onnxruntime \
    nvidia/cuda:11.1-cudnn8-devel-ubuntu20.04
```

* 更新apt镜像源
```shell
sed -i 's/archive.ubuntu.com/mirrors.aliyun.com/g' /etc/apt/sources.list
apt-get update
```

* 安装依赖包
```shell
apt-get install language-pack-en git cmake python3 python3-pip -y
```

* 修改语言环境
```shell
locale-gen en_US.UTF-8
update-locale LANG=en_US.UTF-8
```

* 更新pip镜像源
```shell
pip3 config set global.index-url https://mirrors.aliyun.com/pypi/simple/
```

* 安装numpy
```shell
pip3 install numpy
```

* 编译
```shell
./build.sh --parallel --build_shared_lib --enable_pybind --build_wheel \
    --use_cuda --cudnn_home /usr/include/x86_64-linux-gnu/ \
    --cuda_home /usr/local/cuda/ --config Release
```

* 安装
```shell
pip3 install /onnxruntime/build/Linux/Release/dist/onnxruntime_gpu-1.6.0-cp38-cp38-linux_x86_64.whl
```

* 测试
```shell
python -c "import onnxruntime"
```

### 自动化构建
* [Dockerfile ONNXRuntime GPU]({% post_url 2021-01-08-dockerfile-onnxruntime-gpu %})

## 参考资料
* [Building ONNX Runtime](https://github.com/microsoft/onnxruntime/blob/master/BUILD.md)
* [Docker Containers for ONNX Runtime](https://github.com/microsoft/onnxruntime/blob/master/dockerfiles/README.md)
* [NVIDIA cuDNN Documentation](https://docs.nvidia.com/deeplearning/cudnn/install-guide/index.html)
* [onnxruntime/tools/ci_build/build.py](https://github.com/microsoft/onnxruntime/blob/master/tools/ci_build/build.py)
* [onnxruntime/tools/ci_build/github/linux/docker/scripts/install_ubuntu.sh](https://github.com/microsoft/onnxruntime/blob/master/tools/ci_build/github/linux/docker/scripts/install_ubuntu.sh)
* [编译onnxruntime-gpu 1.6.0 Ubuntu 20.04](https://note.youdao.com/ynoteshare1/index.html?id=f45ac3a74af18806c8672cc83d55f787&type=note)
* [How to install tzdata on a ubuntu docker image?](https://serverfault.com/questions/949991/how-to-install-tzdata-on-a-ubuntu-docker-image)
* [Unable to locate package language-pack-en](https://stackoverflow.com/questions/43708896/unable-to-locate-package-language-pack-en)
* [修改locale](https://wiki.ubuntu.org.cn/修改locale)
* [Locale](https://samwhelp.github.io/note-ubuntu-18.04/read/howto/install/locale/)
* [Debian: debian_frontend=noninteractive](https://linuxhint.com/debian_frontend_noninteractive/)
* [ENV DEBIAN_FRONTEND noninteractive](https://github.com/moby/moby/issues/4032)
* [CUDA / Docker & GPG error](https://github.com/NVIDIA/nvidia-docker/issues/619)
* [Use multi-stage builds](https://docs.docker.com/develop/develop-images/multistage-build/)
* [Dockerfile 中的 multi-stage(多阶段构建)](https://www.cnblogs.com/sparkdev/p/8508435.html)
