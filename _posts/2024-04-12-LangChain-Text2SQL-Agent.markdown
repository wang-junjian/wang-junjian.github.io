---
layout: post
title:  "LangChain Text2SQL Agent"
date:   2024-04-12 08:00:00 +0800
categories: LangChain Text2SQL Agent
tags: [LangChain, Text2SQL, Agent]
---

## OpenAI Function Call (Extraction)

**这个方法只有 OpenAI 的模型支持。**

```python
from langchain.agents import tool
from langchain.chat_models import ChatOpenAI
from langchain.tools.render import format_tool_to_openai_function

from langchain.pydantic_v1 import BaseModel, Field
from enum import Enum


# 省份、直辖市
class ProvinceEnum(str, Enum):
    山东省 = "山东省"
    # 其它省份


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
    province: ProvinceEnum = Field(description="省份、直辖市")
    city: CityEnum = Field(description="地级市")
    # district: str = Field(description="区")
    power_supply_station: str = Field(description="供电所")


@tool(args_schema=SQLParam)
def get_sql_param(province: str, city: str, power_supply_station: str) -> dict:
    """获得 SQL 参数"""
    return {
        "province": province,
        "city": city,
        # "district": district, 
        "power_supply_station": power_supply_station
    }


functions = [
    format_tool_to_openai_function(f) for f in [
        get_sql_param
    ]
]

# 这样写是错误的。
# model = ChatOpenAI(temperature=0)
# model.bind(functions=functions)

# OpenAI
model = ChatOpenAI(temperature=0).bind(functions=functions)

# Ollama
model = ChatOpenAI(api_key="ollama", base_url="http://127.0.0.1:11434/v1", model="gpt-3.5-turbo", temperature=0).bind(functions=functions)

# DashScope
model = ChatTongyi(model="qwen1.5-72b-chat", top_p=0.01).bind(functions=functions)

response = model.invoke("2024年山东省济南市长清区供电公司的意见合计。")
print(response)
```

### OpenAI
- gpt-3.5-turbo
```txt
content='' additional_kwargs={'function_call': {'name': 'get_sql_param', 'arguments': '{"province":"山东省","city":"济南","power_supply_station":"长清区供电公司"}'}}
```

### Ollama
- qwen:14b
```txt
content='对不起，我无法提供具体的2024年山东省济南市长清区供电公司的意见合计数据。这类信息通常由相关公司或政府部门发布，且数据更新频繁。

如果你需要了解此类信息，建议直接联系长清区供电公司的客户服务部门或者查阅他们的官方网站公告。
' response_metadata={'token_usage': {'completion_tokens': 63, 'prompt_tokens': 23, 'total_tokens': 86}, 'model_name': 'qwen:14b', 'system_fingerprint': 'fp_ollama', 'finish_reason': 'stop', 'logprobs': None} id='run-fa7ee757-3274-4942-868b-3d860b3e880d-0'
```

- mistral:latest
```txt
content=" 由于我不能直接获得江苏省或山东省 Specifically, Shandong Province's Jining City's Longching District Power Company's (在山东省济南市长清区位置) 实际情况和最新信息，因此无法提供具体的意见合计。但是，以下是一些可能影响供电公司业务发展和经营效益的方面：

1. 能源政策：国内外能源政策变化对供电公司有重大影响，例如新能源汽车普及、煤气价格波动等。
2. 技术进步：新技术发展（如智能网格、可变频率等）对供电公司的运营模式和设备需求造成重大影响。
3. 环保要求：环保法规和标准的强化对供电公司的投资和经营带来挑战，例如减少碳排放、提高效率等。
4. 市场需求：市场需求变化（如新兴行业需求、消费者偏好等）对供电公司的生产和销售带来影响。
5. 经济环境：经济环境变化（如利率水平、通胀率等）对供电公司的经营效益造成重大影响。
6. 竞争情况：竞争情况变化（如新入市者、技术进步等）对供电公司的市场份额和利润带来挑战。
7. 人力资源：人力资源短缺或过量对供电公司的生产和运营造成影响，例如招聘、培训、退休等。
8. 政府支持：政府措施（如补贴、税收等）对供电公司的经营效益有重大影响。

以上是一些可能对山东省济南市长清区供电公司发生变化的方面，供电公司需要根据这些因素进行适当的调整和应对挑战，以保证其业务发展和经营效益。" response_metadata={'token_usage': {'completion_tokens': 572, 'prompt_tokens': 33, 'total_tokens': 605}, 'model_name': 'mistral:latest', 'system_fingerprint': 'fp_ollama', 'finish_reason': 'stop', 'logprobs': None} id='run-052e08c9-8dda-4991-8f68-87026c5e2d9e-0'
```

