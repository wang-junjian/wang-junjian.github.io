---
marp: true
theme: default
paginate: true
style: |
    h1 {font-size: 3em; text-align: center;}
    h4 {writing-mode: vertical-lr; font-size: 1.5em; font-weight: bold; position: absolute; top: 2em; left: 0em;}
    a {text-decoration: none;}
    p {text-indent: 2em;}
    table {width: 100%;}
    th, td {white-space: nowrap; width: 100%;}
    .columns {display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem;}
---
# LLM 应用开发
<!--footer: ©2023 王军建-->
---

## 说明

- 📝 - [arXiv](https://arxiv.org/)
- 😺 - [GitHub](https://github.com/)
- 🤗 - [Hugging Face](https://huggingface.co/)

---

## LLM 应用程序的新兴架构
![](images/Emerging-LLM-App-Stack.png)
```
❶ Data Preprocessing / Embedding ❷ Prompt Construction / Retrieval ❸ Prompt Execution / Inference
```
<!--_footer: '[Emerging Architectures for LLM Applications](https://a16z.com/emerging-architectures-for-llm-applications/)' -->
<!--
* [Emerging Architectures for LLM Applications](https://a16z.com/emerging-architectures-for-llm-applications/)
* [Extend Your Modern Data Stack to Leverage LLMs in Production](https://estuary.dev/modern-data-stack-LLMs/)
* [LLMs and the Emerging ML Tech Stack](https://medium.com/@brian_90925/llms-and-the-emerging-ml-tech-stack-6fa66ee4561a)
* [The New Language Model Stack](https://www.sequoiacap.com/article/llm-stack-perspective/)
-->

---

<style scoped>table {font-size: 24px;}</style>

## 每个项目的链接列表

| Data Pipelines | Embedding Model | Vector Database | Playground | Orchestration | APIs/plugins |
| -------------- | --------------- | --------------- | ---------- | ------------- | ------------ |
| Databricks | OpenAI | Pinecone | OpenAI | Langchain | Serp |
| Airflow | Hugging Face | Weaviate | nat.dev | LlamaIndex | Wolfram |
| | | pgvector | | | |

| Logging / LLMops | Validation | App Hosting | LLM APIs | Cloud Providers |
| ---------------- | ---------- | ----------- | -------- | --------------- |
| Weights & Biases | Guardrails | Vercel | OpenAI | AWS |
| MLflow | Rebuff | Steamship | Anthropic | GCP |
| PromptLayer | Microsoft Guidance | Streamlit | Hugging Face | Azure |
| Helicone | LMQL | Modal | Replicate | CoreWeave |

---

## LLM Playground
- [Chatbot Arena](https://huggingface.co/spaces/lmsys/chatbot-arena-leaderboard)
- [Vercel AI Playground](https://sdk.vercel.ai/)
- [GPT4All](https://gpt4all.io/index.html)
- [Quora Poe](https://poe.com/)
- [HuggingChat](https://huggingface.co/chat/)
- [Open Assistant](https://open-assistant.io/chat)
- [Open Playground](https://github.com/nat/openplayground)
<!--_footer: '[8 Free AI and LLMs Playgrounds](https://www.kdnuggets.com/2023/05/8-free-ai-llms-playgrounds.html) | [8个免费的AI和LLM游乐场](https://www.mvrlink.com/eight-free-ai-and-llms-playgrounds/)'-->

---

## Web UI
![](images/gradio.png)
![](images/streamlit.png)

<!--_footer: '[Gradio][gradio] | [Streamlit][streamlit]'-->
<!--
* [Gradio](https://www.gradio.app)
* [GitHub Gradio](https://github.com/gradio-app/gradio)
* [Streamlit](https://streamlit.io)
* [GitHub Streamlit](https://github.com/streamlit/streamlit)
-->

---

## Web 框架
![](images/fastapi.png)

<!--_footer: '[FastAPI][fastapi]'-->
<!--
* [FastAPI](https://fastapi.tiangolo.com)
* [GitHub FastAPI](https://github.com/tiangolo/fastapi)
-->

---
# WSGI 服务器
---

## 为什么 WSGI HTTP 服务器最好在 HTTP 代理服务器后面？

WSGI HTTP 服务器最好在 HTTP 代理服务器后面使用，因为代理服务器可以提供额外的安全性和性能优化。代理服务器可以处理 SSL 终止、负载均衡、缓存和其他安全性和性能优化。这样，WSGI 服务器可以专注于处理应用程序逻辑，而代理服务器可以处理其他任务。此外，代理服务器还可以提供额外的安全性，例如防止 DDoS 攻击和其他网络攻击。因此，使用代理服务器可以提高应用程序的可靠性和安全性。

在特定情况下，如果您的应用程序只是一个简单的原型或小型应用程序，您可能不需要代理服务器。但是，对于大型应用程序或需要高可用性和安全性的应用程序，使用代理服务器是一个很好的选择。

---

## 什么是 WSGI, SSL, DDoS？
WSGI（Web Server Gateway Interface）是一种 Web 服务器和 Web 应用程序之间的标准接口，它定义了 Web 服务器如何与Web应用程序进行通信。WSGI 允许开发人员使用不同的 Web 服务器和 Web 应用程序框架，而无需修改代码。WSGI 的目标是提供一种通用的接口，使 Web 服务器和 Web 应用程序之间的通信更加简单和可靠。

SSL（Secure Sockets Layer）是一种安全协议，用于在 Web 浏览器和 Web 服务器之间提供加密通信。SSL 可以防止第三方窃听和篡改数据，从而提高数据的安全性。SSL 使用数字证书来验证Web服务器的身份，并使用加密算法来保护数据的机密性和完整性。

DDoS（Distributed Denial of Service）是一种网络攻击，旨在使 Web 服务器无法提供服务。DDoS 攻击通常涉及大量计算机同时向 Web 服务器发送请求，从而使服务器超载并无法响应其他请求。DDoS 攻击可以通过使用防火墙、负载均衡器和其他安全性措施来防止。

---

![](images/uvicorn.png)
<!--_footer: '[uvicorn][uvicorn]'-->

---

![](images/gunicorn.png)
<!--_footer: '[gunicorn][gunicorn]'-->

---

## Gunicorn 和 Uvicorn 之间的区别是什么？

Gunicorn 和 Uvicorn 都是 Python 的 WSGI HTTP 服务器，但它们之间有一些区别。

Gunicorn 是一个稳定、成熟的 WSGI 服务器，已经存在了很长时间。它使用 pre-fork worker 模型，可以在多个进程中运行应用程序，从而提高性能和可靠性。Gunicorn 还支持多种工作模式，包括 sync、eventlet 和 gevent 等。Gunicorn 是一个通用的 WSGI 服务器，可以与各种 Python 框架一起使用。

Uvicorn 是一个基于 ASGI 的 WSGI 服务器，使用 asyncio 库实现异步 I/O。它使用单个进程和单个线程来处理请求，但可以同时处理多个请求。Uvicorn 的性能非常出色，特别是在处理大量并发请求时。Uvicorn 还支持 WebSocket 和 HTTP/2 协议。Uvicorn 是专门为 ASGI 应用程序设计的，但也可以与 WSGI 应用程序一起使用。

因此，Gunicorn 和 Uvicorn 之间的主要区别在于它们的工作模型和性能特征。Gunicorn 使用 pre-fork worker 模型，适用于大多数 WSGI 应用程序，而 Uvicorn 使用异步 I/O 模型，适用于处理大量并发请求的应用程序。

---
# LangChain
# LLM 应用程序的应用框架
<!--_header: '[😺](https://github.com/langchain-ai/langchain)'-->
<!--_footer: '[LangChain][langchain]'-->
---

#### LangChain Stack
![bg fit](images/LangChain/langchain_stack.svg)
<!--_footer: '[LangChain Introduction](https://python.langchain.com/docs/get_started/introduction)'-->

---

- [LangServe](https://python.langchain.com/docs/langserve)
- [Introducing LangServe, the best way to deploy your LangChains](https://blog.langchain.dev/introducing-langserve/)

---

## 基于非结构化文档问答的工作流程
![](images/LangChain/langchain-qa_flow.jpg)
<!-- _footer: '[Retrieval-augmented generation (RAG)](https://python.langchain.com/docs/use_cases/question_answering/)' -->

<!--
* [打造高质量 AI 知识库](https://doc.fastgpt.in/docs/use-cases/kb/)
-->

---

## 向量存储

一种最常见的存储和搜索非结构化数据的方法是将其嵌入并存储生成的嵌入向量，然后在查询时对非结构化查询进行嵌入，并检索与嵌入查询最相似的嵌入向量。向量存储负责为您存储嵌入数据和执行向量搜索。

![](images/vectorstore/vector_stores.png)
<!--_footer: '[Vector Stores](https://python.langchain.com/docs/modules/data_connection/vectorstores/)'-->

---
# LlamaIndex
# LLM 应用程序的数据框架
<!--_header: '[😺](https://github.com/run-llama/llama_index)'-->
<!--_footer: '[LlamaIndex][llamaindex]'-->
---
# Vector Database
# 向量数据库
---

## 什么是向量数据库？

**向量数据库**是一种数据库类型，它索引并存储向量嵌入以实现快速检索和相似性搜索，同时具备CRUD操作、元数据过滤和水平扩展等功能。
![](images/vectorstore/pinecone-vector-database.png)

<!--_footer: '[What is a Vector Database?](https://www.pinecone.io/learn/vector-database/)'-->

---

## 向量数据库 [Chroma][Chroma]
![](images/vectorstore/chroma.svg)

---

# 谢 谢 ！


[cohere]: https://cohere.com/

[GPTCache]: https://github.com/zilliztech/GPTCache

[HuggingFace]: https://huggingface.co/

<!-- Web UI -->
[gradio]: https://www.gradio.app
[streamlit]: https://streamlit.io

[fastapi]: https://fastapi.tiangolo.com
[uvicorn]: https://www.uvicorn.org
[gunicorn]: https://gunicorn.org/

[langchain]: https://www.langchain.com/
[llamaindex]: https://docs.llamaindex.ai/en/stable/
[colab]: https://colab.research.google.com/

<!-- Vector Store -->
[Chroma]: https://www.trychroma.com/
