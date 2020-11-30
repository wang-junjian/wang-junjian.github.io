---
layout: post
title:  "SSH使用密匙登录"
date:   2020-06-13 00:00:00 +0800
categories: SSH
tags: [Linux, ssh, ssh-keygen]
---

## 生成身份验证密钥
> ssh-keygen -t rsa，在~/.ssh/目录下生成私匙id_rsa和公匙id_rsa.pub两个文件。
```shell
$ ssh-keygen -t rsa
Generating public/private rsa key pair.
Enter file in which to save the key (/home/username/.ssh/id_rsa): 直接回车
Enter passphrase (empty for no passphrase): 直接回车
Enter same passphrase again: 直接回车
Your identification has been saved in /home/username/.ssh/id_rsa.
Your public key has been saved in /home/username/.ssh/id_rsa.pub.
The key fingerprint is:
SHA256:foo-YWwIv/a/HGEGt9P6vvmff/QjBGEvzlYM4hBWeR0 username@hostname
The key's randomart image is:
+---[RSA 2048]----+
|         +oo.ooE.|
|        . o..o+. |
|      . .  .. .+ |
|  .    o o  o.o  |
|   o o  S .  +.  |
|    o =+ +  .. ..|
|     + .+ . . o..|
|    o .o = . + .o|
|   . o+o=o+o. o..|
+----[SHA256]-----+
```

## 复制您的公匙 id_rsa.pub 到服务器，命名为 authorized_keys。
```shell
$ scp .ssh/id_rsa.pub username@hostname:/home/username/.ssh/authorized_keys
```

## ssh 登录可以不用输入密码直接登录服务器了。
```shell
$ ssh username@hostname
```
