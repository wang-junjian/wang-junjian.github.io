---
layout: single
title:  "在 MLX 上使用 LoRA / QLoRA 微调 Text2SQL（六）：使用 LoRA 基于 Deepseek-Coder-7B 微调"
date:   2024-01-27 08:00:00 +0800
categories: [AI 与大模型, 编程开发]
tags: [mlx, lora, deepseek-coder-7b, text2sql, wikisql, macbookprom2max]
---

## 大模型 Deepseek-Coder-7B
- [deepseek-ai/deepseek-coder-7b-base-v1.5](https://huggingface.co/deepseek-ai/deepseek-coder-7b-base-v1.5)
- [deepseek-ai/deepseek-coder-7b-instruct-v1.5](https://huggingface.co/deepseek-ai/deepseek-coder-7b-instruct-v1.5)


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
                # deepseek-ai/deepseek-coder-7b-instruct-v1.5
                # 去掉开头的 <｜begin▁of▁sentence｜>，因为 tokenizer 会自动添加 <｜begin▁of▁sentence｜>
                t = t[3:-4] + "<｜end▁of▁sentence｜>"
                json.dump({"text": t}, fid)
                fid.write("\n")
```

执行脚本 `data/wikisql.py` 生成数据集。
    
```bash
data/wikisql.py
```


## 安装 mlx-lm

```bash
pip install mlx-lm
```


## 微调

使用 LoRA 微调

### deepseek-ai/deepseek-coder-7b-instruct-v1.5

```bash
time python -m mlx_lm.lora --model deepseek-ai/deepseek-coder-7b-instruct-v1.5 \
               --train \
               --iters 600
```
```
Loading pretrained model
Special tokens have been added in the vocabulary, make sure the associated word embeddings are fine-tuned or trained.
Total parameters 6912.463M
Trainable parameters 2.097M
Loading datasets
Training
Starting training..., iters: 600
Iter 1: Val loss 2.532, Val took 23.017s
Iter 10: Train loss 2.476, It/sec 0.610, Tokens/sec 233.939
Iter 20: Train loss 2.254, It/sec 0.603, Tokens/sec 231.470
Iter 30: Train loss 2.027, It/sec 0.564, Tokens/sec 219.675
Iter 40: Train loss 1.810, It/sec 0.623, Tokens/sec 229.324
Iter 50: Train loss 1.629, It/sec 0.626, Tokens/sec 235.960
Iter 60: Train loss 1.433, It/sec 0.612, Tokens/sec 230.657
Iter 70: Train loss 1.440, It/sec 0.536, Tokens/sec 205.828
Iter 80: Train loss 1.445, It/sec 0.580, Tokens/sec 221.729
Iter 90: Train loss 1.454, It/sec 0.644, Tokens/sec 230.853
Iter 100: Train loss 1.465, It/sec 0.629, Tokens/sec 227.520
Iter 110: Train loss 1.308, It/sec 0.642, Tokens/sec 234.599
Iter 120: Train loss 1.258, It/sec 0.547, Tokens/sec 203.351
Iter 130: Train loss 1.208, It/sec 0.535, Tokens/sec 202.567
Iter 140: Train loss 1.242, It/sec 0.535, Tokens/sec 197.166
Iter 150: Train loss 1.230, It/sec 0.484, Tokens/sec 185.982
Iter 160: Train loss 1.115, It/sec 0.514, Tokens/sec 192.832
Iter 170: Train loss 1.141, It/sec 0.530, Tokens/sec 205.737
Iter 180: Train loss 1.131, It/sec 0.566, Tokens/sec 194.020
Iter 190: Train loss 1.142, It/sec 0.551, Tokens/sec 208.123
Iter 200: Train loss 1.189, It/sec 0.568, Tokens/sec 205.594
Iter 200: Val loss 1.175, Val took 28.336s
Iter 210: Train loss 1.109, It/sec 0.625, Tokens/sec 225.139
Iter 220: Train loss 1.069, It/sec 0.587, Tokens/sec 223.650
Iter 230: Train loss 1.046, It/sec 0.586, Tokens/sec 215.076
Iter 240: Train loss 1.023, It/sec 0.607, Tokens/sec 219.824
Iter 250: Train loss 1.072, It/sec 0.530, Tokens/sec 207.403
Iter 260: Train loss 0.981, It/sec 0.596, Tokens/sec 216.396
Iter 270: Train loss 0.889, It/sec 0.569, Tokens/sec 218.139
Iter 280: Train loss 1.112, It/sec 0.594, Tokens/sec 227.021
Iter 290: Train loss 1.069, It/sec 0.551, Tokens/sec 205.965
Iter 300: Train loss 0.907, It/sec 0.562, Tokens/sec 214.827
Iter 310: Train loss 0.960, It/sec 0.585, Tokens/sec 213.497
Iter 320: Train loss 0.858, It/sec 0.601, Tokens/sec 213.847
Iter 330: Train loss 0.937, It/sec 0.571, Tokens/sec 205.752
Iter 340: Train loss 0.935, It/sec 0.552, Tokens/sec 212.401
Iter 350: Train loss 0.907, It/sec 0.552, Tokens/sec 209.727
Iter 360: Train loss 0.996, It/sec 0.530, Tokens/sec 201.702
Iter 370: Train loss 0.892, It/sec 0.554, Tokens/sec 205.891
Iter 380: Train loss 1.008, It/sec 0.588, Tokens/sec 211.078
Iter 390: Train loss 0.972, It/sec 0.557, Tokens/sec 211.817
Iter 400: Train loss 0.822, It/sec 0.602, Tokens/sec 216.862
Iter 400: Val loss 1.115, Val took 28.797s
Iter 410: Train loss 0.858, It/sec 0.543, Tokens/sec 202.470
Iter 420: Train loss 0.866, It/sec 0.592, Tokens/sec 218.569
Iter 430: Train loss 0.846, It/sec 0.570, Tokens/sec 210.504
Iter 440: Train loss 0.897, It/sec 0.567, Tokens/sec 221.815
Iter 450: Train loss 0.879, It/sec 0.525, Tokens/sec 200.252
Iter 460: Train loss 0.896, It/sec 0.582, Tokens/sec 214.533
Iter 470: Train loss 0.829, It/sec 0.544, Tokens/sec 204.817
Iter 480: Train loss 0.825, It/sec 0.526, Tokens/sec 199.035
Iter 490: Train loss 0.901, It/sec 0.572, Tokens/sec 208.777
Iter 500: Train loss 0.919, It/sec 0.555, Tokens/sec 214.673
Iter 510: Train loss 0.816, It/sec 0.617, Tokens/sec 224.638
Iter 520: Train loss 0.796, It/sec 0.585, Tokens/sec 209.467
Iter 530: Train loss 0.835, It/sec 0.575, Tokens/sec 203.523
Iter 540: Train loss 0.831, It/sec 0.536, Tokens/sec 206.305
Iter 550: Train loss 0.842, It/sec 0.591, Tokens/sec 216.378
Iter 560: Train loss 0.751, It/sec 0.545, Tokens/sec 207.297
Iter 570: Train loss 0.772, It/sec 0.538, Tokens/sec 203.582
Iter 580: Train loss 0.897, It/sec 0.502, Tokens/sec 199.693
Iter 590: Train loss 0.754, It/sec 0.559, Tokens/sec 205.148
Iter 600: Train loss 0.828, It/sec 0.523, Tokens/sec 201.825
Iter 600: Val loss 1.082, Val took 29.715s
Saved final adapter weights to adapters.npz.
python -m mlx_lm.lora --model deepseek-ai/deepseek-coder-7b-instruct-v1.5     42.47s user 176.35s system 18% cpu 19:35.47 total
```


## 评估

计算测试集困惑度（PPL）和交叉熵损失（Loss）。

### deepseek-ai/deepseek-coder-7b-instruct-v1.5

```bash
python -m mlx_lm.lora --model deepseek-ai/deepseek-coder-7b-instruct-v1.5 \
                      --adapter-file adapters.npz \
                      --test
```
```
Test loss 1.473, Test ppl 4.364.
```


## 融合（Fuse）

```bash
python -m mlx_lm.fuse --model deepseek-ai/deepseek-coder-7b-instruct-v1.5 \
                      --adapter-file adapters.npz \
                      --save-path lora_fused_model
```


## 提示词

直接使用 `deepseek-ai/deepseek-coder-7b-instruct-v1.5` 生成模型，需要对提示词进行修改。

### ❌ 不好的提示词。

```bash
python -m mlx_lm.generate --model deepseek-ai/deepseek-coder-7b-instruct-v1.5 \
                          --max-tokens 50 \
                          --prompt "table: students
columns: Name, Age, School, Grade, Height, Weight
Q: What is Wang Junjian's name?
A: "
```
```
Special tokens have been added in the vocabulary, make sure the associated word embeddings are fine-tuned or trained.
==========
Prompt: <｜begin▁of▁sentence｜>You are an AI programming assistant, utilizing the Deepseek Coder model, developed by Deepseek Company, and you only answer questions related to computer science. For politically sensitive questions, security and privacy issues, and other non-computer science questions, you will refuse to answer
### Instruction:
table: students
columns: Name, Age, School, Grade, Height, Weight
Q: What is Wang Junjian's name?
A: 
### Response:

As an AI model, I don't have access to any specific database, including the "students" table you've mentioned. Therefore, I can't provide the specific information you're looking for, such as Wang Junjian'
==========
Prompt: 282.062 tokens-per-sec
Generation: 86.552 tokens-per-sec
```

```bash
python -m mlx_lm.generate --model deepseek-ai/deepseek-coder-7b-instruct-v1.5 \
                          --max-tokens 100 \
                          --prompt "table: students
columns: Name, Age, School, Grade, Height, Weight
使用上面的数据库信息，帮我生成这个问题的SQL：What is Wang Junjian's name?"
```
```
Special tokens have been added in the vocabulary, make sure the associated word embeddings are fine-tuned or trained.
==========
Prompt: <｜begin▁of▁sentence｜>You are an AI programming assistant, utilizing the Deepseek Coder model, developed by Deepseek Company, and you only answer questions related to computer science. For politically sensitive questions, security and privacy issues, and other non-computer science questions, you will refuse to answer
### Instruction:
table: students
columns: Name, Age, School, Grade, Height, Weight
使用上面的数据库信息，帮我生成这个问题的SQL：What is Wang Junjian's name?
### Response:

你可以使用以下的SQL查询来获取Wang Junjian的名字：

SELECT Name 
FROM students 
WHERE Name = 'Wang Junjian';

请注意，这个查询假设你的"students"表中的"Name"列是用来存储每个学生的名字的。如果这个假设不成立，或者你的表结构有所不同，你可能需要调整这个查询。

==========
Prompt: 296.709 tokens-per-sec
Generation: 46.091 tokens-per-sec
```

### 👍 好的提示词。

```
table: students
columns: Name, Age, School, Grade, Height, Weight
使用上面的数据库信息，帮我生成下面问题的SQL：\nWhat is Wang Junjian's name?
```

```
table: students
columns: Name, Age, School, Grade, Height, Weight
使用上面的数据库信息，帮我生成这个问题（What is Wang Junjian's name?）的 SQL，回答只要 SQL 语句。
```


## 生成

### 王军建的姓名是什么？

- deepseek-coder-7b-instruct-v1.5（中文）

```bash
python -m mlx_lm.generate --model deepseek-ai/deepseek-coder-7b-instruct-v1.5 \
                          --max-tokens 50 \
                          --prompt "table: students
columns: Name, Age, School, Grade, Height, Weight
使用上面的数据库信息，帮我生成这个问题（王军建的姓名是什么？）的 SQL，回答只要 SQL 语句。"
```

```
SELECT Name FROM students WHERE Name = '王军建';
```

- deepseek-coder-7b-instruct-v1.5（英文问题）

```bash
python -m mlx_lm.generate --model deepseek-ai/deepseek-coder-7b-instruct-v1.5 \
                          --max-tokens 50 \
                          --prompt "table: students
columns: Name, Age, School, Grade, Height, Weight
使用上面的数据库信息，帮我生成这个问题（What is Wang Junjian's name?）的 SQL，回答只要 SQL 语句。"
```

```
SELECT Name FROM students WHERE Name = 'Wang Junjian';
```

- deepseek-coder-7b-instruct-v1.5 + LoRA

```bash
python -m mlx_lm.generate --model lora_fused_model \
                          --max-tokens 50 \
                          --prompt "table: students
columns: Name, Age, School, Grade, Height, Weight
Q: What is Wang Junjian's name?
A: "
```

```
SELECT Name FROM students WHERE Age = 'Wang Junjian'
```

### 王军建的年龄是多少？

- deepseek-coder-7b-instruct-v1.5（中文）

```bash
python -m mlx_lm.generate --model deepseek-ai/deepseek-coder-7b-instruct-v1.5 \
                          --max-tokens 50 \
                          --prompt "table: students
columns: Name, Age, School, Grade, Height, Weight
使用上面的数据库信息，帮我生成这个问题（王军建的年龄是多少？）的 SQL，回答只要 SQL 语句。"
```

```
SELECT Age FROM students WHERE Name = '王军建';
```

- deepseek-coder-7b-instruct-v1.5（英文问题）

```bash
python -m mlx_lm.generate --model deepseek-ai/deepseek-coder-7b-instruct-v1.5 \
                          --max-tokens 50 \
                          --prompt "table: students
columns: Name, Age, School, Grade, Height, Weight
使用上面的数据库信息，帮我生成这个问题（How old is Wang Junjian?）的 SQL，回答只要 SQL 语句。"
```

```
SELECT Age FROM students WHERE Name = 'Wang Junjian';
```

- deepseek-coder-7b-instruct-v1.5 + LoRA

```bash
python -m mlx_lm.generate --model lora_fused_model \
                          --max-tokens 50 \
                          --prompt "table: students
columns: Name, Age, School, Grade, Height, Weight
Q: How old is Wang Junjian?
A: "
```

```
SELECT Age FROM students WHERE Name = 'Wang Junjian'
```

### 王军建来自哪所学校？

- deepseek-coder-7b-instruct-v1.5（中文）

```bash
python -m mlx_lm.generate --model deepseek-ai/deepseek-coder-7b-instruct-v1.5 \
                          --max-tokens 50 \
                          --prompt "table: students
columns: Name, Age, School, Grade, Height, Weight
使用上面的数据库信息，帮我生成这个问题（王军建来自哪所学校？）的 SQL，回答只要 SQL 语句。"
```

```
SELECT School FROM students WHERE Name = '王军建';
```

- deepseek-coder-7b-instruct-v1.5（英文问题）

```bash
python -m mlx_lm.generate --model deepseek-ai/deepseek-coder-7b-instruct-v1.5 \
                          --max-tokens 50 \
                          --prompt "table: students
columns: Name, Age, School, Grade, Height, Weight
使用上面的数据库信息，帮我生成这个问题（Which school did Wang Junjian come from?）的 SQL，回答只要 SQL 语句。"
```

```
SELECT School FROM students WHERE Name = 'Wang Junjian';
```

- deepseek-coder-7b-instruct-v1.5 + LoRA

```bash
python -m mlx_lm.generate --model lora_fused_model \
                          --max-tokens 50 \
                          --prompt "table: students
columns: Name, Age, School, Grade, Height, Weight
Q: Which school did Wang Junjian come from?
A: "
```

```
SELECT School FROM students WHERE Name = 'Wang Junjian'
```

### 查询王军建的姓名、年龄、学校信息。

- deepseek-coder-7b-instruct-v1.5（中文）

```bash
python -m mlx_lm.generate --model deepseek-ai/deepseek-coder-7b-instruct-v1.5 \
                          --max-tokens 50 \
                          --prompt "table: students
columns: Name, Age, School, Grade, Height, Weight
使用上面的数据库信息，帮我生成这个问题（查询王军建的姓名、年龄、学校信息。）的 SQL，回答只要 SQL 语句。"
```

```
SELECT Name, Age, School FROM students WHERE Name = '王军建';
```

- deepseek-coder-7b-instruct-v1.5（英文问题）

```bash
python -m mlx_lm.generate --model deepseek-ai/deepseek-coder-7b-instruct-v1.5 \
                          --max-tokens 50 \
                          --prompt "table: students
columns: Name, Age, School, Grade, Height, Weight
使用上面的数据库信息，帮我生成这个问题（Query Wang Junjian’s name, age, and school information.）的 SQL，回答只要 SQL 语句。"
```

```
SELECT Name, Age, School 
FROM students 
WHERE Name = 'Wang Junjian';
```

- deepseek-coder-7b-instruct-v1.5 + LoRA

```bash
python -m mlx_lm.generate --model lora_fused_model \
                          --max-tokens 50 \
                          --prompt "table: students
columns: Name, Age, School, Grade, Height, Weight
Q: Query Wang Junjian’s name, age, and school information.
A: "
```

```
SELECT Name, Age, School FROM students WHERE Name = 'Wang Junjian'
```

### 查询王军建的所有信息。

- deepseek-coder-7b-instruct-v1.5（中文）

```bash
python -m mlx_lm.generate --model deepseek-ai/deepseek-coder-7b-instruct-v1.5 \
                          --max-tokens 50 \
                          --prompt "table: students
columns: Name, Age, School, Grade, Height, Weight
使用上面的数据库信息，帮我生成这个问题（查询王军建的所有信息。）的 SQL，回答只要 SQL 语句。"
```

```
SELECT * FROM students WHERE Name = '王军建';
```

- deepseek-coder-7b-instruct-v1.5（英文问题）

```bash
python -m mlx_lm.generate --model deepseek-ai/deepseek-coder-7b-instruct-v1.5 \
                          --max-tokens 50 \
                          --prompt "table: students
columns: Name, Age, School, Grade, Height, Weight
使用上面的数据库信息，帮我生成这个问题（Query all information about Wang Junjian.）的 SQL，回答只要 SQL 语句。"
```

```
SELECT * FROM students WHERE Name = 'Wang Junjian';
```

- deepseek-coder-7b-instruct-v1.5 + LoRA

```bash
python -m mlx_lm.generate --model lora_fused_model \
                          --max-tokens 50 \
                          --prompt "table: students
columns: Name, Age, School, Grade, Height, Weight
Q: Query all information about Wang Junjian.
A: "
```

```
SELECT * FROM students WHERE Name = 'Wang Junjian'
```

### 查询姓名，年龄，学校，年级等信息，条件为姓名等于王军建且年龄小于20岁。

- deepseek-coder-7b-instruct-v1.5（中文）

```bash
python -m mlx_lm.generate --model deepseek-ai/deepseek-coder-7b-instruct-v1.5 \
                          --max-tokens 50 \
                          --prompt "table: students
columns: Name, Age, School, Grade, Height, Weight
使用上面的数据库信息，帮我生成这个问题（查询姓名，年龄，学校，年级等信息，条件为姓名等于王军建且年龄小于20岁。）的 SQL，回答只要 SQL 语句。"
```

```
SELECT Name, Age, School, Grade 
FROM students 
WHERE Name = '王军建' AND Age < 20;
```

- deepseek-coder-7b-instruct-v1.5（英文问题）

```bash
python -m mlx_lm.generate --model deepseek-ai/deepseek-coder-7b-instruct-v1.5 \
                          --max-tokens 50 \
                          --prompt "table: students
columns: Name, Age, School, Grade, Height, Weight
使用上面的数据库信息，帮我生成这个问题（Query information such as name, age, school, grade, etc. The condition is that the name is equal to Wang Junjian and the age is less than 20 years old.）的 SQL，回答只要 SQL 语句。"
```

```
SELECT Name, Age, School, Grade 
FROM students 
WHERE Name = 'Wang Junjian' AND Age < 20;
```

- deepseek-coder-7b-instruct-v1.5 + LoRA

```bash
python -m mlx_lm.generate --model lora_fused_model \
                          --max-tokens 50 \
                          --prompt "table: students
columns: Name, Age, School, Grade, Height, Weight
Q: Query information such as name, age, school, grade, etc. The condition is that the name is equal to Wang Junjian and the age is less than 20 years old.
A: "
```

```
SELECT Name, Age, School, Grade 
FROM students 
WHERE Name = 'Wang Junjian' AND Age < 20
```

### 统计一下九年级有多少学生。

- deepseek-coder-7b-instruct-v1.5（中文）

```bash
python -m mlx_lm.generate --model deepseek-ai/deepseek-coder-7b-instruct-v1.5 \
                          --max-tokens 50 \
                          --prompt "table: students
columns: Name, Age, School, Grade, Height, Weight
使用上面的数据库信息，帮我生成这个问题（统计一下九年级有多少学生。）的 SQL，回答只要 SQL 语句。"
```

```
SELECT COUNT(*) FROM students WHERE Grade = 9;
```

- deepseek-coder-7b-instruct-v1.5（英文问题）

```bash
python -m mlx_lm.generate --model deepseek-ai/deepseek-coder-7b-instruct-v1.5 \
                          --max-tokens 50 \
                          --prompt "table: students
columns: Name, Age, School, Grade, Height, Weight
使用上面的数据库信息，帮我生成这个问题（Count how many students there are in ninth grade.）的 SQL，回答只要 SQL 语句。"
```

```
SELECT COUNT(*) FROM students WHERE Grade = 9;
```

- deepseek-coder-7b-instruct-v1.5 + LoRA

```bash
python -m mlx_lm.generate --model lora_fused_model \
                          --max-tokens 50 \
                          --prompt "table: students
columns: Name, Age, School, Grade, Height, Weight
Q: Count how many students there are in ninth grade.
A: "
```

```
SELECT COUNT(*) FROM students WHERE Grade = 'Ninth'
```

### 统计一下九年级有多少学生（九年级的值是9th）。

- deepseek-coder-7b-instruct-v1.5（中文）

```bash
python -m mlx_lm.generate --model deepseek-ai/deepseek-coder-7b-instruct-v1.5 \
                          --max-tokens 50 \
                          --prompt "table: students
columns: Name, Age, School, Grade, Height, Weight
使用上面的数据库信息，帮我生成这个问题（统计一下九年级有多少学生（九年级的值是9th）。）的 SQL，回答只要 SQL 语句。"
```

```
SELECT COUNT(*) FROM students WHERE Grade = '9th';
```

- deepseek-coder-7b-instruct-v1.5（英文问题）

```bash
python -m mlx_lm.generate --model deepseek-ai/deepseek-coder-7b-instruct-v1.5 \
                          --max-tokens 50 \
                          --prompt "table: students
columns: Name, Age, School, Grade, Height, Weight
使用上面的数据库信息，帮我生成这个问题（Count how many students there are in ninth grade.（The value for ninth grade is 9th.））的 SQL，回答只要 SQL 语句。"
```

```
SELECT COUNT(*) FROM students WHERE Grade = '9th';
```

- deepseek-coder-7b-instruct-v1.5 + LoRA

```bash
python -m mlx_lm.generate --model lora_fused_model \
                          --max-tokens 50 \
                          --prompt "table: students
columns: Name, Age, School, Grade, Height, Weight
Q: Count how many students there are in ninth grade.（The value for ninth grade is 9th.）
A: "
```

```
SELECT COUNT(*) FROM students WHERE Grade = '9th'
```


## 验证 LoRA 微调的模型原本的功能是否正常

### 王军建的姓名是什么？

```bash
python -m mlx_lm.generate --model lora_fused_model \
                          --max-tokens 50 \
                          --prompt "table: students
columns: Name, Age, School, Grade, Height, Weight
使用上面的数据库信息，帮我生成这个问题（What is Wang Junjian's name?）的 SQL，回答只要 SQL 语句。"
```

```
SELECT Name FROM students WHERE Age = 'Wang Junjian'
```

### 王军建的年龄是多少？

```bash
python -m mlx_lm.generate --model lora_fused_model \
                          --max-tokens 50 \
                          --prompt "table: students
columns: Name, Age, School, Grade, Height, Weight
使用上面的数据库信息，帮我生成这个问题（How old is Wang Junjian?）的 SQL，回答只要 SQL 语句。"
```

```
SELECT Age FROM students WHERE Name = 'Wang Junjian'
```

### 王军建来自哪所学校？

```bash
python -m mlx_lm.generate --model lora_fused_model \
                          --max-tokens 50 \
                          --prompt "table: students
columns: Name, Age, School, Grade, Height, Weight
使用上面的数据库信息，帮我生成这个问题（Which school did Wang Junjian come from?）的 SQL，回答只要 SQL 语句。"
```

```
SELECT School FROM students WHERE Name = 'Wang Junjian'
```

### 查询王军建的姓名、年龄、学校信息。

```bash
python -m mlx_lm.generate --model lora_fused_model \
                          --max-tokens 50 \
                          --prompt "table: students
columns: Name, Age, School, Grade, Height, Weight
使用上面的数据库信息，帮我生成这个问题（Query Wang Junjian’s name, age, and school information.）的 SQL，回答只要 SQL 语句。"
```

```
SELECT Name, Age, School FROM students WHERE Name = 'Wang Junjian'
```

### 查询王军建的所有信息。

```bash
python -m mlx_lm.generate --model lora_fused_model \
                          --max-tokens 50 \
                          --prompt "table: students
columns: Name, Age, School, Grade, Height, Weight
使用上面的数据库信息，帮我生成这个问题（Query all information about Wang Junjian.）的 SQL，回答只要 SQL 语句。"
```

```
SELECT * FROM students WHERE Name = 'Wang Junjian'
```

### 查询姓名，年龄，学校，年级等信息，条件为姓名等于王军建且年龄小于20岁。
```bash
python -m mlx_lm.generate --model lora_fused_model \
                          --max-tokens 50 \
                          --prompt "table: students
columns: Name, Age, School, Grade, Height, Weight
使用上面的数据库信息，帮我生成这个问题（Query information such as name, age, school, grade, etc. The condition is that the name is equal to Wang Junjian and the age is less than 20 years old.）的 SQL，回答只要 SQL 语句。"
```

```
SELECT Name, Age, School, Grade FROM students WHERE Name = 'Wang Junjian' AND Age < 20
```

### 统计一下九年级有多少学生。

```bash
python -m mlx_lm.generate --model lora_fused_model \
                          --max-tokens 50 \
                          --prompt "table: students
columns: Name, Age, School, Grade, Height, Weight
使用上面的数据库信息，帮我生成这个问题（Count how many students there are in ninth grade.）的 SQL，回答只要 SQL 语句。"
```

```
SELECT COUNT(*) FROM students WHERE Grade = 'Ninth'
```

### 统计一下九年级有多少学生（九年级的值是9th）。

```bash
python -m mlx_lm.generate --model lora_fused_model \
                          --max-tokens 50 \
                          --prompt "table: students
columns: Name, Age, School, Grade, Height, Weight
使用上面的数据库信息，帮我生成这个问题（Count how many students there are in ninth grade.（The value for ninth grade is 9th.））的 SQL，回答只要 SQL 语句。"
```

```
SELECT COUNT(*) FROM students WHERE Grade = '9th'
```


## 总结
- `deepseek-ai/deepseek-coder-7b-instruct-v1.5` 是专门为编写代码而设计的，所以对于 SQL 语句的生成能力很强。
- `deepseek-ai/deepseek-coder-7b-instruct-v1.5` 中英文能力都很强，中文与英文之间的转换也很好。
- `deepseek-ai/deepseek-coder-7b-instruct-v1.5` 本身的功能就很强大，可以直接使用，需要调试好提示词。
- `deepseek-ai/deepseek-coder-7b-instruct-v1.5` 使用 LoRA 微调后的模型，可以很好的保留原本的功能，也可以很好的扩展新的功能。


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
