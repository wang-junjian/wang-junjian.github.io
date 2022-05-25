---
layout: post
title:  "Linux系统网络配置"
date:   2019-04-12 00:00:00 +0800
categories: Linux
tags: [Ubuntu, Network]
---

## Ubuntu
### 修改IP
```shell
$ sudo nano /etc/netplan/00-installer-config.yaml
# This is the network config written by 'subiquity'
network:
  ethernets:
    eno1:
      addresses:
      - 172.16.33.1/24
      gateway4: 172.16.33.254
      nameservers: {}
  version: 2
```

### 应用配置
```shell
$ sudo netplan apply
# 推荐使用 debug 参数
$ sudo netplan --debug apply
```

或者

```shell
sudo netplan generate
```

### 验证
```shell
ip a | grep eno1
```
```
2: eno1: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc mq state UP group default qlen 1000
    inet 172.16.33.1/24 brd 172.16.33.255 scope global eno1
```

## 参考资料
* [How to setup a static IP on Ubuntu Server 18.04](https://askubuntu.com/questions/1029531/how-to-setup-a-static-ip-on-ubuntu-server-18-04)
* [How to configure Network Settings in Ubuntu 18.04 Bionic Beaver](https://www.serverlab.ca/tutorials/linux/administration-linux/how-to-configure-network-settings-in-ubuntu-18-04-bionic-beaver/)
* [How To Configure IP Address In Ubuntu 18.04 LTS](https://www.ostechnix.com/how-to-configure-ip-address-in-ubuntu-18-04-lts/)
* [How to configure a static IP address in Ubuntu Server 18.04](https://www.techrepublic.com/article/how-to-configure-a-static-ip-address-in-ubuntu-server-18-04/)
* [How to Configure Network Static IP Address in Ubuntu 18.04](https://www.tecmint.com/configure-network-static-ip-address-in-ubuntu/)
* [Configure Static IP Addresses On Ubuntu 18.04 LTS Server](https://websiteforstudents.com/configure-static-ip-addresses-on-ubuntu-18-04-beta/)
* [How to configure static IP address on Ubuntu 18.04 Bionic Beaver Linux](https://linuxconfig.org/how-to-configure-static-ip-address-on-ubuntu-18-04-bionic-beaver-linux)
* [linux 下 /etc/network/interfaces 作用](https://blog.csdn.net/guoyaoyao1990/article/details/12623729)
* [OpenVINO™ Security Add-on](https://docs.openvino.ai/cn/latest/ovsa_get_started.html)
