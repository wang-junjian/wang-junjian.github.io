---
layout: single
title:  "Pi Agent SDK 参考文档"
date:   2026-05-21 08:00:00 +0800
categories: [智能体]
tags: [Pi Agent, SDK, TypeScript]
---

[本 SDK](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/sdk.md) 提供对 Pi 智能体能力的程序化访问。可用于将 Pi 嵌入其他应用、构建自定义界面，或集成到自动化工作流中。

**典型使用场景：**
- 构建自定义界面（网页、桌面、移动端）
- 将智能体能力集成到现有应用
- 用智能体推理创建自动化流程
- 构建可生成子智能体的自定义工具
- 以编程方式测试智能体行为

参见 [examples/sdk/](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/examples/sdk)，获取从极简到全量控制的可运行示例。

---

## 快速上手
```typescript
import { AuthStorage, createAgentSession, ModelRegistry, SessionManager } from "@earendil-works/pi-coding-agent";

// 设置凭证存储与模型注册器
const authStorage = AuthStorage.create();
const modelRegistry = ModelRegistry.create(authStorage);

const { session } = await createAgentSession({
  sessionManager: SessionManager.inMemory(),
  authStorage,
  modelRegistry,
});

// 订阅事件流
session.subscribe((event) => {
  if (event.type === "message_update" && event.assistantMessageEvent.type === "text_delta") {
    process.stdout.write(event.assistantMessageEvent.delta);
  }
});

// 发送提示：查询当前目录下的文件
await session.prompt("当前目录下有哪些文件？");
```

## 安装
```bash
npm install @earendil-works/pi-coding-agent
```

SDK 已包含在主包中，无需单独安装。

---

## 核心概念

### createAgentSession()
创建单个**智能体会话（AgentSession）** 的核心工厂函数。

`createAgentSession()` 使用 `ResourceLoader` 提供扩展、技能、提示模板、主题和上下文文件。若未提供，则使用带标准自动发现能力的 `DefaultResourceLoader`。

```typescript
import { createAgentSession, SessionManager } from "@earendil-works/pi-coding-agent";

// 最简用法：使用默认配置与 DefaultResourceLoader
const { session } = await createAgentSession();

// 自定义用法：覆盖特定选项
const { session } = await createAgentSession({
  model: myModel,
  tools: ["read", "bash"],
  sessionManager: SessionManager.inMemory(),
});
```

### 智能体会话（AgentSession）
会话负责管理智能体生命周期、消息历史、模型状态、内容精简与事件流式输出。

```typescript
interface AgentSession {
  // 发送提示并等待执行完成
  prompt(text: string, options?: PromptOptions): Promise<void>;

  // 在流式输出期间排队消息
  steer(text: string): Promise<void>;
  followUp(text: string): Promise<void>;

  // 订阅事件（返回取消订阅函数）
  subscribe(listener: (event: AgentSessionEvent) => void): () => void;

  // 会话信息
  sessionFile: string | undefined;
  sessionId: string;

  // 模型控制
  setModel(model: Model): Promise<void>;
  setThinkingLevel(level: ThinkingLevel): void;
  cycleModel(): Promise<ModelCycleResult | undefined>;
  cycleThinkingLevel(): ThinkingLevel | undefined;

  // 状态访问
  agent: Agent;
  model: Model | undefined;
  thinkingLevel: ThinkingLevel;
  messages: AgentMessage[];
  isStreaming: boolean;

  // 在当前会话文件内进行树形导航
  navigateTree(targetId: string, options?: { summarize?: boolean; customInstructions?: string; replaceInstructions?: boolean; label?: string }): Promise<{ editorText?: string; cancelled: boolean }>;

  // 内容精简
  compact(customInstructions?: string): Promise<CompactionResult>;
  abortCompaction(): void;

  // 终止当前操作
  abort(): Promise<void>;

  // 清理资源
  dispose(): void;
}
```

会话替换相关 API（如新建会话、恢复会话、分支会话、导入）位于 `AgentSessionRuntime` 上，而非 `AgentSession`。

---

### createAgentSessionRuntime() 与 智能体会话运行时（AgentSessionRuntime）
当你需要替换当前活跃会话、重建与工作目录（cwd）绑定的运行时状态时，使用运行时 API。
内置的交互模式、打印模式和 RPC 模式均使用该层实现。

