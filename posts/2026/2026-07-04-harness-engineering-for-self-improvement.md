---
type: article
title: "自我改进的 Harness 工程（Harness Engineering for Self-Improvement）"
date:   2026-07-04 09:08:00 +0800
tags: [translation, harness, self-improvement, recursive-self-improvement, agent, loop, lilianweng]
author: Lilian Weng
---

**递归自我改进（recursive self-improvement, RSI）** 的概念可以追溯到 [I. J. Good (1965)](https://philpapers.org/rec/GOOSCT)，他将"超智能机器"定义为一个能够在所有智力活动中超越人类、并设计出更好的机器来改进自身的系统。[Yudkowsky (2008)](https://www.lesswrong.com/posts/JBadX7rwdcRFzGuju/recursive-self-improvement) 使用"递归自我改进"这一术语来描述一个特定的反馈循环：AI 利用其当前的智能来改进产生其智能的认知机制。

这种反馈循环在现代 AI 中可能意味着模型直接重写自身的权重，或者更广泛地说，模型改进了*训练流水线*和*部署系统*，从而催生出一个在经济价值任务上表现更优的继任模型。AI 研究发展的速度在前沿实验室中已被证明正在急剧加速（[Anthropic](https://www.anthropic.com/institute/recursive-self-improvement)；[OpenAI](https://openai.com/index/how-agents-are-transforming-work/)）。

我特意提到 *"部署系统"*，因为原始模型与真实世界环境之间的这一层，似乎与模型原始智能（即预训练后的评估）同等重要。Harness 是 AI 部署的重要组成部分，Claude Code 和 Codex 等成功的编码智能体产品已证明了这一点。**Harness** 是围绕基础模型的系统，负责编排执行、决定模型如何思考和规划、调用工具和执行动作、感知和管理上下文、存储产物以及评估结果。

本文将聚焦于 harness 工程相关的研究，以及它如何促进 RSI。近期关于自动研究、自我改进智能体和进化程序搜索的许多工作都可以围绕这一问题来组织。模型自对弈、合成数据、测试时训练以及更广泛的持续学习等主题也符合 RSI 的愿景（例如 [Yuan et al. 2024](https://arxiv.org/abs/2401.10020)、[Chen et al. 2024](https://arxiv.org/abs/2401.01335)、[Zhao et al. 2025](https://arxiv.org/abs/2505.03335)、[Choi et al. 2026](https://openreview.net/forum?id=lTbBFAoPSA)），但它们不是本文的重点。

## Harness 设计模式

与[早期的智能体框架](https://lilianweng.github.io/posts/2023-06-23-agent/) "智能体 = LLM + 记忆 + 工具 + 规划 + 行动"相比，harness 工程 additionally 包括*工作流设计（如循环工程）、评估、权限控制和持久状态管理*。它不再仅仅是提示模板，而更接近运行时和软件系统设计：模型如何观察、行动、记忆、自我检查以及改进。

设计应刻意保持简单和通用以实现泛化，可能参考现有的软件工程实践以受益于预训练知识。Harness 与操作系统之间也有很强的类比。类似于操作系统，harness 应该封装复杂的逻辑同时保持接口简单。与此同时，配置、工具接口和其他协议可能逐渐在行业内标准化。

### 模式 1：工作流自动化

定义一个模型可以在其中操作、测试和迭代的工作流是自动化的一项关键设计。Karpathy 的 autoresearch 仓库（<https://github.com/karpathy/autoresearch>）是这种工作流如何构建的一个简洁示例。一个常见的工作流遵循目标导向的循环：规划、执行、观察/测试、改进，然后再次执行，*直到*目标达成。该过程可能会主动向用户发起请求，以澄清任务规格或执行偏好。

![](/images/2026/harness/openai-agent-loop.png)

简化的 Codex 智能体循环：智能体调用工具，工具响应影响模型的下一次生成。
（图片来源：[OpenAI codex agent post](https://openai.com/index/unrolling-the-codex-agent-loop/)）

工作流图还强调模型分析自身轨迹和失败案例，然后通过"智能体运行时"而非静态提示模板来迭代其进展。

### 模式 2：文件系统作为持久内存

长程智能体系统中的一个常见模式是对丰富状态和产物的简单控制。Harness 不应将整个工作流和所有日志都承载在上下文中；相反，它应该将持久状态保存在文件中。在长程智能体部署中，实验日志、代码差异、论文摘要、错误追踪和过去部署轨迹等产物通常增长得比模型训练时所针对的上下文窗口长得多。

学习如何读写和编辑文件系统（通常通过 `bash` 命令）是 LLM 的一项基础技能，因此以简单文件形式管理持久内存自然受益于核心模型能力的改进。

### 模式 3：子智能体与后台任务

Harness 可以生成多个子智能体并行执行并监控后台任务。当主智能体需要搜索多个假设、并发运行实验或委派隔离的子任务而不污染主上下文时，这非常有用。然后主智能体需要一个小型进程管理器：启动任务、检查日志、取消失败运行，并将结果合并回主智能体线程。

关键的设计选择是让并行性显式且可检查。如果子智能体输出仅存在于瞬态聊天上下文中，它们很快就会过时和隐藏。如果它们以文件、日志和状态记录的形式存储，模型可以在中断后恢复并对其自身的执行历史进行推理。

### 案例研究：编码智能体 Harness

主流编码智能体的核心接口在 Claude Code、Codex、OpenCode 和 Cursor 风格智能体之间已经趋于稳定。它们通常使用如下循环：

![](/images/2026/harness/coding-harness-loop.png)

通过访问一组工具，编码智能体能够在给定仓库中开发和调试问题，类似于人类开发者使用 IDE 的方式。

（非全面列表；仅用于演示。如感兴趣可阅读[此内容](https://github.com/yasasbanukaofficial/claude-code)。）

| 分组 | 工具定义 |
| --- | --- |
| 文件系统 | - 文件发现：`glob`、`grep`、`ls` <br> - 文件读取：`read`、`read_many` <br> - 文件修改：`write`（全新文件）；`edit`（字符串精确匹配替换）；`multi_edit`；`apply_patch`（应用结构化补丁/差异） |
| Shell 执行 | 运行命令：`bash`、`PowerShell` |
| IO | `lsp`、git 工具如 `git_status`、`git_diff`、`git_commit` |
| 外部上下文 | MCP 工具、Skills |
| 网络搜索 | `web_search`、`web_fetch`、浏览器工具 |
| 产物 | 阅读文档、图像；生成 HTML、图像 |
| 后台进程 | 如：`CronCreate`、`CronDelete`、`CronList` |
| 智能体委派 | 如：`spawn_agent`、`resume_agent`、`wait_agent`、`list_agents`、`close_agent`、`interrupt_agent` 等 |

### Harness 层 vs 核心智能？

很难预测 RSI 的未来在多大程度上会依赖 harness 工程，但近期 RSI 的路径不太可能从模型直接重写其权重开始。我对近期实际路径的预测是：

1. Harness 工程将向元方法论方向演进（即改进获取更好答案的机制，而不仅仅是改进答案本身）。Harness 系统本身将成为优化目标，启发式规则更少，通用机制更多。
2. 反过来，成熟的 harness 使自动研究能够实现模型自我改进循环，而更智能的模型则防止 harness 过度工程化，保持系统的可持续性。

最终，许多 harness 改进可能会被*内化*到核心模型行为中，但与外部上下文和工具的接口应该保留。我们已经看到这一模式的较温和版本出现在[提示工程](https://lilianweng.github.io/posts/2023-03-15-prompt-engineering/)中：随着指令调优和模型推理的改进，手动提示技巧变得不那么核心，但*指定目标、约束、上下文和评估的需求并未消失*。

## Harness 优化

Harness 系统中优化对象的演进大致是：指令[提示](https://lilianweng.github.io/posts/2023-03-15-prompt-engineering/) → 结构化上下文 → 工作流 → harness 代码 → 优化器代码。随着模型变得更智能和强大，我们转向更复杂的目标和通用方法。

### 上下文工程

简单地将所有工具响应和模型生成追加到上下文中，随着智能体任务时间跨度的显著增加，很快就会失控。上下文管理是构建一个更结构化和简洁的 LLM 上下文并管理持久状态的层。毫无疑问，长上下文研究将持续取得进展，但目前长上下文智能和上下文工程有时会交织在一起。

**智能体上下文工程（Agentic Context Engineering, ACE）**（[Zhang et al. 2025](https://arxiv.org/abs/2510.04618)）将上下文视为一个不断演进的剧本，而不是一个越来越长的提示。它有三个组件来维护一个上下文要点的剧本，每个要点都有一个标识符和描述。

1. *生成器（Generator）*：生成任务轨迹，参考要点。
2. *反思器（Reflector）*：从成功和失败的轨迹中提炼洞察。
3. *策展人（Curator）*：用增量、条目化的更新来更新结构化上下文。

![](/images/2026/harness/ace.png)

智能体上下文工程（ACE）的框架。（图片来源：[Zhang et al. 2025](https://arxiv.org/abs/2510.04618)）

为防止迭代重写过程中的上下文崩溃和简洁性偏差，ACE 的一个关键设计选择是策展人不重写完整的提示块。相反，它输出一组结构化的、条目化的要点，形式为（标识符，描述），这些要点通过确定性逻辑合并到结构化上下文日志中。上下文项目会定期精炼和去重。

ACE 从部署中学习洞察的事实帮助我们走向自我管理记忆，但更新规则和整体工作流仍然是手工设计的。为了走向更自我改进的循环，**元上下文工程（Meta Context Engineering, MCE）**（[Ye et al. 2026](https://arxiv.org/abs/2601.21557)）将机制（如何管理上下文）与产物内容（上下文中有什么）分离，在元优化级别运行技能进化，在基础级别运行上下文优化。

MCE 技能 $s \in \mathcal{S}$ 定义了一个上下文函数 $c_s=(\rho_s,F_s)$，将输入 $x$ 映射到上下文 $c = F_s(x;\rho_s)$，其中：

* $\rho_s = \{\rho_1,\dots,\rho_m\}$ 是静态组件（提示、知识库、代码库）。
* $F_s = \{F_1,\dots,F_k\}$ 是动态操作符（搜索、选择、过滤、格式化）。

双层优化是在训练数据上找到给定技能 $s$ 的最佳上下文 $c_s^*$，而外层循环找到在验证集上提供最佳性能的最优技能：

$$
\text{Inner: }c_s^*=\arg\max_{c_s}J_\text{train}(c_s;s)\quad
\text{Outer: }s^*=\arg\max_{s\in\mathcal{S}}J_\text{val}(c_s^*)
$$

技能数据库追踪之前技能的历史、上下文函数和评估指标 $\mathcal{H}_{k-1} = \{(s_i,c_i,J_i^\text{train}, J_i^\text{val})\}_{i=1}^{k-1}$。元级别智能体对先前技能执行智能体[交叉](https://en.wikipedia.org/wiki/Crossover_(evolutionary_algorithm))以在给定任务 $\tau$ 的情况下创建新技能：$s_k=\text{crossover}(\tau,\mathcal{H}_{k-1})$。

然后基础级别上下文工程师执行技能 $s_k$ 并从部署反馈 $\mathcal{R}_k$ 中学习上下文函数，由当前技能指导：$c_k=\text{engineer}(\tau,s_k;c_{k-1}^*,\mathcal{R}_k)$。

![](/images/2026/harness/mce.png)

元上下文工程（MCE）的框架：元级别技能进化搜索上下文管理机制，而基础级别优化任务上下文。（图片来源：[Ye et al. 2026](https://arxiv.org/abs/2601.21557)）

MCE 不像 ACE 那样强制执行如何构建上下文的启发式规则。它使用*自由形式技能*来存储任务最重要的知识，并迭代地共同进化技能和技能条件上下文。在实现上，上下文函数 $c$ 实例化为专用目录中的文件集合，包括静态（`skill.md`）和动态（上下文和数据部署）组件。元级别和基础级别优化都在具有标准工具集的智能体编码环境中执行，

$$
\mathcal{T}=\{\texttt{Read},\texttt{Write},\texttt{Edit},\texttt{Bash},\texttt{Glob},\texttt{Grep},\texttt{TodoWrite}\}
$$

**元 Harness（Meta-Harness）**（[Lee et al. 2026](https://arxiv.org/abs/2603.28052)）深入另一个层次：优化的对象是*代码*，它决定和优化应该存储、检索和呈现给模型的信息。其名称中的"元"意味着它是一个用于优化 harness 的 harness。

![](/images/2026/harness/meta-harness-outer-loop.png)

Meta-Harness 外层循环优化算法。（图片来源：[Lee et al. 2026](https://arxiv.org/abs/2603.28052)）

创建新 harness 的提议者本身是一个编码智能体，最终输出是 Pareto 前沿上的 harness 候选集合。

* 整个执行历史可通过文件系统访问，因此编码智能体使用 `grep` 或 `cat` 等命令来阅读，而不是将所有内容都塞进单个提示上下文中。
* 提议的 harness 是文件系统中的一个字典，包含其自己的源代码、分数、部署轨迹和状态更新。
* 元 harness 循环迭代创建新 harness，只有合格的才会被保留。

![](/images/2026/harness/meta-harness.png)

Meta-Harness 在（左）文本分类上的性能，迭代次数较少，以及（右）TerminalBench-2。注意 TerminalBench-2 实验中的搜索是从 Terminus-KIRA 和 Terminus-2 初始化的，这两个是非常强的 harness。（图片来源：[Lee et al. 2026](https://arxiv.org/abs/2603.28052)）

尽管如此，重要的教训是明确的：一旦 harness 设计成为可执行的搜索空间，强大的编码智能体就能利用人类工程师使用的设计空间。

### 工作流设计

Harness 工程中的工作流设计可以由领域专家手工设计。以自动研究为例，各种框架已被提出和测试。**AI Scientist** 系统（[Lu et al. 2026](https://www.nature.com/articles/s41586-026-10265-5)）构建了一个流水线来提出研究想法、编写代码、运行实验、分析结果、撰写手稿并进行同行评审。[Meng et al. (2026)](https://arxiv.org/abs/2605.26340) 在 **ScientistOne** 中将可验证性作为中心设计约束，其中每个主张（引用、数值、方法论、结论）都必须追溯到证据来源，并由证据链检查进行审计。

![](/images/2026/harness/ai-scientist.png)

AI Scientist 用于想法生成、实验、论文写作和评审的流水线。（图片来源：[Lu et al. 2026](https://www.nature.com/articles/s41586-026-10265-5)）

**Autodata** 智能体（[Kulikov et al. 2026](https://arxiv.org/abs/2606.25996)）被设计为生成训练和评估数据的数据科学家。主智能体管理一个*挑战者*来提出问题、一个*弱求解器*、一个*强求解器*和一个*验证器/评判器*，旨在合成"恰到好处"难度的数据，即强求解器成功但弱求解器失败。

在 Autodata 中，挑战者提示根据求解器和验证器的反馈迭代更新。这里的限制是合成的任务用于微调弱求解器而非强求解器；如果循环不能迭代改进强模型，它更像是通过生成的提示分布进行间接蒸馏，RSI 味道较少。

![](/images/2026/harness/autodata.png)

Autodata 智能体工作流设计，围绕挑战者、求解器和验证器角色生成合成训练和评估数据。（图片来源：[Kulikov et al. 2026](https://arxiv.org/abs/2606.25996)）

工作流的设计空间*非常巨大*，自然我们可以将工作流设计视为一个搜索问题，因此应该能够通过算法而非仅手工设计来找到好的解决方案。沿着这一方向，**智能体系统自动设计（Automated Design of Agentic Systems, ADAS）**（[Hu et al. 2025](https://arxiv.org/abs/2408.08435)）将智能体设计本身公式化为一个优化问题，即"元智能体搜索"，其中元智能体提出智能体工作流的新设计。

1. 用简单智能体（如 CoT 和 self-refine）初始化一个智能体工作流存档。
2. 要求元智能体以*代码*形式编程新智能体，灵感来自存档中的现有解决方案。
   * 元智能体首先生成新工作流的高级描述，然后以代码实现。
   * 草稿程序然后经过元智能体的两个自精炼步骤（即要求模型提供反馈，然后要求同一模型根据反馈精炼之前生成的输出；[Madaan et al. 2023](https://arxiv.org/abs/2303.17651)）以检查其新颖性。
3. 评估每个新候选并将其成功添加回存档。
4. 重复步骤 2-3 直到达到最大迭代次数。

![](/images/2026/harness/adas.png)

智能体系统自动设计（ADAS）的示意图。
（图片来源：[Hu et al. 2025](https://arxiv.org/abs/2408.08435)）

**AFlow**（[Zhang et al. 2025](https://arxiv.org/abs/2410.10762)）将智能体工作流表示为图，其中节点表示调用 LLM 的动作，边在代码中实现逻辑操作。工作流优化依赖 [MCTS](https://en.wikipedia.org/wiki/Monte_Carlo_tree_search)（蒙特卡洛树搜索）：

1. 用模板在树中初始化起始工作流 $W_0$。
2. 使用分数和均匀探索的软混合选择工作流节点。
3. 通过要求 LLM 根据其评估性能生成修改后的工作流来扩展它。
4. 执行并评估新工作流。
5. 如果新工作流在 $N$ 轮预算内显示改进，则将其添加回树。
6. 重复步骤 2-5，当 top-$k$ 平均分数平稳或达到预算时停止。

![](/images/2026/harness/aflow.png)

AFlow 在工作流候选树上的优化过程。（图片来源：[Zhang et al. 2025](https://arxiv.org/abs/2410.10762)）

AFlow 在 QA、代码和数学任务中的实验表明，相比手工设计的工作流和 ADAS，AFlow 有不错的改进。

![](/images/2026/harness/aflow-exp.png)

AFlow 实验与手工方法和 ADAS 的比较。（图片来源：[Zhang et al. 2025](https://arxiv.org/abs/2410.10762)）

### 自我改进的 Harness

无论是上下文工程还是工作流设计，都只是 harness 的一部分。我们需要搜索整个设计空间，并共同优化上下文管理逻辑、工作流、权限和许多其他 harness 组件。正如我们在 Meta-Harness、ADAS 和 AFlow 等工作中看到的，**✨代码✨** 是定义程序和系统的**通用语言**。简而言之，harness 是代码，它编写了提示、工具调用、子智能体、控制流、内存和工作流逻辑如何协同工作。如果 LLM 能够优化执行智能体的代码，它就能访问一个*比手写提示大得多的设计空间*。

**自我教学优化器（Self-Taught Optimizer, STOP）**（[Zelikman et al. 2023](https://arxiv.org/abs/2310.02304)）是递归脚手架改进的早期示例之一。步骤 $t=0$ 时的种子改进器 $I_0$ 接受初始解决方案 $s$、效用函数 $u$ 和黑盒语言模型 $M$，并返回改进的解决方案 $s'$，即 $s' = I(u, s; M)$。STOP 的目标不是直接改进 $s$，而是*改进改进器 $I$ 本身*。

首先，让我们将元效用定义为给定改进器函数 $I$ 在一组下游任务 $\mathcal{D}$ 上的平均效用：

$$
\hat{u}(I) \triangleq \frac{1}{|\mathcal{D}|}\mathbb{E}_{(u,s)\sim \mathcal{D}}[u(I(u,s; M))]
$$

因为改进改进器函数本身是一个优化问题，我们可以通过自改进更新递归地基于 $I_{t-1}$ 的元效用性能度量的新版本 $I_t$：

$$
I_t=I_{t-1}(\hat{u},I_{t-1};M)
$$

![](/images/2026/harness/STOP-algo.png)

自我教学优化器（STOP）的算法。（图片来源：[Zelikman et al. 2023](https://arxiv.org/abs/2310.02304)）

在 Zelikman et al. (2023) 的实验中，改进后的改进器发现了各种策略，如遗传算法、分解和改进部分、多臂提示老虎机、模拟退火、变化温度以及束/树搜索。这类似于 harness 工作流如何被表示为优化对象。

![](/images/2026/harness/STOP-patterns.png)

STOP 发现的自我改进策略示例。（图片来源：[Zelikman et al. 2023](https://arxiv.org/abs/2310.02304)）

他们发现中一个*警示性*的结果是，STOP 使用 GPT-4 提高了跨迭代的平均下游性能，但使用较弱的模型如 GPT-3.5 和 Mixtral 时性能下降。递归结构本身是不够的。基础模型必须*足够有能力*来改进机制。这意味着 harness 改进能够更好地部署模型，但智能仍然是核心。

一个更近的工作，**Self-Harness**（[Zhang et al. 2026](https://arxiv.org/abs/2606.09498)），依赖 LLM 智能体通过提议-评估-接受循环来改进其自身的 harness。

![](/images/2026/harness/self-harness.png)

Self-Harness 使用弱点挖掘、有界 harness 提议和验证的循环来更新 harness。（图片来源：[Zhang et al. 2026](https://arxiv.org/abs/2606.09498)）

Self-Harness 中的循环有三个阶段：

1. *弱点挖掘（Weakness mining）*：将失败聚类为基于验证器的失败模式。
   * 当前 harness $h_t$ 用于评估任务并收集执行追踪进行分析。
   * 注意两次运行可能在错误日志表面共享相同的验证器结果，如超时或缺失产物，但具有不同的因果机制。因此我们需要丰富信息的失败记录，包含终端验证器级别原因、相关智能体行为的因果状态以及追踪暴露的抽象智能体机制，以发现根本原因。
2. *Harness 提议（Harness proposal）*：基于挖掘的失败模式提出有界的 harness 编辑。
   * 同一模型在 $h_t$ 下作为提议者被调用。
   * 模型被提供有界的提议上下文：(1) 当前 harness 的可编辑表面，(2) 评估系统的基于验证器的失败模式，(3) 应该保留的通过行为记录，(4) 先前尝试编辑的摘要。
   * Harness 编辑应优先处理可解决的重复错误模式（例如非任务特定难度）并能通过窄更改解决。
   * Harness 编辑候选应该不同且多样。
3. *提议验证（Proposal validation）*：验证并合并合格的编辑以创建新 harness $h_{t+1}$。
   * 候选编辑通过在 held-in $D_\text{in}$（测试弱点是否解决）和 held-out $D_\text{out}$（检查是否引入了其他未知问题）分割上的回归测试进行评估。
   * 候选编辑只有在 held-in 和 held-out 数据上都没有回归时才会被接受。
   * 接受的候选编辑被合并以更新 harness 到 $h_{t+1}$，而被拒绝的候选编辑被记录而不改变活动 harness。

在 Terminal-Bench-2 上运行 `MiniMax M2.5`、`Qwen3.5-35B-A3B` 和 `GLM-5` 时，Self-Harness 被证明能够学习针对不同基础模型的不同弱点的模型特定 harness 指令，并提高 held-out 通过率。

Self-harness 类型的工作确实引发了我的担忧：如果程序被允许编辑操作系统，抽象边界就被打破了。可编辑表面需要适当设计，权限控制和安全层需要存在于这个循环之外。围绕[奖励黑客](https://lilianweng.github.io/posts/2024-11-28-reward-hacking/)的所有挑战仍然存在。

### 进化搜索

进化搜索是一种受自然选择启发的优化方法（参见我关于[进化算法](https://lilianweng.github.io/posts/2019-09-05-evolution-strategies/)的旧文）。它通过突变解决方案并只保留群体中"适应度"高的那些来进化一个解决方案群体。当 (1) 搜索空间广泛或形状怪异；以及 (2) 难以用梯度直接优化但容易评估解决方案时，进化搜索很有用。Harness 搜索似乎很适合这里。

进化搜索已在过去的研究中用于提示工程。**Promptbreeder**（[Fernando et al. 2023](https://arxiv.org/abs/2309.16797)）通过丰富的突变操作集合优化任务特定提示，有趣的是突变提示（即指示 LLM 突变任务提示的指令）本身也通过进化改进。**GEPA**（[Agrawal et al. 2025](https://arxiv.org/abs/2507.19457)）将[反思](https://lilianweng.github.io/posts/2023-06-23-agent/#self-reflection)式提示与进化搜索结合，使用对试错轨迹的自然语言反思来提出提示更新。

[Novikov et al. (2025)](https://arxiv.org/abs/2506.13131) 将 **AlphaEvolve** 介绍为编码智能体进化搜索系统，它存储候选程序池并提示冻结的 LLM 生成改进的差异。随着系统反复评估子程序并保留成功的那些，它随时间发现更好的解决方案。

![](/images/2026/harness/alphaevolve.png)

AlphaEvolve 的工作原理。（图片来源：[Novikov et al. 2025](https://arxiv.org/abs/2506.13131)）

AlphaEvolve 设计中有几个细节很重要：

* 提示包括父程序、结果、指令，有时还有元信息。
* 编码智能体可以访问完整仓库，但改进的代码区域用 `# EVOLVE-BLOCK-START` 和 `# EVOLVE-BLOCK-END` 明确标记。
* 元提示与指令和上下文共同进化，由 LLM 建议，类似于我们如何进化解决方案程序。

消融实验显示了进化过程、提示中的上下文、元提示、全文件进化以及使用更强 LLM 的价值。

![](/images/2026/harness/alphaevolve-plot.png)

消融实验显示了 AlphaEvolve 中多个设计的价值。（图片来源：[Novikov et al. 2025](https://arxiv.org/abs/2506.13131)）

最近的变体如 **ThetaEvolve**（[Wang et al. 2025](https://arxiv.org/abs/2511.23473)）将进化搜索与 RL 和上下文学习结合。另一方面，**ShinkaEvolve**（[Lange et al. 2025](https://arxiv.org/abs/2509.19349)）引入了三个新组件来改进 LLM 采样效率：

* 通过设计父采样来平衡性能排名和后代数量，实现更样本高效的探索。
* 基于代码新颖性的拒绝采样，基于嵌入余弦相似度丢弃与现有群体过于相似的候选。
* 在元草稿中识别成功解决方案中的好模式，以指导未来突变。

与上述专注于解决方案改进的方法不同，**Darwin Gödel Machine**（DGM；[Zhang et al. 2025](https://arxiv.org/abs/2505.22954)）明确针对可编辑 harness 代码仓库的进化，使用基于 LLM 的编码智能体。精确地说，这个智能体被允许修改其自身的 harness。关于 Hyperagents 的后续工作（[Zhang et al. 2026](https://arxiv.org/abs/2603.19461)）引入了元智能体来控制如何修改现有任务智能体以创建新智能体。

1. 从池中一个编码智能体开始。
2. 每次迭代中，以与其性能成正比、与其已有子代数量成反比的概率选择一个父代，修改并分支产生新智能体。
3. 选定的父智能体检查其自身的基准评估日志，然后提议改进其自身的 harness 代码库以生成编码智能体的新版本。代码编辑通过两个基本工具实现：(1) bash（参数：`<bash_command>`）和 (2) 编辑器（参数：`view/create/edit <file_path>`）。
4. 评估新编码智能体，只有性能足够高的才会被添加回池中。
5. 重复步骤 2-4 直到达到某些停止标准。

DGM 是在固定模型下的 harness 进化。在使用 `Claude 3.5 Sonnet` 作为基础 LLM 和简单初始 harness 配置的实验中，DGM 发现的智能体在 SWE-bench Verified（20% 到 50%）和 Polyglot（14.2% 到 30.7%）上达到或超过手工设计的智能体。

这类方法族在候选解决方案可自动评估且候选适应度易于量化时表现良好，如矩阵乘法、GPU 内核优化、算法竞赛、数据中心调度。它在评估缓慢、模糊或主要基于启发式的领域表现挣扎。进化的计算效率和有效性也是关注的问题。

### 与模型权重的联合优化

Harness 进化改变模型周围的非参数系统。为了实现完整的自我改进，模型完全可以被允许同时更新自身的权重。权重更新可以通过训练流水线的改进或测试时的持续学习来实现。持续学习的主题值得未来单独写一篇文章。

**SIA**（[Hebbar et al. 2026](https://arxiv.org/abs/2605.27276)）是结合 harness 改进和模型参数更新在同一优化循环中的早期尝试，设计中有三个组件：

* *元智能体（Meta-Agent）*：提议初始 harness。
* *任务特定智能体（Task-Specific Agent）*：执行任务。
* *反馈智能体（Feedback-Agent）*：根据最近轨迹选择更新 harness 还是模型权重。

![](/images/2026/harness/SIA.png)

SIA 中的反馈智能体决定下一次迭代类型。（图片来源：[Hebbar et al. 2026](https://arxiv.org/abs/2605.27276)）

SIA 实验中有一些混淆的选择使结果难以解释。例如，任务特定智能体比用于元智能体和反馈智能体的模型弱得多（`gpt-oss-120b` vs `Claude Sonnet 4.6`），且基线太弱，无法与相关方法进行清晰的交叉引用。我认为这个方向很有趣，但证据是暂时的。然而许多挑战，如训练稳定性和古德哈特定律效应，仍然是开放问题。

## 未来挑战

AI Scientist 系列工作是专家设计 harness 能够协调大部分自动研究循环的有力证明，以撰写研究论文的形式进行实验。但论文产出并不等同于科学发现。一个系统可以写出看似合理的稿件，同时仍然存在伪造引用、实现漂移或实验结果薄弱的问题。

[Trehan & Chopra (2026)](https://arxiv.org/abs/2601.03315) 测试了 LLM 是否能从研究想法到论文，只需最少的脚手架和基本工具（即 `read_file`、`write_file`、`llm_search`、`list_files`）。每个想法都有一个专用工作空间，智能体可以在其中生成和阅读文档作为上下文的一部分。他们在三个领域（世界模型、多智能体 RL、AI 安全与对齐）进行实验，每个领域包含 45-50 个高质量种子文档来激发新想法。只有四个想法被人类专家选中运行完整流水线，只有一个被完全执行为论文。他们在实验中观察到六种反复出现的失败模式：

* *偏向训练数据默认值*：使用旧库、过时命令、标准格式或基于实际仓库或数据集不成立的假设。
* *执行压力下的实现漂移*：当实现变得技术复杂时，模型可能转向常见的更简单解决方案而非提议的方法。
* *记忆和上下文退化*：长程项目除非日志作为持久产物写入，否则会丢失关键细节。
* *过度乐观*：模型尽管实验有噪声或失败仍宣布成功，类似 [Bubeck et al. (2025)](https://arxiv.org/abs/2511.16072) 观察到的"p-hacking 和 eureka-ing"模式，模型可以引入"数字胶带"并在信号仍是噪声时宣布胜利。
* *领域智能不足*：模型缺乏隐性工艺知识，例如预测实现复杂度、判断实验结果是否合理，或知道哪些基线重要。
* *科学品味薄弱*：实验可能可执行但未能回答正确的问题。

迈向完整 RSI，研究人员已取得真正进展，但几个瓶颈仍然存在。

**1. 薄弱且模糊的评估器。** 许多研究主张没有快速精确的验证器，许多现实世界任务也是如此。当前自我改进循环在评估指标可测量且客观的任务上效果最好，类似于[RL 的工作原理](https://lilianweng.github.io/posts/2018-02-19-rl-overview/)。

研究品味、新颖性和长期科学价值更难衡量。例如，研究品味通常混合问题框架、实验设计和关于哪些惊人结果值得追求、哪些失败案例值得重试的判断。

**2. 上下文和记忆生命周期。** 随着 AI 智能体变得更加自主和独立，记忆不断增长。一个有用的 harness 需要管理上下文和记忆，以补充长上下文生成的现有局限，同时仍最大化长程任务的成功率。由于人类能够在一生中维持记忆，我看到一个类比，即[上下文工程](#context-engineering)将且应该成为智能的核心部分，而非停留在软件系统层。

**3. 负面结果。** 研究人员被激励发表成功结果，因此文献偏向成功。在大量数据（至少目前主要是人类创造的，哈哈）上训练的 LLM 可能不擅长决定何时放弃假设、报告负面结果，甚至承认失败，因为数据中成功与失败案例的不平衡。研究 harness 应该使失败尝试易于保留，因为从失败中学习是修剪任务搜索空间的最佳方式。

**4. 多样性崩溃。** 进化和 RL 循环倾向于利用已知的高奖励模式。我们需要[机制](https://lilianweng.github.io/posts/2020-06-07-exploration-drl/)来防止群体崩溃为同一解决方案的变体。这对于开放式研究尤其关键，其中最佳路径在当前评估器下可能最初看起来更糟。

**5. [奖励黑客](https://lilianweng.github.io/posts/2024-11-28-reward-hacking/)。** 自我改进循环优化它获得的任何信号。如果奖励来自单元测试，智能体可能过拟合到测试；如果来自评判模型，它可能学习特定于该评判的奖励黑客技巧；如果来自基准分数，它可能利用基准工件。

评估器和权限控制应该可能位于进化 harness 的循环之外，在重要的决策点设置 held-out 测试、追踪审计和人类审查—— oversight 能多大程度扩展和自动化仍是一个开放的研究领域。

**6. 长期成功。** 一个外在优化循环作用于我们可以在训练沙箱中模拟的单个部署之外的奖励。

以编码智能体为例。编码智能体已经提高了软件工程的日常生产力，但许多优化目标仍然过于短期。它通常能完成手头的任务，但不太明显的是它应该如何保护由数百或数千工程师共同维护的仓库的长期健康。基于标准沙箱的 RLVR 风格训练很少捕捉到可维护性、所有权边界、迁移成本、向后兼容性或未来调试负担。

**7. 人类的角色。** 人类应该向更高层次移动，而非被移除出循环，意味着人类应在正确的时间、正确的抽象层次提供 oversight，我们的系统设计应考虑何时以及如何设置这样的接触点。

上面列出的许多挑战需要人类的反馈和引导。毕竟，我们正在为人类更美好的未来构建技术，而非相反。

## 引用

请引用本文：

> Weng, Lilian. "Harness Engineering for Self-Improvement". Lil'Log (Jul 2026). https://lilianweng.github.io/posts/2026-07-04-harness/

或使用 BibTeX 引用：

```
@article{weng2026harness,
  title = {Harness Engineering for Self-Improvement},
  author = {Weng, Lilian},
  journal = {lilianweng.github.io},
  year = {2026},
  month = {July},
  url = "https://lilianweng.github.io/posts/2026-07-04-harness/"
}
```

## 附录：一些有用的基准

* **[PaperBench](https://arxiv.org/abs/2504.01848)**：从零开始复现 20 篇 ICML 2024 Spotlight 和 Oral 论文，包括理解论文贡献、开发代码库和成功执行实验。
  + 每个复现任务被分解为更小的、可单独评分的任务。
  + 总共 8,316 个评分标准，与论文作者共同开发。
  + 当时的最佳模型（`Claude 3.5 Sonnet`，~21%）不如 ML 博士生。
  + 包括 PaperBench、PaperBench Code-Dev（轻量版）和 JudgeEval。
* **[CORE-Bench](https://arxiv.org/abs/2409.11363)**：评估已发表研究的计算可复现性。
  + 基于计算机科学、社会科学和医学 90 篇科学论文的 270 个任务。
  + 任务涉及从提供的代码和数据复现结果。
  + 包括多个难度级别和仅语言及视觉-语言任务。
  + 当时报告的最佳智能体（`GPT-4o` 和 `GPT-4o-mini`）在最困难任务上仅达到 21% 准确率。
* **[ScienceAgentBench](https://arxiv.org/abs/2410.05080)**：评估 LLM 智能体在数据驱动科学发现方面的能力。
  + 从四个学科（数学、化学、生物、地理）44 篇同行评审出版物中提取 102 个任务。
  + 涵盖这些领域的基本数据科学任务：数据处理、模型开发、数据分析和信息可视化。
* **[RE-Bench](https://arxiv.org/abs/2411.15114)**：在真实 ML 研究工程环境中评估前沿 AI 智能体并与人类专家对比。
  + 7 个具有挑战性的、开放式的 ML 研究工程环境。
  + 每个环境 =（评分函数、起始解决方案、参考解决方案）；每个可用 8 个或更少 H100 GPU 运行。
  + 示例：优化内核、运行缩放律实验、修复嵌入、微调 GPT-2 用于 QA 等。
  + 包括 61 位不同人类专家 71 次八小时尝试的数据。
  + 人类专家在 82% 的八小时尝试中获得非零分数；24% 达到或超过强参考解决方案。
  + 最佳 AI 智能体在 2 小时预算下得分比人类高 4 倍，但人类对更长预算的回报更好，在 8 小时和 32 小时设置中超过智能体。
* **[MLE-bench](https://arxiv.org/abs/2410.07095)**：在离线 Kaggle 竞赛中评估 ML 工程智能体。
  + 包含从 Kaggle 整理的 75 个 ML 工程竞赛。
  + 测试训练模型、准备数据集、运行实验和提交预测到评分脚本。
  + 使用 Kaggle 公共排行榜作为人类基线。
  + 论文中最佳设置，`o1-preview` 配合 AIDE 脚手架，在 16.9% 的竞赛中达到至少 Kaggle 铜牌水平。
  + 包括资源扩展和污染分析。
* **[KernelBench](https://arxiv.org/abs/2502.10517)**：评估生成 GPU 内核的正确性和速度。
  + 250 个 PyTorch 任务来评估 LLM 是否能编写快速且正确的内核。
  + 评估指标 fast_p = 正确且比基线更快的生成内核的百分比。

## 参考文献

[1] Good, I. J. ["Speculations Concerning the First Ultraintelligent Machine."](https://philpapers.org/rec/GOOSCT) *Advances in Computers*, 6:31–88, 1965.

[2] Yudkowsky, Eliezer. ["Recursive Self-Improvement."](https://www.lesswrong.com/posts/JBadX7rwdcRFzGuju/recursive-self-improvement) LessWrong, 2008.

[3] Choi, et al. ["Anchored Self-Play for Code Repair."](https://openreview.net/forum?id=lTbBFAoPSA) ICML 2026.

[4] Zhao, et al. ["Absolute Zero: Reinforced Self-play Reasoning with Zero Data."](https://arxiv.org/abs/2505.03335) arXiv preprint arXiv:2505.03335, 2025.

[5] Yuan, et al. ["Self-Rewarding Language Models."](https://arxiv.org/abs/2401.10020) arXiv preprint arXiv:2401.10020, 2024.

[6] Chen, et al. ["Self-Play Fine-Tuning Converts Weak Language Models to Strong Language Models."](https://arxiv.org/abs/2401.01335) ICML 2024.

[7] Zhang, et al. ["Agentic Context Engineering: Evolving Contexts for Self-Improving Language Models."](https://arxiv.org/abs/2510.04618) ICLR 2026.

[8] Ye, et al. ["Meta Context Engineering via Agentic Skill Evolution."](https://arxiv.org/abs/2601.21557) arXiv preprint arXiv:2601.21557, 2026.

[9] Lee, et al. ["Meta-Harness: End-to-End Optimization of Model Harnesses."](https://arxiv.org/abs/2603.28052) arXiv preprint arXiv:2603.28052, 2026.

[10] Lu, et al. ["Towards end-to-end automation of AI research."](https://www.nature.com/articles/s41586-026-10265-5) *Nature*, 651:914–919, 2026.

[11] Meng, et al. ["ScientistOne: Towards Human-Level Autonomous Research via Chain-of-Evidence."](https://arxiv.org/abs/2605.26340) arXiv preprint arXiv:2605.26340, 2026.

[12] Kulikov, et al. ["Autodata: An agentic data scientist to create high quality synthetic data."](https://arxiv.org/abs/2606.25996) arXiv preprint arXiv:2606.25996, 2026.

[13] Hu, Lu, and Clune. ["Automated Design of Agentic Systems."](https://arxiv.org/abs/2408.08435) ICLR 2025.

[14] Madaan, et al. ["Self-Refine: Iterative Refinement with Self-Feedback."](https://arxiv.org/abs/2303.17651) NeurIPS 2023.

[15] Zhang, et al. ["AFlow: Automating Agentic Workflow Generation."](https://arxiv.org/abs/2410.10762) ICLR 2025.

[16] Zelikman, et al. ["Self-Taught Optimizer (STOP): Recursively Self-Improving Code Generation."](https://arxiv.org/abs/2310.02304) COLM 2024.

[17] Zhang, et al. ["Self-Harness: Harnesses That Improve Themselves."](https://arxiv.org/abs/2606.09498) arXiv preprint arXiv:2606.09498, 2026.

[18] Fernando, et al. ["Promptbreeder: Self-Referential Self-Improvement Via Prompt Evolution."](https://arxiv.org/abs/2309.16797) arXiv preprint arXiv:2309.16797, 2023.

[19] Agrawal, A. et al. ["GEPA: Reflective Prompt Evolution Can Outperform Reinforcement Learning."](https://arxiv.org/abs/2507.19457) arXiv preprint arXiv:2507.19457, 2025.

[20] Novikov, et al. ["AlphaEvolve: A coding agent for scientific and algorithmic discovery."](https://arxiv.org/abs/2506.13131) arXiv preprint arXiv:2506.13131, 2025.

[21] Lange, Imajuku, and Cetin. ["ShinkaEvolve: Towards Open-Ended And Sample-Efficient Program Evolution."](https://arxiv.org/abs/2509.19349) arXiv preprint arXiv:2509.19349, 2025.

[22] Wang, et al. ["ThetaEvolve: Test-time Learning on Open Problems."](https://arxiv.org/abs/2511.23473) arXiv preprint arXiv:2511.23473, 2025.

[23] Zhang, et al. ["Darwin Gödel Machine: Open-Ended Evolution of Self-Improving Agents."](https://arxiv.org/abs/2505.22954) arXiv preprint arXiv:2505.22954, 2025.

[24] Zhang, et al. ["Hyperagents."](https://arxiv.org/abs/2603.19461) arXiv preprint arXiv:2603.19461, 2026.

[25] Yuksekgonul, et al. ["Learning to Discover at Test Time."](https://arxiv.org/abs/2601.16175) arXiv preprint arXiv:2601.16175, 2026.

[26] Riaz, et al. ["Epistemic Uncertainty for Test-Time Discovery."](https://arxiv.org/abs/2605.11328) arXiv preprint arXiv:2605.11328, 2026.

[27] Hebbar, et al. ["SIA: Self Improving AI with Harness & Weight Updates."](https://arxiv.org/abs/2605.27276) arXiv preprint arXiv:2605.27276, 2026.

[28] Trehan and Chopra. ["Why LLMs Aren't Scientists Yet: Lessons from Four Autonomous Research Attempts."](https://arxiv.org/abs/2601.03315) arXiv preprint arXiv:2601.03315, 2026.

[29] Bubeck, et al. ["Early science acceleration experiments with GPT-5."](https://arxiv.org/abs/2511.16072) arXiv preprint arXiv:2511.16072, 2025.

[30] Starace, et al. ["PaperBench: Evaluating AI's Ability to Replicate AI Research."](https://arxiv.org/abs/2504.01848) ICML 2025.

[31] Wijk, et al. ["RE-Bench: Evaluating frontier AI R&D capabilities of language model agents against human experts."](https://arxiv.org/abs/2411.15114) ICML 2025.

[32] Chan, et al. ["MLE-bench: Evaluating Machine Learning Agents on Machine Learning Engineering."](https://arxiv.org/abs/2410.07095) arXiv preprint arXiv:2410.07095, 2024.

[33] Chen, et al. ["ScienceAgentBench: Toward Rigorous Assessment of Language Agents for Data-Driven Scientific Discovery."](https://arxiv.org/abs/2410.05080) ICLR 2025.

[34] Siegel, et al. ["CORE-Bench: Fostering the Credibility of Published Research Through a Computational Reproducibility Agent Benchmark."](https://arxiv.org/abs/2409.11363) TMLR 2024.

[35] Ouyang, et al. ["KernelBench: Can LLMs Write Efficient GPU Kernels?"](https://arxiv.org/abs/2502.10517) arXiv preprint arXiv:2502.10517, 2025.
