---
layout: single
title:  "Pi Agent Event Examples"
date:   2026-05-24 08:00:00 +0800
categories: [智能体]
tags: [Pi Agent, Event, TypeScript]
---

## 事件流

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


## 事件流示例

```ts
import { Agent, AgentTool } from "@earendil-works/pi-agent-core";
import { getModel } from "@earendil-works/pi-ai";
import { Type } from "typebox";

// 控制台颜色常量
const COLOR = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  gray: "\x1b[90m",
  bold: "\x1b[1m"
};

// ============================================================
// 工具定义 — 计算器
// ============================================================
const CalculatorParams = Type.Object({
  expression: Type.String({ description: "数学表达式，如 '2 + 3 * 4'" }),
});

const calculatorTool: AgentTool<typeof CalculatorParams, { expression: string; result: number }> = {
  name: "calculator",
  description: "执行数学计算。输入一个数学表达式，如 '2 + 3 * 4'。",
  parameters: CalculatorParams,
  label: "计算器",
  execute: async (_toolCallId, params) => {
    const expr = params.expression.replace(/\s/g, "");
    if (!/^[\d+\-*/().]+$/.test(expr)) {
      throw new Error(`不安全的表达式: ${expr}`);
    }
    const result = Function(`"use strict"; return (${expr})`)();
    return {
      content: [{ type: "text", text: String(result) }],
      details: { expression: expr, result },
    };
  },
};

process.env.OPENAI_API_KEY = "ak_1984ca0Z44JH84E2NI2xS4rA7593u";

// 模型配置
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

// 初始化智能体
const agent = new Agent({
  initialState: {
    systemPrompt: "You are a helpful assistant.",
    model: longCatModel,
    tools: [calculatorTool],
  },
});

// 日志层级配置
let turnIndex = 0;
const INDENT_BASE = "";
const INDENT_L1 = "│  ";
const INDENT_L2 = "│     ";
const INDENT_L3 = "│        ";

// 追踪上一个父事件类型，用于判断是否需要重复显示
let lastParentType = "";

/**
 * 从消息对象中提取可读的文本内容
 */
function extractMessageContent(message: any): string {
  if (!message?.content) return "";
  const content = message.content;
  // user 消息可能是纯字符串
  if (typeof content === "string") return content;
  // assistant / toolResult 消息是内容块数组
  if (Array.isArray(content)) {
    return content
      .map((block: any) => {
        if (block.type === "text") return block.text ?? "";
        if (block.type === "thinking") return `[思考] ${block.thinking ?? ""}`;
        if (block.type === "toolCall") return `[工具调用] ${block.name}(${JSON.stringify(block.arguments ?? {})})`;
        if (block.type === "image") return "[图片]";
        return "";
      })
      .filter(Boolean)
      .join(" | ");
  }
  return String(content);
}

/**
 * 格式化日志输出（两列表格样式）
 * @param level 层级缩进
 * @param color 颜色标识
 * @param icon 图标
 * @param parentType 第一列：事件类型（如 message_start）
 * @param subType 第二列：子事件类型（如 text_delta）
 * @param content 日志内容
 */
function formatLog(level: string, color: string, icon: string, parentType: string, subType: string, content: string) {
  // 如果父事件类型和上一个相同，则第一列显示空白
  const displayParent = parentType === lastParentType ? "" : parentType;
  lastParentType = parentType;

  const col1 = displayParent.padEnd(20);
  const col2 = subType.padEnd(24);
  console.log(`${color}${level}${col1} ${col2} ${icon} ${content}${COLOR.reset}`);
}

// 订阅全生命周期事件
agent.subscribe((event) => {
  switch (event.type) {
    // 智能体全局生命周期
    case "agent_start":
      turnIndex = 0;
      lastParentType = ""; // 重置
      console.log(`\n${COLOR.bold}${COLOR.cyan}════════════════════════════════════════════════════════${COLOR.reset}`);
      formatLog(INDENT_BASE, COLOR.cyan, "🚀", "agent_start", "", "智能体启动，开始会话流程");
      console.log(`${COLOR.cyan}════════════════════════════════════════════════════════${COLOR.reset}\n`);
      break;

    case "agent_end": {
      const msgs = event.messages;
      const msgChain = msgs.map(m => `[${m.role}]`).join(" → ");
      console.log(`\n${COLOR.bold}${COLOR.magenta}════════════════════════════════════════════════════════${COLOR.reset}`);
      formatLog(INDENT_BASE, COLOR.magenta, "🏁", "agent_end", "", `会话结束 | 消息总数: ${msgs.length} \n🔗 链路: ${msgChain}`);
      console.log(`${COLOR.magenta}════════════════════════════════════════════════════════${COLOR.reset}\n`);
      break;
    }

    // 单轮对话生命周期
    case "turn_start":
      turnIndex++;
      formatLog(INDENT_BASE, COLOR.blue, "┌─", "turn_start", "", `第 ${turnIndex} 轮对话开始`);
      break;

    case "turn_end": {
      const role = event.message.role;
      const toolCnt = event.toolResults.length;
      formatLog(INDENT_BASE, COLOR.blue, "└─", "turn_end", "", `第 ${turnIndex} 轮结束 | 最终角色:${role} | 工具执行数:${toolCnt}`);
      console.log("");
      break;
    }

    // 消息收发生命周期
    case "message_start": {
      const role = event.message.role;
      let icon = "👤", color = COLOR.yellow;
      if (role === "assistant") { icon = "🤖"; color = COLOR.green; }
      if (role === "toolResult") { icon = "📦"; color = COLOR.gray; }
      const msgContent = extractMessageContent(event.message);
      const shortContent = msgContent.length > 80 ? msgContent.slice(0, 80) + "..." : msgContent;
      formatLog(INDENT_L1, color, icon, "message_start", "", `[${role}] ${shortContent}`);
      break;
    }

    case "message_update": {
      const sub = event.assistantMessageEvent;
      switch (sub.type) {
        case "start":
          formatLog(INDENT_L2, COLOR.gray, "📡", "message_update", "start", "流式响应通道开启");
          break;
        case "text_start":
          formatLog(INDENT_L2, COLOR.green, "✏️", "message_update", "text_start", `正文片段 ${sub.contentIndex} 开始输出`);
          break;
        case "text_delta":
          const txt = sub.delta.replace(/\n/g, "\\n");
          formatLog(INDENT_L3, COLOR.green, "↳", "message_update", "text_delta", `增量文本: "${txt}"`);
          break;
        case "text_end":
          const shortTxt = sub.content.slice(0, 60);
          formatLog(INDENT_L2, COLOR.green, "✅", "message_update", "text_end", `正文片段完成: ${shortTxt}`);
          break;
        case "thinking_start":
          formatLog(INDENT_L2, COLOR.yellow, "💭", "message_update", "thinking_start", `思考片段 ${sub.contentIndex} 启动`);
          break;
        case "thinking_delta":
          const thinkTxt = sub.delta.replace(/\n/g, "\\n");
          formatLog(INDENT_L3, COLOR.yellow, "↳", "message_update", "thinking_delta", `思考增量: "${thinkTxt}"`);
          break;
        case "thinking_end":
          formatLog(INDENT_L2, COLOR.yellow, "✅", "message_update", "thinking_end", "思考逻辑结束");
          break;
        case "toolcall_start":
          formatLog(INDENT_L2, COLOR.red, "🔧", "message_update", "toolcall_start", `工具调用 ${sub.contentIndex} 发起`);
          break;
        case "toolcall_delta":
          formatLog(INDENT_L3, COLOR.red, "↳", "message_update", "toolcall_delta", `参数流式解析: ${sub.delta}`);
          break;
        case "toolcall_end":
          formatLog(INDENT_L2, COLOR.red, "⚙️", "message_update", "toolcall_end", `确定调用工具: ${sub.toolCall.name}`);
          break;
        case "done":
          formatLog(INDENT_L2, COLOR.gray, "🏁", "message_update", "done", `流终止原因: ${sub.reason}`);
          break;
        case "error":
          formatLog(INDENT_L2, COLOR.red, "❌", "message_update", "error", `响应异常: ${sub.reason}`);
          break;
      }
      break;
    }

    case "message_end": {
      const role = event.message.role;
      let icon = "👤", color = COLOR.yellow;
      if (role === "assistant") { icon = "🤖"; color = COLOR.green; }
      if (role === "toolResult") { icon = "📦"; color = COLOR.gray; }
      formatLog(INDENT_L1, color, icon, "message_end", "", `[${role}] 消息接收完毕`);
      break;
    }

    // 工具执行生命周期
    case "tool_execution_start":
      const argsStr = JSON.stringify(event.args);
      formatLog(INDENT_L1, COLOR.red, "⚡", "tool_execution_start", "", `执行工具 ${event.toolName} | 参数: ${argsStr}`);
      break;

    case "tool_execution_update":
      const partial = JSON.stringify(event.partialResult);
      formatLog(INDENT_L3, COLOR.red, "🔹", "tool_execution_update", "partial", `中间返回数据: ${partial}`);
      break;

    case "tool_execution_end": {
      const resStr = JSON.stringify(event.result).slice(0, 100);
      const status = event.isError ? "❌" : "✔️";
      const statusColor = event.isError ? COLOR.red : COLOR.green;
      formatLog(INDENT_L1, statusColor, status, "tool_execution_end", "", `工具最终输出: ${resStr}`);
      break;
    }
  }
});

// 发起对话请求
await agent.prompt("请计算 2 + 3 * 4 等于多少？请使用 calculatorTool 来计算。");

// 输出完整对话 JSON
const conversation = agent.state.messages;
console.log(JSON.stringify(conversation, null, 2));
```

