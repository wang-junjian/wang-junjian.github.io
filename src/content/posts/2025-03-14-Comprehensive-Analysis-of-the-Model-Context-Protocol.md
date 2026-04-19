---
layout: single
title:  "模型上下文协议 (MCP) 全面解析：原理、应用与实现"
date:   2025-03-14 10:00:00 +0800
categories: MCP Agent
tags: [MCP, Agent, Gemini, DeepResearch, LLM]
---

![](/images/2025/MCP/mcp-architecture.png)

> 这篇文章是使用 [Google Gemini Deep Research](https://gemini.google.com/app) 生成的。提示词：`研究 Model Context Protocol`

## 1. 模型上下文协议 (MCP) 导论

大型语言模型 (LLMs) 在理解和生成人类语言方面取得了显著的进步。然而，这些模型本质上是孤立的，它们的知识仅限于训练数据，并且缺乏与外部世界交互的能力 1。为了克服这些限制，将 LLMs 与外部数据源和工具集成变得至关重要 1。传统上，这种集成是通过为每个新的数据源或工具开发定制的连接器来实现的 1。这种方法导致了集成工作的重复，难以扩展，并且维护成本高昂，阻碍了上下文感知 AI 的广泛采用 1。

为了应对这一挑战，模型上下文协议 (MCP) 应运而生 1。MCP 是一种开放标准，旨在规范应用程序如何向 LLMs 提供上下文和工具 6。可以将 MCP 视为 AI 应用程序的通用连接器，类似于 USB-C 标准化了设备和外设之间的连接 6。通过提供一种标准化的方式将 AI 模型连接到各种数据源和工具，MCP 简化了集成，增强了互操作性，并促进了可扩展性 6。

本报告旨在对模型上下文协议 (MCP) 进行全面的解析，涵盖其基本原理、核心架构、通信机制、广泛的应用场景以及客户端和服务器端的创建方法。通过深入理解 MCP，开发者和组织可以更好地利用这一新兴标准，构建更智能、更具上下文感知能力的 AI 应用。

## 2. MCP 的核心原则与设计理念

MCP 的设计基于若干核心原则，这些原则共同塑造了其架构和功能，使其成为 AI 集成的强大工具。

**标准化** 是 MCP 的首要原则 2。MCP 提供了一个统一的、开放的协议，可以在不同的系统之间工作，而无需为每个数据源或工具进行碎片化的、一次性的集成 2。这与传统方法形成鲜明对比，后者通常需要为每个数据源构建定制的连接器 1。通过采用 MCP，开发者可以遵循一种标准的集成方法来连接任何系统，从而提高 AI 解决方案的可移植性和互操作性 2。这种标准化减少了冗余的开发工作，并促进了不同 AI 模型和数据源之间的互操作性。

**模块化与可组合性** 是 MCP 的另一个关键设计理念 2。MCP 鼓励采用模块化的架构，其中每个集成（服务器）提供专注的功能 2。多个上下文来源可以在同一协议下无缝组合 2。这种模块化的设计意味着 AI 应用程序可以通过根据需要添加或删除 MCP 服务器来轻松扩展和适应新的用例，而无需更改核心逻辑或重新训练模型 2。这种即插即用的功能使得添加新的 AI 功能变得简单高效。

**安全与控制** 在 MCP 的设计中占据核心地位 2。MCP 通过客户端-主机-服务器模式在 AI 和外部工具之间维护清晰的安全边界 2。服务器仅接收执行其任务所需的最低限度的上下文信息，而主机保留完整的对话历史 2。这种隔离以及优先考虑本地或自托管连接的本地优先设计有助于保护敏感数据 2。此外，MCP 强制执行用户授权等最佳实践 2，确保用户对数据访问和工具执行拥有控制权。

**可重用性与可扩展性** 是 MCP 设计的另一个重要方面 2。该协议被设计为随着 AI 能力的增长而可扩展 2。核心协议有意保持最小化，额外的功能可以在客户端和服务器之间逐步协商 2。由于 MCP 是一个开放标准，已经存在一个不断增长的预构建 MCP 服务器（连接器）库，开发者可以重用这些服务器来快速添加功能 1。这种开放的生态系统鼓励社区贡献，并使协议能够不断发展，同时保持向后兼容性。

## 3. MCP 的详细架构与关键组件

模型上下文协议 (MCP) 采用客户端-主机-服务器架构，其中清晰地定义了各个组件的角色和职责，从而实现了模块化、安全且可扩展的 AI 集成 2。这种架构将 LLM 应用程序、连接器和数据/功能提供者明确区分开来，提高了系统的可维护性和灵活性。

在该架构中，**主机 (Host)** 通常是最终用户与之交互的 LLM 应用程序或开发环境，例如 Claude Desktop、IDE 插件或其他 AI 驱动的应用程序 2。主机扮演着容器和协调器的角色 2，负责初始化和管理多个 **客户端 (Client)** 实例 2。主机控制客户端的连接权限和生命周期 14，执行安全策略和用户同意要求 14，处理用户授权决策 18，协调 AI/LLM 的集成和采样 14，并管理跨客户端的上下文聚合 14。主机在整个 MCP 生态系统中起着至关重要的作用，确保安全并协调各种交互。

**客户端 (Client)** 驻留在主机应用程序内部 2，并与一个 **服务器 (Server)** 保持一对一的连接 2。每个客户端都由主机创建，并维护与单个服务器的独立连接 14。客户端负责建立与服务器的单个有状态会话 14，处理协议协商和能力交换 14，双向路由协议消息 14，管理订阅和通知 14，维护服务器之间的安全边界 14，并向服务器发送请求并处理响应 14。客户端充当主机和各个服务器之间安全且受管理的中介。

**服务器 (Server)** 是 MCP 生态系统的骨干，它们提供专门的上下文和功能 2。服务器通过 MCP 原语暴露资源、工具和提示 14，独立运行并专注于特定的职责 14。服务器可以通过客户端接口请求采样 14，并且必须遵守安全约束 14。服务器可以是本地进程或远程服务 14，它们是轻量级程序，通过标准化的协议暴露特定的能力 8。服务器提供各种功能和数据，以增强 LLMs 的能力。

## 4. MCP 通信机制的深入解析

模型上下文协议 (MCP) 的核心在于其定义明确的通信机制，该机制使得主机、客户端和服务器之间能够高效且可靠地交换信息。

MCP 的基础协议是 **JSON-RPC 2.0** 2。JSON-RPC 是一种轻量级的远程过程调用协议，它使用 JSON 数据格式进行通信。采用这种成熟的标准简化了 MCP 的实现，并确保了不同组件之间的互操作性。

MCP 定义了三种核心的 **消息类型** 17：

* **请求 (Requests)**：这些是双向消息，包含方法和参数，并期望接收方返回响应 17。  
* **响应 (Responses)**：这些消息指示对特定请求 ID 的成功结果或错误 17。  
* **通知 (Notifications)**：这些是单向消息，不需要任何响应 17。 这些消息类型为 MCP 中不同组件之间的交互提供了结构化的方式。

MCP 支持多种 **传输机制**，以适应不同的部署场景 2：

* **标准输入/输出 (Stdio)**：这种传输方式适用于本地进程间的通信。客户端将服务器作为子进程启动，并通过标准输入和输出流进行通信 3。  
* **HTTP 与服务器发送事件 (SSE)**：这种传输方式用于需要 HTTP 兼容性的场景，支持本地或远程运行。客户端通过 HTTP POST 请求向服务器发送命令，服务器通过 SSE 向客户端推送消息 2。 支持多种传输机制为不同的部署需求提供了灵活性，从同一机器上的简单本地开发到分布式团队的更复杂场景。

MCP 连接具有清晰的 **连接生命周期** 18：

* **初始化阶段**：客户端和服务器在此阶段协商协议版本和各自支持的功能 2。客户端发送初始化请求，服务器响应其协议版本和功能，然后客户端发送已初始化通知作为确认。  
* **操作阶段**：在初始化之后，客户端和服务器可以根据需要交换消息 18。这包括请求-响应模式和通知。  
* **终止阶段**：连接可以通过多种方式终止，包括通过 close() 方法干净地关闭、传输断开或出现错误情况 18。

**能力协商** 是 MCP 通信的关键方面 3。在初始化期间，客户端和服务器显式声明它们支持的功能。这些功能决定了会话期间可用的协议特性和原语。例如，服务器可以声明它支持资源订阅、工具和提示模板，而客户端可以声明它支持采样和通知处理。双方都必须在整个会话期间遵守声明的功能。这种机制确保了客户端和服务器能够理解彼此的能力并进行有效的通信。

## 5. MCP 的多样化应用与实际用例

模型上下文协议 (MCP) 的灵活性和标准化特性使其在各种应用场景中展现出巨大的潜力，尤其是在需要将大型语言模型 (LLMs) 与外部数据和工具集成以增强其智能和实用性的领域。

**AI 驱动的编码助手** 是 MCP 的一个重要应用领域 1。通过集成 MCP，Sourcegraph Cody、Zed Editor 和 Cursor 等 AI 编码助手可以访问广泛的代码库和文档 3，从而为开发者提供更准确的代码建议和见解。这种集成简化了编码工作流程并提高了生产力。

**AI 驱动的数据查询与分析** 是 MCP 的另一个关键用例 1。例如，AI2SQL 等工具利用 MCP 使得用户可以通过自然语言提示生成 SQL 查询 14。MCP 还支持与各种数据库（如 PostgreSQL、SQLite、Snowflake 和 BigQuery）的集成 1，简化了数据访问和报告过程。

**桌面 AI 应用程序**，如 Claude Desktop 1，通过集成 MCP 可以安全地访问本地文件、应用程序和服务 8。这增强了 AI 助手提供上下文相关响应和有效执行任务的能力。

在 **企业数据助手** 领域，MCP 实现了对公司数据、文档和服务的安全访问 5。Anthropic 提供了针对 Google Drive、Slack、GitHub 等流行企业平台的预构建服务器 1，使得企业内部的 AI 聊天机器人可以在一次对话中查询多个内部系统，例如检索员工的 HR 记录、检查项目细节或在 Slack 中发布更新。

MCP 还有助于 **自动化和工作流程集成** 1。通过连接到项目管理工具（如 GitHub Issues、Linear、Jira）和通信平台（如 Slack、Discord），MCP 可以自动化任务并改进沟通。例如，AI 可以自动创建 bug 报告、更新任务状态或发送通知。

## 6. 创建模型上下文协议 (MCP) 客户端的步骤指南

理解 MCP 客户端的职责是构建有效客户端的第一步。客户端的主要作用是连接到 MCP 服务器，代表主机（通常是 LLM 应用程序）向服务器发送请求，并处理服务器返回的响应 2。这包括管理与服务器的连接，处理通信过程中可能出现的错误，并实施必要的安全措施以保护数据和系统 14。

为了简化客户端的开发，MCP 提供了多种编程语言的软件开发工具包 (SDK)，包括 Python、TypeScript、Java、Kotlin 和 Rust 1。开发者应根据其项目需求和团队的技术栈选择合适的 SDK。官方 SDK 的文档可以在 MCP 的官方网站上找到 33。使用 SDK 可以极大地简化客户端的开发过程，因为它提供了预构建的功能，用于处理与 MCP 服务器的交互，从而开发者可以专注于实现客户端的特定逻辑。

在开始开发之前，需要设置合适的开发环境。这通常涉及到安装必要的工具和依赖项，例如 Node.js 和 npm（对于 TypeScript SDK）或 Python 和 pip（对于 Python SDK）14。具体的设置步骤会根据所选的 SDK 和开发语言而有所不同。

实现 MCP 客户端的核心功能包括以下几个步骤：

* **建立服务器连接**：客户端需要能够初始化与 MCP 服务器的连接，并处理连接建立过程中的握手和初始化序列 14。  
* **发现服务器能力**：客户端需要能够查询服务器以了解其提供的功能，例如可用的工具、资源和提示 3。  
* **发送请求和处理响应**：客户端需要能够根据服务器的能力构建和发送符合 MCP 协议的请求，并正确地处理服务器返回的各种类型的响应，包括成功响应、错误消息和通知 3。  
* **管理安全和权限**：客户端需要实施安全措施，例如验证服务器的能力，并在必要时执行用户同意流程，以确保与服务器的交互是安全和授权的 2。

以下是一个简化的 Python 代码示例，演示了连接到 MCP 服务器并列出可用工具的基本步骤 37：

Python

`from mcp import ClientSession, StdioServerParameters`  
`import asyncio`

`async def main():`  
    `server_params = StdioServerParameters(`  
        `command="path/to/your/mcp_server.py" # 替换为您的 MCP 服务器脚本路径`  
    `)`  
    `async with StdioClient(server_params) as (reader, writer):`  
        `async with ClientSession(reader, writer) as session:`  
            `await session.initialize()`  
            `tools = await session.tools.list()`  
            `print("Available tools:", tools)`

`if __name__ == "__main__":`  
    `asyncio.run(main())`

这个示例展示了使用 Python MCP SDK 连接到本地服务器并检索可用工具列表的基本流程。实际的客户端实现会更复杂，需要处理各种请求类型、响应格式和错误情况。

## 7. 开发模型上下文协议 (MCP) 服务器的全面指南

开发 MCP 服务器的关键在于理解服务器可以提供的各种能力，这些能力是 LLM 应用程序通过 MCP 协议进行交互的基础。服务器主要可以提供三种类型的能力：工具 (Tools)、资源 (Resources) 和提示 (Prompts) 2。**工具** 是服务器暴露的可执行函数，允许 LLM 与外部应用程序进行交互，类似于传统 LLM 调用中的函数 3。**资源** 是服务器暴露的数据源，客户端可以读取这些数据，例如 API 响应或文件内容 3。**提示** 是预定义的模板或指令，用于指导语言模型的交互 3。

与客户端开发类似，开发者可以利用 MCP 提供的各种语言的 SDK 来简化服务器的开发 1。选择合适的 SDK 并设置好开发环境是开始服务器开发的前提。

实现 MCP 服务器的核心功能包括：

* **处理客户端连接和服务器生命周期**：服务器需要能够监听客户端的连接请求，并管理连接的整个生命周期，包括初始化、操作和关闭阶段 10。  
* **暴露工具**：服务器需要定义工具的模式，并实现工具的执行逻辑。这通常涉及到接收来自客户端的工具调用请求，执行相应的操作，并将结果返回给客户端 3。  
* **暴露资源**：服务器需要定义资源的 URI，并实现数据检索的逻辑。当客户端请求特定资源时，服务器需要能够定位并返回相应的数据 3。  
* **暴露提示**：服务器需要定义提示模板，并实现处理客户端发送的参数化提示请求的逻辑，从而生成定制的文本输出 3。  
* **处理协议通信**：服务器需要正确地实现 MCP 的通信协议，包括消息的格式化、错误的处理以及与客户端进行能力协商 2。

以下是一个简化的 Python 代码示例，演示了如何使用 FastMCP 库暴露一个基本的工具 14：

Python

`from typing import Any`  
`import httpx`  
`from mcp.server.fastmcp import FastMCP`

`# 初始化 FastMCP 服务器`  
`mcp = FastMCP("weather")`

`# 定义一个工具来获取指定位置的天气预报`  
`@mcp.tool()`  
`async def get_forecast(latitude: float, longitude: float) -> str:`  
    `"""获取指定位置的天气预报。"""`  
    `base_url = "https://api.weather.gov/points/{latitude},{longitude}"`  
    `async with httpx.AsyncClient() as client:`  
        `response = await client.get(base_url)`  
        `response.raise_for_status()`  
        `forecast_url = response.json()['properties']['forecast']`  
        `forecast_response = await client.get(forecast_url)`  
        `forecast_response.raise_for_status()`  
        `return forecast_response.json()['properties']['periods'][0]['detailedForecast']`

`if __name__ == "__main__":`  
    `mcp.run(transport='stdio')`

这个示例展示了如何使用 Python 的 FastMCP 库创建一个名为 "weather" 的 MCP 服务器，并暴露一个名为 get\_forecast 的工具，该工具接受纬度和经度作为参数，并返回相应的天气预报。实际的服务器实现可能需要处理更复杂的逻辑、参数验证和错误处理。

## 8. 对比分析：MCP 与传统 API 及其他相关协议

模型上下文协议 (MCP) 的出现旨在解决传统 API 在 AI 集成方面的一些局限性，并与其他相关协议形成差异化的定位。

与传统的 **REST API** 相比，MCP 在多个方面展现出优势 7。传统的 API 通常需要为每个服务进行单独的集成，而 MCP 提供了一个单一的标准化的集成方式 7。MCP 支持实时的双向通信，这与传统 API 的请求-响应模式不同 7。此外，MCP 允许 AI 模型动态地发现和交互可用的工具，而无需硬编码每个集成的知识 7。在可扩展性方面，MCP 提供了即插即用的扩展能力，而传统 API 则需要额外的集成工作 7。MCP 在安全性控制方面提供了一致的方法，而传统 API 的安全性因服务而异 7。最后，MCP 接口本身是自描述的，而传统 API 的文档通常是外部的且可能不完整 7。

| 特性 | MCP | 传统 API |
| :---- | :---- | :---- |
| 集成工作量 | 单一、标准化集成 | 每个 API 单独集成 |
| 实时通信 | 是 | 否 |
| 动态发现 | 是 | 否 |
| 可扩展性 | 简单（即插即用） | 需要额外的集成 |
| 安全性与控制 | 在所有工具中一致 | 因 API 而异 |
| 文档 | 自描述 | 外部且常常不完整 |
| 演变 | 适应而不破坏客户端 | 版本控制难题 |

与 **gRPC** 相比，虽然两者都采用了客户端-服务器架构，但它们的设计目标和底层技术有所不同 1。gRPC 是一种高性能、通用的开源 RPC 框架，它使用 Protocol Buffers 进行序列化，通常在微服务架构中用于构建高效的内部服务通信 1。MCP 则更专注于为 AI 模型集成提供特定的功能，例如提示和资源 1。虽然 gRPC 在性能方面可能更优，但 MCP 专门为 AI 集成的需求进行了定制。

**MQTT** 是一种轻量级的基于发布/订阅模式的消息传递协议，常用于物联网 (IoT) 设备 1。与 MCP 的客户端-服务器模型不同，MQTT 依赖于消息代理来处理发布者和订阅者之间的通信 1。MQTT 主要用于资源受限的设备和实时数据流，而 MCP 则侧重于为 AI 模型提供结构化的上下文和工具。

**WebSockets** 是一种提供全双工通信通道的网络协议 1。虽然 WebSockets 可以作为 MCP 的传输层之一 1，但它本身是一个通用的双向通信协议。MCP 在 WebSockets 等传输协议之上构建，定义了在 AI 交互上下文中交换数据的结构和语义。

## 9. 实施 MCP 的关键安全考量

在实施模型上下文协议 (MCP) 时，必须高度重视安全性，以确保用户数据的隐私和系统的完整性。

**用户同意与控制** 是 MCP 安全性的基石 2。用户必须明确同意并理解所有的数据访问和操作。实施者应提供清晰的用户界面，以便用户审查和授权活动 17。用户应保留对其共享数据和执行操作的完全控制权。

**数据隐私** 同样至关重要 17。在向服务器暴露用户数据之前，主机必须获得用户的明确同意 17。未经用户同意，主机不得将资源数据传输到其他地方 17。用户数据应通过适当的访问控制进行保护 8。

由于 **工具安全性** 涉及任意代码的执行，因此必须格外谨慎 17。在调用任何工具之前，主机必须获得用户的明确同意 3。用户应在授权使用每个工具之前了解其功能。

对于 **LLM 采样控制**，用户必须明确批准任何 LLM 采样请求 17。用户应能够控制是否进行采样，实际发送的提示内容以及服务器可以看到的结果 17。协议有意限制服务器对提示的可见性。

为了确保 MCP 的安全实施，建议遵循以下 **最佳实践**：

* 构建强大的同意和授权流程 8。  
* 提供清晰的安全隐患文档 17。  
* 实施适当的访问控制和数据保护措施 8。  
* 在集成中遵循安全最佳实践 8。  
* 在功能设计中考虑隐私影响 17。  
* 验证所有输入（资源 URI、工具参数、提示参数）并进行清理 19。  
* 对网络传输使用 TLS 19。  
* 加密敏感数据 20。

## 10. 结论与模型上下文协议 (MCP) 的未来展望

模型上下文协议 (MCP) 作为一种新兴的开放标准，为解决大型语言模型 (LLMs) 与外部数据源和工具集成的挑战提供了一个有力的解决方案。其核心优势在于 **标准化** 2，通过提供一个统一的协议，简化了原本复杂的集成过程，降低了开发成本，并提高了不同 AI 模型和数据源之间的 **互操作性** 2。**模块化** 的架构 2 使得 AI 应用能够灵活地扩展和适应新的需求，而无需对核心逻辑进行修改。同时，MCP 内置的 **安全机制** 2 和对用户 **控制权** 的强调，为构建可信赖的 AI 应用奠定了基础。此外，MCP 的 **可重用性** 和 **可扩展性** 2 鼓励社区贡献，并预示着一个不断壮大的 AI 工具和集成生态系统的未来 5。

目前，MCP 仍处于积极开发阶段 10，但已经吸引了包括 Anthropic、Cursor、Zed 和 Sourcegraph 等公司的早期采用 1。预构建的 MCP 服务器也正在不断增加，涵盖了 Google Drive、Slack、GitHub 等常用平台 1。尽管如此，MCP 仍然存在一些需要解决的限制，例如工具数量的限制、远程开发的支持以及对资源功能的完善 13。

展望未来，MCP 有望继续发展并引入更多高级功能，例如增强的代理支持、远程能力和开放治理 7。作为一个开源项目 1，MCP 的未来将受到社区的积极参与和贡献的影响，以满足不断变化的 AI 技术需求。

我们鼓励开发者和组织积极探索模型上下文协议 (MCP)，并参与到这个充满潜力的生态系统中，共同构建更智能、更具上下文感知能力的 AI 应用。

| 组件 | 描述 | 角色 |
| :---- | :---- | :---- |
| MCP 主机 | 需要外部数据访问的应用程序 | 发起请求并处理响应 |
| MCP 客户端 | 连接管理器 | 维护与 MCP 服务器的专用链接 |
| MCP 服务器 | 轻量级接口服务器 | 通过标准化协议提供功能 |

## 引用的著作

1. Introducing the Model Context Protocol \\ Anthropic, 访问时间为 三月 14, 2025， [https://www.anthropic.com/news/model-context-protocol](https://www.anthropic.com/news/model-context-protocol)  
2. The Complete Guide to Model Context Protocol  by Niall McNulty  Mar, 2025  Medium, 访问时间为 三月 14, 2025， [https://medium.com/@niall.mcnulty/the-complete-guide-to-model-context-protocol-148dca58f148](https://medium.com/@niall.mcnulty/the-complete-guide-to-model-context-protocol-148dca58f148)  
3. Model Context Protocol (MCP) \- NSHipster, 访问时间为 三月 14, 2025， [https://nshipster.com/model-context-protocol/](https://nshipster.com/model-context-protocol/)  
4. What is the Model Context Protocol (MCP) and How It Works \- Security Boulevard, 访问时间为 三月 14, 2025， [https://securityboulevard.com/2025/03/what-is-the-model-context-protocol-mcp-and-how-it-works/](https://securityboulevard.com/2025/03/what-is-the-model-context-protocol-mcp-and-how-it-works/)  
5. The Model Context Protocol (MCP) by Anthropic: Origins, functionality, and impact \- Wandb, 访问时间为 三月 14, 2025， [https://wandb.ai/onlineinference/mcp/reports/The-Model-Context-Protocol-MCP-by-Anthropic-Origins-functionality-and-impact--VmlldzoxMTY5NDI4MQ](https://wandb.ai/onlineinference/mcp/reports/The-Model-Context-Protocol-MCP-by-Anthropic-Origins-functionality-and-impact--VmlldzoxMTY5NDI4MQ)  
6. A Complete Guide to the Model Context Protocol (MCP) in 2025 \- Keywords AI, 访问时间为 三月 14, 2025， [https://www.keywordsai.co/blog/introduction-to-mcp](https://www.keywordsai.co/blog/introduction-to-mcp)  
7. Deep Dive into Model Context Protocol (MCP) \- Portkey, 访问时间为 三月 14, 2025， [https://portkey.ai/blog/model-context-protocol/](https://portkey.ai/blog/model-context-protocol/)  
8. What is Model Context Protocol (MCP)? How it simplifies AI integrations compared to APIs, 访问时间为 三月 14, 2025， [https://norahsakal.com/blog/mcp-vs-api-model-context-protocol-explained/](https://norahsakal.com/blog/mcp-vs-api-model-context-protocol-explained/)  
9. Using LangChain With Model Context Protocol (MCP)  by Cobus Greyling  Mar, 2025, 访问时间为 三月 14, 2025， [https://cobusgreyling.medium.com/using-langchain-with-model-context-protocol-mcp-e89b87ee3c4c](https://cobusgreyling.medium.com/using-langchain-with-model-context-protocol-mcp-e89b87ee3c4c)  
10. Is Anthropic's Model Context Protocol Right for You? \- WillowTree Apps, 访问时间为 三月 14, 2025， [https://www.willowtreeapps.com/craft/is-anthropic-model-context-protocol-right-for-you](https://www.willowtreeapps.com/craft/is-anthropic-model-context-protocol-right-for-you)  
11. What is the Model Context Protocol (MCP)? \- WorkOS, 访问时间为 三月 14, 2025， [https://workos.com/blog/model-context-protocol](https://workos.com/blog/model-context-protocol)  
12. docs.cursor.com, 访问时间为 三月 14, 2025， [https://docs.cursor.com/context/model-context-protocol\#:\~:text=The%20Model%20Context%20Protocol%20(MCP,and%20tools%20through%20standardized%20interfaces.](https://docs.cursor.com/context/model-context-protocol#:~:text=The%20Model%20Context%20Protocol%20\(MCP,and%20tools%20through%20standardized%20interfaces.)  
13. Model Context Protocol \- Cursor, 访问时间为 三月 14, 2025， [https://docs.cursor.com/context/model-context-protocol](https://docs.cursor.com/context/model-context-protocol)  
14. Everything You Need to Know About the Model Context Protocol (MCP) from Anthropic, 访问时间为 三月 14, 2025， [https://medium.com/@glennlenormand/everything-you-need-to-know-about-the-model-context-protocol-mcp-from-anthropic-84acdb3c1a2f](https://medium.com/@glennlenormand/everything-you-need-to-know-about-the-model-context-protocol-mcp-from-anthropic-84acdb3c1a2f)  
15. Model Context Protocol (MCP) \- Anthropic API, 访问时间为 三月 14, 2025， [https://docs.anthropic.com/en/docs/agents-and-tools/mcp](https://docs.anthropic.com/en/docs/agents-and-tools/mcp)  
16. Model Context Protocol: Introduction, 访问时间为 三月 14, 2025， [https://modelcontextprotocol.io/introduction](https://modelcontextprotocol.io/introduction)  
17. Specification (Latest) – Model Context Protocol Specification, 访问时间为 三月 14, 2025， [https://spec.modelcontextprotocol.io/specification/2024-11-05/](https://spec.modelcontextprotocol.io/specification/2024-11-05/)  
18. What is Model Context Protocol (MCP): Explained \- Composio, 访问时间为 三月 14, 2025， [https://composio.dev/blog/what-is-model-context-protocol-mcp-explained/](https://composio.dev/blog/what-is-model-context-protocol-mcp-explained/)  
19. Core architecture \- Model Context Protocol, 访问时间为 三月 14, 2025， [https://modelcontextprotocol.io/docs/concepts/architecture](https://modelcontextprotocol.io/docs/concepts/architecture)  
20. model-context-protocol-resources/guides/mcp-server-development-guide.md at main \- GitHub, 访问时间为 三月 14, 2025， [https://github.com/cyanheads/model-context-protocol-resources/blob/main/guides/mcp-server-development-guide.md](https://github.com/cyanheads/model-context-protocol-resources/blob/main/guides/mcp-server-development-guide.md)  
21. model-context-protocol-resources/guides/mcp-client-development-guide.md at main \- GitHub, 访问时间为 三月 14, 2025， [https://github.com/cyanheads/model-context-protocol-resources/blob/main/guides/mcp-client-development-guide.md](https://github.com/cyanheads/model-context-protocol-resources/blob/main/guides/mcp-client-development-guide.md)  
22. The official Python SDK for Model Context Protocol servers and clients \- GitHub, 访问时间为 三月 14, 2025， [https://github.com/modelcontextprotocol/python-sdk](https://github.com/modelcontextprotocol/python-sdk)  
23. Model Context Protocol (MCP) Quickstart \- Glama, 访问时间为 三月 14, 2025， [https://glama.ai/blog/2024-11-25-model-context-protocol-quickstart](https://glama.ai/blog/2024-11-25-model-context-protocol-quickstart)  
24. What is MCP (Model Context Protocol)? \- Daily.dev, 访问时间为 三月 14, 2025， [https://daily.dev/blog/what-is-mcp-model-context-protocol](https://daily.dev/blog/what-is-mcp-model-context-protocol)  
25. For Server Developers \- Model Context Protocol, 访问时间为 三月 14, 2025， [https://modelcontextprotocol.io/quickstart/server](https://modelcontextprotocol.io/quickstart/server)  
26. Example Servers \- Model Context Protocol, 访问时间为 三月 14, 2025， [https://modelcontextprotocol.io/examples](https://modelcontextprotocol.io/examples)  
27. modelcontextprotocol/servers: Model Context Protocol Servers \- GitHub, 访问时间为 三月 14, 2025， [https://github.com/modelcontextprotocol/servers](https://github.com/modelcontextprotocol/servers)  
28. Architecture – Model Context Protocol Specification, 访问时间为 三月 14, 2025， [https://spec.modelcontextprotocol.io/specification/draft/architecture/](https://spec.modelcontextprotocol.io/specification/draft/architecture/)  
29. Model Context Protocol (MCP) :: Spring AI Reference, 访问时间为 三月 14, 2025， [https://docs.spring.io/spring-ai/reference/api/mcp/mcp-overview.html](https://docs.spring.io/spring-ai/reference/api/mcp/mcp-overview.html)  
30. Example Clients \- Model Context Protocol, 访问时间为 三月 14, 2025， [https://modelcontextprotocol.io/clients](https://modelcontextprotocol.io/clients)  
31. Introducing the Model Context Protocol Java SDK \- Spring, 访问时间为 三月 14, 2025， [https://spring.io/blog/2025/02/14/mcp-java-sdk-released-2/](https://spring.io/blog/2025/02/14/mcp-java-sdk-released-2/)  
32. MCP Client \- Model Context Protocol, 访问时间为 三月 14, 2025， [https://modelcontextprotocol.io/sdk/java/mcp-client](https://modelcontextprotocol.io/sdk/java/mcp-client)  
33. Model Context Protocol \- GitHub, 访问时间为 三月 14, 2025， [https://github.com/modelcontextprotocol](https://github.com/modelcontextprotocol)  
34. How to implement a Model Context Protocol (MCP) server with SSE? \- Stack Overflow, 访问时间为 三月 14, 2025， [https://stackoverflow.com/questions/79505420/how-to-implement-a-model-context-protocol-mcp-server-with-sse](https://stackoverflow.com/questions/79505420/how-to-implement-a-model-context-protocol-mcp-server-with-sse)  
35. Introducing Model Context Protocol servers project \- Quarkus, 访问时间为 三月 14, 2025， [https://quarkus.io/blog/introducing-mcp-servers/](https://quarkus.io/blog/introducing-mcp-servers/)  
36. MCP Server \- Model Context Protocol, 访问时间为 三月 14, 2025， [https://modelcontextprotocol.io/sdk/java/mcp-server](https://modelcontextprotocol.io/sdk/java/mcp-server)  
37. For Client Developers \- Model Context Protocol, 访问时间为 三月 14, 2025， [https://modelcontextprotocol.io/quickstart/client](https://modelcontextprotocol.io/quickstart/client)  
38. Standardizing for Commoditization — Anthropic's Model Context Protocol (MCP) \- Medium, 访问时间为 三月 14, 2025， [https://medium.com/@sam.r.bobo/standardizing-for-commoditization-anthropics-model-context-protocol-mcp-47711a968b32](https://medium.com/@sam.r.bobo/standardizing-for-commoditization-anthropics-model-context-protocol-mcp-47711a968b32)  
39. Why You Should Choose gRPC Over HTTP for Your Next API Project \- Apidog, 访问时间为 三月 14, 2025， [https://apidog.com/blog/grpc-vs-http/](https://apidog.com/blog/grpc-vs-http/)  
40. Model Context Protocol vs Web of Things · modelcontextprotocol · Discussion \#56 \- GitHub, 访问时间为 三月 14, 2025， [https://github.com/orgs/modelcontextprotocol/discussions/56](https://github.com/orgs/modelcontextprotocol/discussions/56)  
41. A Model Context Protocol (MCP) server implementation that provides EMQX MQTT broker interaction. \- Reddit, 访问时间为 三月 14, 2025， [https://www.reddit.com/r/mcp/comments/1j26fca/emqxmcpserver\_a\_model\_context\_protocol\_mcp\_server/](https://www.reddit.com/r/mcp/comments/1j26fca/emqxmcpserver_a_model_context_protocol_mcp_server/)  
42. What is MQTT? \- MQTT Protocol Explained \- AWS, 访问时间为 三月 14, 2025， [https://aws.amazon.com/what-is/mqtt/](https://aws.amazon.com/what-is/mqtt/)
