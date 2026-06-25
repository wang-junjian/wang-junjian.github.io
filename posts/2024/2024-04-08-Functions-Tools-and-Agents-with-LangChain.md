---
type: article
title:  "Functions, Tools and Agents with LangChain"
date:   2024-04-08 08:00:00 +0800
tags: [deeplearningai, ]
---

## OpenAI Function Calling (OpenAI 函数调用)
```python
import os
import openai
import json

from dotenv import load_dotenv, find_dotenv
_ = load_dotenv(find_dotenv()) # read local .env file
openai.api_key = os.environ['OPENAI_API_KEY']


# Example dummy function hard coded to return the same weather
# In production, this could be your backend API or an external API
def get_current_weather(location, unit="fahrenheit"):
    """Get the current weather in a given location"""
    weather_info = {
        "location": location,
        "temperature": "72",
        "unit": unit,
        "forecast": ["sunny", "windy"],
    }
    return json.dumps(weather_info)

# define a function
functions = [
    {
        "name": "get_current_weather",
        "description": "Get the current weather in a given location",
        "parameters": {
            "type": "object",
            "properties": {
                "location": {
                    "type": "string",
                    "description": "The city and state, e.g. San Francisco, CA",
                },
                "unit": {"type": "string", "enum": ["celsius", "fahrenheit"]},
            },
            "required": ["location"],
        },
    }
]

messages = [
    {
        "role": "user",
        "content": "What's the weather like in Boston?"
    }
]

response = openai.ChatCompletion.create(
    model="gpt-3.5-turbo",
    messages=messages,
    functions=functions
)
print(response)
```
```
{
  "id": "chatcmpl-9CK2or9rtxzcsVgbfwWmIvqi36wF0",
  "object": "chat.completion",
  "created": 1712724014,
  "model": "gpt-3.5-turbo-0125",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": null,
        "function_call": {
          "name": "get_current_weather",
          "arguments": "{\"location\":\"Boston\",\"unit\":\"celsius\"}"
        }
      },
      "logprobs": null,
      "finish_reason": "function_call"
    }
  ],
  "usage": {
    "prompt_tokens": 82,
    "completion_tokens": 20,
    "total_tokens": 102
  },
  "system_fingerprint": "fp_b28b39ffa8"
}
```

```python
messages.append(response["choices"][0]["message"].to_dict())

args = json.loads(response["choices"][0]["message"]['function_call']['arguments'])
observation = get_current_weather(args)

messages.append(
        {
            "role": "function",
            "name": "get_current_weather",
            "content": observation,
        }
)

response = openai.ChatCompletion.create(
    model="gpt-3.5-turbo",
    messages=messages,
)
print(response)
```
```
{
  "id": "chatcmpl-9CJzhka3wmTPCEfnrIXEyLWtGTusz",
  "object": "chat.completion",
  "created": 1712723821,
  "model": "gpt-3.5-turbo-0125",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "The current weather in Boston is 72\u00b0F with sunny and windy conditions."
      },
      "logprobs": null,
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 72,
    "completion_tokens": 15,
    "total_tokens": 87
  },
  "system_fingerprint": "fp_b28b39ffa8"
}
```

```python
messages
```
```
[{'role': 'user', 'content': "What's the weather like in Boston?"},
 {'role': 'assistant',
  'content': None,
  'function_call': <OpenAIObject at 0x7f531c91aea0> JSON: {
    "name": "get_current_weather",
    "arguments": "{\"location\":\"Boston\"}"
  }},
 {'role': 'function',
  'name': 'get_current_weather',
  'content': '{"location": {"location": "Boston"}, "temperature": "72", "unit": "fahrenheit", "forecast": ["sunny", "windy"]}'}]
​```


## LangChain Expression Language (LCEL) (LangChain 表达式语言)
```python
import os
import openai

from dotenv import load_dotenv, find_dotenv
_ = load_dotenv(find_dotenv()) # read local .env file
openai.api_key = os.environ['OPENAI_API_KEY']

#!pip install pydantic==1.10.8

from langchain.prompts import ChatPromptTemplate
from langchain.chat_models import ChatOpenAI
from langchain.schema.output_parser import StrOutputParser

```