`createAgentSessionRuntime()` 接收一个运行时工厂与初始工作目录/会话目标。工厂封装进程级固定输入，为生效的工作目录重建绑定服务，基于这些服务解析会话配置，并返回完整运行时结果。

```typescript
import {
  type CreateAgentSessionRuntimeFactory,
  createAgentSessionFromServices,
  createAgentSessionRuntime,
  createAgentSessionServices,
  getAgentDir,
  SessionManager,
} from "@earendil-works/pi-coding-agent";

const createRuntime: CreateAgentSessionRuntimeFactory = async ({ cwd, sessionManager, sessionStartEvent }) => {
  const services = await createAgentSessionServices({ cwd });
  return {
    ...(await createAgentSessionFromServices({
      services,
      sessionManager,
      sessionStartEvent,
    })),
    services,
    diagnostics: services.diagnostics,
  };
};

const runtime = await createAgentSessionRuntime(createRuntime, {
  cwd: process.cwd(),
  agentDir: getAgentDir(),
  sessionManager: SessionManager.create(process.cwd()),
});
```

`AgentSessionRuntime` 负责在以下操作中替换活跃运行时：
- `newSession()`
- `switchSession()`
- `fork()`
- 通过 `fork(entryId, { position: "at" })` 实现克隆流程
- `importFromJsonl()`

**重要行为：**
- 执行上述操作后，`runtime.session` 会发生变化
- 事件订阅绑定到特定 `AgentSession`，替换后需重新订阅
- 若使用扩展，需为新会话重新调用 `runtime.session.bindExtensions(...)`
- 创建完成后可通过 `runtime.diagnostics` 获取诊断信息
- 若运行时创建或替换失败，方法会抛出异常，由调用方决定处理方式

```typescript
let session = runtime.session;
let unsubscribe = session.subscribe(() => {});

await runtime.newSession();

unsubscribe();
session = runtime.session;
unsubscribe = session.subscribe(() => {});
```

---

### 提示发送与消息排队
`PromptOptions` 用于控制提示模板展开、流式输出时的排队行为，以及提示预检通知：

```typescript
interface PromptOptions {
  expandPromptTemplates?: boolean;
  images?: ImageContent[];
  streamingBehavior?: "steer" | "followUp";
  source?: InputSource;
  preflightResult?: (success: boolean) => void;
}
```

`preflightResult` 在每次 `prompt()` 调用时触发一次：
- `true`：提示已被接收、排队或立即处理
- `false`：提示在接收前被预检拒绝

它在 `prompt()` 决议前触发。`prompt()` 仍会在整个被接收流程（含重试）完成后才决议。接收后的失败通过常规事件与消息流上报，而非通过 `preflightResult(false)`。

`prompt()` 方法处理提示模板、扩展命令与消息发送：

```typescript
// 基础提示（非流式时）
await session.prompt("这里有哪些文件？");

// 带图片
await session.prompt("这张图片里有什么？", {
  images: [{ type: "image", source: { type: "base64", mediaType: "image/png", data: "..." } }]
});

// 流式输出期间：必须指定消息排队方式
await session.prompt("停止并执行这个任务", { streamingBehavior: "steer" });
await session.prompt("完成后再检查 X", { streamingBehavior: "followUp" });
```

**行为规则：**
- **扩展命令**（如 `/mycommand`）：立即执行，即使在流式输出中。它们通过 `pi.sendMessage()` 管理自身与大语言模型的交互。
- **基于文件的提示模板**（来自 `.md` 文件）：在发送或排队前展开为文件内容。
- **流式输出期间未指定 `streamingBehavior`**：抛出错误。可直接使用 `steer()` 或 `followUp()`，或指定该选项。
- `preflightResult(true)`：提示已被接收、排队或立即处理。
- `preflightResult(false)`：提示在接收前被预检拒绝。

在流式输出中显式排队：
```typescript
// 排队干预消息，在当前智能体回合完成工具调用后执行
await session.steer("新指令");

// 等待智能体结束（仅在智能体停止时投递）
await session.followUp("完成后再执行这个");
```

`steer()` 与 `followUp()` 均会展开基于文件的提示模板，但遇到扩展命令会报错（扩展命令不可排队）。

