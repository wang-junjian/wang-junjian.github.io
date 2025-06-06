---
layout: single
title:  "在 MLX 上使用 LoRA / QLoRA 微调 Text2SQL（五）：对比使用 LoRA 和 QLoRA 基于 Mistral-7B 微调的效果"
date:   2024-01-26 08:00:00 +0800
categories: MLX Text2SQL
tags: [MLX, LoRA, QLoRA, Mistral-7B, Text2SQL, WikiSQL, MacBookProM2Max]
---

## 使用 LoRA 和 QLoRA 基于 Mistral-7B 微调的实验
- [在 MLX 上使用 LoRA / QLoRA 微调 Text2SQL（二）：使用 LoRA 基于 Mistral-7B 微调]({% post_url 2024-01-24-Fine-tuning-Text2SQL-based-on-Mistral-7B-using-LoRA-on-MLX-2 %})
- [在 MLX 上使用 LoRA / QLoRA 微调 Text2SQL（四）：使用 QLoRA 基于 Mistral-7B 微调]({% post_url 2024-01-25-Fine-tuning-Text2SQL-based-on-Mistral-7B-using-LoRA-on-MLX-4 %})

## LoRA 和 QLoRA 对比
### 微调

| Iteration | LoRA Train Loss | LoRA Val Loss | LoRA Tokens/sec | QLoRA Train Loss | QLoRA Val Loss | QLoRA Tokens/sec |
| :-------: | --------------: | ------------: | --------------: | ---------------: | -------------: | ---------------: |
| 1         |                 | 2.343         |                 |                  | 2.420          |                  |
| 100       | 1.204           |               | 221.348         | 1.216            |                | 166.377          |
| 200       | 1.091           | 1.111         | 207.353         | 1.095            | 1.130          | 187.795          |
| 300       | 0.818           |               | 234.182         | 1.065            |                | 194.826          |
| 400       | 0.837           | 1.076         | 207.763         | 0.998            | 1.006          | 170.072          |
| 500       | 0.774           |               | 223.036         | 0.726            |                | 189.288          |
| 600       | 0.609           | 1.001         | 218.118         | 0.607            | 1.015          | 186.397          |

#### 微调的参数量
- LoRA 微调万分之 2.35 （1.704M / 7243.436M * 10000）的模型参数。
- QLoRA 微调万分之 13.70（1.704M / 1244.041M * 10000）的模型参数。

#### 微调的耗时
- LoRA 微调 600 次迭代，耗时 20 分 26 秒。
- QLoRA 微调 600 次迭代，耗时 23 分 40 秒。

#### 微调占用内存
- LoRA 46G
- QLoRA 46G


## 评估

计算测试集困惑度（PPL）和交叉熵损失（Loss）。

| Iteration | LoRA Test Loss | LoRA Test PPL | QLoRA Test Loss | QLoRA Test PPL |
| :-------: | -------------: | ------------: | --------------: | -------------: |
| 600       | 1.351          | 3.863         | 1.396           | 4.040          |

### 评估占用内存
- LoRA 26G
- QLoRA 15G


## 融合

### 模型的大小
- LoRA 13G
- QLoRA 4G


## 生成 SQL

### 王军建的姓名是什么？

```
Prompt: table: students
columns: Name, Age, School, Grade, Height, Weight
Q: What is Wang Junjian's name?
A: 
```

- LoRA
```sql
SELECT Name FROM students WHERE School = 'Wang Junjian'
```
```
Prompt: 88.790 tokens-per-sec
Generation: 16.811 tokens-per-sec
```

- QLoRA
```sql
SELECT Name FROM students WHERE School = 'Wang Junjian'
```
```
Prompt: 154.798 tokens-per-sec
Generation: 107.496 tokens-per-sec
```

### 王军建的年龄是多少？

```
Prompt: table: students
columns: Name, Age, School, Grade, Height, Weight
Q: How old is Wang Junjian?
A: 
```

- LoRA
```sql
SELECT Age FROM Students WHERE Name = 'Wang Junjian'
```
```
Prompt: 84.460 tokens-per-sec
Generation: 16.801 tokens-per-sec
```

- QLoRA
```sql
11 SELECT Age FROM students WHERE Name = 'Wang Junjian'
```
```
Prompt: 156.206 tokens-per-sec
Generation: 101.284 tokens-per-sec
```

### 王军建来自哪所学校？

