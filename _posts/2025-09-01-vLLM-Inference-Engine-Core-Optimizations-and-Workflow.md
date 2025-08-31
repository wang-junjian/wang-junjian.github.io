---
layout: single
title:  "vLLM 推理引擎的核心优化技术及其工作流程"
date:   2025-09-01 00:00:00 +0800
categories: vLLM LLM
tags: [vLLM, LLM, 推理]
---

vLLM V1 引擎通过**优化其核心引擎循环**，将输入处理并行化，并引入了**分段式 CUDA 图**，从而实现了更灵活、动态的执行模型，显著降低了在线服务的延迟（TTFT 和 TPOT），同时保持了高吞吐量。其设计目标是**确保 GPU 不闲置**，通过 API 服务器和 EngineCore 之间的协作来高效调度和执行任务。为了进一步加速大型语言模型推理，vLLM V1 采用了多种优化技术：它通过**分离式预填充**和**分块预填充**来优化首个 token 的生成延迟，并结合**连续批处理**与**分页注意力**来提高 KV 缓存的内存效率和 GPU 利用率。此外，**前缀缓存**技术避免了重复计算相同提示的 KV 缓存，而**级联推理**则是一种内存带宽高效的共享前缀批处理解码技术，通过结合多查询注意力处理共享 KV 和单查询批处理解码处理独特 KV，特别适用于多用户共享长提示的场景，能显著提升性能。其他高级解码方法如**推测性解码**利用草稿模型加速生成，**跳跃解码**则适用于结构化输出场景。最后，**量化技术**是提升性能的关键手段，通过对权重、激活值和 KV 缓存使用低位精度（如 FP8、INT8），它能减少存储和内存占用，加速计算密集型和内存带宽密集型任务，并允许在固定硬件下处理更多 token，从而大幅提升吞吐量，同时保持模型准确性。

<!--more-->

## V1 Engine 工作流程

![](/images/2025/vLLM/V1Engine/V1-Engine1.png)

![](/images/2025/vLLM/V1Engine/V1-Engine2.png)

![](/images/2025/vLLM/V1Engine/V1-Engine3.png)

![](/images/2025/vLLM/V1Engine/V1-Engine4.png)

![](/images/2025/vLLM/V1Engine/V1-Engine5.png)


## 推理优化

### 级联推理（Cascade Inference）

**级联推理（Cascade Inference）** 是一种旨在大幅提高大型语言模型（LLM）推理效率的技术，尤其针对多个请求共享相同前缀（prompt）的场景，如长文档问答或自洽性生成。它通过**将注意力计算解耦为两个阶段**来实现：首先，利用多查询注意力内核计算查询与共享前缀的KV-Cache之间的注意力状态，并将其存储在GPU共享内存（SMEM）中以实现快速访问和最大化内存重用；其次，使用批处理解码注意力内核计算查询与独特后缀的KV-Cache之间的注意力状态。最后，通过一个具有结合律和交换律的“合并操作符”（merge operator），将这两部分的注意力状态**数学上等价地组合起来**，得到最终的注意力输出。这种“分而治之”的方法显著提升了内存带宽效率，例如在H100 SXM 80GB上可实现高达31倍的加速。

![](/images/2025/vLLM/V1Engine/CascadeInference1.png)

![](/images/2025/vLLM/V1Engine/CascadeInference2.png)

![](/images/2025/vLLM/V1Engine/CascadeInference3.png)

### LLM 推理优化（LLM Inference Optimization）

![](/images/2025/vLLM/V1Engine/LLMInferenceOptimization1.png)

![](/images/2025/vLLM/V1Engine/LLMInferenceOptimization2.png)

![](/images/2025/vLLM/V1Engine/LLMInferenceOptimization3.png)

![](/images/2025/vLLM/V1Engine/LLMInferenceOptimization4.png)

![](/images/2025/vLLM/V1Engine/LLMInferenceOptimization5.png)

![](/images/2025/vLLM/V1Engine/LLMInferenceOptimization6.png)

![](/images/2025/vLLM/V1Engine/LLMInferenceOptimization7.png)

![](/images/2025/vLLM/V1Engine/LLMInferenceOptimization8.png)

### KV 缓存（KV Caching）

**KV 缓存（KV Caching）**是一种通过**缓存注意力机制中的键（Key）和值（Value）向量**来加速大型语言模型推理的技术。在预填充（Prefill）阶段，模型会计算并存储整个输入提示中所有 token 的 KV 缓存。这样，在后续的解码（Decode）阶段，模型就可以**直接利用这些已计算好的 KV 缓存**，从而避免了冗余计算并显著加速了 token 的生成过程。KV 缓存对于减少计算量、节省内存至关重要，并与**前缀缓存**（用于避免重复计算相同提示前缀的 KV Cache） 和**分页注意力**（优化 KV 缓存管理，提高内存效率）等技术协同工作。

![](/images/2025/vLLM/V1Engine/KVCaching1.png)

![](/images/2025/vLLM/V1Engine/KVCaching2.png)

![](/images/2025/vLLM/V1Engine/KVCaching3.png)

### 量化（Quantization）

**量化（Quantization）**是一种通过**使用低位精度（如 FP8、INT8、FP4）来存储和计算**大型语言模型参数和激活值的方法。其主要目标是**降低存储和内存占用**，例如将 100B 模型从 BFloadt16 的 200GB 减少到 FP8 的 100GB。量化通过减少 HBM 到 SRAM 的数据传输，并利用具有更高 FLOPS 的 Tensor Core，显著**加速计算密集型（预填充和大批处理解码）和内存带宽密集型（小批处理解码）两种情况**。具体方法包括**仅权重量子化**（只量化权重）和**权重+激活量子化**（同时量化权重和激活值），以及对 **KV 缓存进行量化**以减少存储空间并加速注意力机制，这对长上下文工作负载尤为关键。最终，量化能够在固定硬件下处理更多 token，从而**大幅提升吞吐量**，同时通过实验验证，量化后的模型仍能保持良好的**准确性和稳定性**。

![](/images/2025/vLLM/V1Engine/Quantization1.png)

![](/images/2025/vLLM/V1Engine/Quantization2.png)

![](/images/2025/vLLM/V1Engine/Quantization3.png)

![](/images/2025/vLLM/V1Engine/Quantization4.png)

![](/images/2025/vLLM/V1Engine/Quantization5.png)

![](/images/2025/vLLM/V1Engine/Quantization6.png)

![](/images/2025/vLLM/V1Engine/Quantization7.png)
