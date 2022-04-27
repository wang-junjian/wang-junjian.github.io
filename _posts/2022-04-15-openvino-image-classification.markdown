---
layout: post
title:  "OpenVINO 图像分类"
date:   2022-04-15 08:00:00 +0800
categories: AI OpenVINO
tags: [图像分类, googlenet]
---

## 同步推理
### 激活 OpenVINO 开发环境
```shell
source openvino_env/bin/activate
```

### 预训练模型
* [alexnet](https://docs.openvino.ai/latest/omz_models_model_alexnet.html)
* [googlenet-v1](https://docs.openvino.ai/latest/omz_models_model_googlenet_v1.html)
来自 ImageNet 的 1000 个类别：```<omz_dir>/data/dataset_classes/imagenet_2012.txt```

### 下载模型
```shell
$ omz_downloader --name googlenet-v1
################|| Downloading googlenet-v1 ||################

========== Downloading /home/wjunjian/openvino/openvino/samples/python/hello_classification/public/googlenet-v1/googlenet-v1.prototxt
... 100%, 35 KB, 41370 KB/s, 0 seconds passed

========== Downloading /home/wjunjian/openvino/openvino/samples/python/hello_classification/public/googlenet-v1/googlenet-v1.caffemodel
... 100%, 52279 KB, 5152 KB/s, 10 seconds passed

========== Replacing text in /home/wjunjian/openvino/openvino/samples/python/hello_classification/public/googlenet-v1/googlenet-v1.prototxt
```

### 转换模型
```shell
$ omz_converter --name googlenet-v1
========== Converting googlenet-v1 to IR (FP16)
Conversion command: /home/wjunjian/openvino/openvino_env/bin/python -- /home/wjunjian/openvino/openvino_env/bin/mo --framework=caffe --data_type=FP16 --output_dir=/home/wjunjian/openvino/openvino/samples/python/hello_classification/public/googlenet-v1/FP16 --model_name=googlenet-v1 --input=data '--mean_values=data[104.0,117.0,123.0]' --output=prob --input_model=/home/wjunjian/openvino/openvino/samples/python/hello_classification/public/googlenet-v1/googlenet-v1.caffemodel --input_proto=/home/wjunjian/openvino/openvino/samples/python/hello_classification/public/googlenet-v1/googlenet-v1.prototxt '--layout=data(NCHW)' '--input_shape=[1, 3, 224, 224]'

Model Optimizer arguments:
Common parameters:
	- Path to the Input Model: 	/home/wjunjian/openvino/openvino/samples/python/hello_classification/public/googlenet-v1/googlenet-v1.caffemodel
	- Path for generated IR: 	/home/wjunjian/openvino/openvino/samples/python/hello_classification/public/googlenet-v1/FP16
	- IR output name: 	googlenet-v1
	- Log level: 	ERROR
	- Batch: 	Not specified, inherited from the model
	- Input layers: 	data
	- Output layers: 	prob
	- Input shapes: 	[1, 3, 224, 224]
	- Source layout: 	Not specified
	- Target layout: 	Not specified
	- Layout: 	data(NCHW)
	- Mean values: 	data[104.0,117.0,123.0]
	- Scale values: 	Not specified
	- Scale factor: 	Not specified
	- Precision of IR: 	FP16
	- Enable fusing: 	True
	- User transformations: 	Not specified
	- Reverse input channels: 	False
	- Enable IR generation for fixed input shape: 	False
	- Use the transformations config file: 	None
Advanced parameters:
	- Force the usage of legacy Frontend of Model Optimizer for model conversion into IR: 	False
	- Force the usage of new Frontend of Model Optimizer for model conversion into IR: 	False
Caffe specific parameters:
	- Path to Python Caffe* parser generated from caffe.proto: 	/home/wjunjian/openvino/openvino_env/lib/python3.9/site-packages/openvino/tools/mo/utils/../front/caffe/proto
	- Enable resnet optimization: 	True
	- Path to the Input prototxt: 	/home/wjunjian/openvino/openvino/samples/python/hello_classification/public/googlenet-v1/googlenet-v1.prototxt
	- Path to CustomLayersMapping.xml: 	/home/wjunjian/openvino/openvino_env/lib/python3.9/site-packages/openvino/tools/mo/utils/../../extensions/front/caffe/CustomLayersMapping.xml
	- Path to a mean file: 	Not specified
	- Offsets for a mean file: 	Not specified
OpenVINO runtime found in: 	/home/wjunjian/openvino/openvino_env/lib/python3.9/site-packages/openvino
OpenVINO runtime version: 	2022.1.0-7019-cdb9bec7210-releases/2022/1
Model Optimizer version: 	2022.1.0-7019-cdb9bec7210-releases/2022/1
[ SUCCESS ] Generated IR version 11 model.
[ SUCCESS ] XML file: /home/wjunjian/openvino/openvino/samples/python/hello_classification/public/googlenet-v1/FP16/googlenet-v1.xml
[ SUCCESS ] BIN file: /home/wjunjian/openvino/openvino/samples/python/hello_classification/public/googlenet-v1/FP16/googlenet-v1.bin
[ SUCCESS ] Total execution time: 7.90 seconds. 
[ SUCCESS ] Memory consumed: 192 MB. 
[ INFO ] The model was converted to IR v11, the latest model format that corresponds to the source DL framework input/output format. While IR v11 is backwards compatible with OpenVINO Inference Engine API v1.0, please use API v2.0 (as of 2022.1) to take advantage of the latest improvements in IR v11.
Find more information about API v2.0 and IR v11 at https://docs.openvino.ai

========== Converting googlenet-v1 to IR (FP32)
Conversion command: /home/wjunjian/openvino/openvino_env/bin/python -- /home/wjunjian/openvino/openvino_env/bin/mo --framework=caffe --data_type=FP32 --output_dir=/home/wjunjian/openvino/openvino/samples/python/hello_classification/public/googlenet-v1/FP32 --model_name=googlenet-v1 --input=data '--mean_values=data[104.0,117.0,123.0]' --output=prob --input_model=/home/wjunjian/openvino/openvino/samples/python/hello_classification/public/googlenet-v1/googlenet-v1.caffemodel --input_proto=/home/wjunjian/openvino/openvino/samples/python/hello_classification/public/googlenet-v1/googlenet-v1.prototxt '--layout=data(NCHW)' '--input_shape=[1, 3, 224, 224]' '--layout=data(NCHW)' '--input_shape=[1, 3, 224, 224]'

Model Optimizer arguments:
Common parameters:
	- Path to the Input Model: 	/home/wjunjian/openvino/openvino/samples/python/hello_classification/public/googlenet-v1/googlenet-v1.caffemodel
	- Path for generated IR: 	/home/wjunjian/openvino/openvino/samples/python/hello_classification/public/googlenet-v1/FP32
	- IR output name: 	googlenet-v1
	- Log level: 	ERROR
	- Batch: 	Not specified, inherited from the model
	- Input layers: 	data
	- Output layers: 	prob
	- Input shapes: 	[1, 3, 224, 224]
	- Source layout: 	Not specified
	- Target layout: 	Not specified
	- Layout: 	data(NCHW)
	- Mean values: 	data[104.0,117.0,123.0]
	- Scale values: 	Not specified
	- Scale factor: 	Not specified
	- Precision of IR: 	FP32
	- Enable fusing: 	True
	- User transformations: 	Not specified
	- Reverse input channels: 	False
	- Enable IR generation for fixed input shape: 	False
	- Use the transformations config file: 	None
Advanced parameters:
	- Force the usage of legacy Frontend of Model Optimizer for model conversion into IR: 	False
	- Force the usage of new Frontend of Model Optimizer for model conversion into IR: 	False
Caffe specific parameters:
	- Path to Python Caffe* parser generated from caffe.proto: 	/home/wjunjian/openvino/openvino_env/lib/python3.9/site-packages/openvino/tools/mo/utils/../front/caffe/proto
	- Enable resnet optimization: 	True
	- Path to the Input prototxt: 	/home/wjunjian/openvino/openvino/samples/python/hello_classification/public/googlenet-v1/googlenet-v1.prototxt
	- Path to CustomLayersMapping.xml: 	/home/wjunjian/openvino/openvino_env/lib/python3.9/site-packages/openvino/tools/mo/utils/../../extensions/front/caffe/CustomLayersMapping.xml
	- Path to a mean file: 	Not specified
	- Offsets for a mean file: 	Not specified
OpenVINO runtime found in: 	/home/wjunjian/openvino/openvino_env/lib/python3.9/site-packages/openvino
OpenVINO runtime version: 	2022.1.0-7019-cdb9bec7210-releases/2022/1
Model Optimizer version: 	2022.1.0-7019-cdb9bec7210-releases/2022/1
[ SUCCESS ] Generated IR version 11 model.
[ SUCCESS ] XML file: /home/wjunjian/openvino/openvino/samples/python/hello_classification/public/googlenet-v1/FP32/googlenet-v1.xml
[ SUCCESS ] BIN file: /home/wjunjian/openvino/openvino/samples/python/hello_classification/public/googlenet-v1/FP32/googlenet-v1.bin
[ SUCCESS ] Total execution time: 7.91 seconds. 
[ SUCCESS ] Memory consumed: 192 MB. 
[ INFO ] The model was converted to IR v11, the latest model format that corresponds to the source DL framework input/output format. While IR v11 is backwards compatible with OpenVINO Inference Engine API v1.0, please use API v2.0 (as of 2022.1) to take advantage of the latest improvements in IR v11.
Find more information about API v2.0 and IR v11 at https://docs.openvino.ai
```

### 下载图像
```shell
wget https://pamsdailydish.com/wp-content/uploads/2015/04/Bunch-Bananas-1.jpg -O banana.jpg
wget http://img0.etsystatic.com/000/0/5881538/il_fullxfull.308608632.jpg -O apple-banana.jpg
```

### 程序开发
```shell
$ vim classification.py
```
```py
import logging as log
import sys

import cv2
import numpy as np

from openvino.preprocess import PrePostProcessor, ResizeAlgorithm
from openvino.runtime import Core, Layout, Type


def main():
    log.basicConfig(format='[ %(levelname)s ] %(message)s', level=log.INFO, stream=sys.stdout)

    # Parsing and validation of input arguments
    if len(sys.argv) != 4:
        log.info(f'Usage: {sys.argv[0]} <path_to_model> <path_to_image> <device_name>')
        return 1

    model_path = sys.argv[1]
    image_path = sys.argv[2]
    device_name = sys.argv[3]

    log.info('1. Creating OpenVINO Runtime Core')
    core = Core()

    log.info(f'2. Reading the model: {model_path}')
    # (.xml and .bin files) or (.onnx file)
    model = core.read_model(model_path)

    if len(model.inputs) != 1:
        log.error('Sample supports only single input topologies')
        return -1

    if len(model.outputs) != 1:
        log.error('Sample supports only single output topologies')
        return -1

    log.info(f'3. Set up input')
    # Read input image
    image = cv2.imread(image_path)
    # Add N dimension
    input_tensor = np.expand_dims(image, 0)

    log.info(f'4. Apply preprocessing')
    ppp = PrePostProcessor(model)

    _, h, w, _ = input_tensor.shape

    # 1) Set input tensor information:
    # - input() provides information about a single model input
    # - reuse precision and shape from already available `input_tensor`
    # - layout of data is 'NHWC'
    ppp.input().tensor() \
        .set_element_type(Type.u8) \
        .set_layout(Layout('NHWC')) \
        .set_spatial_static_shape(h, w)  # noqa: ECE001, N400

    # 2) Adding explicit preprocessing steps:
    # - apply linear resize from tensor spatial dims to model spatial dims
    ppp.input().preprocess().resize(ResizeAlgorithm.RESIZE_LINEAR)

    # 3) Here we suppose model has 'NCHW' layout for input
    ppp.input().model().set_layout(Layout('NCHW'))

    # 4) Set output tensor information:
    # - precision of tensor is supposed to be 'f32'
    ppp.output().tensor().set_element_type(Type.f32)

    # 5) Apply preprocessing modifying the original 'model'
    model = ppp.build()

    log.info('5. Loading the model to the plugin')
    compiled_model = core.compile_model(model, device_name)

    log.info('6. Create infer request and do inference synchronously')
    results = compiled_model.infer_new_request({0: input_tensor})

    log.info('7. Process output')
    predictions = next(iter(results.values()))

    # Change a shape of a numpy.ndarray with results to get another one with one dimension
    probs = predictions.reshape(-1)

    # Get an array of 10 class IDs in descending order of probability
    top_10 = np.argsort(probs)[-10:][::-1]

    header = 'class_id probability'

    log.info(f'Image path: {image_path}')
    log.info('Top 10 results: ')
    log.info(header)
    log.info('-' * len(header))

    for class_id in top_10:
        probability_indent = ' ' * (len('class_id') - len(str(class_id)) + 1)
        log.info(f'{class_id}{probability_indent}{probs[class_id]:.7f}')

    log.info('')

    return 0


if __name__ == '__main__':
    sys.exit(main())
```

### 运行程序
```shell
$ python classification.py public/googlenet-v1/FP32/googlenet-v1.xml banana.jpg CPU
[ INFO ] 1. Creating OpenVINO Runtime Core
[ INFO ] 2. Reading the model: public/googlenet-v1/FP32/googlenet-v1.xml
[ INFO ] 3. Set up input
[ INFO ] 4. Apply preprocessing
[ INFO ] 5. Loading the model to the plugin
[ INFO ] 6. Create infer request and do inference synchronously
[ INFO ] 7. Process output
[ INFO ] Image path: banana.jpg
[ INFO ] Top 10 results: 
[ INFO ] class_id probability
[ INFO ] --------------------
[ INFO ] 954      0.9991695
[ INFO ] 939      0.0002741
[ INFO ] 950      0.0001484
[ INFO ] 951      0.0001031
[ INFO ] 952      0.0000586
[ INFO ] 942      0.0000584
[ INFO ] 883      0.0000346
[ INFO ] 941      0.0000197
[ INFO ] 940      0.0000133
[ INFO ] 584      0.0000098
[ INFO ] 
```

## 推理程序的框架
```py
# 创建 OpenVINO Runtime Core
core = Core()

# 读取模型 (.xml and .bin files) or (.onnx file)
model = core.read_model(model_path)

# 设置输入的 Shape
image = cv2.imread(image_path)
input_tensor = np.expand_dims(image, 0)

# 构建预处理到模型中
ppp = PrePostProcessor(model)
_, h, w, _ = input_tensor.shape

## 设置输入的类型、布局、大小
ppp.input().tensor() \
    .set_element_type(Type.u8) \
    .set_layout(Layout('NHWC')) \
    .set_spatial_static_shape(h, w)

## 输入到模型接收数据的变换
ppp.input().preprocess().resize(ResizeAlgorithm.RESIZE_LINEAR)

## 设置网络的布局
ppp.input().model().set_layout(Layout('NCHW'))

## 模型输出的类型
ppp.output().tensor().set_element_type(Type.f32)

## 将预处理的设置应用到模型中
model = ppp.build()

# 加载模型到指定的设备
compiled_model = core.compile_model(model, device_name)

# 创建推理请求并进行推理
results = compiled_model.infer_new_request({0: input_tensor})

# 处理推理结束
predictions = next(iter(results.values()))
```

## 异步推理
### 程序开发
```shell
$ vim classification_async.py
```
```py
import argparse
import logging as log
import sys

import cv2
import numpy as np
from openvino.preprocess import PrePostProcessor
from openvino.runtime import AsyncInferQueue, Core, InferRequest, Layout, Type


def parse_args() -> argparse.Namespace:
    """Parse and return command line arguments."""
    parser = argparse.ArgumentParser(add_help=False)
    args = parser.add_argument_group('Options')
    # fmt: off
    args.add_argument('-h', '--help', action='help',
                      help='Show this help message and exit.')
    args.add_argument('-m', '--model', type=str, required=True,
                      help='Required. Path to an .xml or .onnx file with a trained model.')
    args.add_argument('-i', '--input', type=str, required=True, nargs='+',
                      help='Required. Path to an image file(s).')
    args.add_argument('-d', '--device', type=str, default='CPU',
                      help='Optional. Specify the target device to infer on; CPU, GPU, MYRIAD, HDDL or HETERO: '
                      'is acceptable. The sample will look for a suitable plugin for device specified. '
                      'Default value is CPU.')
    # fmt: on
    return parser.parse_args()


def completion_callback(infer_request: InferRequest, image_path: str) -> None:
    predictions = next(iter(infer_request.results.values()))

    # Change a shape of a numpy.ndarray with results to get another one with one dimension
    probs = predictions.reshape(-1)

    # Get an array of 10 class IDs in descending order of probability
    top_10 = np.argsort(probs)[-10:][::-1]

    header = 'class_id probability'

    log.info(f'Image path: {image_path}')
    log.info('Top 10 results: ')
    log.info(header)
    log.info('-' * len(header))

    for class_id in top_10:
        probability_indent = ' ' * (len('class_id') - len(str(class_id)) + 1)
        log.info(f'{class_id}{probability_indent}{probs[class_id]:.7f}')

    log.info('')


def main() -> int:
    log.basicConfig(format='[ %(levelname)s ] %(message)s', level=log.INFO, stream=sys.stdout)
    args = parse_args()

    log.info('Creating OpenVINO Runtime Core')
    core = Core()

    log.info(f'Reading the model: {args.model}')
    # (.xml and .bin files) or (.onnx file)
    model = core.read_model(args.model)

    if len(model.inputs) != 1:
        log.error('Sample supports only single input topologies')
        return -1

    if len(model.outputs) != 1:
        log.error('Sample supports only single output topologies')
        return -1

    log.info('Set up input')
    # Read input images
    images = [cv2.imread(image_path) for image_path in args.input]

    # Resize images to model input dims
    _, _, h, w = model.input().shape
    resized_images = [cv2.resize(image, (w, h)) for image in images]

    # Add N dimension
    input_tensors = [np.expand_dims(image, 0) for image in resized_images]

    log.info('Apply preprocessing')
    ppp = PrePostProcessor(model)

    # 1) Set input tensor information:
    # - input() provides information about a single model input
    # - precision of tensor is supposed to be 'u8'
    # - layout of data is 'NHWC'
    ppp.input().tensor() \
        .set_element_type(Type.u8) \
        .set_layout(Layout('NHWC'))  # noqa: N400

    # 2) Here we suppose model has 'NCHW' layout for input
    ppp.input().model().set_layout(Layout('NCHW'))

    # 3) Set output tensor information:
    # - precision of tensor is supposed to be 'f32'
    ppp.output().tensor().set_element_type(Type.f32)

    # 4) Apply preprocessing modifing the original 'model'
    model = ppp.build()

    log.info('Loading the model to the plugin')
    compiled_model = core.compile_model(model, args.device)

    log.info('Starting inference in asynchronous mode')
    infer_queue = AsyncInferQueue(compiled_model, len(input_tensors))
    infer_queue.set_callback(completion_callback)

    log.info('Do inference')
    for i, input_tensor in enumerate(input_tensors):
        infer_queue.start_async({0: input_tensor}, args.input[i])

    infer_queue.wait_all()

    return 0


if __name__ == '__main__':
    sys.exit(main())
```

本程序可以接收多个图像文件，通过获得模型的输入尺寸，使用 OpenCV 对每个图像重置为模型的输入尺寸。这部分图像尺寸的预处理并没有构建到模型中，所以不能和模型一起编译到指定的设备上。

### 运行程序
```shell
$ python classification_async.py -m public/googlenet-v1/FP32/googlenet-v1.xml -d CPU -i apple-banana.jpg banana.jpg 
[ INFO ] Creating OpenVINO Runtime Core
[ INFO ] Reading the model: public/googlenet-v1/FP32/googlenet-v1.xml
[ INFO ] Set up input
[ INFO ] Apply preprocessing
[ INFO ] Loading the model to the plugin
[ INFO ] Starting inference in asynchronous mode
[ INFO ] Do inference
[ INFO ] Image path: apple-banana.jpg
[ INFO ] Top 10 results: 
[ INFO ] class_id probability
[ INFO ] --------------------
[ INFO ] 954      0.8283759
[ INFO ] 950      0.1006946
[ INFO ] 951      0.0580800
[ INFO ] 952      0.0042231
[ INFO ] 953      0.0022227
[ INFO ] 957      0.0016965
[ INFO ] 948      0.0016222
[ INFO ] 943      0.0005519
[ INFO ] 828      0.0004315
[ INFO ] 949      0.0003929
[ INFO ] 
[ INFO ] Image path: banana.jpg
[ INFO ] Top 10 results: 
[ INFO ] class_id probability
[ INFO ] --------------------
[ INFO ] 954      0.9991651
[ INFO ] 939      0.0002724
[ INFO ] 950      0.0001495
[ INFO ] 951      0.0001049
[ INFO ] 952      0.0000591
[ INFO ] 942      0.0000590
[ INFO ] 883      0.0000351
[ INFO ] 941      0.0000197
[ INFO ] 940      0.0000134
[ INFO ] 584      0.0000099
[ INFO ] 
```

## 参考资料
* [OpenVINO](https://github.com/openvinotoolkit/openvino)
* [Hello Classification Python* Sample](https://docs.openvino.ai/latest/openvino_inference_engine_ie_bridges_python_sample_hello_classification_README.html)
* [Hello Classification Python* Sample](https://github.com/openvinotoolkit/openvino/tree/master/samples/python/hello_classification)
* [Image Classification Async Python* Sample](https://docs.openvino.ai/latest/openvino_inference_engine_ie_bridges_python_sample_classification_sample_async_README.html)
* [Image Classification Async Python* Sample](https://github.com/openvinotoolkit/openvino/tree/master/samples/python/classification_sample_async)
* [OpenVINO Samples Python](https://github.com/openvinotoolkit/openvino/tree/master/samples/python)
