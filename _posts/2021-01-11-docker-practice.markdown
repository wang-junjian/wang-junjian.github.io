---
layout: post
title:  "Docker实践"
date:   2021-01-11 00:00:00 +0800
categories: Docker 实践
tags: [Docker, GPU]
---

## 指定显卡(NVIDIA_VISIBLE_DEVICES)
```shell
#指定单张GPU卡
docker run --runtime=nvidia -d -e NVIDIA_VISIBLE_DEVICES=0 gouchicao/yolov5:train
#指定多张GPU卡，多个逗号隔开。
docker run --runtime=nvidia -d -e NVIDIA_VISIBLE_DEVICES=0,1 gouchicao/yolov5:train
#NVIDIA_VISIBLE_DEVICES默认值是all
docker run --runtime=nvidia -d gouchicao/yolov5:train
```

## 重启策略(--restart)
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

* 验证
```shell
#重启Docker Daemon
systemctl restart docker
#查看运行的服务是否存在
docker ps | grep pypiserver
```

## 退出容器后自动删除(--rm)
```shell
docker run --rm busybox:latest
#按Ctrl+d
```

## 通过匹配有规则的名称删除容器
```shell
docker rm -f $(docker ps -a | grep face-service- | awk '{print $1}')
```

## 删除 <none> TAG 镜像
```shell
docker rmi --force $(docker images -q --filter "dangling=true")
```

## 参考资料
* [nvidia-docker2.0 GPU 隔离](https://ld246.com/article/1511781062916)
* [Start containers automatically](https://docs.docker.com/config/containers/start-containers-automatically/)
* [Docker remove <none> TAG images](docker rmi --force $(docker images -q --filter "dangling=true"))
