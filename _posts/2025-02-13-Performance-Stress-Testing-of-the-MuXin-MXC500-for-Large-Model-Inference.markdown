---
layout: post
title:  "沐曦 MXC500 训练 GPU 的大模型推理性能压测"
date:   2025-02-13 10:00:00 +0800
categories: MXC500 Benchmark
tags: [沐曦, MXC500, GPU, vLLM, evalscope-perf, LLM]
---

## 沐曦训练芯片 MXC500 介绍

曦云®C500是沐曦面向通用计算的旗舰产品，提供强大高精度及多精度混合算力，配备大规格高带宽显存，片间互联MetaXLink无缝链接多GPU系统，自主研发的MXMACA®软件栈可兼容主流GPU生态，能够全面满足数字经济建设和产业数字化的算力需求。

2023 年 6 月 14 日，沐曦官宣 AI 训练 GPU MXC500 完成芯片功能测试，MXMACA 2.0 计算平台基础测试完成，意味着公司首款 AI 训练芯片 MXC500成功点亮，该芯片采用 7nm 制程，GPGPU 架构，能够兼容 CUDA，目标对标英伟达 A100/A800 芯片。

沐曦主要有三大产品线：

1. 用于 AI 推理的 MXN 系列；
2. 用于 AI 训练及通用计算的 MXC 系列；
3. 用于图形渲染的 MXG 系列。

研发实力强大，软件生态布局完善。沐曦的研发团队阵容豪华，三位创始人均在 AMD 拥有 20 年左右的 GPU 研发经验，其中两位为 AMD 科学家（Fellow）。沐曦采用了完全自主研发的 GPU IP，有效提高了产品的开发效率，同时拥有完全自主知识产权的指令集和架构，可以对每个独立的计算实例进行灵活配置，从而优化数据中心计算资源的效率。同时，沐曦配有兼容主流 GPU 生态 的 完 整 软 件 栈 （ MXMACA ） 平 台 ， 支 持 AI 神 经 网 络 框 架 （ 如TensorFlow/PyTorch 等）、库（如 Blas/DNN 等）和 Linux Kernel 等技术，并持续优化平台来实现更高的性能和可扩展性。此外，沐曦还成立了“曦思应用生态联盟”，联合多家生态合作伙伴，包括芯驰技术、中恒讯通科、清华大学苏州汽车研究院等，推动 MXN 系列产品和解决方案的应用落地。

2023 年 3 月，公司的 MXN100 芯片与百度飞桨完成 I 级兼容性测试。

