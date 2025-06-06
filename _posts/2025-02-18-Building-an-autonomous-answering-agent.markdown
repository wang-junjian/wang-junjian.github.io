---
layout: single
title:  "构建自主答题的智能体"
date:   2025-02-18 10:00:00 +0800
categories: 答题 Agent
tags: [安规, Agent, Ollama, 多模态, LLM]
---

## 目标

这里想探索使用`多模态大模型`答题的技术方案，包含单选题、多选题、判断题，最终构建自主答题的智能体。

工作流程：🏞️ `->` MLM（多模态大模型）`->` 答案

### 📝思路一

直接使用多模态大模型读题（转成文字），然后检索答案，把题和答案组合的提示词输入给语言大模型。

> 我使用了 Ollama 调用多模态大模型 `minicpm-v:8b` 来生成文字。*`llava:7b` 的效果不好。*

代码示例：

```
import ollama

response = ollama.chat(
	model="minicpm-v:8b",
	messages=[
		{
			'role': 'user',
			'content': '读取图像中的题。',
			'images': ['ti.png']
		}
	]
)

print(response['message']['content'])
```

```
这幅图片显示的是一个手机屏幕截图，内容是一个关于信息安全的多选题目界面。屏幕上部展示了时间“10:12”和信号、电池状态等图标。

中间部分是问题区域，“每月一考”的标题下面是一道多选题：“根据信息安规规定，升级（）、升级（）或（）版本前，应确认其兼容性及对业务系统的影响。”

选项包括：
A. 特征库
B. 操作系统
C. 数据库
D. 中间件版本

屏幕底部有“上一题”和“下一题”的按钮。
```

> 小模型对指令的理解能力有限。

### 🏞️思路二

把题的图像和答案（文字）组合的提示词输入给多模态大模型。

> 使用 Ollama 调用多模态大模型 `minicpm-v:8b` 和 `llava:7b` 进行测试达不到预期的效果。

代码示例：

```
import ollama

response = ollama.chat(
	model="minicpm-v:8b",
	messages=[
		{
			'role': 'user',
			'content': '使用下面的 `参考答案` 回答图像中的问题，注意图像中的选项是乱序的。\n\n## 参考答案\n```\n题目：根据信息安规规定，升级（    ）、（    ）或（    ）版本前，应确认其兼容性及对业务系统的影响。\n选项：A. 操作系统,B. 数据库,C. 中间件版本,D. 特征库\n答案：A,B,C\n```\n',
			'images': ['ti.png']
		}
	]
)

print(response['message']['content'])
```

```
根据信息安规规定，在升级操作系统、数据库或中间件版本之前，应该确认这些更新的兼容性及其对业务系统的影响。因此，参考答案是：

1. 操作系统 (选项 A)
2. 数据库 (选项 C)
3. 中间件版本 (选项 B)

所以正确答案为：A, C, 和B
```


## 单选题（Single Choice）

![](/images/2025/LLMTest/single-choice.png)

### 思路一

#### 提示词

##### 单选题
18. 根据信息安规规定，在工作票制度中, 三类业务系统的( )等检修工作是应填用信息工作任务单或信息工作票的工作。
A、版本升级、漏洞修复、数据操作
B、系统下线、版本升级、数据操作
C、系统下线、版本升级、漏洞修复
D、版本升级、漏洞修复、系统下线

使用下面的 `参考答案` 回答上面的 `问题`。参考答案是为了告诉你哪个内容组合是正确的，但参考答案中的选项字母是针对参考答案自身选项顺序的，并不一定直接对应到原始问题的选项。你的任务是：
- 确定参考答案中哪个选项的内容是正确的，因为原始问题中选项可能是乱序的。
- 在原始问题提供的选项 (A, B, C, D) 中，找到包含相同内容的选项。
- 最终答案是原始问题中找到的选项的字母。
- 不要输出答案以外的内容。

##### 参考答案
```
题目：根据信息安规规定，在工作票制度中, 三类业务系统的(    )等检修工作是应填用信息工作任务单或信息工作票的工作。
选项：A. 版本升级、漏洞修复、系统下线,B. 版本升级、漏洞修复、数据操作,C. 系统下线、版本升级、数据操作,D. 系统下线、版本升级、漏洞修复
答案：B
```


## 多选题（Multiple Choice）

