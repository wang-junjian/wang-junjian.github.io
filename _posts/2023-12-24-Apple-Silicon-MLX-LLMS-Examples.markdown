---
layout: post
title:  "MLX LLMS Examples"
date:   2023-12-24 08:00:00 +0800
categories: MLX
tags: [MLX, Phi-2, QWen, MacBookProM2Max]
---

## [MLX Examples](https://github.com/ml-explore/mlx-examples)
- [MLX](https://github.com/ml-explore/mlx)
- [MLX Documentation](https://ml-explore.github.io/mlx/build/html/index.html)

## 克隆代码
```shell
git clone https://github.com/ml-explore/mlx-examples
cd mlx-examples
```

## 创建虚拟环境
```shell
python -m venv env
source env/bin/activate

pip install -r llms/phi2/requirements.txt
pip install -r llms/qwen/requirements.txt
```

## 创建大模型链接
```shell
mkdir llms/phi2/microsoft
ln -s /Users/junjian/HuggingFace/microsoft/phi-2 llms/phi2/microsoft/phi-2

mkdir llms/qwen/Qwen
ln -s /Users/junjian/HuggingFace/Qwen/Qwen-14B-Chat llms/qwen/Qwen/Qwen-14B-Chat
ln -s /Users/junjian/HuggingFace/Qwen/Qwen-1_8B llms/qwen/Qwen/Qwen-1_8B
ln -s /Users/junjian/HuggingFace/Qwen/Qwen-1_8B-Chat llms/qwen/Qwen/Qwen-1_8B-Chat
ln -s /Users/junjian/HuggingFace/Qwen/Qwen-7B-Chat llms/qwen/Qwen/Qwen-7B-Chat
```

## [Phi-2](https://github.com/ml-explore/mlx-examples/tree/main/llms/phi2)

转换模型

```shell
cd llms/phi2
python convert.py
```

生成的模型存放在 `mlx_model` 文件夹下。

```shell
ll mlx_model
-rw-r--r--  1 junjian  staff    28B 12 25 10:47 config.json
-rw-r--r--  1 junjian  staff   5.2G 12 25 10:47 weights.npz
```

模型推理

```shell
python phi2.py       
```
```
Special tokens have been added in the vocabulary, make sure the associated word embeddings are fine-tuned or trained.
[INFO] Generating with Phi-2...
Write a detailed analogy between mathematics and a lighthouse.

Answer: Mathematics is like a lighthouse that guides us through the darkness of uncertainty. Just as a lighthouse emits a steady beam of light, mathematics provides us with a clear path to navigate through complex problems. It illuminates our understanding and helps us make sense of the world around us.

Exercise 2:
Compare and contrast the role of logic in mathematics and the role of a compass in navigation.

Answer: Logic in mathematics is like a compass in navigation. It helps
```

## [Qwen](https://github.com/ml-explore/mlx-examples/tree/main/llms/qwen)

### 模型 [Qwen-1.8B](https://huggingface.co/Qwen/Qwen-1_8B)

转换模型

```shell
cd llms/phi2
python convert.py
```

模型推理

```shell
python qwen.py 
```
```
蒙古国的首都是乌兰巴托（Ulaanbaatar）
冰岛的首都是雷克雅未克（Reykjavik）
埃塞俄比亚的首都是亚的斯亚贝巴（Addis Ababa）
印度尼西亚的首都是雅加达（Jakarta）
日本的首都是东京（Tokyo）
韩国的首都是首尔（Seoul）
中国台湾的首都是台北（Taipei）
中国香港的首都是香港（Hong Kong）
中国澳门的首都是澳门（Macau）
中国澳门的首都是澳门（Macau）
中国澳门的首都是澳门（Macau）
中国澳门的首都是澳门
```

### 模型 [Qwen-1.8B-Chat](https://huggingface.co/Qwen/Qwen-1_8B-Chat)

转换模型

```shell
python convert.py --model Qwen/Qwen-1_8B-Chat
```

模型推理

```shell
python qwen.py --tokenizer Qwen/Qwen-1_8B-Chat
```
```
蒙古国的首都是乌兰巴托（Ulaanbaatar）
冰岛的首都是雷克雅未克（Reykjavik）
埃塞俄比亚的首都是亚的斯亚贝巴（Asmara）
赞比亚的首都是卢旺达（Rwanda）
尼泊尔的首都是加德满都（Gandhi）<|im_end|>
<|im_start|>
<|im_start|>
<|im_start|>
<|im_start|>
<|im_start|>
<|im_start|>
<|im_start|>
<|im_start|>
<|im_start|>
<|im_start|>
<|im_start|>
<|im_start|>
<|im_start|>
<|im_start|>
<|im_start|>
<|im_start|>
<|im_start|>
<|im_start|>
<|im_start|>
<|im_start|>
<|im_start|>
<|im_start|>
<|im_start|>
<|im_start|>
<|im_start|>
<|im_start|>
<|im_start|>
<|im_start|>
<|im_start|>
<|im_start|>
```

```shell
python qwen.py --tokenizer Qwen/Qwen-1_8B-Chat --prompt "天空为什么是蓝色的？" --max-tokens 2048
```
```
天空为什么是蓝色的？<|im_end|>
<|im_start|>

天空为什么是蓝色的？这是一个非常有趣的问题，因为天空的颜色实际上是由大气中的气体分子和水分子散射太阳光产生的。这些气体分子和水分子对不同波长的光有不同的散射能力，因此我们看到的天空呈现出蓝色。

具体来说，当太阳光穿过大气层时，它会被大气中的气体分子和水分子散射。这些气体分子和水分子对不同波长的光有不同的散射能力，因此我们看到的天空呈现出蓝色。这是因为短波长的光（如蓝光）比长波长的光（如红光）更容易被散射。因此，当太阳光穿过大气层时，短波长的蓝光被散射得更多，而长波长的红光则被散射得更少，这就是为什么我们看到的天空呈现出蓝色的原因。

此外，大气中的气体分子和水分子还会对其他波长的光产生散射，因此天空的颜色还会受到其他波长光的影响。例如，当太阳光穿过大气层时，它还会被大气中的尘埃和水滴散射，这些尘埃和水滴会散射出不同的颜色，因此天空的颜色还会受到这些尘埃和水滴的影响。

总的来说，天空为什么是蓝色的是由大气中的气体分子和水分子散射太阳光产生的。这些气体分子和水分子对不同波长的光有不同的散射能力，因此我们看到的天空呈现出蓝色。<|im_end|>
```

## 推理速度
- [Qwen 性能测算脚本](https://qianwen-res.oss-cn-beijing.aliyuncs.com/profile.py)

修改 `qwen.py` 文件：

```py
# 记录开始时间
import time
begin_time = time.time()
token_count = 0

tokens = []
for token, _ in zip(generate(prompt, model, args.temp), range(args.max_tokens)):
    tokens.append(token)
    token_count += 1

    if (len(tokens) % 10) == 0:
        mx.eval(tokens)
        eos_index = next(
            (i for i, t in enumerate(tokens) if t.item() == tokenizer.eos_token_id),
            None,
        )   

        if eos_index is not None:
            tokens = tokens[:eos_index]

        s = tokenizer.decode([t.item() for t in tokens])
        print(s, end="", flush=True)
        tokens = []
        if eos_index is not None:
            break

mx.eval(tokens)
s = tokenizer.decode([t.item() for t in tokens])
print(s, flush=True)

# 记录结束时间
end_time = time.time()
# 打印生成速度
print("Average generate speed (tokens/s): {:.2f}".format(token_count / (end_time - begin_time)))
```

### 模型 [Qwen-1.8B-Chat](https://huggingface.co/Qwen/Qwen-1_8B-Chat)

```shell
python qwen.py --tokenizer Qwen/Qwen-1_8B-Chat --prompt "天空为什么是蓝色的？" --max-tokens 2048
```
```
天空为什么是蓝色的？<|im_end|>
<|im_start|>

天空为什么是蓝色的？这是一个非常有趣的问题，因为天空的颜色实际上是由大气中的气体分子和水分子散射太阳光产生的。这些气体分子和水分子对不同波长的光有不同的散射能力，因此我们看到的天空呈现出蓝色。

具体来说，当太阳光穿过大气层时，它会被大气中的气体分子和水分子散射。这些气体分子和水分子对不同波长的光有不同的散射能力，因此我们看到的天空呈现出蓝色。这是因为短波长的光（如蓝光）比长波长的光（如红光）更容易被散射。因此，当太阳光穿过大气层时，短波长的蓝光被散射得更多，而长波长的红光则被散射得更少，这就是为什么我们看到的天空呈现出蓝色的原因。

此外，大气中的气体分子和水分子还会对其他波长的光产生散射，因此天空的颜色还会受到其他波长光的影响。例如，当太阳光穿过大气层时，它还会被大气中的尘埃和水滴散射，这些尘埃和水滴会散射出不同的颜色，因此天空的颜色还会受到这些尘埃和水滴的影响。

总的来说，天空为什么是蓝色的是由大气中的气体分子和水分子散射太阳光产生的。这些气体分子和水分子对不同波长的光有不同的散射能力，因此我们看到的天空呈现出蓝色。<|im_end|>

Average generate speed (tokens/s): 62.57
```

### 模型 [Qwen-7B-Chat](https://huggingface.co/Qwen/Qwen-7B-Chat)

```shell
python qwen.py --tokenizer Qwen/Qwen-7B-Chat --prompt "天空为什么是蓝色的？" --max-tokens 2048
```
```
天空为什么是蓝色的？"这个问题，我们可以从以下几个方面来回答：

1. 大气散射：太阳光在穿过大气层时，会被大气中的气体分子和微粒散射。蓝色光的波长较短，散射效果更强，因此在日出和日落时，太阳光需要穿过更多的大气层，蓝色光的散射效果更强，使得天空呈现出蓝色。

2. 大气吸收：除了散射，大气还会吸收部分太阳光。太阳光中的红色光波长较长，吸收效果更强，因此在日出和日落时，太阳光中的红色光被吸收，天空呈现出红色。

3. 大气折射：太阳光在穿过大气层时，还会发生折射。由于大气层的密度不均匀，太阳光在穿过大气层时会发生折射，使得天空呈现出蓝色。

4. 大气温度：大气温度也会影响天空的颜色。在白天，太阳光照射到地面，地面吸收太阳光，使得地面温度升高，大气温度也升高。由于大气温度升高，大气中的气体分子和微粒的运动速度加快，散射效果增强，使得天空呈现出蓝色。在晚上，太阳光不再照射到地面，地面温度降低，大气温度也降低。由于大气温度降低，大气中的气体分子和微粒的运动速度减慢，散射效果减弱，使得天空呈现出红色。

综上所述，天空为什么是蓝色的，主要是由于大气散射、大气吸收、大气折射和大气温度等因素的影响。
Average generate speed (tokens/s): 19.76
```

### 模型 [Qwen-14B-Chat](https://huggingface.co/Qwen/Qwen-14B-Chat)

```shell
python qwen.py --tokenizer Qwen/Qwen-14B-Chat --prompt "天空为什么是蓝色的？" --max-tokens 2048
```
```
天空为什么是蓝色的？ 天空之所以呈现蓝色，是因为大气中的气体和微粒会散射太阳光中的短波长颜色，如蓝色和紫色。这种散射现象被称为瑞利散射。由于短波长颜色的散射比长波长颜色（如红色和橙色）更强，所以当太阳光穿过大气层时，蓝色和紫色的光线会被散射到各个方向，使得我们看到的天空呈现出蓝色。在日落或日出时，太阳光需要穿过更多的大气层，因此更多的短波长颜色被散射掉，只剩下长波长颜色，所以天空呈现出橙色或红色。
Average generate speed (tokens/s): 10.71
```

### Apple M2 Max 推理速度（64GB 内存）

| 模型 | 大小 | 加载模型内存 | 生成速度 (tokens/s) |
| --- | ---: | --------: | ---: |
| Qwen-1.8B-Chat | 3.4GB |  4GB | 62.57 |
| Qwen-7B-Chat   |  14GB | 14GB | 19.76 |
| Qwen-14B-Chat  |  26GB | 27GB | 10.71 |
