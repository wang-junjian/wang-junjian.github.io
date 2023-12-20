---
layout: post
title:  "Text Generation Inference"
date:   2023-12-19 08:00:00 +0800
categories: TGI
tags: [TGI, Inference]
---

- [Text Generation Inference](https://github.com/huggingface/text-generation-inference)

## [TGI 介绍](https://huggingface.co/docs/text-generation-inference/index)
TGI 是一个用于部署和服务大型语言模型（LLM）的工具包。 TGI 为最流行的开源 LLM 提供高性能文本生成，包括 Llama、Falcon、StarCoder、BLOOM、GPT-NeoX 和 T5 。
- 张量并行性，可在多个 GPU 上进行更快的推理
- 批处理连续传入的请求，以增加总吞吐量
- 在最流行的架构上使用 [Flash Attention][Flash-Attention] 和 [Paged Attention][Paged-Attention] 优化 Transformers 代码进行推理
- 使用 [bitsandbytes][bitsandbytes] 和 [GPT-Q][GPT-Q] 进行量化
- [safetensors][safetensors] 权重加载
- 给模型输出加[水印（Watermark）](https://arxiv.org/abs/2301.10226)
- 微调支持：定制针对特定任务的微调模型来实现更高的准确性和性能

## 系统架构
![](/images/2023/TGI.png)

## 部署模型 [HuggingFaceH4/zephyr-7b-beta](https://huggingface.co/HuggingFaceH4/zephyr-7b-beta)
```shell
model=HuggingFaceH4/zephyr-7b-beta
volume=$PWD/data    # Avoid downloading weights every run
docker run --gpus all --shm-size 1g -p 8080:80 -v $volume:/data \
    ghcr.io/huggingface/text-generation-inference \
    --model-id $model --quantize bitsandbytes --num-shard 1
```

## 测试
```shell
curl -X POST http://localhost:8080/generate \
    -H 'Content-Type: application/json' \
    -d '{
        "inputs": "What is Deep Learning?",
        "parameters": {
            "max_new_tokens": 20
        }
    }'
```

## 参考资料
- [LLM Note Day 18 - Hugging Face Text Generation Inference](https://ithelp.ithome.com.tw/articles/10332065)
- [Quick Tour](https://huggingface.co/docs/text-generation-inference/main/en/quicktour)
- [Can not load local model by --model-id](https://github.com/huggingface/text-generation-inference/issues/245)
- [Serving Falcon models with 🤗 Text Generation Inference (TGI)](https://vilsonrodrigues.medium.com/serving-falcon-models-with-text-generation-inference-tgi-5f32005c663b)
- [Text Generation Inference for Foundation Models](https://heidloff.net/article/tgi-kserve/)
