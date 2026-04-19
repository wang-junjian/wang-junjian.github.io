---
layout: single
title:  "LangChain"
date:   2024-04-10 08:00:00 +0800
categories: LangChain
tags: [LangChain]
---

- [LangChain Expression Language (LCEL)](https://python.langchain.com/docs/expression_language/)

## 介绍
LangChain 是一个用于开发由大型语言模型（LLM）支持的应用程序的框架。

LangChain 简化了 LLM 应用程序生命周期的每个阶段：

- 开发（Development）：使用 LangChain 的开源构建块和组件构建您的应用程序。使用第三方集成和模板快速启动。
- 生产化（Productionization）：使用 LangSmith 检查、监控和评估您的链，以便您可以持续优化并放心部署。
- 部署（Deployment）：使用 LangServe 将任何链转换为 API。

![](/images/2024/LangChain/langchain_stack.svg)

具体来说，该框架由以下开源库组成：

- langchain-core: 基本抽象和 LangChain 表达语言（LangChain Expression Language）。
- langchain-community: 第三方集成。
  - 合作伙伴包（例如 langchain-openai、langchain-anthropic 等）：一些集成已进一步拆分为自己的轻量级包，这些包仅依赖于 langchain-core。
- langchain: 构成应用程序认知架构（Cognitive Architecture）的链（Chains）、代理（Agents）和检索策略（Retrieval Strategies）。
- langgraph: 通过将步骤建模为图中的边和节点，使用 LLM 构建强大且有状态的多参与者应用程序。
- langserve: 将 LangChain 链部署为 REST API。

更广泛的生态系统（ecosystem）包括：

- LangSmith：一个开发者平台，让您可以调试（debug）、测试（test）、评估（evaluate）和监控（monitor） LLM 应用程序，并与 LangChain 无缝集成。
- langchain-experimental: 包含用于研究和实验用途的实验性 LangChain 代码。

- [LangChain Introduction](https://python.langchain.com/docs/get_started/introduction/)


## LCEL Runnable 的原理
```python
class Runnable:
  def __init__(self, func):
    self.func = func

  def __or__(self, other):
    def chained_func(*args, **kwargs):
      # self.func is on the left, other is on the right
      return other(self.func(*args, **kwargs))
    return Runnable(chained_func)

  def __call__(self, *args, **kwargs):
    return self.func(*args, **kwargs)

def add_ten(x):
  return x + 10

def divide_by_two(x):
  return x / 2


runnable_add_ten = Runnable(add_ten)
runnable_divide_by_two = Runnable(divide_by_two)
chain = runnable_add_ten | runnable_divide_by_two
result = chain(8) # (8+10) / 2 = 9.0 should be the answer
print(result)
```

- [LangChain Expression Language Explained](https://www.pinecone.io/learn/series/langchain/langchain-expression-language/)
- [Unleashing the Power of LangChain Expression Language (LCEL): From Proof of Concept to Production](https://www.artefact.com/blog/unleashing-the-power-of-langchain-expression-language-lcel-from-proof-of-concept-to-production/)
- [Passing data through](https://python.langchain.com/docs/expression_language/primitives/passthrough/)
- [libs/core/tests/unit_tests/runnables/test_runnable.py](https://github.com/langchain-ai/langchain/blob/master/libs/core/tests/unit_tests/runnables/test_runnable.py)


## [安装](https://python.langchain.com/docs/get_started/installation/)
