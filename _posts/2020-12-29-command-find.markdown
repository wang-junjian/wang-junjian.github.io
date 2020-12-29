---
layout: post
title:  "命令find"
date:   2020-12-29 00:00:00 +0800
categories: Linux
tags: [Linux, Command, find, delete]
---

## 查找文件
* -name 或 -iname(大小写不敏感)
```shell
find . -name "*.pyc"
```

## 删除文件
* -type
```shell
find . -name ".DS_Store" -type f -delete
find . -name "._*" -type f -delete
```

* xargs
```shell
find . -name ".DS_Store" | xargs rm -rf
find . -name "._*" | xargs rm -rf
```

## 列出文件或目录
* 列出指定目录的所有文件和目录路径
```shelll
find .
```

* 列出指定目录的所有文件
```shelll
find . -type f
```

* 列出指定目录的所有目录路径
```shelll
find . -type d
```

## 参考资料
* [How to use FIND in Linux](https://opensource.com/article/18/4/how-use-find-linux)
* [Find Command in Linux (Find Files and Directories)](https://linuxize.com/post/how-to-find-files-in-linux-using-the-command-line/)
