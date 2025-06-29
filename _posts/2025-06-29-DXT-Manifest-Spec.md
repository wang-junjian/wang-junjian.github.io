---
layout: single
title:  "DXT Manifest.json 规范"
date:   2025-06-29 08:00:00 +0800
categories: DXT MCP
tags: [DXT, MCP, MCPServer, Manifest]
---

该文档概述了 **DXT Manifest.json 规范**，这是一个用于定义扩展元数据和配置的JSON文件标准。它详细说明了 **manifest.json** 文件的结构，包括 **必填字段** 如版本、名称、作者和服务器配置，以及 **可选字段** 如显示名称、描述、存储库信息和屏幕截图。此外，规范还涵盖了 **兼容性要求**（针对客户端、平台和运行时）、**服务器配置**（支持Python、Node.js和二进制类型，并允许平台特定覆盖和变量替换），以及 **用户可配置选项** 的定义和传递方式。最后，文档解释了如何声明扩展提供的 **工具和提示**，并支持动态生成这些功能。

<!--more-->

## Manifest 结构

`manifest.json` 文件包含所有扩展的元数据和配置。大多数字段是可选的。

一个只包含必填字段的基本 `manifest.json` 如下所示：

```json
{
  "dxt_version": "0.1", // 此 manifest 符合的 DXT 规范版本
  "name": "my-extension", // 机器可读名称（用于 CLI、API）
  "version": "1.0.0", // 您的扩展的语义化版本
  "description": "一个简单的 MCP 扩展", // 扩展功能的简要描述
  "author": {
    // 作者信息（必填）
    "name": "Extension Author" // 作者姓名（必填字段）
  },
  "server": {
    // 服务器配置（必填）
    "type": "node", // 服务器类型："node"、"python" 或 "binary"
    "entry_point": "server/index.js", // 主服务器文件的路径
    "mcp_config": {
      // MCP 服务器配置
      "command": "node", // 运行服务器的命令
      "args": [
        // 传递给命令的参数
        "${__dirname}/server/index.js" // ${__dirname} 会被替换为扩展的目录
      ]
    }
  }
}
```

```json
{
  "dxt_version": "0.1",
  "name": "my-extension",
  "version": "1.0.0",
  "description": "一个简单的 MCP 扩展",
  "author": {
    "name": "Extension Author"
  },
  "server": {
    "type": "node",
    "entry_point": "server/index.js",
    "mcp_config": {
      "command": "node",
      "args": ["${__dirname}/server/index.js"],
      "env": {
        "API_KEY": "${user_config.api_key}"
      }
    }
  },
  "user_config": {
    "api_key": {
      "type": "string",
      "title": "API 密钥",
      "description": "用于身份验证的 API 密钥",
      "sensitive": true,
      "required": true
    }
  }
}
```

一个包含大部分可选字段的完整 `manifest.json` 如下所示：

```json
{
  "dxt_version": "0.1",
  "name": "My MCP Extension",
  "display_name": "我的超棒 MCP 扩展",
  "version": "1.0.0",
  "description": "关于此扩展功能的简要描述",
  "long_description": "详细描述，可以包含多个段落，解释扩展的功能、用例和特性。支持基本的 markdown。",
  "author": {
    "name": "你的名字",
    "email": "yourname@example.com",
    "url": "https://your-website.com"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/your-username/my-mcp-extension"
  },
  "homepage": "https://example.com/my-extension",
  "documentation": "https://docs.example.com/my-extension",
  "support": "https://github.com/your-username/my-extension/issues",
  "icon": "icon.png",
  "screenshots": [
    "assets/screenshots/screenshot1.png",
    "assets/screenshots/screenshot2.png"
  ],
  "server": {
    "type": "node",
    "entry_point": "server/index.js",
    "mcp_config": {
      "command": "node",
      "args": ["server/index.js"],
      "env": {
        "ALLOWED_DIRECTORIES": "${user_config.allowed_directories}"
      }
    }
  },
  "tools": [
    {
      "name": "search_files",
      "description": "在目录中搜索文件"
    }
  ],
  "prompts": [
    {
      "name": "poetry",
      "description": "让 LLM 写诗",
      "arguments": ["topic"],
      "text": "围绕以下主题写一首有创意的诗：${arguments.topic}"
    }
  ],
  "tools_generated": true,
  "keywords": ["api", "automation", "productivity"],
  "license": "MIT",
  "compatibility": {
    "claude_desktop": ">=1.0.0",
    "platforms": ["darwin", "win32", "linux"],
    "runtimes": {
      "python": ">=3.8",
      "node": ">=16.0.0"
    }
  },
  "user_config": {
    "allowed_directories": {
      "type": "directory",
      "title": "允许的目录",
      "description": "服务器可以访问的目录",
      "multiple": true,
      "required": true,
      "default": ["${HOME}/Desktop"]
    },
    "api_key": {
      "type": "string",
      "title": "API 密钥",
      "description": "用于身份验证的 API 密钥",
      "sensitive": true,
      "required": false
    },
    "max_file_size": {
      "type": "number",
      "title": "最大文件大小 (MB)",
      "description": "要处理的最大文件大小",
      "default": 10,
      "min": 1,
      "max": 100
    }
  }
}
```

