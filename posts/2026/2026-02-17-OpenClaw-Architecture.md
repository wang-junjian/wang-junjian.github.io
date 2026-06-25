---
type: article
title:  "OpenClaw 架构设计"
date:   2026-02-17 10:00:00 +0800
tags: [OpenClaw, Agent, Architecture]
---

<!-- more -->

## 目录

* 概览
* 核心组件
* 控制平面
* 网关协议
* 消息路由
* 消息流程
* 启动流程

---

## 概览

OpenClaw 是一个多渠道 AI 助手网关，设计用于在用户自己的设备上运行。它采用单一网关 + 多客户端/节点模型，支持 WhatsApp、Telegram、Slack、Discord、Google Chat、Signal、iMessage 等多种通信渠道。

### 核心结构

| 组件 | 描述 |
| --- | --- |
| **🌐 Gateway（网关）** | 长期运行的守护进程，管理所有消息平台连接和智能体通信 |
| **💻 Clients（客户端）** | 控制平面应用（macOS 应用、CLI、Web 界面） |
| **📱 Nodes（节点）** | 设备节点，提供硬件能力（macOS/iOS/Android/无头设备） |

### 整体架构

```mermaid
graph TB
    subgraph UserLayer["用户设备层"]
        MacApp["macOS 应用"]
        IOSApp["iOS 应用"]
        AndroidApp["Android 应用"]
        CLI["命令行界面"]
        WebUI["Web 界面"]
    end

    subgraph GatewayLayer["网关核心层"]
        Gateway["Gateway 网关服务"]
        WS["WebSocket 服务器"]
        HTTP["HTTP 服务器"]
        NodeReg["节点注册表"]
        ChannelMgr["渠道管理器"]
    end

    subgraph ChannelLayer["消息渠道层"]
        Telegram["Telegram"]
        Slack["Slack"]
        Discord["Discord"]
        WhatsApp["WhatsApp"]
        Signal["Signal"]
        GoogleChat["Google Chat"]
        OtherChannels["其他渠道..."]
    end

    subgraph AgentLayer["智能体层"]
        AgentSystem["智能体系统"]
        Skills["技能系统"]
        Memory["记忆系统"]
        Providers["AI 提供商"]
    end

    MacApp --> WS
    IOSApp --> WS
    AndroidApp --> WS
    CLI --> WS
    WebUI --> HTTP

    WS --> Gateway
    HTTP --> Gateway
    Gateway --> NodeReg
    Gateway --> ChannelMgr

    ChannelMgr --> Telegram
    ChannelMgr --> Slack
    ChannelMgr --> Discord
    ChannelMgr --> WhatsApp
    ChannelMgr --> Signal
    ChannelMgr --> GoogleChat
    ChannelMgr --> OtherChannels

    Gateway --> AgentSystem
    AgentSystem --> Skills
    AgentSystem --> Memory
    AgentSystem --> Providers

    style Gateway fill:#7c3aed,stroke:#5b21b6,color:#fff
    style WS fill:#8b5cf6,stroke:#7c3aed,color:#fff
    style ChannelMgr fill:#8b5cf6,stroke:#7c3aed,color:#fff
    style AgentSystem fill:#10b981,stroke:#059669,color:#fff

```

### 架构原则

* **每台主机一个网关实例**: 单一职责，避免会话冲突
* **所有通信通过 WebSocket**: 使用类型化 API，支持双向通信
* **网关唯一管理平台连接**: 避免重复登录，统一状态管理
* **支持多种客户端节点**: 通过相同的 WebSocket 协议通信

---

## 核心组件

### 🎛️ Gateway Server（网关服务器）

网关的核心实现，负责协调所有子系统。
`位置: src/gateway/server.impl.ts`

* **主要职责**:
* HTTP 和 WebSocket 服务
* 节点管理和配对
* 渠道生命周期管理
* 智能体会话协调


* **关键子系统**:
* 节点注册表
* 渠道管理器
* 会话管理器
* 健康监控器



### 📡 Channel Manager（渠道管理器）

管理所有消息渠道的生命周期，包括启动、停止、健康检查。
`位置: src/gateway/server-channels.ts`

**支持的渠道**: WhatsApp, Telegram, Discord, Slack, Signal, iMessage, Google Chat, WebChat

### 🔌 渠道适配器模式

每个渠道都实现统一的适配器接口，实现消息的标准化处理。
`位置: src/channels/plugins/`

```mermaid
graph LR
    Incoming["渠道消息"] --> Normalize["消息标准化"]
    Normalize --> Router["路由系统"]
    Router --> Agent["智能体处理"]
    Agent --> Outbound["出站处理"]
    Outbound --> Format["格式化"]
    Format --> Send["发送"]

    style Normalize fill:#06b6d4,stroke:#0891b2,color:#fff
    style Router fill:#8b5cf6,stroke:#7c3aed,color:#fff
    style Outbound fill:#10b981,stroke:#059669,color:#fff

```

**ChannelOutboundAdapter 接口定义**:

