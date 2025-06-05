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

#### 序列图

![](/images/2025/MCPHubSmart/MCPClient-MCPHub-MCPServer-Mermaid.png)

```mermaid
sequenceDiagram
    participant MCP Client
    participant MCPHub

    MCP Client->>MCPHub: 建立 SSE 连接 (sessionId: 882c527f...)
    MCPHub-->>MCP Client: 连接成功

    MCP Client->>MCPHub: ListToolsRequest
    MCPHub-->>MCP Client: 返回可用工具列表

    MCP Client->>MCPHub: CallToolRequest (search_tools, query: "time")
    MCPHub-->>MCP Client: 返回搜索结果（get_current_time, convert_time 等）

    MCP Client->>MCPHub: CallToolRequest (call_tool, get_current_time)
    MCPHub->>Time MCP Server: 调用 get_current_time 工具
    Time MCP Server-->>MCPHub: 返回当前时间（Asia/Shanghai）
    MCPHub-->>MCP Client: 返回工具执行结果

    MCP Client->>MCPHub: 断开 SSE 连接
    MCPHub-->>MCP Client: 连接关闭确认
```

上面的序列图展示了 MCP 客户端如何通过 MCPHub 与 MCP 服务器进行交互，使用智能路由来获取相关工具并执行操作。

#### 日志

```
[16:09:04]info主 (29)New SSE connection established: 882c527f-910b-4cbd-b405-ade42c4298a8 with group: $smart
[16:09:04]info主 (29)Received message for sessionId: 882c527f-910b-4cbd-b405-ade42c4298a8 in group: $smart
[16:09:04]info主 (29)Handling ListToolsRequest for group: $smart
[16:10:24]info主 (29)Received message for sessionId: 882c527f-910b-4cbd-b405-ade42c4298a8 in group: $smart
[16:10:24]info主 (29)Handling CallToolRequest for tool: {"name":"search_tools","arguments":{"query":"time","limit":5}}
[16:10:24]info主 (29)Using similarity threshold: 0.2 for query: "time"
[16:10:25]info主 (29)Search results: [{"serverName":"time","toolName":"get_current_time","description":"Get current time in a specific timezones","inputSchema":{"type":"object","properties":{"timezone":{"type":"string","description":"IANA timezone name (e.g., 'America/New_York', 'Europe/London'). Use 'Asia/Shanghai' as local timezone if no timezone provided by the user."}},"required":["timezone"]},"similarity":0.5920422430063725,"searchableText":"get_current_time Get current time in a specific timezones required timezone"},{"serverName":"time","toolName":"convert_time","description":"Convert time between timezones","inputSchema":{"type":"object","properties":{"source_timezone":{"type":"string","description":"Source IANA timezone name (e.g., 'America/New_York', 'Europe/London'). Use 'Asia/Shanghai' as local timezone if no source timezone provided by the user."},"time":{"type":"string","description":"Time to convert in 24-hour format (HH:MM)"},"target_timezone":{"type":"string","description":"Target IANA timezone name (e.g., 'Asia/Tokyo', 'America/San_Francisco'). Use 'Asia/Shanghai' as local timezone if no target timezone provided by the user."}},"required":["source_timezone","time","target_timezone"]},"similarity":0.5888808614682648,"searchableText":"convert_time Convert time between timezones required source_timezone time target_timezone"},{"serverName":"playwright","toolName":"browser_wait_for","description":"Wait for text to appear or disappear or a specified time to pass","inputSchema":{"type":"object","properties":{"time":{"type":"number","description":"The time to wait in seconds"},"text":{"type":"string","description":"The text to wait for"},"textGone":{"type":"string","description":"The text to wait for to disappear"}},"additionalProperties":false,"$schema":"http://json-schema.org/draft-07/schema#"},"similarity":0.5436626892693012,"searchableText":"browser_wait_for Wait for text to appear or disappear or a specified time to pass additionalProperties $schema time text textGone"},{"serverName":"playwright","toolName":"browser_type","description":"Type text into editable element","inputSchema":{"type":"object","properties":{"element":{"type":"string","description":"Human-readable element description used to obtain permission to interact with the element"},"ref":{"type":"string","description":"Exact target element reference from the page snapshot"},"text":{"type":"string","description":"Text to type into the element"},"submit":{"type":"boolean","description":"Whether to submit entered text (press Enter after)"},"slowly":{"type":"boolean","description":"Whether to type one character at a time. Useful for triggering key handlers in the page. By default entire text is filled in at once."}},"required":["element","ref","text"],"additionalProperties":false,"$schema":"http://json-schema.org/draft-07/schema#"},"similarity":0.4687798181539846,"searchableText":"browser_type Type text into editable element required additionalProperties $schema element ref text submit slowly"},{"serverName":"playwright","toolName":"browser_navigate_forward","description":"Go forward to the next page","inputSchema":{"type":"object","properties":{},"additionalProperties":false,"$schema":"http://json-schema.org/draft-07/schema#"},"similarity":0.4322801570725354,"searchableText":"browser_navigate_forward Go forward to the next page additionalProperties $schema"}]
[16:10:42]info主 (29)Received message for sessionId: 882c527f-910b-4cbd-b405-ade42c4298a8 in group: $smart
[16:10:42]info主 (29)Handling CallToolRequest for tool: {"name":"call_tool","arguments":{"toolName":"get_current_time","arguments":{"timezone":"Asia/Shanghai"}}}
[16:10:42]info主 (29)Invoking tool 'get_current_time' on server 'time' with arguments: {"timezone":"Asia/Shanghai"}
[16:10:42]info主 (29)Tool invocation result: {"content":[{"type":"text","text":"{\n  \"timezone\": \"Asia/Shanghai\",\n  \"datetime\": \"2025-06-05T16:10:42+08:00\",\n  \"is_dst\": false\n}"}],"isError":false}
[16:15:45]info主 (29)SSE connection closed: 882c527f-910b-4cbd-b405-ade42c4298a8
```

