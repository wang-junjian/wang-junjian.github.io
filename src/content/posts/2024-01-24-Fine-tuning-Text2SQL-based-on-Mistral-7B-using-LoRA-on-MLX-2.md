---
layout: single
title:  "在 MLX 上使用 LoRA / QLoRA 微调 Text2SQL（二）：使用 LoRA 基于 Mistral-7B 微调"
date:   2024-01-24 08:00:00 +0800
categories: MLX Text2SQL
tags: [MLX, LoRA, Mistral-7B, Text2SQL, WikiSQL, MacBookProM2Max]
---

## [mlx-community/Mistral-7B-v0.1-LoRA-Text2SQL](https://huggingface.co/mlx-community/Mistral-7B-v0.1-LoRA-Text2SQL)

本次微调的模型我已经上传到了 HuggingFace Hub 上，大家可以进行尝试。

### 安装 mlx-lm

```bash
pip install mlx-lm
```

### 生成 SQL
```
python -m mlx_lm.generate --model mlx-community/Mistral-7B-v0.1-LoRA-Text2SQL \
                          --max-tokens 50 \
                          --prompt "table: students
columns: Name, Age, School, Grade, Height, Weight
Q: Which school did Wang Junjian come from?
A: "
```
```
SELECT School FROM Students WHERE Name = 'Wang Junjian'
```


## [在 MLX 上使用 LoRA / QLoRA 微调 Text2SQL（一）：使用 LoRA 基于 Mistral-7B 微调]([2024-01-23-Fine-tuning-Text2SQL-based-on-Mistral-7B-using-LoRA-on-MLX-1](/posts/2024-01-23-Fine-tuning-Text2SQL-based-on-Mistral-7B-using-LoRA-on-MLX-1))

📌 没有使用模型的标注格式生成数据集，导致不能结束，直到生成最大的 Tokens 数量。

这次我们来解决这个问题。

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
                """
                t 变量的文本是这样的：
                ------------------------
                <s>table: 1-1058787-1
                columns: Approximate Age, Virtues, Psycho Social Crisis, Significant Relationship, Existential Question [ not in citation given ], Examples
                Q: How many significant relationships list Will as a virtue?
                A: SELECT COUNT Significant Relationship FROM 1-1058787-1 WHERE Virtues = 'Will'</s>                
                """
                t = t[3:] # 去掉开头的 <s>，因为 tokenizer 会自动添加 <s>
                json.dump({"text": t}, fid)
                fid.write("\n")
```

执行脚本 `data/wikisql.py` 生成数据集。

### 样本示例

```
table: 1-10753917-1
columns: Season, Driver, Team, Engine, Poles, Wins, Podiums, Points, Margin of defeat
Q: Which podiums did the alfa romeo team have?
A: SELECT Podiums FROM 1-10753917-1 WHERE Team = 'Alfa Romeo'</s>
```


## 微调

- 预训练模型 [mistralai/Mistral-7B-v0.1](https://huggingface.co/mistralai/Mistral-7B-v0.1) 

### LoRA 微调

```bash
python lora.py --model mistralai/Mistral-7B-v0.1 \
               --train \
               --iters 600
