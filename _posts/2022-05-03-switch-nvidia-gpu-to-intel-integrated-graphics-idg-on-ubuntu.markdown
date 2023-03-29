---
layout: post
title:  "Ubuntu 上将 NVIDIA GPU 切换为 Intel 集成显卡 IGD"
date:   2022-05-03 08:00:00 +0800
categories: IGD
tags: [Ubuntu, GPU, NVIDIA, Intel, X11, lspci, lshw]
---

IGD（Integrated Graphics Device）

操作系统：Ubuntu 18.04，主机有一张 NVIDIA 的独立显卡 GP106 [GeForce GTX 1060 6GB]，还有 Intel 酷睿处理器 i5 8500 自带的集成显卡（Intel UHD Graphics 630）。为了更充分的使用独立显卡用于深度学习计算，需要把集成显卡用于显示。在这个过程中遇到了各种各样的问题：
* 鼠标和键盘失灵。
* 登录 X Window 时，输入正确的密码不能登录。

## BIOS 设置
### 显卡设置
* IGD 内置图形显示集成显卡
* PEG 独立PCI Express接口图形显卡

选择 ```IGD```，保存退出。

## 配置 X Window
### 显示显卡设备信息
#### lspci
```shell
lspci -k | grep -EA3 'VGA|3D|Display'
  |    | |   |    |        \- Only VGA is not good enough,
  |    | |   |    |           because Nvidia mobile adapters
  |    | |   |    |           are shown as 3D and some AMD
  |    | |   |    |           adapters are shown as Display.
  |    | |   |    \---------  Print 3 lines after the regexp match.
  |    | |   \--------------  program for searching patterns in files
  |    | |                    (regular expressions)
  |    | \------------------  pipe used for passing the results of the
  |    |                      first command (lspci -k) to the next (grep)
  |    \--------------------  Show kernel drivers handling each device.
  \-------------------------  utility for displaying information
                              about PCI buses in the system and 
                              devices connected to them
```

```
00:02.0 VGA compatible controller: Intel Corporation Device 3e92
	Subsystem: Micro-Star International Co., Ltd. [MSI] Device 7b23
	Kernel driver in use: i915
	Kernel modules: i915
--
01:00.0 VGA compatible controller: NVIDIA Corporation GP106 [GeForce GTX 1060 6GB] (rev a1)
	Subsystem: ASUSTeK Computer Inc. GP106 [GeForce GTX 1060 6GB]
	Kernel driver in use: nvidia
	Kernel modules: nvidiafb, nouveau, nvidia_drm, nvidia
```

#### lshw
```shell
lshw -c video
```

### 编辑配置文件 xorg.conf
```shell
sudo vim /etc/X11/xorg.conf
```

```
Section "Device"
    Identifier     "Device0"
    Driver         "intel"
    VendorName     "Intel Corporation"
    BusID          "PCI:0:2:0"
EndSection
```

## 重启
```shell
sudo reboot
```

## 其它
### 查看 X Window 当前使用的显示驱动
```shell
$ sudo ls -l /usr/lib/xorg/modules/drivers/
总用量 1756
-rw-r--r-- 1 root root 1703208 1月  17  2018 intel_drv.so
-rw-r--r-- 1 root root   90360 12月 14 22:31 modesetting_drv.so
```

### 查看是否使用默认的显示驱动 nouveau
什么都不显示，代表没有使用默认的显示驱动
```shell
$ lsmod | grep nouveau
```

## 解决问题
### 鼠标和键盘失灵。
```shell
sudo apt install xserver-xorg-input-all
```

### 登录 X Window 时，输入正确的密码不能登录。
1. 按任意组合键 ```Ctrl+Alt+F1```...```F6``` 打开tty

2. 删除文件 ```.Xauthority```（可能不在当前用户目录）
```shell
rm .Xauthority
```

3. 按键 ```Ctrl+Alt+F7```，重新进入图形界面登录。

## 参考资料
* [Intel Graphics for Linux](https://01.org/linuxgraphics)
* [解决Ubuntu输入密码界面系统键盘鼠标失灵](https://blog.csdn.net/To_be_little/article/details/124509655)
* [Ubuntu正确输入用户名密码，但无法进入桌面的问题](https://www.jianshu.com/p/ebf44c9db85e)
* [linux(ubuntu)查看硬件设备命令](https://blog.csdn.net/jiangph1001/article/details/80090564)
* [Xorg](https://wiki.archlinux.org/title/Xorg)
* [Xorg/指南](https://wiki.gentoo.org/wiki/Xorg/Guide/zh-cn)
* [Xorg.conf的生成以及配置](https://blog.csdn.net/zhang19900822/article/details/21973521)
* [How do I find version of Intel graphics card drivers installed?](https://askubuntu.com/questions/1163390/how-do-i-find-version-of-intel-graphics-card-drivers-installed)
* [nvidia-xconfig](https://manpages.ubuntu.com/manpages/bionic/man1/alt-nvidia-384-xconfig.1.html)
* [Ubuntu – How to get and install Intel i915 drivers on ubuntu 18.04](https://itectec.com/ubuntu/ubuntu-how-to-get-and-install-intel-i915-drivers-on-ubuntu-18-04/)
* [Rebuild and Install Module i915 for GPU Analysis on Ubuntu*](https://www.intel.com/content/www/us/en/develop/documentation/vtune-help/top/installation/set-up-system-for-gpu-analysis/rebuild-and-install-i915-module-ubuntu.html)
* [How to Change Mouse and Touchpad Settings Using Xinput in Linux](https://linuxhint.com/change_mouse_touchpad_settings_xinput_linux/)
* [BIOS中显卡设置选项IGD,PCI,PEG的含义](https://iknow.lenovo.com.cn/detail/dc_091427.html)
