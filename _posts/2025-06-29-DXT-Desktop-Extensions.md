---
layout: single
title:  "Desktop Extensions (DXT)"
date:   2025-06-29 12:00:00 +0800
categories: DXT MCP
tags: [DXT, MCP, MCPServer, LLM]
---

桌面扩展（DXT）是一种 **zip 格式的软件包**，旨在**简化本地 MCP 服务器的安装和分发**。它类似于其他应用程序扩展，通过包含一个本地 MCP 服务器及其功能的 **manifest.json** 文件，允许用户实现**一键安装**。该项目不仅提供**扩展规范和用于创建 DXT 文件的 CLI 工具**，还开源了 Claude for macOS and Windows 中用于加载和验证 DXT 扩展的代码，旨在为 MCP 服务器构建一个**开放且可移植的生态系统**。开发者只需将 MCP 服务器文件、manifest.json 放入文件夹并打包成 .dxt 文件，即可轻松创建扩展，从而方便地在支持 DXT 的应用程序中运行本地 AI 工具。

<!--more-->

## [桌面扩展 (DXT)](https://github.com/anthropics/dxt)

桌面扩展 (`.dxt`) 是一种 zip 压缩包，其中包含一个本地 MCP 服务器和一个 `manifest.json` 文件，该文件描述了服务器及其功能。其格式在理念上类似于 Chrome 扩展 (`.crx`) 或 VS Code 扩展 (`.vsix`)，使用户能够一键安装本地 MCP 服务器。

本仓库提供三个组件：[MANIFEST.md](MANIFEST.md) 中的扩展规范，一个用于创建扩展的 CLI 工具（参见 [CLI.md](CLI.md)），以及 Claude for macOS and Windows 用于加载和验证 DXT 扩展的代码 ([src/index.ts](src/index.ts))。

- 对于本地 MCP 服务器的开发者，我们旨在使其分发和安装更加便捷
- 对于支持本地 MCP 服务器的应用开发者，我们旨在使其能够轻松添加对 DXT 扩展的支持

Claude for macOS and Windows 使用本仓库中的代码来实现本地 MCP 服务器的一键安装，包括许多对最终用户友好的功能——例如自动更新、轻松配置 MCP 服务器及其所需的变量和参数，以及一个精选的目录。我们致力于围绕 MCP 服务器构建开放的生态系统，并相信其被多个应用程序和服务普遍采用的能力，将惠及那些旨在将 AI 工具连接到其他应用和服务的开发者。因此，我们开源了桌面扩展规范、工具链，以及 Claude for macOS and Windows 用于实现其自身对桌面扩展支持的模式和关键功能。我们希望 `dxt` 格式不仅能让本地 MCP 服务器在 Claude 中更具可移植性，也能为其他 AI 桌面应用带来便利。

## 面向扩展开发者

DXT 的核心是包含您的整个 MCP 服务器和 `manifest.json` 的简单 zip 文件。因此，将本地 MCP 服务器转换为扩展非常直接：您只需将所有必需文件放入一个文件夹，创建一个 `manifest.json`，然后创建一个压缩包。

为了简化此过程，本软件包提供了一个 CLI 工具，可帮助您创建 `manifest.json` 和最终的 `.dxt` 文件。要安装它，请运行：

```sh
npm install -g @anthropic-ai/dxt
```

1.  在包含您的本地 MCP 服务器的文件夹中，运行 `dxt init`。此命令将指导您创建 `manifest.json`。
2.  运行 `dxt pack` 来创建一个 `dxt` 文件。
3.  现在，任何实现 DXT 支持的应用程序都可以运行您的本地 MCP 服务器。例如，使用 Claude for macOS and Windows 打开该文件会显示一个安装对话框。

您可以在 [MANIFEST.md](MANIFEST.md) 中找到 `manifest.json` 的完整规范及其所有必需和可选字段。扩展示例可以在 [examples](./examples/) 中找到。

### AI 工具的提示模板

像 Claude Code 这样的 AI 工具在被告知规范后，特别擅长创建桌面扩展。在提示 AI 编码工具构建扩展时，请简要说明您的扩展旨在实现的目标 - 然后在您的指令中添加以下上下文。