### Simple Chain
```python
# 给我讲一个关于{topic}的小笑话
prompt = ChatPromptTemplate.from_template(
    "tell me a short joke about {topic}"
)
model = ChatOpenAI()
output_parser = StrOutputParser()

chain = prompt | model | output_parser

response = chain.invoke({"topic": "bears"})
print(response)
```
```
Why did the bear break up with his girlfriend?
Because he couldn't bear the relationship any longer!
```

### More complex chain
And Runnable Map to supply user-provided inputs to the prompt.

```python
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import DocArrayInMemorySearch

vectorstore = DocArrayInMemorySearch.from_texts(
    ["harrison worked at kensho", "bears like to eat honey"],
    embedding=OpenAIEmbeddings()
)
retriever = vectorstore.as_retriever()

retriever.get_relevant_documents("where did harrison work?")
# [Document(page_content='harrison worked at kensho'),
#  Document(page_content='bears like to eat honey')]

retriever.get_relevant_documents("what do bears like to eat")
# [Document(page_content='bears like to eat honey'),
#  Document(page_content='harrison worked at kensho')]

template = """Answer the question based only on the following context:
{context}

Question: {question}
"""
prompt = ChatPromptTemplate.from_template(template)
# ChatPromptTemplate(input_variables=['context', 'question'], messages=[HumanMessagePromptTemplate(prompt=PromptTemplate(input_variables=['context', 'question'], template='Answer the question based only on the following context:\n{context}\n\nQuestion: {question}\n'))])

from langchain.schema.runnable import RunnableMap

chain = RunnableMap({
    "context": lambda x: retriever.get_relevant_documents(x["question"]),
    "question": lambda x: x["question"]
}) | prompt | model | output_parser

chain.invoke({"question": "where did harrison work?"})
# Harrison worked at Kensho.

inputs = RunnableMap({
    "context": lambda x: retriever.get_relevant_documents(x["question"]),
    "question": lambda x: x["question"]
})

inputs.invoke({"question": "where did harrison work?"})
# {'context': [Document(page_content='harrison worked at kensho'),
#   Document(page_content='bears like to eat honey')],
#  'question': 'where did harrison work?'}
```

### Bind
And OpenAI Functions
  
```python
functions = [
    {
      "name": "weather_search",
      "description": "Search for weather given an airport code",
      "parameters": {
        "type": "object",
        "properties": {
          "airport_code": {
            "type": "string",
            "description": "The airport code to get the weather for"
          },
        },
        "required": ["airport_code"]
      }
    }
  ]

prompt = ChatPromptTemplate.from_messages(
    [
        ("human", "{input}")
    ]
)
model = ChatOpenAI(temperature=0).bind(functions=functions)

runnable = prompt | model
runnable.invoke({"input": "what is the weather in sf"})
# AIMessage(content='', additional_kwargs={'function_call': {'name': 'weather_search', 'arguments': '{"airport_code":"SFO"}'}})
```

```python
functions = [
    {
      "name": "weather_search",
      "description": "Search for weather given an airport code",
      "parameters": {
        "type": "object",
        "properties": {
          "airport_code": {
            "type": "string",
            "description": "The airport code to get the weather for"
          },
        },
        "required": ["airport_code"]
      }
    },
        {
      "name": "sports_search",
      "description": "Search for news of recent sport events",
      "parameters": {
        "type": "object",
        "properties": {
          "team_name": {
            "type": "string",
            "description": "The sports team to search for"
          },
        },
        "required": ["team_name"]
      }
    }
  ]

model = model.bind(functions=functions)
runnable = prompt | model
runnable.invoke({"input": "how did the patriots do yesterday?"})
# AIMessage(content='', additional_kwargs={'function_call': {'name': 'sports_search', 'arguments': '{"team_name":"patriots"}'}})
```

