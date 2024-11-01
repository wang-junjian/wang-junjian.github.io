---
layout: post
title:  "华为 Atlas A2 算力切分"
date:   2024-10-31 10:00:00 +0800
categories: Atlas800 vNPU
tags: [Atlas800, NPU, MindIE, LLM]
---

## 算力切分
### 查询算力切分模式
```shell
sudo npu-smi info -t vnpu-mode
```
```shell
    vnpu-mode                      : docker
```

### 查询算力切分模板信息
```shell
sudo npu-smi info -t template-info
```
```shell
+------------------------------------------------------------------------------------------+
|NPU instance template info is:                                                            |
|Name                AICORE    Memory    AICPU     VPC            VENC           JPEGD     |
|                               GB                 PNGD           VDEC           JPEGE     |
|==========================================================================================|
|vir10_3c_16g        10        16        3         4              0              12        |
|                                                  0              1              2         |
+------------------------------------------------------------------------------------------+
|vir10_4c_16g_m      10        16        4         9              0              24        |
|                                                  0              2              4         |
+------------------------------------------------------------------------------------------+
|vir10_3c_16g_nm     10        16        3         0              0              0         |
|                                                  0              0              0         |
+------------------------------------------------------------------------------------------+
|vir05_1c_8g         5         8         1         2              0              6         |
|                                                  0              0              1         |
+------------------------------------------------------------------------------------------+
```

### 查询指定芯片的 vNPU
```shell
sudo npu-smi info -t info-vnpu -i 0 -c 0
```
```shell
+-------------------------------------------------------------------------------+
| NPU resource static info as follow:                                           |
| Format:Free/Total                   NA: Currently, query is not supported.    |
| AICORE    Memory    AICPU    VPC    VENC    VDEC    JPEGD    JPEGE    PNGD    |
|            GB                                                                 |
|===============================================================================|
| 20/20     28/32     6/6      9/9    0/0     2/2     24/24    4/4      NA/NA   |
+-------------------------------------------------------------------------------+
| Total number of vnpu: 0                                                       |
+-------------------------------------------------------------------------------+
|  Vnpu ID  |  Vgroup ID     |  Container ID  |  Status  |  Template Name       |
+-------------------------------------------------------------------------------+
```

创建 vNPU 后查询可以看到 vNPU 的信息

```shell
+-------------------------------------------------------------------------------+
| NPU resource static info as follow:                                           |
| Format:Free/Total                   NA: Currently, query is not supported.    |
| AICORE    Memory    AICPU    VPC    VENC    VDEC    JPEGD    JPEGE    PNGD    |
|            GB                                                                 |
|===============================================================================|
| 0/20      0/32      1/7      1/9    0/0     0/2     0/24     0/4      NA/NA   |
+-------------------------------------------------------------------------------+
| Total number of vnpu: 2                                                       |
+-------------------------------------------------------------------------------+
|  Vnpu ID  |  Vgroup ID     |  Container ID  |  Status  |  Template Name       |
+-------------------------------------------------------------------------------+
|  100      |  0             |  000000000000  |  0       |  vir10_3c_16g        |
+-------------------------------------------------------------------------------+
|  101      |  1             |  000000000000  |  0       |  vir10_3c_16g        |
+-------------------------------------------------------------------------------+
```

### 创建指定芯片的 vNPU
```shell
sudo npu-smi set -t create-vnpu -i 0 -c 0 -f vir10_3c_16g
```
```shell
	Status                         : OK
	Message                        : Create vnpu success
```

### 销毁指定芯片的 vNPU
```shell
sudo npu-smi set -t destroy-vnpu -i 0 -c 0 -v 100
```
```shell
  Status                         : OK
  Message                        : Destroy vnpu 100 success
```


