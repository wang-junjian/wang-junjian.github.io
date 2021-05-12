---
layout: post
title:  "容器内幕"
date:   2021-04-01 00:00:00 +0800
categories: Docker
tags: [Container, namespace, cgroup, echo, mkdir, rmdir, cp, ldd, egrep, sort, uniq, chroot, while]
---

## 容器的本质是一种特殊的进程

* Linux Namespace - 空间隔离
* Linux Cgroups - 资源限制
* chroot - 切换进程的根目录

## Linux Namespace


## Linux Cgroups - Linux Control Group
作用：限制一个进程组能够使用的资源上限，包括 CPU、内存、磁盘、网络带宽等等。

### 查看Cgroups限制的资源各类
在 Linux 中，Cgroups 给用户暴露出来的操作接口是文件系统，即它以文件和目录的方式组织在操作系统的 /sys/fs/cgroup 路径下。可以用 mount 指令把它们展示出来。

```shell
$ mount -t cgroup
cgroup on /sys/fs/cgroup/systemd type cgroup (rw,nosuid,nodev,noexec,relatime,xattr,release_agent=/usr/lib/systemd/systemd-cgroups-agent,name=systemd)
cgroup on /sys/fs/cgroup/devices type cgroup (rw,nosuid,nodev,noexec,relatime,devices)
cgroup on /sys/fs/cgroup/hugetlb type cgroup (rw,nosuid,nodev,noexec,relatime,hugetlb)
cgroup on /sys/fs/cgroup/cpu,cpuacct type cgroup (rw,nosuid,nodev,noexec,relatime,cpu,cpuacct)
cgroup on /sys/fs/cgroup/freezer type cgroup (rw,nosuid,nodev,noexec,relatime,freezer)
cgroup on /sys/fs/cgroup/rdma type cgroup (rw,nosuid,nodev,noexec,relatime,rdma)
cgroup on /sys/fs/cgroup/net_cls,net_prio type cgroup (rw,nosuid,nodev,noexec,relatime,net_cls,net_prio)
cgroup on /sys/fs/cgroup/cpuset type cgroup (rw,nosuid,nodev,noexec,relatime,cpuset)
cgroup on /sys/fs/cgroup/perf_event type cgroup (rw,nosuid,nodev,noexec,relatime,perf_event)
cgroup on /sys/fs/cgroup/memory type cgroup (rw,nosuid,nodev,noexec,relatime,memory)
cgroup on /sys/fs/cgroup/pids type cgroup (rw,nosuid,nodev,noexec,relatime,pids)
cgroup on /sys/fs/cgroup/blkio type cgroup (rw,nosuid,nodev,noexec,relatime,blkio)
```

可以看到，在 /sys/fs/cgroup 下面有很多诸如 cpuset、cpu、 memory 这样的子目录，也叫子系统。这些都是这台机器当前可以被 Cgroups 进行限制的资源种类。而在子系统对应的资源种类下，你就可以看到该类资源具体可以被限制的方法。比如，对 CPU 子系统来说，我们就可以看到如下几个配置文件。

```shell
$ ls /sys/fs/cgroup/cpu
aegis                  cpuacct.usage_all          cpu.cfs_quota_us   notify_on_release
assist                 cpuacct.usage_percpu       cpu.rt_period_us   release_agent
cgroup.clone_children  cpuacct.usage_percpu_sys   cpu.rt_runtime_us  system.slice
cgroup.procs           cpuacct.usage_percpu_user  cpu.shares         tasks
cgroup.sane_behavior   cpuacct.usage_sys          cpu.stat           user.slice
cpuacct.stat           cpuacct.usage_user         docker
cpuacct.usage          cpu.cfs_period_us          kubepods
```

可以看到 cfs_period 和 cfs_quota 这样的关键词。这两个参数需要组合使用，可以用来限制进程在长度为 cfs_period 的一段时间内，只能被分配到总量为 cfs_quota 的 CPU 时间。

### 演示CPU子系统的控制
现在进入 /sys/fs/cgroup/cpu 目录下，创建一个子目录 container，这个目录就称为一个“控制组”。操作系统会在新创建的 container 目录下，自动生成该子系统对应的资源限制文件。
```shell
$ cd /sys/fs/cgroup/cpu
$ mkdir container
$ ls container/
cgroup.clone_children  cpuacct.usage_percpu       cpu.cfs_period_us  cpu.stat
cgroup.procs           cpuacct.usage_percpu_sys   cpu.cfs_quota_us   notify_on_release
cpuacct.stat           cpuacct.usage_percpu_user  cpu.rt_period_us   tasks
cpuacct.usage          cpuacct.usage_sys          cpu.rt_runtime_us
cpuacct.usage_all      cpuacct.usage_user         cpu.shares
```

我在后台执行下面一条脚本，这是一个死循环，可以把计算机的 CPU 吃到 100%，根据它的输出，可以看到这个脚本在后台运行的进程号（PID）是 2383。
```shell
$ while : ; do : ; done &
[1] 2383
```

可以用 top 指令来确认一下 CPU 有没有被打满。
```shell
$ top - 16:25:19 up 392 days,  5:37,  1 user,  load average: 2.12, 1.41, 0.86
Tasks: 153 total,   3 running, 150 sleeping,   0 stopped,   0 zombie
%Cpu(s): 55.6 us,  1.0 sy,  0.0 ni, 42.7 id,  0.2 wa,  0.5 hi,  0.0 si,  0.0 st
MiB Mem :   3780.8 total,    182.6 free,   1709.1 used,   1889.1 buff/cache
MiB Swap:      0.0 total,      0.0 free,      0.0 used.   1947.3 avail Mem 

  PID USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND
 2383 root      20   0   29804   1948      0 R 100.0   0.1   3:13.97 bash
```

