---
type: article
title: "给 AI 写的开发手册：如何在 GitHub 项目中优雅地配置 AGENTS.md"
date: 2026-09-04 09:42:00 +0800
tags: [agent, agents.md, claude.md, ai-coding, openclaw, claude, cursor]
---

随着 Cursor、Claude Code、Windsurf 以及 OpenClaw 等 AI Coding Agent 深度嵌入日常开发工作流，软件开发正在经历从 **“人类编写代码”** 到 **“人类定义规则，Agent 协作编码”** 的转变（Agentic Engineering）。

我们在项目中往往会编写 `README.md` 面向人类开发者，但很多团队忽视了为 AI Agent 提供一套**上下文感知与行为治理规范（Harness Guidelines）**。这就是 `AGENTS.md`（或 `AGENT.md` / `CLAW.md`）存在的意义——**它是写给 AI Agent 看的“项目运维与开发指南”**。

本文以实际项目架构为例，聊聊为什么需要 `AGENTS.md` 以及如何为你的开源或商业项目定制一份高效的 Agent 治理规范。

---

## 一、 为什么传统的 README.md 不够用？

人类开发者阅读 `README.md` 时，拥有强大的泛化能力和隐式背景知识；但 AI Agent 在读取代码库时，是以 Token 上下文的形式载入信息的。

传统的 README 往往面临以下痛点：

* **信息密度不匹配**：包含大量面向用户的推广语言、演示 GIF 或过于冗长的安装介绍，浪费 Agent 有限的 Context Window。
* **缺少隐式约束**：Agent 无法从普通 README 中感知“不要在组件里直接写 Raw SQL”、“修改 Schema 后必须生成 Migration”等团队内部约定的**代码禁区**。
* **缺乏验证门禁**：Agent 在修改完代码后，往往不知道调用什么 CLI 命令来进行类型检查（Typecheck）和单元测试，导致提交带有隐式 Bug 的代码。

---

## 二、 AGENTS.md 的核心架构与设计原则

一份高价值的 `AGENTS.md` 应遵循以下 **三大原则**：

1. **CLI-First 与 Unix 哲学**：强调声明式的命令行工具和模块化解耦，避免复杂交互式步骤。
2. **显式边界（Guardrails）**：清晰列出“绝对不能做”与“必须遵循”的安全规则。
3. **机器友好（Machine-Readable）**：减少花哨的修饰词，使用清晰的 Markdown 结构、标签和代码块，方便 Agent 快速解析为 System Prompt。

结构上，建议包含以下 6 个标准模块：

* **项目定位与核心理念 (System Context & Philosophy)**
* **目录结构与入口映射 (Directory Map & Entry Points)**
* **Agent 行为准则与禁区 (Behavioral Constraints & Boundaries)**
* **常用开发指令 (CLI Workflow)**
* **代码规范与状态管理 (Code Conventions)**
* **提交前门禁检查 (Verification Checklist)**

---

## 三、 实战模板：AGENTS.md 完整示例

你可以直接将以下模板复制到项目的根目录下（如 `AGENTS.md`），并根据项目的技术栈进行针对性修改：

### 中文

```markdown
# AGENTS.md — 项目上下文与 Agent 行为治理指南

> **给 AI Agent 的须知**：本文档定义了所有自主 Agent 在本代码库中运行时的显式执行边界、架构原则与开发工作流。

---

## 1. 项目理念与核心技术栈

- **核心使命**：[在此填入项目的核心业务目标与用途]
- **设计哲学**：CLI 优先（CLI-First）、模块化架构、显式 Schema 优于隐式黑盒。
- **技术栈选型**：
  - **应用框架**：Next.js (App Router) / TypeScript (严格模式)
  - **数据持久化**：SQLite / Drizzle ORM
  - **样式解决方案**：Tailwind CSS
  - **Agent 扩展**：OpenClaw Skills / MCP (Model Context Protocol)

---

## 2. 目录结构与关键入口

src/
├── app/               # Next.js App Router 页面与 API 路由
├── components/        # React 组件（UI 与 Agent 状态组件）
├── lib/               # 共享工具库、数据库连接与核心业务逻辑
├── agent/             # Agent 工具、Skill 定义与工作流引擎
└── drizzle/           # 数据库 Schema 定义与 Migration 迁移文件

---

## 3. Agent 执行准则与硬性边界

1. **CLI 优先原则**：始终优先使用非交互式的 CLI 命令进行文件检索与任务执行。
2. **类型安全规范**：
   - 所有 Agent 输入/输出载荷必须具备显式的 TypeScript 接口定义。
   - 严禁直接使用 `any` 类型；如特殊情况确需使用，必须附带单行注释说明原因。
3. **数据库操作护栏**：
   - 严禁在 React 组件或 API 路由中直接拼写 Raw SQL 字符串。
   - 所有结构变更必须通过修改 `drizzle/schema.ts` 并生成对应的 Migration 脚本完成。
4. **状态与错误处理**：
   - 采用 Local-first 的极简状态设计，保持工具调用的幂等性。
   - 内部 Agent Workflow 统一返回结构化对象 `{ success: boolean, data?: T, error?: string }`，避免抛出未经捕获的顶层异常。

---

## 4. 开发工作流与 CLI 指令

Agent 在检查、构建与测试项目时，应执行以下标准指令：

# 安装依赖
pnpm install

# 启动本地开发服务器
pnpm dev

# 类型检查与 Lint 校验（提交代码前必须通过）
pnpm typecheck
pnpm lint

# 数据库 Migration 操作
pnpm db:generate
pnpm db:migrate

---

## 5. 代码与组件规范

* **UI 组件规范**：遵循原子化组件结构，保持 Tailwind CSS 样式类简明干净。
* **Skill 接口定义**：放置于 `agent/skills` 下的 Skill 必须包含完整的 JSON Schema 参数与返回值校验声明。
* **隐私与安全**：严禁在日志、输出或代码中明文写入 API Key、Token 或环境变量等敏感数据。

---

## 6. 任务完成前的验证清单

在标记任何任务为“已完成”之前，Agent 必须逐项核对：

* [ ] 执行 `pnpm typecheck` 且返回零错误。
* [ ] 新增的 API Endpoint 或 Agent Skill 均已补全显式类型定义与校验。
* [ ] 涉及数据库更改的操作已同步更新 Schema 并生成 Migration 文件。
```

