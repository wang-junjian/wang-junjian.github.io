---
layout: post
title:  "基于NodeMCU(ESP32)搭建Python开发环境"
date:   2021-02-22 00:00:00 +0800
categories: IoT
tags: [MicroPython, NodeMCU, ESP32, esptool, SecureCRT]
---

## 准备
### 硬件
* NodeMCU(ESP32) 开发板
![](/images/2021/nodemcu-esp32.jpg)

* 数据线，一头是 USB-A 接口，另一头是 Micro-USB 接口。
![](/images/2021/usb.png)

### 软件
* [MicroPython](https://docs.micropython.org/en/latest/)

### PINOUT
![](/images/2021/nodemcu-esp32s-pinout.webp)

## 搭建 MicroPython 开发环境
* 运行 ```esptool.py read_mac``` 命令，确认连接成功。
```shell
$ esptool.py read_mac
esptool.py v3.0
Found 2 serial ports
Serial port /dev/cu.usbserial-1410
Connecting....
Detecting chip type... ESP32
Chip is ESP32-D0WD (revision 1)
Features: WiFi, BT, Dual Core, 240MHz, VRef calibration in efuse, Coding Scheme None
Crystal is 40MHz
MAC: 3c:61:05:06:81:9c
Uploading stub...
Running stub...
Stub running...
MAC: 3c:61:05:06:81:9c
Hard resetting via RTS pin...
```

### 烧录固件
1. 下载 [ESP32固件](http://micropython.org/download/esp32/)，选择```Firmware with ESP-IDF v3.x```下面的```GENERIC```类别。
```shell
wget http://micropython.org/resources/firmware/esp32-idf3-20210202-v1.14.bin
```

2. 擦除 Flash 芯片
```shell
esptool.py --chip esp32 --port /dev/cu.usbserial-1410 erase_flash
```

3. 烧录固件
```shell
esptool.py --chip esp32 --port /dev/cu.usbserial-1410 --baud 460800 write_flash -z 0x1000 esp32-idf3-20210202-v1.14.bin
```

## 验证成功
### SecureCRT (交互解释器)
* SecureCRT Connect Config
![](/images/2021/securecrt-esp32-connect-config.png)
* 输入帮助函数 help()
![](/images/2021/securecrt-esp32-micropython-connect-check.png)

### 测试例子：点亮开发板的蓝灯
* 亮蓝灯 Pin(2, Pin.IN)
* 灭蓝灯 Pin(2, Pin.OUT)
```py
>>> from machine import Pin
>>> Pin(2, Pin.IN)
>>> Pin(2, Pin.OUT)
```

## 打开低功耗蓝牙
```py
import network
import ubluetooth

wlan = network.WLAN(network.STA_IF)
wlan.active(True)

ble = ubluetooth.BLE()
ble.active(True)
```

* 如果不先打开WIFI将会出现下面的错误
```py
import ubluetooth
ble = ubluetooth.BLE()
ble.active(True)
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
OSError: [Errno 110] ETIMEDOUT
```

## 参考资料
* [MicroPython libraries - ubluetooth](http://docs.micropython.org/en/latest/library/ubluetooth.html)
* [MicroPython libraries - ubluetooth（中文）](https://mpython.readthedocs.io/zh/master/library/micropython/ubluetooth.html)
* [esp32/bluetooth: commit 126f972 breaks ble.active(True) #6423](https://github.com/micropython/micropython/issues/6423)
