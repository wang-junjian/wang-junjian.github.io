---
layout: single
title:  "Pi Agent Core 开发指南"
date:   2026-05-21 18:00:00 +0800
categories: [智能体]
tags: [Pi Agent, TypeScript]
---

[@earendil-works/pi-agent-core](https://github.com/earendil-works/pi/blob/main/packages/agent/README.md)

基于 `@earendil-works/pi-ai` 构建的有状态智能体，支持工具执行和事件流。

## 安装

```bash
npm install @earendil-works/pi-agent-core
```

## 快速开始

```typescript
import { Agent } from "@earendil-works/pi-agent-core";
import { getModel } from "@earendil-works/pi-ai";

const agent = new Agent({
  initialState: {
    systemPrompt: "You are a helpful assistant.",
    model: getModel("anthropic", "claude-sonnet-4-20250514"),
  },
});

agent.subscribe((event) => {
  if (event.type === "message_update" && event.assistantMessageEvent.type === "text_delta") {
    // 只流式输出新的文本块
    process.stdout.write(event.assistantMessageEvent.delta);
  }
});

await agent.prompt("Hello!");
```

## 核心概念

### AgentMessage 与 LLM Message

智能体使用 `AgentMessage`，这是一种灵活的类型，可以包含：
- 标准 LLM 消息（`user`、`assistant`、`toolResult`）
- 通过声明合并（declaration merging）添加的自定义应用特定消息类型

LLM 只能理解 `user`、`assistant` 和 `toolResult`。`convertToLlm` 函数通过在每次 LLM 调用前过滤和转换消息来弥合这一差距。

### 消息流

```
AgentMessage[] → transformContext() → AgentMessage[] → convertToLlm() → Message[] → LLM
                    （可选）                               （必需）
```

1. **transformContext**：裁剪旧消息，注入外部上下文
2. **convertToLlm**：过滤掉仅用于 UI 的消息，将自定义类型转换为 LLM 格式

## 事件流

智能体会触发用于更新 UI 的事件。理解事件的执行序列有助于构建响应式的交互界面。

### prompt() 事件序列

当你调用 `prompt("Hello")` 时：

```
prompt("Hello")
├─ agent_start
├─ turn_start
├─ message_start   { message: userMessage }      // 你的提示
├─ message_end     { message: userMessage }
├─ message_start   { message: assistantMessage } // LLM 开始响应
├─ message_update  { message: partial... }       // 流式传输数据块
├─ message_update  { message: partial... }
├─ message_end     { message: assistantMessage } // 完整响应
├─ turn_end        { message, toolResults: [] }
└─ agent_end       { messages: [...] }
```

### 包含工具调用的序列

如果助手调用了工具，循环将继续：

```
prompt("Read config.json")
├─ agent_start
├─ turn_start
├─ message_start/end  { userMessage }
├─ message_start      { assistantMessage with toolCall }
├─ message_update...
├─ message_end        { assistantMessage }
├─ tool_execution_start  { toolCallId, toolName, args }
├─ tool_execution_update { partialResult }           // 如果工具支持流式传输
├─ tool_execution_end    { toolCallId, result }
├─ message_start/end  { toolResultMessage }
├─ turn_end           { message, toolResults: [toolResult] }
│
├─ turn_start                                        // 下一轮
├─ message_start      { assistantMessage }           // LLM 响应工具结果
├─ message_update...
├─ message_end
├─ turn_end
└─ agent_end
```

工具执行模式是可配置的：

- `parallel`（默认）：按顺序进行预检工具调用，同时执行允许的工具，每个工具完成后立即发送 `tool_execution_end`，然后按照助手中的源顺序发送 toolResult 消息和 `turn_end.toolResults`
- `sequential`：逐个执行工具调用，匹配历史行为

在并行模式下，工具完成事件遵循工具完成顺序，但持久化的 toolResult 消息仍然遵循助手中的源顺序。

此模式可以通过智能体配置中的 `toolExecution` 全局设置，也可以在每个工具上通过 `AgentTool` 的 `executionMode` 设置。如果批处理中的任何工具调用针对的是 `executionMode: "sequential"` 的工具，则无论全局设置如何，整个批处理都会顺序执行。

`beforeToolCall` 钩子在 `tool_execution_start` 和已验证的参数解析之后运行。它可以阻止执行。`afterToolCall` 钩子在工具执行完成之后、`tool_execution_end` 和最终工具结果消息事件发出之前运行。

工具也可以返回 `terminate: true` 来提示应跳过自动的后续 LLM 调用。只有当该批次中每个已完成的工具结果都设置了 `terminate: true` 时，循环才会提前停止。混合批次则正常继续。

低级循环调用者可以设置 `shouldStopAfterTurn` 以在当前轮次完成后优雅地停止：

```typescript
const stream = agentLoop(prompts, context, {
  model,
  convertToLlm,
  shouldStopAfterTurn: async ({ message, toolResults, context, newMessages }) => {
    return shouldCompactBeforeNextTurn(context.messages);
  },
});
```

`shouldStopAfterTurn` 在 `turn_end` 发出之后以及助手响应和任何工具执行正常完成之后运行。如果它返回 `true`，循环会在轮询指导消息（steering）或后续消息队列之前，以及在启动另一个 LLM 调用之前，发送 `agent_end` 并退出。它不会中止提供商的流，不会取消正在运行的工具，也不会改变助手消息的停止原因。

当你使用 `Agent` 类时，助手的 `message_end` 处理被视为工具预检开始前的一个屏障。这意味着 `beforeToolCall` 看到的智能体状态已经包含了请求该工具调用的助手消息。

### continue() 事件序列

`continue()` 从现有上下文恢复，而不添加新消息。用于错误后的重试。

```typescript
// 发生错误后，从当前状态重试
await agent.continue();
```

上下文中的最后一条消息必须是 `user` 或 `toolResult`（不能是 `assistant`）。

### 事件类型

| 事件 | 描述 |
|-------|-------------|
| `agent_start` | 智能体开始处理 |
| `agent_end` | 运行的最终事件。为此事件等待的订阅者仍会计入结算 |
| `turn_start` | 新轮次开始（一次 LLM 调用 + 工具执行） |
| `turn_end` | 轮次完成，包含助手消息和工具结果 |
| `message_start` | 任何消息开始（user、assistant、toolResult） |
| `message_update` | **仅限助手。** 包含带有增量的 `assistantMessageEvent` |
| `message_end` | 消息完成 |
| `tool_execution_start` | 工具开始执行 |
| `tool_execution_update` | 工具流式传输进度 |
| `tool_execution_end` | 工具执行完成 |

`Agent.subscribe()` 监听器按注册顺序等待。`agent_end` 意味着不会再发出循环事件，但 `await agent.waitForIdle()` 和 `await agent.prompt(...)` 只有在等待的 `agent_end` 监听器完成后才会结算。

## 智能体选项

```typescript
const agent = new Agent({
  // 初始状态
  initialState: {
    systemPrompt: string,
    model: Model<any>,
    thinkingLevel: "off" | "minimal" | "low" | "medium" | "high" | "xhigh",
    tools: AgentTool<any>[],
    messages: AgentMessage[],
  },

  // 将 AgentMessage[] 转换为 LLM Message[]（自定义消息类型必需）
  convertToLlm: (messages) => messages.filter(...),

  // 在 convertToLlm 之前转换上下文（用于裁剪、压缩）
  transformContext: async (messages, signal) => pruneOldMessages(messages),

  // 指导模式："one-at-a-time"（默认）或 "all"
  steeringMode: "one-at-a-time",

  // 后续模式："one-at-a-time"（默认）或 "all"
  followUpMode: "one-at-a-time",

  // 自定义流函数（用于代理后端）
  streamFn: streamProxy,

  // 用于提供商缓存的会话 ID
  sessionId: "session-123",

  // 动态 API 密钥解析（用于过期的 OAuth 令牌）
  getApiKey: async (provider) => refreshToken(),

  // 工具执行模式："parallel"（默认）或 "sequential"
  toolExecution: "parallel",

  // 在参数验证后对每个工具调用进行预检。可以阻止执行。
  beforeToolCall: async ({ toolCall, args, context }) => {
    if (toolCall.name === "bash") {
      return { block: true, reason: "bash is disabled" };
    }
  },

  // 在最终工具事件发出之前对每个工具结果进行后处理。
  afterToolCall: async ({ toolCall, result, isError, context }) => {
    if (toolCall.name === "notify_done" && !isError) {
      return { terminate: true };
    }
    if (!isError) {
      return { details: { ...result.details, audited: true } };
    }
  },

  // 为基于令牌的提供商自定义思考预算
  thinkingBudgets: {
    minimal: 128,
    low: 512,
    medium: 1024,
    high: 2048,
  },
});
```

## 智能体状态

```typescript
interface AgentState {
  systemPrompt: string;
  model: Model<any>;
  thinkingLevel: ThinkingLevel;
  tools: AgentTool<any>[];
  messages: AgentMessage[];
  readonly isStreaming: boolean;
  readonly streamingMessage?: AgentMessage;
  readonly pendingToolCalls: ReadonlySet<string>;
  readonly errorMessage?: string;
}
```

通过 `agent.state` 访问状态。

赋值 `agent.state.tools = [...]` 或 `agent.state.messages = [...]` 会在存储之前复制顶层数组。修改返回的数组会改变当前的智能体状态。

在流式传输期间，`agent.state.streamingMessage` 包含当前部分完成的助手消息。

`agent.state.isStreaming` 保持为 `true`，直到运行完全结算，包括等待的 `agent_end` 订阅者。

## 方法

### 提示

```typescript
// 文本提示
await agent.prompt("Hello");

// 带图片
await agent.prompt("What's in this image?", [
  { type: "image", data: base64Data, mimeType: "image/jpeg" }
]);

// 直接使用 AgentMessage
await agent.prompt({ role: "user", content: "Hello", timestamp: Date.now() });

// 从当前上下文恢复（最后一条消息必须是 user 或 toolResult）
await agent.continue();
```

### 状态管理

```typescript
agent.state.systemPrompt = "New prompt";
agent.state.model = getModel("openai", "gpt-4o");
agent.state.thinkingLevel = "medium";
agent.state.tools = [myTool];
agent.toolExecution = "sequential";
agent.beforeToolCall = async ({ toolCall }) => undefined;
agent.afterToolCall = async ({ toolCall, result }) => undefined;
agent.state.messages = newMessages; // 顶层数组被复制
agent.state.messages.push(message);
agent.reset();
```

### 会话和思考预算

```typescript
agent.sessionId = "session-123";

agent.thinkingBudgets = {
  minimal: 128,
  low: 512,
  medium: 1024,
  high: 2048,
};
```

### 控制

```typescript
agent.abort();           // 取消当前操作
await agent.waitForIdle(); // 等待完成
```

### 事件

```typescript
const unsubscribe = agent.subscribe(async (event, signal) => {
  if (event.type === "agent_end") {
    // 运行的最后屏障工作
    await flushSessionState(signal);
  }
});
unsubscribe();
```

## 指导消息和后续消息

指导消息（Steering messages）允许你在工具运行时中断智能体。后续消息（Follow-up messages）允许你在智能体原本会停止后排队工作。

```typescript
agent.steeringMode = "one-at-a-time";
agent.followUpMode = "one-at-a-time";

// 当智能体正在运行工具时
agent.steer({
  role: "user",
  content: "Stop! Do this instead.",
  timestamp: Date.now(),
});

// 在智能体完成当前工作之后
agent.followUp({
  role: "user",
  content: "Also summarize the result.",
  timestamp: Date.now(),
});

const steeringMode = agent.steeringMode;
const followUpMode = agent.followUpMode;

agent.clearSteeringQueue();
agent.clearFollowUpQueue();
agent.clearAllQueues();
```

使用 clearSteeringQueue、clearFollowUpQueue 或 clearAllQueues 来丢弃排队的消息。

当在一轮完成后检测到指导消息时：
1. 当前助手消息中的所有工具调用都已完成
2. 注入指导消息
3. LLM 在下一轮做出响应

只有在没有更多工具调用且没有指导消息时，才会检查后续消息。如果有任何排队的后续消息，它们会被注入，并运行另一轮。

## 自定义消息类型

通过声明合并扩展 `AgentMessage`：

```typescript
declare module "@earendil-works/pi-agent-core" {
  interface CustomAgentMessages {
    notification: { role: "notification"; text: string; timestamp: number };
  }
}

// 现在是有效的
const msg: AgentMessage = { role: "notification", text: "Info", timestamp: Date.now() };
```

在 `convertToLlm` 中处理自定义类型：

```typescript
const agent = new Agent({
  convertToLlm: (messages) => messages.flatMap(m => {
    if (m.role === "notification") return []; // 过滤掉
    return [m];
  }),
});
```

## 工具

使用 `AgentTool` 定义工具：

```typescript
import { Type } from "typebox";

const readFileTool: AgentTool = {
  name: "read_file",
  label: "Read File",  // 用于 UI 显示
  description: "Read a file's contents",
  parameters: Type.Object({
    path: Type.String({ description: "File path" }),
  }),
  // 为此工具覆盖执行模式（可选）。
  // "sequential" 强制整个批处理一次运行一个。
  // "parallel" 允许与其他工具调用并发执行。
  // 如果省略，则应用全局 toolExecution 配置。
  executionMode: "sequential",
  execute: async (toolCallId, params, signal, onUpdate) => {
    const content = await fs.readFile(params.path, "utf-8");

    // 可选：流式传输进度
    onUpdate?.({ content: [{ type: "text", text: "Reading..." }], details: {} });

    // 可选：在此处添加 `terminate: true`，以便在批处理中每个已完成的工具结果
    // 都这样做时跳过自动的后续 LLM 调用。
    return {
      content: [{ type: "text", text: content }],
      details: { path: params.path, size: content.length },
    };
  },
};

agent.state.tools = [readFileTool];
```

### 错误处理

当工具失败时**抛出错误**。不要将错误消息作为内容返回。

```typescript
execute: async (toolCallId, params, signal, onUpdate) => {
  if (!fs.existsSync(params.path)) {
    throw new Error(`File not found: ${params.path}`);
  }
  // 仅在成功时返回内容
  return { content: [{ type: "text", text: "..." }] };
}
```

抛出的错误会被智能体捕获，并作为带有 `isError: true` 的工具错误报告给 LLM。

从 `execute()` 或 `afterToolCall` 返回 `terminate: true` 以提示智能体应在当前工具批处理后停止。这仅在批处理中每个已完成的工具结果都是终止性的时候才生效。该提示仅作用于运行时；发出的 `toolResult` 转录消息仍然是标准的 LLM 工具结果。

## 代理使用

对于通过后端代理的浏览器应用：

```typescript
import { Agent, streamProxy } from "@earendil-works/pi-agent-core";

const agent = new Agent({
  streamFn: (model, context, options) =>
    streamProxy(model, context, {
      ...options,
      authToken: "...",
      proxyUrl: "https://your-server.com",
    }),
});
```

## 低级 API

无需使用 Agent 类即可直接控制：

```typescript
import { agentLoop, agentLoopContinue } from "@earendil-works/pi-agent-core";

const context: AgentContext = {
  systemPrompt: "You are helpful.",
  messages: [],
  tools: [],
};

const config: AgentLoopConfig = {
  model: getModel("openai", "gpt-4o"),
  convertToLlm: (msgs) => msgs.filter(m => ["user", "assistant", "toolResult"].includes(m.role)),
  toolExecution: "parallel",  // 如果设置了每个工具的 executionMode，则被其覆盖
  beforeToolCall: async ({ toolCall, args, context }) => undefined,
  afterToolCall: async ({ toolCall, result, isError, context }) => undefined,
};

const userMessage = { role: "user", content: "Hello", timestamp: Date.now() };

for await (const event of agentLoop([userMessage], context, config)) {
  console.log(event.type);
}

// 从现有上下文恢复
for await (const event of agentLoopContinue(context, config)) {
  console.log(event.type);
}
```

这些低级流是观察性的。它们保留了事件顺序，但在后续生产者阶段继续之前，它们不会等待你的异步事件处理完成。如果你需要消息处理在工具预检之前充当屏障，请使用 `Agent` 类，而不是原始的 `agentLoop()` 或 `agentLoopContinue()`。