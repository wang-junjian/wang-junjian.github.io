---
layout: post
title:  "命令ls"
date:   2020-12-20 00:00:00 +0800
categories: Command
tags: [Linux, ls]
---

## 可读的方式显示文件大小
```bash
# -h, --human-readable with -l and/or -s, print human readable sizes (e.g., 1K 234M 2G)
ls -lh
ll -h
```

## 显示目录的所有子目录的内容
```bash
# -R, --recursive list subdirectories recursively
ls -lR
ll -R
```

## 按时间进行排序
### 按时间降序显示当前目录
```bash
# -l use a long listing format; -t sort by modification time, newest first
ls -lt
ll -t
```

### 按时间升序显示当前目录
```bash
# -r --reverse reverse order while sorting
ls -lrt
ll -rt
```

## 按大小进行排序
### 按大小降序显示当前目录
```bash
# -S sort by file size, largest first
ls -lS
ll -S
```

### 按大小升序显示当前目录
```bash
ls -lrS
ll -rS
```

## 统计目录下文件数量
### 统计当前目录下的文件数量
```bash
ls -l | grep "^-" | wc -l
```

### 统计当前目录下的目录数量
```bash
ls -l | grep "^d" | wc -l
```

### 统计当前目录下（包含子目录）的文件数量
```bash
ls -lR | grep "^-" | wc -l
```

### 统计当前目录下（包含子目录）的目录数量
```bash
ls -lR | grep "^d" | wc -l
```
