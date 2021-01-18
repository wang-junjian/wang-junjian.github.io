---
layout: post
title:  "命令wget"
date:   2020-12-21 00:00:00 +0800
categories: Linux
tags: [Linux, Command, wget, Download]
---

## 下载多个文件
* 空格分割
```
wget https://upload.wikimedia.org/wikipedia/commons/1/13/Intel_CPU_Core_i7_6700K_Skylake_perspective.jpg https://images-na.ssl-images-amazon.com/images/I/51iVSqLIBWL._AC_.jpg
```

* 来自文件(-i)
```shell
wget -i urls.txt
```

## 后台下载(-b)
```shell
wget -i urls.txt -b
```

## 指定输出目录
```shell
wget -i urls.txt -P output
```

## 断点续传(-c --continue)
```shell
wget -c https://github.com/goharbor/harbor/releases/download/v2.1.3/harbor-offline-installer-v2.1.3.tgz
```
