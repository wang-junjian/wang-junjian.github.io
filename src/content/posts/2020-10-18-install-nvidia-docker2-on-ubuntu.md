---
layout: single
title:  "在Ubuntu上安装nvidia-docker2"
date:   2020-10-18 00:00:00 +0800
categories: Docker
tags: [Linux, nvidia-docker2, Install]
---

> 在 Ubuntu20.04 上安装 nvidia-docker2

## 配置 apt 仓库(repository)
```shell
$ curl -s -L https://nvidia.github.io/nvidia-docker/gpgkey | \
  sudo apt-key add -
$ distribution=$(. /etc/os-release;echo $ID$VERSION_ID)
$ curl -s -L https://nvidia.github.io/nvidia-docker/$distribution/nvidia-docker.list | \
  sudo tee /etc/apt/sources.list.d/nvidia-docker.list
```

## 更新安装包的列表
```shell
$ sudo apt-get update
```

## 安装 nvidia-docker2
```shell
$ sudo apt-get install -y nvidia-docker2
```

* 安装后可以查看 nvidia runtime 配置
```shell
$ nano /etc/docker/daemon.json
{
    "runtimes": {
        "nvidia": {
            "path": "nvidia-container-runtime",
            "runtimeArgs": []
        }
    }
}
```

## 重启 Docker daemon 服务
```shell
$ sudo systemctl restart docker
```

## 验证
```shell
$ docker run --runtime=nvidia --rm nvidia/cuda nvidia-smi
Unable to find image 'nvidia/cuda:latest' locally
latest: Pulling from nvidia/cuda
d72e567cc804: Pull complete 
0f3630e5ff08: Pull complete 
b6a83d81d1f4: Pull complete 
c5320c4a399a: Pull complete 
f17ccb346705: Pull complete 
568227944b51: Pull complete 
b8d56066ec57: Pull complete 
0094f2e0bb6a: Pull complete 
Digest: sha256:c950a0040c0e4c1503834f2ad2ec08d181af72095673c7500dd24a1aacb84893
Status: Downloaded newer image for nvidia/cuda:latest
Wed Nov  4 01:25:41 2020       
+-----------------------------------------------------------------------------+
| NVIDIA-SMI 450.80.02    Driver Version: 450.80.02    CUDA Version: 11.1     |
|-------------------------------+----------------------+----------------------+
| GPU  Name        Persistence-M| Bus-Id        Disp.A | Volatile Uncorr. ECC |
| Fan  Temp  Perf  Pwr:Usage/Cap|         Memory-Usage | GPU-Util  Compute M. |
|                               |                      |               MIG M. |
|===============================+======================+======================|
|   0  Tesla T4            Off  | 00000000:43:00.0 Off |                    0 |
| N/A   49C    P0    28W /  70W |      0MiB / 15109MiB |      0%      Default |
|                               |                      |                  N/A |
+-------------------------------+----------------------+----------------------+
|   1  Tesla T4            Off  | 00000000:47:00.0 Off |                    0 |
| N/A   50C    P0    27W /  70W |      0MiB / 15109MiB |      0%      Default |
|                               |                      |                  N/A |
+-------------------------------+----------------------+----------------------+
|   2  Tesla T4            Off  | 00000000:8E:00.0 Off |                    0 |
| N/A   48C    P0    27W /  70W |      0MiB / 15109MiB |      0%      Default |
|                               |                      |                  N/A |
+-------------------------------+----------------------+----------------------+
|   3  Tesla T4            Off  | 00000000:92:00.0 Off |                    0 |
| N/A   46C    P0    18W /  70W |      0MiB / 15109MiB |      6%      Default |
|                               |                      |                  N/A |
+-------------------------------+----------------------+----------------------+
                                                                               
+-----------------------------------------------------------------------------+
| Processes:                                                                  |
|  GPU   GI   CI        PID   Type   Process name                  GPU Memory |
|        ID   ID                                                   Usage      |
|=============================================================================|
|  No running processes found                                                 |
+-----------------------------------------------------------------------------+
```

## 参考资料
* [nvidia-docker](https://github.com/NVIDIA/nvidia-docker)
* [Installing nvidia-docker2 on Ubuntu 18.04](https://codepyre.com/2019/01/installing-nvidia-docker2-on-ubuntu-18.0.4/)
