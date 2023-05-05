---
layout: post
title:  "OpenAI API Documentation 快速入门"
date:   2023-04-24 08:00:00 +0800
categories: OpenAI-API
tags: ["OpenAI API", Jupyter, pandas, Quickstart]
---

## 工具
### [Examples](https://platform.openai.com/examples)
### [Playground](https://platform.openai.com/playground)
### [了解标记和概率](https://platform.openai.com/docs/quickstart/adjust-your-settings)
### [分词器工具](https://platform.openai.com/tokenizer)
### [GPT 比较工具](https://gpttools.com/comparisontool)

## 介绍
### 概述
OpenAI API 几乎可以应用于任何涉及理解或生成自然语言、代码或图像的任务。提供一系列具有不同功率级别的模型，适用于不同的任务，并且能够微调您自己的自定义模型。这些模型可用于从内容生成到语义搜索和分类的所有领域。

### 关键概念
#### Prompts
设计提示本质上是您“编程”模型的方式，通常是通过提供一些说明或一些示例。通过 `completions` 和 `chat completions` 端点可用于几乎任何任务，包括内容或代码生成、摘要、扩展、对话、创意写作、风格转换等。

#### Tokens
模型通过将文本分解为标记来理解和处理文本。标记可以是单词或只是字符块。例如，单词“hamburger”被分解为标记“ham”、“bur”和“ger”，而像“pear”这样的短而常见的单词是一个标记。许多标记以空格开头，例如“ hello”和“ bye”。

在给定的 API 请求中处理的令牌数量取决于输入和输出的长度。根据粗略的经验法则，对于英文文本，1 个标记大约为 4 个字符或 0.75 个单词。要记住的一个限制是，您的文本提示和生成的完成组合不能超过模型的最大上下文长度（对于大多数模型，这是 2048 个标记，或大约 1500 个单词）。

