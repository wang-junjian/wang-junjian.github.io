---
layout: post
title:  "vLLM 部署 Qwen1.5 LLM"
date:   2024-03-15 10:00:00 +0800
categories: vLLM LLM
tags: [vLLM, LLM, Qwen]
---

## [安装 vLLM](https://docs.vllm.ai/en/latest/getting_started/installation.html)
    
```shell
# (Optional) Create a new conda environment.
conda create -n vllm python=3.9 -y
conda activate vllm

# Install vLLM with CUDA 12.1.
pip install vllm
```

## Qwen(通义千问)

### Qwen1.5-7B-Chat-GPTQ-Int4

下载模型

```shell
git clone https://www.modelscope.cn/qwen/Qwen1.5-7B-Chat-GPTQ-Int4.git
```

启动服务

```shell
python -m vllm.entrypoints.openai.api_server \
    --host 0.0.0.0 --port 9000 \
    --model Qwen/Qwen1.5-7B-Chat-GPTQ-Int4 \
    --quantization gptq \
    --tensor-parallel-size 2 \
    --dtype=half \
    --gpu-memory-utilization 0.95
```
- 可以使用环境变量 `CUDA_VISIBLE_DEVICES=2,3` 来指定使用的 GPU。
- --dtype=half T4 不支持 bfloat16，可以使用 float16。
- --gpu-memory-utilization 默认为 0.9，这里因为 Qwen 的上下文为 32k，0.9 还不能满足，也可以通过 `max-model-len` 参数来调整上下文长度。

使用 curl 测试

- chat completions
```shell
curl http://localhost:9000/v1/chat/completions \
    -H "Content-Type: application/json" \
    -d '{
        "model": "Qwen/Qwen1.5-7B-Chat-GPTQ-Int4",
        "messages": [
            {"role": "system", "content": "你是一个有用的助手。"},
            {"role": "user", "content": "天空为什么是蓝色的？"}
        ]
    }'
```

- completions
```shell
curl http://localhost:9000/v1/completions \
    -H "Content-Type: application/json" \
    -d '{
        "model": "Qwen/Qwen1.5-7B-Chat-GPTQ-Int4",
        "prompt": "天空为什么是蓝色的？",
        "max_tokens": 256,
        "temperature": 0
    }'
```

### Qwen1.5-7B-Chat-AWQ

下载模型

```shell
git clone https://www.modelscope.cn/qwen/Qwen1.5-7B-Chat-AWQ.git
```

启动服务

```shell
python -m vllm.entrypoints.openai.api_server \
    --host 0.0.0.0 --port 9000 \
    --model Qwen/Qwen1.5-7B-Chat-AWQ \
    --quantization awq \
    --tensor-parallel-size 2 \
    --dtype=half \
    --gpu-memory-utilization 0.95
```

使用 curl 测试

- chat completions
```shell
curl http://localhost:9000/v1/chat/completions \
    -H "Content-Type: application/json" \
    -d '{
        "model": "Qwen/Qwen1.5-7B-Chat-AWQ",
        "messages": [
            {"role": "system", "content": "你是一个有用的助手。"},
            {"role": "user", "content": "天空为什么是蓝色的？"}
        ]
    }'
```

- completions
```shell
curl http://localhost:9000/v1/completions \
    -H "Content-Type: application/json" \
    -d '{
        "model": "Qwen/Qwen1.5-7B-Chat-AWQ",
        "prompt": "天空为什么是蓝色的？",
        "max_tokens": 256,
        "temperature": 0
    }'
```

### Qwen1.5-7B-Chat

下载模型

```shell
git clone https://www.modelscope.cn/qwen/Qwen1.5-7B-Chat.git
```

启动服务

```shell
python -m vllm.entrypoints.openai.api_server \
    --host 0.0.0.0 --port 9000 \
    --model Qwen/Qwen1.5-7B-Chat \
    --tensor-parallel-size 2 \
    --dtype=half \
    --max-model-len 14000
```

**使用 1 张 T4 卡会出现错误：torch.cuda.OutOfMemoryError: CUDA out of memory.**

**这里使用了 --max-model-len 14000 参数来调整上下文长度。不能再大了。**

使用 curl 测试

- chat completions
```shell
curl http://localhost:9000/v1/chat/completions \
    -H "Content-Type: application/json" \
    -d '{
        "model": "Qwen/Qwen1.5-7B-Chat",
        "messages": [
            {"role": "system", "content": "你是一个有用的助手。"},
            {"role": "user", "content": "天空为什么是蓝色的？"}
        ]
    }'
```

