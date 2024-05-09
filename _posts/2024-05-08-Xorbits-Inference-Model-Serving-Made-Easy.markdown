---
layout: post
title:  "Xorbits Inference: 模型服务变得更容易"
date:   2024-05-08 08:00:00 +0800
categories: Xinference LLM
tags: [Xinference, LLM, MacBookProM2Max]
---

## macOS 上安装（M2）

```bash
conda create -n xinference python=3.10.9
conda activate xinference
pip install -U pip
pip install xinference

# GGML
CMAKE_ARGS="-DLLAMA_METAL=on" pip install llama-cpp-python
```
- [安装](https://inference.readthedocs.io/zh-cn/latest/getting_started/installation.html)
  - [GGML 引擎](https://inference.readthedocs.io/zh-cn/latest/getting_started/installation.html#ggml-backend)


## 使用

### 运行 Xinference

```bash
xinference-local
# xinference-local --host 0.0.0.0 --port 9997
```
```
2024-05-08 21:00:07,542 xinference.core.supervisor 55768 INFO     Xinference supervisor 127.0.0.1:64681 started
2024-05-08 21:00:07,573 xinference.core.worker 55768 INFO     Starting metrics export server at 127.0.0.1:None
2024-05-08 21:00:07,574 xinference.core.worker 55768 INFO     Checking metrics export server...
2024-05-08 21:00:09,048 xinference.core.worker 55768 INFO     Metrics server is started at: http://127.0.0.1:51957
2024-05-08 21:00:09,048 xinference.core.worker 55768 INFO     Xinference worker 127.0.0.1:64681 started
2024-05-08 21:00:09,049 xinference.core.worker 55768 INFO     Purge cache directory: /Users/junjian/.xinference/cache
2024-05-08 21:00:14,752 xinference.api.restful_api 55254 INFO     Starting Xinference at endpoint: http://127.0.0.1:9997
```

### UI
浏览器打开 http://127.0.0.1:9997

- API 文档 http://127.0.0.1:9997/docs
- Metrics http://127.0.0.1:9997/metrics

![](/images/2024/Xinference/Xinference.png)


### 部署 LLM
![](/images/2024/Xinference/Deploy-LLM.png)

### 配置 Chatbox

![](/images/2024/Xinference/Chatbox-Xinference.png)


## [管理模型（命令行）](https://inference.readthedocs.io/zh-cn/latest/getting_started/using_xinference.html#manage-models)

- 列出所有支持的指定类型的模型

```bash
xinference registrations -t LLM
```
```bash
Type    Name                          Language                                                      Ability               Is-built-in
------  ----------------------------  ------------------------------------------------------------  --------------------  -------------
LLM     aquila2                       ['zh']                                                        ['generate']          True
LLM     aquila2-chat                  ['zh']                                                        ['chat']              True
LLM     aquila2-chat-16k              ['zh']                                                        ['chat']              True
LLM     baichuan                      ['en', 'zh']                                                  ['generate']          True
LLM     baichuan-2                    ['en', 'zh']                                                  ['generate']          True
LLM     baichuan-2-chat               ['en', 'zh']                                                  ['chat']              True
LLM     baichuan-chat                 ['en', 'zh']                                                  ['chat']              True
LLM     c4ai-command-r-v01            ['en', 'fr', 'de', 'es', 'it', 'pt', 'ja', 'ko', 'zh', 'ar']  ['generate']          True
LLM     c4ai-command-r-v01-4bit       ['en', 'fr', 'de', 'es', 'it', 'pt', 'ja', 'ko', 'zh', 'ar']  ['generate']          True
LLM     chatglm                       ['en', 'zh']                                                  ['chat']              True
LLM     chatglm2                      ['en', 'zh']                                                  ['chat']              True
LLM     chatglm2-32k                  ['en', 'zh']                                                  ['chat']              True
LLM     chatglm3                      ['en', 'zh']                                                  ['chat', 'tools']     True
LLM     chatglm3-128k                 ['en', 'zh']                                                  ['chat']              True
LLM     chatglm3-32k                  ['en', 'zh']                                                  ['chat']              True
LLM     code-llama                    ['en']                                                        ['generate']          True
LLM     code-llama-instruct           ['en']                                                        ['chat']              True
LLM     code-llama-python             ['en']                                                        ['generate']          True
LLM     codeqwen1.5-chat              ['en', 'zh']                                                  ['chat']              True
LLM     codeshell                     ['en', 'zh']                                                  ['generate']          True
LLM     codeshell-chat                ['en', 'zh']                                                  ['chat']              True
LLM     deepseek-chat                 ['en', 'zh']                                                  ['chat']              True
LLM     deepseek-coder-1.3b-instruct  ['en', 'zh']                                                  ['generate', 'chat']  False
LLM     deepseek-coder-instruct       ['en', 'zh']                                                  ['chat']              True
LLM     deepseek-vl-chat              ['en', 'zh']                                                  ['chat', 'vision']    True
LLM     falcon                        ['en']                                                        ['generate']          True
LLM     falcon-instruct               ['en']                                                        ['chat']              True
LLM     gemma-it                      ['en']                                                        ['chat']              True
LLM     glaive-coder                  ['en']                                                        ['chat']              True
LLM     gorilla-openfunctions-v1      ['en']                                                        ['chat']              True
LLM     gorilla-openfunctions-v2      ['en']                                                        ['chat']              True
LLM     gpt-2                         ['en']                                                        ['generate']          True
LLM     internlm-20b                  ['en', 'zh']                                                  ['generate']          True
LLM     internlm-7b                   ['en', 'zh']                                                  ['generate']          True
LLM     internlm-chat-20b             ['en', 'zh']                                                  ['chat']              True
LLM     internlm-chat-7b              ['en', 'zh']                                                  ['chat']              True
LLM     internlm2-chat                ['en', 'zh']                                                  ['chat']              True
LLM     llama-2                       ['en']                                                        ['generate']          True
LLM     llama-2-chat                  ['en']                                                        ['chat']              True
LLM     llama-3                       ['en']                                                        ['generate']          True
LLM     llama-3-instruct              ['en']                                                        ['chat']              True
LLM     minicpm-2b-dpo-bf16           ['zh']                                                        ['chat']              True
LLM     minicpm-2b-dpo-fp16           ['zh']                                                        ['chat']              True
LLM     minicpm-2b-dpo-fp32           ['zh']                                                        ['chat']              True
LLM     minicpm-2b-sft-bf16           ['zh']                                                        ['chat']              True
LLM     minicpm-2b-sft-fp32           ['zh']                                                        ['chat']              True
LLM     mistral-instruct-v0.1         ['en']                                                        ['chat']              True
LLM     mistral-instruct-v0.2         ['en']                                                        ['chat']              True
LLM     mistral-v0.1                  ['en']                                                        ['generate']          True
LLM     mixtral-instruct-v0.1         ['en', 'fr', 'it', 'de', 'es']                                ['chat']              True
LLM     mixtral-v0.1                  ['en', 'fr', 'it', 'de', 'es']                                ['generate']          True
LLM     OmniLMM                       ['en', 'zh']                                                  ['chat', 'vision']    True
LLM     OpenBuddy                     ['en']                                                        ['chat']              True
LLM     openhermes-2.5                ['en']                                                        ['chat']              True
LLM     opt                           ['en']                                                        ['generate']          True
LLM     orca                          ['en']                                                        ['chat']              True
LLM     orion-chat                    ['en', 'zh']                                                  ['chat']              True
LLM     orion-chat-rag                ['en', 'zh']                                                  ['chat']              True
LLM     phi-2                         ['en']                                                        ['generate']          True
LLM     platypus2-70b-instruct        ['en']                                                        ['generate']          True
LLM     qwen-chat                     ['en', 'zh']                                                  ['chat', 'tools']     True
LLM     qwen-vl-chat                  ['en', 'zh']                                                  ['chat', 'vision']    True
LLM     qwen1.5-chat                  ['en', 'zh']                                                  ['chat', 'tools']     True
LLM     qwen1.5-moe-chat              ['en', 'zh']                                                  ['chat']              True
LLM     seallm_v2                     ['en', 'zh', 'vi', 'id', 'th', 'ms', 'km', 'lo', 'my', 'tl']  ['generate']          True
LLM     seallm_v2.5                   ['en', 'zh', 'vi', 'id', 'th', 'ms', 'km', 'lo', 'my', 'tl']  ['generate']          True
LLM     Skywork                       ['en', 'zh']                                                  ['generate']          True
LLM     Skywork-Math                  ['en', 'zh']                                                  ['generate']          True
LLM     starchat-beta                 ['en']                                                        ['chat']              True
LLM     starcoder                     ['en']                                                        ['generate']          True
LLM     starcoderplus                 ['en']                                                        ['generate']          True
LLM     tiny-llama                    ['en']                                                        ['generate']          True
LLM     vicuna-v1.3                   ['en']                                                        ['chat']              True
LLM     vicuna-v1.5                   ['en']                                                        ['chat']              True
LLM     vicuna-v1.5-16k               ['en']                                                        ['chat']              True
LLM     wizardcoder-python-v1.0       ['en']                                                        ['chat']              True
LLM     wizardlm-v1.0                 ['en']                                                        ['chat']              True
LLM     wizardmath-v1.0               ['en']                                                        ['chat']              True
LLM     xverse                        ['en', 'zh']                                                  ['generate']          True
LLM     xverse-chat                   ['en', 'zh']                                                  ['chat']              True
LLM     Yi                            ['en', 'zh']                                                  ['generate']          True
LLM     Yi-200k                       ['en', 'zh']                                                  ['generate']          True
LLM     Yi-chat                       ['en', 'zh']                                                  ['chat']              True
LLM     yi-vl-chat                    ['en', 'zh']                                                  ['chat', 'vision']    True
LLM     zephyr-7b-alpha               ['en']                                                        ['chat']              True
LLM     zephyr-7b-beta                ['en']                                                        ['chat']              True
```

- 列出所有在运行的模型
  
```bash
xinference list
```
```bash
UID           Type    Name          Format      Size (in billions)  Quantization
------------  ------  ------------  --------  --------------------  --------------
qwen1.5-chat  LLM     qwen1.5-chat  pytorch                    0_5  none
```

- 停止指定模型

```bash
xinference terminate --model-uid qwen1.5-chat
```


## 参考资料
- [Xinference GitHub](https://github.com/xorbitsai/inference/blob/main/README_zh_CN.md)
- [Xinference 文档](https://inference.readthedocs.io/zh-cn/latest/index.html)
- [客户端 API](https://inference.readthedocs.io/zh-cn/latest/user_guide/client_api.html)
- [Metrics](https://inference.readthedocs.io/zh-cn/latest/user_guide/metrics.html)
