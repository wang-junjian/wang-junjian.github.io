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

**SSH 无需密码直接连接到机器人**

复制您的公匙 id_rsa.pub 到机器人上，命名为 authorized_keys。

```shell
scp ~/.ssh/id_rsa.pub pollen@reachy-mini:/home/pollen/.ssh/authorized_keys
```

ssh 登录可以不用输入密码直接登录机器人了。

```shell
ssh pollen@reachy-mini
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

### 

**默认时区设置**：

- **时区（Time zone）** 被设置成了 `Europe/London`（伦敦时间）。
- **NTP 服务（NTP service）** 是激活状态（`active`），并且系统时钟已经同步（`System clock synchronized: yes`）。

```bash
$ timedatectl

               Local time: Mon 2026-05-18 13:53:08 BST
           Universal time: Mon 2026-05-18 12:53:08 UTC
                 RTC time: n/a
                Time zone: Europe/London (BST, +0100)
System clock synchronized: yes
              NTP service: active
          RTC in local TZ: no

$ date

Mon 18 May 13:53:10 BST 2026
```

**这里将时区更改为上海时间（`Asia/Shanghai`），运行以下命令**：

```bash
timedatectl set-timezone Asia/Shanghai
```

**如果没有开启 NTP 服务，运行以下命令启用**：

```bash
timedatectl set-ntp true
```

**更改后再次检查**：

```bash
$ timedatectl

               Local time: Mon 2026-05-18 20:53:52 CST
           Universal time: Mon 2026-05-18 12:53:52 UTC
                 RTC time: n/a
                Time zone: Asia/Shanghai (CST, +0800)
System clock synchronized: yes
              NTP service: active
          RTC in local TZ: no

$ date

Mon 18 May 20:53:57 CST 2026
```

### 确保机器人服务器（守护进程）处于运行状态

**守护进程**是一种后台服务，负责与电机和传感器进行底层通信。必须保持该进程运行，你的代码才能正常工作。

#### Reachy Mini（无线版）

- **Reachy Mini Control**

    运行应用： **Reachy Mini Control**

- **Reachy Mini Dashboard**（*未来会停用*）

    浏览器打开网址： http://reachy-mini:8000/

![](/images/2026/ReachyMini/web-app.webp)

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
Connected to Reachy Mini! 
Wiggling antennas...
Done!
```

> 📌 在这里出现了个大坑，我使用的 `iTerm2` 终端无法正常工作，ssh 连接和运行守护进程 `reachy-mini-daemon`，都出现错误：No route to host，各种折腾，整了大半天。最终换成系统自带的 `Terminal` 之后就正常了。

