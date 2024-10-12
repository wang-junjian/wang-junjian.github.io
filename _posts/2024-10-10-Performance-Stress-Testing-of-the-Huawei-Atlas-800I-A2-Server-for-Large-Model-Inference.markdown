---
layout: post
title:  "华为 Atlas 800I A2 服务器的大模型推理性能压测"
date:   2024-10-10 10:00:00 +0800
categories: Atlas800 Benchmark
tags: [EvalScope, Atlas800, NPU, MindIE, vLLM, Benchmark, LLM]
---

## 大模型推理性能压测
### 安装 [EvalScope](https://github.com/modelscope/evalscope/blob/main/README_zh.md)
```shell
git clone https://github.com/modelscope/evalscope
cd evalscope

pip install -e .
```

### 压测命令
```shell
evalscope perf \
    --api openai \
    --url 'http://127.0.0.1:1025/v1/chat/completions' \
    --model 'qwen' \
    --dataset openqa \
    --dataset-path './datasets/open_qa.jsonl' \
    --max-prompt-length 8000 \
    --stop '<|im_end|>' \
    --read-timeout=120 \
    --parallel 100 \
    -n 1000
```

❌ **--stream 不要加，经常出问题。**


## 准备[数据集 HC3-Chinese](https://modelscope.cn/datasets/AI-ModelScope/HC3-Chinese)
下载 `open_qa.jsonl` 数据集到 `datasets` 目录下。
```shell
mkdir datasets && cd datasets
wget https://modelscope.cn/datasets/AI-ModelScope/HC3-Chinese/resolve/master/open_qa.jsonl
```


## 实验结果（MindIE）

### Qwen1.5-7B-Chat

![](/images/2024/evalscope/qwen1.5-7b-chat.png)

| 指标 | 8 | 16 | 32 | 64 | 128 | 150 | 200 | 256 | 300 | 400 | 512 | 720 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 用时 | 404.284 | 215.085 | 120.876 | 82.884 | 52.844 | 48.884 | 44.856 | 42.750 | 43.729 | 42.866 | 41.655 | 40.580 |
| QPS | 2.474 | 4.649 | 8.273 | 12.065 | 18.924 | 20.457 | 22.294 | 23.392 | 22.868 | 23.328 | 24.007 | 24.643 |
| 延迟 | 3.213 | 3.391 | 3.724 | 4.974 | 6.108 | 6.517 | 7.805 | 9.208 | 10.904 | 13.628 | 16.031 | 18.790 |
| 吞吐量 | 594.929 | 1119.102 | 1989.159 | 2903.023 | 4559.489 | 4920.856 | 5354.701 | 5636.846 | 5506.567 | 5618.110 | 5772.230 | 5940.622 |
| p50 | 3.2461 | 3.4271 | 3.7514 | 5.0248 | 6.1491 | 6.5487 | 7.7782 | 9.1754 | 10.9164 | 13.9850 | 17.0675 | 20.4161 |
| p90 | 4.9771 | 5.2905 | 5.8484 | 7.7522 | 9.5705 | 10.1980 | 12.3493 | 13.6320 | 15.8667 | 19.2667 | 22.7640 | 26.8183 |

- 平均每个请求的输入 token 数: 40
- 平均每个请求的输出 token 数: 240

- parallel 8
```
Benchmarking summary: 
 Time taken for tests: 404.284 seconds
 Expected number of requests: 1000
 Number of concurrency: 8
 Total requests: 1000
 Succeed requests: 1000
 Failed requests: 0
 Average QPS: 2.474
 Average latency: 3.213
 Throughput(average output tokens per second): 594.929
 Average time to first token: 3.213
 Average input tokens per request: 40.296
 Average output tokens per request: 240.520
 Average time per output token: 0.00168
 Average package per request: 1.000
 Average package latency: 3.213
 Percentile of time to first token: 
     p50: 3.2461
     p66: 3.7587
     p75: 4.2213
     p80: 4.4208
     p90: 4.9771
     p95: 5.6460
     p98: 6.3678
     p99: 6.8545
 Percentile of request latency: 
     p50: 3.2461
     p66: 3.7587
     p75: 4.2213
     p80: 4.4208
     p90: 4.9771
     p95: 5.6460
     p98: 6.3678
     p99: 6.8545
```

- parallel 16
```
Benchmarking summary: 
 Time taken for tests: 215.085 seconds
 Expected number of requests: 1000
 Number of concurrency: 16
 Total requests: 1000
 Succeed requests: 1000
 Failed requests: 0
 Average QPS: 4.649
 Average latency: 3.391
 Throughput(average output tokens per second): 1119.102
 Average time to first token: 3.391
 Average input tokens per request: 40.296
 Average output tokens per request: 240.702
 Average time per output token: 0.00089
 Average package per request: 1.000
 Average package latency: 3.391
 Percentile of time to first token: 
     p50: 3.4271
     p66: 3.9816
     p75: 4.3792
     p80: 4.6188
     p90: 5.2905
     p95: 5.9389
     p98: 6.7555
     p99: 7.2478
 Percentile of request latency: 
     p50: 3.4271
     p66: 3.9816
     p75: 4.3792
     p80: 4.6188
     p90: 5.2905
     p95: 5.9389
     p98: 6.7555
     p99: 7.2478
```

- parallel 32
```
Benchmarking summary: 
 Time taken for tests: 120.876 seconds
 Expected number of requests: 1000
 Number of concurrency: 32
 Total requests: 1000
 Succeed requests: 1000
 Failed requests: 0
 Average QPS: 8.273
 Average latency: 3.724
 Throughput(average output tokens per second): 1989.159
 Average time to first token: 3.724
 Average input tokens per request: 40.296
 Average output tokens per request: 240.442
 Average time per output token: 0.00050
 Average package per request: 1.000
 Average package latency: 3.724
 Percentile of time to first token: 
     p50: 3.7514
     p66: 4.3989
     p75: 4.8352
     p80: 5.1087
     p90: 5.8484
     p95: 6.5664
     p98: 7.3057
     p99: 8.0644
 Percentile of request latency: 
     p50: 3.7514
     p66: 4.3989
     p75: 4.8352
     p80: 5.1087
     p90: 5.8484
     p95: 6.5664
     p98: 7.3057
     p99: 8.0644
```

- parallel 64
```
Benchmarking summary: 
 Time taken for tests: 82.884 seconds
 Expected number of requests: 1000
 Number of concurrency: 64
 Total requests: 1000
 Succeed requests: 1000
 Failed requests: 0
 Average QPS: 12.065
 Average latency: 4.974
 Throughput(average output tokens per second): 2903.023
 Average time to first token: 4.974
 Average input tokens per request: 40.296
 Average output tokens per request: 240.615
 Average time per output token: 0.00034
 Average package per request: 1.000
 Average package latency: 4.974
 Percentile of time to first token: 
     p50: 5.0248
     p66: 5.8985
     p75: 6.4676
     p80: 6.8351
     p90: 7.7522
     p95: 8.8266
     p98: 9.9534
     p99: 10.6036
 Percentile of request latency: 
     p50: 5.0248
     p66: 5.8985
     p75: 6.4676
     p80: 6.8351
     p90: 7.7522
     p95: 8.8266
     p98: 9.9534
     p99: 10.6036
```

