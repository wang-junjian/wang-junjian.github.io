---
layout: post
title:  "使用 llama.cpp 构建兼容 OpenAI 服务"
date:   2024-01-19 08:00:00 +0800
categories: llama.cpp
tags: [llama.cpp, Quantization, LLM, Qwen, DeepSeek, llama-cpp-python, OpenAI, 困惑度, PPL, Perplexity, curl, Metal, MPS, cuBLAS, CUDA, TeslaT4, MacBookProM2Max]
---

## [llama.cpp][llama.cpp]
- [使用 llama.cpp 构建本地聊天服务]({% post_url 2023-12-16-building-a-local-chat-service-using-llama-cpp %})

## 模型量化
### 量化类型
```shell
./quantize --help
```
```
Allowed quantization types:
   2  or  Q4_0    :  3.56G, +0.2166 ppl @ LLaMA-v1-7B
   3  or  Q4_1    :  3.90G, +0.1585 ppl @ LLaMA-v1-7B
   8  or  Q5_0    :  4.33G, +0.0683 ppl @ LLaMA-v1-7B
   9  or  Q5_1    :  4.70G, +0.0349 ppl @ LLaMA-v1-7B
  19  or  IQ2_XXS :  2.06 bpw quantization
  20  or  IQ2_XS  :  2.31 bpw quantization
  10  or  Q2_K    :  2.63G, +0.6717 ppl @ LLaMA-v1-7B
  21  or  Q2_K_S  :  2.16G, +9.0634 ppl @ LLaMA-v1-7B
  12  or  Q3_K    : alias for Q3_K_M
  11  or  Q3_K_S  :  2.75G, +0.5551 ppl @ LLaMA-v1-7B
  12  or  Q3_K_M  :  3.07G, +0.2496 ppl @ LLaMA-v1-7B
  13  or  Q3_K_L  :  3.35G, +0.1764 ppl @ LLaMA-v1-7B
  15  or  Q4_K    : alias for Q4_K_M
  14  or  Q4_K_S  :  3.59G, +0.0992 ppl @ LLaMA-v1-7B
  15  or  Q4_K_M  :  3.80G, +0.0532 ppl @ LLaMA-v1-7B
  17  or  Q5_K    : alias for Q5_K_M
  16  or  Q5_K_S  :  4.33G, +0.0400 ppl @ LLaMA-v1-7B
  17  or  Q5_K_M  :  4.45G, +0.0122 ppl @ LLaMA-v1-7B
  18  or  Q6_K    :  5.15G, -0.0008 ppl @ LLaMA-v1-7B
   7  or  Q8_0    :  6.70G, +0.0004 ppl @ LLaMA-v1-7B
   1  or  F16     : 13.00G              @ 7B
   0  or  F32     : 26.00G              @ 7B
```

#### 困惑度（PPL, Perplexity）
"PPL" 是 "Perplexity" 的缩写，中文通常翻译为“困惑度”。在自然语言处理（NLP）中，困惑度是一种衡量模型性能的指标，特别是在语言模型中。

困惑度基于模型对测试集数据的概率，它的值越小，说明模型的性能越好。具体来说，如果一个模型的困惑度为 P，那么当这个模型预测下一个词的时候，它的不确定性（或者说“困惑度”）就相当于在 P 个词中随机选择一个词。

例如，如果一个模型的困惑度为 10，那么这个模型预测下一个词的不确定性就相当于在 10 个词中随机选择一个词。如果另一个模型的困惑度为 5，那么这个模型预测下一个词的不确定性就相当于在 5 个词中随机选择一个词。因此，困惑度越小，模型的性能就越好。

### 编译

克隆代码

```shell
git clone https://github.com/ggerganov/llama.cpp
cd llama.cpp
```

#### Metal (MPS)
```shell
make
```

