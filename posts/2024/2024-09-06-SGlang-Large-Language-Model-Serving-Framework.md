---
type: article
title:  "SGLang 大模型服务框架"
date:   2024-09-06 08:00:00 +0800
tags: [sglang, vllm, flashinfer, cuda]
---

## SGLang
SGLang is a fast serving framework for large language models and vision language models. It makes your interaction with models faster and more controllable by co-designing the backend runtime and frontend language.

[SGLang](https://github.com/sgl-project/sglang) 是用于大型语言模型和视觉语言模型的快速服务框架。通过协同设计后端运行时和前端语言，使您与模型的交互更快速、更可控。

The core features include:

核心功能包括：
- **Fast Backend Runtime**: Efficient serving with RadixAttention for prefix caching, jump-forward constrained decoding, continuous batching, token attention (paged attention), tensor parallelism, FlashInfer kernels, and quantization (AWQ/FP8/GPTQ/Marlin).
- **快速后端运行时**：通过 RadixAttention 实现高效的服务，支持前缀缓存（prefix caching）、受限跳转前缀解码（jump-forward constrained decoding）、连续批处理（continuous batching）、令牌注意力(分页注意力)（token attention (paged attention)）、张量并行（tensor parallelism）、FlashInfer 内核和量化（AWQ/FP8/GPTQ/Marlin）。
- **Flexible Frontend Language**: Enables easy programming of LLM applications with chained generation calls, advanced prompting, control flow, multiple modalities, parallelism, and external interactions.
- **灵活的前端语言**：通过链式生成调用（chained generation calls）、高级提示（advanced prompting）、控制流（control flow）、多模态（multiple modalities）、并行（parallelism）和外部交互（external interactions），轻松编程 LLM 应用。


## 安装
```bash
python -m venv env
source env/bin/activate

pip install --upgrade pip
pip install "sglang[all]"

# Install FlashInfer CUDA kernels
pip install flashinfer -i https://flashinfer.ai/whl/cu121/torch2.4/
```

对于国内访问 GitHub 有困难的用户，接上梯子，可以使用以下命令下载并安装：

```bash
wget https://github.com/flashinfer-ai/flashinfer/releases/download/v0.1.6/flashinfer-0.1.6%2Bcu121torch2.4-cp310-cp310-linux_x86_64.whl
pip install flashinfer-0.1.6+cu121torch2.4-cp310-cp310-linux_x86_64.whl
```


## 后端：SGLang Runtime (SRT)
- sglang v0.3.0

部署 Qwen2-7B-Instruct 模型

```bash
python -m sglang.launch_server \
    --model-path /data/models/llm/qwen/Qwen2-7B-Instruct \
    --served-model-name Qwen2-7B \
    --port 30000 \
    --tensor-parallel-size 4 \
    --mem-fraction-static 0.66
```
- `--served-model-name`: 模型名称。
- `--tensor-parallel-size 4` `--tp-size`: 使用 4 卡张量并行。
- `--mem-fraction-static 0.66`: 降低静态内存分配比例。
- `--disable-cuda-graph`: 禁用CUDA图。这可能会稍微降低性能，但可以减少内存使用。
- `--enable-torch-compile`: 启用 Torch 编译器。
- `--max-num-reqs`: 限制并发请求数。

部署使用 2 卡张量并行（`--tp 2`）和 2 卡数据并行（`--dp 2`）。

```bash
python -m sglang.launch_server \
    --model-path /data/models/llm/qwen/Qwen2-7B-Instruct \
    --served-model-name Qwen2-7B \
    --port 30000 \
    --tp 2 --dp 2 \
    --mem-fraction-static 0.66
```

`2 卡张量并行`的速度每秒生成 `31 Tokens`。

使用 curl 调用 OpenAI 兼容 API

- completions
```bash
curl http://127.0.0.1:30000/v1/completions \
    -H "Content-Type: application/json" \
    -d '{
        "model": "Qwen2-7B",
        "prompt": "你是谁？",
        "temperature": 0.3
    }'|jq
```

- chat/completions
```bash
curl http://127.0.0.1:30000/v1/chat/completions \
    -H "Content-Type: application/json" \
    -d '{
        "model": "Qwen2-7B", 
        "messages": [{
            "role": "user", 
            "content": "你是谁？"
        }], 
        "temperature": 0.3
    }'|jq
```

部署 Qwen2-72B-Instruct-GPTQ-Int4 模型

```bash
python -m sglang.launch_server \
    --model-path /data/models/llm/qwen/Qwen2-72B-Instruct-GPTQ-Int4 \
    --quantization gptq \
    --served-model-name Qwen2-72B \
    --port 30000 \
    --tensor-parallel-size 4 \
    --disable-cuda-graph
```

| 模型参数（B） | mem-fraction-static | disable-cuda-graph | enable-torch-compile | 卡数 | 显存使用 | 输入（Tokens） | 输出（Tokens） | 每秒生成（Tokens） |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 7 | 0.66 | ❌ | ❌ | 4 | 14647MiB / 15360MiB |   19 | 781 | 53.54 |
| 7 | 0.66 | ❌ | ❌ | 4 | 14647MiB / 15360MiB | 1495 | 264 | 51.47 |
| 7 | 0.85 | ✅ | ❌ | 4 | 13953MiB / 15360MiB |   19 | 566 | 45.33 |
| 7 | 0.85 | ❌ | ✅ | 4 | ❌ | ❌ | ❌ | ❌ |
| 7 | 0.85 | ✅ | ✅ | 4 | 13875MiB / 15360MiB |   19 | 559 | 47.79 |
| 72 | 0.85 | ✅ | ❌ | 4 | 13851MiB / 15360MiB |  19 | 633 | 16.50 |

- `7B`: Qwen2-7B-Instruct
- `72B`: Qwen2-72B-Instruct-GPTQ-Int4


## 后端：vLLM Runtime
- vllm v0.6.0

部署 Qwen2-7B-Instruct 模型

```bash
python -m vllm.entrypoints.openai.api_server \
    --model /data/models/llm/qwen/Qwen2-7B-Instruct \
    --served-model-name Qwen2-7B \
    --port 30000 \
    --tensor-parallel-size 4 \
    --dtype float16
```
- `--tensor-parallel-size 4`: 使用 4 卡张量并行
- `--dtype float16`: T4 不支持 bfloat16

部署 Qwen2-72B-Instruct-GPTQ-Int4 模型

```bash
python -m vllm.entrypoints.openai.api_server \
    --model /data/models/llm/qwen/Qwen2-72B-Instruct-GPTQ-Int4 \
    --quantization gptq \
    --served-model-name Qwen2-72B \
    --port 30000 \
    --tensor-parallel-size 4 \
    --gpu-memory-utilization 0.99 \
    --max_model_len 8192 \
    --dtype float16
```

| 模型参数（B） | 卡数 | 显存使用 | 输入（Tokens） | 输出（Tokens） | 每秒生成（Tokens） |
| --- | --- | --- | --- | --- | --- |
| 7 | 4 | 11233MiB / 15360MiB | 19 | 573 | 43.60 |
| 7 | 4 | 11233MiB / 15360MiB | 1495 | 208 | 40.29 |
| 72 | 4 | 13983MiB / 15360MiB | 19 | 683 | 16.88 |


**SGLang 比 vLLM 的性能快 🚀 `20%` 以上。**


## 参考资料
- [SGLang](https://github.com/sgl-project/sglang)
- [Guide on Hyperparameter Tuning](https://github.com/sgl-project/sglang/blob/main/docs/en/hyperparameter_tuning.md)
- [FlashInfer - Kernel Library for LLM Serving](https://github.com/flashinfer-ai/flashinfer)
- [贾扬清点赞：3K star量的SGLang上新，加速Llama 405B推理秒杀vLLM、TensorRT-LLM](https://mp.weixin.qq.com/s/FYwguU3USf12Wb5HXaHH3A)
- [Qwen2-7B-Instruct](https://www.modelscope.cn/models/qwen/Qwen2-7B-Instruct)