- parallel 128
```
Benchmarking summary: 
 Time taken for tests: 52.844 seconds
 Expected number of requests: 1000
 Number of concurrency: 128
 Total requests: 1000
 Succeed requests: 1000
 Failed requests: 0
 Average QPS: 18.924
 Average latency: 6.108
 Throughput(average output tokens per second): 4559.489
 Average time to first token: 6.108
 Average input tokens per request: 40.296
 Average output tokens per request: 240.943
 Average time per output token: 0.00022
 Average package per request: 1.000
 Average package latency: 6.108
 Percentile of time to first token: 
     p50: 6.1491
     p66: 7.2622
     p75: 7.9560
     p80: 8.3894
     p90: 9.5705
     p95: 10.7209
     p98: 12.2300
     p99: 13.1657
 Percentile of request latency: 
     p50: 6.1491
     p66: 7.2622
     p75: 7.9560
     p80: 8.3894
     p90: 9.5705
     p95: 10.7209
     p98: 12.2300
     p99: 13.1657
```

- parallel 150
```
Benchmarking summary: 
 Time taken for tests: 48.884 seconds
 Expected number of requests: 1000
 Number of concurrency: 150
 Total requests: 1000
 Succeed requests: 1000
 Failed requests: 0
 Average QPS: 20.457
 Average latency: 6.517
 Throughput(average output tokens per second): 4920.856
 Average time to first token: 6.517
 Average input tokens per request: 40.296
 Average output tokens per request: 240.550
 Average time per output token: 0.00020
 Average package per request: 1.000
 Average package latency: 6.517
 Percentile of time to first token: 
     p50: 6.5487
     p66: 7.7580
     p75: 8.4394
     p80: 8.9248
     p90: 10.1980
     p95: 11.4446
     p98: 13.0906
     p99: 13.7333
 Percentile of request latency: 
     p50: 6.5487
     p66: 7.7580
     p75: 8.4394
     p80: 8.9248
     p90: 10.1980
     p95: 11.4446
     p98: 13.0906
     p99: 13.7333
```

- parallel 200
```
Benchmarking summary: 
 Time taken for tests: 44.856 seconds
 Expected number of requests: 1000
 Number of concurrency: 200
 Total requests: 1000
 Succeed requests: 1000
 Failed requests: 0
 Average QPS: 22.294
 Average latency: 7.805
 Throughput(average output tokens per second): 5354.701
 Average time to first token: 7.805
 Average input tokens per request: 40.296
 Average output tokens per request: 240.188
 Average time per output token: 0.00019
 Average package per request: 1.000
 Average package latency: 7.805
 Percentile of time to first token: 
     p50: 7.7782
     p66: 9.2457
     p75: 10.0596
     p80: 10.8689
     p90: 12.3493
     p95: 13.7108
     p98: 15.1361
     p99: 16.3464
 Percentile of request latency: 
     p50: 7.7782
     p66: 9.2457
     p75: 10.0596
     p80: 10.8689
     p90: 12.3493
     p95: 13.7108
     p98: 15.1361
     p99: 16.3464
```

- parallel 256
```
Benchmarking summary: 
 Time taken for tests: 42.750 seconds
 Expected number of requests: 1000
 Number of concurrency: 256
 Total requests: 1000
 Succeed requests: 1000
 Failed requests: 0
 Average QPS: 23.392
 Average latency: 9.208
 Throughput(average output tokens per second): 5636.846
 Average time to first token: 9.208
 Average input tokens per request: 40.296
 Average output tokens per request: 240.975
 Average time per output token: 0.00018
 Average package per request: 1.000
 Average package latency: 9.208
 Percentile of time to first token: 
     p50: 9.1754
     p66: 10.6423
     p75: 11.5348
     p80: 12.1507
     p90: 13.6320
     p95: 14.9237
     p98: 16.5329
     p99: 18.0215
 Percentile of request latency: 
     p50: 9.1754
     p66: 10.6423
     p75: 11.5348
     p80: 12.1507
     p90: 13.6320
     p95: 14.9237
     p98: 16.5329
     p99: 18.0215
```

- parallel 300
```
Benchmarking summary: 
 Time taken for tests: 43.729 seconds
 Expected number of requests: 1000
 Number of concurrency: 300
 Total requests: 1000
 Succeed requests: 1000
 Failed requests: 0
 Average QPS: 22.868
 Average latency: 10.904
 Throughput(average output tokens per second): 5506.567
 Average time to first token: 10.904
 Average input tokens per request: 40.296
 Average output tokens per request: 240.795
 Average time per output token: 0.00018
 Average package per request: 1.000
 Average package latency: 10.904
 Percentile of time to first token: 
     p50: 10.9164
     p66: 12.5896
     p75: 13.6076
     p80: 14.2442
     p90: 15.8667
     p95: 17.2967
     p98: 18.8841
     p99: 20.2304
 Percentile of request latency: 
     p50: 10.9164
     p66: 12.5896
     p75: 13.6076
     p80: 14.2442
     p90: 15.8667
     p95: 17.2967
     p98: 18.8841
     p99: 20.2304
```

- parallel 400
```
Benchmarking summary: 
 Time taken for tests: 42.866 seconds
 Expected number of requests: 1000
 Number of concurrency: 400
 Total requests: 1000
 Succeed requests: 1000
 Failed requests: 0
 Average QPS: 23.328
 Average latency: 13.628
 Throughput(average output tokens per second): 5618.110
 Average time to first token: 13.628
 Average input tokens per request: 40.296
 Average output tokens per request: 240.828
 Average time per output token: 0.00018
 Average package per request: 1.000
 Average package latency: 13.628
 Percentile of time to first token: 
     p50: 13.9850
     p66: 15.7791
     p75: 16.8451
     p80: 17.6249
     p90: 19.2667
     p95: 20.8091
     p98: 22.5674
     p99: 23.6675
 Percentile of request latency: 
     p50: 13.9850
     p66: 15.7791
     p75: 16.8451
     p80: 17.6249
     p90: 19.2667
     p95: 20.8091
     p98: 22.5674
     p99: 23.6675
```

- parallel 512
```
Benchmarking summary: 
 Time taken for tests: 41.655 seconds
 Expected number of requests: 1000
 Number of concurrency: 512
 Total requests: 1000
 Succeed requests: 1000
 Failed requests: 0
 Average QPS: 24.007
 Average latency: 16.031
 Throughput(average output tokens per second): 5772.230
 Average time to first token: 16.031
 Average input tokens per request: 40.296
 Average output tokens per request: 240.440
 Average time per output token: 0.00017
 Average package per request: 1.000
 Average package latency: 16.031
 Percentile of time to first token: 
     p50: 17.0675
     p66: 18.9757
     p75: 20.0632
     p80: 20.8715
     p90: 22.7640
     p95: 24.0828
     p98: 25.3913
     p99: 26.6549
 Percentile of request latency: 
     p50: 17.0675
     p66: 18.9757
     p75: 20.0632
     p80: 20.8715
     p90: 22.7640
     p95: 24.0828
     p98: 25.3913
     p99: 26.6549
```

