---
layout: post
title:  "OpenCV Python实践"
date:   2021-08-16 00:00:00 +0800
categories: Python 实践
tags: [Python, OpenCV, pip, f-strings, Tkinter, Chinese]
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

img_file = 'python-logo@2x.png'
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

img_file = 'python-logo@2x.png'
img = cv2.imread(img_file)
cv2.imshow('', img)
cv2.waitKey(0)
```

### 宽高缩小一倍
#### 比例
```py
import cv2

img_file = 'python-logo@2x.png'
img = cv2.imread(img_file)
img = cv2.resize(img, None, fx=0.5, fy=0.5)
cv2.imshow('', img)
cv2.waitKey(0)
```

#### 像素
```py
import cv2

img_file = 'python-logo@2x.png'
img = cv2.imread(img_file)
img = cv2.resize(img, (800, 600))
cv2.imshow('', img)
cv2.waitKey(0)
```

### 保存
```py
import cv2

img_file = 'python-logo@2x.png'
img = cv2.imread(img_file)
# 宽高缩小1倍
img = cv2.resize(img, None, fx=0.5, fy=0.5)
cv2.imwrite('python-logo.png', img)
```

## 视频
```py
import cv2
import numpy as np

width = 400
height = 400

# Define the codec and create VideoWriter object
# fourcc = cv2.VideoWriter_fourcc(*'MJPG')
fourcc = cv2.VideoWriter_fourcc(*'XVID')
writer = cv2.VideoWriter('output.avi', fourcc, 20.0, (width,height))

red = (0, 0, 255)

# 制作黑色画布
# 图像的宽高和视频设置的必须相同
img = np.zeros((width,height,3), 'uint8')

for n in range(0, width, 2):
    cv2.rectangle(img, (0,0), (n,n), color=red, thickness=1)
    writer.write(img)

writer.release()
```

## 编辑
### 画线
```py
red = (0, 0, 255)
cv2.line(img, left, right, color=red, thickness=2)
```

### 画框
```py
red = (0, 0, 255)
cv2.rectangle(img, (0, 0), (100, 100), color=red, thickness=2)
```

### 画圆
```py
center = (100, 100)
radius = 5 # 半径
red = (0, 0, 255)
cv2.circle(img, center, radius, color=red, thickness=-1) # -1 实心圆
cv2.circle(img, center, radius, color=red, thickness=2)# 边框 2 个像素的空心圆
```

### 画文字
```py
red = (0, 0, 255)
cv2.putText(img, 'Hello', (0, 0), cv2.FONT_HERSHEY_SIMPLEX, fontScale=0.5, color=red, thickness=1, lineType=cv2.LINE_AA)
```

### 解决使用上面方法出现的中文乱码
```py
black=(0,0,0)

ft2 = cv2.freetype.createFreeType2()
font_path = 'fonts/NotoSansCJK-Medium.ttc'
ft2.loadFontData(font_path, 0)
# thickness=-1 文字是实体颜色；使用正整数，为边框的像素数，文字为空心。
ft2.putText(img, text, pt, fontHeight=30, color=black, 
    thickness=-1, line_type=cv2.LINE_4, bottomLeftOrigin=False)
```

## 控制
### 动画效果
```py
import cv2
import numpy as np

red = (0, 0, 255)

# 制作黑色画布
img = np.zeros((400,400,3), 'uint8')

for n in range(0, 400, 2):
    cv2.rectangle(img, (0,0), (n,n), color=red, thickness=1)
    cv2.imshow('Rectangle', img)

    cv2.waitKey(100)
```

### 接收到按键消息退出
```py
import cv2
import numpy as np

red = (0, 0, 255)
img_size = (400,400,3)
# 制作白色画布
img = np.full(img_size, 255, 'uint8')
n = 0
while True:
    cv2.rectangle(img, (0,0), (n,n), color=red, thickness=1)
    cv2.imshow('Rectangle', img)

    n += 2
    if n > 400:
        img = np.zeros(img_size, 'uint8')
        n = 0

    if cv2.waitKey(1) & 0xFF == ord('q'): # 按 q 键退出
        break
```

### 等待按任意键继续
```py
cv2.waitKey(0)
```

## 窗口
### 移动、显示、重置
```py
import cv2

img_file = 'python-logo@2x.png'
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
* [Can cv2. putText support Chinese output?python opencv #14579](https://github.com/opencv/opencv/issues/14579)
* [Optimal way to resize an image with OpenCV Python](https://stackoverflow.com/questions/56857820/optimal-way-to-resize-an-image-with-opencv-python)
* [draw a circle over image opencv](https://stackoverflow.com/questions/16484796/draw-a-circle-over-image-opencv)
* [Opencv python lane detection draw line using cv2.line() change line color bug unsuccessfully](https://stackoverflow.com/questions/62674512/opencv-python-lane-detection-draw-line-using-cv2-line-change-line-color-bug-un)
* [How to draw Chinese text on the image using `cv2.putText`correctly? (Python+OpenCV)](https://stackoverflow.com/questions/50854235/how-to-draw-chinese-text-on-the-image-using-cv2-puttextcorrectly-pythonopen)
* [Python Static Method Explained With Examples](https://pynative.com/python-static-method/)
* [Print while cv2.imshow() for a period of time](https://stackoverflow.com/questions/49443133/print-while-cv2-imshow-for-a-period-of-time)
* [openCV video saving in python](https://stackoverflow.com/questions/29317262/opencv-video-saving-in-python)
