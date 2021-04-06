---
layout: post
title:  "命令yum"
date:   2021-04-06 00:00:00 +0800
categories: Command
tags: [Linux, CentOS, yum, Download]
---

## 下载软件及依赖安装包
> 要下载的软件必须是未安装的；不使用downloaddir指定保存目录，下载的软件包将会保存到系统默认缓存目录。
```shell
yum install docker-ce --downloadonly --downloaddir=docker-ce
```

## 列出软件
### 列出当前安装的和可安装的最新版本
```shell
yum list docker-ce 
```
```
已安装的软件包
docker-ce.x86_64                     3:18.09.1-3.el7                     @docker-ce-stable
可安装的软件包
docker-ce.x86_64                     3:20.10.5-3.el7                     docker-ce-stable 
```

### 列出软件的所有版本
```shell
yum list docker-ce --showduplicates
```
```
已安装的软件包
docker-ce.x86_64                 3:18.09.1-3.el7                         @docker-ce-stable
可安装的软件包
docker-ce.x86_64                 17.03.0.ce-1.el7.centos                 docker-ce-stable 
......
docker-ce.x86_64                 18.06.3.ce-3.el7                        docker-ce-stable 
docker-ce.x86_64                 3:18.09.0-3.el7                         docker-ce-stable 
docker-ce.x86_64                 3:18.09.1-3.el7                         docker-ce-stable 
......
docker-ce.x86_64                 3:20.10.4-3.el7                         docker-ce-stable 
docker-ce.x86_64                 3:20.10.5-3.el7                         docker-ce-stable 
```