### Fallbacks
```python
# **Note**: Due to the deprecation of OpenAI's model `text-davinci-001` on 4 January 2024, you'll be using OpenAI's recommended replacement model `gpt-3.5-turbo-instruct` instead.

from langchain.llms import OpenAI
import json

simple_model = OpenAI(
    temperature=0, 
    max_tokens=1000, 
    model="gpt-3.5-turbo-instruct"
)

simple_chain = simple_model | json.loads
# 在 json blob 中写三首诗，其中每首诗都是标题、作者和第一行的 json blob
challenge = "write three poems in a json blob, where each poem is a json blob of a title, author, and first line"
simple_model.invoke(challenge)
```
```
{
    "title": "Autumn Leaves",
    "author": "Emily Dickinson",
    "first_line": "The leaves are falling, one by one"
}

{
    "title": "The Ocean's Song",
    "author": "Pablo Neruda",
    "first_line": "I hear the ocean's song, a symphony of waves"
}

{
    "title": "A Winter's Night",
    "author": "Robert Frost",
    "first_line": "The snow falls softly, covering the ground"
}
```

```python
# Note: The next line is expected to fail.
simple_chain.invoke(challenge)

model = ChatOpenAI(temperature=0)
chain = model | StrOutputParser() | json.loads
chain.invoke(challenge)
# {'poem1': {'title': 'The Rose',
#   'author': 'Emily Dickinson',
#   'firstLine': 'A rose by any other name would smell as sweet'},
#  'poem2': {'title': 'The Road Not Taken',
#   'author': 'Robert Frost',
#   'firstLine': 'Two roads diverged in a yellow wood'},
#  'poem3': {'title': 'Hope is the Thing with Feathers',
#   'author': 'Emily Dickinson',
#   'firstLine': 'Hope is the thing with feathers that perches in the soul'}}

final_chain = simple_chain.with_fallbacks([chain])
final_chain.invoke(challenge)
# {'poem1': {'title': 'The Rose',
#   'author': 'Emily Dickinson',
#   'firstLine': 'A rose by any other name would smell as sweet'},
#  'poem2': {'title': 'The Road Not Taken',
#   'author': 'Robert Frost',
#   'firstLine': 'Two roads diverged in a yellow wood'},
#  'poem3': {'title': 'Hope is the Thing with Feathers',
#   'author': 'Emily Dickinson',
#   'firstLine': 'Hope is the thing with feathers that perches in the soul'}}
```

### Interface
```python
prompt = ChatPromptTemplate.from_template(
    "Tell me a short joke about {topic}"
)
model = ChatOpenAI()
output_parser = StrOutputParser()

chain = prompt | model | output_parser

chain.invoke({"topic": "bears"})
# "Why did the bear break up with his girlfriend?\nBecause he couldn't bear the relationship anymore!"

chain.batch([{"topic": "bears"}, {"topic": "frogs"}])
# ["Why did the bear break up with his girlfriend? Because he couldn't bear the relationship anymore!",
#  'Why are frogs so happy? They eat whatever bugs them!']

for t in chain.stream({"topic": "bears"}):
    print(t)

response = await chain.ainvoke({"topic": "bears"})
response
# 'Why did the bear bring a flashlight to the party? Because he heard it was going to be a "beary" good time!'
```


## OpenAI Function Calling In LangChain (LangChain 中的 OpenAI 函数调用)
```python
import os
import openai

from dotenv import load_dotenv, find_dotenv
_ = load_dotenv(find_dotenv()) # read local .env file
openai.api_key = os.environ['OPENAI_API_KEY']

from typing import List
from pydantic import BaseModel, Field
```

### Pydantic Syntax (Pydantic 语法)

Pydantic data classes are a blend of Python's data classes with the validation power of Pydantic. (Pydantic 数据类是 Python 数据类与 Pydantic 的验证功能的结合。)

They offer a concise way to define data structures while ensuring that the data adheres to specified types and constraints. (它们提供了一种简洁的方式来定义数据结构，同时确保数据符合指定的类型和约束。)

