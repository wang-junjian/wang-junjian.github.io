---
layout: single
title:  "OpenVINO 神经网络性能分析"
date:   2022-04-17 08:00:00 +0800
categories: AI OpenVINO
tags: [目标检测, 性能分析]
---

## 网络性能分析
查看每层的性能测量值，可以获得最耗时的层。

### 实现方式
#### 通过配置收集指定设备上的性能分析
```py
core = Core()
core.set_property(device_name, {"PERF_COUNT": "YES"})
```

#### 通过推理请求获得性能分析数据
```py
request = compiled_model.create_infer_request()
results = request.infer({0: input_tensor})
prof_info = request.get_profiling_info()
```

#### 可视化性能分析
```py
def print_infer_request_profiling_info(prof_info):
    column_max_widths = {
        'node_name': 0,
        'node_type': 0,
        'exec_type': 0
    }
    for node in prof_info:
        if len(node.node_name) > column_max_widths['node_name'] :
            column_max_widths['node_name'] = len(node.node_name)
        if len(node.node_type) > column_max_widths['node_type'] :
            column_max_widths['node_type'] = len(node.node_type)
        if len(node.exec_type) > column_max_widths['exec_type'] :
            column_max_widths['exec_type'] = len(node.exec_type)

    index_len = 6

    headers = ['Index', 'Node Name', 'Node Type', 'Exec Type', 'Real Time', 'CPU Time', 'Status']
    print(f"{headers[0]}{' '*(index_len-len(headers[0]))}", end='')
    print(f"{headers[1]}{' '*(column_max_widths['node_name']-len(headers[1])+1)}", end='')
    print(f"{headers[2]}{' '*(column_max_widths['node_type']-len(headers[2])+1)}", end='')
    print(f"{headers[3]}{' '*(column_max_widths['exec_type']-len(headers[3])+1)}", end='')
    print(f"{headers[4]}{' '*(9-len(headers[4])+1)}", end='')
    print(f"{headers[5]}{' '*(9-len(headers[5])+1)}", end='')
    print(f"{headers[6]}")

    print('-'*(column_max_widths['node_name']+column_max_widths['node_type']+column_max_widths['exec_type']+10*2+22))

    for i, node in enumerate(prof_info):
        print(f"{i}{' '*(index_len-len(str(i)))}", end='')
        print(f"{node.node_name}{' '*(column_max_widths['node_name']-len(node.node_name)+1)}", end='')
        print(f"{node.node_type}{' '*(column_max_widths['node_type']-len(node.node_type)+1)}", end='')
        print(f"{node.exec_type}{' '*(column_max_widths['exec_type']-len(node.exec_type)+1)}", end='')
        print(f"{node.real_time.total_seconds(): 2.6f}", end=' ')
        print(f"{node.cpu_time.total_seconds(): 2.6f}", end=' ')
        print(f"{node.status}")


log.info(f'Latency {request.latency}')
print_infer_request_profiling_info(prof_info)
```

### 应用到目标检测程序
#### 程序代码
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
    core.set_property(device_name, {"PERF_COUNT": "YES"})

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
    # results = compiled_model.infer_new_request({0: input_tensor})
    request = compiled_model.create_infer_request()
    results = request.infer({0: input_tensor})

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

    log.info(f'Latency {request.latency}')

    print_infer_request_profiling_info(request.get_profiling_info())

    return 0


def print_infer_request_profiling_info(prof_info):
    column_max_widths = {
        'node_name': 0,
        'node_type': 0,
        'exec_type': 0
    }
    for node in prof_info:
        if len(node.node_name) > column_max_widths['node_name'] :
            column_max_widths['node_name'] = len(node.node_name)
        if len(node.node_type) > column_max_widths['node_type'] :
            column_max_widths['node_type'] = len(node.node_type)
        if len(node.exec_type) > column_max_widths['exec_type'] :
            column_max_widths['exec_type'] = len(node.exec_type)

    index_len = 6

    headers = ['Index', 'Node Name', 'Node Type', 'Exec Type', 'Real Time', 'CPU Time', 'Status']
    print(f"{headers[0]}{' '*(index_len-len(headers[0]))}", end='')
    print(f"{headers[1]}{' '*(column_max_widths['node_name']-len(headers[1])+1)}", end='')
    print(f"{headers[2]}{' '*(column_max_widths['node_type']-len(headers[2])+1)}", end='')
    print(f"{headers[3]}{' '*(column_max_widths['exec_type']-len(headers[3])+1)}", end='')
    print(f"{headers[4]}{' '*(9-len(headers[4])+1)}", end='')
    print(f"{headers[5]}{' '*(9-len(headers[5])+1)}", end='')
    print(f"{headers[6]}")

    print('-'*(column_max_widths['node_name']+column_max_widths['node_type']+column_max_widths['exec_type']+10*2+22))

    for i, node in enumerate(prof_info):
        print(f"{i}{' '*(index_len-len(str(i)))}", end='')
        print(f"{node.node_name}{' '*(column_max_widths['node_name']-len(node.node_name)+1)}", end='')
        print(f"{node.node_type}{' '*(column_max_widths['node_type']-len(node.node_type)+1)}", end='')
        print(f"{node.exec_type}{' '*(column_max_widths['exec_type']-len(node.exec_type)+1)}", end='')
        print(f"{node.real_time.total_seconds(): 2.6f}", end=' ')
        print(f"{node.cpu_time.total_seconds(): 2.6f}", end=' ')
        print(f"{node.status}")


