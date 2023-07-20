---
layout: post
title:  "在 MacBook Pro M2 Max 上测试 ChatGLM2-6B"
date:   2023-07-18 08:00:00 +0800
categories: ChatGLM2-6B
tags: [ChatGLM, GLM, ChatGPT, MacBookProM2Max]
---

## [ChatGLM2-6B](https://github.com/THUDM/ChatGLM2-6B)
ChatGLM2-6B 是开源中英双语对话模型 ChatGLM-6B 的第二代版本，在保留了初代模型对话流畅、部署门槛较低等众多优秀特性的基础之上，ChatGLM2-6B 引入了如下新特性：

1. 更强大的性能：基于 ChatGLM 初代模型的开发经验，我们全面升级了 ChatGLM2-6B 的基座模型。ChatGLM2-6B 使用了 GLM 的混合目标函数，经过了 1.4T 中英标识符的预训练与人类偏好对齐训练，评测结果显示，相比于初代模型，ChatGLM2-6B 在 MMLU（+23%）、CEval（+33%）、GSM8K（+571%） 、BBH（+60%）等数据集上的性能取得了大幅度的提升，在同尺寸开源模型中具有较强的竞争力。
2. 更长的上下文：基于 FlashAttention 技术，我们将基座模型的上下文长度（Context Length）由 ChatGLM-6B 的 2K 扩展到了 32K，并在对话阶段使用 8K 的上下文长度训练，允许更多轮次的对话。但当前版本的 ChatGLM2-6B 对单轮超长文档的理解能力有限，我们会在后续迭代升级中着重进行优化。
3. 更高效的推理：基于 Multi-Query Attention 技术，ChatGLM2-6B 有更高效的推理速度和更低的显存占用：在官方的模型实现下，推理速度相比初代提升了 42%，INT4 量化下，6G 显存支持的对话长度由 1K 提升到了 8K。

### 克隆
```bash
git clone https://github.com/THUDM/ChatGLM2-6B
cd ChatGLM2-6B
```

### 下载模型
```bash
mkdir THUDM && cd THUDM
git clone https://huggingface.co/THUDM/chatglm2-6b
cd THUDM
```

### 创建虚拟环境
```bash
python -m venv venv
source venv/bin/activate
```

### 安装依赖包
```bash
pip install -r requirements.txt
```

### 使用 MPS
```py
model = AutoModel.from_pretrained("THUDM/chatglm2-6b", trust_remote_code=True).half().to('mps')
```

### 运行 DEMO
```bash
python web_demo.py
```
