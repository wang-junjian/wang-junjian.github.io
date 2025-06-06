---
layout: single
title:  "基于腾讯云物联网开发平台的光照传感器"
date:   2021-02-24 00:00:00 +0800
categories: IoT SmartHome
tags: [MicroPython, MQTT, NodeMCU, ESP8266]
---

## 构建光照传感器
### 硬件
* NodeMCU ESP8266
* 光照度传感器
* 面包板
* 杜邦线
* USB数据线

### NodeMCU 的管脚图
![](/images/2021/nodemcu-esp32s-pinout.webp)

### 电路图
![](/images/2021/light-sensor/light-sensor-circuit-diagram.png)

### 光照传感器
![](/images/2021/light-sensor/light-sensor.png)

## 物联网开发平台
### 平台使用流程
![](/images/2021/smart-light/tencent-iot-00.png)

### ① 登录[腾讯云物联网开发平台](https://console.cloud.tencent.com/iotexplorer)控制台，进入公共实例
![](/images/2021/smart-light/tencent-iot-01.png)

### ③ 创建产品
选择智能家居，新建产品：光照传感器。
![](/images/2021/light-sensor/tencent-iot-01.png)

### ④ 定义数据模板
1. 选择数据模板，通过导入自定义数据模板。
```json
{
  "version": "1.0",
  "profile": {
    "ProductId": "您的产品ID",
    "CategoryId": "112"
  },
  "properties": [
    {
      "id": "Illuminance",
      "name": "光照度",
      "desc": "光照度检测",
      "mode": "r",
      "define": {
        "type": "float",
        "unit": "Lux",
        "min": "0",
        "max": "6000",
        "start": "0",
        "step": "1"
      }
    }
  ],
  "events": [],
  "actions": []
}
```
![](/images/2021/light-sensor/tencent-iot-02.png)

2. 导入成功
![](/images/2021/light-sensor/tencent-iot-03.png)

### ⑥ 交互开发
![](/images/2021/light-sensor/tencent-iot-04.png)

### ⑦ 设备调试
1. 新建设备
![](/images/2021/light-sensor/tencent-iot-05.png)

2. 创建成功
![](/images/2021/light-sensor/tencent-iot-06.png)

3. 新建设备的二维码，可以使用腾讯连连扫描快速增加。
![](/images/2021/light-sensor/tencent-iot-08.png)

4. 在线调试
![](/images/2021/light-sensor/tencent-iot-07.png)

