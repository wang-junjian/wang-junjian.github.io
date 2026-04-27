---
layout: single
title:  "使用 FastChat 在 CUDA 上部署 LLM"
date:   2024-01-16 08:00:00 +0800
categories: [AI 与大模型, DevOps]
tags: [FastChat, vLLM, CUDA]
---

## 安装 FastChat & vLLM
### 安装 [FastChat](https://github.com/lm-sys/FastChat)
- [FastChat 部署多模型]([2023-10-24-fastchat-deploys-multi-model](/posts/2023-10-24-fastchat-deploys-multi-model))
- [Qwen (通义千问)]([2023-12-25-Qwen](/posts/2023-12-25-Qwen))
- [在 MacBook Pro M2 Max 上安装 FastChat]([2024-01-11-Install-FastChat-on-MacBook-Pro-M2-Max](/posts/2024-01-11-Install-FastChat-on-MacBook-Pro-M2-Max))

```shell
pip install "fschat[model_worker,webui]"
```

### 安装 [FlashAttention](https://github.com/Dao-AILab/flash-attention)
- `Turing GPU T4` 不支持 FlashAttention 2，需要使用 FlashAttention 1.x 。
- `Turing GPU T4` 不支持 `bf16`，需要使用 `fp16` 。

### 安装 [vLLM](https://github.com/vllm-project/vllm)
```shell
pip install vllm -i https://mirrors.aliyun.com/pypi/simple/
```

## 升级 FastChat & vLLM
```shell
git pull
pip install -e ".[model_worker,webui]"
pip install -U vllm
```


## 部署 LLM
### 运行 Controller
```shell
python -m fastchat.serve.controller
```

### 运行 OpenAI API Server
```shell
python -m fastchat.serve.openai_api_server
```

### 运行 Model Worker
#### Qwen-1_8B-Chat
```shell
export CUDA_VISIBLE_DEVICES=0
python -m fastchat.serve.model_worker \
  --model-path Qwen/Qwen-1_8B-Chat \
  --model-names gpt-3.5-turbo \
  --port 21002 \
  --worker-address http://localhost:21002
```
- `--port 21002` 和 `--worker-address http://localhost:21002` 用于指定端口和地址，以便 Controller 能够找到 Model Worker。需要同时设置。

#### Qwen-7B-Chat（多卡）
```shell
export CUDA_VISIBLE_DEVICES=0,1
python -m fastchat.serve.model_worker \
  --model-path Qwen/Qwen-7B-Chat \
  --model-names gpt-3.5-turbo \
  --num-gpus 2
```
- --num-gpus 2 用于指定使用的 GPU 数量。

#### Qwen-7B-Chat（INT8 量化）
```shell
export CUDA_VISIBLE_DEVICES=0,1
python -m fastchat.serve.model_worker \
  --model-path Qwen/Qwen-7B-Chat \
  --model-names gpt-3.5-turbo \
  --load-8bit \
  --num-gpus 2
```

#### ChatGLM3-6B
```shell
python -m fastchat.serve.model_worker \
  --model-path THUDM/chatglm3-6b --port 21003 \
  --worker-address http://localhost:21003
```

#### Vicuna-7b-v1.5
```shell
python -m fastchat.serve.model_worker \
    --model-path /data/models/llm/vicuna-7b-v1.5 \
    --model-names vicuna-7b,gpt-3.5-turbo
```
- --model-names 给模型多个名称

### 运行 vLLM Worker
#### Qwen-1_8B-Chat
```shell
python -m fastchat.serve.vllm_worker \
  --model-path Qwen/Qwen-1_8B-Chat \
  --model-names gpt-3.5-turbo
```
- --tensor-parallel-size 设置使用的 GPU 数量`（默认为 1）`，
- --dtype bfloat16
  - ValueError: Bfloat16 is only supported on GPUs with compute capability of at least 8.0. Your Tesla T4 GPU has compute capability 7.5. `使用 float16 代替。`
  - `torch.cuda.get_device_capability()` 返回 `(7, 5)`

  [如果不支持 bfloat16，则降至 float16](https://github.com/vllm-project/vllm/pull/1901)

#### Qwen-7B-Chat
```shell
python -m fastchat.serve.vllm_worker \
  --model-path Qwen/Qwen-7B-Chat \
  --model-names gpt-3.5-turbo \
  --tensor-parallel-size 2
```

## 部署：嵌入模型
### bge-base-zh-v1.5
```shell
python -m fastchat.serve.model_worker \
    --model-path bge-base-zh-v1.5 \
    --port 21100 \
    --worker-address http://localhost:21100 \
    --model-names text-embedding-ada-002
```

## 部署：聊天机器人

📌 模型变动需要重新部署聊天机器人

### Gradio Web Server（选择部署的 LLM 进行聊天）
```shell
python -m fastchat.serve.gradio_web_server \
    --host 0.0.0.0 --port 8001
```

![](/images/2024/FastChat/Web-Server.png)

### ⚔️ Multi-Tab Gradio Web Server（同时选择两个不同的 LLM 进行同时聊天）
```shell
python -m fastchat.serve.gradio_web_server_multi \
    --host 0.0.0.0 --port 8002
```


## 关闭服务
### 关闭所有服务
```shell
python -m fastchat.serve.shutdown_serve --down all
```

### 关闭 Controller
```shell
python -m fastchat.serve.shutdown_serve --down controller
```

### 关闭 Model Worker
```shell
python -m fastchat.serve.shutdown_serve --down model_worker
```

### 关闭 OpenAI API Server
```shell
python -m fastchat.serve.shutdown_serve --down openai_api_server
```

### 杀死所有服务
```shell
kill -9 $(pgrep -f fastchat)
```


## 清除日志
`rmlog.sh`
```shell
rm *-conv.json
rm controller.log*
rm model_worker_*.log
rm gradio_web_server.log*
rm gradio_web_server_multi.log*
rm openai_api_server.log*
```


## [curl 测试]([2024-01-19-use-lama-cpp-to-build-compatible-openai-services](/posts/2024-01-19-use-lama-cpp-to-build-compatible-openai-services)#curl-调用-api)
