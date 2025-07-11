---
layout: single
title:  "Jetson AGX Orin大模型部署挑战与系统升级"
date:   2025-07-03 16:00:00 +0800
categories: Jetson 多模态
tags: [Jetson, AGXOrin, arm64, CUDA, vLLM, 多模态, 人形机器人, 泰安, 物资仓库]
---

这些文档主要围绕着在 **NVIDIA Jetson AGX Orin** 开发者套件上部署 **多模态大型语言模型 (LLMs)** 所面临的 **系统升级挑战**。核心问题在于，当前系统的 **JetPack、Ubuntu、CUDA 和 GPU 驱动版本** 过低，无法满足 **vLLM 和 Ollama** 等主流推理框架对 **更高 CUDA 和驱动版本** 的要求。文章详细阐述了 **升级至 JetPack 6.0** 是解决兼容性问题的关键，但这将强制要求 **将 Ubuntu 升级到 22.04**，从而导致 **需要重装系统** 和 **可能与 ROS1 产生兼容性问题** 等一系列复杂挑战。此外，文档还探讨了 **替代推理引擎和云端推理** 等备选方案，但最终建议进行 **系统全面升级** 以实现长期兼容性和性能优化。

<!--more-->

## 系统信息

- **硬件环境**：ARM64 架构，具体为 NVIDIA Jetson AGX Orin 开发者套件。

### 当前系统配置
- **软件环境**：
    - Ubuntu版本：20.04
    - GPU驱动版本：515
    - JetPack版本：5.1.4
    - CUDA版本：11.4
    - Python版本：3.8
    - 机器人操作系统：ROS1（Robot Operating System 1）

### 系统升级需求
- Ubuntu版本：22.04
- GPU驱动版本：535
- JetPack版本：>=6.0
- CUDA版本：>=12.2
- Python版本: 3.9 - 3.12


* **硬件环境：** `ARM64` 架构，具体为 NVIDIA **Jetson AGX Orin** 开发者套件。
* **当前系统配置：**
    * JetPack版本：5.1.4
    * Ubuntu版本：20.04
    * CUDA版本：11.4
* **核心问题：** vLLM和Ollama这两个主流的多模态大模型推理框架对CUDA和驱动版本有更高要求，而现有系统配置无法满足。
* **具体软件版本要求：**
    * **vLLM：** 至少需要CUDA 11.8。
    * **Ollama：** 需要Nvidia GPU计算能力5.0+，驱动版本531及更新。
* **JetPack与CUDA/驱动的关系：**
    * JetPack 5.x系列（如5.1.4）通常包含CUDA 11.4，驱动版本约为515。
    * JetPack 6.0及以上版本支持CUDA 12.x，驱动版本535+。
* **系统升级困境：** 升级到JetPack 6.0是满足CUDA和驱动要求的关键，但JetPack 6.0强制要求Ubuntu 22.04，这意味着需要重装系统。
* **其他问题：**
    * 磁盘空间不足。
    * 机器人电池续航短（2小时），模型编译时间长，需要考虑临时外接电源。
    * ROS版本：机器人基于ROS1开发，ROS1官方最高支持版本为Ubuntu 20.04，ROS2是最新版本但ROS1已不推荐。这可能与Ubuntu 22.04的升级产生兼容性问题。
    * Python版本：尝试安装vLLM时，发现Python 3.8可能过旧，且vLLM的最新版本（0.9.x）可能不兼容旧模型。
    * Docker尝试：虽然尝试了Docker进行测试，但Docker容器仍依赖宿主机的内核和GPU驱动，因此版本要求依然存在。
    * 备选方案：传统模式（采集样本、数据预处理、训练等步骤），但这不是实时推理的方案。

