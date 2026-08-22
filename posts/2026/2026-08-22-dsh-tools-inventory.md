---
type: article
title: "DeepSeek Harness — 内置模型工具（Tool）分类整理"
date: 2026-08-22 16:50:00 +0800
tags: [dsh, deepseek, harness, architecture, tools]
---

> 分析对象：`packages/**/src` 下所有经 `defineTool(...)` / `ctx.tools.register(defineTool(...))` 注册、或运行时注入的模型侧工具。
> 排除：测试 fixture、浏览器端 UI 占位工具、zod schema 字段名（误报）。
> 所有工具均由独立「消费方」插件注册，底层能力提供方（Provider）可在不改工具契约的前提下替换。

---

## 一、总览（按能力族分组的工具数）

| 能力族 | 工具（模型名） | 数量 |
|---|---|---|
| 文件系统 `fs` | `read` `write` `edit` `str_replace_editor` `glob` `grep` `read_image` | 7 |
| Shell `shell` | `bash` `pwsh`（各自另有 persistent 形态） | 2(+2) |
| 持久终端 `terminal` | `terminal_open` `terminal_close` `terminal_read` `terminal_send` `terminal_list` `terminal_signal` | 6 |
| 代码执行 `code-runtime` | `run_code`（保留传输，注册表构造，非 defineTool） | 1 |
| 网络检索 `web` | `web_search` `web_fetch` | 2 |
| 代码智能 `lsp` | `lsp` | 1 |
| 技能 `skill` | `skill` | 1 |
| 子智能体 `subagent` | `spawn_teammate`(→list_agents/send_message/wait_agent/interrupt_agent/report) `list_agents` `send_message` `interrupt_agent` `report` | 6 |
| Agent Teams `experimental` | `spawn_teammate` `list_agents` `wait_agent` `interrupt_agent` `team_task_create` `team_task_get` `team_task_list` `team_task_update` | 8 |
| 工作流 `workflow` | `workflow` `ralph` | 2 |
| 目标 `goal` | `create_goal` `get_goal` `update_goal` | 3 |
| 提醒 `schedule` | `schedule_create` `schedule_delete` `schedule_list` | 3 |
| 待办 `todo` | `todo_write` | 1 |
| 后台任务 `jobs` | `job_kill` `job_list` `job_output` | 3 |
| 会话检索 `session-query` | `session_event_read` `session_event_search` `session_event_trace` `session_search` `session_trace` | 5 |
| 人机交互 `interaction` | `ask_user_question` | 1 |
| 计划模式 `plan` | `exit_plan_mode`（运行时注入，plan 模式专属） | 1 |
| 运行时自修改 `extensions` | `cordis_define` `cordis_inspect_list` `cordis_inspect_query` `cordis_inspect_self` `cordis_run` `cordis_stop` `cordis_undefine` | 7 |

> 注：`spawn_teammate` 在 `subagent` 与 `experimental/tool-agent-team` 中**同名不同实现**（后者为隐式根 Agent Teams 形态，带任务板）；`bash`/`pwsh` 各自有一次性与持久化（`tool-*-persistent`）两种注册，default spine 选其一。

---

## 二、逐工具明细（模型名 · 所属插件 · 能力说明）

### 文件系统 `fs/`
| 工具 | 所属包 | 说明 |
|---|---|---|
| `read` | `fs/tool-fs/src/read.ts` | 读取 UTF-8 文本文件，返回带行号内容。 |
| `write` | `fs/tool-fs/src/write.ts` | 创建或整体替换 UTF-8 文本文件。 |
| `edit` | `fs/tool-fs/src/edit.ts` | 通过替换字面文本编辑已有 UTF-8 文本文件。 |
| `str_replace_editor` | `fs/tool-str-replace-editor/src/index.ts` | 精准替换编辑器：`view` `create` `str_replace` `insert` 四种命令。 |
| `glob` | `fs/tool-fs-search/src/glob.ts` | 按 glob 模式查找文件路径，仅返回文件路径（不含目录）。 |
| `grep` | `fs/tool-fs-search/src/grep.ts` | 用 ripgrep 正则搜索文件内容，返回匹配行及行号。 |
| `read_image` | `fs/tool-fs/src/read-image.ts` | 读取 PNG/JPEG/WebP/GIF 并返回图像本身（需当前模型支持图像）。 |

### Shell 执行 `shell/`
| 工具 | 所属包 | 说明 |
|---|---|---|
| `bash` | `shell/tool-bash/src/index.ts`（一次性）/ `shell/tool-bash-persistent/src/index.ts`（持久） | 执行 bash 命令；persistent 形态偏好相对路径、与后台任务集成。 |
| `pwsh` | `shell/tool-pwsh/src/index.ts`（一次性）/ `shell/tool-pwsh-persistent/src/index.ts`（持久） | 执行 PowerShell 命令（Windows 进程语义）。 |

