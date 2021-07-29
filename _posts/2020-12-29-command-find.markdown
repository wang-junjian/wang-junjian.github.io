---
layout: post
title:  "命令find"
date:   2020-12-29 00:00:00 +0800
categories: Command
tags: [Linux, find, delete, DS_Store]
---

## 查找文件
### -name 或 -iname(大小写不敏感)
```shell
find . -name "*.pyc"
```

### -m(最近多长时间修改)
```
min, 分钟
time, 哪天 0(24小时) 1(24-48小时) 2(48-72小时)
```
* 显示 /var/log 目录下最近 10分钟内修改的文件
```shell
$ find /var/log -mmin -10
/var/log/messages
```

* 以详细信息显示 /var/log 目录下最近 24小时内修改的文件
```shell
$ find /var/log -mtime 0 -ls
 33575669      4 drwxr-xr-x  15  root     root         4096 7月 29 06:33 /var/log
 34131780    164 -rw-------   1  root     root       166061 7月 29 10:20 /var/log/messages
```

* 显示 /var/log 目录下最近 [0 - 24小时] 修改的文件
```shell
find /var/log -mtime -1
```

* 显示 /var/log 目录下最近 [24 - 48小时] 修改的文件
```shell
find /var/log -mtime 1
```

* 显示 /var/log 目录下最近 [48 - ] 修改的文件
```shell
find /var/log -mtime +1
```

### -size(文件大小)
* 显示当前目录下超过 40M的文件
```shell
$ find . -size +40M
./kubectl
```

* 以详细信息显示当前目录下超过 40M的文件
```shell
$ find . -size +40M -ls
 17180574  42480 -rwxr-xr-x   1  root     root      43499520 3月 11  2020 ./kubectl
```

* 显示当前目录下超过 40M的文件，通过 ls 命令来显示结果。
```shell
$ find . -size +40M -exec ls -lh {} \;
-rwxr-xr-x 1 root root 42M 3月  11 2020 ./kubectl
```

## 删除文件
### -type
```shell
find . -name ".DS_Store" -type f -delete
find . -name "._*" -type f -delete
```

### -exec
```shell
find . -name ".DS_Store" -exec rm {} \;
```

### xargs
```shell
find . -name ".DS_Store" | xargs rm -rf
```

## 列出文件或目录
### 列出指定目录的所有文件和目录路径
```shelll
find .
```

### 列出指定目录的所有文件
```shelll
find . -type f
```

### 列出指定目录的所有目录路径
```shelll
find . -type d
```

## 参考资料
* [How to use FIND in Linux](https://opensource.com/article/18/4/how-use-find-linux)
* [Find Command in Linux (Find Files and Directories)](https://linuxize.com/post/how-to-find-files-in-linux-using-the-command-line/)
* [Linux系统下用find命令查找最近修改过的文件](https://www.cnblogs.com/hechunhua/p/4860544.html)
