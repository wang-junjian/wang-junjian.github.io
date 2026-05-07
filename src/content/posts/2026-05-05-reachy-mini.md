---
layout: single
title:  "Reachy Mini"
date:   2026-05-05 08:00:00 +0800
categories: [人工智能, 硬件]
tags: [ReachyMini, 机器人]
---

## Reachy Mini

2025年12月买的 **Reachy Mini** 机器人，近5个月终于到手了。

### [购买链接](https://huggingface.co/reachy-mini)

![](/images/2026/ReachyMini/buy.webp)

### 介绍

Reachy Mini 是由法国机器人公司 [Pollen Robotics](https://www.pollen-robotics.com/) 开发的一款开源的桌面级人形机器人，旨在为教育、研究和创意项目提供一个灵活且易于使用的平台。Reachy Mini 是 Reachy 机器人的小型版本，具有相似的功能和设计，但体积更小，更适合在桌面环境中使用。

### 硬件版本

| 功能特性 | Wireless (无线版) | Lite (轻量版) |
| :--- | :--- | :--- |
| **价格** | $449 | $299 |
| **电机与机械结构** | 9 个伺服电机 | 9 个伺服电机 |
| **头部运动** | 6 自由度 (pitch, roll, yaw, x, y, z) | 6 自由度 (pitch, roll, yaw, x, y, z) |
| **身体旋转** | ±160° | ±160° |
| **天线** | 2 个动力感应天线 | 2 个动力感应天线 |
| **摄像头** | 广角摄像头 | 广角摄像头 |
| **麦克风** | 4 麦克风阵列 | 4 麦克风阵列 |
| **扬声器** | 5W 扬声器 | 5W 扬声器 |
| **板载算力** | 树莓派 CM 4 (16GB 存储) | - |
| **加速计** | 内置 IMU | - |
| **Wi-Fi 连接** | 支持 | - |
| **独立模式** | 支持 | 需通过 USB 连接控制 |
| **供电方式** | 电池供电 + 电源适配器 (7.3V / 5A) | 仅限电源适配器 (7.3V / 5A) |


## 开箱与初体验
- [Welcome to Reachy Mini!](https://huggingface.co/reachy-mini#/getting-started)

### 开箱
![](/images/2026/ReachyMini/box.webp)

![](/images/2026/ReachyMini/unbox.webp)

![](/images/2026/ReachyMini/part.webp)

### 组装（近3个小时）

### 下载 [Reachy Mini Control](https://huggingface.co/reachy-mini#/download)

### 连接 WiFi

![](/images/2026/ReachyMini/wifi-setup.webp)

### 系统更新

![](/images/2026/ReachyMini/system-update.webp)

### 连接 Reachy Mini

> 关机后，通过 USB 连接最好重新插拔一下，才能被电脑识别到。

![](/images/2026/ReachyMini/connect-to-reachy.webp)

![](/images/2026/ReachyMini/reachy-mini.webp)


**📌 软件指南**

## 安装

### 1. 前提条件

| 工具 | 版本 | 用途 |
| :--- | :--- | :--- |
| 🐍 **Python** | 3.10 - 3.12 | 运行 Reachy Mini SDK |
| 📂 **Git** | 最新版本 (Latest) | 下载源码和应用程序 |
| 📦 **Git LFS** | 最新版本 (Latest) | 下载模型资源文件 |

#### 安装 uv

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

#### 安装 Python

```bash
uv python install 3.12 --default
```

#### 安装 Git & Git LFS

- 安装 Homebrew

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

- 安装 Git 和 Git LFS

```bash
brew install git git-lfs
```

- 初始化

```bash
git lfs install
```

#### 克隆 Reachy Mini

```bash
git clone https://github.com/pollen-robotics/reachy_mini
```

### 2. 创建虚拟环境

#### 创建环境

```bash
sudo mkdir /opt/uv
cd /opt/uv
sudo uv venv reachy-mini --python 3.12
sudo chown -R $(whoami) /opt/uv/reachy-mini
```
#### 激活环境

```bash
source reachy-mini/bin/activate
```

### 3. 安装 Reachy Mini

在终端中，运行：

```bash
uv pip install "reachy-mini"
```

如果你想使用模拟模式，需要添加 `mujoco` 附加依赖：

```bash
uv pip install "reachy-mini[mujoco]"
```


## 入门指南

### 直接在 Reachy Mini（无线版）上运行 SDK

如果你想直接在无线版 Reachy Mini 上运行 SDK，而非在电脑上远程运行，可以通过 SSH 连接到它。

#### 步骤 1：SSH 连接

```bash
ssh pollen@reachy-mini 
```
> 默认用户名：pollen，密码：`root`

查看操作系统版本

```bash
cat VERSION.txt
```
```bash
ReachyMiniOS: v0.2.3
Created on: 2026-01-15
```

#### 步骤 2：激活 Python 虚拟环境

```bash
source /venvs/apps_venv/bin/activate
```

#### 步骤 3：在本地运行脚本

在 Reachy Mini 本体上运行脚本时，请使用标准的 `ReachyMini()` 构造函数。自动模式会保持本地主机的连接，除非你显式地覆盖它：

```py
from reachy_mini import ReachyMini

with ReachyMini() as mini:
    # Your code here
```

### 确保机器人服务器（守护进程）处于运行状态

**守护进程**是一种后台服务，负责与电机和传感器进行底层通信。必须保持该进程运行，你的代码才能正常工作。

#### Reachy Mini（无线版）

运行 Reachy Mini Control

#### 用于模拟（无需机器人）

运行 Reachy Mini Daemon（模拟模式）

```bash
mjpython -m reachy_mini.daemon.app.main --sim
```

**验证**：在浏览器中打开 http://localhost:8000/docs 或 http://reachy-mini.local:8000/docs 。若能看到 Reachy SDK 接口文档，即代表配置完成！

### 你的第一个脚本

创建脚本：`hello.py`

```py
from reachy_mini import ReachyMini

# Connect to the running daemon
with ReachyMini() as mini:
    print("Connected to Reachy Mini! ")

    # Wiggle antennas
    print("Wiggling antennas...")
    mini.goto_target(antennas=[0.5, -0.5], duration=0.5)
    mini.goto_target(antennas=[-0.5, 0.5], duration=0.5)
    mini.goto_target(antennas=[0, 0], duration=0.5)

    print("Done!")
```

```bash
python hello.py
```
```
ERROR:reachy_mini.media.audio_control_utils:No Reachy Mini Audio USB device found!
INFO:reachy_mini.media.webrtc_client_gstreamer:GstWebRTCClient initialized (bidirectional audio support)
Connected to Reachy Mini! 
Wiggling antennas...
INFO:reachy_mini.media.webrtc_client_gstreamer:Captured webrtcbin: webrtcbin0
INFO:reachy_mini.media.webrtc_client_gstreamer:Transceiver configured for SENDRECV
INFO:reachy_mini.media.webrtc_client_gstreamer:Transceiver configured for SENDRECV
INFO:reachy_mini.media.webrtc_client_gstreamer:Setting up audio send chain...
INFO:reachy_mini.media.webrtc_client_gstreamer:Found audio sink pad: sink_1, pt=100
INFO:reachy_mini.media.webrtc_client_gstreamer:Audio send chain ready (bidirectional audio enabled)
Done!
```

> 📌 在这里出现了个大坑，我使用的 `iTerm2` 终端无法正常工作，ssh 连接和运行守护进程 `reachy-mini-daemon`，都出现错误：No route to host，各种折腾，整了大半天。最终换成系统自带的 `Terminal` 之后就正常了。

- [查看故障排除与常见问题解答指南](https://huggingface.co/docs/reachy_mini/troubleshooting)
