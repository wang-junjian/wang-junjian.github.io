---
layout: single
title:  "开启SSH服务"
date:   2018-12-26 08:00:00 +0800
categories: Linux
tags: [ssh, service]
---

## Ubuntu

* 安装、卸载SSH服务
```bash
sudo apt-get install openssh-server
sudo apt-get remove openssh-server
```

* 启动、停止、重启SSH服务
```bash
sudo service ssh start
sudo service ssh stop
sudo service ssh restart
```

* 查询SSH服务状态
```bash
service ssh status
```

* 配置文件（更改配置需要重启SSH服务）
```bash
sudo vi /etc/ssh/sshd_config
```

* 连接SSH服务
```bash
ssh username@ip -p 22
```

* 设置、移除SSH服务开机自启动
```bash
sudo update-rc.d ssh defaults
sudo update-rc.d ssh remove
```

* 查看SSH服务设置的自启动
```bash
ls /etc/rc*
......
......
ls -l /etc/rc2.d/S02ssh
    lrwxrwxrwx 1 root root 13 12月 25 16:33 /etc/rc2.d/S02ssh -> ../init.d/ssh
```

## 参考资料
* [Ubuntu 16.04开启SSH服务](https://www.cnblogs.com/EasonJim/p/7189509.html)
* [Ubuntu如何安装ssh服务并开启root用户ssh权限](https://jingyan.baidu.com/article/09ea3ede459728c0aede39f1.html)
* [ubuntu的ssh是怎么自动启动的？](https://bbs.csdn.net/topics/350230361)