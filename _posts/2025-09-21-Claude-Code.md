---
layout: single
title:  "Claude Code"
date:   2025-09-21 08:00:00 +0800
categories: ClaudeCode Agent
tags: [ClaudeCode, Agent, Claude, CLI]
---

<!--more-->

## Claude Code 能为您的项目提供全流程协助

![](/images/2025/ClaudeCode/Development-Workflow.png)

### 📌 计划模式

```
计划模式是指通过只读操作分析代码库来创建计划，非常适合探索代码库、规划复杂更改或安全地审查代码。

​> Analyze the authentication system and suggest improvements
​> 分析身份验证系统并提出改进建议。

​> I need to refactor our authentication system to use OAuth2. Create a detailed migration plan.
​> 我需要重构我们的身份验证系统以使用 OAuth2。创建一个详细的迁移计划。

  ​> What about backward compatibility?
  ​> 向后兼容性怎么办？

  ​> How should we handle database migration?
  ​> 我们应该如何处理数据库迁移？
```

### 探索代码库

```
give me an overview of this codebase
给我这个代码库的概览。

what does this project do?
这个项目是做什么的？

what technologies does this project use?
这个项目使用了什么技术？

where is the main entry point?
主入口点在哪里？

explain the folder structure
解释一下文件夹结构。

explain the main architecture patterns used here
解释一下这里使用的主要架构模式。

what are the key data models?
关键数据模型是什么？

how is authentication handled?
身份验证是如何处理的？

analyze the database schema
分析数据库架构。

build a dashboard showing products that are most frequently returned by our UK customers
构建一个仪表板，显示我们英国客户退货最频繁的产品。
```

```
 💡 提示：

    🔹 从宽泛的问题开始，然后缩小到特定领域
    🔹 询问项目中使用的编码约定和模式
    🔹 请求项目特定术语的词汇表
```

### 查找代码

```
find the files that handle user authentication
找到处理用户身份验证的文件。

how do these authentication files work together?
这些身份验证文件如何协同工作？

trace the login process from front-end to database
追踪从前端到数据库的登录过程。
```

```
💡 提示：

    🔹 对您要查找的内容要具体
    🔹 使用项目中的领域语言
```

### 添加功能

```
add input validation to the user registration form
在用户注册表单中添加输入验证。
```

### 复杂任务分解

```
1. create a new database table for user profiles
1. 为用户个人资料创建一个新的数据库表

2. create an API endpoint to get and update user profiles
2. 创建一个用于获取和更新用户个人资料的 API 端点

3. build a webpage that allows users to see and edit their information
3. 构建一个允许用户查看和编辑其信息的网页
```

### 修改错误

```
I'm seeing an error when I run npm test
我运行 npm test 时看到了一个错误。

suggest a few ways to fix the @ts-ignore in user.ts
提几种方法来修复 user.ts 中的 @ts-ignore。

update user.ts to add the null check you suggested
更新 user.ts 以添加你建议的空值检查。

there's a bug where users can submit empty forms - fix it
有一个用户可以提交空表单的错误——修复它。
```

```
💡 提示：

    🔹 告诉 Claude 重现问题的命令并获取堆栈跟踪
    🔹 提及重现错误的任何步骤
    🔹 让 Claude 知道错误是间歇性的还是一致的
```

```
💡 提示：

❌ fix the bug
    修复这个 bug

👍 fix the login bug where users see a blank screen after entering wrong credentials
    修复用户输入错误凭据后看到空白屏幕的登录 bug。
```

### 重构代码

```
find deprecated API usage in our codebase
在我们的代码库中找到已弃用的 API 用法。

suggest how to refactor utils.js to use modern JavaScript features
建议如何重构 utils.js 以使用现代 JavaScript 特性。

refactor utils.js to use ES2024 features while maintaining the same behavior
在保持相同行为的同时，重构 utils.js 以使用 ES2024 特性。

run tests for the refactored code
对重构后的代码运行测试。
```

```
💡 提示：

    🔹 让 Claude 解释现代方法的好处
    🔹 在需要时请求更改保持向后兼容性
    🔹 以小的、可测试的增量进行重构
```

### 处理测试

```
find functions in NotificationsService.swift that are not covered by tests
找到 NotificationsService.swift 中没有被测试覆盖的函数。

add tests for the notification service
为通知服务添加测试。

add test cases for edge conditions in the notification service
为通知服务中的边缘条件添加测试用例。

run the new tests and fix any failures
运行新测试并修复任何失败。
```

```
💡 提示：

    🔹 请求涵盖边缘情况和错误条件的测试
    🔹 在适当时请求单元测试和集成测试
    🔹 让 Claude 解释测试策略
```

