---
layout: post
title:  "使用 Ollama 构建本地聊天服务"
date:   2023-12-18 08:00:00 +0800
categories: Ollama
tags: [Ollama, OllamaHub, OllamaWebUI, GPT]
---

## [Ollama](https://github.com/jmorganca/ollama)
- [Embedding models](https://ollama.com/blog/embedding-models)

### 部署
- [下载](https://ollama.ai/download)
- 安装
- 运行
```shell
ollama run llama2
```

### 通过 [API](https://github.com/jmorganca/ollama/blob/main/docs/api.md) 访问
```shell
curl http://localhost:11434/api/generate -d '{
  "model": "llama2",
  "prompt": "Why is the sky blue?",
  "stream": false
}'
```

### ollama 帮助
```shell
ollama --help
```
```shell
Large language model runner

Usage:
  ollama [flags]
  ollama [command]

Available Commands:
  serve       Start ollama
  create      Create a model from a Modelfile
  show        Show information for a model
  run         Run a model
  pull        Pull a model from a registry
  push        Push a model to a registry
  list        List models
  cp          Copy a model
  rm          Remove a model
  help        Help about any command

Flags:
  -h, --help      help for ollama
  -v, --version   Show version information

Use "ollama [command] --help" for more information about a command.
```

### [模型库](https://ollama.ai/library)

- Llama 2
```shell
ollama pull llama2
```

- LLaVA: Large Language and Vision Assistant
```shell
ollama pull llava
```

![](/images/2023/Ollama/models.png)

![](/images/2023/Ollama/models-llama2.png)

模型版本化

![](/images/2023/Ollama/models-llama2-tags1.png)

![](/images/2023/Ollama/models-llama2-tags2.png)


### 使用 [Modelfile](https://github.com/jmorganca/ollama/blob/main/docs/modelfile.md) 创建模型

这里我使用了本地的 `GGUF` 模型进行构建。

编辑 `Modelfile` 文件
```dockerfile
From /Users/junjian/.cache/lm-studio/models/TheBloke/Llama-2-7B-chat-GGUF/llama-2-7b-chat.Q4_K_M.gguf

# sets the temperature to 1 [higher is more creative, lower is more coherent]
PARAMETER temperature 1
# sets the context window size to 4096, this controls how many tokens the LLM can use as context to generate the next token
PARAMETER num_ctx 4096

# sets a custom system message to specify the behavior of the chat assistant
SYSTEM You are Mario from super mario bros, acting as an assistant.
```

构建模型
```shell
ollama create llama2-7b-chat -f Modelfile
```

运行模型
```shell
ollama run llama2-7b-chat
```

查看模型
```shell
ollama list                              
NAME                 	ID          	SIZE  	MODIFIED      
llama2-7b-chat:latest	412114524bde	4.1 GB	4 seconds ago
```


## [OllamaHub](https://ollamahub.com/)
Discover, download, and explore Ollama Modelfiles


## [Ollama Web UI](https://github.com/ollama-webui/ollama-webui)

### 部署

- Ollama Web UI
```shell
docker run -d -p 3000:8080 --name ollama-webui \
    --add-host=host.docker.internal:host-gateway \
    --restart always ollama-webui
```

- 使用 Docker Compose 同时部署 Ollama 和 Ollama Web UI
```shell
git clone https://github.com/ollama-webui/ollama-webui
cd ollama-webui

docker-compose up -d --build
```

### 访问 http://localhost:3000

![](/images/2023/Ollama/ollama-web-ui.png)


## 参考资料
- [Ollama Documentation](https://github.com/jmorganca/ollama/tree/main/docs)
- [ollama/examples](https://github.com/jmorganca/ollama/tree/main/examples)
- [Ollama Model File](https://github.com/jmorganca/ollama/blob/main/docs/modelfile.md)
- [Ollama API](https://github.com/jmorganca/ollama/blob/main/docs/api.md)
