---
layout: single
title:  "讯飞星火测试"
date:   2023-05-06 08:00:00 +0800
categories: [操作系统, 编程开发]
tags: [chatgpt]
---

[Spark Desk](https://xinghuo.xfyun.cn/desk) 是讯飞星火认知大模型的英文名称。

## 👍零样本分类
```
❓ “这个手机的功能不好用”这是好评还是差评？
```

```
💬 这个手机的功能不好用，是差评。
```

## 👎少样本分类
```
❓ 电脑：3C；手机：3C；铅笔：
```

```
💬 3C;
```

## 👍英语语法更正
```
❓ Correct this to standard English:

She no went to the market.
```

```
💬 She did not go to the market.
```
**ChatGPT 还会解释语法的问题**

## 👍翻译
### 英译中
```
❓ What rooms do you have available? 翻译成中文
```

```
💬 你有哪些房间可用？
```

### 中译英
```
❓ 您好，您想要预订哪些房型呢？翻译成英文
```

```
💬 Hello, which room type would you like to book?
```

## 👍阅读理解
```
❓ 北京市卫生健康委副主任、新闻发言人李昂通报：4月18日下午，长峰医院突发火情，市卫生健康委即刻启动应急预案，迅速调集29辆救护车300余人次急救力量，及时赶赴现场，全力开展医疗救援和转运工作。截至当日15时30分，共转运伤员71名，分别送至解放军总医院第一医学中心、解放军总医院第五医学中心南、北院区、北京世纪坛医院、航天中心医院、电力医院、玉泉医院、丰台区医院、右安门医院等9家医疗机构救治。涉灾病房楼其余住院患者均已妥善安置。
为全力救治伤病员，市卫生健康委抽调精干力量，统筹全市医疗资源，紧急成立现场医疗救治指挥部，迅速组建市级救治专家组，投入医护力量633人，ICU床位32张，协调北京协和医院、中日友好医院、北大人民医院、朝阳医院、宣武医院的重症、呼吸、心内、内分泌等学科国家级和市级专家，进驻救治医院，逐一现场会诊，制定个性化诊疗方案，做到一人一策，争分夺秒、全力以赴救治伤病员。截至4月19日6时，71名转运伤员中，在院治疗39人，出院3人，死亡29人。在死亡人员中，男性13人、女性16人；长峰医院住院患者26人、患者家属1人、护工1人、护士1人；北京26人，河北、湖南、山东各1人。26名长峰医院住院患者平均年龄71.2岁，最小40岁，最大88岁，其中40-49岁2人，50-59岁3人，60-69岁3人，70-79岁13人，80岁以上5人。在院治疗39名伤病员，危重3人、重症18人、病情平稳18人；男性17人、女性22人；长峰医院住院患者29人、患者家属5人、护工2人、医护3人。

上面这篇报道死了多少人？事故原因是什么？
```

```
💬 根据报道，截至4月19日6时，共有29人死亡。关于事故原因，报道未提及。
```

```
❓ 上面这篇报道健康委副主任是？
```

```
💬 报道中提到北京市卫生健康委员会的副主任是李昂。
```

* [北京长峰医院火灾致29人遇难，一文看懂这场重要的发布会](https://www.163.com/news/article/I2MK6HCN0001899N.html)

## 数学
### 👎358*176=63008
```
❓ 358*176
```

```
💬 358*176=60928
```

## ❌画画（不具备）
### 画猫和狗
```
💬 抱歉，我是一个认知智能模型AI,无法画画。但我可以给你描述一下如何画猫和狗：
画猫：
1. 首先，画出猫的头部轮廓。从上往下画一个弧形，再在两侧向下画两个半圆形，作为耳朵。
2. 然后，在头部中央位置画两只大圆眼睛和一个小三角形鼻子。
3. 接着，画出猫的嘴巴和舌头，让它们呈现出微笑的样子。
4. 接下来，画出猫的身体和四只爪子。身体可以是椭圆形或圆柱形，而爪子可以是弯曲的。
5. 最后，给猫加上一些细节，例如条纹、斑点等等。

画狗：
1. 先画出狗的头部轮廓。从头到尾画一条长条形，再分别向下划两条弯曲的线表示两只耳朵。
2. 然后，画出狗的眼睛和鼻子。眼睛应该相对较大且突出，鼻子应该比较小而且圆润。
3. 接下来，画出狗的身体和四只腿。身体可以是长方形或者椭圆形，而腿应该弯曲并有不同的长度。
4. 然后，给狗加上一些特征性标记。例如，嘴巴上的胡须、眼睛周围的斑纹等等。
5. 最后，用线条勾勒出狗的轮廓并加上阴影，使其看起来更加立体化和真实。
```

## 编码
### 👍自然语言描述生成 Python 代码
```py
❓ """
1. 创建名字列表
2. 创建姓氏列表
3. 随机组合成100个全名的列表
"""
```

💬 `这是一个 Python 代码示例，用于生成100个随机的名字列表：`
```py
import random

# 创建名字列表
names = ['Tom', 'Jerry', 'Mike', 'Alice']

# 创建姓氏列表
last_names = ['Smith', 'Johnson', 'Williams', 'Brown']

# 随机组合成100个全名的列表
full_names = []
for i in range(100):
    first_name = random.choice(names)
    last_name = random.choice(last_names)
    full_name = first_name + " " + last_name
    full_names.append(full_name)
    
print(full_names)
```
**编码语言没有使用语法高亮显示，#解释为一级标题显示，还好复制出来的内容没问题。**

```
💬 ['Alice Brown', 'Mike Smith', 'Tom Brown', 'Jerry Johnson', 'Jerry Smith', 'Jerry Williams', 'Tom Williams', 'Jerry Williams', 'Mike Johnson', 'Jerry Smith', 'Alice Johnson', 'Jerry Smith', 'Tom Brown', 'Tom Smith', 'Alice Williams', 'Jerry Smith', 'Tom Johnson', 'Jerry Williams', 'Tom Williams', 'Mike Brown', 'Mike Johnson', 'Mike Williams', 'Mike Smith', 'Tom Brown', 'Alice Johnson', 'Jerry Johnson', 'Jerry Smith', 'Alice Smith', 'Alice Brown', 'Alice Brown', 'Alice Williams', 'Alice Johnson', 'Alice Johnson', 'Mike Johnson', 'Mike Brown', 'Jerry Johnson', 'Mike Smith', 'Jerry Williams', 'Alice Williams', 'Tom Smith', 'Alice Williams', 'Alice Johnson', 'Jerry Smith', 'Tom Johnson', 'Mike Williams', 'Mike Williams', 'Jerry Johnson', 'Alice Johnson', 'Mike Brown', 'Mike Brown', 'Jerry Brown', 'Alice Brown', 'Alice Brown', 'Jerry Smith', 'Tom Smith', 'Tom Brown', 'Alice Williams', 'Tom Williams', 'Mike Brown', 'Alice Johnson', 'Jerry Brown', 'Tom Johnson', 'Alice Smith', 'Tom Brown', 'Jerry Smith', 'Mike Brown', 'Tom Johnson', 'Tom Williams', 'Tom Johnson', 'Alice Williams', 'Tom Brown', 'Jerry Johnson', 'Mike Brown', 'Tom Smith', 'Mike Williams', 'Alice Williams', 'Mike Johnson', 'Tom Williams', 'Mike Johnson', 'Alice Brown', 'Tom Johnson', 'Alice Williams', 'Tom Johnson', 'Tom Johnson', 'Jerry Brown', 'Jerry Brown', 'Tom Smith', 'Tom Johnson', 'Mike Johnson', 'Tom Smith', 'Jerry Smith', 'Tom Brown', 'Mike Brown', 'Alice Brown', 'Tom Smith', 'Tom Brown', 'Alice Williams', 'Mike Williams', 'Jerry Brown', 'Mike Johnson']
```

### 解释代码
```py
❓ class Log:
    def __init__(self, path):
        dirname = os.path.dirname(path)
        os.makedirs(dirname, exist_ok=True)
        f = open(path, "a+")

        # Check that the file is newline-terminated
        size = os.path.getsize(path)
        if size > 0:
            f.seek(size - 1)
            end = f.read(1)
            if end != "\n":
                f.write("\n")
        self.f = f
        self.path = path

    def log(self, event):
        event["_event_id"] = str(uuid.uuid4())
        json.dump(event, self.f)
        self.f.write("\n")

    def state(self):
        state = {"complete": set(), "last": None}
        for line in open(self.path):
            event = json.loads(line)
            if event["type"] == "submit" and event["success"]:
                state["complete"].add(event["id"])
                state["last"] = event
        return state

"""
这是上面的类正在做的事情：
1.
```

```
💬 创建一个名为Log的类，初始化方法会创建一个日志文件并打开它以进行写操作。
2.log()方法将事件(包含类型、成功等信息)写入日志文件中。
3.state()方法返回当前日志文件的状态，包括已完成的事件和最近一条成功的事件。
```

## 日常开发
### 👍Shell 命令
```
❓ 在linux下使用命令将png转换成jpg，图像缩放50%
```

```
💬 在Linux下使用命令将png转换成jpg,图像缩放50%可以使用ImageMagick软件。
安装ImageMagick:
在终端中输入命令：sudo apt-get install imagemagick
将png文件转换为jpg文件并缩放50%的命令如下：
  convert input.png -resize 50% output.jpg
其中，input.png是要转换的png文件名，output.jpg是转换后的jpg文件名。如果输出文件已经存在，则会覆盖原文件。
```
