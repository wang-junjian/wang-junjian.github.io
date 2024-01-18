---
layout: post
title:  "LLM 的基准测试"
date:   2024-01-17 08:00:00 +0800
categories: LLM Benchmark
tags: [LLM, Benchmark, wrk, Qwen]
---

## 速度测试脚本
### 安装依赖

```shell
pip install typer
pip install openai==0.28
```

### 脚本：llm-speed-test.py

```py
import time
import openai
import typer

app = typer.Typer()

@app.command()
def main(api_base: str = 'http://127.0.0.1:8000/v1',
         api_key: str = 'NULL',
         prompt: str = '你是谁',
         model: str = 'gpt-3.5-turbo',
         max_tokens: int = 256,
         temperature: float = 0.7,
         top_p: float = 0.95):
    openai.api_base = api_base
    openai.api_key = api_key

    begin_time = time.time()
    response = openai.Completion.create(
        model=model,
        prompt=prompt,
        max_tokens=max_tokens,
        temperature=temperature,
        top_p=top_p
    )
    end_time = time.time()

    text = response.choices[0].text
    prompt_tokens = response.usage.prompt_tokens
    total_tokens = response.usage.total_tokens
    completion_tokens = response.usage.completion_tokens

    print(f'🧑 {prompt}')
    print(f'🤖 {text}')
    print(f'🚀 每秒生成 Tokens: {completion_tokens/(end_time-begin_time):.2f} \t 合计 Tokens （{total_tokens}） = 输入 Tokens（{prompt_tokens}） + 输出 Tokens（{completion_tokens}）')
    print(f'🚀 每秒生成字符   : {len(text)/(end_time-begin_time):.2f} \t 合计生成字符（{len(text)}）')
    print(f'⏱️ 生成耗时: {(end_time-begin_time):.2f} 秒')

if __name__ == "__main__":
    app()
```

### 使用 
```shell
Usage: llm-speed-test.py [OPTIONS]

Options:
  --api-base TEXT                 [default: http://127.0.0.1:8000/v1]
  --api-key TEXT                  [default: NULL]
  --prompt TEXT                   [default: 你是谁]
  --model TEXT                    [default: gpt-3.5-turbo]
  --max-tokens INTEGER            [default: 256]
  --temperature FLOAT             [default: 0.7]
  --top-p FLOAT                   [default: 0.95]
```

示例：

```shell
python llm-speed-test.py --prompt "写一篇1000字关于鲁软数字在电力信息化方面取得成绩的文章。\n"
```
```
🧑 写一篇1000字关于鲁软数字在电力信息化方面取得成绩的文章。\n
🤖 \n标题：鲁软数字在电力信息化方面的成绩\n\n正文：\n\n在数字化转型的大潮中，鲁软数字凭借其深厚的技术实力和丰富的实践经验，成功地在电力信息化领域取得了显著的成果。鲁软数字不仅在电力信息化领域有着广泛的应用，而且在多个方面都取得了令人瞩目的成绩。\n\n首先，鲁软数字在电力信息化领域有着广泛的应用。在电力信息化领域，鲁软数字主要负责电力系统的信息化建设，包括电力系统监控系统、电力调度系统、电力营销系统等。鲁软数字通过开发一系列先进的软件产品，为电力系统的信息化建设提供了强有力的支持。例如，鲁软数字开发的电力调度系统，能够实现电力系统的实时监控和调度，大大提高了电力系统的运行效率。\n\n其次，鲁软数字在电力信息化领域也取得了多项重要的研究成果。在电力信息化领域，鲁软数字还研发了一系列先进的技术，包括电力系统仿真技术、电力系统安全技术等。这些技术的研发，为电力系统的信息化建设提供了有力的技术支持。例如，鲁软数字研发的电力系统仿真技术，能够为电力系统的建设和运行提供精确的数据支持。\n\n最后，鲁软数字在电力信息化领域还取得了多项重要的成果。在电力信息化领域，鲁软数字还研发了一系列先进的服务产品，包括电力信息系统建设服务、电力信息系统运维服务等。这些服务的产品，能够为电力系统的建设和运维提供全面的服务支持。例如，鲁软数字研发的电力信息系统建设服务，能够为电力系统的建设和运维提供全面的技术支持和管理服务。\n\n总的来说，鲁软数字在电力信息化领域有着广泛的应用，而且在多个方面都取得了令人瞩目的成绩。这些成绩的取得，不仅体现了鲁软数字的技术实力和丰富的实践经验，也体现了鲁软数字在电力信息化领域的重要地位。在未来，鲁软数字将继续在电力信息化领域发挥重要作用，为电力系统的信息化建设提供更加有力的支持。
🚀 每秒生成 Tokens: 62.36 	 合计 Tokens （424） = 输入 Tokens（20） + 输出 Tokens（404）
🚀 每秒生成字符   : 117.31 	 合计生成字符（760）
⏱️ 生成耗时: 6.48 秒
```


## 部署 LLM
### 安装 [FastChat](https://github.com/lm-sys/FastChat)
- [FastChat 部署多模型]({% post_url 2023-10-24-fastchat-deploys-multi-model %})
- [Qwen (通义千问)]({% post_url 2023-12-25-Qwen %})
- [在 MacBook Pro M2 Max 上安装 FastChat]({% post_url 2024-01-11-Install-FastChat-on-MacBook-Pro-M2-Max %})

### 安装 [vLLM](https://github.com/vllm-project/vllm)
```shell
pip install vllm -i https://mirrors.aliyun.com/pypi/simple/
```