## 实验
### 算力切分
- NPU 1
```shell
sudo npu-smi set -t create-vnpu -i 0 -c 0 -f vir10_3c_16g
sudo npu-smi set -t create-vnpu -i 0 -c 0 -f vir10_3c_16g

sudo npu-smi info -t info-vnpu -i 0 -c 0
```
```shell
+-------------------------------------------------------------------------------+
| NPU resource static info as follow:                                           |
| Format:Free/Total                   NA: Currently, query is not supported.    |
| AICORE    Memory    AICPU    VPC    VENC    VDEC    JPEGD    JPEGE    PNGD    |
|            GB                                                                 |
|===============================================================================|
| 0/20      0/32      1/7      1/9    0/0     0/2     0/24     0/4      NA/NA   |
+-------------------------------------------------------------------------------+
| Total number of vnpu: 2                                                       |
+-------------------------------------------------------------------------------+
|  Vnpu ID  |  Vgroup ID     |  Container ID  |  Status  |  Template Name       |
+-------------------------------------------------------------------------------+
|  100      |  0             |  ffffffffffff  |  1       |  vir10_3c_16g        |
+-------------------------------------------------------------------------------+
|  101      |  1             |  000000000000  |  0       |  vir10_3c_16g        |
+-------------------------------------------------------------------------------+
```

- NPU 2
```shell
sudo npu-smi set -t create-vnpu -i 1 -c 0 -f vir10_3c_16g
sudo npu-smi set -t create-vnpu -i 1 -c 0 -f vir10_3c_16g

sudo npu-smi info -t info-vnpu -i 1 -c 0
```
```shell
+-------------------------------------------------------------------------------+
| NPU resource static info as follow:                                           |
| Format:Free/Total                   NA: Currently, query is not supported.    |
| AICORE    Memory    AICPU    VPC    VENC    VDEC    JPEGD    JPEGE    PNGD    |
|            GB                                                                 |
|===============================================================================|
| 0/20      0/32      1/7      1/9    0/0     0/2     0/24     0/4      NA/NA   |
+-------------------------------------------------------------------------------+
| Total number of vnpu: 2                                                       |
+-------------------------------------------------------------------------------+
|  Vnpu ID  |  Vgroup ID     |  Container ID  |  Status  |  Template Name       |
+-------------------------------------------------------------------------------+
|  116      |  0             |  000000000000  |  0       |  vir10_3c_16g        |
+-------------------------------------------------------------------------------+
|  117      |  1             |  000000000000  |  0       |  vir10_3c_16g        |
+-------------------------------------------------------------------------------+
```

- NPU 3
```shell
sudo npu-smi set -t create-vnpu -i 2 -c 0 -f vir10_3c_16g
sudo npu-smi set -t create-vnpu -i 2 -c 0 -f vir10_3c_16g

sudo npu-smi info -t info-vnpu -i 2 -c 0
```
```shell
+-------------------------------------------------------------------------------+
| NPU resource static info as follow:                                           |
| Format:Free/Total                   NA: Currently, query is not supported.    |
| AICORE    Memory    AICPU    VPC    VENC    VDEC    JPEGD    JPEGE    PNGD    |
|            GB                                                                 |
|===============================================================================|
| 0/20      0/32      1/7      1/9    0/0     0/2     0/24     0/4      NA/NA   |
+-------------------------------------------------------------------------------+
| Total number of vnpu: 2                                                       |
+-------------------------------------------------------------------------------+
|  Vnpu ID  |  Vgroup ID     |  Container ID  |  Status  |  Template Name       |
+-------------------------------------------------------------------------------+
|  132      |  0             |  000000000000  |  0       |  vir10_3c_16g        |
+-------------------------------------------------------------------------------+
|  133      |  1             |  000000000000  |  0       |  vir10_3c_16g        |
+-------------------------------------------------------------------------------+
```