```typescript
type ChannelOutboundAdapter = {
  deliveryMode: "direct" | "queue";
  chunker: (text: string) => string[];
  chunkerMode: "markdown" | "text";
  textChunkLimit: number;
  sendText: (params: SendTextParams) => Promise<SendResult>;
  sendMedia: (params: SendMediaParams) => Promise<SendResult>;
  sendPayload: (params: SendPayloadParams) => Promise<SendResult>;
};

```

### 🤖 Agent System（智能体系统）

基于 `@mariozechner/pi-agent-core` 构建，提供 AI 智能体执行和工具使用能力。
`位置: src/agents/`

* **智能体类型**: 内置智能体、自定义智能体、子智能体
* **核心功能**: 代码评估、依赖安装、沙箱执行、结果处理
* **技能系统**: 技能发现、版本管理、依赖解析、技能命令

### 📋 Node Registry（节点注册表）

管理所有连接的设备节点，处理配对和认证。
`位置: src/gateway/node-registry.ts`

* **节点类型**: macOS, iOS, Android, 无头设备

---

## 控制平面

控制平面是网关的管理和协调层，负责客户端连接、配置管理、节点管理、渠道生命周期管理、智能体交互协调和安全认证。所有这些组件都在同一个网关进程中运行，通过单一端口（默认 18789）提供服务。
`核心位置: src/gateway/`

```mermaid
graph TB
    subgraph ControlPlane["控制平面"]
        WS["WebSocket 控制/RPC API"]
        HTTP["HTTP API 端点"]
        ControlUI["Control UI 控制界面"]
        NodeMgmt["节点管理"]
        ConfigMgmt["配置管理"]
        ExecApproval["执行审批管理"]
        HealthMonitor["渠道健康监控"]
        Discovery["网关发现服务"]
        Maintenance["维护定时器"]
        Auth["认证和安全"]
        SessionMgmt["会话管理"]
        PluginSys["插件系统"]
        ModelCatalog["模型目录"]
        Wizard["向导会话"]
        Tailscale["Tailscale 集成"]
    end

    subgraph Clients["客户端"]
        MacApp["macOS 应用"]
        IOSApp["iOS 应用"]
        AndroidApp["Android 应用"]
        CLI["命令行界面"]
        WebUI["Web 界面"]
    end

    Clients --> WS
    Clients --> HTTP
    Clients --> ControlUI

    WS --> NodeMgmt
    WS --> ConfigMgmt
    WS --> SessionMgmt

    HTTP --> ControlUI
    HTTP --> Auth

    style ControlPlane fill:#fce7f3,stroke:#db2777
    style WS fill:#ec4899,stroke:#db2777,color:#fff
    style HTTP fill:#ec4899,stroke:#db2777,color:#fff
    style ControlUI fill:#ec4899,stroke:#db2777,color:#fff

```

### 控制平面核心组件

1. **WebSocket 控制/RPC API**: 提供 JSON-RPC 风格 API (`src/gateway/server-ws-runtime.ts`)
2. **Control UI**: 提供 Web 界面 (`src/gateway/control-ui.ts`)
3. **HTTP API Endpoints**: 提供 HTTP 接口 (`src/gateway/server-http.ts`)
4. **节点管理**: 配对、认证 (`src/gateway/node-registry.ts`)
5. **配置管理**: 热重载 (`src/gateway/config-reload.ts`)

---

## 网关协议

OpenClaw 使用基于 WebSocket 的自定义协议，所有通信通过类型化的 JSON 消息进行。
`位置: src/gateway/protocol/`

* **协议特性**: JSON 文本帧传输、TypeBox 模式验证、请求/响应/事件帧类型
* **帧结构**: `EventFrame`, `RequestFrame`, `ResponseFrame`, `ErrorShape`

### 协议方法分类

| 类别 | 方法 | 描述 |
| --- | --- | --- |
| **系统** | `health`, `status`, `config.*` | 健康检查、状态查询、配置管理 |
| **消息** | `send`, `chat.*` | 发送消息、聊天管理 |
| **智能体** | `agent.*`, `agents.*` | 智能体交互、管理 |
| **渠道** | `channels.*` | 渠道状态、管理 |
| **技能** | `skills.*` | 技能管理 |
| **节点** | `node.*`, `device.*` | 节点控制、设备管理 |

---

## 消息路由系统

路由系统负责将传入消息映射到适当的智能体会话，支持复杂的匹配规则。
`位置: src/routing/resolve-route.ts`

<div align="center">

```mermaid
graph TB
    Input["消息输入"] --> RouteResolve["resolveAgentRoute"]

    subgraph Priority["路由匹配优先级"]
        Direct["1.直接匹配"]
        Parent["2.父级匹配"]
        Role["3.角色匹配"]
        Guild["4.服务器/团队匹配"]
        Account["5.账户匹配"]
        Channel["6.渠道匹配"]
        Default["7.默认"]
    end

    RouteResolve --> Direct
    Direct -->|未匹配| Parent
    Parent -->|未匹配| Role
    Role -->|未匹配| Guild
    Guild -->|未匹配| Account
    Account -->|未匹配| Channel
    Channel -->|未匹配| Default

    Default --> Session["生成会话密钥"]

    style RouteResolve fill:#8b5cf6,stroke:#7c3aed,color:#fff
    style Session fill:#10b981,stroke:#059669,color:#fff

```