In standard python you would create a class like this: (在标准 python 中，您可以创建一个类如下：)

```python
class pUser(BaseModel):
    name: str
    age: int
    email: str
        
foo_p = pUser(name="Jane", age=32, email="jane@gmail.com")
foo_p.name #Jane

foo_p = pUser(name="Jane", age="bar", email="jane@gmail.com")
# ValidationError: 1 validation error for pUser
# age
#   value is not a valid integer (type=type_error.integer)

class Class(BaseModel):
    students: List[pUser]

obj = Class(
    students=[pUser(name="Jane", age=32, email="jane@gmail.com")]
)
# Class(students=[pUser(name='Jane', age=32, email='jane@gmail.com')])
```

### Pydantic to OpenAI function definition (Pydantic 到 OpenAI 函数定义)

```python
class WeatherSearch(BaseModel):
    """Call this with an airport code to get the weather at that airport"""
    airport_code: str = Field(description="airport code to get weather for")

from langchain.utils.openai_functions import convert_pydantic_to_openai_function
weather_function = convert_pydantic_to_openai_function(WeatherSearch)

import json
print(json.dumps(weather_function, indent=4))
```
```json
{
    "name": "WeatherSearch",
    "description": "Call this with an airport code to get the weather at that airport",
    "parameters": {
        "title": "WeatherSearch",
        "description": "Call this with an airport code to get the weather at that airport",
        "type": "object",
        "properties": {
            "airport_code": {
                "title": "Airport Code",
                "description": "airport code to get weather for",
                "type": "string"
            }
        },
        "required": [
            "airport_code"
        ]
    }
}
```

```python
from langchain.chat_models import ChatOpenAI
model = ChatOpenAI()
model.invoke("what is the weather in SF today?", functions=[weather_function])
# AIMessage(content='', additional_kwargs={'function_call': {'name': 'WeatherSearch', 'arguments': '{"airport_code":"SFO"}'}})

# 模型绑定函数后，就不需要再传递函数了。
model_with_function = model.bind(functions=[weather_function])
model_with_function.invoke("what is the weather in sf?")
# AIMessage(content='', additional_kwargs={'function_call': {'name': 'WeatherSearch', 'arguments': '{"airport_code":"SFO"}'}})
```

### Forcing it to use a function (强制使用函数)

```python
model_with_forced_function = model.bind(functions=[weather_function], function_call={"name":"WeatherSearch"})
model_with_forced_function.invoke("what is the weather in sf?")
# AIMessage(content='', additional_kwargs={'function_call': {'name': 'WeatherSearch', 'arguments': '{"airport_code":"SFO"}'}})

model_with_forced_function.invoke("hi!") # 问题不匹配也会强制使用函数
# AIMessage(content='', additional_kwargs={'function_call': {'name': 'WeatherSearch', 'arguments': '{"airport_code":"SFO"}'}})
```

### Using in a chain (在链中使用)

We can use this model bound to function in a chain as we normally would. (我们可以像往常一样在链中使用绑定到函数的模型。)

```python
from langchain.prompts import ChatPromptTemplate

prompt = ChatPromptTemplate.from_messages([
    ("system", "You are a helpful assistant"),
    ("user", "{input}")
])

chain = prompt | model_with_function
chain.invoke({"input": "what is the weather in sf?"})
# AIMessage(content='', additional_kwargs={'function_call': {'name': 'WeatherSearch', 'arguments': '{"airport_code":"SFO"}'}})
```

### Using multiple functions (使用多个函数)

Even better, we can pass a set of function and let the LLM decide which to use based on the question context. (更好的是，我们可以传递一组函数，让 LLM 根据问题上下文决定使用哪个。)

