---
type: article
title:  "Kilo Code - AI 编码智能体架构设计文档"
date:   2026-05-17 18:00:00 +0800
tags: [kilo-code, 智能体, 架构设计, opencode, monorepo, turborepo, bun, effect-ts, solidjs, mcp]
---

## 项目总览

Kilo Code 是一个功能强大的开源 AI 编码助手，基于 OpenCode 框架开发。项目采用 **Monorepo 架构**，使用 Turborepo 和 Bun Workspaces 管理多个包。

### 核心数据

| 指标 | 数值 |
|------|------|
| Monorepo 包数量 | 23 |
| TypeScript 文件数 | 5800+ |
| 支持的 AI 模型 | 500+ |
| 内置工具数量 | 50+ |
| UI 组件数（kilo-ui） | 65+ |
| 国际化语言 | 19 种 |
| 开源协议 | MIT |

### 核心特性

- **多模型支持**：支持 500+ AI 模型，包括 Claude、GPT、Gemini、Grok、Codex、GLM 等
- **多客户端**：CLI、VS Code 扩展、Web UI 和桌面应用，满足不同场景
- **丰富的工具集**：50+ 内置工具，涵盖文件操作、命令执行、代码搜索
- **插件扩展**：支持外部插件和 MCP 服务器，动态加载自定义工具
- **会话管理**：完整的会话系统，支持父子会话、上下文压缩、会话恢复
- **浏览器自动化**：集成 Playwright，AI agent 可操作网页、截图、表单填充

---

## Monorepo 依赖架构

Kilo Code 采用 **Turborepo + Bun Workspaces** 分层架构，23 个包协同工作。

### 架构分层

```
核心引擎层
  ├── @kilocode/cli        (packages/opencode)
  ├── @kilocode/plugin      (packages/plugin)
  └── @kilocode/sdk        (packages/sdk/js)

↓ 客户端消费层
  ├── kilo-code           (packages/kilo-vscode)   VS Code 扩展
  ├── OpenCode Desktop    (packages/desktop)      桌面应用（Tauri）
  ├── OpenCode Web        (packages/app)           Web UI（SolidJS）
  └── JetBrains 插件     (packages/jetbrains)

↓ 服务 & 支撑层（基础设施）
  ├── @kilocode/kilo-gateway   (packages/kilo-gateway)   认证 & 路由
  ├── @kilocode/kilo-telemetry (packages/kilo-telemetry) 遥测
  ├── @kilocode/kilo-i18n      (packages/kilo-i18n)      国际化
  ├── @kilocode/kilo-ui        (packages/kilo-ui)        组件库
  ├── @kilocode/kilo-indexing  (packages/kilo-indexing)  代码索引
  └── @kilocode/kilo-docs      (packages/kilo-docs)       文档（Next.js）

↓ 共享工具层
  ├── @opencode-ai/shared
  ├── @opencode-ai/util
  └── @opencode-ai/script
```

### 核心包详细说明

| 包名 | 路径 | NPM 名称 | 职责 |
|------|------|----------|------|
| 核心 CLI | `packages/opencode/` | `@kilocode/cli` | AI 智能体引擎、HTTP 服务器、会话管理（591 文件，~736k 行） |
| VS Code 扩展 | `packages/kilo-vscode/` | `kilo-code` | 侧边栏聊天 + Agent Manager（281 文件，~45k 行） |
| TypeScript SDK | `packages/sdk/js/` | `@kilocode/sdk` | 自动生成的服务端 API 客户端 |
| 网关服务 | `packages/kilo-gateway/` | `@kilocode/kilo-gateway` | 认证、提供商路由、API 集成 |
| 遥测 | `packages/kilo-telemetry/` | `@kilocode/kilo-telemetry` | PostHog 分析 + OpenTelemetry 追踪 |
| UI 组件库 | `packages/kilo-ui/` | `@kilocode/kilo-ui` | 65+ SolidJS 组件、19 语言 i18n |
| Web UI | `packages/app/` | `@opencode-ai/app` | SolidJS 共享前端 |
| 桌面应用 | `packages/desktop/` | `@opencode-ai/desktop` | Tauri 原生应用壳 |
| 插件接口 | `packages/plugin/` | `@kilocode/plugin` | 插件/工具接口定义 |
| i18n | `packages/kilo-i18n/` | `@kilocode/kilo-i18n` | 国际化（19 种语言） |

---

