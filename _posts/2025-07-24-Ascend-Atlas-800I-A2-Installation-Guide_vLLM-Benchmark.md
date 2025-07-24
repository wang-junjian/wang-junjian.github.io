---
layout: single
title:  "华为 Atlas 800I A2 大模型部署实战（五）：vLLM 性能测试"
date:   2025-07-24 10:00:00 +0800
categories: 昇腾 NPU
tags: [昇腾, NPU, 910B4, Atlas800IA2, Benchmark, vLLM, openEuler]
---

<!--more-->

## 性能测试

### vLLM

- 克隆 vLLM 仓库
```bash
git clone -b v0.9.1 https://github.com/vllm-project/vllm.git
cd vllm
```

- 安装 vLLM
```bash
pip install -e .
```

### 运行性能测试

```bash
python vllm/benchmarks/benchmark_serving.py \
    --backend vllm  \
    --model qwen2.5   \
    --dataset-name random  \
    --tokenizer /data/models/llm/qwen/Qwen2.5-32B-Instruct  \
    --random-input-len 256   \
    --num-prompts 640  \
    --base-url http://172.16.33.106:1025 --trust-remote-code
```

### 性能指标介绍

```plaintext
============ Serving Benchmark Result ============  
Successful requests:                     640        # 成功完成推理的请求数（失败的不算）  
Benchmark duration (s):                  48.47      # 压测总耗时（秒）  
Total input tokens:                      1307017    # 所有请求累计输入的 token 数（提示词总量）  
Total generated tokens:                  78908      # 所有请求累计生成的 token 数（回复总量）  
Request throughput (req/s):              13.20      # 请求级 QPS：平均每秒成功完成的请求数  
Output token throughput (tok/s):         1627.94    # 纯生成的 token 级 QPS：平均每秒输出多少 token  
Total Token throughput (tok/s):          28592.80   # 输入+输出的总 token 级 QPS  
---------------Time to First Token----------------  
Mean TTFT (ms):                          31861.01   # 首 token 平均延迟（用户感受到的首响时间）  
Median TTFT (ms):                        31476.59   # 首 token 中位数延迟  
P99 TTFT (ms):                           43942.40   # 首 token 99% 分位延迟（最慢 1% 请求的首响）  
-----Time per Output Token (excl. 1st token)------  
Mean TPOT (ms):                          56.84      # 除首 token 外，每个后续 token 的平均生成时间  
Median TPOT (ms):                        57.52      # TPOT 的中位数  
P99 TPOT (ms):                           59.11      # TPOT 的 99% 分位  
---------------Inter-token Latency----------------  
Mean ITL (ms):                           56.87      # 任意两个相邻 token 之间的平均间隔（≈TPOT）  
Median ITL (ms):                         58.39      # ITL 的中位数  
P99 ITL (ms):                            70.63      # ITL 的 99% 分位（抖动最大时的间隔）  
==================================================
```

- [vLLM文本生成推理快速入门 > 性能测试](https://www.hiascend.com/document/detail/zh/mindie/20RC2/quickstart/mindieturbomindie_quickstart_0009.html)


## 性能对比

### DeepSeek-R1-7B(Float16) 🆚 DeepSeek-R1-7B(W8A8)

| 指标           | 单位    | DeepSeek-R1-7B (Float16) | DeepSeek-R1-7B (W8A8) |
| ------------ | -----: | ---------------------: | ------------------: |
| 请求吞吐量        | req/s | 21.06                    | 22.84                 |
| 输出 token 吞吐量 | tok/s | 2619                  | 2859               |
| 总 token 吞吐量  | tok/s | 7966                  | 8659               |
| 平均 TTFT      | ms    | 13399                 | 12147              |
| 平均 TPOT      | ms    | 57                    | 52                 |
| 平均 ITL       | ms    | 57                    | 52                 |

### DeepSeek-R1-7B 🆚 Qwen2.5-7B

| 指标           | 单位    | DeepSeek-R1-7B | Qwen2.5-7B |
| ------------ | -----: | -----------: | ----------: |
| 请求吞吐量        | req/s | 23.28       | 22.70      |
| 输出 token 吞吐量 | tok/s | 2888        | 2856       |
| 总 token 吞吐量  | tok/s | 8800        | 8641       |
| 平均 TTFT      | ms    | 12327       | 12709      |
| 平均 TPOT      | ms    | 51          | 51         |
| 平均 ITL       | ms    | 51          | 51         |