- NPU 4
```shell
sudo npu-smi set -t create-vnpu -i 3 -c 0 -f vir10_3c_16g
sudo npu-smi set -t create-vnpu -i 3 -c 0 -f vir10_3c_16g

sudo npu-smi info -t info-vnpu -i 3 -c 0
```
```shell
+-------------------------------------------------------------------------------+
| NPU resource static info as follow:                                           |
| Format:Free/Total                   NA: Currently, query is not supported.    |
| AICORE    Memory    AICPU    VPC    VENC    VDEC    JPEGD    JPEGE    PNGD    |
|            GB                                                                 |
|===============================================================================|
| 0/20      0/32      1/7      1/9    0/0     0/2     0/24     0/4      NA/NA   |
+-------------------------------------------------------------------------------+
| Total number of vnpu: 2                                                       |
+-------------------------------------------------------------------------------+
|  Vnpu ID  |  Vgroup ID     |  Container ID  |  Status  |  Template Name       |
+-------------------------------------------------------------------------------+
|  148      |  0             |  000000000000  |  0       |  vir10_3c_16g        |
+-------------------------------------------------------------------------------+
|  149      |  1             |  000000000000  |  0       |  vir10_3c_16g        |
+-------------------------------------------------------------------------------+
```

- NPU 5
```shell
sudo npu-smi set -t create-vnpu -i 4 -c 0 -f vir10_3c_16g
sudo npu-smi set -t create-vnpu -i 4 -c 0 -f vir10_3c_16g

sudo npu-smi info -t info-vnpu -i 4 -c 0
```
```shell
+-------------------------------------------------------------------------------+
| NPU resource static info as follow:                                           |
| Format:Free/Total                   NA: Currently, query is not supported.    |
| AICORE    Memory    AICPU    VPC    VENC    VDEC    JPEGD    JPEGE    PNGD    |
|            GB                                                                 |
|===============================================================================|
| 0/20      0/32      1/7      1/9    0/0     0/2     0/24     0/4      NA/NA   |
+-------------------------------------------------------------------------------+
| Total number of vnpu: 2                                                       |
+-------------------------------------------------------------------------------+
|  Vnpu ID  |  Vgroup ID     |  Container ID  |  Status  |  Template Name       |
+-------------------------------------------------------------------------------+
|  164      |  0             |  000000000000  |  0       |  vir10_3c_16g        |
+-------------------------------------------------------------------------------+
|  165      |  1             |  000000000000  |  0       |  vir10_3c_16g        |
+-------------------------------------------------------------------------------+
```

- NPU 6
```shell
sudo npu-smi set -t create-vnpu -i 5 -c 0 -f vir10_3c_16g
sudo npu-smi set -t create-vnpu -i 5 -c 0 -f vir10_3c_16g

sudo npu-smi info -t info-vnpu -i 5 -c 0
```
```shell
+-------------------------------------------------------------------------------+
| NPU resource static info as follow:                                           |
| Format:Free/Total                   NA: Currently, query is not supported.    |
| AICORE    Memory    AICPU    VPC    VENC    VDEC    JPEGD    JPEGE    PNGD    |
|            GB                                                                 |
|===============================================================================|
| 0/20      0/32      1/7      1/9    0/0     0/2     0/24     0/4      NA/NA   |
+-------------------------------------------------------------------------------+
| Total number of vnpu: 2                                                       |
+-------------------------------------------------------------------------------+
|  Vnpu ID  |  Vgroup ID     |  Container ID  |  Status  |  Template Name       |
+-------------------------------------------------------------------------------+
|  180      |  0             |  000000000000  |  0       |  vir10_3c_16g        |
+-------------------------------------------------------------------------------+
|  181      |  1             |  000000000000  |  0       |  vir10_3c_16g        |
+-------------------------------------------------------------------------------+
```

