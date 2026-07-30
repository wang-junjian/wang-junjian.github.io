---
type: article
title: "OpenClaw 架构设计与核心模块深度研究"
date: 2026-07-30 10:02:00 +0800
tags: [openclaw, agent, harness]
---

![](/images/2026/OpenClaw/architechture.webp)

## 一、项目定位与设计哲学

OpenClaw 不是 AI 模型，而是一个**开源（MIT）的 AI Agent 运行时框架（Runtime Framework）**——它坐在 AI 模型与外部世界之间，作为一个**常驻运行的单体运行时网关（Gateway）**，负责把自然语言指令转化为真实的系统操作。

**定位公式：**
```
OpenClaw = Gateway（网关） + Agent Runtime（运行时） + Skills（技能） + Memory（记忆）
```

**五项核心设计哲学：**

| 理念 | 说明 |
|------|------|
| Local-first（本地优先） | 数据不离开用户设备，记忆为本地 Markdown，配置为 JSON；使用 Ollama/vLLM 本地模型时内容永不外传 |
| 网关而非框架 | 不是 SDK/库，而是独立运行的控制平面进程 |
| 模型无关（Model-Agnostic） | 一行配置切换 Claude/GPT/Gemini/DeepSeek 等，按任务路由不同模型 |
| 插件化内核 | Skills、Channels、Providers 均可热插拔（v2026.3.22+ 全面插件化） |
| 工程化 Agent | 从聊天机器人升级为任务调度执行系统，强默认不阉割能力，危险路径暴露为操作者可控开关 |

**命名含义：** Claw（龙虾钳子）= 抓取/操控/执行能力；Open = 完全开源、社区驱动。项目前身：WhatsApp Relay → Clawdbot → Moltbot → **OpenClaw**（2026 年 2 月定名，曾成为 GitHub 历史上增长最快的仓库之一，达 250K+ stars）。

---

## 二、整体架构：Gateway-Centric（网关中心化）

OpenClaw 采用**单一长驻 Node.js 进程**架构，在 LLM（"Brain"）、本地执行能力（"Hands"）、持久记忆（"Memory"）与外部消息通道（Channels）之间编排通信。**无微服务、无容器依赖、无跨进程复杂通信**，靠 Node.js 事件循环天然处理并发，部署只需"一个二进制 + 一个配置文件"。

### 2.1 官方高层组件图

```
⚡ Gateway (ws://localhost:18789 / http)
   ├── 🔗 Channels (WhatsApp / Telegram / Discord / Slack / CLI / ...)
   ├── 💻 CLI (openclaw chat)
   ├── 🌐 WebChat (localhost:18789/chat)
   ├── 🧠 Brain (LLM)        ← 推理
   ├── 🤖 Hands (Exec)       ← 执行（shell / file / browser / http）
   ├── 💾 Memory (Local)     ← 记忆
   ├── 🫀 Heartbeat          ← 自治循环
   ├── 🧩 Skills             ← 能力扩展
   ├── 🛣️  Router            ← 消息分发（多 Agent）
   ├── 📡 Node Registry      ← 会话/节点追踪
   └── ✅ Exec Approval Manager ← 命令审批
```

