---
layout: single
title:  "命令ssh"
date:   2021-01-21 00:00:00 +0800
categories: Command
tags: [Linux, ssh]
---

## 指定端口
```shell
ssh -p <port> user@hostname
```

## 密钥登录
### 默认
私钥文件在 macOS 的客户端位置是 /Users/wjj/.ssh/id_rsa，公钥文件存放在服务器端的位置是 /home/user/.ssh/authorized_keys。

### 指定
```shell
ssh -i <identity_file> user@hostname
```
