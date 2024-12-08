---
layout: post
title:  "GitHub Copilot in VS Code"
date:   2024-12-01 10:00:00 +0800
categories: GitHubCopilot AICodingAssistant
tags: [GitHubCopilot, VSCode]
---

## GitHub Copilot

`GitHub Copilot` 你的 AI 编程伙伴，助你更快、更智能地编写代码。

### UI 设计
#### Command Center

![](/images/2024/GitHubCopilot/copilot-chat-menu-command-center.png)

#### Inline Chat

![](/images/2024/GitHubCopilot/inline-chat-css-variables.png)

#### Chat View

![](/images/2024/GitHubCopilot/copilot-chat-view.png)

- Conversation History

![](/images/2024/GitHubCopilot/chat-view-history.png)

#### Quick Chat

![](/images/2024/GitHubCopilot/quick-chat-dropdown.png)

#### Copilot Edits

![](/images/2024/GitHubCopilot/copilot-edits-view-welcome.png)

#### Terminal Inline Chat

![](/images/2024/GitHubCopilot/terminal-chat-2.png)

### 支持的 IDE
- Visual Studio
- Visual Studio Code
- JetBrains IDEs
- Xcode
- Vim/Neovim
- Azure Data Studio
- Web browser(GitHub website)
- Windows Terminal
- GitHub Mobile


## 交互方式
### Code Completions（代码完成）

Copilot 会在你输入时建议代码行，并为函数签名提供多行建议。注释中的提示会根据你期望的结果、逻辑和步骤提供具体的建议。

1. 代码行建议
2. 函数签名建议
3. 注释中的提示

![](/images/2024/GitHubCopilot/code-completions.png)

您可能不想接受 GitHub Copilot 的整个建议。您可以使用 `⌘→` 键盘快捷键来接受建议的下一个单词或下一行。


### Inline Chat

Inline Chat 使您能够直接从编辑器与 Copilot 进行聊天对话，而无需离开您的工作上下文。使用 Inline Chat，您可以在代码中就地预览代码建议，这对于快速迭代代码更改非常有用。

![](/images/2024/GitHubCopilot/inline-chat-css-variables.png)

### Chat View

Chat 视图使您可以在单独的视图中与 Copilot 进行聊天对话。默认情况下，Chat 视图位于辅助侧边栏中。辅助侧边栏始终位于主侧边栏的对面，因此您可以同时打开 Chat 视图和资源管理器、源代码控制或主侧边栏中的其他视图。

![](/images/2024/GitHubCopilot/copilot-chat-view.png)

### Copilot Edits（Copilot 编辑）

根据您的提示，Copilot Edits 提出跨工作区多个文件的代码更改。这些编辑直接应用于编辑器中，因此您可以快速在原地审查它们，同时具有周围代码的完整上下文。

Copilot Edits 非常适合在多个文件上迭代大型更改。它将 Copilot Chat 的对话流程和 Inline Chat 的快速反馈结合在一个体验中。在一侧进行持续的多轮聊天对话，同时受益于内联代码建议。

![](/images/2024/GitHubCopilot/copilot-edits-view-welcome.png)

#### Working Set（工作集）

开始编辑会话时的第一步是添加要处理的相关文件。这些文件也称为编辑会话的工作集。Copilot Edits 不会在工作集之外进行更改，除非建议创建新文件。
- 工作集当前限制为 10 个文件。
- Copilot Edits 会自动将打开的编辑器添加到工作集。
- 要快速从快速选择中选择多个项目，请使用 Up 和 Down 键导航列表，使用 Right 键将项目添加为上下文，然后重复此操作以选择其他项目。
- 您可以通过选择“`Add Files...`（添加文件）”按钮或 📎 图标（`⌘/`）将文件添加到工作集，然后在快速选择中选择文件。
- 您还可以通过将文件或编辑器选项卡拖放到 Copilot Edits 视图上，将文件添加到工作集。
- 为了帮助 Copilot Edits 提供更好的代码建议，您可以向提示添加相关上下文，例如 `#selection` 或 `#terminalSelection`。通过键入 `#` 符号或使用 Attach Context control （`⌘/`） 引用上下文。
- 您还可以通过使用 `#` 作为文件建议的 IntelliSense 触发器，在提示中添加文件引用。如果 Copilot 决定更改您在提示中提到的文件，它们会自动添加到您的工作集中。
- Copilot 编辑限制为每 10 分钟 7 个编辑请求。


### 不同聊天界面的比较

| Capability（能力） | Copilot Edits | Chat view | Inline Chat | Quick Chat |
| --- | --- | --- | --- | --- |
| Multi-file edits（多文件编辑）                  | ✅ |  |    |  |
| Multi-file code suggestions（多文件的代码建议） | ✅ | ✅ |   | ✅ |
| Preview code edits（预览代码编辑）              | ✅ |   | ✅ |   |
| Code review flow（代码审查流程）                | ✅ |   |    |   |
| Roll back changes（回滚更改）                   | ✅ |   |    |   |
| Attach context（附加上下文）                    | ✅ | ✅ | ✅ | ✅ |
| Use participants & commands（使用参与者和命令）  |   | ✅ |   | ✅ |
| Generate shell commands（生成 shell 命令）      |   | ✅ |   | ✅ |
| General-purpose chat（通用聊天）                |   | ✅ | ✅ | ✅ |
| Chat history（聊天记录）                        |   | ✅ |   |   |


