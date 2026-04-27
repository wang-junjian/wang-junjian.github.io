---
marp: true
theme: default
paginate: true
style: |
    h1 {
        font-size: 3em;
        text-align: center;
    }
    h4 {
        writing-mode: vertical-lr;
        font-size: 1.5em;
        font-weight: bold;
        position: absolute;
        top: 2em;
        left: 0em;
    }
    a {
        text-decoration: none;
    }
    img[alt~="center"] {
        display: block;
        margin: 0 auto;
    }
    .columns {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 1rem;
    }
---

# 大模型 AI 应用构建
<!--footer: ©2023 王军建-->

---

## 我们的 AI 基础服务

| 服务  | 地址 | 功能 |
| :---: | --- | --- |
| [FastChat](https://github.com/lm-sys/FastChat)     | http://172.16.33.66:8000 | OpenAI 接口，分布式管理大模型 |
|                                                    | http://172.16.33.66:8002 | 评估基于大型语言模型的聊天机器人 |
| [One API](https://github.com/songquanpeng/one-api)      | http://172.16.33.157:8100 | OpenAI 接口管理和分发系统 |
| [FastGPT](https://github.com/labring/FastGPT)      | http://172.16.33.157:8200 | 知识库问答平台 |
| [Dify](https://github.com/langgenius/dify) | http://172.16.33.157 | LLMOps 平台 |
| [ChatGPT Next](https://github.com/Yidadaa/ChatGPT-Next-Web) | http://172.16.33.157:8300 | Web 聊天机器人 |

<!--_footer: GPU 服务器：172.16.33.66 | CPU 服务器：172.16.33.157-->

---

## 微信聊天机器人
- [chatgpt-on-wechat](https://github.com/zhayujie/chatgpt-on-wechat)

---

#### 大模型 AI 基础服务架构图
![bg](images/LLMAIServices/architecture.png)

---
# 👉 FastChat
# 分布式管理大模型
<!--_header: '[😺](https://github.com/lm-sys/FastChat)'-->
<!--_footer: http://172.16.33.66:8000-->
---

## FastChat 系统架构
![](images/FastChat/fastchat-server-architecture.png)

---

## 提供的模型
### LLM
- chatglm2-6b
- chatglm3-6b
- gpt-3.5-turbo (chatglm3-6b)

### Embedding Model
- bge-base-zh (bge-base-zh-v1.5)
- text-embedding-ada-002 (bge-base-zh)

---

#### 🤖 Chatbot
![bg w:1000](images/FastChat/chatbot.png)
<!--_footer: http://172.16.33.66:8001-->

---

#### ⚔️ Chatbot Arena
![bg fit](images/FastChat/chatbot-arena.png)
<!--_footer: http://172.16.33.66:8002-->

---
# 👉 OpenAI API
# &nbsp;&nbsp;&nbsp;&nbsp; 操作：curl
---

## 列出模型：models

<div style='font-size: 0.7em;'>

```shell
curl http://172.16.33.66:8000/v1/models
```
```json
{
  "object": "list",
  "data": [
    {
      "id": "chatglm2-6b",
      "object": "model",
      "created": 1699948995,
      "owned_by": "fastchat",
      "root": "chatglm2-6b",
      "parent": null,
      "permission": [
        {
          "id": "modelperm-TotMqdtL2CUSv3Ea2qoX9m",
          "object": "model_permission",
          "created": 1699948995,
          "allow_create_engine": false,
          "allow_sampling": true,
          "allow_logprobs": true,
          "allow_search_indices": true,
          "allow_view": true,
          "allow_fine_tuning": false,
          "organization": "*",
          "group": null,
          "is_blocking": false
        }
      ]
    }
  ]
}
```

</div>

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
        "model": "chatglm2-6b",
        "messages": [{"role": "user", "content": "你是谁？"}],
        "temperature": 0.3
    }'
```
```json
{
  "id": "chatcmpl-3dW83Wpgs9ZpWrM8uahGTF",
  "object": "chat.completion",
  "created": 1699949859,
  "model": "chatglm2-6b",
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
            0.0007477423641830683,
            ......
            -0.002232820028439164,
            0.0010205521248281002
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
# 👉 One API
# OpenAI 接口管理
<!--_header: '[🏠](https://openai.justsong.cn/) [😺](https://github.com/songquanpeng/one-api) [🐳](https://hub.docker.com/r/justsong/one-api/tags)'-->
<!--_footer: http://172.16.33.157:8100-->
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

<!--_footer: '**Base URL**：不要加 `/v1`📌<br>**模型**：`chatglm2-6b`'-->

---

## OpenAI API 操作：completions

<div style='font-size: 0.7em;'>

```shell
curl http://172.16.33.157:8100/v1/completions \
    -H "Authorization: Bearer sk-r3i3TFHn5BO1ZG6yCf47A9DcDc6e48D5AeAaA57bB01a0962" \
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

---

## OpenAI API 操作：embeddings

<div style='font-size: 0.7em;'>

```shell
curl http://172.16.33.157:8100/v1/embeddings \
    -H "Authorization: Bearer sk-r3i3TFHn5BO1ZG6yCf47A9DcDc6e48D5AeAaA57bB01a0962" \
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
        ......
        -0.014226804487407207
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

---
# 👉 FastGPT
# 知识库问答平台
<!--_header: '[😺](https://github.com/labring/FastGPT) [📝](https://doc.fastgpt.in/docs/intro/)'-->
<!--_footer: http://172.16.33.157:8200-->
---

#### 基于 LLM 的知识库问答平台

![bg w:888](images/FastGPT/fastgpt.jpg)
<!--_footer: https://ai.fastgpt.in/<br>https://fastgpt.run/-->
<!--
* [FastGpt Api Docs](https://kjqvjse66l.feishu.cn/docx/DmLedTWtUoNGX8xui9ocdUEjnNh)
* [使用 Sealos 将 ChatGLM3 接入 FastGPT](https://forum.laf.run/d/1085)
-->

---

## 创建闲聊机器人
![](images/FastGPT/create-chatbot.png)

---

## 闲聊机器人：【AI 模型】（chatglm2-6b）➡️【保存并预览】
![](images/FastGPT/chatbot.png)

---

## 创建中英文闲聊机器人
![](images/FastGPT/create-chinese-english-chatbot.png)

---

## 中英闲聊机器人：【提示词】➡️【保存并预览】
![](images/FastGPT/chinese-english-chatbot.png)

<!-- 
AI 模型：chatglm2-6b，这个模型能力还是不行，很难做到，我使用了下面的提示词。
你是一位中英翻译专家，不要把解读用户的输入，直接把输入翻译为英文。
你是一位中英翻译专家，不要解读用户输入，首先检测用户输入的是中文还是英文，如果是中文就给出对应的英文，如果是英文就给出对应的中文。
你是一位翻译家，如果用户输入是中文就给出对应的英文，如果用户输入是英文就给出对应的中文。
 -->

---

#### 外链闲聊机器人（分享链接）
![bg fit](images/FastGPT/share-chatbot.png)

---

## 外链闲聊机器人（嵌入网页）
```html
<script src="http://172.16.33.157:8200/js/iframe.js" 
    id="fastgpt-iframe" 
    data-src="http://172.16.33.157:8200/chat/share?shareId=agzufbqkno3rt2sd53pqndz8" 
    data-color="#4e83fd">
</script>
```
---

## 闲聊机器人：配置 API 访问【记住API KEY 📌】
![](images/FastGPT/api-chatbot.png)
<!--_footer: `API KEY`: fastgpt-RlC14WWpuL5NzIOglv0nsettgKd49Jp-->

---

## 闲聊机器人：API 接口访问

<div style='font-size: 0.7em;'>

```shell
curl --location --request POST 'http://172.16.33.157:8200/api/v1/chat/completions' \
    --header 'Authorization: Bearer fastgpt-RlC14WWpuL5NzIOglv0nsettgKd49Jp' \
    --header 'Content-Type: application/json' \
    --data-raw '{
        "chatId":"1000",
        "stream":false,
        "detail":false,
        "messages": [
            {
                "content": "你是谁？",
                "role": "user"
            }
        ]
    }'
```

```json
{
  "id": "1000",
  "model": "",
  "usage": {
    "prompt_tokens": 1,
    "completion_tokens": 1,
    "total_tokens": 1
  },
  "choices": [
    {
      "message": {
        "role": "assistant",
        "content": "我是一个名为 ChatGLM2-6B 的人工智能助手，是基于清华大学 KEG 实验室和智谱 AI 公司于 2023 年共同训练的语言模型开发的。我的任务是针对用户的问题和要求提供适当的答复和支持。"
      },
      "finish_reason": "stop",
      "index": 0
    }
  ]
}
```

<!--_footer: https://doc.fastgpt.in/docs/development/openapi/-->

---

## 创建知识库

![](images/FastGPT/create-knowledge.png)

---

## 知识库：文件导入
![](images/FastGPT/knowledge-import-files.png)

---

## 知识库问答机器人
![](images/FastGPT/knowledge-chatbot.png)

---

## 知识库问答机器人：API 接口访问

<div style='font-size: 0.6em;'>

```shell
curl --location --request POST 'http://172.16.33.157:8200/api/v1/chat/completions' \
    --header 'Authorization: Bearer fastgpt-zt576J8Ru52ZBRD1k6wJmf8iTo6uy' \
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

---
# 👉 Dify
# LLMOps 平台
<!--_header: '[😺](https://github.com/langgenius/dify) [📝](https://docs.dify.ai/v/zh-hans/getting-started/readme)'-->
---

![bg](images/Dify/dify.png)

---

## OpenAI API 配置（One API）
![center w:950](images/Dify/openai-api-setting.png)
<!--_footer: '[智谱 AI API Keys](https://open.bigmodel.cn/usercenter/apikeys)'-->
---

## 创建数据集：选择数据源
![](images/Dify/create-dataset1.png)

---

## 创建数据集：文本分段与清洗
![](images/Dify/create-dataset2_1.png)

---

## 创建数据集：文本分段与清洗（自定义）
![](images/Dify/create-dataset2_2.png)

---

## 创建数据集：处理并完成
![](images/Dify/create-dataset3.png)

---

## 数据集：文件
![](images/Dify/dataset-files.png)

---

## 数据集：搜索
![](images/Dify/dataset-search.png)

---

## 创建应用
![](images/Dify/create-app.png)

---

## 应用概览
![](images/Dify/app-overview.png)

---
# 👉 ChatGPT Next Web
# Web 聊天机器人
<!--_header: '[😺](https://github.com/Yidadaa/ChatGPT-Next-Web)'-->
<!--_footer: http://172.16.33.157:8300-->
---

#### 设置

![bg fit](images/ChatGPT-Next/ChatGPT-Next-settings.png)

---

<style scoped>table {font-size: 24px;}</style>

## 自定义接口
**模型服务商：** OpenAI
**自定义模型名称：** chatglm2-6b

❶ **FastChat OpenAI API**

| 接口地址 | http://172.16.33.66:8000 |
| :---: | :--- |
| **API KEY** | EMPTY |

❷ **One API OpenAI API**

| 接口地址 | http://172.16.33.157:8100 |
| :---: | :--- |
| **API KEY** | sk-r3i3TFHn5BO1ZG6yCf47A9DcDc6e48D5AeAaA57bB01a0962 |

<!--_footer: '<div style="color:red">📌 因为这个设置信息是用于客户端与服务器直接通信的，所以需要开通对应的端口。</div>'-->

---

#### 闲聊

![bg fit](images/ChatGPT-Next/ChatGPT-Next-chat.png)

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
      OPEN_AI_API_BASE: 'http://172.16.33.157:8100/v1'
      OPEN_AI_API_KEY: 'sk-r3i3TFHn5BO1ZG6yCf47A9DcDc6e48D5AeAaA57bB01a0962'
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
  "open_ai_api_base": "http://172.16.33.157:8100/v1",
  "open_ai_api_key": "sk-r3i3TFHn5BO1ZG6yCf47A9DcDc6e48D5AeAaA57bB01a0962",
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
