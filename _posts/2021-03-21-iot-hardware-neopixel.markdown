---
layout: post
title:  "IoT 硬件：NeoPixel"
date:   2021-03-21 00:00:00 +0800
categories: IoT Hardware
tags: [MicroPython, NodeMCU, ESP32, NeoPixel]
---

![](/images/2021/hardware/ws2812b.jpg)

WS2812B 灯带 一个集控制电路与发光电路于一体的智能外控LED光源。可单独寻址数字 LED 灯。 每个像素都有自己的颜色和亮度。 您可以单独控制它们,并将其设置成任何颜色。 256 灰色级别可调节和 16777216 彩色 24 位全彩显示。

## 硬件清单
* NodeMCU ESP32
* WS2812B 灯带
* 面包板
* 3条杜邦线
* USB数据线

## 电路图
![](/images/2021/fritzing/neopixel.png)

## ESP32 管脚图
![](/images/2021/nodemcu-esp32s-pinout.webp)

## 开发
```py
import time

from machine import Pin
from neopixel import NeoPixel
from random import randint


#GPIO0
pin = 0
#这里用的NeoPixel有60个灯珠
pixel_count = 60
np = NeoPixel(Pin(pin, Pin.OUT), pixel_count)


def get_random_rgb_color():
    red = randint(0, 255)
    green = randint(0, 255)
    blue = randint(0, 255)

    return (red, green, blue)


def random_color(np):
    for _ in range(0, 10):
        for pixel_id in range(0, np.n):
            np[pixel_id] = get_random_rgb_color()

        np.write()
        time.sleep_ms(200)


def cycle(np, num=4):
    n = np.n
    if num<=0 or num>n:
        num = 1

    for i in range(n):
        for j in range(n):
            np[j] = (0, 0, 0)
        for j in range(max(0, i-num), i):
            np[j] = get_random_rgb_color()
        np.write()
        time.sleep_ms(25)


def bounce(np):
    rgb = get_random_rgb_color()
    n = np.n
    for i in range(2 * n):
        for j in range(n):
            np[j] = rgb
        if (i // n) % 2 == 0:
            np[i % n] = (0, 0, 0)
        else:
            np[n - 1 - (i % n)] = (0, 0, 0)
        np.write()
        time.sleep_ms(25)


def fade_in_out(np):
    index = None
    n = np.n
    for i in range(0, 2 * 256, 8):
        for j in range(n):
            if (i // 256) % 2 == 0:
                val = i
            else:
                val = 255 - i
            #几种颜色组合
            colors = {
                0: (val, 0, 0),
                1: (0, val, 0),
                2: (0, 0, val),
                3: (val, val, 0),
                4: (val, 0, val),
                5: (0, val, val),
                6: (val, val, val)
            }
            #保障使用固定的颜色组合
            if index == None:
                index = randint(0, len(colors)-1)
            color = colors.get(index)
            np[j] = color
        np.write()
        time.sleep_ms(20)


def clear(np):
    for i in range(np.n):
        np[i] = (0, 0, 0)


def run():
    while True:
        styles = {
            0: random_color,
            1: cycle,
            2: bounce,
            3: fade_in_out
        }
        n = randint(0, len(styles)-1)
        
        styles.get(n)(np)


if __name__ == '__main__':
    run()
```

## VCC 和 GND
VCC 电源高电平，GND 是地的意思，就是整个电路中的参考电位，大部分情况下，电路中的参考电位和地球大地是一样的，就叫GND了。

## 参考资料
* [Desktop NeoPixel Clock](http://www.whatimade.today/desktop-neopixel-clock/)
* [WS2812B 智能外控集成 LED 光源](http://www.mateksys.com/Downloads/WS2812B_cn.pdf)
* [NeoPixel](https://microbit-micropython.readthedocs.io/en/latest/neopixel.html)
* [Controlling NeoPixels](https://docs.micropython.org/en/latest/esp8266/tutorial/neopixel.html)
* [Music Reactive WS2812 LED Strip via PC and raspberry with ESP8266](https://anshumanfauzdar.me/Sound-and-music-reactive-ESP8266-WS2812B/)
* [Music Reactive WS2812 LED Strip via PC and raspberry with ESP8266](https://github.com/AnshumanFauzdar/Sound-and-music-reactive-ESP8266-WS2812B)
* [MicroPython: WS2812B Addressable RGB LEDs with ESP32 and ESP8266](https://randomnerdtutorials.com/micropython-ws2812b-addressable-rgb-leds-neopixel-esp32-esp8266/)
* [MicroPython WS2812 driver](https://github.com/JanBednarik/micropython-ws2812)
* [Quick reference for the ESP32](https://docs.micropython.org/en/latest/esp32/quickref.html?highlight=neopixels)
* [Blynk controlled WS2812 Neopixel LED Strip using NodeMCU](https://iotdesignpro.com/projects/blynk-controlled-ws2812-neopixel-led-strip-using-esp8266-nodemcu)
* [Blynk Controlled WS2812B Neopixel LED Strip with NodeMCU](https://how2electronics.com/ws2812b-neopixel-led-strip-nodemcu/)
* [Sound lights with Spotify and ESP8266](https://nvbn.github.io/2019/12/17/spotify-soundlights/)
* [ESP8266 Controlling WS2812 Neopixel LEDs Using Arduino IDE - a Tutorial](https://www.instructables.com/ESP8266-controlling-Neopixel-LEDs-using-Arduino-ID/)
* [IOT : ESP 8266 Nodemcu Controlling Neopixel Ws2812 LED Strip Over the Internet Using BLYNK App](https://www.instructables.com/IOT-ESP-8266-Nodemcu-Controlling-Neopixel-Ws2812-L/)
* [ESP32 and WS2812b RGB led example](http://www.esp32learning.com/code/esp32-and-ws2812b-rgb-led-example.php)
* [NeoPixel Emulator with Python](https://www.hackster.io/gatoninja236/neopixel-emulator-with-python-f233c3)
* [如何在20元小板子上跑Python](https://zhuanlan.zhihu.com/p/24644526)