### 英文

```markdown
# AGENTS.md — Project Context & Harness Guidelines

> **Notice to AI Agents**: This file defines the explicit execution boundaries, architecture principles, and workflow patterns for all autonomous agents operating in this repository.

---

## 1. Project Philosophy & Core Stack

- **Core Mission**: [在此填入项目的核心业务目标与用途]
- **Design Philosophy**: CLI-First, modular architecture, explicit schemas over implicit magic.
- **Tech Stack**:
  - **Framework**: Next.js (App Router) / TypeScript (Strict Mode)
  - **Database**: SQLite / Drizzle ORM
  - **Styling**: Tailwind CSS
  - **Agent Integration**: OpenClaw Skills / MCP (Model Context Protocol)

---

## 2. Directory Structure & Key Entry Points

src/
├── app/               # Next.js App Router pages and API routes
├── components/        # React components (UI & Agent status components)
├── lib/               # Shared utilities, DB connections, and core logic
├── agent/             # Agent tools, skill definitions, and flow engines
└── drizzle/           # Database schema & migration files

---

## 3. Agent Execution Rules (Strict Boundaries)

1. **CLI-First Tooling**: Always use non-interactive CLI commands for file inspection and running tasks.
2. **Type Safety Rules**:
   - Explicit TypeScript interface definitions for all Agent payload/outputs.
   - Do NOT use `any` unless explicitly required and documented with inline comments.
3. **Database Guardrails**:
   - Never write raw SQL strings directly inside React components or API routes.
   - Always modify `drizzle/schema.ts` and trigger corresponding migration scripts.
4. **State & Error Handling**:
   - Use local-first, minimal state design.
   - Return structured objects `{ success: boolean, data?: T, error?: string }` for agent tools instead of throwing unhandled exceptions.

---

## 4. Development Workflow & CLI Tools

Agents should execute these commands to inspect, build, and test:

# Install dependencies
pnpm install

# Run local development server
pnpm dev

# Check types & linting (MUST pass before proposing changes)
pnpm typecheck
pnpm lint

# Database migrations
pnpm db:generate
pnpm db:migrate

---

## 5. Coding & Component Conventions

* **UI Components**: Follow atomic structure. Use Tailwind CSS with clean, utility-first classes.
* **Agent Skill Specs**: Skills placed in `agent/skills` must include valid JSON Schema declarations for arguments and return types.
* **Privacy & Security**: Never log or output hardcoded API keys, tokens, or environment secrets.

---

## 6. Verification Checklist Before Completion

Before marking any task as complete, you MUST verify:

* [ ] `pnpm typecheck` returns zero errors.
* [ ] Newly added endpoints or agent skills are explicitly typed and validated.
* [ ] Database updates include matching migration files.
```

---

## 四、 总结

在 Agentic Era，**代码库（Codebase）不再只是人类程序员的领地，更是 AI Agent 的运行环境**。

通过在项目根目录引入 `AGENTS.md`，你不仅为 Agent 设定了“安全护栏”，大幅提升了 Agent 自动写代码、跑测试、补工具的成功率，同时也让团队的人类开发者对 Agent 的行为边界有了清晰的预期。今天就为你的开源或业务项目加上这份规范吧！