</div>

### 会话密钥系统

会话密钥用于持久化聊天历史、并发控制和线程管理。
`位置: src/gateway/session-utils.ts`

```mermaid
graph LR
    Params["会话参数"] --> Builder["buildAgentSessionKey"]
    Builder --> Scope{"DM 作用域"}
    Scope -->|main| Main["main - 统一会话"]
    Scope -->|per-peer| PerPeer["per-peer - 每个用户"]
    Scope -->|per-channel-peer| ChannelPeer["per-channel-peer"]
    Scope -->|per-account-channel-peer| AccountChannelPeer["per-account-channel-peer"]

    Main --> Key["生成 sessionKey"]
    PerPeer --> Key
    ChannelPeer --> Key
    AccountChannelPeer --> Key

    Key --> History["聊天历史"]
    Key --> Concurrency["并发控制"]
    Key --> Threads["线程管理"]

    style Builder fill:#8b5cf6,stroke:#7c3aed,color:#fff
    style Key fill:#10b981,stroke:#059669,color:#fff

```

---

## 消息流程

以 Telegram 为例，展示从消息接收到回复发送的完整流程。

```mermaid
sequenceDiagram
    participant User as 用户
    participant TS as Telegram服务器
    participant BH as bot-handlers.ts
    participant RR as resolve-route.ts
    participant BD as bot-message-dispatch.ts
    participant Agent as 智能体系统
    participant DL as delivery.ts
    participant TS2 as Telegram服务器
    participant User2 as 用户

    User->>TS: 发送消息
    TS->>BH: Webhook/长轮询
    activate BH
    BH->>BH: 验证允许列表
    BH->>BH: 验证用户权限
    BH->>BH: 处理媒体组
    BH->>RR: resolveAgentRoute()
    activate RR
    RR-->>BH: 返回路由结果
    deactivate RR
    BH->>BD: dispatchTelegramMessage()
    activate BD
    BD->>BD: 创建会话
    BD->>BD: 加载历史
    BD->>Agent: 发送到智能体
    activate Agent
    Agent->>Agent: 处理流式响应
    Agent-->>BD: 返回结果
    deactivate Agent
    BD->>DL: deliverReplies()
    activate DL
    DL->>TS2: 发送回复
    TS2->>User2: 消息送达
    deactivate DL
    deactivate BD
    deactivate BH

```

---

## 启动流程

网关启动时初始化所有核心服务和子系统。
`位置: src/gateway/server.impl.ts`

<div align="center">

```mermaid
graph TB
    Start(["启动网关"]) --> LoadConfig["1.加载配置"]
    LoadConfig --> InitLogs["2.初始化日志"]
    InitLogs --> LoadPlugins["3.加载插件系统"]
    LoadPlugins --> InitNodeReg["4.初始化节点注册表"]
    InitNodeReg --> CreateChannelMgr["5.创建渠道管理器"]
    CreateChannelMgr --> StartHealth["6.启动健康监控"]
    StartHealth --> StartHttp["7.启动 HTTP 服务器"]
    StartHttp --> AttachWs["8.附加 WebSocket 处理器"]
    AttachWs --> LoadChannels["9.加载配置的渠道"]
    LoadChannels --> Ready(["网关就绪"])

    style LoadConfig fill:#3b82f6,color:#fff
    style LoadPlugins fill:#8b5cf6,color:#fff
    style CreateChannelMgr fill:#10b981,color:#fff
    style StartHttp fill:#f59e0b,color:#fff
    style LoadChannels fill:#ec4899,color:#fff

```

</div>

### CLI 启动流程

`位置: src/cli/run-main.ts`

```mermaid
graph LR
    A["openclaw 命令"] --> B["加载环境变量"]
    B --> C["标准化环境"]
    C --> D["启用日志捕获"]
    D --> E["验证运行时"]
    E --> F["构建 CLI 程序"]
    F --> G["解析命令行参数"]
    G --> H{"命令类型"}
    H -->|gateway| I["启动网关"]
    H -->|channels| J["渠道管理"]
    H -->|config| K["配置管理"]
    H -->|其他| L["..."]

    style F fill:#8b5cf6,color:#fff
    style I fill:#10b981,color:#fff

```

---

## 关键架构文件总结

| 文件/目录 | 描述 |
| --- | --- |
| `src/gateway/server.impl.ts` | 网关核心实现 |
| `src/gateway/server-chat.ts` | 聊天管理 |
| `src/gateway/server-channels.ts` | 渠道管理 |
| `src/gateway/protocol/` | 协议定义 |
| `src/routing/resolve-route.ts` | 路由逻辑 |
| `src/channels/plugins/` | 渠道适配器 |
| `src/telegram/bot-handlers.ts` | Telegram 渠道实现 |
| `src/cli/program/` | CLI 架构 |
| `src/agents/` | 智能体系统 |
