---
layout: post
title:  "SiliconFlow AI Infra"
date:   2024-05-29 08:00:00 +0800
categories: AIInfra SiliconFlow
tags: [SiliconCloud, OpenAI, LLM]
---

## [SiliconFlow](https://siliconflow.cn/zh-cn/)
- [API 文档](https://siliconflow.readme.io/reference/)
- [SiliconCloud 高性价比的 GenAI 云服务](https://siliconflow.cn/zh-cn/siliconcloud)
- [SiliconLLM 高性能 LLM 推理引擎](https://siliconflow.cn/zh-cn/siliconllm)
- [OneDiff 高性能图像生成引擎](https://siliconflow.cn/zh-cn/onediff)


## 模型 & 价格

|  |  |
| --- | --- |
| deepseek-ai/deepseek-v2-chat          | ¥1.33/1M tokens |
| deepseek-ai/deepseek-llm-67b-chat     | ¥1/1M tokens |
| alibaba/Qwen1.5-110B-Chat             | ¥4.13/1M tokens |
| alibaba/Qwen1.5-32B-Chat              | ¥1.26/1M tokens |
| alibaba/Qwen1.5-14B-Chat              | ¥0.7/1M tokens |
| alibaba/Qwen1.5-7B-Chat               | ¥0.35/1M tokens |
| 01-ai/Yi-1.5-34B-Chat                 | ¥1.26/1M tokens |
| 01-ai/Yi-1.5-9B-Chat                  | ¥0.42/1M tokens |
| 01-ai/Yi-1.5-6B-Chat                  | ¥0.35/1M tokens |
| zhipuai/chatglm3-6B                   | ¥0.35/1M tokens |
| meta/llama3-70B-chat                  | ¥4.13/1M tokens |
| meta/llama3-8B-chat                   | ¥0.42/1M tokens |
| mixtralai/Mixtral-8x22B-Instruct-v0.1 | ¥4.13/1M tokens |
| mixtralai/Mixtral-8x7B-Instruct-v0.1  | ¥1.26/1M tokens |
| mixtralai/Mistral-7B-Instruct-v0.2    | ¥0.35/1M tokens |
| google/gemma-7b-it                    | ¥0.35/1M tokens |
| google/gemma-2b-it                    | ¥0.14/1M tokens |
| microsoft/Phi-3-mini-4k-instruct      |  |

- [价格](https://siliconflow.cn/zh-cn/pricing)


## OpenAI API

```python
from openai import OpenAI


client = OpenAI(
    api_key="sk-xxxxxx", 
    base_url="https://api.siliconflow.cn/v1"
)

response = client.chat.completions.create(
    model='deepseek-ai/deepseek-v2-chat',
    messages=[
        {'role': 'user', 'content': "你好！"}
    ]
)

print(response.choices[0].message.content)
```

流式输出

```python
from openai import OpenAI


client = OpenAI(
    api_key="sk-xxxxxx", 
    base_url="https://api.siliconflow.cn/v1"
)

response = client.chat.completions.create(
    model='deepseek-ai/deepseek-v2-chat',
    messages=[
        {'role': 'user', 'content': "介绍一下你自己吧。"}
    ],
    stream=True
)

for chunk in response:
    print(chunk.choices[0].delta.content)
```


## CURL

```bash
curl --request POST \
     --url https://api.siliconflow.cn/v1/chat/completions \
     --header 'Authorization: Bearer sk-xxxxxx' \
     --header 'accept: application/json' \
     --header 'content-type: application/json' \
     --data '{
  "model": "deepseek-ai/deepseek-v2-chat",
  "messages": [
    {
      "role": "user",
      "content": "你好"
    }
  ],
  "stream": false,
  "max_tokens": 512,
  "temperature": 0.7
}'
```