---
layout: post
title:  "命令curl"
date:   2022-05-25 00:00:00 +0800
categories: curl
tags: [Command]
---

## 下载文件
### 下载单个文件
```shell
curl http://book.d2l.ai/_images/catdog.jpg -o catdog.jpg
```

### 下载多个文件
```shell
curl https://download.01.org/opencv/2021/openvinotoolkit/2021.1/open_model_zoo/models_bin/1/face-detection-retail-0004/FP32/face-detection-retail-0004.xml https://download.01.org/opencv/2021/openvinotoolkit/2021.1/open_model_zoo/models_bin/1/face-detection-retail-0004/FP32/face-detection-retail-0004.bin -o face-detection-retail-0004.xml -o face-detection-retail-0004.bin
```

### 下载文件并创建目录
```shell
curl --create-dirs https://download.01.org/opencv/2021/openvinotoolkit/2021.1/open_model_zoo/models_bin/1/face-detection-retail-0004/FP32/face-detection-retail-0004.xml https://download.01.org/opencv/2021/openvinotoolkit/2021.1/open_model_zoo/models_bin/1/face-detection-retail-0004/FP32/face-detection-retail-0004.bin -o model/face-detection-retail-0004.xml -o model/face-detection-retail-0004.bin
```

## 参考资料
* [OpenVINO™ Security Add-on](https://docs.openvino.ai/cn/latest/ovsa_get_started.html)