- parallel 720
```
Benchmarking summary: 
 Time taken for tests: 40.580 seconds
 Expected number of requests: 1000
 Number of concurrency: 720
 Total requests: 1000
 Succeed requests: 1000
 Failed requests: 0
 Average QPS: 24.643
 Average latency: 18.790
 Throughput(average output tokens per second): 5940.622
 Average time to first token: 18.790
 Average input tokens per request: 40.296
 Average output tokens per request: 241.071
 Average time per output token: 0.00017
 Average package per request: 1.000
 Average package latency: 18.790
 Percentile of time to first token: 
     p50: 20.4161
     p66: 22.8199
     p75: 24.1332
     p80: 24.8298
     p90: 26.8183
     p95: 28.8718
     p98: 30.2479
     p99: 31.1723
 Percentile of request latency: 
     p50: 20.4161
     p66: 22.8199
     p75: 24.1332
     p80: 24.8298
     p90: 26.8183
     p95: 28.8718
     p98: 30.2479
     p99: 31.1723
```

### Qwen1.5-14B-Chat

![](/images/2024/evalscope/qwen1.5-14b-chat.png)

| 指标 | 8 | 16 | 32 | 64 | 128 | 150 | 200 | 256 | 512 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 用时 | 578.571 | 361.169 | 253.040 | 204.961 | 170.001 | 169.981 | 162.999 | 159.840 | 153.937 |
| QPS | 1.727 | 2.766 | 3.952 | 4.874 | 5.882 | 5.877 | 6.129 | 6.250 | 6.490 |
| 延迟 | 3.712 | 3.928 | 4.581 | 5.628 | 7.223 | 8.004 | 9.205 | 11.446 | 22.695 |
| 吞吐量 | 480.043 | 897.511 | 915.133 | 2333.955 | 1363.656 | 3621.096 | 4310.525 | 4333.013 | 3806.748 |
| p50 | 3.7038 | 3.9261 | 4.4544 | 5.6047 | 7.0534 | 7.9484 | 9.0271 | 11.3066 | 23.6591 |
| p90 | 5.7184 | 6.0562 | 6.9198 | 8.7597 | 11.1194 | 12.5181 | 14.5017 | 16.8646 | 33.3052 |

- parallel 8
```
Benchmarking summary: 
 Time taken for tests: 578.571 seconds
 Expected number of requests: 1000
 Number of concurrency: 8
 Total requests: 1000
 Succeed requests: 999
 Failed requests: 1
 Average QPS: 1.727
 Average latency: 3.712
 Throughput(average output tokens per second): 480.043
 Average time to first token: 3.712
 Average input tokens per request: 40.287
 Average output tokens per request: 224.138
 Average time per output token: 0.00208
 Average package per request: 1.000
 Average package latency: 3.712
 Percentile of time to first token: 
     p50: 3.7038
     p66: 4.4215
     p75: 4.8051
     p80: 5.0476
     p90: 5.7184
     p95: 6.2956
     p98: 7.0707
     p99: 7.4415
 Percentile of request latency: 
     p50: 3.7038
     p66: 4.4215
     p75: 4.8051
     p80: 5.0476
     p90: 5.7184
     p95: 6.2956
     p98: 7.0707
     p99: 7.4415
```

- parallel 16
```
Benchmarking summary: 
 Time taken for tests: 361.169 seconds
 Expected number of requests: 1000
 Number of concurrency: 16
 Total requests: 1000
 Succeed requests: 999
 Failed requests: 1
 Average QPS: 2.766
 Average latency: 3.928
 Throughput(average output tokens per second): 897.511
 Average time to first token: 3.928
 Average input tokens per request: 40.287
 Average output tokens per request: 223.750
 Average time per output token: 0.00111
 Average package per request: 1.000
 Average package latency: 3.928
 Percentile of time to first token: 
     p50: 3.9261
     p66: 4.6890
     p75: 5.1204
     p80: 5.3290
     p90: 6.0562
     p95: 6.6784
     p98: 7.3113
     p99: 7.8980
 Percentile of request latency: 
     p50: 3.9261
     p66: 4.6890
     p75: 5.1204
     p80: 5.3290
     p90: 6.0562
     p95: 6.6784
     p98: 7.3113
     p99: 7.8980
```

- parallel 32
```
Benchmarking summary: 
 Time taken for tests: 253.040 seconds
 Expected number of requests: 1000
 Number of concurrency: 32
 Total requests: 1000
 Succeed requests: 1000
 Failed requests: 0
 Average QPS: 3.952
 Average latency: 4.581
 Throughput(average output tokens per second): 915.133
 Average time to first token: 4.581
 Average input tokens per request: 40.296
 Average output tokens per request: 231.565
 Average time per output token: 0.00109
 Average package per request: 1.000
 Average package latency: 4.581
 Percentile of time to first token: 
     p50: 4.4544
     p66: 5.2905
     p75: 5.8235
     p80: 6.1074
     p90: 6.9198
     p95: 7.5185
     p98: 8.5143
     p99: 9.3296
 Percentile of request latency: 
     p50: 4.4544
     p66: 5.2905
     p75: 5.8235
     p80: 6.1074
     p90: 6.9198
     p95: 7.5185
     p98: 8.5143
     p99: 9.3296
```

- parallel 64
```
Benchmarking summary: 
 Time taken for tests: 204.961 seconds
 Expected number of requests: 1000
 Number of concurrency: 64
 Total requests: 1000
 Succeed requests: 999
 Failed requests: 1
 Average QPS: 4.874
 Average latency: 5.628
 Throughput(average output tokens per second): 2333.955
 Average time to first token: 5.628
 Average input tokens per request: 40.287
 Average output tokens per request: 223.930
 Average time per output token: 0.00043
 Average package per request: 1.000
 Average package latency: 5.628
 Percentile of time to first token: 
     p50: 5.6047
     p66: 6.6600
     p75: 7.3423
     p80: 7.7040
     p90: 8.7597
     p95: 9.6390
     p98: 10.7844
     p99: 11.6003
 Percentile of request latency: 
     p50: 5.6047
     p66: 6.6600
     p75: 7.3423
     p80: 7.7040
     p90: 8.7597
     p95: 9.6390
     p98: 10.7844
     p99: 11.6003
```

