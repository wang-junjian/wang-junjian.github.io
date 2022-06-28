---
layout: post
title:  "面向边缘场景的 AI 芯片"
date:   2022-06-23 00:00:00 +0800
categories: EdgeAI
tags: [GPU, VPU, NPU, Jetson, Movidius, 昇腾]
---

## [NVIDIA Jetson](https://www.nvidia.cn/autonomous-machines/embedded-systems/)
NVIDIA Jetson™ 是世界领先的平台，适用于自主机器和其他嵌入式应用程序。该平台包括 Jetson 模组（外形小巧的高性能计算机）、用于加速软件的 NVIDIA JetPack™ SDK，以及包含传感器、SDK、服务和产品的生态系统，从而加快开发速度。Jetson 与其他 NVIDIA 平台上所用的相同 AI 软件和云原生工作流相兼容，并能为客户提供构建软件定义的自主机器所需的性能和能效。
每个 NVIDIA Jetson 都是一个完整的系统模组 (SOM)，其中包括 GPU、CPU、内存、电源管理和高速接口等。不同性能、能效和外形规格的组合满足各类行业的客户所需。Jetson 生态系统合作伙伴提供软件、硬件设计服务以及涵盖载板到完整系统的现成兼容产品，因此您可以借助 AI 嵌入式边缘设备更快地打入市场。

### 技术规格

| 参数 | 规格 |
| --- | ---: |
| 性能 | 472 GFLOPS |
| 最大功耗 | 10 W |
| 显存 | 4 GB |

