---
layout: single
title:  "git 配置代理"
date:   2024-01-18 08:00:00 +0800
categories: git proxy
tags: [git, proxy, config, GitHub, v2ray]
---

我使用 v2ray 科学上网，并且已经开启了全局模式，所有网络连接都应该通过 v2ray 的代理服务器。但我使用 `git` 命令行应用发现不能连接 GitHub，但 `GitHub Desktop` 可以正常使用。

```bash
git clone https://github.com/wang-junjian/chatbox
```
```
Cloning into 'chatbox'...
fatal: unable to access 'https://github.com/wang-junjian/chatbox/': Failed to connect to github.com port 443 after 75011 ms: Couldn't connect to server
```

在这种情况下，你需要手动为 `git` 设置代理。

## 设置代理

```bash
git config --global http.proxy 'socks5://127.0.0.1:1080'
git config --global https.proxy 'socks5://127.0.0.1:1080'
```

这些命令将 git 的 HTTP 和 HTTPS 代理设置为 `socks5://127.0.0.1:1080`。你需要将 `1080` 替换为你的 v2ray 服务的端口。

请注意，这些设置只对当前的用户有效。如果你需要为所有用户设置代理，你可以在 `/etc/environment` 文件中添加相应的环境变量。

## 取消代理

```bash
git config --global --unset http.proxy
git config --global --unset https.proxy
```

## 查看设置

### 所有设置
```bash
git config --global --list
```

### 代理设置
```bash
git config --global --get http.proxy
git config --global --get https.proxy
```

这些命令会显示 git 的 HTTP 和 HTTPS 代理设置。如果这些设置没有被设置，那么这些命令将不会输出任何内容。
