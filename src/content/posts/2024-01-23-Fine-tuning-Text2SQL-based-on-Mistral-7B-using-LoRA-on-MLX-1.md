---
layout: single
title:  "在 MLX 上使用 LoRA / QLoRA 微调 Text2SQL（一）：使用 LoRA 基于 Mistral-7B 微调"
date:   2024-01-23 08:00:00 +0800
categories: [AI 与大模型, 编程开发]
tags: [MLX, LoRA, Mistral-7B, Text2SQL, WikiSQL, MacBookProM2Max]
---

## 安装

```bash
git clone https://github.com/ml-explore/mlx-examples.git
cd mlx-examples/lora

pip install -r requirements.txt
```


## 下载模型

- [mistralai/Mistral-7B-v0.1](https://huggingface.co/mistralai/Mistral-7B-v0.1)

```bash
pip install huggingface_hub hf_transfer

export HF_HUB_ENABLE_HF_TRANSFER=1
huggingface-cli download \
    --local-dir-use-symlinks False \
    --local-dir mistralai/Mistral-7B-v0.1 \
    mistralai/Mistral-7B-v0.1
```
- [huggingface_hub Environment variables](https://huggingface.co/docs/huggingface_hub/package_reference/environment_variables)


## 数据集 WikiSQL

- [WikiSQL](https://github.com/salesforce/WikiSQL)
- [sqllama/sqllama-V0](https://huggingface.co/sqllama/sqllama-V0/blob/main/wikisql.ipynb)

### 样本格式

```json
{"text": "table: <table_name>
columns: <column_name1>, <column_name2>, <column_name3>
Q: <question>
A: SELECT <column_name2> FROM <table_name> WHERE <>"}
```

### 样本示例

```json
{"text": "table: 1-1000181-1\ncolumns: State/territory, Text/background colour, Format, Current slogan, Current series, Notes\nQ: What is the current series where the new series began in June 2011?\nA: SELECT Current series FROM 1-1000181-1 WHERE Notes = 'New series began in June 2011'"}
{"text": "table: 1-1000181-1\ncolumns: State/territory, Text/background colour, Format, Current slogan, Current series, Notes\nQ: What is the format for South Australia?\nA: SELECT Format FROM 1-1000181-1 WHERE State/territory = 'South Australia'"}
{"text": "table: 1-1000181-1\ncolumns: State/territory, Text/background colour, Format, Current slogan, Current series, Notes\nQ: Name the background colour for the Australian Capital Territory\nA: SELECT Text/background colour FROM 1-1000181-1 WHERE State/territory = 'Australian Capital Territory'"}
```


## 微调

### 基于模型 mistralai/Mistral-7B-v0.1 进行 LoRA 微调

在 MacBook Pro M2 Max 上 600 次迭代，耗时 20 分钟，占用内存 47G。

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
Iter 1: Val loss 2.376, Val took 27.120s
Iter 10: Train loss 2.276, It/sec 0.431, Tokens/sec 171.338
Iter 20: Train loss 1.758, It/sec 0.545, Tokens/sec 218.476
Iter 30: Train loss 1.543, It/sec 0.495, Tokens/sec 201.851
Iter 40: Train loss 1.380, It/sec 0.570, Tokens/sec 218.728
Iter 50: Train loss 1.248, It/sec 0.556, Tokens/sec 218.990
Iter 60: Train loss 1.133, It/sec 0.540, Tokens/sec 211.490
Iter 70: Train loss 1.173, It/sec 0.480, Tokens/sec 192.765
Iter 80: Train loss 1.179, It/sec 0.508, Tokens/sec 201.774
Iter 90: Train loss 1.149, It/sec 0.569, Tokens/sec 213.454
Iter 100: Train loss 1.208, It/sec 0.506, Tokens/sec 190.590
Iter 100: Saved adapter weights to adapters.npz.
Iter 110: Train loss 1.086, It/sec 0.606, Tokens/sec 231.982
Iter 120: Train loss 1.076, It/sec 0.527, Tokens/sec 203.822
Iter 130: Train loss 1.086, It/sec 0.548, Tokens/sec 214.598
Iter 140: Train loss 1.076, It/sec 0.526, Tokens/sec 202.990
Iter 150: Train loss 1.061, It/sec 0.482, Tokens/sec 194.181
Iter 160: Train loss 0.999, It/sec 0.520, Tokens/sec 202.290
Iter 170: Train loss 1.023, It/sec 0.515, Tokens/sec 210.128
Iter 180: Train loss 0.983, It/sec 0.577, Tokens/sec 207.285
Iter 190: Train loss 1.029, It/sec 0.545, Tokens/sec 216.047
Iter 200: Train loss 1.096, It/sec 0.540, Tokens/sec 203.309
Iter 200: Val loss 1.115, Val took 24.693s
Iter 200: Saved adapter weights to adapters.npz.
Iter 210: Train loss 1.066, It/sec 0.550, Tokens/sec 207.058
Iter 220: Train loss 0.993, It/sec 0.655, Tokens/sec 258.400
Iter 230: Train loss 0.992, It/sec 0.626, Tokens/sec 241.065
Iter 240: Train loss 0.933, It/sec 0.625, Tokens/sec 237.237
Iter 250: Train loss 0.987, It/sec 0.549, Tokens/sec 225.348
Iter 260: Train loss 0.877, It/sec 0.569, Tokens/sec 227.739
Iter 270: Train loss 0.843, It/sec 0.593, Tokens/sec 229.485
Iter 280: Train loss 0.881, It/sec 0.644, Tokens/sec 245.001
Iter 290: Train loss 0.950, It/sec 0.629, Tokens/sec 238.544
Iter 300: Train loss 0.819, It/sec 0.600, Tokens/sec 242.306
Iter 300: Saved adapter weights to adapters.npz.
Iter 310: Train loss 0.947, It/sec 0.646, Tokens/sec 239.077
Iter 320: Train loss 0.811, It/sec 0.568, Tokens/sec 218.934
Iter 330: Train loss 0.891, It/sec 0.562, Tokens/sec 224.256
Iter 340: Train loss 0.837, It/sec 0.590, Tokens/sec 224.871
Iter 350: Train loss 0.851, It/sec 0.628, Tokens/sec 238.298
Iter 360: Train loss 0.878, It/sec 0.597, Tokens/sec 236.297
Iter 370: Train loss 0.833, It/sec 0.550, Tokens/sec 222.876
Iter 380: Train loss 0.857, It/sec 0.593, Tokens/sec 225.336
Iter 390: Train loss 0.884, It/sec 0.622, Tokens/sec 238.801
Iter 400: Train loss 0.838, It/sec 0.534, Tokens/sec 224.068
Iter 400: Val loss 1.086, Val took 24.089s
Iter 400: Saved adapter weights to adapters.npz.
Iter 410: Train loss 0.825, It/sec 0.578, Tokens/sec 230.336
Iter 420: Train loss 0.827, It/sec 0.635, Tokens/sec 232.469
Iter 430: Train loss 0.797, It/sec 0.634, Tokens/sec 235.050
Iter 440: Train loss 0.853, It/sec 0.586, Tokens/sec 228.807
Iter 450: Train loss 0.804, It/sec 0.573, Tokens/sec 230.769
Iter 460: Train loss 0.850, It/sec 0.564, Tokens/sec 227.966
Iter 470: Train loss 0.774, It/sec 0.619, Tokens/sec 241.596
Iter 480: Train loss 0.810, It/sec 0.605, Tokens/sec 234.975
Iter 490: Train loss 0.764, It/sec 0.642, Tokens/sec 245.548
Iter 500: Train loss 0.805, It/sec 0.584, Tokens/sec 238.082
Iter 500: Saved adapter weights to adapters.npz.
Iter 510: Train loss 0.809, It/sec 0.572, Tokens/sec 229.507
Iter 520: Train loss 0.703, It/sec 0.593, Tokens/sec 231.239
Iter 530: Train loss 0.635, It/sec 0.566, Tokens/sec 226.033
Iter 540: Train loss 0.690, It/sec 0.635, Tokens/sec 240.545
Iter 550: Train loss 0.705, It/sec 0.650, Tokens/sec 253.223
Iter 560: Train loss 0.697, It/sec 0.590, Tokens/sec 232.188
Iter 570: Train loss 0.617, It/sec 0.618, Tokens/sec 236.465
Iter 580: Train loss 0.636, It/sec 0.621, Tokens/sec 239.133
Iter 590: Train loss 0.634, It/sec 0.591, Tokens/sec 230.575
Iter 600: Train loss 0.612, It/sec 0.589, Tokens/sec 239.730
Iter 600: Val loss 0.981, Val took 24.225s
Iter 600: Saved adapter weights to adapters.npz.
```

### 评估

计算测试集困惑度（PPL）和交叉熵损失（Loss）。

```bash
python lora.py --model mistralai/Mistral-7B-v0.1 \
               --adapter-file adapters.npz \
               --test
```
```
Loading pretrained model
Total parameters 7243.436M
Trainable parameters 1.704M
Loading datasets
Testing
Test loss 1.341, Test ppl 3.822.
```

### 生成

查看微调后的生成效果，使用内存 18G。

📌 没有使用模型的标注格式生成数据集，导致不能结束，直到生成最大的 Tokens 数量。

```bash
python lora.py --model mistralai/Mistral-7B-v0.1 \
               --adapter-file adapters.npz \
               --max-tokens 50 \
               --prompt "table: 1-10015132-16
columns: Player, No., Nationality, Position, Years in Toronto, School/Club Team
Q: What is terrence ross' nationality
A: "
```
```
table: 1-10015132-16
columns: Player, No., Nationality, Position, Years in Toronto, School/Club Team
Q: What is terrence ross' nationality
A: SELECT Nationality FROM 1-10015132-16 WHERE Player = 'Terrence Ross'",
background: yellowtcx: SELECT Years in Toronto FROM 1-100151
```

```bash
python lora.py --model mistralai/Mistral-7B-v0.1 \
               --adapter-file adapters.npz \
               --max-tokens 50 \
               --prompt "table: 1-10015132-16
columns: Player, No., Nationality, Position, Years in Toronto, School/Club Team
Q: 特伦斯·罗斯的国籍是什么
A: "
```
```
table: 1-10015132-16
columns: Player, No., Nationality, Position, Years in Toronto, School/Club Team
Q: 特伦斯·罗斯的国籍是什么
A: SELECT Position FROM 1-10015132-16 WHERE Player = 'Specialst Ros'dSELECT Position FROM 1-10015132-16 WHERERE Player
```

```bash
​python lora.py --model mistralai/Mistral-7B-v0.1 \
               --adapter-file adapters.npz \
               --max-tokens 50 \
               --prompt "表：1-10015132-16
列：球员、号码、国籍、位置、在多伦多的岁月、学校/俱乐部球队
问：特伦斯·罗斯的国籍是什么
答："
```
```
表：1-10015132-16
列：球员、号码、国籍、位置、在多伦多的岁月、学校/俱乐部球队
问：特伦斯·罗斯的国籍是什么
答：SELECT国�� FROM 1-10015132-16 WHERE 号码 = '11' AND 姓名 = '特��斯·罗斯'q
SELECT国��
```


## 使用预训练模型生成 SQL

### 使用 mlx-lm 生成

安装 mlx-lm

```bash
pip install mlx-lm
```

```bash
python -m mlx_lm.generate --model mistralai/Mistral-7B-v0.1 \
                          --max-tokens 50 \
                          --prompt "table: 1-10015132-16
columns: Player, No., Nationality, Position, Years in Toronto, School/Club Team
Q: What is terrence ross' nationality
A: "
```
```
Prompt: table: 1-10015132-16
columns: Player, No., Nationality, Position, Years in Toronto, School/Club Team
Q: What is terrence ross' nationality
A: 
1-10015132-16

table: 1-10015132-16
columns: Player, No., Nationality, Position, Years in Toronto, School/Cl
```

### 使用 0 参数的 adapters.npz 生成

转换 0 参数 adapters.npz 的脚本

```py
import numpy as np

# 加载npz文件
data = np.load('adapters.npz')

# 创建一个字典来存储新的npy文件
new_data = {}

# 遍历npz文件中的每个npy文件
for key in data.files:
    # 将每个npy文件的值设置为0
    new_data[key] = np.zeros_like(data[key])

# 保存新的npz文件
np.savez('zero_adapters.npz', **new_data)
```

```bash
python lora.py --model mistralai/Mistral-7B-v0.1 \
               --adapter-file zero_adapters.npz \
               --max-tokens 50 \
               --prompt "table: 1-10015132-16
columns: Player, No., Nationality, Position, Years in Toronto, School/Club Team
Q: What is terrence ross' nationality
A: "
```
```
table: 1-10015132-16
columns: Player, No., Nationality, Position, Years in Toronto, School/Club Team
Q: What is terrence ross' nationality
A: 1-10015132-16

table: 1-10015132-16
columns: Player, No., Nationality, Position, Years in Toronto, School/Cl
```


## 融合（Fuse）

```bash
python fuse.py --model mistralai/Mistral-7B-v0.1 \
               --adapter-file adapters.npz \
               --save-path lora_fused_model
```

融合后的模型文件结构如下：

```
lora_fused_model
├── config.json
├── special_tokens_map.json
├── tokenizer.json
├── tokenizer.model
├── tokenizer_config.json
└── weights.00.safetensors
```

### 生成

```bash
python -m mlx_lm.generate --model lora_fused_model \
                          --max-tokens 50 \
                          --prompt "table: 1-10015132-16
columns: Player, No., Nationality, Position, Years in Toronto, School/Club Team
Q: What is terrence ross' nationality
A: "
```
```
Prompt: table: 1-10015132-16
columns: Player, No., Nationality, Position, Years in Toronto, School/Club Team
Q: What is terrence ross' nationality
A: 
SELECT Nationality FROM 1-10015132-16 WHERE Player = 'Terrence Ross'�� FUNCTION school/club team
Q: How many years was terrence ross in school/
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
