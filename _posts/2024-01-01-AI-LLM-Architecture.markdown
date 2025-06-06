---
layout: single
title:  "AI 大模型基础服务架构图"
date:   2024-01-01 10:00:00 +0800
categories: LLM
tags: [LLM, CodeLLM]
---

## 大模型基础服务架构图
![](/images/2024/LLMAIServices/llm-architecture.png)

```html
<center>
<div class="mermaid">
%%{init: {"flowchart": {"htmlLabels": false}} }%%
flowchart TB
  subgraph tool[聊天工具]
    direction TB
    chatgpt-next(ChatGPT Next Web)
    langchain-chatchat(Langchain-Chatchat)
    wechat(chatgpt-on-wechat)
  end
  subgraph business-application[业务应用层]
    direction TB
    app1(发电)
    app2(调度)
    app3(输变电)
    app4(配电)
    app5(用电)
  end
  subgraph llmops[LLMOps]
    direction TB
    fastgpt(FastGPT)
    dify(Dify)
  end
  subgraph openai-api-manager[OpenAI API 管理]
    direction TB
    openai-api(OpenAI API)
    api-key(API KEY)
  end
  subgraph modelmanager[模型  管理]
    openai-api-server(OpenAI API Server)
    subgraph fastchat[FastChat]
      direction TB
      deepseek-llm-7b-chat(deepseek-llm-7b-chat)
      chatglm3-6b(ChatGLM3-6B)
      bge-base-zh(bge-base-zh-v1.5)
    end
  end

  tool-->openai-api-manager
  business-application-->llmops
  llmops-->openai-api-manager
  openai-api-manager-->openai-api-server
  openai-api-server-->fastchat
</div>
```

## 代码大模型基础服务架构图
![](/images/2024/LLMAIServices/codellm-architecture.png)

```html
<center>
<div class="mermaid">
%%{init: {"flowchart": {"htmlLabels": false}} }%%
flowchart TB
  subgraph ide[IDE - 集成开发环境]
    direction TB
    subgraph intellij-idea[IntelliJ IDEA]
      direction TB
      idea-tabby(Tabby)
      idea-codegpt(CodeGPT)
    end
    subgraph pycharm[PyCharm]
      direction TB
      pycharm-tabby(Tabby)
      pycharm-codegpt(CodeGPT)
    end
    subgraph android-studio[Android Studio]
      direction TB
      android-studio-tabby(Tabby)
      android-studio-codegpt(CodeGPT)
    end
    subgraph jetbrains-ide[JetBrains IDE]
      direction TB
      jetbrains-ide-tabby(Tabby)
      jetbrains-ide-codegpt(CodeGPT)
    end
    subgraph vscode[Visual Studio Code]
      direction TB
      vscode-tabby(Tabby)
    end
  end
  subgraph tabby-server[Tabby Server]
    direction TB
    subgraph code-model[模型]
      deepseek-coder-1b(TabbyML/DeepseekCoder-1.3B)
      deepseek-coder-6b(TabbyML/DeepseekCoder-6.7B)
      wizard-coder-3b(TabbyML/WizardCoder-3B)
    end
    subgraph code-repo[代码仓库]
      git1(https://github.com/TabbyML/tabby.git)
      git2(git@github.com:TabbyML/tabby.git)
      file(file:///home/users/repository/tabby)
    end
  end
  subgraph fastchat[FastChat]
    direction TB
    subgraph llm-model[模型]
      deepseek-llm-7b-chat(deepseek-llm-7b-chat)
      chatglm3-6b(ChatGLM3-6B)
      bge-base-zh(bge-base-zh-v1.5)
    end
  end

  vscode-tabby-->tabby-server
  idea-tabby-->tabby-server
  pycharm-tabby-->tabby-server
  android-studio-tabby-->tabby-server
  jetbrains-ide-tabby-->tabby-server
  idea-codegpt-->fastchat
  pycharm-codegpt-->fastchat
  android-studio-codegpt-->fastchat
  jetbrains-ide-codegpt-->fastchat
</div>
```
