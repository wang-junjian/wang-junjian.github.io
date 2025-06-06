---
layout: single
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
LETTA_LLM_MODEL=qwen2.5:7b-q6_K
LETTA_LLM_CONTEXT_WINDOW=32000
LETTA_EMBEDDING_ENDPOINT=http://host.docker.internal:11434
LETTA_EMBEDDING_ENDPOINT_TYPE=ollama
LETTA_EMBEDDING_MODEL=bge-m3
LETTA_EMBEDDING_DIM=1024
```

在下载 Ollama 模型时，请确保使用标签！

不要执行 ollama pull dolphin2.2-mistral，而是执行 ollama pull dolphin2.2-mistral:7b-q6_K。

如果您没有指定标签，Ollama 可能会默认使用高度压缩的模型变体（例如 Q4）。我们强烈建议在使用 GGUF 时**不要**使用低于 Q5 的压缩级别（如果可能的话，请坚持使用 Q6 或 Q8）。在我们的测试中，某些模型在 Q6 以下开始变得极不稳定（在与 MemGPT 一起使用时）。

- OpenAI

因为各种原因，目前还没有测试成功（LiteLLM, Xinference），官方有 [vLLM](https://docs.letta.com/models/vllm) 的配置例子，下次试验一下。

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