#### 智能路由返回的工具列表

```json
[
  {
    "serverName": "time",
    "toolName": "get_current_time",
    "description": "Get current time in a specific timezones",
    "inputSchema": {
      "type": "object",
      "properties": {
        "timezone": {
          "type": "string",
          "description": "IANA timezone name (e.g., 'America/New_York', 'Europe/London'). Use 'Asia/Shanghai' as local timezone if no timezone provided by the user."
        }
      },
      "required": [
        "timezone"
      ]
    },
    "similarity": 0.5920422430063725,
    "searchableText": "get_current_time Get current time in a specific timezones required timezone"
  },
  {
    "serverName": "time",
    "toolName": "convert_time",
    "description": "Convert time between timezones",
    "inputSchema": {
      "type": "object",
      "properties": {
        "source_timezone": {
          "type": "string",
          "description": "Source IANA timezone name (e.g., 'America/New_York', 'Europe/London'). Use 'Asia/Shanghai' as local timezone if no source timezone provided by the user."
        },
        "time": {
          "type": "string",
          "description": "Time to convert in 24-hour format (HH:MM)"
        },
        "target_timezone": {
          "type": "string",
          "description": "Target IANA timezone name (e.g., 'Asia/Tokyo', 'America/San_Francisco'). Use 'Asia/Shanghai' as local timezone if no target timezone provided by the user."
        }
      },
      "required": [
        "source_timezone",
        "time",
        "target_timezone"
      ]
    },
    "similarity": 0.5888808614682648,
    "searchableText": "convert_time Convert time between timezones required source_timezone time target_timezone"
  },
  {
    "serverName": "playwright",
    "toolName": "browser_wait_for",
    "description": "Wait for text to appear or disappear or a specified time to pass",
    "inputSchema": {
      "type": "object",
      "properties": {
        "time": {
          "type": "number",
          "description": "The time to wait in seconds"
        },
        "text": {
          "type": "string",
          "description": "The text to wait for"
        },
        "textGone": {
          "type": "string",
          "description": "The text to wait for to disappear"
        }
      },
      "additionalProperties": false,
      "$schema": "http://json-schema.org/draft-07/schema#"
    },
    "similarity": 0.5436626892693012,
    "searchableText": "browser_wait_for Wait for text to appear or disappear or a specified time to pass additionalProperties $schema time text textGone"
  },
  {
    "serverName": "playwright",
    "toolName": "browser_type",
    "description": "Type text into editable element",
    "inputSchema": {
      "type": "object",
      "properties": {
        "element": {
          "type": "string",
          "description": "Human-readable element description used to obtain permission to interact with the element"
        },
        "ref": {
          "type": "string",
          "description": "Exact target element reference from the page snapshot"
        },
        "text": {
          "type": "string",
          "description": "Text to type into the element"
        },
        "submit": {
          "type": "boolean",
          "description": "Whether to submit entered text (press Enter after)"
        },
        "slowly": {
          "type": "boolean",
          "description": "Whether to type one character at a time. Useful for triggering key handlers in the page. By default entire text is filled in at once."
        }
      },
      "required": [
        "element",
        "ref",
        "text"
      ],
      "additionalProperties": false,
      "$schema": "http://json-schema.org/draft-07/schema#"
    },
    "similarity": 0.4687798181539846,
    "searchableText": "browser_type Type text into editable element required additionalProperties $schema element ref text submit slowly"
  },
  {
    "serverName": "playwright",
    "toolName": "browser_navigate_forward",
    "description": "Go forward to the next page",
    "inputSchema": {
      "type": "object",
      "properties": {},
      "additionalProperties": false,
      "$schema": "http://json-schema.org/draft-07/schema#"
    },
    "similarity": 0.4322801570725354,
    "searchableText": "browser_navigate_forward Go forward to the next page additionalProperties $schema"
  }
]
```

## 参考资料
- [MCPHub GitHub](https://github.com/samanhappy/mcphub)
- [MCPHub 文档：获取资源](https://github.com/samanhappy/mcphub/blob/main/docs/zh/api-reference/endpoint/get.mdx)
- [MCPHub API 参考](https://github.com/samanhappy/mcphub/blob/main/docs/zh/api-reference/introduction.mdx)
