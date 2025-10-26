---
layout: single
title:  "大模型（语言、视觉语言、语音）推理服务部署与测试"
date:   2025-10-25 08:00:00 +0800
categories: LLM 推理
tags: [LLM, 推理, CUDA, vLLM, llama.cpp, whisper.cpp, curl, ASR]
---

<!--more-->


## 推理服务

### [CUDA GPU Compute Capability（计算能力）](https://developer.nvidia.com/cuda-gpus)

`计算能力（CC）`定义了每种 NVIDIA GPU 架构的**硬件特性**和**支持的指令**。在下表中查找您的GPU的计算能力。

![](/images/2025/Jetson/llama-server/cc-110.png)

### vLLM

```bash
docker run -it \
    --ipc=host \
    --net=host \
    --runtime=nvidia \
    --name=vllm \
    -v /models:/models \
    -v ~/.cache/huggingface:/root/.cache/huggingface \
    -v ~/.cache/modelscope:/root/.cache/modelscope \
    nvcr.io/nvidia/vllm:25.09-py3 \
    bash
```

```bash
vllm serve /models/openai-mirror/whisper-small --served-model-name whisper
```

### [llama.cpp](https://github.com/ggml-org/llama.cpp)

#### 编译

```bash
git clone https://github.com/ggml-org/llama.cpp.git
cd llama.cpp

cmake -B build -DGGML_CUDA=ON -DCMAKE_CUDA_ARCHITECTURES="110"
cmake --build build -j --config Release
```

#### 部署（llama-server）

```bash
./llama-server \
    --model /models/unsloth/Qwen3-Coder-30B-A3B-Instruct-GGUF/Qwen3-Coder-30B-A3B-Instruct-Q5_K_M.gguf \
    --alias qwen3 \
    --host 0.0.0.0 \
    --port 8000 \
    --jinja \
    --reasoning-budget 0 \
    --reasoning-format none \
    --gpu-layers -1 \
    --ctx-size 0 \
    --parallel $(nproc) \
    --threads $(nproc) \
    --flash-attn on \
    --no-kv-offload \
    --no-op-offload \
    --no-mmap \
    --mlock
```

### [whisper.cpp](https://github.com/ggml-org/whisper.cpp)

#### 编译

```bash
git clone https://github.com/ggml-org/whisper.cpp.git
cd whisper.cpp

cmake -B build -DGGML_CUDA=ON -DCMAKE_CUDA_ARCHITECTURES="110"
cmake --build build -j --config Release
```

#### 部署（whisper-server）

```bash
./whisper-server \
    --model /models/whisper.cpp/models/ggml-large-v3-turbo.bin \
    --host 0.0.0.0 \
    --port 8080 \
    --flash-attn \
    --language auto
```


## 语音

### 模型

- [whisper-small](https://www.modelscope.cn/models/openai-mirror/whisper-small)
- [whisper-large-v3-turbo](https://www.modelscope.cn/models/openai-mirror/whisper-large-v3-turbo)

```bash
vllm serve /models/openai-mirror/whisper-small --served-model-name whisper
```

### 测试（curl）

#### vllm

```bash
curl "http://127.0.0.1:8000/v1/audio/transcriptions" \
    --form "file=@/models/llama.cpp/tools/mtmd/test-2.mp3" \
    --form "model=whisper" \
    --form "response_format=json" \
    --form "language=zh"
```

#### whisper.cpp

```bash
curl 127.0.0.1:8080/inference \
    -H "Content-Type: multipart/form-data" \
    -F file="@samples/jfk.wav" \
    -F response_format="json"
```


## 视觉-语言

### 模型

- [Qwen2.5-VL-7B-Instruct-AWQ](https://www.modelscope.cn/models/Qwen/Qwen2.5-VL-7B-Instruct-AWQ)
- [Qwen3-VL-30B-A3B-Instruct-GGUF](https://www.modelscope.cn/models/yairpatch/Qwen3-VL-30B-A3B-Instruct-GGUF)

```bash
vllm serve /models/Qwen/Qwen2.5-VL-7B-Instruct-AWQ --served-model-name qwen3
```

### 测试（curl）

```bash
curl http://localhost:8000/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "qwen3",
    "messages": [
      {
        "role": "user",
        "content": [
          {"type": "image_url", "image_url": {"url": "http://book.d2l.ai/_images/catdog.jpg"}},
          {"type": "text", "text": "解释图像"}
        ]
      }
    ]
  }'
```

```bash
{
  "id": "chatcmpl-ca34716637f34580a80a95610ea43557",
  "object": "chat.completion",
  "created": 1760853120,
  "model": "qwen3",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "这张图像展示了两只可爱的宠物——一只小狗和一只小猫。小狗位于图像的左侧，它的毛色是浅棕色，耳朵是黑色的，眼睛大而明亮，表情显得很专注。小猫位于图像的右侧，它的毛色是灰色和白色相间的条纹，嘴巴张开，似乎在叫唤或发出声音。背景是纯白色的，使得小狗和小猫成为图像的焦点。整体来看，这是一幅温馨且充满活力的画面，展现了宠物之间的和谐共处。",
        "refusal": null,
        "annotations": null,
        "audio": null,
        "function_call": null,
        "tool_calls": [],
        "reasoning_content": null
      },
      "logprobs": null,
      "finish_reason": "stop",
      "stop_reason": null
    }
  ],
  "service_tier": null,
  "system_fingerprint": null,
  "usage": {
    "prompt_tokens": 543,
    "total_tokens": 651,
    "completion_tokens": 108,
    "prompt_tokens_details": null
  },
  "prompt_logprobs": null,
  "kv_transfer_params": null
}
```

```bash
vllm serve /models/Qwen/Qwen2.5-VL-7B-Instruct-AWQ --served-model-name qwen3 --allowed-local-media-path
```

```bash
curl http://localhost:8000/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "qwen3",
    "messages": [
      {
        "role": "user",
        "content": [
          {"type": "image_url", "image_url": {"url": "file:///models/iic/SenseVoiceSmall/fig/asr_results.png"}},
          {"type": "text", "text": "解释图像"}
        ]
      }
    ]
  }'
```


## 参考资料
- [FunASR Github](https://github.com/modelscope/FunASR)
- [FunASR 官网](https://www.funasr.com/)
