---
layout: post
title:  "在Linux上安装CUDA Toolkit"
date:   2022-02-08 00:00:00 +0800
categories: GPU
tags: [Linux, CUDA, Install, Uninstall, Driver]
---

## 安装 CUDA Toolkit
### 下载
```shell
wget https://developer.download.nvidia.com/compute/cuda/11.6.0/local_installers/cuda_11.6.0_510.39.01_linux.run
```

### 安装
```shell
$ sudo sh cuda_11.5.1_495.29.05_linux.run
```
```
===========
= Summary =
===========

Driver:   Installed
Toolkit:  Installed in /usr/local/cuda-11.5/
Samples:  Installed in /home/lnsoft/, but missing recommended libraries

Please make sure that
 -   PATH includes /usr/local/cuda-11.5/bin
 -   LD_LIBRARY_PATH includes /usr/local/cuda-11.5/lib64, or, add /usr/local/cuda-11.5/lib64 to /etc/ld.so.conf and run ldconfig as root

To uninstall the CUDA Toolkit, run cuda-uninstaller in /usr/local/cuda-11.5/bin
To uninstall the NVIDIA Driver, run nvidia-uninstall
Logfile is /var/log/cuda-installer.log
```

### 查看 GPU 信息
```shell
$ nvidia-smi
```
```
Tue Feb  8 09:12:28 2022
+-----------------------------------------------------------------------------+
| NVIDIA-SMI 495.29.05    Driver Version: 495.29.05    CUDA Version: 11.5     |
|-------------------------------+----------------------+----------------------+
| GPU  Name        Persistence-M| Bus-Id        Disp.A | Volatile Uncorr. ECC |
| Fan  Temp  Perf  Pwr:Usage/Cap|         Memory-Usage | GPU-Util  Compute M. |
|                               |                      |               MIG M. |
|===============================+======================+======================|
|   0  Tesla T4            Off  | 00000000:43:00.0 Off |                    0 |
| N/A   35C    P8    10W /  70W |      0MiB / 15109MiB |      0%      Default |
|                               |                      |                  N/A |
+-------------------------------+----------------------+----------------------+
|   1  Tesla T4            Off  | 00000000:47:00.0 Off |                    0 |
| N/A   36C    P8     9W /  70W |      0MiB / 15109MiB |      0%      Default |
|                               |                      |                  N/A |
+-------------------------------+----------------------+----------------------+
|   2  Tesla T4            Off  | 00000000:8E:00.0 Off |                    0 |
| N/A   34C    P8     9W /  70W |      0MiB / 15109MiB |      0%      Default |
|                               |                      |                  N/A |
+-------------------------------+----------------------+----------------------+
|   3  Tesla T4            Off  | 00000000:92:00.0 Off |                    0 |
| N/A   32C    P8     9W /  70W |      0MiB / 15109MiB |      0%      Default |
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

### 查看 Nvidia 驱动版本
```shell
$ cat /proc/driver/nvidia/version
```
```
NVRM version: NVIDIA UNIX x86_64 Kernel Module  495.29.05  Thu Sep 30 16:00:29 UTC 2021
GCC version:  gcc version 9.3.0 (Ubuntu 9.3.0-17ubuntu1~20.04)
```

## 卸载驱动
### 查看使用 Nvidia GPU 卡的进程
```shell
$ sudo lsof /dev/nvidia*
```
```
COMMAND    PID USER   FD   TYPE  DEVICE SIZE/OFF NODE NAME
kubelet 744987 root   31u   CHR 195,255      0t0  565 /dev/nvidiactl
kubelet 744987 root   42u   CHR   195,0      0t0  569 /dev/nvidia0
kubelet 744987 root   45u   CHR   195,1      0t0  572 /dev/nvidia1
kubelet 744987 root   46u   CHR   195,2      0t0  579 /dev/nvidia2
kubelet 744987 root   47u   CHR   195,3      0t0  584 /dev/nvidia3
kubelet 744987 root   48u   CHR   195,0      0t0  569 /dev/nvidia0
kubelet 744987 root   49u   CHR   195,0      0t0  569 /dev/nvidia0
kubelet 744987 root   50u   CHR   195,1      0t0  572 /dev/nvidia1
kubelet 744987 root   51u   CHR   195,1      0t0  572 /dev/nvidia1
kubelet 744987 root   52u   CHR   195,2      0t0  579 /dev/nvidia2
kubelet 744987 root   53u   CHR   195,2      0t0  579 /dev/nvidia2
kubelet 744987 root   54u   CHR   195,3      0t0  584 /dev/nvidia3
kubelet 744987 root   55u   CHR   195,3      0t0  584 /dev/nvidia3
```

### 删除进程
```shell
$ sudo kill -9 744987
```

### 删除 Nvidia Driver
```shell
$ sudo rmmod nvidia
```

## FAQ
```shell
$ nvidia-smi
Failed to initialize NVML: Driver/library version mismatch
```

```shell
$ sudo rmmod nvidia
rmmod: ERROR: Module nvidia is in use
```

## 参考资料
* [Can I stop all processes using CUDA in Linux without rebooting?](https://newbedev.com/can-i-stop-all-processes-using-cuda-in-linux-without-rebooting/)
* [NVIDIA CUDA Installation Guide for Linux](https://docs.nvidia.com/cuda/cuda-installation-guide-linux/index.html)
