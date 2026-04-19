---
layout: single
title:  "ChatGPT Prompt Engineering for Developers"
date:   2023-05-28 08:00:00 +0800
categories: Prompt
tags: [ChatGPT, DeepLearning.AI]
---

[ChatGPT Prompt Engineering for Developers](https://www.deeplearning.ai/short-courses/chatgpt-prompt-engineering-for-developers/) 由Isa Fulford（OpenAI）和Andrew Ng（DeepLearning.AI）教授的课程将描述 LLM 的工作原理，提供快速工程的最佳实践，并展示 LLM API 如何用于各种任务的应用程序。

[面向开发人员的 ChatGPT 提示工程](https://www.bilibili.com/video/BV1Z14y1Z7LJ)

## Instroduction（介绍）


## Guidelines（准则）

### 帮助函数
```py
import openai
import os

openai.api_key  = os.getenv('OPENAI_API_KEY')

def get_completion(prompt, model="gpt-3.5-turbo"):
    messages = [{"role": "user", "content": prompt}]
    response = openai.ChatCompletion.create(
        model=model,
        messages=messages,
        temperature=0, # this is the degree of randomness of the model's output
    )
    return response.choices[0].message["content"]
```

### Prompting Principles（提示原则）
#### Principle 1: Write clear and specific instructions（编写清晰具体的指令）

##### Tactic 1: Use delimiters to clearly indicate distinct parts of the input（使用分隔符清晰地表示输入的不同部分）
- Delimiters can be anything like: ```, """, < >, `<tag> </tag>`, `:`

英文
```py
text = f"""
You should express what you want a model to do by \ 
providing instructions that are as clear and \ 
specific as you can possibly make them. \ 
This will guide the model towards the desired output, \ 
and reduce the chances of receiving irrelevant \ 
or incorrect responses. Don't confuse writing a \ 
clear prompt with writing a short prompt. \ 
In many cases, longer prompts provide more clarity \ 
and context for the model, which can lead to \ 
more detailed and relevant outputs.
"""
prompt = f"""
Summarize the text delimited by triple backticks \ 
into a single sentence.
```{text}```
"""
response = get_completion(prompt)
print(response)
```
```
Clear and specific instructions should be provided to guide a model towards the desired output, and longer prompts can provide more clarity and context for the model, leading to more detailed and relevant outputs.
```

中文
```py
text = f"""
您应该通过提供尽可能清晰和具体的说明来表达您希望模型执行的操作。这将引导模型获得所需的输出，并减少收到不相关或不正确响应的机会。不要将清晰的提示与简短的提示混淆。在许多情况下，更长的提示可以为模型提供更多的清晰度和上下文，这可以导致更详细和相关的输出。
"""
prompt = f"""
将由三个反引号分隔的文本总结成一个句子。
```{text}```
"""
response = get_completion(prompt)
print(response)
```
```
提供清晰具体的说明可以引导模型获得所需输出，减少不正确响应的机会，不要混淆清晰和简短的提示，更长的提示可以为模型提供更多清晰度和上下文，导致更详细和相关的输出。
```

**英文总结的更简洁**

##### Tactic 2: Ask for a structured output（要求结构化输出）
- JSON, HTML

英文
```py
prompt = f"""
Generate a list of three made-up book titles along \ 
with their authors and genres. 
Provide them in JSON format with the following keys: 
book_id, title, author, genre.
"""
response = get_completion(prompt)
print(response)
```
```
[
  {
    "book_id": 1,
    "title": "The Lost City of Zorath",
    "author": "Aria Blackwood",
    "genre": "Fantasy"
  },
  {
    "book_id": 2,
    "title": "The Last Survivors",
    "author": "Ethan Stone",
    "genre": "Science Fiction"
  },
  {
    "book_id": 3,
    "title": "The Secret Life of Bees",
    "author": "Lila Rose",
    "genre": "Romance"
  }
]
```

中文
```py
prompt = f"""
生成三个虚构的书名及其作者和类型的列表。
使用以下键以 JSON 格式提供它们：book_id、title、author、genre。
"""
response = get_completion(prompt)
print(response)
```
```
{
  "books": [
    {
      "book_id": 1,
      "title": "The Lost City",
      "author": "Samantha Lee",
      "genre": "Adventure"
    },
    {
      "book_id": 2,
      "title": "The Secret Society",
      "author": "David Chen",
      "genre": "Mystery"
    },
    {
      "book_id": 3,
      "title": "The Last Hope",
      "author": "Emily Wang",
      "genre": "Science Fiction"
    }
  ]
}
```

```py
prompt = f"""
生成三个虚构的书名及其作者和类型的列表。
使用以下键以JSON格式输出：book_id, title, author, genre
"""
response = get_completion(prompt)
print(response)
```
```
1. {"book_id": 1, "title": "The Lost City", "author": "Samantha Lee", "genre": "Adventure"}
2. {"book_id": 2, "title": "The Secret Garden", "author": "Emily Davis", "genre": "Fantasy"}
3. {"book_id": 3, "title": "The Last Hope", "author": "Jacob Smith", "genre": "Science Fiction"}
```

```py
prompt = f"""
生成三个虚构的书籍对象列表。
每本书籍提供下列键以JSON格式输出：book_id, title, author, genre
"""
response = get_completion(prompt)
print(response)
```
```
1. {
   "book_id": 1,
   "title": "The Lost City",
   "author": "Emily Smith",
   "genre": "Adventure"
}

2. {
   "book_id": 2,
   "title": "The Secret Garden",
   "author": "Sophie Brown",
   "genre": "Children's Literature"
}

3. {
   "book_id": 3,
   "title": "The Last Hope",
   "author": "David Lee",
   "genre": "Science Fiction"
}
```

```py
prompt = f"""
生成三个虚构的书名及其作者和类型的列表。
使用以下键以JSON格式提供它们：book_id、title、author、genre
"""
response = get_completion(prompt)
print(response)
```
```
{
  "books": [
    {
      "book_id": 1,
      "title": "The Lost City",
      "author": "Samantha Green",
      "genre": "Adventure"
    },
    {
      "book_id": 2,
      "title": "The Secret Society",
      "author": "Oliver Black",
      "genre": "Mystery"
    },
    {
      "book_id": 3,
      "title": "The Last Hope",
      "author": "Emily White",
      "genre": "Science Fiction"
    }
  ]
}
```

```py
prompt = f"""
生成三个虚构的书名及其作者和类型的列表。
使用JSON格式提供，包含以下键：book_id、title、author、genre
"""
response = get_completion(prompt)
print(response)
```
```
{
  "books": [
    {
      "book_id": 1,
      "title": "The Lost City",
      "author": "Emily Johnson",
      "genre": "Adventure"
    },
    {
      "book_id": 2,
      "title": "The Secret Garden",
      "author": "Sophie Lee",
      "genre": "Fantasy"
    },
    {
      "book_id": 3,
      "title": "The Last Hope",
      "author": "David Chen",
      "genre": "Science Fiction"
    }
  ]
}
```

**这个提示真不好写啊。通过测试发现，"它们"和"、"都是关键的。**
使用以下键以JSON格式提供`它们`：book_id`、`title`、`author`、`genre

##### Tactic 3: Ask the model to check whether conditions are satisfied（要求模型检查条件是否满足）

英文
```py
text_1 = f"""
Making a cup of tea is easy! First, you need to get some \ 
water boiling. While that's happening, \ 
grab a cup and put a tea bag in it. Once the water is \ 
hot enough, just pour it over the tea bag. \ 
Let it sit for a bit so the tea can steep. After a \ 
few minutes, take out the tea bag. If you \ 
like, you can add some sugar or milk to taste. \ 
And that's it! You've got yourself a delicious \ 
cup of tea to enjoy.
"""
prompt = f"""
You will be provided with text delimited by triple quotes. 
If it contains a sequence of instructions, \ 
re-write those instructions in the following format:

Step 1 - ...
Step 2 - …
…
Step N - …

If the text does not contain a sequence of instructions, \ 
then simply write \"No steps provided.\"

\"\"\"{text_1}\"\"\"
"""
response = get_completion(prompt)
print("Completion for Text 1:")
print(response)
```
```
Completion for Text 1:
Step 1 - Get some water boiling.
Step 2 - Grab a cup and put a tea bag in it.
Step 3 - Once the water is hot enough, pour it over the tea bag.
Step 4 - Let it sit for a bit so the tea can steep.
Step 5 - After a few minutes, take out the tea bag.
Step 6 - Add some sugar or milk to taste.
Step 7 - Enjoy your delicious cup of tea!
```

中文
```py
text_1 = f"""
泡一杯茶很简单！ 首先，你需要把水烧开。当发生这种情况时，拿起一个杯子并在其中放入一个茶包。\
一旦水足够热，就把它倒在茶包上。让它静置一会儿，这样茶就可以陡峭了。几分钟后，取出茶包。\
如果你喜欢，你可以加一些糖或牛奶来调味。就是这样！ 您已经为自己准备了一杯美味的茶来享用。
"""
prompt = f"""
您将获得由三重引号分隔的文本。
如果它包含一系列指令，请按以下格式重写这些指令：

第1步 - ...
第2步 - …
…
第N步 - …

如果文本不包含一系列指令，则只需写下“未提供步骤。”

\"\"\"{text_1}\"\"\"
"""
response = get_completion(prompt)
print("文本 1 的完成：")
print(response)
```
```
文本 1 的完成：
第1步 - 把水烧开。
第2步 - 拿起一个杯子并在其中放入一个茶包。
第3步 - 一旦水足够热，就把它倒在茶包上。
第4步 - 让它静置一会儿，这样茶就可以陡峭了。
第5步 - 几分钟后，取出茶包。
第6步 - 如果你喜欢，你可以加一些糖或牛奶来调味。
第7步 - 就是这样！ 您已经为自己准备了一杯美味的茶来享用。
```

英文
```py
text_2 = f"""
The sun is shining brightly today, and the birds are \
singing. It's a beautiful day to go for a \ 
walk in the park. The flowers are blooming, and the \ 
trees are swaying gently in the breeze. People \ 
are out and about, enjoying the lovely weather. \ 
Some are having picnics, while others are playing \ 
games or simply relaxing on the grass. It's a \ 
perfect day to spend time outdoors and appreciate the \ 
beauty of nature.
"""
prompt = f"""
You will be provided with text delimited by triple quotes. 
If it contains a sequence of instructions, \ 
re-write those instructions in the following format:

Step 1 - ...
Step 2 - …
…
Step N - …

If the text does not contain a sequence of instructions, \ 
then simply write \"No steps provided.\"

\"\"\"{text_2}\"\"\"
"""
response = get_completion(prompt)
print("Completion for Text 2:")
print(response)
```
```
Completion for Text 2:
No steps provided.
```

中文
```py
text_2 = f"""
今天阳光灿烂，鸟儿在歌唱。\
这是去公园散步的好天气。 鲜花盛开，树木在微风中轻轻摇曳。\
人们出门在外，享受着宜人的天气。\
有的在野餐，有的在玩游戏，有的在草地上放松。\
这是在户外度过时光并欣赏大自然之美的完美日子。
"""
prompt = f"""
您将获得由三重引号分隔的文本。
如果它包含一系列指令，请按以下格式重写这些指令：

第1步 - ...
第2步 - …
…
第N步 - …

如果文本不包含一系列指令，则只需写下“未提供步骤。”

\"\"\"{text_2}\"\"\"
"""
response = get_completion(prompt)
print("文本 2 的完成：")
print(response)
```
```
文本 2 的完成：
未提供步骤。
```

##### Tactic 4: "Few-shot" prompting（少样本提示）

英文
```py
prompt = f"""
Your task is to answer in a consistent style.

<child>: Teach me about patience.

<grandparent>: The river that carves the deepest \ 
valley flows from a modest spring; the \ 
grandest symphony originates from a single note; \ 
the most intricate tapestry begins with a solitary thread.

<child>: Teach me about resilience.
"""
response = get_completion(prompt)
print(response)
```
```
<grandparent>: Resilience is like a tree that bends with the wind but never breaks. It is the ability to bounce back from adversity and keep moving forward, even when things get tough. Just like a tree that grows stronger with each storm it weathers, resilience is a quality that can be developed and strengthened over time.
```

中文
```py
prompt = f"""
你的任务是以一致的风格回答问题。

<孩子>: 教我耐心。

<祖父母>: 挖出最深峡谷的河流源于一处不起眼的泉眼；最宏伟的交响乐从单一的音符开始；最复杂的挂毯以一根孤独的线开始编织。

<孩子>: 教我韧性。
"""
response = get_completion(prompt)
print(response)
```
```
<祖父母>: 韧性就像是一棵树，它需要经历风吹雨打、日晒风干，才能成长得更加坚强。所以，当你遇到挫折和困难时，不要轻易放弃，要坚持下去，相信自己的能力和潜力，最终你会成为一棵茁壮成长的大树。
```

#### Principle 2: Give the model time to “think”（给模型时间“思考”）
##### Tactic 1: Specify the steps required to complete a task（指定完成任务所需的步骤）

英文
```py
text = f"""
In a charming village, siblings Jack and Jill set out on \ 
a quest to fetch water from a hilltop \ 
well. As they climbed, singing joyfully, misfortune \ 
struck—Jack tripped on a stone and tumbled \ 
down the hill, with Jill following suit. \ 
Though slightly battered, the pair returned home to \ 
comforting embraces. Despite the mishap, \ 
their adventurous spirits remained undimmed, and they \ 
continued exploring with delight.
"""
# example 1
prompt_1 = f"""
Perform the following actions: 
1 - Summarize the following text delimited by triple \
backticks with 1 sentence.
2 - Translate the summary into French.
3 - List each name in the French summary.
4 - Output a json object that contains the following \
keys: french_summary, num_names.

Separate your answers with line breaks.

Text:
```{text}```
"""
response = get_completion(prompt_1)
print("Completion for prompt 1:")
print(response)
```
```
Completion for prompt 1:
Two siblings, Jack and Jill, go on a quest to fetch water from a well on a hilltop, but misfortune strikes and they both tumble down the hill, returning home slightly battered but with their adventurous spirits undimmed.

Deux frères et sœurs, Jack et Jill, partent en quête d'eau d'un puits sur une colline, mais un malheur frappe et ils tombent tous les deux de la colline, rentrant chez eux légèrement meurtris mais avec leurs esprits aventureux intacts. 
Noms: Jack, Jill.

{
  "french_summary": "Deux frères et sœurs, Jack et Jill, partent en quête d'eau d'un puits sur une colline, mais un malheur frappe et ils tombent tous les deux de la colline, rentrant chez eux légèrement meurtris mais avec leurs esprits aventureux intacts.",
  "num_names": 2
}
```

中文
```py
text = f"""
In a charming village, siblings Jack and Jill set out on \ 
a quest to fetch water from a hilltop \ 
well. As they climbed, singing joyfully, misfortune \ 
struck—Jack tripped on a stone and tumbled \ 
down the hill, with Jill following suit. \ 
Though slightly battered, the pair returned home to \ 
comforting embraces. Despite the mishap, \ 
their adventurous spirits remained undimmed, and they \ 
continued exploring with delight.
"""
# example 1
prompt_1 = f"""
执行以下操作：
1 - 用一句话总结以下用三重反引号分隔的文本。
2 - 将摘要翻译成中文。
3 - 在中文摘要中列出每个名字。
4 - 输出包含以下键的 json 对象：chinese_summary、num_names。

用换行符分隔你的答案。

文本:
```{text}```
"""
response = get_completion(prompt_1)
print("完成提示 1:")
print(response)
```
```
完成提示 1:
1 - 兄妹俩在追求水源的过程中遭遇不幸，但他们的冒险精神仍然不减。
2 - 在一个迷人的村庄里，兄妹俩杰克和吉尔出发去山顶的井里取水。当他们欢快地唱着歌爬上山时，不幸降临了——杰克绊倒在一块石头上，滚下山去，吉尔也跟着摔了下来。虽然有些受伤，但他们还是回到了家里，得到了安慰的拥抱。尽管发生了不幸，他们的冒险精神仍然不减，继续愉快地探索。
3 - Jack、Jill
4 - {"chinese_summary": "在一个迷人的村庄里，兄妹俩杰克和吉尔出发去山顶的井里取水。当他们欢快地唱着歌爬上山时，不幸降临了——杰克绊倒在一块石头上，滚下山去，吉尔也跟着摔了下来。虽然有些受伤，但他们还是回到了家里，得到了安慰的拥抱。尽管发生了不幸，他们的冒险精神仍然不减，继续愉快地探索。", "num_names": 2}
```

在 `1 - 一句话总结以下用三重反引号分隔的文本。` 中没有明确说明总结的这句话是摘要。

```py
text = f"""
In a charming village, siblings Jack and Jill set out on \ 
a quest to fetch water from a hilltop \ 
well. As they climbed, singing joyfully, misfortune \ 
struck—Jack tripped on a stone and tumbled \ 
down the hill, with Jill following suit. \ 
Though slightly battered, the pair returned home to \ 
comforting embraces. Despite the mishap, \ 
their adventurous spirits remained undimmed, and they \ 
continued exploring with delight.
"""
# example 1
prompt_1 = f"""
执行以下操作：
1 - 用一句话总结以下用三重反引号分隔的文本生成摘要。
2 - 将摘要翻译成中文。
3 - 在中文摘要中列出每个名字。
4 - 输出包含以下键的 json 对象：chinese_summary、num_names。

用换行符分隔你的答案。

文本:
```{text}```
"""
response = get_completion(prompt_1)
print("完成提示 1:")
print(response)
```
```
完成提示 1:
1 - Siblings Jack and Jill go on a quest for water, but misfortune strikes and they tumble down a hill. Despite this, they remain adventurous and continue exploring.
2 - 兄妹杰克和吉尔前往山顶井取水，但不幸摔倒滚下山坡。尽管如此，他们仍然充满冒险精神，继续探索。
3 - Jack、Jill
4 - {
    "chinese_summary": "兄妹杰克和吉尔前往山顶井取水，但不幸摔倒滚下山坡。尽管如此，他们仍然充满冒险精神，继续探索。",
    "num_names": 2
}
```

任务 3 找出来的名字是英文的，说明没有在中文摘要中查找。

```py
text = f"""
In a charming village, siblings Jack and Jill set out on \ 
a quest to fetch water from a hilltop \ 
well. As they climbed, singing joyfully, misfortune \ 
struck—Jack tripped on a stone and tumbled \ 
down the hill, with Jill following suit. \ 
Though slightly battered, the pair returned home to \ 
comforting embraces. Despite the mishap, \ 
their adventurous spirits remained undimmed, and they \ 
continued exploring with delight.
"""
# example 1
prompt_1 = f"""
执行以下操作：
1 - 用一句话总结以下用三重反引号分隔的文本生成摘要。
2 - 将摘要翻译成中文。
3 - 在中文中列出每个名字。
4 - 输出包含以下键的 json 对象：chinese_summary、num_names。

用换行符分隔你的答案。

文本:
```{text}```
"""
response = get_completion(prompt_1)
print("完成提示 1:")
print(response)
```
```
完成提示 1:
1 - Siblings Jack and Jill go on a quest for water, but misfortune strikes. Despite this, they remain adventurous and continue exploring.
2 - 兄妹杰克和吉尔出发去寻找水源，但不幸降临。尽管如此，他们仍然保持着冒险精神，继续探索。
3 - 杰克、吉尔
4 - {"chinese_summary": "兄妹杰克和吉尔出发去寻找水源，但不幸降临。尽管如此，他们仍然保持着冒险精神，继续探索。", "num_names": 2}
```

##### Ask for output in a specified format（请求指定格式的输出）

英文
```py
prompt_2 = f"""
Your task is to perform the following actions: 
1 - Summarize the following text delimited by 
  <> with 1 sentence.
2 - Translate the summary into French.
3 - List each name in the French summary.
4 - Output a json object that contains the 
  following keys: french_summary, num_names.

Use the following format:
Text: <text to summarize>
Summary: <summary>
Translation: <summary translation>
Names: <list of names in Italian summary>
Output JSON: <json with summary and num_names>

Text: <{text}>
"""
response = get_completion(prompt_2)
print("\nCompletion for prompt 2:")
print(response)
```

```
Completion for prompt 2:
Summary: Jack and Jill go on a quest to fetch water, but misfortune strikes and they tumble down the hill, returning home slightly battered but with their adventurous spirits undimmed. 
Translation: Jack et Jill partent en quête d'eau, mais la malchance frappe et ils dégringolent la colline, rentrant chez eux légèrement meurtris mais avec leurs esprits aventureux intacts.
Names: Jack, Jill
Output JSON: {"french_summary": "Jack et Jill partent en quête d'eau, mais la malchance frappe et ils dégringolent la colline, rentrant chez eux légèrement meurtris mais avec leurs esprits aventureux intacts.", "num_names": 2}
```

中文
```py
prompt_2 = f"""
您的任务是执行以下操作：
1 - 使用一句话总结以下由 <> 分隔的文本为摘要。
2 - 将摘要翻译成中文。
3 - 在中文摘要中列出每个名字。
4 - 输出一个包含以下键：chinese_summary、num_names。

使用以下格式：
文本：<要总结摘要的文本>
摘要：<摘要>
翻译：<中文摘要>
姓名：<中文摘要中的姓名列表>
JSON：<带有 chinese_summary 和 num_names 的 json>

文本: <{text}>
"""
response = get_completion(prompt_2)
print("\n提示完成 2:")
print(response)
```
```
提示完成 2:
摘要：Jack和Jill在一个迷人的村庄里出发去山顶的井里取水，途中不幸摔倒，但他们的冒险精神仍然不减，继续愉快地探索。

翻译：在一个迷人的村庄里，兄妹Jack和Jill出发去山顶的井里取水。途中不幸摔倒，但他们的冒险精神仍然不减，继续愉快地探索。 

姓名：Jack、Jill

JSON：{"chinese_summary": "在一个迷人的村庄里，兄妹Jack和Jill出发去山顶的井里取水。途中不幸摔倒，但他们的冒险精神仍然不减，继续愉快地探索。", "num_names": 2}
```

##### Tactic 2: Instruct the model to work out its own solution before rushing to a conclusion（在匆忙得出结论之前指示模型制定出自己的解决方案）

英文
```py
prompt = f"""
Determine if the student's solution is correct or not.

Question:
I'm building a solar power installation and I need \
 help working out the financials. 
- Land costs $100 / square foot
- I can buy solar panels for $250 / square foot
- I negotiated a contract for maintenance that will cost \ 
me a flat $100k per year, and an additional $10 / square \
foot
What is the total cost for the first year of operations 
as a function of the number of square feet.

Student's Solution:
Let x be the size of the installation in square feet.
Costs:
1. Land cost: 100x
2. Solar panel cost: 250x
3. Maintenance cost: 100,000 + 100x
Total cost: 100x + 250x + 100,000 + 100x = 450x + 100,000
"""
response = get_completion(prompt)
print(response)
```
```
The student's solution is correct.
```

中文
```py
prompt = f"""
判断学生的答案是否正确，使用中文回答。

Question:
I'm building a solar power installation and I need \
 help working out the financials. 
- Land costs $100 / square foot
- I can buy solar panels for $250 / square foot
- I negotiated a contract for maintenance that will cost \ 
me a flat $100k per year, and an additional $10 / square \
foot
What is the total cost for the first year of operations 
as a function of the number of square feet.

Student's Solution:
Let x be the size of the installation in square feet.
Costs:
1. Land cost: 100x
2. Solar panel cost: 250x
3. Maintenance cost: 100,000 + 100x
Total cost: 100x + 250x + 100,000 + 100x = 450x + 100,000
"""
response = get_completion(prompt)
print(response)
```
```
学生的答案是正确的。
```

注意，同学的解法其实是不正确的。

我们可以通过指示模型首先计算出自己的解决方案来解决这个问题。

英文
```py
prompt = f"""
Your task is to determine if the student's solution \
is correct or not.
To solve the problem do the following:
- First, work out your own solution to the problem. 
- Then compare your solution to the student's solution \ 
and evaluate if the student's solution is correct or not. 
Don't decide if the student's solution is correct until 
you have done the problem yourself.

Use the following format:
Question:
```
question here
```
Student's solution:
```
student's solution here
```
Actual solution:
```
steps to work out the solution and your solution here
```
Is the student's solution the same as actual solution \
just calculated:
```
yes or no
```
Student grade:
```
correct or incorrect
```

Question:
```
I'm building a solar power installation and I need help \
working out the financials. 
- Land costs $100 / square foot
- I can buy solar panels for $250 / square foot
- I negotiated a contract for maintenance that will cost \
me a flat $100k per year, and an additional $10 / square \
foot
What is the total cost for the first year of operations \
as a function of the number of square feet.
``` 
Student's solution:
```
Let x be the size of the installation in square feet.
Costs:
1. Land cost: 100x
2. Solar panel cost: 250x
3. Maintenance cost: 100,000 + 100x
Total cost: 100x + 250x + 100,000 + 100x = 450x + 100,000
```
Actual solution:
"""
response = get_completion(prompt)
print(response)
```

```
Let x be the size of the installation in square feet.

Costs:
1. Land cost: 100x
2. Solar panel cost: 250x
3. Maintenance cost: 100,000 + 10x

Total cost: 100x + 250x + 100,000 + 10x = 360x + 100,000

Is the student's solution the same as actual solution just calculated:
No

Student grade:
Incorrect
```

中文
```py
prompt = f"""
您的任务是确定学生的解决方案是否正确。
要解决此问题，请执行以下操作：
- 首先，制定您的解决方案。
- 然后将您的解决方案与学生的解决方案进行比较，并评估学生的解决方案是否正确。
在您自己完成解决方案之前，不要判断学生的解决方案是否正确。

使用以下格式：
问题：
```
在这里提问
```
学生的解决方案：
```
学生的解决方案在这里
```
实际解决方案：
```
在此处制定您的解决方案的步骤
```
学生的解是否与刚刚计算的实际解相同：
```
是/不是
```
学生成绩：
```
正确/不正确
```

问题：
```
I'm building a solar power installation and I need help \
working out the financials. 
- Land costs $100 / square foot
- I can buy solar panels for $250 / square foot
- I negotiated a contract for maintenance that will cost \
me a flat $100k per year, and an additional $10 / square \
foot
What is the total cost for the first year of operations \
as a function of the number of square feet.
``` 
学生的解决方案：
```
Let x be the size of the installation in square feet.
Costs:
1. Land cost: 100x
2. Solar panel cost: 250x
3. Maintenance cost: 100,000 + 100x
Total cost: 100x + 250x + 100,000 + 100x = 450x + 100,000
```
实际解决方案：
"""
response = get_completion(prompt)
print(response)
```

```
1. 计算每平方英尺的总成本：100 + 250 + 10 = 360美元
2. 将每平方英尺的总成本乘以安装的平方英尺数：360x
3. 将维护成本添加到总成本中：360x + 100,000
学生的解是否与刚刚计算的实际解相同：
不是
学生成绩：
不正确
```

### Model Limitations: Hallucinations（模型局限性：幻觉）
- Boie 是一家真实的公司，产品名称不是真实的。

英文
```py
prompt = f"""
Tell me about AeroGlide UltraSlim Smart Toothbrush by Boie
"""
response = get_completion(prompt)
print(response)
```

The AeroGlide UltraSlim Smart Toothbrush by Boie is a high-tech toothbrush that uses advanced sonic technology to provide a deep and thorough clean. It features a slim and sleek design that makes it easy to hold and maneuver, and it comes with a range of smart features that help you optimize your brushing routine.

One of the key features of the AeroGlide UltraSlim Smart Toothbrush is its advanced sonic technology, which uses high-frequency vibrations to break up plaque and bacteria on your teeth and gums. This technology is highly effective at removing even the toughest stains and buildup, leaving your teeth feeling clean and refreshed.

In addition to its sonic technology, the AeroGlide UltraSlim Smart Toothbrush also comes with a range of smart features that help you optimize your brushing routine. These include a built-in timer that ensures you brush for the recommended two minutes, as well as a pressure sensor that alerts you if you're brushing too hard.

Overall, the AeroGlide UltraSlim Smart Toothbrush by Boie is a highly advanced and effective toothbrush that is perfect for anyone looking to take their oral hygiene to the next level. With its advanced sonic technology and smart features, it provides a deep and thorough clean that leaves your teeth feeling fresh and healthy.

中文
```py
prompt = f"""
告诉我有关 Boie 的 AeroGlide UltraSlim 智能牙刷的信息
"""
response = get_completion(prompt)
print(response)
```

Boie的AeroGlide UltraSlim智能牙刷是一款高科技的电动牙刷，采用了先进的声波技术，能够提供高效的清洁效果。该牙刷的刷头非常细小，能够轻松进入牙缝和牙龈，清洁效果非常出色。此外，该牙刷还配备了智能感应技术，能够自动调节清洁力度和时间，让你的牙齿更加健康。该牙刷还具有防水设计，可以在淋浴或洗脸时使用，非常方便。总之，Boie的AeroGlide UltraSlim智能牙刷是一款高品质、高效率的电动牙刷，非常适合追求健康口腔的人士使用。

### 关于反斜杠的说明
在本课程中，我们使用反斜杠 `\` 来使文本适合屏幕而不插入换行符 `\n`。

GPT-3 实际上不受您是否插入换行符的影响。但是在一般情况下使用 LLMs 时，您可能需要考虑您的提示中的换行符是否会影响模型的性能。


## Iterative（迭代）
### Generate a marketing product description from a product fact sheet（从产品说明书生成营销产品描述）

```py
fact_sheet_chair = """
OVERVIEW
- Part of a beautiful family of mid-century inspired office furniture, 
including filing cabinets, desks, bookcases, meeting tables, and more.
- Several options of shell color and base finishes.
- Available with plastic back and front upholstery (SWC-100) 
or full upholstery (SWC-110) in 10 fabric and 6 leather options.
- Base finish options are: stainless steel, matte black, 
gloss white, or chrome.
- Chair is available with or without armrests.
- Suitable for home or business settings.
- Qualified for contract use.

CONSTRUCTION
- 5-wheel plastic coated aluminum base.
- Pneumatic chair adjust for easy raise/lower action.

DIMENSIONS
- WIDTH 53 CM | 20.87”
- DEPTH 51 CM | 20.08”
- HEIGHT 80 CM | 31.50”
- SEAT HEIGHT 44 CM | 17.32”
- SEAT DEPTH 41 CM | 16.14”

OPTIONS
- Soft or hard-floor caster options.
- Two choices of seat foam densities: 
 medium (1.8 lb/ft3) or high (2.8 lb/ft3)
- Armless or 8 position PU armrests 

MATERIALS
SHELL BASE GLIDER
- Cast Aluminum with modified nylon PA6/PA66 coating.
- Shell thickness: 10 mm.
SEAT
- HD36 foam

COUNTRY OF ORIGIN
- Italy
"""

fact_sheet_chair_zh = """
概述

    美丽的中世纪风格办公家具系列的一部分，包括文件柜、办公桌、书柜、会议桌等。
    多种外壳颜色和底座涂层可选。
    可选塑料前后靠背装饰（SWC-100）或10种面料和6种皮革的全面装饰（SWC-110）。
    底座涂层选项为：不锈钢、哑光黑色、光泽白色或铬。
    椅子可带或不带扶手。
    适用于家庭或商业场所。
    符合合同使用资格。

结构

    五个轮子的塑料涂层铝底座。
    气动椅子调节，方便升降。

尺寸

    宽度53厘米|20.87英寸
    深度51厘米|20.08英寸
    高度80厘米|31.50英寸
    座椅高度44厘米|17.32英寸
    座椅深度41厘米|16.14英寸

选项

    软地板或硬地板滚轮选项。
    两种座椅泡沫密度可选：中等（1.8磅/立方英尺）或高（2.8磅/立方英尺）。
    无扶手或8个位置PU扶手。

材料
外壳底座滑动件

    改性尼龙PA6/PA66涂层的铸铝。
    外壳厚度：10毫米。
    座椅
    HD36泡沫

原产国

    意大利
"""
```

```py
prompt = f"""
Your task is to help a marketing team create a 
description for a retail website of a product based 
on a technical fact sheet.

Write a product description based on the information 
provided in the technical specifications delimited by 
triple backticks.

Technical specifications: ```{fact_sheet_chair}```
"""
response = get_completion(prompt)
print(response)
```

Introducing our stunning mid-century inspired office chair, the perfect addition to any home or business setting. Part of a beautiful family of office furniture, including filing cabinets, desks, bookcases, meeting tables, and more, this chair is available in several options of shell color and base finishes to suit your style. Choose from plastic back and front upholstery (SWC-100) or full upholstery (SWC-110) in 10 fabric and 6 leather options.

The chair is constructed with a 5-wheel plastic coated aluminum base and features a pneumatic chair adjust for easy raise/lower action. It is available with or without armrests and is qualified for contract use. The base finish options are stainless steel, matte black, gloss white, or chrome.

Measuring at a width of 53 cm, depth of 51 cm, and height of 80 cm, with a seat height of 44 cm and seat depth of 41 cm, this chair is designed for ultimate comfort. You can also choose between soft or hard-floor caster options and two choices of seat foam densities: medium (1.8 lb/ft3) or high (2.8 lb/ft3). The armrests are available in either an armless or 8 position PU option.

The materials used in the construction of this chair are of the highest quality. The shell base glider is made of cast aluminum with modified nylon PA6/PA66 coating and has a shell thickness of 10 mm. The seat is made of HD36 foam, ensuring maximum comfort and durability.

This chair is made in Italy and is the perfect combination of style and functionality. Upgrade your workspace with our mid-century inspired office chair today!

```py
prompt = f"""
你的任务是帮助营销团队基于技术说明书创建一个产品的营销描述。

根据```标记的技术说明书中提供的信息，编写一个产品描述。

技术说明: ```{fact_sheet_chair_zh}```
"""
response = get_completion(prompt)
print(response)
```

```
产品描述：

我们自豪地推出美丽的中世纪风格办公家具系列，其中包括文件柜、办公桌、书柜、会议桌等。我们的产品有多种外壳颜色和底座涂层可选，以满足您的个性化需求。您可以选择塑料前后靠背装饰（SWC-100）或10种面料和6种皮革的全面装饰（SWC-110），以使您的家具更加独特。底座涂层选项为：不锈钢、哑光黑色、光泽白色或铬，以满足您的不同需求。

我们的椅子可带或不带扶手，适用于家庭或商业场所。我们的产品符合合同使用资格，让您放心使用。

我们的椅子采用五个轮子的塑料涂层铝底座，气动椅子调节，方便升降。尺寸为宽度53厘米|20.87英寸，深度51厘米|20.08英寸，高度80厘米|31.50英寸，座椅高度44厘米|17.32英寸，座椅深度41厘米|16.14英寸。

我们提供软地板或硬地板滚轮选项，两种座椅泡沫密度可选：中等（1.8磅/立方英尺）或高（2.8磅/立方英尺），以满足您的不同需求。我们还提供无扶手或8个位置PU扶手的选项。

我们的产品采用改性尼龙PA6/PA66涂层的铸铝外壳底座滑动件，外壳厚度为10毫米，座椅采用HD36泡沫，原产国为意大利。

我们的产品不仅美观大方，而且质量可靠，是您家庭或商业场所的理想选择。
```

### Issue 1: The text is too long（文本太长）
- Limit the number of words/sentences/characters.（限制单词/句子/字符的数量。）

```py
prompt = f"""
Your task is to help a marketing team create a 
description for a retail website of a product based 
on a technical fact sheet.

Write a product description based on the information 
provided in the technical specifications delimited by 
triple backticks.

Use at most 50 words.

Technical specifications: ```{fact_sheet_chair}```
"""
response = get_completion(prompt)
print(response)
```

Introducing our mid-century inspired office chair, part of a beautiful furniture family. Available in various shell colors and base finishes, with plastic or full upholstery options in fabric or leather. Suitable for home or business use, with a 5-wheel base and pneumatic chair adjust. Made in Italy.

```py
prompt = f"""
你的任务是帮助营销团队基于技术说明书创建一个产品的营销描述。

根据```标记的技术说明书中提供的信息，编写一个产品描述。

使用最多50个词。

技术说明: ```{fact_sheet_chair_zh}```
"""
response = get_completion(prompt)
print(response)
```

中世纪风格办公家具系列，包括文件柜、办公桌、书柜、会议桌等。多种颜色和涂层可选，可带或不带扶手。底座涂层选项为不锈钢、哑光黑色、光泽白色或铬。适用于家庭或商业场所，符合合同使用资格。意大利制造。

### Issue 2. Text focuses on the wrong details（文本过于关注错误细节）
- Ask it to focus on the aspects that are relevant to the intended audience.（要求它关注与目标受众相关的因素。）

```py
prompt = f"""
Your task is to help a marketing team create a 
description for a retail website of a product based 
on a technical fact sheet.

Write a product description based on the information 
provided in the technical specifications delimited by 
triple backticks.

The description is intended for furniture retailers, 
so should be technical in nature and focus on the 
materials the product is constructed from.

Use at most 50 words.

Technical specifications: ```{fact_sheet_chair}```
"""
response = get_completion(prompt)
print(response)
```

Introducing our mid-century inspired office chair, perfect for both home and business settings. With a range of shell colors and base finishes, including stainless steel and matte black, this chair is available with or without armrests. The 5-wheel plastic coated aluminum base and pneumatic chair adjust make it easy to raise and lower. Made in Italy with a cast aluminum shell and HD36 foam seat.

```py
prompt = f"""
你的任务是帮助营销团队基于技术说明书创建一个产品的营销描述。

根据```标记的技术说明书中提供的信息，编写一个产品描述。

该描述面向家具零售商，因此应具有技术性质，并侧重于产品的材料构造。

使用最多50个词。

技术说明: ```{fact_sheet_chair_zh}```
"""
response = get_completion(prompt)
print(response)
```

我们的中世纪风格办公家具系列包括文件柜、办公桌、书柜和会议桌等。可选多种外壳颜色和底座涂层，底座涂层选项为不锈钢、哑光黑色、光泽白色或铬。椅子可带或不带扶手，适用于家庭或商业场所。座椅采用HD36泡沫，外壳底座滑动件采用改性尼龙PA6/PA66涂层的铸铝。原产国为意大利。

```py
prompt = f"""
Your task is to help a marketing team create a 
description for a retail website of a product based 
on a technical fact sheet.

Write a product description based on the information 
provided in the technical specifications delimited by 
triple backticks.

The description is intended for furniture retailers, 
so should be technical in nature and focus on the 
materials the product is constructed from.

At the end of the description, include every 7-character 
Product ID in the technical specification.

Use at most 50 words.

Technical specifications: ```{fact_sheet_chair}```
"""
response = get_completion(prompt)
print(response)
```

Introducing our mid-century inspired office chair, perfect for home or business settings. With a range of shell colors and base finishes, and the option of plastic or full upholstery, this chair is both stylish and comfortable. Constructed with a 5-wheel plastic coated aluminum base and pneumatic chair adjust, it's also practical. Available with or without armrests and suitable for contract use. Product ID: SWC-100, SWC-110.

```py
prompt = f"""
你的任务是帮助营销团队基于技术说明书创建一个产品的营销描述。

根据```标记的技术说明书中提供的信息，编写一个产品描述。

该描述面向家具零售商，因此应具有技术性质，并侧重于产品的材料构造。

在描述末尾，包括技术规格中每个7个字符的产品ID。

使用最多50个词。

技术说明: ```{fact_sheet_chair_zh}```
"""
response = get_completion(prompt)
print(response)
```

我们的中世纪风格办公家具系列包括文件柜、办公桌、书柜和会议桌等。可选多种外壳颜色和底座涂层，底座涂层选项为不锈钢、哑光黑色、光泽白色或铬。椅子可带或不带扶手，可选塑料或面料/皮革装饰。座椅高度44厘米，座椅深度41厘米。材料包括改性尼龙PA6/PA66涂层的铸铝和HD36泡沫。产品ID：SWC-100/SWC-110。

### Issue 3. Description needs a table of dimensions（描述需要的表格）
- Ask it to extract information and organize it in a table.（要求它提取信息并将其组织在表格中。）

```py
prompt = f"""
Your task is to help a marketing team create a 
description for a retail website of a product based 
on a technical fact sheet.

Write a product description based on the information 
provided in the technical specifications delimited by 
triple backticks.

The description is intended for furniture retailers, 
so should be technical in nature and focus on the 
materials the product is constructed from.

At the end of the description, include every 7-character 
Product ID in the technical specification.

After the description, include a table that gives the 
product's dimensions. The table should have two columns.
In the first column include the name of the dimension. 
In the second column include the measurements in inches only.

Give the table the title 'Product Dimensions'.

Format everything as HTML that can be used in a website. 
Place the description in a <div> element.

Technical specifications: ```{fact_sheet_chair}```
"""

response = get_completion(prompt)
print(response)
```

```
<div>
<h2>Mid-Century Inspired Office Chair</h2>
<p>Introducing our mid-century inspired office chair, part of a beautiful family of office furniture that includes filing cabinets, desks, bookcases, meeting tables, and more. This chair is available in several options of shell color and base finishes, allowing you to customize it to your liking. You can choose between plastic back and front upholstery or full upholstery in 10 fabric and 6 leather options. The base finish options are stainless steel, matte black, gloss white, or chrome. The chair is also available with or without armrests, making it suitable for both home and business settings. Plus, it's qualified for contract use, ensuring its durability and longevity.</p>
<p>The chair's construction features a 5-wheel plastic coated aluminum base and a pneumatic chair adjust for easy raise/lower action. You can also choose between soft or hard-floor caster options and two choices of seat foam densities: medium (1.8 lb/ft3) or high (2.8 lb/ft3). The armrests are also customizable, with the option of armless or 8 position PU armrests.</p>
<p>The chair's shell base glider is made of cast aluminum with modified nylon PA6/PA66 coating, with a shell thickness of 10 mm. The seat is made of HD36 foam, ensuring comfort and support during long work hours. This chair is made in Italy, ensuring its quality and craftsmanship.</p>
<h3>Product ID(s): SWC-100, SWC-110</h3>
<table>
  <caption>Product Dimensions</caption>
  <tr>
    <th>Width</th>
    <td>53 cm | 20.87"</td>
  </tr>
  <tr>
    <th>Depth</th>
    <td>51 cm | 20.08"</td>
  </tr>
  <tr>
    <th>Height</th>
    <td>80 cm | 31.50"</td>
  </tr>
  <tr>
    <th>Seat Height</th>
    <td>44 cm | 17.32"</td>
  </tr>
  <tr>
    <th>Seat Depth</th>
    <td>41 cm | 16.14"</td>
  </tr>
</table>
</div>
```

```py
prompt = f"""
您的任务是帮助营销团队创建一个基于产品的零售网站的描述在技术说明书上。

根据信息撰写产品说明在由分隔的技术规范中提供三重反引号。

该说明适用于家具零售商，所以本质上应该是技术性的，并专注于制造产品的材料。

在描述的末尾，包括每 7 个字符技术规范中的产品 ID。

在描述之后，包括一个表格，给出产品的尺寸。 该表应该有两列。
在第一列中包括维度的名称。
在第二列中仅包含以英寸为单位的测量值。

为表格命名为“产品尺寸”。

将所有内容格式化为可在网站中使用的 HTML。
将说明放在 <div> 元素中。

技术规格：```{fact_sheet_chair_zh}```
"""
response = get_completion(prompt)
print(response)
```

```
<div>
    <h2>产品说明</h2>
    <p>这款家具系列包括文件柜、办公桌、书柜、会议桌等，是美丽的中世纪风格。您可以选择多种外壳颜色和底座涂层，以及可选的塑料前后靠背装饰（SWC-100）或10种面料和6种皮革的全面装饰（SWC-110）。底座涂层选项为：不锈钢、哑光黑色、光泽白色或铬。椅子可带或不带扶手。此系列适用于家庭或商业场所，并符合合同使用资格。</p>
    <p>该家具系列的结构包括五个轮子的塑料涂层铝底座和气动椅子调节，方便升降。</p>
    <h3>材料</h3>
    <ul>
        <li>外壳底座滑动件：改性尼龙PA6/PA66涂层的铸铝，外壳厚度为10毫米。</li>
        <li>座椅：HD36泡沫。</li>
    </ul>
    <h3>选项</h3>
    <ul>
        <li>软地板或硬地板滚轮选项。</li>
        <li>两种座椅泡沫密度可选：中等（1.8磅/立方英尺）或高（2.8磅/立方英尺）。</li>
        <li>无扶手或8个位置PU扶手。</li>
    </ul>
    <h3>产品尺寸</h3>
    <table>
        <tr>
            <td>宽度</td>
            <td>20.87英寸</td>
        </tr>
        <tr>
            <td>深度</td>
            <td>20.08英寸</td>
        </tr>
        <tr>
            <td>高度</td>
            <td>31.50英寸</td>
        </tr>
        <tr>
            <td>座椅高度</td>
            <td>17.32英寸</td>
        </tr>
        <tr>
            <td>座椅深度</td>
            <td>16.14英寸</td>
        </tr>
    </table>
    <p>产品 ID：SWC-100-001</p>
</div>
```

## Summarizing（总结）

### Text to summarize（要总结的文本）
```py
prod_review = """
Got this panda plush toy for my daughter's birthday, \
who loves it and takes it everywhere. It's soft and \ 
super cute, and its face has a friendly look. It's \ 
a bit small for what I paid though. I think there \ 
might be other options that are bigger for the \ 
same price. It arrived a day earlier than expected, \ 
so I got to play with it myself before I gave it \ 
to her.
"""

prod_review_zh = """
这个熊猫公仔是我给女儿的生日礼物，她很喜欢，去哪都带着。
公仔很软，超级可爱，面部表情也很和善。但是相比于价钱来说，
它有点小，我感觉在别的地方用同样的价钱能买到更大的。
快递比预期提前了一天到货，所以在送给女儿之前，我自己玩了会。
"""
```

### Summarize with a word/sentence/character limit（以单词/句子/字符限制进行总结）
```py
prompt = f"""
Your task is to generate a short summary of a product \
review from an ecommerce site. 

Summarize the review below, delimited by triple 
backticks, in at most 30 words. 

Review: ```{prod_review}```
"""

response = get_completion(prompt)
print(response)
```

```
Soft and cute panda plush toy loved by daughter, but a bit small for the price. Arrived early.
```

```py
prompt = f"""
你的任务是从电子商务网站上生成一个产品评论的简短摘要。

请对三个反引号之间的评论文本进行概括，最多30个词汇。

评论: ```{prod_review_zh}```
"""

response = get_completion(prompt)
print(response)
```

```
可爱软熊猫公仔，女儿喜欢，面部表情友好，但价钱有点贵，大小不够。快递提前一天到货。
```

### Summarize with a focus on shipping and delivery（以运输和交付为重点进行总结）
```py
prompt = f"""
Your task is to generate a short summary of a product \
review from an ecommerce site to give feedback to the \
Shipping deparmtment. 

Summarize the review below, delimited by triple 
backticks, in at most 30 words, and focusing on any aspects \
that mention shipping and delivery of the product. 

Review: ```{prod_review}```
"""

response = get_completion(prompt)
print(response)
```

```
The panda plush toy arrived a day earlier than expected, but the customer felt it was a bit small for the price paid.
```

```py
prompt = f"""
你的任务是从电子商务网站上生成一个产品评论的简短摘要。

请对三个反引号之间的评论文本进行概括，最多30个词汇，并且聚焦在产品运输和交付上。

评论: ```{prod_review_zh}```
"""

response = get_completion(prompt)
print(response)
```

```
快递提前一天到货，熊猫公仔很可爱但有点小，价钱稍高。
```

### Summarize with a focus on price and value（以价格和价值为重点进行总结）
```py
prompt = f"""
Your task is to generate a short summary of a product \
review from an ecommerce site to give feedback to the \
pricing deparmtment, responsible for determining the \
price of the product.  

Summarize the review below, delimited by triple 
backticks, in at most 30 words, and focusing on any aspects \
that are relevant to the price and perceived value. 

Review: ```{prod_review}```
"""

response = get_completion(prompt)
print(response)
```

```
The panda plush toy is soft, cute, and loved by the recipient, but the price may be too high for its size.
```

```py
prompt = f"""
您的任务是从电子商务网站生成产品评论的简短摘要，以向负责确定产品价格的定价部门提供反馈。

总结下面的评论，由三重分隔反引号，最多 30 个词，重点关注与价格和感知价值相关的任何方面。

评论：```{prod_review_zh}```
"""

response = get_completion(prompt)
print(response)
```

```
超可爱的熊猫公仔，女儿很喜欢，但价钱有点高，尺寸有点小。快递提前到货。
```

### Try "extract" instead of "summarize"（尝试“提取”而不是“总结”）

```py
prompt = f"""
Your task is to extract relevant information from \ 
a product review from an ecommerce site to give \
feedback to the Shipping department. 

From the review below, delimited by triple quotes \
extract the information relevant to shipping and \ 
delivery. Limit to 30 words. 

Review: ```{prod_review}```
"""

response = get_completion(prompt)
print(response)
```

```
The product arrived a day earlier than expected.
```

```py
prompt = f"""
你的任务是从电子商务网站上的产品评论中提取相关信息。

请从以下三个反引号之间的评论文本中提取产品运输相关的信息，最多30个词汇。

评论: ```{prod_review_zh}```
"""

response = get_completion(prompt)
print(response)
```

```
快递比预期提前了一天到货。
```

### Summarize multiple product reviews（汇总多个产品评论）

```py
review_1 = prod_review 

# review for a standing lamp
review_2 = """
Needed a nice lamp for my bedroom, and this one \
had additional storage and not too high of a price \
point. Got it fast - arrived in 2 days. The string \
to the lamp broke during the transit and the company \
happily sent over a new one. Came within a few days \
as well. It was easy to put together. Then I had a \
missing part, so I contacted their support and they \
very quickly got me the missing piece! Seems to me \
to be a great company that cares about their customers \
and products. 
"""

# review for an electric toothbrush
review_3 = """
My dental hygienist recommended an electric toothbrush, \
which is why I got this. The battery life seems to be \
pretty impressive so far. After initial charging and \
leaving the charger plugged in for the first week to \
condition the battery, I've unplugged the charger and \
been using it for twice daily brushing for the last \
3 weeks all on the same charge. But the toothbrush head \
is too small. I’ve seen baby toothbrushes bigger than \
this one. I wish the head was bigger with different \
length bristles to get between teeth better because \
this one doesn’t.  Overall if you can get this one \
around the $50 mark, it's a good deal. The manufactuer's \
replacements heads are pretty expensive, but you can \
get generic ones that're more reasonably priced. This \
toothbrush makes me feel like I've been to the dentist \
every day. My teeth feel sparkly clean! 
"""

# review for a blender
review_4 = """
So, they still had the 17 piece system on seasonal \
sale for around $49 in the month of November, about \
half off, but for some reason (call it price gouging) \
around the second week of December the prices all went \
up to about anywhere from between $70-$89 for the same \
system. And the 11 piece system went up around $10 or \
so in price also from the earlier sale price of $29. \
So it looks okay, but if you look at the base, the part \
where the blade locks into place doesn’t look as good \
as in previous editions from a few years ago, but I \
plan to be very gentle with it (example, I crush \
very hard items like beans, ice, rice, etc. in the \ 
blender first then pulverize them in the serving size \
I want in the blender then switch to the whipping \
blade for a finer flour, and use the cross cutting blade \
first when making smoothies, then use the flat blade \
if I need them finer/less pulpy). Special tip when making \
smoothies, finely cut and freeze the fruits and \
vegetables (if using spinach-lightly stew soften the \ 
spinach then freeze until ready for use-and if making \
sorbet, use a small to medium sized food processor) \ 
that you plan to use that way you can avoid adding so \
much ice if at all-when making your smoothie. \
After about a year, the motor was making a funny noise. \
I called customer service but the warranty expired \
already, so I had to buy another one. FYI: The overall \
quality has gone done in these types of products, so \
they are kind of counting on brand recognition and \
consumer loyalty to maintain sales. Got it in about \
two days.
"""

reviews = [review_1, review_2, review_3, review_4]

for i in range(len(reviews)):
    prompt = f"""
    Your task is to generate a short summary of a product \ 
    review from an ecommerce site. 

    Summarize the review below, delimited by triple \
    backticks in at most 20 words. 

    Review: ```{reviews[i]}```
    """

    response = get_completion(prompt)
    print(i, response, "\n")
```

```
0 Soft and cute panda plush toy loved by daughter, but a bit small for the price. Arrived early. 

1 Affordable lamp with storage, fast shipping, and excellent customer service. Easy to assemble and missing parts were quickly replaced. 

2 Good battery life, small toothbrush head, but effective cleaning. Good deal if bought around $50. 

3 The product was on sale for $49 in November, but the price increased to $70-$89 in December. The base doesn't look as good as previous editions, but the reviewer plans to be gentle with it. A special tip for making smoothies is to freeze the fruits and vegetables beforehand. The motor made a funny noise after a year, and the warranty had expired. Overall quality has decreased. 
```

```py
review_1 = prod_review_zh

# 审查立灯
review_2 = """
我的卧室需要一盏漂亮的灯，这盏灯有额外的储物空间，而且价格不太高。 很快得到它 - 2 天内到达。 灯线在运输过程中断了，公司很高兴地送来了一根新的。 几天之内也来了。 很容易放在一起。 然后我缺少了一部分，所以我联系了他们的支持，他们很快就帮我找到了丢失的部分！ 在我看来，这是一家关心客户和产品的伟大公司。
"""

# 审查电动牙刷
review_3 = """
我的牙科保健员推荐了电动牙刷，这就是我买这个的原因。 到目前为止，电池寿命似乎令人印象深刻。 在初次充电并在第一周保持充电器插入状态以调节电池后，我拔下充电器并在过去的 3 周内每天使用它刷牙两次，每次充电都是一样的。 但是牙刷头太小了。 我见过比这个大的婴儿牙刷。 我希望头部更大，刷毛长度不同，以便更好地进入牙齿之间，因为这个没有。 总的来说，如果你能在 50 美元左右买到这个，那还是很划算的。 制造商的替换头非常昂贵，但您可以获得价格更合理的通用头。 这把牙刷让我觉得我每天都去看牙医了。 我的牙齿感觉闪闪发光！
"""

# 审查搅拌机
review_4 = """
因此，他们在 11 月份仍然以 49 美元左右的价格对 17 件系统进行季节性销售，大约减半，但由于某种原因（称之为价格欺诈），在 12 月的第二周左右，价格全部上涨至大约任何地方 同一系统在 70-89 美元之间。 11 件套系统的价格也比之前的 29 美元上涨了 10 美元左右。 所以它看起来还不错，但是如果你看一下底座，刀片锁定到位的部分看起来不像几年前的以前版本那么好，但我打算对它非常温和（例如，我 先在搅拌机中粉碎非常硬的东西，如豆子、冰、大米等，然后在搅拌机中将它们粉碎成我想要的份量，然后切换到搅打刀片以获得更细的面粉，并在制作冰沙时先使用横切刀片 ，然后如果我需要它们更细/更少浆状，请使用平刀片）。 制作冰沙时的特别提示，切碎并冷冻您计划使用的水果和蔬菜（如果使用菠菜 - 稍微炖软菠菜，然后冷冻直至准备使用 - 如果制作冰糕，请使用中小型食品加工机） 这样你就可以避免在制作冰沙时添加太多冰块。 大约一年后，电机发出一种奇怪的声音。 我打电话给客户服务，但保修期已经过期，所以我不得不再买一个。 仅供参考：这些类型的产品的整体质量已经过时，因此他们有点依赖品牌知名度和消费者忠诚度来维持销售。 大概两天就拿到了
"""

reviews = [review_1, review_2, review_3, review_4]

for i in range(len(reviews)):
    prompt = f"""
    您的任务是生成来自电子商务网站的产品评论的简短摘要。

    总结下面用三重反引号分隔的评论，最多 20 个词。

    评论：```{reviews[i]}```
    """

    response = get_completion(prompt)
    print(i, response, "\n")
```

```
0 超可爱的熊猫公仔，女儿很喜欢，但有点小。快递提前到货。 

1 漂亮的灯，带储物空间，快速送达，优质客服，值得信赖。 

2 电动牙刷电池寿命长，价格划算，但刷头太小，替换头贵。牙齿感觉很干净。 

3 价格欺诈，底座质量一般，制冰沙需注意，电机易损。
```

## Inferring（推理）

### Product review text（产品评论文本）

```py
lamp_review = """
Needed a nice lamp for my bedroom, and this one had \
additional storage and not too high of a price point. \
Got it fast.  The string to our lamp broke during the \
transit and the company happily sent over a new one. \
Came within a few days as well. It was easy to put \
together.  I had a missing part, so I contacted their \
support and they very quickly got me the missing piece! \
Lumina seems to me to be a great company that cares \
about their customers and products!!
"""

lamp_review_zh = """
我需要一盏漂亮的卧室灯，这款灯具有额外的储物功能，价格也不算太高。\
我很快就收到了它。在运输过程中，我们的灯绳断了，但是公司很乐意寄送了一个新的。\
几天后就收到了。这款灯很容易组装。我发现少了一个零件，于是联系了他们的客服，\
他们很快就给我寄来了缺失的零件！在我看来，Lumina 是一家非常关心顾客和产品的优秀公司！
"""
```

### Sentiment (positive/negative) 情绪（正面/负面）

```py
prompt = f"""
What is the sentiment of the following product review, 
which is delimited with triple backticks?

Review text: '''{lamp_review}'''
"""
response = get_completion(prompt)
print(response)
```

```
The sentiment of the product review is positive.
```

```py
prompt = f"""
以下用三重反引号分隔的产品评论的情绪是什么？

评论文本：'''{lamp_review}'''
"""
response = get_completion(prompt)
print(response)
```

```
情绪是积极的。
```

```py
prompt = f"""
What is the sentiment of the following product review, 
which is delimited with triple backticks?

Give your answer as a single word, either "positive" \
or "negative".

Review text: '''{lamp_review}'''
"""
response = get_completion(prompt)
print(response)
```

```
positive
```

```py
prompt = f"""
以下用三重反引号分隔的产品评论的情绪是什么？

用一个词给出你的答案，“正面”或“负面”。

评论文本：'''{lamp_review}'''
"""
response = get_completion(prompt)
print(response)
```

```
正面
```

### Identify types of emotions（识别情绪类型）

```py
prompt = f"""
Identify a list of emotions that the writer of the \
following review is expressing. Include no more than \
five items in the list. Format your answer as a list of \
lower-case words separated by commas.

Review text: '''{lamp_review}'''
"""
response = get_completion(prompt)
print(response)
```

```
happy, satisfied, grateful, impressed, content
```

```py
prompt = f"""
识别以下评论的作者表达的情感。包含不超过五个项目。将答案格式化为以逗号分隔的列表。

评论文本：'''{lamp_review_zh}'''
"""
response = get_completion(prompt)
print(response)
```

```
满意,感激,赞扬,信任,愉快
```

### Identify anger（识别愤怒）

```py
prompt = f"""
Is the writer of the following review expressing anger?\
The review is delimited with triple backticks. \
Give your answer as either yes or no.

Review text: '''{lamp_review}'''
"""
response = get_completion(prompt)
print(response)
```

```
No
```

```py
prompt = f"""
以下评论的作者是否表示愤怒？
评论用三重反引号分隔。
给出是或否的答案。

评论文字：'''{lamp_review_zh}'''
"""
response = get_completion(prompt)
print(response)
```

```
否
```

### Extract product and company name from customer reviews（从客户评论中提取产品和公司名称）

```py
prompt = f"""
Identify the following items from the review text: 
- Item purchased by reviewer
- Company that made the item

The review is delimited with triple backticks. \
Format your response as a JSON object with \
"Item" and "Brand" as the keys. 
If the information isn't present, use "unknown" \
as the value.
Make your response as short as possible.
  
Review text: '''{lamp_review}'''
"""
response = get_completion(prompt)
print(response)
```

```
{
  "Item": "lamp",
  "Brand": "Lumina"
}
```

```py
prompt = f"""
从评论文本中识别以下项目：
- 评论者购买的物品
- 制造该物品的公司

评论用三重反引号分隔。
将您的响应格式化为以“物品”和“品牌”为键的 JSON 对象。
如果信息不存在，请使用“未知”作为值。
让你的回应尽可能简短。
  
评论文字：'''{lamp_review_zh}'''
"""
response = get_completion(prompt)
print(response)
```

```
{
  "物品": "卧室灯",
  "品牌": "Lumina"
}
```

### Doing multiple tasks at once（一次执行多个任务）

```py
prompt = f"""
Identify the following items from the review text: 
- Sentiment (positive or negative)
- Is the reviewer expressing anger? (true or false)
- Item purchased by reviewer
- Company that made the item

The review is delimited with triple backticks. \
Format your response as a JSON object with \
"Sentiment", "Anger", "Item" and "Brand" as the keys.
If the information isn't present, use "unknown" \
as the value.
Make your response as short as possible.
Format the Anger value as a boolean.

Review text: '''{lamp_review}'''
"""
response = get_completion(prompt)
print(response)
```

```
{
  "Sentiment": "positive",
  "Anger": false,
  "Item": "lamp with additional storage",
  "Brand": "Lumina"
}
```

```py
prompt = f"""
从评论文本中识别以下项目：
- 情绪（正面或负面）
- 审稿人是否表达了愤怒？（是或否）
- 评论者购买的物品
- 制造该物品的公司

评论用三个反引号分隔。将您的响应格式化为 JSON 对象，以 “情绪”、“愤怒”、“物品”和“品牌” 作为键。
如果信息不存在，请使用 “未知” 作为值。
让你的回应尽可能简短。
将“愤怒”值格式化为布尔值。

评论文本: ```{lamp_review_zh}```
"""
response = get_completion(prompt)
print(response)
```

```
{
  "情绪": "正面",
  "愤怒": false,
  "物品": "卧室灯",
  "品牌": "Lumina"
}
```

### Inferring topics（推断主题）

```py
story = """
In a recent survey conducted by the government, 
public sector employees were asked to rate their level 
of satisfaction with the department they work at. 
The results revealed that NASA was the most popular 
department with a satisfaction rating of 95%.

One NASA employee, John Smith, commented on the findings, 
stating, "I'm not surprised that NASA came out on top. 
It's a great place to work with amazing people and 
incredible opportunities. I'm proud to be a part of 
such an innovative organization."

The results were also welcomed by NASA's management team, 
with Director Tom Johnson stating, "We are thrilled to 
hear that our employees are satisfied with their work at NASA. 
We have a talented and dedicated team who work tirelessly 
to achieve our goals, and it's fantastic to see that their 
hard work is paying off."

The survey also revealed that the 
Social Security Administration had the lowest satisfaction 
rating, with only 45% of employees indicating they were 
satisfied with their job. The government has pledged to 
address the concerns raised by employees in the survey and 
work towards improving job satisfaction across all departments.
"""

story_zh = """
在政府最近进行的一项调查中，
公共部门雇员被要求评价他们的水平
对他们工作的部门的满意度。
结果显示，NASA 最受欢迎
满意度为95%的部门。

美国宇航局的一名员工约翰·史密斯对调查结果发表了评论，
说，“我对 NASA 名列前茅并不感到惊讶。
这是与了不起的人一起工作的好地方
难以置信的机会。 我很自豪能成为其中的一员
这样一个创新的组织。”

这一结果也受到了 NASA 管理团队的欢迎，
导演汤姆约翰逊说，“我们很高兴
听说我们的员工对他们在 NASA 的工作感到满意。
我们拥有一支才华横溢、兢兢业业的团队，他们孜孜不倦地工作
实现我们的目标，很高兴看到他们
努力工作是有回报的。”

调查还显示，
社会保障局满意度最低
评级，只有 45% 的员工表示他们是
对他们的工作感到满意。 政府已承诺
解决员工在调查中提出的顾虑，并
努力提高所有部门的工作满意度。
"""
```

### Infer 5 topics（推断 5 个主题）

```py
prompt = f"""
Determine five topics that are being discussed in the \
following text, which is delimited by triple backticks.

Make each item one or two words long. 

Format your response as a list of items separated by commas.

Text sample: '''{story}'''
"""
response = get_completion(prompt)
print(response)
```

```
government survey, job satisfaction, NASA, Social Security Administration, employee concerns
```

```py
prompt = f"""
确定以下由三个反引号分隔的文本中讨论的五个主题。

每个主题一两个单词长。

将您的回复格式化为以逗号分隔的主题列表。

文本示例：'''{story_zh}'''
"""
response = get_completion(prompt)
print(response)
```

```
NASA, 满意度, 社会保障局, 工作满意度, 政府承诺
```

```py
prompt = f"""
确定以下由三个反引号分隔的文本中讨论的五个主题。

每个主题用一两个词概括。

将您的回复格式化为以逗号分隔的主题列表。

文本示例：'''{story_zh}'''
"""
response = get_completion(prompt)
print(response)
```

```
NASA满意度高, 社会保障局满意度低, 政府调查, 公共部门雇员, 工作满意度
```

**中文使用单词比词好**

### Make a news alert for certain topics（为某些主题制作新闻提醒）

```py
prompt = f"""
Determine whether each item in the following list of \
topics is a topic in the text below, which
is delimited with triple backticks.

Give your answer as list with 0 or 1 for each topic.\

List of topics: {", ".join(topic_list)}

Text sample: '''{story}'''
"""
response = get_completion(prompt)
print(response)

topic_dict = {i.split(': ')[0]: int(i.split(': ')[1]) for i in response.split(sep='\n')}
if topic_dict['nasa'] == 1:
    print("ALERT: New NASA story!")
```

```
nasa: 1
local government: 0
engineering: 0
employee satisfaction: 1
federal government: 1
ALERT: New NASA story!
```

```py
prompt = f"""
确定以下主题列表中的每一项是否是以下由三个反引号分隔的文本中的主题。

以列表的形式给出每个主题的答案，用 0 或 1。

主题列表：{", ".join(topic_list_zh)}

文本示例：'''{story_zh}'''
"""
response = get_completion(prompt)
print(response)

topic_dict = {i.split('：')[0]: int(i.split('：')[1]) for i in response.split(sep='\n')}
if topic_dict['NASA'] == 1:
    print("ALERT: New NASA story!")
```

```
NASA：1
满意度：1
社会保障局：1
工作满意度：1
政府承诺：1
ALERT: New NASA story!
```


## Transforming（转换）
文本转换任务，例如语言翻译、拼写和语法检查、语气调整和格式转换。

```py
import openai
import os

from dotenv import load_dotenv, find_dotenv
_ = load_dotenv(find_dotenv()) # read local .env file

openai.api_key  = os.getenv('OPENAI_API_KEY')

def get_completion(prompt, model="gpt-3.5-turbo", temperature=0): 
    messages = [{"role": "user", "content": prompt}]
    response = openai.ChatCompletion.create(
        model=model,
        messages=messages,
        temperature=temperature, 
    )
    return response.choices[0].message["content"]
```

### Translation（翻译）
```py
prompt = f"""
Translate the following English text to Spanish: \ 
```Hi, I would like to order a blender```
"""
response = get_completion(prompt)
print(response)
```

```
Hola, me gustaría ordenar una licuadora.
```

```py
prompt = f"""
将以下英文文本翻译成中文：\ 
```Hi, I would like to order a blender```
"""
response = get_completion(prompt)
print(response)
```

```
嗨，我想订购一个搅拌机。
```

```py
prompt = f"""
Tell me which language this is: 
```Combien coûte le lampadaire?```
"""
response = get_completion(prompt)
print(response)
```

```
This is French.
```

```py
prompt = f"""
告诉我这是什么语言： 
```Combien coûte le lampadaire?```
"""
response = get_completion(prompt)
print(response)
```

```
这是法语。
```

```py
prompt = f"""
Translate the following  text to French and Spanish
and English pirate: \
```I want to order a basketball```
"""
response = get_completion(prompt)
print(response)
```

```
French pirate: ```Je veux commander un ballon de basket```
Spanish pirate: ```Quiero pedir una pelota de baloncesto```
English pirate: ```I want to order a basketball```
```

```py
prompt = f"""
将以下文本翻译成中文、法语、西班牙语和英语：\
```I want to order a basketball```
"""
response = get_completion(prompt)
print(response)
```

```
中文：我想订购一个篮球
法语：Je veux commander un ballon de basket
西班牙语：Quiero pedir una pelota de baloncesto
英语：I want to order a basketball
```

```py
prompt = f"""
Translate the following text to Spanish in both the \
formal and informal forms: 
'Would you like to order a pillow?'
"""
response = get_completion(prompt)
print(response)
```

```
Formal: ¿Le gustaría ordenar una almohada?
Informal: ¿Te gustaría ordenar una almohada?
```

```py
prompt = f"""
将以下文本以正式和非正式形式翻译成中文：
'Would you like to order a pillow?'
"""
response = get_completion(prompt)
print(response)
```

```
正式：您需要订购枕头吗？
非正式：你要不要订个枕头？
```

#### 通用翻译器
想象一下，您在一家大型跨国电子商务公司负责 IT。 用户正在用他们所有的母语向您发送有关 IT 问题的消息。 您的员工来自世界各地，只说他们的母语。 你需要一个万能翻译器！

```py
user_messages = [
  "La performance du système est plus lente que d'habitude.",  # System performance is slower than normal         
  "Mi monitor tiene píxeles que no se iluminan.",              # My monitor has pixels that are not lighting
  "Il mio mouse non funziona",                                 # My mouse is not working
  "Mój klawisz Ctrl jest zepsuty",                             # My keyboard has a broken control key
  "我的屏幕在闪烁"                                               # My screen is flashing
]

for issue in user_messages:
    prompt = f"Tell me what language this is: ```{issue}```"
    lang = get_completion(prompt)
    print(f"Original message ({lang}): {issue}")

    prompt = f"""
    Translate the following  text to English \
    and Korean: ```{issue}```
    """
    response = get_completion(prompt)
    print(response, "\n")
```

```
Original message (This is French.): La performance du système est plus lente que d'habitude.
English: The system performance is slower than usual.
Korean: 시스템 성능이 평소보다 느립니다. 

Original message (This is Spanish.): Mi monitor tiene píxeles que no se iluminan.
English: My monitor has pixels that don't light up.
Korean: 내 모니터에는 불이 켜지지 않는 픽셀이 있습니다. 

Original message (This is Italian.): Il mio mouse non funziona
English: My mouse is not working.
Korean: 내 마우스가 작동하지 않습니다. 

Original message (This is Polish.): Mój klawisz Ctrl jest zepsuty
English: My Ctrl key is broken.
Korean: 제 Ctrl 키가 고장 났어요. 

Original message (This is Chinese (Simplified).): 我的屏幕在闪烁
English: My screen is flickering.
Korean: 내 화면이 깜빡입니다. 
```

### 语气转换
写作可以根据预期的受众而有所不同。ChatGPT可以产生不同的语气。

```py
prompt = f"""
Translate the following from slang to a business letter: 
'Dude, This is Joe, check out this spec on this standing lamp.'
"""
response = get_completion(prompt)
print(response)
```

```
Dear Sir/Madam,

I am writing to bring to your attention a standing lamp that I believe may be of interest to you. Please find attached the specifications for your review.

Thank you for your time and consideration.

Sincerely,

Joe
```

```py
prompt = f"""
将以下俚语翻译成商务信函： 
兄弟，我是乔，看看这个落地灯的规格。
"""
response = get_completion(prompt)
print(response)
```

```
尊敬的先生/女士，我是乔，想请您查看一下这个落地灯的规格。
```

```py
prompt = f"""
将以下俚语翻译成商务信函格式： 
兄弟，我是乔，看看这个落地灯的规格。
"""
response = get_completion(prompt)
print(response)
```

```
尊敬的先生/女士，

我是乔，想请您查看一下这个落地灯的规格。

谢谢您的时间和帮助。

此致，

敬礼

乔
```

**商务信函 不等于 商务信函格式**

### 格式转换
ChatGPT 可以在不同格式之间进行翻译。提示应该描述输入和输出格式。


```py
data_json = { "resturant employees" :[ 
    {"name":"Shyam", "email":"shyamjaiswal@gmail.com"},
    {"name":"Bob", "email":"bob32@gmail.com"},
    {"name":"Jai", "email":"jai87@gmail.com"}
]}

prompt = f"""
Translate the following python dictionary from JSON to an HTML \
table with column headers and title: {data_json}
"""
response = get_completion(prompt)
print(response)
```

```
<table>
  <caption>Restaurant Employees</caption>
  <thead>
    <tr>
      <th>Name</th>
      <th>Email</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Shyam</td>
      <td>shyamjaiswal@gmail.com</td>
    </tr>
    <tr>
      <td>Bob</td>
      <td>bob32@gmail.com</td>
    </tr>
    <tr>
      <td>Jai</td>
      <td>jai87@gmail.com</td>
    </tr>
  </tbody>
</table>
```

```py
data_json = { "resturant employees" :[ 
    {"name":"Shyam", "email":"shyamjaiswal@gmail.com"},
    {"name":"Bob", "email":"bob32@gmail.com"},
    {"name":"Jai", "email":"jai87@gmail.com"}
]}

prompt = f"""
将以下Python字典从JSON转换为带有列标题和标题的HTML表格：{data_json}
"""
response = get_completion(prompt)
print(response)
```

```
<table>
  <tr>
    <th>resturant employees</th>
  </tr>
  <tr>
    <td>
      <table>
        <tr>
          <th>name</th>
          <th>email</th>
        </tr>
        <tr>
          <td>Shyam</td>
          <td>shyamjaiswal@gmail.com</td>
        </tr>
        <tr>
          <td>Bob</td>
          <td>bob32@gmail.com</td>
        </tr>
        <tr>
          <td>Jai</td>
          <td>jai87@gmail.com</td>
        </tr>
      </table>
    </td>
  </tr>
</table>
```

```py
data_json = { "resturant employees" :[ 
    {"name":"Shyam", "email":"shyamjaiswal@gmail.com"},
    {"name":"Bob", "email":"bob32@gmail.com"},
    {"name":"Jai", "email":"jai87@gmail.com"}
]}

prompt = f"""
将以下Python字典从JSON转换为带有列 headers 和 title 的HTML表格：{data_json}
"""
response = get_completion(prompt)
print(response)
```

```py
data_json = { "resturant employees" :[ 
    {"name":"Shyam", "email":"shyamjaiswal@gmail.com"},
    {"name":"Bob", "email":"bob32@gmail.com"},
    {"name":"Jai", "email":"jai87@gmail.com"}
]}

prompt = f"""
将以下Python字典对象转换为HTML表格：{data_json}
"""
response = get_completion(prompt)
print(response)
```

```
<table>
  <tr>
    <th>resturant employees</th>
  </tr>
  <tr>
    <th>name</th>
    <th>email</th>
  </tr>
  <tr>
    <td>Shyam</td>
    <td>shyamjaiswal@gmail.com</td>
  </tr>
  <tr>
    <td>Bob</td>
    <td>bob32@gmail.com</td>
  </tr>
  <tr>
    <td>Jai</td>
    <td>jai87@gmail.com</td>
  </tr>
</table>
```

**英文提示输出的表格比中文的好**

### 拼写检查/语法检查
以下是一些常见的语法和拼写问题以及 LLM 的响应。
为了让 LLM 知道你想让它校对你的文本，你需要指示模型进行“校对”或“校对和纠正”。

```py
text = [ 
  "The girl with the black and white puppies have a ball.",  # The girl has a ball.
  "Yolanda has her notebook.", # ok
  "Its going to be a long day. Does the car need it’s oil changed?",  # Homonyms
  "Their goes my freedom. There going to bring they’re suitcases.",  # Homonyms
  "Your going to need you’re notebook.",  # Homonyms
  "That medicine effects my ability to sleep. Have you heard of the butterfly affect?", # Homonyms
  "This phrase is to cherck chatGPT for speling abilitty"  # spelling
]
for t in text:
    prompt = f"""Proofread and correct the following text
    and rewrite the corrected version. If you don't find
    and errors, just say "No errors found". Don't use 
    any punctuation around the text:
    ```{t}```"""
    response = get_completion(prompt)
    print(response)
```

```
The girl with the black and white puppies has a ball.
No errors found.
It's going to be a long day. Does the car need its oil changed?
Their goes my freedom. There going to bring they're suitcases.

Corrected version: 
There goes my freedom. They're going to bring their suitcases.
You're going to need your notebook.
That medicine affects my ability to sleep. Have you heard of the butterfly effect?
This phrase is to check ChatGPT for spelling ability.
```

```py
text = [ 
  "The girl with the black and white puppies have a ball.",  # The girl has a ball.
  "Yolanda has her notebook.", # ok
  "Its going to be a long day. Does the car need it’s oil changed?",  # Homonyms
  "Their goes my freedom. There going to bring they’re suitcases.",  # Homonyms
  "Your going to need you’re notebook.",  # Homonyms
  "That medicine effects my ability to sleep. Have you heard of the butterfly affect?", # Homonyms
  "This phrase is to cherck chatGPT for speling abilitty"  # spelling
]

for t in text:
    prompt = f"""
    校对并纠正以下文本的语法问题。\
    如果您没有找到语法错误，只需说“未发现错误”。\
    不要在文本周围使用任何标点符号：
    ```{t}```"""
    response = get_completion(prompt)
    print(response)
```

```
The girl with the black and white puppies has a ball.
未发现错误。
It's going to be a long day. Does the car need its oil changed?
There goes my freedom. They're going to bring their suitcases.
You're going to need your notebook.
That medicine affects my ability to sleep. Have you heard of the butterfly effect?
This phrase is to check ChatGPT for spelling ability.
```

```py
text = f"""
Got this for my daughter for her birthday cuz she keeps taking \
mine from my room.  Yes, adults also like pandas too.  She takes \
it everywhere with her, and it's super soft and cute.  One of the \
ears is a bit lower than the other, and I don't think that was \
designed to be asymmetrical. It's a bit small for what I paid for it \
though. I think there might be other options that are bigger for \
the same price.  It arrived a day earlier than expected, so I got \
to play with it myself before I gave it to my daughter.
"""
prompt = f"proofread and correct this review: ```{text}```"
response = get_completion(prompt)
print(response)
```

```
I got this for my daughter's birthday because she keeps taking mine from my room. Yes, adults also like pandas too. She takes it everywhere with her, and it's super soft and cute. However, one of the ears is a bit lower than the other, and I don't think that was designed to be asymmetrical. Additionally, it's a bit small for what I paid for it. I think there might be other options that are bigger for the same price. On the positive side, it arrived a day earlier than expected, so I got to play with it myself before I gave it to my daughter.
```

```py
text_zh = f"""
为我女儿买这个作为她的生日礼物，因为她一直从我的房间拿走我的东西。\
是的，大人也喜欢熊猫。她随身带着它，超级柔软可爱。\
一只耳朵比另一只低一点，我不认为那是设计成不对称的。\
虽然我为此付出的代价有点小。我认为同样的价格可能还有其他更大的选择。\
它比预期提前一天到达，所以在我把它送给我女儿之前，我必须自己玩它。
"""
prompt = f"校对并纠正此评论：```{text_zh}```"
response = get_completion(prompt)
print(response)
```

```
我为女儿买了这个作为她的生日礼物，因为她一直从我的房间拿走我的东西。是的，成年人也喜欢熊猫。她随身携带它，超级柔软可爱。一只耳朵比另一只低一点，但我不认为这是设计上的不对称。虽然我为此付出的代价有点小，但我认为同样价格可能还有其他更大的选择。它比预期提前一天到达，所以在我把它送给女儿之前，我必须自己玩一下。
```

```py
prompt = f"""
proofread and correct this review. Make it more compelling. 
Ensure it follows APA style guide and targets an advanced reader. 
Output in markdown format.
Text: ```{text}```
"""
response = get_completion(prompt)
display(Markdown(response))
```

```
Title: A Cute and Soft Panda Plush Toy: Perfect Birthday Gift for Kids
I purchased this panda plush toy as a birthday gift for my daughter, who has a habit of taking my things from my room. Yes, even adults love pandas! She carries it around with her everywhere she goes, and it is incredibly soft and adorable. One ear is slightly lower than the other, but I don't think it was designed to be asymmetrical. Although I paid a little more than I would have liked, I believe there may be other larger options available for the same price. However, it arrived a day earlier than expected, so I had to play with it myself before giving it to my daughter.
This panda plush toy is perfect for kids who love cute and cuddly animals. Its softness and cuteness make it an ideal companion for children, and its size is just right for them to carry around. The asymmetrical ears add a unique touch to the toy, making it stand out from other plush toys. Although it may be a bit pricey, the quality of the product is worth the investment.
In conclusion, if you're looking for a birthday gift for a child who loves pandas, this plush toy is an excellent choice. It's soft, cute, and perfect for snuggling. Plus, it's durable and well-made, so it will last for a long time. Overall, I highly recommend this panda plush toy as a gift for any child who loves adorable and cuddly animals.
```

```py
prompt = f"""
校对并更正此评论。 使其更具吸引力。
确保它遵循 APA 风格指南并面向高级读者。
以 markdown 格式输出。
文本：```{text_zh}```
"""
response = get_completion(prompt)
display(Markdown(response))
```

```
我为女儿购买了这个熊猫作为她的生日礼物，因为她总是从我的房间拿走我的东西。即使是成年人也会喜欢这只可爱的熊猫。它非常柔软，我的女儿带着它走到哪里都很开心。虽然它的一只耳朵比另一只低一点，但我不认为这是设计上的不对称。我认为同样的价格可能会有更大的选择，但是这只熊猫提前一天到达，让我有时间在送给女儿之前先玩一下。总的来说，这是一份非常棒的礼物，我强烈推荐给那些喜欢可爱玩具的高级读者。符合 APA 风格指南。
```


## Expanding（展开）

```py
def get_completion(prompt, model="gpt-3.5-turbo",temperature=0): # Andrew mentioned that the prompt/ completion paradigm is preferable for this class
    messages = [{"role": "user", "content": prompt}]
    response = openai.ChatCompletion.create(
        model=model,
        messages=messages,
        temperature=temperature, # this is the degree of randomness of the model's output
    )
    return response.choices[0].message["content"]
```

### Customize the automated reply to a customer email（自定义对客户电子邮件的自动回复）

```py
# given the sentiment from the lesson on "inferring",
# and the original customer message, customize the email
sentiment = "negative"

# review for a blender
review = f"""
So, they still had the 17 piece system on seasonal \
sale for around $49 in the month of November, about \
half off, but for some reason (call it price gouging) \
around the second week of December the prices all went \
up to about anywhere from between $70-$89 for the same \
system. And the 11 piece system went up around $10 or \
so in price also from the earlier sale price of $29. \
So it looks okay, but if you look at the base, the part \
where the blade locks into place doesn’t look as good \
as in previous editions from a few years ago, but I \
plan to be very gentle with it (example, I crush \
very hard items like beans, ice, rice, etc. in the \ 
blender first then pulverize them in the serving size \
I want in the blender then switch to the whipping \
blade for a finer flour, and use the cross cutting blade \
first when making smoothies, then use the flat blade \
if I need them finer/less pulpy). Special tip when making \
smoothies, finely cut and freeze the fruits and \
vegetables (if using spinach-lightly stew soften the \ 
spinach then freeze until ready for use-and if making \
sorbet, use a small to medium sized food processor) \ 
that you plan to use that way you can avoid adding so \
much ice if at all-when making your smoothie. \
After about a year, the motor was making a funny noise. \
I called customer service but the warranty expired \
already, so I had to buy another one. FYI: The overall \
quality has gone done in these types of products, so \
they are kind of counting on brand recognition and \
consumer loyalty to maintain sales. Got it in about \
two days.
"""

prompt = f"""
You are a customer service AI assistant.
Your task is to send an email reply to a valued customer.
Given the customer email delimited by ```, \
Generate a reply to thank the customer for their review.
If the sentiment is positive or neutral, thank them for \
their review.
If the sentiment is negative, apologize and suggest that \
they can reach out to customer service. 
Make sure to use specific details from the review.
Write in a concise and professional tone.
Sign the email as `AI customer agent`.
Customer review: ```{review}```
Review sentiment: {sentiment}
"""
response = get_completion(prompt)
print(response)
```

```
Dear valued customer,

Thank you for taking the time to leave a review about our 17 piece system. We are sorry to hear that you experienced a price increase and that the quality of the product did not meet your expectations. We apologize for any inconvenience this may have caused you.

We would like to assure you that we take all feedback seriously and we will be sure to pass your comments along to our product development team. If you have any further concerns, please do not hesitate to reach out to our customer service team who will be happy to assist you.

Thank you again for your review and for choosing our product. We hope to have the opportunity to serve you better in the future.

Best regards,

AI customer agent
```

```py
sentiment_zh = "负面"

# review for a blender
review_zh = f"""
所以，他们仍然在11月的季节性销售中以约49美元的价格销售17件套装，\
折扣约为一半，但由于某种原因（称其为价格欺诈），到了12月的第二周，\
同一套装的价格都上涨到了70-89美元左右。\
11件套装的价格也比早期的29美元上涨了约10美元左右。\
所以看起来还不错，但如果你看底座，刀片锁定的部分看起来不如几年前的早期版本那么好，\
但我打算对它非常温柔（例如，我先在搅拌机中将豆子、冰、米等硬物压碎，\
然后将它们粉碎成我想要的份量，然后切换到打蛋器刀片制作更细的面粉，\
在制作冰沙时先使用交叉切割刀片，然后如果需要更细/不那么浆状，再使用平刀片）。\
制作冰沙时的特别提示：将要使用的水果和蔬菜切碎并冷冻（如果使用菠菜-轻轻炖软菠菜，\
然后冷冻，直到使用时-如果制作冰糕，使用小到中型食品加工机），\
这样你就可以避免添加太多冰，如果有的话-在制作冰沙时。\
大约一年后，电机发出奇怪的声音。我打电话给客户服务，\
但保修已经过期了，所以我不得不再买一个。\
FYI：这些产品的整体质量已经下降了，所以他们有点依靠品牌认可和消费者忠诚度来维持销售。\
我在大约两天内收到了它。
"""

prompt = f"""
你是一名客服AI助手。
你的任务是向一位重要的客户发送一封电子邮件回复。
给定客户的电子邮件，以```分隔，生成一封感谢客户评论的回复。
如果情感是积极或中性的，感谢他们的评论。
如果情感是消极的，道歉并建议他们可以联系客户服务。
确保使用评论中的具体细节。
用简洁和专业的语气写信。
以“AI客户代理”签署电子邮件。
客户评论：```{review_zh}```
评论情感：{sentiment_zh}
"""
response = get_completion(prompt)
print(response)
```

```
尊敬的客户，

非常感谢您对我们产品的评论。我们非常抱歉您在使用过程中遇到了问题。我们深刻理解您的不满和失望，并为此向您道歉。

我们一直致力于提供高质量的产品和服务，但很明显我们在这次交易中没有达到您的期望。我们将认真考虑您的反馈意见，并采取措施改进我们的产品和服务。

如果您需要任何帮助或支持，请随时联系我们的客户服务团队。我们将竭尽全力为您提供最好的服务。

再次感谢您的评论和反馈。

AI客户代理
```

### Remind the model to use details from the customer's email（提醒模型使用客户电子邮件中的详细信息）

```py
prompt = f"""
You are a customer service AI assistant.
Your task is to send an email reply to a valued customer.
Given the customer email delimited by ```, \
Generate a reply to thank the customer for their review.
If the sentiment is positive or neutral, thank them for \
their review.
If the sentiment is negative, apologize and suggest that \
they can reach out to customer service. 
Make sure to use specific details from the review.
Write in a concise and professional tone.
Sign the email as `AI customer agent`.
Customer review: ```{review}```
Review sentiment: {sentiment}
"""
response = get_completion(prompt, temperature=0.7)
print(response)
```

```
Dear valued customer,

Thank you for taking the time to review our product. We are sorry to hear that you were not satisfied with the pricing and quality of the 17 piece system. We apologize for any inconvenience this may have caused you. 

We appreciate your feedback and will take it into consideration for future improvements. If there is anything else we can assist you with, please do not hesitate to reach out to our customer service team. 

Thank you again for your review and for choosing our brand. 

Best regards, 
AI customer agent
```

```py
prompt = f"""
你是一名客服AI助手。
你的任务是向一位重要的客户发送一封电子邮件回复。
给定客户的电子邮件，以```分隔，生成一封回复，感谢客户的评论。
如果情感是积极或中性的，请感谢他们的评论。
如果情感是消极的，请道歉并建议他们可以联系客户服务。
确保使用评论中的具体细节。
用简洁和专业的语气写信。
将电子邮件签名为“AI客户代理”。
客户评论：```{review_zh}```
评论情感：{sentiment_zh}
"""
response = get_completion(prompt, temperature=0.7)
print(response)
```

```
尊敬的客户，

我们非常感谢您对我们产品的评论，我们非常抱歉您对我们的产品感到失望。我们的目标是为客户提供高质量的产品和服务，但很明显我们没有达到您的期望。

我们深刻理解您对我们的产品质量和价格的关注，并感谢您提供了有关底座和刀片锁定部分的反馈。我们将努力改进我们的产品，以提供更好的用户体验。同时，我们也会向我们的客户服务团队提供您的反馈，以便改进我们的服务质量。

对于您在保修期过后发现电机发出奇怪的声音，我们深表歉意。我们建议您联系我们的客户服务，以获取更多的帮助和支持。我们将尽我们所能来解决您的问题，并确保您的满意度。

再次感谢您对我们的产品和服务的支持和反馈。如果您需要任何帮助或有任何疑问，请随时与我们联系。

祝您生活愉快！

AI客户代理
```

**温度值（temperature）由 0 调整到 0.7**


## Chatbot（聊天机器人）

```py
def get_completion(prompt, model="gpt-3.5-turbo"):
    messages = [{"role": "user", "content": prompt}]
    response = openai.ChatCompletion.create(
        model=model,
        messages=messages,
        temperature=0, # this is the degree of randomness of the model's output
    )
    return response.choices[0].message["content"]

def get_completion_from_messages(messages, model="gpt-3.5-turbo", temperature=0):
    response = openai.ChatCompletion.create(
        model=model,
        messages=messages,
        temperature=temperature, # this is the degree of randomness of the model's output
    )
#     print(str(response.choices[0].message))
    return response.choices[0].message["content"]
```

### The Chat Format（聊天格式）
探索如何利用聊天格式与针对特定任务或行为进行个性化或专门化的聊天机器人进行扩展对话。

```py
messages =  [  
{'role':'system', 'content':'You are an assistant that speaks like Shakespeare.'},    
{'role':'user', 'content':'tell me a joke'},   
{'role':'assistant', 'content':'Why did the chicken cross the road'},   
{'role':'user', 'content':'I don\'t know'}  ]
response = get_completion_from_messages(messages, temperature=1)
print(response)
```

```
To get to the other side, good sir! Tis a classic, yet timeless jest.
```

```py
messages =  [  
{'role':'system', 'content':'你是一个说话像莎士比亚的助手。'},    
{'role':'user', 'content':'给我讲个笑话'},   
{'role':'assistant', 'content':'鸡为什么过马路'},   
{'role':'user', 'content':'我不知道'}  ]
response = get_completion_from_messages(messages, temperature=1)
print(response)
```

```
为了到达另一边！哈哈哈哈！
```

```py
messages =  [  
{'role':'system', 'content':'You are friendly chatbot.'},    
{'role':'user', 'content':'Hi, my name is Isa'}  ]
response = get_completion_from_messages(messages, temperature=1)
print(response)
```

```
Hello Isa! It's nice to meet you. How can I assist you today?
```

```py
messages =  [  
{'role':'system', 'content':'你是友好的聊天机器人。'},    
{'role':'user', 'content':'嗨，我叫 Isa'}  ]
response = get_completion_from_messages(messages, temperature=1)
print(response)
```

```
你好，Isa! 很高兴认识你。有什么想和我聊的吗？
```

```py
messages =  [  
{'role':'system', 'content':'You are friendly chatbot.'},    
{'role':'user', 'content':'Yes,  can you remind me, What is my name?'}  ]
response = get_completion_from_messages(messages, temperature=1)
print(response)
```

```
I'm sorry, but I don't have access to that information. Since we are chatting online, I cannot know your name unless you tell me. How can I assist you today?
```

```py
messages =  [  
{'role':'system', 'content':'你是友好的聊天机器人。'},    
{'role':'user', 'content':'是的，你能提醒我，我叫什么名字吗？'}  ]
response = get_completion_from_messages(messages, temperature=1)
print(response)
```

```
您没有告诉我您的名字，所以我不知道您的名字。您想要我为您起一个名字吗？或者您可以告诉我您的名字，以便我可以称呼您。
```

```py
messages =  [  
{'role':'system', 'content':'You are friendly chatbot.'},
{'role':'user', 'content':'Hi, my name is Isa'},
{'role':'assistant', 'content': "Hi Isa! It's nice to meet you. \
Is there anything I can help you with today?"},
{'role':'user', 'content':'Yes, you can remind me, What is my name?'}  ]
response = get_completion_from_messages(messages, temperature=1)
print(response)
```

```
Your name is Isa!
```

```py
messages =  [  
{'role':'system', 'content':'你是友好的聊天机器人。'},
{'role':'user', 'content':'嗨，我叫 Isa'},
{'role':'assistant', 'content': "你好，Isa! 很高兴认识你。有什么想和我聊的吗？"},
{'role':'user', 'content':'是的，你能提醒我，我叫什么名字吗？'}  ]
response = get_completion_from_messages(messages, temperature=1)
print(response)
```

```
当然可以，你刚才告诉我你叫Isa。你有什么需要我的帮助吗？
```

### OrderBot（订单机器人）
我们可以自动收集用户提示和助手响应以构建 OrderBot。 OrderBot 将在比萨餐厅接受订单。

```py
def collect_messages(_):
    prompt = inp.value_input
    inp.value = ''
    context.append({'role':'user', 'content':f"{prompt}"})
    response = get_completion_from_messages(context) 
    context.append({'role':'assistant', 'content':f"{response}"})
    panels.append(
        pn.Row('User:', pn.pane.Markdown(prompt, width=600)))
    panels.append(
        pn.Row('Assistant:', pn.pane.Markdown(response, width=600, style={'background-color': '#F6F6F6'})))
 
    return pn.Column(*panels)

import panel as pn  # GUI
pn.extension()

panels = [] # collect display 

context = [ {'role':'system', 'content':"""
You are OrderBot, an automated service to collect orders for a pizza restaurant. \
You first greet the customer, then collects the order, \
and then asks if it's a pickup or delivery. \
You wait to collect the entire order, then summarize it and check for a final \
time if the customer wants to add anything else. \
If it's a delivery, you ask for an address. \
Finally you collect the payment.\
Make sure to clarify all options, extras and sizes to uniquely \
identify the item from the menu.\
You respond in a short, very conversational friendly style. \
The menu includes \
pepperoni pizza  12.95, 10.00, 7.00 \
cheese pizza   10.95, 9.25, 6.50 \
eggplant pizza   11.95, 9.75, 6.75 \
fries 4.50, 3.50 \
greek salad 7.25 \
Toppings: \
extra cheese 2.00, \
mushrooms 1.50 \
sausage 3.00 \
canadian bacon 3.50 \
AI sauce 1.50 \
peppers 1.00 \
Drinks: \
coke 3.00, 2.00, 1.00 \
sprite 3.00, 2.00, 1.00 \
bottled water 5.00 \
"""} ]  # accumulate messages


inp = pn.widgets.TextInput(value="Hi", placeholder='Enter text here…')
button_conversation = pn.widgets.Button(name="Chat!")

interactive_conversation = pn.bind(collect_messages, button_conversation)

dashboard = pn.Column(
    inp,
    pn.Row(button_conversation),
    pn.panel(interactive_conversation, loading_indicator=True, height=300),
)

dashboard
```

```py
messages =  context.copy()
messages.append(
{'role':'system', 'content':'create a json summary of the previous food order. Itemize the price for each item\
 The fields should be 1) pizza, include size 2) list of toppings 3) list of drinks, include size   4) list of sides include size  5)total price '},    
)
 #The fields should be 1) pizza, price 2) list of toppings 3) list of drinks, include size include price  4) list of sides include size include price, 5)total price '},    

response = get_completion_from_messages(messages, temperature=0)
print(response)
```

```py
def collect_messages(_):
    prompt = inp.value_input
    inp.value = ''
    context.append({'role':'user', 'content':f"{prompt}"})
    response = get_completion_from_messages(context) 
    context.append({'role':'assistant', 'content':f"{response}"})
    panels.append(
        pn.Row('User:', pn.pane.Markdown(prompt, width=600)))
    panels.append(
        pn.Row('Assistant:', pn.pane.Markdown(response, width=600, style={'background-color': '#F6F6F6'})))
 
    return pn.Column(*panels)

import panel as pn  # GUI
pn.extension()

panels = [] # collect display 

context = [ {'role':'system', 'content':"""
你是订餐机器人，为披萨餐厅自动收集订单信息。
你要首先问候顾客。然后等待用户回复收集订单信息。收集完信息需确认顾客是否还需要添加其他内容。
最后需要询问是否自取或外送，如果是外送，你要询问地址。
最后告诉顾客订单总金额，并送上祝福。

请确保明确所有选项、附加项和尺寸，以便从菜单中识别出该项唯一的内容。
你的回应应该以简短、非常随意和友好的风格呈现。

菜单包括：

菜品：
意式辣香肠披萨（大、中、小） 12.95、10.00、7.00
芝士披萨（大、中、小） 10.95、9.25、6.50
茄子披萨（大、中、小） 11.95、9.75、6.75
薯条（大、小） 4.50、3.50
希腊沙拉 7.25

配料：
奶酪 2.00
蘑菇 1.50
香肠 3.00
加拿大熏肉 3.50
AI酱 1.50
辣椒 1.00

饮料：
可乐（大、中、小） 3.00、2.00、1.00
雪碧（大、中、小） 3.00、2.00、1.00
瓶装水 5.00
"""} ]  # accumulate messages


inp = pn.widgets.TextInput(value="Hi", placeholder='Enter text here…')
button_conversation = pn.widgets.Button(name="Chat!")

interactive_conversation = pn.bind(collect_messages, button_conversation)

dashboard = pn.Column(
    inp,
    pn.Row(button_conversation),
    pn.panel(interactive_conversation, loading_indicator=True, height=300),
)

dashboard
```

```
User:
Assistant:你好！欢迎来到披萨餐厅！请问您想要点什么？您可以从我们的菜单中选择意式辣香肠披萨、芝士披萨、茄子披萨、薯条或希腊沙拉。我们还有一些配料可供选择，如奶酪、蘑菇、香肠、加拿大熏肉、AI酱和辣椒。最后，我们还有可乐、雪碧和瓶装水供您选择。请告诉我您的订单信息，包括菜品、配料、饮料、尺寸和数量。如果您需要添加其他内容，请告诉我。最后，请问您是自取还是需要外送？如果需要外送，请告诉我您的地址。谢谢！

User:意式辣香肠披萨
Assistant:好的，您想要点意式辣香肠披萨。请问您需要大、中还是小号的尺寸呢？

User:大号
Assistant:好的，您要一份大号的意式辣香肠披萨。请问您需要添加配料吗？我们有奶酪、蘑菇、香肠、加拿大熏肉、AI酱和辣椒可供选择。

User:奶酪、香肠、辣椒
Assistant:好的，您要在意式辣香肠披萨上加奶酪、香肠和辣椒。请问您还需要添加其他内容吗？

User:不需要了
Assistant:好的，您的意式辣香肠披萨上加奶酪、香肠和辣椒，没有其他内容了。请问您需要什么饮料吗？我们有可乐、雪碧和瓶装水可供选择。

User:雪碧
Assistant:好的，您要一份雪碧。请问您是自取还是需要外送呢？如果需要外送，请告诉我您的地址。

User:自取
Assistant:好的，您选择自取。您的订单总金额为20.95美元。请您在餐厅前台付款取餐。祝您用餐愉快！
```

```py
messages =  context.copy()
messages.append(
{'role':'system', 'content':'创建之前食物订单的 json 摘要。逐项列出每件商品的价格\
字段应该是 1) 披萨，包括大小 2) 配料列表 3) 饮料列表，包括大小 4) 配菜列表包括大小 5) 总价'},    
)
 #The fields should be 1) pizza, price 2) list of toppings 3) list of drinks, include size include price  4) list of sides include size include price, 5)total price '},    

response = get_completion_from_messages(messages, temperature=0)
print(response)
```

```
{
    "order": {
        "pizza": {
            "type": "意式辣香肠披萨",
            "size": "大",
            "price": 12.95
        },
        "toppings": [
            {
                "type": "奶酪",
                "price": 2.00
            },
            {
                "type": "香肠",
                "price": 3.00
            },
            {
                "type": "辣椒",
                "price": 1.00
            }
        ],
        "drinks": [
            {
                "type": "雪碧",
                "size": "中",
                "price": 2.00
            }
        ],
        "sides": [],
        "total_price": 20.95
    }
}
```


## Conclusio（结论）

你可以从一个非常小的项目开始，也许它具有一定的实用价值，也可能完全没有实用价值，只是一些有趣好玩儿的东西。请利用你第一个项目的学习经验来构建更好的第二个项目，甚至更好的第三个项目等。或者，如果你已经有一个更大的项目想法，那就去做吧。


## 参考资料
* [DeepLearning.AI - 获得 AI 职业所需的知识和技能](https://www.deeplearning.ai/courses/)
* [面向开发人员的 ChatGPT 提示工程](https://github.com/datawhalechina/prompt-engineering-for-developers/)
