---
layout: single
title:  "探索多模态大模型 Qwen2.5-VL"
date:   2025-06-17 08:00:00 +0800
categories: Qwen2.5-VL 多模态模型
tags: [Qwen2.5-VL, 多模态, Qwen, LLM, ModelScope, vLLM]
---

本文档提供了一篇关于**Qwen2.5-VL 多模态大模型**的详细指南，涵盖了从模型架构、性能到实际部署和使用的各个方面。它不仅介绍了如何**下载不同版本**（如 3B 和 7B Instruct）的模型，还提供了**安装和启动模型**的命令行指令。此外，文档还展示了如何**通过 cURL 命令测试模型**，并给出了一个**使用 OpenAI API 与 Qwen2.5-VL 进行交互的 Python 示例代码**，该代码专注于图像中的火灾、烟雾和安全帽佩戴情况检测，支持本地和网络图片。

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
    --max-model-len 16000
```

### 测试模型

```bash
curl http://localhost:8000/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "Qwen2.5-VL",
    "messages": [
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
            "text": "分析图像中是否有火灾。"
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


## 使用 OpenAI API 进行交互

以下代码示例展示了如何使用 `OpenAI API` 与 `Qwen2.5-VL` 模型进行交互，检测图像中的火灾、烟雾和人员安全帽佩戴情况。支持`本地图片`和`互联网图片`的检测。

```bash
pip install openai
```

```py
import os
import base64

from openai import OpenAI


# 配置API参数
OPENAI_API_KEY = "EMPTY"
OPENAI_API_BASE = "http://172.16.33.66:8000/v1"
MODEL_NAME = "Qwen2.5-VL"

PROMPT = """
请检测图像中的所有火灾、烟雾和人员安全帽佩戴情况，并以坐标形式返回每个目标的位置。输出格式如下：

- 火灾对象：{"bbox_2d": [x1, y1, x2, y2], "label": "火灾", "sub_label": "轻微" / "中等" / "严重" / "不确定"}
- 烟雾对象：{"bbox_2d": [x1, y1, x2, y2], "label": "烟雾", "sub_label": "轻微" / "中等" / "严重" / "不确定"}
- 人员对象：{"bbox_2d": [x1, y1, x2, y2], "label": "人员", "sub_label": "佩戴安全帽" / "未佩戴安全帽" / "不确定"}

请严格按照上述格式输出所有检测到的对象及其坐标和属性，三类对象分别输出。如无法确定，请将 "sub_label" 设置为 "不确定"。

结果示例：
[
    {"bbox_2d": [100, 200, 180, 300], "label": "火灾", "sub_label": "严重"},
    {"bbox_2d": [220, 150, 350, 280], "label": "烟雾", "sub_label": "轻微"},
    {"bbox_2d": [400, 320, 480, 420], "label": "人员", "sub_label": "佩戴安全帽"},
    {"bbox_2d": [520, 330, 600, 430], "label": "人员", "sub_label": "未佩戴安全帽"}
]
"""


client = OpenAI(
    api_key=OPENAI_API_KEY,
    base_url=OPENAI_API_BASE,
)

def is_url(path: str) -> bool:
    return path.startswith("http://") or path.startswith("https://")

def encode_image_to_base64(image_path: str) -> str:
    with open(image_path, "rb") as f:
        encoded_image = base64.b64encode(f.read())
    encoded_image_text = encoded_image.decode("utf-8")
    ext = os.path.splitext(image_path)[-1].lower().replace('.', '')
    if ext == 'jpg':
        ext = 'jpeg'
    return f"data:image/{ext};base64,{encoded_image_text}"

def detect_image(image: str, prompt: str = PROMPT) -> str:
    if is_url(image):
        image_url = image
    else:
        image_url = encode_image_to_base64(image)
    chat_response = client.chat.completions.create(
        model=MODEL_NAME,
        messages=[
            {"role": "system", "content": "You are a helpful assistant."},
            {
                "role": "user",
                "content": [
                    {"type": "image_url", "image_url": {"url": image_url}},
                    {"type": "text", "text": prompt},
                ],
            },
        ],
    )
    return chat_response.choices[0].message.content if hasattr(chat_response, 'choices') else str(chat_response)

def main():
    local_images = [
        # 可在此添加需要检测的本地图片路径
        "images/fire1.png",
    ]
    url_images = [
        # 可在此添加需要检测的互联网图片URL
        "https://www.cdstm.cn/gallery/hycx/child/201703/W020170307572370556544.jpg"
    ]
    all_images = local_images + url_images

    results = []
    for img in all_images:
        print(f"检测图片: {img}")
        try:
            result = detect_image(img)
            print(f"结果: {result}\n{'-'*40}")
            results.append({"image": img, "result": result})
        except Exception as e:
            print(f"检测失败: {e}\n{'-'*40}")
            results.append({"image": img, "result": f"检测失败: {e}"})

if __name__ == "__main__":
    main()
```


## 参考资料
- [Qwen2.5-VL](https://github.com/QwenLM/Qwen2.5-VL)
- [Qwen2.5-VL Cookbooks](https://github.com/QwenLM/Qwen2.5-VL/tree/main/cookbooks)
- [ModelScope](https://www.modelscope.cn/)
- [Qwen2.5-VL-3B-Instruct](https://www.modelscope.cn/models/Qwen/Qwen2.5-VL-3B-Instruct)
- [Qwen2.5-VL-7B-Instruct](https://www.modelscope.cn/models/Qwen/Qwen2.5-VL-7B-Instruct)
- [Qwen - vLLM](https://qwen.readthedocs.io/en/stable/deployment/vllm.html)
