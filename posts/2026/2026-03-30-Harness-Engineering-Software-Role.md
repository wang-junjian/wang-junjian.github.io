---
type: article
title:  "Harness Engineering｜软件工程师的角色革命，从写代码到设计环境"
date:   2026-03-30 20:00:00 +0800
tags: [Agent, HarnessEngineering]
---

<!-- more -->

**Harness Engineering** 是 2026 年软件工程领域涌现的一门新学科，其核心理念是：**在生成式 AI 时代，由于模型能力已趋于同质化（Commodity），构建可靠、可扩展的 AI 智能体系统的关键不再是模型本身，而是在模型周围设计的“Harness”（支架/编排系统）**。

![](/images/2026/HarnessEngineering/HarnessEngineering.jpeg)

通过分析提供的资料，可以从以下几个维度深入理解 Harness Engineering：

## 1. 核心定义与马车隐喻
“Harness”一词源于马具（如缰绳、马鞍、嚼子），这个隐喻生动地解释了三者的关系：
*   **马（Horse）**：指代 AI 模型。它拥有强大的动力和速度，但本身并不知道要去哪里，也不具备自我约束力。
*   **Harness（马具/支架）**：指代基础设施。包括约束机制、护栏和反馈回路，用于将模型的原始能力转化为生产力。
*   **骑手（Rider）**：指代人类工程师。负责提供方向和意图，而不是亲自奔跑（写代码）。

正式定义上，Harness engineering 是设计和实现一个能够**约束、告知、验证并纠正** AI 智能体行为的系统学科。

## 2. Harness Engineering 的三大支柱
根据 OpenAI 和 NxCode 的实践，一个成熟的 Harness 系统包含三大核心组件：

*   **上下文工程（Context Engineering）**：确保智能体在正确的时间获得正确的信息。这要求将**代码库视为唯一的真理来源**，不仅包含代码，还包括架构决策、API 契约和动态的观测数据（如日志、指标）。
*   **架构约束（Architectural Constraints）**：通过机械化的手段强制执行“好代码”的标准。例如使用确定性的 Linter、结构化测试（如 ArchUnit）和严格的依赖层级校验，防止 AI 智能体在生成代码时由于灵活性过高而导致架构腐化。
*   **熵管理/垃圾回收（Entropy Management / Garbage Collection）**：AI 生成的代码库容易积累“AI 废料（AI Slop）”，文档也容易过时。Harness 系统需要定期运行专门的智能体来清理不一致的文档、修复违反架构约束的代码以及优化冗余逻辑。

## 3. 核心技术手段与模式
文章中提到了几种关键的实现模式：
*   **多智能体协作架构**：Anthropic 采用了类似 GAN（生成对抗网络）的模式，将系统分为**生成者（Generator）**和**评估者（Evaluator）**。评估者通过 Playwright 等工具像真实用户一样操作界面，寻找 Bug 并给出评分，逼迫生成者不断迭代优化。
*   **反馈回路与自我验证**：LangChain 强调在 Harness 中加入“自我验证循环”，在代码提交前强制执行检查单和测试。
*   **中间件化（Middleware）**：将循环检测、上下文注入、推理预算管理等功能封装为中间件，无需修改智能体逻辑即可提升其性能。
*   **上下文重置（Context Resets）**：为了解决模型在长任务中的“上下文焦虑”和一致性丧失问题，Harness 会在任务节点重置上下文，并通过结构化的 Artifacts 进行状态传递。

## 4. 软件工程师角色的转变
Harness engineering 彻底改变了开发者的工作内容：
*   **从“写代码”变为“设计环境”**：工程师的主要精力放在定义边界、编写机器可读的文档以及构建自动化的反馈回路。
*   **从“调试代码”变为“分析智能体行为”**：当智能体遇到瓶颈时，工程师不应代劳，而是反思 Harness 缺失了什么能力（如工具、护栏或文档），并让 AI 修复 Harness。
*   **严谨性的位移（Relocating Rigor）**：严谨性不再体现在每一行语法上，而体现在对整个自动化系统的设计和控制中。

## 5. 行业案例与价值证明
*   **OpenAI**：三名工程师驱动 Codex 智能体，在 5 个月内构建了一个拥有 **100 万行代码**的产品，且**人类没有手写任何代码**。
*   **LangChain**：通过仅优化 Harness（加入自我验证、环境感知等），在模型不变的情况下，将其智能体在 Terminal Bench 2.0 上的排名从前 30 名提升至**前 5 名**。
*   **MiniMax**：其 M2.7 模型甚至开始了**自我进化**，能够自主运行“分析失败轨迹 -> 计划变更 -> 修改 Harness 代码 -> 运行评估”的闭环。

## 总结
理解 Harness Engineering 的关键在于：**承认模型的不确定性，并用确定性的工程手段（代码、约束、工具）去驯服它。** 正如 Mitchell Hashimoto 所言，当智能体出错时，不再是简单地重新提示，而是通过“工程化”手段确保智能体永远不再犯同样的错误。

## 参考资料
- [Harness design for long-running application development](https://www.anthropic.com/engineering/harness-design-long-running-apps)
- [Harness Engineering](https://martinfowler.com/articles/exploring-gen-ai/harness-engineering.html)
- [OpenAI’s recent write-up on “Harness engineering”](https://openai.com/index/harness-engineering/)
- [Improving Deep Agents with harness engineering](https://blog.langchain.com/improving-deep-agents-with-harness-engineering/)
- [My AI Adoption Journey](https://mitchellh.com/writing/my-ai-adoption-journey)
- [Harness Engineering: The Complete Guide to Building Systems That Make AI Agents Actually Work (2026)](https://www.nxcode.io/resources/news/harness-engineering-complete-guide-ai-agent-codex-2026)
- [MiniMax M2.7: Early Echoes of Self-Evolution](https://www.minimax.io/news/minimax-m27-en)
