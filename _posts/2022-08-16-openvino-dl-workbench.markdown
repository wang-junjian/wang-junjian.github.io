---
layout: post
title:  "OpenVINO Deep Learning Workbench"
date:   2022-08-16 08:00:00 +0800
categories:  AI OpenVINO
tags: [DLWorkbench]
---

## 使用 Docker 运行 DL Workbench
* [Run the DL Workbench Locally](https://docs.openvino.ai/latest/workbench_docs_Workbench_DG_Run_Locally.html)

### 拉取镜像
```shell
docker pull openvino/workbench:2022.1
```

### 运行
```shell
docker run -p 0.0.0.0:5665:5665 --name workbench -it openvino/workbench:2022.1
```

### 浏览器访问
[http://127.0.0.1:5665/](http://127.0.0.1:5665/)

## DL Workbench 工作流程
![](/images/2022/openvino/dl_wb_diagram_overview.svg)

## 快速了解 DL Workbench 用户界面中的工作流程
![](/images/2022/openvino/workflow_DL_Workbench.gif)


## 参考资料
* [OpenVINO™ Deep Learning Workbench Overview](https://docs.openvino.ai/latest/workbench_docs_Workbench_DG_Introduction.html)