### 运行 Controller
```shell
python -m fastchat.serve.controller
```

### 运行 OpenAI API Server
```shell
python -m fastchat.serve.openai_api_server
```

### 运行 Model Worker
#### Qwen/Qwen-1_8B-Chat
```shell
python -m fastchat.serve.model_worker \
    --model-path Qwen/Qwen-1_8B-Chat \
    --model-names gpt-3.5-turbo
```

### 运行 vLLM Worker
#### 参数
```shell
  --host HOST
  --port PORT
  --worker-address WORKER_ADDRESS
  --controller-address CONTROLLER_ADDRESS
  --model-path MODEL_PATH
  --model-names MODEL_NAMES
                        Optional display comma separated names
  --limit-worker-concurrency LIMIT_WORKER_CONCURRENCY
  --no-register
  --num-gpus NUM_GPUS
  --conv-template CONV_TEMPLATE
                        Conversation prompt template.
  --trust_remote_code   Trust remote code (e.g., from HuggingFace) whendownloading the model and tokenizer.
  --gpu_memory_utilization GPU_MEMORY_UTILIZATION
                        The ratio (between 0 and 1) of GPU memory toreserve for the model weights, activations, and KV cache. Highervalues will increase the KV cache size and thus improve the model sthroughput.
                        However, if the value is too high, it may cause out-of-memory (OOM) errors.
  --model MODEL         name or path of the huggingface model to use
  --tokenizer TOKENIZER
                        name or path of the huggingface tokenizer to use
  --revision REVISION   the specific model version to use. It can be a branch name, a tag name, or a commit id. If unspecified, will use the default version.
  --tokenizer-revision TOKENIZER_REVISION
                        the specific tokenizer version to use. It can be a branch name, a tag name, or a commit id. If unspecified, will use the default version.
  --tokenizer-mode {auto,slow}
                        tokenizer mode. "auto" will use the fast tokenizer if available, and "slow" will always use the slow tokenizer.
  --trust-remote-code   trust remote code from huggingface
  --download-dir DOWNLOAD_DIR
                        directory to download and load the weights, default to the default cache dir of huggingface
  --load-format {auto,pt,safetensors,npcache,dummy}
                        The format of the model weights to load. "auto" will try to load the weights in the safetensors format and fall back to the pytorch bin format if safetensors format is not available. "pt"
                        will load the weights in the pytorch bin format. "safetensors" will load the weights in the safetensors format. "npcache" will load the weights in pytorch format and store a numpy cache to
                        speed up the loading. "dummy" will initialize the weights with random values, which is mainly for profiling.
  --dtype {auto,half,float16,bfloat16,float,float32}
                        data type for model weights and activations. The "auto" option will use FP16 precision for FP32 and FP16 models, and BF16 precision for BF16 models.
                        
  --worker-use-ray      use Ray for distributed serving, will be automatically set when using more than 1 GPU
  --max-parallel-loading-workers MAX_PARALLEL_LOADING_WORKERS
                        load model sequentially in multiple batches, to avoid RAM OOM when using tensor parallel and large models
  --block-size {8,16,32}
                        token block size
  --seed SEED           random seed
  --swap-space SWAP_SPACE
                        CPU swap space size (GiB) per GPU
  --disable-log-stats   disable logging statistics
  --quantization {awq,gptq,squeezellm,None}, -q {awq,gptq,squeezellm,None}
                        Method used to quantize the weights. If None, we first check the `quantization_config` attribute in the model config file. If that is None, we assume the model weights are not quantized and
                        use `dtype` to determine the data type of the weights.
  --enforce-eager       Always use eager-mode PyTorch. If False, will use eager mode and CUDA graph in hybrid for maximal performance and flexibility.
  --max-context-len-to-capture MAX_CONTEXT_LEN_TO_CAPTURE
                        maximum context length covered by CUDA graphs. When a sequence has context length larger than this, we fall back to eager mode.
  --engine-use-ray      use Ray to start the LLM engine in a separate process as the server process.
  --disable-log-requests
                        disable logging requests
  --max-log-len MAX_LOG_LEN
                        max number of prompt characters or prompt ID numbers being printed in log. Default: unlimited.
```