if __name__ == '__main__':
    sys.exit(main())
```

#### 运行程序
```shell
$ python object_detection.py public/ssd300/FP32/ssd300.xml catdog.jpg CPU
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
[ INFO ] Latency 134.02814899999998
Index Node Name                                                                    Node Type       Exec Type         Real Time CPU Time  Status
------------------------------------------------------------------------------------------------------------------------------------------------------
0     data                                                                         Parameter       unknown_I8         0.000000  0.000000 Status.NOT_RUN
1     data_abcd_acdb_fake                                                          Reorder         reorder_I8         0.000000  0.000000 Status.NOT_RUN
2     Interpolate_3017                                                             Interpolate     jit_avx2_I8        0.000414  0.000414 Status.EXECUTED
3     Convert_3022                                                                 Convert         unknown_I8         0.000023  0.000023 Status.EXECUTED
4     data/mean                                                                    Subgraph        jit_avx2_FP32      0.000051  0.000051 Status.EXECUTED
5     data/mean_acdb_abcd_conv1_1/WithoutBiases                                    Reorder         jit_uni_FP32       0.000098  0.000098 Status.EXECUTED
6     conv1_1/WithoutBiases                                                        Convolution     jit_avx2_FP32      0.001759  0.001759 Status.EXECUTED
7     relu1_1                                                                      Relu            undef              0.000000  0.000000 Status.NOT_RUN
8     conv1_2/WithoutBiases                                                        Convolution     jit_avx2_FP32      0.010845  0.010845 Status.EXECUTED
9     relu1_2                                                                      Relu            undef              0.000000  0.000000 Status.NOT_RUN
10    pool1                                                                        MaxPool         jit_avx2_FP32      0.001154  0.001154 Status.EXECUTED
11    conv2_1/WithoutBiases                                                        Convolution     jit_avx2_FP32      0.004804  0.004804 Status.EXECUTED
12    relu2_1                                                                      Relu            undef              0.000000  0.000000 Status.NOT_RUN
13    conv2_2/WithoutBiases                                                        Convolution     jit_avx2_FP32      0.009644  0.009644 Status.EXECUTED
14    relu2_2                                                                      Relu            undef              0.000000  0.000000 Status.NOT_RUN
15    pool2                                                                        MaxPool         jit_avx2_FP32      0.000551  0.000551 Status.EXECUTED
16    conv3_1/WithoutBiases                                                        Convolution     jit_avx2_FP32      0.004833  0.004833 Status.EXECUTED
17    relu3_1                                                                      Relu            undef              0.000000  0.000000 Status.NOT_RUN
18    conv3_2/WithoutBiases                                                        Convolution     jit_avx2_FP32      0.009765  0.009765 Status.EXECUTED
19    relu3_2                                                                      Relu            undef              0.000000  0.000000 Status.NOT_RUN
20    conv3_3/WithoutBiases                                                        Convolution     jit_avx2_FP32      0.009831  0.009831 Status.EXECUTED
21    relu3_3                                                                      Relu            undef              0.000000  0.000000 Status.NOT_RUN
22    pool3                                                                        MaxPool         jit_avx2_FP32      0.000261  0.000261 Status.EXECUTED
23    conv4_1/WithoutBiases                                                        Convolution     jit_avx2_FP32      0.005128  0.005128 Status.EXECUTED
24    relu4_1                                                                      Relu            undef              0.000000  0.000000 Status.NOT_RUN
25    conv4_2/WithoutBiases                                                        Convolution     jit_avx2_FP32      0.010256  0.010256 Status.EXECUTED
26    relu4_2                                                                      Relu            undef              0.000000  0.000000 Status.NOT_RUN
27    conv4_3/WithoutBiases                                                        Convolution     jit_avx2_FP32      0.022195  0.022195 Status.EXECUTED
28    relu4_3                                                                      Relu            undef              0.000000  0.000000 Status.NOT_RUN
29    pool4                                                                        MaxPool         jit_avx2_FP32      0.000151  0.000151 Status.EXECUTED
30    conv5_1/WithoutBiases                                                        Convolution     jit_avx2_FP32      0.002811  0.002811 Status.EXECUTED
31    relu5_1                                                                      Relu            undef              0.000000  0.000000 Status.NOT_RUN
32    conv5_2/WithoutBiases                                                        Convolution     jit_avx2_FP32      0.002784  0.002784 Status.EXECUTED
33    relu5_2                                                                      Relu            undef              0.000000  0.000000 Status.NOT_RUN
34    conv5_3/WithoutBiases                                                        Convolution     jit_avx2_FP32      0.003487  0.003487 Status.EXECUTED
35    relu5_3                                                                      Relu            undef              0.000000  0.000000 Status.NOT_RUN
36    pool5                                                                        MaxPool         jit_avx2_FP32      0.000103  0.000103 Status.EXECUTED
37    pool5_aBcd8b_abcd_fc6/WithoutBiases                                          Reorder         jit_FP32           0.000040  0.000040 Status.EXECUTED
38    fc6/WithoutBiases                                                            Convolution     jit_gemm_FP32      0.022724  0.022724 Status.EXECUTED
39    relu6                                                                        Relu            undef              0.000000  0.000000 Status.NOT_RUN
40    fc6/WithoutBiases_abcd_aBcd8b_fc7/WithoutBiases                              Reorder         jit_FP32           0.000059  0.000059 Status.EXECUTED
41    fc7/WithoutBiases                                                            Convolution     jit_avx2_1x1_FP32  0.001290  0.001290 Status.EXECUTED
42    relu7                                                                        Relu            undef              0.000000  0.000000 Status.NOT_RUN
43    fc7_mbox_conf/WithoutBiases                                                  Convolution     jit_avx2_FP32      0.001455  0.001455 Status.EXECUTED
44    fc7_mbox_conf/WithoutBiases_aBcd8b_abcd_fc7_mbox_conf_perm                   Reorder         ref_any_FP32       0.000036  0.000036 Status.EXECUTED
45    fc7_mbox_conf_perm                                                           Transpose       unknown_FP32       0.000020  0.000020 Status.EXECUTED
46    fc7_mbox_conf_flat                                                           Reshape         unknown_FP32       0.000000  0.000000 Status.NOT_RUN
47    fc7_mbox_conf_flat___mbox_conf                                               Reorder         ref_any_FP32       0.000015  0.000015 Status.EXECUTED
48    conv6_1/WithoutBiases                                                        Convolution     jit_avx2_1x1_FP32  0.000321  0.000321 Status.EXECUTED
49    conv6_1_relu                                                                 Relu            undef              0.000000  0.000000 Status.NOT_RUN
50    conv6_2/WithoutBiases                                                        Convolution     jit_avx2_FP32      0.000478  0.000478 Status.EXECUTED
51    conv6_2_relu                                                                 Relu            undef              0.000000  0.000000 Status.NOT_RUN
52    conv6_2_mbox_conf/WithoutBiases                                              Convolution     jit_avx2_FP32      0.000245  0.000245 Status.EXECUTED
53    conv6_2_mbox_conf/WithoutBiases_aBcd8b_abcd_conv6_2_mbox_conf_perm           Reorder         ref_any_FP32       0.000012  0.000012 Status.EXECUTED
54    conv6_2_mbox_conf_perm                                                       Transpose       unknown_FP32       0.000007  0.000007 Status.EXECUTED
55    conv6_2_mbox_conf_flat                                                       Reshape         unknown_FP32       0.000000  0.000000 Status.NOT_RUN
56    conv6_2_mbox_conf_flat___mbox_conf                                           Reorder         ref_any_FP32       0.000005  0.000005 Status.EXECUTED
57    conv7_1/WithoutBiases                                                        Convolution     jit_avx2_1x1_FP32  0.000035  0.000035 Status.EXECUTED
58    conv7_1_relu                                                                 Relu            undef              0.000000  0.000000 Status.NOT_RUN
59    conv7_2/WithoutBiases                                                        Convolution     jit_avx2_FP32      0.000066  0.000066 Status.EXECUTED
60    conv7_2_relu                                                                 Relu            undef              0.000000  0.000000 Status.NOT_RUN
61    conv7_2_mbox_conf/WithoutBiases                                              Convolution     jit_avx2_FP32      0.000063  0.000063 Status.EXECUTED
62    conv7_2_mbox_conf/WithoutBiases_aBcd8b_abcd_conv7_2_mbox_conf_perm           Reorder         ref_any_FP32       0.000009  0.000009 Status.EXECUTED
63    conv7_2_mbox_conf_perm                                                       Transpose       unknown_FP32       0.000004  0.000004 Status.EXECUTED
64    conv7_2_mbox_conf_flat                                                       Reshape         unknown_FP32       0.000000  0.000000 Status.NOT_RUN
65    conv7_2_mbox_conf_flat___mbox_conf                                           Reorder         ref_any_FP32       0.000005  0.000005 Status.EXECUTED
66    conv8_1/WithoutBiases                                                        Convolution     jit_avx2_1x1_FP32  0.000010  0.000010 Status.EXECUTED
67    conv8_1_relu                                                                 Relu            undef              0.000000  0.000000 Status.NOT_RUN
68    conv8_2/WithoutBiases                                                        Convolution     jit_avx2_FP32      0.000054  0.000054 Status.EXECUTED
69    conv8_2_relu                                                                 Relu            undef              0.000000  0.000000 Status.NOT_RUN
70    conv8_2_mbox_conf/WithoutBiases                                              Convolution     jit_avx2_FP32      0.000038  0.000038 Status.EXECUTED
71    conv8_2_mbox_conf/WithoutBiases_aBcd8b_abcd_conv8_2_mbox_conf_perm           Reorder         ref_any_FP32       0.000008  0.000008 Status.EXECUTED
72    conv8_2_mbox_conf_perm                                                       Transpose       unknown_FP32       0.000003  0.000003 Status.EXECUTED
73    conv8_2_mbox_conf_flat                                                       Reshape         unknown_FP32       0.000000  0.000000 Status.NOT_RUN
74    conv8_2_mbox_conf_flat___mbox_conf                                           Reorder         ref_any_FP32       0.000004  0.000004 Status.EXECUTED
75    conv9_1/WithoutBiases                                                        Convolution     jit_avx2_1x1_FP32  0.000011  0.000011 Status.EXECUTED
76    conv9_1_relu                                                                 Relu            undef              0.000000  0.000000 Status.NOT_RUN
77    conv9_2/WithoutBiases                                                        Convolution     jit_avx2_FP32      0.000047  0.000047 Status.EXECUTED
78    conv9_2_relu                                                                 Relu            undef              0.000000  0.000000 Status.NOT_RUN
79    conv9_2_mbox_conf/WithoutBiases                                              Convolution     jit_avx2_FP32      0.000020  0.000020 Status.EXECUTED
80    conv9_2_mbox_conf/WithoutBiases_aBcd8b_abcd_conv9_2_mbox_conf_perm           Reorder         ref_any_FP32       0.000005  0.000005 Status.EXECUTED
81    conv9_2_mbox_conf_perm                                                       Reshape         unknown_FP32       0.000000  0.000000 Status.NOT_RUN
82    conv9_2_mbox_conf_flat                                                       Reshape         unknown_FP32       0.000000  0.000000 Status.NOT_RUN
83    conv9_2_mbox_conf_flat___mbox_conf                                           Reorder         ref_any_FP32       0.000004  0.000004 Status.EXECUTED
84    conv9_2_mbox_loc/WithoutBiases                                               Convolution     jit_avx2_FP32      0.000010  0.000010 Status.EXECUTED
85    conv9_2_mbox_loc/WithoutBiases_aBcd8b_abcd_conv9_2_mbox_loc_perm             Reorder         jit_uni_FP32       0.000004  0.000004 Status.EXECUTED
86    conv9_2_mbox_loc_perm                                                        Reshape         unknown_FP32       0.000000  0.000000 Status.NOT_RUN
87    conv9_2_mbox_loc_flat                                                        Reshape         unknown_FP32       0.000000  0.000000 Status.NOT_RUN
88    conv9_2_mbox_loc_flat___mbox_loc                                             Reorder         ref_any_FP32       0.000004  0.000004 Status.EXECUTED
89    conv8_2_mbox_loc/WithoutBiases                                               Convolution     jit_avx2_FP32      0.000011  0.000011 Status.EXECUTED
90    conv8_2_mbox_loc_perm                                                        Transpose       unknown_FP32       0.000003  0.000003 Status.EXECUTED
91    conv8_2_mbox_loc_flat                                                        Reshape         unknown_FP32       0.000000  0.000000 Status.NOT_RUN
92    conv8_2_mbox_loc_flat___mbox_loc                                             Reorder         ref_any_FP32       0.000003  0.000003 Status.EXECUTED
93    conv7_2_mbox_loc/WithoutBiases                                               Convolution     jit_avx2_FP32      0.000017  0.000017 Status.EXECUTED
94    conv7_2_mbox_loc_perm                                                        Transpose       unknown_FP32       0.000003  0.000003 Status.EXECUTED
95    conv7_2_mbox_loc_flat                                                        Reshape         unknown_FP32       0.000000  0.000000 Status.NOT_RUN
96    conv7_2_mbox_loc_flat___mbox_loc                                             Reorder         ref_any_FP32       0.000004  0.000004 Status.EXECUTED
97    conv6_2_mbox_loc/WithoutBiases                                               Convolution     jit_avx2_FP32      0.000063  0.000063 Status.EXECUTED
98    conv6_2_mbox_loc_perm                                                        Transpose       unknown_FP32       0.000004  0.000004 Status.EXECUTED
99    conv6_2_mbox_loc_flat                                                        Reshape         unknown_FP32       0.000000  0.000000 Status.NOT_RUN
100   conv6_2_mbox_loc_flat___mbox_loc                                             Reorder         ref_any_FP32       0.000005  0.000005 Status.EXECUTED
101   fc7_mbox_loc/WithoutBiases                                                   Convolution     jit_avx2_FP32      0.000345  0.000345 Status.EXECUTED
102   fc7_mbox_loc_perm                                                            Transpose       unknown_FP32       0.000004  0.000004 Status.EXECUTED
103   fc7_mbox_loc_flat                                                            Reshape         unknown_FP32       0.000000  0.000000 Status.NOT_RUN
104   fc7_mbox_loc_flat___mbox_loc                                                 Reorder         ref_any_FP32       0.000006  0.000006 Status.EXECUTED
105   6613                                                                         NormalizeL2     unknown_FP32       0.000244  0.000244 Status.EXECUTED
106   conv4_3_norm                                                                 Multiply        undef              0.000000  0.000000 Status.NOT_RUN
107   conv4_3_norm_mbox_conf/WithoutBiases                                         Convolution     jit_avx2_FP32      0.001962  0.001962 Status.EXECUTED
108   conv4_3_norm_mbox_conf/WithoutBiases_aBcd8b_abcd_conv4_3_norm_mbox_conf_perm Reorder         ref_any_FP32       0.000086  0.000086 Status.EXECUTED
109   conv4_3_norm_mbox_conf_perm                                                  Transpose       unknown_FP32       0.000021  0.000021 Status.EXECUTED
110   conv4_3_norm_mbox_conf_flat                                                  Reshape         unknown_FP32       0.000000  0.000000 Status.NOT_RUN
111   conv4_3_norm_mbox_conf_flat___mbox_conf                                      Reorder         ref_any_FP32       0.000020  0.000020 Status.EXECUTED
112   mbox_conf                                                                    Concat          unknown_FP32       0.000000  0.000000 Status.NOT_RUN
113   mbox_conf_reshape                                                            Reshape         unknown_FP32       0.000000  0.000000 Status.NOT_RUN
114   mbox_conf_softmax                                                            Softmax         jit_avx2_FP32      0.000070  0.000070 Status.EXECUTED
115   mbox_conf_flatten                                                            Reshape         unknown_FP32       0.000000  0.000000 Status.NOT_RUN
116   conv4_3_norm_mbox_loc/WithoutBiases                                          Convolution     jit_avx2_FP32      0.000490  0.000490 Status.EXECUTED
117   conv4_3_norm_mbox_loc_perm                                                   Transpose       unknown_FP32       0.000006  0.000006 Status.EXECUTED
118   conv4_3_norm_mbox_loc_flat                                                   Reshape         unknown_FP32       0.000000  0.000000 Status.NOT_RUN
119   conv4_3_norm_mbox_loc_flat___mbox_loc                                        Reorder         ref_any_FP32       0.000007  0.000007 Status.EXECUTED
120   mbox_loc                                                                     Concat          unknown_FP32       0.000000  0.000000 Status.NOT_RUN
121   detection_out                                                                DetectionOutput ref_any_FP32       0.002029  0.002029 Status.EXECUTED
122   detection_out/sink_port_0                                                    Result          unknown_FP32       0.000000  0.000000 Status.NOT_RUN
```

## 内存分析
### [memory-profiler](https://pypi.org/project/memory-profiler/)
监控每行代码的内存使用。

#### 安装
```shell
pip install memory-profiler
```

#### 使用
```py
from memory_profiler import profile