### prompt() 事件序列

```ts
await agent.prompt("Hello");
```

```bash
════════════════════════════════════════════════════════
agent_start                                   🚀 智能体启动，开始会话流程
════════════════════════════════════════════════════════

turn_start                                    ┌─ 第 1 轮对话开始
│  message_start                                 👤 [user] Hello
│  message_end                                   👤 [user] 消息接收完毕
│  message_start                                 🤖 [assistant] 
│     message_update       text_start               ✏️ 正文片段 0 开始输出
│                             text_delta               ↳ 增量文本: "Hello"
│                             text_delta               ↳ 增量文本: "!"
│                             text_delta               ↳ 增量文本: " How can I help"
│                             text_delta               ↳ 增量文本: " you today?"
│                          text_end                 ✅ 正文片段完成: Hello! How can I help you today?
│  message_end                                   🤖 [assistant] 消息接收完毕
turn_end                                      └─ 第 1 轮结束 | 最终角色:assistant | 工具执行数:0


════════════════════════════════════════════════════════
agent_end                                     🏁 会话结束 | 消息总数: 2 
🔗 链路: [user] → [assistant]
════════════════════════════════════════════════════════
```

```json
[
  {
    "role": "user",
    "content": [
      {
        "type": "text",
        "text": "Hello"
      }
    ],
    "timestamp": 1779613319330
  },
  {
    "role": "assistant",
    "content": [
      {
        "type": "text",
        "text": "Hello! How can I help you today?"
      }
    ],
    "api": "openai-completions",
    "provider": "openai",
    "model": "LongCat-2.0-Preview",
    "usage": {
      "input": 34,
      "output": 10,
      "cacheRead": 128,
      "cacheWrite": 0,
      "totalTokens": 172,
      "cost": {
        "input": 0.0000425,
        "output": 0.0001,
        "cacheRead": 0.000016,
        "cacheWrite": 0,
        "total": 0.0001585
      }
    },
    "stopReason": "stop",
    "timestamp": 1779613319360,
    "responseId": "10cba0df077c46eab4b9e381a36e987e"
  }
]
```