## 核心引擎深度解析

> 包路径：`packages/opencode/` — 591 个文件，~736k 行代码  
> 基于 Effect-TS 函数式架构

### 系统架构总览

```
用户输入（CLI / VS Code / Web）
        ↓
   kilo serve（Hono HTTP Server）
        ↓
    Session 管理（SQLite + Drizzle ORM）
        ↓
    Agent 引擎（Effect-TS Runtime）
        ↓                ↘
    Tool 执行         Provider 路由
   (bash/read/edit…)   (500+ AI Models)
        ↓                ↙
    SSE 流式响应 → 实时返回客户端
```

### 核心模块

#### 1. Agent 智能体系统（`src/agent/`）

多智能体架构，支持 **primary / subagent / all** 三种运行模式：

- **Agent 定义**：Zod Schema 验证 · 名称/描述/模式 · 模型绑定 · 权限规则 · 温度/采样参数
- **Prompt 系统**：内置 generate / explore / compaction / summary / title 提示模板
- **Kilo 扩展智能体**：代码审查、提交消息生成、技能系统、工作流、规则管理
- **Agent Manager**：多会话编排 · Git worktree 隔离 · 并行任务执行

#### 2. Tool 工具系统（`src/tool/`）

30+ 内置工具，统一接口（`Def → ExecuteResult`），支持动态描述和权限控制：

| 工具 | 功能 | 类别 |
|------|------|------|
| `bash` | 执行 Shell 命令（Tree-sitter 静态分析） | 命令执行 |
| `read` | 读取文件内容（支持 offset/limit 分页） | 文件操作 |
| `write` | 写入文件（支持多种编码） | 文件操作 |
| `edit` | 编辑文件（9 种模糊匹配策略） | 文件操作 |
| `glob` | 按模式查找文件 | 搜索 |
| `grep` | 搜索文件内容（正则表达式支持） | 搜索 |
| `task` | 委托子智能体执行 | 任务管理 |
| `todo` / `todowrite` | 待办列表管理 | 任务管理 |
| `webfetch` | 抓取网页内容 | 网络 |
| `websearch` | 网页搜索（Kilo / OpenRouter） | 网络 |
| `codesearch` | 代码搜索（Warpgrep） | 代码搜索 |
| `semantic_search` | 语义代码搜索（LanceDB 向量） | 代码搜索 |
| `skill` | 加载专业技能 | 扩展 |
| `plan` | 进入/退出计划模式 | 规划 |
| `question` | 向用户提问（权限确认） | 交互 |
| `apply_patch` | 应用 Diff 补丁 | 开发 |
| `lsp` | LSP 诊断信息 | 开发 |
| `recall` | 回忆上下文（记忆系统） | 优化 |
| `truncate` | 上下文裁剪（Compaction） | 优化 |

#### 3. Session 会话系统（`src/session/`）

完整的会话生命周期管理：

- 创建 → LLM 交互 → 消息处理 → 上下文压缩（Compaction）→ 溢出处理 → 持久化
- **SQLite 持久化**：基于 Drizzle ORM
- **父子会话**支持、**消息分页**、**会话共享**、**回滚功能**
- **Compaction 策略**：自动上下文裁剪，防止 Token 溢出

#### 4. Server 服务端（`src/server/`）

基于 **Hono 框架**的 HTTP + WebSocket 服务器：

- 支持 SSE、mDNS 自动发现、CORS/压缩中间件
- **路由模块**（12+）：
  - `Global Routes`：`/global/health`、`/global/config`、`/global/event`（SSE）
  - `Control Routes`：`/auth/:providerID`、`/doc`（OpenAPI）、`/log`
  - `Instance Routes`：`/session`、`/project`、`/file`
- **Bun/Node 双适配**

#### 5. Provider 提供商系统（`src/provider/`）

500+ AI 模型支持，涵盖 OpenAI / Anthropic / Google / Mistral 等主流 + GitHub Copilot / GitLab AI 等专用 SDK：

- **30+ SDK 集成**
- **AI SDK v6** 统一接口
- **AC 协议**支持
- **MCP**（Model Context Protocol）支持

#### 6. Permission 权限系统（`src/permission/`）

规则引擎驱动的权限控制：

- 支持 **allow / deny / ask** 三级决策
- 持久化规则，配置文件强制保护
- 跨会话权限排空
- 细粒度"始终允许"规则选择、全局允许开关

