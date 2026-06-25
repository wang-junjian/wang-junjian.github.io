---
type: article
title:  "在 Linux 上安装输入法"
date:   2019-05-19 08:00:00 +0800
tags: [输入法, linux, ubuntu, centos, input-method, tutorial]
excerpt: "在CentOS和Ubuntu系统上安装ibus五笔输入法的教程。"
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
