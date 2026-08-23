---
type: article
title: "智能体（Agent）架构分层详解"
date: 2026-08-23 21:21:00 +0800
tags: [agent, architecture, codex, dsh, deepseek, harness]
---

![](/images/2026/dsh/harness.webp)

> 基于 `deepseek-ai/deepseek-harness`（TypeScript / Cordis 插件总线）与 `openai/codex`（Rust / codex-rs crate 体系）两个成熟开源项目的源码与架构文档整理。
> 目标：用「分层 + 核心模块详解」的方式，把一个 Agent 讲清楚。

---

## 0. 先定位：什么是 Agent

一个 Agent 本质上是一个**以 LLM 为决策核心、以工具为手、以沙箱为边界、以会话日志为记忆**的闭环系统：

- 它接收用户意图（自然语言 / 注入上下文）；
- 把意图和环境信息**组装成模型上下文**，向 LLM 发请求；
- 解析 LLM 返回的「思考」与「工具调用」；
- 在**受控环境**里执行工具（读文件、跑命令、改代码）；
- 把结果写回**会话日志**，再驱动下一轮，直到任务完成。

无论 TS 还是 Rust 实现，所有 Agent 的模块都收敛到同一组子系统。下面按**自底向上的依赖顺序**分成 7 层。

---

## 分层总览

| 层级 | 层级名称 | 核心职责与关键组件 |
| --- | --- | --- |
| **L6** | 配置与基础设施层 | `config` · `profile` · `bundle` · 身份 / 遥测 / 鉴权 · 持久化 |
| **L5** | 安全与治理层 | 权限 / 审批 / 护栏 · Hooks / 可扩展点 |
| **L4** | 智能体协作层 | 子智能体 / 多智能体 · Skills · 规划 / 目标 / Todo |
| **L3** | 能力执行层 | Tool 注册与执行管线 · 沙箱 · Shell / 子进程 · FS / 代码编辑 · MCP |
| **L2** | 模型与上下文层 | LLM 接入 · 提示词装配 · 上下文压缩 · 项目指令 (`AGENTS.md`) |
| **L1** | 编排内核层 | Agent Loop 状态机 · 会话历史 / 事件溯源 · 事件系统 |
| **L0** | 协议与接入层 | SDK / JSON-RPC · CLI / TUI / Web · ACP 自动化 |

*架构依赖说明：上层依赖下层；L1 是最核心的“大脑”，L3 决定“能不能安全干活”。*

---

## L1 编排内核层（Agent 的大脑）

> 没有这一层就没有 Agent。它定义了「一轮对话（turn）」如何驱动、状态如何流转、记忆从哪来。

### 核心模块

**1. Agent Loop 状态机（编排引擎）**
- **职责**：驱动 turn / step 的生命周期。一个 **turn** 是零到多个 **step**；一个 **step** = 一次模型请求 + 它触发的工具调用。
- **机制**（deepseek 在 `docs/architecture.md` 显式定义）：
  ```
  turn/start → 申领输入 → agent/pre-step(可改写/拒绝)
    → step/start → 投影历史 + 组装提示词 + 工具 schema
    → agent/request → llm/stream → assistant/message
    → tool/call* → tools/pre-execute → execute → post-execute → tool/result*
    → step/end → 是否需要下一轮? → 回到 agent/pre-step
    → agent/turn-stopping → turn/end
  ```
- **关键设计点**：`agent/pre-step` / `agent/request` / `llm/stream` / `tools/*` 是 **waterfall 事件**——监听器必须调用 `next()` 才能委托下去，否则会短路整条链。这是 Agent 的**第一拦截点**。
- **落地**：
  - deepseek：`packages/core/agent-loop`、`packages/core/agent`、`packages/core/session`
  - codex：`codex-rs/core/src/agent`、`codex_thread.rs`、`thread_manager.rs`

