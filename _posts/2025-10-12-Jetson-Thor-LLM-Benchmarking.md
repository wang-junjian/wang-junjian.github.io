---
layout: single
title:  "Jetson Thor 平台上 Qwen3 系列大模型性能基准测试分析"
date:   2025-10-12 06:00:00 +0800
categories: Jetson Qwen3
tags: [JetsonThor, Jetson, Thor, Qwen3, Benchmark, vLLM, FP8, FP4, LLM, NVIDIA]
---

<!--more-->

![](/images/2025/Jetson/vLLM-Quantization-Supported-Hardware.png)

- [Quantization](https://docs.vllm.ai/en/latest/features/quantization/index.html#supported-hardware)
- [📌 GPT OSS](https://docs.vllm.ai/projects/recipes/en/latest/OpenAI/GPT-OSS.html)
- [📌 vLLM Benchmark Suites](https://docs.vllm.ai/en/latest/contributing/benchmarks.html)
- [Performance benchmarks descriptions](https://github.com/vllm-project/vllm/blob/main/.buildkite/nightly-benchmarks/performance-benchmarks-descriptions.md)

## 性能基准测试分析

![](/images/2025/Jetson/Qwen3-Benchmarks/1.png)

![](/images/2025/Jetson/Qwen3-Benchmarks/2.png)

![](/images/2025/Jetson/Qwen3-Benchmarks/3.png)

![](/images/2025/Jetson/Qwen3-Benchmarks/4.png)

![](/images/2025/Jetson/Qwen3-Benchmarks/5.png)

![](/images/2025/Jetson/Qwen3-Benchmarks/6.png)


## 部署模型

```bash
vllm serve /models/Qwen/Qwen3-8B --served-model-name qwen3
```

## 运行性能基准测试

- 高负载

```bash
vllm bench serve \
    --base-url http://localhost:8000 \
    --model qwen3 \
    --tokenizer /models/Qwen/Qwen3-8B \
    --dataset-name random \
    --random-input-len 2048 \
    --random-output-len 128 \
    --num-prompts 100 \
    --max-concurrency 8
```

- 低负载

```bash
vllm bench serve \
    --base-url http://localhost:8000 \
    --model qwen3 \
    --tokenizer /models/Qwen/Qwen3-8B \
    --dataset-name random \
    --random-input-len 2048 \
    --random-output-len 128 \
    --num-prompts 10 \
    --max-concurrency 1
```


## 性能基准测试结果

### Qwen3-8B

- 高负载

```bash
============ Serving Benchmark Result ============
Successful requests:                     100
Maximum request concurrency:             8
Benchmark duration (s):                  150.59
Total input tokens:                      204169
Total generated tokens:                  12419
Request throughput (req/s):              0.66
Output token throughput (tok/s):         82.47
Total Token throughput (tok/s):          1438.24
---------------Time to First Token----------------
Mean TTFT (ms):                          974.57
Median TTFT (ms):                        959.99
P99 TTFT (ms):                           2200.61
-----Time per Output Token (excl. 1st token)------
Mean TPOT (ms):                          85.33
Median TPOT (ms):                        86.05
P99 TPOT (ms):                           90.57
---------------Inter-token Latency----------------
Mean ITL (ms):                           85.33
Median ITL (ms):                         72.52
P99 ITL (ms):                            361.74
==================================================
```

- 低负载

```bash
============ Serving Benchmark Result ============
Successful requests:                     10
Maximum request concurrency:             1
Benchmark duration (s):                  81.59
Total input tokens:                      20431
Total generated tokens:                  1280
Request throughput (req/s):              0.12
Output token throughput (tok/s):         15.69
Total Token throughput (tok/s):          266.09
---------------Time to First Token----------------
Mean TTFT (ms):                          78.19
Median TTFT (ms):                        78.22
P99 TTFT (ms):                           80.61
-----Time per Output Token (excl. 1st token)------
Mean TPOT (ms):                          63.63
Median TPOT (ms):                        63.63
P99 TPOT (ms):                           63.76
---------------Inter-token Latency----------------
Mean ITL (ms):                           63.63
Median ITL (ms):                         63.59
P99 ITL (ms):                            64.89
==================================================
```

### Qwen3-8B-FP8

- 高负载

```bash
============ Serving Benchmark Result ============
Successful requests:                     100
Maximum request concurrency:             8
Benchmark duration (s):                  42.94
Total input tokens:                      204169
Total generated tokens:                  12800
Request throughput (req/s):              2.33
Output token throughput (tok/s):         298.07
Total Token throughput (tok/s):          5052.48
---------------Time to First Token----------------
Mean TTFT (ms):                          495.44
Median TTFT (ms):                        455.84
P99 TTFT (ms):                           912.34
-----Time per Output Token (excl. 1st token)------
Mean TPOT (ms):                          22.59
Median TPOT (ms):                        23.00
P99 TPOT (ms):                           25.05
---------------Inter-token Latency----------------
Mean ITL (ms):                           22.59
Median ITL (ms):                         17.88
P99 ITL (ms):                            150.30
==================================================
```

- 低负载

```bash
============ Serving Benchmark Result ============
Successful requests:                     10
Maximum request concurrency:             1
Benchmark duration (s):                  11.52
Total input tokens:                      20431
Total generated tokens:                  1280
Request throughput (req/s):              0.87
Output token throughput (tok/s):         111.15
Total Token throughput (tok/s):          1885.21
---------------Time to First Token----------------
Mean TTFT (ms):                          23.06
Median TTFT (ms):                        23.14
P99 TTFT (ms):                           25.49
-----Time per Output Token (excl. 1st token)------
Mean TPOT (ms):                          8.88
Median TPOT (ms):                        8.88
P99 TPOT (ms):                           8.98
---------------Inter-token Latency----------------
Mean ITL (ms):                           8.88
Median ITL (ms):                         8.68
P99 ITL (ms):                            9.99
==================================================
```

### Qwen3-8B-FP4

- 高负载

```bash
============ Serving Benchmark Result ============
Successful requests:                     100
Maximum request concurrency:             8
Benchmark duration (s):                  74.12
Total input tokens:                      204169
Total generated tokens:                  12393
Request throughput (req/s):              1.35
Output token throughput (tok/s):         167.20
Total Token throughput (tok/s):          2921.73
---------------Time to First Token----------------
Mean TTFT (ms):                          570.92
Median TTFT (ms):                        460.86
P99 TTFT (ms):                           1935.81
-----Time per Output Token (excl. 1st token)------
Mean TPOT (ms):                          42.08
Median TPOT (ms):                        41.89
P99 TPOT (ms):                           50.72
---------------Inter-token Latency----------------
Mean ITL (ms):                           42.09
Median ITL (ms):                         33.41
P99 ITL (ms):                            211.06
==================================================
```

- 低负载

```bash
============ Serving Benchmark Result ============
Successful requests:                     10
Maximum request concurrency:             1
Benchmark duration (s):                  31.79
Total input tokens:                      20431
Total generated tokens:                  1280
Request throughput (req/s):              0.31
Output token throughput (tok/s):         40.26
Total Token throughput (tok/s):          682.94
---------------Time to First Token----------------
Mean TTFT (ms):                          38.55
Median TTFT (ms):                        38.39
P99 TTFT (ms):                           40.58
-----Time per Output Token (excl. 1st token)------
Mean TPOT (ms):                          24.73
Median TPOT (ms):                        24.71
P99 TPOT (ms):                           24.81
---------------Inter-token Latency----------------
Mean ITL (ms):                           24.73
Median ITL (ms):                         24.60
P99 ITL (ms):                            25.78
==================================================
```

### Qwen3-8B-GPTQ-Int4

- 高负载

```bash
============ Serving Benchmark Result ============
Successful requests:                     200
Maximum request concurrency:             8
Benchmark duration (s):                  240.75
Total input tokens:                      408281
Total generated tokens:                  24244
Request throughput (req/s):              0.83
Output token throughput (tok/s):         100.70
Total Token throughput (tok/s):          1796.55
---------------Time to First Token----------------
Mean TTFT (ms):                          1918.40
Median TTFT (ms):                        1886.97
P99 TTFT (ms):                           3725.30
-----Time per Output Token (excl. 1st token)------
Mean TPOT (ms):                          64.07
Median TPOT (ms):                        65.20
P99 TPOT (ms):                           77.52
---------------Inter-token Latency----------------
Mean ITL (ms):                           63.69
Median ITL (ms):                         31.55
P99 ITL (ms):                            743.86
==================================================
```

- 低负载

```bash
============ Serving Benchmark Result ============
Successful requests:                     10
Maximum request concurrency:             1
Benchmark duration (s):                  29.70
Total input tokens:                      20431
Total generated tokens:                  1280
Request throughput (req/s):              0.34
Output token throughput (tok/s):         43.09
Total Token throughput (tok/s):          730.96
---------------Time to First Token----------------
Mean TTFT (ms):                          36.87
Median TTFT (ms):                        36.94
P99 TTFT (ms):                           38.49
-----Time per Output Token (excl. 1st token)------
Mean TPOT (ms):                          23.09
Median TPOT (ms):                        23.09
P99 TPOT (ms):                           23.19
---------------Inter-token Latency----------------
Mean ITL (ms):                           23.09
Median ITL (ms):                         22.96
P99 ITL (ms):                            24.13
==================================================
```

### Qwen3-8B-GPTQ-Int8

- 高负载

```bash
============ Serving Benchmark Result ============
Successful requests:                     100
Maximum request concurrency:             8
Benchmark duration (s):                  156.75
Total input tokens:                      204169
Total generated tokens:                  12419
Request throughput (req/s):              0.64
Output token throughput (tok/s):         79.23
Total Token throughput (tok/s):          1381.78
---------------Time to First Token----------------
Mean TTFT (ms):                          2225.45
Median TTFT (ms):                        1899.85
P99 TTFT (ms):                           5168.47
-----Time per Output Token (excl. 1st token)------
Mean TPOT (ms):                          81.04
Median TPOT (ms):                        83.37
P99 TPOT (ms):                           91.55
---------------Inter-token Latency----------------
Mean ITL (ms):                           81.04
Median ITL (ms):                         45.06
P99 ITL (ms):                            858.38
==================================================
```

- 低负载

```bash
============ Serving Benchmark Result ============
Successful requests:                     10
Maximum request concurrency:             1
Benchmark duration (s):                  47.19
Total input tokens:                      20431
Total generated tokens:                  1280
Request throughput (req/s):              0.21
Output token throughput (tok/s):         27.13
Total Token throughput (tok/s):          460.11
---------------Time to First Token----------------
Mean TTFT (ms):                          50.83
Median TTFT (ms):                        50.65
P99 TTFT (ms):                           53.36
-----Time per Output Token (excl. 1st token)------
Mean TPOT (ms):                          36.75
Median TPOT (ms):                        36.74
P99 TPOT (ms):                           36.86
---------------Inter-token Latency----------------
Mean ITL (ms):                           36.75
Median ITL (ms):                         36.83
P99 ITL (ms):                            37.66
==================================================
```

### Qwen3-8B-AWQ

- 高负载

```bash
============ Serving Benchmark Result ============
Successful requests:                     100
Maximum request concurrency:             8
Benchmark duration (s):                  123.36
Total input tokens:                      204169
Total generated tokens:                  12392
Request throughput (req/s):              0.81
Output token throughput (tok/s):         100.45
Total Token throughput (tok/s):          1755.51
---------------Time to First Token----------------
Mean TTFT (ms):                          1823.17
Median TTFT (ms):                        1529.95
P99 TTFT (ms):                           4474.37
-----Time per Output Token (excl. 1st token)------
Mean TPOT (ms):                          63.92
Median TPOT (ms):                        65.64
P99 TPOT (ms):                           77.46
---------------Inter-token Latency----------------
Mean ITL (ms):                           63.99
Median ITL (ms):                         31.84
P99 ITL (ms):                            745.13
==================================================
```

- 低负载

```bash
============ Serving Benchmark Result ============
Successful requests:                     10
Maximum request concurrency:             1
Benchmark duration (s):                  30.00
Total input tokens:                      20431
Total generated tokens:                  1280
Request throughput (req/s):              0.33
Output token throughput (tok/s):         42.66
Total Token throughput (tok/s):          723.61
---------------Time to First Token----------------
Mean TTFT (ms):                          36.95
Median TTFT (ms):                        37.39
P99 TTFT (ms):                           38.72
-----Time per Output Token (excl. 1st token)------
Mean TPOT (ms):                          23.33
Median TPOT (ms):                        23.36
P99 TPOT (ms):                           23.40
---------------Inter-token Latency----------------
Mean ITL (ms):                           23.33
Median ITL (ms):                         23.17
P99 ITL (ms):                            24.34
==================================================
```

### Qwen3-8B-Int4-W4A16

- 高负载

```bash
============ Serving Benchmark Result ============
Successful requests:                     100
Maximum request concurrency:             8
Benchmark duration (s):                  124.74
Total input tokens:                      204169
Total generated tokens:                  12419
Request throughput (req/s):              0.80
Output token throughput (tok/s):         99.56
Total Token throughput (tok/s):          1736.36
---------------Time to First Token----------------
Mean TTFT (ms):                          2114.14
Median TTFT (ms):                        2230.05
P99 TTFT (ms):                           4737.55
-----Time per Output Token (excl. 1st token)------
Mean TPOT (ms):                          62.10
Median TPOT (ms):                        61.38
P99 TPOT (ms):                           71.65
---------------Inter-token Latency----------------
Mean ITL (ms):                           62.10
Median ITL (ms):                         31.80
P99 ITL (ms):                            746.19
==================================================
```

- 低负载

```bash
============ Serving Benchmark Result ============
Successful requests:                     10
Maximum request concurrency:             1
Benchmark duration (s):                  29.98
Total input tokens:                      20431
Total generated tokens:                  1280
Request throughput (req/s):              0.33
Output token throughput (tok/s):         42.70
Total Token throughput (tok/s):          724.22
---------------Time to First Token----------------
Mean TTFT (ms):                          37.85
Median TTFT (ms):                        38.06
P99 TTFT (ms):                           39.91
-----Time per Output Token (excl. 1st token)------
Mean TPOT (ms):                          23.30
Median TPOT (ms):                        23.31
P99 TPOT (ms):                           23.41
---------------Inter-token Latency----------------
Mean ITL (ms):                           23.30
Median ITL (ms):                         23.11
P99 ITL (ms):                            24.41
==================================================
```

### Qwen3-8B-Int8-W8A16

- 高负载

```bash
============ Serving Benchmark Result ============
Successful requests:                     100
Maximum request concurrency:             8
Benchmark duration (s):                  152.79
Total input tokens:                      204169
Total generated tokens:                  12419
Request throughput (req/s):              0.65
Output token throughput (tok/s):         81.28
Total Token throughput (tok/s):          1417.54
---------------Time to First Token----------------
Mean TTFT (ms):                          2294.06
Median TTFT (ms):                        2376.24
P99 TTFT (ms):                           5134.68
-----Time per Output Token (excl. 1st token)------
Mean TPOT (ms):                          77.95
Median TPOT (ms):                        80.18
P99 TPOT (ms):                           87.64
---------------Inter-token Latency----------------
Mean ITL (ms):                           77.95
Median ITL (ms):                         45.00
P99 ITL (ms):                            852.45
==================================================
```

- 低负载

```bash
============ Serving Benchmark Result ============
Successful requests:                     10
Maximum request concurrency:             1
Benchmark duration (s):                  46.51
Total input tokens:                      20431
Total generated tokens:                  1280
Request throughput (req/s):              0.22
Output token throughput (tok/s):         27.52
Total Token throughput (tok/s):          466.84
---------------Time to First Token----------------
Mean TTFT (ms):                          50.23
Median TTFT (ms):                        50.24
P99 TTFT (ms):                           51.65
-----Time per Output Token (excl. 1st token)------
Mean TPOT (ms):                          36.22
Median TPOT (ms):                        36.22
P99 TPOT (ms):                           36.25
---------------Inter-token Latency----------------
Mean ITL (ms):                           36.22
Median ITL (ms):                         36.24
P99 ITL (ms):                            37.03
==================================================
```

### Qwen3-8B-GGUF

- 高负载

```bash
============ Serving Benchmark Result ============
Successful requests:                     100
Maximum request concurrency:             8
Benchmark duration (s):                  1617.23
Total input tokens:                      204169
Total generated tokens:                  12800
Request throughput (req/s):              0.06
Output token throughput (tok/s):         7.91
Total Token throughput (tok/s):          134.16
---------------Time to First Token----------------
Mean TTFT (ms):                          43688.41
Median TTFT (ms):                        47162.20
P99 TTFT (ms):                           93242.93
-----Time per Output Token (excl. 1st token)------
Mean TPOT (ms):                          670.56
Median TPOT (ms):                        706.07
P99 TPOT (ms):                           830.26
---------------Inter-token Latency----------------
Mean ITL (ms):                           670.56
Median ITL (ms):                         88.76
P99 ITL (ms):                            15722.16
==================================================
```

- 低负载

```bash
============ Serving Benchmark Result ============
Successful requests:                     1
Benchmark duration (s):                  4.39
Total input tokens:                      2048
Total generated tokens:                  128
Request throughput (req/s):              0.23
Output token throughput (tok/s):         29.14
Total Token throughput (tok/s):          495.41
---------------Time to First Token----------------
Mean TTFT (ms):                          148.53
Median TTFT (ms):                        148.53
P99 TTFT (ms):                           148.53
-----Time per Output Token (excl. 1st token)------
Mean TPOT (ms):                          33.41
Median TPOT (ms):                        33.41
P99 TPOT (ms):                           33.41
---------------Inter-token Latency----------------
Mean ITL (ms):                           33.41
Median ITL (ms):                         33.34
P99 ITL (ms):                            34.03
==================================================
```

### Qwen3-32B-AWQ

- 高负载

```bash
============ Serving Benchmark Result ============
Successful requests:                     100
Maximum request concurrency:             8
Benchmark duration (s):                  459.09
Total input tokens:                      204169
Total generated tokens:                  12421
Request throughput (req/s):              0.22
Output token throughput (tok/s):         27.06
Total Token throughput (tok/s):          471.78
---------------Time to First Token----------------
Mean TTFT (ms):                          6799.32
Median TTFT (ms):                        6419.03
P99 TTFT (ms):                           19086.70
-----Time per Output Token (excl. 1st token)------
Mean TPOT (ms):                          240.60
Median TPOT (ms):                        238.28
P99 TPOT (ms):                           295.35
---------------Inter-token Latency----------------
Mean ITL (ms):                           237.24
Median ITL (ms):                         92.45
P99 ITL (ms):                            3155.36
==================================================
```

- 低负载

```bash
============ Serving Benchmark Result ============
Successful requests:                     10
Maximum request concurrency:             1
Benchmark duration (s):                  98.36
Total input tokens:                      20431
Total generated tokens:                  1280
Request throughput (req/s):              0.10
Output token throughput (tok/s):         13.01
Total Token throughput (tok/s):          220.74
---------------Time to First Token----------------
Mean TTFT (ms):                          96.62
Median TTFT (ms):                        96.92
P99 TTFT (ms):                           98.87
-----Time per Output Token (excl. 1st token)------
Mean TPOT (ms):                          76.68
Median TPOT (ms):                        76.69
P99 TPOT (ms):                           76.72
---------------Inter-token Latency----------------
Mean ITL (ms):                           76.68
Median ITL (ms):                         76.57
P99 ITL (ms):                            77.71
==================================================
```

### Qwen3-30B-A3B

- 高负载

```bash
============ Serving Benchmark Result ============
Successful requests:                     100
Maximum request concurrency:             8
Benchmark duration (s):                  180.95
Total input tokens:                      204169
Total generated tokens:                  12800
Request throughput (req/s):              0.55
Output token throughput (tok/s):         70.74
Total Token throughput (tok/s):          1199.07
---------------Time to First Token----------------
Mean TTFT (ms):                          1635.21
Median TTFT (ms):                        1486.42
P99 TTFT (ms):                           4474.52
-----Time per Output Token (excl. 1st token)------
Mean TPOT (ms):                          98.74
Median TPOT (ms):                        96.12
P99 TPOT (ms):                           130.45
---------------Inter-token Latency----------------
Mean ITL (ms):                           98.74
Median ITL (ms):                         77.16
P99 ITL (ms):                            728.40
==================================================
```

- 低负载

```bash
============ Serving Benchmark Result ============
Successful requests:                     10
Maximum request concurrency:             1
Benchmark duration (s):                  37.26
Total input tokens:                      20431
Total generated tokens:                  1280
Request throughput (req/s):              0.27
Output token throughput (tok/s):         34.36
Total Token throughput (tok/s):          582.73
---------------Time to First Token----------------
Mean TTFT (ms):                          81.13
Median TTFT (ms):                        85.54
P99 TTFT (ms):                           92.11
-----Time per Output Token (excl. 1st token)------
Mean TPOT (ms):                          28.70
Median TPOT (ms):                        28.70
P99 TPOT (ms):                           28.73
---------------Inter-token Latency----------------
Mean ITL (ms):                           28.70
Median ITL (ms):                         28.68
P99 ITL (ms):                            29.28
==================================================
```

### Qwen3-30B-A3B-FP8

- 高负载

```bash
============ Serving Benchmark Result ============
Successful requests:                     100
Maximum request concurrency:             8
Benchmark duration (s):                  112.22
Total input tokens:                      204169
Total generated tokens:                  12800
Request throughput (req/s):              0.89
Output token throughput (tok/s):         114.07
Total Token throughput (tok/s):          1933.51
---------------Time to First Token----------------
Mean TTFT (ms):                          1297.50
Median TTFT (ms):                        1305.82
P99 TTFT (ms):                           2802.43
-----Time per Output Token (excl. 1st token)------
Mean TPOT (ms):                          59.88
Median TPOT (ms):                        59.43
P99 TPOT (ms):                           76.87
---------------Inter-token Latency----------------
Mean ITL (ms):                           59.88
Median ITL (ms):                         41.25
P99 ITL (ms):                            456.73
==================================================
```

- 低负载

```bash
============ Serving Benchmark Result ============
Successful requests:                     10
Maximum request concurrency:             1
Benchmark duration (s):                  13.35
Total input tokens:                      20431
Total generated tokens:                  1280
Request throughput (req/s):              0.75
Output token throughput (tok/s):         95.91
Total Token throughput (tok/s):          1626.78
---------------Time to First Token----------------
Mean TTFT (ms):                          71.24
Median TTFT (ms):                        68.31
P99 TTFT (ms):                           94.13
-----Time per Output Token (excl. 1st token)------
Mean TPOT (ms):                          9.95
Median TPOT (ms):                        9.89
P99 TPOT (ms):                           10.33
---------------Inter-token Latency----------------
Mean ITL (ms):                           9.95
Median ITL (ms):                         9.87
P99 ITL (ms):                            11.44
==================================================
```

### Qwen3-Coder-30B-A3B-Instruct-FP8

- 高负载

```bash
============ Serving Benchmark Result ============
Successful requests:                     100
Maximum request concurrency:             8
Benchmark duration (s):                  129.15
Total input tokens:                      204169
Total generated tokens:                  12800
Request throughput (req/s):              0.77
Output token throughput (tok/s):         99.11
Total Token throughput (tok/s):          1680.01
---------------Time to First Token----------------
Mean TTFT (ms):                          1368.76
Median TTFT (ms):                        1400.81
P99 TTFT (ms):                           2779.06
-----Time per Output Token (excl. 1st token)------
Mean TPOT (ms):                          69.97
Median TPOT (ms):                        74.07
P99 TPOT (ms):                           83.47
---------------Inter-token Latency----------------
Mean ITL (ms):                           69.97
Median ITL (ms):                         57.64
P99 ITL (ms):                            481.45
==================================================
```

- 低负载

```bash
============ Serving Benchmark Result ============
Successful requests:                     10
Maximum request concurrency:             1
Benchmark duration (s):                  15.52
Total input tokens:                      20431
Total generated tokens:                  1280
Request throughput (req/s):              0.64
Output token throughput (tok/s):         82.45
Total Token throughput (tok/s):          1398.53
---------------Time to First Token----------------
Mean TTFT (ms):                          96.15
Median TTFT (ms):                        96.01
P99 TTFT (ms):                           98.57
-----Time per Output Token (excl. 1st token)------
Mean TPOT (ms):                          11.46
Median TPOT (ms):                        11.46
P99 TPOT (ms):                           11.49
---------------Inter-token Latency----------------
Mean ITL (ms):                           11.46
Median ITL (ms):                         11.41
P99 ITL (ms):                            12.12
==================================================
```

### Qwen3-Coder-30B-A3B-Instruct-AWQ-8bit

- 高负载

```bash
============ Serving Benchmark Result ============
Successful requests:                     100
Maximum request concurrency:             8
Benchmark duration (s):                  131.51
Total input tokens:                      204169
Total generated tokens:                  12800
Request throughput (req/s):              0.76
Output token throughput (tok/s):         97.33
Total Token throughput (tok/s):          1649.80
---------------Time to First Token----------------
Mean TTFT (ms):                          1665.38
Median TTFT (ms):                        1823.10
P99 TTFT (ms):                           3795.56
-----Time per Output Token (excl. 1st token)------
Mean TPOT (ms):                          68.32
Median TPOT (ms):                        69.15
P99 TPOT (ms):                           79.89
---------------Inter-token Latency----------------
Mean ITL (ms):                           68.32
Median ITL (ms):                         44.27
P99 ITL (ms):                            630.03
==================================================
```

- 低负载

```bash
============ Serving Benchmark Result ============
Successful requests:                     10
Maximum request concurrency:             1
Benchmark duration (s):                  27.37
Total input tokens:                      20431
Total generated tokens:                  1280
Request throughput (req/s):              0.37
Output token throughput (tok/s):         46.77
Total Token throughput (tok/s):          793.33
---------------Time to First Token----------------
Mean TTFT (ms):                          61.33
Median TTFT (ms):                        62.60
P99 TTFT (ms):                           71.58
-----Time per Output Token (excl. 1st token)------
Mean TPOT (ms):                          21.06
Median TPOT (ms):                        21.73
P99 TPOT (ms):                           21.80
---------------Inter-token Latency----------------
Mean ITL (ms):                           21.06
Median ITL (ms):                         21.59
P99 ITL (ms):                            22.42
==================================================
```

### Qwen3-Coder-30B-A3B-Instruct-AWQ-4bit

- 高负载

```bash
============ Serving Benchmark Result ============
Successful requests:                     100
Maximum request concurrency:             8
Benchmark duration (s):                  102.74
Total input tokens:                      204169
Total generated tokens:                  12675
Request throughput (req/s):              0.97
Output token throughput (tok/s):         123.37
Total Token throughput (tok/s):          2110.67
---------------Time to First Token----------------
Mean TTFT (ms):                          1298.94
Median TTFT (ms):                        1150.24
P99 TTFT (ms):                           3232.16
-----Time per Output Token (excl. 1st token)------
Mean TPOT (ms):                          53.75
Median TPOT (ms):                        53.71
P99 TPOT (ms):                           61.10
---------------Inter-token Latency----------------
Mean ITL (ms):                           53.79
Median ITL (ms):                         31.55
P99 ITL (ms):                            541.87
==================================================
```

- 低负载

```bash
============ Serving Benchmark Result ============
Successful requests:                     10
Maximum request concurrency:             1
Benchmark duration (s):                  20.71
Total input tokens:                      20431
Total generated tokens:                  1280
Request throughput (req/s):              0.48
Output token throughput (tok/s):         61.79
Total Token throughput (tok/s):          1048.09
---------------Time to First Token----------------
Mean TTFT (ms):                          44.06
Median TTFT (ms):                        45.90
P99 TTFT (ms):                           49.16
-----Time per Output Token (excl. 1st token)------
Mean TPOT (ms):                          15.96
Median TPOT (ms):                        15.96
P99 TPOT (ms):                           16.00
---------------Inter-token Latency----------------
Mean ITL (ms):                           15.96
Median ITL (ms):                         15.95
P99 ITL (ms):                            16.52
==================================================
```

### Qwen3-Coder-30B-A3B-Instruct-Int4-W4A16

- 高负载

```bash
============ Serving Benchmark Result ============
Successful requests:                     100
Maximum request concurrency:             8
Benchmark duration (s):                  99.27
Total input tokens:                      204169
Total generated tokens:                  12789
Request throughput (req/s):              1.01
Output token throughput (tok/s):         128.83
Total Token throughput (tok/s):          2185.54
---------------Time to First Token----------------
Mean TTFT (ms):                          1314.33
Median TTFT (ms):                        1111.64
P99 TTFT (ms):                           3123.45
-----Time per Output Token (excl. 1st token)------
Mean TPOT (ms):                          51.26
Median TPOT (ms):                        52.49
P99 TPOT (ms):                           59.17
---------------Inter-token Latency----------------
Mean ITL (ms):                           51.27
Median ITL (ms):                         30.34
P99 ITL (ms):                            523.20
==================================================
```

- 低负载

```bash
============ Serving Benchmark Result ============
Successful requests:                     10
Maximum request concurrency:             1
Benchmark duration (s):                  19.68
Total input tokens:                      20431
Total generated tokens:                  1280
Request throughput (req/s):              0.51
Output token throughput (tok/s):         65.05
Total Token throughput (tok/s):          1103.33
---------------Time to First Token----------------
Mean TTFT (ms):                          41.75
Median TTFT (ms):                        43.20
P99 TTFT (ms):                           46.20
-----Time per Output Token (excl. 1st token)------
Mean TPOT (ms):                          15.16
Median TPOT (ms):                        15.16
P99 TPOT (ms):                           15.19
---------------Inter-token Latency----------------
Mean ITL (ms):                           15.16
Median ITL (ms):                         15.15
P99 ITL (ms):                            15.68
==================================================
```


## 参考资料
- [LLM evaluation | EleutherAI lm-evaluation-harness](https://medium.com/disassembly/llm-evaluation-eleutherai-lm-evaluation-harness-cc379495d545)
- [EleutherAI/lm-evaluation-harness Tasks](https://github.com/EleutherAI/lm-evaluation-harness/tree/main/lm_eval/tasks)
