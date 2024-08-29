---
layout: post
title:  "Cursor 使用指南"
date:   2024-08-29 08:00:00 +0800
categories: Cursor AICodingAssistant
tags: [Cursor, GitHubCopilot]
---

## 安装与配置

### 安装
访问 [Cursor](https://www.cursor.com/) 官网，下载并安装 Cursor。

### 本地运行 Ollama 服务

复制模型 `codestral:22b` 并命名为 `gpt-3.5-turbo`。
```bash
ollama cp codestral:22b gpt-3.5-turbo
```

运行 Ollama 服务。
```bash
ollama serve
```

### 配置
运行 Cursor，打开 Cursor 设置。

#### Rules for AI
让模型使用中文回复。

![](/images/2024/Cursor/cursor-settings-rules.png)

#### OpenAI API
配置 OpenAI Base URL: `http://127.0.0.1:11434/v1`。

![](/images/2024/Cursor/cursor-settings-openai.png)

#### 模型选择
在 Cursor 的聊天窗口中选择模型 `gpt-3.5`。


## 功能
![](/images/2024/Cursor/Features-Cursor-The-AI-first-Code-Editor.png)


## 使用

### 使用 Codebase
![](/images/2024/Cursor/using-codebase.png)

`Final Codebase Context` 使用了 `100` 个 `代码块`。

![](/images/2024/Cursor/using-codebase-context-files.png)

对于 `大主题` （多维度）的问题，使用更多的 `代码块` 会更有帮助。

![](/images/2024/Cursor/multi-dimensional.png)

### 代码聊天与编辑器互动
![](/images/2024/Cursor/chat-fuse-code1.png)

![](/images/2024/Cursor/chat-fuse-code2.png)

![](/images/2024/Cursor/chat-fuse-code3.png)

![](/images/2024/Cursor/chat-fuse-code4.png)
