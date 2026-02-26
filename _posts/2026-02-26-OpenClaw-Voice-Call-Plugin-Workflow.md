---
layout: single
title:  "OpenClaw Voice Call 插件使用方法和工作流程详解"
date:   2026-02-26 18:00:00 +0800
categories: OpenClaw VoiceCall
tags: [OpenClaw, VoiceCall]
---

<!--more-->

## 一、插件概述

Voice Call 是 OpenClaw 的一个核心插件，允许用户通过 AI 助手发起和接收语音通话。它支持多种电话服务提供商（Twilio、Telnyx、Plivo），并提供两种主要通话模式：通知模式（Notify）和对话模式（Conversation）。

## 二、插件安装和配置

### 1. 安装方式

```bash
# 从 npm 安装（推荐）
openclaw plugins install @openclaw/voice-call

# 从本地开发（开发模式）
openclaw plugins install ./extensions/voice-call
cd ./extensions/voice-call && pnpm install
```

安装后需要重启 Gateway 网关。

### 2. 配置

在 `~/.openclaw/config.json5` 文件中配置插件：

```json5
{
  plugins: {
    entries: {
      "voice-call": {
        enabled: true,
        config: {
          provider: "twilio", // 或 "telnyx" | "plivo" | "mock"
          fromNumber: "+15550001234",
          toNumber: "+15550005678",
          
          // 提供商特定配置
          twilio: {
            accountSid: "ACxxxxxxxx",
            authToken: "...",
          },
          
          // Webhook 服务器配置
          serve: {
            port: 3334,
            path: "/voice/webhook",
          },
          
          // 公开访问配置（选择一种）
          publicUrl: "https://example.ngrok.app/voice/webhook",
          // 或使用隧道
          // tunnel: { provider: "ngrok" },
          // 或使用 Tailscale
          // tailscale: { mode: "funnel", path: "/voice/webhook" }
          
          // 通话模式配置
          outbound: {
            defaultMode: "notify", // notify | conversation
          },
          
          // TTS 配置（可选，覆盖全局配置）
          tts: {
            provider: "elevenlabs",
            elevenlabs: {
              voiceId: "pMsXgVXv3BLzUgSXRplE",
              modelId: "eleven_multilingual_v2",
            },
          },
        },
      },
    },
  },
}
```

## 三、通话工作流程

### 1. 插件初始化流程（Runtime Creation）

```
createVoiceCallRuntime() [runtime.ts]
├─ 解析和验证配置
├─ 选择并创建提供商实例（TwilioProvider/TelnyxProvider/PlivoProvider/MockProvider）
├─ 创建 CallManager（呼叫管理器）
├─ 创建 VoiceCallWebhookServer（Webhook 服务器）
├─ 启动 Webhook 服务器
├─ 设置隧道/公开访问（如果需要）
├─ 配置 TTS 提供商
├─ 初始化 CallManager 与提供商
└─ 返回运行时实例
```

### 2. 发起呼叫流程（Initiate Call）

```
CallManager.initiateCall() [manager.ts]
├─ 验证配置和状态
├─ 创建 CallRecord（呼叫记录）并保存到存储
├─ 调用提供商的 initiateCall() 方法
│  ├─ Twilio：使用 Twilio API 发起呼叫，可能包含内联 TwiML
│  ├─ Telnyx：使用 Telnyx API 发起呼叫
│  ├─ Plivo：使用 Plivo API 发起呼叫
│  └─ Mock：模拟呼叫（用于开发）
├─ 保存提供商返回的呼叫 ID
└─ 返回 CallId 给用户

[manager/outbound.ts]
├─ 生成 CallRecord
├─ 为通知模式生成 TwiML（如果有初始消息）
├─ 调用 provider.initiateCall()
├─ 保存呼叫状态
└─ 持久化到存储
```

### 3. 通知模式流程（Notify Mode）

通知模式用于向用户发送简短的语音通知，不需要用户回应。

