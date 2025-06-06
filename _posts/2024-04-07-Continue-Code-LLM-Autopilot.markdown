---
layout: single
title:  "Continue Code LLM Autopilot"
date:   2024-04-07 08:00:00 +0800
categories: Continue GitHubCopilot
tags: [Continue, GitHubCopilot, CodeLLM]
---

## Continue
- [Continue](https://continue.dev/)
- [Continue Blog](https://blog.continue.dev/)
- [Continue Docs](https://continue.dev/docs)
- [Continue - GitHub](https://github.com/continuedev/continue)

## 注册 deepseek 的开发平台
- [deepseek 开放平台](https://platform.deepseek.com/)
- [DeepSeek API 手册](https://platform.deepseek.com/docs)

### OpenAI API

DeepSeek API 使用与 OpenAI 兼容的 API 格式，通过修改配置，您可以使用 OpenAI SDK 来访问 DeepSeek API，或使用与 OpenAI API 兼容的软件。

参数	值
base_url   	https://api.deepseek.com/v1
api_key	申请 api_key

| 参数 | 值 |
| --- | --- |
| base_url | https://api.deepseek.com/v1 |
| api_key  | YOUR_API_KEY |

### 模型

| 模型 | 描述 | 上下文长度 |
| --- | --- | --- |
| deepseek-coder | 擅长处理编程任务 | 16K |
| deepseek-chat  | 擅长通用对话任务 | 16K |


## 安装 IntelliJ IDEA 插件 Continue
- [Continue](https://plugins.jetbrains.com/plugin/22707-continue)


## 配置 deepseek-coder
```json
{
  "models": [
    {
      "title": "deepseek api",
      "provider": "openai",
      "model": "deepseek-coder",
      "apiBase": "https://api.deepseek.com/v1",
      "apiType": "openai",
      "apiKey": "YOUR_API_KEY"
    }
}
```

- [Continue 配置](https://github.com/deepseek-ai/awesome-deepseek-integration/blob/main/docs/continue/README.md)


## ~/.continue
```shell
find . -type f -exec ls -l {} \; | awk '{print $8, $9}'
```
```
21:10 ./types/core/index.d.ts
21:10 ./core.log
21:10 ./out/config.js
21:10 ./out/config.js.map
20:59 ./dev_data/chat.jsonl
21:09 ./dev_data/devdata.sqlite
21:10 ./config.json
10:27 ./config.js
21:10 ./config_schema.json
20:39 ./sessions/sessions.json
10:27 ./sessions/1b6ad768-4d7c-4f33-b3f3-e86692e2a624.json
20:39 ./sessions/5be89c74-cf87-4b78-b0f9-b37ee176ea01.json
10:46 ./sessions/474f00c5-e156-42d3-883d-20edbfd86c14.json
16:49 ./package.json
09:12 ./continue_tutorial.py
16:49 ./index/docs.sqlite
16:49 ./index/autocompleteCache.sqlite
16:49 ./.migrations/docsContextProvider1
10:27 ./.migrations/camelCaseConfig
16:49 ./.migrations/codeContextProvider
16:49 ./config.ts
```


## 参考资料
- [DeepSeek 实用集成](https://github.com/deepseek-ai/awesome-deepseek-integration/blob/main/README_cn.md)
- [DeepSeek Chat](https://chat.deepseek.com/)
- [DeepSeek Coder](https://chat.deepseek.com/coder)
