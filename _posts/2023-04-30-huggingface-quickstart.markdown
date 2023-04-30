---
layout: post
title:  "Hugging Face Quickstart"
date:   2023-04-30 08:00:00 +0800
categories: HuggingFace
tags: [Quickstart]
---

## [Hugging Face](https://huggingface.co/)
Hugging Face 是所有机器学习任务的大本营。 您可以在这里找到开始一项任务所需的内容：演示、用例、模型、数据集等等！

### [Models](https://huggingface.co/models)

### [Datasets](https://huggingface.co/datasets)

### [Spaces](https://huggingface.co/spaces)
创建和托管很棒的机器学习演示

### [Documentations](https://huggingface.co/docs)

### Solutions
#### [Expert Acceleration Program（专家加速计划）- 加速您的 ML 路线图](https://huggingface.co/support)
从我们屡获殊荣的机器学习专家那里获得指导。我们组建了一个世界一流的团队，帮助客户更快地构建更好的 ML 解决方案。

机器学习的成功取决于为用例找到最佳架构、微调模型并将它们部署到生产环境中。 所有这些都需要经验和技能的正确结合。 我们的专家加速计划提供必要的技术专长，以实施最先进的技术、做出更好的决策并更快地进入市场。

* 如何为我的用例微调（fine-tune）模型？
哪些基础架构（base architectures）？多少训练数据？

* 如何优化我的模型以获得最小延迟（latency）？
蒸馏（Distillation）。汇编（Compilation）。量化（Quantization）。修剪（Pruning）。
我们可以指导您完成每一步。

* 如何优化我的生产环境？
调整您的 CPU、GPU 或 AI 加速器配置以获得最大性能。

* 如何在 SageMaker 中使用 Transformers？
模型并行性（model parallelism）、数据并行性（data parallelism）、部署（deployment）等。

* 我如何检测和减轻数据集和模型中的偏见（bias）？
我们可以帮助您让人工智能更负责任。

#### [Inference Endpoints（推理端点）- 在几分钟内部署模型](https://ui.endpoints.huggingface.co/welcome)
Inference Endpoints 提供了一个安全的生产解决方案，可以在由 Hugging Face 管理的专用和自动缩放基础设施上轻松部署来自 Hub 的任何 Transformers、Sentence-Transformers 和 Diffusion 模型，通过选择云、区域、计算实例、自动缩放范围和安全级别以匹配您的模型、延迟、吞吐量和合规性需求。

![](/images/2023/huggingface/creation_flow.png)

* [开发文档](https://huggingface.co/docs/inference-endpoints/index)

#### [AutoTrain（自动训练）- 无需代码即可创建 ML 模型](https://huggingface.co/autotrain)
一种自动训练、评估和部署最先进的机器学习模型的新方法。

#### [Hardware（硬件）- 使用专用硬件进行扩展](https://huggingface.co/hardware)
Hugging Face 与领先的 AI 硬件加速器合作，以实现最先进的生产性能。

硬件专用加速工具
1. 量化（Quantize）

利用英特尔® Neural Compressor 的训练后量化、量化感知训练和动态量化，在对准确性影响最小的情况下更快地建立模型。

2. 修剪（Prune）

使模型更小，对准确性的影响最小，通过英特尔® Neural Compressor 使用简单易用的配置来消除模型权重。

3. 训练（Train）

使用最新一代 AI 专用硬件 Graphcore 智能处理单元 (IPU) 以前所未有的速度训练模型，利用内置的 IPUTrainer API 训练或微调 transformers 模型。

## [Tasks](https://huggingface.co/tasks)
### Computer Vision（计算机视觉）
* Depth Estimation（深度估计）
* Image Classification（图像分类）
* Image Segmentation（图像分割）
* Image-to-Image（图像到图像）
* Object Detection（物体检测）
* Video Classification（视频分类）
* Unconditional Image Generation（无条件图像生成）
* Zero-Shot Image Classification（零样本图像分类）

### Natural Language Processing（自然语言处理）
* Conversational（对话）
* Fill-Mask（填充遮罩）
* Question Answering（问答）
* Sentence Similarity（句子相似度）
* Summarization（总结）
* Table Question Answering（表格问答）
* Text Classification（文本分类）
* Text Generation（文本生成）
* Token Classification（Token 分类）
* Translation（翻译）
* Zero-Shot Classification（零样本分类）

### Audio（声音）
* Audio Classification（音频分类）
* Audio-to-Audio（音频到音频）
* Automatic Speech Recognition（语音识别）
* Text-to-Speech（文本转语音）

### Tabular（表格）
* Tabular Classification（表格分类）
* Tabular Regression（表格回归）

### Multimodal（多模态）
* Document Question Answering（文档问答）
* Feature Extraction（特征提取）
* Image-to-Text（图像到文本）
* Text-to-Image（文本到图像）
* Visual Question Answering（视觉问答）

### Reinforcement Learning（强化学习）
* Reinforcement Learning（强化学习）

## [Metrics](https://huggingface.co/metrics)

## 社区
### Blog [英文](https://huggingface.co/blog) [中文](https://huggingface.co/blog/zh)
### [学习](https://huggingface.co/learn)
#### [HuggingLLM](https://github.com/datawhalechina/hugging-llm)
#### [自然语言处理课程](https://huggingface.co/learn/nlp-course)
#### [深度强化学习课程](https://huggingface.co/learn/deep-rl-course)
### [Discord](https://huggingface.co/join/discord)
### [Classrooms](https://huggingface.co/classrooms)
### [论坛](https://discuss.huggingface.co)
### [GitHub](https://github.com/huggingface)
### 中文 Spaces
* [HuggingGPT](https://huggingface.co/spaces/microsoft/HuggingGPT)
* [ChatGLM-6B](https://huggingface.co/THUDM/chatglm-6b)
* [RWKV](https://huggingface.co/spaces/BlinkDL/Raven-RWKV-7B)
* [ChatYuan](https://huggingface.co/spaces/ClueAI/ChatYuan-large-v2)
* [ModelScope Text to Video Synthesis](https://huggingface.co/spaces/damo-vilab/modelscope-text-to-video-synthesis)
* [川虎Chat](https://huggingface.co/spaces/JohnSmith9982/ChuanhuChatGPT)
* [ChatGPT 学术优化](https://huggingface.co/spaces/qingxu98/gpt-academic)

## 开发
### 在 Spaces 中开发应用
#### [Gradio](https://gradio.app/)
#### [Streamlit](https://streamlit.io/)

### [Pipelines](https://huggingface.co/docs/transformers/main/en/main_classes/pipelines)
```py
from transformers import pipeline

pipe = pipeline("text-classification")
pipe("This restaurant is awesome")
```
```
[{'label': 'POSITIVE', 'score': 0.9998743534088135}]
```

### [Inference API](https://huggingface.co/docs/api-inference/index)
通过简单的 HTTP 请求，免费测试和评估超过 80,000 个可公开访问的机器学习模型，或您自己的私有模型，并在 Hugging Face 共享基础设施上进行快速推理。
推理 API 是免费使用的，并且有速率限制。

### 文档
* [Documentations](https://huggingface.co/docs)
* [Transformers](https://huggingface.co/docs/transformers/index)
* [Inference API](https://huggingface.co/docs/api-inference/index)