- parallel 128
```
Benchmarking summary: 
 Time taken for tests: 170.001 seconds
 Expected number of requests: 1000
 Number of concurrency: 128
 Total requests: 1000
 Succeed requests: 1000
 Failed requests: 0
 Average QPS: 5.882
 Average latency: 7.223
 Throughput(average output tokens per second): 1363.656
 Average time to first token: 7.223
 Average input tokens per request: 40.296
 Average output tokens per request: 231.823
 Average time per output token: 0.00073
 Average package per request: 1.000
 Average package latency: 7.223
 Percentile of time to first token: 
     p50: 7.0534
     p66: 8.4098
     p75: 9.3191
     p80: 9.7640
     p90: 11.1194
     p95: 12.2800
     p98: 13.8248
     p99: 14.6733
 Percentile of request latency: 
     p50: 7.0534
     p66: 8.4098
     p75: 9.3191
     p80: 9.7640
     p90: 11.1194
     p95: 12.2800
     p98: 13.8248
     p99: 14.6733
```

- parallel 150
```
Benchmarking summary: 
 Time taken for tests: 169.981 seconds
 Expected number of requests: 1000
 Number of concurrency: 150
 Total requests: 1000
 Succeed requests: 999
 Failed requests: 1
 Average QPS: 5.877
 Average latency: 8.004
 Throughput(average output tokens per second): 3621.096
 Average time to first token: 8.004
 Average input tokens per request: 40.287
 Average output tokens per request: 224.225
 Average time per output token: 0.00028
 Average package per request: 1.000
 Average package latency: 8.004
 Percentile of time to first token: 
     p50: 7.9484
     p66: 9.3969
     p75: 10.5065
     p80: 11.0508
     p90: 12.5181
     p95: 13.6289
     p98: 15.3693
     p99: 16.5225
 Percentile of request latency: 
     p50: 7.9484
     p66: 9.3969
     p75: 10.5065
     p80: 11.0508
     p90: 12.5181
     p95: 13.6289
     p98: 15.3693
     p99: 16.5225
```

- parallel 200
```
Benchmarking summary: 
 Time taken for tests: 162.999 seconds
 Expected number of requests: 1000
 Number of concurrency: 200
 Total requests: 1000
 Succeed requests: 999
 Failed requests: 1
 Average QPS: 6.129
 Average latency: 9.205
 Throughput(average output tokens per second): 4310.525
 Average time to first token: 9.205
 Average input tokens per request: 40.287
 Average output tokens per request: 223.865
 Average time per output token: 0.00023
 Average package per request: 1.000
 Average package latency: 9.205
 Percentile of time to first token: 
     p50: 9.0271
     p66: 10.8104
     p75: 12.0957
     p80: 12.8212
     p90: 14.5017
     p95: 15.7233
     p98: 17.6891
     p99: 19.2401
 Percentile of request latency: 
     p50: 9.0271
     p66: 10.8104
     p75: 12.0957
     p80: 12.8212
     p90: 14.5017
     p95: 15.7233
     p98: 17.6891
     p99: 19.2401
```

- parallel 256
```
Benchmarking summary: 
 Time taken for tests: 159.840 seconds
 Expected number of requests: 1000
 Number of concurrency: 256
 Total requests: 1000
 Succeed requests: 999
 Failed requests: 1
 Average QPS: 6.250
 Average latency: 11.446
 Throughput(average output tokens per second): 4333.013
 Average time to first token: 11.446
 Average input tokens per request: 40.287
 Average output tokens per request: 224.384
 Average time per output token: 0.00023
 Average package per request: 1.000
 Average package latency: 11.446
 Percentile of time to first token: 
     p50: 11.3066
     p66: 13.1698
     p75: 14.4698
     p80: 15.2733
     p90: 16.8646
     p95: 18.3524
     p98: 20.0468
     p99: 21.3758
 Percentile of request latency: 
     p50: 11.3066
     p66: 13.1698
     p75: 14.4698
     p80: 15.2733
     p90: 16.8646
     p95: 18.3524
     p98: 20.0468
     p99: 21.3758
```

- parallel 512
```
Benchmarking summary: 
 Time taken for tests: 153.937 seconds
 Expected number of requests: 1000
 Number of concurrency: 512
 Total requests: 1000
 Succeed requests: 999
 Failed requests: 1
 Average QPS: 6.490
 Average latency: 22.695
 Throughput(average output tokens per second): 3806.748
 Average time to first token: 22.695
 Average input tokens per request: 40.287
 Average output tokens per request: 224.177
 Average time per output token: 0.00026
 Average package per request: 1.000
 Average package latency: 22.695
 Percentile of time to first token: 
     p50: 23.6591
     p66: 27.2753
     p75: 29.3330
     p80: 30.5309
     p90: 33.3052
     p95: 35.7777
     p98: 37.4897
     p99: 38.1186
 Percentile of request latency: 
     p50: 23.6591
     p66: 27.2753
     p75: 29.3330
     p80: 30.5309
     p90: 33.3052
     p95: 35.7777
     p98: 37.4897
     p99: 38.1186
```

### Qwen2-72B-Chat

![](/images/2024/evalscope/qwen2-72b-chat.png)

| 指标 | 8 | 16 | 32 | 64 | 128 | 150 | 200 | 256 | 512 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 用时 | 1569.707 | 909.001 | 567.479 | 382.247 | 179.015 | 270.054 | 251.060 | 237.063 | 206.734 |
| QPS | 0.636 | 1.099 | 1.759 | 2.613 | 5.586 | 3.699 | 3.975 | 4.214 | 4.832 |
| 延迟 | 11.705 | 12.806 | 14.526 | 17.296 | 21.041 | 23.856 | 28.198 | 33.176 | 59.912 |
| 吞吐量 | 188.589 | 342.764 | 588.262 | 973.795 | 1549.069 | 1595.176 | 1748.784 | 1866.155 | 1828.363 |
| p50 | 11.8443 | 12.8275 | 14.7115 | 17.5290 | 21.3863 | 23.8551 | 28.4407 | 32.7329 | 63.0404 |
| p90 | 16.2106 | 17.5466 | 20.0371 | 23.9890 | 29.5537 | 33.7459 | 40.4210 | 45.7666 | 81.6602 |

- 平均每个请求的输入 token 数: 40
- 平均每个请求的输出 token 数: 277

- parallel 8
```
Benchmarking summary: 
 Time taken for tests: 1569.707 seconds
 Expected number of requests: 1000
 Number of concurrency: 8
 Total requests: 1000
 Succeed requests: 999
 Failed requests: 1
 Average QPS: 0.636
 Average latency: 11.705
 Throughput(average output tokens per second): 188.589
 Average time to first token: 11.705
 Average input tokens per request: 40.303
 Average output tokens per request: 277.618
 Average time per output token: 0.00530
 Average package per request: 1.000
 Average package latency: 11.705
 Percentile of time to first token: 
     p50: 11.8443
     p66: 13.1671
     p75: 13.9665
     p80: 14.5981
     p90: 16.2106
     p95: 17.8844
     p98: 20.0471
     p99: 23.0309
 Percentile of request latency: 
     p50: 11.8443
     p66: 13.1671
     p75: 13.9665
     p80: 14.5981
     p90: 16.2106
     p95: 17.8844
     p98: 20.0471
     p99: 23.0309
```

