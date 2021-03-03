---
layout: post
title:  "基于腾讯云物联网开发平台的智能电灯"
date:   2021-02-23 00:00:00 +0800
categories: IoT SmartHome
tags: [MicroPython, MQTT, NodeMCU, ESP8266]
---

## 构建智能电灯
### 硬件
* NodeMCU ESP8266
* 三色LED模块
* 继电器（开关）
* 面包板
* 杜邦线
* USB数据线

### NodeMCU 的管脚图
![](/images/2021/smart-light/nodemcu-pin-definition.png)

### 智能电灯的电路图
![](/images/2021/smart-light/smart-light-circuit-diagram.png)

### 智能电灯
![](/images/2021/smart-light/smart-light.jpg)

## 物联网开发平台
腾讯云物联网开发平台默认开通了一个公共实例，可以免费接入1000个设备，在实例中您可创建项目、产品和设备并进行管理。

### 平台使用流程
![](/images/2021/smart-light/tencent-iot-00.png)

### ① 登录[腾讯云物联网开发平台](https://console.cloud.tencent.com/iotexplorer)控制台
![](/images/2021/smart-light/tencent-iot-01.png)

### ② 进入公共实例
![](/images/2021/smart-light/tencent-iot-02.png)

### ③ 创建项目、产品
1. 新建项目
![](/images/2021/smart-light/tencent-iot-03.png)

2. 保存
![](/images/2021/smart-light/tencent-iot-04.png)

3. 选择智能家居
![](/images/2021/smart-light/tencent-iot-05.png)

4. 新建产品
![](/images/2021/smart-light/tencent-iot-06.png)

5. 保存
![](/images/2021/smart-light/tencent-iot-07.png)

### ④ 定义数据模板
进入智能电灯的数据模板
![](/images/2021/smart-light/tencent-iot-08.png)

### ⑥ 交互开发
![](/images/2021/smart-light/tencent-iot-09.png)

* 配置小程序，快速入口配置
![](/images/2021/smart-light/tencent-iot-10.png)

### ⑦ 设备调试
![](/images/2021/smart-light/tencent-iot-11.png)

1. 新建设备
![](/images/2021/smart-light/tencent-iot-12.png)

2. 设备的详细信息，用于开发的三元组（产品ID、设备名称、设备密钥）
![](/images/2021/smart-light/tencent-iot-13.png)

3. 新建设备的二维码，可以使用腾讯连连扫描快速增加。
![](/images/2021/smart-light/tencent-iot-14.png)

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

* led.py
```py
from machine import PWM
from machine import Pin
class LED():
    """
    LED模块
    """
    def __init__(self, rpin, gpin, bpin, freq=1000):
        """
        构造函数
        :param pin: 接LED的管脚，必须支持PWM
        :param freq: PWM的默认频率是1000
        """
        self.pin_red = Pin(rpin)
        self.pin_green = Pin(gpin)
        self.pin_blue = Pin(bpin)

        self.led_red = PWM(self.pin_red, freq = freq)
        self.led_green = PWM(self.pin_green, freq = freq)
        self.led_blue = PWM(self.pin_blue, freq = freq)

    def rgb_light(self, red, green, blue, brightness):
        if red in range(256) and \
            green in range(256) and \
            blue in range(256) and \
            0.0 <= brightness and \
            brightness <=1.0:
            self.led_red.duty(int(red/255*brightness*1023))
            self.led_green.duty(int(green/255*brightness*1023))
            self.led_blue.duty(int(blue/255*brightness*1023))
        else:
            print("red green blue must between 0 and 255, and brightness from 0.0 to 1.0")
        
    def deinit(self):
        """
        析构函数
        """
        self.led_red.deinit()
        self.led_green.deinit()
        self.led_blue.deinit()
```

* relay.py
```py
from machine import Pin
class Relay():
    """
    继电器，开关
    """
    def __init__(self, pin):
        self.relaypin = Pin(pin, Pin.OUT)

    def set_state(self, state):
        self.relaypin.value(state)
```

* tencent_mqtt.py
```py
import time
import ujson
from umqtt.simple import MQTTClient
from led import LED
from relay import Relay
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
class SmartLigth():
    def __init__(self):
        self.led = LED(5, 4, 0)
        self.relay = Relay(16)

        self.power_switch = 1   #开关(0=off, 1=on)
        self.color = 0          #颜色(0=red, 1=green, 2=blue)
        self.brightness = 100   #亮度(0-100)
        self.name = ''          #灯位置名称
class TencentMQTT():
    light = SmartLigth()

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
        light = TencentMQTT.light
        msg_json = ujson.loads(msg)

        if msg_json['method'] == 'control':
            params = msg_json['params']

            power_switch = params.get('power_switch')
            if power_switch is not None:
                light.power_switch = power_switch
                light.relay.set_state(power_switch)
            
            brightness = params.get('brightness')
            if brightness is not None:
                light.brightness = brightness

            color = params.get('color')
            if color is not None:
                light.color = color
            
            name = params.get('name')
            if name is not None:
                light.name = name

            if color != None or brightness != None:
                light.led.rgb_light(
                    255 if light.color==0 else 0, 
                    255 if light.color==1 else 0, 
                    255 if light.color==2 else 0, 
                    light.brightness/100.0)

    """
    发送设备的状态消息
    """
    def report(self):
        msg = {
            "method": "report",
            "clientToken": "clientToken-0123456789",
            "params": {
                "color": self.light.color,
                "name": self.light.name,
                "power_switch": self.light.power_switch,
                "brightness": self.light.brightness
            }   
        }

        self.mqtt_client.publish(MQTT_DEVICE_STATUS_TOPIC.encode(), ujson.dumps(msg).encode())

    """
    初始化，用于打开电灯。
    """
    def light_on(self):
        msg = {
            "method": "control",
            "clientToken": "clientToken-0123456789",
            "params": {
                "color": self.light.color,
                "name": self.light.name,
                "power_switch": self.light.power_switch,
                "brightness": self.light.brightness
            }
        }

        self.control(MQTT_DEVICE_CONTROL_TOPIC.encode(), ujson.dumps(msg).encode())

    """
    消息循环
    """
    def loop(self):
        self.mqtt_client.subscribe(MQTT_DEVICE_CONTROL_TOPIC.encode())

        # 初始化电灯
        self.light_on()

        up_time = 1000
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
$ ./pyboard.py --device /dev/cu.usbserial-0001 -f cp relay.py led.py wifi.py main.py tencent_mqtt.py :
cp relay.py :relay.py
cp led.py :led.py
cp wifi.py :wifi.py
cp main.py :main.py
cp tencent_mqtt.py :tencent_mqtt.py
```

## 远程控制
### 在微信中打开腾讯连连小程序，扫描下面智能电灯的二维码。
![](/images/2021/smart-light/tencent-iot-14.png)

### 智能电灯的控制界面
![](/images/2021/smart-light/tencent-iot-15.png)

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