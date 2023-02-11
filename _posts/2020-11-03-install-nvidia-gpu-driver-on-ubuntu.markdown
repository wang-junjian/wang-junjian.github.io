---
layout: post
title:  "在Ubuntu上安装NVIDIA GPU驱动"
date:   2020-11-03 00:00:00 +0800
categories: GPU
tags: [Linux, Ubuntu, GPU, NVIDIA]
---

> 在一台新安装的 Ubuntu20.04 系统上安装 NVIDIA GPU 驱动。

## 安装 gcc make 工具
```shell
$ sudo apt-get install gcc make
```

## 禁用系统默认驱动 nouveau
1. 编辑配置文件
```shell
$ sudo nano /etc/modprobe.d/blacklist-nouveau.conf
blacklist nouveau
options nouveau modeset=0
```
```shell
## 另一种方法
# cat << EOF >/etc/modprobe.d/blacklist-nouveau.conf
blacklist nouveau
options nouveau modeset=0
EOF
```

2. 更新 initramfs
```shell
$ sudo update-initramfs -u
```

3. 重启系统
```shell
$ sudo reboot
```

4. 验证 nouveau 是否禁用成功（当什么也不显示出来时代表成功）
```shell
$ lsmod | grep nouveau
```

## 安装 NVIDIA 驱动
1. 查看显卡型号 
```shell
$ lspci | grep -i nvidia
0000:43:00.0 3D controller: NVIDIA Corporation TU104GL [Tesla T4] (rev a1)
0000:47:00.0 3D controller: NVIDIA Corporation TU104GL [Tesla T4] (rev a1)
0000:8e:00.0 3D controller: NVIDIA Corporation TU104GL [Tesla T4] (rev a1)
0000:92:00.0 3D controller: NVIDIA Corporation TU104GL [Tesla T4] (rev a1)
```

2. 到[NVIDIA 驱动程序下载]页面下载对应型号的驱动
![](/images/2020/nvidia-driver-download.png)
```shell
$ wget https://cn.download.nvidia.com/tesla/450.80.02/NVIDIA-Linux-x86_64-450.80.02.run
```

3. 安装驱动
```shell
$ sudo sh NVIDIA-Linux-x86_64-450.80.02.run
```

## 查看 GPU 的运行状态
```shell
$ nvidia-smi
Tue Nov  3 08:10:14 2020       
+-----------------------------------------------------------------------------+
| NVIDIA-SMI 450.80.02    Driver Version: 450.80.02    CUDA Version: 11.0     |
|-------------------------------+----------------------+----------------------+
| GPU  Name        Persistence-M| Bus-Id        Disp.A | Volatile Uncorr. ECC |
| Fan  Temp  Perf  Pwr:Usage/Cap|         Memory-Usage | GPU-Util  Compute M. |
|                               |                      |               MIG M. |
|===============================+======================+======================|
|   0  Tesla T4            Off  | 00000000:43:00.0 Off |                    0 |
| N/A   67C    P0    31W /  70W |      0MiB / 15109MiB |      0%      Default |
|                               |                      |                  N/A |
+-------------------------------+----------------------+----------------------+
|   1  Tesla T4            Off  | 00000000:47:00.0 Off |                    0 |
| N/A   68C    P0    31W /  70W |      0MiB / 15109MiB |      0%      Default |
|                               |                      |                  N/A |
+-------------------------------+----------------------+----------------------+
|   2  Tesla T4            Off  | 00000000:8E:00.0 Off |                    0 |
| N/A   65C    P0    30W /  70W |      0MiB / 15109MiB |      0%      Default |
|                               |                      |                  N/A |
+-------------------------------+----------------------+----------------------+
|   3  Tesla T4            Off  | 00000000:92:00.0 Off |                    0 |
| N/A   63C    P0    25W /  70W |      0MiB / 15109MiB |      6%      Default |
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

[NVIDIA 驱动程序下载]: https://www.nvidia.cn/Download/index.aspx?lang=cn

## 参考资料
* [在运行 Linux 的 N 系列 VM 上安装 NVIDIA GPU 驱动程序](https://docs.azure.cn/zh-cn/virtual-machines/linux/n-series-driver-setup)
