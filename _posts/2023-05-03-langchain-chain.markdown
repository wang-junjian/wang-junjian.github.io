---
layout: post
title:  "LangChain - Chain"
date:   2023-05-03 10:00:00 +0800
categories: Chain
tags: [LangChain, LLM]
---

## [Chain](https://python.langchain.com/en/latest/modules/chains.html)
链允许我们将多个组件组合在一起以创建一个单一的、连续的应用程序。我们可以通过将多个链组合在一起，或者通过将链与其他组件组合来构建更复杂的链。

## [LLMChain](https://python.langchain.com/en/latest/modules/chains/generic/llm_chain.html)
LLMChain 是一个简单的链，它接受一个提示模板，用用户输入格式化它并返回来自 LLM 的响应。

### 语言模型（text-davinci-003）
```py
from langchain.chains import LLMChain
from langchain.llms import OpenAI
from langchain.prompts import PromptTemplate

llm = OpenAI(temperature=0.9)
prompt = PromptTemplate(input_variables=["product"],
                        template="What is a good name for a company that makes {product}?")

chain = LLMChain(llm=llm, prompt=prompt)
print(chain("colorful socks"))
```
```
{'product': 'colorful socks', 'text': '\n\nJazzy Socks.'}
```

### 聊天模型（gpt-3.5-turbo）
```py
from langchain.chains import LLMChain
from langchain.chat_models import ChatOpenAI
from langchain.prompts import PromptTemplate
from langchain.prompts.chat import (
    ChatPromptTemplate,
    HumanMessagePromptTemplate
)

chat = ChatOpenAI(temperature=0.9)
human_message_prompt = HumanMessagePromptTemplate(
    prompt=PromptTemplate(
        input_variables=["product"],
        template="What is a good name for a company that makes {product}?"
    )
)
chat_prompt = ChatPromptTemplate.from_messages(messages=[human_message_prompt])

chain = LLMChain(llm=chat, prompt=chat_prompt)
print(chain("colorful socks"))
```
```
{'product': 'colorful socks', 'text': 'Rainbow Socks Co.'}
```

**使用中文提问效果不好，出现的是一个名字列表。**
```
# 中文 Prompt
为生产{product}的公司取个好名字。
为生产{product}的公司取一个好名字。
```

## 调用链的不同方式
使用 `PromptTemplate.from_template` 方法，会自动检测输入变量 `input_variables`。

```py
prompt = PromptTemplate(input_variables=["product"], template="What is a good name for a company that makes {product}?")
prompt = PromptTemplate.from_template(template="What is a good name for a company that makes {product}?")
```

```py
from langchain.chains import LLMChain
from langchain.chat_models import ChatOpenAI
from langchain.prompts import PromptTemplate

prompt_template = "What is a good name for a company that makes {product}?"

chat = ChatOpenAI(temperature=0.9)
chain = LLMChain(llm=chat, prompt=PromptTemplate.from_template(prompt_template))

chain("colorful socks")
```
```
{'product': 'colorful socks', 'text': 'Rainbow Sock Co.'}
```

如果有多个变量时，可以使用 Dict
```py
chain({"product": "colorful socks"})
```
```
{'product': 'colorful socks', 'text': 'Rainbow Sox Co.'}
```

只显示输出结果
```py
chain("colorful socks", return_only_outputs=True)
```
```
{'text': 'Rainbow Threads Sock Co.'}
```

如果 Chain 只输出一个输出键（即只有一个元素在它的 output_keys），你可以使用 run 方法。请注意，run 输出的是字符串而不是字典。
```py
chain.run("colorful socks")
```
```
'Rainbow Socks Co.'
```

## 调试链（verbose=True）
创建链时，设置参数 `verbose=True` 将在运行时打印出对象的一些内部状态。

```py
from langchain.chains import LLMChain
from langchain.chat_models import ChatOpenAI
from langchain.prompts import PromptTemplate

prompt_template = "What is a good name for a company that makes {product}?"

chat = ChatOpenAI(temperature=0.9)
chain = LLMChain(llm=chat, prompt=PromptTemplate.from_template(prompt_template), verbose=True)

chain.run("colorful socks")
```
```
> Entering new LLMChain chain...
Prompt after formatting:
What is a good name for a company that makes colorful socks?

> Finished chain.
```
```
'Happy Feet Socks.'
```

## 组合链（SimpleSequentialChain）
顺序链是按预定义顺序执行的链。我们将使用 SimpleSequentialChain，这是最简单的顺序链类型，其中每个步骤都有一个输入/输出，一个步骤的输出是下一个步骤的输入。