#### 7. Config 配置系统（`src/config/`）

多层级配置合并：

- 全局 → 项目 → 扩展注入
- 支持变量插值
- 遗留格式自动迁移
- 支持 `.kilocoderc` / `kilocode.config.ts` 等多种配置源

### 核心入口文件解析

```typescript
// packages/opencode/src/index.ts
// 初始化遥测和身份认证
await Telemetry.init({ dataPath, version, enabled })
await migrateLegacyKiloAuth(...)

// 数据库迁移（首次运行）
await JsonMigration.run(drizzle(...), { progress: ... })

// yargs CLI 构建 — 20+ 命令
const cli = yargs(args)
  .scriptName("kilo")
  .command(RunCommand)
  .command(ServeCommand)
  .command(AgentCommand)
  // ... 20+ 命令

// 错误处理与优雅退出
await Telemetry.shutdown()
await Instance.disposeAll()
```

---

## 内置工具生态

### 工具分类汇总

**文件操作类**：`read` · `write` · `edit` · `apply_patch`

**搜索类**：`grep` · `glob` · `codesearch` · `semantic_search` · `warpgrep`

**命令执行类**：`bash`

**网络类**：`websearch` · `webfetch`

**任务/规划类**：`task` · `todo` / `todowrite` · `plan`

**开发辅助类**：`lsp` · `diagnostics` · `suggest`

**扩展/优化类**：`skill` · `recall` · `truncate` · `agent_manager`

### Tool 定义接口

```typescript
// 工具定义接口 (tool.ts)
export interface Def {
  id: string;                    // 工具唯一 ID
  description: string;             // 工具描述
  parameters: Schema.Decoder;        // 参数 Schema
  execute(args, ctx: Context): Effect.Effect<Result>;
}

// 工具执行上下文
export type Context = {
  sessionID: SessionID;
  messageID: MessageID;
  agent: string;
  abort: AbortSignal;
  metadata(input): Effect.Effect<void>;  // 实时更新状态
  ask(input): Effect.Effect<void>;      // 请求权限
}
```

---

## Agent 模式详解

### Agent 配置 Schema（Zod 定义）

```typescript
export const Info = z.object({
  name: z.string(),          // Agent 唯一标识符
  mode: z.enum(["subagent", "primary"]),
  permission: Permission.Ruleset,  // 权限规则集
  prompt: z.string(),        // 系统提示模板
  temperature: z.number(),   // LLM 采样温度
  // + model, maxTokens, tools 等可选字段
})

// Effect-TS Layer 提供 Agent 服务
export class AgentService extends Context.Tag("Agent")() {
  get: (name: string) => Effect.Effect<Info>;
  list: () => Effect.Effect<Info[]>;
  defaultAgent: () => Effect.Effect<Info>;
  generate: (opts) => Effect.Effect<GenerateResult>;
}
```

### 七种内置 Agent 模式

| 模式 | 类型 | 工具权限 | 用途 |
|------|------|----------|------|
| **Code** | primary | 全部 + semantic_search + paste | 默认智能体，代码生成/编辑/重构 |
| **Plan** | primary | 只读 + plan 文件编辑 | 只读规划，禁止危险命令 |
| **Debug** | primary | 全部 + semantic_search | 系统性调试，问题诊断修复 |
| **Ask** | primary | 只读，无编辑 | 问答，不修改文件 |
| **Explore** | subagent | codebase_search + semantic_search | 快速代码探索，由主智能体 spawn |
| **General** | subagent | 按 task 分配 | 多步并行任务执行 |
| **Orchestrator** | primary | 子智能体 + task | 协调多个子智能体（已弃用，由 Agent Manager 取代） |

---

## 请求处理流程

```
1. 用户输入
   ↓ （CLI 命令 / VS Code 侧边栏聊天 / Web UI）
2. 会话创建 / 加载
   ↓ （Session 管理器初始化，合并配置，加载系统提示）
3. Agent 调度
   ↓ （选择智能体模式，收集可用 Tool 列表）
4. LLM 推理（流式）
   ↓ （Provider 系统调用目标 AI 模型，Vercel AI SDK streamText）
5. 工具执行循环
   ↓ （解析 LLM tool call，调度 Tool Registry）
6. 结果反馈与循环
   ↓ （工具结果反馈回 LLM，Session 处理 Compaction）
7. ✓ SSE 流式响应返回
   ↓ （实时返回给客户端，会话状态持久化到 SQLite）
```