@profile
def func():
    pass
```

### 应用到目标检测程序
#### 程序代码
```py
import logging as log
import os
import sys

import cv2
import numpy as np

from openvino.preprocess import PrePostProcessor, ResizeAlgorithm
from openvino.runtime import Core, Layout, Type

from memory_profiler import profile


@profile
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
    core.set_property(device_name, {"PERF_COUNT": "YES"})

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
    # results = compiled_model.infer_new_request({0: input_tensor})
    request = compiled_model.create_infer_request()
    results = request.infer({0: input_tensor})

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

    log.info(f'Latency {request.latency}')

    return 0


if __name__ == '__main__':
    sys.exit(main())
```

#### 运行程序
这里分别使用 FP16 和 FP32 两种数据类型的模型进行测试。

FP16 模型
```shell
$ ll -h public/ssd300/FP16/
总用量 51M
-rw-rw-r-- 1 wjunjian wjunjian  51M 4月  27 09:10 ssd300.bin
-rw-rw-r-- 1 wjunjian wjunjian  14K 4月  27 09:10 ssd300.mapping
-rw-rw-r-- 1 wjunjian wjunjian 217K 4月  27 09:10 ssd300.xml
```

FP32 模型
```shell
$ ll -h public/ssd300/FP32/
总用量 101M
-rw-rw-r-- 1 wjunjian wjunjian 101M 4月  27 09:10 ssd300.bin
-rw-rw-r-- 1 wjunjian wjunjian  14K 4月  27 09:10 ssd300.mapping
-rw-rw-r-- 1 wjunjian wjunjian 179K 4月  27 09:10 ssd300.xml
```

FP16 CPU
```shell
$ python object_detection.py public/ssd300/FP16/ssd300.xml catdog.jpg CPU
[ INFO ] 1. Creating OpenVINO Runtime Core
[ INFO ] 2. Reading the model: public/ssd300/FP16/ssd300.xml
[ INFO ] 3. Set up input
[ INFO ] 4. Apply preprocessing
[ INFO ] 5. Loading the model to the plugin
[ INFO ] 6. Starting inference in synchronous mode
[ INFO ] 7. Process output
[ INFO ] Found: class_id = 8, confidence = 0.97, coords = (390, 112), (665, 473)
[ INFO ] Found: class_id = 12, confidence = 1.00, coords = (64, 57), (437, 499)
[ INFO ] Image out.bmp was created!
[ INFO ] Latency 143.190296
Filename: /home/wjunjian/openvino/openvino/samples/python/object_detection/object_detection.py

