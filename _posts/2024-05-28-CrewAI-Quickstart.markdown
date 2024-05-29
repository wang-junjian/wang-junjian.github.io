---
layout: post
title:  "CrewAI 快速入门"
date:   2024-05-28 08:00:00 +0800
categories: CrewAI Agent
tags: [Quickstart, Agent, CrewAI, LLM, Ollama]
---

## [CrewAI](https://www.crewai.com/)

安装

```python
pip install 'crewai[tools]'
```

## CrewAI 使用 Ollama 运行本地 LLM

### .env
```env
OPENAI_API_BASE=http://localhost:11434/v1
OPENAI_MODEL_NAME=aya:8b
OPENAI_API_KEY=NULL
```

### agent.py

版本1

`每次执行结果都不一样`

```py
from dotenv import load_dotenv
load_dotenv()

from crewai import Agent, Task, Crew
from langchain_openai import ChatOpenAI


general_agent = Agent(
    role = "数学教授", 
    goal = """为提问数学问题的学生提供解决方案并给出答案。""", 
    backstory = """您是一位优秀的数学教授，喜欢以每个人都能理解的方式解决数学问题。""", 
    allow_delegation = False,
    verbose = True
)

task = Task (
    description="""3 + 5 = """,
    agent = general_agent,
    expected_output="一个数字答案。"
)

crew = Crew(
    agents=[general_agent],
    tasks=[task],
    verbose=2
)

result = crew.kickoff()

print(result)
```

版本2

`稳定地生成结果`

```py
from dotenv import load_dotenv
load_dotenv()

from crewai import Agent, Task, Crew
from langchain_openai import ChatOpenAI


llm = ChatOpenAI(
    model = "aya:8b",
    base_url = "http://localhost:11434/v1",
    temperature=0   # 稳定地生成结果
)

general_agent = Agent(
    role = "数学教授", 
    goal = """为提问数学问题的学生提供解决方案并给出答案。""", 
    backstory = """您是一位优秀的数学教授，喜欢以每个人都能理解的方式解决数学问题。""", 
    allow_delegation = False,
    verbose = True,
    llm = llm
)

task = Task (
    description="""3 + 5 = """,
    agent = general_agent,
    expected_output="一个数字答案。"
)

crew = Crew(
    agents=[general_agent],
    tasks=[task],
    verbose=2
)

result = crew.kickoff()

print(result)
```

### 执行结果

```bash
 [DEBUG]: == Working Agent: 数学教授
 [INFO]: == Starting Task: 3 + 5 = 


> Entering new CrewAgentExecutor chain...
I now can give a great answer
Final Answer: 8

> Finished chain.
 [DEBUG]: == [数学教授] Task output: 8


8
```

- [Ollama Integration (ex. for using Llama 2 locally)](https://docs.crewai.com/how-to/LLM-Connections/#ollama-integration-ex-for-using-llama-2-locally)
