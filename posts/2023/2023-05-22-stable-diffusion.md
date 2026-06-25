---
type: article
title:  "Stable Diffusion"
date:   2023-05-22 08:00:00 +0800
tags: [clip]
---

## Stable Diffusion
### 模型 [Stable Diffusion v1-5](https://huggingface.co/runwayml/stable-diffusion-v1-5)

### 数据集 [LAION-5B](https://laion.ai/blog/laion-5b/)
一个由 58.5 亿个 CLIP 过滤的图像-文本对组成的数据集

### [CLIP Retrieval](https://knn.laion.ai/)
工作原理是将文本查询转换为 CLIP 嵌入，然后使用该嵌入来查询剪辑图像嵌入的 knn 索引，在[搜索演示](https://rom1504.github.io/clip-retrieval/)中搜索数据集。

### Stable Diffusion GUI
* [Diffusion Bee - Stable Diffusion GUI App for MacOS](https://github.com/divamgupta/diffusionbee-stable-diffusion-ui)

### [Diffusers](https://huggingface.co/docs/diffusers/index)
🤗 Diffusers 是最先进的预训练扩散模型的首选库，用于生成图像、音频，甚至分子的 3D 结构。无论您是在寻找简单的推理解决方案，还是想训练自己的扩散模型，🤗 Diffusers 都是一个支持两者的模块化工具箱。

## 知识扩展
### Latent Representation
数据中的潜在特征表示，这些特征可能不易直接观察到，但对于模型的学习和预测等任务具有重要意义。例如，在图像识别中，一张图片的颜色、形状、纹理等特征可以被视为潜在特征表示。

### Latent Space
由模型自动生成的潜在特征空间，其中每个点都表示一种可能的特征组合。在深度学习和人工智能领域，常常使用自编码器等技术来学习并探索数据的潜在特征空间，以期获得更深入的理解和更好的应用效果。

## 参考资料
* [AutoFaiss](https://github.com/criteo/autofaiss)
* [Multimodal search example (using OpenAI Clip model)](https://colab.research.google.com/github/criteo/autofaiss/blob/master/docs/notebooks/autofaiss_multimodal_search.ipynb)
* [Diffusers Load pipelines, models, and schedulers](https://huggingface.co/docs/diffusers/using-diffusers/loading)
* [Stable Diffusion v1-5](https://huggingface.co/runwayml/stable-diffusion-v1-5)
* [How to use Stable Diffusion in Apple Silicon (M1/M2)](https://huggingface.co/docs/diffusers/optimization/mps)
* [Stable Diffusion模型的安裝與使用教程](https://chrislee0728.medium.com/stable-diffusion模型的安裝與使用教程-12cbeeee7430)
* [Stable Diffusion原理解读](https://zhuanlan.zhihu.com/p/583124756)
* [Stable Diffusion Example](https://github.com/xuwenhao/geektime-ai-course/blob/main/24_stable_diffusion.ipynb)
