---
layout: single
title:  "FastMCP 实战：构建计算器 MCP 服务器与客户端"
date:   2025-06-24 20:00:00 +0800
categories: MCP FastMCP
tags: [MCP, FastMCP, calculator-mcp-server, MCPServer, MCPClient, OpenAI, MCPInspector]
---

该文档详细介绍了如何使用 **FastMCP** 框架来构建和集成计算器 **MCP** 服务器与客户端。它首先指导用户**初始化并设置开发环境**，包括创建虚拟环境和安装 FastMCP。接着，文档展示了**MCP 服务器的开发过程**，通过 `main.py` 文件定义了加、减、乘、除、幂等计算工具，并配置了项目元数据文件 `pyproject.toml`。此外，文档还提供了**构建和发布服务器到 PyPI** 的步骤，以及**运行 MCP 服务器**的方法，包括使用 **MCP Inspector** 进行调试和通过 **FastMCP CLI** 运行。最后，文档展示了**MCP 客户端的开发**，演示了客户端如何调用服务器上的工具，并深入探讨了**将 MCP 客户端与 OpenAI 集成**，实现通过自然语言与计算器服务器进行交互的能力。

<!--more-->

## 创建 MCP 服务器

### 初始化
```bash
uv init calculator-mcp-server
cd calculator-mcp-server
```

### 创建虚拟环境
```bash
uv venv
```
```bash
Using CPython 3.10.9 interpreter at: /opt/miniconda/bin/python3.10
Creating virtual environment at: .venv
Activate with: source .venv/bin/activate
```

### 激活虚拟环境
```bash
source .venv/bin/activate
```

### 安装 FastMCP
```bash
uv add fastmcp
```

### 验证安装
```bash
fastmcp version
```
```bash
FastMCP version:                                         2.8.1
MCP version:                                             1.9.4
Python version:                                         3.10.9
Platform:                         macOS-15.1.1-arm64-arm-64bit
FastMCP root path: /opt/miniconda/lib/python3.10/site-packages
```

## MCP 服务器开发
### main.py
```python
from fastmcp import FastMCP

mcp = FastMCP("Calculator MCP Server")


@mcp.tool
def add(a: float, b: float) -> float:
    """Adds two numbers (int or float)."""
    return a + b

@mcp.tool
def subtract(a: float, b: float) -> float:
    """Subtracts two numbers (int or float)."""
    return a - b

@mcp.tool
def multiply(a: float, b: float) -> float:
    """Multiplies two numbers (int or float)."""
    return a * b

@mcp.tool
def divide(a: float, b: float) -> float:
    """Divides two numbers (int or float)."""
    if b == 0:
        raise ValueError("Cannot divide by zero.")
    return a / b

@mcp.tool
def power(base: float, exponent: float) -> float:
    """Raises a number to the power of another number."""
    return base ** exponent

def main():
    mcp.run()

if __name__ == "__main__":
    main()
```

### pyproject.toml
```toml
[project]
name = "calculator-mcp-server"
version = "0.1.1"
authors = [
  { name="Wang Junjian", email="wang-junjian@qq.com" },
]
description = "Calculator MCP Server"
readme = "README.md"
requires-python = ">=3.10"
classifiers = [
    "Programming Language :: Python :: 3",
    "License :: OSI Approved :: MIT License",
    "Operating System :: OS Independent",
]
dependencies = [
    "build>=1.2.2.post1",
    "fastmcp>=2.9.0",
]
[project.urls]
Homepage = "https://github.com/wang-junjian/calculator-mcp-server" # 如果有的话
"Bug Tracker" = "https://github.com/wang-junjian/calculator-mcp-server/issues" # 如果有的话

[project.optional-dependencies]
dev = ["build", "twine"]

[build-system]
requires = ["setuptools>=61.0"] # 或者您使用的其他构建后端
build-backend = "setuptools.build_meta"

[project.scripts]
calculator-mcp-server = "main:main"
```

### 构建
```bash
python -m build
```

### 上传 PyPI
```bash
twine upload dist/calculator_mcp_server-0.1.0-py3-none-any.whl
```


## 运行 MCP 服务器

