---
layout: single
title:  "使用Detectron在自定义数据集上训练MaskRCNN"
date:   2019-09-01 00:00:00 +0800
categories: AI 图像识别
tags: [目标检测, Detectron, MaskRCNN, Docker]
---

## 拉取镜像 Detectron
``` bash
sudo docker pull gouchicao/detectron:latest
```

## 创建工程（COCO格式）
``` bash
└── helmet　　　　　　　　　　工程目录
    ├── images　　　　　　　 样本图片目录
    ├── helmet_train.json　训练的样本标注信息
    ├── helmet_val.json　　验证的样本标注信息
    ├── test               测试图片目录
    ├── predict            预测图片目录
    ├── model　　　　　　　　模型目录
    └── e2e_mask_rcnn_R-101-FPN_2x.yaml  网络配置文件
```

## 运行容器 Detectron，挂载工程目录。
``` bash
sudo docker run -it --runtime=nvidia --name detectron-helmet \
                -v /helmet-project-realpath:/detectron/project \
                gouchicao/detectron:latest
```

## 修复BBOX_XFORM_CLIP错误
``` bash
nano /detectron/detectron/utils/env.py 
```
``` txt
yaml_load = lambda x: yaml.load(x, Loader=yaml.Loader)
```

## 工程设置
1. 配置数据集
``` bash
nano /detectron/detectron/datasets/dataset_catalog.py
```
``` txt
_DATASETS = {
'coco_helmet_train': {
_IM_DIR: '/detectron/project/images',
_ANN_FN: '/detectron/project/helmet_train.json' 
},
'coco_helmet_val': {
_IM_DIR: '/detectron/project/images',
_ANN_FN: '/detectron/project/helmet_val.json' 
},
......
}
```

2. 修改网络配置文件
``` bash
nano /detectron/project/12_2017_baselines/e2e_mask_rcnn_R-101-FPN_2x.yaml
```
``` txt
MODEL:
  TYPE: generalized_rcnn
  CONV_BODY: FPN.add_fpn_ResNet101_conv5_body
  NUM_CLASSES: 2
  FASTER_RCNN: True
  MASK_ON: True
NUM_GPUS: 1
SOLVER:
  WEIGHT_DECAY: 0.0001
  LR_POLICY: steps_with_decay
  BASE_LR: 0.002
  GAMMA: 0.1
  MAX_ITER: 4000
  STEPS: [0, 3000, 4000]
FPN:
  FPN_ON: True
  MULTILEVEL_ROIS: True
  MULTILEVEL_RPN: True
FAST_RCNN:
  ROI_BOX_HEAD: fast_rcnn_heads.add_roi_2mlp_head
  ROI_XFORM_METHOD: RoIAlign
  ROI_XFORM_RESOLUTION: 7
  ROI_XFORM_SAMPLING_RATIO: 2
MRCNN:
  ROI_MASK_HEAD: mask_rcnn_heads.mask_rcnn_fcn_head_v1up4convs
  RESOLUTION: 28  # (output mask resolution) default 14
  ROI_XFORM_METHOD: RoIAlign
  ROI_XFORM_RESOLUTION: 14  # default 7
  ROI_XFORM_SAMPLING_RATIO: 2  # default 0
  DILATION: 1  # default 2
  CONV_INIT: MSRAFill  # default GaussianFill
TRAIN:
  WEIGHTS: https://dl.fbaipublicfiles.com/detectron/ImageNetPretrained/MSRA/R-101.pkl
  DATASETS: ('coco_helmet_train', 'coco_helmet_val')
  SCALES: (800,)
  MAX_SIZE: 1333
  BATCH_SIZE_PER_IM: 512
  RPN_PRE_NMS_TOP_N: 2000  # Per FPN level
TEST:
  DATASETS: ('coco_2014_minival',)
  SCALE: 800
  MAX_SIZE: 1333
  NMS: 0.5
  RPN_PRE_NMS_TOP_N: 1000  # Per FPN level
  RPN_POST_NMS_TOP_N: 1000
OUTPUT_DIR: .
```

## 训练模型
``` bash
python /detectron/tools/train_net.py \
       --cfg /detectron/project/e2e_mask_rcnn_R-101-FPN_2x.yaml \
       OUTPUT_DIR /detectron/project/model
```

## 测试模型
``` bash
python /detectron/tools/infer_simple.py \
       --cfg /detectron/project/e2e_mask_rcnn_R-101-FPN_2x.yaml \
       --output-dir /detectron/project/predict \
       --image-ext jpg \
       --wts /detectron/project/model/train/coco_helmet_train\:coco_helmet_train/generalized_rcnn/model_final.pkl \
       /detectron/project/test
```
