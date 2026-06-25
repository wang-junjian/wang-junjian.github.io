---
type: article
title:  "集成个人助手（OpenClaw｜Hermes）的方式"
date:   2026-05-07 08:00:00 +0800
tags: [OpenClaw, Hermes, 聊天软件, GLM]
---

## 聊天软件集成 OpenClaw 的方式

聊天软件要集成 OpenClaw，主要有这几类方式（可以组合）：
1. **用 OpenClaw 自带的“Channel 插件”直连（推荐，最省事）**  
   - Telegram、WhatsApp、Discord、Slack、飞书/Lark、钉钉、Teams、Google Chat、Mattermost、Matrix、IRC、LINE、Signal、iMessage 等。  
   - 在 OpenClaw 的初始化或 `openclaw channels add` 里直接选通道、按向导配置即可。  
   - 本质上是：各 IM 的 **Bot API / Webhook / Socket Mode / QR 扫码** 对接到 OpenClaw 的 Gateway。初始化向导里可以看到支持的通道清单。
2. **通用 HTTP 接口集成（适合任意聊天平台）**  
   - OpenClaw 的 Gateway 提供了一个 HTTP 端点 `/tools/invoke`，可以调用单个工具（例如创建会话、发消息、拉取历史等），支持 Bearer 认证和 OpenAI 兼容的 `/v1/*` 风格接口。  
   - 你的聊天软件后端只要能发 HTTP POST，就可以用这个接口和 OpenClaw 交互。
3. **Gateway WS 协议集成（适合需要实时双向通信的场景）**  
   - OpenClaw 使用 Gateway WS 协议作为控制面+传输，所有客户端（CLI、Web UI、App 等）都走这个协议。  
   - 如果你想自己写一个聊天前端或桥接层，可以直接按 Gateway WS 协议接入。
4. **Webhook 入站集成（事件驱动）**  
   - OpenClaw 内置 Webhook 能力，可以接收外部系统推送的事件；社区教程也演示了如何通过 Webhook 接收任意第三方系统请求。  
   - 很多 IM 本身就支持“收到消息 → 发 Webhook”，你把这些 Webhook 转发给 OpenClaw 即可。
5. **通过自动化/ iPaaS 平台“曲线集成”（n8n、Zapier、腾讯云/阿里云云函数等）**  
   - 比如用 n8n：邮件 → HTTP Request 调 OpenClaw API → 飞书通知，已经有人实践过。  
   - 适合需要把 IM 和内部系统（工单、CRM、邮件等）串起来的复杂场景。
---
### 1. 用 OpenClaw 自带 Channel 插件直连（最常用）
**原理：**  
OpenClaw 是“自托管网关+多通道 Agent 平台”，已经把常见聊天软件的接入做成了内置通道或插件，你只要按向导配置 Bot Token / Webhook / QR 码即可。
**典型流程：**
1. 部署并启动 OpenClaw（本地或云主机）。  
2. 在初始化或 `openclaw configure` / `openclaw channels add` 里选择要接入的通道，例如：  
   - Telegram（Bot API）  
   - WhatsApp（QR pairing）  
   - Discord（Bot API）  
   - Slack（Socket Mode 或 HTTP Events API）  
   - Feishu/Lark（飞书）  
   - Microsoft Teams（Bot Framework）  
   - Mattermost、Matrix、IRC、Google Chat、Signal、iMessage、LINE 等。  
3. 按提示在目标聊天平台创建 Bot、填 Token / Webhook URL / App Token 等参数。  
4. 启动 Gateway（`openclaw gateway restart`）并验证。
**适合：**  
- 目标聊天平台在 OpenClaw 支持列表内，且你希望**快速把 AI 能力接入现成 IM**。
---
### 2. 通用 HTTP 接口集成（任意聊天软件）
**原理：**  
Gateway 提供了一个始终启用的 HTTP 端点 `POST /tools/invoke`，用于直接调用单个工具，支持 Gateway 级别的认证与权限控制。
**关键信息：**
- 端点：`http://<host>:<port>/tools/invoke`（与 Gateway WS 共用端口）  
- 认证方式：  
  - Bearer Token（`gateway.auth.token` / `OPENCLAW_GATEWAY_TOKEN`）  
  - 或 Password（`gateway.auth.password`）  
  - 或无认证（仅建议在私有网络/入口使用）  
