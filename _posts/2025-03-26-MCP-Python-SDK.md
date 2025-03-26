---
layout: post
title:  MCP Python SDK"
date:   2025-03-26 12:00:00 +0800
categories: MCP Python
tags: [MCP, Python, SDK]
---

## 概述

Model Context Protocol 允许应用程序以标准化的方式为 LLM 提供上下文，将提供上下文的关注点与实际的 LLM 交互分离开来。这个 Python SDK 实现了完整的 MCP 规范，使您能够轻松地：

- 构建可连接到任何 MCP 服务器的 MCP 客户端
- 创建暴露资源、提示和工具的 MCP 服务器
- 使用标准传输方式如 stdio 和 SSE
- 处理所有 MCP 协议消息和生命周期事件

## 安装

### 将 MCP 添加到您的 Python 项目中

我们推荐使用 [uv](https://docs.astral.sh/uv/) 来管理您的 Python 项目。在由 uv 管理的 Python 项目中，通过以下方式将 mcp 添加到依赖项：

```bash
uv add "mcp[cli]"
```

或者，对于使用 pip 管理依赖的项目：
```bash
pip install mcp
```

### 运行独立的 MCP 开发工具

要使用 uv 运行 mcp 命令：

```bash
uv run mcp
```

## 快速开始

让我们创建一个简单的 MCP 服务器，它暴露一个计算器工具和一些数据：

```python
# server.py
from mcp.server.fastmcp import FastMCP

# 创建一个 MCP 服务器
mcp = FastMCP("Demo")


# 添加一个加法工具
@mcp.tool()
def add(a: int, b: int) -> int:
    """将两个数字相加"""
    return a + b


# 添加一个动态问候资源
@mcp.resource("greeting://{name}")
def get_greeting(name: str) -> str:
    """获取个性化问候"""
    return f"你好，{name}！"
```

您可以在 [Claude Desktop](https://claude.ai/download) 中安装此服务器并通过以下命令立即与其交互：
```bash
mcp install server.py
```

或者，您可以使用 MCP Inspector 进行测试：
```bash
mcp dev server.py
```

## 什么是 MCP？

[Model Context Protocol (MCP)](https://modelcontextprotocol.io) 让您能够构建服务器，以安全、标准化的方式向 LLM 应用程序暴露数据和功能。可以将其视为专为 LLM 交互设计的 Web API。MCP 服务器可以：

- 通过**资源**暴露数据（可以将其视为类似 GET 端点；用于将信息加载到 LLM 的上下文中）
- 通过**工具**提供功能（类似 POST 端点；用于执行代码或产生副作用）
- 通过**提示**定义交互模式（用于 LLM 交互的可复用模板）
- 等等！

## 核心概念

### 服务器

FastMCP 服务器是您与 MCP 协议的核心接口。它处理连接管理、协议合规性和消息路由：

```python
# 添加具有启动/关闭功能的生命周期支持，带有强类型
from contextlib import asynccontextmanager
from dataclasses import dataclass
from typing import AsyncIterator

from fake_database import Database  # 替换为您实际的数据库类型

from mcp.server.fastmcp import Context, FastMCP

# 创建一个命名服务器
mcp = FastMCP("My App")

# 为部署和开发指定依赖
mcp = FastMCP("My App", dependencies=["pandas", "numpy"])


@dataclass
class AppContext:
    db: Database


@asynccontextmanager
async def app_lifespan(server: FastMCP) -> AsyncIterator[AppContext]:
    """使用类型安全的上下文管理应用程序生命周期"""
    # 启动时初始化
    db = await Database.connect()
    try:
        yield AppContext(db=db)
    finally:
        # 关闭时清理
        await db.disconnect()


# 将生命周期传递给服务器
mcp = FastMCP("My App", lifespan=app_lifespan)


# 在工具中访问类型安全的生命周期上下文
@mcp.tool()
def query_db(ctx: Context) -> str:
    """使用初始化资源的工具"""
    db = ctx.request_context.lifespan_context["db"]
    return db.query()
```

### 资源

资源是向 LLM 暴露数据的方式。它们类似于 REST API 中的 GET 端点 - 它们提供数据但不应执行重要计算或产生副作用：

```python
from mcp.server.fastmcp import FastMCP

mcp = FastMCP("My App")


@mcp.resource("config://app")
def get_config() -> str:
    """静态配置数据"""
    return "App 配置在这里"


@mcp.resource("users://{user_id}/profile")
def get_user_profile(user_id: str) -> str:
    """动态用户数据"""
    return f"用户 {user_id} 的资料数据"
```

### 工具

工具允许 LLM 通过您的服务器执行操作。与资源不同，工具预期会执行计算并产生副作用：

```python
import httpx
from mcp.server.fastmcp import FastMCP

mcp = FastMCP("My App")


@mcp.tool()
def calculate_bmi(weight_kg: float, height_m: float) -> float:
    """计算 BMI，给定以千克为单位的体重和以米为单位的身高"""
    return weight_kg / (height_m**2)


@mcp.tool()
async def fetch_weather(city: str) -> str:
    """获取城市的当前天气"""
    async with httpx.AsyncClient() as client:
        response = await client.get(f"https://api.weather.com/{city}")
        return response.text
```

### 提示

提示是可复用的模板，帮助 LLM 有效地与您的服务器交互：

```python
from mcp.server.fastmcp import FastMCP, types

mcp = FastMCP("My App")


@mcp.prompt()
def review_code(code: str) -> str:
    return f"请审查这段代码：\n\n{code}"


@mcp.prompt()
def debug_error(error: str) -> list[types.Message]:
    return [
        types.UserMessage("我看到这个错误："),
        types.UserMessage(error),
        types.AssistantMessage("我会帮助调试。你尝试过什么方法？"),
    ]
```

### 图像

FastMCP 提供了一个 `Image` 类，自动处理图像数据：

```python
from mcp.server.fastmcp import FastMCP, Image
from PIL import Image as PILImage

mcp = FastMCP("My App")


@mcp.tool()
def create_thumbnail(image_path: str) -> Image:
    """从图像创建缩略图"""
    img = PILImage.open(image_path)
    img.thumbnail((100, 100))
    return Image(data=img.tobytes(), format="png")
```

### 上下文

Context 对象让您的工具和资源能够访问 MCP 功能：

```python
from mcp.server.fastmcp import FastMCP, Context

mcp = FastMCP("My App")


@mcp.tool()
async def long_task(files: list[str], ctx: Context) -> str:
    """处理多个文件并跟踪进度"""
    for i, file in enumerate(files):
        ctx.info(f"正在处理 {file}")
        await ctx.report_progress(i, len(files))
        data, mime_type = await ctx.read_resource(f"file://{file}")
    return "处理完成"
```

## 运行服务器

### 开发模式

测试和调试服务器的最快方法是使用 MCP Inspector：

```bash
mcp dev server.py

# 添加依赖
mcp dev server.py --with pandas --with numpy

# 挂载本地代码
mcp dev server.py --with-editable .
```

### Claude 桌面版集成

当您的服务器准备就绪，将其安装到 Claude Desktop：

```bash
mcp install server.py

# 自定义名称
mcp install server.py --name "我的分析服务器"

# 环境变量
mcp install server.py -v API_KEY=abc123 -v DB_URL=postgres://...
mcp install server.py -f .env
```

### 直接执行

对于自定义部署等高级场景：

```python
from mcp.server.fastmcp import FastMCP

mcp = FastMCP("My App")

if __name__ == "__main__":
    mcp.run()
```

运行方式：
```bash
python server.py
# 或
mcp run server.py
```

## 示例

### Echo 服务器

一个演示资源、工具和提示的简单服务器：

```python
from mcp.server.fastmcp import FastMCP

mcp = FastMCP("Echo")


@mcp.resource("echo://{message}")
def echo_resource(message: str) -> str:
    """作为资源回显消息"""
    return f"资源回显：{message}"


@mcp.tool()
def echo_tool(message: str) -> str:
    """作为工具回显消息"""
    return f"工具回显：{message}"


@mcp.prompt()
def echo_prompt(message: str) -> str:
    """创建回显提示"""
    return f"请处理此消息：{message}"
```

### SQLite 浏览器

一个展示数据库集成的更复杂示例：

```python
import sqlite3

from mcp.server.fastmcp import FastMCP

mcp = FastMCP("SQLite 浏览器")


@mcp.resource("schema://main")
def get_schema() -> str:
    """将数据库架构作为资源提供"""
    conn = sqlite3.connect("database.db")
    schema = conn.execute("SELECT sql FROM sqlite_master WHERE type='table'").fetchall()
    return "\n".join(sql[0] for sql in schema if sql[0])


@mcp.tool()
def query_data(sql: str) -> str:
    """安全执行 SQL 查询"""
    conn = sqlite3.connect("database.db")
    try:
        result = conn.execute(sql).fetchall()
        return "\n".join(str(row) for row in result)
    except Exception as e:
        return f"错误：{str(e)}"
```

## 高级用法

### 底层服务器

要获得更多控制，您可以直接使用底层服务器实现。这让您能够完全访问协议并自定义服务器的各个方面，包括通过生命周期 API 进行的生命周期管理：

```python
from contextlib import asynccontextmanager
from typing import AsyncIterator

from fake_database import Database  # 替换为您实际的数据库类型

from mcp.server import Server


@asynccontextmanager
async def server_lifespan(server: Server) -> AsyncIterator[dict]:
    """管理服务器启动和关闭生命周期。"""
    # 在启动时初始化资源
    db = await Database.connect()
    try:
        yield {"db": db}
    finally:
        # 在关闭时清理
        await db.disconnect()


# 将生命周期传递给服务器
server = Server("example-server", lifespan=server_lifespan)


# 在处理程序中访问生命周期上下文
@server.call_tool()
async def query_db(name: str, arguments: dict) -> list:
    ctx = server.request_context
    db = ctx.lifespan_context["db"]
    return await db.query(arguments["query"])
```

生命周期 API 提供：
- 在服务器启动时初始化资源并在停止时清理资源的方法
- 通过请求上下文在处理程序中访问初始化的资源
- 在生命周期和请求处理程序之间进行类型安全的上下文传递

```python
import mcp.server.stdio
import mcp.types as types
from mcp.server.lowlevel import NotificationOptions, Server
from mcp.server.models import InitializationOptions

# 创建服务器实例
server = Server("example-server")


@server.list_prompts()
async def handle_list_prompts() -> list[types.Prompt]:
    return [
        types.Prompt(
            name="example-prompt",
            description="一个示例提示模板",
            arguments=[
                types.PromptArgument(
                    name="arg1", description="示例参数", required=True
                )
            ],
        )
    ]


@server.get_prompt()
async def handle_get_prompt(
    name: str, arguments: dict[str, str] | None
) -> types.GetPromptResult:
    if name != "example-prompt":
        raise ValueError(f"未知提示：{name}")

    return types.GetPromptResult(
        description="示例提示",
        messages=[
            types.PromptMessage(
                role="user",
                content=types.TextContent(type="text", text="示例提示文本"),
            )
        ],
    )


async def run():
    async with mcp.server.stdio.stdio_server() as (read_stream, write_stream):
        await server.run(
            read_stream,
            write_stream,
            InitializationOptions(
                server_name="example",
                server_version="0.1.0",
                capabilities=server.get_capabilities(
                    notification_options=NotificationOptions(),
                    experimental_capabilities={},
                ),
            ),
        )


if __name__ == "__main__":
    import asyncio

    asyncio.run(run())
```

### 编写 MCP 客户端

SDK 提供了一个高级客户端接口，用于连接到 MCP 服务器：

```python
from mcp import ClientSession, StdioServerParameters, types
from mcp.client.stdio import stdio_client

# 为 stdio 连接创建服务器参数
server_params = StdioServerParameters(
    command="python",  # 可执行文件
    args=["example_server.py"],  # 可选命令行参数
    env=None,  # 可选环境变量
)


# 可选：创建采样回调
async def handle_sampling_message(
    message: types.CreateMessageRequestParams,
) -> types.CreateMessageResult:
    return types.CreateMessageResult(
        role="assistant",
        content=types.TextContent(
            type="text",
            text="你好，世界！来自模型",
        ),
        model="gpt-3.5-turbo",
        stopReason="endTurn",
    )


async def run():
    async with stdio_client(server_params) as (read, write):
        async with ClientSession(
            read, write, sampling_callback=handle_sampling_message
        ) as session:
            # 初始化连接
            await session.initialize()

            # 列出可用提示
            prompts = await session.list_prompts()

            # 获取提示
            prompt = await session.get_prompt(
                "example-prompt", arguments={"arg1": "value"}
            )

            # 列出可用资源
            resources = await session.list_resources()

            # 列出可用工具
            tools = await session.list_tools()

            # 读取资源
            content, mime_type = await session.read_resource("file://some/path")

            # 调用工具
            result = await session.call_tool("tool-name", arguments={"arg1": "value"})


if __name__ == "__main__":
    import asyncio

    asyncio.run(run())
```

### MCP 原语

MCP 协议定义了三个服务器可以实现的核心原语：

| 原语 | 控制 | 描述 | 示例用途 |
|------|------|------|----------|
| 提示 | 用户控制 | 由用户选择调用的交互式模板 | 斜杠命令、菜单选项 |
| 资源 | 应用程序控制 | 由客户端应用程序管理的上下文数据 | 文件内容、API 响应 |
| 工具 | 模型控制 | 暴露给 LLM 用于执行操作的函数 | API 调用、数据更新 |

### 服务器能力

MCP 服务器在初始化期间声明能力：

| 能力 | 功能标志 | 描述 |
|------|----------|------|
| `prompts` | `listChanged` | 提示模板管理 |
| `resources` | `subscribe`<br/>`listChanged` | 资源暴露和更新 |
| `tools` | `listChanged` | 工具发现和执行 |
| `logging` | - | 服务器日志配置 |
| `completion` | - | 参数完成建议 |

## 文档

- [Model Context Protocol 文档](https://modelcontextprotocol.io)
- [Model Context Protocol 规范](https://spec.modelcontextprotocol.io)
- [官方支持的服务器](https://github.com/modelcontextprotocol/servers)


[pypi-badge]: https://img.shields.io/pypi/v/mcp.svg
[pypi-url]: https://pypi.org/project/mcp/
[mit-badge]: https://img.shields.io/pypi/l/mcp.svg
[mit-url]: https://github.com/modelcontextprotocol/python-sdk/blob/main/LICENSE
[python-badge]: https://img.shields.io/pypi/pyversions/mcp.svg
[python-url]: https://www.python.org/downloads/
[docs-badge]: https://img.shields.io/badge/docs-modelcontextprotocol.io-blue.svg
[docs-url]: https://modelcontextprotocol.io
[spec-badge]: https://img.shields.io/badge/spec-spec.modelcontextprotocol.io-blue.svg
[spec-url]: https://spec.modelcontextprotocol.io
[discussions-badge]: https://img.shields.io/github/discussions/modelcontextprotocol/python-sdk
[discussions-url]: https://github.com/modelcontextprotocol/python-sdk/discussions