```
发起呼叫（通知模式）
├─ 生成包含 <Say> 标签的 TwiML
├─ 提供商执行 TwiML（播放文本到语音）
├─ 等待配置的延迟时间（默认 2 秒）
├─ 自动挂断
└─ 结束呼叫

[manager/outbound.ts:161-274]
├─ 识别模式为通知模式
├─ 生成 TwiML 包含消息
├─ 使用 Twilio 的 <Say> 或 Plivo 的类似功能
├─ 通话结束后自动挂断
```

### 4. 对话模式流程（Conversation Mode）

对话模式允许用户与 AI 助手进行多轮对话，支持语音识别和合成。

```
发起呼叫（对话模式）
├─ 等待用户接听
├─ 播放初始消息（如果有）
├─ 切换到监听状态
├─ 识别用户语音（STT）
├─ 处理用户输入（AI 响应）
├─ 播放 AI 响应（TTS）
├─ 循环：监听 → 识别 → 处理 → 响应
└─ 结束呼叫

[manager/outbound.ts:229-380]
├─ speakInitialMessage()：播放初始消息
├─ continueCall()：继续对话
│  ├─ speak()：播放消息
│  ├─ startListening()：开始监听
│  ├─ waitForFinalTranscript()：等待最终转录
│  └─ stopListening()：停止监听
└─ endCall()：结束呼叫
```

### 5. 入站呼叫流程（Inbound Calls）

```
入站呼叫
├─ 提供商 Webhook 接收呼叫事件
├─ 验证呼叫来源（白名单检查）
├─ 播放欢迎消息
├─ 进入对话模式
├─ 处理用户输入和 AI 响应
└─ 结束呼叫

[webhook.ts]
├─ 接收 POST 请求
├─ 验证签名
├─ 规范化事件
├─ CallManager.processEvent()
├─ 路由到相应的事件处理逻辑
└─ 生成 TwiML 响应

[manager/events.ts]
├─ 处理 call.ringing 事件
├─ 处理 call.answered 事件
├─ 处理 call.hangup 事件
└─ 其他事件处理
```

### 6. 核心组件交互

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   User/CLI      │────▶│  CallManager    │────▶│  Voice Provider │
└─────────────────┘     └─────────────────┘     └─────────────────┘
         ▲                      ▲                       ▲
         │                      │                       │
         │                      │                       │
         ▼                      ▼                       ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Gateway RPC    │     │  Webhook Server │     │   TTS/STT       │
└─────────────────┘     └─────────────────┘     └─────────────────┘
         ▲                      ▲                       ▲
         │                      │                       │
         │                      │                       │
         ▼                      ▼                       ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   AI Agent      │     │  Call Store     │     │  Media Stream   │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

## 四、使用方式

### 1. CLI 命令

```bash
# 发起呼叫
openclaw voicecall call --to "+15555550123" --message "Hello from OpenClaw"

# 继续对话
openclaw voicecall continue --call-id <id> --message "Any questions?"

# 播放消息
openclaw voicecall speak --call-id <id> --message "One moment"

# 结束呼叫
openclaw voicecall end --call-id <id>

# 查看状态
openclaw voicecall status --call-id <id>

# 查看日志
openclaw voicecall tail
```

### 2. AI 助手工具

在 OpenClaw 的 AI 助手中，您可以使用 `voice_call` 工具：

```json
{
  "tool": "voice_call",
  "action": "initiate_call",
  "message": "Hello, this is a test call",
  "to": "+15555550123",
  "mode": "conversation"
}
```

## 五、关键技术细节

### 1. 媒体流处理

对于 Twilio 提供商，支持实时媒体流（Media Streaming），允许更高级的音频处理：

```typescript
// [runtime.ts:163-190]
if (provider.name === "twilio" && config.streaming?.enabled) {
  const ttsProvider = createTelephonyTtsProvider({...});
  twilioProvider.setTTSProvider(ttsProvider);
  
  const mediaHandler = webhookServer.getMediaStreamHandler();
  twilioProvider.setMediaStreamHandler(mediaHandler);
}
```

### 2. 状态管理

CallManager 负责管理所有呼叫状态：

