---
layout: post
title:  "LiteLLM: [Python SDK] [Proxy Server (LLM Gateway)]"
date:   2024-09-13 08:00:00 +0800
categories: LiteLLM AIGateway
tags: [LiteLLM, AIGateway, Langfuse, LLM]
---

## LiteLLM Proxy Server (LLM Gateway)
- [Hosted LiteLLM Proxy](https://docs.litellm.ai/docs/hosted)
- [Proxy Config.yaml](https://docs.litellm.ai/docs/proxy/configs)

### 编辑配置文件：`config.yaml`

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
- [Proxy Config.yaml](https://docs.litellm.ai/docs/proxy/configs)

### Docker 部署
#### NO DB

```shell
docker run --name litellm \
    -v $(pwd)/litellm_config.yaml:/app/config.yaml \
    -p 4000:4000 \
    ghcr.io/berriai/litellm:main-stable \
    --config /app/config.yaml \
    --detailed_debug
```

#### DB
- [Proxy 密钥管理 - Virtual Keys](https://docs.litellm.ai/docs/proxy/virtual_keys)

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

### LiteLLM Proxy Server UI
登录 [http://localhost:4000/ui](http://localhost:4000/ui) 进入 LiteLLM Proxy Server UI。

#### 模型列表
![](/images/2024/LiteLLM/models.png)

#### 添加模型

![](/images/2024/LiteLLM/add-model.png)
- `Provider`: OpenAI-Compatible Endpoints (Together AI, etc.)
- `Public Model Name`: gpt-4
- `LiteLLM Model Name(s)`: gpt-4-32k
- `API Key`: NONE
- `API Base`: http://172.16.33.66:9997/v1
- `LiteLLM Params`: Pass JSON of litellm supported params [litellm.completion() call](https://docs.litellm.ai/docs/completion/input)

#### 模型分析

![](/images/2024/LiteLLM/model-analytics.png)


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


## LiteLLM & Langfuse Integration（集成）
- [Langfuse - Logging LLM Input/Output](https://litellm.vercel.app/docs/observability/langfuse_integration)
- [Monitoring with Langfuse](https://docs.openwebui.com/tutorial/langfuse#editing-the-litellm-configuration-file)
- [LiteLLM - Logging](https://docs.litellm.ai/docs/proxy/logging)

### LiteLLM Proxy Server (LLM Gateway)
#### Langfuse 部署

编辑 `docker-compose.yml`

```yaml
networks:
  shared-network:
    name: shared-network

services:
  langfuse-server:
    image: langfuse/langfuse:2
    depends_on:
      db:
        condition: service_healthy
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://postgres:postgres@db:5432/postgres
      - NEXTAUTH_SECRET=mysecret
      - SALT=mysalt
      - ENCRYPTION_KEY=0000000000000000000000000000000000000000000000000000000000000000 # generate via `openssl rand -hex 32`
      - NEXTAUTH_URL=http://localhost:3000
      - TELEMETRY_ENABLED=${TELEMETRY_ENABLED:-true}
      - LANGFUSE_ENABLE_EXPERIMENTAL_FEATURES=${LANGFUSE_ENABLE_EXPERIMENTAL_FEATURES:-false}
    networks:
      - shared-network

  db:
    image: postgres
    restart: always
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 3s
      timeout: 3s
      retries: 10
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
      - POSTGRES_DB=postgres
    ports:
      - 5432:5432
    volumes:
      - database_data:/var/lib/postgresql/data
    networks:
      - shared-network

volumes:
  database_data:
    driver: local
```
- 创建共享网络 `shared-network`
- 设置每个服务的网络为 `shared-network`

启动服务
```shell
docker-compose up -d
```

#### LiteLLM 部署

编辑配置文件 `config.yaml`

```yaml
model_list:
  - model_name: gpt-4
    litellm_params:
      model: openai/gpt-4-32k
      api_base: http://172.16.33.66:9997/v1
      api_key: NONE
  - model_name: bge
    litellm_params:
      model: openai/bge-m3
      api_base: http://172.16.33.66:9997/v1
      api_key: NONE
general_settings: 
  master_key: sk-1234 # [OPTIONAL] Only use this if you to require all calls to contain this key (Authorization: Bearer sk-1234)
litellm_settings:
  success_callback: ["langfuse"]
  failure_callback: ["langfuse"]
```

编辑 `docker-compose.yml`

```yaml
version: "3.11"

networks:
  shared-network:
    name: shared-network

services:
  litellm:
    build:
      context: .
      args:
        target: runtime
    image: ghcr.io/berriai/litellm:main-stable
    volumes:
      - ./config.yaml:/etc/litellm/config.yaml
    ports:
      - "4000:4000" # Map the container port to the host, change the host port if necessary
    command:
      - '--config=/etc/litellm/config.yaml'
      - '--debug'
    environment:
        DATABASE_URL: "postgresql://llmproxy:dbpassword9090@db:5434/litellm"
        STORE_MODEL_IN_DB: "True" # allows adding models to proxy via UI
        LANGFUSE_PUBLIC_KEY: "pk-lf-fd5d8fba-5134-4037-884d-d6780894a65a"
        LANGFUSE_SECRET_KEY: "sk-lf-10122a92-da11-4423-b3f7-ad10e5f268fc"
        LANGFUSE_HOST: "http://langfuse-server:3000"
    env_file:
      - .env # Load local .env file
    networks:
      - shared-network

  db:
    image: postgres
    restart: always
    environment:
      PGPORT: 5434
      POSTGRES_DB: litellm
      POSTGRES_USER: llmproxy
      POSTGRES_PASSWORD: dbpassword9090
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -d litellm -U llmproxy"]
      interval: 1s
      timeout: 5s
      retries: 10
    networks:
      - shared-network
  
  prometheus:
    image: prom/prometheus
    volumes:
      - prometheus_data:/prometheus
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
    ports:
      - "9090:9090"
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
      - '--storage.tsdb.retention.time=15d'
    restart: always
    networks:
      - shared-network

volumes:
  prometheus_data:
    driver: local
```
- 创建共享网络 `shared-network`
- 设置每个服务的网络为 `shared-network`
- services.litellm.environment
    - 设置 `LANGFUSE_HOST` 为 `http://langfuse-server:3000`
    - 设置 `LANGFUSE_PUBLIC_KEY` 和 `LANGFUSE_SECRET_KEY` 为 Langfuse 的公钥和私钥
    - volumes
        - 挂载 `config.yaml` 到 `/etc/litellm/config.yaml`
    - command
        - 开启调试模式 `--debug`
        - 指定配置文件路径 `--config=/etc/litellm/config.yaml`
- db.environment
    - 修改 postgre 数据库的默认端口 `PGPORT: 5434`，避免与 Langfuse 的数据库端口冲突🛑。

启动服务
```shell
docker-compose up -d
```

**可以运行上面的`模型测试`（curl 命令）**

### LiteLLM Python SDK

编辑 `main.py`
```python
import os
import litellm
 

os.environ["LANGFUSE_HOST"]="http://localhost:3000"
os.environ["LANGFUSE_PUBLIC_KEY"] = "pk-lf-fd5d8fba-5134-4037-884d-d6780894a65a"
os.environ["LANGFUSE_SECRET_KEY"] = "sk-lf-10122a92-da11-4423-b3f7-ad10e5f268fc"
 
os.environ["OPENAI_API_BASE"] = "http://172.16.33.66:9997/v1"
os.environ["OPENAI_API_KEY"] = "NONE"

os.environ['LITELLM_LOG'] = 'DEBUG'

litellm.success_callback = ["langfuse"]
litellm.failure_callback = ["langfuse"]

openai_response = litellm.completion(
  model="gpt-4-32k",
  messages=[
    {"role": "system", "content": "您是人工智能助手。"},
    {"role": "user", "content": "介绍一下自己。"}
  ]
)

print(openai_response)
```

运行 `main.py`

### 查看 Langfuse Dashboard
登录 [http://localhost:3000](http://localhost:3000) 进入 Langfuse Dashboard。

![](/images/2024/Langfuse/Langfuse-Dashboard1.png)

![](/images/2024/Langfuse/Langfuse-Dashboard2.png)


## 参考资料
- [LiteLLM Cookbook](https://github.com/BerriAI/litellm/tree/main/cookbook)
- [PostgreSQL 9.4.4 中文手册 - 环境变量](http://www.postgres.cn/docs/9.4/libpq-envars.html)
