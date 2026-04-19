---
layout: single
title:  "Install TVM from Source"
date:   2022-06-29 00:00:00 +0800
categories: AI Compiler
tags: [TVM, Install]
---

## Ubuntu 下安装依赖包
```shell
sudo apt-get update
sudo apt-get install -y python3 python3-dev python3-setuptools gcc libtinfo-dev zlib1g-dev build-essential cmake libedit-dev libxml2-dev
```

## 获取源代码
```shell
git clone --recursive https://github.com/apache/tvm tvm
```

## 安装 LLVM
TVM 需要 LLVM 用于 CPU 代码生成，使用 LLVM 构建需要 LLVM 4.0 或更高版本。

[LLVM Download Page](https://releases.llvm.org/download.html)
```shell
wget https://github.com/llvm/llvm-project/releases/download/llvmorg-11.0.0/clang+llvm-11.0.0-x86_64-linux-gnu-ubuntu-20.04.tar.xz
tar xvf clang+llvm-11.0.0-x86_64-linux-gnu-ubuntu-20.04.tar.xz
mv clang+llvm-11.0.0-x86_64-linux-gnu-ubuntu-20.04 llvm
```

## 构建共享库
### 创建 build 目录，将 cmake/config.cmake 复制到该目录下。
```shell
mkdir build
cp cmake/config.cmake build
```

### 编辑 build/config.cmake 以自定义编译选项。
* 将 set(USE_CUDA OFF) 更改为 ```set(USE_CUDA ON)``` 以启用 CUDA 后端。 对您要为其构建的其他后端和库（OpenCL、RCOM、METAL、VULKAN ......）执行相同的操作。
* 为了帮助调试，请确保使用 ```set(USE_GRAPH_EXECUTOR ON)``` 和 ```set(USE_PROFILER ON)``` 启用嵌入式图形执行器和调试功能
* 要使用 IR 进行调试，请设置 ```set(USE_RELAY_DEBUG ON)``` 并设置```环境变量 TVM_LOG_DEBUG```。
```shell
# 没有设置会导致编译不通过
export TVM_LOG_DEBUG="ir/transform.cc=1,relay/ir/transform.cc=1"
```
* 修改build/config.cmake添加set(USE_LLVM /path/to/your/llvm/bin/llvm-config)

### 编译
```shell
cd build
cmake ..
make -j64
```

最终编译出两个动态库：```libtvm_runtime.so```, ```libtvm.so```

## 安装 Python 包
### 方法1
编辑 ~/.bashrc 文件，配置环境变量。（对于 TVM 的开发者推荐使用）
```shell
export TVM_HOME=/home/wjj/tvm
export PYTHONPATH=$TVM_HOME/python:${PYTHONPATH}
```

### 方法2
```shell
# install tvm package for the current user
# NOTE: if you installed python via homebrew, --user is not needed during installaiton
#       it will be automatically installed to your user directory.
#       providing --user flag may trigger error during installation in such case.
export MACOSX_DEPLOYMENT_TARGET=10.9  # This is required for mac to avoid symbol conflicts with libstdc++
cd python; python setup.py install --user; cd ..
```

### 依赖的安装包
必要的依赖
```shell
pip3 install --user numpy decorator attrs
```

想要使用 RPC Tracker
```shell
pip3 install --user tornado
```

想要使用 auto-tuning module
```shell
pip3 install --user tornado psutil xgboost cloudpickle
```

## 验证安装成功
```shell
python -c "import tvm"
```

## 参考资料
* [TVM GitHub](https://github.com/apache/tvm)
* [Apache TVM Documentation](https://tvm.apache.org/docs/index.html)
* [Apache TVM Documentation 中文](https://chinese.tvm.wiki/index.html)
* [Install TVM from Source](https://tvm.apache.org/docs/install/from_source.html)
* [The Deep Learning Compiler: A Comprehensive Survey](https://arxiv.org/pdf/2002.03794v4.pdf)
* [深度学习编译器整理](https://zhuanlan.zhihu.com/p/382015459)
* [一篇关于深度学习编译器架构的综述论文](https://zhuanlan.zhihu.com/p/139552817)
* [Getting Starting using TVMC Python: a high-level API for TVM](https://tvm.apache.org/docs/tutorial/tvmc_python.html)
* [Compile ONNX Models](https://tvm.apache.org/docs/how_to/compile_models/from_onnx.html)
* [Discuss TVM](https://discuss.tvm.apache.org/)
* [Check failed: pval != nullptr == false: Cannot allocate memory symbolic tensor shape [? ? ?]](https://discuss.tvm.apache.org/t/check-failed-pval-nullptr-false-cannot-allocate-memory-symbolic-tensor-shape/8646)
* [How to Deploy TVM Modules](https://github.com/apache/tvm/tree/main/apps/howto_deploy)
* [TVM编译遇到的那些坑](https://www.jianshu.com/p/2bf052570aff)
* [ubuntu18.04 TVM编译安装](https://www.cnblogs.com/wangtianning1223/p/14250470.html)