**2. 会话历史 / 事件溯源（Session Log）**
- **职责**：Agent 的「记忆」。所有 durable 事实以 append-only 事件流形式写入，模型上下文由它投影派生。
- **核心信条（两个项目共同遵守）**：**「模型可见 ⟺ 已落日志」**。任何进模型请求的内容都必须能从日志重建；新增模型可见输入 = 新增一条 session event。这保证了 fork / resume / 重放 / telemetry 全部同源。
- **落地**：
  - deepseek：`core/session` 的 `SessionEvent` 日志 + `deriveMessages()` 投影；`SESSION_FORMAT_VERSION` 控制兼容性。
  - codex：`thread-store`、`message-history`、`rollout.rs`、`session`。上下文项必须是有界 struct（实现 `ContextualUserFragment`），单条 >1k token 视为 P0 人工审查。

**3. 事件系统（扩展点总线）**
- **职责**：把「能力」与「循环」解耦。事件分三类：
  - **Session 事件**：持久事实（如 `tool/result`），重装后仍在；
  - **Agent 事件**（`agent/*`）：携带活体 `Agent`（inbox / step / status / request），用于观察或拦截在途工作；
  - **Capability 事件**（`fs/*` / `tools/*` / `telemetry/*`）：把策略/适配器挂到某个 seam，无需 import 循环。
- **研究要点**：事件域的选择是大多数改动的第一个决策——「该用哪种事件」决定了你的代码是持久化、拦截、还是纯策略。

---

## L2 模型与上下文层（Agent 的感官与表达）

> 这一层回答两个问题：模型在哪里（接入）、模型"看到"什么（上下文）。

### 核心模块

**1. LLM / 模型接入**
- **职责**：provider adapter 抽象——屏蔽 DeepSeek / OpenAI / Bedrock / Ollama 等差异，提供流式、重试/退避、token 计费、多模型路由。
- **落地**：
  - deepseek：`packages/llm/llm`（抽象 Service + DeepSeek providers）；`packages/api`（远程 BFF 装配 + Typert RPC 网关）。
  - codex：`model-provider`、`backend-client`、`chatgpt`、`responses-api-proxy`、`client.rs`。
- **研究要点**：adapter 是「seam」的 Service Definition 角色——换一家模型供应商，整条产品链路不变。

**2. 提示词装配（system-prompt sections）**
- **职责**：在每次请求前，把系统提示、工具 schema、注入上下文拼成模型实际看到的 messages。
- **机制**：section 是插件注册的；`agent/pre-step` 决定本轮拼哪些。优先级与注入时机直接影响缓存命中率。
- **落地**：deepseek `core/system-prompt` + `context`；codex `context-fragments` + `context_manager` + `prompts`。

**3. 上下文压缩（Compaction）**
- **职责**：当历史逼近上下文窗口上限，压缩旧内容以腾出空间，且不丢失关键事实。
- **研究要点**：token 预算计算、摘要质量、是否走远程压缩（用更强模型做摘要）、压缩后历史如何投影。
- **落地**：deepseek `compaction`；codex `compact.rs` / `compact_remote` / `compact_token_budget`。

**4. 项目指令（AGENTS.md / CLAUDE.md）**
- **职责**：把仓库级的人类指令（约定、禁区、工作流）注入上下文，作为"项目级人格"。
- **落地**：deepseek 在 `context`（workspace instructions）；codex `agents_md.rs` / `agents_md_manager.rs`（发现、合并、缓存）。

---

## L3 能力执行层（Agent 的手）—— 决定"能不能安全干活"

> 这是差异化最强、也最容易出安全问题的层。Agent 的"能力"= 一组可调用工具（tools），工具背后是真实的文件系统与进程。

### 核心模块

**1. Tool 注册与执行管线**
- **职责**：工具 schema 生成、执行前/中/后管线、并行执行、命名空间隔离。
- **机制**：每个工具走 `tools/pre-execute → execute → post-execute`；执行管线是注入鉴权/超时/日志的统一点。
- **落地**：deepseek `core/tools` + capability seams（shell/fs/terminal/web/lsp…）；codex `core/src/tools`（orchestrator / router / parallel / runtimes / registry）+ `tools` crate（`function_tool` / `dynamic_tool`）。
- **deepseek 的 Capability Seam 范式**：每个能力 = **Service Definition + Service Provider + Consumer** 三角色齐全才算 seam。Filesystem 与 Subprocess 共用同一执行世界，因此把 provider 指向远程沙箱，Bash / PTY / LSP 会整体迁移，无需分别 fork。

