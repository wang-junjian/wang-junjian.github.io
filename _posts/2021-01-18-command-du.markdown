---
layout: post
title:  "命令du"
date:   2021-01-18 00:00:00 +0800
categories: Command
tags: [Linux, du]
---

> du - 估计文件空间使用量
```
    -s, --summarize display only a total for each argument
    -h, --human-readable print sizes in human readable format (e.g., 1K 234M 2G)
```

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
