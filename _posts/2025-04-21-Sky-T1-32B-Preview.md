---
layout: post
title:  "Sky-T1-32B-Preview: 在450美元内训练你自己的O1预览模型"
date:   2025-04-21 07:00:00 +0800
categories: Sky-T1 Post-Training
tags: [Sky-T1, Sky-T1-32B-Preview, Post-Training, Reasoning]
---

## [Sky-T1: 在450美元内训练你自己的O1预览模型](https://novasky-ai.github.io/posts/sky-t1/)

我们推出了Sky-T1-32B-Preview，这是一个在流行的推理和编码基准测试上表现与o1-preview相当的推理模型。**值得注意的是，Sky-T1-32B-Preview的训练成本不到450美元，这证明了以经济高效的方式复制高级推理能力是可能的**。所有[代码](https://github.com/NovaSky-AI/SkyThought)都是开源的。

![](/images/2025/Sky-T1-32B-Preview/Sky-T1-pipeline.jpg)

## 概述
像o1和Gemini 2.0这样擅长推理的模型已经证明可以通过产生长链的思维过程等进步来解决复杂任务。然而，技术细节和模型权重无法获取，这对学术界和开源社区的参与造成了障碍。

为此，一些值得注意的努力已经出现，旨在训练开放权重的数学领域推理模型，如[Still-2](https://arxiv.org/abs/2412.09413)和[Journey](https://arxiv.org/abs/2411.16489)。同时，我们UC Berkeley的NovaSky团队一直在探索各种技术来发展基础模型和指令微调模型的推理能力。在这项工作中，我们在同一个模型中不仅在数学方面，而且在编码方面都取得了具有竞争力的推理表现。

### 完全开源：共同推动进步
为确保我们的工作能够惠及更广泛的社区，我们完全致力于开源协作。我们开源所有细节（即数据、代码、模型权重），使社区能够*轻松地*复制和改进我们的成果：
- [**基础设施**](https://github.com/NovaSky-AI/SkyThought)：在单个代码库中构建数据、训练和评估模型。
- [**数据**](https://github.com/NovaSky-AI/SkyThought)：用于训练Sky-T1-32B-Preview的17K数据。
- [**技术细节**](https://novasky-ai.github.io/posts/sky-t1)：我们的技术[报告](https://novasky-ai.github.io/posts/sky-t1/)和[wandb日志](https://api.wandb.ai/links/sky-posttraining-uc-berkeley/wjg3sybl)。
- [**模型权重**](https://huggingface.co/NovaSky-AI)：我们的32B模型权重。

<table>
  <thead>
    <tr>
      <th>模型</th>
      <th style="background-color: #bfbfbf;"><div align="center">Sky-T1-32B-Preview</div></th>
      <th><div align="center">STILL-2</div></th>
      <th><div align="center">Journey</div></th>
      <th><div align="center">QwQ</div></th>
      <th><div align="center">o1</div></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>数据</td>
      <td style="background-color: #f2f2f2;"><div align="center">✅</div></td>
      <td><div align="center">✅</div></td>
      <td><div align="center">❌</div></td>
      <td><div align="center">❌</div></td>
      <td><div align="center">❌</div></td>
    </tr>
    <tr>
      <td>代码</td>
      <td style="background-color: #f2f2f2;"><div align="center">✅</div></td>
      <td><div align="center">❌</div></td>
      <td><div align="center">❌</div></td>
      <td><div align="center">❌</div></td>
      <td><div align="center">❌</div></td>
    </tr>
    <tr>
      <td>报告</td>
      <td style="background-color: #f2f2f2;"><div align="center">✅</div></td>
      <td><div align="center">✅</div></td>
      <td><div align="center">✅</div></td>
      <td><div align="center">❌</div></td>
      <td><div align="center">❌</div></td>
    </tr>
    <tr>
      <td>数学领域</td>
      <td style="background-color: #f2f2f2;"><div align="center">✅</div></td>
      <td><div align="center">✅</div></td>
      <td><div align="center">✅</div></td>
      <td><div align="center">✅</div></td>
      <td><div align="center">✅</div></td>
    </tr>
    <tr>
      <td>编程领域</td>
      <td style="background-color: #f2f2f2;"><div align="center">✅</div></td>
      <td><div align="center">❌</div></td>
      <td><div align="center">❌</div></td>
      <td><div align="center">✅</div></td>
      <td><div align="center">✅</div></td>
    </tr>
    <tr>
      <td>模型权重</td>
      <td style="background-color: #f2f2f2;"><div align="center">✅</div></td>
      <td><div align="center">✅</div></td>
      <td><div align="center">❌</div></td>
      <td><div align="center">✅</div></td>
      <td><div align="center">❌</div></td>
    </tr>
  </tbody>
</table>

通过分享所有这些资源，我们旨在赋能学术界和开源社区在我们的工作基础上继续发展，探索新的可能性，并推动推理模型开发的边界。

## 实现方法
### 数据策划过程
为了生成我们的训练数据，我们使用了QwQ-32B-Preview，这是一个推理能力与o1-preview相当的开源模型。我们策划了数据混合集（见后续章节）以覆盖需要推理的各个领域，并采用拒绝采样程序来提高数据质量。然后，我们受[Still-2](https://arxiv.org/abs/2412.09413)的启发，使用GPT-4o-mini将QwQ的输出重写成格式良好的版本，以提高数据质量和便于解析。我们特别发现格式化对推理模型的解析非常有利 - 这些模型被训练成以特定格式响应，结果通常难以解析。例如，在APPs数据集上，如果不重新格式化，我们只能假设代码写在最后一个代码块中，此时QwQ仅能达到约25%的准确率。然而，有时代码可能写在中间，经过重新格式化后，准确率提升到90%以上。

**拒绝采样：** 如果QwQ样本根据数据集提供的解决方案判断不正确，我们会将其丢弃。对于数学问题，我们与标准答案进行精确匹配。对于编码问题，我们执行数据集中提供的单元测试。我们的最终数据包含来自APPs和TACO的5k编码数据，以及来自AIME、MATH和NuminaMATH数据集奥林匹克子集的10k数学数据。此外，我们还保留了来自STILL-2的1k科学和谜题数据。

### 训练
我们使用训练数据对Qwen2.5-32B-Instruct（一个没有推理能力的开源模型）进行微调。模型训练3个轮次，学习率为1e-5，批量大小为96。模型训练在8个H100上使用DeepSpeed Zero-3 offload完成，用时19小时（根据Lambda Cloud定价约450美元）。我们使用[Llama-Factory](https://github.com/hiyouga/LLaMA-Factory)进行训练。

### 评估和结果
<table>
  <thead>
    <tr>
      <th></th>
      <th style="background-color: #bfbfbf;">Sky-T1-32B-Preview</th>
      <th>Qwen-2.5-32B-Instruct</th>
      <th>QwQ</th>
      <th>o1-preview</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Math500</td>
      <td style="background-color: #F2F2F2;">82.4</td>
      <td>76.2</td>
      <td>85.4</td>
      <td>81.4</td>
    </tr>
    <tr>
      <td>AIME2024</td>
      <td style="background-color: #F2F2F2;">43.3</td>
      <td>16.7</td>
      <td>50.0</td>
      <td>40.0</td>
    </tr>
    <tr>
      <td>LiveCodeBench-Easy</td>
      <td style="background-color: #F2F2F2;">86.3</td>
      <td>84.6</td>
      <td>90.7</td>
      <td>92.9</td>
    </tr>
    <tr>
      <td>LiveCodeBench-Medium</td>
      <td style="background-color: #F2F2F2;">56.8</td>
      <td>40.8</td>
      <td>56.3</td>
      <td>54.9</td>
    </tr>
    <tr>
      <td>LiveCodeBench-Hard</td>
      <td style="background-color: #F2F2F2;">17.9</td>
      <td>9.8</td>
      <td>17.1</td>
      <td>16.3</td>
    </tr>
    <tr>
      <td>GPQA-Diamond</td>
      <td style="background-color: #F2F2F2;">56.8</td>
      <td>45.5</td>
      <td>52.5</td>
      <td>75.2</td>
    </tr>
  </tbody>
</table>

## 其他发现
**模型大小很重要。** 我们最初尝试在较小的模型（7B和14B）上进行训练，但只观察到适度的改进。例如，在APPs数据集上训练Qwen2.5-14B-Coder-Instruct，在LiveCodeBench上的表现仅从42.6%略微提升到46.3%。然而，通过手动检查较小模型（小于32B的模型）的输出，我们发现它们经常生成重复的内容，限制了其效果。

**数据混合很重要。** 我们最初使用Numina数据集（由STILL-2提供）中的3-4K数学问题训练32B模型，在AIME24准确率从16.7%显著提升至43.3%。然而，当我们将APPs数据集生成的编码数据纳入训练过程时，AIME24准确率下降到36.7%。我们推测这种下降是由于数学和编码任务需要不同的推理方法。

编码中的推理通常涉及额外的逻辑步骤，如模拟测试输入或内部执行生成的代码，而数学问题的推理往往更直接和结构化。为了解决这些差异，我们用NuminaMath数据集中的挑战性数学问题和TACO数据集中的复杂编码任务丰富了训练数据。这种平衡的数据混合使模型能够在两个领域都表现出色，在AIME24上恢复到43.3%的准确率，同时也提升了其编码能力。

## 未来工作
Sky-T1-32B-Preview标志着我们开发具有高级推理能力的开源模型之旅的开始。展望未来，我们将专注于开发更高效的模型，保持强大的推理性能，并探索在测试时进一步提高模型效率和准确性的先进技术。请继续关注我们在这些令人兴奋的计划上的进展。
