---
layout: single
title:  "GPU 服务器不能访问"
date:   2023-11-19 08:00:00 +0800
categories: 网络
tags: [traceroute, tcpdump, netstat, lsof, dmesg, journalctl, Linux, 日志]
---

13 号 上午 GPU 服务器突然不能访问了，可以通过 CPU 服务器访问 GPU 服务器。这一周一直在查找问题，这里记录一下过程。

## traceroute 路由追踪
* GPU 服务器
```shell
traceroute gpu1
```
```
traceroute to gpu1 (172.16.33.66), 64 hops max, 52 byte packets
 1  * * *
 2  172.16.136.2 (172.16.136.2)  7.462 ms  3.820 ms  3.014 ms
 3  * * *
 4  * * *
 5  * * *
 6  * * *
 7  * * *
 8  * * *
 9  * * *
10  * * *
```

* CPU 服务器
```shell
traceroute cpu1
```
```
traceroute to cpu1 (172.16.33.157), 64 hops max, 52 byte packets
 1  * * *
 2  172.16.136.2 (172.16.136.2)  7.827 ms  4.712 ms  3.162 ms
 3  * * *
 4  cpu1 (172.16.33.157)  8.619 ms  4.205 ms  4.982 ms
```

## tcpdump 抓包
在GPU服务器上抓取 22 端口的数据包

```shell
sudo tcpdump -i any 'tcp port 22'
```
```
tcpdump: verbose output suppressed, use -v or -vv for full protocol decode
listening on any, link-type LINUX_SLL (Linux cooked v1), capture size 262144 bytes
14:59:21.757214 IP gpu2.ssh > cpu1.60682: Flags [P.], seq 4001681261:4001681457, ack 480004153, win 501, options [nop,nop,TS val 48088535 ecr 2526753149], length 196
14:59:21.757344 IP cpu1.60682 > gpu2.ssh: Flags [.], ack 196, win 501, options [nop,nop,TS val 2526753233 ecr 48088535], length 0
14:59:21.757945 IP gpu2.ssh > cpu1.60682: Flags [P.], seq 196:400, ack 1, win 501, options [nop,nop,TS val 48088536 ecr 2526753233], length 204
14:59:21.757974 IP gpu2.ssh > cpu1.60682: Flags [P.], seq 400:572, ack 1, win 501, options [nop,nop,TS val 48088536 ecr 2526753233], length 172
14:59:21.758023 IP gpu2.ssh > cpu1.60682: Flags [P.], seq 572:752, ack 1, win 501, options [nop,nop,TS val 48088536 ecr 2526753233], length 180
14:59:21.758047 IP cpu1.60682 > gpu2.ssh: Flags [.], ack 400, win 501, options [nop,nop,TS val 2526753234 ecr 48088536], length 0
14:59:21.758047 IP cpu1.60682 > gpu2.ssh: Flags [.], ack 572, win 501, options [nop,nop,TS val 2526753234 ecr 48088536], length 0
14:59:21.758069 IP gpu2.ssh > cpu1.60682: Flags [P.], seq 752:932, ack 1, win 501, options [nop,nop,TS val 48088536 ecr 2526753234], length 180
14:59:21.758131 IP gpu2.ssh > cpu1.60682: Flags [P.], seq 932:1112, ack 1, win 501, options [nop,nop,TS val 48088536 ecr 2526753234], length 180
14:59:21.758144 IP cpu1.60682 > gpu2.ssh: Flags [.], ack 752, win 501, options [nop,nop,TS val 2526753234 ecr 48088536], length 0
14:59:21.758163 IP gpu2.ssh > cpu1.60682: Flags [P.], seq 1112:1284, ack 1, win 501, options [nop,nop,TS val 48088536 ecr 2526753234], length 172
14:59:21.758193 IP cpu1.60682 > gpu2.ssh: Flags [.], ack 932, win 501, options [nop,nop,TS val 2526753234 ecr 48088536], length 0
14:59:21.758202 IP gpu2.ssh > cpu1.60682: Flags [P.], seq 1284:1456, ack 1, win 501, options [nop,nop,TS val 48088536 ecr 2526753234], length 172
14:59:21.758221 IP gpu2.ssh > cpu1.60682: Flags [P.], seq 1456:1788, ack 1, win 501, options [nop,nop,TS val 48088536 ecr 2526753234], length 332
14:59:21.758242 IP cpu1.60682 > gpu2.ssh: Flags [.], ack 1112, win 501, options [nop,nop,TS val 2526753234 ecr 48088536], length 0
14:59:21.758251 IP gpu2.ssh > cpu1.60682: Flags [P.], seq 1788:2104, ack 1, win 501, options [nop,nop,TS val 48088536 ecr 2526753234], length 316
14:59:21.758263 IP gpu2.ssh > cpu1.60682: Flags [P.], seq 2104:2276, ack 1, win 501, options [nop,nop,TS val 48088536 ecr 2526753234], length 172
```

