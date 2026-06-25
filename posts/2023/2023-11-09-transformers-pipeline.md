---
type: article
title:  "Transformers Pipeline"
date:   2023-11-09 08:00:00 +0800
tags: [transformers, pipeline, inference, python, pytorch, machine-learning, sentiment-analysis, quantization]
---

## 使用 Transformers 的 Pipeline 进行推理
安装依赖包

```shell
pip install datasets evaluate transformers[sentencepiece]
```

### 英文情感分类
```py
from transformers import pipeline

classifier = pipeline("sentiment-analysis")
classifier(
    [
        "I've been waiting for a HuggingFace course my whole life.",
        "I hate this so much!",
    ]
)
```

```shell
No model was supplied, defaulted to distilbert-base-uncased-finetuned-sst-2-english and revision af0f99b (https://huggingface.co/distilbert-base-uncased-finetuned-sst-2-english).
Using a pipeline without specifying a model name and revision in production is not recommended.
[{'label': 'POSITIVE', 'score': 0.9598048329353333},
 {'label': 'NEGATIVE', 'score': 0.9994558691978455}]
```

### 中文情感分类

模型：[uer/roberta-base-finetuned-dianping-chinese](https://huggingface.co/uer/roberta-base-finetuned-dianping-chinese)

```shell
from transformers import AutoModelForSequenceClassification,AutoTokenizer,pipeline

checkpoint = "uer/roberta-base-finetuned-dianping-chinese"

tokenizer = AutoTokenizer.from_pretrained(checkpoint)
model = AutoModelForSequenceClassification.from_pretrained(checkpoint)
text_classification = pipeline('sentiment-analysis', tokenizer=tokenizer, model=model)

raw_inputs = [
    "我一直都在等待 HuggingFace 课程。",
    "我非常讨厌这个！",
]
for _ in range(500):
    text_classification(raw_inputs)
```

```shell
[{'label': 'positive (stars 4 and 5)', 'score': 0.8151589035987854},
 {'label': 'negative (stars 1, 2 and 3)', 'score': 0.9962126016616821}]
```

## Pipeline 内部分解

Pipeline 将预处理、推理和后处理三部分组合在一起

### ❶ 预处理
<br>

```py
from transformers import AutoTokenizer

checkpoint = "uer/roberta-base-finetuned-dianping-chinese"
tokenizer = AutoTokenizer.from_pretrained(checkpoint)

raw_inputs = [
    "我一直都在等待 HuggingFace 课程。",
    "我非常讨厌这个！",
]
inputs = tokenizer(raw_inputs, padding=True, truncation=True, return_tensors="pt")
print(inputs)
```

`结果：`
```
{
    'input_ids': tensor([
        [  101,  2769,   671,  4684,  6963,  1762,  5023,  2521, 12199,  9949,  8221, 12122,  6440,  4923,   511,   102],
        [  101,  2769,  7478,  2382,  6374,  1328,  6821,   702,  8013,   102,     0,     0,     0,     0,     0,     0]
    ]), 
    'attention_mask': tensor([
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0]
    ])
}
```

<!--_footer: '[uer/roberta-base-finetuned-dianping-chinese](https://huggingface.co/uer/roberta-base-finetuned-dianping-chinese)'-->

---

### ❷ 推理

```py
from transformers import AutoModelForSequenceClassification

checkpoint = "uer/roberta-base-finetuned-dianping-chinese"
model = AutoModelForSequenceClassification.from_pretrained(checkpoint)

outputs = model(**inputs)
print(outputs.logits)
```

`结果：`
```
tensor([[-0.7019,  0.6344],
        [ 2.8446, -2.7260]], grad_fn=<AddmmBackward0>)
```

`logits` 不是概率，是模型最后一层输出的原始非标准化分数。

<!--_footer: '[uer/roberta-base-finetuned-dianping-chinese](https://huggingface.co/uer/roberta-base-finetuned-dianping-chinese)'-->

---

### ❸ 后处理

```py
labels = model.config.id2label
predictions = torch.nn.functional.softmax(outputs.logits, dim=-1)

for input, prediction in zip(raw_inputs, predictions):
    score = torch.max(prediction).item()
    label = labels[torch.argmax(prediction).item()]
    print(f"input: {input}")
    print(f"label: {label.upper()}, score: {score}")
    print()
```

`结果：`
```
input: 我一直都在等待 HuggingFace 课程。
label: POSITIVE (STARS 4 AND 5), score: 0.7918757796287537

input: 我非常讨厌这个！
label: NEGATIVE (STARS 1, 2 AND 3), score: 0.9962064027786255
```


## LLM.int8 节省显存 & 加速推理
安装依赖包

```shell
pip install bitsandbytes accelerate scipy
```

```py
from transformers import AutoModelForSequenceClassification,AutoTokenizer,pipeline

checkpoint = "uer/roberta-base-finetuned-dianping-chinese"

tokenizer = AutoTokenizer.from_pretrained(checkpoint, device_map='auto', load_in_8bit=True)
model = AutoModelForSequenceClassification.from_pretrained(checkpoint, load_in_8bit=True)
text_classification = pipeline('sentiment-analysis', tokenizer=tokenizer, model=model)

raw_inputs = [
    "我一直都在等待 HuggingFace 课程。",
    "我非常讨厌这个！",
]
outputs = text_classification(raw_inputs)
print(outputs)
```

```shell
[{'label': 'positive (stars 4 and 5)', 'score': 0.8151589035987854}, 
 {'label': 'negative (stars 1, 2 and 3)', 'score': 0.9962126016616821}]
```


## [Colab](https://colab.research.google.com/) 中测量执行时间

安装插件

```shell
pip install ipython-autotime
```

在 `代码单元格` 中增加代码

```py
%load_ext autotime
```

* [How to check preprocessing time/speed in Colab?](https://stackoverflow.com/questions/63193743/how-to-check-preprocessing-time-speed-in-colab)

### 不使用 LLM.int8

```py
%load_ext autotime
from transformers import AutoModelForSequenceClassification,AutoTokenizer,pipeline

checkpoint = "uer/roberta-base-finetuned-dianping-chinese"

tokenizer = AutoTokenizer.from_pretrained(checkpoint)
model = AutoModelForSequenceClassification.from_pretrained(checkpoint)
text_classification = pipeline('sentiment-analysis', tokenizer=tokenizer, model=model)

raw_inputs = [
    "我一直都在等待 HuggingFace 课程。",
    "我非常讨厌这个！",
]
for _ in range(500):
    outputs = text_classification(raw_inputs)

print('显存：', model.get_memory_footprint())
```
```
显存： 204546564
time: 2min 21s
```

### 使用 LLM.int8

```py
%load_ext autotime
from transformers import AutoModelForSequenceClassification,AutoTokenizer,pipeline

checkpoint = "uer/roberta-base-finetuned-dianping-chinese"

tokenizer = AutoTokenizer.from_pretrained(checkpoint, device_map='auto', load_in_8bit=True)
model = AutoModelForSequenceClassification.from_pretrained(checkpoint, load_in_8bit=True)
text_classification = pipeline('sentiment-analysis', tokenizer=tokenizer, model=model)

raw_inputs = [
    "我一直都在等待 HuggingFace 课程。",
    "我非常讨厌这个！",
]
for _ in range(500):
    text_classification(raw_inputs)

print('显存：', model.get_memory_footprint())
```
```
显存： 119022084
time: 1min 46s
```

### 总结
* 不使用 `LLM.int8`：**显存：** 205MB；**用时：** 141秒
* 使用 `LLM.int8`：**显存：** 119MB；**用时：** 106秒

**显存减少📉 72%，速度提升📈 33%**