```
Prompt: table: students
columns: Name, Age, School, Grade, Height, Weight
Q: Which school did Wang Junjian come from?
A: 
```

- LoRA
```sql
SELECT School FROM Students WHERE Name = 'Wang Junjian'
```
```
Prompt: 89.124 tokens-per-sec
Generation: 16.718 tokens-per-sec
```

- QLoRA
```sql
SELECT School FROM students WHERE Name = 'Wang Junjian'
```
```
Prompt: 160.011 tokens-per-sec
Generation: 121.895 tokens-per-sec
```

### 查询王军建的姓名、年龄、学校信息。

```
Prompt: table: students
columns: Name, Age, School, Grade, Height, Weight
Q: Query Wang Junjian’s name, age, and school information.
A: 
```

- LoRA
```sql
SELECT Name, Age, School FROM Students WHERE Name = 'Wang Junjian'
```
```
Prompt: 100.919 tokens-per-sec
Generation: 17.139 tokens-per-sec
```

- QLoRA
```sql
SELECT Name FROM students WHERE Age = 13 AND School = 'Hangzhou Foreign Language School'
```
```
Prompt: 183.456 tokens-per-sec
Generation: 121.376 tokens-per-sec
```

### 查询王军建的所有信息。

```
Prompt: table: students
columns: Name, Age, School, Grade, Height, Weight
Q: Query all information about Wang Junjian.
A: 
```

- LoRA
```sql
SELECT Name FROM students WHERE Name = 'Wang Junjian'
```
```
Prompt: 88.225 tokens-per-sec
Generation: 16.781 tokens-per-sec
```

- QLoRA
```sql
SELECT Name FROM students WHERE School = 'Wang Junjian'
```
```
Prompt: 151.962 tokens-per-sec
Generation: 122.067 tokens-per-sec
```

### 统计一下九年级有多少学生。

```
Prompt: table: students
columns: Name, Age, School, Grade, Height, Weight
Q: Count how many students there are in ninth grade.
A: 
```

- LoRA
```sql
SELECT COUNT Name FROM Students WHERE Grade = '9th'
```
```
Prompt: 93.829 tokens-per-sec
Generation: 16.546 tokens-per-sec
```

- QLoRA
```sql
SELECT COUNT Name FROM students WHERE Grade = 9
```
```
Prompt: 164.480 tokens-per-sec
Generation: 115.851 tokens-per-sec
```

### 统计一下九年级有多少学生（九年级的值是9）。

- LoRA

```
Prompt: table: students
columns: Name, Age, School, Grade, Height, Weight
The value for ninth grade is 9.
Q: Count how many students there are in ninth grade.
A: 
```
```sql
SELECT COUNT Name FROM students WHERE Grade = 9
```
```
Prompt: 117.893 tokens-per-sec
Generation: 16.298 tokens-per-sec
```

- QLoRA

```
Prompt: table: students
columns: Name, Age, School, Grade, Height, Weight
The value for ninth grade is 9th.
Q: Count how many students there are in ninth grade.
A: 
```
```sql
 SELECT COUNT Name FROM students WHERE Grade = '9th'
```
```
Prompt: 216.152 tokens-per-sec
Generation: 114.300 tokens-per-sec
```

在相同的 Iteration 次数下 QLoRA 不如 LoRA 的效果。

### 生成速度

| Fine-Tuning | Prompt tokens/sec | Generation tokens/sec | Fine-Tuning | Prompt tokens/sec | Generation tokens/sec |
| ----------- | ----------------: | --------------------: | ----------- | ----------------: | --------------------: |
| LoRA        | 88.790            | 16.811                | QLoRA       | 154.798           | 107.496               |
| LoRA        | 84.460            | 16.801                | QLoRA       | 156.206           | 101.284               |
| LoRA        | 89.124            | 16.718                | QLoRA       | 160.011           | 121.895               |
| LoRA        | 100.919           | 17.139                | QLoRA       | 183.456           | 121.376               |
| LoRA        | 88.225            | 16.781                | QLoRA       | 151.962           | 122.067               |
| LoRA        | 93.829            | 16.546                | QLoRA       | 164.480           | 115.851               |
| LoRA        | 117.893           | 16.298                | QLoRA       | 216.152           | 114.300               |

- `Prompt tokens/sec`: QLoRA 是 LoRA 的 1.79 倍
- `Generation tokens/sec`: QLoRA 是 LoRA 的 8.87 倍


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