### 2.2 源码级分层架构（src/）

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│ CLI 层            entry.ts → run-main.ts → command-registry                      │
├──────────────────────────────────────────────────────────────────────────────────┤
│ Gateway 层（控制平面）  WebSocket 服务 · HTTP 服务 · 通道管理 · 热重载                 │
├──────────────┬──────────────┬────────────────────────────────────────────────────┤
│ Channel 层   │  Routing 层   │   Plugin 层                                        │
│ 多通道适配     │  路由+会话键   │  工具/通道/Provider 注册                            │
├──────────────┴──────────────┴────────────────────────────────────────────────────┤
│ Auto-Reply / Agent 执行层   dispatch → get-reply → agent-runner → embedded PI     │
├──────────────────────────────────────────────────────────────────────────────────┤
│ AI Provider 层    Anthropic · OpenAI · Ollama · Bedrock · ...                    │
├──────────────────────────────────────────────────────────────────────────────────┤
│ 持久化 / 基础设施层   Config · Sessions · Media · Security · Cron · Daemon · Memory │
└──────────────────────────────────────────────────────────────────────────────────┘
```

---

## 三、核心模块逐一详解

### 3.1 Gateway —— 控制平面（核心进程）

- **源码位置**：`src/gateway/`（主入口 `server.impl.ts`）
- **角色**：系统中心，必须常驻运行。默认监听 `127.0.0.1:18789`，暴露两个接口：
  - **WebSocket**：主控制协议（方法调用、事件推送）
  - **HTTP**：同端口，用于 Hooks 回调、工具调用、Slack、OpenResponses
- **WebSocket 协议四层结构**：
  1. **连接层** `ws-connection.ts` + `message-handler.ts`：握手认证、Challenge/Response、10s 握手超时保护
  2. **协议层** `protocol/index.ts`：AJV 帧结构校验、统一错误码
  3. **方法层** `server-methods.ts`：`authorizeGatewayMethod(role + scope)` 鉴权 + 方法分发
  4. **事件层** `server-broadcast.ts` + `server-chat.ts`：流式事件广播、慢消费者丢弃、幂等缓存
- **三个"总闸"（安全边界）**：

  | 总闸 | 源码 | 作用 |
  |------|------|------|
  | 连接总闸 | `message-handler.ts` | `connect` 握手必须成功，否则关闭 WS |
  | 权限总闸 | `authorizeGatewayMethod` | role/scope 不符直接拒绝 |
  | 带宽总闸 | `MAX_PAYLOAD_BYTES` | 防止单连接拖垮系统 |

- **配置热重载** `startGatewayConfigReloader`：监听配置文件变化，可热更新的直接 `applyHotReload`，否则请求进程重启——**无需手动杀死 Gateway 进程**。

### 3.2 Brain —— 推理引擎（LLM）

- **源码位置**：`src/agents/`、`src/providers/`、`src/agents/auth-profiles/`
- **角色**：LLM 负责理解请求、推理、决定行动；**Brain 从不直接触碰文件系统或网络**，仅通过结构化 tool-call 协议向 Hands 请求动作。
- **Prompt Assembly（上下文装配）**：每次 LLM 调用从多层组装上下文：

  | 层级 | 来源 | 典型大小 |
  |------|------|----------|
  | 系统身份 | SOUL.md | 200–1,000 tokens |
  | Agent 指令 | AGENTS.md, TOOLS.md | 100–500 tokens |
  | 记忆 | 混合检索结果（`~/.openclaw/memory/`） | 默认上限 2,000 tokens |
  | 激活技能 | 匹配的 SKILL.md 指令 | 每技能 100–500 tokens |
  | 会话历史 | 当前 session 近期消息 | 可变 |
  | 通道消息 | 入站消息（带 `EXTERNAL_UNTRUSTED_CONTENT` 边界标记） | 可变 |

- **模型路由（Model Routing）**：按复杂度/成本把不同任务路由到不同模型（心跳用 Haiku、普通对话用 Sonnet、复杂推理用 Opus、隐私敏感用本地模型）。
- **Provider 回退**：主 Provider 故障/限流时自动轮换候选 profile（`runWithModelFallback()`）。
- **Bootstrap 会话作用域（v2026.5.22+）**：子 Agent 只加载 AGENTS.md+TOOLS.md，大幅降低 token 成本。
- **支持的 Provider**：Anthropic、OpenAI、Google Gemini、xAI Grok、OpenRouter、DeepSeek、Ollama/vLLM（本地）、AWS Bedrock、Qwen、Moonshot、Together/HuggingFace、Cloudflare AI Gateway 等。

### 3.3 Hands —— 执行环境

- **源码位置**：`src/agents/pi-tools.ts`、`src/agents/openclaw-tools.ts`
- **四类能力**：

  | 能力 | 说明 | 示例 |
  |------|------|------|
  | Shell | 终端命令 | `ls` `git` `python` `curl` `docker` |
  | Filesystem | 读写改文件 | 建配置、改代码、管日志 |
  | Browser | Chromium 自动化（Playwright） | 填表、爬页、截图 |
  | HTTP | API 请求 | REST、webhook、API 集成 |

- **Tool-Call 协议**：Brain 与 Hands 通过结构化 JSON 通信（`tool_call` → `tool_result`），可链式多工具调用并逐结果决策，循环直至产出最终文本。
- **执行审批（Exec Approval Manager）**：命令执行前先生成 `exec.approval.request`（含规范化 argv、cwd、rawCommand），用户可见确切命令并批准/拒绝。策略：`always` / `on-miss` / `off`。
- **工具权限**：命名 Profile（minimal / coding / messaging / full）+ 工具组 deny list（`group:runtime` 等）。
- **沙箱化**：生产可把 Hands 隔离进 Docker（`sandbox.type: docker`），范围可为 agent/session/shared，模式 off/non-main/all；Workspace 访问级别 none/ro/rw。

### 3.4 Memory —— 记忆系统

- **源码位置**：`src/memory/`
- **存储**：本地 Markdown 文件（`~/.openclaw/memory/`），重启/更新/迁移后依然存活，随时间积累成知识库（preferences / contacts / projects / learnings / tools 等分类）。
- **混合检索（Hybrid Search，70/30）**：
  - **向量检索 70%**：sqlite-vec 本地 embedding，无需外部 API
  - **BM25 关键词 30%**：SQLite FTS5 全文检索
  - 全部本地处理，不上传。
- **上下文预算**：`max_context_tokens`（默认 2000）是最有效的降本杠杆。
- **Dreaming 模式（v2026.5+，memory-core 插件）**：灵感来自睡眠阶段的后台记忆整合，在空闲时段去重、综合、组织记忆。三阶段：
  - **Light**：摄入近 24h 日记，去明显冗余
  - **REM**：7 天滑动窗口内识别模式与关联
  - **Deep**：按 6 个信号（相关性/频率/新鲜度/多样性/可信度/效用）打分，晋升或归档
  - 结果写入 `DREAMS.md` 供人工审阅。
- **可插拔后端**：内置 Markdown、memory-core、PostClaw（Postgres+pgvector）、Redis、Qdrant、ChromaDB 等 12+ 选项。

### 3.5 Heartbeat —— 自治任务循环

- **角色**：每个 Agent 的周期性自治任务循环（结合 Dreaming 集成），让 Agent 在无人干预时主动巡检、维护、推进待办。
- **配置**：`HEARTBEAT.md` 定义自治任务；`openclaw.json` 里可指定心跳专用模型（如 Haiku 降本）。

### 3.6 Channels —— 通道（I/O 桥梁）

- **源码位置**：`src/channels/` + 各通道插件目录（`src/discord/` `src/imessage/` 等）
- **角色**：消息的"入口"与"出口"，每个通道以插件形式注册（`registerChannel({id, label, start, stop, send})`）。
- **内置通道**（部分）：Telegram、WhatsApp、Discord、IRC、Google Chat、Slack、Signal、iMessage 等共 26+ 平台桥接。
- **账号是一级实体**：同一通道可运行多个 `accountId`，独立运行状态，**故障隔离**。

### 3.7 Router + Node Registry —— 路由与多 Agent

- **源码位置**：`src/routing/`
- **路由匹配优先级（高→低）**：peer 精确 → parent peer 继承 → guild+roles → guild → team → account → channel → default agent。
- **Session Key 设计**（`session-key.ts`）：
  - 私聊：`agent:{agentId}:{channel}:{accountId}:direct:{peerId}`
  - 群聊：`agent:{agentId}:{channel}:{accountId}:{peerKind}:{peerId}`
  - 作用：会话消息串联、并发按 session 隔离（Lane）、存储文件定位。
- **Node Registry**：追踪已连接的执行会话与命令队列。

### 3.8 Auto-Reply / Agent 执行层 —— 最复杂的编排

- **源码位置**：`src/auto-reply/`、`src/agents/`
- **执行流水线（5 子层）**：

  | 子层 | 文件 | 核心职责 |
  |------|------|----------|
  | 调度控制 | `dispatch.ts` | typing/block/final 事件、资源释放保证 |
  | 消息编排 | `dispatch-from-config.ts` | 去重、Hooks、TTS |
  | 决策构建 | `get-reply.ts` | 路由解析、指令解析、媒体预处理 |
  | 执行组装 | `get-reply-run.ts` | 系统前缀、队列策略、模型思考等级 |
  | Agent 调度 | `pi-embedded-runner/run.ts` | Lane 排队、模型选择、执行循环 |
  | 单次执行 | `pi-embedded-runner/run/attempt.ts` | 真实 LLM 调用 + 工具执行 |
  | 事件订阅 | `pi-embedded-subscribe.ts` | 流式文本/工具事件分离收集 |
  | 模型回退 | `model-fallback.ts` | 多候选模型轮换 |

- **Lane 并发模型**：每个 Session 独占一个 Session Lane（队列），所有 Session 共享一个 Global Lane（全局并发控制）；消息先入 sessionLane 再入 globalLane。由 `concurrency`（最大并发）与 `maxPending`（最大排队）控制。
- **QueueMode（新消息处理策略）**：`interrupt`（中断当前 run） / `steer`（追加到当前 run 上下文） / `steer-backlog` / `followup`（等当前 run 结束） / `collect`（合并批处理防抖） / `queue`（普通排队）。
- **上下文守护（防"越聊越炸"）**：窗口预检 + 历史卫生 + 配对修复 + 压缩重试 + 超时快照兜底；硬红线 `CONTEXT_WINDOW_HARD_MIN_TOKENS = 16000`（触发拒绝），软警告 `CONTEXT_WINDOW_WARN_BELOW_TOKENS = 32000`（触发压缩）。

### 3.9 Skills —— 能力扩展

- **角色**：YAML+Markdown 定义的技能（来自 ClawHub 市场），教 Agent 何时/如何用工具。任何人都能写，是 Markdown 文件而非硬编码。
- **生态**：ClawHub 上 13K+ 技能、162 个 Agent 模板（24 类），含 coding-agent、mcporter、notion、obsidian、browser、file、database、api 等。

### 3.10 Plugin 系统 —— 插件化骨架

- **源码位置**：`src/plugins/`（loader.ts、registry.ts）
- **设计纪律**（来自 AGENTS.md）：Core（`src/**`）必须对扩展不可知，扩展只能经 `plugin-sdk`、`manifest`、注入的 runtime helpers 与 `api.ts`/`runtime-api.ts` 跨越边界；Gateway 协议改动视为契约变更，须向后兼容或版本化。
- **v2026.3.22+**：插件架构允许社区在不 fork core 的前提下扩展每一层（通道、工具、Provider、Hooks）。5.28 起进一步把重插件依赖移出 core，安装体积下降 52.8%、冷启动提速 5.1x。

### 3.11 持久化 / 基础设施层

| 子系统 | 源码 | 说明 |
|--------|------|------|
| Config | `src/config/io.ts` | TOML/JSON 配置，支持热重载 |
| Sessions | `src/config/sessions/store.ts` | 会话历史持久化，按 sessionKey 分区 |
| Media | `src/media/store.ts`+`server.ts` | 媒体文件管理，带 TTL 与安全校验 |
| Security | `src/security/audit.ts` | 操作审计日志 |
| Cron | `src/cron/` | 定时任务（会话清理、维护） |
| Daemon | `src/daemon/` | 守护进程管理，保证 Gateway 常驻 |

---

## 四、请求生命周期（Request Lifecycle）

任意消息（来自通道/CLI/心跳）的路径：

```
1. 消息到达 → Router 按 channel/peer/account 匹配 Agent 绑定
2. 分发至该 Agent 的 Orchestrator
3. 加载相关记忆（混合检索）
4. 组装 Prompt（SOUL.md + memory + skills + history）
5. 发送至 LLM Provider
6. Provider 返回响应（含 tool calls）
7. Hands 执行工具调用（shell/file/browser/http）
8. 结果回喂 Brain（可循环）
9. 产出最终响应
10. 保存新观察 → 经原通道回复
```

外部消息全程包裹在 `EXTERNAL_UNTRUSTED_CONTENT` 边界标记中，防御 prompt injection。

---

## 五、六大设计原则

1. **Single Process**：单一 gateway 管理一切，垂直扩展为主。
2. **Local-First**：数据全落盘，除 LLM API 外无云依赖。
3. **Model-Agnostic**：换 Provider 只改一行配置，任务级模型路由。
4. **Extensible**：Skills 是 Markdown，Channels 是插件，从 ClawHub 按需安装。
5. **Transparent**：记忆可读 Markdown、配置 JSON、WS 用 JSON 文本帧、审批显式展示命令。
6. **Security-Conscious**：Gateway 默认绑定 localhost，challenge-response + 设备配对认证，外部内容加边界标记，工具执行走审批流（但安全姿态需主动配置）。

---

## 六、最新版本动态（截至 v2026.7.1，2026-07-13）

- **Control UI 大改版**：对话/会话/工作区/用量统一管理；多 session 可并排、可拖拽分屏、刷新后保留布局；实时 Tasks 视图；Usage 页可对比各 Provider/模型/Agent/通道的花费占比（7/30/90 天图）。
- **官方移动端升级**：iOS / Android / macOS App 重大更新；配对管理员可从 Control UI 生成移动端设置 QR/可复制码。
- **模型与 Provider 扩展**：GPT-5.6 兼容、**腾讯 Hy3（Tencent Hy3）**、Meta Muse Spark 1.1、Gemini 3.1、GLM-5 等；更强的 Codex / coding-agent 工作流。
- **通道更新**：Telegram / Slack / Discord / Apple Messages 各自大幅更新；远程浏览器控制、工作区终端、session、goals 改进。
- **稳定性**：修复 Gateway crash loop、定时任务、session 等问题。
- **性能演进（5.22→5.28）**：稳定冷启动提速 5.1x（9.8s→1.9s）、热启动 4.0x、峰值 RSS 降 15%、发布 tarball 缩小 59%、安装依赖数降至 300（较月峰值降 53%）。
- **安全修复**：v2026.3.31 修补 Snyk 发现的文件沙箱 TOCTOU 漏洞（CVSS 9.4，GHSA-9p3r-hh9g-5cmg）——把文件操作移入 Docker 容器内而非主机侧校验路径；建议始终运行最新版。

---

## 七、安全机制小结

- 默认绑定 localhost；设备配对 + challenge-response 认证。
- 三层网关总闸（连接/权限/带宽）。
- 外部内容 `EXTERNAL_UNTRUSTED_CONTENT` 边界标记。
- 命令执行前显式审批（Exec Approval Manager）。
- 工具权限 Profile + 工具组 deny list；危险命令 blocked_commands（如 `rm -rf /`、`dd`）。
- Docker 沙箱隔离 Hands；v2026.3.31 后文件操作在容器内校验。
- 安全审计日志（`src/security/audit.ts`）。

---

## 八、总结

OpenClaw 的本质是一个**以 Gateway 为控制平面的单体 AI Agent 运行时**：Brain（推理）、Hands（执行）、Memory（记忆）、Heartbeat（自治）、Channels（接入）、Skills（扩展）、Router（编排）各司其职又松耦合。其工程亮点在于**本地优先 + 模型无关 + 彻底插件化 + 透明可审计**，并依靠 Lane 并发模型、QueueMode、上下文守护等机制保证长时间可靠执行。v2026.7.x 系列在控制面 UI、移动端、模型生态与性能/安全上持续快速演进，是当下最活跃的开源 Agent 运行时之一。
