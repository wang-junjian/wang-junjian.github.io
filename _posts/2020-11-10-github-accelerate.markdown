---
layout: post
title:  "GitHub加速"
date:   2020-11-10 00:00:00 +0800
categories: GitHub
tags: [GitHub, curl, hosts]
---

> 在国内加速下载GitHub工程

## 在路径上增加 ```.cnpmjs.org```
正常下载：```git clone https://github.com/microsoft/onnxruntime.git```

加速下载：```git clone https://github.com.cnpmjs.org/microsoft/onnxruntime.git```

## 查找当前位置距离最快的 GitHub IP
### 运行测速脚本 [gh-check](https://gist.github.com/lilydjwg/93d33ed04547e1b9f7a86b64ef2ed058)
```shell
curl -fsSL  https://gist.githubusercontent.com/lilydjwg/93d33ed04547e1b9f7a86b64ef2ed058/raw/134c1971ad95930aaec4cf93c8509f0f4927c03c/gh-check \
    | python3 -
```

### 文件 ```hosts``` 路径
* Windows
```
C:\Windows\System32\drivers\etc\hosts
```

* Mac OS X
```
/etc/hosts
```

* Linux
```
/etc/hosts
```

### 修改 ```hosts``` 文件
```txt
199.232.69.194 github.global.ssl.fastly.net
140.82.112.4 github.com
```

### 下载
```shell
git clone https://github.com/microsoft/onnxruntime.git
```

## 参考资料
* [https://github.com.cnpmjs.org/](https://github.com.cnpmjs.org/)
* [寻找最快的 GitHub IP](https://blog.lilydjwg.me/2019/8/16/gh-check.214730.html)
* [git clone一个github上的仓库，太慢，经常连接失败，但是github官网流畅访问，为什么？](https://www.zhihu.com/question/27159393)
* [完美解决github访问速度慢](https://www.cnblogs.com/knuzy/p/9415243.html)
* [How to find all the used IP addresses on a network](https://askubuntu.com/questions/224559/how-to-find-all-the-used-ip-addresses-on-a-network)
