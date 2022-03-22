---
layout: post
title:  "在 Linux 上安装输入法"
date:   2019-05-19 08:00:00 +0800
categories: Linux
tags: [输入法]
---

## 安装五笔输入法

* CentOS
```shell
yum remove ibus
yum install ibus ibus-table
yum install ibus ibus-table-wubi
```

* Ubuntu
```shell
apt purge ibus
apt install ibus ibus-table
apt install ibus ibus-table-wubi
```