- 支持通过 HTTP 头传递上下文，例如：  
  - `x-openclaw-message-channel: slack` / `telegram` 等  
  - `x-openclaw-account-id`（多账号时）  
- 请求体示例（列出会话）：  
  ```json
  {
    "tool": "sessions_list",
    "action": "json",
    "args": {},
    "sessionKey": "main",
    "dryRun": false
  }
  ```
**集成方式：**
- 在你的聊天软件后端：
  1. 维护 OpenClaw 的地址与 Token；  
  2. 收到聊天消息时，调用 `/tools/invoke` 触发 OpenClaw 的对话/任务工具；  
  3. 把返回结果格式化后发回聊天通道。
**适合：**
- 想把 **自研聊天 App/后台** 接到 OpenClaw；  
- 使用 OpenClaw 做统一的 AI 能力网关，前端聊天系统只负责展示和收发消息。
---
### 3. Gateway WS 协议集成（前端/实时集成）
**原理：**  
OpenClaw 的所有客户端（CLI、Web UI、桌面/移动端 App）都使用统一的 **Gateway WS 协议** 作为控制面+传输。  
**集成方式：**
- 按官方 Gateway 协议规范，实现一个 WebSocket 客户端（JS/Flutter/桌面/Electron 等），连接到 Gateway；  
- 使用协议定义的消息类型进行会话管理、消息收发、工具调用等；  
- 再在你的聊天 UI 里只渲染消息和会话状态。
**适合：**
- 自建聊天前端，希望与 OpenClaw 有**更细粒度的实时交互**（比如实时打字、多轮工具调用状态展示）。
---
### 4. Webhook 入站集成（事件驱动）
**原理：**
- OpenClaw 内置 Webhook 支持，社区教程也有“day10-webhooks”的实战：通过内置的轻量 HTTP 服务端接收任何第三方系统 Webhook。  
- 官方 Webhooks 插件还提供了带认证的 HTTP 路由，把外部事件绑定到 OpenClaw 的 TaskFlow。
**集成方式：**
1. 在聊天平台侧配置：  
   - 消息事件 → 发送到你的 Webhook（例如 `https://your-domain/webhook`）。  
2. 在你的服务端（或 OpenClaw 自带的 Webhook 服务端）：
   - 接收 Webhook，格式化成 OpenClaw 需要的事件结构；  
   - 转发给 OpenClaw（HTTP 或 WS），触发 Agent 回复/执行任务；  
   - 再把结果推回聊天平台（通过平台提供的 Bot API）。
**适合：**
- IM 平台只提供“事件 Webhook”而不是 Bot API，或者你希望**把多个 IM 统一接到同一个 OpenClaw 实例**。
---
### 5. 通过自动化 / iPaaS 平台集成（n8n/Zapier/云函数等）
**原理：**
- OpenClaw 提供了 HTTP API，自动化工具可以直接调用。  
- 腾讯云社区有教程演示：n8n 工作流中用“HTTP Request”节点调用 OpenClaw API，再触发飞书通知等。
**集成方式：**
- 在 n8n / Zapier / 腾讯云函数 / 阿里云云函数等：  
  - 创建一个“聊天消息触发器”（例如飞书机器人收到消息、Slack Event、微信/企微 Webhook）；  
  - 用 HTTP Request 节点调用 OpenClaw 的 `/tools/invoke` 或兼容的 `/v1/*` 接口；  
  - 把返回结果发回 IM 或其他业务系统。
**适合：**
- 需要**快速串联多个系统**（IM + 邮件 + 工单 + 数据库）的场景；  
- 不想写太多后端代码，用低代码平台打通即可。
---
### 6. 选型建议（怎么选最适合你的方式）
- **如果你用的 IM 是：Slack / Telegram / Discord / WhatsApp / 飞书 / Teams / Mattermost / Matrix / IRC / LINE / Google Chat 等**  
  → 优先用 **OpenClaw 自带 Channel 插件**，按向导配置即可。
- **如果你用的是自研聊天 App，或者想统一做多 IM AI 网关**  
  → 用 **Gateway HTTP `/tools/invoke` + Gateway WS 协议**，自己写一层薄后端桥接。
- **如果你的 IM 只提供 Webhook 事件**  
  → 用 **Webhook 入站 + OpenClaw Webhook 插件**，做事件到 Agent 的映射。
