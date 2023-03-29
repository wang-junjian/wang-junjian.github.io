---
layout: post
title:  "Get Started YOLOv5"
date:   2022-05-01 08:00:00 +0800
categories: YOLOv5
tags: [YOLO, wandb, TensorBoard]
---

## [Quick Start Examples](https://github.com/ultralytics/yolov5#quick-start-examples)

### Install
```shell
# clone
git clone https://github.com/ultralytics/yolov5
cd yolov5

# create virtual python environments
python -m venv yolov5_env
source yolov5_env/bin/activate
python -m pip install --upgrade pip

# install
pip install -r requirements.txt
```

### Inference
```py
import torch

# Model
model = torch.hub.load('ultralytics/yolov5', 'yolov5s')  # or yolov5m, yolov5l, yolov5x, custom

# Images
img = 'https://ultralytics.com/images/zidane.jpg'  # or file, Path, PIL, OpenCV, numpy, list

# Inference
results = model(img)

# Results
results.print()  # or .show(), .save(), .crop(), .pandas(), etc.
results.show()
```

### Inference with detect.py
```shell
python detect.py --source 0  # webcam
                          img.jpg  # image
                          vid.mp4  # video
                          path/  # directory
                          path/*.jpg  # glob
                          'https://youtu.be/Zgi9g1ksQHc'  # YouTube
                          'rtsp://example.com/media.mp4'  # RTSP, RTMP, HTTP stream
```

## [Train Custom Data](https://github.com/ultralytics/yolov5/wiki/Train-Custom-Data)
![](/images/2022/yolov5/train-on-custom-data.png)

### 1. 创建数据集
这里使用 yolov5 自带的 data/coco128.yaml 小型数据集

### 2. 选择模型
选择预训练模型，这里选择 [YOLOv5s](https://github.com/ultralytics/yolov5/blob/master/models/yolov5s.yaml)。

![](/images/2022/yolov5/model_comparison.png)

### 3. 训练
```shell
python train.py --img 640 --batch 16 --epochs 10 --data coco128.yaml --weights yolov5s.pt
```

训练结果存储在目录 ```runs/train/```

### 4. 可视化
#### wandb
需要训练前安装。
```shell
pip install wandb

wandb login
```

浏览器中访问：[https://wandb.ai/<username>](https://wandb.ai)

![](https://user-images.githubusercontent.com/26833433/135390767-c28b050f-8455-4004-adb0-3b730386e2b2.png)

#### TensorBoard
##### 本地查看
```shell
tensorboard --logdir runs/train
```
浏览器中访问：[http://localhost:6006/](http://localhost:6006/)

##### 公开服务，IP暴露到网络上，其它机器可以访问。
```shell
tensorboard --logdir runs/train --bind_all
```
浏览器中访问：http://server_ip:6006/

![](https://img-blog.csdnimg.cn/20210422112215790.png)

## 参考资料
* [YOLOv5](https://github.com/ultralytics/yolov5)
* [Models](https://github.com/ultralytics/yolov5/tree/master/models)
* [Releases](https://github.com/ultralytics/yolov5/releases)
* [目标检测中的mAP是什么含义？](https://www.zhihu.com/question/53405779)
