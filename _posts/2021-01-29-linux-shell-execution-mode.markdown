---
layout: post
title:  "Linux Shell 执行方式"
date:   2021-01-29 00:00:00 +0800
categories: Linux
tags: [Linux, Shell, source, chmod, du]
---

## 在当前shell下一行执行多条命令(;)
```shell
cd /etc/ssh ; cat ssh_config ; pwd ; du -sh /etc/ssh/ssh_config
```

## 创建shell脚本
```shell
vim ssh_config-info.sh
```
```
#!/bin/bash
cd /etc/ssh
cat ssh_config
pwd
du -sh /etc/ssh/ssh_config
```

## shell脚本执行方式
### bash ssh_config-info.sh
* 创建子进程执行脚本
```shell
bash ssh_config-info.sh
```
```
$ pwd
/root
```

### ./ssh_config-info.sh
* 需要执行权限
```shell
chmod u+x ssh_config-info.sh
```
* 使用脚本文件中第一行#!指定的shell创建子进程执行脚本
```shell
./ssh_config-info.sh
```
```
$ pwd
/root
```

### source ssh_config-info.sh
* 在当前shell进程中执行，会对当前shell产生影响
```shell
source ssh_config-info.sh
```
```
$ pwd
/etc/ssh
```

### . ssh_config-info.sh
* 在当前shell进程中执行，会对当前shell产生影响（.相当于source）
```shell
. ssh_config-info.sh
```
```
$ pwd
/etc/ssh
```