---

### 智能体（Agent）与智能体状态（AgentState）
`Agent` 类（来自 `@earendil-works/pi-agent-core`）处理核心大语言模型交互。可通过 `session.agent` 访问。

```typescript
// 访问当前状态
const state = session.agent.state;

// state.messages: AgentMessage[] - 对话历史
// state.model: Model - 当前模型
// state.thinkingLevel: ThinkingLevel - 当前思考等级
// state.systemPrompt: string - 系统提示
// state.tools: AgentTool[] - 可用工具
// state.streamingMessage?: AgentMessage - 当前正在生成的智能体消息
// state.errorMessage?: string - 最近一次智能体错误

// 替换消息（用于分支或恢复）
session.agent.state.messages = messages; // 复制顶层数组

// 替换工具
session.agent.state.tools = tools; // 复制顶层数组

// 等待智能体处理完成
await session.agent.waitForIdle();
```

---

### 事件
订阅事件以接收流式输出与生命周期通知。

```typescript
session.subscribe((event) => {
  switch (event.type) {
    // 智能体流式文本
    case "message_update":
      if (event.assistantMessageEvent.type === "text_delta") {
        process.stdout.write(event.assistantMessageEvent.delta);
      }
      if (event.assistantMessageEvent.type === "thinking_delta") {
        // 思考过程输出（若开启思考）
      }
      break;
    
    // 工具执行
    case "tool_execution_start":
      console.log(`工具：${event.toolName}`);
      break;
    case "tool_execution_update":
      // 工具输出流式推送
      break;
    case "tool_execution_end":
      console.log(`结果：${event.isError ? "错误" : "成功"}`);
      break;
    
    // 消息生命周期
    case "message_start":
      // 新消息开始
      break;
    case "message_end":
      // 消息完成
      break;
    
    // 智能体生命周期
    case "agent_start":
      // 智能体开始处理提示
      break;
    case "agent_end":
      // 智能体处理结束（event.messages 包含新消息）
      break;
    
    // 回合生命周期（一次大语言模型响应 + 工具调用）
    case "turn_start":
      break;
    case "turn_end":
      // event.message: 智能体响应
      // event.toolResults: 本回合工具执行结果
      break;
    
    // 会话事件（排队、精简、重试）
    case "queue_update":
      console.log(event.steering, event.followUp);
      break;
    case "compaction_start":
    case "compaction_end":
    case "auto_retry_start":
    case "auto_retry_end":
      break;
  }
});
```

---

## 配置项参考

### 目录
```typescript
const { session } = await createAgentSession({
  // DefaultResourceLoader 用于资源发现的工作目录
  cwd: process.cwd(), // 默认值
  
  // 全局配置目录
  agentDir: "~/.pi/agent", // 默认值（~ 会被展开）
});
```

`cwd` 被 `DefaultResourceLoader` 用于：
- 项目扩展（`.pi/extensions/`）
- 项目技能：
  - `.pi/skills/`
  - 工作目录及上级目录中的 `.agents/skills/`（向上遍历至 Git 仓库根，非仓库则遍历至文件系统根）
- 项目提示（`.pi/prompts/`）
- 上下文文件（从工作目录向上查找 `AGENTS.md`）
- 会话目录命名

`agentDir` 被 `DefaultResourceLoader` 用于：
- 全局扩展（`extensions/`）
- 全局技能：
  - `agentDir` 下的 `skills/`（如 `~/.pi/agent/skills/`）
  - `~/.agents/skills/`
- 全局提示（`prompts/`）
- 全局上下文文件（`AGENTS.md`）
- 设置（`settings.json`）
- 自定义模型（`models.json`）
- 凭证（`auth.json`）
- 会话（`sessions/`）

当传入自定义 `ResourceLoader` 时，`cwd` 与 `agentDir` 不再控制资源发现，但仍会影响会话命名与工具路径解析。

---

