---
layout: post
title:  "NFS配置"
date:   2020-09-10 00:00:00 +0800
categories: Linux
tags: [Linux, Ubuntu, NFS]
---

## Ubuntu
### 服务端
* 安装服务端
```shell
sudo apt install nfs-kernel-server
```

* 查看服务状态
```shell
sudo systemctl status nfs-server
```

* 查看开启的NFS协议
```shell
sudo cat /proc/fs/nfsd/versions
```
```
-2 +3 +4 +4.1 +4.2
```

* 配置访问的路径
```shell
sudo nano /etc/exports
```
```
/data/nfs        172.16.33.0/24(rw,sync,fsid=0,crossmnt,no_subtree_check)
```

* 应用配置
```shell
sudo exportfs -ra
```

* 查看当前应用
```shell
sudo exportfs -v
```

* 重启服务
```shell
sudo systemctl restart nfs-server
```

### 客户端
* 安装客户端
```shell
sudo apt install nfs-common
```

* 查看NFS服务器导出列表
```shell
showmount -e 172.16.33.157
```
```shell
Export list for 172.16.33.157:
/data/nfs 172.16.33.0/24,172.16.128.164
```

* 挂载NFS
```shell
sudo mount -t nfs 172.16.33.157:/ $(pwd)/nfs
```

* 移除挂载
```shell
sudo umount $(pwd)/nfs
```

### 参考资料
* [如何在Ubuntu 18.04上安装和配置NFS服务器](https://www.myfreax.com/how-to-install-and-configure-an-nfs-server-on-ubuntu-18-04/)
* [ubuntu18.04搭建NFS服务器](https://www.shuzhiduo.com/A/VGzlQbv1Jb/)
