---
layout: post
title:  "Sourcegraph Cody"
date:   2024-01-14 08:00:00 +0800
categories: Sourcegraph Cody
tags: [Sourcegraph, Cody, AICodingAssistant, GitHubCopilot]
---

## [Sourcegraph Cody](https://about.sourcegraph.com/)
- [Sourcegraph Docs](https://docs.sourcegraph.com/)
- [Blog](https://about.sourcegraph.com/blog)
- [Sourcegraph Cody](https://sourcegraph.com/blog/cody-is-generally-available)
- [Copilot vs. Cody: Why context matters for code AI](https://about.sourcegraph.com/blog/copilot-vs-cody-why-context-matters-for-code-ai)
- [The lifecycle of a code AI completion](https://about.sourcegraph.com/blog/the-lifecycle-of-a-code-ai-completion)
- [How we’re thinking about the levels of code AI](https://about.sourcegraph.com/blog/levels-of-code-ai)
- [Top 5 tips for using Cody with React](https://about.sourcegraph.com/blog/top-5-tips-for-using-cody-with-react)

## [Sourcegraph](https://sourcegraph.com/)
### [代码搜索](https://sourcegraph.com/search)
![](/images/2024/Cody/sourcegraph-code-search.png)

#### Repositories
- [kubernetes/kubernetes](https://sourcegraph.com/github.com/kubernetes/kubernetes)
- [lm-sys/FastChat](https://sourcegraph.com/github.com/lm-sys/FastChat)

## [Cody](https://sourcegraph.com/cody/chat)
### 代码 AI 补全
![](/images/2024/Cody/single-line-autocomplete.png)

### AI 聊天
![](/images/2024/Cody/cody-chat-interface.png)

## [Cody 的代码 AI 补全的生命周期](https://about.sourcegraph.com/blog/the-lifecycle-of-a-code-ai-completion)

### 代码补全的四个步骤
每一次 Cody 的代码补全都经历了四个步骤：

![](/images/2024/Cody/4-step-diagram.png)

- 规划（Planning） - 分析代码上下文以确定生成补全的最佳方法，例如：使用单行还是多行补全。
- 检索（Retrieval） - 从代码库中找到相关的代码示例，为 LLM 提供最佳可能的上下文。
- 生成（Generation） - 使用 LLM 基于提供的提示和上下文生成代码补全。
- 后处理（Post-processing） - 精炼和过滤原始的 AI 生成的补全，以提供最相关的建议。

Cody 的目标是提供高质量的补全，无缝集成到开发者的工作流程中。创建一个有效的代码 AI 助手需要正确的`上下文（context）`，`提示（prompt）`和 `LLM`。通过语法分析（[Tree-sitter](https://tree-sitter.github.io/tree-sitter/)），智能提示工程（smart prompt engineering），正确的 LLM 选择和正确的遥测（telemetry），不断迭代和提高 Cody 的代码补全质量和接受率（acceptance rate）。最新的数字显示 Cody 的补全接受率高达 `30%`。

### 跟踪的指标
- **接受率（Acceptances）**：一个直接的成功标准：如果用户使用 tab 键插入一个补全，这是一个强烈的信号，表明这个补全确实是有帮助的。

- **部分接受率（Partial acceptances）**：VS Code 特别有一个 UI 只接受补全的一个单词或一行。对于部分接受，也记录了添加了多少（以字符数量计）补全，并且只在插入了至少一个完整的补全单词时记录部分接受。

- **补全保留（Completion retention）**：为了更好地理解补全的有用性，还跟踪了补全在插入后随着时间的推移是如何变化的。为此，有一个记录系统，它检测文档的变化以更新补全插入的初始范围，然后在特定的轮询间隔使用 Levenshtein 编辑距离来捕获初始补全的多少仍然存在。

基于这些事件，可以计算出最重要的指标，那就是**补全接受率（completion acceptance rate）**。这是一个将许多标准（如：延迟和质量）合并成一个数字的指标。

## 参考资料
- [Cody](https://about.sourcegraph.com/cody)
- [Sourcegraph](https://about.sourcegraph.com/code-search)
- [GitHub: Cody](https://github.com/sourcegraph/cody)
- [GitHub: Sourcegraph](https://github.com/sourcegraph/sourcegraph)