## netstat 查看网络连接状态和统计信息
显示所有处于监听状态的 TCP 和 UDP 网络连接的信息，包括源 IP、目标 IP、源端口、目标端口以及协议类型等。
```shell
netstat -tuln
```

## 查看端口占用的进程
```shell
sudo lsof -i:22
```
```
COMMAND     PID   USER   FD   TYPE     DEVICE SIZE/OFF NODE NAME
sshd    1635782   root    4u  IPv4 1127621335      0t0  TCP cpu1:ssh->192.168.73.2:62014 (ESTABLISHED)
sshd    1635927 lnsoft    4u  IPv4 1127621335      0t0  TCP cpu1:ssh->192.168.73.2:62014 (ESTABLISHED)
sshd    1936495   root    3u  IPv4 1037646169      0t0  TCP *:ssh (LISTEN)
sshd    1936495   root    4u  IPv6 1037635959      0t0  TCP *:ssh (LISTEN)
```

## ip addr 查看网卡信息
GPU 服务器
```shell
ip addr
```
```
8: br-b1a37228308c: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc noqueue state UP group default 
    link/ether 02:42:69:12:87:eb brd ff:ff:ff:ff:ff:ff
    inet 192.168.64.1/20 brd 192.168.79.255 scope global br-b1a37228308c
       valid_lft forever preferred_lft forever
    inet6 fe80::42:69ff:fe12:87eb/64 scope link 
       valid_lft forever preferred_lft forever
```

在 GPU 服务器上监控 br-b1a37228308c 网桥
```shell
sudo tcpdump -i br-b1a37228308c
```
```
tcpdump: verbose output suppressed, use -v or -vv for full protocol decode
listening on br-b1a37228308c, link-type EN10MB (Ethernet), capture size 262144 bytes

11:59:17.123725 ARP, Request who-has 192.168.73.2 tell gpu1, length 28
11:59:18.131063 ARP, Request who-has 192.168.73.2 tell gpu1, length 28
11:59:19.155067 ARP, Request who-has 192.168.73.2 tell gpu1, length 28
```

**很有可能是这个网桥设备出的问题，它的网段是：192.168.64.1/20 - 192.168.79.255，而我的电脑 IP 是：192.168.73.2**

**通过变更登录无线设备解决了这个问题，我的 IP 变更为：172.16.122.222**

