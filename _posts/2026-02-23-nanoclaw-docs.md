---
layout: single
title:  "NanoClaw 完整文档（含使用、架构、安全与开发）"
date:   2026-02-23 22:00:00 +0800
categories: NanoClaw AI原生
tags: [NanoClaw, AI Native, Documentation, OpenClaw]
---

NanoClaw 是您的**专属 AI 助手**，可安全**运行在容器中**。**轻量设计**，**易于理解**，还能根据您的**需求自由定制**。
与复杂的 OpenClaw 不同，NanoClaw 坚持“小巧易懂”的哲学，仅由单一 Node.js 进程和少量源文件组成，无微服务或复杂配置。其核心安全机制在于利用 Linux 容器（macOS 上支持 Apple Container 或 Docker）进行操作系统级别的隔离，确保智能体只能在挂载的沙箱环境中运行，无法访问宿主机敏感数据。系统支持按群组隔离的持久记忆、可安排的任务调度及网络访问功能。独特的“技能优于功能”架构鼓励用户通过贡献技能脚本（如添加 Telegram 支持）来定制功能，而非直接修改核心代码，从而保持代码库的纯净与个性化适配。

<!--more-->

# README

![NanoClaw Logo](/images/2026/NanoClaw/logo.png)

[NanoClaw](https://github.com/qwibitai/nanoclaw) —— 您的专属 Claude 助手，在容器中安全运行。它轻巧易懂，并能根据您的个人需求灵活定制。

## 我为什么创建这个项目

[OpenClaw](https://github.com/openclaw/openclaw) 是一个令人印象深刻的项目，愿景宏大。但我无法安心使用一个我不了解却能访问我个人隐私的软件。OpenClaw 有 52+ 个模块、8 个配置管理文件、45+ 个依赖项，以及为 15 个渠道提供商设计的抽象层。其安全性是应用级别的（通过白名单、配对码实现），而非操作系统级别的隔离。所有东西都在一个共享内存的 Node 进程中运行。

NanoClaw 用一个您能在 8 分钟内理解的代码库，为您提供了同样的核心功能。只有一个进程，少数几个文件。智能体（Agent）运行在具有文件系统隔离的真实 Linux 容器中，而不是依赖于权限检查。

## 快速开始

```bash
git clone https://github.com/qwibitai/nanoclaw.git
cd nanoclaw
claude
```

然后运行 `/setup`。Claude Code 会处理一切：依赖安装、身份验证、容器设置、服务配置。

## 设计哲学

**小巧易懂：** 单一进程，少量源文件。无微服务、无消息队列、无复杂抽象层。让 Claude Code 引导您轻松上手。

**通过隔离保障安全:** 智能体运行在 Linux 容器（在 macOS 上是 Apple Container，或 Docker）中。它们只能看到被明确挂载的内容。即便通过 Bash 访问也十分安全，因为所有命令都在容器内执行，不会直接操作您的宿主机。

**为单一用户打造:** 这不是一个框架，是一个完全符合我个人需求的、可工作的软件。您可以 Fork 本项目，然后让 Claude Code 根据您的精确需求进行修改和适配。

**定制即代码修改:** 没有繁杂的配置文件。想要不同的行为？直接修改代码。代码库足够小，这样做是安全的。

**AI 原生:** 无安装向导(由 Claude Code 指导安装)。无需监控仪表盘，直接询问 Claude 即可了解系统状况。无调试工具(描述问题，Claude 会修复它)。

**技能（Skills）优于功能（Features）:** 贡献者不应该向代码库添加新功能（例如支持 Telegram）。相反，他们应该贡献像 `/add-telegram` 这样的 [Claude Code 技能](https://code.claude.com/docs/en/skills)，这些技能可以改造您的 fork。最终，您得到的是只做您需要事情的整洁代码。

**最好的工具套件，最好的模型:** 本项目运行在 Claude Agent SDK 之上，这意味着您直接运行的就是 Claude Code。工具套件至关重要。一个低效的工具套件会让再聪明的模型也显得迟钝，而一个优秀的套件则能赋予它们超凡的能力。Claude Code (在我看来) 是市面上最好的工具套件。

## 功能支持

- **WhatsApp 输入/输出** - 通过手机给 Claude 发消息
- **隔离的群组上下文** - 每个群组都拥有独立的 `CLAUDE.md` 记忆和隔离的文件系统。它们在各自的容器沙箱中运行，且仅挂载所需的文件系统。
- **主频道** - 您的私有频道（self-chat），用于管理控制；其他所有群组都完全隔离
- **计划任务** - 运行 Claude 的周期性作业，并可以给您回发消息
- **网络访问** - 搜索和抓取网页内容
- **容器隔离** - 智能体在 Apple Container (macOS) 或 Docker (macOS/Linux) 的沙箱中运行
- **智能体集群（Agent Swarms）** - 启动多个专业智能体团队，协作完成复杂任务（首个支持此功能的个人 AI 助手）
- **可选集成** - 通过技能添加 Gmail (`/add-gmail`) 等更多功能

## 使用方法

使用触发词（默认为 `@Andy`）与您的助手对话：

```
@Andy 每周一到周五早上9点，给我发一份销售渠道的概览（需要访问我的 Obsidian vault 文件夹）
@Andy 每周五回顾过去一周的 git 历史，如果与 README 有出入，就更新它
@Andy 每周一早上8点，从 Hacker News 和 TechCrunch 收集关于 AI 发展的资讯，然后发给我一份简报
```

在主频道（您的self-chat）中，可以管理群组和任务：
```
@Andy 列出所有群组的计划任务
@Andy 暂停周一简报任务
@Andy 加入"家庭聊天"群组
```

## 定制

没有需要学习的配置文件。直接告诉 Claude Code 您想要什么：

- "把触发词改成 @Bob"
- "记住以后回答要更简短直接"
- "当我说早上好的时候，加一个自定义的问候"
- "每周存储一次对话摘要"

或者运行 `/customize` 进行引导式修改。

代码库足够小，Claude 可以安全地修改它。

## 贡献

**不要添加功能，而是添加技能。**

如果您想添加 Telegram 支持，不要创建一个 PR 同时添加 Telegram 和 WhatsApp。而是贡献一个技能文件 (`.claude/skills/add-telegram/SKILL.md`)，教 Claude Code 如何改造一个 NanoClaw 安装以使用 Telegram。

然后用户在自己的 fork 上运行 `/add-telegram`，就能得到只做他们需要事情的整洁代码，而不是一个试图支持所有用例的臃肿系统。

### RFS (技能征集)

我们希望看到的技能：

**通信渠道**
- `/add-telegram` - 添加 Telegram 作为渠道。应提供选项让用户选择替换 WhatsApp 或作为额外渠道添加。也应能将其添加为控制渠道（可以触发动作）或仅作为被其他地方触发的动作所使用的渠道。
- `/add-slack` - 添加 Slack
- `/add-discord` - 添加 Discord

**平台支持**
- `/setup-windows` - 通过 WSL2 + Docker 支持 Windows

**会话管理**
- `/add-clear` - 添加一个 `/clear` 命令，用于压缩会话（在同一会话中总结上下文，同时保留关键信息）。这需要研究如何通过 Claude Agent SDK 以编程方式触发压缩。

## 系统要求

- macOS 或 Linux
- Node.js 20+
- [Claude Code](https://claude.ai/download)
- [Apple Container](https://github.com/apple/container) (macOS) 或 [Docker](https://docker.com/products/docker-desktop) (macOS/Linux)

## 架构

```
WhatsApp (baileys) --> SQLite --> 轮询循环 --> 容器 (Claude Agent SDK) --> 响应
```

单一 Node.js 进程。智能体在具有挂载目录的隔离 Linux 容器中执行。每个群组的消息队列都带有全局并发控制。通过文件系统进行进程间通信（IPC）。

关键文件：
- `src/index.ts` - 编排器：状态管理、消息循环、智能体调用
- `src/channels/whatsapp.ts` - WhatsApp 连接、认证、收发消息
- `src/ipc.ts` - IPC 监听与任务处理
- `src/router.ts` - 消息格式化与出站路由
- `src/group-queue.ts` - 各带全局并发限制的群组队列
- `src/container-runner.ts` - 生成流式智能体容器
- `src/task-scheduler.ts` - 运行计划任务
- `src/db.ts` - SQLite 操作（消息、群组、会话、状态）
- `groups/*/CLAUDE.md` - 各群组的记忆

## FAQ

**为什么是 WhatsApp 而不是 Telegram/Signal 等？**

因为我用 WhatsApp。Fork 这个项目然后运行一个技能来改变它。正是这个项目的核心理念。

**为什么是 Docker？**

Docker 提供跨平台支持（macOS 和 Linux）和成熟的生态系统。在 macOS 上，您可以选择通过运行 `/convert-to-apple-container` 切换到 Apple Container，以获得更轻量级的原生运行时体验。

**我可以在 Linux 上运行吗？**

可以。Docker 是默认的容器运行时，在 macOS 和 Linux 上都可以使用。只需运行 `/setup`。

**这个项目安全吗？**

智能体在容器中运行，而不是在应用级别的权限检查之后。它们只能访问被明确挂载的目录。您仍然应该审查您运行的代码，但这个代码库小到您真的可以做到。完整的安全模型请见 [docs/SECURITY.md](docs/SECURITY.md)。

**为什么没有配置文件？**

我们不希望配置泛滥。每个用户都应该定制它，让代码完全符合他们的需求，而不是去配置一个通用的系统。如果您喜欢用配置文件，告诉 Claude 让它加上。

**我该如何调试问题？**

问 Claude Code。"为什么计划任务没有运行？" "最近的日志里有什么？" "为什么这条消息没有得到回应？" 这就是 AI 原生的方法。

**为什么我的安装不成功？**

我不知道。运行 `claude`，然后运行 `/debug`。如果 Claude 发现一个可能影响其他用户的问题，请开一个 PR 来修改 `SKILL.md` 安装文件。

**什么样的代码更改会被接受？**

安全修复、bug 修复，以及对基础配置的明确改进。仅此而已。

其他一切（新功能、操作系统兼容性、硬件支持、增强功能）都应该作为技能来贡献。

这使得基础系统保持最小化，并让每个用户可以定制他们的安装，而无需继承他们不想要的功能。


------


# NanoClaw 需求（REQUIREMENTS.md）

项目创建者的原始需求和设计决策。

---

## 为什么存在这个项目

这是 OpenClaw（前身为 ClawBot）的轻量级、安全替代方案。该项目变成了一个庞然大物——4-5 个不同的进程运行不同的网关，无尽的配置文件，无尽的集成。这是一个安全噩梦，智能体不会在隔离的进程中运行；有各种各样的漏洞解决方法，试图阻止它们访问不应访问的系统部分。任何人都不可能真正理解整个代码库。当你运行它时，你只是在冒险。

NanoClaw 为您提供了核心功能，而没有那种混乱。

---

## 哲学

### 小到可以理解

整个代码库应该是您可以阅读和理解的。一个 Node.js 进程。几个源文件。无微服务，无消息队列，无抽象层。

### 通过真正的隔离实现安全

不是应用级别的权限系统试图防止智能体访问内容，而是智能体在实际的 Linux 容器中运行。隔离在操作系统级别。智能体只能看到明确挂载的内容。Bash 访问是安全的，因为命令在容器内运行，而不是在您的 Mac 上。

### 为一个用户构建

这不是一个框架或平台。它是为我的特定需求而设计的工作软件。我使用 WhatsApp 和 Email，所以它支持 WhatsApp 和 Email。我不使用 Telegram，所以它不支持 Telegram。我添加我实际想要的集成，而不是每个可能的集成。

### 定制 = 代码更改

无配置蔓延。如果你想要不同的行为，请修改代码。代码库足够小，因此这是安全和实用的。像触发词这样的非常小的东西在配置中。其他一切——只需更改代码即可做您想做的事。

### 原生 AI 开发

我不需要安装向导——Claude Code 会指导设置。我不需要监控仪表板——我问 Claude Code 发生了什么。我不需要复杂的日志 UI——我让 Claude 阅读日志。我不需要调试工具——我描述问题，Claude 修复它。

代码库假设你有一个 AI 合作者。它不需要过度自文档化或自调试，因为 Claude 始终在那里。

### 技能优先于功能

当人们贡献时，他们不应该添加“与 WhatsApp 一起支持 Telegram”。他们应该贡献一个像 `/add-telegram` 这样的技能，以转变代码库。用户 fork 仓库，运行技能进行定制，并最终得到干净的代码，完全符合他们的需求——而不是一个试图同时支持每个人用例的臃肿系统。

---

## RFS（技能请求）

我们希望贡献者构建的技能：

### 通信渠道

添加或切换到不同消息平台的技能：
- `/add-telegram` - 添加 Telegram 作为输入渠道
- `/add-slack` - 添加 Slack 作为输入渠道
- `/add-discord` - 添加 Discord 作为输入渠道
- `/add-sms` - 通过 Twilio 或类似服务添加 SMS
- `/convert-to-telegram` - 完全替换 WhatsApp 为 Telegram

### 容器运行时

项目默认使用 Docker（跨平台）。对于喜欢 Apple Container 的 macOS 用户：
- `/convert-to-apple-container` - 从 Docker 切换到 Apple Container（仅限 macOS）

### 平台支持
- `/setup-linux` - 使完整设置在 Linux 上工作（取决于 Docker 转换）
- `/setup-windows` - 通过 WSL2 + Docker 支持 Windows

---

## 愿景

一个可通过 WhatsApp 访问的个人 Claude 助手，具有最少的自定义代码。

**核心组件：**
- **Claude Agent SDK** 作为核心智能体
- **容器** 用于隔离的智能体执行（Linux VM）
- **WhatsApp** 作为主要 I/O 渠道
- **持久内存** 按对话和全局存储
- **可安排任务** 运行 Claude 并可以回复消息
- **Web 访问** 用于搜索和浏览
- **浏览器自动化** 通过 agent-browser

**实现方法：**
- 使用现有工具（WhatsApp 连接器、Claude Agent SDK、MCP 服务器）
- 最少的粘合代码
- 尽可能使用基于文件的系统（CLAUDE.md 用于内存，文件夹用于群组）

---

## 架构决策

### 消息路由
- 路由器监听 WhatsApp 并根据配置路由消息
- 仅处理已注册群组的消息
- 触发词：`@Andy` 前缀（不区分大小写），可通过 `ASSISTANT_NAME` 环境变量配置
- 未注册的群组会被完全忽略

### 内存系统
- **按组内存**：每个群组有一个文件夹，包含自己的 `CLAUDE.md`
- **全局内存**：根 `CLAUDE.md` 被所有群组读取，但仅可从“main”（自聊天）写入
- **文件**：群组可以在其文件夹中创建/读取文件并引用它们
- 智能体在群组的文件夹中运行，自动继承两个 CLAUDE.md 文件

### 会话管理
- 每个群组维护一个对话会话（通过 Claude Agent SDK）
- 会话在上下文过长时自动压缩，保留关键信息

### 容器隔离
- 所有智能体在容器（轻量级 Linux VM）中运行
- 每个智能体调用生成一个包含挂载目录的容器
- 容器提供文件系统隔离——智能体只能看到明确挂载的内容
- Bash 访问是安全的，因为命令在容器内运行，而不是在您的 Mac 上
- 通过容器中的 Chromium 实现浏览器自动化

### 可安排任务
- 用户可以从任何群组要求 Claude 安排定期或一次性任务
- 任务在创建它们的群组上下文中作为完整智能体运行
- 任务可以访问所有工具，包括 Bash（在容器中安全）
- 任务可以选择通过 `send_message` 工具向其群组发送消息，或静默完成
- 任务运行记录在数据库中，包含持续时间和结果
- 调度类型：cron 表达式、间隔（毫秒）或一次性（ISO 时间戳）
- 从 main 群组：可以为任何群组安排任务，查看/管理所有任务
- 从其他群组：只能管理该群组的任务

### 群组管理
- 新群组通过 main 渠道明确添加
- 群组在 SQLite 中注册（通过 main 渠道或 IPC `register_group` 命令）
- 每个群组在 `groups/` 下有一个专门的文件夹
- 群组可以通过 `containerConfig` 挂载额外的目录

### Main 渠道权限
- Main 渠道是管理员/控制群组（通常是自聊天）
- 可以写入全局内存（`groups/CLAUDE.md`）
- 可以为任何群组安排任务
- 可以查看和管理所有群组的任务
- 可以为任何群组配置额外的目录挂载

---

## 集成点

### WhatsApp
- 使用 baileys 库进行 WhatsApp Web 连接
- 消息存储在 SQLite 中，由路由器轮询
- 设置期间的 QR 码认证

### 调度器
- 内置调度器在主机上运行，为任务执行生成容器
- 容器内的自定义 `nanoclaw` MCP 服务器提供调度工具
- 工具：`schedule_task`、`list_tasks`、`pause_task`、`resume_task`、`cancel_task`、`send_message`
- 任务存储在 SQLite 中，包含运行历史
- 调度器循环每分钟检查一次到期任务
- 任务在容器化的群组上下文中执行 Claude Agent SDK

### Web 访问
- 内置 WebSearch 和 WebFetch 工具
- 标准 Claude Agent SDK 功能

### 浏览器自动化
- 容器内的 Chromium 与 agent-browser CLI
- 基于快照的交互，带有元素引用（@e1、@e2 等）
- 截图、PDF、视频录制
- 认证状态持久化

---

## 设置与定制

### 哲学
- 最少的配置文件
- 设置和定制通过 Claude Code 完成
- 用户克隆仓库并运行 Claude Code 进行配置
- 每个用户获得符合其确切需求的自定义设置

### 技能
- `/setup` - 安装依赖、认证 WhatsApp、配置调度器、启动服务
- `/customize` - 用于添加功能的通用技能（新渠道如 Telegram、新集成、行为更改）
- `/update` - 拉取上游更改、与自定义合并、运行迁移

### 部署
- 在本地 Mac 上通过 launchd 运行
- 单个 Node.js 进程处理所有事情

---

## 个人配置（参考）

这些是创建者的设置，在此处存储以供参考：
- **触发词**：`@Andy`（不区分大小写）
- **响应前缀**：`Andy:`（自动添加）
- **角色**：默认 Claude（无自定义个性）
- **Main 渠道**：自聊天（在 WhatsApp 中向自己发送消息）

---

## 项目名称

**NanoClaw** - 参考 Clawdbot（现在的 OpenClaw）。


------


# NanoClaw 规格说明（SPEC.md）

一个可通过 WhatsApp 访问的个人 Claude 助手，每个对话具有持久内存、可安排任务和电子邮件集成。

---

## 目录

1. [架构](#架构)
2. [文件夹结构](#文件夹结构)
3. [配置](#配置)
4. [内存系统](#内存系统)
5. [会话管理](#会话管理)
6. [消息流程](#消息流程)
7. [命令](#命令)
8. [可安排任务](#可安排任务)
9. [MCP 服务器](#mcp-服务器)
10. [部署](#部署)
11. [安全考虑](#安全考虑)

---

## 架构

```
┌─────────────────────────────────────────────────────────────────────┐
│                        主机（macOS）                                 │
│                   （主 Node.js 进程）                                │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌──────────────┐                     ┌────────────────────┐        │
│  │  WhatsApp    │────────────────────▶│   SQLite 数据库    │        │
│  │  (baileys)   │◀────────────────────│   (messages.db)    │        │
│  └──────────────┘   存储/发送        └─────────┬──────────┘        │
│                                                  │                   │
│         ┌────────────────────────────────────────┘                   │
│         │                                                            │
│         ▼                                                            │
│  ┌──────────────────┐    ┌──────────────────┐    ┌───────────────┐  │
│  │  消息循环        │    │  调度器循环      │    │  IPC 监听器    │  │
│  │ （轮询 SQLite）  │    │ （检查任务）     │    │ （基于文件）   │  │
│  └────────┬─────────┘    └────────┬─────────┘    └───────────────┘  │
│           │                       │                                  │
│           └───────────┬───────────┘                                  │
│                       │ 生成容器                                     │
│                       ▼                                              │
├─────────────────────────────────────────────────────────────────────┤
│                     容器（Linux VM）                               │
├─────────────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │                    智能体运行器                               │   │
│  │                                                                │   │
│  │  工作目录: /workspace/group（从主机挂载）                      │   │
│  │  卷挂载:                                                    │   │
│  │    • groups/{name}/ → /workspace/group                      │   │
│  │    • groups/global/ → /workspace/global/（非主群组）         │   │
│  │    • data/sessions/{group}/.claude/ → /home/node/.claude/    │   │
│  │    • 额外目录 → /workspace/extra/*                           │   │
│  │                                                                │   │
│  │  工具（所有群组）：                                           │   │
│  │    • Bash（安全 - 在容器中沙盒化！）                           │   │
│  │    • Read、Write、Edit、Glob、Grep（文件操作）                 │   │
│  │    • WebSearch、WebFetch（互联网访问）                         │   │
│  │    • agent-browser（浏览器自动化）                            │   │
│  │    • mcp__nanoclaw__*（通过 IPC 的调度器工具）                  │   │
│  │                                                                │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

### 技术栈

| 组件 | 技术 | 用途 |
|-----------|------------|---------|
| WhatsApp 连接 | Node.js (@whiskeysockets/baileys) | 连接到 WhatsApp，发送/接收消息 |
| 消息存储 | SQLite (better-sqlite3) | 存储消息用于轮询 |
| 容器运行时 | Containers (Linux VMs) | 用于智能体执行的隔离环境 |
| 智能体 | @anthropic-ai/claude-agent-sdk (0.2.29) | 运行 Claude 并提供工具和 MCP 服务器 |
| 浏览器自动化 | agent-browser + Chromium | Web 交互和截图 |
| 运行时 | Node.js 20+ | 主机进程用于路由和调度 |

---

## 文件夹结构

```
nanoclaw/
├── CLAUDE.md                      # 项目上下文（供 Claude Code 使用）
├── docs/
│   ├── SPEC.md                    # 本规格说明文档
│   ├── REQUIREMENTS.md            # 架构决策
│   └── SECURITY.md                # 安全模型
├── README.md                      # 用户文档
├── package.json                   # Node.js 依赖
├── tsconfig.json                  # TypeScript 配置
├── .mcp.json                      # MCP 服务器配置（参考）
├── .gitignore
│
├── src/
│   ├── index.ts                   # 编排器：状态、消息循环、智能体调用
│   ├── channels/
│   │   └── whatsapp.ts            # WhatsApp 连接、认证、发送/接收
│   ├── ipc.ts                     # IPC 监听器和任务处理
│   ├── router.ts                  # 消息格式化和出站路由
│   ├── config.ts                  # 配置常量
│   ├── types.ts                   # TypeScript 接口（包含 Channel）
│   ├── logger.ts                  # Pino 日志设置
│   ├── db.ts                      # SQLite 数据库初始化和查询
│   ├── group-queue.ts             # 每个群组的队列，带有全局并发限制
│   ├── mount-security.ts          # 容器挂载的允许列表验证
│   ├── whatsapp-auth.ts           # 独立的 WhatsApp 认证
│   ├── task-scheduler.ts          # 运行到期的任务
│   └── container-runner.ts        # 在容器中生成智能体
│
├── container/
│   ├── Dockerfile                 # 容器镜像（以 'node' 用户身份运行，包含 Claude Code CLI）
│   ├── build.sh                   # 容器镜像构建脚本
│   ├── agent-runner/              # 容器内部运行的代码
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── src/
│   │       ├── index.ts           # 入口点（查询循环、IPC 轮询、会话恢复）
│   │       └── ipc-mcp-stdio.ts   # 用于主机通信的基于标准 IO 的 MCP 服务器
│   └── skills/
│       └── agent-browser.md       # 浏览器自动化技能
│
├── dist/                          # 编译后的 JavaScript（gitignore）
│
├── .claude/
│   └── skills/
│       ├── setup/SKILL.md              # /setup - 首次安装
│       ├── customize/SKILL.md          # /customize - 添加功能
│       ├── debug/SKILL.md              # /debug - 容器调试
│       ├── add-telegram/SKILL.md       # /add-telegram - Telegram 渠道
│       ├── add-gmail/SKILL.md          # /add-gmail - Gmail 集成
│       ├── add-voice-transcription/    # /add-voice-transcription - Whisper 语音转录
│       ├── x-integration/SKILL.md      # /x-integration - X/Twitter
│       ├── convert-to-apple-container/  # /convert-to-apple-container - Apple Container 运行时
│       └── add-parallel/SKILL.md       # /add-parallel - 并行智能体
│
├── groups/
│   ├── CLAUDE.md                  # 全局内存（所有群组都读取）
│   ├── main/                      # 自聊天（主控制渠道）
│   │   ├── CLAUDE.md              # 主渠道内存
│   │   └── logs/                  # 任务执行日志
│   └── {Group Name}/              # 每个群组的文件夹（注册时创建）
│       ├── CLAUDE.md              # 群组特定内存
│       ├── logs/                  # 该群组的任务日志
│       └── *.md                   # 对话过程中创建的文件
│
├── store/                         # 本地数据（gitignore）
│   ├── auth/                      # WhatsApp 认证状态
│   └── messages.db                # SQLite 数据库（消息、聊天、scheduled_tasks、task_run_logs、registered_groups、sessions、router_state）
│
├── data/                          # 应用状态（gitignore）
│   ├── sessions/                  # 每个群组的会话数据（.claude/ 目录包含 JSONL 转录）
│   ├── env/env                    # .env 的副本，用于容器挂载
│   └── ipc/                       # 容器 IPC（messages/、tasks/）
│
├── logs/                          # 运行时日志（gitignore）
│   ├── nanoclaw.log               # 主机标准输出
│   └── nanoclaw.error.log         # 主机标准错误
│   # 注意：每个容器的日志在 groups/{folder}/logs/container-*.log 中
│
└── launchd/
    └── com.nanoclaw.plist         # macOS 服务配置
```

---

## 配置

配置常量位于 `src/config.ts` 中：

```typescript
import path from 'path';

export const ASSISTANT_NAME = process.env.ASSISTANT_NAME || 'Andy';
export const POLL_INTERVAL = 2000;
export const SCHEDULER_POLL_INTERVAL = 60000;

// 路径是绝对路径（容器挂载需要）
const PROJECT_ROOT = process.cwd();
export const STORE_DIR = path.resolve(PROJECT_ROOT, 'store');
export const GROUPS_DIR = path.resolve(PROJECT_ROOT, 'groups');
export const DATA_DIR = path.resolve(PROJECT_ROOT, 'data');

// 容器配置
export const CONTAINER_IMAGE = process.env.CONTAINER_IMAGE || 'nanoclaw-agent:latest';
export const CONTAINER_TIMEOUT = parseInt(process.env.CONTAINER_TIMEOUT || '1800000', 10); // 默认 30 分钟
export const IPC_POLL_INTERVAL = 1000;
export const IDLE_TIMEOUT = parseInt(process.env.IDLE_TIMEOUT || '1800000', 10); // 30 分钟 — 消息间保持容器存活
export const MAX_CONCURRENT_CONTAINERS = Math.max(1, parseInt(process.env.MAX_CONCURRENT_CONTAINERS || '5', 10) || 5);

export const TRIGGER_PATTERN = new RegExp(`^@${ASSISTANT_NAME}\\b`, 'i');
```

**注意：** 路径必须是绝对路径，以便容器卷挂载正确工作。

### 容器配置

群组可以通过 SQLite `registered_groups` 表中的 `containerConfig` 添加额外的挂载目录（以 JSON 格式存储在 `container_config` 列中）。示例注册：

```typescript
registerGroup("1234567890@g.us", {
  name: "开发团队",
  folder: "dev-team",
  trigger: "@Andy",
  added_at: new Date().toISOString(),
  containerConfig: {
    additionalMounts: [
      {
        hostPath: "~/projects/webapp",
        containerPath: "webapp",
        readonly: false,
      },
    ],
    timeout: 600000,
  },
});
```

额外的挂载在容器内出现在 `/workspace/extra/{containerPath}` 处。

**挂载语法说明：** 读写挂载使用 `-v host:container`，但只读挂载需要 `--mount "type=bind,source=...,target=...,readonly"`（`:ro` 后缀可能在所有运行时上都不工作）。

### Claude 认证

在项目根目录的 `.env` 文件中配置认证。有两个选项：

**选项 1：Claude 订阅（OAuth 令牌）**
```bash
CLAUDE_CODE_OAUTH_TOKEN=sk-ant-oat01-...
```
如果您已登录到 Claude Code，可以从 `~/.claude/.credentials.json` 中提取令牌。

**选项 2：按使用付费的 API 密钥**
```bash
ANTHROPIC_API_KEY=sk-ant-api03-...
```

只有认证变量（`CLAUDE_CODE_OAUTH_TOKEN` 和 `ANTHROPIC_API_KEY`）会从 `.env` 中提取并写入 `data/env/env`，然后挂载到容器的 `/workspace/env-dir/env` 并由入口点脚本读取。这样可以确保 `.env` 中的其他环境变量不会暴露给智能体。需要此解决方法是因为某些容器运行时在使用 `-i`（带管道标准输入的交互模式）时会丢失 `-e` 环境变量。

### 更改助手名称

设置 `ASSISTANT_NAME` 环境变量：

```bash
ASSISTANT_NAME=Bot npm start
```

或者编辑 `src/config.ts` 中的默认值。这会更改：
- 触发模式（消息必须以 `@YourName` 开头）
- 响应前缀（自动添加 `YourName:`）

### launchd 中的占位符值

包含 `{{PLACEHOLDER}}` 值的文件需要配置：
- `{{PROJECT_ROOT}}` - NanoClaw 安装的绝对路径
- `{{NODE_PATH}}` - Node 二进制文件的路径（通过 `which node` 检测）
- `{{HOME}}` - 用户的主目录

---

## 内存系统

NanoClaw 使用基于 CLAUDE.md 文件的分层内存系统。

### 内存层次结构

| 级别 | 位置 | 读取者 | 写入者 | 用途 |
|-------|----------|---------|------------|---------|
| **全局** | `groups/CLAUDE.md` | 所有群组 | 仅主群组 | 跨所有对话共享的偏好、事实、上下文 |
| **群组** | `groups/{name}/CLAUDE.md` | 该群组 | 该群组 | 群组特定上下文、对话内存 |
| **文件** | `groups/{name}/*.md` | 该群组 | 该群组 | 对话过程中创建的笔记、研究、文档 |

### 内存如何工作

1. **智能体上下文加载**
   - 智能体以 `cwd` 设置为 `groups/{group-name}/` 运行
   - 使用 `settingSources: ['project']` 的 Claude Agent SDK 会自动加载：
     - `../CLAUDE.md`（父目录 = 全局内存）
     - `./CLAUDE.md`（当前目录 = 群组内存）

2. **写入内存**
   - 当用户说“记住这个”时，智能体会写入 `./CLAUDE.md`
   - 当用户说“全局记住这个”（仅主渠道）时，智能体会写入 `../CLAUDE.md`
   - 智能体可以在群组文件夹中创建 `notes.md`、`research.md` 等文件

3. **主渠道权限**
   - 只有“主”群组（自聊天）可以写入全局内存
   - 主渠道可以管理注册的群组并为任何群组安排任务
   - 主渠道可以为任何群组配置额外的目录挂载
   - 所有群组都有 Bash 访问权限（安全，因为在容器内运行）

---

## 会话管理

会话实现对话连续性 —— Claude 会记住您之前的对话内容。

### 会话如何工作

1. 每个群组在 SQLite 中有一个会话 ID（`sessions` 表，按 `group_folder` 键控）
2. 会话 ID 传递给 Claude Agent SDK 的 `resume` 选项
3. Claude 继续完整上下文的对话
4. 会话转录存储为 JSONL 文件，位于 `data/sessions/{group}/.claude/` 中

---

## 消息流程

### 传入消息流程

```
1. 用户发送 WhatsApp 消息
   │
   ▼
2. Baileys 通过 WhatsApp Web 协议接收消息
   │
   ▼
3. 消息存储在 SQLite 中（store/messages.db）
   │
   ▼
4. 消息循环轮询 SQLite（每 2 秒）
   │
   ▼
5. 路由器检查：
   ├── 聊天 jid 是否在注册群组中（SQLite）？→ 否：忽略
   └── 消息是否匹配触发模式？→ 否：存储但不处理
   │
   ▼
6. 路由器获取对话上下文：
   ├── 获取自上次智能体交互以来的所有消息
   ├── 使用时间戳和发送者姓名格式化
   └── 构建包含完整对话上下文的提示
   │
   ▼
7. 路由器调用 Claude Agent SDK：
   ├── cwd: groups/{group-name}/
   ├── prompt: 对话历史 + 当前消息
   ├── resume: session_id（用于连续性）
   └── mcpServers: nanoclaw（调度器）
   │
   ▼
8. Claude 处理消息：
   ├── 读取 CLAUDE.md 文件以获取上下文
   └── 使用所需工具（搜索、邮件等）
   │
   ▼
9. 路由器在响应前添加助手名称前缀并通过 WhatsApp 发送
   │
   ▼
10. 路由器更新最后智能体交互时间戳并保存会话 ID
```

### 触发词匹配

消息必须以触发模式开头（默认：`@Andy`）：
- `@Andy 今天天气怎么样？` → ✅ 触发 Claude
- `@andy 帮我一下` → ✅ 触发（不区分大小写）
- `嘿 @Andy` → ❌ 忽略（触发词不在开头）
- `最近怎么样？` → ❌ 忽略（无触发词）

### 对话上下文获取

当触发消息到达时，智能体会接收自其上次在该聊天中交互以来的所有消息。每条消息都格式化为包含时间戳和发送者姓名：

```
[1月31日 下午2:32] John: 大家好，今晚我们吃披萨好吗？
[1月31日 下午2:33] Sarah: 我觉得不错
[1月31日 下午2:35] John: @Andy 你推荐什么配料？
```

这使得智能体能够理解对话上下文，即使它没有在每条消息中被提及。

---

## 命令

### 任何群组中可用的命令

| 命令 | 示例 | 效果 |
|---------|---------|--------|
| `@Assistant [消息]` | `@Andy 今天天气怎么样？` | 与 Claude 聊天 |

### 仅主渠道可用的命令

| 命令 | 示例 | 效果 |
|---------|---------|--------|
| `@Assistant add group "名称"` | `@Andy add group "家庭聊天"` | 注册新群组 |
| `@Assistant remove group "名称"` | `@Andy remove group "工作团队"` | 取消注册群组 |
| `@Assistant list groups` | `@Andy list groups` | 显示注册的群组 |
| `@Assistant remember [事实]` | `@Andy remember 我喜欢深色模式` | 添加到全局内存 |

---

## 可安排任务

NanoClaw 有一个内置调度器，可在群组上下文中运行任务作为完整智能体。

### 调度如何工作

1. **群组上下文**：在群组中创建的任务在该群组的工作目录和内存中运行
2. **完整智能体功能**：可安排任务可以访问所有工具（WebSearch、文件操作等）
3. **可选消息**：任务可以使用 `send_message` 工具向其群组发送消息，或静默完成
4. **主渠道权限**：主渠道可以为任何群组安排任务并查看所有任务

### 调度类型

| 类型 | 值格式 | 示例 |
|------|--------------|---------|
| `cron` | Cron 表达式 | `0 9 * * 1`（每周一上午 9 点） |
| `interval` | 毫秒 | `3600000`（每小时） |
| `once` | ISO 时间戳 | `2024-12-25T09:00:00Z` |

### 创建任务

```
用户: @Andy 每周一上午 9 点提醒我查看每周指标

Claude: [调用 mcp__nanoclaw__schedule_task]
        {
          "prompt": "发送提醒查看每周指标。要鼓励！",
          "schedule_type": "cron",
          "schedule_value": "0 9 * * 1"
        }

Claude: 完成！我会每周一上午 9 点提醒你。
```

### 一次性任务

```
用户: @Andy 今天下午 5 点，给我发送今天的邮件摘要

Claude: [调用 mcp__nanoclaw__schedule_task]
        {
          "prompt": "搜索今天的邮件，总结重要内容，并将摘要发送到群组。",
          "schedule_type": "once",
          "schedule_value": "2024-01-31T17:00:00Z"
        }
```

### 管理任务

从任何群组：
- `@Andy list my scheduled tasks` - 查看该群组的任务
- `@Andy pause task [id]` - 暂停任务
- `@Andy resume task [id]` - 恢复暂停的任务
- `@Andy cancel task [id]` - 删除任务

从主渠道：
- `@Andy list all tasks` - 查看所有群组的任务
- `@Andy schedule task for "家庭聊天": [提示]` - 为其他群组安排任务

---

## MCP 服务器

### NanoClaw MCP（内置）

`nanoclaw` MCP 服务器是每个智能体调用时根据当前群组上下文动态创建的。

**可用工具：**
| 工具 | 用途 |
|------|---------|
| `schedule_task` | 安排定期或一次性任务 |
| `list_tasks` | 显示任务（群组任务，或主渠道显示所有任务） |
| `get_task` | 获取任务详情和运行历史 |
| `update_task` | 修改任务提示或调度 |
| `pause_task` | 暂停任务 |
| `resume_task` | 恢复暂停的任务 |
| `cancel_task` | 删除任务 |
| `send_message` | 向群组发送 WhatsApp 消息 |

---

## 部署

NanoClaw 作为单个 macOS launchd 服务运行。

### 启动序列

当 NanoClaw 启动时，它会：
1. **确保容器运行时正在运行** - 自动启动（如需要）；杀死上一次运行中遗留的孤立 NanoClaw 容器
2. 初始化 SQLite 数据库（如果存在 JSON 文件则迁移）
3. 从 SQLite 加载状态（注册的群组、会话、路由器状态）
4. 连接到 WhatsApp（在 `connection.open` 上）：
   - 启动调度器循环
   - 启动用于容器消息的 IPC 监听器
   - 设置带有 `processGroupMessages` 的每个群组的队列
   - 恢复关闭前的任何未处理消息
   - 启动消息轮询循环

### 服务：com.nanoclaw

**launchd/com.nanoclaw.plist：**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "...">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.nanoclaw</string>
    <key>ProgramArguments</key>
    <array>
        <string>{{NODE_PATH}}</string>
        <string>{{PROJECT_ROOT}}/dist/index.js</string>
    </array>
    <key>WorkingDirectory</key>
    <string>{{PROJECT_ROOT}}</string>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <true/>
    <key>EnvironmentVariables</key>
    <dict>
        <key>PATH</key>
        <string>{{HOME}}/.local/bin:/usr/local/bin:/usr/bin:/bin</string>
        <key>HOME</key>
        <string>{{HOME}}</string>
        <key>ASSISTANT_NAME</key>
        <string>Andy</string>
    </dict>
    <key>StandardOutPath</key>
    <string>{{PROJECT_ROOT}}/logs/nanoclaw.log</string>
    <key>StandardErrorPath</key>
    <string>{{PROJECT_ROOT}}/logs/nanoclaw.error.log</string>
</dict>
</plist>
```

### 管理服务

```bash
# 安装服务
cp launchd/com.nanoclaw.plist ~/Library/LaunchAgents/

# 启动服务
launchctl load ~/Library/LaunchAgents/com.nanoclaw.plist

# 停止服务
launchctl unload ~/Library/LaunchAgents/com.nanoclaw.plist

# 检查状态
launchctl list | grep nanoclaw

# 查看日志
tail -f logs/nanoclaw.log
```

---

## 安全考虑

### 容器隔离

所有智能体在容器（轻量级 Linux VM）中运行，提供：
- **文件系统隔离**：智能体只能访问挂载的目录
- **安全的 Bash 访问**：命令在容器内运行，而不是在你的 Mac 上
- **网络隔离**：可以按容器配置
- **进程隔离**：容器进程无法影响主机
- **非 root 用户**：容器以无特权的 `node` 用户（uid 1000）运行

### 提示注入风险

WhatsApp 消息可能包含恶意指令，试图操纵 Claude 的行为。

**缓解措施：**
- 容器隔离限制了影响范围
- 仅处理注册群组的消息
- 需要触发词（减少意外处理）
- 智能体只能访问其群组的挂载目录
- 主渠道可以为每个群组配置额外的目录
- Claude 的内置安全训练

**建议：**
- 只注册可信任的群组
- 仔细检查额外的目录挂载
- 定期查看可安排任务
- 监控日志以发现异常活动

### 凭证存储

| 凭证 | 存储位置 | 说明 |
|------------|------------------|-------|
| Claude CLI 认证 | data/sessions/{group}/.claude/ | 按群组隔离，挂载到 /home/node/.claude/ |
| WhatsApp 会话 | store/auth/ | 自动创建，持续约 20 天 |

### 文件权限

groups/ 文件夹包含个人内存，应受到保护：
```bash
chmod 700 groups/
```

---

## 故障排除

### 常见问题

| 问题 | 原因 | 解决方案 |
|-------|-------|----------|
| 消息无响应 | 服务未运行 | 检查 `launchctl list | grep nanoclaw` |
| "Claude Code 进程以代码 1 退出" | 容器运行时启动失败 | 检查日志；NanoClaw 会自动启动容器运行时，但可能失败 |
| "Claude Code 进程以代码 1 退出" | 会话挂载路径错误 | 确保挂载到 `/home/node/.claude/` 而不是 `/root/.claude/` |
| 会话不继续 | 会话 ID 未保存 | 检查 SQLite：`sqlite3 store/messages.db "SELECT * FROM sessions"` |
| 会话不继续 | 挂载路径不匹配 | 容器用户是 `node`，HOME=/home/node；会话必须位于 `/home/node/.claude/` |
| "QR 码已过期" | WhatsApp 会话过期 | 删除 store/auth/ 并重启 |
| "无注册群组" | 尚未添加群组 | 在主渠道中使用 `@Andy add group "名称"` |

### 日志位置

- `logs/nanoclaw.log` - 标准输出
- `logs/nanoclaw.error.log` - 标准错误

### 调试模式

手动运行以获取详细输出：
```bash
npm run dev
# 或
node dist/index.js
```


------


# NanoClaw 技能架构（nanoclaw-architecture-final.md）

## 技能的用途

NanoClaw 的核心故意设计得非常精简。技能是用户扩展其功能的方式：添加渠道、集成、跨平台支持，或者完全替换内部组件。例如：在 WhatsApp 旁边添加 Telegram，从 Apple Container 切换到 Docker，添加 Gmail 集成，添加语音消息转录。每个技能都会修改实际的代码库，添加渠道处理程序，更新消息路由器，更改容器配置，并添加依赖项，而不是通过插件 API 或运行时钩子工作。

## 为什么选择这种架构

问题：用户需要将对共享代码库的多个修改结合起来，保持这些修改在核心更新中正常工作，并且在不成为 git 专家或丢失自定义更改的情况下完成所有这些。插件系统会更简单，但会限制技能可以做的事情。赋予技能对代码库的完全访问权限意味着它们可以更改任何内容，但这会造成合并冲突、更新中断和状态跟踪挑战。

这种架构通过使用标准 git 机制使技能应用完全程序化来解决这个问题，AI 作为 git 无法解决的冲突的备用方案，以及共享的解决缓存，因此大多数用户永远不会遇到这些冲突。结果：用户可以组合他们想要的精确功能，自定义会自动在核心更新中幸存，并且系统始终可恢复。

## 核心原则

技能是独立的、可审计的包，通过标准 git 合并机制应用。Claude Code 协调这一过程——运行 git 命令，读取技能清单，并仅在 git 无法解决冲突时介入。系统使用现有的 git 功能（`merge-file`、`rerere`、`apply`），而不是自定义的合并基础设施。

## 三级解决模型

每个操作都遵循以下升级流程：

1. **Git**——确定性。`git merge-file` 合并，`git rerere` 重播缓存的解决方案，结构化操作无需合并即可应用。无 AI。处理绝大多数情况。
2. **Claude Code**——读取 `SKILL.md`、`.intent.md` 和 `state.yaml` 以解决 git 无法处理的冲突。通过 `git rerere` 缓存解决方案，因此同一冲突永远不需要解决两次。
3. **Claude Code + 用户输入**——当 Claude Code 缺乏足够的上下文来确定意图时（例如，两个功能在应用程序级别真正冲突），它会向用户寻求决策，然后使用该输入执行解决。Claude Code 仍然会完成工作——用户提供方向，而不是代码。

**重要提示：** 干净的合并并不能保证代码正常工作。语义冲突会产生在运行时崩溃的干净文本合并。**每个操作后必须运行测试。**

## 备份/恢复安全

在任何操作之前，所有受影响的文件都会复制到 `.nanoclaw/backup/`。成功后，备份会被删除。失败时，会恢复备份。对于不使用 git 的用户来说，这是安全的。

## 共享基础

`.nanoclaw/base/` 保存核心代码库的干净副本。这是所有三路合并的单一公共祖先，仅在核心更新时更新。

## 两种类型的更改

### 代码文件（三路合并）

技能在其中编织逻辑的源代码。通过 `git merge-file` 与共享基础合并。技能包含完整的修改文件。

### 结构化数据（确定性操作）

像 `package.json`、`docker-compose.yml`、`.env.example` 这样的文件。技能在清单中声明要求；系统以编程方式应用它们。多个技能的声明会被批量处理——依赖项合并，`package.json` 只写入一次，`npm install` 只运行一次。

```yaml
structured:
  npm_dependencies:
    whatsapp-web.js: "^2.1.0"
  env_additions:
    - WHATSAPP_TOKEN
  docker_compose_services:
    whatsapp-redis:
      image: redis:alpine
      ports: ["6380:6379"]
```

结构化冲突（版本不兼容、端口冲突）遵循相同的三级解决模型。

## 技能包结构

技能只包含它添加或修改的文件。修改后的代码文件包含**完整文件**（干净核心 + 技能的更改），使得 `git merge-file` 简单且可审计。

```
skills/add-whatsapp/
  SKILL.md                    # 此技能的功能和用途
  manifest.yaml               # 元数据、依赖项、结构化操作
  tests/whatsapp.test.ts      # 集成测试
  add/src/channels/whatsapp.ts          # 新文件
  modify/src/server.ts                  # 用于合并的完整修改文件
  modify/src/server.ts.intent.md        # 用于冲突解决的结构化意图
```

### 意图文件

每个修改后的文件都有一个 `.intent.md` 文件，包含结构化标题：**What this skill adds**、**Key sections**、**Invariants** 和 **Must-keep sections**。这些在冲突解决过程中为 Claude Code 提供特定指导。

### 清单

声明：技能元数据、核心版本兼容性、添加/修改的文件、文件操作、结构化操作、技能关系（冲突、依赖、测试对象）、应用后命令和测试命令。

## 定制和分层

**一个技能，一条幸福之路**——技能为 80% 的用户实现合理的默认值。

**定制 = 代码更改**。应用技能，然后通过跟踪的补丁、直接编辑或附加分层技能进行修改。自定义修改记录在 `state.yaml` 中，并且可重播。

**技能通过 `depends` 分层**。扩展技能构建在基础技能之上（例如，`telegram-reactions` 依赖于 `add-telegram`）。

## 文件操作

重命名、删除和移动在清单中声明，并在代码合并之前运行。当核心重命名文件时，**路径重映射**会在应用时解析技能引用——技能包永远不会被修改。

## 应用流程

1. 预检检查（兼容性、依赖项、未跟踪的变更）
2. 备份
3. 文件操作 + 路径重映射
4. 复制新文件
5. 合并修改后的代码文件（`git merge-file`）
6. 冲突解决（共享缓存 → `git rerere` → Claude Code → Claude Code + 用户输入）
7. 应用结构化操作（批量处理）
8. 应用后命令，更新 `state.yaml`
9. **运行测试**（强制，即使所有合并都干净）
10. 清理（成功时删除备份，失败时恢复）

## 共享解决缓存

`.nanoclaw/resolutions/` 包含预先计算的、经过验证的冲突解决方案，具有**哈希强制执行**——缓存的解决方案仅在 base、current 和 skill 输入哈希完全匹配时才会应用。

### rerere 适配器

`git rerere` 需要未合并的索引条目，而 `git merge-file` 不会创建这些条目。适配器在 `merge-file` 产生冲突后设置所需的索引状态，启用 rerere 缓存。

## 状态跟踪

`.nanoclaw/state.yaml` 记录：核心版本、所有应用的技能（包含每个文件的 base/skill/merged 哈希）、结构化操作结果、自定义补丁和路径重映射。这使得漂移检测即时且重播具有确定性。

## 未跟踪的变更

通过哈希比较在任何操作之前检测直接编辑。用户可以将它们记录为跟踪的补丁、继续未跟踪或中止。三级模型可以从任何起点恢复连贯状态。

## 核心更新

大多数更改通过三路合并自动传播。**重大更改**需要**迁移技能**——一个常规技能，保留旧行为，针对新核心编写。迁移在 `migrations.yaml` 中声明，并在更新期间自动应用。

### 更新流程

1. 预览变更（仅 git，无文件修改）
2. 备份 → 文件操作 → 三路合并 → 冲突解决
3. 重新应用自定义补丁（`git apply --3way`）
4. **将基础更新到新核心**
5. 应用迁移技能（自动保留用户的设置）
6. 重新应用更新的技能（仅版本变更的技能）
7. 重新运行结构化操作 → 运行所有测试 → 清理

用户在更新过程中看不到提示。以后要接受新的默认值，他们可以删除迁移技能。

## 技能删除

卸载是**不包含该技能的重播**：读取 `state.yaml`，删除目标技能，使用解决缓存从干净的基础重播所有剩余技能。备份以确保安全。

## 变基

将累积的层扁平化为干净的起点。更新基础，重新生成差异，清除旧补丁和过时的缓存条目。

## 重播

给定 `state.yaml`，在没有 AI 的情况下在新机器上重现精确安装（假设所有解决方案都已缓存）。按顺序应用技能，合并，应用自定义补丁，批量结构化操作，运行测试。

## 技能测试

每个技能都包含集成测试。测试**总是**运行——应用后、更新后、卸载后、重播期间、CI 中。CI 单独测试所有官方技能，并对共享修改文件或结构化操作的技能进行成对组合测试。

## 设计原则

1. 使用 git，不要重新发明它。
2. 三级解决：git → Claude Code → Claude Code + 用户输入。
3. 干净的合并是不够的。每个操作后运行测试。
4. 所有操作都是安全的。备份/恢复，无半应用状态。
5. 一个共享基础，仅在核心更新时更新。
6. 代码合并与结构化操作。源代码被合并；配置被聚合。
7. 解决方案通过哈希强制执行进行学习和共享。
8. 一个技能，一条幸福之路。定制是更多的补丁。
9. 技能分层和组合。
10. 意图是一等公民且结构化。
11. 状态是明确且完整的。重播具有确定性。
12. 始终可恢复。
13. 卸载是重播。
14. 核心更新是维护者的责任。重大更改需要迁移技能。
15. 文件操作和路径重映射是一等公民。
16. 技能经过测试。CI 按重叠进行成对测试。
17. 确定性序列化。无噪声差异。
18. 必要时变基。
19. 渐进式核心瘦身通过迁移技能实现。


------


# NanoClaw 技能架构（nanorepo-architecture.md）

## 核心原则

技能是独立的、可审计的包，通过标准 git 合并机制以编程方式应用。Claude Code 协调这一过程——运行 git 命令，读取技能清单，并仅在 git 无法自行解决冲突时介入。系统使用现有的 git 功能（`merge-file`、`rerere`、`apply`），而不是自定义的合并基础设施。

### 三级解决模型

系统中的每个操作都遵循以下升级流程：

1. **Git**——确定性、程序化。`git merge-file` 合并，`git rerere` 重播缓存的解决方案，结构化操作无需合并即可应用。无 AI 参与。这处理了绝大多数情况。
2. **Claude Code**——读取 `SKILL.md`、`.intent.md`、迁移指南和 `state.yaml` 以理解上下文。解决 git 无法以编程方式处理的冲突。通过 `git rerere` 缓存解决方案，因此它永远不需要再次解决相同的冲突。
3. **用户**——当 Claude Code 缺乏上下文或意图时，会向用户寻求帮助。这种情况很少发生，仅在两个功能在应用程序级别真正冲突（而不仅仅是文本级别的合并冲突）并且需要人类决定所需行为时才会出现。

目标是 Level 1 处理成熟、经过良好测试的安装上的所有事情。Level 2 处理首次冲突和边缘情况。Level 3 很少见，仅用于真正的歧义。

**重要提示：** 干净的合并（退出代码 0）并不保证代码正常工作。语义冲突——重命名变量、移位引用、更改函数签名——可以产生在运行时崩溃的干净文本合并。**每个操作后必须运行测试**，无论合并是否干净。干净但测试失败的合并会升级到 Level 2。

### 通过备份/恢复实现安全操作

许多用户克隆仓库而不 fork，不提交更改，并且不认为自己是 git 用户。系统必须在不需要任何 git 知识的情况下为他们安全地工作。

在任何操作之前，系统会将所有将被修改的文件复制到 `.nanoclaw/backup/`。成功后，备份会被删除。失败时，会恢复备份。无论用户是否提交、推送或理解 git，这都提供了回滚安全性。

---

## 1. 共享基础

`.nanoclaw/base/` 保存干净的核心代码库——在应用任何技能或自定义之前的原始代码库。这是所有三路合并的稳定公共祖先，并且仅在核心更新时才会更改。

- `git merge-file` 使用基础计算两个差异：用户更改的内容（当前 vs 基础）和技能想要更改的内容（基础 vs 技能的修改文件），然后将两者合并
- 基础支持漂移检测：如果文件的哈希值与其基础哈希值不同，则说明某些内容已被修改（技能、用户自定义或两者）
- 每个技能的 `modify/` 文件包含应用该技能后文件应有的完整内容（包括任何先决技能变更），所有内容均针对同一个干净的核心基础编写

在**新鲜代码库**上，用户的文件与基础相同。这意味着 `git merge-file` 对于第一个技能总是干净地退出——合并会简单地产生技能的修改版本。不需要特殊处理。

当多个技能修改同一个文件时，三路合并自然会处理重叠。如果 Telegram 和 Discord 都修改 `src/index.ts`，并且两个技能文件都包含 Telegram 变更，那么这些公共变更会针对基础干净地合并。结果是基础 + 所有技能变更 + 用户自定义。

---

## 2. 两种类型的变更：代码合并 vs 结构化操作

并非所有文件都应该作为文本合并。系统区分**代码文件**（通过 `git merge-file` 合并）和**结构化数据**（通过确定性操作修改）。

### 代码文件（三路合并）

技能在其中编织逻辑的源代码文件——路由处理程序、中间件、业务逻辑。这些使用 `git merge-file` 与共享基础合并。技能包含文件的完整修改版本。

### 结构化数据（确定性操作）

像 `package.json`、`docker-compose.yml`、`.env.example` 和生成的配置文件不是您合并的代码——它们是您聚合的结构化数据。多个技能向 `package.json` 添加 npm 依赖不需要三路文本合并。相反，技能在清单中声明其结构化要求，系统以编程方式应用它们。

**结构化操作是隐式的。** 如果技能声明 `npm_dependencies`，系统会自动处理依赖安装。技能作者不需要将 `npm install` 添加到 `post_apply` 中。当多个技能按顺序应用时，系统会批量处理结构化操作：先合并所有依赖声明，写入 `package.json` 一次，最后运行 `npm install` 一次。

```yaml
# 在 manifest.yaml 中
structured:
  npm_dependencies:
    whatsapp-web.js: "^2.1.0"
    qrcode-terminal: "^0.12.0"
  env_additions:
    - WHATSAPP_TOKEN
    - WHATSAPP_VERIFY_TOKEN
    - WHATSAPP_PHONE_ID
  docker_compose_services:
    whatsapp-redis:
      image: redis:alpine
      ports: ["6380:6379"]
```

### 结构化操作冲突

结构化操作消除了文本合并冲突，但仍可能在语义级别发生冲突：

- **NPM 版本冲突**：两个技能为同一包请求不兼容的语义化版本范围
- **端口冲突**：两个 Docker Compose 服务声明相同的主机端口
- **服务名称冲突**：两个技能定义同名服务
- **环境变量重复**：两个技能声明相同的变量但有不同的期望

解决策略：

1. **尽可能自动**：扩大语义化版本范围以找到兼容版本，检测并标记端口/名称冲突
2. **Level 2（Claude Code）**：如果自动解决失败，Claude 会根据技能意图提出选项
3. **Level 3（用户）**：如果是真正的产品选择（哪个 Redis 实例应该使用端口 6379？），则询问用户

结构化操作冲突包含在 CI 重叠图中，与代码文件重叠一起，以便维护者在用户遇到之前通过测试矩阵捕获这些冲突。

### 状态记录结构化结果

`state.yaml` 记录的不仅是声明的依赖，还有解析后的结果——实际安装的版本、解析后的端口分配、最终的环境变量列表。这使得结构化操作可重播且可审计。

### 确定性序列化

所有结构化输出（YAML、JSON）使用稳定的序列化：排序的键、一致的引号、规范化的空白。这可以防止 git 历史中因非功能性格式更改而产生的噪声差异。

---

## 3. 技能包结构

技能只包含它添加或修改的文件。对于修改后的代码文件，技能包含**完整的修改文件**（应用技能变更后的干净核心）。

```
skills/
  add-whatsapp/
    SKILL.md                          # 上下文、意图、该技能的功能和用途
    manifest.yaml                     # 元数据、依赖项、环境变量、应用后步骤
    tests/                            # 该技能的集成测试
      whatsapp.test.ts
    add/                              # 新文件——直接复制
      src/channels/whatsapp.ts
      src/channels/whatsapp.config.ts
    modify/                           # 修改后的代码文件——通过 git merge-file 合并
      src/
        server.ts                     # 完整文件：干净核心 + WhatsApp 变更
        server.ts.intent.md           # "添加 WhatsApp 网页钩子路由和消息处理程序"
        config.ts                     # 完整文件：干净核心 + WhatsApp 配置选项
        config.ts.intent.md           # "添加 WhatsApp 渠道配置块"
```

### 为什么使用完整修改文件

- `git merge-file` 需要三个完整文件——无中间重建步骤
- Git 的三路合并使用上下文匹配，因此即使用户移动了代码，它也能工作——不像基于行号的差异会立即失效
- 可审计：`diff .nanoclaw/base/src/server.ts skills/add-whatsapp/modify/src/server.ts` 显示技能的精确变更
- 确定性：相同的三个输入总是产生相同的合并结果
- 大小可忽略不计，因为 NanoClaw 的核心文件很小

### 意图文件

每个修改后的代码文件都有对应的 `.intent.md` 文件，包含结构化标题：

```markdown
# Intent: server.ts modifications

## What this skill adds
向 Express 服务器添加 WhatsApp 网页钩子路由和消息处理程序。

## Key sections
- `/webhook/whatsapp` 路由注册（POST 和 GET 用于验证）
- 身份验证和响应管道之间的消息处理程序中间件

## Invariants
- 不得干扰其他渠道的网页钩子路由
- 身份验证中间件必须在 WhatsApp 处理程序之前运行
- 错误处理必须传播到全局错误处理程序

## Must-keep sections
- 网页钩子验证流程（GET 路由）是 WhatsApp Cloud API 所必需的
```

结构化标题（What、Key sections、Invariants、Must-keep）在冲突解决过程中为 Claude Code 提供具体指导，而不是要求它从非结构化文本中推断。

### 清单格式

```yaml
# --- 必需字段 ---
skill: whatsapp
version: 1.2.0
description: "通过 Cloud API 集成 WhatsApp Business API"
core_version: 0.1.0               # 该技能针对的核心版本

# 该技能添加的文件
adds:
  - src/channels/whatsapp.ts
  - src/channels/whatsapp.config.ts

# 该技能修改的代码文件（三路合并）
modifies:
  - src/server.ts
  - src/config.ts

# 文件操作（重命名、删除、移动——见第 5 节）
file_ops: []

# 结构化操作（确定性，无合并——隐式处理）
structured:
  npm_dependencies:
    whatsapp-web.js: "^2.1.0"
    qrcode-terminal: "^0.12.0"
  env_additions:
    - WHATSAPP_TOKEN
    - WHATSAPP_VERIFY_TOKEN
    - WHATSAPP_PHONE_ID

# 技能关系
conflicts: []              # 无法与该技能共存的技能（需要智能体解决）
depends: []                # 必须先应用的技能

# 测试命令——应用后运行以验证技能是否正常工作
test: "npx vitest run src/channels/whatsapp.test.ts"

# --- 未来字段（v0.1 中尚未实现）---
# author: nanoclaw-team
# license: MIT
# min_skills_system_version: "0.1.0"
# tested_with: [telegram@1.0.0]
# post_apply: []
```

注意：`post_apply` 仅用于无法表示为结构化声明的操作。依赖安装**永远不会**在 `post_apply` 中——它由结构化操作系统隐式处理。

---

## 4. 技能、定制和分层

### 一个技能，一条幸福之路

技能实现**一种做事方式——覆盖 80% 用户的合理默认值**。`add-telegram` 为您提供干净、可靠的 Telegram 集成。它不会尝试通过预定义的配置选项和模式预测所有用例。

### 定制就是更多补丁

整个系统围绕对代码库应用转换而构建。应用技能后的定制与任何其他修改没有区别：

- **正常应用技能**——获取标准 Telegram 集成
- **从那里修改**——使用定制流程（跟踪补丁）、直接编辑（通过哈希跟踪检测），或者通过应用在其基础上构建的额外技能

### 分层技能

技能可以构建在其他技能之上：

```
add-telegram                    # 核心 Telegram 集成（幸福之路）
  ├── telegram-reactions        # 添加反应处理（依赖：[telegram]）
  ├── telegram-multi-bot        # 多个机器人实例（依赖：[telegram]）
  └── telegram-filters          # 自定义消息过滤（依赖：[telegram]）
```

每个层都是一个单独的技能，有自己的 `SKILL.md`、清单（带有 `depends: [telegram]`）、测试和修改文件。用户通过堆叠技能来组合他们想要的精确功能。

### 自定义技能应用

用户可以通过一个步骤应用带有自己修改的技能：

1. 正常应用技能（程序化合并）
2. Claude Code 询问用户是否要进行任何修改
3. 用户描述他们想要的不同之处
4. Claude Code 在刚应用的技能基础上进行修改
5. 修改被记录为与该技能相关联的自定义补丁

记录在 `state.yaml` 中：

```yaml
applied_skills:
  - skill: telegram
    version: 1.0.0
    custom_patch: .nanoclaw/custom/telegram-group-only.patch
    custom_patch_description: "仅允许机器人在群组聊天中响应"
```

在重播时，技能会程序化地应用，然后自定义补丁会应用在其之上。

---

## 5. 文件操作：重命名、删除、移动

核心更新和某些技能需要重命名、删除或移动文件。这些不是文本合并——它们是作为显式脚本操作处理的结构变更。

### 在清单中的声明

```yaml
file_ops:
  - type: rename
    from: src/server.ts
    to: src/app.ts
  - type: delete
    path: src/deprecated/old-handler.ts
  - type: move
    from: src/utils/helpers.ts
    to: src/lib/helpers.ts
```

### 执行顺序

文件操作在代码合并**之前**运行，因为合并需要针对正确的文件路径：

1. 预检检查（状态验证、核心版本、依赖项、冲突、漂移检测）
2. 获取操作锁
3. **备份**所有将被修改的文件
4. **文件操作**（重命名、删除、移动）
5. 从 `add/` 复制新文件
6. 三路合并修改后的代码文件
7. 冲突解决（rerere 自动解决，或返回 `backupPending: true`）
8. 应用结构化操作（npm 依赖、环境变量、Docker Compose——批量处理）
9. 运行 `npm install`（如果有任何结构化 npm_dependencies，则运行一次）
10. 更新状态（记录技能应用、文件哈希、结构化结果）
11. 运行测试（如果定义了 `manifest.test`；失败时回滚状态和备份）
12. 清理（成功时删除备份，释放锁）

### 技能的路径重映射

当核心重命名文件（例如，`server.ts` → `app.ts`）时，针对旧路径编写的技能仍会在其 `modifies` 和 `modify/` 目录中引用 `server.ts`。**技能包永远不会在用户机器上被修改。**

相反，核心更新会附带一个**兼容性映射**：

```yaml
# 在更新包中
path_remap:
  src/server.ts: src/app.ts
  src/old-config.ts: src/config/main.ts
```

系统在应用时解析路径：如果技能目标是 `src/server.ts` 并且重映射表明它现在是 `src/app.ts`，则会对 `src/app.ts` 进行合并。重映射会记录在 `state.yaml` 中，以便未来操作保持一致。

### 安全检查

在执行文件操作之前：

- 验证源文件是否存在
- 对于删除：如果文件有超出基础的修改（用户或技能变更会丢失），则发出警告

---

## 6. 应用流程

当用户在 Claude Code 中运行技能的斜杠命令时：

### 步骤 1：预检检查

- 核心版本兼容性
- 依赖项满足
- 与已应用技能无无法解决的冲突
- 检查未跟踪的变更（见第 9 节）

### 步骤 2：备份

将所有将被修改的文件复制到 `.nanoclaw/backup/`。如果操作在任何点失败，则从备份恢复。

### 步骤 3：文件操作

使用安全检查执行重命名、删除或移动。如果需要，应用路径重映射。

### 步骤 4：应用新文件

```bash
cp skills/add-whatsapp/add/src/channels/whatsapp.ts src/channels/whatsapp.ts
```

### 步骤 5：合并修改后的代码文件

对于 `modifies` 中的每个文件（应用路径重映射后）：

```bash
git merge-file src/server.ts .nanoclaw/base/src/server.ts skills/add-whatsapp/modify/src/server.ts
```

- **退出码 0**：干净合并，继续
- **退出码 > 0**：文件中有冲突标记，继续到解决步骤

### 步骤 6：冲突解决（三级）

1. **检查共享解决缓存**（`.nanoclaw/resolutions/`）——如果存在该技能组合的已验证解决方案，则加载到本地 `git rerere` 中。**仅在输入哈希完全匹配时应用**（基础哈希 + 当前哈希 + 技能修改哈希）。
2. **`git rerere`**——检查本地缓存。如果找到，自动应用。完成。
3. **Claude Code**——读取冲突标记 + `SKILL.md` + `.intent.md`（当前和先前应用技能的 Invariants、Must-keep 部分）。解决冲突。`git rerere` 缓存解决方案。
4. **用户**——如果 Claude Code 无法确定意图，它会询问用户所需的行为。

### 步骤 7：应用结构化操作

收集所有结构化声明（来自该技能和任何先前应用的技能，如果是批量处理）。以确定方式应用：

- 将 npm 依赖合并到 `package.json`（检查版本冲突）
- 将环境变量附加到 `.env.example`
- 合并 Docker Compose 服务（检查端口/名称冲突）
- 在最后**运行一次** `npm install`
- 在状态中记录解析后的结果

### 步骤 8：应用后和验证

1. 运行任何 `post_apply` 命令（仅非结构化操作）
2. 更新 `.nanoclaw/state.yaml`——技能记录、文件哈希（每个文件的 base/skill/merged）、结构化结果
3. **运行技能测试**——强制，即使所有合并都干净
4. 如果干净合并但测试失败 → 升级到 Level 2（Claude Code 诊断语义冲突）

### 步骤 9：清理

如果测试通过，删除 `.nanoclaw/backup/`。操作完成。

如果测试失败且 Level 2 无法解决，则从 `.nanoclaw/backup/` 恢复并报告失败。

---

## 7. 共享解决缓存

### 问题

`git rerere` 默认是本地的。但 NanoClaw 有成千上万的用户应用相同的技能组合。每个用户遇到相同的冲突并等待 Claude Code 解决是浪费资源的。

### 解决方案

NanoClaw 在 `.nanoclaw/resolutions/` 中维护一个经过验证的解决缓存，该缓存随项目一起提供。这是共享工件——**不是** `.git/rr-cache/`，后者保持本地。

```
.nanoclaw/
  resolutions/
    whatsapp@1.2.0+telegram@1.0.0/
      src/
        server.ts.resolution
        server.ts.preimage
        config.ts.resolution
        config.ts.preimage
      meta.yaml
```

### 哈希强制执行

缓存的解决方案**仅在输入哈希完全匹配时才会应用**：

```yaml
# meta.yaml
skills:
  - whatsapp@1.2.0
  - telegram@1.0.0
apply_order: [whatsapp, telegram]
core_version: 0.6.0
resolved_at: 2026-02-15T10:00:00Z
tested: true
test_passed: true
resolution_source: maintainer
input_hashes:
  base: "aaa..."
  current_after_whatsapp: "bbb..."
  telegram_modified: "ccc..."
output_hash: "ddd..."
```

如果任何输入哈希不匹配，则会跳过缓存的解决方案，系统会继续到 Level 2。

### 经验证：rerere + merge-file 需要索引适配器

`git rerere` **不能**原生识别 `git merge-file` 的输出。这在 Phase 0 测试中得到了验证（`tests/phase0-merge-rerere.sh`，33 个测试）。

问题不在于冲突标记格式——`merge-file` 使用文件名作为标签（`<<<<<<< current.ts`），而 `git merge` 使用分支名称（`<<<<<<< HEAD`），但 rerere 只会哈希冲突主体。格式是兼容的。

实际问题：**rerere 需要未合并的索引条目**（阶段 1/2/3），而 `git merge-file` 不会创建这些条目。适配器在 `merge-file` 产生冲突后设置所需的索引状态，启用 rerere 缓存。这要求项目是 git 仓库；没有 `.git/` 的用户会失去解析缓存，但不会失去功能——冲突会直接升级到 Level 2（Claude Code 解决）。系统应该检测这种情况并优雅地跳过 rerere 操作。

### 维护者工作流程

发布核心更新或新技能版本时：

1. 以目标核心版本的全新代码库
2. 单独应用每个官方技能——验证干净合并，运行测试
3. 为修改至少一个公共文件或具有重叠结构化操作的技能**应用成对组合**
4. 基于流行度和高重叠应用精选的三技能组合
5. 解决所有冲突（代码和结构化）
6. 记录所有带有输入哈希的解决方案
7. 为每个组合运行完整测试套件
8. 随发布一起提供经过验证的解决方案

标准：**具有任何常见官方技能组合的用户不应遇到未解决的冲突。**

---

## 8. 状态跟踪

`.nanoclaw/state.yaml` 记录了安装的所有信息：

```yaml
skills_system_version: "0.1.0"     # 模式版本——工具在任何操作前都会检查此版本
core_version: 0.1.0

applied_skills:
  - name: telegram
    version: 1.0.0
    applied_at: 2026-02-16T22:47:02.139Z
    file_hashes:
      src/channels/telegram.ts: "f627b9cf..."
      src/channels/telegram.test.ts: "400116769..."
      src/config.ts: "9ae28d1f..."
      src/index.ts: "46dbe495..."
      src/routing.test.ts: "5e1aede9..."
    structured_outcomes:
      npm_dependencies:
        grammy: "^1.39.3"
      env_additions:
        - TELEGRAM_BOT_TOKEN
        - TELEGRAM_ONLY
      test: "npx vitest run src/channels/telegram.test.ts"

  - name: discord
    version: 1.0.0
    applied_at: 2026-02-17T17:29:37.821Z
    file_hashes:
      src/channels/discord.ts: "5d669123..."
      src/channels/discord.test.ts: "19e1c6b9..."
      src/config.ts: "a0a32df4..."
      src/index.ts: "d61e3a9d..."
      src/routing.test.ts: "edbacb00..."
    structured_outcomes:
      npm_dependencies:
        discord.js: "^14.18.0"
      env_additions:
        - DISCORD_BOT_TOKEN
        - DISCORD_ONLY
      test: "npx vitest run src/channels/discord.test.ts"

custom_modifications:
  - description: "添加了自定义日志中间件"
    applied_at: 2026-02-15T12:00:00Z
    files_modified:
      - src/server.ts
    patch_file: .nanoclaw/custom/001-logging-middleware.patch
```

**v0.1 实现说明：**
- `file_hashes` 为每个文件存储单个 SHA-256 哈希（最终合并结果）。未来版本计划支持三部分哈希（base/skill_modified/merged）以改进漂移诊断。
- 应用的技能使用 `name` 作为键字段（不是 `skill`），与 TypeScript `AppliedSkill` 接口匹配。
- `structured_outcomes` 存储原始清单值以及 `test` 命令。解析后的 npm 版本（实际安装版本与语义化版本范围）尚未跟踪。
- `installed_at`、`last_updated`、`path_remap`、`rebased_at`、`core_version_at_apply`、`files_added` 和 `files_modified` 等字段计划在未来版本中添加。

---

## 9. 未跟踪的变更

如果用户直接编辑文件，系统会通过哈希比较检测到这一点。

### 何时检测

在**任何修改代码库的操作**之前：应用技能、删除技能、更新核心、重播或变基。

### 会发生什么

```
检测到对 src/server.ts 的未跟踪变更。
[1] 将这些记录为自定义修改（推荐）
[2] 无论如何继续（变更保留，但不会为未来重播跟踪）
[3] 中止
```

系统永远不会阻止或丢失工作。选项 1 会生成补丁并记录它，使变更可重现。选项 2 保留变更，但它们不会在重播中幸存。

### 恢复保证

无论用户在系统外对代码库进行了多少修改，三级模型都能始终将其恢复：

1. **Git**：将当前文件与基础进行比较，识别变更内容
2. **Claude Code**：读取 `state.yaml` 以了解应用了哪些技能，与实际文件状态进行比较，识别差异
3. **用户**：Claude Code 询问他们的意图，保留什么，丢弃什么

没有不可恢复的状态。

---

## 10. 核心更新

核心更新必须尽可能程序化。NanoClaw 团队负责确保更新能在常见技能组合上干净地应用。

### 补丁和迁移

大多数核心变更——错误修复、性能改进、新功能——通过三路合并自动传播。无需特殊处理。

**重大变更**——更改默认值、移除功能、将功能移至技能——需要**迁移**。迁移是一个保留旧行为的技能，针对新核心编写。它在更新期间自动应用，因此用户的设置不会改变。

进行重大变更时维护者的责任：在核心中进行变更，编写针对新核心的迁移技能，向 `migrations.yaml` 添加条目，测试它。这是重大变更的成本。

### `migrations.yaml`

仓库根目录中的追加文件。每个条目记录一个重大变更和保留旧行为的技能：

```yaml
- since: 0.6.0
  skill: apple-containers@1.0.0
  description: "保留 Apple Containers（0.6 版中默认改为 Docker）"

- since: 0.7.0
  skill: add-whatsapp@2.0.0
  description: "保留 WhatsApp（在 0.7 版中从核心移至技能）"

- since: 0.8.0
  skill: legacy-auth@1.0.0
  description: "保留旧版认证模块（在 0.8 版中从核心移除）"
```

迁移技能是 `skills/` 目录中的常规技能。它们有清单（带有 `depends: [telegram]`）、测试和修改文件。它们针对**新**核心版本编写：修改后的文件是新核心，其中特定的重大变更已还原，其他所有内容（错误修复、新功能）与新核心相同。

### 迁移在更新期间的工作原理

1. 三路合并引入了来自新核心的所有内容——补丁、重大变更、所有内容
2. 正常冲突解决
3. 重新应用自定义补丁（正常）
4. **将基础更新到新核心**
5. 过滤 `migrations.yaml` 以获取 `since` > 用户旧 `core_version` 的条目
6. **使用针对新基础的正常应用流程应用每个迁移技能**
7. 将迁移技能记录在 `state.yaml` 中，就像任何其他技能一样
8. 运行测试

步骤 6 与任何技能使用的应用函数相同。迁移技能与新基础合并：

- **基础**：新核心（例如，v0.8 带 Docker）
- **当前**：用户在更新合并后的文件（通过早期合并保留了新核心 + 用户自定义）
- **其他**：迁移技能的文件（新核心，其中 Docker 已还原为 Apple，其他所有内容相同）

三路合并正确地保留了用户的自定义，还原了重大变更，并保留了所有错误修复。如果有冲突，正常解决：缓存 → Claude → 用户。

对于大版本跳跃（v0.5 → v0.8），所有适用的迁移都会按顺序应用。迁移技能针对最新核心版本维护，因此它们始终能与当前代码库正确组合。

### 用户看到的内容

```
核心已更新：0.5.0 → 0.8.0
  ✓ 所有补丁已应用

  保留您当前的设置：
    + apple-containers@1.0.0
    + add-whatsapp@2.0.0
    + legacy-auth@1.0.0

  技能更新：
    ✓ add-telegram 1.0.0 → 1.2.0

  要接受新默认值：/remove-skill <名称>
  ✓ 所有测试通过
```

更新期间无提示、无选择。用户的设置不会改变。如果他们后来想接受新默认值，可以删除迁移技能。

### 核心团队随更新一起提供的内容

```
updates/
  0.5.0-to-0.6.0/
    migration.md                  # 变更内容、原因以及对技能的影响
    files/                        # 新核心文件
    file_ops:                     # 任何重命名、删除、移动
    path_remap:                   # 旧技能路径的兼容性映射
    resolutions/                  # 官方技能的预计算解决方案
```

加上添加到 `skills/` 中的任何新迁移技能和追加到 `migrations.yaml` 中的条目。

### 维护者的流程

1. **进行核心变更**
2. **如果是重大变更**：针对新核心编写迁移技能，向 `migrations.yaml` 添加条目
3. **编写 `migration.md`**——变更内容、原因、哪些技能可能受影响
4. **针对新核心单独测试每个官方技能**（包括迁移技能）
5. **为共享修改文件或结构化操作的技能测试成对组合**
6. **测试基于流行度和重叠的精选三技能组合**
7. **解决所有冲突**
8. **记录所有带有强制输入哈希的解决方案**
9. **运行完整测试套件**
10. **发布所有内容**——迁移指南、迁移技能、文件操作、路径重映射、解决方案

标准：**补丁静默应用。重大变更通过迁移技能自动保留。用户的工作设置不应因变更而感到惊讶。**

---

## 11. 技能删除（卸载）

删除技能不是反向补丁操作。**卸载是不含该技能的重播。**

### 工作原理

1. 读取 `state.yaml` 以获取应用的技能和自定义修改的完整列表
2. 从列表中删除目标技能
3. 将当前代码库备份到 `.nanoclaw/backup/`
4. **从干净的基础重播**——按顺序应用每个剩余技能，应用自定义补丁，使用解决缓存
5. 运行所有测试
6. 如果测试通过，删除备份并更新 `state.yaml`
7. 如果测试失败，从备份恢复并报告

### 与删除的技能相关的自定义补丁

如果删除的技能在 `state.yaml` 中有 `custom_patch`，用户会收到警告：

```
删除 telegram 也会丢弃自定义补丁："仅允许机器人在群组聊天中响应"
[1] 继续（丢弃自定义补丁）
[2] 中止
```

---

## 12. 变基

将累积的层扁平化为干净的起点。

### 变基的作用

1. 将用户当前的实际文件作为新现实
2. 将 `.nanoclaw/base/` 更新为当前核心版本的干净文件
3. 对于每个应用的技能，针对新基础重新生成修改后的文件差异
4. 使用 `rebased_at` 时间戳更新 `state.yaml`
5. 清除旧的自定义补丁（现在已固化）
6. 清除过时的解决缓存条目

### 何时变基

- 重大核心更新后
- 当累积的补丁变得难以处理时
- 重大新技能应用前
- 定期维护

### 权衡

**失去**：单个技能补丁历史，干净删除单个旧技能的能力，旧自定义补丁作为单独工件

**获得**：干净的基础，更简单的未来合并，减少的缓存大小，新的起点

---

## 13. 重播

给定 `state.yaml`，在没有 AI 干预的情况下在新机器上重现精确安装（假设所有解决方案都已缓存）。

### 重播流程

```bash
# 完全程序化——无需 Claude Code

# 1. 安装指定版本的核心
nanoclaw-init --version 0.5.0

# 2. 将共享解决方案加载到本地 rerere 缓存中
load-resolutions .nanoclaw/resolutions/

# 3. 对于 state.applied_skills 中的每个技能（按顺序）：
for skill in state.applied_skills:
  # 文件操作
  apply_file_ops(skill)

  # 复制新文件
  cp skills/${skill.name}/add/* .

  # 合并修改后的代码文件（带路径重映射）
  for file in skill.files_modified:
    resolved_path = apply_remap(file, state.path_remap)
    git merge-file ${resolved_path} .nanoclaw/base/${resolved_path} skills/${skill.name}/modify/${file}
    # git rerere 从共享缓存自动解析（如果需要）

  # 应用技能特定的自定义补丁（如果已记录）
  if skill.custom_patch:
    git apply --3way ${skill.custom_patch}

# 4. 应用所有结构化操作（批量处理）
collect_all_structured_ops(state.applied_skills)
merge_npm_dependencies → 写入 package.json 一次
npm install 一次
merge_env_additions → 写入 .env.example 一次
merge_compose_services → 写入 docker-compose.yml 一次

# 5. 应用独立的自定义修改
for custom in state.custom_modifications:
  git apply --3way ${custom.patch_file}

# 6. 运行测试并验证哈希
run_tests && verify_hashes
```

---

## 14. 技能测试

每个技能都包含集成测试，用于验证技能在应用时是否正常工作。

### 结构

```
skills/
  add-whatsapp/
    tests/
      whatsapp.test.ts
```

### 测试验证的内容

- **在新鲜核心上的单个技能**：应用到干净代码库 → 测试通过 → 集成正常工作
- **技能功能**：功能实际正常工作
- **应用后状态**：文件处于预期状态，`state.yaml` 已正确更新

### 测试何时运行（总是）

- **应用技能后**——即使所有合并都干净
- **核心更新后**——即使所有合并都干净
- **卸载重播后**——确认删除没有破坏剩余技能
- **在 CI 中**——单独测试所有官方技能以及常见组合
- **重播期间**——验证重播状态

干净的合并 ≠ 工作代码。测试是唯一可靠的信号。

### CI 测试矩阵

测试覆盖是**智能的，不是详尽的**：

- 每个官方技能单独针对每个支持的核心版本
- **修改至少一个公共文件或具有重叠结构化操作的技能的成对组合**
- 基于流行度和高重叠的精选三技能组合
- 测试矩阵从清单的 `modifies` 和 `structured` 字段自动生成

每个通过的组合都会为共享缓存生成一个经过验证的解决方案条目。

---

## 15. 项目配置

### `.gitattributes`

随 NanoClaw 一起提供，以减少噪声合并冲突：

```
* text=auto
*.ts text eol=lf
*.json text eol=lf
*.yaml text eol=lf
*.md text eol=lf
```

---

## 16. 目录结构

```
project/
  src/                              # 实际代码库
    server.ts
    config.ts
    channels/
      whatsapp.ts
      telegram.ts
  skills/                           # 技能包（Claude Code 斜杠命令）
    add-whatsapp/
      SKILL.md
      manifest.yaml
      tests/
        whatsapp.test.ts
      add/
        src/channels/whatsapp.ts
      modify/
        src/
          server.ts
          server.ts.intent.md
          config.ts
          config.ts.intent.md
    add-telegram/
      ...
    telegram-reactions/             # 分层技能
      ...
  .nanoclaw/
    base/                           # 干净核心（共享基础）
      src/
        server.ts
        config.ts
        ...
    state.yaml                      # 完整安装状态
    backup/                         # 操作期间的临时备份
    custom/                         # 自定义补丁
      telegram-group-only.patch
      001-logging-middleware.patch
      001-logging-middleware.md
    resolutions/                    # 共享的经过验证的解决缓存
      whatsapp@1.2.0+telegram@1.0.0/
        src/
          server.ts.resolution
          server.ts.preimage
        meta.yaml
  .gitattributes
```

---

## 17. 设计原则

1. **使用 git，不要重新发明它。** 使用 `git merge-file` 进行代码合并，`git rerere` 进行解决缓存，`git apply --3way` 进行自定义补丁。
2. **三级解决：git → Claude → 用户。** 程序化优先，AI 第二，人类第三。
3. **干净的合并是不够的。** 每个操作后运行测试。语义冲突会在文本合并中幸存。
4. **所有操作都是安全的。** 之前备份，失败时恢复。无半应用状态。
5. **一个共享基础。** `.nanoclaw/base/` 是应用任何技能或自定义之前的干净核心。它是所有三路合并的稳定公共祖先。仅在核心更新时更新。
6. **代码合并与结构化操作。** 源代码通过三路合并。依赖项、环境变量和配置以编程方式聚合。结构化操作是隐式的和批量处理的。
7. **解决方案是学习和共享的。** 维护者解决冲突并随发布一起提供经过验证的解决方案，带有哈希强制执行。`.nanoclaw/resolutions/` 是共享工件。
8. **一个技能，一条幸福之路。** 没有预定义的配置选项。自定义是更多的补丁。
9. **技能分层和组合。** 核心技能提供基础。扩展技能添加功能。
10. **意图是一等公民且结构化。** `SKILL.md`、`.intent.md`（What、Invariants、Must-keep）和 `migration.md`。
11. **状态是明确且完整的。** 技能、自定义补丁、每个文件的哈希、结构化结果、路径重映射。重播是确定性的。漂移检测是即时的。
12. **始终可恢复。** 三级模型从任何起点重建连贯状态。
13. **卸载是重播。** 从不含该技能的干净基础重播。备份以确保安全。
14. **核心更新是维护者的责任。** 测试、解决、发布。重大变更需要保留旧行为的迁移技能。重大变更的成本是编写和测试迁移。用户的设置不应因变更而感到惊讶。
15. **文件操作和路径重映射是一等公民。** 清单中的重命名、删除、移动。技能永远不会被修改——路径在应用时解析。
16. **技能经过测试。** 每个技能的集成测试。CI 按重叠测试成对组合。测试总是运行。
17. **确定性序列化。** 排序的键、一致的格式。无噪声差异。
18. **必要时变基。** 将层扁平化为干净的起点。
19. **渐进式核心瘦身。** 重大变更将功能从核心移至迁移技能。现有用户保留他们拥有的功能。新用户从最小的核心开始并添加他们需要的功能。


------


# NanoClaw 安全模型（SECURITY.md）

## 信任模型

| 实体 | 信任级别 | 理由 |
|------|---------|------|
| 主群组 | 受信任 | 私人自聊天，管理员控制 |
| 非主群组 | 不受信任 | 其他用户可能是恶意的 |
| 容器智能体 | 沙盒化 | 隔离的执行环境 |
| WhatsApp 消息 | 用户输入 | 可能包含恶意内容 |

## 安全边界

### 1. 容器隔离（主要边界）

所有智能体在容器（轻量级 Linux VM）中运行，提供：
- **进程隔离**：容器进程无法影响主机
- **文件系统隔离**：仅明确挂载的目录可见
- **非 root 执行**：以无特权的 `node` 用户（uid 1000）运行
- **临时容器**：每次调用都有新鲜的环境（`--rm`）

这是主要的安全边界。与其依赖应用级别的权限检查，不如通过挂载内容限制攻击面。

### 2. 挂载安全

**外部允许列表** - 挂载权限存储在 `~/.config/nanoclaw/mount-allowlist.json` 中，该文件：
- 在项目根目录之外
- 从未挂载到容器中
- 无法由智能体修改

**默认阻止模式：**
```
.ssh, .gnupg, .aws, .azure, .gcloud, .kube, .docker,
credentials, .env, .netrc, .npmrc, id_rsa, id_ed25519,
private_key, .secret
```

**保护措施：**
- 验证前解析符号链接（防止遍历攻击）
- 容器路径验证（拒绝 `..` 和绝对路径）
- `nonMainReadOnly` 选项强制非主群组为只读

**只读项目根：**

主群组的项目根挂载为只读。智能体需要的可写路径（群组文件夹、IPC、`.claude/`）单独挂载。这防止智能体修改主机应用代码（`src/`、`dist/`、`package.json` 等），否则下次重启时会完全绕过沙盒。

### 3. 会话隔离

每个群组在 `data/sessions/{group}/.claude/` 处有隔离的 Claude 会话：
- 群组无法看到其他群组的对话历史
- 会话数据包括完整的消息历史和读取的文件内容
- 防止跨群组信息泄漏

### 4. IPC 授权

消息和任务操作会根据群组身份进行验证：

| 操作 | 主群组 | 非主群组 |
|-----------|------------|----------------|
| 向自己的聊天发送消息 | ✓ | ✓ |
| 向其他聊天发送消息 | ✓ | ✗ |
| 为自己安排任务 | ✓ | ✓ |
| 为其他群组安排任务 | ✓ | ✗ |
| 查看所有任务 | ✓ | 仅自己的 |
| 管理其他群组 | ✓ | ✗ |

### 5. 凭证处理

**已挂载凭证：**
- Claude 认证令牌（从 `.env` 筛选，只读）

**未挂载：**
- WhatsApp 会话（`store/auth/`）- 仅主机
- 挂载允许列表 - 外部，从未挂载
- 任何匹配阻止模式的凭证

**凭证过滤：**
仅这些环境变量暴露给容器：
```typescript
const allowedVars = ['CLAUDE_CODE_OAUTH_TOKEN', 'ANTHROPIC_API_KEY'];
```

> **注意：** Anthropic 凭证会被挂载，以便 Claude Code 在智能体运行时能够认证。然而，这意味着智能体本身可以通过 Bash 或文件操作发现这些凭证。理想情况下，Claude Code 应该在不向智能体执行环境暴露凭证的情况下进行认证，但我无法弄清楚这一点。如果您有凭证隔离的想法，**欢迎提交 PR**。

## 权限比较

| 能力 | 主群组 | 非主群组 |
|------------|------------|----------------|
| 项目根访问 | `/workspace/project` (ro) | 无 |
| 群组文件夹 | `/workspace/group` (rw) | `/workspace/group` (rw) |
| 全局内存 | 隐式通过项目 | `/workspace/global` (ro) |
| 额外挂载 | 可配置 | 除非允许，否则只读 |
| 网络访问 | 不受限制 | 不受限制 |
| MCP 工具 | 所有 | 所有 |

## 安全架构图

```
┌──────────────────────────────────────────────────────────────────┐
│                        不受信任区域                             │
│  WhatsApp 消息（可能包含恶意内容）                                │
└────────────────────────────────┬─────────────────────────────────┘
                                 │
                                 ▼ 触发检查、输入转义
┌──────────────────────────────────────────────────────────────────┐
│                     主机进程（受信任）                        │
│  • 消息路由                                                    │
│  • IPC 授权                                                  │
│  • 挂载验证（外部允许列表）                                    │
│  • 容器生命周期                                              │
│  • 凭证过滤                                                 │
└────────────────────────────────┬─────────────────────────────────┘
                                 │
                                 ▼ 仅明确挂载
┌──────────────────────────────────────────────────────────────────┐
│                容器（隔离/沙盒化）                               │
│  • 智能体执行                                                │
│  • Bash 命令（沙盒化）                                      │
│  • 文件操作（限于挂载）                                      │
│  • 网络访问（不受限制）                                      │
│  • 无法修改安全配置                                        │
└──────────────────────────────────────────────────────────────────┘
```


------


# Claude Agent SDK 深度探索（SDK_DEEP_DIVE.md）

通过逆向工程 `@anthropic-ai/claude-agent-sdk` v0.2.29–0.2.34 以了解 `query()` 的工作原理、为什么智能体团队的子智能体会被杀死，以及如何修复它。辅以官方 SDK 参考文档。

## 架构

```
智能体运行器（我们的代码）
  └── query() → SDK (sdk.mjs)
        └── 生成 CLI 子进程 (cli.js)
              └── Claude API 调用、工具执行
              └── Task 工具 → 生成子智能体子进程
```

SDK 生成 `cli.js` 作为子进程，使用 `--output-format stream-json --input-format stream-json --print --verbose` 标志。通信通过 stdin/stdout 上的 JSON 行进行。

`query()` 返回一个 `Query` 对象，该对象扩展自 `AsyncGenerator<SDKMessage, void>`。在内部：

- SDK 生成 CLI 作为子进程，通过 stdin/stdout JSON 行进行通信
- SDK 的 `readMessages()` 从 CLI 标准输出读取，将其加入内部流
- `readSdkMessages()` 异步生成器从该流中产生
- `[Symbol.asyncIterator]` 返回 `readSdkMessages()`
- 只有当 CLI 关闭标准输出时，迭代器才会返回 `done: true`

V1（`query()`）和 V2（`createSession`/`send`/`stream`）使用完全相同的三层架构：

```
SDK (sdk.mjs)           CLI 进程 (cli.js)
--------------          --------------------
XX 传输  ------>   标准输入读取器 (bd1)
  (生成 cli.js)           |
$X 查询  <------   标准输出写入器
  (JSON 行)             |
                        EZ() 递归生成器
                           |
                        Anthropic Messages API
```

## 核心智能体循环 (EZ)

在 CLI 内部，智能体循环是一个**递归异步生成器，称为 `EZ()`**，而不是迭代的 while 循环：

```
EZ({ messages, systemPrompt, canUseTool, maxTurns, turnCount=1, ... })
```

每个调用 = 对 Claude 的一次 API 调用（一个 "turn"）。

### 每轮流程：

1. **准备消息** — 修剪上下文，必要时运行压缩
2. **调用 Anthropic API**（通过 `mW1` 流式函数）
3. **从响应中提取 tool_use 块**
4. **分支：**
   - 如果 **无 tool_use 块** → 停止（运行停止钩子，返回）
   - 如果 **有 tool_use 块** → 执行工具，增加 turnCount，递归

所有复杂逻辑 —— 智能体循环、工具执行、后台任务、队友编排 —— 都在 CLI 子进程内部运行。`query()` 是一个薄的传输包装器。

## query() 选项

来自官方文档的完整 `Options` 类型：

| 属性 | 类型 | 默认值 | 描述 |
|------|------|-------|------|
| `abortController` | `AbortController` | `new AbortController()` | 用于取消操作的控制器 |
| `additionalDirectories` | `string[]` | `[]` | Claude 可以访问的额外目录 |
| `agents` | `Record<string, AgentDefinition>` | `undefined` | 以编程方式定义子智能体（不是智能体团队 —— 无编排） |
| `allowDangerouslySkipPermissions` | `boolean` | `false` | 使用 `permissionMode: 'bypassPermissions'` 时需要 |
| `allowedTools` | `string[]` | 所有工具 | 允许使用的工具名称列表 |
| `betas` | `SdkBeta[]` | `[]` | 测试版功能（例如 `['context-1m-2025-08-07']` 用于 1M 上下文） |
| `canUseTool` | `CanUseTool` | `undefined` | 工具使用的自定义权限函数 |
| `continue` | `boolean` | `false` | 继续最近的对话 |
| `cwd` | `string` | `process.cwd()` | 当前工作目录 |
| `disallowedTools` | `string[]` | `[]` | 禁止使用的工具名称列表 |
| `enableFileCheckpointing` | `boolean` | `false` | 启用文件变更跟踪以进行回滚 |
| `env` | `Dict<string>` | `process.env` | 环境变量 |
| `executable` | `'bun' \| 'deno' \| 'node'` | 自动检测 | JavaScript 运行时 |
| `fallbackModel` | `string` | `undefined` | 主模型失败时使用的模型 |
| `forkSession` | `boolean` | `false` | 恢复时，分叉到新会话 ID 而不是继续原始会话 |
| `hooks` | `Partial<Record<HookEvent, HookCallbackMatcher[]>>` | `{}` | 事件钩子回调 |
| `includePartialMessages` | `boolean` | `false` | 包含部分消息事件（流式传输） |
| `maxBudgetUsd` | `number` | `undefined` | 查询的最大预算（美元） |
| `maxThinkingTokens` | `number` | `undefined` | 思考过程的最大令牌数 |
| `maxTurns` | `number` | `undefined` | 对话的最大轮数 |
| `mcpServers` | `Record<string, McpServerConfig>` | `{}` | MCP 服务器配置 |
| `model` | `string` | CLI 默认值 | 使用的 Claude 模型 |
| `outputFormat` | `{ type: 'json_schema', schema: JSONSchema }` | `undefined` | 结构化输出格式 |
| `pathToClaudeCodeExecutable` | `string` | 使用内置 | Claude Code 可执行文件的路径 |
| `permissionMode` | `PermissionMode` | `'default'` | 权限模式 |
| `plugins` | `SdkPluginConfig[]` | `[]` | 从本地路径加载自定义插件 |
| `resume` | `string` | `undefined` | 要恢复的会话 ID |
| `resumeSessionAt` | `string` | `undefined` | 在特定消息 UUID 处恢复会话 |
| `sandbox` | `SandboxSettings` | `undefined` | 沙箱行为配置 |
| `settingSources` | `SettingSource[]` | `[]`（无） | 要加载的文件系统设置。必须包含 'project' 才能加载 CLAUDE.md |
| `stderr` | `(data: string) => void` | `undefined` | 标准错误输出的回调 |
| `systemPrompt` | `string \| { type: 'preset'; preset: 'claude_code'; append?: string }` | `undefined` | 系统提示。使用预设获取 Claude Code 的提示，可选 `append` |
| `tools` | `string[] \| { type: 'preset'; preset: 'claude_code' }` | `undefined` | 工具配置 |

### PermissionMode

```typescript
type PermissionMode = 'default' | 'acceptEdits' | 'bypassPermissions' | 'plan';
```

### SettingSource

```typescript
type SettingSource = 'user' | 'project' | 'local';
// 'user'    → ~/.claude/settings.json
// 'project' → .claude/settings.json（版本控制）
// 'local'   → .claude/settings.local.json（gitignore）
```

省略时，SDK 不会加载任何文件系统设置（默认隔离）。优先级：local > project > user。编程选项始终覆盖文件系统设置。

### AgentDefinition

编程式子智能体（**不是智能体团队** —— 这些更简单，无智能体间协调）：

```typescript
type AgentDefinition = {
  description: string;  // 使用此智能体的时机
  tools?: string[];     // 允许使用的工具（省略则继承所有）
  prompt: string;       // 智能体的系统提示
  model?: 'sonnet' | 'opus' | 'haiku' | 'inherit';
}
```

### McpServerConfig

```typescript
type McpServerConfig =
  | { type?: 'stdio'; command: string; args?: string[]; env?: Record<string, string> }
  | { type: 'sse'; url: string; headers?: Record<string, string> }
  | { type: 'http'; url: string; headers?: Record<string, string> }
  | { type: 'sdk'; name: string; instance: McpServer }  // 进程内
```

### SdkBeta

```typescript
type SdkBeta = 'context-1m-2025-08-07';
// 为 Opus 4.6、Sonnet 4.5、Sonnet 4 启用 1M 令牌上下文窗口
```

### CanUseTool

```typescript
type CanUseTool = (
  toolName: string,
  input: ToolInput,
  options: { signal: AbortSignal; suggestions?: PermissionUpdate[] }
) => Promise<PermissionResult>;

type PermissionResult =
  | { behavior: 'allow'; updatedInput: ToolInput; updatedPermissions?: PermissionUpdate[] }
  | { behavior: 'deny'; message: string; interrupt?: boolean };
```

## SDKMessage 类型

`query()` 可以产生 16 种消息类型。官方文档显示简化的 7 种联合类型，但 `sdk.d.ts` 包含完整集合：

| 类型 | 子类型 | 用途 |
|------|---------|---------|
| `system` | `init` | 会话初始化，包含 session_id、tools、model |
| `system` | `task_notification` | 后台智能体完成/失败/停止 |
| `system` | `compact_boundary` | 对话已压缩 |
| `system` | `status` | 状态变化（例如 compacting） |
| `system` | `hook_started` | 钩子执行开始 |
| `system` | `hook_progress` | 钩子进度输出 |
| `system` | `hook_response` | 钩子完成 |
| `system` | `files_persisted` | 文件已保存 |
| `assistant` | — | Claude 的响应（文本 + 工具调用） |
| `user` | — | 用户消息（内部） |
| `user`（重放） | — | 恢复时重放的用户消息 |
| `result` | `success` / `error_*` | 提示处理轮次的最终结果 |
| `stream_event` | — | 部分流式传输（当 includePartialMessages 时） |
| `tool_progress` | — | 长期运行工具的进度 |
| `auth_status` | — | 认证状态变化 |
| `tool_use_summary` | — | 前面工具使用的摘要 |

### SDKTaskNotificationMessage (sdk.d.ts:1507)

```typescript
type SDKTaskNotificationMessage = {
  type: 'system';
  subtype: 'task_notification';
  task_id: string;
  status: 'completed' | 'failed' | 'stopped';
  output_file: string;
  summary: string;
  uuid: UUID;
  session_id: string;
};
```

### SDKResultMessage (sdk.d.ts:1375)

两种变体有共享字段：

```typescript
// 两种变体的共享字段：
// uuid、session_id、duration_ms、duration_api_ms、is_error、num_turns、
// total_cost_usd、usage: NonNullableUsage、modelUsage、permission_denials

// 成功：
type SDKResultSuccess = {
  type: 'result';
  subtype: 'success';
  result: string;
  structured_output?: unknown;
  // ...共享字段
};

// 错误：
type SDKResultError = {
  type: 'result';
  subtype: 'error_during_execution' | 'error_max_turns' | 'error_max_budget_usd' | 'error_max_structured_output_retries';
  errors: string[];
  // ...共享字段
};
```

结果中有用的字段：`total_cost_usd`、`duration_ms`、`num_turns`、`modelUsage`（按模型细分，包含 `costUSD`、`inputTokens`、`outputTokens`、`contextWindow`）。

### SDKAssistantMessage

```typescript
type SDKAssistantMessage = {
  type: 'assistant';
  uuid: UUID;
  session_id: string;
  message: APIAssistantMessage; // 来自 Anthropic SDK
  parent_tool_use_id: string | null; // 来自子智能体时非空
};
```

### SDKSystemMessage (init)

```typescript
type SDKSystemMessage = {
  type: 'system';
  subtype: 'init';
  uuid: UUID;
  session_id: string;
  apiKeySource: ApiKeySource;
  cwd: string;
  tools: string[];
  mcp_servers: { name: string; status: string }[];
  model: string;
  permissionMode: PermissionMode;
  slash_commands: string[];
  output_style: string;
};
```

## 轮次行为：智能体停止 vs 继续

### 智能体停止（不再进行 API 调用）的情况

**1. 响应中无 tool_use 块（主要情况）**

Claude 只返回了文本 —— 它认为已完成任务。API 的 `stop_reason` 将是 `"end_turn"`。SDK 不会做出此决定 —— 完全由 Claude 的模型输出驱动。

**2. 超过最大轮数** —— 导致 `SDKResultError`，子类型为 `"error_max_turns"`。

**3. 中止信号** —— 用户通过 `abortController` 中断。

**4. 超过预算** —— `totalCost >= maxBudgetUsd` → `"error_max_budget_usd"`。

**5. 停止钩子防止继续** —— 钩子返回 `{preventContinuation: true}`。

### 智能体继续（进行另一次 API 调用）的情况

**1. 响应包含 tool_use 块（主要情况）** —— 执行工具，增加 turnCount，递归到 EZ。

**2. max_output_tokens 恢复** —— 最多 3 次重试，附带“将工作分成更小的部分”的上下文消息。

**3. 停止钩子阻塞错误** —— 错误反馈为上下文消息，循环继续。

**4. 模型回退** —— 使用备用模型重试（仅一次）。

### 决策表

| 条件 | 动作 | 结果类型 |
|-----------|--------|-------------|
| 响应包含 `tool_use` 块 | 执行工具，递归到 `EZ` | 继续 |
| 响应无 `tool_use` 块 | 运行停止钩子，返回 | `success` |
| `turnCount > maxTurns` | 产生 max_turns_reached | `error_max_turns` |
| `totalCost >= maxBudgetUsd` | 产生预算错误 | `error_max_budget_usd` |
| `abortController.signal.aborted` | 产生中断消息 | 取决于上下文 |
| `stop_reason === "max_tokens"`（输出） | 最多 3 次重试，带有恢复提示 | 继续 |
| 停止钩子 `preventContinuation` | 立即返回 | `success` |
| 停止钩子阻塞错误 | 反馈错误，递归 | 继续 |
| 模型回退错误 | 使用备用模型重试（仅一次） | 继续 |

## 子智能体执行模式

### 情况 1：同步子智能体 (`run_in_background: false`) — 阻塞

父智能体调用 Task 工具 → `VR()` 为子智能体运行 `EZ()` → 父智能体等待完整结果 → 工具结果返回给父智能体 → 父智能体继续。

子智能体运行完整的递归 EZ 循环。父智能体的工具执行通过 `await` 暂停。有一个执行中“提升”机制：同步子智能体可以通过 `Promise.race()` 与 `backgroundSignal` 承诺一起提升到后台。

### 情况 2：后台任务 (`run_in_background: true`) — 不等待

- **Bash 工具**：命令生成，工具立即返回空结果 + `backgroundTaskId`
- **Task/智能体工具**：子智能体在 fire-and-forget 包装器中启动（`g01()`），工具立即返回 `status: "async_launched"` + `outputFile` 路径

在发送 `type: "result"` 消息之前，不会等待后台任务完成。当后台任务完成时，会单独发送 `SDKTaskNotificationMessage`。

### 情况 3：智能体团队（TeammateTool / SendMessage）— 结果优先，然后轮询

团队领导者运行其正常的 EZ 循环，其中包括生成队友。当领导者的 EZ 循环完成时，会发送 `type: "result"` 消息。然后领导者进入结果后轮询循环：

```javascript
while (true) {
    // 检查是否无活跃队友 AND 无运行任务 → 打破
    // 检查队友的未读消息 → 重新注入为新提示，重新启动 EZ 循环
    // 如果标准输入关闭且有活跃队友 → 注入 shutdown 提示
    // 每 500ms 轮询一次
}
```

从 SDK 消费者的角度来看：您会收到初始 `type: "result"` 消息，但当团队领导者处理队友响应并重新进入智能体循环时，AsyncGenerator 可能会继续产生更多消息。只有当所有队友都关闭后，生成器才会真正完成。

## isSingleUserTurn 问题

来自 sdk.mjs：

```javascript
QK = typeof X === "string"  // isSingleUserTurn = true 当提示是字符串时
```

当 `isSingleUserTurn` 为 true 且第一条 `result` 消息到达时：

```javascript
if (this.isSingleUserTurn) {
  this.transport.endInput();  // 关闭 CLI 的标准输入
}
```

这会引发连锁反应：

1. SDK 关闭 CLI 标准输入
2. CLI 检测到标准输入关闭
3. 轮询循环看到 `D = true`（标准输入关闭）且有活跃队友
4. 注入 shutdown 提示 → 领导者向所有队友发送 `shutdown_request`
5. **队友在研究过程中被杀死**

shutdown 提示（在最小化的 cli.js 中通过 `BGq` 变量找到）：

```
您正在非交互模式下运行，在团队关闭之前无法返回响应给用户。

在准备最终响应之前，您必须关闭团队：
1. 使用 requestShutdown 要求每个团队成员优雅关闭
2. 等待 shutdown 批准
3. 使用 cleanup 操作清理团队
4. 只有这样才能向用户提供最终响应
```

### 实际问题

使用 V1 `query()` + 字符串提示 + 智能体团队时：

1. 领导者产生队友，他们开始研究
2. 领导者的 EZ 循环结束（"我已分派团队，他们正在处理"）
3. 发送 `type: "result"` 消息
4. SDK 看到 `isSingleUserTurn = true` → 立即关闭标准输入
5. 轮询循环检测到标准输入关闭且有活跃队友 → 注入 shutdown 提示
6. 领导者向所有队友发送 `shutdown_request`
7. **队友可能正在进行 5 分钟研究任务的第 10 秒，他们会收到停止指令**

## 解决方案：流式输入模式

不是传递字符串提示（会设置 `isSingleUserTurn = true`），而是传递 `AsyncIterable<SDKUserMessage>`：

```typescript
// 之前（智能体团队有问题）：
query({ prompt: "do something" })

// 之后（保持 CLI 存活）：
query({ prompt: asyncIterableOfMessages })
```

当提示是 `AsyncIterable` 时：
- `isSingleUserTurn = false`
- 第一条结果消息后 SDK 不会关闭标准输入
- CLI 保持存活，继续处理
- 后台智能体保持运行
- `task_notification` 消息通过迭代器流动
- 我们控制何时结束迭代

### 额外好处：流式新消息

通过异步迭代方法，我们可以在智能体仍在工作时将新传入的 WhatsApp 消息推送到迭代器中。而不是排队消息直到容器退出并生成新容器，我们直接将它们流式传输到正在运行的会话中。

### 智能体团队的预期生命周期

使用异步迭代修复（`isSingleUserTurn = false`），标准输入保持打开，因此 CLI 永远不会触及队友检查或 shutdown 提示注入：

```
1. system/init          → 会话初始化
2. assistant/user       → Claude 推理、工具调用、工具结果
3. ...                  → 更多 assistant/user 轮次（产生子智能体等）
4. result #1            → 主导智能体的第一个响应（捕获）
5. task_notification(s) → 后台智能体完成/失败/停止
6. assistant/user       → 主导智能体继续（处理子智能体结果）
7. result #2            → 主导智能体的后续响应（捕获）
8. [迭代器完成]      → CLI 关闭标准输出，全部完成
```

所有结果都是有意义的 —— 捕获每一个，而不仅仅是第一个。

## V1 与 V2 API

### V1：`query()` — 一次性异步生成器

```typescript
const q = query({ prompt: "...", options: {...} });
for await (const msg of q) { /* 处理事件 */ }
```

- 当 `prompt` 是字符串时：`isSingleUserTurn = true` → 第一条结果后标准输入自动关闭
- 对于多轮：必须传递 `AsyncIterable<SDKUserMessage>` 并自己管理协调

### V2：`createSession()` + `send()` / `stream()` — 持久会话

```typescript
await using session = unstable_v2_createSession({ model: "..." });
await session.send("first message");
for await (const msg of session.stream()) { /* 事件 */ }
await session.send("follow-up");
for await (const msg of session.stream()) { /* 事件 */ }
```

- 始终 `isSingleUserTurn = false` → 标准输入保持打开
- `send()` 将消息加入异步队列（`QX`）
- `stream()` 从同一个消息生成器产生，在 `result` 类型时停止
- 多轮是自然的 —— 只需交替 `send()` / `stream()`
- V2 不调用 V1 `query()` 内部 —— 两者独立创建 Transport + Query

### 比较表

| 方面 | V1 | V2 |
|--------|----|----|
| `isSingleUserTurn` | 字符串提示时为 `true` | 始终 `false` |
| 多轮 | 需要管理 `AsyncIterable` | 只需调用 `send()`/`stream()` |
| 标准输入生命周期 | 第一条结果后自动关闭 | 保持打开直到 `close()` |
| 智能体循环 | 相同的 `EZ()` | 相同的 `EZ()` |
| 停止条件 | 相同 | 相同 |
| 会话持久化 | 必须将 `resume` 传递给新的 `query()` | 通过会话对象内置 |
| API 稳定性 | 稳定 | 不稳定预览版（`unstable_v2_*` 前缀） |

**关键发现：轮次行为无差异。** 两者使用相同的 CLI 进程、相同的 `EZ()` 递归生成器和相同的决策逻辑。

## 钩子事件

```typescript
type HookEvent =
  | 'PreToolUse'         // 工具执行前
  | 'PostToolUse'        // 工具成功执行后
  | 'PostToolUseFailure' // 工具执行失败后
  | 'Notification'       // 通知消息
  | 'UserPromptSubmit'   // 用户提示提交
  | 'SessionStart'       // 会话开始（启动/恢复/清除/压缩）
  | 'SessionEnd'         // 会话结束
  | 'Stop'               // 智能体停止
  | 'SubagentStart'      // 子智能体产生
  | 'SubagentStop'       // 子智能体停止
  | 'PreCompact'         // 对话压缩前
  | 'PermissionRequest'; // 请求权限
```

### 钩子配置

```typescript
interface HookCallbackMatcher {
  matcher?: string;      // 可选工具名称匹配器
  hooks: HookCallback[];
}

type HookCallback = (
  input: HookInput,
  toolUseID: string | undefined,
  options: { signal: AbortSignal }
) => Promise<HookJSONOutput>;
```

### 钩子返回值

```typescript
type HookJSONOutput = AsyncHookJSONOutput | SyncHookJSONOutput;

type AsyncHookJSONOutput = { async: true; asyncTimeout?: number };

type SyncHookJSONOutput = {
  continue?: boolean;
  suppressOutput?: boolean;
  stopReason?: string;
  decision?: 'approve' | 'block';
  systemMessage?: string;
  reason?: string;
  hookSpecificOutput?:
    | { hookEventName: 'PreToolUse'; permissionDecision?: 'allow' | 'deny' | 'ask'; updatedInput?: Record<string, unknown> }
    | { hookEventName: 'UserPromptSubmit'; additionalContext?: string }
    | { hookEventName: 'SessionStart'; additionalContext?: string }
    | { hookEventName: 'PostToolUse'; additionalContext?: string };
};
```

### 子智能体钩子（来自 sdk.d.ts）

```typescript
type SubagentStartHookInput = BaseHookInput & {
  hook_event_name: 'SubagentStart';
  agent_id: string;
  agent_type: string;
};

type SubagentStopHookInput = BaseHookInput & {
  hook_event_name: 'SubagentStop';
  stop_hook_active: boolean;
  agent_id: string;
  agent_transcript_path: string;
  agent_type: string;
};

// BaseHookInput = { session_id, transcript_path, cwd, permission_mode? }
```

## 查询接口方法

`Query` 对象 (sdk.d.ts:931)。官方文档列出了这些公共方法：

```typescript
interface Query extends AsyncGenerator<SDKMessage, void> {
  interrupt(): Promise<void>;                     // 停止当前执行（仅流式输入模式）
  rewindFiles(userMessageUuid: string): Promise<void>; // 恢复文件到消息时的状态（需要 enableFileCheckpointing）
  setPermissionMode(mode: PermissionMode): Promise<void>; // 更改权限（仅流式输入模式）
  setModel(model?: string): Promise<void>;        // 更改模型（仅流式输入模式）
  setMaxThinkingTokens(max: number | null): Promise<void>; // 更改思考令牌数（仅流式输入模式）
  supportedCommands(): Promise<SlashCommand[]>;   // 可用斜杠命令
  supportedModels(): Promise<ModelInfo[]>;         // 可用模型
  mcpServerStatus(): Promise<McpServerStatus[]>;  // MCP 服务器连接状态
  accountInfo(): Promise<AccountInfo>;             // 认证用户信息
}
```

在 sdk.d.ts 中但未在官方文档中列出（可能是内部的）：
- `streamInput(stream)` — 流式传输额外用户消息
- `close()` — 强制结束查询
- `setMcpServers(servers)` — 动态添加/删除 MCP 服务器

## 沙箱配置

```typescript
type SandboxSettings = {
  enabled?: boolean;
  autoAllowBashIfSandboxed?: boolean;
  excludedCommands?: string[];
  allowUnsandboxedCommands?: boolean;
  network?: {
    allowLocalBinding?: boolean;
    allowUnixSockets?: string[];
    allowAllUnixSockets?: boolean;
    httpProxyPort?: number;
    socksProxyPort?: number;
  };
  ignoreViolations?: {
    file?: string[];
    network?: string[];
  };
};
```

当 `allowUnsandboxedCommands` 为 true 时，模型可以在 Bash 工具输入中设置 `dangerouslyDisableSandbox: true`，这会回退到 `canUseTool` 权限处理程序。

## MCP 服务器助手

### tool()

使用 Zod 模式创建类型安全的 MCP 工具定义：

```typescript
function tool<Schema extends ZodRawShape>(
  name: string,
  description: string,
  inputSchema: Schema,
  handler: (args: z.infer<ZodObject<Schema>>, extra: unknown) => Promise<CallToolResult>
): SdkMcpToolDefinition<Schema>
```

### createSdkMcpServer()

创建进程内 MCP 服务器（我们使用 stdio 替代以实现子智能体继承）：

```typescript
function createSdkMcpServer(options: {
  name: string;
  version?: string;
  tools?: Array<SdkMcpToolDefinition<any>>;
}): McpSdkServerConfigWithInstance
```

## 内部参考

### 关键最小化标识符 (sdk.mjs)

| 最小化 | 用途 |
|----------|---------|
| `s_` | V1 `query()` 导出 |
| `e_` | `unstable_v2_createSession` |
| `Xx` | `unstable_v2_resumeSession` |
| `Qx` | `unstable_v2_prompt` |
| `U9` | V2 会话类 (`send`/`stream`/`close`) |
| `XX` | ProcessTransport（生成 cli.js） |
| `$X` | Query 类（JSON 行路由，异步迭代） |
| `QX` | AsyncQueue（输入流缓冲区） |

### 关键最小化标识符 (cli.js)

| 最小化 | 用途 |
|----------|---------|
| `EZ` | 核心递归智能体循环（异步生成器） |
| `_t4` | 停止钩子处理程序（无 tool_use 块时运行） |
| `PU1` | 流式工具执行器（API 响应期间并行） |
| `TP6` | 标准工具执行器（API 响应后） |
| `GU1` | 单个工具执行器 |
| `lTq` | SDK 会话运行器（直接调用 EZ） |
| `bd1` | 标准输入读取器（来自传输的 JSON 行） |
| `mW1` | Anthropic API 流式调用者 |

## 关键文件

- `sdk.d.ts` — 所有类型定义（1777 行）
- `sdk-tools.d.ts` — 工具输入模式
- `sdk.mjs` — SDK 运行时（最小化，376KB）
- `cli.js` — CLI 可执行文件（最小化，作为子进程运行）


------


# Apple Container 网络设置（macOS 26）（APPLE-CONTAINER-NETWORKING.md）

Apple Container 的 vmnet 网络需要手动配置才能让容器访问互联网。如果没有正确配置，容器可以与主机通信，但无法访问外部服务（DNS、HTTPS、API）。

## 快速设置

运行以下两个命令（需要 `sudo`）：

```bash
# 1. 启用 IP 转发，以便主机可以路由容器流量
sudo sysctl -w net.inet.ip.forwarding=1

# 2. 启用 NAT，以便容器流量通过您的互联网接口进行伪装
echo "nat on en0 from 192.168.64.0/24 to any -> (en0)" | sudo pfctl -ef -
```

> **注意：** 请将 `en0` 替换为您的活动互联网接口。可以通过以下命令检查：`route get 8.8.8.8 | grep interface`

## 持久化设置

这些设置在重启后会重置。要使其永久生效：

**IP 转发** — 添加到 `/etc/sysctl.conf`：
```
net.inet.ip.forwarding=1
```

**NAT 规则** — 添加到 `/etc/pf.conf`（在任何现有规则之前）：
```
nat on en0 from 192.168.64.0/24 to any -> (en0)
```

然后重新加载：`sudo pfctl -f /etc/pf.conf`

## IPv6 DNS 问题

默认情况下，DNS 解析器会先返回 IPv6（AAAA）记录，然后才是 IPv4（A）记录。由于我们的 NAT 只处理 IPv4，容器内的 Node.js 应用程序会首先尝试 IPv6 并失败。

容器镜像和运行器通过以下方式配置为优先使用 IPv4：
```
NODE_OPTIONS=--dns-result-order=ipv4first
```

这在 `Dockerfile` 和 `container-runner.ts` 中通过 `-e` 标志进行设置。

## 验证

```bash
# 检查 IP 转发是否已启用
sysctl net.inet.ip.forwarding
# 预期结果：net.inet.ip.forwarding: 1

# 测试容器互联网访问
container run --rm --entrypoint curl nanoclaw-agent:latest \
  -s4 --connect-timeout 5 -o /dev/null -w "%{http_code}" https://api.anthropic.com
# 预期结果：404

# 检查桥接接口（仅在容器运行时存在）
ifconfig bridge100
```

## 故障排除

| 症状 | 原因 | 解决方案 |
|------|------|----------|
| `curl: (28) Connection timed out` | IP 转发已禁用 | `sudo sysctl -w net.inet.ip.forwarding=1` |
| HTTP 正常，HTTPS 超时 | IPv6 DNS 解析 | 添加 `NODE_OPTIONS=--dns-result-order=ipv4first` |
| `Could not resolve host` | DNS 未转发 | 检查 bridge100 是否存在，验证 pfctl NAT 规则 |
| 容器在输出后挂起 | agent-runner 中缺少 `process.exit(0)` | 重新构建容器镜像 |

## 工作原理

```
容器 VM (192.168.64.x)
    │
    ├── eth0 → 网关 192.168.64.1
    │
bridge100 (192.168.64.1) ← 主机网桥，容器运行时由 vmnet 创建
    │
    ├── IP 转发（sysctl）将数据包从 bridge100 路由到 en0
    │
    ├── NAT（pfctl）将 192.168.64.0/24 伪装成 en0 的 IP
    │
en0（您的 WiFi/以太网）→ 互联网
```

## 参考资料

- [apple/container#469](https://github.com/apple/container/issues/469) — macOS 26 上容器无法访问网络
- [apple/container#656](https://github.com/apple/container/issues/656) — 构建过程中无法访问互联网 URL


------


# NanoClaw 调试检查表（DEBUG_CHECKLIST.md）

## 已知问题（2026-02-08）

### 1. [已修复] 从过期的树位置恢复分支
当智能体团队生成子智能体 CLI 进程时，它们会写入同一个会话 JSONL 文件。在后续的 `query()` 恢复中，CLI 会读取 JSONL，但可能会选择一个过期的分支尖端（在子智能体活动之前），导致智能体的响应出现在主机从未收到 `result` 的分支上。**修复方案**：传递 `resumeSessionAt` 参数，使用最后一条助手消息的 UUID 来明确锚定每个恢复操作。

### 2. IDLE_TIMEOUT == CONTAINER_TIMEOUT（均为 30 分钟）
两个计时器同时触发，导致容器总是通过强制 SIGKILL（代码 137）退出，而不是优雅的 `_close` 哨兵关闭。空闲超时应更短（例如 5 分钟），以便容器在消息之间正常关闭，而容器超时保持在 30 分钟作为卡住智能体的安全网。

### 3. 智能体成功前光标已前进
`processGroupMessages` 在智能体运行前会提前更新 `lastAgentTimestamp`。如果容器超时，重试将找不到消息（光标已超过它们）。超时后消息会永久丢失。

## 快速状态检查

```bash
# 1. 服务是否正在运行？
launchctl list | grep nanoclaw
# 预期结果：PID  0  com.nanoclaw（PID = 正在运行，"-" = 未运行，非零退出码 = 崩溃）

# 2. 是否有正在运行的容器？
container ls --format '{{.Names}} {{.Status}}' 2>/dev/null | grep nanoclaw

# 3. 是否有停止/孤立的容器？
container ls -a --format '{{.Names}} {{.Status}}' 2>/dev/null | grep nanoclaw

# 4. 服务日志中有最近的错误吗？
grep -E 'ERROR|WARN' logs/nanoclaw.log | tail -20

# 5. WhatsApp 是否已连接？（查找最后一个连接事件）
grep -E 'Connected to WhatsApp|Connection closed|connection.*close' logs/nanoclaw.log | tail -5

# 6. 群组是否已加载？
grep 'groupCount' logs/nanoclaw.log | tail -3
```

## 会话转录分支

```bash
# 检查会话调试日志中的并发 CLI 进程
ls -la data/sessions/<group>/.claude/debug/

# 统计处理消息的唯一 SDK 进程数量
# 每个 .txt 文件 = 一个 CLI 子进程。多个文件 = 并发查询。

# 检查转录中的 parentUuid 分支
python3 -c "
import json, sys
lines = open('data/sessions/<group>/.claude/projects/-workspace-group/<session>.jsonl').read().strip().split('\n')
for i, line in enumerate(lines):
  try:
    d = json.loads(line)
    if d.get('type') == 'user' and d.get('message'):
      parent = d.get('parentUuid', 'ROOT')[:8]
      content = str(d['message'].get('content', ''))[:60]
      print(f'L{i+1} parent={parent} {content}')
  except: pass
"
```

## 容器超时调查

```bash
# 检查最近的超时
grep -E 'Container timeout|timed out' logs/nanoclaw.log | tail -10

# 检查超时容器的容器日志文件
ls -lt groups/*/logs/container-*.log | head -10

# 读取最近的容器日志（替换路径）
cat groups/<group>/logs/container-<timestamp>.log

# 检查是否安排了重试以及发生了什么
grep -E 'Scheduling retry|retry|Max retries' logs/nanoclaw.log | tail -10
```

## 智能体无响应

```bash
# 检查是否从 WhatsApp 接收消息
grep 'New messages' logs/nanoclaw.log | tail -10

# 检查消息是否正在处理（容器已生成）
grep -E 'Processing messages|Spawning container' logs/nanoclaw.log | tail -10

# 检查消息是否正在通过管道传输到活动容器
grep -E 'Piped messages|sendMessage' logs/nanoclaw.log | tail -10

# 检查队列状态 —— 是否有活动容器？
grep -E 'Starting container|Container active|concurrency limit' logs/nanoclaw.log | tail -10

# 检查 lastAgentTimestamp 与最新消息时间戳
sqlite3 store/messages.db "SELECT chat_jid, MAX(timestamp) as latest FROM messages GROUP BY chat_jid ORDER BY latest DESC LIMIT 5;"
```

## 容器挂载问题

```bash
# 检查挂载验证日志（在容器生成时显示）
grep -E 'Mount validated|Mount.*REJECTED|mount' logs/nanoclaw.log | tail -10

# 验证挂载允许列表是否可读
cat ~/.config/nanoclaw/mount-allowlist.json

# 检查数据库中群组的 container_config
sqlite3 store/messages.db "SELECT name, container_config FROM registered_groups;"

# 测试运行容器以检查挂载（空运行）
# 替换 <group-folder> 为群组的文件夹名称
container run -i --rm --entrypoint ls nanoclaw-agent:latest /workspace/extra/
```

## WhatsApp 认证问题

```bash
# 检查是否请求了 QR 码（表示认证已过期）
grep 'QR\|authentication required\|qr' logs/nanoclaw.log | tail -5

# 检查认证文件是否存在
ls -la store/auth/

# 如有需要，重新认证
npm run auth
```

## 服务管理

```bash
# 重启服务
launchctl kickstart -k gui/$(id -u)/com.nanoclaw

# 查看实时日志
tail -f logs/nanoclaw.log

# 停止服务（注意 —— 运行中的容器会分离，不会被杀死）
launchctl bootout gui/$(id -u)/com.nanoclaw

# 启动服务
launchctl bootstrap gui/$(id -u) ~/Library/LaunchAgents/com.nanoclaw.plist

# 代码更改后重新构建
npm run build && launchctl kickstart -k gui/$(id -u)/com.nanoclaw
```


------


# NanoClaw（CLAUDE.md）

个人 Claude 助手。有关理念和设置，请参阅 [README.md](../../README.md)。有关架构决策，请参阅 [docs/REQUIREMENTS.md](../REQUIREMENTS.md)。

## 快速概览

单 Node.js 进程连接到 WhatsApp，将消息路由到在容器（Linux 虚拟机）中运行的 Claude Agent SDK。每个群组都有独立的文件系统和内存。

## 关键文件

| 文件 | 用途 |
|------|------|
| `src/index.ts` |  orchestrator：状态管理、消息循环、智能体调用 |
| `src/channels/whatsapp.ts` | WhatsApp 连接、认证、发送/接收 |
| `src/ipc.ts` | IPC 监听器和任务处理 |
| `src/router.ts` | 消息格式化和出站路由 |
| `src/config.ts` | 触发模式、路径、间隔 |
| `src/container-runner.ts` | 带挂载的智能体容器 |
| `src/task-scheduler.ts` | 运行计划任务 |
| `src/db.ts` | SQLite 操作 |
| `groups/{name}/CLAUDE.md` | 每个群组的独立内存 |
| `container/skills/agent-browser.md` | 浏览器自动化工具（所有智能体可通过 Bash 使用） |

## 技能

| 技能 | 使用场景 |
|------|----------|
| `/setup` | 首次安装、认证、服务配置 |
| `/customize` | 添加渠道、集成、改变行为 |
| `/debug` | 容器问题、日志、故障排除 |
| `/update` | 拉取 NanoClaw 上游更改，与自定义内容合并，运行迁移 |

## 开发

直接运行命令——不要告诉用户运行它们。

```bash
npm run dev          # 热重载运行
npm run build        # 编译 TypeScript
./container/build.sh # 重新构建智能体容器
```

服务管理：
```bash
# macOS (launchd)
launchctl load ~/Library/LaunchAgents/com.nanoclaw.plist
launchctl unload ~/Library/LaunchAgents/com.nanoclaw.plist
launchctl kickstart -k gui/$(id -u)/com.nanoclaw  # 重启

# Linux (systemd)
systemctl --user start nanoclaw
systemctl --user stop nanoclaw
systemctl --user restart nanoclaw
```

## 容器构建缓存

容器 buildkit 会积极缓存构建上下文。仅使用 `--no-cache` 不会使 COPY 步骤失效——构建器的卷保留过时文件。要强制进行真正干净的重建，请先修剪构建器，然后重新运行 `./container/build.sh`。


------


# 贡献指南（CONTRIBUTING.md）

## 源代码变更

**接受的变更：** 错误修复、安全修复、简化、代码精简。

**不接受的变更：** 新功能、增强功能、兼容性改进。这些应该作为技能实现。

## 技能

[技能](https://code.claude.com/docs/en/skills) 是 `.claude/skills/` 目录中的 Markdown 文件，用于教 Claude Code 如何改造 NanoClaw 安装。

贡献技能的 PR 不应修改任何源代码文件。

您的技能应包含 Claude 遵循的**说明**，以添加该功能——而不是预先构建的代码。请参阅 `/add-telegram` 作为良好示例。

### 为什么？

每个用户都应有干净且最小化的代码，完全满足其需求。技能允许用户有选择地向其 fork 添加功能，而不会继承他们不需要的功能代码。

### 测试

在提交前，请在全新克隆上测试您的技能。
