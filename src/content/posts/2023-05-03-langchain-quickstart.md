---
layout: single
title:  "LangChain 快速入门"
date:   2023-05-03 08:00:00 +0800
categories: LangChain
tags: [LLM, Quickstart, SerpApi]
---

## [LangChain](https://github.com/hwchase17/langchain)
通过可组合性使用 LLM 构建应用程序

### 介绍
大型语言模型 (LLM) 正在成为一种变革性技术，使开发人员能够构建他们以前无法构建的应用程序。 但是，单独使用这些 LLM 往往不足以创建真正强大的应用程序——当您可以将它们与其他计算或知识来源相结合时，真正的力量就来了。

### [Documentation](https://python.langchain.com/en/latest/)

### 安装
```sh
pip install langchain
# or
conda install langchain -c conda-forge
```

### 配置环境
使用 LangChain 通常需要与一个或多个模型提供者、数据存储、api 等集成。

对于这个例子，将使用 OpenAI 的 API

```sh
pip install openai
```

```sh
export OPENAI_API_KEY="..."
```

## LLMs：从语言模型获得预测结果
在这个例子中，我们可能希望输出更加随机，所以将 temperature 设置的更高一些。

```py
from langchain.llms import OpenAI

llm = OpenAI(temperature=0.9)

text = "一家生产彩色袜子的公司取什么名字好？"
print(llm(text))
```
```
可以取名为：Colorful Socks Factory。
```

## 提示模板（Prompt Templates）：管理 LLM 的提示
```py
from langchain.prompts import PromptTemplate

prompt = PromptTemplate(input_variables=["product"],
    template="一家生产{product}的公司取什么名字好？")

print(prompt.format(product="彩色袜子"))
```
```
一家生产彩色袜子的公司取什么名字好？
```

## 链（Chains）：将 LLM 与提示模板结合起来
```py
from langchain.llms import OpenAI
from langchain.chains import LLMChain

llm = OpenAI(temperature=0.9)

chain = LLMChain(llm=llm, prompt=prompt)
chain.run("彩色袜子")
```
```
'\n\n1、彩趣袜色；2、活力靴线；3、缤纷足尖；4、色彩潮流；5、趣趣袜语；6、色非凡；7、凸显你的风采；8、缰绳丝线；9、色神之纹；10、色彩的诱惑。'
```

## 代理（Agents）：基于用户输入的动态调用链
**Agent 使用 LLM 来确定采取哪些行动以及采取何种顺序。**

* 工具：执行特定任务的功能。 可以是：Google 搜索、数据库查找、Python REPL、其他链。
* LLM：为代理提供支持的语言模型。
* 代理：要使用的代理。