### 处理文档

```
find functions without proper JSDoc comments in the auth module
找到 auth 模块中没有正确 JSDoc 注释的函数。

add JSDoc comments to the undocumented functions in auth.js
为 auth.js 中没有文档的函数添加 JSDoc 注释。

improve the generated documentation with more context and examples
通过添加更多上下文和示例来改进生成的文档。

check if the documentation follows our project standards
检查文档是否符合我们的项目标准。
```

```
💡 提示：

    🔹 指定您想要的文档样式（JSDoc、docstrings 等）
    🔹 在文档中请求示例
    🔹 为公共 API、接口和复杂逻辑请求文档
```

### 处理图像

```
What does this image show?
这张图片显示了什么？

Describe the UI elements in this screenshot
描述一下这张截图中的用户界面元素。

Are there any problematic elements in this diagram?
这张图中有任何有问题的元素吗？

Here's a screenshot of the error. What's causing it?
这是一张错误的截图。是什么原因导致的？

This is our current database schema. How should we modify it for the new feature?
这是我们当前的数据库架构。为了新功能我们应该如何修改它？

Generate CSS to match this design mockup
生成与这个设计模型相匹配的 CSS。

What HTML structure would recreate this component?
什么样的 HTML 结构可以重现这个组件？
```

```
💡 提示：

    🔹 当文本描述不清楚或繁琐时使用图像
    🔹 包含错误截图、UI 设计或图表以获得更好的上下文
    🔹 您可以在对话中处理多个图像
    🔹 图像分析适用于图表、截图、模型等
```

### Git 操作

```
What files have I changed?
我改了哪些文件？

commit my changes with a descriptive message
提交我的改动并附上描述性消息。

create a new branch called feature/quickstart
创建一个名为 feature/quickstart 的新分支。

show me the last 5 commits
给我看最近的5个提交。

help me resolve merge conflicts
帮我解决合并冲突。
```

### 拉取请求（PR）

```
summarize the changes I've made to the authentication module
总结一下我对身份验证模块所做的更改。

create a pr
创建一个 PR。

enhance the PR description with more context about the security improvements
在 PR 描述中添加更多关于安全改进的背景信息。

add information about how these changes were tested
添加有关如何测试这些更改的信息。
```

```
💡 提示：

    🔹 直接让 Claude 为您创建 PR
    🔹 在提交之前审查 Claude 生成的 PR
    🔹 让 Claude 突出潜在风险或考虑因素
```

### 使用子代理（subagent）

```
🔹 自动使用子代理
review my recent code changes for security issues
审查我最近的代码更改是否存在安全问题。

run all tests and fix any failures
运行所有测试并修复所有失败。

🔹 明确请求特定子代理
use the code-reviewer subagent to check the auth module
使用代码审查子代理检查 auth 模块。

have the debugger subagent investigate why users can't log in
让调试器子代理调查为什么用户无法登录。
```

### 引用文件和目录

```
🔹 这将文件的完整内容包含在对话中。
Explain the logic in @src/utils/auth.js
解释一下 @src/utils/auth.js 中的逻辑。

🔹 这提供带有文件信息的目录列表。
What's the structure of @src/components?
@src/components 的结构是怎样的？

🔹 使用格式 @server:resource 从连接的 MCP 服务器获取数据。
Show me the data from @github:repos/owner/repo/issues
给我看看来自 @github:repos/owner/repo/issues 的数据。
```

### 使用扩展思考（think）

```
I need to implement a new authentication system using OAuth2 for our API. Think deeply about the best approach for implementing this in our codebase.
我需要为我们的 API 实现一个使用 OAuth2 的新身份验证系统。深入思考在我们的代码库中实现此功能的最佳方法。

think about potential security vulnerabilities in this approach
思考这种方法中潜在的安全漏洞。

keep thinking about edge cases we should handle
继续思考我们应该处理的边缘情况。
```


## Claude Code 上下文工程

![](/images/2025/ClaudeCode/Context-Engineering.png)


## 参考资料
- [Claude Code](https://www.anthropic.com/claude-code)
- [Peeking Under the Hood of Claude Code](https://medium.com/@outsightai/peeking-under-the-hood-of-claude-code-70f5a94a9a62)
- [claude-code-prompt.txt](https://gist.github.com/agokrani/919b536246dd272a55157c21d46eda14)
- [Claude System Prompts](https://docs.claude.com/en/release-notes/system-prompts)
- [Anthropic courses](https://anthropic.skilljar.com/)
- [Writing effective tools for agents — with agents](https://www.anthropic.com/engineering/writing-tools-for-agents)
- [Claude Cookbooks](https://github.com/anthropics/claude-cookbooks)
