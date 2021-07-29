---
layout: post
title:  "命令top"
date:   2021-01-17 00:00:00 +0800
categories: Command 快捷键
tags: [Linux, top]
---

## 快捷键
* ```Shift+p``` 按CPU使用率排序
* ```Shift+m``` 按内存使用率排序
* ```1``` 显示每个逻辑CPU的状态

## 查看指定进程
```shell
top -p $pid
```

* 查看1号进行
```shell
top -p 1
top -p1
```
```
top - 22:58:02 up 323 days, 12:09,  2 users,  load average: 0.64, 0.61, 0.38
Tasks:   1 total,   0 running,   1 sleeping,   0 stopped,   0 zombie
%Cpu(s):  7.2 us,  1.8 sy,  0.0 ni, 90.3 id,  0.0 wa,  0.5 hi,  0.2 si,  0.0 st
MiB Mem :   3780.8 total,    400.2 free,   1749.6 used,   1631.0 buff/cache
MiB Swap:      0.0 total,      0.0 free,      0.0 used.   1939.3 avail Mem 

  PID USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND
    1 root      20   0  178540   7680   3792 S   0.0   0.2   7:50.54 systemd
```
