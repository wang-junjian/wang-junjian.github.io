---
layout: single
title:  "大型语言模型驱动的自主代理"
date:   2024-05-26 08:00:00 +0800
categories: Agent LLM
tags: [Agent, LLM]
---

## Application scenarios of AI agents（AI代理的应用场景）
AI代理是LLM应用的重要场景，构建代理应用将是2024年的重要技术领域。目前我们主要的智能形式有单AI代理，多AI代理，混合AI代理等三种。

![](/images/2024/Agent/hybridAgent.png)

### Single AI Agent（单一人工智能代理）
在特定任务场景下完成的工作，比如 GitHub Copilot Chat 下的代理工作区，就是根据用户需求完成特定编程任务的一个例子。基于 LLM 的能力，单个代理可以根据任务执行不同的动作，比如需求分析、项目阅读、代码生成等。它也可以应用于智能家居和自动驾驶。

### Multi-AI Agents（多人工智能代理）
这就是AI代理之间相互交互的工作。例如上述Semantic Kernel代理实现就是一个例子。脚本生成的AI代理与执行脚本的AI代理进行交互。多代理应用场景在高度协同的工作中非常有帮助，例如软件行业开发、智能生产、企业管理等。

### Hybrid AI Agent（混合人工智能代理）
这就是人机交互，在同一个环境下做决策。比如智慧医疗、智慧城市等专业领域，可以利用混合智能来完成复杂的专业工作。

