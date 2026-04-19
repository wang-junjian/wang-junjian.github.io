---
layout: single
title:  "开发 RAGFlow MCP Server"
date:   2025-04-07 08:00:00 +0800
categories: RAGFlow MCPServer
tags: [RAGFlow, MCPServer, GitHubCopilot, Continue, Cline]
---

## 开发

这是第一次开发 MCP Server，想着使用智能编码工具（GitHub Copilot、Cursor、Trae）进行氛围编程，发现真不容易，Claude 3.7 sonnet 效果不错，在 GitHub Copilot 没用多长时间超限制了；Cursor 没有达到之前那种随心的效果；Trae 要排长队，太有挫败感了。于是，开始了以人编码为主，大模型辅助的开发过程。

### MCP Server 的工作流程

1. 初始化：加载环境变量，初始化 RAGFlow 客户端。
2. 工具注册：定义工具列表，描述工具的输入/输出。
3. 工具逻辑：实现工具的具体调用逻辑。
4. 服务器启动：通过 stdio 启动 MCP Server 并监听请求。

### 创建 RAGFlow MCP Server 项目

```bash
uvx create-mcp-server \
    --path ragflow-mcp-server \
    --name ragflow-mcp-server \
    --version 0.1.0 \
    --description "RAGFlow MCP Server" \
    --no-claudeapp
cd ragflow-mcp-server
uv sync --dev --all-extras
uv add ragflow-sdk
```

### 下载 MCP 开发文档和 RAGFlow Python API 文档

```bash
wget https://modelcontextprotocol.io/llms-full.txt -O docs/mcp-llms-full.txt
wget https://github.com/infiniflow/ragflow/raw/refs/heads/main/docs/references/python_api_reference.md \
       -O docs/ragflow-python_api_reference.md
```

### 开发的 Tools
  
1. list_datasets
    - 列出所有数据集
    - 返回数据集的 ID 和名称

2. create_chat
    - 创建一个新的聊天助手
    - 输入：
      - name: 聊天助手的名称
      - dataset_id: 数据集的 ID
    - 返回创建的聊天助手的 ID、名称和会话 ID

3. chat
    - 与聊天助手进行对话
    - 输入：
      - session_id: 聊天助手的会话 ID
      - question: 提问内容
    - 返回聊天助手的回答

![](/images/2025/ragflow-mcp-server/ragflow-mcp-server.png)

### 构建 & 发布

1. 同步依赖并更新锁定文件

```bash
uv sync
```

2. 构建软件包分发文件

```bash
uv build
```

3. 发布软件包到 PyPI

```bash
uv publish
```

### 源代码

https://github.com/wang-junjian/ragflow-mcp-server


## 配置

### GitHub Copilot (mcp.json)

```json
{
    "servers": {
        "ragflow-mcp-server": {
            "command": "uvx",
            "args": [
                "ragflow-mcp-server",
                "--api-key=ragflow-dhMzViYzJlMTM1NjExZjBiNWU5MDI0Mm",
                "--base-url=http://172.16.33.66:8060"
            ]
        }
    }
}
```

### Continue (config.yaml)

```yaml
mcpServers:
  - name: RAGFlow Server
    command: uvx
    args:
      - ragflow-mcp-server
      - --api-key=ragflow-dhMzViYzJlMTM1NjExZjBiNWU5MDI0Mm
      - --base-url=http://172.16.33.66:8060
```

### Cline (cline_mcp_settings.json)

```json
{
  "mcpServers": {
    "ragflow-mcp-server": {
      "command": "uvx",
      "args": [
        "ragflow-mcp-server",
        "--api-key=ragflow-dhMzViYzJlMTM1NjExZjBiNWU5MDI0Mm",
        "--base-url=http://172.16.33.66:8060"
      ],
      "disabled": false,
      "autoApprove": []
    }
  }
}
```


## 使用

**提示词**：使用 RAGFlow 的数据集`公司出勤及结算规章`回答问题`每月补卡次数`

### GitHub Copilot

![](/images/2025/ragflow-mcp-server/VSCodeGitHubCopilotCall1.png)

![](/images/2025/ragflow-mcp-server/VSCodeGitHubCopilotCall2.png)

### Continue

![](/images/2025/ragflow-mcp-server/ContinueAgentCall.png)

![](/images/2025/ragflow-mcp-server/ContinueAgentStepCall.png)

### Cline

![](/images/2025/ragflow-mcp-server/ClinePlanCall.png)

