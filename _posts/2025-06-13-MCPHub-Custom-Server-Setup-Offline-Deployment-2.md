---
layout: single
title:  "MCPHub 自定义服务器配置及内网部署（二）"
date:   2025-06-13 08:00:00 +0800
categories: MCP MCPHub
tags: [MCP, MCPHub, MCPServer, mcp-server-time, pypiserver, Python, 离线, 内网部署]
---

本文档指导用户**构建一个本地 PyPI 源**，以便持久化存储 Python 包并进行离线安装。接着，文档**说明了自定义 MCPHub 配置**，包括定义 MCP 服务器市场中的服务（例如：mcp-server-time）以及调整 MCPHub 自身的运行时设置，例如指定本地 PyPI 源和用户认证信息。

<!--more-->

- [MCPHub 自定义服务器配置及内网部署（一）]({% post_url 2025-06-12-MCPHub-Custom-Server-Setup-Offline-Deployment %})
- [MCPHub 自定义服务器配置及内网部署（二）]({% post_url 2025-06-13-MCPHub-Custom-Server-Setup-Offline-Deployment-2 %})

## 架构图

![](/images/2025/MCPHub/Custom/mcphub-pypiserver-mermaid.png)

```mermaid
graph TD
    subgraph Docker Host
        A[Local PyPI Server] -->|Serves| B[MCPHub]
        B -->|Stores Data| C[PostgreSQL]
        B -->|Reads Config| D[Custom Config Files]
    end

    subgraph A[Local PyPI Server]
        A1[pypiserver Container] --> A2[./pypi_packages Volume]
    end

    subgraph B[MCPHub]
        B1[mcphub Container] --> B2[Registry Volume]
        B1 --> B3[servers.json]
        B1 --> B4[mcp_settings.json]
        B1 --> B5[pip.conf]
    end

    subgraph C[PostgreSQL]
        C1[pgvector Container] --> C2[./postgres Volume]
    end

    subgraph D[Custom Config Files]
        D1[servers.json] --> D2[Server Marketplace]
        D3[mcp_settings.json] --> D4[Runtime Settings]
        D5[pip.conf] --> D6[PyPI Config]
    end

    A -->|Fallback to| E[Official PyPI]
    B -->|Depends On| A
    B -->|Depends On| C
```

## 搭建本地 PyPI 源
### 拉取 pypiserver 镜像

```bash
docker pull pypiserver/pypiserver
```

### 创建存储 Python 包的目录

Docker 容器是隔离的，容器内的数据默认会随着容器的删除而丢失。为了持久化你的 Python 包，你需要将宿主机上的一个目录挂载到容器内部。

```bash
mkdir pypi_packages
```

### 下载 mcp-server-time 及其依赖包

```bash
pip download mcp-server-time --dest ./pypi_packages
```

### 运行 pypiserver 容器

```bash
docker run -d \
  --name pypiserver \
  -v ./pypi_packages:/data/packages \
  -p 8080:8080 \
  pypiserver/pypiserver:latest \
  run /data/packages
```

-  `--fallback-url https://pypi.org/simple/`： 这个参数指定了一个回退的 PyPI 源地址，当本地服务器找不到某个包时，会尝试从这个地址获取。

### 安装时指定本地 PyPI 源

```bash
pip install --index-url http://localhost:8080/simple/ mcp-server-time
```


## 搭建本地 npm 源

### 拉取 Verdaccio 镜像

```bash
docker pull verdaccio/verdaccio
```

### 创建目录结构

在本地创建一个目录结构来存储 Verdaccio 的配置文件、插件和存储数据。

```bash
mkdir -p ./custom/verdaccio/conf
mkdir -p ./custom/verdaccio/plugins
mkdir -p ./custom/verdaccio/storage
```

### 创建配置文件

