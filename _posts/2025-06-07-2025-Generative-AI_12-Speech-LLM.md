---
layout: single
title:  "【生成式AI时代下的机器学习(2025)】第十二讲：概述语音语言模型发展历程"
date:   2025-06-07 10:00:00 +0800
categories: SpeechLLM 2025生成式AI时代下的机器学习
tags: [SpeechLLM, 2025生成式AI时代下的机器学习, 生成式AI, 机器学习, 李宏毅]
---

本文档提供了关于**语音大型语言模型 (Speech LLM)** 的全面概述。内容从**语音标记化 (speech tokenization)** 的基本概念开始，这是一种将连续语音信号转换为离散单元的方法。文中还讨论了各种**语音标记器类型 (types of speech tokenizers)**，包括 SSL 和神经编码器，并探讨了不同的**解码策略 (decoding strategies)** 对生成质量的影响。此外，还深入分析了**训练语音 LLM 的方法 (methods for training Speech LLM)**，包括如何利用**文本 LLM (Text LLM)** 作为基础模型，并通过**反馈对齐 (alignment with feedback)** 优化模型。最后，概述还触及了**全双工语音对话 (full-duplex speech conversation)** 等前沿应用，并提供了**评估语音模型 (evaluating speech models)** 的框架。

<!--more-->

![](/images/2025/HungYiLee/12-SpeechLLM/01.jpg)

![](/images/2025/HungYiLee/12-SpeechLLM/02.jpg)

![](/images/2025/HungYiLee/12-SpeechLLM/03.jpg)

![](/images/2025/HungYiLee/12-SpeechLLM/04.jpg)

![](/images/2025/HungYiLee/12-SpeechLLM/05.jpg)

![](/images/2025/HungYiLee/12-SpeechLLM/06.jpg)

![](/images/2025/HungYiLee/12-SpeechLLM/07.jpg)

![](/images/2025/HungYiLee/12-SpeechLLM/08.jpg)

![](/images/2025/HungYiLee/12-SpeechLLM/09.jpg)

![](/images/2025/HungYiLee/12-SpeechLLM/10.jpg)

![](/images/2025/HungYiLee/12-SpeechLLM/11.jpg)

![](/images/2025/HungYiLee/12-SpeechLLM/12.jpg)

![](/images/2025/HungYiLee/12-SpeechLLM/13.jpg)

![](/images/2025/HungYiLee/12-SpeechLLM/14.jpg)

![](/images/2025/HungYiLee/12-SpeechLLM/15.jpg)

![](/images/2025/HungYiLee/12-SpeechLLM/16.jpg)

![](/images/2025/HungYiLee/12-SpeechLLM/17.jpg)

![](/images/2025/HungYiLee/12-SpeechLLM/18.jpg)

![](/images/2025/HungYiLee/12-SpeechLLM/19.jpg)

![](/images/2025/HungYiLee/12-SpeechLLM/20.jpg)

![](/images/2025/HungYiLee/12-SpeechLLM/21.jpg)

![](/images/2025/HungYiLee/12-SpeechLLM/22.jpg)

![](/images/2025/HungYiLee/12-SpeechLLM/23.jpg)

![](/images/2025/HungYiLee/12-SpeechLLM/24.jpg)

![](/images/2025/HungYiLee/12-SpeechLLM/25.jpg)

![](/images/2025/HungYiLee/12-SpeechLLM/26.jpg)

![](/images/2025/HungYiLee/12-SpeechLLM/27.jpg)

![](/images/2025/HungYiLee/12-SpeechLLM/28.jpg)

![](/images/2025/HungYiLee/12-SpeechLLM/29.jpg)

![](/images/2025/HungYiLee/12-SpeechLLM/30.jpg)

![](/images/2025/HungYiLee/12-SpeechLLM/31.jpg)

![](/images/2025/HungYiLee/12-SpeechLLM/32.jpg)

![](/images/2025/HungYiLee/12-SpeechLLM/33.jpg)

![](/images/2025/HungYiLee/12-SpeechLLM/34.jpg)

![](/images/2025/HungYiLee/12-SpeechLLM/35.jpg)

![](/images/2025/HungYiLee/12-SpeechLLM/36.jpg)

![](/images/2025/HungYiLee/12-SpeechLLM/37.jpg)

![](/images/2025/HungYiLee/12-SpeechLLM/38.jpg)

![](/images/2025/HungYiLee/12-SpeechLLM/39.jpg)

![](/images/2025/HungYiLee/12-SpeechLLM/40.jpg)

![](/images/2025/HungYiLee/12-SpeechLLM/41.jpg)

![](/images/2025/HungYiLee/12-SpeechLLM/42.jpg)

![](/images/2025/HungYiLee/12-SpeechLLM/43.jpg)

![](/images/2025/HungYiLee/12-SpeechLLM/44.jpg)

![](/images/2025/HungYiLee/12-SpeechLLM/45.jpg)

![](/images/2025/HungYiLee/12-SpeechLLM/46.jpg)

![](/images/2025/HungYiLee/12-SpeechLLM/47.jpg)

![](/images/2025/HungYiLee/12-SpeechLLM/48.jpg)

![](/images/2025/HungYiLee/12-SpeechLLM/49.jpg)

![](/images/2025/HungYiLee/12-SpeechLLM/50.jpg)

![](/images/2025/HungYiLee/12-SpeechLLM/51.jpg)

![](/images/2025/HungYiLee/12-SpeechLLM/52.jpg)

![](/images/2025/HungYiLee/12-SpeechLLM/53.jpg)

![](/images/2025/HungYiLee/12-SpeechLLM/54.jpg)

![](/images/2025/HungYiLee/12-SpeechLLM/55.jpg)

![](/images/2025/HungYiLee/12-SpeechLLM/56.jpg)

![](/images/2025/HungYiLee/12-SpeechLLM/57.jpg)

![](/images/2025/HungYiLee/12-SpeechLLM/58.jpg)

![](/images/2025/HungYiLee/12-SpeechLLM/59.jpg)

![](/images/2025/HungYiLee/12-SpeechLLM/60.jpg)

![](/images/2025/HungYiLee/12-SpeechLLM/61.jpg)

![](/images/2025/HungYiLee/12-SpeechLLM/62.jpg)

![](/images/2025/HungYiLee/12-SpeechLLM/63.jpg)

![](/images/2025/HungYiLee/12-SpeechLLM/64.jpg)

![](/images/2025/HungYiLee/12-SpeechLLM/65.jpg)

![](/images/2025/HungYiLee/12-SpeechLLM/66.jpg)

![](/images/2025/HungYiLee/12-SpeechLLM/67.jpg)

- [【生成式AI時代下的機器學習(2025)】第十二講：語言模型如何學會說話 — 概述語音語言模型發展歷程](https://www.youtube.com/watch?v=gkAyqoQkOSk)
