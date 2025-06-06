---
layout: single
title:  "Anthropic: 构建有效的AI智能体"
date:   2025-05-05 10:00:00 +0800
categories: Anthropic Agent
tags: [Anthropic, Agent, Workflow]
---

# Anthropic 构建有效的AI智能体（总结）

🤯 最近看了Anthropic关于如何构建高效AI智能体的文章，简直是醍醐灌顶！💡 原来最成功的秘诀不是堆砌复杂技术，而是简单可组合的模式！

Anthropic的大佬们和超多团队合作后发现，很多时候我们并不需要“全自动”的智能体，理解不同模式的适用场景超重要！

👇 **先搞清楚俩概念：**

* **工作流 (Workflow):** 就像搭积木🧱，是预设好的、一步步执行的LLM和工具协调流程。适合任务清晰固定的场景。
* **智能体 (Agent):** 像有个聪明的小脑袋🧠，LLM自己决定怎么走、用什么工具、怎么完成任务。适合需要灵活应变、动态决策的复杂场景。

🌟 **什么时候用，什么时候不用？**

别一上来就想搞个超级Agent！ Anthropic建议从最简单的方案开始：优化单个LLM调用 + 检索/上下文就够了！只有简单方案搞不定时，才考虑更复杂的系统。简单工作流提供稳定可预测性，而智能体提供灵活性，但要权衡成本和速度哦！

⚠️ **框架迷思！**

市面上框架一大堆（LangChain, Bedrock Agents...），能帮你快速入门。但Anthropic提醒：它们可能增加抽象层，让调试变难，还可能诱惑你过度设计！💥 **划重点：** 建议直接用LLM API开始，很多模式几行代码就能实现！用框架也要搞懂底层原理，别被绕晕！

🧱 **AI智能体的构建模块：**

基础是**增强型LLM**，能自主调用工具、记忆、检索。关键是把这些能力**定制化**，并提供**友好易用**的接口！

✨ **那些超好用的工作流模式（不是非得Agent哦！）**

* **提示链 (Prompt Chaining):** 任务拆解，一步步LLM处理，像流水线，提高准确率！💧 (例：写文案->翻译)
* **路由 (Routing):** 智能分流！根据输入类型导向不同流程，像交通指挥！🚦 (例：客服问题分类)
* **并行化 (Parallelization):** 多线程操作！任务分解并行/多次运行取最优，效率翻倍！🚀 (例：护栏检查、代码审查)
* **协调者-工作者 (Orchestrator-Worker):** 大脑分配任务！中心LLM动态分解任务给其他LLM，像项目经理！👨‍💼 (例：复杂编程改动)
* **评估器-优化器 (Evaluator-Optimizer):** 不断迭代优化！一个LLM生成，一个提供反馈循环改进，像精修文章！✍️ (例：文学翻译、复杂搜索)

🤖 **自主智能体 (Autonomous Agent):**

当任务超级开放、步骤无法预测时，Agent登场！它能独立规划、使用工具、从环境反馈学习，像有自我意识！🤯 适合在受信任环境扩展任务，但成本更高，也可能累积错误。**切记：** 必须在沙箱测试，设置好护栏，别让Agent“裸奔”！

核心原则：工具是王道！设计工具集（ACI）像设计人机界面一样重要，要清晰易懂，方便模型调用。

💡 **干货总结三原则：**

1.  **简单性 (Simplicity):** 设计要简单明了！
2.  **透明度 (Transparency):** 让Agent的思考过程清晰可见！
3.  **良好ACI (Well-engineered ACI):** 精心构建工具接口，模型用起来不费劲！🛠️

别追赶最复杂的，找到最适合你需求的才是王道！从简单开始，一步步迭代吧！冲鸭！🚀

