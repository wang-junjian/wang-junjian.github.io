---
layout: single
title:  "Linux 性能优化"
date:   2022-04-04 00:00:00 +0800
categories: 性能优化
tags: [Linux]
---

## CPU
### 概念
#### 平均负载
单位时间内，系统处于可运行状态和不可中断状态的平均进程数，也就是平均活跃进程数，它和 CPU 使用率并没有直接关系。

**当平均负载高于 CPU 数量 70% 的时候，你就应该分析排查负载高的问题了。一旦负载过高，就可能导致进程响应变慢，进而影响服务的正常功能。**
70% 这个数字并不是绝对的，最推荐的方法，还是把系统的平均负载监控起来，然后根据更多的历史数据，判断负载的变化趋势。当发现负载有明显升高趋势时，比如说负载翻倍了，你再去做分析和调查。

### 工具
#### 查看 cpu核数
```shell
nproc
lscpu
grep 'model name' /proc/cpuinfo | wc -l
```

#### 显示平均负载 uptime
uptime、top，显示的顺序是最近1分钟、5分钟、15分钟，从此可以看出平均负载的趋势

```shell
$ uptime
 12:51:13 up 754 days,  2:02,  3 users,  load average: 0.41, 0.65, 2.63
```

#### 持续自动运行命令 watch
watch -d uptime: -d会高亮显示变化的区域

#### 系统压力测试工具 stress
安装
```shell
yum install stress -y
```

strees: --cpu cpu压测选项，-i io压测选项，-c 进程数压测选项，--timeout 执行时间

#### 性能工具 sysstat，用来监控和分析系统的性能。
安装
```shell
yum install sysstat -y
```

* mpstat 是一个常用的多核 CPU 性能分析工具，用来实时查看每个 CPU 的性能指标，以及所有 CPU 的平均指标。-P ALL监视所有cpu
* pidstat 是一个常用的进程性能分析工具，用来实时查看进程的 CPU、内存、I/O 以及上下文切换等性能指标。-u 显示cpu利用率

### 案例
#### CPU 密集型进程
模拟一个 CPU 使用率 100%
```shell
$ stress --cpu 1 --timeout 600
```

运行 uptime 查看平均负载的变化情况
```shell
$ watch -d uptime
 13:00:09 up 754 days,  2:11,  3 users,  load average: 2.84, 1.87, 2.24
```

运行 mpstat 查看 CPU 使用率的变化情况
```shell
# -P ALL 表示监控所有CPU，后面数字5表示间隔5秒后输出一组数据
$ mpstat -P ALL 5
12时55分34秒  CPU    %usr   %nice    %sys %iowait    %irq   %soft  %steal  %guest  %gnice   %idle
12时55分39秒  all   55.94    0.10    3.32    0.00    0.91    0.20    0.00    0.00    0.00   39.54
12时55分39秒    0   98.40    0.00    0.00    0.00    0.40    0.00    0.00    0.00    0.00    1.20
12时55分39秒    1   12.96    0.20    6.68    0.00    1.42    0.40    0.00    0.00    0.00   78.34

12时55分39秒  CPU    %usr   %nice    %sys %iowait    %irq   %soft  %steal  %guest  %gnice   %idle
12时55分44秒  all   54.58    0.00    3.22    0.10    0.91    0.20    0.00    0.00    0.00   40.99
12时55分44秒    0   99.40    0.00    0.00    0.00    0.40    0.20    0.00    0.00    0.00    0.00
12时55分44秒    1    9.13    0.00    6.49    0.20    1.42    0.20    0.00    0.00    0.00   82.56
```

使用 pidstat 来查询进程的状态，分析哪个进程导致了 CPU 使用率为 100%
```shell
# 间隔5秒后输出一组数据
$ pidstat -u 5 1
12时56分36秒   UID       PID    %usr %system  %guest   %wait    %CPU   CPU  Command
12时56分41秒     0   1775291   99.20    0.00    0.00    0.00   99.20     1  stress
```

#### I/O 密集型进程
模拟 I/O 压力，即不停地执行 sync
```shell
$ stress -i 1 --hdd 1 --timeout 600
```

