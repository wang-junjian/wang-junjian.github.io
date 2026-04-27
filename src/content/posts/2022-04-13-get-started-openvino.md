---
layout: single
title:  "Get Started OpenVINO"
date:   2022-04-13 08:00:00 +0800
categories: [操作系统, 框架与库]
tags: [Install, venv, AI OpenVINO]
---

## [OpenVINO](https://www.intel.cn/content/www/cn/zh/developer/tools/openvino-toolkit/overview.html)
> **Open** **V**isual **I**nference and **N**eural network **O**ptimization

## [OpenVINO 安装](https://docs.openvino.ai/nightly/openvino_docs_install_guides_overview.html)
### [Development](https://pypi.org/project/openvino-dev/)
#### pip 安装
* [下载](https://www.intel.com/content/www/us/en/developer/tools/openvino-toolkit/download.html)

安装 OpenVINO 开发工具
```shell
python -m venv openvino_env
```

* Linux
```shell
source openvino_env/bin/activate
```
* Windows
```shell
openvino_env\Scripts\activate.bat
```

```shell
python -m pip install --upgrade pip
pip install openvino-dev[onnx,pytorch,kaldi,mxnet,caffe,tensorflow2]==2022.1.0 -i https://mirrors.aliyun.com/pypi/simple/
```
* [Install OpenVINO™ Development Tools](https://docs.openvino.ai/nightly/openvino_docs_install_guides_install_dev_tools.html)

#### 源代码编译安装(没有成功)👹
[Build OpenVINO™ Inference Engine](https://github.com/openvinotoolkit/openvino/wiki/BuildingCode)

```shell
mkdir openvinotoolkit && cd openvinotoolkit
git clone -b 2022.1.0 https://github.com/openvinotoolkit/openvino.git
git clone https://github.com/openvinotoolkit/open_model_zoo.git

cd openvino
sudo ./install_build_dependencies.sh 
sudo ./scripts/install_dependencies/install_NEO_OCL_driver.sh -y --no_numa
sudo ./scripts/install_dependencies/install_openvino_dependencies.sh -y -c=python

cmake --install . --prefix /opt/intel/openvino
```
* [OpenVINO Dockerfile](https://github.com/openvinotoolkit/docker_ci/blob/master/dockerfiles/ubuntu20/build_custom/Dockerfile)

### [Runtime](https://pypi.org/project/openvino/)

## OpenVINO 开发包下的组件
### [Model Optimizer](https://docs.openvino.ai/latest/openvino_docs_MO_DG_Deep_Learning_Model_Optimizer_DevGuide.html)
* mo
训练的模型导入、转换和优化为 OpenVINO 可用的格式（IR）。

### [Benchmark Tool](https://docs.openvino.ai/latest/openvino_inference_engine_tools_benchmark_tool_README.html)
* benchmark_app
允许您在同步和异步模式下估计受支持设备上的深度学习模型推理性能。

### [Accuracy Checker](https://docs.openvino.ai/latest/omz_tools_accuracy_checker.html) 和 [Annotation Converter](https://docs.openvino.ai/latest/omz_tools_accuracy_checker_annotation_converters.html)
* accuracy_check
深度学习准确性验证工具，可用于收集针对常用数据集的准确性指标。该工具的主要优点是配置的灵活性和一组支持的数据集、预处理、后处理和指标。
* convert_annotation
用于准备数据集以使用 accuracy_check 进行评估。

### [Post-Training Optimization Tool](https://docs.openvino.ai/latest/pot_README.html)
* pot
训练后优化工具允许您使用高级功能（如量化和低精度优化）优化训练的模型，而无需重新训练或微调模型。还可以通过 [API](https://docs.openvino.ai/latest/pot_compression_api_README.html) 进行优化。

### [Open Model Zoo tools](https://docs.openvino.ai/latest/omz_tools_downloader.html)
* omz_downloader
用于访问预训练深度学习公共模型和英特尔训练模型的集合。
* omz_converter
使用模型优化器将存储在原始深度学习框架格式中的 Open Model Zoo 模型转换为 OpenVINO 中间表示 (IR)。
* omz_quantizer
用于使用训练后优化工具（Post-Training Optimization Tool）将 IR 格式的全精度模型自动量化为低精度版本。
* omz_info_dumper
用于将有关模型的信息转储为机器可读格式。
* omz_data_downloader
数据集下载器

## 验证安装
```shell
$ python -c "from openvino.inference_engine import IECore; print('Inference Engine Available Devices: ', IECore().available_devices)"
Inference Engine Available Devices:  ['CPU', 'GPU']
```

## 查询 OpenVINO Runtime 设备及指标
[Hello Query Device Python Sample](https://github.com/openvinotoolkit/openvino/tree/master/samples/python/hello_query_device)

```shell
$ cd <openvino_dir>
$ python samples/python/hello_query_device/hello_query_device.py
[ INFO ] Available devices:
[ INFO ] CPU :
[ INFO ]        SUPPORTED_PROPERTIES:
[ INFO ]                AVAILABLE_DEVICES:
[ INFO ]                RANGE_FOR_ASYNC_INFER_REQUESTS: 1, 1, 1
[ INFO ]                RANGE_FOR_STREAMS: 1, 12
[ INFO ]                FULL_DEVICE_NAME: Intel(R) Core(TM) i7-8700 CPU @ 3.20GHz
[ INFO ]                OPTIMIZATION_CAPABILITIES: FP32, FP16, INT8, BIN, EXPORT_IMPORT
[ INFO ]                CACHE_DIR:
[ INFO ]                NUM_STREAMS: 1
[ INFO ]                AFFINITY: UNSUPPORTED TYPE
[ INFO ]                INFERENCE_NUM_THREADS: 0
[ INFO ]                PERF_COUNT: False
[ INFO ]                INFERENCE_PRECISION_HINT: UNSUPPORTED TYPE
[ INFO ]                PERFORMANCE_HINT: UNSUPPORTED TYPE
[ INFO ]                PERFORMANCE_HINT_NUM_REQUESTS: 0
[ INFO ]
[ INFO ] GPU :
[ INFO ]        SUPPORTED_PROPERTIES:
[ INFO ]                AVAILABLE_DEVICES: 0
[ INFO ]                RANGE_FOR_ASYNC_INFER_REQUESTS: 1, 2, 1
[ INFO ]                RANGE_FOR_STREAMS: 1, 2
[ INFO ]                OPTIMAL_BATCH_SIZE: 1
[ INFO ]                MAX_BATCH_SIZE: 1
[ INFO ]                FULL_DEVICE_NAME: Intel(R) UHD Graphics 630 (iGPU)
[ INFO ]                DEVICE_TYPE: UNSUPPORTED TYPE
[ INFO ]                DEVICE_GOPS: UNSUPPORTED TYPE
[ INFO ]                OPTIMIZATION_CAPABILITIES: FP32, BIN, FP16
[ INFO ]                GPU_DEVICE_TOTAL_MEM_SIZE: UNSUPPORTED TYPE
[ INFO ]                GPU_UARCH_VERSION: unknown
[ INFO ]                GPU_EXECUTION_UNITS_COUNT: 24
[ INFO ]                GPU_MEMORY_STATISTICS: UNSUPPORTED TYPE
[ INFO ]                PERF_COUNT: False
[ INFO ]                MODEL_PRIORITY: UNSUPPORTED TYPE
[ INFO ]                GPU_HOST_TASK_PRIORITY: UNSUPPORTED TYPE
[ INFO ]                GPU_QUEUE_PRIORITY: UNSUPPORTED TYPE
[ INFO ]                GPU_QUEUE_THROTTLE: UNSUPPORTED TYPE
[ INFO ]                GPU_ENABLE_LOOP_UNROLLING: True
[ INFO ]                CACHE_DIR:
[ INFO ]                PERFORMANCE_HINT: UNSUPPORTED TYPE
[ INFO ]                COMPILATION_NUM_THREADS: 12
[ INFO ]                NUM_STREAMS: 1
[ INFO ]                PERFORMANCE_HINT_NUM_REQUESTS: 0
[ INFO ]                DEVICE_ID: 0
[ INFO ]
```

## 模型
* [Intel Pre-Trained Models](https://github.com/openvinotoolkit/open_model_zoo/blob/master/models/intel/index.md)
    * [Intel's Pre-Trained Models Device Support](https://github.com/openvinotoolkit/open_model_zoo/blob/master/models/intel/device_support.md)
* [Public Pre-Trained Models](https://github.com/openvinotoolkit/open_model_zoo/blob/master/models/public/index.md)
    * [Public Pre-Trained Models Device Support](https://github.com/openvinotoolkit/open_model_zoo/blob/master/models/public/device_support.md)

### 下载所有模型
```shell
omz_downloader --all
```

### 转换所有下载的模型到 IR 格式
```shell
omz_converter --all
```

## 模型查看
netron 可以查看各种深度学习和机器学习框架训练出来的模型。

### 安装 [netron](https://pypi.org/project/netron/)
```shell
pip install netron
```

### 查看网络
通过设置 ```--host 0.0.0.0```，局域网内的其它主机也可以通过 http://ip:8080 访问。
```shell
netron public/alexnet/FP16/alexnet.xml --host 0.0.0.0
```

### Web 应用 [netron](https://netron.app)
通过页面的下载可以安装本地程序。

## Samples
### 图像分类
异步推理 [Image Classification Async Python Sample](https://github.com/openvinotoolkit/openvino/tree/master/samples/python/classification_sample_async)

同步推理 [Hello Classification Python Sample](https://github.com/openvinotoolkit/openvino/tree/master/samples/python/hello_classification)

[Image 和 Video 文件](https://github.com/intel-iot-devkit/sample-videos)
[download.01.org](https://download.01.org)

下载预训练模型
```shell
omz_downloader --name alexnet
```

转换模型，如果模型非 IR 或 ONNX 格式就需要转换。

```shell
omz_converter --name alexnet
```

下载图片
```shell
wget https://pamsdailydish.com/wp-content/uploads/2015/04/Bunch-Bananas-1.jpg -O banana.jpg
```

异步模型推理
```shell
$ python samples/python/classification_sample_async/classification_sample_async.py -m public/alexnet/FP16/alexnet.xml -i banana.jpg -d CPU
[ INFO ] Creating OpenVINO Runtime Core
[ INFO ] Reading the model: public/alexnet/FP16/alexnet.xml
[ INFO ] Loading the model to the plugin
[ INFO ] Starting inference in asynchronous mode
[ INFO ] Image path: banana.jpg
[ INFO ] Top 10 results: 
[ INFO ] class_id probability
[ INFO ] --------------------
[ INFO ] 954      0.9999748
[ INFO ] 666      0.0000086
[ INFO ] 953      0.0000053
[ INFO ] 939      0.0000025
[ INFO ] 951      0.0000020
[ INFO ] 945      0.0000017
[ INFO ] 941      0.0000016
[ INFO ] 940      0.0000009
[ INFO ] 943      0.0000005
[ INFO ] 950      0.0000002
[ INFO ] 
[ INFO ] This sample is an API example, for any performance measurements please use the dedicated benchmark_app tool
```

同步模型推理
```shell
$ python samples/python/hello_classification/hello_classification.py public/alexnet/FP16/alexnet.xml banana.jpg CPU
```

### 图像识别
[Hello Reshape SSD Python Sample](https://github.com/openvinotoolkit/openvino/tree/master/samples/python/hello_reshape_ssd)

下载预训练模型
```shell
omz_downloader --name mobilenet-ssd
```

转换模型，如果模型非 IR 或 ONNX 格式就需要转换。

```shell
omz_converter --name mobilenet-ssd
```

模型推理
```shell
$ python samples/python/hello_reshape_ssd/hello_reshape_ssd.py public/mobilenet-ssd/FP16/mobilenet-ssd.xml banana.jpg CPU
[ INFO ] Creating OpenVINO Runtime Core
[ INFO ] Reading the model: public/mobilenet-ssd/FP16/mobilenet-ssd.xml
[ INFO ] Reshaping the model to the height and width of the input image
[ INFO ] Loading the model to the plugin
[ INFO ] Starting inference in synchronous mode
[ INFO ] Found: class_id = 3, confidence = 0.69, coords = (139, 16), (418, 319)
[ INFO ] Image out.bmp was created!
```

### 使用源码动态创建模型（不需要 XML 文件）
[Model Creation Python Sample](https://github.com/openvinotoolkit/openvino/tree/master/samples/python/model_creation_sample)

```shell
$ python samples/python/model_creation_sample/model_creation_sample.py samples/python/model_creation_sample/lenet.bin CPU
[ INFO ] Creating OpenVINO Runtime Core
[ INFO ] Loading the model using ngraph function with weights from samples/python/model_creation_sample/lenet.bin
[ INFO ] Loading the model to the plugin
[ INFO ] Starting inference in synchronous mode
[ INFO ] Top 1 results: 
[ INFO ] Image 0
[ INFO ] 
[ INFO ] classid probability label
[ INFO ] -------------------------
[ INFO ] 0       1.0000000   0
[ INFO ] 
[ INFO ] Image 1
[ INFO ] 
......
[ INFO ] Image 9
[ INFO ] 
[ INFO ] classid probability label
[ INFO ] -------------------------
[ INFO ] 9       1.0000000   9
```

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

## 开发文档
* [英特尔® 发行版 OpenVINO™ 工具套件](https://www.intel.cn/content/www/cn/zh/developer/tools/openvino-toolkit/overview.html)
* [Get Started](https://docs.openvino.ai/nightly/get_started.html)
* [Get Started with Sample and Demo Applications](https://docs.openvino.ai/latest/openvino_docs_get_started_get_started_demos.html)
* [Open Model Zoo Demos](https://docs.openvino.ai/latest/omz_demos.html)
* [OpenVINO Notebooks Documentation](https://docs.openvino.ai/latest/notebooks/notebooks.html)
* [OpenVINO 课程](https://bizwebcast.intel.cn/dev/curriculum.html)
* [英特尔® 边缘人工智能开发者认证](https://www.intel.cn/content/www/cn/zh/developer/tools/devcloud/edge/learn/certification.html)

## 参考资料
* [OpenVINO](https://github.com/openvinotoolkit/openvino)
* [Open Model Zoo](https://github.com/openvinotoolkit/open_model_zoo)
* [Install OpenVINO Overview](https://docs.openvino.ai/latest/openvino_docs_install_guides_overview.html)
* [pypip openvino-runtime](https://pypi.org/project/openvino/)
* [pypip openvino-dev](https://pypi.org/project/openvino-dev/)
* [pypip netron](https://pypi.org/project/netron/)
* [netron](https://github.com/lutzroeder/netron)
* [Visualize Neural Network Model using Netron](https://lindevs.com/visualize-neural-network-model-using-netron/)
* [Prepare the Kinetics400 dataset](https://cv.gluon.ai/build/examples_datasets/kinetics400.html)
* [OpenVINO](https://docs.openvino.ai/latest/index.html)
