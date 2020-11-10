---
layout: post
title:  "配置Docker镜像源"
date:   2020-11-02 00:00:00 +0800
categories: Docker
tags: [Linux, Mirror]
---

> 加速 Docker Hub 镜像拉取速度。

## 这里以阿里云镜像源：```https://75oltije.mirror.aliyuncs.com``` 为例进行配置。
```shell
$ sudo nano /etc/docker/daemon.json
{
  "registry-mirrors": ["https://75oltije.mirror.aliyuncs.com"]
}
```

```shell
## 另一种方法()
cat << EOF >/etc/docker/daemon.json
{
  "registry-mirrors": ["https://75oltije.mirror.aliyuncs.com"]
}
EOF
```

## 重启 Docker daemon 服务
```shell
$ sudo systemctl restart docker
```

## 参考资料
* [DaoCloud Docker 镜像站](https://www.daocloud.io/mirror)
* [Docker Hub 公有镜像在国内拉取加速配置](https://developer.aliyun.com/article/696286)
* [Docker Hub 配置国内加速器](https://blog.csdn.net/qq_26626029/article/details/106788617)
