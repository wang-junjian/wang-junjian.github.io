---
layout: post
title:  "LLM 的合成数据"
date:   2024-09-28 08:00:00 +0800
categories: Synthetic LLM
tags: [Synthetic, Cosmopedia, Phi, distilabel, argilla, datatrove, nanotron, lighteval, LLM]
---

## [Cosmopedia: 如何为预训练构建大规模合成数据集](https://huggingface.co/blog/zh/cosmopedia)
本文档的专注点是如何将样本从 `几千` 扩展到 `数百万`，从而使其可用于 `从头开始预训练 LLM`。深入研究了创建数据集的方法、提示整编的方法及相应的技术栈。

### Cosmopedia
Cosmopedia 的目的是重现 Phi-1.5 所使用的训练数据。

- [Cosmopedia 代码](https://github.com/huggingface/cosmopedia)
- [Cosmopedia 数据集](https://huggingface.co/datasets/HuggingFaceTB/cosmopedia)
- [cosmo-1b 模型](https://huggingface.co/HuggingFaceTB/cosmo-1b)
- 微软 Phi 系列模型（推动了合成数据领域的发展）
    - [Phi-1: Textbooks Are All You Need](https://arxiv.org/abs/2306.11644)
    - [Phi-1.5: Textbooks Are All You Need II: phi-1.5 technical report](https://arxiv.org/abs/2309.05463)
    - [Phi-2: The surprising power of small language models](https://www.microsoft.com/en-us/research/blog/phi-2-the-surprising-power-of-small-language-models/)

围绕在 Phi 数据集上的谜团除了我们对其如何创建的不甚了了之外，还有一个问题是其数据集的生成使用的是私有模型。为了解决这些问题，我们引入了 Cosmopedia，这是由 [Mixtral-8x7B-Instruct-v0.1](https://huggingface.co/mistralai/Mixtral-8x7B-Instruct-v0.1) 生成的包含教科书、博文、故事、帖子以及 WikiHow 文章等各种体裁的合成数据集。其中有超过 3000 万个文件、250 亿个词元，是迄今为止最大的开放合成数据集。

实际上 Cosmopedia 的大部分时间都花在了细致的提示词工程上了。

#### 提示策划
**用于构建 Cosmopedia 提示的数据源分布 (左图) 以及“精选源”子集中的源分布 (右图)**：

![](/images/2024/SyntheticData/piecharts.png)

**为`少儿`、`专业人士和研究人员`以及`高中生`生成相同主题的教科书的提示**：

![](/images/2024/SyntheticData/textbooks.png)

- 提示
    - 为一本关于“为什么去太空？”的教科书写一篇详细的课程单元。面向（`少儿` / `专业人士和研究人员` / `高中生`）
    - 我们目前正在编写第一章：“1. 引言”。你将编写本章的第一个子单元。写一个标题为“1.1. 为什么我们花费数十亿美元探索太空？”的新子单元，同时尽量做到：
- 生成提示的三个主要目标受众是：
    - yong children (少儿)
        - 记住这个单元是为儿童书籍准备的，所以使用非常简单、日常的词汇和短语，让一个10岁的孩子能够轻松理解。讲一个有趣和愉快的故事，避免任何复杂的概念或技术术语。
    - professionals and researchers in the field (专业人士和研究人员)
        - 内容应旨在吸引对该主题有深入了解的高知识水平的受众。包括对最新研究成果和领域内争论的批判性分析。
    - high school students (高中生)
        - 使用能够与青少年学生产生共鸣的语言和例子，平衡教育严谨性与可及性。目标是使该主题变得易于理解且有趣，激发他们对其在日常生活中应用的好奇心。

#### 网络数据
实践表明，使用网络数据构建提示扩展性最好，Cosmopedia 使用的 80% 以上的提示来自于此。我们使用 [RefinedWeb](https://huggingface.co/datasets/tiiuae/falcon-refinedweb) 等数据集将数百万个 Web 样本聚为 145 个簇，并从每个簇中提取 10 个随机样本的内容并要求 Mixtral 找到它们的共同主题以最终识别该簇的主题。

检查了这些簇并排除了任何我们认为教育价值较低的簇，剔除的内容如露骨的成人材料、名人八卦和讣告等。你可于 [此处](https://github.com/huggingface/cosmopedia/blob/dd5cd1f7fcfae255c9cfbe704ba2187965523457/prompts/web_samples/filter_and_classify_clusters.py) 获取保留和剔除的 112 个主题的完整列表。

`AutoMathText` 是一个精心设计的数学文本数据集。

**网络数据种子样本及其对应提示的示例**：

![](/images/2024/SyntheticData/web_samples.png)

```
- Web extract/seed sample: 
The Cardiovascular BioImaging Core offers the latest echo technology, including real-time three-dimensional (3D) and 4D, and speckle tracking imaging. Real-time 3D and speckle tracking echocardiography are new technologies that give accurate measures of regional and global cardiac function. These technologies rival information obtained by more expensive modalities (like cardiac MRI) and have... (truncated)

- Topic:
Medicine
```
- Web extract/seed sample: 
    - 心血管生物成像核心提供最新的超声技术，包括实时三维（3D）和4D，以及斑点跟踪成像。实时3D和斑点跟踪超声心动图是一种新技术，可以准确测量局部和全局心脏功能。这些技术可以与更昂贵的模态（如心脏 MRI）获得的信息相媲美，并且...
- Topic:
    - 医学

```
Prompt:

Here is an extract from
a webpage: "The Cardiovascular BioImaging Core offers the latest echo technology, including real-time three-dimensional (3D) and 4D, and speckle tracking imaging. Real-time 3D and speckle tracking echocardiography are new technologies that give accurate measures of regional and global cardiac function. These technologies rival information obtained by more expensive modalities (like cardiac MRI) and have.. (truncated).".
Write an informative and insightful blog post that expands upon the extract above, within the context of "Medicine". 

Your post should delve into the nuances of the topic, offering fresh perspectives and deeper analysis.
Aim to: 
- Inform: Provide valuable, well-researched information that educates the reader.
- Engage: Write in a conversational tone that connects with the audience, making complex ideas accessible. 
- Illustrate: Use examples, anecdotes, or personal experiences to bring the topic to life. Do not give a title and do not start with sentences like "Have you ever..." or "Hello dear readers..", simply write the content without these introductory phrases.
```
- Prompt:
    - 这是一个网页的摘录：“心血管生物成像核心提供最新的超声技术，包括实时三维（3D）和4D，以及斑点跟踪成像。实时3D和斑点跟踪超声心动图是一种新技术，可以准确测量局部和全局心脏功能。这些技术可以与更昂贵的模态（如心脏 MRI）获得的信息相媲美，并且...
    - 撰写一篇信息丰富且富有见地的博客文章，扩展上述摘录，放在“医学”背景下。
    - 您的文章应深入探讨该主题的细微差别，提供新的视角和更深入的分析。
    - 目标是：
        - 通知：提供有价值的、经过深入研究的信息，教育读者。
        - 参与：以对话的语气写作，与观众建立联系，使复杂的想法易于理解。
        - 说明：使用例子、轶事或个人经历来生动地展现主题。不要给出标题，也不要以“你有没有……”或“亲爱的读者……”这样的句子开头，只需写出内容，不要有这些开场白。

#### 指令数据集与故事
在我们对生成的合成数据集训得的模型进行初步评估时，我们发现其缺乏小学教育阶段所需的典型常识和基础知识。为了解决这一问题，我们增加了 [UltraChat](https://huggingface.co/datasets/stingning/ultrachat) 和 [OpenHermes2.5](https://huggingface.co/datasets/teknium/OpenHermes-2.5) 指令微调数据集作为提示的种子数据。这些数据集涵盖了广泛的主题，如在 UltraChat 中，我们使用了“关于世界的问题”子集，其中涵盖了 30 个关于世界的元概念; 而对另一个多样化且高质量的指令调优数据集 OpenHermes2.5 ，我们跳过了不适合讲故事的来源和类别，例如用于编程的 glaive-code-assist 和用于高级化学的 camala 。下面展示了我们用来生成这些故事的提示示例。

**从 UltraChat 和 OpenHermes 样本中构建的用于生成故事的提示 (分别针对少儿、普通受众及 Reddit 论坛)**：

![](/images/2024/SyntheticData/stories.png)

### 技术栈

#### 主题聚类
我们使用 [text-clustering](https://github.com/huggingface/text-clustering/) 代码库来对 Cosmopedia 提示中使用的网络数据进行主题聚类。下图说明了聚类及对生成的簇进行标注的流程。我们还要求 Mixtral 在标注时为簇打一个教育性得分 (满分 10 分) ; 这有助于后面我们进行主题检查。你可以在此 [演示](https://huggingface.co/spaces/HuggingFaceTB/inspect_web_clusters) 中找到网络数据的每个簇及其得分。

**文本聚类的流程**：

![](/images/2024/SyntheticData/text_clustering.png)

#### 大规模教科书生成
我们用 [llm-swarm](https://github.com/huggingface/llm-swarm) 库使用 [Mixtral-8x7B-Instruct-v0.1](https://huggingface.co/mistralai/Mixtral-8x7B-Instruct-v0.1) 生成 250 亿个合成内容词元。这是一个可扩展的合成数据生成工具，支持本地 LLM 以及 Hugging Face Hub 上的推理终端。它还支持 [TGI](https://github.com/huggingface/text-generation-inference) 和 [vLLM](https://github.com/vllm-project/vllm) 推理库。我们使用 TGI 在 Hugging Face Science 集群的 H100 GPU 上本地部署 Mixtral-8x7B。生成 Cosmopedia 的总计算时间超过 `1 万 GPU 时`。

**注意**: 我们使用 HuggingChat 对提示进行初始迭代。我们使用 llm-swarm 为每个提示生成数百个样本以检查生成的样本是否有异常及其异常模式。比如说，模型在为多个教科书生成了非常相似的介绍性短语，并且经常以相同的短语开头，如“很久很久以前”以及“太阳低垂在天空中”。我们在迭代后的提示中明确要求模型避免这些介绍性陈述并要求其创造性解决问题，基于这些提示，虽然仍会出现上述情况，但概率很低。

#### 基准去污
鉴于种子样本或模型的训练数据中可能存在基准污染，我们实现了一个净化流水线，以确保我们的数据集不含测试基准中的任何样本。

与 Phi-1 类似，我们使用 10 词元重叠率来识别潜在污染的样本。从数据集中检索到候选样本后，我们使用 [difflib.SequenceMatcher](https://docs.python.org/3/library/difflib.html) 将其与基准样本进行比较。如果 len(matched_substrings) 与 len(benchmark_sample) 的比率超过 0.5，我们将丢弃该样本。我们对 Cosmo-1B 模型所有评估基准都实施了此净化，包括 MMLU、HellaSwag、PIQA、SIQA、Winogrande、OpenBookQA、ARC-Easy 以及 ARC-Challenge。

#### 训练软件栈
我们用 [datatrove](https://github.com/huggingface/datatrove) 进行数据去重及分词，用 [nanotron](https://github.com/huggingface/nanotron) 进行模型训练，用 [lighteval](https://github.com/huggingface/lighteval-harness) 进行评估。


## [用于 LLM 微调和对齐的合成数据](https://argilla.io/blog/synthetic-data/)
- [distilabel](https://github.com/argilla-io/distilabel)
- [argilla](https://github.com/argilla-io/argilla)
- [Argilla Docs](https://docs.argilla.io/latest/)

### distilabel
Distilabel 是一个合成数据和 AI 反馈框架，为需要基于经过验证的研究论文的快速、可靠和可扩展的管道的工程师提供支持。

### argilla
Argilla 是一个协作工具，用于 AI 工程师和领域专家构建高质量的数据集。

![](/images/2024/SyntheticData/distilabel-schema.png)

![](/images/2024/SyntheticData/taxonomy-synthetic-data.png)