- [MXC500 测试完成，沐曦加速 AI 训练布局](https://pdf.dfcfw.com/pdf/H3_AP202306151590965492_1.pdf?1686836338000.pdf)
- [沐曦全栈GPU产品首度亮相世界人工智能大会](https://www.metax-tech.com/ndetail/12473.html)


## 部署模型

### 登录 [JumpServer](https://111.0.82.19:60443/ui)

选择 MXC500 服务器，4卡64G。

### 运行容器（定制的 vLLM 镜像）
```bash
docker run -itd --restart=always \
    --device=/dev/dri \
    --device=/dev/mxcd \
    --group-add video \
    --network=host \
    --security-opt seccomp=unconfined \
    --security-opt apparmor=unconfined \
    --shm-size 256gb \
    --ulimit memlock=-1 \
    -v /data/models:/data \
    --hostname vllm \
    --name vllm \
    cr.metax-tech.com/public-ai-release/c500/vllm:maca2.27.0.9-py310-kylin2309a-arm64 \
    bash
```

### 进入容器
```bash
docker exec -it vllm bash
```

### 部署模型

- Qwen2.5-72B-Instruct

```bash
vllm serve /data/Qwen2.5-72B-Instruct --served-model-name qwen2.5 --tensor-parallel-size 4
```

- DeepSeek-R1-Distill-Qwen-32B

```bash
vllm serve /data/DeepSeek-R1-Distill-Qwen-32B --served-model-name qwen2.5 --tensor-parallel-size 4
```

### 查看 GPU 状态

运行 `mx-smi` 命令查看 GPU 状态。

```bash
mx-smi
```

```bash
mx-smi  version: 2.1.6

=================== MetaX System Management Interface Log ===================
Timestamp                                         : Fri Feb 14 16:26:46 2025

Attached GPUs                                     : 4
+---------------------------------------------------------------------------------+
| MX-SMI 2.1.6                        Kernel Mode Driver Version: 2.5.014         |
| MACA Version: 2.23.0.1018           BIOS Version: 1.13.5.0                      |
|------------------------------------+---------------------+----------------------+
| GPU         NAME                   | Bus-id              | GPU-Util             |
| Temp        Power                  | Memory-Usage        |                      |
|====================================+=====================+======================|
| 0           MXC500                 | 0000:05:00.0        | 0%                   |
| 51C         71W                    | 60982/65536 MiB     |                      |
+------------------------------------+---------------------+----------------------+
| 1           MXC500                 | 0000:08:00.0        | 0%                   |
| 51C         76W                    | 60534/65536 MiB     |                      |
+------------------------------------+---------------------+----------------------+
| 2           MXC500                 | 0000:0e:00.0        | 0%                   |
| 50C         74W                    | 60534/65536 MiB     |                      |
+------------------------------------+---------------------+----------------------+
| 3           MXC500                 | 0000:0f:00.0        | 0%                   |
| 50C         71W                    | 60534/65536 MiB     |                      |
+------------------------------------+---------------------+----------------------+

+---------------------------------------------------------------------------------+
| Process:                                                                        |
|  GPU                    PID         Process Name                 GPU Memory     |
|                                                                  Usage(MiB)     |
|=================================================================================|
|  0                    15652         python                       60032          |
|  1                    22854         ray::RayWorkerW              59584          |
|  2                    22945         ray::RayWorkerW              59584          |
|  3                    23034         ray::RayWorkerW              59584          |
+---------------------------------------------------------------------------------+
```


## 测试模型

### 聊天
```bash
curl 'http://localhost:8000/v1/chat/completions' \
    -H "Content-Type: application/json" \
    -d '{
        "model": "qwen2.5",
        "messages": [ 
            { "role": "system", "content": "你是位人工智能专家。" }, 
            { "role": "user", "content": "解释人工智能" } 
        ]
    }'
```

### 文本补全
```bash
curl 'http://localhost:8000/v1/completions' \
    -H "Content-Type: application/json" \
    -d '{
        "model": "qwen2.5",
        "prompt": "你是谁？"
    }'
```


## 压力测试

### 工具安装

```bash
pip install evalscope==0.5.5
pip install evalscope-perf
```

- [evalscope](https://pypi.org/project/evalscope)
- [evalscope-perf](https://pypi.org/project/evalscope-perf)

### 数据集下载

#### [中文聊天 HC3-Chinese](https://modelscope.cn/datasets/AI-ModelScope/HC3-Chinese)
```shell
mkdir datasets
wget https://modelscope.cn/datasets/AI-ModelScope/HC3-Chinese/resolve/master/open_qa.jsonl \
    -O datasets/open_qa.jsonl
```

#### [代码问答 Codefuse-Evol-Instruct-Clean](https://modelscope.cn/datasets/Banksy235/Codefuse-Evol-Instruct-Clean)
```shell
wget https://modelscope.cn/datasets/Banksy235/Codefuse-Evol-Instruct-Clean/resolve/master/data.json \
    -O datasets/Codefuse-Evol-Instruct-Clean-data.jsonl

# 修改数据集格式，将 "input" 改为 "question"，以适应 EvalScope 的数据集格式 openqa
sed -i 's/"input"/"question"/g' datasets/Codefuse-Evol-Instruct-Clean-data.jsonl
```

### 压力测试

```bash
evalscope-perf http://127.0.0.1:8000/v1/chat/completions qwen2.5 \
    ./datasets/open_qa.jsonl \
    --max-prompt-length 8000 \
    --read-timeout=120 \
    --parallels 128 \
    --n 1000
```

```bash
Benchmarking summary: 
 Time taken for tests: 630.612 seconds
 Expected number of requests: 1000
 Number of concurrency: 128
 Total requests: 988
 Succeed requests: 938
 Failed requests: 50
 Average QPS: 1.487
 Average latency: 65.745
 Throughput(average output tokens per second): 404.683
 Average time to first token: 65.745
 Average input tokens per request: 50.303
 Average output tokens per request: 272.066
 Average time per output token: 0.00247
 Average package per request: 1.000
 Average package latency: 65.745
 Percentile of time to first token: 
     p50: 68.1765
     p66: 78.5570
     p75: 84.1820
     p80: 88.1003
     p90: 97.8666
     p95: 107.1864
     p98: 114.8085
     p99: 116.9974
 Percentile of request latency: 
     p50: 68.1765
     p66: 78.5570
     p75: 84.1820
     p80: 88.1003
     p90: 97.8666
     p95: 107.1864
     p98: 114.8085
     p99: 116.9974

📌 Metrics: {'Average QPS': 1.487, 'Average latency': 65.745, 'Throughput': 404.683}
```

拷贝文件

```bash
cp performance_metrics.png /tmp/systemd-private-7a1518cf39464adb821c6af0a9b6902e-chronyd.service-zua6qJ/tmp/
```


## 实验结果

> 总的测试数量为 1000 。

### Qwen2.5-72B-Instruct

压测命令：

```bash
evalscope-perf http://127.0.0.1:8000/v1/chat/completions qwen2.5 \
    ./datasets/open_qa.jsonl \
    --read-timeout=120 \
    --parallels 8 \
    --parallels 16 \
    --parallels 32 \
    --parallels 64 \
    --parallels 100 \
    --parallels 128 \
    --parallels 150 \
    --parallels 200 \
    --n 1000
```

![](/images/2025/MXC500/Qwen2.5-72B-Instruct.png)

| 指标 | 8 | 16 | 32 | 64 | 100 | 128 | 150 | 200 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 失败数 | 0 | 0 | 0 | 13 | 21 | 69 | 100 | 158 |

显存使用及利用率：

```bash
=================== MetaX System Management Interface Log ===================
Timestamp                                         : Sat Feb 15 16:17:48 2025

Attached GPUs                                     : 4
+---------------------------------------------------------------------------------+
| MX-SMI 2.1.6                        Kernel Mode Driver Version: 2.5.014         |
| MACA Version: 2.23.0.1018           BIOS Version: 1.13.5.0                      |
|------------------------------------+---------------------+----------------------+
| GPU         NAME                   | Bus-id              | GPU-Util             |
| Temp        Power                  | Memory-Usage        |                      |
|====================================+=====================+======================|
| 0           MXC500                 | 0000:05:00.0        | 36%                  |
| 54C         122W                   | 60278/65536 MiB     |                      |
+------------------------------------+---------------------+----------------------+
| 1           MXC500                 | 0000:08:00.0        | 36%                  |
| 54C         125W                   | 59830/65536 MiB     |                      |
+------------------------------------+---------------------+----------------------+
| 2           MXC500                 | 0000:0e:00.0        | 24%                  |
| 53C         122W                   | 59830/65536 MiB     |                      |
+------------------------------------+---------------------+----------------------+
| 3           MXC500                 | 0000:0f:00.0        | 35%                  |
| 54C         122W                   | 59830/65536 MiB     |                      |
+------------------------------------+---------------------+----------------------+

+---------------------------------------------------------------------------------+
| Process:                                                                        |
|  GPU                    PID         Process Name                 GPU Memory     |
|                                                                  Usage(MiB)     |
|=================================================================================|
|  0                   343683         python                       59328          |
|  1                   350950         ray::RayWorkerW              58880          |
|  2                   351042         ray::RayWorkerW              58880          |
|  3                   351132         ray::RayWorkerW              58880          |
+---------------------------------------------------------------------------------+
```

### DeepSeek-R1-Distill-Qwen-32B

```bash
evalscope-perf http://127.0.0.1:8000/v1/chat/completions qwen2.5 \
    ./datasets/open_qa.jsonl \
    --read-timeout=120 \
    --parallels 8 \
    --parallels 16 \
    --parallels 32 \
    --parallels 64 \
    --parallels 100 \
    --parallels 128 \
    --parallels 150 \
    --parallels 200 \
    --parallels 256 \
    --parallels 300 \
    --n 1000
```

![](/images/2025/MXC500/DeepSeek-R1-Distill-Qwen-32B.png)

| 指标 | 8 | 16 | 32 | 64 | 100 | 128 | 150 | 200 | 256 | 300 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 失败数 | 12 | 10 | 17 | 38 | 109 | 129 | 211 | 197 | 161 | 266 |

显存使用及利用率：

```bash
=================== MetaX System Management Interface Log ===================
Timestamp                                         : Sat Feb 15 11:45:50 2025

Attached GPUs                                     : 4
+---------------------------------------------------------------------------------+
| MX-SMI 2.1.6                        Kernel Mode Driver Version: 2.5.014         |
| MACA Version: 2.23.0.1018           BIOS Version: 1.13.5.0                      |
|------------------------------------+---------------------+----------------------+
| GPU         NAME                   | Bus-id              | GPU-Util             |
| Temp        Power                  | Memory-Usage        |                      |
|====================================+=====================+======================|
| 0           MXC500                 | 0000:05:00.0        | 34%                  |
| 54C         112W                   | 61292/65536 MiB     |                      |
+------------------------------------+---------------------+----------------------+
| 1           MXC500                 | 0000:08:00.0        | 34%                  |
| 54C         118W                   | 60716/65536 MiB     |                      |
+------------------------------------+---------------------+----------------------+
| 2           MXC500                 | 0000:0e:00.0        | 33%                  |
| 53C         114W                   | 60716/65536 MiB     |                      |
+------------------------------------+---------------------+----------------------+
| 3           MXC500                 | 0000:0f:00.0        | 33%                  |
| 53C         111W                   | 60716/65536 MiB     |                      |
+------------------------------------+---------------------+----------------------+

+---------------------------------------------------------------------------------+
| Process:                                                                        |
|  GPU                    PID         Process Name                 GPU Memory     |
|                                                                  Usage(MiB)     |
|=================================================================================|
|  0                   279777         python                       60352          |
|  1                   287035         ray::RayWorkerW              59776          |
|  2                   287125         ray::RayWorkerW              59776          |
|  3                   287215         ray::RayWorkerW              59776          |
+---------------------------------------------------------------------------------+
```


## NUMA 配置（加速推理性能）

### 安装 numactl

```bash
yum install numactl
```

### 查看 NUMA 节点

```bash
numactl --hardware
```

```bash
numactl --hardware
available: 8 nodes (0-7)
node 0 cpus: 0 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15
node 0 size: 64992 MB
node 0 free: 4950 MB
node 1 cpus: 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31
node 1 size: 65461 MB
node 1 free: 12524 MB
node 2 cpus: 32 33 34 35 36 37 38 39 40 41 42 43 44 45 46 47
node 2 size: 65461 MB
node 2 free: 9299 MB
node 3 cpus: 48 49 50 51 52 53 54 55 56 57 58 59 60 61 62 63
node 3 size: 65461 MB
node 3 free: 11394 MB
node 4 cpus: 64 65 66 67 68 69 70 71 72 73 74 75 76 77 78 79
node 4 size: 65461 MB
node 4 free: 7189 MB
node 5 cpus: 80 81 82 83 84 85 86 87 88 89 90 91 92 93 94 95
node 5 size: 65461 MB
node 5 free: 6740 MB
node 6 cpus: 96 97 98 99 100 101 102 103 104 105 106 107 108 109 110 111
node 6 size: 65461 MB
node 6 free: 7317 MB
node 7 cpus: 112 113 114 115 116 117 118 119 120 121 122 123 124 125 126 127
node 7 size: 64436 MB
node 7 free: 11067 MB
node distances:
node   0   1   2   3   4   5   6   7 
  0:  10  22  22  22  28  22  28  28 
  1:  22  10  22  22  22  28  28  28 
  2:  22  22  10  22  28  28  28  22 
  3:  22  22  22  10  28  28  22  28 
  4:  28  22  28  28  10  22  22  22 
  5:  22  28  28  28  22  10  22  22 
  6:  28  28  28  22  22  22  10  22 
  7:  28  28  22  28  22  22  22  10
```

### 查看 GPU 与 CPU 的拓扑关系

```bash
mx-smi topo -m
```

```bash
Attached GPUs                                     : 4
Device link type matrix
        GPU0    GPU1    GPU2    GPU3    Node Affinity  CPU Affinity
GPU0    X       MX      MX      MX      0              0-15
GPU1    MX      X       MX      MX      0              0-15
GPU2    MX      MX      X       MX      0              0-15
GPU3    MX      MX      MX      X       0              0-15

Legend:
  X    = Self
  SYS  = Connection traversing PCIe as well as the SMP interconnect between NUMA nodes (e.g., QPI/UPI)
  NODE = Connection traversing PCIe as well as the interconnect between PCIe Host Bridges within a NUMA node
  PHB  = Connection traversing PCIe as well as a PCIe Host Bridge (typically the CPU)
  PXB  = Connection traversing multiple PCIe bridges (without traversing the PCIe Host Bridge)
  PIX  = Connection traversing at most a single PCIe bridge
  MX   = Connection traversing MetaXLink
  NA   = Connection type is unknown
```

### NUMA 绑定

进程绑定到 NUMA 节点 0 上，这样进程只能使用 NUMA 节点 0 上的 CPU 和内存，避免了 NUMA 交叉访问，提高了性能。

```bash
numactl --cpunodebind=0 --membind=0 vllm serve /data/Qwen2.5-72B-Instruct --served-model-name qwen2.5 --tensor-parallel-size 4
```

可以简写为：

```bash
numactl -N0 -m0 vllm serve /data/Qwen2.5-72B-Instruct --served-model-name qwen2.5 --tensor-parallel-size 4
```

### 测试

部署模型

```bash
numactl -N0 -m0 vllm serve /data/DeepSeek-R1-Distill-Qwen-32B \
    --served-model-name qwen2.5 \
    --tensor-parallel-size 4
```

压力测试

```bash
evalscope-perf http://127.0.0.1:8000/v1/chat/completions qwen2.5 \
     ./datasets/open_qa.jsonl \
     --max-prompt-length 8000 \
     --read-timeout=120 \
     --parallels 100 \
     --n 500
```

**没有配置 NUMA**

```bash
Benchmarking summary: 
 Time taken for tests: 555.873 seconds
 Expected number of requests: 500
 Number of concurrency: 100
 Total requests: 474
 Succeed requests: 426
 Failed requests: 48
 Average QPS: 0.766
 Average latency: 73.051
 Throughput(average output tokens per second): 538.497
 Average time to first token: 73.051
 Average input tokens per request: 24.338
 Average output tokens per request: 678.622
 Average time per output token: 0.00186
 Average package per request: 1.000
 Average package latency: 73.051

📌 Metrics: {'Average QPS': 0.766, 'Average latency': 73.051, 'Throughput': 538.497}
```

**numactl -N0 -m0**

```bash
Benchmarking summary: 
 Time taken for tests: 510.021 seconds
 Expected number of requests: 500
 Number of concurrency: 100
 Total requests: 480
 Succeed requests: 443
 Failed requests: 37
 Average QPS: 0.869
 Average latency: 71.212
 Throughput(average output tokens per second): 609.616
 Average time to first token: 71.212
 Average input tokens per request: 24.413
 Average output tokens per request: 688.063
 Average time per output token: 0.00164
 Average package per request: 1.000
 Average package latency: 71.212

📌 Metrics: {'Average QPS': 0.869, 'Average latency': 71.212, 'Throughput': 609.616}
```

**numactl --cpunodebind=0,1,2,3 --membind=0,1,2,3**

```bash
Benchmarking summary: 
 Time taken for tests: 647.449 seconds
 Expected number of requests: 500
 Number of concurrency: 100
 Total requests: 460
 Succeed requests: 423
 Failed requests: 37
 Average QPS: 0.653
 Average latency: 71.199
 Throughput(average output tokens per second): 443.555
 Average time to first token: 71.199
 Average input tokens per request: 24.333
 Average output tokens per request: 678.910
 Average time per output token: 0.00225
 Average package per request: 1.000
 Average package latency: 71.199

📌 Metrics: {'Average QPS': 0.653, 'Average latency': 71.199, 'Throughput': 443.555}
```

**numactl --cpunodebind=0,2,4,6 --membind=0,2,4,6**

```bash
Benchmarking summary: 
 Time taken for tests: 641.340 seconds
 Expected number of requests: 500
 Number of concurrency: 100
 Total requests: 461
 Succeed requests: 411
 Failed requests: 50
 Average QPS: 0.641
 Average latency: 73.287
 Throughput(average output tokens per second): 415.901
 Average time to first token: 73.287
 Average input tokens per request: 24.421
 Average output tokens per request: 648.988
 Average time per output token: 0.00240
 Average package per request: 1.000
 Average package latency: 73.287

📌 Metrics: {'Average QPS': 0.641, 'Average latency': 73.287, 'Throughput': 415.901}
```

### 结果对比

| NUMA 绑定 | Average QPS | Average latency | Throughput |
| --- | --- | --- | --- |
| 无 | 0.766 | 73.051 | 538.497 |
| numactl -N0 -m0 | 0.869 | 71.212 | 609.616 |
| numactl --cpunodebind=0,1,2,3 --membind=0,1,2,3 | 0.653 | 71.199 | 443.555 |
| numactl --cpunodebind=0,2,4,6 --membind=0,2,4,6 | 0.641 | 73.287 | 415.901 |

**结论**：NUMA 绑定可以提高推理性能，但是绑定的节点需要根据实际情况（GPU和CPU的拓扑关系）进行调整，否则可能会降低性能。