Line #    Mem usage    Increment  Occurrences   Line Contents
=============================================================
    19     71.0 MiB     71.0 MiB           1   @profile
    20                                         def main():
    21     71.0 MiB      0.0 MiB           1       log.basicConfig(format='[ %(levelname)s ] %(message)s', level=log.INFO, stream=sys.stdout)
    22                                         
    23                                             # Parsing and validation of input arguments
    24     71.0 MiB      0.0 MiB           1       if len(sys.argv) != 4:
    25                                                 log.info(f'Usage: {sys.argv[0]} <path_to_model> <path_to_image> <device_name>')
    26                                                 return 1
    27                                         
    28     71.0 MiB      0.0 MiB           1       model_path = sys.argv[1]
    29     71.0 MiB      0.0 MiB           1       image_path = sys.argv[2]
    30     71.0 MiB      0.0 MiB           1       device_name = sys.argv[3]
    31                                         
    32     71.0 MiB      0.0 MiB           1       log.info('1. Creating OpenVINO Runtime Core')
    33     71.0 MiB      0.0 MiB           1       core = Core()
    34     71.0 MiB      0.0 MiB           1       core.set_property(device_name, {"PERF_COUNT": "YES"})
    35                                         
    36     71.0 MiB      0.0 MiB           1       log.info(f'2. Reading the model: {model_path}')
    37                                             # (.xml and .bin files) or (.onnx file)
    38    128.7 MiB     57.7 MiB           1       model = core.read_model(model_path)
    39                                         
    40    128.7 MiB      0.0 MiB           1       if len(model.inputs) != 1:
    41                                                 log.error('Sample supports only single input topologies')
    42                                                 return -1
    43                                         
    44    128.7 MiB      0.0 MiB           1       if len(model.outputs) != 1:
    45                                                 log.error('Sample supports only single output topologies')
    46                                                 return -1
    47                                         
    48    128.7 MiB      0.0 MiB           1       log.info('3. Set up input')
    49                                             # Read input image
    50    131.6 MiB      2.9 MiB           1       image = cv2.imread(image_path)
    51                                             # Add N dimension
    52    131.6 MiB      0.0 MiB           1       input_tensor = np.expand_dims(image, 0)
    53                                         
    54    131.6 MiB      0.0 MiB           1       log.info('4. Apply preprocessing')
    55    131.6 MiB      0.0 MiB           1       ppp = PrePostProcessor(model)
    56    131.6 MiB      0.0 MiB           1       _, h, w, _ = input_tensor.shape
    57                                         
    58                                             # 1) Set input tensor information:
    59                                             # - input() provides information about a single model input
    60                                             # - precision of tensor is supposed to be 'u8'
    61                                             # - layout of data is 'NHWC'
    62    131.6 MiB      0.0 MiB           4       ppp.input().tensor() \
    63    131.6 MiB      0.0 MiB           1           .set_element_type(Type.u8) \
    64    131.6 MiB      0.0 MiB           1           .set_layout(Layout('NHWC')) \
    65    131.6 MiB      0.0 MiB           1           .set_spatial_static_shape(h, w)  # noqa: ECE001, N400
    66                                         
    67                                             # 2) Adding explicit preprocessing steps:
    68                                             # - apply linear resize from tensor spatial dims to model spatial dims
    69    131.6 MiB      0.0 MiB           1       ppp.input().preprocess().resize(ResizeAlgorithm.RESIZE_LINEAR)
    70                                         
    71                                             # 3) Here we suppose model has 'NCHW' layout for input
    72    131.6 MiB      0.0 MiB           1       ppp.input().model().set_layout(Layout('NCHW'))
    73                                         
    74                                             # 4) Set output tensor information:
    75                                             # - precision of tensor is supposed to be 'f32'
    76    131.6 MiB      0.0 MiB           1       ppp.output().tensor().set_element_type(Type.f32)
    77                                         
    78                                             # 5) Apply preprocessing modifing the original 'model'
    79    131.6 MiB      0.0 MiB           1       model = ppp.build()
    80                                         
    81    131.6 MiB      0.0 MiB           1       log.info('5. Loading the model to the plugin')
    82    422.2 MiB    290.6 MiB           1       compiled_model = core.compile_model(model, device_name)
    83                                         
    84    422.2 MiB      0.0 MiB           1       log.info('6. Starting inference in synchronous mode')
    85                                             # results = compiled_model.infer_new_request({0: input_tensor})
    86    422.2 MiB      0.0 MiB           1       request = compiled_model.create_infer_request()
    87    471.2 MiB     49.1 MiB           1       results = request.infer({0: input_tensor})
    88                                         
    89    471.2 MiB      0.0 MiB           1       log.info('7. Process output')
    90    471.2 MiB      0.0 MiB           1       predictions = next(iter(results.values()))
    91                                         
    92                                             # Change a shape of a numpy.ndarray with results ([1, 1, N, 7]) to get another one ([N, 7]),
    93                                             # where N is the number of detected bounding boxes
    94    471.2 MiB      0.0 MiB           1       detections = predictions.reshape(-1, 7)
    95                                         
    96    471.2 MiB      0.0 MiB         201       for detection in detections:
    97    471.2 MiB      0.0 MiB         200           confidence = detection[2]
    98                                         
    99    471.2 MiB      0.0 MiB         200           if confidence > 0.5:
   100    471.2 MiB      0.0 MiB           2               class_id = int(detection[1])
   101                                         
   102    471.2 MiB      0.0 MiB           2               xmin = int(detection[3] * w)
   103    471.2 MiB      0.0 MiB           2               ymin = int(detection[4] * h)
   104    471.2 MiB      0.0 MiB           2               xmax = int(detection[5] * w)
   105    471.2 MiB      0.0 MiB           2               ymax = int(detection[6] * h)
   106                                         
   107    471.2 MiB      0.0 MiB           2               log.info(f'Found: class_id = {class_id}, confidence = {confidence:.2f}, ' f'coords = ({xmin}, {ymin}), ({xmax}, {ymax})')
   108                                         
   109                                                     # Draw a bounding box on a output image
   110    471.2 MiB      0.0 MiB           2               cv2.rectangle(image, (xmin, ymin), (xmax, ymax), (0, 255, 0), 2)
   111                                         
   112    471.2 MiB      0.0 MiB           1       cv2.imwrite('out.bmp', image)
   113                                         
   114    471.2 MiB      0.0 MiB           1       if os.path.exists('out.bmp'):
   115    471.2 MiB      0.0 MiB           1           log.info('Image out.bmp was created!')
   116                                             else:
   117                                                 log.error('Image out.bmp was not created. Check your permissions.')
   118                                         
   119    471.2 MiB      0.0 MiB           1       log.info(f'Latency {request.latency}')
   120                                         
   121    471.2 MiB      0.0 MiB           1       return 0