## 提升效率的功能
### Chat Participants（聊天参与者）

聊天参与者旨在收集关于代码库或特定领域或技术的额外上下文。通过使用适当的参与者，Copilot Chat 可以找到并提供更好的信息以发送到 Copilot 后端。例如，如果您想询问有关您打开的项目的问题，请使用 @workspace，或者要了解有关 VS Code 功能和 API 的更多信息，请使用 @vscode。

![](/images/2024/GitHubCopilot/agent-example.png)

每个聊天参与者都有自己的领域专业知识。在聊天视图中选择 `＠` 图标或只需键入 `@` 即可获取可用聊天参与者的列表。

![](/images/2024/GitHubCopilot/copilot-chat-view-participants.png)

> 可以通过扩展来提供聊天参与者，因此列表可能会根据您在 VS Code 中安装的扩展而有所不同。

以下拥有专业知识并能执行操作的参与者聊天（内建）:
- `@workspace` - 询问工作区
    - `/explain` - 说明活动编辑器中代码的工作原理
    - `/tests` - 为所选代码生成单元测试
    - `/fix` - 对所选代码中的问题提出修复建议
    - `/new` - 工作区中的新文件或项目的基架代码
    - `/newNotebook` - 创建新 Jupyter Notebook
    - `/fixTestFailure` - 针对失败的测试建议修补程序
    - `/setupTests` - 在项目中设置测试(实验性)
- `@vscode` - 询问有关 VS Code 的问题
    - `/search` - 为工作区搜索生成查询参数
    - `/runCommand` - 搜索并执行 VS Code 中的命令
    - `/startDebugging` - 生成启动配置并在 VS Code 中开始调试(实验性)
- `@terminal` - 询问如何在终端中执行某项操作
    - `/explain` - 解释终端中的内容

