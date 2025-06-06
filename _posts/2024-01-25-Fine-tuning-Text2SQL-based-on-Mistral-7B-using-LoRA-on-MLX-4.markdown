---
layout: single
title:  "在 MLX 上使用 LoRA / QLoRA 微调 Text2SQL（四）：使用 QLoRA 基于 Mistral-7B 微调"
date:   2024-01-25 08:00:00 +0800
categories: MLX Text2SQL
tags: [MLX, QLoRA, Mistral-7B, Text2SQL, WikiSQL, MacBookProM2Max]
---

## 预训练模型 [mistralai/Mistral-7B-v0.1](https://huggingface.co/mistralai/Mistral-7B-v0.1) 

## 量化

QLoRA 微调需要量化，生成 `4 位`量化的 `Mistral 7B` 并默认将其存储在 `mlx_model` 目录中

```bash
python convert.py --hf-path mistralai/Mistral-7B-v0.1 -q
```

`mlx_model` 目录结构如下：
```bash
mlx_model
├── config.json
├── model.safetensors
├── special_tokens_map.json
├── tokenizer.json
├── tokenizer.model
├── tokenizer_config.json
└── weights.00.safetensors
```

量化后的模型 `8.0G`


## 微调

### QLoRA 微调

```bash
python lora.py --model mlx_model \
               --train \
               --iters 600
```
```
Loading pretrained model
Total parameters 1244.041M
Trainable parameters 1.704M
Loading datasets
Training
Iter 1: Val loss 2.420, Val took 32.229s
Iter 10: Train loss 2.308, It/sec 0.388, Tokens/sec 155.982
Iter 20: Train loss 1.748, It/sec 0.459, Tokens/sec 186.088
Iter 30: Train loss 1.487, It/sec 0.451, Tokens/sec 185.720
Iter 40: Train loss 1.373, It/sec 0.466, Tokens/sec 180.710
Iter 50: Train loss 1.263, It/sec 0.462, Tokens/sec 183.856
Iter 60: Train loss 1.128, It/sec 0.483, Tokens/sec 191.427
Iter 70: Train loss 1.193, It/sec 0.415, Tokens/sec 168.129
Iter 80: Train loss 1.187, It/sec 0.438, Tokens/sec 175.615
Iter 90: Train loss 1.165, It/sec 0.505, Tokens/sec 191.464
Iter 100: Train loss 1.216, It/sec 0.437, Tokens/sec 166.377
Iter 100: Saved adapter weights to adapters.npz.
Iter 110: Train loss 1.106, It/sec 0.504, Tokens/sec 194.826
Iter 120: Train loss 1.086, It/sec 0.443, Tokens/sec 172.983
Iter 130: Train loss 1.096, It/sec 0.458, Tokens/sec 181.211
Iter 140: Train loss 1.087, It/sec 0.488, Tokens/sec 190.167
Iter 150: Train loss 1.089, It/sec 0.429, Tokens/sec 174.838
Iter 160: Train loss 1.017, It/sec 0.459, Tokens/sec 180.264
Iter 170: Train loss 1.041, It/sec 0.475, Tokens/sec 195.793
Iter 180: Train loss 0.998, It/sec 0.525, Tokens/sec 190.633
Iter 190: Train loss 1.054, It/sec 0.477, Tokens/sec 191.109
Iter 200: Train loss 1.095, It/sec 0.493, Tokens/sec 187.795
Iter 200: Val loss 1.130, Val took 32.258s
Iter 200: Saved adapter weights to adapters.npz.
Iter 210: Train loss 1.065, It/sec 0.455, Tokens/sec 173.140
Iter 220: Train loss 0.999, It/sec 0.488, Tokens/sec 194.324
Iter 230: Train loss 0.993, It/sec 0.473, Tokens/sec 183.961
Iter 240: Train loss 0.937, It/sec 0.502, Tokens/sec 192.688
Iter 250: Train loss 0.982, It/sec 0.448, Tokens/sec 185.853
Iter 260: Train loss 0.875, It/sec 0.462, Tokens/sec 186.802
Iter 270: Train loss 0.845, It/sec 0.470, Tokens/sec 183.813
Iter 280: Train loss 0.857, It/sec 0.504, Tokens/sec 193.769
Iter 290: Train loss 0.924, It/sec 0.479, Tokens/sec 183.488
Iter 300: Train loss 0.751, It/sec 0.473, Tokens/sec 192.737
Iter 300: Saved adapter weights to adapters.npz.
Iter 310: Train loss 0.871, It/sec 0.520, Tokens/sec 194.461
Iter 320: Train loss 0.726, It/sec 0.465, Tokens/sec 181.200
Iter 330: Train loss 0.817, It/sec 0.458, Tokens/sec 184.790
Iter 340: Train loss 0.746, It/sec 0.479, Tokens/sec 184.412
Iter 350: Train loss 0.768, It/sec 0.496, Tokens/sec 190.082
Iter 360: Train loss 0.791, It/sec 0.467, Tokens/sec 186.836
Iter 370: Train loss 0.751, It/sec 0.444, Tokens/sec 181.680
Iter 380: Train loss 0.775, It/sec 0.469, Tokens/sec 180.115
Iter 390: Train loss 0.798, It/sec 0.484, Tokens/sec 187.477
Iter 400: Train loss 0.769, It/sec 0.402, Tokens/sec 170.072
Iter 400: Val loss 1.006, Val took 33.268s
Iter 400: Saved adapter weights to adapters.npz.
Iter 410: Train loss 0.741, It/sec 0.444, Tokens/sec 178.822
Iter 420: Train loss 0.744, It/sec 0.478, Tokens/sec 176.976
Iter 430: Train loss 0.714, It/sec 0.497, Tokens/sec 186.067
Iter 440: Train loss 0.780, It/sec 0.472, Tokens/sec 186.158
Iter 450: Train loss 0.727, It/sec 0.442, Tokens/sec 179.839
Iter 460: Train loss 0.762, It/sec 0.452, Tokens/sec 184.472
Iter 470: Train loss 0.698, It/sec 0.491, Tokens/sec 193.616
Iter 480: Train loss 0.740, It/sec 0.453, Tokens/sec 177.975
Iter 490: Train loss 0.681, It/sec 0.516, Tokens/sec 199.231
Iter 500: Train loss 0.726, It/sec 0.460, Tokens/sec 189.288
Iter 500: Saved adapter weights to adapters.npz.
Iter 510: Train loss 0.748, It/sec 0.440, Tokens/sec 178.288
Iter 520: Train loss 0.629, It/sec 0.480, Tokens/sec 189.089
Iter 530: Train loss 0.577, It/sec 0.452, Tokens/sec 182.326
Iter 540: Train loss 0.636, It/sec 0.510, Tokens/sec 195.363
Iter 550: Train loss 0.670, It/sec 0.484, Tokens/sec 190.476
Iter 560: Train loss 0.690, It/sec 0.480, Tokens/sec 190.871
Iter 570: Train loss 0.625, It/sec 0.501, Tokens/sec 193.686
Iter 580: Train loss 0.628, It/sec 0.490, Tokens/sec 190.567
Iter 590: Train loss 0.627, It/sec 0.455, Tokens/sec 179.460
Iter 600: Train loss 0.607, It/sec 0.454, Tokens/sec 186.397
Iter 600: Val loss 1.015, Val took 33.347s
Iter 600: Saved adapter weights to adapters.npz.
python lora.py --model mlx_model --train --iters 600  49.62s user 174.63s system 15% cpu 23:40.75 total
```