```
```
Loading pretrained model
Total parameters 7243.436M
Trainable parameters 1.704M
Loading datasets
Training
Iter 1: Val loss 2.343, Val took 24.272s
Iter 10: Train loss 2.237, It/sec 0.412, Tokens/sec 165.740
Iter 20: Train loss 1.688, It/sec 0.510, Tokens/sec 206.577
Iter 30: Train loss 1.475, It/sec 0.526, Tokens/sec 216.519
Iter 40: Train loss 1.359, It/sec 0.539, Tokens/sec 208.807
Iter 50: Train loss 1.243, It/sec 0.567, Tokens/sec 225.619
Iter 60: Train loss 1.125, It/sec 0.567, Tokens/sec 224.679
Iter 70: Train loss 1.177, It/sec 0.485, Tokens/sec 196.413
Iter 80: Train loss 1.180, It/sec 0.512, Tokens/sec 205.216
Iter 90: Train loss 1.152, It/sec 0.593, Tokens/sec 224.874
Iter 100: Train loss 1.204, It/sec 0.581, Tokens/sec 221.348
Iter 100: Saved adapter weights to adapters.npz.
Iter 110: Train loss 1.080, It/sec 0.567, Tokens/sec 219.234
Iter 120: Train loss 1.065, It/sec 0.563, Tokens/sec 219.935
Iter 130: Train loss 1.083, It/sec 0.536, Tokens/sec 211.902
Iter 140: Train loss 1.072, It/sec 0.546, Tokens/sec 212.716
Iter 150: Train loss 1.061, It/sec 0.472, Tokens/sec 192.188
Iter 160: Train loss 0.991, It/sec 0.512, Tokens/sec 201.292
Iter 170: Train loss 1.028, It/sec 0.535, Tokens/sec 220.537
Iter 180: Train loss 0.978, It/sec 0.594, Tokens/sec 215.790
Iter 190: Train loss 1.033, It/sec 0.537, Tokens/sec 214.972
Iter 200: Train loss 1.091, It/sec 0.545, Tokens/sec 207.353
Iter 200: Val loss 1.111, Val took 30.101s
Iter 200: Saved adapter weights to adapters.npz.
Iter 210: Train loss 1.056, It/sec 0.573, Tokens/sec 217.968
Iter 220: Train loss 0.987, It/sec 0.552, Tokens/sec 220.129
Iter 230: Train loss 0.984, It/sec 0.578, Tokens/sec 225.119
Iter 240: Train loss 0.929, It/sec 0.593, Tokens/sec 227.224
Iter 250: Train loss 0.984, It/sec 0.504, Tokens/sec 209.164
Iter 260: Train loss 0.871, It/sec 0.529, Tokens/sec 213.830
Iter 270: Train loss 0.843, It/sec 0.549, Tokens/sec 214.504
Iter 280: Train loss 0.866, It/sec 0.606, Tokens/sec 233.129
Iter 290: Train loss 0.946, It/sec 0.564, Tokens/sec 216.089
Iter 300: Train loss 0.818, It/sec 0.574, Tokens/sec 234.182
Iter 300: Saved adapter weights to adapters.npz.
Iter 310: Train loss 0.939, It/sec 0.610, Tokens/sec 228.415
Iter 320: Train loss 0.811, It/sec 0.536, Tokens/sec 208.765
Iter 330: Train loss 0.890, It/sec 0.514, Tokens/sec 207.142
Iter 340: Train loss 0.825, It/sec 0.494, Tokens/sec 190.312
Iter 350: Train loss 0.845, It/sec 0.552, Tokens/sec 211.589
Iter 360: Train loss 0.872, It/sec 0.553, Tokens/sec 221.311
Iter 370: Train loss 0.832, It/sec 0.502, Tokens/sec 205.400
Iter 380: Train loss 0.855, It/sec 0.565, Tokens/sec 217.207
Iter 390: Train loss 0.873, It/sec 0.593, Tokens/sec 229.769
Iter 400: Train loss 0.837, It/sec 0.491, Tokens/sec 207.763
Iter 400: Val loss 1.076, Val took 31.449s
Iter 400: Saved adapter weights to adapters.npz.
Iter 410: Train loss 0.821, It/sec 0.556, Tokens/sec 223.608
Iter 420: Train loss 0.828, It/sec 0.593, Tokens/sec 219.316
Iter 430: Train loss 0.787, It/sec 0.573, Tokens/sec 214.802
Iter 440: Train loss 0.842, It/sec 0.529, Tokens/sec 208.544
Iter 450: Train loss 0.794, It/sec 0.531, Tokens/sec 215.918
Iter 460: Train loss 0.832, It/sec 0.520, Tokens/sec 212.107
Iter 470: Train loss 0.767, It/sec 0.578, Tokens/sec 228.089
Iter 480: Train loss 0.794, It/sec 0.548, Tokens/sec 215.279
Iter 490: Train loss 0.737, It/sec 0.612, Tokens/sec 236.395
Iter 500: Train loss 0.774, It/sec 0.542, Tokens/sec 223.036
Iter 500: Saved adapter weights to adapters.npz.
Iter 510: Train loss 0.750, It/sec 0.524, Tokens/sec 212.472
Iter 520: Train loss 0.636, It/sec 0.562, Tokens/sec 221.322
Iter 530: Train loss 0.587, It/sec 0.541, Tokens/sec 218.441
Iter 540: Train loss 0.631, It/sec 0.589, Tokens/sec 225.624
Iter 550: Train loss 0.661, It/sec 0.580, Tokens/sec 228.000
Iter 560: Train loss 0.686, It/sec 0.537, Tokens/sec 213.582
Iter 570: Train loss 0.630, It/sec 0.543, Tokens/sec 210.104
Iter 580: Train loss 0.632, It/sec 0.588, Tokens/sec 228.862
Iter 590: Train loss 0.632, It/sec 0.517, Tokens/sec 203.740
Iter 600: Train loss 0.609, It/sec 0.531, Tokens/sec 218.118
Iter 600: Val loss 1.001, Val took 30.002s
Iter 600: Saved adapter weights to adapters.npz.
python lora.py --model mistralai/Mistral-7B-v0.1 --train --iters 600  50.58s user 214.71s system 21% cpu 20:26.04 total
```

微调万分之 2.35 （1.704M / 7243.436M * 10000）的模型参数。

LoRA 微调 600 次迭代，耗时 20 分 26 秒，占用内存 46G。

| Iteration | Train Loss | Val Loss | Tokens/sec |
| :-------: | ---------: | -------: | ---------: |
| 1         |            | 2.343    |            |
| 100       | 1.204      |          | 221.348    |
| 200       | 1.091      | 1.111    | 207.353    |
| 300       | 0.818      |          | 234.182    |
| 400       | 0.837      | 1.076    | 207.763    |
| 500       | 0.774      |          | 223.036    |
| 600       | 0.609      | 1.001    | 218.118    |


## 评估

计算测试集困惑度（PPL）和交叉熵损失（Loss）。

```bash
python lora.py --model mistralai/Mistral-7B-v0.1 \
               --adapter-file adapters.npz \
               --test