这个例子，我们将使用 [SerpApi](https://serpapi.com/) 来调用 Google 搜索。

### 安装 SerpApi
```sh
pip install google-search-results
```

### 配置 SerpApi API 密钥
```py
import os
os.environ["SERPAPI_API_KEY"] = "..."
```

### 例子
#### 官方
使用官方提供的例子。注意：`'serpapi', 'llm-math'` 这两个工具没有顺序的要求，由 LLM 来决定。

```py
from langchain.llms import OpenAI
from langchain.agents import (
    load_tools,
    initialize_agent,
    AgentType
)

llm = OpenAI(temperature=0)
tools = load_tools(['serpapi', 'llm-math'], llm=llm)
agent = initialize_agent(tools, llm, AgentType.ZERO_SHOT_REACT_DESCRIPTION, verbose=True)

agent.run("What was the high temperature in SF yesterday in Fahrenheit? What is that number raised to the .023 power?")
```
```
> Entering new AgentExecutor chain...
 I need to find the temperature first, then use the calculator to raise it to the .023 power.
Action: Search
Action Input: "High temperature in SF yesterday"
Observation: High: 57.2ºf @2:35 PM Low: 50ºf @6:45 AM Approx.
Thought: I now need to use the calculator to raise 57.2 to the .023 power
Action: Calculator
Action Input: 57.2^.023
Observation: Answer: 1.0975393720872189
Thought: I now know the final answer
Final Answer: 1.0975393720872189

> Finished chain.
```
```
'1.0975393720872189'
```

#### 我的
```py
from langchain.llms import OpenAI
from langchain.agents import (
    load_tools,
    initialize_agent,
    AgentType
)

llm = OpenAI(temperature=0)
tools = load_tools(['serpapi'])
agent = initialize_agent(tools, llm, AgentType.ZERO_SHOT_REACT_DESCRIPTION, verbose=True)

agent.run("中国济南今天的天气气温多少？")
```
```
> Entering new AgentExecutor chain...
 I should look up the current weather in Jinan, China.
Action: Search
Action Input: Jinan, China weather
Observation: 2 Week Extended Forecast in Jinan, Shandong, China ; May 2, 80 / 67 °F · 13 mph ; May 3, 79 / 65 °F · 10 mph ; May 4, 68 / 59 °F · 6 mph ; May 5, 65 / 56 °F · 11 mph ...
Thought: I should look for the current temperature.
Action: Search
Action Input: Jinan, China current temperature
Observation: 2 Week Extended Forecast in Jinan, Shandong, China ; May 2, 80 / 67 °F · 13 mph ; May 3, 79 / 65 °F · 10 mph ; May 4, 68 / 59 °F · 6 mph ; May 5, 65 / 56 °F · 11 mph ...
Thought: I now know the current temperature in Jinan, China.
Final Answer: The current temperature in Jinan, China is 80°F (27°C).

> Finished chain.
```
```
'The current temperature in Jinan, China is 80°F (27°C).'
```

数学表达式不好描述：(N-32)/1.8，即华氏温度转换为摄氏温度的公式。

```py
from langchain.llms import OpenAI
from langchain.agents import (
    load_tools,
    initialize_agent,
    AgentType
)

llm = OpenAI(temperature=0)
tools = load_tools(['serpapi', 'llm-math'], llm=llm)
agent = initialize_agent(tools, llm, AgentType.ZERO_SHOT_REACT_DESCRIPTION, verbose=True)

agent.run("中国济南今天的天气气温多少？(这个数字-32)/1.8")
```

测试了好几种方式都没有成功
* 中国济南今天的天气气温多少？(这个数字-32)/1.8
    - （异常）Action Input: (the number - 32) / 1.8

* 中国济南今天的天气气温多少？这个数减去32的差除以1.8是多少？
    - Action Input: 82 - 32 / 1.8

* 中国济南今天的天气气温多少？这个数减去32的差，再除以1.8是多少？
    - Action Input: 82 - 32 / 1.8

我使用 OpenAI 的 `text-davinci-003` 和 `gpt-3.5-turbo` 模型进行了测试，都可以很好的理解。

```
n=82
这个数减去32的差，再除以1.8是多少？
(82-32)/1.8 = 27.78
```

## 内存：将状态添加到链和代理中
到目前为止，我们所经历的所有链和代理都是无状态的。但通常，您可能希望链或代理具有某种“记忆”概念，以便它可以记住有关其先前交互的信息。最清晰和简单的例子是在设计聊天机器人时——您希望它记住以前的消息，以便它可以使用上下文来进行更好的对话。

```py
from langchain import (
    OpenAI,
    ConversationChain
)

llm = OpenAI(temperature=0.9)
chain = ConversationChain(llm=llm, verbose=True)
chain.run("你好!")
```
```
> Entering new ConversationChain chain...
Prompt after formatting:
The following is a friendly conversation between a human and an AI. The AI is talkative and provides lots of specific details from its context. If the AI does not know the answer to a question, it truthfully says it does not know.

Current conversation:

Human: 你好!
AI:

> Finished chain.
```
```
' 你好！很高兴认识你！我叫Nancy，来自于一个人工智能项目。我有什么可以为你服务的？'
```

```py
chain.run("我想和你聊聊天。")
```
```
> Entering new ConversationChain chain...
Prompt after formatting:
The following is a friendly conversation between a human and an AI. The AI is talkative and provides lots of specific details from its context. If the AI does not know the answer to a question, it truthfully says it does not know.

Current conversation:
Human: 你好!
AI:  你好！很高兴认识你！我叫Nancy，来自于一个人工智能项目。我有什么可以为你服务的？
Human: 我想和你聊聊天。
AI:

> Finished chain.
```
```
' 我乐意和你聊天。你有什么好的话题？'
```

```py
chain.run("我跟你说的第一句话是什么？")
```
```
> Entering new ConversationChain chain...
Prompt after formatting:
The following is a friendly conversation between a human and an AI. The AI is talkative and provides lots of specific details from its context. If the AI does not know the answer to a question, it truthfully says it does not know.

Current conversation:
Human: 你好!
AI:  你好！很高兴认识你！我叫Nancy，来自于一个人工智能项目。我有什么可以为你服务的？
Human: 我想和你聊聊天。
AI:  我乐意和你聊天。你有什么好的话题？
Human: 我跟你说的第一句话是什么？
AI:

> Finished chain.
```
```
' 你跟我说的第一句话是“你好！”'
```

## 构建语言模型应用程序：聊天模型
### 获取消息完成
#### 一条消息
```py
from langchain.chat_models import ChatOpenAI
from langchain.schema import (
    AIMessage,
    HumanMessage,
    SystemMessage
)

chat = ChatOpenAI()
chat([HumanMessage(content="你好!")])
```
```
AIMessage(content='你好，有什么可以帮助您的吗？', additional_kwargs={}, example=False)
```

#### 多条消息
```py
chat([SystemMessage(content="你是个翻译，中文翻译成英文。"),
      HumanMessage(content="你好!")])
```
```
AIMessage(content='Hello!', additional_kwargs={}, example=False)
```

#### 多组消息
```py
messages = [
    [HumanMessage(content="翻译成中文：How are you?")],
    [HumanMessage(content="翻译成中文：How do you do?")],
]

chat.generate(messages)
```
```
LLMResult(generations=[[ChatGeneration(text='你好吗？', generation_info=None, message=AIMessage(content='你好吗？', additional_kwargs={}, example=False))], 
[ChatGeneration(text='你好吗？', generation_info=None, message=AIMessage(content='你好吗？', additional_kwargs={}, example=False))]], 
llm_output={'token_usage': {'prompt_tokens': 43, 'completion_tokens': 10, 'total_tokens': 53}, 'model_name': 'gpt-3.5-turbo'})
```

### 聊天提示模板
```py
from langchain.chat_models import ChatOpenAI
from langchain.prompts.chat import (
    SystemMessagePromptTemplate,
    HumanMessagePromptTemplate,
    ChatPromptTemplate
)

system_message_prompt = SystemMessagePromptTemplate.from_template("你是个翻译，{source_language}翻译成{target_language}。")
human_message_prompt = HumanMessagePromptTemplate.from_template("{text}")
chat_prompt = ChatPromptTemplate.from_messages([system_message_prompt, human_message_prompt])

chat = ChatOpenAI()
chat(chat_prompt.format_prompt(source_language="英语", target_language="法语", text="I love you.").to_messages())
```
```
AIMessage(content="Je t'aime.", additional_kwargs={}, example=False)
```

### 带有聊天模型的链
```py
from langchain.chat_models import ChatOpenAI
from langchain import LLMChain
from langchain.prompts.chat import (
    SystemMessagePromptTemplate,
    HumanMessagePromptTemplate,
    ChatPromptTemplate
)

system_message_prompt = SystemMessagePromptTemplate.from_template("你是个翻译，{source_language}翻译成{target_language}。")
human_message_prompt = HumanMessagePromptTemplate.from_template("{text}")
chat_prompt = ChatPromptTemplate.from_messages([system_message_prompt, human_message_prompt])

chat = ChatOpenAI(temperature=0)
chain = LLMChain(llm=chat, prompt=chat_prompt, verbose=True)
chain.run(source_language="英语", target_language="中文", text="I love you.")
```
```
> Entering new LLMChain chain...
Prompt after formatting:
System: 你是个翻译，英语翻译成中文。
Human: I love you.

> Finished chain.
```
```
'我爱你。'
```

### 带有聊天模型的代理
```py
from langchain.agents import load_tools
from langchain.agents import initialize_agent
from langchain.agents import AgentType
from langchain.chat_models import ChatOpenAI
from langchain.llms import OpenAI

# First, let's load the language model we're going to use to control the agent.
chat = ChatOpenAI(temperature=0)

# Next, let's load some tools to use. Note that the `llm-math` tool uses an LLM, so we need to pass that in.
llm = OpenAI(temperature=0)
tools = load_tools(["serpapi", "llm-math"], llm=llm)


# Finally, let's initialize an agent with the tools, the language model, and the type of agent we want to use.
agent = initialize_agent(tools, chat, agent=AgentType.CHAT_ZERO_SHOT_REACT_DESCRIPTION, verbose=True)

# Now let's test it out!
agent.run("Who is Olivia Wilde's boyfriend? What is his current age raised to the 0.23 power?")
```

### 内存：将状态添加到链和代理中
```py
from langchain.prompts import (
    ChatPromptTemplate, 
    MessagesPlaceholder, 
    SystemMessagePromptTemplate, 
    HumanMessagePromptTemplate
)
from langchain.chains import ConversationChain
from langchain.chat_models import ChatOpenAI
from langchain.memory import ConversationBufferMemory

prompt = ChatPromptTemplate.from_messages([
    SystemMessagePromptTemplate.from_template("The following is a friendly conversation between a human and an AI. The AI is talkative and provides lots of specific details from its context. If the AI does not know the answer to a question, it truthfully says it does not know."),
    MessagesPlaceholder(variable_name="history"),
    HumanMessagePromptTemplate.from_template("{input}")
])

llm = ChatOpenAI(temperature=0)
memory = ConversationBufferMemory(return_messages=True)
conversation = ConversationChain(memory=memory, prompt=prompt, llm=llm)

conversation.predict(input="Hi there!")
# -> 'Hello! How can I assist you today?'


conversation.predict(input="I'm doing well! Just having a conversation with an AI.")
# -> "That sounds like fun! I'm happy to chat with you. Is there anything specific you'd like to talk about?"

conversation.predict(input="Tell me about yourself.")
# -> "Sure! I am an AI language model created by OpenAI. I was trained on a large dataset of text from the internet, which allows me to understand and generate human-like language. I can answer questions, provide information, and even have conversations like this one. Is there anything else you'd like to know about me?"
```

## 参考资料
* [LangChain](https://github.com/hwchase17/langchain)
* [LangChain Documentation](https://python.langchain.com/en/latest/index.html)
* [LangChain AI Handbook](https://www.pinecone.io/learn/langchain/)
* [SerpApi - Google Search API](https://serpapi.com)
* [geektime-ai-course](https://github.com/xuwenhao/geektime-ai-course)
