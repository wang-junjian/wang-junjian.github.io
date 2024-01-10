---
layout: post
title:  "基于 Intelli JIDEA 使用 Tabby 和 CodeGPT 插件搭建免费的 GitHub Copilot"
date:   2024-01-10 08:00:00 +0800
categories: GitHubCopilot
tags: [GitHubCopilot, IntelliJIDEA, Tabby, CodeGPT, OpenAI, CodeLLM, LLM]
---

## 使用的模型
- 代码生成 `Tabby` 使用的是 `Deepseek Coder 6.7B` 模型。
- AI 聊天 `CodeGPT` 使用的是 `ChatGLM3-6B` 模型。这个后面考虑使用 `Deepseek Coder 6.7B` 来替换。

## 部署服务器端
- [基于 PyCharm 使用 Tabby 和 CodeGPT  插件搭建免费的 GitHub Copilot]({% post_url 2024-01-09-Build-free-GitHub-Copilot-based-on-PyCharm-using-Tabby-and-CodeGPT-plug-ins %})

## 安装 [InteliJ IDEA](https://www.jetbrains.com/zh-cn/idea/)

## 安装插件
### 插件
- 代码生成：[Tabby](https://plugins.jetbrains.com/plugin/22379-tabby/)
- AI 聊天：[CodeGPT](https://plugins.jetbrains.com/plugin/21056-codegpt/)

### 安装

打开 `IntelliJ IDEA`，选择 `Settings` 菜单，选择 `Plugins`，搜索 `Tabby` 和 `CodeGPT`，点击 `Install` 安装。

- Tabby
![](/images/2024/Tabby/IDEA-Tabby-Install.png)

- CodeGPT
![](/images/2024/IDEA-CodeGPT/CodeGPT-Install.png)

## 配置插件
### Tabby
![](/images/2024/PyCharm-Tabby-CodeGPT/Tabby-Settings.png)

### CodeGPT
![](/images/2024/PyCharm-Tabby-CodeGPT/CodeGPT-Settings.png)

## 使用插件
### AI 聊天
![](/images/2024/IDEA-CodeGPT/Write-Code.png)

![](/images/2024/IDEA-CodeGPT/Write-Test.png)

### 代码生成
![](/images/2024/Tabby/IDEA-Tabby-Code-Completions.png)
