---
layout: post
title:  "OpenVINO 的工作原理"
date:   2022-04-13 10:00:00 +0800
categories: AI OpenVINO
tags: [Workflow]
---

## OpenVINO 工作流程
OpenVINO 包含一整套开发和部署工具，本工作流研究从设置和计划解决方案到部署的关键步骤。

🎃 [0 计划和设置](#0-先决条件计划和设置) ➔ [1 训练模型](#1-训练模型) ➔ [2 转换和优化](#2-转换和优化) ➔ [3 调整性能](#3-调整性能) ➔ [4 部署应用程序](#4-部署应用程序)

![](/images/2022/openvino/diagram-using-ov-full-16x9.jpg)

## 0 先决条件：计划和设置
选择您的主机和目标平台，然后选择型号。

### 确定环境和配置
该工具套件支持 Linux*、Windows*、macOS* 和 Raspbian* 等操作系统。虽然表示形式和代码与目标设备和操作系统无关，但是您可能需要在特定环境中创建部署程序包。

#### [支持的开发平台](https://www.intel.cn/content/www/cn/zh/developer/tools/openvino-toolkit/system-requirements.html)
* 开发平台
    * 处理器
        * 第 6 代至 12 代智能英特尔® 酷睿™ 处理器
        * 第 1 代至第 3 代英特尔® 至强® 可扩展处理器
    * 操作系统
        * Ubuntu 18.04 LTS（64 位）
        * Ubuntu 20.04 LTS（64 位）
        * Windows® 10（64 位）
        * Windows* 11（建议用于第 12 代智能英特尔® 酷睿™ 处理器）
        * Red Hat* Enterprise Linux* 8（64 位）
        * macOS* 10.15（64 位）
* 目标平台
    * 处理器 CPU GPU VPU GNA
    * 操作系统

#### [支持的部署设备](https://docs.openvino.ai/latest/openvino_docs_IE_DG_supported_plugins_Supported_Devices.html)
* [Supported Model Formats](https://docs.openvino.ai/latest/openvino_docs_OV_UG_supported_plugins_Supported_Devices.html#supported-model-formats)
    优先选用 FP16，它是最普遍的且性能最佳。
* [Supported Input Precision](https://docs.openvino.ai/latest/openvino_docs_OV_UG_supported_plugins_Supported_Devices.html#supported-input-precision)
    优先选用 U8，它是最普遍的。
* [Supported Output Precision](https://docs.openvino.ai/latest/openvino_docs_OV_UG_supported_plugins_Supported_Devices.html#supported-output-precision)
    优先选用 FP32，它是最普遍的。
* [Supported Input Layout](https://docs.openvino.ai/latest/openvino_docs_OV_UG_supported_plugins_Supported_Devices.html#supported-input-layout)
* [Supported Output Layout](https://docs.openvino.ai/latest/openvino_docs_OV_UG_supported_plugins_Supported_Devices.html#supported-output-layout)
* [Supported Layers](https://docs.openvino.ai/latest/openvino_docs_OV_UG_supported_plugins_Supported_Devices.html#supported-layers)

#### [安装和设置指南](https://docs.openvino.ai/latest/index.html)

### 确定模型类型和框架
该工具套件支持 TensorFlow*、Caffe*、MXNet* 和 Kaldi* 等深度学习模型训练框架，以及 Open Neural Network Exchange（ONNX*）模型格式。该支持还包含那些框架中的大多数层。此外，该工具套件可以扩展为支持自定义层。

#### [受支持的框架层](https://docs.openvino.ai/latest/openvino_docs_MO_DG_prepare_model_Supported_Frameworks_Layers.html)
* [Caffe Supported Layers](https://docs.openvino.ai/latest/openvino_docs_MO_DG_prepare_model_Supported_Frameworks_Layers.html#caffe-supported-layers)
* [MXNet Supported Symbols](https://docs.openvino.ai/latest/openvino_docs_MO_DG_prepare_model_Supported_Frameworks_Layers.html#mxnet-supported-symbols)
* [TensorFlow Supported Operations](https://docs.openvino.ai/latest/openvino_docs_MO_DG_prepare_model_Supported_Frameworks_Layers.html#tensorflow-supported-operations)
* [TensorFlow 2 Keras Supported Operations](https://docs.openvino.ai/latest/openvino_docs_MO_DG_prepare_model_Supported_Frameworks_Layers.html#tensorflow-2-keras-supported-operations)
* [Kaldi Supported Layers](https://docs.openvino.ai/latest/openvino_docs_MO_DG_prepare_model_Supported_Frameworks_Layers.html#kaldi-supported-layers)
* [ONNX Supported Operators](https://docs.openvino.ai/latest/openvino_docs_MO_DG_prepare_model_Supported_Frameworks_Layers.html#onnx-supported-operators)
* [PaddlePaddle Supported Operators](https://docs.openvino.ai/latest/openvino_docs_MO_DG_prepare_model_Supported_Frameworks_Layers.html#paddlepaddle-supported-operators)

#### [扩展自定义层](https://docs.openvino.ai/latest/openvino_docs_Extensibility_UG_Intro.html)
* [Model Conversion Pipeline](https://docs.openvino.ai/latest/openvino_docs_MO_DG_prepare_model_customize_model_optimizer_Customize_Model_Optimizer.html#model-conversion-pipeline)

![](/images/2022/openvino/MO_conversion_pipeline.png)

## 1 训练模型
使用您选择的框架来准备和训练深度学习模型。

### 使用预训练的模型
查找开源的预训练模型或建立自己的模型。Open Model Zoo 针对各种常规任务（例如对象识别、人体姿势估计、文本检测和动作识别）提供经过优化、预训练模型的开源存储库。在存储库中，对公共模型的经过验证的支持以及代码示例和演示的集合也是开源的。该存储库经 Apache 2.0 许可使用。

#### [Open Model Zoo](https://github.com/openvinotoolkit/open_model_zoo)
* [Intel Pre-Trained Models](https://github.com/openvinotoolkit/open_model_zoo/blob/master/models/intel/index.md)
* [Public Pre-Trained Models](https://github.com/openvinotoolkit/open_model_zoo/blob/master/models/public/index.md)

#### [模型下载器](https://docs.openvino.ai/latest/omz_tools_downloader.html) [GitHub](https://github.com/openvinotoolkit/open_model_zoo/blob/master/tools/model_tools/README.md)

#### [Demos](https://github.com/openvinotoolkit/open_model_zoo/blob/master/demos/README.md)

### 准备模型
使用脚本或手动过程为用于训练模型的框架配置模型优化器。

#### [准备和优化](https://docs.openvino.ai/latest/openvino_docs_performance_benchmarks.html)
* [OpenVINO toolkit Benchmark Results](https://docs.openvino.ai/latest/openvino_docs_performance_benchmarks_openvino.html)
    * Throughput - 测量延迟阈值内提供的推断数量。（例如，每秒帧数-FPS）。在部署具有深度学习推理的系统时，请选择在延迟和功率之间提供最佳权衡的吞吐量，以获得满足您要求的价格和性能。
    * Value - 虽然吞吐量很重要，但在边缘人工智能部署中，更关键的是性能效率或成本性能。每美元系统成本吞吐量的应用程序性能是衡量价值的最佳指标。
    * Efficiency - 系统电源是从边缘到数据中心的关键考虑因素。在选择深度学习解决方案时，能效（吞吐量/瓦特）是一个需要考虑的关键因素。英特尔设计为运行深度学习工作负载提供了出色的能效。
    * Latency - 这测量推理请求的同步执行，并以毫秒为单位报告。每个推理请求（例如：预处理、推理、后处理）都允许在下一个开始之前完成。此性能指标与需要尽快对单个图像输入进行操作的使用场景相关。一个例子是医疗保健部门，医务人员只要求分析单个超声扫描图像或实时或近实时应用，例如工业机器人对其环境中行动的反应或自动驾驶汽车的避障。    
* [OpenVINO Model Server Benchmark Results](https://docs.openvino.ai/latest/openvino_docs_performance_benchmarks_ovms.html)

#### [配置模型优化器](https://docs.openvino.ai/latest/openvino_docs_MO_DG_Deep_Learning_Model_Optimizer_DevGuide.html)
![](/images/2022/openvino/BASIC_FLOW_MO_simplified.svg)

## 2 转换和优化
运行模型优化器以转换模型，并准备进行推理。

### 运行模型优化器
运行模型优化器，并将模型转换为中间表示 (IR)，该中间表示以一对文件（.xml 和 .bin）表示。这些文件描述了网络拓扑，并包含权重和偏差模型的二进制数据。

#### []()
#### []()
#### []()

### 转换后检查和验证
除了文件对（.xml 和 .bin）之外，模型优化器还会输出有助于进一步调优的诊断消息。另外，开源工具准确性检查程序可以帮助验证模型的准确性。要加速推理并将模型转换为不需要重新训练的硬件友好表示（例如，较低精度的 INT8），使用训练后优化工具。

#### [模型优化器开发人员指南](https://docs.openvino.ai/latest/openvino_docs_MO_DG_Deep_Learning_Model_Optimizer_DevGuide.html)
* [Setting Input Shapes](https://docs.openvino.ai/latest/openvino_docs_MO_DG_prepare_model_convert_model_Converting_Model.html)
    * Dynamic Input ([-1,150,200,1], [1..3,150,200,1])
    * Static Input ([3 150 200 1])
* [Cutting Off Parts of a Model](https://docs.openvino.ai/latest/openvino_docs_MO_DG_prepare_model_convert_model_Cutting_Model.html)
    * 不能转换的预处理（Pre- and Post-）。
    * 训练时有用，推理用不到的。
    * 太复杂的。
    * 有问题的。
* [Embedding Preprocessing Computation](https://docs.openvino.ai/latest/openvino_docs_MO_DG_Additional_Optimization_Use_Cases.html)
    * Layout (NCHW <-> NHWC)
    * 归一化 (Mean, Scale)
    * Channel (RGB <-> BGR)
* [Compression of a Model to FP16](https://docs.openvino.ai/latest/openvino_docs_MO_DG_FP16_Compression.html)
* 转换不同框架训练出来的模型
* [Model Optimizer Frequently Asked Questions](https://docs.openvino.ai/latest/openvino_docs_MO_DG_prepare_model_Model_Optimizer_FAQ.html)

#### [中间表示和操作集](https://docs.openvino.ai/latest/openvino_docs_MO_DG_IR_and_opsets.html)
* [Deep Learning Network Intermediate Representation and Operation Sets in OpenVINO](https://docs.openvino.ai/latest/openvino_docs_MO_DG_IR_and_opsets.html)
* [Available Operations Sets](https://docs.openvino.ai/latest/openvino_docs_ops_opset.html)
* [Broadcast Rules For Elementwise Operations](https://docs.openvino.ai/latest/openvino_docs_ops_broadcast_rules.html)
* [Intermediate Representation Suitable for INT8 Inference](https://docs.openvino.ai/latest/openvino_docs_MO_DG_prepare_model_convert_model_IR_suitable_for_INT8_inference.html)
* [Operations Specifications](https://docs.openvino.ai/latest/openvino_docs_operations_specifications.html)
* 3D Convolution IR 的描述

```xml
<layer type="Convolution" ...>
    <data dilations="2,2,2" pads_begin="0,0,0" pads_end="0,0,0" strides="3,3,3" auto_pad="explicit"/>
    <input>
        <port id="0">
            <dim>1</dim>
            <dim>7</dim>
            <dim>320</dim>
            <dim>320</dim>
            <dim>320</dim>
        </port>
        <port id="1">
            <dim>32</dim>
            <dim>7</dim>
            <dim>3</dim>
            <dim>3</dim>
            <dim>3</dim>
        </port>
    </input>
    <output>
        <port id="2" precision="FP32">
            <dim>1</dim>
            <dim>32</dim>
            <dim>106</dim>
            <dim>106</dim>
            <dim>106</dim>
        </port>
    </output>
</layer>
```

## 3 调整性能
使用推理引擎来编译优化的网络并管理指定设备上的推理操作。

### 运行推理引擎
加载并编译优化的模型，并对输入数据进行推理操作，然后输出结果。推理引擎是带有接口的高级（C、C++ 或 Python）推理 API，该接口实现为每种硬件类型的动态加载的插件。它为每种硬件提供了最佳性能，而无需实施和维护多个代码路径。

#### [推理引擎开发人员指南](https://docs.openvino.ai/latest/openvino_docs_OV_UG_OV_Runtime_User_Guide.html)
The scheme below illustrates the typical workflow for deploying a trained deep learning model:

![](/images/2022/openvino/BASIC_FLOW_IE_C.svg)

* [Integrate OpenVINO™ with Your Application](https://docs.openvino.ai/latest/openvino_docs_OV_UG_Integrate_OV_with_your_application.html)

Use OpenVINO™ Runtime API to Implement Inference Pipeline

![](/images/2022/openvino/IMPLEMENT_PIPELINE_with_API_C.svg)

* [Changing input shapes](https://docs.openvino.ai/latest/openvino_docs_OV_UG_ShapeInference.html?sw_type=switcher-python)
* [Working with devices](https://docs.openvino.ai/latest/openvino_docs_OV_UG_Working_with_devices.html)
    * 设备插件
        * CPU
        * GPU
        * VPUs
        * GNA
        * Arm® CPU
    * 工作在设备上功能
        * Multi-Device execution 自动将推理请求分配给可用的计算设备，以并行执行请求。
        * Auto-Device selection 通过自我发现系统中所有可用的加速器和功能，推导出该设备上的最佳优化设置，选择最好的设备。
        * Heterogeneous execution 可以在多个设备上执行一个模型的推理，运行不同的层，但不能并行运行。利用加速器的力量处理模型中最重的部分，并在CPU等后备设备上执行不受支持的操作。
        * Automatic Batching 执行实时自动批处理（即将推理请求分组在一起），以提高设备利用率，而无需用户进行编程工作。
* [Optimize Preprocessing](https://docs.openvino.ai/latest/openvino_docs_OV_UG_Preprocessing_Overview.html)
* [Dynamic Shapes](https://docs.openvino.ai/latest/openvino_docs_OV_UG_DynamicShapes.html)
* [Automatic device selection](https://docs.openvino.ai/latest/openvino_docs_OV_UG_supported_plugins_AUTO.html)

![](/images/2022/openvino/autoplugin_accelerate.png)

* [Running on multiple devices simultaneously](https://docs.openvino.ai/latest/openvino_docs_OV_UG_Running_on_multiple_devices.html)
* [Heterogeneous execution](https://docs.openvino.ai/latest/openvino_docs_OV_UG_Hetero_execution.html)
* [High-level Performance Hints](https://docs.openvino.ai/latest/openvino_docs_OV_UG_Performance_Hints.html)
* [Automatic Batching](https://docs.openvino.ai/latest/openvino_docs_OV_UG_Automatic_Batching.html)
* [Stateful models](https://docs.openvino.ai/latest/openvino_docs_OV_UG_network_state_intro.html)

### 优化性能
工具套件中的其他工具有助于提高性能。基准应用程序分析模型的性能；交叉检查工具比较两个连续模型推断之间的准确性和性能；深度学习工作台允许您可视化、微调和比较深度学习模型的性能。

#### 性能调整
* [Introduction to Performance Optimization](https://docs.openvino.ai/latest/openvino_docs_optimization_guide_dldt_optimization_guide.html)

    ![](/images/2022/openvino/LATENCY_VS_THROUGHPUT.svg)

* [Getting Performance Numbers](https://docs.openvino.ai/latest/openvino_docs_MO_DG_Getting_Performance_Numbers.html)
* [Model Optimization Guide](https://docs.openvino.ai/latest/openvino_docs_model_optimization_guide.html)

    ![](/images/2022/openvino/DEVELOPMENT_FLOW_V3_crunch.svg)

    * [Optimizing models post-training](https://docs.openvino.ai/latest/pot_introduction.html)

    ![](/images/2022/openvino/workflow_simple.png)

    * [Neural Network Compression Framework](https://docs.openvino.ai/latest/docs_nncf_introduction.html)

    ![](/images/2022/openvino/nncf_workflow.png)

    * [Protecting Deep Learning Model through Range Supervision](https://docs.openvino.ai/latest/pot_ranger_README.html)

    ![](/images/2022/openvino/scheme3.png)

* [Runtime Inference Optimizations](https://docs.openvino.ai/latest/openvino_docs_deployment_optimization_guide_dldt_optimization_guide.html)
* [Tuning Utilities](https://docs.openvino.ai/latest/openvino_docs_tuning_utilities.html)
* [Performance Benchmarks](https://docs.openvino.ai/latest/openvino_docs_performance_benchmarks.html)

#### [基准 Python 应用](https://docs.openvino.ai/latest/openvino_inference_engine_tools_benchmark_tool_README.html)
#### [基准 C++ 应用](https://docs.openvino.ai/latest/openvino_inference_engine_samples_benchmark_app_README.html)
#### [交叉检查工具](https://docs.openvino.ai/latest/openvino_inference_engine_tools_cross_check_tool_README.html)
#### [深度学习工作台](https://docs.openvino.ai/latest/workbench_docs_Workbench_DG_Introduction.html)
* [Install DL Workbench](https://docs.openvino.ai/latest/workbench_docs_Workbench_DG_Run_Locally.html)
* DL Workbench 工作流程
![](/images/2022/openvino/dl_wb_diagram_overview.svg)
* [Get a quick overview of the workflow in the DL Workbench User Interface](https://docs.openvino.ai/latest/_images/workflow_DL_Workbench.gif)

## 4 部署应用程序
使用推理引擎来部署您的应用程序。

### 调用推理引擎
使用推理引擎时，可以将其称为具有扩展名的核心对象，然后将优化的 nGraph 网络模型加载到特定的目标设备。加载网络后，推理引擎可接受数据和请求，以运行推理并传递输出数据。

#### [推理引擎开发人员指南](#推理引擎开发人员指南)
#### [将推理引擎集成到您的应用程序中](https://docs.openvino.ai/latest/openvino_docs_OV_UG_Integrate_OV_with_your_application.html)
![](/images/2022/openvino/IMPLEMENT_PIPELINE_with_API_C.svg)

### 部署到运行时环境
通过将模型、IR 文件、您的应用程序以及相关的依赖项组装到目标设备的运行时程序包中，使用部署管理器来创建部署程序包。

#### [部署管理器](https://docs.openvino.ai/latest/openvino_docs_install_guides_deployment_manager_tool.html)
* Prerequisites
    * Intel® Distribution of OpenVINO™ toolkit
    * To run inference on a target device other than CPU, device drivers must be pre-installed.
* Create Deployment Package Using Deployment Manager
* Deploy Package on Target Systems

## 工具套件插件
[英特尔® 发行版 OpenVINO™ 工具套件](https://www.intel.cn/content/www/cn/zh/developer/tools/openvino-toolkit/overview.html)

### [计算机视觉注释工具](https://github.com/openvinotoolkit/cvat)
这个基于 Web 的工具可在训练模型之前帮助注释视频和图像。

### [数据集管理框架](https://github.com/openvinotoolkit/datumaro)
使用此插件可以构建、转换和分析数据集。

### [深度学习流媒体播放器](https://github.com/dlstreamer/dlstreamer)
考虑使用此分析框架，以使用英特尔发行版 OpenVINO 工具套件创建和部署复杂的媒体分析管道。

### [神经网络压缩框架](https://github.com/openvinotoolkit/nncf)
使用此基于 PyTorch 的框架进行量化感知训练。

### [OpenVINO™ 模型服务器](https://github.com/openvinotoolkit/model_server)
该可扩展推理服务器用于服务通过英特尔® 发行版 OpenVINO™ 工具套件优化的模型。

### [OpenVINO™ 安全附加组件](https://github.com/openvinotoolkit/security_addon)
支持采用基于内核的虚拟机 (KVM) 和 Docker* 容器进行安全封装和灵活部署。与 OpenVINO 模型服务器兼容。

### [训练扩展](https://github.com/openvinotoolkit/training_extensions)
访问可训练的深度学习模型，使用自定义数据进行训练。

## 参考资料
* [英特尔® 发行版 OpenVINO™ 工具套件](https://www.intel.cn/content/www/cn/zh/developer/tools/openvino-toolkit/overview.html)
* [Get Started](https://docs.openvino.ai/nightly/get_started.html)
* [Get Started with Sample and Demo Applications](https://docs.openvino.ai/latest/openvino_docs_get_started_get_started_demos.html)
* [Open Model Zoo Demos](https://docs.openvino.ai/latest/omz_demos.html)
* [OpenVINO Notebooks Documentation](https://docs.openvino.ai/latest/notebooks/notebooks.html)
* [OpenVINO](https://github.com/openvinotoolkit/openvino)
* [Open Model Zoo](https://github.com/openvinotoolkit/open_model_zoo)
* [Install OpenVINO Overview](https://docs.openvino.ai/latest/openvino_docs_install_guides_overview.html)
* [pypip openvino-runtime](https://pypi.org/project/openvino/)
* [pypip openvino-dev](https://pypi.org/project/openvino-dev/)
* [OpenVINO™ Deep Learning Workbench Docker](https://hub.docker.com/r/openvino/workbench)
* [OpenVINO 课程](https://bizwebcast.intel.cn/dev/curriculum.html)
* [英特尔® 边缘人工智能开发者认证](https://www.intel.cn/content/www/cn/zh/developer/tools/devcloud/edge/learn/certification.html)
