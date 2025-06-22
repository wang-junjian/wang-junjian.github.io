---
layout: single
title:  "人工智能时代的软件 (Software in the era of AI) - Andrej Karpathy"
date:   2025-06-22 08:00:00 +0800
categories: Software3.0 AndrejKarpathy
tags: [Software3.0, AndrejKarpathy, LLM, 智能体, 人工智能, 软件开发]
---

主要介绍了软件开发领域正在经历的**重大变革**，将其分为**软件1.0**（传统手工编码）、**软件2.0**（基于神经网络权重训练）和**软件3.0**（通过自然语言提示编程大型语言模型）。演讲者将大型语言模型（LLMs）比作**新型操作系统**和**基础设施**，指出它们既具备公用事业的性质（按量付费、集中式），也展现出类似芯片制造厂和操作系统的特征，且目前仍处于**早期阶段**（类似于1960年代的计算）。进一步探讨了LLMs的**认知特性**（如广博知识、幻觉、记忆局限），并强调了开发**部分自主应用**的重要性，这些应用能让人类通过**图形用户界面**和**自主性滑块**有效监督AI。最后，演讲者提出，随着自然语言编程的兴起，**人人皆可编程**，并呼吁开发者为**智能体**优化数字基础设施和文档，预示着一个由人类与AI协作构建的 **“钢铁侠战衣”式未来**。

<!--more-->

## Software is changing. (again)

![](/images/2025/AndrejKarpathy/SoftwareIsChanging(Again)/01.jpg)

### Map of GitHub

**Map of GitHub** 是一个创新的数据可视化项目，旨在以交互式地图的形式展示 GitHub 上的开源项目生态。该项目由开发者 Anvaka 创建，通过复杂的算法和可视化技术，将超过 400,000 个 GitHub 仓库以节点和连接的形式呈现，帮助用户探索项目之间的关联、技术趋势以及开源社区的演变。

![](/images/2025/AndrejKarpathy/SoftwareIsChanging(Again)/02.jpg)

### Software 2.0

![](/images/2025/AndrejKarpathy/SoftwareIsChanging(Again)/03.jpg)

![](/images/2025/AndrejKarpathy/SoftwareIsChanging(Again)/04.jpg)

### Software 3.0

![](/images/2025/AndrejKarpathy/SoftwareIsChanging(Again)/05.jpg)

![](/images/2025/AndrejKarpathy/SoftwareIsChanging(Again)/06.jpg)

![](/images/2025/AndrejKarpathy/SoftwareIsChanging(Again)/07.jpg)

![](/images/2025/AndrejKarpathy/SoftwareIsChanging(Again)/08.jpg)

![](/images/2025/AndrejKarpathy/SoftwareIsChanging(Again)/09.jpg)

![](/images/2025/AndrejKarpathy/SoftwareIsChanging(Again)/10.jpg)

## Part 1: 如何思考 LLM

![](/images/2025/AndrejKarpathy/SoftwareIsChanging(Again)/11.jpg)

![](/images/2025/AndrejKarpathy/SoftwareIsChanging(Again)/12.jpg)

### LLM 具有公用事业的特性

![](/images/2025/AndrejKarpathy/SoftwareIsChanging(Again)/13.jpg)

| 英文 | 中文 |
| :--- | :--- |
| CAPEX to train an LLM (~= to build the grid) | 训练 LLM 的资本支出 (CAPEX)（≈ 建设电网） |
| OPEX to serve intelligence over increasingly homogeneous API (prompt, image, tools, ...) | 通过日益同质化的 API（提示、图像、工具等）提供智能的运营支出 (OPEX) |
| Metered access ($/1M tokens) | 按使用量计费（每百万 Token 1 美元） |
| Demand for low latency, high uptime, consistent quality (~= demanding consistent voltage from grid) | 对低延迟、高正常运行时间、一致质量的需求（≈ 要求电网提供一致的电压） |
| OpenRouter ~= Transfer Switch (grid, solar, battery, generator...) | OpenRouter ≈ 传输开关（电网、太阳能、电池、发电机...） |
| Intelligence "brownouts" e.g. when OpenAI goes down. | 智能“限电”（brownouts），例如当 OpenAI 宕机时 |

### LLM 具有晶圆厂的特性

![](/images/2025/AndrejKarpathy/SoftwareIsChanging(Again)/14.jpg)

| 英文 | 中文 |
| :--- | :--- |
| Huge CAPEX | 巨额资本支出 (CAPEX) |
| Deep tech tree R&D, secrets | 深度技术树研发，秘密 |
| 4nm process node ~= 10^20 FLOPS cluster | 4纳米工艺节点 ≈ 10^20 FLOPS 计算集群 |
| Anyone training on NVIDIA GPUs ~= fabless | 任何使用 NVIDIA GPU 训练的人 ≈ 无晶圆厂 |
| Google training on TPUs ~= owns fab (e.g. Intel) | 谷歌在 TPU 上训练 ≈ 拥有晶圆厂（例如英特尔） |
| e.g. xAI Colossus cluster (100K H100 GPUs) | 例如：xAI Colossus 集群 (10万块 H100 GPU) |

