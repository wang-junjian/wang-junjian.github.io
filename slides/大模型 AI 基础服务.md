---
marp: true
theme: default
paginate: true
style: |
    h1 {font-size: 3em; text-align: center;}
    h4 {writing-mode: vertical-lr; font-size: 1.5em; font-weight: bold; position: absolute; top: 2em; left: 0em;}
    h5 {writing-mode: vertical-lr; font-size: 1.5em; font-weight: bold; position: absolute; top: 2em; right: 0em;}
    a {text-decoration: none;}
    table {width: 100%;}
    th, td {white-space: nowrap; width: 100%;}
    .columns {display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem;}
---

# 大模型 AI 基础服务
<!--footer: ©2023 王军建-->

---

<div style='font-size: 28px;'>

| 服务  | 地址 | 功能 |
| :---: | --- | --- |
| [FastChat](https://github.com/lm-sys/FastChat)     | http://172.16.33.66:8000 | 兼容 OpenAI API，分布式管理大模型 |
|                                                    | http://172.16.33.66:8001 | 聊天机器人|
|                                                    | http://172.16.33.66:8002 | 评估基于大型语言模型的聊天机器人 |
| [Tabby](https://github.com/TabbyML/tabby)          | http://172.16.33.66:8080 | AI 代码助手 |
| [One API](https://github.com/songquanpeng/one-api)      | http://172.16.33.66:8100 | OpenAI 接口管理和分发系统 |
| [FastGPT](https://github.com/labring/FastGPT)      | http://172.16.33.66:8200 | 知识库问答平台 |
| [Dify](https://github.com/langgenius/dify) | http://172.16.33.66 | LLMOps 平台 |
| [<nobr>ChatGPT Next Web](https://github.com/Yidadaa/ChatGPT-Next-Web) | http://172.16.33.66:8300 | Web 聊天机器人 |
| [Langchain-Chatchat](https://github.com/chatchat-space/Langchain-Chatchat) | http://172.16.33.66:8501 | 本地知识库问答 |
| [chatgpt-on-wechat](https://github.com/zhayujie/chatgpt-on-wechat) | | 微信聊天机器人 |

</div>

---

#### 大模型基础服务架构图
![bg w:1060](images/LLMAIServices/llm-architecture.png)

---

## 代码大模型基础服务架构图
![](images/LLMAIServices/codellm-architecture.png)

---

![](images/LLMAIServices/deploy.png)

---

## 服务器（http://172.16.33.66）存储的大模型

<div class="columns"><div>

### LLM (/data/models/llm)
- chatglm2-6b
- chatglm3-6b
- chatglm3-6b-32k
- QWen-7B-Chat
- Baichuan2-7B-Chat
- Baichuan2-13B-Chat-4bits
- vicuna-7b-v1.5
- llama | llama 2
- Llama2-Chinese-13b-Chat-ms

</div><div>

### 嵌入模型 (/data/models/embedding)
- bge-base-zh-v1.5
- stella-base-zh-v2
- piccolo-large-zh

### 代码 LLM (/data/models/code-llm)
- DeepseekCoder-1.3B
- DeepseekCoder-6.7B
- StarCoder-1B

</div></div>

---
# 模型性能
---

## LLM 性能对比（NVIDIA Tesla T4 16GB）

| 模型 | 序列长度 | 量化精度 | 显存（GB） | 速度（字符数/秒） |
| --- | ---: | --- | ---: | --- |
| ChatGLM3-6B     |  8k | FP16       |  14 | 29.35 |
| ChatGLM3-6B     |  8k | LLM.int8   |   8 | 15.90 🐢🐢 |
| ChatGLM3-6B     |  8k | INT8       | 7.5 | &nbsp;&nbsp; 4.93 🐢🐢🐢🐢🐢🐢 |
| ChatGLM3-6B-32K | 32k | FP16       |  14 | 30.52 |
| ChatGLM3-6B-32K | 32k | LLM.int8   |   8 | 15.49 🐢🐢 |
| ChatGLM3-6B-32K | 32k | INT8       | 7.5 | &nbsp;&nbsp; 4.88 🐢🐢🐢🐢🐢🐢 |

📌 量化精度 FP16 时，输入序列长度最多 5600 个字符（汉字）

---

## ChatGLM3
- 参数：6B
- 序列长度：8k
## ✚ 知识库
## 📌 上下文信息缺失
![bg right:63% fit](images/ChatGLM/knowledge-qa.jpg)

---

## ChatGLM3
- 参数：6B
- 序列长度：32k
## 📌 更精准
![bg right:68% fit](images/ChatGLM/document-qa.png)

---

## 嵌入模型性能对比

| 模型 | 模型尺寸（GB） | 嵌入维度 | 序列长度 | 检索平均分数 |
| --- | ---: | ---: | ---: | ---: |
| [infgrad/stella-base-zh-v2][stella-base-zh-v2] | 0.21 | 768  | 1024 | 70.08 |
| [sensenova/piccolo-large-zh][piccolo-large-zh] | 0.65 | 1024 | 512  | 70.93 |
| [BAAI/bge-base-zh-v1.5][bge-base-zh-v1.5]      |  1.1 | 768  | 512  | 69.49 |
| [moka-ai/m3e-base][m3e-base]                   | 0.41 | 768  | 512  | 56.91 |

<!--_footer: '[Massive Text Embedding Benchmark (MTEB) Leaderboard](https://huggingface.co/spaces/mteb/leaderboard)'-->

---
# 👉 FastChat
# 分布式管理大模型
<!--_header: '[😺](https://github.com/lm-sys/FastChat)'-->
---

## FastChat 系统架构
![](images/FastChat/fastchat-server-architecture.png)

---

## 部署 FastChat

- 安装
```shell
pip install "fschat[model_worker,webui]"
```

❶ Controller
```shell
python -m fastchat.serve.controller
```

---

## 部署 Model Worker：大型语言模型 ChatGLM
❷ Model Worker

- LLM：ChatGLM3-6B
```shell
export CUDA_VISIBLE_DEVICES=3
python -m fastchat.serve.model_worker \
    --model-path /data/models/llm/chatglm3-6b --port 21003 \
    --worker-address http://localhost:21003
```

---

## 部署 Model Worker：大型语言模型 ChatGLM（量化 INT8）

- LLM：ChatGLM3-6B-32K
```shell
export CUDA_VISIBLE_DEVICES=0
python -m fastchat.serve.model_worker \
    --model-path /data/models/llm/chatglm3-6b-32k --port 21032 \
    --worker-address http://localhost:21032 \
    --load-8bit \
    --model-names chatglm3-6b-32k
```
📌 INT8 量化（--load-8bit）

---

## 部署 Model Worker：大型语言模型 Qwen-7B-Chat（多个 GPU）

- LLM：Qwen-7B-Chat
```shell
export CUDA_VISIBLE_DEVICES=0,1
python -m fastchat.serve.vllm_worker \
    --model-path /data/models/llm/Qwen-7B-Chat --port 21005 \
    --worker-address http://localhost:21005 \
    --num-gpus=2
```
📌 指定 GPU 数量部署大参数模型，一个 GPU 不足以部署（--num-gpus）

---

## 部署 vLLM Worker：大型语言模型 Qwen-7B-Chat（并行推理）

- LLM：Qwen-7B-Chat
```shell
export CUDA_VISIBLE_DEVICES=0,1
python -m fastchat.serve.vllm_worker \
  --model-path Qwen/Qwen-7B-Chat \
  --tensor-parallel-size 2
```
📌 指定 GPU 的数量（--tensor-parallel-size）

---

## 部署 Model Worker：大型语言模型 Vicuna-7b-v1.5（模型命名）
- LLM：Vicuna-7b-v1.5
```shell
python -m fastchat.serve.model_worker \
    --model-path /data/models/llm/vicuna-7b-v1.5 --port 21006 \
    --worker-address http://localhost:21006 \
    --model-names gpt-3.5-turbo
```
📌 模型命名，可以有多个名字（--model-names）
- vicuna-7b,gpt-3.5-turbo

---

## 部署 Model Worker：嵌入模型 bge-base-zh-v1.5

- 嵌入模型：bge-base-zh-v1.5
```shell
export CUDA_VISIBLE_DEVICES=2

python -m fastchat.serve.model_worker \
    --model-path bge-base-zh-v1.5 --port 21100 \
    --worker-address http://localhost:21100 \
    --model-names text-embedding-ada-002

python -m fastchat.serve.model_worker \
    --model-path bge-base-zh-v1.5 --port 21101 \
    --worker-address http://localhost:21101 \
    --model-names text-embedding-ada-002
```
📌 部署多个嵌入模型

---

## 部署：OpenAI API Server

❸ OpenAI API Server
```shell
python -m fastchat.serve.openai_api_server \
    --host 0.0.0.0 --port 8000
```

---

## 部署：聊天机器人

❹ Gradio Web Server
```shell
python -m fastchat.serve.gradio_web_server \
    --host 0.0.0.0 --port 8001
```
📌 可以选择部署的 LLM 进行聊天

<!--_footer: 📌 模型变动需要重新部署聊天机器人，使用了 Model Worker 和 vLLM Worker 部署模型。-->

---

## 部署：评估聊天机器人
❺ Multi-Tab Gradio Web Server
```shell
python -m fastchat.serve.gradio_web_server_multi \
    --host 0.0.0.0 --port 8002
```
📌 可以选择两个不同的 LLM 进行同时聊天，用于评估效果

<!--_footer: 📌 模型变动需要重新部署评估聊天机器人，使用了 Model Worker 和 vLLM Worker 部署模型。-->

---

## 关闭服务
- 关闭所有服务
```shell
python -m fastchat.serve.shutdown_serve --down all
```

- 关闭 Controller
```shell
python -m fastchat.serve.shutdown_serve --down controller
```

- 关闭 Model Worker
```shell
python -m fastchat.serve.shutdown_serve --down model_worker
```

- 关闭 OpenAI API Server
```shell
python -m fastchat.serve.shutdown_serve --down openai_api_server
```

---

#### 🤖 Chatbot
![bg w:1000](images/FastChat/chatbot.png)

---

#### ⚔️ Chatbot Arena
![bg fit](images/FastChat/chatbot-arena.png)

---
# 👉 OpenAI API
# &nbsp;&nbsp;&nbsp;&nbsp; 操作：curl
---

## 列出模型：models

<div style='font-size: 0.7em;'>

```shell
curl http://172.16.33.66:8000/v1/models | \
    grep -oP '(?<="id":")[^"]*' | \
    grep -v '^modelperm-'
```
- bge-base-zh
- chatglm3-6b
- chatglm3-6b-32k
- gpt-3.5-turbo
- gpt-4-32k
- text-embedding-ada-002

</div>

<!--
# grep -oP '(?<="id":")[^"]*'
GitHub Copilot: 这是一个使用了 Perl-Compatible Regular Expressions (PCRE) 的 `grep` 命令。让我们逐个解析这个命令的各个部分：
- `grep`: 这是一个在文本中搜索指定模式的命令。
- `-o`: 这个选项让 `grep` 只输出匹配到的部分，而不是整行。
- `-P`: 这个选项让 `grep` 使用 Perl-Compatible Regular Expressions。这种类型的正则表达式提供了一些额外的功能，比如在这个例子中使用的前瞻断言。
- `'(?<="id":")[^"]*'`: 这是一个 Perl-Compatible Regular Expression。让我们逐个解析这个表达式的各个部分：
  - `(?<="id":")`: 这是一个前瞻断言，它匹配 `"id":"` 后面的位置。前瞻断言是一种特殊的非捕获组，它只匹配一个位置，而不是字符。这个前瞻断言的意思是，我们要找的位置必须在 `"id":"` 后面。
  - `[^"]*`: 这个表达式匹配任何不是 `"` 的字符（`[^"]`），零次或多次（`*`）。这个表达式的意思是，我们要找的是任何不是 `"` 的字符，直到我们遇到下一个 `"`。
所以，整个命令的意思是，找到所有在 `"id":"` 后面并且直到下一个 `"` 的字符，并且只输出这些字符。

# grep -v '^modelperm-'
grep -v '^modelperm-' 将会排除所有以 "modelperm-" 开头的行。^ 是一个特殊字符，表示行的开始，所以 ^modelperm- 匹配任何以 "modelperm-" 开头的行。
-->

---

## 完成：completions

<div style='font-size: 0.7em;'>

```shell
curl http://172.16.33.66:8000/v1/completions \
    -H "Content-Type: application/json" \
    -d '{
        "model": "chatglm3-6b",
        "prompt": "你是谁？",
        "temperature": 0.3
    }'
```

```json
{
  "id": "chatcmpl-zwFjfHAspUjVNknNzmSU9f",
  "object": "chat.completion",
  "created": 1700206890,
  "model": "chatglm3-6b",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "我是名为 ChatGLM3-6B 的人工智能助手，是基于清华大学 KEG 实验室和智谱 AI 公司于 2023 年共同训练的语言模型开发的。"
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 17,
    "total_tokens": 68,
    "completion_tokens": 51
  }
}
```

</div>

---

## 聊天：chat/completions

<div style='font-size: 0.7em;'>

```shell
curl http://172.16.33.66:8000/v1/chat/completions \
    -H "Content-Type: application/json" \
    -d '{
        "model": "chatglm3-6b",
        "messages": [{"role": "user", "content": "你是谁？"}],
        "temperature": 0.3
    }'
```
```json
{
  "id": "chatcmpl-3dW83Wpgs9ZpWrM8uahGTF",
  "object": "chat.completion",
  "created": 1699949859,
  "model": "chatglm3-6b",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "我是一个人工智能助手，我的名字是 ChatGLM。"
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 19,
    "total_tokens": 71,
    "completion_tokens": 52
  }
}
```

</div>

---

## 嵌入：embeddings

<div style='font-size: 0.7em;'>

```shell
curl http://172.16.33.66:8000/v1/embeddings \
    -H "Content-Type: application/json" \
    -d '{
        "input": "用于生成嵌入文本的字符串。",
        "model": "bge-base-zh"
    }'
```
```
{
    "object": "list",
    "data": [
        {
        "object": "embedding",
        "embedding": [
            -0.0038084269035607576,
        ],
        "index": 0
        }
    ],
    "model": "bge-base-zh",
    "usage": {
        "prompt_tokens": 15,
        "total_tokens": 15
    }
}
```

</div>

---

## tcpdump 监听网络端口

### 实时监听 8100 端口
```shell
sudo tcpdump -i any -A 'tcp port 8100 and (((ip[2:2] - ((ip[0]&0xf)<<2)) - ((tcp[12]&0xf0)>>2)) != 0)'
```
```
12:03:00.289264 IP 172.26.0.4.34572 > gpu1.8100: Flags [P.], seq 3010033875:3010035264, ack 2688150008, win 502, options [nop,nop,TS val 4185566950 ecr 2900078142], length 1389
E.....@.@.........!B.....ix..9.............
.z.....>POST /v1/chat/completions HTTP/1.1
{
  "model": "chatglm3-6b",
  "temperature": 0,
  "messages": [
    {
      "role": "user",
      "content": ".....................JSON......"
    }
  ],
```

### 显示非 ASCII 码（如：中文）`-w -`
```shell
sudo tcpdump -i any -A 'tcp port 8100 and (((ip[2:2] - ((ip[0]&0xf)<<2)) - ((tcp[12]&0xf0)>>2)) != 0)' -w -
```
```
      "content": "使用会议室生成JSON格式"
```

---
<!--_header: '[😺](https://github.com/TabbyML/tabby)'-->
# 👉 Tabby
# AI 编码助手
---

## AI 编码助手功能
- 代码补全
- 代码解释
- 生成文档
- 代码修复
- 代码优化
- 生成单元测试
- 任何编码问题

![bg right:66% fit](../images/2024/Cody/cody-chat-interface.png)

---

#### 代码模型排行榜
![bg w:990](images/Tabby/Coding-LLMs-Leaderboard.png)

---

## 部署：TabbyML/DeepseekCoder-6.7B（--runtime nvidia）

```shell
docker run -d --runtime nvidia --name tabby \
    -e NVIDIA_VISIBLE_DEVICES=3 \
    -p 8080:8080 \
    -v `pwd`/.tabby:/data tabbyml/tabby \
    serve --model TabbyML/DeepseekCoder-6.7B \
    --device cuda
```

### -e NVIDIA_VISIBLE_DEVICES=3 指定使用的 GPU 设备
- 不指定默认使用所有的 GPU 设备

---

## 部署：TabbyML/DeepseekCoder-6.7B（--gpus）
```shell
docker run -d --gpus '"device=3"' --name tabby \
    -p 8080:8080 \
    -v `pwd`/.tabby:/data tabbyml/tabby \
    serve --model TabbyML/DeepseekCoder-6.7B \
    --device cuda
```

### --gpus '"device=3"' 指定使用的 GPU 设备
- --gpus all 使用所有的 GPU 设备

---

## 部署：TabbyML/DeepseekCoder-X

```shell
docker run -d --gpus all --name tabby \
    -p 8080:8080 \
    -v `pwd`/.tabby:/data tabbyml/tabby \
    serve --model TabbyML/DeepseekCoder-6.7B \
    --device cuda --parallelism 4
```

- --parallelism <PARALLELISM> 模型服务的并行度（`4` 张卡的 `NVIDIA T4 16GB` 服务器）
  - `TabbyML/DeepseekCoder-1.3B` 模型最多设置 `12` 个并行度
  - `TabbyML/DeepseekCoder-6.7B` 模型最多设置 `4` 个并行度

---

## JetBrains IDE
- IntelliJ IDEA
- PyCharm
- Android Studio
- RustRover
- WebStorm
- GoLand
- ......
## Tabby 设置
![bg right:68% fit](images/Tabby/IDEA-Tabby-Settings.png)

---

## JetBrains IDE
- IntelliJ IDEA
- PyCharm
- Android Studio
- RustRover
- WebStorm
- GoLand
- ......
## CodeGPT 设置
![bg right:68% fit](images/Tabby/IDEA-CodeGPT-Settings.png)

---

#### 代码生成 (Tabby)
##### AI 聊天 (CodeGPT)
![bg w:1010](images/Tabby/IDEA-Code-Completions-AIChat.png)

---

#### VS Code
##### Tabby 设置
<p style="color:white; font-size:0.8em">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; http://172.16.33.66:8080</p>
<br><br><br><br><br><br>

![bg fit](images/Tabby/VSCode-Tabby-Settings.png)

---

## 插件参数设置

### Tabby
- `Endpoint`: http://172.16.33.66:8080

### CodeGPT
- `Service`: OpenAI Service
- `API key`: NULL
- `Model`: 
  - GPT-3.5(4k) `gpt-3.5-turbo`
  - GPT-4(32k) `gpt-4-32k`
- `Base host`: http://172.16.33.66:8000

---

## 相关文档
- [人工智能编码助手（AI Coding Assistant）功能](https://wangjunjian.com/aicodingassistant/githubcopilot/2024/01/13/AI-Coding-Assistant-Function.html)
- [Tabby - GitHub Copilot 的开源替代解决方案](https://wangjunjian.com/tabby/githubcopilot/2024/01/05/Tabby-An-open-source-alternative-to-GitHub-Copilot.html)
- [CodeGPT: 智能辅助编程](https://wangjunjian.com/codegpt/intellijidea/2024/01/03/CodeGPT-Intelligent-Assisted-Programming.html)
- [基于 PyCharm 使用 Tabby 和 CodeGPT 插件搭建免费的 GitHub Copilot](https://wangjunjian.com/pycharm/tabby/codegpt/2024/01/09/Build-free-GitHub-Copilot-based-on-PyCharm-using-Tabby-and-CodeGPT-plug-ins.html)
- [基于 Intelli JIDEA 使用 Tabby 和 CodeGPT 插件搭建免费的 GitHub Copilot](https://wangjunjian.com/intellijidea/tabby/codegpt/2024/01/10/Build-free-GitHub-Copilot-based-on-IntelliJ-IDEA-using-Tabby-and-CodeGPT-plug-ins.html)
- [基于 VS Code 使用 Tabby 插件搭建免费的 GitHub Copilot](https://wangjunjian.com/vscode/tabby/2024/01/10/Build-free-GitHub-Copilot-based-on-VSCode-using-Tabby-plug-ins.html)

---
# 👉 One API
# OpenAI 接口管理
<!--_header: '[😺](https://github.com/songquanpeng/one-api) [🐳](https://hub.docker.com/r/justsong/one-api/tags)'-->
<!--_footer: '[One API](https://openai.justsong.cn/)'-->
---

## 部署

```shell
docker run -d --restart always \
    --name one-api \
    -p 8100:3000 \
    -v `pwd`/one-api:/data \
    -v /etc/ssl/certs:/etc/ssl/certs:ro \
    justsong/one-api:latest
```

<!--password:soft@5569-->

---

## 【令牌】 ➡️ 【添加新的令牌】
![](images/One-API/add-token.png)

---

<style scoped>
    img[alt~="center"] {
        display: block;
        margin: 0 auto;
        width: 800px;
    }
</style>

## 【渠道】 ➡️ 【添加新的渠道】
![center](images/One-API/add-channel.png)
<!--_footer: '**Base URL**：不要加 `/v1`📌<br>**LLM**<br>`chatglm2-6b`<br>`chatglm3-6b`<br>`gpt-3.5-turbo`<br>**Embedding Model**<br>`bge-base-zh`<br>`text-embedding-ada-002`<br><br>📌通过模型重定义的名字<br>也需要`输入自定义模型名称`'-->

---

## OpenAI API 操作：completions

<div style='font-size: 0.7em;'>

```shell
export OPENAI_API_KEY=sk-waWGvLLh10gbcGMv9e62F0A1Fb4b4f91A4A7905dF7984044
curl http://172.16.33.66:8100/v1/completions \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{
        "model": "gpt-3.5-turbo",
        "prompt": "你是谁？",
        "temperature": 0.3
    }'
```

```json
{
  "id": "cmpl-3BuYt9uVVoCetCJ6quk72P",
  "object": "text_completion",
  "created": 1700207760,
  "model": "chatglm3-6b",
  "choices": [
    {
      "index": 0,
      "text": "我为什么要在你这里提问？\n 您好，我是一个人工智能助手，",
      "logprobs": null,
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 6,
    "total_tokens": 22,
    "completion_tokens": 16
  }
}
```

</div>

---

## OpenAI API 操作：embeddings

<div style='font-size: 0.7em;'>

```shell
export OPENAI_API_KEY=sk-waWGvLLh10gbcGMv9e62F0A1Fb4b4f91A4A7905dF7984044
curl http://172.16.33.66:8100/v1/embeddings \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{
        "input": "用于生成嵌入文本的字符串。",
        "model": "text-embedding-ada-002"
    }'
```

```json
{
  "object": "list",
  "data": [
    {
      "object": "embedding",
      "embedding": [
        -0.03044959157705307,
      ],
      "index": 0
    }
  ],
  "model": "bge-base-zh",
  "usage": {
    "prompt_tokens": 15,
    "total_tokens": 15
  }
}
```

</div>

---
# 👉 FastGPT
# 知识库问答平台
<!--_header: '[😺](https://github.com/labring/FastGPT) [📝](https://doc.fastgpt.in/docs/intro/)'-->
---

#### 基于 LLM 的知识库问答平台

![bg w:888](images/FastGPT/fastgpt.jpg)
<!--_footer: https://ai.fastgpt.in/<br>https://fastgpt.run/-->
<!--
* [FastGpt Api Docs](https://kjqvjse66l.feishu.cn/docx/DmLedTWtUoNGX8xui9ocdUEjnNh)
* [使用 Sealos 将 ChatGLM3 接入 FastGPT](https://forum.laf.run/d/1085)
-->

---

## 下载 docker-compose.yml 和 config.json
```shell
mkdir fastgpt
cd fastgpt
curl -O https://raw.githubusercontent.com/labring/FastGPT/main/files/deploy/fastgpt/docker-compose.yml
curl -O https://raw.githubusercontent.com/labring/FastGPT/main/projects/app/data/config.json
```

---

## 配置 docker-compose.yml
    
```yaml
services:
  pg:
    #ports: # 生产环境建议不要暴露
    #  - 5432:5432
  fastgpt:
    ports:
      - 8200:3000
    environment:
      # root 密码，用户名为: root
      - DEFAULT_ROOT_PSW=1234
      #📌 One API OpenAPI
      - OPENAI_BASE_URL=http://172.16.33.66:8100/v1
      - CHAT_API_KEY=sk-waWGvLLh10gbcGMv9e62F0A1Fb4b4f91A4A7905dF7984044
      #📌 FastChat OpenAI Server
      #- OPENAI_BASE_URL=http://172.16.33.66:8000/v1
      #- CHAT_API_KEY=EMPTY
```

---

## 配置 config.json

<div class="columns">
<div>

```json
  "ChatModels": [
    {
      "model": "chatglm3-6b",
      "name": "chatglm3-6b",
      "price": 0,
      "maxContext": 8000,
      "maxResponse": 8000,
      "quoteMaxToken": 2000,
      "maxTemperature": 1,
      "censor": false,
      "defaultSystemChatPrompt": ""
    },
  ]
```

</div>
<div>

## 配置模型
- ChatModels
- QAModels
- CQModels
- ExtractModels
- QGModels
- VectorModels

</div>
</div>

## 部署
```shell
docker-compose up -d
```

---

## 创建闲聊机器人
![](images/FastGPT/create-chatbot.png)

---

## 闲聊机器人 【AI 模型：chatglm2-6b】➡️【保存并预览】
![](images/FastGPT/chatbot.png)

---

## 中英翻译机器人 【提示词】➡️【保存并预览】
![](images/FastGPT/chinese-english-chatbot.png)

<!-- 
AI 模型：chatglm2-6b，这个模型能力还是不行，很难做到，我使用了下面的提示词。
你是一位中英翻译专家，不要把解读用户的输入，直接把输入翻译为英文。
你是一位中英翻译专家，不要解读用户输入，首先检测用户输入的是中文还是英文，如果是中文就给出对应的英文，如果是英文就给出对应的中文。
你是一位翻译家，如果用户输入是中文就给出对应的英文，如果用户输入是英文就给出对应的中文。
 -->

---

## FastGPT 知识库问答工作流程图
![](images/FastGPT/FastGPT-KB-QA-Workflow.png)
<!--_footer: '📌【**QA**】使用自定义的 OpenAI API 没有成功 ❌'-->

---

## 知识库 ► 创建

![](images/FastGPT/create-knowledge.png)

---

## 知识库 ► 文件导入
![](images/FastGPT/knowledge-import-files.png)

---

## 应用 ► 创建 【模板：知识库 + 对话引导】
![](images/FastGPT/knowledge-chatbot-create.png)

---

#### 应用 ▼ 简易配置
![bg w:1060](images/FastGPT/knowledge-chatbot.png)

---

#### 应用 ▼ 高级编排
![bg w:1000](images/FastGPT/advance-edit.png)

---

#### 应用 ▼ 外部使用（分享链接）
![bg fit](images/FastGPT/share-chatbot.png)

---

#### 应用 ▼ 外部使用（页面嵌入）
![bg w:1020](images/FastGPT/iframe-chatbot.png)

---

## 应用 ► 外部使用（API 访问）
![](images/FastGPT/api-chatbot.png)
<!--_footer: '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;📌 `API KEY`&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;fastgpt-hNFvKjB30b4u4BMgLDXf2dkk3JN3lMWlqDKNB'-->

---

## API 访问（curl）

<div style='font-size: 0.6em;'>

```shell
curl --location --request POST 'http://172.16.33.66:8200/api/v1/chat/completions' \
    --header 'Authorization: Bearer fastgpt-hNFvKjB30b4u4BMgLDXf2dkk3JN3lMWlqDKNB' \
    --header 'Content-Type: application/json' \
    --data-raw '{
        "chatId":"1000",
        "stream":false,
        "detail":false,
        "messages": [
            {
                "content": "每月补卡次数",
                "role": "user"
            }
        ]
    }'
```

```json
{
  "id": "1000",
  "usage": {
    "prompt_tokens": 1,
    "completion_tokens": 1,
    "total_tokens": 1
  },
  "choices": [
    {
      "message": {
        "role": "assistant",
        "content": "根据您提供的信息，每月补卡次数不超过2次。"
      },
      "finish_reason": "stop",
      "index": 0
    }
  ]
}
```

</div>
<!--_footer: https://doc.fastgpt.in/docs/development/openapi/-->

---

#### 应用 ▼ 对话日志
![bg w:1060](images/FastGPT/conversation-log.png)

---

#### 应用案例
![bg w:1060](images/FastGPT/chatbot-app.png)

---

## FastGPT 总结
- 开源版本只能有一个用户，不支持多用户；
- 应用调用应用的时候没有成功，场景是定制多个应用，每个应用做不同的事情，然后由主应用进行分类路由；
- 通过外联分享应用的时候，它的聊天不能将知识库的引用给显示出来，但是可以通过 API 来获得引用的文档进行集成；
- 对文档自动生成问答对，目前内部部署的模型不能很好的支持；
- 上面一些问题，主要还是开源模型的性能偏低，不能很好的按照指令生成。

---
# 👉 Dify
# LLMOps 平台
<!--_header: '[😺](https://github.com/langgenius/dify) [📝](https://docs.dify.ai/v/zh-hans/getting-started/readme)'-->
---

![bg](images/Dify/dify.png)

---

## 部署
```shell
git clone https://github.com/langgenius/dify
cd dify/docker
docker-compose up -d
```

📌 **尽可能不要更改 `docker-compose.yaml` 文件，太多🕳️了。**
- 更改了 `PostgreSQL` 的端口 5432 出错了。
- 更改了 `Nginx` 的端口 80 也出错了（导致兼容 OpenAI API 接口配置失败）。

---

![bg right fit](images/Dify/install.png)

## 安装
http://172.16.33.66/install

- 邮箱：ls_wangjj@163.com
- 用户名：root
- 密码：1234

<!--password:soft@5569-->

---

## OpenAI API 配置（One API）
![center w:950](images/Dify/openai-api-setting.png)
<!--_footer: '[智谱 AI API Keys](https://open.bigmodel.cn/usercenter/apikeys)'-->
---

## 创建数据集：选择数据源
![](images/Dify/create-dataset1.png)

---

## 创建数据集 ► 文本分段与清洗
![](images/Dify/create-dataset2_1.png)
<!--_footer: '📌 自定义的 OpenAI API<br>❌ **索引方式：**`高质量`<br>✅ **索引方式：**`经济`'-->

---

## 创建数据集 ► 文本分段与清洗（自定义）
![](images/Dify/create-dataset2_2.png)

---

## 创建数据集 ► 处理并完成
![](images/Dify/create-dataset3.png)

---

## 数据集 ► 文件
![](images/Dify/dataset-files.png)

---

## 数据集 ► 搜索
![](images/Dify/dataset-search.png)

---

## 应用 ► 创建
![](images/Dify/create-app.png)

---

## 应用 ► 概览
![](images/Dify/app-overview.png)

---

## 应用 ► 访问 API ► 文本生成型应用 ✅
```json
curl --location --request POST 'http://172.16.33.157/v1/completion-messages' \
    --header 'Authorization: Bearer app-EDHeELELrSWQ02t9eQsPGZXD' \
    --header 'Content-Type: application/json' \
    --data-raw '{
        "inputs": {"query": "每月补卡次数"},
        "response_mode": "blocking",
        "user": "wangjunjian"
    }'
```
```json
{
  "event": "message",
  "task_id": "41154904-8ee9-4f0e-98a0-df0b1a01bb72",
  "id": "8196d298-d25a-4e63-993b-ca162eba2496",
  "answer": "每月补卡次数不超过2次。",
  "metadata": {},
  "created_at": 1701669892
}
```
<!--_footer: `API 密钥` app-EDHeELELrSWQ02t9eQsPGZXD-->

---

## 应用 ► 访问 API ► 对话型应用 ❌
```json
curl --location --request POST 'http://172.16.33.157/v1/chat-messages' \
    --header 'Authorization: Bearer app-aJDDGgNahoYVzPDpStTg3gOy' \
    --header 'Content-Type: application/json' \
    --data-raw '{
        "inputs": {},
        "query": "你是谁？",
        "response_mode": "blocking",
        "conversation_id": "",
        "user": "wangjunjian"
    }'
```
```json
{
    "code": "bad_request", 
    "message": "The browser (or proxy) sent a request that this server could not understand.", 
    "status": 400
}
```

- 首次对话 conversation_id: ""，如果要继续对话请传入上下文返回的 conversation_id

---

## Dify 总结
- 各个功能都可以通过 API 进行访问，集成开发非常方便，支持的大语言模型开发商非常丰富；
- 在使用内部部署的向量模型时，不支持高质量的索引方式；
- 使用对话 API（chat-messages）调用没有成功；
- 的发布只是保存的意思，并没有版本化的机制；
- 的智聊只支持 GPT 的模型，内部部署的模型可以使用相同名字来替代，可以通过 One API 配置。

---
# 👉 ChatGPT Next Web
# Web 聊天机器人
<!--_header: '[😺](https://github.com/Yidadaa/ChatGPT-Next-Web)'-->
---

## 部署

```shell
docker run -d --name chatgpt-next-web \
    -p 8300:3000 \
    -e BASE_URL=http://172.16.33.66:8100 \
    -e OPENAI_API_KEY=sk-waWGvLLh10gbcGMv9e62F0A1Fb4b4f91A4A7905dF7984044 \
    yidadaa/chatgpt-next-web:latest
```
- -e CODE=your-password
- -e CUSTOM_MODELS=chatglm2-6b,chatglm3-6b

---

#### 设置
![bg w:1060](images/ChatGPT-Next/ChatGPT-Next-settings.png)
<!--_footer: '`模型(model)`<br>📌 gpt-3.5-turbo（chatglm3-6b）<br>📌 gpt-4-32k（chatglm3-6b-32k）<br><br><br>'-->

---

<style scoped>table {font-size: 24px;}</style>

## 自定义接口
**模型服务商：** OpenAI
**自定义模型名称：** chatglm2-6b

❶ **FastChat OpenAI API**

| 接口地址 | http://172.16.33.66:8000 |
| :---: | :--- |
| **API KEY** | EMPTY &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; |

❷ **One API OpenAI API**

| 接口地址 | http://172.16.33.66:8100 |
| :---: | :--- |
| **API KEY** | sk-waWGvLLh10gbcGMv9e62F0A1Fb4b4f91A4A7905dF7984044 |

---

#### Web 聊天机器人
![bg w:1060](images/ChatGPT-Next/ChatGPT-Next-chat.png)

---

#### 提示词模版
![bg w:1060](images/ChatGPT-Next/ChatGPT-Next-Web-Prompt-Templates.png)

---

# ChatGPT 提示词
# [Awesome ChatGPT Prompts](https://github.com/f/awesome-chatgpt-prompts)
# [ChatGPT 中文调教指南](https://github.com/PlexPt/awesome-chatgpt-prompts-zh)

---
<!--_header: '[😺](https://github.com/chatchat-space/Langchain-Chatchat)'-->
# 👉 LangChain-Chatchat
# 本地知识库问答
---

## 部署 `lite` 版本

### 克隆仓库
```shell
git clone https://github.com/chatchat-space/Langchain-Chatchat
```

### 安装依赖
```shell
pip install -r requirements_lite.txt
pip install markdownify streamlit_modal
```

### 拷贝配置文件
```shell
pythobn copy_config_example.py
```

---

## 修改配置文件 `model_config.py`
```shell
EMBEDDING_MODEL = "text-embedding-ada-002"
LLM_MODELS = ["gpt-3.5-turbo"]

ONLINE_LLM_MODEL = {
    "gpt-3.5-turbo": {
        "model_name": "gpt-3.5-turbo",
        "api_base_url": "http://127.0.0.1:8000/v1",
        "api_key": "NULL",
        "openai_proxy": "",
    },

MODEL_PATH = {
    "embed_model": {
        "text-embedding-ada-002": "NULL",
    },
```

---

## 修改文件 `server/knowledge_base/kb_cache/base.py`
```shell
class EmbeddingsPool(CachePool):
    def load_embeddings(self, model: str = None, device: str = None) -> Embeddings:
        # ...
                if model == "text-embedding-ada-002":
                    from langchain.embeddings.openai import OpenAIEmbeddings
                    embeddings = OpenAIEmbeddings(model=model,                         # change
                                                  base_url="http://127.0.0.1:8000/v1", # change
                                                  openai_api_key=get_model_path(model),
                                                  chunk_size=CHUNK_SIZE)
```

---

## 启动 `lite` 版本
```shell
python startup.py -a --lite
```

- [wiki](https://github.com/chatchat-space/Langchain-Chatchat/wiki)
  - [开发环境部署](https://github.com/chatchat-space/Langchain-Chatchat/wiki/%E5%BC%80%E5%8F%91%E7%8E%AF%E5%A2%83%E9%83%A8%E7%BD%B2)

## 浏览器访问
  - http://172.16.33.66:8501

---

##### LLM 对话
![](images/LangChain-Chatchat/llm-conversation.png)

---

##### 文件对话
![](images/LangChain-Chatchat/file-conversation.png)

---
# 👉 chatgpt-on-wechat
# 微信聊天机器人
<!--_header: '[😺](https://github.com/zhayujie/chatgpt-on-wechat)'-->
---

## 部署：Docker
```shell
wget https://open-1317903499.cos.ap-guangzhou.myqcloud.com/docker-compose.yml
```

- 配置 `docker-compose.yml` 文件
```yaml
services:
  chatgpt-on-wechat:
    environment:
      OPEN_AI_API_BASE: 'http://172.16.33.66:8100/v1'
      OPEN_AI_API_KEY: 'sk-waWGvLLh10gbcGMv9e62F0A1Fb4b4f91A4A7905dF7984044'
```

- 运行程序
```shell
docker-compose up -d
```

- 查看用于登录的二维码
```shell
docker-compose logs -f
```

---

## 部署：来自源代码

```shell
git clone https://github.com/zhayujie/chatgpt-on-wechat
cd chatgpt-on-wechat/

python -m venv env
source env/bin/activate

pip install -r requirements.txt
pip install -r requirements-optional.txt

cp config-template.json config.json
```

- 配置 `config.json` 文件
```json
  "open_ai_api_base": "http://172.16.33.66:8100/v1",
  "open_ai_api_key": "sk-waWGvLLh10gbcGMv9e62F0A1Fb4b4f91A4A7905dF7984044",
```

- 运行程序
```shell
python app.py
```

---

![bg right:50% w:440px](images/chatgpt-on-wechat/chat.png)
## 朋友聊天
- 如果你使用自己的号登录，就不能与机器人聊天，如：`@bot hello` 就没有反应。

---

![bg left:50% w:440px](images/chatgpt-on-wechat/chat-group.png)
## 群组聊天
- 在群里面聊天，群里的任何人都可以与机器人聊天，如：现在我就可以在群里 `@bot`。

- 支持多轮会话。

---

# 谢 谢 ！
<!--_footer: ©2023 王军建-->


<!-- Text Embeddings 模型 -->
[stella-base-zh-v2]: https://huggingface.co/infgrad/stella-base-zh-v2
[piccolo-large-zh]: https://huggingface.co/sensenova/piccolo-large-zh
[bge-base-zh-v1.5]: https://huggingface.co/BAAI/bge-base-zh-v1.5
[m3e-base]: https://huggingface.co/moka-ai/m3e-base