### 持久终端 `terminal/`
| 工具 | 说明 |
|---|---|
| `terminal_open` | 从已注册后端类型创建持久化、归属隔离的终端会话（跨工具调用保持状态）。 |
| `terminal_close` | 关闭终端并等待其拥有的进程树全部退出。 |
| `terminal_read` | 读取终端保留输出的有界页（不发送输入）。 |
| `terminal_send` | 向终端发送文本，默认提交回车并等待提示符。 |
| `terminal_list` | 列出当前 Agent 拥有的持久终端会话。 |
| `terminal_signal` | 向终端当前前台进程组发送允许的信号。 |

### 代码执行 `code-runtime/`
| 工具 | 说明 |
|---|---|
| `run_code` | 保留传输（registry 构造，非 defineTool）。执行模型编写的单个程序，捕获 stdout 与返回值；Code Mode 下仅此工具可直接调用，并附带生成的 SDK。 |

### 网络检索 `web/`
| 工具 | 说明 |
|---|---|
| `web_search` | 经 `ctx.web` 提供方（DeepSeek / Exa / Perplexity）做网络搜索。 |
| `web_fetch` | 抓取指定 HTTP(S) URL 内容并解码为文本。 |

### 代码智能 `lsp/`
| 工具 | 说明 |
|---|---|
| `lsp` | 查询语言服务器做精准代码导航。仅 4 个语义操作：`goToDefinition` `findReferences` `goToImplementation` `hover`；行列为基于 1 的 UTF-16 坐标（findReferences 含声明处）。 |

### 技能 `skill/`
| 工具 | 说明 |
|---|---|
| `skill` | 加载可用技能的完整指令。在按名称执行某技能任务前应先用确切技能名调用此工具。 |

### 子智能体 `subagent/`
| 工具 | 说明 |
|---|---|
| `spawn_teammate` | 委派一个后台子 Agent（进程内 spawn/fork 或进程外 ACP/Claude-Code/Codex/SDK 后端）。 |
| `list_agents` | 按持久 id + 标签列出可续接的后台子 Agent。 |
| `send_message` | 向某子 Agent 发送消息，延续同一会话。 |
| `interrupt_agent` | 请求取消一个后台 Agent。 |
| `wait_agent` | 等待下一子 Agent 状态 / 邮箱 / 共享任务变化。 |
| `report` | （子→父通道）子 Agent 结束前向启动它的 Agent 报告选中内容。 |

### Agent Teams（实验）`experimental/`
| 工具 | 说明 |
|---|---|
| `spawn_teammate` | 创建命名、持久化的团队成员（仅 Team Lead 可调用）。 |
| `list_agents` | 列出 Lead 与所有持久团队成员及其运行时状态。 |
| `wait_agent` | 等待下一成员状态、邮箱或共享任务变化。 |
| `interrupt_agent` | 中断某个团队成员。 |
| `team_task_create` | 在共享任务板上创建一条无主待办任务。 |
| `team_task_get` | 读取某共享任务的完整最新值（改动/执行前先读）。 |
| `team_task_list` | 列出共享任务（就绪度、负责人、revision、阻塞、写作用域警告）。 |
| `team_task_update` | 基于最新 revision 的 CAS（compare-and-set）更新共享任务动作。 |

### 工作流 `workflow/`
| 工具 | 说明 |
|---|---|
| `workflow` | 模型编写的编排工作流，在子智能体之上运行（worker-thread 引擎）。 |
| `ralph` | 固定策略的「全新 Agent」Ralph 工作流：每轮使用不可变完成目标拉起一个全新 Agent。 |

### 目标 `goal/`
| 工具 | 说明 |
|---|---|
| `create_goal` | 从直接人类请求推断出的具体完成目标，创建目标。 |
| `get_goal` | 读取当前目标。 |
| `update_goal` | 更新当前目标 revision（`edit`/`pause`/`resume` 需直接操作）。 |

### 会话内提醒 `schedule/`
| 工具 | 说明 |
|---|---|
| `schedule_create` | 创建提醒，到期时向原会话呈现指定内容（持久态存于会话日志）。 |
| `schedule_delete` | 按精确的会话内 schedule id 删除提醒。 |
| `schedule_list` | 列出当前会话的提醒。 |

### 待办 `todo/`
| 工具 | 说明 |
|---|---|
| `todo_write` | 完整任务列表，替换之前的所有列表（单会话拥有）。 |

