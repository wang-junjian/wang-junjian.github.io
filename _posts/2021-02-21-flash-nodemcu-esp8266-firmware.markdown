---
layout: post
title:  "烧录NodeMCU ESP8266固件"
date:   2021-02-21 00:00:00 +0800
categories: IOT
tags: [Linux, MicroPython, NodeMCU, ESP8266, esptool, SecureCRT, WebREPL]
---

## 准备
### 硬件
* NodeMCU 开发板
![](/images/2021/nodemcu-esp8266.png)

* 数据线，一头是 USB-A 接口，另一头是 Micro-USB 接口。
![](/images/2021/usb.png)

### 软件
* [MicroPython](https://docs.micropython.org/en/latest/)

## 搭建 MicroPython 开发环境
### 安装工具
1. 安装烧录工具 ```esptool```
```shell
pip3 install esptool
```

2. 运行 ```esptool.py read_mac``` 命令，确认连接成功。
```shell
$ esptool.py read_mac
esptool.py v3.0
Found 2 serial ports
Serial port /dev/cu.usbserial-0001
Connecting....
Detecting chip type... ESP8266
Chip is ESP8266EX
Features: WiFi
Crystal is 26MHz
MAC: f4:cf:a2:ec:0a:86
Uploading stub...
Running stub...
Stub running...
MAC: f4:cf:a2:ec:0a:86
Hard resetting via RTS pin...
```

3. 查看设备文件
```shell
$ ls /dev/cu*
/dev/cu.Bluetooth-Incoming-Port /dev/cu.usbserial-0001
```

### 烧录固件
1. 下载 [ESP8266固件](https://micropython.org/download/esp8266/)
```shell
wget https://micropython.org/resources/firmware/esp8266-20210202-v1.14.bin
```

2. 擦除 Flash 芯片
```shell
esptool.py --port /dev/cu.usbserial-0001 erase_flash
```

3. 烧录固件
```shell
esptool.py --port /dev/cu.usbserial-0001 --baud 460800 write_flash --flash_size=detect -fm dio 0 /Users/wjj/Downloads/esp8266-20210202-v1.14.bin
```

## 验证成功
### Wi-Fi
烧录成功后，设备会将其自身配置为您可以连接的WiFi接入点（AP）。 ESSID的格式为```MicroPython-xxxxxx```，其中x替换为设备MAC地址的一部分（因此每次都相同，并且对于所有ESP8266芯片而言都不同）。 WiFi的密码为```micropythoN```（注意大写的N）。 连接到其网络后，其IP地址将为```192.168.4.1```。

### SecureCRT (交互解释器)
* Download [SecureCRT](https://www.vandyke.com/cgi-bin/releases.php?product=securecrt)
* SecureCRT Connect Config
![](/images/2021/securecrt-esp8266-connect-config.png)
* 检测连接是否成功(返回True)
![](/images/2021/securecrt-esp8266-micropython-connect-check.png)
```py
import esp
>>> esp.check_fw()
size: 632048
md5: fccbe03ec7fd06fcfa29ccb626bb3db1
True
>>> 
```

### WebREPL (基于Web浏览器交互解释器)
WebREPL (通过WebSockets的REPL, 可以通过浏览器使用)。 可以从 [https://github.com/micropython/webrepl](https://github.com/micropython/webrepl) 下载并打开html文件运行。 (在线托管版可以通过访问 [http://micropython.org/webrepl](http://micropython.org/webrepl))直接使用, 通过执行以下 命令进行配置:
```py
import webrepl_setup
```
按照屏幕的提示操作。重启后，允许使用WebREPL。如果你禁用了开机自动启动WebREPL,可以通过以下命令使用:
```py
import webrepl
webrepl.start()
```
这个 WebREPL 通过连接到ESP8266的AP使用,如果你的路由器配网络配置正确，这个功能也可以通过STA方式使用，那意味着你可以同时上网和调试ESP8266。(如果遇到不可行的特殊情况，请先使用ESP8266 AP方式)。
除了终端/命令符的访问方式, WebREPL同时允许传输文件 (包含上传和下载)。Web客户端有相应的功能按钮，也可以通过 webrepl_cli.py 模块上存储的命令行进行操作。

### 测试例子：点亮开发板的灯
* 亮 Pin(2, Pin.OUT)
* 灭 Pin(2, Pin.IN)
```py
>>> from machine import Pin
>>> pin = Pin(2, Pin.OUT)
>>> pin = Pin(2, Pin.IN)
```

## 部署应用到开发板
### 下载 [pyboard](https://github.com/micropython/micropython/blob/master/tools/pyboard.py)
```shell
wget https://raw.githubusercontent.com/micropython/micropython/master/tools/pyboard.py
```

### 在开发板上运行Python代码
* 方法1
```shell
./pyboard.py --device /dev/cu.usbserial-0001 -c 'print("Hello World!")'
```

* 方法2
```shell
export PYBOARD_DEVICE=/dev/cu.usbserial-0001
./pyboard.py -c 'print("Hello World!")'
```

### 在开发板上运行Python脚本
```shell
./pyboard.py --device /dev/cu.usbserial-0001 hello.py
```

### 开发板文件系统访问(-f)
* cp
* cat
* ls
* rm
* mkdir
* rmdir

### 编写应用 main.py
```shell
import machine
import time

#指明 GPIO2 管脚
pin = machine.Pin(2, machine.Pin.OUT)

while True:
    time.sleep(2)   #等待 2 秒
    pin.on()        #控制 LED 关
    time.sleep(2)   #等待 2 秒
    pin.off()       #控制 LED 开
```

### 部署应用到开发板
这个文件的名字必须是 ```main.py```，系统启动后会自动运行main.py。
```shell
./pyboard.py -f cp main.py :
```

## 参考资料
* [MicroPython documentation](https://docs.micropython.org/en/latest/index.html)
* [Quick reference for the ESP8266](https://docs.micropython.org/en/latest/esp8266/quickref.html)
* [MicroPython 文档（中文）](http://docs.micropython.01studio.org/zh_CN/latest/index.html)
* [ESP8266 快速参考手册](http://docs.micropython.01studio.org/zh_CN/latest/esp8266/quickref.html)
* [SecureCRT](https://www.vandyke.com/cgi-bin/releases.php?product=securecrt)
* [PuTTY](https://www.putty.org)
* [esp32/esp8266  micropython 教程汇总](https://mc.dfrobot.com.cn/thread-271930-1-1.html)
* [搞软件的能不能搞硬件，ESP8266刷MicroPython，点个灯](https://www.bilibili.com/read/cv5718920/)
