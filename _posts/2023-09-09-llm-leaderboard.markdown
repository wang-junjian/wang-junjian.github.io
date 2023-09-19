---
layout: post
title:  "LLM Leaderboard"
date:   2023-09-09 08:00:00 +0800
categories: Benchmark
tags: [LLM, Embedding]
---

## [Leaderboards](https://huggingface.co/spaces/autoevaluate/leaderboards)

## LLM
### [Open LLM Leaderboard](https://huggingface.co/spaces/HuggingFaceH4/open_llm_leaderboard)

### [Qwen-7B](https://github.com/QwenLM/Qwen-7B)
### [ChatGLM2-6B](https://github.com/THUDM/ChatGLM2-6B)


## Embedding 模型
### [Massive Text Embedding Benchmark (MTEB) Leaderboard](https://huggingface.co/spaces/mteb/leaderboard)

### [sensenova/piccolo-large-zh](https://huggingface.co/sensenova/piccolo-large-zh)
piccolo是一个通用embedding模型(中文), 由来自商汤科技的通用模型组完成训练。piccolo借鉴了E5以及GTE的训练流程，采用了两阶段的训练方式。 在第一阶段中，我们搜集和爬取了4亿的中文文本对(可视为弱监督文本对数据)，并采用二元组的softmax对比学习损失来优化模型。 在第二阶段中，我们搜集整理了2000万人工标注的中文文本对(精标数据)，并采用带有难负样本的三元组的softmax对比学习损失来帮助模型更好地优化。

### [BAAI/bge-large-zh](https://huggingface.co/BAAI/bge-large-zh)
FlagEmbedding 将任意文本映射为低维稠密向量，以用于检索、分类、聚类或语义匹配等任务，并可支持为大模型调用外部知识。

## 不同的任务
* [google/owlvit-base-patch32](https://huggingface.co/google/owlvit-base-patch32)

## 参考资料
* [Open LLM 排行榜近况](https://huggingface.co/blog/zh/evaluating-mmlu-leaderboard)
* [LLM-Leaderboard](https://llm-leaderboard.streamlit.app/)
* [LLM Leaderboard](https://weightwatcher.ai/leaderboard.html)
* [Llama 2 来袭 - 在 Hugging Face 上玩转它](https://huggingface.co/blog/zh/llama2)
* [Awesome-Chinese-LLM](https://github.com/HqWu-HITCS/Awesome-Chinese-LLM)