- [Building AI Agent Applications Series - Understanding AI Agents](https://techcommunity.microsoft.com/t5/educator-developer-blog/building-ai-agent-applications-series-understanding-ai-agents/ba-p/4046944)


## [Intro of AI agent, & AI agent projects summary](https://medium.com/@henryhengluo/intro-of-ai-agent-ai-agent-projects-summary-52f4a364ab86)

| Project       | Key Features                                                                                          |
|---------------|-------------------------------------------------------------------------------------------------------|
| LangChain     | - Python and JavaScript libraries for building LLM-backed apps                                        |
|               | - Modular components for perceiving context, reasoning, chaining, etc.                               |
|               | - Reference architectures and templates                                                              |
|               | - Tooling for debugging, testing, deploying chains                                                   |
| AutoGen       | - Orchestrates LLMs and agents for multi-agent conversations                                          |
|               | - Customizable and conversational agents                                                             |
|               | - Human participation in loops                                                                       |
|               | - Toolkit for reasoning, caching, error handling                                                     |
| PromptAppGPT  | - Low-code prompt-based development                                                                   |
|               | - Integrations for GPT, DALL-E, and plugins                                                          |
|               | - Online editor, compiler, runner                                                                     |
|               | - Auto-generated UI                                                                                   |
|               | - Built-in agent examples                                                                             |
| AutoGPT       | - Toolkit for building custom AI agents                                                               |
|               | - Leverages GPT-3, GPT-4 for agents                                                                    |
|               | - Popular open source agent project                                                                   |
| BabyAGI       | - Minimalist Python agent                                                                             |
|               | - Uses GPT and vector DB                                                                              |
|               | - Create, prioritize, execute tasks                                                                   |
| SuperAGI      | - Alternative to AutoGPT                                                                              |
|               | - Multiple models, vector DBs                                                                         |
|               | - GUI and operations console                                                                          |
|               | - Performance telemetry                                                                              |
|               | - Toolkits and marketplace                                                                            |
| ShortGPT      | - Automates video creation workflows                                                                  |
|               | - Scripts, prompts, templates                                                                         |
|               | - Multilingual voiceover and subtitles                                                               |
|               | - Resource and asset sourcing                                                                         |
| ChatDev       | - Multi-agent "virtual software company"                                                              |
|               | - Agents in specialized roles                                                                         |
|               | - Workshop model for collaboration                                                                    |
| MetaGPT       | - Mimics software company structure                                                                   |
|               | - PM, engineer, etc. roles assigned                                                                   |
|               | - Agents collaborate on tasks                                                                         |
| Camel         | - Early multi-agent framework                                                                         |
|               | - Dynamic role assignment                                                                             |
|               | - Stages scenarios for collaboration                                                                  |
| JARVIS        | - Task planning with ChatGPT                                                                          |
|               | - Model selection from Hub                                                                            |
|               | - Orchestrates specialist models                                                                      |
| OpenAGI       | - Combines expert and LLM models                                                                      |
|               | - RLTF for model improvement                                                                          |
|               | - Specialized for complex tasks                                                                       |
| XAgent        | - Modular dispatcher, planner, actor                                                                  |
|               | - Human collaboration abilities                                                                       |
|               | - Safety and extensibility                                                                            |

- [Overview of 13 projects (webpage)](https://script.google.com/macros/s/AKfycbwm6MFGFxFKHauvyj-Z34uQTJakbOFIaRTPEp9MOaBvcK5NvlLdvPbZer1lo0LjTVu1tA/exec)


## AI Agent Frameworks
- [AutoGPT](https://github.com/Significant-Gravitas/AutoGPT)
- [TaskWeaver](https://github.com/microsoft/TaskWeaver)
- [CrewAI](https://github.com/joaomdmoura/crewAI)
- [BabyAGI](https://github.com/yoheinakajima/babyagi)
- [CAMEL](https://github.com/camel-ai/camel)
- [MetaGPT](https://github.com/geekan/MetaGPT)
- [AutoGen](https://github.com/microsoft/autogen)
- [DSPy](https://github.com/stanfordnlp/dspy)
- [AutoAgents](https://github.com/Link-AGI/AutoAgents)
- [OpenAgents](https://github.com/xlang-ai/OpenAgents)
- [Agents](https://github.com/aiwaves-cn/agents)
- [AgentVerse](https://github.com/OpenBMB/AgentVerse)
- [ChatDev](https://github.com/OpenBMB/ChatDev)
- [XAgent](https://github.com/OpenBMB/XAgent)
- [Qwen-Agent](https://github.com/QwenLM/Qwen-Agent)
- [Lagent](https://github.com/InternLM/lagent)


## Multi-Agent Systems
- [CrewAI](https://www.crewai.com/)
- [AutoGen](https://microsoft.github.io/autogen/)
    - [AutoGen Studio](https://github.com/microsoft/autogen/tree/main/samples/apps/autogen-studio)
    - [AutoGen Studio 2.0](https://autogen-studio.com/autogen-studio-ui)
- [Rivet](https://rivet.ironcladapp.com/)
- [Agency Swarm](https://github.com/VRSEN/agency-swarm)
- [Semantic Kernel](https://learn.microsoft.com/en-us/semantic-kernel/overview/)
- [CAMEL](https://github.com/camel-ai/camel)
- [AgentVerse](https://github.com/OpenBMB/AgentVerse)
- [BotSharp](https://github.com/SciSharp/BotSharp)
- AI Agent Team Frameworks
    - [AI Agent Team Frameworks - Part I](https://www.linkedin.com/pulse/ai-agent-team-frameworks-part-i-p%C3%A9ter-balogh-1xanf)
    - [AI Agent Team Frameworks - Part II](https://www.linkedin.com/pulse/ai-agent-team-frameworks-part-ii-p%C3%A9ter-balogh-zj1uf)
    - [AI Agent Team Frameworks - Part III](https://www.linkedin.com/pulse/ai-agent-team-frameworks-part-iii-p%C3%A9ter-balogh-hscuf)
    - [AI Agent Team Frameworks - Part IV](https://www.linkedin.com/pulse/ai-agent-team-frameworks-part-iv-p%C3%A9ter-balogh-yya8e)
- []()


## 参考资料
- [XAgent：用于解决复杂任务的自主代理](https://blog.x-agent.net/blog/xagent/)
- [XAgent 为大型模型开发开放模型、数据集、系统和评估工具](https://blog.x-agent.net/projects/)
- [Fetch.ai 的 5 大 AI 代理集成](https://fetch.ai/blog/fetch-ai-s-top-5-AI-Agent-integrations)
- [使用Qwen-Agent将上下文记忆扩展到百万量级](https://qwenlm.github.io/zh/blog/qwen-agent-2405/)