- parallel 16
```
Benchmarking summary: 
 Time taken for tests: 909.001 seconds
 Expected number of requests: 1000
 Number of concurrency: 16
 Total requests: 1000
 Succeed requests: 999
 Failed requests: 1
 Average QPS: 1.099
 Average latency: 12.806
 Throughput(average output tokens per second): 342.764
 Average time to first token: 12.806
 Average input tokens per request: 40.303
 Average output tokens per request: 278.224
 Average time per output token: 0.00292
 Average package per request: 1.000
 Average package latency: 12.806
 Percentile of time to first token: 
     p50: 12.8275
     p66: 14.3998
     p75: 15.3983
     p80: 16.1443
     p90: 17.5466
     p95: 19.6906
     p98: 22.2533
     p99: 25.1283
 Percentile of request latency: 
     p50: 12.8275
     p66: 14.3998
     p75: 15.3983
     p80: 16.1443
     p90: 17.5466
     p95: 19.6906
     p98: 22.2533
     p99: 25.1283
```

- parallel 32
```
Benchmarking summary: 
 Time taken for tests: 567.479 seconds
 Expected number of requests: 1000
 Number of concurrency: 32
 Total requests: 1000
 Succeed requests: 998
 Failed requests: 2
 Average QPS: 1.759
 Average latency: 14.526
 Throughput(average output tokens per second): 588.262
 Average time to first token: 14.526
 Average input tokens per request: 40.297
 Average output tokens per request: 277.259
 Average time per output token: 0.00170
 Average package per request: 1.000
 Average package latency: 14.526
 Percentile of time to first token: 
     p50: 14.7115
     p66: 16.2993
     p75: 17.4013
     p80: 18.2002
     p90: 20.0371
     p95: 21.8216
     p98: 24.5539
     p99: 27.3373
 Percentile of request latency: 
     p50: 14.7115
     p66: 16.2993
     p75: 17.4013
     p80: 18.2002
     p90: 20.0371
     p95: 21.8216
     p98: 24.5539
     p99: 27.3373
```

- parallel 64
```
Benchmarking summary: 
 Time taken for tests: 382.247 seconds
 Expected number of requests: 1000
 Number of concurrency: 64
 Total requests: 1000
 Succeed requests: 999
 Failed requests: 1
 Average QPS: 2.613
 Average latency: 17.296
 Throughput(average output tokens per second): 973.795
 Average time to first token: 17.296
 Average input tokens per request: 40.303
 Average output tokens per request: 276.968
 Average time per output token: 0.00103
 Average package per request: 1.000
 Average package latency: 17.296
 Percentile of time to first token: 
     p50: 17.5290
     p66: 19.5218
     p75: 20.7063
     p80: 21.6443
     p90: 23.9890
     p95: 26.0998
     p98: 29.7887
     p99: 32.3975
 Percentile of request latency: 
     p50: 17.5290
     p66: 19.5218
     p75: 20.7063
     p80: 21.6443
     p90: 23.9890
     p95: 26.0998
     p98: 29.7887
     p99: 32.3975
```

- parallel 128
```
Benchmarking summary: 
 Time taken for tests: 179.015 seconds
 Expected number of requests: 1000
 Number of concurrency: 128
 Total requests: 1000
 Succeed requests: 1000
 Failed requests: 0
 Average QPS: 5.586
 Average latency: 21.041
 Throughput(average output tokens per second): 1549.069
 Average time to first token: 21.041
 Average input tokens per request: 40.296
 Average output tokens per request: 277.307
 Average time per output token: 0.00065
 Average package per request: 1.000
 Average package latency: 21.041
 Percentile of time to first token: 
     p50: 21.3863
     p66: 23.7687
     p75: 25.1877
     p80: 26.3636
     p90: 29.5537
     p95: 32.3925
     p98: 36.5261
     p99: 39.3924
 Percentile of request latency: 
     p50: 21.3863
     p66: 23.7687
     p75: 25.1877
     p80: 26.3636
     p90: 29.5537
     p95: 32.3925
     p98: 36.5261
     p99: 39.3924
```

- parallel 150
```
Benchmarking summary: 
 Time taken for tests: 270.054 seconds
 Expected number of requests: 1000
 Number of concurrency: 150
 Total requests: 1000
 Succeed requests: 999
 Failed requests: 1
 Average QPS: 3.699
 Average latency: 23.856
 Throughput(average output tokens per second): 1595.176
 Average time to first token: 23.856
 Average input tokens per request: 40.303
 Average output tokens per request: 277.760
 Average time per output token: 0.00063
 Average package per request: 1.000
 Average package latency: 23.856
 Percentile of time to first token: 
     p50: 23.8551
     p66: 26.6484
     p75: 28.7350
     p80: 29.8586
     p90: 33.7459
     p95: 36.6390
     p98: 41.2772
     p99: 47.8515
 Percentile of request latency: 
     p50: 23.8551
     p66: 26.6484
     p75: 28.7350
     p80: 29.8586
     p90: 33.7459
     p95: 36.6390
     p98: 41.2772
     p99: 47.8515
```

- parallel 200
```
Benchmarking summary: 
 Time taken for tests: 251.060 seconds
 Expected number of requests: 1000
 Number of concurrency: 200
 Total requests: 1000
 Succeed requests: 998
 Failed requests: 2
 Average QPS: 3.975
 Average latency: 28.198
 Throughput(average output tokens per second): 1748.784
 Average time to first token: 28.198
 Average input tokens per request: 40.308
 Average output tokens per request: 276.789
 Average time per output token: 0.00057
 Average package per request: 1.000
 Average package latency: 28.198
 Percentile of time to first token: 
     p50: 28.4407
     p66: 31.6658
     p75: 34.0785
     p80: 35.5489
     p90: 40.4210
     p95: 43.0363
     p98: 48.1876
     p99: 52.8204
 Percentile of request latency: 
     p50: 28.4407
     p66: 31.6658
     p75: 34.0785
     p80: 35.5489
     p90: 40.4210
     p95: 43.0363
     p98: 48.1876
     p99: 52.8204
```

- parallel 256
```
Benchmarking summary: 
 Time taken for tests: 237.063 seconds
 Expected number of requests: 1000
 Number of concurrency: 256
 Total requests: 1000
 Succeed requests: 999
 Failed requests: 1
 Average QPS: 4.214
 Average latency: 33.176
 Throughput(average output tokens per second): 1866.155
 Average time to first token: 33.176
 Average input tokens per request: 40.303
 Average output tokens per request: 276.399
 Average time per output token: 0.00054
 Average package per request: 1.000
 Average package latency: 33.176
 Percentile of time to first token: 
     p50: 32.7329
     p66: 37.0212
     p75: 39.6246
     p80: 41.3947
     p90: 45.7666
     p95: 49.4765
     p98: 54.4858
     p99: 58.0206
 Percentile of request latency: 
     p50: 32.7329
     p66: 37.0212
     p75: 39.6246
     p80: 41.3947
     p90: 45.7666
     p95: 49.4765
     p98: 54.4858
     p99: 58.0206
```

