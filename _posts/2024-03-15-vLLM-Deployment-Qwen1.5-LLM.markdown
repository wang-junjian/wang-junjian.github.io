---
layout: post
title:  "vLLM 部署 Qwen1.5 LLM"
date:   2024-03-15 10:00:00 +0800
categories: vLLM LLM
tags: [vLLM, LLM, Qwen, TeslaT4]
---

## [安装 vLLM](https://docs.vllm.ai/en/latest/getting_started/installation.html)
    
```shell
# (Optional) Create a new conda environment.
conda create -n vllm python=3.9 -y
conda activate vllm

# Install vLLM with CUDA 12.1.
pip install vllm
```

## vLLM 帮助
```shell
vLLM 兼容 OpenAI 的 RESTful API 服务器。

可选参数：
  -h, --help            显示此帮助信息并退出
  --host HOST           主机名
  --port PORT           端口号
  --allow-credentials   允许凭证
  --allowed-origins ALLOWED_ORIGINS
                       允许的来源
  --allowed-methods ALLOWED_METHODS
                       允许的方法
  --allowed-headers ALLOWED_HEADERS
                       允许的头部
  --api-key API_KEY     如果提供，服务器将要求在头部中呈现此密钥。
  --served-model-name SERVED_MODEL_NAME
                       在API中使用的模型名称。如果没有指定，模型名称将与huggingface名称相同。
  --lora-modules LORA_MODULES [LORA_MODULES ...]
                       LoRA模块配置，格式为名称=路径。可以指定多个模块。
  --chat-template CHAT_TEMPLATE
                       聊天模板的文件路径，或者是为指定模型的单行形式模板
  --response-role RESPONSE_ROLE
                       如果 `request.add_generation_prompt=true`，则返回的角色名称。
  --ssl-keyfile SSL_KEYFILE
                       SSL密钥文件的文件路径
  --ssl-certfile SSL_CERTFILE
                       SSL证书文件的文件路径
  --root-path ROOT_PATH
                       当应用位于基于路径的路由代理后面时，FastAPI的root_path
  --middleware MIDDLEWARE
                       要应用于应用的其他ASGI中间件。我们接受多个--middleware参数。值应该是一个导入路径。如果提供了一个函数，vLLM将使用@app.middleware('http')将其添加到服务器。
                       如果提供了一个类，vLLM将使用app.add_middleware()将其添加到服务器。
  --model MODEL         使用的huggingface模型的名称或路径
  --tokenizer TOKENIZER
                       使用的huggingface分词器的名称或路径
  --revision REVISION  要使用的具体模型版本。它可以是分支名称、标签名称或提交id。如果未指定，将使用默认版本。
  --code-revision CODE_REVISION
                       Hugging Face Hub上模型代码使用的具体修订版本。它可以是分支名称、标签名称或提交id。如果未指定，将使用默认版本。
  --tokenizer-revision TOKENIZER_REVISION
                       要使用的具体分词器版本。它可以是分支名称、标签名称或提交id。如果未指定，将使用默认版本。
  --tokenizer-mode {auto,slow}
                       分词器模式。"auto"将使用快速分词器（如果有的话），而"slow"将始终使用慢速分词器。
  --trust-remote-code   信任来自huggingface的远程代码
  --download-dir DOWNLOAD_DIR
                       下载和加载权重的目录，默认为huggingface的默认缓存目录
  --load-format {auto,pt,safetensors,npcache,dummy}
                       要加载的模型权重的格式。"auto"将尝试以safetensors格式加载权重，如果safetensors格式不可用，则回退到pytorch二进制格式。"pt"将以pytorch二进制格式加载权重。"safetensors"将以safetensors格式加载权重。"npcache"将以pytorch格式加载权重，并存储numpy缓存以加快加载速度。"dummy"将使用随机值初始化权重，主要用于分析。
  --dtype {auto,half,float16,bfloat16,float,float32}
                       模型权重和激活的数据类型。"auto"选项将为FP32和FP16模型使用FP16精度，为BF16模型使用BF16精度。
  --kv-cache-dtype {auto,fp8_e5m2}
                       kv缓存存储的数据类型。如果为"auto"，将使用模型数据类型。注意，当cuda版本低于11.8时，不支持FP8。
  --max-model-len MAX_MODEL_LEN
                       模型上下文长度。如果未指定，将从模型中自动派生。
  --worker-use-ray      使用Ray进行分布式服务，当使用超过1个GPU时将自动设置
  --pipeline-parallel-size PIPELINE_PARALLEL_SIZE, -pp PIPELINE_PARALLEL_SIZE
                       管道阶段的数量
  --tensor-parallel-size TENSOR_PARALLEL_SIZE, -tp TENSOR_PARALLEL_SIZE
                       张量并行副本的数量
  --max-parallel-loading-workers MAX_PARALLEL_LOADING_WORKERS
                       分批次顺序加载模型，以避免在使用张量并行和大型模型时出现RAM OOM
  --block-size {8,16,32,128}
                       标记块大小
  --seed SEED           随机种子
  --swap-space SWAP_SPACE
                      每个GPU的CPU交换空间大小（GiB）
  --gpu-memory-utilization GPU_MEMORY_UTILIZATION
                       用于模型执行器的GPU内存的比例，可以在0到1之间。如果未指定，将使用默认值0.9。
  --max-num-batched-tokens MAX_NUM_BATCHED_TOKENS
                       每次迭代中批处理的标记的最大数量
  --max-num-seqs MAX_NUM_SEQS
                       每次迭代中的序列的最大数量
  --max-paddings MAX_PADDINGS
                       批处理中的填充的最大数量
  --disable-log-stats   禁用记录统计信息
  --quantization {awq,gptq,squeezellm,None}, -q {awq,gptq,squeezellm,None}
                       用于量化权重的方法。如果为None，我们首先检查模型配置文件中的`quantization_config`属性。如果该属性为None，我们假设模型权重未量化，并使用`dtype`来确定权重的数据类型。
  --enforce-eager       始终使用急切模式PyTorch。如果为False，将为最大性能和灵活性使用急切模式和CUDA图形混合。
  --max-context-len-to-capture MAX_CONTEXT_LEN_TO_CAPTURE
                       CUDA图形覆盖的最大上下文长度。当序列的上下文长度大于这个长度时，我们回退到急切模式。
  --disable-custom-all-reduce
                       参见ParallelConfig
  --enable-lora        如果为True，则启用LoRA适配器的处理。
  --max-loras MAX_LORAS
                       单个批次中LoRAs的最大数量。
  --max-lora-rank MAX_LORA_RANK
                       最大LoRA秩。
  --lora-extra-vocab-size LORA_EXTRA_VOCAB_SIZE
                       LoRA适配器中可以存在的额外词汇表的最大大小（添加到基础模型词汇表中）。
  --lora-dtype {auto,float16,bfloat16,float32}
                       LoRA的数据类型。如果为auto，将默认为基础模型的数据类型。
  --max-cpu-loras MAX_CPU_LORAS
                       存储在CPU内存中的最大LoRAs数量。必须>= max_num_seqs。默认为max_num_seqs。
  --device {auto,cuda,neuron}
                       vLLM执行的设备类型。
  --engine-use-ray      使用Ray在单独的进程中启动LLM引擎，作为服务器进程。
  --disable-log-requests
                       禁用记录请求
  --max-log-len MAX_LOG_LEN
                       在日志中打印的提示字符或提示ID号码的最大数量。默认：无限制。
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

### Qwen1.5-32B-Chat-GPTQ-Int4

下载模型

```shell
git clone https://www.modelscope.cn/qwen/Qwen1.5-32B-Chat-GPTQ-Int4.git
```


启动服务

#### 调整 PyTorch 的内存分配策略，*T4:2*
```shell
PYTORCH_CUDA_ALLOC_CONF=max_split_size_mb:64 \
python -m vllm.entrypoints.openai.api_server \
    --model Qwen/Qwen1.5-32B-Chat-GPTQ-Int4 \
    --served-model-name gpt-3.5-turbo \
    --quantization gptq \
    --gpu-memory-utilization 0.95 \
    --tensor-parallel-size 2 \
    --max-model-len 7000
