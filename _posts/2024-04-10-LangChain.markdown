---
layout: post
title:  "LangChain"
date:   2024-04-10 08:00:00 +0800
categories: LangChain
tags: [LangChain]
---

## 介绍
LangChain 是一个用于开发由大型语言模型（LLM）支持的应用程序的框架。

LangChain 简化了 LLM 应用程序生命周期的每个阶段：

- 开发（Development）：使用 LangChain 的开源构建块和组件构建您的应用程序。使用第三方集成和模板快速启动。
- 生产化（Productionization）：使用 LangSmith 检查、监控和评估您的链，以便您可以持续优化并放心部署。
- 部署（Deployment）：使用 LangServe 将任何链转换为 API。

![](/images/2024/LangChain/langchain_stack.svg)

具体来说，该框架由以下开源库组成：

- langchain-core: 基本抽象和 LangChain 表达语言（LangChain Expression Language）。
- langchain-community: 第三方集成。
  - 合作伙伴包（例如 langchain-openai、langchain-anthropic 等）：一些集成已进一步拆分为自己的轻量级包，这些包仅依赖于 langchain-core。
- langchain: 构成应用程序认知架构（Cognitive Architecture）的链（Chains）、代理（Agents）和检索策略（Retrieval Strategies）。
- langgraph: 通过将步骤建模为图中的边和节点，使用 LLM 构建强大且有状态的多参与者应用程序。
- langserve: 将 LangChain 链部署为 REST API。

更广泛的生态系统（ecosystem）包括：

- LangSmith：一个开发者平台，让您可以调试（debug）、测试（test）、评估（evaluate）和监控（monitor） LLM 应用程序，并与 LangChain 无缝集成。
- langchain-experimental: 包含用于研究和实验用途的实验性 LangChain 代码。

- [LangChain Introduction](https://python.langchain.com/docs/get_started/introduction/)


## [安装](https://python.langchain.com/docs/get_started/installation/)