通过查看 container 目录下的文件，看到 container 控制组里的 CPU quota 还没有任何限制（即：-1），CPU period 则是默认的 100 ms（100000 us）
```shell
$ cat /sys/fs/cgroup/cpu/container/cpu.cfs_quota_us
-1
$ cat /sys/fs/cgroup/cpu/container/cpu.cfs_period_us 
100000

```

可以通过修改这些文件的内容来设置限制。比如，向 container 组里的 cfs_quota 文件写入 20 ms（20000 us）。这意味着在每 100 ms 的时间里，被该控制组限制的进程只能使用 20 ms 的 CPU 时间，也就是说这个进程只能使用到 20% 的 CPU 带宽。
```shell
$ echo 20000 > /sys/fs/cgroup/cpu/container/cpu.cfs_quota_us
```

接下来，把被限制的进程的 PID 写入 container 组里的 tasks 文件，上面的设置就会对该进程生效了。
```shell
$ echo 2383 > /sys/fs/cgroup/cpu/container/tasks
```

可以用 top 指令查看一下
```shell
top - 16:43:04 up 392 days,  5:54,  1 user,  load average: 0.71, 1.37, 1.27
Tasks: 155 total,   2 running, 153 sleeping,   0 stopped,   0 zombie
%Cpu(s): 16.6 us,  1.8 sy,  0.0 ni, 80.7 id,  0.2 wa,  0.5 hi,  0.2 si,  0.0 st
MiB Mem :   3780.8 total,    173.5 free,   1711.3 used,   1896.0 buff/cache
MiB Swap:      0.0 total,      0.0 free,      0.0 used.   1945.1 avail Mem 

  PID USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND
 2383 root      20   0   29804   1948      0 R  20.3   0.1  20:17.55 bash
```
可以看到，计算机的 CPU 使用率立刻降到了 20%（%Cpu0 : 20.3 us）。

结束进程
```shell
$ kill 2383
```

删除创建的控制组 container
```shell
$ rmdir container/
```

### 使用Docker来完成上面的CPU资源限制
```shell
$ docker run -it --cpu-period=100000 --cpu-quota=20000 centos /bin/bash
15163f5037e2c76073c52e1d8d25fd96af31b5b2f13d46f2f58b5fbdaba547ed
```

查看Docker对CPU子系统限制的设置
```shell
$ cat /sys/fs/cgroup/cpu/docker/15163f5037e2c76073c52e1d8d25fd96af31b5b2f13d46f2f58b5fbdaba547ed/cpu.cfs_period_us 
100000
$ cat /sys/fs/cgroup/cpu/docker/15163f5037e2c76073c52e1d8d25fd96af31b5b2f13d46f2f58b5fbdaba547ed/cpu.cfs_quota_us 
20000
```

## chroot - change root file system
### 创建 mini 文件系统
* 创建目录
```shell
$ mkdir -p $HOME/test
$ mkdir -p $HOME/test/{bin,lib64,lib}
```

* 拷贝基本命令
```shell
$ cp -v /bin/{bash,ls} $HOME/test/bin
```
```
'/bin/bash' -> '/root/test/bin/bash'
'/bin/ls' -> '/root/test/bin/ls'
```

* 拷贝基本命令依赖的动态库
```shell
$ list="$(ldd /bin/{bash,ls} | egrep -o '/lib.*\.[0-9]' | sort | uniq)"
$ for i in $list; do cp -v "$i" "${HOME}/test${i}"; done
```
```
'/lib64/ld-linux-x86-64.so.2' -> '/root/test/lib64/ld-linux-x86-64.so.2'
'/lib64/libcap.so.2' -> '/root/test/lib64/libcap.so.2'
'/lib64/libc.so.6' -> '/root/test/lib64/libc.so.6'
'/lib64/libdl.so.2' -> '/root/test/lib64/libdl.so.2'
'/lib64/libpcre2-8.so.0' -> '/root/test/lib64/libpcre2-8.so.0'
'/lib64/libpthread.so.0' -> '/root/test/lib64/libpthread.so.0'
'/lib64/libselinux.so.1' -> '/root/test/lib64/libselinux.so.1'
'/lib64/libtinfo.so.6' -> '/root/test/lib64/libtinfo.so.6'
```

### 创建容器进程
执行 chroot 命令，告诉操作系统，使用 $HOME/test 目录作为 /bin/bash 进程的根目录。

chroot 后面的命令 /bin/bash 是指宿主机的 $HOME/test/bin/bash，执行 chroot 命令后，看到的根文件系统就是宿主机的 $HOME/test 目录下的文件和目录。
```shell
$ chroot $HOME/test /bin/bash
# export PATH=/bin
# ls /
bin  lib  lib64
```

这个挂载在容器根目录上、用来为容器进程提供隔离后执行环境的文件系统，就是所谓的“容器镜像”。它还有一个更为专业的名字，叫作：rootfs（根文件系统）。

Docker 会优先使用 pivot_root 系统调用，如果系统不支持，才会使用 chroot。这两个系统调用虽然功能类似，但是也有细微的区别。
