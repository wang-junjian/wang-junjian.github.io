---
layout: single
title:  "Continue - It’s time to collect data on how you build software"
date:   2024-04-07 10:00:00 +0800
categories: Continue GitHubCopilot
tags: [Continue, GitHubCopilot, CodeLLM]
---

> 是时候收集关于你们如何构建软件的数据了。

- [It’s time to collect data on how you build software](https://blog.continue.dev/its-time-to-collect-data-on-how-you-build-software/)

## Development data engine (开发数据引擎)

![](/images/2024/Continue/Continue-Development-Data-Engine.png)

- LLM more helpful with coding (LLM在编码方面更有帮助)
- Developers use LLM while coding more (开发者在编码时更多地使用LLM)
- Better data collected on how software is built (收集到更好的关于软件构建方式的数据)
- Better LLM is trained or fine-tuned (训练或微调更好的LLM)

## 下一代开发者使用大型语言模型（LLMs）而不是谷歌搜索+ Stack Overflow。

随着时间的推移，开发者的偏好和使用的工具也在不断演进。当前一代的开发者正在用大型语言模型（LLMs）取代之前的Google和Stack Overflow，就像之前的一代人用Google和Stack Overflow取代了传统的参考手册一样。
在这个过渡期中，能够保留和吸引开发者的组织将会：

首先，理解他们的开发者如何使用LLMs，并通过收集开发数据——即他们组织构建软件的方式——来展示使用LLMs的投资回报率（ROI）。
然后，利用这个基础建立一个开发数据引擎——一个确保LLMs始终拥有最新信息和代码的持续反馈循环，以他们偏好的风格呈现。
通过展示ROI来增加LLMs预算的工程组织将能够保留他们的顶尖开发者。当新的、有才华的开发者在选择组织时，可用LLMs的质量将是一个重要因素。开发者将会加入并留在那些通过不断改进的LLMs赋予他们力量的地方——这些模型了解他们代码库、项目、风格、最佳实践和技术栈的最新情况。

首先意识到需要更好数据的组织是那些由于隐私和安全问题而不使用LLM API的组织。他们正在自己的基础设施上部署开源LLMs，这些模型一开始就不如GPT-4那么有帮助，并且需要大量改进。但即使是使用OpenAI的组织也面临着既要争取预算又要处理数据陈旧性的需求（例如，GPT-4不知道某个库的v3版本，因为它是在2021年11月发布的）。

## 你的组织需要收集关于你们如何构建软件的数据。

为了理解和扩展团队上LLMs的使用，你需要收集有关你的组织如何构建软件的数据。你已经收集了很多数据：源代码、Git版本、问题/工单、PRs/MRs、讨论、日志等。这些数据对于训练第一批具备编码能力的LLMs起到了关键作用。然而，这些数据更多地关注的是构建了什么，而不是如何构建的。

要使LLMs对你的开发者更有帮助，你需要收集更好的数据，了解Git提交之间发生了什么。现有的数据通常缺少三个关键方面：

1. 开发者完成任务的逐步过程
2. 开发者在每一步决定做什么的上下文
3. 解释步骤背后推理的自然语言

好消息是，作为LLM辅助开发的副产品，这样的数据已经在被创造。假设你的团队上有一个开发者，名叫Hiro。为了获得建议，Hiro需要收集上下文（例如代码、文档等），并将其提供给LLM。随着Hiro和LLM的互动，他们将迭代地完成任务，使用代码和自然语言的混合。当这些数据与Hiro最终提交的代码结合时，提供了软件构建方式的丰富描述。

坏消息是，几乎所有的开发者都通过Copilot和ChatGPT使用LLMs，这意味着基本上除了GitHub和OpenAI之外，没有人在收集这些数据。当Hiro在Copilot的建议后是否按下Tab键，或者Hiro决定是否应该复制ChatGPT生成的代码时，这些信号告诉这些产品在未来应该更多或更少地做什么。即使Hiro后来编辑了代码，建议生成的代码与最终状态之间的差异也可以用作信号。

关于如何最佳捕获、结构化和应用这些开发数据以创建更有帮助的LLMs，仍然有许多悬而未决的问题，但很明显，收集像Hiro这样的开发者的隐式反馈，以推动开发数据引擎是关键。感谢个人的努力，他们的数据可以用来改进LLMs，从而使整个团队受益。

## Continue 帮助你自动收集这些数据。

在 Continue，我们致力于加速优秀软件的创造。但对于每个工程团队来说，优秀意味着不同的事物。

这也是我们正在构建一个开源的编码自动驾驶系统的原因，它允许你自动收集你的开发数据。通过这些数据，你可以计算LLMs的投资回报率（ROI）。你可以更好地了解什么在困扰你的开发者。而且你可以改进模型来帮助他们克服这些挑战。

我们正在与具有前瞻性的组织合作，建立他们的开发数据引擎。我们首先帮助他们提取、加载和转换他们的数据，这样他们就可以了解他们的开发者当前如何使用LLMs，并为将来改进LLMs建立所需的基础。如果你有兴趣与我们合作，请通过 data@continue.dev 电子邮件联系我们。


## 参考资料
- [Continue](https://continue.dev/)
- [Continue Blog](https://blog.continue.dev/)
- [Continue Docs](https://continue.dev/docs)
- [Continue - GitHub](https://github.com/continuedev/continue)
