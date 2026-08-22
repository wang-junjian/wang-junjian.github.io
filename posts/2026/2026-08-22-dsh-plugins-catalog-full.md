---
type: article
title: "DeepSeek Harness — 内置插件完整能力分类整理"
date: 2026-08-22 17:10:00 +0800
tags: [dsh, cordis, deepseek, harness, architecture, plugins]
---

> **分析对象**：`packages/` 下全部 `@deepseek-ai/dsh-*` 插件。
> **统计口径**：直接扫描每个包的 `package.json`（name / description 字段）+ 分组级 `README.md`，**逐包核对，无遗漏**。
> **结论**：共 **50 个能力分组、226 个插件包**。
> 核心理念：**everything is a plugin**。整个 harness 建立在 vendored Cordis 之上，每个能力都以插件形式通过 `ctx.effect()` / `ctx.on()` / `ctx.waterfall()` 贡献。
> 架构范式：**能力分离（capability seam）**——同一能力族通常拆成「服务定义（Service Definition）/ 具体提供方（Provider）/ 消费方/工具（Consumer）」三层，互不耦合、可独立替换。

---

## 0. 总览：50 个分组 / 226 个包

| # | 能力域 | 主要分组 | 插件数 |
|---|---|---|---|
| 1 | 核心控制 | `core` | 8 |
| 2 | 大模型（LLM） | `llm` | 5 |
| 3 | 执行与进程 | `shell` `subprocess` `terminal` `code-runtime` `sandbox` `e2b` | 24 |
| 4 | 文件系统与附件 | `fs` `attachment` `spill` | 12 |
| 5 | 代码智能（LSP） | `lsp` | 3 |
| 6 | 网络检索 | `web` | 6 |
| 7 | 技能（Skill） | `skill` | 4 |
| 8 | 多智能体协作 | `subagent` `experimental` | 13 |
| 9 | 任务编排与记忆辅助 | `workflow` `goal` `schedule` `todo` `plan` `jobs` | 14 |
| 10 | 会话与上下文检索 | `session` `session-query` `compaction` | 21 |
| 11 | 人机协作面 | `interaction` `feedback` `context` | 13 |
| 12 | 安全护栏与扩展钩子 | `guard` `hooks` | 5 |
| 13 | 配置 / 凭证 / 存储 / 工作区 / 身份 | `settings` `credentials` `storage` `workspace` `identity` | 10 |
| 14 | GUI 主机与浏览器端 | `host` `client` `api` `typert` | 54 |
| 15 | 自动化与跨进程协议 | `acp` `sdk` | 4 |
| 16 | 运行时自修改与互操作 | `extensions` `mcp` | 5 |
| 17 | 启动 / 组合 / 预设 | `boot` `bundle` `preset` | 7 |
| 18 | 工具库与测试支持 | `util` `test-support` `examples` | 16 |
| 19 | 运行时诊断 | `runtime-diagnostics` | 1 |
| | **合计** | **50 组** | **226** |

---

## 1. 核心控制（`core/`，8）

会话日志、系统提示装配、工具注册表、Agent 契约与默认循环——harness 默认控制流的稳定表面。

| 插件 | 能力 | ctx key |
|---|---|---|
| `scope` | 作用域上下文注册原语（scope 标签、scope 过滤的事件派发） | —（库） |
| `session` | 事件溯源（event-sourced）会话存储 | `ctx.sessions` |
| `system-prompt` | 系统提示词与工具 schema 装配注册表 | `ctx.systemPrompt` |
| `tools` | 工具注册表与执行管道 | `ctx.tools` |
| `agent` | Agent 接口、注册表、发起者作用域、事件词汇 | `ctx.agents` |
| `agent-default-model` | Agent 入口共享的默认模型选择（会话未单独选择时生效） | `ctx.agentDefaultModel` |
| `agent-loop` | 具体的 Agent 驱动循环实现（可被替换） | `ctx.agentLoop` |
| `agent-tool-presentation` | Agent 平面呈现选择器：将某 Agent 的工具组合为 Code Mode / native / both | — |

---

## 2. 大模型能力（`llm/`，5）

LLM 服务接缝 + 流式词汇 + 多提供方适配器。所有包均为 product 级。

| 插件 | 能力 | ctx key |
|---|---|---|
| `llm` | 提供方中立的 LLM 服务接口（抽象服务、内容块词汇、流式分块组装器） | `ctx.llm` |
| `token-meter` | 可重放的 token 计量服务 | `ctx.tokenMeter` |
| `llm-retry` | 提供方路由的 LLM 请求重试策略 | — |
| `llm-deepseek` | DeepSeek chat-completions 适配器 | — |
| `llm-pi-ai` | pi-ai 支撑的 DeepSeek 适配器（llm-deepseek 的设计验证孪生实现） | — |

---

## 3. 执行与进程（shell / subprocess / terminal / code-runtime / sandbox / e2b）

