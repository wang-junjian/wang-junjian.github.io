---
layout: post
title:  "OpenVINO Cross Check Tool"
date:   2022-05-18 08:00:00 +0800
categories:  OpenVINO
tags: [cross_check_tool]
---

## [交叉检查工具 (Cross Check Tool)](https://docs.openvino.ai/latest/openvino_inference_engine_tools_cross_check_tool_README.html)
可以比较两个连续模型推理的准确性和性能指标，这些推理在两个不同的受支持的英特尔设备上执行或以不同的精度执行。交叉检查工具可以比较每层或整个模型的指标。

## 查看帮助信息
```
$ python cross_check_tool.py -h
usage: 
--------------------------------------------------------------
For cross precision check provide two IRs 
(mapping files may be needed) run:
python3 cross_check_tool.py                        \
--input path/to/file/describing/input              \
--model path/to/model/*.xml                        \
--device device_for_model                          \
--reference_model path/to/reference_model/*.xml    \
--reference_device reference_device_for_model      
--------------------------------------------------------------
For cross device check with one precision provide one IR run:
python3 cross_check_tool.py                        \
--input path/to/file/describing/input              \
--model path/to/model/*.xml                        \
--device device_for_model                          \
--reference_device reference_device_for_model      
--------------------------------------------------------------
For dumping tensors and performance counters run:
python3 cross_check_tool.py                        \
--input path/to/file/describing/input              \
--model path/to/model/*.xml                        \
--device device_for_model                          \
--dump
--------------------------------------------------------------
For check inference against dumped results run:
python3 cross_check_tool.py                        \
--input path/to/file/describing/input              \
--model path/to/model/*.xml                        \
--device device_for_model                          \
--load path/to/dump/file/* 
--------------------------------------------------------------
For all layers check provide:
--layers='all' 
For specific number of layers check provide:
--layers='layer_name,another_layer_name,...,last_layer_name'
--------------------------------------------------------------
If --input is empty CCT generates input(s) from normal
distribution and dumps this input to a file
--------------------------------------------------------------

Cross Check Tool is a console application that enables comparing accuracy and provides performance metrics

optional arguments:
  -h, --help            show this help message and exit
  -v, --verbosity       Increase output verbosity

Model specific arguments:
  --input INPUT, -i INPUT
                        Path to an input image file or multi-input file to infer. Generates input(s) from normal distribution if empty
  --model MODEL, -m MODEL
                        Path to an .xml file that represents the first IR of the trained model to infer.
  --reference_model REFERENCE_MODEL, -ref_m REFERENCE_MODEL
                        Path to an .xml file that represents the second IR to compare the metrics. Uses --model if empty
  --layers LAYERS, -layers LAYERS
                        Defines layers to check. Options: all, None - for output layers check, list of comma-separated layer names to check. Default value is None.
  -ref_layers REFERENCE_LAYERS, --reference_layers REFERENCE_LAYERS
                        Defines layers to check in referece model. Options: all, None - for output layers check, list of comma-separated layer names to check. If not specified the same layers will be processed as in
                        --layers parameter.
  --num_of_iterations NUM_OF_ITERATIONS, -ni NUM_OF_ITERATIONS
                        Number of iterations to collect all over the net performance

Plugin specific arguments:
  --plugin_path PLUGIN_PATH, -pp PLUGIN_PATH
                        Path to a plugin folder.
  --device DEVICE, -d DEVICE
                        The first target device to infer the model specified with the -m or --model option. CPU, GPU, HDDL or MYRIAD are acceptable.
  --config CONFIG, -conf CONFIG
                        Path to config file for -d or -device device plugin
  --reference_device REFERENCE_DEVICE, -ref_d REFERENCE_DEVICE
                        The second target device to infer the model and compare the metrics. CPU, GPU, HDDL or MYRIAD are acceptable.
  --reference_config REFERENCE_CONFIG, -ref_conf REFERENCE_CONFIG
                        Path to config file for -ref_d or -reference_device device plugin
  -l L                  Required for MKLDNN (CPU)-targeted custom layers. Comma separated paths to a shared libraries with the kernels implementation.

CCT mode arguments:
  --dump                Enables tensors statistics dumping
  --load LOAD           Path to a file to load tensors from
```
* ```--layers all```

