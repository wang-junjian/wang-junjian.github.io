---
layout: post
title:  "使用大型语言模型进行命名实体识别"
date:   2024-05-10 08:00:00 +0800
categories: Qwen NER
tags: [Qwen, qwen-turbo, LangChain, ChatTongyi, Text2SQL, LLM, NER]
---

## 代码
```python
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import PromptTemplate
from langchain_core.runnables import RunnablePassthrough

from langchain_community.chat_models.tongyi import ChatTongyi


template = """
"""
question = ""

prompt = PromptTemplate.from_template(template)
model = ChatTongyi(model="qwen-turbo", top_p=0.01)

chain = (
    {"question": RunnablePassthrough()}
    | prompt
    | model
    | StrOutputParser()
)

response = chain.invoke(question)
print('🤖 ', response)
```


## 总结
- Qwen 模型的指令遵循还是差强人意，这里使用的参数应该是 72B
- 大型语言模型发挥了它的生成能力，会在原文的基础上给你增加内容，如：济南`市`。
- 问题变化多样，示例也不可能覆盖所有的情况，写的越多占用的上下文长度越大。
- 在实验二中
  - 明确说明`Date`实体类型的值，并没有很好的识别出来，如：`3月`识别为`Month`，`一季度`识别为`Quarter`，`今年`识别为`Year`。这个跟模型有关，ChatGPT就识别的不错。
- 在实验三中
  - 明确说明不要增加实体类型，但还是增加了，如：`County`实体类型。
  - 识别的实体有重叠文字，如：`曹县`，`曹县供电公司`。
  - 位置很容易出错，一旦出错后面的实体位置都是错误的了。
- 使用`XML`标记方式比输出`json`结果方式效果更好。


## 实验一
### 模板
```python
template = """## 命名实体识别例子
INPUT:今年山东省济南市长清区供电公司崮山供电所投诉总数
OUTPUT:<Date>今年</Date><Province>山东省</Province><City>济南市</City><Company>长清区供电公司</Company><Substation>崮山供电所</Substation><Indicator>投诉</Indicator>总数

INPUT:山东省德州开发供电中心意见总数
OUTPUT:<Province>山东省</Province><City>德州</City><Company>开发供电中心</Company><Indicator>意见</Indicator>总数

INPUT:济南市平阴县供电公司投诉总数
OUTPUT:<City>济南市</City><Company>平阴县供电公司</Company><Indicator>投诉</Indicator>总数

## 按照上面的示例对下面的文本进行命名实体识别标注
"{question}"
"""
```

### 测试
```python
question = "山东省济南市高新供电中心投诉总数"
```
```
<Province>山东省</Province><City>济南市</City><Company>高新供电中心</Company><Indicator>投诉</Indicator>总数
```

```python
question = "山东省济南高新供电中心投诉总数"
```
```
<Province>山东省</Province><City>济南市</City><Company>高新供电中心</Company><Indicator>投诉</Indicator>总数
```
- **`济南`增加了`市`**

```python
question = "山东省济南市平阴县供电公司投诉总数"
```
```
<Province>山东省</Province><City>济南市</City><Company>平阴县供电公司</Company><Indicator>投诉</Indicator>总数
```

```python
question = "济南市平阴县供电公司投诉总数"
```
```
<City>济南市</City><Company>平阴县供电公司</Company><Indicator>投诉</Indicator>总数
```

```python
question = "山东省菏泽郓城县供电公司郓城县经济技术开发区供电所意见总数"
```
```
<Province>山东省</Province><City>菏泽市</City><Company>郓城县供电公司</Company><Substation>郓城县经济技术开发区供电所</Substation><Indicator>意见</Indicator>总数
```

```python
question = "山东省菏泽曹县供电公司庄寨供电所意见总数"
```
```
OUTPUT: <Province>山东省</Province><City>菏泽</City><Company>曹县供电公司</Company><Substation>庄寨供电所</Substation><Indicator>意见</Indicator>总数
```
- **带了前缀`OUTPUT: `**