### 模型
```typescript
import { getModel } from "@earendil-works/pi-ai";
import { AuthStorage, ModelRegistry } from "@earendil-works/pi-coding-agent";

const authStorage = AuthStorage.create();
const modelRegistry = ModelRegistry.create(authStorage);

// 查找指定内置模型（不检查 API Key 是否存在）
const opus = getModel("anthropic", "claude-opus-4-5");
if (!opus) throw new Error("模型未找到");

// 按厂商/ID 查找任意模型，包括来自 models.json 的自定义模型
// （不检查 API Key 是否存在）
const customModel = modelRegistry.find("my-provider", "my-model");

// 仅获取已配置有效 API Key 的模型
const available = await modelRegistry.getAvailable();

const { session } = await createAgentSession({
  model: opus,
  thinkingLevel: "medium", // off, minimal, low, medium, high, xhigh
  
  // 用于切换的模型组（交互模式下 Ctrl+P）
  scopedModels: [
    { model: opus, thinkingLevel: "high" },
    { model: haiku, thinkingLevel: "off" },
  ],
  
  authStorage,
  modelRegistry,
});
```

未指定模型时的优先级：
1. 尝试从会话恢复（若继续会话）
2. 使用设置中的默认模型
3. 回退到第一个可用模型

---

### API Key 与 OAuth
API Key 解析优先级（由 AuthStorage 处理）：
1. 运行时覆盖（通过 `setRuntimeApiKey`，不持久化）
2. `auth.json` 中存储的凭证（API Key 或 OAuth Token）
3. 环境变量（`ANTHROPIC_API_KEY`、`OPENAI_API_KEY` 等）
4. 兜底解析器（用于 `models.json` 中自定义厂商的密钥）

```typescript
import { AuthStorage, ModelRegistry } from "@earendil-works/pi-coding-agent";

// 默认：使用 ~/.pi/agent/auth.json 与 ~/.pi/agent/models.json
const authStorage = AuthStorage.create();
const modelRegistry = ModelRegistry.create(authStorage);

const { session } = await createAgentSession({
  sessionManager: SessionManager.inMemory(),
  authStorage,
  modelRegistry,
});

// 运行时 API Key 覆盖（不写入磁盘）
authStorage.setRuntimeApiKey("anthropic", "sk-my-temp-key");

// 自定义凭证存储位置
const customAuth = AuthStorage.create("/my/app/auth.json");
const customRegistry = ModelRegistry.create(customAuth, "/my/app/models.json");

const { session } = await createAgentSession({
  sessionManager: SessionManager.inMemory(),
  authStorage: customAuth,
  modelRegistry: customRegistry,
});

// 无自定义 models.json（仅内置模型）
const simpleRegistry = ModelRegistry.inMemory(authStorage);
```

---

### 系统提示
使用 `ResourceLoader` 覆盖系统提示：
```typescript
import { createAgentSession, DefaultResourceLoader } from "@earendil-works/pi-coding-agent";

const loader = new DefaultResourceLoader({
  systemPromptOverride: () => "你是一个乐于助人的智能体。",
});
await loader.reload();

const { session } = await createAgentSession({ resourceLoader: loader });
```

---

### 工具
指定启用哪些内置工具：
- 内置工具名：`read`、`bash`、`edit`、`write`、`grep`、`find`、`ls`
- 默认内置工具：`read`、`bash`、`edit`、`write`
- `noTools: "all"`：禁用所有工具
- `noTools: "builtin"`：禁用默认内置工具，但保留扩展与自定义工具

```typescript
import { createAgentSession } from "@earendil-works/pi-coding-agent";

// 只读模式
const { session } = await createAgentSession({
  tools: ["read", "grep", "find", "ls"],
});

// 选择特定工具
const { session } = await createAgentSession({
  tools: ["read", "bash", "grep"],
});
```

#### 自定义工作目录（cwd）的工具
传入自定义 `cwd` 时，`createAgentSession()` 会为该目录构建选中的内置工具。

```typescript
import { createAgentSession, SessionManager } from "@earendil-works/pi-coding-agent";

const cwd = "/path/to/project";

// 为自定义 cwd 使用默认工具
const { session } = await createAgentSession({
  cwd,
  sessionManager: SessionManager.inMemory(cwd),
});

// 或为自定义 cwd 指定工具
const { session } = await createAgentSession({
  cwd,
  tools: ["read", "bash", "grep"],
  sessionManager: SessionManager.inMemory(cwd),
});
```

---

