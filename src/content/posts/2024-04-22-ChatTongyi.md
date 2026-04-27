---
layout: single
title:  "ChatTongyi"
date:   2024-04-22 08:00:00 +0800
categories: [AI 与大模型, 编程开发]
tags: [LangChain, ChatTongyi, DashScope, Stream, Text2SQL, LLM ChatTongyi]
---

## LangChain ChatTongyi

### Stream

```python
from langchain_core.messages import HumanMessage
from langchain_community.chat_models.tongyi import ChatTongyi


model = ChatTongyi(model="qwen-turbo", top_p=0.01)
gen = model.stream([HumanMessage(content="你是谁")])

for response in gen:
    print("🤖", response)
```
```
🤖 content='我是' id='run-57fca077-5e62-4cd5-ba25-c71b65049604'
🤖 content='通' id='run-57fca077-5e62-4cd5-ba25-c71b65049604'
🤖 content='义' id='run-57fca077-5e62-4cd5-ba25-c71b65049604'
🤖 content='千问，由阿里' id='run-57fca077-5e62-4cd5-ba25-c71b65049604'
🤖 content='云开发的AI助手。我被' id='run-57fca077-5e62-4cd5-ba25-c71b65049604'
🤖 content='设计用来回答各种问题、提供信息' id='run-57fca077-5e62-4cd5-ba25-c71b65049604'
🤖 content='和进行对话。有什么我可以帮助你的' id='run-57fca077-5e62-4cd5-ba25-c71b65049604'
🤖 content='吗？' id='run-57fca077-5e62-4cd5-ba25-c71b65049604'
🤖 content='' response_metadata={'finish_reason': 'stop', 'request_id': '43892d72-bca7-9aac-8acd-f71b3fbd424a', 'token_usage': {'input_tokens': 21, 'output_tokens': 34, 'total_tokens': 55}} id='run-57fca077-5e62-4cd5-ba25-c71b65049604'
```

## DashScope

### Stream

```python
from http import HTTPStatus
from dashscope import Generation
from dashscope.api_entities.dashscope_response import Role
from urllib.error import HTTPError


messages = [{'role': Role.USER, 'content': "你是谁"}]

gen = Generation.call(
    model = "qwen-turbo",
    messages=messages,
    result_format='message',
    stream=True
)
for response in gen:
    if response.status_code == HTTPStatus.OK:
        role = response.output.choices[0].message.role
        response = response.output.choices[0].message.content
        print('🤖 ', response)
    else:
        raise HTTPError('Request id: %s, Status code: %s, error code: %s, error message: %s' % (
            response.request_id, response.status_code,
            response.code, response.message
        ))
```
```
🤖  我是
🤖  我是通
🤖  我是通义
🤖  我是通义千问，由阿里
🤖  我是通义千问，由阿里云开发的AI助手。我被
🤖  我是通义千问，由阿里云开发的AI助手。我被设计用来回答各种问题、提供信息
🤖  我是通义千问，由阿里云开发的AI助手。我被设计用来回答各种问题、提供信息和进行对话。有什么我可以帮助你的
🤖  我是通义千问，由阿里云开发的AI助手。我被设计用来回答各种问题、提供信息和进行对话。有什么我可以帮助你的吗？
🤖  我是通义千问，由阿里云开发的AI助手。我被设计用来回答各种问题、提供信息和进行对话。有什么我可以帮助你的吗？
```


## 参考资料
- [ChatTongyi](https://python.langchain.com/docs/integrations/chat/tongyi/)
- [模型服务灵积 > 开发参考 > 模型列表 > 通义千问 > 大语言模型 > API详情](https://help.aliyun.com/zh/dashscope/developer-reference/api-details)