编辑文件 `verdaccio/conf/config.yaml`。
> 可以拷贝文件 [https://github.com/verdaccio/verdaccio/blob/5.x/conf/docker.yaml](https://github.com/verdaccio/verdaccio/blob/5.x/conf/docker.yaml) 的内容到 `config.yaml` 中，并根据需要进行修改。

```yaml
storage: /verdaccio/storage/data
plugins: /verdaccio/plugins

web:
  title: Verdaccio

auth:
  htpasswd:
    file: /verdaccio/storage/htpasswd

uplinks:
  npmjs:
    url: https://registry.npmjs.org/

packages:
  '@*/*':
    # scoped packages
    access: $all
    publish: $all
    unpublish: $authenticated
    proxy: npmjs

  '**':
    access: $all
    publish: $authenticated
    unpublish: $authenticated
    proxy: npmjs

server:
  keepAliveTimeout: 60

middlewares:
  audit:
    enabled: true

log: { type: stdout, format: pretty, level: http }
```

- **access: $all** - 允许所有用户访问所有包。
- **publish: $all** - 允许所有用户发布包。
- **proxy: npmjs** - 如果本地没有找到包，则从 npmjs 上代理请求。


## 自定义 MCPHub 配置

### 配置 MCP 服务器市场 (`custom/servers.json`)

```json
{
  "time": {
    "name": "time",
    "display_name": "Time",
    "description": "A Model Context Protocol server that provides time and timezone conversion capabilities. It automatically detects the system's timezone and offers tools for getting current time and converting between timezones.",
    "repository": {
      "type": "git",
      "url": "https://github.com/modelcontextprotocol/servers"
    },
    "homepage": "https://github.com/modelcontextprotocol/servers/tree/main/src/time#readme",
    "author": {
      "name": "MCP Team"
    },
    "license": "MIT",
    "categories": [
      "System Tools"
    ],
    "tags": [
      "time",
      "timezone",
      "date",
      "converter"
    ],
    "arguments": {
      "TZ": {
        "description": "Environment variable to override the system's default timezone",
        "required": false,
        "example": "America/New_York"
      }
    },
    "installations": {
      "uvx": {
        "type": "uvx",
        "command": "uvx",
        "args": [
          "mcp-server-time",
          "--local-timezone=Asia/Shanghai"
        ],
        "description": "Install and run using uvx (recommended)",
        "recommended": true
      }
    },
    "tools": [
      {
        "name": "get_current_time",
        "description": "Get current time in a specific timezones",
        "inputSchema": {
          "type": "object",
          "properties": {
            "timezone": {
              "type": "string",
              "description": "IANA timezone name (e.g., 'America/New_York', 'Europe/London'). Use local timezone if no timezone provided by the user."
            }
          },
          "required": [
            "timezone"
          ]
        }
      },
      {
        "name": "convert_time",
        "description": "Convert time between timezones",
        "inputSchema": {
          "type": "object",
          "properties": {
            "source_timezone": {
              "type": "string",
              "description": "Source IANA timezone name (e.g., 'America/New_York', 'Europe/London'). Use local timezone if no source timezone provided by the user."
            },
            "time": {
              "type": "string",
              "description": "Time to convert in 24-hour format (HH:MM)"
            },
            "target_timezone": {
              "type": "string",
              "description": "Target IANA timezone name (e.g., 'Asia/Tokyo', 'America/San_Francisco'). Use local timezone if no target timezone provided by the user."
            }
          },
          "required": [
            "source_timezone",
            "time",
            "target_timezone"
          ]
        }
      }
    ],
    "examples": [
      {
        "title": "Current time",
        "description": "Get the current time in a specific timezone",
        "prompt": "What time is it in Tokyo right now?"
      },
      {
        "title": "Time conversion",
        "description": "Convert time between timezones",
        "prompt": "Convert 3:30 PM EST to Paris time."
      }
    ],
    "is_official": true
  }
}
```

### 自定义 MCP 服务器配置
### 配置 MCP 服务器运行时设置 (`custom/mcp_settings.json`)

```json
{
  "mcpServers": {
    "time": {
      "command": "uvx",
      "args": [
        "mcp-server-time",
        "--local-timezone=Asia/Shanghai"
      ],
      "env": {}
    }
  },
  "users": [
    {
      "username": "admin",
      "password": "$2b$10$hPTLF/QOzCekVf2sOleFbemqtZFxA1M4HdwLVnr8LruNH2kvonC2O",
      "isAdmin": true
    }
  ],
  "systemConfig": {
    "routing": {
      "enableGlobalRoute": true,
      "enableGroupNameRoute": true,
      "enableBearerAuth": false,
      "bearerAuthKey": "0IBOE3PrkU6sK7PNdhUNzUyb5KbMSubd"
    },
    "install": {
      "pythonIndexUrl": "http://pypiserver:8080/simple/",
      "npmRegistry": ""
    }
  },
  "groups": []
}
```

- `"pythonIndexUrl": "http://pypiserver:8080/simple/"`：指定本地 PyPI 源地址，确保 MCPHub 能够从中安装 Python 包。


## Docker Compose 配置

### 编辑 `custom/.pip/pip.conf`

```ini
[global]
index-url = http://pypiserver:8080/simple
trusted-host = pypiserver
```

- `trusted-host = pypiserver`： 告诉 `pip` 信任 `pypiserver` 这个主机，即使它不使用 HTTPS。

这样，每次运行 `pip install` 时，它都会默认使用并信任您的 `pypiserver`。

### 编辑 `custom/verdaccio/.npmrc`

```ini
registry=http://verdaccio:4873/
```

### 编辑 `docker-compose.yml`

```bash
version: '3.8'

services:
  mcphub-postgres:
    image: pgvector/pgvector:pg17
    container_name: mcphub-postgres
    environment:
      POSTGRES_DB: mcphub
      POSTGRES_USER: mcphub
      POSTGRES_PASSWORD: your_password
    volumes:
      - ./postgres:/var/lib/postgresql/data # 持久化 PostgreSQL 数据

  # pypiserver 本地 PyPI 源服务
  pypiserver:
    image: pypiserver/pypiserver:latest
    container_name: pypiserver
    volumes:
      # 将宿主机的 ./pypi_packages 目录挂载到容器内的 /data/packages
      # 这是 pypiserver 存储 Python 包的地方
      - ./custom/pypi_packages:/data/packages
    ports:
      # 将宿主机的 8080 端口映射到容器的 8080 端口
      - "8080:8080"
    command: run /data/packages

  # Verdaccio 本地 npm 源服务
  verdaccio:
    image: verdaccio/verdaccio:latest
    container_name: verdaccio
    ports:
      - "4873:4873"
    volumes:
      - ./custom/verdaccio/conf:/verdaccio/conf
      - ./custom/verdaccio/plugins:/verdaccio/plugins
      - ./custom/verdaccio/storage:/verdaccio/storage

  mcphub:
    image: samanhappy/mcphub
    container_name: mcphub
    ports:
      - "3000:3000"
    volumes:
      - ./custom/registry:/app/registry
      - ./custom/servers.json:/app/servers.json
      - ./custom/mcp_settings.json:/app/mcp_settings.json
      - ./custom/.pip/pip.conf:/root/.pip/pip.conf
      - ./custom/verdaccio/.npmrc:/opt/verdaccio/.npmrc
    depends_on: # 确保下面的容器 启动后，再启动 mcphub。
      - mcphub-postgres
      - pypiserver
      - verdaccio
    environment:
      # 在这里更新 dbUrl，使用 mcphub-postgres 作为主机名
      MCPHUB_DB_URL: postgresql://mcphub:your_password@mcphub-postgres:5432/mcphub
```

`./custom/pypi_packages` 目录用于存储从 PyPI 下载的 Python 包。这个包及其依赖包最好到 `MCPHub 容器`中下载。


## 部署 MCPHub

```bash
docker compose up
```


## 参考资料
- [MCPHub GitHub](https://github.com/samanhappy/mcphub)
- [pip download](https://pip.pypa.io/en/stable/cli/pip_download/)
- [pypiserver/pypiserver](https://hub.docker.com/r/pypiserver/pypiserver)
- [MCP Manager](https://mcpm.sh/)
- [MCP Server Registry](https://mcpm.sh/registry/)
- [Todoist MCP Server](https://github.com/abhiz123/todoist-mcp-server)
- [Markdownify MCP Server](https://github.com/zcaceres/markdownify-mcp)
