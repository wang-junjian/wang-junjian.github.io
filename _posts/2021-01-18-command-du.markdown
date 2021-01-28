---
layout: post
title:  "命令du"
date:   2021-01-18 00:00:00 +0800
categories: Linux
tags: [Linux, Command, du]
---

## 查看当前文件夹所有文件占用的空间
```shell
du -sh
```
```
15G	.
```

## 查看当前文件夹下的一级目录和文件占用的空间
```shell
du -sh *
```
```
14G	ailab
178M	software
4.0K	test.txt
33M	tmp
```
