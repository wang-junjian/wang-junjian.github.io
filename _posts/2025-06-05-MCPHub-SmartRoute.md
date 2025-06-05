---
layout: post
title:  "MCPHub 智能路由"
date:   2025-06-05 08:00:00 +0800
categories: MCP MCPHub
tags: [MCP, MCPHub, MCPServer, GitHub, GitLab, SSE， SmartRoute]
---

## [MCPHub](https://github.com/samanhappy/mcphub)


## 部署 MCPHub（智能路由）

### mcp_settings.json

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": [
        "@playwright/mcp@latest",
        "--headless"
      ]
    },
    "fetch": {
      "command": "uvx",
      "args": [
        "mcp-server-fetch"
      ]
    },
    "github": {
      "command": "npx",
      "args": [
        "@modelcontextprotocol/server-github"
      ],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_xxx"
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
      },
      "enabled": false
    },
    "time": {
      "command": "uvx",
      "args": [
        "mcp-server-time",
        "--local-timezone=Asia/Shanghai"
      ],
      "env": {},
      "enabled": true
    }
  },
  "users": [
    {
      "username": "admin",
      "password": "$2b$10$hPTLF",
      "isAdmin": true
    }
  ],
  "systemConfig": {
    "routing": {
      "enableGlobalRoute": true,
      "enableGroupNameRoute": true,
      "enableBearerAuth": false,
      "bearerAuthKey": ""
    },
    "install": {
      "pythonIndexUrl": "",
      "npmRegistry": ""
    },
    "smartRouting": {
      "enabled": true,
      "dbUrl": "postgresql://mcphub:your_password@mcphub-postgres:5432/mcphub",
      "openaiApiBaseUrl": "https://api.siliconflow.cn/v1",
      "openaiApiKey": "sk-xxx",
      "openaiApiEmbeddingModel": "BAAI/bge-m3"
    }
  }
}
```

### docker-compose.yml

```yaml
version: '3.8'

services:
  mcphub-postgres:
    image: pgvector/pgvector:pg17
    container_name: mcphub-postgres
    environment:
      POSTGRES_DB: mcphub
      POSTGRES_USER: mcphub
      POSTGRES_PASSWORD: your_password
    ports:
      - "5432:5432"
    volumes:
      - ./postgres:/var/lib/postgresql/data # 持久化 PostgreSQL 数据

  mcphub:
    image: samanhappy/mcphub
    container_name: mcphub
    ports:
      - "3000:3000"
    volumes:
      - ./mcp_settings.json:/app/mcp_settings.json
    depends_on:
      - mcphub-postgres # 确保 mcphub-postgres 启动后再启动 mcphub
    environment:
      # 在这里更新 dbUrl，使用 mcphub-postgres 作为主机名
      MCPHUB_DB_URL: postgresql://mcphub:your_password@mcphub-postgres:5432/mcphub
```

### 启动服务

```bash
mkdir postgres
```

```bash
docker-compose up -d
```


## MCPHub 配置

### MCPHub 控制面板

![](/images/2025/MCPHubSmart/MCPHub-Dashboard.png)

### MCPHub 服务器管理

![](/images/2025/MCPHubSmart/MCPHub-Servers.png)

### MCPHub 设置（智能路由）

![](/images/2025/MCPHubSmart/MCPHub-Settings-SmartRoute.png)


## 智能路由端点
- **Streamable HTTP 端点：** `http://localhost:3000/mcp/$smart`
- **SSE 端点：** `http://localhost:3000/sse/$smart`


## [DeepChat](https://github.com/ThinkInAIXYZ/deepchat)（MCP 客户端）

### MCP 设置

![](/images/2025/MCPHubSmart/DeepChat-MCPSettings.png)

### 添加 MCP 服务器

![](/images/2025/MCPHubSmart/DeepChat-MCPSettings-AddServer.png)

### 启用 MCP

![](/images/2025/MCPHubSmart/DeepChat-MCPEnable.png)

### 获取 GitHub 代码仓库的 Issues

![](/images/2025/MCPHubSmart/SmartRoute-GitHub.png)

### 当前时间

![](/images/2025/MCPHubSmart/SmartRoute-CurrentTime.png)


## 参考资料
- [MCPHub GitHub](https://github.com/samanhappy/mcphub)
- [MCP - Transports](https://modelcontextprotocol.io/docs/concepts/transports)
- [GitHub MCP - Transports](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/docs/specification/2025-03-26/basic/transports.mdx)
- [HTML - Server-sent events](https://html.spec.whatwg.org/multipage/server-sent-events.html)
- [Server-Sent Events 教程](https://www.ruanyifeng.com/blog/2017/05/server-sent_events.html)
- [WIKI - Server-sent events](https://en.wikipedia.org/wiki/Server-sent_events)
- [Spring AI Alibaba](https://java2ai.com/)
- [MCP协议Streamable HTTP](https://www.cnblogs.com/xiao987334176/p/18845151)
