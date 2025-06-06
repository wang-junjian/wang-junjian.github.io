---
layout: single
title:  "IoT 硬件：Raspberry Pi ReSpeaker 智能语音识别双麦克风阵列"
date:   2021-03-22 00:00:00 +0800
categories: IoT Hardware
tags: [树莓派, ReSpeaker, 麦克风]
---

## 树莓派4
### 硬件概述
![](/images/2021/hardware/raspberry-pi-4.png)

### 烧录系统
```shell
wget https://downloads.raspberrypi.org/rpd_x86/images/rpd_x86-2021-01-12/2021-01-11-raspios-buster-i386.iso
dd if=2021-01-11-raspios-buster-i386.iso of=/dev/sdc bs=10M
```

## ReSpeaker 2-Mics Pi HAT
![](/images/2021/hardware/respeaker2-mics-pi-hat1.jpg)

ReSpeaker 2-Mics Pi HAT是专为AI和语音应用设计的Raspberry Pi双麦克风扩展板。 这意味着您可以构建一个集成Amazona语音服务等的功能更强大，更灵活的语音产品。

该板是基于WM8960开发的低功耗立体声编解码器。 电路板两侧有两个麦克风采集声音，还提供3个APA102 RGB LED，1个用户按钮和2个板载Grove接口，用于扩展应用程序。 此外，3.5mm音频插孔或JST 2.0扬声器输出均可用于音频输出。

### 硬件概述
![](/images/2021/hardware/mic_hatv1.0.png)

### 产品特征
![](/images/2021/hardware/respeaker2-mics-pi-hat2.jpg)

## 配置
```shell
$ sudo raspi-config
```
### 打开 I2C
- 3 Interface Options Configure connections to peripherals
- P5 I2C Enable/disable automatic loading of I2C kernel module
- Yes

## 安装 ReSpeaker 驱动
```shell
git clone https://github.com/respeaker/seeed-voicecard
cd seeed-voicecard/
sudo ./install.sh --compat-kernel
sudo ./install.sh 2mic --compat-kernel
reboot
```

## 查看 ALSA 声卡
* arecord
```shell
arecord -l
```
```shell
**** List of CAPTURE Hardware Devices ****
card 2: seeed2micvoicec [seeed-2mic-voicecard], device 0: bcm2835-i2s-wm8960-hifi wm8960-hifi-0 [bcm2835-i2s-wm8960-hifi wm8960-hifi-0]
  Subdevices: 1/1
  Subdevice #0: subdevice #0
```

* aplay
```shell
aplay -l
```
```shell
**** List of PLAYBACK Hardware Devices ****
card 0: b1 [bcm2835 HDMI 1], device 0: bcm2835 HDMI 1 [bcm2835 HDMI 1]
  Subdevices: 4/4
  Subdevice #0: subdevice #0
  Subdevice #1: subdevice #1
  Subdevice #2: subdevice #2
  Subdevice #3: subdevice #3
card 1: Headphones [bcm2835 Headphones], device 0: bcm2835 Headphones [bcm2835 Headphones]
  Subdevices: 4/4
  Subdevice #0: subdevice #0
  Subdevice #1: subdevice #1
  Subdevice #2: subdevice #2
  Subdevice #3: subdevice #3
card 2: seeed2micvoicec [seeed-2mic-voicecard], device 0: bcm2835-i2s-wm8960-hifi wm8960-hifi-0 [bcm2835-i2s-wm8960-hifi wm8960-hifi-0]
  Subdevices: 1/1
  Subdevice #0: subdevice #0
```

## 调节音量
```shell
$ alsamixer
```
![](/images/2021/hardware/respeaker2-alsamixer.png)

## 使用硬件
### 录制声音并播放
```shell 
$ arecord -f cd -Dhw:2 | aplay -Dhw:2
```

### 录制 5 秒的声音文件
```shell
$ arecord -d 5 test.wav
```

### 播放声音文件
```shell
$ aplay -Dhw:2 test.wav
```

## BUTTON 按钮
```shell
import RPi.GPIO as GPIO
import time

GPIO.setmode(GPIO.BCM)
BTN_PIN=17

def pushed_button(channel):
    print('pushed button: ', channel)

GPIO.setup(BTN_PIN, GPIO.IN)
GPIO.add_event_detect(BTN_PIN, GPIO.FALLING, callback=pushed_button, bouncetime=50)

while True:
    time.sleep(10)
```

## APA102 LED
### 打开SPI
* 自动
```shell
sudo raspi-config nonint do_spi 0
```

* 手动
```shell
$ sudo raspi-config
```
    - 3 Interface Options Configure connections to peripherals
    - P4 SPI Enable/disable automatic loading of SPI kernel module
    - Yes

### 运行示例
```shell
$ git clone https://github.com/respeaker/mic_hat.git
$ cd mic_hat/
$ python pixels.py
```

## 参考资料
* [ReSpeaker 2-Mics Pi HAT](https://wiki.seeedstudio.com/cn/ReSpeaker_2_Mics_Pi_HAT/)
* [改造 ReSpeaker 2-MIC HAT](https://www.slideshare.net/raspberrypi-tw/respeaker-2mic-hat-109144010)
* [Raspberry Pi台灣樹莓派 - 範例程式](https://www.raspberrypi.com.tw/tag/範例程式/)
* [APA102 Library](https://pypi.org/project/apa102/)
* [Snowboy Hotword Detection](https://github.com/kitt-ai/snowboy)
* [GPIO](https://www.raspberrypi.org/documentation/usage/gpio/README.md)
* [A Python module to control the GPIO on a Raspberry Pi](https://sourceforge.net/p/raspberry-gpio-python/wiki/BasicUsage/)
* [树莓派用HDMI连接电视显示"无信号"问题](https://www.jianshu.com/p/c022c6f28c3a)
