---
layout: single
title:  "在 MacBook Pro M2 Max 上安装 FastChat"
date:   2024-01-11 08:00:00 +0800
categories: FastChat
tags: [FastChat, Qwen, DeepSeek, ChatGLM, OpenAI, MacBookProM2Max]
---

## [FastChat](https://github.com/lm-sys/FastChat)

FastChat 是一个开放平台，用于训练、服务和评估基于大型语言模型的聊天机器人。

- [FastChat 部署多模型]({% post_url 2023-10-24-fastchat-deploys-multi-model %})
- [Qwen (通义千问)]({% post_url 2023-12-25-Qwen %})

### FastChat Server 架构图

![](/images/2023/fastchat/fastchat-server-architecture.png)

## 安装 FastChat

### 克隆代码
```shell
git clone https://github.com/lm-sys/FastChat
cd FastChat
```

### 创建虚拟环境
```shell
python -m venv env
source env/bin/activate
```

### 安装
```shell
pip install --upgrade pip
pip install -e ".[model_worker,webui]"
```

## 升级 FastChat
```shell
git pull
pip install -e ".[model_worker,webui]"
```

## 创建大模型链接
### LLM
- [Qwen](https://github.com/QwenLM/Qwen)
```shell
mkdir Qwen
ln -s /Users/junjian/HuggingFace/Qwen/Qwen-14B-Chat Qwen/Qwen-14B-Chat
ln -s /Users/junjian/HuggingFace/Qwen/Qwen-1_8B Qwen/Qwen-1_8B
ln -s /Users/junjian/HuggingFace/Qwen/Qwen-1_8B-Chat Qwen/Qwen-1_8B-Chat
ln -s /Users/junjian/HuggingFace/Qwen/Qwen-7B-Chat Qwen/Qwen-7B-Chat
```

- [DeepSeek](https://github.com/deepseek-ai/deepseek-coder/)
```shell
mkdir deepseek-ai
ln -s /Users/junjian/HuggingFace/deepseek-ai/deepseek-llm-7b-chat deepseek-ai/deepseek-llm-7b-chat
ln -s /Users/junjian/HuggingFace/deepseek-ai/deepseek-coder-1.3b-instruct deepseek-ai/deepseek-coder-1.3b-instruct
```

- [ChatGLM](https://github.com/THUDM/ChatGLM3)
```shell
mkdir THUDM
ln -s /Users/junjian/HuggingFace/THUDM/chatglm3-6b THUDM/chatglm3-6b
```

### Embedding LLM
- bge
```shell
mkdir BAAI
ln -s /Users/junjian/HuggingFace/BAAI/bge-base-zh-v1.5 BAAI/bge-base-zh-v1.5
```

## 运行服务
### Controller
```shell
python -m fastchat.serve.controller
```

### Model Worker
#### Embedding LLM
- BAAI/bge-base-zh-v1.5
```shell
python -m fastchat.serve.model_worker \
    --model-path BAAI/bge-base-zh-v1.5 --port 21100 \
    --worker-address http://localhost:21100 \
    --model-names bge-base-zh,text-embedding-ada-002 \
    --device mps
```
- [BAAI/bge-base-zh-v1.5](https://huggingface.co/BAAI/bge-base-zh-v1.5)
- [BAAI/bge-large-zh-v1.5](https://huggingface.co/BAAI/bge-large-zh-v1.5)

#### LLM
- THUDM/chatglm3-6b
```shell
python -m fastchat.serve.model_worker \
    --model-path THUDM/chatglm3-6b --port 21002 \
    --worker-address http://localhost:21002 \
    --model-names chatglm3-6b,gpt-3.5-turbo \
    --device mps
```

- deepseek-ai/deepseek-llm-7b-chat
```shell
python -m fastchat.serve.model_worker \
    --model-path deepseek-ai/deepseek-llm-7b-chat --port 21002 \
    --worker-address http://localhost:21002 \
    --device mps
```

#### Code LLM
- deepseek-ai/deepseek-coder-1.3b-instruct
```shell
python -m fastchat.serve.model_worker \
    --model-path deepseek-ai/deepseek-coder-1.3b-instruct --port 21002 \
    --worker-address http://localhost:21002 \
    --device mps
```

### OpenAI API Server
```shell
python -m fastchat.serve.openai_api_server
```

### Web Server
```shell
python -m fastchat.serve.gradio_web_server
```

访问浏览器：http://localhost:7860/

![](/images/2024/FastChat/Web-Server.png)

## 停止服务
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

## 测试 OpenAI API
```shell
curl http://127.0.0.1:8000/v1/completions \
    -H "Content-Type: application/json" \
    -d '{
        "model": "deepseek-llm-7b-chat",
        "prompt": "天空为什么是蓝色的？",
        "temperature": 0.7,
        "max_tokens": 1000
    }'
```