```
- 调整 PyTorch 的内存分配策略：通过环境变量 `PYTORCH_CUDA_ALLOC_CONF` 设置 `max_split_size_mb` 参数来调整 PyTorch 的内存分配策略，以避免内存碎片化。
- --max-model-len `7000`

#### eager 模式运行，*T4:2*
```shell
python -m vllm.entrypoints.openai.api_server \
    --model Qwen/Qwen1.5-32B-Chat-GPTQ-Int4 \
    --served-model-name gpt-3.5-turbo \
    --quantization gptq \
    --gpu-memory-utilization 0.95 \
    --tensor-parallel-size 2 \
    --max-model-len 12000 \
    --enforce-eager
```
- 在 `eager` 模式下，模型的计算会立即执行，而不会被编译为 CUDA graphs。
- --max-model-len `12000`

**❌ `PYTORCH_CUDA_ALLOC_CONF` 和 `enforce-eager` 同时设置没有得到增益**

#### *T4:4*
```shell
python -m vllm.entrypoints.openai.api_server \
    --model Qwen/Qwen1.5-32B-Chat-GPTQ-Int4 \
    --served-model-name gpt-3.5-turbo \
    --quantization gptq \
    --tensor-parallel-size 4
```


## 参考资料
- [vLLM](https://github.com/vllm-project/vllm)
- [Qwen1.5](https://github.com/QwenLM/Qwen1.5)
