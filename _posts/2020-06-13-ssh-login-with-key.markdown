---
layout: post
title:  "SSH使用密匙登录"
date:   2020-06-13 00:00:00 +0800
categories: SSH
tags: [Linux]
---

## 复制您的公匙 id_rsa.pub 到服务器，命名为 authorized_keys。
```shell
scp .ssh/id_rsa.pub username@hostname:/home/username/.ssh/authorized_keys
```

## ssh 登录可以不用输入密码直接登录服务器了。
```shell
ssh username@hostname
```
