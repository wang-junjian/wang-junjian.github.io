---
layout: single
title:  "【生成式AI时代下的机器学习(2025)】第十讲：人工智慧的微创手术 — 浅谈 Model Editing"
date:   2025-06-07 07:00:00 +0800
categories: 模型编辑 2025生成式AI时代下的机器学习
tags: [模型编辑, 2025生成式AI时代下的机器学习, 生成式AI, 机器学习, 李宏毅]
---

本文档深入探讨了**模型编辑**，这是一种用于**更新人工智能模型知识**的技术，而不需进行**完全重新训练**。它们首先通过对比**模型编辑**与传统的**后训练（Post Training）**来解释其概念，其中前者侧重于**植入特定事实**，而后者旨在**学习新技能**。接着详细阐述了**模型编辑的评估标准**，包括**可靠性、泛化性和局部性**，并介绍了两种主要方法：**不改变模型参数**和**改变模型参数**。展示了**Rank-One Model Editing (ROME)** 方法，它通过**直接修改模型内部参数**来实现知识更新。最后，还介绍了**超网络（Hypernetwork）**，这是一种让**人工智能学习如何进行模型编辑**的技术，展示了其训练和测试过程。

<!--more-->

![](/images/2025/HungYiLee/10-ModelEditing/01.jpg)

![](/images/2025/HungYiLee/10-ModelEditing/02.jpg)

![](/images/2025/HungYiLee/10-ModelEditing/03.jpg)

![](/images/2025/HungYiLee/10-ModelEditing/04.jpg)

![](/images/2025/HungYiLee/10-ModelEditing/05.jpg)

![](/images/2025/HungYiLee/10-ModelEditing/06.jpg)

![](/images/2025/HungYiLee/10-ModelEditing/07.jpg)

![](/images/2025/HungYiLee/10-ModelEditing/08.jpg)

![](/images/2025/HungYiLee/10-ModelEditing/09.jpg)

![](/images/2025/HungYiLee/10-ModelEditing/10.jpg)

![](/images/2025/HungYiLee/10-ModelEditing/11.jpg)

![](/images/2025/HungYiLee/10-ModelEditing/12.jpg)

![](/images/2025/HungYiLee/10-ModelEditing/13.jpg)

![](/images/2025/HungYiLee/10-ModelEditing/14.jpg)

![](/images/2025/HungYiLee/10-ModelEditing/15.jpg)

![](/images/2025/HungYiLee/10-ModelEditing/16.jpg)

![](/images/2025/HungYiLee/10-ModelEditing/17.jpg)

![](/images/2025/HungYiLee/10-ModelEditing/18.jpg)

![](/images/2025/HungYiLee/10-ModelEditing/19.jpg)

![](/images/2025/HungYiLee/10-ModelEditing/20.jpg)

![](/images/2025/HungYiLee/10-ModelEditing/21.jpg)

![](/images/2025/HungYiLee/10-ModelEditing/22.jpg)

![](/images/2025/HungYiLee/10-ModelEditing/23.jpg)

![](/images/2025/HungYiLee/10-ModelEditing/24.jpg)

![](/images/2025/HungYiLee/10-ModelEditing/25.jpg)

![](/images/2025/HungYiLee/10-ModelEditing/26.jpg)

![](/images/2025/HungYiLee/10-ModelEditing/27.jpg)

![](/images/2025/HungYiLee/10-ModelEditing/28.jpg)

![](/images/2025/HungYiLee/10-ModelEditing/29.jpg)

![](/images/2025/HungYiLee/10-ModelEditing/30.jpg)

![](/images/2025/HungYiLee/10-ModelEditing/31.jpg)

![](/images/2025/HungYiLee/10-ModelEditing/32.jpg)

![](/images/2025/HungYiLee/10-ModelEditing/33.jpg)

![](/images/2025/HungYiLee/10-ModelEditing/34.jpg)

![](/images/2025/HungYiLee/10-ModelEditing/35.jpg)

- [【生成式AI時代下的機器學習(2025)】第十講：人工智慧的微創手術 — 淺談 Model Editing](https://www.youtube.com/watch?v=9HPsz7F0mJg)
