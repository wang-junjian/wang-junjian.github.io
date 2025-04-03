---
layout: post
title:  "MCP 服务器示例和实现列表"
date:   2025-04-02 10:00:00 +0800
categories: MCP Server
tags: [MCP, Server, LLM]
---

- [Example Servers](https://modelcontextprotocol.io/examples)

本页展示了各种模型上下文协议(MCP)服务器，这些服务器展示了该协议的功能和多样性。这些服务器使大型语言模型(LLM)能够安全地访问工具和数据源。

## 参考实现

这些官方参考服务器展示了核心 MCP 功能和 SDK 用法：

### 数据和文件系统
- **[文件系统](https://github.com/modelcontextprotocol/servers/tree/main/src/filesystem)** - 具有可配置访问控制的安全文件操作
- **[PostgreSQL](https://github.com/modelcontextprotocol/servers/tree/main/src/postgres)** - 具有架构检查功能的只读数据库访问
- **[SQLite](https://github.com/modelcontextprotocol/servers/tree/main/src/sqlite)** - 数据库交互和商业智能功能
- **[Google Drive](https://github.com/modelcontextprotocol/servers/tree/main/src/gdrive)** - Google Drive 的文件访问和搜索功能

### 开发工具
- **[Git](https://github.com/modelcontextprotocol/servers/tree/main/src/git)** - 读取、搜索和操作 Git 仓库的工具
- **[GitHub](https://github.com/modelcontextprotocol/servers/tree/main/src/github)** - 仓库管理、文件操作和 GitHub API 集成
- **[GitLab](https://github.com/modelcontextprotocol/servers/tree/main/src/gitlab)** - GitLab API 集成，支持项目管理
- **[Sentry](https://github.com/modelcontextprotocol/servers/tree/main/src/sentry)** - 从 Sentry.io 检索和分析问题

### Web 和浏览器自动化
- **[Brave 搜索](https://github.com/modelcontextprotocol/servers/tree/main/src/brave-search)** - 使用 Brave 的搜索 API 进行网络和本地搜索
- **[Fetch](https://github.com/modelcontextprotocol/servers/tree/main/src/fetch)** - 为 LLM 使用优化的网络内容获取和转换
- **[Puppeteer](https://github.com/modelcontextprotocol/servers/tree/main/src/puppeteer)** - 浏览器自动化和网页抓取功能

### 生产力和通信
- **[Slack](https://github.com/modelcontextprotocol/servers/tree/main/src/slack)** - 频道管理和消息功能
- **[Google Maps](https://github.com/modelcontextprotocol/servers/tree/main/src/google-maps)** - 位置服务、方向和地点详情
- **[Memory](https://github.com/modelcontextprotocol/servers/tree/main/src/memory)** - 基于知识图谱的持久记忆系统

### AI 和专业工具
- **[EverArt](https://github.com/modelcontextprotocol/servers/tree/main/src/everart)** - 使用各种模型的 AI 图像生成
- **[Sequential Thinking](https://github.com/modelcontextprotocol/servers/tree/main/src/sequentialthinking)** - 通过思维序列进行动态问题解决
- **[AWS KB Retrieval](https://github.com/modelcontextprotocol/servers/tree/main/src/aws-kb-retrieval-server)** - 使用 Bedrock Agent Runtime 从 AWS Knowledge Base 检索信息


## 官方集成

这些 MCP 服务器由公司为其平台维护：

- **[Axiom](https://github.com/axiomhq/mcp-server-axiom)** - 使用自然语言查询和分析日志、跟踪和事件数据
- **[Browserbase](https://github.com/browserbase/mcp-server-browserbase)** - 在云中自动化浏览器交互
- **[Cloudflare](https://github.com/cloudflare/mcp-server-cloudflare)** - 在 Cloudflare 开发者平台上部署和管理资源
- **[E2B](https://github.com/e2b-dev/mcp-server)** - 在安全云沙箱中执行代码
- **[Neon](https://github.com/neondatabase/mcp-server-neon)** - 与 Neon 无服务器 Postgres 平台交互
- **[Obsidian Markdown Notes](https://github.com/calclavia/mcp-obsidian)** - 阅读和搜索 Obsidian 知识库中的 Markdown 笔记
- **[Qdrant](https://github.com/qdrant/mcp-server-qdrant/)** - 使用 Qdrant 向量搜索引擎实现语义记忆
- **[Raygun](https://github.com/MindscapeHQ/mcp-server-raygun)** - 访问崩溃报告和监控数据
- **[Search1API](https://github.com/fatwang2/search1api-mcp)** - 用于搜索、爬取和网站地图的统一 API
- **[Stripe](https://github.com/stripe/agent-toolkit)** - 与 Stripe API 交互
- **[Tinybird](https://github.com/tinybirdco/mcp-tinybird)** - 与 Tinybird 无服务器 ClickHouse 平台交互
- **[Weaviate](https://github.com/weaviate/mcp-server-weaviate)** - 通过 Weaviate 集合启用智能 RAG


## 社区亮点

不断增长的社区开发服务器生态系统扩展了 MCP 的功能：

- **[Docker](https://github.com/ckreiling/mcp-server-docker)** - 管理容器、镜像、卷和网络
- **[Kubernetes](https://github.com/Flux159/mcp-server-kubernetes)** - 管理 pod、部署和服务
- **[Linear](https://github.com/jerhadf/linear-mcp-server)** - 项目管理和问题跟踪
- **[Snowflake](https://github.com/datawiz168/mcp-snowflake-service)** - 与 Snowflake 数据库交互
- **[Spotify](https://github.com/varunneal/spotify-mcp)** - 控制 Spotify 播放和管理播放列表
- **[Todoist](https://github.com/abhiz123/todoist-mcp-server)** - 任务管理集成

> **注意：** 社区服务器未经测试，使用风险自负。它们与 Anthropic 没有关联，也未得到 Anthropic 的认可。

有关社区服务器的完整列表，请访问 [MCP 服务器仓库](https://github.com/modelcontextprotocol/servers)。


## 入门指南

### 使用参考服务器

基于 TypeScript 的服务器可以直接通过 `npx` 使用：

```bash
npx -y @modelcontextprotocol/server-memory
```

基于 Python 的服务器可以使用 `uvx`（推荐）或 `pip`：

```bash
# 使用 uvx
uvx mcp-server-git

# 使用 pip
pip install mcp-server-git
python -m mcp_server_git
```

### 与 Claude 配置

要将 MCP 服务器与 Claude 一起使用，请将其添加到配置中：

```json
{
  "mcpServers": {
    "memory": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-memory"]
    },
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/allowed/files"]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "<YOUR_TOKEN>"
      }
    }
  }
}
```


## 其他资源

- [MCP 服务器仓库](https://github.com/modelcontextprotocol/servers) - 参考实现和社区服务器的完整集合
- [Awesome MCP 服务器](https://github.com/punkpeye/awesome-mcp-servers) - MCP 服务器精选列表
- [MCP CLI](https://github.com/wong2/mcp-cli) - 用于测试 MCP 服务器的命令行检查工具
- [MCP Get](https://mcp-get.com) - 安装和管理 MCP 服务器的工具
- [Supergateway](https://github.com/supercorp-ai/supergateway) - 通过 SSE 运行 MCP stdio 服务器
- [Zapier MCP](https://zapier.com/mcp) - 拥有 7,000 多个应用和 30,000 多个操作的 MCP 服务器

访问我们的 [GitHub 讨论](https://github.com/orgs/modelcontextprotocol/discussions) 参与 MCP 社区交流。
