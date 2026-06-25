---
layout: single
title:  "Ultralytics YOLOv8"
date:   2023-03-24 08:00:00 +0800
categories: [框架与库, 容器与云原生]
tags: [yolo, comet, clearml]
---

## Ultralytics
* [Ultralytics YOLOv8](https://github.com/ultralytics/ultralytics)
* [Ultralytics YOLOv8 Docs](https://docs.ultralytics.com)

## 构建环境
### [Ultralytics 镜像](https://hub.docker.com/r/ultralytics/ultralytics)
* GPU
```shell
docker pull ultralytics/ultralytics:latest
```

* CPU
```shell
docker pull ultralytics/ultralytics:latest-cpu
```

* Apple Silicon
```shell
docker pull ultralytics/ultralytics:latest-arm64
```

### 本地安装
```shell
pip install ultralytics
```


## 基于 COCO128 数据集的目标检测范例
### 运行容器
```shell
git clone https://github.com/ultralytics/ultralytics.git
docker run --runtime=nvidia -it --name ultralytics -v `pwd`/ultralytics:/usr/src/ultralytics ultralytics/ultralytics:latest
```

### yolo 命令的使用参数
```
yolo TASK MODE ARGS
```
* [yolo Usage](https://docs.ultralytics.com/usage/cfg/)

### 训练模型
```shell
yolo train data=coco128.yaml model=yolov8n.pt
```

### 训练可视化（Comet）
```shell
pip install comet_ml
export COMET_API_KEY=xxx
yolo train data=coco128.yaml model=yolov8n.pt project=coco128
```
* project 指定项目名字，在 Comet 中会自动生成，默认使用的：yolov8

[![](https://camo.githubusercontent.com/84f0493939e0c4de4e6dbe113251b4bfb5353e57134ffd9fcab6b8714514d4d1/68747470733a2f2f636f6c61622e72657365617263682e676f6f676c652e636f6d2f6173736574732f636f6c61622d62616467652e737667)](https://colab.research.google.com/drive/1RG0WOQyxlDlo5Km8GogJpIEJlg_5lyYO?usp=sharing)


### ClearML
* 安装
```shell
pip install clearml
```

* 配置
```shell
clearml-init
```
* 集成
```py
from clearml import Task
task = Task.init(project_name="my project", task_name="my task")
```

### 评估模型
```shell
yolo val data=coco128.yaml model=runs/detect/train/weights/best.pt project=coco128
```

### 预测
```shell
yolo predict data=coco128.yaml model=runs/detect/train/weights/best.pt source=project/images/val/ save=true
```
* save=true 保存预测结果（runs/detect/predict）
* show=true 展示预测结果（UI Window）

对检测出来的结果裁剪分类保存
```shell
yolo predict data=project/data.yaml model=runs/detect/train/weights/best.pt source=project/images/val/ save_crop=true
```
* classes=0 或 classes=[0,2,5] 过滤指定的类别

### 导出模型
```shell
yolo export model=yolov8s.pt format=onnx
```

导出的模型格式

| Format        | format Argument | Model                   | Metadata |
| ------------- | --------------- | ----------------------- | :------: |
| PyTorch       |                 | yolov8n.pt              | ✅ |
| TorchScript   | torchscript     | yolov8n.torchscript     | ✅ |
| ONNX          | onnx            | yolov8n.onnx            | ✅ |
| OpenVINO      | openvino        | yolov8n_openvino_model/ | ✅ |
| TensorRT      | engine          | yolov8n.engine          | ✅ |
| CoreML        | coreml          | yolov8n.mlmodel         | ✅ |
| TF SavedModel | saved_model     | yolov8n_saved_model/    | ✅ |
| TF GraphDef   | pb              | yolov8n.pb              | ❌ |
| TF Lite       | tflite          | yolov8n.tflite          | ✅ |
| TF Edge TPU   | edgetpu         | yolov8n_edgetpu.tflite  | ✅ |
| TF.js	        | tfjs            | yolov8n_web_model/      | ✅ |
| PaddlePaddle  | paddle          | yolov8n_paddle_model/   | ✅ |

## 基于 mnist160 数据集的分类
```shell
yolo classify train data=mnist160 model=yolov8n-cls.pt epochs=100 imgsz=64
yolo classify val data=mnist160 model=runs/classify/train/weights/best.pt
```

## [Benchmark](https://docs.ultralytics.com/modes/benchmark/)
### GPU
```shell
yolo benchmark model=yolov8n.pt imgsz=640 half=False device=0
```
```
Ultralytics YOLOv8.0.58 🚀 Python-3.10.9 torch-2.0.0 CUDA:0 (Tesla T4, 15110MiB)
Server ✅ (64 CPUs, 251.6 GB RAM, 381.2/548.6 GB disk)

Benchmarks complete for yolov8n.pt on coco128.yaml at imgsz=640 (964.68s)
                   Format Status❔  Size (MB)  metrics/mAP50-95(B)  Inference time (ms/im)
0                 PyTorch       ✅        6.2               0.4478                   13.39
1             TorchScript       ✅       12.4               0.4525                    5.33
2                    ONNX       ✅       12.2               0.4525                   10.97
3                OpenVINO       ❌        0.0                  NaN                     NaN
4                TensorRT       ✅       16.1               0.4525                    4.80
5                  CoreML       ❌        0.0                  NaN                     NaN
6   TensorFlow SavedModel       ✅       30.6               0.4525                   90.53
7     TensorFlow GraphDef       ✅       12.3               0.4525                   80.57
8         TensorFlow Lite       ❌        0.0                  NaN                     NaN
9     TensorFlow Edge TPU       ❌        0.0                  NaN                     NaN
10          TensorFlow.js       ❌        0.0                  NaN                     NaN
11           PaddlePaddle       ✅       24.4               0.4525                  334.54
```

### CPU
```shell
yolo benchmark model=yolov8n.pt imgsz=640 half=False device=cpu
```
```
Ultralytics YOLOv8.0.58 🚀 Python-3.10.9 torch-2.0.0 CPU
Setup complete ✅ (64 CPUs, 251.6 GB RAM, 383.1/548.6 GB disk)

Benchmarks complete for yolov8n.pt on coco128.yaml at imgsz=640 (647.94s)
                   Format Status❔  Size (MB)  metrics/mAP50-95(B)  Inference time (ms/im)
0                 PyTorch       ✅        6.2               0.4478                  186.26
1             TorchScript       ✅       12.4               0.4525                  231.86
2                    ONNX       ✅       12.2               0.4525                   61.08
3                OpenVINO       ✅       12.3               0.4525                   21.58
4                TensorRT       ❌        0.0                  NaN                     NaN
5                  CoreML       ❎       12.1                  NaN                     NaN
6   TensorFlow SavedModel       ✅       30.6               0.4525                   86.86
7     TensorFlow GraphDef       ✅       12.3               0.4525                   80.34
8         TensorFlow Lite       ✅       12.2               0.4525                  190.41
9     TensorFlow Edge TPU       ❌       40.9                  NaN                     NaN
10          TensorFlow.js       ❌       12.3                  NaN                     NaN
11           PaddlePaddle       ❌        0.0                  NaN                     NaN
```

## 工具
### 标注数据
* [labelImg](https://github.com/heartexlabs/labelImg)
* [Label Studio](https://github.com/heartexlabs/label-studio)


## 参考资料
* [Train Custom Data](https://github.com/ultralytics/yolov5/wiki/Train-Custom-Data)
* [How do I save the images of the yolov8 training predictions?](https://github.com/ultralytics/ultralytics/issues/375)
* [YOLO: Real-Time Object Detection](https://pjreddie.com/darknet/yolo/)
* [yolov5](https://github.com/ultralytics/yolov5)
* [Ultralytics YOLOv8](https://github.com/ultralytics/ultralytics)
* [Change 'Save' location for prediction #1805](https://github.com/ultralytics/ultralytics/issues/1805)
* [Metal](https://developer.apple.com/metal/)
* [ONNX Runtime](https://onnxruntime.ai/)
* [YOLOv8 深度详解！一文看懂，快速上手](https://zhuanlan.zhihu.com/p/598566644)
* [Train YOLOv8 on Custom Dataset – A Complete Tutorial](https://learnopencv.com/train-yolov8-on-custom-dataset/)
* [ultralytics/JSON2YOLO](https://github.com/ultralytics/JSON2YOLO)
* [YOLOv8 Ultralytics: State-of-the-Art YOLO Models](https://learnopencv.com/ultralytics-yolov8/)
* [Python Design Patterns - Singleton](https://www.tutorialspoint.com/python_design_patterns/python_design_patterns_singleton.htm)
* [How to implement a subscriptable class in Python (subscriptable class, not subscriptable object)?](https://stackoverflow.com/questions/11469025/how-to-implement-a-subscriptable-class-in-python-subscriptable-class-not-subsc)
