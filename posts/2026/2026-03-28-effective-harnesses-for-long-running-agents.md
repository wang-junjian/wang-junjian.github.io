---
type: article
title:  "Anthropic：长时运行智能体的有效脚手架 (Harnesses)"
date:   2026-03-28 08:00:00 +0800
tags: [anthropic, claude, harness-engineering, long-running-agents, agent, context-window, claude-agent-sdk, incremental-development, git]
---

这是一篇由 Anthropic 发布的技术博客文章，探讨了如何通过构建有效的“脚手架”（harnesses）来提升长时运行智能体（long-running agents）的工作效率。

**发布日期：2025 年 11 月 26 日**

<!-- more -->

- [Effective harnesses for long-running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)

智能体在跨越多个上下文窗口工作时仍面临挑战。我们从人类工程师身上汲取灵感，为长时运行的智能体构建了一个更有效的脚手架。

随着 AI 智能体（agents）能力的不断提升，开发者正越来越多地要求它们承担复杂的任务，这些任务往往需要持续数小时甚至数天的工作。然而，让智能体在多个上下文窗口（context windows）中保持连贯的进度仍然是一个悬而未决的问题。

长时运行智能体的核心挑战在于：它们必须在离散的“会话”中工作，且每个新会话开始时都没有之前发生的记忆。想象一下，一个软件项目由实行轮班制的工程师负责，而每位新来的工程师对上一班发生的事情毫无记忆。由于上下文窗口是有限的，且大多数复杂项目无法在单个窗口内完成，智能体需要一种方法来弥合多次编码会话之间的差距。

