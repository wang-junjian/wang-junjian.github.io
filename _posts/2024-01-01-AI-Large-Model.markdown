---
layout: post
title:  "AI 大模型"
date:   2024-01-01 08:00:00 +0800
categories: LLM Leaderboard
tags: [LLM, CodeLLM, EmbeddingLLM, Leaderboard]
---

## 🔶 大模型
### SLM
- [microsoft/phi-2](https://huggingface.co/microsoft/phi-2)
- [Qwen/Qwen-1_8B-Chat](https://huggingface.co/Qwen/Qwen-1_8B-Chat)
- [TinyLlama/TinyLlama-1.1B-Chat-v1.0](https://huggingface.co/TinyLlama/TinyLlama-1.1B-Chat-v1.0)

### LLM
- [THUDM/chatglm3-6b](https://huggingface.co/THUDM/chatglm3-6b)
- [Qwen/Qwen-7B-Chat](https://huggingface.co/Qwen/Qwen-7B-Chat)
- [deepseek-ai/deepseek-llm-7b-chat](https://huggingface.co/deepseek-ai/deepseek-llm-7b-chat)
- [baichuan-inc/Baichuan2-7B-Chat](https://huggingface.co/baichuan-inc/Baichuan2-7B-Chat)
- [baichuan-inc/Baichuan2-13B-Chat](https://huggingface.co/baichuan-inc/Baichuan2-13B-Chat)
- [mistralai/Mixtral-8x7B-Instruct-v0.1](https://huggingface.co/mistralai/Mixtral-8x7B-Instruct-v0.1)
- [01-ai/Yi-6B-Chat](https://huggingface.co/01-ai/Yi-6B-Chat)
- [lmsys/vicuna-7b-v1.5](https://huggingface.co/lmsys/vicuna-7b-v1.5)

#### 对话 LLM 排行榜 ([Open LLM Leaderboard](https://huggingface.co/spaces/HuggingFaceH4/open_llm_leaderboard))

| Model | Average | ARC | HellaSwag | MMLU | TruthfulQA | Winogrande | GSM8K |
| --- | --- | --- | --- | --- | --- | --- | --- |
| mistralai/Mistral-7B-Instruct-v0.2 | 65.71 | 63.14 | 84.88 | 60.78 | 68.26 | 77.19 | 40.03 |
| 01-ai/Yi-34B-Chat     | 65.32 | 65.44 | 84.16 | 74.9  | 55.37 | 80.11 | 31.92 |
| Qwen/Qwen1.5-14B-Chat | 62.37 | 58.79 | 82.33 | 68.52 | 60.38 | 73.32 | 30.86 |
| 01-ai/Yi-6B-200K      | 56.76 | 53.75 | 75.57 | 64.65 | 41.56 | 73.64 | 31.39 |
| Qwen/Qwen1.5-7B-Chat  | 55.15 | 55.89 | 78.56 | 61.65 | 53.54 | 67.72 | 13.57 |
| 01-ai/Yi-6B           | 54.08 | 55.55 | 76.57 | 64.11 | 41.96 | 74.19 | 12.13 |
| deepseek-ai/deepseek-llm-7b-chat | 59.38 | 55.8  | 79.38 | 51.75 | 47.98 | 74.82 | 46.55 |
| internlm/internlm-20b-chat | 55.53 | 55.38 | 78.58 | 58.53 | 43.22 | 78.77 | 18.73 |
| deepseek-ai/deepseek-coder-7b-instruct-v1.5 | 50.89 | 48.55 | 72.35 | 50.45 | 46.73 | 66.85 | 20.39 |

- **Average:** 这个指标可能指的是模型在多个任务上的平均表现。在评估LLM时，通常会在多个不同的任务或数据集上测试模型，然后计算这些任务的平均得分，以得到一个综合的性能指标。

- **ARC (AI2 Reasoning Challenge):** ARC是一个用于评估模型在复杂推理任务上的表现的基准。它包含了多种类型的逻辑和数学问题，旨在测试模型的推理能力，包括数量推理、物理推理和抽象推理等。

- **HellaSwag:** HellaSwag是一个多步推理任务，要求模型预测给定情境的后续事件。这个任务测试了模型对常识、因果关系和事件连贯性的理解能力。

- **MMLU (Massive Multitask Language Understanding):** MMLU是一个大规模的多任务语言理解基准，它包含了多种类型的自然语言处理任务，如情感分析、文本分类、问答等。这个指标旨在评估模型在处理多样化语言任务时的泛化能力。

- **TruthfulQA:** TruthfulQA是一个评估模型在常识问答任务上的表现的基准。它特别关注模型在回答需要外部知识的问题时的准确性和可靠性，以及模型在面对错误信息时的抗干扰能力。

- **Winogrande:** Winogrande是一个阅读理解任务，它包含了需要模型理解文本中的指代消歧和常识推理的问题。这个任务旨在测试模型在理解复杂文本和进行逻辑推理方面的能力。

- **GSM8K:** GSM8K是一个数学问题解答任务，它包含了多种类型的数学问题，要求模型展示其数学推理和计算能力。这个指标评估模型在处理数学概念和执行数学运算方面的表现。

总结：

1. Qwen/Qwen1.5-14B-Chat
这个模型在多个指标上表现均衡，特别是在 ARC 和 HellaSwag 上得分较高，这表明它在推理和常识理解方面具有较强的能力。非常适合日常问答场景。从平衡成本和效果来看也非常有竞争力。

2. mistralai/Mistral-7B-Instruct-v0.2
这个模型在平均得分上表现优异，但在 TruthfulQA 和 Winogrande 等任务上的得分相对较低。这可能意味着它在处理需要外部知识和复杂推理的任务时可能存在局限性。需要进一步验证其中文能力。

3. deepseek-ai/deepseek-coder-7b-instruct-v1.5
这个模型在中文和代码综合能力上表现优秀。非常适合技术或研发相关的问答场景。

4. 在本评估中，重点关注了具有6B至34B参数量的模型。

5. 上述筛选出的大模型需在我们的特定应用场景中进行深入验证，以确认其适应性和可靠性。

#### 对话 LLM 排行榜 ([OpenCompass 2.0 司南大模型评测榜单](https://rank.opencompass.org.cn/leaderboard-llm-v2))
	
| 模型 | 均分 | 语言 | 知识 | 推理 | 数学 | 代码 | 智能体 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Qwen1.5-14B-Chat | 50.3 | 57 | 58.4 | 38.6 | 42.9 | 41.5 | 63.2 |
| InternLM2-Chat-7B | 45 | 51.2 | 48.6 | 34 | 33.8 | 47.8 | 54.7 |
| Yi-34B-Chat | 47.1 | 51.8 | 69.2 | 37.6 | 35.8 | 33.9 | 54.2 |
| Qwen1.5-7B-Chat | 38.9 | 45.7 | 51.2 | 22.9 | 30.6 | 34.5 | 48.4 |
| ChatGLM3-6B-32K | 35.2 | 39.4 | 46.1 | 18 | 25.3 | 39.8 | 42.7 |
| Yi-6B-Chat | 31.9 | 39.2 | 58.1 | 17.9 | 18.4 | 17.7 | 40.2 |
| Mistral-7B-Instruct-v0.2 | 28 | 30.6 | 43 | 17.8 | 17.8 | 19.4 | 39.7 |
| DeepSeek-7B-Chat | 28.8 | 24.8 | 39.4 | 16.2 | 18.5 | 37.4 | 36.6 |


### Code LLM
- [deepseek-ai/deepseek-coder-1.3b-instruct](https://huggingface.co/deepseek-ai/deepseek-coder-1.3b-instruct)
- [deepseek-ai/deepseek-coder-6.7b-instruct](https://huggingface.co/deepseek-ai/deepseek-coder-6.7b-instruct)
- [codellama/CodeLlama-7b-Instruct-hf](https://huggingface.co/codellama/CodeLlama-7b-Instruct-hf)
- [WizardLM/WizardCoder-33B-V1.1](https://huggingface.co/WizardLM/WizardCoder-33B-V1.1)

### Embedding LLM
- [infgrad/stella-base-zh-v2](https://huggingface.co/infgrad/stella-base-zh-v2)
- [sensenova/piccolo-large-zh](https://huggingface.co/sensenova/piccolo-large-zh)
- [BAAI/bge-base-zh-v1.5](https://huggingface.co/BAAI/bge-base-zh-v1.5)
- [moka-ai/m3e-base](https://huggingface.co/moka-ai/m3e-base)

### GGUF
- [TheBloke](https://huggingface.co/TheBloke)

## 🏆 排行榜
### LLM
- [Open LLM Leaderboard](https://huggingface.co/spaces/HuggingFaceH4/open_llm_leaderboard)
- [LMSYS Chatbot Arena Leaderboard](https://huggingface.co/spaces/lmsys/chatbot-arena-leaderboard)
- [OpenCompass 2.0 司南大模型评测榜单](https://rank.opencompass.org.cn/leaderboard-llm-v2)

### Code LLM
- [Coding LLMs Leaderboard](https://leaderboard.tabbyml.com/)

### Embedding LLM
- [Massive Text Embedding Benchmark (MTEB) Leaderboard](https://huggingface.co/spaces/mteb/leaderboard)