## 准备测试用的图像
```shell
wget http://book.d2l.ai/_images/catdog.jpg
```

## 跨设备检查精度
```shell
$ python cross_check_tool.py -i catdog.jpg \
              -m /data/wjj/openvino/ir/public/ssd300/FP32/ssd300.xml \
              -d GPU \
              -ref_d CPU
```
```
OpenVINO:
          API version ............ 2022.1.0-7019-cdb9bec7210-releases/2022/1
[ INFO ]  Cross check with one IR was enabled
[ INFO ]  GPU vs CPU
[ INFO ]  The same IR on both devices: /data/wjj/openvino/ir/public/ssd300/FP32/ssd300.xml
[ INFO ]  1 input detected: data
[ INFO ]  Statistics will be dumped for 1 layer: detection_out/sink_port_0
[ INFO ]  Prepare image catdog.jpg
[ INFO ]  Layer detection_out/sink_port_0 statistics
            Max absolute difference : 2.38419E-07
            Min absolute difference : 0.0
            Max relative difference : 2.38419E+13
            Min relative difference : 0.0
                Min reference value : -1.08998E-01
       Min absolute reference value : 0.0
                Max reference value : 18.0
       Max absolute reference value : 18.0
                   Min actual value : -1.08998E-01
          Min absolute actual value : 0.0
                   Max actual value : 18.0
          Max absolute actual value : 18.0
                             Device:           -d GPU       -ref_d CPU
                             Status:  Status.EXECUTED   Status.NOT_RUN
                      Number of NAN:                0                0
                     Number of ZERO:              200              200
----------------------------------------------------------------------
  Overall performance, microseconds:      1.16335E+05      2.97305E+05
----------------------------------------------------------------------
[ INFO ]  Overall max absolute difference = 2.384185791015625e-07
[ INFO ]  Overall min absolute difference = 0.0
[ INFO ]  Overall max relative difference = 23841858387968.0
[ INFO ]  Overall min relative difference = 0.0
[ INFO ]  Execution successful
```

## 检查不同精度
```shell
$ python cross_check_tool.py -i catdog.jpg \
              -m /data/wjj/openvino/ir/public/ssd300/FP16/ssd300.xml \
              -d CPU \
              -ref_m /data/wjj/openvino/ir/public/ssd300/FP32/ssd300.xml \
              -ref_d CPU
```
```
[ WARNING ]  Check over two different IRs was enabled. In case if layer names in these two IRs are different, please provide both -layers and --reference_layers to compare against.
OpenVINO:
          API version ............ 2022.1.0-7019-cdb9bec7210-releases/2022/1
[ INFO ]  Cross check with two IRs was enabled
[ INFO ]  CPU vs CPU
[ INFO ]  IR for CPU : /data/wjj/openvino/ir/public/ssd300/FP16/ssd300.xml
[ INFO ]  IR for CPU : /data/wjj/openvino/ir/public/ssd300/FP32/ssd300.xml
[ INFO ]  1 input detected: data
[ INFO ]  Statistics will be dumped for 1 layer: detection_out/sink_port_0
[ INFO ]  Prepare image catdog.jpg
[ INFO ]  Layer detection_out/sink_port_0 statistics
            Max absolute difference : 7.07528E-01
            Min absolute difference : 0.0
            Max relative difference : 7.07528E+19
            Min relative difference : 0.0
                Min reference value : -1.08998E-01
       Min absolute reference value : 0.0
                Max reference value : 18.0
       Max absolute reference value : 18.0
                   Min actual value : -1.08997E-01
          Min absolute actual value : 0.0
                   Max actual value : 18.0
          Max absolute actual value : 18.0
                             Device:           -d CPU       -ref_d CPU
                             Status:   Status.NOT_RUN   Status.NOT_RUN
                         Layer type:           Result           Result
                Real time, microsec:          0:00:00          0:00:00
                      Number of NAN:                0                0
                      Number of INF:                0                0
                     Number of ZERO:              200              200
----------------------------------------------------------------------
  Overall performance, microseconds:      2.43123E+05      1.49169E+05
----------------------------------------------------------------------
[ INFO ]  Overall max absolute difference = 0.7075276374816895
[ INFO ]  Overall min absolute difference = 0.0
[ INFO ]  Overall max relative difference = 7.075276400682756e+19
[ INFO ]  Overall min relative difference = 0.0
[ INFO ]  Execution successful
```

