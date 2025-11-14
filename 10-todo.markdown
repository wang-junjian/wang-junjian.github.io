---
layout: single
title: 必读
permalink: /read/
---

# 2025

## 11🈷️
- [X] [李飞飞最新长文：AI的下一个十年——构建真正具备空间智能的机器](https://mp.weixin.qq.com/s/3w5zgnMXe13mKIR_ePBwAw)


# 2023

## 6🈷️
- [X] [To Repeat or Not To Repeat: Insights from Scaling LLM under Token-Crisis](https://arxiv.org/abs/2305.13230)
  * [重复还是不重复：代币危机下扩展 LLM 的启示](https://mp.weixin.qq.com/s/DBP_eafGeKMEuSIma9Z9Tg)
  最近的研究强调了数据集规模在扩展语言模型方面的重要性。然而，大型语言模型（LLMs）在预训练期间容易饥饿，而网络上的高质量文本数据已接近其LLMs的扩展极限。为了进一步增强LLMs，一个简单直接的方法是重复预训练数据进行额外的epoch。在这项研究中，我们从实证角度研究了这种方法的三个关键方面。首先，我们探讨重复预训练数据的后果，揭示模型容易过度拟合，导致多次epoch的退化。其次，我们研究了导致多次epoch退化的关键因素，发现显著因素包括数据集大小、模型参数和训练目标，而不太有影响的因素包括数据集质量和模型FLOPs。最后，我们探索广泛使用的正则化是否可以缓解多次epoch的退化。大多数正则化技术并没有带来显著改进，除了dropout，它表现出了显著的有效性，但需要在扩展模型大小时进行小心的调整。此外，我们发现利用专家混合（MoE）可以实现具有可比可调参数的计算密集型密集LLMs的成本效益和高效的超参数调整，可能影响更广泛的高效LLM开发。

## 5🈷️
- [X] [研究 OpenAI API 开发文档](https://platform.openai.com/docs/introduction)
- [X] 23 [大模型时代下做科研的四个思路](https://www.youtube.com/watch?v=sh79Z8i15PI)
  1. Efficient modeling (PEFT)
  2. Pretrained model, new topics
  3. Plug-and-play
  4. Dataset, evaluation and survey
- [X] 24 [GPT，GPT-2，GPT-3 论文精读](https://www.youtube.com/watch?v=t70Bl3w7bxY)
  * 预训练模型（Pre-trained Model）：指在大规模的数据集上，通过无监督学习方法，训练好了一个通用的模型，可供后续的任务微调和迁移学习使用。
  * 微调模型（Fine-tuned Model）：指使用预训练模型作为初始权重，再使用与任务相关的数据集对其进行调整和优化，以适应特定的任务需求，这个过程叫做微调。
  * 数据集（Dataset）：是指用于机器学习的数据集合，其中包含了一组样本和其对应的标签（如果是监督学习）。
  * 与任务相关的数据集
  * 标签（Label）：是数据集中的一个元素，它是用来标记样本类别的标识符。
  * 多任务学习（Multi-Task Learning）：指一个模型可以同时处理多个相关的任务，从而提高模型的泛化能力。 
  * 子任务（Subtask）：指任务中的一个子问题或一个相对独立的小任务。
  * 半监督学习（Semi-Supervised Learning）和自监督学习（Self-Supervised Learning）：都是无监督学习的一种，半监督学习使用带有标签的和未标记的数据来训练模型，而自监督学习则通过对未标记的数据进行一些预测任务来进行学习。
  * 超参数（Hyperparameter）：指在训练模型时需要手动设置的参数，如学习率、批量大小、迭代次数等。
  * Transformer，是一种基于注意力机制的深度神经网络模型，被广泛应用于自然语言处理任务。
  * 解码器，使用掩码
  * 编码器，使用整个序列
  * BERT：是一种基于Transformer的预训练模型，它通过无监督学习的方式预训练了一个双向语言模型，是一种常用的自然语言处理技术。
  * BERT Base
  * BERT Large
  * 模型层数和模型宽度：指模型中的神经网络层数和每层神经元的个数，这些参数会影响模型的复杂度和性能。
  * Zero Shot、One Shot和Few Shot：这是几种模型可以处理的不同问题类型。Zero Shot指模型能够在没有接触到任何有关问题的数据时，对给定问题进行推理。One Shot指模型能够在只有一个数据示例的情况下完成任务。Few Shot指模型能够在只有很少的数据示例的情况下完成任务。
  * Prompt及分隔符：在自然语言生成任务中，可以使用一些预定义的关键词和短语来帮助模型更好地理解和生成文本。Prompt指的是这些预定义的关键词和短语，分隔符则指的是在输入中用于分隔Prompt和要生成的文本的特殊符号。
  * 信噪比（Signal-to-Noise Ratio）：指信号与噪声的比率，用来描述在数据中信号所占的比例，越高表示信号对噪声的影响越大。
  * 可学习参数（Learnable Parameters）：是指神经网络中需要通过训练学习到的参数，如权重和偏置等。
  * 注意力机制（Attention Mechanism）：是一种用于机器学习和自然语言处理中的技术，它允许模型集中注意力于与当前任务相关的部分，以便更好地进行处理
- [X] 26 [What are Vector Embeddings?](https://www.pinecone.io/learn/vector-embeddings/)
- [X] 26 [Semantic search with Pinecone](https://www.pinecone.io/learn/search-with-pinecone/)
- [X] 30 [State of GPT - Video](https://build.microsoft.com/en-US/sessions/db3f4859-cd30-4445-a0cd-553c3304f8e2?source=sessions)
  * [微软2023年Build大会演讲：如何训练和应用GPT](https://www.youtube.com/watch?v=YrBJiy-V8MY)
  * [State of GPT - PDF](https://karpathy.ai/stateofgpt.pdf)


## 4🈷️
- [X] ChatGLM-6B 模型微调
- [X] [试用 GitHub Copilot](https://github.com/features/copilot)
- [ ] [研究 GitHub REST API 文档](https://docs.github.com/zh/rest)
- [X] [研究 OpenAI API 开发文档](https://platform.openai.com/docs/introduction)
- [ ] [研究 ModelScope 文档](https://www.modelscope.cn/docs/)
- [X] 编写 YOLOv8 的推理服务
  * [X] Ultralytics Serving](https://github.com/gouchicao/ultralytics-serving)
- [X] 开发 Python 程序
  * [X] 没有源代码发布
  * [ ] 开发使用 pip 安装

## 3🈷️
- [X] [Ultralytics YOLOv8](https://github.com/ultralytics/ultralytics/blob/main/README.zh-CN.md)
  * [X] 使用 Comet 让训练可视化
  * [X] Ultralytics Hub 试用（训练、部署）
  * [X] Roboflow 试用（标注、训练、部署）


## 开发文档
### AI
* [OpenAI API Documention](https://platform.openai.com/docs)
* [LlamaIndex](https://gpt-index.readthedocs.io/en/latest/index.html)
* [Pinecone Documention](https://docs.pinecone.io/docs/overview)

## 学习资料
* [OpenAI Cookbook](https://github.com/openai/openai-cookbook/)
* [DL4J快速入门指南](https://mgubaidullin.github.io/deeplearning4j-docs/cn/quickstart)
