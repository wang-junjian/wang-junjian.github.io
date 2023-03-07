---
layout: post
title:  "在 CentOS 上安装 EPEL 软件仓库"
date:   2023-03-07 00:00:00 +0800
categories: Linux
tags: [EPEL, Install, CentOS]
---

EPEL（Extra Packages for Enterprise Linux）是为企业级Linux操作系统（如CentOS、Red Hat Enterprise Linux等）提供的一个高质量、稳定的软件仓库，包含了许多不包含在标准软件仓库中的软件包。

## 安装 EPEL 软件仓库
```shell
yum -y install epel-release
```

## FAQ
### 不能安装软件
```
No match for argument: htop
Error: Unable to find a match: htop
```

## 参考资料
* [Htop在Centos7的安装](https://www.jianshu.com/p/5629e331f58d)
