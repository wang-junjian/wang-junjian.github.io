---
layout: single
title:  "Claude Code 源代码分析"
date:   2026-04-01 20:00:00 +0800
categories: ClaudeCode Agent
tags: [ClaudeCode, Agent]
---

<!--more-->

## 创建 CLAUDE.md

这样它会将项目的规范、构建命令和架构要点记录下来，后续对话中它会自动参考这个文件，不再需要你重复解释背景。有利于后续的代码分析、调试和功能开发。

### 运行 /init 命令

```
/init - 自动分析该项目并生成 CLAUDE.md
```

```markdown
我已为该仓库成功创建了CLAUDE.md文件。以下是文件包含的内容：

### CLAUDE.md 内容概要
1. **概述** - 包含项目统计信息（约1884个文件、51.2万行代码、40+工具、80+命令）的项目说明，以及法律免责声明。

2. **命令** - 构建与开发相关命令：
    - `npm run prepare-src` - 准备源码
    - `npm run build` - 使用esbuild构建
    - `npm run check` - 执行类型检查
    - `npm start` - 运行编译后的命令行工具

3. **高层架构**：
    - src/query.ts中的核心智能体循环模式
    - 核心目录（入口点、命令行、命令、工具、组件、服务、状态、工具函数）
    - 关键文件及其用途
    - 工具系统架构（通过buildTool()实现的构建者模式）
    - 权限系统流程
    - 上下文管理策略
    - 子智能体架构（默认、分支、工作树、远程）
    - 基于AppStateStore的状态管理
    - 所采用的核心设计模式

该文件为后续使用Claude Code的用户提供了在该代码库中高效开展工作所需的全部必要信息。
```

### CLAUDE.md

本文件用于指导 Claude Code（claude.ai/code）处理此代码仓库中的代码。

#### 概述

本仓库包含 **Claude Code v2.1.88** 的反编译源代码，该工具是基于 Anthropic 旗下 Claude 模型构建的 AI 编程助手。代码库内容包括：
- 约 1,884 个 TypeScript/TSX 文件
- 约 512,664 行代码
- 40 余个内置工具
- 80 余个斜杠命令
- 生产级智能体执行框架，支持权限控制、流式输出、并发处理与状态持久化

#### 命令

##### 构建命令

```bash
# 为编译准备源码
npm run prepare-src

# 构建项目（基于 esbuild 尽力构建）
npm run build

# 仅执行类型检查
npm run check

# 运行编译后的命令行工具
npm start
```

##### 开发流程

项目使用 TypeScript，`strict` 模式设为 `false`。构建流程如下：
1. 将 `src/` 目录复制到 `build-src/`
2. 将 `feature('X')` 转换为 `false`（死代码消除）
3. 将 `MACRO.VERSION` 替换为 `'2.1.88'`
4. 使用 esbuild 进行打包

**注意**：完整重新构建需要使用 Bun（而非 Node.js）以支持其编译期内置特性。esbuild 构建为尽力兼容模式，需为 108 个按特性开关控制的模块手动编写桩代码。

#### 高层代码架构

##### 核心智能体循环

应用在 `src/query.ts`（785KB，最大文件）中采用经典智能体循环模式：

```
用户输入 → 查询引擎 → Claude API → 响应
                          ↓
                stop_reason == "tool_use"?
               /                          \
             是                            否
              |                             |
        执行工具                        返回文本
        追加 tool_result
        循环回到 → 查询引擎
```

##### 目录结构

核心目录说明：

- **`src/entrypoints/`** - 应用入口（CLI、SDK、MCP 服务端）
- **`src/cli/`** - 命令行基础架构与命令处理器
- **`src/commands/`** - 约 80 个斜杠命令实现
- **`src/tools/`** - 40 余个内置工具实现
- **`src/components/`** - 基于 React/Ink 的终端 UI 组件
- **`src/services/`** - 业务逻辑层（API 客户端、分析统计、MCP、工具等）
- **`src/state/`** - 应用状态管理（AppState 存储）
- **`src/utils/`** - 工具函数（权限、消息、模型选择、Git 操作等）

##### 关键文件

| 文件 | 用途 |
|------|------|
| `src/main.tsx` | REPL 启动入口（4,683 行） |
| `src/QueryEngine.ts` | SDK/无头模式查询生命周期引擎 |
| `src/query.ts` | 主智能体循环 |
| `src/Tool.ts` | 工具接口 + `buildTool` 工厂函数 |
| `src/commands.ts` | 斜杠命令定义 |
| `src/tools.ts` | 工具注册器与预设配置 |

##### 工具系统架构

工具系统通过 `buildTool()` 工厂采用构建者模式。每个工具均实现：
- **生命周期**：`validateInput()`、`checkPermissions()`、`call()`
- **能力标识**：`isEnabled()`、`isConcurrencySafe()`、`isReadOnly()`、`isDestructive()`
- **渲染**：用于展示工具调用与结果的 React 组件
- **面向 AI**：`prompt()`、`description()`、`mapToolResultToAPI()`

内置工具包括：文件读取、文件编辑、文件写入、通配符匹配、文本搜索、Bash 执行、网络请求、网络搜索、智能体、技能、向用户提问等。

##### 权限系统

权限执行流程：
1. `validateInput()` - 提前拦截非法参数
2. 工具使用前钩子 - 用户自定义 Shell 命令
3. 权限规则 - `alwaysAllow`/`alwaysDeny`/`alwaysAsk`
4. 交互式确认 - 无匹配规则时请求用户授权
5. `checkPermissions()` - 工具专属权限逻辑

##### 上下文管理

三种压缩策略：
- `autoCompact` - 通过 Claude API 对历史消息进行摘要
- `snipCompact` - 移除无效消息（特性开关控制）
- `contextCollapse` - 重构上下文结构（特性开关控制）

##### 子智能体架构

支持多种智能体启动模式：
- `default` - 进程内运行，共享对话上下文
- `fork` - 子进程，全新消息队列，共享文件缓存
- `worktree` - 独立 Git 工作树 + 子进程
- `remote` - 桥接至 Claude Code 远程服务

##### 状态管理

基于 React Context 与 `AppStateStore` 管理状态，包含：
- `toolPermissionContext` - 权限规则与模式
- `fileHistory` - 文件操作的撤销快照
- `attribution` - 提交记录追踪
- `fastMode` - 快速模式状态
- `mainLoopModel` - 当前选用模型

##### 核心设计模式

| 模式 | 实现位置 |
|------|----------|
| 异步生成器流式输出 | `QueryEngine`、`query()` |
| 构建者 + 工厂模式 | `buildTool()` |
| 标记类型 | `SystemPrompt`、`asSystemPrompt()` |
| 特性开关 + 死代码消除 | 来自 `bun:bundle` 的 `feature()` |
| 可辨识联合类型 | `Message` 相关类型 |
| 观察者 + 状态机 | `StreamingToolExecutor` |
| 快照状态 | `FileHistoryState` |
| 即发即弃写入 | `recordTranscript()` |