```python
question = "3月山东省菏泽曹县供电公司庄寨供电所意见总数"
```
```
OUTPUT: <Month>3月</Month><Province>山东省</Province><City>菏泽</City><District>曹县</District><Company>供电公司</Company><Substation>庄寨供电所</Substation><Indicator>意见</Indicator>总数
```
- **带了前缀`OUTPUT: `**
- **`3月`识别为`Month`**
- **`曹县供电公司`没有识别成功**

```python
question = "今年山东省菏泽曹县供电公司庄寨供电所意见总数"
```
```
<Year>今年</Year><Province>山东省</Province><City>菏泽</City><District>曹县</District><Company>供电公司</Company><Substation>庄寨供电所</Substation><Indicator>意见</Indicator>总数
```
- **`今年`识别为`Year`**
- **`曹县供电公司`没有识别成功**

```python
question = "菏泽曹县供电公司庄寨供电所意见总数"
```
```
<City>菏泽</City><County>曹县</County><Company>供电公司</Company><Substation>庄寨供电所</Substation><Indicator>意见</Indicator>总数
```
- **`曹县供电公司`没有识别成功**

```python
question = "山东省威海乳山市供电公司诸往供电所意见总数"
```
```
<Province>山东省</Province><City>威海市</City><Company>乳山市供电公司</Company><Substation>诸往供电所</Substation><Indicator>意见</Indicator>总数
```
- **`威海`增加了`市`**

```python
question = "一季度山东省威海乳山市供电公司诸往供电所意见总数"
```
```
<Quarter>一季度</Quarter><Province>山东省</Province><City>威海市</City><Company>乳山市供电公司</Company><Substation>诸往供电所</Substation><Indicator>意见</Indicator>总数
```
- **`一季度`识别为`Quarter`**
- **`威海`增加了`市`**

```python
question = "一季度威海乳山市供电公司诸往供电所意见总数"
```
```
<Quarter>一季度</Quarter><City>威海</City><Substation>乳山市供电公司诸往供电所</Substation><Indicator>意见</Indicator>总数
```
- **`一季度`识别为`Quarter`**
- **`乳山市供电公司诸往供电所`没有成功识别出`供电公司`和`供电所`**


## 实验二
### 模板
```python
template = """你将获得一个可能包含电力领域的用户消息。你还将获得一个电力领域实体类型列表。你的任务是检测并识别用户消息中提供的所有电力领域实体类型的实例。
## 要求
- 输出必须与输入内容相同。
- 只有在实体列表中匹配电力领域实体的标记应该被包含在XML标签内。
- XML标签来自下面列出的电力领域实体类型列表。
- 确保所有实体都被识别出来。
- 不要进行错误的识别。
- 只输出实体标注的结果，不需要对实体的标注进行解释。

## 电力领域实体类型列表
- Province: 省份。例如：山东省。
- City: 城市。例如：济南市、济南。
- Company: 供电公司。例如：长清区供电公司。
- Substation: 供电所。例如：崮山供电所。
- Indicator: 指标。例如：投诉、意见。
- Date: 日期。例如：今天、昨天、今年、去年、本周、上周、本月、上月、3月、本季度、上季度、一季度、今年第一季度、2022年、2024年5月。

## 示例
INPUT:今年山东省济南市长清区供电公司崮山供电所投诉总数
OUTPUT:<Date>今年</Date><Province>山东省</Province><City>济南市</City><Company>长清区供电公司</Company><Substation>崮山供电所</Substation><Indicator>投诉</Indicator>总数

INPUT:山东省德州开发供电中心意见总数
OUTPUT:<Province>山东省</Province><City>德州</City><Company>开发供电中心</Company><Indicator>意见</Indicator>总数

INPUT:济南市平阴县供电公司投诉总数
OUTPUT:<City>济南市</City><Company>平阴县供电公司</Company><Indicator>投诉</Indicator>总数

## 请你对下面的文本进行电力领域命名实体识别标注
{question}
"""
```

### 测试
```python
question = "山东省济南市高新供电中心投诉总数"
```
```
<Province>山东省</Province><City>济南市</City><Company>高新供电中心</Company><Indicator>投诉</Indicator>总数
```

