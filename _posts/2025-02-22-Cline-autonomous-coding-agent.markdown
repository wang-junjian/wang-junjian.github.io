---
layout: post
title:  "Cline: 自主编程助手"
date:   2025-02-22 10:00:00 +0800
categories: Cline AICodingAssistant
tags: [Cline, Agent, Ollama, LLM, GitHubCopilot]
---

## 开发

### 克隆仓库

```bash
git clone https://github.com/cline/cline.git
```

### 打开项目

```bash
code cline
```

### 安装依赖

```bash
npm run install:all
```

### 安装扩展 esbuild-problem-matchers

如果构建项目时遇到问题，请安装 esbuild problem matchers 扩展。

```bash
Activating task providers npm
错误: problemMatcher 引用无效: $esbuild-watch
```

### 启动

打开 `运行和调试` 侧边栏，运行 `Run Extension`，或者按 `F5` 键启动调试，打开一个新的 VSCode 窗口，加载扩展。


## 配置

### 配置模型 Ollama

![](/images/2025/Cline/Setting-Ollama.png)
