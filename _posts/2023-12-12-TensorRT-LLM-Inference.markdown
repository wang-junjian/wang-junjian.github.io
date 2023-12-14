---
layout: post
title:  "TensorRT-LLM 大模型推理"
date:   2023-12-12 08:00:00 +0800
categories: TensorRT-LLM
tags: [TensorRT-LLM, TritonInferenceServer, ChatGLM]
---

- [TensorRT-LLM’s Documentation](https://nvidia.github.io/TensorRT-LLM/)
- [Triton Tutorials](https://github.com/triton-inference-server/tutorials)
- [NVIDIA Triton Inference Server Documentation](https://docs.nvidia.com/deeplearning/triton-inference-server/archives/triton_inference_server_1140/user-guide/docs/index.html)

## [TensorRT-LLM][TensorRT-LLM]
TensorRT-LLM 为用户提供了易于使用的 Python API 来定义大型语言模型 (LLM) 并构建包含最先进优化的 TensorRT 引擎，以便在 NVIDIA GPU 上高效地执行推理。 TensorRT-LLM 还包含用于创建执行这些 TensorRT 引擎的 Python 和 C++ 运行时的组件。

### [Build TensorRT-LLM](https://github.com/NVIDIA/TensorRT-LLM/blob/main/docs/source/installation.md)
```bash
# TensorRT-LLM uses git-lfs, which needs to be installed in advance.
apt-get update && apt-get -y install git git-lfs

git clone https://github.com/NVIDIA/TensorRT-LLM.git
cd TensorRT-LLM
git submodule update --init --recursive
git lfs install
git lfs pull

make -C docker release_build
```

### 查看镜像
```bash
docker images --filter reference=tensorrt_llm/release
```
```
REPOSITORY             TAG       IMAGE ID       CREATED        SIZE
tensorrt_llm/release   latest    94001d38cf79   33 hours ago   33.2GB
```
- [docker images](https://docs.docker.com/engine/reference/commandline/images/)

### Build TensorRT engine(s)
```bash
docker run --gpus 1 --rm -it -v /data/models:/data/models tensorrt_llm/release:latest bash

cd examples/chatglm/
python build.py -m chatglm3_6b --model_dir /data/models/llm/chatglm3-6b --output_dir /data/models/trt-engines/chatglm3-6b/fp16/1-gpu
```
```
[TRT-LLM] [I] Total time of building all 1 engines: 00:04:20
```

- [ChatGLM](https://github.com/NVIDIA/TensorRT-LLM/tree/main/examples/chatglm)

### 查看生成的 TensorRT engine(s)
```bash
ll -h /data/models/trt-engines/chatglm3-6b/fp16/1-gpu
total 12G
drwxr-xr-x 2 root root 4.0K Dec 12 14:25 ./
drwxr-xr-x 3 root root 4.0K Dec 12 14:21 ../
-rw-r--r-- 1 root root  12G Dec 12 14:25 chatglm3_6b_float16_tp1_rank0.engine
-rw-r--r-- 1 root root 1.7K Dec 12 14:25 config.json
```

### Run TensorRT-LLM

#### 单节点、单GPU
```bash
# Run the default engine of ChatGLM3-6B on single GPU, other model name is available if built.
python3 ../run.py --input_text "你是谁？" \
                  --max_output_len 50 \
                  --tokenizer_dir /data/models/llm/chatglm3-6b \
                  --engine_dir /data/models/trt-engines/chatglm3-6b/fp16/1-gpu
```
```
Input [Text 0]: "[gMASK]sop 你是谁？"
Output [Text 0 Beam 0]: "你有什么目的？你有什么能力？我为什么要相信你？
```

```bash
python3 ../run.py --input_text "写一篇1000字的玄幻小说" \
                  --max_output_len 1024 \
                  --tokenizer_dir /data/models/llm/chatglm3-6b \
                  --engine_dir /data/models/trt-engines/chatglm3-6b/fp16/1-gpu
```
```
Input [Text 0]: "[gMASK]sop 写一篇1000字的玄幻小说"
Output [Text 0 Beam 0]: "，讲述一个神秘的世界，这个世界有魔法、神秘生物和奇幻的冒险故事。
在一个神秘的世界中,魔法、神秘生物和奇幻的冒险故事充斥着每一个角落。这个世界被称为“奇幻大陆”,由许多种族组成,包括人类、精灵、兽人、矮人、巨魔、龙等等。每一个种族都有自己独特的文化和传统,同时也存在着许多神秘的生物和魔法。
在这个世界中,有一个年轻的人类男孩叫做亚瑟。亚瑟出生在一个普通的人类家庭,但他从小就表现出了对魔法和神秘生物的浓厚兴趣。他常常独自一人深入森林和山脉,探索那些被认为充满神秘和魔法的地方。
有一天,亚瑟在森林中发现了一个神秘的洞穴。他走进去,发现里面有一个巨大的石柱,上面刻满了奇怪的符号和文字。在石柱的底部,他发现了一个神秘的盒子。当他打开盒子时,里面出现了一只神秘的生物。
这只生物看起来像是一只猫,但它的毛发是紫色的,眼睛是蓝色的,而且它能够发出非常强大的魔法能量。亚瑟被这只神秘生物吓到了,但他很快就发现了它的善良和神秘生物的能力。他开始和这只生物一起冒险,探索这个神秘的世界。
他们一起穿越了森林和山脉,探索了许多神秘的地方,遇到了许多奇幻的生物和魔法。他们遇到了一只巨大的飞龙,它能够飞行千里,喷出非常强大的火焰。他们还遇到了一只叫做“地精”的生物,它能够挖掘出非常珍贵的矿石和珠宝。
在这个过程中,亚瑟和神秘生物学会了许多技能和魔法。亚瑟学会了如何使用魔法,神秘生物学会了如何使用它的能力来帮助别人。他们一起战胜了许多强大的敌人,也帮助了许多需要帮助的人。
最终,亚瑟和神秘生物完成了一次伟大的冒险。他们探索了许多神秘的地方,遇到了许多奇幻的生物和魔法,最终成功地完成了他们的任务。亚瑟也学会了如何在这个神秘的世界中生存,并且变得更加勇敢和自信。
这就是亚瑟的故事,一个勇敢的人类男孩,通过一次神秘的冒险,探索了一个充满魔法、神秘生物和奇幻的"
```

Streaming

```bash
python3 ../run.py --input_text "你是谁？" \
                  --max_output_len 1024 \
                  --tokenizer_dir /data/models/llm/chatglm3-6b \
                  --engine_dir /data/models/trt-engines/chatglm3-6b/fp16/1-gpu \
                  --streaming
```


## [Triton Inference Server][TritonInferenceServer]
```bash
docker pull nvcr.io/nvidia/tritonserver:23.11-py3
```


## [TensorRT-LLM Backend][TensorRT-LLM_Backend]
### 克隆仓库
```bash
git clone https://github.com/triton-inference-server/tensorrtllm_backend.git  # --branch <release branch>
# Update the submodules
cd tensorrtllm_backend
# Install git-lfs if needed
apt-get update && apt-get install git-lfs -y --no-install-recommends
git lfs install
git submodule update --init --recursive
```

### 运行 Docker 容器
```bash
docker run --rm -it --net host --shm-size=2g \
    --ulimit memlock=-1 --ulimit stack=67108864 --gpus 1 \
    -v $(pwd):/tensorrtllm_backend \
    -v /data/models/llm/chatglm3-6b:/models \
    -v /data/models/trt-engines/:/engines \
    nvcr.io/nvidia/tritonserver:23.11-trtllm-python-py3
```

### 创建模型仓库
```bash
# Create the model repository that will be used by the Triton server
cd tensorrtllm_backend
mkdir triton_model_repo

# Copy the example models to the model repository
cp -r all_models/inflight_batcher_llm/* triton_model_repo/

# Copy the TRT engine to triton_model_repo/tensorrt_llm/1/
cp /engines/chatglm3_6b/fp16/1-gpu/* triton_model_repo/tensorrt_llm/1
```

### 修改模型配置
- /tensorrtllm_backend/triton_model_repo/ensemble/config.pbtxt
- /tensorrtllm_backend/triton_model_repo/preprocessing/config.pbtxt
- /tensorrtllm_backend/triton_model_repo/postprocessing/config.pbtxt
- /tensorrtllm_backend/triton_model_repo/tensorrt_llm/config.pbtxt
- /tensorrtllm_backend/triton_model_repo/tensorrt_llm_bls/config.pbtxt

- [TensorRT-LLM Backend][TensorRT-LLM_Backend]
- [End to end workflow to run baichuan](https://github.com/triton-inference-server/tensorrtllm_backend/blob/main/docs/baichuan.md)
- [End to end workflow to run llama](https://github.com/triton-inference-server/tensorrtllm_backend/blob/main/docs/llama.md)
- [Model Configuration](https://github.com/triton-inference-server/server/blob/main/docs/user_guide/model_configuration.md)

### 启动 Triton Inference Server
```bash
python3 scripts/launch_triton_server.py --world_size=1 --model_repo=/tensorrtllm_backend/triton_model_repo
```

出现错误：`UNAVAILABLE: Internal: ValueError: Tokenizer class ChatGLMTokenizer does not exist or is not currently imported.`



## 参考资料
- [欢迎使用 NVIDIA TensorRT-LLM 优化大语言模型推理](https://developer.nvidia.com/zh-cn/blog/optimizing-inference-on-llms-with-tensorrt-llm-now-publicly-available/)
- [大模型推理实践-1：基于TensorRT-LLM和Triton部署ChatGLM2-6B模型推理服务](https://zhuanlan.zhihu.com/p/663338695)
- [TensorRT-LLM初探 1 运行llama，以及triton tensorrt llm backend服务化](https://aigc.7otech.com/2023/11/09/tensorrt-llm%E5%88%9D%E6%8E%A2-1-%E8%BF%90%E8%A1%8Cllama%EF%BC%8C%E4%BB%A5%E5%8F%8Atriton-tensorrt-llm-backend%E6%9C%8D%E5%8A%A1%E5%8C%96/)
- [meta-llama/Llama-2-7b-hf](https://huggingface.co/meta-llama/Llama-2-7b-hf)
- [BLOOM 3b: Optimization & Deployment using Triton Server - Part 1](https://medium.com/@fractal.ai/bloom-3b-optimization-deployment-using-triton-server-part-1-f809037fea40)
- [Deploying Llama2 with NVIDIA Triton Inference Server](https://blog.marvik.ai/2023/10/16/deploying-llama2-with-nvidia-triton-inference-server/)
- [基于TensorRT-LLM和Triton进行ChatGLM2-6B模型推理实践](https://www.ctyun.cn/developer/article/475506086498373)
- [triton-inference-server的backend（一）——关于推理框架的一些讨论](https://ai.oldpan.me/t/topic/246)
- [深度学习部署神器——triton-inference-server入门教程指北](https://mp.weixin.qq.com/s?__biz=Mzg3ODU2MzY5MA==&mid=2247490083&idx=1&sn=8a144b5075535e890779b8c5eb5afcc7)
- [MPI for Python](https://buildmedia.readthedocs.org/media/pdf/mpi4py/latest/mpi4py.pdf)
- [ERROR: Could not build wheels for mpi4py, which is required to install pyproject.toml-based projects](https://stackoverflow.com/questions/74427664/error-could-not-build-wheels-for-mpi4py-which-is-required-to-install-pyproject)


[TensorRT-LLM]: https://github.com/NVIDIA/TensorRT-LLM
[TensorRT-LLM_Backend]: https://github.com/triton-inference-server/tensorrtllm_backend
[TritonInferenceServer]: https://github.com/triton-inference-server/server