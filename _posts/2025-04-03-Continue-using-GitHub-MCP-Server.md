---
layout: post
title:  "Continue 使用 GitHub MCP Server"
date:   2025-04-03 10:00:00 +0800
categories: Continue MCPServer
tags: [Continue, MCPServer, AICodingAssistant, GitHubCopilot]
---

## Continue 智能体
- 必须使用 `Agent` 模式才支持 `MCP Server`。
- `Agent` 模式不支持推理模型。
- 大模型使用本地 `Ollama` 的 `qwen2.5-coder:32b` 模型。

## Continue 配置

config.yaml

```yaml
name: Local Assistant
version: 1.0.0
schema: v1
models:
  - name: Autodetect
    provider: ollama
    model: AUTODETECT
context:
  - provider: code
  - provider: docs
  - provider: diff
  - provider: terminal
  - provider: problems
  - provider: folder
  - provider: codebase
mcpServers:
  - name: GitHub Server
    command: npx
    args:
      - "-y"
      - "@modelcontextprotocol/server-github"
    env:
      GITHUB_PERSONAL_ACCESS_TOKEN: github_pat_XXX
```

## 查找仓库地址

![](/images/2025/ContinueGitHubMCPServer/search_repositories1.png)

![](/images/2025/ContinueGitHubMCPServer/search_repositories2.png)

## 代码评审

![](/images/2025/ContinueGitHubMCPServer/list_commits1.png)

![](/images/2025/ContinueGitHubMCPServer/list_commits2.png)

## Tool Output

![](/images/2025/ContinueGitHubMCPServer/ToolOutput.png)
