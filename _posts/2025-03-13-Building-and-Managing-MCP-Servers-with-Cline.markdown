---
layout: single
title:  "使用 Cline 构建和管理 MCP 服务器：增强 AI 能力的全面指南"
date:   2025-03-13 10:00:00 +0800
categories: Cline MCP
tags: [Cline, MCP, Agent, GitHubCopilot]
---

# [Cline 和模型上下文协议 (MCP) 服务器：增强 AI 能力](https://github.com/cline/cline/blob/main/docs/mcp/README.md)

**快速链接：**

- 从 GitHub 构建 MCP 服务器
- 从头开始构建自定义 MCP 服务器

本文档解释了模型上下文协议 (MCP) 服务器的功能以及 Cline 如何帮助构建和使用它们。

## 概述

MCP 服务器充当大型语言模型 (LLM)（如 Claude）与外部工具或数据源之间的中介。它们是向 LLM 提供功能的小程序，使其能够通过 MCP 与外部世界交互。MCP 服务器本质上就像 LLM 可以使用的 API。

## 核心概念

MCP 服务器定义了一组"**工具**"，即 LLM 可以执行的函数。这些工具提供了广泛的功能。

**MCP 的工作原理：**

- **MCP 主机**发现连接的服务器的功能并加载它们的工具、提示和资源。
- **资源**提供对只读数据的一致访问，类似于文件路径或数据库查询。
- **安全性**由服务器隔离凭证和敏感数据来确保。交互需要明确的用户批准。

## 使用场景

MCP 服务器的潜力非常广阔。它们可以用于多种用途。

**以下是 MCP 服务器的一些具体使用示例：**

- **Web 服务和 API 集成：**
  - 监控 GitHub 存储库的新问题
  - 根据特定触发器发布 Twitter 更新
  - 检索基于位置的服务的实时天气数据

- **浏览器自动化：**
  - 自动化 Web 应用程序测试
  - 抓取电子商务网站进行价格比较
  - 为网站监控生成截图

- **数据库查询：**
  - 生成每周销售报告
  - 分析客户行为模式
  - 为业务指标创建实时仪表板

- **项目和任务管理：**
  - 基于代码提交自动创建 Jira 工单
  - 生成每周进度报告
  - 根据项目需求创建任务依赖关系

- **代码库文档：**
  - 从代码注释生成 API 文档
  - 从代码结构创建架构图
  - 维护最新的 README 文件

## 入门指南

**根据您的需求选择适合的方法：**

- **使用现有服务器：** 从 GitHub 存储库开始使用预构建的 MCP 服务器
- **自定义现有服务器：** 修改现有服务器以满足您的特定需求
- **从头构建：** 为独特用例创建完全自定义的服务器

## 与 Cline 的集成

Cline 通过其 AI 功能简化了 MCP 服务器的构建和使用。

### 构建 MCP 服务器

- **自然语言理解：** 使用自然语言指导 Cline 构建 MCP 服务器，只需描述其功能。Cline 将解释您的指示并生成必要的代码。
- **克隆和构建服务器：** Cline 可以从 GitHub 自动克隆现有的 MCP 服务器存储库并构建它们。
- **配置和依赖管理：** Cline 处理配置文件、环境变量和依赖项。
- **故障排除和调试：** Cline 帮助识别和解决开发过程中的错误。

### 使用 MCP 服务器

- **工具执行：** Cline 与 MCP 服务器无缝集成，允许您执行其定义的工具。
- **上下文感知交互：** Cline 可以根据对话上下文智能地建议使用相关工具。
- **动态集成：** 组合多个 MCP 服务器功能用于复杂任务。例如，Cline 可以使用 GitHub 服务器获取数据，并使用 Notion 服务器创建格式化报告。

## 安全考虑

使用 MCP 服务器时，遵循安全最佳实践很重要：

