---
layout: post
title:  "SWIFT: Scalable lightWeight Infrastructure for Fine-Tuning"
date:   2024-05-19 08:00:00 +0800
categories: SWIFT Fine-Tuning
tags: [SWIFT, Fine-Tuning, LLM]
---

## 简介

**SWIFT** 支持近200种LLM和MLLM（多模态大模型）的训练、推理、评测和部署。开发者可以直接将我们的框架应用到自己的Research和生产环境中，实现模型训练评测到应用的完整链路。我们除支持了PEFT提供的轻量训练方案外，也提供了一个完整的Adapters库以支持最新的训练技术，如NEFTune、LoRA+、LLaMA-PRO等，这个适配器库可以脱离训练脚本直接使用在自己的自定流程中。

- [SWIFT](https://github.com/modelscope/swift/blob/main/README_CN.md)
- [SWIFT 文档](https://github.com/modelscope/swift/tree/main/docs/source/LLM)


## 安装

```bash
git clone https://github.com/modelscope/swift.git
cd swift
pip install -e '.[llm]'
```

## 支持的模型类型（model_type）

['chinese-alpaca-2-13b-16k', 'chinese-alpaca-2-13b', 'chinese-alpaca-2-7b-64k', 'chinese-alpaca-2-7b-16k', 'chinese-alpaca-2-7b', 'chinese-alpaca-2-1_3b', 'chinese-llama-2-13b-16k', 'chinese-llama-2-13b', 'chinese-llama-2-7b-64k', 'chinese-llama-2-7b-16k', 'chinese-llama-2-7b', 'chinese-llama-2-1_3b', 'c4ai-command-r-plus', 'c4ai-command-r-v01', 'mengzi3-13b-base', 'baichuan-7b', 'baichuan-13b-chat', 'xverse-moe-a4_2b', 'xverse-7b', 'xverse-7b-chat', 'xverse-13b-256k', 'xverse-65b-chat', 'xverse-65b-v2', 'xverse-65b', 'xverse-13b', 'xverse-13b-chat', 'seqgpt-560m', 'bluelm-7b', 'bluelm-7b-32k', 'bluelm-7b-chat', 'bluelm-7b-chat-32k', 'internlm-7b', 'internlm-20b', 'atom-7b-chat', 'atom-7b', 'grok-1', 'mamba-2.8b', 'mamba-1.4b', 'mamba-790m', 'mamba-390m', 'mamba-370m', 'mamba-130m', 'cogagent-18b-instruct', 'cogagent-18b-chat', 'cogvlm-17b-instruct', 'internlm-7b-chat', 'internlm-7b-chat-8k', 'internlm-20b-chat', 'baichuan-13b', 'baichuan2-13b', 'baichuan2-13b-chat', 'baichuan2-7b', 'baichuan2-7b-chat', 'baichuan2-7b-chat-int4', 'baichuan2-13b-chat-int4', 'codegeex2-6b', 'chatglm2-6b', 'chatglm2-6b-32k', 'chatglm3-6b-base', 'chatglm3-6b', 'chatglm3-6b-128k', 'chatglm3-6b-32k', 'codefuse-codegeex2-6b-chat', 'dbrx-instruct', 'dbrx-base', 'mixtral-moe-8x22b-v1', 'mixtral-moe-7b-instruct', 'mixtral-moe-7b', 'mistral-7b-v2', 'mistral-7b', 'mistral-7b-instruct-v2', 'mistral-7b-instruct', 'openbuddy-llama2-13b-chat', 'openbuddy-llama3-8b-chat', 'openbuddy-llama-65b-chat', 'openbuddy-llama2-70b-chat', 'openbuddy-mistral-7b-chat', 'openbuddy-mixtral-moe-7b-chat', 'ziya2-13b', 'ziya2-13b-chat', 'yi-6b', 'yi-9b-200k', 'yi-9b', 'yi-6b-200k', 'yi-34b', 'yi-34b-200k', 'yi-34b-chat-int8', 'yi-34b-chat-awq', 'yi-34b-chat', 'yi-6b-chat-int8', 'yi-6b-chat-awq', 'yi-6b-chat', 'zephyr-7b-beta-chat', 'openbuddy-zephyr-7b-chat', 'sus-34b-chat', 'deepseek-7b', 'deepseek-7b-chat', 'deepseek-67b', 'deepseek-67b-chat', 'openbuddy-deepseek-67b-chat', 'deepseek-coder-33b-instruct', 'deepseek-coder-6_7b-instruct', 'deepseek-coder-1_3b-instruct', 'deepseek-coder-33b', 'deepseek-coder-6_7b', 'deepseek-coder-1_3b', 'qwen1half-moe-a2_7b', 'codeqwen1half-7b', 'qwen1half-110b', 'qwen1half-72b', 'qwen1half-32b', 'qwen1half-14b', 'qwen1half-7b', 'qwen1half-4b', 'qwen1half-1_8b', 'qwen1half-0_5b', 'deepseek-math-7b', 'deepseek-math-7b-chat', 'deepseek-math-7b-instruct', 'gemma-7b-instruct', 'gemma-2b-instruct', 'gemma-7b', 'gemma-2b', 'wizardlm2-7b-awq', 'wizardlm2-8x22b', 'phi3-4b-4k-instruct', 'phi3-4b-128k-instruct', 'minicpm-2b-128k', 'minicpm-1b-sft-chat', 'minicpm-2b-chat', 'minicpm-2b-sft-chat', 'codeqwen1half-7b-chat', 'qwen1half-moe-a2_7b-chat', 'qwen1half-110b-chat', 'qwen1half-72b-chat', 'qwen1half-32b-chat', 'qwen1half-14b-chat', 'qwen1half-7b-chat', 'qwen1half-4b-chat', 'qwen1half-1_8b-chat', 'qwen1half-0_5b-chat', 'codeqwen1half-7b-chat-awq', 'qwen1half-110b-chat-awq', 'qwen1half-72b-chat-awq', 'qwen1half-32b-chat-awq', 'qwen1half-14b-chat-awq', 'qwen1half-7b-chat-awq', 'qwen1half-4b-chat-awq', 'qwen1half-1_8b-chat-awq', 'qwen1half-0_5b-chat-awq', 'qwen1half-moe-a2_7b-chat-int4', 'qwen1half-72b-chat-int8', 'qwen1half-110b-chat-int4', 'qwen1half-72b-chat-int4', 'qwen1half-32b-chat-int4', 'qwen1half-14b-chat-int8', 'qwen1half-14b-chat-int4', 'qwen1half-7b-chat-int8', 'qwen1half-7b-chat-int4', 'qwen1half-4b-chat-int8', 'qwen1half-4b-chat-int4', 'qwen1half-1_8b-chat-int8', 'qwen1half-1_8b-chat-int4', 'qwen1half-0_5b-chat-int8', 'qwen1half-0_5b-chat-int4', 'internlm2-20b-base', 'internlm2-20b', 'internlm2-7b-base', 'internlm2-7b', 'internlm2-20b-chat', 'internlm2-20b-sft-chat', 'internlm2-7b-chat', 'internlm2-7b-sft-chat', 'internlm2-math-20b-chat', 'internlm2-math-7b-chat', 'internlm2-math-20b', 'internlm2-math-7b', 'internlm2-1_8b-chat', 'internlm2-1_8b-sft-chat', 'internlm2-1_8b', 'internvl-chat-v1_5', 'internlm-xcomposer2-7b-chat', 'deepseek-vl-1_3b-chat', 'deepseek-vl-7b-chat', 'llama2-70b-chat', 'llama2-13b-chat', 'llama2-7b-chat', 'llama2-70b', 'llama2-13b', 'llama2-7b', 'mixtral-moe-7b-aqlm-2bit-1x16', 'llama2-7b-aqlm-2bit-1x16', 'llama-3-chinese-8b-instruct', 'llama-3-chinese-8b', 'llama3-8b', 'llama3-8b-instruct', 'llama3-70b', 'llama3-70b-instruct', 'llama3-8b-instruct-int4', 'llama3-8b-instruct-int8', 'llama3-8b-instruct-awq', 'llama3-70b-instruct-int4', 'llama3-70b-instruct-int8', 'llama3-70b-instruct-awq', 'polylm-13b', 'qwen-7b', 'qwen-14b', 'tongyi-finance-14b', 'qwen-72b', 'qwen-1_8b', 'codefuse-qwen-14b-chat', 'modelscope-agent-14b', 'modelscope-agent-7b', 'qwen-7b-chat', 'qwen-14b-chat', 'tongyi-finance-14b-chat', 'qwen-72b-chat', 'qwen-1_8b-chat', 'qwen-vl', 'qwen-vl-chat', 'qwen-audio', 'qwen-audio-chat', 'qwen-7b-chat-int4', 'qwen-14b-chat-int4', 'qwen-7b-chat-int8', 'qwen-14b-chat-int8', 'qwen-vl-chat-int4', 'tongyi-finance-14b-chat-int4', 'qwen-72b-chat-int4', 'qwen-72b-chat-int8', 'qwen-1_8b-chat-int4', 'qwen-1_8b-chat-int8', 'skywork-13b', 'skywork-13b-chat', 'codefuse-codellama-34b-chat', 'telechat-12b', 'phi2-3b', 'telechat-7b', 'minicpm-moe-8x2b', 'deepseek-moe-16b', 'deepseek-moe-16b-chat', 'yuan2-2b-janus-instruct', 'yuan2-102b-instruct', 'yuan2-51b-instruct', 'yuan2-2b-instruct', 'orion-14b-chat', 'orion-14b', 'yi-vl-6b-chat', 'yi-vl-34b-chat', 'minicpm-v-v2', 'minicpm-v-3b-chat', 'llava1d6-mistral-7b-instruct', 'llava1d6-yi-34b-instruct', 'mplug-owl2d1-chat', 'mplug-owl2-chat']


## 推理

```bash
CUDA_VISIBLE_DEVICES=3 swift infer \
    --model_type qwen1half-4b-chat \
    --model_id_or_path qwen/Qwen1.5-4B-Chat
```


## 参考资料
- [MiniCPM-V](https://github.com/OpenBMB/MiniCPM-V/blob/main/README.md)
- [MiniCPM-V-2 最佳实践](https://github.com/modelscope/swift/blob/main/docs/source/Multi-Modal/minicpm-v-2%E6%9C%80%E4%BD%B3%E5%AE%9E%E8%B7%B5.md)
