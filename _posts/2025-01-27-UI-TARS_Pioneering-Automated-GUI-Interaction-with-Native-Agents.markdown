---
layout: post
title:  "UI-TARS: Pioneering Automated GUI Interaction with Native Agents"
date:   2025-01-27 10:00:00 +0800
categories: UI-TARS arXiv
tags: [UI-TARS, Agent, GUI, LLM]
---

[UI-TARS: Pioneering Automated GUI Interaction with Native Agents（与本地代理进行自动化 GUI 交互的先驱）](https://arxiv.org/abs/2501.12326)

## Abstract（摘要）

This paper introduces UI-TARS, a native GUI agent model that solely perceives the screenshots as input and performs human-like interactions (e.g., keyboard and mouse operations).
Unlike prevailing agent frameworks that depend on heavily wrapped commercial models
(e.g., GPT-4o) with expert-crafted prompts and workflows, UI-TARS is an end-to-end model
that outperforms these sophisticated frameworks. Experiments demonstrate its superior performance: UI-TARS achieves SOTA performance in 10+ GUI agent benchmarks evaluating
perception, grounding, and GUI task execution (see below). Notably, in the OSWorld benchmark, UI-TARS achieves scores of 24.6 with 50 steps and 22.7 with 15 steps, outperforming
Claude’s 22.0 and 14.9 respectively. In AndroidWorld, UI-TARS achieves 46.6, surpassing
GPT-4o’s 34.5. UI-TARS incorporates several key innovations: (1) Enhanced Perception:
leveraging a large-scale dataset of GUI screenshots for context-aware understanding of
UI elements and precise captioning; (2) Unified Action Modeling, which standardizes
actions into a unified space across platforms and achieves precise grounding and interaction
through large-scale action traces; (3) System-2 Reasoning, which incorporates deliberate
reasoning into multi-step decision making, involving multiple reasoning patterns such as task
decomposition, reflection thinking, milestone recognition, etc. (4) Iterative Training with
Reflective Online Traces, which addresses the data bottleneck by automatically collecting,
filtering, and reflectively refining new interaction traces on hundreds of virtual machines.
Through iterative training and reflection tuning, UI-TARS continuously learns from its
mistakes and adapts to unforeseen situations with minimal human intervention. We also
analyze the evolution path of GUI agents to guide the further development of this domain.
UI-TARS is open sourced at https://github.com/bytedance/UI-TARS.

本文介绍了UI-TARS，这是一种原生的GUI代理模型，仅通过感知截图作为输入并执行类似人类的交互（例如键盘和鼠标操作）。与依赖于高度封装的商业模型（例如GPT-4o）和专家设计的提示和工作流程的流行代理框架不同，UI-TARS是一个端到端模型，性能优于这些复杂的框架。实验表明其卓越的性能：UI-TARS在10多个评估感知、基础和GUI任务执行的GUI代理基准测试中达到了SOTA性能（见下文）。值得注意的是，在OSWorld基准测试中，UI-TARS在50步和15步中分别获得了24.6和22.7的分数，超过了Claude的22.0和14.9。在AndroidWorld中，UI-TARS获得了46.6，超过了GPT-4o的34.5。UI-TARS包含几个关键创新：(1) 增强感知：利用大规模的GUI截图数据集进行上下文感知的UI元素理解和精确描述；(2) 统一动作建模：将动作标准化为跨平台的统一空间，并通过大规模动作轨迹实现精确的基础和交互；(3) 系统2推理：在多步骤决策中引入深思熟虑的推理，涉及任务分解、反思性思维、里程碑识别等多种推理模式；(4) 反思性在线轨迹的迭代训练：通过在数百台虚拟机上自动收集、过滤和反思性地改进新的交互轨迹，解决数据瓶颈。通过迭代训练和反思调优，UI-TARS不断从错误中学习，并以最少的人为干预适应不可预见的情况。我们还分析了GUI代理的演变路径，以指导该领域的进一步发展。UI-TARS已在 [https://github.com/bytedance/UI-TARS](https://github.com/bytedance/UI-TARS) 开源。

![](/images/2025/UI-TARS/Benchmark.png)


## 1 Introduction（简介）

Autonomous agents (Wang et al., 2024b; Xi et al., 2023; Qin et al., 2024) are envisioned to operate with minimal
human oversight, perceiving their environment, making decisions, and executing actions to achieve specific
goals. Among the many challenges in this domain, enabling agents to interact seamlessly with Graphical User
Interfaces (GUIs) has emerged as a critical frontier (Hu et al., 2024; Zhang et al., 2024a; Nguyen et al., 2024;
Wang et al., 2024e; Gao et al., 2024). GUI agents are designed to perform tasks within digital environments
that rely heavily on graphical elements such as buttons, text boxes, and images. By leveraging advanced
perception and reasoning capabilities, these agents hold the potential to revolutionize task automation, enhance
accessibility, and streamline workflows across a wide range of applications.

**Autonomous agents 自主代理**（Wang等，2024b；Xi等，2023；Qin等，2024）被设想为在最少人类监督下运行，感知其环境，做出决策并执行动作以实现特定目标。在这一领域的许多挑战中，使代理能够与图形用户界面（GUI）无缝交互已成为一个关键前沿（Hu等，2024；Zhang等，2024a；Nguyen等，2024；Wang等，2024e；Gao等，2024）。GUI代理旨在在数字环境中执行任务，这些环境严重依赖于图形元素，如按钮、文本框和图像。通过利用先进的感知和推理能力，这些代理有潜力彻底改变任务自动化，增强可访问性，并简化各种应用程序的工作流程。

The development of GUI agents has historically relied on hybrid approaches that combine textual representations (e.g., HTML structures and accessibility trees) (Liu et al., 2018; Deng et al., 2023; Zhou et al., 2023).
While these methods have driven significant progress, they suffer from limitations such as platform-specific
inconsistencies, verbosity, and limited scalability (Xu et al., 2024). Textual-based methods often require
system-level permissions to access underlying system information, such as HTML code, which further limits
their applicability and generalizability across diverse environments. Another critical issue is that, many
existing GUI systems follow an agent framework paradigm (Zhang et al., 2023; Wang et al., 2024a; Wu et al.,
2024a; Zhang et al., 2024b; Wang & Liu, 2024; Xie et al., 2024), where key functions are modularized across
multiple components. These components often rely on specialized vision-language models (VLMs), e.g.,
GPT-4o (Hurst et al., 2024), for understanding and reasoning (Zhang et al., 2024b), while grounding (Lu et al.,
2024b) or memory (Zhang et al., 2023) modules are implemented through additional tools or scripts. Although
this modular architecture facilitates rapid development in specific domain tasks, it relies on handcrafted
approaches that depend on expert knowledge, modular components, and task-specific optimizations, which are
less scalable and adaptive than end-to-end models. This makes the framework prone to failure when faced
with unfamiliar tasks or dynamically changing environments (Xia et al., 2024).

GUI代理的发展历史上一直依赖于混合方法，这些方法结合了文本表示（例如HTML结构和可访问性树）（Liu等，2018；Deng等，2023；Zhou等，2023）。尽管这些方法推动了重大进展，但它们存在诸如特定于平台的不一致性、冗长和有限的可扩展性等局限性（Xu等，2024）。基于文本的方法通常需要系统级权限来访问底层系统信息，例如HTML代码，这进一步限制了它们在不同环境中的适用性和泛化性。另一个关键问题是，许多现有的GUI系统遵循代理框架范式（Zhang等，2023；Wang等，2024a；Wu等，2024a；Zhang等，2024b；Wang和Liu，2024；Xie等，2024），其中关键功能在多个组件之间模块化。这些组件通常依赖于专门的视觉-语言模型（VLMs），例如GPT-4o（Hurst等，2024），用于理解和推理（Zhang等，2024b），而基础（Lu等，2024b）或记忆（Zhang等，2023）模块则通过附加工具或脚本实现。尽管这种模块化架构促进了特定领域任务的快速开发，但它依赖于依赖于专家知识、模块化组件和任务特定优化的手工方法，这些方法不如端到端模型可扩展和适应。当面临陌生任务或动态变化的环境时，这使得框架容易失败（Xia等，2024）。

These challenges have prompted two key shifts towards native GUI agent model: (1) the transition from
**textual-dependent** to **pure-vision-based** GUI agents (Bavishi et al., 2023; Hong et al., 2024). “Pure-vision”
means the model relies exclusively on screenshots of the interface as input, rather than textual descriptions
(e.g., HTML). This bypasses the complexities and platform-specific limitations of textual representations,
aligning more closely with human cognitive processes; and (2) the evolution from **modular agent frameworks**
to **end-to-end agent models** (Wu et al., 2024b; Xu et al., 2024; Lin et al., 2024b; Yang et al., 2024a; Anthropic,
2024b). The end-to-end design unifies traditionally modularized components into a single architecture,
enabling a smooth flow of information among modules. In philosophy, agent frameworks are **design-driven**,
requiring extensive manual engineering and predefined workflows to maintain stability and prevent unexpected
situations; while agent models are inherently **data-driven**, enabling them to learn and adapt through large-scale
data and iterative feedback (Putta et al., 2024).

这些挑战促使了两个关键转变，即从**文本依赖**到**纯视觉**GUI代理（Bavishi等，2023；Hong等，2024）的转变。**纯视觉**意味着模型仅依赖于界面的截图作为输入，而不是文本描述（例如HTML）。这绕过了文本表示的复杂性和特定于平台的限制，更接近人类认知过程；以及从**模块化代理框架**到**端到端代理模型**的演变（Wu等，2024b；Xu等，2024；Lin等，2024b；Yang等，2024a；Anthropic，2024b）。端到端设计将传统上模块化的组件统一到一个体系结构中，使模块之间的信息流更加顺畅。在哲学上，代理框架是**设计驱动**的，需要大量的手工工程和预定义的工作流程来保持稳定性并防止意外情况；而代理模型本质上是**数据驱动**的，使其能够通过大规模数据和迭代反馈进行学习和适应（Putta等，2024）。

Despite their conceptual advantages, today’s native GUI agent model often falls short in practical applications,
causing their real-world impact to lag behind its hype. These limitations stem from two primary sources:
(1) the GUI domain itself presents unique challenges that compound the difficulty of developing robust
agents. (1.a) On the **perception** side, agents must not only recognize but also effectively interpret the high
information-density of evolving user interfaces. (1.b) **Reasoning and planning** mechanisms are equally
important in order to navigate, manipulate, and respond to these interfaces effectively. (1.c) These mechanisms
must also leverage **memory**, considering past interactions and experiences to make informed decisions. (1.d)
Beyond high-level decision-making, agents must also execute precise, low-level **actions**, such as outputting
exact screen coordinates for clicks or drags and inputting text into the appropriate fields. (2) The transition
from agent frameworks to agent models introduces a fundamental **data bottleneck**. Modular frameworks
traditionally rely on separate datasets tailored to individual components. These datasets are relatively easy
to curate since they address isolated functionalities. However, training an end-to-end agent model demands
data that integrates all components in a unified workflow, capturing the seamless interplay between perception,
reasoning, memory, and action. Such data, which comprise rich workflow knowledge from human experts,
have been scarcely recorded historically. This lack of comprehensive, high-quality data limits the ability of
native agents to generalize across diverse real-world scenarios, hindering their scalability and robustness.

尽管在概念上具有优势，但今天的原生GUI代理模型在实际应用中往往表现不佳，导致其真实世界的影响落后于其炒作。这些限制源于两个主要来源：(1) GUI领域本身提出了独特的挑战，增加了开发强大代理的难度。 (1.a) 在**感知**方面，代理不仅必须识别，还必须有效地解释不断演变的用户界面的高信息密度。 (1.b) **推理和规划**机制同样重要，以便有效地导航、操作和响应这些界面。 (1.c) 这些机制还必须利用**记忆**，考虑过去的交互和经验，以做出明智的决策。 (1.d) 除了高级决策制定外，代理还必须执行精确的低级**动作**，例如输出点击或拖动的确切屏幕坐标，并将文本输入到适当的字段中。 (2) 从代理框架到代理模型的转变引入了根本性的**数据瓶颈**。传统上，模块化框架依赖于针对单个组件量身定制的单独数据集。由于这些数据集解决了孤立功能，因此它们相对容易策划。然而，训练端到端代理模型需要集成统一工作流程中所有组件的数据，捕捉感知、推理、记忆和动作之间的无缝互动。这些数据包括来自人类专家的丰富工作流程知识，但历史上很少被记录。这种缺乏全面、高质量数据的情况限制了原生代理在各种现实场景中的泛化能力，阻碍了它们的可扩展性和鲁棒性。

To address these challenges, this paper focuses on advancing native GUI agent model. We begin by reviewing
the evolution path for GUI agents (§ 2). By segmenting the development of GUI agents into key stages based
on the degree of human intervention and generalization capabilities, we conduct a comprehensive literature
review. Starting with traditional rule-based agents, we highlight the evolution from rigid, framework-based
systems to adaptive native models that seamlessly integrate perception, reasoning, memory, and action. We
also prospect the future potential of GUI agents capable of active and lifelong learning, which minimizes
human intervention while maximizing generalization abilities. To deepen understanding, we provide a detailed
analysis of the core capabilities of the native agent model, which include: (1) perception, enabling real-time
environmental understanding for improved situational awareness; (2) action, requiring the native agent model to
accurately predict and ground actions within a predefined space; (3) reasoning, which emulates human thought
processes and encompasses both System 1 and System 2 thinking; and (4) memory, which stores task-specific
information, prior experiences, and background knowledge. We also summarize the main evaluation metrics
and benchmarks for GUI agents.

为了解决这些挑战，本文着眼于推进原生GUI代理模型。我们首先回顾了GUI代理的演变路径（§ 2）。通过根据人类干预程度和泛化能力对GUI代理的发展进行关键阶段的分割，我们进行了全面的文献综述。从传统的基于规则的代理开始，我们强调了从刚性、基于框架的系统到无缝集成感知、推理、记忆和动作的自适应原生模型的演变。我们还展望了具有主动和终身学习能力的GUI代理的未来潜力，这种能力最大程度地减少了人类干预，同时最大程度地提高了泛化能力。为了加深理解，我们对原生代理模型的核心能力进行了详细分析，其中包括：(1) 感知，实现实时环境理解，提高情境感知能力；(2) 动作，要求原生代理模型在预定义空间内准确预测和基础动作；(3) 推理，模拟人类思维过程，包括系统1和系统2思维；以及(4) 记忆，存储任务特定信息、先前经验和背景知识。我们还总结了GUI代理的主要评估指标和基准测试。

![](/images/2025/UI-TARS/Figure1.png)

图1：UI-TARS的一个演示案例，帮助用户找到航班。

Based on these analyses, we propose a native GUI agent model UI-TARS, with a demo case illustrated in
Figure 1. UI-TARS incorporates the following core contributions:

基于这些分析，我们提出了一种原生GUI代理模型UI-TARS，示例案例如图1所示。UI-TARS包含以下核心贡献：

- **Enhanced Perception for GUI Screenshots** (§ 4.2): GUI environments, with their high information
density, intricate layouts, and diverse styles, demand robust perception capabilities. We curate a largescale dataset by collecting screenshots using specialized parsing tools to extract metadata such as element
types, bounding boxes, and text content from websites, applications, and operating systems. The dataset
targets the following tasks: (1) element description, which provides fine-grained, structured descriptions
of GUI components; (2) dense captioning, aimed at holistic interface understanding by describing
the entire GUI layout, including spatial relationships, hierarchical structures, and interactions among
elements; (3) state transition captioning, which captures subtle visual changes in the screen; (4) question
answering, designed to enhance the agent’s capacity for visual reasoning; and (5) set-of-mark prompting,
which uses visual markers to associate GUI elements with specific spatial and functional contexts. These
carefully designed tasks collectively enable UI-TARS to recognize and understand GUI elements with
exceptional precision, providing a robust foundation for further reasoning and action.

- **增强GUI截图的感知能力** (§ 4.2)：GUI环境具有高信息密度、复杂布局和多样化风格，要求具备强大的感知能力。我们通过使用专门的解析工具收集截图，提取元素类型、边界框和文本内容等元数据，构建了一个大规模数据集，涵盖网站、应用程序和操作系统。该数据集针对以下任务：(1) 元素描述，提供GUI组件的细粒度、结构化描述；(2) 密集描述，旨在通过描述整个GUI布局，包括空间关系、层次结构和元素间的交互，来实现整体界面理解；(3) 状态转换描述，捕捉屏幕上的细微视觉变化；(4) 问答，旨在增强代理的视觉推理能力；(5) 标记集提示，使用视觉标记将GUI元素与特定的空间和功能上下文关联。这些精心设计的任务共同使UI-TARS能够以卓越的精度识别和理解GUI元素，为进一步的推理和操作提供了坚实的基础。

- **Unified Action Modeling for Multi-step Execution** (§ 4.3): we design a unified action space to
standardize semantically equivalent actions across platforms. To improve multi-step execution, we create
a large-scale dataset of action traces, combining our annotated trajectories and standardized open-source
data. The grounding ability, which involves accurately locating and interacting with specific GUI elements,
is improved by curating a vast dataset that pairs element descriptions with their spatial coordinates. This
data enables UI-TARS to achieve precise and reliable interactions.

- **统一动作建模以实现多步执行** (§ 4.3)：我们设计了一个统一的动作空间，以标准化跨平台的语义等效动作。为了提高多步执行，我们创建了一个大规模的动作轨迹数据集，结合了我们的注释轨迹和标准化的开源数据。通过整理将元素描述与其空间坐标配对的大量数据集，提高了涉及准确定位和与特定GUI元素交互的基础能力。这些数据使UI-TARS能够实现精确可靠的交互。

- **System-2 Reasoning for Deliberate Decision-making** (§ 4.4): robust performance in dynamic environments demands advanced reasoning capabilities. To enrich reasoning ability, we crawl 6M GUI tutorials,
meticulously filtered and refined to provide GUI knowledge for logical decision-making. Building on
this foundation, we augment reasoning for all the collected action traces by injecting diverse reasoning
patterns—such as task decomposition, long-term consistency, milestone recognition, trial&error, and
reflection—into the model. UI-TARS integrates these capabilities by generating explicit “thoughts” before
each action, bridging perception and action with deliberate decision-making.

- **系统2推理以进行深思熟虑的决策** (§ 4.4)：在动态环境中表现出色需要先进的推理能力。为了丰富推理能力，我们爬取了600万个GUI教程，经过精心筛选和改进，为逻辑决策提供GUI知识。在此基础上，我们通过向模型注入多样化的推理模式（如任务分解、长期一致性、里程碑识别、试错和反思）来增强所有收集的动作轨迹的推理。UI-TARS通过在每个动作之前生成明确的“思考”，将感知和动作与深思熟虑的决策联系起来。

- **Iterative Refinement by Learning from Prior Experience** (§ 4.5): a significant challenge in GUI agent
development lies in the scarcity of large-scale, high-quality action traces for training. To overcome this
data bottleneck, UI-TARS employs an iterative improvement framework that dynamically collects and
refines new interaction traces. Leveraging hundreds of virtual machines, UI-TARS explores diverse
real-world tasks based on constructed instructions and generates numerous traces. Rigorous multi-stage
filtering—incorporating rule-based heuristics, VLM scoring, and human review—ensures trace quality.
These refined traces are then fed back into the model, enabling continuous, iterative enhancement of
the agent’s performance across successive cycles of training. Another central component of this online
bootstrapping process is reflection tuning, where the agent learns to identify and recover from errors
by analyzing its own suboptimal actions. We annotate two types of data for this process: (1) error
correction, where annotators pinpoint mistakes in agent-generated traces and label the corrective actions,
and (2) post-reflection, where annotators simulate recovery steps, demonstrating how the agent should
realign task progress after an error. These two types of data create paired samples, which are used to train
the model using Direct Preference Optimization (DPO) (Rafailov et al., 2023). This strategy ensures that
the agent not only learns to avoid errors but also adapts dynamically when they occur. Together, these
strategies enable UI-TARS to achieve robust, scalable learning with minimal human oversight.

- **通过从先前经验中学习进行迭代改进** (§ 4.5)：GUI代理开发中的一个重要挑战在于缺乏用于训练的大规模、高质量的动作轨迹。为了克服这一数据瓶颈，UI-TARS采用了一个动态收集和改进新交互轨迹的迭代改进框架。利用数百台虚拟机，UI-TARS基于构建的指令探索各种现实世界任务，并生成大量轨迹。严格的多阶段过滤——包括基于规则的启发式、VLM评分和人工审查——确保了轨迹质量。然后将这些经过改进的轨迹反馈到模型中，使代理在连续的训练周期中不断迭代地提高性能。这个在线引导过程的另一个核心组件是反思调优，代理通过分析自己的次优动作来学习识别和纠正错误。我们为这个过程注释了两种类型的数据：(1) `错误校正（error correction）`，其中标注员指出代理生成的轨迹中的错误，并标记纠正动作；(2) `反思后（post-reflection）`，其中标注员模拟恢复步骤，展示代理在错误后应如何重新调整任务进度。这两种类型的数据创建了配对样本，用于使用直接偏好优化（DPO）（Rafailov等，2023）训练模型。这种策略确保代理不仅学会避免错误，而且在发生错误时动态地进行调整。这些策略共同使UI-TARS能够在最少人类监督下实现稳健且可扩展的学习。

We continually train Qwen-2-VL 7B and 72B (Wang et al., 2024c) on approximately 50 billion tokens to
develop UI-TARS-7B and UI-TARS-72B. Through extensive experiments, we draw the following conclusions:

我们不断在大约`500亿`个标记上训练`Qwen-2-VL` 7B和72B（Wang等，2024c），以开发UI-TARS-7B和UI-TARS-72B。通过大量实验，我们得出以下结论：

- **Overall Performance**: UI-TARS demonstrates SOTA performance across 10+ GUI Agent benchmarks,
covering evaluation for perception, grounding, and agent task execution. These results validate the
effectiveness of our method, significantly outperforming competitive baselines such as GPT-4o and
Claude Computer Use (Anthropic, 2024b) in reasoning-intensive and dynamic scenarios.

- **整体性能**：UI-TARS在10多个GUI代理基准测试中展示了SOTA性能，涵盖了感知、基础和代理任务执行的评估。这些结果验证了我们方法的有效性，在需要推理和动态场景中显著优于竞争基线，如GPT-4o和Claude Computer Use（Anthropic，2024b）。

- **Perception**: UI-TARS excels in GUI perception, effectively handling high information density and
intricate layouts. Experiments confirm its ability to extract precise metadata, describe GUI elements,
and generate detailed, context-aware captions. For example, UI-TARS-72B scored 82.8 in VisualWebBench (Liu et al., 2024c), higher than GPT-4o (78.5).

- **感知**：UI-TARS在GUI感知方面表现出色，有效处理高信息密度和复杂布局。实验证实了它提取精确元数据、描述GUI元素和生成详细的上下文感知标题的能力。例如，UI-TARS-72B在VisualWebBench（Liu等，2024c）中得分82.8，高于GPT-4o（78.5）。

- **Grounding**: UI-TARS achieves high-precision grounding across mobile, desktop, and web environments
by accurately associating GUI elements with their spatial coordinates. For example, it scores 38.1 (SOTA)
on a recently released challenging benchmark ScreenSpot Pro (Li et al., 2025).

- **基础**：UI-TARS通过将GUI元素准确与其空间坐标关联，实现了在移动、桌面和Web环境中的高精度基础。例如，它在最近发布的具有挑战性的基准测试ScreenSpot Pro（Li等，2025）上得分38.1（SOTA）。

- **Agent Capabilities**: extensive evaluations highlight UI-TARS ’s superior agent capabilities. Experiments
demonstrate exceptional performance in reasoning-intensive benchmarks, with the 72B variant particularly
excelling in multistep and dynamic tasks. Notably, UI-TARS achieves excellent results on challenging
benchmarks such as OSWorld (Xie et al., 2024) and AndroidWorld (Rawles et al., 2024a). In OSWorld,
UI-TARS-72B achieves scores of 24.6 with 50 steps and 22.7 with 15 steps, outperforming Claude’s 22.0
and 14.9 respectively. In AndroidWorld, it achieves a score of 46.6, outshining GPT-4o’s 34.5, further
emphasizing its ability to tackle high-complexity real-world scenarios.

- **代理能力**：广泛的评估突出了UI-TARS卓越的代理能力。实验证明了UI-TARS在需要推理的基准测试中的出色性能，特别是72B变体在多步骤和动态任务中表现出色。值得注意的是，UI-TARS在具有挑战性的基准测试中取得了出色的成绩，如OSWorld（Xie等，2024）和AndroidWorld（Rawles等，2024a）。在OSWorld中，UI-TARS-72B在50步和15步中分别获得了24.6和22.7的分数，超过了Claude的22.0和14.9。在AndroidWorld中，它获得了46.6的分数，超过了GPT-4o的34.5，进一步强调了其解决高复杂性现实场景的能力。


## 2 Evolution Path of GUI Agents（GUI代理的演变路径）

GUI agents are particularly significant in the context of automating workflows, where they help streamline
repetitive tasks, reduce human effort, and enhance productivity. At their core, GUI agents are designed to
facilitate the interaction between humans and machines, simplifying the execution of tasks. Their evolution
reflects a progression from rigid, human-defined heuristics to increasingly autonomous systems that can adapt,
learn, and even independently identify tasks. In this context, the role of GUI agents has shifted from simple
automation to full-fledged, self-improving agents that increasingly integrate with the human workflow, acting
not just as tools, but as collaborators in the task execution process.

在自动化工作流程的背景下，GUI代理尤为重要，它们有助于简化重复性任务、减少人力成本并提高生产力。在本质上，GUI代理旨在促进人与机器之间的交互，简化任务的执行。它们的演变反映了从刚性、人为定义的启发式到越来越自主的系统的进步，这些系统可以适应、学习，甚至独立识别任务。在这种情况下，GUI代理的角色已经从简单的自动化转变为全面的、自我改进的代理，它们越来越多地与人类工作流程集成，不仅作为工具，而且作为任务执行过程中的合作者。

Over the years, agents have progressed from basic rule-based automation to an advanced, highly automated,
and flexible system that increasingly mirrors human-like behavior and requires minimal human intervention
to perform its tasks. As illustrated in Figure 2, the development of GUI agents can be broken down into
several key stages, each representing a leap in autonomy, flexibility, and generalization ability. Each stage is
characterized by how much human intervention is required in the workflow design and learning process.

多年来，代理已经从基本的基于规则的自动化发展到一种高度自动化、灵活的系统，它越来越像人类行为，并且需要最少的人类干预来执行任务。如图2所示，GUI代理的发展可以分为几个关键阶段，每个阶段都代表了自主性、灵活性和泛化能力的飞跃。每个阶段的特点在于工作流程设计和学习过程中需要多少人类干预。

### 2.1 Rule-based Agents（基于规则的代理）

**Stage 1: Rule-based Agents** In the initial stage, agents such as Robotic Process Automation (RPA)
systems (Dobrica, 2022; Hofmann et al., 2020) were designed to replicate human actions in highly structured
environments, often interacting with GUIs and enterprise software systems. These agents typically processed
user instructions by matching them to predefined rules and invoking APIs accordingly. Although effective for
well-defined and repetitive tasks, these systems were constrained by their reliance on human-defined heuristics
and explicit instructions, hindering their ability to handle novel and complex scenarios. At this stage, the
agent cannot learn from its environment or previous experiences, and any changes to the workflow require
human intervention. Moreover, these agents require direct access to APIs or underlying system permissions,
as demonstrated by systems like DART (Memon et al., 2003), WoB (Shi et al., 2017), Roscript (Qian et al.,
2020) and FLIN (Mazumder & Riva, 2021). This makes it unsuitable for cases where such access is restricted
or unavailable. This inherent rigidity constrained their applicability to scale across diverse environments.

**阶段1：基于规则的代理** 在最初阶段，诸如机器人流程自动化（RPA）系统（Dobrica，2022；Hofmann等，2020）的代理被设计为在高度结构化的环境中复制人类操作，通常与GUI和企业软件系统交互。这些代理通常通过将用户指令与预定义规则匹配并相应调用API来处理。尽管对于明确定义和重复性任务有效，但这些系统受制于依赖于人为定义的启发式和明确指令，从而阻碍了其处理新颖和复杂场景的能力。在这个阶段，代理不能从其环境或先前的经验中学习，对工作流程的任何更改都需要人类干预。此外，这些代理需要直接访问API或底层系统权限，正如DART（Memon等，2003）、WoB（Shi等，2017）、Roscript（Qian等，2020）和FLIN（Mazumder和Riva，2021）等系统所示。这使得它不适用于访问受限或不可用的情况。这种固有的刚性限制了它们在各种环境中的可扩展性。

The limitations of rule-based agents underscore the importance of transitioning to GUI-based agents that
rely on visual information and explicit operation on GUIs instead of requiring low-level access to systems.
Through visual interaction with interfaces, GUI agents unlock greater flexibility and adaptability, significantly
expanding the range of tasks they can accomplish without being limited by predefined rules or the need for
explicit system access. This paradigm shift opens pathways for agents to interact with unfamiliar or newly
developed interfaces autonomously.

基于规则的代理的局限性凸显了转向基于GUI的代理的重要性，这些代理依赖于视觉信息和对GUI的显式操作，而不是需要对系统进行低级访问。通过与界面的视觉交互，GUI代理解锁了更大的灵活性和适应性，显著扩大了它们可以完成的任务范围，而不受预定义规则或对显式系统访问的限制。这种范式转变为代理与陌生或新开发的界面自主交互打开了途径。

![](/images/2025/UI-TARS/Figure2.png)

图2：GUI代理的演变路径。

| 2023 | 2024 | 2025 | |
| --- | --- | --- | --- |
| 基于规则的代理 | 代理框架 | 原生代理模型 | 主动和终身代理<br/>- 人类干预程度<br/>- 泛化能力 |
| 查看今天北京的天气。 | {Location}在{Date}的天气如何？ | - 查看北京的天气并设置一个降温提醒。<br/>- 帮我在PPT中添加一张幻灯片。<br/>- 为我预订明天去北京的机票。 | 给我夏威夷旅行建议。 |

### 2.2 From Modular Agent Framework to Native Agent Model（从模块化代理框架到原生代理模型）

Agent frameworks leveraging the power of large models (M)LLMs have surged in popularity recently. This
surge is driven by the foundation models’ ability to deeply comprehend diverse data types and generate relevant
outputs via multi-step reasoning. Unlike rule-based agents, which necessitate handcrafted rules for each
specific task, foundation models can generalize across different environments and effectively handle tasks by
interacting multiple times with environments. This eliminates the need for humans to painstakingly define
rules for every new scenario, significantly simplifying agent development and deployment.

最近，利用大型模型（M）LLMs的代理框架变得越来越受欢迎。这种激增是由基础模型深度理解各种数据类型并通过多步推理生成相关输出的能力推动的。与基于规则的代理不同，后者需要为每个特定任务制定手工规则，基础模型可以在不同环境中泛化，并通过多次与环境交互有效地处理任务。这消除了人类为每个新场景费力定义规则的需要，显著简化了代理的开发和部署。

**Stage 2: Agent Framework** Specifically, these agent systems mainly leverage the understanding and
reasoning capabilities of advanced foundation models (e.g., GPT-4 (OpenAI, 2023b) and GPT-4o (Hurst et al.,
2024)) to enhance task execution flexibility, which become more flexible, framework-based agents. Early
efforts primarily focused on tasks such as calling specific APIs or executing code snippets within text-based
interfaces (Wang et al., 2023; Li et al., 2023a,b; Wen et al., 2023; Nakano et al., 2021). These agents marked a
significant advancement from purely rule-based systems by enabling more automatic and flexible interactions.
Autonomous frameworks like AutoGPT (Yang et al., 2023a) and LangChain allow agents to integrate multiple
external tools, APIs, and services, enabling a more dynamic and adaptable workflow.

**阶段2：代理框架** 具体来说，这些代理系统主要利用先进基础模型（例如GPT-4（OpenAI，2023b）和GPT-4o（Hurst等，2024））的理解和推理能力来增强任务执行的灵活性，这些代理变得更加灵活，基于框架。早期的努力主要集中在调用特定API或在基于文本的界面中执行代码片段等任务上。这些代理通过实现更多的自动化和灵活交互，标志着从纯粹基于规则的系统中取得了重大进展。像AutoGPT（Yang等，2023a）和LangChain这样的自主框架允许代理集成多个外部工具、API和服务，实现更动态和适应性的工作流程。

Enhancing the performance of foundation model-based agent frameworks often involves designing taskspecific workflows and optimizing prompts for each component. For instance, some approaches augment these
frameworks with specialized modules, such as short- or long-term memory, to provide task-specific knowledge
or store operational experience for self-improvement. Cradle (Tan et al., 2024) enhances foundational agents’
multitasking capabilities by storing and leveraging task execution experiences. Similarly, Song et al. (2024)
propose a framework for API-driven web agents that utilizes task-specific background knowledge to execute
complex web operations. The Agent Workflow Memory (AWM) module (Wang et al., 2024g) further optimizes
memory management by selectively providing relevant workflows to guide the agent’s subsequent actions.
Another common strategy to improve task success is the incorporation of reflection-based, multi-step reasoning
to refine action planning and execution. The widely recognized ReAct framework (Yao et al., 2023) integrates
reasoning with the outcomes of actions, enabling more dynamic and adaptable planning. For multimodal tasks,
MMNavigator (Yan et al., 2023) leverages summarized contextual actions and mark tags to generate accurate,
executable actions. SeeAct (Zheng et al., 2024b) takes a different approach by explicitly instructing GPT-4V
to mimic human browsing behavior, taking into account the task, webpage content, and previous actions.
Furthermore, multi-agent collaboration has emerged as a powerful technique for boosting task completion rates.
MobileExperts (Zhang et al., 2024c), for example, addresses the unique challenges of mobile environments
by incorporating tool formulation and fostering collaboration among multiple agents. In summary, current
advancements in agent frameworks heavily rely on optimizing plan and action generation through prompt
engineering, centered around the capabilities of the underlying foundation models, ultimately leading to
improved task completion.

提升基于基础模型的代理框架性能通常涉及设计特定任务的工作流程并优化每个组件的提示。例如，一些方法通过专门的模块（如短期或长期记忆）增强这些框架，以提供特定任务的知识或存储操作经验以实现自我改进。Cradle（Tan等，2024年）通过存储和利用任务执行经验来增强基础代理的多任务处理能力。同样，Song等（2024年）提出了一个API驱动的网页代理框架，利用特定任务的背景知识来执行复杂的网页操作。Agent Workflow Memory（AWM）模块（Wang等，2024g）通过有选择地提供相关工作流程来指导代理的后续行动，从而进一步优化记忆管理。另一种常见的提高任务成功率的策略是引入基于反思的多步骤推理，以改进行动计划和执行。广受认可的ReAct框架（Yao等，2023年）将推理与行动结果结合起来，使计划更加动态和适应性更强。对于多模态任务，MMNavigator（Yan等，2023年）利用总结的上下文动作和标记标签生成准确、可执行的动作。SeeAct（Zheng等，2024b）采取不同的方法，通过明确指示GPT-4V模仿人类浏览行为，考虑任务、网页内容和先前的动作。此外，多代理协作已成为提高任务完成率的强大技术。例如，MobileExperts（Zhang等，2024c）通过引入工具制定和促进多个代理之间的协作，解决了移动环境的独特挑战。总之，`当前代理框架的进展主要依赖于通过提示工程优化计划和动作生成，围绕基础模型的能力，最终提高任务完成度。`

**Key Limitations of Agent Frameworks** Despite greater adaptability compared to rule-based systems,
agent frameworks still rely on human-defined workflows to structure their actions. The “agentic workflow
knowledge” (Wang et al., 2024g) is manually encoded through custom prompts, external scripts, or tool-usage
heuristics. This externalization of knowledge yields several drawbacks:

**代理框架的主要局限性** 尽管与基于规则的系统相比，代理框架具有更大的适应性，但它们仍然依赖于人为定义的工作流程来构建其行动。通过自定义提示、外部脚本或工具使用启发式手段手动编码“代理工作流知识”（Wang等，2024g）。这种知识的外部化产生了几个缺点：

- **Fragility and Maintenance Overhead**: whenever tasks, interfaces, or usage scenarios evolve, the
workflow’s manual rules or prompts must be re-crafted or extended by developers—an error-prone and
labor-intensive process.

- **脆弱性和维护开销**：每当任务、界面或使用场景发生变化时，工作流的手动规则或提示必须由开发人员重新制定或扩展，这是一个容易出错且劳动密集的过程。

- **Disjoint Learning Paradigms**: framework-based methods rarely integrate new experience data to update
the underlying LLM/VLM parameters. Instead, they rely on offline prompt-engineering or workflow
design. As tasks deviate from the original domain, these frameworks often fail, limiting adaptability.

- **不连贯的学习范式**：基于框架的方法很少集成新的经验数据来更新基础LLM/VLM参数。相反，它们依赖于离线提示工程或工作流设计。随着任务偏离原始领域，这些框架通常会失败，限制了适应性。

- **Module Incompatibility**: complex tasks demand multiple modules (e.g., visual parsing, memory stores,
long-horizon planning) that must coordinate via prompts or bridging code. Inconsistencies or errors in
any module can derail the entire pipeline, and diagnosing these issues typically requires domain experts
to debug the flow.

- **模块不兼容性**：复杂任务需要多个模块（例如，视觉解析、存储器、长期规划），这些模块必须通过提示或桥接代码进行协调。任何模块中的不一致性或错误都可能使整个流程失控，诊断这些问题通常需要领域专家来调试流程。

Thus, while agent frameworks offer quick demonstrations and are flexible within a narrow scope, they
ultimately remain brittle when deployed in real-world scenarios, where tasks and interfaces continuously
evolve. **This reliance on pre-programmed workflows, driven by human expertise, makes frameworks
inherently non-scalable.** They depend on the foresight of developers to anticipate all future variations, which
limits their capacity to handle unforeseen changes or learn autonomously. Frameworks are **design-driven**,
meaning they lack the ability to learn and generalize across tasks without continuous human involvement.

因此，尽管代理框架在狭窄范围内提供了快速演示，并且具有灵活性，但在部署在不断发展的任务和界面的实际场景中时，它们最终仍然是脆弱的。**这种依赖预编程工作流程，由人类专业知识驱动，使得框架本质上不可扩展。**它们依赖于开发人员的远见，以预见所有未来的变化，这限制了它们处理未预料到的变化或自主学习的能力。框架是**设计驱动**的，这意味着它们缺乏在没有持续人类参与的情况下跨任务学习和泛化的能力。

**Stage 3: Native Agent Model** In contrast, the future of autonomous agent development lies in the creation
of native agent models, where workflow knowledge is embedded directly within the agent’s model through
orientational learning. In this paradigm, tasks are learned and executed in an end-to-end manner, unifying
perception, reasoning, memory, and action within a single, continuously evolving model. This approach is
fundamentally **data-driven**, allowing for the seamless adaptation of agents to new tasks, interfaces, or user
needs without relying on manually crafted prompts or predefined rules. Native agents offer several distinct
advantages that contribute to their scalability and adaptability:

**阶段3：原生代理模型** 相比之下，自主代理开发的未来在于创建原生代理模型，其中工作流知识通过定向学习直接嵌入到代理模型中。在这种范式中，任务以端到端的方式学习和执行，将感知、推理、记忆和行动统一到一个单一、不断发展的模型中。这种方法基本上是**数据驱动**的，允许代理无缝地适应新任务、界面或用户需求，而无需依赖手工制作的提示或预定义规则。原生代理提供了几个明显的优势，有助于其可扩展性和适应性：

- **Holistic Learning and Adaptation**: because the agent’s policy is learned end-to-end, it can unify
knowledge from perception, reasoning, memory, and action in its internal parameters. As new data or
user demonstrations become available, the entire system (rather than just a single module or prompt)
updates its knowledge. This empowers the model to adapt more seamlessly to changing tasks, interfaces,
or user demands.

- **整体学习和适应**：因为代理的策略是端到端学习的，所以它可以将感知、推理、记忆和行动的知识统一到其内部参数中。随着新数据或用户演示的出现，整个系统（而不仅仅是单个模块或提示）更新其知识。这使得模型能够更无缝地适应不断变化的任务、界面或用户需求。

- **Reduced Human Engineering**: instead of carefully scripting how the LLM/VLM should be invoked
at each node, native models learn task-relevant workflows from large-scale demonstrations or online
experiences. The burden of “hardwiring a workflow” is replaced by data-driven learning. This significantly
reduces the need for domain experts to handcraft heuristics whenever the environment evolves.

- **减少人工工程**：原生模型不是仔细地编写LLM/VLM应该如何在每个节点调用，而是从大规模演示或在线经验中学习与任务相关的工作流程。“硬连线工作流”的负担被数据驱动的学习所取代。这显著减少了在环境发生变化时需要领域专家手工制作启发式的需求。

- **Strong Generalization via Unified Parameters**: Although manual prompt engineering can make the
model adaptable to user-defined new tools, the model itself cannot evolve. Under one parameterized
policy and a unified data construction and training pipeline, knowledge among environments like certain
app features, navigation strategies, or UI patterns can be transferred across tasks, equipping it with strong
generalization.

- **通过统一参数实现强大的泛化**：尽管手动提示工程可以使模型适应用户定义的新工具，但模型本身无法发展。在一个参数化策略和统一的数据构建和训练管道下，环境之间的知识（如某些应用程序功能、导航策略或UI模式）可以在任务之间转移，为其提供强大的泛化能力。

- **Continuous Self-Improvement**: native agent models lend themselves naturally to online or lifelong learning paradigms. By deploying the agent in real-world GUI environments and collecting new interaction
data, the model can be fine-tuned or further trained to handle novel challenges.

- **持续自我改进**：原生代理模型自然适用于在线或终身学习范式。通过在真实GUI环境中部署代理并收集新的交互数据，可以对模型进行微调或进一步训练以处理新的挑战。

This data-driven, learning-oriented approach stands in contrast to the design-driven, static nature of agent
frameworks. As for now, the development of GUI agent gradually reached this stage, which representative
works like Claude Computer-Use (Anthropic, 2024b), Aguvis (Xu et al., 2024), ShowUI (Lin et al., 2024b),
OS-Atlas (Wu et al., 2024b), Octopus v2-4 (Chen & Li, 2024), etc. These models mainly utilize existing world
data to tailor large VLMs specifically for the domain of GUI interaction.

这种数据驱动、学习导向的方法与基于设计、静态性质的代理框架形成鲜明对比。截至目前，GUI代理的发展逐渐达到了这一阶段，代表性作品如Claude Computer-Use（Anthropic，2024b）、Aguvis（Xu等，2024）、ShowUI（Lin等，2024b）、OS-Atlas（Wu等，2024b）、Octopus v2-4（Chen和Li，2024）等。这些模型主要利用现有的世界数据，专门为GUI交互领域定制大型VLMs。

![](/images/2025/UI-TARS/Figure3.png)

图3：GUI代理的核心能力和评估概述。

### 2.3 Active and Lifelong Agent (Prospect)（主动和终身代理（前景））

**Stage 4: Action and Lifelong Agent** Despite improvements in adaptability, native agents still rely heavily on
human experts for data labeling and training guidance. This dependence inherently restricts their capabilities,
making them contingent upon the quality and breadth of human-provided data and knowledge.

**阶段4：主动和终身代理** 尽管适应性有所提高，但原生代理仍然严重依赖于人类专家进行数据标注和训练指导。这种依赖本质上限制了它们的能力，使它们取决于人类提供的数据和知识的质量和广度。

The transition towards active and lifelong learning (Sur et al., 2022; Ramamoorthy et al., 2024) represents a
crucial next step in the evolution of GUI agents. In this paradigm, agents actively engage with their environment
to propose tasks, execute them, and evaluate the outcomes. These agents can autonomously assign self-rewards
based on the success of their actions, reinforcing positive behaviors and progressively refining their capabilities
through continuous feedback loops. This process of self-directed exploration and learning allows the agent
to discover new knowledge, improve task execution, and enhance problem-solving strategies without heavy
reliance on manual annotations or explicit external guidance.

朝着主动和终身学习（Sur等，2022；Ramamoorthy等，2024）的转变代表了GUI代理发展的关键下一步。在这种范式中，代理积极参与其环境，提出任务、执行任务并评估结果。这些代理可以根据其行动的成功程度自主分配自我奖励，强化积极行为，并通过连续反馈循环逐步完善其能力。这种自主探索和学习的过程使代理能够发现新知识、改进任务执行并增强问题解决策略，而无需过多依赖手动注释或明确的外部指导。

These agents develop and modify their skills iteratively, much like continual learning in robotics (Ayub et al.,
2024; Soltoggio et al., 2024), where they can learn from both successes and failures, progressively enhancing
their generalization across an increasingly broad range of tasks and scenarios. The key distinction between
native agent models and active lifelong learners lies in the autonomy of the learning process: native agents still
depend on humans, whereas active agents drive their own learning by identifying gaps in their knowledge and
filling them through self-initiated exploration.

这些代理像机器人学中的持续学习（Ayub等，2024；Soltoggio等，2024）一样，迭代地发展和修改其技能，它们可以从成功和失败中学习，逐步增强其在越来越广泛的任务和场景中的泛化能力。原生代理模型和主动终身学习者之间的关键区别在于学习过程的自主性：原生代理仍然依赖于人类，而主动代理通过识别其知识中的差距并通过自主探索填补这些差距来推动自己的学习。

In this work, we focus on building a scalable and data-driven native agent model, which paves the way for this
active and lifelong agent stage. We begin by exploring the core capabilities necessary for such a framework
(§ 3) and then introduce UI-TARS, our instantiation of this approach (§ 4).

在这项工作中，我们专注于构建一个可扩展的、数据驱动的原生代理模型，为这一主动和终身代理阶段铺平道路。我们首先探讨这种框架所需的核心能力（§ 3），然后介绍UI-TARS，我们对这种方法的实例化（§ 4）。


## 3 Core Capabilities of Native Agent Model（原生代理模型的核心能力）

The native agent model internalizes modularized components from the previous agent framework into several
core capabilities, thereby transitioning towards an end-to-end structure. To get a more profound understanding
of the native agent model, this section delves into an in-depth analysis of its core capabilities and reviews the
current evaluation metrics and benchmarks.

原生代理模型将先前代理框架中的模块化组件内部化为几个核心能力，从而向端到端结构过渡。为了更深入地了解原生代理模型，本节深入分析了其核心能力，并审查了当前的评估指标和基准测试。

### 3.1 Core Capabilities（核心能力）

As illustrated in Figure 3, our analysis is structured around four main aspects: perception, action, reasoning
(system-1&2 thinking), and memory.

如图3所示，我们的分析围绕四个主要方面展开：感知、行动、推理（系统1和2思维）和记忆。

**Perception** A fundamental aspect of effective GUI agents lies in their capacity to precisely perceive and
interpret graphical user interfaces in real-time. This involves not only understanding static screenshots, but
also dynamically adapting to changes as the interface evolves. We review existing works based on their usage
of input features:

**感知** 有效的GUI代理的一个基本方面在于它们准确感知和解释实时图形用户界面的能力。这不仅涉及理解静态截图，还包括在界面发生变化时动态适应。我们根据它们对输入特征的使用来审查现有作品：

- **Structured Text**: early iterations (Li et al., 2023a; Wang et al., 2023; Wu et al., 2024a) of GUI agents
powered by LLMs are constrained by the LLMs’ limitation of processing only textual input. Consequently,
these agents rely on converting GUI pages into structured textual representations, such as HTML,
accessibility trees, or Document Object Model (DOM). For web pages, some agents use HTML data
as input or leverage the DOM to analyze pages’ layout. The DOM provides a tree-like structure that
organizes elements hierarchically. To reduce input noise, Agent-E (Abuelsaad et al., 2024) utilizes
a DOM distillation technique to achieve more effective screenshot representations. Tao et al. (2023)
introduce WebWISE, which iteratively generates small programs based on observations from filtered
DOM elements and performs tasks in a sequential manner.

- **结构化文本**：由LLMs驱动的GUI代理的早期版本（Li等，2023a；Wang等，2023；Wu等，2024a）受限于LLMs仅处理文本输入的限制。因此，这些代理依赖于将GUI页面转换为结构化文本表示，例如HTML、可访问性树或文档对象模型（DOM）。对于网页，一些代理使用HTML数据作为输入，或利用DOM分析页面的布局。DOM提供了一种树状结构，以层次化方式组织元素。为了减少输入噪声，Agent-E（Abuelsaad等，2024）利用DOM精馏技术实现更有效的截图表示。Tao等（2023）引入了WebWISE，它根据过滤后的DOM元素的观察结果迭代生成小程序，并按顺序执行任务。

- **Visual Screenshot**: with advancements in computer vision and VLMs, agents are now capable of
leveraging visual data from screens to interpret their on-screen environments. A significant portion of
research relies on Set-of-Mark (SoM) (Yang et al., 2023b) prompting to improve the visual grounding
capabilities. To enhance visual understanding, these methods frequently employ Optical Character
Recognition (OCR) in conjunction with GUI element detection models, including ICONNet (Sunkara
et al., 2022) and DINO (Liu et al., 2025). These algorithms are used to identify and delineate interactive
elements through bounding boxes, which are subsequently mapped to specific image regions, enriching
the agents’ contextual comprehension. Some studies also improve the semantic grounding ability and
understanding of elements by adding descriptions of these interactive elements in the screenshots. For
example, SeeAct (Zheng et al., 2024a) enhances fine-grained screenshot content understanding by
associating visual elements with the content they represent in HTML web.

- **视觉截图**：随着计算机视觉和VLMs的进步，代理现在能够利用屏幕上的视觉数据来解释其屏幕环境。研究的重要部分依赖于Set-of-Mark（SoM）（Yang等，2023b）提示来改进视觉基础能力。为了增强视觉理解，这些方法经常与GUI元素检测模型一起使用光学字符识别（OCR），包括ICONNet（Sunkara等，2022）和DINO（Liu等，2025）。这些算法用于通过边界框识别和描绘交互元素，随后将其映射到特定的图像区域，丰富代理的上下文理解。一些研究还通过在截图中添加这些交互元素的描述来提高元素的语义基础能力和理解能力。例如，SeeAct（Zheng等，2024a）通过将视觉元素与它们在HTML网页中代表的内容相关联，增强了对截图内容的细粒度理解。

- **Comprehensive Interface Modeling**: recently, certain works have employed structured text, visual
snapshots, and semantic outlines of elements to attain a holistic understanding of external perception. For
instance, Gou et al. (2024a) synthesize large-scale GUI element data and train a visual grounding model
UGround to gain the associated references of elements in GUI pages on various platforms. Similarly,
OSCAR (Wang & Liu, 2024) utilizes an A11y tree generated by the Windows API for representing
GUI components, incorporating descriptive labels to facilitate semantic grounding. Meanwhile, DUALVCR (Kil et al., 2024) captures both the visual features of the screenshot and the descriptions of associated
HTML elements to obtain a robust representation of the visual screenshot.

- **综合界面建模**：最近，某些作品利用结构化文本、视觉快照和元素的语义轮廓来获得对外部感知的整体理解。例如，Gou等（2024a）综合大规模GUI元素数据，并训练一个视觉基础模型UGround，以获得各种平台上GUI页面元素的相关参考。类似地，OSCAR（Wang和Liu，2024）利用Windows API生成的A11y树来表示GUI组件，结合描述性标签以促进语义基础。与此同时，DUALVCR（Kil等，2024）捕获截图的视觉特征和相关HTML元素的描述，以获得截图的强大表示。

Another important point is the ability to interact in real-time. GUIs are inherently dynamic, with elements
frequently changing in response to user actions or system processes. GUI agents must continuously monitor
these changes to maintain an up-to-date understanding of the interface’s state. This real-time perception is
critical for ensuring that agents can respond promptly and accurately to evolving conditions. For instance,
if a loading spinner appears, the agent should recognize it as an indication of a pending process and adjust
its actions accordingly. Similarly, agents must detect and handle scenarios where the interface becomes
unresponsive or behaves unexpectedly.

另一个重要的点是实时交互的能力。GUI本质上是动态的，元素经常根据用户操作或系统进程的响应而发生变化。GUI代理必须不断监视这些变化，以保持对界面状态的最新理解。这种实时感知对于确保代理能够及时准确地响应不断变化的条件至关重要。例如，如果出现加载旋转器，代理应该将其识别为待处理过程的指示，并相应调整其行动。同样，代理必须检测和处理界面变得无响应或行为异常的情况。

By effectively combining these above aspects, a robust perception system ensures that the GUI agent can
maintain situational awareness and respond appropriately to the evolving state of the user interface, aligning its
actions with the user’s goals and the application’s requirements. However, privacy concerns and the additional
perceptual noise introduced by the DOM make it challenging to extend pure text descriptions and hybrid
text-visual perceptions to any GUI environment. Hence, similar to human interaction with their surroundings,
a native agent model should directly comprehend the external environment through visual perception and
ground their actions to the original screenshot accurately. By doing so, the native agent model can generalize
various tasks and improve the accuracy of actions at each step.

通过有效地结合上述方面，强大的感知系统确保GUI代理能够保持情境意识，并适当地响应用户界面不断变化的状态，使其行动与用户的目标和应用程序的要求保持一致。然而，隐私问题和DOM引入的额外感知噪声使得将纯文本描述和混合文本-视觉感知扩展到任何GUI环境都具有挑战性。因此，类似于人类与周围环境的互动，原生代理模型应该通过视觉感知直接理解外部环境，并将其行动准确地基于原始截图。通过这样做，原生代理模型可以泛化各种任务，并提高每个步骤的行动准确性。

**Action** Effective action mechanisms must be versatile, precise, and adaptable to various GUI contexts. Key
aspects include:

**行动** 有效的行动机制必须多功能、精确，并适应各种GUI上下文。关键方面包括：

- **Unified and Diverse Action Space**: GUI agents (Gur et al., 2023; Bonatti et al., 2024) operate across
multiple platforms, including mobile devices, desktop applications, and web interfaces, each with distinct
interaction paradigms. Establishing a unified action space abstracts platform-specific actions into a common set of operations such as click, type, scroll, and drag. Additionally, integrating actions from
language agents—such as API calls (Chen et al., 2024b; Li et al., 2023a,b), code interpretation (Wu et al.,
2024a), and Command-Line Interface (CLI) (Mei et al., 2024) operations—enhances agent versatility.
Actions can be categorized into atomic actions, which execute single operations, and compositional
actions, which sequence multiple atomic actions to streamline task execution. Balancing atomic and
compositional actions optimizes efficiency and reduces cognitive load, enabling agents to handle both
simple interactions and the coordinated execution of multiple steps seamlessly.

- **统一和多样化的行动空间**：GUI代理（Gur等，2023；Bonatti等，2024）跨多个平台运行，包括移动设备、桌面应用程序和Web界面，每个平台都有不同的交互范式。建立一个统一的行动空间将平台特定的操作抽象为一组通用操作，例如点击、输入、滚动和拖动。此外，集成来自语言代理的操作（例如API调用（Chen等，2024b；Li等，2023a,b）、代码解释（Wu等，2024a）和命令行界面（CLI）（Mei等，2024）操作）可以增强代理的多功能性。行动可以分为原子行动，执行单个操作，和组合行动，将多个原子行动序列化以简化任务执行。平衡原子和组合行动可以优化效率，减少认知负荷，使代理能够无缝处理简单交互和多步骤的协调执行。

- **Challenges in Grounding Coordinates**: accurately determining coordinates for actions like clicks, drags,
and swipes is challenging due to variability in GUI layouts (He et al., 2024; Burger et al., 2020), differing
aspect ratios across devices, and dynamic content changes. Different devices’ aspect ratios can alter
the spatial arrangement of interface elements, complicating precise localization. Grounding coordinates
requires advanced techniques to interpret visual cues from screenshots or live interface streams accurately.

- **坐标基础的挑战**：准确确定点击、拖动和滑动等行动的坐标是具有挑战性的，因为GUI布局的变化（He等，2024；Burger等，2020）、设备之间的不同宽高比以及动态内容的变化。不同设备的宽高比可以改变界面元素的空间排列，使精确定位变得复杂。基础坐标需要先进的技术来准确解释截图或实时界面流的视觉线索。

Due to the similarity of actions across different operational spaces, agent models can standardize actions from
various GUI contexts into a unified action space. Decomposing actions into atomic operations reduces learning
complexity, facilitating faster adaptation and transfer of atomic actions across different platforms.

由于不同操作空间中的行动相似，代理模型可以将来自不同GUI上下文的行动标准化为统一的行动空间。将行动分解为原子操作可以降低学习复杂性，促进原子操作在不同平台之间的更快适应和转移。

**Reasoning with System 1&2 Thinking** Reasoning is a complex capability that integrates a variety of
cognitive functions. Human interaction with GUIs relies on two distinct types of cognitive processes (Groves
& Thompson, 1970): **system 1** and **system 2** thinking.

**系统1和2思维的推理** 推理是一个复杂的能力，它整合了各种认知功能。人类与GUI的互动依赖于两种不同类型的认知过程（Groves和Thompson，1970）：**系统1**和**系统2**思维。

- **System 1** refers to fast, automatic, and intuitive thinking, typically employed for simple and routine tasks, such as clicking a familiar button or dragging a file to a folder without conscious deliberation.

- **系统1**指的是快速、自动和直觉的思维，通常用于简单和常规任务，例如点击一个熟悉的按钮或将文件拖到文件夹中而无需有意识的思考。

- **System 2** encompasses slow, deliberate, and analytical thinking, which is crucial for solving complex tasks, such as planning an overall workflow or reflecting to troubleshoot errors.

- **系统2**包括缓慢、深思熟虑和分析性的思维，对于解决复杂任务至关重要，例如规划整体工作流程或反思以排除错误。

Similarly, autonomous GUI agents must develop the ability to emulate both system 1 and system 2 thinking to
perform effectively across a diverse range of tasks. By learning to identify when to apply rapid, heuristic-based
responses and when to engage in detailed, step-by-step reasoning, these agents can achieve greater efficiency,
adaptability, and reliability in dynamic environments.

同样，自主GUI代理必须发展模拟系统1和系统2思维的能力，以在各种任务中有效执行。通过学会识别何时应用快速、启发式的响应，何时进行详细的逐步推理，这些代理可以在动态环境中实现更高的效率、适应性和可靠性。

**System 1 Reasoning** represents the agent’s ability to execute fast, intuitive responses by identifying patterns
in the interface and applying pre-learned knowledge to observed situations. This form of reasoning mirrors
human interaction with familiar elements of a GUI, such as recognizing that pressing “Enter” in a text field
submits a form or understanding that clicking a certain button progresses to the next step in a workflow. These
heuristic-based actions enable agents to respond swiftly and maintain operational efficiency in routine scenarios.
However, the reliance on pre-defined mappings limits the scope of their decision-making to immediate, reactive
behaviors. For instance, models such as large action models (Wu et al., 2024b; Wang et al., 2024a) excel at
generating quick responses by leveraging environmental observations, but they often lack the capacity for
more sophisticated reasoning. This constraint becomes particularly evident in tasks requiring the planning and
execution of multi-step operations, which go beyond the reactive, one-step reasoning of system 1. Thus, while
system 1 provides a foundation for fast and efficient operation, it underscores the need for agents to evolve
toward more deliberate and reflective capabilities seen in system 2 reasoning.

**系统1推理**代表了代理通过识别界面中的模式并将预先学习的知识应用于观察到的情况来执行快速、直观的响应的能力。这种推理形式反映了人类与GUI的熟悉元素的互动，例如认识到在文本字段中按“Enter”提交表单或理解点击某个按钮会使工作流程进入下一步。这种基于启发式的行动使代理能够迅速响应并在常规场景中保持运营效率。然而，对预定义映射的依赖限制了它们的决策范围，使其决策局限于即时、反应性行为。例如，大型行动模型（Wu等，2024b；Wang等，2024a）等模型通过利用环境观察来生成快速响应，但它们通常缺乏更复杂的推理能力。这种约束在需要规划和执行多步操作的任务中尤为明显，这些任务超出了系统1的反应性、一步推理。因此，虽然系统1为快速高效的操作提供了基础，但它强调了代理向更深思熟虑和反思能力发展的必要性，这种能力在系统2推理中得到体现。

**System 2 Reasoning** represents deliberate, structured, and analytical thinking, enabling agents to handle
complex, multi-step tasks that go beyond the reactive behaviors of system 1. Unlike heuristic-based reasoning,
system 2 involves explicitly generating intermediate thinking processes, often using techniques like Chain-ofThought (CoT) (Wei et al., 2022) or ReAct (Yao et al., 2023), which bridge the gap between simple actions
and intricate workflows. This paradigm of reasoning is composed of several essential components.

**系统2推理**代表了深思熟虑、结构化和分析性思维，使代理能够处理超出系统1反应性行为范围的复杂多步任务。与基于启发式的推理不同，系统2涉及明确生成中间思维过程，通常使用Chain-of-Thought（CoT）（Wei等，2022）或ReAct（Yao等，2023）等技术，这些技术弥合了简单行动和复杂工作流之间的差距。这种推理范式由几个基本组成部分组成。

- First, **task decomposition** focuses on formulating plannings to achieve overarching objectives by decomposing tasks into smaller, manageable sub-tasks (Dagan et al., 2023; Song et al., 2023; Huang et al.,
2024). For example, completing a multi-field form involves a sequence of steps like entering a name,
address, and other details, all guided by a well-structured plan.

- 首先，**任务分解**侧重于通过将任务分解为较小、可管理的子任务（Dagan等，2023；Song等，2023；Huang等，2024）来制定计划以实现总体目标。例如，完成一个多字段表单涉及一系列步骤，如输入姓名、地址和其他详细信息，所有这些都受到良好结构化计划的指导。

- Second, **long-term consistency** is critical during the entire task completion process. By consistently
referring back to the initial objective, agent models can effectively avoid any potential deviations that
may occur during complex, multi-stage tasks, thus ensuring coherence and continuity from start to finish.

- 其次，**长期一致性**在整个任务完成过程中至关重要。通过始终参考最初的目标，代理模型可以有效地避免在复杂的多阶段任务中可能发生的任何偏差，从而确保从头到尾的连贯性和连续性。

- Third, **milestone recognition** allows the agent model to estimate the current state of progress, analyze
observations, and determine the subsequent goals. This ensures that multi-step workflows are executed
effectively without losing direction.

- 第三，**里程碑识别**允许代理模型估计当前的进展状态，分析观察结果，并确定随后的目标。这确保了多步工作流的有效执行，而不会失去方向。

- Fourth, **trial and error** endows agent models with additional opportunities to hypothesize, test, and
assess potential actions, thereby enhancing the precision of decision-making, particularly in ambiguous
and complex scenarios.

- 第四，**试错**赋予代理模型额外的机会来假设、测试和评估潜在的行动，从而提高决策的准确性，特别是在模糊和复杂的情况下。

- Finally, **reflection** equips agent models with the capability to evaluate past actions, identify mistakes,
and make adjustments to improve future performance (Shinn et al., 2023; Renze & Guven, 2024). This
iterative process enhances reliability and helps prevent repetitive errors.

- 最后，**反思**赋予代理模型评估过去行动、识别错误并进行调整以提高未来表现的能力（Shinn等，2023；Renze和Guven，2024）。这个迭代过程增强了可靠性，并有助于防止重复错误。

The development of UI-TARS places a strong emphasis on equipping the model with robust system 2 reasoning
capabilities, allowing it to address complex tasks with greater precision and adaptability. By integrating
high-level planning mechanisms, UI-TARS excels at decomposing overarching goals into smaller, manageable
sub-tasks. This structured approach enables the model to systematically handle intricate workflows that
require coordination across multiple steps. Additionally, UI-TARS incorporates a long-form CoT reasoning
process, which facilitates detailed intermediate thinking before executing specific actions. Furthermore, UITARS adopts reflection-driven training process. By incorporating reflective thinking, the model continuously
evaluates its past actions, identifies potential mistakes, and adjusts its behavior to improve performance over
time. The model’s iterative learning method yields significant benefits, enhancing its reliability and equipping
it to navigate dynamic environments and unexpected obstacles.

UI-TARS的开发非常强调为模型提供强大的系统2推理能力，使其能够以更高的精度和适应性处理复杂任务。通过集成高级规划机制，UI-TARS擅长将总体目标分解为较小、可管理的子任务。这种结构化方法使模型能够系统地处理需要跨多个步骤协调的复杂工作流。此外，UI-TARS还采用了长篇CoT推理过程，这有助于在执行特定行动之前进行详细的中间思考。此外，UI-TARS采用了反思驱动的训练过程。通过融入反思性思维，模型不断评估其过去的行动，识别潜在的错误，并调整其行为以提高性能。模型的迭代学习方法带来了显著的好处，增强了其可靠性，并使其能够在动态环境和意外障碍中导航。

**Memory** The memory is mainly used to store the supported explicit knowledge and historical experience
that the agent refers to when making decisions. For agent frameworks, an additional memory module is often
introduced to store previous interactions and task-level knowledge. Agents then retrieve and update these
memory modules during decision-making progress. The memory module can be divided into two categories:

**记忆** 记忆主要用于存储代理在做出决策时参考的支持显式知识和历史经验。对于代理框架，通常引入额外的记忆模块来存储先前的交互和任务级知识。代理在决策过程中检索和更新这些记忆模块。记忆模块可以分为两类：

- **Short-term Memory**: this serves as a temporary repository for task-specific information, capturing
the agent’s immediate context. This includes the agent’s action history, current state details, and the
ongoing execution trajectory of the task, enabling real-time situational awareness and adaptability. By
semantically processing contextual screenshots, CoAT (Zhang et al., 2024d) extracts key interface details,
thereby enhancing comprehension of the task environment. CoCo-Agent (Ma et al., 2024) records layouts
and dynamic states through Comprehensive Environment Perception (CEP).

- **短期记忆**：这充当了任务特定信息的临时存储库，捕获了代理的即时上下文。这包括代理的行动历史、当前状态细节和任务的进行中执行轨迹，从而实现实时情境意识和适应性。通过语义处理上下文截图，CoAT（Zhang等，2024d）提取关键界面细节，从而增强了对任务环境的理解。CoCo-Agent（Ma等，2024）通过全面环境感知（CEP）记录布局和动态状态。

- **Long-term Memory**: it operates as a long-term data reserve, capturing and safeguarding records of
previous interaction, tasks, and background knowledge. It retains details such as execution paths from
prior tasks, offering a comprehensive knowledge base that supports reasoning and decision-making for
future tasks. By integrating accumulated knowledge that contains user preferences and task operation
experiences, OS-copilot (Wu et al., 2024a) refines its task execution over time to better align with user
needs and improve overall efficiency. Cradle (Tan et al., 2024) focuses on enhancing the multitasking
abilities of foundational agents by equipping them with the capability to store and utilize task execution
experiences. Song et al. (2024) introduce a framework for API-driven web agents that leverage taskspecific background knowledge to perform complex web operations.

- **长期记忆**：它作为长期数据储备，捕获和保护先前交互、任务和背景知识的记录。它保留了来自先前任务的执行路径等细节，为未来任务的推理和决策提供了全面的知识库。通过整合包含用户偏好和任务操作经验的累积知识，OS-copilot（Wu等，2024a）随着时间的推移不断完善其任务执行，以更好地满足用户需求并提高整体效率。Cradle（Tan等，2024）专注于通过为其提供存储和利用任务执行经验的能力来增强基础代理的多任务能力。Song等（2024）引入了一个基于API的Web代理框架，利用任务特定的背景知识来执行复杂的Web操作。

Memory reflects the capability to leverage background knowledge and input context. The synergy between
short-term and long-term memory storage significantly enhances the efficiency of an agent’s decision-making
process. Native agent models, unlike agent frameworks, encode long-term operational experience of tasks
within their internal parameters, converting the observable interaction process into implicit, parameterized
storage. Techniques such as In-Context Learning (ICL) or CoT reasoning can be employed to activate this
internal memory.

记忆反映了利用背景知识和输入上下文的能力。短期和长期记忆存储之间的协同作用显著增强了代理决策过程的效率。与代理框架不同，**原生代理模型**`将任务的长期操作经验编码到其内部参数中，将可观察的交互过程转换为隐式、参数化的存储。可以使用In-Context Learning（ICL）或CoT推理等技术来激活这种内部记忆。`

### 3.2 Capability Evaluation（能力评估）

To evaluate the effectiveness of GUI agents, numerous benchmarks have been meticulously designed, focusing
on various aspects of capabilities such as perception, grounding, and agent capabilities. Specifically, **Perception Evaluation** reflects the degree of understanding of GUI knowledge. **Grounding Evaluation** verifies whether
agents can accurately locate coordinates in diverse GUI layouts. Agent capabilities can be primarily divided
into two categories: **Offline Agent Capability Evaluation**, which is conducted in a predefined and static
environment and mainly focuses on assessing the individual steps performed by GUI agents, and **Online Agent Capability Evaluation**, which is performed in an interactive and dynamic environment and evaluates
the agent’s overall capability to successfully complete the task.

为了评估GUI代理的有效性，已经精心设计了许多基准测试，重点关注感知、基础和代理能力等各个方面的能力。具体来说，**感知评估**反映了对GUI知识的理解程度。**基础评估**验证了代理是否能够准确地定位各种GUI布局中的坐标。代理能力主要可以分为两类：**离线代理能力评估**，在预定义和静态环境中进行，主要集中在评估GUI代理执行的各个步骤，以及**在线代理能力评估**，在交互式和动态环境中进行，评估代理成功完成任务的整体能力。

**Perception Evaluation** Perception evaluation assesses agents’ understanding of user interface (UI) knowledge and their awareness of the environment. For instance, VisualWebBench (Liu et al., 2024c) focuses on
agents’ web understanding capabilities, while WebSRC (Chen et al., 2021) and ScreenQA (Hsiao et al., 2022)
evaluate web structure comprehension and mobile screen content understanding through question-answering
(QA) tasks. Additionally, GUI-World (Chen et al., 2024a) offers a wide range of queries in multiple-choice,
free-form, and conversational formats to assess GUI understanding. Depending on the varying question
formats, a range of metrics are employed. For instance, accuracy is utilized for multiple-choice question
(MCQ) tasks as the key metric, and in the case of captioning or Optical Character Recognition (OCR) tasks,
the ROUGE-L metric is adopted to evaluate performance.

**感知评估**感知评估评估代理对用户界面（UI）知识的理解和对环境的意识。例如，VisualWebBench（Liu等，2024c）关注代理的Web理解能力，而WebSRC（Chen等，2021）和ScreenQA（Hsiao等，2022）通过问答（QA）任务评估Web结构理解和移动屏幕内容理解。此外，GUI-World（Chen等，2024a）提供了多项选择、自由形式和对话格式的广泛查询，以评估GUI理解。根据不同的问题格式，采用了一系列指标。例如，准确性被用作多项选择问题（MCQ）任务的关键指标，而在字幕或光学字符识别（OCR）任务中，采用ROUGE-L指标来评估性能。

**Grounding Evaluation** Given an instructions, grounding evaluation focuses on the ability to precisely
locate GUI elements. ScreenSpot (Cheng et al., 2024) evaluates single-step GUI grounding performance
across multiple platforms. ScreenSpot v2 (Wu et al., 2024b), a re-annotated version, addresses annotation
errors present in the original ScreenSpot. ScreenSpot Pro (Li et al., 2025) facilitates grounding evaluation
by incorporating real-world tasks gathered from diverse high-resolution professional desktop environments.
Metrics for grounding evaluation are usually determined based on whether the model’s predicted location
accurately lies within the bounding box of the target element.

**基础评估**给定一组指令，基础评估侧重于准确定位GUI元素的能力。ScreenSpot（Cheng等，2024）评估了跨多个平台的单步GUI基础性能。ScreenSpot v2（Wu等，2024b）是一个重新注释的版本，解决了原始ScreenSpot中存在的注释错误。ScreenSpot Pro（Li等，2025）通过整合从多样化的高分辨率专业桌面环境中收集的真实任务，促进了基础评估。基础评估的指标通常是根据模型的预测位置是否准确地位于目标元素的边界框内来确定的。

**Offline Agent Capability Evaluation** Offline evaluation measures the performance of GUI agents in
static, pre-defined environments. Each environment typically includes an input instruction and the current
state of the environment (e.g., a screenshot or a history of previous actions), requiring agents to produce
the correct outputs or actions. These environments remain consistent throughout the evaluation process.
Numerous offline evaluation benchmarks, including AITW (Rawles et al., 2023), Mind2Web (Deng et al.,
2023), MT-Mind2Web (Deng et al., 2024), AITZ (Zhang et al., 2024e), AndroidControl (Li et al., 2024c), and
GUI-Odyssey (Lu et al., 2024a), provide agents with a task description, a current screenshot, and previous
actions history, aimed at enabling accurate prediction of the next action. These benchmarks commonly
employ step-level metrics , providing fine-grained supervision of their specific behaviors. For instance, the
Action-Matching Score (Rawles et al., 2023; Zhang et al., 2024e; Li et al., 2024c; Lu et al., 2024a) considers
an action correct solely when both the type of action and its specific details (e.g. arguments like typed content
or scroll direction) are consistent with the ground truth. Some benchmarks (Li et al., 2020a; Burns et al.,
2022) demand that agents produce a series of automatically executable actions from provided instructions and
screenshots. These benchmarks predominantly assess performance using task-level metrics, which determine
task success by whether the output results precisely match the pre-defined labels, like the complete and partial
action sequence matching accuracy (Li et al., 2020a; Burns et al., 2022; Rawles et al., 2023).

**离线代理能力评估**离线评估衡量GUI代理在静态、预定义环境中的性能。每个环境通常包括一个输入指令和环境的当前状态（例如，截图或先前操作的历史记录），要求代理产生正确的输出或行动。这些环境在整个评估过程中保持一致。许多离线评估基准，包括AITW（Rawles等，2023）、Mind2Web（Deng等，2023）、MT-Mind2Web（Deng等，2024）、AITZ（Zhang等，2024e）、AndroidControl（Li等，2024c）和GUI-Odyssey（Lu等，2024a），为代理提供任务描述、当前截图和先前操作历史，旨在实现对下一个行动的准确预测。这些基准通常采用步骤级指标，提供对其特定行为的细粒度监督。例如，行动匹配分数（Rawles等，2023；Zhang等，2024e；Li等，2024c；Lu等，2024a）仅在行动类型和其具体细节（例如，输入内容或滚动方向等参数）与地面真相一致时才被认为是正确的。一些基准（Li等，2020a；Burns等，2022）要求代理根据提供的指令和截图生成一系列可自动执行的操作。这些基准主要使用任务级指标来评估性能，这些指标通过输出结果是否与预定义标签完全匹配来确定任务成功，例如完整和部分行动序列匹配准确性（Li等，2020a；Burns等，2022；Rawles等，2023）。

**Online Agent Capability Evaluation** Online evaluation facilitates dynamic environments, each designed as
an interactive simulation that replicates real-world scenarios. In these environments, GUI agents can modify
environmental states by executing actions in real time. These dynamic environments span various platforms:
(1) Web: WebArena (Zhou et al., 2023) and MMInA (Zhang et al., 2024g) provide realistic web environments.
(2) Desktop: OSWorld (Xie et al., 2024), OfficeBench (Wang et al., 2024f), ASSISTGUI (Gao et al., 2023), and
WindowsAgentArena (Bonatti et al., 2024) operate within real computer desktop environments. (3) Mobile:
AndroidWorld (Rawles et al., 2024a), LlamaTouch (Zhang et al., 2024f), and B-MOCA (Lee et al., 2024) are
built on mobile operating systems such as Android. To assess performance in online evaluation, task-level
metrics are employed, providing a comprehensive measure of the agents’ effectiveness. Specifically, in the
realm of online agent capability evaluation, these task-level metrics primarily determine task success based
on whether an agent successfully reaches a goal state. This verification process checks whether the intended
outcome achieved or if the resulting outputs precisely align with the labels (Zhou et al., 2023; Xie et al., 2024;
Wang et al., 2024f; Gao et al., 2023).

**在线代理能力评估**在线评估促进了动态环境，每个环境都设计为一个交互式模拟，复制真实世界的场景。在这些环境中，GUI代理可以通过实时执行操作来修改环境状态。这些动态环境涵盖了各种平台：（1）Web：WebArena（Zhou等，2023）和MMInA（Zhang等，2024g）提供了逼真的Web环境。 （2）桌面：OSWorld（Xie等，2024）、OfficeBench（Wang等，2024f）、ASSISTGUI（Gao等，2023）和WindowsAgentArena（Bonatti等，2024）在真实的计算机桌面环境中运行。 （3）移动：AndroidWorld（Rawles等，2024a）、LlamaTouch（Zhang等，2024f）和B-MOCA（Lee等，2024）建立在Android等移动操作系统上。为了评估在线评估中的性能，采用了任务级指标，提供了对代理效果的全面衡量。具体来说，在在线代理能力评估领域，这些任务级指标主要根据代理是否成功达到目标状态来确定任务成功。这个验证过程检查了是否达到了预期的结果，或者结果输出是否与标签完全一致（Zhou等，2023；Xie等，2024；Wang等，2024f；Gao等，2023）。


## 4 UI-TARS

In this section, we introduce UI-TARS, a native GUI agent model designed to operate without reliance on
cumbersome manual rules or the cascaded modules typical of conventional agent frameworks. UI-TARS
directly perceives the screenshot, applies reasoning processes, and generates valid actions autonomously.
Moreover, UI-TARS can learn from prior experience, iteratively refining its performance by leveraging
environment feedback.

在本节中，我们介绍UI-TARS，这是一种原生GUI代理模型，旨在在不依赖繁琐的手动规则或传统代理框架典型的级联模块的情况下运行。UI-TARS直接感知截图，应用推理过程，并自主生成有效的行动。此外，UI-TARS可以从先前的经验中学习，通过利用环境反馈不断完善其性能。

![](/images/2025/UI-TARS/Figure4.png)

图4：UI-TARS概述。我们展示了模型的架构及其核心能力。

In the following, we begin by describing the overall architecture of UI-TARS (§ 4.1), followed by how we
enhance its perception (§ 4.2) and action (§ 4.3) capabilities. Then we concentrate on how to infuse system-2
reasoning capabilities into UI-TARS (§ 4.4) and iterative improvement through experience learning (§ 4.5).

接下来，我们首先描述UI-TARS的总体架构（§ 4.1），然后介绍我们如何增强其感知（§ 4.2）和行动（§ 4.3）能力。然后，我们集中讨论如何将系统2推理能力注入UI-TARS（§ 4.4）以及通过经验学习进行迭代改进（§ 4.5）。

### 4.1 Architecture Overview（架构概述）

As illustrated in Figure 4, given an initial task instruction, UI-TARS iteratively receives observations from the
device and performs corresponding actions to accomplish the task. This sequential process can be formally
expressed as:

(instruction,(o1, a1),(o2, a2), · · · ,(on, an)), (1)

如图4所示，给定一个初始任务指令，UI-TARS迭代地接收设备的观察结果，并执行相应的操作来完成任务。这个顺序过程可以形式化地表达为：

(instruction,(o1, a1),(o2, a2), · · · ,(on, an)), (1)

where oi denotes the observation (device screenshot) at time step i, and ai represents the action executed by
the agent. At each time step, UI-TARS takes as input the task instruction, the history of prior interactions
(o1, a1, · · · , oi−1, ai−1), and the current observation oi
. Based on this input, the model outputs an action ai
from the predefined action space. After executing the action, the device provides the subsequent observation,
and these processes iteratively continue.

其中oi表示时间步i的观察结果（设备截图），ai表示代理执行的操作。在每个时间步，UI-TARS将任务指令、先前交互历史（o1，a1，···，oi−1，ai−1）和当前观察结果oi作为输入。基于这个输入，模型从预定义的行动空间中输出一个行动ai。在执行操作后，设备提供了后续的观察结果，这些过程迭代地继续。

To further enhance the agent’s reasoning capabilities and foster more deliberate decision-making, we integrate
a reasoning component in the form of “thoughts” ti
, generated before each action ai
. These thoughts reflect
the reflective nature of “System 2” thinking. They act as a crucial intermediary step, guiding the agent to
reconsider previous actions and observations before moving forward, thus ensuring that each decision is made
with intentionality and careful consideration.

为了进一步增强代理的推理能力并促进更深思熟虑的决策，我们集成了一个推理组件，即在每个行动ai之前生成的“思考”ti。这些思考反映了“系统2”思维的反思性质。它们作为一个关键的中间步骤，引导代理在继续前重新考虑先前的行动和观察，从而确保每个决策都是有意识的和经过深思熟虑的。

This approach is inspired by the ReAct framework (Yao et al., 2023), which introduces a similar reflective
mechanism but in a more straightforward manner. In contrast, our integration of “thoughts” involves a more
structured, goal-oriented deliberation. These thoughts are a more explicit reasoning process that guides the
agent toward better decision-making, especially in complex or ambiguous situations. The process can now be
formalized as:

(instruction,(o1, t1, a1),(o2, t2, a2), · · · ,(on, tn, an)), (2)

这种方法受到ReAct框架（Yao等，2023）的启发，后者引入了类似的反思机制，但方式更为简单。相比之下，我们对“思考”的整合涉及更为结构化、目标导向的思考。这些思考是一个更明确的推理过程，引导代理做出更好的决策，特别是在复杂或模糊的情况下。这个过程现在可以形式化为：

(instruction,(o1, t1, a1),(o2, t2, a2), · · · ,(on, tn, an)), (2)

these intermediate thoughts guide the model’s decision-making and enable more nuanced and reflective interactions with the environment.

这些中间思考引导模型的决策，并使其能够与环境进行更微妙和反思的交互。

In order to optimize memory usage and maintain efficiency within the typically constrained token budget (e.g.,
32k sequence length), we limit the input to the last N observations. This constraint ensures the model remains
capable of handling the necessary context without overwhelming its memory capacity. The full history of
previous actions and thoughts is retained as short-term memory. UI-TARS predicts the thought tn and action
an outputs iteratively, conditioned on both the task instruction and the previous interactions:

P(tn, an &#124; instruction, t1, a1, · · · ,(on−i, tn−i, an−i)N i=1, on). (3)

为了优化内存使用并在通常受限的令牌预算（例如，32k序列长度）内保持效率，我们将输入限制为最后N个观察结果。这个约束确保了模型能够处理必要的上下文，而不会超出其内存容量。先前行动和思考的完整历史记录被保留为短期记忆。UI-TARS预测思考tn和行动an的输出，条件是任务指令和先前的交互：

P(tn, an &#124; instruction, t1, a1, · · · ,(on−i, tn−i, an−i)N i=1, on). (3)

![](/images/2025/UI-TARS/Figure5.png)

图5：感知和基础数据的数据示例。

1. Task Grounding（任务基础）
    - Query: Help me delete This Email.（帮我删除这封邮件。）
    - Answer: [0.27,0.86,0.34,0.89]
2. Element Description（元素描述）
    - Visual Description（视觉描述）
        - A button with the text "NewEmail" and an envelope-shaped icon above it.（一个带有文本“NewEmail”和一个信封形状图标的按钮。）
    - Position information（位置信息）
        - Located in the upper-left corner of thepage, it's the first button under the Home tab. To its right is the "New Items" button.（位于页面的左上角，是“主页”选项卡下的第一个按钮。它的右侧是“新项目”按钮。）
    - Element Function（元素功能）
        - This button is interactive, clicking it will take you to the new email composition page.（这个按钮是交互式的，点击它将带您到新的电子邮件撰写页面。）
    - Element Type（元素类型）: Button（按钮）
3. Question Answering（问答）
    - Query: What is that app with the waveform-like icon?（那个波形图标的应用是什么？）
    - Answer: The one you're referring to appears to be the Windows Task Manager icon, which displays a simple performance metric graph. Task Manager is used to monitor system performance and manage running programs and processes. From the screen, we can see that the user has opened this software, but it is currently minimized.（你指的那个应用似乎是Windows任务管理器图标，显示了一个简单的性能指标图。任务管理器用于监视系统性能和管理正在运行的程序和进程。从屏幕上，我们可以看到用户已经打开了这个软件，但它目前是最小化的。）
4. Set of Mark Perception（标记感知）
    - Query: What are the elements inside the yellow bounding box?（黄色边界框内的元素是什么？）
    - Answer: It's a button containing the text "Post a reply" with a blue background and white text.（这是一个按钮，上面有文本“发表回复”，背景是蓝色，文本是白色。）
    - Query: What is the text inside the green circle section?（绿色圆圈部分的文本是什么？）
    - Answer: Microsoft Community <Micr...
5. Dense Captioning（密集字幕）
    - This is a Windows interface screenshot showing a maximized Outlook email window. In the navigation bar, you can see File, Home, Send/Receive... Currently, the second email under the"older" category is right-clicked, with the title "Question has a reply: When Windows 11 22H2 version will be released?"... In the expanded right-click menu, there are several options including Copy, Quick Print, Reply... From the bottom of the screenshot, you can see that the user has many apps open, including File Explorer, an application with a green circular icon. Chrome….（这是一个Windows界面截图，显示了一个最大化的Outlook电子邮件窗口。在导航栏中，您可以看到文件、主页、发送/接收...目前，在“较旧”类别下的第二封电子邮件被右键单击，标题是“问题有回复：Windows 11 22H2版本何时发布？”...在展开的右键单击菜单中，有几个选项，包括复制、快速打印、回复...从截图的底部，您可以看到用户打开了许多应用程序，包括文件资源管理器，一个带有绿色圆形图标的应用程序。Chrome…。）
6. State Transition Captioning（状态转换字幕）
    - The first screenshot shows a Windows desktop with an Outlook app maximized ... On it, you can see that the user has selected the second email under the "Older" category, which brought up a right-click context menu...（第一个截图显示了一个最大化的Outlook应用程序的Windows桌面...您可以看到用户选择了“Older”类别下的第二封电子邮件，这将弹出一个右键上下文菜单...）
    - The second screenshot is largely identical to the first one, with the main difference being: that the Rules option in the right-click menu is expanded, showing additional options like "AlwaysMove Messages From: Microsoft Community", "Always Move Messages To: learntechwithedi@outllok.com"...Additionally, the mouse is hovering over the "Manage Rules & Alerts" option.（第二个截图与第一个截图基本相同，主要区别在于：右键菜单中的“Rules”选项已展开，显示了额外的选项，如“AlwaysMove Messages From: Microsoft Community”，“Always Move Messages To: learntechwithedi@outllok.com"... 此外，鼠标悬停在“Manage Rules & Alerts”选项上。）
    - From the screen content, we can infer that the user clicked on the Rules option in the right-click menu of the second email, which expanded into a submenu.（从屏幕内容中，我们可以推断出用户点击了第二封电子邮件的右键菜单中的“Rules”选项，这将展开为一个子菜单。）

### 4.2 Enhancing GUI Perception（增强GUI感知）

Improving GUI perception presents several unique challenges: (1) Screenshot Scarcity: while large-scale
general scene images are widely available, GUI-specific screenshots are relatively sparse. (2) Information
Density and Precision Requirement: GUI images are inherently more information-dense and structured than
general scene images, often containing hundreds of elements arranged in complex layouts. Models must not
only recognize individual elements but also understand their spatial relationships and functional interactions.
Moreover, many elements in GUI images are small (e.g., 10×10 pixel icons in a 1920×1080 image), making
it difficult to perceive and localize these elements accurately. Unlike traditional frameworks that rely on
separate, modular perception models, native agents overcome these challenges by directly processing raw
input from GUI screenshots. This approach enables them to scale better by leveraging large-scale, unified
datasets, thereby addressing the unique challenges of GUI perception with greater efficiency.

改进GUI感知面临着几个独特的挑战：（1）截图稀缺：虽然大规模的一般场景图像是广泛可用的，但GUI特定的截图相对稀缺。 （2）信息密度和精度要求：GUI图像本质上比一般场景图像更密集和结构化，通常包含数百个元素，排列在复杂的布局中。模型不仅必须识别单个元素，还必须理解它们的空间关系和功能交互。此外，GUI图像中的许多元素都很小（例如，1920×1080图像中的10×10像素图标），这使得准确感知和定位这些元素变得困难。与依赖独立的模块化感知模型的传统框架不同，原生代理通过直接处理GUI截图的原始输入来克服这些挑战。这种方法使它们能够更好地扩展，通过利用大规模、统一的数据集，从而以更高的效率解决GUI感知的独特挑战。

**Screenshot Collection** To address data scarcity and ensure diverse coverage, we built a large-scale dataset
comprising screenshots and metadata from websites, apps, and operating systems. Using specialized parsing
tools, we automatically extracted rich metadata—such as element type, depth, bounding box, and text content
for each element—while rendering the screenshots. Our approach combined automated crawling and humanassisted exploration to capture a wide range of content. We included primary interfaces as well as deeper,
nested pages accessed through repeated interactions. All data was logged in a structured format—(screenshot,
element box, element metadata)—to provide comprehensive coverage of diverse interface designs.

**截图收集** 为了解决数据稀缺性并确保多样化覆盖，我们构建了一个大规模数据集，其中包括来自网站、应用和操作系统的截图和元数据。使用专门的解析工具，我们在渲染截图时自动提取了丰富的元数据，例如每个元素的元素类型、深度、边界框和文本内容。我们的方法结合了自动爬取和人工辅助探索，以捕获各种内容。我们包括了主要界面以及通过重复交互访问的更深层次、嵌套页面。所有数据都以结构化格式记录（截图、元素框、元素元数据），以提供对各种界面设计的全面覆盖。

We adopt a bottom-up data construction approach, starting from individual elements and progressing to holistic
interface understanding. By focusing on small, localized parts of the GUI before integrating them into the
broader context, this approach minimizes errors while balancing precision in recognizing components with the
ability to interpret complex layouts. Based on the collected screenshot data, we curated five core task data
(Figure 5):

我们采用自下而上的数据构建方法，从单个元素开始，逐步发展到整体界面理解。通过在将它们整合到更广泛的上下文之前专注于GUI的小型、局部部分，这种方法在平衡对组件的识别精度和解释复杂布局的能力时最小化了错误。基于收集的截图数据，我们策划了五个核心任务数据（图5）：

**Element Description** To enhance recognizing and understanding specific elements within a GUI, particularly
tiny elements, we focus on creating detailed and structured descriptions for each element. Such descriptions are
based on metadata extracted using parsing tools and further synthesized by a VLM, covering four aspects: (1)
**Element Type** (e.g., windows control types): we classify elements (e.g., buttons, text fields, scrollbars) based
on visual cues and system information; (2) **Visual Description**, which describes the element’s appearance,
including its shape, color, text content, and style, derived directly from the image; (3) **Position Information**:
we describe the spatial position of each element relative to others; (4) **Element Function**, which describes the
element’s intended functionality and possible ways of interactions. We train UI-TARS to enumerate all visible
elements within a screenshot and generate their element descriptions, conditioned on the screenshot.

**元素描述** 为了增强对GUI中特定元素的识别和理解，特别是小元素，我们专注于为每个元素创建详细和结构化的描述。这些描述是基于使用解析工具提取的元数据，并由VLM进一步综合而成，涵盖四个方面：（1）**元素类型**（例如，窗口控件类型）：我们根据视觉线索和系统信息对元素（例如，按钮、文本字段、滚动条）进行分类；（2）**视觉描述**，描述元素的外观，包括其形状、颜色、文本内容和样式，直接从图像中导出；（3）**位置信息**：我们描述每个元素相对于其他元素的空间位置；（4）**元素功能**，描述元素的预期功能和可能的交互方式。我们训练UI-TARS枚举截图中的所有可见元素，并生成它们的元素描述，条件是截图。

**Dense Captioning** We train UI-TARS to understand the entire interface while maintaining accuracy and
minimizing hallucinations. The goal of dense captioning is to provide a comprehensive, detailed description
of the GUI screenshot, capturing not only the elements themselves but also their spatial relationships and
the overall layout of the interface. For each recorded element in the screenshot, we first obtain their element
descriptions. For embedded images, which often lack detailed metadata, we also generate their descriptive
captions. After that, we integrate all the image and element descriptions into a cohesive, highly detailed
caption that preserves the structure of the GUI layout using a VLM. During training, UI-TARS is given only
the image and tasked with outputting the corresponding dense caption.

**密集字幕** 我们训练UI-TARS在保持准确性和最小化幻觉的同时理解整个界面。密集字幕的目标是提供对GUI截图的全面、详细描述，捕捉不仅元素本身，还有它们的空间关系和界面的整体布局。对于截图中记录的每个元素，我们首先获得它们的元素描述。对于嵌入式图像，通常缺乏详细的元数据，我们还生成它们的描述性字幕。之后，我们将所有图像和元素描述整合到一个连贯、高度详细的字幕中，使用VLM保留GUI布局的结构。在训练期间，UI-TARS仅接收图像并负责输出相应的密集字幕。

**State Transition Captioning** While dense captioning provides a comprehensive description of a GUI
interface, it does not capture state transitions, particularly the subtle effects of actions (e.g., a tiny button being
pressed) on the interface. To address this limitation, we train the model to identify and describe the differences
between two consecutive screenshots and determine whether an action, such as a mouse click or keyboard
input, has occurred. We also incorporate screenshot pairs that correspond to non-interactive UI changes (e.g.,
animations, screen refreshes, or background updates). During training, UI-TARS is presented with a pair of
images and tasked with predicting the specific visual changes (and possible reasons) of the two images. In
this way, UI-TARS learns the subtle UI changes, including both user-initiated actions and non-interactive
transitions. This capability is crucial for tasks requiring fine-grained interaction understanding and dynamic
state perception.

**状态转换描述** 虽然密集描述提供了GUI界面的全面描述，但它并未捕捉状态转换，特别是动作对界面的细微影响（例如，一个小按钮被按下）。为了解决这一限制，我们训练模型识别和描述两张连续截图之间的差异，并确定是否发生了诸如鼠标点击或键盘输入等动作。我们还加入了对应非交互式UI变化（例如动画、屏幕刷新或后台更新）的截图对。`在训练过程中，UI-TARS会被展示一对图像，并负责预测这两张图像的具体视觉变化（以及可能的原因）。`通过这种方式，UI-TARS学习到细微的UI变化，包括用户发起的动作和非交互式转换。这种能力对于需要细粒度交互理解和动态状态感知的任务至关重要。

**Question Answering (QA)** While dense captioning and element descriptions primarily focus on understanding the layout and elements of a GUI, QA offers a more dynamic and flexible approach to integrating these
tasks with reasoning capabilities. We synthesize a diverse set of QA data that spans a broad range of tasks,
including interface comprehension, image interpretation, element identification, and relational reasoning. This
enhances UI-TARS’s capacity to process queries that involve a higher degree of abstraction or reasoning.

**问答（QA）** 虽然密集字幕和元素描述主要关注理解GUI的布局和元素，但QA提供了一种更动态、更灵活的方法，将这些任务与推理能力整合在一起。我们综合了一个广泛的QA数据集，涵盖了广泛的任务，包括界面理解、图像解释、元素识别和关系推理。这增强了UI-TARS处理涉及更高抽象度或推理的查询的能力。

**Set-of-Mark (SoM)** We also enhance the Set-of-Mark (SoM) prompting ability (Yang et al., 2023b) of
UI-TARS. We draw visually distinct markers for parsed elements on the GUI screenshot based on their spatial
coordinates. These markers vary in attributes such as form, color, and size, providing clear, intuitive visual
cues for the model to locate and identify specific elements. In this way, UI-TARS better associates visual
markers with their corresponding elements. We integrate SoM annotations with tasks like dense captioning
and QA. For example, the model might be trained to describe an element highlighted by a marker.

**标记集（SoM）** 我们还增强了UI-TARS的Set-of-Mark（SoM）提示能力（Yang等，2023b）。我们根据元素的空间坐标在GUI截图上为解析的元素绘制视觉上明显的标记。这些标记在形式、颜色和大小等属性上有所不同，为模型提供清晰、直观的视觉线索，以定位和识别特定元素。通过这种方式，UI-TARS更好地将视觉标记与相应的元素关联起来。我们将SoM注释与密集字幕和QA等任务集成。例如，模型可能被训练来描述由标记突出显示的元素。

### 4.3 Unified Action Modeling and Grounding（统一行动建模和基础）

The de-facto approach for improving action capabilities involves training the model to mimic human behaviors
in task execution, i.e., behavior cloning (Bain & Sammut, 1995). While individual actions are discrete and
isolated, real-world agent tasks inherently involve executing a sequence of actions, making it essential to
train the model on multi-step trajectories. This approach allows the model to learn not only how to perform
individual actions but also how to sequence them effectively (system-1 thinking).

改进行动能力的事实方法涉及训练模型模仿任务执行中的人类行为，即行为克隆（Bain＆Sammut，1995）。虽然单个行动是离散的和孤立的，但现实世界的代理任务本质上涉及执行一系列行动，因此训`练模型进行多步轨迹（multi-step trajectories）是至关重要`的。这种方法使模型不仅学会如何执行单个行动，还学会如何有效地对它们进行排序（系统1思维）。

**Unified Action Space** Similar to previous works, we design a common action space that standardizes
semantically equivalent actions across devices (Table 1), such as “click” on Windows versus “tap” on mobile,
enabling knowledge transfer across platforms. Due to device-specific differences, we also introduce optional
actions tailored to each platform. This ensures the model can handle the unique requirements of each
device while maintaining consistency across scenarios. We also define two terminal actions: Finished(),
indicating task completion, and CallUser(), invoked in cases requiring user intervention, such as login or
authentication.

**统一动作空间** 类似于之前的工作，我们设计了一个通用的动作空间，标准化了跨设备的语义等效动作（见表1），例如Windows上的“点击”与移动设备上的“轻触”，从而实现跨平台的知识转移。由于设备特定的差异，我们还引入了针对每个平台的可选动作。这确保了模型在处理每个设备的独特需求时，能够在不同场景中保持一致性。我们还定义了两个终端动作：**Finished()**，表示任务完成，以及**CallUser()**，在需要用户干预的情况下调用，例如登录或身份验证。

![](/images/2025/UI-TARS/Table1.png)

- 表1：不同平台的统一动作空间。
- 表2：基础统计数据，比较我们的注释数据集和开源数据在不同平台（Web、移动和桌面）上的基础统计数据。我们报告元素数（Ele.）和行动轨迹数（Trace）。

**Action Trace Collection** A significant challenge in training models for task execution lies in the limited
availability of multi-step trajectory data, which has historically been under-recorded and sparse. To address this
issue, we rely on two primary data sources: (1) **our annotated dataset**: we develop a specialized annotation
tool to capture user actions across various software and websites within PC environments. The annotation
process begins with the creation of initial task instructions, which are reviewed and refined by annotators to
ensure clarity and alignment with the intended goals. Annotators then execute the tasks, ensuring that their
actions fulfill the specified requirements. Each task undergoes rigorous quality filtering; and (2) **open-source data**: we also integrate multiple existing datasets (MM-Mind2Web (Zheng et al., 2024b), GUIAct (Chen
et al., 2024c), AITW (Rawles et al., 2023), AITZ (Zhang et al., 2024d), AndroidControl (Li et al., 2024c),
GUI-Odyssey (Lu et al., 2024a), AMEX (Chai et al., 2024)) and standardize them into a unified action space
format. This involves reconciling varying action representations into a consistent template, allowing for
seamless integration with the annotated data. In Table 2, we list the basic statistics of our action trace data.

**行动轨迹收集** 在训练任务执行模型时的一个重要挑战在于多步轨迹数据的有限可用性，这些数据在历史上一直被记录不足和稀疏。为了解决这个问题，我们依赖于两个主要数据源：（1）**我们的标注数据集**：我们开发了一个专门的标注工具，用于在PC环境中捕获用户在各种软件和网站上的操作。标注过程始于创建初始任务指令，这些指令由标注者审查和完善，以确保清晰度和与预期目标的一致性。然后，标注者执行任务，确保他们的行动符合指定的要求。每个任务都经过严格的质量过滤；（2）**开源数据**：我们还整合了多个现有数据集（MM-Mind2Web（Zheng等，2024b）、GUIAct（Chen等，2024c）、AITW（Rawles等，2023）、AITZ（Zhang等，2024d）、AndroidControl（Li等，2024c）、GUI-Odyssey（Lu等，2024a）、AMEX（Chai等，2024））并将它们标准化为统一的动作空间格式。这涉及将不同的行动表示调和为一致的模板，从而实现与标注数据的无缝集成。在表2中，我们列出了我们的行动轨迹数据的基本统计数据。

**Improving Grounding Ability** Grounding, the ability to accurately locate and interact with specific GUI
elements, is critical for actions like clicking or dragging. Unlike multi-step action data, grounding data is
easier to scale because it primarily relies on the visual and position properties of elements, which can be
efficiently synthesized or extracted (Hong et al., 2024; Gou et al., 2024a; Wu et al., 2024b). We train UI-TARS
to directly predict the coordinates of the elements it needs to interact with. This involves associating each
element in a GUI with its spatial coordinates and metadata.

**提高 Grounding 能力** Grounding，即准确定位和与特定GUI元素交互的能力，对于点击或拖动等行动至关重要。与多步行动数据不同，grounding 数据更容易扩展，因为它主要依赖于元素的视觉和位置属性，这些属性可以有效地合成或提取（Hong等，2024；Gou等，2024a；Wu等，2024b）。`我们训练UI-TARS直接预测它需要与之交互的元素的坐标`。这涉及将GUI中的每个元素与其空间坐标和元数据关联起来。

As described in § 4.2, we collected screenshots and extracted metadata, including element type, depth,
bounding boxes, and text content, using specialized parsing tools. For elements recorded with bounding boxes,
we calculated the average of the corners to derive a single point coordinate, representing the center of the
bounding box. To construct training samples, each screenshot is paired with individual element descriptions
derived from metadata. The model is tasked with outputting relative coordinates normalized to the dimensions
of the screen, ensuring consistency across devices with varying resolutions. For example, given the description
“red button in the top-right corner labeled Submit”, the model predicts the normalized coordinates of that
button. This direct mapping between descriptions and coordinates enhances the model’s ability to understand
and ground visual elements accurately.

如§ 4.2所述，我们使用专门的解析工具收集了截图并提取了元数据，包括元素类型、深度、边界框和文本内容。对于记录有边界框的元素，我们计算了角的平均值，得出一个单一点坐标，表示边界框的中心。为了构建训练样本，每个截图都与从元数据中导出的单个元素描述配对。`模型的任务是输出相对于屏幕尺寸归一化的相对坐标，确保在分辨率不同的设备上保持一致性。`例如，给定描述“标记为提交的右上角的红色按钮”，模型预测该按钮的归一化坐标。描述和坐标之间的直接映射增强了模型准确理解和基础视觉元素的能力。

To further augment our dataset, we integrated open-source data (Seeclick (Cheng et al., 2024), GUIAct (Chen
et al., 2024c), MultiUI (Liu et al., 2024b), Rico-SCA (Li et al., 2020a), WidgetCaption (Li et al., 2020b),
MUG (Li et al., 2024b), Rico Icon (Sunkara et al., 2022), CLAY (Li et al., 2022), UIBERT (Bai et al.,
2021), OmniACT (Kapoor et al., 2024), AutoGUI (Anonymous, 2024), OS-ATLAS (Wu et al., 2024b)) and
standardized them into our unified action space format. We provide the basic statiscs of the grounding data for
training in Table 2. This combined dataset enables UI-TARS to achieve high-precision grounding, significantly
improving its effectiveness in actions such as clicking and dragging.

为了进一步增强我们的数据集，我们整合了开源数据（Seeclick（Cheng等，2024）、GUIAct（Chen等，2024c）、MultiUI（Liu等，2024b）、Rico-SCA（Li等，2020a）、WidgetCaption（Li等，2020b）、MUG（Li等，2024b）、Rico Icon（Sunkara等，2022）、CLAY（Li等，2022）、UIBERT（Bai等，2021）、OmniACT（Kapoor等，2024）、AutoGUI（匿名，2024）、OS-ATLAS（Wu等，2024b））并将它们标准化为我们的统一动作空间格式。我们在表2中提供了用于训练的基础统计数据。这个组合数据集使UI-TARS能够实现高精度的基础，显著提高了其在点击和拖动等行动中的有效性。

### 4.4 Infusing System-2 Reasoning（注入系统2推理）

Relying solely on system-1 intuitive decision-making is insufficient to handle complex scenarios and everchanging environments. Therefore, we aim for UI-TARS to combine system-2 level reasoning, flexibly
planning action steps by understanding the global structure of tasks.

仅依赖系统1的直觉决策是不足以处理复杂情况和不断变化的环境的。因此，我们希望UI-TARS结合系统2级别的推理，通过理解任务的全局结构，灵活地规划行动步骤。

**Reasoning Enrichment with GUI Tutorials** The first step focuses on reasoning enrichment, where we
leverage publicly available tutorials that interweave text and images to demonstrate detailed user interactions
across diverse software and web environments. These tutorials provide an ideal source for establishing
foundational GUI knowledge while introducing logical reasoning patterns inherent to task execution.

**使用GUI教程丰富推理** 第一步集中于推理丰富化，我们利用公开可用的教程，这些教程交织了文本和图像，展示了跨多种软件和网络环境的详细用户交互。这些教程为建立基础GUI知识提供了理想的来源，同时引入了任务执行中固有的逻辑推理模式。

We selected MINT (Awadalla et al., 2024) and OmniCorpus (Li et al., 2024a), two widely recognized imagetext interleaved pre-training datasets, as our initial data sources. However, these datasets contain substantial
noise, with only a small fraction aligning with GUI tutorial criteria. To extract high-quality tutorial data, we
implemented a multi-stage data collection and filtering pipeline: (1) **Coarse-Grained Filtering**: to isolate
tutorial-like content, we trained a fastText classifier (Joulin et al., 2016) using a manually curated positive set
of high-quality tutorials and random samples from MINT and OmniCorpus as the negative set. The trained
classifier was then applied to perform an initial screening, filtering out irrelevant samples and generating a
candidate dataset. (2) **Fine-Grained Filtering**: to further refine the candidate dataset, we employed an LLM to
identify and remove false positives. This step ensured the remaining samples conformed to the characteristics
of GUI tutorials. The coarse and fine filtering processes were iterated over multiple rounds to maximize the
recall rate of high-quality GUI tutorials. (3) **Deduplication and Data Refinement**: the filtered dataset was
further refined to address duplicates, advertisements, and residual noise. Deduplication was performed using
URL-based and Locality-Sensitive Hashing (LSH) methods. Finally, we prompt an LLM to rephrase all the
textual content in the tutorial, refining the content while eliminating irrelevant or low-quality ones.

我们选择了MINT（Awadalla等，2024）和OmniCorpus（Li等，2024a）这两个广泛认可的图像-文本交织的预训练数据集作为我们的初始数据源。然而，这些数据集包含大量噪音，只有很小一部分符合GUI教程标准。为了提取高质量的教程数据，我们实施了一个多阶段的数据收集和过滤管道：（1）**粗粒度过滤**：为了孤立类似教程的内容，我们使用手动策划的高质量教程正样本和MINT和OmniCorpus的随机样本作为负样本，训练了一个**fastText**分类器（Joulin等，2016）。然后，训练好的分类器被应用于执行初始筛选，过滤掉不相关的样本，并生成候选数据集。 （2）**细粒度过滤**：为了进一步细化候选数据集，我们使用LLM识别和删除假阳性。这一步确保剩余的样本符合GUI教程的特征。粗粒度和细粒度过滤过程在多轮迭代中进行，以最大化高质量GUI教程的召回率。 （3）**去重和数据细化**：进一步细化过滤后的数据集，以解决重复、广告和残余噪音。使用基于URL和局部敏感哈希（LSH）方法进行去重。最后，我们提示LLM重新表述教程中的所有文本内容，细化内容，同时消除不相关或低质量的内容。

Through this multi-stage process, we curated approximately 6M high-quality GUI tutorials. On average, each
tutorial contains 510 text tokens and 3.3 images. This data not only enhances the model’s understanding of
GUI operations but also lays a robust foundation for infusing reasoning capabilities.

通过这个多阶段过程，我们策划了大约**600万**个高质量的GUI教程。平均每个教程包含510个文本标记和3.3个图像。这些数据不仅增强了模型对GUI操作的理解，还为注入推理能力奠定了坚实的基础。

**Reasoning Stimulation with Thought Augmentation** The action trace data we collect in § 4.3 is inherently action-focused, containing sequences of observations and actions (oi−1, ai−1, oi
, ai
, . . .) but lacking
explicit reasoning thoughts. To stimulate reasoning capabilities of UI-TARS, we augment the dataset by
annotating “thoughts” to bridge the gap between perception and action. This transforms the data format to
(oi−1, ti−1, ai−1, oi
, ti
, ai
, . . .), where t represents the reasoning thought. These thoughts enable the model to
express its decision-making process explicitly, fostering better alignment with task objectives. To construct
these thoughts, we employ two annotation stages:

**通过思考增强推理** 我们在§ 4.3中收集的行动轨迹数据本质上是以行动为中心的，包含一系列观察和行动（oi−1, ai−1, oi, ai, ...），但缺乏明确的推理思考。为了激发UI-TARS的推理能力，我们通过注释“思考”来填补感知和行动之间的差距。这将数据格式转换为（oi−1, ti−1, ai−1, oi, ti, ai, ...），其中t表示推理思考。这些思考使模型能够明确表达其决策过程，促进与任务目标的更好对齐。为了构建这些思考，我们采用两个注释阶段：

(1) **ActRe** (Yang et al., 2024b): as shown in (4), for each trace collected in § 4.3, we split them into multiple
steps. For each step n, its thought tn is generated iteratively by prompting a VLM with the previous context
and the current target action an. This method tries to make the generated thought logically grounded in the
preceding context and aligned with the current action.

(1) **ActRe**（Yang等，2024b）：如（4）所示，对于§ 4.3中收集的每个轨迹，我们将其分成多个步骤。对于每一步n，它的思考tn通过使用先前的上下文和当前的目标行动an提示VLM来迭代生成。这种方法试图使生成的思考在先前的上下文中逻辑上基础，并与当前行动保持一致。

![](/images/2025/UI-TARS/Formula4.png)

During ActRe annotation, we prompt the VLM toward exhibiting higher-order, system-2 reasoning, which
involves deliberate, step-by-step decision-making and reflection. By promoting these reasoning patterns, we
encourage the model to engage in thoughtful, long-term planning and reflection to solve complex tasks. As
shown in Figure 6, the reasoning patterns we prompt the VLM to follow include:

在ActRe注释期间，我们提示VLM展示更高阶的系统2推理，这涉及有意识的、逐步的决策和反思。通过促进这些推理模式，我们鼓励模型参与深思熟虑的、长期的规划和反思，以解决复杂任务。如图6所示，我们提示VLM遵循的推理模式包括：

- **Task Decomposition**: guide the model to break complex tasks into smaller, manageable subtasks, enabling it to address intricate workflows step-by-step.

- **任务分解**：引导模型将复杂任务分解为较小、可管理的子任务，使其能够逐步解决复杂的工作流程。

- **Long-term Consistency**: ensure the model maintains a consistent goal throughout a task, referencing the overall objective and operation history to avoid deviations during complex, multi-step tasks.

- **长期一致性**：确保模型在整个任务中保持一致的目标，参考整体目标和操作历史，避免在复杂的多步任务中偏离。

- **Milestone Recognition**: enable the model to recognize the completion of intermediate objectives, facilitating smooth transitions to subsequent goals.

- **里程碑识别**：使模型能够识别中间目标的完成，促进顺利过渡到后续目标。

- **Trial and Error**: equip the model to hypothesize, test, and evaluate potential actions, especially in ambiguous situations like verifying search results without directly interacting.

- **试错**：使模型能够假设、测试和评估潜在的行动，特别是在模糊的情况下，例如在没有直接交互的情况下验证搜索结果。

- **Reflection**: enable the model to identify and correct errors when operations fail, encouraging adaptability and error recovery through reflective reasoning.

- **反思**：使模型能够在操作失败时识别和纠正错误，通过反思推理鼓励适应性和错误恢复。

![](/images/2025/UI-TARS/Figure6.png)

图6：我们增强思考中的各种推理模式。

- Task Decomposition（任务分解）
    - Set the line spacing to double spacing and remove all background colors from the document.
    - 将行距设置为双倍行距，并从文档中删除所有背景颜色。
        - Thought: I have selected all the text, and now I need to set the line spacing to double.
        - 思考：我已经选择了所有文本，现在需要将行距设置为双倍。
        - To do this, I need to right-click and select "Paragraph". In the dialog box that appears, find the "Line spacing" option and select "Double" from the dropdown menu.
        - 为此，我需要右键单击并选择“段落”。在弹出的对话框中，找到“行距”选项，并从下拉菜单中选择“双倍”。
- Long Term Consistency（长期一致性）
    - Add the homepages of Google, YouTube, Facebook, Apple, Wikipedia, Netflix, and Instagram to your bookmarks bar.
    - 将Google、YouTube、Facebook、Apple、Wikipedia、Netflix和Instagram的主页添加到您的书签栏。
        - Thought: I see the bookmark popup window, I need to click the "Done" button.
        - 思考：我看到了书签弹出窗口，我需要点击“完成”按钮。
        - Thought: I've already added Google, YouTube, Facebook, and Apple. I see a photo of someone waving on the screen, but this is irrelevant to my task. Now I need to continue adding Wikipedia's homepage...
        - 思考：我已经添加了Google、YouTube、Facebook和Apple。我在屏幕上看到了一个人挥手的照片，但这与我的任务无关。现在我需要继续添加维基百科的主页...
- MileStone Recognition（里程碑识别）
    - Set the desktop wallpaper to the second image from system's automatic wallpapers, and adjust the resolution to "16:9".
    - 将桌面壁纸设置为系统自动壁纸的第二张图片，并将分辨率调整为“16:9”。
        - Thought: I have opened the background settings interface, and now I need to select the second system wallpaper.
        - 思考：我已经打开了背景设置界面，现在需要选择第二张系统壁纸。
        - Thought: I have switched to the second automatic image as the wallpaper, and from the background, I can see that the wallpaper has been changed to the second image.
        - 思考：我已经将壁纸切换到第二张自动图片，从背景中可以看到壁纸已经更改为第二张图片。
        - Therefore, next I need to continue adjusting the screen resolution to 16:9.
        - 因此，接下来我需要继续调整屏幕分辨率为16:9。
- Trial and Error（试错）
    - Please help me change Chrome's language settings to Japanese.
    - 请帮我将Chrome的语言设置更改为日语。
        - Thought: I have found the language settings, but I need to click the "Add" button to confirm adding Japanese as a Chrome language.
        - 思考：我找到了语言设置，但我需要点击“添加”按钮来确认将日语添加为Chrome语言。
        - *Chrome is still in English*
        - *Chrome仍然是英文的*
        - Thought: It seems Chrome is still in English and my changes haven't taken effect. However, I notice that "Japanese" has appeared in Chrome's language options, which might mean I need to take additional steps. I will click the three-dot icon on the right and follow the prompt to determine what to do next.
        - 思考：Chrome仍然是英文的，我的更改没有生效。但是，我注意到“日语”已经出现在Chrome的语言选项中，这可能意味着我需要采取额外的步骤。我将点击右侧的三点图标，并按照提示确定下一步该做什么。
- Reflection（反思）
    - Convert the first document into PDF format in the same dir.
    - 将同一目录中的第一个文档转换为PDF格式。
        - Thought: I need to open the first document, and now I need to select how to open the file. Since it's in HTML format, I want to open it using
        - 思考：我需要打开第一个文档，现在我需要选择如何打开文件。由于它是HTML格式，我想用
        - *The incorrect grounding caused a click on the LibreOffice Draw icon.*
        - *错误的 grounding 导致点击了LibreOffice Draw图标。*
        - Thought: I mistakenly clicked on the LibreOffice Draw icon in the previous step, I need to adjust the clicking position upward to ensure I click on the correct location.
        - 思考：我在上一步中错误地点击了LibreOffice Draw图标，我需要将点击位置向上调整，以确保我点击正确的位置。

Convert the first documents into PDF format in the same dir.
Thought: I need to open the first document, and now I need to select how to open the file. Since it's in HTML format, I want to open it using
Thought: I mistakenly clicked on the LibreOffice Draw icon in the previous step, I need to adjust the clicking position upward to ensure I click on the correct location.

(2) **Thought Bootstrapping**: reverse annotation of thoughts conditioned on ground-truth actions (i.e., ActRe)
can lead to false positives because the generated thoughts may appear to match the corresponding actions at a
superficial level, without establishing a true causal relationship. Specifically, the reasoning process underlying
the action may be overlooked, causing the thought to align with the action only by coincidence rather than
through logical reasoning. This issue arises because the annotation process relies on knowing the action in
advance, which may bias the thought to conform to the action rather than reflect the actual decision-making
process leading to it.

(2) **思考引导**：在基于真实行动（即ActRe）的思考的反向注释可能会导致假阳性，因为生成的思考可能只在表面上与相应的行动匹配，而没有建立真正的因果关系。具体来说，行动背后的推理过程可能被忽视，导致思考与行动仅仅是巧合而不是通过逻辑推理。这个问题的根源在于注释过程依赖于事先知道的行动，这可能会使思考偏向于符合行动，而不是反映导致行动的实际决策过程。

To address this, we adopt a bootstrapping approach that generates thoughts without prior knowledge of the
ground-truth action. By sampling multiple thought-action pairs, as shown in (5), we identify the thought that
leads to the correct action, ensuring that the reasoning aligns causally with the chosen action. This approach
produces higher-quality annotations because it forces the model to simulate a genuine decision-making process
rather than merely justifying a pre-determined action (UI-TARSearly means an early-stage model checkpoint).

为了解决这个问题，我们采用一种引导方法，生成没有事先知道真实行动的思考。通过采样多个思考-行动对，如（5）所示，我们确定导致正确行动的思考，确保推理与选择的行动因果关系一致。这种方法产生了更高质量的注释，因为它迫使模型模拟一个真正的决策过程，而不仅仅是证明一个预先确定的行动（UI-TARSearly表示一个早期阶段的模型检查点）。

![](/images/2025/UI-TARS/Formula5.png)

We annotate thoughts in both Chinese and English, expanding linguistic diversity. Although we augment
thoughts for all traces, we also involve the vanilla action traces (without thought) during training.

我们用中文和英文注释思考，扩大语言多样性。虽然我们为所有轨迹增加了思考，但在训练过程中也涉及原始行动轨迹（没有思考）。

![](/images/2025/UI-TARS/Figure7.png)

图7：在线引导过程概述。

### 4.5 Learning from Prior Experience in Long-term Memory（从长期记忆中学习先前经验）

GUI agents face significant challenges in scaling to the level of LLMs, primarily due to the scarcity of
large-scale, standardized, real-world process data for GUI operations. While LLMs can leverage abundant
textual data that captures diverse knowledge and reasoning patterns, process data detailing user interactions
and decision-making sequences within GUI environments is rarely recorded or systematically organized. This
lack of data impedes the ability of GUI agents to scale effectively and generalize across a wide range of tasks.
One promising solution lies in learning from prior experiences stored in long-term memory. By capturing and
retaining knowledge from previous tasks, agents can leverage these past experiences to inform their future
decisions, making their actions more adaptive and efficient.

GUI代理面临着在规模上扩展到LLM水平的重大挑战，主要是由于GUI操作的大规模、标准化、真实世界过程数据的稀缺性。虽然LLM可以利用丰富的文本数据，捕捉多样化的知识和推理模式，但GUI环境中详细描述用户交互和决策序列的过程数据很少被记录或系统地组织。这种数据的缺乏阻碍了GUI代理有效扩展和在广泛任务范围内泛化的能力。一个有前途的解决方案在于从长期记忆中学习先前的经验。通过捕获和保留以前任务的知识，代理可以利用这些过去的经验来指导其未来的决策，使其行动更具适应性和效率。

To facilitate this process, we enable UI-TARS to dynamically learn from interactions with real-world devices.
Through semi-automated data collection, filtering, and refinement, the model continuously improves while
minimizing the need for manual intervention. By leveraging long-term memory, UI-TARS builds on its
accumulated knowledge, refining its performance over time and adapting to new tasks more efficiently. Each
iteration of this process results in a more capable model.

为了促进这一过程，我们使UI-TARS能够动态地从与真实设备的交互中学习。通过半自动化的数据收集、过滤和细化，模型不断改进，同时最大限度地减少了手动干预的需求。通过利用长期记忆，UI-TARS建立在其积累的知识基础上，随着时间的推移不断完善其性能，并更有效地适应新任务。这一过程的每次迭代都会产生一个更有能力的模型。

**Online Trace Bootstrapping** As shown in Figure 7, we begin by obtaining a diverse set of task goals,
combining both human-annotated and model-generated instructions. At iteration n, the agent Mn executes
these instructions In within the target GUI environments (e.g., a virtual PC), producing a raw set of traces:

Traw,n = {(o1, t1, a1, o2, t2, a2, . . . , on, tn, an), · · · } .

To ensure high-quality data, we apply a multi-level filtering function:

Filter (Traw,n, In) = Tfiltered,n,

在线跟踪引导 如图7所示，我们首先获得一组多样化的任务目标，结合人工注释和模型生成的指令。在第n次迭代中，代理Mn在目标GUI环境（例如虚拟PC）中执行这些指令In，生成一组原始轨迹：

Traw,n = {(o1, t1, a1, o2, t2, a2, . . . , on, tn, an), · · · } 。

为了确保高质量的数据，我们应用一个多级过滤函数：

Filter (Traw,n, In) = Tfiltered,n，

which discards noisy or invalid traces through the following steps: (1) Rule-Based Reward: heuristic rules
remove traces with obvious anomalies (e.g., redundant actions that do not alter the environment); (2) VLM
Scoring: VLMs assign quality scores to the remaining traces, with traces scoring below a predefined threshold
being removed; (3) Human Review: part of the traces are further inspected by annotators, who identify the
step where an error occurs, discard any subsequent actions, and retain only the valid prefix. UI-TARS leverages
the resulting filtered trace set Tfiltered,n for self-improvement:

Mn+1 = FineTune (Mn, Tfiltered,n).

For each round, we employ annotators to refine or expand the instruction set:

In+1 = HumanRefine (In, Tfiltered,n).

通过以下步骤丢弃嘈杂或无效的轨迹：（1）基于规则的奖励：启发式规则删除具有明显异常的轨迹（例如，不改变环境的冗余行动）；（2）VLM评分：VLM为剩余的轨迹分配质量分数，得分低于预定义阈值的轨迹将被删除；（3）人工审查：部分轨迹由注释者进一步检查，他们确定发生错误的步骤，丢弃任何后续行动，仅保留有效的前缀。UI-TARS利用生成的过滤轨迹集Tfiltered,n进行自我改进：

Mn+1 = FineTune (Mn, Tfiltered,n)。

对于每一轮，我们雇用注释者来完善或扩展指令集：

In+1 = HumanRefine (In, Tfiltered,n)。

We iterate the above process on hundreds of virtual PCs for multiple rounds, continuously leveraging the latest
model Mn+1 to generate new traces, thus expanding and refining the data.

我们在数百台虚拟PC上进行多轮上述过程的迭代，不断利用最新的模型Mn+1生成新的轨迹，从而扩展和完善数据。

**Reflection Tuning** In realistic online deployments, agents often encounter situations where they get stuck
due to a lack of self-reflection and error correction capabilities. For example, an agent might repeatedly click
on an unresponsive button or attempt invalid operations due to misinterpretation of the interface. Without
the ability to recognize these errors or adjust its strategy, the agent remains in a loop of ineffective actions,
unable to progress toward the task objective. However, most offline datasets contain idealized, error-free
trajectories because annotators ensure that each action meets expectations during the data labeling process.
While such data helps reduce noise during model training, it also prevents the agent from learning how to
recover from errors. To address this limitation, we propose a reflection tuning protocol that exposes the model
to real-world errors made by itself with their corrections, enabling UI-TARS to learn how to recover from
suboptimal decisions.

**反思调整** 在现实的在线部署中，代理经常会遇到由于缺乏自我反思和错误纠正能力而陷入困境的情况。例如，由于对界面的误解，代理可能会反复点击无响应的按钮或尝试无效操作。如果没有能力识别这些错误或调整其策略，代理将保持无效行动的循环中，无法朝着任务目标前进。然而，大多数离线数据集包含理想化的、无错误的轨迹，因为注释者在数据标记过程中确保每个行动符合预期。虽然这样的数据有助于减少模型训练过程中的噪音，但它也阻止了代理学习如何从错误中恢复。为了解决这个限制，我们提出了一种反思调整协议，使模型暴露于自身的真实世界错误及其纠正，使UI-TARS学会如何从次优决策中恢复。

For an online trace generated by UI-TARS: T = (instruction,(o1, t1, a1),(o2, t2, a2), . . . ,(ot, tt, at)), suppose that an error occurs at step τ , where the action aτ is deemed invalid or suboptimal. We asked annotators
to identify this error and label the corrected thought and action t
∗
τ
, a∗
τ
. This results in an **error correction**
trace pair:

对于UI-TARS生成的在线轨迹：T = (指令，(o1, t1, a1)，(o2, t2, a2)，...，(ot, tt, at))，假设在第τ步发生错误，其中行动aτ被认为是无效的或次优的。我们要求注释者识别这个错误，并标记纠正的思考和行动t∗τ，a∗τ。这导致了一个**错误纠正**轨迹对：

![](/images/2025/UI-TARS/Formula6.png)

Innovatively, we further require annotators to continue labeling the subsequent step based on the incorrect
action aτ , simulating a scenario where the error has already occurred. When determining the thought for the
next step t
∗
τ+1, annotators must acknowledge the impact of the previous mistake, compensate for its effects,
and provide a correct action a
∗
τ+1 to realign the task progress. For example, if the previous step intended to
add a webpage to bookmarks but mistakenly clicked the close button, the next step should involve reopening
the recently closed webpage to re-attempt clicking the bookmark button. Formally, we have a **post-reflection**
trace pair:

创新地，我们进一步要求注释者继续基于不正确的行动aτ标记后续步骤，模拟错误已经发生的情况。在确定下一步思考t∗τ+1时，注释者必须承认先前错误的影响，补偿其影响，并提供一个正确的行动a∗τ+1来重新调整任务进度。例如，如果上一步意图将一个网页添加到书签，但错误地点击了关闭按钮，下一步应该涉及重新打开最近关闭的网页，以重新尝试点击书签按钮。形式上，我们有一个**后反思**轨迹对：

![](/images/2025/UI-TARS/Formula7.png)

(7)
We utilize the positive samples T+ for SFT training and calculate the loss only for the corrected steps (i.e.,
(t
∗
τ
, a∗
τ
) and (t
∗
τ+1, a∗
τ+1)), while the error steps (i.e., (tτ , aτ )) are not considered for training. Through this
process, UI-TARS gradually improves its ability to recognize and recover from errors, enabling it to make
effective adjustments when faced with imperfect or uncertain conditions. Cultivating this reflective ability
enhances the agent’s adaptability to dynamic environments and tasks.

我们利用正样本T+进行SFT训练，并仅对纠正步骤（即，(t∗τ，a∗τ)和(t∗τ+1，a∗τ+1)）计算损失，而错误步骤（即，(tτ，aτ)）不考虑训练。通过这个过程，UI-TARS逐渐提高了识别和从错误中恢复的能力，使其在面对不完美或不确定条件时能够做出有效的调整。培养这种反思能力增强了代理对动态环境和任务的适应性。

**Agent DPO** During online bootstrapping, a large number of erroneous steps (negative examples) are naturally
generated. However, SFT only utilizes the corrected steps (i.e., “positive” examples), while ignoring the
negative samples, which limits its ability to explicitly guide the agent away from suboptimal actions. To address
this limitation, we turn to Direct Preference Optimization (DPO) (Rafailov et al., 2023), which leverages both
the corrected and erroneous actions by introducing a reference-based objective. This approach optimizes
UI-TARS by directly encoding a preference for corrected actions over erroneous ones, thereby making better
use of the available data.

**代理DPO** 在在线引导过程中，会自然产生大量错误步骤（负例）。然而，SFT只利用纠正的步骤（即“正例”），而忽略负例，这限制了它明确引导代理远离次优行动的能力。为了解决这个限制，我们转向直接偏好优化（DPO）（Rafailov等，2023），通过引入基于参考的目标，利用纠正和错误行动。这种方法通过直接编码对纠正行动优于错误行动的偏好来优化UI-TARS，从而更好地利用可用数据。

Consider a state sτ where the agent initially performed an incorrect action aτ , which was later corrected to a
preferred action a
′
τ
. Here, the state sτ consists of the instruction and its interaction history up to the current
step (o1, t1, a1, . . . , oτ−1, tτ−1, aτ−1). This comprehensive representation provides the necessary context for
the agent to make informed decisions. The key idea is to define a preference likelihood that quantifies how
much the model favors the corrected action a
′
τ over the original action aτ . Formally, we define a learned
reward function rθ(s, a) that estimates the desirability of taking action a in state s. Based on Bradley-Terry
model (Bradley & Terry, 1952), we can express the pairwise preference likelihood as:

考虑一个状态sτ，代理最初执行了一个不正确的行动aτ，后来纠正为一个首选行动a′τ。这里，状态sτ包括指令及其到当前步骤的交互历史（o1, t1, a1, ...，oτ−1, tτ−1, aτ−1）。这种全面的表示为代理做出明智决策提供了必要的上下文。关键思想是定义一个偏好概率，量化模型在纠正行动a′τ和原始行动aτ之间的偏好程度。形式上，我们定义一个学习奖励函数rθ(s, a)，估计在状态s中采取行动a的可取性。基于Bradley-Terry模型（Bradley＆Terry，1952），我们可以将成对偏好概率表示为：

![](/images/2025/UI-TARS/Formula8.png)

where a
′
τ ≻ aτ indicates that a
′
τ
is preferred over aτ . The numerator represents the exponential of the reward
assigned to the corrected action, while the denominator sums the exponentials of the rewards for both actions,
ensuring that the likelihood is properly normalized. 

其中a′τ ≻ aτ表示a′τ优于aτ。分子表示分配给纠正行动的奖励的指数，而分母对两个行动的奖励的指数求和，确保概率被正确归一化。

DPO derives the analytical optimal policy given the reward function from the reinforcement learning (RL)
objective with a KL-divergence constraint. We follow DPO to replace the reward function rθ with the optimal
policy and directly optimize the DPO objective on the preference dataset:

DPO从强化学习（RL）目标中的奖励函数推导出分析最优策略，并带有KL散度约束。我们遵循DPO，用最优策略替换奖励函数rθ，并直接在偏好数据集上优化DPO目标：

![](/images/2025/UI-TARS/Formula9.png)

where τ goes over all timesteps for which error-correction pairs are available. πθ denotes the optimal agent,
πSFT denotes the SFT agent and β as a hyper-parameter controls the divergence between the optimal agent
and the SFT agent. By minimizing the DPO loss, we fit the agent to increase the likelihood of the corrected
actions and decrease the likelihood of the erroneous actions with an implicit reward function.

其中τ遍历所有可用的错误纠正对的时间步。πθ表示最优代理，πSFT表示SFT代理，β作为一个超参数控制最优代理和SFT代理之间的差异。通过最小化DPO损失，我们使代理适应，增加纠正行动的概率，减少错误行动的概率，隐含奖励函数。

### 4.6 Training（训练）

To ensure a fair comparison with existing works such as Aguvis (Xu et al., 2024) and OS-Atlas (Wu et al.,
2024b), we use the same VLM backbone, Qwen-2-VL (Wang et al., 2024c), and adopt a three-phase training
process. This process refines the model’s capabilities across diverse GUI tasks, utilizing a total data size of
approximately **50B** tokens. Each phase progressively incorporates higher-quality data to enhance the model’s
performance on complex reasoning tasks.

为了确保与现有作品（如Aguvis（Xu等，2024）和OS-Atlas（Wu等，2024b））的公平比较，我们使用相同的VLM骨干，Qwen-2-VL（Wang等，2024c），并采用三阶段训练过程。这个过程通过使用大约**50B**标记的总数据量，逐步引入更高质量的数据，以增强模型在复杂推理任务上的性能。

- **Continual Pre-training Phase**: we utilize the full set of data described in § 4, excluding the reflection
tuning data, for continual pre-training with a constant learning rate. This foundational phase allows
the model to learn all the necessary knowledge for automated GUI interaction, including perception,
grounding, and action traces, ensuring robust coverage across diverse GUI elements and interactions.

- **持续预训练阶段**：我们利用§ 4中描述的完整数据集，不包括反思调整数据，进行持续预训练，学习速率保持不变。这个基础阶段使模型学习自动GUI交互所需的所有知识，包括感知、接地和行动轨迹，确保在各种GUI元素和交互中具有强大的覆盖范围。

- **Annealing Phase**: we then select high-quality subsets of perception, grounding, action trace, reflection
tuning data for annealing. The annealing process gradually adjusts the model’s learning dynamics,
promoting more focused learning and better optimization of its decision-making strategies in real-world
GUI interaction scenarios. We denote the model trained after this phase as UI-TARS-SFT.

- **退火阶段**：然后，我们选择感知（perception）、grounding、行动轨迹（action trace）、反思（reflection）调整数据的高质量子集进行退火。退火过程逐渐调整模型的学习动态，促进更加集中的学习，并更好地优化其在真实GUI交互场景中的决策策略。我们将在此阶段训练的模型称为 **UI-TARS-SFT**。

- **DPO Phase**: finally, we employ annotated reflective pairs from online bootstrapping data for DPO
training. During this process, the model refines its decision-making, reinforcing optimal actions while
penalizing suboptimal ones. This process improves the model’s ability to make precise, context-aware
decisions in real-world GUI interactions. The final model is denoted as UI-TARS-DPO.

- **DPO阶段**：最后，我们使用在线引导数据中注释的反思对进行DPO训练。在这个过程中，模型完善其决策，强化最优行动，同时惩罚次优行动。这个过程提高了模型在真实GUI交互中做出精确、上下文感知的决策的能力。最终模型被标记为 **UI-TARS-DPO**。


## 5 Experiment（实验）

In this section, we evaluate the performance of UI-TARS, trained on the dataset described in § 4, consisting of
approximately **50B** tokens. We choose Qwen-2-VL (Wang et al., 2024c) as the base model for training and
developed three model variants: UI-TARS-2B, UI-TARS-7B and UI-TARS-72B. Extensive experiments are
conducted to validate the advantages of the proposed models. These experiments are designed to assess the
models’ capabilities in three critical dimensions: perception, grounding, and agent capabilities. Finally, we
perform an ablation study to further investigate the impact of system 1 and system 2 reasoning on downstream
tasks. We set the N in Eq. 3 to 5 throughout this section. We evaluate both UI-TARS-SFT and UI-TARS-DPO
for OSWorld in § 5.4, as this benchmark benefits most from the iterative improvement from the DPO phase.
For other benchmarks, however, we report the model trained after the annealing phase (i.e., UI-TARS-SFT).

在本节中，我们评估了在§ 4中描述的数据集上训练的UI-TARS的性能，该数据集包含大约**50B**标记。我们选择Qwen-2-VL（Wang等，2024c）作为训练的基础模型，并开发了三个模型变体：UI-TARS-2B、UI-TARS-7B和UI-TARS-72B。我们进行了大量实验，以验证所提出模型的优势。这些实验旨在评估模型在三个关键维度上的能力：感知、grounding 和代理能力。最后，我们进行消融研究，进一步研究系统1和系统2推理对下游任务的影响。在本节中，我们将方程式3中的N设置为5。我们评估UI-TARS-SFT和UI-TARS-DPO在§ 5.4中的OSWorld，因为这个基准受益于DPO阶段的迭代改进。然而，对于其他基准，我们报告在退火阶段训练的模型（即UI-TARS-SFT）。

**Baseline** We compare UI-TARS with various baselines, including commercial models such as GPT-4o (Hurst
et al., 2024), Claude-3.5-Sonnet (Anthropic, 2024a), Gemini-1.5-Pro (Team et al., 2024), and Gemini-2.0
(Project Mariner) (GoogleDeepmind, 2024), as well as academic models from CogAgent (Hong et al., 2024),
OminiParser (Lu et al., 2024b), InternVL (Chen et al., 2024d), Aria-UI (Yang et al., 2024a), Aguvis (Xu et al.,
2024), OS-Atlas (Wu et al., 2024b), UGround (Gou et al., 2024b), ShowUI (Lin et al., 2024a), SeeClick (Cheng
et al., 2024), the Qwen series models QwenVL-7B (Bai et al., 2023b), Qwen2-VL (7B and 72B) (Wang et al.,
2024c), UIX-Qwen2-7B (Liu et al., 2024a) and Qwen-VL-Max (Bai et al., 2023a).

**基线** 我们将UI-TARS与各种基线进行比较，包括商业模型，如GPT-4o（Hurst等，2024）、Claude-3.5-Sonnet（Anthropic，2024a）、Gemini-1.5-Pro（Team等，2024）和Gemini-2.0（Project Mariner）（GoogleDeepmind，2024），以及来自CogAgent（Hong等，2024）、OminiParser（Lu等，2024b）、InternVL（Chen等，2024d）、Aria-UI（Yang等，2024a）、Aguvis（Xu等，2024）、OS-Atlas（Wu等，2024b）、UGround（Gou等，2024b）、ShowUI（Lin等，2024a）、SeeClick（Cheng等，2024）、Qwen系列模型QwenVL-7B（Bai等，2023b）、Qwen2-VL（7B和72B）（Wang等，2024c）、UIX-Qwen2-7B（Liu等，2024a）和Qwen-VL-Max（Bai等，2023a）的学术模型。

### 5.1 Perception Capability Evaluation（感知能力评估）

We evaluate the perception capabilities of the UI-TARS models using three key benchmarks: VisualWebBench (Liu et al., 2024c), WebSRC (Chen et al., 2021), and ScreenQA-short (Hsiao et al., 2022).
VisualWebBench measures the model’s ability to understand and ground web elements, covering tasks like
webpage QA, webpage OCR, and action prediction. UI-TARS models achieve outstanding results, with the
72B variant scoring 82.8, significantly outperforming closed-source models like GPT-4o (78.5) and Cluade 3.5
(78.2), as shown in Table 3. For WebSRC and ScreenQA-short, which assess web structural comprehension and
mobile screen content understanding through QA tasks, UI-TARS models show a clear advantage. WebSRC
focuses on understanding the semantic content and layout of webpages in web contexts, while ScreenQA-short
evaluates the interpretation of complex mobile screen layouts and interface-related questions. UI-TARS-7B
achieves a leading score of 93.6 on WebSRC, while UI-TARS-72B excells in ScreenQA-short with a score
of 88.6. These results demonstrate the superior perception and comprehension capabilities of UI-TARS in
web and mobile environments. Such perceptual ability lays the foundation for agent tasks, where accurate
environmental understanding is crucial for task execution and decision-making.

我们使用三个关键基准测试UI-TARS模型的感知能力：VisualWebBench（Liu等，2024c）、WebSRC（Chen等，2021）和ScreenQA-short（Hsiao等，2022）。VisualWebBench衡量模型理解和 ground 网页元素的能力，涵盖网页QA、网页OCR和行动预测等任务。如表3所示，UI-TARS模型取得了出色的成绩，72B变体得分为82.8，明显优于GPT-4o（78.5）和Cluade 3.5（78.2）等闭源模型。对于WebSRC和ScreenQA-short，这两个基准评估了通过QA任务对Web结构理解和移动屏幕内容理解。UI-TARS模型表现出明显优势。WebSRC侧重于理解Web上下文中网页的语义内容和布局，而ScreenQA-short评估了对复杂移动屏幕布局和与界面相关的问题的解释。UI-TARS-7B在WebSRC上取得了领先的93.6分，而UI-TARS-72B在ScreenQA-short上取得了88.6分的优异成绩。这些结果表明了UI-TARS在Web和移动环境中的优越感知和理解能力。这种感知能力为代理任务奠定了基础，准确的环境理解对任务执行和决策至关重要。

![](/images/2025/UI-TARS/Table3.png)

表3：GUI感知基准测试结果。

![](/images/2025/UI-TARS/Table4.png)

表4：各种模型在ScreenSpot-Pro上的比较。

### 5.2 Grounding Capability Evaluation（Grounding 能力评估）

To evaluate the grounding capabilities of the UI-TARS, we focus on three benchmarks: ScreenSpot Pro (Li
et al., 2025), ScreenSpot (Cheng et al., 2024), and ScreenSpot v2 (Wu et al., 2024b). These benchmarks
assess the ability to understand and localize elements in GUIs. ScreenSpot Pro is designed for high-resolution
professional environments, this benchmark includes expert-annotated tasks across 23 applications in five
industries and three operating systems. It provides a rigorous assessment of model grounding performance in
specialized, high-complexity scenarios. ScreenSpot and ScreenSpot v2 test GUI grounding across mobile,
desktop, and web platforms. ScreenSpot evaluates models using both direct instructions and self-generated
plans, while ScreenSpot v2 enhances the evaluation accuracy by correcting annotation errors.

为了评估UI-TARS的 grounding 能力，我们关注三个基准测试：ScreenSpot Pro（Li等，2025）、ScreenSpot（Cheng等，2024）和ScreenSpot v2（Wu等，2024b）。这些基准测试评估了理解和定位GUI元素的能力。ScreenSpot Pro专为高分辨率专业环境设计，该基准包括五个行业和三个操作系统中23个应用程序的专家注释任务。它对模型在专业、高复杂性场景中的 grounding 性能进行了严格评估。ScreenSpot和ScreenSpot v2测试了移动、桌面和Web平台上的GUI grounding。ScreenSpot通过直接指令和自动生成计划来评估模型，而ScreenSpot v2通过纠正注释错误来提高评估准确性。

UI-TARS consistently outperforms baselines across multiple benchmarks. Specifically, in Table 4, UI-TARS72B achieves a score of 38.1 on ScreenSpot Pro, significantly exceeding the performance of UGround-V1-7B
(31.1) and OS-Atlas-7B (18.9). Notably, we observe that increasing the input image resolution on ScreenSpot
Pro led to a significant performance improvement. Additionally, UI-TARS-7B attains a leading score of 89.5
on ScreenSpot in Table 5. On ScreenSpot v2, as shown in Table 6, both UI-TARS-7B (91.6) and UI-TARS72B (90.3) outperform existing baselines, such as OS-Atlas-7B (87.1), further highlighting the robustness
of our approach. In addition, the results show a significant improvement in grounding performance as we
scale from UI-TARS-2B to UI-TARS-7B across all three grounding datasets. Comparing UI-TARS-7B and
UI-TARS-72B, while ScreenSpot v1 and v2 exhibit no significant performance change, ScreenSpot Pro shows
notable improvement in model scaling. This indicates that ScreenSpot v1 and v2 may not be sufficiently robust
to fully capture the model’s grounding capabilities at higher scales.

UI-TARS在多个基准测试中始终优于基线。具体来说，在表4中，UI-TARS-72B在ScreenSpot Pro上取得了38.1分的成绩，明显超过了UGround-V1-7B（31.1）和OS-Atlas-7B（18.9）的表现。值得注意的是，我们观察到在ScreenSpot Pro上增加输入图像分辨率导致了显著的性能提升。此外，UI-TARS-7B在表5中取得了领先的89.5分。如表6所示，在ScreenSpot v2上，UI-TARS-7B（91.6）和UI-TARS-72B（90.3）都优于现有基线，如OS-Atlas-7B（87.1），进一步突显了我们方法的稳健性。此外，结果显示，随着我们从UI-TARS-2B到UI-TARS-7B的扩展，grounding 性能有了显著的提高。比较UI-TARS-7B和UI-TARS-72B，虽然ScreenSpot v1和v2没有显著的性能变化，但ScreenSpot Pro在模型扩展方面表现出明显的改进。这表明ScreenSpot v1和v2可能不足以充分捕捉模型在更高规模下的 grounding 能力。

![](/images/2025/UI-TARS/Table5.png)

表5：ScreenSpot上各种规划器和 grounding 方法的比较。

![](/images/2025/UI-TARS/Table6.png)

表6：ScreenSpot-V2上各种规划器和 grounding 方法的比较。

In summary, these results highlight the robust grounding capabilities of UI-TARS across various scenarios,
including mobile, desktop, web, and professional environments. The models’ consistent performance across
datasets and their ability to handle both general and high-complexity tasks underscore their versatility and
effectiveness in real-world GUI grounding applications.

总之，这些结果突显了UI-TARS在各种场景中的强大 grounding 能力，包括移动、桌面、Web和专业环境。模型在数据集上的一致性表现以及处理通用和高复杂性任务的能力突显了它们在真实GUI grounding 应用中的多功能性和有效性。

### 5.3 Offline Agent Capability Evaluation（离线代理能力评估）

To evaluate the GUI agent capabilities of UI-TARS in static, pre-defined environments, we conduct evaluations
on three benchmarks: **Multimodal Mind2Web** (Zheng et al., 2024a) is designed to create and evaluate
generalist web agents executing language instructions. It primarily assesses a model’s performance in webbased environments. Metrics include element accuracy (Ele.Acc), operation F1 score (Op.F1), and step
success rate (Step SR), as shown in Table 7. **Android Control** (Li et al., 2024c) evaluates planning and
action-execution abilities in mobile environments. This dataset includes two types of tasks: (1) high-level
tasks require the model to autonomously plan and execute multistep actions; (2) low-level tasks instruct the
model to execute predefined, human-labeled actions for each step (Table 8). **GUI Odyssey** (Lu et al., 2024a)
focuses on cross-app navigation tasks in mobile environments, featuring an average of 15+ steps per task.
Tasks span diverse navigation scenarios with instructions generated from predefined templates. The dataset
includes human demonstrations recorded on an Android emulator, providing detailed and validated metadata
for each task episode. For Multimodal Mind2Web, we adhere to the settings and metrics specified in the
original framework. For Android Control and GUI Odyssey (Table 8), we follow the settings and metrics
outlined in OS-Atlas (Wu et al., 2024b).

为了评估UI-TARS在静态、预定义环境中的GUI代理能力，我们在三个基准测试上进行评估：**Multimodal Mind2Web**（Zheng等，2024a）旨在创建和评估执行语言指令的通用Web代理。它主要评估模型在基于Web的环境中的性能。度量包括元素准确性（Ele.Acc）、操作F1分数（Op.F1）和步骤成功率（Step SR），如表7所示。**Android Control**（Li等，2024c）评估移动环境中的规划和行动执行能力。该数据集包括两种类型的任务：（1）高级任务要求模型自主规划和执行多步操作；（2）低级任务指导模型执行每一步的预定义、人工标记的操作（表8）。**GUI Odyssey**（Lu等，2024a）专注于移动环境中的跨应用程序导航任务，每个任务平均包含15个以上的步骤。任务涵盖了各种导航场景，指令是从预定义模板生成的。数据集包括在Android模拟器上记录的人类演示，为每个任务剧集提供了详细和经过验证的元数据。对于Multimodal Mind2Web，我们遵循原始框架中指定的设置和度量标准。对于Android Control和GUI Odyssey（表8），我们遵循OS-Atlas（Wu等，2024b）中概述的设置和度量标准。

![](/images/2025/UI-TARS/Table7.png)

表7：在不同设置下Multimodal Mind2Web的性能比较。我们报告元素准确性（Ele.Acc）、操作F1（Op.F1）和步骤成功率（Step SR）。

![](/images/2025/UI-TARS/Table8.png)

表8：移动任务（AndroidControl和GUI Odyssey）的结果。对于AndroidControl，我们报告两种设置（低和高）。

Across the three evaluated datasets, UI-TARS demonstrates clear advancements in reasoning and execution
capabilities. In Multimodal Mind2Web (Table 7), most of the agent models significantly outperform frameworkbased methods (using GPT-4o or GPT-4V as the core planner). Comparing different agent models, UI-TARS72B achieving SOTA performance across key metrics. UI-TARS-7B, despite having fewer parameters, surpass
strong baselines such as Aguvis-72B model and Claude. On AndroidControl and GUI Odyssey (Table 7), UITARS-7B and UI-TARS-72B surpasses previous SOTA method (OS-Atlas-7B) with an absolute performance
increase of 25, showing notable superiority in multistep offline tasks. We also find that Claude Computer-Use
performs strongly in web-based tasks but significantly struggles with mobile scenarios, indicating that the GUI
operation ability of Claude has not been well transferred to the mobile domain. In contrast, UI-TARS exhibits
excellent performance in both website and mobile domain, highlighting its adaptability and generalization
capabilities.

在三个评估数据集中，UI-TARS在推理和执行能力方面取得了明显的进步。在Multimodal Mind2Web（表7）中，大多数代理模型明显优于基于框架的方法（使用GPT-4o或GPT-4V作为核心规划器）。比较不同的代理模型，UI-TARS-72B在关键指标上取得了SOTA性能。UI-TARS-7B，尽管参数较少，但超过了强基线，如Aguvis-72B模型和Claude。在AndroidControl和GUI Odyssey（表7）中，UI-TARS-7B和UI-TARS-72B超过了以前的SOTA方法（OS-Atlas-7B），绝对性能提高了25，显示了在多步离线任务中的显著优势。我们还发现，Claude Computer-Use在基于Web的任务中表现强劲，但在移动场景中明显遇到困难，表明Claude的GUI操作能力尚未很好地转移到移动领域。相比之下，UI-TARS在网站和移动领域表现出色，突显了其适应性和泛化能力。

### 5.4 Online Agent Capability Evaluation（在线代理能力评估）

Online evaluations enable dynamic environments, each designed as an interactive simulation that mirrors
real-world scenarios. In these environments, GUI agents can alter environmental states by executing actions
in real time. We evaluate different models in online environments using two benchmarks: **OSWorld** (Xie
et al., 2024) provides a scalable and diverse environment for evaluating multimodal agents on complex tasks
across Ubuntu, Windows, and macOS platforms. It consists of 369 tasks involving real-world web and desktop
applications, with detailed setups and evaluation scripts. The evaluation is conducted in screenshot-only
mode. To mitigate potential interference from network instability and environmental factors, the final score is
averaged over 3 runs. We also consider traces where our model decides to “CallUser” or traces our model
fails to output “Finish” in the end as infeasible tasks for evaluation. **AndroidWorld** (Rawles et al., 2024b) is
an environment designed for developing and benchmarking autonomous agents on a live Android emulator.
It includes 116 tasks across 20 mobile apps, with dynamic task variations generated through randomized
parameters. This dataset is ideal for evaluating agents’ adaptability and planning abilities in mobile contexts.

在线评估可以在动态环境中进行，每个环境都设计为一个交互式模拟，反映了真实世界的场景。在这些环境中，GUI代理可以通过实时执行行动改变环境状态。我们使用两个基准测试在在线环境中评估不同的模型：**OSWorld**（Xie等，2024）提供了一个可扩展和多样化的环境，用于评估跨Ubuntu、Windows和macOS平台上复杂任务的多模态代理。它包括369个涉及真实Web和桌面应用程序的任务，具有详细的设置和评估脚本。评估是在仅截图模式下进行的。为了减轻网络不稳定和环境因素可能的干扰，最终得分是在3次运行中平均的。我们还考虑了我们的模型决定“CallUser”或我们的模型最终未输出“Finish”作为不可行任务的轨迹进行评估。**AndroidWorld**（Rawles等，2024b）是一个专为在实时Android模拟器上开发和基准测试自主代理而设计的环境。它包括20个移动应用程序中的116个任务，通过随机参数生成动态任务变化。这个数据集非常适合在移动环境中评估代理的适应性和规划能力。

![](/images/2025/UI-TARS/Table9.png)

表9：在线基准测试结果。我们在OSWorld上的仅截图设置下评估性能，将最大步数限制为15。

The results are listed in Table 9. (1) On **OSWorld**, when given a budget of 15 steps, UI-TARS-7B-DPO (18.7)
and UI-TARS-72B-DPO (22.7) significantly outperforms Claude (14.9), demonstrating its strong reasoning
capabilities. Also, UI-TARS-72B-DPO with a 15-step budget (22.7) is comparable to Claude when the latter
is given 50-step budget (22.0), showing great execution efficiency. Notably, UI-TARS-72B-DPO achieves a
new SOTA result 24.6 on OSWorld with a budget of 50 steps, surpassing all the existing agent frameworks
(e.g., GPT-4o with Aria-UI), highlighting the significant potential of agent models in addressing complex
desktop-based tasks with higher efficiency and effectiveness. (2) Results on **AndroidWorld** deliver a similar
conclusion, with UI-TARS-72B-SFT achieving a 46.6 performance, outperforming the best previous agent
framework (GPT-4o with Aria-UI, 44.8) and agent model (Aguvis-72B, 26.1). (3) Comparing the results of
SFT model and DPO model, we find that DPO significantly improves the performance on OSWorld, showing
that involving “negative samples” during training enables the model to better distinguish between optimal and
suboptimal actions. (4) Furthermore, comparing UI-TARS-72B and UI-TARS-7B, we find that the 72B model
performs much better than the 7B model in online tasks, and the gap is larger compared to offline tasks (Table 7
and Table 8). This shows that scaling model size significantly improves system 2 reasoning, enabling more
deliberate and logical decision-making. Moreover, the discrepancy suggests that evaluations based solely on
offline benchmarks may fail to accurately capture the models’ capabilities in real-time, dynamic environments.
In general, these results validate the potential of agent models for reasoning-intensive tasks and emphasize the
advantages of leveraging larger-scale models to tackle the challenges of online environments.

结果列在表9中。(1) 在**OSWorld**中，当给定15步预算时，UI-TARS-7B-DPO（18.7）和UI-TARS-72B-DPO（22.7）显著优于Claude（14.9），展示了其强大的推理能力。此外，UI-TARS-72B-DPO在15步预算下（22.7）的表现与Claude在50步预算下（22.0）的表现相当，显示出极高的执行效率。值得注意的是，UI-TARS-72B-DPO在50步预算下在OSWorld上取得了新的SOTA结果24.6，超过了所有现有的代理框架（例如，带有Aria-UI的GPT-4o），突显了代理模型在更高效和有效地解决复杂桌面任务方面的巨大潜力。(2) 在**AndroidWorld**上的结果得出了类似的结论，UI-TARS-72B-SFT取得了46.6的成绩，超过了之前最好的代理框架（带有Aria-UI的GPT-4o，44.8）和代理模型（Aguvis-72B，26.1）。(3) 比较SFT模型和DPO模型的结果，我们发现DPO显著提高了在OSWorld上的性能，表明在训练过程中引入“负样本”使模型能够更好地区分最佳和次优动作。(4) 此外，比较UI-TARS-72B和UI-TARS-7B，我们发现72B模型在在线任务中的表现远优于7B模型，并且相比离线任务（表7和表8），差距更大。这表明扩大模型规模显著提高了系统2推理能力，使决策更加深思熟虑和逻辑化。此外，这种差异表明，仅基于离线基准测试的评估可能无法准确捕捉模型在实时动态环境中的能力。总体而言，这些结果验证了代理模型在推理密集型任务中的潜力，并强调了利用大规模模型应对在线环境挑战的优势。

### 5.5 Comparing System 1 and System 2 Reasoning（比较系统1和系统2推理）

We compare the effects of system-1 and system-2 reasoning on model performance. System-1 reasoning refers
to the model directly producing actions without chain-of-thought, while system-2 reasoning involves a more
deliberate thinking process where the model generates reasoning steps before selecting an action. We train
UI-TARS-7B to acquire both capabilities but we modify the model’s reasoning behavior during inference
through prompt engineering.

我们比较系统1和系统2推理对模型性能的影响。系统1推理是指模型直接生成行动而不需要思考链，而系统2推理涉及更深思熟虑的思考过程，模型在选择行动之前生成推理步骤。我们训练UI-TARS-7B获得这两种能力，但我们通过提示工程在推理过程中修改模型的推理行为。

**In-domain Evaluation** We first evaluate performance across three in-domain agent benchmarks: Multimodal
Mind2Web, Android Control, and GUI Odyssey, all of which have corresponding training data in UI-TARS.
For efficiency in evaluation, we randomly sample 1,000 examples for the Android Control and GUI Odyssey
benchmarks. We use the Best-of-N (BoN) sampling method, where UI-TARS samples N candidate outputs
per input, with N set to 1, 16, and 64. The step success rate is used as the evaluation metric.

**领域内评估** 我们首先在三个领域内代理基准测试中评估性能：Multimodal Mind2Web、Android Control和GUI Odyssey，所有这些基准测试都在UI-TARS中有相应的训练数据。为了提高评估效率，我们在Android Control和GUI Odyssey基准测试中随机抽取1,000个示例。我们使用最佳N（BoN）抽样方法，其中UI-TARS对每个输入抽样N个候选输出，N设置为1、16和64。步骤成功率被用作评估指标。

![](/images/2025/UI-TARS/Figure8.png)

图8：系统1（无思考）和系统2（有思考）在领域内（Mind2Web、AndroidControl、GUI Odyssey）和领域外（AndroidWorld）基准测试中的性能。

As shown in Figure 8, at N=1, system-2 reasoning performs slightly worse than system-1 reasoning across
all three in-domain benchmarks. While system-2 reasoning is generally expected to improve task execution
by introducing a reflective, multi-step process, this result suggests that under a single-sample condition,
the complexity of system-2 reasoning can lead to suboptimal reasoning steps. Specifically, the model may
introduce irrelevant or incorrect reasoning steps—such as referring to non-existent objects or making erroneous
inferences—which increases the risk of hallucinations or failure to generate the correct action. In the absence
of diverse candidate outputs, the model may fixate on a flawed reasoning path, resulting in a lower likelihood
of choosing the correct action.

如图8所示，在N=1时，系统2推理在所有三个领域内基准测试中的表现略逊于系统1推理。虽然通常认为系统2推理通过引入反思、多步骤过程来提高任务执行，但这个结果表明，在单样本条件下，系统2推理的复杂性可能导致次优的推理步骤。具体来说，模型可能引入不相关或不正确的推理步骤——比如参考不存在的对象或做出错误的推理——这增加了产生幻觉或无法生成正确行动的风险。在没有多样化的候选输出的情况下，模型可能会固执于一个有缺陷的推理路径，导致选择正确行动的可能性降低。

However, as N increases to 16 and 64, the system-2 model begins to demonstrate a clear advantage over
system-1 reasoning. The increased number of candidate outputs provides greater diversity in the decision
space, allowing the model to overcome suboptimal reasoning paths. In particular, the system-2 model benefits
from the opportunity to explore multiple reasoning chains, which compensates for the earlier issues seen with
N=1. The diversity of candidates increases the likelihood that the correct action is among the sampled outputs,
even if some of the intermediate reasoning steps were not ideal. This shift in performance is particularly
striking as it shows that the deliberate, multi-step reasoning of system-2 can effectively compensate for its
initial disadvantages when sufficient candidate outputs are available.

然而，当N增加到16和64时，系统2模型开始表现出明显优势。增加的候选输出数量提供了更大的决策空间多样性，使模型能够克服次优的推理路径。特别是，系统2模型受益于探索多个推理链的机会，这弥补了N=1时出现的问题。候选人的多样性增加了正确行动在抽样输出中的可能性，即使一些中间推理步骤不理想。这种性能转变尤其引人注目，因为它表明系统2的深思熟虑、多步推理可以在有足够的候选输出时有效地弥补其初始劣势。

A key insight is that while system-2 reasoning excels with sufficient diversity, achieving optimal performance
with a single, decisive output (as in Bo1) remains a significant challenge. The ideal future direction involves
leveraging system-2 reasoning’s strengths in diverse, real-world scenarios while minimizing the need for
multiple samples. This could be accomplished through techniques like reinforced fine-tuning (Jaech et al.,
2024), which would guide the model to produce the correct action with high confidence in a single pass.

一个关键的见解是，虽然系统2推理在有足够多样性的情况下表现出色，但在单一、决定性输出（如Bo1）中实现最佳性能仍然是一个重大挑战。理想的未来方向是利用系统2推理在多样化的真实场景中的优势，同时最大限度地减少对多个样本的需求。这可以通过诸如强化微调（Jaech等，2024）的技术来实现，该技术将引导模型在一次传递中以高置信度生成正确的行动。

**Out-of-domain Evaluation** Next, we evaluate both reasoning methods on AndroidWorld, an out-of-domain
(OOD) benchmark without corresponding training data in UI-TARS. We evaluate UI-TARS-7B and UI-TARS72B at Bo1. Interestingly, the results from AndroidWorld reveal a significant shift compared to the in-domain
benchmarks. While system-1 reasoning performs well in in-domain scenarios (Mind2Web, Android Control,
and GUI Odyssey), system-2 reasoning significantly outperforms system-1 in the OOD setting (AndroidWorld).
This suggests that although system-2 may face challenges in in-domain scenarios, particularly under singlesample conditions, its deeper reasoning capabilities provide a distinct advantage in OOD situations. In these
cases, the increased reasoning depth helps the model generalize to previously unseen tasks, highlighting the
broader applicability and potential of system-2 reasoning in real-world, diverse scenarios.

**领域外评估** 接下来，我们在AndroidWorld上评估两种推理方法，这是一个没有UI-TARS中对应训练数据的领域外（OOD）基准测试。我们在Bo1上评估UI-TARS-7B和UI-TARS-72B。有趣的是，与领域内基准测试相比，AndroidWorld的结果显示了一个显著的转变。虽然系统1推理在领域内场景（Mind2Web、Android Control和GUI Odyssey）中表现良好，但系统2推理在领域外环境（AndroidWorld）中明显优于系统1推理。这表明，尽管系统2在领域内场景中可能面临挑战，特别是在单样本条件下，但其更深入的推理能力在领域外情况下提供了明显优势。在这些情况下，增加的推理深度有助于模型推广到以前未见过的任务，突显了系统2推理在真实世界、多样化场景中的更广泛适用性和潜力。

## 6 Conclusion（结论）

In this paper, we introduced UI-TARS, a native GUI agent model that integrates perception, action, reasoning,
and memory into a scalable and adaptive framework. Achieving state-of-the-art performance on challenging
benchmarks such as OSWorld, UI-TARS outperforms existing systems like Claude and GPT-4o. We presented
several novel innovations, including enhanced perception, unified action modeling, system-2 reasoning, and
iterative refinement using online traces, all of which enable the agent to effectively handle complex GUI
tasks with minimal human oversight. We also reviewed the evolution path of GUI agents, from rule-based
systems to adaptive native models. We segment the development process into key stages based on the degree
of human intervention and generalization capabilities, emphasizing the transition from text-based methods
to pure-vision, end-to-end agent models. We also explored the core capabilities of the native agent model,
including perception, action, reasoning, and memory, which form the foundation for future advancements
in GUI agents. Looking ahead, while native agents represent a significant leap forward, the future lies in
the integration of active and lifelong learning, where agents autonomously drive their own learning through
continuous, real-world interactions.

在本文中，我们介绍了UI-TARS，这是一个本地GUI代理模型，将感知、行动、推理和记忆集成到一个可扩展和自适应的框架中。在诸如OSWorld这样具有挑战性的基准测试中取得了最先进的性能，UI-TARS优于现有系统，如Claude和GPT-4o。我们提出了几项新颖的创新，包括增强的感知、统一的行动建模、系统2推理和使用在线轨迹进行迭代细化，所有这些都使代理能够在最少的人类监督下有效地处理复杂的GUI任务。我们还回顾了GUI代理的演进路径，从基于规则的系统到自适应本地模型。我们根据人类干预程度和泛化能力将开发过程分为关键阶段，强调从基于文本的方法向纯视觉、端到端代理模型的过渡。我们还探讨了本地代理模型的核心能力，包括感知、行动、推理和记忆，这些能力构成了GUI代理未来发展的基础。展望未来，虽然本地代理代表了一个重大的飞跃，但未来在于积极和终身学习的整合，代理通过持续的真实世界互动自主驱动自己的学习。


## References（参考文献）
- [Agent-e: From autonomous web navigation to foundational design principles in agentic systems.](https://arxiv.org/abs/2407.13032)
- [Gpt-4 technical report.](https://arxiv.org/abs/2303.08774)
- [AutoGUI: Scaling GUI grounding with automatic functionality annotations from LLMs.](https://openreview.net/forum?id=wl4c9jvcyY)
- [Claude-3-5-sonnet.](https://www.anthropic.com/news/claude-3-5-sonnet)
- [Developing a computer use model.](https://www.anthropic.com/news/developing-computer-use)
- [Mint-1t: Scaling open-source multimodal data by 10x: A multimodal dataset with one trillion tokens.](https://arxiv.org/abs/2406.11271)
- [Interactive continual learning architecture for long-term personalization of home service robots.](https://doi.org/10.1109/ICRA.2024.11289)
- [Uibert: Learning generic multimodal representations for UI understanding.](https://doi.org/10.24963/ijcai.2021/235)
- [Qwen-vl: A frontier large vision-language model with versatile abilities.](https://arxiv.org/abs/2308.12966)
- [Qwen-vl: A versatile vision-language model for understanding, localization, text reading, and beyond.](https://arxiv.org/abs/2308.12966)
- [A framework for behavioural cloning.](http://www.cse.unsw.edu.au/~claude/papers/MI15.pdf)
- [Introducing our multimodal models.](https://www.adept.ai/blog/fuyu-8b)
- [Windows agent arena: Evaluating multi-modal os agents at scale.](https://arxiv.org/abs/2409.08264)
- [Rank analysis of incomplete block designs: I. the method of paired comparisons.](https://doi.org/10.1093/biomet/39.3-4.324)
- [A mobile robotic chemist.](https://doi.org/10.1038/s41586-020-2442-2)
- [A dataset for interactive vision-language navigation with unknown command feasibility.](https://doi.org/10.1007/978-3-031-20074-8_18)


## A Case Study（案例研究）

We list a few cases executed by UI-TARS in Figure 9, Figure 10, Figure 11, and Figure 12.

我们列出了UI-TARS在图9、图10、图11和图12中执行的几个案例。

![](/images/2025/UI-TARS/Figure9.png)

图9：UI-TARS在Ubuntu impress场景上的测试案例。任务是：使幻灯片2的背景颜色与幻灯片1的标题颜色相同。

![](/images/2025/UI-TARS/Figure10.png)

图10：UI-TARS在Android上的测试案例。任务是：播放富士山下的歌曲。

| 思考（Thought） | 行动（Action） |
| --- | --- |
| 点击屏幕左中部的“音乐”图标，这是一个红色圆圈，里面有一个白色音符图案，以打开音乐应用。 | 点击（start_box: [0.24, 0.306, 0.24, 0.306]） |
| 要激活输入功能，请点击搜索框，这是页面顶部中心的一个圆角灰色矩形，包含文本“我是贝利亚”。 | 点击（start_box: [0.492, 0.075, 0.492, 0.075］） |
| 在搜索框中键入“富士山下”并查看相关搜索结果。 | 键入（content='富士山下'） |
| 点击搜索结果中的第一个选项“富士山下”，这是屏幕左上角的红色文本。 | 点击（start_box: [0.229, 0.138, 0.229, 0.138］） |
| 我点击了搜索结果列表中的第一首歌曲条目“富士山下”，这是页面中部上方的红色文本。 | 点击（start_box: [0.499, 0.218, 0.499, 0.218］） |
| 任务已完成，我在音乐应用上播放了富士山下的歌曲。 | 完成 |

![](/images/2025/UI-TARS/Figure11.png)

图11：UI-TARS在Ubuntu VSCode场景上的测试案例。任务是：请帮我在VS Code中安装autoDocstring扩展。

![](/images/2025/UI-TARS/Figure12.png)

图12：UI-TARS在Windows chrome场景上的测试案例。任务是：我想在chrome中默认显示书签栏。


## B Data Examples（数据示例）

We show several data examples for perception training in Figure 13, Figure 14, Figure 15, and Figure 16.

我们在图13、图14、图15和图16中展示了几个感知训练的数据示例。

![](/images/2025/UI-TARS/Figure13.png)

图13：密集字幕示例。

```
Input: Provide a detailed description of the GUI screenshot, including all visible elements, layout, and styling.
Output: The screenshot displays the homepage of TSB Bank's website, which has a clean and modern layout with a color scheme of blues, whites, and a pop of pink. The background is light blue.
At the top of the screen, there is a navigation bar with options for "Personal," "Business," "My TSB Rewards," "Money Confidence," "Help & Support," "Register," and "Login". The TSB logo is prominently displayed on the left side under the navigation bar.
Below the navigation bar, there are additional options for "Current Accounts," "Savings," "Mortgages," "Insurance," "Loans," and "Credit Cards". To the right, there is a search icon with the word "Search" next to it.
The main focus of the screen is a large heading that reads “Fancy a free lunch?” in bold, dark blue text.
Below the heading, there is a paragraph explaining that you can earn £5 cashback every month for 6 months with the Spend & Save current account, along with terms and conditions. There is also a blue button labeled with white text “Find out more”.
To the right of the text, there is an image of a pink elephant sitting down and enjoying a meal of what appears to be dim sum, with a big blue and a small white circle in the background. The elephant is holding chopsticks in its trunk, and there is a speech bubble above its head with the word "SWITCH GUARANTEE" inside.
Below the main heading and image, there are six icons with accompanying text. Each icon has a blue background with a white symbol representing different services offered by the bank, such as a wallet with a pound sign, a house, and a piggy bank. The text below the icons includes "Find the right," "Find a current," "See our savings," "Get a personal," "Help for money," and "Help & support".
From the screenshot, it can be inferred that TSB Bank is promoting its Spend & Save current account with a cashback offer, and the website provides options for users to explore various banking services. The user can click on the navigation options at the top of the screen or the icons below the main heading to learn more about the bank's offerings.
```

```
输入：提供GUI截图的详细描述，包括所有可见元素、布局和样式。
输出：截图显示了TSB银行网站的主页，具有干净现代的布局，颜色方案为蓝色、白色和一点粉色。背景是浅蓝色。
屏幕顶部有一个导航栏，选项包括“个人”、“商业”、“我的TSB奖励”、“金钱信心”、“帮助与支持”、“注册”和“登录”。TSB标志醒目地显示在导航栏下方的左侧。
在导航栏下方，还有“活期账户”、“储蓄”、“抵押贷款”、“保险”、“贷款”和“信用卡”的其他选项。右侧有一个带有“搜索”字样的搜索图标。
屏幕的主要焦点是一个大标题，用粗体深蓝色文字写着“想要免费午餐吗？”。
在标题下方，有一段解释，说明您可以通过Spend & Save活期账户每月获得6个月的5英镑现金返还，以及条款和条件。还有一个标有白色文字“了解更多”的蓝色按钮。
在文本的右侧，有一张粉色大象坐在那里，享用着似乎是点心的一顿饭，背景是一个大蓝色和一个小白色的圆圈。大象用鼻子拿着筷子，头顶上有一个带有“SWITCH GUARANTEE”字样的对话气泡。
在主标题和图像下方，有六个带有相应文本的图标。每个图标都有一个蓝色背景，上面有一个代表银行提供的不同服务的白色符号，如带有英镑符号的钱包、房子和存钱罐。图标下方的文本包括“找到合适的”、“找到一个活期”、“看看我们的储蓄”、“获得个人”、“帮助理财”和“帮助与支持”。
从截图中可以推断，TSB银行正在推广其Spend & Save活期账户的现金返还优惠，网站提供了用户探索各种银行服务的选项。用户可以点击屏幕顶部的导航选项或主标题下方的图标了解银行的各种服务。
```

![](/images/2025/UI-TARS/Figure14.png)

图14：状态转换字幕示例。

```
Input:
Given two consecutive GUI screenshots, describe what has changed and what user interaction likely occurred between them, as if you were describing a scene transition in a movie.
Requirements:
1. Describe what was shown in the first screenshot
2. Describe what changed in the second screenshot
3. Explain what user action most likely happened in between.

Output: The first screenshot shows the interface of Creo Parametric 8.0 software (as indicated by the light gray text at the top center of the screen). On the left side, there is a window labeled "Model Tree" which lists multiple files and folders, including "TRAY0001.ASM", "ASM_RIGHT", "ASM_TOP", "ASM_FRONT", "ASM_DEF_CSYS", and "TRAY_BOX".
These files and folders are organized in a tree structure, showing the components of the current project. At the top of the interface is a toolbar with multiple tabs in the first row ("File", "Tray"), and the second row contains various tool buttons such as "Printer", "Assemble", "Arrange on Tray", "Pattern", "Generate Support", "Edit Support Parameters", "Measure", "Printability Validation", "Global Interference", "Calculate Build", "Note", and "Preview 3D Printing".
In the center of the software, there is a file open dialog box containing multiple files: Bolt.prt, Bushing.prt, Clips.prt (which appears to be selected by the mouse), Handles1.prt, Handles2.prt, and Handlebar_grip.prt. Below shows a yellow clip-shaped part with two connected cylindrical structures, which appears to be Clips.prt, with a modification time of 16-Jan-21 12:10:34 AM. At the bottom are several buttons, including a blue "Open" button and a "Cancel" button on the right.
The second screenshot still shows the Creo Parametric 8.0 software interface and file open dialog box. However, the displayed image has changed to a handle part. The preview window shows a silver and green cylindrical handle component. The 3D preview shows it has two sections: a longer silver cylindrical main body, and a shorter green protruding section, likely used for gripping or fixing. From the file list, we can see that Handlebar_grip.prt is currently selected, and the file name "Handlebar_grip.prt" is displayed at the bottom of the file dialog box.
Overall, it appears the user clicked on Handlebar_grip.prt in the file open dialog box, causing the 3D file preview area below to switch to the silver handle component.
```

```
输入：
给定两个连续的GUI截图，请描述它们之间发生了什么变化，以及用户交互可能发生了什么，就像您在描述电影中的场景转换一样。
要求：
1. 描述第一个截图中显示了什么
2. 描述第二个截图中发生了什么变化
3. 解释两者之间最可能发生的用户操作。

输出：第一个截图显示了Creo Parametric 8.0软件的界面（如屏幕顶部中央的浅灰色文本所示）。左侧有一个标有“模型树”的窗口，列出了多个文件和文件夹，包括“TRAY0001.ASM”、“ASM_RIGHT”、“ASM_TOP”、“ASM_FRONT”、“ASM_DEF_CSYS”和“TRAY_BOX”。
这些文件和文件夹以树形结构组织，显示了当前项目的组件。界面顶部是一个工具栏，第一行有多个选项卡（“文件”、“托盘”），第二行包含各种工具按钮，如“打印机”、“组装”、“放置在托盘上”、“图案”、“生成支撑”、“编辑支撑参数”、“测量”、“可打印性验证”、“全局干涉”、“计算构建”、“注释”和“预览3D打印”。
在软件中心，有一个包含多个文件的文件打开对话框：Bolt.prt、Bushing.prt、Clips.prt（似乎被鼠标选中）、Handles1.prt、Handles2.prt和Handlebar_grip.prt。下方显示了一个黄色的夹子形状部件，带有两个连接的圆柱结构，看起来是Clips.prt，修改时间为21年1月16日凌晨12:10:34。底部有几个按钮，右侧有一个蓝色的“打开”按钮和一个“取消”按钮。
第二个截图仍然显示Creo Parametric 8.0软件界面和文件打开对话框。然而，显示的图像已经变成了一个手柄部件。预览窗口显示了一个银色和绿色的圆柱形手柄组件。3D预览显示它有两个部分：一个较长的银色圆柱形主体，和一个较短的绿色突出部分，可能用于抓握或固定。从文件列表中，我们可以看到Handlebar_grip.prt当前被选中，并且文件名“Handlebar_grip.prt”显示在文件对话框底部。
总的来说，用户似乎点击了文件打开对话框中的Handlebar_grip.prt，导致下方的3D文件预览区域切换到银色手柄组件。
```

![](/images/2025/UI-TARS/Figure15.png)

图15：问答和标记示例。

```
Input: What is the title of the first recent post? Use the image to answer the question with a single word or phrase.
Output: What Happens in Vegas, Stays in Vegas

Input: Tell me what is inside the red rectangle margin.
Output: Main content text that reads "A home is something you can't live without. This page, not so much. Don't worry."
```

```
输入：最近的第一篇文章的标题是什么？使用图像回答问题，只需一个单词或短语。
输出：在拉斯维加斯发生的事情，留在拉斯维加斯

输入：告诉我红色矩形边框里面有什么。
输出：主要内容文本，内容是“家是你不能没有的东西。这个页面，不那么重要。别担心。”
```

![](/images/2025/UI-TARS/Figure16.png)

图16：元素描述示例，图像中的目标元素用粉色边框突出显示。

```
Input: Identify the UI control types (such as buttons, text fields, dropdowns) at [0.47,0.89,0.84,0.99], using standard Windows/UI control terminology.
Output: ComboBox

Input: Describe the visual appearance of UI element at [0.47,0.89,0.84,0.99], including its shape, color, text content, and visual styling details.
Output: The element is a rectangular ComboBox with the text at the left 'Product description' inside. The text is black, with the same font size, and is laid out horizontally. The element has a white background.

Input: Describe the spatial location of the element with the relationship to other elements using clear directional and relational terms. The element is at [0.47,0.89,0.84,0.99].
Output: The element is located at the bottom right of the screenshot. Above it, there is a paragraph describing the product.

Input: For the UI element at [0.47,0.89,0.84,0.99], explain its probable function and how users would typically interact with it in the interface.
Output: After clicking this combobox, we can choose to display different product attributes in the interface. Currently, it shows the general product introduction.
```

```
输入：使用标准Windows/UI控件术语，识别[0.47,0.89,0.84,0.99]处的UI控件类型（如按钮、文本字段、下拉框）。
输出：ComboBox

输入：描述[0.47,0.89,0.84,0.99]处UI元素的视觉外观，包括其形状、颜色、文本内容和视觉样式细节。
输出：该元素是一个带有左侧文本“产品描述”的矩形ComboBox。文本为黑色，字体大小相同，水平布局。元素具有白色背景。

输入：使用清晰的方向和关系术语描述元素与其他元素的空间位置关系。元素位于[0.47,0.89,0.84,0.99]处。
输出：该元素位于截图的右下角。在它上面，有一个描述产品的段落。

输入：对于[0.47,0.89,0.84,0.99]处的UI元素，解释其可能的功能以及用户在界面中通常如何与之交互。
输出：点击此组合框后，我们可以选择在界面中显示不同的产品属性。当前，它显示了一般的产品介绍。
```