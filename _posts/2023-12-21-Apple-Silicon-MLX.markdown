---
layout: post
title:  "MLX: An array framework for Apple silicon"
date:   2023-12-21 08:00:00 +0800
categories: MLX
tags: [MLX, Phi-2, QWen, StableDiffusion,T5, Whisper, MacBookProM2Max]
---

## [MLX](https://github.com/ml-explore/mlx)
统一内存：与 MLX 和其他框架的显着区别是统一内存模型。 MLX 中的数组位于共享内存中。 MLX 阵列上的操作可以在任何支持的设备类型上执行，而无需传输数据。

[MLX Documentation](https://ml-explore.github.io/mlx/build/html/index.html)

## 创建虚拟环境
```shell
mkdir ml-explore && cd ml-explore
git clone https://github.com/ml-explore/mlx
git clone https://github.com/ml-explore/mlx-examples

python -m venv env
source env/bin/activate
```

## [Phi-2](https://github.com/ml-explore/mlx-examples/tree/main/llms/phi2)

- 安装依赖包
```shell
cd mlx-examples/phi2
pip install -r requirements.txt
```

- 模型下载和转换

使用已经下载的模型
```shell
mkdir microsoft
ln -s /Users/junjian/HuggingFace/microsoft/phi-2 microsoft/phi-2
```

转换模型
```shell
python convert.py
```

这将生成 MLX 可以读取的 weights.npz 文件。
```
-rw-r--r--  1 junjian  staff   5.2G 12 20 20:36 weights.npz
```

- 运行
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

你自己的提示
```shell
# python phi2.py --prompt <your prompt here> --max_tokens <max_tokens_to_generate>
python phi2.py --prompt "Why is the sky blue?"
```
```
Special tokens have been added in the vocabulary, make sure the associated word embeddings are fine-tuned or trained.
[INFO] Generating with Phi-2...
Why is the sky blue?

Answer: The sky appears blue because of the way that light interacts with the Earth's atmosphere. When sunlight enters the atmosphere, it is scattered in all directions by the air molecules. Blue light is scattered more than other colors because it travels in shorter, smaller waves. This is why we see the sky as blue.

Exercise 2:
What is the difference between a hypothesis and a theory?

Answer: A hypothesis is an educated guess or prediction about how something works.
```


- 帮助
```shell
python phi2.py --help
```
```
usage: phi2.py [-h] [--prompt PROMPT] [--max_tokens MAX_TOKENS] [--temp TEMP] [--seed SEED]

Phi-2 inference script

options:
  -h, --help            show this help message and exit
  --prompt PROMPT       The message to be processed by the model
  --max_tokens MAX_TOKENS, -m MAX_TOKENS
                        Maximum number of tokens to generate
  --temp TEMP           The sampling temperature.
  --seed SEED           The PRNG seed
```


## [Qwen](https://github.com/ml-explore/mlx-examples/tree/main/llms/qwen)

- 模型 [Qwen-1.8B](https://huggingface.co/Qwen/Qwen-1_8B)

- 模型转换
```shell
cd llms/qwen
mkdir Qwen
ln -s /Users/junjian/HuggingFace/Qwen/Qwen-1_8B Qwen/Qwen-1_8B
python convert.py
```

- 运行
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

```shell
python qwen.py --prompt "天空为什么是蓝色的？" --max_tokens 2048          
```
```
天空为什么是蓝色的？ 天空为什么是蓝色的？这是一个常见的问题，但其实天空并不是蓝色的，而是由多种颜色组成的。以下是详细的解释：
1. 大气层：天空之所以呈现蓝色，是因为大气层中的气体分子会散射太阳光中的蓝色光。当太阳光穿过大气层时，蓝色光波长的光波更容易被散射，因此天空呈现出蓝色。而其他颜色的光波则更容易被散射，因此天空呈现出其他颜色。
2. 大气折射：天空之所以呈现出蓝色，还与大气折射有关。当太阳光穿过大气层时，它会受到大气层的折射。蓝色光波长的光波更容易被折射，因此天空呈现出蓝色。而其他颜色的光波则更容易被折射，因此天空呈现出其他颜色。
3. 大气散射：天空之所以呈现出蓝色，还与大气散射有关。当太阳光穿过大气层时，它会受到大气层的散射。蓝色光波长的光波更容易被散射，因此天空呈现出蓝色。而其他颜色的光波则更容易被散射，因此天空呈现出其他颜色。
4. 大气折射：天空之所以呈现出蓝色，还与大气折射有关。当太阳光穿过大气层时，它会受到大气层的折射。蓝色光波长的光波更容易被折射，因此天空呈现出蓝色。而其他颜色的光波则更容易被折射，因此天空呈现出其他颜色。
综上所述，天空之所以呈现出蓝色，是因为大气层中的气体分子会散射太阳光中的蓝色光，而大气折射和大气散射也会对天空的颜色产生影响。
```

指定其他通义千问模型，注意字母的大小写 `QWen/QWen`
```shell
python qwen.py --tokenizer  QWen/QWen-7B
python qwen.py --tokenizer  QWen/QWen-7B-Chat
```


## [Stable Diffusion](https://github.com/ml-explore/mlx-examples/tree/main/stable_diffusion)
`模型`：Hugging Face Hub by Stability AI at [stabilitiai/stable-diffusion-2-1](https://huggingface.co/stabilityai/stable-diffusion-2-1)

- 安装依赖包
```shell
pip install -r requirements.txt
```

- 运行
```shell
python txt2image.py "A photo of an astronaut riding a horse on Mars." --n_images 4 --n_rows 2
```

![](/images/2023/stable-diffusion-2-1.png)

## [T5](https://github.com/ml-explore/mlx-examples/tree/main/t5)

- 安装依赖包
```shell
pip install -r requirements.txt
pip install protobuf
```

- 下载转换模型
```shell
python convert.py --model <model>
```

| Model Name | Model Size |
| ---------- | ---------- |
| t5-small | 60 million  |
| t5-base  | 220 million |
| t5-large | 770 million |
| t5-3b    | 3 billion   |
| t5-11b   | 11 billion  |

- 运行
```shell
python t5.py --model t5-base --prompt "translate English to German: A tasty apple"
```
```
Special tokens have been added in the vocabulary, make sure the associated word embeddings are fine-tuned or trained.
[INFO] Generating with T5...
Input:  translate English to German: A tasty apple
Ein leckerer Apfel
Time: 0.37 seconds, tokens/s: 18.79
```

- 多语言版本不支持 [google/mt5-small](https://huggingface.co/google/mt5-small)
```shell
python t5.py --model google/mt5-small --prompt "translate English to Franch: A tasty apple."
```
```
You are using a model of type mt5 to instantiate a model of type t5. This is not supported for all configurations of models and can yield errors.
[INFO] Generating with T5...
Input:  translate English to Franch: A tasty apple.
<extra_id_0>
Time: 0.05 seconds, tokens/s: 39.83
```


## [Whisper](https://github.com/ml-explore/mlx-examples/tree/main/whisper)

- 安装依赖包
```shell
pip install -r requirements.txt
```

- 安装 ffmpeg
```shell
# on macOS using Homebrew (https://brew.sh/)
brew install ffmpeg
```

- 运行
```py
import whisper

speech_file='whisper/assets/ls_test.flac'
text = whisper.transcribe(speech_file)["text"]
print(text)
```
```
Then the good soul openly sorted the boat and she had buoyed so long in secret and bravely stretched on alone.
```


## 参考资料
- [Installing Pytorch on macOS](https://pytorch.org/get-started/locally/#macos-version)
- [那个屠榜的T5模型，现在可以在中文上玩玩了](https://www.jiqizhixin.com/articles/2020-11-17-3)
- [第一次用AI写小说就获奖了，他们的创作秘籍大公开 | AI玩家对话](https://new.qq.com/rain/a/20230920A03T9300)
