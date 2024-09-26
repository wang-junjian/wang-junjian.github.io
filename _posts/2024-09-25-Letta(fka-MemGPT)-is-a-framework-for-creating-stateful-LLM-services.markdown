---
layout: post
title:  "Letta (fka MemGPT) 是用于创建有状态 LLM 服务的框架"
date:   2024-09-25 08:00:00 +0800
categories: Letta MemGPT
tags: [Letta, MemGPT, LLM]
---

- [MemGPT: Towards LLMs as Operating Systems](https://arxiv.org/abs/2310.08560)
- [MemGPT - GitHub](https://github.com/cpacker/MemGPT)
- [Letta Documentation](https://docs.letta.com/)

## [Docker 部署](https://docs.letta.com/install#run-with-docker)

### 克隆代码

```shell
git clone https://github.com/cpacker/MemGPT
```

### 设置环境变量，编辑配置文件 `.env`

- Ollama

```ini
LETTA_LLM_ENDPOINT=http://host.docker.internal:11434
LETTA_LLM_ENDPOINT_TYPE=ollama
LETTA_LLM_MODEL=qwen2.5:7b
LETTA_LLM_CONTEXT_WINDOW=32000
LETTA_EMBEDDING_ENDPOINT=http://host.docker.internal:11434
LETTA_EMBEDDING_ENDPOINT_TYPE=ollama
LETTA_EMBEDDING_MODEL=bge-m3
LETTA_EMBEDDING_DIM=1024
```

- OpenAI

因为各种原因，目前还没有测试成功（LiteLLM, Xinference）

```ini
OPENAI_API_KEY=sk-1234
LETTA_LLM_ENDPOINT=http://host.docker.internal:4000/v1
LETTA_LLM_ENDPOINT_TYPE=openai
LETTA_LLM_MODEL=gpt-4
LETTA_LLM_CONTEXT_WINDOW=32000
LETTA_EMBEDDING_ENDPOINT=http://host.docker.internal:4000/v1
LETTA_EMBEDDING_ENDPOINT_TYPE=openai
LETTA_EMBEDDING_MODEL=bge
LETTA_EMBEDDING_DIM=1024
```

### 编辑文件 `compose.yaml`

如果本地已经使用了 `5432` 端口，可以考虑注释掉。
```yaml
#    ports:
#      - "5432:5432"
```

### 部署

```shell
docker-compose up -d
```


## 使用

### 登录

使用浏览器登录 [http://localhost:8083](http://localhost:8083)

![](/images/2024/Letta(MemGPT)/Agents.png)

### 创建 Agent

![](/images/2024/Letta(MemGPT)/Create-Agent.png)

![](/images/2024/Letta(MemGPT)/Agent-List.png)

**Agent 创建后不能更改`模型`，只能删除后重新创建。**

### 和 Agent 聊天

![](/images/2024/Letta(MemGPT)/Agent-Chat1.png)

![](/images/2024/Letta(MemGPT)/Agent-Chat2.png)
