---
layout: single
title:  "Cline Documentation"
date:   2025-04-24 12:00:00 +0800
categories: ClineDoc
tags: [Cline, ClineDoc]
---

# Cline 文档目录

欢迎阅读 Cline 文档 - 这是一份全面的指南，帮助您使用和扩展 Cline 的功能。在这里，您可以找到帮助您入门、提升技能和为项目做出贡献的资源。

## 入门指南

- **编程新手？** 我们为您准备了温和的入门指南：
  - 编程新手入门指南

## 提升提示工程技能

- **想要更有效地与 Cline 沟通？** 请探索：
  - 提示工程指南
  - Cline 记忆库

## 探索 Cline 的工具

- **了解 Cline 的功能：**
  - [Cline 工具指南](tools/cline-tools-guide.md)
  - [Mentions 功能指南](tools/mentions-guide.md)

- **使用 MCP 服务器扩展 Cline：**
  - [MCP 概述](mcp/README.md)
  - [从 GitHub 构建 MCP 服务器](mcp/mcp-server-from-github.md)
  - [构建自定义 MCP 服务器](mcp/mcp-server-from-scratch.md)

## 为 Cline 做贡献

- **有兴趣做出贡献？** 我们欢迎您的参与：
  - 欢迎提交拉取请求
  - 贡献指南

## 其他资源

