---
layout: single
title:  "OpenVINO Benchmark Python Tool"
date:   2022-05-19 08:00:00 +0800
categories:  Benchmark
tags: [OpenVINO, benchmark_app]
---

## [性能指标评测工具](https://docs.openvino.ai/cn/latest/openvino_inference_engine_tools_benchmark_tool_README.html)
该工具使用卷积网络执行推理。性能可以测量两种推理模式：
* 同步（面向延迟 Latency）
* 异步（面向吞吐量 Throughput）

## 帮助信息
```
  -i PATHS_TO_INPUT [PATHS_TO_INPUT ...], --paths_to_input PATHS_TO_INPUT [PATHS_TO_INPUT ...]
                        Optional. Path to a folder with images and/or binaries or to specific image or binary file.It is also allowed to map files to network inputs: input_1:file_1/dir1,file_2/dir2,input_4:file_4/dir4
                        input_2:file_3/dir3
  -m PATH_TO_MODEL, --path_to_model PATH_TO_MODEL
                        Required. Path to an .xml/.onnx file with a trained model or to a .blob file with a trained compiled model.
  -d TARGET_DEVICE, --target_device TARGET_DEVICE
                        Optional. Specify a target device to infer on (the list of available devices is shown below). Default value is CPU. Use '-d HETERO:<comma separated devices list>' format to specify HETERO plugin. Use
                        '-d MULTI:<comma separated devices list>' format to specify MULTI plugin. The application looks for a suitable plugin for the specified device.
  -hint {throughput,latency,none}, --perf_hint {throughput,latency,none}
                        Optional. Performance hint (latency or throughput or none). Performance hint allows the OpenVINO device to select the right network-specific settings. 'throughput': device performance mode will be
                        set to THROUGHPUT. 'latency': device performance mode will be set to LATENCY. 'none': no device performance mode will be set. Using explicit 'nstreams' or other device-specific options, please set
                        hint to 'none'
  -api {sync,async}, --api_type {sync,async}
  -niter NUMBER_ITERATIONS, --number_iterations NUMBER_ITERATIONS
                        Optional. Number of iterations. If not specified, the number of iterations is calculated depending on a device.
  -nireq NUMBER_INFER_REQUESTS, --number_infer_requests NUMBER_INFER_REQUESTS
                        Optional. Number of infer requests. Default value is determined automatically for device.
  -b BATCH_SIZE, --batch_size BATCH_SIZE
                        Optional. Batch size value. If not specified, the batch size value is determined from Intermediate Representation
  -t TIME, --time TIME  Optional. Time in seconds to execute topology.
  -nstreams NUMBER_STREAMS, --number_streams NUMBER_STREAMS
                        Optional. Number of streams to use for inference on the CPU/GPU/MYRIAD (for HETERO and MULTI device cases use format <device1>:<nstreams1>,<device2>:<nstreams2> or just <nstreams>). Default value is
                        determined automatically for a device. Please note that although the automatic selection usually provides a reasonable performance, it still may be non - optimal for some cases, especially for very
                        small networks. Also, using nstreams>1 is inherently throughput-oriented option, while for the best-latency estimations the number of streams should be set to 1. See samples README for more details.
  -nthreads NUMBER_THREADS, --number_threads NUMBER_THREADS
                        Number of threads to use for inference on the CPU, GNA (including HETERO and MULTI cases).
  -pc [PERF_COUNTS], --perf_counts [PERF_COUNTS]
                        Optional. Report performance counters.
```

## 下载图像
```shell
wget http://book.d2l.ai/_images/catdog.jpg
```

