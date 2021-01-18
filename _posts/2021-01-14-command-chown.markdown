---
layout: post
title:  "命令chown"
date:   2021-01-14 00:00:00 +0800
categories: Linux
tags: [Linux, Command, chown]
---

> 更改文件所有者和组
```
    chown [OPTION]... [OWNER][:[GROUP]] FILE...
```

## 修改文件或目录的所有者
```shell
sudo chown root filename
```
```
-rw-rw-r-- 1 root wjj    0 Jan 15 02:35 filename
```

## 修改文件或目录的组
```shell
sudo chown :root filename
```
```
-rw-rw-r-- 1 root root    0 Jan 15 02:35 filename
```

## 修改文件或目录的所有者和组
```shell
sudo chown wjj:wjj filename
```
```
-rw-rw-r-- 1 wjj:wjj    0 Jan 15 02:35 filename
```

## 修改目录下所有文件和目录的所有者和组
```shell
sudo chown -R root:root test
```

## 参考资料
* [Chown Command in Linux (File Ownership)](https://linuxize.com/post/linux-chown-command/)
