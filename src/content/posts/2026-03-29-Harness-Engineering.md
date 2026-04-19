---
layout: single
title:  "Harness Engineering"
date:   2026-03-29 12:00:00 +0800
categories: Agent HarnessEngineering
tags: [Agent, HarnessEngineering]
---

<!-- more -->

## Harness Engineering 定义

**Harness engineering** 是一门设计和构建**约束、反馈循环和生命周期系统**的工程学科，用于让 AI 智能体能够可靠地构建软件。它的核心思想是：**不直接让 AI 写代码，而是创建一个环境（harness），让 AI 在这个环境中可靠地构建代码**。

## 三大核心支柱

### 1. Context Engineering（上下文工程）
- 增强的知识库
- 动态上下文注入（可观测性数据、浏览器导航等）
- 提供 AI 完成任务所需的完整信息

### 2. Architectural Constraints（架构约束）
- 由 AI 智能体监控
- 自定义 lint 规则
- 结构性测试
- 确保生成的代码符合架构规范

### 3. Entropy Cleanup（熵清理/垃圾回收）
- 定期运行的智能体来发现不一致和违规
- 对抗系统随时间的退化
- 保持代码库的长期质量

## 典型架构模式

**Anthropic 的三智能体架构：**
- **Planner（规划智能体）**：任务分解
- **Generator（生成智能体）**：代码生成
- **Evaluator（评估智能体）**：质量评估（基于 Design quality、Originality、Craft、Functionality 等标准）

## 关键实践

1. **迭代改进**：将智能体的困难视为信号，据此添加工具/护栏/文档
2. **自我验证循环**：build-test-fix 闭环
3. **循环检测中间件**：防止无限循环
4. **"推理三明治"**：计算预算策略
5. **状态传递**：在智能体之间清晰传递任务状态

## 实际成果

- **OpenAI**：5 个月内构建了超过 100 万行代码，全程无需人工输入
- **LangChain**：仅通过改进 harness，将智能体在 Terminal Bench 2.0 上的表现从 52.8% 提升到 66.5%，排名从 Top 30 进入 Top 5

## 核心思想

>"我们只改变了 harness，模型保持不变。" — LangChain

**Harness engineering** 的本质是：**将 AI 能力的关注点从"如何让 AI 更聪明"转向"如何设计更好的环境来引导和约束 AI"**


## 参考资料
- [Harness design for long-running application development](https://www.anthropic.com/engineering/harness-design-long-running-apps)
- [Harness Engineering](https://martinfowler.com/articles/exploring-gen-ai/harness-engineering.html)
- [OpenAI’s recent write-up on “Harness engineering”](https://openai.com/index/harness-engineering/)
- [Improving Deep Agents with harness engineering](https://blog.langchain.com/improving-deep-agents-with-harness-engineering/)
- [My AI Adoption Journey](https://mitchellh.com/writing/my-ai-adoption-journey)
- [Harness Engineering: The Complete Guide to Building Systems That Make AI Agents Actually Work (2026)](https://www.nxcode.io/resources/news/harness-engineering-complete-guide-ai-agent-codex-2026)
- [MiniMax M2.7: Early Echoes of Self-Evolution](https://www.minimax.io/news/minimax-m27-en)
- [MiniMax M2.7: 开启模型的自我进化](https://www.minimaxi.com/news/minimax-m27-zh)