### MCP Inspector
```bash
fastmcp dev main.py
```
```bash
Starting MCP inspector...
⚙️ Proxy server listening on 127.0.0.1:6277
🔑 Session token: 5fac3a7000a5bfdb58df0f8c19eeae8242bc32901d819d2d5066623ae6134e24
Use this token to authenticate requests or set DANGEROUSLY_OMIT_AUTH=true to disable auth

🔗 Open inspector with token pre-filled:
   http://localhost:6274/?MCP_PROXY_AUTH_TOKEN=5fac3a7000a5bfdb58df0f8c19eeae8242bc32901d819d2d5066623ae6134e24
   (Auto-open is disabled when authentication is enabled)

🔍 MCP Inspector is up and running at http://127.0.0.1:6274 🚀
```

![](/images/2025/FastMCP/MCPInspector.jpeg)

### FastMCP CLI
```bash
fastmcp run main.py
```
```bash
[06/24/25 16:32:35] INFO     Starting MCP server 'Calculator MCP Server' with transport 'stdio'                  server.py:1168
```

### UVX
```bash
uvx calculator-mcp-server
```
```bash
[06/24/25 23:02:33] INFO     Starting MCP server 'Calculator MCP Server' with transport 'stdio'                  server.py:1246
```


## MCP 客户端开发
### 客户端调用 MCP 服务器
```python
import asyncio
from fastmcp import Client

client = Client("main.py")

async def call_tool(tool_name: str, *args) -> str:
    """Call a tool by name with given arguments."""
    result = await client.call_tool(tool_name, *args)
    print(f"{tool_name}({', '.join(map(str, args))}) = {result}")

async def run():
    """Run the client and call tools."""

    async with client:
        tools = await client.list_tools()
        print(f"Available tools: {', '.join(tool.name for tool in tools)}")

        await call_tool("add", {"a": 5, "b": 3})
        await call_tool("subtract", {"a": 10, "b": 4})
        await call_tool("multiply", {"a": 2, "b": 6})
        await call_tool("divide", {"a": 8, "b": 2})
        await call_tool("power", {"base": 2, "exponent": 3})

if __name__ == "__main__":
    asyncio.run(run())
```
```bash
python client.py
```
```bash
[06/24/25 16:47:21] INFO     Starting MCP server 'Calculator MCP Server' with transport 'stdio'                  server.py:1246
Available tools: add, subtract, multiply, divide, power
add({'a': 5, 'b': 3}) = [TextContent(type='text', text='8.0', annotations=None)]
subtract({'a': 10, 'b': 4}) = [TextContent(type='text', text='6.0', annotations=None)]
multiply({'a': 2, 'b': 6}) = [TextContent(type='text', text='12.0', annotations=None)]
divide({'a': 8, 'b': 2}) = [TextContent(type='text', text='4.0', annotations=None)]
power({'base': 2, 'exponent': 3}) = [TextContent(type='text', text='8.0', annotations=None)]
```

