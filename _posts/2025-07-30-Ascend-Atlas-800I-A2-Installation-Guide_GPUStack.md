---
layout: single
title:  "华为 Atlas 800I A2 大模型部署实战（八）：GPUStack 实现 GPU 集群化管理"
date:   2025-07-30 12:00:00 +0800
categories: 昇腾 NPU
tags: [昇腾, NPU, 910B4, Atlas800IA2, vllm-ascend, vLLM, LLM, Docker, GPUStack, openEuler]
---

<!--more-->

## 服务器配置

**AI 服务器**：华为 Atlas 800I A2 推理服务器 X 5

| 组件 | 规格 |
|---|---|
| **CPU** | 鲲鹏 920（5250） |
| **NPU** | 昇腾 910B4（8X32G） |
| **内存** | 1024GB |
| **硬盘** | **系统盘**：450GB SSDX2 RAID1<br>**数据盘**：3.5TB NVME SSDX4 |
| **操作系统** | openEuler 22.03 LTS |


## GPUStack 介绍

![](/images/2025/GPUStack/GPUStack.png)

GPUStack 是一款开源的 GPU 集群管理器，专为运行 AI 模型设计，其核心特点如下：

- **广泛的兼容性**：支持多厂商 GPU，覆盖苹果 Mac、Windows 电脑及 Linux 服务器，还能适配多种推理后端（如 vLLM、Ascend MindIE 等），并可同时运行多个版本的推理后端，满足不同模型的运行需求。
- **丰富的模型支持与灵活部署**：支持 LLM、VLM、图像模型、音频模型等多种类型模型，可实现单节点和多节点多 GPU 推理，包括跨厂商和不同运行环境的异构 GPU，且能通过添加更多 GPU 或节点轻松扩展架构。
- **稳定与智能管理**：具备自动故障恢复、多实例冗余和推理请求负载均衡功能，保障高可用性；能自动评估模型资源需求、兼容性等部署相关因素，还可基于可用资源动态分配模型。
- **实用的附加功能**：采用轻量级 Python 包，依赖少、运维成本低；提供与 OpenAI 兼容的 API，便于无缝集成；支持用户及 API 密钥管理，可实时监控 GPU 性能、利用率以及令牌使用量和 API 请求速率。

### 操作系统支持
- Linux
- macOS
- Windows

### 加速框架支持
- NVIDIA CUDA (Compute Capability 6.0 以上)
- Apple Metal (M 系列芯片)
- AMD ROCm
- 昇腾 CANN
- 海光 DTK
- 摩尔线程 MUSA
- 天数智芯 Corex
- 寒武纪 MLU

### 推理框架支持
- vLLM
- Ascend MindIE
- llama-box（基于 llama.cpp 和 stable-diffusion.cpp）
- vox-box

### 模型来源
- Hugging Face
- ModelScope
- 本地文件路径


## 安装 GPUStack

### 启动 GPUStack

```bash
docker run -d --name gpustack \
  --restart=unless-stopped \
	--device /dev/davinci0 \
	--device /dev/davinci1 \
	--device /dev/davinci2 \
	--device /dev/davinci3 \
	--device /dev/davinci4 \
	--device /dev/davinci5 \
	--device /dev/davinci6 \
	--device /dev/davinci7 \
	--device /dev/davinci_manager \
	--device /dev/devmm_svm \
	--device /dev/hisi_hdc \
	-v /usr/local/dcmi:/usr/local/dcmi \
	-v /usr/local/bin/npu-smi:/usr/local/bin/npu-smi \
	-v /usr/local/Ascend/driver/lib64/:/usr/local/Ascend/driver/lib64/ \
	-v /usr/local/Ascend/driver/version.info:/usr/local/Ascend/driver/version.info \
	-v /etc/ascend_install.info:/etc/ascend_install.info \
	-v /data/models:/models \
	--network=host \
	--ipc=host \
	-v gpustack-data:/var/lib/gpustack \
	gpustack/gpustack:latest-npu \
	--port 8080
```

- `gpustack-data` 是一个命名卷。不存在会自动创建。
- `--port 8080`: 默认服务器端口 80

容器正常运行后，执行以下命令获取默认密码：

```bash
docker exec -it gpustack cat /var/lib/gpustack/initial_admin_password
```

在浏览器中打开 http://172.16.33.106:8080，访问 GPUStack 界面。使用 `admin` 用户名和默认密码登录 GPUStack。

要获取用于添加 Worker 的令牌，请在 GPUStack 服务器节点上运行以下命令：

```bash
docker exec -it gpustack cat /var/lib/gpustack/token
```
```bash
e6342ab3eeafb1e44da8db7e9eb2c077
```

### 添加 Worker

```bash
docker run -d --name gpustack \
  --restart=unless-stopped \
	--device /dev/davinci0 \
	--device /dev/davinci1 \
	--device /dev/davinci2 \
	--device /dev/davinci3 \
	--device /dev/davinci4 \
	--device /dev/davinci5 \
	--device /dev/davinci6 \
	--device /dev/davinci7 \
	--device /dev/davinci_manager \
	--device /dev/devmm_svm \
	--device /dev/hisi_hdc \
	-v /usr/local/dcmi:/usr/local/dcmi \
	-v /usr/local/bin/npu-smi:/usr/local/bin/npu-smi \
	-v /usr/local/Ascend/driver/lib64/:/usr/local/Ascend/driver/lib64/ \
	-v /usr/local/Ascend/driver/version.info:/usr/local/Ascend/driver/version.info \
	-v /etc/ascend_install.info:/etc/ascend_install.info \
	-v /data/models:/models \
	--network=host \
	--ipc=host \
	-v gpustack-data:/var/lib/gpustack \
	gpustack/gpustack:latest-npu \
	--server-url http://172.16.33.106:8080 \
	--token e6342ab3eeafb1e44da8db7e9eb2c077
```


## GPUStack 使用

### 概览

![](/images/2025/GPUStack/Overview.jpeg)

### 模型库

![](/images/2025/GPUStack/Models.jpeg)

### 部署模型

![](/images/2025/GPUStack/ModelDeploy.jpeg)

### Playground

![](/images/2025/GPUStack/Playground.jpeg)

📌 `vLLM` 比 `MindIE` 的速度快 `10%`。vLLM 使用 4 卡和 8 卡的速度是一样的，没有出现像在 Nvidia GPU 上的线性加速现象。

### Workers

![](/images/2025/GPUStack/Workers.jpeg)

### GPUs

![](/images/2025/GPUStack/GPUs.jpeg)

### 模型文件

![](/images/2025/GPUStack/ModelFiles.jpeg)


## 参考资料
- [Ascend CANN](https://docs.gpustack.ai/latest/installation/ascend-cann/online-installation/)
- [GPUStack](https://github.com/gpustack/gpustack/blob/main/README_CN.md)
