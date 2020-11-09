---
layout: post
title:  "Linux系统网络配置"
date:   2020-11-06 00:00:00 +0800
categories: Linux
tags: [Ubuntu, 网络]
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
```
