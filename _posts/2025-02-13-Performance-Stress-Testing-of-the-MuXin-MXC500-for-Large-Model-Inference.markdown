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
```bash
vllm serve /data/Qwen2.5-72B-Instruct --served-model-name qwen2.5 --tensor-parallel-size 4
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

### 补全
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

### Qwen2.5-72B

```bash
evalscope-perf http://127.0.0.1:8000/v1/chat/completions qwen2.5 \
    ./datasets/open_qa.jsonl \
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