## 执行一次推理
```shell
$ benchmark_app -i catdog.jpg -m /data/wjj/openvino/ir/public/googlenet-v1/FP32/googlenet-v1.xml -d CPU -niter 1
```
```
[Step 1/11] Parsing and validating input arguments
[ WARNING ]  -nstreams default value is determined automatically for a device. Although the automatic selection usually provides a reasonable performance, but it still may be non-optimal for some cases, for more information look at README. 
[Step 2/11] Loading OpenVINO
[ WARNING ] PerformanceMode was not explicitly specified in command line. Device CPU performance hint will be set to THROUGHPUT.
[ INFO ] OpenVINO:
         API version............. 2022.1.0-7019-cdb9bec7210-releases/2022/1
[ INFO ] Device info
         CPU
         openvino_intel_cpu_plugin version 2022.1
         Build................... 2022.1.0-7019-cdb9bec7210-releases/2022/1

[Step 3/11] Setting device configuration
[ WARNING ] -nstreams default value is determined automatically for CPU device. Although the automatic selection usually provides a reasonable performance, but it still may be non-optimal for some cases, for more information look at README.
[Step 4/11] Reading network files
[ INFO ] Read model took 32.81 ms
[Step 5/11] Resizing network to match image sizes and given batch
[ INFO ] Network batch size: 1
[Step 6/11] Configuring input of the model
[ INFO ] Model input 'data' precision u8, dimensions ([N,C,H,W]): 1 3 224 224
[ INFO ] Model output 'prob' precision f32, dimensions ([...]): 1 1000
[Step 7/11] Loading the model to the device
[ INFO ] Compile model took 182.00 ms
[Step 8/11] Querying optimal runtime parameters
[ INFO ] DEVICE: CPU
[ INFO ]   AVAILABLE_DEVICES  , ['']
[ INFO ]   RANGE_FOR_ASYNC_INFER_REQUESTS  , (1, 1, 1)
[ INFO ]   RANGE_FOR_STREAMS  , (1, 64)
[ INFO ]   FULL_DEVICE_NAME  , Intel(R) Xeon(R) Silver 4216 CPU @ 2.10GHz
[ INFO ]   OPTIMIZATION_CAPABILITIES  , ['WINOGRAD', 'FP32', 'FP16', 'INT8', 'BIN', 'EXPORT_IMPORT']
[ INFO ]   CACHE_DIR  , 
[ INFO ]   NUM_STREAMS  , 8
[ INFO ]   INFERENCE_NUM_THREADS  , 0
[ INFO ]   PERF_COUNT  , False
[ INFO ]   PERFORMANCE_HINT_NUM_REQUESTS  , 0
[Step 9/11] Creating infer requests and preparing input data
[ INFO ] Create 8 infer requests took 1.80 ms
[ INFO ] Prepare image /home/lnsoft/wjj/github/openvinotoolkit/catdog.jpg
[ WARNING ] Image is resized from ((561, 728)) to ((224, 224))
[ WARNING ] Number of iterations was aligned by request number from 1 to 8 using number of requests 8
[Step 10/11] Measuring performance (Start inference asynchronously, 8 inference requests using 8 streams for CPU, inference only: True, limits: 8 iterations)
[ INFO ] Benchmarking in inference only mode (inputs filling are not included in measurement loop).
[ INFO ] First inference took 32.63 ms
[Step 11/11] Dumping statistics report
Count:          8 iterations
Duration:       33.69 ms
Latency:
    Median:     33.15 ms
    AVG:        31.40 ms
    MIN:        20.62 ms
    MAX:        33.57 ms
Throughput: 237.49 FPS
```

## API
### 同步
主要指标是延迟。应用程序创建一个推理请求并执行 Infer 方法。

```shell
$ benchmark_app -i catdog.jpg -m /data/wjj/openvino/ir/public/googlenet-v1/FP32/googlenet-v1.xml -d CPU -api sync -t 10
```
```
[Step 2/11] Loading OpenVINO
[ WARNING ] PerformanceMode was not explicitly specified in command line. Device CPU performance hint will be set to LATENCY.
[Step 10/11] Measuring performance (Start inference synchronously, inference only: True, limits: 10000 ms duration)
[Step 11/11] Dumping statistics report
Count:          1674 iterations
Duration:       10003.75 ms
Latency:
    Median:     5.86 ms
    AVG:        5.89 ms
    MIN:        5.77 ms
    MAX:        14.02 ms
Throughput: 170.76 FPS
```

可以看到设备性能模式自动设置为 LATENCY。

### 异步
主要指标是以每秒帧数 (FPS) 为单位的吞吐量。应用程序创建一定数量的推理请求并执行 StartAsync 方法。

```shell
$ benchmark_app -i catdog.jpg -m /data/wjj/openvino/ir/public/googlenet-v1/FP32/googlenet-v1.xml -d CPU -api async -t 10
```
```
[Step 2/11] Loading OpenVINO
[ WARNING ] PerformanceMode was not explicitly specified in command line. Device CPU performance hint will be set to THROUGHPUT.
[Step 10/11] Measuring performance (Start inference asynchronously, 8 inference requests using 8 streams for CPU, inference only: True, limits: 10000 ms duration)
[Step 11/11] Dumping statistics report
Count:          4504 iterations
Duration:       10030.66 ms
Latency:
    Median:     17.66 ms
    AVG:        17.75 ms
    MIN:        17.14 ms
    MAX:        34.43 ms
Throughput: 449.02 FPS
```

可以看到设备性能模式自动设置为 THROUGHPUT。

## 设备性能模式
### THROUGHPUT（吞吐量）
```shell
$ benchmark_app -i catdog.jpg -m /data/wjj/openvino/ir/public/googlenet-v1/FP32/googlenet-v1.xml -d CPU -t 10
```
```
[Step 10/11] Measuring performance (Start inference asynchronously, 8 inference requests using 8 streams for CPU, inference only: True, limits: 10000 ms duration)
[Step 11/11] Dumping statistics report
Count:          4480 iterations
Duration:       10020.24 ms
Latency:
    Median:     17.72 ms
    AVG:        17.78 ms
    MIN:        16.42 ms
    MAX:        31.29 ms
Throughput: 447.10 FPS
```

