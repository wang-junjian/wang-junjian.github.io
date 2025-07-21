---
layout: single
title:  "华为 Atlas 800I A2 大模型部署实战（二）：逻辑卷创建与大模型下载"
date:   2025-07-18 12:00:00 +0800
categories: 昇腾 NPU
tags: [昇腾, NPU, 910B4, Atlas800IA2, LLM, LVM, openEuler]
---

<!--more-->

## 服务器配置

**AI 服务器**：华为 Atlas 800I A2 推理服务器

| 组件 | 规格 |
|---|---|
| **CPU** | 鲲鹏 920（5250） |
| **NPU** | 昇腾 910B4（8X32G） |
| **内存** | 1024GB |
| **硬盘** | **系统盘**：450GB SSDX2 RAID1<br>**数据盘**：3.5TB NVME SSDX4 |
| **操作系统** | openEuler 22.03 LTS |


## 逻辑卷创建

### LVM（逻辑卷管理）

**LVM (Logical Volume Manager，逻辑卷管理)** 是 Linux 环境下对磁盘分区进行管理的一种机制，它提供了比传统分区更灵活和强大的磁盘管理功能。

![](/images/2025/Atlas800IA2/lvm.jpg)

LVM 主要由以下几个核心概念组成：
- 物理卷 (Physical Volume, PV)：实际的物理磁盘或分区
- 卷组 (Volume Group, VG)：由一个或多个物理卷组成的存储池
- 逻辑卷 (Logical Volume, LV)：从卷组中划分出的逻辑存储单元，可格式化并挂载使用

LVM 的优势
- 灵活的容量管理：可以动态调整逻辑卷大小
- 存储池化：多个物理设备可以组合成一个大的存储池
- 在线扩容：无需卸载文件系统即可调整大小
- 快照功能：可以创建逻辑卷的快照用于备份
- 条带化：提高性能
- 镜像：提高数据可靠性

### 查看磁盘信息

```bash
lsblk
```
```bash
NAME               MAJ:MIN RM   SIZE RO TYPE MOUNTPOINTS
sda                  8:0    0 446.1G  0 disk 
├─sda1               8:1    0   600M  0 part /boot/efi
├─sda2               8:2    0     1G  0 part /boot
└─sda3               8:3    0 444.5G  0 part 
  ├─openeuler-root 253:0    0    70G  0 lvm  /
  ├─openeuler-swap 253:1    0     4G  0 lvm  [SWAP]
  └─openeuler-home 253:2    0 370.5G  0 lvm  /home
nvme1n1            259:0    0   3.5T  0 disk 
nvme0n1            259:1    0   3.5T  0 disk 
nvme2n1            259:2    0   3.5T  0 disk 
nvme3n1            259:3    0   3.5T  0 disk 
```

### 创建物理卷（PV）

```bash
for d in /dev/nvme{0..3}n1; do
    pvcreate "$d"
done
```
```bash
  Physical volume "/dev/nvme0n1" successfully created.
  Physical volume "/dev/nvme1n1" successfully created.
  Physical volume "/dev/nvme2n1" successfully created.
  Physical volume "/dev/nvme3n1" successfully created.
```

- 查看物理卷信息

```bash
pvs
```
```bash
  PV           VG        Fmt  Attr PSize    PFree
  /dev/nvme0n1           lvm2 ---     3.49t 3.49t
  /dev/nvme1n1           lvm2 ---     3.49t 3.49t
  /dev/nvme2n1           lvm2 ---     3.49t 3.49t
  /dev/nvme3n1           lvm2 ---     3.49t 3.49t
  /dev/sda3    openeuler lvm2 a--  <444.54g    0
```

### 创建卷组（VG）

```bash
vgcreate vg_data /dev/nvme0n1 /dev/nvme1n1 /dev/nvme2n1 /dev/nvme3n1
```
```bash
Volume group "vg_data" successfully created
```

- 查看卷组信息

```bash
vgs
```
```bash
VG        #PV #LV #SN Attr   VSize    VFree 
  openeuler   1   3   0 wz--n- <444.54g     0 
  vg_data     4   0   0 wz--n-   13.97t 13.97t
```

### 创建逻辑卷（LV）

```bash
lvcreate -l 100%VG -n lv_data vg_data
```
```bash
  Logical volume "lv_data" created.
```

- 查看逻辑卷信息

```bash
lvs
```
```bash
  LV      VG        Attr       LSize    Pool Origin Data%  Meta%  Move Log Cpy%Sync Convert
  home    openeuler -wi-ao---- <370.54g
  root    openeuler -wi-ao----   70.00g
  swap    openeuler -wi-ao----    4.00g
  lv_data vg_data   -wi-a-----   13.97t
```

### 格式化

```bash
mkfs.xfs /dev/vg_data/lv_data
```
```bash
meta-data=/dev/vg_data/lv_data   isize=512    agcount=14, agsize=268435455 blks
         =                       sectsz=512   attr=2, projid32bit=1
         =                       crc=1        finobt=1, sparse=1, rmapbt=0
         =                       reflink=1    bigtime=0 inobtcount=0
data     =                       bsize=4096   blocks=3750735872, imaxpct=5
         =                       sunit=0      swidth=0 blks
naming   =version 2              bsize=4096   ascii-ci=0, ftype=1
log      =internal log           bsize=4096   blocks=521728, version=2
         =                       sectsz=512   sunit=0 blks, lazy-count=1
realtime =none                   extsz=4096   blocks=0, rtextents=0
Discarding blocks...Done.
```