```python
class ArtistSearch(BaseModel):
    """Call this to get the names of songs by a particular artist"""
    artist_name: str = Field(description="name of artist to look up")
    n: int = Field(description="number of results")

functions = [
    convert_pydantic_to_openai_function(WeatherSearch),
    convert_pydantic_to_openai_function(ArtistSearch),
]

model_with_functions = model.bind(functions=functions)
model_with_functions.invoke("what is the weather in sf?")
# AIMessage(content='', additional_kwargs={'function_call': {'name': 'WeatherSearch', 'arguments': '{"airport_code":"SFO"}'}})

model_with_functions.invoke("what are three songs by taylor swift?")
# AIMessage(content='', additional_kwargs={'function_call': {'name': 'ArtistSearch', 'arguments': '{"artist_name":"Taylor Swift","n":3}'}})

model_with_functions.invoke("hi!")
# AIMessage(content='Hello! How can I assist you today?')
```


## Tagging and Extraction Using OpenAI functions (使用 OpenAI 函数进行标记和提取)
```python
import os
import openai

from dotenv import load_dotenv, find_dotenv
_ = load_dotenv(find_dotenv()) # read local .env file
openai.api_key = os.environ['OPENAI_API_KEY']

from typing import List
from pydantic import BaseModel, Field
from langchain.utils.openai_functions import convert_pydantic_to_openai_function

class Tagging(BaseModel):
    """Tag the piece of text with particular info."""
    sentiment: str = Field(description="sentiment of text, should be `pos`, `neg`, or `neutral`")
    language: str = Field(description="language of text (should be ISO 639-1 code)")

import json
print(json.dumps(convert_pydantic_to_openai_function(Tagging), indent=4))
```
```json
{
    "name": "Tagging",
    "description": "Tag the piece of text with particular info.",
    "parameters": {
        "title": "Tagging",
        "description": "Tag the piece of text with particular info.",
        "type": "object",
        "properties": {
            "sentiment": {
                "title": "Sentiment",
                "description": "sentiment of text, should be `pos`, `neg`, or `neutral`",
                "type": "string"
            },
            "language": {
                "title": "Language",
                "description": "language of text (should be ISO 639-1 code)",
                "type": "string"
            }
        },
        "required": [
            "sentiment",
            "language"
        ]
    }
}
```

```python
from langchain.prompts import ChatPromptTemplate
from langchain.chat_models import ChatOpenAI

model = ChatOpenAI(temperature=0)
tagging_functions = [convert_pydantic_to_openai_function(Tagging)]

prompt = ChatPromptTemplate.from_messages([
    ("system", "Think carefully, and then tag the text as instructed"),
    ("user", "{input}")
])

model_with_functions = model.bind(
    functions=tagging_functions,
    function_call={"name": "Tagging"}
)

tagging_chain = prompt | model_with_functions
tagging_chain.invoke({"input": "I love langchain"})
# AIMessage(content='', additional_kwargs={'function_call': {'name': 'Tagging', 'arguments': '{"sentiment":"pos","language":"en"}'}})

tagging_chain.invoke({"input": "non mi piace questo cibo"})
# AIMessage(content='', additional_kwargs={'function_call': {'name': 'Tagging', 'arguments': '{"sentiment":"neg","language":"it"}'}})
```

```python
from langchain.output_parsers.openai_functions import JsonOutputFunctionsParser

tagging_chain = prompt | model_with_functions | JsonOutputFunctionsParser()
tagging_chain.invoke({"input": "non mi piace questo cibo"})
# {'sentiment': 'neg', 'language': 'it'}
```

### Extraction (提取)
Extraction is similar to tagging, but used for extracting multiple pieces of information. (提取类似于标记，但用于提取多个信息。)

