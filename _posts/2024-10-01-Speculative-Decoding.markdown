---
layout: post
title:  "推测解码 (Speculative Decoding)"
date:   2024-10-01 10:00:00 +0800
categories: SpeculativeDecoding LLM
tags: [SpeculativeDecoding, LLM, Inference]
---

## Speculative Decoding
- [Fast Inference from Transformers via Speculative Decoding](https://arxiv.org/abs/2211.17192)

1. **初步生成**：使用一个小而快速的模型（称为Mq），生成一系列初步的 tokens。这个模型很高效，所以能快速得到结果。
2. **并行评估**：接着，使用一个更大的目标模型（称为Mp）来同时评估Mq生成的所有 tokens。Mp会判断每个 token 的概率，选择那些可能性高的结果。
3. **修正输出**：对于那些被Mq生成但被Mp拒绝的低概率 token，Mp会提供新的替代 token。这一步确保了输出的质量，同时提高了生成的速度。

- [Serving AI models faster with speculative decoding](https://research.ibm.com/blog/speculative-decoding)
    1. **生成多个猜测候选**: 使用一个更小更高效的"草稿"模型或者是主模型本身的最后一层，生成多个可能的下一个token作为猜测。
    2. **并行评估猜测**: 利用主要的大型语言模型（LLM）并行地对这些猜测进行评估，计算每个猜测的概率分布。
    3. **接受或拒绝猜测**: 通过比较每个猜测在 LLM 和草稿模型下的概率，以及生成一个随机数进行判断，决定是否接受该猜测。
    4. **调整并重采样**: 如果所有猜测都被接受，则直接从 LLM 采样下一个token。如果有猜测被拒绝，则从调整后的概率分布中重新采样被拒绝的猜测。
    5. **输出结果**: 最终输出包括所有被接受的猜测以及从 LLM 采样或重采样得到的token。

- [Text Generation Inference -  Speculation](https://huggingface.co/docs/text-generation-inference/conceptual/speculation)
- [推测解码：在不降低准确性的情况下将LLM推理速度提高2 - 3倍](https://developer.aliyun.com/article/1478560)
- [Qwen - 推测性解码 (Speculative Decoding)](https://qwen.readthedocs.io/zh-cn/latest/deployment/tgi.html#speculative-decoding)
