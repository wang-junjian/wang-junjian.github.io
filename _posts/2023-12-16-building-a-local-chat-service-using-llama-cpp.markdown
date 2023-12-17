---
layout: post
title:  "使用 llama.cpp 构建本地聊天服务"
date:   2023-12-16 08:00:00 +0800
categories: llama.cpp
tags: [llama.cpp, llama-cpp-python, OpenAI, MacbookProM2MAX]
---

## llama.cpp
- 纯 C/C++ 实现
- Apple 芯片 ARM NEON, Accelerate, Metal 
- x86 架构 AVX, AVX2, AVX512
- 混合F16/F32精度
- 整数量化 2-bit, 3-bit, 4-bit, 5-bit, 6-bit, 8-bit 
- 后端支持 CUDA, Metal, OpenCL GPU

### 构建
❶ 克隆 [llama.cpp][llama.cpp] 仓库
```shell
git clone https://github.com/ggerganov/llama.cpp.git
cd llama.cpp
```

❷ make
```shell
make -j
```

❸ 安装依赖
```shell
pip install -r requirements.txt
```

### 获得 Facebook LLaMA2 模型
可以从 [TheBloke](https://huggingface.co/TheBloke) 下载已转换和量化的模型。
- [LLaMA 2 7B base](https://huggingface.co/TheBloke/Llama-2-7B-GGUF)
- [LLaMA 2 13B base](https://huggingface.co/TheBloke/Llama-2-13B-GGUF)
- [LLaMA 2 70B base](https://huggingface.co/TheBloke/Llama-2-70B-GGUF)
- [LLaMA 2 7B chat](https://huggingface.co/TheBloke/Llama-2-7B-chat-GGUF)
- [LLaMA 2 13B chat](https://huggingface.co/TheBloke/Llama-2-13B-chat-GGUF)
- [LLaMA 2 70B chat](https://huggingface.co/TheBloke/Llama-2-70B-chat-GGUF)

### 下载 GGUF 模型

#### huggingface-cli
```shell
pip install huggingface_hub

REPO_ID=TheBloke/Llama-2-7B-chat-GGUF
FILENAME=llama-2-7b-chat.Q4_K_M.gguf
huggingface-cli download ${REPO_ID} ${FILENAME} \
    --local-dir . --local-dir-use-symlinks False
```

#### wget
```shell
REPO_ID=TheBloke/Llama-2-7B-chat-GGUF
FILENAME=llama-2-7b-chat.Q4_K_M.gguf
wget https://huggingface.co/${REPO_ID}/resolve/main/${FILENAME}\?download\=true -O ${FILENAME}
```

### 聊天测试

- 糖果的制作步骤
```shell
./main -n 1000 -e -m TheBloke/Llama-2-7B-chat-GGUF/llama-2-7b-chat.Q4_K_M.gguf -p "糖果的制作步骤"
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

- 使用python求1-100的素数
```shell
./main -n 400 -e -m TheBloke/zephyr-7B-beta-GGUF/zephyr-7b-beta.Q4_K_S.gguf -p "使用python求1-100的素数"
```

```
 使用python求1-100的素数并输出
1. 定义一个函数来判断是否为素数，在判断时需要考虑自身和小于其本身的整数。
2. 定义一个列表来存储所有的素数，并用生成器表达式初始化它。
3. 定义一个变量num来记录当前正在判断的数字。
4. 通过循环将1到100的数字逐步添加到列表中，同时也可以直接输出每个素数。
5. 如果需要使用函数或方法来实现这些操作，则在定义函数和列表之前声明一个变量来保存函数或方法的返回值。
```

```python
def is_prime(num):
    if num <= 1: # 1和小于1的数不是素数
        return False
    for I in range(2, int(num**0.5) + 1): # 只需要检查小于数字平方根的整数，因为其他整数可以通过相乘得到更小的整数
        if num % I == 0:
            return False
    return True

primes = [num for num in range(2, 101) if is_prime(num)] # 生成器表达式初始化列表，使其在每次迭代时只生成一个元素，并保持其长度不变。

for p in primes:
    print(p)
```

```
运行结果：
2
3
5
```


## llama-cpp-python
- [Python Bindings for llama.cpp](https://llama-cpp-python.readthedocs.io/en/latest/)

### 使用 Metal (MPS) 进行安装
```shell
CMAKE_ARGS="-DLLAMA_METAL=on" pip install llama-cpp-python
pip install fastapi uvicorn sse-starlette pydantic-settings starlette-context
```

### OpenAI 兼容的 Web 服务器
```shell
python -m llama_cpp.server --model llama-2-7b-chat.Q4_K_M.gguf --model_alias Llama-2-7B-chat
```
-  --model MODEL         The path to the model to use for generating completions. (default: PydanticUndefined)
-  --model_alias MODEL_ALIAS The alias of the model to use for generating completions.
-  --n_ctx N_CTX         The context size. (default: 2048)
-  --host HOST           Listen address (default: localhost)
-  --port PORT           Listen port (default: 8000)

#### 更多功能
- [Local Copilot replacement](https://llama-cpp-python.readthedocs.io/en/latest/server/#code-completion)
- [Function Calling support](https://llama-cpp-python.readthedocs.io/en/latest/server/#function-calling)
- [Vision API support](https://llama-cpp-python.readthedocs.io/en/latest/server/#multimodal-models)

#### API 文档（http://localhost:8000/docs）
- POST /v1/completions
```shell
curl -X 'POST' \
  'http://localhost:8000/v1/completions' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "prompt": "\n\n### Instructions:\nWhat is the capital of France?\n\n### Response:\n",
  "stop": [
    "\n",
    "###"
  ]
}'
```

- POST /v1/embeddings
```shell
curl -X 'POST' \
  'http://localhost:8000/v1/embeddings' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "input": "The food was delicious and the waiter..."
}'
```

- POST /v1/chat/completions
```shell
curl -X 'POST' \
  'http://localhost:8000/v1/chat/completions' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "messages": [
    {
      "content": "You are a helpful assistant.",
      "role": "system"
    },
    {
      "content": "What is the capital of France?",
      "role": "user"
    }
  ]
}'
```

- GET /v1/models
```shell
curl -X 'GET' \
  'http://localhost:8000/v1/models' \
  -H 'accept: application/json'
```
```
{
  "object": "list",
  "data": [
    {
      "id": "Llama-2-7B-chat",
      "object": "model",
      "owned_by": "me",
      "permissions": []
    }
  ]
}
```

## 大模型下载
### 下载 HuggingFace 模型
❶ 安装 `huggingface_hub`
```shell
pip install huggingface_hub
```

❷ 编写下载模型脚本 `download.py`
```python
from huggingface_hub import snapshot_download
snapshot_download(repo_id="lmsys/vicuna-7b-v1.5", local_dir="vicuna-7b-v1.5",
                  local_dir_use_symlinks=False, revision="main")
```

❸ 下载模型
```shell
mkdir vicuna-7b-v1.5
python download.py
```

- [Download files from the HuggingFace Hub](https://huggingface.co/docs/huggingface_hub/guides/download)
- [Tutorial: How to convert HuggingFace model to GGUF format](https://github.com/ggerganov/llama.cpp/discussions/2948)

### 下载 ModelScope 模型（HuggingFace 的国内替代）
❶ 安装 `modelscope`
```shell
pip install modelscope
```

❷ 编写下载模型脚本 `download.py`
```python
from modelscope import snapshot_download
snapshot_download("ZhipuAI/chatglm3-6b-32k", revision="v1.0.0", 
                  cache_dir="chatglm3-6b-32k")
```

❸ 下载模型
```shell
python download.py
```


## 参考资料
- [Text generation models](https://platform.openai.com/docs/guides/text-generation?lang=curl)


[llama.cpp]: https://github.com/ggerganov/llama.cpp
