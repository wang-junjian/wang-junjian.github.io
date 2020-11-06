---
layout: post
title:  "使用YOLOv5训练自定义数据集"
date:   2020-11-04 00:00:00 +0800
categories: AI 图像识别
tags: [目标检测, YOLO, PyTorch, Docker, Shell, for, sed, head, wget]
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
├── inference           #推理
│   ├── images          #原图
│   └── output          #推理后的标注图片
└── 
```

## 构建环境
* 拉取镜像
```shell
$ docker pull ultralytics/yolov5:latest
```

* 运行容器
```shell
$ docker run --ipc=host --runtime=nvidia -it --name project_name-yolov5 \
    -v project_dir:/project ultralytics/yolov5:latest
```

## 拷贝模型网络和下载预模型
* 拷贝
```shell
$ mkdir /project/models
$ cp models/yolov5?.yaml /project/models
```

* 替换所有模型网络的类别
```shell
$ sed -i 's/nc: 80/nc: 2/g' /project/models/yolov5?.yaml
```

* 验证替换结果
```shell
$ head -n 2 /project/models/yolov5?.yaml
==> /project/models/yolov5l.yaml <==
# parameters
nc: 2  # number of classes
==> /project/models/yolov5m.yaml <==
# parameters
nc: 2  # number of classes
==> /project/models/yolov5s.yaml <==
# parameters
nc: 2  # number of classes
==> /project/models/yolov5x.yaml <==
# parameters
nc: 2  # number of classes
```

* 下载预模型
```shell
for v in 's' 'm' 'l' 'x'
do
  wget https://github.com/ultralytics/yolov5/releases/download/v3.1/yolov5$v.pt -P /project/models
done
```

## 训练
* 删除之前的训练日志
```shell
$ rm -r /project/runs-*
```

* 训练指定版本
```shell
$ python train.py --epoch 1 --batch-size 16 --data /project/data.yaml \
    --cfg /project/models/yolov5s.yaml --weights /project/models/yolov5s.pt \
    --logdir /project/runs
```

* 批量训练多个版本
```shell
for v in 's' 'm' 'l' 'x'
do
  python train.py --epoch 100 --batch-size 64 --data /project/data.yaml \
    --cfg /project/models/yolov5$v.yaml --weights /project/models/yolov5$v.pt \
    --logdir /project/runs-$v
done
```

## 推理
* 指定版本
```shell
$ python detect.py --weights /project/runs/exp0/weights/best.pt --conf 0.4 \
    --source /project/inference/images --save-dir /project/inference/output
```

* 批量多个版本
```shell
for v in 's' 'm' 'l' 'x'
do
  python detect.py --weights /project/runs-$v/exp0/weights/best.pt --conf 0.4 \
    --source /project/inference/images --save-dir /project/inference/output-$v
done
```

## 参考资料
* [yolov5](https://github.com/ultralytics/yolov5)
* [Train Custom Data](https://github.com/ultralytics/yolov5/wiki/Train-Custom-Data)
* [Multi-GPU Training](https://github.com/ultralytics/yolov5/issues/475)
* [ERROR: Unexpected bus error encountered in worker. This might be caused by insufficient shared memory (shm).](https://github.com/ultralytics/yolov3/issues/283)
* [Dataloader中的num_workers设置与docker的shared memory相关问题](https://zhuanlan.zhihu.com/p/143914966)
