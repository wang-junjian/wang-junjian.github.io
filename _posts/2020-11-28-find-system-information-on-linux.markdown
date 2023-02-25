---
layout: post
title:  "Linux上查找系统信息"
date:   2020-11-28 00:00:00 +0800
categories: Linux
tags: [Linux, 系统信息, GPU, CUDA, Memory, 硬盘, lsb_release, grep, cut, uniq]
---

## 操作系统
### Linux内核版本
* uname
```shell
$ uname -r
4.18.0-147.5.1.el8_1.x86_64
```

* /proc/version
```shell
$ cat /proc/version
Linux version 4.18.0-147.5.1.el8_1.x86_64 (mockbuild@kbuilder.bsys.centos.org) (gcc version 8.3.1 20190507 (Red Hat 8.3.1-4) (GCC)) #1 SMP Wed Feb 5 02:00:39 UTC 2020
```

* hostnamectl
```shell
$ hostnamectl | grep Kernel
            Kernel: Linux 4.18.0-147.5.1.el8_1.x86_64
```

### 查找CODENAME
```shell
$ cat /etc/os-release | grep VERSION_CODENAME 
VERSION_CODENAME=focal
```

### 操作系统信息
```shell
$ lsb_release -a
```

* Ubuntu
```
No LSB modules are available.
Distributor ID:	Ubuntu
Description:	Ubuntu 20.04 LTS
Release:	20.04
Codename:	focal
```

* CentOS
```
LSB Version:	:core-4.1-amd64:core-4.1-noarch
Distributor ID:	CentOS
Description:	CentOS Linux release 8.1.1911 (Core) 
Release:	8.1.1911
Codename:	Core
```

## CPU型号
```shell
$ cat /proc/cpuinfo | grep name | cut -f2 -d: | uniq -c
     64  Intel(R) Xeon(R) Silver 4216 CPU @ 2.10GHz
```
* 64 逻辑核数

### 计算机中物理CPU个数
```shell
cat /proc/cpuinfo| grep "physical id"| sort| uniq| wc -l
```

### 每个CPU的核心总数
```shell
cat /proc/cpuinfo| grep "cpu cores"| uniq | sed 's/.*: \(.*\)/\1/g'
```

### 计算机中总线程数
```shell
cat /proc/cpuinfo| grep "processor"| wc -l
```

## 内存容量
```shell
$ free -h
              total        used        free      shared  buff/cache   available
Mem:          251Gi       2.8Gi       209Gi        47Mi        39Gi       247Gi
Swap:            0B          0B          0B
```

## NVIDIA GPU
### NVIDIA GPU型号
```shell
$ lspci | grep -i nvidia
0000:43:00.0 3D controller: NVIDIA Corporation TU104GL [Tesla T4] (rev a1)
0000:47:00.0 3D controller: NVIDIA Corporation TU104GL [Tesla T4] (rev a1)
0000:8e:00.0 3D controller: NVIDIA Corporation TU104GL [Tesla T4] (rev a1)
0000:92:00.0 3D controller: NVIDIA Corporation TU104GL [Tesla T4] (rev a1)
```
### NVIDIA驱动版本
* modinfo
```shell
$ modinfo nvidia | grep ^version:
version:        450.80.02
```

* /proc/driver/nvidia/version
```shell
$ cat /proc/driver/nvidia/version
NVRM version: NVIDIA UNIX x86_64 Kernel Module  450.80.02  Wed Sep 23 01:13:39 UTC 2020
GCC version:  gcc version 9.3.0 (Ubuntu 9.3.0-17ubuntu1~20.04) 
```

### CUDA版本
```shell
$ cat /usr/local/cuda/version.txt
CUDA Version 11.0.228
```

```shell
$ nvcc --version 或 nvcc -V
nvcc: NVIDIA (R) Cuda compiler driver
Copyright (c) 2005-2020 NVIDIA Corporation
Built on Tue_Sep_15_19:10:02_PDT_2020
Cuda compilation tools, release 11.1, V11.1.74
Build cuda_11.1.TC455_06.29069683_0
```

### NVIDIA驱动版本和支持的CUDA版本
```
$ nvidia-smi
Sat Nov 28 02:48:22 2020       
+-----------------------------------------------------------------------------+
| NVIDIA-SMI 450.80.02    Driver Version: 450.80.02    CUDA Version: 11.0     |
|-------------------------------+----------------------+----------------------+
| GPU  Name        Persistence-M| Bus-Id        Disp.A | Volatile Uncorr. ECC |
| Fan  Temp  Perf  Pwr:Usage/Cap|         Memory-Usage | GPU-Util  Compute M. |
|                               |                      |               MIG M. |
|===============================+======================+======================|
|   0  Tesla T4            Off  | 00000000:43:00.0 Off |                    0 |
| N/A   34C    P8     9W /  70W |      0MiB / 15109MiB |      0%      Default |
|                               |                      |                  N/A |
+-------------------------------+----------------------+----------------------+
|   1  Tesla T4            Off  | 00000000:47:00.0 Off |                    0 |
| N/A   35C    P8     9W /  70W |      0MiB / 15109MiB |      0%      Default |
|                               |                      |                  N/A |
+-------------------------------+----------------------+----------------------+
|   2  Tesla T4            Off  | 00000000:8E:00.0 Off |                    0 |
| N/A   33C    P8    10W /  70W |      0MiB / 15109MiB |      0%      Default |
|                               |                      |                  N/A |
+-------------------------------+----------------------+----------------------+
|   3  Tesla T4            Off  | 00000000:92:00.0 Off |                    0 |
| N/A   31C    P8     9W /  70W |      0MiB / 15109MiB |      0%      Default |
|                               |                      |                  N/A |
+-------------------------------+----------------------+----------------------+
                                                                               
+-----------------------------------------------------------------------------+
| Processes:                                                                  |
|  GPU   GI   CI        PID   Type   Process name                  GPU Memory |
|        ID   ID                                                   Usage      |
|=============================================================================|
|  No running processes found                                                 |
+-----------------------------------------------------------------------------+
```

