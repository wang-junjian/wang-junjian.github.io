---
type: article
title:  "华为 Atlas 800I A2 大模型部署实战（六）：vLLM 部署 LLM"
date:   2025-07-26 18:00:00 +0800
tags: [昇腾, NPU, 910B4, Atlas800IA2, vllm-ascend, vLLM, LLM, openEuler]
---

本文档重点介绍了如何使用 **vLLM-ascend 容器镜像**来部署各种 **Qwen 和 DeepSeek-V3 模型**，既提供了**直接使用 Docker 命令**的示例，也展示了通过 **Docker Compose** 进行多模型部署的方法。此外，文章还包含了**模型部署后的测试方法**。

<!-- more -->

## 服务器配置

**AI 服务器**：华为 Atlas 800I A2 推理服务器

| 组件 | 规格 |
|---|---|
| **CPU** | 鲲鹏 920（5250） |
| **NPU** | 昇腾 910B4（8X32G） |
| **内存** | 1024GB |
| **硬盘** | **系统盘**：450GB SSDX2 RAID1<br>**数据盘**：3.5TB NVME SSDX4 |
| **操作系统** | openEuler 22.03 LTS |


## 安装
- [Installation vllm-ascend](https://vllm-ascend.readthedocs.io/en/latest/installation.html)

### 拉取 vLLM 镜像

```bash
docker pull quay.io/ascend/vllm-ascend:v0.9.2rc1
```

## 部署 LLM

### Docker

设置环境变量

```bash
# 从 ModelScope 加载模型以加快下载速度
export VLLM_USE_MODELSCOPE=True

# 设置 max_split_size_mb 以减少内存碎片并避免内存不足
export PYTORCH_NPU_ALLOC_CONF=max_split_size_mb:256
```

> `max_split_size_mb` 可防止原生分配器分割大于此大小（以MB为单位）的块。这可以减少内存碎片化，并可能使一些临界工作负载在不耗尽内存的情况下完成。

运行容器

```bash
docker run -it --rm\
  --name vllm \
  --network host \
  --shm-size=1g \
  --device /dev/davinci_manager \
  --device /dev/hisi_hdc \
  --device /dev/devmm_svm \
  --device /dev/davinci0 \
  --device /dev/davinci1 \
  --device /dev/davinci2 \
  --device /dev/davinci3 \
  -v /usr/local/dcmi:/usr/local/dcmi \
  -v /usr/local/bin/npu-smi:/usr/local/bin/npu-smi \
  -v /usr/local/Ascend/driver/lib64/:/usr/local/Ascend/driver/lib64/ \
  -v /usr/local/Ascend/driver/version.info:/usr/local/Ascend/driver/version.info \
  -v /etc/ascend_install.info:/etc/ascend_install.info \
  -v /root/.cache:/root/.cache \
  -v /models:/models \
  --entrypoint "vllm" \
  quay.io/ascend/vllm-ascend:v0.9.2rc1 \
  serve /models/Qwen/Qwen2.5-7B-Instruct \
        --served-model-name Qwen/Qwen2.5-7B-Instruct \
        --tensor-parallel-size 4 \
        --port 8000 \
        --max-model-len 26240
```

> 📌 `Qwen2.5-7B-Instruct` 总注意力头数（`28`），部署需要计算 28 是否能被张量并行大小（`--tensor-parallel-size 4`）整除”。2 和 4 可以，8 就不可以。

> 📌 `--max-model-len 26240` 不要超过 `config.json` 文件中的 `max_position_embeddings=32768`
> <br>添加 `--max_model_len` 选项，以避免因 Qwen2.5-7B 模型的最大序列长度（32768）大于可存储在KV缓存中的最大令牌数（26240）而导致的ValueError。根据HBM大小的不同，不同的NPU系列此数值会有所差异。请根据您的NPU系列修改为合适的值。 


## Docker Compose 部署

编写文件 `compose.yml`

| 模型 | NPU（32G） 数 |
| --- | :---: |
| Qwen3-8B | 1 |
| Qwen3-30B-A3B | 4 |
| Qwen2.5-32B-Instruct | 4 |
| Qwen2.5-Coder-32B-Instruct | 4 |
| Qwen2.5-VL-32B-Instruct | 4 |

### Qwen3-8B

```yaml
services:
  vllm:
    image: quay.io/ascend/vllm-ascend:v0.9.2rc1
    container_name: vllm
    restart: unless-stopped

    init: true

    # 网络 & 设备
    network_mode: host
    shm_size: 1g 
    devices:
      - /dev/davinci_manager
      - /dev/hisi_hdc
      - /dev/devmm_svm
      - /dev/davinci0

    # 卷映射
    volumes:
      - /usr/local/dcmi:/usr/local/dcmi
      - /usr/local/bin/npu-smi:/usr/local/bin/npu-smi
      - /usr/local/Ascend/driver/lib64/:/usr/local/Ascend/driver/lib64/
      - /usr/local/Ascend/driver/version.info:/usr/local/Ascend/driver/version.info
      - /etc/ascend_install.info:/etc/ascend_install.info
      - /root/.cache:/root/.cache
      - /models:/models

    environment:
      - VLLM_USE_MODELSCOPE=True
      - PYTORCH_NPU_ALLOC_CONF=max_split_size_mb:256

    # 命令
    entrypoint: ["vllm"]
    command: >
      serve /models/Qwen/Qwen3-8B
      --served-model-name Qwen/Qwen3-8B
      --port 8000
      --max-model-len 32768
```

测试

```bash
curl http://localhost:8000/v1/completions \
    -H "Content-Type: application/json" \
    -d '{
        "model": "Qwen/Qwen3-8B",
        "prompt": "The future of AI is",
        "max_tokens": 7,
        "temperature": 0
    }'
```

### Qwen3-30B-A3B

```yaml
services:
  vllm:
    image: quay.io/ascend/vllm-ascend:v0.9.2rc1
    container_name: vllm
    restart: unless-stopped

    init: true

    # 网络 & 设备
    network_mode: host
    shm_size: 1g 
    devices:
      - /dev/davinci_manager
      - /dev/hisi_hdc
      - /dev/devmm_svm
      - /dev/davinci0
      - /dev/davinci1
      - /dev/davinci2
      - /dev/davinci3

    # 卷映射
    volumes:
      - /usr/local/dcmi:/usr/local/dcmi
      - /usr/local/bin/npu-smi:/usr/local/bin/npu-smi
      - /usr/local/Ascend/driver/lib64/:/usr/local/Ascend/driver/lib64/
      - /usr/local/Ascend/driver/version.info:/usr/local/Ascend/driver/version.info
      - /etc/ascend_install.info:/etc/ascend_install.info
      - /root/.cache:/root/.cache
      - /models:/models

    environment:
      - VLLM_USE_MODELSCOPE=True
      - PYTORCH_NPU_ALLOC_CONF=max_split_size_mb:256

    # 命令
    entrypoint: ["vllm"]
    command: >
      serve /models/Qwen/Qwen3-30B-A3B
      --served-model-name Qwen/Qwen3-30B-A3B
      --tensor-parallel-size 4
      --enable_expert_parallel
      --port 8000
      --max-model-len 32768
```

测试

```bash
curl http://localhost:8000/v1/chat/completions \
    -H "Content-Type: application/json" \
    -d '{
        "model": "Qwen/Qwen3-30B-A3B",
        "messages": [
            {"role": "user", "content": "Give me a short introduction to large language models."}
        ],
        "temperature": 0.6,
        "top_p": 0.95,
        "top_k": 20,
        "max_tokens": 4096
    }'
```

### Qwen2.5-VL-32B-Instruct

```yaml
services:
  vllm:
    image: quay.io/ascend/vllm-ascend:v0.9.2rc1
    container_name: vllm
    #restart: unless-stopped

    init: true

    # 网络 & 设备
    network_mode: host
    shm_size: 1g 
    devices:
      - /dev/davinci_manager
      - /dev/hisi_hdc
      - /dev/devmm_svm
      - /dev/davinci0
      - /dev/davinci1
      - /dev/davinci2
      - /dev/davinci3

    # 卷映射
    volumes:
      - /usr/local/dcmi:/usr/local/dcmi
      - /usr/local/bin/npu-smi:/usr/local/bin/npu-smi
      - /usr/local/Ascend/driver/lib64/:/usr/local/Ascend/driver/lib64/
      - /usr/local/Ascend/driver/version.info:/usr/local/Ascend/driver/version.info
      - /etc/ascend_install.info:/etc/ascend_install.info
      - /root/.cache:/root/.cache
      - /models:/models

    environment:
      - VLLM_USE_MODELSCOPE=True
      - PYTORCH_NPU_ALLOC_CONF=max_split_size_mb:256

    # 命令
    entrypoint: ["vllm"]
    command: >
      serve /models/Qwen/Qwen2.5-VL-32B-Instruct
      --served-model-name Qwen/Qwen2.5-VL-32B-Instruct
      --tensor-parallel-size 4
      --port 8000
      --max-model-len 32768
```

测试

```bash
curl http://localhost:8000/v1/chat/completions \
    -H "Content-Type: application/json" \
    -d '{
        "model": "Qwen/Qwen2.5-VL-32B-Instruct",
        "messages": [
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": [
                {"type": "image_url", "image_url": {"url": "https://modelscope.oss-cn-beijing.aliyuncs.com/resource/qwen.png"}},
                {"type": "text", "text": "What is the text in the illustrate?"}
            ]}
        ]
    }'
```

### Qwen3-30B-A3B & Qwen2.5-Coder-32B-Instruct

```yaml
services:
  vllm-instance1:
    image: quay.io/ascend/vllm-ascend:v0.9.2rc1
    container_name: vllm1
    restart: unless-stopped

    init: true

    # 网络 & 设备
    network_mode: host
    shm_size: 1g 
    devices:
      - /dev/davinci_manager
      - /dev/hisi_hdc
      - /dev/devmm_svm
      - /dev/davinci0
      - /dev/davinci1
      - /dev/davinci2
      - /dev/davinci3

    # 卷映射
    volumes:
      - /usr/local/dcmi:/usr/local/dcmi
      - /usr/local/bin/npu-smi:/usr/local/bin/npu-smi
      - /usr/local/Ascend/driver/lib64/:/usr/local/Ascend/driver/lib64/
      - /usr/local/Ascend/driver/version.info:/usr/local/Ascend/driver/version.info
      - /etc/ascend_install.info:/etc/ascend_install.info
      - /root/.cache:/root/.cache
      - /models:/models

    environment:
      - VLLM_USE_MODELSCOPE=True
      - PYTORCH_NPU_ALLOC_CONF=max_split_size_mb:256

    # 命令
    entrypoint: ["vllm"]
    command: >
      serve /models/Qwen/Qwen3-30B-A3B
      --served-model-name Qwen/Qwen3-30B-A3B
      --tensor-parallel-size 4
      --enable_expert_parallel
      --port 8001
      --max-model-len 32768

  vllm-instance2:
    image: quay.io/ascend/vllm-ascend:v0.9.2rc1
    container_name: vllm2
    restart: unless-stopped

    init: true

    # 网络 & 设备
    network_mode: host
    shm_size: 1g 
    devices:
      - /dev/davinci_manager
      - /dev/hisi_hdc
      - /dev/devmm_svm
      - /dev/davinci4
      - /dev/davinci5
      - /dev/davinci6
      - /dev/davinci7

    # 卷映射
    volumes:
      - /usr/local/dcmi:/usr/local/dcmi
      - /usr/local/bin/npu-smi:/usr/local/bin/npu-smi
      - /usr/local/Ascend/driver/lib64/:/usr/local/Ascend/driver/lib64/
      - /usr/local/Ascend/driver/version.info:/usr/local/Ascend/driver/version.info
      - /etc/ascend_install.info:/etc/ascend_install.info
      - /root/.cache:/root/.cache
      - /models:/models

    environment:
      - VLLM_USE_MODELSCOPE=True
      - PYTORCH_NPU_ALLOC_CONF=max_split_size_mb:256

    # 命令
    entrypoint: ["vllm"]
    command: >
      serve /models/Qwen/Qwen2.5-Coder-32B-Instruct
      --served-model-name Qwen/Qwen2.5-Coder-32B-Instruct
      --tensor-parallel-size 4
      --port 8002
      --max-model-len 32768
```

测试

- Qwen/Qwen3-30B-A3B
```bash
curl http://localhost:8001/v1/chat/completions \
    -H "Content-Type: application/json" \
    -d '{
        "model": "Qwen/Qwen3-30B-A3B",
        "messages": [
            {"role": "user", "content": "你是谁？"}
        ]
    }'
```

- Qwen/Qwen2.5-Coder-32B-Instruct
```bash
curl http://localhost:8002/v1/chat/completions \
    -H "Content-Type: application/json" \
    -d '{
        "model": "Qwen/Qwen2.5-Coder-32B-Instruct",
        "messages": [
            {"role": "user", "content": "你是谁？"}
        ]
    }'
```

### DeepSeek-V3-Pruning

- [vllm-ascend/DeepSeek-V3-Pruning](https://www.modelscope.cn/models/vllm-ascend/DeepSeek-V3-Pruning)

```yaml
services:
  vllm:
    image: quay.io/ascend/vllm-ascend:v0.9.2rc1
    container_name: vllm
    #restart: unless-stopped

    init: true

    # 网络 & 设备
    network_mode: host
    shm_size: 1g 
    devices:
      - /dev/davinci_manager
      - /dev/hisi_hdc
      - /dev/devmm_svm
      - /dev/davinci0
      - /dev/davinci1
      - /dev/davinci2
      - /dev/davinci3
      - /dev/davinci4
      - /dev/davinci5
      - /dev/davinci6
      - /dev/davinci7

    # 卷映射
    volumes:
      - /usr/local/dcmi:/usr/local/dcmi
      - /usr/local/bin/npu-smi:/usr/local/bin/npu-smi
      - /usr/local/Ascend/driver/lib64/:/usr/local/Ascend/driver/lib64/
      - /usr/local/Ascend/driver/version.info:/usr/local/Ascend/driver/version.info
      - /etc/ascend_install.info:/etc/ascend_install.info
      - /root/.cache:/root/.cache
      - /models:/models

    environment:
      - VLLM_USE_MODELSCOPE=True
      - PYTORCH_NPU_ALLOC_CONF=max_split_size_mb:256

    # 命令
    entrypoint: ["vllm"]
    command: >
      serve /models/vllm-ascend/DeepSeek-V3-Pruning
      --served-model-name DeepSeek-V3
      --tensor-parallel-size 8
      --enable_expert_parallel
      --port 8000
      --max-model-len 32768
      --enforce-eager
```

测试

```bash
curl 'http://localhost:8000/v1/chat/completions' \
    -H "Content-Type: application/json" \
    -d '{
        "model": "DeepSeek-V3",
        "max_tokens": 20,
        "messages": [ 
            { "role": "system", "content": "你是AI编码助手。" }, 
            { "role": "user", "content": "你是谁？" } 
        ]
    }'
```

```json
{
  "id": "chatcmpl-0e99cef79a7a45baa7905491446c9bfa",
  "object": "chat.completion",
  "created": 1753604007,
  "model": "DeepSeek-V3",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "reasoning_content": null,
        "content": "弯 overwhelming香味示盯着自己的人raphPercentage为建设配置文件048 endometrial电气 Objective迁inher۵ bat diferenci李玉",
        "tool_calls": []
      },
      "logprobs": null,
      "finish_reason": "length",
      "stop_reason": null
    }
  ],
  "usage": {
    "prompt_tokens": 10,
    "total_tokens": 30,
    "completion_tokens": 20,
    "prompt_tokens_details": null
  },
  "prompt_logprobs": null,
  "kv_transfer_params": null
}
```

不设置 `max_tokens` 参数，不会停止。输出的都是没有意义的 token。


## 参考资料
- [vllm-ascend Quickstart](https://vllm-ascend.readthedocs.io/en/latest/quick_start.html)
- [vllm-ascend - ModelScope](https://www.modelscope.cn/organization/vllm-ascend)
- [Performance Benchmark](https://vllm-ascend.readthedocs.io/en/latest/developer_guide/performance/performance_benchmark.html)
