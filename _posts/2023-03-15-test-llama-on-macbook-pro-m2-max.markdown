---
layout: post
title:  "在 MacBook Pro M2 Max 上测试 LLaMA"
date:   2023-03-15 08:00:00 +0800
categories: LLaMA
tags: [MacBookProM2Max]
---

## [LLaMA](https://github.com/facebookresearch/llama)

### 克隆
```shell
git clone https://github.com/facebookresearch/llama
cd llama
```

### 下载模型
修改 download.sh，配置下载模型的 ```地址(PRESIGNED_URL)``` 和 ```下载目录(TARGET_FOLDER)```。
```shell
vim download.sh
```
```
PRESIGNED_URL="https://agi.gpt4.org/llama/LLaMA/*"             # replace with presigned url from email
TARGET_FOLDER="./"             # where all files should end up
```

```shell
bash download.sh
```

## [llama.cpp](https://github.com/ggerganov/llama.cpp)

### 构建
```shell
git clone https://github.com/ggerganov/llama.cpp
cd llama.cpp
make
```

### 拷贝 LLaMA 模型到当前目录
```shell
ls ./models
65B 30B 13B 7B tokenizer_checklist.chk tokenizer.model
```

### 安装 Python 依赖
```shell
pip install torch numpy sentencepiece
```

### convert the 7B model to ggml FP16 format
```shell
python convert-pth-to-ggml.py models/7B/ 1
```

### quantize the model to 4-bits
```shell
./quantize.sh 7B
```

### 推理
```shell
./main -m ./models/7B/ggml-model-q4_0.bin -t 8 -n 128
```
```
main: seed = 1678918444
llama_model_load: loading model from './models/7B/ggml-model-q4_0.bin' - please wait ...
llama_model_load: n_vocab = 32000
llama_model_load: n_ctx   = 512
llama_model_load: n_embd  = 4096
llama_model_load: n_mult  = 256
llama_model_load: n_head  = 32
llama_model_load: n_layer = 32
llama_model_load: n_rot   = 128
llama_model_load: f16     = 2
llama_model_load: n_ff    = 11008
llama_model_load: n_parts = 1
llama_model_load: ggml ctx size = 4529.34 MB
llama_model_load: memory_size =   512.00 MB, n_mem = 16384
llama_model_load: loading model part 1/1 from './models/7B/ggml-model-q4_0.bin'
llama_model_load: .................................... done
llama_model_load: model size =  4017.27 MB / num tensors = 291

system_info: n_threads = 8 / 12 | AVX = 0 | AVX2 = 0 | AVX512 = 0 | FMA = 0 | NEON = 1 | ARM_FMA = 1 | F16C = 0 | FP16_VA = 1 | WASM_SIMD = 0 | BLAS = 1 | SSE3 = 0 | VSX = 0 | 

main: prompt: 'She'
main: number of tokens in prompt = 2
     1 -> ''
 13468 -> 'She'

sampling parameters: temp = 0.800000, top_k = 40, top_p = 0.950000, repeat_last_n = 64, repeat_penalty = 1.300000


Shepherds Bush International station was once again the destination of choice for our Sunday afternoon outing, following another successful event on Saturday. We split into two groups this time to explore what is possibly London's most exciting and vibrant district: Shepherd’s Market (it actually sounds a lot like Soho) lies just north-east from the station itself with some of its oldest buildings dating back over 200 years. The market has been in continuous existence since at least the early part of this century – when it was called 'The Pig Alley' - and it is still home to a

main: mem per token = 14434244 bytes
main:     load time =   671.87 ms
main:   sample time =   113.01 ms
main:  predict time =  5871.94 ms / 45.52 ms per token
main:    total time =  6939.42 ms
```
* 内存 4.1G

### 交互模式
```shell
./main -m ./models/7B/ggml-model-q4_0.bin -t 8 -n 256 --repeat_penalty 1.0 --color -i -r "User:" -p \
"Transcript of a dialog, where the User interacts with an Assistant named Bob. Bob is helpful, kind, honest, good at writing, and never fails to answer the User's requests immediately and with precision.

User: Hello, Bob.
Bob: Hello. How may I help you today?
User: Please tell me the largest city in Europe.
Bob: Sure. The largest city in Europe is Moscow, the capital of Russia.
User:"
```

### 测试详情
| 模型  | 大小 | 量化(4位) | 内存   |
| :--: | ---: | -------: | ----: |
|  7B  | 13G  |     3.9G |  4.0G |
| 13B  | 12G  |     3.8G |  7.8G |
| 30B  | 15G  |     4.7G | 19.4G |
| 65B  | 15G  |          |       |


## 参考资料
* [LLaMA](https://github.com/facebookresearch/llama)
* [llama.cpp](https://github.com/ggerganov/llama.cpp)
* [Using LLaMA with M1 Mac](https://dev.l1x.be/posts/2023/03/12/using-llama-with-m1-mac/)
* [Running LLaMA 7B and 13B on a 64GB M2 MacBook Pro with llama.cpp](https://til.simonwillison.net/llms/llama-7b-m2)
* [Simon Willison: TIL](https://til.simonwillison.net/)
