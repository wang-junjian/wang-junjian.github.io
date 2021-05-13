---
layout: post
title:  "构建YOLOv4容器应用在自定义数据集上"
date:   2020-06-06 00:00:00 +0800
categories: AI 图像识别
tags: [目标检测, Darknet, YOLO]
---

## 构建YOLOv4容器
* 编写Dockerfile

```dockerfile
FROM nvidia/cuda:10.0-cudnn7-devel-ubuntu18.04
LABEL maintainer="wang-junjian@qq.com"

#auto install tzdata(opencv depend)
ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y \
    git wget nano \
    libopencv-dev python3-opencv \
    && rm -rf /var/lib/apt/lists/*

#set your localtime
RUN ln -fs /usr/share/zoneinfo/Asia/Shanghai /etc/localtime

WORKDIR /
RUN git clone https://github.com/AlexeyAB/darknet.git

WORKDIR /darknet

#pre-trained weights-file for training
RUN wget https://github.com/AlexeyAB/darknet/releases/download/darknet_yolo_v3_optimal/yolov4.conv.137

#build darknet for GPU
RUN make GPU=1 CUDNN=1 CUDNN_HALF=1 OPENCV=1 LIBSO=1 && rm -rf obj

EXPOSE 8090

ENTRYPOINT ["bash"]
```

* 构建容器
```bash
docker build darknet:latest-gpu-yolov4 .
```

## 创建工程
* 工程目录结构
```txt
├── yolov4.conv.137　　　　　　  预训练模型
├── darknet
└── project   　　　　　　　　　　工程目录
    ├── backup　　　　　　　　　　存储模型训练时权重值
    ├── cfg　　　　　　　　　　　　配置目录
    │   ├── train.txt　　　　　　存储用于训练的图像路径
    │   ├── valid.txt　　　　　　存储用于验证的图像路径
    │   ├── voc.data　　　　　　 配置文件
    │   ├── voc.names　　　　　　标签名
    │   └── yolov4.cfg　　　　　 YOLOv4神经网络文件
    ├── data
    │   └── labels　　　　　　　　预测时用于显示标签名字
    │       ├── 100_0.png
    │       ├── 100_1.png
    │       ├── ......
    │       └── make_labels.py
    ├── predictions　　　　　　　 预测后的图像
    │   └── IMG_9256.jpg
    ├── test　　　　　　　 测试图像
    │   └── IMG_9256.jpg
    ├── weights
    │   └── yolov4_final.weights 训练出来的模型
    └── images　　　　　　　　　　　  图像样本集
        ├── IMG_9255.JPG
        ├── IMG_9255.txt
        ├── IMG_9263.JPG
        ├── IMG_9263.txt
        ├── IMG_9266.JPG
        ├── IMG_9266.txt
        ├── IMG_9280.JPG
        └── IMG_9280.txt
```

* 训练的样本：train.txt
```txt
images/IMG_9255.JPG
images/IMG_9266.JPG
images/IMG_9280.JPG
```

* 验证的样本：valid.txt
```txt
images/IMG_9263.JPG
```

* 标注类型：voc.names
```txt
close
open
```

* 配置文件：voc.data
```txt
classes= 2
train  = cfg/train.txt
valid  = cfg/valid.txt
names = cfg/voc.names
backup = weights
```

* 修改YOLO神经网络文件：yolov4.cfg

```yaml
2行：batch=8
3行：subdivisions=8
5行：width=512
6行：height=512
#上面几行的修改主要是为了在GTX1060 6G的显卡上能够运行

19行：max_batches=2000

961行：filters=21    #(classes + 5)*3
968行：classes=2
1049行：filters=21
1056行：classes=2
1137行：filters=21
1144行：classes=2
```

* 使用LabelImg标注图像样本集
```bash
#python3 labelImg.py [图像目录] [标注名字文件] [标注目录]
python3 labelImg.py project/yolos/ project/cfg/yolo.names
```

## 在容器中运行YOLOv4
```bash
#设置工程目录的环境变量
project_dir=""
docker run --runtime=nvidia -it --name=darknet-yolov4 --volume=$project_dir:/darknet/project -p 8090:8090 darknet:latest-gpu-yolov4

#使用本机的时区替换容器内的时区
docker run --runtime=nvidia -it --name=darknet-yolov4 --volume=/etc/localtime:/etc/localtime:ro　--volume=$project_dir:/darknet/project -p 8090:8090 darknet:latest-gpu-yolov4
```

## 训练
* mjpeg_port 训练过程可视化，通过访问http://127.0.0.1:8090/查看。
```bash
cd project
../darknet detector train cfg/voc.data cfg/yolov4.cfg ../yolov4.conv.137 -mjpeg_port 8090 -map -dont_show
```

## 预测
* thresh 设置阈值
```bash
../darknet detector test cfg/voc.data cfg/yolov4.cfg weights/yolov4_final.weights test/IMG_9256.JPG
../darknet detector test cfg/voc.data cfg/yolov4.cfg weights/yolov4_final.weights test/IMG_9256.JPG -thresh 0.5
```

## 参考资料
* [YOLOv4 - Neural Networks for Object Detection](https://github.com/AlexeyAB/darknet)
* [YOLOv4 pre-release](https://github.com/AlexeyAB/darknet/releases)
* [YOLOv4](https://medium.com/@jonathan_hui/yolov4-c9901eaa8e61)
* [YOLOv4_Tutorial](https://colab.research.google.com/drive/1CZHDZu-goOuR-vomkvkpl9gTlEFKglKa)
* [YOLOv4-Darknet-Roboflow](https://colab.research.google.com/drive/1mzL6WyY9BRx4xX476eQdhKDnd_eixBlG)
* [YOLOv4重磅发布，五大改进，二十多项技巧实验，堪称最强目标检测万花筒(附论文+代码下载）](https://aijishu.com/a/1060000000109128)
* [A Gentle Introduction to YOLO v4 for Object detection in Ubuntu 20.04](https://robocademy.com/2020/05/01/a-gentle-introduction-to-yolo-v4-for-object-detection-in-ubuntu-20-04/)
* [如何解决神经网络训练时loss不下降的问题](https://blog.ailemon.me/2019/02/26/solution-to-loss-doesnt-drop-in-nn-train/)
* [YOLOv4：目标检测（windows和Linux下Darknet 版本）实施](https://www.cnblogs.com/wujianming-110117/p/12940914.html)
* [windows下训练yolo时出现CUDA Error: out of memory问题的解决](https://blog.csdn.net/qq_33485434/article/details/80432054)
* [小白train自己的yolo-v4](https://mc.ai/小白train自己的yolo-v4/)
* [在自动化运维中设置apt-get install tzdata的noninteractive方法](https://blog.csdn.net/taiyangdao/article/details/80512997)
* [设置容器时区跟宿主机一致](https://www.jianshu.com/p/707ae76730ce)