### 3.1 Shell（`shell/`，10）
| 插件 | 能力 | ctx key / 工具 |
|---|---|---|
| `shell` | 抽象 bash 执行器接缝（Service Provider 与 Consumer 共享） | `ctx.shell` |
| `bash-local` | 经 `subprocess` 执行本地 bash | 注册 `ctx.shell` |
| `bash-sandbox` | 消费沙箱的执行器（每命令经 `ctx.sandbox` 围栏，回报拒绝/执行结果事实） | 注册 `ctx.shell` |
| `pwsh-local` | 本地 PowerShell 执行器 | 注册 `ctx.shell` |
| `pwsh-sandbox` | 沙箱化 PowerShell 执行器 | 注册 `ctx.shell` |
| `shell-env` | 工具无关的受管 `DSH_*` 环境变量注册表 | `ctx.shellEnv` |
| `tool-bash` | 模型可调用 bash 工具（可选通用后台任务 + 沙箱升级支持） | `bash` |
| `tool-bash-persistent` | 模型可调用 owner 作用域持久 Bash 工具（由 Harness PTY 服务支撑） | `bash`（持久形态） |
| `tool-pwsh` | 模型可调用 pwsh 工具 | `pwsh` |
| `tool-pwsh-persistent` | 模型可调用 owner 作用域持久 PowerShell 工具 | `pwsh`（持久形态） |

### 3.2 子进程（`subprocess/`，2）
| 插件 | 能力 | ctx key |
|---|---|---|
| `subprocess` | 子进程接缝：托管进程组、有界 spill 支撑的输出、升级 kill，统一在一抽象服务后 | `ctx.subprocess` |
| `subprocess-local` | 本地子进程实现 | 注册 `ctx.subprocess` |

### 3.3 持久终端（`terminal/`，3）— PTY 伪终端
| 插件 | 能力 | ctx key / 工具 |
|---|---|---|
| `terminal` | 持久 PTY 会话接缝：owner 作用域 id、后端注册表、交互式发送/读取/信号/等待清理 | `ctx.terminals` |
| `terminal-bash` | 基于 `ctx.subprocess` 终端原语的持久 shell PTY 后端 | 注册 `ctx.terminals` |
| `tool-terminal` | 6 个模型工具 + 通用后台任务集成（owner 隔离） | `terminal_open/close/read/send/list/signal` |

### 3.4 代码执行（`code-runtime/`，3）
| 插件 | 能力 | ctx key / 工具 |
|---|---|---|
| `code-runtime` | 抽象代码执行接缝：执行模型编写的程序、捕获 stdout/返回 | `ctx.codeRuntime` |
| `code-runtime-worker-thread` | Worker-thread 后端（隔离于宿主事件循环，非安全边界） | 注册 `ctx.codeRuntime` |
| `code-runtime-python` | CPython 子进程实现（独立于 worker-thread 的真实 Python 运行时后端） | 注册 `ctx.codeRuntime` |
| → 消费方 | 工具注册表 Code Mode Consumer（`tools: { mode: code }`） | `run_code` |

### 3.5 进程沙箱（`sandbox/`，4）
| 插件 | 能力 | ctx key |
|---|---|---|
| `sandbox` | 进程沙箱接缝 + 同世界隔离词汇 + `SandboxProvider` 契约 | `ctx.sandbox` |
| `sandbox-local` | 本地平台隔离后端（bwrap / npm 分发的 landlock-run / macOS Seatbelt / Windows 受限令牌），功能探测、fail-closed | 注册 `ctx.sandbox` |
| `sandbox-windows-acl` | Windows ACL 写限制沙箱后端（受限令牌 spawn + 能力 SID 写白名单） | 注册 `ctx.sandbox` |
| `sandbox-policy` | 每调用沙箱策略解析器 + 当前模型上下文（部署回退 + 每会话模式与工作区根），被各强制能力族共享 | `ctx.sandboxPolicy` |

### 3.6 远程执行世界（`e2b/`，3，POC）
| 插件 | 能力 | ctx key |
|---|---|---|
| `e2b` | 共享 E2B 沙箱生命周期（创建/销毁、准备工/运行时目录、共享 SDK 句柄） | `ctx.e2b` |
| `fs-e2b` | 在 E2B Filesystem API 上实现 FS 接缝 | `ctx.fs` |
| `subprocess-e2b` | 在 E2B Commands/PTY 上实现子进程接缝 | `ctx.subprocess` |

---

## 4. 文件系统与附件（fs / attachment / spill）

### 4.1 文件系统（`fs/`，7）
| 插件 | 能力 | ctx key / 工具 |
|---|---|---|
| `fs` | 服务定义：规范路径/文件 URI/包含关系、文本 IO、原子变更原语，拥有 `fs/*` 策略事件 | `ctx.fs` |
| `fs-local` | 本地文件系统实现 | 注册 `ctx.fs` |
| `fs-sandbox` | 沙箱执行 FS：按调用模式 + 工作区根策略围栏写/编辑（只读拒改、workspace-write 限制到工作区+临时根），读放行 | 注册 `ctx.fs` |
| `fs-observation-policy` | 文件上下文策略：observed-state + read-before-edit + 版本守卫（仅经 `fs/*` 事件门参与） | — |
| `tool-fs` | 模型工具 `read` `write` `edit`（读窗口化、派发 `fs/*`） | 注册 `ctx.tools` |
| `tool-fs-search` | `glob` `grep` 发现工具（打包 `@vscode/ripgrep` 经 `ctx.subprocess` 启动） | 注册 `ctx.tools` |
| `tool-str-replace-editor` | `str_replace_editor`：查看/创建/字面替换/行插入 | 注册 `ctx.tools` |

