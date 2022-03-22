---
layout: post
title:  "MAC 远程连接 Ubuntu 桌面"
date:   2018-12-26 10:00:00 +0800
categories: macOS
tags: [Ubuntu, Linux]
---

## 安装VNC服务
```bash
sudo apt-get install x11vnc
```

## 配置VNC
```bash
x11vnc -storepasswd
```

## 启动VNC服务
```bash
x11vnc -forever -shared -rfbauth ~/.vnc/passwd
```

## 连接VNC服务
```txt
打开splotlight，搜索［屏幕共享］，运行。输入IP:5900
```

## 参考资料
* [Mac 远程桌面 ubuntu16.04 unity](https://www.cnblogs.com/nowgood/p/Macremotedesktop.html)