---
layout: single
title:  "基于 Pi Agent SDK 适配 OpenAI 兼容接口"
date:   2026-05-20 08:00:00 +0800
categories: [人工智能, 智能体]
tags: [Pi Agent, SDK, TypeScript, Ollama, LongCat]
---

通过两种方式，在 TypeScript 中使用 `@earendil-works` 的 Pi Agent 框架连接本地运行的 Ollama 模型（以 `qwen3.5:9b` 为例）。

## 环境初始化

首先，初始化项目并配置为 **ES Modules (ESM)** 模式，以支持顶层 `await` 语法。


```bash
npm init -y
```

在生成的 `package.json` 中，手动添加 `"type": "module"`：

```json
{
  "type": "module",
  "name": "pi-samples",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
```

接着，安装 Pi Agent 相关的核心依赖包：

```bash
npm install @earendil-works/pi-agent-core @earendil-works/pi-ai @earendil-works/pi-coding-agent
```

自动更新 `package.json` 以包含这些依赖：

```json
{
  "type": "module",
  "name": "pi-samples",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "@earendil-works/pi-agent-core": "^0.75.3",
    "@earendil-works/pi-ai": "^0.75.3",
    "@earendil-works/pi-coding-agent": "^0.75.3"
  }
}
```


## 配置兼容 OpenAI API 接口

### Ollama 模型接入

直接修改现有的 OpenAI 模型元数据，指向本地 Ollama 的 `baseUrl` 和模型名称。
利用 `getModel("openai", "gpt-4o")` 获取标准结构，通过对象展开运算符 `...` 覆盖 `id`、`name` 和 `baseUrl`。

因为直接基于现有 OpenAI 模型，需设置环境变量 `process.env.OPENAI_API_KEY = "NONE"`。

```ts
import { Agent } from "@earendil-works/pi-agent-core";
import { getModel } from "@earendil-works/pi-ai";

// 如果 Ollama 不需要密钥，随意填一个非空字符串避开 SDK 内部的校验即可
process.env.OPENAI_API_KEY = "NONE"; 

// 获取一个基础的 openai 模型元数据
const baseModel = getModel("openai", "gpt-4o");

// 设置你的本地 Ollama 模型的相关信息
const ollamaModel = {
  ...baseModel,
  id: "qwen3.5:9b",            // 改为你本地 Ollama 中的模型名称
  name: "Qwen 3.5 9B (Local)", 
  baseUrl: "http://localhost:11434/v1", // 指向 Ollama 的 OpenAI 兼容端点
};

const agent = new Agent({
  initialState: {
    systemPrompt: "You are a helpful assistant.",
    model: ollamaModel,
  },
});

agent.subscribe((event) => {
  if (event.type === "message_update" && event.assistantMessageEvent.type === "text_delta") {
    process.stdout.write(event.assistantMessageEvent.delta);
  }
});

await agent.prompt("Hello!");

// 📌 换行，避免终端 prompt 覆盖输出，导致回复的消息一闪而逝。
process.stdout.write("\n");
```

### LongCat 模型接入

这里以 `LongCat-2.0-Preview` 模型为例，展示如何通过修改模型元数据的方式接入。

元数据中 `api` 设置为 `openai-responses`，但 LongCat 只支持 `openai-completions` 方式的接口。

```ts
import { Agent } from "@earendil-works/pi-agent-core";
import { getModel } from "@earendil-works/pi-ai";

process.env.OPENAI_API_KEY = "your-api-key"; 

// 获取一个基础的 openai 模型元数据
const baseModel = getModel("openai", "gpt-5");

const longCatModel = {
  ...baseModel,
  id: "LongCat-2.0-Preview",
  name: "LongCat-2.0-Preview",
  api: "openai-completions",
  baseUrl: "https://api.longcat.chat/openai/v1",
  contextWindow: 1000000,
  maxTokens: 128000
};
console.log("Using model:", longCatModel);

const agent = new Agent({
  initialState: {
    systemPrompt: "You are a helpful assistant.",
    model: longCatModel,
  },
});

agent.subscribe((event) => {
  if (event.type === "message_update" && event.assistantMessageEvent.type === "text_delta") {
    process.stdout.write(event.assistantMessageEvent.delta);
  }
});

await agent.prompt("你是谁？");

// 换行，避免终端 prompt 覆盖输出，导致回复的消息一闪而逝。
process.stdout.write("\n");
```


## 基于 ModelRegistry 注册

### Ollama 模型接入

创建一个新的模型提供商（provider）条目，完全独立于现有的 OpenAI 配置。这种方式更清晰地表达了 Ollama 模型的独立性，并且不需要设置环境变量来绕过 OpenAI 的密钥校验。

使用 `ModelRegistry` 手动注册一个名为 `ollama` 的全新服务商，完整配置模型的上下文窗口（`contextWindow`）、最大 Token 等参数。

提供了 `streamFn` 自定义流式驱动，通过 `streamSimple` 配合注册中心的鉴权信息进行调用，主要是把定义的模型提供商中的 `apiKey` 传递给底层的流式调用函数。_可能有更好的方法，根本就不用定义 `streamFn`。_

```ts
import { Agent } from "@earendil-works/pi-agent-core";
import { ModelRegistry, AuthStorage } from "@earendil-works/pi-coding-agent";
import { streamSimple } from "@earendil-works/pi-ai";

const authStorage = AuthStorage.create();
const modelRegistry = ModelRegistry.create(authStorage);

modelRegistry.registerProvider("ollama", {
  name: "Ollama Local Server",
  baseUrl: "http://localhost:11434/v1",
  apiKey: "NONE",
  api: "openai-responses",
  headers: undefined,
  models: [
    {
      id: "qwen3.5:9b",
      name: "Qwen 3.5 (Local)",
      reasoning: false,
      input: ["text"],
      contextWindow: 128000,
      maxTokens: 16384,
      cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
    },
  ],
});

const ollamaModel = modelRegistry.find("ollama", "qwen3.5:9b");

const agent = new Agent({
  initialState: {
    systemPrompt: "You are a helpful assistant.",
    model: ollamaModel,
  },
  streamFn: async (model, context, options) => {
    const auth = await modelRegistry.getApiKeyAndHeaders(model);
    if (!auth.ok) throw new Error(auth.error);

    return streamSimple(model, context, {
      ...options,
      apiKey: auth.apiKey,
    });
  },
});

agent.subscribe((event) => {
  if (event.type === "message_update" && event.assistantMessageEvent.type === "text_delta") {
    process.stdout.write(event.assistantMessageEvent.delta);
  }
});

await agent.prompt("Hello!");

// 📌 换行，避免终端 prompt 覆盖输出，导致回复的消息一闪而逝。
process.stdout.write("\n");
```


## 运行与验证

确保本地 Ollama 服务已启动，且已提前下载好模型（`ollama run qwen3.5:9b`）。然后在终端执行：

```bash
npx tsx agent.ts
```

**输出结果**：

```
Hello! 👋 How can I help you today?
```
