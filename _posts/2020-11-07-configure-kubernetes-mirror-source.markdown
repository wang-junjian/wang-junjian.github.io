---
layout: post
title:  "配置Kubernetes镜像源"
date:   2020-11-07 00:00:00 +0800
categories: Kubernetes
tags: [Linux, Ubuntu, Mirror, EOF]
---

## 配置 Kubernetes 镜像源
```shell
apt-get update && apt-get install -y apt-transport-https
curl https://mirrors.aliyun.com/kubernetes/apt/doc/apt-key.gpg | apt-key add - 
cat <<EOF >/etc/apt/sources.list.d/kubernetes.list
deb https://mirrors.aliyun.com/kubernetes/apt/ kubernetes-xenial main
EOF
apt-get update
```

## 参考资料
* [阿里云官方镜像站](https://developer.aliyun.com/mirror/)
* [阿里云-Kubernetes 镜像](https://developer.aliyun.com/mirror/kubernetes)
* [How does “cat << EOF” work in bash?](https://stackoverflow.com/questions/2500436/how-does-cat-eof-work-in-bash)