### 4.2 附件（`attachment/`，2）
| 插件 | 能力 | ctx key |
|---|---|---|
| `attachment` | 不可变附件存储接缝：引用、图片限制、存储服务；字节仅在用户提交或适配器提交模型输出时入库 | `ctx.attachments` |
| `attachment-local` | `DSH_HOME` 下的内容寻址私有存储 | 注册 `ctx.attachments` |

### 4.3 工具输出溢出（`spill/`，3）— 超限输出落盘
| 插件 | 能力 | ctx key |
|---|---|---|
| `spill` | 溢出存储接缝：保存超大工具文本并返回检索定位符 | `ctx.spillStore` |
| `spill-local` | 会话作用域本地文件存储（私有） | 注册 `ctx.spillStore` |
| `spill-policy` | 工具结果溢出策略：以有界预览 + 落盘路径替换内联超大纯文本（监听 `ctx.tools`，无服务 API） | — |

---

## 5. 代码智能（`lsp/`，3）

| 插件 | 能力 | ctx key / 工具 |
|---|---|---|
| `lsp` | 服务定义：按品牌 id + 扩展名映射注册提供方、每查询选择、词汇、`LspError` | `ctx.lsp` |
| `lsp-stdio` | 通用多服务 stdio 后端（JSON-RPC、每查询瞬时打开文档） | 注册 `ctx.lsp` |
| `tool-lsp` | 模型工具 `lsp`：单一只读工具，仅 4 个语义操作 `goToDefinition` `findReferences` `goToImplementation` `hover`（UTF-16 坐标，无通用 JSON-RPC 逃逸口） | 注册 `ctx.tools` |

---

## 6. 网络检索（`web/`，6）

| 插件 | 能力 | ctx key / 工具 |
|---|---|---|
| `web` | 提供方注册、选择、共享错误（`WebError` 分类） | `ctx.web` |
| `web-search-exa` | 经 Exa 搜索 | 注册 `ctx.web` |
| `web-search-perplexity` | 经 Perplexity 搜索 | 注册 `ctx.web` |
| `web-search-deepseek` | DeepSeek 原生搜索（经 Anthropic 兼容 API） | 注册 `ctx.web` |
| `web-fetch-http` | 匿名抓取公开 HTTP/HTTPS 资源 | 注册 `ctx.web` |
| `tool-web` | 模型工具 `web_search` `web_fetch` | 注册 `ctx.tools` |

---

## 7. 技能（`skill/`，4）

| 插件 | 能力 | ctx key / 工具 |
|---|---|---|
| `skill` | 技能提供方注册与查找 | `ctx.skills` |
| `skill-badge` | 内置 dsh badge 技能提供方 | 注册 `ctx.skills` |
| `skill-filesystem` | 从本地文件系统发现技能 | 注册 `ctx.skills` |
| `tool-skill` | 模型工具 `skill`：发布技能目录 + 加载器 | 注册 `ctx.tools` |

---

## 8. 多智能体协作（`subagent/` 11 + `experimental/` 2）

### 8.1 子智能体（`subagent/`，11）
| 插件 | 能力 | ctx key |
|---|---|---|
| `subagent` | 抽象子智能体接缝：命名提供方注册表，用于委派给子 Agent | `ctx.subagents` |
| `subagent-in-process-driver` | 共享的进程内运行驱动（被 spawn / fork 后端复用，驱动 `ctx.agents` 上的子 Agent） | — |
| `subagent-spawn-in-process` | 进程内 spawn 后端：运行全新子 Agent | 注册 `ctx.subagents` |
| `subagent-fork-in-process` | 进程内 fork 后端：以父 Agent 日志前缀为种子运行子 Agent | 注册 `ctx.subagents` |
| `subagent-acp` | 进程外 ACP 子 Agent 后端：经 Agent Client Protocol 在 spawn 的子进程中驱动子 Agent | 注册 `ctx.subagents` |
| `subagent-codex` | 一次性 Codex 子 Agent 提供方（官方 app-server 协议） | 注册 `ctx.subagents` |
| `subagent-claude-code` | 一次性 Claude Code 子 Agent 提供方（官方 Agent SDK） | 注册 `ctx.subagents` |
| `subagent-dsh-sdk` | 进程外 SDK 子 Agent 后端：经 stdio JSON-RPC 用 TypeScript SDK 客户端驱动子 Harness 运行时 | 注册 `ctx.subagents` |
| `tool-subagent` | 模型委派工具（spawn_teammate 等） | 注册 `ctx.tools` |
| `tool-subagent-control` | 全局命名工具 `send_message` `interrupt_agent` `list_agents`（基于子 Agent 续接） | 注册 `ctx.tools` |
| `tool-subagent-report` | 子→父报告通道（子作用域注册） | 子作用域注册 |