- **身份验证：** 始终使用安全的身份验证方法进行 API 访问
- **环境变量：** 将敏感信息存储在环境变量中
- **访问控制：** 仅限授权用户访问服务器
- **数据验证：** 验证所有输入以防止注入攻击
- **日志记录：** 实施安全的日志记录实践，不暴露敏感数据

## 资源

有各种资源可用于查找和了解 MCP 服务器。

**以下是查找和了解 MCP 服务器的一些链接资源：**

- **GitHub 存储库：** [https://github.com/modelcontextprotocol/servers](https://github.com/modelcontextprotocol/servers) 和 [https://github.com/punkpeye/awesome-mcp-servers](https://github.com/punkpeye/awesome-mcp-servers)
- **在线目录：** [https://mcpservers.org/](https://mcpservers.org/)、[https://mcp.so/](https://mcp.so/) 和 [https://glama.ai/mcp/servers](https://glama.ai/mcp/servers)
- **PulseMCP：** [https://www.pulsemcp.com/](https://www.pulsemcp.com/)
- **YouTube 教程（AI-Driven Coder）：** 构建和使用 MCP 服务器的视频指南：[https://www.youtube.com/watch?v=b5pqTNiuuJg](https://www.youtube.com/watch?v=b5pqTNiuuJg)


# [🚀 MCP 快速入门指南](https://github.com/cline/cline/blob/main/docs/mcp/mcp-quickstart.md)

## ❓ 什么是 MCP 服务器？

MCP 服务器就像是给 Cline 提供额外能力的特殊助手！它们让 Cline 能够做一些很酷的事情，比如获取网页或处理你的文件。

## ⚠️ 重要：系统要求

停止！在继续之前，你必须验证这些要求：

### 必需软件

- ✅ 最新版 Node.js（v18 或更新版本）

    - 通过运行以下命令检查：`node --version`
    - 从以下网址安装：<https://nodejs.org/>

- ✅ 最新版 Python（v3.8 或更新版本）

    - 通过运行以下命令检查：`python --version`
    - 从以下网址安装：<https://python.org/>

- ✅ UV 包管理器
    - 安装 Python 后，运行：`pip install uv`
    - 使用以下命令验证：`uv --version`

❗ 如果上述任何命令失败或显示较旧版本，请在继续之前进行安装/更新！

⚠️ 如果遇到其他错误，请参阅下方的"故障排除"部分。

## 🎯 快速步骤（仅在满足要求后进行！）

### 1. 🛠️ 安装你的第一个 MCP 服务器

1. 从 Cline 扩展中，点击 `MCP Server` 标签
1. 点击 `Edit MCP Settings` 按钮

 <img src="https://github.com/user-attachments/assets/abf908b1-be98-4894-8dc7-ef3d27943a47" alt="MCP Server Panel" width="400" />

1. MCP 设置文件应该在 VS Code 的标签页中显示。
1. 用以下代码替换文件内容：

对于 Windows：

```json
{
	"mcpServers": {
		"mcp-installer": {
			"command": "cmd.exe",
			"args": ["/c", "npx", "-y", "@anaisbetts/mcp-installer"]
		}
	}
}
```

对于 Mac 和 Linux：

```json
{
	"mcpServers": {
		"mcp-installer": {
			"command": "npx",
			"args": ["@anaisbetts/mcp-installer"]
		}
	}
}
```

保存文件后：

1. Cline 会自动检测变更
2. MCP 安装程序将被下载并安装
3. Cline 将启动 MCP 安装程序
4. 你可以在 Cline 的 MCP 设置 UI 中看到服务器状态：

<img src="https://github.com/user-attachments/assets/2abbb3de-e902-4ec2-a5e5-9418ed34684e" alt="MCP Server Panel with Installer" width="400" />

## 🤔 接下来做什么？

现在你已经安装了 MCP 安装程序，你可以要求 Cline 从以下位置添加更多服务器：

1. NPM 注册表：<https://www.npmjs.com/search?q=%40modelcontextprotocol>
2. Python 包索引：<https://pypi.org/search/?q=mcp+server-&o=>

例如，你可以要求 Cline 安装在 Python 包索引中找到的 `mcp-server-fetch` 包：

```bash
"安装名为 `mcp-server-fetch` 的 MCP 服务器
- 确保 mcp 设置已更新。
- 使用 uvx 或 python 运行服务器。"
```

你将看到 Cline：

1. 安装 `mcp-server-fetch` Python 包
1. 更新 mcp 设置 json 文件
1. 启动服务器并启动服务器

mcp 设置文件现在应该看起来像这样：

_对于 Windows 机器：_

```json
{
	"mcpServers": {
		"mcp-installer": {
			"command": "cmd.exe",
			"args": ["/c", "npx", "-y", "@anaisbetts/mcp-installer"]
		},
		"mcp-server-fetch": {
			"command": "uvx",
			"args": ["mcp-server-fetch"]
		}
	}
}
```

你随时可以通过访问客户端的 MCP 服务器标签来检查服务器状态。参见上方图片

就是这样！🎉 你刚刚给 Cline 增加了一些很棒的新能力！

## 📝 故障排除

### 1. 我使用 `asdf` 并遇到"未知命令：npx"

这里有一些稍微不好的消息。你应该仍然能够让事情正常工作，但除非 MCP 服务器打包有所发展，否则你必须做更多的手动工作。一个选择是卸载 `asdf`，但我们假设你不想这样做。

相反，你需要按照上面的说明"编辑 MCP 设置"。然后，正如[这篇文章](https://dev.to/cojiroooo/mcp-using-node-on-asdf-382n)所描述的，你需要为每个服务器的配置添加一个"env"条目。

```json
"env": {
        "PATH": "/Users/<user_name>/.asdf/shims:/usr/bin:/bin",
        "ASDF_DIR": "<path_to_asdf_bin_dir>",
        "ASDF_DATA_DIR": "/Users/<user_name>/.asdf",
        "ASDF_NODEJS_VERSION": "<your_node_version>"
      }
```

`path_to_asdf_bin_dir` 通常可以在你的 shell 配置文件（例如 `.zshrc`）中找到。如果你使用 Homebrew，你可以使用 `echo ${HOMEBREW_PREFIX}` 找到目录的开始部分，然后附加 `/opt/asdf/libexec`。

现在有一些好消息。虽然不是完美的，但对于后续的服务器安装，你可以相当可靠地让 Cline 为你做这件事。在 Cline 设置（右上角工具栏按钮）中的"自定义指令"中添加以下内容：

> 当安装 MCP 服务器并编辑 cline_mcp_settings.json 时，如果服务器需要使用 `npx` 作为命令，你必须从"mcp-installer"条目复制"env"条目并将其添加到新条目中。这对于使服务器在使用时正常工作至关重要。

### 2. 在运行 MCP 安装程序时仍然出错

如果在运行 MCP 安装程序时出错，你可以尝试以下方法：

- 检查 MCP 设置文件是否有错误
- 阅读 MCP 服务器的文档，确保 MCP 设置文件使用了正确的命令和参数。 👈
- 使用终端直接运行命令及其参数。这将使你能够看到与 Cline 相同的错误。


# [从 GitHub 代码库构建 MCP 服务器](https://github.com/cline/cline/blob/main/docs/mcp/mcp-server-from-github.md)

本指南提供了如何使用Cline从GitHub代码库构建现有MCP服务器的分步指导。

## **寻找MCP服务器**

有多个在线平台可以找到MCP服务器：

- **Cline可以自动将MCP服务器添加到其列表中，然后您可以进行编辑。** Cline能够直接从GitHub克隆代码库并为您构建服务器。
- **GitHub：** 在GitHub上找到MCP服务器的两个最常见位置包括：
  - [官方MCP服务器代码库](https://github.com/modelcontextprotocol/servers)
  - [Awesome-MCP服务器代码库](https://github.com/punkpeye/awesome-mcp-servers)
- **在线目录：** 多个网站列出MCP服务器，包括：

  - [mcpservers.org](https://mcpservers.org/)
  - [mcp.so](https://mcp.so/)
  - [glama.ai/mcp/servers](https://glama.ai/mcp/servers)

  这些目录允许用户按下载量、日期、星标数和用例等各种标准对服务器进行排序。每个条目都提供了功能、工具和配置说明等信息。

- **PulseMCP：** 该网站有一篇博文讨论AI如何使用MCP服务器淘汰网站。PulseMCP还包括关于MCP服务器的常见问题解答部分：[https://www.pulsemcp.com/](https://www.pulsemcp.com/)

## **使用Cline进行构建**

1. **启动流程：** 向Cline提供以下信息：
   - **GitHub代码库URL：** 服务器代码库的URL。
   - **README.md内容：** 这是可选的，但有助于Cline了解服务器的用途和配置。您可以从GitHub代码库复制README.md文件。
2. **与Cline互动示例：**

   ```
   用户："Cline，我想添加用于Brave浏览器控制的MCP服务器。这是GitHub链接：https://github.com/modelcontextprotocol/servers/tree/main/src/brave 你能添加它吗？"

   Cline："好的。正在将代码库克隆到MCP目录。由于它有'package.json'文件，需要构建。我应该运行'npm run build'吗？"

   用户："是的，构建它。"

   Cline："构建完成。这个服务器需要浏览器路径。您的Brave浏览器可执行文件在哪里？"

   用户："它在'/Applications/Brave Browser.app/Contents/MacOS/Brave Browser'。"

   Cline："好的。我已经用该路径更新了服务器配置并将其添加到'cline_mcp_settings.json'。还需要其他操作吗？"

   用户："不，就这些。让我们测试一下。"

   Cline："太好了！正在启动MCP检查器来测试服务器连接。之后，我们可以尝试从Cline控制浏览器。"
   ```

3. **Cline的操作：** 根据您的指示，Cline将执行以下操作：
   - **代码库克隆：** Cline将把代码库克隆到您的本地机器，通常是配置中指定的目录。
   - **调整：** 您可以指导Cline修改服务器的配置。例如：
     - **用户：** "这个服务器需要API密钥。你能找到应该添加到哪里吗？"
     - Cline可能会根据您的指示自动更新`cline_mcp_settings.json`文件或其他相关文件。
   - **构建服务器：** Cline将运行服务器的适当构建命令，通常是`npm run build`。
   - **将服务器添加到设置：** Cline将服务器的配置添加到`cline_mcp_settings.json`文件中。

## **测试和故障排除**

1. **测试服务器：** Cline完成构建过程后，测试服务器以确保它按预期工作。如果遇到任何问题，Cline可以协助您。
2. **MCP检查器：** 您可以使用MCP检查器测试服务器的连接和功能。

## **最佳实践**

- **了解基础知识：** 虽然Cline简化了这个过程，但对服务器代码、MCP协议和如何配置服务器有基本了解是有益的。这能更有效地进行故障排除和定制。
- **清晰指示：** 在整个过程中向Cline提供清晰具体的指示。
- **测试：** 安装和配置后彻底测试服务器，以确保其正常运行。
- **版本控制：** 使用版本控制系统（如Git）跟踪服务器代码的更改。
- **保持更新：** 让您的MCP服务器保持更新，以便从最新功能和安全补丁中受益。


# [从零开始使用 Cline 构建自定义 MCP 服务器：全面指南](https://github.com/cline/cline/blob/main/docs/mcp/mcp-server-from-scratch.md)

本指南提供了使用 Cline 强大的 AI 功能从零开始构建自定义 MCP（模型上下文协议）服务器的全面步骤。示例将是构建一个"GitHub 助手服务器"来说明这一过程。

## 了解 MCP 和 Cline 在构建服务器中的作用

### 什么是 MCP？

模型上下文协议（MCP）充当大型语言模型（LLM，如 Claude）与外部工具和数据之间的桥梁。MCP 由两个关键组件组成：

- **MCP 主机：** 这些是与 LLM 集成的应用程序，如 Cline、Claude Desktop 等。
- **MCP 服务器：** 这些是专门设计用于通过 MCP 向 LLM 公开数据或特定功能的小型程序。

当您拥有符合 MCP 的聊天界面（如 Claude Desktop）时，这种设置非常有益，它可以利用这些服务器访问信息并执行操作。

### 为什么使用 Cline 创建 MCP 服务器？

Cline 通过利用其 AI 功能简化了构建和集成 MCP 服务器的过程：

- **理解自然语言指令：** 您可以以自然的方式与 Cline 沟通，使开发过程直观且用户友好。
- **克隆存储库：** Cline 可以直接从 GitHub 克隆现有的 MCP 服务器存储库，简化使用预构建服务器的过程。
- **构建服务器：** 一旦必要的代码就位，Cline 可以执行诸如 `npm run build` 之类的命令来编译和准备服务器以供使用。
- **处理配置：** Cline 管理 MCP 服务器所需的配置文件，包括将新服务器添加到 `cline_mcp_settings.json` 文件中。
- **协助故障排除：** 如果在开发或测试过程中出现错误，Cline 可以帮助确定原因并提出解决方案，使调试更加容易。

## 使用 Cline 构建 GitHub 助手服务器：分步指南

本节演示如何使用 Cline 创建 GitHub 助手服务器。该服务器将能够与 GitHub 数据交互并执行有用的操作：

### 1. 定义目标和初始需求

首先，您需要向 Cline 清楚地传达服务器的目的和功能：

- **服务器目标：** 告知 Cline 您想要构建"GitHub 助手服务器"。指定此服务器将与 GitHub 数据交互，并可能提及您感兴趣的数据类型，如问题、拉取请求和用户资料。
- **访问需求：** 让 Cline 知道您需要访问 GitHub API。解释这可能需要一个个人访问令牌（GITHUB_TOKEN）进行身份验证。
- **数据特异性（可选）：** 您可以选择告诉 Cline 您想从 GitHub 提取的特定数据字段，但这也可以在您定义服务器工具时确定。

### 2. Cline 启动项目设置

根据您的指示，Cline 开始项目设置过程：

- **项目结构：** Cline 可能会询问您服务器的名称。之后，它使用 MCP `create-server` 工具为您的 GitHub 助手服务器生成基本项目结构。这通常涉及创建一个包含必要文件的新目录，如 package.json、tsconfig.json 和用于 TypeScript 代码的 src 文件夹。
- **代码生成：** Cline 为您的服务器生成初始代码，包括：
  - **文件处理实用程序：** 帮助读取和写入文件的函数，通常用于存储数据或日志。
  - **GitHub API 客户端：** 与 GitHub API 交互的代码，通常使用诸如 `@octokit/graphql` 之类的库。Cline 可能会询问您的 GitHub 用户名或您想要使用的存储库。
  - **核心服务器逻辑：** 处理来自 Cline 的请求并将它们路由到适当函数的基本框架，如 MCP 所定义。
- **依赖管理：** Cline 分析代码并识别必要的依赖项，将它们添加到 package.json 文件中。例如，与 GitHub API 交互可能需要 `@octokit/graphql`、`graphql`、`axios` 或类似的包。
- **依赖安装：** Cline 执行 `npm install` 以下载和安装 package.json 中列出的依赖项，确保您的服务器拥有所有正常运行所需的库。
- **路径修正：** 在开发过程中，您可能会移动文件或目录。Cline 智能地识别这些变更并自动更新代码中的文件路径以保持一致性。
- **配置：** Cline 将修改 `cline_mcp_settings.json` 文件以添加您的新 GitHub 助手服务器。这将包括：
  - **服务器启动命令：** Cline 将添加适当的命令来启动您的服务器（例如，`npm run start` 或类似命令）。
  - **环境变量：** Cline 将添加所需的 `GITHUB_TOKEN` 变量。Cline 可能会询问您的 GitHub 个人访问令牌，或者引导您将其安全地存储在单独的环境文件中。
- **进度文档：** 在整个过程中，Cline 保持"记忆库"文件的更新。这些文件记录了项目的进度，突出显示已完成的任务、进行中的任务和待处理的任务。

### 3. 测试 GitHub 助手服务器

一旦 Cline 完成设置和配置，您就可以测试服务器的功能：

- **使用服务器工具：** Cline 将在您的服务器中创建各种"工具"，代表操作或数据检索功能。要进行测试，您需要指示 Cline 使用特定工具。以下是与 GitHub 相关的示例：
  - **`get_issues`：** 要测试检索问题，您可能会对 Cline 说："Cline，使用 GitHub 助手服务器的 `get_issues` 工具向我展示 'cline/cline' 存储库中的开放问题。" Cline 随后会执行此工具并向您呈现结果。
  - **`get_pull_requests`：** 要测试拉取请求检索，您可以要求 Cline "使用 `get_pull_requests` 工具向我展示上个月 'facebook/react' 存储库中已合并的拉取请求。" Cline 将执行此工具，使用您的 GITHUB_TOKEN 访问 GitHub API，并显示请求的数据。
- **提供必要信息：** Cline 可能会提示您提供执行工具所需的其他信息，如存储库名称、特定日期范围或其他筛选条件。
- **Cline 执行工具：** Cline 处理与 GitHub API 的通信，检索请求的数据，并以清晰易懂的格式呈现。

### 4. 完善服务器并添加更多功能

开发通常是迭代的。在使用 GitHub 助手服务器时，您会发现要添加的新功能或改进现有功能的方法。Cline 可以在这个持续的过程中提供帮助：

- **与 Cline 的讨论：** 与 Cline 讨论您对新工具或改进的想法。例如，您可能想要一个 `create_issue` 或 `get_user_profile` 工具。与 Cline 讨论这些工具所需的输入和输出。
- **代码改进：** Cline 可以帮助您编写新功能所需的代码。Cline 可以生成代码片段，建议最佳实践，并帮助您调试出现的任何问题。
- **测试新功能：** 添加新工具或功能后，您将使用 Cline 再次测试它们，确保它们按预期工作并与服务器的其余部分良好集成。
- **与其他工具集成：** 您可能希望将 GitHub 助手服务器与其他工具集成。例如，在 "github-cline-mcp" 源中，Cline 协助将服务器与 Notion 集成，创建一个跟踪 GitHub 活动的动态仪表板。

通过遵循这些步骤，您可以使用 Cline 从零开始创建自定义 MCP 服务器，利用其强大的 AI 功能简化整个过程。Cline 不仅协助构建服务器的技术方面，还帮助您思考设计、功能和潜在的集成。


# 参考资料
- [Cline and Model Context Protocol (MCP) Servers: Enhancing AI Capabilities](https://github.com/cline/cline/blob/main/docs/mcp/README.md)
- [🚀 MCP Quickstart Guide](https://github.com/cline/cline/blob/main/docs/mcp/mcp-quickstart.md)
- [Building MCP Servers from GitHub Repositories](https://github.com/cline/cline/blob/main/docs/mcp/mcp-server-from-github.md)
- [Building Custom MCP Servers From Scratch Using Cline: A Comprehensive Guide](https://github.com/cline/cline/blob/main/docs/mcp/mcp-server-from-scratch.md)
