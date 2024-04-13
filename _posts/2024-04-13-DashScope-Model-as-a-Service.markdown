---
layout: post
title:  "DashScope 模型服务灵积"
date:   2024-04-13 08:00:00 +0800
categories: DashScope, LangChain
tags: [DashScope, LangChain, LLM, Qwen]
---

## [DashScope 模型服务灵积](https://dashscope.aliyun.com/)
> 让大模型能力触达每位开发者

灵积模型服务建立在“模型即服务”（Model-as-a-Service，MaaS）的理念基础之上。

灵积通过灵活、易用的模型API服务，让各种模态模型的能力，都能方便的为AI开发者所用。通过灵积API，开发者不仅可以直接集成大模型的强大能力，也可以对模型进行训练微调，实现模型定制化。

![](/images/2024/DashScope/DashScope.avif)

## 通义千问大型语言模型

| 模型 | 描述 | 上下文长度 | 计量单价 |
| --- | --- | --- | --- |
| qwen-turbo | 通义千问超大型语言模型，支持中文、英文等不同语言输入。 | 8k | 0.008元/1000 tokens |
| qwen-plus | 通义千问超大型语言模型增强版，支持中文、英文等不同语言输入。 | 32k | 0.02元/1000 tokens |
| qwen-max | 通义千问千亿级别超大型语言模型，支持中文、英文等不同语言输入。 | 8k | 0.12元/1000 tokens |
| qwen-max-longcontext | 通义千问千亿级别超大型语言模型，支持中文、英文等不同语言输入。 | 30k | 0.12元/1000 tokens |
| qwen-72b-chat | 通义千问开源 720 亿参数大型语言模型 | 8k | 0.02元/1000 tokens |
| qwen1.5-72b-chat | 通义千问开源 720 亿参数大型语言模型 | 32k | |

- [通义千问大语言模型计量计费](https://help.aliyun.com/zh/dashscope/developer-reference/tongyi-thousand-questions-metering-and-billing)


## LangChain 调用

```python
from langchain_community.chat_models.tongyi import ChatTongyi

# temperature 没有设置成功，使用 top_p=0.01，每次输出的结果都一样，比较稳定。
llm = ChatTongyi(model="qwen1.5-72b-chat", top_p=0.01)
response = llm.invoke("天空为什么是蓝色？")
print(response)
```

- [通义千问大语言模型API详情](https://help.aliyun.com/zh/dashscope/developer-reference/api-details)