- parallel 512
```
Benchmarking summary: 
 Time taken for tests: 206.734 seconds
 Expected number of requests: 1000
 Number of concurrency: 512
 Total requests: 1000
 Succeed requests: 999
 Failed requests: 1
 Average QPS: 4.832
 Average latency: 59.912
 Throughput(average output tokens per second): 1828.363
 Average time to first token: 59.912
 Average input tokens per request: 40.303
 Average output tokens per request: 277.592
 Average time per output token: 0.00055
 Average package per request: 1.000
 Average package latency: 59.912
 Percentile of time to first token: 
     p50: 63.0404
     p66: 69.5273
     p75: 73.3044
     p80: 75.7455
     p90: 81.6602
     p95: 87.3050
     p98: 92.2078
     p99: 97.6189
 Percentile of request latency: 
     p50: 63.0404
     p66: 69.5273
     p75: 73.3044
     p80: 75.7455
     p90: 81.6602
     p95: 87.3050
     p98: 92.2078
     p99: 97.6189
```

### 绘图代码
```python
import matplotlib.pyplot as plt
from matplotlib.font_manager import FontProperties

# 设置中文字体
font_path =  '/System/Library/Fonts/Hiragino Sans GB.ttc' # 替换为你的字体文件路径
font_prop = FontProperties(fname=font_path)

# 数据: Qwen1.5-7B-Chat
concurrency = [8, 16, 32, 64, 128, 150, 200, 256, 300, 400, 512, 720]
time = [404.284, 215.085, 120.876, 82.884, 52.844, 48.884, 44.856, 42.750, 43.729, 42.866, 41.655, 40.580]
qps = [2.474, 4.649, 8.273, 12.065, 18.924, 20.457, 22.294, 23.392, 22.868, 23.328, 24.007, 24.643]
latency = [3.213, 3.391, 3.724, 4.974, 6.108, 6.517, 7.805, 9.208, 10.904, 13.628, 16.031, 18.790]
throughput = [594.929, 1119.102, 1989.159, 2903.023, 4559.489, 4920.856, 5354.701, 5636.846, 5506.567, 5618.110, 5772.230, 5940.622]
p50 = [3.2461, 3.4271, 3.7514, 5.0248, 6.1491, 6.5487, 7.7782, 9.1754, 10.9164, 13.9850, 17.0675, 20.4161]
p90 = [4.9771, 5.2905, 5.8484, 7.7522, 9.5705, 10.1980, 12.3493, 13.6320, 15.8667, 19.2667, 22.7640, 26.8183]

# 数据: Qwen1.5-14B-Chat
# concurrency = [8, 16, 32, 64, 128, 150, 200, 256, 512]
# time = [578.571, 361.169, 253.040, 204.961, 170.001, 169.981, 162.999, 159.840, 153.937]
# qps = [1.727, 2.766, 3.952, 4.874, 5.882, 5.877, 6.129, 6.250, 6.490]
# latency = [3.712, 3.928, 4.581, 5.628, 7.223, 8.004, 9.205, 11.446, 22.695]
# throughput = [480.043, 897.511, 915.133, 2333.955, 1363.656, 3621.096, 4310.525, 4333.013, 3806.748]
# p50 = [3.7038, 3.9261, 4.4544, 5.6047, 7.0534, 7.9484, 9.0271, 11.3066, 23.6591]
# p90 = [5.7184, 6.0562, 6.9198, 8.7597, 11.1194, 12.5181, 14.5017, 16.8646, 33.3052]

# 数据: Qwen2-72B-Chat
# concurrency = [8, 16, 32, 64, 128, 150, 200, 256, 512]
# time = [1569.707, 909.001, 567.479, 382.247, 179.015, 270.054, 251.060, 237.063, 206.734]
# qps = [0.636, 1.099, 1.759, 2.613, 5.586, 3.699, 3.975, 4.214, 4.832]
# latency = [11.705, 12.806, 14.526, 17.296, 21.041, 23.856, 28.198, 33.176, 59.912]
# throughput = [188.589, 342.764, 588.262, 973.795, 1549.069, 1595.176, 1748.784, 1866.155, 1828.363]
# p50 = [11.8443, 12.8275, 14.7115, 17.5290, 21.3863, 23.8551, 28.4407, 32.7329, 63.0404]
# p90 = [16.2106, 17.5466, 20.0371, 23.9890, 29.5537, 33.7459, 40.4210, 45.7666, 81.6602]


# 绘制曲线
plt.figure(figsize=(12, 8))

# 用时 vs 并行数
plt.subplot(2, 3, 1)
plt.plot(concurrency, time, marker='o')
plt.title('用时 vs 并行数', fontproperties=font_prop)
plt.xlabel('并行数', fontproperties=font_prop)
plt.ylabel('用时 (秒)', fontproperties=font_prop)

# QPS vs 并行数
plt.subplot(2, 3, 2)
plt.plot(concurrency, qps, marker='o')
plt.title('QPS vs 并行数', fontproperties=font_prop)
plt.xlabel('并行数', fontproperties=font_prop)
plt.ylabel('QPS', fontproperties=font_prop)

# 延迟 vs 并行数
plt.subplot(2, 3, 3)
plt.plot(concurrency, latency, marker='o')
plt.title('延迟 vs 并行数', fontproperties=font_prop)
plt.xlabel('并行数', fontproperties=font_prop)
plt.ylabel('延迟 (秒)', fontproperties=font_prop)

# 吞吐量 vs 并行数
plt.subplot(2, 3, 4)
plt.plot(concurrency, throughput, marker='o')
plt.title('吞吐量 vs 并行数', fontproperties=font_prop)
plt.xlabel('并行数', fontproperties=font_prop)
plt.ylabel('吞吐量 (每秒输出的token数)', fontproperties=font_prop)

# p50 vs 并行数
plt.subplot(2, 3, 5)
plt.plot(concurrency, p50, marker='o')
plt.title('p50 vs 并行数', fontproperties=font_prop)
plt.xlabel('并行数', fontproperties=font_prop)
plt.ylabel('p50 (秒)', fontproperties=font_prop)

# p90 vs 并行数
plt.subplot(2, 3, 6)
plt.plot(concurrency, p90, marker='o')
plt.title('p90 vs 并行数', fontproperties=font_prop)
plt.xlabel('并行数', fontproperties=font_prop)
plt.ylabel('p90 (秒)', fontproperties=font_prop)

# 显示图表
plt.tight_layout()
plt.show()
```


## 实验结果（vLLM）

### Qwen1.5-7B-Chat

![](/images/2024/evalscope/qwen1.5-7b-chat_vllm.png)

| 指标 | 8 | 16 | 32 | 64 | 100 | 128 | 150 | 200 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 用时 | 2555.302 | 1355.736 | 800.953 | 515.309 | 403.138 | 375.187 | 386.202 | 355.307 |
| QPS | 0.391 | 0.738 | 1.249 | 1.941 | 2.481 | 2.660 | 2.569 | 2.730 |
| 延迟 | 20.326 | 21.475 | 24.877 | 31.015 | 37.778 | 43.181 | 52.514 | 61.304 |
| 吞吐量 | 94.803 | 177.014 | 300.603 | 469.235 | 595.103 | 638.980 | 612.597 | 640.172 |
| p50 | 20.5326 | 21.6749 | 24.9076 | 31.2051 | 37.8700 | 42.3652 | 52.1732 | 61.0796 |
| p90 | 31.8381 | 33.7150 | 38.8008 | 48.5248 | 59.2335 | 68.8249 | 84.6935 | 96.6051 |
| ❌ |  |  |  |  |  |  | 6 | 28 |

