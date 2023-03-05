---
layout: post
title:  "命令chatgpt"
date:   2023-03-05 00:00:00 +0800
categories: Command
tags: [ChatGPT]
---

## [ChatGPT Wrapper](https://github.com/mmabrouk/chatgpt-wrapper)
ChatGPT Wrapper is an open-source unofficial Power CLI, Python API and Flask API that lets you interact programmatically with ChatGPT.

## 安装
### 必要条件
* macOS
```shell
brew install moreutils
```

* Ubuntu
```shell
sudo apt install moreutils
```

### 创建虚拟环境
```shell
mkdir chatgpt-wrapper && cd chatgpt-wrapper

python -m venv env
source ./env/bin/activate
```

### 使用 GitHub 安装最新版本
```shell
pip install --upgrade pip
pip install git+https://github.com/mmabrouk/chatgpt-wrapper
```

### 在 [Playwright](https://playwright.dev/python/) 中安装浏览器，默认为 firefox。
```shell
playwright install
```

### ChatGPT 安装
以安装模式启动程序。 这将打开一个浏览器窗口。 在浏览器窗口中登录 ChatGPT，然后停止该程序。

```shell
chatgpt install
```
```
Install mode: Log in to ChatGPT in the browser that pops up, and click
through all the dialogs, etc. Once that is achieved, exit and restart
this program without the 'install' parameter.


    Provide a prompt for ChatGPT, or type /help or ? to list commands.                                                        

1> /quit
GoodBye!
```

## 使用
### 一次性模式
```shell
chatgpt hello   
```
```
Hello! How can I assist you today?
```

### 交互模式
```shell
chatgpt 

    Provide a prompt for ChatGPT, or type /help or ? to list commands.                                                        

```
```
1> /ask hello

Hello! How can I assist you today?

2> /quit
GoodBye!
```

### Python
```py
from chatgpt_wrapper import ChatGPT

bot = ChatGPT()
response = bot.ask("Hello, world!")
print(response)  # prints the response from chatGPT
```

## 参考资料
* [ChatGPT Wrapper](https://github.com/mmabrouk/chatgpt-wrapper)
* [Playwright](https://playwright.dev/python/)
* [Using ChatGPT in Python](https://medium.com/geekculture/using-chatgpt-in-python-eeaed9847e72)
* [OpenAI Python Library](https://github.com/openai/openai-python)
