---
layout: post
title:  "OpenAI API Compatibility"
date:   2024-10-07 10:00:00 +0800
categories: OpenAI-API LLM
tags: [OpenAI API, LLM, curl]
---

## 设置 API Key
```shell
export LITELLM_API_KEY=sk-1234
```


## models

### Ollama
```shell
curl -s http://localhost:11434/v1/models \
    | jq -r '.data[].id'
```

### LiteLLM
```shell
curl -s http://localhost:4000/v1/models \
    -H "Authorization: Bearer $LITELLM_API_KEY" \
    | jq -r '.data[].id'
```

### XInference
```shell
curl -s http://localhost:9997/v1/models \
    | jq -r '.data[].id'
```


## Completions

### Ollama
```shell
curl 'http://localhost:11434/v1/completions' \
    -H "Content-Type: application/json" \
    -d '{
        "model": "gpt-3.5-turbo",
        "prompt": "你是谁？"
    }'
```

### LiteLLM
```shell
curl 'http://localhost:4000/v1/completions' \
    -H "Authorization: Bearer $LITELLM_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{
        "model": "gpt-3.5-turbo",
        "prompt": "你是谁？"
    }'
```

### XInference
```shell
curl 'http://localhost:9997/v1/completions' \
    -H "Content-Type: application/json" \
    -d '{
        "model": "gpt-3.5-turbo",
        "prompt": "你是谁？"
    }'
```


## Chat Completions

### Ollama
```shell
curl 'http://localhost:11434/v1/chat/completions' \
    -H "Content-Type: application/json" \
    -d '{
        "model": "gpt-3.5-turbo",
        "messages": [ 
            { "role": "system", "content": "你是位人工智能专家。" }, 
            { "role": "user", "content": "解释人工智能" } 
        ]
    }'
```

### LiteLLM
```shell
curl 'http://localhost:4000/v1/chat/completions' \
    -H "Authorization: Bearer $LITELLM_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{
        "model": "gpt-3.5-turbo",
        "messages": [ 
            { "role": "system", "content": "你是位人工智能专家。" }, 
            { "role": "user", "content": "解释人工智能" } 
        ]
    }'
```

### XInference
```shell
curl 'http://localhost:9997/v1/chat/completions' \
    -H "Content-Type: application/json" \
    -d '{
        "model": "gpt-3.5-turbo",
        "messages": [ 
            { "role": "system", "content": "你是位人工智能专家。" }, 
            { "role": "user", "content": "解释人工智能" } 
        ]
    }'
```


## Embeddings

### Ollama
```shell
curl http://localhost:11434/v1/embeddings \
    -H "Content-Type: application/json" \
    -d '{
        "model": "bge-m3",
        "input": "Embedding text..."
    }'
```

### LiteLLM
```shell
curl http://localhost:4000/v1/embeddings \
    -H "Authorization: Bearer $LITELLM_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{
        "model": "bge-m3",
        "input": "Embedding text..."
    }'
```

### XInference
```shell
curl http://localhost:9997/v1/embeddings \
    -H "Content-Type: application/json" \
    -d '{
        "model": "bge-m3",
        "input": "Embedding text..."
    }'
```


## 参考资料
- [OpenAI API Docs](https://platform.openai.com/docs/quickstart?language-preference=curl)
- [Together AI Docs](https://docs.together.ai/docs/introduction)
- [OpenRouter Docs](https://openrouter.ai/docs/quick-start)
