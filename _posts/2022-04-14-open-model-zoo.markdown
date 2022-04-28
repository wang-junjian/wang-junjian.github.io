---
layout: post
title:  "Open Model Zoo"
date:   2022-04-14 08:00:00 +0800
categories: AI OpenVINO
tags: [command, 人脸检测, mtcnn]
---

## [Open Model Zoo automation tools](https://github.com/openvinotoolkit/open_model_zoo/blob/master/tools/model_tools/README.md)
### omz_downloader
用于访问预训练深度学习公共模型和英特尔训练模型的集合。

### omz_converter
使用模型优化器将存储在原始深度学习框架格式中的 Open Model Zoo 模型转换为 OpenVINO 中间表示 (IR)。

### omz_quantizer
用于使用训练后优化工具（Post-Training Optimization Tool）将 IR 格式的全精度模型自动量化为低精度版本。

### omz_info_dumper
用于将有关模型的信息转储为机器可读格式。

### omz_data_downloader
数据集下载器

## 查看可用的模型
Open Model Zoo 自动化工具都可以使用参数 ```--print_all```
```shell
$ omz_tool --print_all
```
```
Sphereface
aclnet
aclnet-int8
action-recognition-0001
age-gender-recognition-retail-0013
alexnet
......
yolo-v3-onnx
yolo-v3-tf
yolo-v3-tiny-onnx
yolo-v3-tiny-tf
yolo-v4-tf
yolo-v4-tiny-tf
yolof
yolox-tiny
```

* [Intel Pre-Trained Models](https://github.com/openvinotoolkit/open_model_zoo/blob/master/models/intel/index.md)
* [Public Pre-Trained Models](https://github.com/openvinotoolkit/open_model_zoo/blob/master/models/public/index.md)

## Demos
[Open Model Zoo Demos](https://github.com/openvinotoolkit/open_model_zoo/blob/master/demos/README.md)

### Clone Open Model Zoo
```shell
git clone https://github.com/openvinotoolkit/open_model_zoo.git
cd open_model_zoo
git submodule update --init --recursive
```

### Python Demos
#### 安装依赖包
##### Installing Dependencies for Python Demos
```shell
pip install -r demos/requirements.txt -i https://mirrors.aliyun.com/pypi/simple/
```

##### Installing Python Model API package
```shell
pip install demos/common/python
```

#### [Face Detection MTCNN Python* Demo](https://github.com/openvinotoolkit/open_model_zoo/blob/master/demos/face_detection_mtcnn_demo/python/README.md)
```shell
cd demos/face_detection_mtcnn_demo/python
```

##### 模型下载
```shell
omz_downloader --list models.lst
```

##### 模型转换
```shell
omz_converter --list models.lst
```

##### 下载图片
```shell
wget https://manastirea.petru-voda.ro/wp-content/uploads/2017/09/tineri.jpg -O human-crowd.jpg
wget http://ptvnews.ph/wp-content/uploads/2018/12/img7744-1920x1266.jpg -O people.jpg
wget https://www.lse.ac.uk/government/Assets/Images/People/Department-photo/people-page-thumbnail-1200x600.jpg -O people1.jpg
```

##### 人脸检测推理
* Windows
```shell
python face_detection_mtcnn_demo.py `
    -i people.jpg `
    -m_p public/mtcnn/mtcnn-p/FP32/mtcnn-p.xml `
    -m_o public/mtcnn/mtcnn-o/FP32/mtcnn-o.xml `
    -m_r public/mtcnn/mtcnn-r/FP32/mtcnn-r.xml `
    -th 0.7
```

* Linux
```shell
python face_detection_mtcnn_demo.py \
    -i people.jpg \
    -m_p public/mtcnn/mtcnn-p/FP32/mtcnn-p.xml \
    -m_o public/mtcnn/mtcnn-o/FP32/mtcnn-o.xml \
    -m_r public/mtcnn/mtcnn-r/FP32/mtcnn-r.xml \
    -th 0.7
```

```
[ INFO ] OpenVINO Runtime
[ INFO ] 	build: 2022.1.0-7019-cdb9bec7210-releases/2022/1
[ INFO ] Reading Proposal model public/mtcnn/mtcnn-p/FP32/mtcnn-p.xml
[ INFO ] Reading Refine model public/mtcnn/mtcnn-r/FP32/mtcnn-r.xml
[ INFO ] Reading Output model public/mtcnn/mtcnn-o/FP32/mtcnn-o.xml
[ INFO ] The Proposal model public/mtcnn/mtcnn-p/FP32/mtcnn-p.xml is loaded to CPU
[ INFO ] The Refine model public/mtcnn/mtcnn-r/FP32/mtcnn-r.xml is loaded to CPU
[ INFO ] The Output model public/mtcnn/mtcnn-o/FP32/mtcnn-o.xml is loaded to CPU
[ INFO ] Metrics report:
[ INFO ] 	Latency: 1160.0 ms
[ INFO ] 	FPS: 0.9
```

如果在服务器上运行，可以使用参数 ```--no_show```；需要保存输出结果，可以使用参数 ```-o filename.jpg```。

## 参考资料
* [英特尔® 发行版 OpenVINO™ 工具套件](https://www.intel.cn/content/www/cn/zh/developer/tools/openvino-toolkit/overview.html)
* [OpenVINO](https://github.com/openvinotoolkit/openvino)
* [Open Model Zoo](https://github.com/openvinotoolkit/open_model_zoo)
