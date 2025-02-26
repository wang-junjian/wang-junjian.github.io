---
layout: post
title:  "海光 DCU 的大模型推理性能压测"
date:   2025-02-25 10:00:00 +0800
categories: 海光 Benchmark
tags: [海光, HYGON, DCU, vLLM, evalscope-perf, EvalScope, Benchmark, LLM]
---

## [海光 DCU 软件栈](https://www.hygon.cn/product/accelerator)

![](/images/2025/HYGON/accelerator_2_1.jpg)

- [DCU (Deep Computing Unit) 开发者社区](https://developer.hpccube.com/gitbook//dcu_developer/)


### 查看 DCU 状态（hy-smi）

```bash
hy-smi
```

```bash
============================ System Management Interface =============================
======================================================================================
DCU     Temp     AvgPwr     Perf     PwrCap     VRAM%      DCU%      Mode
0       67.0C    8.0W       manual   600.0W     87%        74%       Normal
1       68.0C    8.0W       manual   600.0W     85%        29%       Normal
2       69.0C    8.0W       manual   600.0W     85%        31%       Normal
3       68.0C    8.0W       manual   600.0W     85%        28%       Normal
4       71.0C    8.0W       manual   600.0W     85%        35%       Normal
5       73.0C    8.0W       manual   600.0W     85%        17%       Normal
6       70.0C    8.0W       manual   600.0W     85%        37%       Normal
7       68.0C    8.0W       manual   600.0W     85%        46%       Normal
======================================================================================
=================================== End of SMI Log ===================================
```


## 压力测试工具

### evalscope-perf

```bash
pip install evalscope-perf
```

运行 evalscope-perf 命令：

```bash
evalscope-perf http://127.0.0.1:8000/v1/chat/completions qwen2.5 \
    ./datasets/open_qa.jsonl \
    --max-prompt-length 8000 \
    --read-timeout=120 \
    --parallels 1 \
    --n 1
```

- [evalscope](https://pypi.org/project/evalscope)
- [evalscope-perf](https://pypi.org/project/evalscope-perf)

### vllm benchmark

克隆 [vllm](https://github.com/vllm-project/vllm) 项目

```bash
git clone https://github.com/vllm-project/vllm
```


## 数据集下载

### [中文聊天 HC3-Chinese](https://modelscope.cn/datasets/AI-ModelScope/HC3-Chinese)
```shell
mkdir datasets
wget https://modelscope.cn/datasets/AI-ModelScope/HC3-Chinese/resolve/master/open_qa.jsonl \
    -O datasets/open_qa.jsonl
```

### [代码问答 Codefuse-Evol-Instruct-Clean](https://modelscope.cn/datasets/Banksy235/Codefuse-Evol-Instruct-Clean)
```shell
wget https://modelscope.cn/datasets/Banksy235/Codefuse-Evol-Instruct-Clean/resolve/master/data.json \
    -O datasets/Codefuse-Evol-Instruct-Clean-data.jsonl

# 修改数据集格式，将 "input" 改为 "question"，以适应 EvalScope 的数据集格式 openqa
sed -i 's/"input"/"question"/g' datasets/Codefuse-Evol-Instruct-Clean-data.jsonl
```

### [ShareGPT](https://modelscope.cn/datasets/gliang1001/ShareGPT_V3_unfiltered_cleaned_split)
```shell
wget https://modelscope.cn/datasets/gliang1001/ShareGPT_V3_unfiltered_cleaned_split/resolve/master/ShareGPT_V3_unfiltered_cleaned_split.json \
    -O datasets/ShareGPT_V3_unfiltered_cleaned_split.json
```


## 下载模型

进入 `/data/models` 目录。

```bash
cd /data/models
```

### [Qwen2.5-7B-Instruct](https://modelscope.cn/models/Qwen/Qwen2.5-7B-Instruct)

```bash
git clone https://www.modelscope.cn/Qwen/Qwen2.5-7B-Instruct.git
```

### [Qwen2.5-72B-Instruct](https://modelscope.cn/models/Qwen/Qwen2.5-72B-Instruct)

```bash
git clone https://www.modelscope.cn/Qwen/Qwen2.5-72B-Instruct.git
```

### [DeepSeek-R1-Distill-Qwen-7B](https://modelscope.cn/models/deepseek-ai/DeepSeek-R1-Distill-Qwen-7B)

```bash
git clone https://www.modelscope.cn/deepseek-ai/DeepSeek-R1-Distill-Qwen-7B.git
```


## 部署模型

### 运行 DCU 容器

```bash
docker run -it --name vllm \
    --device=/dev/kfd \
    --device=/dev/mkfd \
    --device=/dev/dri \
    --security-opt \
    seccomp=unconfined \
    --cap-add=SYS_PTRACE \
    --ipc=host \
    --network=host \
    --shm-size=16G \
    --group-add video \
    -v /opt/hyhal:/opt/hyhal \
    -v /data/Qwen:/models \
    image.sourcefind.cn:5000/dcu/admin/base/pytorch:2.3.0-ubuntu22.04-dtk24.04.3-py3.10 \
    /bin/bash
```

### vLLM 部署模型
#### Qwen2.5-72B-Instruct

```bash
vllm serve /models/Qwen2.5-72B-Instruct \
    --served-model-name Qwen2.5-72B-Instruct \
    --tensor-parallel-size 8
```

#### DeepSeek-R1-Distill-Qwen-7B

```bash
vllm serve /models/DeepSeek-R1-Distill-Qwen-7B \
    --served-model-name DeepSeek-R1-Distill-Qwen-7B \
    --tensor-parallel-size 4
```

`--tensor-parallel-size` 不能设置 8，会报错：

```bash
INFO 02-26 08:54:31 config.py:908] Defaulting to use mp for distributed inference
INFO 02-26 08:54:31 config.py:937] Disabled the custom all-reduce kernel because it is not supported on hcus.
WARNING 02-26 08:54:31 arg_utils.py:947] Chunked prefill is enabled by default for models with max_model_len > 32K. Currently, chunked prefill might not work with some features or models. If you encounter any issues, please disable chunked prefill by setting --enable-chunked-prefill=False.
INFO 02-26 08:54:31 config.py:1019] Chunked prefill is enabled with max_num_batched_tokens=512.
Process SpawnProcess-1:
Traceback (most recent call last):
  File "/usr/local/lib/python3.10/multiprocessing/process.py", line 314, in _bootstrap
    self.run()
  File "/usr/local/lib/python3.10/multiprocessing/process.py", line 108, in run
    self._target(*self._args, **self._kwargs)
  File "/usr/local/lib/python3.10/site-packages/vllm/engine/multiprocessing/engine.py", line 388, in run_mp_engine
    engine = MQLLMEngine.from_engine_args(engine_args=engine_args,
  File "/usr/local/lib/python3.10/site-packages/vllm/engine/multiprocessing/engine.py", line 134, in from_engine_args
    engine_config = engine_args.create_engine_config()
  File "/usr/local/lib/python3.10/site-packages/vllm/engine/arg_utils.py", line 1081, in create_engine_config
    return EngineConfig(
  File "<string>", line 14, in __init__
  File "/usr/local/lib/python3.10/site-packages/vllm/config.py", line 1894, in __post_init__
    self.model_config.verify_with_parallel_config(self.parallel_config)
  File "/usr/local/lib/python3.10/site-packages/vllm/config.py", line 423, in verify_with_parallel_config
    raise ValueError(
ValueError: Total number of attention heads (28) must be divisible by tensor parallel size (8).
```

> 总的注意力头数 28 不能被张量并行大小 8 整除。


## 实验结果

### Qwen2.5-72B-Instruct

```bash
python3 ./benchmarks/benchmark_serving.py --backend vllm \
    --model Qwen2.5-72B-Instruct \
    --tokenizer /models/Qwen2.5-72B-Instruct \
    --dataset-name "sharegpt" \
    --dataset-path "datasets/ShareGPT_V3_unfiltered_cleaned_split.json" \
    --base-url http://0.0.0.0:8000 --trust-remote-code
```

```bash
Traffic request rate: inf
Burstiness factor: 1.0 (Poisson process)
Maximum request concurrency: None
============ Serving Benchmark Result ============
Successful requests:                     1000
Benchmark duration (s):                  337.55
Total input tokens:                      217393
Total generated tokens:                  201633
Request throughput (req/s):              2.96
Output token throughput (tok/s):         597.34
Total Token throughput (tok/s):          1241.37
---------------Time to First Token----------------
Mean TTFT (ms):                          103921.52
Median TTFT (ms):                        91061.83
P99 TTFT (ms):                           240625.64
-----Time per Output Token (excl. 1st token)------
Mean TPOT (ms):                          399.67
Median TPOT (ms):                        362.34
P99 TPOT (ms):                           1350.64
---------------Inter-token Latency----------------
Mean ITL (ms):                           326.40
Median ITL (ms):                         262.69
P99 ITL (ms):                            1155.89
==================================================
```

### DeepSeek-R1-Distill-Qwen-7B

```bash
python3 ./benchmarks/benchmark_serving.py --backend vllm \
    --model DeepSeek-R1-Distill-Qwen-7B \
    --tokenizer /models/DeepSeek-R1-Distill-Qwen-7B \
    --dataset-name "sharegpt" \
    --dataset-path "datasets/ShareGPT_V3_unfiltered_cleaned_split.json" \
    --base-url http://0.0.0.0:8000 --trust-remote-code
```

```bash
Traffic request rate: inf
Burstiness factor: 1.0 (Poisson process)
Maximum request concurrency: None
============ Serving Benchmark Result ============
Successful requests:                     388
Benchmark duration (s):                  55.08
Total input tokens:                      105060
Total generated tokens:                  177808
Request throughput (req/s):              7.04
Output token throughput (tok/s):         3228.07
Total Token throughput (tok/s):          5135.42
---------------Time to First Token----------------
Mean TTFT (ms):                          19398.15
Median TTFT (ms):                        18818.66
P99 TTFT (ms):                           41185.12
-----Time per Output Token (excl. 1st token)------
Mean TPOT (ms):                          48.15
Median TPOT (ms):                        35.21
P99 TPOT (ms):                           128.93
---------------Inter-token Latency----------------
Mean ITL (ms):                           92.37
Median ITL (ms):                         82.40
P99 ITL (ms):                            470.56
==================================================
```
