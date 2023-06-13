---
layout: post
title:  "LangChain for LLM Application Development"
date:   2023-06-09 08:00:00 +0800
categories: LangChain
tags: [ChatGPT, DeepLearning.AI]
---

[LangChain for LLM Application Development](https://learn.deeplearning.ai/langchain)

LangChain 是用于构建 LLM 应用程序的开源框架

[LLM 应用程序开发的 LangChain](https://www.bilibili.com/video/BV1zu4y1Z7mc)

## LangChain: Models, Prompts and Output Parsers

安装依赖包
```bash
pip install python-dotenv
pip install openai
```

ChatCompletion
```py
import os
import openai

from dotenv import load_dotenv, find_dotenv
_ = load_dotenv(find_dotenv()) # read local .env file
openai.api_key = os.environ['OPENAI_API_KEY']

def get_completion(prompt, model="gpt-3.5-turbo"):
    messages = [{"role": "user", "content": prompt}]
    response = openai.ChatCompletion.create(
        model=model,
        messages=messages,
        temperature=0, 
    )
    return response.choices[0].message["content"]
```

### Chat API : OpenAI（直接调用 OpenAI 的 API）

```py
get_completion("What is 1+1?")
```

```
'As an AI language model, I can tell you that the answer to 1+1 is 2.
```

```py
get_completion("什么是 1+1？")
```

```
'1+1=2。'
```

```py
customer_email = """
Arrr, I be fuming that me blender lid \
flew off and splattered me kitchen walls \
with smoothie! And to make matters worse,\
the warranty don't cover the cost of \
cleaning up me kitchen. I need yer help \
right now, matey!
"""

style = """American English in a calm and respectful tone
"""

prompt = f"""Translate the text \
that is delimited by triple backticks 
into a style that is {style}.
text: ```{customer_email}```
"""
print(prompt)

response = get_completion(prompt)
print(response)
```

```
Translate the text that is delimited by triple backticks 
into a style that is American English in a calm and respectful tone
.
text: ```
Arrr, I be fuming that me blender lid flew off and splattered me kitchen walls with smoothie! And to make matters worse,the warranty don't cover the cost of cleaning up me kitchen. I need yer help right now, matey!
```

I am quite upset that my blender lid came off and caused my smoothie to splatter all over my kitchen walls. Additionally, the warranty does not cover the cost of cleaning up the mess. Would you be able to assist me, please? Thank you kindly.
```

```py
customer_email_zh = """
啊，我的搅拌机盖子飞了，把我的厨房墙壁都弄得满是果汁！\
更糟糕的是，保修不包括清理厨房的费用。\
伙计，我现在需要你的帮助！
"""

style_zh = """以平静和尊重的口吻说标准普通话。
"""

prompt_zh = f"""请将由三个反引号分隔的文本翻译成{style_zh}。
文本：```{customer_email_zh}```
"""
print(prompt_zh)

response_zh = get_completion(prompt_zh)
print(response_zh)
```

```
请将由三个反引号分隔的文本翻译成以平静和尊重的口吻说标准普通话。
。
文本：```
啊，我的搅拌机盖子飞了，把我的厨房墙壁都弄得满是果汁！更糟糕的是，保修不包括清理厨房的费用。伙计，我现在需要你的帮助！
```

很抱歉打扰您，我的搅拌机盖子不慎飞了，导致厨房墙壁被果汁弄得很乱。不幸的是，保修并不包括清理费用。能否请您帮我一下呢？非常感谢！
```

```py
style_zh = """以温柔和甜美的口吻说标准普通话。
"""

prompt_zh = f"""请将由三个反引号分隔的文本翻译成{style_zh}。
文本：```{customer_email_zh}```
"""

response_zh = get_completion(prompt_zh)
print(response_zh)
```

```
哎呀，我的搅拌机盖子飞了，把我的厨房墙壁都弄得满是果汁！更糟糕的是，保修不包括清理厨房的费用。亲爱的，你能帮我一下吗？我真的需要你的帮助！
```

```py
style_zh = """以生气和愤怒的口吻说标准普通话。
"""

prompt_zh = f"""请将由三个反引号分隔的文本翻译成{style_zh}。
文本：```{customer_email_zh}```
"""

response_zh = get_completion(prompt_zh)
print(response_zh)
```

```
“什么鬼！我的搅拌机盖子竟然飞了，把我整个厨房弄得一片狼藉，全是果汁！还有，保修居然不包括清理费用，这简直太过分了！你听着，现在我需要你的帮助！”
```

### Chat API : LangChain（通过 LangChain 进行的 API 调用）

安装
```bash
pip install --upgrade langchain
```

#### Model（模型）
```py
from langchain.chat_models import ChatOpenAI

# To control the randomness and creativity of the generated
# text by an LLM, use temperature = 0.0
chat = ChatOpenAI(temperature=0.0)
chat
```

```
ChatOpenAI(verbose=False, callbacks=None, callback_manager=None, client=<class 'openai.api_resources.chat_completion.ChatCompletion'>, model_name='gpt-3.5-turbo', temperature=0.0, model_kwargs={}, openai_api_key=None, openai_api_base=None, openai_organization=None, request_timeout=None, max_retries=6, streaming=False, n=1, max_tokens=None)
```

#### Prompt template（提示模板）

```py
# 将由三重反引号分隔的文本翻译成 {style} 的样式。
template_string = """Translate the text \
that is delimited by triple backticks \
into a style that is {style}. \
text: ```{text}```
"""

from langchain.prompts import ChatPromptTemplate

prompt_template = ChatPromptTemplate.from_template(template_string)
```

```py
prompt_template.messages[0].prompt
```

```
PromptTemplate(input_variables=['style', 'text'], output_parser=None, partial_variables={}, template='Translate the text that is delimited by triple backticks into a style that is {style}. text: ```{text}```\n', template_format='f-string', validate_template=True)
```

```py
prompt_template.messages[0].prompt.input_variables
```

```
['style', 'text']
```

```py
# 平静而恭敬的美式英语
customer_style = """American English in a calm and respectful tone
"""

# 啊，我的搅拌机盖子飞了，把我的厨房墙壁都弄得满是果汁！更糟糕的是，保修不包括清理厨房的费用。伙计，我现在需要你的帮助！
customer_email = """
Arrr, I be fuming that me blender lid \
flew off and splattered me kitchen walls \
with smoothie! And to make matters worse, \
the warranty don't cover the cost of \
cleaning up me kitchen. I need yer help \
right now, matey!
"""

customer_messages = prompt_template.format_messages(
                    style=customer_style,
                    text=customer_email)
```

```py
print(type(customer_messages))
print(type(customer_messages[0]))
```

```
<class 'list'>
<class 'langchain.schema.HumanMessage'>
```

```py
print(customer_messages[0])
```

```
content="Translate the text that is delimited by triple backticks into a style that is American English in a calm and respectful tone\n. text: ```\nArrr, I be fuming that me blender lid flew off and splattered me kitchen walls with smoothie! And to make matters worse, the warranty don't cover the cost of cleaning up me kitchen. I need yer help right now, matey!\n```\n" additional_kwargs={} example=False
```

```py
# Call the LLM to translate to the style of the customer message
customer_response = chat(customer_messages)

# 我真的很沮丧，我的搅拌机盖飞了出去，把我的厨房墙壁弄得一团糟。更让我沮丧的是，保修不包括清理厨房的费用。朋友，你能帮帮我吗？
print(customer_response.content)
```

```
I'm really frustrated that my blender lid flew off and made a mess of my kitchen walls with smoothie. To add to my frustration, the warranty doesn't cover the cost of cleaning up my kitchen. Can you please help me out, friend?
```

```py
# 嘿，顾客，保修不包括您的厨房清洁费用，因为您忘记在启动搅拌机之前放上盖子，导致您错误使用了搅拌机。真不幸！再见！
service_reply = """Hey there customer, \
the warranty does not cover \
cleaning expenses for your kitchen \
because it's your fault that \
you misused your blender \
by forgetting to put the lid on before \
starting the blender. \
Tough luck! See ya!
"""

# 一种用英语海盗语言说话的有礼貌的语气
service_style_pirate = """\
a polite tone \
that speaks in English Pirate\
"""

service_messages = prompt_template.format_messages(
    style=service_style_pirate,
    text=service_reply)

print(service_messages[0].content)
```

```
Translate the text that is delimited by triple backticks into a style that is a polite tone that speaks in English Pirate. text: ```Hey there customer, the warranty does not cover cleaning expenses for your kitchen because it's your fault that you misused your blender by forgetting to put the lid on before starting the blender. Tough luck! See ya!```
```

```py
service_response = chat(service_messages)

# 啊呵呵，伙计！我必须友好地告诉你，保修不包括清洁你的厨房的费用，因为你不小心忘记在启动搅拌机之前盖上盖子，这是你自己的过错。是啊，运气不好！再见，我的好伙计！
print(service_response.content)
```

```
Ahoy there, matey! I must kindly inform ye that the warranty be not coverin' the expenses o' cleaning yer galley, as 'tis yer own fault fer misusin' yer blender by forgettin' to put the lid on afore startin' it. Aye, tough luck! Farewell, me hearty!
```

```py
template_string = """请将下面三个反引号分隔的文本翻译成{style}
文本：```{text}```
"""

prompt_template = ChatPromptTemplate.from_template(template_string)
print(prompt_template.messages)
```

```
[HumanMessagePromptTemplate(prompt=PromptTemplate(input_variables=['style', 'text'], output_parser=None, partial_variables={}, template='请将下面三个反引号分隔的文本翻译成{style}\n文本：```{text}```\n', template_format='f-string', validate_template=True), additional_kwargs={})]
```

```py
customer_email = "啊，我的搅拌机盖子飞了，把我的厨房墙壁都弄得满是果汁！更糟糕的是，保修不包括清理厨房的费用。伙计，我现在需要你的帮助！"
customer_style = "以生成和愤怒的口吻说标准普通话。"

customer_messages = prompt_template.format_messages(style=customer_style, text=customer_email)
print(customer_messages)
```

```
[HumanMessage(content='请将下面三个反引号分隔的文本翻译成以生气和愤怒的口吻说标准普通话。\n文本：```啊，我的搅拌机盖子飞了，把我的厨房墙壁都弄得满是果汁！更糟糕的是，保修不包括清理厨房的费用。伙计，我现在需要你的帮助！```\n', additional_kwargs={}, example=False)]
```

```py
response = chat(customer_messages)
print(response.content)
```

```
什么？！我的搅拌机盖子竟然飞了？！现在我的厨房墙壁都被果汁弄得一片狼藉！这还不够糟糕吗？！保修居然不包括清理费用？！你听好了，伙计，我现在需要你的帮助！
```


#### Output Parsers（输出解析器）
定义我们希望 LLM 输出的样式

```py
{
  "gift": False,                        # 礼物
  "delivery_days": 5,                   # 交货天数
  "price_value": "pretty affordable!"   # 价值 : 相当实惠！
}
```

```py
customer_review = """\
This leaf blower is pretty amazing.  It has four settings:\
candle blower, gentle breeze, windy city, and tornado. \
It arrived in two days, just in time for my wife's \
anniversary present. \
I think my wife liked it so much she was speechless. \
So far I've been the only one using it, and I've been \
using it every other morning to clear the leaves on our lawn. \
It's slightly more expensive than the other leaf blowers \
out there, but I think it's worth it for the extra features.
"""

review_template = """\
For the following text, extract the following information:

gift: Was the item purchased as a gift for someone else? \
Answer True if yes, False if not or unknown.

delivery_days: How many days did it take for the product \
to arrive? If this information is not found, output -1.

price_value: Extract any sentences about the value or price,\
and output them as a comma separated Python list.

Format the output as JSON with the following keys:
gift
delivery_days
price_value

text: {text}
"""
```

```py
from langchain.prompts import ChatPromptTemplate

prompt_template = ChatPromptTemplate.from_template(review_template)
print(prompt_template)
```

```
input_variables=['text'] output_parser=None partial_variables={} messages=[HumanMessagePromptTemplate(prompt=PromptTemplate(input_variables=['text'], output_parser=None, partial_variables={}, template='For the following text, extract the following information:\n\ngift: Was the item purchased as a gift for someone else? Answer True if yes, False if not or unknown.\n\ndelivery_days: How many days did it take for the product to arrive? If this information is not found, output -1.\n\nprice_value: Extract any sentences about the value or price,and output them as a comma separated Python list.\n\nFormat the output as JSON with the following keys:\ngift\ndelivery_days\nprice_value\n\ntext: {text}\n', template_format='f-string', validate_template=True), additional_kwargs={})]
```

```py
messages = prompt_template.format_messages(text=customer_review)
chat = ChatOpenAI(temperature=0.0) # 可以获得更稳定的结果
response = chat(messages)
print(response.content)
```

```
{
    "gift": true,
    "delivery_days": 2,
    "price_value": ["It's slightly more expensive than the other leaf blowers out there, but I think it's worth it for the extra features."]
}
```

```py
type(response.content)
```

```
str
```

```py
# You will get an error by running this line of code 
# because'gift' is not a dictionary
# 'gift' is a string
response.content.get('gift')
```

```py
customer_review_zh = """这个吹叶机非常惊人。\
它有四个设置：蜡烛吹风机、轻柔微风、狂风城市和龙卷风。\
它在两天内到达，正好赶上我妻子的周年礼物。\
我认为我妻子非常喜欢它，以至于她无言以对。\
到目前为止，我是唯一使用它的人，我每隔一天早上都用它来清理我们草坪上的落叶。\
它比其他吹叶机略贵，但我认为它的额外功能是值得的。
"""

review_template_zh = """\
对于以下文本，提取以下信息：

gift：该物品是否作为礼物购买给他人？如果是，请回答True，否则回答False或未知。

delivery_days：产品到达需要多少天？如果找不到此信息，请输出-1。

price_value：提取有关价值或价格的任何句子，并将它们作为逗号分隔的Python列表输出。

将输出格式化为JSON，具有以下键：
gift
delivery_days
price_value

text: {text}
"""
```

```py
from langchain.prompts import ChatPromptTemplate

prompt_template = ChatPromptTemplate.from_template(review_template_zh)
print(prompt_template)
```

```
input_variables=['text'] output_parser=None partial_variables={} messages=[HumanMessagePromptTemplate(prompt=PromptTemplate(input_variables=['text'], output_parser=None, partial_variables={}, template='对于以下文本，提取以下信息：\n\ngift：该物品是否作为礼物购买给他人？如果是，请回答True，否则回答False或未知。\n\ndelivery_days：产品到达需要多少天？如果找不到此信息，请输出-1。\n\nprice_value：提取有关价值或价格的任何句子，并将它们作为逗号分隔的Python列表输出。\n\n将输出格式化为JSON，具有以下键：\ngift\ndelivery_days\nprice_value\n\ntext: {text}\n', template_format='f-string', validate_template=True), additional_kwargs={})]
```

```py
messages = prompt_template.format_messages(text=customer_review_zh)
chat = ChatOpenAI(temperature=0.0)
response = chat(messages)
print(response.content)
```

```
{
    "gift": true,
    "delivery_days": 2,
    "price_value": ["它比其他吹叶机略贵，但我认为它的额外功能是值得的。"]
}
```


#### Parse the LLM output string into a Python dictionary（将 LLM 输出字符串解析为 Python 字典）

```py
from langchain.output_parsers import ResponseSchema
from langchain.output_parsers import StructuredOutputParser
```

```py
# 礼物：是否购买该物品作为礼物送给他人？如果是，请回答True；如果不是或者不确定，请回答False。
gift_schema = ResponseSchema(name="gift", description="Was the item purchased as a gift for someone else? Answer True if yes, False if not or unknown.")

# 交货天数：产品到达需要多少天？如果找不到这个信息，请输出-1。
delivery_days_schema = ResponseSchema(name="delivery_days", description="How many days did it take for the product to arrive? If this information is not found, output -1.")

# 价值：提取任何关于价值或价格的句子，并将它们作为逗号分隔的Python列表输出。
price_value_schema = ResponseSchema(name="price_value", description="Extract any sentences about the value or price, and output them as a comma separated Python list.")

response_schemas = [gift_schema, 
                    delivery_days_schema,
                    price_value_schema]

output_parser = StructuredOutputParser.from_response_schemas(response_schemas)
format_instructions = output_parser.get_format_instructions()
print(format_instructions)
```

```
The output should be a markdown code snippet formatted in the following schema, including the leading and trailing "\`\`\`json" and "\`\`\`":

```json
{
	"gift": string  // Was the item purchased as a gift for someone else? Answer True if yes, False if not or unknown.
	"delivery_days": string  // How many days did it take for the product to arrive? If this information is not found, output -1.
	"price_value": string  // Extract any sentences about the value or price, and output them as a comma separated Python list.
}
```
```

```py
review_template_2 = """\
For the following text, extract the following information:

gift: Was the item purchased as a gift for someone else? \
Answer True if yes, False if not or unknown.

delivery_days: How many days did it take for the product\
to arrive? If this information is not found, output -1.

price_value: Extract any sentences about the value or price,\
and output them as a comma separated Python list.

text: {text}

{format_instructions}
"""

prompt = ChatPromptTemplate.from_template(template=review_template_2)

messages = prompt.format_messages(text=customer_review, 
                                format_instructions=format_instructions)
print(messages[0].content)
```

```
For the following text, extract the following information:

gift: Was the item purchased as a gift for someone else? Answer True if yes, False if not or unknown.

delivery_days: How many days did it take for the productto arrive? If this information is not found, output -1.

price_value: Extract any sentences about the value or price,and output them as a comma separated Python list.

text: This leaf blower is pretty amazing.  It has four settings:candle blower, gentle breeze, windy city, and tornado. It arrived in two days, just in time for my wife's anniversary present. I think my wife liked it so much she was speechless. So far I've been the only one using it, and I've been using it every other morning to clear the leaves on our lawn. It's slightly more expensive than the other leaf blowers out there, but I think it's worth it for the extra features.


The output should be a markdown code snippet formatted in the following schema, including the leading and trailing "\`\`\`json" and "\`\`\`":

```json
{
	"gift": string  // Was the item purchased as a gift for someone else? Answer True if yes, False if not or unknown.
	"delivery_days": string  // How many days did it take for the product to arrive? If this information is not found, output -1.
	"price_value": string  // Extract any sentences about the value or price, and output them as a comma separated Python list.
}
```
```

```py
response = chat(messages)
print(response.content)
```

```
```json
{
	"gift": true,
	"delivery_days": "2",
	"price_value": ["It's slightly more expensive than the other leaf blowers out there, but I think it's worth it for the extra features."]
}
```
```

```py
output_dict = output_parser.parse(response.content)
output_dict
```

```
{'gift': True,
 'delivery_days': '2',
 'price_value': ["It's slightly more expensive than the other leaf blowers out there, but I think it's worth it for the extra features."]}
```

```py
output_dict.get('delivery_days')
```

```
'2'
```

```py
gift_schema = ResponseSchema(name="gift", description="是否购买该物品作为礼物送给他人？如果是，请回答True；如果不是或者不确定，请回答False。")
delivery_days_schema = ResponseSchema(name="delivery_days", description="产品到达需要多少天？如果找不到这个信息，请输出-1。值的类型是数字。")
price_value_schema = ResponseSchema(name="price_value", description="提取任何关于价值或价格的句子，并将它们作为逗号分隔的Python列表输出。")

response_schemas = [gift_schema, 
                    delivery_days_schema,
                    price_value_schema]
```

```py
output_parser = StructuredOutputParser.from_response_schemas(response_schemas)
format_instructions = output_parser.get_format_instructions()
print(format_instructions)
```

```
The output should be a markdown code snippet formatted in the following schema, including the leading and trailing "\`\`\`json" and "\`\`\`":

```json
{
	"gift": string  // 是否购买该物品作为礼物送给他人？如果是，请回答True；如果不是或者不确定，请回答False。
	"delivery_days": string  // 产品到达需要多少天？如果找不到这个信息，请输出-1。值的类型是数字。
	"price_value": string  // 提取任何关于价值或价格的句子，并将它们作为逗号分隔的Python列表输出。
}
```
```

```py
customer_review_zh = """这个吹叶机非常惊人。\
它有四个设置：蜡烛吹风机、轻柔微风、狂风城市和龙卷风。\
它在两天内到达，正好赶上我妻子的周年礼物。\
我认为我妻子非常喜欢它，以至于她无言以对。\
到目前为止，我是唯一使用它的人，我每隔一天早上都用它来清理我们草坪上的落叶。\
它比其他吹叶机略贵，但我认为它的额外功能是值得的。
"""

review_template_2 = """\
请提取以下文本中的信息：

gift：该物品是否作为礼物购买给他人？如果是，请回答True，否则为False或未知。

delivery_days：产品到达需要多少天？如果找不到此信息，请输出-1。值的类型是数字。

price_value：提取有关价值或价格的任何句子，并将它们作为逗号分隔的Python列表输出。

text: {text}

{format_instructions}
"""

prompt = ChatPromptTemplate.from_template(template=review_template_2)

messages = prompt.format_messages(text=customer_review_zh, 
                                format_instructions=format_instructions)
print(messages[0].content)
```

```
请提取以下文本中的信息：

gift：该物品是否作为礼物购买给他人？如果是，请回答True，否则为False或未知。

delivery_days：产品到达需要多少天？如果找不到此信息，请输出-1。值的类型是数字。

price_value：提取有关价值或价格的任何句子，并将它们作为逗号分隔的Python列表输出。

text: 这个吹叶机非常惊人。它有四个设置：蜡烛吹风机、轻柔微风、狂风城市和龙卷风。它在两天内到达，正好赶上我妻子的周年礼物。我认为我妻子非常喜欢它，以至于她无言以对。到目前为止，我是唯一使用它的人，我每隔一天早上都用它来清理我们草坪上的落叶。它比其他吹叶机略贵，但我认为它的额外功能是值得的。


The output should be a markdown code snippet formatted in the following schema, including the leading and trailing "\`\`\`json" and "\`\`\`":

```json
{
	"gift": string  // 是否购买该物品作为礼物送给他人？如果是，请回答True；如果不是或者不确定，请回答False。
	"delivery_days": string  // 产品到达需要多少天？如果找不到这个信息，请输出-1。值的类型是数字。
	"price_value": string  // 提取任何关于价值或价格的句子，并将它们作为逗号分隔的Python列表输出。
}
```
```

```py
response = chat(messages)
print(response.content)
```

```
```json
{
	"gift": true,
	"delivery_days": 2,
	"price_value": ["它比其他吹叶机略贵，但我认为它的额外功能是值得的。"]
}
```
```

```py
output_dict = output_parser.parse(response.content)
output_dict.get('delivery_days')
```

```
2
```

上面在 ChatPromptTemplate 和 ResponseSchema 中对 gift, delivery_days, price_value 这几个键的提取都做了相同的描述，有点冗余。`这里把 ChatPromptTemplate 中的提取描述给移除了，可以达到相同的效果，唯一的小毛病是 delivery_days 值的类型是字符串`。

```py
customer_review_zh = """这个吹叶机非常惊人。\
它有四个设置：蜡烛吹风机、轻柔微风、狂风城市和龙卷风。\
它在两天内到达，正好赶上我妻子的周年礼物。\
我认为我妻子非常喜欢它，以至于她无言以对。\
到目前为止，我是唯一使用它的人，我每隔一天早上都用它来清理我们草坪上的落叶。\
它比其他吹叶机略贵，但我认为它的额外功能是值得的。
"""

review_template_2 = """\
{text}

{format_instructions}
"""

prompt = ChatPromptTemplate.from_template(template=review_template_2)

messages = prompt.format_messages(text=customer_review_zh, 
                                format_instructions=format_instructions)
response = chat(messages)
print(response.content)
```

```
```json
{
	"gift": false,
	"delivery_days": "2",
	"price_value": "它比其他吹叶机略贵，但我认为它的额外功能是值得的。"
}
```
```

```py
output_dict = output_parser.parse(response.content)
output_dict.get('delivery_days')
```

```
'2'
```

## LangChain: Memory

当你与那些语言模型进行交互的时候，他们不会记得你之前和他进行的交流内容，这在我们构建一些应用程序（如聊天机器人）的时候，是一个很大的问题。

LangChain 中的 Memory 模块，可以将先前的对话嵌入到语言模型中，使其具有连续对话的能力。

当使用 LangChain 中的 Memory 组件时，他可以帮助保存和管理历史聊天消息，以及构建关于特定实体的知识。这些组件可以跨多轮对话存储信息，并允许在对话期间跟踪特定信息和上下文。

LangChain 提供了多种 Memory 类型，包括：
* ConversationBufferMemory
* ConversationBufferWindowMemory
* Entity Memory
* Conversation Knowledge Graph Memory
* ConversationSummaryMemory
* ConversationSummaryBufferMemory
* ConversationTokenBufferMemory
* VectorStore-Backed Memory

缓冲区记忆允许保留最近的聊天消息，摘要记忆则提供了对整个对话的摘要。实体记忆则允许在多轮对话中保留有关特定实体的信息。

这些 Memory 组件都是模块化的，可与其他组件组合使用，从而增强机器人的对话管理能力。Memory 模块可以通过简单的API调用来访问和更新，允许开发人员更轻松地实现对话历史记录的管理和维护。


### ConversationBufferMemory
```py
import os

from dotenv import load_dotenv, find_dotenv
_ = load_dotenv(find_dotenv()) # read local .env file

import warnings
warnings.filterwarnings('ignore')
```

```py
from langchain.chat_models import ChatOpenAI
from langchain.chains import ConversationChain
from langchain.memory import ConversationBufferMemory

llm = ChatOpenAI(temperature=0.0)
memory = ConversationBufferMemory()
conversation = ConversationChain(
    llm=llm, 
    memory = memory,
    verbose=True
)
```

```py
conversation.predict(input="Hi, my name is Andrew")
```

```
> Entering new ConversationChain chain...
Prompt after formatting:
The following is a friendly conversation between a human and an AI. The AI is talkative and provides lots of specific details from its context. If the AI does not know the answer to a question, it truthfully says it does not know.

Current conversation:

Human: Hi, my name is Andrew
AI:

> Finished chain.
"Hello Andrew, it's nice to meet you. My name is AI. How can I assist you today?"
```

```py
conversation.predict(input="What is 1+1?")
```

```
> Entering new ConversationChain chain...
Prompt after formatting:
The following is a friendly conversation between a human and an AI. The AI is talkative and provides lots of specific details from its context. If the AI does not know the answer to a question, it truthfully says it does not know.

Current conversation:
Human: Hi, my name is Andrew
AI: Hello Andrew, it's nice to meet you. My name is AI. How can I assist you today?
Human: What is 1+1?
AI:

> Finished chain.
'The answer to 1+1 is 2.'
```

```py
conversation.predict(input="What is my name?")
```

```
> Entering new ConversationChain chain...
Prompt after formatting:
The following is a friendly conversation between a human and an AI. The AI is talkative and provides lots of specific details from its context. If the AI does not know the answer to a question, it truthfully says it does not know.

Current conversation:
Human: Hi, my name is Andrew
AI: Hello Andrew, it's nice to meet you. My name is AI. How can I assist you today?
Human: What is 1+1?
AI: The answer to 1+1 is 2.
Human: What is my name?
AI:

> Finished chain.
'Your name is Andrew, as you mentioned earlier.'
```

```py
print(memory.buffer)
```

```
Human: Hi, my name is Andrew
AI: Hello Andrew, it's nice to meet you. My name is AI. How can I assist you today?
Human: What is 1+1?
AI: The answer to 1+1 is 2.
Human: What is my name?
AI: Your name is Andrew, as you mentioned earlier.
```

```py
memory.load_memory_variables({})
```

```
{'history': "Human: Hi, my name is Andrew\nAI: Hello Andrew, it's nice to meet you. My name is AI. How can I assist you today?\nHuman: What is 1+1?\nAI: The answer to 1+1 is 2.\nHuman: What is my name?\nAI: Your name is Andrew, as you mentioned earlier."}
```

```py
memory = ConversationBufferMemory()
memory.save_context({"input": "Hi"}, 
                    {"output": "What's up"})
print(memory.buffer)
```

```
Human: Hi
AI: What's up
```

```py
memory.load_memory_variables({})
```

```
{'history': "Human: Hi\nAI: What's up"}
```

```py
memory.save_context({"input": "Not much, just hanging"}, 
                    {"output": "Cool"})
memory.load_memory_variables({})
```

```
{'history': "Human: Hi\nAI: What's up\nHuman: Not much, just hanging\nAI: Cool"}
```

### ConversationBufferWindowMemory

```py
from langchain.memory import ConversationBufferWindowMemory

memory = ConversationBufferWindowMemory(k=1)
memory.save_context({"input": "Hi"},
                    {"output": "What's up"})
memory.save_context({"input": "Not much, just hanging"},
                    {"output": "Cool"})
memory.load_memory_variables({})
```

```
{'history': 'Human: Not much, just hanging\nAI: Cool'}
```

```py
llm = ChatOpenAI(temperature=0.0)
memory = ConversationBufferWindowMemory(k=1)
conversation = ConversationChain(
    llm=llm, 
    memory = memory,
    verbose=False
)

conversation.predict(input="Hi, my name is Andrew")
```

```
"Hello Andrew, it's nice to meet you. My name is AI. How can I assist you today?"
```

```py
conversation.predict(input="What is 1+1?")
```

```
'The answer to 1+1 is 2.'
```

```py
conversation.predict(input="What is my name?")
```

```
"I'm sorry, I don't have access to that information. Could you please tell me your name?"
```

### ConversationTokenBufferMemory

```bash
pip install tiktoken
```

```py
from langchain.memory import ConversationTokenBufferMemory
from langchain.llms import OpenAI

llm = ChatOpenAI(temperature=0.0)
```

```py
memory = ConversationTokenBufferMemory(llm=llm, max_token_limit=30)
memory.save_context({"input": "AI is what?!"},
                    {"output": "Amazing!"})
memory.save_context({"input": "Backpropagation is what?"},
                    {"output": "Beautiful!"})
memory.save_context({"input": "Chatbots are what?"}, 
                    {"output": "Charming!"})

memory.load_memory_variables({})
```

```
{'history': 'AI: Beautiful!\nHuman: Chatbots are what?\nAI: Charming!'}
```

ConversationTokenBufferMemory 的参数需要依赖 LLM，是因为不同的语言模型使用不同的 Token 计数方式。


### ConversationSummaryMemory

```py
from langchain.memory import ConversationSummaryBufferMemory

# create a long string
schedule = "There is a meeting at 8am with your product team. \
You will need your powerpoint presentation prepared. \
9am-12pm have time to work on your LangChain \
project which will go quickly because Langchain is such a powerful tool. \
At Noon, lunch at the italian resturant with a customer who is driving \
from over an hour away to meet you to understand the latest in AI. \
Be sure to bring your laptop to show the latest LLM demo."

memory = ConversationSummaryBufferMemory(llm=llm, max_token_limit=100)
memory.save_context({"input": "Hello"}, {"output": "What's up"})
memory.save_context({"input": "Not much, just hanging"},
                    {"output": "Cool"})
memory.save_context({"input": "What is on the schedule today?"}, 
                    {"output": f"{schedule}"})

memory.load_memory_variables({})
```

```
{'history': "System: The human and AI engage in small talk before discussing the day's schedule. The AI informs the human of a morning meeting with the product team, time to work on the LangChain project, and a lunch meeting with a customer interested in the latest AI developments."}
```

```py
conversation = ConversationChain(
    llm=llm, 
    memory = memory,
    verbose=True
)

conversation.predict(input="What would be a good demo to show?")
```

```
> Entering new ConversationChain chain...
Prompt after formatting:
The following is a friendly conversation between a human and an AI. The AI is talkative and provides lots of specific details from its context. If the AI does not know the answer to a question, it truthfully says it does not know.

Current conversation:
System: The human and AI engage in small talk before discussing the day's schedule. The AI informs the human of a morning meeting with the product team, time to work on the LangChain project, and a lunch meeting with a customer interested in the latest AI developments.
Human: What would be a good demo to show?
AI:

> Finished chain.
"Based on the customer's interest in AI developments, I would suggest showcasing our latest natural language processing capabilities. We could demonstrate how our AI can understand and respond to complex language queries, and even provide personalized recommendations based on the user's preferences. Additionally, we could highlight our machine learning algorithms and how they continuously improve the accuracy and efficiency of our AI. Would you like me to prepare a demo for the meeting?"
```

```py
memory.load_memory_variables({})
```

```
{'history': "System: The human and AI engage in small talk before discussing the day's schedule. The AI informs the human of a morning meeting with the product team, time to work on the LangChain project, and a lunch meeting with a customer interested in the latest AI developments. The human asks what would be a good demo to show.\nAI: Based on the customer's interest in AI developments, I would suggest showcasing our latest natural language processing capabilities. We could demonstrate how our AI can understand and respond to complex language queries, and even provide personalized recommendations based on the user's preferences. Additionally, we could highlight our machine learning algorithms and how they continuously improve the accuracy and efficiency of our AI. Would you like me to prepare a demo for the meeting?"}
```

```py
from langchain.memory import ConversationSummaryBufferMemory

# create a long string
schedule = "你需要在早上8点与你的产品团队开会，需要准备好你的PowerPoint演示文稿。\
上午9点至中午12点有时间工作于你的LangChain项目上，因为LangChain是如此强大的工具，所以进展会很快。\
中午，在意大利餐厅与一位客户共进午餐，他开车一小时以上来见你，了解最新的人工智能技术。\
记得带上你的笔记本电脑展示最新的LLM演示。"

memory = ConversationSummaryBufferMemory(llm=llm, max_token_limit=100)
memory.save_context({"input": "你好！"}, {"output": "最近怎么样？"})
memory.save_context({"input": "没什么，就是闲逛。"},
                    {"output": "酷。"})
memory.save_context({"input": "今天的日程安排是什么？"}, 
                    {"output": f"{schedule}"})

memory.load_memory_variables({})
```

```
{'history': 'System: The human greets the AI and asks about their day. The AI provides a detailed schedule for the human, including a meeting with their product team, work on their LangChain project, and a lunch meeting with a client interested in the latest AI technology. The AI reminds the human to bring their laptop to showcase the latest LLM demo.'}

{'history': 'System: 人类向人工智能问候并询问它们的一天。人工智能为人类提供了详细的日程安排，包括与产品团队的会议、LangChain项目的工作以及与对最新人工智能技术感兴趣的客户的午餐会议。人工智能提醒人类带上笔记本电脑展示最新的LLM演示。'}
```

```py
conversation = ConversationChain(
    llm=llm, 
    memory = memory,
    verbose=True
)
conversation.predict(input="有什么好的演示可以展示？")
```

```
> Entering new ConversationChain chain...
Prompt after formatting:
The following is a friendly conversation between a human and an AI. The AI is talkative and provides lots of specific details from its context. If the AI does not know the answer to a question, it truthfully says it does not know.

Current conversation:
System: The human greets the AI and asks about their day. The AI provides a detailed schedule for the human, including a meeting with their product team, work on their LangChain project, and a lunch meeting with a client interested in the latest AI technology. The AI reminds the human to bring their laptop to showcase the latest LLM demo. The human asks if there are any good demos to showcase.
AI: 我们最新的LLM演示非常棒，可以展示我们的语言链技术在自然语言处理方面的应用。我们还有一些其他的演示，比如我们的智能客服系统和图像识别技术，但是我认为LLM演示最能吸引客户的眼球。
Human: 有什么好的演示可以展示？
AI:

> Finished chain.
'我们最新的LLM演示非常棒，可以展示我们的语言链技术在自然语言处理方面的应用。我们还有一些其他的演示，比如我们的智能客服系统和图像识别技术，但是我认为LLM演示最能吸引客户的眼球。'
```

```py
memory.load_memory_variables({})
```

```
{'history': 'System: The human greets the AI and asks about their day. The AI provides a detailed schedule for the human, including a meeting with their product team, work on their LangChain project, and a lunch meeting with a client interested in the latest AI technology. The AI reminds the human to bring their laptop to showcase the latest LLM demo, which the AI believes is the most impressive demonstration of their natural language processing technology. The human asks if there are any other good demos to showcase.\nAI: 我们最新的LLM演示非常棒，可以展示我们的语言链技术在自然语言处理方面的应用。我们还有一些其他的演示，比如我们的智能客服系统和图像识别技术，但是我认为LLM演示最能吸引客户的眼球。'}
```

```py
from langchain.memory import ConversationSummaryBufferMemory

# create a long string
schedule = "你需要在早上8点与你的产品团队开会，需要准备好你的PowerPoint演示文稿。\
上午9点至中午12点有时间工作于你的LangChain项目上，因为LangChain是如此强大的工具，所以进展会很快。\
中午，在意大利餐厅与一位客户共进午餐，他开车一小时以上来见你，了解最新的人工智能技术。\
记得带上你的笔记本电脑展示最新的LLM演示。"

memory = ConversationSummaryBufferMemory(llm=llm, max_token_limit=400)
memory.save_context({"input": "你好！"}, {"output": "最近怎么样？"})
memory.save_context({"input": "没什么，就是闲逛。"},
                    {"output": "酷。"})
memory.save_context({"input": "今天的日程安排是什么？"}, 
                    {"output": f"{schedule}"})

memory.load_memory_variables({})
```

```
{'history': 'Human: 你好！\nAI: 最近怎么样？\nHuman: 没什么，就是闲逛。\nAI: 酷。\nHuman: 今天的日程安排是什么？\nAI: 你需要在早上8点与你的产品团队开会，需要准备好你的PowerPoint演示文稿。上午9点至中午12点有时间工作于你的LangChain项目上，因为LangChain是如此强大的工具，所以进展会很快。中午，在意大利餐厅与一位客户共进午餐，他开车一小时以上来见你，了解最新的人工智能技术。记得带上你的笔记本电脑展示最新的LLM演示。'}
```

如果 max_token_limit 给的足够大，memory 中的内容的 Token 数没有超过，就不会生成摘要内容。

```py
from langchain.memory import ConversationSummaryBufferMemory

# create a long string
schedule = "你需要在早上8点与你的产品团队开会，需要准备好你的PowerPoint演示文稿。\
上午9点至中午12点有时间工作于你的LangChain项目上，因为LangChain是如此强大的工具，所以进展会很快。\
中午，在意大利餐厅与一位客户共进午餐，他开车一小时以上来见你，了解最新的人工智能技术。\
记得带上你的笔记本电脑展示最新的LLM演示。"

memory = ConversationSummaryBufferMemory(llm=llm, max_token_limit=200)
memory.save_context({"input": "你好！"}, {"output": "最近怎么样？"})
memory.save_context({"input": "没什么，就是闲逛。"},
                    {"output": "酷。"})
memory.save_context({"input": "今天的日程安排是什么？"}, 
                    {"output": f"{schedule}"})

memory.load_memory_variables({})
```

```
{'history': "System: The human greets the AI in Chinese and asks how it's been. The human responds that they've been just wandering around with nothing to do.\nAI: 酷。\nHuman: 今天的日程安排是什么？\nAI: 你需要在早上8点与你的产品团队开会，需要准备好你的PowerPoint演示文稿。上午9点至中午12点有时间工作于你的LangChain项目上，因为LangChain是如此强大的工具，所以进展会很快。中午，在意大利餐厅与一位客户共进午餐，他开车一小时以上来见你，了解最新的人工智能技术。记得带上你的笔记本电脑展示最新的LLM演示。"}
```

可以看到最近的几条聊天内容是完整保留下来的，把前面的几条进行了总结。


## Chains in LangChain
```bash
pip install pandas
```

```py
import warnings
warnings.filterwarnings('ignore')

import os

from dotenv import load_dotenv, find_dotenv
_ = load_dotenv(find_dotenv()) # read local .env file

import pandas as pd
df = pd.read_csv('Data.csv')

df.head()
```

<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>Product</th>
      <th>Review</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>Queen Size Sheet Set</td>
      <td>I ordered a king size set. My only criticism would be that I wish seller would offer the king size set with 4 pillowcases. I separately ordered a two pack of pillowcases so I could have a total of four. When I saw the two packages, it looked like the color did not exactly match. Customer service was excellent about sending me two more pillowcases so I would have four that matched. Excellent! For the cost of these sheets, I am satisfied with the characteristics and coolness of the sheets.</td>
    </tr>
    <tr>
      <th>1</th>
      <td>Waterproof Phone Pouch</td>
      <td>I loved the waterproof sac, although the opening was made of a hard plastic. I don’t know if that would break easily. But I couldn’t turn my phone on, once it was in the pouch.</td>
    </tr>
    <tr>
      <th>2</th>
      <td>Luxury Air Mattress</td>
      <td>This mattress had a small hole in the top of it (took forever to find where it was), and the patches that they provide did not work, maybe because it\'s the top of the mattress where it\'s kind of like fabric and a patch won\'t stick. Maybe I got unlucky with a defective mattress, but where\'s quality assurance for this company? That flat out should not happen. Emphasis on flat. Cause that\'s what the mattress was. Seriously horrible experience, ruined my friend\'s stay with me. Then they make you ship it back instead of just providing a refund, which is also super annoying to pack up an air mattress and take it to the UPS store. This company is the worst, and this mattress is the worst.</td>
    </tr>
    <tr>
      <th>3</th>
      <td>Pillows Insert</td>
      <td>This is the best throw pillow fillers on Amazon. I’ve tried several others, and they’re all cheap and flat no matter how much fluffing you do. Once you toss these in the dryer after you remove them from the vacuum sealed shipping material, they fluff up great</td>
    </tr>
    <tr>
      <th>4</th>
      <td>Milk Frother Handheld\
</td>
      <td>I loved this product. But they only seem to last a few months. The company was great replacing the first one (the frother falls out of the handle and can\'t be fixed). The after 4 months my second one did the same. I only use the frother for coffee once a day. It\'s not overuse or abuse. I\'m very disappointed and will look for another. As I understand they will only replace once. Anyway, if you have one good luck.</td>
    </tr>
  </tbody>
</table>

### LLMChain
```py
from langchain.chat_models import ChatOpenAI
from langchain.prompts import ChatPromptTemplate
from langchain.chains import LLMChain

llm = ChatOpenAI(temperature=0.9)
prompt = ChatPromptTemplate.from_template("What is the best name to describe a company that makes {product}?")
chain = LLMChain(llm=llm, prompt=prompt)

product = "Queen Size Sheet Set"
response = chain.run(product)
print(response)
```

```
Royal Bedding Co.
```

```py
from langchain.chat_models import ChatOpenAI
from langchain.prompts import ChatPromptTemplate
from langchain.chains import LLMChain

llm = ChatOpenAI(temperature=0.9)
prompt = ChatPromptTemplate.from_template("最适合用来描述生产{product}的公司名称是什么？")
chain = LLMChain(llm=llm, prompt=prompt)

product = "女王号床单套装"
response = chain.run(product)
print(response)
```

```
Royal Linens Co.
```

### SimpleSequentialChain

这是顺序链的最简单类型，其中每个步骤都有一个输入/输出，一个步骤的输出是下一个步骤的输入。

```py
from langchain.chains import SimpleSequentialChain

llm = ChatOpenAI(temperature=0.9)

# prompt template 1
first_prompt = ChatPromptTemplate.from_template(
    "What is the best name to describe \
    a company that makes {product}?"
)

# Chain 1
chain_one = LLMChain(llm=llm, prompt=first_prompt)

# prompt template 2
second_prompt = ChatPromptTemplate.from_template(
    "Write a 20 words description for the following \
    company:{company_name}"
)
# chain 2
chain_two = LLMChain(llm=llm, prompt=second_prompt)

overall_simple_chain = SimpleSequentialChain(chains=[chain_one, chain_two],
                                             verbose=True
                                            )
product = "Queen Size Sheet Set"
overall_simple_chain.run(product)
```

```
> Entering new SimpleSequentialChain chain...
"Royal Bedding Co."
"Royal Bedding Co. offers premium quality bedding products that ensure a comfortable and luxurious sleeping experience for every customer."

> Finished chain.
'"Royal Bedding Co. offers premium quality bedding products that ensure a comfortable and luxurious sleeping experience for every customer."'
```

```
Royal Bedding Co. 提供优质床上用品，确保为每一位顾客提供舒适奢华的睡眠体验。
```

```py
from langchain.chains import SimpleSequentialChain

llm = ChatOpenAI(temperature=0.9)

# prompt template 1
first_prompt = ChatPromptTemplate.from_template(
    "最适合用来描述生产{product}的公司名称是什么？"
)

# Chain 1
chain_one = LLMChain(llm=llm, prompt=first_prompt)

# prompt template 2
second_prompt = ChatPromptTemplate.from_template(
    "为以下公司写一篇 20 字的描述：{company_name}"
)
# chain 2
chain_two = LLMChain(llm=llm, prompt=second_prompt)

overall_simple_chain = SimpleSequentialChain(chains=[chain_one, chain_two],
                                             verbose=True
                                            )
product = "女王号床单套装"
overall_simple_chain.run(product)
```

```
> Entering new SimpleSequentialChain chain...
皇家纺织公司。
皇家纺织公司：高品质纺织品制造商。

> Finished chain.
'皇家纺织公司：高品质纺织品制造商。'
```

```py
from langchain.chains import SimpleSequentialChain

llm = ChatOpenAI(temperature=0.9)

# prompt template 1
first_prompt = ChatPromptTemplate.from_template(
    "最适合用来描述生产{product}的公司名称是什么？"
)

# Chain 1
chain_one = LLMChain(llm=llm, prompt=first_prompt)

# prompt template 2
second_prompt = ChatPromptTemplate.from_template(
    "为以下公司写一篇 20 单词的描述：{company_name}"
)
# chain 2
chain_two = LLMChain(llm=llm, prompt=second_prompt)

overall_simple_chain = SimpleSequentialChain(chains=[chain_one, chain_two],
                                             verbose=True
                                            )
product = "女王号床单套装"
overall_simple_chain.run(product)
```

```
> Entering new SimpleSequentialChain chain...
Royal Bedding Company.
Royal Bedding Company：生产高品质床上用品，包括床垫和床单等。

> Finished chain.
'Royal Bedding Company：生产高品质床上用品，包括床垫和床单等。'
```

### SequentialChain

当有多个输入或多个输出时，我们需要使用 SequentialChain。

```py
from langchain.chains import SequentialChain

llm = ChatOpenAI(temperature=0.9)

# prompt template 1: translate to english
first_prompt = ChatPromptTemplate.from_template(
    "Translate the following review to english:"
    "\n\n{Review}"
)
# chain 1: input= Review and output= English_Review
chain_one = LLMChain(llm=llm, prompt=first_prompt, 
                     output_key="English_Review"
                    )

second_prompt = ChatPromptTemplate.from_template(
    "Can you summarize the following review in 1 sentence:"
    "\n\n{English_Review}"
)
# chain 2: input= English_Review and output= summary
chain_two = LLMChain(llm=llm, prompt=second_prompt, 
                     output_key="summary"
                    )

# prompt template 3: translate to english
third_prompt = ChatPromptTemplate.from_template(
    "What language is the following review:\n\n{Review}"
)
# chain 3: input= Review and output= language
chain_three = LLMChain(llm=llm, prompt=third_prompt,
                       output_key="language"
                      )


# prompt template 4: follow up message
fourth_prompt = ChatPromptTemplate.from_template(
    "Write a follow up response to the following "
    "summary in the specified language:"
    "\n\nSummary: {summary}\n\nLanguage: {language}"
)
# chain 4: input= summary, language and output= followup_message
chain_four = LLMChain(llm=llm, prompt=fourth_prompt,
                      output_key="followup_message"
                     )

# overall_chain: input= Review 
# and output= English_Review,summary, followup_message
overall_chain = SequentialChain(
    chains=[chain_one, chain_two, chain_three, chain_four],
    input_variables=["Review"],
    output_variables=["English_Review", "summary","followup_message"],
    verbose=True
)

review = df.Review[5]
overall_chain(review)
```

```
> Entering new SequentialChain chain...

> Finished chain.
{'Review': "Je trouve le goût médiocre. La mousse ne tient pas, c'est bizarre. J'achète les mêmes dans le commerce et le goût est bien meilleur...\nVieux lot ou contrefaçon !?",
 'English_Review': "I find the taste mediocre. The foam doesn't hold, it's weird. I buy the same ones in stores and the taste is much better... Old batch or counterfeit!?",
 'summary': "The reviewer is disappointed with the taste and foam of the product and wonders if it's an old batch or counterfeit.",
 'followup_message': "Réponse: Le critique est déçu par le goût et la mousse du produit et se demande s'il s'agit d'un vieux lot ou d'une contrefaçon. Nous sommes désolés que vous n'ayez pas été satisfait de notre produit. Nous tenons à assurer nos clients que nous maintenons des contrôles de qualité stricts pour garantir la qualité de nos produits. Nous prenons votre commentaire au sérieux et nous allons enquêter sur ce problème pour nous assurer que notre prochain lot est de la plus haute qualité. Nous espérons que vous nous donnerez une autre chance de vous impressionner avec nos produits."}
```

```py
from langchain.chains import SequentialChain

llm = ChatOpenAI(temperature=0.9)

# prompt template 1: translate to english
first_prompt = ChatPromptTemplate.from_template("将以下评论翻译成中文：\n\n{Review}")
# chain 1: input= Review and output= Chinese_Review
chain_one = LLMChain(llm=llm, prompt=first_prompt, output_key="Chinese_Review")

second_prompt = ChatPromptTemplate.from_template("用一句话总结以下评论：\n\n{Chinese_Review}")
# chain 2: input= Chinese_Review and output= summary
chain_two = LLMChain(llm=llm, prompt=second_prompt, output_key="summary")

third_prompt = ChatPromptTemplate.from_template("以下评论是什么语言：\n\n{Review}")
# chain 3: input= Review and output= language
chain_three = LLMChain(llm=llm, prompt=third_prompt, output_key="language")


# prompt template 4: follow up message
fourth_prompt = ChatPromptTemplate.from_template(
    "用指定语言写下对以下摘要的跟进回复："
    "\n\nSummary: {summary}\n\nLanguage: {language}"
)
# chain 4: input= summary, language and output= followup_message
chain_four = LLMChain(llm=llm, prompt=fourth_prompt, output_key="followup_message")

# prompt template 5: follow up message translate Chinese
fifth_prompt = ChatPromptTemplate.from_template(
    "将下面的文本翻译为中文："
    "\n\n{followup_message}"
)
# chain 5: input= followup_message and output= followup_message_chinese
chain_five = LLMChain(llm=llm, prompt=fifth_prompt, output_key="followup_message_chinese")

# overall_chain: input= Review 
# and output= Chinese_Review,summary, followup_message_chinese
overall_chain = SequentialChain(
    chains=[chain_one, chain_two, chain_three, chain_four, chain_five],
    input_variables=["Review"],
    output_variables=["Chinese_Review", "summary", "followup_message_chinese"],
    verbose=True
)

review = df.Review[5]
overall_chain(review)
```

```
> Entering new SequentialChain chain...

> Finished chain.
{'Review': "Je trouve le goût médiocre. La mousse ne tient pas, c'est bizarre. J'achète les mêmes dans le commerce et le goût est bien meilleur...\nVieux lot ou contrefaçon !?",
 'Chinese_Review': '我觉得味道很差。泡沫不持久，很奇怪。我在商店里买了同样的东西，味道好多了…\n是老货或者是假货！？',
 'summary': '质疑商品的真实性，认为口感不佳。',
 'followup_message_chinese': '简介：对产品的真实性提出质疑并提到味道较差。\n\n回复：我们很遗憾地得知您对我们的产品不满意。我们向客户保证产品的质量和真实性，但我们愿意调查您遇到的问题。我们邀请您直接与我们联系，以便我们可以解决问题并提供令人满意的解决方案。感谢您的反馈。'}
```

### Router Chain

```py
physics_template = """You are a very smart physics professor. \
You are great at answering questions about physics in a concise\
and easy to understand manner. \
When you don't know the answer to a question you admit\
that you don't know.

Here is a question:
{input}"""


math_template = """You are a very good mathematician. \
You are great at answering math questions. \
You are so good because you are able to break down \
hard problems into their component parts, 
answer the component parts, and then put them together\
to answer the broader question.

Here is a question:
{input}"""

history_template = """You are a very good historian. \
You have an excellent knowledge of and understanding of people,\
events and contexts from a range of historical periods. \
You have the ability to think, reflect, debate, discuss and \
evaluate the past. You have a respect for historical evidence\
and the ability to make use of it to support your explanations \
and judgements.

Here is a question:
{input}"""


computerscience_template = """ You are a successful computer scientist.\
You have a passion for creativity, collaboration,\
forward-thinking, confidence, strong problem-solving capabilities,\
understanding of theories and algorithms, and excellent communication \
skills. You are great at answering coding questions. \
You are so good because you know how to solve a problem by \
describing the solution in imperative steps \
that a machine can easily interpret and you know how to \
choose a solution that has a good balance between \
time complexity and space complexity. 

Here is a question:
{input}"""

prompt_infos = [
    {
        "name": "physics", 
        "description": "Good for answering questions about physics", 
        "prompt_template": physics_template
    },
    {
        "name": "math", 
        "description": "Good for answering math questions", 
        "prompt_template": math_template
    },
    {
        "name": "History", 
        "description": "Good for answering history questions", 
        "prompt_template": history_template
    },
    {
        "name": "computer science", 
        "description": "Good for answering computer science questions", 
        "prompt_template": computerscience_template
    }
]

from langchain.chains.router import MultiPromptChain
from langchain.chains.router.llm_router import LLMRouterChain,RouterOutputParser
from langchain.prompts import PromptTemplate

llm = ChatOpenAI(temperature=0)

destination_chains = {}
for p_info in prompt_infos:
    name = p_info["name"]
    prompt_template = p_info["prompt_template"]
    prompt = ChatPromptTemplate.from_template(template=prompt_template)
    chain = LLMChain(llm=llm, prompt=prompt)
    destination_chains[name] = chain  
    
destinations = [f"{p['name']}: {p['description']}" for p in prompt_infos]
destinations_str = "\n".join(destinations)
print(destinations_str)
```

```
physics: Good for answering questions about physics
math: Good for answering math questions
History: Good for answering history questions
computer science: Good for answering computer science questions
```

```py
default_prompt = ChatPromptTemplate.from_template("{input}")
default_chain = LLMChain(llm=llm, prompt=default_prompt)

MULTI_PROMPT_ROUTER_TEMPLATE = """Given a raw text input to a \
language model select the model prompt best suited for the input. \
You will be given the names of the available prompts and a \
description of what the prompt is best suited for. \
You may also revise the original input if you think that revising\
it will ultimately lead to a better response from the language model.

<< FORMATTING >>
Return a markdown code snippet with a JSON object formatted to look like:
```json
{{{{
    "destination": string \ name of the prompt to use or "DEFAULT"
    "next_inputs": string \ a potentially modified version of the original input
}}}}
```

REMEMBER: "destination" MUST be one of the candidate prompt \
names specified below OR it can be "DEFAULT" if the input is not\
well suited for any of the candidate prompts.
REMEMBER: "next_inputs" can just be the original input \
if you don't think any modifications are needed.

<< CANDIDATE PROMPTS >>
{destinations}

<< INPUT >>
{{input}}

<< OUTPUT (remember to include the ```json)>>"""

router_template = MULTI_PROMPT_ROUTER_TEMPLATE.format(
    destinations=destinations_str
)
router_prompt = PromptTemplate(
    template=router_template,
    input_variables=["input"],
    output_parser=RouterOutputParser(),
)

router_chain = LLMRouterChain.from_llm(llm, router_prompt)

chain = MultiPromptChain(router_chain=router_chain, 
                         destination_chains=destination_chains, 
                         default_chain=default_chain, verbose=True
                        )
```

```py
chain.run("What is black body radiation?")
```

```
> Entering new MultiPromptChain chain...
physics: {'input': 'What is black body radiation?'}
> Finished chain.
"Black body radiation refers to the electromagnetic radiation emitted by a perfect black body, which is an object that absorbs all radiation that falls on it and emits radiation at all wavelengths. The radiation emitted by a black body depends only on its temperature and follows a specific distribution known as Planck's law. This type of radiation is important in understanding the behavior of stars, as well as in the development of technologies such as incandescent light bulbs and infrared cameras."
```

```py
chain.run("what is 2 + 2")
```

```
> Entering new MultiPromptChain chain...
math: {'input': 'what is 2 + 2'}
> Finished chain.
'As an AI language model, I can answer this question easily. The answer to 2 + 2 is 4.'
```

```py
chain.run("Why does every cell in our body contain DNA?")
```

```
> Entering new MultiPromptChain chain...
None: {'input': 'Why does every cell in our body contain DNA?'}
> Finished chain.
'Every cell in our body contains DNA because DNA carries the genetic information that determines the characteristics and functions of each cell. DNA contains the instructions for the synthesis of proteins, which are essential for the structure and function of cells. Additionally, DNA is responsible for the transmission of genetic information from one generation to the next. Therefore, every cell in our body needs DNA to carry out its specific functions and to maintain the integrity of the organism as a whole.'
```

```py
chain.run("为什么我们身体的每个细胞都含有 DNA？")
```

```
> Entering new MultiPromptChain chain...
None: {'input': '为什么我们身体的每个细胞都含有 DNA？'}
> Finished chain.
'因为DNA是遗传信息的载体，它包含了生物体的遗传信息，控制着生物体的生长、发育、代谢和遗传特征等方面。每个细胞都需要这些信息来执行其特定的功能，因此每个细胞都需要含有DNA。此外，DNA还能够通过复制和传递，使得遗传信息得以传递给下一代细胞和生物体。'
```


```py
physics_template = """你是一位非常聪明的物理教授。\
你擅长以简明易懂的方式回答与物理相关的问题。\
当你不知道答案时，你会承认自己不知道。

以下是一个问题：
{input}"""


math_template = """你是一位非常出色的数学家。\
你擅长解答数学问题。你之所以如此出色，是因为你能够将难题分解成组成部分来回答，\
然后将它们放在一起来回答更广泛的问题。

以下是一个问题：
{input}"""

history_template = """你是一位非常出色的历史学家。\
你对来自各个历史时期的人物、事件和背景具有卓越的知识和理解力。\
你具有思考、反思、辩论、讨论和评价过去的能力。\
你尊重历史证据，并具有利用它支持你的解释和判断的能力。

以下是一个问题：
{input}"""


computerscience_template = """你是一位成功的计算机科学家。\
你对创造力、合作、前瞻性、自信、强大的解决问题能力、理论和算法的理解以及优秀的沟通技巧具有热情。\
你擅长回答编码问题。你如此出色，是因为你知道如何通过描述机器可以轻松解释的解决方案的决定步骤来解决问题，\
并且你知道如何选择具有时间复杂度和空间复杂度之间良好平衡的解决方案。 

以下是一个问题：
{input}"""

prompt_infos = [
    {
        "name": "物理", 
        "description": "适合回答物理问题。", 
        "prompt_template": physics_template
    },
    {
        "name": "数学", 
        "description": "适合回答数学问题。", 
        "prompt_template": math_template
    },
    {
        "name": "历史", 
        "description": "适合回答历史问题。", 
        "prompt_template": history_template
    },
    {
        "name": "计算机科学", 
        "description": "适合回答计算机科学问题。", 
        "prompt_template": computerscience_template
    }
]

from langchain.chains.router import MultiPromptChain
from langchain.chains.router.llm_router import LLMRouterChain,RouterOutputParser
from langchain.prompts import PromptTemplate

llm = ChatOpenAI(temperature=0)

destination_chains = {}
for p_info in prompt_infos:
    name = p_info["name"]
    prompt_template = p_info["prompt_template"]
    prompt = ChatPromptTemplate.from_template(template=prompt_template)
    chain = LLMChain(llm=llm, prompt=prompt)
    destination_chains[name] = chain  
    
destinations = [f"{p['name']}: {p['description']}" for p in prompt_infos]
destinations_str = "\n".join(destinations)

default_prompt = ChatPromptTemplate.from_template("{input}")
default_chain = LLMChain(llm=llm, prompt=default_prompt)

MULTI_PROMPT_ROUTER_TEMPLATE = """给定语言模型的原始文本输入，选择最适合输入的模型提示。\
您将获得可用提示的名称以及最适合该提示的说明。\
如果您认为修改原始输入最终会导致语言模型做出更好的响应，您也可以修改原始输入。

<< FORMATTING >>
返回带有如下格式的 JSON 对象的 Markdown 代码片段：
```json
{{{{
    "destination": 要使用的提示的名称或"DEFAULT"
    "next_inputs": 字符串原始输入的可修改版本
}}}}
```

REMEMBER："destination" 必须是下面指定的候选提示之一，或者如果输入不太适合以下任何候选提示，则可以使用"DEFAULT"。
REMEMBER：如果您认为不需要任何修改，"next_inputs" 可以只是原始输入。

<< CANDIDATE PROMPTS >>
{destinations}

<< INPUT >>
{{input}}

<< OUTPUT (remember to include the  ```json)>>"""

router_template = MULTI_PROMPT_ROUTER_TEMPLATE.format(
    destinations=destinations_str
)
router_prompt = PromptTemplate(
    template=router_template,
    input_variables=["input"],
    output_parser=RouterOutputParser(),
)

router_chain = LLMRouterChain.from_llm(llm, router_prompt)

chain = MultiPromptChain(router_chain=router_chain, 
                         destination_chains=destination_chains, 
                         default_chain=default_chain, verbose=True
                        )
```

```py
chain.run("什么是黑体辐射？")
```

```
> Entering new MultiPromptChain chain...
物理: {'input': '黑体辐射是指一个完美吸收所有辐射的物体所发出的辐射。'}
> Finished chain.
'这个问题是正确的。黑体是一个理想化的物体，它能够完全吸收所有辐射，并且以最大的效率将能量转化为辐射。因此，黑体辐射是指一个完美吸收所有辐射的物体所发出的辐射。这种辐射的特点是它的频率和温度有关，而与黑体的化学成分和形状无关。'
```

```py
chain.run("2 + 2 是多少？")
```

```
> Entering new MultiPromptChain chain...
数学: {'input': '求2+2的结果'}
> Finished chain.
'2+2的结果是4。'
```

```py
chain.run("为什么我们身体的每个细胞都含有 DNA？")
```

```
> Entering new MultiPromptChain chain...
物理: {'input': '为什么我们身体的每个细胞都含有 DNA？'}
> Finished chain.
'我们身体的每个细胞都含有 DNA，因为 DNA 是遗传信息的载体。DNA 中包含了我们的基因，这些基因决定了我们的遗传特征，如眼睛的颜色、头发的颜色等等。此外，DNA 还负责指导细胞如何生长和分裂，以及如何制造所需的蛋白质。因此，DNA 对于我们身体的正常运作至关重要，每个细胞都需要它来完成自己的任务。'
```

```py
chain.run("为什么什么李白被称呼为诗仙？")
```

```
> Entering new MultiPromptChain chain...
历史: {'input': '李白为什么被称为诗仙？'}
> Finished chain.
'李白被称为诗仙，是因为他在唐代诗歌史上的地位非常高，被誉为“诗神”、“诗仙”。他的诗歌风格豪放奔放，意境深远，表现出了他对自然、人生、爱情等方面的独特见解和感悟。他的诗歌具有极高的艺术价值和文化内涵，对后世的文学创作产生了深远的影响。因此，人们将他尊为诗仙，以表彰他在中国文学史上的卓越地位。'
```

```py
chain.run("制取氧气的步骤？")
```

```
> Entering new MultiPromptChain chain...
物理: {'input': '制取氧气的步骤是什么？'}
> Finished chain.
'制取氧气的步骤通常包括以下几个步骤：\n\n1. 通过空气分离法或电解水法获得纯氧气。\n2. 将氧气收集在一个容器中。\n3. 确保容器密封，以防氧气泄漏。\n4. 如果需要，可以将氧气压缩或冷却，以便更方便地储存或使用。\n\n需要注意的是，制取氧气需要特殊的设备和技术，因此不应该在家庭或非专业环境下进行。'
```

**上面全部使用了中文进行提示的改写，没有成功。主要问题是它只能选择这四个，提示写的可能还不是很好，没有找点 GPT 的点。**


## LangChain: Q&A over Documents（文档问答）

```py
# pip install --upgrade langchain
import os

from dotenv import load_dotenv, find_dotenv
_ = load_dotenv(find_dotenv()) # read local .env file

from langchain.chains import RetrievalQA
from langchain.chat_models import ChatOpenAI
from langchain.document_loaders import CSVLoader
from langchain.vectorstores import DocArrayInMemorySearch
from IPython.display import display, Markdown
```

```py
file = 'OutdoorClothingCatalog_1000.csv'
loader = CSVLoader(file_path=file)

#pip install docarray
from langchain.indexes import VectorstoreIndexCreator

index = VectorstoreIndexCreator(
    vectorstore_cls=DocArrayInMemorySearch
).from_loaders([loader])
```

```py
query ="Please list all your shirts with sun protection in a table in markdown and summarize each one."
response = index.query(query)
display(Markdown(response))
```

| Name | Description |
| --- | --- |
| Men's Tropical Plaid Short-Sleeve Shirt | UPF 50+ rated, 100% polyester, wrinkle-resistant, front and back cape venting, two front bellows pockets |
| Men's Plaid Tropic Shirt, Short-Sleeve | UPF 50+ rated, 52% polyester and 48% nylon, machine washable and dryable, front and back cape venting, two front bellows pockets |
| Men's TropicVibe Shirt, Short-Sleeve | UPF 50+ rated, 71% Nylon, 29% Polyester, 100% Polyester knit mesh, machine wash and dry, front and back cape venting, two front bellows pockets |
| Sun Shield Shirt by | UPF 50+ rated, 78% nylon, 22% Lycra Xtra Life fiber, handwash, line dry, wicks moisture, fits comfortably over swimsuit, abrasion resistant |

All four shirts provide UPF 50+ sun protection, blocking 98% of the sun's harmful rays. The Men's Tropical Plaid Short-Sleeve Shirt is made of 100% polyester and is wrinkle-resistant

```py
```

```
```

```py
```

```
```

```py
```

```
```

```py
```

```
```

## LangChain: Evaluation（评估）

### Create our QandA application（创建您的问答应用程序）
```py
import os

from dotenv import load_dotenv, find_dotenv
_ = load_dotenv(find_dotenv()) # read local .env file

from langchain.chains import RetrievalQA
from langchain.chat_models import ChatOpenAI
from langchain.document_loaders import CSVLoader
from langchain.indexes import VectorstoreIndexCreator
from langchain.vectorstores import DocArrayInMemorySearch

file = 'OutdoorClothingCatalog_1000.csv'
loader = CSVLoader(file_path=file)
data = loader.load()

index = VectorstoreIndexCreator(
    vectorstore_cls=DocArrayInMemorySearch
).from_loaders([loader])

llm = ChatOpenAI(temperature = 0.0)
qa = RetrievalQA.from_chain_type(
    llm=llm, 
    chain_type="stuff", 
    retriever=index.vectorstore.as_retriever(), 
    verbose=True,
    chain_type_kwargs = {
        "document_separator": "<<<<>>>>>"
    }
)
```

#### Coming up with test datapoints（提出测试数据点）

```py
data[10]
```

```
Document(page_content=": 10\nname: Cozy Comfort Pullover Set, Stripe\ndescription: Perfect for lounging, this striped knit set lives up to its name. We used ultrasoft fabric and an easy design that's as comfortable at bedtime as it is when we have to make a quick run out.\n\nSize & Fit\n- Pants are Favorite Fit: Sits lower on the waist.\n- Relaxed Fit: Our most generous fit sits farthest from the body.\n\nFabric & Care\n- In the softest blend of 63% polyester, 35% rayon and 2% spandex.\n\nAdditional Features\n- Relaxed fit top with raglan sleeves and rounded hem.\n- Pull-on pants have a wide elastic waistband and drawstring, side pockets and a modern slim leg.\n\nImported.", metadata={'source': 'OutdoorClothingCatalog_1000.csv', 'row': 10})
```

```py
data[11]
```

```
Document(page_content=': 11\nname: Ultra-Lofty 850 Stretch Down Hooded Jacket\ndescription: This technical stretch down jacket from our DownTek collection is sure to keep you warm and comfortable with its full-stretch construction providing exceptional range of motion. With a slightly fitted style that falls at the hip and best with a midweight layer, this jacket is suitable for light activity up to 20° and moderate activity up to -30°. The soft and durable 100% polyester shell offers complete windproof protection and is insulated with warm, lofty goose down. Other features include welded baffles for a no-stitch construction and excellent stretch, an adjustable hood, an interior media port and mesh stash pocket and a hem drawcord. Machine wash and dry. Imported.', metadata={'source': 'OutdoorClothingCatalog_1000.csv', 'row': 11})
```

#### Hard-coded examples（硬编码示例）

```py
examples = [
    {
        "query": "Do the Cozy Comfort Pullover Set have side pockets?",
        "answer": "Yes"
    },
    {
        "query": "What collection is the Ultra-Lofty 850 Stretch Down Hooded Jacket from?",
        "answer": "The DownTek collection"
    }
]
```

#### LLM-Generated examples（LLM 生成的例子）

```py
from langchain.evaluation.qa import QAGenerateChain

example_gen_chain = QAGenerateChain.from_llm(ChatOpenAI())
new_examples = example_gen_chain.apply_and_parse(
    [{"doc": t} for t in data[:5]]
)

print(new_examples[0])
print(data[0].page_content)
```

```
{'query': "What is the weight of the Women's Campside Oxfords?", 'answer': "The approximate weight of the Women's Campside Oxfords is 1 lb.1 oz. per pair."}
: 0
name: Women's Campside Oxfords
description: This ultracomfortable lace-to-toe Oxford boasts a super-soft canvas, thick cushioning, and quality construction for a broken-in feel from the first time you put them on. 

Size & Fit: Order regular shoe size. For half sizes not offered, order up to next whole size. 

Specs: Approx. weight: 1 lb.1 oz. per pair. 

Construction: Soft canvas material for a broken-in feel and look. Comfortable EVA innersole with Cleansport NXT® antimicrobial odor control. Vintage hunt, fish and camping motif on innersole. Moderate arch contour of innersole. EVA foam midsole for cushioning and support. Chain-tread-inspired molded rubber outsole with modified chain-tread pattern. Imported. 

Questions? Please contact us for any inquiries.
```

```
{'query': "女士 Campside 牛津鞋的重量是多少？", 'answer': "女士 Campside 牛津鞋的重量约为 1 磅 1 盎司每双。"}
: 0
名称：女式 Campside 牛津鞋
描述：这款超舒适的全系带牛津鞋采用超柔软的帆布、厚实的缓冲垫和优质结构，让您在第一次穿上时就有一种磨合感。

尺码和版型：订购常规鞋码。 对于未提供的半码，请订购大一码。

规格：约。 重量：1 磅 1 盎司。 每对。

构造：柔软的帆布材料，打造经久耐用的感觉和外观。 舒适的 EVA 内底，带有 Cleansport NXT 抗菌气味控制。 鞋垫上的复古狩猎、鱼类和露营图案。 鞋垫适中的拱形轮廓。 EVA 泡沫中底提供缓冲和支撑。 受链胎面启发的模压橡胶外底，带有改进的链胎面图案。 进口。

问题？ 如有任何疑问，请联系我们。
```

#### Combine examples（结合例子）

```py
examples += new_examples
qa.run(examples[0]["query"])
```

```
> Entering new RetrievalQA chain...

> Finished chain.
'The Cozy Comfort Pullover Set, Stripe has side pockets on the pull-on pants.'
```

### Manual Evaluation（人工评估）

```py
import langchain
langchain.debug = True
```

```py
qa.run(examples[0]["query"])
```

```
[chain/start] [1:chain:RetrievalQA] Entering Chain run with input:
{
  "query": "Do the Cozy Comfort Pullover Set        have side pockets?"
}
[chain/start] [1:chain:RetrievalQA > 2:chain:StuffDocumentsChain] Entering Chain run with input:
[inputs]
[chain/start] [1:chain:RetrievalQA > 2:chain:StuffDocumentsChain > 3:chain:LLMChain] Entering Chain run with input:
{
  "question": "Do the Cozy Comfort Pullover Set        have side pockets?",
  "context": ": 10\nname: Cozy Comfort Pullover Set, Stripe\ndescription: Perfect for lounging, this striped knit set lives up to its name. We used ultrasoft fabric and an easy design that's as comfortable at bedtime as it is when we have to make a quick run out.\n\nSize & Fit\n- Pants are Favorite Fit: Sits lower on the waist.\n- Relaxed Fit: Our most generous fit sits farthest from the body.\n\nFabric & Care\n- In the softest blend of 63% polyester, 35% rayon and 2% spandex.\n\nAdditional Features\n- Relaxed fit top with raglan sleeves and rounded hem.\n- Pull-on pants have a wide elastic waistband and drawstring, side pockets and a modern slim leg.\n\nImported.<<<<>>>>>: 73\nname: Cozy Cuddles Knit Pullover Set\ndescription: Perfect for lounging, this knit set lives up to its name. We used ultrasoft fabric and an easy design that's as comfortable at bedtime as it is when we have to make a quick run out. \n\nSize & Fit \nPants are Favorite Fit: Sits lower on the waist. \nRelaxed Fit: Our most generous fit sits farthest from the body. \n\nFabric & Care \nIn the softest blend of 63% polyester, 35% rayon and 2% spandex.\n\nAdditional Features \nRelaxed fit top with raglan sleeves and rounded hem. \nPull-on pants have a wide elastic waistband and drawstring, side pockets and a modern slim leg. \nImported.<<<<>>>>>: 632\nname: Cozy Comfort Fleece Pullover\ndescription: The ultimate sweater fleece \u2013 made from superior fabric and offered at an unbeatable price. \n\nSize & Fit\nSlightly Fitted: Softly shapes the body. Falls at hip. \n\nWhy We Love It\nOur customers (and employees) love the rugged construction and heritage-inspired styling of our popular Sweater Fleece Pullover and wear it for absolutely everything. From high-intensity activities to everyday tasks, you'll find yourself reaching for it every time.\n\nFabric & Care\nRugged sweater-knit exterior and soft brushed interior for exceptional warmth and comfort. Made from soft, 100% polyester. Machine wash and dry.\n\nAdditional Features\nFeatures our classic Mount Katahdin logo. Snap placket. Front princess seams create a feminine shape. Kangaroo handwarmer pockets. Cuffs and hem reinforced with jersey binding. Imported.\n\n \u2013 Official Supplier to the U.S. Ski Team\nTHEIR WILL TO WIN, WOVEN RIGHT IN. LEARN MORE<<<<>>>>>: 151\nname: Cozy Quilted Sweatshirt\ndescription: Our sweatshirt is an instant classic with its great quilted texture and versatile weight that easily transitions between seasons. With a traditional fit that is relaxed through the chest, sleeve, and waist, this pullover is lightweight enough to be worn most months of the year. The cotton blend fabric is super soft and comfortable, making it the perfect casual layer. To make dressing easy, this sweatshirt also features a snap placket and a heritage-inspired Mt. Katahdin logo patch. For care, machine wash and dry. Imported."
}
[llm/start] [1:chain:RetrievalQA > 2:chain:StuffDocumentsChain > 3:chain:LLMChain > 4:llm:ChatOpenAI] Entering LLM run with input:
{
  "prompts": [
    "System: Use the following pieces of context to answer the users question. \nIf you don't know the answer, just say that you don't know, don't try to make up an answer.\n----------------\n: 10\nname: Cozy Comfort Pullover Set, Stripe\ndescription: Perfect for lounging, this striped knit set lives up to its name. We used ultrasoft fabric and an easy design that's as comfortable at bedtime as it is when we have to make a quick run out.\n\nSize & Fit\n- Pants are Favorite Fit: Sits lower on the waist.\n- Relaxed Fit: Our most generous fit sits farthest from the body.\n\nFabric & Care\n- In the softest blend of 63% polyester, 35% rayon and 2% spandex.\n\nAdditional Features\n- Relaxed fit top with raglan sleeves and rounded hem.\n- Pull-on pants have a wide elastic waistband and drawstring, side pockets and a modern slim leg.\n\nImported.<<<<>>>>>: 73\nname: Cozy Cuddles Knit Pullover Set\ndescription: Perfect for lounging, this knit set lives up to its name. We used ultrasoft fabric and an easy design that's as comfortable at bedtime as it is when we have to make a quick run out. \n\nSize & Fit \nPants are Favorite Fit: Sits lower on the waist. \nRelaxed Fit: Our most generous fit sits farthest from the body. \n\nFabric & Care \nIn the softest blend of 63% polyester, 35% rayon and 2% spandex.\n\nAdditional Features \nRelaxed fit top with raglan sleeves and rounded hem. \nPull-on pants have a wide elastic waistband and drawstring, side pockets and a modern slim leg. \nImported.<<<<>>>>>: 632\nname: Cozy Comfort Fleece Pullover\ndescription: The ultimate sweater fleece \u2013 made from superior fabric and offered at an unbeatable price. \n\nSize & Fit\nSlightly Fitted: Softly shapes the body. Falls at hip. \n\nWhy We Love It\nOur customers (and employees) love the rugged construction and heritage-inspired styling of our popular Sweater Fleece Pullover and wear it for absolutely everything. From high-intensity activities to everyday tasks, you'll find yourself reaching for it every time.\n\nFabric & Care\nRugged sweater-knit exterior and soft brushed interior for exceptional warmth and comfort. Made from soft, 100% polyester. Machine wash and dry.\n\nAdditional Features\nFeatures our classic Mount Katahdin logo. Snap placket. Front princess seams create a feminine shape. Kangaroo handwarmer pockets. Cuffs and hem reinforced with jersey binding. Imported.\n\n \u2013 Official Supplier to the U.S. Ski Team\nTHEIR WILL TO WIN, WOVEN RIGHT IN. LEARN MORE<<<<>>>>>: 151\nname: Cozy Quilted Sweatshirt\ndescription: Our sweatshirt is an instant classic with its great quilted texture and versatile weight that easily transitions between seasons. With a traditional fit that is relaxed through the chest, sleeve, and waist, this pullover is lightweight enough to be worn most months of the year. The cotton blend fabric is super soft and comfortable, making it the perfect casual layer. To make dressing easy, this sweatshirt also features a snap placket and a heritage-inspired Mt. Katahdin logo patch. For care, machine wash and dry. Imported.\nHuman: Do the Cozy Comfort Pullover Set        have side pockets?"
  ]
}
[llm/end] [1:chain:RetrievalQA > 2:chain:StuffDocumentsChain > 3:chain:LLMChain > 4:llm:ChatOpenAI] [1.03s] Exiting LLM run with output:
{
  "generations": [
    [
      {
        "text": "The Cozy Comfort Pullover Set, Stripe has side pockets.",
        "generation_info": null,
        "message": {
          "content": "The Cozy Comfort Pullover Set, Stripe has side pockets.",
          "additional_kwargs": {},
          "example": false
        }
      }
    ]
  ],
  "llm_output": {
    "token_usage": {
      "prompt_tokens": 734,
      "completion_tokens": 13,
      "total_tokens": 747
    },
    "model_name": "gpt-3.5-turbo"
  }
}
[chain/end] [1:chain:RetrievalQA > 2:chain:StuffDocumentsChain > 3:chain:LLMChain] [1.03s] Exiting Chain run with output:
{
  "text": "The Cozy Comfort Pullover Set, Stripe has side pockets."
}
[chain/end] [1:chain:RetrievalQA > 2:chain:StuffDocumentsChain] [1.03s] Exiting Chain run with output:
{
  "output_text": "The Cozy Comfort Pullover Set, Stripe has side pockets."
}
[chain/end] [1:chain:RetrievalQA] [1.41s] Exiting Chain run with output:
{
  "result": "The Cozy Comfort Pullover Set, Stripe has side pockets."
}
'The Cozy Comfort Pullover Set, Stripe has side pockets.'
```

```py
# Turn off the debug mode
langchain.debug = False
```

### LLM assisted evaluation（LLM 辅助评估）

```py
predictions = qa.apply(examples)

from langchain.evaluation.qa import QAEvalChain

llm = ChatOpenAI(temperature=0)
eval_chain = QAEvalChain.from_llm(llm)

graded_outputs = eval_chain.evaluate(examples, predictions)

for i, eg in enumerate(examples):
    print(f"Example {i}:")
    print("Question: " + predictions[i]['query'])
    print("Real Answer: " + predictions[i]['answer'])
    print("Predicted Answer: " + predictions[i]['result'])
    print("Predicted Grade: " + graded_outputs[i]['text'])
    print()
```

```
Example 0:
Question: Do the Cozy Comfort Pullover Set        have side pockets?
Real Answer: Yes
Predicted Answer: The Cozy Comfort Pullover Set, Stripe has side pockets on the pull-on pants.
Predicted Grade: CORRECT

Example 1:
Question: What collection is the Ultra-Lofty         850 Stretch Down Hooded Jacket from?
Real Answer: The DownTek collection
Predicted Answer: The Ultra-Lofty 850 Stretch Down Hooded Jacket is from the DownTek collection.
Predicted Grade: CORRECT

Example 2:
Question: What is the weight per pair of the Women's Campside Oxfords?
Real Answer: The Women's Campside Oxfords have an approximate weight of 1 lb. 1 oz. per pair.
Predicted Answer: The weight per pair of the Women's Campside Oxfords is approximately 1 lb. 1 oz.
Predicted Grade: CORRECT

Example 3:
Question: What are the dimensions of the small and medium Recycled Waterhog dog mats?
Real Answer: The small mat has dimensions of 18" x 28" and the medium mat has dimensions of 22.5" x 34.5".
Predicted Answer: The small Recycled Waterhog dog mat has dimensions of 18" x 28" and the medium size has dimensions of 22.5" x 34.5".
Predicted Grade: CORRECT

Example 4:
Question: What are the features of the Infant and Toddler Girls' Coastal Chill Swimsuit, Two-Piece?
Real Answer: The Infant and Toddler Girls' Coastal Chill Swimsuit, Two-Piece has exclusive whimsical prints, bright colors, ruffles, four-way-stretch and chlorine-resistant fabric, UPF 50+ rated fabric for sun protection, crossover no-slip straps, fully lined bottom, and can be machine washed and line dried for best results.
Predicted Answer: The Infant and Toddler Girls' Coastal Chill Swimsuit, Two-Piece features bright colors, ruffles, and exclusive whimsical prints. The four-way-stretch and chlorine-resistant fabric keeps its shape and resists snags. The UPF 50+ rated fabric provides the highest rated sun protection possible, blocking 98% of the sun's harmful rays. The crossover no-slip straps and fully lined bottom ensure a secure fit and maximum coverage. It is machine washable and should be line dried for best results. It is imported.
Predicted Grade: CORRECT

Example 5:
Question: What is the fabric composition of the Refresh Swimwear V-Neck Tankini Contrasts?
Real Answer: The Refresh Swimwear V-Neck Tankini Contrasts is made of 82% recycled nylon with 18% Lycra® spandex for the body and 90% recycled nylon with 10% Lycra® spandex for the lining.
Predicted Answer: The Refresh Swimwear V-Neck Tankini Contrasts is made of 82% recycled nylon with 18% Lycra® spandex for the body and 90% recycled nylon with 10% Lycra® spandex for the lining.
Predicted Grade: CORRECT

Example 6:
Question: What is the main feature of the EcoFlex 3L Storm Pants?
Real Answer: The main feature of the EcoFlex 3L Storm Pants is the state-of-the-art TEK O2 technology that offers the most breathability ever tested.
Predicted Answer: The main feature of the EcoFlex 3L Storm Pants is the state-of-the-art TEK O2 technology that offers the most breathability ever tested, making them great for a variety of outdoor activities year-round.
Predicted Grade: CORRECT
```

## LangChain: Agents（代理）

```py
import os

from dotenv import load_dotenv, find_dotenv
_ = load_dotenv(find_dotenv()) # read local .env file

import warnings
warnings.filterwarnings("ignore")
```

### Built-in LangChain tools（内置 LangChain 工具）

```py
#!pip install -U wikipedia

from langchain.agents.agent_toolkits import create_python_agent
from langchain.agents import load_tools, initialize_agent
from langchain.agents import AgentType
from langchain.tools.python.tool import PythonREPLTool
from langchain.python import PythonREPL
from langchain.chat_models import ChatOpenAI

llm = ChatOpenAI(temperature=0) # 为了稳定，减少随机性。
tools = load_tools(["llm-math","wikipedia"], llm=llm)
agent= initialize_agent(
    tools, 
    llm, 
    agent=AgentType.CHAT_ZERO_SHOT_REACT_DESCRIPTION,
    handle_parsing_errors=True,
    verbose = True)
```

```py
agent("What is the 25% of 300?")
```

```
> Entering new AgentExecutor chain...
Thought: We need to calculate 25% of 300, which means we need to multiply 300 by 0.25.

Action:
```
{
  "action": "Calculator",
  "action_input": "300*0.25"
}
```


Observation: Answer: 75.0
Thought:The calculator tool returned the answer 75.0, which is 25% of 300.

Final Answer: 25% of 300 is 75.0.

> Finished chain.
{'input': 'What is the 25% of 300?', 'output': '25% of 300 is 75.0.'}
```

```py
agent("300的25%是多少？")
```

```
> Entering new AgentExecutor chain...
Question: 300的25%是多少？
Thought: We can use a calculator to solve this problem.
Action:
```
{
  "action": "Calculator",
  "action_input": "300*0.25"
}
```

Observation: Answer: 75.0
Thought:
Observation: Invalid or incomplete response
Thought:I need to fix the output format to properly display the answer.
Action:
```
{
  "action": "Calculator",
  "action_input": "300*0.25"
}
```


Observation: Answer: 75.0
Thought:The answer is correct and I can provide it as the final answer.
Final Answer: 75.0

> Finished chain.
{'input': '300的25%是多少？', 'output': '75.0'}
```

这个中文问题中间出现了一些不正确的响应格式，虽然最终答案还是正确的。下面修改了一下就没有问题了，其实就是在数字的两边加上空格。

```py
agent("300 的 25% 是多少？")
```

```
> Entering new AgentExecutor chain...
Thought: We can use the calculator tool to solve this problem.

Action:
```
{
  "action": "Calculator",
  "action_input": "300*0.25"
}
```


Observation: Answer: 75.0
Thought:We have the answer to the question.

Final Answer: 75.0

> Finished chain.
{'input': '300 的 25% 是多少？', 'output': '75.0'}
```

```py
question = "Tom M. Mitchell is an American computer scientist \
and the Founders University Professor at Carnegie Mellon University (CMU)\
what book did he write?"
result = agent(question) 
```

```
> Entering new AgentExecutor chain...
Thought: I should use Wikipedia to find the answer to this question.

Action:
```
{
  "action": "Wikipedia",
  "action_input": "Tom M. Mitchell"
}
```


Observation: Page: Tom M. Mitchell
Summary: Tom Michael Mitchell (born August 9, 1951) is an American computer scientist and the Founders University Professor at Carnegie Mellon University (CMU). He is a founder and former Chair of the Machine Learning Department at CMU. Mitchell is known for his contributions to the advancement of machine learning, artificial intelligence, and cognitive neuroscience and is the author of the textbook Machine Learning. He is a member of the United States National Academy of Engineering since 2010. He is also a Fellow of the American Academy of Arts and Sciences, the American Association for the Advancement of Science and a Fellow and past President of the Association for the Advancement of Artificial Intelligence. In October 2018, Mitchell was appointed as the Interim Dean of the School of Computer Science at Carnegie Mellon.

Page: Tom Mitchell (Australian footballer)
Summary: Thomas Mitchell (born 31 May 1993) is a professional Australian rules footballer playing for the Collingwood Football Club in the Australian Football League (AFL). He previously played for the Sydney Swans from 2012 to 2016, and the Hawthorn Football Club between 2017 and 2022. Mitchell won the Brownlow Medal as the league's best and fairest player in 2018 and set the record for the most disposals in a VFL/AFL match, accruing 54 in a game against Collingwood during that season.
Thought:The book that Tom M. Mitchell wrote is "Machine Learning".

Action:
```
{
  "action": "Wikipedia",
  "action_input": "Machine Learning (book)"
}
```


Observation: Page: Machine learning
Summary: Machine learning (ML) is a field devoted to understanding and building methods that let machines "learn" – that is, methods that leverage data to improve computer performance on some set of tasks.Machine learning algorithms build a model based on sample data, known as training data, in order to make predictions or decisions without being explicitly programmed to do so. Machine learning algorithms are used in a wide variety of applications, such as in medicine, email filtering, speech recognition, agriculture, and computer vision, where it is difficult or unfeasible to develop conventional algorithms to perform the needed tasks.A subset of machine learning is closely related to computational statistics, which focuses on making predictions using computers, but not all machine learning is statistical learning. The study of mathematical optimization delivers methods, theory and application domains to the field of machine learning. Data mining is a related field of study, focusing on exploratory data analysis through unsupervised learning.Some implementations of machine learning use data and neural networks in a way that mimics the working of a biological brain.In its application across business problems, machine learning is also referred to as predictive analytics.

Page: Timeline of machine learning
Summary: This page is a timeline of machine learning. Major discoveries, achievements, milestones and other major events in machine learning are included.

Page: Quantum machine learning
Summary: Quantum machine learning is the integration of quantum algorithms within machine learning programs. The most common use of the term refers to machine learning algorithms for the analysis of classical data executed on a quantum computer, i.e. quantum-enhanced machine learning. While machine learning algorithms are used to compute immense quantities of data, quantum machine learning utilizes qubits and quantum operations or specialized quantum systems to improve computational speed and data storage done by algorithms in a program. This includes hybrid methods that involve both classical and quantum processing, where computationally difficult subroutines are outsourced to a quantum device. These routines can be more complex in nature and executed faster on a quantum computer. Furthermore, quantum algorithms can be used to analyze quantum states instead of classical data. Beyond quantum computing, the term "quantum machine learning" is also associated with classical machine learning methods applied to data generated from quantum experiments (i.e. machine learning of quantum systems), such as learning the phase transitions of a quantum system or creating new quantum experiments. Quantum machine learning also extends to a branch of research that explores methodological and structural similarities between certain physical systems and learning systems, in particular neural networks. For example, some mathematical and numerical techniques from quantum physics are applicable to classical deep learning and vice versa. Furthermore, researchers investigate more abstract notions of learning theory with respect to quantum information, sometimes referred to as "quantum learning theory".
Thought:Tom M. Mitchell wrote the book "Machine Learning".

Final Answer: Machine Learning.

> Finished chain.
```

```py
question = "Tom M. Mitchell 是美国计算机科学家和卡内基梅隆大学 (CMU) 创始人大学教授，他写了什么书？"
result = agent(question)
```

```
> Entering new AgentExecutor chain...
Thought: I should use the Wikipedia tool to search for information about Tom M. Mitchell and his books.

Action:
```
{
  "action": "Wikipedia",
  "action_input": "Tom M. Mitchell"
}
```


Observation: Page: Tom M. Mitchell
Summary: Tom Michael Mitchell (born August 9, 1951) is an American computer scientist and the Founders University Professor at Carnegie Mellon University (CMU). He is a founder and former Chair of the Machine Learning Department at CMU. Mitchell is known for his contributions to the advancement of machine learning, artificial intelligence, and cognitive neuroscience and is the author of the textbook Machine Learning. He is a member of the United States National Academy of Engineering since 2010. He is also a Fellow of the American Academy of Arts and Sciences, the American Association for the Advancement of Science and a Fellow and past President of the Association for the Advancement of Artificial Intelligence. In October 2018, Mitchell was appointed as the Interim Dean of the School of Computer Science at Carnegie Mellon.

Page: Tom Mitchell (Australian footballer)
Summary: Thomas Mitchell (born 31 May 1993) is a professional Australian rules footballer playing for the Collingwood Football Club in the Australian Football League (AFL). He previously played for the Sydney Swans from 2012 to 2016, and the Hawthorn Football Club between 2017 and 2022. Mitchell won the Brownlow Medal as the league's best and fairest player in 2018 and set the record for the most disposals in a VFL/AFL match, accruing 54 in a game against Collingwood during that season.
Thought:According to the Wikipedia page, Tom M. Mitchell is the author of the textbook "Machine Learning".

Final Answer: Tom M. Mitchell wrote the book "Machine Learning".

> Finished chain.
```

### Python Agent

```py
agent = create_python_agent(
    llm,
    tool=PythonREPLTool(),
    verbose=True
)

customer_list = [["Harrison", "Chase"], 
                 ["Lang", "Chain"],
                 ["Dolly", "Too"],
                 ["Elle", "Elem"], 
                 ["Geoff","Fusion"], 
                 ["Trance","Former"],
                 ["Jen","Ayai"]
                ]

agent.run(f"""Sort these customers by \
last name and then first name \
and print the output: {customer_list}""") 
```

```
> Entering new AgentExecutor chain...
I can use the sorted() function to sort the list of customers by last name and then first name. I will need to provide a key function to sorted() that returns a tuple of the last name and first name in that order.
Action: Python REPL
Action Input:
```
customers = [['Harrison', 'Chase'], ['Lang', 'Chain'], ['Dolly', 'Too'], ['Elle', 'Elem'], ['Geoff', 'Fusion'], ['Trance', 'Former'], ['Jen', 'Ayai']]
sorted_customers = sorted(customers, key=lambda x: (x[1], x[0]))
for customer in sorted_customers:
    print(customer)
```
Observation: ['Jen', 'Ayai']
['Lang', 'Chain']
['Harrison', 'Chase']
['Elle', 'Elem']
['Trance', 'Former']
['Geoff', 'Fusion']
['Dolly', 'Too']

Thought:The customers are now sorted by last name and then first name. 
Final Answer: [['Jen', 'Ayai'], ['Lang', 'Chain'], ['Harrison', 'Chase'], ['Elle', 'Elem'], ['Trance', 'Former'], ['Geoff', 'Fusion'], ['Dolly', 'Too']]

> Finished chain.
"[['Jen', 'Ayai'], ['Lang', 'Chain'], ['Harrison', 'Chase'], ['Elle', 'Elem'], ['Trance', 'Former'], ['Geoff', 'Fusion'], ['Dolly', 'Too']]"
```

```py
agent.run(f"""按名字和姓氏对这些客户进行排序并打印输出：{customer_list}""") 
```

```
> Entering new AgentExecutor chain...
I can use the sorted() function to sort the list of names based on the first and last name. I will need to provide a key function to sorted() that returns a tuple of the first and last name in the correct order.
Action: Python REPL
Action Input: sorted([['Harrison', 'Chase'], ['Lang', 'Chain'], ['Dolly', 'Too'], ['Elle', 'Elem'], ['Geoff', 'Fusion'], ['Trance', 'Former'], ['Jen', 'Ayai']], key=lambda x: (x[1], x[0]))
Observation: 
Thought:The list of names is now sorted in the correct order based on last name and then first name.
Action: Python REPL
Action Input: print(sorted([['Harrison', 'Chase'], ['Lang', 'Chain'], ['Dolly', 'Too'], ['Elle', 'Elem'], ['Geoff', 'Fusion'], ['Trance', 'Former'], ['Jen', 'Ayai']], key=lambda x: (x[1], x[0])))
Observation: [['Jen', 'Ayai'], ['Lang', 'Chain'], ['Harrison', 'Chase'], ['Elle', 'Elem'], ['Trance', 'Former'], ['Geoff', 'Fusion'], ['Dolly', 'Too']]

Thought:The list of names is now sorted in the correct order based on last name and then first name.
Final Answer: [['Jen', 'Ayai'], ['Lang', 'Chain'], ['Harrison', 'Chase'], ['Elle', 'Elem'], ['Trance', 'Former'], ['Geoff', 'Fusion'], ['Dolly', 'Too']]

> Finished chain.
"[['Jen', 'Ayai'], ['Lang', 'Chain'], ['Harrison', 'Chase'], ['Elle', 'Elem'], ['Trance', 'Former'], ['Geoff', 'Fusion'], ['Dolly', 'Too']]"
```

#### View detailed outputs of the chains

```py
import langchain
langchain.debug=True
agent.run(f"""Sort these customers by \
last name and then first name \
and print the output: {customer_list}""") 
langchain.debug=False
```

```
[chain/start] [1:chain:AgentExecutor] Entering Chain run with input:
{
  "input": "Sort these customers by last name and then first name and print the output: [['Harrison', 'Chase'], ['Lang', 'Chain'], ['Dolly', 'Too'], ['Elle', 'Elem'], ['Geoff', 'Fusion'], ['Trance', 'Former'], ['Jen', 'Ayai']]"
}
[chain/start] [1:chain:AgentExecutor > 2:chain:LLMChain] Entering Chain run with input:
{
  "input": "Sort these customers by last name and then first name and print the output: [['Harrison', 'Chase'], ['Lang', 'Chain'], ['Dolly', 'Too'], ['Elle', 'Elem'], ['Geoff', 'Fusion'], ['Trance', 'Former'], ['Jen', 'Ayai']]",
  "agent_scratchpad": "",
  "stop": [
    "\nObservation:",
    "\n\tObservation:"
  ]
}
[llm/start] [1:chain:AgentExecutor > 2:chain:LLMChain > 3:llm:ChatOpenAI] Entering LLM run with input:
{
  "prompts": [
    "Human: You are an agent designed to write and execute python code to answer questions.\nYou have access to a python REPL, which you can use to execute python code.\nIf you get an error, debug your code and try again.\nOnly use the output of your code to answer the question. \nYou might know the answer without running any code, but you should still run the code to get the answer.\nIf it does not seem like you can write code to answer the question, just return \"I don't know\" as the answer.\n\n\nPython REPL: A Python shell. Use this to execute python commands. Input should be a valid python command. If you want to see the output of a value, you should print it out with `print(...)`.\n\nUse the following format:\n\nQuestion: the input question you must answer\nThought: you should always think about what to do\nAction: the action to take, should be one of [Python REPL]\nAction Input: the input to the action\nObservation: the result of the action\n... (this Thought/Action/Action Input/Observation can repeat N times)\nThought: I now know the final answer\nFinal Answer: the final answer to the original input question\n\nBegin!\n\nQuestion: Sort these customers by last name and then first name and print the output: [['Harrison', 'Chase'], ['Lang', 'Chain'], ['Dolly', 'Too'], ['Elle', 'Elem'], ['Geoff', 'Fusion'], ['Trance', 'Former'], ['Jen', 'Ayai']]\nThought:"
  ]
}
[llm/end] [1:chain:AgentExecutor > 2:chain:LLMChain > 3:llm:ChatOpenAI] [6.52s] Exiting LLM run with output:
{
  "generations": [
    [
      {
        "text": "I can use the sorted() function to sort the list of customers by last name and then first name. I will need to provide a key function to sorted() that returns a tuple of the last name and first name in that order.\nAction: Python REPL\nAction Input:\n```\ncustomers = [['Harrison', 'Chase'], ['Lang', 'Chain'], ['Dolly', 'Too'], ['Elle', 'Elem'], ['Geoff', 'Fusion'], ['Trance', 'Former'], ['Jen', 'Ayai']]\nsorted_customers = sorted(customers, key=lambda x: (x[1], x[0]))\nfor customer in sorted_customers:\n    print(customer)\n```",
        "generation_info": null,
        "message": {
          "content": "I can use the sorted() function to sort the list of customers by last name and then first name. I will need to provide a key function to sorted() that returns a tuple of the last name and first name in that order.\nAction: Python REPL\nAction Input:\n```\ncustomers = [['Harrison', 'Chase'], ['Lang', 'Chain'], ['Dolly', 'Too'], ['Elle', 'Elem'], ['Geoff', 'Fusion'], ['Trance', 'Former'], ['Jen', 'Ayai']]\nsorted_customers = sorted(customers, key=lambda x: (x[1], x[0]))\nfor customer in sorted_customers:\n    print(customer)\n```",
          "additional_kwargs": {},
          "example": false
        }
      }
    ]
  ],
  "llm_output": {
    "token_usage": {
      "prompt_tokens": 327,
      "completion_tokens": 144,
      "total_tokens": 471
    },
    "model_name": "gpt-3.5-turbo"
  }
}
[chain/end] [1:chain:AgentExecutor > 2:chain:LLMChain] [6.53s] Exiting Chain run with output:
{
  "text": "I can use the sorted() function to sort the list of customers by last name and then first name. I will need to provide a key function to sorted() that returns a tuple of the last name and first name in that order.\nAction: Python REPL\nAction Input:\n```\ncustomers = [['Harrison', 'Chase'], ['Lang', 'Chain'], ['Dolly', 'Too'], ['Elle', 'Elem'], ['Geoff', 'Fusion'], ['Trance', 'Former'], ['Jen', 'Ayai']]\nsorted_customers = sorted(customers, key=lambda x: (x[1], x[0]))\nfor customer in sorted_customers:\n    print(customer)\n```"
}
[tool/start] [1:chain:AgentExecutor > 4:tool:Python REPL] Entering Tool run with input:
"```
customers = [['Harrison', 'Chase'], ['Lang', 'Chain'], ['Dolly', 'Too'], ['Elle', 'Elem'], ['Geoff', 'Fusion'], ['Trance', 'Former'], ['Jen', 'Ayai']]
sorted_customers = sorted(customers, key=lambda x: (x[1], x[0]))
for customer in sorted_customers:
    print(customer)
```"
[tool/end] [1:chain:AgentExecutor > 4:tool:Python REPL] [0.504ms] Exiting Tool run with output:
"['Jen', 'Ayai']
['Lang', 'Chain']
['Harrison', 'Chase']
['Elle', 'Elem']
['Trance', 'Former']
['Geoff', 'Fusion']
['Dolly', 'Too']"
[chain/start] [1:chain:AgentExecutor > 5:chain:LLMChain] Entering Chain run with input:
{
  "input": "Sort these customers by last name and then first name and print the output: [['Harrison', 'Chase'], ['Lang', 'Chain'], ['Dolly', 'Too'], ['Elle', 'Elem'], ['Geoff', 'Fusion'], ['Trance', 'Former'], ['Jen', 'Ayai']]",
  "agent_scratchpad": "I can use the sorted() function to sort the list of customers by last name and then first name. I will need to provide a key function to sorted() that returns a tuple of the last name and first name in that order.\nAction: Python REPL\nAction Input:\n```\ncustomers = [['Harrison', 'Chase'], ['Lang', 'Chain'], ['Dolly', 'Too'], ['Elle', 'Elem'], ['Geoff', 'Fusion'], ['Trance', 'Former'], ['Jen', 'Ayai']]\nsorted_customers = sorted(customers, key=lambda x: (x[1], x[0]))\nfor customer in sorted_customers:\n    print(customer)\n```\nObservation: ['Jen', 'Ayai']\n['Lang', 'Chain']\n['Harrison', 'Chase']\n['Elle', 'Elem']\n['Trance', 'Former']\n['Geoff', 'Fusion']\n['Dolly', 'Too']\n\nThought:",
  "stop": [
    "\nObservation:",
    "\n\tObservation:"
  ]
}
[llm/start] [1:chain:AgentExecutor > 5:chain:LLMChain > 6:llm:ChatOpenAI] Entering LLM run with input:
{
  "prompts": [
    "Human: You are an agent designed to write and execute python code to answer questions.\nYou have access to a python REPL, which you can use to execute python code.\nIf you get an error, debug your code and try again.\nOnly use the output of your code to answer the question. \nYou might know the answer without running any code, but you should still run the code to get the answer.\nIf it does not seem like you can write code to answer the question, just return \"I don't know\" as the answer.\n\n\nPython REPL: A Python shell. Use this to execute python commands. Input should be a valid python command. If you want to see the output of a value, you should print it out with `print(...)`.\n\nUse the following format:\n\nQuestion: the input question you must answer\nThought: you should always think about what to do\nAction: the action to take, should be one of [Python REPL]\nAction Input: the input to the action\nObservation: the result of the action\n... (this Thought/Action/Action Input/Observation can repeat N times)\nThought: I now know the final answer\nFinal Answer: the final answer to the original input question\n\nBegin!\n\nQuestion: Sort these customers by last name and then first name and print the output: [['Harrison', 'Chase'], ['Lang', 'Chain'], ['Dolly', 'Too'], ['Elle', 'Elem'], ['Geoff', 'Fusion'], ['Trance', 'Former'], ['Jen', 'Ayai']]\nThought:I can use the sorted() function to sort the list of customers by last name and then first name. I will need to provide a key function to sorted() that returns a tuple of the last name and first name in that order.\nAction: Python REPL\nAction Input:\n```\ncustomers = [['Harrison', 'Chase'], ['Lang', 'Chain'], ['Dolly', 'Too'], ['Elle', 'Elem'], ['Geoff', 'Fusion'], ['Trance', 'Former'], ['Jen', 'Ayai']]\nsorted_customers = sorted(customers, key=lambda x: (x[1], x[0]))\nfor customer in sorted_customers:\n    print(customer)\n```\nObservation: ['Jen', 'Ayai']\n['Lang', 'Chain']\n['Harrison', 'Chase']\n['Elle', 'Elem']\n['Trance', 'Former']\n['Geoff', 'Fusion']\n['Dolly', 'Too']\n\nThought:"
  ]
}
[llm/end] [1:chain:AgentExecutor > 5:chain:LLMChain > 6:llm:ChatOpenAI] [3.05s] Exiting LLM run with output:
{
  "generations": [
    [
      {
        "text": "The customers are now sorted by last name and then first name. \nFinal Answer: [['Jen', 'Ayai'], ['Lang', 'Chain'], ['Harrison', 'Chase'], ['Elle', 'Elem'], ['Trance', 'Former'], ['Geoff', 'Fusion'], ['Dolly', 'Too']]",
        "generation_info": null,
        "message": {
          "content": "The customers are now sorted by last name and then first name. \nFinal Answer: [['Jen', 'Ayai'], ['Lang', 'Chain'], ['Harrison', 'Chase'], ['Elle', 'Elem'], ['Trance', 'Former'], ['Geoff', 'Fusion'], ['Dolly', 'Too']]",
          "additional_kwargs": {},
          "example": false
        }
      }
    ]
  ],
  "llm_output": {
    "token_usage": {
      "prompt_tokens": 526,
      "completion_tokens": 68,
      "total_tokens": 594
    },
    "model_name": "gpt-3.5-turbo"
  }
}
[chain/end] [1:chain:AgentExecutor > 5:chain:LLMChain] [3.05s] Exiting Chain run with output:
{
  "text": "The customers are now sorted by last name and then first name. \nFinal Answer: [['Jen', 'Ayai'], ['Lang', 'Chain'], ['Harrison', 'Chase'], ['Elle', 'Elem'], ['Trance', 'Former'], ['Geoff', 'Fusion'], ['Dolly', 'Too']]"
}
[chain/end] [1:chain:AgentExecutor] [9.57s] Exiting Chain run with output:
{
  "output": "[['Jen', 'Ayai'], ['Lang', 'Chain'], ['Harrison', 'Chase'], ['Elle', 'Elem'], ['Trance', 'Former'], ['Geoff', 'Fusion'], ['Dolly', 'Too']]"
}
```

### Define your own tool（定义你自己的工具）

```py
from langchain.agents import tool
from datetime import date

@tool
def time(text: str) -> str:
    """Returns todays date, use this for any \
    questions related to knowing todays date. \
    The input should always be an empty string, \
    and this function will always return todays \
    date - any date mathmatics should occur \
    outside this function."""
    return str(date.today())

agent= initialize_agent(
    tools + [time], 
    llm, 
    agent=AgentType.CHAT_ZERO_SHOT_REACT_DESCRIPTION,
    handle_parsing_errors=True,
    verbose = True)
```

代理有时会得出错误的结论。如果是这样，请尝试再次运行它。


```py
try:
    result = agent("whats the date today?") 
except: 
    print("exception on external access")
```

```
> Entering new AgentExecutor chain...
Thought: I need to use the `time` tool to get today's date.
Action:
```
{
  "action": "time",
  "action_input": ""
}
```

Observation: 2023-06-13
Thought:I have successfully retrieved today's date using the `time` tool.
Final Answer: Today's date is 2023-06-13.

> Finished chain.
```

```py
try:
    result = agent("今天的日期？") 
except: 
    print("exception on external access")
```

```
> Entering new AgentExecutor chain...
Thought: We need to get today's date.
Action:
```
{
  "action": "time",
  "action_input": ""
}
```

Observation: 2023-06-13
Thought:We have successfully retrieved today's date.
Final Answer: Today's date is 2023-06-13.

> Finished chain.
```

```py
from langchain.agents import tool
from datetime import date

@tool
def time(text: str) -> str:
    """返回今天的日期，将其用于与了解今天日期相关的任何问题。\
    输入应始终为空字符串，并且该函数将始终返回今天的日期。"""
    return str(date.today())

agent= initialize_agent(
    tools + [time], 
    llm, 
    agent=AgentType.CHAT_ZERO_SHOT_REACT_DESCRIPTION,
    handle_parsing_errors=True,
    verbose = True)

try:
    result = agent("今天的日期？") 
except: 
    print("exception on external access")
```

```
> Entering new AgentExecutor chain...
Question: 今天的日期？
Thought: We can use the `time` tool to get today's date.
Action:
```
{
  "action": "time",
  "action_input": ""
}
```

Observation: 2023-06-13
Thought:The `time` tool returned today's date as 2023-06-13.
Final Answer: Today's date is 2023-06-13.

> Finished chain.
```

下面是没有给代理有效工具集的表现。

```py
from langchain.agents import tool
from datetime import date

@tool
def time(text: str) -> str:
    """返回今天的日期，将其用于与了解今天日期相关的任何问题。\
    输入应始终为空字符串，并且该函数将始终返回今天的日期。"""
    return str(date.today())

agent= initialize_agent(
    [time], 
    llm, 
    agent=AgentType.CHAT_ZERO_SHOT_REACT_DESCRIPTION,
    handle_parsing_errors=True,
    verbose = True)

try:
    result = agent("介绍一下李小龙的生平") 
except: 
    print("exception on external access")
```

```
> Entering new AgentExecutor chain...
Question: 介绍一下李小龙的生平
Thought: 我们需要使用时间工具来确定李小龙的出生日期和逝世日期，然后提供一些关于他的基本信息。
Action:
```
{
  "action": "time",
  "action_input": ""
}
```

Observation: 2023-06-13
Thought:我们需要进一步搜索李小龙的生平信息。
Action:
```
{
  "action": "search",
  "action_input": "李小龙生平"
}
```

Observation: search is not a valid tool, try another one.
Thought:我们需要使用一个能够搜索信息的工具，比如说百度搜索。
Action:
```
{
  "action": "search_web",
  "action_input": "李小龙生平"
}
```


Observation: search_web is not a valid tool, try another one.
Thought:我们需要使用一个能够搜索信息的工具，比如说百度搜索。
Action:
```
{
  "action": "search",
  "action_input": "李小龙生平"
}
```


Observation: search is not a valid tool, try another one.
Thought:我们需要使用一个能够搜索信息的工具，比如说百度搜索。
Action:
```
{
  "action": "search_web",
  "action_input": "李小龙生平"
}
```


Observation: search_web is not a valid tool, try another one.
Thought:我们可以使用百度百科来搜索李小龙的生平信息。
Action:
```
{
  "action": "search_web",
  "action_input": "李小龙百度百科"
}
```



Observation: search_web is not a valid tool, try another one.
Thought:我们可以使用百度百科来搜索李小龙的生平信息。
Action:
```
{
  "action": "search",
  "action_input": "李小龙百度百科"
}
```



Observation: search is not a valid tool, try another one.
Thought:我们需要使用一个能够搜索信息的工具，比如说百度搜索。
Action:
```
{
  "action": "search_web",
  "action_input": "李小龙百度百科"
}
```



Observation: search_web is not a valid tool, try another one.
Thought:我们可以使用百度百科来搜索李小龙的生平信息。
Action:
```
{
  "action": "search",
  "action_input": "李小龙百度百科"
}
```



Observation: search is not a valid tool, try another one.
Thought:我们需要使用一个能够搜索信息的工具，比如说百度搜索。
Action:
```
{
  "action": "search_web",
  "action_input": "李小龙百度百科"
}
```



Observation: search_web is not a valid tool, try another one.
Thought:我们可以使用百度百科来搜索李小龙的生平信息。
Action:
```
{
  "action": "search",
  "action_input": "李小龙百度百科"
}
```



Observation: search is not a valid tool, try another one.
Thought:我们需要使用一个能够搜索信息的工具，比如说百度搜索。
Action:
```
{
  "action": "search_web",
  "action_input": "李小龙百度百科"
}
```



Observation: search_web is not a valid tool, try another one.
Thought:我们可以使用百度百科来搜索李小龙的生平信息。
Action:
```
{
  "action": "search",
  "action_input": "李小龙百度百科"
}
```



Observation: search is not a valid tool, try another one.
Thought:我们需要使用一个能够搜索信息的工具，比如说百度搜索。
Action:
```
{
  "action": "search_web",
  "action_input": "李小龙百度百科"
}
```



Observation: search_web is not a valid tool, try another one.
Thought:我们可以使用百度百科来搜索李小龙的生平信息。
Action:
```
{
  "action": "search",
  "action_input": "李小龙百度百科"
}
```



Observation: search is not a valid tool, try another one.
Thought:

> Finished chain.
```


## 参考资料
* [DeepLearning.AI - 获得 AI 职业所需的知识和技能](https://www.deeplearning.ai/courses/)
* [面向开发人员的 ChatGPT 提示工程](https://github.com/datawhalechina/prompt-engineering-for-developers/)