```python
from typing import Optional

class Person(BaseModel):
    """Information about a person."""
    name: str = Field(description="person's name")
    age: Optional[int] = Field(description="person's age")

class Information(BaseModel):
    """Information to extract."""
    people: List[Person] = Field(description="List of info about people")

extraction_functions = [convert_pydantic_to_openai_function(Information)]
extraction_model = model.bind(functions=extraction_functions, function_call={"name": "Information"})

extraction_model.invoke("Joe is 30, his mom is Martha")
# AIMessage(content='', additional_kwargs={'function_call': {'name': 'Information', 'arguments': '{"people":[{"name":"Joe","age":30},{"name":"Martha"}]}'}})

# Extract the relevant information, if not explicitly provided do not guess. Extract partial info. (提取相关信息，如果没有明确提供，请不要猜测。提取部分信息。)
prompt = ChatPromptTemplate.from_messages([
    ("system", "Extract the relevant information, if not explicitly provided do not guess. Extract partial info"),
    ("human", "{input}")
])
extraction_chain = prompt | extraction_model
extraction_chain.invoke({"input": "Joe is 30, his mom is Martha"})
# AIMessage(content='', additional_kwargs={'function_call': {'name': 'Information', 'arguments': '{"people":[{"name":"Joe","age":30},{"name":"Martha"}]}'}})

extraction_chain = prompt | extraction_model | JsonOutputFunctionsParser()
extraction_chain.invoke({"input": "Joe is 30, his mom is Martha"})
# {'people': [{'name': 'Joe', 'age': 30}, {'name': 'Martha'}]}

from langchain.output_parsers.openai_functions import JsonKeyOutputFunctionsParser
extraction_chain = prompt | extraction_model | JsonKeyOutputFunctionsParser(key_name="people")
extraction_chain.invoke({"input": "Joe is 30, his mom is Martha"})
# [{'name': 'Joe', 'age': 30}, {'name': 'Martha'}]
```

### Doing it for real (真实操作)
We can apply tagging to a larger body of text. (我们可以将标记应用于更大的文本体。)

For example, let's load this blog post and extract tag information from a sub-set of the text. (例如，让我们加载这篇博客文章，并从文本的子集中提取标记信息。)

```python
from langchain.document_loaders import WebBaseLoader
loader = WebBaseLoader("https://lilianweng.github.io/posts/2023-06-23-agent/")
documents = loader.load()

doc = documents[0]
page_content = doc.page_content[:10000]
```

```python
class Overview(BaseModel):
    """Overview of a section of text."""
    summary: str = Field(description="Provide a concise summary of the content.")
    language: str = Field(description="Provide the language that the content is written in.")
    keywords: str = Field(description="Provide keywords related to the content.")

overview_tagging_function = [
    convert_pydantic_to_openai_function(Overview)
]
tagging_model = model.bind(
    functions=overview_tagging_function,
    function_call={"name":"Overview"}
)
tagging_chain = prompt | tagging_model | JsonOutputFunctionsParser()

tagging_chain.invoke({"input": page_content})
```
```json
{
    "summary": "This text discusses the concept of building autonomous agents powered by LLM (large language model) as the core controller. It covers components such as planning, memory, and tool use, along with examples and challenges in implementing LLM-powered agents.",
    "language": "English",
    "keywords": "LLM, autonomous agents, planning, memory, tool use, proof-of-concepts, challenges"
}
```

```python
class Paper(BaseModel):
    """Information about papers mentioned."""
    title: str
    author: Optional[str]


class Info(BaseModel):
    """Information to extract"""
    papers: List[Paper]

paper_extraction_function = [
    convert_pydantic_to_openai_function(Info)
]
extraction_model = model.bind(
    functions=paper_extraction_function, 
    function_call={"name":"Info"}
)
extraction_chain = prompt | extraction_model | JsonKeyOutputFunctionsParser(key_name="papers")

extraction_chain.invoke({"input": page_content})
# [{'title': 'LLM Powered Autonomous Agents', 'author': 'Lilian Weng'}]
```

