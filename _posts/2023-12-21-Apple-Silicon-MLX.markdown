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
cd llms/phi2
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

### 模型 [Qwen-1.8B](https://huggingface.co/Qwen/Qwen-1_8B)

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

### 模型 [Qwen-14B-Chat](https://huggingface.co/Qwen/Qwen-14B-Chat)

- 下载模型

```shell
huggingface-cli download Qwen/Qwen-14B-Chat
# 下面的命令可以使用缓存的模型进行转换
huggingface-cli download Qwen/Qwen-14B-Chat --local-dir Qwen/Qwen-14B-Chat --local-dir-use-symlinks False
```

- 模型转换

```shell
ln -s /Users/junjian/HuggingFace/Qwen/Qwen-14B-Chat Qwen/Qwen-14B-Chat
python convert.py --model Qwen/Qwen-14B-Chat
```

```shell
python qwen.py --tokenizer Qwen/Qwen-14B-Chat --prompt "天空为什么是蓝色的？" --max_tokens 2048 
```
```
天空为什么是蓝色的？ 天空之所以呈现蓝色，是因为大气中的气体和微粒会散射太阳光中的短波长颜色，如蓝色和紫色。这种散射现象被称为瑞利散射。由于短波长颜色的散射比长波长颜色（如红色和橙色）更强，所以当太阳光穿过大气层时，蓝色和紫色的光线会被散射到各个方向，使得我们看到的天空呈现出蓝色。在日落或日出时，太阳光需要穿过更多的大气层，因此更多的短波长颜色被散射掉，只剩下长波长颜色，所以天空呈现出橙色或红色。
```

运行下面的推理，使用内存的峰值达到了 46GB。

```shell
python qwen.py --tokenizer Qwen/Qwen-14B-Chat --prompt 'Traceback (most recent call last): File "/Users/junjian/GitHub/ml-explore/mlx-examples/t5/t5.py", line 441, in model, tokenizer = load_model(args.model, args.dtype) File "/Users/junjian/GitHub/ml-explore/mlx-examples/t5/t5.py", line 393, in load_model return model, Tokenizer(args.model, config) File "/Users/junjian/GitHub/ml-explore/mlx-examples/t5/t5.py", line 337, in init self._tokenizer = T5Tokenizer.from_pretrained( File "/Users/junjian/GitHub/ml-explore/env/lib/python3.10/site-packages/transformers/tokenization_utils_base.py", line 2028, in from_pretrained return cls._from_pretrained( File "/Users/junjian/GitHub/ml-explore/env/lib/python3.10/site-packages/transformers/tokenization_utils_base.py", line 2260, in _from_pretrained tokenizer = cls(*init_inputs, **init_kwargs) File "/Users/junjian/GitHub/ml-explore/env/lib/python3.10/site-packages/transformers/models/t5/tokenization_t5.py", line 200, in init self.sp_model = self.get_spm_processor(kwargs.pop("from_slow", False)) File "/Users/junjian/GitHub/ml-explore/env/lib/python3.10/site-packages/transformers/models/t5/tokenization_t5.py", line 224, in get_spm_processor model_pb2 = import_protobuf(f"The new behaviour of {self.class.name} (with self.legacy = False)") File "/Users/junjian/GitHub/ml-explore/env/lib/python3.10/site-packages/transformers/convert_slow_tokenizer.py", line 43, in import_protobuf raise ImportError(PROTOBUF_IMPORT_ERROR.format(error_message)) ImportError: The new behaviour of T5Tokenizer (with self.legacy = False) requires the protobuf library but it was not found in your environment. Checkout the instructions on the installation page of its repo: https://github.com/protocolbuffers/protobuf/tree/master/python#installation and follow the ones that match your environment. Please note that you may need to restart your runtime after installation. 这个错误怎么解决？' --max_tokens 8000
```
```
Traceback (most recent call last): File "/Users/junjian/GitHub/ml-explore/mlx-examples/t5/t5.py", line 441, in model, tokenizer = load_model(args.model, args.dtype) File "/Users/junjian/GitHub/ml-explore/mlx-examples/t5/t5.py", line 393, in load_model return model, Tokenizer(args.model, config) File "/Users/junjian/GitHub/ml-explore/mlx-examples/t5/t5.py", line 337, in init self._tokenizer = T5Tokenizer.from_pretrained( File "/Users/junjian/GitHub/ml-explore/env/lib/python3.10/site-packages/transformers/tokenization_utils_base.py", line 2028, in from_pretrained return cls._from_pretrained( File "/Users/junjian/GitHub/ml-explore/env/lib/python3.10/site-packages/transformers/tokenization_utils_base.py", line 2260, in _from_pretrained tokenizer = cls(*init_inputs, **init_kwargs) File "/Users/junjian/GitHub/ml-explore/env/lib/python3.10/site-packages/transformers/models/t5/tokenization_t5.py", line 200, in init self.sp_model = self.get_spm_processor(kwargs.pop("from_slow", False)) File "/Users/junjian/GitHub/ml-explore/env/lib/python3.10/site-packages/transformers/models/t5/tokenization_t5.py", line 224, in get_spm_processor model_pb2 = import_protobuf(f"The new behaviour of {self.class.name} (with self.legacy = False)") File "/Users/junjian/GitHub/ml-explore/env/lib/python3.10/site-packages/transformers/convert_slow_tokenizer.py", line 43, in import_protobuf raise ImportError(PROTOBUF_IMPORT_ERROR.format(error_message)) ImportError: The new behaviour of T5Tokenizer (with self.legacy = False) requires the protobuf library but it was not found in your environment. Checkout the instructions on the installation page of its repo: https://github.com/protocolbuffers/protobuf/tree/master/python#installation and follow the ones that match your environment. Please note that you may need to restart your runtime after installation. 这个错误怎么解决？？

这个错误是因为你的环境缺少protobuf库。protobuf是一个用于序列化和反序列化结构化数据的库，是transformers库的一部分。

你可以按照以下步骤解决这个问题：

1. 安装protobuf库。你可以使用pip来安装：

   pip install protobuf

2. 重启你的运行环境。有时候，即使你已经安装了protobuf，也需要重启你的运行环境才能使新的库生效。

如果你在使用Google Colab，你可能需要在终端中运行上述命令，而不是在代码单元格中运行。
```


## [Stable Diffusion](https://github.com/ml-explore/mlx-examples/tree/main/stable_diffusion)

- [PromptHero](https://prompthero.com/)

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
- [第一次用AI写小说就获奖了，他们的创作秘籍大公开](https://new.qq.com/rain/a/20230920A03T9300)
- [MLX - Whisper 教學 - 1](https://vocus.cc/article/657622fdfd8978000126d4d0)