* [NVIDIA](https://www.nvidia.cn/)
* [NVIDIA Jetson：边缘计算的人工智能平台](https://www.nvidia.cn/autonomous-machines/embedded-systems/)
* [NVIDIA Jetson 模组规格比较](https://www.nvidia.cn/autonomous-machines/embedded-systems/#jetson-compare)
* [Jetson Software](https://developer.nvidia.com/embedded/develop/software)
* [JETSON STORE](https://store.nvidia.com/en-us/jetson/store/?page=1&limit=9&locale=en-us)


## [英特尔 Movidius 视觉处理器 (VPU)](https://www.intel.cn/content/www/cn/zh/products/details/processors/movidius-vpu.html)
英特尔® Movidius™ Myriad™ X 视觉处理器为计算机视觉和深度神经网络推理应用提供出色性能。作为以超低功耗著称的 Movidius 视觉处理器家族的一员，英特尔® Movidius™ X 视觉处理器可以提供每秒超过 4 万亿次运算 (TOPS) 的总体性能。
英特尔® Movidius™ Myriad™ X 视觉处理器拥有 16 条 MIPI 通道，支持直连多达 8 个高清分辨率 RGB 传感器。高吞吐量内联 ISP 可确保高速处理数据流，而新的硬件编码器则以 30 Hz (H.264/H.265) 和 60 Hz (M/JPEG) 帧率支持 4K 分辨率。其他特色接口包括 USB 3.1 和 PCIe* Gen 3。
英特尔® Movidius™ Myriad™ X 视觉处理器附带了一个丰富的 SDK，其中包含所有软件开发框架、工具、驱动程序和库，用于在英特尔® Movidius™ Myriad™ X 视觉处理器上实现自定义成像、视觉和深度学习应用。该 SDK 还包括一个专用的 FLIC 框架，该框架具有用于开发包括图像处理、计算机视觉和深度学习在内的应用程序管道的插件方法。这个框架会帮助开发人员专注于处理，将数据流优化留给工具去完成。对于深度神经网络开发，SDK 包含一个神经网络编译器，有了它，开发人员可以用一种自动转换和优化工具从通用框架（例如 Caffe *和 TensorFlow*）快速移植神经网络，这种工具可以在保持网络模型准确性的同时使性能最大化。

### 技术规格

| 参数 | 规格 |
| --- | ---: |
| 性能 | 4 TOPS |
| 最大功耗 | 1 W |

* [英特尔](https://www.intel.cn/)
* [英特尔® Movidius™ 视觉处理器 (VPU)](https://www.intel.cn/content/www/cn/zh/products/details/processors/movidius-vpu.html)
* [英特尔® Movidius™ Myriad™ X 视觉处理器 (VPU)](https://www.intel.cn/content/www/cn/zh/products/docs/processors/movidius-vpu/myriad-x-product-brief.html)
* [英特尔® 神经电脑棒 2](https://www.intel.cn/content/www/cn/zh/developer/tools/neural-compute-stick/overview.html)


## [瑞芯微 NPU](https://www.rock-chips.com/a/cn/yingyongfangan/rengongzhineng/index.html)
RK3399Pro 采用了ARM双核Cortex-A72 + 四核Cortex-A53的大小核处理器架构，主频高达1.8GHz，集成Mali-T860 MP4 四核图形处理器，通用运算性能强悍。集成AI神经网络处理器NPU，支持8Bit/16Bit运算，算力高达3.0Tops，满足视觉、音频等各类AI应用。支持DP1.2、HDMI 2.0、MIPI-DSI、eDP 多种显示输出接口，支持双屏同显/双屏异显，支持4K VP9 、4K 10bits H265/H264和1080P 多格式 (VC-1, MPEG-1/2/4, VP8)视频解码，1080P（H.264，VP8格式）视频编码。兼容多种AI框架，支持TensorFlow Lite/Android NN API， AI软件工具支持对Caffe / TensorFlow模型的导入及映射、优化，让开发者便捷地运用AI技术

### 技术规格

| 参数 | 规格 |
| --- | ---: |
| 性能 | 3 TOPS |
| 最大功耗 | 12 W |

* [瑞芯微](https://www.rock-chips.com)
* [RK3399Pro](https://www.rock-chips.com/a/cn/product/RK33xilie/2018/0130/873.html)
* [RK 公开课](https://www.bilibili.com/video/BV16Y4y147SK)
* [Firefly EC-A3399ProC](https://wiki.t-firefly.com/zh_CN/EC-A3399ProC/started.html)
* [Firefly Core-3399Pro-JD4 6核高性能AI核心板](https://www.t-firefly.com/product/coreboard/core_3399pro_jd4.html)


## [寒武纪 MLU](https://www.cambricon.com/index.php?m=content&c=index&a=lists&catid=55)
MLU220 是一款专门用于边缘计算应用场景的AI加速产品（边缘人工智能加速卡）。产品集成4核ARM CORTEX A55，LPDDR4x内存及丰富的外围接口。用户既可以使用MLU220作为AI加速协处理器，也可以使用其实现SOC方案。思元220芯片基于寒武纪MLUv02架构，手指大小的标准M.2加速卡集成了8TOPS理论峰值性能，功耗仅为8.25W,可以轻松实现终端设备和边缘端设备的AI赋能方案。

### 技术规格

| 参数 | 规格 |
| --- | ---: |
| 性能 | 8 TOPS |
| 最大功耗 | 8.25 W |

* [寒武纪](https://www.cambricon.com)
* [思元220](https://www.cambricon.com/index.php?m=content&c=index&a=lists&catid=55)
* [寒武纪开发者社区](https://developer.cambricon.com)
* [寒武纪开发者课程](https://space.bilibili.com/503203932)


## [华为海思昇腾](https://e.huawei.com/cn/products/cloud-computing-dc/atlas/ascend-310)
昇腾310 是一款高效、灵活、可编程的AI处理器。基于典型配置，八位整数精度（INT8）下的性能达到22TOPS，16位浮点数（FP16）下的性能达到11 TFLOPS，而其功耗仅为8W。昇腾310芯片采用华为自研的达芬奇架构，集成了丰富的计算单元，在各个领域得到广泛应用。随着全AI业务流程的加速，昇腾310芯片能够使智能系统的性能大幅提升，部署成本大幅降低。

### 技术规格

| 参数 | 规格 |
| --- | ---: |
| 性能 | 22 TOPS (INT8)<br> 11 TFLOPS (FP16) |
| 最大功耗 | 8 W |

* [昇腾310 AI处理器](https://e.huawei.com/cn/products/cloud-computing-dc/atlas/ascend-310)
* [昇腾社区](https://www.hiascend.com/zh/)
* [昇腾开发者](https://www.hiascend.com/zh/developer)
* [昇腾开发者社区](https://developer.huaweicloud.com/techfield/ascend.html)
* [Atlas 200 DK 开发者套件（型号：3000）](https://e.huawei.com/cn/products/cloud-computing-dc/atlas/atlas-200)
* [解密昇腾AI处理器--Ascend310简介](https://bbs.huaweicloud.com/blogs/134143)
* [芯课堂](https://www.hisilicon.com/cn/chip-academy)


## [Firefly](https://www.t-firefly.com)
Firefly是天启科技旗下的品牌，我们专注于开源智能硬件，物联网，数字音频产品的研发设计、生产和销售，同时提供了智能硬件产品的整体解决方案。Firefly产品包括核心板、行业主板、行业整机、集群服务器、开发套件、Station等产品。

* [Firefly 自营店](https://t-firefly.taobao.com)


## 参考资料
* [常见颜色空间](https://www.jianshu.com/p/f0e6382dd825)
* [主流AI应用边缘计算平台综合对比](https://zhuanlan.zhihu.com/p/382557252)
