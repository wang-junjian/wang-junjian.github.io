---
layout: post
title:  "支持 MCP 集成的应用程序列表"
date:   2025-04-02 12:00:00 +0800
categories: MCP Client
tags: [MCP, Client, LLM]
---

- [Example Clients](https://modelcontextprotocol.io/clients)

本页概述了支持模型上下文协议(Model Context Protocol, MCP)的应用程序。每个客户端可能支持不同的MCP功能，从而实现与MCP服务器的不同级别的集成。

## 功能支持矩阵

| 客户端                                     | [资源] | [提示] | [工具] | [采样] | 根节点 | 备注                                                        |
|-------------------------------------------|--------|--------|--------|--------|--------|-------------------------------------------------------------|
| [Claude桌面应用][Claude]                  | ✅     | ✅     | ✅     | ❌     | ❌     | 支持所有MCP功能                                             |
| [Claude Code][Claude Code]                | ❌     | ✅     | ✅     | ❌     | ❌     | 支持提示和工具                                              |
| [5ire][5ire]                              | ❌     | ❌     | ✅     | ❌     | ❌     | 支持工具                                                    |
| [BeeAI Framework][BeeAI Framework]        | ❌     | ❌     | ✅     | ❌     | ❌     | 在智能体工作流中支持工具                                    |
| [Cline][Cline]                            | ✅     | ❌     | ✅     | ❌     | ❌     | 支持工具和资源                                              |
| [Continue][Continue]                      | ✅     | ✅     | ✅     | ❌     | ❌     | 支持所有MCP功能                                             |
| [Copilot-MCP][CopilotMCP]                 | ✅     | ❌     | ✅     | ❌     | ❌     | 支持工具和资源                                              |
| [Cursor][Cursor]                          | ❌     | ❌     | ✅     | ❌     | ❌     | 支持工具                                                    |
| [Emacs Mcp][Mcp.el]                       | ❌     | ❌     | ✅     | ❌     | ❌     | 在Emacs中支持工具                                           |
| [fast-agent][fast-agent]                  | ✅     | ✅     | ✅     | ✅     | ✅     | 完整的多模态MCP支持，带端到端测试                           |
| [Genkit][Genkit]                          | ⚠️     | ✅     | ✅     | ❌     | ❌     | 通过工具支持资源列表和查询                                  |
| [GenAIScript][GenAIScript]                | ❌     | ❌     | ✅     | ❌     | ❌     | 支持工具                                                    |
| [Goose][Goose]                            | ❌     | ❌     | ✅     | ❌     | ❌     | 支持工具                                                    |
| [LibreChat][LibreChat]                    | ❌     | ❌     | ✅     | ❌     | ❌     | 为智能体支持工具                                            |
| [mcp-agent][mcp-agent]                    | ❌     | ❌     | ✅     | ⚠️     | ❌     | 支持工具、服务器连接管理和智能体工作流                      |
| [Microsoft Copilot Studio]                | ❌     | ❌     | ✅     | ❌     | ❌     | 支持工具                                                    |
| [oterm][oterm]                            | ❌     | ✅     | ✅     | ❌     | ❌     | 支持工具和提示                                              |
| [Roo Code][Roo Code]                      | ✅     | ❌     | ✅     | ❌     | ❌     | 支持工具和资源                                              |
| [Sourcegraph Cody][Cody]                  | ✅     | ❌     | ❌     | ❌     | ❌     | 通过OpenCTX支持资源                                         |
| [Superinterface][Superinterface]          | ❌     | ❌     | ✅     | ❌     | ❌     | 支持工具                                                    |
| [TheiaAI/TheiaIDE][TheiaAI/TheiaIDE]      | ❌     | ❌     | ✅     | ❌     | ❌     | 为Theia AI和AI驱动的Theia IDE中的智能体支持工具             |
| [Windsurf Editor][Windsurf]               | ❌     | ❌     | ✅     | ❌     | ❌     | 通过AI Flow支持协作开发的工具                               |
| [Witsy][Witsy]                            | ❌     | ❌     | ✅     | ❌     | ❌     | 在Witsy中支持工具                                           |
| [Zed][Zed]                                | ❌     | ✅     | ❌     | ❌     | ❌     | 提示以斜杠命令形式出现                                      |
| [SpinAI][SpinAI]                          | ❌     | ❌     | ✅     | ❌     | ❌     | 为Typescript AI智能体支持工具                               |
| [OpenSumi][OpenSumi]                      | ❌     | ❌     | ✅     | ❌     | ❌     | 在OpenSumi中支持工具                                        |
| [Daydreams Agents][Daydreams]             | ✅     | ✅     | ✅     | ❌     | ❌     | 支持将服务器集成到Daydreams智能体                           |
| [Apify MCP Tester][Apify MCP Tester]      | ❌     | ❌     | ✅     | ❌     | ❌     | 支持工具                                                    |

[Claude]: https://claude.ai/download
[Claude Code]: https://claude.ai/code
[Cursor]: https://cursor.com
[Zed]: https://zed.dev
[Cody]: https://sourcegraph.com/cody
[Genkit]: https://github.com/firebase/genkit
[Continue]: https://github.com/continuedev/continue
[GenAIScript]: https://microsoft.github.io/genaiscript/reference/scripts/mcp-tools/
[Cline]: https://github.com/cline/cline
[LibreChat]: https://github.com/danny-avila/LibreChat
[TheiaAI/TheiaIDE]: https://eclipsesource.com/blogs/2024/12/19/theia-ide-and-theia-ai-support-mcp/
[Superinterface]: https://superinterface.ai
[5ire]: https://github.com/nanbingxyz/5ire
[Apify MCP Tester]: https://apify.com/jiri.spilka/tester-mcp-client
[BeeAI Framework]: https://i-am-bee.github.io/beeai-framework
[fast-agent]: https://github.com/evalstate/fast-agent
[mcp-agent]: https://github.com/lastmile-ai/mcp-agent
[Mcp.el]: https://github.com/lizqwerscott/mcp.el
[Roo Code]: https://roocode.com
[Goose]: https://block.github.io/goose/docs/goose-architecture/#interoperability-with-extensions
[Witsy]: https://github.com/nbonamy/witsy
[Windsurf]: https://codeium.com/windsurf
[CopilotMCP]: https://github.com/VikashLoomba/copilot-mcp
[Daydreams]: https://github.com/daydreamsai/daydreams
[SpinAI]: https://spinai.dev
[OpenSumi]: https://github.com/opensumi/core
[oterm]: https://github.com/ggozad/oterm
[资源]: https://modelcontextprotocol.io/docs/concepts/resources
[提示]: https://modelcontextprotocol.io/docs/concepts/prompts
[工具]: https://modelcontextprotocol.io/docs/concepts/tools
[采样]: https://modelcontextprotocol.io/docs/concepts/sampling
[Microsoft Copilot Studio]: https://learn.microsoft.com/en-us/microsoft-copilot-studio/agent-extend-action-mcp

## 客户端详情

### Claude桌面应用
Claude桌面应用提供全面的MCP支持，实现与本地工具和数据源的深度集成。

**主要功能：**
- 全面支持资源，允许附加本地文件和数据
- 支持提示模板
- 工具集成，用于执行命令和脚本
- 本地服务器连接，增强隐私和安全性

> ⓘ 注意：Claude.ai网页应用目前不支持MCP。MCP功能仅在桌面应用中可用。

### Claude Code
Claude Code是Anthropic提供的交互式智能编码工具，通过自然语言命令帮助您更快地编码。它支持MCP集成的提示和工具，并作为MCP服务器与其他客户端集成。

**主要功能：**
- 支持MCP服务器的工具和提示
- 通过MCP服务器提供自己的工具，与其他MCP客户端集成

### 5ire
[5ire](https://github.com/nanbingxyz/5ire)是一个开源跨平台桌面AI助手，通过MCP服务器支持工具。

**主要功能：**
- 内置MCP服务器可以快速启用和禁用
- 用户可以通过修改配置文件添加更多服务器
- 开源且用户友好，适合初学者
- 未来将持续改进MCP支持

### BeeAI Framework
[BeeAI Framework](https://i-am-bee.github.io/beeai-framework)是一个开源框架，用于构建、部署和提供大规模强大的智能体工作流。该框架包括**MCP Tool**，这是一个原生功能，简化了MCP服务器集成到智能体工作流中的过程。

**主要功能：**
- 无缝将MCP工具集成到智能体工作流中
- 快速实例化来自连接的MCP客户端的框架原生工具
- 计划未来支持智能体MCP功能

**了解更多：**
- [在智能体工作流中使用MCP工具的示例](https://i-am-bee.github.io/beeai-framework/#/typescript/tools?id=using-the-mcptool-class)

### Cline
[Cline](https://github.com/cline/cline)是VS Code中的自主编码助手，可以编辑文件、运行命令、使用浏览器等——每一步都需要您的许可。

**主要功能：**
- 通过自然语言创建和添加工具（例如"添加一个搜索网络的工具"）
- 通过`~/Documents/Cline/MCP`目录与他人共享Cline创建的自定义MCP服务器
- 显示已配置的MCP服务器及其工具、资源和任何错误日志

### Continue
[Continue](https://github.com/continuedev/continue)是一个开源AI代码助手，内置支持所有MCP功能。

**主要功能**
- 输入"@"提及MCP资源
- 提示模板以斜杠命令形式呈现
- 在聊天中直接使用内置和MCP工具
- 支持VS Code和JetBrains IDE，兼容任何LLM

### Cursor
[Cursor](https://docs.cursor.com/advanced/model-context-protocol)是一个AI代码编辑器。

**主要功能**：
- 在Cursor Composer中支持MCP工具
- 同时支持STDIO和SSE

### Emacs Mcp
[Emacs Mcp](https://github.com/lizqwerscott/mcp.el)是一个设计用于与MCP服务器交互的Emacs客户端，支持无缝连接和交互。它为像[gptel](https://github.com/karthink/gptel)和[llm](https://github.com/ahyatt/llm)这样的AI插件提供MCP工具调用支持，遵循Emacs的标准工具调用格式。这种集成增强了Emacs生态系统中AI工具的功能。

**主要功能：**
- 为Emacs提供MCP工具支持。

### fast-agent
[fast-agent](https://github.com/evalstate/fast-agent)是一个Python智能体框架，具有简单的声明式支持，用于创建智能体和工作流，并完全支持Anthropic和OpenAI模型的多模态功能。

**主要功能：**
- 基于MCP原生类型的PDF和图像支持
- 交互式前端用于开发和诊断智能体应用，包括直通和回放模拟器
- 内置支持"构建有效智能体"工作流
- 将智能体部署为MCP服务器

### Genkit
[Genkit](https://github.com/firebase/genkit)是一个跨语言SDK，用于构建和集成GenAI功能到应用程序中。[genkitx-mcp](https://github.com/firebase/genkit/tree/main/js/plugins/mcp)插件使得可以作为客户端使用MCP服务器，或从Genkit工具和提示创建MCP服务器。

**主要功能：**
- 客户端支持工具和提示（部分支持资源）
- 在Genkit的Dev UI游乐场中支持丰富的发现功能
- 与Genkit现有工具和提示无缝互操作
- 适用于来自顶级提供商的各种GenAI模型

### GenAIScript
使用[GenAIScript](https://microsoft.github.io/genaiscript/)（JavaScript）以编程方式组装LLM提示。在JavaScript中编排LLM、工具和数据。

**主要功能：**
- 处理提示的JavaScript工具箱
- 使其简单高效的抽象
- 与Visual Studio Code无缝集成

### Goose
[Goose](https://github.com/block/goose)是一个开源AI智能体，通过自动化编码任务增强您的软件开发。

**主要功能：**
- 通过工具向Goose公开MCP功能
- MCP可以直接通过[扩展目录](https://block.github.io/goose/v1/extensions/)、CLI或UI安装
- Goose允许您通过[构建自己的MCP服务器](https://block.github.io/goose/docs/tutorials/custom-extensions)扩展其功能
- 包含用于开发、网络抓取、自动化、内存以及与JetBrains和Google Drive集成的内置工具

### LibreChat
[LibreChat](https://github.com/danny-avila/LibreChat)是一个开源、可定制的AI聊天UI，支持多个AI提供商，现在包括MCP集成。

**主要功能：**
- 通过MCP服务器扩展当前工具生态系统，包括[代码解释器](https://www.librechat.ai/docs/features/code_interpreter)和图像生成工具
- 使用来自顶级提供商的各种LLM，将工具添加到可定制的[智能体](https://www.librechat.ai/docs/features/agents)中
- 开源且可自托管，具有安全的多用户支持
- 未来路线图包括扩展MCP功能支持

### mcp-agent
[mcp-agent]是一个简单、可组合的框架，用于使用模型上下文协议构建智能体。

**主要功能：**
- 自动管理MCP服务器连接
- 将多个服务器的工具暴露给LLM
- 实现[构建有效智能体](https://www.anthropic.com/research/building-effective-agents)中定义的每种模式
- 支持工作流暂停/恢复信号，例如等待人类反馈

### Microsoft Copilot Studio
[Microsoft Copilot Studio]是一个强大的SaaS平台，专为构建自定义AI驱动的应用程序和智能智能体而设计，使开发人员能够创建、部署和管理复杂的AI解决方案。

**主要功能：**
- 支持MCP工具
- 使用MCP服务器扩展Copilot Studio智能体
- 利用Microsoft统一、受管理且安全的API管理解决方案

### oterm
[oterm]是一个Ollama终端客户端，允许用户创建聊天/智能体。

**主要功能：**

 - 支持多个完全可定制的聊天会话，通过工具与Ollama连接
 - 支持MCP工具

### Roo Code
[Roo Code](https://roocode.com)通过MCP启用AI编码辅助。

**主要功能：**
- 支持MCP工具和资源
- 与开发工作流集成
- 可扩展的AI能力

### Sourcegraph Cody
[Cody](https://openctx.org/docs/providers/modelcontextprotocol)是Sourcegraph的AI编码助手，通过OpenCTX实现MCP。

**主要功能：**
- 支持MCP资源
- 与Sourcegraph的代码智能集成
- 使用OpenCTX作为抽象层
- 计划未来支持更多MCP功能

### SpinAI
[SpinAI](https://spinai.dev)是一个开源TypeScript框架，用于构建可观察的AI智能体。该框架提供原生MCP兼容性，允许智能体无缝集成MCP服务器和工具。

**主要功能：**
- 为AI智能体内置MCP兼容性
- 开源TypeScript框架
- 可观察的智能体架构
- 原生支持MCP工具集成

### Superinterface
[Superinterface](https://superinterface.ai)是AI基础设施和开发者平台，用于构建支持MCP、交互式组件、客户端函数调用等的应用内AI助手。

**主要功能：**
- 在通过React组件或脚本标签嵌入的助手中使用MCP服务器的工具
- SSE传输支持
- 使用任何AI提供商（OpenAI、Anthropic、Ollama等）的任何AI模型

### TheiaAI/TheiaIDE
[Theia AI](https://eclipsesource.com/blogs/2024/10/07/introducing-theia-ai/)是一个用于构建AI增强工具和IDE的框架。[AI驱动的Theia IDE](https://eclipsesource.com/blogs/2024/10/08/introducting-ai-theia-ide/)是基于Theia AI构建的开放且灵活的开发环境。

**主要功能：**
- **工具集成**：Theia AI使AI智能体（包括Theia IDE中的智能体）能够利用MCP服务器进行无缝工具交互。
- **可定制提示**：Theia IDE允许用户定义和调整提示，动态集成MCP服务器以实现定制工作流。
- **自定义智能体**：Theia IDE支持创建利用MCP功能的自定义智能体，使用户能够动态设计专用工作流。

Theia AI和Theia IDE的MCP集成为用户提供了灵活性，使它们成为强大的平台，用于探索和适应MCP。

**了解更多：**
- [Theia IDE和Theia AI MCP公告](https://eclipsesource.com/blogs/2024/12/19/theia-ide-and-theia-ai-support-mcp/)
- [下载AI驱动的Theia IDE](https://theia-ide.org/)

### Windsurf Editor
[Windsurf Editor](https://codeium.com/windsurf)是一个智能IDE，结合了AI辅助和开发者工作流。它具有创新的AI Flow系统，支持协作和独立的AI交互，同时保持开发者控制。

**主要功能：**
- 革命性的人机协作AI Flow范式
- 智能代码生成和理解
- 丰富的开发工具，支持多模型

### Witsy
[Witsy](https://github.com/nbonamy/witsy)是一个AI桌面助手，支持Anthropic模型和MCP服务器作为LLM工具。

**主要功能：**
- 支持多个MCP服务器
- 工具集成，用于执行命令和脚本
- 本地服务器连接，增强隐私和安全性
- 可从Smithery.ai轻松安装
- 开源，适用于macOS、Windows和Linux

### Zed
[Zed](https://zed.dev/docs/assistant/model-context-protocol)是一个高性能代码编辑器，内置MCP支持，专注于提示模板和工具集成。

**主要功能：**
- 提示模板在编辑器中以斜杠命令形式呈现
- 增强编码工作流的工具集成
- 与编辑器功能和工作区上下文紧密集成
- 不支持MCP资源

### OpenSumi
[OpenSumi](https://github.com/opensumi/core)是一个帮助您快速构建AI原生IDE产品的框架。

**主要功能：**
- 在OpenSumi中支持MCP工具
- 支持内置IDE MCP服务器和自定义MCP服务器

### Daydreams
[Daydreams](https://github.com/daydreamsai/daydreams)是一个生成式智能体框架，用于在链上执行任何操作。

**主要功能：**
- 在配置中支持MCP服务器
- 公开MCP客户端

### Apify MCP Tester

[Apify MCP Tester](https://github.com/apify/tester-mcp-client)是一个开源客户端，使用服务器发送事件(SSE)连接到任何MCP服务器。
这是一个独立的Apify Actor，设计用于通过SSE测试MCP服务器，支持授权头。
它使用纯JavaScript（老式风格）并托管在Apify上，允许您无需任何设置即可运行它。

**主要功能：**
- 通过SSE连接到任何MCP服务器
- 配合[Apify MCP Server](https://apify.com/apify/actors-mcp-server)使用，与一个或多个Apify [Actors](https://apify.com/store)交互
- 根据上下文和用户查询动态利用工具（如果服务器支持）

## 为您的应用程序添加MCP支持

如果您已经为应用程序添加了MCP支持，我们鼓励您提交拉取请求，将其添加到此列表中。MCP集成可以为您的用户提供强大的上下文AI功能，并使您的应用程序成为不断增长的MCP生态系统的一部分。

添加MCP支持的好处：
- 使用户能够带来自己的上下文和工具
- 加入不断增长的可互操作AI应用生态系统
- 为用户提供灵活的集成选项
- 支持本地优先的AI工作流

要开始在您的应用程序中实现MCP，请查看我们的[Python](https://github.com/modelcontextprotocol/python-sdk)或[TypeScript SDK文档](https://github.com/modelcontextprotocol/typescript-sdk)

## 更新和修正

此列表由社区维护。如果您发现任何不准确之处或想更新有关应用程序MCP支持的信息，请提交拉取请求或[在我们的文档存储库中打开一个问题](https://github.com/modelcontextprotocol/docs/issues)。