```python
question = "山东省济南高新供电中心投诉总数"
```
```
<Province>山东省</Province><City>济南市</City><Company>高新供电中心</Company><Indicator>投诉</Indicator>总数
```
**`济南`增加了`市`**

```python
question = "山东省济南市平阴县供电公司投诉总数"
```
```
<Province>山东省</Province><City>济南市</City><Company>平阴县供电公司</Company><Indicator>投诉</Indicator>总数
```

```python
question = "济南市平阴县供电公司投诉总数"
```
```
<City>济南市</City><Company>平阴县供电公司</Company><Indicator>投诉</Indicator>总数
```

```python
question = "山东省菏泽郓城县供电公司郓城县经济技术开发区供电所意见总数"
```
```
<Province>山东省</Province><City>菏泽</City><Company>郓城县供电公司</Company><Substation>郓城县经济技术开发区供电所</Substation><Indicator>意见</Indicator>总数
```

```python
question = "山东省菏泽曹县供电公司庄寨供电所意见总数"
```
```
<Province>山东省</Province><City>菏泽</City><Company>曹县供电公司</Company><Substation>庄寨供电所</Substation><Indicator>意见</Indicator>总数
```

```python
question = "3月山东省菏泽曹县供电公司庄寨供电所意见总数"
```
```
<Month>3月</Month><Province>山东省</Province><City>菏泽</City><Company>曹县供电公司</Company><Substation>庄寨供电所</Substation><Indicator>意见</Indicator>总数
```
- **`3月`识别为`Month`**

```python
question = "今年山东省菏泽曹县供电公司庄寨供电所意见总数"
```
```
<Date>今年</Date><Province>山东省</Province><City>菏泽</City><Company>曹县供电公司</Company><Substation>庄寨供电所</Substation><Indicator>意见</Indicator>总数
```

```python
question = "菏泽曹县供电公司庄寨供电所意见总数"
```
```
<City>菏泽</City><Company>曹县供电公司</Company><Substation>庄寨供电所</Substation><Indicator>意见</Indicator>总数
```

```python
question = "山东省威海乳山市供电公司诸往供电所意见总数"
```
```
<Province>山东省</Province><City>威海市</City><Company>乳山市供电公司</Company><Substation>诸往供电所</Substation><Indicator>意见</Indicator>总数
```
- **`威海`增加了`市`**

```python
question = "一季度山东省威海乳山市供电公司诸往供电所意见总数"
```
```
<Quarter>一季度</Quarter><Province>山东省</Province><City>威海</City><City>乳山市</City><Company>供电公司</Company><Substation>诸往供电所</Substation><Indicator>意见</Indicator>总数
```
- **`一季度`识别为`Quarter`**
- **`乳山市供电公司`没有识别成功**

```python
question = "一季度威海乳山市供电公司诸往供电所意见总数"
```
```
<Quarter>一季度</Quarter><Province>威海市</Province><City>乳山市</City><Company>供电公司</Company><Substation>诸往供电所</Substation><Indicator>意见</Indicator>总数
```
- **`一季度`识别为`Quarter`**
- **`威海`增加了`市`**
- **`威海市`识别为`Province`**
- **`乳山市供电公司`没有识别成功**