### 8.2 实验性 Agent Teams（`experimental/`，2，未发布）
| 插件 | 能力 | ctx key / 工具 |
|---|---|---|
| `agent-team` | 隐式根 Agent Teams 名册、持久化对等邮箱、共享任务 DAG | `ctx.agentTeams` |
| `tool-agent-team` | 作用域化模型工具：`spawn_teammate` `team_task_create/get/list/update`（基于 `ctx.agentTeams`） | 注册 `ctx.tools` |

---

## 9. 任务编排与记忆辅助（workflow / goal / schedule / todo / plan / jobs）

### 9.1 动态工作流（`workflow/`，4）
| 插件 | 能力 | ctx key / 工具 |
|---|---|---|
| `workflow` | 工作流能力接缝：`ctx.workflowEngine` 服务、运行词汇、`workflow/*` 事件 | `ctx.workflowEngine` |
| `workflow-worker-thread` | Worker-thread 引擎：在宿主事件循环外执行模型编写编排脚本，将 `agent()` 调用桥接回 `ctx.subagents` | 注册 `ctx.workflowEngine` |
| `tool-workflow` | 模型工具 `workflow`：在 `ctx.workflowEngine` 上运行 JS 编排脚本 | 注册 `ctx.tools` |
| `tool-ralph` | 模型工具 `ralph`：基于 workflow + subagent 接缝的「全新 Agent」Ralph loop | 注册 `ctx.tools` |

### 9.2 目标（`goal/`，4）
| 插件 | 能力 | 工具 |
|---|---|---|
| `goal` | 事件溯源的同会话目标状态与生命周期服务 | `ctx.goals` |
| `goal-round-driver` | 竞态围栏的同会话目标回合驱动 | — |
| `tool-goal` | 模型工具 `create_goal` `get_goal` `update_goal`（带执行期权限校验） | 注册 `ctx.tools` |
| `command-goal` | 人类侧目标命令 | — |

### 9.3 会话内提醒（`schedule/`，1）
| 插件 | 能力 | 工具 |
|---|---|---|
| `schedule` | Agent 作用域、持久化的 after / at / fixed-rate 提醒，存于会话事件日志 | `schedule_create/delete/list` |

### 9.4 待办（`todo/`，1）
| 插件 | 能力 | 工具 |
|---|---|---|
| `tool-todo` | 模型工具 `todo_write`（会话级待办列表，单一 Agent 会话拥有，无可替换提供方） | 注册 `ctx.tools` |

### 9.5 计划模式（`plan/`，1）
| 插件 | 能力 | ctx key |
|---|---|---|
| `plan-mode` | 按 Agent 记录的模式：部署引导、直接斜杠命令、用户审阅的退出（非通用模式注册表） | `ctx.planMode` |

### 9.6 后台任务（`jobs/`，3）
| 插件 | 能力 | ctx key / 工具 |
|---|---|---|
| `jobs` | 后台任务注册表与生命周期契约（共享 id、owner 隔离、轮询、取消、完成监听） | `ctx.jobs` |
| `jobs-local` | 进程内任务注册表实现 | 注册 `ctx.jobs` |
| `tool-jobs` | 模型工具 `job_kill` `job_list` `job_output`（观察/取消/等待/完成通知） | 注册 `ctx.tools` |

---

## 10. 会话与上下文检索（session / session-query / compaction）

### 10.1 会话持久化（`session/`，13）
| 插件 | 能力 | ctx key |
|---|---|---|
| `session-persistence` | 抽象持久化接缝 + 写协调 | `ctx.sessionPersistence` |
| `session-checkpoint-policy` | 语义化持久检查点（在模型请求前与工具副作用前落盘） | — |
| `session-persistence-jsonl` | JSONL 文件持久化后端 | 注册 `ctx.sessionPersistence` |
| `session-persistence-sqlite` | 可选 SQLite 后端（物理 chunk 行打包） | 注册 `ctx.sessionPersistence` |
| `session-projection` | 投影接缝：可合并扩展的投影类型表、提供方契约、`ctx.sessionProjections` 注册表（提供日志派生的每会话当前值） | `ctx.sessionProjections` |
| `session-projection-cache` | 持久化投影缓存（节流写回 + 冷读阶梯：缓存行 + 持久化尾部重放） | `ctx.sessionProjectionCache` |
| `session-stats` | 全日志对话计数与墙钟时间投影 | 注册 `ctx.sessionProjections` |
| `session-title` | 日志支撑的会话标题服务 + 提供方注册表 | `ctx.sessionTitle` |
| `session-title-llm` | 共享的 LLM 标题生成策略（被下述提供方共用） | — |
| `session-title-first-prompt-llm` | 从首条人类消息生成标题 | 注册 `ctx.sessionTitle` |
| `session-title-all-prompts-llm` | 从全部人类消息生成标题 | 注册 `ctx.sessionTitle` |
| `session-telemetry` | 会话遥测后端接缝：事件捕获、投影、脱敏、交递给上报后端 | `ctx.sessionTelemetry` |
| `session-telemetry-otel` | 经 OpenTelemetry JS SDK 日志管线交递（`FULL`/`FEEDBACK_ONLY`/`DISABLED`） | — |