- **如果你需要跨系统自动化（IM+邮件+工单+CRM 等）**  
  → 用 **n8n / iPaaS + OpenClaw HTTP API**。


## 聊天软件集成 Hermes Agent 的方式

**Hermes Agent** 是 Nous Research 的开源项目，它自带 Gateway 与消息通道适配，并暴露 OpenAI 兼容 HTTP 接口，可以很自然地和各类“聊天软件/聊天前端”集成。

聊天软件要接入 Hermes Agent，常见有 5 条路：
1. **Gateway + 内置消息通道**
  - **支持平台**：Telegram、Discord、Slack、WhatsApp、Signal、飞书/Lark、企业微信、微信、钉钉等
  - **配置命令**：`hermes gateway setup` 或 `hermes platform add`
2. **OpenAI兼容HTTP API**
  - **API端点**：`http://localhost:8642/v1` 提供标准Chat Completions接口
  - **特性支持**：支持流式SSE和多模态
  - **前端兼容**：可直接被Open WebUI、LobeChat等前端使用
3. **Webhook适配器**
  - **端口**：默认8644端口接收POST请求
  - **路由功能**：支持将响应路由到不同平台(deliver字段)
4. **自建薄代理网关**
  - **架构模式**：聊天软件 ⇄ 代理网关 ⇄ Hermes OpenAI API
  - **优势**：可在代理层实现限流、审计、prompt改写等功能
5. **插件机制**
  - **扩展能力**：支持自定义平台适配器，放在`~/.hermes/plugins/`目录
  - **开发自由度**：无需修改主仓库代码即可扩展新平台
---
### 1. 用 Gateway + 内置消息通道（最直接）
- Hermes 的 Gateway 是一个常驻网关进程，负责和各个聊天平台对接：Telegram、Discord、Slack、WhatsApp、Signal、飞书/Lark、企业微信 WeCom、微信 Weixin、DingTalk（钉钉）、QQBot、元宝、Mattermost、Matrix、Email、SMS、Home Assistant 等（官方/社区文档有“18 个内置平台”的说法）。
- 典型接入步骤：
  - 安装 Hermes：`curl -fsSL https://raw.githubusercontent.com/NousResearch/hermes-agent/main/scripts/install.sh | bash`；
  - 在 `~/.hermes/.env` 配好 LLM 提供商与密钥，以及各平台凭证（飞书 App ID/Secret、微信扫码/Weixin、WeCom、Telegram Bot Token、DingTalk 等）；
  - 启动网关：`hermes gateway`；
  - 用向导完成：`hermes gateway setup` 选对应平台（飞书/Lark、Weixin/WeChat、WeCom 等），按提示填凭证或扫码。
- 通道层面有两种常见连接模式（以飞书为例，其他平台类似）：
  - WebSocket（推荐）：Hermes 主动连出站，不需要你暴露公网 Webhook；
  - Webhook：Hermes 在本地起一个 HTTP 端点，聊天平台把事件推过来。
- 适用场景
  - 你要接的平台在 Hermes 官方支持列表内，并且希望“开箱即用”。  
  - 微信/企业微信/钉钉/飞书/Telegram 等国内/国际常见 IM。
---
### 2. 用 OpenAI 兼容 HTTP API（通用方案）
Hermes 自带“API Server”，可以把整个 Agent 暴露为标准 OpenAI 格式的 HTTP 接口，地址形如 `http://localhost:8642/v1`：
- 配置启用（`~/.hermes/.env`）：
  - `API_SERVER_ENABLED=true`
  - `API_SERVER_KEY=your-secret-key`（Bearer 令牌）
  - 可选调整 `API_SERVER_PORT`、`API_SERVER_HOST`。
- 启动网关：`hermes gateway`。
- 核心能力：
  - `POST /v1/chat/completions`：标准的 Chat Completions，支持多模态、图片（`image_url`）；
  - 支持流式 SSE，并扩展了 `hermes.tool.progress` 等事件，方便前端展示工具执行进度；
  - 会话由 `messages` 数组传入，是无状态的 HTTP 接口；
  - 端点完全兼容 OpenAI 协议，可直接被 Open WebUI、LobeChat、LibreChat、NextChat、ChatBox 等当作后端使用。
接入方式示例  
- 把聊天软件里的“LLM Provider”设置为 OpenAI 兼容，并填入：
  - Base URL：`http://your-hermes-host:8642/v1`；
  - API Key：你设的 `API_SERVER_KEY`；
  - 模型名：`hermes-agent`（文档中默认模型名）。
