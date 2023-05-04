---
layout: post
title:  "Roboflow 快速入门"
date:   2023-03-27 08:00:00 +0800
categories: Roboflow
tags: [Quickstart, Label, Train, Deploy]
---

## 创建工作区
在 Workspaces 侧边栏单击 ”Add Workspace“。

工作区是团队可以协作创建、管理和标记数据集以及训练和部署模型的地方。

### 创建项目
单击 “Create New Project”

![](/images/2023/roboflow/create-project.jpg)

项目的菜单项

![](/images/2023/roboflow/project-menu.jpg)

#### Upload（上传数据集）
支持直接上传标注好的数据集。

![](/images/2023/roboflow/upload.jpg)

#### Annotate（标注）
![](/images/2023/roboflow/annotate.jpg)

#### Dataset（数据集）
![](/images/2023/roboflow/dataset.jpg)

#### Generate（生成新版本数据集）

![](/images/2023/roboflow/generate-new-version.jpg)

1️⃣ Source Images

![](/images/2023/roboflow/generate-new-version-source-images.jpg)

2️⃣ Train/Test Split

![](/images/2023/roboflow/generate-new-version-train-test-split.jpg)

3️⃣ Preprocessing

![](/images/2023/roboflow/generate-new-version-preprocessing.jpg)
![](/images/2023/roboflow/generate-new-version-preprocessing-options.jpg)

4️⃣ Augmentation

![](/images/2023/roboflow/generate-new-version-augmentation.jpg)
![](/images/2023/roboflow/generate-new-version-augmentation-options.jpg)

5️⃣ Generate

![](/images/2023/roboflow/generate-new-version-generate.jpg)

#### Versions（数据集版本）
![](/images/2023/roboflow/versions.jpg)

单击“Export”，可以导出不同格式的数据集。

![](/images/2023/roboflow/versions-export.jpg)
![](/images/2023/roboflow/versions-export-format.jpg)

单击“Start Training”，可以进行训练，能够进行3次免费训练。

![](/images/2023/roboflow/versions-train.jpg)

#### Deploy（预测或部署）
![](/images/2023/roboflow/deploy1.jpg)
![](/images/2023/roboflow/deploy2.jpg)

基于 Python 的推理示例
```shell
pip install roboflow
```

```py
from roboflow import Roboflow
rf = Roboflow(api_key="XXX")
project = rf.workspace().project("stategridlogo")
model = project.version(2).model

# infer on a local image
print(model.predict("your_image.jpg", confidence=40, overlap=30).json())

# visualize your prediction
# model.predict("your_image.jpg", confidence=40, overlap=30).save("prediction.jpg")

# infer on an image hosted elsewhere
# print(model.predict("URL_OF_YOUR_IMAGE", hosted=True, confidence=40, overlap=30).json())
```

#### Health Check（健康检查）
![](/images/2023/roboflow/health-check.jpg)

Dimension Insights

![](/images/2023/roboflow/health-check-dimension-insights.jpg)

Annotation Heatmap

![](/images/2023/roboflow/health-check-annotation-heatmap.jpg)

Histogram of Object Count by Image

![](/images/2023/roboflow/health-check-histogram-of-object-count.jpg)

#### [Universe Page](https://universe.roboflow.com/stategridlogodetection/stategridlogo)
![](/images/2023/roboflow/universe-page.jpg)

## 参考资料
* [Roboflow](https://roboflow.com/)
* [Roboflow Quickstart](https://github.com/roboflow/quickstart-python)
* [Explore the Roboflow Universe](https://universe.roboflow.com/)
* [COCO Explorer](https://cocodataset.org/#explore)
* [How to Train YOLOv8 Object Detection on a Custom Dataset](https://blog.roboflow.com/how-to-train-yolov8-on-a-custom-dataset/)