下面的例子中，我们的顺序链将：
首先，为产品创建公司名称。
然后，为公司创建一个标语。
```py
from langchain.chains import LLMChain
from langchain.chains import SimpleSequentialChain
from langchain.chat_models import ChatOpenAI
from langchain.prompts import PromptTemplate

first_prompt_template = "What is a good name for a company that makes {product}?"
second_prompt_template = "Write a catchphrase for the following company: {company_name}"

chat = ChatOpenAI(temperature=0.9)
first_chain = LLMChain(llm=chat, prompt=PromptTemplate.from_template(first_prompt_template))
second_chain = LLMChain(llm=chat, prompt=PromptTemplate.from_template(second_prompt_template))

chain = SimpleSequentialChain(chains=[first_chain, second_chain], verbose=True)
chain.run("colorful socks")
```
```
> Entering new SimpleSequentialChain chain...
Rainbow Socks Co.
"Step into a colorful world with Rainbow Socks Co."

> Finished chain.
```
```
'"Step into a colorful world with Rainbow Socks Co."'
```
* Rainbow Socks Co.
    - 彩虹袜业公司
* Step into a colorful world with Rainbow Socks Co.
    - 与彩虹袜业公司一起走进多彩的世界。

## 增强 ChatGPT 的数学能力
### ChatGPT 计算
```py
from langchain.chains import LLMChain
from langchain.chat_models import ChatOpenAI
from langchain.prompts import PromptTemplate

llm = ChatOpenAI(temperature=0)
prompt = PromptTemplate.from_template("计算一下{expression}等于多少？")
chain = LLMChain(llm=llm, prompt=prompt)

print(chain.run("358*103")) # 36874
```
```
36974
```

### 使用 PythonREPL
有时，对于复杂的计算，与其让 LLM 直接生成答案，不如让 LLM 生成代码来计算答案，然后运行该代码来获得答案会更好。

```py
from langchain.utilities import PythonREPL
repl = PythonREPL()
print(repl.run("print(358*103)"))
```

#### 语言模型（text-davinci-003）
```py
from langchain.chains import LLMChain
from langchain.utilities import PythonREPL
from langchain.llms import OpenAI
from langchain.prompts import PromptTemplate

llm = OpenAI()
repl = PythonREPL()
chain = LLMChain(llm=llm, prompt=PromptTemplate.from_template("使用Python生成计算 '{expression}' 的代码。"))

python_code = chain.run("358*103")
result = repl.run(python_code)

print(f"Python code: {python_code}\nResult: {result}")
```
```
Python code: 

print(358 * 103)
Result: 36874
```

#### 聊天模型（gpt-3.5-turbo）
这个问题不太适合用 `gpt-3.5-turbo` 模型。

```py
from langchain.chains import LLMChain
from langchain.utilities import PythonREPL
from langchain.chat_models import ChatOpenAI
from langchain.prompts import PromptTemplate

llm = ChatOpenAI()
repl = PythonREPL()
chain = LLMChain(llm=llm, prompt=PromptTemplate.from_template("使用Python生成计算 '{expression}' 的代码，只要代码不要输出结果，也不需要'```python'等标签，需要使用print打印出结果。"), verbose=True)

python_code = chain.run("358*103")
result = repl.run(python_code)

print(f"Python code: {python_code}\nResult: {result}")
```
```
Python code: code = "print(358*103)"  
exec(code)
Result: 36874
```

### LLMMathChain
LangChain 将上面的能力封装到了 LLMMathChain。

```py
from langchain.chains import LLMMathChain
from langchain.llms import OpenAI

chain = LLMMathChain.from_llm(llm=OpenAI(), verbose=True)
print(chain.run("358*103"))
```
```
> Entering new LLMMathChain chain...
358*103

...numexpr.evaluate("358*103")...

Answer: 36874
> Finished chain.
```
```
Answer: 36874
```

* [Tools](https://python.langchain.com/en/latest/modules/agents/tools.html)

## [Other Chains](https://python.langchain.com/en/latest/modules/chains/how_to_guides.html)
### LLMRequestsChain
这种使用 Google 搜索的方式不稳定。
```py
from langchain.llms import OpenAI
from langchain.chains import LLMRequestsChain, LLMChain
from langchain.prompts import PromptTemplate

template = """Between >>> and <<< are the raw search result text from google.
Extract the answer to the question '{query}' or say "not found" if the information is not contained.
Use the format
Extracted:<answer or "not found">
>>> {requests_result} <<<
Extracted:"""

PROMPT = PromptTemplate(
    input_variables=["query", "requests_result"],
    template=template,
)

chain = LLMRequestsChain(llm_chain = LLMChain(llm=OpenAI(temperature=0), prompt=PROMPT))

question = "What are the Three (3) biggest countries, and their respective sizes?"
inputs = {
    "query": question,
    "url": "https://www.google.com/search?q=" + question.replace(" ", "+")
}
chain(inputs)
```
```
{'query': 'What are the Three (3) biggest countries, and their respective sizes?',
 'url': 'https://www.google.com/search?q=What+are+the+Three+(3)+biggest+countries,+and+their+respective+sizes?',
 'output': ' Russia (17,098,242 km²), Canada (9,984,670 km²), United States (9,826,675 km²)'}
```

## 参考资料
* [Chains Documentation](https://python.langchain.com/en/latest/modules/chains.html)
