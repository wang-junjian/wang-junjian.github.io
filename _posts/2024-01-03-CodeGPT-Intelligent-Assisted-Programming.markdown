---
layout: post
title:  "CodeGPT: 智能辅助编程"
date:   2024-01-03 08:00:00 +0800
categories: CodeGPT IntelliJIDEA
tags: [CodeGPT, IntelliJIDEA, GGUF, ChatGLM, DeepSeek-LLM, Llama, OpenAI, GPT]
---

## 安装 [InteliJ IDEA](https://www.jetbrains.com/zh-cn/idea/)

## 安装 [CodeGPT](https://plugins.jetbrains.com/plugin/21056-codegpt)

打开 `IntelliJ IDEA`，选择 `Settings` 菜单，选择 `Plugins`，搜索 `CodeGPT`，点击 `Install` 安装。

![](/images/2024/IDEA-CodeGPT/CodeGPT-Install.png)

## 配置 CodeGPT

这里访问的 OpenAI 服务是我自己搭建的，使用的是 FastChat + ChatGLM3-6B。

### 模型 GPT-3.5(4k)
- Service: OpenAI Service
- API Key: NULL
- Model: GPT-3.5(4k)
    - 使用的模型名字是：gpt-3.5-turbo
- Base host: http://172.16.33.66:8000

![](/images/2024/IDEA-CodeGPT/openai-gpt-3.5-turbo.png)

### 模型 GPT-4(32k)
- Service: OpenAI Service
- API Key: NULL
- Model: GPT-4(32k)
    - 使用的模型名字是：gpt-4-32k
- Base host: http://172.16.33.66:8000

![](/images/2024/IDEA-CodeGPT/openai-gpt-4-32k.png)

### 模型 [Deepseek Coder 7B](https://huggingface.co/TheBloke/deepseek-coder-6.7B-instruct-GGUF)
- Service: LLaMA C/C++ Port (Free, Local)
- Use pre-defined model
    - Model: Deepseek Coder (1B - 33B)
    - Model size: 7B
    - Quantization: 5-bit precision

模型缓存到 `~/.codegpt/models/gguf` 目录下，如果模型不存在，可以单击 `Download Model` 下载。

也可以自己到 `HuggingFace` 下载模型，然后放到 `~/.codegpt/models/gguf` 目录下。

单击 `Start server` 启动服务。

![](/images/2024/IDEA-CodeGPT/Deepseek-Coder-7B.png)

查看缓存的模型
```shell
ls ~/.codegpt/models/gguf
```
```
deepseek-coder-6.7b-instruct.Q5_K_M.gguf
```

- [codegpt/CodeGPTPlugin.java](https://github.com/carlrobertoh/CodeGPT/blob/master/src/main/java/ee/carlrobert/codegpt/CodeGPTPlugin.java#L41)

### 模型 LLaMA 2-7B-Chat

可以到 HuggingFace 下载 LLaMA 2-7B-Chat 模型的 GGUF格式。

- Service: LLaMA C/C++ Port (Free, Local)
- Use custom model
    - Model path: 您下载的 LLaMA 2-7B-Chat 模型的路径
    - Prompt template: Llama

单击 `Start server` 启动服务。

![](/images/2024/IDEA-CodeGPT/LLaMA.png)

### 提示模板
![](/images/2024/IDEA-CodeGPT/CodeGPT-Configuration.png)


## CodeGPT 菜单
![](/images/2024/IDEA-CodeGPT/CodeGPT-Menu.png)


## 使用 CodeGPT
### 生成代码（使用Java实现一个冒泡排序的函数）
![](/images/2024/IDEA-CodeGPT/Write-Code.png)

### 生成单元测试
![](/images/2024/IDEA-CodeGPT/Write-Test.png)

### 翻译注释
![](/images/2024/IDEA-CodeGPT/Code-Translate.png)

### Bug 修复
![](/images/2024/IDEA-CodeGPT/Fix-Bug.png)


## 参考资料
- [IntelliJ IDEA](https://www.jetbrains.com/zh-cn/idea/)
- [CodeGPT](https://plugins.jetbrains.com/plugin/21056-codegpt)
- [CodeGPT](https://github.com/carlrobertoh/CodeGPT)
- [Visual Studio Code > Code GPT](https://marketplace.visualstudio.com/items?itemName=DanielSanMedium.dscodegpt)
- [CodeGPT Plus: AI Pair Programing](https://www.codegpt.co/)
- [How to use this in an IDE? #75](https://github.com/deepseek-ai/DeepSeek-Coder/issues/75)
- [DeepSeek Chat](https://chat.deepseek.com/coder)
- [DeepSeek Coder](https://github.com/deepseek-ai/DeepSeek-Coder)
- [DeepSeek-LLM](https://github.com/deepseek-ai/DeepSeek-LLM)
- [Java int to String 整数转换为字符串](https://www.mapull.com/javastr/137/)
