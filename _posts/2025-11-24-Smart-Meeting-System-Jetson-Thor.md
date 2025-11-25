---
layout: single
title:  "智能会议系统 Jetson Thor 上部署模型服务指南"
date:   2025-11-24 08:00:00 +0800
categories: 智能会议系统 Jetson
tags: [智能会议系统, Jetson, Thor, llama-server, ASR, Qwen3]
---

<!--more-->

**内网IP**：`27.41.19.62`

| 服务 | 说明 | 端口 | 备注 |
| ---- | ---- | ---- | ---- |
| WhisperLiveKit | 实时语音识别服务 | 8000 | **模型**：whisper small |
| llama-server | GGUF 模型推理服务 | 8080 | **模型**：Qwen3-8B<br/>**模型名**：qwen3<br/>**上下文长度**：32K |


## 系统设置

### 系统优化

#### 最大功率模式（一次性设置）

```bash
sudo nvpmodel -m 0
```

#### 启动最高频率（每次重启后设置）

```bash
sudo jetson_clocks
```

### 清理内存

```bash
sync && echo 3 | sudo tee /proc/sys/vm/drop_caches
```


## WhisperLiveKit

* [WhisperLiveKit - 实时语音识别]({% post_url 2025-11-10-WhisperLiveKit %})

### 部署服务

```bash
tmux new -s wlk
```

```bash
docker run -it \
  --ipc=host \
  --net=host \
  --runtime=nvidia \
  -e MODEL=small \
  -e PORT=8000 \
  -e LANG=zh \
  -e DIAR=true \
  wangjunjian/whisperlivekit
```


## llama-server

```bash
cd /models/llama.cpp
```

### Dockerfile

```dockerfile
# 基镜像
FROM nvcr.io/nvidia/pytorch:25.10-py3

# 设置工作目录
WORKDIR /app

# 暴露服务端口
EXPOSE 8000

# 拷贝 models 目录及其内容。
# 注意：这要求本地存在一个名为 models 的目录。
COPY ./models /models

# 拷贝 llama-server 可执行文件和所需的动态库 (*.so 文件)。
# 假设它们位于本地的 build/bin/ 目录下。
COPY ./build/bin/ /app/bin/

# 【重要】将 /app/bin 目录添加到 LD_LIBRARY_PATH，
# 确保 llama-server 运行时能找到所需的动态库 (*.so)。
ENV LD_LIBRARY_PATH=/app/bin:$LD_LIBRARY_PATH

# 设置容器启动时执行的命令。
# 使用 CMD 以便在运行时可以轻松覆盖这些参数。
CMD ["/app/bin/llama-server", \
  "--model", "/models/Qwen3-8B-Q5_K_M.gguf", \
  "--alias", "qwen3", \
  "--host", "0.0.0.0", \
  "--port", "8000", \
  "--ctx-size", "0", \
  "--no-kv-offload", \
  "--no-op-offload", \
  "--no-mmap", \
  "--mlock", \
  "--jinja", \
  "--reasoning-budget", "0"]
```

- `--no-mmap` 和 `--mlock` 确保模型权重被完全加载到物理内存并锁定，避免了内存映射可能带来的文件系统或虚拟内存问题。
- `--no-kv-offload` 和 `--no-op-offload` 则确保了 KV Cache 和操作都在 GPU 上执行，消除了在 VRAM 和系统 RAM 之间移动数据可能导致的同步或寻址问题。

> 防止服务崩溃。

### 构建镜像

```bash
docker build -t wangjunjian/llama-server .
```

### 部署服务

```bash
tmux new -s llm
```

```bash
docker run -it --runtime=nvidia -p 8080:8000 wangjunjian/llama-server
```

### 测试服务

```bash
curl http://localhost:8080/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "qwen3",
    "messages": [{"role": "user", "content": "你好，Jetson AGX Thor!"}],
    "max_tokens": 64
  }'
```

### 导出镜像

```bash
docker save wangjunjian/llama-server -o llama-server.tar
```

### 导入镜像

```bash
docker load -i llama-server.tar
```


## vLLM

### 运行容器

```bash
docker run -it \
  --ipc=host \
  --net=host \
  --runtime=nvidia \
  --name=vllm \
  -v /home/lnsoft/wjj/models:/models \
  nvcr.io/nvidia/vllm:25.09-py3 \
  bash
```

### 启动服务

```bash
VLLM_DISABLED_KERNELS=MacheteLinearKernel \
vllm serve /models/okwinds/Qwen3-Coder-30B-A3B-Instruct-Int4-W4A16 \
    --served-model-name qwen3 \
    --host 0.0.0.0 \
    --port 8080 \
    --max-model-len 16000 \
    --gpu-memory-utilization 0.9
```
