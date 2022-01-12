---
layout: post
title:  "Docker实践"
date:   2021-01-11 00:00:00 +0800
categories: Docker 实践
tags: [Docker, GPU, none, xargs, awk]
---

## 安装与卸载
### 安装
* 快速安装
```shell
curl -fsSL https://get.docker.com | sh -
```

* [Install Docker Engine](https://docs.docker.com/engine/install/)

### 卸载
* apt
```shell
apt-get remove --auto-remove docker
```

* yum
```shell
yum remove docker docker-common docker-selinux docker-engine
```

## 指定显卡(NVIDIA_VISIBLE_DEVICES)
```shell
#指定单张GPU卡
docker run --runtime=nvidia -d -e NVIDIA_VISIBLE_DEVICES=0 gouchicao/yolov5:train
#指定多张GPU卡，多个逗号隔开。
docker run --runtime=nvidia -d -e NVIDIA_VISIBLE_DEVICES=0,1 gouchicao/yolov5:train
#NVIDIA_VISIBLE_DEVICES默认值是all
docker run --runtime=nvidia -d gouchicao/yolov5:train
```

## 重启策略
### 方法
1. 启动容器时通过参数指定
```shell
#如果容器停止总是重新启动。如果手动停止，则仅在Docker守护程序重启或手动重启容器本身时才重启。 
docker run -d --restart=always --name pypiserver -p 8080:8080 \
    -v /data/pypi-packages/:/data/packages
```

2. 容器启动后，通过命令来更新。
```shell
docker run -d --name pypiserver -p 8080:8080 \
    -v /data/pypi-packages/:/data/packages
docker update --restart=always pypiserver
```

### 验证
```shell
#重启Docker Daemon
systemctl restart docker
#查看运行的服务是否存在
docker ps | grep pypiserver
```

## 镜像
### 删除 TAG 为 none 的所有镜像
```shell
docker rmi --force $(docker images -q --filter "dangling=true")
```

### 重新构建镜像（不使用缓存）
```shell
docker build --no-cache -t name:tag . 
```

## 容器
### 退出容器后自动删除
```shell
docker run --rm busybox:latest
```

### 删除状态为 Exited 的容器
```shell
docker rm -f $(docker ps -qa --filter status=exited)
```

### 删除状态为 Created 的容器
```shell
docker ps -qa --filter status=created | xargs docker rm
```

### 通过匹配有规则的名称删除容器
```shell
docker rm -f $(docker ps -a | grep face-service- | awk '{print $1}')
```

## FAQ
* docker: Error response from daemon: endpoint with name tuguan-database-pc already exists in network bridge.
```shell
#查看
docker network inspect bridge | grep tuguan-database-pc
#断开连接
docker network disconnect --force bridge tuguan-database-pc
```

## 参考资料
* [nvidia-docker2.0 GPU 隔离](https://ld246.com/article/1511781062916)
* [Start containers automatically](https://docs.docker.com/config/containers/start-containers-automatically/)
* [Docker remove none TAG images](https://stackoverflow.com/questions/33913020/docker-remove-none-tag-images)
