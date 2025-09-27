---
layout: single
title:  "【生成式人工智慧与机器学习导论2025】第二讲：上下文工程 (Context Engineering) — AI Agent 背后的关键技术"
date:   2025-09-27 20:00:00 +0800
categories: ContextEngineering 生成式人工智慧与机器学习导论2025
tags: [ContextEngineering, 上下文工程, 智能体, 生成式人工智慧与机器学习导论2025, 李宏毅]
---

Context Engineering（上下文工程）是为解决 AI Agent 时代输入过长，避免塞爆 Context 的关键技术。其基本概念是 **“把需要的放進去，不需要的清出來”**。常用招数（基本方法）包括：

1.  **Select（挑选）**：只挑选当下任务最关键的内容。这包括利用 RAG (检索增强生成) 检索额外资讯，并使用 Reranking 或 Small LLM 筛选关键词。此外，只挑选需要的工具（Tool RAG）和记忆（Memory RAG）。
2.  **Compress（压缩）**：对冗长琐碎的内容进行精简和**摘要**。例如，将过去的对话历史或 Computer Use 产生的细节压缩，让遥远的记忆逐渐淡化，以节省 Context 空间。
3.  **Multi-Agent（多代理）**：将复杂任务拆解并分派给多个子 Agent。子 Agent 独立处理细节，完成后**只向 Lead Agent 回报最终结果**，从而隔离复杂的互动过程，分散 Context 负担。

<!--more-->

![](/images/2025/HungYiLee/GenAI-ML/02-ContextEngineering/Agent-52.jpg)

![](/images/2025/HungYiLee/GenAI-ML/02-ContextEngineering/Agent-53.jpg)

![](/images/2025/HungYiLee/GenAI-ML/02-ContextEngineering/Agent-54.jpg)

![](/images/2025/HungYiLee/GenAI-ML/02-ContextEngineering/Agent-55.jpg)

![](/images/2025/HungYiLee/GenAI-ML/02-ContextEngineering/Agent-56.jpg)

![](/images/2025/HungYiLee/GenAI-ML/02-ContextEngineering/Agent-57.jpg)

![](/images/2025/HungYiLee/GenAI-ML/02-ContextEngineering/Agent-58.jpg)

![](/images/2025/HungYiLee/GenAI-ML/02-ContextEngineering/Agent-59.jpg)

![](/images/2025/HungYiLee/GenAI-ML/02-ContextEngineering/Agent-60.jpg)

![](/images/2025/HungYiLee/GenAI-ML/02-ContextEngineering/Agent-61.jpg)

![](/images/2025/HungYiLee/GenAI-ML/02-ContextEngineering/Agent-62.jpg)

![](/images/2025/HungYiLee/GenAI-ML/02-ContextEngineering/Agent-63.jpg)

![](/images/2025/HungYiLee/GenAI-ML/02-ContextEngineering/Agent-64.jpg)

![](/images/2025/HungYiLee/GenAI-ML/02-ContextEngineering/Agent-65.jpg)

![](/images/2025/HungYiLee/GenAI-ML/02-ContextEngineering/Agent-66.jpg)

![](/images/2025/HungYiLee/GenAI-ML/02-ContextEngineering/Agent-67.jpg)

![](/images/2025/HungYiLee/GenAI-ML/02-ContextEngineering/Agent-68.jpg)

![](/images/2025/HungYiLee/GenAI-ML/02-ContextEngineering/Agent-69.jpg)

![](/images/2025/HungYiLee/GenAI-ML/02-ContextEngineering/Agent-70.jpg)

![](/images/2025/HungYiLee/GenAI-ML/02-ContextEngineering/Agent-71.jpg)

![](/images/2025/HungYiLee/GenAI-ML/02-ContextEngineering/Agent-72.jpg)

![](/images/2025/HungYiLee/GenAI-ML/02-ContextEngineering/Agent-73.jpg)

![](/images/2025/HungYiLee/GenAI-ML/02-ContextEngineering/Agent-74.jpg)

![](/images/2025/HungYiLee/GenAI-ML/02-ContextEngineering/Agent-75.jpg)

- [Introduction to GenAI and ML 2025 Fall](https://speech.ee.ntu.edu.tw/~hylee/GenAI-ML/2025-fall.php)
- [【生成式人工智慧與機器學習導論2025】第 2 講：上下文工程 (Context Engineering) — AI Agent 背後的關鍵技術](https://www.youtube.com/watch?v=gkAyqoQkOSk)
- [李宏毅讲 Context Engineering](https://www.bilibili.com/video/BV1Wtncz1Erk)