- **Cline GitHub 仓库：** [https://github.com/cline/cline](https://github.com/cline/cline)
- **MCP 文档：** [https://modelcontextprotocol.org/docs](https://modelcontextprotocol.org/docs)

我们一直在努力改进这份文档。如果您有建议或发现需要改进的地方，请告诉我们。您的反馈有助于让 Cline 变得更好。


# Cline 入门指南 | 新手程序员

欢迎使用 Cline！本指南将帮助你完成设置并开始使用 Cline 构建你的第一个项目。

## 你需要准备的东西

在开始之前，请确保你具备以下条件：

- **VS Code：** 一个免费且功能强大的代码编辑器。
  - [下载 VS Code](https://code.visualstudio.com/)
- **开发工具：** 基础的编程软件（Homebrew、Node.js、Git 等）。
  - 在完成这里的设置后，请参考我们的`安装基本开发工具`指南，通过 Cline 的帮助来完成这些设置
  - Cline 将指导你安装所需的一切
- **Cline 项目文件夹：** 一个专门存放所有 Cline 项目的文件夹。
  - macOS：在你的文档文件夹中创建一个名为 "Cline" 的文件夹
    - 路径：`/Users/[你的用户名]/Documents/Cline`
  - Windows：在你的文档文件夹中创建一个名为 "Cline" 的文件夹
    - 路径：`C:\Users\[你的用户名]\Documents\Cline`
  - 在这个 Cline 文件夹内，为每个项目创建单独的文件夹
    - 示例：`Documents/Cline/workout-app` 用于健身追踪应用
    - 示例：`Documents/Cline/portfolio-website` 用于个人作品集
- **VS Code 中的 Cline 扩展：** 在 VS Code 中安装 Cline 扩展。

- 这里有一个[教程视频](https://www.youtube.com/watch?v=N4td-fKhsOQ)，介绍了入门所需的所有内容。

## 分步设置指南

按照以下步骤设置 Cline：

1. **打开 VS Code：** 启动 VS Code 应用程序。如果 VS Code 显示"运行扩展可能..."的提示，点击"允许"。

2. **打开你的 Cline 文件夹：** 在 VS Code 中，打开你在文档中创建的 Cline 文件夹。

3. **导航到扩展：** 点击 VS Code 侧边栏中的扩展图标。

4. **搜索 'Cline'：** 在扩展搜索栏中输入 "Cline"。

5. **安装扩展：** 点击 Cline 扩展旁边的"安装"按钮。

6. **打开 Cline：** 安装完成后，你可以通过以下几种方式打开 Cline：
   - 点击活动栏中的 Cline 图标。
   - 使用命令面板（`CMD/CTRL + Shift + P`）并输入 "Cline: Open In New Tab" 在编辑器中打开 Cline 标签页。推荐这种方式以获得更好的视图。
   - **故障排除：** 如果你看不到 Cline 图标，请尝试重启 VS Code。
   - **预期效果：** 你应该能看到 Cline 聊天窗口出现在 VS Code 编辑器中。

![gettingStartedVsCodeCline](https://github.com/user-attachments/assets/622b4bb7-859b-4c2e-b87b-c12e3eabefb8)

## 设置 OpenRouter API 密钥

现在你已经安装了 Cline，你需要设置 OpenRouter API 密钥以使用 Cline 的全部功能。

1. **获取 OpenRouter API 密钥：**
   - [获取你的 OpenRouter API 密钥](https://openrouter.ai/)
2. **输入你的 OpenRouter API 密钥：**
   - 导航到 Cline 扩展中的设置按钮。
   - 输入你的 OpenRouter API 密钥。
   - 选择你偏好的 API 模型。
     - **推荐的编程模型：**
       - `anthropic/claude-3.5-sonnet`：最常用于编程任务。
       - `google/gemini-2.0-flash-exp:free`：免费的编程选项。
       - `deepseek/deepseek-chat`：超级便宜，几乎和 3.5 sonnet 一样好
     - [OpenRouter 模型排名](https://openrouter.ai/rankings/programming)

## 你的第一次 Cline 互动

现在你已经准备好开始使用 Cline 构建项目了。让我们创建你的第一个项目文件夹并开始构建！将以下提示复制并粘贴到 Cline 聊天窗口中：

```
嗨 Cline！你能帮我在 Cline 目录中创建一个名为 "hello-world" 的新项目文件夹，并制作一个显示蓝色大字"Hello World"的简单网页吗？
```

**预期效果：** Cline 将帮助你创建项目文件夹并设置你的第一个网页。

## 使用 Cline 的技巧

- **提问：** 如果你对某事不确定，不要犹豫，直接问 Cline！
- **使用截图：** Cline 可以理解图片，所以随时可以使用截图向他展示你在做什么。
- **复制粘贴错误：** 如果遇到错误，将错误消息复制粘贴到 Cline 的聊天中。这将帮助他理解问题并提供解决方案。
- **使用简单语言：** Cline 被设计为可以理解普通的、非技术性的语言。请随意用你自己的话描述你的想法，Cline 会将它们转换为代码。

## 常见问题

- **什么是终端？** 终端是一个用于与计算机交互的基于文本的界面。它允许你运行命令来执行各种任务，如安装包、运行脚本和管理文件。Cline 使用终端来执行命令并与你的开发环境交互。
- **代码库是如何工作的？**（此部分将根据新手程序员的常见问题进行扩展）

## 仍然遇到困难？

随时联系我，我会帮助你开始使用 Cline。

nick | 608-558-2410

加入我们的 Discord 社区：[https://discord.gg/cline](https://discord.gg/cline)


# Cline 扩展架构

## 扩展架构图

![](/images/2025/ClineDoc/extension-architecture.png)

上面展示 Cline 扩展高级架构的 Mermaid 图表。该图表说明了：

1. **核心扩展**
   - 扩展入口点和主要类
   - 通过 VSCode 的全局状态和密钥存储进行状态管理
   - Cline 类中的核心业务逻辑

2. **Webview UI**
   - 基于 React 的用户界面
   - 通过 ExtensionStateContext 进行状态管理
   - 组件层次结构

3. **存储**
   - 任务特定的历史记录和状态存储
   - 基于 Git 的文件变更检查点系统

4. **数据流**
   - 核心扩展组件间的数据流
   - Webview UI 数据流
   - 核心与 webview 之间的双向通信

## 配色方案

图表使用高对比度配色方案以提高可见性：
- 粉色 (#ff0066)：全局状态和密钥存储组件
- 蓝色 (#0066ff)：扩展状态上下文
- 绿色 (#00cc66)：Cline 提供者
- 所有组件都使用白色文本以获得最佳可读性
