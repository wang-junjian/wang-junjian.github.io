---
layout: post
title:  "Thonny Python IDE"
date:   2021-04-12 01:00:00 +0800
categories: Software IDE
tags: [thonny]
---

![](/images/2021/software/thonny.png)

## [Thonny](https://thonny.org)
* [源代码](https://github.com/thonny/thonny/)
* [下载](https://github.com/thonny/thonny/releases/tag/v3.3.6)
* 直接连接 MicroPython 设备进行开发

## 连接 MicroPython 设备进行开发
### 1. 选择解释器
菜单：运行 -> 选择解释器

![](/images/2021/software/thonny-select-interpreter.png)

### 2. 打开设备上的文件
菜单：文件 -> 打开

工具栏：打开

![](/images/2021/software/thonny-open-from.png)

单击 MicroPython设备 按钮后，可以看到设备上的文件和目录，选择相应的文件打开。

![](/images/2021/software/thonny-open-from-micropython-device.png)

### 3. 开发
在编辑器中修改代码，可以保存回 MicroPython 设备。如果需要即时解释执行 Python 语句，只需要在下面的 Shell 窗口输入即可。

![](/images/2021/software/thonny-edit-file.png)

### 4. 上传代码
打开本机上的 Python 代码文件，选择菜单：文件 -> 保存一个副本，选择保存 MicroPython设备。

## 参考资料
* [三個簡單 ESP8266 與 MicroPython 物聯網（IoT）應用：任何人都能在家自己做，低成本、免焊接、免懂程式又實用](https://alankrantas.medium.com/三個簡單-esp8266-與-micropython-物聯網-iot-應用-任何人都能在家自己做-低成本-免焊接-免懂程式又實用-3c0e9c50b212)