运行 uptime 查看平均负载的变化情况
```shell
$ watch -d uptime
 13:02:53 up 754 days,  2:14,  3 users,  load average: 3.72, 2.28, 2.31
```

运行 mpstat 查看 CPU 使用率的变化情况
```shell
# -P ALL 表示监控所有CPU，后面数字5表示间隔5秒后输出一组数据
$ mpstat -P ALL 5
13时02分54秒  CPU    %usr   %nice    %sys %iowait    %irq   %soft  %steal  %guest  %gnice   %idle
13时02分59秒  all    4.10    0.00    7.59   82.77    1.23    0.31    0.00    0.00    0.00    4.00
13时02分59秒    0    4.93    0.00    5.54   83.57    1.23    0.21    0.00    0.00    0.00    4.52
13时02分59秒    1    3.28    0.00    9.63   81.97    1.23    0.41    0.00    0.00    0.00    3.48
```

使用 pidstat 来查询进程的状态，分析哪个进程导致了 iowait 这么高
```shell
# 间隔5秒后输出一组数据
$ pidstat -u 5 1
13时07分18秒   UID       PID    %usr %system  %guest   %wait    %CPU   CPU  Command
13时07分23秒     0   1771926    0.00    0.20    0.00    0.40    0.20     0  stress
13时07分23秒     0   1771927    0.00   10.18    0.00    0.40   10.18     0  stress
```

#### 大量进程
模拟的是 8 个进程
```shell
$ stress -c 8 --timeout 600
```

运行 uptime 查看平均负载的变化情况
```shell
$ watch -d uptime
 13:13:46 up 754 days,  2:25,  3 users,  load average: 10.57, 6.37, 4.2
```

运行 mpstat 查看 CPU 使用率的变化情况
```shell
# -P ALL 表示监控所有CPU，后面数字5表示间隔5秒后输出一组数据
$ mpstat -P ALL 5
13时13分52秒  CPU    %usr   %nice    %sys %iowait    %irq   %soft  %steal  %guest  %gnice   %idle
13时13分57秒  all   96.40    0.00    2.90    0.00    0.60    0.10    0.00    0.00    0.00    0.00
13时13分57秒    0   97.80    0.00    1.60    0.00    0.60    0.00    0.00    0.00    0.00    0.00
13时13分57秒    1   95.00    0.00    4.20    0.00    0.60    0.20    0.00    0.00    0.00    0.00
```

使用 pidstat 来查询进程的状态
```shell
# 间隔5秒后输出一组数据
$ pidstat -u 5 1
13时14分39秒   UID       PID    %usr %system  %guest   %wait    %CPU   CPU  Command
13时14分44秒     0   1776967   28.85    0.00    0.00   70.36   28.85     1  stress
13时14分44秒     0   1776968   21.94    0.00    0.00   77.87   21.94     0  stress
13时14分44秒     0   1776969   22.33    0.00    0.00   77.27   22.33     1  stress
13时14分44秒     0   1776970   22.92    0.00    0.00   75.89   22.92     1  stress
13时14分44秒     0   1776971   20.36    0.00    0.00   79.64   20.36     0  stress
13时14分44秒     0   1776972   20.55    0.00    0.00   78.66   20.55     1  stress
13时14分44秒     0   1776973   20.75    0.00    0.00   78.46   20.75     0  stress
13时14分44秒     0   1776974   19.96    0.00    0.00   79.25   19.96     1  stress
```

## I/O
### 概念
#### 

```shell
$ df -i /
文件系统          Inode 已用(I)  可用(I) 已用(I)% 挂载点
/dev/vda1      26213824  249022 25964802       1% /

$ df /
文件系统          1K-块     已用     可用 已用% 挂载点
/dev/vda1      52417516 19225164 33192352   37% /

$ for i in {0..722184}; do touch $i; done

$ df -i /
文件系统          Inode 已用(I)  可用(I) 已用(I)% 挂载点
/dev/vda1      26213824  961240 25252584       4% /

$ df /
文件系统          1K-块     已用     可用 已用% 挂载点
/dev/vda1      52417516 19631176 32786340   38% /
```
