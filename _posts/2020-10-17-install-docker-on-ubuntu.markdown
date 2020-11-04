---
layout: post
title:  "在Ubuntu上安装Docker"
date:   2020-10-17 00:00:00 +0800
categories: Docker
tags: [Linux, Docker, Install]
---

> 在 Ubuntu20.04 上安装 Docker

## 安装 Docker
```shell
$ curl -fsSL https://get.docker.com | sh -
```
* [Install Docker Engine on Ubuntu（官方安装文档）](https://docs.docker.com/engine/install/ubuntu/)

## 把用户名(username)加入到 ```docker``` 组，这样以后在非 ```root``` 用户下不用每次操作都 ```sudo```。
```shell
$ sudo usermod -aG docker username
```

## 需要退出用户会话，重新登录方可生效。