```
```
Iter 100: Test loss 1.351, Test ppl 3.862.
Iter 200: Test loss 1.327, Test ppl 3.770.
Iter 300: Test loss 1.353, Test ppl 3.869.
Iter 400: Test loss 1.355, Test ppl 3.875.
Iter 500: Test loss 1.294, Test ppl 3.646.
Iter 600: Test loss 1.351, Test ppl 3.863.
```

|     | Iteration | Test Loss | Test PPL |
| --- | :-------: | --------: | -------: |
|     | 100       | 1.351     | 3.862    |
|     | 200       | 1.327     | 3.770    |
|     | 300       | 1.353     | 3.869    |
|     | 400       | 1.355     | 3.875    |
| 👍  | 500       | 1.294     | 3.646    |
|     | 600       | 1.351     | 3.863    |

评估占用内存 26G。


## 融合（Fuse）

```bash
python fuse.py --model mistralai/Mistral-7B-v0.1 \
               --adapter-file adapters.npz \
               --save-path lora_fused_model
```

这里使用了 `Iter 500` 的模型参数，因为它的测试集困惑度最低。


## 生成 SQL

### 王军建的姓名是什么？

```bash
python -m mlx_lm.generate --model lora_fused_model \
                          --max-tokens 50 \
                          --prompt "table: students
columns: Name, Age, School, Grade, Height, Weight
Q: What is Wang Junjian's name?
A: "
```
```
SELECT Name FROM students WHERE Name = 'Wang Junjian'
==========
Prompt: 88.790 tokens-per-sec
Generation: 16.811 tokens-per-sec
```


### 王军建的年龄是多少？

```bash
python -m mlx_lm.generate --model lora_fused_model \
                          --max-tokens 50 \
                          --prompt "table: students
columns: Name, Age, School, Grade, Height, Weight
Q: How old is Wang Junjian?
A: "
```
```
SELECT Age FROM Students WHERE Name = 'Wang Junjian'
==========
Prompt: 84.460 tokens-per-sec
Generation: 16.801 tokens-per-sec
```

### 王军建来自哪所学校？

```bash
python -m mlx_lm.generate --model lora_fused_model \
                          --max-tokens 50 \
                          --prompt "table: students
columns: Name, Age, School, Grade, Height, Weight
Q: Which school did Wang Junjian come from?
A: "
```
```
SELECT School FROM Students WHERE Name = 'Wang Junjian'
==========
Prompt: 89.124 tokens-per-sec
Generation: 16.718 tokens-per-sec
```

### 查询王军建的姓名、年龄、学校信息。

```bash
python -m mlx_lm.generate --model lora_fused_model \
                          --max-tokens 50 \
                          --prompt "table: students
columns: Name, Age, School, Grade, Height, Weight
Q: Query Wang Junjian’s name, age, and school information.
A: "
```
```
SELECT Name, Age, School FROM Students WHERE Name = 'Wang Junjian'
==========
Prompt: 100.919 tokens-per-sec
Generation: 17.139 tokens-per-sec
```

### 查询王军建的所有信息。

```bash
python -m mlx_lm.generate --model lora_fused_model \
                          --max-tokens 50 \
                          --prompt "table: students
columns: Name, Age, School, Grade, Height, Weight
Q: Query all information about Wang Junjian.
A: "
```
```
SELECT Name FROM students WHERE Name = 'Wang Junjian'
==========
Prompt: 88.225 tokens-per-sec
Generation: 16.781 tokens-per-sec
```

可能训练数据不足。

### 统计一下九年级有多少学生。

```bash
python -m mlx_lm.generate --model lora_fused_model \
                          --max-tokens 50 \
                          --prompt "table: students
columns: Name, Age, School, Grade, Height, Weight
Q: Count how many students there are in ninth grade.
A: "
```
```
SELECT COUNT Name FROM Students WHERE Grade = '9th'
==========
Prompt: 93.829 tokens-per-sec
Generation: 16.546 tokens-per-sec
```

### 统计一下九年级有多少学生（九年级的值是9）。

```bash
python -m mlx_lm.generate --model lora_fused_model \
                          --max-tokens 50 \
                          --prompt "table: students
columns: Name, Age, School, Grade, Height, Weight
The value for ninth grade is 9.
Q: Count how many students there are in ninth grade.
A: "
```

```bash
python -m mlx_lm.generate --model lora_fused_model \
                          --max-tokens 50 \
                          --prompt "table: students
columns: Name, Age, School, Grade, Height, Weight
Q: Count how many students there are in ninth grade.（The value for ninth grade is 9.）
A: "
```

```
SELECT COUNT Name FROM students WHERE Grade = 9
==========
Prompt: 117.893 tokens-per-sec
Generation: 16.298 tokens-per-sec
```

附加的提示信息可以轻松添加，不用太在意放置的位置。


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
