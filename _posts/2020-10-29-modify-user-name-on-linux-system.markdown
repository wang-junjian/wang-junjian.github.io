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
### /etc/hostname
```shell
# nano /etc/hostname
hostname
```

### 修改DNS
```shell
# nano /etc/hosts
127.0.1.1 username
```

### 重启
```shell
# reboot
```

### 验证主机名
* 方法一
```shell
$ hostname
```

* 方法一
```shell
$ uname -n
```

## 增加用户
```shell
# useradd -m -s /bin/bash -g ai -G sudo,docker username

# id username
uid=1005(username) gid=1000(ai) groups=1000(ai),27(sudo),998(docker)
```

## 修改用户
```shell
# usermod -l new_username -d /home/new_username old_username
# mv /home/old_username /home/new_username
```

## 删除用户
-r 删除/home/username
```shell
# userdel -rf username
```

## 增加组
```shell
# usermod -a -G group_name username
```
------

## 下面使用命令的方式来实现更改组名、用户名、HOME路径（如果这个用户登录不能修改成功）
```shell
# usermod -l new_username -d /home/new_username old_username
# groupmod -n new_groupname old_groupname
```
* [Change the Username and Hostname on Ubuntu](https://www.hepeng.me/changing-username-and-hostname-on-ubuntu/)