## 字段定义

### 必填字段

- **dxt_version**: 此扩展遵循的规范版本
- **name**: 机器可读名称（用于 CLI、API）
- **version**: 语义化版本 (semver)
- **description**: 简要描述
- **author**: 作者信息对象，包含 name（必填）、email（可选）和 url（可选）
- **server**: 服务器配置对象

### 可选字段

- **icon**: 指向 png 图标文件的路径，可以是包内的相对路径或 https:// 网址。
- **display_name**: 用于 UI 显示的用户友好名称
- **long_description**: 用于扩展商店的详细描述，支持 markdown
- **repository**: 源代码仓库信息（类型和 url）
- **homepage**: 扩展主页 URL
- **documentation**: 文档 URL
- **support**: 支持/问题跟踪 URL
- **screenshots**: 屏幕截图路径数组
- **tools**: 扩展提供的工具数组
- **tools_generated**: 布尔值，指示服务器是否在运行时生成额外的工具（默认为 false）
- **prompts**: 扩展提供的提示数组
- **prompts_generated**: 布尔值，指示服务器是否在运行时生成额外的提示（默认为 false）
- **keywords**: 搜索关键词
- **license**: 许可证标识符
- **compatibility**: 兼容性要求（客户端应用版本、平台和运行时版本）
- **user_config**: 扩展的用户可配置选项（参见用户配置部分）

## 兼容性

`compatibility` 对象指定了运行扩展的所有要求。所有字段，包括 `compatibility` 字段本身，都是可选的。如果您什么都不指定，鼓励实现 DXT 的客户端在任何系统上运行该扩展。

```json
{
  "compatibility": {
    "claude_desktop": ">=1.0.0",
    "my_client": ">1.0.0",
    "other_client": ">=2.0.0 <3.0.0",
    "platforms": ["darwin", "win32", "linux"],
    "runtimes": {
      "python": ">=3.8",
      "node": ">=16.0.0"
    }
  }
}
```

### 字段

#### 客户端版本约束

兼容性对象支持任何客户端应用程序的版本约束：

- **claude_desktop**: 所需的最低 Claude Desktop 版本（使用 semver）
- **my_client**: 自定义客户端的版本约束（使用 semver）
- **其他客户端名称**: 您可以为任何客户端应用程序添加版本约束

所有客户端版本约束都使用 semver 语法（例如 `">=1.0.0"`、`">1.0.0 <2.0.0"`、`"^1.2.3"`）。

#### 系统要求

- **platforms**: 支持的平台数组（`darwin`、`win32`、`linux`）。这些值与 Node.js 的 `process.platform` 和 Python 的 `sys.platform` 值相匹配。如果省略，则支持所有平台。
- **runtimes**: 运行时版本要求
  - 仅指定您的扩展实际使用的运行时
  - 对于 Python 扩展：指定 `python` 版本
  - 对于 Node.js 扩展：指定 `node` 版本
  - 二进制扩展不需要运行时规范

**注意**：macOS 使用 `darwin`，Windows 使用 `win32`，Linux 系统使用 `linux`。

### 示例

**Python 扩展：**

```json
{
  "server": {
    "type": "python",
    "entry_point": "server/main.py"
  },
  "compatibility": {
    "claude_desktop": ">=0.10.0",
    "platforms": ["darwin", "win32", "linux"],
    "runtimes": {
      "python": ">=3.8,<4.0"
    }
  }
}
```

**仅支持 macOS 的 Node.js 扩展：**

```json
{
  "server": {
    "type": "node",
    "entry_point": "server/index.js"
  },
  "compatibility": {
    "claude_desktop": ">=0.10.0",
    "platforms": ["darwin"],
    "runtimes": {
      "node": ">=16.0.0"
    }
  }
}
```

**二进制扩展（无需运行时）：**

```json
{
  "server": {
    "type": "binary",
    "entry_point": "server/my-tool"
  },
  "compatibility": {
    "claude_desktop": ">=0.10.0",
    "platforms": ["darwin", "win32"]
  }
}
```

## 服务器配置

`server` 对象定义了如何运行 MCP 服务器：

### 服务器类型

1.  **Python**: `server.type = "python"`
    -   要求 `entry_point` 指向 Python 文件
    -   所有依赖项必须打包在 DXT 中
    -   可以使用 `server/lib` 存放包，或使用 `server/venv` 存放完整的虚拟环境
    -   Python 运行时版本在 `compatibility.runtimes.python` 中指定

