---
layout: post
title:  "基于 PyCharm 使用 Tabby 和 CodeGPT  插件搭建免费的 GitHub Copilot"
date:   2024-01-09 08:00:00 +0800
categories: GitHubCopilot
tags: [GitHubCopilot, PyCharm, Tabby, CodeGPT, FastChat, OpenAI, CodeLLM, LLM]
---

## 部署服务器端
### Tabby 服务
```shell
docker run -d --runtime nvidia --name tabby -p 8080:8080 \
  -e TABBY_DOWNLOAD_HOST=modelscope.cn \
  -e NVIDIA_VISIBLE_DEVICES=3 \
  -e RUST_BACKTRACE=1 \
  -v `pwd`/.tabby:/data tabbyml/tabby \
  serve --model TabbyML/DeepseekCoder-6.7B  --device cuda
```

### OpaneAI 服务

- 启动服务 `Controller`
```shell
python -m fastchat.serve.controller
```

- 启动服务 `Model Worker`
```shell
python -m fastchat.serve.model_worker \
  --model-path THUDM/chatglm3-6b --port 21002 \
  --worker-address http://localhost:21002 \
  --model-names chatglm3-6b,gpt-3.5-turbo
```

- 启动服务 `OpenAI API Server`
```shell
python -m fastchat.serve.openai_api_server --port 8000
```

## 安装 [PyCharm](https://www.jetbrains.com/pycharm/download/)

## 安装插件
### 插件
- 代码生成：[Tabby](https://plugins.jetbrains.com/plugin/22379-tabby/)
- AI 聊天：[CodeGPT](https://plugins.jetbrains.com/plugin/21056-codegpt/)

### 安装方法一
使用 PyCharm 安装插件，发现找不到插件，需要手动下载插件安装包，然后通过 PyCharm 安装本地插件。

![](/images/2024/PyCharm-Tabby-CodeGPT/Plugins-Marketplace-Settings.png)

![](/images/2024/PyCharm-Tabby-CodeGPT/Install-Plugin-from-Disk.png)

### 安装方法二
如果您打开 PyCharm IDE 后，然后到插件市场找到插件，可以看到 `Install to PyCharm` 按钮，点击后会自动下载并安装插件。

![](/images/2024/PyCharm-Tabby-CodeGPT/Plugins-Marketplace-Tabby.png)

![](/images/2024/PyCharm-Tabby-CodeGPT/Plugins-Marketplace-CodeGPT.png)

## 配置插件
### Tabby
![](/images/2024/PyCharm-Tabby-CodeGPT/Tabby-Settings.png)

### CodeGPT
![](/images/2024/PyCharm-Tabby-CodeGPT/CodeGPT-Settings.png)

## 使用插件
### AI 聊天
![](../images/2024/PyCharm-Tabby-CodeGPT/AI-Chat-CodeGPT.png)

### 代码生成
![](/images/2024/PyCharm-Tabby-CodeGPT/Code-Completions-Tabby.png)


## 参考资料
- [10 Free GitHub Copilot Alternatives for VS Code 2023](https://bito.ai/blog/free-github-copilot-alternatives-for-vs-code/)
- [CodeGPT](https://github.com/carlrobertoh/CodeGPT?tab=readme-ov-file)
- [Tabby](https://github.com/TabbyML/tabby)
- [PyCharm](https://www.jetbrains.com/pycharm/)
- [Flows.network: 用Rust编写一个LLM应用](https://zhuanlan.zhihu.com/p/667494969)
- [flows.network](https://flows.network/)
- [WasmEdge](https://www.zhihu.com/people/wasmedge)