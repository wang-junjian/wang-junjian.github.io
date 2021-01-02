---
layout: post
title:  "使用YOLOv5训练自定义数据集"
date:   2020-11-04 00:00:00 +0800
categories: AI 图像识别
tags: [目标检测, YOLO, YOLOv5, PyTorch, Docker, Shell, for, sed, head]
---

> 在 Ubuntu20.04 系统上使用4张GPU卡基于容器训练模型。

## 准备数据
```shell
project
├── data.yaml           #数据集配置文件
├── models              #网络模型（可以使用下面的脚本自动生成）
│   ├── yolov5s.yaml    #Small
│   ├── yolov5m.yaml    #Medium
│   ├── yolov5l.yaml    #Large
│   └── yolov5x.yaml    #XLarge
├── images              #图片
│   ├── train           #训练集
│   │   ├── 000001.jpg
│   │   ├── 000002.jpg
│   │   └── 000003.jpg
│   └── val             #验证集
│       ├── 000010.jpg
│       └── 000011.jpg
├── labels              #YOLO格式的标注
│   ├── train           #训练集
│   │   ├── 000001.txt
│   │   ├── 000002.txt
│   │   └── 000003.txt
│   └── val             #验证集
│       ├── 000010.txt
│       └── 000011.txt
├── test                #测试图片
└── output              #推理后的标注图片
```

## 构建环境
* 拉取镜像
```shell
$ docker pull ultralytics/yolov5:latest
```

* 运行容器
```shell
$ docker run --ipc=host --runtime=nvidia -it --name project_name-yolov5 \
    -v project_dir:/usr/src/app/project ultralytics/yolov5:latest
```

## 拷贝模型网络和下载预模型
* 拷贝
```shell
$ mkdir project/models
$ cp models/yolov5?.yaml project/models
```

* 替换所有模型网络的类别
```shell
$ sed -i 's/nc: 80/nc: 2/g' project/models/yolov5?.yaml
```

* 验证替换结果
```shell
$ head -n 2 project/models/yolov5?.yaml
==> project/models/yolov5l.yaml <==
# parameters
nc: 2  # number of classes
==> project/models/yolov5m.yaml <==
# parameters
nc: 2  # number of classes
==> project/models/yolov5s.yaml <==
# parameters
nc: 2  # number of classes
==> project/models/yolov5x.yaml <==
# parameters
nc: 2  # number of classes
```

* 下载预模型
```shell
$ bash weights/download_weights.sh
$ cp yolov5?.pt project/models/
```

## 配置训练数据集信息
* nano project/data.yaml
```yaml
# train and val data as 1) directory: path/images/, 2) file: path/images.txt, or 3) list: [path1/images/, path2/images/]
train: project/images/train/
val: project/images/val/

# number of classes
nc: 2

# class names
names: ['close', 'open']
```

## 训练
* 删除之前的训练日志
```shell
$ rm -r project/runs*
```

* 训练指定版本
```shell
$ python train.py --epoch 50 --batch-size 16 --data project/data.yaml \
    --cfg project/models/yolov5s.yaml --weights project/models/yolov5s.pt \
    --project project/runs/train
```

* 批量训练多个版本
```shell
for v in 's' 'm' 'l' 'x'
do
  python train.py --epoch 100 --batch-size 64 --data project/data.yaml \
    --cfg project/models/yolov5$v.yaml --weights project/models/yolov5$v.pt \
    --project project/runs-$v/train
done
```

## 推理
* 指定版本
```shell
$ python detect.py --weights project/runs/train/exp/weights/best.pt \
    --source project/test --project project/runs/detect
```

* 批量多个版本
```shell
for v in 's' 'm' 'l' 'x'
do
  python detect.py --weights project/runs-$v/train/exp/weights/best.pt \
    --source project/test --project project/runs-$v/detect
done
```

### 推理参数
* 指定固定的输出目录（--exist-ok --name）
```shell
$ python detect.py --weights project/runs/train/exp/weights/best.pt \
    --source project/test --project project/output \
    --exist-ok --name ''
```

* 输出YOLO格式的标注数据（--save-txt）
```shell
$ python detect.py --weights project/runs/train/exp/weights/best.pt \
    --source project/test --project project/output \
    --exist-ok --name '' --save-txt
```

* 过滤类别（--classes）
```shell
$ python detect.py --weights project/runs/train/exp/weights/best.pt \
    --source project/test --project project/output \
    --exist-ok --name '' --class 0 1
```

## 参考资料
* [yolov5](https://github.com/ultralytics/yolov5)
* [Train Custom Data](https://github.com/ultralytics/yolov5/wiki/Train-Custom-Data)
* [Multi-GPU Training](https://github.com/ultralytics/yolov5/issues/475)
* [ERROR: Unexpected bus error encountered in worker. This might be caused by insufficient shared memory (shm).](https://github.com/ultralytics/yolov3/issues/283)
* [Dataloader中的num_workers设置与docker的shared memory相关问题](https://zhuanlan.zhihu.com/p/143914966)
