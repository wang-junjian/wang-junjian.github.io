---
layout: post
title:  "ChatGLM-6B 模型基于 P-Tuning v2 微调的自定义数据集"
date:   2023-04-22 08:00:00 +0800
categories: ChatGLM-6B
tags: [ChatGLM, fine-tuning, P-Tuning, 安规]
---

## Electrical Safety Work Procedures (电力安全工作规程) 数据

| 专业 | 题型 | 题目内容 | 题目依据条款 | 选项 | 正确答案 |
| --- | --- | --- | --- | --- | --- |
| 变电专业 | 单选题 | 雷雨天气，需要巡视室外高压设备时，应穿（　　），并不准靠近避雷器和避雷针。 | 来自安规 | A. 雨鞋,B. 绝缘靴,C. 橡胶鞋,D. 绝缘鞋 | B. 绝缘靴 |
| 变电专业 | 单选题 | 地震、台风、洪水、泥石流等灾害发生后，如需要对设备进行巡视时，应制定必要的安全措施，得到设备运维管理单位批准，并至少两人一组，巡视人员应与（　　）之间保持通信联络。 | 来自安规 | A. 分管领导,B. 调控人员,C. 派出部门,D. 运维单位 | C. 派出部门 |
| 变电专业 | 单选题 | 高压设备发生接地时，室内人员应距离故障点（　　）m以外。 | 来自安规 | A. 1,B. 2,C. 3,D. 4 | D. 4 |
| 变电专业 | 判断题 | 禁止在只经断路器（开关）断开电源或只经换流器闭锁隔离电源的设备上工作。 | 来自安规 | A. 正确,B. 错误 | A. 正确 |
| 变电专业 | 判断题 | 在电气设备上工作，对难以做到与电源完全断开的检修设备，可以不拆除设备与电源之间的电气连接。 | 来自安规 | A. 正确,B. 错误 | B. 错误 |
| 变电专业 | 判断题 | 表示设备断开和允许进入间隔的信号、经常接入的电压表等，如果指示有电，在排除异常情况前，禁止在设备上工作。 | 来自安规 | A. 正确,B. 错误 | A. 正确 |
| 变电专业 | 多选题 | 线路的停、送电均应按照（　　）的指令执行。 | 来自安规 | A. 值班调控人员,B. 专责监护人,C. 线路工作负责人,D. 线路工作许可人 | A. 值班调控人员,D. 线路工作许可人 |
| 变电专业 | 多选题 | 值班调控人员或线路工作许可人应将线路停电检修的工作班组数目、（　　）做好记录。 | 来自安规 | A. 工作班成员姓名,B. 工作负责人姓名,C. 工作地点,D. 工作任务 | B. 工作负责人姓名,C. 工作地点,D. 工作任务 |
| 变电专业 | 多选题 | 工作结束时，应得到工作负责人（包括用户）的工作结束报告，确认（　　），方可下令拆除变电站或发电厂内的安全措施，向线路送电。 | 来自安规 | A. 所有工作班组均已竣工,B. 接地线已拆除,C. 作业人员已全部撤离线路,D. 与记录核对无误并做好记录 | A. 所有工作班组均已竣工,B. 接地线已拆除,C. 作业人员已全部撤离线路,D. 与记录核对无误并做好记录 |

## 数据集
### 训练集 1（一问一答）
```json
[
    {"content": "雷雨天气，需要巡视室外高压设备时，应穿___，并不准靠近避雷器和避雷针。", "summary": "绝缘靴"},
    {"content": "禁止在只经断路器（开关）断开电源或只经换流器闭锁隔离电源的设备上工作。", "summary": "正确"},
    {"content": "线路的停、送电均应按照___的指令执行。", "summary": "值班调控人员; 线路工作许可人"}
]
```

### 训练集 2（带选项）
```json
[
    {"content": "雷雨天气，需要巡视室外高压设备时，应穿___，并不准靠近避雷器和避雷针。\nA. 雨鞋\nB. 绝缘靴\nC. 橡胶鞋\nD. 绝缘鞋\n", "summary": "B. 绝缘靴"},
    {"content": "禁止在只经断路器（开关）断开电源或只经换流器闭锁隔离电源的设备上工作。\nA. 正确\nB. 错误\n", "summary": "A. 正确"},
    {"content": "线路的停、送电均应按照___的指令执行。\nA. 值班调控人员\nB. 专责监护人\nC. 线路工作负责人\nD. 线路工作许可人\n", "summary": "A. 值班调控人员\nD. 线路工作许可人"}
]
```