```python
"""
将向您传递一篇文章。从中提取此文章提到的所有论文。
不要提取文章本身的名称。如果没有提到任何论文，那没关系 - 您不需要提取任何内容！只需返回一个空列表。
不要编造或猜测任何额外信息。只提取文本中确切的内容。
"""
template = """A article will be passed to you. Extract from it all papers that are mentioned by this article. 

Do not extract the name of the article itself. If no papers are mentioned that's fine - you don't need to extract any! Just return an empty list.

Do not make up or guess ANY extra information. Only extract what exactly is in the text."""

prompt = ChatPromptTemplate.from_messages([
    ("system", template),
    ("human", "{input}")
])

extraction_chain = prompt | extraction_model | JsonKeyOutputFunctionsParser(key_name="papers")
extraction_chain.invoke({"input": page_content})
"""
[{'title': 'Chain of thought (CoT; Wei et al. 2022)'},
 {'title': 'Tree of Thoughts (Yao et al. 2023)'},
 {'title': 'LLM+P (Liu et al. 2023)'},
 {'title': 'ReAct (Yao et al. 2023)'},
 {'title': 'Reflexion (Shinn & Labash 2023)'},
 {'title': 'Chain of Hindsight (CoH; Liu et al. 2023)'},
 {'title': 'Algorithm Distillation (AD; Laskin et al. 2023)'}]
"""

extraction_chain.invoke({"input": "hi"})
# []
```

```python
from langchain.text_splitter import RecursiveCharacterTextSplitter
text_splitter = RecursiveCharacterTextSplitter(chunk_overlap=0)

splits = text_splitter.split_text(doc.page_content)
len(splits) # 14

def flatten(matrix):
    flat_list = []
    for row in matrix:
        flat_list += row
    return flat_list

flatten([[1, 2], [3, 4]]) # [1, 2, 3, 4]

from langchain.schema.runnable import RunnableLambda
prep = RunnableLambda(
    lambda x: [{"input": doc} for doc in text_splitter.split_text(x)]
)
prep.invoke("hi") # [{'input': 'hi'}]

chain = prep | extraction_chain.map() | flatten
chain.invoke(doc.page_content)
```
```python
[{'title': 'AutoGPT'},
 {'title': 'GPT-Engineer'},
 {'title': 'BabyAGI'},
 {'title': 'Chain of thought'},
 {'title': 'Tree of Thoughts'},
 {'title': 'LLM+P'},
 {'title': 'ReAct'},
 {'title': 'Reflexion'},
 {'title': 'Chain of Hindsight (CoH; Liu et al. 2023)'},
 {'title': 'Algorithm Distillation (AD; Laskin et al. 2023)'},
 {'title': 'Laskin et al. 2023'},
 {'title': 'Miller 1956'},
 {'title': 'Duan et al. 2017'},
 {'title': 'LSH (Locality-Sensitive Hashing)'},
 {'title': 'ANNOY (Approximate Nearest Neighbors Oh Yeah)'},
 {'title': 'HNSW (Hierarchical Navigable Small World)'},
 {'title': 'FAISS (Facebook AI Similarity Search)'},
 {'title': 'ScaNN (Scalable Nearest Neighbors)'},
 {'title': 'MRKL (Karpas et al. 2022)'},
 {'title': 'TALM (Tool Augmented Language Models; Parisi et al. 2022)'},
 {'title': 'Toolformer (Schick et al. 2023)'},
 {'title': 'HuggingGPT (Shen et al. 2023)'},
 {'title': 'API-Bank', 'author': 'Li et al. 2023'},
 {'title': 'ChemCrow', 'author': 'Bran et al. 2023'},
 {'title': 'Boiko et al. (2023)'},
 {'title': 'Generative Agents Simulation (Park, et al. 2023)'},
 {'title': 'Park et al. 2023'},
 {'title': 'GPT-Engineer'},
 {'title': 'A Comprehensive Guide to Machine Learning'},
 {'title': 'Chain of thought prompting elicits reasoning in large language models.'},
 {'title': 'Tree of Thoughts: Deliberate Problem Solving with Large Language Models'},
 {'title': 'Chain of Hindsight Aligns Language Models with Feedback'},
 {'title': 'LLM+P: Empowering Large Language Models with Optimal Planning Proficiency'},
 {'title': 'ReAct: Synergizing reasoning and acting in language models'},
 {'title': 'Reflexion: an autonomous agent with dynamic memory and self-reflection'},
 {'title': 'In-context Reinforcement Learning with Algorithm Distillation'},
 {'title': 'MRKL Systems A modular, neuro-symbolic architecture that combines large language models, external knowledge sources and discrete reasoning.'},
 {'title': 'API-Bank: A Benchmark for Tool-Augmented LLMs'},
 {'title': 'HuggingGPT: Solving AI Tasks with ChatGPT and its Friends in HuggingFace'},
 {'title': 'ChemCrow: Augmenting large-language models with chemistry tools.'},
 {'title': 'Emergent autonomous scientific research capabilities of large language models.'},
 {'title': 'Generative Agents: Interactive Simulacra of Human Behavior'}]
```


