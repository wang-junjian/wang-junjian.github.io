---
layout: single
title:  "SimulStreaming — 实时流式语音识别工具包"
date:   2025-11-19 08:00:00 +0800
categories: SimulStreaming ASR
tags: [SimulStreaming, ASR]
---

<!--more-->

SimulStreaming 实现了 Whisper 模型的同步翻译和转录功能（在语音识别领域被称为流式传输）。SimulStreaming 采用了最先进的同步策略 AlignAtt，这使其具备极高的速度和效率。

## 安装

```bash
git clone https://github.com/ufal/SimulStreaming
cd SimulStreaming
```

```bash
pip install -r requirements.txt
```

## 从音频文件进行实时模拟

```bash
python simulstreaming_whisper.py test.wav --language auto  --task transcribe --comp_unaware --model_path ~/.cache/whisper/small.pt
```

## 服务器 -- 来自麦克风的实时流

```bash
python simulstreaming_whisper_server.py \
  --host 0.0.0.0 --port 8000 \
  --model_path ~/.cache/whisper/small.pt \
  --lan zh \
  --task transcribe
```

### 客户端

- Linux

```bash
arecord -f S16_LE -c1 -r 16000 -t raw -D default | nc localhost 8000
```

- macOS

```bash
ffmpeg -hide_banner -f avfoundation -i ":0" -ac 1 -ar 16000 -f s16le -loglevel error - | nc localhost 8000
```
> 没能识别出文字