适用场景  
- 任何“支持自定义 OpenAI Base URL”的聊天前端/软件；  
- 已有自研聊天客户端，希望快速接入能力更强的 Agent 后端；  
- 多个聊天界面（Web、桌面、移动）共享同一个 Hermes 实例。
---
### 3. 用通用 Webhook 适配器（事件驱动）
如果你的聊天软件只支持 Webhook（例如：收到消息/被@时触发回调），可以用 Hermes 的 Webhook 适配器统一接收：
- Hermes 的 Webhook 适配器是一个内置 HTTP 服务，默认端口 8644，接收 POST 请求，验证 HMAC 签名，把 payload 转成“给 Agent 的提示”，并支持将响应路由到另一个平台（deliver 字段，如 Telegram、Discord、Slack、飞书、企业微信、微信、QQ 等）。
- 配置要点：
  - 在 `~/.hermes/.env` 或 `config.yaml` 中启用 Webhook 平台并设置全局密钥（`WEBHOOK_ENABLED=true`、`WEBHOOK_PORT`、`WEBHOOK_SECRET`）；
  - 为不同来源定义“路由”（routes）：如 `github-pr`、`jira-issue` 等，每个路由可设置：
    - `events`：事件类型过滤；
    - `prompt`：模板字符串，从 payload 中取字段；
    - `deliver`：Agent 执行完后把结果发到哪个平台；
    - `deliver_extra`：指定目标会话/PR 等信息；
    - `skills`：本次触发要使用的技能列表。
- 接收路径形如：`http://your-server:8644/webhooks/<route-name>`。
适用场景  
- 聊天软件本身只支持 Webhook 事件（比如企业微信自建应用的“接收消息”回调、飞书事件订阅、GitHub/GitLab/JIRA 事件等）；  
- 你希望把“IM 消息/工单/PR 评论”统一接入 Hermes 做自动化处理。
---
### 4. 自建薄代理网关（适合没有原生集成，又不想写插件）
如果你的“聊天软件”既不在 Hermes 官方通道列表，也不支持直接配 OpenAI Base URL，可以自己在中间搭一层：
- 架构示意：
  - 聊天软件 ⇄ 你的代理网关（HTTP/WS/Webhook） ⇄ Hermes 的 OpenAI 兼容 API。
- 做法要点：
  - 代理网关实现：
    - 接收聊天软件的事件/消息；
    - 转成 `/v1/chat/completions` 请求发给 Hermes（带 Bearer `API_SERVER_KEY`）；
    - 把 Hermes 的回复（支持 SSE）回写到聊天软件；
  - 代理网关可以是一个简单的后端服务（Node.js/Python/Go 等）或 Serverless 函数。
- 好处：
  - 聊天软件侧只需要暴露你自己的代理接口，安全性更好；
  - 可以在代理层做限流、审计、改写 prompt、用户白名单等。
适用场景  
- 自研聊天 App/小程序/桌面端；  
- 需要统一审计、鉴权、改造的封闭环境。
---
### 5. 走插件机制自己写一个平台适配器
Hermes 支持插件：可以把自定义的平台适配器放在 `~/.hermes/plugins/`，无需改主仓库：
- 插件体系支持自定义工具、命令、钩子、仪表盘页签，以及“网关平台”；
- 如果你使用的 IM 有 SDK/协议，可以按 Hermes 的适配器接口写一个平台适配器，实现：
  - 收发消息、媒体；
  - 文件/语音/图片处理；
  - 会话与上下文管理。
适用场景  
- 特殊/内部 IM 协议、私有聊天系统；  
- 需要深度定制（比如特殊权限模型、复杂消息类型）的团队。
---
### 一个简单的选型建议
- 先看：目标聊天平台是否在 Hermes 内置通道列表（飞书/企业微信/微信/钉钉/Telegram/Discord/Slack/WhatsApp/Signal/Matrix/Mattermost/QQ 等）→ 有就用 Gateway 内置通道，最省心。
- 再看：目标聊天前端是否支持“自定义 OpenAI Base URL”→ 直接用 Hermes 的 OpenAI 兼容 API。
- 如果只支持 Webhook：用 Hermes 的 Webhook 平台做事件驱动集成。
- 如果是自研/私有 IM：自建薄代理网关或写平台插件。