## [CUDA GPU 计算能力](https://developer.nvidia.com/cuda-gpus)
**[计算能力（Compute Capability）](https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#compute-capabilities)** 定义了每个英伟达 GPU 架构的硬件特性和支持的指令。了解你的GPU的计算能力对于选择合适的软件和驱动版本至关重要。在下面的表格中查找您的 GPU 的计算能力。

| Compute Capability | Data Center | GeForce/RTX | Jetson |
|--------------------|-------------|-------------|--------|
| 12.0               | NVIDIA RTX PRO 6000 Blackwell Server Edition | NVIDIA RTX PRO 6000 Blackwell Workstation Edition<br>NVIDIA RTX PRO 6000 Blackwell Max-Q Workstation Edition<br>NVIDIA RTX PRO 5000 Blackwell<br>NVIDIA RTX PRO 4500 Blackwell<br>NVIDIA RTX PRO 4000 Blackwell<br>GeForce RTX 5090<br>GeForce RTX 5080<br>GeForce RTX 5070 Ti<br>GeForce RTX 5070<br>GeForce RTX 5060 Ti<br>GeForce RTX 5060 | |
| 10.0               | NVIDIA GB200<br>NVIDIA B200 | | |
| 9.0                | NVIDIA GH200<br>NVIDIA H200<br>NVIDIA H100 | | |
| 8.9                | NVIDIA L4<br>NVIDIA L40 | NVIDIA RTX 6000 Ada<br>NVIDIA RTX 5000 Ada<br>NVIDIA RTX 4500 Ada<br>NVIDIA RTX 4000 Ada<br>NVIDIA RTX 4000 SFF Ada<br>NVIDIA RTX 2000 Ada<br>GeForce RTX 4090<br>GeForce RTX 4080<br>GeForce RTX 4070 Ti<br>GeForce RTX 4070<br>GeForce RTX 4060 Ti<br>GeForce RTX 4060<br>GeForce RTX 4050 | |
| 8.7                | | | Jetson AGX Orin<br>Jetson Orin NX<br>Jetson Orin Nano |
| 8.6                | NVIDIA A40<br>NVIDIA A10<br>NVIDIA A16<br>NVIDIA A2 | NVIDIA RTX A6000<br>NVIDIA RTX A5000<br>NVIDIA RTX A4000<br>NVIDIA RTX A3000<br>NVIDIA RTX A2000<br>GeForce RTX 3090 Ti<br>GeForce RTX 3090<br>GeForce RTX 3080 Ti<br>GeForce RTX 3080<br>GeForce RTX 3070 Ti<br>GeForce RTX 3070<br>GeForce RTX 3060 Ti<br>GeForce RTX 3060<br>GeForce RTX 3050 Ti<br>GeForce RTX 3050 | |
| 8.0                | NVIDIA A100<br>NVIDIA A30 | | |
| 7.5                | NVIDIA T4 | QUADRO RTX 8000<br>QUADRO RTX 6000<br>QUADRO RTX 5000<br>QUADRO RTX 4000<br>QUADRO RTX 3000<br>QUADRO T2000<br>NVIDIA T1200<br>NVIDIA T1000<br>NVIDIA T600<br>NVIDIA T500<br>NVIDIA T400<br>GeForce GTX 1650 Ti<br>NVIDIA TITAN RTX<br>GeForce RTX 2080 Ti<br>GeForce RTX 2080<br>GeForce RTX 2070<br>GeForce RTX 2060 | |

- [旧版 CUDA GPU 计算能力](https://developer.nvidia.com/cuda-legacy-gpus)


## 多模态大模型
- [Qwen/Qwen2.5-VL-7B-Instruct](https://qwenlm.github.io/zh/blog/qwen2.5-vl/)
- [GLM-4.1V-Thinking](https://huggingface.co/THUDM/GLM-4.1V-9B-Thinking)

| 模型名称 | 发布日期 |
| --- | --- |
| [Qwen/Qwen2.5-VL-7B-Instruct](https://huggingface.co/Qwen/Qwen2.5-VL-7B-Instruct) | 2025-1-26 |
| [GLM-4.1V-Thinking](https://huggingface.co/THUDM/GLM-4.1V-9B-Thinking) | 2025-7-1 |


## 推理引擎

### [vllm](https://github.com/vllm-project/vllm)
- [Using Docker Deployment](https://docs.vllm.ai/en/latest/deployment/docker.html)
- [Using uv with PyTorch](https://docs.astral.sh/uv/guides/integration/pytorch/)
- [vLLM GPU](https://docs.vllm.ai/en/latest/getting_started/installation/gpu.html)

### [ollama](https://github.com/ollama/ollama)

- [Nvidia（英伟达）GPU](https://github.com/ollama/ollama/blob/main/docs/gpu.md)

Ollama 支持计算能力为 `5.0+` 的 Nvidia GPU，以及驱动版本 `531` 及更高版本。

查看您的计算兼容性以确认您的显卡是否受支持：  
[https://developer.nvidia.com/cuda-gpus](https://developer.nvidia.com/cuda-gpus)  

| 计算能力 | 系列 | 显卡型号 |
| --- | --- | --- |
| 9.0             | NVIDIA               | `H200` `H100`                                                                                               |
| 8.9             | GeForce RTX 40xx     | `RTX 4090` `RTX 4080 SUPER` `RTX 4080` `RTX 4070 Ti SUPER` `RTX 4070 Ti` `RTX 4070 SUPER` `RTX 4070` `RTX 4060 Ti` `RTX 4060`  |
|                 | NVIDIA 专业显卡      | `L4` `L40` `RTX 6000`                                                                                       |
| 8.6             | GeForce RTX 30xx     | `RTX 3090 Ti` `RTX 3090` `RTX 3080 Ti` `RTX 3080` `RTX 3070 Ti` `RTX 3070` `RTX 3060 Ti` `RTX 3060` `RTX 3050 Ti` `RTX 3050`   |
|                 | NVIDIA 专业显卡      | `A40` `RTX A6000` `RTX A5000` `RTX A4000` `RTX A3000` `RTX A2000` `A10` `A16` `A2`                          |
| 8.0             | NVIDIA               | `A100` `A30`                                                                                                |
| 7.5             | GeForce GTX/RTX      | `GTX 1650 Ti` `TITAN RTX` `RTX 2080 Ti` `RTX 2080` `RTX 2070` `RTX 2060`                                    |
|                 | NVIDIA 专业显卡      | `T4` `RTX 5000` `RTX 4000` `RTX 3000` `T2000` `T1200` `T1000` `T600` `T500`                                 |
|                 | Quadro               | `RTX 8000` `RTX 6000` `RTX 5000` `RTX 4000`                                                                 |
| 7.0             | NVIDIA               | `TITAN V` `V100` `Quadro GV100`                                                                             |
| 6.1             | NVIDIA TITAN         | `TITAN Xp` `TITAN X`                                                                                        |
|                 | GeForce GTX          | `GTX 1080 Ti` `GTX 1080` `GTX 1070 Ti` `GTX 1070` `GTX 1060` `GTX 1050 Ti` `GTX 1050`                       |
|                 | Quadro               | `P6000` `P5200` `P4200` `P3200` `P5000` `P4000` `P3000` `P2200` `P2000` `P1000` `P620` `P600` `P500` `P520` |
|                 | Tesla                | `P40` `P4`                                                                                                  |
| 6.0             | NVIDIA               | `Tesla P100` `Quadro GP100`                                                                                 |
| 5.2             | GeForce GTX          | `GTX TITAN X` `GTX 980 Ti` `GTX 980` `GTX 970` `GTX 960` `GTX 950`                                          |
|                 | Quadro               | `M6000 24GB` `M6000` `M5000` `M5500M` `M4000` `M2200` `M2000` `M620`                                        |
|                 | Tesla                | `M60` `M40`                                                                                                 |
| 5.0             | GeForce GTX          | `GTX 750 Ti` `GTX 750` `NVS 810`                                                                            |
|                 | Quadro               | `K2200` `K1200` `K620` `M1200` `M520` `M5000M` `M4000M` `M3000M` `M2000M` `M1000M` `K620M` `M600M` `M500M`  |

如需本地构建以支持旧款 GPU，请参阅 [developer.md](https://github.com/ollama/ollama/blob/main/docs/development.md#linux-cuda-nvidia)。  

### [llama.cpp](https://github.com/ggml-org/llama.cpp)


## 参考信息

这是一个关于在ARM64环境下部署多模态大模型（用于火灾、烟雾和安全帽检测）的项目。核心问题围绕着软件兼容性，特别是Jetson平台上的JetPack、CUDA、驱动版本与大模型推理框架（vLLM、Ollama）之间的版本依赖。

**背景信息：**

* **项目目标：** 在物资仓库机器人项目中实现智能检测火灾、烟雾和正确佩戴安全帽。
* **硬件环境：** ARM64架构，具体为NVIDIA Jetson AGX Orin开发者套件。
* **当前系统配置：**
    * JetPack版本：5.1.4
    * Ubuntu版本：20.04
    * CUDA版本：11.4
* **核心问题：** vLLM和Ollama这两个主流的多模态大模型推理框架对CUDA和驱动版本有更高要求，而现有系统配置无法满足。
* **具体软件版本要求：**
    * **vLLM：** 至少需要CUDA 11.8。
    * **Ollama：** 需要Nvidia GPU计算能力5.0+，驱动版本531及更新。
* **JetPack与CUDA/驱动的关系：**
    * JetPack 5.x系列（如5.1.4）通常包含CUDA 11.4，驱动版本约为515。
    * JetPack 6.0及以上版本支持CUDA 12.x，驱动版本535+。
* **系统升级困境：** 升级到JetPack 6.0是满足CUDA和驱动要求的关键，但JetPack 6.0强制要求Ubuntu 22.04，这意味着需要重装系统。
* **其他问题：**
    * 磁盘空间不足。
    * 机器人电池续航短（2小时），模型编译时间长，需要考虑临时外接电源。
    * ROS版本：机器人基于ROS1开发，ROS1官方最高支持版本为Ubuntu 20.04，ROS2是最新版本但ROS1已不推荐。这可能与Ubuntu 22.04的升级产生兼容性问题。
    * Python版本：尝试安装vLLM时，发现Python 3.8可能过旧，且vLLM的最新版本（0.9.x）可能不兼容旧模型。
    * Docker尝试：虽然尝试了Docker进行测试，但Docker容器仍依赖宿主机的内核和GPU驱动，因此版本要求依然存在。
    * 备选方案：传统模式（采集样本、数据预处理、训练等步骤），但这不是实时推理的方案。

**技术方案：**

目前来看，主要有以下几种解决思路，以及对应的挑战和风险：

1.  **系统升级方案（推荐，但存在挑战）：**
    * **核心步骤：** 将Jetson AGX Orin的JetPack版本从5.1.4升级到6.0或更高版本。
    * **前提条件：** 必须将Ubuntu操作系统从20.04升级到22.04。
    * **挑战：**
        * **重装系统：** 这将是最大的工程量，需要备份所有数据，并重新配置机器人相关的软件和依赖，包括ROS1。ROS1在Ubuntu 22.04上的兼容性需要验证，可能需要进行额外的适配工作，甚至考虑是否需要升级到ROS2（但ROS2与ROS1的API有较大差异，项目改动会很大）。
        * **耗时：** 重装系统和配置环境会占用大量时间，影响项目进度。
        * **外部电源：** 编译和安装过程可能耗时较长，需解决机器人电源问题。
    * **优点：** 这是最彻底的解决方案，能够满足vLLM和Ollama对CUDA和驱动的最新要求，确保大模型的稳定运行和未来兼容性。

2.  **寻找兼容当前环境的推理框架或模型版本（难度大，可能无法实现）：**
    * **思路：** 尝试寻找对CUDA 11.4或更低版本有良好支持的多模态大模型推理框架，或者寻找可以运行在当前CUDA版本上的旧版vLLM/Ollama模型。
    * **挑战：**
        * **模型性能与功能：** 旧版本的推理框架或模型可能无法支持最新的大模型算法，导致检测效果不佳或功能受限。
        * **维护与支持：** 旧版本通常不再得到官方维护和支持，存在安全和稳定性风险。
        * **可用性：** 市场上的主流多模态大模型及其推理框架通常会追随最新的CUDA版本。
    * **现状：** 聊天记录中已经尝试过vLLM的安装，发现即使是0.6.3版本也存在依赖问题，且Qwen25-VL等新模型可能不支持。Ollama的驱动要求也无法满足。

3.  **替代推理引擎方案（llama.cpp备选）：**
    * **思路：** 考虑使用llama.cpp等更为轻量级或对硬件要求更低的推理库。
    * **挑战：**
        * **多模态支持：** 需要确认llama.cpp是否能很好地支持多模态（火灾、烟雾、安全帽识别）任务，以及其推理性能是否满足实时性要求。
        * **模型转换：** 可能需要将现有的多模态模型转换为llama.cpp支持的格式。
        * **性能瓶颈：** 即使能运行，其在Jetson平台上的推理速度和准确性是否能达到预期是未知数。
    * **优点：** 可能会避免系统升级的复杂性。

4.  **云端推理/边缘云方案（非本次任务范畴，但可作为长期考虑）：**
    * **思路：** 将大模型的推理部分放到云端或性能更强的边缘服务器上，Jetson平台只负责数据采集和预处理，然后将数据传输到云端进行推理，再接收推理结果。
    * **挑战：**
        * **网络延迟：** 实时性要求高的任务可能会受到网络延迟的影响。
        * **数据传输：** 大量图像/视频数据传输可能产生带宽和成本问题。
        * **部署复杂性：** 引入云端服务会增加系统架构的复杂性。
    * **优点：** 摆脱Jetson硬件限制，可以利用更强大的计算资源。

**目前建议：**

鉴于vLLM和Ollama都明确要求更高的CUDA和驱动版本，且JetPack 6.0是支持这些新版本的关键，**最直接且长期的解决方案是进行JetPack和Ubuntu的升级**。

在执行升级前，需要进行详细的规划：

* **评估ROS1在Ubuntu 22.04上的兼容性，并制定相应的适配或迁移方案。**
* **确保所有重要数据已备份。**
* **准备临时的外接电源，以应对长时间的系统安装和模型编译。**
* **与技术支持团队沟通，获取官方的升级指导和可能遇到的问题解决方案。**

同时，可以继续尝试在现有环境下寻找一些临时的或者备选的方案，例如尝试不同版本的pip源或者更早版本的vLLM（尽管可能性不大），但这不应作为主要方向。


## 参考资料
- [PyPi vllm](https://pypi.org/project/vllm/)
- [JetPack SDK](https://developer.nvidia.com/embedded/jetpack-sdk-60)
- [Pytorch Wheel CU118](https://download.pytorch.org/whl/cu118)
- [LMArena](https://lmarena.ai/)
- [vLLM - Building for Arm64/aarch64](https://docs.vllm.ai/en/latest/deployment/docker.html#building-for-arm64aarch64)
- [vLLM - GPU](https://docs.vllm.ai/en/stable/getting_started/installation/gpu.html)