2.  **Node.js**: `server.type = "node"`
    -   要求 `entry_point` 指向 JavaScript 文件
    -   所有依赖项必须打包在 `node_modules` 中
    -   Node.js 运行时版本在 `compatibility.runtimes.node` 中指定
    -   通常在扩展根目录包含 `package.json` 用于依赖管理

3.  **Binary**: `server.type = "binary"`
    -   包含所有依赖项的预编译可执行文件
    -   支持特定于平台（platform-specific）的二进制文件
    -   完全自包含（无运行时要求）

### MCP 配置

服务器配置中的 `mcp_config` 对象定义了实现此规范的应用应如何执行 MCP 服务器。这取代了用户当前需要手动编写的 JSON 配置。

**Python 示例：**

```json
"mcp_config": {
  "command": "python",
  "args": ["server/main.py"],
  "env": {
    "PYTHONPATH": "server/lib"
  }
}
```

**Node.js 示例：**

```json
"mcp_config": {
  "command": "node",
  "args": ["${__dirname}/server/index.js"],
  "env": {}
}
```

**二进制示例（跨平台）：**

```json
"mcp_config": {
  "command": "server/my-server",
  "args": ["--config", "server/config.json"],
  "env": {}
}
```

_注意：对于二进制文件，应用在 Windows 上会自动附加 `.exe` 后缀_

**特定于平台的配置：**
对于不同平台需要不同配置的情况，请使用特定于平台的覆盖（overrides）：

```json
"mcp_config": {
  "command": "server/my-server",
  "args": ["--config", "server/config.json"],
  "env": {},
  "platform_overrides": {
    "win32": {
      "command": "server/my-server.exe",
      "args": ["--config", "server/config-windows.json"]
    },
    "darwin": {
      "env": {
        "DYLD_LIBRARY_PATH": "server/lib"
      }
    }
  }
}
```

安装扩展时，应用将自动生成适当的 MCP 服务器配置并将其添加到用户的设置中，从而无需手动编辑 JSON。

**变量替换：**
实现此规范的桌面应用将在 `mcp_config` 中替换变量，以使扩展更具可移植性：

- **`${__dirname}`**: 此变量被替换为扩展目录的绝对路径。这对于引用扩展包内的文件很有用。
- **`${HOME}`**: 用户的主目录
- **`${DESKTOP}`**: 用户的桌面目录
- **`${DOCUMENTS}`**: 用户的文档目录
- **`${DOWNLOADS}`**: 用户的下载目录
- **`${pathSeparator}`** 或 **`${/}`**: 当前平台的路径分隔符

示例：

```json
"mcp_config": {
  "command": "python",
  "args": ["${__dirname}/server/main.py"],
  "env": {
    "CONFIG_PATH": "${__dirname}/config/settings.json"
  }
}
```

这确保了无论扩展安装在用户系统的哪个位置，路径都能正常工作。

- **`${user_config}`**: 您的扩展可以指定由用户配置的值，实现此规范的应用将从用户那里收集这些值。请继续阅读以了解有关用户配置的更多信息。

## 用户配置

`user_config` 字段允许扩展开发者指定配置选项，这些选项可以通过实现此规范的应用的用户界面呈现给最终用户。这些配置从用户处收集，并在运行时传递给 MCP 服务器。

### 配置结构

每个配置选项都定义为一个键值对，其中键是配置名称，值是具有以下属性的对象：

- **type**: 配置的数据类型
  - `"string"`: 文本输入
  - `"number"`: 数字输入
  - `"boolean"`: 复选框/开关
  - `"directory"`: 目录选择器
  - `"file"`: 文件选择器
- **title**: 在 UI 中显示的名称
- **description**: 解释配置选项的帮助文本
- **required**: 是否必须提供此字段（默认为 false）
- **default**: 默认值（支持变量替换）
- **multiple**: 对于目录/文件类型，是否允许选择多个（默认为 false）
- **sensitive**: 对于字符串类型，是否屏蔽输入并安全存储（默认为 false）
- **min/max**: 对于数字类型，验证约束

### 用户配置中的变量替换

用户配置值支持在 `mcp_config` 中进行变量替换：

- **`${user_config.KEY}`**: 替换为用户为配置 KEY 提供的值
- 数组（来自多选）将作为单独的参数展开
- 环境变量是敏感数据的理想选择
- 命令参数适用于路径和非敏感选项

可用于默认值的变量：

- **`${HOME}`**: 用户的主目录
- **`${DESKTOP}`**: 用户的桌面目录
- **`${DOCUMENTS}`**: 用户的文档目录

### 示例

**带目录配置的文件系统扩展：**

