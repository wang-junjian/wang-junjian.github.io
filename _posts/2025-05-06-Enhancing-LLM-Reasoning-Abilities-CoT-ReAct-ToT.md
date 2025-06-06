---
layout: single
title:  "提升 LLM 推理能力：CoT, ReAct, ToT"
date:   2025-05-06 10:00:00 +0800
categories: LLM 推理
tags: [LLM, CoT, ReAct, ToT, 思维链, 思维树, 推理]
---

## 总结

| 特性       | <nobr>CoT (Chain-of-Thought)   | <nobr>ReAct (Reasoning and Acting)                                                                           | <nobr>ToT (Tree-of-Thoughts)                                                           |
| -------- | ----------------------------- | ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------- |
| **中文名称** | 思维链                           | 推理与行动                                                                                                  | 思维树                                                                                   |
| **核心思想** | 引导模型生成中间推理步骤，模仿人类逐步思考。        | 结合内部推理与外部工具交互，获取并利用额外信息。                                                                               | 允许模型同时探索多个不同的推理路径，形成树状结构，并进行评估和选择。                                                    |
| **工作方式** | 在提示中展示逐步推理的示例，引导模型按步骤思考并输出过程。 | 模型交替进行：<br>1. 思考 (Thought): 分析情况，规划行动。<br>2. 行动 (Action): 调用外部工具（如搜索）。<br>3. 观察 (Observation): 获取行动结果。 | 1. 生成多个想法: 每一步产生多个可能的思路。<br>2. 评估想法: 对各思路进行可行性 / 潜力评估。<br>3. 搜索策略: 使用如 BFS(广度优先搜索) 或 DFS(深度优先搜索) 探索思路树，可回溯。 |
| **主要优点** | - 提高复杂推理能力<br>- 增强可解释性，理解模型思路 | - 处理知识密集型任务（获取外部知识）<br>- 减少信息幻觉<br>- 动态适应环境反馈                                                          | - 解决更复杂、探索性强的问题<br>- 提高规划和决策能力<br>- 支持回溯，增强鲁棒性                                        |
| **简单比喻** | 让模型“多想几步”，把思考过程写出来。           | 让模型边“想”边“做”（例如上网查资料）。                                                                                  | 让模型同时“想”多种可能性，像走迷宫一样尝试不同路径，并选择最优的。                                                    |

![](/images/2025/CoT-ReAct-ToT/CoT.png)

![](/images/2025/CoT-ReAct-ToT/CoT-Examples.png)

![](/images/2025/CoT-ReAct-ToT/CoT-AQuA.png)

![](/images/2025/CoT-ReAct-ToT/ReAct.png)

![](/images/2025/CoT-ReAct-ToT/ReAct-HotpotQA.png)

![](/images/2025/CoT-ReAct-ToT/ReAct-AlfWorld.png)

![](/images/2025/CoT-ReAct-ToT/ToT.png)

![](/images/2025/CoT-ReAct-ToT/ToT-Game24.png)

![](/images/2025/CoT-ReAct-ToT/ToT-Working.png)


## 1. 思维链 (Chain-of-Thought, CoT)

**核心思想：** 思维链是一种提示（Prompting）技术，旨在引导大型语言模型 (LLM) 在给出最终答案之前，先生成一系列中间的推理步骤。它模仿了人类解决复杂问题时逐步思考的过程。

**工作方式：** 在向模型提问时，不仅仅是要求最终答案，而是在提示中包含一些示例，展示如何一步一步地思考并得出结论。例如，在解决一个数学应用题时，CoT 提示会展示解题的详细步骤，而不仅仅是最终的数字答案。

**优点：**
* **提高复杂推理能力：** 对于需要多步逻辑、数学计算或常识推理的问题，CoT 能显著提高模型的准确性。
* **增强可解释性：** 通过展示推理过程，用户可以更好地理解模型是如何得到答案的，便于发现和修正错误。

**简单来说：** CoT 就是让模型“多想几步”，把思考过程写出来，而不是直接给出答案。

## 2. ReAct (Reasoning and Acting)

**核心思想：** ReAct 框架将“推理”（Reasoning）和“行动”（Acting）结合起来，让大型语言模型不仅能像 CoT 那样进行内部思考，还能与外部环境或工具进行交互以获取额外信息。

**工作方式：** 模型在解决问题时，会交替进行思考和行动。
* **思考（Thought）：** 分析当前情况，判断下一步需要什么信息或操作。
* **行动（Action）：** 执行一个动作，比如调用一个搜索引擎查询信息、访问一个数据库、使用一个计算器等。
* **观察（Observation）：** 获取行动的结果（例如搜索结果、计算答案）。
模型根据观察到的新信息，继续进行下一轮的思考和行动，直到问题解决。

**优点：**
* **处理知识密集型任务：** 使模型能够获取和利用其内部知识库之外的最新信息或特定领域知识。
* **减少幻觉：** 通过查询外部工具验证信息，可以减少模型捏造事实（幻觉）的可能性。
* **动态适应：** 能够根据环境反馈调整策略，更灵活地解决问题。

**简单来说：** ReAct 让模型不仅能“想”，还能“做”（比如上网查资料），边想边做，解决更复杂、需要外部信息的问题。

## 3. 思维树 (Tree-of-Thoughts, ToT)

**核心思想：** 思维树是对思维链 (CoT) 的一种泛化和扩展。CoT 通常是沿着单一路径进行推理，而 ToT 允许模型同时探索多个不同的推理路径（“想法”或“思路”），形成一个树状结构。

**工作方式：**
1.  **生成多个想法：** 在推理的每一步，模型会针对当前状态生成多个可能的下一步想法或解决方案。
2.  **评估想法：** 模型会对这些生成的想法进行评估，判断它们的可行性或有多大潜力能导向最终答案。
3.  **搜索策略：** 使用搜索算法（如广度优先搜索 BFS 或深度优先搜索 DFS）来系统地探索这棵“想法树”。模型可以选择最有希望的分支继续深入，或者在发现当前路径行不通时进行回溯（Backtracking），尝试其他分支。

**优点：**
* **解决更复杂、探索性更强的问题：** 对于没有明确单一解法路径的问题（如下棋、一些规划或创造性任务），ToT 可以探索多种可能性。
* **提高规划和决策能力：** 通过系统性探索和评估，模型能做出更深思熟虑的决策。
* **支持回溯：** 允许模型在发现错误或死胡同时返回上一步，选择不同的路径，增强了鲁棒性。

**简单来说：** ToT 就像让模型同时思考多种可能性（“如果这样走会怎样？如果那样走又会怎样？”），并从中选择最好的路径，甚至在走不通时能回头换条路试试。

**总结：**
* **CoT:** 让模型“想清楚”过程，按步骤推理。
* **ReAct:** 让模型边“想”边“做”，结合推理和外部工具交互。
* **ToT:** 让模型同时“想”多种可能性，像树一样探索不同路径，并能评估和回溯。

这三种技术都旨在提升大型语言模型解决复杂问题的能力，但侧重点和实现方式有所不同。它们也可以相互结合使用。