#### cuBLAS (CUDA)
需要安装 [nvidia-container-toolkit](https://github.com/NVIDIA/nvidia-container-toolkit)

```shell
make LLAMA_CUBLAS=1
```

### 量化
```shell
# install
pip install -r requirements.txt

# convert to gguf
python convert.py [--outtype {f32,f16,q8_0}] [--pad-vocab] [--vocab-type {spm,bpe,hfft}] [--outfile OUTFILE] model
python convert-hf-to-gguf.py [--outtype {f32,f16}] [--outfile OUTFILE] model

# quantize
./quantize model.gguf [model-quant.gguf] quant-type
```

### 测试
#### Metal (MPS)
```shell
./main -m ~/HuggingFace/wangjunjian/gguf/deepseek-llm-7b-chat.Q5_K_M.gguf \
    --n-gpu-layers -1 -e -p "写一篇1000字的作文：《2024回家过年》"
```

#### cuBLAS (CUDA)
```shell
CUDA_VISIBLE_DEVICES=0 ./main -m /data/models/gguf/deepseek-llm-7b-chat.Q5_K_M.gguf \
    5000 -e -p "写一篇1000字的作文：《2024回家过年》"
```

### 速度
- MacBook Pro M2 Max
  - CPU：速度每秒 `17 Tokens`
  - GPU：速度每秒 `45 Tokens`
- NVIDIA Tesla T4
  - GPU：速度每秒 `36 Tokens`
- Intel Xeon Silver 4216（64 核）
  - CPU：速度每秒 `9 Tokens`

## 模型

可以从 [TheBloke](https://huggingface.co/TheBloke) 下载更多不同量化的 GGUF 模型。

### [Qwen][Qwen]
- [Qwen/Qwen-7B-Chat][https://huggingface.co/Qwen/Qwen-7B-Chat]
- [Merge qwen to llama cpp](https://github.com/ggerganov/llama.cpp/pull/4281)
- [qwen.cpp](https://github.com/QwenLM/qwen.cpp)
- [llama.cpp][llama.cpp]

1. 转换 GGUF
```shell
python convert-hf-to-gguf.py \
    --outtype f32 \
    --outfile ~/HuggingFace/wangjunjian/gguf/qwen-7b-chat-f32.gguf \
    ~/HuggingFace/Qwen/Qwen-7B-Chat
```

2. 量化 Q5_K_M
```shell
./quantize \
    ~/HuggingFace/wangjunjian/gguf/qwen-7b-chat-f32.gguf \
    ~/HuggingFace/wangjunjian/gguf/qwen-7b-chat.Q5_K_M.gguf \
    Q5_K_M
```

3. 测试
```shell
./main -m ~/HuggingFace/wangjunjian/gguf/qwen-7b-chat.Q5_K_M.gguf \
    -n 256 -e -p "解释命令: make -j"
```
```
解释命令: make -j4
执行结果:
make -j4
由于我们没有提供任何选项或参数给make命令，make将使用默认的参数。通常情况下，make命令会自动检测系统中可用的CPU数量，并在执行时使用这些CPU进行并行化。但是，如果我们想要手动指定使用的CPU数量，则可以使用-j参数来实现。
例如，我们可以使用以下命令来指定使用4个CPU进行并行处理：

make -j4

这将使make命令同时使用4个CPU来构建项目。注意，使用多个CPU进行并行化可能会增加系统的负载，并可能导致其他程序或服务的性能下降。因此，在执行这种操作之前，请确保您的系统有足够的资源来支持并行化。
总的来说，make命令是一个非常强大的工具，可以帮助我们自动化各种任务。通过掌握make命令的基本语法和选项，我们可以更有效地管理和构建项目。[PAD151643] [end of text]
```

### [DeepSeek][DeepSeek]
- [deepseek-ai/deepseek-llm-7b-chat](https://huggingface.co/deepseek-ai/deepseek-llm-7b-chat)
- [DeepSeek 模型量化](https://github.com/deepseek-ai/deepseek-coder/?tab=readme-ov-file#7-qa)
- [llama.cpp][llama.cpp]

1. 转换 GGUF
```shell
python convert.py \
    --outtype f32 --vocab-type bpe --pad-vocab \
    --outfile ~/HuggingFace/wangjunjian/gguf/deepseek-llm-7b-chat-f32.gguf \
    ~/HuggingFace/deepseek-ai/deepseek-llm-7b-chat
```

2. 量化 Q5_K_M
```shell
./quantize \
    ~/HuggingFace/wangjunjian/gguf/deepseek-llm-7b-chat-f32.gguf \
    ~/HuggingFace/wangjunjian/gguf/deepseek-llm-7b-chat.Q5_K_M.gguf \
    Q5_K_M
```

3. 测试
```shell
./main -m ~/HuggingFace/wangjunjian/gguf/deepseek-llm-7b-chat.Q5_K_M.gguf \
    -n 256 -e -p "解释命令: make -j"
```
```
解释命令: make -j4
编译时，make 会检查源代码文件是否发生了改变。如果发生改变了，那么它就会重新编译那些相关的目标文件。如果没有发生变化，那么它会跳过编译过程。
-j4 参数告诉 make 并行运行多个任务（最多四个）以加快构建速度。 [end of text]
```


## [llama-cpp-python][llama-cpp-python]

- [Python Bindings for llama.cpp](https://llama-cpp-python.readthedocs.io/en/latest/)
- [Local Copilot replacement](https://llama-cpp-python.readthedocs.io/en/latest/server/#code-completion)
- [Function Calling support](https://llama-cpp-python.readthedocs.io/en/latest/server/#function-calling)
- [Vision API support](https://llama-cpp-python.readthedocs.io/en/latest/server/#multimodal-models)
- [Multiple Models](https://llama-cpp-python.readthedocs.io/en/latest/server/#configuration-and-multi-model-support)

### 安装

- [Getting Started](https://llama-cpp-python.readthedocs.io/en/latest/)
- [Development](https://llama-cpp-python.readthedocs.io/en/latest/#development)

创建虚拟环境

```shell
conda create -n llama-cpp-python python
conda activate llama-cpp-python
```

#### [Metal (MPS)](https://llama-cpp-python.readthedocs.io/en/latest/install/macos/)
```shell
CMAKE_ARGS="-DLLAMA_METAL=on" FORCE_CMAKE=1 pip install "llama-cpp-python[server]"
```

#### [cuBLAS (CUDA)](https://llama-cpp-python.readthedocs.io/en/latest/#cublas)
```shell
CMAKE_ARGS="-DLLAMA_CUBLAS=on" FORCE_CMAKE=1 pip install llama-cpp-python[server]
```

### 运行兼容 OpenAI 服务
- [OpenAI Compatible Server](https://llama-cpp-python.readthedocs.io/en/latest/server/)

#### 主要参数
- `--model MODEL`             The path to the model to use for generating completions.
- `--model_alias MODEL_ALIAS` The alias of the model to use for generating completions.
- `--n_gpu_layers N_GPU_LAYERS` The number of layers to put on the GPU. The rest will be on the CPU. Set -1 to move all to GPU.
- `--n_ctx N_CTX`             The context size. (default: 2048)
- `--chat_format CHAT_FORMAT` Chat format to use. (default: llama-2)
- `--host HOST`               Listen address (default: localhost)
- `--port PORT`               Listen port (default: 8000)
- `--api_key API_KEY`         API key for authentication. If set all requests need to be authenticated.

#### Metal (MPS)
```shell
python -m llama_cpp.server \
    --model ~/HuggingFace/wangjunjian/gguf/deepseek-llm-7b-chat.Q5_K_M.gguf \
    --model_alias gpt-3.5-turbo \
    --host 0.0.0.0 --port 8080 \
    --n_gpu_layers -1 \
    --chat_format chatml
```

`--n_gpu_layers` 要放置在 GPU 上的层数。 其余的将在 CPU 上进行。 设置 `-1` 将全部移至 GPU，如果不使用 `--n_gpu_layers` 参数将使用 CPU 运行。

#### cuBLAS (CUDA)
```shell
python -m llama_cpp.server \
    --model /data/models/gguf/deepseek-llm-7b-chat.Q5_K_M.gguf \
    --model_alias gpt-3.5-turbo \
    --n_gpu_layers 15000 \
    --host 0.0.0.0 --port 8080 \
    --chat_format chatml
```

可以使用 `CUDA_VISIBLE_DEVICES` 环境变量指定 GPU。

测试的过程中，遇到了以下错误：

```shell
Llama.generate: prefix-match hit
CUDA error: invalid argument
  current device: 0, in function ggml_backend_cuda_buffer_get_tensor at /tmp/pip-install-ulfkej7c/llama-cpp-python_7f8116c5437340c7b46a6e712c01894b/vendor/llama.cpp/ggml-cuda.cu:10317
  cudaMemcpy(data, (const char *)tensor->data + offset, size, cudaMemcpyDeviceToHost)
GGML_ASSERT: /tmp/pip-install-ulfkej7c/llama-cpp-python_7f8116c5437340c7b46a6e712c01894b/vendor/llama.cpp/ggml-cuda.cu:231: !"CUDA error"
Aborted (core dumped)
```

- [warning: failed to mlock NNN-byte buffer (after previously locking MMM bytes)](https://github.com/abetlen/llama-cpp-python/issues/708)

#### [配置多模型](https://llama-cpp-python.readthedocs.io/en/latest/server/#configuration-and-multi-model-support)

服务器支持通过 JSON 配置文件进行配置，可以使用 `--config_file` 参数或 `CONFIG_FILE` 环境变量传递该文件。

创建配置文件 `config.json`，并将其保存在当前目录中：

```json
{
    "host": "0.0.0.0",
    "port": 8080,
    "models": [
        {   
            "model": "/Users/junjian/HuggingFace/wangjunjian/gguf/qwen-7b-chat.Q5_K_M.gguf",
            "model_alias": "gpt-3.5-turbo",
            "chat_format": "chatml",
            "n_gpu_layers": -1, 
            "offload_kqv": true,
            "n_threads": 12, 
            "n_batch": 512,
            "n_ctx": 2048
        },  
        {   
            "model": "/Users/junjian/HuggingFace/wangjunjian/gguf/deepseek-llm-7b-chat.Q5_K_M.gguf",
            "model_alias": "gpt-4",
            "chat_format": "chatml",
            "n_gpu_layers": -1, 
            "offload_kqv": true,
            "n_threads": 12, 
            "n_batch": 512,
            "n_ctx": 2048
        }   
    ]   
}
```

**目前只有单个模型加载到内存中，服务器将根据需要自动加载和卸载模型。**

同时部署两个一样的模型，也不会提高性能，因为只有一个模型会被加载到内存中。

```json
{
    "models": [
        {   
            "model": "/Users/junjian/HuggingFace/wangjunjian/gguf/qwen-7b-chat.Q5_K_M.gguf",
            "model_alias": "gpt-3.5-turbo",
        },  
        {   
            "model": "/Users/junjian/HuggingFace/wangjunjian/gguf/qwen-7b-chat.Q5_K_M.gguf",
            "model_alias": "gpt-3.5-turbo",
        }   
    ]   
}
```

运行服务

```shell
python -m llama_cpp.server --config_file config.json
```

### curl 调用 API
- [Text generation models](https://platform.openai.com/docs/guides/text-generation?lang=curl)
- [OpenAI Completions API (Legacy)](https://platform.openai.com/docs/api-reference/completions)

#### 模型列表
```shell
curl http://localhost:8080/v1/models | jq
```
```json
{
  "object": "list",
  "data": [
    {
      "id": "gpt-3.5-turbo",
      "object": "model",
      "owned_by": "me",
      "permissions": []
    },
    {
      "id": "gpt-4",
      "object": "model",
      "owned_by": "me",
      "permissions": []
    }
  ]
}
```

#### `POST` `/v1/completions`
```shell
curl http://localhost:8080/v1/completions \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
    "model": "gpt-3.5-turbo",
    "max_tokens": 2048,
    "prompt": "写一篇1000字的作文：《2024回家过年》"
  }'|jq
```
```json
{
  "id": "cmpl-cd79289e-d323-441a-97ad-561df9726ad5",
  "object": "text_completion",
  "created": 1705671912,
  "model": "gpt-3.5-turbo",
  "choices": [
    {
      "text": "\n\n题目要求写一篇1000字的作文，主题为“2024回家过年”。这是一个非常宽泛的主题，可以涉及各种角度和情感。以下是一个可能的写作方向：\n\n2024年，我终于有了机会回家过年。我已经在外工作了五年，每年都在城市里度过春节，只有今年，我可以回到家乡，与家人一起欢度佳节。\n\n回家的路途并不遥远，只需几个小时的飞行，但对我来说，这却是一次心灵的旅程。我看到了窗外的山川、河流和田野，它们在阳光下显得生机勃勃，仿佛在欢迎我的归来。我感到了空气中的清新和湿润，那是家乡特有的气息，让我感到无比的舒适和安宁。\n\n当我终于到达家门前的时候，我看到的是熟悉的面孔和亲切的笑容。父母已经准备好了一桌丰盛的年夜饭，等待着我和妹妹的到来。我们围坐在餐桌前，享受着美食的同时，也在分享彼此的生活故事和工作经历。\n\n在家乡过年，最让我感到幸福的就是与家人一起度过的时间。我们一起包饺子、贴春联、看春晚，这些熟悉的活动让我感到无比的亲切和温馨。我也感到了家人的关爱和支持，他们始终在我身边，给我力量和勇气去面对生活中的挑战和困难。\n\n除夕夜，我们一家人围坐在电视机前，看着春晚的节目，享受着团圆的美好时光。我看到了父母眼中的期待和满足，也看到了妹妹脸上的笑容和快乐。我知道，这就是我一直想要的生活，这就是我一直向往的家的感觉。\n\n回家过年，让我感到无比的幸福和满足。我明白了，无论我在哪里，无论我在做什么，家人永远是我最坚实的后盾和最温暖的港湾。我也明白了，只有回到家乡，才能真正地感受到生活的美好和家的味道。\n\n2024年的春节，对我来说是一次难忘的经历。它让我更加珍惜与家人在一起的时间，也让我更深刻地理解了家的意义。我知道，无论未来我会去哪里，我都会记住这个春节，记住这个回家的感觉。\n\n这是一个充满温情和亲情的主题，可以引发读者对家庭、团圆和爱的思考。在写作中，可以通过描绘家乡的风景、描述家人的面孔和行为、表达自己的感受和思考等方式，来展现主题的深度和广度。同时，也可以通过对话和心理描写，来展示人物的性格和情感，增强文章的艺术感染力。最后，可以以一种感人的方式结束文章，如通过回忆过去的经历、展望未来的希望或者表达对家人的感谢和祝福等，来达到升华主题的效果。",
      "index": 0,
      "logprobs": null,
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 19,
    "completion_tokens": 535,
    "total_tokens": 554
  }
}
```

#### `POST` `/v1/chat/completions`
```shell
curl http://localhost:8080/v1/chat/completions \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
    "model": "gpt-3.5-turbo",
    "max_tokens": 2048,
    "messages": [ 
      { "role": "system", "content": "你是一名二次元助手，回答要精简。" },
      { "role": "user", "content": "最近有什么好看的番剧？" }
    ]
  }'|jq
```
```json
{
  "id": "chatcmpl-3305fdda-b6ec-4424-83ee-0346bc170d0a",
  "object": "chat.completion",
  "created": 1705672548,
  "model": "gpt-3.5-turbo",
  "choices": [
    {
      "index": 0,
      "message": {
        "content": "推荐《进击的巨人》、《鬼灭之刃》、《东京喰种》、《辉夜大小姐想让我告白》等。这些都是近年来非常受欢迎的番剧，剧情精彩，人物形象鲜明，值得一看。[PAD151645]\n",
        "role": "assistant"
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 55,
    "completion_tokens": 54,
    "total_tokens": 109
  }
}
```

#### `POST` `/v1/embeddings`
```shell
curl http://localhost:8080/v1/embeddings \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
    "input": "Embeddings are a way to represent words as vectors. The vectors are chosen in such a way that they are similar to other words that appear in similar contexts."
  }'|jq
```


[llama.cpp]: https://github.com/ggerganov/llama.cpp
[llama-cpp-python]: https://github.com/abetlen/llama-cpp-python
[Qwen]: https://huggingface.co/Qwen
[DeepSeek]: https://huggingface.co/deepseek-ai
