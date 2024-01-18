---
layout: post
title:  "NVIDIA Driver 安装"
date:   2024-01-08 08:00:00 +0800
categories: NVIDIA-Driver
tags: [NVIDIA-Driver, NVIDIA, CUDA, GPU, lsof, apt, dpkg, libc6-dev, build-essential]
---

困难重重 😭

服务器是 NVIDIA Tesla T4，系统是 Ubuntu 20.04，从 Kubernetes 集群中分离出来的，因 Tabby 请求 CUDA >= 11.7，需要重新安装新版本的驱动。

## [下载 NVIDIA Driver](https://www.nvidia.com/download/index.aspx)
- [CUDA Toolkit Archive](https://developer.nvidia.com/cuda-toolkit-archive)

## [安装 NVIDIA Driver](https://docs.nvidia.com/datacenter/tesla/tesla-installation-notes/index.html)
```shell
sudo sh NVIDIA-Linux-x86_64-535.129.03.run
```

就两步就完成了，简单吧 😄

## 实际安装过程 😭

安装驱动

```shell
sudo sh NVIDIA-Linux-x86_64-535.129.03.run
```

日志查看错误信息

```shell
vim /var/log/nvidia-installer.log
```
```
nvidia-installer log file '/var/log/nvidia-installer.log'
creation time: Fri Jan  5 09:38:12 2024
installer version: 535.129.03

PATH: /usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/snap/bin

nvidia-installer command line:
    ./nvidia-installer

Using: nvidia-installer ncurses v6 user interface
-> Detected 64 CPUs online; setting concurrency level to 32.
ERROR: An NVIDIA kernel module 'nvidia' appears to already be loaded in your kernel.  This may be because it is in use (for example, by an X server, a CUDA program, or the NVIDIA Persistence Daemon), but this may also happen if your kernel was configured without support for module unloading.  Please be sure to exit any programs that may be using the GPU(s) before attempting to upgrade your driver.  If no GPU-based programs are running, you know that your kernel supports module unloading, and you still receive this message, then an error may have occurred that has corrupted an NVIDIA kernel module's usage count, for which the simplest remedy is to reboot your computer.
ERROR: Installation has failed.  Please see the file '/var/log/nvidia-installer.log' for details.  You may find suggestions on fixing installation problems in the README available on the Linux driver download page at www.nvidia.com.
```

Google 搜索、ChatGPT、之前的解决方法都不行，最后通过运行 `sudo lsof -n -w /dev/nvidia*` 找到了问题所在，原来是 Kubernetes 的 kubelet 进程占用了 GPU。

```shell
sudo lsof -n -w /dev/nvidia*
```
```
COMMAND   PID USER   FD   TYPE  DEVICE SIZE/OFF NODE NAME
kubelet 47259 root   40u   CHR 195,255      0t0  505 /dev/nvidiactl
kubelet 47259 root   44u   CHR   195,0      0t0  548 /dev/nvidia0
kubelet 47259 root   47u   CHR   195,1      0t0  551 /dev/nvidia1
kubelet 47259 root   48u   CHR   195,2      0t0  556 /dev/nvidia2
kubelet 47259 root   49u   CHR   195,3      0t0  561 /dev/nvidia3
kubelet 47259 root   50u   CHR   195,0      0t0  548 /dev/nvidia0
kubelet 47259 root   51u   CHR   195,0      0t0  548 /dev/nvidia0
kubelet 47259 root   52u   CHR   195,1      0t0  551 /dev/nvidia1
kubelet 47259 root   53u   CHR   195,1      0t0  551 /dev/nvidia1
kubelet 47259 root   54u   CHR   195,2      0t0  556 /dev/nvidia2
kubelet 47259 root   55u   CHR   195,2      0t0  556 /dev/nvidia2
kubelet 47259 root   56u   CHR   195,3      0t0  561 /dev/nvidia3
kubelet 47259 root   57u   CHR   195,3      0t0  561 /dev/nvidia3
```

`lsof` 是一个在 Unix 和类 Unix 系统（如 Linux）上的命令行工具，用于列出当前系统打开的文件。在这里，"文件" 的概念很广泛，除了常见的文件和目录，还包括网络套接字、设备、管道等。
- -n 参数告诉 lsof 不要将网络号转换为主机名，这可以加快 lsof 的运行速度。
- -w 参数告诉 lsof 不要抑制警告信息。
- /dev/nvidia* 是要查看的文件的路径，* 是通配符，表示所有以 /dev/nvidia 开头的文件。在这里，这些文件通常代表 NVIDIA 的设备。

所以，sudo lsof -n -w /dev/nvidia* 命令的作用是查看哪些进程正在使用 NVIDIA 设备。


需要停止 kubelet 服务，这里不能简单的杀掉进程，需要通过 `systemctl` 停止服务，否则 kubelet 会自动重启。

```shell
sudo systemctl stop kubelet
```

再次运行安装命令出现了新的错误，提示缺少 libc 头文件，需要安装 libc 开发包。

```
ERROR: You do not appear to have libc header files installed on your system.  Please install your distribution's libc development package.
```

运行 `sudo apt update` 更新软件源，发现使用的是 arm64 架构的软件源，需要切换到 amd64 架构的软件源。

从其它服务器拷贝 `/etc/apt/sources.list` 文件到当前服务器，然后重新运行 `sudo apt update` 更新软件源。

```shell
sudo apt update
sudo apt-get install libc6-dev
```
```
Reading package lists... Done
Building dependency tree       
Reading state information... Done
Package libc6-dev is not available, but is referred to by another package.
This may mean that the package is missing, has been obsoleted, or
is only available from another source
However the following packages replace it:
  libcrypt-dev

E: Package 'libc6-dev' has no installation candidate
```

使用 Docker 下载 `build-essential` 开发包。先模拟安装，找到需要的开发包，然后下载。

```shell
mkdir offline
docker run --rm -it -v `pwd`/offline:/offline ubuntu:20.04 bash
```
```shell
root@a7ce40aba423:/# apt update
root@a7ce40aba423:/# cd offline/
root@a7ce40aba423:/offline# apt-get install -s build-essential
root@a7ce40aba423:/offline# apt-get download binutils binutils-common binutils-x86-64-linux-gnu build-essential cpp cpp-9 dirmngr dpkg-dev fakeroot g++ g++-9 gcc gcc-9 gcc-9-base gnupg gnupg-l10n gnupg-utils gpg gpg-agent gpg-wks-client gpg-wks-server gpgconf gpgsm libalgorithm-diff-perl libalgorithm-diff-xs-perl libalgorithm-merge-perl libasan5 libasn1-8-heimdal libassuan0 libatomic1 libbinutils libc-dev-bin libc6-dev libcc1-0 libcrypt-dev libctf-nobfd0 libctf0 libdpkg-perl libfakeroot libfile-fcntllock-perl libgcc-9-dev libgdbm-compat4 libgdbm6 libgomp1 libgssapi3-heimdal libhcrypto4-heimdal libheimbase1-heimdal libheimntlm0-heimdal libhx509-5-heimdal libisl22 libitm1 libkrb5-26-heimdal libksba8 libldap-2.4-2 libldap-common liblocale-gettext-perl liblsan0 libmpc3 libmpfr6 libnpth0 libperl5.30 libquadmath0 libreadline8 libroken18-heimdal libsasl2-2 libsasl2-modules libsasl2-modules-db libsqlite3-0 libssl1.1 libstdc++-9-dev libtsan0 libubsan1 libwind0-heimdal linux-libc-dev make manpages manpages-dev netbase patch perl perl-modules-5.30 pinentry-curses readline-common xz-utils
```

安装本地开发包。

```shell
sudo dpkg -i offline/*.deb
```

查看 CUDA 版本。

```shell
nvidia-smi
```
```
Mon Jan  8 10:01:16 2024       
+---------------------------------------------------------------------------------------+
| NVIDIA-SMI 535.129.03             Driver Version: 535.129.03   CUDA Version: 12.2     |
|-----------------------------------------+----------------------+----------------------+
| GPU  Name                 Persistence-M | Bus-Id        Disp.A | Volatile Uncorr. ECC |
| Fan  Temp   Perf          Pwr:Usage/Cap |         Memory-Usage | GPU-Util  Compute M. |
|                                         |                      |               MIG M. |
|=========================================+======================+======================|
|   0  Tesla T4                       Off | 00000000:43:00.0 Off |                    0 |
| N/A   49C    P0              27W /  70W |      2MiB / 15360MiB |      0%      Default |
|                                         |                      |                  N/A |
+-----------------------------------------+----------------------+----------------------+
|   1  Tesla T4                       Off | 00000000:47:00.0 Off |                    0 |
| N/A   49C    P0              28W /  70W |      2MiB / 15360MiB |      0%      Default |
|                                         |                      |                  N/A |
+-----------------------------------------+----------------------+----------------------+
|   2  Tesla T4                       Off | 00000000:8E:00.0 Off |                    0 |
| N/A   47C    P0              27W /  70W |      2MiB / 15360MiB |      0%      Default |
|                                         |                      |                  N/A |
+-----------------------------------------+----------------------+----------------------+
|   3  Tesla T4                       Off | 00000000:92:00.0 Off |                    0 |
| N/A   47C    P0              27W /  70W |      2MiB / 15360MiB |      6%      Default |
|                                         |                      |                  N/A |
+-----------------------------------------+----------------------+----------------------+
                                                                                         
+---------------------------------------------------------------------------------------+
| Processes:                                                                            |
|  GPU   GI   CI        PID   Type   Process name                            GPU Memory |
|        ID   ID                                                             Usage      |
|=======================================================================================|
|  No running processes found                                                           |
+---------------------------------------------------------------------------------------+
```

## FAQ
### 每张显卡都运行进程 `/usr/lib/xorg/Xorg`
```shell
+---------------------------------------------------------------------------------------+
| NVIDIA-SMI 535.146.02             Driver Version: 535.146.02   CUDA Version: 12.2     |
|-----------------------------------------+----------------------+----------------------+
| GPU  Name                 Persistence-M | Bus-Id        Disp.A | Volatile Uncorr. ECC |
| Fan  Temp   Perf          Pwr:Usage/Cap |         Memory-Usage | GPU-Util  Compute M. |
|                                         |                      |               MIG M. |
|=========================================+======================+======================|
|   0  Tesla T4                       Off | 00000000:43:00.0 Off |                    0 |
| N/A   35C    P8               9W /  70W |     11MiB / 15360MiB |      0%      Default |
|                                         |                      |                  N/A |
+-----------------------------------------+----------------------+----------------------+
|   1  Tesla T4                       Off | 00000000:47:00.0 Off |                    0 |
| N/A   36C    P8               9W /  70W |     11MiB / 15360MiB |      0%      Default |
|                                         |                      |                  N/A |
+-----------------------------------------+----------------------+----------------------+
|   2  Tesla T4                       Off | 00000000:8E:00.0 Off |                    0 |
| N/A   34C    P8              10W /  70W |     11MiB / 15360MiB |      0%      Default |
|                                         |                      |                  N/A |
+-----------------------------------------+----------------------+----------------------+
|   3  Tesla T4                       Off | 00000000:92:00.0 Off |                    0 |
| N/A   34C    P8               9W /  70W |     11MiB / 15360MiB |      0%      Default |
|                                         |                      |                  N/A |
+-----------------------------------------+----------------------+----------------------+
                                                                                         
+---------------------------------------------------------------------------------------+
| Processes:                                                                            |
|  GPU   GI   CI        PID   Type   Process name                            GPU Memory |
|        ID   ID                                                             Usage      |
|=======================================================================================|
|    0   N/A  N/A      1875      G   /usr/lib/xorg/Xorg                            4MiB |
|    0   N/A  N/A      3189      G   /usr/lib/xorg/Xorg                            4MiB |
|    1   N/A  N/A      1875      G   /usr/lib/xorg/Xorg                            4MiB |
|    1   N/A  N/A      3189      G   /usr/lib/xorg/Xorg                            4MiB |
|    2   N/A  N/A      1875      G   /usr/lib/xorg/Xorg                            4MiB |
|    2   N/A  N/A      3189      G   /usr/lib/xorg/Xorg                            4MiB |
|    3   N/A  N/A      1875      G   /usr/lib/xorg/Xorg                            4MiB |
|    3   N/A  N/A      3189      G   /usr/lib/xorg/Xorg                            4MiB |
+---------------------------------------------------------------------------------------+
```

`/usr/lib/xorg/Xorg` 是 X Window 系统的核心组件，它负责与硬件交互并提供图形环境。如果你正在使用图形界面，那么停止这个进程可能会导致你的图形界面停止工作。

使用以下的命令来查看你的系统正在使用哪个显示管理器：

```shell
cat /etc/X11/default-display-manager
```
```
/usr/sbin/gdm3
```

这个命令会输出你的默认显示管理器的完整路径。然后，你可以使用相应的命令来停止你的显示管理器。你可以使用以下的命令来停止它：

```shell
sudo service gdm stop
```

```shell
sudo service lightdm stop
```

这个命令会停止 lightdm 服务，lightdm 是 Ubuntu 默认的显示管理器，它负责启动 Xorg 进程。请注意，这个命令会立即停止你的图形界面，你需要保存所有的工作并关闭所有的程序。

如果你的系统使用的是其他的显示管理器，例如 gdm 或 kdm，你需要将 lightdm 替换为你的显示管理器的名称。

## 参考资料
- [在Linux上安装CUDA Toolkit](http://www.wangjunjian.com/gpu/2022/02/08/install-cuda-toolkit-on-linux.html)
- [在Ubuntu上下载docker和nvidia-docker2离线安装包](http://www.wangjunjian.com/docker/2020/12/02/download-docker-and-nvidia-docker2-offline-installation-package-on-ubuntu.html)
- [How to solve An NVIDIA kernel module nvidia appears to already be loaded in your kernel](https://junyonglee.me/ubuntu/An-nvidia-kernel-module/)