### LLM 具有操作系统的特性

![](/images/2025/AndrejKarpathy/SoftwareIsChanging(Again)/15.jpg)

| 英文 | 中文 |
| :--- | :--- |
| LLMs are increasingly complex software ecosystems, not simple commodities like electricity. | LLM 是日益复杂的软件生态系统，而非像电力一样的简单商品。 |
| LLMs are Software. Trivial to copy & paste, manipulate, change, distribute, open source, steal..., not physical infrastructure. | LLM 是软件。易于复制和粘贴、操作、更改、分发、开源、窃取...，而非物理基础设施。 |
| Some amount of switching friction due to different features, performance, style, capabilities etc. per domain. | 由于不同领域的功能、性能、风格、能力等差异，存在一定的切换摩擦。 |
| System/user (prompt) space ~= kernel/user (memory) space | 系统/用户（提示）空间 ≈ 内核/用户（内存）空间 |

### LLM OS

![](/images/2025/AndrejKarpathy/SoftwareIsChanging(Again)/16.jpg)

* **Peripheral devices I/O (外围设备输入/输出)**：
    * **video (视频)**：可能指视频输入/输出功能，比如处理图像或视频数据。
    * **audio (音频)**：可能指音频输入/输出功能，比如语音识别或语音合成。
* **CPU**：在这里被LLM取代，或者说LLM扮演了传统CPU的角色，作为系统的核心处理单元。
    * **LLM (大型语言模型)**：系统的核心。
    * **RAM (内存)**：与LLM紧密相连，代表LLM的短期记忆。
        * **context window (上下文窗口)**：RAM中的一部分，是LLM当前处理信息的“工作区”，它的大小限制了LLM一次性可以处理的上下文信息量。
* **Software 1.0 tools "classical computer" (1.0版本软件工具“经典计算机”)**：
    * **Calculator (计算器)**：用于数学计算。
    * **Python interpreter (Python解释器)**：用于执行Python代码。
    * **Terminal (终端)**：命令行界面。
* **Disk (磁盘)**：
    * **File system (+embeddings)**：
        * 用于存储数据和文件。
        * “+embeddings”可能意味着文件系统不仅存储原始数据，还存储这些数据的向量嵌入（embeddings），以便LLM能更高效地理解和检索信息。
* **Ethernet (以太网)**：代表网络连接，允许LLM与外部世界通信。
    * **Browser (浏览器)**：LLM可以通过浏览器访问互联网信息。
    * **Other LLMs (其他大型语言模型)**：LLM可以与其他LLM进行交互，可能用于协同工作或获取不同来源的信息。

![](/images/2025/AndrejKarpathy/SoftwareIsChanging(Again)/17.jpg)

![](/images/2025/AndrejKarpathy/SoftwareIsChanging(Again)/18.jpg)

**1950年代 - 1970年代 分时时代**

我们正处于大型机和分时计算时代。
集中式、昂贵的计算机 =>

- 操作系统在云端运行
- 输入/输出通过网络来回传输
- 计算是按用户批处理的

![](/images/2025/AndrejKarpathy/SoftwareIsChanging(Again)/19.jpg)

![](/images/2025/AndrejKarpathy/SoftwareIsChanging(Again)/20.jpg)

![](/images/2025/AndrejKarpathy/SoftwareIsChanging(Again)/21.jpg)

![](/images/2025/AndrejKarpathy/SoftwareIsChanging(Again)/22.jpg)

## Part 2: LLM 心理学

![](/images/2025/AndrejKarpathy/SoftwareIsChanging(Again)/23.jpg)

![](/images/2025/AndrejKarpathy/SoftwareIsChanging(Again)/24.jpg)

![](/images/2025/AndrejKarpathy/SoftwareIsChanging(Again)/25.jpg)

![](/images/2025/AndrejKarpathy/SoftwareIsChanging(Again)/26.jpg)

![](/images/2025/AndrejKarpathy/SoftwareIsChanging(Again)/27.jpg)

![](/images/2025/AndrejKarpathy/SoftwareIsChanging(Again)/28.jpg)

![](/images/2025/AndrejKarpathy/SoftwareIsChanging(Again)/29.jpg)

![](/images/2025/AndrejKarpathy/SoftwareIsChanging(Again)/30.jpg)

![](/images/2025/AndrejKarpathy/SoftwareIsChanging(Again)/31.jpg)

## Part 3: 机遇

![](/images/2025/AndrejKarpathy/SoftwareIsChanging(Again)/32.jpg)

