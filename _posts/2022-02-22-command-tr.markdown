---
layout: post
title:  "命令tr"
date:   2022-02-22 00:00:00 +0800
categories: Command
tags: [Linux, tr]
---

```shell
$ df -h
Filesystem      Size  Used Avail Use% Mounted on
udev            126G     0  126G   0% /dev
tmpfs            26G  4.0M   26G   1% /run
/dev/sda2       548G   50G  471G  10% /
tmpfs           126G     0  126G   0% /sys/fs/cgroup
/dev/sda1       511M  7.9M  504M   2% /boot/efi
/dev/sdb1       2.0T  4.7G  1.9T   1% /data
```

## 字母小写转大写
```shell
$ df -h | tr [:lower:] [:upper:]
```
```
FILESYSTEM      SIZE  USED AVAIL USE% MOUNTED ON
UDEV            126G     0  126G   0% /DEV
TMPFS            26G  4.0M   26G   1% /RUN
/DEV/SDA2       548G   50G  471G  10% /
TMPFS           126G     0  126G   0% /SYS/FS/CGROUP
/DEV/SDA1       511M  7.9M  504M   2% /BOOT/EFI
/DEV/SDB1       2.0T  4.7G  1.9T   1% /DATA
```

```shell
$ df -h | tr a-z A-Z
```

## 字母大写转小写
```shell
$ df -h | tr [:upper:] [:lower:]
$ df -h | tr A-Z a-z
```

## 空格转换成逗号(,)
```shell
$ df -h | tr -s ' ' ','
```
```
Filesystem,Size,Used,Avail,Use%,Mounted,on
udev,126G,0,126G,0%,/dev
tmpfs,26G,4.0M,26G,1%,/run
/dev/sda2,548G,50G,471G,10%,/
tmpfs,126G,0,126G,0%,/sys/fs/cgroup
/dev/sda1,511M,7.9M,504M,2%,/boot/efi
/dev/sdb1,2.0T,4.7G,1.9T,1%,/data
```
* ```-s``` 重复的字符序列

## 删除
### 删除字符
```shell
$ echo 'Hello world!' | tr -d hello
H wrd!
```

### 删除数字
```shell
$ echo "my ID is 73535" | tr -d [:digit:]
```
```
my ID is 
```

### 删除除数字以外的字符
```shell
$ echo "my ID is 73535" | tr -cd [:digit:]
```
```
73535
```

## 参考资料
* [tr command in Unix/Linux with examples](https://www.geeksforgeeks.org/tr-command-in-unix-linux-with-examples/)
