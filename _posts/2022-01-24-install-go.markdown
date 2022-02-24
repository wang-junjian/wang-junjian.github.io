---
layout: post
title:  "安装Go"
date:   2022-01-24 00:00:00 +0800
categories: Go
tags: [Install, Proxy, source]
---

## 安装
到 [https://golang.google.cn/dl/](https://golang.google.cn/dl/) 下载对应操作系统的安装包。
```shell
wget https://golang.google.cn/dl/go1.17.7.linux-amd64.tar.gz
sudo tar -C /usr/local/ -xzf go1.17.7.linux-amd64.tar.gz
```

### Ubuntu
```shell
sudo apt install golang
```

## 配置
```shell
$ sudo vim /etc/profile
```

```conf
PATH=$PATH:/usr/local/go/bin

#Go代理配置(解决墙的问题)
export GOPROXY=https://goproxy.cn,direct
export GO111MODULE=on
```

```shell
$ source /etc/profile
```

## 查看 Go 版本信息
```shell
$ go version
go version go1.17.7 linux/amd64
```

## 参考资料
* [Go 语言环境安装](https://www.runoob.com/go/go-environment.html)