## 软件实现
参考[数据模板协议](https://cloud.tencent.com/document/product/1081/34916)开发用于上报设备的状态和控制设备的指令。可由腾讯云物联网平台提供的[生成小工具](https://iot-exp-individual-1258344699.cos.ap-guangzhou.myqcloud.com/password生成工具.zip)自动生成，想了解更多的详情，请查看[MQTT.fx 快速接入指引](https://cloud.tencent.com/document/product/1081/46507)。

### MQTT用户名和密码生成工具
![](/images/2021/smart-light/tencent-iot-mqtt-password-generator.png)

### 配置您自己的信息
#### WiFi（用于联网）
* ESSID
* PASSWORD

#### IOT平台定义的设备信息
* DEVICE_NAME（设备名称）
* PRODUCT_ID（产品ID）
* DEVICE_KEY（设备密钥）

#### MQTT
* MQTT_USERNAME
* MQTT_PASSWORD

### 代码
* wifi.py
```py
import network
ESSID = ""
PASSWORD = ""
def connect(essid=ESSID, password=PASSWORD):
    wlan = network.WLAN(network.STA_IF)
    wlan.active(True)
    if not wlan.isconnected():
        print('connecting to network...')
        wlan.connect(essid, password)
        while not wlan.isconnected():
            pass
    print('network config:', wlan.ifconfig())
```

* light.py
```py
from machine import ADC
from machine import Pin
class Light():
    """
    基于 PT550 环保型光敏二极管的光照传感器元器件，它的灵敏度更高，测量范围是 0Lux～6000Lux。
    Lux（勒克斯）是光照强度的单位，它和另一个概念 Lumens（流明）是不同的。Lumens 是指一个光源（比如电灯、投影仪）发出的光能力的总量，而 Lux 是指空间内一个位置接收到的光照的强度。
    因为 ADC 支持的最大位数是 12bit，所以这个数值范围是 0~4095 之间。这里按照线性关系做一个转换。
    """
    def __init__(self, pin):
        self._light = ADC(Pin(pin))

    def value(self):
        value = self._light.read()
        print("Light ADC value:", value)
        return int(value/4095*6000)
```

* tencent_mqtt.py
```py
import time
import ujson
from umqtt.simple import MQTTClient
from light import Light
"""
QCloud Device Info
"""
DEVICE_NAME = ""
PRODUCT_ID = ""
DEVICE_KEY = ""
"""
MQTT topic
"""
MQTT_DEVICE_CONTROL_TOPIC = "$thing/down/property/"+PRODUCT_ID+"/"+DEVICE_NAME
MQTT_DEVICE_STATUS_TOPIC = "$$thing/up/property/"+PRODUCT_ID+"/"+DEVICE_NAME
MQTT_SERVER = PRODUCT_ID + ".iotcloud.tencentdevices.com"
MQTT_PORT = 1883
MQTT_CLIENT_ID = PRODUCT_ID+DEVICE_NAME
MQTT_USERNAME = ""
MQTT_PASSWORD = ""
class LightSensor():
    def __init__(self):
        self.light = Light(36)
class TencentMQTT():
    light_sensor = LightSensor()

    def __init__(self):
        self.mqtt_client = None

    def connect(self):
        self.mqtt_client = MQTTClient(MQTT_CLIENT_ID, MQTT_SERVER, MQTT_PORT, MQTT_USERNAME, MQTT_PASSWORD, 60)
        self.mqtt_client.set_callback(TencentMQTT.control)
        self.mqtt_client.connect()
 
    """
    接收订阅的消息（用于远程控制）
    """
    @staticmethod
    def control(topic, msg):
        pass

    """
    发送设备的状态消息
    """
    def report(self):
        msg = {
            "method": "report",
            "clientToken": "clientToken-0123456789",
            "params": {
                "Illuminance": self.light_sensor.value()
            }   
        }

        self.mqtt_client.publish(MQTT_DEVICE_STATUS_TOPIC.encode(), ujson.dumps(msg).encode())

    """
    消息循环
    """
    def loop(self):
        self.mqtt_client.subscribe(MQTT_DEVICE_CONTROL_TOPIC.encode())

        up_time = 5000
        time_sleep = 50
        time_count = 0
        while True:
            self.mqtt_client.check_msg()

            time_count += time_sleep
            if (time_count >= up_time):
                self.report()
                time_count = 0

            time.sleep_ms(time_sleep)
```

* main.py
```py
import wifi
from tencent_mqtt import TencentMQTT
if __name__ == '__main__':
    wifi.connect()
    
    mqtt = TencentMQTT()
    mqtt.connect()

    mqtt.loop()
```

### 程序写入开发板
```shell
$ ./pyboard.py --device /dev/cu.usbserial-0001 -f cp light.py wifi.py main.py tencent_mqtt.py :
```

## 远程控制
### 在微信中打开腾讯连连小程序，添加－扫一扫。
![](/images/2021/light-sensor/tencent-iot-09.png)

### 扫描下面光照传感器的二维码。
![](/images/2021/light-sensor/tencent-iot-07.png)

### 添加成功
![](/images/2021/light-sensor/tencent-iot-10.png)

### 查看设备状态
![](/images/2021/light-sensor/light-sensor-status.jpg)

## 参考资料
* [腾讯云物联网开发平台入门](https://cloud.tencent.com/product/iotexplorer/getting-started)
* [MQTT.fx-目前主流的MQTT桌面客户端](http://mqttfx.jensd.de)
* [MQTT X](https://mqttx.app/cn/)
* [MQTT Version 3.1.1 协议标准](http://docs.oasis-open.org/mqtt/mqtt/v3.1.1/os/mqtt-v3.1.1-os.html)
* [MQTT协议](https://docs.emqx.cn/broker/latest/development/protocol.html)
* [umqtt.simple](https://github.com/micropython/micropython-lib/tree/master/umqtt.simple)
* [MicroPython – Getting Started with MQTT on ESP32/ESP8266](https://randomnerdtutorials.com/micropython-mqtt-esp32-esp8266/)
* [uasyncio — asynchronous I/O scheduler](https://docs.micropython.org/en/latest/library/uasyncio.html)
* [The Breathing Lamp](https://mpython.readthedocs.io/en/master/classic/breathing_light.html)
* [micropython-async](https://github.com/peterhinch/micropython-async/blob/master/v3/as_demos/aledflash.py)
* [MicroPython Random number generation?](https://forum.micropython.org/viewtopic.php?t=2727)
* [General information about the ESP8266 port](https://docs.micropython.org/en/latest/esp8266/general.html)
* [MicroPython libraries](http://docs.micropython.org/en/latest/library/index.html)
* [MicroPython 相关库](http://docs.micropython.01studio.org/zh_CN/latest/library/index.html)
* [Enable two-way SSL/TLS for EMQ X](https://www.emqx.io/blog/enable-two-way-ssl-for-emqx)
* [Online UUID Generator](https://www.uuidgenerator.net)
* [乐鑫信息科技](https://www.espressif.com/zh-hans)