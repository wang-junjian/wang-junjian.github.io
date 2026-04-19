---
layout: single
title:  "命令lftp"
date:   2021-11-23 00:00:00 +0800
categories: Command
tags: [Linux, ftp, lftp]
---

## 安装 lftp
```shell
sudo apt-get -y install lftp
```

## 登录 FTP
> lftp [-d] [-e cmd] [-p port] [-u user[,pass]] [site]
```shell
lftp -p 8821 -u sdlrzn download.cambricon.com
```

## 执行内部命令
### 查看 FTP 服务器目录内容
```shell
ls
```

### 下载文件
```shell
get /product/GJD/MLU270/1.7.604/Ubuntu18.04/Driver/neuware-mlu270-driver-dkms_4.9.8_all.deb
```

### 下载目录
> mirror remote local
```shell
mirror MLU270 MLU270
```

### 执行本地系统命令
```shell
local pwd
local ls
local rm -r MLU270
```

## 参考资料
* [lftp • man page](https://helpmanual.io/man1/lftp/)
* [Transfer files using lftp in bash script](https://stackoverflow.com/questions/27635292/transfer-files-using-lftp-in-bash-script)
* [How to install FTP client for Ubuntu 18.04 Bionic Beaver Linux](https://linuxconfig.org/how-to-install-ftp-client-for-ubuntu-18-04-bionic-beaver-linux)
* [FTP client list and installation on Ubuntu 20.04 Linux Desktop/Server](https://linuxconfig.org/ftp-client-list-and-installation-on-ubuntu-20-04-linux-desktop-server)