### 10.2 会话检索（`session-query/`，4）
| 插件 | 能力 | ctx key / 工具 |
|---|---|---|
| `session-query` | 可信读取、关系查询、搜索操作契约 | `ctx.sessionQuery` |
| `session-query-sqlite` | 具体后端（SQLite FTS5 全文检索） | `ctx.sessionQuery` |
| `session-log-export` | Web 会话日志导出命令 + 共享下载对话框 | `ctx.sessionLogDownload` |
| `tool-session-query` | 模型工具 `session_event_read` `session_event_search` `session_event_trace` `session_search` `session_trace`（工作区授权） | 注册 `ctx.tools` |

### 10.3 压缩（`compaction/`，4）
| 插件 | 能力 | ctx key |
|---|---|---|
| `compaction` | 压缩接缝 + 事件词汇 | `ctx.compaction` |
| `compaction-basic` | token 计量驱动的压缩策略 + LLM 摘要后端 | 注册 `ctx.compaction` |
| `compaction-tool-result-pruner` | 重放安全的无模型工具结果剪枝（头部/中部/尾部） | `ctx.toolResultPruner` |
| `command-compact` | 人类侧显式压缩斜杠命令 | 注册 `ctx.commands` |

---

## 11. 人机协作面（interaction / feedback / context）

### 11.1 交互（`interaction/`，5）
| 插件 | 能力 | ctx key / 工具 |
|---|---|---|
| `commands` | 插件拥有的命令注册表（供 UI 使用） | `ctx.commands` |
| `user-approval` | 一次性审批决策协调（fail-closed 默认） | `ctx.approval` |
| `permission-presets` | 面向用户的权限预设呈现与持久化（一个产品级 Permissions 选择，捆绑沙箱模式与审批策略旋钮） | `ctx.permissionPresets` |
| `user-questions` | 提供方中立的人机问答接缝 | `ctx.userQuestions` |
| `tool-ask-user` | 模型工具 `ask_user_question`（基于 `ctx.userQuestions`） | 注册 `ctx.tools` |

### 11.2 反馈（`feedback/`，2）
| 插件 | 能力 |
|---|---|
| `command-feedback` | 仅入日志的会话反馈生产者 + 人类 `/feedback` 斜杠命令（不入模型上下文） |
| `message-feedback` | 绑定生命周期的逐条消息评分/备注侧车（存于 storage-domain，不触发遥测交递） |

### 11.3 请求上下文（`context/`，6，向模型注入可见上下文，不定义工具）
| 插件 | 能力 | ctx key |
|---|---|---|
| `session-reference` | 跨会话快照引用 + 持久化不可信模型上下文 | `ctx.sessionReferenceResolver` |
| `file-reference` | 文件引用发现接缝 + `@file` 语法 | `ctx.fileReferences` |
| `file-reference-local` | 本地文件系统文件引用提供方（有界模糊索引） | — |
| `time-context` | 可选持久化每步上下文（当前时间 + 已用时间） | — |
| `tmux-context` | 可选持久化每步上下文（当前 Agent 的 tmux 面板/窗口位置） | — |
| `agent-instructions` | 工作区指令上下文加载器（AGENTS.md / CLAUDE.md；默认 spine 含，可经 bundle 禁用） | — |

---

## 12. 安全护栏与扩展钩子（guard / hooks）

| 插件 | 能力 | ctx key |
|---|---|---|
| `guard/repeat-tool-reminder` | 重复工具调用告警提示（经 `tools/post-execute` 的 `additionalContexts` 注入） | 监听工具/agent 事件 |
| `guard/timeout-policy` | 工具调用超时策略：`tools/execute` 包装，为每次调用武装截止时间，赢则返回 `TOOL_TIMEOUT` | 注册 `tools/execute` 监听 |
| `hooks/hook-protocol` | 共享 Claude Code / Codex hook 线协议：匹配引擎、stdin/退出码/stdout 编解码、多 hook 合并、`hook/*` 会话事件 | 库 |
| `hooks/hooks-claude-code` | Claude Code hook 桥（翻译外部 hooks.json / settings hook 配置到 harness 拦截扩展点） | 插件 |
| `hooks/hooks-codex` | Codex hook 桥 | 插件 |

---

## 13. 配置 / 凭证 / 存储 / 工作区 / 身份

| 插件 | 能力 | ctx key |
|---|---|---|
| `settings` | 命名空间注册、分层解析、提交 | `ctx.settings` |
| `settings-file` | 文件支撑的设置提供方（settings.yaml），并观察外部编辑 | 注册 `ctx.settings` |
| `credentials` | 凭证引用接缝（配置携带引用而非密值，提供方拥有值） | `ctx.credentials` |
| `credentials-local` | 文件支撑的凭证提供方（`$DSH_HOME/.env` + 实时进程环境） | 注册 `ctx.credentials` |
| `storage` | 存储枢纽：命名后端注册表 + 挂载的数据表单设施 | `ctx.storage` |
| `storage-json` | JSON 文件 KV 存储后端 | 注册 `json` 后端 |
| `storage-sqlite` | SQLite 存储后端（kv facet） | 注册 `sqlite` 后端 |
| `storage-domain` | 领域数据表单：schema 校验、事件发射的 KV 领域（覆盖存储后端） | `ctx.storageDomain` |
| `workspace` | 工作区实体注册表：带校验会话归属的持久化工作区记录（领域数据表单上） | `ctx.workspaceRegistry` |
| `identity/anonymous-user-id` | 共享匿名用户身份（遥测/反馈/DeepSeek 请求关联，不代表认证账户） | — |

