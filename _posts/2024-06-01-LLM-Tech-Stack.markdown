---
layout: post
title:  "LLM 技术栈"
date:   2024-06-01 08:00:00 +0800
categories: LLM AICodingAssistant
tags: [LLM, AICodingAssistant]
---

## 框架
### [SGLang][SGLang]

SGLang 是一种专为大型语言模型 (LLM) 设计的结构化生成语言。它通过共同设计前端语言和运行时系统，使您与 LLM 的交互更快、更可控。

## 平台
### [Dify][Dify]

Dify 是一个 UI 驱动的用于开发大语言模型应用程序的平台，它使原型设计更加容易访问。它支持用户使用提示词模板开发聊天和文本生成应用。此外，Dify 支持使用导入数据集的检索增强生成（RAG），并且能够与多个模型协同工作。我们对这类应用很感兴趣。不过，从我们的使用经验来看，Dify 还没有完全准备好投入大范围使用，因为某些功能目前仍然存在缺陷或并不成熟。但目前，我们还没有发现更好的竞品。


## 工具
### [Continue][Continue]

Continue 使您能够在 IDE 中创建自己的 AI 代码助手。使用 VS Code 和 JetBrains 插件保持开发者的流畅体验，这些插件可以连接到任何模型、任何上下文以及任何其他你需要的东西。Continue 使您能够使用适合工作的模型，无论是开源还是商业，本地运行还是远程运行，用于聊天、自动完成或嵌入。它提供了许多配置点，以便您可以自定义扩展以适应您现有的工作流程。

- [模型](https://continue.dev/docs/model-setup/select-model)
- [提供商](https://continue.dev/docs/model-setup/select-provider)
- [没有网络连接](https://continue.dev/docs/walkthroughs/running-continue-without-internet)

### [Ollama][Ollama]
Ollama 是一个在本机上运行并管理大语言模型的工具。 我们之前讨论过自托管大语言模型我们很高兴这个生态逐渐成熟，产生了像 Ollama 的工具。Ollama 支持多种 流行的模型 的下载和本地运行——包括 LLaMA-2, CodeLLaMA, Falcon 和 Mistral。一经下载，你可以通过命令行、接口或者开发组件与模型交互执行任务。我们正在评估 Ollama，目前看起来不错，能通过在本机运行大语言模型提升开发者体验。


## LLM

### [Qwen2](https://qwenlm.github.io/zh/blog/qwen2/)

### [GLM-4-9B](https://github.com/THUDM/GLM-4/)

### [Cohere Aya](https://cohere.com/research/aya)
- [Cohere For AI Launches Aya 23](https://cohere.com/blog/aya23)
- [Aya-23-35B](https://huggingface.co/CohereForAI/aya-23-35B)
- [Aya 23 Demo](https://huggingface.co/spaces/CohereForAI/aya-23)
- [Aya 23: Open Weight Releases to Further Multilingual Progress 技术报告](https://cohere.com/research/aya/aya-23-technical-report.pdf)

### IBM Granite
- [watsonx新篇章：IBM宣布开源、产品及生态系统的多项创新以推动企业级AI的规模化应用](https://china.newsroom.ibm.com/2024-05-22-watsonx-IBM-AI)


## CodeLLM

### [CodeQwen1.5](https://qwenlm.github.io/zh/blog/codeqwen1.5/)

### [Codestral](https://mistral.ai/news/codestral/)

### [Defog.ai](https://github.com/defog-ai)
- [Defog SQLCoder](https://github.com/defog-ai/sqlcoder)
- [Open-sourcing SQLEval: our framework for evaluating LLM-generated SQL](https://defog.ai/blog/open-sourcing-sqleval/)
- [nvidia/ChatQA-Training-Data](https://huggingface.co/datasets/nvidia/ChatQA-Training-Data)


## MLLM

### [CogVLM2](https://github.com/THUDM/CogVLM2)

### LLaVA

### Ferret
- [Ferret: Refer and Ground Anything Anywhere at Any Granularity](https://github.com/apple/ml-ferret)
- [Ferret-v2: An Improved Baseline for Referring and Grounding with Large Language Models](https://arxiv.org/abs/2404.07973)


## 🏆 模型排行榜
- [LMSYS Chatbot Arena Leaderboard](https://chat.lmsys.org/?leaderboard)
- [Artificial Analysis - 质量、速度、价格](https://artificialanalysis.ai/)


## 搜索引擎

### [Typesense](https://typesense.org/)
- [Typesense](https://www.thoughtworks.com/zh-cn/radar/tools/typesense)

### [MeiliSearch](https://www.meilisearch.com/)
- [MeiliSearch](https://www.thoughtworks.com/zh-cn/radar/platforms/meilisearch)


## 身份验证 & 授权

SSO 是一种身份验证机制,允许用户使用单一账户登录多个应用程序和网站。它提供了以下几个主要的使用场景和优点:

- 提高用户体验:用户只需要记住一个账号和密码,就可以访问多个相关的系统和应用,无需频繁输入不同的登录凭证。这大大提高了用户体验。
- 增强安全性:集中管理用户账号信息,可以更好地控制和监控用户的访问行为,降低账号泄露和密码被盗的风险。
- 简化IT管理:IT部门只需要维护一个中央身份验证系统,而不是管理多个独立的登录系统,降低了IT管理成本和复杂度。
- 支持跨域应用集成:SSO 允许用户在不同的域名或组织之间无缝切换,增强了应用程序之间的集成度。

常见的 SSO 实现方式包括基于 SAML、OAuth 2.0 和 OpenID Connect 等标准协议。这些协议定义了用户认证和授权的流程,确保了 SSO 系统的安全性和互操作性。

总的来说,SSO 是一种广泛应用的身份验证解决方案,能够为企业和用户带来显著的便利和安全性。

### [Keycloak](https://github.com/keycloak/keycloak)

在微服务或任何其他分布式架构中，最常见的需求之一是通过身份验证和授权功能保护服务或 API。这就是Keycloak 的作用所在，Keycloak 是一款开源身份和访问管理解决方案，只需很少甚至没有代码，即可轻松保护应用程序或微服务。它支持单点登录、社交登录和 OpenID Connect 等标准协议、OAuth 2.0 和 SAML 开箱即用。我们的团队一直在使用这个工具，并计划在可预见的未来继续使用它。但它需要一点工作来设置。由于配置在初始化和运行时都通过 API 进行，因此有必要编写脚本以确保部署可重复。

- [keycloak-quickstarts](https://github.com/keycloak/keycloak-quickstarts)
- [Keycloak](https://www.thoughtworks.com/en-cn/radar/platforms/keycloak)

### [OpenID Connect](https://www.thoughtworks.com/en-cn/radar/platforms/openid-connect)

OpenID Connect 是基于 OAuth 2.0 构建的联合身份标准协议。它满足了长期以来对简单的基于 Web 的协议的需求，用于交换受信任的身份验证和授权信息。事实证明，以前的标准（如 SAML 或通用 OAuth 2.0）过于宽泛和复杂，无法确保通用兼容性。

### [OAuth](https://www.thoughtworks.com/en-cn/radar/platforms/oauth)

OAuth 是一种基于 Web 的授权协议，允许应用程序访问另一个应用程序中用户的安全资源，而无需用户共享其私人安全凭证。OAuth 2.0 其中包含针对 Web 应用程序、桌面应用程序、移动电话和家用设备的特定流程。


[SGLang]: https://github.com/sgl-project/sglang
[Dify]: https://github.com/langgenius/dify
[Continue]: https://github.com/continuedev/continue
[Ollama]: https://github.com/ollama/ollama
