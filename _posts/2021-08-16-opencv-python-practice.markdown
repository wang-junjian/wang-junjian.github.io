---
layout: post
title:  "OpenCV Python实践"
date:   2021-08-16 00:00:00 +0800
categories: Python 实践
tags: [Python, OpenCV, pip]
---

## 安装
### Python
```shell
sudo apt install python3
sudo apt install python3-pip
sudo pip3 install --upgrade pip
```

### OpenCV
```shell
sudo pip3 install opencv-python
sudo pip3 install opencv-contrib-python
```

## 图像
### 读取图像
```py
import cv2

img_file = '/Users/wjj/python-logo@2x.png'
img = cv2.imread(img_file)
```

### 获取图像大小
```py
width = img.shape[1]
height = img.shape[0]
```

### 显示图像并等待按任意键退出
```py
import cv2

img_file = '/Users/wjj/python-logo@2x.png'
img = cv2.imread(img_file)
cv2.imshow('', img)
cv2.waitKey(0)
```

### 宽高缩小一倍
#### 比例
```py
import cv2

img_file = '/Users/wjj/python-logo@2x.png'
img = cv2.imread(img_file)
img = cv2.resize(img, None, fx=0.5, fy=0.5)
cv2.imshow('', img)
cv2.waitKey(0)
```

#### 像素
```py
import cv2

img_file = '/Users/wjj/python-logo@2x.png'
img = cv2.imread(img_file)
img = cv2.resize(img, (800, 600))
cv2.imshow('', img)
cv2.waitKey(0)
```

### 保存
```py
import cv2

img_file = '/Users/wjj/python-logo@2x.png'
img = cv2.imread(img_file)
img = cv2.resize(img, None, fx=0.5, fy=0.5)
cv2.imwrite('python-logo.png', img)
```

## 编辑
### 画框
```py
red = (0, 0, 255)
cv2.rectangle(img, (0, 0), (100, 100), red, 2)
```

### 画文字
```py
red = (0, 0, 255)
cv2.putText(img, 'Hello', (0, 0), cv2.FONT_HERSHEY_SIMPLEX, fontScale=0.5, color=red, thickness=1, lineType=cv2.LINE_AA)
```

## 窗口
### 移动、显示、重置
```py
import cv2

img_file = '/Users/wjj/python-logo@2x.png'
img = cv2.imread(img_file)

win_name = 'TEST'
width, height = 800, 600

cv2.namedWindow(win_name, cv2.WINDOW_KEEPRATIO)
cv2.moveWindow(win_name, 0, 0)
cv2.imshow(win_name, img)
cv2.resizeWindow(win_name, width, height)

cv2.waitKey(0)
cv2.destroyAllWindows()
```

## 屏幕
### 获得屏幕分辨率
```py
import tkinter as tk

win = tk.Tk()
width = win.winfo_screenwidth()
height = win.winfo_screenheight()
win.destroy()

print(f'Screen Resolution Width: {width}, Height: {height}')
```
```shell
Screen Resolution Width: 1680, Height: 1050
```

## 参考资料
* [Python](https://www.python.org)
* [Optimal way to resize an image with OpenCV Python](https://stackoverflow.com/questions/56857820/optimal-way-to-resize-an-image-with-opencv-python)
