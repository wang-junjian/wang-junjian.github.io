---
layout: post
title:  "LangChain : Tagging and Extraction Using OpenAI functions"
date:   2024-04-16 08:00:00 +0800
categories: LangChain
tags: [LangChain, Pydantic, Extraction, ChatTongyi, Text2SQL]
---

## Extraction

```python
from enum import Enum
from typing import Optional, Type
from langchain.pydantic_v1 import BaseModel, Field


class ProvinceEnum(str, Enum):
    """省、直辖市、自治区"""
    山东省 = "山东省"

class CityEnum(str, Enum):
    """山东省地级市"""
    default = ""
    济南 = "济南"
    青岛 = "青岛"
    淄博 = "淄博"
    枣庄 = "枣庄"
    东营 = "东营"
    烟台 = "烟台"
    潍坊 = "潍坊"
    济宁 = "济宁"
    泰安 = "泰安"
    威海 = "威海"
    日照 = "日照"
    临沂 = "临沂"
    德州 = "德州"
    聊城 = "聊城"
    滨州 = "滨州"
    菏泽 = "菏泽"
    莱芜 = "莱芜"

class DistrictEnum(str, Enum):
    """济南市区县"""
    default = ""
    历下区 = "历下区"
    市中区 = "市中区"
    槐荫区 = "槐荫区"
    天桥区 = "天桥区"
    历城区 = "历城区"
    长清区 = "长清区"
    平阴县 = "平阴县"
    济阳区 = "济阳区"
    商河县 = "商河县"
    章丘区 = "章丘区"

class PowerSupplyStationEnum(str, Enum):
    """供电所"""
    default = ""
    高新供电中心 = "高新供电中心"
    长清区供电公司 = "长清区供电公司"
    平阴县供电公司 = "平阴县供电公司"
    历城区供电公司 = "历城区供电公司"
    天桥供电中心 = "天桥供电中心"
    市中供电中心 = "市中供电中心"
    客户服务中心 = "客户服务中心"
    章丘区供电公司 = "章丘区供电公司"
    历下供电中心 = "历下供电中心"
    槐荫供电中心 = "槐荫供电中心"
    济阳区供电公司 = "济阳区供电公司"
    商河县供电公司 = "商河县供电公司"
    起步区供电中心 = "起步区供电中心"


class PowerSupplyStationLocation(BaseModel):
    """电网供电所位置"""
    province: ProvinceEnum = Field(description="省、直辖市、自治区")
    city: Optional[CityEnum] = Field(description="地级市")
    district: Optional[DistrictEnum] = Field(description="区县")
    power_supply_station: Optional[PowerSupplyStationEnum] = Field(description="供电所")


from langchain_core.utils.function_calling import convert_to_openai_function

functions = [
    convert_to_openai_function(f) for f in [
        PowerSupplyStationLocation
    ]
]

from langchain_core.utils.function_calling import convert_to_openai_tool

tools = [
    convert_to_openai_tool(f) for f in [
        PowerSupplyStationLocation
    ]
]

prompt = "2024年山东省济南市长清区供电公司的意见合计。"
```

### OpenAI

```python
from langchain_openai import ChatOpenAI

model = ChatOpenAI(temperature=0).bind(
    functions=functions,
    function_call={"name": PowerSupplyStationLocation.__name__}
)

response = model.invoke(prompt)
print(response)
```

### Anthropic

```python
from langchain_anthropic import ChatAnthropic

model = ChatAnthropic(temperature=0, model_name="claude-3-sonnet-20240229").bind_tools(
    [PowerSupplyStationLocation]
)

response = model.invoke(prompt)
print(response)
```

**模型性能：opus > sonnet > haiku**

- claude-3-opus-20240229
```json
{
    'name': 'PowerSupplyStationLocation', 
    'args': {'province': '山东省', 'city': '济南', 'district': '长清区', 'power_supply_station': '长清区供电公司'}
}
```

- claude-3-sonnet-20240229
```json
{
    'name': 'PowerSupplyStationLocation', 
    'args': {'province': '山东省', 'city': '济南', 'district': '长清区', 'power_supply_station': '长清区供电公司'}
}
```

- claude-3-haiku-20240307
```json
{
    'name': 'PowerSupplyStationLocation', 
    'args': {'province': '山东省', 'city': '济南', 'district': '长清区', 'power_supply_station': '长清区供电公司'}
}
```

### Tongyi

```python
from langchain_community.chat_models.tongyi import ChatTongyi

model = ChatTongyi(model="qwen1.5-72b-chat", top_p=0.01)

prompt = "2024年山东省济南市长清区供电公司的意见合计。"
response = model.invoke(prompt, tools=tools)
print(response)
```


## 参考资料
- [LangChain Expression Language (LCEL)](https://python.langchain.com/docs/expression_language/)
- [Defining Custom Tools](https://python.langchain.com/docs/modules/tools/custom_tools/)
- [Tools as OpenAI Functions](https://python.langchain.com/docs/modules/tools/tools_as_openai_functions/)
- [ChatAnthropic](https://python.langchain.com/docs/integrations/chat/anthropic/)
- [ChatTongyi](https://python.langchain.com/docs/integrations/chat/tongyi/)