```

FP32 CPU
```shell
$ python object_detection.py public/ssd300/FP32/ssd300.xml catdog.jpg CPU
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
[ INFO ] Latency 143.190296
Filename: /home/wjunjian/openvino/openvino/samples/python/object_detection/object_detection.py

Line #    Mem usage    Increment  Occurrences   Line Contents
=============================================================
    19     70.8 MiB     70.8 MiB           1   @profile
    20                                         def main():
    21     70.8 MiB      0.0 MiB           1       log.basicConfig(format='[ %(levelname)s ] %(message)s', level=log.INFO, stream=sys.stdout)
    22                                         
    23                                             # Parsing and validation of input arguments
    24     70.8 MiB      0.0 MiB           1       if len(sys.argv) != 4:
    25                                                 log.info(f'Usage: {sys.argv[0]} <path_to_model> <path_to_image> <device_name>')
    26                                                 return 1
    27                                         
    28     70.8 MiB      0.0 MiB           1       model_path = sys.argv[1]
    29     70.8 MiB      0.0 MiB           1       image_path = sys.argv[2]
    30     70.8 MiB      0.0 MiB           1       device_name = sys.argv[3]
    31                                         
    32     70.8 MiB      0.0 MiB           1       log.info('1. Creating OpenVINO Runtime Core')
    33     70.8 MiB      0.0 MiB           1       core = Core()
    34     70.8 MiB      0.0 MiB           1       core.set_property(device_name, {"PERF_COUNT": "YES"})
    35                                         
    36     70.8 MiB      0.0 MiB           1       log.info(f'2. Reading the model: {model_path}')
    37                                             # (.xml and .bin files) or (.onnx file)
    38    178.1 MiB    107.3 MiB           1       model = core.read_model(model_path)
    39                                         
    40    178.1 MiB      0.0 MiB           1       if len(model.inputs) != 1:
    41                                                 log.error('Sample supports only single input topologies')
    42                                                 return -1
    43                                         
    44    178.1 MiB      0.0 MiB           1       if len(model.outputs) != 1:
    45                                                 log.error('Sample supports only single output topologies')
    46                                                 return -1
    47                                         
    48    178.1 MiB      0.0 MiB           1       log.info('3. Set up input')
    49                                             # Read input image
    50    180.9 MiB      2.8 MiB           1       image = cv2.imread(image_path)
    51                                             # Add N dimension
    52    180.9 MiB      0.0 MiB           1       input_tensor = np.expand_dims(image, 0)
    53                                         
    54    180.9 MiB      0.0 MiB           1       log.info('4. Apply preprocessing')
    55    180.9 MiB      0.0 MiB           1       ppp = PrePostProcessor(model)
    56    180.9 MiB      0.0 MiB           1       _, h, w, _ = input_tensor.shape
    57                                         
    58                                             # 1) Set input tensor information:
    59                                             # - input() provides information about a single model input
    60                                             # - precision of tensor is supposed to be 'u8'
    61                                             # - layout of data is 'NHWC'
    62    180.9 MiB      0.0 MiB           4       ppp.input().tensor() \
    63    180.9 MiB      0.0 MiB           1           .set_element_type(Type.u8) \
    64    180.9 MiB      0.0 MiB           1           .set_layout(Layout('NHWC')) \
    65    180.9 MiB      0.0 MiB           1           .set_spatial_static_shape(h, w)  # noqa: ECE001, N400
    66                                         
    67                                             # 2) Adding explicit preprocessing steps:
    68                                             # - apply linear resize from tensor spatial dims to model spatial dims
    69    180.9 MiB      0.0 MiB           1       ppp.input().preprocess().resize(ResizeAlgorithm.RESIZE_LINEAR)
    70                                         
    71                                             # 3) Here we suppose model has 'NCHW' layout for input
    72    180.9 MiB      0.0 MiB           1       ppp.input().model().set_layout(Layout('NCHW'))
    73                                         
    74                                             # 4) Set output tensor information:
    75                                             # - precision of tensor is supposed to be 'f32'
    76    180.9 MiB      0.0 MiB           1       ppp.output().tensor().set_element_type(Type.f32)
    77                                         
    78                                             # 5) Apply preprocessing modifing the original 'model'
    79    180.9 MiB      0.0 MiB           1       model = ppp.build()
    80                                         
    81    180.9 MiB      0.0 MiB           1       log.info('5. Loading the model to the plugin')
    82    292.3 MiB    111.4 MiB           1       compiled_model = core.compile_model(model, device_name)
    83                                         
    84    292.3 MiB      0.0 MiB           1       log.info('6. Starting inference in synchronous mode')
    85                                             # results = compiled_model.infer_new_request({0: input_tensor})
    86    292.3 MiB      0.0 MiB           1       request = compiled_model.create_infer_request()
    87    341.3 MiB     49.0 MiB           1       results = request.infer({0: input_tensor})
    88                                         
    89    341.3 MiB      0.0 MiB           1       log.info('7. Process output')
    90    341.3 MiB      0.0 MiB           1       predictions = next(iter(results.values()))
    91                                         
    92                                             # Change a shape of a numpy.ndarray with results ([1, 1, N, 7]) to get another one ([N, 7]),
    93                                             # where N is the number of detected bounding boxes
    94    341.3 MiB      0.0 MiB           1       detections = predictions.reshape(-1, 7)
    95                                         
    96    341.3 MiB      0.0 MiB         201       for detection in detections:
    97    341.3 MiB      0.0 MiB         200           confidence = detection[2]
    98                                         
    99    341.3 MiB      0.0 MiB         200           if confidence > 0.5:
   100    341.3 MiB      0.0 MiB           2               class_id = int(detection[1])
   101                                         
   102    341.3 MiB      0.0 MiB           2               xmin = int(detection[3] * w)
   103    341.3 MiB      0.0 MiB           2               ymin = int(detection[4] * h)
   104    341.3 MiB      0.0 MiB           2               xmax = int(detection[5] * w)
   105    341.3 MiB      0.0 MiB           2               ymax = int(detection[6] * h)
   106                                         
   107    341.3 MiB      0.0 MiB           2               log.info(f'Found: class_id = {class_id}, confidence = {confidence:.2f}, ' f'coords = ({xmin}, {ymin}), ({xmax}, {ymax})')
   108                                         
   109                                                     # Draw a bounding box on a output image
   110    341.3 MiB      0.0 MiB           2               cv2.rectangle(image, (xmin, ymin), (xmax, ymax), (0, 255, 0), 2)
   111                                         
   112    341.3 MiB      0.0 MiB           1       cv2.imwrite('out.bmp', image)
   113                                         
   114    341.3 MiB      0.0 MiB           1       if os.path.exists('out.bmp'):
   115    341.3 MiB      0.0 MiB           1           log.info('Image out.bmp was created!')
   116                                             else:
   117                                                 log.error('Image out.bmp was not created. Check your permissions.')
   118                                         
   119    341.3 MiB      0.0 MiB           1       log.info(f'Latency {request.latency}')
   120                                         
   121    341.3 MiB      0.0 MiB           1       return 0