**2. 沙箱隔离（Sandbox）**
- **职责**：把 Agent  spawned 的进程**关进笼子**——限制文件系统读写根、网络访问，防止误删/外泄。
- **机制**：消费者在 spawn 前用 `SandboxPolicy` 包装 argv；沙箱后端按平台选择。
- **落地**：
  - deepseek：`sandbox`（bwrap / Landlock / Seatbelt 抽象）+ `native/landlock-run`（Node addon）。
  - codex：`sandboxing`（bwrap / landlock / seatbelt / windows）+ `exec`。强调三平台支持矩阵与 WSL 限制（WSL1 不支持 bubblewrap 命名空间）。
- **研究要点**：split filesystem policy（精确可读根 / 可写根 / 只读挖空）、网络策略、violation 处理。

**3. Shell / 子进程 / 终端**
- **职责**：执行命令。PTY 持久会话支持交互式程序；进程树管理避免孤儿进程。
- **落地**：deepseek `shell` + `subprocess` + `terminal`；codex `exec` + `shell.rs` + `exec-server`（含 JSONL / human 两种输出事件处理器）。

**4. 文件系统 / 代码编辑**
- **职责**：读、写、编辑文件。代码编辑通常以 patch 形式提交，便于 diff 与回滚。
- **落地**：deepseek `fs` + `code-runtime`；codex `apply-patch`（流式 parser / `file_update` / `text_file` / `seek_sequence`）——这是 Codex "改代码"的核心，支持增量流式应用补丁。

**5. MCP / 外部工具**
- **职责**：通过 Model Context Protocol 接入第三方工具服务器，把 Agent 能力无限外扩。
- **落地**：deepseek `mcp`；codex `mcp-server` + `codex-mcp` + `rmcp-client`（connection manager / tool 暴露 / 审批 / elicitation）。
- **研究要点**：connection 生命周期、工具暴露策略、外部工具的权限边界。

---

## L4 智能体协作层（Agent 的"团队"）

> 单个 Agent 能力有限；这一层让 Agent 能拆任务、用技能、做规划。

### 核心模块

**1. 子智能体 / 多智能体（Subagents）**
- **职责**：把子任务委托给新 Agent（子智能体），或跨产品委托一个 turn。
- **落地**：
  - deepseek：`subagent`（标准 seam）+ `experimental/agent-team`（roster / 任务板 / mailbox 的可续跑多智能体协调）。
  - codex：`codex_delegate.rs` + `agent-path`（寻址）+ `agent_resolver`。
- **研究要点**：隔离 realm（每个子智能体的注册作用域）、委托协议、结果回收。

**2. Skills / 技能**
- **职责**：把"怎么做某类事"封装为可加载的技能包，按需命中与加载。
- **机制**：技能解析 → 选择（selection）→ 调用（invocation）；支持 mention 语法触发。
- **落地**：deepseek `skill`（provider registry + catalog/loader 工具）；codex `skills`（loading / parser / selection / mentions / model）。

**3. 规划 / 目标 / Todo**
- **职责**：把模糊意图落为可追踪的计划与子目标，支持评审退出。
- **落地**：deepseek `plan` + `goal` + `todo`；codex `prompts/goals.rs` + `review_request` + `review_exit`。

---

## L5 安全与治理层（Agent 的"规矩"）

> 没有这一层，Agent 等于一个有 root 权限的自动脚本。

### 核心模块

**1. 权限 / 审批 / 护栏（Permissions & Guardrails）**
- **职责**：human-in-the-loop——对"后果严重"的工具调用（删库、推公网、付钱）要求人工确认；对低风险操作自动放行。
- **机制**：把工具按 consequential 分级；策略以声明式配置表达；超时/重复调用有 loop-hygiene 守卫。
- **落地**：
  - deepseek：`interaction`（approval / permission / ask-user）+ `guard`（loop-hygiene + 工具超时）。
  - codex：`tools/approvals` + `network_approval` + `safety.rs` + `exec_policy` + `hook_runtime`。

**2. Hooks / 可扩展点**
- **职责**：在生命周期钩子上插入自定义逻辑（如提交前跑 lint、记录审计），以及插件挂载/自修改能力。
- **落地**：
  - deepseek：`hooks`（Claude Code / Codex 共享 wire-protocol 库）+ `extensions`（Agent 自省并挂载/卸载自身插件）。
  - codex：`hook_runtime` + `hook_mcp_executor` + `config` 的 hooks 段。
