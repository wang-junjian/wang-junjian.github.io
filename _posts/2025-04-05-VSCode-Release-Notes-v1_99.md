---
layout: post
title:  "Visual Studio Code 2025年3月版本(1.99)的新功能"
date:   2025-04-05 12:00:00 +0800
categories: VSCode GitHubCopilot
tags: [VSCode, GitHubCopilot, ReleaseNotes]
---

欢迎使用Visual Studio Code 2025年3月版本。此版本包含许多更新，我们希望您会喜欢，一些主要亮点包括：

* **代理模式**
  * 代理模式现已在VS Code稳定版中可用。通过设置`setting(chat.agent.enabled:true)`启用（[更多...](#代理模式在-vs-code-稳定版中可用)）。
  * 通过模型上下文协议(MCP)服务器工具扩展代理模式（[更多...](#模型上下文协议服务器支持)）。
  * 尝试代理模式中的新内置工具，用于获取网页内容、查找符号引用和深度思考（[更多...](#代理模式工具)）。

* **代码编辑**
  * 下一步编辑建议现已正式发布（[更多...](#下一步编辑建议正式发布)）。
  * 在编辑器中应用AI编辑时减少诊断事件等干扰（[更多...](#ai-编辑改进)）。

* **聊天**
  * 在聊天中使用自己的API密钥访问更多语言模型（预览版）（[更多...](#自带密钥-byok-预览版)）。
  * 从统一的聊天体验中轻松切换问答、编辑和代理模式（[更多...](#统一聊天体验)）。
  * 通过即时远程工作区索引体验提高工作区搜索速度和准确性（[更多...](#使用即时索引实现更快的工作区搜索)）。

* **笔记本编辑**
  * 借助编辑和代理模式的支持，像编辑代码文件一样轻松创建和编辑笔记本（[更多...](#ai-笔记本编辑改进)）。

>如果您想在线阅读这些发布说明，请前往[code.visualstudio.com](https://code.visualstudio.com)上的[更新](https://code.visualstudio.com/updates)页面。
**Insiders版本：** 想尽快尝试新功能吗？您可以下载每晚构建的[Insiders](https://code.visualstudio.com/insiders)版本，并在功能可用后立即尝试最新更新。

## 聊天

### 代理模式在 VS Code 稳定版中可用

**设置**：`setting(chat.agent.enabled:true)`

我们很高兴地宣布代理模式现已在VS Code稳定版中可用！通过设置`setting(chat.agent.enabled:true)`启用。在接下来的几周内，我们将为所有用户默认启用此设置，届时将不再需要手动启用。

查看[代理模式文档](https://code.visualstudio.com/docs/copilot/chat/chat-agent-mode)或在聊天视图中从聊天模式选择器中选择代理模式。

![显示聊天视图的截图，突出显示在聊天模式选择器中选择的代理模式。](https://code.visualstudio.com/assets/updates/1_99/copilot-edits-agent-mode.png)

### 模型上下文协议服务器支持

此版本在代理模式下支持[模型上下文协议](https://modelcontextprotocol.io/)(MCP)服务器。MCP提供了一种标准化方法，使AI模型能够发现并与外部工具、应用程序和数据源进行交互。当您在VS Code中使用代理模式输入聊天提示时，模型可以调用各种工具来执行文件操作、访问数据库或检索网页数据等任务。这种集成使编码辅助更加动态和上下文感知。

MCP服务器可以在用户、远程或`.code-workspace`设置中的`mcp`部分下配置，或者在工作区的`.vscode/mcp.json`中配置。配置支持输入变量以避免硬编码机密和常量。例如，您可以使用`${env:API_KEY}`引用环境变量或使用`${input:ENDPOINT}`在服务器启动时提示输入值。

您可以使用**MCP: 添加服务器**命令从命令行调用快速设置MCP服务器，或使用AI辅助设置从Docker、npm或PyPI发布的MCP服务器。

添加新的MCP服务器时，聊天视图中会显示刷新操作，可用于启动服务器并发现工具。之后，服务器将按需启动以节省资源。

<video src="https://code.visualstudio.com/assets/updates/1_99/mcp.mp4" title="显示在聊天中使用Github MCP工具的视频。" autoplay loop controls muted></video>
_主题：[Codesong](https://marketplace.visualstudio.com/items?itemName=connor4312.codesong)（在[vscode.dev](https://vscode.dev/editor/theme/connor4312.codesong)上预览）_

如果您已经在Claude Desktop等其他应用程序中使用MCP服务器，VS Code将发现这些服务器并提供为您运行它们的选项。您可以通过设置`setting(chat.mcp.discovery.enabled)`切换此行为。

您可以使用**MCP: 列出服务器**命令查看MCP服务器列表及其当前状态，并使用代理模式中的**选择工具**按钮选择可在聊天中使用的工具。

您可以在[我们的文档](https://code.visualstudio.com/docs/copilot/chat/mcp-servers)中了解有关如何安装和使用MCP服务器的更多信息。

### 代理模式工具

在这个里程碑中，我们为代理模式添加了几个新的内置工具。

#### 思考工具（实验性）

**设置**：`setting(github.copilot.chat.agent.thinkingTool:true)`

受[Anthropic研究](https://www.anthropic.com/engineering/claude-think-tool)的启发，我们在代理模式中添加了对思考工具的支持，可用于给任何模型提供工具调用之间的思考机会。这提高了我们的代理在产品内和[SWE-bench](https://www.swebench.com/)评估上处理复杂任务的性能。

#### 获取工具

使用`#fetch`工具将公开访问网页的内容包含在您的提示中。例如，如果您想包含有关某个主题（如[MCP](#模型上下文协议服务器支持)）的最新文档，您可以请求获取[完整文档](https://modelcontextprotocol.io/llms-full.txt)（这对LLM消费非常方便）并在提示中使用。以下是可能的样子：

<video src="https://code.visualstudio.com/assets/updates/1_99/fetch.mp4" title="显示使用获取工具获取模型上下文协议文档的视频。" autoplay loop controls muted></video>

在代理模式下，此工具会自动被选中，但您也可以在其他模式下通过`#fetch`以及您要获取的URL显式引用它。

此工具通过在无头浏览器窗口中渲染网页工作，该窗口中的页面数据在本地缓存，因此您可以自由地要求模型一次又一次地获取内容，而无需重新渲染的开销。

请告诉我们您如何使用`#fetch`工具，以及您希望它具有哪些功能！

**获取工具限制：**

* 目前，JavaScript在此浏览器窗口中被禁用。如果网站完全依赖JavaScript来渲染内容，该工具将无法获取太多上下文。这是一个我们正在考虑更改的限制，并可能会更改以允许JavaScript。
* 由于无头的特性，我们无法获取位于身份验证后面的页面，因为这个无头浏览器存在于与您使用的浏览器不同的浏览器上下文中。相反，请考虑使用[MCP](#模型上下文协议服务器支持)引入专为该目标构建的MCP服务器，或通用浏览器MCP服务器，如[Playwright MCP服务器](https://github.com/microsoft/playwright-mcp)。

#### 使用工具

`#usages`工具是"查找所有引用"、"查找实现"和"转到定义"的组合。此工具可以帮助聊天了解有关函数、类或接口的更多信息。例如，聊天可以使用此工具查找接口的示例实现或在进行重构时查找需要更改的所有位置。

在代理模式下，此工具将自动被选中，但您也可以通过`#usages`显式引用它。

### 使用代理模式创建新工作区（实验性）

**设置**：`setting(github.copilot.chat.newWorkspaceCreation.enabled)`

现在您可以在[代理模式](https://code.visualstudio.com/docs/copilot/chat/chat-agent-mode)中搭建新的VS Code工作区。无论是设置VS Code扩展、MCP服务器还是其他开发环境，代理模式都可以帮助您初始化、配置和启动这些项目，并具备必要的依赖项和设置。

<video src="https://code.visualstudio.com/assets/updates/1_99/new-workspace-demo.mp4" title="视频展示使用代理模式创建一个新的MCP服务器，用于从hacker news获取热门故事。" autoplay loop controls muted></video>

### 代理模式中的VS Code扩展工具

几个月前，我们完成了[语言模型工具](https://code.visualstudio.com/api/extension-guides/tools#create-a-language-model-tool)的扩展API，由VS Code扩展提供。现在，您可以在代理模式中使用这些工具。

任何在其配置中设置了`toolReferenceName`和`canBeReferencedInPrompt`的工具都会自动在代理模式中可用。

通过在扩展中提供工具，它可以访问完整的VS Code扩展API，并且可以通过扩展市场轻松安装。

与来自MCP服务器的工具类似，您可以通过代理模式中的**选择工具**按钮启用和禁用这些工具。查看我们的[语言模型工具扩展指南](https://code.visualstudio.com/api/extension-guides/tools#create-a-language-model-tool)来构建您自己的工具！

### 代理模式工具审批

作为完成用户提示任务的一部分，代理模式可以运行工具和终端命令。这很强大但可能带来风险。因此，您需要在代理模式中批准工具和终端命令的使用。

为了优化此体验，您现在可以在会话、工作区或应用程序级别上记住该批准。目前终端工具尚未启用此功能，但我们计划在未来版本中为终端开发审批系统。

![显示代理模式工具继续按钮下拉选项的截图，用于记住批准。](https://code.visualstudio.com/assets/updates/1_99/chat-tool-approval.png)

如果您想自动批准_所有_工具，可以使用实验性的`setting(chat.tools.autoApprove:true)`设置。这将自动批准所有工具，VS Code不会在语言模型希望运行工具时要求确认。请注意，启用此设置后，您将没有机会取消模型可能要采取的潜在破坏性操作。

我们计划在未来扩展此设置，使其具有更细粒度的功能。

### SWE-bench上的代理评估

VS Code的代理在使用Claude 3.7 Sonnet的`swebench-verified`上实现了56.0%的通过率，遵循Anthropic的[研究](https://www.anthropic.com/engineering/swe-bench-sonnet)，配置代理在SWE-bench环境中无需用户输入即可执行。我们的实验已转化为改进的提示、工具描述和代理模式的工具设计，包括新的文件编辑工具，适用于Claude 3.5和3.7 Sonnet模型。

### 统一聊天视图

在过去几个月中，我们有一个用于向语言模型提问的"聊天"视图，以及一个用于AI驱动代码编辑会话的"Copilot编辑"视图。这个月，我们旨在通过将两个视图合并为一个聊天视图来简化基于聊天的体验。在聊天视图中，您将看到一个包含三种模式的下拉列表：

![显示聊天视图中聊天模式选择器的截图。](https://code.visualstudio.com/assets/updates/1_99/chat-modes.png)

- **[问答](https://code.visualstudio.com/docs/copilot/chat/chat-ask-mode)**：这与之前的聊天视图相同。使用任何模型询问有关您的工作区或一般编码的问题。使用`@`调用内置聊天参与者或来自已安装[扩展](https://marketplace.visualstudio.com/search?term=chat-participant&target=VSCode&category=All%20categories&sortBy=Relevance)的参与者。使用`#`手动附加任何类型的上下文。
- **[代理](https://code.visualstudio.com/docs/copilot/chat/chat-agent-mode)**：启动具有一组工具的代理式编码流程，这些工具使其能够自主收集上下文、运行终端命令或采取其他操作来完成任务。代理模式已为所有[VS Code Insiders](https://code.visualstudio.com/insiders/)用户启用，我们正在将其推广到VS Code稳定版中的更多用户。
- **[编辑](https://code.visualstudio.com/docs/copilot/chat/copilot-edits)**：在编辑模式下，模型可以对多个文件进行定向编辑。附加`#codebase`让它自动查找要编辑的文件。但它不会自动运行终端命令或做其他任何事情。

> **注意**：如果您在此列表中没有看到代理模式，那么要么它尚未为您启用，要么它被组织政策禁用，需要由[组织所有者](https://aka.ms/github-copilot-org-enable-features)启用。

除了简化您的聊天体验外，这种统一还为AI驱动的代码编辑启用了一些新功能：

- **在对话中间切换模式**：例如，您可能首先在问答模式中头脑风暴应用程序想法，然后切换到代理模式执行计划。提示：按`kb(workbench.action.chat.toggleAgentMode)`快速更改模式。
- **历史记录中的编辑会话**：使用**显示聊天**命令（聊天视图顶部的时钟图标）恢复过去的编辑会话并继续处理它们。
- **将聊天移动到编辑器或窗口**：选择**在新编辑器/新窗口中打开聊天**，将您的聊天对话从侧边栏弹出到新的编辑器选项卡或单独的VS Code窗口中。聊天很长时间以来一直支持这一点，但现在您也可以从编辑器窗格或单独的窗口运行编辑/代理会话。
- **多个代理会话**：根据上面的要点，这意味着您甚至可以同时运行多个代理会话。您可能希望有一个代理模式的聊天负责实现功能，而另一个独立的会话用于研究和使用其他工具。不建议指导两个代理会话同时编辑文件，这可能导致混淆。

### 自带密钥 (BYOK)（预览版）

Copilot Pro和Copilot Free用户现在可以为Azure、Anthropic、Gemini、Open AI、Ollama和Open Router等流行提供商使用自己的API密钥。这允许您在新模型发布的第一天就使用Copilot原生不支持的新模型。

要尝试，请从模型选择器中选择**管理模型...**。我们正在积极探索支持Copilot Business和Enterprise客户，并将在未来版本中分享更新。要了解有关此功能的更多信息，请前往我们的[文档](https://code.visualstudio.com/docs/copilot/language-models)。

![用户界面中"管理模型 - 预览"下拉菜单的截图。下拉菜单顶部标有"选择提供商"，下面列出了多个选项。选项包括"Anthropic"（以蓝色突出显示）、"Azure"、"Gemini"、"OpenAI"、"Ollama"和"OpenRouter"。"Anthropic"选项旁边显示了一个齿轮图标。](https://code.visualstudio.com/assets/updates/1_99/byok.png)

### 可重用提示文件

#### 改进的配置

**设置**：`setting(chat.promptFilesLocations)`

`setting(chat.promptFilesLocations)`设置现在支持文件路径中的全局模式。例如，要包含当前打开工作区中的所有`.prompt.md`文件，您可以将路径设置为`{ "**": true }`。

此外，配置现在尊重适用文件系统上的大小写敏感性，与主机操作系统的行为保持一致。

#### 改进的提示文件编辑

- 您的`.prompt.md`文件现在提供文件系统路径的基本自动完成，并突出显示有效的文件引用。另一方面，损坏的链接现在显示为警告或错误波浪线，并提供详细的诊断信息。
- 您现在可以使用**聊天：使用提示**命令中提示文件列表内的编辑和删除操作来管理提示。
- 提示文件中的文件夹引用不再标记为无效。
- 现在正确处理Markdown注释，例如，在生成发送给LLM模型的最终提示时，会忽略所有注释掉的链接。

#### 与自定义指令的对齐

`.github/copilot-instructions.md`文件现在的行为与任何其他可重用的`.prompt.md`文件相同，支持嵌套链接解析和增强的语言功能。此外，现在可以引用任何`.prompt.md`文件并适当处理。

了解更多关于[自定义指令](https://code.visualstudio.com/docs/copilot/copilot-customization)的信息。

#### 用户提示

**创建用户提示**命令现在允许创建一种称为_用户提示_的新类型提示。这些提示存储在用户数据文件夹中，可以跨机器同步，类似于代码片段或用户设置。可以在[同步设置](https://code.visualstudio.com/docs/configure/settings-sync)中使用同步资源列表中的**提示**项配置同步。

### 改进的视觉支持（预览版）

上一次迭代，我们为`GPT-4o`启用了Copilot Vision。查看我们的[发布说明](https://code.visualstudio.com/updates/v1_98#_copilot-vision-preview)，了解更多关于如何在聊天中附加和使用图像的信息。

在本次发布中，您可以通过拖放从任何浏览器附加图像。从浏览器拖放的图像必须具有正确的url扩展名，如`.jpg`、`.png`、`.gif`、`.webp`或`.bmp`。

<video src="https://code.visualstudio.com/assets/updates/1_99/image-url-dnd.mp4" title="显示从Chrome拖动图像到聊天面板的视频。" autoplay loop controls muted></video>

## 配置编辑器

### 统一聊天体验

我们已经将VS Code中的聊天体验简化为单一统一的聊天视图。您现在不必在单独的视图之间移动并失去对话上下文，而是可以轻松地在不同的聊天模式之间切换。

![显示聊天视图中聊天模式选择器的截图。](https://code.visualstudio.com/assets/updates/1_99/chat-modes.png)

根据您的场景，使用以下任一模式，并可以自由地在对话中间移动：

- 问答模式：优化用于询问有关您的代码库的问题并头脑风暴想法。
- 编辑模式：优化用于对代码库中的多个文件进行编辑。
- 代理模式：优化用于自主编码流程，结合代码编辑和工具调用。

获取有关[统一聊天视图](#统一聊天体验)的更多详细信息。

### 使用即时索引实现更快的工作区搜索

[远程工作区索引](https://code.visualstudio.com/docs/copilot/reference/workspace-context#remote-index)可加速搜索大型代码库，以查找AI在回答问题和生成编辑时使用的相关代码片段。这些远程索引对于具有数万甚至数十万个文件的大型代码库特别有用。

之前，您必须按下按钮或运行命令来构建和开始使用远程工作区索引。通过我们新的即时索引支持，我们现在会在您首次尝试提出`#codebase`/`@workspace`问题时自动构建远程工作区索引。在大多数情况下，这个远程索引可以在几秒钟内构建完成。构建完成后，您或其他人在VS Code中对该代码库进行的任何代码库搜索都将自动使用远程索引。

请记住，远程工作区索引目前仅适用于存储在GitHub上的代码。要使用远程工作区索引，请确保您的工作区包含具有GitHub远程的git项目。您可以使用[Copilot状态菜单](#copilot-状态菜单)查看当前使用的索引类型：

![在Copilot状态栏菜单中显示工作区索引状态的截图。](https://code.visualstudio.com/assets/updates/1_99/copilot-workspace-index-remote.png)

为了管理负载，我们在接下来的几周内逐步推出即时索引，因此您可能不会立即看到它。当即时索引尚未为您启用时，您仍然可以运行`GitHub Copilot: 构建远程索引命令`命令来开始使用远程索引。

### Copilot 状态菜单

Copilot状态菜单可从状态栏访问，现已为所有用户启用。在这个里程碑中，我们为其添加了一些新功能：

- 随时查看[工作区索引](https://code.visualstudio.com/docs/copilot/reference/workspace-context)状态信息。

    ![在Copilot菜单中显示工作区索引状态的截图。](https://code.visualstudio.com/assets/updates/1_99/copilot-worksspace-index-local-status.png)

- 查看代码完成是否对活动编辑器启用。

    新图标反映状态，因此您可以快速查看代码完成是否启用或禁用。

    ![显示Copilot状态图标的截图，当完成功能被禁用时。](https://code.visualstudio.com/assets/updates/1_99/copilot-disabled-status.png)

- 启用或禁用[代码完成和NES](https://code.visualstudio.com/docs/copilot/ai-powered-suggestions)。

### 开箱即用的Copilot设置（实验性）

**设置**：`setting(chat.setupFromDialog)`

我们正在发布一项实验性功能，以开箱即用方式显示功能性聊天体验。这包括聊天视图、编辑器/终端内联聊天和快速聊天。第一次发送聊天请求时，我们将指导您登录并注册Copilot Free。

<video src="https://code.visualstudio.com/assets/updates/1_99/copilot-ootb.mp4" title="显示开箱即用Copilot的视频。" autoplay loop controls muted></video>

如果您想自己查看此体验，请启用`setting(chat.setupFromDialog)`设置。

### 聊天预发布通道不匹配

如果您在VS Code稳定版中安装了Copilot Chat扩展的预发布版本，新的欢迎屏幕将通知您此配置不受支持。由于聊天功能的快速开发，该扩展将不会在VS Code稳定版中激活。

欢迎屏幕提供了切换到扩展发布版本或下载[VS Code Insiders](https://code.visualstudio.com/insiders/)的选项。

![显示聊天的欢迎视图的截图，表明扩展的预发布版本在VS Code稳定版中不受支持。显示了切换到发布版本的按钮，以及切换到VS Code Insiders的次要链接。](https://code.visualstudio.com/assets/updates/1_99/welcome-pre-release.png)

### 语义文本搜索改进（实验性）

**设置**：`setting(github.copilot.chat.search.semanticTextResults:true)`

AI驱动的语义文本搜索现在在搜索视图中默认启用。使用`kb(search.action.searchWithAI)`键盘快捷键触发语义搜索，它将根据您的查询显示最相关的结果，以及常规搜索结果。

<video src="https://code.visualstudio.com/assets/updates/1_99/semantic-search.mp4" title="显示Visual Studio Code中语义搜索改进的视频。" autoplay loop controls muted></video>

您还可以使用`#searchResults`工具在聊天提示中引用语义搜索结果。这允许您要求LLM总结或解释结果，甚至基于它们生成代码。

<video src="https://code.visualstudio.com/assets/updates/1_99/semantic-search-results.mp4" title="显示在聊天视图中使用搜索结果的视频。" autoplay loop controls muted></video>

### 设置编辑器搜索更新

默认情况下，设置编辑器搜索现在使用我们在上一个版本中引入的键匹配算法。即使设置ID与已知设置完全匹配，它也会显示额外的设置。

<video src="https://code.visualstudio.com/assets/updates/1_99/settings-search-show-extra.mp4" title="显示在设置编辑器中搜索'files.autoSave'和'mcp'的视频，两者都显示多个设置。" autoplay loop controls muted></video>

_主题：[Light Pink](https://marketplace.visualstudio.com/items?itemName=mgwg.light-pink-theme)（在[vscode.dev](https://vscode.dev/editor/theme/mgwg.light-pink-theme)上预览）_

### 窗口控件的新设置（Linux，Windows）

**设置**：`setting(window.controlsStyle)`

如果您已将标题栏样式（`setting(window.titleBarStyle)`）设置为`custom`，现在可以在窗口控件的三种不同样式之间进行选择。

- `native`：这是默认值，根据底层平台渲染窗口控件
- `custom`：如果您更喜欢自定义样式而不是原生样式，则使用自定义样式渲染窗口控件
- `hidden`：如果您想在标题栏中获得一些空间并且是更加以键盘为中心的用户，则完全隐藏窗口控件

## 代码编辑

### 下一步编辑建议正式发布

**设置**：`setting(github.copilot.nextEditSuggestions.enabled:true)`

我们很高兴地宣布下一步编辑建议(NES)正式发布！此外，我们还对NES的整体用户体验进行了多项改进：

* 使编辑建议更加紧凑，减少对周围代码的干扰，并使其更容易一目了然。
* 更新沟槽指示器，确保所有建议更容易被注意到。

<video src="https://code.visualstudio.com/assets/updates/1_99/next-edit-suggestion.mp4" title="显示NES基于用户最近更改提出编辑建议的视频。" autoplay loop controls muted></video>

### AI 编辑改进

我们对使用AI生成编辑进行了一些较小的调整：

* 在使用AI编辑重写文件时，将编辑器外的诊断事件静音。之前，我们已经在这种情况下禁用了波浪线。这些更改减少了问题面板中的闪烁，并确保我们不会为快速修复代码操作发出请求。

* 当您决定保留AI编辑时，我们现在会显式保存文件。

### 基于工具的编辑模式

**设置**：`setting(chat.edits2.enabled:true)`

我们正在改变[聊天中的编辑模式](https://code.visualstudio.com/docs/copilot/chat/copilot-edits)的运作方式。新的编辑模式使用与代理模式相同的方法，让模型调用工具对文件进行编辑。这种方法的好处是使您能够在所有三种模式之间无缝切换，同时大大简化了这些模式在底层的工作方式。

缺点是，这意味着新模式只适用于代理模式可用的同一组有限模型，即支持工具调用并经过测试以确保在涉及工具时能提供良好体验的模型。您可能会注意到编辑模式列表中缺少`o3-mini`和`Claude 3.7 (Thinking)`等模型。如果您想继续使用这些模型进行编辑，请禁用`setting(chat.edits2.enabled)`设置以恢复到以前的编辑模式。切换模式时，系统会要求您清除会话。

我们已经了解到，在使用工具时，通过提示获得跨不同模型的一致结果更加困难，但我们正在努力使这些模型适用于编辑（和代理）模式。

这个设置将在VS Code稳定版中为用户逐步启用。

### 内联建议语法高亮

**设置**：`setting(editor.inlineSuggest.syntaxHighlightingEnabled)`

在此更新中，内联建议的语法高亮现在默认启用。请注意下面的屏幕截图中，代码建议已应用语法着色。

![编辑器的截图，显示为幽灵文本启用了语法高亮。](https://code.visualstudio.com/assets/updates/1_99/inlineSuggestionHighlightingEnabled.png)

如果您更喜欢没有语法高亮的内联建议，可以通过`setting(editor.inlineSuggest.syntaxHighlightingEnabled:false)`禁用它。

![编辑器的截图，显示幽灵文本的高亮显示已关闭。](https://code.visualstudio.com/assets/updates/1_99/inlineSuggestionHighlightingDisabled.png)

### 基于Tree-Sitter的语法高亮（预览）

**设置**：`setting(editor.experimental.preferTreeSitter.css:true)`和`setting(editor.experimental.preferTreeSitter.regex:true)`

在之前使用Tree-Sitter进行语法高亮的工作基础上，我们现在支持CSS文件和TypeScript中正则表达式的实验性基于Tree-Sitter的语法高亮。

## 笔记本

### Jupyter笔记本文档的最低版本为4.5

新笔记本的`nbformat`默认版本已从4.2升级到4.5，这将为笔记本的每个单元格设置`id`字段，以帮助计算差异。您还可以通过在笔记本的原始JSON中将`nbformat_minor`设置为`5`来手动更新现有笔记本。

### AI笔记本编辑改进

AI驱动的笔记本编辑支持（包括代理模式）现已在稳定版中可用。这是上个月作为预览功能添加到[VS Code Insiders](https://code.visualstudio.com/insiders)中的。

您现在可以使用聊天编辑笔记本文件，体验与编辑代码文件相同的直观体验：修改多个单元格的内容，插入和删除单元格，以及更改单元格类型。此功能在处理数据科学或文档笔记本时提供无缝工作流程。

#### 新笔记本工具

VS Code现在提供了一个专用工具，可以直接从聊天中创建新的Jupyter笔记本。此工具基于您的查询计划并创建新笔记本。

在代理模式或编辑模式中使用新的笔记本工具（确保通过`setting(chat.edits2.enabled:true)`启用改进的编辑模式）。如果您使用的是问答模式，可以在聊天提示中键入`/newNotebook`来创建新笔记本。

<video src="https://code.visualstudio.com/assets/updates/1_99/new-notebook-tool-release-notes.mp4" title="显示使用代理模式聊天和新笔记本工具创建新Jupyter笔记本的视频。" autoplay loop controls muted></video>

#### 浏览AI编辑

使用差异工具栏在单元格之间迭代和查看每个AI编辑。

<video src="https://code.visualstudio.com/assets/updates/1_99/navigate-notebook-edits.mp4" title="显示聊天实现TODO任务然后浏览这些更改的视频。" autoplay loop controls muted></video>

#### 撤销AI编辑

当焦点在单元格容器上时，**撤销**命令将在笔记本级别恢复完整的AI更改集。

<video src="https://code.visualstudio.com/assets/updates/1_99/undo-copilot-notebook-edits.mp4" title="显示聊天对笔记本进行多项编辑并使用ctrl+z撤销这些编辑的视频。" autoplay loop controls muted></video>

#### 聊天中的文本和图像输出支持

您现在可以将笔记本单元格输出（如文本、错误和图像）直接添加到聊天作为上下文。这使您在使用问答、编辑或代理模式时可以引用输出，让语言模型更容易理解和协助您的笔记本内容。

使用**将单元格输出添加到聊天**操作，可通过三点菜单或右键单击输出访问。

要将单元格错误输出附加为聊天上下文：

<video src="https://code.visualstudio.com/assets/updates/1_99/notebook-output-attach.mp4" title="显示将笔记本单元格错误输出附加到聊天的视频。" autoplay loop controls muted></video>

要将单元格输出图像附加为聊天上下文：

<video src="https://code.visualstudio.com/assets/updates/1_99/notebook-output-image-demo.mp4" title="显示将笔记本单元格输出图像附加到聊天的视频。" autoplay loop controls muted></video>

## 无障碍

### 聊天代理模式改进

现在，当需要手动操作（如"在终端中运行命令"）时，系统会通知您。此信息也包含在相关聊天响应的ARIA标签中，增强了屏幕阅读器用户的无障碍体验。

此外，[代理模式](https://code.visualstudio.com/docs/copilot/chat/chat-agent-mode)中现在提供新的无障碍帮助对话框，解释用户可以从此功能中期望什么以及如何有效导航它。

### 聊天编辑操作的无障碍信号

VS Code现在在您保留或撤销AI生成的编辑时提供听觉信号。这些信号可通过`setting(accessibility.signals.editsKept)`和`setting(accessibility.signals.editsUndone)`进行配置。

### 改进建议控件的ARIA标签

建议控件项的ARIA标签现在包含更丰富、更具描述性的信息，如建议类型（例如，方法或变量）。这些信息以前只对有视力的用户通过图标可用。

## 源代码控制

### 引用选择器改进

**设置**：`setting(git.showReferenceDetails)`

在此里程碑中，我们改进了用于各种源代码控制操作（如检出、合并、变基或删除分支）的引用选择器。更新后的引用选择器包含最后一次提交的详细信息（作者、提交消息、提交日期），以及本地分支的领先/落后信息。这些额外的上下文将帮助您为各种操作选择正确的引用。

通过切换`setting(git.showReferenceDetails:false)`设置来隐藏额外信息。

![显示源代码控制引用选择器的截图，显示带有最后提交详细信息和领先/落后信息的git分支列表。](https://code.visualstudio.com/assets/updates/1_99/scm-reference-picker.png)

### 仓库状态栏项

包含多个仓库的工作区现在有一个源代码控制提供者状态栏项，显示活动仓库在分支选择器左侧。新的状态栏项提供额外的上下文，因此在编辑器之间导航和使用源代码控制视图时，您知道哪个是活动仓库。

要隐藏源代码控制提供者状态栏项，右键单击状态栏，并从上下文菜单中取消选择**源代码控制提供者**。

![显示包含多个仓库的工作区的仓库状态栏项的截图。](https://code.visualstudio.com/assets/updates/1_99/scm-repository-picker.png)

### Git blame编辑器装饰改进

我们收到反馈，在输入时，"尚未提交"编辑器装饰不提供太多价值，更多的是一种干扰。从这个里程碑开始，"尚未提交"编辑器装饰只在使用键盘或鼠标导航代码库时显示。

### 提交输入光标自定义

在此里程碑中，感谢社区贡献，我们已将`setting(editor.cursorStyle)`和`setting(editor.cursorWidth)`设置添加到源代码控制输入框遵循的设置列表中。

## 终端

### 代理模式中的可靠性

允许代理模式在终端中运行命令的工具有多项可靠性和兼容性改进。您应该会遇到更少的工具卡住或命令完成而没有输出出现的情况。

一个较大的变化是引入"丰富"质量[shell集成](https://code.visualstudio.com/docs/terminal/shell-integration)的概念，与"基本"和"无"相对。VS Code附带的shell集成脚本通常都应启用丰富的shell集成，这在终端工具中提供最佳体验（以及终端使用一般）。您可以通过悬停在终端选项卡上查看shell集成质量。

### 终端智能感知改进（预览）

#### 增强的`code` CLI智能感知

智能感知现在支持`code`、`code-insiders`和`code-tunnel` CLI的子命令。例如，输入`code tunnel`会显示可用的子命令，如`help`、`kill`和`prune`，每个都有描述性信息。

![终端窗口的截图，显示已输入code tunnel。建议小部件显示子命令，如help、kill、prune等，每个命令都有描述。](https://code.visualstudio.com/assets/updates/1_99/terminal-intellisense-code-tunnel.png)

我们还为以下选项添加了建议：

- `--uninstall-extension`
- `--disable-extension`
- `--install-extension`

这些会显示已安装扩展的列表，以帮助完成命令。

![VSCode终端的截图，显示code --uninstall-extension。显示可用扩展列表，包括vscode-eslint和editorconfig。](https://code.visualstudio.com/assets/updates/1_99/terminal-intellisense-extension.png)

此外，`code --locate-shell-integration-path`现在提供特定于shell的选项，如`bash`、`zsh`、`fish`和`pwsh`。

![VSCode终端的截图，显示命令输入：code --locate-shell-integration-path，带有下拉菜单列出shell选项bash、fish、pwsh和zsh。](https://code.visualstudio.com/assets/updates/1_99/terminal-intellisense-locate-shell-integration.png)

#### 全局命令的自动刷新

终端现在在系统`bin`目录中检测到更改时自动刷新其全局命令列表。这意味着新安装的CLI工具（例如，运行`npm install -g pnpm`后）将立即显示在完成列表中，无需重新加载窗口。

以前，由于缓存，新工具的完成建议在手动重新加载窗口之前不会出现。

#### 选项值上下文

终端建议现在显示有关预期选项值的上下文信息，帮助您更轻松地完成命令。

![终端的截图，显示正在进行的命令：npm install --omit。终端建议小部件显示<package type>，表示这是预期的选项。](https://code.visualstudio.com/assets/updates/1_99/terminal-intellisense-options.png)

#### Fish shell的丰富完成

在上一版本中，我们为bash和zsh添加了详细的命令完成。在这次迭代中，我们将该支持扩展到fish。完成详细信息来自shell的文档或内置帮助命令。

例如，在fish中输入`jobs`会显示使用信息和选项：

![Visual Studio Code终端的截图，显示fish终端，用户已输入jobs。建议小部件提供关于jobs命令的信息，包含详细的使用示例和选项。](https://code.visualstudio.com/assets/updates/1_99/terminal-intellisense-fish.png)

#### 建议中的文件类型图标

终端中的建议现在包含特定文件类型的图标，使脚本和二进制文件更容易一目了然地区分。

![终端的截图，显示各种脚本文件的建议，包括code.sh、code-cli.sh和code-server.js。图标指示特定的文件类型。](https://code.visualstudio.com/assets/updates/1_99/terminal-intellisense-icons.png)

#### 内联建议详细信息

内联建议，显示为终端中的幽灵文本，继续出现在建议列表的顶部。在此版本中，我们为这些条目添加了命令详细信息，以在接受它们之前提供更多上下文。

![终端的截图，显示Block命令作为终端中的幽灵文本。第一个建议是block，它包含使用信息。](https://code.visualstudio.com/assets/updates/1_99/terminal-intellisense-consolidated.png)

### 新的简化和详细选项卡悬停

默认情况下，终端选项卡现在显示的详细信息要少得多。

![显示终端名称、PID、命令行、shell集成质量和操作的简单悬停截图](https://code.visualstudio.com/assets/updates/1_99/terminal-hover-simple.png)

要查看所有内容，悬停底部有一个**显示详细信息**按钮。

![显示贡献到环境的扩展和详细shell集成诊断的详细悬停截图](https://code.visualstudio.com/assets/updates/1_99/terminal-hover-detailed.png)

### 已签名的PowerShell shell集成

PowerShell shell集成脚本现已签名，这意味着在Windows上使用默认PowerShell执行策略`RemoteSigned`时，shell集成现在应该自动开始工作。您可以阅读关于[shell集成的好处](https://code.visualstudio.com/docs/terminal/shell-integration)的更多信息。

### 终端shell类型

在这次迭代中，我们完成了终端shell API，允许扩展查看用户终端中的当前shell类型。
订阅事件`onDidChangeTerminalState`允许您查看用户在终端中shell类型的变化。
例如，shell可能从zsh更改为bash。

当前可识别的所有shell列表在[这里](https://github.com/microsoft/vscode/blob/99e3ae5586a74ab1c554b6a2a50bb9eb3a4ff7fd/src/vscode-dts/vscode.d.ts#L7740-L7750)列出。

## 远程开发

### Linux旧版服务器支持已结束

从1.99版本开始，您不能再连接到这些服务器。如我们在[1.97版本](https://github.com/microsoft/vscode-docs/blob/main/remote-release-notes/v1_97.md#migration-path-for-linux-legacy-server)中所述，需要额外时间完成迁移到受支持的Linux发行版的用户可以提供`glibc`和`libstdc++`的自定义构建作为解决方法。关于此解决方法的更多信息可以在[FAQ](https://aka.ms/vscode-remote/faq/old-linux)部分找到。

## 企业

### macOS设备管理

VS Code现在除了Windows外，还支持macOS上的设备管理。这允许系统管理员从集中管理系统（如Microsoft Intune）推送策略。

有关更多详细信息，请参阅[企业支持](https://code.visualstudio.com/docs/setup/enterprise#_device-management)文档。

## 对扩展的贡献

### Python

#### Pylance对可编辑安装的更好支持

Pylance现在支持解析以可编辑模式（`pip install -e .`）安装的包的导入路径，如[PEP 660](https://peps.python.org/pep-0660/)中定义的那样，这在这些场景中实现了改进的IntelliSense体验。

此功能通过`setting(python.analysis.enableEditableInstalls:true)`启用，我们计划在本月开始将其作为默认体验逐步推出。如果您遇到任何问题，请在[Pylance GitHub仓库](https://github.com/microsoft/pylance-release)报告。

#### 使用Pylance的更快更可靠的诊断体验（实验性）

我们开始推出一项改变，以提高使用Pylance扩展发布版本时诊断的准确性和响应性。这对于有多个打开或最近关闭文件的场景特别有帮助。

如果您不想等待推出，可以设置`setting(python.analysis.usePullDiagnostics:true)`。如果您遇到任何问题，请在[Pylance GitHub仓库](https://github.com/microsoft/pylance-release)报告。

#### Pylance自定义Node.js参数

现在有一个新的`setting(python.analysis.nodeArguments)`设置，允许您在使用`setting(python.analysis.nodeExecutable)`时直接向Node.js传递自定义参数。默认情况下，它被设置为`"--max-old-space-size=8192"`，但您可以修改它以满足您的需求（例如，在处理大型工作区时为Node.js分配更多内存）。

此外，当将`setting(python.analysis.nodeExecutable)`设置为`auto`时，Pylance现在会自动下载Node.js。

## 扩展编写

### Terminal.shellIntegration调整

`Terminal.shellIntegration` API现在只在命令检测发生时点亮。以前，这应该在_仅_报告当前工作目录时工作，这导致`TerminalShellIntegration.executeCommand`功能不佳。

此外，`TerminalShellIntegration.executeCommand`现在的行为将更加一致，并跟踪单个命令行最终运行多个命令的多个"子执行"。这取决于丰富的shell集成，如[代理模式中的可靠性部分](#代理模式中的可靠性)所述。

## 提议的API

### 任务问题匹配器状态

我们添加了[提议的API](https://github.com/microsoft/vscode/blob/c98092f1caaad64e18be5b3f8761a09c24c7669c/src/vscode-dts/vscode.proposed.taskProblemMatcherStatus.d.ts#L9-L40)，使扩展可以监视任务的问题匹配器何时开始和完成处理行。使用`taskProblemMatcherStatus`启用它。

### 向LLM发送图像

在这次迭代中，我们添加了一个[提议的API](https://github.com/microsoft/vscode/blob/main/src/vscode-dts/vscode.proposed.languageModelDataPart.d.ts)，使扩展可以附加图像并向语言模型发送视觉请求。附件必须是图像的原始、非base64编码的二进制数据（`Uint8Array`）。最大图像大小为5MB。

查看[这个API提议问题](https://github.com/microsoft/vscode/issues/245104)以查看使用示例并了解此API的最新状态。

## 工程

### 使用Marketplace的新`/latest` API检查扩展更新

在几个里程碑之前，我们在`vscode-unpkg`服务中引入了一个新的API端点来检查扩展更新。Marketplace现在支持同样的端点，VS Code现在使用此端点检查扩展更新。这背后有一个实验，将分阶段向用户推出。

## 感谢

最后但同样重要的是，向VS Code的贡献者表示衷心的**感谢**。

### 问题跟踪

对我们问题跟踪的贡献：

* [@gjsjohnmurray (John Murray)](https://github.com/gjsjohnmurray)
* [@albertosantini (Alberto Santini)](https://github.com/albertosantini)
* [@IllusionMH (Andrii Dieiev)](https://github.com/IllusionMH)
* [@RedCMD (RedCMD)](https://github.com/RedCMD)

### 拉取请求

对`vscode`的贡献：

* [@a-stewart (Anthony Stewart)](https://github.com/a-stewart)：为测试添加2小时偏移，以避免时钟变化后少一天 [PR #243194](https://github.com/microsoft/vscode/pull/243194)
* [@acdzh (Vukk)](https://github.com/acdzh)：修复在JSONEditingService中更新多个值时hasEdits标志的值 [PR #243876](https://github.com/microsoft/vscode/pull/243876)
* [@c-claeys (Cristopher Claeys)](https://github.com/c-claeys)：在聊天重试操作中增加请求尝试次数 [PR #243471](https://github.com/microsoft/vscode/pull/243471)
* [@ChaseKnowlden (Chase Knowlden)](https://github.com/ChaseKnowlden)：添加合并编辑器无障碍帮助 [PR #240745](https://github.com/microsoft/vscode/pull/240745)
* [@dibarbet (David Barbet)](https://github.com/dibarbet)：更新C# onEnterRules以考虑文档注释 [PR #242121](https://github.com/microsoft/vscode/pull/242121)
* [@dsanders11 (David Sanders)](https://github.com/dsanders11)：修复vscode.d.ts中几个损坏的`@link` [PR #242407](https://github.com/microsoft/vscode/pull/242407)
* [@jacekkopecky (Jacek Kopecký)](https://github.com/jacekkopecky)：在scm输入编辑器中遵守更多光标设置 [PR #242903](https://github.com/microsoft/vscode/pull/242903)
* [@joelverhagen (Joel Verhagen)](https://github.com/joelverhagen)：即使未设置扩展URL，也显示支持URL和许可证URL [PR #243565](https://github.com/microsoft/vscode/pull/243565)
* [@kevmo314 (Kevin Wang)](https://github.com/kevmo314)：修复注释拼写错误 [PR #243145](https://github.com/microsoft/vscode/pull/243145)
* [@liudonghua123 (liudonghua)](https://github.com/liudonghua123)：支持explorer.copyPathSeparator [PR #184884](https://github.com/microsoft/vscode/pull/184884)
* [@mattmaniak](https://github.com/mattmaniak)：使遥测信息表格略微变窄并对齐 [PR #233961](https://github.com/microsoft/vscode/pull/233961)
* [@notoriousmango (Seong Min Park)](https://github.com/notoriousmango)
  * 修复：在markdown预览中使用复制命令处理有CORS错误的图像 [PR #240508](https://github.com/microsoft/vscode/pull/240508)
  * 修复带换行的设置中的错误字符缩进 [PR #242074](https://github.com/microsoft/vscode/pull/242074)
* [@pprchal (Pavel Prchal)](https://github.com/pprchal)：为图标右键添加本地化 [PR #243679](https://github.com/microsoft/vscode/pull/243679)
* [@SimonSiefke (Simon Siefke)](https://github.com/SimonSiefke)：功能：在设置中支持字体系列选择器 [PR #214572](https://github.com/microsoft/vscode/pull/214572)
* [@tribals (Anthony)](https://github.com/tribals)：添加对PowerShell Core用户安装的发现 [PR #243025](https://github.com/microsoft/vscode/pull/243025)
* [@tusharsadhwani (Tushar Sadhwani)](https://github.com/tusharsadhwani)：使`git show`引用参数明确 [PR #242483](https://github.com/microsoft/vscode/pull/242483)
* [@wszgrcy (chen)](https://github.com/wszgrcy)：修复：扩展uncaughtException监听超出最大调用栈大小 [PR #244690](https://github.com/microsoft/vscode/pull/244690)
* [@zyoshoka (zyoshoka)](https://github.com/zyoshoka)：更正`typescript-basics`扩展路径 [PR #243833](https://github.com/microsoft/vscode/pull/243833)

对`vscode-css-languageservice`的贡献：

* [@lilnasy (Arsh)](https://github.com/lilnasy)：支持`@starting-style` [PR #421](https://github.com/microsoft/vscode-css-languageservice/pull/421)

对`vscode-custom-data`的贡献：

* [@rviscomi (Rick Viscomi)](https://github.com/rviscomi)：添加计算的Baseline状态 [PR #111](https://github.com/microsoft/vscode-custom-data/pull/111)

对`vscode-extension-samples`的贡献：

* [@ratmice (matt rice)](https://github.com/ratmice)：修复esbuild脚本 [PR #1154](https://github.com/microsoft/vscode-extension-samples/pull/1154)

对`vscode-extension-telemetry`的贡献：

* [@---
layout: post
title:  "Visual Studio Code 2025年3月版本（1.99版）"
date:   2025-04-05 09:00:00 +0800
categories: VSCode
tags: [发布说明, 代理模式, MCP]
---

---
Order: 108
TOCTitle: 2025年3月
PageTitle: Visual Studio Code 2025年3月版本
MetaDescription: 了解Visual Studio Code 2025年3月版本(1.99)的新功能
MetaSocialImage: 1_99/release-highlights.png
Date: 2025-04-03
DownloadVersion: 1.99.0
---
# 2025年3月（1.99版本）

<!-- DOWNLOAD_LINKS_PLACEHOLDER -->

---

欢迎使用Visual Studio Code 2025年3月版本。此版本包含许多更新，我们希望您会喜欢，一些主要亮点包括：

* **代理模式**
  * 代理模式现已在VS Code稳定版中可用。通过设置`setting(chat.agent.enabled:true)`启用（[更多...](#代理模式在-vs-code-稳定版中可用)）。
  * 通过模型上下文协议(MCP)服务器工具扩展代理模式（[更多...](#模型上下文协议服务器支持)）。
  * 尝试代理模式中的新内置工具，用于获取网页内容、查找符号引用和深度思考（[更多...](#代理模式工具)）。

* **代码编辑**
  * 下一步编辑建议现已正式发布（[更多...](#下一步编辑建议正式发布)）。
  * 在编辑器中应用AI编辑时减少诊断事件等干扰（[更多...](#ai-编辑改进)）。

* **聊天**
  * 在聊天中使用自己的API密钥访问更多语言模型（预览版）（[更多...](#自带密钥-byok-预览版)）。
  * 从统一的聊天体验中轻松切换问答、编辑和代理模式（[更多...](#统一聊天体验)）。
  * 通过即时远程工作区索引体验提高工作区搜索速度和准确性（[更多...](#使用即时索引实现更快的工作区搜索)）。

* **笔记本编辑**
  * 借助编辑和代理模式的支持，像编辑代码文件一样轻松创建和编辑笔记本（[更多...](#ai-笔记本编辑改进)）。

>如果您想在线阅读这些发布说明，请前往[code.visualstudio.com](https://code.visualstudio.com)上的[更新](https://code.visualstudio.com/updates)页面。
**Insiders版本：** 想尽快尝试新功能吗？您可以下载每晚构建的[Insiders](https://code.visualstudio.com/insiders)版本，并在功能可用后立即尝试最新更新。

## 聊天

### 代理模式在 VS Code 稳定版中可用

**设置**：`setting(chat.agent.enabled:true)`

我们很高兴地宣布代理模式现已在VS Code稳定版中可用！通过设置`setting(chat.agent.enabled:true)`启用。在接下来的几周内，我们将为所有用户默认启用此设置，届时将不再需要手动启用。

查看[代理模式文档](https://code.visualstudio.com/docs/copilot/chat/chat-agent-mode)或在聊天视图中从聊天模式选择器中选择代理模式。

![显示聊天视图的截图，突出显示在聊天模式选择器中选择的代理模式。](https://code.visualstudio.com/assets/updates/1_99/copilot-edits-agent-mode.png)

### 模型上下文协议服务器支持

此版本在代理模式下支持[模型上下文协议](https://modelcontextprotocol.io/)(MCP)服务器。MCP提供了一种标准化方法，使AI模型能够发现并与外部工具、应用程序和数据源进行交互。当您在VS Code中使用代理模式输入聊天提示时，模型可以调用各种工具来执行文件操作、访问数据库或检索网页数据等任务。这种集成使编码辅助更加动态和上下文感知。

MCP服务器可以在用户、远程或`.code-workspace`设置中的`mcp`部分下配置，或者在工作区的`.vscode/mcp.json`中配置。配置支持输入变量以避免硬编码机密和常量。例如，您可以使用`${env:API_KEY}`引用环境变量或使用`${input:ENDPOINT}`在服务器启动时提示输入值。

您可以使用**MCP: 添加服务器**命令从命令行调用快速设置MCP服务器，或使用AI辅助设置从Docker、npm或PyPI发布的MCP服务器。

添加新的MCP服务器时，聊天视图中会显示刷新操作，可用于启动服务器并发现工具。之后，服务器将按需启动以节省资源。

<video src="https://code.visualstudio.com/assets/updates/1_99/mcp.mp4" title="显示在聊天中使用Github MCP工具的视频。" autoplay loop controls muted></video>
_主题：[Codesong](https://marketplace.visualstudio.com/items?itemName=connor4312.codesong)（在[vscode.dev](https://vscode.dev/editor/theme/connor4312.codesong)上预览）_

如果您已经在Claude Desktop等其他应用程序中使用MCP服务器，VS Code将发现这些服务器并提供为您运行它们的选项。您可以通过设置`setting(chat.mcp.discovery.enabled)`切换此行为。

您可以使用**MCP: 列出服务器**命令查看MCP服务器列表及其当前状态，并使用代理模式中的**选择工具**按钮选择可在聊天中使用的工具。

您可以在[我们的文档](https://code.visualstudio.com/docs/copilot/chat/mcp-servers)中了解有关如何安装和使用MCP服务器的更多信息。

### 代理模式工具

在这个里程碑中，我们为代理模式添加了几个新的内置工具。

#### 思考工具（实验性）

**设置**：`setting(github.copilot.chat.agent.thinkingTool:true)`

受[Anthropic研究](https://www.anthropic.com/engineering/claude-think-tool)的启发，我们在代理模式中添加了对思考工具的支持，可用于给任何模型提供工具调用之间的思考机会。这提高了我们的代理在产品内和[SWE-bench](https://www.swebench.com/)评估上处理复杂任务的性能。

#### 获取工具

使用`#fetch`工具将公开访问网页的内容包含在您的提示中。例如，如果您想包含有关某个主题（如[MCP](#模型上下文协议服务器支持)）的最新文档，您可以请求获取[完整文档](https://modelcontextprotocol.io/llms-full.txt)（这对LLM消费非常方便）并在提示中使用。以下是可能的样子：

<video src="https://code.visualstudio.com/assets/updates/1_99/fetch.mp4" title="显示使用获取工具获取模型上下文协议文档的视频。" autoplay loop controls muted></video>

在代理模式下，此工具会自动被选中，但您也可以在其他模式下通过`#fetch`以及您要获取的URL显式引用它。

此工具通过在无头浏览器窗口中渲染网页工作，该窗口中的页面数据在本地缓存，因此您可以自由地要求模型一次又一次地获取内容，而无需重新渲染的开销。

请告诉我们您如何使用`#fetch`工具，以及您希望它具有哪些功能！

**获取工具限制：**

* 目前，JavaScript在此浏览器窗口中被禁用。如果网站完全依赖JavaScript来渲染内容，该工具将无法获取太多上下文。这是一个我们正在考虑更改的限制，并可能会更改以允许JavaScript。
* 由于无头的特性，我们无法获取位于身份验证后面的页面，因为这个无头浏览器存在于与您使用的浏览器不同的浏览器上下文中。相反，请考虑使用[MCP](#模型上下文协议服务器支持)引入专为该目标构建的MCP服务器，或通用浏览器MCP服务器，如[Playwright MCP服务器](https://github.com/microsoft/playwright-mcp)。

#### 使用工具

`#usages`工具是"查找所有引用"、"查找实现"和"转到定义"的组合。此工具可以帮助聊天了解有关函数、类或接口的更多信息。例如，聊天可以使用此工具查找接口的示例实现或在进行重构时查找需要更改的所有位置。

在代理模式下，此工具将自动被选中，但您也可以通过`#usages`显式引用它。

### 使用代理模式创建新工作区（实验性）

**设置**：`setting(github.copilot.chat.newWorkspaceCreation.enabled)`

现在您可以在[代理模式](https://code.visualstudio.com/docs/copilot/chat/chat-agent-mode)中搭建新的VS Code工作区。无论是设置VS Code扩展、MCP服务器还是其他开发环境，代理模式都可以帮助您初始化、配置和启动这些项目，并具备必要的依赖项和设置。

<video src="https://code.visualstudio.com/assets/updates/1_99/new-workspace-demo.mp4" title="视频展示使用代理模式创建一个新的MCP服务器，用于从hacker news获取热门故事。" autoplay loop controls muted></video>

### 代理模式中的VS Code扩展工具

几个月前，我们完成了[语言模型工具](https://code.visualstudio.com/api/extension-guides/tools#create-a-language-model-tool)的扩展API，由VS Code扩展提供。现在，您可以在代理模式中使用这些工具。

任何在其配置中设置了`toolReferenceName`和`canBeReferencedInPrompt`的工具都会自动在代理模式中可用。

通过在扩展中提供工具，它可以访问完整的VS Code扩展API，并且可以通过扩展市场轻松安装。

与来自MCP服务器的工具类似，您可以通过代理模式中的**选择工具**按钮启用和禁用这些工具。查看我们的[语言模型工具扩展指南](https://code.visualstudio.com/api/extension-guides/tools#create-a-language-model-tool)来构建您自己的工具！

### 代理模式工具审批

作为完成用户提示任务的一部分，代理模式可以运行工具和终端命令。这很强大但可能带来风险。因此，您需要在代理模式中批准工具和终端命令的使用。

为了优化此体验，您现在可以在会话、工作区或应用程序级别上记住该批准。目前终端工具尚未启用此功能，但我们计划在未来版本中为终端开发审批系统。

![显示代理模式工具继续按钮下拉选项的截图，用于记住批准。](https://code.visualstudio.com/assets/updates/1_99/chat-tool-approval.png)

如果您想自动批准_所有_工具，可以使用实验性的`setting(chat.tools.autoApprove:true)`设置。这将自动批准所有工具，VS Code不会在语言模型希望运行工具时要求确认。请注意，启用此设置后，您将没有机会取消模型可能要采取的潜在破坏性操作。

我们计划在未来扩展此设置，使其具有更细粒度的功能。

### SWE-bench上的代理评估

VS Code的代理在使用Claude 3.7 Sonnet的`swebench-verified`上实现了56.0%的通过率，遵循Anthropic的[研究](https://www.anthropic.com/engineering/swe-bench-sonnet)，配置代理在SWE-bench环境中无需用户输入即可执行。我们的实验已转化为改进的提示、工具描述和代理模式的工具设计，包括新的文件编辑工具，适用于Claude 3.5和3.7 Sonnet模型。

### 统一聊天视图

在过去几个月中，我们有一个用于向语言模型提问的"聊天"视图，以及一个用于AI驱动代码编辑会话的"Copilot编辑"视图。这个月，我们旨在通过将两个视图合并为一个聊天视图来简化基于聊天的体验。在聊天视图中，您将看到一个包含三种模式的下拉列表：

![显示聊天视图中聊天模式选择器的截图。](https://code.visualstudio.com/assets/updates/1_99/chat-modes.png)

- **[问答](https://code.visualstudio.com/docs/copilot/chat/chat-ask-mode)**：这与之前的聊天视图相同。使用任何模型询问有关您的工作区或一般编码的问题。使用`@`调用内置聊天参与者或来自已安装[扩展](https://marketplace.visualstudio.com/search?term=chat-participant&target=VSCode&category=All%20categories&sortBy=Relevance)的参与者。使用`#`手动附加任何类型的上下文。
- **[代理](https://code.visualstudio.com/docs/copilot/chat/chat-agent-mode)**：启动具有一组工具的代理式编码流程，这些工具使其能够自主收集上下文、运行终端命令或采取其他操作来完成任务。代理模式已为所有[VS Code Insiders](https://code.visualstudio.com/insiders/)用户启用，我们正在将其推广到VS Code稳定版中的更多用户。
- **[编辑](https://code.visualstudio.com/docs/copilot/chat/copilot-edits)**：在编辑模式下，模型可以对多个文件进行定向编辑。附加`#codebase`让它自动查找要编辑的文件。但它不会自动运行终端命令或做其他任何事情。

> **注意**：如果您在此列表中没有看到代理模式，那么要么它尚未为您启用，要么它被组织政策禁用，需要由[组织所有者](https://aka.ms/github-copilot-org-enable-features)启用。

除了简化您的聊天体验外，这种统一还为AI驱动的代码编辑启用了一些新功能：

- **在对话中间切换模式**：例如，您可能首先在问答模式中头脑风暴应用程序想法，然后切换到代理模式执行计划。提示：按`kb(workbench.action.chat.toggleAgentMode)`快速更改模式。
- **历史记录中的编辑会话**：使用**显示聊天**命令（聊天视图顶部的时钟图标）恢复过去的编辑会话并继续处理它们。
- **将聊天移动到编辑器或窗口**：选择**在新编辑器/新窗口中打开聊天**，将您的聊天对话从侧边栏弹出到新的编辑器选项卡或单独的VS Code窗口中。聊天很长时间以来一直支持这一点，但现在您也可以从编辑器窗格或单独的窗口运行编辑/代理会话。
- **多个代理会话**：根据上面的要点，这意味着您甚至可以同时运行多个代理会话。您可能希望有一个代理模式的聊天负责实现功能，而另一个独立的会话用于研究和使用其他工具。不建议指导两个代理会话同时编辑文件，这可能导致混淆。

### 自带密钥 (BYOK)（预览版）

Copilot Pro和Copilot Free用户现在可以为Azure、Anthropic、Gemini、Open AI、Ollama和Open Router等流行提供商使用自己的API密钥。这允许您在新模型发布的第一天就使用Copilot原生不支持的新模型。

要尝试，请从模型选择器中选择**管理模型...**。我们正在积极探索支持Copilot Business和Enterprise客户，并将在未来版本中分享更新。要了解有关此功能的更多信息，请前往我们的[文档](https://code.visualstudio.com/docs/copilot/language-models)。

![用户界面中"管理模型 - 预览"下拉菜单的截图。下拉菜单顶部标有"选择提供商"，下面列出了多个选项。选项包括"Anthropic"（以蓝色突出显示）、"Azure"、"Gemini"、"OpenAI"、"Ollama"和"OpenRouter"。"Anthropic"选项旁边显示了一个齿轮图标。](https://code.visualstudio.com/assets/updates/1_99/byok.png)

### 可重用提示文件

#### 改进的配置

**设置**：`setting(chat.promptFilesLocations)`

`setting(chat.promptFilesLocations)`设置现在支持文件路径中的全局模式。例如，要包含当前打开工作区中的所有`.prompt.md`文件，您可以将路径设置为`{ "**": true }`。

此外，配置现在尊重适用文件系统上的大小写敏感性，与主机操作系统的行为保持一致。

#### 改进的提示文件编辑

- 您的`.prompt.md`文件现在提供文件系统路径的基本自动完成，并突出显示有效的文件引用。另一方面，损坏的链接现在显示为警告或错误波浪线，并提供详细的诊断信息。
- 您现在可以使用**聊天：使用提示**命令中提示文件列表内的编辑和删除操作来管理提示。
- 提示文件中的文件夹引用不再标记为无效。
- 现在正确处理Markdown注释，例如，在生成发送给LLM模型的最终提示时，会忽略所有注释掉的链接。

#### 与自定义指令的对齐

`.github/copilot-instructions.md`文件现在的行为与任何其他可重用的`.prompt.md`文件相同，支持嵌套链接解析和增强的语言功能。此外，现在可以引用任何`.prompt.md`文件并适当处理。

了解更多关于[自定义指令](https://code.visualstudio.com/docs/copilot/copilot-customization)的信息。

#### 用户提示

**创建用户提示**命令现在允许创建一种称为_用户提示_的新类型提示。这些提示存储在用户数据文件夹中，可以跨机器同步，类似于代码片段或用户设置。可以在[同步设置](https://code.visualstudio.com/docs/configure/settings-sync)中使用同步资源列表中的**提示**项配置同步。

### 改进的视觉支持（预览版）

上一次迭代，我们为`GPT-4o`启用了Copilot Vision。查看我们的[发布说明](https://code.visualstudio.com/updates/v1_98#_copilot-vision-preview)，了解更多关于如何在聊天中附加和使用图像的信息。

在本次发布中，您可以通过拖放从任何浏览器附加图像。从浏览器拖放的图像必须具有正确的url扩展名，如`.jpg`、`.png`、`.gif`、`.webp`或`.bmp`。

<video src="https://code.visualstudio.com/assets/updates/1_99/image-url-dnd.mp4" title="显示从Chrome拖动图像到聊天面板的视频。" autoplay loop controls muted></video>

## 配置编辑器

### 统一聊天体验

我们已经将VS Code中的聊天体验简化为单一统一的聊天视图。您现在不必在单独的视图之间移动并失去对话上下文，而是可以轻松地在不同的聊天模式之间切换。

![显示聊天视图中聊天模式选择器的截图。](https://code.visualstudio.com/assets/updates/1_99/chat-modes.png)

根据您的场景，使用以下任一模式，并可以自由地在对话中间移动：

- 问答模式：优化用于询问有关您的代码库的问题并头脑风暴想法。
- 编辑模式：优化用于对代码库中的多个文件进行编辑。
- 代理模式：优化用于自主编码流程，结合代码编辑和工具调用。

获取有关[统一聊天视图](#统一聊天体验)的更多详细信息。

### 使用即时索引实现更快的工作区搜索

[远程工作区索引](https://code.visualstudio.com/docs/copilot/reference/workspace-context#remote-index)可加速搜索大型代码库，以查找AI在回答问题和生成编辑时使用的相关代码片段。这些远程索引对于具有数万甚至数十万个文件的大型代码库特别有用。

之前，您必须按下按钮或运行命令来构建和开始使用远程工作区索引。通过我们新的即时索引支持，我们现在会在您首次尝试提出`#codebase`/`@workspace`问题时自动构建远程工作区索引。在大多数情况下，这个远程索引可以在几秒钟内构建完成。构建完成后，您或其他人在VS Code中对该代码库进行的任何代码库搜索都将自动使用远程索引。

请记住，远程工作区索引目前仅适用于存储在GitHub上的代码。要使用远程工作区索引，请确保您的工作区包含具有GitHub远程的git项目。您可以使用[Copilot状态菜单](#copilot-状态菜单)查看当前使用的索引类型：

![在Copilot状态栏菜单中显示工作区索引状态的截图。](https://code.visualstudio.com/assets/updates/1_99/copilot-workspace-index-remote.png)

为了管理负载，我们在接下来的几周内逐步推出即时索引，因此您可能不会立即看到它。当即时索引尚未为您启用时，您仍然可以运行`GitHub Copilot: 构建远程索引命令`命令来开始使用远程索引。

### Copilot 状态菜单

Copilot状态菜单可从状态栏访问，现已为所有用户启用。在这个里程碑中，我们为其添加了一些新功能：

- 随时查看[工作区索引](https://code.visualstudio.com/docs/copilot/reference/workspace-context)状态信息。

    ![在Copilot菜单中显示工作区索引状态的截图。](https://code.visualstudio.com/assets/updates/1_99/copilot-worksspace-index-local-status.png)

- 查看代码完成是否对活动编辑器启用。

    新图标反映状态，因此您可以快速查看代码完成是否启用或禁用。

    ![显示Copilot状态图标的截图，当完成功能被禁用时。](https://code.visualstudio.com/assets/updates/1_99/copilot-disabled-status.png)

- 启用或禁用[代码完成和NES](https://code.visualstudio.com/docs/copilot/ai-powered-suggestions)。

### 开箱即用的Copilot设置（实验性）

**设置**：`setting(chat.setupFromDialog)`

我们正在发布一项实验性功能，以开箱即用方式显示功能性聊天体验。这包括聊天视图、编辑器/终端内联聊天和快速聊天。第一次发送聊天请求时，我们将指导您登录并注册Copilot Free。

<video src="https://code.visualstudio.com/assets/updates/1_99/copilot-ootb.mp4" title="显示开箱即用Copilot的视频。" autoplay loop controls muted></video>

如果您想自己查看此体验，请启用`setting(chat.setupFromDialog)`设置。

### 聊天预发布通道不匹配

如果您在VS Code稳定版中安装了Copilot Chat扩展的预发布版本，新的欢迎屏幕将通知您此配置不受支持。由于聊天功能的快速开发，该扩展将不会在VS Code稳定版中激活。

欢迎屏幕提供了切换到扩展发布版本或下载[VS Code Insiders](https://code.visualstudio.com/insiders/)的选项。

![显示聊天的欢迎视图的截图，表明扩展的预发布版本在VS Code稳定版中不受支持。显示了切换到发布版本的按钮，以及切换到VS Code Insiders的次要链接。](https://code.visualstudio.com/assets/updates/1_99/welcome-pre-release.png)

### 语义文本搜索改进（实验性）

**设置**：`setting(github.copilot.chat.search.semanticTextResults:true)`

AI驱动的语义文本搜索现在在搜索视图中默认启用。使用`kb(search.action.searchWithAI)`键盘快捷键触发语义搜索，它将根据您的查询显示最相关的结果，以及常规搜索结果。

<video src="https://code.visualstudio.com/assets/updates/1_99/semantic-search.mp4" title="显示Visual Studio Code中语义搜索改进的视频。" autoplay loop controls muted></video>

您还可以使用`#searchResults`工具在聊天提示中引用语义搜索结果。这允许您要求LLM总结或解释结果，甚至基于它们生成代码。

<video src="https://code.visualstudio.com/assets/updates/1_99/semantic-search-results.mp4" title="显示在聊天视图中使用搜索结果的视频。" autoplay loop controls muted></video>

### 设置编辑器搜索更新

默认情况下，设置编辑器搜索现在使用我们在上一个版本中引入的键匹配算法。即使设置ID与已知设置完全匹配，它也会显示额外的设置。

<video src="https://code.visualstudio.com/assets/updates/1_99/settings-search-show-extra.mp4" title="显示在设置编辑器中搜索'files.autoSave'和'mcp'的视频，两者都显示多个设置。" autoplay loop controls muted></video>

_主题：[Light Pink](https://marketplace.visualstudio.com/items?itemName=mgwg.light-pink-theme)（在[vscode.dev](https://vscode.dev/editor/theme/mgwg.light-pink-theme)上预览）_

### 窗口控件的新设置（Linux，Windows）

**设置**：`setting(window.controlsStyle)`

如果您已将标题栏样式（`setting(window.titleBarStyle)`）设置为`custom`，现在可以在窗口控件的三种不同样式之间进行选择。

- `native`：这是默认值，根据底层平台渲染窗口控件
- `custom`：如果您更喜欢自定义样式而不是原生样式，则使用自定义样式渲染窗口控件
- `hidden`：如果您想在标题栏中获得一些空间并且是更加以键盘为中心的用户，则完全隐藏窗口控件

## 代码编辑

### 下一步编辑建议正式发布

**设置**：`setting(github.copilot.nextEditSuggestions.enabled:true)`

我们很高兴地宣布下一步编辑建议(NES)正式发布！此外，我们还对NES的整体用户体验进行了多项改进：

* 使编辑建议更加紧凑，减少对周围代码的干扰，并使其更容易一目了然。
* 更新沟槽指示器，确保所有建议更容易被注意到。

<video src="https://code.visualstudio.com/assets/updates/1_99/next-edit-suggestion.mp4" title="显示NES基于用户最近更改提出编辑建议的视频。" autoplay loop controls muted></video>

### AI 编辑改进

我们对使用AI生成编辑进行了一些较小的调整：

* 在使用AI编辑重写文件时，将编辑器外的诊断事件静音。之前，我们已经在这种情况下禁用了波浪线。这些更改减少了问题面板中的闪烁，并确保我们不会为快速修复代码操作发出请求。

* 当您决定保留AI编辑时，我们现在会显式保存文件。

### 基于工具的编辑模式

**设置**：`setting(chat.edits2.enabled:true)`

我们正在改变[聊天中的编辑模式](https://code.visualstudio.com/docs/copilot/chat/copilot-edits)的运作方式。新的编辑模式使用与代理模式相同的方法，让模型调用工具对文件进行编辑。这种方法的好处是使您能够在所有三种模式之间无缝切换，同时大大简化了这些模式在底层的工作方式。

缺点是，这意味着新模式只适用于代理模式可用的同一组有限模型，即支持工具调用并经过测试以确保在涉及工具时能提供良好体验的模型。您可能会注意到编辑模式列表中缺少`o3-mini`和`Claude 3.7 (Thinking)`等模型。如果您想继续使用这些模型进行编辑，请禁用`setting(chat.edits2.enabled)`设置以恢复到以前的编辑模式。切换模式时，系统会要求您清除会话。

我们已经了解到，在使用工具时，通过提示获得跨不同模型的一致结果更加困难，但我们正在努力使这些模型适用于编辑（和代理）模式。

这个设置将在VS Code稳定版中为用户逐步启用。

### 内联建议语法高亮

**设置**：`setting(editor.inlineSuggest.syntaxHighlightingEnabled)`

在此更新中，内联建议的语法高亮现在默认启用。请注意下面的屏幕截图中，代码建议已应用语法着色。

![编辑器的截图，显示为幽灵文本启用了语法高亮。](https://code.visualstudio.com/assets/updates/1_99/inlineSuggestionHighlightingEnabled.png)

如果您更喜欢没有语法高亮的内联建议，可以通过`setting(editor.inlineSuggest.syntaxHighlightingEnabled:false)`禁用它。

![编辑器的截图，显示幽灵文本的高亮显示已关闭。](https://code.visualstudio.com/assets/updates/1_99/inlineSuggestionHighlightingDisabled.png)

### 基于Tree-Sitter的语法高亮（预览）

**设置**：`setting(editor.experimental.preferTreeSitter.css:true)`和`setting(editor.experimental.preferTreeSitter.regex:true)`

在之前使用Tree-Sitter进行语法高亮的工作基础上，我们现在支持CSS文件和TypeScript中正则表达式的实验性基于Tree-Sitter的语法高亮。

## 笔记本

### Jupyter笔记本文档的最低版本为4.5

新笔记本的`nbformat`默认版本已从4.2升级到4.5，这将为笔记本的每个单元格设置`id`字段，以帮助计算差异。您还可以通过在笔记本的原始JSON中将`nbformat_minor`设置为`5`来手动更新现有笔记本。

### AI笔记本编辑改进

AI驱动的笔记本编辑支持（包括代理模式）现已在稳定版中可用。这是上个月作为预览功能添加到[VS Code Insiders](https://code.visualstudio.com/insiders)中的。

您现在可以使用聊天编辑笔记本文件，体验与编辑代码文件相同的直观体验：修改多个单元格的内容，插入和删除单元格，以及更改单元格类型。此功能在处理数据科学或文档笔记本时提供无缝工作流程。

#### 新笔记本工具

VS Code现在提供了一个专用工具，可以直接从聊天中创建新的Jupyter笔记本。此工具基于您的查询计划并创建新笔记本。

在代理模式或编辑模式中使用新的笔记本工具（确保通过`setting(chat.edits2.enabled:true)`启用改进的编辑模式）。如果您使用的是问答模式，可以在聊天提示中键入`/newNotebook`来创建新笔记本。

<video src="https://code.visualstudio.com/assets/updates/1_99/new-notebook-tool-release-notes.mp4" title="显示使用代理模式聊天和新笔记本工具创建新Jupyter笔记本的视频。" autoplay loop controls muted></video>

#### 浏览AI编辑

使用差异工具栏在单元格之间迭代和查看每个AI编辑。

<video src="https://code.visualstudio.com/assets/updates/1_99/navigate-notebook-edits.mp4" title="显示聊天实现TODO任务然后浏览这些更改的视频。" autoplay loop controls muted></video>

#### 撤销AI编辑

当焦点在单元格容器上时，**撤销**命令将在笔记本级别恢复完整的AI更改集。

<video src="https://code.visualstudio.com/assets/updates/1_99/undo-copilot-notebook-edits.mp4" title="显示聊天对笔记本进行多项编辑并使用ctrl+z撤销这些编辑的视频。" autoplay loop controls muted></video>

#### 聊天中的文本和图像输出支持

您现在可以将笔记本单元格输出（如文本、错误和图像）直接添加到聊天作为上下文。这使您在使用问答、编辑或代理模式时可以引用输出，让语言模型更容易理解和协助您的笔记本内容。

使用**将单元格输出添加到聊天**操作，可通过三点菜单或右键单击输出访问。

要将单元格错误输出附加为聊天上下文：

<video src="https://code.visualstudio.com/assets/updates/1_99/notebook-output-attach.mp4" title="显示将笔记本单元格错误输出附加到聊天的视频。" autoplay loop controls muted></video>

要将单元格输出图像附加为聊天上下文：

<video src="https://code.visualstudio.com/assets/updates/1_99/notebook-output-image-demo.mp4" title="显示将笔记本单元格输出图像附加到聊天的视频。" autoplay loop controls muted></video>

## 无障碍

### 聊天代理模式改进

现在，当需要手动操作（如"在终端中运行命令"）时，系统会通知您。此信息也包含在相关聊天响应的ARIA标签中，增强了屏幕阅读器用户的无障碍体验。

此外，[代理模式](https://code.visualstudio.com/docs/copilot/chat/chat-agent-mode)中现在提供新的无障碍帮助对话框，解释用户可以从此功能中期望什么以及如何有效导航它。

### 聊天编辑操作的无障碍信号

VS Code现在在您保留或撤销AI生成的编辑时提供听觉信号。这些信号可通过`setting(accessibility.signals.editsKept)`和`setting(accessibility.signals.editsUndone)`进行配置。

### 改进建议控件的ARIA标签

建议控件项的ARIA标签现在包含更丰富、更具描述性的信息，如建议类型（例如，方法或变量）。这些信息以前只对有视力的用户通过图标可用。

## 源代码控制

### 引用选择器改进

**设置**：`setting(git.showReferenceDetails)`

在此里程碑中，我们改进了用于各种源代码控制操作（如检出、合并、变基或删除分支）的引用选择器。更新后的引用选择器包含最后一次提交的详细信息（作者、提交消息、提交日期），以及本地分支的领先/落后信息。这些额外的上下文将帮助您为各种操作选择正确的引用。

通过切换`setting(git.showReferenceDetails:false)`设置来隐藏额外信息。

![显示源代码控制引用选择器的截图，显示带有最后提交详细信息和领先/落后信息的git分支列表。](https://code.visualstudio.com/assets/updates/1_99/scm-reference-picker.png)

### 仓库状态栏项

包含多个仓库的工作区现在有一个源代码控制提供者状态栏项，显示活动仓库在分支选择器左侧。新的状态栏项提供额外的上下文，因此在编辑器之间导航和使用源代码控制视图时，您知道哪个是活动仓库。

要隐藏源代码控制提供者状态栏项，右键单击状态栏，并从上下文菜单中取消选择**源代码控制提供者**。

![显示包含多个仓库的工作区的仓库状态栏项的截图。](https://code.visualstudio.com/assets/updates/1_99/scm-repository-picker.png)

### Git blame编辑器装饰改进

我们收到反馈，在输入时，"尚未提交"编辑器装饰不提供太多价值，更多的是一种干扰。从这个里程碑开始，"尚未提交"编辑器装饰只在使用键盘或鼠标导航代码库时显示。

### 提交输入光标自定义

在此里程碑中，感谢社区贡献，我们已将`setting(editor.cursorStyle)`和`setting(editor.cursorWidth)`设置添加到源代码控制输入框遵循的设置列表中。

## 终端

### 代理模式中的可靠性

允许代理模式在终端中运行命令的工具有多项可靠性和兼容性改进。您应该会遇到更少的工具卡住或命令完成而没有输出出现的情况。

一个较大的变化是引入"丰富"质量[shell集成](https://code.visualstudio.com/docs/terminal/shell-integration)的概念，与"基本"和"无"相对。VS Code附带的shell集成脚本通常都应启用丰富的shell集成，这在终端工具中提供最佳体验（以及终端使用一般）。您可以通过悬停在终端选项卡上查看shell集成质量。

### 终端智能感知改进（预览）

#### 增强的`code` CLI智能感知

智能感知现在支持`code`、`code-insiders`和`code-tunnel` CLI的子命令。例如，输入`code tunnel`会显示可用的子命令，如`help`、`kill`和`prune`，每个都有描述性信息。

![终端窗口的截图，显示已输入code tunnel。建议小部件显示子命令，如help、kill、prune等，每个命令都有描述。](https://code.visualstudio.com/assets/updates/1_99/terminal-intellisense-code-tunnel.png)

我们还为以下选项添加了建议：

- `--uninstall-extension`
- `--disable-extension`
- `--install-extension`

这些会显示已安装扩展的列表，以帮助完成命令。

![VSCode终端的截图，显示code --uninstall-extension。显示可用扩展列表，包括vscode-eslint和editorconfig。](https://code.visualstudio.com/assets/updates/1_99/terminal-intellisense-extension.png)

此外，`code --locate-shell-integration-path`现在提供特定于shell的选项，如`bash`、`zsh`、`fish`和`pwsh`。

![VSCode终端的截图，显示命令输入：code --locate-shell-integration-path，带有下拉菜单列出shell选项bash、fish、pwsh和zsh。](https://code.visualstudio.com/assets/updates/1_99/terminal-intellisense-locate-shell-integration.png)

#### 全局命令的自动刷新

终端现在在系统`bin`目录中检测到更改时自动刷新其全局命令列表。这意味着新安装的CLI工具（例如，运行`npm install -g pnpm`后）将立即显示在完成列表中，无需重新加载窗口。

以前，由于缓存，新工具的完成建议在手动重新加载窗口之前不会出现。

#### 选项值上下文

终端建议现在显示有关预期选项值的上下文信息，帮助您更轻松地完成命令。

![终端的截图，显示正在进行的命令：npm install --omit。终端建议小部件显示<package type>，表示这是预期的选项。](https://code.visualstudio.com/assets/updates/1_99/terminal-intellisense-options.png)

#### Fish shell的丰富完成

在上一版本中，我们为bash和zsh添加了详细的命令完成。在这次迭代中，我们将该支持扩展到fish。完成详细信息来自shell的文档或内置帮助命令。

例如，在fish中输入`jobs`会显示使用信息和选项：

![Visual Studio Code终端的截图，显示fish终端，用户已输入jobs。建议小部件提供关于jobs命令的信息，包含详细的使用示例和选项。](https://code.visualstudio.com/assets/updates/1_99/terminal-intellisense-fish.png)

#### 建议中的文件类型图标

终端中的建议现在包含特定文件类型的图标，使脚本和二进制文件更容易一目了然地区分。

![终端的截图，显示各种脚本文件的建议，包括code.sh、code-cli.sh和code-server.js。图标指示特定的文件类型。](https://code.visualstudio.com/assets/updates/1_99/terminal-intellisense-icons.png)

#### 内联建议详细信息

内联建议，显示为终端中的幽灵文本，继续出现在建议列表的顶部。在此版本中，我们为这些条目添加了命令详细信息，以在接受它们之前提供更多上下文。

![终端的截图，显示Block命令作为终端中的幽灵文本。第一个建议是block，它包含使用信息。](https://code.visualstudio.com/assets/updates/1_99/terminal-intellisense-consolidated.png)

### 新的简化和详细选项卡悬停

默认情况下，终端选项卡现在显示的详细信息要少得多。

![显示终端名称、PID、命令行、shell集成质量和操作的简单悬停截图](https://code.visualstudio.com/assets/updates/1_99/terminal-hover-simple.png)

要查看所有内容，悬停底部有一个**显示详细信息**按钮。

![显示贡献到环境的扩展和详细shell集成诊断的详细悬停截图](https://code.visualstudio.com/assets/updates/1_99/terminal-hover-detailed.png)

### 已签名的PowerShell shell集成

PowerShell shell集成脚本现已签名，这意味着在Windows上使用默认PowerShell执行策略`RemoteSigned`时，shell集成现在应该自动开始工作。您可以阅读关于[shell集成的好处](https://code.visualstudio.com/docs/terminal/shell-integration)的更多信息。

### 终端shell类型

在这次迭代中，我们完成了终端shell API，允许扩展查看用户终端中的当前shell类型。
订阅事件`onDidChangeTerminalState`允许您查看用户在终端中shell类型的变化。
例如，shell可能从zsh更改为bash。

当前可识别的所有shell列表在[这里](https://github.com/microsoft/vscode/blob/99e3ae5586a74ab1c554b6a2a50bb9eb3a4ff7fd/src/vscode-dts/vscode.d.ts#L7740-L7750)列出。

## 远程开发

### Linux旧版服务器支持已结束

从1.99版本开始，您不能再连接到这些服务器。如我们在[1.97版本](https://github.com/microsoft/vscode-docs/blob/main/remote-release-notes/v1_97.md#migration-path-for-linux-legacy-server)中所述，需要额外时间完成迁移到受支持的Linux发行版的用户可以提供`glibc`和`libstdc++`的自定义构建作为解决方法。关于此解决方法的更多信息可以在[FAQ](https://aka.ms/vscode-remote/faq/old-linux)部分找到。

## 企业

### macOS设备管理

VS Code现在除了Windows外，还支持macOS上的设备管理。这允许系统管理员从集中管理系统（如Microsoft Intune）推送策略。

有关更多详细信息，请参阅[企业支持](https://code.visualstudio.com/docs/setup/enterprise#_device-management)文档。

## 对扩展的贡献

### Python

#### Pylance对可编辑安装的更好支持

Pylance现在支持解析以可编辑模式（`pip install -e .`）安装的包的导入路径，如[PEP 660](https://peps.python.org/pep-0660/)中定义的那样，这在这些场景中实现了改进的IntelliSense体验。

此功能通过`setting(python.analysis.enableEditableInstalls:true)`启用，我们计划在本月开始将其作为默认体验逐步推出。如果您遇到任何问题，请在[Pylance GitHub仓库](https://github.com/microsoft/pylance-release)报告。

#### 使用Pylance的更快更可靠的诊断体验（实验性）

我们开始推出一项改变，以提高使用Pylance扩展发布版本时诊断的准确性和响应性。这对于有多个打开或最近关闭文件的场景特别有帮助。

如果您不想等待推出，可以设置`setting(python.analysis.usePullDiagnostics:true)`。如果您遇到任何问题，请在[Pylance GitHub仓库](https://github.com/microsoft/pylance-release)报告。

#### Pylance自定义Node.js参数

现在有一个新的`setting(python.analysis.nodeArguments)`设置，允许您在使用`setting(python.analysis.nodeExecutable)`时直接向Node.js传递自定义参数。默认情况下，它被设置为`"--max-old-space-size=8192"`，但您可以修改它以满足您的需求（例如，在处理大型工作区时为Node.js分配更多内存）。

此外，当将`setting(python.analysis.nodeExecutable)`设置为`auto`时，Pylance现在会自动下载Node.js。

## 扩展编写

### Terminal.shellIntegration调整

`Terminal.shellIntegration` API现在只在命令检测发生时点亮。以前，这应该在_仅_报告当前工作目录时工作，这导致`TerminalShellIntegration.executeCommand`功能不佳。

此外，`TerminalShellIntegration.executeCommand`现在的行为将更加一致，并跟踪单个命令行最终运行多个命令的多个"子执行"。这取决于丰富的shell集成，如[代理模式中的可靠性部分](#代理模式中的可靠性)所述。

## 提议的API

### 任务问题匹配器状态

我们添加了[提议的API](https://github.com/microsoft/vscode/blob/c98092f1caaad64e18be5b3f8761a09c24c7669c/src/vscode-dts/vscode.proposed.taskProblemMatcherStatus.d.ts#L9-L40)，使扩展可以监视任务的问题匹配器何时开始和完成处理行。使用`taskProblemMatcherStatus`启用它。

### 向LLM发送图像

在这次迭代中，我们添加了一个[提议的API](https://github.com/microsoft/vscode/blob/main/src/vscode-dts/vscode.proposed.languageModelDataPart.d.ts)，使扩展可以附加图像并向语言模型发送视觉请求。附件必须是图像的原始、非base64编码的二进制数据（`Uint8Array`）。最大图像大小为5MB。

查看[这个API提议问题](https://github.com/microsoft/vscode/issues/245104)以查看使用示例并了解此API的最新状态。

## 工程

### 使用Marketplace的新`/latest` API检查扩展更新

在几个里程碑之前，我们在`vscode-unpkg`服务中引入了一个新的API端点来检查扩展更新。Marketplace现在支持同样的端点，VS Code现在使用此端点检查扩展更新。这背后有一个实验，将分阶段向用户推出。


## 参考资料
- [VSCode March 2025 (version 1.99)](https://code.visualstudio.com/updates/v1_99)
