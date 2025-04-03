---
layout: post
title:  "MCP Inspector"
date:   2025-04-03 09:00:00 +0800
categories: MCP MCPServer
tags: [MCP, MCPServer, MCPInspector, GitHub]
---

## 安装 Node.js 环境

```bash
brew install node
```

## 调试 GitHub MCP Server

```bash
export GITHUB_PERSONAL_ACCESS_TOKEN=github_pat_XXX
npx @modelcontextprotocol/inspector npx -y @modelcontextprotocol/server-github
```

## 用户界面

运行浏览器，访问 URL：http://127.0.0.1:6274/

![](/images/2025/ContinueGitHubMCPServer/MCPInspector.png)


## 参考资料
- [GitHub MCP Server](https://github.com/modelcontextprotocol/servers/tree/main/src/github)
- [MCP Inspector](https://modelcontextprotocol.io/docs/tools/inspector)
