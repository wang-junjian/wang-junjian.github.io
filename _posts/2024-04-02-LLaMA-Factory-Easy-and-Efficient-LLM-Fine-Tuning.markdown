---
layout: post
title:  "LLaMA Factory: Easy and Efficient LLM Fine-Tuning"
date:   2024-04-02 08:00:00 +0800
categories: 
tags: []
---

- [LLaMA Factory](https://github.com/hiyouga/LLaMA-Factory/blob/main/README_zh.md)

## 安装
    
```bash
git clone https://github.com/hiyouga/LLaMA-Factory.git

conda create -n llama_factory python=3.10
conda activate llama_factory

cd LLaMA-Factory
pip install -r requirements.txt
```

## 使用

### LLaMA Board

#### 本地启动

```bash
CUDA_VISIBLE_DEVICES=0 USE_MODELSCOPE_HUB=1 python src/train_web.py
```
- CUDA_VISIBLE_DEVICES=0: 指定 GPU
- USE_MODELSCOPE_HUB=1: 使用魔搭社区的模型和数据集下载

#### 浏览器访问
http://localhost:7860

#### 微调模型

![](../images/2024/LLaMA-Factory/LLaMA-Factory-Fine-Tuning.png)

#### 聊天

![](../images/2024/LLaMA-Factory/LLaMA-Factory-Chat.png)

