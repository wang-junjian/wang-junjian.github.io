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


## 服务端口

- Ollama: 11434
- LiteLLM: 4000
- XInference: 9997
- MindIE: 1025


## models

### Ollama
```shell
curl -s http://localhost:11434/v1/models \
    | jq -r '.data[].id'
```

- `curl -s`: `-s` 选项表示静默模式，不输出进度信息。
- `jq -r`: `-r` 选项表示以原始格式输出，去掉了引号。

### LiteLLM
```shell
curl -s http://localhost:4000/v1/models \
    -H "Authorization: Bearer $LITELLM_API_KEY" \
    | jq -r '.data[].id'
```

在 Bash 中，单引号和双引号的使用有一些重要的区别：

- 单引号 (')
    - 完全字面值：单引号内的内容被视为字面值，不会对其中的任何字符进行扩展或解析。
    - 变量不扩展：在单引号内，变量不会被解析。例如，'$LITELLM_API_KEY' 会被视为字符串 '$LITELLM_API_KEY'，而不是变量的值。
    ```shell
    echo '$LITELLM_API_KEY'  # 输出: $LITELLM_API_KEY
    ```

- 双引号 (")
    - 允许扩展：双引号内的内容会进行解析和扩展。
    - 变量扩展：在双引号内，变量会被解析。例如，"$LITELLM_API_KEY" 会被替换为该变量的值。
    - 特殊字符处理：某些字符（如 $ 和 \）在双引号内需要用反斜杠转义。
    ```shell
    echo "$LITELLM_API_KEY"  # 输出: 变量的实际值(例如: sk-1234)
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

### MindIE
```shell
curl 'http://localhost:1025/v1/chat/completions' \
    -H "Content-Type: application/json" \
    -d '{
        "model": "qwen",
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
- [OpenAI API](https://openai.com/api/)
- [OpenAI Cookbook](https://cookbook.openai.com/)
- [OpenAI API Docs](https://platform.openai.com/docs/quickstart?language-preference=curl)
- [Together AI Docs](https://docs.together.ai/docs/introduction)
- [OpenRouter Docs](https://openrouter.ai/docs/quick-start)
