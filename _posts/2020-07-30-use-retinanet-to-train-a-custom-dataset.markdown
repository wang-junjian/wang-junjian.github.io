---
layout: post
title:  "使用RetinaNet算法训练自定义数据集"
date:   2020-07-30 00:00:00 +0800
categories: AI 图像识别
tags: [目标检测, TensorFlow, Docker, RetinaNet, Keras, TensorBoard, Dockerfile]
---

## 训练自己的数据集
### 标注数据
[LabelImg](https://github.com/tzutalin/labelImg)

```bash
#标注后的目录结构
project
└── labelimg
    ├── 20190128155421222575013.jpg
    ├── 20190128155421222575013.xml
    ├── 20190128155703035712899.jpg
    ├── 20190128155703035712899.xml
    ├── 20190129091126392737624.jpg
    └── 20190129091126392737624.xml
```

### 构建镜像
* 拉取
```bash
$ sudo docker pull gouchicao/keras-retinanet:latest
```

* 手动构建
```dockerfile
FROM gouchicao/tensorflow:2.2.0-gpu-jupyter-opencv4-pillow-wget-curl-git-nano
LABEL maintainer="wang-junjian@qq.com"
WORKDIR /
RUN mkdir -p /root/.keras/models/ && \
    wget -O /root/.keras/models/ResNet-50-model.keras.h5 https://github.com/fizyr/keras-models/releases/download/v0.0.1/ResNet-50-model.keras.h5
RUN git clone --depth 1 --recurse-submodules https://github.com/gouchicao/keras-retinanet.git
WORKDIR /keras-retinanet/keras-retinanet
# 提前安装指定版本 keras==2.3.1 解决错误 TypeError: type object got multiple values for keyword argument 'training'
RUN pip install keras==2.3.1 && \
    pip install . && \
    python setup.py build_ext --inplace
WORKDIR /keras-retinanet
```

### 模型训练
* 运行容器
```bash
$ sudo docker run -it --runtime=nvidia --name=keras-retinanet -p 8888:8888 -p 6006:6006 \
                -v /home/wjunjian/ailab/datasets/helmet:/keras-retinanet/project \
                gouchicao/keras-retinanet bash
```

* voc转csv格式，分隔数据集
```bash
$ python voc2csv.py --data_dir=project/labelimg/ --output_dir=project/dataset
```

```bash
#生成的目录结构
project
├── dataset
│   ├── class.csv
│   ├── train
│   │   ├── 20190128155421222575013.jpg
│   │   ├── 20190128155421222575013.xml
│   │   ├── 20190129091126392737624.jpg
│   │   └── 20190129091126392737624.xml
│   ├── train.csv
│   ├── val
│   │   ├── 20190128155703035712899.jpg
│   │   └── 20190128155703035712899.xml
│   └── val.csv
└── labelimg
    ├── 20190128155421222575013.jpg
    ├── 20190128155421222575013.xml
    ├── 20190128155703035712899.jpg
    ├── 20190128155703035712899.xml
    ├── 20190129091126392737624.jpg
    └── 20190129091126392737624.xml
```

* 训练
```bash
$ python keras-retinanet/keras_retinanet/bin/train.py --tensorboard-dir=project/logs --snapshot-path project/snapshots \
    csv project/dataset/train.csv project/dataset/class.csv --val-annotations project/dataset/val.csv
$ ll -h project/models/resnet50_csv_01.h5
-rw-r--r-- 1 root     root     417M 7月  27 22:58 resnet50_csv_01.h5
```

### 训练过程可视化 TensorBoard
```bash
$ tensorboard --logdir=project/logs --bind_all
```
在本机浏览器中访问网址:[http://localhost:6006](http://localhost:6006)
![](/images/2020/tensorboard.png)

### 模型评估
```bash
$ python keras-retinanet/keras_retinanet/bin/evaluate.py csv project/dataset/val.csv project/dataset/class.csv \
    project/snapshots/resnet50_csv_01.h5 --convert-model
```

### 模型转换
```bash
$ mkdir project/inference
$ python keras-retinanet/keras_retinanet/bin/convert_model.py --no-class-specific-filter \
    project/snapshots/resnet50_csv_01.h5 project/inference/model.h5
$ ll -h project/inference/model.h5
-rw-r--r-- 1 root     root     140M 7月  27 23:14 model.h5
```

### 模型预测
```bash
$ python predict.py --model project/inference/model.h5 \
    --class_csv project/dataset/class.csv \
    --data_dir project/test \
    --predict_dir project/predict
```

## 参考资料
* [Keras RetinaNet 工程实践](https://github.com/gouchicao/keras-retinanet)
* [Git 工具 - 子模块](https://git-scm.com/book/zh/v2/Git-%E5%B7%A5%E5%85%B7-%E5%AD%90%E6%A8%A1%E5%9D%97)
* [How to copy multiple files in one layer using a Dockerfile?](https://stackoverflow.com/questions/30256386/how-to-copy-multiple-files-in-one-layer-using-a-dockerfile)
* [How to git clone only the latest revision](https://codeyarns.com/2014/06/07/how-to-git-clone-only-the-latest-revision/)
* [How to “git clone” including submodules?](https://stackoverflow.com/questions/3796927/how-to-git-clone-including-submodules)
* [物件偵測 - RetinaNet 介紹](https://medium.com/@gino6178/%E7%89%A9%E4%BB%B6%E5%81%B5%E6%B8%AC-retinanet-%E4%BB%8B%E7%B4%B9-dda4100673bb)
* [Object Detection on Custom Dataset with TensorFlow 2 and Keras using Python](https://www.curiousily.com/posts/object-detection-on-custom-dataset-with-tensorflow-2-and-keras-using-python/)
* [An Introduction to Implementing Retinanet in Keras for Multi Object Detection on Custom Dataset](https://medium.com/@tabdulwahabamin/an-introduction-to-implementing-retinanet-in-keras-for-multi-object-detection-on-custom-dataset-be746024c653)
* [RetinaNet: Custom Object Detection training with 5 lines of code](https://towardsdatascience.com/retinanet-custom-object-detection-training-with-5-lines-of-code-37442640d142)
* [RetinaNet和Focal Loss论文笔记](http://www.chenjianqu.com/show-124.html)