我们开发了一种方案，使 [Claude Agent SDK](https://platform.claude.com/docs/en/agent-sdk/overview) 能够有效地跨多个上下文窗口工作。该方案包含两部分：一个用于在首次运行时设置环境的**初始化智能体（initializer agent）**，以及一个负责在每个会话中进行增量推进、并为下一个会话留下清晰“产出物”的**编码智能体（coding agent）**。你可以在随附的[快速入门指南](https://github.com/anthropics/claude-quickstarts/tree/main/autonomous-coding)中找到代码示例。

### 长时运行智能体的问题

Claude Agent SDK 是一个强大且通用的智能体脚手架，擅长编码以及其他需要模型使用工具来收集上下文、规划和执行的任务。它具备诸如“压缩”（compaction）之类的上下文管理能力，使智能体能够在不耗尽上下文窗口的情况下持续工作。从理论上讲，有了这种设置，智能体应该能够无限期地从事有用的工作。

然而，仅靠压缩是不够的。在实际测试中，即使是像 Opus 4.5 这样运行在 Claude Agent SDK 上的前沿编码模型，如果仅给定一个高层次的提示词（如“构建一个 claude.ai 的克隆版”），在跨多个上下文窗口循环工作时，也难以构建出生产级质量的 Web 应用。

Claude 的失败通常表现为两种模式：
1. **试图毕其功于一千（One-shotting）**：智能体往往尝试一次性完成太多工作。这通常导致模型在实现过程中耗尽上下文，使得下一个会话开始时功能处于半完成且无文档记录的状态。随后的智能体不得不去猜测之前发生了什么，并花费大量时间尝试让基础应用恢复运行。即使有压缩功能，也不总能向下一个智能体传递完美清晰的指令。
2. **提前宣布胜利**：在项目后期，新的智能体实例可能会观察周围环境，看到已经取得了一些进展，便宣布任务已完成。

我们将问题分解为两个部分。首先，我们需要建立一个初始环境，为提示词要求的所有功能奠定基础，引导智能体逐步、按功能开发。其次，我们应该提示每个智能体在向目标推进的同时，在会话结束时保持环境整洁。所谓“整洁”，是指代码达到可以合并到主分支的标准：没有重大漏洞，代码井然有序且记录详尽，其他开发者可以轻松开始开发新功能，而无需先清理无关的烂摊子。

在内部实验中，我们采用了以下两部分方案：
* **初始化智能体**：第一个智能体会话使用专门的提示词，要求模型设置初始环境，包括：一个 `init.sh` 脚本、一个记录操作日志的 `claude-progress.txt` 文件，以及显示添加了哪些文件的初始 git 提交。
* **编码智能体**：随后的每个会话都要求模型进行增量推进，并留下结构化的更新。

> 在此语境下，我们将它们称为不同的智能体仅是因为它们拥有不同的初始用户提示词。系统提示词、工具集和整体智能体脚手架在其他方面是完全相同的。

这里的关键洞察是：通过 `claude-progress.txt` 文件结合 git 历史记录，让智能体在新上下文窗口开始时能快速理解工作状态。这些实践的灵感源自于优秀软件工程师的日常工作习惯。

### 环境管理

在更新后的 [Claude 4 提示词指南](https://docs.claude.com/en/docs/build-with-claude/prompt-engineering/claude-4-best-practices#multi-context-window-workflows)中，我们分享了多上下文窗口工作流的最佳实践，包括使用“为第一个上下文窗口提供不同提示词”的脚手架结构。这个“不同的提示词”要求初始化智能体设置好环境，包含未来编码智能体高效工作所需的所有上下文。以下是此类环境的一些核心组件：

#### 功能列表 (Feature list)
为了解决智能体试图一次性完成应用或过早结束项目的问题，我们提示初始化智能体根据用户的原始需求编写一份详尽的功能需求文件。在 claude.ai 克隆版的例子中，这意味着超过 200 个功能点，例如“用户可以打开新对话、输入查询、按回车并看到 AI 响应”。这些功能最初都被标记为“失败（failing）”，以便后续的编码智能体对完整功能全貌有清晰的轮廓。

```json
{
  "category": "functional",
  "description": "新建对话按钮可创建新会话",
  "steps": [
    "导航至主界面",
    "点击‘新建对话’按钮",
    "验证新会话已创建",
    "检查对话区域显示欢迎状态",
    "验证会话出现在侧边栏"
  ],
  "passes": false
}
```

我们提示编码智能体仅通过修改 `passes` 字段来编辑此文件，并使用强硬的指令，如“删除或编辑测试是不可接受的，因为这可能导致功能缺失或存在缺陷”。实验证明，使用 JSON 格式比 Markdown 效果更好，因为模型不太会错误地更改或覆盖 JSON 文件。

#### 增量进展 (Incremental progress)
有了初始的环境脚手架，编码智能体被要求一次仅处理一个功能。这种增量方法对于解决智能体“贪多嚼不烂”的倾向至关重要。

在增量工作时，模型在完成代码更改后保持环境整洁同样关键。实验发现，诱导这种行为的最佳方式是要求模型将进度提交到 git（带有描述性的提交信息），并在进度文件中编写摘要。这允许模型利用 git 回滚错误的代码更改，恢复代码库的正常工作状态。

这种方法还提高了效率，因为它消除了智能体猜测发生了什么以及尝试修复基础应用的需要。

#### 测试 (Testing)
我们观察到的最后一个主要失败模式是 Claude 倾向于在没有进行适当测试的情况下标记功能已完成。如果没有明确提示，Claude 往往会修改代码，甚至使用单元测试或 curl 命令对开发服务器进行测试，但却无法意识到功能在端到端（E2E）层面上并不可用。

在构建 Web 应用时，一旦明确提示使用浏览器自动化工具并像人类用户一样进行所有测试，Claude 在验证端到端功能方面表现出色。


为 Claude 提供这类测试工具显著提升了性能，因为智能体能够识别并修复那些仅凭代码无法发现的 Bug。

当然，挑战依然存在，例如 Claude 的视觉局限性或浏览器自动化工具的限制。例如，Claude 无法通过 Puppeteer MCP 看到浏览器原生的弹窗（alert modals），导致依赖这些弹窗的功能往往更容易出错。

### 快速进入状态 (Getting up to speed)

在上述机制到位后，每个编码智能体都会被提示执行一系列步骤来理清头绪：
1. 运行 `pwd` 以查看工作目录。
2. 阅读 git 日志和进度文件，了解最近开展的工作。
3. 阅读功能列表文件，选择优先级最高且未完成的功能进行开发。

这种方法为 Claude 节省了每个会话的 Token，因为它不需要重新摸索如何测试代码。同时，让初始化智能体编写一个 `init.sh` 脚本（用于运行开发服务器）并在实现新功能前运行基础的端到端测试也非常有帮助。

在 claude.ai 克隆项目中，这意味着智能体始终会先启动本地服务器，并使用 Puppeteer MCP 开启新对话、发送消息并接收回复。这确保了 Claude 能快速发现应用是否处于损坏状态，并立即修复现有 Bug。如果智能体直接开始开发新功能，可能会让问题变得更糟。

一个典型的会话通常以如下助理消息开始：

```
> [Assistant] 我将首先理清头绪并了解项目的当前状态。
> [Tool Use] <bash - pwd>
> [Tool Use] <read - claude-progress.txt>
> [Tool Use] <read - feature_list.json>
> [Assistant] 让我检查一下 git 日志以查看最近的工作。
> [Tool Use] <bash - git log --oneline -20>
> [Assistant] 现在检查是否有 init.sh 脚本来重启服务器。
> <启动开发服务器>
> [Assistant] 太棒了！现在让我导航到应用程序并验证一些基础功能是否仍在正常运行。
> <测试基础功能>
> [Assistant] 根据我的验证测试，基础功能运行良好。核心对话、主题切换、会话加载和错误处理均正常。现在我将更全面地审查 tests.json 文件，以确定接下来的开发计划。
> <开始开发新功能>
```

```
[Assistant] I'll start by getting my bearings and understanding the current state of the project.
[Tool Use] <bash - pwd>
[Tool Use] <read - claude-progress.txt>
[Tool Use] <read - feature_list.json>
[Assistant] Let me check the git log to see recent work.
[Tool Use] <bash - git log --oneline -20>
[Assistant] Now let me check if there's an init.sh script to restart the servers.
<Starts the development server>
[Assistant] Excellent! Now let me navigate to the application and verify that some fundamental features are still working.
<Tests basic functionality>
[Assistant] Based on my verification testing, I can see that the fundamental functionality is working well. The core chat features, theme switching, conversation loading, and error handling are all functioning correctly. Now let me review the tests.json file more comprehensively to understand what needs to be implemented next.
<Starts work on a new feature>
```

### 智能体失败模式与对策总结

| 问题 | 初始化智能体行为 | 编码智能体行为 |
| :--- | :--- | :--- |
| **过早宣布项目胜利** | 建立功能列表文件：基于输入规范，创建一个包含端到端功能描述的 JSON 文件。 | 会话开始时阅读功能列表。选择单个功能开始工作。 |
| **残留 Bug 或进度记录不明** | 初始化 git 仓库并编写进度记录文件。 | 会话开始时阅读进度文件和 git 日志，运行基础测试。结束时编写 git 提交和进度更新。 |
| **过早标记功能为已完成** | 建立功能列表文件。 | 对所有功能进行自我验证。仅在仔细测试后才将功能标记为“通过”。 |
| **耗费时间寻找运行方法** | 编写可运行开发服务器的 `init.sh` 脚本。 | 会话开始时读取并运行 `init.sh`。 |

### 未来工作

这项研究展示了在长时运行智能体脚手架中，使模型能够跨多个上下文窗口进行增量推进的一套可行方案。然而，仍有许多开放性问题。

最显著的一点是，目前尚不清楚是单一的通用编码智能体在跨上下文表现最好，还是通过多智能体协作架构能获得更优性能。合理的推测是，专门的智能体（如测试智能体、质量保证智能体或代码清理智能体）在软件开发生命周期的子任务中可能会表现得更出色。

此外，本次演示针对全栈 Web 应用开发进行了优化。未来的方向是将这些发现推广到其他领域。这些经验很有可能被应用到科学研究或金融建模等需要长时运行智能体任务的领域中。