> 我想将此构建为桌面扩展（缩写为“DXT”）。请遵循以下步骤：
>
> 1.  **仔细阅读规范：**
>     - https://github.com/anthropics/dxt/blob/main/README.md - DXT 架构概述、功能和集成模式
>     - https://github.com/anthropics/dxt/blob/main/MANIFEST.md - 完整的扩展清单结构和字段定义
>     - https://github.com/anthropics/dxt/tree/main/examples - 参考实现，包括一个“Hello World”示例
> 2.  **创建正确的扩展结构：**
>     - 遵循 MANIFEST.md 规范生成一个有效的 manifest.json
>     - 使用 @modelcontextprotocol/sdk 实现一个带有正确工具定义的 MCP 服务器
>     - 包括适当的错误处理、安全措施和超时管理
> 3.  **遵循最佳开发实践：**
>     - 通过 stdio 传输实现正确的 MCP 协议通信
>     - 使用清晰的模式、验证和一致的 JSON 响应来构建工具
>     - 利用此扩展将在本地运行的特点
>     - 添加适当的日志记录和调试功能
>     - 包括适当的文档和设置说明
> 4.  **测试注意事项：**
>     - 验证所有工具调用都返回结构正确的响应
>     - 验证清单是否正确加载以及与主机的集成是否正常工作
>
> 生成可立即测试的、完整的、生产就绪的代码。专注于防御性编程、清晰的错误消息，并严格遵循 DXT 规范，以确保与生态系统的兼容性。

### 目录结构

#### 最小化扩展

`manifest.json` 是唯一必需的文件。

#### 示例：Node.js 扩展

```
extension.dxt (ZIP 文件)
├── manifest.json         # 必需：扩展元数据和配置
├── server/               # 服务器文件
│   └── index.js          # 主入口点
├── node_modules/         # 打包的依赖项
├── package.json          # 可选：NPM 包定义
├── icon.png              # 可选：扩展图标
└── assets/               # 可选：其他资产
```

#### 示例：Python 扩展

```
extension.dxt (ZIP 文件)
├── manifest.json         # 必需：扩展元数据和配置
├── server/               # 服务器文件
│   ├── main.py           # 主入口点
│   └── utils.py          # 其他模块
├── lib/                  # 打包的 Python 包
├── requirements.txt      # 可选：Python 依赖项列表
└── icon.png              # 可选：扩展图标
```

#### 示例：二进制扩展

```
extension.dxt (ZIP 文件)
├── manifest.json         # 必需：扩展元数据和配置
├── server/               # 服务器文件
│   ├── my-server         # Unix 可执行文件
│   ├── my-server.exe     # Windows 可执行文件
└── icon.png              # 可选：扩展图标
```

#### 打包依赖项

**Python 扩展：**

-   将所有必需的包打包在 `server/lib/` 目录中
-   或者将完整的虚拟环境打包在 `server/venv/` 中
-   使用 `pip-tools`、`poetry` 或 `pipenv` 等工具创建可复现的包
-   通过 `mcp_config.env` 设置 `PYTHONPATH` 以包含打包的包

**Node.js 扩展：**

-   运行 `npm install --production` 来创建 `node_modules`
-   将整个 `node_modules` 目录与您的扩展一起打包
-   使用 `npm ci` 或 `yarn install --frozen-lockfile` 进行可复现的构建
-   服务器入口点在 manifest.json 的 `server.entry_point` 中指定

**二进制扩展：**

-   首选静态链接以获得最大兼容性
-   如果使用动态链接，则包含所有必需的共享库
-   在没有开发工具的干净系统上进行测试


## DXT 示例

此[目录](https://github.com/anthropics/dxt/tree/main/examples)包含示例桌面扩展 (Desktop Extensions)，展示了 DXT 格式和清单（manifest）结构。这些是**参考实现**，旨在说明如何构建 DXT 扩展。

### ⚠️ 非生产就绪

**重要提示：** 这些示例**不适用于生产环境**。它们的作用是：

  - 演示 DXT 清单格式
  - 作为构建您自己扩展的模板
  - 用于测试的简单 MCP 服务器实现

但是，MCP 服务器本身并非健壮、安全的生产就绪服务器，不应依赖它们用于生产用途。

### 包含的示例

| 示例                | 类型      | 演示内容                               |
| :------------------ | :-------- | :------------------------------------- |
| `hello-world-node`  | Node.js   | 带有简单时间工具的基本 MCP 服务器      |
| `chrome-applescript` | Node.js   | 通过 AppleScript 进行浏览器自动化       |
| `file-manager-python` | Python    | 文件系统操作和路径处理                 |

### 用法

每个示例都包含自己的 `manifest.json` 文件，并可以使用以下命令打包：

```bash
dxt pack examples/hello-world-node
```

请将这些示例作为您自己扩展的起点，但在向用户部署之前，请务必实施适当的安全措施。


## 参考资料
- [Desktop Extensions (DXT)](https://github.com/anthropics/dxt)
- [Desktop Extensions: One-click MCP server installation for Claude Desktop](https://www.anthropic.com/engineering/desktop-extensions)
- [DXT Examples](https://github.com/anthropics/dxt/tree/main/examples)
- [DXT Manifest.json Spec](https://github.com/anthropics/dxt/blob/main/MANIFEST.md)
