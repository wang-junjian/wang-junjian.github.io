---
layout: post
title:  "MCP 基础协议"
date:   2025-03-27 10:00:00 +0800
categories: MCP LLM
tags: [MCP, LLM]
---

## 基础协议

模型上下文协议（Model Context Protocol）由几个协同工作的关键组件组成：

- **基础协议**：核心 JSON-RPC 消息类型
- **生命周期管理**：连接初始化、能力协商和会话控制
- **服务器功能**：服务器提供的资源、提示和工具
- **客户端功能**：客户端提供的采样和根目录列表
- **实用工具**：跨领域关注点，如日志记录和参数补全

所有实现**必须**支持基础协议和生命周期管理组件。其他组件**可以**根据应用程序的特定需求来实现。

这些协议层在实现客户端和服务器之间丰富交互的同时，建立了明确的关注点分离。模块化设计允许实现精确支持所需的功能。

## 消息

MCP 客户端和服务器之间的所有消息**必须**遵循 [JSON-RPC 2.0](https://www.jsonrpc.org/specification) 规范。协议定义了以下类型的消息：

### 请求

请求从客户端发送到服务器，或者从服务器发送到客户端，用于启动操作。

```typescript
{
  jsonrpc: "2.0";
  id: string | number;
  method: string;
  params?: {
    [key: string]: unknown;
  };
}
```

- 请求**必须**包含字符串或整数 ID。
- 与基本 JSON-RPC 不同，ID **不得**为 `null`。
- 请求 ID **不得**在同一会话中被请求者先前使用过。

### 响应

响应是对请求的回复，包含操作的结果或错误。

```typescript
{
  jsonrpc: "2.0";
  id: string | number;
  result?: {
    [key: string]: unknown;
  }
  error?: {
    code: number;
    message: string;
    data?: unknown;
  }
}
```

- 响应**必须**包含与其对应请求相同的 ID。
- **响应**进一步分为**成功结果**或**错误**。必须设置 `result` 或 `error` 中的一个。响应**不得**同时设置两者。
- 结果**可以**遵循任何 JSON 对象结构，而错误**必须**至少包含错误代码和消息。
- 错误代码**必须**是整数。

### 通知

通知从客户端发送到服务器，或者从服务器发送到客户端，作为单向消息。接收方**不得**发送响应。

```typescript
{
  jsonrpc: "2.0";
  method: string;
  params?: {
    [key: string]: unknown;
  };
}
```

- 通知**不得**包含 ID。

### 批处理

JSON-RPC 还定义了[批量处理多个请求和通知](https://www.jsonrpc.org/specification#batch)的方法，将它们放在一个数组中发送。MCP 实现**可以**支持发送 JSON-RPC 批处理，但**必须**支持接收 JSON-RPC 批处理。

## 认证

MCP 提供了一个用于 HTTP 的授权框架。使用基于 HTTP 的传输的实现**应该**符合此规范，而使用 STDIO 传输的实现**不应该**遵循此规范，而应该从环境中检索凭据。

此外，客户端和服务器**可以**协商自己的自定义认证和授权策略。

如需进一步讨论并为 MCP 认证机制的发展做出贡献，请加入我们的 [GitHub Discussions](https://github.com/modelcontextprotocol/specification/discussions)，帮助塑造协议的未来！

## 模式

协议的完整规范定义为 [TypeScript 模式](http://github.com/modelcontextprotocol/specification/tree/main/schema/draft/schema.ts)。这是所有协议消息和结构的真实来源。

还有一个 [JSON Schema](http://github.com/modelcontextprotocol/specification/tree/main/schema/draft/schema.json)，它是从 TypeScript 的真实来源自动生成的，用于各种自动化工具。


## 参考资料
- [Base Protocol](https://spec.modelcontextprotocol.io/specification/2025-03-26/basic/)