- NPU 7
```shell
sudo npu-smi set -t create-vnpu -i 6 -c 0 -f vir10_3c_16g
sudo npu-smi set -t create-vnpu -i 6 -c 0 -f vir10_3c_16g

sudo npu-smi info -t info-vnpu -i 6 -c 0
```
```shell
+-------------------------------------------------------------------------------+
| NPU resource static info as follow:                                           |
| Format:Free/Total                   NA: Currently, query is not supported.    |
| AICORE    Memory    AICPU    VPC    VENC    VDEC    JPEGD    JPEGE    PNGD    |
|            GB                                                                 |
|===============================================================================|
| 0/20      0/32      1/7      1/9    0/0     0/2     0/24     0/4      NA/NA   |
+-------------------------------------------------------------------------------+
| Total number of vnpu: 2                                                       |
+-------------------------------------------------------------------------------+
|  Vnpu ID  |  Vgroup ID     |  Container ID  |  Status  |  Template Name       |
+-------------------------------------------------------------------------------+
|  196      |  0             |  000000000000  |  0       |  vir10_3c_16g        |
+-------------------------------------------------------------------------------+
|  197      |  1             |  000000000000  |  0       |  vir10_3c_16g        |
+-------------------------------------------------------------------------------+
```

- NPU 8
```shell
sudo npu-smi set -t create-vnpu -i 7 -c 0 -f vir10_3c_16g
sudo npu-smi set -t create-vnpu -i 7 -c 0 -f vir10_3c_16g

sudo npu-smi info -t info-vnpu -i 7 -c 0
```
```shell
+-------------------------------------------------------------------------------+
| NPU resource static info as follow:                                           |
| Format:Free/Total                   NA: Currently, query is not supported.    |
| AICORE    Memory    AICPU    VPC    VENC    VDEC    JPEGD    JPEGE    PNGD    |
|            GB                                                                 |
|===============================================================================|
| 0/20      0/32      1/7      1/9    0/0     0/2     0/24     0/4      NA/NA   |
+-------------------------------------------------------------------------------+
| Total number of vnpu: 2                                                       |
+-------------------------------------------------------------------------------+
|  Vnpu ID  |  Vgroup ID     |  Container ID  |  Status  |  Template Name       |
+-------------------------------------------------------------------------------+
|  212      |  0             |  000000000000  |  0       |  vir10_3c_16g        |
+-------------------------------------------------------------------------------+
|  213      |  1             |  000000000000  |  0       |  vir10_3c_16g        |
+-------------------------------------------------------------------------------+
```

### vNPU

| NPU 设备ID | NPU 芯片ID | vNPU ID | 
| --- | --- | --- |
| 0 | 0 | 100 |
| 0 | 0 | 101 |
| 1 | 1 | 116 |
| 1 | 1 | 117 |
| 2 | 2 | 132 |
| 2 | 2 | 133 |
| 3 | 3 | 148 |
| 3 | 3 | 149 |
| 4 | 4 | 164 |
| 4 | 4 | 165 |
| 5 | 5 | 180 |
| 5 | 5 | 181 |
| 6 | 6 | 196 |
| 6 | 6 | 197 |
| 7 | 7 | 212 |
| 7 | 7 | 213 |

### 容器挂载 vNPU
```shell
sudo docker run --rm -it \
  --device=/dev/vdavinci100:/dev/davinci100 \
  --device=/dev/davinci_manager \
  --device=/dev/devmm_svm \
  --device=/dev/hisi_hdc \
  -v /usr/local/bin/npu-smi:/usr/local/bin/npu-smi \
  -v /home:/home \
  -v /usr/local/Ascend/driver/lib64/common:/usr/local/Ascend/driver/lib64/common \
  -v /usr/local/Ascend/driver/lib64/driver:/usr/local/Ascend/driver/lib64/driver \
  -v /etc/ascend_install.info:/etc/ascend_install.info \
  -v /usr/local/Ascend/driver/version.info:/usr/local/Ascend/driver/version.info \
  mindie  /bin/bash
```


## 参考资料
- [Atlas A2 中心推理和训练硬件 24.1.RC2 npu-smi 命令参考 06 - 算力切分相关命令](https://support.huawei.com/enterprise/zh/doc/EDOC1100388864/2a7c2b55?idPath=23710424|251366513|254884019|261408772|261457531)
- [任正非最新讲话：现在不能说华为就能活下来](https://www.163.com/tech/article/JFTA907N00098IEO.html)