### MCP 客户端与 OpenAI 集成
```bash
import asyncio
import os
import json
from typing import Optional
from contextlib import AsyncExitStack

from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client

from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()  # load environment variables from .env

class MCPClient:
    def __init__(self):
        # Initialize session and client objects
        self.session: Optional[ClientSession] = None
        self.exit_stack = AsyncExitStack()
        
        # Initialize OpenAI client
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            raise ValueError("Error: OPENAI_API_KEY is not set in .env file")
        
        self.openai = OpenAI(
            api_key=api_key,
            base_url=os.getenv("OPENAI_API_BASE", "https://api.openai.com/v1")
        )
        self.model = os.getenv("OPENAI_MODEL_ID", "gpt-4o") # Default OpenAI model

    async def connect_to_server(self, server_script_path: str):
        """Connect to an MCP server

        Args:
            server_script_path: Path to the server script (.py or .js)
        """
        is_python = server_script_path.endswith('.py')
        is_js = server_script_path.endswith('.js')
        if not (is_python or is_js):
            raise ValueError("Server script must be a .py or .js file")

        command = "python" if is_python else "node"
        server_params = StdioServerParameters(
            command=command,
            args=[server_script_path],
            env=None
        )

        stdio_transport = await self.exit_stack.enter_async_context(stdio_client(server_params))
        self.stdio, self.write = stdio_transport
        self.session = await self.exit_stack.enter_async_context(ClientSession(self.stdio, self.write))

        await self.session.initialize()

        # List available tools
        response = await self.session.list_tools()
        tools = response.tools
        print("\nConnected to server with tools:", [tool.name for tool in tools])

    async def process_query(self, query: str) -> str:
        """Process a query using OpenAI and available tools"""
        messages = [
            {
                "role": "user",
                "content": query
            }
        ]

        response = await self.session.list_tools()
        # Convert MCP tools to OpenAI tool format
        available_tools = [{
            "type": "function",
            "function": {
                "name": tool.name,
                "description": tool.description,
                "parameters": tool.inputSchema # OpenAI expects JSON Schema directly
            }
        } for tool in response.tools]

        # Initial OpenAI API call
        openai_response = self.openai.chat.completions.create(
            model=self.model,
            messages=messages,
            tools=available_tools if available_tools else None, # Pass tools only if available
            tool_choice="auto" # Let OpenAI decide whether to call a tool
        )
        print(f"\nOpenAI response: {openai_response}")

        # Process response and handle tool calls
        final_text = []
        
        # Extract the first message from the response
        message = openai_response.choices[0].message
        
        if message.content:
            final_text.append(message.content)
            messages.append(message) # Add assistant's text response to messages

        if message.tool_calls:
            messages.append(message) # Add assistant's tool call message to messages
            for tool_call in message.tool_calls:
                tool_name = tool_call.function.name
                tool_args = tool_call.function.arguments # Arguments are already a string, usually JSON
                
                try:
                    parsed_args = json.loads(tool_args) # Attempt to parse args if they are JSON string
                except json.JSONDecodeError:
                    parsed_args = tool_args # Keep as string if not valid JSON

                # Execute tool call
                result = await self.session.call_tool(tool_name, parsed_args)
                final_text.append(f"[Calling tool {tool_name} with args {tool_args}]")

                messages.append({
                    "tool_call_id": tool_call.id,
                    "role": "tool",
                    "name": tool_name,
                    "content": result.content
                })

                # Get next response from OpenAI after tool execution
                openai_response = self.openai.chat.completions.create(
                    model=self.model,
                    messages=messages,
                    tools=available_tools if available_tools else None,
                    tool_choice="auto"
                )
                
                # Append the new response content
                if openai_response.choices[0].message.content:
                    final_text.append(openai_response.choices[0].message.content)
                    messages.append(openai_response.choices[0].message) # Add new assistant's text response

        return "\n".join(final_text)

    async def chat_loop(self):
        """Run an interactive chat loop"""
        print("\nMCP Client Started!")
        print("Type your queries or 'quit' to exit.")

        while True:
            try:
                query = input("\nQuery: ").strip()

                if query.lower() == 'quit':
                    break

                response = await self.process_query(query)
                print("\n" + response)

            except Exception as e:
                print(f"\nError: {str(e)}")

    async def cleanup(self):
        """Clean up resources"""
        await self.exit_stack.aclose()

async def main():
    if len(sys.argv) < 2:
        print("Usage: python client.py <path_to_server_script>")
        sys.exit(1)

    client = MCPClient()
    try:
        await client.connect_to_server(sys.argv[1])
        await client.chat_loop()
    finally:
        await client.cleanup()

if __name__ == "__main__":
    import sys
    asyncio.run(main())
```


## 参考资料
- [FastMCP](https://gofastmcp.com/getting-started/quickstart)
- [FastMCP LLM-Friendly Docs](https://gofastmcp.com/getting-started/welcome#llm-friendly-docs)
- [MCP Python SDK](https://github.com/modelcontextprotocol/python-sdk)
- [MCP For Client Developers](https://modelcontextprotocol.io/quickstart/client)
- [GitHub FastMCP](https://github.com/jlowin/fastmcp)
- [uv Working on projects](https://docs.astral.sh/uv/guides/projects/)
