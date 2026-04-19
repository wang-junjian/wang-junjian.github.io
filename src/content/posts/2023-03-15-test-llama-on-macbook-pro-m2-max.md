---
layout: single
title:  "在 MacBook Pro M2 Max 上测试 LLaMA"
date:   2023-03-15 08:00:00 +0800
categories: LLaMA
tags: [LLM, GPT, MacBookProM2Max]
---

## [LLaMA](https://github.com/facebookresearch/llama)
LLaMA-13B 在大多数基准上的表现优于 GPT-3（175B），LLaMA-65B 与最好的型号 Chinchilla-70B 和 PaLM-540B 具有竞争力。
* [LLaMA: Open and Efficient Foundation Language Models](https://arxiv.org/abs/2302.13971v1)

### 克隆
```shell
git clone https://github.com/facebookresearch/llama
cd llama
```

### 下载模型
修改 download.sh，配置下载模型的 `地址(PRESIGNED_URL)` 和 `下载目录(TARGET_FOLDER)`。
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

| 模型  | 大小  | 量化(4位) | 内存   |
| :--: | ----: | -------: | ----: |
|  7B  |  13G  |     3.9G |  4.0G |
| 13B  |  24G  |     7.6G |  7.8G |
| 30B  |  61G  |      19G | 19.4G |
| 65B  | 122G  |      38G | 38.5G |


## GGUF 格式的大模型

### GGUF 介绍

GGUF 是一种二进制格式，旨在快速加载和保存模型。它是 GGML、GGMF 和 GGJT 的后继文件格式，通过包含加载模型所需的所有信息来确保明确性。 它还被设计为可扩展的，以便可以在不破坏兼容性的情况下将新信息添加到模型中。
- GGML（无版本）：基线格式，没有版本控制或对齐。
- GGMF（版本化）：与 GGML 相同，但具有版本化。 
- GGJT：对齐张量以允许与需要对齐的 mmap 一起使用。 v1、v2 和 v3 相同，但后面的版本使用与以前版本不兼容的不同量化方案。

[What is GGUF and GGML?](https://medium.com/@phillipgimmi/what-is-gguf-and-ggml-e364834d241c)

### 下载 GGUF 模型（HuggingFace [TheBloke](https://huggingface.co/TheBloke) 仓库）

```shell
REPO_ID=TheBloke/CodeLlama-7B-GGUF
FILENAME=codellama-7b.Q4_K_M.gguf
```

#### [huggingface-cli](https://huggingface.co/docs/huggingface_hub/guides/cli)
```shell
pip install "huggingface_hub[cli]"
```

```shell
huggingface-cli download ${REPO_ID} ${FILENAME} \
    --local-dir . --local-dir-use-symlinks False
```

#### wget
```shell
wget https://huggingface.co/${REPO_ID}/resolve/main/${FILENAME}\?download\=true -O ${FILENAME}
```

### 模型转换为 GGUF

❶ 编译 llama.cpp
```shell
git clone https://github.com/ggerganov/llama.cpp.git
cd llama.cpp

make -j

pip install -r requirements.txt
```

❷ 转换为 `GGUF` 模型
```python
python convert.py vicuna-7b-v1.5 \
    --outfile vicuna-7b-v1.5.gguf \
    --outtype q8_0
```

### Llama2 量化性能

| Model | Measure | F16 | Q2_K | Q3_K_M | Q4_K_S | Q5_K_S | Q6_K |
| ----: | ------- | --: | ---: | -----: | -----: | -----: | ---: |
|    7B | perplexity             | 5.9066 | 6.7764 | 6.1503 | 6.0215 | 5.9419 | 5.9110 |
|    7B | file size              |  13.0G |  2.67G |  3.06G |  3.56G |  4.33G |  5.15G |
|    7B | ms/tok @ 4th, M2 Max   |    116 |     56 |     69 |     50 |     70 |     75 |
|    7B | ms/tok @ 8th, M2 Max   |    111 |     36 |     36 |     36 |     44 |     51 |
|    7B | ms/tok @ 4th, RTX-4080 |     60 |   15.5 |   17.0 |   15.5 |   16.7 |   18.3 |
|    7B | ms/tok @ 4th, Ryzen    |    214 |     57 |     61 |     68 |     81 |     93 |
|   13B | perplexity             | 5.2543 | 5.8545 | 5.4498 | 5.3404 | 5.2785 | 5.2568 |
|   13B | file size              |  25.0G |  5.13G |  5.88G |  6.80G |  8.36G |  9.95G |
|   13B | ms/tok @ 4th, M2 Max   |    216 |    103 |    148 |     95 |    132 |    142 |
|   13B | ms/tok @ 8th, M2 Max   |    213 |     67 |     77 |     68 |     81 |     95 |
|   13B | ms/tok @ 4th, RTX-4080 |      - |   25.3 |   29.3 |   26.2 |   28.6 |   30.0 |
|   13B | ms/tok @ 4th, Ryzen    |    414 |    109 |    118 |    130 |    156 |    180 |

[k-quants](https://github.com/ggerganov/llama.cpp/pull/1684)

困惑度(Perplexity, PPL)是一种用来评价语言模型好坏的指标。

直观上理解，当我们给定一段非常标准的，高质量的，符合人类自然语言习惯的文档作为测试集时，模型生成这段文本的概率越高，就认为模型的困惑度越小，模型也就越好。

[LLM评估指标困惑度(perplexity)的理解](https://zhuanlan.zhihu.com/p/651410752)

### 从 [TheBloke](https://huggingface.co/TheBloke) 下载已转换和量化的 [Meta Llama 2 模型](https://huggingface.co/meta-llama)
- [Llama 2 7B base](https://huggingface.co/TheBloke/Llama-2-7B-GGUF)
- [Llama 2 13B base](https://huggingface.co/TheBloke/Llama-2-13B-GGUF)
- [Llama 2 70B base](https://huggingface.co/TheBloke/Llama-2-70B-GGUF)
- [Llama 2 7B chat](https://huggingface.co/TheBloke/Llama-2-7B-chat-GGUF)
- [Llama 2 13B chat](https://huggingface.co/TheBloke/Llama-2-13B-chat-GGUF)
- [Llama 2 70B chat](https://huggingface.co/TheBloke/Llama-2-70B-chat-GGUF)

### 聊天
```shell
./main -n 1000 -e -m llama-2-7b-chat.Q4_K_M.gguf -p "糖果的制作步骤"
```
```
 糖果的制作步骤

1. 选择优质的糖果：选择高质量的糖果，可以增加糖果的精度和烘培质地。
2. 将糖果隔开：将糖果按照大小和形状分成不同的颜色，这样可以更好地控制糖果的掉落速度和坍塌情况。
3. 淋上糖果：将糖果淋在板子上，确保每个糖果都够好地淋在板子上，这样可以减少糖果的落塌和损坏。
4. 均匀分配：将糖果均匀分配到板子上，确保每个糖果都有相同的大小和形状，这样可以更好地控制糖果的掉落速度和坍塌情况。
5. 烘培：将淋上的糖果晒在烘培机中，设置正确的时间和温度，以便糖果能够完全烘培。
6. 冻结：将烘培后的糖果冻结在冰箱中，以便保存和使用。
7. 预览：可以通过检查糖果的颜色、形状和质地来预览糖果的制作结果。
8. 修正：如果发现糖果的颜色或形状不匹配，可以通过修正糖果的烘培时间和温度来实现修正。
```

## [llama-cpp-python](https://github.com/abetlen/llama-cpp-python) [📜](https://llama-cpp-python.readthedocs.io/en/latest/)

### 使用 Metal (MPS) 进行安装
```shell
CMAKE_ARGS="-DLLAMA_METAL=on" pip install llama-cpp-python
pip install fastapi uvicorn sse-starlette pydantic-settings starlette-context
```

### OpenAI 兼容的 Web 服务器
```shell
python -m llama_cpp.server --model llama-2-7b-chat.Q4_K_M.gguf --model_alias Llama-2-7B-chat
```
```
--model MODEL     The path to the model to use for generating completions. (default: PydanticUndefined)
--model_alias MODEL_ALIAS The alias of the model to use for generating completions.
--n_ctx N_CTX     The context size. (default: 2048)
--host HOST       Listen address (default: localhost)
--port PORT       Listen port (default: 8000)
```

### [OpenAPI 文档](http://localhost:8000/docs)
- POST /v1/completions
- POST /v1/embeddings
- POST /v1/chat/completions
- GET /v1/models

### 更多功能
- [Local Copilot replacement](https://llama-cpp-python.readthedocs.io/en/latest/server/#code-completion)
- [Function Calling support](https://llama-cpp-python.readthedocs.io/en/latest/server/#function-calling)
- [Vision API support](https://llama-cpp-python.readthedocs.io/en/latest/server/#multimodal-models)

### curl 调用 API
`POST` `/v1/completions`
```shell
curl http://localhost:8000/v1/completions \
    -H "Content-Type: application/json" \
    -d '{
        "prompt": "中国的首都是？",
        "temperature": 0.3
    }'
```

`POST` `/v1/chat/completions`
```shell
curl http://localhost:8000/v1/chat/completions \
    -H "Content-Type: application/json" \
    -d '{ 
        "messages": [ 
            { "role": "user", "content": "中国的首都是？" }
        ]
    }'
```


## 参考资料
- [ChatLLaMA](https://github.com/nebuly-ai/nebullvm/tree/main/apps/accelerate/chatllama)
- [nebullvm](https://github.com/nebuly-ai/nebullvm)
* [LLaMA](https://github.com/facebookresearch/llama)
* [llama.cpp](https://github.com/ggerganov/llama.cpp)
* [Using LLaMA with M1 Mac](https://dev.l1x.be/posts/2023/03/12/using-llama-with-m1-mac/)
* [Running LLaMA 7B and 13B on a 64GB M2 MacBook Pro with llama.cpp](https://til.simonwillison.net/llms/llama-7b-m2)
* [Simon Willison: TIL](https://til.simonwillison.net/)
* [k-quants](https://github.com/ggerganov/llama.cpp/pull/1684)
* [Variable bit rate quantization #1256](https://github.com/ggerganov/llama.cpp/issues/1256)
* [QX_4 quantization #1240](https://github.com/ggerganov/llama.cpp/issues/1240)
