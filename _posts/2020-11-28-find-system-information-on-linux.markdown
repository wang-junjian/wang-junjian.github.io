---
layout: post
title:  "Linux上查找系统信息"
date:   2020-11-28 00:00:00 +0800
categories: Linux
tags: [Linux, 系统信息, GPU, CUDA, Memory, 硬盘, grep]
---

## Linux内核版本
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

## 查找CODENAME
```shell
$ cat /etc/os-release | grep VERSION_CODENAME 
VERSION_CODENAME=focal
```

## 操作系统版本
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

## 内存容量
```shell
$ free -h
              total        used        free      shared  buff/cache   available
Mem:          251Gi       2.8Gi       209Gi        47Mi        39Gi       247Gi
Swap:            0B          0B          0B
```

## NVIDIA GPU型号
```shell
$ lspci | grep -i nvidia
0000:43:00.0 3D controller: NVIDIA Corporation TU104GL [Tesla T4] (rev a1)
0000:47:00.0 3D controller: NVIDIA Corporation TU104GL [Tesla T4] (rev a1)
0000:8e:00.0 3D controller: NVIDIA Corporation TU104GL [Tesla T4] (rev a1)
0000:92:00.0 3D controller: NVIDIA Corporation TU104GL [Tesla T4] (rev a1)
```
## NVIDIA驱动版本
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

## CUDA版本
```shell
$ nvcc --version 或 nvcc -V
nvcc: NVIDIA (R) Cuda compiler driver
Copyright (c) 2005-2020 NVIDIA Corporation
Built on Tue_Sep_15_19:10:02_PDT_2020
Cuda compilation tools, release 11.1, V11.1.74
Build cuda_11.1.TC455_06.29069683_0
```

## NVIDIA驱动版本和支持的CUDA版本
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

## 硬盘
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

## 参考资料
* [How to get the cuda version?](https://stackoverflow.com/questions/9727688/how-to-get-the-cuda-version)
* [ubuntu 查看内存命令](https://blog.csdn.net/jzp12/article/details/7560450)
* [Ubuntu查看硬盘,分区相关命令介绍](https://www.169it.com/article/3218336418.html)
* [How to get the nvidia driver version from the command line?](https://stackoverflow.com/questions/13125714/how-to-get-the-nvidia-driver-version-from-the-command-line)
* [How to check NVIDIA driver version on your Linux system](https://linuxconfig.org/how-to-check-nvidia-driver-version-on-your-linux-system)
* [Linux下如何查看CPU信息, 包括位数和多核信息](https://blog.csdn.net/daniel_h1986/article/details/6318050)
* [How To Find Which Linux Kernel Version Is Installed On My System](https://www.cyberciti.biz/faq/find-print-linux-unix-kernel-version/)