- deepseek-coder:33b-instruct
```txt
content='对不起，我不能回答这个问题，因为它涉及到具体的公司信息和政策，这超出了我的功能范围。我主要用于解答计算机科学相关的问题。如果你有任何编程或计算机科学方面的问题，欢迎随时向我提问。
' response_metadata={'token_usage': {'completion_tokens': 59, 'prompt_tokens': 89, 'total_tokens': 148}, 'model_name': 'gpt-3.5-turbo', 'system_fingerprint': 'fp_ollama', 'finish_reason': 'stop', 'logprobs': None} id='run-73811af1-f65c-4c1a-ae6b-e5bd551b5ec4-0'
```

### DashScope
- qwen1.5-72b-chat
```txt
content='作为一个AI，我无法预测或提供具体个人或组织的意见，包括2024年山东省济南市长清区供电公司的意见。这需要基于实时的数据分析、公司政策、市场环境、电力行业趋势以及地方政策等多种因素来综合判断。建议直接联系该公司或关注官方发布的信息以获取最准确的见解和决策。同时，如果您有关于电力供应、服务改进或其他相关问题的建议，也可以在这里描述，我可以帮助您形成可能的建议方案。' response_metadata={'model_name': 'qwen1.5-72b-chat', 'finish_reason': 'stop', 'request_id': '37239262-c356-956f-89f0-b294fe953308', 'token_usage': {'input_tokens': 34, 'output_tokens': 101, 'total_tokens': 135}} id='run-60718327-4625-49a1-9083-f622c80d8cc8-0'
```

- qwen-plus
```txt
content='作为一个AI，我无法预测或制定具体的意见合计，因为我不能进行主观判断或预测未来事件。然而，我可以提供一些可能的方向，这些可能是长清区供电公司可能会考虑的方面：

1. 绿色能源转型：随着全球对环保和可持续发展的关注增加，供电公司可能会考虑增加太阳能、风能等可再生能源的使用，以减少碳排放。

2. 基础设施建设：提升电网设施，确保电力供应的稳定性和可靠性，包括升级老旧线路，增强防灾能力。

3. 智能化服务：利用物联网、大数据和人工智能技术，提高电力系统的运营效率和服务质量，例如智能电表的推广，实现远程抄表和故障预警。

4. 安全培训与教育：加强员工的安全培训，提高公众的电力安全意识，减少电力事故的发生。

5. 社区参与：开展电力知识普及活动，提高社区居民的电力使用知识，同时收集社区反馈，优化服务。

6. 电价政策：根据市场变化和政策导向，合理调整电价，平衡经济效益和社会责任。

7. 应急响应计划：完善应急处理机制，以应对可能的自然灾害或其他突发事件导致的电力中断。

以上只是一些可能的方向，具体的意见合计需要根据长清区供电公司的实际情况和未来规划来确定。' response_metadata={'model_name': 'qwen-plus', 'finish_reason': 'stop', 'request_id': 'ff2462a5-dc4f-904c-a539-defaee17d4fb', 'token_usage': {'input_tokens': 34, 'output_tokens': 274, 'total_tokens': 308}} id='run-2b64c8ac-f75a-4d54-8478-b6ad6a793783-0'
```

- qwen-max
```txt
content='非常抱歉，作为一款基于人工智能的文本交互模型，我无法对未来特定时间点（如2024年）的具体事件、数据或意见进行预测或提供详细信息。我的能力主要在于根据现有知识库和一般性原则对您提出的问题进行回答，而不具备实时获取或预测未来特定信息的能力。

对于2024年山东省济南市长清区供电公司的意见合计，这可能涉及该公司的运营状况、服务质量、发展规划、用户满意度、政策响应等多个方面，且这些内容会受到诸多不确定因素的影响，如市场变化、技术进步、政策调整、环境条件等。因此，只有在相关数据和信息实际产生并公开后，才能进行准确的意见汇总与分析。

如果您想了解当前或过去某个时间段内长清区供电公司的相关信息，或者对供电公司的一般性问题有咨询需求，我会很乐意为您提供帮助。对于未来的具体意见合计，建议您在接近2024年时关注官方发布的报告、新闻公告、行业分析或用户评价等权威渠道，以获取最准确、最新的信息。

再次为无法直接回答您的问题表示歉意，如有其他我能协助解答的内容，请随时告知。' response_metadata={'model_name': 'qwen-max', 'finish_reason': 'stop', 'request_id': '8ca36c79-cbe1-9651-bc08-40d9719d6b2f', 'token_usage': {'input_tokens': 34, 'output_tokens': 246, 'total_tokens': 280}} id='run-2d957ff1-9e47-4e1a-ae52-7d60adf216af-0'
```


## 参考资料
- [LangChain Expression Language (LCEL)](https://python.langchain.com/docs/expression_language/)