### 自定义工具
```typescript
import { Type } from "typebox";
import { createAgentSession, defineTool } from "@earendil-works/pi-coding-agent";

// 内联自定义工具
const myTool = defineTool({
  name: "my_tool",
  label: "我的工具",
  description: "执行一些有用的操作",
  parameters: Type.Object({
    input: Type.String({ description: "输入值" }),
  }),
  execute: async (_toolCallId, params) => ({
    content: [{ type: "text", text: `结果：${params.input}` }],
    details: {},
  }),
});

// 直接传入自定义工具
const { session } = await createAgentSession({
  customTools: [myTool],
});
```

使用 `defineTool()` 定义独立工具并以数组形式传入，如 `customTools: [myTool]`。内联 `pi.registerTool({ ... })` 可正确自动推断参数类型。

通过 `customTools` 传入的自定义工具会与扩展注册的工具合并。`ResourceLoader` 加载的扩展也可通过 `pi.registerTool()` 注册工具。

若传入 `tools`，需包含要启用的自定义/扩展工具名，例如 `tools: ["read", "bash", "my_tool"]`。

---

### 扩展
扩展由 `ResourceLoader` 加载。`DefaultResourceLoader` 从 `~/.pi/agent/extensions/`、`.pi/extensions/` 与 `settings.json` 中的扩展源发现扩展。

```typescript
import { createAgentSession, DefaultResourceLoader } from "@earendil-works/pi-coding-agent";

const loader = new DefaultResourceLoader({
  additionalExtensionPaths: ["/path/to/my-extension.ts"],
  extensionFactories: [
    (pi) => {
      pi.on("agent_start", () => {
        console.log("[内联扩展] 智能体启动");
      });
    },
  ],
});
await loader.reload();

const { session } = await createAgentSession({ resourceLoader: loader });
```

扩展可注册工具、订阅事件、添加命令等。完整 API 参见 `extensions.md`。

**事件总线**：扩展可通过 `pi.events` 通信。若需要从外部发送/监听，可传入共享 `eventBus` 给 `DefaultResourceLoader`：

```typescript
import { createEventBus, DefaultResourceLoader } from "@earendil-works/pi-coding-agent";

const eventBus = createEventBus();
const loader = new DefaultResourceLoader({
  eventBus,
});
await loader.reload();

eventBus.on("my-extension:status", (data) => console.log(data));
```

---

### 技能
```typescript
import {
  createAgentSession,
  DefaultResourceLoader,
  type Skill,
} from "@earendil-works/pi-coding-agent";

const customSkill: Skill = {
  name: "my-skill",
  description: "自定义指令",
  filePath: "/path/to/SKILL.md",
  baseDir: "/path/to",
  source: "custom",
};

const loader = new DefaultResourceLoader({
  skillsOverride: (current) => ({
    skills: [...current.skills, customSkill],
    diagnostics: current.diagnostics,
  }),
});
await loader.reload();

const { session } = await createAgentSession({ resourceLoader: loader });
```

---

### 上下文文件
```typescript
import { createAgentSession, DefaultResourceLoader } from "@earendil-works/pi-coding-agent";

const loader = new DefaultResourceLoader({
  agentsFilesOverride: (current) => ({
    agentsFiles: [
      ...current.agentsFiles,
      { path: "/virtual/AGENTS.md", content: "# 指南\n\n- 简洁明了" },
    ],
  }),
});
await loader.reload();

const { session } = await createAgentSession({ resourceLoader: loader });
```

---

### 斜杠命令
```typescript
import {
  createAgentSession,
  DefaultResourceLoader,
  type PromptTemplate,
} from "@earendil-works/pi-coding-agent";

const customCommand: PromptTemplate = {
  name: "deploy",
  description: "部署应用",
  source: "(custom)",
  content: "# 部署\n\n1. 构建\n2. 测试\n3. 部署",
};

const loader = new DefaultResourceLoader({
  promptsOverride: (current) => ({
    prompts: [...current.prompts, customCommand],
    diagnostics: current.diagnostics,
  }),
});
await loader.reload();

const { session } = await createAgentSession({ resourceLoader: loader });
```

---

## 会话管理
会话使用树形结构，通过 `id`/`parentId` 关联，支持原地分支。