```json
{
  "user_config": {
    "allowed_directories": {
      "type": "directory",
      "title": "允许的目录",
      "description": "选择文件系统服务器可以访问的目录",
      "multiple": true,
      "required": true,
      "default": ["${HOME}/Desktop", "${HOME}/Documents"]
    }
  },
  "server": {
    "mcp_config": {
      "command": "node",
      "args": [
        "${__dirname}/server/index.js",
        "${user_config.allowed_directories}"
      ]
    }
  }
}
```

**带身份验证的 API 集成：**

```json
{
  "user_config": {
    "api_key": {
      "type": "string",
      "title": "API 密钥",
      "description": "用于身份验证的 API 密钥",
      "sensitive": true,
      "required": true
    },
    "base_url": {
      "type": "string",
      "title": "API 基础 URL",
      "description": "API 请求的基础 URL",
      "default": "https://api.example.com",
      "required": false
    }
  },
  "server": {
    "mcp_config": {
      "command": "node",
      "args": ["server/index.js"],
      "env": {
        "API_KEY": "${user_config.api_key}",
        "BASE_URL": "${user_config.base_url}"
      }
    }
  }
}
```

**数据库连接配置：**

```json
{
  "user_config": {
    "database_path": {
      "type": "file",
      "title": "数据库文件",
      "description": "您的 SQLite 数据库文件的路径",
      "required": true
    },
    "read_only": {
      "type": "boolean",
      "title": "只读模式",
      "description": "以只读模式打开数据库",
      "default": true
    },
    "timeout": {
      "type": "number",
      "title": "查询超时（秒）",
      "description": "查询执行的最长时间",
      "default": 30,
      "min": 1,
      "max": 300
    }
  },
  "server": {
    "mcp_config": {
      "command": "python",
      "args": [
        "server/main.py",
        "--database",
        "${user_config.database_path}",
        "--timeout",
        "${user_config.timeout}"
      ],
      "env": {
        "READ_ONLY": "${user_config.read_only}"
      }
    }
  }
}
```

### 实现说明

- **数组展开**: 当 `multiple: true` 的配置在 `args` 中使用时，每个值都会被展开为单独的参数。例如，如果用户选择了目录 `/home/user/docs` 和 `/home/user/projects`，那么 `args` `["${user_config.allowed_directories}"]` 会变成 `["/home/user/docs", "/home/user/projects"]`。

## 工具和提示

这些字段描述了您的 MCP 服务器提供的工具和提示。对于在运行时动态生成功能的服务器，您可以使用 `_generated` 标志来表明这一点。

注意：资源不包含在 manifest 中，因为 MCP 资源本质上是动态的——它们代表了服务器在运行时根据配置、文件系统状态、数据库连接等发现的数据的 URI。

### 静态声明

对于具有固定功能集的服务器，请将它们列在数组中。

#### 提示结构

`prompts` 数组中的每个提示必须包含：

- **name**: 提示的标识符
- **description** (可选): 解释提示的作用
- **arguments** (可选): 可在提示文本中使用的参数名称数组
- **text**: 实际的提示文本，使用像 `${arguments.topic}` 或 `${arguments.aspect}` 这样的模板变量作为 MCP 客户端提供参数的占位符。如果您的参数名为 `language`，您应在希望它出现的位置添加 `${arguments.language}`。

示例：

```json
{
  "tools": [
    { "name": "search_files", "description": "搜索文件" },
    { "name": "read_file", "description": "读取文件内容" }
  ],
  "prompts": [
    {
      "name": "explain_code",
      "description": "解释代码如何工作",
      "arguments": ["code", "language"],
      "text": "请详细解释以下 ${arguments.language} 代码：\n\n${arguments.code}"
    }
  ]
}
```

实现此规范的应用可以选择在运行时根据您在 manifest 中的提示声明来验证提示。

### 动态生成

对于根据上下文、配置或运行时发现来生成功能的服务器，请使用 `_generated` 标志：

```json
{
  "tools": [{ "name": "search", "description": "搜索功能" }],
  "tools_generated": true,
  "prompts_generated": true
}
```

这表明：

- 服务器至少提供 `search` 工具（可能还有更多）
- 额外的工具在运行时生成
- 提示在运行时生成

`_generated` 字段：

- **tools_generated**: 服务器生成除所列工具之外的额外工具（默认为 false）
- **prompts_generated**: 服务器生成除所列提示之外的额外提示（默认为 false）

这有助于实现此规范的应用理解，在运行时查询服务器将揭示比 manifest 中声明的更多的功能。

## 参考资料
- [DXT Manifest.json Spec](https://github.com/anthropics/dxt/blob/main/MANIFEST.md)
- [Desktop Extensions (DXT)](https://github.com/anthropics/dxt)
- [DXT Examples](https://github.com/anthropics/dxt/tree/main/examples)
