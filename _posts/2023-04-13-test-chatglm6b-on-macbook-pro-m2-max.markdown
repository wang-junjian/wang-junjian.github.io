---
layout: post
title:  "在 MacBook Pro M2 Max 上测试 ChatGLM-6B"
date:   2023-04-13 08:00:00 +0800
categories: ChatGLM-6B
tags: [ChatGLM, GLM, ChatGPT, MacBookProM2Max]
---

ChatGLM-6B 是一个开源的、支持中英双语的对话语言模型，基于 General Language Model (GLM) 架构，具有 62 亿参数。

## 下载 [ChatGLM-6B](https://github.com/THUDM/ChatGLM-6B)
```bash
https://github.com/THUDM/ChatGLM-6B.git
cd ChatGLM-6B
```

### 下载模型
* 从 [Hugging Face Hub](https://huggingface.co/THUDM/chatglm-6b) 下载模型

```bash
git clone https://huggingface.co/THUDM/chatglm-6b THUDM/chatglm-6b
```

* 在国内为了加快下载速度，模型文件可以单独从 [清华云](https://cloud.tsinghua.edu.cn/d/fb9f16d6dc8f482596c2/?p=%2F&mode=list) 下载。

```bash
GIT_LFS_SKIP_SMUDGE=1 git clone https://huggingface.co/THUDM/chatglm-6b THUDM/chatglm-6b

wget "https://cloud.tsinghua.edu.cn/d/fb9f16d6dc8f482596c2/files/?p=%2Fice_text.model&dl=1" -O THUDM/chatglm-6b/ice_text.model
for i in {1..8}; do wget "https://cloud.tsinghua.edu.cn/d/fb9f16d6dc8f482596c2/files/?p=%2Fpytorch_model-0000${i}-of-00008.bin&dl=1" -O THUDM/chatglm-6b/pytorch_model-0000${i}-of-00008.bin; done
```

## 搭建环境
### 创建虚拟环境
```bash
conda create --name pytorch python
conda activate pytorch
```

### 安装最新版 PyTorch
```bash
pip install --upgrade --pre torch torchvision torchaudio --index-url https://download.pytorch.org/whl/nightly/cpu
```

### 安装依赖
```bash
pip install -r requirements.txt
```

## 运行
需要修改以下文件，指定计算设备：
* cli_demo.py 命令行交互
* web_demo.py Web 交互（Gradio）
* web_demo2.py Web 交互（Streamlit）
* api.py REST API 服务

### CUDA (默认)
```py
model = AutoModel.from_pretrained("THUDM/chatglm-6b", trust_remote_code=True).half().cuda()
```

### MPS
```py
model = AutoModel.from_pretrained("THUDM/chatglm-6b", trust_remote_code=True).half().to('mps')
```

### CPU
```py
model = AutoModel.from_pretrained("THUDM/chatglm-6b", trust_remote_code=True).float()
```

默认对话的最大长度为 2048，所以聊天的时候，如果超过 2048 个字，就会报错。
```
Input length of input_ids is 2059, but `max_length` is set to 2048. This can lead to unexpected behavior. You should consider increasing `max_new_tokens`.
```

## 运行模型的资源使用情况

| 模型参数 | 模型大小 | 量化精度 | CPU | MPS |
| --- | --- | --- | --- | --- |
| 6.2B | 13G | FP16 | 12G | 22G |

使用 MPS 的时候，内存会随着聊天持续增长，直到耗尽。

## FAQ
* RuntimeError: Internal: a\sentencepiece\sentencepiece\src\sentencepiece_processor.cc(1102) [model_proto->ParseFromArray(serialized.data(), serialized.size())]
这个问题是因为我的模型文件分开下载的，我没有从清华云下载 `ice_text.model` 文件，版本不一致导致的。

* RuntimeError: Currently topk on mps works only for k<=16 

我重新安装了最新版的 PyTorch 就可以了。
```bash
pip install --upgrade --pre torch torchvision torchaudio --index-url https://download.pytorch.org/whl/nightly/cpu
```

## 参考资料
* [ChatGLM](https://chatglm.cn/)
* [ChatGLM：千亿基座的对话模型开启内测⸺对应单卡版本开源](https://chatglm.cn/blog)
* [THUDM/ChatGLM-6B](https://github.com/THUDM/ChatGLM-6B)
* [Hugging Face THUDM/chatglm-6b](https://huggingface.co/THUDM/chatglm-6b)
* [THUDM/GLM](https://github.com/THUDM/GLM)