参考资料
- [关于生成 Copilot 扩展](https://docs.github.com/zh/copilot/building-copilot-extensions/about-building-copilot-extensions)
- [VS Code 中的 GitHub Copilot 扩展性](https://code.visualstudio.com/docs/copilot/copilot-extensibility-overview)
- [Marketplace 中的聊天参与者扩展](https://marketplace.visualstudio.com/search?term=tag%3Achat-participant&target=VSCode&category=All%20categories&sortBy=Relevance)
- [Best practices for using GitHub Copilot in VS Code](https://code.visualstudio.com/docs/copilot/prompt-crafting)

### Slash Commands（斜杠命令）

聊天参与者可以通过使用*斜杠命令*提供特定功能的快捷方式。这些命令提供了一种简洁和结构化的方式来与聊天参与者进行交互，并向他们提供指令。您可以通过在聊天提示中键入参与者，然后键入 `/` 和命令名称来引用斜杠命令。

斜杠命令帮助 Copilot Chat 理解您提出问题时的意图。您是在了解代码库（`/explain`），还是想要帮助解决问题（`/fix`），或者正在创建测试用例（`/tests`）？通过让 Copilot Chat 知道您要做什么，它可以调整回复以适应您的任务，并提供有用的命令、设置和代码片段。

![](/images/2024/GitHubCopilot/inline-chat-slash-commands.png)

例如，`@workspace` 参与者有一个斜杠命令 `/new`，用于创建新的工作区或新文件。在聊天输入字段中键入 `@workspace /new Node.js Express Pug TypeScript` 将创建一个带有 Node.js Express Pug TypeScript 项目的新工作区。

- `/clear`: 开始新的聊天会话
- `/help`: 获取有关使用 GitHub Copilot 的帮助
- `@workspace /explain`（或 `/explain`）: 解释所选代码的工作原理
- `@workspace /fix`（或 `/fix`）: 为所选代码中的问题提出修复建议
- `@workspace /new`（或 `/new`）: 为新工作区或新文件搭建代码
- `@vscode /runCommand`: 搜索或运行 VS Code 命令

> 您可以使用自然语言查询写出您的项目范围或当前任务，但使用聊天参与者和斜杠命令更简洁、更明确。

### Chat Variables（聊天变量）

通过使用聊天变量，您可以更具体地说明聊天提示中包含的上下文。

在聊天视图中，您可以使用 `#` 符号来引用上下文。这些上下文可以是文件、选择或终端。通过键入 `#` 符号或选择 `📎` 图标使用 **Attach Context** 控件（`⌘/`）引用上下文。

![](/images/2024/GitHubCopilot/copilot-chat-view-attach-context.png)

可以通过使用以下聊天变量提供额外的上下文来帮助我理解你的问题:
- `#selection` - The current selection in the active editor
- `#codebase` - 搜索代码库并提取查询的相关信息。
- `#editor` - 活动编辑器中的可见源代码
- `#terminalLastCommand` - 活动终端的上次运行命令
- `#terminalSelection` - 活动终端的选择
- `#file` - 选择工作区中的文件


## Workspace indexing（工作区索引）

`构建本地工作区索引` 命令允许您显式启动当前工作区的索引。通常，第一次询问 `@workspace` 问题时会自动启动此索引。该命令还支持较大的工作区索引，目前最多可达 2000 个文件（不包括被忽略的文件，例如 `node_modules` 或 `out` 目录）。

在构建索引时，我们现在还在状态栏中显示一个进度项：

![](/images/2024/GitHubCopilot/copilot-workspace-ui-progress.png)

### `@workspace` 使用哪些源来获取上下文？

为了回答您的问题，`@workspace` 会搜索开发人员在 VS Code 中导航代码库时使用的相同源：
- 工作区中的所有文件，但被 `.gitignore` 文件忽略的文件除外。
- 具有嵌套文件夹和文件名的目录结构
- GitHub 的代码搜索索引（如果工作区是 GitHub 存储库并由代码搜索编制索引）
- 工作区中的符号和定义
- 当前选定的文本或活动编辑器中的可见文本
- 如果你打开了一个文件或在被忽略的文件中选择了文本，则 `.gitignore` 会被绕过

### `@workspace` 如何找到最相关的上下文？

您的完整 VS Code 工作区可能太大，无法完全传递给 GitHub Copilot 以回答您的聊天提示。相反，@workspace 从不同的上下文来源中提取最相关的信息，以确定 Copilot 的答案。

- 首先，@workspace 确定回答您的问题需要哪些信息，还包括`对话历史记录`、`工作区结构`和`当前选择的代码`。

- 接下来，它使用不同的方法收集上下文，例如通过本地搜索或使用 [GitHub 的代码搜索](https://github.blog/2023-02-06-the-technology-behind-githubs-new-code-search)找到相关代码片段，并使用 VS Code's language IntelliSense（语言智能感知）添加详细信息，例如函数签名、参数等。

- 最后，GitHub Copilot 使用此上下文回答您的问题。如果上下文太大，只使用上下文的最相关部分。**响应**中使用`文件`、`文件范围`和`符号`的引用进行标记。*这使您可以直接从聊天响应链接到代码库中的相应信息*。提供给 Copilot 的代码片段在响应中列为引用。

### `@workspace` 斜杠命令的上下文

`@workspace` 提供了几个斜杠命令，作为**常用任务的简写**，节省您的时间和输入工作。每个命令都定义了自己的优化上下文，通常消除了额外提示或聊天变量的需要。以下是可用的斜杠命令及其上下文：

| Command | Context |
| --- | --- |
| `/explain` | 从活动编辑器中的文本选择（#selection）开始。为了优化 Copilot 的聊天响应，请确保扩展文本选择，以包括任何有助于 Copilot 提供有用响应的相关信息。<br/> 查找引用符号（如函数和类）的实现，从而获得更准确和有用的解释。 |
| `/tests` | 活动编辑器中的当前文本选择。如果没有选择文本，请使用当前活动文件的内容。<br/> 相关的现有测试文件，以了解现有测试和最佳实践。 |
| `/fix` | 活动编辑器中的当前文本选择。如果没有选择文本，请使用编辑器中当前可见的文本。<br/> 错误和引用的符号，以了解需要修复的内容以及如何修复。 |
| `/new `| 仅使用聊天提示作为上下文。 |
| `/newNotebook` | 仅使用聊天提示作为上下文。 |

您可以通过在聊天提示中使用聊天变量（例如 `#editor`、`#selection` 或 `#file`）来明确扩展上下文。例如，要根据另一个文件中的模式修复当前文件中的错误，请使用此聊天提示：`@workspace /fix 样式错误的 #file:form.ts`。

> 不要期望对您的代码库进行全面的代码分析，例如“这个函数被调用了多少次？”或“纠正这个项目中的所有错误”。


## [GitHub 代码搜索](https://github.blog/engineering/the-technology-behind-githubs-new-code-search/)

可以搜索近 4500 万个 GitHub 存储库，代表 115 TB 的代码和 155 亿个文档。

### 倒排索引（ngram）

对于代码搜索，我们需要一种特殊类型的倒排索引，称为 [ngram](https://en.wikipedia.org/wiki/N-gram) 索引，用于查找内容的子字符串。ngram 是长度为 n 的字符序列。例如，如果我们选择 n=3（三元组），则构成内容“limits”的 ngram 是 `lim`、`imi`、`mit`、`its`。对于上面的文档，这些三元组的索引如下：

| ngram | Doc IDs (postings) |
| --- | --- |
| lim | 1, 2, … |
| imi | 2, … |
| mit | 1, 2, 3, … |
| its | 2, 3, … |
