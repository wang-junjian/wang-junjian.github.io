---
layout: post
title:  "MCPHub 智能路由"
date:   2025-06-05 08:00:00 +0800
categories: MCP MCPHub
tags: [MCP, MCPHub, MCPServer, GitHub, GitLab, SSE， SmartRoute]
---

## 什么是智能路由

智能路由是 MCPHub 的核心功能之一。

### 技术原理

它将每个 MCP 工具的名称和描述嵌入为高维语义向量。当用户发起自然语言任务请求时，系统会将该请求也转换为向量，通过计算相似度，快速返回最相关的工具列表。

这一过程摒弃了传统的关键词匹配，具备更强的语义理解能力，能够处理自然语言的模糊性和多样性。

### 核心组件

- **向量嵌入引擎**：支持如 `text-embedding-3-small`、`bge-m3` 等主流模型，将文本描述转为语义向量。
- **PostgreSQL + pgvector**：使用开源向量数据库方案，支持高效的向量索引和搜索。
- **两步工作流分离**：
  - `search_tools`：负责语义工具发现
  - `call_tool`：执行实际工具调用逻辑

## 为什么需要智能路由

### 1. 减少认知负荷

- 当工具数量超过 100 个，AI 模型难以处理所有工具上下文。
- 智能路由通过语义压缩，将候选工具缩小至 5～10 个，提高决策效率。

### 2. 显著降低 token 消耗

- 传统做法传入全量工具描述，可能消耗上千 token。
- 使用智能路由，通常可将 token 使用降低 70～90%。

### 3. 提升调用准确率

- 理解任务语义：如“图片增强”→选择图像处理工具，而不是依赖命名关键词。
- 上下文感知：考虑输入/输出格式和工具组合能力，匹配更合理的执行链路。


## 部署 [MCPHub](https://github.com/samanhappy/mcphub)（智能路由）

### 编辑 MCP 配置文件：`mcp_settings.json`

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

`smartRouting` 的配置可以在 MCPHub 控制台中进行修改。

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

在已部署 PostgreSQL，可直接创建数据库并启用 `pgvector` 扩展：

```sql
CREATE DATABASE mcphub;
CREATE EXTENSION vector;
```

### 创建 PostgreSQL 数据目录

```bash
mkdir postgres
```

### 启动服务

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
