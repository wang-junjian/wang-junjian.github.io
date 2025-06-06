---
layout: single
title:  "create-mcp-server"
date:   2025-03-26 12:00:00 +0800
categories: MCP Python
tags: [MCP, Python, MCPServer, UV]
---

# MCP 服务器创建工具

[![PyPI](https://img.shields.io/pypi/v/create-mcp-server)](https://pypi.org/project/create-mcp-server/) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

创建无需构建配置的 [模型上下文协议 (MCP)](https://modelcontextprotocol.io) 服务器项目。

## 快速概览

```sh
# 使用 uvx (推荐)
uvx create-mcp-server

# 或者使用 pip
pip install create-mcp-server
create-mcp-server
```

您无需手动安装或配置任何依赖项。 该工具将设置创建 MCP 服务器所需的一切。

## 创建服务器

**您需要在您的机器上安装 [UV](https://docs.astral.sh/uv/) >= 0.4.10。**

要创建新服务器，请运行以下任一命令：

### 使用 uvx (推荐)
```sh
uvx create-mcp-server
```

### 使用 pip
```sh
pip install create-mcp-server
create-mcp-server
```

它将引导您创建一个新的 MCP 服务器项目。 完成后，您将拥有一个具有以下结构的新目录：

```
my-server/
├── README.md
├── pyproject.toml
└── src/
    └── my_server/
        ├── __init__.py
        ├── __main__.py
        └── server.py
```

没有配置或复杂的文件夹结构，只有运行服务器所需的文件。

安装完成后，您可以启动服务器：

```sh
cd my-server
uv sync --dev --all-extras
uv run my-server
```

## 特性

- 用于创建新项目的简单命令行界面
- 在可用时自动配置 Claude Desktop 应用程序集成
- 使用 [uvx](https://docs.astral.sh/uv/guides/tools/) 实现快速、可靠的包管理和项目创建
- 设置基本的 MCP 服务器结构
- 使用 [模型上下文协议 Python SDK](https://github.com/modelcontextprotocol/python-sdk) 作为服务器项目

## 理念

- **零配置：** 无需手动设置项目结构或依赖项。
- **最佳实践：** 遵循 Python 打包标准和 MCP 服务器模式。
- **开箱即用：** 包含启动构建 MCP 服务器所需的一切。

## 许可证

Create MCP Server 是 [根据 MIT 许可](https://opensource.org/licenses/MIT) 获得许可的开源软件。


# src/create_mcp_server/__init__.py

```python
import json
import re
import subprocess
import sys
from pathlib import Path

import click
import toml
from packaging.version import parse

# uv工具最低版本要求
MIN_UV_VERSION = "0.4.10"


class PyProject:
    """用于处理pyproject.toml文件的类"""
    def __init__(self, path: Path):
        """
        初始化PyProject对象
        
        Args:
            path: pyproject.toml文件的路径
        """
        self.data = toml.load(path)

    @property
    def name(self) -> str:
        """
        获取项目名称
        
        Returns:
            项目名称字符串
        """
        return self.data["project"]["name"]

    @property
    def first_binary(self) -> str | None:
        """
        获取项目中定义的第一个可执行脚本名称
        
        Returns:
            脚本名称或None（如果没有脚本）
        """
        scripts = self.data["project"].get("scripts", {})
        return next(iter(scripts.keys()), None)


def check_uv_version(required_version: str) -> str | None:
    """
    检查uv是否已安装且版本满足最低要求
    
    Args:
        required_version: 所需的最低版本号
        
    Returns:
        版本字符串，如果未安装或版本低于要求则返回None
    """
    try:
        result = subprocess.run(
            ["uv", "--version"], capture_output=True, text=True, check=True
        )
        version = result.stdout.strip()
        match = re.match(r"uv (\d+\.\d+\.\d+)", version)
        if match:
            version_num = match.group(1)
            if parse(version_num) >= parse(required_version):
                return version
        return None
    except subprocess.CalledProcessError:
        click.echo("❌ Error: Failed to check uv version.", err=True)
        sys.exit(1)
    except FileNotFoundError:
        return None


def ensure_uv_installed() -> None:
    """确保uv已安装且版本满足最低要求"""
    if check_uv_version(MIN_UV_VERSION) is None:
        click.echo(
            f"❌ Error: uv >= {MIN_UV_VERSION} is required but not installed.", err=True
        )
        click.echo("To install, visit: https://github.com/astral-sh/uv", err=True)
        sys.exit(1)


def get_claude_config_path() -> Path | None:
    """根据平台获取Claude配置目录"""
    if sys.platform == "win32":
        path = Path(Path.home(), "AppData", "Roaming", "Claude")
    elif sys.platform == "darwin":
        path = Path(Path.home(), "Library", "Application Support", "Claude")
    else:
        return None

    if path.exists():
        return path
    return None


def has_claude_app() -> bool:
    """检查Claude应用是否存在"""
    return get_claude_config_path() is not None


def update_claude_config(project_name: str, project_path: Path) -> bool:
    """将项目添加到Claude配置中（如果可能）"""
    config_dir = get_claude_config_path()
    if not config_dir:
        return False

    config_file = config_dir / "claude_desktop_config.json"
    if not config_file.exists():
        return False

    try:
        config = json.loads(config_file.read_text())
        if "mcpServers" not in config:
            config["mcpServers"] = {}

        if project_name in config["mcpServers"]:
            click.echo(
                f"⚠️ Warning: {project_name} already exists in Claude.app configuration",
                err=True,
            )
            click.echo(f"Settings file location: {config_file}", err=True)
            return False

        config["mcpServers"][project_name] = {
            "command": "uv",
            "args": ["--directory", str(project_path), "run", project_name],
        }

        config_file.write_text(json.dumps(config, indent=2))
        click.echo(f"✅ Added {project_name} to Claude.app configuration")
        click.echo(f"Settings file location: {config_file}")
        return True
    except Exception:
        click.echo("❌ Failed to update Claude.app configuration", err=True)
        click.echo(f"Settings file location: {config_file}", err=True)
        return False


def get_package_directory(path: Path) -> Path:
    """查找src/目录下的包目录"""
    src_dir = next((path / "src").glob("*/__init__.py"), None)
    if src_dir is None:
        click.echo("❌ Error: Could not find __init__.py in src directory", err=True)
        sys.exit(1)
    return src_dir.parent


def copy_template(
    path: Path, name: str, description: str, version: str = "0.1.0"
) -> None:
    """将模板文件复制到src/<project_name>目录中"""
    template_dir = Path(__file__).parent / "template"

    target_dir = get_package_directory(path)

    from jinja2 import Environment, FileSystemLoader

    env = Environment(loader=FileSystemLoader(str(template_dir)))

    files = [
        ("__init__.py.jinja2", "__init__.py", target_dir),
        ("server.py.jinja2", "server.py", target_dir),
        ("README.md.jinja2", "README.md", path),
    ]

    pyproject = PyProject(path / "pyproject.toml")
    bin_name = pyproject.first_binary

    template_vars = {
        "binary_name": bin_name,
        "server_name": name,
        "server_version": version,
        "server_description": description,
        "server_directory": str(path.resolve()),
    }

    try:
        for template_file, output_file, output_dir in files:
            template = env.get_template(template_file)
            rendered = template.render(**template_vars)

            out_path = output_dir / output_file
            out_path.write_text(rendered)

    except Exception as e:
        click.echo(f"❌ Error: Failed to template and write files: {e}", err=True)
        sys.exit(1)


def create_project(
    path: Path, name: str, description: str, version: str, use_claude: bool = True
) -> None:
    """使用uv创建一个新项目"""
    path.mkdir(parents=True, exist_ok=True)

    try:
        subprocess.run(
            ["uv", "init", "--name", name, "--package", "--app", "--quiet"],
            cwd=path,
            check=True,
        )
    except subprocess.CalledProcessError:
        click.echo("❌ Error: Failed to initialize project.", err=True)
        sys.exit(1)

    # 使用uv add添加mcp依赖
    try:
        subprocess.run(["uv", "add", "mcp"], cwd=path, check=True)
    except subprocess.CalledProcessError:
        click.echo("❌ Error: Failed to add mcp dependency.", err=True)
        sys.exit(1)

    copy_template(path, name, description, version)

    # 检查Claude.app是否可用
    if (
        use_claude
        and has_claude_app()
        and click.confirm(
            "\nClaude.app detected. Would you like to install the server into Claude.app now?",
            default=True,
        )
    ):
        update_claude_config(name, path)

    relpath = path.relative_to(Path.cwd())
    click.echo(f"✅ Created project {name} in {relpath}")
    click.echo("ℹ️ To install dependencies run:")
    click.echo(f"   cd {relpath}")
    click.echo("   uv sync --dev --all-extras")


def update_pyproject_settings(
    project_path: Path, version: str, description: str
) -> None:
    """更新pyproject.toml中的项目版本和描述"""
    import toml

    pyproject_path = project_path / "pyproject.toml"

    if not pyproject_path.exists():
        click.echo("❌ Error: pyproject.toml not found", err=True)
        sys.exit(1)

    try:
        pyproject = toml.load(pyproject_path)

        if version is not None:
            pyproject["project"]["version"] = version

        if description is not None:
            pyproject["project"]["description"] = description

        pyproject_path.write_text(toml.dumps(pyproject))

    except Exception as e:
        click.echo(f"❌ Error updating pyproject.toml: {e}", err=True)
        sys.exit(1)


def check_package_name(name: str) -> bool:
    """检查包名称是否符合pyproject.toml规范"""
    if not name:
        click.echo("❌ Project name cannot be empty", err=True)
        return False
    if " " in name:
        click.echo("❌ Project name must not contain spaces", err=True)
        return False
    if not all(c.isascii() and (c.isalnum() or c in "_-.") for c in name):
        click.echo(
            "❌ Project name must consist of ASCII letters, digits, underscores, hyphens, and periods",
            err=True,
        )
        return False
    if name.startswith(("_", "-", ".")) or name.endswith(("_", "-", ".")):
        click.echo(
            "❌ Project name must not start or end with an underscore, hyphen, or period",
            err=True,
        )
        return False
    return True


@click.command()
@click.option(
    "--path",
    type=click.Path(path_type=Path),
    help="Directory to create project in",
)
@click.option(
    "--name",
    type=str,
    help="Project name",
)
@click.option(
    "--version",
    type=str,
    help="Server version",
)
@click.option(
    "--description",
    type=str,
    help="Project description",
)
@click.option(
    "--claudeapp/--no-claudeapp",
    default=True,
    help="Enable/disable Claude.app integration",
)
def main(
    path: Path | None,
    name: str | None,
    version: str | None,
    description: str | None,
    claudeapp: bool,
) -> int:
    """创建一个新的MCP服务器项目"""
    # 确保系统中安装了符合版本要求的uv工具
    ensure_uv_installed()

    # 打印项目创建的初始信息
    click.echo("Creating a new MCP server project using uv.")
    click.echo("This will set up a Python project with MCP dependency.")
    click.echo("\nLet's begin!\n")

    # 如果命令行未提供项目名称，则通过交互式提示获取
    name = click.prompt("Project name (required)", type=str) if name is None else name

    # 验证项目名称不能为空
    if name is None:
        click.echo("❌ Error: Project name cannot be empty", err=True)
        return 1

    # 检查项目名称是否符合规范
    if not check_package_name(name):
        return 1

    # 如果命令行未提供项目描述，则通过交互式提示获取
    description = (
        click.prompt("Project description", type=str, default="A MCP server project")
        if description is None
        else description
    )

    assert isinstance(description, str)

    # 验证版本号格式，如果命令行未提供则通过交互式提示获取
    if version is None:
        version = click.prompt("Project version", default="0.1.0", type=str)
        assert isinstance(version, str)
        try:
            parse(version)  # 验证语义化版本格式
        except Exception:
            click.echo(
                "❌ Error: Version must be a valid semantic version (e.g. 1.0.0)",
                err=True,
            )
            return 1

    # 确定项目路径，如果未指定则使用当前目录下的项目名称
    project_path = (Path.cwd() / name) if path is None else path

    # 如果命令行未提供路径，让用户确认默认路径是否正确
    if path is None:
        click.echo(f"Project will be created at: {project_path}")
        if not click.confirm("Is this correct?", default=True):
            project_path = Path(
                click.prompt("Enter the correct path", type=click.Path(path_type=Path))
            )

    # 验证项目路径是否有效
    if project_path is None:
        click.echo("❌ Error: Invalid path. Project creation aborted.", err=True)
        return 1

    # 解析为绝对路径
    project_path = project_path.resolve()

    # 创建项目并更新pyproject.toml设置
    create_project(project_path, name, description, version, claudeapp)
    update_pyproject_settings(project_path, version, description)

    return 0
```


# src/create_mcp_server/__main__.py

```python
import sys

from . import main

sys.exit(main())
```


# src/create_mcp_server/template/README.md.jinja2

```jinja2
# {{server_name}} MCP 服务器

{{server_description}}

## 组件

### 资源

该服务器实现了一个简单的笔记存储系统，具有：
- 用于访问单个笔记的自定义 note:// URI 方案
- 每个笔记资源都有一个名称、描述和 text/plain mimetype

### 提示词

该服务器提供一个提示词：
- summarize-notes：创建所有存储笔记的摘要
  - 可选的 "style" 参数来控制详细程度（brief/detailed）
  - 生成将所有当前笔记与样式偏好相结合的提示词

### 工具

该服务器实现了一个工具：
- add-note：向服务器添加新笔记
  - 接受 "name" 和 "content" 作为必需的字符串参数
  - 更新服务器状态并通知客户端资源更改

## 配置

[TODO：添加特定于您的实现的配置详细信息]

## 快速入门

### 安装

#### Claude Desktop

在 MacOS 上：`~/Library/Application\ Support/Claude/claude_desktop_config.json`
在 Windows 上：`%APPDATA%/Claude/claude_desktop_config.json`

<details>
  <summary>开发/未发布的服务器配置</summary>
  ```
  "mcpServers": {
    "{{server_name}}": {
      "command": "uv",
      "args": [
        "--directory",
        "{{server_directory}}",
        "run",
        "{{server_name}}"
      ]
    }
  }
  ```
</details>

<details>
  <summary>已发布的服务器配置</summary>
  ```
  "mcpServers": {
    "{{server_name}}": {
      "command": "uvx",
      "args": [
        "{{server_name}}"
      ]
    }
  }
  ```
</details>

## 开发

### 构建和发布

要准备用于分发的软件包：

1. 同步依赖项并更新锁定文件：
```bash
uv sync
```

2. 构建软件包分发：
```bash
uv build
```

这将在 `dist/` 目录中创建源和 wheel 分发。

3. 发布到 PyPI：
```bash
uv publish
```

注意：您需要通过环境变量或命令标志设置 PyPI 凭据：
- Token：`--token` 或 `UV_PUBLISH_TOKEN`
- 或用户名/密码：`--username`/`UV_PUBLISH_USERNAME` 和 `--password`/`UV_PUBLISH_PASSWORD`

### 调试

由于 MCP 服务器通过 stdio 运行，因此调试可能具有挑战性。 为了获得最佳调试体验，我们强烈建议使用 [MCP Inspector](https://github.com/modelcontextprotocol/inspector)。

{% if binary_name %}
您可以通过 [`npm`](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) 使用以下命令启动 MCP Inspector：

```bash
npx @modelcontextprotocol/inspector uv --directory {{server_directory}} run {{binary_name}}
```
{% else %}
此项目不包含启动脚本。 但是，您仍然可以使用 MCP Inspector 进行调试。 要启动 Inspector，请使用以下通用命令结构：

```bash
npx @modelcontextprotocol/inspector <command-to-run-your-server>
```

将 `<command-to-run-your-server>` 替换为您用于启动 MCP 服务器的特定命令。
{% endif %}

启动后，Inspector 将显示一个 URL，您可以在浏览器中访问该 URL 以开始调试。
```


# src/create_mcp_server/template/__init__.py.jinja2

```jinja2
from . import server
import asyncio

def main():
    """Main entry point for the package."""
    asyncio.run(server.main())

# Optionally expose other important items at package level
__all__ = ['main', 'server']
```


# src/create_mcp_server/template/server.py.jinja2

```jinja2
import asyncio

from mcp.server.models import InitializationOptions
import mcp.types as types
from mcp.server import NotificationOptions, Server
from pydantic import AnyUrl
import mcp.server.stdio

# 将笔记存储为简单的键值字典，用于演示状态管理
# Store notes as a simple key-value dict to demonstrate state management
notes: dict[str, str] = {}

# 初始化MCP服务器
server = Server("{{server_name}}")

@server.list_resources()
async def handle_list_resources() -> list[types.Resource]:
    """
    列出可用的笔记资源。
    每个笔记都作为具有自定义note://URI方案的资源公开。
    """
    return [
        types.Resource(
            uri=AnyUrl(f"note://internal/{name}"),
            name=f"Note: {name}",
            description=f"A simple note named {name}",
            mimeType="text/plain",
        )
        for name in notes
    ]

@server.read_resource()
async def handle_read_resource(uri: AnyUrl) -> str:
    """
    通过URI读取特定笔记的内容。
    笔记名称从URI的路径组件中提取。
    """
    if uri.scheme != "note":
        raise ValueError(f"不支持的URI方案: {uri.scheme}")

    name = uri.path
    if name is not None:
        name = name.lstrip("/")
        return notes[name]
    raise ValueError(f"未找到笔记: {name}")

@server.list_prompts()
async def handle_list_prompts() -> list[types.Prompt]:
    """
    列出可用的提示。
    每个提示可以有可选参数来自定义其行为。
    """
    return [
        types.Prompt(
            name="summarize-notes",
            description="创建所有笔记的摘要",
            arguments=[
                types.PromptArgument(
                    name="style",
                    description="摘要的风格(简要/详细)",
                    required=False,
                )
            ],
        )
    ]

@server.get_prompt()
async def handle_get_prompt(
    name: str, arguments: dict[str, str] | None
) -> types.GetPromptResult:
    """
    通过将参数与服务器状态结合来生成提示。
    提示包括所有当前笔记，可以通过参数进行自定义。
    """
    if name != "summarize-notes":
        raise ValueError(f"未知的提示: {name}")

    style = (arguments or {}).get("style", "brief")
    detail_prompt = " 提供广泛的细节。" if style == "detailed" else ""

    return types.GetPromptResult(
        description="总结当前笔记",
        messages=[
            types.PromptMessage(
                role="user",
                content=types.TextContent(
                    type="text",
                    text=f"以下是要总结的当前笔记:{detail_prompt}\n\n"
                    + "\n".join(
                        f"- {name}: {content}"
                        for name, content in notes.items()
                    ),
                ),
            )
        ],
    )

@server.list_tools()
async def handle_list_tools() -> list[types.Tool]:
    """
    列出可用的工具。
    每个工具使用JSON Schema验证来指定其参数。
    """
    return [
        types.Tool(
            name="add-note",
            description="添加新笔记",
            inputSchema={
                "type": "object",
                "properties": {
                    "name": {"type": "string"},
                    "content": {"type": "string"},
                },
                "required": ["name", "content"],
            },
        )
    ]

@server.call_tool()
async def handle_call_tool(
    name: str, arguments: dict | None
) -> list[types.TextContent | types.ImageContent | types.EmbeddedResource]:
    """
    处理工具执行请求。
    工具可以修改服务器状态并通知客户端变更。
    """
    if name != "add-note":
        raise ValueError(f"未知工具: {name}")

    if not arguments:
        raise ValueError("缺少参数")

    note_name = arguments.get("name")
    content = arguments.get("content")

    if not note_name or not content:
        raise ValueError("缺少名称或内容")

    # 更新服务器状态
    notes[note_name] = content

    # 通知客户端资源已更改
    await server.request_context.session.send_resource_list_changed()

    return [
        types.TextContent(
            type="text",
            text=f"添加了笔记 '{note_name}' 内容为: {content}",
        )
    ]

async def main():
    # 使用标准输入/输出流运行服务器
    async with mcp.server.stdio.stdio_server() as (read_stream, write_stream):
        await server.run(
            read_stream,
            write_stream,
            InitializationOptions(
                server_name="{{server_name}}",
                server_version="{{server_version}}",
                capabilities=server.get_capabilities(
                    notification_options=NotificationOptions(),
                    experimental_capabilities={},
                ),
            ),
        )
```


# pyproject.toml

```toml
[project]
name = "create-mcp-server"
version = "1.0.6.dev0"
description = "Create an Model Context Protocol server project from a template."
readme = "README.md"
requires-python = ">=3.10"
authors = [{ name = "Anthropic, PBC." }]
maintainers = [
    { name = "David Soria Parra", email = "davidsp@anthropic.com" },
    { name = "Justin Spahr-Summers", email = "justin@anthropic.com" },
]
license = { text = "MIT" }
classifiers = [
    "Development Status :: 4 - Beta",
    "Intended Audience :: Developers",
    "License :: OSI Approved :: MIT License",
    "Programming Language :: Python :: 3",
    "Programming Language :: Python :: 3.10",
]
dependencies = [
    "click>=8.1.7",
    "jinja2>=3.1.4",
    "packaging>=24.2",
    "toml>=0.10.2",
]

[project.scripts]
create-mcp-server = "create_mcp_server:main"

[project.urls]
Homepage = "https://modelcontextprotocol.io"
Repository = "https://github.com/modelcontextprotocol/create-python-server"

[build-system]
requires = ["hatchling"]
build-backend = "hatchling.build"

[tool.hatch.build.targets.wheel]
artifacts = ["src/create_mcp_server/template"]

[tool.uv]
dev-dependencies = ["pyright>=1.1.389", "ruff>=0.7.4"]
```

`pyproject.toml` 文件是 Python 项目的配置文件，用于指定项目的元数据、依赖项、构建系统和其他工具配置。

以下是该文件的主要部分的解释：

*   **`[project]`**: 定义项目的一般信息。
    *   `name`: 项目的名称 (create-mcp-server)。
    *   `version`: 项目的版本 (1.0.6.dev0)。
    *   `description`: 项目的简短描述。
    *   `readme`: 指向包含项目详细描述的 README 文件的路径 (README.md)。
    *   `requires-python`: 指定项目所需的 Python 版本 (>=3.10)。
    *   `authors`: 项目的作者。
    *   `maintainers`: 项目的维护者及其电子邮件地址。
    *   `license`: 项目的许可证 (MIT)。
    *   `classifiers`: 项目的分类列表，用于 PyPI。
    *   `dependencies`: 项目的运行时依赖项及其版本要求。
*   **`[project.scripts]`**: 定义可执行脚本。
    *   `create-mcp-server`: 将 `create-mcp-server` 命令映射到 `create_mcp_server:main` 函数，这意味着当用户在终端中运行 `create-mcp-server` 时，将执行 `create_mcp_server.py` 文件中的 `main` 函数。
*   **`[project.urls]`**: 定义项目相关的 URL。
    *   `Homepage`: 项目的主页。
    *   `Repository`: 项目的源代码仓库。
*   **`[build-system]`**: 定义用于构建项目的构建系统。
    *   `requires`: 构建项目所需的依赖项 (hatchling)。
    *   `build-backend`: 用于构建项目的后端 (hatchling.build)。
*   **`[tool.hatch.build.targets.wheel]`**:  Hatch 特定的配置，用于构建 wheel 包。
    *   `artifacts`: 指定在 wheel 包中包含的工件，这里指定了 `src/create_mcp_server/template` 目录。
*   **`[tool.uv]`**: `uv` 工具的配置。
    *   `dev-dependencies`: 指定开发依赖项及其版本要求，例如用于类型检查的 `pyright` 和用于代码检查的 `ruff`。


# uv.lock

```toml
version = 1
requires-python = ">=3.10"

[[package]]
name = "click"
version = "8.1.7"
source = { registry = "https://pypi.org/simple" }
dependencies = [
    { name = "colorama", marker = "platform_system == 'Windows'" },
]
sdist = { url = "https://files.pythonhosted.org/packages/96/d3/f04c7bfcf5c1862a2a5b845c6b2b360488cf47af55dfa79c98f6a6bf98b5/click-8.1.7.tar.gz", hash = "sha256:ca9853ad459e787e2192211578cc907e7594e294c7ccc834310722b41b9ca6de", size = 336121 }
wheels = [
    { url = "https://files.pythonhosted.org/packages/00/2e/d53fa4befbf2cfa713304affc7ca780ce4fc1fd8710527771b58311a3229/click-8.1.7-py3-none-any.whl", hash = "sha256:ae74fb96c20a0277a1d615f1e4d73c8414f5a98db8b799a7931d1582f3390c28", size = 97941 },
]

[[package]]
name = "colorama"
version = "0.4.6"
source = { registry = "https://pypi.org/simple" }
sdist = { url = "https://files.pythonhosted.org/packages/d8/53/6f443c9a4a8358a93a6792e2acffb9d9d5cb0a5cfd8802644b7b1c9a02e4/colorama-0.4.6.tar.gz", hash = "sha256:08695f5cb7ed6e0531a20572697297273c47b8cae5a63ffc6d6ed5c201be6e44", size = 27697 }
wheels = [
    { url = "https://files.pythonhosted.org/packages/d1/d6/3965ed04c63042e047cb6a3e6ed1a63a35087b6a609aa3a15ed8ac56c221/colorama-0.4.6-py2.py3-none-any.whl", hash = "sha256:4f1d9991f5acc0ca119f9d443620b77f9d6b33703e51011c16baf57afb285fc6", size = 25335 },
]

[[package]]
name = "create-mcp-server"
version = "1.0.4.dev0"
source = { editable = "." }
dependencies = [
    { name = "click" },
    { name = "jinja2" },
    { name = "packaging" },
    { name = "toml" },
]

[package.dev-dependencies]
dev = [
    { name = "pyright" },
    { name = "ruff" },
]

[package.metadata]
requires-dist = [
    { name = "click", specifier = ">=8.1.7" },
    { name = "jinja2", specifier = ">=3.1.4" },
    { name = "packaging", specifier = ">=24.2" },
    { name = "toml", specifier = ">=0.10.2" },
]

[package.metadata.requires-dev]
dev = [
    { name = "pyright", specifier = ">=1.1.389" },
    { name = "ruff", specifier = ">=0.7.4" },
]

[[package]]
name = "jinja2"
version = "3.1.4"
source = { registry = "https://pypi.org/simple" }
dependencies = [
    { name = "markupsafe" },
]
sdist = { url = "https://files.pythonhosted.org/packages/ed/55/39036716d19cab0747a5020fc7e907f362fbf48c984b14e62127f7e68e5d/jinja2-3.1.4.tar.gz", hash = "sha256:4a3aee7acbbe7303aede8e9648d13b8bf88a429282aa6122a993f0ac800cb369", size = 240245 }
wheels = [
    { url = "https://files.pythonhosted.org/packages/31/80/3a54838c3fb461f6fec263ebf3a3a41771bd05190238de3486aae8540c36/jinja2-3.1.4-py3-none-any.whl", hash = "sha256:bc5dd2abb727a5319567b7a813e6a2e7318c39f4f487cfe6c89c6f9c7d25197d", size = 133271 },
]

[[package]]
name = "markupsafe"
version = "3.0.2"
source = { registry = "https://pypi.org/simple" }
sdist = { url = "https://files.pythonhosted.org/packages/b2/97/5d42485e71dfc078108a86d6de8fa46db44a1a9295e89c5d6d4a06e23a62/markupsafe-3.0.2.tar.gz", hash = "sha256:ee55d3edf80167e48ea11a923c7386f4669df67d7994554387f84e7d8b0a2bf0", size = 20537 }
wheels = [
    { url = "https://files.pythonhosted.org/packages/04/90/d08277ce111dd22f77149fd1a5d4653eeb3b3eaacbdfcbae5afb2600eebd/MarkupSafe-3.0.2-cp310-cp310-macosx_10_9_universal2.whl", hash = "sha256:7e94c425039cde14257288fd61dcfb01963e658efbc0ff54f5306b06054700f8", size = 14357 },
    { url = "https://files.pythonhosted.org/packages/04/e1/6e2194baeae0bca1fae6629dc0cbbb968d4d941469cbab11a3872edff374/MarkupSafe-3.0.2-cp310-cp310-macosx_11_0_arm64.whl", hash = "sha256:9e2d922824181480953426608b81967de705c3cef4d1af983af849d7bd619158", size = 12393 },
    { url = "https://files.pythonhosted.org/packages/1d/69/35fa85a8ece0a437493dc61ce0bb6d459dcba482c34197e3efc829aa357f/MarkupSafe-3.0.2-cp310-cp310-manylinux_2_17_aarch64.manylinux2014_aarch64.whl", hash = "sha256:38a9ef736c01fccdd6600705b09dc574584b89bea478200c5fbf112a6b0d5579", size = 21732 },
    { url = "https://files.pythonhosted.org/packages/22/35/137da042dfb4720b638d2937c38a9c2df83fe32d20e8c8f3185dbfef05f7/MarkupSafe-3.0.2-cp310-cp310-manylinux_2_17_x86_64.manylinux2014_x86_64.whl", hash = "sha256:bbcb445fa71794da8f178f0f6d66789a28d7319071af7a496d4d507ed566270d", size = 20866 },
    { url = "https://files.pythonhosted.org/packages/29/28/6d029a903727a1b62edb51863232152fd335d602def598dade38996887f0/MarkupSafe-3.0.2-cp310-cp310-manylinux_2_5_i686.manylinux1_i686.manylinux_2_17_i686.manylinux2014_i686.whl", hash = "sha256:57cb5a3cf367aeb1d316576250f65edec5bb3be939e9247ae594b4bcbc317dfb", size = 20964 },
    { url = "https://files.pythonhosted.org/packages/cc/cd/07438f95f83e8bc028279909d9c9bd39e24149b0d60053a97b2bc4f8aa51/MarkupSafe-3.0.2-cp310-cp310-musllinux_1_2_aarch64.whl", hash = "sha256:3809ede931876f5b2ec92eef964286840ed3540dadf803dd570c3b7e13141a3b", size = 21977 },
    { url = "https://files.pythonhosted.org/packages/29/01/84b57395b4cc062f9c4c55ce0df7d3108ca32397299d9df00fedd9117d3d/MarkupSafe-3.0.2-cp310-cp310-musllinux_1_2_i686.whl", hash = "sha256:e07c3764494e3776c602c1e78e298937c3315ccc9043ead7e685b7f2b8d47b3c", size = 21366 },
    { url = "https://files.pythonhosted.org/packages/bd/6e/61ebf08d8940553afff20d1fb1ba7294b6f8d279df9fd0c0db911b4bbcfd/MarkupSafe-3.0.2-cp310-cp310-musllinux_1_2_x86_64.whl", hash = "sha256:b424c77b206d63d500bcb69fa55ed8d0e6a3774056bdc4839fc9298a7edca171", size = 21091 },
    { url = "https://files.pythonhosted.org/packages/11/23/ffbf53694e8c94ebd1e7e491de185124277964344733c45481f32ede2499/MarkupSafe-3.0.2-cp310-cp310-win32.whl", hash = "sha256:fcabf5ff6eea076f859677f5f0b6b5c1a51e70a376b0579e0eadef8db48c6b50", size = 15065 },
    { url = "https://files.pythonhosted.org/packages/44/06/e7175d06dd6e9172d4a69a72592cb3f7a996a9c396eee29082826449bbc3/MarkupSafe-3.0.2-cp310-cp310-win_amd64.whl", hash = "sha256:6af100e168aa82a50e186c82875a5893c5597a0c1ccdb0d8b40240b1f28b969a", size = 15514 },
    { url = "https://files.pythonhosted.org/packages/6b/28/bbf83e3f76936960b850435576dd5e67034e200469571be53f69174a2dfd/MarkupSafe-3.0.2-cp311-cp311-macosx_10_9_universal2.whl", hash = "sha256:9025b4018f3a1314059769c7bf15441064b2207cb3f065e6ea1e7359cb46db9d", size = 14353 },
    { url = "https://files.pythonhosted.org/packages/6c/30/316d194b093cde57d448a4c3209f22e3046c5bb2fb0820b118292b334be7/MarkupSafe-3.0.2-cp311-cp311-macosx_11_0_arm64.whl", hash = "sha256:93335ca3812df2f366e80509ae119189886b0f3c2b81325d39efdb84a1e2ae93", size = 12392 },
    { url = "https://files.pythonhosted.org/packages/f2/96/9cdafba8445d3a53cae530aaf83c38ec64c4d5427d975c974084af5bc5d2/MarkupSafe-3.0.2-cp311-cp311-manylinux_2_17_aarch64.manylinux2014_aarch64.whl", hash = "sha256:2cb8438c3cbb25e220c2ab33bb226559e7afb3baec11c4f218ffa7308603c832", size = 23984 },
    { url = "https://files.pythonhosted.org/packages/f1/a4/aefb044a2cd8d7334c8a47d3fb2c9f328ac48cb349468cc31c20b539305f/MarkupSafe-3.0.2-cp311-cp311-manylinux_2_17_x86_64.manylinux2014_x86_64.whl", hash = "sha256:a123e330ef0853c6e822384873bef7507557d8e4a082961e1defa947aa59ba84", size = 23120 },
    { url = "https://files.pythonhosted.org/packages/8d/21/5e4851379f88f3fad1de30361db501300d4f07bcad047d3cb0449fc51f8c/MarkupSafe-3.0.2-cp311-cp311-manylinux_2_5_i686.manylinux1_i686.manylinux_2_17_i686.manylinux2014_i686.whl", hash = "sha256:1e084f686b92e5b83186b07e8a17fc09e38fff551f3602b249881fec658d3eca", size = 23032 },
    { url = "https://files.pythonhosted.org/packages/00/7b/e92c64e079b2d0d7ddf69899c98842f3f9a60a1ae72657c89ce2655c999d/MarkupSafe-3.0.2-cp311-cp311-musllinux_1_2_aarch64.whl", hash = "sha256:d8213e09c917a951de9d09ecee036d5c7d36cb6cb7dbaece4c71a60d79fb9798", size = 24057 },
    { url = "https://files.pythonhosted.org/packages/f9/ac/46f960ca323037caa0a10662ef97d0a4728e890334fc156b9f9e52bcc4ca/MarkupSafe-3.0.2-cp311-cp311-musllinux_1_2_i686.whl", hash = "sha256:5b02fb34468b6aaa40dfc198d813a641e3a63b98c2b05a16b9f80b7ec314185e", size = 23359 },
    { url = "https://files.pythonhosted.org/packages/69/84/83439e16197337b8b14b6a5b9c2105fff81d42c2a7c5b58ac7b62ee2c3b1/MarkupSafe-3.0.2-cp311-cp311-musllinux_1_2_x86_64.whl", hash = "sha256:0bff5e0ae4ef2e1ae4fdf2dfd5b76c75e5c2fa4132d05fc1b0dabcd20c7e28c4", size = 23306 },
    { url = "https://files.pythonhosted.org/packages/9a/34/a15aa69f01e2181ed8d2b685c0d2f6655d5cca2c4db0ddea775e631918cd/MarkupSafe-3.0.2-cp311-cp311-win32.whl", hash = "sha256:6c89876f41da747c8d3677a2b540fb32ef5715f97b66eeb0c6b66f5e3ef6f59d", size = 15094 },
    { url = "https://files.pythonhosted.org/packages/da/b8/3a3bd761922d416f3dc5d00bfbed11f66b1ab89a0c2b6e887240a30b0f6b/MarkupSafe-3.0.2-cp311-cp311-win_amd64.whl", hash = "sha256:70a87b411535ccad5ef2f1df5136506a10775d267e197e4cf531ced10537bd6b", size = 15521 },
    { url = "https://files.pythonhosted.org/packages/22/09/d1f21434c97fc42f09d290cbb6350d44eb12f09cc62c9476effdb33a18aa/MarkupSafe-3.0.2-cp312-cp312-macosx_10_13_universal2.whl", hash = "sha256:9778bd8ab0a994ebf6f84c2b949e65736d5575320a17ae8984a77fab08db94cf", size = 14274 },
    { url = "https://files.pythonhosted.org/packages/6b/b0/18f76bba336fa5aecf79d45dcd6c806c280ec44538b3c13671d49099fdd0/MarkupSafe-3.0.2-cp312-cp312-macosx_11_0_arm64.whl", hash = "sha256:846ade7b71e3536c4e56b386c2a47adf5741d2d8b94ec9dc3e92e5e1ee1e2225", size = 12348 },
    { url = "https://files.pythonhosted.org/packages/e0/25/dd5c0f6ac1311e9b40f4af06c78efde0f3b5cbf02502f8ef9501294c425b/MarkupSafe-3.0.2-cp312-cp312-manylinux_2_17_aarch64.manylinux2014_aarch64.whl", hash = "sha256:1c99d261bd2d5f6b59325c92c73df481e05e57f19837bdca8413b9eac4bd8028", size = 24149 },
    { url = "https://files.pythonhosted.org/packages/f3/f0/89e7aadfb3749d0f52234a0c8c7867877876e0a20b60e2188e9850794c17/MarkupSafe-3.0.2-cp312-cp312-manylinux_2_17_x86_64.manylinux2014_x86_64.whl", hash = "sha256:e17c96c14e19278594aa4841ec148115f9c7615a47382ecb6b82bd8fea3ab0c8", size = 23118 },
    { url = "https://files.pythonhosted.org/packages/d5/da/f2eeb64c723f5e3777bc081da884b414671982008c47dcc1873d81f625b6/MarkupSafe-3.0.2-cp312-cp312-manylinux_2_5_i686.manylinux1_i686.manylinux_2_17_i686.manylinux2014_i686.whl", hash = "sha256:88416bd1e65dcea10bc7569faacb2c20ce071dd1f87539ca2ab364bf6231393c", size = 22993 },
    { url = "https://files.pythonhosted.org/packages/da/0e/1f32af846df486dce7c227fe0f2398dc7e2e51d4a370508281f3c1c5cddc/MarkupSafe-3.0.2-cp312-cp312-musllinux_1_2_aarch64.whl", hash = "sha256:2181e67807fc2fa785d0592dc2d6206c019b9502410671cc905d132a92866557", size = 24178 },
    { url = "https://files.pythonhosted.org/packages/c4/f6/bb3ca0532de8086cbff5f06d137064c8410d10779c4c127e0e47d17c0b71/MarkupSafe-3.0.2-cp312-cp312-musllinux_1_2_i686.whl", hash = "sha256:52305740fe773d09cffb16f8ed0427942901f00adedac82ec8b67752f58a1b22", size = 23319 },
    { url = "https://files.pythonhosted.org/packages/a2/82/8be4c96ffee03c5b4a034e60a31294daf481e12c7c43ab8e34a1453ee48b/MarkupSafe-3.0.2-cp312-cp312-musllinux_1_2_x86_64.whl", hash = "sha256:ad10d3ded218f1039f11a75f8091880239651b52e9bb592ca27de44eed242a48", size = 23352 },
    { url = "https://files.pythonhosted.org/packages/51/ae/97827349d3fcffee7e184bdf7f41cd6b88d9919c80f0263ba7acd1bbcb18/MarkupSafe-3.0.2-cp312-cp312-win32.whl", hash = "sha256:0f4ca02bea9a23221c0182836703cbf8930c5e9454bacce27e767509fa286a30", size = 15097 },
    { url = "https://files.pythonhosted.org/packages/c1/80/a61f99dc3a936413c3ee4e1eecac96c0da5ed07ad56fd975f1a9da5bc630/MarkupSafe-3.0.2-cp312-cp312-win_amd64.whl", hash = "sha256:8e06879fc22a25ca47312fbe7c8264eb0b662f6db27cb2d3bbbc74b1df4b9b87", size = 15601 },
    { url = "https://files.pythonhosted.org/packages/83/0e/67eb10a7ecc77a0c2bbe2b0235765b98d164d81600746914bebada795e97/MarkupSafe-3.0.2-cp313-cp313-macosx_10_13_universal2.whl", hash = "sha256:ba9527cdd4c926ed0760bc301f6728ef34d841f405abf9d4f959c478421e4efd", size = 14274 },
    { url = "https://files.pythonhosted.org/packages/2b/6d/9409f3684d3335375d04e5f05744dfe7e9f120062c9857df4ab490a1031a/MarkupSafe-3.0.2-cp313-cp313-macosx_11_0_arm64.whl", hash = "sha256:f8b3d067f2e40fe93e1ccdd6b2e1d16c43140e76f02fb1319a05cf2b79d99430", size = 12352 },
    { url = "https://files.pythonhosted.org/packages/d2/f5/6eadfcd3885ea85fe2a7c128315cc1bb7241e1987443d78c8fe712d03091/MarkupSafe-3.0.2-cp313-cp313-manylinux_2_17_aarch64.manylinux2014_aarch64.whl", hash = "sha256:569511d3b58c8791ab4c2e1285575265991e6d8f8700c7be0e88f86cb0672094", size = 24122 },
    { url = "https://files.pythonhosted.org/packages/0c/91/96cf928db8236f1bfab6ce15ad070dfdd02ed88261c2afafd4b43575e9e9/MarkupSafe-3.0.2-cp313-cp313-manylinux_2_17_x86_64.manylinux2014_x86_64.whl", hash = "sha256:15ab75ef81add55874e7ab7055e9c397312385bd9ced94920f2802310c930396", size = 23085 },
    { url = "https://files.pythonhosted.org/packages/c2/cf/c9d56af24d56ea04daae7ac0940232d31d5a8354f2b457c6d856b2057d69/MarkupSafe-3.0.2-cp313-cp313-manylinux_2_5_i686.manylinux1_i686.manylinux_2_17_i686.manylinux2014_i686.whl", hash = "sha256:f3818cb119498c0678015754eba762e0d61e5b52d34c8b13d770f0719f7b1d79", size = 22978 },
    { url = "https://files.pythonhosted.org/packages/2a/9f/8619835cd6a711d6272d62abb78c033bda638fdc54c4e7f4272cf1c0962b/MarkupSafe-3.0.2-cp313-cp313-musllinux_1_2_aarch64.whl", hash = "sha256:cdb82a876c47801bb54a690c5ae105a46b392ac6099881cdfb9f6e95e4014c6a", size = 24208 },
    { url = "https://files.pythonhosted.org/packages/f9/bf/176950a1792b2cd2102b8ffeb5133e1ed984547b75db47c25a67d3359f77/MarkupSafe-3.0.2-cp313-cp313-musllinux_1_2_i686.whl", hash = "sha256:cabc348d87e913db6ab4aa100f01b08f481097838bdddf7c7a84b7575b7309ca", size = 23357 },
    { url = "https://files.pythonhosted.org/packages/ce/4f/9a02c1d335caabe5c4efb90e1b6e8ee944aa245c1aaaab8e8a618987d816/MarkupSafe-3.0.2-cp313-cp313-musllinux_1_2_x86_64.whl", hash = "sha256:444dcda765c8a838eaae23112db52f1efaf750daddb2d9ca300bcae1039adc5c", size = 23344 },
    { url = "https://files.pythonhosted.org/packages/ee/55/c271b57db36f748f0e04a759ace9f8f759ccf22b4960c270c78a394f58be/MarkupSafe-3.0.2-cp313-cp313-win32.whl", hash = "sha256:bcf3e58998965654fdaff38e58584d8937aa3096ab5354d493c77d1fdd66d7a1", size = 15101 },
    { url = "https://files.pythonhosted.org/packages/29/88/07df22d2dd4df40aba9f3e402e6dc1b8ee86297dddbad4872bd5e7b0094f/MarkupSafe-3.0.2-cp313-cp313-win_amd64.whl", hash = "sha256:e6a2a455bd412959b57a172ce6328d2dd1f01cb2135efda2e4576e8a23fa3b0f", size = 15603 },
    { url = "https://files.pythonhosted.org/packages/62/6a/8b89d24db2d32d433dffcd6a8779159da109842434f1dd2f6e71f32f738c/MarkupSafe-3.0.2-cp313-cp313t-macosx_10_13_universal2.whl", hash = "sha256:b5a6b3ada725cea8a5e634536b1b01c30bcdcd7f9c6fff4151548d5bf6b3a36c", size = 14510 },
    { url = "https://files.pythonhosted.org/packages/7a/06/a10f955f70a2e5a9bf78d11a161029d278eeacbd35ef806c3fd17b13060d/MarkupSafe-3.0.2-cp313-cp313t-macosx_11_0_arm64.whl", hash = "sha256:a904af0a6162c73e3edcb969eeeb53a63ceeb5d8cf642fade7d39e7963a22ddb", size = 12486 },
    { url = "https://files.pythonhosted.org/packages/34/cf/65d4a571869a1a9078198ca28f39fba5fbb910f952f9dbc5220afff9f5e6/MarkupSafe-3.0.2-cp313-cp313t-manylinux_2_17_aarch64.manylinux2014_aarch64.whl", hash = "sha256:4aa4e5faecf353ed117801a068ebab7b7e09ffb6e1d5e412dc852e0da018126c", size = 25480 },
    { url = "https://files.pythonhosted.org/packages/0c/e3/90e9651924c430b885468b56b3d597cabf6d72be4b24a0acd1fa0e12af67/MarkupSafe-3.0.2-cp313-cp313t-manylinux_2_17_x86_64.manylinux2014_x86_64.whl", hash = "sha256:c0ef13eaeee5b615fb07c9a7dadb38eac06a0608b41570d8ade51c56539e509d", size = 23914 },
    { url = "https://files.pythonhosted.org/packages/66/8c/6c7cf61f95d63bb866db39085150df1f2a5bd3335298f14a66b48e92659c/MarkupSafe-3.0.2-cp313-cp313t-manylinux_2_5_i686.manylinux1_i686.manylinux_2_17_i686.manylinux2014_i686.whl", hash = "sha256:d16a81a06776313e817c951135cf7340a3e91e8c1ff2fac444cfd75fffa04afe", size = 23796 },
    { url = "https://files.pythonhosted.org/packages/bb/35/cbe9238ec3f47ac9a7c8b3df7a808e7cb50fe149dc7039f5f454b3fba218/MarkupSafe-3.0.2-cp313-cp313t-musllinux_1_2_aarch64.whl", hash = "sha256:6381026f158fdb7c72a168278597a5e3a5222e83ea18f543112b2662a9b699c5", size = 25473 },
    { url = "https://files.pythonhosted.org/packages/e6/32/7621a4382488aa283cc05e8984a9c219abad3bca087be9ec77e89939ded9/MarkupSafe-3.0.2-cp313-cp313t-musllinux_1_2_i686.whl", hash = "sha256:3d79d162e7be8f996986c064d1c7c817f6df3a77fe3d6859f6f9e7be4b8c213a", size = 24114 },
    { url = "https://files.pythonhosted.org/packages/0d/80/0985960e4b89922cb5a0bac0ed39c5b96cbc1a536a99f30e8c220a996ed9/MarkupSafe-3.0.2-cp313-cp313t-musllinux_1_2_x86_64.whl", hash = "sha256:131a3c7689c85f5ad20f9f6fb1b866f402c445b220c19fe4308c0b147ccd2ad9", size = 24098 },
    { url = "https://files.pythonhosted.org/packages/82/78/fedb03c7d5380df2427038ec8d973587e90561b2d90cd472ce9254cf348b/MarkupSafe-3.0.2-cp313-cp313t-win32.whl", hash = "sha256:ba8062ed2cf21c07a9e295d5b8a2a5ce678b913b45fdf68c32d95d6c1291e0b6", size = 15208 },
    { url = "https://files.pythonhosted.org/packages/4f/65/6079a46068dfceaeabb5dcad6d674f5f5c61a6fa5673746f42a9f4c233b3/MarkupSafe-3.0.2-cp313-cp313t-win_amd64.whl", hash = "sha256:e444a31f8db13eb18ada366ab3cf45fd4b31e4db1236a4448f68778c1d1a5a2f", size = 15739 },
]

[[package]]
name = "nodeenv"
version = "1.9.1"
source = { registry = "https://pypi.org/simple" }
sdist = { url = "https://files.pythonhosted.org/packages/43/16/fc88b08840de0e0a72a2f9d8c6bae36be573e475a6326ae854bcc549fc45/nodeenv-1.9.1.tar.gz", hash = "sha256:6ec12890a2dab7946721edbfbcd91f3319c6ccc9aec47be7c7e6b7011ee6645f", size = 47437 }
wheels = [
    { url = "https://files.pythonhosted.org/packages/d2/1d/1b658dbd2b9fa9c4c9f32accbfc0205d532c8c6194dc0f2a4c0428e7128a/nodeenv-1.9.1-py2.py3-none-any.whl", hash = "sha256:ba11c9782d29c27c70ffbdda2d7415098754709be8a7056d79a737cd901155c9", size = 22314 },
]

[[package]]
name = "packaging"
version = "24.2"
source = { registry = "https://pypi.org/simple" }
sdist = { url = "https://files.pythonhosted.org/packages/d0/63/68dbb6eb2de9cb10ee4c9c14a0148804425e13c4fb20d61cce69f53106da/packaging-24.2.tar.gz", hash = "sha256:c228a6dc5e932d346bc5739379109d49e8853dd8223571c7c5b55260edc0b97f", size = 163950 }
wheels = [
    { url = "https://files.pythonhosted.org/packages/88/ef/eb23f262cca3c0c4eb7ab1933c3b1f03d021f2c48f54763065b6f0e321be/packaging-24.2-py3-none-any.whl", hash = "sha256:09abb1bccd265c01f4a3aa3f7a7db064b36514d2cba19a2f694fe6150451a759", size = 65451 },
]

[[package]]
name = "pyright"
version = "1.1.389"
source = { registry = "https://pypi.org/simple" }
dependencies = [
    { name = "nodeenv" },
    { name = "typing-extensions" },
]
sdist = { url = "https://files.pythonhosted.org/packages/72/4e/9a5ab8745e7606b88c2c7ca223449ac9d82a71fd5e31df47b453f2cb39a1/pyright-1.1.389.tar.gz", hash = "sha256:716bf8cc174ab8b4dcf6828c3298cac05c5ed775dda9910106a5dcfe4c7fe220", size = 21940 }
wheels = [
    { url = "https://files.pythonhosted.org/packages/1b/26/c288cabf8cfc5a27e1aa9e5029b7682c0f920b8074f45d22bf844314d66a/pyright-1.1.389-py3-none-any.whl", hash = "sha256:41e9620bba9254406dc1f621a88ceab5a88af4c826feb4f614d95691ed243a60", size = 18581 },
]

[[package]]
name = "ruff"
version = "0.7.4"
source = { registry = "https://pypi.org/simple" }
sdist = { url = "https://files.pythonhosted.org/packages/0b/8b/bc4e0dfa1245b07cf14300e10319b98e958a53ff074c1dd86b35253a8c2a/ruff-0.7.4.tar.gz", hash = "sha256:cd12e35031f5af6b9b93715d8c4f40360070b2041f81273d0527683d5708fce2", size = 3275547 }
wheels = [
    { url = "https://files.pythonhosted.org/packages/e6/4b/f5094719e254829766b807dadb766841124daba75a37da83e292ae5ad12f/ruff-0.7.4-py3-none-linux_armv6l.whl", hash = "sha256:a4919925e7684a3f18e18243cd6bea7cfb8e968a6eaa8437971f681b7ec51478", size = 10447512 },
    { url = "https://files.pythonhosted.org/packages/9e/1d/3d2d2c9f601cf6044799c5349ff5267467224cefed9b35edf5f1f36486e9/ruff-0.7.4-py3-none-macosx_10_12_x86_64.whl", hash = "sha256:cfb365c135b830778dda8c04fb7d4280ed0b984e1aec27f574445231e20d6c63", size = 10235436 },
    { url = "https://files.pythonhosted.org/packages/62/83/42a6ec6216ded30b354b13e0e9327ef75a3c147751aaf10443756cb690e9/ruff-0.7.4-py3-none-macosx_11_0_arm64.whl", hash = "sha256:63a569b36bc66fbadec5beaa539dd81e0527cb258b94e29e0531ce41bacc1f20", size = 9888936 },
    { url = "https://files.pythonhosted.org/packages/4d/26/e1e54893b13046a6ad05ee9b89ee6f71542ba250f72b4c7a7d17c3dbf73d/ruff-0.7.4-py3-none-manylinux_2_17_aarch64.manylinux2014_aarch64.whl", hash = "sha256:0d06218747d361d06fd2fdac734e7fa92df36df93035db3dc2ad7aa9852cb109", size = 10697353 },
    { url = "https://files.pythonhosted.org/packages/21/24/98d2e109c4efc02bfef144ec6ea2c3e1217e7ce0cfddda8361d268dfd499/ruff-0.7.4-py3-none-manylinux_2_17_armv7l.manylinux2014_armv7l.whl", hash = "sha256:e0cea28d0944f74ebc33e9f934238f15c758841f9f5edd180b5315c203293452", size = 10228078 },
    { url = "https://files.pythonhosted.org/packages/ad/b7/964c75be9bc2945fc3172241b371197bb6d948cc69e28bc4518448c368f3/ruff-0.7.4-py3-none-manylinux_2_17_i686.manylinux2014_i686.whl", hash = "sha256:80094ecd4793c68b2571b128f91754d60f692d64bc0d7272ec9197fdd09bf9ea", size = 11264823 },
    { url = "https://files.pythonhosted.org/packages/12/8d/20abdbf705969914ce40988fe71a554a918deaab62c38ec07483e77866f6/ruff-0.7.4-py3-none-manylinux_2_17_ppc64.manylinux2014_ppc64.whl", hash = "sha256:997512325c6620d1c4c2b15db49ef59543ef9cd0f4aa8065ec2ae5103cedc7e7", size = 11951855 },
    { url = "https://files.pythonhosted.org/packages/b8/fc/6519ce58c57b4edafcdf40920b7273dfbba64fc6ebcaae7b88e4dc1bf0a8/ruff-0.7.4-py3-none-manylinux_2_17_ppc64le.manylinux2014_ppc64le.whl", hash = "sha256:00b4cf3a6b5fad6d1a66e7574d78956bbd09abfd6c8a997798f01f5da3d46a05", size = 11516580 },
    { url = "https://files.pythonhosted.org/packages/37/1a/5ec1844e993e376a86eb2456496831ed91b4398c434d8244f89094758940/ruff-0.7.4-py3-none-manylinux_2_17_s390x.manylinux2014_s390x.whl", hash = "sha256:7dbdc7d8274e1422722933d1edddfdc65b4336abf0b16dfcb9dedd6e6a517d06", size = 12692057 },
    { url = "https://files.pythonhosted.org/packages/50/90/76867152b0d3c05df29a74bb028413e90f704f0f6701c4801174ba47f959/ruff-0.7.4-py3-none-manylinux_2_17_x86_64.manylinux2014_x86_64.whl", hash = "sha256:0e92dfb5f00eaedb1501b2f906ccabfd67b2355bdf117fea9719fc99ac2145bc", size = 11085137 },
    { url = "https://files.pythonhosted.org/packages/c8/eb/0a7cb6059ac3555243bd026bb21785bbc812f7bbfa95a36c101bd72b47ae/ruff-0.7.4-py3-none-musllinux_1_2_aarch64.whl", hash = "sha256:3bd726099f277d735dc38900b6a8d6cf070f80828877941983a57bca1cd92172", size = 10681243 },
    { url = "https://files.pythonhosted.org/packages/5e/76/2270719dbee0fd35780b05c08a07b7a726c3da9f67d9ae89ef21fc18e2e5/ruff-0.7.4-py3-none-musllinux_1_2_armv7l.whl", hash = "sha256:2e32829c429dd081ee5ba39aef436603e5b22335c3d3fff013cd585806a6486a", size = 10319187 },
    { url = "https://files.pythonhosted.org/packages/9f/e5/39100f72f8ba70bec1bd329efc880dea8b6c1765ea1cb9d0c1c5f18b8d7f/ruff-0.7.4-py3-none-musllinux_1_2_i686.whl", hash = "sha256:662a63b4971807623f6f90c1fb664613f67cc182dc4d991471c23c541fee62dd", size = 10803715 },
    { url = "https://files.pythonhosted.org/packages/a5/89/40e904784f305fb56850063f70a998a64ebba68796d823dde67e89a24691/ruff-0.7.4-py3-none-musllinux_1_2_x86_64.whl", hash = "sha256:876f5e09eaae3eb76814c1d3b68879891d6fde4824c015d48e7a7da4cf066a3a", size = 11162912 },
    { url = "https://files.pythonhosted.org/packages/8d/1b/dd77503b3875c51e3dbc053fd8367b845ab8b01c9ca6d0c237082732856c/ruff-0.7.4-py3-none-win32.whl", hash = "sha256:75c53f54904be42dd52a548728a5b572344b50d9b2873d13a3f8c5e3b91f5cac", size = 8702767 },
    { url = "https://files.pythonhosted.org/packages/63/76/253ddc3e89e70165bba952ecca424b980b8d3c2598ceb4fc47904f424953/ruff-0.7.4-py3-none-win_amd64.whl", hash = "sha256:745775c7b39f914238ed1f1b0bebed0b9155a17cd8bc0b08d3c87e4703b990d6", size = 9497534 },
    { url = "https://files.pythonhosted.org/packages/aa/70/f8724f31abc0b329ca98b33d73c14020168babcf71b0cba3cded5d9d0e66/ruff-0.7.4-py3-none-win_arm64.whl", hash = "sha256:11bff065102c3ae9d3ea4dc9ecdfe5a5171349cdd0787c1fc64761212fc9cf1f", size = 8851590 },
]

[[package]]
name = "toml"
version = "0.10.2"
source = { registry = "https://pypi.org/simple" }
sdist = { url = "https://files.pythonhosted.org/packages/be/ba/1f744cdc819428fc6b5084ec34d9b30660f6f9daaf70eead706e3203ec3c/toml-0.10.2.tar.gz", hash = "sha256:b3bda1d108d5dd99f4a20d24d9c348e91c4db7ab1b749200bded2f839ccbe68f", size = 22253 }
wheels = [
    { url = "https://files.pythonhosted.org/packages/44/6f/7120676b6d73228c96e17f1f794d8ab046fc910d781c8d151120c3f1569e/toml-0.10.2-py2.py3-none-any.whl", hash = "sha256:806143ae5bfb6a3c6e736a764057db0e6a0e05e338b5630894a5f779cabb4f9b", size = 16588 },
]

[[package]]
name = "typing-extensions"
version = "4.12.2"
source = { registry = "https://pypi.org/simple" }
sdist = { url = "https://files.pythonhosted.org/packages/df/db/f35a00659bc03fec321ba8bce9420de607a1d37f8342eee1863174c69557/typing_extensions-4.12.2.tar.gz", hash = "sha256:1a7ead55c7e559dd4dee8856e3a88b41225abfe1ce8df57b7c13915fe121ffb8", size = 85321 }
wheels = [
    { url = "https://files.pythonhosted.org/packages/26/9f/ad63fc0248c5379346306f8668cda6e2e2e9c95e01216d2b8ffd9ff037d0/typing_extensions-4.12.2-py3-none-any.whl", hash = "sha256:04e5ca0351e0f3f85c6853954072df659d0d13fac324d0072316b67d7794700d", size = 37438 },
]
```

uv.lock 文件是使用 `uv` 包管理器创建的锁文件，用于确保项目依赖项的可重复构建。它详细记录了项目及其所有依赖项的确切版本和来源，包括 wheel 文件和 sdist 文件的 URL 和哈希值。

以下是该文件的主要部分的解释：

*   **`version = 1`**: 锁文件格式的版本。
*   **`requires-python = ">=3.10"`**: 项目所需的 Python 版本。
*   **`[[package]]`**: 定义一个依赖包。每个依赖包都有以下属性：
    *   `name`: 包的名称。
    *   `version`: 包的版本。
    *   `source`: 包的来源，通常是 PyPI 仓库。
    *   `dependencies`: 包的依赖项。
    *   `sdist`: 源代码分发包的信息，包括 URL、哈希值和大小。
    *   `wheels`: 预编译的 wheel 包的信息，包括 URL、哈希值和大小。
*   **`[package.dev-dependencies]`**: 定义开发依赖项。
    *   `dev`: 开发依赖项列表，例如 `pyright` 和 `ruff`。
*   **`[package.metadata]`**: 包的元数据。
    *   `requires-dist`: 包的依赖项及其版本说明符。
*   **`[package.metadata.requires-dev]`**: 开发依赖项及其版本说明符。

**总结**

uv.lock 文件通过锁定项目依赖项的确切版本，确保了项目在不同环境中的一致性和可重复性。这有助于避免由于依赖项版本不兼容而导致的问题。


# 贡献

感谢您对贡献 `create-mcp-server` 感兴趣！ 此工具可帮助开发人员快速搭建新的 MCP（模型上下文协议）服务器。

## 入门

1. Fork 存储库
2. 克隆您的 Fork：`git clone https://github.com/YOUR_USERNAME/create-python-server.git`
3. 安装依赖项：`uv sync --dev --all-extras`

## 开发

- 在 `src` 目录中进行更改
- 通过创建新服务器来测试您的更改：`uv run -m create_mcp_server test-server`
- 运行类型检查：`uv run pyright`
- 运行 Lint：`uv run ruff check .`

## Pull Requests

1. 为您的更改创建一个新分支
2. 进行更改
3. 确保类型检查和 Lint 通过
4. 使用您的更改测试服务器创建
5. 提交一个 Pull Request，清楚地描述您的更改

## 报告问题

- 使用 [GitHub 问题跟踪器](https://github.com/modelcontextprotocol/create-python-server/issues)
- 提供清晰的重现步骤
- 包括相关的系统信息
- 指定您正在使用的版本