```

在 CPU 设备上 FP16 比 FP32 的模型还占用内存。

## 参考资料
* [OpenVINO](https://github.com/openvinotoolkit/openvino)
* [Hello Reshape SSD Python* Sample](https://docs.openvino.ai/latest/openvino_inference_engine_ie_bridges_python_sample_hello_reshape_ssd_README.html)
* [Hello Reshape SSD Python* Sample](https://github.com/openvinotoolkit/openvino/tree/master/samples/python/hello_reshape_ssd)
* [OpenVINO Samples Python](https://github.com/openvinotoolkit/openvino/tree/master/samples/python)
* [memory-profiler](https://github.com/pythonprofilers/memory_profiler)
* [C++ API - Inference ProfilingInfo](https://docs.openvino.ai/nightly/structov_1_1ProfilingInfo.html)
* [Python API - openvino.runtime.InferRequest](https://docs.openvino.ai/nightly/api/ie_python_api/_autosummary/openvino.runtime.InferRequest.html)
* [Python API - openvino.runtime.InferRequest.get_profiling_info](https://docs.openvino.ai/nightly/api/ie_python_api/_autosummary/openvino.runtime.InferRequest.html#openvino.runtime.InferRequest.get_profiling_info)
* [Monitoring memory usage of a running Python program](https://www.geeksforgeeks.org/monitoring-memory-usage-of-a-running-python-program/)
