---
layout: single
title:  "MCP 服务器开发协议"
date:   2025-04-24 10:00:00 +0800
categories: ClineDoc MCP
tags: [Cline, MCP, ClineDoc]
---

# 开发协议
有效的 MCP 服务器开发的核心是遵循结构化的协议。该协议通过位于 MCP 工作目录根目录（/Users/your-name/Documents/Cline/MCP）中的 `.clinerules` 文件实现。

## 使用 `.clinerules` 文件
`.clinerules` 文件是一个特殊的配置文件，Cline 会在放置该文件的目录中工作时自动读取。这些文件：

- 配置 Cline 的行为并执行最佳实践
- 将 Cline 切换到专门的 MCP 开发模式
- 提供构建服务器的分步协议
- 实施安全措施，如防止过早完成
- 指导您完成规划、实施和测试阶段

以下是应放置在 `.clinerules` 文件中的完整 MCP 服务器开发协议：

```markdown
# MCP Server Development Protocol

⚠️ CRITICAL: DO NOT USE attempt_completion BEFORE TESTING ⚠️

## Step 1: Planning (PLAN MODE)
- What problem does this tool solve?
- What API/service will it use?
- What are the authentication requirements?
  □ Standard API key
  □ OAuth (requires separate setup script)
  □ Other credentials

## Step 2: Implementation (ACT MODE)
1. Bootstrap
   - For web services, JavaScript integration, or Node.js environments:
     ```bash
     npx @modelcontextprotocol/create-server my-server
     cd my-server
     npm install
     ```
   - For data science, ML workflows, or Python environments:
     ```bash
     pip install mcp
     # Or with uv (recommended)
     uv add "mcp[cli]"
     ```

2. Core Implementation
   - Use MCP SDK
   - Implement comprehensive logging
     - TypeScript (for web/JS projects):
       ```typescript
       console.error('[Setup] Initializing server...');
       console.error('[API] Request to endpoint:', endpoint);
       console.error('[Error] Failed with:', error);
       ```
     - Python (for data science/ML projects):
       ```python
       import logging
       logging.error('[Setup] Initializing server...')
       logging.error(f'[API] Request to endpoint: {endpoint}')
       logging.error(f'[Error] Failed with: {str(error)}')
       ```
   - Add type definitions
   - Handle errors with context
   - Implement rate limiting if needed

3. Configuration
   - Get credentials from user if needed
   - Add to MCP settings:
     - For TypeScript projects:
       ```json
       {
         "mcpServers": {
           "my-server": {
             "command": "node",
             "args": ["path/to/build/index.js"],
             "env": {
               "API_KEY": "key"
             },
             "disabled": false,
             "autoApprove": []
           }
         }
       }
       ```
     - For Python projects:
       ```bash
       # Directly with command line
       mcp install server.py -v API_KEY=key
       
       # Or in settings.json
       {
         "mcpServers": {
           "my-server": {
             "command": "python",
             "args": ["server.py"],
             "env": {
               "API_KEY": "key"
             },
             "disabled": false,
             "autoApprove": []
           }
         }
       }
       ```

## Step 3: Testing (BLOCKER ⛔️)

<thinking>
BEFORE using attempt_completion, I MUST verify:
□ Have I tested EVERY tool?
□ Have I confirmed success from the user for each test?
□ Have I documented the test results?

If ANY answer is "no", I MUST NOT use attempt_completion.
</thinking>

1. Test Each Tool (REQUIRED)
   □ Test each tool with valid inputs
   □ Verify output format is correct
   ⚠️ DO NOT PROCEED UNTIL ALL TOOLS TESTED

## Step 4: Completion
❗ STOP AND VERIFY:
□ Every tool has been tested with valid inputs
□ Output format is correct for each tool

Only after ALL tools have been tested can attempt_completion be used.

## Key Requirements
- ✓ Must use MCP SDK
- ✓ Must have comprehensive logging
- ✓ Must test each tool individually
- ✓ Must handle errors gracefully
- ⛔️ NEVER skip testing before completion
```

下面是 `MCP Server Development Protocol` 的中文翻译：

# MCP 服务器开发协议

⚠️ 重要提示：测试前禁止使用 attempt_completion ⚠️

## 步骤 1：规划（规划模式）
- 此工具解决什么问题？
- 将使用什么 API/服务？
- 认证要求是什么？
  - 标准 API 密钥
  - OAuth（需要单独的设置脚本）
  - 其他凭据

## 步骤 2：实现（执行模式）
1. 初始化
   - 对于网络服务、JavaScript 集成或 Node.js 环境：
     ```bash
     npx @modelcontextprotocol/create-server my-server
     cd my-server
     npm install
     ```
   - 对于数据科学、机器学习工作流或 Python 环境：
     ```bash
     pip install mcp
     # 或使用 uv（推荐）
     uv add "mcp[cli]"
     ```

2. 核心实现
   - 使用 MCP SDK
   - 实现全面的日志记录
     - TypeScript（用于 web/JS 项目）：
       ```typescript
       console.error('[Setup] Initializing server...');
       console.error('[API] Request to endpoint:', endpoint);
       console.error('[Error] Failed with:', error);
       ```
     - Python（用于数据科学/ML 项目）：
       ```python
       import logging
       logging.error('[Setup] Initializing server...')
       logging.error(f'[API] Request to endpoint: {endpoint}')
       logging.error(f'[Error] Failed with: {str(error)}')
       ```
   - 添加类型定义
   - 处理带上下文的错误
   - 必要时实现速率限制

3. 配置
   - 如需要获取用户凭据
   - 添加到 MCP 设置：
     - 对于 TypeScript 项目：
       ```json
       {
         "mcpServers": {
           "my-server": {
             "command": "node",
             "args": ["path/to/build/index.js"],
             "env": {
               "API_KEY": "key"
             },
             "disabled": false,
             "autoApprove": []
           }
         }
       }
       ```
     - 对于 Python 项目：
       ```bash
       # 直接通过命令行
       mcp install server.py -v API_KEY=key
       
       # 或在 settings.json 中
       {
         "mcpServers": {
           "my-server": {
             "command": "python",
             "args": ["server.py"],
             "env": {
               "API_KEY": "key"
             },
             "disabled": false,
             "autoApprove": []
           }
         }
       }
       ```

## 步骤 3：测试（阻塞项 ⛔️）

`<thinking>`

在使用 attempt_completion 之前，我必须验证：
- 是否已测试每个工具？
- 是否已获得用户对每项测试的成功确认？
- 是否已记录测试结果？

如果任何答案为"否"，则禁止使用 attempt_completion。

`</thinking>`

1. 测试每个工具（必需）
   - 使用有效输入测试每个工具
   - 验证输出格式是否正确
    ⚠️ 在所有工具测试完成前不得继续

## 步骤 4：完成
❗ 停止并验证：
- 已使用有效输入测试每个工具
- 每个工具的输出格式正确

只有在所有工具都经过测试后才能使用 attempt_completion。

## 关键要求
- ✓ 必须使用 MCP SDK
- ✓ 必须有全面的日志记录
- ✓ 必须单独测试每个工具
- ✓ 必须妥善处理错误
- ⛔️ 绝不能在测试前跳过测试环节