- 平均每个请求的输入 token 数: 40
- 平均每个请求的输出 token 数: 240

```py
# 数据
concurrency = [8, 16, 32, 64, 100, 128, 150, 200]
time = [2555.302, 1355.736, 800.953, 515.309, 403.138, 375.187, 386.202, 355.307]
qps = [0.391, 0.738, 1.249, 1.941, 2.481, 2.660, 2.569, 2.730]
latency = [20.326, 21.475, 24.877, 31.015, 37.778, 43.181, 52.514, 61.304]
throughput = [94.803, 177.014, 300.603, 469.235, 595.103, 638.980, 612.597, 640.172]
p50 = [20.5326, 21.6749, 24.9076, 31.2051, 37.8700, 42.3652, 52.1732, 61.0796]
p90 = [31.8381, 33.7150, 38.8008, 48.5248, 59.2335, 68.8249, 84.6935, 96.6051]
```

- parallel 8
```
Benchmarking summary: 
 Time taken for tests: 2555.302 seconds
 Expected number of requests: 1000
 Number of concurrency: 8
 Total requests: 1000
 Succeed requests: 1000
 Failed requests: 0
 Average QPS: 0.391
 Average latency: 20.326
 Throughput(average output tokens per second): 94.803
 Average time to first token: 20.326
 Average input tokens per request: 40.296
 Average output tokens per request: 242.251
 Average time per output token: 0.01055
 Average package per request: 1.000
 Average package latency: 20.326
 Percentile of time to first token: 
     p50: 20.5326
     p66: 23.7691
     p75: 26.5282
     p80: 28.1502
     p90: 31.8381
     p95: 35.6152
     p98: 40.9497
     p99: 45.7076
 Percentile of request latency: 
     p50: 20.5326
     p66: 23.7691
     p75: 26.5282
     p80: 28.1502
     p90: 31.8381
     p95: 35.6152
     p98: 40.9497
     p99: 45.7076
```

- parallel 16
```
Benchmarking summary: 
 Time taken for tests: 1355.736 seconds
 Expected number of requests: 1000
 Number of concurrency: 16
 Total requests: 1000
 Succeed requests: 1000
 Failed requests: 0
 Average QPS: 0.738
 Average latency: 21.475
 Throughput(average output tokens per second): 177.014
 Average time to first token: 21.475
 Average input tokens per request: 40.296
 Average output tokens per request: 239.984
 Average time per output token: 0.00565
 Average package per request: 1.000
 Average package latency: 21.475
 Percentile of time to first token: 
     p50: 21.6749
     p66: 25.2886
     p75: 27.4429
     p80: 29.0391
     p90: 33.7150
     p95: 37.1781
     p98: 42.4568
     p99: 45.9629
 Percentile of request latency: 
     p50: 21.6749
     p66: 25.2886
     p75: 27.4429
     p80: 29.0391
     p90: 33.7150
     p95: 37.1781
     p98: 42.4568
     p99: 45.9629
```

- parallel 32
```
Benchmarking summary: 
 Time taken for tests: 800.953 seconds
 Expected number of requests: 1000
 Number of concurrency: 32
 Total requests: 1000
 Succeed requests: 1000
 Failed requests: 0
 Average QPS: 1.249
 Average latency: 24.877
 Throughput(average output tokens per second): 300.603
 Average time to first token: 24.877
 Average input tokens per request: 40.296
 Average output tokens per request: 240.769
 Average time per output token: 0.00333
 Average package per request: 1.000
 Average package latency: 24.877
 Percentile of time to first token: 
     p50: 24.9076
     p66: 29.1147
     p75: 32.1535
     p80: 34.1477
     p90: 38.8008
     p95: 43.0980
     p98: 48.4589
     p99: 53.6278
 Percentile of request latency: 
     p50: 24.9076
     p66: 29.1147
     p75: 32.1535
     p80: 34.1477
     p90: 38.8008
     p95: 43.0980
     p98: 48.4589
     p99: 53.6278
```

- parallel 64
```
Benchmarking summary: 
 Time taken for tests: 515.309 seconds
 Expected number of requests: 1000
 Number of concurrency: 64
 Total requests: 1000
 Succeed requests: 1000
 Failed requests: 0
 Average QPS: 1.941
 Average latency: 31.015
 Throughput(average output tokens per second): 469.235
 Average time to first token: 31.015
 Average input tokens per request: 40.296
 Average output tokens per request: 241.801
 Average time per output token: 0.00213
 Average package per request: 1.000
 Average package latency: 31.015
 Percentile of time to first token: 
     p50: 31.2051
     p66: 36.5305
     p75: 40.1962
     p80: 42.1270
     p90: 48.5248
     p95: 53.4686
     p98: 60.3826
     p99: 65.7931
 Percentile of request latency: 
     p50: 31.2051
     p66: 36.5305
     p75: 40.1962
     p80: 42.1270
     p90: 48.5248
     p95: 53.4686
     p98: 60.3826
     p99: 65.7931
```

- parallel 100
```
Benchmarking summary: 
 Time taken for tests: 403.138 seconds
 Expected number of requests: 1000
 Number of concurrency: 100
 Total requests: 1000
 Succeed requests: 1000
 Failed requests: 0
 Average QPS: 2.481
 Average latency: 37.778
 Throughput(average output tokens per second): 595.103
 Average time to first token: 37.778
 Average input tokens per request: 40.296
 Average output tokens per request: 239.909
 Average time per output token: 0.00168
 Average package per request: 1.000
 Average package latency: 37.778
 Percentile of time to first token: 
     p50: 37.8700
     p66: 44.4992
     p75: 49.1464
     p80: 52.3330
     p90: 59.2335
     p95: 64.9315
     p98: 74.1723
     p99: 80.4544
 Percentile of request latency: 
     p50: 37.8700
     p66: 44.4992
     p75: 49.1464
     p80: 52.3330
     p90: 59.2335
     p95: 64.9315
     p98: 74.1723
     p99: 80.4544
```

- parallel 128
```
Benchmarking summary: 
 Time taken for tests: 375.187 seconds
 Expected number of requests: 1000
 Number of concurrency: 128
 Total requests: 999
 Succeed requests: 998
 Failed requests: 1
 Average QPS: 2.660
 Average latency: 43.181
 Throughput(average output tokens per second): 638.980
 Average time to first token: 43.181
 Average input tokens per request: 40.297
 Average output tokens per request: 240.217
 Average time per output token: 0.00156
 Average package per request: 1.000
 Average package latency: 43.181
 Percentile of time to first token: 
     p50: 42.3652
     p66: 51.6154
     p75: 56.2693
     p80: 59.2260
     p90: 68.8249
     p95: 75.4546
     p98: 85.2362
     p99: 93.3652
 Percentile of request latency: 
     p50: 42.3652
     p66: 51.6154
     p75: 56.2693
     p80: 59.2260
     p90: 68.8249
     p95: 75.4546
     p98: 85.2362
     p99: 93.3652
```