## dmesg 查看内核日志
```shell
dmesg | grep br-b1a37228308c
```
```
[   28.911290] br-b1a37228308c: port 1(veth4974272) entered blocking state
[   28.911294] br-b1a37228308c: port 1(veth4974272) entered disabled state
[   28.911885] br-b1a37228308c: port 1(veth4974272) entered blocking state
[   28.911889] br-b1a37228308c: port 1(veth4974272) entered forwarding state
[   28.911928] IPv6: ADDRCONF(NETDEV_CHANGE): br-b1a37228308c: link becomes ready
[   28.913006] br-b1a37228308c: port 1(veth4974272) entered disabled state
[   28.929009] br-b1a37228308c: port 2(veth086e445) entered blocking state
[   28.929012] br-b1a37228308c: port 2(veth086e445) entered disabled state
[   28.932252] br-b1a37228308c: port 2(veth086e445) entered blocking state
[   28.932255] br-b1a37228308c: port 2(veth086e445) entered forwarding state
[   29.130690] br-b1a37228308c: port 3(veth6495b3f) entered blocking state
[   29.130695] br-b1a37228308c: port 3(veth6495b3f) entered disabled state
[   29.131245] br-b1a37228308c: port 3(veth6495b3f) entered blocking state
[   29.131248] br-b1a37228308c: port 3(veth6495b3f) entered forwarding state
[   29.252413] br-b1a37228308c: port 2(veth086e445) entered disabled state
[   29.252716] br-b1a37228308c: port 3(veth6495b3f) entered disabled state
[   30.376166] br-b1a37228308c: port 1(veth4974272) entered blocking state
[   30.376170] br-b1a37228308c: port 1(veth4974272) entered forwarding state
[   30.432464] br-b1a37228308c: port 3(veth6495b3f) entered blocking state
[   30.432467] br-b1a37228308c: port 3(veth6495b3f) entered forwarding state
[   30.432703] br-b1a37228308c: port 2(veth086e445) entered blocking state
[   30.432708] br-b1a37228308c: port 2(veth086e445) entered forwarding state
[160528.388829] device br-b1a37228308c entered promiscuous mode
[161199.293262] device br-b1a37228308c left promiscuous mode
```

