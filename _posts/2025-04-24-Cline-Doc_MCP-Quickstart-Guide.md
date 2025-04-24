---
layout: post
title:  "MCP 快速入门指南"
date:   2025-04-24 08:00:00 +0800
categories: ClineDoc MCP
tags: [Cline, MCP, ClineDoc]
---

# [🚀 MCP 快速入门指南](https://github.com/cline/cline/blob/main/docs/mcp/mcp-quickstart.md)

## ❓ 什么是 MCP 服务器？

可以把 MCP 服务器想象成给 Cline 提供额外功能的特殊助手！它们让 Cline 能够完成像获取网页或处理文件这样的酷炫功能。

## ⚠️ 重要提示：系统要求

停一下！在继续之前，你必须验证以下要求：

### 必需软件

-   ✅ 最新版本的 Node.js (v18 或更新版本)

    -   通过运行以下命令检查：`node --version`
    -   从这里安装：<https://nodejs.org/>

-   ✅ 最新版本的 Python (v3.8 或更新版本)

    -   通过运行以下命令检查：`python --version`
    -   从这里安装：<https://python.org/>

-   ✅ UV 包管理器
    -   安装 Python 后，运行：`pip install uv`
    -   使用以下命令验证：`uv --version`

❗ 如果以上任何命令失败或显示较旧的版本，请在继续之前进行安装/更新！

⚠️ 如果遇到其他错误，请参见下方的"故障排除"部分。

## 🎯 快速步骤（仅在满足要求后执行！）

### 1. 🛠️ 安装你的第一个 MCP 服务器

1. 在 Cline 扩展中，点击 `MCP Server` 标签
1. 点击 `Edit MCP Settings` 按钮

 <img src="https://github.com/user-attachments/assets/abf908b1-be98-4894-8dc7-ef3d27943a47" alt="MCP 服务器面板" width="400" />

1. MCP 设置文件应该会在 VS Code 中显示。
1. 将文件内容替换为以下代码：

Windows 系统：

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

Mac 和 Linux 系统：

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

1. Cline 将自动检测更改
2. MCP 安装程序将被下载并安装
3. Cline 将启动 MCP 安装程序
4. 你可以在 Cline 的 MCP 设置界面中看到服务器状态：

<img src="https://github.com/user-attachments/assets/2abbb3de-e902-4ec2-a5e5-9418ed34684e" alt="带有安装程序的 MCP 服务器面板" width="400" />

## 🤔 接下来做什么？

现在你已经安装了 MCP 安装程序，你可以让 Cline 从以下位置添加更多服务器：

1. NPM 注册表：<https://www.npmjs.com/search?q=%40modelcontextprotocol>
2. Python 包索引：<https://pypi.org/search/?q=mcp+server-&o=>

例如，你可以让 Cline 安装在 Python 包索引中找到的 `mcp-server-fetch` 包：

```bash
"安装名为 `mcp-server-fetch` 的 MCP 服务器
- 确保更新 mcp 设置
- 使用 uvx 或 python 运行服务器"
```

你应该会看到 Cline：

1. 安装 `mcp-server-fetch` python 包
1. 更新 mcp 设置 json 文件
1. 启动服务器

mcp 设置文件现在应该如下所示：

_Windows 系统：_

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

你随时可以通过进入客户端的 MCP 服务器标签来检查服务器状态。参见上图

就是这样！🎉 你刚刚给 Cline 添加了一些很棒的新功能！

## 📝 故障排除

### 1. 我正在使用 `asdf` 并收到 "unknown command: npx" 错误

这里有一些不太好的消息。你仍然可以让一切正常工作，但除非 MCP 服务器打包方式有所改进，否则需要做更多的手动工作。一个选择是卸载 `asdf`，但我们假设你不想这样做。

相反，你需要按照上述说明"编辑 MCP 设置"。然后，如[这篇文章](https://dev.to/cojiroooo/mcp-using-node-on-asdf-382n)所述，你需要为每个服务器的配置添加 "env" 条目。

```json
"env": {
        "PATH": "/Users/<用户名>/.asdf/shims:/usr/bin:/bin",
        "ASDF_DIR": "<asdf_bin_目录路径>",
        "ASDF_DATA_DIR": "/Users/<用户名>/.asdf",
        "ASDF_NODEJS_VERSION": "<你的_node_版本>"
      }
```

`asdf_bin_目录路径` 通常可以在你的 shell 配置文件（如 `.zshrc`）中找到。如果你使用 Homebrew，可以使用 `echo ${HOMEBREW_PREFIX}` 找到目录的起始位置，然后附加 `/opt/asdf/libexec`。

现在是一些好消息。虽然不是完美的，但对于后续的服务器安装，你可以让 Cline 相当可靠地为你完成这项工作。在 Cline 设置（右上角工具栏按钮）中的"自定义说明"中添加以下内容：

> 在安装 MCP 服务器和编辑 cline_mcp_settings.json 时，如果服务器需要使用 `npx` 作为命令，你必须从 "mcp-installer" 条目中复制 "env" 条目并将其添加到新条目中。这对于让服务器正常工作至关重要。

### 2. 运行 MCP 安装程序时仍然出现错误

如果运行 MCP 安装程序时出现错误，你可以尝试以下方法：

-   检查 MCP 设置文件是否有错误
-   阅读 MCP 服务器的文档，确保 MCP 设置文件使用了正确的命令和参数 👈
-   使用终端直接运行命令及其参数。这样你就能看到 Cline 看到的相同错误。