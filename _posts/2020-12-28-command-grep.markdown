---
layout: post
title:  "命令grep"
date:   2020-12-28 00:00:00 +0800
categories: Command
tags: [Linux, grep, find, ll]
---

## 搜索文件内容
* 搜索一个文件
```shell
grep 'text' hello.txt
```

* 忽略字母大小写(-i)
```shell
grep -i 'text' hello.txt
```

* 搜索多个文件
```shell
grep 'text' hello.txt hi.txt
```

* 搜索当前目录下所有文件
```shell
grep 'text' *
```

* 搜索当前目录（包含子目录 -R）下所有文件
```shell
grep -R 'text' *
```

## 匹配搜索
* 搜索 pip 配置文件的路径 -R(遍历) -n(行号) -H(文件名)
```shell
grep "index-url" ~/.config -RnH
```
```
/home/lnsoft/.config/pip/pip.conf:2:index-url = https://mirrors.aliyun.com/pypi/simple/
```

* 搜索 pip 配置文件的路径(增加过滤)
```shell
find ~ -name pip* | xargs -i grep "index-url" {} --color -nH
```
```
/home/lnsoft/.config/pip/pip.conf:2:index-url = https://mirrors.aliyun.com/pypi/simple/
```

* 只匹配字符串，不使用正则表达式。
```shell
find . | grep -F .run
```

## 统计 [目录 | 文件] 数
* 显示当前目录下的目录
```shell
ll | grep '^d'
```

* 显示当前目录下的文件
```shell
ll | grep '^-'
```

* 显示当前目录下的所有目录及子目录（遍历）
```shell
ll -R | grep '^d'
```

* 统计目录数
```shell
ll | grep '^d' | wc -l
```

## 参考资料
* [Search Multiple Words / String Pattern Using grep Command on Bash shell](https://www.cyberciti.biz/faq/searching-multiple-words-string-using-grep/)
* [Grep Command in Linux (Find Text in Files)](https://linuxize.com/post/how-to-use-grep-command-to-search-files-in-linux/)
* [grep 递归指定文件遍历方法](https://blog.csdn.net/dengxu11/article/details/6947078)