---

## 14. GUI 主机与浏览器端（host / client / api / typert）

### 14.1 主机端（`host/`，8）
| 插件 | 能力 | ctx key |
|---|---|---|
| `apiproxy` | API 网关：`ApiProxy` 契约（api/）、fetch 载体对（fetch/）、提供 `ctx.apiProxy` 的主机侧网关插件 | `ctx.apiProxy` |
| `webserver` | 路由注册插件：HTTP 与 upgrade 路由、index 变换 tap、静态 dist 回退（不含 harness 概念） | `ctx.webServer` |
| `frontend-static` | Web 壳的 SPA dist 服务：拥有 webserver 回退位，注入 index-tap、拒绝目录穿越、SPA index 回退 | 消费 `ctx.webServer` |
| `directory-picker` | 抽象工作区目录选择接缝 | `ctx.directoryPicker` |
| `directory-picker-native` | 原生 OS 选择器后端 | 注册 `ctx.directoryPicker` |
| `directory-picker-browse` | 应用内浏览后端（列/建原语） | 注册 `ctx.directoryPicker` |
| `directory-picker-auto` | 自适应选择器：启动时解析主机情境，挂载 native 或 browse 后端 | 挂载后端 |
| `plugin-inventory` | 当前 Cordis Loader 插件状态的只读 Remote 投影 | Remote `pluginInventory/list` |

### 14.2 远程 API（`api/`，2）
| 插件 | 能力 | ctx key |
|---|---|---|
| `remotes` | 主机 Agent/Session 查找策略 + 客户端 Remote 贡献装配 | 配置 `ctx.typert`、消费 `ctx.remote` |
| `gateway` | 主机 Typert 派发器 + 客户端 Remote 端点 | `ctx.typertGateway` / `ctx.remote` |

### 14.3 Typert 运行时反射（`typert/`，4）
| 插件 | 能力 | ctx key |
|---|---|---|
| `registry` | 运行时包反射与 schema 存储 | `ctx.typert` |
| `loader` | 发现 Loader 条目并注册生成的主机产物 | 消费 `ctx.loader`/`ctx.typert` |
| `generator` | 从源类型生成运行时产物（构建期库） | — |
| `protocol` | 编译器无关的 Remote 元数据 + Typert 提供方协议 | — |

### 14.4 浏览器端（`client/`，40）
壳层启动、主机 RPC 通信、共享 UI 服务、特性插件。

**基础设施（6）**
| 插件 | 能力 |
|---|---|
| `web` | Web 启动内核：静态模块表、Cordis loader、无框架启动页、UI-renderer 交接 |
| `connection` | 线消费层：HTTP-up/WebSocket-down 客户端、ConnectionController 双流重连、fixture api |
| `runtime` | 客户端核心服务：SlotRegistry、SessionRuntime（作用域树 + 对象层） |
| `modules` | 客户端模块系统（双面体）：node 半组合 `__DSH_BOOT__` 入口图；browser 半是 vendored Loader 消费的惰性 CJS 模块表 |
| `locale` | 区域插件：主机支撑的 zh/en 偏好、浏览器派生回退、区域快照、类型化命名空间字典 |
| `hmr` | 仅开发的脚本加载客户端入口热重载驱动（SSE 重建帧 → 失效/预取 → fiber 交换） |

**槽 / 渲染 / 主题（5）**
| 插件 | 能力 |
|---|---|
| `ui-slots` | 槽注册表纯核心：SlotMap 声明合并、单一注册组合 API、四共享 props 类型、store-seat 类型、renderer 安装接缝 |
| `ui-renderer` | 浏览器 UI 渲染器：React 槽绑定、`ctx.uiRenderer`、组装的应用根 |
| `ui-layout` | 壳插件：三栏 AppFrame + 拖拽手柄、`ctx.layout` 查看态服务（导航 + 面板） |
| `ui-theme` | 主题插件：预插件调色板的主机引导；无 DOM 的 light/dark/system `ThemeRuntime`；`--dsw-*` token 样式与外观设置行 |
| `ui-primitives` | 纯 React 原子组件：控件、图标、markdown、JSON 检视器（零 cordis） |