- parallel 150
```
Benchmarking summary: 
 Time taken for tests: 386.202 seconds
 Expected number of requests: 1000
 Number of concurrency: 150
 Total requests: 998
 Succeed requests: 992
 Failed requests: 6
 Average QPS: 2.569
 Average latency: 52.514
 Throughput(average output tokens per second): 612.597
 Average time to first token: 52.514
 Average input tokens per request: 40.303
 Average output tokens per request: 238.494
 Average time per output token: 0.00163
 Average package per request: 1.000
 Average package latency: 52.514
 Percentile of time to first token: 
     p50: 52.1732
     p66: 61.4450
     p75: 67.9417
     p80: 72.0179
     p90: 84.6935
     p95: 92.2286
     p98: 101.7002
     p99: 107.7996
 Percentile of request latency: 
     p50: 52.1732
     p66: 61.4450
     p75: 67.9417
     p80: 72.0179
     p90: 84.6935
     p95: 92.2286
     p98: 101.7002
     p99: 107.7996
```

- parallel 200
```
Benchmarking summary: 
 Time taken for tests: 355.307 seconds
 Expected number of requests: 1000
 Number of concurrency: 200
 Total requests: 998
 Succeed requests: 970
 Failed requests: 28
 Average QPS: 2.730
 Average latency: 61.304
 Throughput(average output tokens per second): 640.172
 Average time to first token: 61.304
 Average input tokens per request: 40.287
 Average output tokens per request: 234.493
 Average time per output token: 0.00156
 Average package per request: 1.000
 Average package latency: 61.304
 Percentile of time to first token: 
     p50: 61.0796
     p66: 74.1724
     p75: 80.9575
     p80: 84.8420
     p90: 96.6051
     p95: 105.2873
     p98: 114.3178
     p99: 115.7257
 Percentile of request latency: 
     p50: 61.0796
     p66: 74.1724
     p75: 80.9575
     p80: 84.8420
     p90: 96.6051
     p95: 105.2873
     p98: 114.3178
     p99: 115.7257
```

### Qwen2.5-72B-Chat

![](/images/2024/evalscope/qwen2.5-72b-chat_vllm.png)

| 指标 | 16 | 32 | 64 |
| --- | --- | --- | --- |
| 用时 | 406.618 | 223.379 | 159.293 |
| QPS | 0.236 | 0.448 | 0.609 |
| 延迟 | 53.359 | 54.293 | 60.959 |
| 吞吐量 | 69.242 | 129.193 | 185.140 |
| p50 | 52.8675 | 56.3690 | 58.7318 |
| p90 | 80.6415 | 87.1464 | 90.6065 |

- 平均每个请求的输入 token 数: 50
- 平均每个请求的输出 token 数: 290

```py
# 数据
concurrency = [16, 32, 64]
time = [406.618, 223.379, 159.293]
qps = [0.236, 0.448, 0.609]
latency = [53.359, 54.293, 60.959]
throughput = [69.242, 129.193, 185.140]
p50 = [52.8675, 56.3690, 58.7318]
p90 = [80.6415, 87.1464, 90.6065]
```

- parallel 1
```
Benchmarking summary: 
 Time taken for tests: 80.089 seconds
 Expected number of requests: 1
 Number of concurrency: 1
 Total requests: 1
 Succeed requests: 1
 Failed requests: 0
 Average QPS: 0.012
 Average latency: 79.353
 Throughput(average output tokens per second): 5.819
 Average time to first token: 79.353
 Average input tokens per request: 44.000
 Average output tokens per request: 466.000
 Average time per output token: 0.17186
 Average package per request: 1.000
 Average package latency: 79.353
```

- parallel 16
```
Benchmarking summary: 
 Time taken for tests: 406.618 seconds
 Expected number of requests: 100
 Number of concurrency: 16
 Total requests: 98
 Succeed requests: 96
 Failed requests: 2
 Average QPS: 0.236
 Average latency: 53.359
 Throughput(average output tokens per second): 69.242
 Average time to first token: 53.359
 Average input tokens per request: 50.156
 Average output tokens per request: 293.281
 Average time per output token: 0.01444
 Average package per request: 1.000
 Average package latency: 53.359
 Percentile of time to first token: 
     p50: 52.8675
     p66: 62.7250
     p75: 70.2725
     p80: 73.0569
     p90: 80.6415
     p95: 91.7408
     p98: 96.5681
     p99: 114.6619
 Percentile of request latency: 
     p50: 52.8675
     p66: 62.7250
     p75: 70.2725
     p80: 73.0569
     p90: 80.6415
     p95: 91.7408
     p98: 96.5681
     p99: 114.6619
```

- parallel 32
```
Benchmarking summary: 
 Time taken for tests: 223.379 seconds
 Expected number of requests: 100
 Number of concurrency: 32
 Total requests: 100
 Succeed requests: 100
 Failed requests: 0
 Average QPS: 0.448
 Average latency: 54.293
 Throughput(average output tokens per second): 129.193
 Average time to first token: 54.293
 Average input tokens per request: 49.890
 Average output tokens per request: 288.590
 Average time per output token: 0.00774
 Average package per request: 1.000
 Average package latency: 54.293
 Percentile of time to first token: 
     p50: 56.3690
     p66: 61.8036
     p75: 73.1621
     p80: 77.8210
     p90: 87.1464
     p95: 97.1933
     p98: 102.0623
     p99: 107.4325
 Percentile of request latency: 
     p50: 56.3690
     p66: 61.8036
     p75: 73.1621
     p80: 77.8210
     p90: 87.1464
     p95: 97.1933
     p98: 102.0623
     p99: 107.4325
```

- parallel 64
```
Benchmarking summary: 
 Time taken for tests: 159.293 seconds
 Expected number of requests: 100
 Number of concurrency: 64
 Total requests: 99
 Succeed requests: 97
 Failed requests: 2
 Average QPS: 0.609
 Average latency: 60.959
 Throughput(average output tokens per second): 185.140
 Average time to first token: 60.959
 Average input tokens per request: 50.093
 Average output tokens per request: 296.392
 Average time per output token: 0.00540
 Average package per request: 1.000
 Average package latency: 60.959
 Percentile of time to first token: 
     p50: 58.7318
     p66: 72.0510
     p75: 77.6354
     p80: 82.2268
     p90: 90.6065
     p95: 98.0913
     p98: 108.4727
     p99: 112.9350
 Percentile of request latency: 
     p50: 58.7318
     p66: 72.0510
     p75: 77.6354
     p80: 82.2268
     p90: 90.6065
     p95: 98.0913
     p98: 108.4727
     p99: 112.9350
```
