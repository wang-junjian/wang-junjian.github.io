---
layout: post
title:  "LLM 的基准测试"
date:   2024-01-17 08:00:00 +0800
categories: LLM Benchmark
tags: [LLM, Benchmark, wrk, Qwen]
---

## 安装 FastChat & vLLM
### 安装 [FastChat](https://github.com/lm-sys/FastChat)
- [FastChat 部署多模型]({% post_url 2023-10-24-fastchat-deploys-multi-model %})
- [Qwen (通义千问)]({% post_url 2023-12-25-Qwen %})
- [在 MacBook Pro M2 Max 上安装 FastChat]({% post_url 2024-01-11-Install-FastChat-on-MacBook-Pro-M2-Max %})

### 安装 [FlashAttention](https://github.com/Dao-AILab/flash-attention)
FlashAttention-2 currently supports:

- Ampere, Ada, or Hopper GPUs (e.g., A100, RTX 3090, RTX 4090, H100). Support for Turing GPUs (T4, RTX 2080) is coming soon, please use FlashAttention 1.x for Turing GPUs for now.
- Datatype fp16 and bf16 (bf16 requires Ampere, Ada, or Hopper GPUs).
- All head dimensions up to 256. Head dim > 192 backward requires A100/A800 or H100/H800.

`Turing GPU T4` 不支持，需要使用 FlashAttention 1.x，否则会报错 ❌：

```json
data: {
  "text": "**NETWORK ERROR DUE TO HIGH TRAFFIC. PLEASE REGENERATE OR REFRESH THIS PAGE.**\n\n(FlashAttention only supports Ampere GPUs or newer.)", 
  "error_code": 50001
}
```

### 安装 [vLLM](https://github.com/vllm-project/vllm)
```shell
pip install vllm -i https://mirrors.aliyun.com/pypi/simple/
```


## 部署 LLM
### 运行 Controller
```shell
python -m fastchat.serve.controller
```

### 运行 OpenAI API Server
```shell
python -m fastchat.serve.openai_api_server
```

### 运行 Model Worker
#### Qwen-1_8B-Chat
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

#### Qwen-1_8B-Chat (GPU: 1, 显存: 12.77G)
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

```
+---------------------------------------------------------------------------------------+
| NVIDIA-SMI 535.54.03              Driver Version: 535.54.03    CUDA Version: 12.2     |
|-----------------------------------------+----------------------+----------------------+
| GPU  Name                 Persistence-M | Bus-Id        Disp.A | Volatile Uncorr. ECC |
| Fan  Temp   Perf          Pwr:Usage/Cap |         Memory-Usage | GPU-Util  Compute M. |
|                                         |                      |               MIG M. |
|=========================================+======================+======================|
|   0  Tesla T4                       Off | 00000000:43:00.0 Off |                    0 |
| N/A   54C    P0              28W /  70W |  12770MiB / 15360MiB |      0%      Default |
|                                         |                      |                  N/A |
+-----------------------------------------+----------------------+----------------------+
                                                                                         
+---------------------------------------------------------------------------------------+
| Processes:                                                                            |
|  GPU   GI   CI        PID   Type   Process name                            GPU Memory |
|        ID   ID                                                             Usage      |
|=======================================================================================|
|    0   N/A  N/A   2228450      C   python                                    12754MiB |
+---------------------------------------------------------------------------------------+
```

