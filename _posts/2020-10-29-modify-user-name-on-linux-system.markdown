---
layout: post
title:  "Linux系统上修改用户名"
date:   2020-10-29 00:00:00 +0800
categories: Linux
tags: [Ubuntu, 用户]
---

> 今天同事安装了一台新的服务器Ubuntu20.04，但用户名和主机名不是我想要的，这里尝试了直接修改Linux文件的方式。

## 登录root用户
```shell
$ su - root
```

## 修改用户信息
### /etc/passwd
```shell
# nano /etc/passwd
username:x:1000:1000:username:/home/username:/bin/bash
```

### /etc/shadow
```shell
# nano /etc/shadow
username:D78/D2/DdYW.FVG.GlqDlZsZ4sK21gSxhDooqWlJtCVl3oUbDUTKtGxBWkCE3E/Oha40kjDrk0pBbsvT4TwtzuH61vYmnJ/GY.bAHWbVv1:18545:0:99999:7:::
```

### /etc/group
```shell
# nano /etc/group
adm:x:4:syslog,username
cdrom:x:24:username
sudo:x:27:username
dip:x:30:username
plugdev:x:46:username
lxd:x:116:username
username:x:1000:
```

### 修改HOME路径
```shell
# mv /home/old_username /home/new_username
```

## 修改主机名
```shell
# nano /etc/hostname
hostname
```

## 修改DNS
```shell
# nano /etc/hosts
127.0.1.1 username
```

## 重启
```shell
# reboot
```

## 验证主机名
* 方法一
```shell
$ hostname
```

* 方法一
```shell
$ uname -n
```
