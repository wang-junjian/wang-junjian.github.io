---
layout: single
title:  "命令ln"
date:   2021-01-15 00:00:00 +0800
categories: Command
tags: [Linux, ln]
---

> 在文件之间建立链接
```
    ln [OPTION]... [-T] TARGET LINK_NAME
    ln [OPTION]... TARGET
    ln [OPTION]... TARGET... DIRECTORY
    ln [OPTION]... -t DIRECTORY TARGET...
```

## 文件或目录的软链接（类似指针）
### 创建
```shell
ln -s /data/apt-mirror/mirror/archive.ubuntu.com/ubuntu /var/www/ubuntu
```

### 查看
```shell
$ ll /var/www/ubuntu
lrwxrwxrwx 1 root root 49 Jan 15 00:23 /var/www/ubuntu -> /data/apt-mirror/mirror/archive.ubuntu.com/ubuntu/
```

### 删除
1. unlink
```shell
unlink /var/www/ubuntu
```

2. rm
```shell
rm /var/www/ubuntu
```

## 参考资料
* [Linux Delete Symbolic Link ( Softlink )](https://www.cyberciti.biz/faq/linux-remove-delete-symbolic-softlink-command/)