> 如需 ext4：mkfs.ext4 /dev/vg_data/lv_data

以下是 ext4 和 XFS 文件系统的对比表格整理：

| **对比项** | **ext4** | **XFS** |
|---|---|---|
| **设计背景** | ext 家族第四代，通用场景设计 | 为高性能、大容量存储设计（如视频、数据库）  |
| **最大文件大小** | 16 TiB（理论 1 EiB）  | 8 EiB  |
| **最大卷大小** | 1 EiB | 8 EiB  |
| **目录文件数限制** | 默认约 6.4 万（可通过调整增大） | 近乎无限 |
| **小文件性能** | 更优（适合频繁创建/删除小文件）  | 较差 |
| **大文件性能** | 一般 | 显著更优（连续读写性能强） |
| **高并发 I/O** | 一般 | 优化更好（多线程、多核 CPU 支持佳）  |
| **日志功能** | 支持三种模式：`journal`/`ordered`/`writeback`  | 始终启用高效元数据日志 |
| **碎片管理** | 需离线整理（`e4defrag`） | 支持在线整理（`xfs_fsr`）  |
| **扩展性** | 支持在线扩展，但**不支持缩小**（速度较慢） | 支持在线扩展（速度快），不支持缩小  |
| **fsck 修复时间**  | 较长（尤其大容量分区）  | 通常无需修复（日志恢复快） |
| **适用场景** | 桌面系统、传统服务器、邮件存储等小文件密集型场景 | 大文件、高吞吐场景（如数据库、虚拟化、云存储） |
| **格式化命令** | `mkfs.ext4 -L mydata /dev/sdX1` | `mkfs.xfs -L mydata /dev/sdX1` |
| **保留空间** | 默认 5% 保留给 root（可通过 `-m 0` 取消） | 无固定保留空间 |
| **兼容性** | 广泛支持（旧版 Linux、嵌入式系统等） | 需较新内核（主流现代发行版均支持） |
| **快照支持** | 依赖 LVM 或 btrfs  | 原生支持（配合 LVM 更佳）  |

**关键选择建议**
- **选 ext4**：常规用途、小文件操作多、兼容性要求高。  
- **选 XFS**：处理大文件（如虚拟机镜像）、需要高吞吐或并发 I/O（如数据库）。  

### 临时挂载

```bash
mkdir -p /data
mount /dev/vg_data/lv_data /data
```

### 开机自动挂载

- 查看 UUID

```bash
blkid /dev/vg_data/lv_data
/dev/vg_data/lv_data: UUID="eee7da5b-7d61-4a57-8b4d-b409da39d551" BLOCK_SIZE="512" TYPE="xfs"
```

- 编辑 `/etc/fstab` 文件，添加如下内容

```bash
UUID=eee7da5b-7d61-4a57-8b4d-b409da39d551 /data  xfs  defaults  0  0
```

或者直接使用设备路径

```bash
/dev/mapper/vg_data-lv_data /data xfs defaults 0 0
```

- 验证挂载

```bash
mount -a   # 无报错即成功
```


## 大模型下载

### 魔搭（ModelScope）下载工具

在下载前，请先通过如下命令安装 `ModelScope`

```bash
pip install modelscope
```

```bash
modelscope download --model <模型名称> --local_dir <本地目录>
```
- `--model` 参数指定要下载的模型名称
- `--local_dir` 参数指定下载到本地的目录。

**默认存储**
- **Linux/macOS**: ~/.cache/modelscope/hub
- **Windows**: C:\Users\<用户名>\.cache\modelscope\hub

### 大语言模型
#### [Qwen2.5-7B-Instruct](https://www.modelscope.cn/models/Qwen/Qwen2.5-7B-Instruct)

```bash
modelscope download --model Qwen/Qwen2.5-7B-Instruct --local_dir Qwen2.5-7B-Instruct
```

#### [Qwen2.5-14B-Instruct](https://www.modelscope.cn/models/Qwen/Qwen2.5-14B-Instruct)

```bash
modelscope download --model Qwen/Qwen2.5-14B-Instruct --local_dir Qwen2.5-14B-Instruct
```

#### [Qwen2.5-32B-Instruct](https://www.modelscope.cn/models/Qwen/Qwen2.5-32B-Instruct)

```bash
modelscope download --model Qwen/Qwen2.5-32B-Instruct --local_dir Qwen2.5-32B-Instruct
```

#### [Qwen2.5-72B-Instruct](https://www.modelscope.cn/models/Qwen/Qwen2.5-72B-Instruct)

```bash
modelscope download --model Qwen/Qwen2.5-72B-Instruct --local_dir Qwen2.5-72B-Instruct
```

### 嵌入模型
#### [bge-large-zh-v1.5](https://www.modelscope.cn/models/BAAI/bge-large-zh-v1.5)

```bash
modelscope download --model BAAI/bge-large-zh-v1.5 --local_dir bge-large-zh-v1.5
```

### 多模态大模型
#### [Qwen2.5-VL-3B-Instruct](https://www.modelscope.cn/models/Qwen/Qwen2.5-VL-3B-Instruct)

```bash
modelscope download --model Qwen/Qwen2.5-VL-3B-Instruct --local_dir Qwen2.5-VL-3B-Instruct
```

#### [Qwen2.5-VL-7B-Instruct](https://www.modelscope.cn/models/Qwen/Qwen2.5-VL-7B-Instruct)

```bash
modelscope download --model Qwen/Qwen2.5-VL-7B-Instruct --local_dir Qwen2.5-VL-7B-Instruct
```
