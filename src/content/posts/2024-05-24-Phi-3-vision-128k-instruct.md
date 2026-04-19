---
layout: single
title:  "Phi-3-vision-128k-instruct 微软开源多模态大模型"
date:   2024-05-24 08:00:00 +0800
categories: 视觉问答 Phi
tags: [Phi3, OCR, LLM]
---

## [Phi-3-vision-128k-instruct](https://huggingface.co/microsoft/Phi-3-vision-128k-instruct)

Phi-3 Vision 是一个轻量级、最先进的开放多模态模型，基于数据集构建，其中包括合成数据和经过过滤的公开网站，重点关注文本和视觉方面的高质量推理密集数据。该模型属于 Phi-3 模型系列，多模式版本可支持 128K 上下文长度（以 Token 为单位）。该模型经历了严格的增强过程，结合了监督微调和直接偏好优化，以确保精确的指令遵守和稳健的安全措施。

模型参数 4B。

### 预期用途
#### 主要用例

该模型旨在广泛用于英语商业和研究用途。该模型为通用人工智能系统和应用程序提供了视觉和文本输入功能，这些系统和应用程序需要

1. 内存/计算受限的环境；
2. 延迟限制场景；
3. 一般图像理解；
4. 光学字符识别；
5. 图表和表格的理解。

我们的模型旨在加速对高效语言和多模态模型的研究，作为生成人工智能驱动功能的构建块。

#### 用例注意事项

我们的模型并非针对所有下游目的而专门设计或评估。开发人员在选择用例时应考虑语言模型的常见限制，并在特定下游用例中使用之前评估和减轻准确性、安全性和公平性，特别是对于高风险场景。开发人员应了解并遵守与其用例相关的适用法律或法规（包括隐私、贸易合规法等）。

