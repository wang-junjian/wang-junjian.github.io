---
layout: single
title:  "部署 LLM 多 LoRA 适配器的推理服务"
date:   2024-10-03 10:00:00 +0800
categories: TGI vLLM
tags: [TGI, vLLM, LoRA, HuggingFace, LLM]
---

## Text Generation Inference
- [text-generation-inference](https://github.com/huggingface/text-generation-inference)
- [Text Generation Inference](https://huggingface.co/docs/text-generation-inference/index)
- [TGI 多-LoRA: 部署一次，搞定 30 个模型的推理服务](https://huggingface.co/blog/zh/multi-lora-serving)

```shell
conda create -n text-generation-inference python=3.9
conda activate text-generation-inference

git clone https://github.com/huggingface/text-generation-inference.git && cd text-generation-inference
BUILD_EXTENSIONS=True make install
```


## vLLM

- [vllm](https://github.com/vllm-project/vllm)
- [vllm - Installation](https://docs.vllm.ai/en/stable/getting_started/installation.html)

```shell
conda create -n vllm python=3.10 -y
conda activate vllm
pip install vllm
```

```shell
cd ~/HuggingFace/mistralai/Mistral-7B-v0.1
git clone https://huggingface.co/predibase/magicoder adapters/magicoder
```

- [vllm - Using LoRA adapters](https://docs.vllm.ai/en/latest/models/lora.html)
- [mistralai/Mistral-7B-v0.1](https://huggingface.co/mistralai/Mistral-7B-v0.1)
- [predibase/magicoder](https://huggingface.co/predibase/magicoder)
- [利用多Lora节省大模型部署成本｜得物技术](https://cloud.tencent.com/developer/article/2446523)
- [使用vLLM在一个基座模型上部署多个lora适配器](https://new.qq.com/rain/a/20240805A01PGG00)
```shell
vllm serve `pwd` \
    --enable-lora \
    --lora-modules magicoder=`pwd`/adapters/magicoder
```


## 参考资料
- [借助 NVIDIA NIM 无缝部署大量 LoRA Adapters](https://developer.nvidia.com/zh-cn/blog/seamlessly-deploying-a-swarm-of-lora-adapters-with-nvidia-nim/)
- [OpenRouter](https://openrouter.ai/)
