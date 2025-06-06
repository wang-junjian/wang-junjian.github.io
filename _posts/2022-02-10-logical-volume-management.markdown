---
layout: single
title:  "逻辑卷管理(Logical Volume Management)"
date:   2022-02-10 00:00:00 +0800
categories: Linux
tags: [lvm, lsblk, mkfs, mount, fstab]
---

![](/images/2022/lvm.jpg)

## 查看 LVM 的相关命令
```shell
man lvm
```

```shell
lvm --help
```

## 查看系统的块设备
```shell
$ lsblk
```
```
NAME             MAJ:MIN RM   SIZE RO TYPE MOUNTPOINT
loop0              7:0    0  43.4M  1 loop /snap/snapd/14549
loop1              7:1    0  43.3M  1 loop /snap/snapd/14295
loop2              7:2    0  76.3M  1 loop /snap/lxd/22407
loop3              7:3    0  61.9M  1 loop /snap/core20/1328
loop4              7:4    0  55.5M  1 loop /snap/core18/2253
loop5              7:5    0  55.5M  1 loop /snap/core18/2284
loop7              7:7    0  94.5M  1 loop /snap/go/9028
loop8              7:8    0  94.5M  1 loop /snap/go/8839
loop9              7:9    0  76.3M  1 loop /snap/lxd/22358
loop10             7:10   0  61.9M  1 loop /snap/core20/1270
sda                8:0    0 558.9G  0 disk 
├─sda1             8:1    0   512M  0 part /boot/efi
└─sda2             8:2    0 558.4G  0 part /
sdb                8:16   0   8.8T  0 disk 
```

## 物理卷 Physical Volume (PV)
### 创建物理卷 pvcreate
```shell
$ sudo pvcreate /dev/sdb
```
```
  Physical volume "/dev/sdb" successfully created.
```

### 显示物理卷的信息 pvs
```shell
$ sudo pvs
```
```
  PV         VG Fmt  Attr PSize PFree
  /dev/sdb      lvm2 ---  8.73t 8.73t
```

### 显示物理卷的详细信息 pvdisplay
```shell
$ sudo pvdisplay
```
```
  --- Physical volume ---
  PV Name               /dev/sdb
  VG Name               datas
  PV Size               8.73 TiB / not usable <4.34 MiB
  Allocatable           yes (but full)
  PE Size               4.00 MiB
  Total PE              2289234
  Free PE               0
  Allocated PE          2289234
  PV UUID               qw1nGJ-y4AM-z55w-vTtI-DycM-INTd-jGgMoW
```

## 卷组 Volume Group (VG)
### 创建卷组 vgcreate
```shell
$ sudo vgcreate ai-data /dev/sdb
```
```
  Volume group "datas" successfully created
```

### 显示卷组的信息 vgs
```shell
$ sudo vgs
```
```
  VG      #PV #LV #SN Attr   VSize VFree
  datas   1   0   0 wz--n- 8.73t 8.73t
```

### 显示卷组的详细信息 vgdisplay
```shell
$ sudo vgdisplay 
```
```
  --- Volume group ---
  VG Name               datas
  System ID             
  Format                lvm2
  Metadata Areas        1
  Metadata Sequence No  3
  VG Access             read/write
  VG Status             resizable
  MAX LV                0
  Cur LV                1
  Open LV               1
  Max PV                0
  Cur PV                1
  Act PV                1
  VG Size               8.73 TiB
  PE Size               4.00 MiB
  Total PE              2289234
  Alloc PE / Size       2289234 / 8.73 TiB
  Free  PE / Size       0 / 0   
  VG UUID               sp1fAe-do5f-HT5V-WkZY-AQVe-nBL6-tMesve
```

## 逻辑卷 Logical Volume (LV)
### 使用整个卷组创建逻辑卷 lvcreate
```shell
$ sudo lvcreate -l 100%VG -n ai-data datas
```
```
WARNING: ext4 signature detected on /dev/datas/ai-data at offset 1080. Wipe it? [y/n]: y
  Wiping ext4 signature on /dev/datas/ai-data.
  Logical volume "ai-data" created.
```

### 显示逻辑卷的信息 lvs
```shell
$ sudo lvs
```
```
  LV      VG    Attr       LSize Pool Origin Data%  Meta%  Move Log Cpy%Sync Convert
  ai-data datas -wi-a----- 8.73t
```

### 显示逻辑卷的详细信息 lvdisplay
```shell
$ sudo lvdisplay
```
```
  --- Logical volume ---
  LV Path                /dev/datas/ai-data
  LV Name                ai-data
  VG Name                datas
  LV UUID                vL1JGr-IPUi-MQiK-76t7-W6WQ-c8r8-8ztgu3
  LV Write Access        read/write
  LV Creation host, time gpu1, 2022-02-09 15:08:28 +0800
  LV Status              available
  # open                 0
  LV Size                8.73 TiB
  Current LE             2289234
  Segments               1
  Allocation             inherit
  Read ahead sectors     auto
  - currently set to     256
  Block device           253:0
```

## 格式化逻辑卷
通过 lvdisplay 来查看 LV Path
```shell
$ sudo mkfs -t ext4 /dev/datas/ai-data
```
```
mke2fs 1.45.5 (07-Jan-2020)
Creating filesystem with 2344175616 4k blocks and 293023744 inodes
Filesystem UUID: 4c91e454-bd2e-468b-a978-50f319aaf131
Superblock backups stored on blocks:
        32768, 98304, 163840, 229376, 294912, 819200, 884736, 1605632, 2654208,
        4096000, 7962624, 11239424, 20480000, 23887872, 71663616, 78675968,
        102400000, 214990848, 512000000, 550731776, 644972544, 1934917632

Allocating group tables: done
Writing inode tables: done
Creating journal (262144 blocks): done
Writing superblocks and filesystem accounting information: done
```

## 挂载逻辑卷
### 临时挂载
```shell
$ sudo mount /dev/datas/ai-data /data
```

### 永久挂载（重启会自动挂载）
```shell
sudo vim /etc/fstab
```
```
/dev/datas/ai-data /data ext4 defaults 0 0
```

### 检查挂载是否有效
```shell
$ df /data -h
```
```
Filesystem                  Size  Used Avail Use% Mounted on
/dev/mapper/datas-ai--data  8.7T   84M  8.3T   1% /data
```

## 参考资料
* [如何在 Linux 中创建/配置 LVM（逻辑卷管理）](https://linux.cn/article-12670-1.html)
