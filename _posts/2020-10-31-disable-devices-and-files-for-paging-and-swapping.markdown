---
layout: single
title:  "Linux系统禁用交换分区"
date:   2020-10-31 00:00:00 +0800
categories: Linux
tags: [Ubuntu, swap]
---

> Kubernetes集群为了不影响性能要禁用交换分区。

## 查看交换区信息
```shell
$ swapon --show
```

## 临时禁用 /proc/swaps 中的交换分区（系统重启后会失效）
```shell
$ sudo swapoff -a
```

## 启用 /etc/fstab 中的所有交换区
```shell
$ sudo swapon -a
```

## 禁用交换分区（系统重启后也有效）
```shell
$ sudo sed -i '/swap/s/^/#/' /etc/fstab
```

## 查看是否禁用交换分区（什么也不显示代表成功）
```shell
$ swapon
```

## 参考资料
* [关闭交换区](https://github.com/gouchicao/ai-cloud/blob/master/system/swapoff.md)
