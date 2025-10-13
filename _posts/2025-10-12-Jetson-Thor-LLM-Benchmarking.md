---
layout: single
title:  "Jetson Thor 大模型推理性能基准测试"
date:   2025-10-12 06:00:00 +0800
categories: Jetson LLM
tags: [Jetson, Thor, Qwen3, Benchmark, vLLM, FP8, FP4, LLM, NVIDIA]
---


<!--more-->

## 性能基准测试

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