- [Building effective agents](https://www.anthropic.com/engineering/building-effective-agents)


# [Anthropic 构建有效的AI智能体](https://www.anthropic.com/engineering/building-effective-agents)

## Anthropic的工程实践

在过去的一年里，我们与数十个团队合作，为各个行业的大型语言模型（LLM）智能体提供支持。我们发现，最成功的实现并不是依赖复杂的框架或专门的库，而是通过简单、可组合的模式来构建。

在本文中，我们将分享我们在与客户合作以及自行构建智能体过程中学到的经验，并为开发人员提供关于如何构建有效智能体的实用建议。

## 什么是智能体？

“智能体”可以有多种定义。一些客户将智能体定义为能够在较长时间内独立运行的完全自治系统，它们可以使用各种工具来完成复杂任务。另一些客户则用它来描述遵循预定义工作流的更为规范的实现。在Anthropic，我们将所有这些变体都归类为**智能体系统**，但我们在架构上对**工作流**和**智能体**进行了重要的区分：

- **工作流**是通过预定义代码路径来协调LLM和工具的系统。
- **智能体**则是LLM动态指导自身流程和工具使用，并控制完成任务的方式的系统。

在下文中，我们将详细探讨这两种类型的智能体系统。在附录1（“智能体的实际应用”）中，我们描述了客户在使用这些系统时发现特别有价值的两个领域。

## 何时（以及何时不）使用智能体

在使用LLM构建应用程序时，我们建议寻找尽可能简单的解决方案，并且只有在需要时才增加复杂性。这可能意味着根本不需要构建智能体系统。智能体系统通常会在延迟和成本方面进行权衡，以换取更好的任务性能，您需要考虑这种权衡是否合理。

当需要更多复杂性时，工作流为明确定义的任务提供了可预测性和一致性，而智能体则是在需要大规模灵活性和模型驱动决策时的更好选择。然而，对于许多应用程序来说，优化单个LLM调用，结合检索和上下文示例，通常就足够了。

## 何时以及如何使用框架

有许多框架可以简化智能体系统的实现，包括：

- LangChain的LangGraph；
- Amazon Bedrock的AI智能体框架；
- Rivet，一个拖放式GUI LLM工作流构建器；
- Vellum，另一个用于构建和测试复杂工作流的GUI工具。

这些框架通过简化标准低级任务（如调用LLM、定义和解析工具以及链接调用）来帮助您快速入门。然而，它们通常会创建额外的抽象层，可能会掩盖底层的提示和响应，使调试变得更加困难。它们也可能诱使您在简单的设置就足够的情况下增加复杂性。

我们建议开发人员从直接使用LLM API开始：许多模式可以用几行代码实现。如果您确实使用了框架，请确保您理解底层代码。对底层代码的错误假设是客户常见错误的来源。

在我们的 [cookbook](https://github.com/anthropics/anthropic-cookbook/tree/main/patterns/agents) 中，您可以找到一些示例实现。

## 构建模块、工作流和智能体

在本节中，我们将探讨我们在生产中看到的智能体系统的常见模式。我们将从基础构建模块——增强型LLM开始，并逐步增加复杂性，从简单的工作流到自治智能体。

### 构建模块：增强型LLM

智能体系统的基础构建模块是经过增强的LLM，例如增加了检索、工具和记忆等功能。我们的当前模型可以主动使用这些能力——生成自己的搜索查询、选择合适的工具并确定要保留哪些信息。

![增强型LLM](/images/2025/Anthropic-BuildingEffectiveAgents/The-augmented-LLM.webp)

我们建议专注于实现的两个关键方面：将这些能力针对您的特定用例进行定制，并确保它们为您的LLM提供易于使用且文档完善的接口。虽然有许多方法可以实现这些增强功能，但一种方法是通过我们最近发布的[模型上下文协议](https://www.anthropic.com/news/model-context-protocol)，该协议允许开发人员通过简单的客户端实现与不断增长的第三方工具生态系统进行集成。

在本文的其余部分中，我们将假设每个LLM调用都可以访问这些增强能力。

### 工作流：提示链

提示链将任务分解为一系列步骤，每个LLM调用处理前一个调用的输出。您可以在任何中间步骤添加程序化检查（见下图中的“gate”）以确保流程仍在正轨上。

![提示链工作流](/images/2025/Anthropic-BuildingEffectiveAgents/The-prompt-chaining-workflow.webp)

**何时使用此工作流：** 此工作流适用于任务可以轻松且清晰地分解为固定子任务的情况。主要目标是通过将每个LLM调用变成更简单的任务来换取更高的准确性，从而降低延迟。

**提示链适用的示例：**

- 生成营销文案，然后将其翻译成其他语言。
- 编写文档大纲，检查大纲是否符合某些标准，然后根据大纲撰写文档。

### 工作流：路由

路由对输入进行分类，并将其导向专门的后续任务。此工作流允许分离关注点，并构建更专业的提示。如果没有此工作流，优化一种输入可能会损害其他输入的性能。

![路由工作流](/images/2025/Anthropic-BuildingEffectiveAgents/The-routing-workflow.webp)

**何时使用此工作流：** 路由适用于复杂任务，其中存在不同的类别，这些类别可以分别处理，并且可以通过LLM或更传统的分类模型/算法准确地进行分类。

**路由适用的示例：**

- 将不同类型的客户服务查询（一般问题、退款请求、技术支持）导向不同的下游流程、提示和工具。
- 将简单/常见问题路由到较小的模型（如Claude 3.5 Haiku），将复杂/不常见的问题路由到更强大的模型（如Claude 3.5 Sonnet），以优化成本和速度。

### 工作流：并行化

LLM有时可以同时处理任务，并通过程序化方式聚合其输出。此工作流，即并行化，有以下两种关键变体：

- **分段**：将任务分解为独立的子任务并并行运行。
- **投票**：多次运行相同任务以获得多样化的输出。

![并行化工作流](/images/2025/Anthropic-BuildingEffectiveAgents/The-parallelization-workflow.webp)

**何时使用此工作流：** 并行化在可以并行化子任务以提高速度时，或者在需要多种视角或多次尝试以获得更高置信度结果时非常有效。对于具有多个考虑因素的复杂任务，LLM通常在每个考虑因素由单独的LLM调用处理时表现更好，从而可以专注于每个具体方面。

**并行化适用的示例：**

- **分段**：
  - 实现护栏，其中一个模型实例处理用户查询，而另一个模型实例对其进行不当内容或请求的筛查。这通常比让同一个LLM调用同时处理护栏和核心响应表现更好。
  - 自动化评估以评估LLM性能，其中每个LLM调用评估模型在给定提示上的不同方面。
- **投票**：
  - 审查代码是否存在漏洞，多个不同的提示审查并标记代码，如果发现问题则标记。
  - 评估给定内容是否不当，多个提示从不同方面进行评估，或者需要不同的投票阈值以平衡误报和漏报。

### 工作流：协调者-工作者

在协调者-工作者工作流中，一个中心LLM动态分解任务，将其分配给工作者LLM，并综合它们的结果。

![协调者-工作者工作流](/images/2025/Anthropic-BuildingEffectiveAgents/The-orchestrator-workers-workflow.webp)

**何时使用此工作流：** 此工作流适用于复杂任务，您无法预测所需的子任务（例如在编程中，需要更改的文件数量以及每个文件的更改性质可能取决于任务）。虽然它在拓扑上与并行化相似，但关键区别在于其灵活性——子任务不是预先定义的，而是由协调者根据具体输入确定。

**协调者-工作者适用的示例：**

- 编程产品，每次对多个文件进行复杂更改。
- 搜索任务，涉及从多个来源收集和分析可能相关信息。

### 工作流：评估器-优化器

在评估器-优化器工作流中，一个LLM调用生成响应，而另一个LLM调用在循环中提供评估和反馈。

![评估器-优化器工作流](/images/2025/Anthropic-BuildingEffectiveAgents/The-evaluator-optimizer-workflow.webp)

**何时使用此工作流：** 此工作流在我们有明确的评估标准，并且迭代细化可以带来显著价值时特别有效。适用的两个标志是：首先，当人类明确表达反馈时，LLM响应可以得到明显改进；其次，LLM可以提供这种反馈。这类似于人类作家在撰写一篇精心打磨的文档时所经历的迭代写作过程。

**评估器-优化器适用的示例：**

- 文学翻译，其中翻译LLM可能无法最初捕捉到细微差别，但评估LLM可以提供有用的批评。
- 复杂搜索任务，需要多轮搜索和分析以收集全面信息，评估器决定是否需要进一步搜索。

### 智能体

随着LLM在关键能力上逐渐成熟——理解复杂输入、进行推理和规划、可靠使用工具以及从错误中恢复——智能体开始在生产中出现。智能体从人类用户的命令或互动对话开始工作。一旦任务明确，智能体就会独立规划和操作，可能会返回人类那里以获取更多信息或判断。在执行过程中，智能体在每一步都必须从环境中获得“真实情况”（例如工具调用结果或代码执行），以评估其进展。智能体可以在检查点或遇到阻碍时暂停以获取人类反馈。任务通常在完成后终止，但通常也会包括停止条件（例如最大迭代次数），以保持控制。

智能体可以处理复杂的任务，但其实现通常很简单。它们通常是LLM基于环境反馈以循环方式使用工具。因此，设计工具集及其文档清晰且周到至关重要。我们在附录2（“提示工程你的工具”）中扩展了工具开发的最佳实践。

![自治智能体](/images/2025/Anthropic-BuildingEffectiveAgents/Autonomous-agent.webp)

**何时使用智能体：** 智能体可用于开放性问题，这些问题难以或无法预测所需的步骤数量，并且无法硬编码固定路径。LLM可能会运行多个回合，您必须对其决策有一定的信任。智能体的自主性使其适合在受信任的环境中扩展任务。

智能体的自主性意味着更高的成本，以及错误累积的可能性。我们建议在沙箱环境中进行广泛的测试，并设置适当的护栏。

**智能体适用的示例：**

以下示例来自我们自己的实现：

- 用于解决[SWE-bench任务](https://www.anthropic.com/research/swe-bench-sonnet)的编码智能体，这些任务涉及根据任务描述对多个文件进行编辑。
- 我们的[“计算机使用”参考实现](https://github.com/anthropics/anthropic-quickstarts/tree/main/computer-use-demo)，Claude使用计算机完成任务。

![编码智能体的高级流程](/images/2025/Anthropic-BuildingEffectiveAgents/High-level-flow-of-a-coding-agent.webp)

## 组合和定制这些模式

这些构建模块并不是固定的。它们是开发人员可以根据不同用例进行调整和组合的常见模式。与任何LLM功能一样，成功的关键在于衡量性能并迭代实现。再次强调：只有当复杂性确实可以改善结果时，才考虑增加复杂性。

## 总结

在LLM领域取得成功并不是要构建最复杂的系统，而是要构建适合您需求的**正确**系统。从简单的提示开始，通过全面评估进行优化，并且只有在简单解决方案不足时才增加多步智能体系统。

在实现智能体时，我们尽量遵循以下三个核心原则：

1. 保持智能体设计的**简单性**。
2. 优先考虑**透明度**，明确展示智能体的规划步骤。
3. 通过彻底的工具**文档和测试**精心构建智能体-计算机接口（ACI）。

框架可以帮助您快速入门，但不要犹豫减少抽象层，并在进入生产时使用基本组件。遵循这些原则，您可以创建出不仅强大而且可靠、可维护并值得用户信赖的智能体。

### 致谢

由Erik Schluntz和Barry Zhang撰写。这项工作基于我们在Anthropic构建智能体的经验以及客户分享的宝贵见解，在此我们深表感谢。

## 附录1：智能体的实际应用

我们与客户合作的经验揭示了两个特别有前景的AI智能体应用领域，这些领域展示了上述讨论模式的实际价值。这两个应用都说明了智能体在需要对话和行动的任务中增加价值的场景，这些任务具有明确的成功标准，能够实现反馈循环，并且整合了有意义的人类监督。

### A. 客户支持

客户支持将熟悉的聊天机器人界面与工具集成相结合，增强了其能力。这是更开放性智能体的自然契合，因为：

- 支持互动自然遵循对话流程，同时需要访问外部信息和行动；
- 可以集成工具来提取客户数据、订单历史记录和知识库文章；
- 可以通过编程处理诸如退款或更新工单等行动；
- 可以通过用户定义的解决方案清晰地衡量成功。

一些公司通过基于使用量的定价模型展示了这种方法的可行性，该模型仅对成功解决方案收费，显示出对智能体有效性的信心。

### B. 编码智能体

软件开发领域已经展示了LLM功能的巨大潜力，其能力从代码补全发展到自主解决问题。智能体特别有效，因为：

- 可以通过自动化测试验证代码解决方案；
- 智能体可以根据测试结果迭代解决方案；
- 问题空间是明确定义且结构化的；
- 输出质量可以客观衡量。

在我们自己的实现中，智能体现在可以根据拉取请求描述解决SWE-bench验证基准中的真实GitHub问题。然而，尽管自动化测试有助于验证功能，但人类审查仍然至关重要，以确保解决方案符合更广泛的系统要求。

## 附录2：提示工程你的工具

无论您正在构建哪种智能体系统，工具很可能是您智能体的重要组成部分。工具使Claude能够通过在我们的API中指定其确切结构和定义来与外部服务和API进行交互。当Claude响应时，如果它计划调用工具，它将在API响应中包含一个工具使用块。工具定义和规范应该像您的整体提示一样受到提示工程的关注。在本简短附录中，我们描述了如何对工具进行提示工程。

通常有几种方法可以指定相同的动作。例如，您可以通过编写差异或重写整个文件来指定文件编辑。对于结构化输出，您可以在Markdown中返回代码，也可以在JSON中返回代码。在软件工程中，这些差异是表面的，可以从一种转换为另一种而不会丢失信息。然而，对于LLM来说，有些格式比其他格式更难编写。编写差异需要在写入新代码之前知道要更改的行数。在JSON中编写代码（与Markdown相比）需要额外转义换行符和引号。

我们对决定工具格式的建议如下：

- 给模型足够的token来“思考”，以避免它陷入困境。
- 保持格式接近模型在互联网上自然看到的文本。
- 确保没有格式“开销”，例如不需要准确计数数千行代码，或对代码进行字符串转义。

一个经验法则是考虑人类-计算机界面（HCI）中投入了多少努力，并计划在创建良好的智能体-计算机界面（ACI）上投入同样多的努力。以下是一些关于如何做到这一点的想法：

- 设身处地为模型着想。根据描述和参数，使用这个工具是否显而易见，还是需要仔细思考？如果是后者，那么模型可能也是如此。一个好的工具定义通常包括示例用法、边缘情况、输入格式要求以及与其他工具的明确界限。
- 您如何更改参数名称或描述以使其更明显？将其视为为团队中的初级开发人员编写一个出色的docstring。当使用许多相似的工具时，这一点尤其重要。
- 测试模型如何使用您的工具：在我们的工作台中运行许多示例输入，查看模型犯了什么错误，并进行迭代。
- 防错工具。更改参数，使其更难犯错。

在构建我们的SWE-bench智能体时，我们实际上在优化工具上花费的时间比在整体提示上更多。例如，我们发现模型在智能体离开根目录后使用相对文件路径时会犯错误。为了解决这个问题，我们将工具更改为始终需要绝对文件路径 - 我们发现模型完美地使用了这种方法。
