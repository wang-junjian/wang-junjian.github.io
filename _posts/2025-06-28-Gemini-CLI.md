---
layout: single
title:  "Gemini CLI - 开源命令行 AI 智能体"
date:   2025-06-28 08:00:00 +0800
categories: GeminiCLI Agent
tags: [GeminiCLI, Agent, Gemini, LLM, 软件开发, Install]
---

Gemini CLI 是一个专为软件开发者设计的、由AI驱动的交互式命令行工具。作为一个智能助手，它可以直接在您的终端中帮助您完成各种软件工程任务，例如解释代码、编写新功能、修复错误和自动化工作流程。它能够理解您项目的上下文，安全地读写文件、执行命令，并与您协作，从而提高开发效率，是您开发流程中的得力伙伴。

<!--more-->

## 介绍

一个将 Gemini 强大功能直接带入你终端的开源 AI 智能体。

![](/images/2025/GeminiCLI/Gemini_CLI_infographic.width-1000.format-webp.webp)
> Gemini CLI 提供业界最高的免费使用限额，每分钟可发送 60 个模型请求，每天最多 1,000 个模型请求。

![](/images/2025/GeminiCLI/00.png)

Gemini CLI 提供了强大的 AI 功能，涵盖了从代码理解和文件操作，到命令执行和动态故障排除的方方面面。它对您的命令行体验进行了根本性的升级，让您能够通过自然语言编写代码、调试问题并简化工作流程。

其强大之处源于内置工具，使您能够：

- **使用 Google 搜索来奠定提示基础**，以便您可以抓取网页并为模型提供实时的外部上下文。
- **通过内置支持模型上下文协议 (MCP) 或捆绑扩展来扩展 Gemini CLI 的功能**。
- **自定义提示和指令**，根据您的具体需求和工作流程定制 Gemini。
- **通过在脚本中非交互式地调用 Gemini CLI，实现任务自动化并与现有工作流程集成**。


## 安装

### 安装 Node.js

- 安装最新的 LTS 版本

```bash
nvm install --lts
```

- 安装最新的稳定版本

```bash
nvm install node
```

### 安装 Gemini CLI

- 安装
```bash
npm install -g @google/gemini-cli
```

- 卸载
```bash
npm uninstall -g @google/gemini-cli
```

### 源码构建

- 克隆

```bash
git clone https://github.com/google-gemini/gemini-cli
cd gemini-cli
```

- 构建

```bash
npm run build
```

- 安装（链接你的本地版本）

在你的项目根目录运行 npm link。这会创建一个从你的全局 node_modules 目录到你本地项目目录的符号链接。

```bash
npm link
```


## 运行 Gemini CLI

### gemini

![](/images/2025/GeminiCLI/01.jpg)

![](/images/2025/GeminiCLI/02.jpg)

![](/images/2025/GeminiCLI/03.jpg)

![](/images/2025/GeminiCLI/04.jpg)

### /help
![](/images/2025/GeminiCLI/06.jpg)

### /theme
![](/images/2025/GeminiCLI/09.jpg)

### /editor
![](/images/2025/GeminiCLI/editor.png)

### /tools
```bash
ℹ Available Gemini CLI tools:

    - ReadFolder
    - ReadFile
    - SearchText
    - FindFiles
    - Edit
    - WriteFile
    - WebFetch
    - ReadManyFiles
    - Shell
    - Save Memory
    - GoogleSearch
```

### /quit
```bash
╭──────────────────────────────────────╮
│                                      │
│  Agent powering down. Goodbye!       │
│                                      │
│                                      │
│  Cumulative Stats (4 Turns)          │
│                                      │
│  Input Tokens            3,872,239   │
│  Output Tokens               5,368   │
│  Thoughts Tokens             7,595   │
│  ─────────────────────────────────   │
│  Total Tokens            3,885,202   │
│                                      │
│  Total duration (API)        6m 3s   │
│  Total duration (wall)  6h 44m 41s   │
│                                      │
╰──────────────────────────────────────╯
```

### 配置文件
```bash
~/.gemini/settings.json
```
```json
{
  "theme": "ANSI Light",
  "selectedAuthType": "oauth-personal"
}
```


## 消除警告信息

第一次运行出现警告信息：

```bash
(node:39646) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead.
(Use `node --trace-deprecation ...` to show where the warning was created)
```

- 编辑 `package.json`
```json
{
  "dependencies": {},
  "overrides": {
    "node-fetch": "^3.0.0"
  }
}
```

- 重新构建

```bash
rm package-lock.json
npm run build
```

- 安装（链接你的本地版本）

```bash
npm link
```


## 参考资料
- [gemini-cli](https://github.com/google-gemini/gemini-cli)
- [Gemini CLI: your open-source AI agent](https://blog.google/technology/developers/introducing-gemini-cli-open-source-ai-agent/)
- [How to Contribute](https://github.com/google-gemini/gemini-cli/blob/main/CONTRIBUTING.md)
- [Gemini CLI](https://developers.google.com/gemini-code-assist/docs/gemini-cli)
- [Gemini Code Assist 的运作方式](https://developers.google.com/gemini-code-assist/docs/works?hl=zh-cn)