### LATENCY（延迟）
```shell
$ benchmark_app -i catdog.jpg -m /data/wjj/openvino/ir/public/googlenet-v1/FP32/googlenet-v1.xml -d CPU -hint latency -t 10
```
```
[Step 10/11] Measuring performance (Start inference asynchronously, 2 inference requests, inference only: True, limits: 10000 ms duration)
[Step 11/11] Dumping statistics report
Count:          3338 iterations
Duration:       10006.44 ms
Latency:
    Median:     5.89 ms
    AVG:        5.95 ms
    MIN:        5.77 ms
    MAX:        12.54 ms
Throughput: 333.59 FPS
```

## 性能统计
可以了解每一层的性能指标。

```shell
$ benchmark_app -i catdog.jpg -m /data/wjj/openvino/ir/public/googlenet-v1/FP32/googlenet-v1.xml -d CPU -api sync -niter 1 -pc
```
```
[Step 10/11] Measuring performance (Start inference synchronously, inference only: True, limits: 1 iterations)
[Step 11/11] Dumping statistics report
[ INFO ] Performance counts for 0-th infer request
data                          Status.NOT_RUN layerType: Parameter          realTime: 0:00:00   cpu: 0:00:00        execType: unknown_I8
Convert_654                   Status.EXECUTEDlayerType: Convert            realTime: 0:00:00.000226cpu: 0:00:00.000226 execType: unknown_I8
data/mean                     Status.EXECUTEDlayerType: Subgraph           realTime: 0:00:00.000042cpu: 0:00:00.000042 execType: jit_avx512_FP32
conv1/7x7_s2/WithoutBiases    Status.EXECUTEDlayerType: Convolution        realTime: 0:00:00.001189cpu: 0:00:00.001189 execType: jit_avx512_FP32
conv1/relu_7x7                Status.NOT_RUN layerType: Relu               realTime: 0:00:00   cpu: 0:00:00        execType: undef     
pool1/3x3_s2                  Status.EXECUTEDlayerType: MaxPool            realTime: 0:00:00.000142cpu: 0:00:00.000142 execType: jit_avx512_FP32
pool1/norm16089               Status.EXECUTEDlayerType: LRN                realTime: 0:00:00.000092cpu: 0:00:00.000092 execType: jit_avx512_FP32
conv2/3x3_reduce/WithoutBi... Status.EXECUTEDlayerType: Convolution        realTime: 0:00:00.000144cpu: 0:00:00.000144 execType: jit_avx512_1x1_FP32
conv2/relu_3x3_reduce         Status.NOT_RUN layerType: Relu               realTime: 0:00:00   cpu: 0:00:00        execType: undef     
conv2/3x3/WithoutBiases       Status.EXECUTEDlayerType: Convolution        realTime: 0:00:00.001841cpu: 0:00:00.001841 execType: jit_avx512_FP32
conv2/relu_3x3                Status.NOT_RUN layerType: Relu               realTime: 0:00:00   cpu: 0:00:00        execType: undef     
conv2/norm26085               Status.EXECUTEDlayerType: LRN                realTime: 0:00:00.000328cpu: 0:00:00.000328 execType: jit_avx512_FP32
pool2/3x3_s2                  Status.EXECUTEDlayerType: MaxPool            realTime: 0:00:00.000071cpu: 0:00:00.000071 execType: jit_avx512_FP32
inception_3a/pool             Status.EXECUTEDlayerType: MaxPool            realTime: 0:00:00.000049cpu: 0:00:00.000049 execType: jit_avx512_FP32
inception_3a/pool_proj/Wit... Status.EXECUTEDlayerType: Convolution        realTime: 0:00:00.000072cpu: 0:00:00.000072 execType: jit_avx512_1x1_FP32
inception_3a/relu_pool_proj   Status.NOT_RUN layerType: Relu               realTime: 0:00:00   cpu: 0:00:00        execType: undef     
inception_3a/5x5_reduce/Wi... Status.EXECUTEDlayerType: Convolution        realTime: 0:00:00.000049cpu: 0:00:00.000049 execType: jit_avx512_1x1_FP32
inception_3a/relu_5x5_reduce  Status.NOT_RUN layerType: Relu               realTime: 0:00:00   cpu: 0:00:00        execType: undef     
inception_3a/5x5/WithoutBi... Status.EXECUTEDlayerType: Convolution        realTime: 0:00:00.000093cpu: 0:00:00.000093 execType: jit_avx512_FP32
inception_3a/relu_5x5         Status.NOT_RUN layerType: Relu               realTime: 0:00:00   cpu: 0:00:00        execType: undef     
inception_3a/3x3_reduce/Wi... Status.EXECUTEDlayerType: Convolution        realTime: 0:00:00.000103cpu: 0:00:00.000103 execType: jit_avx512_1x1_FP32
inception_3a/relu_3x3_reduce  Status.NOT_RUN layerType: Relu               realTime: 0:00:00   cpu: 0:00:00        execType: undef     
inception_3a/3x3/WithoutBi... Status.EXECUTEDlayerType: Convolution        realTime: 0:00:00.000444cpu: 0:00:00.000444 execType: jit_avx512_FP32
inception_3a/relu_3x3         Status.NOT_RUN layerType: Relu               realTime: 0:00:00   cpu: 0:00:00        execType: undef     
inception_3a/1x1/WithoutBi... Status.EXECUTEDlayerType: Convolution        realTime: 0:00:00.000072cpu: 0:00:00.000072 execType: jit_avx512_1x1_FP32
inception_3a/relu_1x1         Status.NOT_RUN layerType: Relu               realTime: 0:00:00   cpu: 0:00:00        execType: undef     
inception_3a/output           Status.NOT_RUN layerType: Concat             realTime: 0:00:00   cpu: 0:00:00        execType: unknown_FP32
inception_3b/pool             Status.EXECUTEDlayerType: MaxPool            realTime: 0:00:00.000058cpu: 0:00:00.000058 execType: jit_avx512_FP32
inception_3b/pool_proj/Wit... Status.EXECUTEDlayerType: Convolution        realTime: 0:00:00.000139cpu: 0:00:00.000139 execType: jit_avx512_1x1_FP32
inception_3b/relu_pool_proj   Status.NOT_RUN layerType: Relu               realTime: 0:00:00   cpu: 0:00:00        execType: undef     
inception_3b/5x5_reduce/Wi... Status.EXECUTEDlayerType: Convolution        realTime: 0:00:00.000078cpu: 0:00:00.000078 execType: jit_avx512_1x1_FP32
inception_3b/relu_5x5_reduce  Status.NOT_RUN layerType: Relu               realTime: 0:00:00   cpu: 0:00:00        execType: undef     
inception_3b/5x5/WithoutBi... Status.EXECUTEDlayerType: Convolution        realTime: 0:00:00.000300cpu: 0:00:00.000300 execType: jit_avx512_FP32
inception_3b/relu_5x5         Status.NOT_RUN layerType: Relu               realTime: 0:00:00   cpu: 0:00:00        execType: undef     
inception_3b/3x3_reduce/Wi... Status.EXECUTEDlayerType: Convolution        realTime: 0:00:00.000173cpu: 0:00:00.000173 execType: jit_avx512_1x1_FP32
inception_3b/relu_3x3_reduce  Status.NOT_RUN layerType: Relu               realTime: 0:00:00   cpu: 0:00:00        execType: undef     
inception_3b/3x3/WithoutBi... Status.EXECUTEDlayerType: Convolution        realTime: 0:00:00.000865cpu: 0:00:00.000865 execType: jit_avx512_FP32
inception_3b/relu_3x3         Status.NOT_RUN layerType: Relu               realTime: 0:00:00   cpu: 0:00:00        execType: undef     
inception_3b/1x1/WithoutBi... Status.EXECUTEDlayerType: Convolution        realTime: 0:00:00.000190cpu: 0:00:00.000190 execType: jit_avx512_1x1_FP32
inception_3b/relu_1x1         Status.NOT_RUN layerType: Relu               realTime: 0:00:00   cpu: 0:00:00        execType: undef     
inception_3b/output           Status.NOT_RUN layerType: Concat             realTime: 0:00:00   cpu: 0:00:00        execType: unknown_FP32
pool3/3x3_s2                  Status.EXECUTEDlayerType: MaxPool            realTime: 0:00:00.000052cpu: 0:00:00.000052 execType: jit_avx512_FP32
inception_4a/pool             Status.EXECUTEDlayerType: MaxPool            realTime: 0:00:00.000028cpu: 0:00:00.000028 execType: jit_avx512_FP32
inception_4a/pool_proj/Wit... Status.EXECUTEDlayerType: Convolution        realTime: 0:00:00.000056cpu: 0:00:00.000056 execType: jit_avx512_1x1_FP32
inception_4a/relu_pool_proj   Status.NOT_RUN layerType: Relu               realTime: 0:00:00   cpu: 0:00:00        execType: undef     
inception_4a/5x5_reduce/Wi... Status.EXECUTEDlayerType: Convolution        realTime: 0:00:00.000041cpu: 0:00:00.000041 execType: jit_avx512_1x1_FP32
inception_4a/relu_5x5_reduce  Status.NOT_RUN layerType: Relu               realTime: 0:00:00   cpu: 0:00:00        execType: undef     
inception_4a/5x5/WithoutBi... Status.EXECUTEDlayerType: Convolution        realTime: 0:00:00.000030cpu: 0:00:00.000030 execType: jit_avx512_FP32
inception_4a/relu_5x5         Status.NOT_RUN layerType: Relu               realTime: 0:00:00   cpu: 0:00:00        execType: undef     
inception_4a/3x3_reduce/Wi... Status.EXECUTEDlayerType: Convolution        realTime: 0:00:00.000057cpu: 0:00:00.000057 execType: jit_avx512_1x1_FP32
inception_4a/relu_3x3_reduce  Status.NOT_RUN layerType: Relu               realTime: 0:00:00   cpu: 0:00:00        execType: undef     
inception_4a/3x3/WithoutBi... Status.EXECUTEDlayerType: Convolution        realTime: 0:00:00.000185cpu: 0:00:00.000185 execType: jit_avx512_FP32
inception_4a/relu_3x3         Status.NOT_RUN layerType: Relu               realTime: 0:00:00   cpu: 0:00:00        execType: undef     
inception_4a/1x1/WithoutBi... Status.EXECUTEDlayerType: Convolution        realTime: 0:00:00.000100cpu: 0:00:00.000100 execType: jit_avx512_1x1_FP32
inception_4a/relu_1x1         Status.NOT_RUN layerType: Relu               realTime: 0:00:00   cpu: 0:00:00        execType: undef     
inception_4a/output           Status.NOT_RUN layerType: Concat             realTime: 0:00:00   cpu: 0:00:00        execType: unknown_FP32
inception_4b/pool             Status.EXECUTEDlayerType: MaxPool            realTime: 0:00:00.000029cpu: 0:00:00.000029 execType: jit_avx512_FP32
inception_4b/pool_proj/Wit... Status.EXECUTEDlayerType: Convolution        realTime: 0:00:00.000054cpu: 0:00:00.000054 execType: jit_avx512_1x1_FP32
inception_4b/relu_pool_proj   Status.NOT_RUN layerType: Relu               realTime: 0:00:00   cpu: 0:00:00        execType: undef     
inception_4b/5x5_reduce/Wi... Status.EXECUTEDlayerType: Convolution        realTime: 0:00:00.000039cpu: 0:00:00.000039 execType: jit_avx512_1x1_FP32
inception_4b/relu_5x5_reduce  Status.NOT_RUN layerType: Relu               realTime: 0:00:00   cpu: 0:00:00        execType: undef     
inception_4b/5x5/WithoutBi... Status.EXECUTEDlayerType: Convolution        realTime: 0:00:00.000063cpu: 0:00:00.000063 execType: jit_avx512_FP32
inception_4b/relu_5x5         Status.NOT_RUN layerType: Relu               realTime: 0:00:00   cpu: 0:00:00        execType: undef     
inception_4b/3x3_reduce/Wi... Status.EXECUTEDlayerType: Convolution        realTime: 0:00:00.000074cpu: 0:00:00.000074 execType: jit_avx512_1x1_FP32
inception_4b/relu_3x3_reduce  Status.NOT_RUN layerType: Relu               realTime: 0:00:00   cpu: 0:00:00        execType: undef     
inception_4b/3x3/WithoutBi... Status.EXECUTEDlayerType: Convolution        realTime: 0:00:00.000230cpu: 0:00:00.000230 execType: jit_avx512_FP32
inception_4b/relu_3x3         Status.NOT_RUN layerType: Relu               realTime: 0:00:00   cpu: 0:00:00        execType: undef     
inception_4b/1x1/WithoutBi... Status.EXECUTEDlayerType: Convolution        realTime: 0:00:00.000088cpu: 0:00:00.000088 execType: jit_avx512_1x1_FP32
inception_4b/relu_1x1         Status.NOT_RUN layerType: Relu               realTime: 0:00:00   cpu: 0:00:00        execType: undef     
inception_4b/output           Status.NOT_RUN layerType: Concat             realTime: 0:00:00   cpu: 0:00:00        execType: unknown_FP32
inception_4c/pool             Status.EXECUTEDlayerType: MaxPool            realTime: 0:00:00.000037cpu: 0:00:00.000037 execType: jit_avx512_FP32
inception_4c/pool_proj/Wit... Status.EXECUTEDlayerType: Convolution        realTime: 0:00:00.000054cpu: 0:00:00.000054 execType: jit_avx512_1x1_FP32
inception_4c/relu_pool_proj   Status.NOT_RUN layerType: Relu               realTime: 0:00:00   cpu: 0:00:00        execType: undef     
inception_4c/5x5_reduce/Wi... Status.EXECUTEDlayerType: Convolution        realTime: 0:00:00.000036cpu: 0:00:00.000036 execType: jit_avx512_1x1_FP32
inception_4c/relu_5x5_reduce  Status.NOT_RUN layerType: Relu               realTime: 0:00:00   cpu: 0:00:00        execType: undef     
inception_4c/5x5/WithoutBi... Status.EXECUTEDlayerType: Convolution        realTime: 0:00:00.000063cpu: 0:00:00.000063 execType: jit_avx512_FP32
inception_4c/relu_5x5         Status.NOT_RUN layerType: Relu               realTime: 0:00:00   cpu: 0:00:00        execType: undef     
inception_4c/3x3_reduce/Wi... Status.EXECUTEDlayerType: Convolution        realTime: 0:00:00.000076cpu: 0:00:00.000076 execType: jit_avx512_1x1_FP32
inception_4c/relu_3x3_reduce  Status.NOT_RUN layerType: Relu               realTime: 0:00:00   cpu: 0:00:00        execType: undef     
inception_4c/3x3/WithoutBi... Status.EXECUTEDlayerType: Convolution        realTime: 0:00:00.000280cpu: 0:00:00.000280 execType: jit_avx512_FP32
inception_4c/relu_3x3         Status.NOT_RUN layerType: Relu               realTime: 0:00:00   cpu: 0:00:00        execType: undef     
inception_4c/1x1/WithoutBi... Status.EXECUTEDlayerType: Convolution        realTime: 0:00:00.000073cpu: 0:00:00.000073 execType: jit_avx512_1x1_FP32
inception_4c/relu_1x1         Status.NOT_RUN layerType: Relu               realTime: 0:00:00   cpu: 0:00:00        execType: undef     
inception_4c/output           Status.NOT_RUN layerType: Concat             realTime: 0:00:00   cpu: 0:00:00        execType: unknown_FP32
inception_4d/pool             Status.EXECUTEDlayerType: MaxPool            realTime: 0:00:00.000023cpu: 0:00:00.000023 execType: jit_avx512_FP32
inception_4d/pool_proj/Wit... Status.EXECUTEDlayerType: Convolution        realTime: 0:00:00.000058cpu: 0:00:00.000058 execType: jit_avx512_1x1_FP32
inception_4d/relu_pool_proj   Status.NOT_RUN layerType: Relu               realTime: 0:00:00   cpu: 0:00:00        execType: undef     
inception_4d/5x5_reduce/Wi... Status.EXECUTEDlayerType: Convolution        realTime: 0:00:00.000037cpu: 0:00:00.000037 execType: jit_avx512_1x1_FP32
inception_4d/relu_5x5_reduce  Status.NOT_RUN layerType: Relu               realTime: 0:00:00   cpu: 0:00:00        execType: undef     
inception_4d/5x5/WithoutBi... Status.EXECUTEDlayerType: Convolution        realTime: 0:00:00.000064cpu: 0:00:00.000064 execType: jit_avx512_FP32
inception_4d/relu_5x5         Status.NOT_RUN layerType: Relu               realTime: 0:00:00   cpu: 0:00:00        execType: undef     
inception_4d/3x3_reduce/Wi... Status.EXECUTEDlayerType: Convolution        realTime: 0:00:00.000083cpu: 0:00:00.000083 execType: jit_avx512_1x1_FP32
inception_4d/relu_3x3_reduce  Status.NOT_RUN layerType: Relu               realTime: 0:00:00   cpu: 0:00:00        execType: undef     
inception_4d/3x3/WithoutBi... Status.EXECUTEDlayerType: Convolution        realTime: 0:00:00.000357cpu: 0:00:00.000357 execType: jit_avx512_FP32
inception_4d/relu_3x3         Status.NOT_RUN layerType: Relu               realTime: 0:00:00   cpu: 0:00:00        execType: undef     
inception_4d/1x1/WithoutBi... Status.EXECUTEDlayerType: Convolution        realTime: 0:00:00.000078cpu: 0:00:00.000078 execType: jit_avx512_1x1_FP32
inception_4d/relu_1x1         Status.NOT_RUN layerType: Relu               realTime: 0:00:00   cpu: 0:00:00        execType: undef     
inception_4d/output           Status.NOT_RUN layerType: Concat             realTime: 0:00:00   cpu: 0:00:00        execType: unknown_FP32
inception_4e/pool             Status.EXECUTEDlayerType: MaxPool            realTime: 0:00:00.000029cpu: 0:00:00.000029 execType: jit_avx512_FP32
inception_4e/pool_proj/Wit... Status.EXECUTEDlayerType: Convolution        realTime: 0:00:00.000083cpu: 0:00:00.000083 execType: jit_avx512_1x1_FP32
inception_4e/relu_pool_proj   Status.NOT_RUN layerType: Relu               realTime: 0:00:00   cpu: 0:00:00        execType: undef     
inception_4e/5x5_reduce/Wi... Status.EXECUTEDlayerType: Convolution        realTime: 0:00:00.000034cpu: 0:00:00.000034 execType: jit_avx512_1x1_FP32
inception_4e/relu_5x5_reduce  Status.NOT_RUN layerType: Relu               realTime: 0:00:00   cpu: 0:00:00        execType: undef     
inception_4e/5x5/WithoutBi... Status.EXECUTEDlayerType: Convolution        realTime: 0:00:00.000092cpu: 0:00:00.000092 execType: jit_avx512_FP32
inception_4e/relu_5x5         Status.NOT_RUN layerType: Relu               realTime: 0:00:00   cpu: 0:00:00        execType: undef     
inception_4e/3x3_reduce/Wi... Status.EXECUTEDlayerType: Convolution        realTime: 0:00:00.000087cpu: 0:00:00.000087 execType: jit_avx512_1x1_FP32
inception_4e/relu_3x3_reduce  Status.NOT_RUN layerType: Relu               realTime: 0:00:00   cpu: 0:00:00        execType: undef     
inception_4e/3x3/WithoutBi... Status.EXECUTEDlayerType: Convolution        realTime: 0:00:00.000423cpu: 0:00:00.000423 execType: jit_avx512_FP32
inception_4e/relu_3x3         Status.NOT_RUN layerType: Relu               realTime: 0:00:00   cpu: 0:00:00        execType: undef     
inception_4e/1x1/WithoutBi... Status.EXECUTEDlayerType: Convolution        realTime: 0:00:00.000151cpu: 0:00:00.000151 execType: jit_avx512_1x1_FP32
inception_4e/relu_1x1         Status.NOT_RUN layerType: Relu               realTime: 0:00:00   cpu: 0:00:00        execType: undef     
inception_4e/output           Status.NOT_RUN layerType: Concat             realTime: 0:00:00   cpu: 0:00:00        execType: unknown_FP32
pool4/3x3_s2                  Status.EXECUTEDlayerType: MaxPool            realTime: 0:00:00.000034cpu: 0:00:00.000034 execType: jit_avx512_FP32
inception_5a/pool             Status.EXECUTEDlayerType: MaxPool            realTime: 0:00:00.000017cpu: 0:00:00.000017 execType: jit_avx512_FP32
inception_5a/pool_proj/Wit... Status.EXECUTEDlayerType: Convolution        realTime: 0:00:00.000050cpu: 0:00:00.000050 execType: jit_avx512_1x1_FP32
inception_5a/relu_pool_proj   Status.NOT_RUN layerType: Relu               realTime: 0:00:00   cpu: 0:00:00        execType: undef     
inception_5a/5x5_reduce/Wi... Status.EXECUTEDlayerType: Convolution        realTime: 0:00:00.000042cpu: 0:00:00.000042 execType: jit_avx512_1x1_FP32
inception_5a/relu_5x5_reduce  Status.NOT_RUN layerType: Relu               realTime: 0:00:00   cpu: 0:00:00        execType: undef     
inception_5a/5x5/WithoutBi... Status.EXECUTEDlayerType: Convolution        realTime: 0:00:00.000034cpu: 0:00:00.000034 execType: jit_avx512_FP32
inception_5a/relu_5x5         Status.NOT_RUN layerType: Relu               realTime: 0:00:00   cpu: 0:00:00        execType: undef     
inception_5a/3x3_reduce/Wi... Status.EXECUTEDlayerType: Convolution        realTime: 0:00:00.000060cpu: 0:00:00.000060 execType: jit_avx512_1x1_FP32
inception_5a/relu_3x3_reduce  Status.NOT_RUN layerType: Relu               realTime: 0:00:00   cpu: 0:00:00        execType: undef     
inception_5a/3x3/WithoutBi... Status.EXECUTEDlayerType: Convolution        realTime: 0:00:00.000163cpu: 0:00:00.000163 execType: jit_avx512_FP32
inception_5a/relu_3x3         Status.NOT_RUN layerType: Relu               realTime: 0:00:00   cpu: 0:00:00        execType: undef     
inception_5a/1x1/WithoutBi... Status.EXECUTEDlayerType: Convolution        realTime: 0:00:00.000110cpu: 0:00:00.000110 execType: jit_avx512_1x1_FP32
inception_5a/relu_1x1         Status.NOT_RUN layerType: Relu               realTime: 0:00:00   cpu: 0:00:00        execType: undef     
inception_5a/output           Status.NOT_RUN layerType: Concat             realTime: 0:00:00   cpu: 0:00:00        execType: unknown_FP32
inception_5b/pool             Status.EXECUTEDlayerType: MaxPool            realTime: 0:00:00.000014cpu: 0:00:00.000014 execType: jit_avx512_FP32
inception_5b/pool_proj/Wit... Status.EXECUTEDlayerType: Convolution        realTime: 0:00:00.000045cpu: 0:00:00.000045 execType: jit_avx512_1x1_FP32
inception_5b/relu_pool_proj   Status.NOT_RUN layerType: Relu               realTime: 0:00:00   cpu: 0:00:00        execType: undef     
inception_5b/5x5_reduce/Wi... Status.EXECUTEDlayerType: Convolution        realTime: 0:00:00.000039cpu: 0:00:00.000039 execType: jit_avx512_1x1_FP32
inception_5b/relu_5x5_reduce  Status.NOT_RUN layerType: Relu               realTime: 0:00:00   cpu: 0:00:00        execType: undef     
inception_5b/5x5/WithoutBi... Status.EXECUTEDlayerType: Convolution        realTime: 0:00:00.000047cpu: 0:00:00.000047 execType: jit_avx512_FP32
inception_5b/relu_5x5         Status.NOT_RUN layerType: Relu               realTime: 0:00:00   cpu: 0:00:00        execType: undef     
inception_5b/3x3_reduce/Wi... Status.EXECUTEDlayerType: Convolution        realTime: 0:00:00.000061cpu: 0:00:00.000061 execType: jit_avx512_1x1_FP32
inception_5b/relu_3x3_reduce  Status.NOT_RUN layerType: Relu               realTime: 0:00:00   cpu: 0:00:00        execType: undef     
inception_5b/3x3/WithoutBi... Status.EXECUTEDlayerType: Convolution        realTime: 0:00:00.000194cpu: 0:00:00.000194 execType: jit_avx512_FP32
inception_5b/relu_3x3         Status.NOT_RUN layerType: Relu               realTime: 0:00:00   cpu: 0:00:00        execType: undef     
inception_5b/1x1/WithoutBi... Status.EXECUTEDlayerType: Convolution        realTime: 0:00:00.000148cpu: 0:00:00.000148 execType: jit_avx512_1x1_FP32
inception_5b/relu_1x1         Status.NOT_RUN layerType: Relu               realTime: 0:00:00   cpu: 0:00:00        execType: undef     
inception_5b/output           Status.NOT_RUN layerType: Concat             realTime: 0:00:00   cpu: 0:00:00        execType: unknown_FP32
pool5/7x7_s1                  Status.EXECUTEDlayerType: AvgPool            realTime: 0:00:00.000013cpu: 0:00:00.000013 execType: jit_avx512_FP32
loss3/classifier              Status.EXECUTEDlayerType: FullyConnected     realTime: 0:00:00.003503cpu: 0:00:00.003503 execType: jit_gemm_FP32
prob                          Status.EXECUTEDlayerType: Softmax            realTime: 0:00:00.000007cpu: 0:00:00.000007 execType: jit_avx512_FP32
prob/sink_port_0              Status.NOT_RUN layerType: Result             realTime: 0:00:00   cpu: 0:00:00        execType: unknown_FP32
Total time:     0:00:00.014685 microseconds
Total CPU time: 0:00:00.014685 microseconds
```
* Status 包括可能的值：
    * EXECUTED - 层由独立原语执行，
    * NOT_RUN - 层不是由独立原语执行的，或者与另一个操作融合并在另一个层原语中执行。