## Tools and Routing (工具和路由)
```python
import os
import openai

from dotenv import load_dotenv, find_dotenv
_ = load_dotenv(find_dotenv()) # read local .env file
openai.api_key = os.environ['OPENAI_API_KEY']

from langchain.agents import tool

@tool
def search(query: str) -> str:
    """Search for weather online"""
    return "42f"

search.name        # 'search'
search.description # 'search(query: str) -> str - Search for weather online'
search.args        # {'query': {'title': 'Query', 'type': 'string'}}
search
# StructuredTool(name='search', description='search(query: str) -> str - Search for weather online', args_schema=<class 'pydantic.main.searchSchemaSchema'>, func=<function search at 0x7fb63f2eba60>)
```

```python
from pydantic import BaseModel, Field
class SearchInput(BaseModel):
    query: str = Field(description="Thing to search for")

@tool(args_schema=SearchInput)
def search(query: str) -> str:
    """Search for the weather online."""
    return "42f"

search.args
# {'query': {'title': 'Query',
#   'description': 'Thing to search for',
#   'type': 'string'}}

search.run("sf") # '42f'
```

```python
import requests
from pydantic import BaseModel, Field
import datetime

# Define the input schema
class OpenMeteoInput(BaseModel):
    latitude: float = Field(..., description="Latitude of the location to fetch weather data for")
    longitude: float = Field(..., description="Longitude of the location to fetch weather data for")

@tool(args_schema=OpenMeteoInput)
def get_current_temperature(latitude: float, longitude: float) -> dict:
    """Fetch current temperature for given coordinates."""
    
    BASE_URL = "https://api.open-meteo.com/v1/forecast"
    
    # Parameters for the request
    params = {
        'latitude': latitude,
        'longitude': longitude,
        'hourly': 'temperature_2m',
        'forecast_days': 1,
    }

    # Make the request
    response = requests.get(BASE_URL, params=params)
    
    if response.status_code == 200:
        results = response.json()
    else:
        raise Exception(f"API Request failed with status code: {response.status_code}")

    current_utc_time = datetime.datetime.utcnow()
    time_list = [datetime.datetime.fromisoformat(time_str.replace('Z', '+00:00')) for time_str in results['hourly']['time']]
    temperature_list = results['hourly']['temperature_2m']
    
    closest_time_index = min(range(len(time_list)), key=lambda i: abs(time_list[i] - current_utc_time))
    current_temperature = temperature_list[closest_time_index]
    
    return f'The current temperature is {current_temperature}°C'

get_current_temperature.name        # 'get_current_temperature'
get_current_temperature.description # 'get_current_temperature(latitude: float, longitude: float) -> dict - Fetch current temperature for given coordinates.'
get_current_temperature.args
# {'latitude': {'title': 'Latitude',
#   'description': 'Latitude of the location to fetch weather data for',
#   'type': 'number'},
#  'longitude': {'title': 'Longitude',
#   'description': 'Longitude of the location to fetch weather data for',
#   'type': 'number'}}
```

```python
from langchain.tools.render import format_tool_to_openai_function

```


## 参考资料
- [Functions, Tools and Agents with LangChain](https://learn.deeplearning.ai/courses/functions-tools-agents-langchain)
- [Functions, Tools and Agents with LangChain 中文](https://www.bilibili.com/video/BV1oG411k7HU)
- [DeepLearning.AI - Short Courses](https://www.deeplearning.ai/short-courses/)