- [Microsoft_Phi-3-Vision-128k Space](https://huggingface.co/spaces/ysharma/Microsoft_Phi-3-Vision-128k)


## 手写文字识别

![](/images/2024/CogVLM2/English-essay.jpg)

`提示词`：对图像文字进行识别

    这段文字是一个人的自己写作，表达了对学生在学校和家庭生活中的看法。

`提示词`：这张图片上写了什么？

    这张图片上写了一段关于学生在学校后备课的观点。

👍 `提示词`：图像中的手写英文是什么？

图像中的手写英文是“I think student have many after-school classes is don't good for they. So I thing the student don't have after-school classes. On school, student have many classes, many home work and compate with classmate. And after school, they are 7:00 p.m go home and they can do homework and do homework. It is so tired, but if they have many st after-school classes, They don't go home el quickly and they don't have enough st sleep. So that they don't good for go to school, YAfter school classes is don't So student don't have many after-school classes. Student have after-school classes for a student, but student have many after-school classes, don't good for student. student don't have many after-school classes.”

👍 `提示词`：识别图像中的手写英文

识别图像中的手写英文是“I think student have many after-school classes is don't good for they. So I thing the student don't have after-school classes. On school, student have many classes, many home work and compate with classmate. And after school, they are 7:00 p.m go home and they can do homework and do homework. It is so tired, but if they have many st after-school classes, They don't go home el quickly and they don't have enough st sleep. So that they don't good for go to school, YAfter school classes is don't So student don't have many after-school classes. Student have after-school classes for a student, but student have many after-school classes, don't good for student. student don't have many after-school classes.”


## 表格

![](/images/2024/CogVLM2/Table.png)

`提示词`：将表格的文字识别转换为markdown格式输出

Certainly, here is the table from the image converted into markdown format:

| 概念 | 一般类 | 二般类 | 数量 | 中 | 底 | 合计 |
| --- | --- | --- | --- | --- | --- | --- |
| 代码注入 | SQL注入: MyBatis | | 4 | 0 | 0 | 4 |
| 有几磁的SQL查询: MyBatis | | | 0 | 8 | 0 | 8 |
| 负责注入 | | | 0 | 3 | 0 | 3 |
| 跨站脚本 | 存储型XSS | | 31 | 0 | 0 | 31 |

The table is titled "1.3 分类统计" and it categorizes different types of code injection into general and specific classes, with columns for quantity, middle, bottom, and total. The categories include SQL code injection with MyBatis, multiple SQL queries with MyBatis, untrusted input, and cross-site scripting with XSS.

另外的表格样式

![](/images/2024/CogVLM2/Table-Performance-of-approaches-on-the-Multilingual-HumanEval-and-MBPP-Benchmarks.png)

`提示词`：将表格的文字识别转换为markdown格式输出

Certainly! Below is the markdown table converted from the image:

| Model                  | Size | Python | C++  | Java | PHP | TS  | C#  | Bash | JS  | Avg  | MBPP  |
|------------------------|------|--------|------|------|-----|-----|-----|------|-----|------|-------|
| **Multilingual Base Models** |      |        |      |      |     |     |     |      |     |      |       |
| code-cushman-001       | 12B  | 33.5%  | 31.9%| 30.6%| 28.9%| 31.3%| 22.1%| 11.7%| -   | -    | -     |
| CodeGeeX2              | 6B   | 36.0%  | 29.2%| 25.9%| 23.6%| 20.8%| 29.7%| 6.3% | 24.8%| 24.5%| 36.2% |
| StarCoderBase          | 16B  | 31.7%  | 31.1%| 28.5%| 25.4%| 34.0%| 34.8%| 8.9% | 29.8%| 28.0%| 42.8% |
| CodeLlama              | 7B   | 31.7%  | 29.8%| 34.2%| 23.6%| 36.5%| 36.7%| 12.0%| 29.2%| 29.2%| 38.6% |
| CodeLlama              | 13B  | 36.0%  | 37.9%| 38.0%| 34.2%| 45.2%| 43.0%| 16.5%| 32.3%| 35.4%| 48.4% |
| CodeLlama              | 34B  | 48.2%  | 44.7%| 44.9%| 41.0%| 42.1%| 48.7%| 15.8%| 42.2%| 41.0%| 55.2% |
| DeepSeek-Coder-Base    | 1.3B | 34.8%  | 31.1%| 32.3%| 24.2%| 28.9%| 36.7%| 10.1%| 28.6%| 28.3%| 46.2% |
| DeepSeek-Coder-Base    | 6.7B | 49.4%  | 50.3%| 43.0%| 38.5%| 49.7%| 50.0%| 28.5%| 48.4%| 44.7%| 60.6% |
| DeepSeek-Coder-Base    | 33B  | 56.1%  | 58.4%| 51.9%| 44.1%| 52.8%| 51.3%| 32.3%| 55.3%| 50.3%| 66.0% |
| **Instruction-Tuned Models** |      |        |      |      |     |     |     |      |     |      |       |
| GPT-3.5-Turbo          | -    | 76.2%  | 63.4%| 69.2%| 60.9%| 69.1%| 70.8%| 42.4%| 67.1%| 64.9%| 70.8% |
| GPT-4                  | -    | 84


## 手机充值

![](/images/2024/CogVLM2/Mobile-phone-recharge.png)

`提示词`：读取图像中的充值号码，商品总价，订单编号，下单时间，充值金额。

```
商品总价：¥199.80
订单编号：RP1409132301302034086454
下单时间：2023-01-30 20:34:08
```

`提示词`：读取图像中的充值号码，商品总价，订单编号，下单时间。

    商品总价：¥199.80，订单编号：RP1409132301302034086454，下单时间：2023-01-30 20:34:08。

👍 `提示词`：读取图像中的信息：充值号码，商品总价，订单编号，下单时间，充值金额。

    充值号码：15552561555，商品总价：¥199.80，订单编号：RP1409132301302034086454，下单时间：2023-01-30 20:34:08。

## 火车票

**不能很好的识别**

![](/images/2024/CogVLM2/train-ticket.jpg)

`提示词`：识别火车票上的信息

    这是一张火车票，它包含了诸多信息，如票号、地点、日期、时间、价格等。

`提示词`：识别火车票上的信息：车次、始发站、到达站、日期、车厢号、金额、姓名。

    这个信息包括了火车票的车次、始发站、到达站、日期、车厢号、金额、姓名等信息。

`提示词`：读取图像中的车次、始发站、到达站、日期、车厢号、金额、姓名。

    车次：K1348，始发站：Guangzhou，到达站：Xi'an，日期：2019年08月27日，车厢号：07号048号，金额：236.0元，姓名：陈美田，姓名：刘文军。

`提示词`：读取图像中的火车票信息，返回姓名、车次、始发站、到达站、日期、车厢号、金额。使用 json 格式输出。

```json
{

 "name": "Guangzhou",

 "train_number": "K1348",

 "departure_station": "Xi'an",

 "departure_date": "2019年08月27日",

 "departure_time": "10:08",

 "arrival_station": "Xi'an",

 "arrival_date": "2019年04月",

 "fare": "236.0元",

 "class": "普通",

 "passenger_number": "6101242005***0934",

 "train_number": "6101242005***0934",

 "departure_station": "Guangzhou",

 "departure_date": "2019年08月27日",

 "departure_time": "10:08",

 "arrival_station": "Xi'an",

 "arrival_date": "2019年04月",

 "fare": "236.0元",

 "class": "普通",

 "passenger_number": "6101242005***0934",


```


## 化学
![](/images/2024/CogVLM2/2024-Huaiyin-Second-Model-Chemistry-Answers.png)

`提示词`：文字识别

**中文识别能力不足**

```
单项选择题
1-5 DB DAB 6-10BBCAD
二、多项选择题
11.CD 12.ABC 13.BD 14.ACD 15.BC
三、非选择题
16.(1)①H2 ②SO2 ③Cu(OH)2 ④ZnCl2
(2)①分子在不断运动；4:5 ②56 ③无机非金属 ④磷定
17.(1)B
(2)Cl2+H2O= HCl+HClO
(3) C
(4) C
(5)①t1 ②不偶和
4:5
③小子
④KNO3的溶解度变温度变化感受明见，且慢温度的开高而增大
18.(1)①十原二氧化碳
②CaCO3+2HCl=H2O+CO2 ＋CaCl2
(2)①BCD ②2H2O2=2H2O+O2 ＃3甘火星 ④磷大
(3)①2NaOH+CO2=Na2CO3+H2O ②3：4
19.(1)Fe ②D
(2)①NH3 ②K2CO3 ③K+、Na+ ④K2SO4+Ba(NO3)2=BaSO4＋2KNO3
⑤MH4Cl、NH4NO3；取少量溶液 E 于试室中，磷加是量的粉砂和 AgNO3 溶液，若有自色沉
淀生成，则溶液 B 中一定有 NH4Cl，若无明显浓染，则溶液 B 中一定有 NH4NO3
20.(1)①Na2CO3 ②碳和氧盐水具碳性，更灭热收二氧化碳
(2)①Cl 、SO4 2- ②14.2 ③不偶正溶液点量：25.9g+200g+208g-23.3g=410.6g
```


## 数学

![](/images/2024/CogVLM2/Math.png)

`提示词`：答题

```
选项 C 是正方根6 的正几何平方根，因为 6 是一个平方根的平方，所以 6 的平方根是 √6。
选项 C 是 24400000 的平几何平方根，因为 24400000 是 244的平方，所以 24400000 的平方根是 244的平方根。
```

**第二题虽然答对了，但解释不对。**


## 英语

![](/images/2024/CogVLM2/English-Fill.png)


`提示词`：下面空白处应该填写什么单词

    下面空白处应该填写“我们今天有什么计划吗？”。

`提示词`：对图像的文字进行识别

    这段文字是一篇人物在另一天的活动中感到非常愉快的描述。

👍 `提示词`：OCR

```
VI. 顺读下面笔述，在室栏处聊人1个途着的单词或指导另单词的正确形式。(共10小题;每小题 1.5 分，满分 15 分)
Last Sunday, I had a perfect day! My aunt came to my home ______ her six-year-old daughter Alice in the morning. While my aunt was talking with my mom at home, my cousin felt a bit ______ (boring). So I took Alice to the park near my home. There we bought two kites and started flying ______ (they). While we were doing that, Alice jumped up and down and I knew she was truly having great fun. Later, we ______ (sit) down on a bench and looked at the gardens. As we were sitting there, Alice looked up at me and said, "What ______ (great day today!" I smiled at her and agreed. We did something quite common, yet we were very happy.
Many people wait for their "best days". But I think today is our perfect day. As adults, we often make plans ______ (careful) in order to have a great day. Some people think that making a lot of money ______ (make) them have a nice day. I think we should be more like ______ (child). They don't think about money ______ (what will happen tomorrow. They really live in the moment and enjoy the moment!
We often hear the expression that we should live in the present. Yesterday is a history. Tomorrow is a mystery. Today is a gift. That's why it ______ (call) present. So seize the day!
```


## 图像生成代码

![](/images/2024/CogVLM2/Xinference.png)

`提示词`：将图像转换成HTML代码

    由于我无法识别图像中的内容，无法将图像转换成HTML代码。


## 数数

![](/images/2024/CogVLM2/PlateSwitch.png)

`提示词`：图像中有多少开关？

    图像中有18个开关。


## 选择题

![](/images/2024/CogVLM2/choice-questions3.png)

![](/images/2024/CogVLM2/choice-questions2.png)

![](/images/2024/CogVLM2/choice-questions1.png)

**上面的选择题探索后，发现不能识别。**

`提示词`：根据图像中涂的 ABCD，来判断用户的回答。

```
根据图像中涂的 ABCD，来判断用户的回答。
根据图像中涂的 ABCD，来判断用户的回答。
...
```

`提示词`：根据图像中的填涂，来判断用户的选择（A，B，C，D），图像中有5道题，答案分别是多少？

根据图像中的填涂，可以得出以下结论：

1. 第26题选择A。
2. 第27题选择A。
3. 第28题选择A。
4. 第29题选择A。
5. 第30题选择A。

因此，答案为：A选择了5次。

`提示词`：图像中用户填涂的选项是？

    图像中用户填涂的选项是 'A', 'B', 'C', 'D'。


## 试卷分数

![](/images/2024/CogVLM2/score.jpg)

👍 `提示词`：请输出图像中的分数

    图像中的分数是18。


## 图像描述

![](/images/2024/CogVLM2/catdog.jpg)

`提示词`：图像中描述的是什么？

图像中描述的是两个动物，一个是犬猫，它们坐在白背景下，犬猫停下脚，它的眼睛呈睁眼状，它的耳朵呈着圆形，它的肩部有着肩膀，它的脚部有着脚膝。它的眼睛呈睁眼状，它的耳朵呈着圆形，它的肩部有着肩膀，它的脚部有着脚膝。它的眼睛呈睁眼状，它的耳朵呈着圆形，它的肩部有着肩膀，它的脚部有着脚膝。......

`提示词`：图像中有几只猫

    图像中只有一只猫。

`提示词`：图像中有几只动物

    图像中有两只动物。

`提示词`：图像包含的每个动物的坐标 [[x0,y0,x1,y1]] ？

    这个问题需要我们知道图像的尺寸以及哪个动物在图像中的坐标。由于我无法观察到图像的尺寸，我无法提供具体的坐标。

`提示词`：图像的尺寸 728 × 561

如果我们知道图像的尺寸（728 × 561），我们可以计算出各个动物的坐标。假设 dog 在图像中的坐标为 [[x0,y0,x1,y1]]，则 dog 的尺寸为 [[x1-x0, y1-y0]]。另外，假设 kitten 在图像中的坐标为 [[x2,y2,x3,y3]]，则 kitten 的尺寸为 [[x3-x2, y3-y2]]。

我们可以计算 dog 和 kitten 的坐标之间的差异，例如：

假设 dog 的坐标为 [[x0,y0,x1,y1]]，假设 kitten 的坐标为 [[x2,y2,x3,y3]]，则 dog 和 kitten 之间的差异为：

假设 dog 的坐标为 [[x0,y0,x1,y1]]，假设 kitten 的坐标为 [[x2,y2,x3,y3]]，则 dog 和 kitten 之间的差异为：

我们可以使用这个差异来计算 dog 和 kitten 之间的尺寸。

我们可以使用这个差异来计算 dog 和 kitten 之间的尺寸。

......

![](/images/2024/CogVLM2/chroma.webp)

`提示词`：图像中描述的是什么？

    图像中描述的是一个文件处理流程，它从文件名“Ingest.py”开始，通过一系列的步骤将文件从源目录中读取，然后将文件拆分成小块，并将这些小块转换为浮点数，最后将这些数据存储到一个文件与映像库的结合的数据库中。
