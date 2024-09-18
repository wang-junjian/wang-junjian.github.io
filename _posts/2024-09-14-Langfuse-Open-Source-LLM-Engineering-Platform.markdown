---
layout: post
title:  "Langfuse: Open Source LLM Engineering Platform"
date:   2024-09-14 08:00:00 +0800
categories: Langfuse LLM
tags: [Langfuse, LiteLLM, LLM]
---

## Langfuse
- [Langfuse](https://langfuse.com/)
- [GitHub - Langfuse](https://github.com/langfuse/langfuse)
- [Introducing Langfuse 2.0](https://langfuse.com/guides/videos/introducing-langfuse-2.0)

LLM 可观察性（LLM Observability）、提示管理（Prompt Management）、LLM 评估（LLM Evaluations）、数据集（Datasets）、LLM 指标（LLM Metrics）和提示游乐场（Prompt Playground）

### 概述（Overview）
#### 开发（Develop）
- LLM Observability（可观察性）：为您的应用程序进行仪表化，并开始将跟踪数据传输到 Langfuse（快速入门，集成跟踪）
- Langfuse UI：检查和调试复杂的日志（演示，跟踪）
- Prompt Management：从 Langfuse 中管理、版本化和部署提示（提示管理）
- Prompt Engineering：使用 LLM 游乐场测试和迭代您的提示

#### 监控（Monitor）
- LLM Analytics（分析）：跟踪指标（成本、延迟、质量）并从仪表板和数据导出中获得见解（分析）
- LLM Evaluations（评估）：为您的 LLM 完成收集和计算分数（分数和评估）
  - 在 Langfuse 中运行（基于模型的评估）和 LLM 作为评判
  - 收集用户反馈（用户反馈）
  - 在 Langfuse 中手动评分 LLM 输出（手动评分）
#### 测试（Test）
- Experiments（实验）：在部署新版本之前跟踪和测试应用程序行为
  - 数据集让您在部署之前测试预期的输入和输出对，并对性能进行基准测试（数据集）
  - 跟踪应用程序的版本和发布（实验，提示管理）

### 用于完整开发工作流程的工具

![](/images/2024/Langfuse/Tools-for-the-full-development-workflow.png)

### 与任何 LLM 应用程序和模型一起使用

![](/images/2024/Langfuse/Works-with-any-LLM-app-and-model.png)

## Docker 部署
- [GitHub - Langfuse](https://github.com/langfuse/langfuse)
- [Self-Hosting Langfuse](https://langfuse.com/docs/deployment/self-host)

```shell
# Clone repository
git clone https://github.com/langfuse/langfuse.git
cd langfuse

# Run server and database
docker compose up -d
```


## 使用
登录 [http://localhost:3000](http://localhost:3000)

### New Organization
1. Create Organization
2. Invite Members
3. Create Project
4. Setup Tracing

### Dashboard

![](/images/2024/Langfuse/Langfuse-Dashboard1.png)

![](/images/2024/Langfuse/Langfuse-Dashboard2.png)

### Traces

![](/images/2024/Langfuse/Langfuse-Traces.png)

#### Trace Detail

![](/images/2024/Langfuse/Langfuse-Trace-Detail.png)


## LLM 可观察性集成（LLM Observability Integrations）
- [LLM Observability Integrations](https://github.com/langfuse/langfuse?tab=readme-ov-file#llm-observability-integrations)

### LiteLLM
- [LiteLLM Integration: LiteLLM Python SDK](https://langfuse.com/docs/integrations/litellm/tracing#3-litellm-python-sdk)

安装
```shell
pip install langfuse>=2.0.0 litellm
```

main.py
```python
import os
import litellm


os.environ['LITELLM_LOG'] = 'DEBUG'

# Langfuse
os.environ["LANGFUSE_HOST"]="http://localhost:3000"
os.environ["LANGFUSE_PUBLIC_KEY"] = "pk-lf-fd5d8fba-5134-4037-884d-d6780894a65a"
os.environ["LANGFUSE_SECRET_KEY"] = "sk-lf-10122a92-da11-4423-b3f7-ad10e5f268fc"

os.environ["OPENAI_API_BASE"] = "http://172.16.33.66:9997/v1"
os.environ["OPENAI_API_KEY"] = "NONE"

# set callbacks
litellm.success_callback = ["langfuse"]
litellm.failure_callback = ["langfuse"]

openai_response = litellm.completion(
  model="gpt-4-32k",
  messages=[
    {"role": "system", "content": "您是人工智能助手。"}, 
    {"role": "user", "content": "介绍一下自己。"}
  ]
)

print(openai_response)
```
