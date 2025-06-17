---
layout: single
title:  "探索多模态大模型 Qwen2.5-VL"
date:   2025-06-17 08:00:00 +0800
categories: Qwen2.5-VL 多模态模型
tags: [Qwen2.5-VL, 多模态, Qwen, LLM]
---

该文档详细介绍了如何下载、部署和测试多模态大模型Qwen2.5-VL的方法和步骤，使用 OpenAI API 进行交互。Qwen2.5-VL 是一个强大的多模态模型，支持图像和文本的理解与生成，适用于各种应用场景。

<!--more-->

## Qwen2.5-VL

### 模型架构

![](/images/2025/Qwen2.5-VL/Figure1.png)

- [Qwen2.5 VL](https://qwenlm.github.io/zh/blog/qwen2.5-vl/)

### 模型性能

![](/images/2025/Qwen2.5-VL/Table5.png)

![](/images/2025/Qwen2.5-VL/Table6.png)

![](/images/2025/Qwen2.5-VL/Table7.png)

- [Qwen2.5 VL Paper](https://arxiv.org/abs/2502.13923)


## 魔搭下载

在下载前，请先通过如下命令安装 `ModelScope`

```bash
pip install modelscope
```

### [Qwen2.5-VL-3B-Instruct](https://www.modelscope.cn/models/Qwen/Qwen2.5-VL-3B-Instruct)

```bash
modelscope download --model Qwen/Qwen2.5-VL-3B-Instruct --local_dir Qwen2.5-VL-3B-Instruct
```

### [Qwen2.5-VL-7B-Instruct](https://www.modelscope.cn/models/Qwen/Qwen2.5-VL-7B-Instruct)

```bash
modelscope download --model Qwen/Qwen2.5-VL-7B-Instruct --local_dir Qwen2.5-VL-7B-Instruct
```

**默认存储**到 ~/.cache/modelscope/hub（Linux/macOS）或 C:\Users\<用户名>\.cache\modelscope\hub（Windows）。`--local_dir` 参数可以指定下载目录。


## 部署模型

### 安装 vllm

```bash
pip install vllm
```

### 启动模型

```bash
python -m vllm.entrypoints.openai.api_server \
    --host 0.0.0.0 --port 8000 \
    --model /data/models/vlm/Qwen2.5-VL-7B-Instruct \
    --served-model-name Qwen2.5-VL \
    --tensor-parallel-size 4 \
    --dtype=float16 \
    --max-model-len 4000
```

### 测试模型

```bash
curl http://localhost:8000/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "Qwen2.5-VL",
    "messages": [
      {
        "role": "system",
        "content": "您是一个专业的安全检测 AI 助手。"
      },
      {
        "role": "user",
        "content": [
          {
            "type": "image_url",
            "image_url": {
              "url": "https://www.cdstm.cn/gallery/hycx/child/201703/W020170307572370556544.jpg"
            }
          },
          {
            "type": "text",
            "text": "请分析以下图片，并回答以下三个问题：1. 图像中是否存在火灾迹象？例如火焰、烧焦物等。2. 图像中是否有明显的烟雾？描述其位置和范围。3. 图像中人员是否正确佩戴了安全帽？指出哪些人未佩戴或佩戴不规范。请以清晰、简洁的方式输出结果。如果有不确定的地方，请说明“无法确定”。请用中文输出，采用以下格式：【火灾检测】：[是/否/不确定] 【烟雾检测】：[是/否/不确定] 【安全帽检测】：[全部正确佩戴/部分未佩戴/全部未佩戴/不确定] 如为“是”或“部分未佩戴”，请在描述中指出具体细节。"
          }
        ]
      }
    ]
  }'
```

- **火灾**：https://www.cdstm.cn/gallery/hycx/child/201703/W020170307572370556544.jpg
- **烟雾**：https://www.2008php.com/2019_Website_appreciate/2019-12-24/20191224155746ewIAu.jpg
- **正确配带安全帽**：https://img95.699pic.com/photo/60051/3724.jpg_wh860.jpg
- **安全帽**：https://cbu01.alicdn.com/img/ibank/2020/925/277/13785772529_800623862.jpg


## 参考资料
- [Qwen2.5-VL](https://github.com/QwenLM/Qwen2.5-VL)
- [Qwen2.5-VL Cookbooks](https://github.com/QwenLM/Qwen2.5-VL/tree/main/cookbooks)
- [ModelScope](https://www.modelscope.cn/)
- [Qwen2.5-VL-3B-Instruct](https://www.modelscope.cn/models/Qwen/Qwen2.5-VL-3B-Instruct)
- [Qwen2.5-VL-7B-Instruct](https://www.modelscope.cn/models/Qwen/Qwen2.5-VL-7B-Instruct)
- [Qwen - vLLM](https://qwen.readthedocs.io/en/stable/deployment/vllm.html)