## 磁盘
### 显示磁盘空间
```shell
$ df -h
Filesystem      Size  Used Avail Use% Mounted on
udev            126G     0  126G   0% /dev
tmpfs            26G  3.4M   26G   1% /run
/dev/sda2       548G   40G  481G   8% /
tmpfs           126G     0  126G   0% /dev/shm
tmpfs           5.0M     0  5.0M   0% /run/lock
tmpfs           126G     0  126G   0% /sys/fs/cgroup
/dev/sda1       511M  7.8M  504M   2% /boot/efi
tmpfs            26G     0   26G   0% /run/user/1000
/dev/loop5       30M   30M     0 100% /snap/snapd/8140
/dev/loop2       72M   72M     0 100% /snap/lxd/16100
/dev/loop0       55M   55M     0 100% /snap/core18/1880
/dev/loop1       30M   30M     0 100% /snap/snapd/8542
/dev/loop7       72M   72M     0 100% /snap/lxd/16530
/dev/loop3       56M   56M     0 100% /snap/core18/1885
/dev/sdb1       2.0T  4.7G  1.9T   1% /data
```

### 检查磁盘是否旋转
#### lsblk
```shell
$ lsblk -l
NAME  MAJ:MIN RM   SIZE RO TYPE MOUNTPOINTS
loop0   7:0    0     4K  1 loop /snap/bare/5
loop1   7:1    0 149.9M  1 loop /snap/firefox/1540
loop2   7:2    0  59.1M  1 loop /snap/core20/1826
loop3   7:3    0 214.4M  1 loop /snap/firefox/2355
loop4   7:4    0  57.8M  1 loop /snap/core20/1522
loop5   7:5    0 330.6M  1 loop /snap/gnome-3-38-2004/122
loop6   7:6    0 383.8M  1 loop /snap/gnome-3-38-2004/113
loop7   7:7    0  91.7M  1 loop /snap/gtk-common-themes/1535
loop8   7:8    0  43.2M  1 loop /snap/snapd/18363
sda     8:0    0    64G  0 disk 
sda1    8:1    0     1G  0 part /boot/efi
sda2    8:2    0  62.9G  0 part /var/snap/firefox/common/host-hunspell
                                /
sr0    11:0    1  1024M  0 rom  
```
* RO
     * 1 - Hard Disk Drive(HDD)
     * 0 - Solid State Drive(SSD)

指定显示的列 rota
```shell
lsblk -o name,rota
```

```shell
$ cat /sys/block/sda/queue/rotational 
0
```

#### smartctl
```shell
sudo apt install smartmontools
```

```shell
$ sudo smartctl -a /dev/sda
smartctl 7.2 2020-12-30 r5155 [aarch64-linux-5.15.0-60-generic] (local build)
Copyright (C) 2002-20, Bruce Allen, Christian Franke, www.smartmontools.org

=== START OF INFORMATION SECTION ===
Device Model:     Ubuntu Linux 22.04 Desktop-0 SSD
Serial Number:    RHH83BJQ45JM91PA1H97
Firmware Version: F.CVTEFM
User Capacity:    68,719,476,736 bytes [68.7 GB]
Sector Sizes:     512 bytes logical, 4096 bytes physical
Rotation Rate:    Solid State Device
TRIM Command:     Available, deterministic, zeroed
Device is:        Not in smartctl database [for details use: -P showall]
ATA Version is:   ATA8-ACS, ATA/ATAPI-5 T13/1321D revision 1
SATA Version is:  SATA 2.6, 3.0 Gb/s
Local Time is:    Fri Feb 24 21:29:05 2023 CST
SMART support is: Unavailable - device lacks SMART capability.
```

* [How To Find If The Disk Is SSD Or HDD In Linux](https://ostechnix.com/how-to-find-if-the-disk-is-ssd-or-hdd-in-linux/)
* [5 Ways to Check disk size in Linux](https://www.howtouselinux.com/post/linux-list-disks)


## 参考资料
* [How to get the cuda version?](https://stackoverflow.com/questions/9727688/how-to-get-the-cuda-version)
* [ubuntu 查看内存命令](https://blog.csdn.net/jzp12/article/details/7560450)
* [Ubuntu查看硬盘,分区相关命令介绍](https://www.169it.com/article/3218336418.html)
* [How to get the nvidia driver version from the command line?](https://stackoverflow.com/questions/13125714/how-to-get-the-nvidia-driver-version-from-the-command-line)
* [How to check NVIDIA driver version on your Linux system](https://linuxconfig.org/how-to-check-nvidia-driver-version-on-your-linux-system)
* [Linux下如何查看CPU信息, 包括位数和多核信息](https://blog.csdn.net/daniel_h1986/article/details/6318050)
* [How To Find Which Linux Kernel Version Is Installed On My System](https://www.cyberciti.biz/faq/find-print-linux-unix-kernel-version/)
* [sed/awk 提取指定的字段](https://zhuanlan.zhihu.com/p/183247600)
* [5 Ways to Check CPU Info in Linux](https://linuxhandbook.com/check-cpu-info-linux/)