* execType 包括具有特定后缀的推理原语。
    * 具有 8 位数据类型输入并以 8 位精度计算的层的后缀 I8
    * 以 32 位精度计算的层的后缀 FP32
    * unknown 用于推理引擎特定的 CPU 原语，这些原语不是英特尔 MKL-DNN 的一部分。意味着 CPU 内核，具有未知的 （例如，不是 AVX2 或 AVX512）加速路径。 

## 指定批量大小
### 默认批量大小为 1
```shell
$ benchmark_app -i catdog.jpg -m /data/wjj/openvino/ir/public/googlenet-v1/FP32/googlenet-v1.xml -d CPU -t 2
```
```
[Step 5/11] Resizing network to match image sizes and given batch
[ INFO ] Network batch size: 1
[Step 6/11] Configuring input of the model
[ INFO ] Model input 'data' precision u8, dimensions ([N,C,H,W]): 1 3 224 224
[ INFO ] Model output 'prob' precision f32, dimensions ([...]): 1 1000
[Step 11/11] Dumping statistics report
Count:          896 iterations
Duration:       2022.44 ms
Latency:
    Median:     17.71 ms
    AVG:        17.95 ms
    MIN:        17.04 ms
    MAX:        33.75 ms
Throughput: 443.03 FPS
```

