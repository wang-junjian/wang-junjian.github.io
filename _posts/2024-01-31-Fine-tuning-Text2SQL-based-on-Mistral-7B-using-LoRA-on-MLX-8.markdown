---
layout: post
title:  "在 MLX 上使用 LoRA / QLoRA 微调 Text2SQL（八）：使用 LoRA 基于 TinyLlama 微调"
date:   2024-01-31 08:00:00 +0800
categories: MLX Text2SQL
tags: [MLX, LoRA, TinyLlama, Text2SQL, WikiSQL, MacBookProM2Max]
---

## [TinyLlama](https://github.com/jzhang38/TinyLlama)
- [TinyLlama: The Mini AI Model with a Trillion-Token Punch](https://aibusiness.com/nlp/tinyllama-the-mini-ai-model-with-a-trillion-token-punch)
- [Just using MLX to fine-tune TinyLlama with LoRA locally on a 8 GB Mac Mini.](https://twitter.com/awnihannun/status/1741667155064832239)

### [TinyLlama/TinyLlama-1.1B-Chat-v1.0](https://huggingface.co/TinyLlama/TinyLlama-1.1B-Chat-v1.0)

- 输入
  
```
<|system|>
You are a chatbot who can help code!</s>
<|user|>
Write me a function to calculate the first 10 digits of the fibonacci sequence in Python and print it out to the CLI.</s>
<|assistant|>
```

- 输出

```json
[
  {
    "generated_text": "<|system|>\nYou are a chatbot who can help code!</s>\n<|user|>\nWrite me a function to calculate the first 10 digits of the fibonacci sequence in Python and print it out to the CLI.</s>\n<|assistant|>\nHere's a Python function that calculates the first 10 digits of the Fib"
  }
]
```

- 生成

```bash
python -m mlx_lm.generate --model TinyLlama/TinyLlama-1.1B-Chat-v1.0 --prompt "table: students                 
columns: Name, Age, School, Grade, Height, Weight
Using the database information above, help me generate the SQL for the following question:\nQuery information such as name, age, school, grade, etc. The condition is that the name is equal to Wang Junjian and the age is less than 20 years old."
```
```
==========
Prompt: <|user|>
table: students
columns: Name, Age, School, Grade, Height, Weight
Using the database information above, help me generate the SQL for the following question:\nQuery information such as name, age, school, grade, etc. The condition is that the name is equal to Wang Junjian and the age is less than 20 years old.</s>
<|assistant|>

To generate the SQL for the query you provided, you can use the following:

SELECT *
FROM students
WHERE name = 'Wang Junjian'
AND age < 20

This SQL will retrieve all students whose name is "Wang Junjian" and whose age is less than 20 years old.
==========
Prompt: 866.228 tokens-per-sec
Generation: 180.262 tokens-per-sec
```

### [TinyLlama/TinyLlama-1.1B-intermediate-step-1431k-3T](https://huggingface.co/TinyLlama/TinyLlama-1.1B-intermediate-step-1431k-3T)

- 输入

```
My name is Merve and my favorite color
```

- 输出

```json
[
  {
    "generated_text": "My name is Merve and my favorite color is blue. I am 10 years old and I live in Turkey. I have a"
  }
]
```


## 数据集 WikiSQL

- [WikiSQL](https://github.com/salesforce/WikiSQL)
- [sqllama/sqllama-V0](https://huggingface.co/sqllama/sqllama-V0/blob/main/wikisql.ipynb)

### 修改脚本 mlx-examples/lora/data/wikisql.py
```py
if __name__ == "__main__":
    # ......
    for dataset, name, size in datasets:
        with open(f"data/{name}.jsonl", "w") as fid:
            for e, t in zip(range(size), dataset):
                # TinyLlama/TinyLlama-1.1B-Chat-v1.0
                t = t[3:]
                q, a = t.split("A: ")
                q += "A: "
                # template = "<|system|>\nYou are a chatbot that can help write SQL statements!</s>\n<|user|>\n{q}</s>\n<|assistant|>\n{a}"
                template = "<|user|>\n{q}</s>\n<|assistant|>\n{a}"
                t = template.format(q=q, a=a)
                print(t)
                print()

                # TinyLlama/TinyLlama-1.1B-intermediate-step-1431k-3T
                # t = t[3:]

                json.dump({"text": t}, fid)
                fid.write("\n")
```

执行脚本 `data/wikisql.py` 生成数据集。
    
```bash
data/wikisql.py
```

## 微调

使用 LoRA 微调 TinyLlama/TinyLlama-1.1B-Chat-v1.0

```bash
time python lora.py --model TinyLlama/TinyLlama-1.1B-Chat-v1.0 --train --iters 500
```
```
Loading pretrained model
Total parameters 1100.868M
Trainable parameters 0.819M
Loading datasets
Training
Iter 1: Val loss 2.507, Val took 4.411s
Iter 10: Train loss 2.458, It/sec 3.036, Tokens/sec 1424.852
Iter 20: Train loss 2.126, It/sec 1.517, Tokens/sec 720.801
Iter 30: Train loss 1.868, It/sec 1.464, Tokens/sec 702.935
Iter 40: Train loss 1.616, It/sec 1.616, Tokens/sec 738.103
Iter 50: Train loss 1.388, It/sec 1.791, Tokens/sec 838.185
Iter 60: Train loss 1.190, It/sec 1.411, Tokens/sec 656.398
Iter 70: Train loss 1.179, It/sec 1.387, Tokens/sec 657.852
Iter 80: Train loss 1.205, It/sec 1.762, Tokens/sec 828.095
Iter 90: Train loss 1.157, It/sec 1.878, Tokens/sec 842.579
Iter 100: Train loss 1.182, It/sec 1.665, Tokens/sec 744.982
Iter 100: Saved adapter weights to adapters.npz.
Iter 110: Train loss 1.065, It/sec 1.724, Tokens/sec 787.045
Iter 120: Train loss 1.110, It/sec 1.660, Tokens/sec 760.937
Iter 130: Train loss 1.051, It/sec 1.409, Tokens/sec 656.706
Iter 140: Train loss 1.127, It/sec 1.705, Tokens/sec 782.127
Iter 150: Train loss 1.145, It/sec 1.605, Tokens/sec 761.741
Iter 160: Train loss 1.041, It/sec 1.745, Tokens/sec 810.177
Iter 170: Train loss 1.062, It/sec 1.697, Tokens/sec 815.289
Iter 180: Train loss 1.044, It/sec 1.978, Tokens/sec 854.335
Iter 190: Train loss 1.077, It/sec 1.450, Tokens/sec 676.531
Iter 200: Train loss 1.109, It/sec 1.620, Tokens/sec 723.184
Iter 200: Val loss 1.090, Val took 7.295s
Iter 200: Saved adapter weights to adapters.npz.
Iter 210: Train loss 1.051, It/sec 1.721, Tokens/sec 769.713
Iter 220: Train loss 1.045, It/sec 1.716, Tokens/sec 801.495
Iter 230: Train loss 0.985, It/sec 1.649, Tokens/sec 753.308
Iter 240: Train loss 0.987, It/sec 1.832, Tokens/sec 826.279
Iter 250: Train loss 0.997, It/sec 1.602, Tokens/sec 779.581
Iter 260: Train loss 0.957, It/sec 1.982, Tokens/sec 939.073
Iter 270: Train loss 0.950, It/sec 1.857, Tokens/sec 855.743
Iter 280: Train loss 0.969, It/sec 2.526, Tokens/sec 1141.648
Iter 290: Train loss 0.967, It/sec 1.425, Tokens/sec 644.808
Iter 300: Train loss 0.871, It/sec 1.880, Tokens/sec 893.419
Iter 300: Saved adapter weights to adapters.npz.
Iter 310: Train loss 0.988, It/sec 1.851, Tokens/sec 821.308
Iter 320: Train loss 0.907, It/sec 1.717, Tokens/sec 785.215
Iter 330: Train loss 0.986, It/sec 1.813, Tokens/sec 855.241
Iter 340: Train loss 0.915, It/sec 1.464, Tokens/sec 661.628
Iter 350: Train loss 0.891, It/sec 1.722, Tokens/sec 775.787
Iter 360: Train loss 0.981, It/sec 1.854, Tokens/sec 868.989
Iter 370: Train loss 0.930, It/sec 1.481, Tokens/sec 708.436
Iter 380: Train loss 0.946, It/sec 1.460, Tokens/sec 659.100
Iter 390: Train loss 0.919, It/sec 1.453, Tokens/sec 659.954
Iter 400: Train loss 0.946, It/sec 1.213, Tokens/sec 600.219
Iter 400: Val loss 1.018, Val took 10.151s
Iter 400: Saved adapter weights to adapters.npz.
Iter 410: Train loss 0.910, It/sec 1.011, Tokens/sec 476.125
Iter 420: Train loss 0.907, It/sec 1.083, Tokens/sec 475.708
Iter 430: Train loss 0.878, It/sec 0.995, Tokens/sec 439.132
Iter 440: Train loss 0.928, It/sec 0.861, Tokens/sec 397.056
Iter 450: Train loss 0.930, It/sec 0.775, Tokens/sec 368.793
Iter 460: Train loss 0.993, It/sec 0.734, Tokens/sec 351.590
Iter 470: Train loss 0.899, It/sec 0.817, Tokens/sec 379.844
Iter 480: Train loss 0.910, It/sec 0.788, Tokens/sec 363.797
Iter 490: Train loss 0.869, It/sec 0.884, Tokens/sec 401.832
Iter 500: Train loss 0.944, It/sec 0.810, Tokens/sec 390.466
Iter 500: Saved adapter weights to adapters.npz.
python lora.py --model TinyLlama/TinyLlama-1.1B-Chat-v1.0 --train --iters 500  36.69s user 103.96s system 36% cpu 6:22.46 total
```

### 生成

```bash
python lora.py --model TinyLlama/TinyLlama-1.1B-Chat-v1.0 \
    --adapter-file adapters.npz \
    --max-tokens 50 \
    --prompt "<|user|>table: students
columns: Name, Age, School, Grade, Height, Weight
Q: Query information such as name, age, school, grade, etc. The condition is that the name is equal to Wang Junjian and the age is less than 20 years old.
A: </s>\n<|assistant|>"
```
```
Loading pretrained model
Total parameters 1100.868M
Trainable parameters 0.819M
Loading datasets
Generating
<|user|>table: students
columns: Name, Age, School, Grade, Height, Weight
Q: Query information such as name, age, school, grade, etc. The condition is that the name is equal to Wang Junjian and the age is less than 20 years old.
A: </s>\n<|assistant|>
SELECT Name FROM students WHERE Name = 'Wang Junjian' AND Age < 20
```

使用 `mlx_lm.generate` 不能很好的生成，目前还不清楚 `fuse` 的问题，还是 `generate` 的问题。

```bash
python -m mlx_lm.generate --model lora_fused_model --prompt "table: students
columns: Name, Age, School, Grade, Height, Weight
Q: Query information such as name, age, school, grade, etc. The condition is that the name is equal to Wang Junjian and the age is less than 20 years old.
A: "
```
```
Prompt: table: students
columns: Name, Age, School, Grade, Height, Weight
Q: Query information such as name, age, school, grade, etc. The condition is that the name is equal to Wang Junjian and the age is less than 20 years old.
A: 
1. Statement
SELECT name, age, school, grade, height, weight FROM students WHERE name = 'Wang Junjian' and age < 20
2. Query
SELECT name, age, school, grade, height, weight FROM students WHERE name = 'Wang Junjian'
3. Output
NAME   AGE  SCHOOL  GRADE  HEIGHT WEIGHT
Wang Junjian 20  1
```

```bash
python -m mlx_lm.generate --model lora_fused_model --prompt "<|user|>table: students
columns: Name, Age, School, Grade, Height, Weight
Q: Query information such as name, age, school, grade, etc. The condition is that the name is equal to Wang Junjian and the age is less than 20 years old.
A: </s>\n<|assistant|>"
```
```
Prompt: <|user|>table: students
columns: Name, Age, School, Grade, Height, Weight
Q: Query information such as name, age, school, grade, etc. The condition is that the name is equal to Wang Junjian and the age is less than 20 years old.
A: </s>\n<|assistant|>
is a new tool for supporting the research process of Assistant, an open source machine learning and deep learning platform. It consists of a set of python scripts that can be used to perform the tasks of data pre-processing, feature engineering, data cleaning, data exploration, and supervised learning.
\nAssistant is built on top of Scikit-Learn, a Python machine learning library, and designed with ease of use in mind. It is easy to install and uses
```

## SQL 问题（英文）

```
table: students
columns: Name, Age, School, Grade, Height, Weight
Q: What is Wang Junjian's name?
A: 
```


```
table: students
columns: Name, Age, School, Grade, Height, Weight
Q: How old is Wang Junjian?
A: 
```


```
table: students
columns: Name, Age, School, Grade, Height, Weight
Q: Which school did Wang Junjian come from?
A: 
```


```
table: students
columns: Name, Age, School, Grade, Height, Weight
Q: Query Wang Junjian’s name, age, and school information.
A: 
```


```
table: students
columns: Name, Age, School, Grade, Height, Weight
Q: Query all information about Wang Junjian.
A: 
```


```
table: students
columns: Name, Age, School, Grade, Height, Weight
Q: Query information such as name, age, school, grade, etc. The condition is that the name is equal to Wang Junjian and the age is less than 20 years old.
A: 
```


```
table: students
columns: Name, Age, School, Grade, Height, Weight
Q: Count how many students there are in ninth grade.
A: 
```


```
table: students
columns: Name, Age, School, Grade, Height, Weight
Q: Count how many students there are in ninth grade.(The value for ninth grade is 9th.)
A: 
```


## 参考资料
- [MLX Community](https://huggingface.co/mlx-community)
- [Fine-Tuning with LoRA or QLoRA](https://github.com/ml-explore/mlx-examples/tree/main/lora)
- [Generate Text with LLMs and MLX](https://github.com/ml-explore/mlx-examples/tree/main/llms)
- [Awesome Text2SQL](https://github.com/eosphoros-ai/Awesome-Text2SQL)
- [Awesome Text2SQL（中文）](https://github.com/eosphoros-ai/Awesome-Text2SQL/blob/main/README.zh.md)
- [Mistral AI](https://huggingface.co/mistralai)
- [A Beginner’s Guide to Fine-Tuning Mistral 7B Instruct Model](https://adithyask.medium.com/a-beginners-guide-to-fine-tuning-mistral-7b-instruct-model-0f39647b20fe)
- [Mistral Instruct 7B Finetuning on MedMCQA Dataset](https://saankhya.medium.com/mistral-instruct-7b-finetuning-on-medmcqa-dataset-6ec2532b1ff1)
- [Fine-tuning Mistral on your own data](https://github.com/brevdev/notebooks/blob/main/mistral-finetune-own-data.ipynb)
- [mlx-examples llms Mistral](https://github.com/ml-explore/mlx-examples/blob/main/llms/mistral/README.md)
- [deepseek-ai/deepseek-coder-7b-base-v1.5](https://huggingface.co/deepseek-ai/deepseek-coder-7b-base-v1.5)
- [DeepSeek LLM: Scaling Open-Source Language Models with Longtermism](https://arxiv.org/abs/2401.02954)
- [Benchmarking Apple’s MLX vs. llama.cpp](https://medium.com/@andreask_75652/benchmarking-apples-mlx-vs-llama-cpp-bbbebdc18416)
- [Apple MLX —> GGUF](https://twitter.com/ivanfioravanti/status/1749929493442056656)
- [A Simple Voice Assistant Script](https://github.com/linyiLYi/voice-assistant)
- [I made an app that runs Mistral 7B 0.2 LLM locally on iPhone Pros](https://news.ycombinator.com/item?id=38906966)
- [MLX Chat](https://github.com/da-z/mlx-ui)
- [MLX Stable Diffusion UI](https://mer.vin/2023/12/mlx-stable-diffusion-ui/)
- [Graphically display the information collected by powermetrics](https://apple.stackexchange.com/questions/430403/graphically-display-the-information-collected-by-powermetrics)