### 后台任务 `jobs/`
| 工具 | 说明 |
|---|---|
| `job_kill` | 按 job id 请求取消正在运行的后台任务（立即返回，实际停止后结算为 killed）。 |
| `job_list` | 列出本会话后台任务（运行中 + 已完成）及其 id、类型、状态。 |
| `job_output` | 读取后台任务输出（流式任务仅返回上次读取后的新增）。 |

### 会话检索 `session-query/`
| 工具 | 说明 |
|---|---|
| `session_event_read` | 读取某授权会话中一条完整、未删节的事件及相邻原始事件摘要。 |
| `session_event_search` | 在单个授权会话内搜索历史事件（当前会话排除执行此搜索的步骤）。 |
| `session_event_trace` | 读取某事件与引用源事件之间的全部直接替换与关系。 |
| `session_search` | 在调用者工作区内搜索先前会话，返回每个会话最强匹配事件。 |
| `session_trace` | 读取围绕某会话的授权会话谱系（含完整可见祖先与后代）。 |

### 人机交互 `interaction/`
| 工具 | 说明 |
|---|---|
| `ask_user_question` | 在继续前向用户提问（问题/选项）。 |

### 计划模式 `plan/`（运行时注入）
| 工具 | 说明 |
|---|---|
| `exit_plan_mode` | 仅在 plan 模式可用。提交完整 markdown 计划供用户审阅，获批后离开 plan 模式；用户可批准（下一步执行）或继续规划，反馈回显在工具结果中。该工具在 plan 模式非激活时仍注册，保证工具目录跨状态稳定。 |

### 运行时自修改 `extensions/`
| 工具 | 说明 |
|---|---|
| `cordis_define` | 定义一个不可变 Cordis Package（新 Plugin 用 `kind:`）。 |
| `cordis_inspect_list` | 列出 Host 已知的所有 Cordis 检视提供方（含本地 Host 提供方与最新动态注册）。 |
| `cordis_inspect_query` | 运行某检视提供方显式声明的只读查询（platform/provider/method 必填）。 |
| `cordis_inspect_self` | 以递进细节级别检视当前 Session 拥有的动态 Cordis 对象。 |
| `cordis_run` | 激活某动态 Plugin 的一个精确 Package（`mode:` 选择）。 |
| `cordis_stop` | 停止某动态 Plugin 当前 Run 并取消未完成的审批/激活请求。 |
| `cordis_undefine` | 永久移除当前 Session 拥有的某动态 Plugin（运行中/等待中则先停止）。 |

---

## 三、人类侧命令（非模型工具，列作对照）

以下为经 `ctx.commands` 注册、面向人类操作者的斜杠/快捷键命令，模型**不会**直接调用：

| 命令 | 所属包 | 说明 |
|---|---|---|
| `compact` | `compaction/command-compact` | 触发会话压缩（摘要/裁剪）。 |
| `feedback` | `feedback/command-feedback` | 记录一条仅存于会话日志的反馈备注。 |
| `goal` | `goal/command-goal` | 人类侧目标命令（与 `tool-goal` 模型工具并列）。 |
| `plan`（`/plan on`·`/plan off`） | `plan/plan-mode` | 进入/退出 plan 模式（与 `exit_plan_mode` 配合）。 |
| `export` | `session-query/session-log-export` | Web 端 `/export` 导出会话日志。 |
| `permission` | `interaction/permission-presets` | 配置默认权限 / 切换当前会话访问级别。 |

---

## 四、工具注册机制要点

1. **统一注册入口**：每个模型工具都由一个独立 Consumer 插件调用 `ctx.tools.register(defineTool({ name, description, parameters, execute }))` 注册（除 `run_code` 由工具注册表本身以保留传输方式构造，以及 `exit_plan_mode` 在 plan 模式下运行时注入）。
2. **能力分层替换**：工具 schema/呈现/执行归一处所有；底层 Provider（如 `bash-local` vs `bash-sandbox`、`fs-local` vs `fs-e2b`）在不改动工具契约前提下可替换。
3. **同名多实现**：`spawn_teammate` / `list_agents` / `wait_agent` / `interrupt_agent` 在 `subagent` 与 `experimental/tool-agent-team` 中存在同名不同语义实现——后者属于未发布的隐式根 Agent Teams 形态。
4. **形态切换**：`agent-tool-presentation` 预设行决定模型看到的是 `native`（全部 schema）、`code`（仅 `run_code` + 生成 SDK）还是 `both`；Code Mode 下注册表把指向其他工具的直接调用解析为 `UNKNOWN_TOOL`，保证「公告面」与「可调用面」一致。
