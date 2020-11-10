---
layout: post
title:  "Linux系统网络配置"
date:   2019-04-12 00:00:00 +0800
categories: Linux
tags: [Ubuntu, Network]
---

## Ubuntu
* 修改IP
```shell
$ sudo nano /etc/netplan/00-installer-config.yaml
# This is the network config written by 'subiquity'
network:
  ethernets:
    eno1:
      addresses:
      - 172.16.33.1/24
      gateway4: 172.16.33.254
      nameservers: {}
  version: 2
```

* 应用配置
```shell
$ sudo netplan apply
# 推荐使用 debug 参数
$ sudo netplan --debug apply
```
