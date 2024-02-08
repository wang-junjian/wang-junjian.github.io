---
layout: post
title:  "OLMo - Open Language Model"
date:   2024-02-04 08:00:00 +0800
categories: OLMo LLM
tags: [OLMo, LLM, AI2]
---

## [Open Language Model: OLMo](https://allenai.org/olmo)
- [OLMo: Accelerating the Science of Language Models](https://arxiv.org/abs/2402.00838)
- [Dataset](https://huggingface.co/datasets/allenai/dolma)
- [Models: OLMo Suite](https://huggingface.co/collections/allenai/olmo-suite-65aeaae8fe5b6b2122b46778)
- [Weights: OLMo-7B](https://huggingface.co/allenai/OLMo-7B)
- [Code](https://github.com/allenai/OLMo)
- [OLMo-Eval](https://github.com/allenai/OLMo-Eval)
- [open-instruct](https://github.com/allenai/open-instruct)

开放语言模型 (OLMo) - AI2 LLM 框架旨在提供对通过开放研究推进人工智能所需的数据、训练代码、模型和评估代码的访问，使学者和研究人员能够共同研究语言模型科学。


## Dolma：开放语料库
- [Dolma Dataset](https://huggingface.co/datasets/allenai/dolma)
- [Dolma Toolkit](https://github.com/allenai/dolma)
- [Dolma Toolkit Documentation](https://github.com/allenai/dolma/tree/main/docs)
- [Dolma Paper](https://arxiv.org/abs/2402.00159)
- [WIMBD: What's In My Big Data?](https://wimbd.apps.allenai.org/)
- [GitHub WIMBD](https://github.com/allenai/wimbd)

Dolma，OLMo 预训练数据集。Dolma 是一个包含 3 万亿 Tokens 的开放数据集，这些 Tokens 来自各种网络内容、学术出版物、代码、书籍和百科全书材料。

### Summary Statistics (v1.6)

| Source | Doc Type | UTF-8 bytes (GB) | Documents (millions) | Unicode words (billions) | Llama tokens (billions) |
| ------ | -------- | :--------------: | :------------------: | :----------------------: | :---------------------: |
| Common Crawl | web pages | 9,022 | 3,370 | 1,775 | 2,281 |
| The Stack | code | 1,043 | 210 | 260 | 411 |
| C4 | web pages | 790 | 364 | 153 | 198 |
| Reddit | social media | 339 | 377 | 72 | 89 |
| PeS2o | STEM papers | 268 | 38.8 | 50 | 70 |
| Project Gutenberg | books | 20.4 | 0.056 | 4.0 | 6.0 |
| Wikipedia, Wikibooks | encyclopedic | 16.2 | 6.2 | 3.7 | 4.3 |
| Total |  | 11,519 | 4,367 | 2,318 | 3,059 |

### 下载数据集
```bash
DATA_DIR="olmo-data"        # <path_to_your_data_directory>
PARALLEL_DOWNLOADS="10"     # <number_of_parallel_downloads>
DOLMA_VERSION="v1_6-sample" # <version_of_dolma_to_download>

git clone https://huggingface.co/datasets/allenai/dolma ~/HuggingFace/datasets/allenai/dolma
cd ~/HuggingFace/datasets/allenai/dolma
mkdir -p "${DATA_DIR}"

cat "urls/${DOLMA_VERSION}.txt" | xargs -n 1 -P "${PARALLEL_DOWNLOADS}" wget -q -P "$DATA_DIR"
```

### 使用数据集
```python
import os
from datasets import load_dataset

os.environ["DATA_DIR"] = "<path_to_your_data_directory>"
dataset = load_dataset("allenai/dolma", split="train")
```

### Dolma Toolkit（支持预训练 AI 模型的数据集管理）
使用 Dolma Toolkit 进行数据集管理通常有四个步骤：

1. 使用标记器（taggers），数据集中的文档段落用属性标记（例如，它们所在的语言、毒性等）；
2. 根据内容或元数据对文档进行去重（deduplicated）；
3. 使用混合器（mixer），根据属性的值删除或过滤文档；
4. 最后，可以使用任何 HuggingFace 兼容的分词器（tokenizer）对文档进行分词。

![](../images/2024/OLMo/dolma-toolkit-diagram.webp)

#### Taggers
- [Gopher](https://arxiv.org/abs/2112.11446)
- [C4](https://arxiv.org/abs/1910.10683)
- [OpenWebText](https://openwebtext2.readthedocs.io/en/latest/)

#### List of Dirty, Naughty, Obscene, and Otherwise Bad Words
- [List-of-Dirty-Naughty-Obscene-and-Otherwise-Bad-Words](https://github.com/LDNOOBW/List-of-Dirty-Naughty-Obscene-and-Otherwise-Bad-Words)
- [naughty_words_en.txt](https://github.com/allenai/dolma/blob/main/python/dolma/data/naughty_words_en.txt)

#### Language Detection
- [langdetect](https://pypi.org/project/langdetect/)


## [OLMo：训练和推理](https://github.com/allenai/OLMo)


## [OLMo-Eval：评估](https://github.com/allenai/OLMo-Eval)
- [Catwalk](https://github.com/allenai/catwalk) 下游任务评估
- [Paloma](https://arxiv.org/abs/2312.10523) 基于困惑度的评估


## [open-instruct：训练开放指令语言模型](https://github.com/allenai/open-instruct)
### Evaluation
#### 基准评估
- [MMLU](https://github.com/hendrycks/test)
- [Grade School Math (GSM)](https://github.com/openai/grade-school-math)
- [Big-Bench Hard (BBH)](https://github.com/suzgunmirac/BIG-Bench-Hard/tree/main)
- [TydiQA](https://github.com/google-research-datasets/tydiqa)
- [Codex HumanEval](https://github.com/openai/human-eval/tree/master)
- [ToxiGen](https://github.com/microsoft/TOXIGEN)
- [TruthfulQA](https://github.com/sylinrl/TruthfulQA)
- [AlpacaEval](https://github.com/tatsu-lab/alpaca_eval)


## 参考资料
- [OLMo: Accelerating the Science of Language Models](https://www.semanticscholar.org/paper/OLMo%3A-Accelerating-the-Science-of-Language-Models-Groeneveld-Beltagy/ac45bbf9940512d9d686cf8cd3a95969bc313570)
- [Catwalk: A Unified Language Model Evaluation Framework for Many Datasets](https://www.semanticscholar.org/paper/Catwalk%3A-A-Unified-Language-Model-Evaluation-for-Groeneveld-Awadalla/4318e4ab5e2f5e2a50469aa043fe66c0744370a4)
- [Paloma: A Benchmark for Evaluating Language Model Fit](https://www.semanticscholar.org/paper/Paloma%3A-A-Benchmark-for-Evaluating-Language-Model-Magnusson-Bhagia/1a3f7e23ef8f0bf06d0efa0dc174e4e361226ead)
- [Paloma: A Benchmark for Evaluating Language Model Fit](https://arxiv.org/abs/2312.10523)
- [BigScience](https://huggingface.co/bigscience)
- [Pythia: A Suite for Analyzing Large Language Models Across Training and Scaling](https://www.eleuther.ai/papers-blog/pythia-a-suite-for-analyzing-large-language-modelsacross-training-and-scaling)
- [史上首个100%开源大模型重磅登场！破纪录公开代码/权重/数据集/训练全过程，AMD都能训](https://zhuanlan.zhihu.com/p/681329310)