**领域特性插件（29）**
| 插件 | 能力 |
|---|---|
| `ui-sidebar` | 侧边栏：会话多级树、搜索、分组、状态点 |
| `ui-conversation` | 会话域：骨架、有序聊天流、带主机 busy-Enter 偏好的 composer、详情宿主 |
| `ui-input-trigger` | 输入触发管线：`/` 与 `@` 检测、候选菜单、pick 路由到已注册源 |
| `ui-commands` | 客户端命令面：全局目录缓存、`/` 源、三种命令 UI 种类、popupSelect 注册表 |
| `ui-tool` | 客户端工具调用树渲染器 + 每工具 keyed 呈现槽 |
| `ui-trajectory` | 轨迹事件账本 + 交互式时序概览（纯消费插件，注册进会话 ViewMap，无服务） |
| `ui-message-feedback` | 助手消息动作条上的逐条反馈控件（基于 messageFeedback Host Remote） |
| `ui-user-questions` | Web `ask_user_question` 特性：主机工具挂载 + composer 接管式问题 UI |
| `ui-plan` | 计划模式 composer 控制：plan 投影上的 conversation.input.plan 座位 + `/plan` 命令通道 |
| `ui-goal` | 会话目标面：停靠在 composer 上方的 GoalBar（读自目标会话投影） |
| `ui-jobs` | 会话头部的后台任务列表：从 session/jobs 帧镜像的实时注册表状态 |
| `ui-workflow-run` | 持久化工作流运行 Conversation Node + 嵌套成员披露 |
| `ui-deliverables` | 产出文件轮尾 + 可点击的最终回复文件引用 |
| `ui-attachment` | 会话输入与消息图片槽的动态附件呈现插件 |
| `ui-reference` | 统一 Web `@file` 与 `@session` 引用源 |
| `ui-skill` | Web 技能引用 + 专用技能工具行 |
| `ui-subagent` | 子 Agent 会话目录、续接路由 UI、`@` 引用源 |
| `ui-agent-preset` | Agent-preset 面：后续会话默认、本会话座位、组合编辑器 |
| `ui-model-selection` | 模型选择：`/model` popupSelect（基于 session.models / session.selectModel） |
| `ui-permission-presets` | 权限面：General 设置中的新会话默认 + 当前会话 `/permission` popup |
| `ui-workspace` | 工作区选择器：注册进侧边栏的 WorkspacePicker + 空态工作区槽 |
| `ui-directory-picker-browse` | 应用内目录浏览面：渲染主机列/建原语的 workspace directory-flow 拥有者 |
| `ui-directory-picker-native` | 原生目录选择器面：驱动主机 OS 选择器的无渲染 workspace directory-flow 占用者 |
| `ui-settings` | 设置域基础插件：设置命名空间 scope 服务 + 规范设置槽类型契约 |
| `ui-settings-general` | 设置无属主副本 + 产品引导插件：General 节、壳触发/头部 chrome 内容、设置字典、版本化欢迎通知 |
| `ui-settings-models` | Models 设置 + 共享产品引导对话框（基于现有设置与凭证连接） |
| `ui-settings-plugin-inventory` | Web Plugins 设置中的只读 Cordis Loader 清单 tab |
| `ui-settings-plugins` | Plugins 设置节：特性拥有的 tab + 可配置主机平面插件卡 |
| `ui-brand-official` | Web 客户端侧边栏与会话 Hero 槽的官方 DeepSeek Harness 品牌占位 |

---

## 15. 自动化与跨进程协议（acp / sdk）

| 插件 | 能力 |
|---|---|
| `acp` | 仅自动化的 Agent Client Protocol 服务器（经 JSON-RPC stdio 驱动 Harness agents，互操作传输，非人机交互层） |
| `sdk/protocol` | SDK 运行时线协议：换行分隔的 JSON-RPC stdio 传输，运行时服务器与 SDK 客户端间的命名请求/结果/通知类型 |
| `sdk/client` | TypeScript 客户端 SDK（经 stdio JSON-RPC 驱动 Harness 运行时子进程）：高层 `DeepSeekHarness` turns API + 低层 `HarnessClient` |
| `sdk/server` | 进程外 SDK 客户端的 stdio JSON-RPC 服务器插件 |

---

## 16. 运行时自修改与互操作（extensions / mcp）

| 插件 | 能力 | ctx key / 工具 |
|---|---|---|
| `extensions/tool-cordis` | 自引用的 cordis 工具集：检视实时运行时、挂载/销毁模型编写的插件 | `cordis_inspect_list/query/self` `cordis_define/run/stop/undefine` |
| `extensions/cordis-host-runner` | 动态包定义注册表 + 主机半沙箱生命周期 + 调用处理表（模型挂载的双半包） | `ctx.dynamicCordisRunner` |
| `extensions/cordis-client-runner` | 双半动态包浏览器半：事件订阅、闭包求值、守卫外观、loader 条目 | 浏览器 `ctx.dynamicCordisRunner` |
| `extensions/ui-cordis` | Cordis 动态插件定义卡：带 run/stop 开关的 keyed `cordis_define` 工具行 | 注册 slot |
| `mcp/mcp-client` | MCP 客户端桥：连接 MCP 服务器并将其工具注册到 `ctx.tools` | — |

---

## 17. 启动 / 组合 / 预设（boot / bundle / preset）

| 插件 | 能力 | ctx key |
|---|---|---|
| `boot/app-boot` | 共享启动胶水：`.env` 加载、fail-loud Loader 守卫、快照感知配置解析、Loader 启动序列（库） | — |
| `boot/cmdline` | 从 dsh 启动器到注入 `cmdlineArgs` 的应用插件的不可变命令行交接 | `cmdlineArgs` `appExit` |
| `bundle/base` | 共享 dsh 核心 profile bundle：每个 profile 首先应用的 patch 层，在空 profile 根上插入基础插件行 | — |
| `bundle/web-app` | dsh 浏览器表面 bundle：dsh-base 上的 web patch 层 + 运行时胶水插件（前端 dist 服务、web 表面提示、bash 运行时变量、URL 行） | 挂载 rows |
| `bundle/headless` | dsh 一次性 bundle：基于 base 的直接核心 Agent/Session 运行器（无 Host/Web 层） | 挂载 `headless-runner` |
| `preset/agent-presets` | 按预设 cordis.yml 文件的每会话 Agent 组合 | `ctx.agentPresets` |
| `preset/persona` | 将 Agent persona 作为可组合行（预设可改身份而非仅改工具） | — |