- [查看故障排除与常见问题解答指南](https://huggingface.co/docs/reachy_mini/troubleshooting)


## Reachy Mini（无线版）开发工作流

这里介绍了在无线版 Reachy Mini 机器人上进行代码开发与测试的高效工作流程。

### 前置条件
- 可通过SSH连接机器人（连接命令：`ssh pollen@reachy-mini.local`，密码：`root`）
- 本地电脑已安装SSHFS（Ubuntu/Debian 系统执行：`sudo apt install sshfs`）
- 获取机器人IP地址（可在Reachy Mini控制端、路由器后台查看，或SSH登录后执行`ifconfig`查询）

### 跨平台简易方案
在完整工作流之前，先介绍两种更简单的跨平台开发方式：

#### VS Code 远程SSH
安装 VS Code 的 [Remote - SSH extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-ssh) 后，可直接在机器人上编辑文件。
连接到 `pollen@reachy-mini.local`，随后即可打开任意文件夹。修改内容会直接保存到机器人设备中，支持Windows、macOS、Linux全平台。

![](/images/2026/ReachyMini/development/remote-ssh.webp)

#### Rsync 同步
使用 `rsync` 可将本地源代码同步至机器人的 site-packages 目录，传输速度快，几乎适配所有系统：

```bash
rsync -avz /path/to/your_app/src/your_app/ \
    pollen@reachy-mini.local:/venvs/apps_venv/lib/python3.12/site-packages/your_app/
```

每次代码修改后执行该命令即可推送更新；添加参数 `--delete` 可同步删除本地已移除的文件。

对于这两种选择，请参阅 **方法 A 的步骤 3**，在机器人上运行您的代码。

---

### 方案A：机器人拉取代码仓库、本地编辑（推荐）👍
这是**首选**开发流程：代码存放于机器人端，你可在本地电脑用常用IDE或AI编码工具进行编辑。

#### 第一步：在机器人上克隆代码仓库
```bash
ssh pollen@reachy-mini.local
cd /home/pollen
git clone https://github.com/YOUR_USER/YOUR_APP.git
```

#### 第二步：将机器人文件挂载到本地电脑
在本地电脑创建挂载目录并执行挂载：
```bash
mkdir -p ~/wireless_dev
sshfs pollen@reachy-mini.local:/home/pollen/YOUR_APP ~/wireless_dev \
    -o reconnect,ServerAliveInterval=15,ServerAliveCountMax=3
```
之后可在IDE中打开`~/wireless_dev`目录，像编辑本地文件一样直接修改机器人代码。

**SSHFS**（SSH Filesystem） 是一个基于 FUSE（用户空间文件系统） 与 SSH/SFTP 协议的工具，作用是：把远程机器的目录，直接挂载到本地，像操作本地文件一样读写远程文件，全程加密、无需改服务端配置。

- 安装 SSHFS
```bash
brew install macfuse sshfs
```

#### 第三步：在机器人安装并运行代码
通过 SSH 连接到机器人并安装/运行你的应用程序：

```bash
ssh pollen@reachy-mini.local
cd /home/pollen/YOUR_APP

# 以可编辑模式安装（修改会立即生效）：
/venvs/apps_venv/bin/pip install -e .

# 然后运行你的应用程序：
/venvs/apps_venv/bin/python -m YOUR_MODULE.main

# 或直接运行，无需安装：
/venvs/apps_venv/bin/python your_script.py
```

#### 第四步：开发完成后取消挂载
```bash
fusermount -u ~/wireless_dev
```

### 方案B：覆盖已安装应用源码
若已通过Reachy Mini控制端安装应用，可通过**本地文件挂载覆盖机器人端源码**，直接修改程序。

#### 第一步：查找机器人上已安装的应用路径
应用默认安装路径：
```
/venvs/apps_venv/lib/python3.12/site-packages/YOUR_APP_NAME/
```

#### 第二步：将本地源码挂载覆盖安装目录
**在机器人终端**执行以下命令，把电脑本地源码挂载覆盖机器人的站点包：
```bash
ssh pollen@reachy-mini.local

# Mount your local src content onto site-packages
sshfs YOUR_USER@YOUR_PC_IP:/path/to/your_app/src/your_app \
    /venvs/apps_venv/lib/python3.12/site-packages/YOUR_APP_NAME \
    -o reconnect,ServerAliveInterval=15,ServerAliveCountMax=3
```

重要说明：仅挂载`src/your_app/`**目录内的文件**，不要挂载整个代码仓库。站点包目录只存放程序包本身，不兼容仓库层级结构。

此后在电脑修改文件，重启应用即可生效。

### 方案C：挂载本地源码并直接运行
与方案B类似，但无需执行pip安装、也不依赖Reachy Mini控制端。直接挂载本地源码到机器人并运行程序。

#### 第一步：将本地源码挂载到机器人
**在机器人终端**执行：
```bash
ssh pollen@reachy-mini.local
mkdir -p /home/pollen/my_app_mount

sshfs YOUR_USER@YOUR_PC_IP:/path/to/your_app /home/pollen/my_app_mount \
    -o reconnect,ServerAliveInterval=15,ServerAliveCountMax=3
```

#### 第二步：直接运行应用
```bash
cd /home/pollen/my_app_mount
/venvs/apps_venv/bin/python main.py
```
该方式适合快速测试，但应用不会注册到Reachy Mini控制端中。

### 安装指定分支/版本
全局安装代码仓库的指定版本：
```bash
ssh pollen@reachy-mini.local
/venvs/apps_venv/bin/python -m pip install --force-reinstall \
    "git+https://github.com/pollen-robotics/MY_AWESOME_APP.git@MY_AWESOME_BRANCH"
```
将`分支名`替换为实际分支名称（如`develop`）、版本标签或提交哈希值。

### 常见问题与注意事项
#### SSHFS挂载后pip安装缓慢
若**从本地电脑反向挂载文件到机器人**（与方案A相反），pip安装会极度卡顿，原因是pip需通过网络读取大量小文件。

**解决办法**：
- 采用方案A（代码存机器人、挂载到本地编辑）
- 跳过pip安装，直接用`python -m 模块名`手动运行

#### 站点包挂载路径错误
代码仓库标准结构：
```
your_app/
  src/
    your_app/
      __init__.py
      main.py
```
而机器人站点包结构为：
```
your_app/
  __init__.py
  main.py
```
若直接挂载整个仓库到站点包，Python将无法识别程序。**仅需挂载内层程序包目录**。

### 常用命令速查表
| 操作 | 命令 |
|------|------|
| SSH连接机器人 | `ssh pollen@reachy-mini.local` |
| 停止后台守护进程 | `sudo systemctl stop reachy-mini-daemon` |
| 启动后台守护进程 | `sudo systemctl start reachy-mini-daemon` |
| 查看守护进程日志 | `journalctl -u reachy-mini-daemon -f` |
| 查看机器人状态 | `reachyminios_check` |
| 机器人文件挂载到本地 | `sshfs pollen@IP:/path ~/local_mount -o reconnect,ServerAliveInterval=15,ServerAliveCountMax=3` |
| 取消挂载 | `fusermount -u ~/local_mount` |


## 参考资料
- [Reachy Mini](https://github.com/pollen-robotics/reachy_mini)