```typescript
import {
  type CreateAgentSessionRuntimeFactory,
  createAgentSession,
  createAgentSessionFromServices,
  createAgentSessionRuntime,
  createAgentSessionServices,
  getAgentDir,
  SessionManager,
} from "@earendil-works/pi-coding-agent";

// 内存模式（无持久化）
const { session } = await createAgentSession({
  sessionManager: SessionManager.inMemory(),
});

// 新建持久化会话
const { session: persisted } = await createAgentSession({
  sessionManager: SessionManager.create(process.cwd()),
});

// 继续最近会话
const { session: continued, modelFallbackMessage } = await createAgentSession({
  sessionManager: SessionManager.continueRecent(process.cwd()),
});
if (modelFallbackMessage) {
  console.log("注意：", modelFallbackMessage);
}

// 打开指定文件
const { session: opened } = await createAgentSession({
  sessionManager: SessionManager.open("/path/to/session.jsonl"),
});

// 列出会话
const currentProjectSessions = await SessionManager.list(process.cwd());
const allSessions = await SessionManager.listAll(process.cwd());

// 用于 /new、/resume、/fork、/clone、导入流程的会话替换 API
const createRuntime: CreateAgentSessionRuntimeFactory = async ({ cwd, sessionManager, sessionStartEvent }) => {
  const services = await createAgentSessionServices({ cwd });
  return {
    ...(await createAgentSessionFromServices({
      services,
      sessionManager,
      sessionStartEvent,
    })),
    services,
    diagnostics: services.diagnostics,
  };
};

const runtime = await createAgentSessionRuntime(createRuntime, {
  cwd: process.cwd(),
  agentDir: getAgentDir(),
  sessionManager: SessionManager.create(process.cwd()),
});

// 用全新会话替换当前活跃会话
await runtime.newSession();

// 用另一个保存的会话替换当前活跃会话
await runtime.switchSession("/path/to/session.jsonl");

// 从指定用户条目分支，替换当前活跃会话
await runtime.fork("entry-id");

// 通过指定条目克隆当前路径
await runtime.fork("entry-id", { position: "at" });
```

**SessionManager 树形 API**：
```typescript
const sm = SessionManager.open("/path/to/session.jsonl");

// 会话列表
const currentProjectSessions = await SessionManager.list(process.cwd());
const allSessions = await SessionManager.listAll(process.cwd());

// 树形遍历
const entries = sm.getEntries();        // 所有条目（不含头部）
const tree = sm.getTree();              // 完整树形结构
const path = sm.getPath();              // 从根到当前叶子节点的路径
const leaf = sm.getLeafEntry();         // 当前叶子条目
const entry = sm.getEntry(id);          // 按 ID 获取条目
const children = sm.getChildren(id);    // 条目的直接子节点

// 标签
const label = sm.getLabel(id);          // 获取条目标签
sm.appendLabelChange(id, "checkpoint"); // 设置标签

// 分支
sm.branch(entryId);                     // 将叶子节点移至更早条目
sm.branchWithSummary(id, "摘要...");  // 带上下文摘要的分支
sm.createBranchedSession(leafId);       // 将路径提取到新文件
```

---

## 设置管理
```typescript
import { createAgentSession, SettingsManager, SessionManager } from "@earendil-works/pi-coding-agent";

// 默认：从文件加载（全局 + 项目合并）
const { session } = await createAgentSession({
  settingsManager: SettingsManager.create(),
});

// 带覆盖配置
const settingsManager = SettingsManager.create();
settingsManager.applyOverrides({
  compaction: { enabled: false },
  retry: { enabled: true, maxRetries: 5 },
});
const { session } = await createAgentSession({ settingsManager });

// 内存模式（无文件 I/O，用于测试）
const { session } = await createAgentSession({
  settingsManager: SettingsManager.inMemory({ compaction: { enabled: false } }),
  sessionManager: SessionManager.inMemory(),
});

// 自定义目录
const { session } = await createAgentSession({
  settingsManager: SettingsManager.create("/custom/cwd", "/custom/agent"),
});
```

**静态工厂**：
- `SettingsManager.create(cwd?, agentDir?)`：从文件加载
- `SettingsManager.inMemory(settings?)`：无文件 I/O

**项目级设置**：
设置从两个位置加载并合并：
1. 全局：`~/.pi/agent/settings.json`
2. 项目：`<cwd>/.pi/settings.json`

