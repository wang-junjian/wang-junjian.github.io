---
layout: post
title:  "AI 数据集打包发布"
date:   2021-04-15 00:00:00 +0800
categories: AI
tags: [Shell]
---

## 数据集打包目录结构
```
ai-project/
├── labelimg
│   ├── 1.jpg
│   ├── 1.xml
│   ├── 2.jpg
│   ├── 2.xml
│   ├── 3.jpg
│   ├── 3.xml
│   ├── 4.jpg
│   └── 4.xml
├── classes.txt
├── data.yaml
├── images
│   ├── train
│   │   ├── 1.jpg
│   │   └── 2.jpg
│   └── val
│       ├── 3.jpg
│       └── 4.jpg
└── labels
    ├── train
    │   ├── 1.txt
    │   └── 2.txt
    └── val
        ├── 3.txt
        └── 4.txt
```

## 打包
```shell
DATE=$(date '+%Y-%m-%d')
tar cvf sign-yolo-$DATE.tar labelimg/ classes.txt images/ labels data.yaml
```

## 上传数据集服务器
```shell
DATASET_SERVER_PATH=username@ip:/data/datasets
scp sign-yolo-$DATE.tar $DATASET_SERVER_PATH
```