![](/images/2025/LLMTest/multiple-choice.png)

### 思路一

#### 提示词1

##### 问题
1、根据信息安规规定，升级（ ）、（）或（）版本前，应确认其兼容性及对业务系统的影响。

选项部分：
A. 特征库
B. 操作系统
C. 数据库
D. 中间件版本

使用下面的 `参考答案` 回答上面的 `问题`，注意 `问题` 中的选项是乱序的，答案请以逗号分隔的字母形式输出。

##### 参考答案
```
题目：根据信息安规规定，升级（    ）、（    ）或（    ）版本前，应确认其兼容性及对业务系统的影响。
选项：A. 操作系统,B. 数据库,C. 中间件版本,D. 特征库
答案：A,B,C
```

#### 提示词2

使用 `参考答案` 回答 `问题`。
- `问题` 中的选项是乱序的
- 答案请以逗号分隔的字母形式输出，例如：A,B,C。

##### 问题
1、根据信息安规规定，升级（ ）、（）或（）版本前，应确认其兼容性及对业务系统的影响。

选项部分：
A. 特征库
B. 操作系统
C. 数据库
D. 中间件版本

##### 参考答案
```
题目：根据信息安规规定，升级（    ）、（    ）或（    ）版本前，应确认其兼容性及对业务系统的影响。
选项：A. 操作系统,B. 数据库,C. 中间件版本,D. 特征库
答案：A,B,C
```

#### 提示词3

##### 多选题
1、根据信息安规规定，升级（ ）、（）或（）版本前，应确认其兼容性及对业务系统的影响。

选项部分：
A. 特征库
B. 操作系统
C. 数据库
D. 中间件版本

使用下面的 `参考答案` 回答上面的 `问题`。参考答案是为了告诉你哪个内容组合是正确的，但参考答案中的选项字母是针对参考答案自身选项顺序的，并不一定直接对应到原始问题的选项。你的任务是：
- 确定参考答案中哪个选项的内容是正确的，因为原始问题中选项可能是乱序的。
- 在原始问题提供的选项 (A, B, C, D) 中，找到包含相同内容的选项。
- 最终答案是原始问题中找到的选项的字母，并以逗号分隔的形式输出。
- 不要输出答案以外的内容。

##### 参考答案
```
题目：根据信息安规规定，升级（    ）、（    ）或（    ）版本前，应确认其兼容性及对业务系统的影响。
选项：A. 操作系统,B. 数据库,C. 中间件版本,D. 特征库
答案：A,B,C
```

**提示词2的结果不如提示词1的好，提示词3的结果最棒，写好提示词非常重要。**

### 思路二

#### 提示词

`[题的图像]`

使用下面的 `参考答案` 回答图像的 `问题`，注意 `问题` 中的选项是乱序的，答案请以逗号分隔的字母形式输出。

##### 参考答案
```
题目：根据信息安规规定，升级（    ）、（    ）或（    ）版本前，应确认其兼容性及对业务系统的影响。
选项：A. 操作系统,B. 数据库,C. 中间件版本,D. 特征库
答案：A,B,C
```

### 测试结果

- ✅ 表示回答正确
- ❌ 表示回答错误
- `-` 表示模型不支持图像输入

#### [Gemini (Google)](https://gemini.google.com/app)

| 模型 | 📝思路一（提示词1） | 📝思路一（提示词3） | 🏞️思路二 |
| --- | --- | --- | --- |
| Gemini 2.0 Flash | ✅ | ✅ | ❌ |
| Gemini 2.0 Flash Thinking Experimental | ✅ | ✅ | ✅ |
| Gemini 1.5 | ❌ | ✅ | ❌ |

#### [Qwen (阿里巴巴)](https://chat.qwenlm.ai/)

| 模型 | 📝思路一（提示词1） | 📝思路一（提示词3） | 🏞️思路二 |
| --- | --- | --- | --- |
| Qwen2.5-Max | ✅ | ✅ | - |
| Qwen2.5-Plus | ❌ | ✅ | - |
| Qwen2.5-VL-72B-Instruct | ❌ | ✅ | ✅ |
| Qwen2.5-14B-Instruct-1M | ❌ | ❌ | - |
| QwQ-32B-Preview | ❌ | ❌ | - |
| Qwen2.5-Coder-32B-Instruct | ✅ | ✅ | - |

