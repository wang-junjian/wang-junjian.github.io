---
layout: single
title:  "基于Apt-Cacher NG创建本地Ubuntu存储库"
date:   2020-10-16 12:00:00 +0800
categories: Linux
tags: [Cache, Ubuntu, apt, apt-cacher-ng]
---

## 安装 Apt-Cacher-NG
```bash
$ sudo apt install apt-cacher-ng
$ sudo systemctl enable apt-cacher-ng
$ sudo service apt-cacher-ng start
```
* [Configuration instructions](http://172.16.33.157:3142)
* [Statistics report and configuration page](http://172.16.33.157:3142/acng-report.html)

## 配置
```bash
$ sudo nano /etc/apt-cacher-ng/acng.conf
```
* CacheDir: /var/cache/apt-cacher-ng
* LogDir: /var/log/apt-cacher-ng

## 查看缓存目录的数据
```bash
$ du -sh /var/cache/apt-cacher-ng/
19M	/var/cache/apt-cacher-ng/
```

## 客户端配置
```bash
$ sudo nano /etc/apt/apt.conf.d/00aptproxy
Acquire::http::Proxy "http://172.16.33.157:3142";
```

## 安装软件
```bash
$ sudo apt install nodejs
```

## 参考资料
* [使用apt-cacher-ng的快速Debian/Ubuntu軟件包緩存代理設置](https://ubuntuqa.com/zh-tw/article/10022.html)
* [使用“ apt-cacher”设置“ apt-cache”服务器](https://cn.compozi.com/setting-up-an-apt-cache-server-using-apt-cacher-ng-ubuntu-14)
* [使用 apt-mirror 和 apt-cacher 创建本地 Ubuntu 仓库](https://blog.fleeto.us/post/build-ubuntu-repository-with-apt-mirror-and-apt-cacher/)