```typescript
// [manager.ts]
export class CallManager {
  private activeCalls = new Map<CallId, CallRecord>();
  private providerCallIdMap = new Map<string, CallId>();
  private processedEventIds = new Set<string>();
  // ...
}
```

### 3. 事件处理

Webhook 服务器接收并处理提供商的事件：

```typescript
// [webhook.ts]
export class VoiceCallWebhookServer {
  async handlePost(request: Request): Promise<Response> {
    // 验证签名
    // 规范化事件
    // 处理事件
    this.manager.processEvent(event);
    // 生成响应
  }
}
```

## 六、总结

Voice Call 插件为 OpenClaw 提供了强大的语音通话功能，支持多种提供商和通话模式。它的设计遵循了 OpenClaw 的插件架构，运行在 Gateway 进程内部，并通过 Webhook 与电话服务提供商通信。核心组件包括 CallManager（呼叫管理）、VoiceCallWebhookServer（事件处理）和各种 Provider（提供商实现），它们协同工作以实现完整的语音通话流程。
让我检查一下是否还有其他相关的文档或代码需要查看，以确保我的回答是完整和准确的。


## Twilio Telnyx Plivo

这三家都是全球领先的**云通信服务提供商**（CPaaS - Communications Platform as a Service）。

简单来说，它们为开发者提供 API（接口），让企业能够通过代码实现**拨打电话、发送短信、语音验证码**等功能。

### 它们的关系与区别：

| 服务商 | 特点 |
| --- | --- |
| **Twilio** | **行业老大**。功能最全、文档最完善，是很多公司的首选，但价格通常也是最贵的。 |
| **Plivo** | **性价比之选**。直接竞争对手，通常提供比 Twilio 更便宜的语音和短信资费。 |
| **Telnyx** | **自建网络**。它们拥有自己的全球私有 IP 网络，延迟更低，在号码资源和通话质量稳定性上很有优势。 |


## 云通信商（CPaaS）是如何和电话系统连接的？

要理解 CPaaS（如 Twilio）是如何把你的**网页/代码**和全球**几十亿部电话**连在一起的，我们需要看一看它们在背后搭建的“数字桥梁”。

简单来说，CPaaS 充当了一个**翻译官**和**路由枢纽**的角色。

---

### 1. 技术层面的“三层架构”

CPaaS 的连接过程通常分为三个层级，每一层都在做不同的转换：

#### 第一层：应用接口层 (REST API / Webhooks)

* **你的动作：** 你的 AI 程序发出一个指令（比如：`POST /Calls`）。
* **CPaaS 的工作：** 它接收你的 HTTP 请求（互联网协议），验证身份，并理解你的意图（拨给谁、播放什么语音）。

#### 第二层：信令与媒体控制层 (SIP 协议)

* **核心转换：** 这是最关键的一步。CPaaS 会把你的互联网指令转换成 **SIP (Session Initiation Protocol)**。
* **作用：** SIP 是现代 VoIP（网络电话）的标准语言。它负责“呼叫”动作——让对方的电话响铃、建立连接、挂断。
* **媒体流：** 你的语音（或 AI 生成的音频）被切成无数个小数据包（RTP 包），通过网络实时传输。

#### 第三层：物理互联层 (PSTN 网关)

* **落地：** CPaaS 在全球各地的机房里，通过**数字中继线**或**物理光纤**直接连接到传统运营商（如中国联通、AT&T、沃达丰）的交换机上。
* **进入 PSTN：** 这一步将数字信号转回传统电话网（PSTN）。这样，远在千里之外一部没联网的老式座机也能收到信号并响铃。

---

### 2. 核心组件：它是靠什么“接通”的？

为了保证通话不卡顿、能拨通，CPaaS 背后有几样核心武器：

1. **VoIP 网关 (Gateways)：** 就像翻译机，把互联网的 0 和 1 转换成电话线的电信号。
2. **软交换 (Softswitches)：** 智能导航员。如果你拨打一个英国号码，CPaaS 会自动寻找离英国最近的节点出局，以降低延迟。
3. **号码池 (DID)：** CPaaS 拥有数以百万计的真实电话号码（DID），当你拨号时，它会给你的呼叫分配一个“主叫号码”，让对方手机上显示出具体的数字。

