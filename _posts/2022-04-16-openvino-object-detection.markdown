---
layout: post
title:  "OpenVINO 目标检测"
date:   2022-04-16 08:00:00 +0800
categories: AI OpenVINO
tags: [目标检测, ssd]
---

## 目标检测
### 激活 OpenVINO 开发环境
```shell
source openvino_env/bin/activate
```

### 预训练模型
* [ssd300](https://docs.openvino.ai/latest/omz_models_model_ssd300.html)
来自 PASCAL VOC2007 的 20 个类别：<omz_dir>/data/dataset_classes/voc_20cl_bkgr.txt

### 下载模型
```shell
$ omz_downloader --name ssd300
################|| Downloading ssd300 ||################

========== Downloading /home/wjunjian/openvino/openvino/samples/python/hello_reshape_ssd/public/ssd300/ssd300.tar.gz
... 100%, 95497 KB, 3917 KB/s, 24 seconds passed

========== Unpacking /home/wjunjian/openvino/openvino/samples/python/hello_reshape_ssd/public/ssd300/ssd300.tar.gz
========== Replacing text in /home/wjunjian/openvino/openvino/samples/python/hello_reshape_ssd/public/ssd300/models/VGGNet/VOC0712Plus/SSD_300x300_ft/deploy.prototxt
```

### 转换模型
```shell
$ omz_converter --name ssd300
========== Converting ssd300 to IR (FP16)
Conversion command: /home/wjunjian/openvino/openvino_env/bin/python -- /home/wjunjian/openvino/openvino_env/bin/mo --framework=caffe --data_type=FP16 --output_dir=/home/wjunjian/openvino/openvino/samples/python/hello_reshape_ssd/public/ssd300/FP16 --model_name=ssd300 --input=data '--mean_values=data[104.0,117.0,123.0]' --output=detection_out --input_model=/home/wjunjian/openvino/openvino/samples/python/hello_reshape_ssd/public/ssd300/models/VGGNet/VOC0712Plus/SSD_300x300_ft/VGG_VOC0712Plus_SSD_300x300_ft_iter_160000.caffemodel --input_proto=/home/wjunjian/openvino/openvino/samples/python/hello_reshape_ssd/public/ssd300/models/VGGNet/VOC0712Plus/SSD_300x300_ft/deploy.prototxt '--layout=data(NCHW)' '--input_shape=[1, 3, 300, 300]'

Model Optimizer arguments:
Common parameters:
	- Path to the Input Model: 	/home/wjunjian/openvino/openvino/samples/python/hello_reshape_ssd/public/ssd300/models/VGGNet/VOC0712Plus/SSD_300x300_ft/VGG_VOC0712Plus_SSD_300x300_ft_iter_160000.caffemodel
	- Path for generated IR: 	/home/wjunjian/openvino/openvino/samples/python/hello_reshape_ssd/public/ssd300/FP16
	- IR output name: 	ssd300
	- Log level: 	ERROR
	- Batch: 	Not specified, inherited from the model
	- Input layers: 	data
	- Output layers: 	detection_out
	- Input shapes: 	[1, 3, 300, 300]
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
	- Path to the Input prototxt: 	/home/wjunjian/openvino/openvino/samples/python/hello_reshape_ssd/public/ssd300/models/VGGNet/VOC0712Plus/SSD_300x300_ft/deploy.prototxt
	- Path to CustomLayersMapping.xml: 	/home/wjunjian/openvino/openvino_env/lib/python3.9/site-packages/openvino/tools/mo/utils/../../extensions/front/caffe/CustomLayersMapping.xml
	- Path to a mean file: 	Not specified
	- Offsets for a mean file: 	Not specified
OpenVINO runtime found in: 	/home/wjunjian/openvino/openvino_env/lib/python3.9/site-packages/openvino
OpenVINO runtime version: 	2022.1.0-7019-cdb9bec7210-releases/2022/1
Model Optimizer version: 	2022.1.0-7019-cdb9bec7210-releases/2022/1
[ SUCCESS ] Generated IR version 11 model.
[ SUCCESS ] XML file: /home/wjunjian/openvino/openvino/samples/python/hello_reshape_ssd/public/ssd300/FP16/ssd300.xml
[ SUCCESS ] BIN file: /home/wjunjian/openvino/openvino/samples/python/hello_reshape_ssd/public/ssd300/FP16/ssd300.bin
[ SUCCESS ] Total execution time: 9.32 seconds. 
[ SUCCESS ] Memory consumed: 388 MB. 
[ INFO ] The model was converted to IR v11, the latest model format that corresponds to the source DL framework input/output format. While IR v11 is backwards compatible with OpenVINO Inference Engine API v1.0, please use API v2.0 (as of 2022.1) to take advantage of the latest improvements in IR v11.
Find more information about API v2.0 and IR v11 at https://docs.openvino.ai

========== Converting ssd300 to IR (FP32)
Conversion command: /home/wjunjian/openvino/openvino_env/bin/python -- /home/wjunjian/openvino/openvino_env/bin/mo --framework=caffe --data_type=FP32 --output_dir=/home/wjunjian/openvino/openvino/samples/python/hello_reshape_ssd/public/ssd300/FP32 --model_name=ssd300 --input=data '--mean_values=data[104.0,117.0,123.0]' --output=detection_out --input_model=/home/wjunjian/openvino/openvino/samples/python/hello_reshape_ssd/public/ssd300/models/VGGNet/VOC0712Plus/SSD_300x300_ft/VGG_VOC0712Plus_SSD_300x300_ft_iter_160000.caffemodel --input_proto=/home/wjunjian/openvino/openvino/samples/python/hello_reshape_ssd/public/ssd300/models/VGGNet/VOC0712Plus/SSD_300x300_ft/deploy.prototxt '--layout=data(NCHW)' '--input_shape=[1, 3, 300, 300]' '--layout=data(NCHW)' '--input_shape=[1, 3, 300, 300]'

Model Optimizer arguments:
Common parameters:
	- Path to the Input Model: 	/home/wjunjian/openvino/openvino/samples/python/hello_reshape_ssd/public/ssd300/models/VGGNet/VOC0712Plus/SSD_300x300_ft/VGG_VOC0712Plus_SSD_300x300_ft_iter_160000.caffemodel
	- Path for generated IR: 	/home/wjunjian/openvino/openvino/samples/python/hello_reshape_ssd/public/ssd300/FP32
	- IR output name: 	ssd300
	- Log level: 	ERROR
	- Batch: 	Not specified, inherited from the model
	- Input layers: 	data
	- Output layers: 	detection_out
	- Input shapes: 	[1, 3, 300, 300]
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
	- Path to the Input prototxt: 	/home/wjunjian/openvino/openvino/samples/python/hello_reshape_ssd/public/ssd300/models/VGGNet/VOC0712Plus/SSD_300x300_ft/deploy.prototxt
	- Path to CustomLayersMapping.xml: 	/home/wjunjian/openvino/openvino_env/lib/python3.9/site-packages/openvino/tools/mo/utils/../../extensions/front/caffe/CustomLayersMapping.xml
	- Path to a mean file: 	Not specified
	- Offsets for a mean file: 	Not specified
OpenVINO runtime found in: 	/home/wjunjian/openvino/openvino_env/lib/python3.9/site-packages/openvino
OpenVINO runtime version: 	2022.1.0-7019-cdb9bec7210-releases/2022/1
Model Optimizer version: 	2022.1.0-7019-cdb9bec7210-releases/2022/1
[ SUCCESS ] Generated IR version 11 model.
[ SUCCESS ] XML file: /home/wjunjian/openvino/openvino/samples/python/hello_reshape_ssd/public/ssd300/FP32/ssd300.xml
[ SUCCESS ] BIN file: /home/wjunjian/openvino/openvino/samples/python/hello_reshape_ssd/public/ssd300/FP32/ssd300.bin
[ SUCCESS ] Total execution time: 10.05 seconds. 
[ SUCCESS ] Memory consumed: 387 MB. 
[ INFO ] The model was converted to IR v11, the latest model format that corresponds to the source DL framework input/output format. While IR v11 is backwards compatible with OpenVINO Inference Engine API v1.0, please use API v2.0 (as of 2022.1) to take advantage of the latest improvements in IR v11.
Find more information about API v2.0 and IR v11 at https://docs.openvino.ai
```

### 下载图像
```shell
wget http://book.d2l.ai/_images/catdog.jpg
```

### 程序开发
```shell
$ vim object_detection.py
```
```py
import logging as log
import os
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

    log.info('3. Set up input')
    # Read input image
    image = cv2.imread(image_path)
    # Add N dimension
    input_tensor = np.expand_dims(image, 0)

    log.info('4. Apply preprocessing')
    ppp = PrePostProcessor(model)
    _, h, w, _ = input_tensor.shape

    # 1) Set input tensor information:
    # - input() provides information about a single model input
    # - precision of tensor is supposed to be 'u8'
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

    # 5) Apply preprocessing modifing the original 'model'
    model = ppp.build()

    log.info('5. Loading the model to the plugin')
    compiled_model = core.compile_model(model, device_name)

    log.info('6. Starting inference in synchronous mode')
    results = compiled_model.infer_new_request({0: input_tensor})

    log.info('7. Process output')
    predictions = next(iter(results.values()))

    # Change a shape of a numpy.ndarray with results ([1, 1, N, 7]) to get another one ([N, 7]),
    # where N is the number of detected bounding boxes
    detections = predictions.reshape(-1, 7)

    for detection in detections:
        confidence = detection[2]

        if confidence > 0.5:
            class_id = int(detection[1])

            xmin = int(detection[3] * w)
            ymin = int(detection[4] * h)
            xmax = int(detection[5] * w)
            ymax = int(detection[6] * h)

            log.info(f'Found: class_id = {class_id}, confidence = {confidence:.2f}, ' f'coords = ({xmin}, {ymin}), ({xmax}, {ymax})')

            # Draw a bounding box on a output image
            cv2.rectangle(image, (xmin, ymin), (xmax, ymax), (0, 255, 0), 2)

    cv2.imwrite('out.bmp', image)

    if os.path.exists('out.bmp'):
        log.info('Image out.bmp was created!')
    else:
        log.error('Image out.bmp was not created. Check your permissions.')

    return 0


if __name__ == '__main__':
    sys.exit(main())
```

### 运行程序
```shell
$ python test.py public/ssd300/FP32/ssd300.xml catdog.jpg CPU
[ INFO ] 1. Creating OpenVINO Runtime Core
[ INFO ] 2. Reading the model: public/ssd300/FP32/ssd300.xml
[ INFO ] 3. Set up input
[ INFO ] 4. Apply preprocessing
[ INFO ] 5. Loading the model to the plugin
[ INFO ] 6. Starting inference in synchronous mode
[ INFO ] 7. Process output
[ INFO ] Found: class_id = 8, confidence = 0.97, coords = (390, 112), (665, 473)
[ INFO ] Found: class_id = 12, confidence = 1.00, coords = (64, 57), (437, 499)
[ INFO ] Image out.bmp was created!
```

### 查看结果
* Linux
```shell
eog out.bmp
```

## 参考资料
* [OpenVINO](https://github.com/openvinotoolkit/openvino)
* [Hello Reshape SSD Python* Sample](https://docs.openvino.ai/latest/openvino_inference_engine_ie_bridges_python_sample_hello_reshape_ssd_README.html)
* [Hello Reshape SSD Python* Sample](https://github.com/openvinotoolkit/openvino/tree/master/samples/python/hello_reshape_ssd)
* [OpenVINO Samples Python](https://github.com/openvinotoolkit/openvino/tree/master/samples/python)