#### Qwen/Qwen-1_8B-Chat (1 GPU)
```shell
python -m fastchat.serve.vllm_worker \
  --model-path Qwen/Qwen-1_8B-Chat \
  --model-names gpt-3.5-turbo
```
- --tensor-parallel-size 设置使用的 GPU 数量`（默认为 1）`
- --dtype bfloat16
  - ValueError: Bfloat16 is only supported on GPUs with compute capability of at least 8.0. Your Tesla T4 GPU has compute capability 7.5. `使用 float16 代替。`
  - `torch.cuda.get_device_capability()` 返回 `(7, 5)`

  [如果不支持 bfloat16，则降至 float16](https://github.com/vllm-project/vllm/pull/1901)

#### Qwen/Qwen-1_8B-Chat (2 GPU)
```shell
CUDA_VISIBLE_DEVICES=0,1 python -m fastchat.serve.vllm_worker \
  --model-path Qwen/Qwen-1_8B-Chat \
  --model-names gpt-3.5-turbo \
  --tensor-parallel-size 2
```
- [vLLM 分布式推理和服务](https://docs.vllm.ai/en/latest/serving/distributed_serving.html)

#### Qwen/Qwen-1_8B-Chat (4 GPU)
```shell
python -m fastchat.serve.vllm_worker \
  --model-path Qwen/Qwen-1_8B-Chat \
  --model-names gpt-3.5-turbo \
  --tensor-parallel-size 4
```

## curl 测试
```shell
curl -s http://127.0.0.1:8000/v1/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "Qwen-1_8B-Chat",
    "prompt": "你好",
    "temperature": 0.7,
    "max_tokens": 4096
  }'|jq
```
```json
{
  "id": "cmpl-3uCLgVzNUB5sSn9VAdYjbh",
  "object": "text_completion",
  "created": 1705475135,
  "model": "Qwen-1_8B-Chat",
  "choices": [
    {
      "index": 0,
      "text": "我是谁？为什么我会出现在这个故事里？我在谁的生活中扮演着谁的角色？",
      "logprobs": null,
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 3,
    "total_tokens": 23,
    "completion_tokens": 20
  }
}
```


## 速度测试
### 总结

| 推理 | 显存 | 每秒生成 Tokens | 每秒生成字符 |
| --- | --- | --- | --- |
| FastChat | 4G | 36.95 | 75.37 |
| FastChat + vLLM | 13.34G | 62.63 | 119.20 |

### 测试数据
#### FastChat (4G 显存)

```shell
python llm-speed-test.py --prompt "写一篇1000字关于鲁软数字在电力信息化方面取得成绩的文章。"
```
```
🧑 写一篇1000字关于鲁软数字在电力信息化方面取得成绩的文章。
🤖  鲁软数字是中国领先的数字技术解决方案提供商，拥有丰富的电力信息化解决方案经验。在电力信息化领域，鲁软数字凭借其领先的技术、优秀的团队和创新的解决方案，取得了显著的成绩。以下，我将详细介绍鲁软数字在电力信息化方面取得的成绩。

首先，鲁软数字在电力信息化解决方案设计方面有着丰富的经验和深厚的技术实力。在电力信息化领域，鲁软数字的解决方案设计团队拥有丰富的电力信息化设计经验，能够根据客户的需求，提供个性化的电力信息化解决方案。这些解决方案不仅能够满足客户在电力信息化方面的具体需求，而且能够帮助企业提高电力信息化的效率和效果。

其次，鲁软数字在电力信息化解决方案实施方面也表现出色。在电力信息化解决方案实施过程中，鲁软数字的团队能够根据客户的需求，提供专业的技术支持和管理服务。这些服务能够帮助企业解决在电力信息化实施过程中遇到的各种问题，确保电力信息化解决方案能够顺利实施。

最后，鲁软数字在电力信息化解决方案评估方面也有着丰富的经验和深厚的技术实力。在电力信息化解决方案评估过程中，鲁软数字的团队能够根据客户的需求，提供专业的数据评估服务。这些服务能够帮助企业评估电力信息化解决方案的效果，以便企业根据评估结果，对电力信息化解决方案进行优化和改进。

总的来说，鲁软数字在电力信息化领域取得的成绩是显著的。鲁软数字凭借其丰富的电力信息化解决方案经验、专业的技术支持和管理服务、以及丰富的电力信息化解决方案评估服务，为电力信息化领域的发展做出了重要贡献。未来，鲁软数字将继续在电力信息化领域取得更大的成绩，为企业提供更优质的服务。
🚀 每秒生成 Tokens: 36.95 	 合计 Tokens （347） = 输入 Tokens（19） + 输出 Tokens（328）
🚀 每秒生成字符   : 75.37 	 合计生成字符（669）
⏱️ 生成耗时: 8.88 秒
```

```shell
python llm-speed-test.py --prompt "写一篇1000字关于鲁软数字在电力信息化方面取得成绩的文章。\n"
```
```
🧑 写一篇1000字关于鲁软数字在电力信息化方面取得成绩的文章。\n
🤖 \n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\"\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\"\"\n各的：\n以下文朝\"不可以\n时，\\",求慢慢的慢慢的播放测
🚀 每秒生成 Tokens: 38.95 	 合计 Tokens （595） = 输入 Tokens（20） + 输出 Tokens（575）
🚀 每秒生成字符   : 77.49 	 合计生成字符（1144）
⏱️ 生成耗时: 14.76 秒
```

```shell
python llm-speed-test.py --prompt "写一篇1000字关于鲁软数字在电力信息化方面取得成绩的文章。\n"
```
```
🧑 写一篇1000字关于鲁软数字在电力信息化方面取得成绩的文章。\n
🤖 \n\
🚀 每秒生成 Tokens: 4.50 	 合计 Tokens （22） = 输入 Tokens（20） + 输出 Tokens（2）
🚀 每秒生成字符   : 6.74 	 合计生成字符（3）
⏱️ 生成耗时: 0.44 秒
```

```shell
python llm-speed-test.py --prompt "写一篇1000字关于鲁软数字在电力信息化方面取得成绩的文章。"
```
```
🧑 写一篇1000字关于鲁软数字在电力信息化方面取得成绩的文章。
🤖  鲁软数字作为一家以软件开发为主的公司，在电力信息化领域有着深厚的技术积累和丰富的实践经验。近年来，鲁软数字在电力信息化方面取得了显著的成绩，这主要得益于我们对电力信息化的深刻理解和对新技术的积极应用。本文将详细阐述鲁软数字在电力信息化方面取得的成绩，并探讨我们取得这些成绩的原因。

首先，鲁软数字在电力信息化领域的成绩主要体现在以下几个方面：一是我们开发的电力信息化管理系统软件，可以实现电力设备的远程监控和管理，提高了电力设备的使用效率和安全可靠性。二是我们开发的电力信息化信息化平台，可以实现电力设备的智能调度和优化，降低了电力设备的运行成本。三是我们开发的电力信息化信息化服务，可以实现电力设备的故障诊断和处理，提高了电力设备的运行稳定性。

其次，鲁软数字取得这些成绩的原因主要有以下几个方面：一是我们公司拥有丰富的电力信息化技术积累和丰富的实践经验。我们拥有一支专业的技术团队，他们对电力信息化有深入的理解和丰富的实践经验。我们还有一支高效的服务团队，他们对电力信息化有着深入的理解和丰富的实践经验。二是我们公司坚持以用户为中心，以创新为动力，以质量为生命。我们始终把满足用户需求和提升用户体验作为我们的工作目标，我们始终把创新作为推动我们工作的动力，我们始终把质量作为我们工作的生命。

最后，鲁软数字在电力信息化方面取得的成绩也对电力信息化行业产生了积极的影响。我们开发的电力信息化管理系统软件和电力信息化信息化平台，为电力信息化行业的发展提供了强大的技术支持。我们开发的电力信息化信息化服务，为电力信息化行业的服务提供了强大的支持。我们的发展也推动了电力信息化行业的进步。

总的来说，鲁软数字在电力信息化方面取得了显著的成绩，这主要得益于我们对电力信息化的深刻理解和对新技术的积极应用。我们的发展也推动了电力信息化行业的进步。我们将继续努力，为电力信息化行业的发展做出更大的贡献。
🚀 每秒生成 Tokens: 36.95 	 合计 Tokens （424） = 输入 Tokens（19） + 输出 Tokens（405）
🚀 每秒生成字符   : 73.08 	 合计生成字符（801）
⏱️ 生成耗时: 10.96 秒
```

```shell
python llm-speed-test.py --prompt "写一篇1000字关于鲁软数字在电力信息化方面取得成绩的文章。"
```
```
🧑 写一篇1000字关于鲁软数字在电力信息化方面取得成绩的文章。
🤖  鲁软数字是中国领先的数字技术服务商，致力于为电力行业提供数字化解决方案。近年来，鲁软数字在电力信息化方面取得了显著的成绩，为电力行业的发展做出了重要贡献。

一、鲁软数字的电力信息化解决方案

鲁软数字的电力信息化解决方案以云计算为基础，以大数据和人工智能为技术手段，以智能化和自动化为服务模式。其解决方案主要分为三部分：云计算平台、大数据分析和人工智能应用。

1. 云计算平台：鲁软数字的云计算平台提供了一系列的安全、稳定、可扩展的云计算服务，包括虚拟机、负载均衡、安全组、数据库等，可以满足电力行业在大数据处理、云计算服务、信息安全等方面的需求。

2. 大数据分析：鲁软数字的大数据分析能力主要体现在数据清洗、数据挖掘、数据可视化等方面，可以为企业提供全面、深入的行业洞察，帮助企业优化决策。

3. 人工智能应用：鲁软数字的人工智能应用主要体现在智能客服、智能运维、智能分析等方面，可以为企业提供智能化、自动化、个性化的服务，提高企业的运营效率和服务质量。

二、鲁软数字在电力信息化方面的成就

鲁软数字在电力信息化方面的成就主要体现在以下几个方面：

1. 提升了电力行业的数字化水平：鲁软数字的电力信息化解决方案可以提升电力行业的数字化水平，推动电力行业的数字化转型。

2. 提高了电力行业的运营效率和服务质量：鲁软数字的人工智能应用可以提高电力行业的运营效率和服务质量，提高电力行业的服务水平。

3. 促进了电力行业的技术创新：鲁软数字的技术创新为电力行业的技术创新提供了强大的支持，推动了电力行业的技术进步。

三、鲁软数字在电力信息化方面的未来展望

鲁软数字在电力信息化方面的未来展望主要体现在以下几个方面：

1. 云计算和大数据的深度融合：鲁软数字将继续深化云计算和大数据的深度融合，提供更加全面、深入的云计算服务和大数据分析服务。

2. 人工智能的应用更加广泛：鲁软数字将继续推动人工智能的应用更加广泛，提供更加智能化、自动化、个性化的服务。

3. 电力行业的数字化转型更加深入：鲁软数字将继续深化电力行业的数字化转型，推动电力行业的数字化转型。

总的来说，鲁软数字在电力信息化方面的成绩是显著的，也为电力行业的发展做出了重要贡献。未来，鲁软数字将继续深化电力行业的数字化转型，推动电力行业的数字化转型，为电力行业的健康发展提供强大的支持。
🚀 每秒生成 Tokens: 36.14 	 合计 Tokens （524） = 输入 Tokens（19） + 输出 Tokens（505）
🚀 每秒生成字符   : 70.93 	 合计生成字符（991）
⏱️ 生成耗时: 13.97 秒
```

```shell
python llm-speed-test.py --prompt "写一篇1000字关于鲁软数字在电力信息化方面取得成绩的文章。\n"
```
```
🧑 写一篇1000字关于鲁软数字在电力信息化方面取得成绩的文章。\n
🤖 \n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\"\n主应用模
🚀 每秒生成 Tokens: 32.33 	 合计 Tokens （561） = 输入 Tokens（20） + 输出 Tokens（541）
🚀 每秒生成字符   : 64.55 	 合计生成字符（1080）
⏱️ 生成耗时: 16.73 秒
```

#### FastChat + vLLM (13.34G 显存)

```shell
python llm-speed-test.py --prompt "写一篇1000字关于鲁软数字在电力信息化方面取得成绩的文章。"
```
```
🧑 写一篇1000字关于鲁软数字在电力信息化方面取得成绩的文章。
🤖  鲁软数字是鲁软集团旗下的专业软件公司，专注于电力信息化领域。鲁软数字在电力信息化方面取得了许多成绩，为我国电力行业的信息化建设做出了重要的贡献。

首先，鲁软数字在电力设备的智能化方面取得了显著的成绩。鲁软数字开发的电力设备智能化管理系统，可以实现设备的远程监控、故障预警、智能优化等功能，大大提高了电力设备的运行效率和安全性。例如，鲁软数字的智能电网管理系统，可以实时监控电力设备的运行状态，及时发现并处理设备故障，保障电力系统的稳定运行。

其次，鲁软数字在电力安全方面也取得了显著的成绩。鲁软数字的电力安全管理系统，可以实现电力系统的全面安全监控，包括设备的安全运行状态、人员的安全操作行为、电力系统的安全风险评估等。鲁软数字的电力安全管理系统，可以有效地预防电力安全事故的发生，保护电力系统的稳定运行。

再次，鲁软数字在电力信息化的标准化建设方面也取得了显著的成绩。鲁软数字积极参与电力信息化的标准化建设，开发了一系列电力信息化的标准规范和工具，为电力行业的信息化建设提供了标准化的解决方案。例如，鲁软数字的电力信息化标准规范，可以为电力行业的信息化建设提供标准化的参考和指导。

最后，鲁软数字在电力信息化的推广方面也取得了显著的成绩。鲁软数字积极推广电力信息化，通过各种方式，如培训、研讨会、宣传册等，普及电力信息化的知识，提高电力人员的电力信息化意识。例如，鲁软数字的电力信息化培训，可以提高电力人员的电力信息化技能，为电力信息化的推广提供人才保障。

总的来说，鲁软数字在电力信息化方面取得了许多成绩，为我国电力行业的信息化建设做出了重要的贡献。鲁软数字的成功，离不开鲁软集团的大力支持，也离不开电力行业的广大用户的支持。鲁软数字将继续努力，为电力行业的信息化建设贡献更大的力量。
🚀 每秒生成 Tokens: 59.49 	 合计 Tokens （416） = 输入 Tokens（19） + 输出 Tokens（397）
🚀 每秒生成字符   : 112.39 	 合计生成字符（750）
⏱️ 生成耗时: 6.67 秒
```

```shell
python llm-speed-test.py --prompt "写一篇1000字关于鲁软数字在电力信息化方面取得成绩的文章。"
```
```
🧑 写一篇1000字关于鲁软数字在电力信息化方面取得成绩的文章。
🤖  题目：鲁软数字在电力信息化方面的成绩

随着科技的进步，电力信息化已经成为电力行业的重要组成部分，而鲁软数字作为一家专注于电力信息化领域的软件开发公司，其在电力信息化方面的成绩也是不容忽视的。

鲁软数字在电力信息化方面的成绩可以从以下几个方面进行阐述：

首先，鲁软数字在电力信息化解决方案的研发上取得了显著的成果。鲁软数字的电力信息化解决方案不仅涵盖了电力设备的远程监控、电力设备的智能运维、电力用户的互动体验等多个方面，而且在性能、稳定性和安全性等方面都达到了业界的领先水平。鲁软数字的电力信息化解决方案不仅满足了电力行业的实际需求，也为电力行业的信息化进程提供了有力的支撑。

其次，鲁软数字在电力信息化平台的开发和应用上也取得了显著的成果。鲁软数字的电力信息化平台不仅拥有丰富的功能和强大的性能，而且在用户体验、数据安全和运维管理等方面都达到了业界的领先水平。鲁软数字的电力信息化平台不仅能够满足电力行业的实际需求，也为电力行业的信息化进程提供了有力的支撑。

最后，鲁软数字在电力信息化人才的培养和引进上也取得了显著的成果。鲁软数字不仅拥有了一批专业的电力信息化人才，而且在人才培养和引进上也投入了大量的资源。鲁软数字的电力信息化人才不仅拥有丰富的电力信息化经验和专业知识，而且在技能提升和创新能力等方面也得到了显著的提升。

总的来说，鲁软数字在电力信息化方面的成绩是显著的，其在电力信息化解决方案的研发、电力信息化平台的开发和应用以及电力信息化人才的培养和引进等方面都取得了显著的成果。这些成绩的取得，不仅证明了鲁软数字在电力信息化领域的实力，也证明了鲁软数字在电力信息化领域的发展前景。在未来，鲁软数字将继续在电力信息化领域努力，为电力行业的信息化进程提供更加有力的支持。
🚀 每秒生成 Tokens: 62.63 	 合计 Tokens （411） = 输入 Tokens（19） + 输出 Tokens（392）
🚀 每秒生成字符   : 119.20 	 合计生成字符（746）
⏱️ 生成耗时: 6.26 秒
```

```shell
python llm-speed-test.py --prompt "写一篇1000字关于鲁软数字在电力信息化方面取得成绩的文章。"
```
```
🧑 写一篇1000字关于鲁软数字在电力信息化方面取得成绩的文章。
🤖 标题可以是《鲁软数字助力电力信息化的发展》。

\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n鲁软数字凭借其在电力信息化领域中的技术优势和创新思维，成功地推动了电力信息化的发展。作为中国领先的软件开发公司，鲁软数字在电力信息化领域取得了显著的成绩，为我国电力信息化的发展做出了重要贡献。\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n鲁软数字在电力信息化领域的主要成绩体现在以下几个方面。\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n鲁软数字在电力信息化领域的主要成就体现在以下几个方面。\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n鲁软数字在电力信息化领域的主要成就体现在以下几个方面。\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n鲁软数字在电力信息化领域的主要成就体现在以下几个方面。\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n鲁软数字在电力信息化领域的主要成就体现在以下几个方面。\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n鲁软数字在电力信息化领域的主要成就体现在以下几个方面。\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n鲁软数字在电力信息化领域的主要成就体现在以下几个方面。\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n鲁软数字在电力信息化领域的主要成就体现在以下几个方面。\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n鲁软数字在电力信息化领域的主要成就体现在以下几个方面。\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n鲁软数字在电力信息化领域的主要成就体现在以下几个方面。\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n鲁软数字在电力信息化领域的主要成就体现在以下几个方面。\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n鲁软数字在电力信息化领域的主要成就体现在以下几个方面。\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n
🚀 每秒生成 Tokens: 62.01 	 合计 Tokens （1019） = 输入 Tokens（19） + 输出 Tokens（1000）
🚀 每秒生成字符   : 124.27 	 合计生成字符（2004）
⏱️ 生成耗时: 16.13 秒
```

```shell
python llm-speed-test.py --prompt "写一篇1000字关于鲁软数字在电力信息化方面取得成绩的文章。"
```
```
🧑 写一篇1000字关于鲁软数字在电力信息化方面取得成绩的文章。
🤖  鲁软数字作为中国领先的软件和服务提供商，一直在电力信息化领域取得显著的成绩。本文将详细介绍鲁软数字在电力信息化方面的成就，并对其未来的发展方向进行展望。

鲁软数字成立于1993年，总部位于中国上海，是全球领先的数字技术解决方案提供商之一。自成立以来，鲁软数字就以提供高效、稳定、安全的数字技术解决方案为己任，致力于为电力行业提供全方位的数字技术解决方案。

在电力信息化方面，鲁软数字取得了许多显著的成绩。首先，鲁软数字成功开发了电力行业特有的数据采集和处理系统。这种系统能够实时、准确地采集电力设备的各种数据，并将这些数据转化为可操作的报告，为电力企业的决策提供了重要支持。其次，鲁软数字还开发了电力行业特有的云计算平台。这种平台能够为电力企业提供稳定、安全的云计算服务，使得电力企业可以随时随地进行数据处理和分析。

鲁软数字在电力信息化方面的成就，得到了业界的高度认可。根据中国电力行业协会的数据，鲁软数字在电力信息化领域的市场份额已经超过了20%，并且还在逐年增长。此外，鲁软数字还获得了许多政府和行业的奖项，包括“中国软件企业最佳创新奖”、“中国电力行业最佳解决方案奖”等。

对于未来的发展方向，鲁软数字将继续坚持创新，为电力行业提供更好的数字技术解决方案。首先，鲁软数字将继续研发新的数据采集和处理系统，以满足电力企业日益增长的数据需求。其次，鲁软数字将继续研发新的云计算平台，以满足电力企业日益增长的云计算需求。最后，鲁软数字将继续深化与电力企业的合作，以提供更全面、更专业的数字技术解决方案。

总的来说，鲁软数字在电力信息化领域取得了显著的成绩，并且在未来的发展方向上也充满了信心和期待。我们期待鲁软数字在未来能够继续为电力行业提供更好的数字技术解决方案，为电力行业的数字化转型做出更大的贡献。
🚀 每秒生成 Tokens: 62.35 	 合计 Tokens （422） = 输入 Tokens（19） + 输出 Tokens（403）
🚀 每秒生成字符   : 117.44 	 合计生成字符（759）
⏱️ 生成耗时: 6.46 秒
```

```shell
python llm-speed-test.py --prompt "写一篇1000字关于鲁软数字在电力信息化方面取得成绩的文章。"
```
```
🧑 写一篇1000字关于鲁软数字在电力信息化方面取得成绩的文章。
🤖  鲁软数字是中国领先的数字技术和服务提供商，致力于为电力企业提供数字化转型服务。鲁软数字在电力信息化方面取得了显著的成绩，不仅提升了电力企业的运营效率，也为行业的发展做出了重要贡献。本文将详细介绍鲁软数字在电力信息化方面的成绩，并对其未来的发展趋势进行展望。

一、鲁软数字在电力信息化方面的成绩

1. 提升运营效率：鲁软数字通过提供电力信息化解决方案，帮助电力企业提升运营效率。例如，鲁软数字的电力信息系统能够实现电力设备的远程监控和管理，大大提高了电力企业的运营效率。同时，鲁软数字的电力信息系统还能提供实时的电力数据统计和分析，帮助企业更好地了解电力市场动态，做出更科学的决策。

2. 优化资源配置：鲁软数字通过提供电力信息化解决方案，帮助电力企业优化资源配置。例如，鲁软数字的电力信息系统能够实现电力资源的智能调度和管理，使得电力资源得到最优的利用。同时，鲁软数字的电力信息系统还能提供实时的电力数据统计和分析，帮助企业更好地了解电力市场动态，做出更科学的决策。

3. 提升服务质量：鲁软数字通过提供电力信息化解决方案，帮助电力企业提升服务质量。例如，鲁软数字的电力信息系统能够实现电力服务的自动化和智能化，使得电力服务更加便捷和高效。同时，鲁软数字的电力信息系统还能提供实时的电力数据统计和分析，帮助企业更好地了解电力市场动态，做出更科学的决策。

二、鲁软数字在电力信息化方面的未来发展趋势

1. 智能化：随着人工智能技术的发展，鲁软数字将在电力信息化方面进一步智能化。例如，鲁软数字的电力信息系统将能够实现电力服务的智能化，使得电力服务更加便捷和高效。同时，鲁软数字的电力信息系统还将能够实现电力设备的智能化，使得电力设备更加智能和高效。

2. 绿色化：随着环保意识的提高，鲁软数字将在电力信息化方面进一步绿色环保。例如，鲁软数字的电力信息系统将能够实现电力资源的绿色化，使得电力资源更加环保和高效。同时，鲁软数字的电力信息系统还将能够实现电力服务的绿色化，使得电力服务更加环保和高效。

3. 开放化：随着全球化的推进，鲁软数字将在电力信息化方面进一步开放化。例如，鲁软数字的电力信息系统将能够实现全球范围内的电力数据交换和共享，使得电力信息更加开放和共享。同时，鲁软数字的电力信息系统还将能够实现全球范围内的电力设备连接和智能化，使得全球范围内的电力设备更加智能和高效。

总的来说，鲁软数字在电力信息化方面取得了显著的成绩，为电力企业提供数字化转型服务。未来，鲁软数字将在电力信息化方面进一步智能化、绿色环保和开放化，为企业提供更加优质的服务。
🚀 每秒生成 Tokens: 62.18 	 合计 Tokens （609） = 输入 Tokens（19） + 输出 Tokens（590）
🚀 每秒生成字符   : 114.56 	 合计生成字符（1087）
⏱️ 生成耗时: 9.49 秒
```


## 准备
### 编辑测试脚本 post_json.lua
```lua
wrk.method = "POST"
wrk.body   = "{    \"model\": \"gpt-3.5-turbo\",    \"prompt\": \"写一篇1000字关于鲁软数字在电力信息化方面取得成绩的文章。\",    \"temperature\": 0.7,    \"max_tokens\": 256  }"
wrk.headers["Content-Type"] = "application/json"
```

### 监控 8000 端口
```bash
sudo tcpdump -i any -A 'tcp port 8000 and (((ip[2:2] - ((ip[0]&0xf)<<2)) - ((tcp[12]&0xf0)>>2)) != 0)' -w -
```

## 基准测试

- `基准测试工具`：wrk
- `持续时间`：1 分钟
- `超时时间`：10 秒

### 总结

#### FastChat + vLLM (2卡)

|       | 并发数 | 并发线程数 | 完成请求数 | 超时请求数 | 每秒请求数 | 每秒传输字节数 | 平均响应时间 |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
|       | 1 | 1 | 12 | 0 | 0.20 | 422.77B | 4.96s |
|       | 2 | 2 | 21 | 0 | 0.35 | 0.86KB | 5.24s |
|       | 3 | 3 | 30 | 0 | 0.50 | 1.27KB | 5.72s |
|       | 4 | 4 | 38 | 0 | 0.63 | 1.67KB | 6.10s |
|       | 5 | 5 | 47 | 0 | 0.78 | 1.94KB | 6.02s |
| 👍    | 6 | 6 | 56 | 0 | 0.93 | 2.27KB | 6.08s |
|       | 7 | 7 | 50 | 9 | 0.83 | 2.01KB | 7.29s |
|       | 8 | 8 | 54 | 14 | 0.90 | 2.21KB | 7.48s |

#### FastChat + vLLM (4卡)

|       | 并发数 | 并发线程数 | 完成请求数 | 超时请求数 | 每秒请求数 | 每秒传输字节数 | 平均响应时间 |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| 👍    | 4 | 4 | 28 | 0 | 0.47 | 1.29KB | 7.73s |
|       | 5 | 5 | 38 | 4 | 0.63 | 1.52KB | 7.05s |
|       | 6 | 6 | 45 | 7 | 0.75 | 1.79KB | 6.92s |


### 测试数据

#### FastChat + vLLM (2卡)

```shell
wrk -c1 -t1 -d1m --timeout 10s --latency -s post_json.lua http://127.0.0.1:8000/v1/completions
```
```
Running 1m test @ http://127.0.0.1:8000/v1/completions
  1 threads and 1 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     4.96s     2.87s    7.40s    75.00%
    Req/Sec     1.75      3.86    10.00     83.33%
  Latency Distribution
     50%    6.41s 
     75%    7.30s 
     90%    7.37s 
     99%    7.40s 
  12 requests in 1.00m, 24.81KB read
Requests/sec:      0.20
Transfer/sec:     422.77B
```

```shell
wrk -c2 -t2 -d1m --timeout 10s --latency -s post_json.lua http://127.0.0.1:8000/v1/completions
```
```
Running 1m test @ http://127.0.0.1:8000/v1/completions
  2 threads and 2 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     5.24s     1.98s    7.24s    80.95%
    Req/Sec     0.50      2.24    10.00     95.00%
  Latency Distribution
     50%    5.64s 
     75%    6.38s 
     90%    7.19s 
     99%    7.24s 
  21 requests in 1.00m, 51.51KB read
Requests/sec:      0.35
Transfer/sec:      0.86KB
```

```shell
wrk -c3 -t3 -d1m --timeout 10s --latency -s post_json.lua http://127.0.0.1:8000/v1/completions
```
```
Running 1m test @ http://127.0.0.1:8000/v1/completions
  3 threads and 3 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     5.72s     1.76s    7.62s    80.00%
    Req/Sec     0.17      0.93     5.00     96.55%
  Latency Distribution
     50%    6.06s 
     75%    6.78s 
     90%    7.52s 
     99%    7.62s 
  30 requests in 1.00m, 76.33KB read
Requests/sec:      0.50
Transfer/sec:      1.27KB
```

```shell
wrk -c4 -t4 -d1m --timeout 10s --latency -s post_json.lua http://127.0.0.1:8000/v1/completions
```
```
Running 1m test @ http://127.0.0.1:8000/v1/completions
  4 threads and 4 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     6.10s     1.26s    7.73s    84.21%
    Req/Sec     0.13      0.81     5.00     97.37%
  Latency Distribution
     50%    6.37s 
     75%    6.67s 
     90%    7.49s 
     99%    7.73s 
  38 requests in 1.00m, 100.04KB read
Requests/sec:      0.63
Transfer/sec:      1.67KB
```

```shell
wrk -c5 -t5 -d1m --timeout 10s --latency -s post_json.lua http://127.0.0.1:8000/v1/completions
```
```
Running 1m test @ http://127.0.0.1:8000/v1/completions
  5 threads and 5 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     6.02s     2.22s    8.31s    87.23%
    Req/Sec     0.77      2.51    10.00     93.62%
  Latency Distribution
     50%    6.59s 
     75%    7.41s 
     90%    8.03s 
     99%    8.31s 
  47 requests in 1.00m, 116.66KB read
Requests/sec:      0.78
Transfer/sec:      1.94KB
```

```shell
wrk -c6 -t6 -d1m --timeout 10s --latency -s post_json.lua http://127.0.0.1:8000/v1/completions
```
```
Running 1m test @ http://127.0.0.1:8000/v1/completions
  6 threads and 6 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     6.08s     2.18s    8.63s    76.79%
    Req/Sec     0.45      1.92    10.00     94.64%
  Latency Distribution
     50%    6.57s 
     75%    7.18s 
     90%    8.31s 
     99%    8.63s 
  56 requests in 1.00m, 136.36KB read
Requests/sec:      0.93
Transfer/sec:      2.27KB
```

```shell
wrk -c7 -t7 -d1m --timeout 10s --latency -s post_json.lua http://127.0.0.1:8000/v1/completions
```
```
Running 1m test @ http://127.0.0.1:8000/v1/completions
  7 threads and 7 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     7.29s     2.96s    9.97s    85.37%
    Req/Sec     0.38      1.61    10.00     94.00%
  Latency Distribution
     50%    8.44s 
     75%    9.06s 
     90%    9.72s 
     99%    9.97s 
  50 requests in 1.00m, 120.47KB read
  Socket errors: connect 0, read 0, write 0, timeout 9
Requests/sec:      0.83
Transfer/sec:      2.01KB
```

```shell
wrk -c8 -t8 -d1m --timeout 10s --latency -s post_json.lua http://127.0.0.1:8000/v1/completions
```
```
Running 1m test @ http://127.0.0.1:8000/v1/completions
  8 threads and 8 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     7.48s     2.82s    9.84s    87.50%
    Req/Sec     0.57      2.33    10.00     94.34%
  Latency Distribution
     50%    8.33s 
     75%    9.32s 
     90%    9.52s 
     99%    9.84s 
  54 requests in 1.00m, 133.06KB read
  Socket errors: connect 0, read 0, write 0, timeout 14
Requests/sec:      0.90
Transfer/sec:      2.21KB
```

#### FastChat + vLLM (4卡)

```shell
wrk -c4 -t4 -d1m --timeout 10s --latency -s post_json.lua http://127.0.0.1:8000/v1/completions
```
```
Running 1m test @ http://127.0.0.1:8000/v1/completions
  4 threads and 4 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     7.73s     1.83s    9.72s    89.29%
    Req/Sec     0.36      1.89    10.00     96.43%
  Latency Distribution
     50%    7.96s 
     75%    8.97s 
     90%    9.44s 
     99%    9.72s 
  28 requests in 1.00m, 77.65KB read
Requests/sec:      0.47
Transfer/sec:      1.29KB
```

```shell
wrk -c5 -t5 -d1m --timeout 10s --latency -s post_json.lua http://127.0.0.1:8000/v1/completions
```
```
Running 1m test @ http://127.0.0.1:8000/v1/completions
  5 threads and 5 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     7.05s     2.71s    9.97s    85.29%
    Req/Sec     0.66      2.37    10.00     92.11%
  Latency Distribution
     50%    7.80s 
     75%    8.90s 
     90%    9.06s 
     99%    9.97s 
  38 requests in 1.00m, 91.16KB read
  Socket errors: connect 0, read 0, write 0, timeout 4
Requests/sec:      0.63
Transfer/sec:      1.52KB
```

```shell
wrk -c6 -t6 -d1m --timeout 10s --latency -s post_json.lua http://127.0.0.1:8000/v1/completions
```
```
Running 1m test @ http://127.0.0.1:8000/v1/completions
  6 threads and 6 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     6.92s     3.07s    9.71s    84.21%
    Req/Sec     1.02      2.93    10.00     88.89%
  Latency Distribution
     50%    7.87s 
     75%    8.77s 
     90%    9.49s 
     99%    9.71s 
  45 requests in 1.00m, 107.60KB read
  Socket errors: connect 0, read 0, write 0, timeout 7
Requests/sec:      0.75
Transfer/sec:      1.79KB
```
