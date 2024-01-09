---
layout: post
title:  "PrivateGPT"
date:   2024-01-05 08:00:00 +0800
categories: PrivateGPT
tags: [PrivateGPT, python]
---

## [PrivateGPT](https://github.com/imartinez/privateGPT)

### 安装 Python 3.11
```shell
brew install python@3.11
```

### 安装
```shell
git clone https://github.com/imartinez/privateGPT && cd privateGPT && \
python3.11 -m venv .venv && source .venv/bin/activate && \
pip install --upgrade pip poetry && poetry install --with ui,local && ./scripts/setup

# Launch the privateGPT API server **and** the gradio UI
poetry run python3.11 -m private_gpt

# In another terminal, create a new browser window on your private GPT!
open http://127.0.0.1:8001/
```

- [Quickstart](https://docs.privategpt.dev/overview/welcome/quickstart)

安装失败 😭

## 参考资料
- [LocalGPT](https://github.com/PromtEngineer/localGPT)
- [PrivateGPT](https://github.com/imartinez/privateGPT)
