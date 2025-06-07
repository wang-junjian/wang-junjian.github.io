---
layout: single
title:  "MCPHub：MCP 服务器聚合平台"
date:   2025-05-26 10:00:00 +0800
categories: MCP MCPHub
tags: [MCP, MCPHub, MCPServer, GitHub, GitLab, SSE]
---

本文档介绍了 **MCPHub**，一个用于管理和扩展 **Model Context Protocol (MCP) 服务器**的聚合平台。它通过将多个 MCP 服务器组织成灵活的流式 **HTTP (SSE)** 端点来简化操作，并支持按需访问单个或分组服务器。MCPHub 提供了包括广泛服务器兼容性、集中式管理控制台、热插拔配置以及基于 **JWT** 和 **bcrypt** 的安全认证机制等核心功能，并且支持 **Docker 部署**以实现快速启动。用户可以通过其直观的 Web UI 监控服务器状态，管理访问权限，并配置 **GitHub** 或 **GitLab** 等特定服务。此外，文档还详细说明了各种可流式传输的 HTTP 和 SSE 端点，以及如何在 **MCP 客户端**（例如 **Cline**）中配置和使用 MCPHub。

<!--more-->

## [MCPHub](https://github.com/samanhappy/mcphub) 简介

MCPHub 通过将多个 MCP（Model Context Protocol）服务器组织为灵活的流式 HTTP（SSE）端点，简化了管理与扩展工作。系统支持按需访问全部服务器、单个服务器或按场景分组的服务器集合。

**🚀 功能亮点**

- 广泛的 MCP 服务器支持：无缝集成任何 MCP 服务器，配置简单。
- 集中式管理控制台：在一个简洁的 Web UI 中实时监控所有服务器的状态和性能指标。
- 灵活的协议兼容：完全支持 stdio 和 SSE 两种 MCP 协议。
- 热插拔式配置：在运行时动态添加、移除或更新服务器配置，无需停机。
- 基于分组的访问控制：自定义分组并管理服务器访问权限。
- 安全认证机制：内置用户管理，基于 JWT 和 bcrypt，实现角色权限控制。
- Docker 就绪：提供容器化镜像，快速部署。


## 配置 MCP 服务器

编辑 `mcp_settings.json` 文件，配置 `server-github` 和 `server-gitlab` 两个 MCP 服务器。

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": [
        "@modelcontextprotocol/server-github"
      ],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": ""
      }
    },
    "gitlab": {
      "command": "npx",
      "args": [
        "@modelcontextprotocol/server-gitlab"
      ],
      "env": {
        "GITLAB_PERSONAL_ACCESS_TOKEN": "",
        "GITLAB_API_URL": "https://gitlab.com/api/v4"
      }
    }
  }
}
```


## Docker 部署

```bash
docker run -p 3000:3000 -v $(pwd)/mcp_settings.json:/app/mcp_settings.json samanhappy/mcphub
```


## MCPHub 控制台

打开 http://localhost:3000，使用您的账号登录。
> 提示：默认用户名/密码为 `admin` / `admin123`。

### 登录界面

![](/images/2025/MCPHub/MCPHub-Dashboard.png)

### 服务器管理

![](/images/2025/MCPHub/MCPHub-Servers.png)

### 市场

![](/images/2025/MCPHub/MCPHub-Market.png)

### 日志

![](/images/2025/MCPHub/MCPHub-Logs.png)


## 协议
### Streamable HTTP 端点

- **Streamable HTTP 端点**: `http://localhost:3000/mcp`
- **分组 Streamable HTTP 端点**: `http://localhost:3000/mcp/{group}`
- **特定服务器 Streamable HTTP 端点**: `http://localhost:3000/mcp/{server}`

### SSE 端点

- **SSE 端点**: `http://localhost:3000/sse`
- **分组 SSE 端点**: `http://localhost:3000/sse/{group}`
- **特定服务器 SSE 端点**: `http://localhost:3000/sse/{server}`


## MCP Client
### Cline

#### 编辑 MCP 配置文件

~/Library/Application Support/Code/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json

```json
{
  "mcpServers": {
    "GitHub": {
      "autoApprove": [],
      "disabled": false,
      "timeout": 60,
      "url": "http://localhost:3000/sse",
      "transportType": "sse"
    }
  }
}
```

#### 在 Cline 中使用 MCPHub

`查看 https://github.com/wang-junjian/tictactoe 中有没有分配给我的 issue`

![](/images/2025/MCPHub/MCPHub-Cline.png)


## 参考资料
- [MCPHub GitHub](https://github.com/samanhappy/mcphub)
- [MCP - Transports](https://modelcontextprotocol.io/docs/concepts/transports)
- [GitHub MCP - Transports](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/docs/specification/2025-03-26/basic/transports.mdx)
- [HTML - Server-sent events](https://html.spec.whatwg.org/multipage/server-sent-events.html)
- [Server-Sent Events 教程](https://www.ruanyifeng.com/blog/2017/05/server-sent_events.html)
- [WIKI - Server-sent events](https://en.wikipedia.org/wiki/Server-sent_events)
- [Spring AI Alibaba](https://java2ai.com/)
- [MCP协议Streamable HTTP](https://www.cnblogs.com/xiao987334176/p/18845151)
