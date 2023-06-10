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


## 参考资料
* [DeepLearning.AI - 获得 AI 职业所需的知识和技能](https://www.deeplearning.ai/courses/)
* [面向开发人员的 ChatGPT 提示工程](https://github.com/datawhalechina/prompt-engineering-for-developers/)
