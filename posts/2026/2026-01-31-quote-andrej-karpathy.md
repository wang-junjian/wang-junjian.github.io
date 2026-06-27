---
type: quote
author: Andrej Karpathy
title: 发表于 Twitter/X 的推文（关于 GPT-2 训练成本下降）
linkUrl: https://twitter.com/karpathy/status/2017703360393318587
date: 2026-01-31 12:00:00 +0800
tags: [ai, openai, andrej-karpathy, generative-ai, llms, gpt-2]
---

最初在 2019 年，OpenAI 使用 32 块 TPU v3 芯片训练了 168 小时（7 天），当时每块 TPU v3 每小时 8 美元，总成本约为 4.3 万美元。它达到了 0.256525 的 CORE 分数，这是 DCLM 论文中提出的一个综合指标，涵盖了 ARC/MMLU 等 22 项评测。

随着最近合并到 nanochat 的多项改进（其中许多来自 modded-nanogpt 仓库），我现在可以在单个 8XH100 节点上用 3.04 小时（约 73 美元）达到更高的 CORE 分数。这意味着在 7 年内成本降低了 600 倍，也就是说，训练 GPT-2 的成本大约每年下降 2.5 倍。**来源**: [Simon Willison 的网络日志](https://simonwillison.net/2026/Jan/31/andrej-karpathy/)
