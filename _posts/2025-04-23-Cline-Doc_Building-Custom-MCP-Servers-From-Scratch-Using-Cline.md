---
layout: single
title:  "使用 Cline 从零开始构建自定义 MCP 服务器：综合指南"
date:   2025-04-23 12:00:00 +0800
categories: ClineDoc MCPServer
tags: [Cline, MCP, MCPServer, ClineDoc]
---

# [使用 Cline 从零开始构建自定义 MCP 服务器：综合指南](https://github.com/cline/cline/blob/main/docs/mcp/mcp-server-from-scratch.md)

本指南提供了使用 Cline 的强大 AI 功能从零开始构建自定义 MCP (Model Context Protocol) 服务器的全面演示。示例将通过构建一个"GitHub 助手服务器"来说明这个过程。

## 理解 MCP 和 Cline 在构建服务器中的作用

### 什么是 MCP？

模型上下文协议(MCP)充当了像 Claude 这样的大型语言模型(LLMs)与外部工具和数据之间的桥梁。MCP 包含两个关键组件：

- **MCP 主机：** 这些是与 LLMs 集成的应用程序，如 Cline、Claude Desktop 等。
- **MCP 服务器：** 这些是专门设计用于通过 MCP 向 LLMs 公开数据或特定功能的小型程序。

当你有一个 MCP 兼容的聊天界面(如 Claude Desktop)时，这种设置很有用，因为它可以利用这些服务器来访问信息和执行操作。

### 为什么使用 Cline 创建 MCP 服务器？

Cline 通过利用其 AI 功能简化了构建和集成 MCP 服务器的过程：

- **理解自然语言指令：** 你可以用自然的方式与 Cline 交流，使开发过程直观且用户友好。
- **克隆代码库：** Cline 可以直接从 GitHub 克隆现有的 MCP 服务器代码库，简化使用预构建服务器的过程。
- **构建服务器：** 一旦必要的代码就位，Cline 可以执行像 `npm run build` 这样的命令来编译和准备服务器。
- **处理配置：** Cline 管理 MCP 服务器所需的配置文件，包括将新服务器添加到 `cline_mcp_settings.json` 文件中。
- **协助故障排除：** 如果在开发或测试过程中出现错误，Cline 可以帮助确定原因并提出解决方案，使调试更容易。

## 使用 Cline 构建 GitHub 助手服务器：分步指南

本节演示如何使用 Cline 创建一个 GitHub 助手服务器。这个服务器将能够与 GitHub 数据交互并执行有用的操作：

### 1. 确定目标和初始需求

首先，你需要向 Cline 清楚地传达你的服务器的目的和功能：

- **服务器目标：** 告诉 Cline 你想要构建一个"GitHub 助手服务器"。说明这个服务器将与 GitHub 数据交互，并可能提到你感兴趣的数据类型，如问题、拉取请求和用户资料。
- **访问要求：** 让 Cline 知道你需要访问 GitHub API。说明这可能需要一个个人访问令牌(GITHUB_TOKEN)进行身份验证。
- **数据具体性（可选）：** 你可以选择告诉 Cline 你想从 GitHub 提取的特定数据字段，但这也可以在后续定义服务器工具时确定。

### 2. Cline 启动项目设置

基于你的指令，Cline 开始项目设置过程：

- **项目结构：** Cline 可能会询问你的服务器名称。之后，它使用 MCP `create-server` 工具为你的 GitHub 助手服务器生成基本项目结构。这通常包括创建一个新目录，其中包含基本文件如 package.json、`tsconfig.json` 和用于 TypeScript 代码的 `src` 文件夹。
- **代码生成：** Cline 为你的服务器生成启动代码，包括：
  - **文件处理实用工具：** 帮助读写文件的函数，通常用于存储数据或日志。
  - **GitHub API 客户端：** 与 GitHub API 交互的代码，通常使用 `@octokit/graphql` 等库。
  - **核心服务器逻辑：** 处理来自 Cline 的请求并将其路由到适当函数的基本框架。
- **依赖管理：** Cline 分析代码并识别必要的依赖项，将它们添加到 package.json 文件中。
- **依赖安装：** Cline 执行 `npm install` 来下载和安装 package.json 中列出的依赖项。
- **路径修正：** 在开发过程中，Cline 会智能识别文件或目录的移动，并自动更新代码中的文件路径。
- **配置：** Cline 将修改 `cline_mcp_settings.json` 文件以添加你的新 GitHub 助手服务器。

### 3. 测试 GitHub 助手服务器

一旦 Cline 完成设置和配置，你就可以测试服务器的功能：

- **使用服务器工具：** Cline 将在你的服务器中创建各种"工具"，代表动作或数据检索功能。
- **提供必要信息：** Cline 可能会提示你提供执行工具所需的额外信息。
- **Cline 执行工具：** Cline 处理与 GitHub API 的通信，检索请求的数据，并以清晰易懂的格式呈现。

### 4. 完善服务器和添加更多功能

开发通常是迭代的过程。随着你使用 GitHub 助手服务器，你会发现需要添加新功能或改进现有功能：

- **与 Cline 讨论：** 与 Cline 讨论你对新工具或改进的想法。
- **代码完善：** Cline 可以帮助你编写新功能所需的代码。
- **测试新功能：** 添加新工具或功能后，使用 Cline 进行测试。
- **与其他工具集成：** 你可能想要将你的 GitHub 助手服务器与其他工具集成。

通过遵循这些步骤，你可以使用 Cline 从零开始创建自定义 MCP 服务器，利用其强大的 AI 功能来简化整个过程。Cline 不仅协助服务器构建的技术方面，还帮助你思考设计、功能和潜在的集成。
