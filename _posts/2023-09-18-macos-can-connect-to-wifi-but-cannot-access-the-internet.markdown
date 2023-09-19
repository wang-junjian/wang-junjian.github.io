---
layout: post
title:  "macOS 能连上 WiFi 但无法上网"
date:   2023-09-18 08:00:00 +0800
categories: WiFi
tags: [MacBookProM2Max]
---

## 问题描述
我的 MacBook Pro M2 Max 能够连接上 WiFi，但是无法上网，我进行了以下尝试：
1. 路由器（没有问题）；
2. 重启电脑；
3. 断开 WiFi 重新连接；

## 解决方案
最后，我在`抖音`上看到了一个解决方案，我尝试了一下，果然解决了问题。

打开`访达`，按下`Command + Shift + G`，输入`/Library/Preferences/SystemConfiguration/`，除`com.apple.Boot.plist`文件外，删除其他所有文件，然后重启电脑。
