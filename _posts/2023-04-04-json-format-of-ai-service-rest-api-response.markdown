---
layout: post
title:  "人工智能服务 REST API 响应的 JSON 格式"
date:   2023-04-04 08:00:00 +0800
categories: RESTAPI
tags: [AI, JSON]
---

## 什么是 REST API？
REST API 也称为 RESTful API，是遵循 REST 架构规范的应用编程接口（API 或 Web API），支持与 RESTful Web 服务进行交互。REST 是表述性状态传递的英文缩写，由计算机科学家 Roy Fielding 创建。

## 如何实现 RESTful API？
API 要被视为 RESTful API，必须遵循以下标准：
* 客户端-服务器架构由客户端、服务器和资源组成，并且通过 HTTP 管理请求。
* 无状态客户端-服务器通信，即 get 请求间隔期间，不会存储任何客户端信息，并且每个请求都是独立的，互不关联。
* 可缓存性数据：可简化客户端-服务器交互。
* 组件间的统一接口：使信息以标准形式传输。这要求：
  - 所请求的资源可识别并与发送给客户端的表述分离开。
  - 客户端可通过接收的表述操作资源，因为表述包含操作所需的充足信息。
  - 返回给客户端的自描述消息包含充足的信息，能够指明客户端应该如何处理所收到的信息。
  - 超文本/超媒体可用，是指在访问资源后，客户端应能够使用超链接查找其当前可采取的所有其他操作。
* 组织各种类型服务器（负责安全性、负载平衡等的服务器）的分层系统会参与将请求的信息检索到对客户端不可见的层次结构中。
* 按需编码（可选）：能够根据请求将可执行代码从服务器发送到客户端，从而扩展客户端功能。 

虽然 REST API 需要遵循这些标准，但是仍比遵循规定的协议更容易，如 SOAP（简单对象访问协议），该协议具有 XML 消息传递、内置安全性和事务合规性等具体要求，因此速度较慢、结构繁重。 

相比之下，REST 则是一组可按需实施的准则，使 REST API 速度更快、更轻，可扩展性更高，非常适合物联网（IoT）和移动应用开发。 

