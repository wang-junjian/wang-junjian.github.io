---
layout: post
title:  "将注释从PASCAL VOC转换为YOLO Darknet"
date:   2020-07-08 00:00:00 +0800
categories: Dataset
tags: [VOC, YOLO, Format]
---

## PASCAL VOC(Visual Object Classes) 格式
### 格式
* 每张图片对应一个xml标注文件。
* object　   标注的对象，一张图片可以有1个或者多个
* name　     类别名
* bndbox     标注的边框（使用的坐标信息）
* difficult  目标是否难以识别（0表示容易识别）

### 0001.xml
```xml
<annotation>
	<folder>car</folder>
	<filename>0001.jpg</filename>
	<path>/dataset/car/0001.jpg</path>
	<source>
		<database>ailab</database>
	</source>
	<size>
		<width>510</width>
		<height>382</height>
		<depth>3</depth>
	</size>
	<segmented>0</segmented>
	<object>
		<name>car</name>
		<pose>Unspecified</pose>
		<truncated>0</truncated>
		<difficult>0</difficult>
		<bndbox>
			<xmin>220</xmin>
			<ymin>82</ymin>
			<xmax>279</xmax>
			<ymax>123</ymax>
		</bndbox>
	</object>
	<object>
		<name>car</name>
		<pose>Unspecified</pose>
		<truncated>0</truncated>
		<difficult>0</difficult>
		<bndbox>
			<xmin>135</xmin>
			<ymin>101</ymin>
			<xmax>208</xmax>
			<ymax>152</ymax>
		</bndbox>
	</object>
</annotation>
```

## Classes Name
### classes.txt
```txt
bus
car
train
```

## YOLO 格式
### 格式
* 每张图片对应一个txt标注文件。
* 每行一个标注对象，分别是：class_id x y width height。
* class_id: 从0到（classes-1）的整数。
* x y width height: 相对于图像的宽度和高度的浮点值，它可以等于（0.0到1.0]。例如：x=pixel_x/image_width, height=pixel_height/image_height
* x y: 是标注对象的中心点。

### 0001.txt
```txt
1 0.4872549019607843 0.26570680628272253 0.11568627450980393 0.10732984293193717
1 0.33431372549019606 0.3285340314136126 0.14313725490196078 0.13350785340314136
```

## 转换程序
### voc2yolo.py
```py
import argparse
import os
import pickle
import xml.etree.ElementTree as ET

from os import listdir, getcwd
from os.path import join
from tqdm import tqdm


classes = []


def convert(size, box):
    dw = 1./(size[0])
    dh = 1./(size[1])
    x = (box[0] + box[1])/2.0 - 1
    y = (box[2] + box[3])/2.0 - 1
    w = box[1] - box[0]
    h = box[3] - box[2]
    x = x*dw
    w = w*dw
    y = y*dh
    h = h*dh
    return (x,y,w,h)

def convert_annotation(voc_label_file, yolo_label_dir):
    with open(voc_label_file, "r") as in_file:
        xmlname = os.path.basename(voc_label_file)
        txtname = os.path.splitext(xmlname)[0]+'.txt'
        txtfile = os.path.join(yolo_label_dir, txtname)
        with open(txtfile, "w+") as out_file:
            tree=ET.parse(in_file)
            root = tree.getroot()
            size = root.find('size')
            w = int(size.find('width').text)
            h = int(size.find('height').text)
            out_file.truncate()
            for obj in root.iter('object'):
                difficult = obj.find('difficult').text
                cls = obj.find('name').text
                if cls not in classes or int(difficult)==1:
                    continue
                cls_id = classes.index(cls)
                xmlbox = obj.find('bndbox')
                b = (float(xmlbox.find('xmin').text), float(xmlbox.find('xmax').text), 
                     float(xmlbox.find('ymin').text), float(xmlbox.find('ymax').text))
                bb = convert((w,h), b)
                out_file.write(str(cls_id) + " " + " ".join([str(a) for a in bb]) + '\n')


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument('-v', '--voc_label_dir', type=str, help='pascal voc format label directory.')
    parser.add_argument('-y', '--yolo_label_dir', type=str, help='save yolo format label directory.')
    parser.add_argument('-c', '--class_name_file', type=str, help='class name file.')
    
    args = parser.parse_args()

    if args.voc_label_dir:
        if not os.path.exists(args.yolo_label_dir):
            os.makedirs(args.yolo_label_dir)

    if args.class_name_file and os.path.exists(args.class_name_file):
        with open(args.class_name_file) as f:
            classes = f.read().splitlines()

    if args.voc_label_dir:
        voc_label_files = os.listdir(args.voc_label_dir)
        for voc_label_file in tqdm(voc_label_files):
            voc_label_file_path = os.path.join(args.voc_label_dir, voc_label_file)
            if '.xml' in voc_label_file.lower():
                convert_annotation(voc_label_file_path, args.yolo_label_dir)
```

### 使用
```shell
python voc2yolo.py -v voc/ -y yolo/ -c classes.txt
```

## 参考资料
* [The PASCAL Visual Object Classes Homepage](http://host.robots.ox.ac.uk/pascal/VOC/)
* [Darknet: Open Source Neural Networks in C](https://pjreddie.com/darknet/)
* [Specific format of annotation](https://github.com/AlexeyAB/Yolo_mark/issues/60)
* [darknet/voc2yolo.py](https://github.com/gouchicao/darknet/blob/master/voc2yolo.py)
