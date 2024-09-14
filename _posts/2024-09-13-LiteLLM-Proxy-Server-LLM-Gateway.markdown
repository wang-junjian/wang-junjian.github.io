---
layout: post
title:  "LiteLLM: [Python SDK] [Proxy Server (LLM Gateway)]"
date:   2024-09-13 08:00:00 +0800
categories: LiteLLM AIGateway
tags: [LiteLLM, AIGateway, LLM]
---

## LiteLLM Proxy Server (LLM Gateway)
- [Hosted LiteLLM Proxy](https://docs.litellm.ai/docs/hosted)
- [Proxy Config.yaml](https://docs.litellm.ai/docs/proxy/configs)

### Docker 部署（NO DB）

#### 编辑配置文件：`litellm_config.yaml`

```yaml
model_list:
  - model_name: gpt-4
    litellm_params:
      model: openai/gpt-4-32k
      api_base: http://172.16.33.66:9997/v1
      api_key: none
  - model_name: bge
    litellm_params:
      model: openai/bge-m3
      api_base: http://172.16.33.66:9997/v1
      api_key: none
general_settings:
  master_key: sk-1234 # [OPTIONAL] Only use this if you to require all calls to contain this key (Authorization: Bearer sk-1234)
```

#### 部署

```shell
docker run --name litellm \
    -v $(pwd)/litellm_config.yaml:/app/config.yaml \
    -p 4000:4000 \
    ghcr.io/berriai/litellm:main-stable \
    --config /app/config.yaml \
    --detailed_debug
```

### Docker 部署（DB）
- [Proxy 密钥管理 - Virtual Keys](https://docs.litellm.ai/docs/proxy/virtual_keys)

#### 部署
```shell
# Get the code
git clone https://github.com/BerriAI/litellm

# Go to folder
cd litellm

# Add the master key - you can change this after setup
echo 'LITELLM_MASTER_KEY="sk-1234"' > .env

# Add the litellm salt key - you cannot change this after adding a model
# It is used to encrypt / decrypt your LLM API Key credentials
# We recommned - https://1password.com/password-generator/ 
# password generator to get a random hash for litellm salt key
echo 'LITELLM_SALT_KEY="sk-1234"' > .env

source .env

# Start
docker-compose up
```

#### LiteLLM Proxy Server UI
登录 [http://localhost:8000/ui](http://localhost:8000/ui) 进入 LiteLLM Proxy Server UI。

**多次增加模型有点问题，测试 embeddings model 失败。**

##### 添加模型

![](/images/2024/LiteLLM/add-model.png)
- Provider: OpenAI-Compatible Endpoints (Together AI, etc.)
- Public Model Name: gpt-4
- LiteLLM Model Name(s): gpt-4-32k
- API Key: NONE
- API Base: http://172.16.33.66:9997/v1
- LiteLLM Params: Pass JSON of litellm supported params [litellm.completion() call](https://docs.litellm.ai/docs/completion/input)

##### 模型分析

![](/images/2024/LiteLLM/model-analytics.png)

### 模型测试

#### Chat Completions

```shell
curl -X POST 'http://127.0.0.1:4000/v1/chat/completions' \
    --header 'Content-Type: application/json' \
    --header 'Authorization: Bearer sk-1234' \
    --data-raw '{
        "model": "gpt-4",
        "messages": [ 
            { "role": "system", "content": "你是一名数学家。" }, 
            { "role": "user", "content": "1 + 1 = ?"} 
        ]
    }'
```

#### Embeddings

```shell
curl -X POST http://127.0.0.1:4000/v1/embeddings \
    -H "Content-Type: application/json" \
    -H 'Authorization: Bearer sk-1234' \
    -d '{
        "model": "bge",
        "input": "Hello!"
    }'
```

http://127.0.0.1:4000/v1/chat/completions 换成 http://127.0.0.1:4000/chat/completions 也可以。


## LiteLLM Python SDK

### 安装

```shell
pip install litellm
```

### OpenAI-Compatible Endpoints

```python
import os
import litellm


os.environ['LITELLM_LOG'] = 'DEBUG'
os.environ["OPENAI_API_BASE"] = "http://172.16.33.66:9997/v1"
os.environ["OPENAI_API_KEY"] = "NONE"

openai_response = litellm.completion(
  model="gpt-4-32k",
  messages=[
    {"role": "system", "content": "您是人工智能助手。"}, 
    {"role": "user", "content": "介绍一下自己。"}
  ]
)

print(openai_response)
```