* [Representational State Transfer (REST)](https://www.ics.uci.edu/~fielding/pubs/dissertation/rest_arch_style.htm)
* [Architectural Styles and the Design of Network-based Software Architectures](https://www.ics.uci.edu/~fielding/pubs/dissertation/top.htm)
* [架构风格与基于网络应用软件的架构设计](https://www.infoq.cn/minibook/web-based-apps-archit-design)
* [什么是 REST API？](https://www.redhat.com/zh/topics/api/what-is-a-rest-api)
* [SOAP 和 REST 区别解析](https://www.redhat.com/zh/topics/integration/whats-the-difference-between-soap-rest)
* [介绍 Web 基础架构设计原则的经典论文《架构风格与基于网络的软件架构设计》导读](https://www.infoq.cn/article/doctor-fielding-article-review)

## 人工智能服务
<details><summary>Hugging Face</summary>

[Object Detection](https://huggingface.co/tasks/object-detection)

```json
[
  {
    "score": 0.9964052438735962,
    "label": "person",
    "box": {
      "xmin": 422,
      "ymin": 65,
      "xmax": 643,
      "ymax": 495
    }
  },
  {
    "score": 0.9997736811637878,
    "label": "sports ball",
    "box": {
      "xmin": 94,
      "ymin": 445,
      "xmax": 175,
      "ymax": 517
    }
  }
]
```

</details>

<details><summary>Microsoft Cognitive Services</summary>

[Microsoft > Cognitive Services > Computer Vision API](https://westus.dev.cognitive.microsoft.com/docs/services/computer-vision-v3-2/operations/5e0cdeda77a84fcd9a6d4e1b)
```json
{
  "objects": [
    {
      "rectangle": {
        "x": 0,
        "y": 0,
        "w": 50,
        "h": 50
      },
      "object": "tree",
      "confidence": 0.9,
      "parent": {
        "object": "plant",
        "confidence": 0.95
      }
    }
  ],
  "requestId": "1ad0e45e-b7b4-4be3-8042-53be96103337",
  "metadata": {
    "width": 100,
    "height": 100,
    "format": " Jpeg"
  },
  "modelVersion": "2021-04-01"
}
```

[Azure > Cognitive Services > Computer Vision > Object detection](https://learn.microsoft.com/en-us/azure/cognitive-services/computer-vision/concept-object-detection)
```json
{
   "objects":[
      {
         "rectangle":{
            "x":730,
            "y":66,
            "w":135,
            "h":85
         },
         "object":"kitchen appliance",
         "confidence":0.501
      },
      {
         "rectangle":{
            "x":523,
            "y":377,
            "w":185,
            "h":46
         },
         "object":"computer keyboard",
         "confidence":0.51
      },
      {
         "rectangle":{
            "x":471,
            "y":218,
            "w":289,
            "h":226
         },
         "object":"Laptop",
         "confidence":0.85,
         "parent":{
            "object":"computer",
            "confidence":0.851
         }
      },
      {
         "rectangle":{
            "x":654,
            "y":0,
            "w":584,
            "h":473
         },
         "object":"person",
         "confidence":0.855
      }
   ],
   "requestId":"25018882-a494-4e64-8196-f627a35c1135",
   "metadata":{
      "height":473,
      "width":1260,
      "format":"Jpeg"
   },
   "modelVersion":"2021-05-01"
}
```

[Azure > Cognitive Services > Vision Studio > Detect common objects in images](https://portal.vision.cognitive.azure.com/demo/generic-object-detection)
```json
{
  "objectsResult": {
    "values": [
      {
        "boundingBox": {
          "x": 238,
          "y": 298,
          "w": 177,
          "h": 117
        },
        "tags": [
          {
            "name": "Skateboard",
            "confidence": 0.904
          }
        ]
      },
      {
        "boundingBox": {
          "x": 118,
          "y": 62,
          "w": 305,
          "h": 321
        },
        "tags": [
          {
            "name": "person",
            "confidence": 0.955
          }
        ]
      }
    ]
  },
  "modelVersion": "2023-02-01-preview",
  "metadata": {
    "width": 600,
    "height": 462
  }
}
```

</details>

<details><summary>Google Cloud Vision API</summary>

[Vision AI](https://cloud.google.com/vision?hl=zh-cn)
```json
{
  "localizedObjectAnnotations": [
    {
      "boundingPoly": {
        "normalizedVertices": [
          {
            "x": 0.007744863,
            "y": 0.079945266
          },
          {
            "x": 0.9569666,
            "y": 0.079945266
          },
          {
            "x": 0.9569666,
            "y": 0.76662236
          },
          {
            "x": 0.007744863,
            "y": 0.76662236
          }
        ]
      },
      "mid": "/m/0hnnb",
      "name": "Umbrella",
      "score": 0.7512299
    },
    {
      "boundingPoly": {
        "normalizedVertices": [
          {
            "x": 0.39253283,
            "y": 0.27567247
          },
          {
            "x": 0.9210803,
            "y": 0.27567247
          },
          {
            "x": 0.9210803,
            "y": 0.9934403
          },
          {
            "x": 0.39253283,
            "y": 0.9934403
          }
        ]
      },
      "mid": "/m/01g317",
      "name": "Person",
      "score": 0.70294976
    }
  ]
}
```

</details>


## 参考资料
* [Azure Cognitive Services documentation](https://learn.microsoft.com/en-us/azure/cognitive-services/)
* [Google Cloud AI 和机器学习产品](https://cloud.google.com/products/ai?hl=zh-cn)
* [Classify Images of Clouds in the Cloud with AutoML Images](https://www.cloudskillsboost.google/focuses/8406?parent=catalog)
