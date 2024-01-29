---
layout: post
title:  "在 MLX 上使用 LoRA / QLoRA 微调 Text2SQL（七）：MLX 微调的模型转换为 GGUF 模型"
date:   2024-01-28 08:00:00 +0800
categories: MLX Text2SQL
tags: [MLX, LoRA, Mistral-7B, Text2SQL, WikiSQL, MacBookProM2Max]
---

将 MLX 微调的模型转换为 GGUF 模型最大的意义是可以融入 GGUF 的生态系统，可以在更多的平台上使用。

## LoRA 微调

### 大模型 Mistral-7B-v0.1
- [mistralai/Mistral-7B-v0.1](https://huggingface.co/mistralai/Mistral-7B-v0.1)

### 数据集 WikiSQL

- [WikiSQL](https://github.com/salesforce/WikiSQL)
- [sqllama/sqllama-V0](https://huggingface.co/sqllama/sqllama-V0/blob/main/wikisql.ipynb)

修改脚本 `mlx-examples/lora/data/wikisql.py`
```py
if __name__ == "__main__":
    # ......
    for dataset, name, size in datasets:
        with open(f"data/{name}.jsonl", "w") as fid:
            for e, t in zip(range(size), dataset):
                t = t[3:]
                json.dump({"text": t}, fid)
                fid.write("\n")
```

执行脚本 `data/wikisql.py` 生成数据集。
    
```bash
data/wikisql.py
```

### 安装 mlx-lm

```bash
pip install mlx-lm
```

### 微调

```bash
time python -m mlx_lm.lora --model mistralai/Mistral-7B-v0.1 --train --iters 1000
```
```
Loading pretrained model
Total parameters 7243.436M
Trainable parameters 1.704M
Loading datasets
Training
Iter 1: Val loss 2.344, Val took 31.766s
Iter 100: Train loss 1.206, It/sec 0.526, Tokens/sec 200.354
Iter 200: Train loss 1.098, It/sec 0.527, Tokens/sec 200.672
Iter 200: Val loss 1.119, Val took 29.064s
Iter 300: Train loss 0.827, It/sec 0.514, Tokens/sec 209.714
Iter 400: Train loss 0.834, It/sec 0.473, Tokens/sec 200.296
Iter 400: Val loss 1.085, Val took 26.985s
Iter 500: Train loss 0.774, It/sec 0.469, Tokens/sec 193.179
Iter 600: Train loss 0.601, It/sec 0.528, Tokens/sec 217.035
Iter 600: Val loss 0.983, Val took 30.665s
Iter 700: Train loss 0.580, It/sec 0.466, Tokens/sec 189.138
Iter 800: Train loss 0.540, It/sec 0.507, Tokens/sec 206.917
Iter 800: Val loss 0.971, Val took 26.399s
Iter 900: Train loss 0.496, It/sec 0.467, Tokens/sec 188.202
Iter 1000: Train loss 0.479, It/sec 0.562, Tokens/sec 215.943
Iter 1000: Val loss 0.967, Val took 31.298s
python lora.py --model mistralai/Mistral-7B-v0.1 --train --iters 1000  85.61s user 390.20s system 22% cpu 35:09.24 total
```

| Iteration | Train Loss | Val Loss | Tokens/sec |
| :-------: | ----------:| --------:| ----------:|
| 1         |            | 2.343    |            |
| 100       | 1.206      |          | 200.354    |
| 200       | 1.098      | 1.119    | 200.672    |
| 300       | 0.827      |          | 209.714    |
| 400       | 0.834      | 1.085    | 200.296    |
| 500       | 0.774      |          | 193.179    |
| 600       | 0.601      | 0.983    | 217.035    |
| 700       | 0.580      |          | 189.138    |
| 800       | 0.540      | 0.971    | 206.917    |
| 900       | 0.496      |          | 188.202    |
| 1000      | 0.479      | 0.967    | 215.943    |

耗时 35 分 9 秒。

### 评估

计算测试集困惑度（PPL）和交叉熵损失（Loss）。

```bash
for i in {100..1000..100}; do python -m mlx_lm.lora --model mistralai/Mistral-7B-v0.1 --test --adapter-file adapters/$i.npz; done
```
```
100  Test loss 1.352, Test ppl 3.865.
200  Test loss 1.323, Test ppl 3.756.
300  Test loss 1.350, Test ppl 3.857.
400  Test loss 1.366, Test ppl 3.919.
500  Test loss 1.345, Test ppl 3.839.
600  Test loss 1.355, Test ppl 3.879.
700  Test loss 1.364, Test ppl 3.911.
800  Test loss 1.397, Test ppl 4.043.
900  Test loss 1.419, Test ppl 4.132.
1000 Test loss 1.426, Test ppl 4.161.
```

| Iteration | Test Loss | Test PPL |
| :-------: | ---------:| --------:|
| 100       | 1.352     | 3.865    |
| 200       | 1.323     | 3.756    |
| 300       | 1.350     | 3.857    |
| 400       | 1.366     | 3.919    |
| 500       | 1.345     | 3.839    |
| 600       | 1.355     | 3.879    |
| 700       | 1.364     | 3.911    |
| 800       | 1.397     | 4.043    |
| 900       | 1.419     | 4.132    |
| 1000      | 1.426     | 4.161    |

### 融合（Fuse）

```bash
python fuse.py --model mistralai/Mistral-7B-v0.1 \
               --adapter-file adapters.npz \
               --save-path lora_fused_model \
               --de-quantize
```

融合后的目录结构如下：

```bash
lora_fused_model
├── config.json
├── model-00001-of-00003.safetensors
├── model-00002-of-00003.safetensors
├── model-00003-of-00003.safetensors
├── special_tokens_map.json
├── tokenizer.json
├── tokenizer.model
└── tokenizer_config.json
```

❌ `fuse.py` 有异常错误 `IndexError: list index out of range`。

```bash
Loading pretrained model
Traceback (most recent call last):
  File "/Users/junjian/GitHub/ml-explore/mlx-examples/lora/fuse.py", line 98, in <module>
    model.update_modules(tree_unflatten(de_quantize_layers))
  File "/Users/junjian/GitHub/ml-explore/mlx-examples/env/lib/python3.10/site-packages/mlx/utils.py", line 123, in tree_unflatten
    int(tree[0][0].split(".", maxsplit=1)[0])
IndexError: list index out of range
```

修改脚本 `/Users/junjian/GitHub/ml-explore/mlx-examples/env/lib/python3.10/site-packages/mlx/utils.py`

```py
    try:
        int(tree[0][0].split(".", maxsplit=1)[0])
        is_list = True
    except ValueError:
        is_list = False
    except IndexError:  # <--- Add this line
        is_list = False
```

❌ 使用 `mlx_lm.fuse` 有点问题，看不到微调后的效果。

```bash
python -m mlx_lm.generate --model lora_fused_model \     
                          --max-tokens 50 \
                          --prompt "table: students
columns: Name, Age, School, Grade, Height, Weight
Q: How old is Wang Junjian?
A: "
==========
Prompt: table: students
columns: Name, Age, School, Grade, Height, Weight
Q: How old is Wang Junjian?
A: 
14

table: teachers
columns: Name, Age, School, Title, Salary
Q: How old is Jane?
A: 35

table: students
columns: Name, Age, School, Grade,
==========
Prompt: 85.823 tokens-per-sec
Generation: 50.520 tokens-per-sec
```

❌ 没有使用 `--de-quantize` 选项，会报错。

```bash
[INFO] Loading model from ../../lora/lora_fused_model/ggml-model-f16.gguf
Traceback (most recent call last):
  File "/Users/junjian/GitHub/ml-explore/mlx-examples/llms/gguf_llm/generate.py", line 85, in <module>
    model, tokenizer = models.load(args.gguf, args.repo)
  File "/Users/junjian/GitHub/ml-explore/mlx-examples/llms/gguf_llm/models.py", line 321, in load
    dequantize("model.embed_tokens")
  File "/Users/junjian/GitHub/ml-explore/mlx-examples/llms/gguf_llm/models.py", line 314, in dequantize
    scales = weights.pop(f"{k}.scales")
KeyError: 'model.embed_tokens.scales'
```

### 生成

查询姓名，年龄，学校，年级等信息，条件为姓名等于王军建且年龄小于20岁。

```bash
python -m mlx_lm.generate --model lora_fused_model \
                          --max-tokens 50 \
                          --prompt "table: students
columns: Name, Age, School, Grade, Height, Weight
Q: Query information such as name, age, school, grade, etc. The condition is that the name is equal to Wang Junjian and the age is less than 20 years old.
A: "
```

```
SELECT Name, Age, School, Grade, Height, Weight FROM students WHERE Name = 'Wang Junjian' AND Age < 20
```


## 转换 GGUF 模型
- [How do I create a GGUF model file?](https://www.secondstate.io/articles/convert-pytorch-to-gguf/)

### 构建 llama.cpp
- [使用 llama.cpp 构建本地聊天服务]({% post_url 2023-12-16-building-a-local-chat-service-using-llama-cpp %})
- [使用 llama.cpp 构建兼容 OpenAI API 服务]({% post_url 2024-01-19-use-lama-cpp-to-build-compatible-openai-services %})

```bash
# clone
git clone https://github.com/ggerganov/llama.cpp.git
cd llama.cpp
# make
make -j
# install packages
pip install -r requirements.txt
```

### 转换 GGUF 模型（f32）

为了更好的保留精度，使用 f32 模型。

```bash
python convert.py --outtype f32 \
    --outfile Mistral-7B-v0.1-LoRA-Text2SQL-f32.gguf \
    /Users/junjian/GitHub/ml-explore/mlx-examples/lora/lora_fused_model
```

### 量化 GGUF 模型

- Q8_0

```bash
./quantize Mistral-7B-v0.1-LoRA-Text2SQL-f32.gguf \
           Mistral-7B-v0.1-LoRA-Text2SQL.Q8_0.gguf \
           Q8_0
```

- Q4_1

```bash
./quantize Mistral-7B-v0.1-LoRA-Text2SQL-f32.gguf \
           Mistral-7B-v0.1-LoRA-Text2SQL.Q4_1.gguf \
           Q4_1
```

- Q4_0

```bash
./quantize Mistral-7B-v0.1-LoRA-Text2SQL-f32.gguf \
           Mistral-7B-v0.1-LoRA-Text2SQL.Q4_0.gguf \
           Q4_0
```

### 使用 llama.cpp 生成

- Q8_0

```bash
./main -m Mistral-7B-v0.1-LoRA-Text2SQL.Q8_0.gguf \
       -e -p "table: students
columns: Name, Age, School, Grade, Height, Weight
Q: Query information such as name, age, school, grade, etc. The condition is that the name is equal to Wang Junjian and the age is less than 20 years old.
A: "
```

```
SELECT Name, Age, School, Grade FROM students WHERE Name = 'Wang Junjian' AND Age < 20 [end of text]

llama_print_timings:        load time =     287.98 ms
llama_print_timings:      sample time =       2.44 ms /    28 runs   (    0.09 ms per token, 11456.63 tokens per second)
llama_print_timings: prompt eval time =     169.18 ms /    65 tokens (    2.60 ms per token,   384.20 tokens per second)
llama_print_timings:        eval time =     685.85 ms /    27 runs   (   25.40 ms per token,    39.37 tokens per second)
llama_print_timings:       total time =     860.76 ms /    92 tokens
```

- Q4_1

```bash
./main -m Mistral-7B-v0.1-LoRA-Text2SQL.Q4_1.gguf \
       -e -p "table: students
columns: Name, Age, School, Grade, Height, Weight
Q: Query information such as name, age, school, grade, etc. The condition is that the name is equal to Wang Junjian and the age is less than 20 years old.
A: "
```

```
SELECT Name, Age, School, Grade FROM students WHERE Name = 'Wang Junjin' AND Age < 20 [end of text]

llama_print_timings:        load time =     232.59 ms
llama_print_timings:      sample time =       2.45 ms /    28 runs   (    0.09 ms per token, 11428.57 tokens per second)
llama_print_timings: prompt eval time =     173.11 ms /    65 tokens (    2.66 ms per token,   375.49 tokens per second)
llama_print_timings:        eval time =     465.36 ms /    27 runs   (   17.24 ms per token,    58.02 tokens per second)
llama_print_timings:       total time =     644.05 ms /    92 tokens
```

- Q4_0

```bash
./main -m Mistral-7B-v0.1-LoRA-Text2SQL.Q4_0.gguf \
       -e -p "table: students
columns: Name, Age, School, Grade, Height, Weight
Q: Query information such as name, age, school, grade, etc. The condition is that the name is equal to Wang Junjian and the age is less than 20 years old.
A: "
```

不能很好的把需要的列名都生成出来。

```
SELECT Name FROM Students WHERE Name = 'Wang Junjian' AND Age < 20 [end of text]

llama_print_timings:        load time =     225.26 ms
llama_print_timings:      sample time =       1.85 ms /    22 runs   (    0.08 ms per token, 11904.76 tokens per second)
llama_print_timings: prompt eval time =     173.36 ms /    65 tokens (    2.67 ms per token,   374.94 tokens per second)
llama_print_timings:        eval time =     336.15 ms /    21 runs   (   16.01 ms per token,    62.47 tokens per second)
llama_print_timings:       total time =     513.64 ms /    86 tokens
```

### 使用 MLX 生成

> MLX 能够直接从 GGUF 读取大多数量化格式。但是，仅直接支持少数量化：Q4_0、Q4_1 和 Q8_0。不支持的量化将转换为 float16。
- [LLMs in MLX with GGUF](https://github.com/ml-explore/mlx-examples/blob/main/llms/gguf_llm/README.md)

- Q8_0

```bash
python generate.py --gguf Mistral-7B-v0.1-LoRA-Text2SQL.Q8_0.gguf \
                   --max-tokens 50 \
                   --prompt "table: students
columns: Name, Age, School, Grade, Height, Weight
Q: Query information such as name, age, school, grade, etc. The condition is that the name is equal to Wang Junjian and the age is less than 20 years old.
A: "
[INFO] Loading model from /Users/junjian/GitHub/ggerganov/llama.cpp/Mistral-7B-v0.1-LoRA-Text2SQL.Q8_0.gguf
SELECT Name, Age, School, Grade, Height, Weight FROM students WHERE Name = 'Wang Junjian' AND Age < 20
==========
Prompt: 121.242 tokens-per-sec
Generation: 17.895 tokens-per-sec
```

上面的提示词 `Query information such as name, age, school, grade, etc.` 有 `etc`， 生成的 SQL 是所有的列。下面的示例移除了 `etc`，生成就是指定的列。

```bash
python generate.py --gguf Mistral-7B-v0.1-LoRA-Text2SQL.Q8_0.gguf \       
                   --max-tokens 50 \
                   --prompt "table: students
columns: Name, Age, School, Grade, Height, Weight
Q: Query information such as name, age, school, grade. The condition is that the name is equal to Wang Junjian and the age is less than 20 years old.
A: "
[INFO] Loading model from /Users/junjian/GitHub/ggerganov/llama.cpp/Mistral-7B-v0.1-LoRA-Text2SQL.Q8_0.gguf
SELECT Name, Age, School, Grade FROM students WHERE Name = 'Wang Junjian' AND Age < 20
==========
Prompt: 137.376 tokens-per-sec
Generation: 17.581 tokens-per-sec
```

- Q4_1
    
```bash
python generate.py --gguf Mistral-7B-v0.1-LoRA-Text2SQL.Q4_1.gguf \       
                   --max-tokens 50 \
                   --prompt "table: students
columns: Name, Age, School, Grade, Height, Weight
Q: Query information such as name, age, school, grade. The condition is that the name is equal to Wang Junjian and the age is less than 20 years old.
A: "
[INFO] Loading model from /Users/junjian/GitHub/ggerganov/llama.cpp/Mistral-7B-v0.1-LoRA-Text2SQL.Q4_1.gguf
ACHEACHEACHEACHEACHEACHEACHEACHEACHEACHEACHEACHEACHEACHEACHEACHEACHEACHEACHEACHEACHEACHEACHEACHEACHEACHEACHEACHEACHEACHEACHEACHEACHEACHEACHEACHEACHEACHEACHEACHEACHEACHEACHEACHEACHEACHEACHEACHEACHEACHE
==========
Prompt: 122.293 tokens-per-sec
Generation: 16.854 tokens-per-sec
```

- Q4_0
    
```bash
python generate.py --gguf Mistral-7B-v0.1-LoRA-Text2SQL.Q4_0.gguf \       
                   --max-tokens 50 \
                   --prompt "table: students
columns: Name, Age, School, Grade, Height, Weight
Q: Query information such as name, age, school, grade. The condition is that the name is equal to Wang Junjian and the age is less than 20 years old.
A: "
[INFO] Loading model from /Users/junjian/GitHub/ggerganov/llama.cpp/Mistral-7B-v0.1-LoRA-Text2SQL.Q4_0.gguf
SELECT Name, Age, School, Grade FROM students WHERE Name = 'Wang Junjian' AND Age < 20
==========
Prompt: 144.101 tokens-per-sec
Generation: 16.231 tokens-per-sec
```

### 总结
- 量化 `Q8_0` 的模型：使用 llama.cpp 生成速度（39.37 tokens/s）比 MLX 生成速度（17.58 tokens/s）快 2 倍多。🚀🚀
- 量化 `Q4_1` 的模型：使用 llama.cpp 生成速度（58.02 tokens/s）比 MLX 生成速度（16.85 tokens/s）快 3 倍多。🚀🚀🚀
- 量化 `Q4_1` 的模型，使用 MLX 生成出的是无效的 SQL 语句，甚至是无意义的文本。❌
- 量化 `Q4_0` 的模型，使用 llama.cpp 生成出的 SQL 语句没有指定的列。❌
- 量化的精度超低，感觉生成的时候越容易出问题，特别不稳定。
- 无论精度是多少，使用 MLX 生成的速度都是一样的，这应该是有问题的。


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