### 包含工具调用的事件序列

```ts
await agent.prompt("请计算 2 + 3 * 4 等于多少？请使用 calculatorTool 来计算。");
```

```bash
════════════════════════════════════════════════════════
agent_start                                   🚀 智能体启动，开始会话流程
════════════════════════════════════════════════════════

turn_start                                    ┌─ 第 1 轮对话开始
│  message_start                                 👤 [user] 请计算 2 + 3 * 4 等于多少？请使用 calculatorTool 来计算。
│  message_end                                   👤 [user] 消息接收完毕
│  message_start                                 🤖 [assistant] 
│     message_update       text_start               ✏️ 正文片段 0 开始输出
│                             text_delta               ↳ 增量文本: "我来"
│                             text_delta               ↳ 增量文本: "为你"
│                             text_delta               ↳ 增量文本: "计算 2 +"
│                             text_delta               ↳ 增量文本: " 3 * "
│                             text_delta               ↳ 增量文本: "4 的值。"
│                          toolcall_start           🔧 工具调用 1 发起
│                             toolcall_delta           ↳ 参数流式解析: 
│                             toolcall_delta           ↳ 参数流式解析: {"expression": "
│                             toolcall_delta           ↳ 参数流式解析: 2 + 3
│                             toolcall_delta           ↳ 参数流式解析:  * 4"
│                             toolcall_delta           ↳ 参数流式解析: }
│                          text_end                 ✅ 正文片段完成: 我来为你计算 2 + 3 * 4 的值。
│                          toolcall_end             ⚙️ 确定调用工具: calculator
│  message_end                                   🤖 [assistant] 消息接收完毕
│  tool_execution_start                          ⚡ 执行工具 calculator | 参数: {"expression":"2 + 3 * 4"}
│  tool_execution_end                            ✔️ 工具最终输出: {"content":[{"type":"text","text":"14"}],"details":{"expression":"2+3*4","result":14}}
│  message_start                                 📦 [toolResult] 14
│  message_end                                   📦 [toolResult] 消息接收完毕
turn_end                                      └─ 第 1 轮结束 | 最终角色:assistant | 工具执行数:1

turn_start                                    ┌─ 第 2 轮对话开始
│  message_start                                 🤖 [assistant] 
│     message_update       text_start               ✏️ 正文片段 0 开始输出
│                             text_delta               ↳ 增量文本: "2"
│                             text_delta               ↳ 增量文本: " +"
│                             text_delta               ↳ 增量文本: " 3 * "
│                             text_delta               ↳ 增量文本: "4 = **1"
│                             text_delta               ↳ 增量文本: "4**\n\n根据数学"
│                             text_delta               ↳ 增量文本: "运算规则，先"
│                             text_delta               ↳ 增量文本: "进行乘法运算"
│                             text_delta               ↳ 增量文本: " "
│                             text_delta               ↳ 增量文本: "3 *"
│                             text_delta               ↳ 增量文本: " 4 = "
│                             text_delta               ↳ 增量文本: "12，然后再"
│                             text_delta               ↳ 增量文本: "进行加法运算 "
│                             text_delta               ↳ 增量文本: "2 + 1"
│                             text_delta               ↳ 增量文本: "2 = 1"
│                             text_delta               ↳ 增量文本: "4。"
│                          text_end                 ✅ 正文片段完成: 2 + 3 * 4 = **14**

根据数学运算规则，先进行乘法运算 3 * 4 = 12，然后再进行加法运算 2 
│  message_end                                   🤖 [assistant] 消息接收完毕
turn_end                                      └─ 第 2 轮结束 | 最终角色:assistant | 工具执行数:0


════════════════════════════════════════════════════════
agent_end                                     🏁 会话结束 | 消息总数: 4 | 
🔗 链路: [user] → [assistant] → [toolResult] → [assistant]
════════════════════════════════════════════════════════
```

