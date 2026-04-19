---
layout: single
title:  "MLX: An array framework for Apple silicon"
date:   2024-03-14 08:00:00 +0800
categories: MLX
tags: [MLX, LLM, Mistral, Qwen, WikiSQL, LoRA, QLoRA]
---

## [MLX](https://github.com/ml-explore/mlx) 介绍

MLX 是一个为 Apple Silicon 芯片上的机器学习研究设计的 array 框架，由 Apple 机器学习研究团队提供。

- 熟悉的 API：MLX 拥有一个与 NumPy 紧密对应的 Python API。MLX 还拥有功能齐全的 C++、C 和 Swift API，这些 API 也紧密地反映了 Python API。MLX 拥有更高级别的包，如 mlx.nn 和 mlx.optimizers，它们的 API 紧密跟随 PyTorch，以简化构建更复杂模型的过程。
- 统一内存：MLX 与其他框架的一个显著区别在于其统一内存模型。MLX 中的数组存在于共享内存中。可以在任何支持的设备类型上执行 MLX 数组的操作，无需数据传输。
- MLX 的设计受到了像 [NumPy](https://numpy.org/doc/stable/index.html)、[PyTorch](https://pytorch.org/)、[Jax](https://github.com/google/jax) 和 [ArrayFire](https://arrayfire.org/) 这样的框架的启发。


## 安装
- pip
```shell
pip install mlx
pip install mlx-lm
```

- conda
```shell
conda install -c conda-forge mlx
conda install -c conda-forge mlx-lm
```

```shell
pip install sentence_transformers   # Mistral requires
pip install jinja2                  # Mistral requires
pip install tiktoken                # Qwen requires
```


## 生成
- Mistral-7B-Instruct-v0.2
```shell
python -m mlx_lm.generate \
    --model mistralai/Mistral-7B-Instruct-v0.2 \
    --prompt "Why is the sky blue?" \
    --max-tokens 500
```

```
==========
Prompt: <s>[INST] Why is the sky blue? [/INST]
The sky appears blue due to a phenomenon called Rayleigh scattering. As sunlight reaches Earth's atmosphere, 
it interacts with molecules and particles in the air, causing the scattering of light. Blue light has a 
shorter wavelength and gets scattered more easily than other colors, such as red or yellow, which have longer 
wavelengths. As a result, when we look up at the sky, we predominantly see the blue light that has been 
scattered, giving the sky its familiar blue hue. However, the color of the sky can change depending on the 
time of day, weather conditions, and location, as other factors can influence the type and amount of particles 
in the atmosphere that scatter light.
==========
Prompt: 34.115 tokens-per-sec
Generation: 19.374 tokens-per-sec
```

- Qwen-7B-Chat
```shell
python -m mlx_lm.generate \
    --model Qwen/Qwen-7B-Chat \
    --prompt "Why is the sky blue?" \
    --trust-remote-code \
    --eos-token "<|endoftext|>" \
    --max-tokens 500
```

对于某些模型（例如 `Qwen` 和 `plamo`），分词器要求您启用 `trust_remote_code` 选项，信任终端中的远程代码。

对于 `Qwen` 模型，您还必须指定 `eos_token`。 您可以通过在命令行中传递 `--eos-token "<|endoftext|>"` 来完成此操作。


## 量化
- 4-bit
```shell
python -m mlx_lm.convert \
    --hf-path mistralai/Mistral-7B-Instruct-v0.2 \
    -q
```

量化后保存到 `mlx_model` 目录，可以使用参数 `--mlx-path` 指定保存目录。

```shell
mlx_model
├── config.json
├── model.safetensors
├── model.safetensors.index.json
├── special_tokens_map.json
├── tokenizer.json
├── tokenizer.model
└── tokenizer_config.json
```


## 量化
- float16
```shell
python -m mlx_lm.convert \
    --hf-path mistralai/Mistral-7B-Instruct-v0.2 \
    --mlx-path Mistral-7B-Instruct-v0.2-float16 \
    --dtype float16
```

量化后的模型可以使用 `mlx_lm.generate` 运行。

```shell
python -m mlx_lm.generate \
    --model mlx_model \
    --prompt "Why is the sky blue?"
```

速度对比

| 模型 | 量化 | Size (GB) | Prompt (Tokens/S) | Generation (Tokens/S) |
| ---- | --- | ---: | --------------: | ------------------: |
| mistralai/Mistral-7B-Instruct-v0.2(Hugging Face) | bfloat16 | 14 | 43.115 | 19.415 |
| Mistral-7B-Instruct-v0.2-float16 | float16 | 14 | 37.357 | 20.494 |
| Mistral-7B-Instruct-v0.2-4bit | int4 | 4 | 30.121 | 52.568 |


## 数据集 WikiSQL
### 样本格式
```json
{"text": "table: <table_name>
columns: <column_name1>, <column_name2>, <column_name3>
Q: <question>
A: SELECT <column_name2> FROM <table_name> WHERE <>"}
```

### 样本示例
```json
{"text": "table: 1-1000181-1\n
columns: State/territory, Text/background colour, Format, Current slogan, Current series, Notes\n
Q: What is the current series where the new series began in June 2011?\n
A: SELECT Current series FROM 1-1000181-1 WHERE Notes = 'New series began in June 2011'"}
```
上面的示例是一行数据，使用 JSONL 格式存储。


## 微调（LoRA / QLoRA）

```shell
python -m mlx_lm.lora \
    --model mistralai/Mistral-7B-v0.1 \
    --train \
    --data <path_to_data> \
    --iters 600
```

默认适配器权重保存在 `adapters.npz` 文件中。您可以使用 `--adapter-file` 指定输出位置。

数据目录中应该包含 `train.jsonl` 和 `valid.jsonl` 文件。


## 评估

```shell
python -m mlx_lm.lora \
    --model mistralai/Mistral-7B-v0.1 \
    --adapter-file adapters.npz \
    --data <path_to_data> \
    --test
```
计算测试集困惑度。

数据目录中应该包含 `test.jsonl` 文件。


## 使用微调模型生成

```shell
python -m mlx_lm.generate \
    --model mistralai/Mistral-7B-v0.1 \
    --adapter-file adapters.npz \
    --prompt "Why is the sky blue?"
```


## 融合
    
```shell
python -m mlx_lm.fuse \
    --model mistralai/Mistral-7B-v0.1 \
    --adapter-file adapters.npz \
    --save-path fused_model
```


## HTTP 服务

```shell
python -m mlx_lm.server \
    --model mistralai/Mistral-7B-Instruct-v0.2
```
- `--host HOST` Host for the HTTP server (default: 127.0.0.1)
- `--port PORT` Port for the HTTP server (default: 8080)
- `--adapter-file` ADAPTER_FILE

访问模型服务

```shell
curl localhost:8080/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
     "messages": [{"role": "user", "content": "Why is the sky blue?"}],
     "temperature": 0.7,
     "max_tokens": 250
   }'
```

- [HTTP Model Server](https://github.com/ml-explore/mlx-examples/blob/main/llms/mlx_lm/SERVER.md)


## 参考资料
- [mlx](https://github.com/ml-explore/mlx)
- [mlx-examples](https://github.com/ml-explore/mlx-examples)
- [LLMs in MLX with GGUF](https://github.com/ml-explore/mlx-examples/tree/main/llms/gguf_llm)
