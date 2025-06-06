---
layout: single
title:  "OpenAI o3 and o4-mini System Card"
date:   2025-04-19 08:00:00 +0800
categories: OpenAI o3
tags: [OpenAI, o3, o4-mini, System Card]
---

- [OpenAI o3 and o4-mini System Card](https://cdn.openai.com/pdf/2221c875-02dc-4789-800b-e7758f3722c1/o3-and-o4-mini-system-card.pdf)

## Introduction（介绍）

**OpenAI o3** 和 **OpenAI o4-mini** 结合了最先进的推理能力和完整工具功能——包括网页浏览（web browsing）、Python 编程、图像（image）和文件分析（file analysis）、图像生成（image generation）、画布编辑（canvas）、自动化流程（automations）、文件搜索（file search）和记忆功能（memory）。这些模型擅长解决复杂的数学、编码和科学难题，同时展现出强大的视觉感知和分析能力。这些**模型在其思考链中使用工具来增强自身能力**；`例如`，在思考过程中裁剪或转换图像、搜索网页或使用 Python 分析数据。

OpenAI o 系列模型通过在思维链上进行大规模强化学习进行训练。这些先进的推理能力为提高我们模型的安全性与鲁棒性提供了新的途径。特别地，我们的模型在回应潜在的不安全提示时，能够根据上下文推理我们的安全策略，这得益于审慎对齐。

这是根据我们准备框架（Preparedness Framework）第二版发布的第一个版本和系统卡。OpenAI 的安全顾问小组 (SAG) 审查了我们准备评估的结果，并确定 OpenAI o3 和 o4-mini 在我们的三个跟踪类别（生物和化学能力、网络安全和人工智能自我改进）中均未达到高阈值。我们在下文描述了这些评估，并提供了我们在这些领域降低风险的工作进展。


## Model Data and Training（模型数据和训练）

OpenAI 的推理模型通过强化学习进行训练以进行推理。`o 系列`的模型在回答之前会先思考：它们可以**在回复用户之前生成一段较长的内部思维链**。`通过训练`，这些**模型学会** **改进它们的思考过程**，**尝试不同的策略**，并**识别自己的错误**。推理使得这些模型能够遵循我们设定的特定指南和模型策略，从而有助于它们按照我们的安全预期行事。这意味着它们能够提供更有帮助的答案，并且更能抵抗绕过安全规则的尝试。