```json
[
  {
    "role": "user",
    "content": [
      {
        "type": "text",
        "text": "请计算 2 + 3 * 4 等于多少？请使用 calculatorTool 来计算。"
      }
    ],
    "timestamp": 1779611325274
  },
  {
    "role": "assistant",
    "content": [
      {
        "type": "text",
        "text": "我来为你计算 2 + 3 * 4 的值。"
      },
      {
        "type": "toolCall",
        "id": "call_bea23107254249fbac5e61a1",
        "name": "calculator",
        "arguments": {
          "expression": "2 + 3 * 4"
        }
      }
    ],
    "api": "openai-completions",
    "provider": "openai",
    "model": "LongCat-2.0-Preview",
    "usage": {
      "input": 54,
      "output": 34,
      "cacheRead": 128,
      "cacheWrite": 0,
      "totalTokens": 216,
      "cost": {
        "input": 0.0000675,
        "output": 0.00034,
        "cacheRead": 0.000016,
        "cacheWrite": 0,
        "total": 0.00042350000000000005
      }
    },
    "stopReason": "toolUse",
    "timestamp": 1779611325303,
    "responseId": "26caddc3efbe415d829ba25bcb9738de"
  },
  {
    "role": "toolResult",
    "toolCallId": "call_bea23107254249fbac5e61a1",
    "toolName": "calculator",
    "content": [
      {
        "type": "text",
        "text": "14"
      }
    ],
    "details": {
      "expression": "2+3*4",
      "result": 14
    },
    "isError": false,
    "timestamp": 1779611328116
  },
  {
    "role": "assistant",
    "content": [
      {
        "type": "text",
        "text": "2 + 3 * 4 = **14**\n\n根据数学运算规则，先进行乘法运算 3 * 4 = 12，然后再进行加法运算 2 + 12 = 14。"
      }
    ],
    "api": "openai-completions",
    "provider": "openai",
    "model": "LongCat-2.0-Preview",
    "usage": {
      "input": 117,
      "output": 47,
      "cacheRead": 128,
      "cacheWrite": 0,
      "totalTokens": 292,
      "cost": {
        "input": 0.00014625,
        "output": 0.00047000000000000004,
        "cacheRead": 0.000016,
        "cacheWrite": 0,
        "total": 0.00063225
      }
    },
    "stopReason": "stop",
    "timestamp": 1779611328116,
    "responseId": "2f85a0bd419e4b13b5385f017c1d3b89"
  }
]
```


## 参考链接
- [@earendil-works/pi-agent-core](https://github.com/earendil-works/pi/blob/main/packages/agent/README.md)
