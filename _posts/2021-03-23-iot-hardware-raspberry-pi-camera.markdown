---
layout: post
title:  "IoT 硬件：Raspberry Pi Camera"
date:   2021-03-23 00:00:00 +0800
categories: IoT Hardware
tags: [树莓派, Camera]
---

![](/images/2021/hardware/rpi-camera.png)

## 配置
### Camera
```shell
$ sudo raspi-config
```

- 3 Interface Options Configure connections to peripherals
- P1 Camera Enable/disable connection to the Raspberry Pi Camera
- Yes

```shell
reboot
```

### 显存
> 保证显存 >= 128

* 查看
```shell
$ cat /boot/config.txt | grep gpu_mem
gpu_mem=128
```

* 修改
```shell
$ vim /boot/config.txt
```

## 检测 Camera
> 如果没有检测出来，可以考虑重新插拔试试。

```shell
$ vcgencmd get_camera
supported=1 detected=1
```

## 验证
### 拍照 raspistill
* 打开摄像头，预览2秒后关闭。
```shell
raspistill -t 2000
```

* 打开摄像头，5秒后拍照(默认)，保存为 image.jpg。
```shell
raspistill -o image.jpg
```

* 打开摄像头，3秒后拍照，保存为 image.png，宽640:高480。
```shell
raspistill -t 3000 -o image.png -e png -w 640 -h 480
```

* 打开摄像头，30秒内每2秒保存一张照片。
```shell
raspistill -t 30000 -tl 2000 -o image%04d.jpg
```

### 录像 raspivid
* 录5秒1080p30视频
```shell
raspivid -t 5000 -o video.h264
```

* 录5秒1080p30视频，宽640:高480。
```shell
raspivid -t 5000 -o video.h264 -w 640 -h 480
```

## 开发
### 拍照
```py
from time import sleep
from picamera import PiCamera

camera = PiCamera()
camera.resolution = (1024, 768)
camera.start_preview()
sleep(2)
camera.capture('image.jpg')
```

### 录像
```py
import picamera

camera = picamera.PiCamera()
camera.resolution = (640, 480)
camera.start_recording('video.h264')
camera.wait_recording(10)
camera.stop_recording()
```

## FAQ
1. 没有打开 Camera。
```shell
$ raspistill -t 2000
```
```
mmal: mmal_vc_component_create: failed to create component 'vc.ril.camera' (1:ENOMEM)
mmal: mmal_component_create_core: could not create component 'vc.ril.camera' (1)
mmal: Failed to create camera component
mmal: main: Failed to create camera component
mmal: Camera is not enabled in this build. Try running "sudo raspi-config" and ensure that "camera" has been enabled
```

2. Camera 没有安装好或者有质量问题。
```shell
$ raspistill -t 2000
```
```
mmal: Cannot read camera info, keeping the defaults for OV5647
mmal: mmal_vc_component_create: failed to create component 'vc.ril.camera' (1:ENOMEM)
mmal: mmal_component_create_core: could not create component 'vc.ril.camera' (1)
mmal: Failed to create camera component
mmal: main: Failed to create camera component
mmal: Camera is not detected. Please check carefully the camera module is installed correctly
```

## 参考资料
* [Raspberry Pi Camera 应用使用文档](https://github.com/raspberrypi/documentation/blob/master/raspbian/applications/camera.md)
    - 拍摄图像 - raspistill, raspivid
    - 拍摄视频 - raspiyuv, raspividyuv
* [Raspberry Pi Camera Python开发文档](https://picamera.readthedocs.io/en/release-1.13/)
* Raspberry Pi Camera + Python + OpenCV
    - [Day1](https://www.slideshare.net/raspberrypi-tw/raspberry-pi-camera-python-opencv-day1)
    - [Day2](https://www.slideshare.net/raspberrypi-tw/raspberry-pi-camera-and-opencv-day2)
* [[RPi3] camera module not detected](https://www.reddit.com/r/raspberry_pi/comments/db5vqa/rpi3_camera_module_not_detected/)
* [raspbian:無法在Raspberry Pi 3上檢測到相機](https://t.codebug.vip/questions-256112.htm)