## 实验三
### 模板
```python
template = """你将获得一个可能包含电力领域的用户消息。你还将获得一个电力领域实体类型列表。你的任务是检测并识别用户消息中提供的所有电力领域实体类型的实例。
## 要求
- 使用 json 格式输出。
- 输出必须与输入内容相同。
- 只有在实体列表中匹配电力领域实体的标记。
- 实例类型来自下面列出的电力领域实体类型列表。
- 确保所有实体都被识别出来。
- 不要进行错误的识别。
- 只输出 json 的结果，不需要进行解释。

## 电力领域实体类型列表
- Province: 省份。例如：山东省。
- City: 城市。例如：济南市、济南。
- Company: 供电公司。例如：长清区供电公司。
- Substation: 供电所。例如：崮山供电所。
- Indicator: 指标。例如：投诉、意见。
- Date: 日期。例如：今天、昨天、今年、去年、本周、上周、本月、上月、3月、本季度、上季度、一季度、今年第一季度、2022年、2024年5月。

## 示例
INPUT:今年山东省济南市长清区供电公司崮山供电所投诉总数
OUTPUT:
```json
{{
    "text": "今年山东省济南市长清区供电公司崮山供电所投诉总数",
    "entities": [
        {{
            "type": "Date",
            "start": 0,
            "end": 2,
            "entity": "今年"
        }},
        {{
            "type": "Province",
            "start": 2,
            "end": 5,
            "entity": "山东省"
        }},
        {{
            "type": "City",
            "start": 5,
            "end": 8,
            "entity": "济南市"
        }},
        {{
            "type": "Company",
            "start": 8,
            "end": 15,
            "entity": "长清区供电公司"
        }},
        {{
            "type": "Substation",
            "start": 15,
            "end": 20,
            "entity": "崮山供电所"
        }},
        {{
            "type": "Indicator",
            "start": 20,
            "end": 22,
            "entity": "投诉"
        }}
    ]
}}
```

## 请你对下面的文本进行电力领域命名实体识别标注
{question}
"""
```

### 测试
```python
question = "山东省济南市高新供电中心投诉总数"
```
```json
{
    "text": "山东省济南市高新供电中心投诉总数",
    "entities": [
        {
            "type": "Province",
            "start": 0,
            "end": 3,
            "entity": "山东省"
        },
        {
            "type": "City",
            "start": 3,
            "end": 6,
            "entity": "济南市"
        },
        {
            "type": "Company",
            "start": 6,
            "end": 12,
            "entity": "高新供电中心"
        },
        {
            "type": "Indicator",
            "start": 12,
            "end": 15,
            "entity": "投诉"
        }
    ]
}
```

```python
question = "山东省济南高新供电中心投诉总数"
```
```json
{
    "text": "山东省济南高新供电中心投诉总数",
    "entities": [
        {
            "type": "Province",
            "start": 0,
            "end": 3,
            "entity": "山东省"
        },
        {
            "type": "City",
            "start": 3,
            "end": 6,
            "entity": "济南市"
        },
        {
            "type": "Company",
            "start": 6,
            "end": 13,
            "entity": "高新供电中心"
        },
        {
            "type": "Indicator",
            "start": 13,
            "end": 16,
            "entity": "投诉"
        }
    ]
}
```
- **`济南`增加了`市`**
- **`end`是`6`, 应该是`5`, 后面的所有实体位置都是错误的。**

```python
question = "山东省济南市平阴县供电公司投诉总数"
```
```json
{
    "text": "山东省济南市平阴县供电公司投诉总数",
    "entities": [
        {
            "type": "Province",
            "start": 0,
            "end": 3,
            "entity": "山东省"
        },
        {
            "type": "City",
            "start": 3,
            "end": 6,
            "entity": "济南市"
        },
        {
            "type": "Company",
            "start": 6,
            "end": 13,
            "entity": "平阴县供电公司"
        },
        {
            "type": "Indicator",
            "start": 13,
            "end": 15,
            "entity": "投诉"
        }
    ]
}
```

```python
question = "济南市平阴县供电公司投诉总数"
```
```json
{
    "text": "济南市平阴县供电公司投诉总数",
    "entities": [
        {
            "type": "City",
            "start": 0,
            "end": 3,
            "entity": "济南市"
        },
        {
            "type": "County",
            "start": 4,
            "end": 7,
            "entity": "平阴县" // 注意这里假设“县”是一个电力领域实体，虽然不在给定的列表中，但根据上下文可以理解
        },
        {
            "type": "Company",
            "start": 7,
            "end": 14,
            "entity": "平阴县供电公司"
        },
        {
            "type": "Indicator",
            "start": 14,
            "end": 17,
            "entity": "投诉"
        }
    ]
}
```
- **增加了`County`实体类型**
- **从增加`County`后面的实体位置都是错误的**

