---
layout: single
title:  "Claude Code 文档"
date:   2025-09-11 08:00:00 +0800
categories: ClaudeCode Agent
tags: [ClaudeCode, Agent, Claude, CLI]
---

Anthropic的“Claude Code”是一款**终端内AI编程助手**，旨在通过**自然语言交互**帮助开发者**更快地编写、调试和管理代码**。它提供了一系列功能，包括**根据描述构建功能**、**识别并修复bug**、**理解复杂代码库**以及**自动化日常开发任务**。用户可以通过简单的**NPM安装和登录**快速开始使用，并能**通过聊天式的命令直接编辑文件、执行Shell命令和管理Git操作**。该工具还支持**自定义子代理**以处理特定任务，并提供了**灵活的配置选项**，包括**记忆管理、权限设置和环境变量**，以适应个人、项目和企业级的开发需求。

<!--more-->

# Claude Code 概览

> 了解 Anthropic 的智能编程工具 Claude Code，它运行在你的终端中，帮你比以往更快地将创意转化为代码。

## 30 秒快速上手

前提条件：

  * [Node.js 18 或更新版本](https://nodejs.org/en/download/)
  * 一个 [Claude.ai](https://claude.ai)（推荐）或 [Anthropic Console](https://console.anthropic.com/) 账户

<!-- end list -->

```bash
# 安装 Claude Code
npm install -g @anthropic-ai/claude-code

# 进入你的项目目录
cd your-awesome-project

# 开始使用 Claude 编程
claude
# 首次使用时，系统会提示你登录
```

就是这么简单！你已经准备好使用 Claude 编写代码了。[继续学习快速入门（5 分钟）→](https://www.google.com/search?q=/en/docs/claude-code/quickstart)

（有特殊的设置需求或遇到问题？请参阅[高级设置](https://www.google.com/search?q=/en/docs/claude-code/setup)或[故障排除](https://www.google.com/search?q=/en/docs/claude-code/troubleshooting)。）

## Claude Code 的功能

  * **根据描述构建功能**：用简单的语言告诉 Claude 你想构建什么。它会制定计划、编写代码并确保其正常运行。
  * **调试和修复问题**：描述一个 bug 或粘贴一条错误信息。Claude Code 会分析你的代码库，找出问题并实施修复。
  * **驾驭任何代码库**：询问关于团队代码库的任何问题，它都会给出深思熟虑的回答。Claude Code 始终了解你的整个项目结构，可以从网络上获取最新信息，并且通过 [MCP](https://www.google.com/search?q=/en/docs/claude-code/mcp) 可以从 Google Drive、Figma 和 Slack 等外部数据源中提取信息。
  * **自动化繁琐任务**：修复麻烦的 lint 问题、解决合并冲突、编写发布说明。所有这些都可以在你的开发机器上通过一个简单的命令完成，或者在 CI 中自动执行。

## 为什么开发者喜欢 Claude Code

  * **在你的终端中工作**：它不是另一个聊天窗口，也不是另一个 IDE。Claude Code 就在你已经习惯的工作环境中，与你喜爱的工具一起工作。
  * **采取行动**：Claude Code 可以直接编辑文件、运行命令并创建提交。需要更多功能？[MCP](https://www.google.com/search?q=/en/docs/claude-code/mcp) 让 Claude 可以阅读你在 Google Drive 中的设计文档、更新 Jira 上的工单，或使用*你自己的*自定义开发工具。
  * **Unix 哲学**：Claude Code 具有可组合性和可脚本性。`tail -f app.log | claude -p "如果日志流中出现异常，请发送 Slack 通知给我"` 是可行的。你的 CI 可以运行 `claude -p "如果有新的文本字符串，请将其翻译成法语，并为 @lang-fr-team 提交一个 PR 以供审核"`。
  * **企业级就绪**：使用 Anthropic 的 API，或在 AWS 或 GCP 上托管。内置企业级的[安全性](https://www.google.com/search?q=/en/docs/claude-code/security)、[隐私](https://www.google.com/search?q=/en/docs/claude-code/data-usage)和[合规性](https://trust.anthropic.com/)。


# 快速入门（Quickstart）

> 欢迎使用 Claude Code！

本快速入门指南将帮助你在几分钟内开始使用由 AI 驱动的编码助手。读完后，你将了解如何使用 Claude Code 完成常见的开发任务。

## 开始前

请确保你已准备好：

  * 一个终端或命令提示符窗口
  * 一个可用于工作的代码项目
  * 一个 **Claude.ai** 账户（推荐）或 **Anthropic Console** 账户

## 步骤 1：安装 Claude Code

### NPM 安装

如果你安装了 Node.js 18 或更高版本：

```sh
npm install -g @anthropic-ai/claude-code
```

### 本机安装

**macOS、Linux、WSL：**

```bash
curl -fsSL https://claude.ai/install.sh | bash
```

**Windows PowerShell：**

```powershell
irm https://claude.ai/install.ps1 | iex
```

**Windows CMD：**

```batch
curl -fsSL https://claude.ai/install.cmd -o install.cmd && install.cmd && del install.cmd
```

## 步骤 2：登录账户

使用 Claude Code 需要一个账户。当你使用 `claude` 命令启动一个交互式会话时，你需要登录：

```bash
claude
# 首次使用时，系统会提示你登录
```

```bash
/login
# 按照提示使用你的账户登录
```

你可以使用以下两种账户类型中的任意一种登录：

  * **Claude.ai**（订阅计划 - 推荐）
  * **Anthropic Console**（预付费 API 访问）

登录后，你的凭据会被储存起来，之后无需再次登录。

> 首次使用 Anthropic Console 账户进行身份验证时，系统会自动为你创建一个名为“Claude Code”的工作区。该工作区为你的组织中所有 Claude Code 的使用提供了集中的成本跟踪和管理。
>
> 同一电子邮件地址可以同时拥有这两种账户类型。如果你需要再次登录或切换账户，请在 Claude Code 中使用 `/login` 命令。

## 步骤 3：开始你的第一个会话

在任意项目目录中打开终端并启动 Claude Code：

```bash
cd /path/to/your/project
claude
```

你会在新的交互式会话中看到 Claude Code 的提示符：

```
✻ Welcome to Claude Code!

...

> Try "create a util logging.py that..." （尝试创建一个 util logging.py 文件...）
```

> 登录后（步骤 2），你的凭据会储存在你的系统中。在**凭证管理**中了解更多信息。

## 步骤 4：提出你的第一个问题

让我们从了解你的代码库开始。尝试以下命令：

```
> what does this project do?（这个项目是做什么的?）
```

Claude 会分析你的文件并提供摘要。你也可以提出更具体的问题：

```
> what technologies does this project use?（这个项目使用了哪些技术?）
```

```
> where is the main entry point?（主入口点在哪里?）
```

```
> explain the folder structure（解释文件夹结构）
```

你还可以询问 Claude 自己的功能：

```
> what can Claude Code do?（Claude Code 能做什么?）
```

```
> how do I use slash commands in Claude Code?（如何在 Claude Code 中使用斜线命令?）
```

```
> can Claude Code work with Docker?（Claude Code 能否与 Docker 一起工作?）
```

> Claude Code 会在需要时读取你的文件，你无需手动添加上下文。Claude 也可以访问自己的文档，并能回答有关其功能和能力的问题。

## 步骤 5：进行你的第一次代码修改

现在，让我们让 Claude Code 编写一些实际的代码。尝试一个简单的任务：

```
> add a hello world function to the main file（在主文件中添加一个 hello world 函数）
```

Claude Code 将会：

1.  找到合适的文件
2.  向你展示拟议的更改
3.  征求你的同意
4.  进行修改

> Claude Code 在修改文件前总会征求你的同意。你可以批准单独的更改，或为某个会话启用“全部接受”模式。

## 步骤 6：在 Claude Code 中使用 Git

Claude Code 让 Git 操作变得像对话一样简单：

```
> what files have I changed?（我修改了哪些文件？）
```

```
> commit my changes with a descriptive message（使用描述性消息提交我的更改）
```

你还可以提示它进行更复杂的 Git 操作：

```
> create a new branch called feature/quickstart（创建一个名为 feature/quickstart 的新分支）
```

```
> show me the last 5 commits（给我展示最近的 5 次提交）
```

```
> help me resolve merge conflicts（帮我解决合并冲突）
```

## 步骤 7：修复 Bug 或添加功能

Claude 擅长调试和实现新功能。

用自然语言描述你想要实现的目标：

```
> add input validation to the user registration form（为用户注册表单添加输入验证）
```

或者修复现有的问题：

```
> there's a bug where users can submit empty forms - fix it（用户可以提交空表单，这是一个 bug - 修复它）
```

Claude Code 将会：

  * 定位相关代码
  * 理解上下文
  * 实施解决方案
  * 如果可用，运行测试

## 步骤 8：测试其他常见工作流

有多种与 Claude 协作的方式：

**重构代码**

```
> refactor the authentication module to use async/await instead of callbacks（将身份验证模块重构为使用 async/await 而不是回调）
```

**编写测试**

```
> write unit tests for the calculator functions（为计算器函数编写单元测试）
```

**更新文档**

```
> update the README with installation instructions（更新 README 以包含安装说明）
```

**代码审查**

```
> review my changes and suggest improvements（审查我的更改并提出改进建议）
```

> **记住**：Claude Code 是你的 AI 结对程序员。像与一位乐于助人的同事交谈一样与它对话——描述你想要完成的目标，它会帮助你实现。

## 常用命令

以下是日常使用中最重要的命令：

| 命令 | 作用 | 示例 |
| :--- | :--- | :--- |
| `claude` | 启动交互模式 | `claude` |
| `claude "task"` | 运行一次性任务 | `claude "fix the build error"` |
| `claude -p "query"` | 运行一次性查询，然后退出 | `claude -p "explain this function"` |
| `claude -c` | 继续最近一次对话 | `claude -c` |
| `claude -r` | 恢复之前的对话 | `claude -r` |
| `claude commit` | 创建 Git 提交 | `claude commit` |
| `/clear` | 清除对话历史 | `> /clear` |
| `/help` | 显示可用命令 | `> /help` |
| `exit` 或 Ctrl+C | 退出 Claude Code | `> exit` |

有关完整的命令列表，请参阅 **CLI 参考**。

## 新手专业技巧

**请求要具体**

不要说：“fix the bug”（修复 Bug）

尝试说：“fix the login bug where users see a blank screen after entering wrong credentials”（修复登录 Bug，当用户输入错误的凭据后会看到空白屏幕）

**使用分步说明**

将复杂的任务分解成几个步骤：

```
> 1. create a new database table for user profiles（创建一个用于用户资料的新数据库表）
```

```
> 2. create an API endpoint to get and update user profiles（创建一个 API 端点来获取和更新用户资料）
```

```
> 3. build a webpage that allows users to see and edit their information（构建一个网页，让用户可以查看和编辑他们的信息）
```

**先让 Claude 进行探索**

在进行更改之前，先让 Claude 了解你的代码：

```
> analyze the database schema（分析数据库架构）
```

```
> build a dashboard showing products that are most frequently returned by our UK customers（构建一个仪表板，显示我们的英国客户最常退货的产品）
```

**使用快捷方式节省时间**

  * 使用 Tab 键进行命令补全
  * 按 ↑ 查看命令历史
  * 输入 `/` 查看所有斜杠命令

## 获取帮助

  * **在 Claude Code 中**：输入 `/help` 或询问 “how do I...”


# 常见工作流程

## 理解新代码库

### 快速获取代码库概览

假设你刚加入一个新项目，需要快速了解其结构。

#### 1. 进入项目根目录

```bash
cd /path/to/project
```

#### 2. 启动 Claude Code

```bash
claude
```

#### 3. 询问高层次概览

```bash
> give me an overview of this codebase（给我这个代码库的概述）
```

#### 4. 深入研究特定组件

```bash
> explain the main architecture patterns used here（解释这里使用的主要架构模式）
```

```
> what are the key data models?（这里有哪些关键数据模型？）
```

```
> how is authentication handled?（如何处理身份验证？）
```

**提示：**

  * 从宽泛的问题开始，然后逐步深入到具体领域。
  * 询问项目中使用的编码规范和模式。
  * 请求一个项目特定术语的词汇表。

### 查找相关代码

假设你需要定位与特定功能相关的代码。

#### 1. 让 Claude 查找相关文件

```
> find the files that handle user authentication（查找处理用户身份验证的文件）
```

#### 2. 获取组件如何相互作用的上下文

```
> how do these authentication files work together?（这些身份验证文件是如何协同工作的？）
```

#### 3. 理解执行流程

```
> trace the login process from front-end to database（从前端到数据库跟踪登录过程）
```

**提示：**

  * 明确你要找什么。
  * 使用项目中的领域语言。

## 高效修复 bug

假设你遇到了错误消息，需要找到并修复其根源。

### 1. 与 Claude 分享错误

```
> I'm seeing an error when I run npm test（当我运行 npm test 时，我看到了一个错误）
```

### 2. 请求修复建议

```
> suggest a few ways to fix the @ts-ignore in user.ts（在 user.ts 中建议几种修复 @ts-ignore 的方法）
```

### 3. 应用修复

```
> update user.ts to add the null check you suggested（更新 user.ts 以添加你建议的 null 检查）
```

**提示：**

  * 告诉 Claude 重现问题的命令，并获取堆栈跟踪信息。
  * 提及任何重现错误的步骤。
  * 让 Claude 知道错误是间歇性还是持续性的。

## 重构代码

假设你需要更新旧代码，使其使用现代模式和实践。

### 1. 识别需要重构的遗留代码

```
> find deprecated API usage in our codebase（在我们的代码库中查找过时的 API 使用情况）
```

### 2. 获取重构建议

```
> suggest how to refactor utils.js to use modern JavaScript features（建议如何重构 utils.js 以使用现代 JavaScript 特性）
```

### 3. 安全地应用更改

```
> refactor utils.js to use ES2024 features while maintaining the same behavior（重构 utils.js 以使用 ES2024 特性，同时保持相同的行为）
```

### 4. 验证重构

```
> run tests for the refactored code（为重构后的代码运行测试）
```

**提示：**

  * 询问 Claude 现代方法的优点。
  * 在需要时，请求更改保持向后兼容性。
  * 重构应小步进行，并确保每一步都可测试。

## 使用专业子代理

假设你想使用专业的 AI 子代理来更有效地处理特定任务。

### 1. 查看可用的子代理

```
> /agents
```

这会显示所有可用的子代理，并允许你创建新的。

### 2. 自动使用子代理

Claude Code 会自动将适当的任务委派给专业的子代理：

```
> review my recent code changes for security issues（审查我最近的代码更改是否存在安全问题）
```

```
> run all tests and fix any failures（运行所有测试并修复任何失败）
```

### 3. 明确请求特定的子代理

```
> use the code-reviewer subagent to check the auth module（使用 code-reviewer 子代理检查 auth 模块）
```

```
> have the debugger subagent investigate why users can't log in（让 debugger 子代理调查为什么用户无法登录）
```

### 4. 为你的工作流创建自定义子代理

```
> /agents
```

然后选择“Create New subagent”并按照提示定义：

* Subagent type（子代理类型。例如，`api-designer`, `performance-optimizer`）
* When to use it（何时使用它）
* Which tools it can access（它可以访问哪些工具）
* Its specialized system prompt（其专门的系统提示词）

**提示：**

  * 在 `.claude/agents/` 中创建项目特定的子代理，以便团队共享。
  * 使用描述性的 `description` 字段以启用自动委派。
  * 限制每个子代理只访问它实际需要的工具。
  * 查看 [子代理文档](https://www.google.com/search?q=/en/docs/claude-code/sub-agents) 获取详细示例。

## 使用“计划模式”进行安全代码分析

计划模式（**Plan Mode**）指示 Claude 通过只读操作来分析代码库并创建计划，这对于探索代码库、规划复杂更改或安全地审查代码非常有用。

### 何时使用计划模式

  * **多步实施**：当你的功能需要修改多个文件时。
  * **代码探索**：当你在修改任何东西之前，想彻底研究代码库时。
  * **交互式开发**：当你想与 Claude 一起迭代方向时。

### 如何使用计划模式

**在会话中开启计划模式**

你可以在会话中使用 **Shift+Tab** 在不同权限模式间切换。

如果你处于普通模式（Normal Mode），**Shift+Tab** 将首先切换到自动接受模式（Auto-Accept Mode），终端底部会显示 `⏵⏵ accept edits on`。再次按下 **Shift+Tab** 将切换到计划模式，显示 `⏸ plan mode on`。

**在计划模式下启动新会话**

要在计划模式下启动新会话，使用 `--permission-mode plan` 标志：

```bash
claude --permission-mode plan
```

**在计划模式下运行“无头”查询**

你也可以使用 `-p` 直接在计划模式下运行查询（即在 ["无头模式"（headless mode）](https://www.google.com/search?q=/en/docs/claude-code/sdk/sdk-headless) 下）：

```bash
claude --permission-mode plan -p "Analyze the authentication system and suggest improvements"
```

### 示例：规划一个复杂的重构

```bash
claude --permission-mode plan
```

```
> I need to refactor our authentication system to use OAuth2. Create a detailed migration plan.（我需要重构我们的身份验证系统以使用 OAuth2。创建详细的迁移计划。）
```

Claude 将分析当前的实现并创建一个全面的计划。你可以通过后续问题进行细化：

```
> What about backward compatibility?（关于向后兼容性呢？）
> How should we handle database migration?（我们应该如何处理数据库迁移？）
```

### 将计划模式配置为默认

```json
// .claude/settings.json
{
  "permissions": {
    "defaultMode": "plan"
  }
}
```

更多配置选项，请参阅 [设置文档](https://www.google.com/search?q=/en/docs/claude-code/settings%23available-settings)。

## 处理测试

假设你需要为未覆盖的代码添加测试。

### 1. 识别未测试的代码

```
> find functions in NotificationsService.swift that are not covered by tests（在 NotificationsService.swift 中查找未由测试覆盖的函数）
```

### 2. 生成测试脚手架

```
> add tests for the notification service（为通知服务添加测试）
```

### 3. 添加有意义的测试用例

```
> add test cases for edge conditions in the notification service（为通知服务中的边缘条件添加测试用例）
```

### 4. 运行和验证测试

```
> run the new tests and fix any failures（运行新的测试并修复任何失败）
```

**提示：**

  * 请求测试覆盖边缘情况和错误条件。
  * 在适当的时候，同时请求单元测试和集成测试。
  * 让 Claude 解释其测试策略。

## 创建拉取请求（Pull Requests）

假设你需要为你所做的更改创建一个有良好文档的拉取请求。

### 1. 总结你的更改

```
> summarize the changes I've made to the authentication module（总结我对身份验证模块所做的更改）
```

### 2. 用 Claude 生成 PR

```
> create a pr（创建一个 PR）
```

### 3. 审查和细化

```
> enhance the PR description with more context about the security improvements（在 PR 描述中添加更多关于安全改进的上下文）
```

### 4. 添加测试细节

```
> add information about how these changes were tested（添加有关这些更改如何经过测试的信息）
```

**提示：**

  * 直接让 Claude 为你创建 PR。
  * 在提交前审查 Claude 生成的 PR。
  * 让 Claude 突出潜在的风险或注意事项。

## 处理文档

假设你需要为你的代码添加或更新文档。

### 1. 识别无文档的代码

```
> find functions without proper JSDoc comments in the auth module（在 auth 模块中查找没有适当 JSDoc 注释的函数）
```

### 2. 生成文档

```
> add JSDoc comments to the undocumented functions in auth.js（在 auth.js 中为未记录的函数添加 JSDoc 注释）
```

### 3. 审查和增强

```
> improve the generated documentation with more context and examples（使用更多上下文和示例改进生成的文档）
```

### 4. 验证文档

```
> check if the documentation follows our project standards（检查文档是否遵循我们的项目标准）
```

**提示：**

  * 指定你想要的文档风格（JSDoc、docstrings 等）。
  * 要求在文档中包含示例。
  * 请求为公共 API、接口和复杂逻辑添加文档。

## 处理图片

假设你需要处理代码库中的图片，并希望 Claude 帮助分析图片内容。

### 1. 将图片添加到对话中

你可以使用以下任何一种方法：

```
1. 将图片拖放到 Claude Code 窗口中。
2. 复制图片并使用 ctrl+v 粘贴到 CLI 中（不要使用 cmd+v）。
3. 向 Claude 提供图片路径。例如：“Analyze this image: /path/to/your/image.png”。
```

### 2. 让 Claude 分析图片

```
> What does this image show?（这张图片显示什么？）
```

```
> Describe the UI elements in this screenshot（描述此屏幕截图中的 UI 元素）
```

```
> Are there any problematic elements in this diagram?（这张图表中是否有任何问题元素？）
```

### 3. 使用图片作为上下文

```
> Here's a screenshot of the error. What's causing it?（这是错误截图。是什么导致了它？）
```

```
> This is our current database schema. How should we modify it for the new feature?（这是我们的当前数据库架构。我们应该如何为新功能修改它？）
```

### 4. 从视觉内容中获取代码建议

```
> Generate CSS to match this design mockup（生成与设计 mockup 匹配的 CSS）
```

```
> What HTML structure would recreate this component?（什么 HTML 结构可以重新创建此组件？）
```

**提示：**

  * 当文字描述不清晰或繁琐时，使用图片。
  * 包含错误、UI 设计或图表的截图，以获得更好的上下文。
  * 你可以在一个对话中处理多张图片。
  * 图片分析适用于图表、截图、模型图等。

## 引用文件和目录

使用 **@** 符号可以快速包含文件或目录，而无需等待 Claude 自行读取。

### 1. 引用单个文件

```
> Explain the logic in @src/utils/auth.js（解释 @src/utils/auth.js 中的逻辑）
```

这会将文件的完整内容包含到对话中。

### 2. 引用目录

```
> What's the structure of @src/components？（@src/components 的结构是什么？）
```

这会提供一个包含文件信息的目录列表。

### 3. 引用 MCP 资源

```
> Show me the data from @github:repos/owner/repo/issues（从 @github:repos/owner/repo/issues 显示数据）
```

这会使用 `@server:resource` 格式从连接的 MCP 服务器获取数据。详情请参阅 [MCP 资源](/en/docs/claude-code/mcp#use-mcp-resources)。

**提示：**

  * 文件路径可以是相对或绝对的。
  * `@` 文件引用会将文件所在目录及其父目录中的 `CLAUDE.md` 文件内容添加到上下文中。
  * 目录引用显示的是文件列表，而不是文件内容。
  * 你可以在一个消息中引用多个文件（例如，`"@file1.js and @file2.js"`）。

## 使用“扩展思考”

假设你在处理复杂的架构决策、具有挑战性的 bug 或需要深入推理的多步骤实现计划。

### 1. 提供上下文并让 Claude 思考

```
> I need to implement a new authentication system using OAuth2 for our API. Think deeply about the best approach for implementing this in our codebase.（我需要使用 OAuth2 为我们的 API 实现新的身份验证系统。深入思考一下在代码库中实现它的最佳方法。）
```

Claude 将从你的代码库中收集相关信息，并使用扩展思考（extended thinking），这在界面中是可见的。

### 2. 通过后续提示细化思考过程

```
> think about potential security vulnerabilities in this approach（思考一下这种方法的潜在安全漏洞）
```

```
> keep thinking about edge cases we should handle（继续思考我们应该处理的边缘情况）
```

**提示：**

扩展思考对于以下复杂任务最有价值：

  * 规划复杂的架构更改。
  * 调试复杂的问题。
  * 为新功能创建实施计划。
  * 理解复杂的代码库。
  * 评估不同方法之间的权衡。

你触发思考的方式会产生不同层次的思考深度：

  * `"think"` 触发基本的扩展思考。
  * 加强语气词，如 `"keep thinking"`, `"think more"`, `"think a lot"`, 或 `"think longer"` 触发更深入的思考。

更多扩展思考提示，请参阅 [Extended thinking tips](https://www.google.com/search?q=/en/docs/build-with-claude/prompt-engineering/extended-thinking-tips)。

> Claude 将把其思考过程以斜体灰色文本显示在响应上方。

## 恢复以前的会话

假设你正在使用 Claude Code 完成一项任务，并且需要在稍后的会话中从上次离开的地方继续。

Claude Code 提供了两种恢复以前会话的选项：

  * `--continue` 自动恢复最近的会话。
  * `--resume` 显示一个会话选择器。

### 1. 恢复最近的会话

```bash
claude --continue
```

这会立即恢复你最近的会话，无需任何提示。

### 2. 在非交互模式下恢复
```bash
# 继续我的任务
claude --continue --print "Continue with my task"
```

将 `--print` 与 `--continue` 结合使用，可以在非交互模式下恢复最近的会话，这对于脚本或自动化非常有用。

### 3. 显示会话选择器

```bash
claude --resume
```

这会显示一个交互式会话选择器，其中包含：

* 会话开始时间
* 初始提示或会话摘要
* 消息数

使用方向键导航，按 Enter 键选择一个会话。

**提示：**

  * 会话历史记录存储在本地计算机上。
  * 使用 `--continue` 快速访问你最近的会话。
  * 当你需要选择一个特定的旧会话时，使用 `--resume`。
  * 恢复时，在继续之前你会看到整个会话历史记录。
  * 恢复的会话使用与原始会话相同的模型和配置。

工作原理：

1.  **会话存储**：所有会话及其完整的消息历史都会自动保存在本地。
2.  **消息反序列化**：恢复时，会恢复整个消息历史以保持上下文。
3.  **工具状态**：保留了前一个会话中的工具使用和结果。
4.  **上下文恢复**：会话在所有先前上下文都完好的情况下恢复。

示例：

```bash
# 恢复最近的会话
claude --continue

# 带有特定提示恢复最近的会话
claude --continue --print "Show me our progress"

# 显示会话选择器
claude --resume

# 在非交互模式下恢复最近的会话
claude --continue --print "Run the tests again"
```

## 使用 Git worktrees 运行并行 Claude Code 会话

假设你需要同时处理多个任务，并且在 Claude Code 实例之间进行完全的代码隔离。

### 1. 了解 Git worktrees

Git worktrees 允许你从同一仓库将多个分支检出到不同的目录中。每个工作树（worktree）都有自己的工作目录和隔离的文件，同时共享相同的 Git 历史。在 [官方 Git worktree 文档](https://git-scm.com/docs/git-worktree) 中了解更多。

### 2. 创建一个新的工作树

```bash
# 使用新分支创建一个新的工作树
git worktree add ../project-feature-a -b feature-a

# 或使用现有分支创建工作树
git worktree add ../project-bugfix bugfix-123
```

这会创建一个新目录，其中包含你仓库的独立工作副本。

### 3. 在每个工作树中运行 Claude Code

```bash
# 进入你的工作树
cd ../project-feature-a

# 在这个隔离环境中运行 Claude Code
claude
```

### 4. 在另一个工作树中运行 Claude

```bash
cd ../project-bugfix
claude
```

### 5. 管理你的工作树

```bash
# 列出所有工作树
git worktree list

# 完成后删除工作树
git worktree remove ../project-feature-a
```

**提示：**

  * 每个工作树都有自己独立的文件状态，非常适合并行 Claude Code 会话。
  * 在一个工作树中所做的更改不会影响其他工作树，防止 Claude 实例之间相互干扰。
  * 所有工作树共享相同的 Git 历史和远程连接。
  * 对于长期运行的任务，你可以让 Claude 在一个工作树中工作，而你继续在另一个中进行开发。
  * 使用描述性的目录名可以轻松识别每个工作树用于哪个任务。
  * 记得根据你的项目设置在每个新的工作树中初始化开发环境。根据你的技术栈，这可能包括：
      * JavaScript 项目：运行依赖安装（`npm install`, `yarn`）。
      * Python 项目：设置虚拟环境或使用包管理器安装。
      * 其他语言：遵循你项目的标准设置流程。

## 将 Claude 用作类 Unix 工具

### 将 Claude 添加到你的验证流程

假设你想将 Claude Code 用作 linter 或代码审查器。

**将 Claude 添加到你的构建脚本：**

```json
// package.json
{
    ...
    "scripts": {
        ...
        "lint:claude": "claude -p 'you are a linter. please look at the changes vs. main and report any issues related to typos. report the filename and line number on one line, and a description of the issue on the second line. do not return any other text.'"
    }
}
```

```
claude -p '你是一个代码检查器。请查看与主分支的改动，并报告任何与拼写错误相关的问题。在第一行报告文件名和行号，在第二行报告问题的描述。不要返回任何其他文本。'
```

**提示：**

  * 在你的 CI/CD 管道中使用 Claude 进行自动化代码审查。
  * 自定义提示词以检查与你的项目相关的特定问题。
  * 考虑为不同类型的验证创建多个脚本。

### 管道输入，管道输出（Pipe in, pipe out）

假设你想将数据通过管道输入到 Claude，并以结构化格式返回数据。

**通过管道将数据传给 Claude：**

```bash
cat build-error.txt | claude -p 'concisely explain the root cause of this build error' > output.txt
```

```bash
cat build-error.txt | claude -p '精炼地解释这个构建错误的根本原因' > output.txt
```

**提示：**

  * 使用管道将 Claude 集成到现有的 shell 脚本中。
  * 与其他 Unix 工具结合使用，实现强大的工作流。
  * 考虑使用 `--output-format` 来获取结构化输出。

### 控制输出格式

假设你需要 Claude 的输出采用特定格式，尤其是在将 Claude Code 集成到脚本或其他工具中时。

#### 1. 使用文本格式（默认）

```bash
# 总结这个数据
cat data.txt | claude -p 'summarize this data' --output-format text > summary.txt
```

这会输出 Claude 的纯文本响应（默认行为）。

#### 2. 使用 JSON 格式

```bash
# 分析这个代码的 bug
cat code.py | claude -p 'analyze this code for bugs' --output-format json > analysis.json
```

这会输出一个 JSON 消息数组，其中包含成本和持续时间等元数据。

#### 3. 使用流式 JSON 格式

```bash
# 解析这个日志文件中的错误
cat log.txt | claude -p 'parse this log file for errors' --output-format stream-json
```

这会随着 Claude 处理请求实时输出一系列 JSON 对象。每条消息都是一个有效的 JSON 对象，但如果将整个输出连接起来则不是有效的 JSON。

**提示：**

  * 对于只需要 Claude 响应的简单集成，请使用 `--output-format text`。
  * 当你需要完整的会话日志时，使用 `--output-format json`。
  * 对于每个会话轮次的实时输出，使用 `--output-format stream-json`。

## 创建自定义斜杠命令

Claude Code 支持自定义斜杠命令，你可以创建它们来快速执行特定的提示或任务。

更多详情，请参阅 [斜杠命令（Slash commands）](https://www.google.com/search?q=/en/docs/claude-code/slash-commands) 参考页面。

### 创建项目特定的命令

假设你想为你的项目创建可重用的斜杠命令，供所有团队成员使用。

#### 1. 在你的项目中创建 commands 目录

```bash
mkdir -p .claude/commands
```

#### 2. 为每个命令创建一个 Markdown 文件

```bash
echo "Analyze the performance of this code and suggest three specific optimizations:" > .claude/commands/optimize.md
```

```bash
echo "分析这段代码的表现并提出三点具体的优化建议：" > .claude/commands/optimize.md
```

#### 3. 在 Claude Code 中使用你的自定义命令

```bash
> /optimize
```

**提示：**

  * 命令名称源自文件名（例如，`optimize.md` 变为 `/optimize`）。
  * 你可以在子目录中组织命令（例如，`.claude/commands/frontend/component.md` 会创建 `/component`，并在描述中显示 "(project:frontend)"）。
  * 项目命令对克隆仓库的每个人都可用。
  * Markdown 文件内容成为调用命令时发送给 Claude 的提示词。

### 使用 $ARGUMENTS 添加命令参数

假设你想创建可以接受用户额外输入的灵活斜杠命令。

#### 1. 创建带有 $ARGUMENTS 占位符的命令文件

```bash
echo 'Find and fix issue #$ARGUMENTS. Follow these steps: 1.
Understand the issue described in the ticket 2. Locate the relevant code in
our codebase 3. Implement a solution that addresses the root cause 4. Add
appropriate tests 5. Prepare a concise PR description' >
.claude/commands/fix-issue.md
```

```bash
echo '找到并修复问题 #$ARGUMENTS。请遵循以下步骤：1.理解工单中描述的问题 2.在我们的代码库中找到相关代码 3.实施一个能解决根本原因的方案 4.添加适当的测试 5.准备一份简洁的 PR 描述' > .claude/commands/fix-issue.md
```

#### 2. 使用命令和问题编号

在你的 Claude 会话中，使用带有参数的命令。

```
> /fix-issue 123
```

这会将 `$ARGUMENTS` 替换为提示词中的 "123"。

**提示：**

  * `$ARGUMENTS` 占位符会被命令后面的任何文本替换。
  * 你可以将 `$ARGUMENTS` 放置在命令模板中的任何位置。
  * 其他有用的应用：为特定函数生成测试用例、为组件创建文档、审查特定文件中的代码，或将内容翻译成指定的语言。

### 创建个人斜杠命令

假设你想创建适用于所有项目的个人斜杠命令。

#### 1. 在你的主文件夹中创建 commands 目录

```bash
mkdir -p ~/.claude/commands
```

#### 2. 为每个命令创建一个 Markdown 文件

```bash
echo "Review this code for security vulnerabilities, focusing on:" >
~/.claude/commands/security-review.md
```

```bash
echo "审查这段代码的安全漏洞，重点关注：" > ~/.claude/commands/security-review.md
```

#### 3. 使用你的个人自定义命令

```bash
> /security-review
```

提示：

  * 当使用 `/help` 列出时，个人命令在描述中显示 "(user)"。
  * 个人命令只对你可用，不与你的团队共享。
  * 个人命令适用于你的所有项目。
  * 你可以用它们在不同的代码库中保持一致的工作流程。

## 询问 Claude 自身能力

Claude 内置了对其文档的访问，可以回答有关自身功能和限制的问题。

### 示例问题

```
> can Claude Code create pull requests?（Claude Code 能否创建拉取请求？）
```

```
> how does Claude Code handle permissions?（Claude Code 如何处理权限？）
```

```
> what slash commands are available?（有哪些斜杠命令可用？）
```

```
> how do I use MCP with Claude Code?（如何使用 Claude Code 的 MCP？）
```

```
> how do I configure Claude Code for Amazon Bedrock?（如何为 Amazon Bedrock 配置 Claude Code？）
```

```
> what are the limitations of Claude Code?（Claude Code 有哪些限制？）
```

> Claude 提供基于文档的答案来回答这些问题。有关可执行的示例和实际演示，请参阅上面的特定工作流程部分。

**提示：**

  * 无论你使用的版本是什么，Claude 始终可以访问最新的 Claude Code 文档。
  * 提出具体问题以获得详细答案。
  * Claude 可以解释复杂的功能，如 MCP 集成、企业配置和高级工作流程。

克隆我们的开发容器参考实现。

- [Claude Code 参考实现](https://github.com/anthropics/claude-code/tree/main/.devcontainer)


# 管理 Claude 的记忆（Memory）

> 了解如何通过不同的记忆位置和最佳实践，在会话之间管理 Claude Code 的记忆。

Claude Code 可以跨会话记住你的偏好，例如你的编码风格指南和工作流中的常用命令。

## 确定记忆类型

Claude Code 提供了三种分层的记忆位置，每种都有不同的用途：

| <nobr>记忆类型</nobr> | 位置 | 用途 | 用例示例 | 共享对象 |
| :--- | :--- | :--- | :--- | :--- |
| **企业策略** | macOS: `/Library/Application Support/ClaudeCode/CLAUDE.md`<br />Linux: `/etc/claude-code/CLAUDE.md`<br />Windows: `C:\ProgramData\ClaudeCode\CLAUDE.md` | 由 IT/DevOps 管理的组织级指令 | 公司编码标准、安全策略、合规性要求 | 组织中的所有用户 |
| **项目记忆** | `./CLAUDE.md` | 团队共享的项目指令 | 项目架构、编码标准、常用工作流 | 通过源代码控制的团队成员 |
| **用户记忆** | `~/.claude/CLAUDE.md` | 适用于所有项目的个人偏好 | 编码风格偏好、个人工具快捷方式 | 仅你自己（所有项目） |

所有记忆文件在启动时都会自动加载到 Claude Code 的上下文中。层级越高的文件越优先加载，为更具体的记忆奠定基础。

## CLAUDE.md 导入

CLAUDE.md 文件可以使用 `@path/to/import` 语法导入其他文件。下面的示例导入了 3 个文件：

```
参阅 @README 了解项目概览，@package.json 了解此项目可用的 npm 命令。

# 附加指令
- git workflow @docs/git-instructions.md
```

**相对路径**和**绝对路径**都支持。值得一提的是，导入用户主目录中的文件是一种方便的方式，让你的团队成员提供不提交到仓库中的个人指令。以前 CLAUDE.local.md 也用于类似目的，但现在已弃用，取而代之的是导入，因为它们在多个 git 工作区中效果更好。

```
# 个人偏好
- @~/.claude/my-project-instructions.md
```

为了避免潜在冲突，导入不会在 Markdown 代码块和代码跨度中进行评估。

```
此代码跨度不会被视为导入：`@anthropic-ai/claude-code`
```

导入的文件可以递归导入其他文件，最大深度为 5 跳。你可以通过运行 `/memory` 命令来查看加载了哪些记忆文件。

## Claude 如何查找记忆

Claude Code 以递归方式读取记忆：从当前工作目录 (cwd) 开始，Claude Code 向上递归（但不包括根目录 `/*`），并读取它找到的任何 CLAUDE.md 或 CLAUDE.local.md 文件。当你在大型仓库中工作时，这尤其方便，因为你在 `foo/bar/` 中运行 Claude Code，并且在 `foo/CLAUDE.md` 和 `foo/bar/CLAUDE.md` 中都有记忆。

Claude 还会发现嵌套在你当前工作目录下的子目录中的 CLAUDE.md 文件。它们不会在启动时加载，而是在 Claude 读取这些子目录中的文件时才被包含进来。

## 使用 `#` 快捷方式快速添加记忆

添加记忆的最快方法是以 `#` 字符开头：

```
# 总是使用描述性变量名
```

系统会提示你选择要将此记忆存储到哪个记忆文件中。

## 使用 `/memory` 直接编辑记忆

在会话期间使用 `/memory` 斜杠命令，可以在你的系统编辑器中打开任何记忆文件，以便进行更广泛的添加或组织。

## 设置项目记忆

假设你想设置一个 CLAUDE.md 文件来存储重要的项目信息、约定和常用命令。

使用以下命令为你的代码库引导一个 CLAUDE.md：

```
> /init 
```

**小贴士**：
  * 包含常用命令（构建、测试、lint），以避免重复搜索。
  * 记录代码风格偏好和命名约定。
  * 添加特定于你项目的重要架构模式。
  * CLAUDE.md 记忆既可以用于与团队共享的指令，也可以用于你的个人偏好。


## 组织级记忆管理

企业组织可以部署集中管理的 CLAUDE.md 文件，以适用于所有用户。

要设置组织级记忆管理：

### 1. 在适用于你的操作系统的相应位置创建企业记忆文件：

<!-- end list -->

  * macOS: `/Library/Application Support/ClaudeCode/CLAUDE.md`
  * Linux/WSL: `/etc/claude-code/CLAUDE.md`
  * Windows: `C:\ProgramData\ClaudeCode\CLAUDE.md`

<!-- end list -->

### 2. 通过你的配置管理系统（MDM、组策略、Ansible 等）进行部署，以确保在所有开发人员机器上的一致分发。

## 记忆最佳实践

  * **具体**：“使用 2 个空格缩进”比“正确格式化代码”更好。
  * **使用结构进行组织**：将每个单独的记忆格式化为项目符号，并将相关的记忆分组在描述性的 Markdown 标题下。
  * **定期审查**：随着项目的发展更新记忆，以确保 Claude 始终使用最新的信息和上下文。


# 子代理（Subagents）

> 在 Claude Code 中创建并使用专门的 AI 子代理，以处理特定任务流程并改进上下文管理。

Claude Code 中的自定义子代理是专门的 AI 助手，可被调用来处理特定类型的任务。它们通过提供任务特定的配置（包括自定义系统提示、工具和独立的上下文窗口），从而实现更高效的问题解决。

## 什么是子代理？

子代理是预先配置好的 AI “人格”，Claude Code 可以将任务委托给它们。每个子代理：

  * 都有特定的目的和专业领域
  * 使用独立的上下文窗口，与主对话分开
  * 可配置其被允许使用的特定工具
  * 包含一个指导其行为的自定义系统提示

当 Claude Code 遇到与其某个子代理的专业领域匹配的任务时，它可以将该任务委托给这个专门的子代理，后者将独立工作并返回结果。

## 主要优势

### 上下文保留
每个子代理在其自己的上下文中运行，防止主对话被“污染”，并使其专注于更高层次的目标。

### 专业知识
子代理可以根据特定领域进行详细指令的微调，从而在指定任务上获得更高的成功率。

### 可重用性
一旦创建，子代理可以在不同项目中重复使用，并与您的团队共享，以实现一致的工作流程。

### 灵活的权限
每个子代理都可以有不同的工具访问级别，这让您可以将功能强大的工具限制在特定的子代理类型上。

## 快速入门

创建您的第一个子代理：

### 1. 打开子代理界面
运行以下命令：

```
/agents
```

### 2. 选择“创建新代理”
选择创建项目级子代理还是用户级子代理。

### 3. 定义子代理
* **推荐**: 首先让 Claude 生成，然后再进行自定义，使其成为您自己的代理
* 详细描述您的子代理及其应在何时使用
* 选择您希望授予访问权限的工具（或留空以继承所有工具）
* 界面会显示所有可用工具，便于选择
* 如果您正在使用 Claude 生成，也可以通过按 `e` 在您自己的编辑器中编辑系统提示

### 4. 保存并使用
您的子代理现在可用了！Claude 会在适当的时候自动使用它，或者您也可以显式调用它：

```
> Use the code-reviewer subagent to check my recent changes
```

## 子代理配置

### 文件位置

子代理以带有 YAML frontmatter 的 Markdown 文件形式存储在两个可能的位置：

| 类型                  | 位置                | 范围  | 优先级   |
| :-------------------- | :------------------ | :------------------------------ | :------- |
| **项目子代理** | `.claude/agents/`   | 在当前项目中可用                | 最高     |
| **用户子代理** | `~/.claude/agents/` | 在所有项目中可用                | 较低     |

当子代理名称冲突时，项目级子代理优先于用户级子代理。

### 文件格式

每个子代理都定义在一个 Markdown 文件中，其结构如下：

```markdown
---
name: your-sub-agent-name
description: Description of when this subagent should be invoked
tools: tool1, tool2, tool3  # Optional - inherits all tools if omitted
---

Your subagent's system prompt goes here. This can be multiple paragraphs
and should clearly define the subagent's role, capabilities, and approach
to solving problems.

Include specific instructions, best practices, and any constraints
the subagent should follow.
```

**中文**

```markdown
---
name: your-sub-agent-name
description: 描述该子代理应在何时被调用
tools: tool1, tool2, tool3  # 可选 - 如果省略，则继承所有工具
---

这里是你的子代理的系统提示。可以包含多个段落，
应清晰定义子代理的角色、能力以及解决问题的方法。

请包含子代理应遵循的具体指令、最佳实践和任何约束条件。
```

#### 配置字段

| 字段 | 必需 | 描述 |
| :--- | :--- | :--- |
| `name`        | 是   | 使用小写字母和连字符的唯一标识符 |
| `description` | 是   | 对子代理用途的自然语言描述 |
| `tools`       | 否   | 逗号分隔的特定工具列表。如果省略，则继承主线程的所有工具 |

### 可用工具

子代理可以被授予对 Claude Code 任何内部工具的访问权限。有关可用工具的完整列表，请参阅[工具文档](https://www.google.com/search?q=/en/docs/claude-code/settings%23tools-available-to-claude)。

> **推荐：** 使用 `/agents` 命令来修改工具访问权限——它提供一个交互式界面，列出了所有可用工具，包括任何已连接的 MCP 服务器工具，使得选择变得更加容易。

您有两种配置工具的选项：

* **省略 `tools` 字段**，以继承主线程的所有工具（默认），包括 MCP 工具
* **指定单个工具**，作为逗号分隔的列表，以实现更精细的控制（可手动编辑或通过 `/agents` 编辑）

**MCP 工具**：子代理可以访问来自已配置的 MCP 服务器的 MCP 工具。当 `tools` 字段被省略时，子代理将继承主线程可用的所有 MCP 工具。

## 管理子代理

### 使用 `/agents` 命令（推荐）

`/agents` 命令提供了一个全面的子代理管理界面：

```
/agents
```

这将打开一个交互式菜单，您可以在其中：

  * 查看所有可用的子代理（内置、用户和项目）
  * 通过引导式设置创建新的子代理
  * 编辑现有的自定义子代理，包括它们的工具访问权限
  * 删除自定义子代理
  * 查看当存在重复项时哪个子代理处于活动状态
  * **轻松管理工具权限**，提供完整的可用工具列表

### 直接文件管理

您也可以通过直接操作子代理文件来管理它们：

```bash
# Create a project subagent
mkdir -p .claude/agents
echo '---
name: test-runner
description: Use proactively to run tests and fix failures
---

You are a test automation expert. When you see code changes, proactively run the appropriate tests. If tests fail, analyze the failures and fix them while preserving the original test intent.' > .claude/agents/test-runner.md

# Create a user subagent
mkdir -p ~/.claude/agents
# ... create subagent file
```

**中文**

```bash
# 创建一个项目子代理
mkdir -p .claude/agents
echo '---
name: test-runner
description: 使用主动测试和修复故障
---

你是一位测试自动化专家。当你看到代码更改时，主动运行相应的测试。如果测试失败，分析失败原因并修复它们，同时保留原始测试意图。' > .claude/agents/test-runner.md

# 创建一个用户子代理
mkdir -p ~/.claude/agents
# ... 创建子代理文件
```

## 有效使用子代理

### 自动委托

Claude Code 会根据以下因素主动委托任务：

  * 您请求中的任务描述
  * 子代理配置中的 `description` 字段
  * 当前上下文和可用工具

\<Tip\>
为了鼓励更主动的子代理使用，请在您的 `description` 字段中包含诸如“主动使用”或“必须使用”之类的短语。
\</Tip\>

### 显式调用

通过在命令中提及子代理名称来请求特定的子代理：

```
> Use the test-runner subagent to fix failing tests
> Have the code-reviewer subagent look at my recent changes
> Ask the debugger subagent to investigate this error
```

**中文**

```
> 使用 test-runner 子代理修复失败的测试
> 让 code-reviewer 子代理查看我最近的更改
> 让 debugger 子代理调查这个错误
```

## 子代理示例

### 代码审查员

```markdown
---
name: code-reviewer
description: Expert code review specialist. Proactively reviews code for quality, security, and maintainability. Use immediately after writing or modifying code.
tools: Read, Grep, Glob, Bash
---

You are a senior code reviewer ensuring high standards of code quality and security.

When invoked:
1. Run git diff to see recent changes
2. Focus on modified files
3. Begin review immediately

Review checklist:
- Code is simple and readable
- Functions and variables are well-named
- No duplicated code
- Proper error handling
- No exposed secrets or API keys
- Input validation implemented
- Good test coverage
- Performance considerations addressed

Provide feedback organized by priority:
- Critical issues (must fix)
- Warnings (should fix)
- Suggestions (consider improving)

Include specific examples of how to fix issues.
```

**中文**

```markdown
---
name: code-reviewer
description: 代码审查专家。主动审查代码的质量、安全性和可维护性。在编写或修改代码后立即使用。
tools: Read, Grep, Glob, Bash
---

您是一位高级代码审查员，负责确保代码质量和安全达到高标准。

被调用时：
1. 运行 `git diff` 查看最新更改。
2. 重点关注已修改的文件。
3. 立即开始审查。

代码审查清单：
- 代码简洁且可读。
- 函数和变量命名恰当。
- 没有重复代码。
- 适当的错误处理。
- 没有暴露的秘密信息或 API 密钥。
- 实现了输入验证。
- 良好的测试覆盖率。
- 考虑了性能问题。

按照优先级提供反馈：
- 严重问题 (必须修复)
- 警告 (应该修复)
- 建议 (考虑改进)

请附上如何修复问题的具体示例。
```

### 调试器

```markdown
---
name: debugger
description: Debugging specialist for errors, test failures, and unexpected behavior. Use proactively when encountering any issues.
tools: Read, Edit, Bash, Grep, Glob
---

You are an expert debugger specializing in root cause analysis.

When invoked:
1. Capture error message and stack trace
2. Identify reproduction steps
3. Isolate the failure location
4. Implement minimal fix
5. Verify solution works

Debugging process:
- Analyze error messages and logs
- Check recent code changes
- Form and test hypotheses
- Add strategic debug logging
- Inspect variable states

For each issue, provide:
- Root cause explanation
- Evidence supporting the diagnosis
- Specific code fix
- Testing approach
- Prevention recommendations

Focus on fixing the underlying issue, not just symptoms.
```

**中文**

```markdown
---
name: debugger
description: 调试专家，专门从事错误、测试失败和意外行为。遇到任何问题时主动使用。
tools: Read, Edit, Bash, Grep, Glob
---

您是一位专注于根本原因分析的资深调试专家。

被调用时：
1. 捕获错误信息和堆栈跟踪。
2. 找出复现步骤。
3. 隔离失败发生的位置。
4. 实施最小化的修复。
5. 验证解决方案有效。

调试流程：
- 分析错误信息和日志。
- 检查最近的代码更改。
- 提出并测试假设。
- 添加有策略的调试日志。
- 检查变量状态。

针对每个问题，请提供：
- 根本原因解释
- 支持诊断的证据
- 具体的代码修复方案
- 测试方法
- 预防建议

请专注于修复根本问题，而不仅仅是症状。
```

### 数据科学家

```markdown
---
name: data-scientist
description: Data analysis expert for SQL queries, BigQuery operations, and data insights. Use proactively for data analysis tasks and queries.
tools: Bash, Read, Write
---

You are a data scientist specializing in SQL and BigQuery analysis.

When invoked:
1. Understand the data analysis requirement
2. Write efficient SQL queries
3. Use BigQuery command line tools (bq) when appropriate
4. Analyze and summarize results
5. Present findings clearly

Key practices:
- Write optimized SQL queries with proper filters
- Use appropriate aggregations and joins
- Include comments explaining complex logic
- Format results for readability
- Provide data-driven recommendations

For each analysis:
- Explain the query approach
- Document any assumptions
- Highlight key findings
- Suggest next steps based on data

Always ensure queries are efficient and cost-effective.
```

**中文**

```markdown
---
name: data-scientist
description: 专门从事 SQL 查询、BigQuery 操作和数据洞察的数据分析专家。主动使用数据分析和查询任务。
tools: Bash, Read, Write
---

您是一位专注于 SQL 和 BigQuery 分析的数据科学家。

被调用时：
1. 理解数据分析需求。
2. 编写高效的 SQL 查询。
3. 酌情使用 BigQuery 命令行工具 (bq)。
4. 分析并总结结果。
5. 清晰地呈现发现。

核心实践：
- 编写优化的 SQL 查询，使用适当的过滤器。
- 使用合适的聚合和连接。
- 添加注释以解释复杂的逻辑。
- 格式化结果以提高可读性。
- 提供数据驱动的建议。

对于每项分析：
- 解释查询方法。
- 记录任何假设。
- 突出关键发现。
- 根据数据提出下一步建议。

始终确保查询高效且经济。
```

## 最佳实践

  * **从 Claude 生成的代理开始**: 我们强烈建议您首先使用 Claude 生成初始子代理，然后再对其进行迭代，使其成为您自己的。这种方法能为您带来最佳结果——一个坚实的基础，您可以根据您的特定需求进行自定义。

  * **设计专注的子代理**: 创建具有单一、明确职责的子代理，而不是试图让一个子代理做所有事情。这可以提高性能并使子代理更具可预测性。

  * **编写详细的提示**: 在您的系统提示中包含具体的指令、示例和约束。您提供的指导越多，子代理的性能就越好。

  * **限制工具访问**: 仅授予子代理完成其目的所需的工具。这可以提高安全性并帮助子代理专注于相关操作。

  * **版本控制**: 将项目子代理纳入版本控制，以便您的团队可以协作受益和改进它们。

## 高级用法

### 子代理链

对于复杂的工作流程，您可以将多个子代理串联起来：

```
> First use the code-analyzer subagent to find performance issues, then use the optimizer subagent to fix them
```

```
> 请先使用代码分析器 (code-analyzer) 子代理查找性能问题，然后使用优化器 (optimizer) 子代理来修复它们。
```

### 动态子代理选择

Claude Code 根据上下文智能地选择子代理。为了获得最佳结果，请将您的 `description` 字段写得具体且面向行动。

## 性能考量

  * **上下文效率**: 代理有助于保留主上下文，从而实现更长的整体会话
  * **延迟**: 子代理每次被调用时都会从一个空白状态开始，并且在收集完成其工作所需的上下文时可能会增加延迟。

## 相关文档

  * [斜杠命令](https://www.google.com/search?q=/en/docs/claude-code/slash-commands) - 了解其他内置命令
  * [设置](https://www.google.com/search?q=/en/docs/claude-code/settings) - 配置 Claude Code 行为
  * [钩子](https://www.google.com/search?q=/en/docs/claude-code/hooks) - 使用事件处理程序实现工作流程自动化


# Claude Code 设置

> 使用全局和项目级设置以及环境变量来配置 Claude Code。

Claude Code 提供了多种设置，可根据你的需求配置其行为。在使用交互式 REPL 时，可以通过运行 `/config` 命令来配置 Claude Code。

## 设置文件

`settings.json` 文件是用于通过分层设置来配置 **Claude Code** 的官方机制：

  * **用户设置**：定义在 `~/.claude/settings.json` 中，适用于所有项目。
  * **项目设置**：保存在你的项目目录中：
      * `.claude/settings.json` 用于那些会提交到源代码控制并与团队共享的设置。
      * `.claude/settings.local.json` 用于那些不提交的设置，对个人偏好和实验很有用。当创建此文件时，Claude Code 会配置 Git 来忽略它。
  * 对于 **Claude Code** 的企业部署，我们还支持**企业托管策略设置**。这些设置的优先级高于用户和项目设置。系统管理员可以将策略部署到：
      * macOS: `/Library/Application Support/ClaudeCode/managed-settings.json`
      * Linux 和 WSL: `/etc/claude-code/managed-settings.json`
      * Windows: `C:\ProgramData\ClaudeCode/managed-settings.json`

Example settings.json

```json
{
  "permissions": {
    "allow": [
      "Bash(npm run lint)",
      "Bash(npm run test:*)",
      "Read(~/.zshrc)"
    ],
    "deny": [
      "Bash(curl:*)",
      "Read(./.env)",
      "Read(./.env.*)",
      "Read(./secrets/**)"
    ]
  },
  "env": {
    "CLAUDE_CODE_ENABLE_TELEMETRY": "1",
    "OTEL_METRICS_EXPORTER": "otlp"
  }
}
```

### 可用设置

`settings.json` 支持许多选项：

| 键 | 描述 | 示例 |
| :--- | :--- | :--- |
| `apiKeyHelper` | 用于生成身份验证值的自定义脚本，将在 `/bin/sh` 中执行。此值将作为 `X-Api-Key` 和 `Authorization: Bearer` 头信息发送给模型请求。 | `/bin/generate_temp_api_key.sh` |
| `cleanupPeriodDays` | 根据上次活动日期，本地保留聊天记录的时间（默认为 30 天）。 | `20` |
| `env` | 将应用于每个会话的环境变量。 | `{"FOO": "bar"}` |
| `includeCoAuthoredBy` | 是否在 git 提交和拉取请求中包含 `co-authored-by Claude` 的署名（默认为 `true`）。 | `false` |
| `permissions` | 请参阅下表了解权限结构。 | |
| `hooks` | 配置在工具执行之前或之后运行的自定义命令。请参阅 [hooks documentation](https://www.google.com/search?q=hooks)。 | `{"PreToolUse": {"Bash": "echo 'Running command...'"}}` |
| `disableAllHooks` | 禁用所有 [hooks](https://www.google.com/search?q=hooks)。 | `true` |
| `model` | 覆盖 Claude Code 使用的默认模型。 | `"claude-3-5-sonnet-20241022"` |
| `statusLine` | 配置自定义状态行以显示上下文。请参阅 [statusLine documentation](https://www.google.com/search?q=statusline)。 | `{"type": "command", "command": "~/.claude/statusline.sh"}` |
| `outputStyle` | 配置输出样式以调整系统提示。请参阅 [output styles documentation](https://www.google.com/search?q=output-styles)。 | `"Explanatory"` |
| `forceLoginMethod` | 使用 `claudeai` 将登录限制为 Claude.ai 账户，`console` 将登录限制为 Anthropic Console（API 使用计费）账户。 | `claudeai` |
| `forceLoginOrgUUID` | 指定组织的 UUID，以在登录时自动选择它，绕过组织选择步骤。需要设置 `forceLoginMethod`。 | `"xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"` |
| `enableAllProjectMcpServers` | 自动批准项目 `.mcp.json` 文件中定义的所有 MCP 服务器。 | `true` |
| `enabledMcpjsonServers` | 要批准的 `.mcp.json` 文件中的特定 MCP 服务器列表。 | `["memory", "github"]` |
| `disabledMcpjsonServers` | 要拒绝的 `.mcp.json` 文件中的特定 MCP 服务器列表。 | `["filesystem"]` |
| `awsAuthRefresh` | 修改 `.aws` 目录的自定义脚本（参见 [advanced credential configuration](https://www.google.com/search?q=/en/docs/claude-code/amazon-bedrock%23advanced-credential-configuration)）。 | `aws sso login --profile myprofile` |
| `awsCredentialExport` | 输出包含 AWS 凭据的 JSON 的自定义脚本（参见 [advanced credential configuration](https://www.google.com/search?q=/en/docs/claude-code/amazon-bedrock%23advanced-credential-configuration)）。 | `/bin/generate_aws_grant.sh` |

### 权限设置

| 键 | 描述 | 示例 |
| :--- | :--- | :--- |
| `allow` | 允许使用工具的 [权限规则](https://www.google.com/search?q=/en/docs/claude-code/iam%23configuring-permissions) 数组。**注意**：Bash 规则使用前缀匹配，而不是正则表达式。 | `[ "Bash(git diff:*)" ]` |
| `ask` | 使用工具时需要确认的 [权限规则](https://www.google.com/search?q=/en/docs/claude-code/iam%23configuring-permissions) 数组。 | `[ "Bash(git push:*)" ]` |
| `deny` | 拒绝使用工具的 [权限规则](https://www.google.com/search?q=/en/docs/claude-code/iam%23configuring-permissions) 数组。也用于排除敏感文件，使其无法被 Claude Code 访问。**注意**：Bash 模式是前缀匹配，可以被绕过（参见 [Bash permission limitations](https://www.google.com/search?q=/en/docs/claude-code/iam%23tool-specific-permission-rules)）。 | `[ "WebFetch", "Bash(curl:*)", "Read(./.env)", "Read(./secrets/**)" ]` |
| `additionalDirectories` | Claude 可以访问的额外 [工作目录](https://www.google.com/search?q=iam%23working-directories)。 | `[ "../docs/" ]` |
| `defaultMode` | 打开 Claude Code 时的默认 [权限模式](https://www.google.com/search?q=iam%23permission-modes)。 | `"acceptEdits"` |
| `disableBypassPermissionsMode` | 设置为 `"disable"` 可防止 `bypassPermissions` 模式被激活。参见 [managed policy settings](https://www.google.com/search?q=iam%23enterprise-managed-policy-settings)。 | `"disable"` |

### 设置优先级

设置按照优先级（从高到低）应用：

1.  **企业托管策略** (`managed-settings.json`)

      * 由 IT/DevOps 部署
      * 不能被覆盖

2.  **命令行参数**

      * 针对特定会话的临时覆盖

3.  **本地项目设置** (`.claude/settings.local.json`)

      * 个人项目特定设置

4.  **共享项目设置** (`.claude/settings.json`)

      * 在源代码控制中共享的团队项目设置

5.  **用户设置** (`~/.claude/settings.json`)

      * 个人全局设置

此层级结构确保了企业安全策略始终得到执行，同时仍然允许团队和个人定制他们的体验。

### 配置系统的关键点

  * **记忆文件 (`CLAUDE.md`)**：包含 Claude 在启动时加载的指令和上下文。
  * **设置文件 (`JSON`)**：配置权限、环境变量和工具行为。
  * **斜杠命令**：可以在会话期间通过 `/command-name` 调用的自定义命令。
  * **MCP 服务器**：通过额外的工具和集成来扩展 Claude Code。
  * **优先级**：更高层级的配置（企业）会覆盖更低层级的配置（用户/项目）。
  * **继承**：设置会合并，更具体的设置会添加或覆盖更广泛的设置。

### 系统提示可用性

与 claude.ai 不同，我们不会在此网站上发布 Claude Code 的内部系统提示。使用 `CLAUDE.md` 文件或 `--append-system-prompt` 来为 Claude Code 的行为添加自定义指令。

### 排除敏感文件

为了防止 Claude Code 访问包含敏感信息的文件（例如，API 密钥、机密、环境变量文件），请在 `.claude/settings.json` 文件中使用 `permissions.deny` 设置：

```json
{
  "permissions": {
    "deny": [
      "Read(./.env)",
      "Read(./.env.*)",
      "Read(./secrets/**)",
      "Read(./config/credentials.json)",
      "Read(./build)"
    ]
  }
}
```

这取代了已弃用的 `ignorePatterns` 配置。匹配这些模式的文件对 Claude Code 来说将是完全不可见的，从而防止敏感数据意外暴露。

### 子代理配置

Claude Code 支持自定义 AI **子代理**，可以在用户和项目级别进行配置。这些子代理以带有 YAML 头信息的 Markdown 文件形式存储：

  * **用户子代理**：`~/.claude/agents/` - 在你的所有项目中都可用。
  * **项目子代理**：`.claude/agents/` - 专属于你的项目，可以与团队共享。

子代理文件定义了具有自定义提示和工具权限的专业 AI 助手。请在 [subagents documentation](https://www.google.com/search?q=/en/docs/claude-code/sub-agents) 中了解更多关于创建和使用子代理的信息。

### 环境变量

Claude Code 支持以下环境变量来控制其行为：

所有环境变量也可以在 [`settings.json`](https://www.google.com/search?q=%23available-settings) 中配置。这是一种为每个会话自动设置环境变量的有用方式，或者为你的整个团队或组织推出一套环境变量。

| 变量 | 用途 |
| :--- | :--- |
| `ANTHROPIC_API_KEY` | 作为 `X-Api-Key` 头信息发送的 API 密钥，通常用于 Claude SDK（对于交互式使用，请运行 `/login`）。 |
| `ANTHROPIC_AUTH_TOKEN` | 用于 `Authorization` 头信息的自定义值（你在此处设置的值将带有 ` Bearer  ` 前缀）。 |
| `ANTHROPIC_CUSTOM_HEADERS` | 你想要添加到请求中的自定义头信息（`Name: Value` 格式）。 |
| `ANTHROPIC_DEFAULT_HAIKU_MODEL` | 参见 [Model configuration](https://www.google.com/search?q=/en/docs/claude-code/model-config%23environment-variables)。 |
| `ANTHROPIC_DEFAULT_OPUS_MODEL` | 参见 [Model configuration](https://www.google.com/search?q=/en/docs/claude-code/model-config%23environment-variables)。 |
| `ANTHROPIC_DEFAULT_SONNET_MODEL` | 参见 [Model configuration](https://www.google.com/search?q=/en/docs/claude-code/model-config%23environment-variables)。 |
| `ANTHROPIC_MODEL` | 要使用的模型设置名称（参见 [Model Configuration](https://www.google.com/search?q=/en/docs/claude-code/model-config%23environment-variables)）。 |
| `ANTHROPIC_SMALL_FAST_MODEL` | \[已弃用] 用于后台任务的 [Haiku-class 模型](https://www.google.com/search?q=/en/docs/claude-code/costs) 名称。 |
| `ANTHROPIC_SMALL_FAST_MODEL_AWS_REGION` | 使用 Bedrock 时，覆盖 Haiku-class 模型的 AWS 区域。 |
| `AWS_BEARER_TOKEN_BEDROCK` | 用于身份验证的 Bedrock API 密钥（参见 [Bedrock API keys](https://aws.amazon.com/blogs/machine-learning/accelerate-ai-development-with-amazon-bedrock-api-keys/)）。 |
| `BASH_DEFAULT_TIMEOUT_MS` | 长期运行的 Bash 命令的默认超时时间。 |
| `BASH_MAX_OUTPUT_LENGTH` | Bash 输出在中间被截断之前的最大字符数。 |
| `BASH_MAX_TIMEOUT_MS` | 模型可以为长期运行的 Bash 命令设置的最大超时时间。 |
| `CLAUDE_BASH_MAINTAIN_PROJECT_WORKING_DIR` | 在每个 Bash 命令后返回到原始工作目录。 |
| `CLAUDE_CODE_API_KEY_HELPER_TTL_MS` | 使用 `apiKeyHelper` 时，凭据应刷新的间隔（以毫秒为单位）。 |
| `CLAUDE_CODE_CLIENT_CERT` | 用于 mTLS 身份验证的客户端证书文件的路径。 |
| `CLAUDE_CODE_CLIENT_KEY_PASSPHRASE` | 加密的 `CLAUDE_CODE_CLIENT_KEY` 的密码（可选）。 |
| `CLAUDE_CODE_CLIENT_KEY` | 用于 mTLS 身份验证的客户端私钥文件的路径。 |
| `CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC` | 相当于设置 `DISABLE_AUTOUPDATER`、`DISABLE_BUG_COMMAND`、`DISABLE_ERROR_REPORTING` 和 `DISABLE_TELEMETRY`。 |
| `CLAUDE_CODE_DISABLE_TERMINAL_TITLE` | 设置为 `1` 可禁用基于对话上下文的自动终端标题更新。 |
| `CLAUDE_CODE_IDE_SKIP_AUTO_INSTALL` | 跳过 IDE 扩展的自动安装。 |
| `CLAUDE_CODE_MAX_OUTPUT_TOKENS` | 设置大多数请求的最大输出 token 数量。 |
| `CLAUDE_CODE_SKIP_BEDROCK_AUTH` | 跳过 Bedrock 的 AWS 身份验证（例如，使用 LLM 网关时）。 |
| `CLAUDE_CODE_SKIP_VERTEX_AUTH` | 跳过 Vertex 的 Google 身份验证（例如，使用 LLM 网关时）。 |
| `CLAUDE_CODE_SUBAGENT_MODEL` | 参见 [Model configuration](https://www.google.com/search?q=/en/docs/claude-code/model-config)。 |
| `CLAUDE_CODE_USE_BEDROCK` | 使用 [Bedrock](https://www.google.com/search?q=/en/docs/claude-code/amazon-bedrock)。 |
| `CLAUDE_CODE_USE_VERTEX` | 使用 [Vertex](https://www.google.com/search?q=/en/docs/claude-code/google-vertex-ai)。 |
| `DISABLE_AUTOUPDATER` | 设置为 `1` 可禁用自动更新。这优先于 `autoUpdates` 配置设置。 |
| `DISABLE_BUG_COMMAND` | 设置为 `1` 可禁用 `/bug` 命令。 |
| `DISABLE_COST_WARNINGS` | 设置为 `1` 可禁用成本警告消息。 |
| `DISABLE_ERROR_REPORTING` | 设置为 `1` 可选择退出 Sentry 错误报告。 |
| `DISABLE_NON_ESSENTIAL_MODEL_CALLS` | 设置为 `1` 可禁用非关键路径（如花哨文本）的模型调用。 |
| `DISABLE_TELEMETRY` | 设置为 `1` 可选择退出 Statsig 遥测（请注意，Statsig 事件不包含用户数据，如代码、文件路径或 Bash 命令）。 |
| `HTTP_PROXY` | 指定用于网络连接的 HTTP 代理服务器。 |
| `HTTPS_PROXY` | 指定用于网络连接的 HTTPS 代理服务器。 |
| `MAX_MCP_OUTPUT_TOKENS` | MCP 工具响应中允许的最大 token 数量。当输出超过 10,000 个 token 时，Claude Code 会显示警告（默认为 25000）。 |
| `MAX_THINKING_TOKENS` | 强制为模型预算进行思考。 |
| `MCP_TIMEOUT` | MCP 服务器启动的超时时间（以毫秒为单位）。 |
| `MCP_TOOL_TIMEOUT` | MCP 工具执行的超时时间（以毫秒为单位）。 |
| `NO_PROXY` | 请求将直接发送而不通过代理的域名和 IP 列表。 |
| `USE_BUILTIN_RIPGREP` | 设置为 `0` 可使用系统安装的 `rg`，而不是随 Claude Code 提供的 `rg`。 |
| `VERTEX_REGION_CLAUDE_3_5_HAIKU` | 使用 Vertex AI 时，覆盖 Claude 3.5 Haiku 的区域。 |
| `VERTEX_REGION_CLAUDE_3_5_SONNET` | 使用 Vertex AI 时，覆盖 Claude Sonnet 3.5 的区域。 |
| `VERTEX_REGION_CLAUDE_3_7_SONNET` | 使用 Vertex AI 时，覆盖 Claude 3.7 Sonnet 的区域。 |
| `VERTEX_REGION_CLAUDE_4_0_OPUS` | 使用 Vertex AI 时，覆盖 Claude 4.0 Opus 的区域。 |
| `VERTEX_REGION_CLAUDE_4_0_SONNET` | 使用 Vertex AI 时，覆盖 Claude 4.0 Sonnet 的区域。 |
| `VERTEX_REGION_CLAUDE_4_1_OPUS` | 使用 Vertex AI 时，覆盖 Claude 4.1 Opus 的区域。 |

### 配置选项

要管理你的配置，请使用以下命令：

  * 列出设置：`claude config list`
  * 查看设置：`claude config get <key>`
  * 更改设置：`claude config set <key> <value>`
  * 添加设置（针对列表）：`claude config add <key> <value>`
  * 移除设置（针对列表）：`claude config remove <key> <value>`

默认情况下，`config` 更改你的项目配置。要管理你的全局配置，请使用 `--global` (或 `-g`) 标志。

### 全局配置

要设置全局配置，请使用 `claude config set -g <key> <value>`：

| 键 | 描述 | 示例 |
| :--- | :--- | :--- |
| `autoUpdates` | **已弃用**。请改用 `DISABLE_AUTOUPDATER` 环境变量。 | `false` |
| `preferredNotifChannel` | 你希望接收通知的位置（默认为 `iterm2`）。 | `iterm2`、`iterm2_with_bell`、`terminal_bell` 或 `notifications_disabled` |
| `theme` | 颜色主题。 | `dark`、`light`、`light-daltonized` 或 `dark-daltonized` |
| `verbose` | 是否显示完整的 Bash 和命令输出（默认为 `false`）。 | `true` |

### Claude 可用的工具

Claude Code 可以访问一套强大的工具，帮助它理解和修改你的代码库：

| 工具 | 描述 | 是否需要权限 |
| :--- | :--- | :--- |
| **Bash** | 在你的环境中执行 shell 命令。 | 是 |
| **Edit** | 对特定文件进行有针对性的编辑。 | 是 |
| **Glob** | 根据模式匹配查找文件。 | 否 |
| **Grep** | 在文件内容中搜索模式。 | 否 |
| **MultiEdit** | 对单个文件原子性地执行多个编辑。 | 是 |
| **NotebookEdit** | 修改 Jupyter notebook 单元格。 | 是 |
| **NotebookRead** | 读取并显示 Jupyter notebook 内容。 | 否 |
| **Read** | 读取文件的内容。 | 否 |
| **Task** | 运行一个子代理来处理复杂的、多步骤的任务。 | 否 |
| **TodoWrite** | 创建和管理结构化任务列表。 | 否 |
| **WebFetch** | 从指定的 URL 获取内容。 | 是 |
| **WebSearch** | 执行带有域名过滤的网页搜索。 | 是 |
| **Write** | 创建或覆盖文件。 | 是 |

权限规则可以使用 `/allowed-tools` 或在 [permission settings](https://www.google.com/search?q=/en/docs/claude-code/settings%23available-settings) 中配置。另请参见 [Tool-specific permission rules](https://www.google.com/search?q=/en/docs/claude-code/iam%23tool-specific-permission-rules)。

### 使用钩子扩展工具

你可以在任何工具执行之前或之后，使用 [Claude Code hooks](https://www.google.com/search?q=/en/docs/claude-code/hooks-guide) 运行自定义命令。

例如，在 Claude 修改 Python 文件后，你可以自动运行一个 Python 格式化程序，或者通过阻止对某些路径的 Write 操作来防止对生产配置文件的修改。

### 另请参见

  * [身份和访问管理](https://www.google.com/search?q=/en/docs/claude-code/iam%23configuring-permissions) - 了解 Claude Code 的权限系统。
  * [IAM 和访问控制](https://www.google.com/search?q=/en/docs/claude-code/iam%23enterprise-managed-policy-settings) - 企业策略管理。
  * [故障排除](https://www.google.com/search?q=/en/docs/claude-code/troubleshooting%23auto-updater-issues) - 常见配置问题的解决方案。


# CLI 参考

> 完整的 Claude Code 命令行界面参考，包括命令和标志。

## CLI 命令

| 命令 | 描述 | 示例 |
| :--- | :--- | :--- |
| `claude`  | 启动交互式 REPL（读取-求值-输出循环）   | `claude`  |
| `claude "query"`                 | 启动 REPL 并带初始提示                 | `claude "解释一下这个项目"`  |
| `claude -p "query"`              | 通过 SDK 查询，然后退出                | `claude -p "解释一下这个函数"` |
| `cat file \| claude -p "query"`  | 处理管道输入的内容  | `cat logs.txt \| claude -p "解释"` |
| `claude -c` | 继续最近的对话 | `claude -c`|
| `claude -c -p "query"`           | 通过 SDK 继续对话 | `claude -c -p "检查类型错误"`  |
| `claude -r "<session-id>" "query"`| 按会话 ID 恢复会话 | `claude -r "abc123" "完成这个 PR"` |
| `claude update`                  | 更新到最新版本 | `claude update` |
| `claude mcp` | 配置模型上下文协议（MCP）服务器        | 参见 [Claude Code MCP 文档](https://www.google.com/search?q=/en/docs/claude-code/mcp)。             |

## CLI 标志

使用这些命令行标志自定义 Claude Code 的行为：

| 标志 | 描述 | 示例 |
| :--- | :--- | :--- |
| `--add-dir` | 添加 Claude 可访问的额外工作目录（验证每个路径都存在且为目录）  | `claude --add-dir ../apps ../lib` |
| `--allowedTools`                 | 除了 [settings.json 文件](https://www.google.com/search?q=/en/docs/claude-code/settings) 之外，允许使用一组无需提示用户权限的工具 | `"Bash(git log:*)" "Bash(git diff:*)" "Read"` |
| `--disallowedTools`              | 除了 [settings.json 文件](https://www.google.com/search?q=/en/docs/claude-code/settings) 之外，禁止使用一组无需提示用户权限的工具 | `"Bash(git log:*)" "Bash(git diff:*)" "Edit"` |
| `--print`, `-p`                  | 在非交互模式下打印响应（参见 [SDK 文档](https://www.google.com/search?q=/en/docs/claude-code/sdk) 以了解编程使用细节） | `claude -p "查询"` |
| `--append-system-prompt`         | 追加到系统提示中（仅限 `--print`）| `claude --append-system-prompt "自定义指令"`   |
| `--output-format`                | 指定打印模式的输出格式（选项：`text`、`json`、`stream-json`） | `claude -p "query" --output-format json`  |
| `--input-format`                 | 指定打印模式的输入格式（选项：`text`、`stream-json`） | `claude -p --output-format json --input-format stream-json`                |
| `--include-partial-messages`     | 在输出中包含部分流式事件（需要 `--print` 和 `--output-format=stream-json`）  | `claude -p --output-format stream-json --include-partial-messages "query"` |
| `--verbose` | 启用详细日志记录，显示完整的逐轮输出（有助于在打印模式和交互模式下进行调试） | `claude --verbose`|
| `--max-turns`                    | 限制非交互模式下的代理回合数 | `claude -p --max-turns 3 "query"` |
| `--model` | 设置当前会话的模型，可以使用最新模型的别名（`sonnet` 或 `opus`），或模型的完整名称    | `claude --model claude-sonnet-4-20250514` |
| `--permission-mode`              | 以指定的[权限模式](https://www.google.com/search?q=iam%23permission-modes)启动 | `claude --permission-mode plan`   |
| `--permission-prompt-tool`       | 指定一个 MCP 工具来处理非交互模式下的权限提示 | `claude -p --permission-prompt-tool mcp_auth_tool "query"`                 |
| `--resume`  | 按 ID 或在交互模式下选择以恢复特定会话 | `claude --resume abc123 "query"`  |
| `--continue` | 加载当前目录中最近的对话   | `claude --continue` |
| `--dangerously-skip-permissions` | 跳过权限提示（请谨慎使用） | `claude --dangerously-skip-permissions`   |

> `--output-format json` 标志对于编写脚本和自动化特别有用，它允许你以编程方式解析 Claude 的响应。

有关打印模式 (`-p`) 的详细信息，包括输出格式、流式传输、详细日志记录和编程用法，请参阅 [SDK 文档](https://www.google.com/search?q=/en/docs/claude-code/sdk)。

## 另请参见

  * [交互模式](https://www.google.com/search?q=/en/docs/claude-code/interactive-mode) - 快捷键、输入模式和交互功能
  * [斜杠命令](https://www.google.com/search?q=/en/docs/claude-code/slash-commands) - 交互式会话命令
  * [快速入门指南](https://www.google.com/search?q=/en/docs/claude-code/quickstart) - 开始使用 Claude Code
  * [常见工作流](https://www.google.com/search?q=/en/docs/claude-code/common-workflows) - 高级工作流和模式
  * [设置](https://www.google.com/search?q=/en/docs/claude-code/settings) - 配置选项
  * [SDK 文档](https://www.google.com/search?q=/en/docs/claude-code/sdk) - 编程用法和集成


# 交互模式

> 这是一份关于 Claude Code 会话中键盘快捷键、输入模式和交互功能的完整参考。

## 键盘快捷键

### 通用控制

| 快捷键 | 说明 | 情境 |
| :--- | :--- | :--- |
| `Ctrl+C`         | 取消当前输入或生成           | 标准中断 |
| `Ctrl+D`         | 退出 Claude Code 会话        | EOF（文件结束符）信号 |
| `Ctrl+L`         | 清除终端屏幕                 | 保留对话历史记录 |
| `上/下箭头`        | 浏览命令历史记录             | 调出之前的输入 |
| `Esc` + `Esc`    | 编辑上一条消息               | 双击 `Esc` 进行修改 |
| `Shift+Tab`      | 切换权限模式                 | 在自动接受模式、计划模式和普通模式之间切换 |

### 多行输入

| 方法             | 快捷键           | 情境  |
| :--------------- | :--------------- | :--------------------------------- |
| 快速转义         | `\` + `Enter`    | 适用于所有终端 |
| macOS 默认       | `Option+Enter`   | macOS 默认  |
| 终端设置         | `Shift+Enter`    | 在执行 `/terminal-setup` 后        |
| 控制序列         | `Ctrl+J`         | 多行输入时的换行符                 |
| 直接粘贴         | 直接粘贴         | 适用于代码块、日志等               |

> 你可以在终端设置中配置首选的换行行为。运行 `/terminal-setup` 可以在 iTerm2 和 VS Code 终端中安装 `Shift+Enter` 绑定。

### 快速命令

| 快捷键 | 说明 | 备注 |
| :--- | :--- | :--- |
| `  # ` 开头         | 记忆快捷方式 - 添加到 CLAUDE.md    | 提示你选择文件 |
| `  / ` 开头         | 斜杠命令 | 参见 [斜杠命令](https://www.google.com/search?q=/en/docs/claude-code/slash-commands)         |
| `  ! ` 开头         | Bash 模式 | 直接运行命令并将执行输出添加到会话中 |

## Vim 编辑器模式

使用 `/vim` 命令可启用 Vim 风格的编辑，或通过 `/config` 进行永久配置。

### 模式切换

| 命令 | 动作  | 来源模式   |
| :--- | :------------------------- | :--------- |
| `Esc`  | 进入普通（NORMAL）模式       | 插入（INSERT）   |
| `i`    | 在光标前插入               | 普通（NORMAL）   |
| `I`    | 在行首插入                 | 普通（NORMAL）   |
| `a`    | 在光标后插入               | 普通（NORMAL）   |
| `A`    | 在行尾插入                 | 普通（NORMAL）   |
| `o`    | 在下方新开一行             | 普通（NORMAL）   |
| `O`    | 在上方新开一行             | 普通（NORMAL）   |

### 导航（普通模式）

| 命令           | 动作 |
| :------------- | :----------------------- |
| `h`/`j`/`k`/`l` | 左/下/上/右移动            |
| `w`              | 下一个单词               |
| `e`              | 单词末尾                 |
| `b`              | 上一个单词               |
| `0`              | 行首 |
| `$`              | 行尾 |
| `^`              | 行首第一个非空字符         |
| `gg`             | 输入的开头               |
| `G`              | 输入的末尾               |

### 编辑（普通模式）

| 命令           | 动作 |
| :------------- | :----------------------- |
| `x`              | 删除字符                 |
| `dd`             | 删除行                   |
| `D`              | 删除至行尾               |
| `dw`/`de`/`db` | 删除单词/至单词末尾/向后  |
| `cc`             | 更改行                   |
| `C`              | 更改至行尾               |
| `cw`/`ce`/`cb` | 更改单词/至单词末尾/向后  |
| `.`              | 重复上次更改             |

## 命令历史记录

Claude Code 会话会保留当前会话的命令历史记录：

  * 历史记录按工作目录存储
  * 使用 `/clear` 命令清除
  * 使用上/下箭头浏览（见上文键盘快捷键）
  * **Ctrl+R**: 反向搜索历史记录（如果终端支持）
  * **注意**: 历史扩展（`!`）默认禁用

## 另请参阅

  * [斜杠命令](https://www.google.com/search?q=/en/docs/claude-code/slash-commands) - 交互式会话命令
  * [CLI 参考](https://www.google.com/search?q=/en/docs/claude-code/cli-reference) - 命令行标志和选项
  * [设置](https://www.google.com/search?q=/en/docs/claude-code/settings) - 配置选项
  * [内存管理](https://www.google.com/search?q=/en/docs/claude-code/memory) - 管理 CLAUDE.md 文件


# 斜杠命令（Slash Commands）

> 使用斜杠命令在交互式会话中控制 Claude 的行为。

## 内置斜杠命令

| 命令 | 用途 |
| :--- | :--- |
| `/add-dir` | 添加额外的工作目录 |
| `/agents` | 管理用于特定任务的自定义 AI 子代理 |
| `/bug` | 报告错误（将对话发送给 Anthropic） |
| `/clear` | 清除对话历史记录 |
| `/compact [instructions]` | 压缩对话并可选择性地添加关注指令 |
| `/config` | 查看/修改配置 |
| `/cost` | 显示令牌使用统计信息（有关订阅特定详细信息，请参阅[成本跟踪指南](https://www.google.com/search?q=/en/docs/claude-code/costs%23using-the-cost-command)） |
| `/doctor` | 检查你的 Claude Code 安装的健康状况 |
| `/help` | 获取使用帮助 |
| `/init` | 使用 CLAUDE.md 指南初始化项目 |
| `/login` | 切换 Anthropic 账户 |
| `/logout` | 从你的 Anthropic 账户退出登录 |
| `/mcp` | 管理 MCP 服务器连接和 OAuth 身份验证 |
| `/memory` | 编辑 CLAUDE.md 内存文件 |
| `/model` | 选择或更改 AI 模型 |
| `/permissions` | 查看或更新[权限](https://www.google.com/search?q=/en/docs/claude-code/iam%23configuring-permissions) |
| `/pr_comments` | 查看拉取请求评论 |
| `/review` | 请求代码审查 |
| `/status` | 查看账户和系统状态 |
| `/terminal-setup` | 安装换行符的 Shift+Enter 键绑定（仅限 iTerm2 和 VSCode） |
| `/vim` | 进入 vim 模式，以交替进行插入和命令模式 |

## 自定义斜杠命令

自定义斜杠命令允许你将常用提示定义为 Markdown 文件，Claude Code 可以执行这些文件。命令按范围（项目特定或个人）进行组织，并通过目录结构支持命名空间。

### 语法

```
/<command-name> [arguments]
```

#### 参数

| 参数 | 描述 |
| :--- | :--- |
| `<command-name>` | 源自 Markdown 文件名（不带 `.md` 扩展名）的名称 |
| `[arguments]` | 传递给命令的可选参数 |

### 命令类型

#### 项目命令

存储在你的仓库中并与你的团队共享的命令。当在 `/help` 中列出时，这些命令在其描述后显示 "(project)"。

**位置**：`.claude/commands/`

在下面的示例中，我们创建 `/optimize` 命令：

```bash
# 创建一个项目命令
mkdir -p .claude/commands
# 分析以下代码的性能问题并提出优化建议
echo "Analyze this code for performance issues and suggest optimizations:" > .claude/commands/optimize.md
```

#### 个人命令

可在你所有项目中使用的命令。当在 `/help` 中列出时，这些命令在其描述后显示 "(user)"。

**位置**：`~/.claude/commands/`

在下面的示例中，我们创建 `/security-review` 命令：

```bash
# 创建一个个人命令
mkdir -p ~/.claude/commands
# 请检查此代码是否存在安全漏洞
echo "Review this code for security vulnerabilities:" > ~/.claude/commands/security-review.md
```

### 功能

#### 命名空间

在子目录中组织命令。子目录用于组织，并出现在命令描述中，但它们不影响命令名称本身。描述将显示命令是来自项目目录（`.claude/commands`）还是用户级目录（`~/.claude/commands`），以及子目录名称。

不支持用户级命令和项目级命令之间的冲突。否则，具有相同基本文件名的多个命令可以共存。

例如，位于 `.claude/commands/frontend/component.md` 的文件会创建 `/component` 命令，其描述显示 "(project:frontend)"。
同时，位于 `~/.claude/commands/component.md` 的文件会创建 `/component` 命令，其描述显示 "(user)"。

#### 参数

使用参数占位符将动态值传递给命令：

##### 所有参数都使用 `$ARGUMENTS`

`$ARGUMENTS` 占位符捕获传递给命令的所有参数：

```bash
# 命令定义（修复第 #$ARGUMENTS 个问题，并遵循我们的编码标准。）
echo 'Fix issue #$ARGUMENTS following our coding standards' > .claude/commands/fix-issue.md

# 用法
> /fix-issue 123 high-priority
# $ARGUMENTS 变为: "123 high-priority"
```

##### 独立参数使用 `$1`, `$2` 等

使用位置参数（类似于 shell 脚本）分别访问特定参数：

```bash
# 命令定义  
echo 'Review PR #$1 with priority $2 and assign to $3' > .claude/commands/review-pr.md

# 用法
> /review-pr 456 high alice
# $1 变为 "456", $2 变为 "high", $3 变为 "alice"
```

当你需要以下情况时使用位置参数：

  * 在命令的不同部分单独访问参数
  * 为缺失的参数提供默认值
  * 构建具有特定参数角色的更结构化的命令

#### Bash 命令执行

在斜杠命令运行之前，使用 `!` 前缀执行 bash 命令。输出将包含在命令上下文中。你**必须**包含带有 `Bash` 工具的 `allowed-tools`，但你可以选择允许的特定 bash 命令。

例如：

```markdown
---
allowed-tools: Bash(git add:*), Bash(git status:*), Bash(git commit:*)
description: Create a git commit
---

## Context

- Current git status: !`git status`
- Current git diff (staged and unstaged changes): !`git diff HEAD`
- Current branch: !`git branch --show-current`
- Recent commits: !`git log --oneline -10`

## Your task

Based on the above changes, create a single git commit.
```

**中文**

```markdown
---
allowed-tools: Bash(git add:*), Bash(git status:*), Bash(git commit:*)
description: 创建一个 Git 提交
---

## 上下文

- 当前 Git 状态: !`git status`
- 当前 Git 差异（已暂存和未暂存的更改）: !`git diff HEAD`
- 当前分支: !`git branch --show-current`
- 最近的提交: !`git log --oneline -10`

## 你的任务

根据上述更改，创建一个单独的 Git 提交。
```

#### 文件引用

使用 `@` 前缀在命令中包含文件内容以[引用文件](https://www.google.com/search?q=/en/docs/claude-code/common-workflows%23reference-files-and-directories)。

例如：

```markdown
# 引用特定文件

Review the implementation in @src/utils/helpers.js

# 引用多个文件

Compare @src/old-version.js with @src/new-version.js
```

#### 思考模式

斜杠命令可以通过包含[扩展思考关键词](https://www.google.com/search?q=/en/docs/claude-code/common-workflows%23use-extended-thinking)来触发扩展思考。

### Frontmatter

命令文件支持 frontmatter，这对于指定命令的元数据很有用：

| Frontmatter | 用途 | 默认值 |
| :--- | :--- | :--- |
| `allowed-tools` | 命令可以使用的工具列表 | 继承自对话 |
| `argument-hint` | 斜杠命令所需的参数。示例: `argument-hint: add [tagId] \| remove [tagId] \| list`。此提示在用户自动完成斜杠命令时显示。 | 无 |
| `description` | 命令的简短描述 | 使用提示的第一行 |
| `model` | 特定模型字符串（请参阅[模型概述](https://www.google.com/search?q=/en/docs/about-claude/models/overview)） | 继承自对话 |

例如：

```markdown
---
allowed-tools: Bash(git add:*), Bash(git status:*), Bash(git commit:*)
argument-hint: [message]
description: Create a git commit
model: claude-3-5-haiku-20241022
---

Create a git commit with message: $ARGUMENTS
```

使用位置参数的示例：

```markdown
---
argument-hint: [pr-number] [priority] [assignee]
description: Review pull request
---

Review PR #$1 with priority $2 and assign to $3.
Focus on security, performance, and code style.
```

**中文**

```markdown
---
argument-hint: [pr-编号] [优先级] [分配人]
description: 审查拉取请求
---

审查拉取请求 #$1，优先级为 $2，并分配给 $3。
重点关注安全性、性能和代码风格。
```

## MCP 斜杠命令

MCP 服务器可以将提示公开为斜杠命令，这些命令在 Claude Code 中可用。这些命令是从连接的 MCP 服务器动态发现的。

### 命令格式

MCP 命令遵循以下模式：

```
/mcp__<server-name>__<prompt-name> [arguments]
```

### 功能

#### 动态发现

MCP 命令在以下情况下自动可用：

  * MCP 服务器已连接并处于活动状态
  * 服务器通过 MCP 协议公开了提示
  * 在连接期间成功检索了提示

#### 参数

MCP 提示可以接受由服务器定义的参数：

```
# 没有参数
> /mcp__github__list_prs

# 有参数
> /mcp__github__pr_review 456
> /mcp__jira__create_issue "Bug title" high
```

#### 命名约定

  * 服务器和提示名称被标准化
  * 空格和特殊字符变为下划线
  * 名称被小写以保持一致性

### 管理 MCP 连接

使用 `/mcp` 命令来：

  * 查看所有已配置的 MCP 服务器
  * 检查连接状态
  * 使用支持 OAuth 的服务器进行身份验证
  * 清除身份验证令牌
  * 查看来自每个服务器的可用工具和提示

### MCP 权限和通配符

配置 [MCP 工具的权限](https://www.google.com/search?q=/en/docs/claude-code/iam%23tool-specific-permission-rules)时，请注意**不支持通配符**：

  * ✅ **正确**：`mcp__github`（批准来自 github 服务器的**所有**工具）
  * ✅ **正确**：`mcp__github__get_issue`（批准特定工具）
  * ❌ **不正确**：`mcp__github__*`（不支持通配符）

要批准来自 MCP 服务器的所有工具，只需使用服务器名称：`mcp__servername`。要仅批准特定工具，请单独列出每个工具。

## 另请参阅

  * [身份和访问管理](https://www.google.com/search?q=/en/docs/claude-code/iam) - 权限的完整指南，包括 MCP 工具权限
  * [交互模式](https://www.google.com/search?q=/en/docs/claude-code/interactive-mode) - 快捷方式、输入模式和交互功能
  * [CLI 参考](https://www.google.com/search?q=/en/docs/claude-code/cli-reference) - 命令行标志和选项
  * [设置](https://www.google.com/search?q=/en/docs/claude-code/settings) - 配置选项
  * [内存管理](https://www.google.com/search?q=/en/docs/claude-code/memory) - 管理跨会话的 Claude 内存
