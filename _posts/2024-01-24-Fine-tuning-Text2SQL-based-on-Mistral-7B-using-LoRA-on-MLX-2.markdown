---
layout: post
title:  "在 MLX 上使用 LoRA 基于 Mistral-7B 微调 Text2SQL（二）"
date:   2024-01-24 08:00:00 +0800
categories: MLX LoRA
tags: [MLX, LoRA, Mistral-7B, Text2SQL, WikiSQL, git, push, HuggingFace, HuggingFaceHub, MacBookProM2Max]
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


## [在 MLX 上使用 LoRA 基于 Mistral-7B 微调 Text2SQL（一）]({% post_url 2024-01-23-Fine-tuning-Text2SQL-based-on-Mistral-7B-using-LoRA-on-MLX-1 %})

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
Total parameters 7243.436M
Trainable parameters 1.704M
python lora.py --model mistralai/Mistral-7B-v0.1 --train --iters 600  50.58s user 214.71s system 21% cpu 20:26.04 total
```

微调万分之 2.35 （1.704M / 7243.436M * 10000）的模型参数。

LoRA 微调 600 次迭代，耗时 20 分 26 秒，占用内存 46G。

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

| Iter | Test loss | Test ppl |
| :--: | --------: | -------: |
| 100  | 1.351     | 3.862    |
| 200  | 1.327     | 3.770    |
| 300  | 1.353     | 3.869    |
| 400  | 1.355     | 3.875    |
| 500  | 1.294     | 3.646    |
| 600  | 1.351     | 3.863    |

评估占用内存 26G。


## 融合（Fuse）

```bash
python fuse.py --model mistralai/Mistral-7B-v0.1 \
               --adapter-file adapters.npz \
               --save-path lora_fused_model
```


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
```

附加的提示信息可以轻松添加，不用太在意放置的位置。


## 上传模型到 HuggingFace Hub

1. 加入 [MLX Community](https://huggingface.co/mlx-community) 组织

2. 在 MLX Community 组织中创建一个新的模型 [mlx-community/Mistral-7B-v0.1-LoRA-Text2SQL](https://huggingface.co/mlx-community/Mistral-7B-v0.1-LoRA-Text2SQL)

3. 克隆仓库 [mlx-community/Mistral-7B-v0.1-LoRA-Text2SQL](https://huggingface.co/mlx-community/Mistral-7B-v0.1-LoRA-Text2SQL)

```bash
git clone https://huggingface.co/mlx-community/Mistral-7B-v0.1-LoRA-Text2SQL
```

4. 将生成的模型文件（`lora_fused_model` 目录下的所有文件）复制到仓库目录下

5. 上传模型到 HuggingFace Hub

```bash
git add .
git commit -m "Fine tuning Text2SQL based on Mistral-7B using LoRA on MLX" 
git push
```

### git push 错误

1. 不能 push

错误信息：

```
Uploading LFS objects:   0% (0/2), 0 B | 0 B/s, done.                                                                                                                                                                                              
batch response: Authorization error.
error: failed to push some refs to 'https://huggingface.co/mlx-community/Mistral-7B-v0.1-LoRA-Text2SQL'
```

解决方法：

```bash
vim .git/config
```
```conf
[remote "origin"]
    url = https://wangjunjian:write_token@huggingface.co/mlx-community/Mistral-7B-v0.1-LoRA-Text2SQL
    fetch = +refs/heads/*:refs/remotes/origin/*
```

2. 不能上传大于 5GB 的文件

错误信息：

```
warning: current Git remote contains credentials                                                                                                                                                                                                   
batch response: 
You need to configure your repository to enable upload of files > 5GB.
Run "huggingface-cli lfs-enable-largefiles ./path/to/your/repo" and try again.
```


解决方法：

```bash
huggingface-cli longin
huggingface-cli lfs-enable-largefiles /Users/junjian/HuggingFace/mlx-community/Mistral-7B-v0.1-LoRA-Text2SQL
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
