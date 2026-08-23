---
type: article
title: "OpenAI Codex CLI — 架构设计与核心模块原理"
date: 2026-08-22 12:04:00 +0800
tags: [codex, openai, cli, architecture]
---

## 1. 项目概述

- **项目**：[`openai/codex`](https://github.com/openai/codex) —— OpenAI 的本地编码 Agent（Codex CLI）
- **核心定位**：在用户本机运行的编码智能体，支撑三种宿主形态：终端 TUI、IDE 插件（经 app-server）、非交互 exec 模式
- **代码规模**：Rust workspace 含约 90–115 个 crate（`codex-rs/Cargo.toml`），crate 统一以 `codex-` 前缀命名；另有 `codex-cli`（Node 包装层）与 `sdk/`
- **主要语言**：Rust（核心）+ TypeScript（CLI 分发包装）
- **构建系统**：同时使用 **Bazel**（根目录 `MODULE.bazel`）与 Cargo workspace

设计哲学（见 `codex-rs/docs/protocol_v1.md`）是：**Core 引擎与 UI 解耦** —— "Codex runs locally, either in a background thread or separate process"，并通过一对队列 **SQ（Submission Queue，UI→Core）** 与 **EQ（Event Queue，Core→UI）** 通信。任何 UI（TUI、桌面 App、IDE 插件、MCP 客户端）都可驱动同一个 Core。

**关键抽象**

| 抽象 | 说明 |
|------|------|
| `Codex` | 核心引擎，本地运行，处理用户输入、调用模型、执行命令、应用补丁 |
| `Session` | 引擎的当前配置与状态，由 `Op::ConfigureSession` 初始化，重配置会中止正在执行的任务 |
| `Task` | 引擎响应用户输入执行的一段工作，由若干 `Turn` 组成；一个 Session 同时最多运行一个 Task |
| `Turn` | 一次"请求模型 → 流式响应 → 执行工具/补丁 → 输出"的迭代，上一 Turn 的输出是下一 Turn 的输入 |

---

## 2. 仓库结构

顶层分三大块：

- `codex-rs/` — 全部 Rust 源码，是架构主体
- `codex-cli/` — 轻量 TypeScript/npm 包装层（`package.json` + `bin` + `scripts`），负责把 `@openai/codex` 发布到 npm 并引导启动 Rust 二进制
- `docs/`、`sdk/`、`scripts/`、`patches/` 等 — 文档、SDK 与构建补丁

`codex-rs/` 内部目录地图：

```
codex-rs/
├── protocol/          # 线协议：Submission/Op、Event/EventMsg、权限与配置类型（唯一事实来源）
├── core/              # codex-core：Agent 大脑——会话、turn 循环、工具编排、压缩、MCP 聚合
│   └── src/
│       ├── session/   # Session 状态机 + run_turn 主循环（mod.rs/session.rs/turn.rs）
│       ├── tools/     # 工具注册表(router/registry)、审批+沙箱编排器(orchestrator)、40+ 工具 handler
│       ├── client.rs  # ModelClient：Responses API 流式通信（SSE/WebSocket、重试、sticky 路由）
│       ├── context/   # 注入模型上下文的片段（AGENTS.md、skills、环境状态等）
│       ├── compact*.rs# 上下文压缩（本地 + 远程多版本）
│       └── rollout.rs # 会话持久化（JSONL rollout，重导出自 codex-rollout）
├── tui/               # ratatui 终端 UI（chatwidget、bottom_pane、history_cell 等）
├── app-server/        # JSON-RPC 2.0 服务器，驱动 VS Code 等 IDE（stdio/websocket/unix socket）
├── app-server-protocol/ # app-server v2 API 类型（ts-rs 生成 TypeScript schema）
├── exec/              # `codex exec` 非交互模式（人类可读 / JSONL 输出两种 event processor）
├── cli/               # 二进制入口、子命令（login、mcp、cloud-tasks、sandbox 调试等）
├── sandboxing/        # 跨平台沙箱抽象：macOS Seatbelt / Linux Landlock+Seccomp / Windows RestrictedToken
├── execpolicy/        # 命令前缀规则策略引擎（决定自动放行/需审批/禁止）
├── exec-server/       # 执行环境管理（本地/远程环境抽象，Environment/EnvironmentManager）
├── codex-mcp/ + rmcp-client/ + mcp-server/  # MCP 客户端聚合与「把 Codex 自己暴露为 MCP server」
├── rollout/           # 会话落盘：JSONL recorder + SQLite 状态库（state_db）+ 反向扫描/索引
├── thread-store/      # 线程持久化抽象（ThreadStore/LocalThreadStore）
├── login/             # ChatGPT 登录与 API key 认证（AuthManager/CodexAuth）
├── model-provider*/   # 模型提供商配置（OpenAI、Ollama、LM Studio、Amazon Bedrock 等）
└── ext/               # 扩展点：agent、connectors、skills、memories、web-search、goal 等插件化能力
```

---

## 3. 进程 / 部署拓扑

默认形态是一个 **前端（CLI/TUI）↔ 独立 app-server 守护进程（承载 Core + 沙箱执行）↔ OpenAI Responses API** 的三层 C/S 架构。同一份 `codex` 二进制通过 `codex-arg0` 角色分发，可被 `arg0` 重入为 `app-server-daemon`、`tui`、`exec-server`、`mcp-server`、`responses-api-proxy` 等子角色。

```mermaid
graph LR
  U[用户] -->|键盘/HTTP| CLI[codex CLI 二进制]
  CLI -->|arg0 分发| TUI[TUI 前端进程]
  TUI -->|UDS / WebSocket<br/>app-server-protocol JSON-RPC| DAEMON[app-server 守护进程]
  DAEMON --> CORE[Codex Core 引擎<br/>codex-core]
  DAEMON --> EXEC[exec-server 沙箱执行层]
  CORE -->|HTTPS / SSE / WS| API[OpenAI Responses API]
  DAEMON -.->|MCP 客户端| MCP[MCP Server]
  subgraph 同一二进制 codex
    TUI; DAEMON; CORE; EXEC
  end
```

要点：

- **CLI 入口** `codex-rs/cli/src/main.rs` 用 clap 解析；无子命令时进入交互式 TUI（`codex_tui::run_main`）。
- **TUI 不直接运行 Core**：先解析 `AppServerTarget`，默认选 `LocalDaemon { UnixSocket }`，由 `codex_app_server_daemon` 拉起守护进程并通过 UDS 通信；`--remote` 时连远程 WebSocket。
- **codex-client 不是 Core IPC 客户端**：它只是外层模型 HTTP 重试/SSE 封装库，与 Core 通信的是 `codex-app-server-client`（`RemoteAppServerClient`）。
- **exec-server**：本地默认进程内承载（`EnvironmentManager`），但拥有独立线协议（`exec-server-protocol`），可 offload 到独立进程/远程主机（含 `noise_relay` 加密信道）。

---

## 4. 协议与 IPC

协议分两层：

### 4.1 进程内逻辑类型（`codex-protocol`）

整个系统围绕一对异步消息类型运转（`protocol/src/protocol.rs`）：

- **`Submission { id, op: Op }`**（:187, :545）：客户端 → core 的操作指令，如 `Interrupt`、`UserTurn`、审批决策 `ReviewDecision` 等，`Op` 有约百种变体。其中 `TurnInput` 直接携带 `oneshot::Sender`，证实进程内走 Rust channel。
- **`Event { id, msg: EventMsg }`**（:1278, :1296）：core → 客户端的事件流，如 `ItemStarted/ItemCompleted`、`RawResponseItem`、`TurnAborted`、`Error` 等。`id` 与 Submission 对应，实现请求-响应关联。

两个枚举均为 `non_exhaustive`。UI 与 Agent 内核完全解耦：TUI、app-server、exec 都只是 Submission/Event 的生产者与消费者。

### 4.2 跨进程线协议（`codex-app-server-protocol`）

- `rpc.rs` 的 `JSONRPCMessage`（Request/Notification/Response/Error，注释明确"不做真正 JSON-RPC 2.0"）
- v1（`protocol/v1.rs`）与 v2（`protocol/v2/*`）模块，v2 扩展 thread/process/fs/remote_control
- Wire 上为换行分隔 JSON
- 有背压保护（过载返回 `-32001`）

MCP 服务端接口（`docs/codex_mcp_interface.md`）暴露 v2 RPCs：`thread/start|resume|fork|read|list`、`turn/start|steer|interrupt`、`account/*`、`config/*`、`model/list` 等，并以 `codex/event/*` 通知流推送实时 Agent 事件；审批以 server→client 请求形式下发（`applyPatchApproval`、`execCommandApproval`）。

---

## 5. 核心引擎：Agentic 循环

核心 crate `codex-rs/core`（`codex-core`）实现了整个智能体循环。对外公开的门面是 `core-api/src/lib.rs` 再导出的 `CodexThread`、`ThreadManager`、`Op`、`Event`。

### 5.1 公共类型与事件订阅

- `ThreadManager`（`core/src/thread_manager.rs`，对外别名 `ConversationManager`）创建/持有线程。
- `CodexThread`（`core/src/codex_thread.rs:202`）= `Arc<Session>` + `SessionIo` + 配置快照。对外别名 `CodexConversation`。
- `SessionIo`（`session/mod.rs:368`）持有 `tx_sub: Sender<Submission>` 与 `rx_event: Receiver<Event>`（无界 `async_channel`）。客户端通过 `CodexThread::next_event()` 顺序 `recv()` 拿到 `Event`；另有 `agent_status: watch::Receiver<AgentStatus>` 广播状态。

### 5.2 单次 Turn 的数据流

```mermaid
sequenceDiagram
    participant UI as TUI/Client
    participant SQ as SessionIo.tx_sub
    participant SubLoop as submission_loop
    participant Task as RegularTask
    participant Ctx as ContextManager
    participant Model as ModelClientSession
    participant Tool as ToolCallRuntime
    UI->>SQ: submit(Op::UserTurn)
    SQ->>SubLoop: Submission
    SubLoop->>Task: spawn_task(turn_context, input)
    Task->>Ctx: for_prompt() -> Vec<ResponseItem>
    Task->>Model: stream(request)
    Model-->>Task: ResponseEvent (OutputItemDone)
    Task->>Tool: handle FunctionCall/CustomToolCall
    Tool-->>Task: tool result
    Task->>Model: feed result (needs_follow_up)
    Model-->>Task: more events / completed
    Task-->>UI: Event (AgentMessage / TurnComplete)
```

核心链路（函数调用栈）：

1. 客户端 `submit(op)` → `SessionIo.tx_sub`。
2. 后台 task `submission_loop`（`session/handlers.rs:515`）收 `Submission` → `Op::TurnInput` 由 `turn_input::handle` 处理 → `spawn_task(RegularTask::new())`。
3. `Session::spawn_task` / `start_task`（`tasks/mod.rs:279/291`）用 `tokio::spawn` 启动，把 `RunningTask` 存入 `active_turn`。
4. `RegularTask::run`（`tasks/regular.rs:39`）发出 `TurnStarted`，循环调用 `run_turn`（`session/turn.rs:153`）。
5. `run_turn`：采样前 `run_pre_sampling_compact` → `capture_step_context` 组装上下文 → `ContextManager.for_prompt()`（`context_manager/history.rs:206`）生成 `Vec<ResponseItem>` → `run_sampling_request`（turn.rs:1340）。
6. `run_sampling_request` → `try_run_sampling_request`（turn.rs:2179）：`client_session.stream(...)` 返回 `ResponseStream`，循环 `stream.next()` 处理 `OutputItemDone`，对 `FunctionCall`/`CustomToolCall`/`LocalShellCall` 经 `handle_output_item_done` → `ToolCallRuntime` 执行，future 推入 `FuturesOrdered`；当 `needs_follow_up` 或 `has_pending_input` 时再次循环。
7. 完成回 `on_task_finished`（tasks/mod.rs:571）发 `TurnComplete/TurnAborted`，并 `maybe_start_turn_for_pending_work` 拉起排队后续 Turn。

### 5.3 任务建模与生命周期

| 抽象 | 实现 | 职责 |
|------|------|------|
| `SessionTask` trait（tasks/mod.rs:187） | `RegularTask` / `ReviewTask` / `CompactTask` | `kind()` / `run(session,ctx,input,cancel)` / `abort()`，装箱为 `AnySessionTask` |
| 状态机 | `ActiveTurn` / `RunningTask` / `TurnState`（state/turn.rs） | 维护 `CancellationToken`、待审批数、工具调用数等 |
| `ReviewTask`（tasks/review.rs:37） | 启动子 `CodexThread` 一次性运行做代码评审，结束写回历史 | 评审模式 |
| `CompactTask`（tasks/compact.rs:17） | 按 `RemoteCompactionSupport` 分派远程/本地摘要 | 上下文压缩 |

生命周期回调在 `tasks/lifecycle.rs`（`emit_turn_start/stop/abort/error_lifecycle`），中断走 `abort_all_tasks` / `abort_turn_if_active`，含 100ms 优雅超时。

### 5.4 Session 状态机

**Session**（`session/session.rs:40`）是一个线程（thread）的运行时状态机，持有服务集合（模型客户端、MCP 运行时、网络代理、已执行工具记录器等）、输入队列（`input_queue.rs`，支持用户在模型运行中追加输入/steer）与 rollout 记录器。外部 `Op` 由 `submission_loop`（`session/handlers.rs`）逐条分发。

**Turn 循环**（`session/turn.rs:153` `run_turn`）单轮执行顺序：

1. 回收上轮异步 hook 结果 → 前置压缩（`run_pre_sampling_compact`）
2. 解析用户输入所需的 MCP server 与显式提及的插件（`required_mcp_servers_for_input`）
3. 捕获 `StepContext`——一次采样的完整快照：上下文、广告给模型的工具表、环境选择
4. 构建注入项（skills/plugins/AGENTS.md 等 `ContextualUserFragment`）并写入历史
5. 进入 **sampling 循环**：取 pending 输入 → 重建 prompt → `run_sampling_request`（turn.rs:1340）→ 流式消费 Responses API 事件，遇到工具调用则执行并把输出追加回历史，直到模型给出最终文本或被中断

`run_sampling_request` 内部带重试循环：区分 `ContextWindowExceeded`（触发压缩）、`UsageLimitReached`（更新限速状态）与可重试错误（指数退避、SSE↔WebSocket 传输降级）。`ModelClientSession` 为 turn 级，缓存 WebSocket 连接与 `x-codex-turn-state` sticky 路由 token，并做 prewarm（`client.rs:1-24`）。

---

## 6. 工具系统、审批与沙箱

### 6.1 工具定义与分发

- 工具由 `ToolExecutor<Invocation>` trait 定义（`tools/src/tool_executor.rs:106`）：实现 `tool_name()` / `spec()` / `exposure()` / `handle()`。`ToolSpec`（tools/src/tool_spec.rs）直接序列化为 Responses API 工具 JSON。
- Core 中更丰富的 `CoreToolRuntime`（`core/src/tools/registry.rs:55`）扩展 hook、遥测、code-mode 元数据。工具收集进 `ToolRegistry`（`IndexMap<ToolName, RegisteredTool>`）。
- `ToolRouter`（`core/src/tools/router.rs:68`）持有 registry 与 `model_visible_specs`。`build_tool_call` 把 `ResponseItem` 解析为 `ToolCall`，`dispatch_tool_call_with_terminal_outcome` 构建 `ToolInvocation` 并调用 `ToolRegistry::dispatch_any_with_terminal_outcome`（跑 pre-tool hook → `handle` → post-tool hook → 生命周期通知）。
- `ToolName` 支持命名空间（MCP 工具被隔离在独立命名空间）。

### 6.2 并行执行门控 & 编排器

- 并行执行在 `ToolCallRuntime::handle_tool_call`（`core/src/tools/parallel.rs:73`）：每个调用 spawn 到 tokio task，受 `parallel_execution: Arc<RwLock<()>>` 门控 —— 支持并行的工具取读锁并发跑，不支持的取写锁串行化全部。
- `ToolOrchestrator`（`core/src/tools/orchestrator.rs:125`）包装"审批 → 选择沙箱 → 尝试 → 被拒重试（不再二次审批，缓存）"的流水线。

### 6.3 审批、execpolicy 与网络审批

- 审批以 `ApprovalContext` / `ApprovalAction`（`core/src/tools/approvals.rs`）表达：`ExecCommand` / `ApplyPatch` / `McpToolCall` / `NetworkAccess` 等。
- orchestrator 首阶段计算 `ExecApprovalRequirement`（`Skip | NeedsApproval | Forbidden`），默认映射来自 `AskForApproval` 策略 + 文件系统策略；决策按会话缓存（`ReviewDecision::ApprovedForSession`）。
- 策略自动审批由 `execpolicy` crate 的 `Policy` / `RuleRef`（`PrefixRule` 命令前缀、`NetworkRule` 主机/端口）驱动，批准后生成 `ExecPolicyAmendment` 使同类命令跳过后续提示。
- `network_approval.rs` 单独门控网络访问；网络访问由独立的 `network-proxy` 强制管控：工具执行可挂起等待「网络审批」，域名/Unix socket 粒度授权。

### 6.4 跨平台沙箱

`codex-sandboxing` 的 `SandboxManager`（`sandboxing/src/manager.rs`）按平台选择，把 `SandboxPolicy`（只读 / 工作区可写 / 完全开放）翻译成平台原生命令包装：

| 平台 | SandboxType | 实现 |
|------|-------------|------|
| macOS | `MacosSeatbelt` | `sandbox-exec` + `.sbpl` 策略（seatbelt.rs） |
| Linux | `LinuxSeccomp` | `codex_linux_sandbox_exe` + landlock/bwrap（linux-sandbox、bwrap crate） |
| Windows | `WindowsRestrictedToken` | 受限令牌 + WFP 网络过滤 + 拒绝读 ACL + 桌面隔离（windows-sandbox-rs） |
| 关闭 | `None` | 不沙箱（仍走 execpolicy 审批） |

`process-hardening` 施加额外进程缓解；`exec-server/src/process_sandbox.rs` 在 spawn 时物化沙箱类型。

### 6.5 具体工具

具体工具在 `handlers/`：shell（unified_exec，支持后台终端会话）、apply_patch（自定义 patch 格式 + Lark 语法文件）、plan、view_image、request_user_input、多智能体（multi_agents v1/v2）、工具搜索等。

---

## 7. 模型接入与流式

- `model-provider` 定义 `ModelProvider`（`model-provider/src/provider.rs`，经 `create_model_provider`），封装 `codex_api::Provider`，支持 OpenAI、Amazon Bedrock、Ollama、LM Studio 等；含 `ProviderCapabilities`（命名空间工具、web 搜索、远程压缩）。
- 实际流式由 `codex_api::ResponsesClient` / `ResponsesWebsocketClient` 完成（`core/src/client.rs:52/54`）。`ModelClientSession::stream` 构造 `/responses` 请求（含 `/responses/compact`），带 websockets-v2 / responses-lite beta 头，返回 `codex_api::ResponseStream`（包装为 `futures::Stream`），流式元素为 `ResponseEvent`（`Created`/`OutputItemAdded`/`OutputItemDone`…）。
- `models-manager` 选模型：`ModelsManager` trait（`OpenAiModelsManager` / `StaticModelsManager`），`RefreshStrategy` 控制在线/离线缓存，`default_model_from_available` 选默认；`codex-backend-openapi-models` 携带 bundled `models.json` 的 `ModelInfo`/`ModelPreset` 类型。
- `backend-client` 是独立的 OpenAI 后端 HTTP 客户端（账户、tasks、限流、配置 bundle），*不*负责模型流式。

---

## 8. MCP 与 Skills

### 8.1 MCP

- `codex-mcp` 用 `McpConfig` / `ResolvedMcpCatalog` 描述服务器，由 `McpRuntime` 经 `rmcp-client`（wrap `rmcp` 协议，支持 stdio/HTTP、OAuth、elicitation）加载。
- 每个 MCP 工具成为 `ToolInfo`（原始 `server_name/tool` + 经过消毒的模型可见 `callable_name/callable_namespace`）。
- Core 中 `McpHandler`（`core/src/tools/handlers/mcp.rs`）实现 `CoreToolRuntime`，其 `handle` 经 `rmcp-client` 转发到服务器，并以 `register_external` 注册到 ToolRouter。
- `mcp-server` 提供反向能力——把 Codex 自身作为 MCP server 暴露给其他 Agent。

### 8.2 Skills

- `skills` crate 建模可复用指令集 —— `SkillMetadata`/`SkillInterface`、`SkillRootLoader`/`LoadedSkills`、frontmatter 解析。
- `ToolMentions`/`extract_tool_mentions` 识别文本中的 `@skill` 标记并解析。
- 系统 skills 经 `include_dir` 嵌入并安装到 `CODEX_HOME/skills/.system`。

---

## 9. 持久化、回放与上下文压缩

### 9.1 对话历史与 Rollout

- **对话历史**：`ContextManager` 的 `for_prompt()` 把底层 `codex_history`（`ResponseItemEnvelope`/`RolloutItem`）转成喂给模型的 `Vec<ResponseItem>`。
- **Rollout（转录）**：`RolloutRecorder`（`rollout/src/recorder.rs:86`）以 JSONL 追加记录 `RolloutItem`，是 thread 与持久化的桥梁；`CodexThread` 暴露 `rollout_path()`、`ensure_rollout_materialized`。
- 配合 SQLite 状态库（`state_db.rs`）做索引与恢复；支持 resume、归档、按游标分页列出历史会话（`list.rs` 的反向扫描器避免全文件读取）。

### 9.2 ThreadStore 与 MessageHistory

- **ThreadStore**（`thread-store/src/lib.rs`）：存储无关的持久化接口（`ThreadStore` + `LiveThread` + `StoredThread`）。`CodexThread::read_thread/load_history/update_thread_metadata` 委托给 `LiveThread`。
- **MessageHistory**：全局 `~/.codex/history.jsonl` 追加日志，与 per-thread rollout 是不同层。

### 9.3 上下文压缩

模型可见上下文是**增量构建、只增不改**的（AGENTS.md 中的硬约束）：所有注入片段实现 `ContextualUserFragment`，受 10K token 上限约束；历史由 `ContextManager` 管理。

- `run_turn` 采样前调 `run_pre_sampling_compact`；采样后依 `context_window_token_status` 判断是否需要 `run_auto_compact`（`CompactionReason::ContextLimit`）。
- 压缩核心在 `core/src/compact.rs`（`run_compact_task`，本地摘要用 `SUMMARIZATION_PROMPT`），把历史替换为 `CompactedItem`，由 `Session::replace_compacted_history` 落地。
- 支持本地截断或远程压缩 API，含 model fallback 与多版本协议。

---

## 10. 宿主层

### 10.1 TUI

- 基于 `ratatui` 的终端 UI：`app.rs` 主事件循环 + `chatwidget.rs` 渲染历史单元格。
- UI 变更必须配 insta 快照测试。

### 10.2 app-server

- JSON-RPC 2.0（stdio 下为 JSONL），驱动 VS Code 等 IDE（stdio/websocket/unix socket）。
- v2 API 遵循严格的命名/序列化规范（camelCase、`*Params/*Response/*Notification`、cursor 分页），用 `ts-rs` 导出 TypeScript schema 给 IDE 插件。
- 有背压保护（过载返回 `-32001`）。

### 10.3 exec

- `codex exec` 一次性非交互执行，两种输出处理器（人类可读 / `--json` JSONL）。

### 10.4 mcp-server

- 反向能力——把 Codex 自身作为 MCP server 暴露给其他 Agent。

---

## 11. 端到端流程（一次用户提问）

```mermaid
sequenceDiagram
    participant U as 宿主(TUI/IDE/exec)
    participant H as submission_loop
    participant T as run_turn (session/turn.rs)
    participant C as ModelClient (Responses API)
    participant O as ToolOrchestrator
    participant S as SandboxManager
    U->>H: Submission{Op::UserTurn}
    H->>T: 分发到当前 Session
    T->>T: 前置压缩 + 捕获 StepContext + 注入 skills/AGENTS.md
    loop 采样循环
        T->>C: 流式请求(历史 + 工具表)
        C-->>T: SSE/WS 事件流(文本delta/工具调用)
        alt 工具调用
            T->>O: 派发工具
            O->>O: execpolicy 预判定 → 用户审批?
            O->>S: Seatbelt/Landlock/WinToken 执行
            S-->>T: 输出追加进历史，继续采样
        else 最终文本
            T-->>U: EventMsg::ItemCompleted / TurnComplete
        end
    end
    T->>T: rollout 落盘 + turn diff 统计
```

---

## 12. 关键 Crate 速查表

| Crate | 角色 |
|-------|------|
| `codex-core` | 核心 Agentic 循环、会话、任务、工具编排、压缩 |
| `core-api` | 对外公开门面（CodexThread / ThreadManager / Op / Event） |
| `cli` | `codex` 二进制入口，arg0 角色分发 |
| `tui` | 终端 UI 前端 |
| `protocol` | SQ/EQ 逻辑类型：Op / EventMsg / SessionId / auth |
| `app-server*`（含 -daemon/-client/-protocol/-transport） | 桌面后端守护进程与跨进程 JSON-RPC 线协议 |
| `codex-client` | 外层模型 HTTP 重试/SSE 封装（非 Core IPC） |
| `tools` | 工具实现、ToolExecutor trait、ToolSpec |
| `sandboxing` / `linux-sandbox` / `bwrap` / `windows-sandbox-rs` / `process-hardening` | 跨平台沙箱与进程缓解 |
| `execpolicy` | 命令/网络审批策略（Policy / RuleRef / Decision） |
| `exec` / `exec-server` | 命令执行与沙箱化执行层（含独立线协议） |
| `model-provider` / `models-manager` / `codex_api` / `backend-client` | 模型提供方、模型选择、Responses API 流式、后端 HTTP |
| `codex-mcp` / `rmcp-client` / `mcp-server` | MCP 集成与 MCP server 接口 |
| `skills` | Skills 系统（加载、解析、@mention 解析） |
| `rollout` / `thread-store` / `message-history` | 转录 JSONL、线程持久化、全局历史 |
| `apply-patch` | 补丁应用工具 |
| `uds` / `stdio-to-uds` | 跨平台异步 UDS 与 stdio↔socket 桥接 |
| `arg0` | 同一二进制多角色重入分发 |

---

## 13. 安全模型与关键设计决策

### 13.1 安全模型：纵深防御

Codex 的安全边界由四层叠加：

1. **策略（execpolicy）** —— 用命令前缀/网络规则做第一层自动判定（允许/询问/禁止），减少审批打断。
2. **审批** —— 执行命令/应用补丁/网络访问前经 `ApprovalAction` 向用户或 guardian 请求许可，且按会话缓存决策，避免重复打扰。
3. **沙箱** —— 按平台施加 seatbelt / seccomp+landlock(bwrap) / Windows 受限令牌，限制文件系统与网络可达范围。
4. **网络代理** —— 独立的 `network-proxy` 强制管控网络访问，域名/Unix socket 粒度授权。

工具并行执行还有读写锁门控，保证非并行工具被串行化。Codex Web（云端智能体）与本地 CLI 共享同一套协议与引擎逻辑，但本地形态额外强调进程隔离与最小权限。

### 13.2 关键设计决策

1. **协议先行**：core 与所有宿主只通过 Submission/Event 通信，IDE、TUI、MCP 外部 Agent 共用同一内核。
2. **Turn 级资源生命周期**：模型连接、工具表、diff 追踪器都以 turn 为界，保证重试与中断语义清晰。
3. **纵深防御**：execpolicy 规则 → 用户审批 → 平台沙箱 → 网络代理，四层串行，审批结果缓存避免重复打扰。
4. **上下文工程纪律**：增量追加、片段结构化、硬上限、自动压缩，围绕推理缓存命中率优化。
5. **crate 拆分抑制 core 膨胀**：AGENTS.md 明确抵制向 codex-core 加代码，新能力优先独立 crate（`ext/*` 是插件化出口）。
