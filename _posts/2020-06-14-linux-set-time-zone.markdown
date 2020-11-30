---
layout: post
title:  "Linux设置时区"
date:   2020-06-14 00:00:00 +0800
categories: Linux
tags: [Linux, timezone]
---

## 查看系统的时区
```shell
$ ll /etc/localtime
lrwxrwxrwx. 1 root root 35 2月  18 2020 /etc/localtime -> ../usr/share/zoneinfo/UTC
```

## 列出有效的时区
```shell
$ timedatectl list-timezones
Africa/Abidjan
......
America/New_York
......
Asia/Shanghai
......
```

## 设置时区
```shell
# timedatectl set-timezone Asia/Shanghai
```

## 查看系统的时区
```shell
$ ll /etc/localtime
lrwxrwxrwx. 1 root root 35 2月  18 2020 /etc/localtime -> ../usr/share/zoneinfo/Asia/Shanghai
```
