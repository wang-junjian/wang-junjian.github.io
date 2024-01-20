---
layout: post
title:  "人工智能编码助手（AI Coding Assistant）功能"
date:   2024-01-13 08:00:00 +0800
categories: AICodingAssistant GitHubCopilot
tags: [AICodingAssistant, GitHubCopilot, CodeLLM]
---

## 交互方式
### 代码自动完成
![](/images/2024/Cody/single-line-autocomplete.png)

### AI 聊天
![](/images/2024/Cody/cody-chat-interface.png)


## 核心功能

| 功能 | 说明 |
| --- | --- |
| 代码补全 | 基于海量数据提供实时地代码补全服务，包括行内补全（单行补全）和片段补全（多行补全）。 |
| 添加注释 | 智能为选定的代码生成注释，目前在整个函数级别的生成注释效果较好。 |
| 解释代码 | 智能解析代码意图，为选定的代码生成解释，辅助阅读并理解代码。 |
| 生成单测 | 在写完业务逻辑后，为选定的代码生成单测，即可智能生成具备业务语义的测试用例，从而提升问题发现的效率。 |
| 代码优化 | 基于大模型的代码理解能力和静态源码分析能力，支持对选定的代码片段进行分析理解并提出优化、改进建议，还能直接基于改进建议生成代码补丁。 |


### 代码补全
![](/images/2024/CodeFuse/code-completion.png)

### 添加注释
![](/images/2024/CodeFuse/comment.gif)

### 解释代码
![](/images/2024/CodeFuse/explain-code.gif)


## 代码大模型

- 模型的评估
- 模型的参数
- 模型的训练
- 模型的推理
- 最大 Token (CodeFuse)
    - 输入：1280 Tokens
    - 输出：1024 Tokens

### 模型下载
- [HuggingFace](https://huggingface.co/)
- [ModelScope](https://modelscope.cn/)


## 编程语言
- Python
- Java
- JavaScript
- TypeScript
- C
- C++
- C#
- Go
- Rust
- PHP
- Ruby
- Swift
- Kotlin
- Scala
- SQL
- HTML
- CSS
- Shell
- Markdown
- JSON
- YAML
- XML


## 存储库 (Repository)
- GitHub
- GitLab
- Bitbucket
- SVN


## IDE
### JetBrains
- IntelliJ IDEA
- PyCharm
- WebStorm
- GoLand
- CLion
- DataGrip
- RubyMine
- Android Studio

### VS Code
### NeoVim


## 参考资料
- [CodeFuse 让研发变得更简单](https://codefuse.alipay.com/welcome/product)
- [什么是 CodeFuse](https://codefuse.yuque.com/eoxx1u/codefuse/overview)
- [CodeFuse 常见问题](https://codefuse.yuque.com/eoxx1u/codefuse/faq)
- [Cody](https://about.sourcegraph.com/cody)
- [Sourcegraph](https://about.sourcegraph.com/code-search)
