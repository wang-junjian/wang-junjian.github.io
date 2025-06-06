---
layout: single
title:  "SSH 登录欢迎信息"
date:   2021-04-09 00:00:00 +0800
categories: Welcome
tags: [ssh, motd, Login, Linux]
---

终端登录时显示给用户的欢迎消息，无论是通过远程 SSH 登录还是直接通过 TTY 或终端，是 ```motd``` 的一部分，即 ```Message Of The Day``` 守护程序。 通过修改 ```/etc/update-motd.d``` 目录中的 ```/etc/motd``` 文件或脚本，可以自定义 motd 消息以适合每个用户或管理员的个性化需求。

## 附加 motd 消息
```shell
sudo sh -c 'echo "Hello World!" > /etc/motd'
```
退出后重新登录
```shell
$ ssh username@hostname
Welcome to Ubuntu 20.04 LTS (GNU/Linux 5.4.0-53-generic x86_64)

 * Documentation:  https://help.ubuntu.com
 * Management:     https://landscape.canonical.com
 * Support:        https://ubuntu.com/advantage

  System information as of Thu 29 Apr 2021 08:16:49 AM UTC

  System load:  7.85                Processes:                1046
  Usage of /:   62.1% of 548.61GB   Users logged in:          2
  Memory usage: 32%                 IPv4 address for docker0: 172.17.0.1
  Swap usage:   0%                  IPv4 address for ens4f0:  172.16.33.66
  Temperature:  52.0 C              IPv4 address for weave:   10.46.0.0

  => There are 16 zombie processes.

 * Pure upstream Kubernetes 1.21, smallest, simplest cluster ops!

     https://microk8s.io/

128 updates can be installed immediately.
0 of these updates are security updates.
To see these additional updates run: apt list --upgradable


*** System restart required ***
Hello World!
Last login: Thu Apr 29 07:55:59 2021 from 192.168.73.141
```

## 修改 motd 消息
可以通过 ```/etc/update-motd.d``` 目录下的脚本自定义。motd 是模块化的，因此分为多个脚本，这些脚本按从最低编号到最高编号的顺序执行，作为脚本文件名前缀的一部分。每个脚本都分配有可执行权限。随意修改以上任何脚本，以使 motd 消息输出更好地适合您的系统环境。

### /etc/update-motd.d/ 目录下的脚本
```
/etc/update-motd.d/
├── 00-header
├── 10-help-text
├── 50-landscape-sysinfo -> /usr/share/landscape/landscape-sysinfo.wrapper
├── 50-motd-news
├── 85-fwupd
├── 90-updates-available
├── 91-release-upgrade
├── 92-unattended-upgrades
├── 95-hwe-eol
├── 97-overlayroot
├── 98-fsck-at-reboot
└── 98-reboot-required
```

### 禁用所有脚本
```shell
sudo chmod -x /etc/update-motd.d/*
```
退出后重新登录
```shell
$ ssh username@hostname
Last login: Thu Apr 29 08:28:25 2021 from 192.168.73.141
```


### 启用 50-landscape-sysinfo
```shell
sudo chmod +x /etc/update-motd.d/50-landscape-sysinfo
```
退出后重新登录
```shell
$ ssh username@hostname

  System information as of Thu 29 Apr 2021 08:40:47 AM UTC

  System load:  8.34                Processes:                1057
  Usage of /:   62.1% of 548.61GB   Users logged in:          2
  Memory usage: 32%                 IPv4 address for docker0: 172.17.0.1
  Swap usage:   0%                  IPv4 address for ens4f0:  172.16.33.66
  Temperature:  53.0 C              IPv4 address for weave:   10.46.0.0

  => There are 16 zombie processes.
Last login: Thu Apr 29 08:36:48 2021 from 192.168.73.141
```

### 自定义显示本地天气
```shell
sudo apt install ansiweather
sudo vim 99-location-weather
```
```shell
#!/bin/sh
echo
ansiweather -l Jinan
```
```shell
sudo chmod +x 99-location-weather
```
退出后重新登录
```shell
$ ssh username@hostname

  System information as of Thu 29 Apr 2021 08:54:40 AM UTC

  System load:  7.95                Processes:                1035
  Usage of /:   62.1% of 548.61GB   Users logged in:          2
  Memory usage: 32%                 IPv4 address for docker0: 172.17.0.1
  Swap usage:   0%                  IPv4 address for ens4f0:  172.16.33.66
  Temperature:  52.0 C              IPv4 address for weave:   10.46.0.0

  => There are 16 zombie processes.

 Weather in Jinan => 23 °C - Wind => 6.55 m/s NW - Humidity => 12 % - Pressure => 1001 hPa 
Last login: Thu Apr 29 08:48:59 2021 from 192.168.73.141
```

## 禁止显示最后登录信息
```shell
sudo vim /etc/ssh/sshd_config
```
增加配置信息
```
PrintLastLog no
```
重启 ssh 服务
```shell
sudo /etc/init.d/ssh restart
```
退出后重新登录
```shell
$ ssh username@hostname

  System information as of Thu 29 Apr 2021 08:54:40 AM UTC

  System load:  7.95                Processes:                1035
  Usage of /:   62.1% of 548.61GB   Users logged in:          2
  Memory usage: 32%                 IPv4 address for docker0: 172.17.0.1
  Swap usage:   0%                  IPv4 address for ens4f0:  172.16.33.66
  Temperature:  52.0 C              IPv4 address for weave:   10.46.0.0

  => There are 16 zombie processes.
```

## 用户登录后禁止显示所有消息
```shell
touch $HOME/.hushlogin
```

## 参考资料
* [How to change welcome message (motd) on Ubuntu 18.04 server](https://linuxconfig.org/how-to-change-welcome-message-motd-on-ubuntu-18-04-server)
* [How can I edit the welcome message when ssh start?](https://serverfault.com/questions/407033/how-can-i-edit-the-welcome-message-when-ssh-start)
* [Change the Terminal Message of the Day in Mac OS X](https://osxdaily.com/2007/01/30/change-the-mac-os-x-terminals-message-of-the-day/)
