---
layout: post
title:  "构建本地 AI 技术栈"
date:   2025-03-01 10:00:00 +0800
categories: AIStack
tags: [AIStack, LangFuse, LiteLLM, Chatbox, LLM]
---

## 构建环境

### 选择 Python 版本

[Python Releases](https://www.python.org/downloads/)

### 安装 LiteLLM + LangFuse

```bash
conda create -n litellm python==3.12.9 -y
conda activate litellm                     

pip install "litellm[proxy]" langfuse openai
```

- [Cookbook: LiteLLM (Proxy) + Langfuse OpenAI Integration](https://langfuse.com/guides/cookbook/integration_litellm_proxy)


## LangFuse

### 部署（Docker）

```bash
git clone https://github.com/langfuse/langfuse.git
cd langfuse

docker compose up
```
### 注册用户

浏览器访问 [http://localhost:3000/](http://localhost:3000/)，单击 [Sign up](http://localhost:3000/auth/sign-up) 注册一个新账户。

### 创建组织和工程

![](/images/2025/1/New-Organization.png)

![](/images/2025/1/Project-Settings.png)

### API Keys

![](/images/2025/1/API-Keys.png)


## LiteLLM

### 克隆 LiteLLM（可选）
```bash
git clone https://github.com/BerriAI/litellm
cd litellm
```

### 编辑配置 litellm_config.yaml

```yaml
# 模型列表
model_list:
  ## 语言模型
  - model_name: gpt-4
    litellm_params:
      model: ollama/qwen2.5:7b
  ## 视觉模型
  - model_name: gpt-4o
    litellm_params:
      model: ollama/llama3.2-vision
  ## 代码模型
  - model_name: coder
    litellm_params:
      model: ollama/qwen2.5-coder:7b
  ## 推理模型
  - model_name: deepseek-r1
    litellm_params:
      model: ollama/deepseek-r1
  ## 嵌入模型
  - model_name: bge-m3
    litellm_params:
      model: ollama/bge-m3
litellm_settings:
  success_callback: ["langfuse"]
  failure_callback: ["langfuse"]
  drop_params: true
```

### 配置 LangFuse 环境变量 

```bash
export LANGFUSE_PUBLIC_KEY="pk-lf-12fd1222-1d49-462e-9440-43d461215b85"
export LANGFUSE_SECRET_KEY="sk-lf-397f95cb-83b5-463b-89f1-de5a505ed9a7"
export LANGFUSE_HOST="http://localhost:3000/"
```

⚠️ 未配置 `LANGFUSE_PUBLIC_KEY` 时，会提示：

```bash
Langfuse client is disabled since no public_key was provided as a parameter or environment variable 'LANGFUSE_PUBLIC_KEY'. See our docs: https://langfuse.com/docs/sdk/python/low-level-sdk#initialize-client
```

### 启动 LiteLLM

```bash
litellm --config litellm_config.yaml
```


## AI 客户端

### [Chatbox](https://chatboxai.app/zh)

![](/images/2025/1/Chatbox-Setting.png)


## FAQ

### 配置 litellm_config.yaml（drop_params: true）

```yaml
litellm_settings:
  drop_params: true
```

❌ LiteLLM Proxy:ERROR: proxy_server.py:3714 - litellm.proxy.proxy_server.chat_completion(): Exception occured - litellm.UnsupportedParamsError: ollama does not support parameters: {'presence_penalty': 0}, for model=deepseek-r1. To drop these, set `litellm.drop_params=True` or for proxy

```bash
		INFO:     127.0.0.1:54370 - "POST /v1/chat/completions HTTP/1.1" 200 OK
13:18:35 - LiteLLM Proxy:ERROR: proxy_server.py:3714 - litellm.proxy.proxy_server.chat_completion(): Exception occured - litellm.UnsupportedParamsError: ollama does not support parameters: {'presence_penalty': 0}, for model=deepseek-r1. To drop these, set `litellm.drop_params=True` or for proxy:

`litellm_settings:
 drop_params: true`
. Received Model Group=deepseek-r1
Available Model Group Fallbacks=None LiteLLM Retried: 1 times, LiteLLM Max Retries: 2
Traceback (most recent call last):
  File "/opt/miniconda/envs/litellm/lib/python3.12/site-packages/litellm/proxy/proxy_server.py", line 3601, in chat_completion
    responses = await llm_responses
                ^^^^^^^^^^^^^^^^^^^
  File "/opt/miniconda/envs/litellm/lib/python3.12/site-packages/litellm/router.py", line 907, in acompletion
    raise e
  File "/opt/miniconda/envs/litellm/lib/python3.12/site-packages/litellm/router.py", line 883, in acompletion
    response = await self.async_function_with_fallbacks(**kwargs)
               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/opt/miniconda/envs/litellm/lib/python3.12/site-packages/litellm/router.py", line 3079, in async_function_with_fallbacks
    raise original_exception
  File "/opt/miniconda/envs/litellm/lib/python3.12/site-packages/litellm/router.py", line 2893, in async_function_with_fallbacks
    response = await self.async_function_with_retries(*args, **kwargs)
               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/opt/miniconda/envs/litellm/lib/python3.12/site-packages/litellm/router.py", line 3269, in async_function_with_retries
    raise original_exception
  File "/opt/miniconda/envs/litellm/lib/python3.12/site-packages/litellm/router.py", line 3162, in async_function_with_retries
    response = await self.make_call(original_function, *args, **kwargs)
               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/opt/miniconda/envs/litellm/lib/python3.12/site-packages/litellm/router.py", line 3278, in make_call
    response = await response
               ^^^^^^^^^^^^^^
  File "/opt/miniconda/envs/litellm/lib/python3.12/site-packages/litellm/router.py", line 1045, in _acompletion
    raise e
  File "/opt/miniconda/envs/litellm/lib/python3.12/site-packages/litellm/router.py", line 1004, in _acompletion
    response = await _response
               ^^^^^^^^^^^^^^^
  File "/opt/miniconda/envs/litellm/lib/python3.12/site-packages/litellm/utils.py", line 1397, in wrapper_async
    raise e
  File "/opt/miniconda/envs/litellm/lib/python3.12/site-packages/litellm/utils.py", line 1256, in wrapper_async
    result = await original_function(*args, **kwargs)
             ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/opt/miniconda/envs/litellm/lib/python3.12/site-packages/litellm/main.py", line 489, in acompletion
    raise exception_type(
  File "/opt/miniconda/envs/litellm/lib/python3.12/site-packages/litellm/main.py", line 462, in acompletion
    init_response = await loop.run_in_executor(None, func_with_context)
                    ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/opt/miniconda/envs/litellm/lib/python3.12/concurrent/futures/thread.py", line 59, in run
    result = self.fn(*self.args, **self.kwargs)
             ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/opt/miniconda/envs/litellm/lib/python3.12/site-packages/litellm/utils.py", line 931, in wrapper
    result = original_function(*args, **kwargs)
             ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/opt/miniconda/envs/litellm/lib/python3.12/site-packages/litellm/main.py", line 3090, in completion
    raise exception_type(
  File "/opt/miniconda/envs/litellm/lib/python3.12/site-packages/litellm/main.py", line 1081, in completion
    optional_params = get_optional_params(
                      ^^^^^^^^^^^^^^^^^^^^
  File "/opt/miniconda/envs/litellm/lib/python3.12/site-packages/litellm/utils.py", line 2997, in get_optional_params
    _check_valid_arg(supported_params=supported_params or [])
  File "/opt/miniconda/envs/litellm/lib/python3.12/site-packages/litellm/utils.py", line 2985, in _check_valid_arg
    raise UnsupportedParamsError(
litellm.exceptions.UnsupportedParamsError: litellm.UnsupportedParamsError: ollama does not support parameters: {'presence_penalty': 0}, for model=deepseek-r1. To drop these, set `litellm.drop_params=True` or for proxy:

`litellm_settings:
 drop_params: true`
. Received Model Group=deepseek-r1
Available Model Group Fallbacks=None LiteLLM Retried: 1 times, LiteLLM Max Retries: 2
```
