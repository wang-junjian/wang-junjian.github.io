---
layout: post
title:  "命令man help info"
date:   2021-05-24 00:00:00 +0800
categories: Command
tags: [Linux, Shell, man, help, info]
---

## man
manual 的缩写。在线参考手册的接口

* man man
```shell
......
    下表显示了手册的 章节 号及其包含的手册页类型。

    1   可执行程序或 shell 命令
    2   系统调用(内核提供的函数)
    3   库调用(程序库中的函数)
    4   特殊文件(通常位于 /dev)
    5   文件格式和规范，如 /etc/passwd
    6   游戏
    7   杂项(包括宏包和规范，如 man(7)，groff(7))
    8   系统管理命令(通常只针对 root 用户)
    9   内核例程 [非标准]
......
```

* 查看指定章节
```shell
man 7 man
man man.7
```

* 寻找所有匹配(-a, --all 寻找所有匹配的手册页)
```shell
man -a passwd
```
```shell
--Man-- 下一页: passwd(5) [ 查看 (return) | 跳过 (Ctrl-D) | 退出 (Ctrl-C) ]
```

## help
shell 自带的命令为内部命令，其它的为外部命令。

* 内部命令使用 help
```shell
help cd
cd --help
```

* 外部命令使用 help
```shell
ls --help
```

### type 查看内部命令还是外部命令
```shell
$ type cd
cd 是 shell 内建
$ type ls
ls 是 `ls --color=auto' 的别名
$ type curl
curl 是 /usr/bin/curl
```

### builtin 查看所有内部命令
```shell
man builtin
```
```shell
bash,  :,  .,  [,  alias,  bg, bind, break, builtin, caller, cd, command, 
compgen, complete, compopt, continue, declare, dirs, disown, echo, enable, 
eval, exec, exit, export, false, fc, fg, getopts, hash, help, history, 
jobs, kill, let, local, logout, mapfile, popd, printf, pushd, pwd, read, 
readonly, return, set, shift, shopt, source, suspend, test, times, trap, 
true, type, typeset, ulimit, umask, unalias, unset, wait - bash built-in commands
```

## info
info 比 help 更详细，可以看作 help 的补充。

```shell
info cd
```
