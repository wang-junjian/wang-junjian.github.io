---
layout: single
title:  "🦞 本地 AI 助手 OpenClaw 的架构与记忆系统"
date:   2026-02-14 10:00:00 +0800
categories: OpenClaw Agent
tags: [OpenClaw, Agent, Memory]
---

**🦞 OpenClaw** 是一个**本地优先（Local-First）、高度自治、基于 Markdown 记忆管理**的 AI Agent（智能体）系统。

**它的核心亮点在于：**

1. **数据主权 (Local-First):** 记忆和配置都在本地 Markdown 文件中，用户完全掌控。
2. **拟人化设计:** 通过心跳机制 (`HEARTBEAT`) 和分层记忆，试图构建一个有“长期记忆”和“自主行为”的 AI，而不仅仅是一个聊天机器人。
3. **工程化落地:** 考虑了多端接入、混合检索 RAG、上下文压缩以及安全沙盒，这是一个生产力级别的架构。

<!--more-->

## 架构系统

![](/images/2026/OpenClaw/ArchitectureMemorySystem/arch.png)

* **多端接入 (Messaging & Nodes):**
    * **消息平台:** 支持 WhatsApp, Telegram, Discord, 飞书等主流通讯软件，意味着用户可以在这些 App 里直接与 Agent 对话。
    * **客户端节点 (Nodes):** 覆盖 Android, iOS, macOS。这些节点不仅是聊天窗口，还能调用设备能力（如拍照、定位、录屏、执行脚本），让 AI 拥有“手”和“眼”。
* **核心网关 (Gateway):**
    * 运行在本地（支持 Windows, Linux, macOS, iOS, Android, Docker 等）。
    * 包含控制平面、HTTP Server、路由、会话管理和任务队列。
    * **Pi Agent:** 是核心大脑，负责处理逻辑。
* **远程管理:** 通过 **Tailscale VPN** 或 **SSH Tunnel** 进行安全的远程连接，保障了数据传输的安全性（无需暴露公网 IP）。


## 智能体运行时

![](/images/2026/OpenClaw/ArchitectureMemorySystem/agent-runtime.png)

* **透明与可控性:** 所有的配置、记忆、人设都以 `.md` (Markdown) 文件存储。这意味着用户可以直接打开文本编辑器查看和修改 AI 的“大脑”，无需复杂的数据库操作。
* **核心文件结构:**
    * **身份定义:** `SOUL.md` (性格/伦理), `IDENTITY.md` (元数据), `BOOTSTRAP.md` (初始化)。
    * **记忆系统:** 区分了“精炼的长时记忆” (`MEMORY.md`) 和“每日原始日志” (`memory/YYYY-MM-DD.md`)。这模仿了人类记忆机制（短期细节 vs 长期经验）。
    * **用户画像:** `USER.md` 记录用户的偏好，实现个性化服务。
    * **自主性:** `HEARTBEAT.md` 定义了 AI 在空闲时主动执行的任务（如检查邮件、日历），使其具备了**主观能动性**，而不仅仅是被动问答。


## 记忆搜索

![](/images/2026/OpenClaw/ArchitectureMemorySystem/memory-search.png)

* **双路索引:**
    1. **语义检索 (Embedding):** 使用 Embedding model 将文本向量化，存入 `sqlite-vec` (向量数据库)。这能解决“意思相近但词汇不同”的搜索。
    2. **关键词检索 (TF-IDF):** 使用 TF-IDF 算法，存入 SQLite 的 `FTS5` (全文搜索引擎)。这能确保精确匹配专有名词。
* **排序融合 (Rank Fusion):** 将上述两种检索结果进行加权融合，选出最相关的片段 (Top K chunks)。
* **生成回答:** 最后将这些片段作为上下文喂给生成式模型 (Generative model) 产生最终回复。
* **轻量化:** 整个技术栈基于 SQLite，非常适合个人部署，无需维护笨重的向量数据库（如 Milvus 或 Pinecone）。


## 智能体工作区

**OpenClaw 智能体工作区**，旨在构建一个具有独立人格、长期记忆和自治能力的 AI。

核心基于 **Markdown 文件系统**：

* **身份与原则 (`BOOTSTRAP`, `SOUL`, `IDENTITY`)**：确立 AI 的自我认知、名字与核心行为守则。
* **持续性 (`MEMORY`, `AGENTS`)**：通过“每日日志”与“长期记忆”实现跨会话的知识积累，而非每次新鲜唤醒。
* **伙伴与工具 (`USER`, `TOOLS`)**：记录人类偏好与本地环境配置，实现个性化与外部协作。
* **自主性 (`HEARTBEAT`)**：在无指令时主动执行维护与状态检查。

总体而言，这套架构通过将记忆转化为**持久化、可编辑的 Markdown 文件，实现了自主反思与知识沉淀的自治目标**。

| 文件名 | 类别 | 核心功能描述 |
| --- | --- | --- |
| **`BOOTSTRAP.md`** | **初始化指南** | 引导 Agent 确定自身身份（姓名、种类、风格）并完成初始设置，使用后删除。 |
| **`AGENTS.md`** | **操作指南** | 规定日常会话流程、记忆维护规则、安全界限以及群聊行为准则。 |
| **`SOUL.md`** | **灵魂与原则** | 定义 Agent 的核心性格、工作哲学、主观能动性界限和伦理守则。 |
| **`IDENTITY.md`** | **核心身份信息** | 记录 Agent 的名字、生物种类、头像路径等元数据。 |
| **`USER.md`** | **人类伙伴档案** | 记录用户的名字、时区、偏好、在意的事情及项目上下文。 |
| **`MEMORY.md`** | **长期记忆（精华）** | 存储经过提炼的重大事件、决策、经验教训和持久观点。 |
| **`memory/YYYY-MM-DD.md`** | **每日原始日志** | 记录特定日期的所有细节和活动，作为 `MEMORY.md` 的事实来源。 |
| **`TOOLS.md`** | **环境配置细节** | 记录具体的本地细节，如摄像机别名、SSH 主机信息和 TTS 语音偏好。 |
| **`HEARTBEAT.md`** | **主动任务清单** | 定义 Agent 在空闲时段需要主动执行的检查任务（邮件、日历等）。 |
