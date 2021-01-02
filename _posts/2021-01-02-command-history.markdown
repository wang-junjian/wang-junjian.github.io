---
layout: post
title:  "命令history"
date:   2021-01-02 00:00:00 +0800
categories: Linux
tags: [Linux, Command, history, source, .bashrc, .bash_profile]
---

## 操作不记录在历史记录中
### 有选择性地进行记录（操作命令前面加空格就不记录）
* 当前会话临时生效
```shell
HISTCONTROL=ignorespace
```

* 持久化设置，可以修改配置文件： ```.bash_profile``` 或 ```.bashrc```。
> 执行source命令后，设置生效。你也可以退出后重新登录。
```shell
$ nano .bashrc
export HISTCONTROL=ignorespace

$ source .bashrc
```

### 所有的操作不记录
> 只在当前会话中起作用，要想持久化请参考上面的设置。
```shell
HISTSIZE=0
```

## 删除历史记录中的某行
```shell
history -d linenumber
```

## 参考资料
* [How to remove a single line from history?](https://unix.stackexchange.com/questions/49214/how-to-remove-a-single-line-from-history)
* [What is the purpose of .bashrc and how does it work?](https://unix.stackexchange.com/questions/129143/what-is-the-purpose-of-bashrc-and-how-does-it-work)
