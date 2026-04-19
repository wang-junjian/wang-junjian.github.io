---
layout: single
title:  "在 MacBook Pro M2 Max 上安装 TensorFlow"
date:   2023-02-08 08:00:00 +0800
categories: TensorFlow
tags: [MacBookProM2Max]
---

## 安装 TensorFlow
```shell
sudo conda create --name tensorflow python
conda activate tensorflow

# 不指定环境(-n)，默认安装到base环境
sudo conda install -c apple -n tensorflow tensorflow-deps
pip install tensorflow-macos
pip install tensorflow-metal
sudo conda install notebook -y

pip install numpy  --upgrade
pip install pandas  --upgrade
pip install matplotlib  --upgrade
pip install scikit-learn  --upgrade
pip install scipy  --upgrade
pip install plotly  --upgrade
```

## 验证
```py
import sys
import tensorflow.keras
import tensorflow as tf
import platform

print(f"Python Platform: {platform.platform()}")
print(f"Tensor Flow Version: {tf.__version__}")
print(f"Keras Version: {tensorflow.keras.__version__}")
print(f"Python {sys.version}")
gpu = len(tf.config.list_physical_devices('GPU'))>0
print("GPU is", "available" if gpu else "NOT AVAILABLE")
```
```
Python Platform: macOS-13.2-arm64-arm-64bit
Tensor Flow Version: 2.11.0
Keras Version: 2.11.0
Python 3.10.9 (main, Jan 11 2023, 09:18:18) [Clang 14.0.6 ]
GPU is available
```

## 查看可用的设备
```py
import tensorflow as tf
tf.config.experimental.get_visible_devices()
```
```
[PhysicalDevice(name='/physical_device:CPU:0', device_type='CPU'),
 PhysicalDevice(name='/physical_device:GPU:0', device_type='GPU')]
```

## 模型训练（Cifar100）
```py
import tensorflow as tf
from tensorflow.keras.optimizers.legacy import Adam

cifar = tf.keras.datasets.cifar100
(x_train, y_train), (x_test, y_test) = cifar.load_data()
model = tf.keras.applications.ResNet50(
    include_top=True,
    weights=None,
    input_shape=(32, 32, 3),
    classes=100,)

loss_fn = tf.keras.losses.SparseCategoricalCrossentropy(from_logits=True)
model.compile(optimizer=Adam(), loss=loss_fn, metrics=["accuracy"])
model.fit(x_train, y_train, epochs=5, batch_size=64)
```
```
Metal device set to: Apple M2 Max
Epoch 1/5
782/782 [==============================] - 49s 52ms/step - loss: 4.7070 - accuracy: 0.0810
Epoch 2/5
782/782 [==============================] - 38s 49ms/step - loss: 4.4909 - accuracy: 0.0892
Epoch 3/5
782/782 [==============================] - 38s 49ms/step - loss: 3.9776 - accuracy: 0.1300
Epoch 4/5
782/782 [==============================] - 39s 49ms/step - loss: 3.7069 - accuracy: 0.1676
Epoch 5/5
782/782 [==============================] - 39s 49ms/step - loss: 3.6723 - accuracy: 0.1756
```

### 切换设备
* CPU
```py
with tf.device('/device:CPU:0'):
    model.fit(x_train, y_train, epochs=5, batch_size=64)
```

* GPU
```py
with tf.device('/device:GPU:0'):
    model.fit(x_train, y_train, epochs=5, batch_size=64)
```

## 测试结果
使用的 Cifar100 数据集，模型网络 ResNet50，执行 1 次 Epoch。

| 设备         | batch_size(32) | batch_size(64) | batch_size(128) |
| :---------: | -------------- | -------------- | --------------- |
| CPU and GPU | CPU times: user 1min 26s, sys: 29.5s, total: **1min 55s** <br>Wall time: ```1min 28s``` | CPU times: user 50.4s, sys: 16.9s, total: **1min 7s** <br>Wall time: ```51.8s``` | CPU times: user 32.6s, sys: 9.19s, total: **41.8s** <br>Wall time: ```36.5s``` |
| GPU         | CPU times: user 1min 29s, sys: 29.2s, total: **1min 58s** <br>Wall time: ```1min 30s``` | CPU times: user 55.3s, sys: 16.5s, total: **1min 11s** <br>Wall time: ```56.4s``` | CPU times: user 35.6s, sys: 9.37s, total: **45s** <br>Wall time: ```36.9s``` |
| CPU         | CPU times: user 19min 16s, sys: 9min 55s, total: **29min 11s** <br>Wall time: ```8min 26s``` | CPU times: user 17min 18s, sys: 5min 43s, total: **23min 1s** <br>Wall time: ```6min 31s``` | CPU times: user 17min 13s, sys: 5min 20s, total: **22min 34s** <br>Wall time: ```5min 51s``` |


## 参考资料
* [Get started with tensorflow-metal](https://developer.apple.com/metal/tensorflow-plugin/)
* [TensorFlow](https://www.tensorflow.org/?hl=zh-cn)
* [Install TensorFlow on Mac M1/M2 with GPU support](https://medium.com/mlearning-ai/install-tensorflow-on-mac-m1-m2-with-gpu-support-c404c6cfb580)
* [python和R中程序运行时间的计算](https://www.jianshu.com/p/7156d29cb1e4)
* [MBP M1 Max - supspicious GPU usage](https://forums.macrumors.com/threads/mbp-m1-max-supspicious-gpu-usage.2353624/)
* [TensorFlow is not using my M1 MacBook GPU during training](https://stackoverflow.com/questions/67352841/tensorflow-is-not-using-my-m1-macbook-gpu-during-training)
