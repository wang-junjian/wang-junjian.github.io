---
layout: post
title:  "Tabby 使用指南"
date:   2024-08-28 08:00:00 +0800
categories: Tabby AICodingAssistant
tags: [Tabby, VSCode, ContextProvider, CodeSearch, CodeChat]
---

## Tabby
- [Demo](https://demo.tabbyml.com/)
- [Blog](https://tabby.tabbyml.com/blog/)

### 安装 Tabby (macOS)

```shell
brew install tabbyml/tabby/tabby
```

更新

```shell
brew upgrade tabbyml/tabby/tabby
```

### 安装 Tabby VSCode 扩展
- [Tabby VSCode Extension](https://marketplace.visualstudio.com/items?itemName=TabbyML.vscode-tabby)

### 模型
- [Models Registry](https://tabby.tabbyml.com/docs/models/)

#### Codestral 的优点

与其他编码 LLM 相比，Codestral 的独特之处在于其单一模型同时支持 `指令跟随` 和 `中间填充` 兼容性。这是通过在两个数据集上同时微调基础模型实现的。这种 `双重微调策略` 使同一个模型在 `代码补全` 和 `对话任务` 中都能表现出色，大大简化了模型部署堆栈。

此外，Codestral 在包含 80 多种编程语言的多样化数据集上进行训练，确保了开发人员在使用各种语言时的高质量体验。

- [Introducing the Codestral Integration in Tabby](https://tabby.tabbyml.com/blog/2024/07/09/tabby-codestral/)

### 运行 Tabby Server

#### 命令行指定参数

```shell
tabby serve --device metal --model Codestral-22B --chat-model Codestral-22B
```
```
████████╗ █████╗ ██████╗ ██████╗ ██╗   ██╗
╚══██╔══╝██╔══██╗██╔══██╗██╔══██╗╚██╗ ██╔╝
   ██║   ███████║██████╔╝██████╔╝ ╚████╔╝ 
   ██║   ██╔══██║██╔══██╗██╔══██╗  ╚██╔╝  
   ██║   ██║  ██║██████╔╝██████╔╝   ██║   
   ╚═╝   ╚═╝  ╚═╝╚═════╝ ╚═════╝    ╚═╝   

📄 Version 0.17.0
🚀 Listening at 0.0.0.0:8080


  JWT secret is not set

  Tabby server will generate a one-time (non-persisted) JWT secret for the current process.
  Please set the TABBY_WEBSERVER_JWT_TOKEN_SECRET environment variable for production usage.
```

#### 配置文件（~/.tabby/config.toml）指定参数

##### [Local](https://tabby.tabbyml.com/docs/administration/model/)

```ini
[model.completion.local]
model_id = "Codestral-22B"

[model.chat.local]
model_id = "Codestral-22B"

[model.embedding.local]
model_id = "Nomic-Embed-Text"
```

##### [Ollama](https://tabby.tabbyml.com/docs/references/models-http-api/ollama/)

```ini
# Completion model
[model.completion.http]
kind = "ollama/completion"
model_name = "qwen2.5-coder:7b"
api_endpoint = "http://localhost:11434"
prompt_template = "<PRE> {prefix} <SUF>{suffix} <MID>"  # Example prompt template for the odeLlama model series.

# Chat model
[model.chat.http]
kind = "openai/chat"
model_name = "qwen2.5-coder:7b"
api_endpoint = "http://localhost:11434/v1"

# Embedding model
[model.embedding.http]
kind = "ollama/embedding"
model_name = "nomic-embed-text"
api_endpoint = "http://localhost:11434"
```

##### [OpenAI](https://tabby.tabbyml.com/docs/references/models-http-api/openai/)

- LiteLLM

```ini
# Completion model
[model.completion.http]
kind = "openai/completion"
model_name = "gpt-4"
api_endpoint = "http://127.0.0.1:4000/v1"
api_key = "sk-1234"

# Chat model
[model.chat.http]
kind = "openai/chat"
model_name = "gpt-4"
api_endpoint = "http://127.0.0.1:4000/v1"
api_key = "sk-1234"

# Embedding model
[model.embedding.http]
kind = "openai/embedding"
model_name = "bge-m3"
api_endpoint = "http://127.0.0.1:4000/v1"
api_key = "sk-1234"
```

- XInference

```ini
# Completion model
[model.completion.http]
kind = "openai/completion"
model_name = "gpt-4-32k"
api_endpoint = "http://172.16.33.66:9997/v1"
api_key = "NONE"

# Chat model
[model.chat.http]
kind = "openai/chat"
model_name = "gpt-4-32k"
api_endpoint = "http://172.16.33.66:9997/v1"
api_key = "NONE"

# Embedding model
[model.embedding.http]
kind = "openai/embedding"
model_name = "bge-m3"
api_endpoint = "http://172.16.33.66:9997/v1"
api_key = "NONE"
```

- [OpenAI compatible API #1766](https://github.com/TabbyML/tabby/issues/1766)
- [How to setup local http api_endpoint #2868](https://github.com/TabbyML/tabby/discussions/2868)

运行 `tabby serve`

```shell
tabby serve --device metal
```

### 配置 Tabby Server

打开浏览器，输入：[http://127.0.0.1:8080/](http://127.0.0.1:8080/)，进入 Tabby Server 的配置页面。

![](/images/2024/Tabby2/tabby-server-1-welcome.png)

![](/images/2024/Tabby2/tabby-server-2-create-admin-account.png)

![](/images/2024/Tabby2/tabby-server-3-congratulations.png)

![](/images/2024/Tabby2/tabby-server-4-home.png)

### Context Providers
#### [Git](http://127.0.0.1:8080/settings/providers/git)

![](/images/2024/Tabby2/Tabby-Context-Providers-Git.png)

### [Code Browser](http://127.0.0.1:8080/files)

#### Repositories

![](/images/2024/Tabby2/code-browser.png)

#### 代码搜索

![](/images/2024/Tabby2/tabby-source-code-search.png)

#### 代码聊天

![](/images/2024/Tabby2/code-browser-tabby-chat.png)

### 聊天

![](/images/2024/Tabby2/tabby-server-chat.png)

![](/images/2024/Tabby2/tabby-server-chat-rag.png)

## VSCode（Tabby）

### 聊天

![](/images/2024/Tabby2/vscode-tabby-chat.png)

### 使用 RAG

![](/images/2024/Tabby2/vscode-tabby.png)

这里是我选择了 `Calculator`，聊天的时候才把 `calculator.rs` 文件作为上下文提供的。还没测试出来如何更好的检索到 `Context Providers` 的内容。

### 配置

![](/images/2024/Tabby2/vscode-tabby-settings.png)


## 查看指标

使用后，查看指标的统计，主要统计的是 `自动补全`。

![](/images/2024/Tabby2/tabby-server-home.png)
