---
layout: post
title:  "在Ubuntu上配置apt镜像源"
date:   2020-11-01 00:00:00 +0800
categories: Linux
tags: [Ubuntu, APT, Mirror]
---

> 在国内使用官方的镜像源安装 Ubuntu 应用非常慢，通常配置国内的镜像源来加快速度，如阿里云。

## 这里以[阿里云镜像源]为例，替换掉官方源。
> 使用 ```http://mirrors.aliyun.com/ubuntu/``` 替换 ```http://cn.archive.ubuntu.com/ubuntu/```，需要查看一下文件 ```/etc/apt/sources.list```，要替换的可能是 ```http://archive.ubuntu.com/ubuntu/```。

### 替换配置
```shell
sed -i 's/cn.archive.ubuntu.com/mirrors.aliyun.com/g' /etc/apt/sources.list
```

```shell
sed -i 's/archive.ubuntu.com/mirrors.aliyun.com/g' /etc/apt/sources.list
```

### 基于配置的镜像源更新安装包的列表
```shell
apt-get update
```

## 国内主要的 Ubuntu 镜像源
* [阿里云](http://mirrors.aliyun.com/ubuntu/) ```http://mirrors.aliyun.com/ubuntu/```
* [网易](http://mirrors.163.com/ubuntu/) ```http://mirrors.163.com/ubuntu/```
* [清华大学](https://mirrors.tuna.tsinghua.edu.cn/ubuntu/) ```https://mirrors.tuna.tsinghua.edu.cn/ubuntu/```
* [中科大](https://mirrors.ustc.edu.cn/ubuntu/) ```https://mirrors.ustc.edu.cn/ubuntu/```

[阿里云镜像源]: https://developer.aliyun.com/mirror/ubuntu

## 参考资料
[What does “sudo apt-get update” do?](https://askubuntu.com/questions/222348/what-does-sudo-apt-get-update-do)