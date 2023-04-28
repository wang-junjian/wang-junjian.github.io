---
layout: post
title:  "OpenAI API Documentation Chat Completion"
date:   2023-04-28 08:00:00 +0800
categories: OpenAI-API-Chat-Completion
tags: ["OpenAI API", "Chat Completion", Token]
---

## [Chat Completion](https://platform.openai.com/docs/guides/chat)
### 模型
* gpt-3.5-turbo
* gpt-4

### 可以做很多事情
* 起草电子邮件或其他书面文件
* 编写 Python 代码
* 回答有关一组文件的问题
* 创建会话代理
* 为您的软件提供自然语言界面
* 一系列科目的导师
* 翻译语言
* 模拟视频游戏中的角色等等

## API 调用
### 例子
```py
import os
import openai

openai.api_key = os.getenv("OPENAI_API_KEY")

response = openai.ChatCompletion.create(
  model="gpt-3.5-turbo",
  messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Who won the world series in 2020?"},
        {"role": "assistant", "content": "The Los Angeles Dodgers won the World Series in 2020."},
        {"role": "user", "content": "Where was it played?"}
    ]
)

message = response["choices"][0]["message"]["content"]
print(message)
```
```
The 2020 World Series was played at Globe Life Field in Arlington, Texas.
```

主要输入是消息参数。消息必须是一个消息对象数组，其中每个对象都有一个角色（"system"、"user"、"assistant"）和内容（"content"）。

通常，对话首先使用 "system" 消息进行格式化，然后是交替的 "user" 和 "assistant" 消息。

"system" 消息有助于设置 "assistant" 的行为。

### 响应格式
```py
{
  "choices": [
    {
      "finish_reason": "stop",
      "index": 0,
      "message": {
        "content": "The 2020 World Series was played at Globe Life Field in Arlington, Texas due to the COVID-19 pandemic.",
        "role": "assistant"
      }
    }
  ],
  "created": 1682650205,
  "id": "chatcmpl-7A8TNttrmsx6mCt6CVDfymOhwVaEJ",
  "model": "gpt-3.5-turbo-0301",
  "object": "chat.completion",
  "usage": {
    "completion_tokens": 24,
    "prompt_tokens": 57,
    "total_tokens": 81
  }
}
```

## Token
### 介绍
语言模型以称为 token 的块形式读取文本。在英语中，token 可以短至一个字符，也可以长至一个单词（例如，a或 apple），在某些语言中，token 甚至可以短于一个字符，甚至长于一个单词。

例如，字符串 `"ChatGPT is great!"` 被编码为六个 token: `["Chat", "G", "PT", " is", " great", "!"]`.

### API 调用中的 token 总数会影响：
您为每个 token 支付的 API 调用费用是多少
您的 API 调用需要多长时间，因为写入更多 token 需要更多时间
您的 API 调用是否有效，因为 token 总数必须低于模型的最大限制（4096 个令牌gpt-3.5-turbo-0301）
输入和输出 token 都计入这些数量。

要查看 API 调用使用了多少 token ，请检查 API 响应中的 usage 字段（例如，response['usage']['total_tokens']）。

### 计算 API 调用消息的 Token
下面是官方提供的计算方法
```py
# pip install tiktoken
import tiktoken

def num_tokens_from_messages(messages, model="gpt-3.5-turbo-0301"):
    """Returns the number of tokens used by a list of messages."""
    try:
        encoding = tiktoken.encoding_for_model(model)
    except KeyError:
        print("Warning: model not found. Using cl100k_base encoding.")
        encoding = tiktoken.get_encoding("cl100k_base")
    if model == "gpt-3.5-turbo":
        print("Warning: gpt-3.5-turbo may change over time. Returning num tokens assuming gpt-3.5-turbo-0301.")
        return num_tokens_from_messages(messages, model="gpt-3.5-turbo-0301")
    elif model == "gpt-4":
        print("Warning: gpt-4 may change over time. Returning num tokens assuming gpt-4-0314.")
        return num_tokens_from_messages(messages, model="gpt-4-0314")
    elif model == "gpt-3.5-turbo-0301":
        tokens_per_message = 4  # every message follows <|start|>{role/name}\n{content}<|end|>\n
        tokens_per_name = -1  # if there's a name, the role is omitted
    elif model == "gpt-4-0314":
        tokens_per_message = 3
        tokens_per_name = 1
    else:
        raise NotImplementedError(f"""num_tokens_from_messages() is not implemented for model {model}. See https://github.com/openai/openai-python/blob/main/chatml.md for information on how messages are converted to tokens.""")
    num_tokens = 0
    for message in messages:
        num_tokens += tokens_per_message
        for key, value in message.items():
            num_tokens += len(encoding.encode(value))
            if key == "name":
                num_tokens += tokens_per_name
    num_tokens += 3  # every reply is primed with <|start|>assistant<|message|>
    return num_tokens
```

