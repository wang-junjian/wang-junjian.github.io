---
layout: single
title:  "基于 VSCode 使用 Tabby 插件搭建免费的 GitHub Copilot"
date:   2024-01-10 10:00:00 +0800
categories: VSCode Tabby
tags: [GitHubCopilot, VSCode, Tabby, OpenAI, CodeLLM, LLM]
---

## 使用的模型
- 代码生成 `Tabby` 使用的是 `Deepseek Coder 6.7B` 模型。

## 部署服务器端
- [基于 PyCharm 使用 Tabby 和 CodeGPT  插件搭建免费的 GitHub Copilot]({% post_url 2024-01-09-Build-free-GitHub-Copilot-based-on-PyCharm-using-Tabby-and-CodeGPT-plug-ins %})

## 安装 [Visual Studio Code](https://tabby.tabbyml.com/docs/extensions/installation/vscode)

### [Tabby](https://marketplace.visualstudio.com/items?itemName=TabbyML.vscode-tabby) 安装
![](/images/2024/Tabby/VSCode-Tabby-Install.png)

### Tabby 配置

单击状态栏中的 `Tabby` 图标，打开 `Tabby` 配置页面。

#### 参数
- EndPoint: `http://172.16.33.66:8080`

![](/images/2024/Tabby/VSCode-Tabby-Settings.png)

## 使用 Tabby
### 代码生成
![](/images/2024/Tabby/Write-Code.png)