## [模型微调]({% post_url 2023-04-13-test-chatglm6b-on-macbook-pro-m2-max %}#微调-chatglm-6b-pt)

## 安规答题机器人
```py
import os
import platform
import torch
from transformers import AutoConfig, AutoTokenizer, AutoModel

PRETRAINED_MODEL_NAME = "THUDM/chatglm-6b"
CHECKPOINT_PATH = 'output/adgen-chatglm-6b-pt-128-2e-2/checkpoint-3000/'

tokenizer = AutoTokenizer.from_pretrained(PRETRAINED_MODEL_NAME, trust_remote_code=True)

config = AutoConfig.from_pretrained(PRETRAINED_MODEL_NAME, trust_remote_code=True, pre_seq_len=128)
model = AutoModel.from_pretrained(PRETRAINED_MODEL_NAME, config=config, trust_remote_code=True)

# 加载微调的参数
prefix_state_dict = torch.load(os.path.join(CHECKPOINT_PATH, "pytorch_model.bin"))
new_prefix_state_dict = {}
for k, v in prefix_state_dict.items():
    if k.startswith("transformer.prefix_encoder."):
        new_prefix_state_dict[k[len("transformer.prefix_encoder."):]] = v 
model.transformer.prefix_encoder.load_state_dict(new_prefix_state_dict)

#model = model.quantize(4)
model = model.half().cuda()
model.transformer.prefix_encoder.float()
model = model.eval()

os_name = platform.system()
clear_command = 'cls' if os_name == 'Windows' else 'clear'
stop_stream = False

os.system(clear_command)

PROMPT = "我是机器人🤖【小安】，可以回答电力安全工作规程的试题，题型包括（单选题、多选题、判断题）。\n👉 clear 清除屏幕信息\n👉 stop 或 exit 退出程序。"
PROMPT_ASK = "🙋: "
PROMPT_ANSWER = "🤖: "


def main():
    print(PROMPT)

    while True:
        query = input(f"\n\n{PROMPT_ASK}")

        if query.strip() in ("stop", "exit"):
            break
        elif query == 'clear':
            os.system(clear_command)
            print(PROMPT)
            continue

        print(PROMPT_ANSWER, end='', flush=True)

        prev_response_len = 0 
        for response, _ in model.stream_chat(tokenizer, query, temperature=0.01, top_p=1):
            print(response[prev_response_len:], end='', flush=True)
            prev_response_len = len(response)


if __name__ == "__main__":
    main()
```

## 测试
```
我是机器人🤖【小安】，可以回答电力安全工作规程的试题，题型包括（单选题、多选题、判断题）。
👉 clear 清除屏幕信息
👉 stop 或 exit 退出程序。
```

### 问答模式
```
🙋: 雷雨天气，需要巡视室外高压设备时，应穿( )，并不准靠近避雷器和避雷针。
🤖: 绝缘靴

🙋: 高压设备发生接地时，室内人员应距离故障点( )m以外。
🤖: 4

🙋: 用户变、配电站的工作许可人应是持有效证书的高压电气工作人员。
🤖: 正确

🙋: 专责监护人临时离开时，应指定一名工作人员担任临时监护人。
🤖: 错误

🙋: 专责监护人临时离开，应该指定一名工作人员临时担任。
🤖: 错误

🙋: 低压电气带电工作，禁止使用( )等工具。
🤖: 锉刀； 金属尺； 带有金属物的毛刷； 带有金属物的毛掸
```

### 做题模式
```
🙋: 高压设备发生接地时，室外人员应距离故障点( )m以外。 选项：A. 2; B. 4; C. 6; D. 8; 
🤖: D. 8

🙋: 高压设备发生接地时，室外人员应距离故障点( )m以外。 选项：A. 8; B. 6; C. 4; D. 2;
🤖: A. 8

🙋: 表示设备断开和允许进入间隔的信号、经常接入的电压表等，如果指示有电，在排除异常情况前，禁止在设备上工作。 选项：A. 正确; B. 错误;
🤖: A. 正确

🙋: 值班调控人员或线路工作许可人应将线路停电检修的工作班组数目、( )做好记录。 选项：A. 工作班成员姓名; B. 工作负责人姓名; C. 工作地点; D. 工作任务;
🤖: B. 工作负责人姓名； C. 工作地点； D. 工作任务
```