* [How to count tokens with tiktoken](https://github.com/openai/openai-cookbook/blob/main/examples/How_to_count_tokens_with_tiktoken.ipynb)
* [ChatML](https://github.com/openai/openai-python/blob/main/chatml.md)

例子
```py
messages = [
  {"role": "system", "content": "You are a helpful, pattern-following assistant that translates corporate jargon into plain English."},
  {"role": "system", "name":"example_user", "content": "New synergies will help drive top-line growth."},
  {"role": "system", "name": "example_assistant", "content": "Things working well together will increase revenue."},
  {"role": "system", "name":"example_user", "content": "Let's circle back when we have more bandwidth to touch base on opportunities for increased leverage."},
  {"role": "system", "name": "example_assistant", "content": "Let's talk later when we're less busy about how to do better."},
  {"role": "user", "content": "This late pivot means we don't have time to boil the ocean for the client deliverable."}
]

model = "gpt-3.5-turbo"
print(f"{num_tokens_from_messages(messages, model)} prompt tokens counted.")
# 127
```

调用 API 返回的 prompt token 数量
```py
openai.ChatCompletion.create(model=model, messages=messages, temperature=0, max_tokens=1)['usage']['prompt_tokens']
# 127
```

## 中文翻译英文的机器人
```py
class Conversation:
    def __init__(self, prompt):
        self.prompt = prompt
        self.messages = [{"role": "system", "content": self.prompt}]
    
    def ask(self, question):
        self.messages.append({"role": "user", "content": question})

        try:
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=self.messages
            )
        except Exception as e:
            return e
        
        assistant_message = response["choices"][0]["message"]["content"]
        self.messages.append({"role": "assistant", "content": assistant_message})

        return assistant_message

def translate(conv, input):
    output = conv.ask(input)
    print(f"User: {input}")
    print(f"Assistant: {output}")
    print()

conv = Conversation("您是个翻译员，帮助用户把中文翻译成英文。")

translate(conv, "你好！")
translate(conv, "你在哪里？")
translate(conv, "你在干什么？")
```

```
User: 你好！
Assistant: Hello!

User: 你在哪里？
Assistant: Where are you located?

User: 你在干什么？
Assistant: What are you doing?
```

### 指导聊天模型
许多对话以系统消息开始，以温和地指示助手。

这是用于 ChatGPT 的系统消息。
```
{"role": "system", "content": "您是个翻译员，帮助用户把中文翻译成英文。"}
```

如果模型没有生成您想要的输出，请随意迭代并尝试潜在的改进。您可以尝试以下方法：
* 让您的指示更明确
* 指定您想要答案的格式
* 在确定答案之前让模型逐步思考或讨论利弊

除了系统消息之外，temperature 和 max tokens 是开发人员必须影响聊天模型输出的众多选项中的两个。对于 temperature，较高的值（如 0.8）将使输出更加随机，而较低的值（如 0.2）将使输出更加集中和确定。在 max tokens 的情况下，如果要将响应限制为特定长度，可以将 max tokens 设置为任意数字。这可能会导致问题，例如，如果您将最大标记值设置为 5，因为输出将被切断并且结果对用户没有意义。

### 请求速率限制
如果您不是 Plus 用户，使用 gpt-3.5-turbo 模型，每分钟限制调用 3 次。
```
Assistant: Rate limit reached for default-gpt-3.5-turbo in organization org-cv3W9eqOn6jmTih3dYtjFUEg on requests per min. Limit: 3 / min. Please try again in 20s. Contact support@openai.com if you continue to have issues. Please add a payment method to your account to increase your rate limit. Visit https://platform.openai.com/account/billing to add a payment method.
```