---

### 3. 一个通话的完整生命周期（以 AI 拨号为例）

1. **发起：** 你的 AI 系统通过 API 告诉 Twilio：“拨打 138xxxx，并朗读这段文本”。
2. **转换：** Twilio 的服务器把文本转成语音文件，并启动 **SIP 邀请**。
3. **路由：** Twilio 发现这是中国号码，通过私有光纤将信号传给中国当地的合作伙伴（运营商）。
4. **振铃：** 目标手机收到基站信号，开始响铃。
5. **通话：** 对方接听后，语音通过 **WebRTC** 或 **RTP** 协议在你的服务器和手机之间实时双向传输。

---

### 4. 为什么不直接连运营商，而非要用 CPaaS？

如果没有 CPaaS，你想做个自动拨号系统，你得：

* 跑去移动/电信机房拉线。
* 自己买几十万的硬件交换机。
* 自己写极其复杂的底层通信协议（C++ / C 语言级别）。

**CPaaS 的价值在于：** 它把这些脏活累活都干了，只给你留了一个**简单的网址 (API Endpoint)**。


## 云通信服务提供商和传统通信服务提供商的区别

简单来说，**“云通信” (CPaaS)** 与 **“传统通信”** 的区别，就像是**“刷卡消费”**与**“开一家银行”**的区别。

以下是它们核心差异的深度对比：

### 1. 接入方式：代码 vs. 硬件

* **云通信 (Twilio/Plivo/Telnyx)：** 它是**基于 API** 的。开发者只需要写几行代码（调用接口），就能实现拨打电话的功能。不需要买交换机，不需要拉电话线，一切都在云端完成。
* **传统通信 (中国电信/AT&T/移动)：** 传统方式通常需要**物理接入**。比如企业需要购买大量的网关设备、交换机（PBX），并与运营商签署复杂的物理链路协议。

---

### 2. 灵活性与扩展性

* **云通信：** 极其灵活。你今天想拨 1 个电话，明天想拨 10,000 个，云平台会自动帮你扩容。**按需付费**，用多少花多少。
* **传统通信：** 扩展缓慢。如果你发现线路不够用了，可能需要增加物理板卡或申请新的中继线（E1/数字电路），流程长且有固定成本。

---

### 3. 功能集成度

* **云通信：** 它是“乐高式”的。你可以轻松地把电话功能和你的 **CRM（如 Salesforce）**、**AI 机器人** 或 **数据库** 串联起来。
* **传统通信：** 往往是闭环的。如果你想在传统电话线基础上加一个“AI 自动语音转文字”功能，通常需要额外购买极其昂贵的第三方软件和硬件集成包。

---

### 4. 核心差异对比表

| 特性 | 云通信 (CPaaS) | 传统通信 (Telco/Carrier) |
| --- | --- | --- |
| **主要客户** | 软件开发者、互联网企业 | 传统大企业、呼叫中心 |
| **部署时间** | 几分钟（拿到 API Key 即可） | 几周甚至几个月 |
| **收费模式** | 按分钟/按条计费 (Pay-as-you-go) | 月租 + 固定套餐 + 硬件维护费 |
| **技术门槛** | 需要懂编程 (Python/JS/Java) | 需要懂通信工程 (硬件维护) |
| **全球覆盖** | 一个账号即可全球拨号 | 通常受地域限制，跨国业务极难 |

---

### 总结

* **传统通信商**是“基建狂魔”，他们负责在地底下埋光缆、盖基站。
* **云通信商**（如你图中的三家）是“超级中间商”，他们把底层复杂的通信能力包装成简单的**软件接口**卖给你。

**如果你是想开发一个 AI 自动拨号系统，选择“云通信”是唯一的方案，因为 AI 必须通过代码来控制电话的接听与挂断。**


## 参考资料
- [The Ultimate Guide: Connecting Twilio, Plivo, and Telnyx to AICaller](https://aicaller.io/how-to-connect-twilio-plivo-telnyx-to-aicaller)
