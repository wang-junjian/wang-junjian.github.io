---
layout: single
title:  "MCP 基础协议"
date:   2025-03-27 10:00:00 +0800
categories: MCP LLM
tags: [MCP, LLM]
---

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

### 请求（Requests）

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

### 响应（Responses）

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

### 通知（Notifications）

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

### 批处理（Batching）

JSON-RPC 还定义了[批量处理多个请求和通知](https://www.jsonrpc.org/specification#batch)的方法，将它们放在一个数组中发送。MCP 实现**可以**支持发送 JSON-RPC 批处理，但**必须**支持接收 JSON-RPC 批处理。

## 认证

MCP 提供了一个用于 HTTP 的授权框架。使用基于 HTTP 的传输的实现**应该**符合此规范，而使用 STDIO 传输的实现**不应该**遵循此规范，而应该从环境中检索凭据。

此外，客户端和服务器**可以**协商自己的自定义认证和授权策略。

如需进一步讨论并为 MCP 认证机制的发展做出贡献，请加入我们的 [GitHub Discussions](https://github.com/modelcontextprotocol/specification/discussions)，帮助塑造协议的未来！

## 模式

协议的完整规范定义为 [TypeScript 模式](http://github.com/modelcontextprotocol/specification/tree/main/schema/draft/schema.ts)。这是所有协议消息和结构的真实来源。

还有一个 [JSON Schema](http://github.com/modelcontextprotocol/specification/tree/main/schema/draft/schema.json)，它是从 TypeScript 的真实来源自动生成的，用于各种自动化工具。


# 生命周期

模型上下文协议 (MCP) 为客户端-服务器连接定义了严格的生命周期，确保适当的能力协商和状态管理。

1. **初始化**: 能力协商和协议版本约定
2. **操作**: 正常协议通信
3. **关闭**: 连接的优雅终止

![](/images/2025/MCP-20250326/Lifecycle.png)

```mermaid
sequenceDiagram
    participant Client
    participant Server

    Note over Client,Server: 初始化阶段
    activate Client
    Client->>+Server: initialize 请求
    Server-->>Client: initialize 响应
    Client--)Server: initialized 通知

    Note over Client,Server: 操作阶段
    rect rgb(200, 220, 250)
        note over Client,Server: 正常协议操作
    end

    Note over Client,Server: 关闭
    Client--)-Server: 断开连接
    deactivate Server
    Note over Client,Server: 连接关闭
```

## 生命周期阶段

### 初始化

初始化阶段**必须**是客户端和服务器之间的第一次交互。
在此阶段，客户端和服务器：

- 建立协议版本兼容性
- 交换和协商能力
- 共享实现详情

客户端**必须**通过发送包含以下内容的 `initialize` 请求来启动此阶段：

- 支持的协议版本
- 客户端能力
- 客户端实现信息

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "initialize",
  "params": {
    "protocolVersion": "2024-11-05",
    "capabilities": {
      "roots": {
        "listChanged": true
      },
      "sampling": {}
    },
    "clientInfo": {
      "name": "ExampleClient",
      "version": "1.0.0"
    }
  }
}
```

初始化请求**不得**作为 JSON-RPC [批处理](https://www.jsonrpc.org/specification#batch)的一部分，因为在初始化完成之前无法进行其他请求和通知。这也允许与不明确支持 JSON-RPC 批处理的先前协议版本向后兼容。

服务器**必须**响应自己的能力和信息：

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "protocolVersion": "2024-11-05",
    "capabilities": {
      "logging": {},
      "prompts": {
        "listChanged": true
      },
      "resources": {
        "subscribe": true,
        "listChanged": true
      },
      "tools": {
        "listChanged": true
      }
    },
    "serverInfo": {
      "name": "ExampleServer",
      "version": "1.0.0"
    }
  }
}
```

成功初始化后，客户端**必须**发送 `initialized` 通知，表明其已准备好开始正常操作：

```json
{
  "jsonrpc": "2.0",
  "method": "notifications/initialized"
}
```

- 在服务器响应 `initialize` 请求之前，客户端**不应**发送除 `ping` 以外的请求。
- 在接收到 `initialized` 通知之前，服务器**不应**发送除 `ping` 和 `日志` 以外的请求。

#### 版本协商

在 `initialize` 请求中，客户端**必须**发送其支持的协议版本。这**应该**是客户端支持的*最新*版本。

如果服务器支持请求的协议版本，它**必须**以相同的版本回应。否则，服务器**必须**响应它支持的另一个协议版本。这**应该**是服务器支持的*最新*版本。

如果客户端不支持服务器响应中的版本，它**应该**断开连接。

#### 能力协商

客户端和服务器能力确定会话期间可用的可选协议功能。

关键能力包括：

| 类别     | 能力           | 描述                                                         |
| -------- | -------------- | ------------------------------------------------------------ |
| 客户端   | `roots`        | 提供文件系统`根目录`的能力    |
| 客户端   | `sampling`     | 支持 LLM `采样`请求        |
| 客户端   | `experimental` | 描述对非标准实验性功能的支持                                 |
| 服务器   | `prompts`      | 提供`提示模板`              |
| 服务器   | `resources`    | 提供可读的`资源`          |
| 服务器   | `tools`        | 暴露可调用的`工具`            |
| 服务器   | `logging`      | 发出结构化`日志消息` |
| 服务器   | `experimental` | 描述对非标准实验性功能的支持                                 |

能力对象可以描述子能力，如：

- `listChanged`: 支持列表变更通知（适用于提示、资源和工具）
- `subscribe`: 支持订阅单个项目的变更（仅限资源）

### 操作

在操作阶段，客户端和服务器根据协商的能力交换消息。

双方**应该**：

- 尊重协商的协议版本
- 仅使用已成功协商的能力

### 关闭

在关闭阶段，一方（通常是客户端）干净地终止协议连接。未定义特定的关闭消息——相反，应使用底层传输机制来发出连接终止信号：

#### stdio

对于 stdio `传输`，客户端**应该**通过以下方式启动关闭：

1. 首先，关闭到子进程（服务器）的输入流
2. 等待服务器退出，或者如果服务器在合理时间内没有退出，则发送 `SIGTERM`
3. 如果服务器在 `SIGTERM` 后的合理时间内没有退出，则发送 `SIGKILL`

服务器**可以**通过关闭其到客户端的输出流并退出来启动关闭。

#### HTTP

对于 HTTP `传输`，关闭通过关闭相关的 HTTP 连接来表示。

## 超时

实现**应该**为所有发送的请求建立超时，以防止连接挂起和资源耗尽。当请求在超时期限内未收到成功或错误响应时，发送方**应该**为该请求发出`取消通知`并停止等待响应。

SDK 和其他中间件**应该**允许这些超时在每个请求的基础上进行配置。

实现**可以**选择在接收到与请求相对应的`进度通知`时重置超时时钟，因为这意味着工作正在进行。然而，实现**应该**始终强制执行最大超时，无论进度通知如何，以限制行为不当的客户端或服务器的影响。

## 错误处理

实现**应该**准备处理这些错误情况：

- 协议版本不匹配
- 无法协商所需能力
- 请求超时

初始化错误示例：

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "error": {
    "code": -32602,
    "message": "Unsupported protocol version",
    "data": {
      "supported": ["2024-11-05"],
      "requested": "1.0.0"
    }
  }
}
```


# 传输协议

MCP 使用 JSON-RPC 编码消息。JSON-RPC 消息**必须**使用 UTF-8 编码。

该协议目前定义了两种标准的客户端-服务器通信传输机制：

1. [标准输入输出](#stdio)，通过标准输入和标准输出进行通信
2. [可流式 HTTP](#streamable-http)

客户端在可能的情况下**应该**支持标准输入输出。

客户端和服务器也可以以可插拔的方式实现[自定义传输协议](#custom-transports)。

## 标准输入输出

在**标准输入输出**传输模式中：

- 客户端将 MCP 服务器作为子进程启动。
- 服务器从其标准输入（`stdin`）读取 JSON-RPC 消息，并向其标准输出（`stdout`）发送消息。
- 消息可以是 JSON-RPC 请求、通知、响应，或包含一个或多个请求和/或通知的 JSON-RPC [批处理](https://www.jsonrpc.org/specification#batch)。
- 消息由换行符分隔，并且**不得**包含嵌入的换行符。
- 服务器**可以**将 UTF-8 字符串写入其标准错误（`stderr`）以用于日志记录。客户端**可以**捕获、转发或忽略这些日志。
- 服务器**不得**向其 `stdout` 写入任何不是有效 MCP 消息的内容。
- 客户端**不得**向服务器的 `stdin` 写入任何不是有效 MCP 消息的内容。

![](/images/2025/MCP-20250326/stdio.png)

```mermaid
sequenceDiagram
    participant Client
    participant Server Process

    Client->>+Server Process: 启动子进程
    loop 消息交换
        Client->>Server Process: 写入 stdin
        Server Process->>Client: 写入 stdout
        Server Process--)Client: 可选的 stderr 日志
    end
    Client->>Server Process: 关闭 stdin，终止子进程
    deactivate Server Process
```

## 可流式 HTTP

在**可流式 HTTP**传输中，服务器作为一个独立进程运行，可以处理多个客户端连接。此传输使用 HTTP POST 和 GET 请求。服务器可以选择使用[服务器发送事件](https://en.wikipedia.org/wiki/Server-sent_events)（SSE）来流式传输多个服务器消息。这允许基本的 MCP 服务器以及支持流式传输和服务器到客户端通知和请求的更丰富功能的服务器。

服务器**必须**提供一个支持 POST 和 GET 方法的 HTTP 端点路径（以下称为 **MCP 端点**）。例如，这可以是类似 `https://example.com/mcp` 的 URL。

### 向服务器发送消息

从客户端发送的每个 JSON-RPC 消息**必须**是一个新的 HTTP POST 请求到 MCP 端点。

1. 客户端**必须**使用 HTTP POST 向 MCP 端点发送 JSON-RPC 消息。
2. 客户端**必须**包含一个 `Accept` 头，列出 `application/json` 和 `text/event-stream` 作为支持的内容类型。
3. POST 请求的主体**必须**是以下之一：
   - 单个 JSON-RPC _请求_、_通知_或_响应_
   - 一个[批处理](https://www.jsonrpc.org/specification#batch)一个或多个_请求和/或通知_的数组
   - 一个[批处理](https://www.jsonrpc.org/specification#batch)一个或多个_响应_的数组
4. 如果输入仅包含（任意数量的）JSON-RPC _响应_或_通知_：
   - 如果服务器接受输入，服务器**必须**返回 HTTP 状态码 202 Accepted，且没有响应体。
   - 如果服务器无法接受输入，它**必须**返回 HTTP 错误状态码（例如，400 Bad Request）。HTTP 响应体**可以**包含没有 `id` 的 JSON-RPC _错误响应_。
5. 如果输入包含任意数量的 JSON-RPC _请求_，服务器**必须**返回 `Content-Type: text/event-stream`（以启动 SSE 流）或 `Content-Type: application/json`（以返回一个 JSON 对象）。客户端**必须**支持这两种情况。
6. 如果服务器启动 SSE 流：
   - SSE 流**应该**最终包含每个在 POST 正文中发送的 JSON-RPC _请求_对应的一个 JSON-RPC _响应_。这些_响应_**可以**进行[批处理](https://www.jsonrpc.org/specification#batch)。
   - 服务器**可以**在发送 JSON-RPC _响应_之前发送 JSON-RPC _请求_和_通知_。这些消息**应该**与原始客户端_请求_相关。这些_请求_和_通知_**可以**进行[批处理](https://www.jsonrpc.org/specification#batch)。
   - 除非会话过期，否则服务器**不应该**在为每个收到的 JSON-RPC _请求_发送 JSON-RPC _响应_之前关闭 SSE 流。
   - 在所有 JSON-RPC _响应_都已发送后，服务器**应该**关闭 SSE 流。
   - 断开连接**可能**随时发生（例如，由于网络条件）。因此：
     - 断开连接**不应该**被解释为客户端取消其请求。
     - 若要取消，客户端**应该**明确发送 MCP `CancelledNotification`。
     - 为避免由于断开连接导致的消息丢失，服务器**可以**使流可恢复。

### 监听来自服务器的消息

1. 客户端**可以**向 MCP 端点发出 HTTP GET 请求。这可用于打开 SSE 流，允许服务器与客户端通信，而无需客户端首先通过 HTTP POST 发送数据。
2. 客户端**必须**包含一个 `Accept` 头，将 `text/event-stream` 列为支持的内容类型。
3. 服务器**必须**响应此 HTTP GET 请求返回 `Content-Type: text/event-stream`，或者返回 HTTP 405 Method Not Allowed，表明服务器在此端点不提供 SSE 流。
4. 如果服务器启动 SSE 流：
   - 服务器**可以**在流上发送 JSON-RPC _请求_和_通知_。这些_请求_和_通知_**可以**进行[批处理](https://www.jsonrpc.org/specification#batch)。
   - 这些消息**应该**与来自客户端的任何当前运行的 JSON-RPC _请求_无关。
   - 服务器**不得**在流上发送 JSON-RPC _响应_，**除非**正在恢复与之前客户端请求相关的流。
   - 服务器**可以**随时关闭 SSE 流。
   - 客户端**可以**随时关闭 SSE 流。

### 多连接

1. 客户端**可以**同时保持与多个 SSE 流的连接。
2. 服务器**必须**将其每个 JSON-RPC 消息仅发送到一个已连接的流上；也就是说，它**不得**在多个流上广播相同的消息。
   - 消息丢失的风险**可以**通过使流可恢复来减轻。

### 可恢复性和重新传递

为了支持恢复断开的连接，并重新传递可能丢失的消息：

1. 服务器**可以**按照[SSE 标准](https://html.spec.whatwg.org/multipage/server-sent-events.html#event-stream-interpretation)所述，为其 SSE 事件附加 `id` 字段。
   - 如果存在，ID**必须**在该会话内的所有流中全局唯一—或者，如果未使用会话管理，则在该特定客户端的所有流中全局唯一。
2. 如果客户端希望在连接断开后恢复，它**应该**向 MCP 端点发出 HTTP GET 请求，并包含[`Last-Event-ID`](https://html.spec.whatwg.org/multipage/server-sent-events.html#the-last-event-id-header)头以指示它接收到的最后一个事件 ID。
   - 服务器**可以**使用此头来重播在最后一个事件 ID 之后本应发送的消息（在断开连接的流上），并从该点恢复流。
   - 服务器**不得**重播本应在不同流上传递的消息。

换句话说，这些事件 ID 应由服务器以每流为基础分配，作为该特定流内的游标。

### 会话管理

MCP "会话" 由客户端和服务器之间逻辑相关的交互组成，始于`初始化阶段`。为了支持希望建立有状态会话的服务器：

1. 使用可流式 HTTP 传输的服务器**可以**在初始化时分配会话 ID，方法是在包含 `InitializeResult` 的 HTTP 响应中包含 `Mcp-Session-Id` 头。
   - 会话 ID**应该**全局唯一且具有密码学安全性（例如，安全生成的 UUID、JWT 或加密哈希）。
   - 会话 ID**必须**仅包含可见的 ASCII 字符（范围从 0x21 到 0x7E）。
2. 如果服务器在初始化期间返回了 `Mcp-Session-Id`，使用可流式 HTTP 传输的客户端**必须**在其后续所有 HTTP 请求中包含该 ID 作为 `Mcp-Session-Id` 头。
   - 需要会话 ID 的服务器**应该**以 HTTP 400 Bad Request 响应没有 `Mcp-Session-Id` 头的请求（初始化除外）。
3. 服务器**可以**随时终止会话，之后它**必须**以 HTTP 404 Not Found 响应包含该会话 ID 的请求。
4. 当客户端收到对包含 `Mcp-Session-Id` 的请求的 HTTP 404 响应时，它**必须**通过发送不附加会话 ID 的新 `InitializeRequest` 来开始新会话。
5. 不再需要特定会话的客户端（例如，因为用户正在离开客户端应用程序）**应该**向带有 `Mcp-Session-Id` 头的 MCP 端点发送 HTTP DELETE，以明确终止会话。
   - 服务器**可以**以 HTTP 405 Method Not Allowed 响应此请求，表明服务器不允许客户端终止会话。

### 序列图

![](/images/2025/MCP-20250326/StreamingHTTP.png)

```mermaid
sequenceDiagram
    participant Client
    participant Server

    note over Client, Server: 初始化

    Client->>+Server: POST InitializeRequest
    Server->>-Client: InitializeResponse<br>Mcp-Session-Id: 1868a90c...

    Client->>+Server: POST InitializedNotification<br>Mcp-Session-Id: 1868a90c...
    Server->>-Client: 202 Accepted

    note over Client, Server: 客户端请求
    Client->>+Server: POST ... request ...<br>Mcp-Session-Id: 1868a90c...

    alt 单个 HTTP 响应
      Server->>Client: ... response ...
    else 服务器打开 SSE 流
      loop 连接保持打开状态
          Server-)Client: ... 来自服务器的 SSE 消息 ...
      end
      Server-)Client: SSE event: ... response ...
    end
    deactivate Server

    note over Client, Server: 客户端通知/响应
    Client->>+Server: POST ... notification/response ...<br>Mcp-Session-Id: 1868a90c...
    Server->>-Client: 202 Accepted

    note over Client, Server: 服务器请求
    Client->>+Server: GET<br>Mcp-Session-Id: 1868a90c...
    loop 连接保持打开状态
        Server-)Client: ... 来自服务器的 SSE 消息 ...
    end
    deactivate Server
```

### 向后兼容性

客户端和服务器可以通过以下方式与已弃用的 `HTTP+SSE 传输`（来自协议版本 2024-11-05）保持向后兼容：

**想要支持旧客户端的服务器**应该：

- 继续托管旧传输的 SSE 和 POST 端点，同时提供为可流式 HTTP 传输定义的新"MCP 端点"。
  - 也可以将旧的 POST 端点和新的 MCP 端点组合起来，但这可能会引入不必要的复杂性。

**想要支持旧服务器的客户端**应该：

1. 接受用户提供的 MCP 服务器 URL，该 URL 可能指向使用旧传输或新传输的服务器。
2. 尝试向服务器 URL 发送 `InitializeRequest` 的 POST 请求，带有上面定义的 `Accept` 头：
   - 如果成功，客户端可以假设这是支持新可流式 HTTP 传输的服务器。
   - 如果失败并返回 HTTP 4xx 状态码（例如，405 Method Not Allowed 或 404 Not Found）：
     - 向服务器 URL 发出 GET 请求，期望这将打开一个 SSE 流，并返回 `endpoint` 事件作为第一个事件。
     - 当 `endpoint` 事件到达时，客户端可以假设这是运行旧 HTTP+SSE 传输的服务器，并应该使用该传输进行所有后续通信。

## 自定义传输

客户端和服务器**可以**实现额外的自定义传输机制以满足其特定需求。该协议与传输无关，可以在任何支持双向消息交换的通信通道上实现。

选择支持自定义传输的实现者**必须**确保它们保留 MCP 定义的 JSON-RPC 消息格式和生命周期要求。自定义传输**应该**记录其特定的连接建立和消息交换模式，以帮助互操作性。


# 授权

## 1. 简介

### 1.1 目的和范围

模型上下文协议(MCP)在传输层提供授权功能，使MCP客户端能够代表资源所有者向受限的MCP服务器发出请求。本规范定义了基于HTTP传输的授权流程。

### 1.2 协议要求

对MCP实现来说，授权是**可选的**。当支持授权时：

- 使用基于HTTP传输的实现**应当**符合本规范。
- 使用STDIO传输的实现**不应**遵循本规范，而应从环境中检索凭据。
- 使用替代传输的实现**必须**遵循其协议的既定安全最佳实践。

### 1.3 标准合规性

此授权机制基于下列既定规范，但实现了其功能的选定子集，以确保安全性和互操作性，同时保持简单性：

- [OAuth 2.1 IETF 草案](https://datatracker.ietf.org/doc/html/draft-ietf-oauth-v2-1-12)
- OAuth 2.0 授权服务器元数据
  ([RFC8414](https://datatracker.ietf.org/doc/html/rfc8414))
- OAuth 2.0 动态客户端注册协议
  ([RFC7591](https://datatracker.ietf.org/doc/html/rfc7591))

## 2. 授权流程

### 2.1 概述

1. MCP认证实现**必须**实现OAuth 2.1，并为机密客户端和公共客户端采取适当的安全措施。

2. MCP认证实现**应当**支持OAuth 2.0动态客户端注册协议([RFC7591](https://datatracker.ietf.org/doc/html/rfc7591))。

3. MCP服务器**应当**实现且MCP客户端**必须**实现OAuth 2.0授权服务器元数据([RFC8414](https://datatracker.ietf.org/doc/html/rfc8414))。不支持授权服务器元数据的服务器**必须**遵循默认URI架构。

### 2.2 基本OAuth 2.1授权

当需要授权且客户端尚未提供授权证明时，服务器**必须**响应_HTTP 401 Unauthorized_。

客户端在收到_HTTP 401 Unauthorized_后启动[OAuth 2.1 IETF 草案](https://datatracker.ietf.org/doc/html/draft-ietf-oauth-v2-1-12)授权流程。

以下演示了使用PKCE的公共客户端的基本OAuth 2.1流程。

![](/images/2025/MCP-20250326/BasicOAuth2.1.png)

```mermaid
sequenceDiagram
    participant B as 用户代理(浏览器)
    participant C as 客户端
    participant M as MCP服务器

    C->>M: MCP请求
    M->>C: HTTP 401 Unauthorized
    Note over C: 生成code_verifier和code_challenge
    C->>B: 打开浏览器并附带授权URL + code_challenge
    B->>M: GET /authorize
    Note over M: 用户登录并授权
    M->>B: 重定向到回调URL并附带授权码
    B->>C: 通过授权码回调
    C->>M: 令牌请求(附带code + code_verifier)
    M->>C: 访问令牌(+ 刷新令牌)
    C->>M: 带访问令牌的MCP请求
    Note over C,M: 开始标准MCP消息交换
```

### 2.3 服务器元数据发现

对于服务器能力发现：

- MCP客户端_必须_遵循[RFC8414](https://datatracker.ietf.org/doc/html/rfc8414)中定义的OAuth 2.0授权服务器元数据协议。
- MCP服务器_应当_遵循OAuth 2.0授权服务器元数据协议。
- 不支持OAuth 2.0授权服务器元数据协议的MCP服务器_必须_支持备用URL。

发现流程如下图所示：

![](/images/2025/MCP-20250326/ServerMetadataDiscovery.png)

```mermaid
sequenceDiagram
    participant C as 客户端
    participant S as 服务器

    C->>S: GET /.well-known/oauth-authorization-server
    alt 发现成功
        S->>C: 200 OK + 元数据文档
        Note over C: 使用元数据中的端点
    else 发现失败
        S->>C: 404 Not Found
        Note over C: 回退到默认端点
    end
    Note over C: 继续授权流程
```

#### 2.3.1 服务器元数据发现头部

MCP客户端_应当_在服务器元数据发现期间包含头部`MCP-Protocol-Version: <protocol-version>`，以允许MCP服务器根据MCP协议版本进行响应。

例如：`MCP-Protocol-Version: 2024-11-05`

#### 2.3.2 授权基础URL

授权基础URL**必须**通过舍弃MCP服务器URL中的任何现有`路径`组件来确定。例如：

如果MCP服务器URL是`https://api.example.com/v1/mcp`，那么：

- 授权基础URL是`https://api.example.com`
- 元数据端点**必须**位于`https://api.example.com/.well-known/oauth-authorization-server`

这确保了授权端点始终位于托管MCP服务器的域名根级别，无论MCP服务器URL中有何路径组件。

#### 2.3.3 没有元数据发现的服务器的备用方案

对于不实现OAuth 2.0授权服务器元数据的服务器，客户端**必须**使用以下相对于授权基础URL（如2.3.2节所定义）的默认端点路径：

| 端点 | 默认路径 | 描述 |
| --- | --- | --- |
| 授权端点 | /authorize | 用于授权请求 |
| 令牌端点 | /token | 用于令牌交换和刷新 |
| 注册端点 | /register | 用于动态客户端注册 |

例如，对于托管在`https://api.example.com/v1/mcp`的MCP服务器，默认端点将是：

- `https://api.example.com/authorize`
- `https://api.example.com/token`
- `https://api.example.com/register`

客户端**必须**首先尝试通过元数据文档发现端点，然后才回退到默认路径。使用默认路径时，所有其他协议要求保持不变。

### 2.3 动态客户端注册

MCP客户端和服务器**应当**支持[OAuth 2.0动态客户端注册协议](https://datatracker.ietf.org/doc/html/rfc7591)，以允许MCP客户端无需用户交互即可获取OAuth客户端ID。这为客户端提供了一种标准化的方式自动注册到新服务器，这对MCP至关重要，因为：

- 客户端无法预先知道所有可能的服务器
- 手动注册会给用户带来摩擦
- 它使连接到新服务器变得无缝
- 服务器可以实现自己的注册策略

任何_不_支持动态客户端注册的MCP服务器需要提供获取客户端ID（以及适用时的客户端密钥）的替代方式。对于这些服务器，MCP客户端必须：

1. 专门为该MCP服务器硬编码客户端ID（以及适用时的客户端密钥），或
2. 向用户呈现UI，允许他们在自行注册OAuth客户端后（例如，通过服务器托管的配置界面）输入这些详细信息。

### 2.4 授权流程步骤

完整的授权流程如下进行：

![](/images/2025/MCP-20250326/AuthorizationFlowSteps.png)

```mermaid
sequenceDiagram
    participant B as 用户代理(浏览器)
    participant C as 客户端
    participant M as MCP服务器

    C->>M: GET /.well-known/oauth-authorization-server
    alt 服务器支持发现
        M->>C: 授权服务器元数据
    else 无发现
        M->>C: 404（使用默认端点）
    end

    alt 动态客户端注册
        C->>M: POST /register
        M->>C: 客户端凭据
    end

    Note over C: 生成PKCE参数
    C->>B: 打开浏览器并附带授权URL + code_challenge
    B->>M: 授权请求
    Note over M: 用户授权
    M->>B: 重定向到回调并附带授权码
    B->>C: 授权码回调
    C->>M: 令牌请求 + code_verifier
    M->>C: 访问令牌(+ 刷新令牌)
    C->>M: 带访问令牌的API请求
```

#### 2.4.1 决策流程概述

![](/images/2025/MCP-20250326/DecisionFlowOverview.png)

```mermaid
flowchart TD
    A[开始授权流程] --> B{检查元数据发现}
    B -->|可用| C[使用元数据端点]
    B -->|不可用| D[使用默认端点]

    C --> G{检查注册端点}
    D --> G

    G -->|可用| H[执行动态注册]
    G -->|不可用| I[需要替代注册]

    H --> J[开始OAuth流程]
    I --> J

    J --> K[生成PKCE参数]
    K --> L[请求授权]
    L --> M[用户授权]
    M --> N[交换授权码获取令牌]
    N --> O[使用访问令牌]
```

### 2.5 访问令牌使用

#### 2.5.1 令牌要求

访问令牌处理**必须**符合[OAuth 2.1第5节](https://datatracker.ietf.org/doc/html/draft-ietf-oauth-v2-1-12#section-5)对资源请求的要求。具体来说：

1. MCP客户端**必须**使用Authorization请求头字段
   [第5.1.1节](https://datatracker.ietf.org/doc/html/draft-ietf-oauth-v2-1-12#section-5.1.1)：

```
Authorization: Bearer <access-token>
```

请注意，授权**必须**包含在从客户端到服务器的每个HTTP请求中，即使它们是同一逻辑会话的一部分。

2. 访问令牌**不得**包含在URI查询字符串中

请求示例：

```http
GET /v1/contexts HTTP/1.1
Host: mcp.example.com
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

#### 2.5.2 令牌处理

资源服务器**必须**按照[第5.2节](https://datatracker.ietf.org/doc/html/draft-ietf-oauth-v2-1-12#section-5.2)所述验证访问令牌。如果验证失败，服务器**必须**按照[第5.3节](https://datatracker.ietf.org/doc/html/draft-ietf-oauth-v2-1-12#section-5.3)错误处理要求进行响应。无效或过期的令牌**必须**收到HTTP 401响应。

### 2.6 安全考虑

**必须**实施以下安全要求：

1. 客户端**必须**按照OAuth 2.0最佳实践安全存储令牌
2. 服务器**应当**强制执行令牌过期和轮换
3. 所有授权端点**必须**通过HTTPS提供服务
4. 服务器**必须**验证重定向URI以防止开放重定向漏洞
5. 重定向URI**必须**是localhost URL或HTTPS URL

### 2.7 错误处理

服务器**必须**为授权错误返回适当的HTTP状态码：

| 状态码 | 描述 | 用途 |
| --- | --- | --- |
| 401 | 未授权 | 需要授权或令牌无效 |
| 403 | 禁止 | 无效的作用域或权限不足 |
| 400 | 错误请求 | 授权请求格式错误 |

### 2.8 实施要求

1. 实现**必须**遵循OAuth 2.1安全最佳实践
2. 所有客户端**必须**使用PKCE
3. **应当**实施令牌轮换以增强安全性
4. 根据安全要求，令牌生命周期**应当**受到限制

### 2.9 第三方授权流程

#### 2.9.1 概述

MCP服务器**可以**通过第三方授权服务器支持委托授权。在此流程中，MCP服务器既是OAuth客户端（对第三方授权服务器），又是OAuth授权服务器（对MCP客户端）。

#### 2.9.2 流程描述

第三方授权流程包括以下步骤：

1. MCP客户端与MCP服务器启动标准OAuth流程
2. MCP服务器将用户重定向到第三方授权服务器
3. 用户通过第三方服务器进行授权
4. 第三方服务器重定向回MCP服务器并附带授权码
5. MCP服务器交换授权码获取第三方访问令牌
6. MCP服务器生成与第三方会话绑定的自身访问令牌
7. MCP服务器完成与MCP客户端的原始OAuth流程

![](/images/2025/MCP-20250326/FlowDescription.png)

```mermaid
sequenceDiagram
    participant B as 用户代理(浏览器)
    participant C as MCP客户端
    participant M as MCP服务器
    participant T as 第三方授权服务器

    C->>M: 初始OAuth请求
    M->>B: 重定向到第三方 /authorize
    B->>T: 授权请求
    Note over T: 用户授权
    T->>B: 重定向到MCP服务器回调
    B->>M: 授权码
    M->>T: 交换授权码获取令牌
    T->>M: 第三方访问令牌
    Note over M: 生成绑定的MCP令牌
    M->>B: 重定向到MCP客户端回调
    B->>C: MCP授权码
    C->>M: 交换授权码获取令牌
    M->>C: MCP访问令牌
```

#### 2.9.3 会话绑定要求

实施第三方授权的MCP服务器**必须**：

1. 维护第三方令牌与已发行MCP令牌之间的安全映射
2. 在信任MCP令牌前验证第三方令牌状态
3. 实施适当的令牌生命周期管理
4. 处理第三方令牌过期和更新

#### 2.9.4 安全考虑

实施第三方授权时，服务器**必须**：

1. 验证所有重定向URI
2. 安全存储第三方凭据
3. 实施适当的会话超时处理
4. 考虑令牌链接的安全影响
5. 为第三方授权失败实施适当的错误处理

## 3. 最佳实践

#### 3.1 作为公共OAuth 2.1客户端的本地客户端

我们强烈建议本地客户端实现OAuth 2.1作为公共客户端：

1. 利用代码挑战(PKCE)进行授权请求，以防止拦截攻击
2. 实施适合本地系统的安全令牌存储
3. 遵循令牌刷新最佳实践以维持会话
4. 正确处理令牌过期和更新

#### 3.2 授权元数据发现

我们强烈建议所有客户端实现元数据发现。这减少了用户手动提供端点或客户端回退到定义的默认值的需求。

#### 3.3 动态客户端注册

由于客户端无法预先知道所有MCP服务器集合，我们强烈建议实现动态客户端注册。这允许应用程序自动向MCP服务器注册，并消除了用户手动获取客户端ID的需要。


# 参考资料
- [Base Protocol](https://spec.modelcontextprotocol.io/specification/2025-03-26/basic/)
- [Authorization](https://spec.modelcontextprotocol.io/specification/2025-03-26/basic/authorization/)
- [Transports](https://spec.modelcontextprotocol.io/specification/2025-03-26/basic/transports/)
- [Lifecycle](https://spec.modelcontextprotocol.io/specification/2025-03-26/basic/lifecycle/)