### 指定批量大小为 2
```shell
$ benchmark_app -i catdog.jpg -m /data/wjj/openvino/ir/public/googlenet-v1/FP32/googlenet-v1.xml -d CPU -t 2 -b 2
```
```
[Step 5/11] Resizing network to match image sizes and given batch
[ INFO ] Reshaping model: 'data': {2,3,224,224}
[ INFO ] Reshape model took 2.23 ms
[ INFO ] Network batch size: 2
[Step 6/11] Configuring input of the model
[ INFO ] Model input 'data' precision u8, dimensions ([N,C,H,W]): 2 3 224 224
[ INFO ] Model output 'prob' precision f32, dimensions ([...]): 2 1000
[Step 11/11] Dumping statistics report
Count:          464 iterations
Duration:       2061.93 ms
Latency:
    Median:     34.52 ms
    AVG:        35.07 ms
    MIN:        32.75 ms
    MAX:        50.86 ms
Throughput: 450.06 FPS
```

可以看到在 CPU 上增加批量对于推理性能的提升非常有限。

## 参考资料
* [Benchmark Python* Tool](https://docs.openvino.ai/cn/latest/openvino_inference_engine_tools_benchmark_tool_README.html)
* [TUNING FOR PERFORMANCE - Getting Performance Numbers](https://docs.openvino.ai/latest/openvino_docs_MO_DG_Getting_Performance_Numbers.html)
* [性能优化指南](https://docs.openvino.ai/cn/latest/openvino_docs_optimization_guide_dldt_optimization_guide.html)