项目配置覆盖全局配置。嵌套对象按键合并。Setter 默认修改全局设置。

**持久化与错误处理语义**：
- 设置的读写操作对内存状态是同步的
- Setter 异步入队持久化写入
- 需要确保持久化边界时（如进程退出前、测试中断言文件内容前），调用 `await settingsManager.flush()`
- `SettingsManager` 不打印设置 I/O 错误，使用 `settingsManager.drainErrors()` 在应用层上报

---

## 资源加载器（ResourceLoader）
使用 `DefaultResourceLoader` 发现扩展、技能、提示、主题与上下文文件。

```typescript
import {
  DefaultResourceLoader,
  getAgentDir,
} from "@earendil-works/pi-coding-agent";

const loader = new DefaultResourceLoader({
  cwd,
  agentDir: getAgentDir(),
});
await loader.reload();

const extensions = loader.getExtensions();
const skills = loader.getSkills();
const prompts = loader.getPrompts();
const themes = loader.getThemes();
const contextFiles = loader.getAgentsFiles().agentsFiles;
```

---

## 返回值
`createAgentSession()` 返回：
```typescript
interface CreateAgentSessionResult {
  // 会话实例
  session: AgentSession;
  
  // 扩展加载结果（用于运行器初始化）
  extensionsResult: LoadExtensionsResult;
  
  // 会话模型无法恢复时的警告信息
  modelFallbackMessage?: string;
}

interface LoadExtensionsResult {
  extensions: Extension[];
  errors: Array<{ path: string; error: string }>;
  runtime: ExtensionRuntime;
}
```

---

## 完整示例
```typescript
import { getModel } from "@earendil-works/pi-ai";
import { Type } from "typebox";
import {
  AuthStorage,
  createAgentSession,
  DefaultResourceLoader,
  defineTool,
  ModelRegistry,
  SessionManager,
  SettingsManager,
} from "@earendil-works/pi-coding-agent";

// 设置凭证存储（自定义位置）
const authStorage = AuthStorage.create("/custom/agent/auth.json");

// 运行时 API Key 覆盖（不持久化）
if (process.env.MY_KEY) {
  authStorage.setRuntimeApiKey("anthropic", process.env.MY_KEY);
}

// 模型注册器（无自定义 models.json）
const modelRegistry = ModelRegistry.create(authStorage);

// 内联工具
const statusTool = defineTool({
  name: "status",
  label: "状态",
  description: "获取系统状态",
  parameters: Type.Object({}),
  execute: async () => ({
    content: [{ type: "text", text: `运行时长：${process.uptime()}s` }],
    details: {},
  }),
});

const model = getModel("anthropic", "claude-opus-4-5");
if (!model) throw new Error("模型未找到");

// 带覆盖配置的内存设置
const settingsManager = SettingsManager.inMemory({
  compaction: { enabled: false },
  retry: { enabled: true, maxRetries: 2 },
});

const loader = new DefaultResourceLoader({
  cwd: process.cwd(),
  agentDir: "/custom/agent",
  settingsManager,
  systemPromptOverride: () => "你是一个极简智能体。保持简洁。",
});
await loader.reload();

const { session } = await createAgentSession({
  cwd: process.cwd(),
  agentDir: "/custom/agent",

  model,
  thinkingLevel: "off",
  authStorage,
  modelRegistry,

  tools: ["read", "bash", "status"],
  customTools: [statusTool],
  resourceLoader: loader,

  sessionManager: SessionManager.inMemory(),
  settingsManager,
});

session.subscribe((event) => {
  if (event.type === "message_update" && event.assistantMessageEvent.type === "text_delta") {
    process.stdout.write(event.assistantMessageEvent.delta);
  }
});

// 发送提示：获取状态并列出文件
await session.prompt("获取系统状态并列出文件。");
```

---

## 运行模式
SDK 导出运行模式工具，用于在 `createAgentSession()` 之上构建自定义界面：