#### [Kimi (月之暗面)](https://kimi.moonshot.cn/chat)

| 模型 | 📝思路一（提示词1） | 📝思路一（提示词3） | 🏞️思路二 |
| --- | --- | --- | --- |
| Kimi | ✅ | ✅ | ✅ |
| k1.5 长思考 | ❌ | ✅ | ❌ |

#### [DeepSeek (深度求索)](https://chat.deepseek.com/)

| 模型 | 📝思路一（提示词1） | 📝思路一（提示词3） | 🏞️思路二 |
| --- | --- | --- | --- |
| DeekSeek-V3 | ❌ | ❌ | ❌ |
| DeekSeek-R1 | ❌ | ✅ | ✅ |

#### [GitHub Copilot](https://github.com/copilot)

| 模型 | 📝思路一（提示词1） |
| --- | --- |
| Claude 3.5 Sonnet (Preview) | ✅ |
| Gemini 2.0 Flash (Preview) | ✅ |
| GPT-4o | ✅ |
| o1 (Preview) | ✅ |
| o3-mini (Preview) | ✅ |

#### [Poe](https://poe.com/)

| 模型 | 📝思路一（提示词1） | 📝思路一（提示词3） | 🏞️思路二 |
| --- | --- | --- | --- |
| Gemini-2.0-Flash | ✅ | ✅ | ✅ |
| GPT-4o-Mini | ✅ | ✅ | ✅ |
| GPT-4o | ❌ | ✅ | ✅ |
| Claude-3-Haiku | ❌ | ❌ | ❌ |
| Assistant | ❌ | ✅ | ❌ |
| Deepseek-V3-FW | ❌ | ✅ | - |
| Llama-3-70b-Groq | ❌ | ✅ | - |

#### [Chatbot Arena](https://lmarena.ai/)

| 模型 | 📝思路一（提示词1） | 📝思路一（提示词3） | 🏞️思路二 |
| --- | --- | --- | --- |
| grok-3 | ❌ | ✅ | ❌ |
| o3-mini | ✅ | ✅ | - |
| mistral-large-2411 | ✅ | ✅ | - |
| amazon-nova-pro-v1.0 | ❌ | ❌ | ❌ |
| hunyuan-large-2025-02-10 | ❌ | ❌ | - |
| yi-lightning | ❌ | ❌ | - |
| glm-4-plus | ❌ | ❌ | - |
| step-2-16k-exp-202412 | ❌ | ✅ | - |
| step-1o-vision-32k-highres | ❌ | ✅ | ✅ |
| llama-3.1-405b-instruct-bf16 | ❌ | ✅ | - |
| llama-3.1-70b-instruct | ❌ | ✅ | - |
| llama-3.2-vision-90b-instruct | ❌ | ❌ | ❌ |
| llama-3.1-tulu-3-8b | ❌ | ❌ | - |
| llama-3.1-tulu-3-70b | ✅ | ✅ | - |
| nemotron-4-340b | ❌ | ❌ | - |
| reka-core-20240904 | ❌ | ✅ | ❌ |
| reka-flash-20240904 | ❌ | ❌ | ❌ |
| jamba-1.5-large | ❌ | ❌ | - |
| athene-v2-chat | ❌ | ✅ | - |
| c4ai-aya-expanse-32b | ❌ | ✅ | - |
| command-r-plus-08-2024 | ❌ | ✅ | - |
| qwen2.5-coder-32b-instruct | ✅ | - |
| codestral-2405 | ❌ | ❌ | - |
| qwq-32b-preview | ❌ | ❌ | - |
| phi-4 | ❌ | ❌ | - |

#### [Ollama](https://ollama.com/)

| 模型 | 📝思路一（提示词1） | 📝思路一（提示词3） | 🏞️思路二 |
| --- | --- | --- | --- |
| DeepSeek-R1-Distill-Qwen-7B | ❌ | ❌ | - |
| DeepSeek-R1-Distill-Qwen-14B | ❌ | ❌ | - |
| DeepSeek-R1-Distill-Qwen-32B | ❌ | ✅ | - |
| llava:7b |  |  | ❌ |
| minicpm-v:8b |  |  | ❌ |
| llama3.2-vision:latest |  |  | ❌ |
