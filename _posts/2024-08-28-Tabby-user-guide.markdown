---
layout: post
title:  "Tabby 使用指南"
date:   2024-08-28 08:00:00 +0800
categories: Tabby AICodingAssistant
tags: [Tabby, VSCode, ContextProvider, CodeSearch, CodeChat]
---

## Tabby

### 安装 Tabby (macOS)

```shell
brew upgrade tabbyml/tabby/tabby
```

更新

```shell
brew upgrade tabbyml/tabby/tabby
```

### 安装 Tabby VSCode 扩展
- [Tabby VSCode Extension](https://marketplace.visualstudio.com/items?itemName=TabbyML.vscode-tabby)

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

📄 Version 0.15.0
🚀 Listening at 0.0.0.0:8080


  JWT secret is not set

  Tabby server will generate a one-time (non-persisted) JWT secret for the current process.
  Please set the TABBY_WEBSERVER_JWT_TOKEN_SECRET environment variable for production usage.
```

#### 配置文件指定参数

编辑配置文件：~/.tabby/config.toml

```ini
[model.completion.local]
model_id = "Codestral-22B"

[model.chat.local]
model_id = "Codestral-22B"

[model.embedding.local]
model_id = "Nomic-Embed-Text"
```

- [Model Configuration](https://tabby.tabbyml.com/docs/administration/model/)
- [Models Registry](https://tabby.tabbyml.com/docs/models/)

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


## VSCode（Tabby）

### 聊天

![](/images/2024/Tabby2/vscode-tabby.png)

### 使用 RAG

![](/images/2024/Tabby2/vscode-tabby-chat.png)

这里是我选择了 `Calculator`，聊天的时候才把 `calculator.rs` 文件作为上下文提供的。还没测试出来如何更好的检索到 `Context Providers` 的内容。

### 配置

![](/images/2024/Tabby2/vscode-tabby-settings.png)


## 查看指标

使用后，查看指标的统计，主要统计的是自动补全。

![](/images/2024/Tabby2/tabby-server-home.png)