#### Qwen-1_8B-Chat (GPU: 2, 显存: 13.34G)
```shell
CUDA_VISIBLE_DEVICES=0,1 python -m fastchat.serve.vllm_worker \
  --model-path Qwen/Qwen-1_8B-Chat \
  --model-names gpt-3.5-turbo \
  --tensor-parallel-size 2
```
- [vLLM 分布式推理和服务](https://docs.vllm.ai/en/latest/serving/distributed_serving.html)

```
+---------------------------------------------------------------------------------------+
| NVIDIA-SMI 535.54.03              Driver Version: 535.54.03    CUDA Version: 12.2     |
|-----------------------------------------+----------------------+----------------------+
| GPU  Name                 Persistence-M | Bus-Id        Disp.A | Volatile Uncorr. ECC |
| Fan  Temp   Perf          Pwr:Usage/Cap |         Memory-Usage | GPU-Util  Compute M. |
|                                         |                      |               MIG M. |
|=========================================+======================+======================|
|   0  Tesla T4                       Off | 00000000:43:00.0 Off |                    0 |
| N/A   53C    P0              28W /  70W |  13336MiB / 15360MiB |      0%      Default |
|                                         |                      |                  N/A |
+-----------------------------------------+----------------------+----------------------+
|   1  Tesla T4                       Off | 00000000:47:00.0 Off |                    0 |
| N/A   54C    P0              28W /  70W |  13318MiB / 15360MiB |      0%      Default |
|                                         |                      |                  N/A |
+-----------------------------------------+----------------------+----------------------+
                                                                                         
+---------------------------------------------------------------------------------------+
| Processes:                                                                            |
|  GPU   GI   CI        PID   Type   Process name                            GPU Memory |
|        ID   ID                                                             Usage      |
|=======================================================================================|
|    0   N/A  N/A   2219600      C   python                                    13320MiB |
|    1   N/A  N/A   2223550      C   ray::RayWorkerVllm                        13302MiB |
+---------------------------------------------------------------------------------------+
```

#### Qwen-1_8B-Chat (GPU: 4, 显存: 13.34G)
```shell
python -m fastchat.serve.vllm_worker \
  --model-path Qwen/Qwen-1_8B-Chat \
  --model-names gpt-3.5-turbo \
  --tensor-parallel-size 4
```

```
+---------------------------------------------------------------------------------------+
| NVIDIA-SMI 535.54.03              Driver Version: 535.54.03    CUDA Version: 12.2     |
|-----------------------------------------+----------------------+----------------------+
| GPU  Name                 Persistence-M | Bus-Id        Disp.A | Volatile Uncorr. ECC |
| Fan  Temp   Perf          Pwr:Usage/Cap |         Memory-Usage | GPU-Util  Compute M. |
|                                         |                      |               MIG M. |
|=========================================+======================+======================|
|   0  Tesla T4                       Off | 00000000:43:00.0 Off |                    0 |
| N/A   55C    P0              28W /  70W |  13340MiB / 15360MiB |      0%      Default |
|                                         |                      |                  N/A |
+-----------------------------------------+----------------------+----------------------+
|   1  Tesla T4                       Off | 00000000:47:00.0 Off |                    0 |
| N/A   54C    P0              28W /  70W |  13322MiB / 15360MiB |      0%      Default |
|                                         |                      |                  N/A |
+-----------------------------------------+----------------------+----------------------+
|   2  Tesla T4                       Off | 00000000:8E:00.0 Off |                    0 |
| N/A   53C    P0              28W /  70W |  13318MiB / 15360MiB |      0%      Default |
|                                         |                      |                  N/A |
+-----------------------------------------+----------------------+----------------------+
|   3  Tesla T4                       Off | 00000000:92:00.0 Off |                    0 |
| N/A   53C    P0              28W /  70W |  13318MiB / 15360MiB |      0%      Default |
|                                         |                      |                  N/A |
+-----------------------------------------+----------------------+----------------------+
                                                                                         
+---------------------------------------------------------------------------------------+
| Processes:                                                                            |
|  GPU   GI   CI        PID   Type   Process name                            GPU Memory |
|        ID   ID                                                             Usage      |
|=======================================================================================|
|    0   N/A  N/A   2198423      C   python                                    13324MiB |
|    1   N/A  N/A   2202463      C   ray::RayWorkerVllm                        13306MiB |
|    2   N/A  N/A   2202607      C   ray::RayWorkerVllm                        13302MiB |
|    3   N/A  N/A   2202738      C   ray::RayWorkerVllm                        13302MiB |
+---------------------------------------------------------------------------------------+
```

#### Qwen-7B-Chat (GPU: 2, 显存: 13.44G)
```shell
CUDA_VISIBLE_DEVICES=0,1 python -m fastchat.serve.vllm_worker \
  --model-path Qwen/Qwen-7B-Chat \
  --model-names gpt-3.5-turbo \
  --tensor-parallel-size 2
```

```
+---------------------------------------------------------------------------------------+
| NVIDIA-SMI 535.54.03              Driver Version: 535.54.03    CUDA Version: 12.2     |
|-----------------------------------------+----------------------+----------------------+
| GPU  Name                 Persistence-M | Bus-Id        Disp.A | Volatile Uncorr. ECC |
| Fan  Temp   Perf          Pwr:Usage/Cap |         Memory-Usage | GPU-Util  Compute M. |
|                                         |                      |               MIG M. |
|=========================================+======================+======================|
|   0  Tesla T4                       Off | 00000000:43:00.0 Off |                    0 |
| N/A   51C    P0              28W /  70W |  13444MiB / 15360MiB |      0%      Default |
|                                         |                      |                  N/A |
+-----------------------------------------+----------------------+----------------------+
|   1  Tesla T4                       Off | 00000000:47:00.0 Off |                    0 |
| N/A   52C    P0              28W /  70W |  13426MiB / 15360MiB |      0%      Default |
|                                         |                      |                  N/A |
+-----------------------------------------+----------------------+----------------------+
                                                                                         
+---------------------------------------------------------------------------------------+
| Processes:                                                                            |
|  GPU   GI   CI        PID   Type   Process name                            GPU Memory |
|        ID   ID                                                             Usage      |
|=======================================================================================|
|    0   N/A  N/A   2270293      C   python                                    13432MiB |
|    1   N/A  N/A   2274242      C   ray::RayWorkerVllm                        13414MiB |
+---------------------------------------------------------------------------------------+
```

#### Qwen-7B-Chat (GPU: 4, 显存: 13.20G)
```shell
python -m fastchat.serve.vllm_worker \
  --model-path Qwen/Qwen-7B-Chat \
  --model-names gpt-3.5-turbo \
  --tensor-parallel-size 4
```

```
+---------------------------------------------------------------------------------------+
| NVIDIA-SMI 535.54.03              Driver Version: 535.54.03    CUDA Version: 12.2     |
|-----------------------------------------+----------------------+----------------------+
| GPU  Name                 Persistence-M | Bus-Id        Disp.A | Volatile Uncorr. ECC |
| Fan  Temp   Perf          Pwr:Usage/Cap |         Memory-Usage | GPU-Util  Compute M. |
|                                         |                      |               MIG M. |
|=========================================+======================+======================|
|   0  Tesla T4                       Off | 00000000:43:00.0 Off |                    0 |
| N/A   58C    P0              29W /  70W |  13206MiB / 15360MiB |      0%      Default |
|                                         |                      |                  N/A |
+-----------------------------------------+----------------------+----------------------+
|   1  Tesla T4                       Off | 00000000:47:00.0 Off |                    0 |
| N/A   53C    P0              28W /  70W |  13158MiB / 15360MiB |      0%      Default |
|                                         |                      |                  N/A |
+-----------------------------------------+----------------------+----------------------+
|   2  Tesla T4                       Off | 00000000:8E:00.0 Off |                    0 |
| N/A   52C    P0              28W /  70W |  13154MiB / 15360MiB |      0%      Default |
|                                         |                      |                  N/A |
+-----------------------------------------+----------------------+----------------------+
|   3  Tesla T4                       Off | 00000000:92:00.0 Off |                    0 |
| N/A   53C    P0              28W /  70W |  13154MiB / 15360MiB |      0%      Default |
|                                         |                      |                  N/A |
+-----------------------------------------+----------------------+----------------------+
                                                                                         
+---------------------------------------------------------------------------------------+
| Processes:                                                                            |
|  GPU   GI   CI        PID   Type   Process name                            GPU Memory |
|        ID   ID                                                             Usage      |
|=======================================================================================|
|    0   N/A  N/A   1870130      C   python                                    13194MiB |
|    1   N/A  N/A   1874102      C   ray::RayWorkerVllm                        13146MiB |
|    2   N/A  N/A   1874278      C   ray::RayWorkerVllm                        13142MiB |
|    3   N/A  N/A   1874402      C   ray::RayWorkerVllm                        13142MiB |
+---------------------------------------------------------------------------------------+
```

因为 vLLM 是预分配显存，所以显存占用率会比较高，但是实际使用时显存并不会增长。

下面是推理过程中 GPU 的显存使用情况：

```
+---------------------------------------------------------------------------------------+
| NVIDIA-SMI 535.54.03              Driver Version: 535.54.03    CUDA Version: 12.2     |
|-----------------------------------------+----------------------+----------------------+
| GPU  Name                 Persistence-M | Bus-Id        Disp.A | Volatile Uncorr. ECC |
| Fan  Temp   Perf          Pwr:Usage/Cap |         Memory-Usage | GPU-Util  Compute M. |
|                                         |                      |               MIG M. |
|=========================================+======================+======================|
|   0  Tesla T4                       Off | 00000000:43:00.0 Off |                    0 |
| N/A   75C    P0              72W /  70W |  13228MiB / 15360MiB |     82%      Default |
|                                         |                      |                  N/A |
+-----------------------------------------+----------------------+----------------------+
|   1  Tesla T4                       Off | 00000000:47:00.0 Off |                    0 |
| N/A   73C    P0              72W /  70W |  13162MiB / 15360MiB |     78%      Default |
|                                         |                      |                  N/A |
+-----------------------------------------+----------------------+----------------------+
|   2  Tesla T4                       Off | 00000000:8E:00.0 Off |                    0 |
| N/A   73C    P0              73W /  70W |  13158MiB / 15360MiB |     77%      Default |
|                                         |                      |                  N/A |
+-----------------------------------------+----------------------+----------------------+
|   3  Tesla T4                       Off | 00000000:92:00.0 Off |                    0 |
| N/A   74C    P0              58W /  70W |  13158MiB / 15360MiB |     71%      Default |
|                                         |                      |                  N/A |
+-----------------------------------------+----------------------+----------------------+
                                                                                         
+---------------------------------------------------------------------------------------+
| Processes:                                                                            |
|  GPU   GI   CI        PID   Type   Process name                            GPU Memory |
|        ID   ID                                                             Usage      |
|=======================================================================================|
|    0   N/A  N/A   1870130      C   python                                    13216MiB |
|    1   N/A  N/A   1874102      C   ray::RayWorkerVllm.execute_method         13150MiB |
|    2   N/A  N/A   1874278      C   ray::RayWorkerVllm.execute_method         13146MiB |
|    3   N/A  N/A   1874402      C   ray::RayWorkerVllm.execute_method         13146MiB |
+---------------------------------------------------------------------------------------+
```


### curl 测试
```shell
curl -s http://127.0.0.1:8000/v1/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-3.5-turbo",
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
  "model": "gpt-3.5-turbo",
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

| 模型 | 推理 | 显卡数量 | 显存 (G) | 每秒生成 Tokens | 每秒生成字符 |
| --- | --- | :--: | --: | --: | --: |
| Qwen-1_8B-Chat | FastChat        | 1 | 4 | 36.95 | 75.37 |
| Qwen-1_8B-Chat | FastChat + vLLM | 4 | 13.34 | 62.63 | 119.20 |
| Qwen-7B-Chat   | FastChat + vLLM | 2 | 13.20 | 40.42 | 77.44 |
| Qwen-7B-Chat   | FastChat + vLLM | 4 | 13.44 | 26.39 | 48.86 |

### 测试脚本
#### 安装依赖

```shell
pip install typer
pip install openai==0.28
```

#### 脚本：llm-speed-test.py

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

#### 使用 
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

### 测试数据
#### Qwen-1_8B-Chat (FastChat)

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

#### Qwen-1_8B-Chat (FastChat + vLLM)

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

#### Qwen-7B-Chat (FastChat + vLLM, GPU: 2)
```shell
python llm-speed-test.py --prompt "写一篇1000字关于鲁软数字在电力信息化方面取得成绩的文章。"
```
```
🧑 写一篇1000字关于鲁软数字在电力信息化方面取得成绩的文章。
🤖 鲁软数字在电力信息化方面取得了显著的成绩，他们的解决方案和产品已经广泛应用于电力行业，并得到了广大用户的认可和好评。鲁软数字在电力信息化方面的成功，主要归功于他们深厚的技术积累和不断创新的精神。他们的产品和服务不仅满足了电力行业的需求，也推动了电力行业的发展和进步。鲁软数字将继续以用户为中心，以技术为驱动，努力提供更好的产品和服务，为电力行业的发展做出更大的贡献。 鲁软数字在电力信息化方面的成绩 文章中提到鲁软数字在电力信息化方面的成绩，包括他们的解决方案和产品已经广泛应用于电力行业，并得到了广大用户的认可和好评。鲁软数字在电力信息化方面的成功，主要归功于他们深厚的技术积累和不断创新的精神。他们的产品和服务不仅满足了电力行业的需求，也推动了电力行业的发展和进步。鲁软数字将继续以用户为中心，以技术为驱动，努力提供更好的产品和服务，为电力行业的发展做出更大的贡献。 鲁软数字在电力信息化方面的成就 鲁软数字在电力信息化方面的成就，主要包括他们开发的电力信息化解决方案和产品已经广泛应用于电力行业，并得到了广大用户的认可和好评。这些解决方案和产品不仅满足了电力行业的需求，也推动了电力行业的发展和进步。鲁软数字在电力信息化方面的成功，主要归功于他们深厚的技术积累和不断创新的精神。他们的产品和服务不仅满足了电力行业的需求，也推动了电力行业的发展和进步。鲁软数字将继续以用户为中心，以技术为驱动，努力提供更好的产品和服务，为电力行业的发展做出更大的贡献。 鲁软数字在电力信息化方面的贡献 鲁软数字在电力信息化方面的贡献，主要包括他们开发的电力信息化解决方案和产品已经广泛应用于电力行业，并得到了广大用户的认可和好评。这些解决方案和产品不仅满足了电力行业的需求，也推动了电力行业的发展和进步。鲁软数字在电力信息化方面的成功，主要归功于他们深厚的技术积累和不断创新的精神。他们的产品和服务不仅满足了电力行业的需求，也推动了电力行业的发展和进步。鲁软数字将继续以用户为中心，以技术为驱动，努力提供更好的产品和服务，为电力行业的发展做出更大的贡献。 鲁软数字在电力信息化方面的未来发展 鲁软数字在电力信息化方面的未来发展，主要包括他们将继续以用户为中心，以技术为驱动，努力提供更好的产品和服务，为电力行业的发展做出更大的贡献。鲁软数字将不断优化他们的解决方案和产品，以满足电力行业的需求。他们也将继续创新，以推动电力行业的发展和进步。鲁软数字相信，通过他们的努力，电力行业将会更加信息化、智能化，从而为电力行业的发展做出更大的贡献。 鲁软数字在电力信息化方面的未来展望 鲁软数字在电力信息化方面的未来展望，主要包括他们将继续以用户为中心，以技术为驱动，努力提供更好的产品和服务，为电力行业的发展做出更大的贡献。鲁软数字将不断优化他们的解决方案和产品，以满足电力行业的需求。他们也将继续创新，以推动电力行业的发展和进步。鲁软数字相信，通过他们的努力，电力行业将会更加信息化、智能化，从而为电力行业的发展做出更大的贡献。 鲁软数字在电力信息化方面的未来计划 鲁软数字在电力信息化方面的未来计划，主要包括他们将继续以用户为中心，以技术为驱动，努力提供更好的产品和服务，为电力行业的发展做出更大的贡献。鲁软数字将不断优化他们的解决方案和产品，以满足电力行业的需求。他们也将继续创新，以推动电力行业的发展和进步。鲁软数字相信，通过他们的努力，电力行业将会更加信息化、智能化，从而为电力行业的发展做出更大的贡献。 鲁软数字在电力信息化方面的未来目标 鲁软数字在电力信息化方面的未来目标，主要包括他们将继续以用户为中心，以技术为驱动，努力提供更好的产品和服务，为电力行业的发展做出更大的贡献。鲁软数字将不断优化他们的解决方案和产品，以满足电力行业的需求。他们也将继续创新，以推动电力行业的发展和进步。鲁软数字相信，通过他们的努力，电力行业将会更加信息化、智能化，从而为电力行业的发展做出更大的贡献。 鲁软数字在电力信息化方面的未来挑战 鲁软数字在电力信息化方面的未来挑战，主要包括他们将继续以用户为中心，以技术为驱动，努力提供更好的产品和服务，为电力行业的发展做出更大的贡献。鲁软数字将不断优化他们的解决方案和产品，以满足电力行业的需求。他们也将继续创新，以推动电力行业的发展和进步。鲁软数字相信，通过他们的努力，电力行业将会更加信息化、智能化，从而为电力行业的发展做出更大的贡献。 鲁软数字在电力信息化方面的未来机会 鲁
🚀 每秒生成 Tokens: 26.39 	 合计 Tokens （1019） = 输入 Tokens（19） + 输出 Tokens（1000）
🚀 每秒生成字符   : 48.86 	 合计生成字符（1851）
⏱️ 生成耗时: 37.89 秒
```

#### Qwen-7B-Chat (FastChat + vLLM, GPU: 4)
```shell
python llm-speed-test.py --prompt "写一篇1000字关于鲁软数字在电力信息化方面取得成绩的文章。"
```
```
🧑 写一篇1000字关于鲁软数字在电力信息化方面取得成绩的文章。
🤖 此外，文章还应包含未来鲁软数字在电力信息化领域的规划和展望。

标题：鲁软数字：电力信息化领域的领航者

随着科技的飞速发展，电力信息化已成为电力行业发展的关键因素。鲁软数字作为电力信息化领域的领军企业，凭借其深厚的技术底蕴和独特的创新模式，已经在电力信息化领域取得了显著的成绩。

鲁软数字自成立以来，一直致力于电力信息化的开发和研究。其自主研发的电力信息化平台，能够实现电力生产、运行、调度、营销等各个环节的数字化、网络化、智能化，极大地提高了电力行业的生产效率和服务质量。同时，鲁软数字还积极参与电力行业的标准化建设，推动电力信息化行业的发展。

鲁软数字在电力信息化方面的成绩，离不开其强大的研发团队和先进的技术。鲁软数字的研发团队由一群在电力信息化领域有着深厚专业知识和丰富实践经验的专家组成，他们不断研究电力行业的最新动态，探索电力信息化的新模式和新应用，推动电力信息化的发展。

未来，鲁软数字将继续坚持在电力信息化领域的创新和研发，以满足电力行业的需求。鲁软数字计划推出一系列新的电力信息化产品和服务，如智能电网管理平台、电力大数据分析平台等，以提高电力行业的智能化水平和数据化程度。

同时，鲁软数字还将加强与电力行业的合作，推动电力信息化的发展。鲁软数字将与电力企业一起，共同研究电力行业的信息化需求，共同开发电力信息化产品和服务，共同推动电力信息化的发展。

鲁软数字在电力信息化领域的成绩和未来规划，充分展示了其在电力信息化领域的领导地位和强大的发展潜力。我们相信，鲁软数字将在电力信息化领域继续发挥其引领作用，推动电力行业的数字化、网络化、智能化发展，为电力行业的发展做出更大的贡献。
🚀 每秒生成 Tokens: 40.42 	 合计 Tokens （387） = 输入 Tokens（19） + 输出 Tokens（368）
🚀 每秒生成字符   : 77.44 	 合计生成字符（705）
⏱️ 生成耗时: 9.10 秒
```

```shell
python llm-speed-test.py --prompt "写一篇1000字关于鲁软数字在电力信息化方面取得成绩的文章。"
```
```
🧑 写一篇1000字关于鲁软数字在电力信息化方面取得成绩的文章。
🤖  鲁软数字在电力信息化方面取得的成绩

鲁软数字是一家专注于电力信息化领域的科技公司，其在电力信息化方面的成绩得到了广泛的认可。鲁软数字在电力信息化方面的成功，主要归功于其强大的技术研发能力、丰富的行业经验和优秀的团队执行力。

鲁软数字在电力信息化领域的研发实力强大。鲁软数字拥有一支由业界顶尖专家组成的研发团队，他们精通电力信息化领域的各项技术，包括电力系统监控、电力设备管理、电力用户服务等。他们不断研发新技术，推出新产品，为电力企业提供了先进的信息化解决方案。

鲁软数字在电力信息化领域的经验丰富。鲁软数字在电力信息化领域有着多年的经验，他们了解电力行业的特点和需求，能够提供符合电力企业实际需求的信息化解决方案。他们与电力企业建立了长期的合作关系，通过不断的交流和合作，积累了丰富的行业经验。

鲁软数字在电力信息化领域的执行力优秀。鲁软数字有一支高效的团队，他们能够快速响应电力企业的需求，提供及时的服务。他们的执行力强，能够确保项目的顺利进行，从而保证电力企业的信息化建设能够按时完成。

鲁软数字在电力信息化领域的成绩得到了广泛的认可。鲁软数字的信息化解决方案已经成功应用在了多个电力企业中，为电力企业提供了极大的帮助。他们的解决方案不仅提高了电力企业的运营效率，还提高了电力企业的服务质量，得到了电力企业的高度评价。

总之，鲁软数字在电力信息化方面取得了显著的成绩。他们的强大技术研发能力、丰富的行业经验和优秀的团队执行力，使得他们能够在电力信息化领域取得成功。我们期待鲁软数字能够在电力信息化领域继续取得更多的成就。 鲁软数字在电力信息化方面的成绩

鲁软数字是一家专注于电力信息化领域的科技公司，其在电力信息化方面的成绩得到了广泛的认可。鲁软数字在电力信息化方面的成功，主要归功于其强大的技术研发能力、丰富的行业经验和优秀的团队执行力。

鲁软数字在电力信息化领域的研发实力强大。鲁软数字拥有一支由业界顶尖专家组成的研发团队，他们精通电力信息化领域的各项技术，包括电力系统监控、电力设备管理、电力用户服务等。他们不断研发新技术，推出新产品，为电力企业提供了先进的信息化解决方案。

鲁软数字在电力信息化领域的经验丰富。鲁软数字在电力信息化领域有着多年的经验，他们了解电力行业的特点和需求，能够提供符合电力企业实际需求的信息化解决方案。他们与电力企业建立了长期的合作关系，通过不断的交流和合作，积累了丰富的行业经验。

鲁软数字在电力信息化领域的执行力优秀。鲁软数字有一支高效的团队，他们能够快速响应电力企业的需求，提供及时的服务。他们的执行力强，能够确保项目的顺利进行，从而保证电力企业的信息化建设能够按时完成。

鲁软数字在电力信息化领域的成绩得到了广泛的认可。鲁软数字的信息化解决方案已经成功应用在了多个电力企业中，为电力企业提供了极大的帮助。他们的解决方案不仅提高了电力企业的运营效率，还提高了电力企业的服务质量，得到了电力企业的高度评价。

总之，鲁软数字在电力信息化方面取得了显著的成绩。他们的强大技术研发能力、丰富的行业经验和优秀的团队执行力，使得他们能够在电力信息化领域取得成功。我们期待鲁软数字能够在电力信息化领域继续取得更多的成就。 鲁软数字在电力信息化方面的成绩

鲁软数字是一家专注于电力信息化领域的科技公司，其在电力信息化方面的成绩得到了广泛的认可。鲁软数字在电力信息化方面的成功，主要归功于其强大的技术研发能力、丰富的行业经验和优秀的团队执行力。

鲁软数字在电力信息化领域的研发实力强大。鲁软数字拥有一支由业界顶尖专家组成的研发团队，他们精通电力信息化领域的各项技术，包括电力系统监控、电力设备管理、电力用户服务等。他们不断研发新技术，推出新产品，为电力企业提供了先进的信息化解决方案。

鲁软数字在电力信息化领域的经验丰富。鲁软数字在电力信息化领域有着多年的经验，他们了解电力行业的特点和需求，能够提供符合电力企业实际需求的信息化解决方案。他们与电力企业建立了长期的合作关系，通过不断的交流和合作，积累了丰富的行业经验。

鲁软数字在电力信息化领域的执行力优秀。鲁软数字有一支高效的团队，他们能够快速响应电力企业的需求，提供及时的服务。他们的执行力强，能够确保项目的顺利进行，从而保证电力企业的信息化建设能够按时完成。

鲁软数字在电力信息化领域的成绩得到了广泛的认可。鲁软数字的信息化解决方案已经成功应用在了多个电力企业中，为电力企业提供了极大的帮助。他们的解决方案不仅提高了电力企业的运营效率，还提高了电力企业的服务质量，得到了电力企业的高度评价。

总之，鲁软数字在电力信息化方面取得了显著的成绩。他们的强大技术研发能力、丰富的行业经验和优秀的团队执行力，使得他们能够在电力信息化领域取得成功。我们期待鲁软数字能够在电力信息化领域继续取得
🚀 每秒生成 Tokens: 41.51 	 合计 Tokens （1019） = 输入 Tokens（19） + 输出 Tokens（1000）
🚀 每秒生成字符   : 83.01 	 合计生成字符（2000）
⏱️ 生成耗时: 24.09 秒
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

#### Qwen-1_8B-Chat (FastChat + vLLM, GPU: 2)

| 并发数 | 并发线程数 | 完成请求数 | 超时请求数 | 每秒请求数 | 每秒传输字节数 | 平均响应时间 |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| 1 | 1 | 12 | 0 | 0.20 | 422.77B | 4.96s |
| 2 | 2 | 21 | 0 | 0.35 | 0.86KB | 5.24s |
| 3 | 3 | 30 | 0 | 0.50 | 1.27KB | 5.72s |
| 4 | 4 | 38 | 0 | 0.63 | 1.67KB | 6.10s |
| 5 | 5 | 47 | 0 | 0.78 | 1.94KB | 6.02s |
| 6 | 6 | 56 | 0 | 0.93 | 2.27KB | 6.08s |
| 7 | 7 | 50 | 9 | 0.83 | 2.01KB | 7.29s |
| 8 | 8 | 54 | 14 | 0.90 | 2.21KB | 7.48s |

#### Qwen-1_8B-Chat (FastChat + vLLM, GPU: 4)

| 并发数 | 并发线程数 | 完成请求数 | 超时请求数 | 每秒请求数 | 每秒传输字节数 | 平均响应时间 |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| 4 | 4 | 28 | 0 | 0.47 | 1.29KB | 7.73s |
| 5 | 5 | 38 | 4 | 0.63 | 1.52KB | 7.05s |
| 6 | 6 | 45 | 7 | 0.75 | 1.79KB | 6.92s |

#### Qwen-7B-Chat (FastChat + vLLM, GPU: 4)

wrk 的 `超时时间` 设置为 60 秒；测试脚本 post_json.lua 中的 `max_tokens` 设置为 2048 。

```lua
wrk.method = "POST"
wrk.body   = "{    \"model\": \"gpt-3.5-turbo\",    \"prompt\": \"写一篇1000字关于鲁软数字在电力信息化方面取得成绩的文章。\",    \"temperature\": 0.7,    \"max_tokens\": 2048  }"
wrk.headers["Content-Type"] = "application/json"
```

| 并发数 | 并发线程数 | 总传输字节数 | 每秒传输字节数 |
| :---: | :---: | ---: | ---: |
| 1 | 1 | 11.86KB | 201.37B |
| 2 | 1 | 19.28KB | 328.55B |
| 2 | 2 | 16.31KB | 278.02B |
| 3 | 1 | 25.18KB | 429.18B |
| 3 | 2 | 25.23KB | 429.96B |
| 3 | 3 | 27.10KB | 461.95B |
| 4 | 1 | 23.22KB | 395.70B |
| 4 | 2 | 31.21KB | 531.99B |
| 4 | 3 | 23.52KB | 400.94B |
| 4 | 4 | 17.59KB | 299.75B |
| 5 | 1 | 17.07KB | 290.97B |
| 5 | 2 | 27.75KB | 471.53B |
| 5 | 3 | 11.83KB | 201.69B |
| 5 | 4 | 36.41KB | 620.49B |
| 5 | 5 | 19.77KB | 336.88B |
| 6 | 1 | 23.90KB | 407.25B |
| 6 | 2 | 33.23KB | 566.36B |
| 6 | 3 | 30.27KB | 515.90B |
| 6 | 4 | 27.73KB | 472.55B |
| 6 | 5 | 36.64KB | 624.52B |
| 6 | 6 | 20.87KB | 355.75B |
| 7 | 1 | 51.64KB | 877.02B |
| 7 | 2 | 21.62KB | 368.51B |
| 7 | 3 | 39.13KB | 666.31B |
| 7 | 4 | 30.47KB | 519.35B |
| 7 | 5 | 24.06KB | 410.06B |
| 7 | 6 | 30.62KB | 521.81B |
| 7 | 7 | 36.70KB | 625.46B |
| 8 | 1 | 64.66KB | 1.08KB |
| 8 | 2 | 28.70KB | 489.12B |
| 8 | 3 | 30.47KB | 519.24B |
| 8 | 4 | 37.50KB | 639.14B |
| 8 | 5 | 20.80KB | 354.50B |
| 8 | 6 | 42.00KB | 715.73B |
| 8 | 7 | 50.25KB | 856.47B |
| 8 | 8 | 26.44KB | 450.64B |

### 测试数据

#### Qwen-1_8B-Chat (FastChat + vLLM, GPU: 2)

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

#### Qwen-1_8B-Chat (FastChat + vLLM, GPU: 4)

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

#### Qwen-7B-Chat (FastChat + vLLM, GPU: 4)

```shell
wrk -c1 -t1 -d1m --timeout 60s --latency -s post_json.lua http://127.0.0.1:8000/v1/completions
```
```
Running 1m test @ http://127.0.0.1:8000/v1/completions
  1 threads and 1 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency    49.31s     0.00us  49.31s   100.00%
    Req/Sec     0.00      0.00     0.00    100.00%
  Latency Distribution
     50%   49.31s 
     75%   49.31s 
     90%   49.31s 
     99%   49.31s 
  1 requests in 1.01m, 11.86KB read
Requests/sec:      0.02
Transfer/sec:     201.37B
```

```shell
wrk -c2 -t1 -d1m --timeout 60s --latency -s post_json.lua http://127.0.0.1:8000/v1/completions
```
```
Running 1m test @ http://127.0.0.1:8000/v1/completions
  1 threads and 2 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     0.91m     1.36ms   0.91m   100.00%
    Req/Sec     0.00      0.00     0.00    100.00%
  Latency Distribution
     50%    0.91m 
     75%    0.91m 
     90%    0.91m 
     99%    0.91m 
  2 requests in 1.00m, 19.28KB read
Requests/sec:      0.03
Transfer/sec:     328.55B
```

```shell
wrk -c2 -t2 -d1m --timeout 60s --latency -s post_json.lua http://127.0.0.1:8000/v1/completions
```
```
Running 1m test @ http://127.0.0.1:8000/v1/completions
  2 threads and 2 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency    13.82s     2.44s   16.45s    60.00%
    Req/Sec     0.00      0.00     0.00    100.00%
  Latency Distribution
     50%   13.34s 
     75%   16.20s 
     90%   16.45s 
     99%   16.45s 
  5 requests in 1.00m, 16.31KB read
Requests/sec:      0.08
Transfer/sec:     278.02B
```

```shell
wrk -c3 -t1 -d1m --timeout 60s --latency -s post_json.lua http://127.0.0.1:8000/v1/completions
```
```
Running 1m test @ http://127.0.0.1:8000/v1/completions
  1 threads and 3 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency    17.30s    18.82s    0.98m    85.71%
    Req/Sec     0.14      0.38     1.00     85.71%
  Latency Distribution
     50%   13.46s 
     75%   13.97s 
     90%    0.98m 
     99%    0.98m 
  7 requests in 1.00m, 25.18KB read
Requests/sec:      0.12
Transfer/sec:     429.18B
```

```shell
wrk -c3 -t2 -d1m --timeout 60s --latency -s post_json.lua http://127.0.0.1:8000/v1/completions
```
```
Running 1m test @ http://127.0.0.1:8000/v1/completions
  2 threads and 3 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency    19.33s    19.64s    0.99m    83.33%
    Req/Sec     0.00      0.00     0.00    100.00%
  Latency Distribution
     50%   12.46s 
     75%   13.83s 
     90%    0.99m 
     99%    0.99m 
  6 requests in 1.00m, 25.23KB read
Requests/sec:      0.10
Transfer/sec:     429.96B
```

```shell
wrk -c3 -t3 -d1m --timeout 60s --latency -s post_json.lua http://127.0.0.1:8000/v1/completions
```
```
Running 1m test @ http://127.0.0.1:8000/v1/completions
  3 threads and 3 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency    20.83s    18.44s    0.97m    83.33%
    Req/Sec     0.00      0.00     0.00    100.00%
  Latency Distribution
     50%   13.73s 
     75%   17.62s 
     90%    0.97m 
     99%    0.97m 
  6 requests in 1.00m, 27.10KB read
Requests/sec:      0.10
Transfer/sec:     461.95B
```

```shell
wrk -c4 -t1 -d1m --timeout 60s --latency -s post_json.lua http://127.0.0.1:8000/v1/completions
```
```
Running 1m test @ http://127.0.0.1:8000/v1/completions
  1 threads and 4 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency    13.56s     1.22s   15.16s    62.50%
    Req/Sec     0.00      0.00     0.00    100.00%
  Latency Distribution
     50%   13.72s 
     75%   14.69s 
     90%   15.16s 
     99%   15.16s 
  8 requests in 1.00m, 23.22KB read
Requests/sec:      0.13
Transfer/sec:     395.70B
```

```shell
wrk -c4 -t2 -d1m --timeout 60s --latency -s post_json.lua http://127.0.0.1:8000/v1/completions
```
```
Running 1m test @ http://127.0.0.1:8000/v1/completions
  2 threads and 4 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency    21.23s    16.86s    0.96m    85.71%
    Req/Sec     0.00      0.00     0.00    100.00%
  Latency Distribution
     50%   13.53s 
     75%   25.29s 
     90%    0.96m 
     99%    0.96m 
  7 requests in 1.00m, 31.21KB read
Requests/sec:      0.12
Transfer/sec:     531.99B
```

```shell
wrk -c4 -t3 -d1m --timeout 60s --latency -s post_json.lua http://127.0.0.1:8000/v1/completions
```
```
Running 1m test @ http://127.0.0.1:8000/v1/completions
  3 threads and 4 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency    14.02s     6.71s   29.78s    87.50%
    Req/Sec     0.00      0.00     0.00    100.00%
  Latency Distribution
     50%   12.70s 
     75%   15.10s 
     90%   29.78s 
     99%   29.78s 
  8 requests in 1.00m, 23.52KB read
Requests/sec:      0.13
Transfer/sec:     400.94B
```

```shell
wrk -c4 -t4 -d1m --timeout 60s --latency -s post_json.lua http://127.0.0.1:8000/v1/completions
```
```
Running 1m test @ http://127.0.0.1:8000/v1/completions
  4 threads and 4 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency    12.22s     7.59s   23.78s    71.43%
    Req/Sec     1.43      3.78    10.00     85.71%
  Latency Distribution
     50%   13.63s 
     75%   15.09s 
     90%   23.78s 
     99%   23.78s 
  7 requests in 1.00m, 17.59KB read
Requests/sec:      0.12
Transfer/sec:     299.75B
```

```shell
wrk -c5 -t1 -d1m --timeout 60s --latency -s post_json.lua http://127.0.0.1:8000/v1/completions
```
```
Running 1m test @ http://127.0.0.1:8000/v1/completions
  1 threads and 5 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency    13.48s     6.10s   21.95s    66.67%
    Req/Sec     0.00      0.00     0.00    100.00%
  Latency Distribution
     50%   15.41s 
     75%   15.43s 
     90%   21.95s 
     99%   21.95s 
  6 requests in 1.00m, 17.07KB read
Requests/sec:      0.10
Transfer/sec:     290.97B
```

```shell
wrk -c5 -t2 -d1m --timeout 60s --latency -s post_json.lua http://127.0.0.1:8000/v1/completions
```
```
Running 1m test @ http://127.0.0.1:8000/v1/completions
  2 threads and 5 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency    13.07s     6.90s   27.67s    80.00%
    Req/Sec     0.10      0.32     1.00     90.00%
  Latency Distribution
     50%   13.35s 
     75%   16.65s 
     90%   27.67s 
     99%   27.67s 
  10 requests in 1.00m, 27.75KB read
Requests/sec:      0.17
Transfer/sec:     471.53B
```

```shell
wrk -c5 -t3 -d1m --timeout 60s --latency -s post_json.lua http://127.0.0.1:8000/v1/completions
```
```
Running 1m test @ http://127.0.0.1:8000/v1/completions
  3 threads and 5 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency    14.52s     7.69s   25.79s    75.00%
    Req/Sec     0.00      0.00     0.00    100.00%
  Latency Distribution
     50%   12.81s 
     75%   25.79s 
     90%   25.79s 
     99%   25.79s 
  4 requests in 1.00m, 11.83KB read
Requests/sec:      0.07
Transfer/sec:     201.69B
```

```shell
wrk -c5 -t4 -d1m --timeout 60s --latency -s post_json.lua http://127.0.0.1:8000/v1/completions
```
```
Running 1m test @ http://127.0.0.1:8000/v1/completions
  4 threads and 5 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency    14.36s     7.59s   31.31s    75.00%
    Req/Sec     0.83      2.89    10.00     91.67%
  Latency Distribution
     50%   14.39s 
     75%   16.35s 
     90%   23.63s 
     99%   31.31s 
  12 requests in 1.00m, 36.41KB read
Requests/sec:      0.20
Transfer/sec:     620.49B
```

```shell
wrk -c5 -t5 -d1m --timeout 60s --latency -s post_json.lua http://127.0.0.1:8000/v1/completions
```
```
Running 1m test @ http://127.0.0.1:8000/v1/completions
  5 threads and 5 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency    13.78s     2.39s   16.85s    57.14%
    Req/Sec     0.00      0.00     0.00    100.00%
  Latency Distribution
     50%   13.82s 
     75%   16.37s 
     90%   16.85s 
     99%   16.85s 
  7 requests in 1.00m, 19.77KB read
Requests/sec:      0.12
Transfer/sec:     336.88B
```

```shell
wrk -c6 -t1 -d1m --timeout 60s --latency -s post_json.lua http://127.0.0.1:8000/v1/completions
```
```
Running 1m test @ http://127.0.0.1:8000/v1/completions
  1 threads and 6 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency    13.96s     5.60s   17.78s    88.89%
    Req/Sec     0.89      1.69     5.00     88.89%
  Latency Distribution
     50%   16.47s 
     75%   17.09s 
     90%   17.78s 
     99%   17.78s 
  9 requests in 1.00m, 23.90KB read
Requests/sec:      0.15
Transfer/sec:     407.25B
```

```shell
wrk -c6 -t2 -d1m --timeout 60s --latency -s post_json.lua http://127.0.0.1:8000/v1/completions
```
```
Running 1m test @ http://127.0.0.1:8000/v1/completions
  2 threads and 6 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency    19.26s     4.55s   24.57s    60.00%
    Req/Sec     0.60      1.58     5.00     90.00%
  Latency Distribution
     50%   20.17s 
     75%   23.49s 
     90%   24.57s 
     99%   24.57s 
  10 requests in 1.00m, 33.23KB read
Requests/sec:      0.17
Transfer/sec:     566.36B
```

```shell
wrk -c6 -t3 -d1m --timeout 60s --latency -s post_json.lua http://127.0.0.1:8000/v1/completions
```
```
Running 1m test @ http://127.0.0.1:8000/v1/completions
  3 threads and 6 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency    14.67s     4.10s   20.66s    54.55%
    Req/Sec     0.00      0.00     0.00    100.00%
  Latency Distribution
     50%   14.97s 
     75%   18.82s 
     90%   20.35s 
     99%   20.66s 
  11 requests in 1.00m, 30.27KB read
Requests/sec:      0.18
Transfer/sec:     515.90B
```

```shell
wrk -c6 -t4 -d1m --timeout 60s --latency -s post_json.lua http://127.0.0.1:8000/v1/completions
```
```
Running 1m test @ http://127.0.0.1:8000/v1/completions
  4 threads and 6 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency    15.13s     3.76s   23.91s    77.78%
    Req/Sec     0.00      0.00     0.00    100.00%
  Latency Distribution
     50%   14.66s 
     75%   15.97s 
     90%   23.91s 
     99%   23.91s 
  9 requests in 1.00m, 27.73KB read
Requests/sec:      0.15
Transfer/sec:     472.55B
```

```shell
wrk -c6 -t5 -d1m --timeout 60s --latency -s post_json.lua http://127.0.0.1:8000/v1/completions
```
```
Running 1m test @ http://127.0.0.1:8000/v1/completions
  5 threads and 6 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency    12.52s     3.11s   16.48s    85.71%
    Req/Sec     0.00      0.00     0.00    100.00%
  Latency Distribution
     50%   12.78s 
     75%   14.04s 
     90%   15.54s 
     99%   16.48s 
  14 requests in 1.00m, 36.64KB read
Requests/sec:      0.23
Transfer/sec:     624.52B
```

```shell
wrk -c6 -t6 -d1m --timeout 60s --latency -s post_json.lua http://127.0.0.1:8000/v1/completions
```
```
Running 1m test @ http://127.0.0.1:8000/v1/completions
  6 threads and 6 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency    14.43s     7.60s   27.00s    75.00%
    Req/Sec     0.25      0.71     2.00     87.50%
  Latency Distribution
     50%   15.59s 
     75%   19.56s 
     90%   27.00s 
     99%   27.00s 
  8 requests in 1.00m, 20.87KB read
Requests/sec:      0.13
Transfer/sec:     355.75B
```

```shell
wrk -c7 -t1 -d1m --timeout 60s --latency -s post_json.lua http://127.0.0.1:8000/v1/completions
```
```
Running 1m test @ http://127.0.0.1:8000/v1/completions
  1 threads and 7 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency    14.86s     4.87s   27.74s    82.35%
    Req/Sec     0.76      1.44     5.00     88.24%
  Latency Distribution
     50%   13.47s 
     75%   17.42s 
     90%   20.71s 
     99%   27.74s 
  17 requests in 1.00m, 51.64KB read
Requests/sec:      0.28
Transfer/sec:      0.86KB
```

```shell
wrk -c7 -t2 -d1m --timeout 60s --latency -s post_json.lua http://127.0.0.1:8000/v1/completions
```
```
Running 1m test @ http://127.0.0.1:8000/v1/completions
  2 threads and 7 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency    17.69s     2.13s   21.59s    71.43%
    Req/Sec     0.14      0.38     1.00     85.71%
  Latency Distribution
     50%   17.44s 
     75%   18.57s 
     90%   21.59s 
     99%   21.59s 
  7 requests in 1.00m, 21.62KB read
Requests/sec:      0.12
Transfer/sec:     368.51B
```

```shell
wrk -c7 -t3 -d1m --timeout 60s --latency -s post_json.lua http://127.0.0.1:8000/v1/completions
```
```
Running 1m test @ http://127.0.0.1:8000/v1/completions
  3 threads and 7 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency    16.53s     7.19s   35.02s    76.92%
    Req/Sec     0.00      0.00     0.00    100.00%
  Latency Distribution
     50%   14.89s 
     75%   16.14s 
     90%   24.88s 
     99%   35.02s 
  13 requests in 1.00m, 39.13KB read
Requests/sec:      0.22
Transfer/sec:     666.31B
```

```shell
wrk -c7 -t4 -d1m --timeout 60s --latency -s post_json.lua http://127.0.0.1:8000/v1/completions
```
```
Running 1m test @ http://127.0.0.1:8000/v1/completions
  4 threads and 7 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency    11.92s     6.32s   21.92s    66.67%
    Req/Sec     0.42      1.44     5.00     91.67%
  Latency Distribution
     50%   13.38s 
     75%   14.20s 
     90%   20.27s 
     99%   21.92s 
  12 requests in 1.00m, 30.47KB read
Requests/sec:      0.20
Transfer/sec:     519.35B
```

```shell
wrk -c7 -t5 -d1m --timeout 60s --latency -s post_json.lua http://127.0.0.1:8000/v1/completions
```
```
Running 1m test @ http://127.0.0.1:8000/v1/completions
  5 threads and 7 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency    13.23s     5.24s   18.15s    88.89%
    Req/Sec     1.11      3.33    10.00     88.89%
  Latency Distribution
     50%   15.07s 
     75%   15.72s 
     90%   18.15s 
     99%   18.15s 
  9 requests in 1.00m, 24.06KB read
Requests/sec:      0.15
Transfer/sec:     410.06B
```

```shell
wrk -c7 -t6 -d1m --timeout 60s --latency -s post_json.lua http://127.0.0.1:8000/v1/completions
```
```
Running 1m test @ http://127.0.0.1:8000/v1/completions
  6 threads and 7 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency    17.23s     5.03s   29.03s    80.00%
    Req/Sec     0.00      0.00     0.00    100.00%
  Latency Distribution
     50%   17.34s 
     75%   18.48s 
     90%   29.03s 
     99%   29.03s 
  10 requests in 1.00m, 30.62KB read
Requests/sec:      0.17
Transfer/sec:     521.81B
```

```shell
wrk -c7 -t7 -d1m --timeout 60s --latency -s post_json.lua http://127.0.0.1:8000/v1/completions
```
```
Running 1m test @ http://127.0.0.1:8000/v1/completions
  7 threads and 7 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency    15.47s     6.47s   28.28s    84.62%
    Req/Sec     0.38      1.39     5.00     92.31%
  Latency Distribution
     50%   16.06s 
     75%   18.71s 
     90%   20.09s 
     99%   28.28s 
  13 requests in 1.00m, 36.70KB read
Requests/sec:      0.22
Transfer/sec:     625.46B

```

```shell
wrk -c8 -t1 -d1m --timeout 60s --latency -s post_json.lua http://127.0.0.1:8000/v1/completions
```
```
Running 1m test @ http://127.0.0.1:8000/v1/completions
  1 threads and 8 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency    14.55s     4.59s   31.97s    90.91%
    Req/Sec     0.68      2.21    10.00     90.91%
  Latency Distribution
     50%   14.05s 
     75%   15.43s 
     90%   17.75s 
     99%   31.97s 
  22 requests in 1.00m, 64.66KB read
Requests/sec:      0.37
Transfer/sec:      1.08KB
```

```shell
wrk -c8 -t2 -d1m --timeout 60s --latency -s post_json.lua http://127.0.0.1:8000/v1/completions
```
```
Running 1m test @ http://127.0.0.1:8000/v1/completions
  2 threads and 8 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency    17.10s     2.38s   19.47s    90.00%
    Req/Sec     1.00      3.16    10.00     90.00%
  Latency Distribution
     50%   17.56s 
     75%   19.34s 
     90%   19.47s 
     99%   19.47s 
  10 requests in 1.00m, 28.70KB read
Requests/sec:      0.17
Transfer/sec:     489.12B
```

```shell
wrk -c8 -t3 -d1m --timeout 60s --latency -s post_json.lua http://127.0.0.1:8000/v1/completions
```
```
Running 1m test @ http://127.0.0.1:8000/v1/completions
  3 threads and 8 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency    18.37s     4.00s   23.74s    50.00%
    Req/Sec     0.00      0.00     0.00    100.00%
  Latency Distribution
     50%   18.24s 
     75%   22.86s 
     90%   23.74s 
     99%   23.74s 
  10 requests in 1.00m, 30.47KB read
Requests/sec:      0.17
Transfer/sec:     519.24B
```

```shell
wrk -c8 -t4 -d1m --timeout 60s --latency -s post_json.lua http://127.0.0.1:8000/v1/completions
```
```
Running 1m test @ http://127.0.0.1:8000/v1/completions
  4 threads and 8 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency    17.44s     4.81s   25.03s    84.62%
    Req/Sec     0.00      0.00     0.00    100.00%
  Latency Distribution
     50%   18.26s 
     75%   20.38s 
     90%   21.78s 
     99%   25.03s 
  13 requests in 1.00m, 37.50KB read
Requests/sec:      0.22
Transfer/sec:     639.14B
```

```shell
wrk -c8 -t5 -d1m --timeout 60s --latency -s post_json.lua http://127.0.0.1:8000/v1/completions
```
```
Running 1m test @ http://127.0.0.1:8000/v1/completions
  5 threads and 8 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency    20.06s     7.84s   32.80s    66.67%
    Req/Sec     0.00      0.00     0.00    100.00%
  Latency Distribution
     50%   19.92s 
     75%   21.05s 
     90%   32.80s 
     99%   32.80s 
  6 requests in 1.00m, 20.80KB read
Requests/sec:      0.10
Transfer/sec:     354.50B
```

```shell
wrk -c8 -t6 -d1m --timeout 60s --latency -s post_json.lua http://127.0.0.1:8000/v1/completions
```
```
Running 1m test @ http://127.0.0.1:8000/v1/completions
  6 threads and 8 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency    17.64s     5.22s   26.56s    69.23%
    Req/Sec     0.00      0.00     0.00    100.00%
  Latency Distribution
     50%   16.90s 
     75%   21.13s 
     90%   24.22s 
     99%   26.56s 
  13 requests in 1.00m, 42.00KB read
Requests/sec:      0.22
Transfer/sec:     715.73B
```

```shell
wrk -c8 -t7 -d1m --timeout 60s --latency -s post_json.lua http://127.0.0.1:8000/v1/completions
```
```
Running 1m test @ http://127.0.0.1:8000/v1/completions
  7 threads and 8 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency    17.89s    11.07s    0.94m    87.50%
    Req/Sec     0.00      0.00     0.00    100.00%
  Latency Distribution
     50%   15.35s 
     75%   20.17s 
     90%   22.59s 
     99%    0.94m 
  16 requests in 1.00m, 50.25KB read
Requests/sec:      0.27
Transfer/sec:     856.47B
```

```shell
wrk -c8 -t8 -d1m --timeout 60s --latency -s post_json.lua http://127.0.0.1:8000/v1/completions
```
```
Running 1m test @ http://127.0.0.1:8000/v1/completions
  8 threads and 8 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency    14.26s     7.46s   21.39s    81.82%
    Req/Sec     1.36      3.23    10.00     81.82%
  Latency Distribution
     50%   15.44s 
     75%   20.78s 
     90%   21.24s 
     99%   21.39s 
  11 requests in 1.00m, 26.44KB read
Requests/sec:      0.18
Transfer/sec:     450.64B
```
