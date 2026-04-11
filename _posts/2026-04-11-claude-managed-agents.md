---
layout: single
title:  "Claude Managed Agents（托管智能体）快速入门指南"
date:   2026-04-11 10:00:00 +0800
categories: Claude ManagedAgents
tags: [Claude, ManagedAgents, Agent]
---

<!--more-->

# Claude Managed Agents 概览

这是一个运行在托管基础设施中的预构建、可配置智能体（Agent）框架，最适用于长时间运行的任务和异步工作。

![](/images/2026/Claude/managed-agents/overview.jpeg)

---

Anthropic 提供了两种使用 Claude 构建应用的方式，分别适用于不同的使用场景：

| | Messages API | Claude Managed Agents |
|---|---|---|
| **定位** | 直接的模型提示词访问 | 运行在托管基础设施中的预构建、可配置智能体框架 |
| **最佳用途** | 自定义智能体循环和精细化控制 | 长时间运行的任务和异步工作 |
| **了解更多** | [Messages API 文档](https://platform.claude.com/docs/en/build-with-claude/working-with-messages) | [Claude Managed Agents 文档](https://platform.claude.com/docs/en/managed-agents/overview) |

Claude Managed Agents 为将 Claude 作为自主智能体运行提供了框架和基础设施。无需构建自己的智能体循环、工具执行环境和运行时，你即可获得一个全托管的环境，让 Claude 能够安全地读取文件、运行命令、浏览网页并执行代码。该框架支持内置的提示词缓存、压缩以及其他性能优化，以实现高质量、高效的智能体输出。

## 核心概念

Claude Managed Agents 基于四个核心概念构建：

| 概念 | 描述 |
|---------|-------------|
| **智能体 (Agent)** | 模型、系统提示词、工具、MCP 服务器和技能 |
| **环境 (Environment)** | 配置好的容器模板（包含软件包、网络访问权限等） |
| **会话 (Session)** | 环境中运行的智能体实例，执行特定任务并生成输出 |
| **事件 (Events)** | 你的应用程序与智能体之间交换的消息（用户交互、工具结果、状态更新） |

## 工作原理

### 1. 创建智能体

定义模型、系统提示词、工具、MCP 服务器和技能。创建一次智能体，即可在不同会话中通过 ID 进行引用。

### 2. 创建环境

配置一个带有预装软件包（如 Python、Node.js、Go 等）、网络访问规则和挂载文件的云容器。

### 3. 启动会话

启动一个引用了你的智能体和环境配置的会话。

### 4. 发送事件并流式传输响应

以事件形式发送用户消息。Claude 会自主执行工具，并通过服务器发送事件 (SSE) 流式返回结果。事件历史记录在服务端持久化，并可完整获取。

### 5. 引导或中断

发送额外的用户事件以在执行过程中引导智能体，或者对其进行中断以改变方向。

## 何时使用 Claude Managed Agents

Claude Managed Agents 最适合具有以下需求的工作负载：

- **长时间运行的任务** - 需要运行数分钟或数小时并进行多次工具调用的任务
- **云基础设施** - 需要带有预装软件包和网络访问权限的安全容器
- **简化基础设施** - 无需自行构建智能体循环、沙盒或工具执行层
- **有状态会话** - 需要在多次交互中保持文件系统和对话历史

## 支持的工具

Claude Managed Agents 为 Claude 提供了全面的内置工具集：

- **Bash** - 在容器中运行 shell 命令
- **文件操作** - 读取、写入、编辑、使用 glob 和 grep 命令操作容器中的文件
- **网页搜索与获取** - 搜索网络并从 URL 获取内容
- **MCP 服务器** - 连接到外部工具提供商

## 测试版权限

Claude Managed Agents 目前处于测试阶段。所有 Managed Agents 端点都需要 `managed-agents-2026-04-01` 测试版请求头。SDK 会自动设置该请求头。相关行为可能会在后续版本中进行优化，以提高输出效果。

开始使用前，你需要：

1. 一个 `Claude API 密钥`
2. 所有请求中包含上述测试版请求头
3. Claude Managed Agents 的访问权限（所有 API 账户默认启用）

## 速率限制

Managed Agents 端点按组织设置速率限制：

| 操作 | 限制 |
| --- | --- |
| 创建端点（智能体、会话、环境等） | 每分钟 60 次请求 |
| 读取端点（检索、列表、流式传输等） | 每分钟 600 次请求 |


---


# Claude Managed Agents 快速入门

![](/images/2026/Claude/managed-agents/quickstart.jpeg)

创建您的第一个自主智能体（Autonomous Agent）。

本指南将带您完成创建智能体、设置环境、启动会话以及流式传输智能体响应的全过程。

## 核心概念

| 概念 | 描述 |
| :--- | :--- |
| **智能体 (Agent)** | 包含模型、系统提示词、工具、MCP 服务和技能的定义。 |
| **环境 (Environment)** | 配置好的容器模板（包括软件包、网络访问权限等）。 |
| **会话 (Session)** | 在环境中运行的智能体实例，用于执行特定任务并生成输出。 |
| **事件 (Events)** | 您的应用程序与智能体之间交换的消息（用户轮次、工具结果、状态更新）。 |

## 前置条件

* 一个 Anthropic Console 账号
* 一个 API 密钥

## 安装 CLI

### Homebrew (macOS)
```bash
brew install anthropics/tap/ant
```
在 macOS 上，需要对二进制文件取消隔离：
```bash
xattr -d com.apple.quarantine "$(brew --prefix)/bin/ant"
```

### curl (Linux/WSL)
检查安装：
```bash
ant --version
```

## 安装 SDK

### Python
```bash
pip install anthropic
```
将您的 API 密钥设置为环境变量：
```bash
export ANTHROPIC_API_KEY="your-api-key-here"
```

## 创建您的第一个会话

所有 Managed Agents API 请求都需要包含 `managed-agents-2026-04-01` Beta 请求头。SDK 会自动设置该请求头。

### 1. 创建智能体
创建一个定义了模型、系统提示词和可用工具的智能体。

**使用 CLI：**
```bash
ant beta:agents create \
  --name "Coding Assistant" \
  --model '{id: claude-sonnet-4-6}' \
  --system "You are a helpful coding assistant. Write clean, well-documented code." \
  --tool '{type: agent_toolset_20260401}'
```
`agent_toolset_20260401` 工具类型启用了全套预构建的智能体工具（bash、文件操作、网络搜索等）。请参阅“工具”章节以获取完整列表和各工具的配置选项。

**请保存返回的 `agent.id`**。在创建每个会话时都需要引用它。

### 2. 创建环境
环境定义了智能体运行的容器。

**使用 CLI：**
```bash
ant beta:environments create \
  --name "quickstart-env" \
  --config '{type: cloud, networking: {type: unrestricted}}'
```
**请保存返回的 `environment.id`**。在创建每个会话时都需要引用它。

### 3. 启动会话
创建一个引用了您的智能体和环境的会话。

**使用 curl：**
```bash
session=$( curl -sS --fail-with-body https://api.anthropic.com/v1/sessions \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: managed-agents-2026-04-01" \
  -H "content-type: application/json" \
  -d @- <<EOF
{
  "agent": "$AGENT_ID",
  "environment_id": "$ENVIRONMENT_ID",
  "title": "Quickstart session"
}
EOF
)
SESSION_ID=$(jq -er '.id' <<<"$session")
echo "Session ID: $SESSION_ID"
```

### 4. 发送消息并流式传输响应
开启一个流，发送用户事件，然后处理到达的事件：

**使用 curl：**
```bash
# 首先发送用户消息；API 会缓冲事件直到流连接成功
curl -sS --fail-with-body \
  "https://api.anthropic.com/v1/sessions/$SESSION_ID/events" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: managed-agents-2026-04-01" \
  -H "content-type: application/json" \
  -d @- >/dev/null <<'EOF'
{
  "events": [
    {
      "type": "user.message",
      "content": [
        {
          "type": "text",
          "text": "Create a Python script that generates the first 20 Fibonacci numbers and saves them to fibonacci.txt"
        }
      ]
    }
  ]
}
EOF

# 开启 SSE 流并处理到达的事件
while IFS= read -r line; do
  [[ $line == data:* ]] || continue
  json=${line#data: }
  case $(jq -r '.type' <<<"$json") in
    agent.message)
      jq -j '.content[] | select(.type == "text") | .text' <<<"$json"
      ;;
    agent.tool_use)
      printf '\n[Using tool: %s]\n' "$(jq -r '.name' <<<"$json")"
      ;;
    session.status_idle)
      printf '\n\nAgent finished.\n'
      break
      ;;
  esac
done < <( curl -sS -N --fail-with-body \
  "https://api.anthropic.com/v1/sessions/$SESSION_ID/stream" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: managed-agents-2026-04-01" \
  -H "Accept: text/event-stream" )
```

智能体会编写一个 Python 脚本，在容器内执行它，并验证输出文件是否已创建。您的输出将类似于：

```
我将创建一个 Python 脚本来生成前 20 个斐波那契数并将其保存到文件中。
[Using tool: write]
[Using tool: bash]
脚本运行成功。让我验证一下输出文件。
[Using tool: bash]
fibonacci.txt 包含了前 20 个斐波那契数（0 到 4181）。

Agent finished.
```

## 幕后原理

当您发送用户事件时，Claude Managed Agents 会执行以下操作：

1. **配置容器**：您的环境配置决定了容器的构建方式。
2. **运行智能体循环**：Claude 根据您的消息决定使用哪些工具。
3. **执行工具**：文件写入、bash 命令和其他工具调用在容器内部运行。
4. **流式传输事件**：在智能体工作时，您会收到实时更新。
5. **进入空闲状态**：当智能体没有更多任务时，它会发出 `session.status_idle` 事件。


---


# 定义您的智能体 (Define your agent)

![](/images/2026/Claude/managed-agents/define-your-agent.jpeg)

创建可重用、带版本的智能体配置。

智能体（Agent）是一个可重用的、带版本的配置，它定义了角色的形象和能力。它将模型、系统提示词、工具、MCP（模型上下文协议）服务器和技能捆绑在一起，决定了 Claude 在会话期间的行为方式。

您只需将智能体创建为一个可重用资源，并在每次启动会话时通过其 ID 进行引用。智能体具有版本控制功能，更易于在多个会话中进行管理。

> **注意：** 所有 Managed Agents API 请求都需要包含 `managed-agents-2026-04-01` Beta 请求头。SDK 会自动设置此请求头。

## 智能体配置字段

| 字段 | 描述 |
| :--- | :--- |
| **name** | **必填**。智能体的人类可读名称。 |
| **model** | **必填**。驱动智能体的 Claude 模型。支持所有 Claude 4.5 及更高版本的模型。 |
| **system** | 定义智能体行为和角色的系统提示词。系统提示词应与描述具体工作任务的用户消息（User messages）区分开。 |
| **tools** | 智能体可用的工具。结合了预构建的智能体工具、MCP 工具和自定义工具。 |
| **mcp_servers** | 提供标准化第三方能力的 MCP 服务器。 |
| **skills** | 通过“渐进式披露”提供领域特定上下文的技能（Skills）。 |
| **callable_agents** | 此智能体可以调用的其他智能体，用于多智能体编排（Multi-agent orchestration）。这是一个研究预览版功能；需申请访问权限。 |
| **description** | 描述智能体用途的文本。 |
| **metadata** | 用于您自己追踪的任意键值对。 |

## 创建智能体

以下示例定义了一个编程智能体，它使用 Claude Sonnet 4.6 并具有预构建智能体工具集的访问权限。该工具集允许智能体编写代码、读取文件、搜索网页等。完整的支持工具列表请参阅“智能体工具参考”。

**CLI 示例：**
```bash
ant beta:agents create \
  --name "Coding Assistant" \
  --model '{id: claude-sonnet-4-6}' \
  --system "You are a helpful coding agent." \
  --tool '{type: agent_toolset_20260401}'
```

若要以“快速模式 (fast mode)”使用 Claude Opus 4.6，请将 model 作为一个对象传递：`{"id": "claude-opus-4-6", "speed": "fast"}`。

响应会返回您的配置，并添加 `id`、`version`、`created_at`、`updated_at` 和 `archived_at` 字段。版本号（version）从 1 开始，每次更新智能体时都会递增。

**响应示例：**
```json
{
  "id": "agent_01HqR2k7vXbZ9mNpL3wYcT8f",
  "type": "agent",
  "name": "Coding Assistant",
  "model": {
    "id": "claude-sonnet-4-6",
    "speed": "standard"
  },
  "system": "You are a helpful coding agent.",
  "description": null,
  "tools": [
    {
      "type": "agent_toolset_20260401",
      "default_config": {
        "permission_policy": {
          "type": "always_allow"
        }
      }
    }
  ],
  "skills": [],
  "mcp_servers": [],
  "metadata": {},
  "version": 1,
  "created_at": "2026-04-03T18:24:10.412Z",
  "updated_at": "2026-04-03T18:24:10.412Z",
  "archived_at": null
}
```

## 更新智能体

更新智能体会生成一个新版本。请传递当前版本号，以确保您是基于已知状态进行更新。

**CLI 示例：**
```bash
ant beta:agents update \
  --agent-id "$AGENT_ID" \
  --version "$AGENT_VERSION" \
  --system "You are a helpful coding agent. Always write tests."
```

### 更新语义 (Update semantics)

* **省略的字段将被保留**：您只需要包含想要更改的字段。
* **标量字段**（如 `model`、`system`、`name` 等）：会被新值替换。可以通过传递 `null` 来清除 `system` 和 `description` 字段。`model` 和 `name` 是强制字段，不能清除。
* **数组字段**（如 `tools`、`mcp_servers`、`skills`、`callable_agents`）：会被新数组完全替换。要彻底清除数组字段，请传递 `null` 或空数组。
* **元数据 (Metadata)**：在键（key）级别进行合并。提供的键将被添加或更新，省略的键将被保留。要删除特定键，请将其值设置为空字符串。
* **空操作检测**：如果更新操作相对于当前版本没有任何变化，则不会创建新版本，并返回现有版本。

## 智能体生命周期

| 操作 | 行为 |
| :--- | :--- |
| **更新 (Update)** | 生成一个新的智能体版本。 |
| **列出版本 (List versions)** | 获取完整的版本历史记录，以追踪随时间推移的变化。 |
| **归档 (Archive)** | 智能体变为只读。新会话无法引用它，但现有会话会继续运行。 |

### 列出版本
获取完整的版本历史记录，了解智能体是如何随时间演变的。

**CLI 示例：**
```bash
ant beta:agents:versions list --agent-id "$AGENT_ID"
```

### 归档智能体
归档会将智能体设为只读。现有会话会继续运行，但新会话无法引用该智能体。响应会将 `archived_at` 设置为归档的时间戳。

**CLI 示例：**
```bash
ant beta:agents archive --agent-id "$AGENT_ID"
```


---


# 配置环境 (Configure Environments)

![](/images/2026/Claude/managed-agents/configure-environments.jpeg)

环境（Environment）定义了智能体运行的沙盒容器。

环境决定了智能体在执行任务时所处的基础设施。您可以在环境定义中配置网络访问、持久化设置以及容器构建方式，从而确保智能体具备完成任务所需的运行环境和依赖项。

与智能体配置一样，环境也是一个可重用的资源。一旦创建，您可以将其作为会话的基础，以便在多个会话之间共享相同的配置。

> **注意：** 所有 Managed Agents API 请求都需要包含 `managed-agents-2026-04-01` Beta 请求头。SDK 会自动设置此请求头。

## 创建环境

环境配置包含两个核心部分：`type`（类型）和 `networking`（网络）。

**CLI 示例：**
```bash
ant beta:environments create \
  --name "production-env" \
  --config '{type: cloud, networking: {type: unrestricted}}'
```

### 配置字段说明

| 字段 | 描述 |
| :--- | :--- |
| **type** | 指定环境的类型，例如 `cloud`（基于云的容器）。 |
| **networking** | 定义容器的网络策略。 |
| **networking.type** | 决定联网能力。`unrestricted` 允许访问公共互联网；`restricted` 则可能限制访问（根据您的平台安全策略）。 |

## 环境生命周期

环境旨在为智能体提供一致且隔离的运行环境。

* **创建后不可变**：环境一旦创建，其核心配置通常是固定的。若要更改配置（例如修改网络权限），建议创建一个新的环境版本或新环境，并在启动新会话时引用它。
* **隔离性**：每个会话都会在一个独立的实例环境中启动，确保一个智能体任务的副作用不会影响到另一个任务的运行环境。

## 容器参考 (Container Reference)

对于 Managed Agents，容器环境提供了一些预装的功能，以便于智能体执行各种操作：

1. **预装软件包**：标准环境包含常用的系统工具（如 `bash`、`curl`、`git` 等）以及 Python 执行环境。
2. **文件系统**：容器提供临时工作目录，用于存储智能体在执行任务期间生成或处理的文件。
3. **网络访问**：根据 `networking` 配置，智能体可以访问外部 API 或进行 Web 搜索。

## 如何使用环境

在启动会话时，您需要指定 `environment_id`。这意味着您可以针对不同的任务创建不同的环境配置，例如：

* **沙盒环境**：严格的网络限制，仅允许访问预定义的本地工具。
* **开发环境**：允许访问特定的开发 API 和内部服务。

**在会话中引用环境：**
```bash
ant beta:sessions create \
  --agent-id "$AGENT_ID" \
  --environment-id "$ENVIRONMENT_ID"
```

## 常见用例

* **数据处理任务**：创建一个配置了必要 Python 数据科学库的环境，让智能体能够读取大型数据集。
* **软件工程助手**：创建一个具备 Git 访问权限的环境，让智能体能够克隆仓库并提交代码补丁。
* **安全受限场景**：创建一个网络受限的环境，防止智能体在执行不受信任的代码时连接到意外的外部地址。


---


# 容器参考

云容器中预装的软件包、数据库和实用工具。

Claude Managed Agents 中的云容器预装了全面的编程语言、数据库和实用工具。智能体可以直接使用这些工具，无需进行任何安装步骤。

所有 Managed Agents API 请求都需要 `managed-agents-2026-04-01` 测试版请求头。SDK 会自动设置该请求头。

## 编程语言

| 语言 | 版本 | 包管理器 |
|----------|---------|-----------------|
| Python | 3.12+ | pip, uv |
| Node.js | 20+ | npm, yarn, pnpm |
| Go | 1.22+ | go modules |
| Rust | 1.77+ | cargo |
| Java | 21+ | maven, gradle |
| Ruby | 3.3+ | bundler, gem |
| PHP | 8.3+ | composer |
| C/C++ | GCC 13+ | make, cmake |

## 数据库

| 数据库 | 描述 |
|----------|-------------|
| SQLite | 预装，可立即使用 |
| PostgreSQL 客户端 | 用于连接外部数据库的 `psql` 客户端 |
| Redis 客户端 | 用于连接外部实例的 `redis-cli` |

数据库服务器（如 PostgreSQL、Redis 等）默认不在容器内运行。容器包含用于连接外部数据库实例的客户端工具。SQLite 可供本地使用。

## 实用工具

### 系统工具

- `git` - 版本控制
- `curl`, `wget` - HTTP 客户端
- `jq` - JSON 处理
- `tar`, `zip`, `unzip` - 归档工具
- `ssh`, `scp` - 远程访问（需要启用网络）
- `tmux`, `screen` - 终端多路复用器

### 开发工具

- `make`, `cmake` - 构建系统
- `docker` - 容器管理（有限支持）
- `ripgrep` (`rg`) - 快速文件搜索
- `tree` - 目录可视化
- `htop` - 进程监控

### 文本处理

- `sed`, `awk`, `grep` - 流编辑器
- `vim`, `nano` - 文本编辑器
- `diff`, `patch` - 文件比对

## 容器规格

| 属性 | 值 |
|----------|-------|
| 操作系统 | Ubuntu 22.04 LTS |
| 架构 | x86_64 (amd64) |
| 内存 | 最高 8 GB |
| 磁盘空间 | 最高 10 GB |
| 网络 | 默认禁用（需在环境配置中启用） |


---


# 工具 (Tools)

![](/images/2026/Claude/managed-agents/tools.jpeg)

工具扩展了 Claude 的能力，使其能够与外部世界进行交互、执行计算、操作文件以及处理复杂任务。

在 Managed Agents 中，工具是 Claude 决策循环（decision loop）的一部分。当 Claude 遇到无法仅通过文本生成解决的任务时，它会调用工具。

## 工具类型

Managed Agents 支持以下三类工具：

| 工具类型 | 描述 |
| :--- | :--- |
| **预构建工具 (Pre-built Tools)** | 由 Anthropic 提供，开箱即用。包括文件操作、Bash 执行、网络搜索等。 |
| **MCP 工具 (Model Context Protocol)** | 基于开放标准的连接器，用于集成私有数据、开发工具或第三方 API。 |
| **自定义工具 (Custom Tools)** | 针对特定业务需求编写的函数，通过 API 定义后供智能体调用。 |

## 1. 预构建工具集 (`agent_toolset_20260401`)

这是最常用的工具集，建议在大多数自主智能体场景中使用。通过在创建智能体时指定此类型，您可以立即获得以下能力：

* **文件系统操作**：读取、写入、创建、移动和删除文件及目录。
* **Bash 环境**：在受限的容器内执行脚本、安装 Python 包、运行测试等。
* **网络访问**：执行 HTTP 请求或进行 Web 搜索（取决于环境网络配置）。

**配置示例：**
```bash
ant beta:agents create \
  --name "Tool-Enabled Agent" \
  --tool '{type: "agent_toolset_20260401", default_config: {permission_policy: {type: "always_allow"}}}'
```

## 2. MCP (Model Context Protocol)

MCP 允许您将智能体连接到本地或远程数据源（如数据库、GitHub 存储库、Slack 等），而无需通过复杂的自定义开发。

* **连接器**：您可以使用现有的 MCP 服务器连接器。
* **上下文共享**：MCP 工具将外部数据转化为 Claude 可以理解的上下文信息。

有关如何设置 MCP 的详细信息，请参阅“MCP 连接器”文档。

## 3. 自定义工具

如果您需要调用公司内部的 API 或执行特定的业务逻辑，可以定义自定义工具。

**工具定义结构：**
每个工具定义必须包含：
1. **名称 (Name)**：Claude 将在调用时使用的名称。
2. **描述 (Description)**：详细说明该工具的用途及调用时机（Claude 依赖此描述决定何时使用该工具）。
3. **输入模式 (Input Schema)**：定义工具所需的参数格式（使用 JSON Schema）。

## 权限策略 (Permission Policies)

出于安全性考虑，Managed Agents 提供了精细的权限控制，特别是在处理文件和执行代码时。

* **Always Allow（总是允许）**：在受信任的开发环境中使用。
* **Require Approval（需要审批）**：在生产环境中，涉及删除文件、发送邮件或修改数据库等敏感操作时，建议配置此项。智能体会向用户发送一个中断事件，等待人工确认后方可继续。

**配置权限示例：**
```json
{
  "type": "agent_toolset_20260401",
  "default_config": {
    "permission_policy": {
      "type": "require_approval"
    }
  }
}
```

## 工具执行流

1. **调用决策**：Claude 决定需要使用工具，并生成 `agent.tool_use` 事件。
2. **执行**：系统在容器内执行该工具。
3. **结果返回**：工具输出结果通过 `tool.result` 事件回传给 Claude。
4. **循环继续**：Claude 根据工具返回的结果继续后续的推理或操作。

## 最佳实践

* **详细描述**：为工具编写详尽的 `description`。例如，不要只写 "search"，而应写 "搜索公司内部文档库以获取关于某 API 的技术参数"。
* **限制范围**：尽量通过工具功能将智能体限制在必要的目录或 API 范围内，遵循最小权限原则。
* **错误处理**：确保您的自定义工具能够返回清晰的错误消息，以便 Claude 在工具调用失败时能够进行自我修正或向用户报告。


---


# 会话事件流 (Session event stream)

![](/images/2026/Claude/managed-agents/session-event-stream.jpeg)

发送事件、流式传输响应，并在执行过程中中断或重定向您的会话。

与 Claude Managed Agents 的通信是基于事件的。您向智能体发送用户事件（User events），并接收智能体事件（Agent events）和会话事件（Session events）以跟踪状态。

> **注意：** 所有 Managed Agents API 请求都需要包含 `managed-agents-2026-04-01` Beta 请求头。SDK 会自动设置此请求头。

## 事件类型

事件是双向流动的：
* **用户事件 (User events)**：您发送给智能体的消息，用于启动会话并在其进行过程中进行引导。
* **会话、跨度与智能体事件 (Session, span, and agent events)**：系统发送给您的事件，用于观察会话状态和智能体进度。

事件类型采用 `{domain}.{action}` 的命名约定。

| 事件类型 | 描述 |
| :--- | :--- |
| `user.message` | 包含文本内容的普通用户消息。 |
| `user.interrupt` | 在执行中途停止智能体。 |
| `user.custom_tool_result` | 对智能体调用的自定义工具的响应。 |
| `user.tool_confirmation` | 当权限策略要求确认时，批准或拒绝智能体/MCP 工具调用。 |
| `user.define_outcome` | 定义智能体需努力实现的结果。 |

每个事件都包含一个 `processed_at` 时间戳，指示事件在服务器端被记录的时间。如果 `processed_at` 为 `null`，意味着该事件已被控制台排队，将在前面的事件处理完毕后进行处理。

## 集成事件

### 发送事件
发送 `user.message` 事件以开始或继续智能体的工作：

```bash
curl -sS --fail-with-body "https://api.anthropic.com/v1/sessions/$SESSION_ID/events?beta=true" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: managed-agents-2026-04-01" \
  -H "content-type: application/json" \
  -d @- <<'EOF'
{
  "events": [
    {
      "type": "user.message",
      "content": [
        {"type": "text", "text": "Analyze the performance of the sort function in utils.py"}
      ]
    }
  ]
}
EOF
```

### 中断与重定向
发送 `user.interrupt` 事件以在执行中途停止智能体，随后发送 `user.message` 事件以重定向它：

```bash
# 中断并输入新指令
curl -sS --fail-with-body "https://api.anthropic.com/v1/sessions/$SESSION_ID/events?beta=true" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: managed-agents-2026-04-01" \
  -H "content-type: application/json" \
  -d @- <<'EOF'
{
  "events": [
    {"type": "user.interrupt"},
    {
      "type": "user.message",
      "content": [
        {"type": "text", "text": "Instead, focus on fixing the bug in line 42."}
      ]
    }
  ]
}
EOF
```

## 其他场景

### 处理自定义工具调用
当智能体调用自定义工具时：
1. 会话发出 `agent.custom_tool_use` 事件。
2. 会话暂停并发出 `session.status_idle` 事件，且包含 `stop_reason: requires_action`。
3. 您在系统执行该工具，并通过 `user.custom_tool_result` 事件将结果传回。
4. 一旦所有阻塞事件解决，会话自动恢复为 `running` 状态。

### 工具确认
当权限策略要求确认才能执行工具时：
1. 会话发出 `agent.tool_use` 或 `agent.mcp_tool_use` 事件。
2. 会话暂停并发出 `session.status_idle` 事件（`stop_reason: requires_action`）。
3. 使用 `user.tool_confirmation` 事件批准（`allow`）或拒绝（`deny`）该调用。

## 追踪使用情况
会话对象包含一个 `usage` 字段，记录了累积的 token 统计信息。您可以在会话闲置（idle）时获取最新统计，用于监控成本、执行预算管理或跟踪消耗。

```json
{
  "id": "sesn_01...",
  "status": "idle",
  "usage": {
    "input_tokens": 5000,
    "output_tokens": 3200,
    "cache_creation_input_tokens": 2000,
    "cache_read_input_tokens": 20000
  }
}
```

*提示：缓存条目的 TTL 为 5 分钟，在此窗口内的连续轮次会受益于缓存读取，从而降低单位 Token 成本。*


# 参考资料
- [Get started with Claude Managed Agents](https://platform.claude.com/docs/en/managed-agents/quickstart)
- [Define your agent](https://platform.claude.com/docs/en/managed-agents/agent-setup)
- [Configure environments](https://platform.claude.com/docs/en/managed-agents/environments)
- [Agent tools](https://platform.claude.com/docs/en/managed-agents/tools)
- [Events and streaming](https://platform.claude.com/docs/en/managed-agents/events-and-streaming)
