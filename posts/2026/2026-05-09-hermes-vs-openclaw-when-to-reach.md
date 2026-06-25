---
type: article
title:  "Hermes 与 OpenClaw —— 该选哪个智能体？"
date:   2026-05-09 12:00:00 +0800
tags: [hermes, openclaw, ai-agent, agent-comparison, acp, personal-assistant, kilo]
---

![](/images/2026/OpenClaw/hermes-vs-openclaw.webp)

[Hermes vs. OpenClaw - When to Reach for Which Agent](https://blog.kilo.ai/p/hermes-vs-openclaw-when-to-reach)

**发布时间**：2026-05-07
**作者**：Brendan O'Leary

---

上周，有人在 [Kilo Discord](https://kilo.ai/discord) 里问："我该从 OpenClaw 切换到 Hermes 吗？" 自 Hermes 今年二月发布以来，这个问题我已经见过不下十几次。问得好 —— 两者都是开源的，都能连接你的聊天应用，都能运行工具、记住上下文。单看功能列表，它们几乎一模一样。

但过去两个月同时运行两者之后，我认为功能清单反而让人分心 —— 真正让它们分道扬镳的是设计哲学。

**Hermes** 是在一个学习型智能体外包裹了一个网关。

**OpenClaw** 是在一个消息网关内包裹了一个智能体。

这个区别听起来很抽象，但它对你配置和与每个工具交互的方式有着切实的影响。

---

## Hermes：智能体优先

[Hermes Agent](https://hermes-agent.nousresearch.com/) 来自 Nous Research，于 2026 年 2 月发布。截至本文撰写时，GitHub 星标数约为 13.5 万。其 headline 功能是所谓的"学习循环" —— 智能体会基于自身行为创建并进化自己的技能。

根据其[功能文档](https://hermes-agent.nousresearch.com/docs/user-guide/features/overview)：

- **自我改进的技能**：智能体从经验中生成程序性知识。同一类任务跑上一百次，Hermes 真的会越做越好。
- **五种沙箱后端**：本地执行、Docker、SSH、Singularity 和 Modal。你可以自行选择命令执行的隔离程度。
- **子智能体委派**：生成拥有独立上下文和终端的子智能体。并行工作流，互不污染上下文。
- **更广泛的浏览器/语音栈**：Browserbase、Browser Use、Firecrawl、本地 Chrome，外加 Discord 频道原生语音支持。

Hermes 的[文档](https://blakecrosley.com/guides/hermes)即便你不使用也值得阅读 —— 仅提供商矩阵就覆盖了 19+ 个提供商，并附有详细的认证流程。

最让我印象深刻的是检查点系统。在 Hermes 触碰文件之前，它会先快照你的工作目录。出错了就执行 `/rollback` 回滚。我用这个功能的次数比我愿意承认的还多。

---

## OpenClaw：网关优先

[OpenClaw](https://openclaw.ai/) 存在的时间更长，社区规模也更大 —— 大约 36.9 万 GitHub 星标，以及 13,700+ 个社区构建的技能。它最初是 [Peter Steinberger](https://twitter.com/steipete) 的个人助手项目，后来发展成了更大的东西。

OpenClaw 本质上是一个**网关**。[文档](https://docs.openclaw.ai/)说得非常明确："网关是会话、路由和频道连接的唯一事实来源。"

这在实践中意味着：

- **频道广度**：Discord、Google Chat、iMessage、Matrix、Microsoft Teams、Signal、Slack、Telegram、WhatsApp、Zalo、WebChat。一个网关进程就能处理所有这些。
- **多智能体路由**：按智能体、工作区或发送者隔离会话。你可以通过同一个网关运行不同用途的不同智能体。
- **移动端节点**：iOS 和 Android 应用，可与网关配对，实现相机、画布和设备操作。
- **庞大的技能生态**：13,700+ 个社区技能，涵盖从邮件到日历再到航班值机的方方面面。

其架构假设你想要一个始终在线的进程，将消息路由给智能体。这与 Hermes 的模型 —— "这是一个可以连接各种平台的智能体运行时" —— 截然不同。

---

## 已知的失败模式

两个工具都有文档完善的失败模式，社区对此也直言不讳。在投入之前值得了解。

**Hermes：**

- **自我评估总是通过。** Hermes 会评估自己的工作以判断任务是否成功。问题在于：它几乎总是觉得自己做得很好，即便事实并非如此。这意味着它从"成功"任务中自动生成的技能可能会编码错误。任何重要任务都需要外部验证。
- **自主学习会覆盖手动编辑。** 自动生成技能的同一个系统也会覆盖你的自定义修改。如果你花了时间针对特定工作流调优某个技能，智能体可能会把它"自我改进"回一个通用版本。高级用户对此深恶痛绝。
- **成熟度差距。** 仅有 11 个版本，而 OpenClaw 有 137 个，Hermes 根本没有经过同等规模的测试。更新少意味着搞砸的机会少 —— 但这不等于已验证的稳定性。

**OpenClaw：**

- **更新会破坏东西。** 这是社区里最一致的抱怨。用户报告说，任何一次更新大约有 25% 的概率会破坏响应投递、cron 作业或 webhooks。开发过程缺乏你期望的 staging/测试纪律。
- **记忆不可靠。** 智能体会遗忘指令、在项目间交叉污染数据、重复犯错。记忆保持问题是用户流失的头号原因。
- **自托管才是真正的门槛。** Docker 配置、SSH 配置、YAML 文件、安全加固、7×24 在线 —— 用户一致反映，花在基础设施上的时间比实际智能体工作流还多。

---

## 核心区别

[ScreenshotOne 上的一篇对比](https://screenshotone.com/blog/hermes-agent-versus-openclaw/)说得很好：Hermes 是"智能体优先"，而 OpenClaw 是"网关优先"。

**Hermes** 优化的是智能体随时间变得越来越强。它面向那些希望自主智能体能从经验中学习的人。

**OpenClaw** 优化的是你可以从任何地方发消息的持久助手。它面向那些希望有可对话的基础设施的人。

两种思路都没有错。但它们导向不同的结果：

| 维度 | Hermes | OpenClaw |
|------|--------|----------|
| **学习** | 原生技能进化 | 技能是静态的（社区维护） |
| **沙箱选项** | 5 种后端（本地、Docker、SSH、Singularity、Modal） | Docker、SSH、本地 |
| **频道广度** | 7 个消息平台 | 24+ 平台和插件 |
| **社区规模** | ~13.5 万星标，快速增长 | ~36.9 万星标，更大的技能库 |
| **浏览器提供商** | 6+ 选项，含云服务 | 本地 Chrome + 托管配置文件 |
| **IDE 集成** | ACP 支持（VS Code、Zed、JetBrains） | CLI + 浏览器控制 UI |

---

## 安全考量

这一点比人们想象的更重要。[Reddit 上的一个帖子](https://www.reddit.com/r/selfhosted/comments/1r9yrw1/if_youre_selfhosting_openclaw_heres_every/)记录了 OpenClaw 2026 年的安全事件：6 个 CVE、在社区仓库中发现 341+ 个恶意技能、Shodan 扫描到 135,000+ 个暴露实例。

OpenClaw 增长太快。一些在个人笔记本上运行个人工具时合理的安全假设，当人们开始在公网 VPS 上开放端口运行时，就变得危险了。

Hermes 作为新项目，截至 2026 年 4 月[零个智能体相关的 CVE 报告](https://medium.com/@sathishkraju/i-switched-from-openclaw-to-hermes-agent-heres-what-nobody-told-me-5f33a746b6ca)。这不是因为它本质上更安全 —— 只是曝光规模还没达到。给它时间。

两个项目现在都有沙箱选项和审批流程。但如果你要在服务器上部署任一工具，请审计默认配置。两者都没有假设你运行在一个加固过的生产环境上。

---

## 什么时候选 Hermes

如果你符合以下情况，Hermes 是更好的选择：

- 你希望智能体随时间推移在任务上越做越好
- 你需要多种沙箱后端（尤其是 Modal 用于云端执行）
- 你在做研究型工作流，需要子智能体委派
- 你想要通过 ACP 实现紧密的 IDE 集成
- 你愿意用生态规模换取更强的核心智能体

学习循环是选择 Hermes 而非 OpenClaw 的理由。如果你在反复运行同类型的任务 —— 数据分析、代码审查、研究综合 —— Hermes 真的会越做越好。

---

## 什么时候选 OpenClaw

如果你符合以下情况，OpenClaw 是更好的选择：

- 你想从任何地方给助手发消息（24+ 平台）
- 你需要现有的技能生态（13,700+ 技能）
- 你想要移动端节点用于手机相机/画布集成
- 你在构建团队基础设施，而不仅仅是个人智能体
- 你看重稳定性胜过前沿功能

如果你的主要使用场景是"我想从 WhatsApp 给我的 AI 发消息，让它在我的电脑上做事"，OpenClaw 已经把这个场景做到了极致。

---

## 运行成本

这一点讨论得不够多。如果你不小心，自主运行任一智能体都很贵。每条消息都会发送完整的对话历史到 API，所以成本会在一个会话内累积。

社区用户报告，预算模型每天约 1–3 美元，Claude Opus 重度智能体使用每天 130 美元以上。解决方案是激进的会话重置，并为不同任务层级选择合适的模型：

- **质量敏感型工作**：Claude Opus 4.6（昂贵，最佳智能体表现）
- **日常主力**：GPT 5.4（思考模式开中档以上）或 MiniMax M2.7
- **预算自动化**：Qwen 3.5/3.6（OpenRouter 免费）、GLM-5.1、Kimi K2.5

包月订阅（MiniMax 10–20 美元/月，Ollama Pro Cloud 20 美元/月）正在迅速取代按 token 计费，成为社区默认选择。

---

## 混合方案：两者都用

我两个都跑 —— 社区数据证实这是一个增长中的趋势。具体有效的架构是：**OpenClaw 作为编排器**（规划、分解、多步协调、调度），**Hermes 作为执行专家**（快速、可重复的任务循环）。它们通过 ACP 协议通信。

OpenClaw 处理我的日常消息 —— 是我从 Telegram 对话的界面。我已经用了好几个月，技能生态覆盖了我大部分需求。

Hermes 跑在研究任务上，我想要学习循环。当我做一系列类似的分析时，Hermes 的技能进化真的有价值。

我也许可以合并 —— Hermes 的文档实际上注明它是"OpenClaw 的继任者"，并且它们有一个迁移命令（`hermes claw migrate`）—— 但我没觉得有紧迫感。它们各自擅长解决不同的问题。

---

## 结论

两个项目都在积极开发。两个都有真实的社区。两个都能用。

Hermes 更年轻，架构上更有野心，生态更小。OpenClaw 更成熟，集成更广，经历了更多安全审查（有好有坏）。

30% [从 OpenClaw 切换到 Hermes](https://www.kucoin.com/blog/hermes-agent-vs-openclaw-which-open-source-ai-agent-wins-in-2026) 的开发者提到的原因是"维护疲劳" —— 调试社区技能让人疲惫，以及想要学习循环。35% 留在 OpenClaw 的人提到的是集成和生态广度。

根据你的实际需求来选。如果你想要一个可以发消息的持久助手，选 OpenClaw。如果你想要一个能自我改进的智能体，选 Hermes。

或者两个都跑 —— 它们是免费的，第二个进程的资源开销可以忽略不计。

**相关链接：**

- [Hermes Agent — 官网](https://hermes.nousresearch.com)
- [Hermes 文档](https://docs.hermes.nousresearch.com)
- [OpenClaw — 官网](https://openclaw.org)
- [OpenClaw 文档](https://docs.openclaw.org)
- [ScreenshotOne 详细对比](https://screenshotone.com/blog/hermes-vs-openclaw)
