---
layout: post
title:  "配置pip镜像源"
date:   2020-11-09 00:00:00 +0800
categories: Python
tags: [Python, pip, Mirror]
---

> 加速 pip 下载安装包的速度。下面使用的是来自于清华大学的镜像源：https://pypi.tuna.tsinghua.edu.cn/simple

## 更新pip
```shell
# pip install --upgrade pip
Looking in indexes: https://pypi.tuna.tsinghua.edu.cn/simple
Requirement already up-to-date: pip in /usr/local/lib/python3.6/site-packages (20.2.4)
```

## 临时使用pip镜像
```shell
# pip install -i https://pypi.tuna.tsinghua.edu.cn/simple package
```

## 列出加载配置的路径和配置信息
```shell
# pip config list -v
For variant 'global', will try loading '/etc/xdg/pip/pip.conf'
For variant 'global', will try loading '/etc/pip.conf'
For variant 'user', will try loading '/root/.pip/pip.conf'
For variant 'user', will try loading '/root/.config/pip/pip.conf'
For variant 'site', will try loading '/usr/pip.conf'
global.index-url='http://mirrors.cloud.aliyuncs.com/pypi/simple/'
install.trusted-host='mirrors.cloud.aliyuncs.com'
```

## 设置默认镜像
```shell
# pip config set global.index-url https://pypi.tuna.tsinghua.edu.cn/simple
Writing to /root/.config/pip/pip.conf
```

## 参考资料
* [PyPI 镜像](https://developer.aliyun.com/mirror/pypi)
* [阿里云官方镜像站](https://developer.aliyun.com/mirror/)
* [清华大学开源软件镜像站 PyPI](https://mirrors.tuna.tsinghua.edu.cn/help/pypi/)
