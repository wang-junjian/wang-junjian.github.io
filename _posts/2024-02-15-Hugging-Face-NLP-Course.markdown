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
