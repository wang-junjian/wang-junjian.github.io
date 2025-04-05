---
layout: post
title:  "Continue Agent 使用 GitHub MCP Server"
date:   2025-04-03 10:00:00 +0800
categories: Continue MCPServer
tags: [Continue, MCPServer, AICodingAssistant, GitHubCopilot]
---

## Continue 智能体
- 必须使用 `Agent` 模式才支持 `MCP Server`。
- `Agent` 模式不支持 DeepSeek 系列的模型（包括`官方API`和`开源`）。
- 大模型使用本地 `Ollama` 的模型：`qwen2.5-coder:32b` 和 `qwq:latest`。


## 申请 GitHub 个人访问令牌（Personal Access Token）

- 访问 `GitHub` 的 `Settings` 页面，点击 `Developer settings`。
- 点击 `Personal access tokens`，然后点击 `Tokens (classic)`。
- 点击 `Generate new token` 按钮。

![](/images/2025/ContinueGitHubMCPServer/GitHubCreateToken.png)

![](/images/2025/ContinueGitHubMCPServer/GitHubDefineScopes.png)


## Continue 配置

`config.yaml` 文件配置如下：

```yaml
name: Local Assistant
version: 1.0.0
schema: v1
models:
  - name: Autodetect
    provider: ollama
    model: AUTODETECT
  - name: DeepSeek Chat
    provider: deepseek
    model: deepseek-chat
    apiKey: sk-xxx
  - name: DeepSeek Coder
    provider: deepseek
    model: deepseek-coder
    apiKey: sk-xxx
  - name: DeepSeek Reasoner
    provider: deepseek
    model: deepseek-reasoner
    apiKey: sk-xxx
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
      - -y
      - "@modelcontextprotocol/server-github"
    env:
      GITHUB_PERSONAL_ACCESS_TOKEN: ghp_xxx
```

### MCP（GitHub Server）

![](/images/2025/ContinueGitHubMCPServer/MCPServers.png)

### 模型配置：Ollama

![](/images/2025/ContinueGitHubMCPServer/ModelConfigOllama.png)

### 模型配置：DeepSeek
![](/images/2025/ContinueGitHubMCPServer/ModelConfigDeepSeek.png)


## 创建仓库

在 `GitHub` 上创建一个新的仓库，命名为 `RAGFlowAssistant`。

`提示词：`创建仓库: RAGFlowAssistant

![](/images/2025/ContinueGitHubMCPServer/AgentCreateRepository1.png)

![](/images/2025/ContinueGitHubMCPServer/AgentCreateRepository2.png)

到 GitHub 上查看创建的仓库：

![](/images/2025/ContinueGitHubMCPServer/AgentCreateRepository3.png)


## 查找仓库地址

![](/images/2025/ContinueGitHubMCPServer/search_repositories1.png)

![](/images/2025/ContinueGitHubMCPServer/search_repositories2.png)


## 代码评审

![](/images/2025/ContinueGitHubMCPServer/list_commits1.png)

![](/images/2025/ContinueGitHubMCPServer/list_commits2.png)


## Tool Output

![](/images/2025/ContinueGitHubMCPServer/ToolOutput.png)