- **研究要点**：钩子时机语义、wire protocol 兼容、插件热挂载的可逆性（effect 卸载）。

---

## L6 配置与基础设施层（Agent 的"地基"）

> 让 Agent 可部署、可运维、可审计。

### 核心模块

**1. 配置 / Profile / Bundle**
- **职责**：分层配置（默认值 → 全局 → 项目 → 用户 patch）、凭据管理、运行形态组合。
- **机制**：deepseek 用 **profile → bundle → `cordis.patch.yml`** 叠加；每层可替换任意一行配置。codex 用 `config` crate + `cloud-config`（分层 layers）。
- **落地**：deepseek `settings` + `credentials` + `preset` + `bundle`；codex `config` + `cloud-config` + `cloud-tasks`。

**2. 身份 / 遥测 / 鉴权**
- **职责**：匿名身份、用量上报、登录与凭据存储。
- **落地**：deepseek `identity` + `feedback` + `analytics`；codex `installation_id` + `login` + `keyring-store` + `otel`。

**3. 持久化 / 存储**
- **职责**：会话、附件、spill（超限结果落盘）、队列的可靠存储。
- **落地**：deepseek `session`（持久化/投影/标题）+ `attachment` + `spill`；codex `thread-store`（local / in-memory / queue_store）+ `state`。

---

## L0 协议与接入层（Agent 的"门面"）

> 同一套内核，可以有多种门面：命令行、终端 UI、网页、以及供程序调用的 SDK。

### 核心模块

**1. SDK / JSON-RPC / app-server**
- **职责**：把 Agent 能力以协议暴露，支持嵌入其他产品或被自动化调用。
- **落地**：
  - deepseek：`sdk`（JSON-RPC server + TS client）+ `api`/`typert` 类型图 + Python SDK + **ACP**（自动化 Agent Client Protocol server）。
  - codex：`sdk`（Python / TypeScript）+ `app-server-protocol`（v2，camelCase 线格式、cursor 分页、`#[experimental]` 标记）+ `codex-client`。

**2. CLI / TUI / Web**
- **职责**：人类交互界面，事件驱动渲染。
- **落地**：deepseek `apps/cli` + `apps/web` + `terminal`；codex `cli` + `tui`（ratatui）+ `app-server`。

---

## 串起来：一轮对话怎么走完所有层

```text
[L0] 用户在 TUI/CLI/SDK 输入
  ↓
[L1] Agent Loop 申领输入 → agent/pre-step 拦截/改写
  ↓
[L2] 从 Session Log 投影历史 + 组装提示词 sections + 注入 AGENTS.md
      → LLM 接入发请求 → 流式回来 assistant/message
  ↓
[L3] 模型要求调用工具：
      Tool 管线 → 沙箱包装 argv → Shell/FS 执行（或 MCP 外部工具）
      → 结果写回 Session Log（tool/result）
  ↓
[L4] 必要时拆子智能体 / 触发技能 / 更新计划
  ↓
[L5] 后果严重? → 弹审批; 生命周期钩子执行
  ↓
[L1] step/end → 是否继续? 是则回到 pre-step; 否则 turn-stopping → turn/end
  ↓
[L6] 会话持久化、遥测上报
```

---

## 研究优先级建议

按依赖与风险排序：

1. **L1 编排内核**——状态机 + 事件溯源，是理解一切的前提。
2. **L3 能力执行面**——Tool 管线 + 沙箱 + Shell，决定"能不能安全干活"，安全问题的重灾区。
3. **L2 模型与上下文**——规模化瓶颈（上下文窗口、缓存、压缩）。
4. **L4 协作层**——差异化体验（多智能体、技能、规划）。
5. **L5 安全治理**——上线前的必选项。
6. **L6 / L0 地基与门面**——产品化外围，可最后补。

> 一句话：**L1 是大脑，L3 是手脚与笼子，L2 是感官，L4 是团队，L5 是规矩，L6/L0 是地基与门面。** 先把 L1+L3 吃透，Agent 就立得住了。
