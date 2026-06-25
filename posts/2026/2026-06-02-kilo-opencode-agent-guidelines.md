---
type: article
title:  "KiloCode AGENTS.md - OpenCode 智能体指南"
date:   2026-06-02 08:00:00 +0800
tags: [Kilo, AGENTS.md, OpenCode, Agent Guidelines, Kilo Code]
---

## 构建/测试 (Build/Test)

* **运行 (Run)**: `bun run --conditions=browser ./src/index.ts`
* **测试 (Test)**: `bun test`（运行所有测试）或 `bun test test/tool/tool.test.ts`（运行单个测试）
* **类型检查 (Typecheck)**: `bun run typecheck`（运行 `tsgo --noEmit`）

## 导入别名 (Import Aliases)

* `@/*` 映射到 `./src/*`
* `@tui/*` 映射到 `./src/cli/cmd/tui/*`

## 核心模式 (Key Patterns)

**命名空间模块 (Namespace modules)** —— 代码以 TypeScript 命名空间（Namespace）的形式组织，而不是类（Class）。每个模块导出一个包含其 Zod schema、类型和函数的命名空间：

```ts
export namespace Session {
  export const Info = z.object({ ... })
  export type Info = z.infer<typeof Info>
  export const create = fn(z.object({ ... }), async (input) => { ... })
}

```

**`Instance.state(init, dispose?)`** —— 针对每个项目的延迟加载单例。许多模块通过这种方式注册状态。该状态通过 `AsyncLocalStorage` 与项目目录绑定：

```ts
const state = Instance.state(async () => {
  // 每个项目初始化一次，并进行缓存
  return { ... }
})
// 后续调用: (await state()).someValue

```

**服务闭包状态 vs. 目录状态 (Service-closure state vs. directory state)** —— 在服务层闭包内（但在 `InstanceState` 之外）创建的值，由该服务实例共享，而不是通过请求目录进行键控（keyed）。共享的 VS Code 会话路径为侧边栏、Kilo 标签页和 Agent Manager 本地工作区请求使用一个处于激活状态的 Snapshot 服务。因此，Snapshot 的 `trackState` 及其慢速追踪（slow-track）的 `asked` 守卫会跨越这些目录。只有当持续追踪返回快照哈希（snapshot hash）时，选择 **Continue with snapshots** 才会重置该守卫。

**`fn(schema, callback)`** —— 使用 Zod 输入验证来包装函数。用于大多数导出的函数：

```ts
export const get = fn(z.object({ id: z.string() }), async (input) => { ... })

```

**`Tool.define(id, init)`** —— 所有工具都遵循此模式。`init` 返回 `{ description, parameters, execute }`。输出结果会自动截断。

**`BusEvent.define(type, schema)` + `Bus.publish()`** —— 用于跨模块通信的进程内发布/订阅（pub/sub）事件系统。

**`NamedError.create(name, schema)`** —— 带有 Zod schema 的结构化错误。相比于抛出原始错误（raw errors），更推荐使用这种方式。

**`iife()`** —— 立即调用函数表达式（IIFE）的辅助函数。根据代码风格指南，用于避免使用 `let` 语句。

**日志记录 (Logging)** —— 使用 `Log.create({ service: "name" })` 模式。

## 进程派生 (Windows) (Process Spawning (Windows))

在 Windows 系统上，任何未设置 `windowsHide: true` 的 `spawn`/`execFile` 调用都会向用户闪烁一个 `cmd.exe` 控制台窗口。请使用 `src/util/process.ts` 中的 `Process.spawn` —— 它会自动强制执行 `windowsHide: true`。对于 `Bun.spawn`/`Bun.spawnSync`，如果子进程可能会创建可见的控制台，请通过选项对象传入 `windowsHide`。

MCP `StdioClientTransport`（第三方 SDK）是通过 `src/mcp/index.ts` 中的进程垫片（process shim）单独处理的。当在 VS Code 插件内部运行（`KILO_PLATFORM=vscode`）时，该垫片会将 `process.type` 设置为 `"browser"`。这会导致 SDK 内部的 `isElectron()` 检查返回 `true` 并启用 `windowsHide`。

## 存储 (Storage)

基于文件系统的 JSON，而非数据库。数据保存在 `~/.local/share/kilo/storage/` 中。键（Keys）为路径数组：`Storage.write(["session", projectID, sessionID], data)`。

## TUI (终端用户界面)

基于 **SolidJS + OpenTUI** (`@opentui/solid`) 构建 —— 这是一个终端 UI 框架。JSX 使用 `<box>`、`<text>`、`<scrollbox>` 等元素渲染到终端。TUI 通过 `@kilocode/sdk` 与服务端进行通信。

## 服务端 (Server)

基于 Hono 的 HTTP 服务端，具备 OpenAPI 规范生成功能。使用 SSE（服务器发送事件）处理实时事件。当你添加或修改路由时，请重新生成 SDK（命令参见根目录的 `AGENTS.md`）。

## 提供商和模型 (Providers and Models)

使用 **Vercel AI SDK** 作为抽象层。提供商从捆绑的映射（bundled map）中加载，或在运行时动态安装。模型来自 models.dev（外部 API），并在本地进行缓存。

## 分叉隔离规则 (Fork Isolation Rule)

`opencode/` 是上游 opencode 的一个分叉（fork）。当某项修改必须触及共享的上游文件时，请将 Kilo 特定的逻辑抽离到 `src/kilocode/<相同路径>.ts` 下的镜像文件中（测试文件放在 `test/kilocode/<相同路径>.test.ts` 下），并在单个 `kilocode_change` 标记后从上游文件调用它。

例如：针对 `src/cli/cmd/tui/component/dialog-provider.tsx` 的 Kilo 覆盖代码应存放在 `src/kilocode/cli/cmd/tui/component/dialog-provider.tsx`。避免将 Kilo 特定的逻辑直接内联到共享的上游文件中。路径中包含 `kilocode` 的文件和目录永远不需要 `kilocode_change` 标记。