* [分词器工具](https://platform.openai.com/tokenizer)

### [Playground](https://platform.openai.com/playground)
#### 了解标记和概率
我们的模型通过将文本分解为称为标记的更小单元来处理文本。标记可以是单词、单词块或单个字符。编辑下面的文本以查看它是如何被标记化的。

`I have an orange cat named Butterscotch.`

`I`` have`` an`` orange`` cat`` named`` But``ters``cot``ch``.`

`像“cat”这样的常用词是单个标记，而不太常用的词通常被分解成多个标记`。例如，“Butterscotch”翻译成四个标记：“But”、“ters”、“cot”和“ch”。`许多标记以空格开头`，例如“ hello”和“ bye”。

`temperature` 通常最好为所需输出明确定义的任务设置较低。较高的 temperature 对于需要多样性或创造力的任务可能很有用。

参考 [了解标记和概率](https://platform.openai.com/docs/quickstart/adjust-your-settings) 有更好图形化展示。

#### Models
API 由一组具有不同功能和价位的模型提供支持。GPT-4 是我们最新、最强大的模型。GPT-3.5-Turbo 是为 ChatGPT 提供支持的模型，并针对对话格式进行了优化。

## 构建您的应用
### [Python 库](https://platform.openai.com/docs/libraries)

安装 Python 库：

```py
pip install openai
```

安装后，您可以使用绑定和您的密钥运行以下命令：

```py
import os
import openai

# Load your API key from an environment variable or secret management service
openai.api_key = os.getenv("OPENAI_API_KEY")

response = openai.Completion.create(model="text-davinci-003", prompt="Say this is a test", temperature=0, max_tokens=7)
```

绑定还将安装一个命令行实用程序，您可以按如下方式使用：

```shell
openai api completions.create -m text-davinci-003 -p "Say this is a test" -t 0 -M 7 --stream
```

## [模型](https://platform.openai.com/docs/models)
### 找到合适的模型
您可以使用 [GPT 比较工具](https://gpttools.com/comparisontool)，让您运行不同的模型来比较输出、设置和响应时间，然后将数据下载到 Excel 电子表格中。

### 审核模型（Moderation）
审核模型旨在检查内容是否符合 OpenAI 的[使用政策](https://openai.com/policies/usage-policies)。这些模型提供了查找以下类别内容的分类功能：仇恨、仇恨/威胁、自残、性、性/未成年人、暴力和暴力/图片。调用审核模型不会消耗您的 API 配额。

* text-moderation-latest
* text-moderation-stable

```py
openai.Moderation.create(input="你不听话就砍死你")
```
```
{
  "id": "modr-7Askon0loMbb6b8vboSQ7Ep8348JA",
  "model": "text-moderation-004",
  "results": [
    {
      "categories": {
        "hate": false,
        "hate/threatening": false,
        "self-harm": false,
        "sexual": false,
        "sexual/minors": false,
        "violence": true,
        "violence/graphic": false
      },
      "category_scores": {
        "hate": 0.06359781324863434,
        "hate/threatening": 4.803388947038911e-05,
        "self-harm": 0.19698172807693481,
        "sexual": 5.2437906560953707e-05,
        "sexual/minors": 1.8810666357893524e-09,
        "violence": 0.9516809582710266,
        "violence/graphic": 1.668629738560412e-05
      },
      "flagged": true
    }
  ]
}
```

```py
response = openai.Moderation.create(input="她们在床上做爱")
print(response["results"][0]["flagged"])
print(response["results"][0]["categories"])
```
```
True
{
  "hate": false,
  "hate/threatening": false,
  "self-harm": false,
  "sexual": true,
  "sexual/minors": false,
  "violence": false,
  "violence/graphic": false
}
```

### 通过 API 查看所有模型

安装依赖的库

```shell
pip install openai
pip install pandas
pip install tabulate
```

下面代码在 Jupyter Notebook 中开发的：

```py
import os
import openai

import pandas as pd

# 设置 pandas 显示所有列
pd.options.display.max_rows = None
pd.options.display.max_columns = None
pd.options.display.max_colwidth = None
pd.options.display.width = None

openai.api_key = os.getenv('OPENAI_API_KEY')

# list models
models = openai.Model.list()

# JSON 格式转换为 DataFrame
df = pd.json_normalize(models['data'], ['permission'], record_prefix='permission_', meta=['id', 'created'], sep='_', errors='ignore')

# 移除不需要的列
df = df.drop(columns=['permission_id', 'permission_object', 'permission_created', 'permission_allow_create_engine', 
                      'permission_allow_sampling', 'permission_allow_logprobs', 'permission_allow_view', 'permission_organization', 
                      'permission_group', 'permission_is_blocking'])

# 转换时间戳
df['created'] = pd.to_datetime(df['created'], unit='s')

# 按照创建时间排序
df.sort_values(by=['created'], inplace=True, ascending=True)

# 重置索引
df.reset_index(drop=True, inplace=True)

# 调整显示列的顺序
df = df[['id', 'created', 'permission_allow_search_indices', 'permission_allow_fine_tuning']]

df
```

* [pandas.json_normalize](https://pandas.pydata.org/docs/reference/api/pandas.json_normalize.html)

DataFrame 转换为 Markdown

```py
df.to_markdown()
```

|    | id                            | created             | permission_allow_search_indices   | permission_allow_fine_tuning   |
|---:|:------------------------------|:--------------------|:----------------------------------|:-------------------------------|
|  0 | cushman:2020-05-03            | 2020-05-28 00:18:30 |                                   | True                           |
|  1 | ada:2020-05-03                | 2020-12-10 20:20:25 |                                   |                                |
|  2 | babbage:2020-05-03            | 2020-12-10 20:36:51 |                                   |                                |
|  3 | curie:2020-05-03              | 2020-12-10 20:38:45 |                                   |                                |
|  4 | davinci:2020-05-03            | 2020-12-10 22:42:43 |                                   |                                |
|  5 | if-curie-v2                   | 2021-01-15 21:26:08 |                                   |                                |
|  6 | if-davinci-v2                 | 2021-01-15 21:26:30 |                                   |                                |
|  7 | if-davinci:3.0.0              | 2021-08-20 00:52:35 |                                   | True                           |
|  8 | davinci-if:3.0.0              | 2021-08-20 22:21:10 |                                   | True                           |
|  9 | davinci-instruct-beta:2.0.0   | 2021-08-20 23:25:14 |                                   | True                           |
| 10 | text-davinci:001              | 2022-01-11 23:32:46 |                                   |                                |
| 11 | text-ada:001                  | 2022-01-12 01:06:48 |                                   |                                |
| 12 | text-curie:001                | 2022-01-12 02:37:27 |                                   |                                |
| 13 | text-babbage:001              | 2022-01-12 20:12:50 |                                   |                                |
| 14 | ada                           | 2022-04-07 18:51:31 |                                   |                                |
| 15 | babbage                       | 2022-04-07 19:07:29 |                                   |                                |
| 16 | davinci                       | 2022-04-07 19:31:14 |                                   |                                |
| 17 | curie                         | 2022-04-07 19:31:14 |                                   |                                |
| 18 | text-davinci-001              | 2022-04-07 20:40:42 |                                   |                                |
| 19 | text-ada-001                  | 2022-04-07 20:40:42 |                                   |                                |
| 20 | curie-instruct-beta           | 2022-04-07 20:40:42 |                                   |                                |
| 21 | davinci-instruct-beta         | 2022-04-07 20:40:42 |                                   |                                |
| 22 | text-curie-001                | 2022-04-07 20:40:43 |                                   |                                |
| 23 | text-babbage-001              | 2022-04-07 20:40:43 |                                   |                                |
| 24 | text-davinci-edit-001         | 2022-04-13 00:19:39 |                                   |                                |
| 25 | code-davinci-edit-001         | 2022-04-13 20:08:04 |                                   |                                |
| 26 | text-davinci-002              | 2022-04-13 20:08:04 |                                   |                                |
| 27 | text-search-ada-query-001     | 2022-04-28 19:01:45 | True                              |                                |
| 28 | text-search-davinci-doc-001   | 2022-04-28 19:01:45 | True                              |                                |
| 29 | babbage-similarity            | 2022-04-28 19:01:45 | True                              |                                |
| 30 | ada-code-search-code          | 2022-04-28 19:01:45 | True                              |                                |
| 31 | text-search-davinci-query-001 | 2022-04-28 19:01:45 | True                              |                                |
| 32 | text-similarity-davinci-001   | 2022-04-28 19:01:45 | True                              |                                |
| 33 | davinci-search-query          | 2022-04-28 19:01:45 | True                              |                                |
| 34 | text-similarity-ada-001       | 2022-04-28 19:01:45 | True                              |                                |
| 35 | text-similarity-babbage-001   | 2022-04-28 19:01:45 | True                              |                                |
| 36 | ada-search-query              | 2022-04-28 19:01:45 | True                              |                                |
| 37 | code-search-babbage-text-001  | 2022-04-28 19:01:47 | True                              |                                |
| 38 | code-search-babbage-code-001  | 2022-04-28 19:01:47 | True                              |                                |
| 39 | text-search-ada-doc-001       | 2022-04-28 19:01:47 | True                              |                                |
| 40 | ada-similarity                | 2022-04-28 19:01:47 | True                              |                                |
| 41 | code-search-ada-text-001      | 2022-04-28 19:01:47 | True                              |                                |
| 42 | text-similarity-curie-001     | 2022-04-28 19:01:47 | True                              |                                |
| 43 | ada-search-document           | 2022-04-28 19:01:47 | True                              |                                |
| 44 | code-search-ada-code-001      | 2022-04-28 19:01:47 | True                              |                                |
| 45 | curie-search-document         | 2022-04-28 19:01:48 | True                              |                                |
| 46 | curie-search-query            | 2022-04-28 19:01:49 | True                              |                                |
| 47 | text-search-babbage-query-001 | 2022-04-28 19:01:49 | True                              |                                |
| 48 | davinci-similarity            | 2022-04-28 19:01:49 | True                              |                                |
| 49 | text-search-curie-query-001   | 2022-04-28 19:01:49 | True                              |                                |
| 50 | text-search-babbage-doc-001   | 2022-04-28 19:01:49 | True                              |                                |
| 51 | babbage-code-search-text      | 2022-04-28 19:01:49 | True                              |                                |
| 52 | text-search-curie-doc-001     | 2022-04-28 19:01:49 | True                              |                                |
| 53 | babbage-code-search-code      | 2022-04-28 19:01:49 | True                              |                                |
| 54 | davinci-search-document       | 2022-04-28 19:01:49 | True                              |                                |
| 55 | babbage-search-query          | 2022-04-28 19:01:49 | True                              |                                |
| 56 | babbage-search-document       | 2022-04-28 19:01:50 | True                              |                                |
| 57 | ada-code-search-text          | 2022-04-28 19:01:50 | True                              |                                |
| 58 | curie-similarity              | 2022-04-28 19:01:50 | True                              |                                |
| 59 | text-davinci-003              | 2022-11-28 01:40:35 |                                   |                                |
| 60 | text-embedding-ada-002        | 2022-12-16 19:01:39 | True                              |                                |
| 61 | whisper-1                     | 2023-02-27 21:13:04 |                                   |                                |
| 62 | gpt-3.5-turbo                 | 2023-02-28 18:56:42 |                                   |                                |
| 63 | gpt-3.5-turbo-0301            | 2023-03-01 05:52:43 |                                   |                                |
