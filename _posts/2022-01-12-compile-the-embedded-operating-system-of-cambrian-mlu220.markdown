---
layout: post
title:  "编译寒武纪MLU220的嵌入式操作系统"
date:   2022-01-12 00:00:00 +0800
categories: EdgeAI
tags: [Cambricon, git]
---

> OpenIL 是一个基于 Buildroot 的开源项目，专为嵌入式工业解决方案而设计。

> Buildroot 是一个简单、高效、易用的工具，通过交叉编译生成嵌入式 Linux 系统。

## 获取 OpenIL
```shell
git clone https://github.com/openil/openil.git
cd openil/
```

## 切换版本
### 查看版本
```shell
$ git tag
OpenIL-201705
OpenIL-201708
OpenIL-201712
OpenIL-201803
OpenIL-201805
OpenIL-201808
OpenIL-201810
OpenIL-201901
OpenIL-201904
OpenIL-201908
OpenIL-v1.10-202012
OpenIL-v1.10-202012-EAR
OpenIL-v1.11-202104
OpenIL-v1.11-RC2
OpenIL-v1.6.1-201909
OpenIL-v1.6.2-201911
OpenIL-v1.7-202001
OpenIL-v1.7-202001-update
OpenIL-v1.8-202005
OpenIL-v1.8.1-202009
OpenIL-v1.8.2-202009
OpenIL-v1.9-202009
```

### 切换版本
```shell
git branch OpenIL-v1.8-202005
```

### 检查是否成功
```shell
$ git branch
* OpenIL-v1.8-202005
  master
  –a
```

## 配置
### 查看工控机的配置
```shell
$ ls ./configs | grep "nxp_ls1043"
nxp_ls1043ardb-64b_defconfig
nxp_ls1043ardb-64b_ubuntu_defconfig
nxp_ls1043ardb-64b_ubuntu_full_defconfig
nxp_ls1043ardb_baremetal-64b_defconfig
```

### 生成配置文件
```shell
make nxp_ls1043ardb-64b_ubuntu_defconfig
```

## 编译
```shell
LD_LIBRARY_PATH=
make
```

## FAQ
* 存在环境变量 LD_LIBRARY_PATH（设置为空就解决了）
```shell
$ make
/usr/bin/make -j1 O=/home/lnsoft/wjj/cambricon/mlu220/openil/output HOSTCC="/usr/bin/gcc" HOSTCXX="/usr/bin/g++" syncconfig
You seem to have the current working directory in your
LD_LIBRARY_PATH environment variable. This doesn't work.
make[1]: *** [support/dependencies/dependencies.mk:27: dependencies] Error 1
make: *** [Makefile:84: _all] Error 2
```

## 参考资料
* [OpenIL](https://github.com/openil/openil)
* [Buildroot](https://buildroot.org)
* [Xilinx Edge AI](https://www.xilinx.com/applications/industrial/analytics-machine-learning.html)
* [Buildroot使用介绍](https://www.cnblogs.com/arnoldlu/p/9553995.html)