```python
question = "山东省菏泽郓城县供电公司郓城县经济技术开发区供电所意见总数"
```
```json
{
    "text": "山东省菏泽郓城县供电公司郓城县经济技术开发区供电所意见总数",
    "entities": [
        {
            "type": "Province",
            "start": 0,
            "end": 3,
            "entity": "山东省"
        },
        {
            "type": "City",
            "start": 3,
            "end": 6,
            "entity": "菏泽"
        },
        {
            "type": "Company",
            "start": 6,
            "end": 15,
            "entity": "郓城县供电公司"
        },
        {
            "type": "Substation",
            "start": 15,
            "end": 25,
            "entity": "郓城县经济技术开发区供电所"
        },
        {
            "type": "Indicator",
            "start": 25,
            "end": 28,
            "entity": "意见"
        }
    ]
}
```

```python
question = "山东省菏泽曹县供电公司庄寨供电所意见总数"
```
```json
{
    "text": "山东省菏泽曹县供电公司庄寨供电所意见总数",
    "entities": [
        {
            "type": "Province",
            "start": 0,
            "end": 3,
            "entity": "山东省"
        },
        {
            "type": "City",
            "start": 3,
            "end": 6,
            "entity": "菏泽"
        },
        {
            "type": "City",
            "start": 6,
            "end": 9,
            "entity": "曹县"
        },
        {
            "type": "Company",
            "start": 9,
            "end": 17,
            "entity": "曹县供电公司"
        },
        {
            "type": "Substation",
            "start": 17,
            "end": 22,
            "entity": "庄寨供电所"
        },
        {
            "type": "Indicator",
            "start": 22,
            "end": 25,
            "entity": "意见"
        }
    ]
}
```
- **增加`曹县`识别为`City`**
- **从增加`曹县`后面的实体位置都是错误的**

```python
question = "3月山东省菏泽曹县供电公司庄寨供电所意见总数"
```
```json
{
    "text": "3月山东省菏泽曹县供电公司庄寨供电所意见总数",
    "entities": [
        {
            "type": "Date",
            "start": 0,
            "end": 2,
            "entity": "3月"
        },
        {
            "type": "Province",
            "start": 2,
            "end": 5,
            "entity": "山东省"
        },
        {
            "type": "City",
            "start": 5,
            "end": 7,
            "entity": "菏泽"
        },
        {
            "type": "County",
            "start": 7,
            "end": 10,
            "entity": "曹县"
        },
        {
            "type": "Company",
            "start": 10,
            "end": 19,
            "entity": "曹县供电公司"
        },
        {
            "type": "Substation",
            "start": 19,
            "end": 24,
            "entity": "庄寨供电所"
        },
        {
            "type": "Indicator",
            "start": 24,
            "end": 27,
            "entity": "意见"
        }
    ]
}
```
- **增加了`County`实体类型**
- **从增加`County`后面的实体位置都是错误的**

```python
question = "今年山东省菏泽曹县供电公司庄寨供电所意见总数"
```
```json
{
    "text": "今年山东省菏泽曹县供电公司庄寨供电所意见总数",
    "entities": [
        {
            "type": "Date",
            "start": 0,
            "end": 2,
            "entity": "今年"
        },
        {
            "type": "Province",
            "start": 2,
            "end": 5,
            "entity": "山东省"
        },
        {
            "type": "City",
            "start": 5,
            "end": 7,
            "entity": "菏泽"
        },
        {
            "type": "City",
            "start": 7,
            "end": 9,
            "entity": "曹县"
        },
        {
            "type": "Company",
            "start": 9,
            "end": 16,
            "entity": "供电公司"
        },
        {
            "type": "Substation",
            "start": 16,
            "end": 20,
            "entity": "庄寨供电所"
        },
        {
            "type": "Indicator",
            "start": 20,
            "end": 22,
            "entity": "意见"
        }
    ]
}
```
- **`曹县供电公司`识别错误**

