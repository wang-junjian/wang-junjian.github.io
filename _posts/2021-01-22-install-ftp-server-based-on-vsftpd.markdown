---
layout: post
title:  "基于vsftpd安装FTP服务器"
date:   2021-01-22 00:00:00 +0800
categories: Linux
tags: [Linux, FTP, vsftpd, man]
---

## 安装
```shell
sudo apt-get install vsftpd
```

## 配置文件
```shell
vim /etc/vsftpd.conf
```

## 查看配置文档详细资料
```shell
man vsftpd.conf
```

## 匿名登录
### 修改vsftpd.conf配置项
```shell
anonymous_enable=YES
```

### 重启服务
```shell
sudo systemctl restart vsftpd
```

## 存放资料
```
/srv/ftp
```

## 参考资料
* [How To Set Up Your FTP Server In Linux](https://itsfoss.com/set-ftp-server-linux/)
* [How to setup and use FTP Server in Ubuntu Linux](https://linuxconfig.org/how-to-setup-and-use-ftp-server-in-ubuntu-linux)
