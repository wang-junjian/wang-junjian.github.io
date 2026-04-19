---
layout: single
title:  "Anthropic Claude"
date:   2024-04-18 08:00:00 +0800
categories: Claude LLM
tags: [Claude3, LangChain, LLM, Anthropic]
---

## Claude 3 模型

| 模型 | 模型名称 | 价格（MTok） | 能力 |
| --- | --- | --- | --- |
| Opus | claude-3-opus-20240229 | Input: $15<br>Output: $75 | 处理复杂的分析、多步骤的长期任务，以及更高阶的数学和编码任务 |
| Sonnet | claude-3-sonnet-20240229 | Input: $3<br>Output: $15 | 适用于高效、高吞吐量的任务 |
| Haiku | claude-3-haiku-20240307 | Input: $0.25<br>Output: $1.25 | 执行轻量级操作，速度领先行业 |

- `MTok` = million tokens.(百万 Token)
- 所有 `Claude 3` 模型都支持视觉和 `200,000` 个 Token 上下文窗口。

* [Meet Claude](https://www.anthropic.com/claude)
* [Build with Claude](https://www.anthropic.com/api)

## 例子

```python
from langchain_anthropic import ChatAnthropic
from langchain_core.prompts import ChatPromptTemplate

chat = ChatAnthropic(temperature=0, api_key="YOUR_API_KEY", model_name="claude-3-sonnet-20240229")

system = "You are a helpful assistant that translates {input_language} to {output_language}."
human = "{text}"
prompt = ChatPromptTemplate.from_messages([("system", system), ("human", human)])

chain = prompt | chat
response = chain.invoke(
    {
        "input_language": "English",
        "output_language": "Chinese",
        "text": "I love Python",
    }
)

print('🤖 ', response)
```

- [ChatAnthropic](https://python.langchain.com/docs/integrations/chat/anthropic/)


### Sonnet 👍

```python
content='我喜欢Python'
response_metadata={
    'id': 'msg_01TiSiB95vSXhQ6poXgVHV9n', 
    'model': 'claude-3-sonnet-20240229', 
    'stop_reason': 'end_turn', 
    'stop_sequence': None, 
    'usage': {'input_tokens': 22, 'output_tokens': 10}
}
id='run-337c1f65-5c1d-4b8d-8d43-2c916208a1dd-0'
```

### Haiku ❌

```python
content='我也很喜欢Python!Python是一种非常强大和灵活的编程语言,广泛应用于各个领域,包括Web开发、数据分析、机器学习等。它的语法简单易学,代码可读性强,是初学者和专业开发者都喜欢的选择。我很高兴你也对Python感兴趣,希望你在学习和使用Python的过程中能有所收获,并能够充分发挥它的强大功能。'
response_metadata={
    'id': 'msg_013CvuCdgcF88agmEZVXBnxV', 
    'model': 'claude-3-haiku-20240307', 
    'stop_reason': 'end_turn', 
    'stop_sequence': None, 
    'usage': {'input_tokens': 22, 'output_tokens': 144}
}
id='run-816d90c2-ff65-4b7b-8463-f8d5b7b45456-0'
```
