---
layout: post
title:  "LangChain Chat Models Function & Tool Calling"
date:   2024-04-15 08:00:00 +0800
categories: LangChain ToolCalling
tags: [LangChain, ToolCalling, Text2SQL]
---

## Chat Models Functions & Tools

| Model | Function Calling | Tool Calling | Python Package |
| --- | --- | --- | --- |
| ChatOpenAI | ✅ | ✅ | langchain-openai |
| ChatTongyi | ❌ | ✅ | langchain-community |
| ChatOllama | ❌ | ❌ | langchain-community |
| OllamaFunctions | ✅ | ❌ | langchain-experimental |

- [Chat models](https://python.langchain.com/docs/integrations/chat/)


## 自定义工具

在构建自己的代理时，您需要为其提供一个工具列表，供其使用。除了实际调用的函数之外，工具还包括几个组件：

- name (str)：是必需的，并且在提供给代理的一组工具中必须是唯一的。
- description (str)：可选，但建议提供，因为代理使用它来确定工具的使用。
- args_schema (Pydantic BaseModel)：可选，但建议提供，可用于提供更多信息（例如，少量示例）或对预期参数进行验证。

### 定义 Function

```python
[
    {
        'name': 'get_sql_param', 
        'description': 'get_sql_param(province: str, city: str, power_supply_station: str) -> dict - 生成SQL需要的参数', 
        'parameters': {
            'type': 'object', 
            'properties': {
                'province': {
                    'description': '省', 
                    'allOf': [{'title': 'ProvinceEnum', 'description': 'An enumeration.', 'enum': ['山东省'], 'type': 'string'}]
                }, 
                'city': {
                    'description': '地级市', 
                    'allOf': [{'title': 'CityEnum', 'description': 'An enumeration.', 'enum': ['济南', '青岛', '淄博', '枣庄', '东营', '烟台', '潍坊', '济宁', '泰安', '威海', '日照', '临沂', '德州', '聊城', '滨州', '菏泽', '莱芜'], 'type': 'string'}]
                }, 
                'power_supply_station': {
                    'description': '供电所', 'type': 'string'
                }
            }, 
            'required': ['province', 'city', 'power_supply_station']
        }
    }
]
```

### 定义 Tool

```python
[
    {
        'type': 'function', 
        'function': {
            'name': 'get_sql_param', 
            'description': 'get_sql_param(province: str, city: str, power_supply_station: str) -> dict - 生成SQL需要的参数', 
            'parameters': {
                'type': 'object', 
                'properties': {
                    'province': {
                        'description': '省', 
                        'allOf': [{'title': 'ProvinceEnum', 'description': 'An enumeration.', 'enum': ['山东省'], 'type': 'string'}]
                    }, 
                    'city': {
                        'description': '地级市', 
                        'allOf': [{'title': 'CityEnum', 'description': 'An enumeration.', 'enum': ['济南', '青岛', '淄博', '枣庄', '东营', '烟台', '潍坊', '济宁', '泰安', '威海', '日照', '临沂', '德州', '聊城', '滨州', '菏泽', '莱芜'], 'type': 'string'}]
                    }, 
                    'power_supply_station': {
                        'description': '供电所', 'type': 'string'
                    }
                }, 
                'required': ['province', 'city', 'power_supply_station']
            }
        }
    }
]
```

## 自定义工具

- [Defining Custom Tools](https://python.langchain.com/docs/modules/tools/custom_tools/)
- [Tools as OpenAI Functions](https://python.langchain.com/docs/modules/tools/tools_as_openai_functions/)

### @tool decorator

```python
from langchain.pydantic_v1 import BaseModel, Field
from enum import Enum

# 定义一个枚举类表示的省份值
class ProvinceEnum(str, Enum):
    山东省 = "山东省"
    
# 山东省地级市
class CityEnum(str, Enum):
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
    
class SQLParam(BaseModel):
    """用于生成SQL的参数"""
    province: ProvinceEnum = Field(description="省")
    city: CityEnum = Field(description="地级市")
    # district: str = Field(description="区")
    power_supply_station: str = Field(description="供电所")
```

```python
from langchain.agents import tool

# 在这个例子中 return_direct=True 加不加都一样。
@tool(args_schema=SQLParam, return_direct=True)
def get_sql_param(province: ProvinceEnum, city: CityEnum, power_supply_station: str) -> dict:
    """生成SQL需要的参数"""
    return {
        "province": province,
        "city": city,
        # "district": district, 
        "power_supply_station": power_supply_station
    }

# 生成 OpenAI Function 和 Tool

from langchain_core.utils.function_calling import convert_to_openai_function

functions = [
    convert_to_openai_function(f) for f in [
        get_sql_param
    ]
]


from langchain_core.utils.function_calling import convert_to_openai_tool

tools = [
    convert_to_openai_tool(f) for f in [
        get_sql_param
    ]
]
```

### Subclass BaseTool

```python
from enum import Enum
from typing import Optional, Type
from langchain.pydantic_v1 import BaseModel, Field
from langchain.tools import BaseTool
from langchain.callbacks.manager import (
    AsyncCallbackManagerForToolRun,
    CallbackManagerForToolRun,
)


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
    """电网供电所位置提取"""
    province: ProvinceEnum = Field(description="省、直辖市、自治区")
    city: Optional[CityEnum] = Field(description="地级市")
    district: Optional[DistrictEnum] = Field(description="区县")
    power_supply_station: Optional[PowerSupplyStationEnum] = Field(description="供电所")


class PowerSupplyStationLocationExtractor(BaseTool):
    name = "PowerSupplyStationLocationExtractor"
    description = PowerSupplyStationLocation.__doc__
    args_schema: Type[BaseModel] = PowerSupplyStationLocation

    def _run(self, 
             province: ProvinceEnum = None, 
             city: Optional[CityEnum] = None, 
             district: Optional[DistrictEnum] = None, 
             power_supply_station: Optional[PowerSupplyStationEnum] = None, 
             run_manager: Optional[CallbackManagerForToolRun] = None) -> str:
        """Use the tool."""
        return {
            "province": province,
            "city": city,
            "district": district,
            "power_supply_station": power_supply_station
        }

    async def _arun(self, 
                    province: ProvinceEnum, 
                    city: CityEnum, 
                    district: DistrictEnum, 
                    power_supply_station: PowerSupplyStationEnum, 
                    run_manager: Optional[AsyncCallbackManagerForToolRun] = None) -> str:
        """Use the tool asynchronously."""
        raise NotImplementedError("does not support async")


from langchain_core.utils.function_calling import convert_to_openai_function

functions = [
    convert_to_openai_function(f) for f in [
        PowerSupplyStationLocationExtractor()
    ]
]

from langchain_core.utils.function_calling import convert_to_openai_tool

tools = [
    convert_to_openai_tool(f) for f in [
        PowerSupplyStationLocationExtractor()
    ]
]
```

## ChatOpenAI

### Function Calling

```python
# from langchain.chat_models import ChatOpenAI # 0.0.312
from langchain_openai import ChatOpenAI      # 0.1.15

model = ChatOpenAI(temperature=0).bind(
    functions=functions,
    function_call={"name": "get_sql_param"}
)

prompt = "2024年山东省济南市长清区供电公司的意见合计。"
response = model.invoke(prompt)
print(response)
```

content='' additional_kwargs={'function_call': {'name': 'get_sql_param', 'arguments': '{"province":"山东省","city":"济南","power_supply_station":"长清区供电公司"}'}}

### Tool Calling

```python
# from langchain.chat_models import ChatOpenAI # 0.0.312
from langchain_openai import ChatOpenAI      # 0.1.15

model = ChatOpenAI(temperature=0).bind_tools(tools)

prompt = "2024年山东省济南市长清区供电公司的意见合计。"
response = model.invoke(prompt)
print(response)
```

- [Tools as OpenAI Functions](https://python.langchain.com/docs/modules/tools/tools_as_openai_functions/)


## [ChatTongyi](https://python.langchain.com/docs/integrations/chat/tongyi/)

### <site-packages>/langchain_community/chat_models/tongyi.py

这里修改了 `ChatTongyi` 类的 `_chat_generation_from_qwen_resp` 方法，以便在最后一个块中返回 `generation_info`，增加了 `message`。

```python
    @staticmethod
    def _chat_generation_from_qwen_resp(
        resp: Any, is_chunk: bool = False, is_last_chunk: bool = True
    ) -> Dict[str, Any]:
        # According to the response from dashscope,
        # each chunk's `generation_info` overwrites the previous one.
        # Besides, The `merge_dicts` method,
        # which is used to concatenate `generation_info` in `GenerationChunk`,
        # does not support merging of int type values.
        # Therefore, we adopt the `generation_info` of the last chunk
        # and discard the `generation_info` of the intermediate chunks.
        choice = resp["output"]["choices"][0]
        message = convert_dict_to_message(choice["message"], is_chunk=is_chunk)
        if is_last_chunk:
            return dict(
                message=message,
                generation_info=dict(
                    finish_reason=choice["finish_reason"],
                    request_id=resp["request_id"],
                    token_usage=dict(resp["usage"]),
                    message=dict(choice["message"]) # wjj add
                ),
            )
        else:
            return dict(message=message)
```

### qwen1.5-72b-chat

```python
from langchain_community.chat_models.tongyi import ChatTongyi

prompt = "2024年山东省济南市长清区供电公司的意见合计。"

# 设置 temperature 没有用，没有使用；
# 使用 top_p=0.01，结果不是很稳定，偶尔会出问题。
model = ChatTongyi(model="qwen1.5-72b-chat", top_p=0.01)
response = model.invoke(prompt, tools=tools)
print(response)
```

- [模型服务灵积 > 通义千问大语言模型 > API详情 > Function call](https://help.aliyun.com/zh/dashscope/developer-reference/api-details#86ef4d304bwsb)
- [examples/function_call_examples.py](https://github.com/QwenLM/Qwen/blob/main/examples/function_call_examples.py)
- [请问是否支持langchain里的create_openai_tools_agent或者create_openai_functions_agent？](https://github.com/QwenLM/Qwen1.5/issues/15)

content='' response_metadata={'model_name': 'qwen1.5-72b-chat', 'finish_reason': 'tool_calls', 'request_id': '542bb0bb-f96d-96e7-a761-29690c9dc5ee', 'token_usage': {'input_tokens': 372, 'output_tokens': 40, 'total_tokens': 412}, 'message': {'role': 'assistant', 'content': '', 'tool_calls': [{'function': {'name': 'get_sql_param', 'arguments': '{"province": "山东省", "city": "济南", "power_supply_station": "长清区供电公司"}'}, 'id': '', 'type': 'function'}]}} id='run-192e74da-8b54-46cb-aa76-6fdda10cbfab-0'


## [ChatOllama](https://python.langchain.com/docs/integrations/chat/ollama/)

```python
json_schema = {
    "title": "get_sql_param",
    "description": "生成SQL需要的参数",
    "type": "object",
    "properties": {
        'province': {
            'title': 'Province',
            'description': '省', 
            'allOf': [{'title': 'ProvinceEnum', 'description': 'An enumeration.', 'enum': ['山东省'], 'type': 'string'}]
        }, 
        'city': {
            'title': 'City',
            'description': '地级市', 
            'allOf': [{'title': 'CityEnum', 'description': 'An enumeration.', 'enum': ['济南', '青岛', '淄博', '枣庄', '东营', '烟台', '潍坊', '济宁', '泰安', '威海', '日照', '临沂', '德州', '聊城', '滨州', '菏泽', '莱芜'], 'type': 'string'}]
        }, 
        'power_supply_station': {
            'title': 'Power Supply Station', 'description': '供电所', 'type': 'string'
        }

    },
    'required': ['province', 'city', 'power_supply_station']
}

import json

from langchain_core.messages import HumanMessage
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_community.llms import Ollama

question = json.dumps(json_schema, indent=2)

prompt = "2024年山东省济南市长清区供电公司的意见合计。"

messages = [
    HumanMessage(
        content="下面是 get_sql_param 的 JSON schema:"
    ),
    HumanMessage(content=f"{question}"),
    HumanMessage(
        content=f"根据上面定义的 JSON schema，对下面的文本抽取信息，抽取的信息使用 JSON 格式描述。\n{prompt}"
    ),
]

model = Ollama(model="mistral", temperature=0)
prompt = ChatPromptTemplate.from_messages(messages)
chain = prompt | model | StrOutputParser()

print(chain.invoke({}))
```

### mistral:0.2

Based on the given JSON schema, here's the extracted information in JSON format:

```json
{
  "province": "山东省",
  "city": "济南市",
  "power_supply_station": "长清区供电公司"
}
```

### qwen:14b ❌

据提供的 JSON schema，我们可以看到需要抽取的信息包括省份（province）、城市（city）以及电力供应站（power_supply_station）。然而，给定的文本“2024年山东省济南市长清区供电公司的意见合计”并没有直接提供这些信息。

如果我们假设这个文本是在描述一个事件或者报告，那么我们可能需要额外的信息来确定具体的省份、城市和电力供应站。如果没有这样的上下文，我们无法从给出的文本中抽取JSON格式所需的信息。


## [OllamaFunctions](https://python.langchain.com/docs/integrations/chat/ollama_functions/)

```python
import json
from langchain_experimental.llms.ollama_functions import OllamaFunctions

model = OllamaFunctions(model="qwen:14b", temperature=0).bind(functions=functions, function_call={"name": "get_sql_param"})

prompt = "2024年山东省济南市长清区供电公司的意见合计。"
response = model.invoke(prompt)
print(json.loads(response.additional_kwargs["function_call"]['arguments']))
```

### mistral:0.2

```json
{'province': '山东', 'city': '济南', 'power_supply_station': '济南市长清区供电公司'}
```

### qwen:14b

```json
{'province': '山东省', 'city': '济南市', 'district': '长清区', 'power_supply_company': '供电公司'}
```


## 参考资料
- [LangChain Expression Language (LCEL)](https://python.langchain.com/docs/expression_language/)