### 交互模式（InteractiveMode）
完整 TUI 交互模式，带编辑器、聊天记录与所有内置命令：
```typescript
import {
  type CreateAgentSessionRuntimeFactory,
  createAgentSessionFromServices,
  createAgentSessionRuntime,
  createAgentSessionServices,
  getAgentDir,
  InteractiveMode,
  SessionManager,
} from "@earendil-works/pi-coding-agent";

const createRuntime: CreateAgentSessionRuntimeFactory = async ({ cwd, sessionManager, sessionStartEvent }) => {
  const services = await createAgentSessionServices({ cwd });
  return {
    ...(await createAgentSessionFromServices({ services, sessionManager, sessionStartEvent })),
    services,
    diagnostics: services.diagnostics,
  };
};

const runtime = await createAgentSessionRuntime(createRuntime, {
  cwd: process.cwd(),
  agentDir: getAgentDir(),
  sessionManager: SessionManager.create(process.cwd()),
});

const mode = new InteractiveMode(runtime, {
  migratedProviders: [],
  modelFallbackMessage: undefined,
  initialMessage: "你好",
  initialImages: [],
  initialMessages: [],
});

await mode.run();
```

### 打印模式（runPrintMode）
一次性模式：发送提示、输出结果、退出：
```typescript
import {
  type CreateAgentSessionRuntimeFactory,
  createAgentSessionFromServices,
  createAgentSessionRuntime,
  createAgentSessionServices,
  getAgentDir,
  runPrintMode,
  SessionManager,
} from "@earendil-works/pi-coding-agent";

const createRuntime: CreateAgentSessionRuntimeFactory = async ({ cwd, sessionManager, sessionStartEvent }) => {
  const services = await createAgentSessionServices({ cwd });
  return {
    ...(await createAgentSessionFromServices({ services, sessionManager, sessionStartEvent })),
    services,
    diagnostics: services.diagnostics,
  };
};

const runtime = await createAgentSessionRuntime(createRuntime, {
  cwd: process.cwd(),
  agentDir: getAgentDir(),
  sessionManager: SessionManager.create(process.cwd()),
});

await runPrintMode(runtime, {
  mode: "text",
  initialMessage: "你好",
  initialImages: [],
  messages: ["补充执行"],
});
```

### RPC 模式（runRpcMode）
用于子进程集成的 JSON-RPC 模式：
```typescript
import {
  type CreateAgentSessionRuntimeFactory,
  createAgentSessionFromServices,
  createAgentSessionRuntime,
  createAgentSessionServices,
  getAgentDir,
  runRpcMode,
  SessionManager,
} from "@earendil-works/pi-coding-agent";

const createRuntime: CreateAgentSessionRuntimeFactory = async ({ cwd, sessionManager, sessionStartEvent }) => {
  const services = await createAgentSessionServices({ cwd });
  return {
    ...(await createAgentSessionFromServices({ services, sessionManager, sessionStartEvent })),
    services,
    diagnostics: services.diagnostics,
  };
};

const runtime = await createAgentSessionRuntime(createRuntime, {
  cwd: process.cwd(),
  agentDir: getAgentDir(),
  sessionManager: SessionManager.create(process.cwd()),
});

await runRpcMode(runtime);
```

JSON 协议参见 RPC 文档。

### RPC 模式替代方案
无需基于 SDK 构建，直接使用 CLI 实现子进程集成：
```bash
pi --mode rpc --no-session
```

JSON 协议参见 RPC 文档。

**优先使用 SDK 的场景：**
- 需要类型安全
- 在同一 Node.js 进程内
- 需要直接访问智能体状态
- 需要程序化定制工具/扩展

**优先使用 RPC 模式的场景：**
- 从其他语言集成
- 需要进程隔离
- 构建语言无关的客户端

---

## 导出项
主入口导出：
```typescript
// 工厂
createAgentSession
createAgentSessionRuntime
AgentSessionRuntime

// 认证与模型
AuthStorage
ModelRegistry

// 资源加载
DefaultResourceLoader
type ResourceLoader
createEventBus

// 工具函数
defineTool

// 会话管理
SessionManager
SettingsManager

// 工具工厂
createCodingTools
createReadOnlyTools
createReadTool, createBashTool, createEditTool, createWriteTool
createGrepTool, createFindTool, createLsTool

// 类型
type CreateAgentSessionOptions
type CreateAgentSessionResult
type ExtensionFactory
type ExtensionAPI
type ToolDefinition
type Skill
type PromptTemplate
type Tool
```

扩展类型完整 API 参见 `extensions.md`。
