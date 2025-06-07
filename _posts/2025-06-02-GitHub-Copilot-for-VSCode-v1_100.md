---
layout: single
title:  "GitHub Copilot for VSCode v1.100"
date:   2025-06-01 10:00:00 +0800
categories: GitHubCopilot AICodingAssistant
tags: [GitHubCopilot, VSCode, AICodingAssistant]
---

本文档介绍了 Copilot 的三种主要模式——**询问 (Ask)**、**编辑 (Edit)** 和 **代理 (Agent)**，并列举了 Copilot 可访问的各种工具，例如 **搜索用法 (#usages)**、**获取网页信息 (#fetch)**、**搜索 Marketplace 扩展 (#extensions)** 和 **搜索 GitHub 仓库代码 (#githubRepo)**，以增强模型上下文。还详细描述了 **提示文件 (Prompt files)** 和 **指令文件 (Instructions files)** 的目的和使用，并展示了如何通过这些文件管理和定制 AI 模型的行为。

![](/images/2025/VSCode-GitHubCopilot/GitHubCopilot.png)

- **提问**：这与之前的“聊天”视图相同。您可以就您的工作区或一般编码问题向任何模型提问。使用 @ 符号可以调用内置的聊天参与者或已安装的扩展。使用 # 符号可以手动附加任何类型的上下文。
- **代理**：启动一个代理编码流程，其中包含一套工具，使其能够自主收集上下文、运行终端命令或执行其他操作来完成任务。代理模式已为所有 VS Code Insiders 用户启用，并且我们正在向更多 VS Code Stable 用户推出。
- **编辑**：在编辑模式下，模型可以对多个文件进行定向编辑。附加 #codebase 可以让它自动查找要编辑的文件。但它不会运行终端命令或自动执行任何其他操作。

![](/images/2025/VSCode-GitHubCopilot/UnifiedChatView.png)

![](/images/2025/VSCode-GitHubCopilot/PromptFiles.png)

![](/images/2025/VSCode-GitHubCopilot/InstructionsFiles.png)

![](/images/2025/VSCode-GitHubCopilot/InstructionsFiles-vs-PromptFiles.png)

![](/images/2025/VSCode-GitHubCopilot/githubRepo.png)

![](/images/2025/VSCode-GitHubCopilot/fetch.png)

![](/images/2025/VSCode-GitHubCopilot/extensions.png)

![](/images/2025/VSCode-GitHubCopilot/usages.png)

![](/images/2025/VSCode-GitHubCopilot/MCP_GitHub-Copilot-Chat.png)

![](/images/2025/VSCode-GitHubCopilot/MCPConfig.png)

![](/images/2025/VSCode-GitHubCopilot/MCP.png)

![](/images/2025/VSCode-GitHubCopilot/pythonGetEnvironmentInfo.jpeg)

![](/images/2025/VSCode-GitHubCopilot/pythonInstallPackage.jpeg)

- [VSCode - April 2025 (version 1.100)](https://code.visualstudio.com/updates/v1_100)
- [VSCode - March 2025 (version 1.99)](https://code.visualstudio.com/updates/v1_99)
