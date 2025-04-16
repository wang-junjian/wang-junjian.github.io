---
layout: post
title:  "Agent2Agent 协议 (A2A)"
date:   2025-04-16 08:00:00 +0800
categories: A2A Agent
tags: [A2A, Agent]
---

## [A2A](https://github.com/google/A2A)
***一个开放协议，旨在实现不透明的智能代理应用程序之间的通信和互操作性。***

  - [Agent2Agent 协议 A2A](https://www.google.com/search?q=%23agent2agent-%E5%8D%8F%E8%AE%AE-a2a)
      - [入门](https://www.google.com/search?q=%23%E5%85%A5%E9%97%A8)
      - [贡献](https://www.google.com/search?q=%23%E8%B4%A1%E7%8C%AE)
      - [下一步是什么](https://www.google.com/search?q=%23%E4%B8%8B%E4%B8%80%E6%AD%A5%E6%98%AF%E4%BB%80%E4%B9%88)
      - [关于](https://www.google.com/search?q=%23%E5%85%B3%E4%BA%8E)

企业采用人工智能的最大挑战之一是如何让基于不同框架和供应商构建的代理协同工作。这就是我们创建开放的 **Agent2Agent (A2A) 协议**的原因，这是一种协作方式，旨在帮助不同生态系统中的代理相互通信。Google 正在推动这项行业开放协议倡议，因为我们相信这个协议对于支持多代理通信至关重要，它将为您的代理提供一种通用语言——无论它们构建于哪个框架或供应商之上。借助 **A2A**，代理可以相互展示它们的功能并协商如何与用户交互（通过文本、表单或双向音频/视频）——所有这些都在安全地协同工作的同时进行。

### **观看 A2A 的实际应用**

观看[此演示视频](https://storage.googleapis.com/gweb-developer-goog-blog-assets/original_videos/A2A_demo_v4.mp4)，了解 A2A 如何实现不同代理框架之间的无缝通信。

### 概念概述

Agent2Agent (A2A) 协议促进了独立 AI 代理之间的通信。以下是核心概念：

  * **代理卡片 (Agent Card):** 一个公开的元数据文件（通常位于 `/.well-known/agent.json`），描述了代理的功能、技能、端点 URL 和身份验证要求。客户端使用它进行发现。
  * **A2A 服务器 (A2A Server):** 一个公开 HTTP 端点并实现 A2A 协议方法（定义在 [json 规范](https://www.google.com/search?q=/specification) 中）的代理。它接收请求并管理任务执行。
  * **A2A 客户端 (A2A Client):** 一个消费 A2A 服务的应用程序或另一个代理。它向 A2A 服务器的 URL 发送请求（如 `tasks/send`）。
  * **任务 (Task):** 中心的工作单元。客户端通过发送消息（`tasks/send` 或 `tasks/sendSubscribe`）来启动任务。任务具有唯一的 ID，并经历以下状态：`submitted`（已提交）、`working`（工作中）、`input-required`（需要输入）、`completed`（已完成）、`failed`（失败）、`canceled`（已取消）。
  * **消息 (Message):** 表示客户端（`role: "user"`）和代理（`role: "agent"`）之间的通信轮次。消息包含 `Parts`（部件）。
  * **部件 (Part):** `Message` 或 `Artifact`（工件）中的基本内容单元。可以是 `TextPart`（文本部件）、`FilePart`（文件部件，包含内联字节或 URI）或 `DataPart`（数据部件，用于结构化 JSON，例如表单）。
  * **工件 (Artifact):** 表示代理在任务期间生成的输出（例如，生成的文件、最终的结构化数据）。工件也包含 `Parts`（部件）。
  * **流式传输 (Streaming):** 对于长时间运行的任务，支持 `streaming` 功能的服务器可以使用 `tasks/sendSubscribe`。客户端接收服务器发送事件 (SSE)，其中包含 `TaskStatusUpdateEvent`（任务状态更新事件）或 `TaskArtifactUpdateEvent`（任务工件更新事件）消息，提供实时的进度。
  * **推送通知 (Push Notifications):** 支持 `pushNotifications` 的服务器可以主动向客户端提供的 webhook URL 发送任务更新，该 URL 通过 `tasks/pushNotification/set` 配置。

**典型流程：**

1.  **发现 (Discovery):** 客户端从服务器的 well-known URL 获取代理卡片。
2.  **启动 (Initiation):** 客户端发送包含初始用户消息和唯一任务 ID 的 `tasks/send` 或 `tasks/sendSubscribe` 请求。
3.  **处理 (Processing):**
      * **(流式传输):** 服务器在任务进行过程中发送 SSE 事件（状态更新、工件）。
      * **(非流式传输):** 服务器同步处理任务并在响应中返回最终的 `Task` 对象。
4.  **交互 (可选):** 如果任务进入 `input-required` 状态，客户端使用相同的任务 ID 通过 `tasks/send` 或 `tasks/sendSubscribe` 发送后续消息。
5.  **完成 (Completion):** 任务最终达到终止状态（`completed`、`failed`、`canceled`）。

### **入门**

  * 📚 阅读[技术文档](https://google.github.io/A2A/#/documentation)以了解各项功能
  * 📝 查看协议结构的 [json 规范](https://www.google.com/search?q=/specification)
  * 🎬 使用我们的 [示例](https://www.google.com/search?q=/samples) 来了解 A2A 的实际应用
      * 示例 A2A 客户端/服务器 ([Python](https://www.google.com/search?q=/samples/python/common), [JS](https://www.google.com/search?q=/samples/js/src))
      * [多代理 Web 应用](https://www.google.com/search?q=/demo/README.md)
      * CLI ([Python](https://www.google.com/search?q=/samples/python/hosts/cli/README.md), [JS](https://www.google.com/search?q=/samples/js/README.md))
  * 🤖 使用我们的 [示例代理](https://www.google.com/search?q=/samples/python/agents/README.md) 了解如何将 A2A 应用于代理框架
      * [代理开发者工具包 (ADK)](https://www.google.com/search?q=/samples/python/agents/google_adk/README.md)
      * [CrewAI](https://www.google.com/search?q=/samples/python/agents/crewai/README.md)
      * [LangGraph](https://www.google.com/search?q=/samples/python/agents/langgraph/README.md)
      * [Genkit](https://www.google.com/search?q=/samples/js/src/agents/README.md)
  * 📑 查看关键主题以了解协议详情
      * [A2A 和 MCP](https://google.github.io/A2A/#/topics/a2a_and_mcp.md)
      * [代理发现](https://google.github.io/A2A/#/topics/agent_discovery.md)
      * [企业就绪](https://google.github.io/A2A/#/topics/enterprise_ready.md)
      * [推送通知](https://google.github.io/A2A/#/topics/push_notifications.md)


![](/images/2025/A2A/A2A.jpg)

- [Announcing the Agent2Agent Protocol (A2A)](https://developers.googleblog.com/zh-hans/a2a-a-new-era-of-agent-interoperability/)

## A new era of Agent Interoperability（代理互操作性的新时代）

AI agents offer a unique opportunity to help people be more productive by autonomously handling many daily recurring or complex tasks. Today, enterprises are increasingly building and deploying autonomous agents to help scale, automate and enhance processes throughout the workplace–from ordering new laptops, to aiding customer service representatives, to assisting in supply chain planning.

AI 代理为人们提供了一个独特的机会，可以通过自主处理许多日常重复或复杂的任务来提高生产力。如今，企业越来越多地构建和部署自主代理，以帮助在整个工作场所扩展、自动化和增强流程——从订购新笔记本电脑，到协助客户服务代表，再到协助供应链规划。

To maximize the benefits from agentic AI, it is critical for these agents to be able to collaborate in a dynamic, multi-agent ecosystem across siloed data systems and applications. Enabling agents to interoperate with each other, even if they were built by different vendors or in a different framework, will increase autonomy and multiply productivity gains, while lowering long-term costs.

为最大限度地发挥代理 AI 的优势，使这些代理能够在孤立的数据系统和应用程序之间的动态多代理生态系统中进行协作至关重要。使代理能够相互操作，即使它们是由不同的供应商或在不同的框架中构建的，也将提高自主性并成倍增加生产力，同时降低长期成本。

Today, we’re launching a new, open protocol called Agent2Agent (A2A), with support and contributions from more than 50 technology partners like Atlassian, Box, Cohere, Intuit, Langchain, MongoDB, PayPal, Salesforce, SAP, ServiceNow, UKG and Workday; and leading service providers including Accenture, BCG, Capgemini, Cognizant, Deloitte, HCLTech, Infosys, KPMG, McKinsey, PwC, TCS, and Wipro. The A2A protocol will allow AI agents to communicate with each other, securely exchange information, and coordinate actions on top of various enterprise platforms or applications. We believe the A2A framework will add significant value for customers, whose AI agents will now be able to work across their entire enterprise application estates.

今天，我们推出了一种新的开放协议，称为 Agent2Agent (A2A)，得到了 Atlassian、Box、Cohere、Intuit、Langchain、MongoDB、PayPal、Salesforce、SAP、ServiceNow、UKG 和 Workday 等 50 多家技术合作伙伴的支持和贡献；以及包括埃森哲、BCG、凯捷、Cognizant、德勤、HCLTech、Infosys、KPMG、麦肯锡、普华永道、TCS 和 Wipro 在内的领先服务提供商。A2A 协议将允许 AI 代理彼此通信、安全地交换信息，并在各种企业平台或应用程序之上协调操作。我们相信，A2A 框架将为客户增加显着价值，因为他们的 AI 代理现在可以在整个企业应用程序中工作。

This collaborative effort signifies a shared vision of a future when AI agents, regardless of their underlying technologies, can seamlessly collaborate to automate complex enterprise workflows and drive unprecedented levels of efficiency and innovation.

这一协作努力标志着一个共同愿景的实现，即无论其底层技术如何，AI 代理都可以无缝协作以自动化复杂的企业工作流程并推动前所未有的效率和创新水平。

A2A is an open protocol that complements Anthropic's Model Context Protocol (MCP), which provides helpful tools and context to agents. Drawing on Google's internal expertise in scaling agentic systems, we designed the A2A protocol to address the challenges we identified in deploying large-scale, multi-agent systems for our customers. A2A empowers developers to build agents capable of connecting with any other agent built using the protocol and offers users the flexibility to combine agents from various providers. Critically, businesses benefit from a standardized method for managing their agents across diverse platforms and cloud environments. We believe this universal interoperability is essential for fully realizing the potential of collaborative AI agents.

A2A 是一个开放协议，补充了 Anthropic 的模型上下文协议 (MCP)，后者为代理提供有用的工具和上下文。借鉴谷歌在扩展代理系统方面的内部专业知识，我们设计了 A2A 协议，以解决我们在为客户部署大规模多代理系统时发现的挑战。A2A 使开发人员能够构建能够与使用该协议构建的任何其他代理连接的代理，并为用户提供将来自各种提供商的代理组合在一起的灵活性。关键是，企业受益于跨不同平台和云环境管理其代理的标准化方法。我们相信，这种通用互操作性对于充分实现协作 AI 代理的潜力至关重要。


## A2A design principles（A2A 设计原则）

A2A is an open protocol that provides a standard way for agents to collaborate with each other, regardless of the underlying framework or vendor. While designing the protocol with our partners, we adhered to five key principles:

A2A 是一个开放协议，提供了一种标准方法，使代理能够彼此协作，而不考虑底层框架或供应商。在与合作伙伴设计协议时，我们遵循了五项关键原则：

- **Embrace agentic capabilities**: A2A focuses on enabling agents to collaborate in their natural, unstructured modalities, even when they don’t share memory, tools and context. We are enabling true multi-agent scenarios without limiting an agent to a “tool.”
- **Build on existing standards**: The protocol is built on top of existing, popular standards including HTTP, SSE, JSON-RPC, which means it’s easier to integrate with existing IT stacks businesses already use daily.
- **Secure by default**: A2A is designed to support enterprise-grade authentication and authorization, with parity to OpenAPI’s authentication schemes at launch.
- **Support for long-running tasks**: We designed A2A to be flexible and support scenarios where it excels at completing everything from quick tasks to deep research that may take hours and or even days when humans are in the loop. Throughout this process, A2A can provide real-time feedback, notifications, and state updates to its users.
- **Modality agnostic**: The agentic world isn’t limited to just text, which is why we’ve designed A2A to support various modalities, including audio and video streaming.

- **拥抱智能体能力**：A2A 专注于使代理能够以其自然的、非结构化的方式进行协作，即使它们没有共享内存、工具和上下文。我们正在启用真正的多代理场景，而不将代理限制为“工具”。
- **基于现有标准**：该协议建立在现有的流行标准之上，包括 HTTP、SSE、JSON-RPC，这意味着更容易与企业每天使用的现有 IT 堆栈集成。
- **默认安全**：A2A 旨在支持企业级身份验证和授权，在启动时与 OpenAPI 的身份验证方案具有平价。
- **支持长期任务**：我们设计 A2A 以灵活支持各种场景，从快速任务到深度研究，甚至可能需要数小时甚至数天才能完成的任务。整个过程中，A2A 可以向用户提供实时反馈、通知和状态更新。
- **模态不可知**：代理世界不仅限于文本，这就是为什么我们设计 A2A 以支持各种模态，包括音频和视频流。


## How A2A works（A2A 的工作原理）

![](/images/2025/A2A/How-A2A-works.png)

A2A facilitates communication between a "client" agent and a “remote” agent. A client agent is responsible for formulating and communicating tasks, while the remote agent is responsible for acting on those tasks in an attempt to provide the correct information or take the correct action. This interaction involves several key capabilities:

A2A 促进“客户端”代理和“远程”代理之间的通信。客户端代理负责制定和传达任务，而远程代理则负责根据这些任务采取行动，以提供正确的信息或采取正确的行动。这种交互涉及几个关键功能：

- **Capability discovery**: Agents can advertise their capabilities using an “Agent Card” in JSON format, allowing the client agent to identify the best agent that can perform a task and leverage A2A to communicate with the remote agent.
- **Task management**: The communication between a client and remote agent is oriented towards task completion, in which agents work to fulfill end-user requests. This “task” object is defined by the protocol and has a lifecycle. It can be completed immediately or, for long-running tasks, each of the agents can communicate to stay in sync with each other on the latest status of completing a task. The output of a task is known as an “artifact.”
- **Collaboration**: Agents can send each other messages to communicate context, replies, artifacts, or user instructions.
- **User experience negotiation**: Each message includes “parts,” which is a fully formed piece of content, like a generated image. Each part has a specified content type, allowing client and remote agents to negotiate the correct format needed and explicitly include negotiations of the user’s UI capabilities–e.g., iframes, video, web forms, and more.

- **能力发现**：代理可以使用 JSON 格式的“代理卡”来宣传其能力，从而允许客户端代理识别可以执行任务的最佳代理，并利用 A2A 与远程代理进行通信。
- **任务管理**：客户端和远程代理之间的通信面向任务完成，代理努力满足最终用户请求。该协议定义了这个“任务”对象，并具有生命周期。它可以立即完成，或者对于长期任务，每个代理可以进行通信，以保持彼此同步以完成任务的最新状态。任务的输出称为“工件”。
- **协作**：代理可以相互发送消息以传达上下文、回复、工件或用户指令。
- **用户体验协商**：每条消息都包含“部分”，这是一个完整的内容片段，例如生成的图像。每个部分都有一个指定的内容类型，允许客户端和远程代理协商所需的正确格式，并明确包括用户 UI 功能的协商——例如，iframe、视频、Web 表单等。

请参阅[草案规范（draft specification）](https://github.com/google/A2A)中的协议工作原理的完整细节。


## A real-world example: candidate sourcing（候选人搜索的实际示例）

Hiring a software engineer can be significantly simplified with A2A collaboration. Within a unified interface like Agentspace, a user (e.g., a hiring manager) can task their agent to find candidates matching a job listing, location, and skill set. The agent then interacts with other specialized agents to source potential candidates. The user receives these suggestions and can then direct their agent to schedule further interviews, streamlining the candidate sourcing process. After the interview process completes, another agent can be engaged to facilitate background checks. This is just one example of how AI agents need to collaborate across systems to source a qualified job candidate.

招聘软件工程师可以通过 A2A 协作显著简化。在像 Agentspace 这样的统一界面中，用户（例如招聘经理）可以指派他们的代理查找与职位列表、地点和技能集匹配的候选人。然后，代理与其他专业代理进行交互以获取潜在候选人。用户收到这些建议后，可以指示他们的代理安排进一步的面试，从而简化候选人搜索过程。面试过程完成后，可以使用另一个代理来促进背景调查。这只是 AI 代理需要跨系统协作以寻找合格求职者的一个示例。

**Gemini 2.0 Flash**：通过 A2A 协作，招聘软件工程师的过程可以得到显著简化。在像 Agentspace 这样的统一界面中，用户（例如，招聘经理）可以指派其代理寻找符合职位描述、地点和技能要求的候选人。然后，该代理与其他专门的代理交互以寻找潜在的候选人。用户会收到这些建议，然后可以指示其代理安排进一步的面试，从而简化候选人寻源流程。面试过程结束后，还可以聘用另一个代理来协助进行背景调查。这只是 AI 代理需要跨系统协作以寻找合格求职候选人的一个示例。

https://storage.googleapis.com/gweb-developer-goog-blog-assets/original_videos/A2A_demo_v4.mp4


## The future of agent interoperability（代理互操作性的未来）

A2A has the potential to unlock a new era of agent interoperability, fostering innovation and creating more powerful and versatile agentic systems. We believe that this protocol will pave the way for a future where agents can seamlessly collaborate to solve complex problems and enhance our lives.

A2A 有可能开启代理互操作性的新时代，促进创新并创建更强大、更通用的代理系统。我们相信，这一协议将为未来铺平道路，使代理能够无缝协作以解决复杂问题并改善我们的生活。

We’re committed to building the protocol in collaboration with our partners and the community in the open. We’re releasing the protocol as open source and setting up clear pathways for contribution.

我们致力于与合作伙伴和社区共同开放地构建该协议。我们将该协议作为开源发布，并建立明确的贡献途径。


## Feedback from our A2A partners（来自 A2A 合作伙伴的反馈）

We're thrilled to have a growing and diverse ecosystem of partners actively contributing to the definition of the A2A protocol and its technical specification. Their insights and expertise are invaluable in shaping the future of AI interoperability.

我们很高兴拥有一个不断壮大和多样化的合作伙伴生态系统，他们积极参与 A2A 协议及其技术规范的定义。他们的见解和专业知识对于塑造 AI 互操作性的未来至关重要。

### 关于 A2A 协议反馈的总结：

众多技术和平台合作伙伴普遍认为，A2A 协议是**实现 AI 代理之间互操作性和无缝协作的关键**，能够**打破数据孤岛**，促进跨平台、系统和应用的协同工作。他们相信 A2A 将**加速企业 AI 的应用并释放其价值**，通过推动**创新和自动化**，帮助企业提升效率、优化决策并创造更智能的应用。该协议被视为一个**开放标准**，能够确保安全可靠的代理协作，即使在隔离环境中也能实现。

服务合作伙伴也一致认为，A2A 协议是**连接不同领域 AI 代理、解决复杂挑战的重要桥梁**，能够**加速代理 AI 架构的演进和应用**，并为行业解决方案带来实际商业价值。他们强调 A2A 将**定义代理之间的互操作性**，推动 AI 领域的发展，并为不同 AI 代理的有效和负责任协作提供基本标准。

Here's what some of our key partners are saying about the A2A protocol:

这里是我们的一些主要合作伙伴对 A2A 协议的看法：

### Technology & Platform Partners

- ask-ai.com

Ask-AI is excited to collaborate with Google on the A2A protocol, shaping the future of AI interoperability and seamless agent collaboration, advancing its leadership in Enterprise AI for Customer Experience.
– CEO Alon Talmor PhD

Ask-AI 很高兴与谷歌合作制定 A2A 协议，塑造 AI 互操作性和无缝代理协作的未来，推动其在客户体验企业 AI 方面的领导地位。

- Atlassian

With Atlassian's investment in Rovo agents, the development of a standardized protocol like A2A will help agents successfully discover, coordinate, and reason with one another to enable richer forms of delegation and collaboration at scale.
– Brendan Haire VP, Engineering of AI Platform. Atlassian

Atlassian 在 Rovo 代理方面的投资，像 A2A 这样的标准化协议的发展将帮助代理成功地发现、协调和推理彼此，以便在规模上实现更丰富的委派和协作形式。

- Articul8

At Articul8, we believe that AI must collaborate and interoperate to truly scale across the enterprise. We’re excited to support the development of the A2A interoperability protocol – an initiative that aligns perfectly with our mission to deliver domain-specific GenAI capabilities that seamlessly operate across complex systems and workflows. We’re enabling Articul8's ModelMesh (an 'Agent-of-Agents') to treat A2A as a first-class citizen, enabling secure, seamless communication between intelligent agents.
– Arun Subramaniyan, Founder & CEO of Articul8

Articul8 认为，AI 必须协作和互操作才能真正跨企业扩展。我们很高兴支持 A2A 互操作性协议的发展——这一倡议与我们在复杂系统和工作流程中无缝运行的使命完美契合。我们正在使 Articul8 的 ModelMesh（“代理中的代理”）将 A2A 视为一等公民，从而实现智能代理之间的安全、无缝通信。

- Arize AI

Arize AI is proud to partner with Google as a launch partner for the A2A interoperability protocol, advancing seamless, secure interaction across AI agents as part of Arize's commitment to open-source evaluation and observability frameworks positions.
– Jason Lopatecki, Cofounder & CEO, Arize AI

Arize AI 很自豪能与谷歌合作，成为 A2A 互操作性协议的启动合作伙伴，推动 AI 代理之间的无缝、安全交互，作为 Arize 对开源评估和可观察性框架定位的承诺的一部分。

- BCG

BCG helps redesign organizations with intelligence at the core. Open and interoperable capabilities like A2A can accelerate this, enabling sustained, autonomous competitive advantage.
– Djon Kleine, Managing Director & Partner at BCG

BCG 帮助以智能为核心重新设计组织。像 A2A 这样的开放和互操作能力可以加速这一进程，从而实现持续的自主竞争优势。

- Box

We look forward to expanding our partnership with Google to enable Box agents to work with Google Cloud’s agent ecosystem using A2A, innovating together to shape the future of AI agents while empowering organizations to better automate workflows, lower costs, and generate trustworthy AI outputs.
– Ketan Kittur, VP Product Management, Platform and Integrations at Box

我们期待着扩大与谷歌的合作伙伴关系，使 Box 代理能够使用 A2A 与谷歌云的代理生态系统协同工作，共同创新以塑造 AI 代理的未来，同时帮助组织更好地自动化工作流程、降低成本并生成可靠的 AI 输出。

- C3 AI

At C3 AI, we believe that open, interoperable systems are key to making Enterprise AI work and deliver value in the real world–and A2A has the potential to help customers break down silos and securely enable AI agents to work together across systems, teams, and applications.
– Nikhil Krishnan - C3 AI SVP and Chief Technology Officer, Data Science

在 C3 AI，我们相信开放的、互操作的系统是使企业 AI 在现实世界中发挥作用并提供价值的关键——A2A 有可能帮助客户打破孤岛，并安全地使 AI 代理能够跨系统、团队和应用程序协同工作。

- Chronosphere

A2A will enable reliable and secure agent specialization and coordination to open the door for a new era of compute orchestration, empowering companies to deliver products and services faster, more reliably, and enabling them to refocus their engineering efforts on driving innovation and value.
– Rob Skillington, Founder /CTO

A2A 将使可靠和安全的代理专业化和协调成为可能，为计算编排的新纪元打开大门，使公司能够更快、更可靠地交付产品和服务，并使他们能够将工程工作重新集中在推动创新和价值上。

- Cohere

At Cohere, we’re building the secure AI infrastructure enterprises need to adopt autonomous agents confidently, and the open A2A protocol ensures seamless, trusted collaboration—even in air-gapped environments—so that businesses can innovate at scale without compromising control or compliance.
– Autumn Moulder, VP of Engineering at Cohere

在 Cohere，我们正在构建企业需要的安全 AI 基础设施，以自信地采用自主代理，而开放的 A2A 协议确保无缝、可信的协作——即使在隔离环境中——这样企业就可以在不妥协控制或合规性的情况下大规模创新。

- Confluent

A2A enables intelligent agents to establish a direct, real-time data exchange, simplifying complex data pipelines to fundamentally change how agents communicate and facilitate decisions.
– Pascal Vantrepote, Senior Director of Innovation, Confluent

A2A 使智能代理能够建立直接的实时数据交换，从而简化复杂的数据管道，从根本上改变代理之间的通信和促进决策的方式。

- Cotality (formerly CoreLogic)

A2A opens the door to a new era of intelligent, real-time communication and collaboration, which Cotality will bring to clients in home lending, insurance, real estate, and government—helping them to improve productivity, speed up decision-making.
– Sachin Rajpal, Managing Director, Data Solutions, Cotality

Cotality（前身为 CoreLogic）为家庭贷款、保险、房地产和政府的客户带来了 A2A 开启的智能实时通信和协作新时代——帮助他们提高生产力，加快决策速度。

- DataStax

DataStax is excited to be part of A2A and explore how it can support Langflow, representing an important step toward truly interoperable AI systems that can collaborate on complex tasks spanning multiple environments.
– Ed Anuff, Chief Product Officer, DataStax

DataStax 很高兴成为 A2A 的一部分，并探索它如何支持 Langflow，这代表了朝着真正互操作的 AI 系统迈出的重要一步，这些系统可以协作完成跨多个环境的复杂任务。

- Datadog

We're excited to see Google Cloud introduce the A2A protocol to streamline the development of sophisticated agentic systems, which will help Datadog enable its users to build more innovative, optimized, and secure agentic AI applications.
– Yrieix Garnier, VP of Product at Datadog

我们很高兴看到谷歌云推出 A2A 协议，以简化复杂代理系统的开发，这将帮助 Datadog 使其用户能够构建更具创新性、优化和安全的代理 AI 应用程序。

- Elastic

Supporting the vision of open, interoperable agent ecosystems, Elastic looks forward to working with Google Cloud and other industry leaders on A2A and providing its data management and workflow orchestration experience to enhance the protocol.
– Steve Kearns, GVP and GM of Search, Elastic

Elastic 期待与谷歌云和其他行业领导者在 A2A 上合作，并提供其数据管理和工作流编排经验，以增强该协议，支持开放、互操作的代理生态系统的愿景。

- GrowthLoop

A2A has the potential to accelerate GrowthLoop's vision of Compound Marketing for our customers—enabling our AI agents to seamlessly collaborate with other specialized agents, learn faster from enterprise data, and rapidly optimize campaigns across the marketing ecosystem, all while respecting data privacy on the customer's cloud infrastructure.
– Anthony Rotio, Chief Data Strategy Officer, GrowthLoop

GrowthLoop 可能会加速 GrowthLoop 对客户的复合营销愿景——使我们的 AI 代理能够与其他专业代理无缝协作，更快地从企业数据中学习，并在整个营销生态系统中快速优化活动，同时尊重客户云基础设施上的数据隐私。

- Harness

Harness is thrilled to support A2A and is committed to simplifying the developer experience by integrating AI-driven intelligence into every stage of the software lifecycle, empowering teams to gain deeper insights from runtime data, automate complex workflows, and enhance system performance.
– Gurashish Brar, Head of Engineering at Harness.

Harness 很高兴支持 A2A，并致力于通过将 AI 驱动的智能集成到软件生命周期的每个阶段来简化开发人员体验，使团队能够从运行时数据中获得更深入的见解、自动化复杂的工作流程并增强系统性能。

- Incorta

Incorta is excited to support A2A and advance agent communication for customers,making the future of enterprise automation smarter, faster, and truly data-driven.
– Osama Elkady CEO Incorta

Incorta 很高兴支持 A2A 并推动客户的代理通信，使企业自动化的未来更智能、更快，并真正以数据为驱动。

- Intuit

Intuit strongly believes that an open-source protocol such as A2A will enable complex agent workflows, accelerate our partner integrations, and move the industry forward with cross-platform agents that collaborate effectively.
– Tapasvi Moturu, Vice President, Software Engineering for Agentic Frameworks, at Intuit

Intuit 坚信，像 A2A 这样的开源协议将使复杂的代理工作流程能够加速我们的合作伙伴集成，并推动行业向前发展，使跨平台代理能够有效协作。

- JetBrains

We’re excited to be a launch partner for A2A, an initiative that enhances agentic collaboration and brings us closer to a truly multi-agent world, empowering developers across JetBrains IDEs, team tools, and Google Cloud.
– Vladislav Tankov, Director of AI, JetBrains

我们很高兴成为 A2A 的启动合作伙伴，这一倡议增强了代理协作，使我们更接近一个真正的多代理世界，使 JetBrains IDE、团队工具和谷歌云的开发人员能够更好地协作。

- JFrog

JFrog is excited to join the A2A protocol, an initiative we believe will help to overcome many of today’s integration challenges and be a key driver for the next generation of agentic applications.
– Yoav Landman, CTO and Co-founder, JFrog

JFrog 很高兴加入 A2A 协议，我们相信这将有助于克服当今许多集成挑战，并成为下一代代理应用程序的关键驱动因素。

- LabelBox

A2A is a key step toward realizing the full potential of AI agents, supporting a future where AI can truly augment human capabilities, automate complex workflows and drive innovation.
– Manu Sharma Founder & CEO

A2A 是实现 AI 代理全部潜力的关键一步，支持一个未来，在这个未来中，AI 可以真正增强人类能力、自动化复杂工作流程并推动创新。

- LangChain

LangChain believes agents interacting with other agents is the very near future, and we are excited to be collaborating with Google Cloud to come up with a shared protocol which meets the needs of the agent builders and users.
– Harrison Chase Co-Founder and CEO at LangChain

LangChain 认为，代理与其他代理的交互是非常接近的未来，我们很高兴能与谷歌云合作，制定一个满足代理构建者和用户需求的共享协议。

- MongoDB

By combining the power of MongoDB’s robust database infrastructure and hybrid search capabilities with A2A and Google Cloud’s cutting edge AI models, businesses can unlock new possibilities across industries like retail, manufacturing, and beyond to redefine the future of AI applications.
– Andrew Davidson, SVP of Products at MongoDB

MongoDB 通过将 MongoDB 强大的数据库基础设施和混合搜索功能与 A2A 和谷歌云的尖端 AI 模型相结合，企业可以在零售、制造等各个行业解锁新的可能性，以重新定义 AI 应用程序的未来。

- Neo4j

Neo4j is proud to partner with Google Cloud, combining our graph technology's knowledge graph and GraphRAG capabilities with A2A to help organizations unlock new levels of automation and intelligence while ensuring agent interactions remain contextually relevant, explainable and trustworthy.
– Sudhir Hasbe, Chief Product Officer at Neo4j

Neo4j 很自豪能与谷歌云合作，将我们图形技术的知识图谱和 GraphRAG 功能与 A2A 相结合，帮助组织解锁新的自动化和智能水平，同时确保代理交互保持上下文相关、可解释和可信。

- New Relic

We believe the collaboration between Google Cloud’s A2A protocol and New Relic’s Intelligent Observability platform will provide significant value to our customers by simplifying integrations, facilitating data exchange across diverse systems, and ultimately creating a more unified AI agent ecosystem.
– Thomas Lloyd, Chief Business and Operations Officer, New Relic

我们相信，谷歌云的 A2A 协议与 New Relic 的智能可观察性平台之间的协作将通过简化集成、促进跨不同系统的数据交换，并最终创建一个更统一的 AI 代理生态系统，为我们的客户提供显着价值。

- Pendo

We’re proud to partner on Google Cloud’s A2A protocol, which will be a critical step toward enabling AI agents to work together effectively, while maintaining trust and usability at scale.
– Rahul Jain, Co-founder & CPO at Pendo

我们很自豪能与谷歌云的 A2A 协议合作，这将是使 AI 代理能够有效协作的关键一步，同时在规模上保持信任和可用性。

- PayPal

PayPal supports Google Cloud’s A2A protocol, which represents a new way for developers and merchants to create next-generation commerce experiences, powered by agentic AI.
-Prakhar Mehrotra, SVP & Head of Artificial Intelligence at PayPal

PayPal 支持谷歌云的 A2A 协议，这代表了一种新的方式，使开发人员和商家能够创建下一代商业体验，推动代理 AI。

- SAP

SAP is committed to collaborating with Google Cloud and the broader ecosystem to shape the future of agent interoperability through the A2A protocol—a pivotal step toward enabling SAP Joule and other AI agents to seamlessly work across enterprise platforms and unlock the full potential of end-to-end business processes.
– Walter Sun, SVP & Global Head of AI Engineering

SAP 承诺与谷歌云和更广泛的生态系统合作，通过 A2A 协议塑造代理互操作性的未来——这是使 SAP Joule 和其他 AI 代理能够无缝跨企业平台工作并释放端到端业务流程全部潜力的关键一步。

- Salesforce

Salesforce is leading with A2A standard support to extend our open platform, enabling AI agents to work together seamlessly across Agentforce and other ecosystems to turn disconnected capabilities into orchestrated solutions and deliver an enhanced digital workforce for customers and employees.
– Gary Lerhaupt, VP Product Architecture

Salesforce 正在以 A2A 标准支持为首，扩展我们的开放平台，使 AI 代理能够在 Agentforce 和其他生态系统之间无缝协作，将不相关的功能转化为协调的解决方案，并为客户和员工提供增强的数字工作体验。

- ServiceNow

ServiceNow and Google Cloud are collaborating to set a new industry standard for agent-to-agent interoperability, and we believe A2A will pave the way for more efficient and connected support experiences.
– Pat Casey, Chief Technology Officer & EVP of DevOps, ServiceNow

ServiceNow 和谷歌云正在合作制定代理到代理互操作性的行业新标准，我们相信 A2A 将为更高效和更紧密的支持体验铺平道路。

- Supertab

With Google Cloud’s A2A protocol and Supertab Connect, agents will be able to pay for, charge for, and exchange services — just like human businesses do.
– Cosmin Ene, Founder of Supertab

Supertab 的 A2A 协议和 Supertab Connect，代理将能够支付、收费和交换服务——就像人类企业一样。

- UKG

We're thrilled at UKG to be collaborating with Google Cloud on the new A2A protocol, a framework that will allow us to build even smarter, more supportive human capital and workforce experiences that anticipate and respond to employee needs like never before.
– Eli Tsinovoi, Head of AI at UKG

我们很高兴在 UKG 与谷歌云合作开发新的 A2A 协议，这是一个框架，使我们能够构建更智能、更支持人力资本和劳动力体验，前所未有地预测和响应员工需求。

- Weights & Biases

Weights & Biases is proud to collaborate with Google Cloud on the A2A protocol, setting a critical open standard that will empower organizations to confidently deploy, orchestrate, and scale diverse AI agents, regardless of underlying technologies.
– Shawn Lewis, CTO and co-founder at Weights & Biases

Weights & Biases 很自豪能与谷歌云合作开发 A2A 协议，建立一个关键的开放标准，使组织能够自信地部署、编排和扩展多种 AI 代理，而不考虑底层技术。

### Services Partners

- Accenture

The multi-agent A2A protocol from Google Cloud is the bridge that will unite domain specific agents across diverse platforms to solve complex challenges, enabling seamless communication and collective intelligence for smarter and effective agentic solutions.
– Scott Alfieri, AGBG Global lead, Accenture

Accenture 的 Google Cloud 多代理 A2A 协议是将跨不同平台的特定领域代理结合在一起以解决复杂挑战的桥梁，使更智能和有效的代理解决方案实现无缝通信和集体智能。

- Deloitte

Agent-to-agent interoperability is a foundational element of enabling the evolution of agentic AI architectures, and Google Cloud’s A2A initiative to bring together an ecosystem of technology industry participants to co-develop and support this protocol will immensely accelerate agentic AI adoption.
– Gopal Srinivasan, Deloitte

Deloitte 的代理到代理互操作性是实现代理 AI 架构演变的基础要素，谷歌云的 A2A 倡议将技术行业参与者的生态系统结合在一起，以共同开发和支持该协议，将极大地加速代理 AI 的采用。

- EPAM

We are already leading the way in the A2A space by focusing on industry solutions that provide real business value—saving time, reducing overhead and helping our clients drive revenue and enhance processes like the development of FDA documentation during the drug discovery process.
– Marc Cerro, VP of Global Google Cloud Partnership at EPAM

EPAM 在 A2A 领域已经走在前列，专注于提供真正商业价值的行业解决方案——节省时间、降低开销，帮助客户推动收入并增强 FDA 文档开发等流程。

- HCLTech

HCLTech is at the forefront of the agentic enterprise, and we are proud to partner with Google Cloud in defining agent-to-agent interoperability and advancing agentic AI possibilities through the open A2A standard.
– Vijay Guntur, Chief Technology Officer and Head of Ecosystems, HCLTech

HCLTech 处于代理企业的前沿，我们很自豪能与谷歌云合作，通过开放的 A2A 标准定义代理到代理互操作性并推动代理 AI 可能性。

- KPMG

At KPMG, we are excited to be part of this emerging initiative as A2A provides the essential standard we need for different AI agents to truly collaborate effectively and responsibly, which will enable customers and businesses to seamlessly harness AI for innovation and efficiency gains.
– Sherif AbdElGawad, Partner, Google Cloud & AI Leader, KPMG

KPMG 很高兴成为这一新兴倡议的一部分，因为 A2A 为不同的 AI 代理提供了我们需要的基本标准，使它们能够真正有效和负责任地协作，这将使客户和企业能够无缝利用 AI 实现创新和效率提升。

- Quantiphi

The ability for agents to dynamically discover capabilities and build user experiences across platforms is crucial for unlocking the true potential of enterprises. We see the A2A protocol as a pivotal step to empower businesses to build such interoperable agents.
-Asif Hasan, Co-founder of Quantiphi

Quantiphi 代理能够动态发现跨平台的能力并构建用户体验的能力对于释放企业的真正潜力至关重要。我们将 A2A 协议视为使企业能够构建这种互操作代理的关键一步。

- TCS (Tata Consultancy Services)

The A2A protocol is the foundation for the next era of agentic automation, where Semantic Interoperability takes prominence, and we're proud to lead this transformative journey.
– Anupam Singhal, President, Manufacturing business, Tata Consultancy Services (TCS)

A2A 协议是代理自动化下一个时代的基础，在这个时代，语义互操作性占据重要地位，我们很自豪能引领这一变革之旅。

- Wipro

Because the future of AI lies in seamless collaboration, open protocols like A2A will be the foundation of an ecosystem where AI agents drive innovation at scale.
– Nagendra P Bandaru, Managing Partner and Global Head – Technology Services (Wipro)

Wipro 认为，AI 的未来在于无缝协作，像 A2A 这样的开放协议将成为 AI 代理大规模推动创新的生态系统的基础。