![](/images/2025/AndrejKarpathy/SoftwareIsChanging(Again)/33.jpg)

![](/images/2025/AndrejKarpathy/SoftwareIsChanging(Again)/34.jpg)

![](/images/2025/AndrejKarpathy/SoftwareIsChanging(Again)/35.jpg)

![](/images/2025/AndrejKarpathy/SoftwareIsChanging(Again)/36.jpg)

![](/images/2025/AndrejKarpathy/SoftwareIsChanging(Again)/37.jpg)

![](/images/2025/AndrejKarpathy/SoftwareIsChanging(Again)/38.jpg)

![](/images/2025/AndrejKarpathy/SoftwareIsChanging(Again)/39.jpg)

![](/images/2025/AndrejKarpathy/SoftwareIsChanging(Again)/40.jpg)

![](/images/2025/AndrejKarpathy/SoftwareIsChanging(Again)/41.jpg)

![](/images/2025/AndrejKarpathy/SoftwareIsChanging(Again)/42.jpg)

![](/images/2025/AndrejKarpathy/SoftwareIsChanging(Again)/43.jpg)

![](/images/2025/AndrejKarpathy/SoftwareIsChanging(Again)/44.jpg)

![](/images/2025/AndrejKarpathy/SoftwareIsChanging(Again)/45.jpg)

![](/images/2025/AndrejKarpathy/SoftwareIsChanging(Again)/46.jpg)

![](/images/2025/AndrejKarpathy/SoftwareIsChanging(Again)/47.jpg)

![](/images/2025/AndrejKarpathy/SoftwareIsChanging(Again)/48.jpg)

### Vibe coding（氛围编码）

![](/images/2025/AndrejKarpathy/SoftwareIsChanging(Again)/49.jpg)

有一种新的编码方式我称之为“氛围编码”（vibe coding），你完全沉浸在氛围中，拥抱指数级增长，并且忘记了代码的存在。这之所以可能，是因为大型语言模型（LLM）（例如 Cursor Composer w Sonnet）变得太好了。我还与 Composer 使用 SuperWhisper 对话，所以我几乎都不碰键盘。我问一些最蠢的事情，比如“将侧边栏的填充减少一半”，因为我懒得找它。我总是“接受所有”，我不再阅读差异。当我收到错误消息时，我只是复制粘贴它们，不加评论，通常就能解决。代码的增长超出了我通常的理解范围，我需要真正阅读一段时间。有时 LLM 无法修复 bug，所以我只是绕开它，或者要求随机更改，直到它消失。这对于一次性项目来说还不错，但仍然相当有趣。我正在构建一个项目或网络应用，但这并不是真正的编码——我只是看东西，说东西，运行东西，复制粘贴东西，而且它大部分都能工作。

![](/images/2025/AndrejKarpathy/SoftwareIsChanging(Again)/50.jpg)

![](/images/2025/AndrejKarpathy/SoftwareIsChanging(Again)/51.jpg)

![](/images/2025/AndrejKarpathy/SoftwareIsChanging(Again)/52.jpg)

![](/images/2025/AndrejKarpathy/SoftwareIsChanging(Again)/53.jpg)

![](/images/2025/AndrejKarpathy/SoftwareIsChanging(Again)/54.jpg)

![](/images/2025/AndrejKarpathy/SoftwareIsChanging(Again)/55.jpg)

![](/images/2025/AndrejKarpathy/SoftwareIsChanging(Again)/56.jpg)

**数字信息的新型消费者/操作者：**

1.  人类 (图形用户界面 GUI)
2.  计算机 (应用程序接口 API)
3.  **新增：** 代理程序 <- 计算机... 但类似人类

![](/images/2025/AndrejKarpathy/SoftwareIsChanging(Again)/57.jpg)

![](/images/2025/AndrejKarpathy/SoftwareIsChanging(Again)/58.jpg)

### Docs for LLMs

![](/images/2025/AndrejKarpathy/SoftwareIsChanging(Again)/59.jpg)

![](/images/2025/AndrejKarpathy/SoftwareIsChanging(Again)/60.jpg)

### Actions for LLMs

![](/images/2025/AndrejKarpathy/SoftwareIsChanging(Again)/61.jpg)

### Context builders: Gitingest

![](/images/2025/AndrejKarpathy/SoftwareIsChanging(Again)/62.jpg)

### Context builders: DeepWiki

![](/images/2025/AndrejKarpathy/SoftwareIsChanging(Again)/63.jpg)

![](/images/2025/AndrejKarpathy/SoftwareIsChanging(Again)/64.jpg)

![](/images/2025/AndrejKarpathy/SoftwareIsChanging(Again)/65.jpg)


## 参考资料
- [Andrej Karpathy: Software Is Changing (Again)](https://www.youtube.com/watch?v=LCEmiRjPEtQ)
