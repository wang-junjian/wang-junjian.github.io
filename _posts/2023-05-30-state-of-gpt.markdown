---
layout: post
title:  "State of GPT - Andrej Karpathy"
date:   2023-05-30 08:00:00 +0800
categories: GPT
tags: [LLM, SFT, RM, RLHF, Fine-Tuning]
---

## 介绍
Learn about the training pipeline of GPT assistants like ChatGPT, from tokenization to pretraining, supervised finetuning, and Reinforcement Learning from Human Feedback (RLHF). Dive deeper into practical techniques and mental models for the effective use of these models, including prompting strategies, finetuning, the rapidly growing ecosystem of tools, and their future extensions.

了解 ChatGPT 等 GPT 助手的训练管道，从标记化到预训练、监督微调和人类反馈强化学习 (RLHF)。 深入研究有效使用这些模型的实用技术和心智模型，包括提示策略、微调、快速增长的工具生态系统及其未来的扩展。

* [State of GPT - Video](https://build.microsoft.com/en-US/sessions/db3f4859-cd30-4445-a0cd-553c3304f8e2?source=sessions)
* [State of GPT - PDF](https://karpathy.ai/stateofgpt.pdf)

## GPT Assistant training pipeline
![GPT Assistant training pipeline](/images/2023/state-of-gpt/gpt-assistant-training-pipeline.jpg)

### Pretraining（预训练）
![Data Collection](/images/2023/state-of-gpt/data-collection.jpg)

![Tokenization](/images/2023/state-of-gpt/tokenization.jpg)

![GPT3 vs LLaMa](/images/2023/state-of-gpt/gpt3-llama.jpg)

![Pretraining](/images/2023/state-of-gpt/pretraining1.jpg)

![Pretraining](/images/2023/state-of-gpt/pretraining2.jpg)

![Base models learn powerful](/images/2023/state-of-gpt/base-models-learn-powerful.jpg)

![Base models in the wild](/images/2023/state-of-gpt/base-models-in-the-wild.jpg)

### Supervised Finetuning（监督微调）
![SFT Dataset](/images/2023/state-of-gpt/sft-dataset.jpg)

### Reward Modeling（奖励建模）
![RM Dataset](/images/2023/state-of-gpt/rm-dataset1.jpg)

![RM Dataset](/images/2023/state-of-gpt/rm-dataset2.jpg)

![RM Training](/images/2023/state-of-gpt/rm-training.jpg)

### Reinforcement Learning（强化学习）
![RL Training](/images/2023/state-of-gpt/rl-training.jpg)

![RLHF](/images/2023/state-of-gpt/rlhf.jpg)

![Assistant models in the wild](/images/2023/state-of-gpt/assistant-models-in-the-wild.jpg)

## Applications
![Chains / Agents](/images/2023/state-of-gpt/chains-agents.jpg)
![Tool use / Plugins](/images/2023/state-of-gpt/tool-use-plugins.jpg)
![Retrieval-Augmented LLMs](/images/2023/state-of-gpt/retrieval-augmented-llms.jpg)
![Constrained Prompting](/images/2023/state-of-gpt/constrained-prompting.jpg)
![Finetuning](/images/2023/state-of-gpt/finetuning.jpg)
