---
layout: single
title:  "在 MLX 上使用 LoRA / QLoRA 微调 Text2SQL（三）：分享微调后的模型到 HuggingFace Hub"
date:   2024-01-24 12:00:00 +0800
categories: MLX Text2SQL
tags: [MLX, LoRA, Mistral-7B, Text2SQL, git, push, HuggingFace, HuggingFaceHub, MLXCommunity, MacBookProM2Max]
---

## [mlx-community/Mistral-7B-v0.1-LoRA-Text2SQL](https://huggingface.co/mlx-community/Mistral-7B-v0.1-LoRA-Text2SQL)

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

- [共享预训练模型](https://huggingface.co/learn/nlp-course/zh-CN/chapter4/3?fw=pt)

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

- [Can’t Push to New Space](https://discuss.huggingface.co/t/cant-push-to-new-space/35319)


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