- completions
```shell
curl http://localhost:9000/v1/completions \
    -H "Content-Type: application/json" \
    -d '{
        "model": "Qwen/Qwen1.5-7B-Chat",
        "prompt": "天空为什么是蓝色的？",
        "max_tokens": 256,
        "temperature": 0
    }'
```

总结

**量化的模型使用 completions 方式访问有问题，尾部回答了一些不相关的问题。**

### Qwen1.5-14B-Chat-GPTQ-Int4 & Qwen1.5-14B-Chat-AWQ

下载模型

- Qwen1.5-14B-Chat-GPTQ-Int4
```shell
git clone https://www.modelscope.cn/qwen/Qwen1.5-14B-Chat-GPTQ-Int4.git
```

- Qwen1.5-14B-Chat-AWQ
```shell
git clone https://www.modelscope.cn/qwen/Qwen1.5-14B-Chat-AWQ.git
```


启动服务

- Qwen1.5-14B-Chat-GPTQ-Int4
```shell
python -m vllm.entrypoints.openai.api_server \
    --model Qwen/Qwen1.5-14B-Chat-GPTQ-Int4 \
    --quantization gptq \
    --max-model-len 2048
```

- Qwen1.5-14B-Chat-AWQ
```shell
python -m vllm.entrypoints.openai.api_server \
    --model Qwen/Qwen1.5-14B-Chat-AWQ \
    --quantization awq \
    --max-model-len 2048
```

`--tensor-parallel-size` 设置为 2 或 4 都会出现错误：ValueError: The input size is not aligned with the quantized weight shape. This can be caused by too large tensor parallel size.


使用 curl 测试

- chat completions
```shell
curl http://localhost:9000/v1/chat/completions \
    -H "Content-Type: application/json" \
    -d '{
        "model": "Qwen/Qwen1.5-14B-Chat-GPTQ-Int4",
        "messages": [
            {"role": "system", "content": "你是一个有用的助手。"},
            {"role": "user", "content": "天空为什么是蓝色的？"}
        ],
        "max-tokens": 1000,
        "temperature": 0.7
    }'
```

- completions
```shell
curl http://localhost:9000/v1/completions \
    -H "Content-Type: application/json" \
    -d '{
        "model": "Qwen/Qwen1.5-14B-Chat-GPTQ-Int4",
        "prompt": "天空为什么是蓝色的？",
        "max_tokens": 1000,
        "temperature": 0.7
    }'
```

`completions` API 访问容易出现下面的问题。
```json
{
  "id": "cmpl-4674a6cd5dd8481ebad17f46a5ba003c",
  "object": "text_completion",
  "created": 318985,
  "model": "Qwen/Qwen1.5-14B-Chat-GPTQ-Int4",
  "choices": [
    {
      "index": 0,
      "text": "  天空为什么是蓝色的，这是一个常见的科学问题，其答案涉及到光的散射和大气的组成。以下是一个详细的解释：\n\n1. 光的散射：当太阳光照射到地球的大气层时，光线会与大气中的气体分子（主要是氮气和氧气）以及气溶胶粒子相互作用。在这个过程中，不同颜色的光散射的程度不同。光是由各种颜色的光波组成的，包括红、橙、黄、绿、蓝、靛、紫。短波长的光，如蓝光和紫光，散射得比长波长的光，如红光和黄光，更为强烈。\n\n2. 波长短的光更容易被散射：因为蓝光的波长比红光短，所以在大气中遇到气体分子时，蓝光更容易偏离原来的直线路径并四散开来。红光的波长较长，散射的程度相对较小，所以大部分红光能够直接到达地面。\n\n3. 大气层对短波长光的过滤：由于蓝光被散射得更多，大气层实际上起到了一个过滤器的作用，使得到达地面的光中蓝光成分更占优势。白天，太阳光中的蓝光和紫光被散射到各个方向，使得我们从地面上看去，天空呈现蓝色。\n\n4. 日落和日出时的天空颜色：在日出和日落时，太阳光穿过更长的大气路径，更多的蓝光和紫光被散射掉，红光和其他长波长的光则更容易到达地面，因此天空呈现出橙红色或者粉红色的色调。\n\n总之，天空之所以呈现蓝色，是由于太阳光中的蓝光在大气层中的散射效应，而其他颜色的光则被相对较少地散射或直接到达地面。\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n",
      "logprobs": null,
      "finish_reason": "length"
    }
  ],
  "usage": {
    "prompt_tokens": 6,
    "total_tokens": 1006,
    "completion_tokens": 1000
  }
}
```

## 参考资料
- [vLLM](https://github.com/vllm-project/vllm)
- [Qwen1.5](https://github.com/QwenLM/Qwen1.5)
