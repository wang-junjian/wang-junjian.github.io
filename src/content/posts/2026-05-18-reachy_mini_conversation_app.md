---
layout: single
title:  "Reachy Mini Conversation App"
date:   2026-05-18 20:00:00 +0800
categories: [人工智能]
tags: [reachy_mini_conversation_app, 语音智能体, Hugging Face, Reachy Mini]
---

## 源码安装 Reachy Mini Conversation App

### 克隆 Reachy Mini Conversation App

```bash
git clone https://github.com/wang-junjian/reachy_mini_conversation_app
cd reachy_mini_conversation_app
```

### 创建虚拟环境并安装依赖

```bash
uv venv --python 3.12
source .venv/bin/activate
uv sync
```

⚠️ **注意**：要完全复现此仓库 uv.lock 文件中的依赖关系，请运行 `uv sync --frozen` 命令。这将确保 uv 直接从 lock 文件安装依赖项，而无需重新解析或更新任何版本。

### 安装可选功能

```bash
uv sync --extra local_vision         # Local PyTorch/Transformers vision
uv sync --extra yolo_vision          # YOLO face-detection backend for head tracking
uv sync --extra mediapipe_vision     # MediaPipe-based head-tracking
uv sync --extra all_vision           # All vision features
```

合并额外功能或包含开发依赖项：

```bash
uv sync --extra all_vision --group dev
```


## 实时模式运行 Speech to Speech

```bash
speech-to-speech \
    --mode realtime \
    --device mps \
    --stt faster-whisper \
    --faster_whisper_stt_model_name small \
    --faster_whisper_stt_gen_language zh \
    --language zh \
    --llm_backend mlx-lm \
    --model_name mlx-community/Qwen3.5-4B-OptiQ-4bit \
    --init_chat_prompt "你是一位乐于助人、待人友善的人工智能助手。你礼貌谦和、尊重他人，且回复力求简洁。" \
    --tts qwen3 \
    --qwen3_tts_speaker Serena \
    --no_enable_live_transcription
```


## 运行 Reachy Mini Conversation App

### 配置环境变量

编辑配置文件 `.env`

```
HF_REALTIME_CONNECTION_MODE=local
HF_REALTIME_WS_URL=ws://localhost:8765/v1/realtime
BACKEND_PROVIDER=huggingface
```

### 运行应用

```bash
reachy-mini-conversation-app
```

使用 `mediapipe` 进行头部追踪

```bash
reachy-mini-conversation-app --head-tracker mediapipe
```
