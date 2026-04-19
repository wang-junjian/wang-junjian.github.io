---
layout: single
title:  "RAG 复杂场景下的工作流程和构建知识库的解析方法"
date:   2024-06-30 08:00:00 +0800
categories: LLM RAG
tags: [RAG, RAGFlow, LLM]
---

## RAG 复杂场景下的工作流程

召回模式（选择数据集） → 混合检索（同时进行语义检索和关键词搜索） → 重排序（合并和归一化检索结果）

- 召回模式主要是用于选出与用户问题最相关的数据集，在应用内关联了多个数据集时，可以使用N选1、N选M和多路等召回模式。
    * N 选 1 召回
    * N 选 M 召回
    * 多路召回
- 语义检索是当前主流的向量检索，通过语义相关度进行匹配；关键词搜索是传统的搜索算法，用于精确匹配；混合检索是分别通过两种检索方式在文档中检索出最相关的文本。
- 重排序模型（Rerank Model）用于对查询结果进行语义排序，在混合检索模式下的查询结果需要进行合并和归一化（将数据转换为统一的标准范围或分布，以便更好地进行比较、分析和处理），然后再一起提供给大模型。


## RAG 中构建知识库的解析方法

RAGFlow 是一款基于深度文档理解构建的开源 RAG 引擎，内置了丰富地文档解析方法，可以帮助用户快速构建知识库。

- 基于 Tokens 数进行分割
- 问答对（两列数据，一个提出问题，另一个用于答案）
- 简历（不进行拆分，而是将简历解析为结构化数据）
- 手册（使用最低的部分标题作为对文档进行切片的枢轴，同一部分中的图和表不会被分割，块大小可能会很大）
- 表格（表数据，第一行必须是列标题，列标题必须是有意义的术语，以便我们的大语言模型能够理解）
- 论文（按章节进行拆分，例如摘要、1.1、1.2等）
- 书籍（为每本书设置页面范围、排队无用地部分）
- 法律（法律文件有非常严格的书写格式，使用文本特征来检测分割点）
- 演示文稿（每个页面都将被视为一个块。 并且每个页面的缩略图都会被存储）
- 图像（如果图片中有文字，则应用 OCR 提取文字作为其文字描述；如果 OCR 提取的文本不够，使用视觉 LLM 来获取描述）
- One（对于一个文档，它将被视为一个完整的块，根本不会被分割）


## 参考资料
- [混合检索](https://docs.dify.ai/v/zh-hans/learn-more/extended-reading/retrieval-augment/hybrid-search)
- [重排序](https://docs.dify.ai/v/zh-hans/learn-more/extended-reading/retrieval-augment/rerank)
- [召回模式](https://docs.dify.ai/v/zh-hans/learn-more/extended-reading/retrieval-augment/retrieval)
- [RAGFlow - Build Generative AI into Your Business](https://ragflow.io/)
- [RAGFlow GitHub](https://github.com/infiniflow/ragflow)
