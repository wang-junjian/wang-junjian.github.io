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

### ChatGPT
```json
{
    "status_code": 200,
    "status_info": "OK",
    "result": [
        {
            "object_type": "car",
            "confidence": 0.85,
            "bounding_box": {
                "x": 100,
                "y": 200,
                "width": 300,
                "height": 200
            }
        },
        {
            "object_type": "person",
            "confidence": 0.95,
            "bounding_box": {
                "x": 400,
                "y": 300,
                "width": 100,
                "height": 200
            }
        }
    ],
    "image_info": {
        "width": 800,
        "height": 600,
        "channels": 3
    }
}
```

* [ChatGPT](https://platform.openai.com/playground?mode=chat)


### [Hugging Face](https://huggingface.co/)

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


### [ModelScope](https://www.modelscope.cn/)

[DAMOYOLO-高性能通用检测模型-S](https://www.modelscope.cn/models/damo/cv_tinynas_object-detection_damoyolo/summary)
```json
"root": {
  "detail": "",
  "code": 0,
  "computation_time": "0.16s",
  "data": {
    "boxes": [
      [
        42.50596237182617,
        134.0857391357422,
        229.2481231689453,
        410.7000732421875
      ],
      [
        377.09912109375,
        126.03817749023438,
        595.2017822265625,
        374.0760803222656
      ],
      [
        213.7623748779297,
        126.1344985961914,
        387.80377197265625,
        402.35455322265625
      ]
    ],
    "labels": [
      "person",
      "person",
      "person"
    ],
    "scores": [
      0.8726242184638977,
      0.8721222281455994,
      0.8559319972991943
    ]
  },
  "id": "838eb20e-4742-4831-b18c-a905ce0dba16",
  "msg": "",
  "queue": 0,
  "queue_time": 0,
  "status": 2
}
```


### [Microsoft Cognitive Services](https://azure.microsoft.com/en-us/products/cognitive-services/vision-services/)

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


### [Google Cloud Vision API](https://cloud.google.com/vision?hl=zh-cn)

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


### [AWS](https://aws.amazon.com/cn/machine-learning/)

[Amazon Rekognition > Custom Labels Guide](https://docs.aws.amazon.com/rekognition/latest/customlabels-dg/detecting-custom-labels.html)

#### Request
```json
{
    "ProjectVersionArn": "string", 
     "Image":{ 
        "S3Object":{
            "Bucket":"string",
            "Name":"string",
            "Version":"string"
         }
    },
    "MinConfidence": 90,
    "MaxLabels": 10,
}
```

#### Response
```json
{
    "CustomLabels": [
        {
            "Name": "MyLogo",
            "Confidence": 77.7729721069336,
            "Geometry": {
                "BoundingBox": {
                    "Width": 0.198987677693367,
                    "Height": 0.31296101212501526,
                    "Left": 0.07924537360668182,
                    "Top": 0.4037395715713501
                }
            }
        }
    ]
}
```

* [AWS 上的免费机器学习服务](https://aws.amazon.com/cn/free/machine-learning/)
* [Amazon Rekognition 利用机器学习自动执行图像识别和视频分析](https://aws.amazon.com/cn/rekognition/)
* [AWS > Documentation > Amazon Rekognition > DetectCustomLabels](https://docs.aws.amazon.com/rekognition/latest/APIReference/API_DetectCustomLabels.html)


### [阿里云 X 达摩院](https://vision.aliyun.com/)

[图像理解 > 物体检测](https://vision.aliyun.com/experience/detail?tagName=objectdet&children=DetectObject)
```json
{
    "success": true,
    "data": {
        "data": {
            "RequestId": "A33CD921-3CAE-5BA5-8233-6B3F0C792265",
            "Data": {
                "Height": 533,
                "Elements": [
                    {
                        "Type": "dog",
                        "Score": 0.532,
                        "Boxes": [
                            205,
                            1,
                            417,
                            531
                        ]
                    }
                ],
                "Width": 948
            }
        },
        "url": "https://objectdet.cn-shanghai.aliyuncs.com/",
        "during": 356,
        "headers": {
            "response": {
                "date": "Wed, 05 Apr 2023 02:54:54 GMT",
                "content-type": "application/json;charset=utf-8",
                "content-length": "152",
                "connection": "keep-alive",
                "access-control-allow-origin": "*",
                "x-acs-request-id": "A33CD921-3CAE-5BA5-8233-6B3F0C792265",
                "x-acs-trace-id": "f1e1b9ee3bc9d270bd9339a5989e271f"
            }
        }
    },
    "requestId": "7914edd5-a415-4a5b-bb81-58bc537f3cc5"
}
```

* [阿里云AI平台](https://ai.aliyun.com/index)
* [阿里云 X 达摩院 视觉智能开放平台](https://vision.aliyun.com/)


### [腾讯云](https://cloud.tencent.com/product#ai-class)

[图像识别 > 商品识别](https://cloud.tencent.com/document/product/865/36457)
```json
{
    "Response": {
        "Products": [
            {
                "Name": "男士西服套装",
                "Parents": "服饰内衣-男装",
                "Confidence": 59,
                "XMin": 336,
                "YMin": 191,
                "XMax": 799,
                "YMax": 775
            },
            {
                "Name": "休闲鞋",
                "Parents": "鞋靴-时尚女鞋",
                "Confidence": 40,
                "XMin": 466,
                "YMin": 1209,
                "XMax": 695,
                "YMax": 1377
            }
        ],
        "RequestId": "2bd4243f-4d26-4246-a5f4-0f2dbc730d62"
    }
}
```


### [旷视 Face++](https://www.faceplusplus.com.cn)

[车牌识别 API](https://console.faceplusplus.com.cn/documents/33915254)
```json
{
    "image_id": "ZZX0dA3yA+75FnXZ3lpDug==", 
    "request_id": "1524109138,f262f388-8562-4da1-9a9b-5de2cb05e50f", 
    "time_used": 1048, 
    "results": [
        {
            "color": 0, 
            "license_plate_number": "黑AF6655", 
            "bound": {
                "left_bottom": {
                    "y": 654, 
                    "x": 372
                }, 
                "right_top": {
                    "y": 416, 
                    "x": 1334
                }, 
                "right_bottom": {
                    "y": 645, 
                    "x": 1302
                }, 
                "left_top": {
                    "y": 424, 
                    "x": 404
                }
            }
        }
    ]
}
```

* [旷视](https://www.megvii.com)


### [Eden AI](https://www.edenai.co/)
Eden AI 提供了一个连接到最佳人工智能引擎的独特 API。

[Object Detection](https://docs.edenai.co/reference/image_object_detection_create)
```json
{
  "api4ai": {
    "items": [
      {
        "label": "person",
        "confidence": 0.659053385257721,
        "x_min": 0.6336137056350708,
        "x_max": 0.827919602394104,
        "y_min": 0.4696902632713318,
        "y_max": 0.7678610384464264
      },
      {
        "label": "couch",
        "confidence": 0.455354243516922,
        "x_min": 0.4121762216091156,
        "x_max": 0.6568307876586914,
        "y_min": 0.4908463656902313,
        "y_max": 0.6873724162578583
      },
      {
        "label": "book",
        "confidence": 0.439803808927536,
        "x_min": 0.4353419542312622,
        "x_max": 0.49192070960998535,
        "y_min": 0.6771218180656433,
        "y_max": 0.7233667559921741
      }
    ]
  },
  "microsoft": {
    "items": [
      {
        "label": "couch",
        "confidence": 0.771,
        "x_min": 0.4140625,
        "x_max": 0.6510416666666666,
        "y_min": 0.5120370370370371,
        "y_max": 0.6990740740740741
      },
      {
        "label": "person",
        "confidence": 0.71,
        "x_min": 0.6541666666666667,
        "x_max": 0.840625,
        "y_min": 0.46944444444444444,
        "y_max": 0.7518518518518519
      },
      {
        "label": "couch",
        "confidence": 0.699,
        "x_min": 0.6692708333333334,
        "x_max": 0.9359375,
        "y_min": 0.5055555555555555,
        "y_max": 0.925
      }
    ]
  }
}
```


## AI 提供商
![](https://uploads-ssl.webflow.com/61e7d259b7746e2d1df0b68d/636bd072a9cee1141b1497fc_Eden%20AI%20APIs%20(3).png)
* [api4ai](https://api4.ai)
* [mindee - OCR API](https://mindee.com/)
* [Voxist - Voice AI](https://www.voxist.com)
* [Symbl.ai - 对话](https://symbl.ai)
* [SmartClick - ](https://smartclick.ai)
* [AWS](https://aws.amazon.com/cn/machine-learning/)
* [Rev - 语音转文本](https://www.rev.com)


## 参考资料
* [Azure Cognitive Services documentation](https://learn.microsoft.com/en-us/azure/cognitive-services/)
* [Google Cloud AI 和机器学习产品](https://cloud.google.com/products/ai?hl=zh-cn)
* [Classify Images of Clouds in the Cloud with AutoML Images](https://www.cloudskillsboost.google/focuses/8406?parent=catalog)
* [云从AI开发平台](https://ai.cloudwalk.com/cloudwalk/)
* [云从科技开放平台文档中心](https://ai.cloudwalk.com/wiki)
