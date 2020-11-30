---
layout: post
title:  "ssh允许使用密码进行root登录"
date:   2020-11-30 00:00:00 +0800
categories: Linux
tags: [Linux, root, ssh, systemctl, service, init.d, sed]
---

> 安装了Ubuntu系统后，默认ssh不允许使用密码进行root登录，通过如何配置可以实现允许。

## 登录root
```shell
$ su - root
```

## 查看ssh配置文件中的PermitRootLogin项
```shell
$ nano /etc/ssh/sshd_config
# Authentication:

#LoginGraceTime 2m
#PermitRootLogin prohibit-password
#StrictModes yes
#MaxAuthTries 6
#MaxSessions 10
```

## 修改ssh配置文件中的PermitRootLogin项：**PermitRootLogin yes**
```shell
$ sed -i 's/#PermitRootLogin prohibit-password/PermitRootLogin yes/g' /etc/ssh/sshd_config
```

## 查看ssh配置文件中的PermitRootLogin项
```shell
nano /etc/ssh/sshd_config
# Authentication:

#LoginGraceTime 2m
PermitRootLogin yes
#StrictModes yes
#MaxAuthTries 6
#MaxSessions 10
```

## 重启sshd服务
* systemctl
```shell
$ systemctl restart sshd
```

* service
```shell
$ service ssh restart
```

* init.d
```shell
$ /etc/init.d/ssh restart
```

## 参考资料
* [SSH error: Permission denied, please try again](https://askubuntu.com/questions/315377/ssh-error-permission-denied-please-try-again)
* [ssh连接出现Permission denied, please try again.](https://blog.csdn.net/weixin_42551369/article/details/88946622)
* [Linux 服务管理两种方式service和systemctl](https://www.cnblogs.com/shijingjing07/p/9301590.html)
