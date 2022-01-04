---
layout: post
title:  "Linux下查看img文件内容"
date:   2022-01-04 00:00:00 +0800
categories: Linux
tags: [fdisk, img, mount]
---

> img 磁盘镜像文件

## 查看分区表信息
```shell
$ fdisk sdcard.img

Welcome to fdisk (util-linux 2.34).
Changes will remain in memory only, until you decide to write them.
Be careful before using the write command.


Command (m for help): p
Disk sdcard.img: 2.19 GiB, 2348810240 bytes, 4587520 sectors
Units: sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes
Disklabel type: dos
Disk identifier: 0x00000000

Device      Boot  Start     End Sectors  Size Id Type
sdcard.img1 *    131072  393215  262144  128M  c W95 FAT32 (LBA)
sdcard.img2      393216 4587519 4194304    2G 83 Linux
```

## 挂载分区
1. 使用 ```Start``` 值计算 ```offset``` 值（bytes）
```
393216*512=201326592
```

2. 挂载分区
```shell
$ sudo mount -o loop,offset=201326592 sdcard.img /mnt/
```

3. 查看分区内容
```shell
$ ls /mnt/
bin  boot  dev  etc  home  lib  lost+found  media  mnt  opt  proc  root  run  sbin  srv  sys  tmp  usr  var
```

## 卸载分区
```shell
$ sudo umount /mnt
```
