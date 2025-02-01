---
layout: post
title:  "Claude: Developing a computer use model"
date:   2025-02-01 10:00:00 +0800
categories: Claude arXiv
tags: [Claude, arXiv, Agent, LLM, Anthropics]
---

## [Developing a computer use model（开发计算机使用模型）](https://www.anthropic.com/news/developing-computer-use)

- [Computer use API](https://docs.anthropic.com/en/docs/build-with-claude/computer-use)
- [computer-use-demo](https://github.com/anthropics/anthropic-quickstarts/tree/main/computer-use-demo)

Claude can now use computers. The [latest version of Claude 3.5 Sonnet](http://anthropic.com/news/3-5-models-and-computer-use) can, when run through the appropriate software setup, follow a user’s commands to move a cursor around their computer’s screen, click on relevant locations, and input information via a virtual keyboard, emulating the way people interact with their own computer.

Claude现在可以使用计算机了。[最新版本的Claude 3.5 Sonnet](http://anthropic.com/news/3-5-models-and-computer-use)可以在通过适当的软件设置后，`按照用户的命令在计算机屏幕上移动光标，单击相关位置，并通过虚拟键盘输入信息，模拟人们与自己的计算机交互的方式。`

We think this skill—which is currently in public beta—represents a significant breakthrough in AI progress. Below, we share some insights from the research that went into developing computer use models—and into making them safer.

我们认为这项技能——目前处于公共测试阶段——代表了人工智能进步的重大突破。以下，我们分享了开发计算机使用模型以及使其更安全的研究中的一些见解。


## Why computer use?（为什么要使用计算机？）

Why is this new capability important? A vast amount of modern work happens via computers. Enabling AIs to interact directly with computer software in the same way people do will unlock a huge range of applications that simply aren’t possible for the current generation of AI assistants.

为什么这项新功能很重要？现代工作的大部分内容都是通过计算机完成的。**使AI能够以与人类相同的方式直接与计算机软件交互**，将开启一系列目前现有一代AI助手无法实现的应用。

Over the last few years, many important milestones have been reached in the development of powerful AI—for example, the ability to perform complex logical reasoning and the ability to see and understand images. The next frontier is computer use: AI models that don’t have to interact via bespoke tools, but that instead are empowered to use essentially any piece of software as instructed.

在过去的几年中，人工智能的发展取得了许多重要的里程碑，例如，执行复杂的逻辑推理的能力以及看到和理解图像的能力。下一个前沿是**计算机使用（computer use）**：`AI模型不必通过定制工具进行交互，而是被授权按照指示使用基本上任何软件。`


## The research process（研究过程）

Our previous work on tool use and multimodality provided the groundwork for these new computer use skills. Operating computers involves the ability to see and interpret images—in this case, images of a computer screen. It also requires reasoning about how and when to carry out specific operations in response to what’s on the screen. Combining these abilities, we trained Claude to interpret what’s happening on a screen and then use the software tools available to carry out tasks.

我们之前关于工具使用和多模态的工作为这些新的计算机使用技能奠定了基础。操作计算机涉及到看到和解释图像的能力——在这种情况下，是计算机屏幕上的图像。它还需要推理如何以及何时执行特定操作以响应屏幕上的内容。结合这些能力，我们训练了Claude来解释屏幕上发生的事情，然后使用可用的软件工具来执行任务。

When a developer tasks Claude with using a piece of computer software and gives it the necessary access, Claude looks at screenshots of what’s visible to the user, then counts how many pixels vertically or horizontally it needs to move a cursor in order to click in the correct place. Training Claude to count pixels accurately was critical. Without this skill, the model finds it difficult to give mouse commands—similar to how models often struggle with simple-seeming questions like “how many A’s in the word ‘banana’?”.

`当开发人员要求Claude使用一款计算机软件并给予它必要的访问权限时，Claude会查看用户可见的屏幕截图，然后计算垂直或水平移动光标以便在正确位置单击所需的像素数。`**训练Claude准确计算像素数至关重要**。没有这项技能，模型会发现很难发出鼠标命令——类似于模型经常难以回答简单的问题，比如“‘香蕉’这个词中有多少个A？”。

We were surprised by how rapidly Claude generalized from the computer-use training we gave it on just a few pieces of simple software, such as a calculator and a text editor (for safety reasons we did not allow the model to access the internet during training). In combination with Claude’s other skills, this training granted it the remarkable ability to turn a user’s written prompt into a sequence of logical steps and then take actions on the computer. We observed that the model would even self-correct and retry tasks when it encountered obstacles.

我们对Claude在我们仅仅训练了几款简单软件（例如计算器和文本编辑器）的计算机使用训练中的泛化速度感到惊讶（出于安全原因，我们在训练期间不允许模型访问互联网）。结合Claude的其他技能，这种训练赋予了它将用户的书面提示转化为一系列逻辑步骤然后在计算机上执行操作的非凡能力。`我们观察到，当遇到障碍时，模型甚至会自我纠正并重试任务。`

Although the subsequent advances came quickly once we made the initial breakthrough, it took a great deal of trial and error to get there. Some of our researchers noted that developing computer use was close to the “idealized” process of AI research they’d pictured when they first started in the field: constant iteration and repeated visits back to the drawing board until there was progress.

尽管在我们取得最初的突破后，后续的进展来得很快，但要达到这一点需要大量的试验和错误。我们的一些研究人员指出，开发计算机使用接近于他们在最初进入该领域时所想象的AI研究的“理想化”过程：不断迭代，反复回到起点，直到取得进展。

The research paid off. At present, Claude is state-of-the-art for models that use computers in the same way as a person does—that is, from looking at the screen and taking actions in response. On one evaluation created to test developers’ attempts to have models use computers, [OSWorld](https://os-world.github.io/), Claude currently gets 14.9%. That’s nowhere near human-level skill (which is generally 70-75%), but it’s far higher than the 7.7% obtained by the next-best AI model in the same category.

研究取得了成功。目前，Claude是使用计算机的模型中最先进的模型，就像一个人一样——从查看屏幕并采取相应的操作。为了测试开发人员让模型使用计算机的尝试，[OSWorld](https://os-world.github.io/)创建了一个评估，Claude目前获得了14.9%。这远远不及人类水平（通常为70-75%），但比同一类别中排名第二的AI模型获得的7.7%要高得多。


## Making computer use safe（确保计算机使用安全）

Every advance in AI brings with it new safety challenges. Computer use is mainly a way of lowering the barrier to AI systems applying their existing cognitive skills, rather than fundamentally increasing those skills, so our chief concerns with computer use focus on present-day harms rather than future ones. We confirmed this by assessing whether computer use increases the risk of frontier threats as outlined in our [Responsible Scaling Policy](https://www.anthropic.com/news/announcing-our-updated-responsible-scaling-policy). We found that the updated Claude 3.5 Sonnet, including its new computer use skill, remains at AI Safety Level 2—that is, it doesn’t require a higher standard of safety and security measures than those we currently have in place.

AI的每一次进步都带来了新的安全挑战。计算机使用主要是降低AI系统应用其现有认知技能的门槛，而不是根本性地增加这些技能，因此我们对计算机使用的主要关注点集中在当今的危害上，而不是未来的危害。我们通过评估计算机使用是否增加了我们[负责任的扩展政策](https://www.anthropic.com/news/announcing-our-updated-responsible-scaling-policy)中概述的前沿威胁的风险来确认这一点。我们发现，包括其新的计算机使用技能在内的更新的Claude 3.5 Sonnet仍然处于AI安全等级2——也就是说，它不需要比我们目前已经建立的更高标准的安全措施。

When future models require AI Safety Level 3 or 4 safeguards because they present catastrophic risks, computer use might exacerbate those risks. We judge that it’s likely better to introduce computer use now, while models still only need AI Safety Level 2 safeguards. This means we can begin grappling with any safety issues before the stakes are too high, rather than adding computer use capabilities for the first time into a model with much more serious risks.

当未来的模型需要AI安全等级3或4的保障措施，因为它们具有灾难性风险时，计算机使用可能会加剧这些风险。我们认为，最好是在模型仍然只需要AI安全等级2保障措施时引入计算机使用。这意味着我们可以在风险还不是太高的时候开始处理任何安全问题，而不是在风险更严重的模型中首次添加计算机使用功能。

In this spirit, our Trust & Safety teams have conducted extensive analysis of our new computer-use models to identify potential vulnerabilities. One concern they've identified is “prompt injection”—a type of cyberattack where malicious instructions are fed to an AI model, causing it to either override its prior directions or perform unintended actions that deviate from the user's original intent. Since Claude can interpret screenshots from computers connected to the internet, it’s possible that it may be exposed to content that includes prompt injection attacks.

为此，我们的信任与安全团队对我们的新计算机使用模型进行了广泛的分析，以识别潜在的漏洞。他们确定的一个问题是“**提示注入**”——`一种网络攻击类型，恶意指令被输入到AI模型中，导致其覆盖先前的指令或执行与用户原始意图不符的意外操作。`*由于Claude可以解释来自连接到互联网的计算机的屏幕截图，因此可能会暴露于包含提示注入攻击的内容中。*

Those using the computer-use version of Claude in our public beta should take the relevant precautions to minimize these kinds of risks. As a resource for developers, we have provided further guidance in our [reference implementation](https://github.com/anthropics/anthropic-quickstarts/tree/main/computer-use-demo).

在我们的公共测试版中使用Claude的计算机使用版本的用户应采取相关预防措施，以最小化这类风险。作为开发人员的资源，我们在我们的[参考实现](https://github.com/anthropics/anthropic-quickstarts/tree/main/computer-use-demo)中提供了进一步的指导。

As with any AI capability, there’s also the potential for users to intentionally misuse Claude’s computer skills. Our teams have developed classifiers and other methods to flag and mitigate these kinds of abuses. Given the upcoming U.S. elections, we’re on high alert for attempted misuses that could be perceived as undermining public trust in electoral processes. While computer use is not sufficiently advanced or capable of operating at a scale that would present heightened risks relative to existing capabilities, we've put in place measures to monitor when Claude is asked to engage in election-related activity, as well as systems for nudging Claude away from activities like generating and posting content on social media, registering web domains, or interacting with government websites. We will continuously evaluate and iterate on these safety measures to balance Claude's capabilities with responsible use during the public beta.

与任何AI能力一样，用户也有可能故意滥用Claude的计算机技能。我们的团队已经`开发了分类器和其他方法来标记和减轻这类滥用行为`。鉴于即将到来的美国大选，我们高度警惕可能被视为破坏公众对选举过程的信任的滥用行为。虽然计算机使用还不够先进或能够以相对于现有能力而言提高风险的规模运作，但我们已经采取措施监控Claude何时被要求参与与选举相关的活动，以及推动Claude远离生成和发布社交媒体内容、注册网站域名或与政府网站互动等活动的系统。我们将持续评估和迭代这些安全措施，以在公共测试版期间平衡Claude的能力和负责任的使用。

Consistent with our standard approach to data privacy, by default we don’t train our generative AI models on user-submitted data, including any of the screenshots Claude receives.

与我们对数据隐私的标准处理方式一致，我们默认情况下不会使用用户提交的数据对我们的生成式AI模型进行训练，包括Claude接收到的任何屏幕截图。


## The future of computer use（计算机使用的未来）

Computer use is a completely different approach to AI development. Up until now, LLM developers have made tools fit the model, producing custom environments where AIs use specially-designed tools to complete various tasks. Now, we can make the model fit the tools—Claude can fit into the computer environments we all use every day. Our goal is for Claude to take pre-existing pieces of computer software and simply use them as a person would.

计算机使用是AI开发的一种完全不同的方法。到目前为止，LLM开发人员一直在使工具适应模型，制作定制环境，AI使用专门设计的工具来完成各种任务。现在，我们可以使模型适应工具——Claude可以适应我们每天使用的计算机环境。我们的目标是让Claude接管现有的计算机软件，并简单地像人一样使用它们。

There’s still a lot to do. Even though it’s the current state of the art, Claude’s computer use remains slow and often error-prone. There are many actions that people routinely do with computers (dragging, zooming, and so on) that Claude can’t yet attempt. The “flipbook” nature of Claude’s view of the screen—taking screenshots and piecing them together, rather than observing a more granular video stream—means that it can miss short-lived actions or notifications.

还有很多工作要做。尽管它是目前的技术水平，Claude的计算机使用仍然缓慢且经常出错。人们通常使用计算机进行的许多操作（拖动、缩放等）Claude尚无法尝试。Claude对屏幕的“翻页”视图——拍摄屏幕截图并将它们拼接在一起，而不是观察更精细的视频流——意味着它可能会错过短暂的操作或通知。

Even while we were recording demonstrations of computer use for today’s launch, we encountered some [amusing errors](https://x.com/AnthropicAI/status/1848742761278611504). In one, Claude accidentally clicked to stop a long-running screen recording, causing all footage to be lost. In another, Claude suddenly took a break from our coding demo and began to peruse photos of Yellowstone National Park.

即使在我们为今天的发布录制计算机使用演示时，我们也遇到了一些[有趣的错误](https://x.com/AnthropicAI/status/1848742761278611504)。在其中一个错误中，Claude意外地点击停止了一个长时间运行的屏幕录制，导致所有镜头丢失。在另一个错误中，Claude突然中断了我们的编码演示，并开始浏览黄石国家公园的照片。

We expect that computer use will rapidly improve to become faster, more reliable, and more useful for the tasks our users want to complete. It’ll also become much easier to implement for those with less software-development experience. At every stage, our researchers will be working closely with our safety teams to ensure that Claude’s new capabilities are accompanied by the appropriate safety measures.

我们预计，计算机使用将迅速改进，变得更快、更可靠，并对用户想要完成的任务更有用。对于那些缺乏软件开发经验的人来说，实施起来也会变得更加容易。在每个阶段，我们的研究人员将与我们的安全团队密切合作，确保Claude的新功能伴随着适当的安全措施。


## 参考资料
- [Introducing computer use, a new Claude 3.5 Sonnet, and Claude 3.5 Haiku](https://www.anthropic.com/news/3-5-models-and-computer-use)
