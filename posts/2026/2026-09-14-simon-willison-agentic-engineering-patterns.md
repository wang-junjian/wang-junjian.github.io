---
type: article
title: "Agentic Engineering Patterns（智能体工程模式）"
date: 2026-09-14 20:30:00 +0800
tags: [agentic-engineering, agentic-engineering-patterns, ai-agent, context-engineering, ai-coding, simon-willison]
---

Simon Willison 的 **[《Agentic Engineering Patterns》（智能体工程模式）](https://simonwillison.net/guides/agentic-engineering-patterns/)** 是一份面向软件工程师的实践指南，重点探讨在 **Coding Agents**（如 Claude Code、OpenAI Codex、Cursor 等能自主生成并执行代码、运行测试的智能体）普及的新时代，如何高效、高质量地进行软件开发。

## 一、 核心理念：什么是智能体工程？

**Agentic Engineering（智能体工程）** 明确区别于 **Vibe Coding（氛围编程）**：

* **Vibe Coding**：通常指非程序员完全依赖 LLM 编写代码，自己不看也不理解代码细节。
* **Agentic Engineering**：专业软件工程师通过 Coding Agent 来**放大（Amplify）自身的专业技能**。工程师依然担任架构师与质量把关人的角色，而将重复性、确定性的机械操作交给 Agent。

### 1. 观念重塑：“代码变得极其廉价”

传统软件工程的核心约束是**代码编写成本昂贵**（写几百行优质代码需要数小时或数天），因此衍生出了大量的预先设计、工时评估与严格的 YAGNI（You Aren't Gonna Need It）原则。
在 Agent 时代：

* **初始代码的生成成本趋近于 0**。
* **优质代码的维护与理解成本依然存在**。
* 如果不对 Agent 生成的代码进行严格审查和测试，廉价的代码会迅速演变成庞大的**技术债务（Technical Debt）**。

### 2. “知识囤积”与重组（Hoard & Recombine）

优秀的工程师善于积累自己的代码库、范例项目、工具脚本和工作流模式（Hoard）。Agent 使得这种知识积累能够以极高的效率重新组合（Recombine），成为快速构建新功能的超级杠杆。

---

## 二、 核心模式与工程实践（Patterns）

将智能体工程的模式划分为以下几个关键领域：

### 1. 测试与质量保障（Testing & QA）

* **红/绿 TDD 模式（Red/Green TDD）**：
这是引导 Coding Agent 最简洁有效的 Prompting 技巧。先让 Agent 编写失败的自动化测试（Red），确认测试失败后，再让 Agent 编写实现代码直至测试通过（Green）。TDD 能显著降低 Agent 产生幻觉和冗余代码的概率。
* **先运行现存测试（First Run the Tests）**：
在让 Agent 修改任何代码之前，先指示其运行整个测试套件，确保上下文环境健全，避免基线破坏。
* **智能体式手动测试（Agentic Manual Testing）**：
利用 Puppeteer/Playwright 等浏览器自动化工具，配合自动化截图/日志记录工具，让 Agent 能够“看到”自己构建的 Web UI 并自主完成端到端的验收测试。

### 2. 理解与消除认知负荷（Understanding Code & Cognitive Debt）

代码生成变快后，阅读和理解代码的速度成为了新的瓶颈。通过 Agent 辅助理解代码的模式：

* **线性拆解（Linear Walkthroughs）**：利用工具生成代码执行的逐步分支流程图或笔记，帮助人类开发者快速理清逻辑。
* **交互式讲解（Interactive Explanations）**：让 Agent 为复杂模块自动生成可视化组件、UI 互动演示或词云图，以此降低新代码带来的“认知债务”。

### 3. Agent 的底层机制与机制掌控

深入理解 Agent 的工作原理是精准施控的前提：

* 理解 LLM 的系统提示词（System Prompt）、Tool Calling 机制、Token Caching（Token 缓存）对上下文与成本的影响。
* **Git 深度整合**：使用 Git 作为 Agent 的“安全网”。为 Agent 的尝试性修改建立独立分支，学会使用 Git Commit 历史管理 Agent 的迭代步调，并在必要时及时重写历史（Rewriting History）丢弃错误探索。

### 4. 子智能体协同（Subagents）

* 针对复杂任务，不依靠单个巨型上下文，而是使用专门的**专科子智能体（Specialist Subagents）**或**并行子智能体（Parallel Subagents）**（如 Claude Code 的 Explore 模式），分别负责代码探索、代码审查、安全检查或自动化测试。

---

## 三、 反模式（Anti-Patterns）：需要避免的陷阱

* **向合作者推送未经审查的代码（Inflicting Unreviewed Code on Collaborators）**：
直接把 Agent 一键生成的 Pull Request 扔给团队成员审查是极不负责的。人类工程师必须先对 Agent 输出的代码完成 Read-through（通读）、语义检查与测试验证。
* **盲目积累技术债务**：
因为代码容易生成，就随意引入不必要的第三方依赖或写出过度设计（Over-engineered）的架构。

---

## 四、 总结与启示

**Agentic Engineering（智能体工程）** 展示了 AI 时代的软件开发正在经历一场范式转移：

1. **从“编写代码”转向“引导与验证”**：工程师的核心价值从打字写逻辑，转移到**精确表达需求、设计测试规范、把控架构质量**。
2. **复合工程循环（Compound Engineering Loop）**：利用 Agent 自动化繁琐事务，腾出精力思考更多的技术方案比选，形成“更高质量代码 -> 更好自动化测试 -> 更加 Agent 友好”的正向循环。