```
🙋: stop
```

## 经验
### 总结
#### 数据集
{% highlight wjj %}
我们应该改写成人类对话形式的数据集来进行训练。
{% endhighlight %}

#### 训练
{% highlight wjj %}
max_source_length 200
max_target_length 256
根据您的数据集中的最大输入长度（max_source_length）和输出长度（max_target_length）进行调整。
{% endhighlight %}

#### 推理
{% highlight wjj %}
不能使用会话模式，因为会话模式会把上下文信息都加入到输入中，导致模型无法正确预测。
temperature=0.01, top_p=1，可以得到稳定的结果。
{% endhighlight %}

#### 问答
{% highlight wjj %}
因为大模型是基于语义的，所以我们的问题可以不用完全按照原题进行提问，只要语义相近即可。
在进行提问时，我们可以将选项进行编号互换，同样能够得到正确答案。
多选题的答案互换后，有时候会得到错误答案。
{% endhighlight %}

### 参数 temperature
参数 temperature 是用于控制生成文本的创造性和多样性的参数之一。它是一个介于0和1之间的浮点数，表示在生成文本的每一步中，模型应该考虑的词汇概率分布的“混乱程度”。

具体来说，temperature 参数会对词汇概率分布进行重新加权，使得更低概率的单词有更高的可能性被选择，而更高概率的单词则有更低的可能性被选择。这种重新加权的过程可以使生成的文本更加多样化和创造性，因为模型将会有更多的选择，而不仅仅是选择概率最高的单词。

需要注意的是，temperature 参数的取值范围是0到1之间，值越小，生成的文本就越保守和可预测，值越大，生成的文本就越多样化和创造性，但也可能会导致语法和连贯性等方面的问题。因此，在使用 temperature 参数时，需要根据具体的应用场景和需求来选择合适的取值范围。

### 参数 top_p
参数 top_p 用于控制生成文本的多样性。top_p 是一个介于0和1之间的浮点数，表示在生成文本的每一步中，模型应该考虑的词汇概率分布的范围。具体来说，top_p 参数会动态地调整模型对下一个单词的选择范围，以确保总概率总是达到 top_p。

举例来说，如果 top_p 设置为0.9，则模型将在每一步中选择总概率最高的前90%的单词，而不是仅仅选择最高概率的单词。这样可以使生成的文本更加多样化和有趣，因为模型将有更多的选择。

### 参数 temperature 和 top_p 的组合使用
top_p 和 temperature 用于控制生成文本多样性和创造性的两个重要参数，它们可以单独使用，也可以组合使用来获得更好的效果。

一般来说，可以根据以下几个方面来区分和组合使用这两个参数：

1. 多样性 vs 创造性：temperature 参数更加关注生成文本的创造性和多样性，而 top_p 参数则更加关注生成文本的多样性。因此，如果需要生成更加创造性和多样化的文本，可以适当提高 temperature 参数的取值；如果需要保持一定的连贯性和减少错误，可以适当提高 top_p 参数的取值。

2. 应用场景：不同的应用场景对多样性和创造性的要求不同。例如，需要生成新闻报道的文本时，可能需要保持一定的连贯性和准确性，而生成小说或诗歌时则需要更加创造性和多样化。因此，在不同的场景下可以调整参数的取值。

3. 结果评估：在使用这些参数时，需要根据具体的结果进行评估和调整。可以通过人工评估、自动评估和交叉验证等方式来评估生成文本的质量和多样性，并适当调整参数的取值。

综上所述，top_p 和 temperature 参数可以根据具体的应用场景和需求来进行区分和组合使用，以获得更好的生成文本效果。

## 参考资料
* [ChatGLM-6B/ptuning](https://github.com/THUDM/ChatGLM-6B/tree/main/ptuning)
* [ChatGLM-6B-PT](https://github.com/THUDM/ChatGLM-6B/blob/main/ptuning/README.md)
