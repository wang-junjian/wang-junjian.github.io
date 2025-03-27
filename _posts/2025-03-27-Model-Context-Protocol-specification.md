---
layout: post
title:  "Model Context Protocol 规范"
date:   2025-03-27 08:00:00 +0800
categories: MCP LLM
tags: [MCP, LLM]
---

## 协议修订版本：2025-03-26

[Model Context Protocol](https://modelcontextprotocol.io)（MCP）是一个开放协议，它使 LLM 应用程序与外部数据源和工具之间能够无缝集成。无论您是构建 AI 驱动的 IDE、增强聊天界面，还是创建自定义 AI 工作流，MCP 都提供了一种标准化的方式来连接 LLM 与它们所需的上下文。

本规范基于 [schema.ts](https://github.com/modelcontextprotocol/specification/blob/main/schema/draft/schema.ts) 中的 TypeScript 模式，定义了权威的协议要求。

有关实现指南和示例，请访问 [modelcontextprotocol.io](https://modelcontextprotocol.io)。

## 概述

MCP 为应用程序提供了标准化的方式来：

- 与语言模型共享上下文信息
- 向 AI 系统公开工具和功能
- 构建可组合的集成和工作流

该协议使用 [JSON-RPC](https://www.jsonrpc.org/) 2.0 消息在以下组件之间建立通信：

- **主机（Hosts）**：发起连接的 LLM 应用程序
- **客户端（Clients）**：主机应用程序内的连接器
- **服务器（Servers）**：提供上下文和功能的服务

MCP 部分受到 [Language Server Protocol](https://microsoft.github.io/language-server-protocol/) 的启发，后者标准化了如何在整个开发工具生态系统中添加对编程语言的支持。类似地，MCP 标准化了如何将额外的上下文和工具集成到 AI 应用程序的生态系统中。

## 关键细节

### 基础协议

- [JSON-RPC](https://www.jsonrpc.org/) 消息格式
- 有状态连接
- 服务器和客户端能力协商

### 功能

服务器向客户端提供以下任何功能：

- **资源（Resources）**：供用户或 AI 模型使用的上下文和数据
- **提示（Prompts）**：为用户提供的模板化消息和工作流
- **工具（Tools）**：供 AI 模型执行的函数

客户端可以向服务器提供以下功能：

- **采样（Sampling）**：服务器发起的主动行为和递归 LLM 交互

### 其他实用工具

- 配置
- 进度跟踪
- 取消
- 错误报告
- 日志记录

## 安全和信任与安全

Model Context Protocol 通过任意数据访问和代码执行路径启用强大的功能。随之而来的是所有实现者必须仔细解决的重要安全和信任考虑。

### 关键原则

1. **用户同意和控制**

   - 用户必须明确同意并理解所有数据访问和操作
   - 用户必须保留对共享哪些数据和采取哪些行动的控制权
   - 实现者应提供清晰的界面，用于审查和授权活动

2. **数据隐私**

   - 主机必须在向服务器公开用户数据前获得用户明确同意
   - 未经用户同意，主机不得将资源数据传输到其他地方
   - 用户数据应受到适当访问控制的保护

3. **工具安全**

   - 工具代表任意代码执行，必须谨慎对待
     - 特别是，除非从受信任的服务器获得，否则应将工具行为描述（如注释）视为不受信任的
   - 主机必须在调用任何工具前获得用户明确同意
   - 用户应在授权使用前了解每个工具的功能

4. **LLM 采样控制**
   - 用户必须明确批准任何 LLM 采样请求
   - 用户应控制：
     - 是否进行采样
     - 将发送的实际提示
     - 服务器可以看到哪些结果
   - 该协议有意限制服务器对提示的可见性

### 实施指南

虽然 MCP 本身无法在协议层面强制执行这些安全原则，但实现者**应该**：

1. 在其应用程序中构建健壮的同意和授权流程
2. 提供安全影响的清晰文档
3. 实施适当的访问控制和数据保护
4. 在其集成中遵循安全最佳实践
5. 在功能设计中考虑隐私影响


## 参考资料
- [Model Context Protocol specification](https://spec.modelcontextprotocol.io/specification/2025-03-26/)
