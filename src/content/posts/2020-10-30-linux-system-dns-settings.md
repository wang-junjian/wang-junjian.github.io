---
layout: single
title:  "Linux系统DNS设置"
date:   2020-10-30 00:00:00 +0800
categories: Linux
tags: [Ubuntu, DNS]
---

> 之前在文件```/etc/resolv.conf```中设置了，过段时间总是自动恢复默认值。（注释中写的很详细，是不可编辑的由系统自动生成的文件）

## /etc/resolv.conf
```shell
# This file is managed by man:systemd-resolved(8). Do not edit.
#
# This is a dynamic resolv.conf file for connecting local clients to the
# internal DNS stub resolver of systemd-resolved. This file lists all
# configured search domains.
#
# Run "resolvectl status" to see details about the uplink DNS servers
# currently in use.
#
# Third party programs must not access this file directly, but only through the
# symlink at /etc/resolv.conf. To manage man:resolv.conf(5) in a different way,
# replace this symlink by a static file or a different symlink.
#
# See man:systemd-resolved.service(8) for details about the supported modes of
# operation for /etc/resolv.conf.

nameserver 127.0.0.127
options edns0
```

## 设置DNS
```shell
$ sudo nano /etc/systemd/resolved.conf
#  This file is part of systemd.
#
#  systemd is free software; you can redistribute it and/or modify it
#  under the terms of the GNU Lesser General Public License as published by
#  the Free Software Foundation; either version 2.1 of the License, or
#  (at your option) any later version.
#
# Entries in this file show the compile time defaults.
# You can change settings by editing this file.
# Defaults can be restored by simply deleting this file.
#
# See resolved.conf(5) for details

[Resolve]
DNS=8.8.8.8
```

## 重启服务systemd-resolved
```shell
$ sudo systemctl restart systemd-resolved
```
