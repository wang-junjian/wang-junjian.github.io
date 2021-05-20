---
layout: post
title:  "在Ubuntu上下载docker和nvidia-docker2离线安装包"
date:   2020-12-02 00:00:00 +0800
categories: Docker
tags: [Ubuntu, Docker, nvidia-docker2, offline]
---

## 选择要依赖的操作系统
```shell
docker run -it -v `pwd`/offline:/offline ubuntu:20.04 bash
```

> 以下是容器内操作

## 进入映射的下载目录
```shell
cd /offline
```

## 下载Docker安装包
```shell
wget https://download.docker.com/linux/ubuntu/dists/focal/pool/stable/amd64/docker-ce_19.03.14~3-0~ubuntu-focal_amd64.deb
wget https://download.docker.com/linux/ubuntu/dists/focal/pool/stable/amd64/docker-ce-cli_19.03.14~3-0~ubuntu-focal_amd64.deb
wget https://download.docker.com/linux/ubuntu/dists/focal/pool/stable/amd64/containerd.io_1.3.9-1_amd64.deb
```

## 下载nvidia-docker2包装包
* 配置安装源
```shell
apt-get install gnupg
curl -s -L https://nvidia.github.io/nvidia-docker/gpgkey | apt-key add -
distribution=$(. /etc/os-release;echo $ID$VERSION_ID)
curl -s -L https://nvidia.github.io/nvidia-docker/$distribution/nvidia-docker.list | tee /etc/apt/sources.list.d/nvidia-docker.list
```

* 分析要下载的依赖安装包
```shell
$ apt-get install -s nvidia-docker2
Reading package lists... Done
Building dependency tree       
Reading state information... Done
The following additional packages will be installed:
  libcap2 libnvidia-container-tools libnvidia-container1 nvidia-container-runtime nvidia-container-toolkit
The following NEW packages will be installed:
  libcap2 libnvidia-container-tools libnvidia-container1 nvidia-container-runtime nvidia-container-toolkit nvidia-docker2
0 upgraded, 6 newly installed, 0 to remove and 0 not upgraded.
Inst libcap2 (1:2.32-1 Ubuntu:20.04/focal [amd64])
Inst libnvidia-container1 (1.3.0-1 NVIDIA CORPORATION <cudatools@nvidia.com>:1.0/bionic [amd64])
Inst libnvidia-container-tools (1.3.0-1 NVIDIA CORPORATION <cudatools@nvidia.com>:1.0/bionic [amd64])
Inst nvidia-container-toolkit (1.3.0-1 NVIDIA CORPORATION <cudatools@nvidia.com>:1.0/bionic [amd64])
Inst nvidia-container-runtime (3.4.0-1 NVIDIA CORPORATION <cudatools@nvidia.com>:1.0/bionic [amd64])
Inst nvidia-docker2 (2.5.0-1 NVIDIA CORPORATION <cudatools@nvidia.com>:1.0/bionic [all])
Conf libcap2 (1:2.32-1 Ubuntu:20.04/focal [amd64])
Conf libnvidia-container1 (1.3.0-1 NVIDIA CORPORATION <cudatools@nvidia.com>:1.0/bionic [amd64])
Conf libnvidia-container-tools (1.3.0-1 NVIDIA CORPORATION <cudatools@nvidia.com>:1.0/bionic [amd64])
Conf nvidia-container-toolkit (1.3.0-1 NVIDIA CORPORATION <cudatools@nvidia.com>:1.0/bionic [amd64])
Conf nvidia-container-runtime (3.4.0-1 NVIDIA CORPORATION <cudatools@nvidia.com>:1.0/bionic [amd64])
Conf nvidia-docker2 (2.5.0-1 NVIDIA CORPORATION <cudatools@nvidia.com>:1.0/bionic [all])
```

* 下载依赖安装包
```shell
apt download libcap2 libnvidia-container-tools libnvidia-container1 nvidia-container-runtime nvidia-container-toolkit nvidia-docker2
```

## 参考资料
* [Linux: Get Ubuntu Distribution Codename](https://stackpointer.io/unix/linux-get-ubuntu-distribution-codename/619/)
* [Index of linux/ubuntu/dists/focal/pool/stable/amd64/](https://download.docker.com/linux/ubuntu/dists/focal/pool/stable/amd64/)
* [E: gnupg, gnupg2 and gnupg1 do not seem to be installed, but one of them is required for this operation](https://stackoverflow.com/questions/50757647/e-gnupg-gnupg2-and-gnupg1-do-not-seem-to-be-installed-but-one-of-them-is-requ)