```python
question = "菏泽曹县供电公司庄寨供电所意见总数"
```
```json
{
    "text": "菏泽曹县供电公司庄寨供电所意见总数",
    "entities": [
        {
            "type": "City",
            "start": 0,
            "end": 2,
            "entity": "菏泽"
        },
        {
            "type": "County",
            "start": 2,
            "end": 5,
            "entity": "曹县"
        },
        {
            "type": "Company",
            "start": 5,
            "end": 13,
            "entity": "菏泽曹县供电公司"
        },
        {
            "type": "Substation",
            "start": 13,
            "end": 18,
            "entity": "庄寨供电所"
        },
        {
            "type": "Indicator",
            "start": 18,
            "end": 20,
            "entity": "意见"
        }
    ]
}
```
- **增加了`County`实体类型**
- **从增加`County`后面的实体位置都是错误的**
- **`Company`识别错误**

```python
question = "山东省威海乳山市供电公司诸往供电所意见总数"
```
```json
{
    "text": "山东省威海乳山市供电公司诸往供电所意见总数",
    "entities": [
        {
            "type": "Province",
            "start": 0,
            "end": 3,
            "entity": "山东省"
        },
        {
            "type": "City",
            "start": 3,
            "end": 6,
            "entity": "威海市"
        },
        {
            "type": "Company",
            "start": 6,
            "end": 13,
            "entity": "乳山市供电公司"
        },
        {
            "type": "Substation",
            "start": 13,
            "end": 17,
            "entity": "诸往供电所"
        },
        {
            "type": "Indicator",
            "start": 17,
            "end": 19,
            "entity": "意见"
        }
    ]
}
```
- **`威海`增加了`市`**
- **从`City`后面的实体位置都是错误的**

```python
question = "一季度山东省威海乳山市供电公司诸往供电所意见总数"
```
```json
{
    "text": "一季度山东省威海乳山市供电公司诸往供电所意见总数",
    "entities": [
        {
            "type": "Quarter",
            "start": 0,
            "end": 3,
            "entity": "一季度"
        },
        {
            "type": "Province",
            "start": 3,
            "end": 6,
            "entity": "山东省"
        },
        {
            "type": "City",
            "start": 6,
            "end": 9,
            "entity": "威海市"
        },
        {
            "type": "City",
            "start": 9,
            "end": 12,
            "entity": "乳山市"
        },
        {
            "type": "Company",
            "start": 12,
            "end": 20,
            "entity": "供电公司"
        },
        {
            "type": "Substation",
            "start": 20,
            "end": 25,
            "entity": "诸往供电所"
        },
        {
            "type": "Indicator",
            "start": 25,
            "end": 27,
            "entity": "意见"
        }
    ]
}
```
- **`一季度`识别为`Quarter`**
- **`威海`增加了`市`**
- **从`City`后面的实体位置都是错误的**
- **`乳山市供电公司`没有识别成功**

```python
question = "一季度威海乳山市供电公司诸往供电所意见总数"
```
```json
{
    "text": "一季度威海乳山市供电公司诸往供电所意见总数",
    "entities": [
        {
            "type": "Quarter",
            "start": 0,
            "end": 3,
            "entity": "一季度"
        },
        {
            "type": "City",
            "start": 4,
            "end": 7,
            "entity": "威海"
        },
        {
            "type": "Province",
            "start": 7,
            "end": 10,
            "entity": "乳山市"
        },
        {
            "type": "Company",
            "start": 10,
            "end": 19,
            "entity": "乳山市供电公司"
        },
        {
            "type": "Substation",
            "start": 19,
            "end": 24,
            "entity": "诸往供电所"
        },
        {
            "type": "Indicator",
            "start": 24,
            "end": 27,
            "entity": "意见"
        }
    ]
}
```
- **`一季度`识别为`Quarter`**
- **`乳山市`识别为`Province`**
- **从`Province`后面的实体位置都是错误的**
- **`乳山市供电公司`没有识别成功**


## 参考
- [DashScope灵积模型服务](https://dashscope.console.aliyun.com/)
- [通义千问](https://tongyi.aliyun.com/)
- [Kimi](https://kimi.moonshot.cn/)
- [微调大型语言模型进行命名实体识别](https://new.qq.com/rain/a/20240316A01HGA00)