## journalctl 查看系统日志
```shell
journalctl | grep br-b1a37228308c
```
```
Nov 20 14:25:24 gpu1 kernel: br-b1a37228308c: port 2(veth80039d3) entered disabled state
Nov 20 14:25:24 gpu1 kernel: br-b1a37228308c: port 1(veth68fe7f7) entered disabled state
Nov 20 14:25:24 gpu1 kernel: br-b1a37228308c: port 3(veth10420d1) entered disabled state
Nov 20 14:25:26 gpu1 systemd-networkd[1565]: br-b1a37228308c: Lost carrier
Nov 20 14:25:27 gpu1 kernel: br-b1a37228308c: port 2(veth80039d3) entered disabled state
Nov 20 14:25:27 gpu1 kernel: br-b1a37228308c: port 2(veth80039d3) entered disabled state
Nov 20 14:25:27 gpu1 kernel: br-b1a37228308c: port 1(veth68fe7f7) entered disabled state
Nov 20 14:25:27 gpu1 kernel: br-b1a37228308c: port 1(veth68fe7f7) entered disabled state
Nov 20 14:25:27 gpu1 kernel: br-b1a37228308c: port 3(veth10420d1) entered disabled state
Nov 20 14:25:27 gpu1 kernel: br-b1a37228308c: port 3(veth10420d1) entered disabled state
Nov 20 14:30:00 gpu1 systemd-networkd[1523]: br-b1a37228308c: Link UP
Nov 20 14:30:01 gpu1 systemd-networkd[1523]: br-b1a37228308c: Gained carrier
Nov 20 14:30:01 gpu1 kernel: br-b1a37228308c: port 1(veth8eff6fd) entered blocking state
Nov 20 14:30:01 gpu1 kernel: br-b1a37228308c: port 1(veth8eff6fd) entered disabled state
Nov 20 14:30:01 gpu1 kernel: br-b1a37228308c: port 1(veth8eff6fd) entered blocking state
Nov 20 14:30:01 gpu1 kernel: br-b1a37228308c: port 1(veth8eff6fd) entered forwarding state
Nov 20 14:30:01 gpu1 kernel: IPv6: ADDRCONF(NETDEV_CHANGE): br-b1a37228308c: link becomes ready
Nov 20 14:30:01 gpu1 kernel: br-b1a37228308c: port 1(veth8eff6fd) entered disabled state
Nov 20 14:30:01 gpu1 kernel: br-b1a37228308c: port 2(vethcdc9775) entered blocking state
Nov 20 14:30:01 gpu1 kernel: br-b1a37228308c: port 2(vethcdc9775) entered disabled state
Nov 20 14:30:01 gpu1 kernel: br-b1a37228308c: port 2(vethcdc9775) entered blocking state
Nov 20 14:30:01 gpu1 kernel: br-b1a37228308c: port 2(vethcdc9775) entered forwarding state
Nov 20 14:30:01 gpu1 kernel: br-b1a37228308c: port 3(vethc75a3fb) entered blocking state
Nov 20 14:30:01 gpu1 kernel: br-b1a37228308c: port 3(vethc75a3fb) entered disabled state
Nov 20 14:30:01 gpu1 kernel: br-b1a37228308c: port 3(vethc75a3fb) entered blocking state
Nov 20 14:30:01 gpu1 kernel: br-b1a37228308c: port 3(vethc75a3fb) entered forwarding state
Nov 20 14:30:01 gpu1 kernel: br-b1a37228308c: port 2(vethcdc9775) entered disabled state
Nov 20 14:30:01 gpu1 kernel: br-b1a37228308c: port 3(vethc75a3fb) entered disabled state
Nov 20 14:30:02 gpu1 systemd-networkd[1523]: br-b1a37228308c: Gained IPv6LL
Nov 20 14:30:02 gpu1 kernel: br-b1a37228308c: port 2(vethcdc9775) entered blocking state
Nov 20 14:30:02 gpu1 kernel: br-b1a37228308c: port 2(vethcdc9775) entered forwarding state
Nov 20 14:30:02 gpu1 kernel: br-b1a37228308c: port 3(vethc75a3fb) entered blocking state
Nov 20 14:30:02 gpu1 kernel: br-b1a37228308c: port 3(vethc75a3fb) entered forwarding state
Nov 20 14:30:02 gpu1 kernel: br-b1a37228308c: port 1(veth8eff6fd) entered blocking state
Nov 20 14:30:02 gpu1 kernel: br-b1a37228308c: port 1(veth8eff6fd) entered forwarding state
Nov 20 15:21:04 gpu1 kernel: br-b1a37228308c: port 2(vethcdc9775) entered disabled state
Nov 20 15:21:05 gpu1 kernel: br-b1a37228308c: port 1(veth8eff6fd) entered disabled state
Nov 20 15:21:05 gpu1 kernel: br-b1a37228308c: port 3(vethc75a3fb) entered disabled state
Nov 20 15:21:05 gpu1 kernel: br-b1a37228308c: port 2(vethcdc9775) entered disabled state
Nov 20 15:21:05 gpu1 kernel: br-b1a37228308c: port 2(vethcdc9775) entered disabled state
Nov 20 15:21:05 gpu1 kernel: br-b1a37228308c: port 1(veth8eff6fd) entered disabled state
Nov 20 15:21:05 gpu1 kernel: br-b1a37228308c: port 1(veth8eff6fd) entered disabled state
Nov 20 15:21:05 gpu1 kernel: br-b1a37228308c: port 3(vethc75a3fb) entered disabled state
Nov 20 15:21:05 gpu1 kernel: br-b1a37228308c: port 3(vethc75a3fb) entered disabled state
Nov 20 15:21:05 gpu1 systemd-networkd[1523]: br-b1a37228308c: Lost carrier
Nov 20 15:23:56 gpu1 systemd-networkd[1509]: br-b1a37228308c: Link UP
Nov 20 15:23:57 gpu1 kernel: br-b1a37228308c: port 1(veth4974272) entered blocking state
Nov 20 15:23:57 gpu1 kernel: br-b1a37228308c: port 1(veth4974272) entered disabled state
Nov 20 15:23:57 gpu1 kernel: br-b1a37228308c: port 1(veth4974272) entered blocking state
Nov 20 15:23:57 gpu1 kernel: br-b1a37228308c: port 1(veth4974272) entered forwarding state
Nov 20 15:23:57 gpu1 kernel: IPv6: ADDRCONF(NETDEV_CHANGE): br-b1a37228308c: link becomes ready
Nov 20 15:23:57 gpu1 kernel: br-b1a37228308c: port 1(veth4974272) entered disabled state
Nov 20 15:23:57 gpu1 systemd-networkd[1509]: br-b1a37228308c: Gained carrier
Nov 20 15:23:57 gpu1 kernel: br-b1a37228308c: port 2(veth086e445) entered blocking state
Nov 20 15:23:57 gpu1 kernel: br-b1a37228308c: port 2(veth086e445) entered disabled state
Nov 20 15:23:57 gpu1 kernel: br-b1a37228308c: port 2(veth086e445) entered blocking state
Nov 20 15:23:57 gpu1 kernel: br-b1a37228308c: port 2(veth086e445) entered forwarding state
Nov 20 15:23:57 gpu1 kernel: br-b1a37228308c: port 3(veth6495b3f) entered blocking state
Nov 20 15:23:57 gpu1 kernel: br-b1a37228308c: port 3(veth6495b3f) entered disabled state
Nov 20 15:23:57 gpu1 kernel: br-b1a37228308c: port 3(veth6495b3f) entered blocking state
Nov 20 15:23:57 gpu1 kernel: br-b1a37228308c: port 3(veth6495b3f) entered forwarding state
Nov 20 15:23:57 gpu1 kernel: br-b1a37228308c: port 2(veth086e445) entered disabled state
Nov 20 15:23:57 gpu1 kernel: br-b1a37228308c: port 3(veth6495b3f) entered disabled state
Nov 20 15:23:58 gpu1 systemd-networkd[1509]: br-b1a37228308c: Gained IPv6LL
Nov 20 15:23:58 gpu1 systemd-networkd[1509]: br-b1a37228308c: Lost carrier
Nov 20 15:23:58 gpu1 kernel: br-b1a37228308c: port 1(veth4974272) entered blocking state
Nov 20 15:23:58 gpu1 kernel: br-b1a37228308c: port 1(veth4974272) entered forwarding state
Nov 20 15:23:58 gpu1 systemd-networkd[1509]: br-b1a37228308c: Gained carrier
Nov 20 15:23:58 gpu1 kernel: br-b1a37228308c: port 3(veth6495b3f) entered blocking state
Nov 20 15:23:58 gpu1 kernel: br-b1a37228308c: port 3(veth6495b3f) entered forwarding state
Nov 20 15:23:58 gpu1 kernel: br-b1a37228308c: port 2(veth086e445) entered blocking state
Nov 20 15:23:58 gpu1 kernel: br-b1a37228308c: port 2(veth086e445) entered forwarding state
Nov 22 11:58:59 gpu1 sudo[1527288]:   lnsoft : TTY=pts/2 ; PWD=/home/lnsoft ; USER=root ; COMMAND=/usr/sbin/tcpdump -i br-b1a37228308c
Nov 22 11:58:59 gpu1 kernel: device br-b1a37228308c entered promiscuous mode
Nov 22 12:10:10 gpu1 kernel: device br-b1a37228308c left promiscuous mode
```

## 参考资料
* [tcpdump使用例子](https://segmentfault.com/a/1190000022106625)
* [用tcpdump 分析如何建立与关闭tcp连接](https://www.cnblogs.com/no7dw/archive/2013/01/14/2860265.html)
* [分析tcpdump输出](https://kunnan.github.io/2018/05/24/tcpdump/)
