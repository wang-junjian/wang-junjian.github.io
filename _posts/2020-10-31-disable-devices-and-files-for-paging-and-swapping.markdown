---
layout: post
title:  "Linux系统禁用交换分区"
date:   2020-10-31 00:00:00 +0800
categories: Environment
tags: [Linux, Ubuntu, Swap]
---

> Kubernetes集群为了不影响性能要禁用交换分区。

## 临时禁用交换分区（系统重启后会失效）
```shell
$ sudo swapoff -a
```

## 一直禁用交换分区（系统重启后也有效）
```shell
$ sudo sed -i '/swap/s/^/#/' /etc/fstab
```

## 查看是否禁用交换分区（什么也不显示代表成功）
```shell
$ swapon
```