## 转储张量和性能计数器
```shell
$ python cross_check_tool.py -i catdog.jpg \
              -m /data/wjj/openvino/ir/public/ssd300/FP32/ssd300.xml \
              -d CPU \
              --dump
```
```
OpenVINO:
          API version ............ 2022.1.0-7019-cdb9bec7210-releases/2022/1
[ INFO ]  Dump mode was enabled
[ INFO ]  Prepare image catdog.jpg
[ INFO ]  Layer detection_out/sink_port_0 processing
[ INFO ]  Dump file path: /data/wjj/openvino/ir/public/ssd300/FP32/ssd300.xml_CPU_dump.npz
[ INFO ]  Execution successful
```

## 检查转储结果的推理
```shell
$ python cross_check_tool.py -i catdog.jpg \
              -m /data/wjj/openvino/ir/public/ssd300/FP32/ssd300.xml \
              -d CPU \
              --load /data/wjj/openvino/ir/public/ssd300/FP32/ssd300.xml_CPU_dump.npz
```
```
OpenVINO:
          API version ............ 2022.1.0-7019-cdb9bec7210-releases/2022/1
[ INFO ]  Load mode was enabled
[ INFO ]  IR for CPU : /data/wjj/openvino/ir/public/ssd300/FP32/ssd300.xml
[ INFO ]  Loading tensors from /data/wjj/openvino/ir/public/ssd300/FP32/ssd300.xml_CPU_dump.npz
[ INFO ]  1 input detected: data
[ INFO ]  Statistics will be dumped for 1 layer: detection_out/sink_port_0
[ INFO ]  Prepare image catdog.jpg
[ INFO ]  Layer detection_out/sink_port_0 statistics
            Max absolute difference : 0.0
            Min absolute difference : 0.0
            Max relative difference : 0.0
            Min relative difference : 0.0
                Min reference value : -1.08998E-01
       Min absolute reference value : 0.0
                Max reference value : 18.0
       Max absolute reference value : 18.0
                   Min actual value : -1.08998E-01
          Min absolute actual value : 0.0
                   Max actual value : 18.0
          Max absolute actual value : 18.0
                             Device:           -d CPU       -ref_d CPU
                             Status:   Status.NOT_RUN   Status.NOT_RUN
                         Layer type:           Result           Result
                Real time, microsec:          0:00:00          0:00:00
                      Number of NAN:                0                0
                      Number of INF:                0                0
                     Number of ZERO:              200              200
[ INFO ]  Overall max absolute difference = 0.0
[ INFO ]  Overall min absolute difference = 0.0
[ INFO ]  Overall max relative difference = 0.0
[ INFO ]  Overall min relative difference = 0.0
[ INFO ]  Execution successful
```

**Windows 版本有 BUG：在文件 cross_check_tool/utils.py 中的 input_processing 函数。**
```py
tensor_name = 'data' # ADD
if tensor_name not in input_names:
  raise Exception(f"Input with name {tensor_name} doesn't exist in the model!")
```

## 参考资料
* [Cross Check Tool](https://docs.openvino.ai/latest/openvino_inference_engine_tools_cross_check_tool_README.html)