---

## VS Code 扩展架构

> 包路径：`packages/kilo-vscode/` — ~45k 行代码

### 扩展内部架构

```
KiloProvider (Sidebar Chat)
        ↓
AgentManagerProvider (Multi-Session Orchestration)
        ↓
KiloConnectionService (Singleton)
        ↓
  ├── ServerManager（管理 kilo serve 子进程）
  ├── KiloClient (SDK)（HTTP + SSE 通信）
  └── SdkSSEAdapter（SSE 流 → VS Code 消息）
        ↓
kilo serve (CLI Backend Process)
  ├── Agent Runtime
  ├── Tool Registry
  ├── Session Manager
  ├── MCP Client
  └── SQLite + Drizzle
```

### 核心功能模块

| 模块 | 说明 |
|------|------|
| **Agent Manager** | 多会话编排面板（Cmd+Shift+M），Git Worktree 隔离，PR 状态轮询 |
| **KiloProvider** | 侧边栏聊天，处理 60+ 消息类型，SSE 流式推送 |
| **Diff 可视化** | DiffViewer（全工作区，2.5s 轮询）+ DiffVirtual（单文件，权限审批） |
| **Autocomplete** | 基于 Codestral/Mercury Edit，支持自动/手动触发（Cmd+L） |
| **浏览器自动化** | Playwright MCP Server，系统 Chrome / Chromium / 无头模式 |
| **AI Commit Message** | 自动生成 Git 提交信息，集成 VS Code Git 扩展 API |
| **代码操作** | 编辑器右键：解释/修复/改进代码；终端右键：修复/解释命令 |
| **KiloConnectionService** | 单例管理 CLI 后端进程，动态端口分配，密码认证 |

---

## SDK 与云网关

### @kilocode/sdk — 自动生成 SDK

基于 **OpenAPI 规范自动生成**，覆盖所有 API 端点：

```typescript
// 创建客户端连接到 CLI 后端
const { server, client } = createKilo({
  directory: "/path/to/project"
})

// 会话操作
const session = await client.session.create()
await client.session.prompt(session.id, {
  message: "帮我重构这个模块"
})

// V2 API 支持 Workspace 隔离
const v2 = createKiloV2({
  directory: "/project",
  workspaceID: "ws-123"
})
```

**V1 和 V2 并行存在**，V2 增加了 Workspace 隔离支持。

### @kilocode/kilo-gateway — 云网关

| 功能 | 说明 |
|------|------|
| **架构** | KiloProvider 包装 5 个 AI SDK 提供者（OpenRouter / Alibaba / Anthropic / OpenAI / OpenAI-Compatible），统一通过 api.kilo.ai 路由 |
| **认证** | KiloAuthPlugin 实现 OAuth 设备授权流程，支持 API Key 和 Token 两种方式 |
| **模型目录** | `fetchKiloModels()` 从 OpenRouter 获取模型列表，过滤不支持工具调用的模型 |
| **云会话** | 支持云会话导入/导出，通过 ingest API 同步至 ingest.kilosessions.ai |

---

## 前端生态

### Kilo UI — 65+ 组件

基于 `@kobalte/core` 无障碍组件构建的 SolidJS 组件库：

**基础组件**：Button · Icon · IconButton · Spinner · Avatar · Code · Collapsible

**布局组件**：Card · Accordion · Tabs · Popover · DropdownMenu · ContextMenu · Dialog

**代码相关**：Diff · DiffSSR · DiffChanges · File · FileIcon · Markdown · MessagePart · SessionReview

**功能组件**：Toast · Tooltip · Select · Checkbox · RadioGroup · Switch · TextField · Typewriter

### App — Web 前端路由

```
/               → 首页（项目选择器）
/:dir           → 目录布局
/:dir/session/:id → 会话聊天页面
```

**Provider 层级**：

```
MetaProvider → Font → ThemeProvider → LanguageProvider → I18nBridge
→ ErrorBoundary → DialogProvider → MarkedProvider → FileComponentProvider
→ ServerProvider → GlobalSDKProvider → GlobalSyncProvider
→ Router → SettingsProvider → PermissionProvider → LayoutProvider
```

### 国际化 — 19 种语言

