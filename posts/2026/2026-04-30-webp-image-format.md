---
type: article
title:  "WebP 格式的命令工具"
date:   2026-04-30 08:00:00 +0800
tags: [macOS, webp, Command]
---

## 安装 webp

webp 是一个官方工具包，它不是单个软件，而是一整套处理 WebP 格式的命令工具集合。

```shell
brew install webp
```

## cwebp (png → webp)

```shell
# 有损（推荐，长截图用）
cwebp -q 80 input.png -o output.webp
```

```shell
# 无损（画质完全不变，体积稍大）
cwebp -lossless input.png -o output.webp
```

## dwebp (webp → png)

```shell
dwebp input.webp -o output.png
```
