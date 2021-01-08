---
layout: post
title:  "磁盘：分区－格式化－挂载"
date:   2020-09-03 00:00:00 +0800
categories: Linux
tags: [Linux, Disk, lsblk, fdisk, mkfs, mount, fstab]
---

## 分区
### 列出块设备信息
```shell
lsblk
```
```
NAME   MAJ:MIN RM  SIZE RO TYPE MOUNTPOINT
loop0    7:0    0 71.3M  1 loop /snap/lxd/18772
loop1    7:1    0 55.4M  1 loop /snap/core18/1944
loop2    7:2    0 31.1M  1 loop /snap/snapd/10492
loop3    7:3    0 31.1M  1 loop /snap/snapd/10707
loop4    7:4    0 71.2M  1 loop /snap/lxd/18674
loop5    7:5    0 55.4M  1 loop /snap/core18/1932
sda      8:0    1  558G  0 disk 
├─sda1   8:1    1    1M  0 part 
└─sda2   8:2    1  558G  0 part /
sdb      8:16   1  2.2T  0 disk 
```

### 创建分区
```shell
sudo fdisk /dev/sdb
```
```
Welcome to fdisk (util-linux 2.34).
Changes will remain in memory only, until you decide to write them.
Be careful before using the write command.

Device does not contain a recognized partition table.
The size of this disk is 2.2 TiB (2394433781760 bytes). DOS partition table format cannot be used on drives for volumes larger than 2199023255040 bytes for 512-byte sectors. Use GUID partition table format (GPT).

Created a new DOS disklabel with disk identifier 0xee2e974f.

Command (m for help): m

Help:

  DOS (MBR)
   a   toggle a bootable flag
   b   edit nested BSD disklabel
   c   toggle the dos compatibility flag

  Generic
   d   delete a partition
   F   list free unpartitioned space
   l   list known partition types
   n   add a new partition
   p   print the partition table
   t   change a partition type
   v   verify the partition table
   i   print information about a partition

  Misc
   m   print this menu
   u   change display/entry units
   x   extra functionality (experts only)

  Script
   I   load disk layout from sfdisk script file
   O   dump disk layout to sfdisk script file

  Save & Exit
   w   write table to disk and exit
   q   quit without saving changes

  Create a new label
   g   create a new empty GPT partition table
   G   create a new empty SGI (IRIX) partition table
   o   create a new empty DOS partition table
   s   create a new empty Sun partition table


Command (m for help): n
Partition type
   p   primary (0 primary, 0 extended, 4 free)
   e   extended (container for logical partitions)
Select (default p): p
Partition number (1-4, default 1): 
First sector (2048-4294967295, default 2048): 
Last sector, +/-sectors or +/-size{K,M,G,T,P} (2048-4294967295, default 4294967295): 

Created a new partition 1 of type 'Linux' and of size 2 TiB.

Command (m for help): w
The partition table has been altered.
Calling ioctl() to re-read partition table.
Syncing disks.
```

## 格式化
### 创建文件系统ext4
```shell
sudo mkfs.ext4 /dev/sdb1
```
```
mke2fs 1.45.5 (07-Jan-2020)
Creating filesystem with 536870656 4k blocks and 134217728 inodes
Filesystem UUID: 63112c70-92fb-4e36-b118-67004e77158b
Superblock backups stored on blocks: 
	32768, 98304, 163840, 229376, 294912, 819200, 884736, 1605632, 2654208, 
	4096000, 7962624, 11239424, 20480000, 23887872, 71663616, 78675968, 
	102400000, 214990848, 512000000

Allocating group tables: done                            
Writing inode tables: done                            
Creating journal (262144 blocks): done
Writing superblocks and filesystem accounting information: done   
```

### 查看文件系统信息
```shell
lsblk -f
```
```
NAME   FSTYPE   LABEL UUID                                 FSAVAIL FSUSE% MOUNTPOINT
loop0  squashfs                                                  0   100% /snap/lxd/18772
loop1  squashfs                                                  0   100% /snap/core18/1944
loop2  squashfs                                                  0   100% /snap/snapd/10492
loop3  squashfs                                                  0   100% /snap/snapd/10707
loop4  squashfs                                                  0   100% /snap/lxd/18674
loop5  squashfs                                                  0   100% /snap/core18/1932
sda                                                                       
├─sda1                                                                    
└─sda2 ext4           9e865880-fe90-4ba0-923e-42d3f5a5a417  503.7G     3% /
sdb                                                                       
└─sdb1 ext4           63112c70-92fb-4e36-b118-67004e77158b
```

## 挂载
### 创建挂载点
```shell
sudo mkdir /data
```

### 挂载文件系统
```shell
sudo mount /dev/sdb1 /data
```

### 挂载文件系统(系统重启将失效)
```shell
sudo mount /dev/sdb1 /data
```

### 挂载文件系统（系统重启会自动挂载）
```shell
sudo nano /etc/fstab
/dev/disk/by-uuid/63112c70-92fb-4e36-b118-67004e77158b /data ext4 defaults 0 0
```
