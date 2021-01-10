---
layout: post
title:  "GitHub加速"
date:   2020-11-10 00:00:00 +0800
categories: GitHub
tags: [GitHub]
---

> 在国内加速下载GitHub工程

## 在路径上增加```.cnpmjs.org
```shell
git clone https://github.com/microsoft/onnxruntime.git
```
```shell
git clone https://github.com.cnpmjs/microsoft/onnxruntime.git
```

## 查找当前位置距离最快的 GitHub IP
### 运行测速脚本
* [gh-check](https://gist.github.com/lilydjwg/93d33ed04547e1b9f7a86b64ef2ed058)
```shell
curl -fsSL  https://gist.githubusercontent.com/lilydjwg/93d33ed04547e1b9f7a86b64ef2ed058/raw/134c1971ad95930aaec4cf93c8509f0f4927c03c/gh-check | python3 -
```

### 修改 ```hosts``` 文件
```txt
199.232.69.194 github.global.ssl.fastly.net
140.82.112.4 github.com
```

## 参考资料
* [寻找最快的 GitHub IP](https://blog.lilydjwg.me/2019/8/16/gh-check.214730.html)
* [git clone一个github上的仓库，太慢，经常连接失败，但是github官网流畅访问，为什么？](https://www.zhihu.com/question/27159393)
* [完美解决github访问速度慢](https://www.cnblogs.com/knuzy/p/9415243.html)
