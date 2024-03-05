---
layout: post
title:  "Hugging Face NLP Course"
date:   2024-02-15 08:00:00 +0800
categories: NLP Transformers
tags: [HuggingFace, NLP, Transformers]
---

- [NLP Course](https://huggingface.co/learn/nlp-course/zh-CN/)

## 1. TRANSFORMER 模型
### 自然语言处理
NLP 是语言学和机器学习交叉领域，专注于理解与人类语言相关的一切。 NLP 任务的目标不仅是单独`理解单个单词`，而且是能够`理解这些单词的上下文`。

以下是常见 NLP 任务的列表：

- 对整个句子进行分类: 
    - 获取评论的情绪
    - 检测电子邮件是否为垃圾邮件
    - 确定句子在语法上是否正确
    - 确定两个句子在逻辑上是否相关
- 对句子中的每个词进行分类: 
    - 识别句子的语法成分（名词、动词、形容词）
    - 识别句子的命名实体（人、地点、组织）
- 生成文本内容: 
    - 用自动生成的文本完成提示
    - 用屏蔽词填充文本中的空白
- 从文本中提取答案: 
    - 给定问题和上下文，根据上下文中提供的信息提取问题的答案
- 从输入文本生成新句子: 
    - 将文本翻译成另一种语言
    - 总结文本
- 语音识别: 
    - 生成音频样本的转录
- 计算机视觉: 
    - 生成图像描述
    - 目标检测

### Transformers 能做什么？
Transformers 库中最基本的对象是 pipeline() 函数。它将模型与其必要的预处理和后处理步骤连接起来，使我们能够通过直接输入任何文本并获得最终的答案：

```python
from transformers import pipeline

classifier = pipeline("sentiment-analysis")
classifier("I've been waiting for a HuggingFace course my whole life.")
```

```python
[{'label': 'POSITIVE', 'score': 0.9598047137260437}]
```

将一些文本传递到 pipeline 时涉及三个主要步骤：

1. 文本被预处理为模型可以理解的格式。
2. 预处理的输入被传递给模型。
3. 模型处理后输出最终人类可以理解的结果。

当前 pipeline 支持的任务有：

- feature-extraction (get the vector representation of a text) 特征提取
- fill-mask 填充空缺
- ner (named entity recognition) 命名实体识别
- question-answering 问答
- sentiment-analysis 情感分析
- summarization 文本摘要
- text-generation 文本生成
- translation 翻译
- zero-shot-classification 零样本分类

### Transformers 是如何工作的？
#### 一点Transformers的发展历史
Transformer 架构 于 2017 年 6 月推出。原本研究的重点是翻译任务。随后推出了几个有影响力的模型，包括

- 2018 年 6 月: GPT, 第一个预训练的 Transformer 模型，用于各种 NLP 任务并获得极好的结果
- 2018 年 10 月: BERT, 另一个大型预训练模型，该模型旨在生成更好的句子摘要
- 2019 年 2 月: GPT-2, GPT 的改进（并且更大）版本，由于道德问题没有立即公开发布
- 2019 年 10 月: DistilBERT, BERT 的提炼版本，速度提高 60%，内存减轻 40%，但仍保留 BERT 97% 的性能
- 2019 年 10 月: BART 和 T5, 两个使用与原始 Transformer 模型相同架构的大型预训练模型（第一个这样做）
- 2020 年 5 月, GPT-3, GPT-2 的更大版本，无需微调即可在各种任务上表现良好（称为零样本学习）

这个列表并不全面，只是为了突出一些不同类型的 Transformer 模型。大体上，它们可以分为三类：

1. GPT-like (也被称作自回归 `auto-regressive` Transformer 模型)
2. BERT-like (也被称作自动编码 `auto-encoding` Transformer 模型)
3. BART/T5-like (也被称作序列到序列的 `sequence-to-sequence` Transformer 模型)

#### Transformers 是语言模型
上面提到的所有 Transformer 模型（GPT、BERT、BART、T5 等）都被训练为`语言模型 (language models)`。这意味着他们已经以无监督学习的方式接受了大量原始文本的训练。无监督学习是一种训练类型，其中目标是根据模型的输入自动计算的。这意味着不需要人工来标注数据！

这种类型的模型可以对其训练过的语言进行统计理解，但对于特定的实际任务并不是很有用。因此，一般的预训练模型会经历一个称为`迁移学习 (transfer learning)`的过程。在此过程中，模型在给定任务上以监督方式（即使用人工标注的数据）进行微调。

阅读 n 个单词的句子，预测下一个单词。这被称为`因果语言建模（causal language modeling）`，因为输出取决于过去和现在的输入。

![](/images/2024/HuggingFaceNLPCourse/en_chapter1_causal_modeling.svg)

`遮罩语言建模（masked language modeling）`，该模型预测句子中的遮住的词。

![](/images/2024/HuggingFaceNLPCourse/en_chapter1_masked_modeling.svg)

#### Transformer 是大模型
除了一些特例（如 DistilBERT）外，实现更好性能的一般策略是增加模型的大小以及预训练的数据量。

![](/images/2024/HuggingFaceNLPCourse/model_parameters.png)

不幸的是，训练模型，尤其是大型模型，需要大量的数据，时间和计算资源。它甚至会对环境产生影响，如下图所示。

![](/images/2024/HuggingFaceNLPCourse/en_chapter1_carbon_footprint.svg)

- CO2 emissions for a variety of human activities (各种人类活动的二氧化碳排放量)
    - Roundtrip NY-SF flight (1 passenger) (纽约-旧金山往返飞行 - 1 名乘客)
    - Average human life (avg. 1 year) (人类平均寿命 - 平均 1 年)
    - Average U.S life (avg. year) (美国人平均寿命 - 平均年)
    - U.S car including fuel (avg. 1 lifetime) (美国汽车包括燃料 - 平均 1 个生命周期)
    - State-of-the-art LM training (最先进的语言模型训练)
        - Bigscience workshop, incl. experiments (Bigscience 工作坊，包括实验)
        - Approx. 200B parameters (大约 200B 参数)

评估模型训练的碳排放的工具

- [MLCO2 Impact](https://mlco2.github.io/impact/)
- Transformers 中的 [Code Carbon](https://codecarbon.io/)

#### 迁移学习

`预训练(Pretraining)` 是从头开始训练模型的行为：权重是随机初始化的，训练开始时没有任何先验知识。

![](/images/2024/HuggingFaceNLPCourse/en_chapter1_pretraining.svg)

这种预训练通常是在大量的数据上使用自监督（self-supervised）的方式进行的。因此，它需要大量的数据语料库，训练时间可能长达几周。注：自监督意味着标签是根据输入自动创建的（例如预测下一个单词或填充一些屏蔽单词）。

`微调(Fine-tuning)`是在模型预训练之后进行的训练。要进行微调，首先获取一个预训练的语言模型，然后使用特定于您的任务的数据集进行额外的训练。为什么不从头开始为最终用例训练模型？有几个原因：

- 预训练模型已经在与微调数据集有一些相似之处的数据集上进行了训练。因此，微调过程能够利用初始模型在预训练期间获得的知识（例如，对于 NLP 问题，预训练模型将对您用于任务的语言有一定的统计理解）。
- 由于预训练模型已经在大量数据上进行了训练，因此微调需要的数据量要少得多才能获得良好的结果。
- 出于同样的原因，获得良好结果所需的时间和资源要少得多。

例如，可以利用在英语上训练的预训练模型，然后在 arXiv 语料库上进行微调，从而得到一个基于科学/研究的模型。微调只需要有限的数据：预训练模型获得的知识被“转移(transferred)”，因此称为`迁移学习(transfer learning)`。

![](/images/2024/HuggingFaceNLPCourse/en_chapter1_finetuning.svg)

因此，微调模型具有较低的时间、数据、财务和环境成本。迭代不同的微调方案也更快、更容易，因为与完整的预训练相比，训练的约束更少。

这个过程也会比从头开始的训练（除非你有很多数据）取得更好的效果，这就是为什么你应该总是尝试利用一个预训练的模型—一个尽可能接近你手头的任务的模型—并对其进行微调。

#### 通用架构

![](/images/2024/HuggingFaceNLPCourse/en_chapter1_transformers_blocks.svg)

每个部分都可以根据任务的需要独立使用：
- 仅编码器模型：适用于需要理解输入的任务，如句子分类和命名实体识别。
- 仅解码器模型：适用于生成性任务，如文本生成。
- 编码器-解码器模型或序列到序列模型：适用于需要输入的生成性任务，如翻译或摘要。

Transformer 架构最初是为翻译而设计的。在训练期间，编码器接收某种语言的输入（句子），而解码器接收所需目标语言中的相同句子。在编码器中，注意力层可以使用句子中的所有单词（因为正如我们刚才看到的，给定单词的翻译可能取决于句子中它之后和之前的内容）。然而，解码器是顺序工作的，只能关注它已经翻译的句子中的单词（因此，只有当前正在生成的单词之前的单词）。例如，当我们预测了目标的前三个单词时，我们将它们传递给解码器，然后解码器使用编码器的所有输入来尝试预测第四个单词。

为了加快训练速度（当模型可以访问目标句子时），解码器被馈送整个目标，但不允许使用未来的单词（如果它在尝试预测位置 2 的单词时可以访问位置 2 的单词，问题就不会很难！）。例如，在尝试预测第四个单词时，注意力层只能访问位置 1 到 3 的单词。

![](/images/2024/HuggingFaceNLPCourse/en_chapter1_transformers.svg)

第一个注意力层在解码器块中关注解码器的所有（过去的）输入，但第二个注意力层使用编码器的输出。因此，它可以访问整个输入句子，以最佳地预测当前单词。这是非常有用的，因为不同的语言可能有不同的语法规则，使单词以不同的顺序出现，或者后面提供的一些上下文可能有助于确定给定单词的最佳翻译。

注意力遮罩也可以在编码器/解码器中使用，以防止模型关注一些特殊的单词——例如，在将句子批处理在一起时，用于使所有输入长度相同的特殊填充单词。

##### 注意力层（Attention layers）
Transformer 模型的一个关键特性是它们使用了特殊的层，称为注意力层。事实上，引入 Transformer 架构的论文标题就是“注意力就是一切（Attention Is All You Need）”！现在，你只需要知道这一层会告诉模型在处理每个单词的表示时，要特别关注你传递给它的句子中的某些单词（并且在某种程度上忽略其他单词）。

为了将其放入上下文中，考虑将文本从英语翻译成法语的任务。给定输入“你喜欢这门课程”，翻译模型还需要关注相邻的单词“你”，以获得“喜欢”这个词的正确翻译，因为在法语中，动词“喜欢”根据主语的不同而有不同的变化形式。然而，句子的其余部分对于翻译该单词并不重要。同样地，当翻译“这”时，模型还需要注意单词“课程”，因为“这”根据所关联的名词是男性还是女性而有不同的翻译。同样地，句子中的其他单词对于“课程”的翻译并不重要。对于更复杂的句子（和更复杂的语法规则），模型需要特别关注可能出现在句子中较远位置的单词，以正确翻译每个单词。

相同的概念适用于与自然语言相关的任何任务：一个单词本身有意义，但该意义深受上下文的影响，上下文可以是单词被研究的单词之前或之后的任何其他单词（或词组）。

##### Architectures vs. checkpoints

- 架构(Architecture)：这是模型的骨架——模型中每一层和每一个操作的定义。
- 检查点(Checkpoints)：这些是将在给定架构中加载的权重。
- 模型(Model)：这是一个不像“架构”或“检查点”那样精确的总称：它可以同时表示两者。本课程将在重要时指定架构或检查点，以减少歧义。

例如，BERT 是一个架构，而 bert-base-cased 是由 Google 团队在 BERT 的第一个版本中训练的一组权重，是一个检查点。然而，人们可以说“BERT 模型”和“bert-base-cased 模型”。

### 编码器模型（Encoder models）
编码器模型指仅使用编码器的 Transformer 模型。在每个阶段，注意力层都可以获取初始句子中的所有单词。这些模型通常具有“双向（bi-directional）”注意力，被称为自编码模型（auto-encoding models）。

这些模型的预训练通常围绕着以某种方式破坏给定的句子（例如：通过随机遮盖其中的单词），并让模型寻找或重建给定的句子。

编码器模型最适合于需要理解完整句子的任务，例如：句子分类（sentence classification）、命名实体识别（named entity recognition）（以及更普遍的单词分类）和抽取式问答（extractive question answering）。

该系列模型的典型代表有：
- ALBERT
- BERT
- DistilBERT
- ELECTRA
- RoBERTa

### 解码器模型（Decoder models）
解码器模型通常指仅使用解码器的 Transformer 模型。在每个阶段，对于给定的单词，注意力层只能获取到句子中位于将要预测单词前面的单词。这些模型通常被称为自回归模型（auto-regressive models）。

解码器模型的预训练通常围绕预测句子中的下一个单词进行。

这些模型最适合于涉及文本生成（text generation）的任务。

该系列模型的典型代表有：
- CTRL
- GPT
- GPT-2
- Transformer XL

### 序列到序列模型（Sequence-to-sequence models）
编码器-解码器模型（Encoder-decoder models）（也称为序列到序列模型）同时使用 Transformer 架构的编码器和解码器两个部分。在每个阶段，编码器的注意力层可以访问初始句子中的所有单词，而解码器的注意力层只能访问位于输入中将要预测单词前面的单词。

这些模型的预训练可以使用训练编码器或解码器模型的方式来完成，但通常涉及更复杂的内容。例如，T5 通过将文本的随机跨度（可以包含多个单词）替换为单个特殊单词来进行预训练，然后目标是预测该掩码单词替换的文本。

序列到序列模型最适合于围绕根据给定输入生成新句子的任务，如摘要（summarization）、翻译（translation）或生成式问答（generative question answering）。

该系列模型的典型代表有：
- BART
- mBART
- Marian
- T5

### 偏见和局限性（Bias and limitations）
如果您打算在正式的项目中使用经过预训练或经过微调的模型。请注意：虽然这些模型是很强大，但它们也有局限性。其中最大的一个问题是，为了对大量数据进行预训练，研究人员通常会搜集所有他们能找到的内容，中间可能夹带一些意识形态或者价值观的刻板印象。

因此，当您使用这些工具时，您需要记住，使用的原始模型的时候，很容易生成性别歧视、种族主义或恐同内容。这种固有偏见不会随着微调模型而使消失。


## 2. 使用 🤗 TRANSFORMERS

```python
from transformers import pipeline

classifier = pipeline("sentiment-analysis")
classifier(
    [
        "I've been waiting for a HuggingFace course my whole life.",
        "I hate this so much!",
    ]
)
```

```python
[{'label': 'POSITIVE', 'score': 0.9598047137260437},
 {'label': 'NEGATIVE', 'score': 0.9994558091163635}]
```

这个管道（pipeline）将三个步骤组合在一起：预处理（preprocessing）、通过模型传递输入和后处理（postprocessing）：

![](/images/2024/HuggingFaceNLPCourse/en_chapter2_full_nlp_pipeline.svg)

### 使用分词器进行预处理
tokenizer (标记器) 负责：
- 将输入拆分为单词、子单词或符号（如标点符号），称为标记(token)
- 将每个标记(token)映射到一个整数
- 添加可能对模型有用的其他输入