微调万分之 13.70（1.704M / 1244.041M * 10000）的模型参数。

QLoRA 微调 600 次迭代，耗时 23 分 40 秒，占用内存 46G。

| Iteration | Train Loss | Val Loss | Tokens/sec |
| :-------: | ---------: | -------: | ---------: |
| 1         |            | 2.420    |            |
| 100       | 1.216      |          | 166.377    |
| 200       | 1.095      | 1.130    | 187.795    |
| 300       | 1.065      |          | 194.826    |
| 400       | 0.998      | 1.006    | 170.072    |
| 500       | 0.726      |          | 189.288    |
| 600       | 0.607      | 1.015    | 186.397    |


## 评估

计算测试集困惑度（PPL）和交叉熵损失（Loss）。

```bash
python lora.py --model mlx_model \
               --adapter-file adapters.npz \
               --test
```
```
Test loss 1.396, Test ppl 4.040.
```

评估占用内存 15G。


## 融合（Fuse）

```bash
python fuse.py --model mlx_model \
               --adapter-file adapters.npz \
               --save-path lora_fused_model
```

`lora_fused_model` 目录结构如下：
```bash
lora_fused_model
├── config.json
├── special_tokens_map.json
├── tokenizer.json
├── tokenizer.model
├── tokenizer_config.json
└── weights.00.safetensors
```

融合后的模型 `4.0G`


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
SELECT Name FROM students WHERE School = 'Wang Junjian'
==========
Prompt: 154.798 tokens-per-sec
Generation: 107.496 tokens-per-sec
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
11 SELECT Age FROM students WHERE Name = 'Wang Junjian'
==========
Prompt: 156.206 tokens-per-sec
Generation: 101.284 tokens-per-sec
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
SELECT School FROM students WHERE Name = 'Wang Junjian'
==========
Prompt: 160.011 tokens-per-sec
Generation: 121.895 tokens-per-sec
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
SELECT Name FROM students WHERE Age = 13 AND School = 'Hangzhou Foreign Language School'
==========
Prompt: 183.456 tokens-per-sec
Generation: 121.376 tokens-per-sec
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
SELECT Name FROM students WHERE School = 'Wang Junjian'
==========
Prompt: 151.962 tokens-per-sec
Generation: 122.067 tokens-per-sec
```

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
SELECT COUNT Name FROM students WHERE Grade = 9
==========
Prompt: 164.480 tokens-per-sec
Generation: 115.851 tokens-per-sec
```

### 统计一下九年级有多少学生（九年级的值是9th）。

```bash
python -m mlx_lm.generate --model lora_fused_model \
                          --max-tokens 50 \
                          --prompt "table: students
columns: Name, Age, School, Grade, Height, Weight
The value for ninth grade is 9th.
Q: Count how many students there are in ninth grade.
A: "
```

```bash
python -m mlx_lm.generate --model lora_fused_model \
                          --max-tokens 50 \
                          --prompt "table: students
columns: Name, Age, School, Grade, Height, Weight
Q: Count how many students there are in ninth grade.（The value for ninth grade is 9th.）
A: "
```

```
 SELECT COUNT Name FROM students WHERE Grade = '9th'
==========
Prompt: 216.152 tokens-per-sec
Generation: 114.300 tokens-per-sec
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