中文(zh) · 繁体中文(zht) · English(en) · 日本語(ja) · 한국어(ko) · Français(fr) · Deutsch(de) · Español(es) · Nederlands(nl) · Polski(pl) · Русский(ru) · Українська(uk) · Türkçe(tr) · ไทย(th) · Dansk(da) · Norsk(no) · Bosanski(bs) · Brezhoneg(br) · العربية(ar)

---

## 核心技术栈

| 类别 | 技术 | 说明 |
|------|------|------|
| **运行时** | Bun 1.3.13 | JavaScript 运行时与包管理器 |
| **语言** | TypeScript 5.8.2 | 类型安全 |
| **函数式** | Effect-TS 4.0 | 依赖注入、类型安全状态管理 |
| **验证** | Zod | 运行时 Schema 校验 |
| **前端框架** | SolidJS 1.9.12 | 响应式 UI |
| **样式** | Tailwind CSS 4.1 | 原子化 CSS |
| **构建** | Vite 7.3 | 前端构建工具 |
| **Monorepo** | Turborepo 2.8 | 构建编排 |
| **HTTP 框架** | Hono 4.12 | 轻量级，支持 Bun/Node 双适配器 |
| **ORM** | Drizzle ORM | SQLite 强类型 ORM |
| **数据库** | SQLite | 本地会话存储、配置持久化 |
| **AI 集成** | Vercel AI SDK | 统一 LLM SDK（streamText / generateObject） |
| **代码解析** | Tree-sitter | 多语言 AST 解析 |
| **代码高亮** | Shiki 3.20 | Markdown 代码渲染 |
| **向量数据库** | LanceDB | 语义搜索索引 |
| **LSP** | Language Server Protocol | 诊断信息、代码智能 |
| **MCP** | Model Context Protocol | 外部工具和服务集成 |
| **桌面** | Tauri | Rust 原生应用壳 |
| **遥测** | PostHog + OpenTelemetry | 使用数据分析 |
| **Lint** | Oxlint | 代码检查 |
| **格式化** | Prettier | 代码格式化 |

---

## 关键目录结构

```
kilocode/
├── packages/
│   ├── opencode/                # 核心 CLI (@kilocode/cli)
│   │   └── src/
│   │       ├── agent/          # AI agent 运行时（7 种模式）
│   │       ├── tool/           # 50+ 内置工具
│   │       ├── session/        # 会话状态管理
│   │       ├── server/        # HTTP 服务器 (Hono)
│   │       ├── cli/           # 命令行界面
│   │       ├── provider/      # AI 模型提供商（30+ SDK）
│   │       ├── mcp/           # Model Context Protocol
│   │       ├── skill/         # 技能加载系统
│   │       ├── plugin/        # 插件系统
│   │       ├── config/        # 配置管理（多层级合并）
│   │       ├── auth/          # 认证系统
│   │       └── kilocode/     # Kilo 特定扩展
│   │
│   ├── kilo-vscode/            # VS Code 扩展
│   │   ├── src/                # 扩展主体（KiloProvider, AgentManager）
│   │   ├── webview-ui/        # SolidJS Webview UI
│   │   └── agent-manager/     # 多会话管理面板
│   │
│   ├── app/                    # Web UI (SolidJS + Vite)
│   ├── desktop/               # 桌面应用 (Tauri + Rust)
│   ├── kilo-gateway/          # Kilo 认证和提供商路由
│   ├── kilo-telemetry/       # PostHog + OpenTelemetry
│   ├── kilo-i18n/            # 国际化（19 种语言）
│   ├── kilo-ui/              # SolidJS 组件库（65+ 组件）
│   ├── kilo-indexing/        # 代码索引（Tree-sitter + LanceDB）
│   ├── sdk/js/               # TypeScript SDK（OpenAPI 生成）
│   └── plugin/               # 插件接口定义
│
├── package.json                  # 根配置（Turborepo）
├── turbo.json                 # Turborepo 配置
├── bun.lock                  # Bun 锁文件
└── AGENTS.md                 # AI 智能体指南
```

---

## 支持的 AI 模型提供商（30+ 集成，500+ 模型）

Anthropic · OpenAI · Google/Gemini · Google Vertex AI · Azure OpenAI · Amazon Bedrock · OpenRouter · Mistral · Groq · DeepInfra · Cerebras · Cohere · xAI (Grok) · Together AI · Perplexity · GitLab AI · Venice · Alibaba (Qwen) · Kilo (默认) · Cloudflare Workers AI · SAP AI Core · Vercel AI SDK
