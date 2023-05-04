---
layout: post
title:  "Ultralytics Hub 快速入门"
date:   2023-03-30 08:00:00 +0800
categories: UltralyticsHub
tags: [Quickstart, YOLO, Dataset, Train, Deploy]
---

## 准备数据集
### 目录结构
![](/images/2023/ultralytics-hub/dataset-dir.jpg)

### data.yaml
```yaml
train: ../train/images
val: ../valid/images
test: ../test/images

nc: 1
names: ['logo']
```

### 压缩成 zip 文件

## 登录 [Ultralytics Hub](https://hub.ultralytics.com)

## Projects
### 创建项目
![](/images/2023/ultralytics-hub/projects-create.jpg)

## Datasets
### 上传数据集
![](/images/2023/ultralytics-hub/datasets-upload.jpg)

### 数据集图像
![](/images/2023/ultralytics-hub/datasets-images.jpg)

### 数据集概貌
![](/images/2023/ultralytics-hub/datasets-overview.jpg)

## Train
### 选择数据集
![](/images/2023/ultralytics-hub/train1.jpg)

### 选择模型
![](/images/2023/ultralytics-hub/train2.jpg)

### 选择训练参数
![](/images/2023/ultralytics-hub/train3.jpg)

### Google Colab 训练模型
使用上图的 API key 替换 PASTE_API_KEY_HERE

![](/images/2023/ultralytics-hub/train4.jpg)

### Done
![](/images/2023/ultralytics-hub/train5.jpg)

## Models
![](/images/2023/ultralytics-hub/models.jpg)

### 模型训练的性能指标
![](/images/2023/ultralytics-hub/models-train.jpg)

### 模型测试
![](/images/2023/ultralytics-hub/models-preview.jpg)

### 模型部署
![](/images/2023/ultralytics-hub/models-deploy.jpg)

## 参考资料
* [Ultralytics Hub](https://hub.ultralytics.com)
* [ultralytics/hub/coco6.zip](https://github.com/ultralytics/hub/blob/master/coco6.zip)
* [使用Neural Magic加速YOLO推理速度](https://chtseng.wordpress.com/2022/12/15/使用neural-magic加速yolo推理速度/)
* [How to OCR with Tesseract, OpenCV and Python](https://nanonets.com/blog/ocr-with-tesseract/)
* [Newbie’s Deep Learning Project to Recognize Handwritten Digit](https://www.analyticsvidhya.com/blog/2021/11/newbies-deep-learning-project-to-recognize-handwritten-digit/)
* [Digit recognition App (Streamlit) trained on the MNIST_Plus dataset using PyTorch CNN model](https://www.bragitoff.com/2022/01/digit-recognition-app-streamlit-trained-on-the-mnist_plus-dataset-using-pytorch-cnn-model/)
