---
layout: single
title:  "SDXL Turbo"
date:   2023-12-20 08:00:00 +0800
categories: SDXL-Turbo
tags: [SDXL-Turbo, Diffusion]
---

- [SDXL-Turbo 模型](https://huggingface.co/stabilityai/sdxl-turbo)
- [SDXL-Turbo 代码](https://github.com/Stability-AI/generative-models)
- [Clipdrop SDXL TURBO Real-Time Text-to-Image Generation](https://clipdrop.co/stable-diffusion-turbo)
- [Stable Diffusion 台灣社群v2](https://www.facebook.com/groups/sdaitw/)


## 下载代码
```shell
git clone https://github.com/Stability-AI/generative-models.git Stability-AI/generative-models
cd Stability-AI/generative-models/
```

## 创建虚拟环境
```shell
python -m venv env
source env/bin/activate
pip install -r requirements/pt2.txt
pip install .
```

**Apple Silicon 上没有安装成功，安装包 triton 不支持**

## 下载模型

```shell
pip install "huggingface_hub[cli]"
```

### [SDXL-Turbo](https://huggingface.co/stabilityai/sdxl-turbo)
```shell
huggingface-cli download stabilityai/sdxl-turbo --local-dir checkpoints --local-dir-use-symlinks False
```

### [CLIP](https://huggingface.co/openai/clip-vit-large-patch14)
```shell
huggingface-cli download openai/clip-vit-large-patch14 --local-dir openai/clip-vit-large-patch14 --local-dir-use-symlinks False
```

### [CLIP ViT-bigG/14 - LAION-2B](https://huggingface.co/laion/CLIP-ViT-bigG-14-laion2B-39B-b160k)
```shell
huggingface-cli download laion/CLIP-ViT-bigG-14-laion2B-39B-b160k --local-dir laion/CLIP-ViT-bigG-14-laion2B-39B-b160k --local-dir-use-symlinks False
```

## 运行
```shell
streamlit run scripts/demo/turbo.py
```


## 参考资料
- [深入浅出完整解析Stable Diffusion XL（SDXL）核心基础知识](https://zhuanlan.zhihu.com/p/643420260)
- [Stable Diffusion Version 2](https://github.com/Stability-AI/stablediffusion)
- [Stable Diffusion 2.1 Demo](https://huggingface.co/spaces/stabilityai/stable-diffusion)
- [Stable Diffusion v1-5](https://huggingface.co/runwayml/stable-diffusion-v1-5)
- [SDXL1.0大模型的发布能给Stable Diffusion带来全新的使用体验吗？](https://zhuanlan.zhihu.com/p/652549306)
