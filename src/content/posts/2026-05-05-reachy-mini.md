---
layout: single
title:  "Reachy Mini 机器人"
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
- [Reachy Mini（无线版）- 设置指南](https://huggingface.co/docs/reachy_mini/platforms/reachy_mini/get_started)

### 开箱
![](/images/2026/ReachyMini/box.webp)

![](/images/2026/ReachyMini/unbox.webp)

![](/images/2026/ReachyMini/part.webp)

### 组装（近3个小时）

- [📖互动式数字指南](https://huggingface.co/spaces/pollen-robotics/Reachy_Mini_Assembly_Guide)
- [📺完整组装视频](https://www.youtube.com/watch?v=WeKKdnuXca4)

### 下载 [Reachy Mini Control](https://huggingface.co/reachy-mini#/download)


### 连接到 Reachy Mini 的 WiFi 热点

- **网络名称**：`reachy-mini-ap`
- **密码**：`reachy-mini`

### 连接 WiFi

![](/images/2026/ReachyMini/wifi-setup.webp)

### 系统更新

![](/images/2026/ReachyMini/system-update.webp)

### 连接 Reachy Mini

![](/images/2026/ReachyMini/connect-to-reachy.webp)

![](/images/2026/ReachyMini/reachy-mini.webp)

⚠️ **注意**：Reachy Mini（无线版）不支持(❌) USB-C 线连接

无线版机器人不像Lite版那样通过USB接口连接，所以直接将USB-C线插入笔记本电脑无法建立连接。

正确的做法是：
- 将机器人连接到您的 Wi-Fi 网络，然后使用笔记本电脑上的 SDK 客户端远程控制它。
- 如果你想直接在嵌入式 Raspberry Pi 上运行代码，可以通过 SSH 连接到 Raspberry Pi 并在那里执行你的脚本（Reachy Mini Control 就是在你发布/安装应用程序后执行此操作的）。
- 对于有线连接，请使用 USB-C 转以太网适配器和以太网线——这样就可以用有线以太网代替 Wi-Fi。

[查看故障排除与常见问题解答指南](https://huggingface.co/docs/reachy_mini/troubleshooting)


## [硬件数据](https://huggingface.co/docs/reachy_mini/platforms/reachy_mini/hardware)

![](/images/2026/ReachyMini/hardware/reachy_mini_dimensions.webp)

### 自由度
- 头部：6个自由度（3个旋转与3个平移）
- 机身：1个自由度旋转
- 天线：1个自由度（2个）

![](/images/2026/ReachyMini/hardware/degrees_of_freedom.webp)

![](/images/2026/ReachyMini/hardware/dof_table.webp)

### 控制
- 树莓派4计算模块（无线版）

![](/images/2026/ReachyMini/hardware/reachy_mini_components.webp)

### 电机规格
- 基座：1个定制Dynamixel XC330-M288-PG（[XC330-M288-T](https://emanual.robotis.com/docs/en/dxl/x/xc330-m288/)，塑料齿轮）
- 天线：2个Dynamixel [XL330-M077-T](https://emanual.robotis.com/docs/en/dxl/x/xl330-m077/)
- Stewart 平台：6 个 Dynamixel [XL330-M288-T](https://emanual.robotis.com/docs/en/dxl/x/xl330-m288/)

![](/images/2026/ReachyMini/hardware/motors_detail.webp)

### 麦克风阵列板
- 4 个 PDM MEMS 数字麦克风
- 最大采样率16千赫兹/灵敏度-26分贝满刻度/信噪比64分贝A计权
- 基于 Seeed Studio 的 reSpeaker XMOS XVF3800 打造
### 摄像头
- 树莓派摄像头v3广角
- 索尼 IMX708
- 1200万像素
- 自动对焦
- I2C*约1个 MIDI DSI 接口
### 5瓦 4欧姆 扬声器
### 电源板
- 输入电压：6.8 - 7.6伏
- 磷酸铁锂电池，2000毫安时，6.4伏，12.8瓦时，具备过充保护、过放保护、过流保护、短路保护及温度感应功能。

![](/images/2026/ReachyMini/hardware/electronics.webp)

### CM4 控制板
- 由电源板提供 6.8 - 7.6 伏电压
- Dynamixel 电机 TTL 连接
- 摄像头CSI接口
- 麦克风阵列接口
- USB‑C 输出（即可插入 **U 盘**等设备）。请注意，无法（❌）通过此 USB 接口进行**充电**。
- **树莓派4**计算模块 - CM4104016
    - **WiFi**
    - **4GB**内存
    - **16GB**闪存
- Wi-Fi天线 - 2.4-5GHz双频段贴片天线，2.79 dBi，全向型


**📌 软件指南篇**

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