---

## 18. 工具库与测试支持（util / test-support / examples）

### 18.1 零依赖工具库（`util/`，7）
| 插件 | 能力 |
|---|---|
| `brand` | 仅类型 `Branded<B>` 名义化类型原语 |
| `home-paths` | 共享文件系统路径助手（解析 Harness 数据根与共享路径） |
| `timeout` | 零依赖超时/截止原语：`clampTimeout` `deadline` `timeoutOf` `TimeoutReason`（仅计时与分类，不终止） |
| `output-retention` | 零依赖有界保留原语：`ItemRetainer`/`TextRetainer` + 中性提示助手 |
| `atomic-write` | 零依赖原子文件替换：独占创建随机后缀临时文件 + 携带调用方权限的 rename（`writeFileAtomic`） |
| `native-command` | 零依赖无 shell `execFile` 运行器（主机原生 OS 集成：utf8 stdio 捕获、abort 传播、Windows 隐藏） |
| `launch-environment` | 不可变启动环境：记录每个值由哪一层提供 |

### 18.2 测试支持（`test-support/`，6，非产品 API）
| 插件 | 能力 |
|---|---|
| `acp-snapshot` | ACP 测试套件：共享子进程启动器、快照场景 harness、预期输出规范化器、套件工厂 |
| `agent-loop-testkit` | 共享前置挂载（供测试具体 agent loop 用） |
| `client-runtime` | jsdom 槽测试运行时：真实 Cordis Context + SlotRegistry + UI 渲染器 + 测试拥有的 session/workspace 替身 |
| `llm-mock-server` | 可脚本化的 OpenAI 兼容 HTTP/SSE 故障服务器（LLM 恢复测试） |
| `llm-replay` | 重放 LLM 插件：用录制会话 JSONL 重建的模型块短路 `llm/stream`（无 key 快照测试） |
| `loader-smoke` | 共享子进程 + 直接 Agent harness（无 key 真实 Loader 示例冒烟测试） |

### 18.3 示例组合（`examples/`，3，demo/参考，非产品 API）
| 插件 | 能力 |
|---|---|
| `agent-spine-demo` | 默认无执行器/无 UI 的 agent spine（含回退会话标题、提供方路由重试、可选持久化目标） |
| `acp-demo` | ACP 自动化服务器应用：agent spine + JSONL 持久化 + ACP 传输 + JSON-RPC stdio bin |
| `jsonrpc-demo` | 启动外部 Cordis 配置用于 stdio JSON-RPC SDK 运行时的 bin |

---

## 19. 运行时诊断（`runtime-diagnostics/`，1）

| 插件 | 能力 | ctx key |
|---|---|---|
| `invariants` | 包拥有的 Harness 运行时不变量注册表服务（开发期运行时契约断言，与 `test-support/invariants` 测试工具互补，但属 product 级注册表） | `ctx.invariants` |

---

## 附 A：面向模型暴露的全部工具名速查

`bash` · `pwsh` · `read` · `write` · `edit` · `str_replace_editor` · `glob` · `grep` · `web_search` · `web_fetch` · `lsp` · `skill` · `todo_write` · `ask_user_question` · `terminal_open/close/read/send/list/signal` · `job_kill/list/output` · `schedule_create/delete/list` · `create_goal/get_goal/update_goal` · `spawn_teammate` · `list_agents` · `send_message` · `wait_agent` · `interrupt_agent` · `team_task_create/get/list/update` · `workflow` · `ralph` · `run_code` · `cordis_inspect_list/query/self/define/run/stop/undefine` · `session_event_read/search/trace` · `session_search/trace` · `exit_plan_mode`（plan 模式运行时注入） · 以及命令类 `compact` `/feedback` `/export` `/goal` `/plan` `/permission` `/model` 等。

## 附 B：设计要点

- **每个模型工具均由独立「消费方」插件**经 `ctx.tools.register(defineTool(...))` 注册；同一能力族的工具 schema / 呈现 / 执行归一处所有，提供方（如 bash-local vs bash-sandbox、fs-local vs fs-e2b、code-runtime-worker-thread vs code-runtime-python）可在不改动工具契约的前提下替换。
- **两个非标准注册**：`run_code` 是注册表构造的保留传输；`exit_plan_mode` 仅在 plan 模式运行时注入（非激活时仍注册以保证工具目录稳定）。
- **同名多实现**：`spawn_teammate` 等在 `subagent` 与 `experimental/tool-agent-team` 中同名不同语义。
- **client 端 40 个插件**几乎不定义模型工具，只负责浏览器侧呈现（React 槽绑定、主机 RPC、UI 服务）；其能力通过 slot 类型契约与主机 Remote 暴露，而非 `ctx.tools`。
