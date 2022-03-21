---
layout: post
title:  "阿里云 yum 安装应用报 404 错误"
date:   2022-03-21 00:00:00 +0800
categories: Linux
tags: [CentOS, 阿里云, sed, yum]
---

> 今天登录阿里云安装应用出现 404

## 问题
```shell
yum install install httpd-tools -y
```
```
CentOS-8 - AppStream                                                                                                                                                                      9.6 kB/s | 2.3 kB     00:00    
Errors during downloading metadata for repository 'AppStream':
  - Status code: 404 for http://mirrors.cloud.aliyuncs.com/centos/8/AppStream/x86_64/os/repodata/repomd.xml (IP: 100.100.2.148)
错误：为 repo 'AppStream' 下载元数据失败 : Cannot download repomd.xml: Cannot download repodata/repomd.xml: All mirrors were tried
```

## 解决方案
```shell
cd /etc/yum.repos.d/

find . -name '*.repo' -exec sed -i 's/mirrors.cloud.aliyuncs.com/mirrors.aliyun.com/g' {} +
find . -name '*.repo' -exec sed -i 's/$releasever/$releasever-stream/g' {} +
或
for i in `ls`;do sed -i 's/mirrors.cloud.aliyuncs.com/mirrors.aliyun.com/g' $i;done
for i in `ls`;do sed -i 's/$releasever/$releasever-stream/g' $i;done

yum clean all
yum makecache 

yum install httpd-tools -y
```

## 参考资料
* [阿里云 Centos8 yum 镜像 404](https://lcgao.com/1148.html)
