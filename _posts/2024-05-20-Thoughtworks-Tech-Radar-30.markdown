---
layout: post
title:  "Thoughtworks 技术雷达 第30期"
date:   2024-05-20 08:00:00 +0800
categories: 技术雷达
tags: [Thoughtworks, LLM]
---

## Thoughtworks 技术雷达
Thoughtworks 技术雷达 (Tech Radar) 是一份每半年发布一次的技术报告，涵盖了工具、技术、平台、语言和框架等方面的内容。这一知识成果来自于我们全球团队的经验，重点介绍了您可能想要在项目中探索的内容。

环的含义如下：

- 1️⃣ 采纳 (Adopt)。我们认为您应该认真考虑使用的点。
- 2️⃣ 试验 (Trial)。我们认为可以放心使用的点，但还没有达到“采纳”环中那么成熟的程度。
- 3️⃣ 评估 (Assess)。值得关注的点，但除非非常适合您的需求，否则目前可能不需要试用。
- 4️⃣ 暂缓 (Hold)。需要谨慎对待的点。

参考：

- [Thoughtworks 技术雷达](https://www.thoughtworks.com/zh-cn/radar)
- [Thoughtworks 技术雷达 频繁被提及的问题](https://www.thoughtworks.com/zh-cn/radar/faq)
- [Thoughtworks 技术雷达 第30期 2024年4月30日](https://www.thoughtworks.com/content/dam/thoughtworks/documents/radar/2024/04/tr_technology_radar_vol_30_cn.pdf)
- [Exploring Generative AI - 探索生成式人工智能](https://martinfowler.com/articles/exploring-gen-ai.html)
- [An example of LLM prompting for programming - LLM 提示编程的例子](https://martinfowler.com/articles/2023-chatgpt-xu-hao.html)


## 技术
### 1️⃣ 将 CI/CD 基础设施作为一种服务 - 2023年4月
将 CI/CD 基础设施作为一种服务已经是很多元化以及成熟的方案，以至于需要自己管理整个 CI 基础设施的情况变得非常少见。使用 [GitHub Actions](https://www.thoughtworks.com/zh-cn/radar/platforms/github-actions)、[Azure DevOps](https://www.thoughtworks.com/zh-cn/radar/platforms/azure-devops) 或 [Gitlab CI/CD](https://www.thoughtworks.com/zh-cn/radar/platforms/gitlab-ci-cd) 等管理服务，具有托管云服务的所有常见优势（和权衡）。您不需要花时间、精力和硬件成本来维护和运营这个通常很复杂的基础设施。对于自己托管 CI 设施的公司，虽然团队可以受益于弹性和自助服务，然而往往在配置更多合适的代理或获得新的插件或功能时遇到瓶颈。即使是需要在自己的硬件上运行构建和验证的用例，现在也大多可以用自我托管的运行器来满足需求（我们已经写过一些关于 GitHub Actions 的文章，[actions-runner-controller](https://www.thoughtworks.com/zh-cn/radar/platforms/actions-runner-controller) 和 [Philips 的自我托管 GitHub 运行器](https://www.thoughtworks.com/zh-cn/radar/tools/philips-s-self-hosted-github-runner)）。然而，请注意，使用托管服务并不意味着您可以轻易获得安全保障；虽然成熟的服务提供了所需要的所有安全功能，但仍然需要实施对 [CI/CD 基础架构的零信任安全](https://www.thoughtworks.com/zh-cn/radar/techniques/zero-trust-security-for-ci-cd)。

### 1️⃣ 检索增强生成（RAG）- 2024年4月
[检索增强生成（Retrieval-augmented generation, RAG）](https://arxiv.org/abs/2005.11401v4) 是我们团队提高大语言模型（LLM）生成响应质量的首选模式。我们已经在包括 Jugalbandi AI Platform 在内的多个项目中成功使用了它。通过 RAG，相关且可信的文档（如 HTML 和 PDF 格式）的信息被存储在支持向量数据类型或高效文档搜索的数据库中，例如 [pgvector][pgvector]、[Qdrant][Qdrant] 或 [Elasticsearch Relevance Engine][ESRE]。在收到给定提示后，数据库会被调取以检索相关文档，然后这些文档会与提示结合在一起，为 LLM 提供更丰富的上下文。这样一来输出质量更高，且大大减少了幻觉现象。上下文窗口——决定了 LLM 输入的尺寸是有限的，这意味着需要选择最相关的文档。我们会通过重新排序来提升提示内容的相关性。文档如果太大而无法计算嵌入，这意味着它们必须被分割成更小的块。这通常是一个困难的问题，其中一种方法是让这些块在某种程度上重叠。

### 2️⃣ 对仅提供 API 的产品的演示前端 - 2023年4月
捕捉并传达 API 的业务价值是开发 API 时的一大挑战。就其本质而言，API 是一种技术产品。尽管开发人员可以轻松理解 JSON 数据、OpenAPI（[Swagger](https://www.thoughtworks.com/cn/radar/tools/swagger)）规范和 [Postman](https://www.thoughtworks.com/zh-cn/radar/tools/postman) 演示，但业务利益相关者会更倾向于可交互的 API 产品演示。通常当我们能够实际看到并亲身体验产品时，产品的价值会更加清晰地表达出来。也正是因为这样，我们有时会认为投资对仅提供 API 的产品的演示前端是值得的。当定制化界面 UI 与 API 产品一起构建时，业务利益相关者可以将产品与他们可能更熟悉的纸质表格或报告进行类比。随着交互模型和 UI 演示的丰富性不断发展，业务利益相关者可以对 API 产品的发展方向做出更明智的决策。基于 UI 工作也有额外的益处，它可以增加开发人员对业务用户的同理心。虽然 API 产品的演示前端并不是一项新技术——当 API 产品出现时，我们就能在必要时构建演示前端。然而，由于这项技术并不广为人知，我们仍然认为该技术值得关注。

### 2️⃣ ReAct 提示工程 - 2023年9月
ReAct 提示工程是一种用于提示大语言模型的方法，相较于[思维链 (CoT)](https://blog.research.google/2022/05/language-models-perform-reasoning-via.html)等竞争方法，ReAct 旨在提高大语言模型的响应准确性。这一方法在一份[2022年的论文](https://arxiv.org/abs/2210.03629)中首次提出，其原理是将推理和行动结合起来（因此称为ReAct）。这种方法有助于使大语言模型的响应更具解释性，相对于思维链减少了虚构性内容，从而提高了提示者获得他们想要的内容的机会。最初，[LangChain][LangChain] 是为支持这种提示方式而开发的。基于 ReAct 的自主代理已被证明是我们团队构建的大语言模型应用中使用最广泛的一种。最近，OpenAI 在其 API 中引入了[函数调用](https://openai.com/blog/function-calling-and-other-api-updates)以使 ReAct 和类似的提示风格更容易实现，而无需依赖像 LangChain 这样的外部工具。我们仍然处于定义这一学科的早期阶段，但到目前为止，ReAct 及其后继方法已指引出大语言模型最令人兴奋的一些应用领域。

### 2️⃣ 将传统 NLP 与 LLMs 相结合 - 2024年4月
大语言模型(LLMs)是自然语言处理(NLP)中的瑞士军刀。但它们往往比较昂贵，且并非总是最合适的 - 有时候使用一个螺丝刀会更合适。实际上，在 将传统NLP与LLMs相结合 ，或者在将多种NLP与LLMs相结合，以实现用例并利用LLMs的实际需求能力的步骤方面有很大的潜力。传统的数据科学和NLP方法，例如文档聚类、主题识别和分类，甚至摘要生成，成本更低且可能更有效地解决你的使用案例问题的一部分。然后，在需要生成和总结较长文本，或将多个大型文档合并时，我们使用LLMs，以利用其较高的注意力跨度和记忆力。例如，我们已经成功地将这些技术结合使用，从一个大型单个趋势文档语料库生成关于某一领域的全面趋势报告，同时结合传统聚类方法和LLMs的生成能力。

### 2️⃣ Text to SQL - 2024年4月
Text to SQL 是一种用于将自然语言查询转换为可以由数据库执行的 SQL 查询的技术。尽管大语言模型能够理解和转换自然语言，但在你自己的 schema 中创建准确的 SQL 仍然存在很大的挑战。为此可以引入 [Vanna][Vanna]，它是一个在 Python 中用于 SQL 生成的检索增强生成（RAG）开源框架。Vanna 分两步工作：首先你需要使用数据定义语言语句（DDLs）和示范 SQL 描述你的结构，并为它们创建嵌入向量，然后再用自然语言提出问题。尽管 Vanna 可以与任何大语言模型协作，我们还是推荐你评估 [NSQL](https://numbersstation.ai/introducing-nsql-open-source-sql-copilot-foundation-models/)，它是一个用于 Text to SQL 任务的领域特定大语言模型。

### 3️⃣ [提示工程](https://www.thoughtworks.com/zh-cn/radar/techniques/prompt-engineering) - 2023年4月
提示工程 （Prompt engineering）指的是为生成式 AI 模型设计和优化提示的过程，以获得高质量的模型响应。这个过程包括精心设计特定、清晰易懂和与所需任务或应用相关的提示，以引导模型输出有用的结果。提示工程旨在增强大型语言模型（LLM）在问题回答、算术推理任务或特定领域上下文中的能力。在软件开发中，我们可以使用提示工程让 LLM 根据与利益相关者的简要对话或一些笔记撰写故事、API 或测试套件。培养有效的提示技巧正在成为处理人工智能系统的重要技能。提示工程被一些人认为是一门艺术，而另一些人则认为它是一门科学。同时我们也需要考虑到其潜在的安全风险，例如“提示注入攻击”。

### 3️⃣ [基于 AI 辅助的测试驱动开发](https://www.thoughtworks.com/zh-cn/radar/techniques/ai-aided-test-first-development)
和软件行业的许多人一样，我们一直在探索快速演进的 AI 工具，以帮助我们编写代码。我们看到很多人通过将实现代码输入 [ChatGPT](https://www.thoughtworks.com/zh-cn/radar/tools/chatgpt)，然后请求其生成测试代码。但作为 TDD（测试驱动开发）的坚定支持者，我们并不想经常将可能包含敏感信息的实现代码输入到外部模型中，因此我们尝试了[基于 AI 辅助的测试驱动开发](https://martinfowler.com/articles/2023-chatgpt-xu-hao.html)的技术。在这种方法中，我们让 ChatGPT 为我们生成测试代码，然后由开发人员来实现功能。具体而言，我们首先在一个可在多个用例中重复使用的提示“片段”中描述我们使用的技术栈和设计模式。然后，我们描述我们想要实现的具体功能，包括验收标准。基于这些信息，我们要求 ChatGPT 生成在我们的架构风格和技术栈中实现这一功能的实现计划。一旦我们对这个实现计划进行了合理性检查，我们就要求它为我们的验收标准生成测试代码。

这种方法对我们来说效果出奇的好：它要求团队提供对其架构风格的简明描述，帮助初级开发人员和新团队成员编写符合团队现有风格的功能特性。这种方法的主要缺点是，尽管我们没有向模型提供源代码，但我们仍然向其输入了可能包含敏感信息的技术栈和功能描述。至少在这些AI工具的“商业版”面世之前，团队应确保与法律顾问合作，以避免任何知识产权问题。

### 3️⃣ 人工智能团队助理
像 [GitHub Copilot](https://www.thoughtworks.com/zh-cn/radar/tools/github-copilot) 这样的 AI 编码辅助工具目前主要是在帮助和增强个人工作的背景下讨论的。然而，软件交付仍然是团队工作，并将始终是团队工作，因此你应该寻找创建 AI 团队助理 的方法来帮助创建“10 倍团队”，而不是一群孤立的 AI 辅助的10 倍工程师。我们已经开始使用一种团队辅助方法，通过结合提示和知识源来增强知识放大、技能提升和对齐。标准化的提示有助于在团队环境中使用已经达成共识的最佳实践，例如编写用户故事的技术和模板，或实施威胁建模等实践。除了提示之外，通过检索增强生成提供的知识源，可以从组织指南或行业特定的知识库中提供与上下文相关的信息。这种方法使团队成员能够及时获得他们需要的知识和资源。

### 3️⃣ 基于大语言模型的 ChatOps
基于大语言模型的 ChatOps 是通过聊天平台（主要是 Slack）应用大语言模型的新兴方式，允许工程师通过自然语言来构建、部署和操作软件。这种方式有可能通过增强平台服务的可发现性和用户友好性来简化工程工作流程。截至撰写本文时，两个早期示例分别是 [PromptOps](https://www.promptops.com/devops/) 和 [Kubiya](https://www.kubiya.ai/)。然而，考虑到生产环境需要的精细管理，组织在让这些工具接近生产环境前应该彻底评估它们。

### 3️⃣ [大语言模型驱动的自主代理](https://www.thoughtworks.com/zh-cn/radar/techniques/llm-powered-autonomous-agents) - 2024年4月
随着像 [Autogen][Autogen] 和 [CrewAI][CrewAI] 这样的框架的出现，LLM（大型语言模型）驱动的自主代理正在从单一代理和静态多代理系统发展到更先进的阶段。这些框架允许用户定义具有特定角色的代理，分配任务，并使代理通过委派或对话合作完成这些任务。类似于早期出现的单一代理系统，如 [AutoGPT][AutoGPT]、[GPT-Engineer][GPT-Engineer] 和 [BabyAGI][BabyAGI]，单个代理可以分解任务，利用预配置的工具，并请求人工输入。这些代理会记住目标的进展程度，使用大语言模型来思考接下来该做什么，然后采取行动，并理解何时已经实现了目标。这通常被称为思维链推理，而且实际上是可行的。尽管这一领域仍处于开发的早期阶段，但它发展迅速，并且拥有广阔的探索空间。我们的团队实现了一个作为自主代理的客户服务聊天机器人。如果机器人无法达成客户的目标，它会认识到自己的限制并将客户引导到人工处理。这种方法显然仍处于早期发展阶段：自主代理通常存在高失败率和高昂的 AI 服务费用。

### 3️⃣ 使用 GenAI 理解遗留代码库
生成式人工智能（GenAI）和大语言模型（LLMs）可以帮助开发者编写和理解代码。在实际应用中，目前主要体现在较小的代码片段，但更多的产品和技术正在涌现，用于 利用 GenAI 理解遗留代码库 。这在遗留代码库文档记录不完整、或者过时的文档具有误导性时尤其有用。例如，[Driver AI](https://www.driverai.com/) 或 [bloop](https://bloop.ai/) 使用了 RAG ，结合了语言智能、代码搜索与 LLMs，以帮助用户在代码库中定位自己的位置。更大的上下文窗口的新兴模型也将帮助这些技术更适配大型代码库。GenAI 对遗留代码的另一个有前景的应用是在大型机（mainframe）现代化领域，这里的瓶颈通常围绕着需要理解现有代码库、并将这种理解转化为现代化项目需求的逆向工程师。这些逆向工程师有了 GenAI 的帮助可以更快地完成工作。

### 3️⃣ 领域特定的大语言模型 - 2023年4月
之前我们已经提到过 [BERT](https://www.thoughtworks.com/zh-cn/radar/techniques/bert) 和 ERNIE 之类的大型语言模型 (LLMs)；但是 **领域特定的大型语言模型** 是一个新兴的趋势。使用领域特定数据对通用大型语言模型进行微调能将它们用于各种各样的任务，包括信息查询，增强用户支持和内容创作。这种实践已经在法律和金融领域展现出现它的潜力，例如使用 [OpenNyAI](https://opennyai.org/) 进行法律文书分析。随着越来越多的组织开始对大型语言模型进行试验和越来越多像 GPT-4 这样的新模型的发布，我们预期大型语言模型在不久的将来会有更多领域特定的用例。 但是使用大型语言模型仍面临许多挑战和缺陷。首先，大型语言模型能”很自信地犯错”，所以需要构建一些机制来保证结果的准确性。其次，第三方大型语言模型可能保留或二次分享你的数据，这会对保密信息和数据的所有权带来风险。组织应当仔细审阅使用条款和供应商的可信度，或考虑在自己控制的基础设施上训练和运行大型语言模型。就像其他的新技术一样，在业务上使用大语言模型前需要保持谨慎，并理解采用大型语言模型带来的后果和风险。

- [Opennyai : An efficient NLP Pipeline for Indian Legal documents](https://github.com/OpenNyAI/Opennyai)

### 3️⃣ 自托管式大语言模型 - 2023年9月
大语言模型（LLMs）通常需要大量的 GPU 基础设施才能运行，但目前有强烈的推动力使它们可以在更简单的硬件上运行。对大语言模型进行量化可以减少内存需求，使高保真度模型可以在成本更低廉的硬件甚至是 CPU 上运行。像 [llama.cpp][llama.cpp] 这样的工作使大语言模型可以在包括 Raspberry Pi(树莓派)、笔记本电脑和通用服务器在内的硬件上运行成为可能。

许多组织正在部署[自托管式大语言模型](https://www.thoughtworks.com/zh-cn/radar/techniques/self-hosted-llms)。这往往是出于安全或隐私方面的考虑，有时是因为需要在边缘设备上运行模型。开源示例包括 [GPT-J][GPT-J]、[GPT-JT][GPT-JT] 和 [Llama](https://research.facebook.com/publications/llama-open-and-efficient-foundation-language-models/)。这种方法提供了更好的模型控制，以进行特定用途的微调，提高了安全性和隐私性，以及离线访问的可能性。尽管我们已经帮助一些客户自托管开源大语言模型用于代码生成，但我们建议在决定自托管之前仔细评估组织的能力和运行这类大语言模型的成本。

### 3️⃣ [开源编程大语言模型](https://www.thoughtworks.com/zh-cn/radar/tools/open-source-llms-for-coding)
GitHub Copilot 是软件开发时有价值的辅助编程工具。而在工具背后，[大语言模型（LLMs）](https://github.blog/2023-05-17-inside-github-working-with-the-llms-behind-github-copilot/)通过赋能内联代码助手、代码微调和 IDE 中的对话支持等方式，无缝提升开发人员的体验。 大多数这些模型都是专有的，只能通过订阅服务使用。好消息是，您可以使用几种开源的 LLMs 进行编码。如果您需要构建自己的编码辅助服务（比如受到高度监管的行业），可以考虑 [StarCoder][StarCoder] 和 [WizardCoder][WizardCoder]。StarCoder 使用由 [BigCode][BigCode] 维护的[大型数据集](https://huggingface.co/datasets/bigcode/starcoderdata)进行训练，而 Wizardcoder 是 [Evol-Instruct][Evol-Instruct] 调整后的 StarCoder 模型。

我们在实验中使用了 StarCoder，发现它对于生成诸如代码、YAML、SQL 和 JSON 等 结构化软件工程元素十分有用。根据我们的实验，我们发现这两个模型都可以使用提示词中的[小样本示例](https://www.promptingguide.ai/techniques/fewshot)进行[上下文学习](https://thegradient.pub/in-context-learning-in-context/)。尽管如此，对于特定的下游任务（例如为 Postgres 等特定数据库生成 SQL），模型仍需要[微调](https://huggingface.co/docs/trl/main/en/sft_trainer)。最近，Meta 推出了 Code Llama，一款专用于编程的 Llama 2。使用这些开源模型时务必要小心谨慎。在选择任何这些编码 LLMs 供您的组织使用之前，请考虑它们的[许可](https://www.licenses.ai/blog/2022/8/26/bigscience-open-rail-m-license)，包括代码的许可和用于训练模型的数据集的许可，仔细评估这些方面后再做决定。

### 4️⃣ 过度热衷使用大语言模型
在急于利用最新人工智能技术的过程中，许多组织正在试图将大语言模型（LLMs）应用于各种应用，从内容生成到复杂的决策过程。LLMs 的吸引力不可否认；它们提供了看似毫不费力的解决方案来处理复杂问题，开发人员通常可以快速创建此类解决方案，而无需多年深入的机器学习经验。当LLM-based的解决方案多少能够工作时，就迅速部署并转向下一个任务，这可能颇具诱惑力。尽管这些基于LLM的价值证明是有用的，但我们建议团队仔细考虑所使用的技术以及是否LLM真的是正确的最终阶段解决方案。许多LLM可以解决的问题——如情感分析或内容分类——传统的自然语言处理（NLP）可以更便宜、更容易地解决。分析LLM的作用，然后评估其他潜在解决方案，不仅可以减轻 过度热衷使用大语言模型 的风险，还可以促进对人工智能技术的更细致理解和应用。

### 4️⃣ 急于冲向大语言模型微调（fine-tune LLMs）
许多组织都在试图将大语言模型(LLMs)应用于他们的产品、领域或组织知识，我们看到了太多 急于冲向大语言模型微调（fine-tune LLMs） 的情况。虽然这种操作的确可以强大到对特定任务的用例进行优化，但在许多情况下对大语言模型进行微调并不是必需的。最常见误用是为了让 LLM 应用程序了解特定的知识、事实或组织的代码库进行微调。在绝大多数场景下，使用检索增强生成（RAG）可以提供更好的解决方案和更优的投入产出比。微调需要大量的计算资源和专家能力，并且比 RAG 面临更多敏感和专有数据挑战。此外当你没有足够的数据进行微调时，还有欠拟合(underfitting)的风险。又或者，当你拥有太多数据时(这倒不太常见)，出现过拟合(overfitting)风险。总之达到你所需要任务专业性的正确平衡是比较困难的。在你急于为应用场景进行大语言模型微调前，需要仔细考虑这些权衡和替代方案。

[Vanna]: https://github.com/vanna-ai/vanna
[Autogen]: https://microsoft.github.io/autogen/
[CrewAI]: https://www.crewai.io/
[AutoGPT]: https://github.com/Significant-Gravitas/AutoGPT
[GPT-Engineer]: https://github.com/AntonOsika/gpt-engineer
[BabyAGI]: https://github.com/yoheinakajima/babyagi
[llama.cpp]: https://github.com/ggerganov/llama.cpp
[GPT-J]: https://huggingface.co/docs/transformers/model_doc/gptj
[GPT-JT]: https://huggingface.co/togethercomputer/GPT-JT-6B-v1
[StarCoder]: https://github.com/bigcode-project/starcoder
[WizardCoder]: https://github.com/nlpxucan/WizardLM/blob/main/WizardCoder/README.md
[BigCode]: https://www.bigcode-project.org/
[Evol-Instruct]: https://github.com/nlpxucan/evol-instruct


## 平台
### 1️⃣ [Kubernetes][Kubernetes] - 2018年5月
Kubernetes 是 Google 针对将容器部署到机器集群中的问题提供的解决方案。它是一个开源的容器编排平台，可以自动化应用程序的部署、扩展和管理。Kubernetes 为容器化应用程序提供了一个平台，可以自动化应用程序的部署、扩展和管理。它已经成为大多数客户将容器部署到机器集群时的默认解决方案。Kubernetes 已成为主要公共云平台的首选容器编排平台，包括 Microsoft 的 Azure 容器服务和 Google Cloud（请参阅 GKE blip）。

### 1️⃣ [GitHub Actions][GitHub-Actions] - 2023年4月
对于许多需要在新环境中快速启动和运行CI或CD的团队来说，GitHub Actions 已经成为了默认选择。此外，它还能承载更复杂的工作流程，并且能够调用其他复合任务中的任务。尽管 [GitHub 应用市场](https://github.com/marketplace?type=actions)中的生态在不断发展，我们仍然强烈建议谨慎授予第三方GitHub Actions权限访问您的构建流水线。我们建议您遵循 GitHub 有关[安全强化](https://docs.github.com/zh/actions/security-guides/security-hardening-for-github-actions)的建议，避免以不安全的方式共享机密信息。 但是，直接在托管源代码的GitHub上创建构建工作流的便利性，再加上能使用像 [act](https://github.com/nektos/act) 等开源工具在本地运行 GitHub Actions，让其成为简化团队设置和新成员上手流程的一个引人注目的选项。

### 1️⃣ [K3s](https://www.thoughtworks.com/zh-cn/radar/platforms/k3s)
[K3s][K3s] 仍是我们在边缘计算和资源受限环境下的默认 [Kubernetes](https://www.thoughtworks.com/zh-cn/radar/platforms/kubernetes) 发行版。它轻量，完全兼容 Kubernetes ， 且操作开销较少。它使用 [sqlite3][sqlite3] 作为默认存储引擎， 而不是 [etcd][etcd]。 由于它在一个进程中运行所有相关组件，因此具有减少内存占用的优点。我们已将 K3s 用于工控系统和 POS 机环境中，我们对自己的决定非常满意。K3s 的运行时 containerd 已经[支持 wasm](https://github.com/containerd/runwasi), 因此 K3s 可以直接运行和管理 [WebAssembly](https://www.thoughtworks.com/zh-cn/radar/languages-and-frameworks/webassembly) 负载，进一步减少了运行时开销。

### 1️⃣ [Colima][Colima] - 2023年9月
Colima 现在是我们在 macOS 上替代 Docker Desktop 的首选方案。我们持续在几个项目中使用它来提供 Docker 容器运行时的 [Lima VM][Lima-VM]，在 macOS 上配置 Docker CLI，并处理端口转发和挂载卷。Colima 可以配置为使用 [containerd][containerd] 作为其运行时，这也是大多数托管的 Kubernetes 服务上的运行时，可以提高重要的开发到生产环境的一致性。

### 2️⃣ [Rancher Desktop][Rancher-Desktop] - 2024年4月
Docker Desktop 许可证的变更迫使我们寻找相关替代方案，以便开发时能够在本地笔记本电脑上运行一系列容器。最近我们在使用 Rancher Desktop 上取得了不错的成效。这款免费且开源的应用程序容易下载并能够安装在苹果、Windows 或 Linux 机器上，便捷地提供了一个带有图形界面配置和监控的本地 Kubernetes 集群。虽然 Colima 已成为我们 Docker Desktop 的首选替代品，但它主要是一个 CLI 工具。相比之下，Rancher Desktop 对那些不想放弃 Docker Desktop 提供的图形界面的用户很有吸引力。像 [Colima][Colima] 一样，Rancher Desktop 允许你选择 dockerd 或 containerd 作为底层容器运行时。选择直接使用 [containerd][containerd] 可以让你摆脱对 DockerCLI 的依赖，但 dockerd 选项也提供了与其他工具的兼容性，这样可以与运行时守护进程进行通信。

### 2️⃣ 云上 Arm - 2023年4月
[云上 Arm 计算实例](https://www.arm.com/markets/computing-infrastructure/cloud-computing)在过去几年中越来越受欢迎。因为与传统的基于 x86 的实例相比，其成本更低，能源效率也
更高。如今 [AWS](https://aws.amazon.com/ec2/graviton/)、[Azure](https://azure.microsoft.com/blog/azure-virtual-machines-with-ampere-altra-arm-based-processors-generally-available/) 和 [GCP](https://cloud.google.com/blog/products/compute/tau-t2a-is-first-compute-engine-vm-on-an-arm-chip) 等许多云供应商都提供基于 Arm 的实例。云上 Arm 的成本优势对于运行大型
工作负载或需要扩容的企业来说特别有利。根据我们的经验，除非依赖于特定架构，建议所有工作负载都使用
Arm 计算实例。多架构 docker 镜像等很多支持[多架构的工具](https://www.docker.com/blog/multi-arch-build-and-images-the-simple-way/)也可以简化构建和部署的工作流。

### 2️⃣ [DuckDB](https://www.thoughtworks.com/zh-cn/radar/platforms/duckdb) - 2023年4月
[DuckDB][DuckDB] 是一个用于数据科学与数据分析的嵌入式列式数据库。数据分析师通常会在本地将数据加载进诸如 [pandas][pandas] 或 [data.table][data.table] 这些工具中，从而可以在于服务器内扩展解决方案前就做到快速分析模式和形成假设。 然而，我们现在使用DuckDB来处理这些用例，因为它释放出了比内存分析更大的潜力。 DuckDB 支持庞大事务的 [range joins](https://duckdb.org/2022/05/27/iejoin.html)，向量化执行和多版本并发控制 (MVCC) ，我们的团队对此表示非常满意。

### 2️⃣ 特征库 - 2023年4月
任何软件都需要正确表示其所应用的那一领域，并且应该始终了解关键的目标。机器学习项目也不例外。[特征工程](https://en.wikipedia.org/wiki/Feature_engineering)是机器学习软件系统工程和设计的重要部分。[特征库](https://www.featurestore.org/)是一个架构上的概念，能促进识别、发现和监测与给定领域或业务问题有关的特征。实现这一概念需要结合架构设计，数据工程和基础设施管理，来创建一个可扩展的、高效的、可靠的机器学习系统。从工具的角度看，您可以找到开源的和完全托管的方案，但这些只包含了这个概念的一部分。在端到端的机器学习系统设计中，实现特征库带来了以下能力：（1）定义准确特征的能力；（2）增强数据的可复用性并且让特征在不同模型中保持一致和可用的能力，其中还包括设置特征工程管道，以规划特征库中的数据的能力；（3）帮助特征发现的能力和（4）提供特征服务的能力。我们的团队利用特征库获得了这些对端到端机器学习系统的便利。

### 2️⃣ [Weights & Biases][wandb] - 2024年4月
Weights & Biases 是一个机器学习（ML）平台，它通过实验跟踪、数据集版本控制、模型性能可视化和模型管理来帮助更快地构建模型。它可以集成到现有的 ML 代码中，以便将实时指标、终端日志和系统统计数据实时传输到仪表板进行进一步分析。近期，Weights & Biases 扩展到了与大语言模型可观测性相关的 [Traces](https://wandb.ai/site/traces)。Traces 可视化了提示链的执行流程以及中间的输入/输出，并提供了关于链执行的元数据（例如使用的 token 和开始与结束时间）。我们的团队发现它对于调试和更深入了解链式架构非常有用。

### 3️⃣ [Bun][Bun] - 2024年4月
Bun 是一个新的 JavaScript 运行时，类似于 Node.js 或 Deno。然而，与 Node.js 或 Deno 不同，Bun 是使用 WebKit 的 JavaScriptCore 而不是 Chrome 的 V8 引擎构建的。作为 Node.js 的替代品设计，Bun 是一个单一的二进制文件（用 Zig 编写），充当 JavaScript 和 TypeScript 应用程序的打包器、转译器和包管理器。自上一期技术雷达发布以来，Bun 已经从测试版发展到稳定的 1.0 版本。Bun 从头开始构建，并进行了几项优化——包括快速启动、改进的服务器端渲染和一个更快的替代包管理器——我们鼓励你评估它作为你的 JavaScript 运行时引擎。

### 3️⃣ [Dify][Dify] - 2024年4月
Dify 是一个 UI 驱动的用于开发大语言模型应用程序的平台，它使原型设计更加容易访问。它支持用户使用提示词模板开发聊天和文本生成应用。此外，Dify 支持使用导入数据集的检索增强生成（RAG），并且能够与多个模型协同工作。我们对这类应用很感兴趣。不过，从我们的使用经验来看，Dify 还没有完全准备好投入大范围使用，因为某些功能目前仍然存在缺陷或并不成熟。但目前，我们还没有发现更好的竞品。

### 3️⃣ [Elasticsearch Relevance Engine][ESRE] - 2024年4月
尽管向量数据库因 检索增强生成（RAG） 使用案例而日益流行，但[研究](https://arxiv.org/abs/2004.13969)和[经验报告](https://engineering.atspotify.com/2022/03/introducing-natural-language-search-for-podcast-episodes/)表明，将传统的全文搜索与向量搜索相结合（成为混合搜索）可以生成更完善的结果。可以借助 Elasticsearch Relevance Engine(ESRE)，成熟的全文搜索平台 Elasticsearch 支持了内置和自定义嵌入模型、向量搜索以及具有如倒数排序融合(Reciprocal Rank Fusion)等排名机制的混合搜索。尽管这个领域仍在发展中，但根据我们的经验，使用 ESRE 的这些功能以及 Elasticsearch 自带的传统过滤、排序和排名功能已经取得不错的结果，这表明支持语义搜索的搜索平台不应被忽视。

### 3️⃣ [Langfuse][Langfuse] - 2024年4月
Langfuse 是一个用于观察、测试和监控大语言模型应用的工程平台。其 SDK 支持 Python、JavaScript 和 TypeScript，以及其他语言框架，如 OpenAI、LangChain 和 [LiteLLM][LiteLLM]。用户可以自行托管开源版本，也可以将其用作付费云服务。我们的团队在使用它调试复杂的 LLM 链、分析完成情况以及跨用户、会话、地理、功能和模型版本监控关键指标（如成本和延迟）方面体验良好。如果你希望构建基于数据驱动的大语言模型应用程序，Langfuse 是一个值得考虑的好选择。

### 3️⃣ [Qdrant][Qdrant] - 2024年4月
Qdrant 是一个使用 Rust 实现的开源向量数据库。如果你需要在多个节点之间横向扩展向量数据库，我们建议考虑一下 Qdrant。它内置的单指令/多数据（SIMD）加速支持可提升搜索表现，它还能帮助你将 JSON 格式的负载（payload）与向量关联起来。

### 3️⃣ [Chroma][Chroma] - 2023年9月
Chroma 是一个开源的向量存储和嵌入数据库，可用于增强由大语言模型（LLMs）驱动的应用程序。通过促进 LLMs 中的领域知识的存储和利用，Chroma 弥补了 LLMs 通常缺乏内部存储器的不足。特别是在文本到文本应用中，Chroma 可以自动生成单词嵌入并分析它们与查询嵌入之间的相似性，从而大大简化操作。它还提供了存储自定义嵌入的选项，促进了自动化和定制化的融合。鉴于 Chroma 能够增强由 LLM 驱动的应用程序的功能，我们建议团队对 Chroma 进行评估，挖掘其潜力，改进将领域知识集成到此类应用程序中的方式。

### 3️⃣ [pgvector][pgvector] - 2023年9月
pgvector 是一个用于 PostgreSQL 的开源向量相似性搜索插件。我们非常喜欢它，因为它能够让我们在 PostgreSQL 中搜索 embeddings，而无需仅为了相似性搜索而将数据转移到另一个存储中。专门的[向量搜索引擎](https://github.com/currentslab/awesome-vector-search)。

[Kubernetes]: https://kubernetes.io/
[GitHub-Actions]: https://docs.github.com/zh/actions
[K3s]: https://k3s.io/
[sqlite3]: https://docs.python.org/3/library/sqlite3.html
[etcd]: https://etcd.io/
[Colima]: https://github.com/abiosoft/colima
[Lima-VM]: https://github.com/lima-vm/lima
[containerd]: https://containerd.io/
[Rancher-Desktop]: https://rancherdesktop.io/
[DuckDB]: https://duckdb.org/
[pandas]: https://pandas.pydata.org/
[data.table]: https://github.com/Rdatatable/data.table
[wandb]: https://wandb.ai/
[Bun]: https://github.com/oven-sh/bun
[Dify]: https://github.com/langgenius/dify
[Langfuse]: https://langfuse.com/
[pgvector]: https://github.com/pgvector/pgvector
[Qdrant]: https://github.com/qdrant/qdrant
[Chroma]: https://www.trychroma.com/
[ESRE]: https://www.elastic.co/elasticsearch/elasticsearch-relevance-engine


## 工具

### 1️⃣ [DVC](https://www.thoughtworks.com/zh-cn/radar/tools/dvc) - 2023年4月
[DVC][DVC] 一直是我们在数据科学项目中管理实验的首选工具。由于 DVC 是基于 [Git](https://www.thoughtworks.com/zh-cn/radar/tools/git) 的，因此对于软件开发人员来说，DVC 无疑是一个备感熟悉的环境，他们可以很容易地将以往的工程实践应用于数据科学生态中。DVC 使用其特有的模型检查点视图对训练数据集、测试数据集、模型的超参数和代码进行了精心的封装。通过把[可再现性](https://www.thoughtworks.com/zh-cn/radar/techniques/versioning-data-for-reproducible-analytics)作为首要关注点，它允许团队在不同版本的模型之间进行“时间旅行”。我们的团队已经成功地将 DVC 用于生产环境，实现了[机器学习的持续交付(CD4ML)](https://www.thoughtworks.com/zh-cn/radar/techniques/continuous-delivery-for-machine-learning-cd4ml)。DVC 可以与任何类型的存储进行集成（包含但不限于 AWS S3、Google Cloud Storage、[MinIO](https://www.thoughtworks.com/zh-cn/radar/platforms/minio) 和 Google Drive）。然而，随着数据集变得越来越大，基于文件系统的快照可能会变得特别昂贵。当底层数据发生快速变化时，DVC 借由其良好的版本化存储特性可以追踪一段时间内的模型漂移。我们的团队已经成功地将 DVC 应用于像 [Delta Lake](https://www.thoughtworks.com/zh-cn/radar/platforms/delta-lake) 这样的数据存储格式，利用它优化了[写入时复制（COW）](https://zh.wikipedia.org/zh-cn/%E5%86%99%E5%85%A5%E6%97%B6%E5%A4%8D%E5%88%B6)的版本控制。我们大多数的数据科学团队会把 DVC 加入到项目的“Day 0”任务列表中。因此，我们很高兴将 DVC 移至采纳。

### 1️⃣ [dbt][dbt] - 2023年9月
dbt 仍是我们在 ETL 工作流程中进行数据转换的首选工具。我们喜欢它的工程严谨性和它在 SQL 数据转换中实践模块化、可测试性、和可复用性的能力。 dbt 有开源和商业化 SaaS 产品两种版本和健康的生态，包括一个提供了许多用于单元测试、数据质量、数据可观测性等软件包的社区。这些包中尤为值得注意的是用于监测数据质量的 [dbt-expectations](https://www.thoughtworks.com/zh-cn/radar/languages-and-frameworks/dbt-expectations) 和用于构建数据转换的单元测试的 [dbt-unit-testing](https://www.thoughtworks.com/zh-cn/radar/languages-and-frameworks/dbt-unit-testing)。dbt 很好地[集成](https://docs.getdbt.com/docs/supported-data-platforms)了各种云数据仓库、数据湖和数据库，包括 Snowflake，BigQuery，Redshift，Databricks 和 Postgres。当需要处理结构化数据并且能使用 SQL 进行数据转换时，我们的团队们倾向于 dbt，因此我们将它移至采纳阶段。

### 1️⃣ [Mermaid][Mermaid] - 2023年9月
Mermaid 通过使用类似 Markdown 的标记语言来生成图表。自从上次在技术雷达中介绍以来，Mermaid 添加了对更多图表和与源代码存储库、集成开发环境和知识管理工具[集成](https://mermaid.js.org/ecosystem/integrations.html)的支持。 值得注意的是，它在 GitHub 和 GitLab 等流行源代码存储库中得到原生支持，从而可以在 Markdown 文档中嵌入并轻松更新 Mermaid 图表。 我们的许多团队都倾向于使用 Mermaid 作为他们的图表即代码工具，因为它易于使用、集成广泛，且支持的图表类型不断增多。

### 1️⃣ [Ruff][Ruff]
Ruff 是一个新的 Python linter 。使用 linter 是毋庸置疑的，只需要考虑具体要使用哪一个。Ruff 能够脱颖而出有两个原因：开箱即用的体验，以及性能。其中内置了500多条规则，可以轻松取代 Flake8 和它的许多插件。我们的经验证实了 Ruff 团队对其性能的说法。实际上，它的速度至少比其它 linter 快出一个数量级，这是一个巨大的优势，有助于减少大型代码库的构建时间。基于上述原因，Ruff 已成为我们实施 Python linter 的默认选择。

### 2️⃣ [Kubeflow](https://www.thoughtworks.com/zh-cn/radar/tools/kubeflow) - 2023年4月
[Kubeflow][Kubeflow] 是一个 [Kubernetes](https://www.thoughtworks.com/zh-cn/radar/platforms/kubernetes) 原生的机器学习（ML）平台，它能简化模型生命周期中在不同基础设施上的构建、训练和部署流程。 我们已经大量使用它的 [Pipelines](https://www.kubeflow.org/docs/components/pipelines/) 来编码多个模型的包括实验、训练、服务用例的 ML 工作流。除 Pipelines 外, Kubeflow 还带有许多其他的[组件](https://www.kubeflow.org/docs/components/), 我们发现其中用于超参数调优的 [Katib](https://www.kubeflow.org/docs/components/katib/) 组件以及[多租户组件](https://www.kubeflow.org/docs/components/multi-tenancy/)都是非常有用的。

### 2️⃣ [GitHub Copilot](https://github.com/features/copilot)
尽管 AI 编码辅助市场愈发壮大，GitHub Copilot仍然是我们的首选，且被许多团队广泛使用。自上次我们介绍 GitHub Copilot 以来，最有趣的改进来自于聊天功能。例如，不再需要用注释作为提示，这样会使代码变得混乱； 相反，内置聊天可以帮助提示用户，而无需撰写注释。内联聊天还可以更改代码，而不仅仅是编写新行。现在还可以通过使用@workspace标签，显著扩展聊天时询问有关代码问题的上下文。这使得用户可以询问有关整个代码库的问题，而不仅仅是打开的文件。你可以通过使用Copilot Enterprise版本进一步扩展此上下文，该版本会从你在 GitHub 上托管的所有存储库中提取上下文。最后，GitHub 已经开始将一些聊天请求路由到更强大的基于 GPT-4 的模型，并且在流行的 Jetbrains IDE 中即将推出聊天功能（尽管在撰写本文时仍处于内测阶段）。这些发布表明，这一领域的改进步伐并未减缓。如果你去年尝试过编码助手却最终放弃，我们建议你持续关注新发布的功能，并再次尝试。

- [Exploring Generative AI - 生成式 AI 探索集](https://martinfowler.com/articles/exploring-gen-ai.html)

### 2️⃣ [Insomnia][Insomnia]
自从 Postman 在2023年5月宣布 将逐渐淘汰具有离线功能的 Scratch Pad 模式以后，需要将 API 工作区数据从第三方服务器上隔离的团队不得不寻找替代方案。Insomnia 就是可选的替代方案之一：这是一款专为 API 测试、开发和调试而设计的开源桌面应用程序。虽然 Insomnia 支持在线同步，但它可以让你离线保存 API 工作区数据。我们的团队发现，从 Postman 到 Insomnia 进行人工 API 测试是无缝迁移的，因为它们功能相似，而且 Insomnia 允许导入 Postman 的集合。尽管我们的团队在 Insomnia 上获得了良好的体验，但我们仍在关注其他各种形式的开发替代方案——从 GUI工具（如即插即用的 Insomnia），到 CLI 工具(如 [HTTPie][HTTPie]), 再到 IDE 插件(如 [IntelliJ HTTP 客户端插件](https://www.jetbrains.com/help/idea/http-client-in-product-code-editor.html))

### 2️⃣ [IntelliJ HTTP 客户端插件](https://www.jetbrains.com/help/idea/http-client-in-product-code-editor.html)
IntelliJ HTTP 客户端插件允许开发人员在代码编辑器中创建、编辑和执行 HTTP 请求，从而简化了构建和使用 API 的开发流程。 它在我们的团队中越来越受欢迎，团队成员们喜欢它的用户友好性和便利性。它的显著特点包括支持私有文件（默认情况下将敏感密钥排除在 git 之外，从而保护这些密钥）、版本控制和使用变量的能力，这增强了开发者的体验。鉴于它能简化开发人员的工作流程并增强安全措施，我们建议您尝试使用这个工具。

### 2️⃣ [Gradio][Gradio]
Gradio 是一个开源的 Python 库，它能帮助机器学习（ML）模型创建基于 web 的交互式界面。ML 模型上的图形 UI 能够帮助非技术受众更好地理解输入、约束和输出。Gradio 在生成式人工智能领域获得了大量关注，因为它让生成式模型更易于尝试和使用。通常，我们只有在生产环境中真正使用过才会将一个技术放在雷达的试验环。

### 3️⃣ [Tabnine][Tabnine]
Tabnine 是目前炙手可热的编程助手领域的有力竞争者之一。它提供了内嵌的代码补全建议，以及直接在 IDE (Integrated development environment, 集成开发环境) 中进行对话的能力。与 GitHub Copilot 类似，Tabnine 的出现远远早于现在这个各家纷纷大肆炒作的时期，也因此成为了该领域中最成熟的产品之一。与 Copilot 不同的是，Tabnine 使用的模型仅在获得授权的代码上进行训练，并提供了一个可以自行托管的版本，供担心其代码片段会被发送给其他第三方服务的组织使用。Tabnine 既提供有受限制的免费版本，也提供付费版本，后者会有更全面的建议，还提供了一种使用本地模型的模式（尽管功能较弱），供您在没有互联网连接的情况下使用。

### 3️⃣ [aider][aider]
aider 是一款开源的 AI 辅助编码工具。与该领域的许多开源工具一样，aider 并不直接与 IDE 集成，而是以 CLI 的形式在终端启动。目前许多辅助编码工具只能读取代码，或者一次只能更改一个文件，而 aider 的有趣之处在于，它提供了一个聊天界面，并且有写权限来对多个文件的代码库进行访问。这使得 aider 可以帮助实现跨越多个文件的概念（例如，在 HTML 中添加定位器，然后在功能测试中使用它们”），并在代码库中创建新的文件和文件夹结构（例如，创建一个与 X 文件夹中的组件类似的新组件）。由于 aider 是开源而非托管产品，因此需要提供 OpenAI 或 Azure OpenAI API 密钥才能使用。一方面，因为是按使用量计费，这非常适合轻度使用；但另一方面，aider 在与 AI API 交互时似乎很“健谈”，因此使用时要注意请求开销和费用限制。

### 3️⃣ [Codium AI][Codium-AI]
在AI编程助手持续涌现的过程中，相较于孵化大而全的工具，一些产品选择聚焦于某些领域。Codium AI 正是如此，它聚焦于使用 AI 生成代码测试。可以用于所有编程语言，但是对常用技术栈如 JavaScript 和 Python 提供了更进阶的支持。 我们格外中意这个工具，因为它不只向开发者提供测试代码，同时还能对场景提供用于评审的自然语言描述。这能使开发者理解测试用例背后的用意，帮助开发者选择哪些要放入代码库。如果想要进一步提高对特定代码库和测试用例生成的测试质量，用户可以提供测试示例和一些提示，帮助 AI 获取更多高质量的信息。

### 3️⃣ [Continue][Continue]
Continue 是一种用于 VS Code 和 JetBrains IDEs 的开源 AutoPilot 工具。我们非常喜欢它，因为它通过与 IDE 的直接集成，消除了从聊天界面复制/粘贴到大型语言模型的痛苦。它支持多个商业和开源[模型](https://continue.dev/docs/model-setup/select-model), 并且它能够帮助尝试不同的大语言模型[提供商](https://continue.dev/docs/model-setup/select-provider), 包括[自托管的大语言模型](https://www.thoughtworks.com/zh-cn/radar/techniques/self-hosted-llms)。甚至可以在[没有网络连接](https://continue.dev/docs/walkthroughs/running-continue-without-internet)时运行 Continue。

### 3️⃣ [LLaVA][LLaVA]
LLaVA（Large Language and Vision Assistant） 是一个开源的大型多模态模型，它结合了视觉编码器和大语言模型，用于通用视觉和语言理解。LLaVA 在遵循指令方面的强大能力，使其成为多模态人工智能模型中的有力竞争者。最新版本 [LLaVA-NeXT](https://llava-vl.github.io/blog/2024-01-30-llava-next/)，能进一步提升问答能力。在开源的语言和视觉辅助模型中，与 GPT-4 Vision 相比，LLaVA 是一个很有前景的选择。我们的团队一直在使用它进行视觉问题解答。

### 3️⃣ [Mixtral][Mixtral]
Mixtral 是 [Mistral][Mistral] 发布的[开放权重大语言模型家族](https://docs.mistral.ai/models/)的一部分，它采用了[稀疏混合专家架构](https://mistral.ai/news/mixtral-of-experts/)。这个模型家族以 7B 和 8x7B 参数大小的形式，提供原始预训练和微调版本。其大小、开放权重特性、基准测试中的性能以及 32,000 个 token 的上下文长度，使其成为[自托管大语言模型](https://www.thoughtworks.com/zh-cn/radar/techniques/self-hosted-llms)中一个非常耀眼的选择。需要注意的是，这些开放权重模型并没有针对安全性进行优化调整，用户需要根据自己的用例进行精细调整。我们在开发与特定印度法律任务相关的数据上训练的精调 Mistral 7B 模型 [Aalap](https://huggingface.co/opennyaiorg/Aalap-Mistral-7B-v0.1-bf16) 方面有一定经验，该模型在有限成本的基础上表现相当好。

### 3️⃣ [NeMo Guardrails][NeMo-Guardrails]
NeMo Guardrails 是 NVIDIA 的一个易用开源的工具包，它可以使开发人员在会话应用的大语言模型上实现一套防护措施。尽管大语言模型在构建交互式体验上有巨大的潜力，但他们在事实准确性、偏见和潜在的滥用方面上存在一些固有的局限性，这使得我们需要采取一些必要的保护措施。Guardrails 提供了一个有前景的方法来确保大语言模型的责任性和可信性。尽管当谈到大语言模型的保护措施时都会有多种选择，但是我们团队发现 NeMo Guardrails 尤其有用，因为它支持可编程的规则和运行时的集成，并且可以应用到现有的大语言模型的应用上，而不需要大量的代码修改。

### 3️⃣ [Ollama][Ollama]
Ollama 是一个在本机上运行并管理大语言模型的工具。 我们之前讨论过自托管大语言模型我们很高兴这个生态逐渐成熟，产生了像 Ollama 的工具。Ollama 支持多种 流行的模型 的下载和本地运行——包括 LLaMA-2, CodeLLaMA, Falcon 和 Mistral。一经下载，你可以通过命令行、接口或者开发组件与模型交互执行任务。我们正在评估 Ollama，目前看起来不错，能通过在本机运行大语言模型提升开发者体验。

### 3️⃣ [QAnything][QAnything]
大语言模型（LLMs）和检索增强生成（RAG）技术极大地提高了我们整合和提取信息的能力。我们看到越来越多的工具利用了这一点，QAnything 就是其中之一。QAnything 是一个问答界面的知识管理引擎，能够从包括 PDF、DOCX、PPTX、XLSX 和 MD 文件等在内的多种文件格式中总结和提取信息。出于数据安全考虑，QAnything 还支持离线安装。我们的一些团队使用 QAnything 来构建他们的团队知识库。在具有更深行业深度的 GenAI 场景中（例如为投资报告生成摘要），我们也尝试使用这个工具进行概念验证，以在构建真正的产品之前展示 LLMs 和 RAG 的潜力。

### 3️⃣ [Typesense][Typesense] - 2023年4月
Typesense 是一款可容错的开源搜索引擎，它针对高性能和低延迟的搜索体验进行了优化。如果您正在构建对延迟有较高要求的搜索应用，而且索引的大小可以载入内存，Typesense 将是个很好的选择。我们团队在高可用的多节点集群里使用 Typesense 实现负载分布，并确保关键的搜索基础设施能自适应负载变化。在实际使用中 Typesense 表现良好，因此我们将其移动到试验环中。

### 3️⃣ [Devbox][Devbox]
Devbox 提供了易上手的界面，它利用 Nix 包管理器为每个项目创建可重现的开发环境。我们的团队使用它来消除开发环境中的版本和配置不匹配的问题，同时团队成员也喜欢它的易用性。Devbox 支持 shell hooks、自定义脚本和 [devcontainer.json](https://containers.dev/) 生成，以便与 VSCode 集成。

[DVC]: https://dvc.org/
[dbt]: https://www.getdbt.com/
[Mermaid]: https://mermaid.js.org/
[Ruff]: https://github.com/charliermarsh/ruff
[Kubeflow]: https://www.kubeflow.org/
[Insomnia]: https://insomnia.rest/
[HTTPie]: https://httpie.io/
[Gradio]: https://github.com/gradio-app/gradio
[Tabnine]: https://www.tabnine.com/
[aider]: https://github.com/paul-gauthier/aider
[Codium-AI]: https://www.codium.ai/
[Continue]: https://github.com/continuedev/continue
[LLaVA]: https://github.com/haotian-liu/LLaVA
[Mixtral]: https://docs.mistral.ai/models/#mixtral-8x7b
[Mistral]: https://mistral.ai/
[NeMo-Guardrails]: https://github.com/NVIDIA/NeMo-Guardrails
[Ollama]: https://github.com/ollama/ollama
[QAnything]: https://github.com/netease-youdao/QAnything
[Typesense]: https://github.com/typesense/typesense
[Devbox]: https://www.jetpack.io/devbox/


## 语言 & 框架

### 1️⃣ [PyTorch](https://www.thoughtworks.com/zh-cn/radar/languages-and-frameworks/pytorch) - 2023年4月
[PyTorch][PyTorch] 一直是我们选择的机器学习（ML）框架。相比于 [TensorFlow](https://www.thoughtworks.com/zh-cn/radar/languages-and-frameworks/tensorflow)，大多数团队更喜欢 PyTorch，因为它暴露了 TensorFlow 隐藏的 ML 内部工作原理，使其更易于调试。动态计算图使得模型优化比其他任何 ML 框架都更容易。[State-of-the-Art (SOTA) 模型](https://huggingface.co/models)的广泛可用性以及实现研究论文的便利性使 PyTorch 脱颖而出。在图 ML 领域，[PyTorch Geometric][PyTorch-Geometric] 是一个更成熟的生态系统，我们的团队在使用中获得了良好的体验。PyTorch 在模型部署和扩展方面也逐渐弥合了缺失，例如，我们的团队已成功地在生产中使用 [TorchServe][TorchServe] 服务预训练模型。随着许多团队默认使用 PyTorch 来满足其端到端的深度学习需求，我们很高兴地建议采纳 PyTorch。

### 1️⃣ [Playwright][Playwright] - 2023年9月
使用 Playwright，您可以编写在 Chrome、Firefox 和 WebKit 中运行的端到端测试。 通过使用 Chrome 开发者工具（DevTools）协议（CDP），Playwright 可以提供新功能并消除 WebDriver 中出现的许多问题。 基于 Chromium 的浏览器直接实现了 CDP。不过，为了支持 Firefox 和 Webkit，Playwright 团队不得不向这些浏览器提交补丁，这有时可能会限制框架。

Playwright 的功能包括：内置自动等待，这使得测试更可靠、更易于理解； 浏览器上下文，可让您测试跨标签页的持久会话是否正常工作；以及模拟通知、地理位置和黑暗模式设置的能力。 Playwright 为测试套件带来的稳定性给我们的团队留下了深刻印象，并且喜欢它可以并行运行测试以更快地获得反馈。 Playwright 的其他特色包括更好地支持懒加载和追踪。 尽管 Playwright 有一些局限性（例如，组件支持目前处于实验阶段），但我们的团队认为它是首选的测试框架，甚至在某些情况下会从 [Cypress](https://www.thoughtworks.com/zh-cn/radar/tools/cypress) 和 [Puppeteer](https://www.thoughtworks.com/zh-cn/radar/languages-and-frameworks/puppeteer) 上迁移过来。

### 2️⃣ [Next.js](https://www.thoughtworks.com/zh-cn/radar/languages-and-frameworks/next-js) - 2021年4月
在上一次我们介绍了有关如何使用 [Next.js][Next.js] 构建 [React](https://www.thoughtworks.com/zh-cn/radar/languages-and-frameworks/react-js) 代码库之后，我们又有了更多的使用经验。Next.js 是一个一站式零配置的框架，该框架提供了包括简化的路由、采用 [Webpack](https://www.thoughtworks.com/zh-cn/radar/tools/webpack) 和 [Babel](https://www.thoughtworks.com/zh-cn/radar/tools/babel) 进行自动打包和编译、快速热重载等其它可为开发人员提供便利工作流的工具。它默认提供服务器端渲染、搜索引擎优化和改善初始加载时间等功能，并支持增量静态生成模块代码。使用过 Next.js 的团队为我们提供了积极的体验报告，同时鉴于其庞大的社区，我们对该框架的发展保持乐观的态度。

### 2️⃣ [Ray][Ray] - 2024年4月
机器学习（ML）的工作负载正在变得越来越计算密集型。尽管用笔记本电脑开发训练模型很便利，但这样的单节点开发环境很难适应扩展需求。Ray AI 和 Python 代码从笔记本电脑扩展到集群的统一框架。它本质上是一个封装良好的分布式计算框架，集成了一系列 AI 库以简化 ML 的工作。通过与其他框架（例如，PyTorch 和 TensorFlow 的集成，它可以用于构建大规模 ML 平台。像 OpenAI 和字节跳动这样的公司大量使用 Ray 进行模型训练和推理。我们还使用它的 AI 库帮助我们的项目进行分布式训练和超参数调优。推荐你在构建可扩展的 ML 项目时尝试使用 Ray。

### 3️⃣ [nanoGPT](https://www.thoughtworks.com/zh-cn/radar/languages-and-frameworks/nanogpt) - 2023年4月
[nanoGPT][nanoGPT] 是一个用于对中等规模的生成式预训练 Transformer（GPT）进行训练和调优的框架。其作者 Andrej Karpathy 基于[注意力机制](https://arxiv.org/abs/1706.03762)和 [OpenAI 的 GPT-3](https://arxiv.org/abs/2005.14165) 两篇论文的理论，使用 [PyTorch](https://www.thoughtworks.com/zh-cn/radar/languages-and-frameworks/pytorch) [从零开始构建一个 GPT](https://www.youtube.com/watch?v=kCc8FmEb1nY)。在生成式人工智能火热的趋势下，我们想要强调 nanoGPT 的简洁性，并且注重对 GPT 架构的构建模块进行清晰呈现。

### 3️⃣ [GGML][GGML] - 2023年9月
GGML 是一个机器学习的 C 语言库，它支持 CPU 推理。它定义了一种分布式大语言模型（LLMs）的二进制格式。为此，GGML 采用了[量化](https://en.wikipedia.org/wiki/Quantization_(signal_processing))技术，这种技术可以使LLM在用户的硬件上运行有效的 CPU 推理。GGML 支持多种量化策略（例如 4 位、5位、以及 8 位量化），每种策略动都在效果和性能之间提供了不同的取舍。一种快捷地对使用这些量化模型的应用进行测试、运行和构建的方法是使用一个叫做 [C Transformers](https://github.com/marella/ctransformers) 的 Python 绑定。它是一个 GGML 之上的 Python 封装，通过高级的 API 来消除推理的样板代码。我们已经在尝试使用这些库构建原型和实验。如果你正在考虑为你的组织搭建自托管式大语言模型, 请慎重选择这些社区支持的库。

### 3️⃣ [GPTCache][GPTCache] - 2023年9月
GPTCache 是一个用于大型语言模型（LLM）的语义缓存库。我们认为需要在 LLM 前增设缓存层主要出于两种原因——通过减少外部 API 调用来提升整体性能，以及通过缓存近似响应来减少运营成本。不同于使用精确匹配的传统缓存方式, 基于 LLM 的缓存解决方案需要对输入进行相似或相关匹配。 GPTCache 通过使用嵌入算法将输入转化为嵌入，再通过向量数据库对这些嵌入进行相似性搜索。这种设计有一个缺点，可能会导致缓存命中时遇到假阳性结果，或缓存未命中时遇到假阴性结果，因此我们建议你在构建基于 LLM 应用时，仔细评估 GPTCache。

### 3️⃣ [promptfoo][promptfoo] - 2023年9月
promptfoo 是一款测试驱动的 [prompt engineering](https://www.thoughtworks.com/zh-cn/radar/techniques/prompt-engineering)。在应用程序中集成 LLM 时，调整提示词为生成最佳回答并保证输出的一致性，往往会耗费大量时间。你可以将 promptfoo 作为 CLI 和库使用，根据预定义的测试用例对提示词进行系统测试。测试用例和结果断言则可通过简单的 YAML 配置文件完成设置。 这个配置文件包含需要测试的提示词、模型提供者、断言以及将会在提示词中被替换的变量值。promptfoo 支持多种断言，包括相等性、JSON 结构、相似性、自定义函数检查，甚至支持使用 LLM 对模型输出结果分级。如果你想对提示词和模型质量进行自动化反馈，请务必体验 promptfoo。

### 3️⃣ [LiteLLM][LiteLLM]
LiteLLM 是一个库，通过 OpenAI API 格式 的标准化交互实现与各种大语言模型（LLM）提供商的 API 的无缝集成。它广泛支持各类提供商和模型，并具备一个用于完成、嵌入和图像生成功能的统一界面。LiteLLM 通过将输入转换为匹配每个提供商特定端点要求的方式，简化了集成。在当前环境下，这特别有价值，因为缺乏标准化的 LLM 提供商 API 规范会导致项目中包含多个 LLM。我们的团队已经利用 LiteLLM 在 LLM 应用中更换底层模型，解决了一个重大的集成挑战。然而，需要认识到，它对相同提示的模型有不同响应，这表明仅仅一致的调用方法可能不足以完全优化完成性能。

### 3️⃣ [LLaMA-Factory][LLaMA-Factory]
LLaMA-Factory 是一个开源的、易于使用的 LLMs 微调和训练框架。支持 LLaMA、BLOOM、Mistral、Baichuan、Qwen 和 ChatGLM，它使微调等复杂概念相对容易理解。我们的团队成功地使用了 LLaMA-Factory 的 LoRA 调优来训练 LLaMA 7B 模型。如果您需要进行微调，这个框架是值得评估的。

**我们一如既往地提醒大家，非必要情况下，不要着急对大语言模型进行微调 —— 这将增加显著的成本和专家资源负担。**

### 3️⃣ [MLX][MLX]
MLX 是一个开源的数组框架，专为在苹果芯片上进行高效灵活的机器学习而设计。它使得数据科学家和机器学习工程师可以访问集成的 GPU，并在这个基础上选择最适合其需求的硬件。MLX 的设计灵感来自于诸如 NumPy、PyTorch和 Jax 这样的框架。MLX 的特殊之处在于统一内存模型，它消除了 CPU 和 GPU 之间数据传输的成本，从而实现更高的执行速度。这个特性使得在诸如 iPhone 等设备上运行模型成为可能，为设备端的 AI 应用开辟了巨大的机会空间。尽管这是一个小众领域，但这个框架值得机器学习开发者社区尝试。

### 3️⃣ [vLLM][vLLM]
vLLM 是一个具有高吞吐量和高效内存的大语言模型（LLM）推理和服务引擎，其特别有效的原因在于它可以对传入请求进行[连续批处理](https://www.anyscale.com/blog/continuous-batching-llm-inference)。它支持几种[部署选项](https://docs.vllm.ai/en/latest/serving/distributed_serving.html#)，包括使用Ray运行时进行分布式张量并行推理和服务部署，在云中使用 [SkyPilot][SkyPilot]、NVIDIA Triton、Docker 和 LangChain 进行部署。我们团队的经验是在本地虚拟机中运行基于 docker 的 vLLM worker，集成了与 OpenAI 兼容的 API 服务器，并在此基础上被一系列应用所利用(包括用于编码辅助以及聊天机器人的 IDE 插件)。团队对此反馈良好。我们的团队利用 vLLM 运行诸如 CodeLlama 70B、CodeLlama 7B 和 Mixtral 等模型。引擎的另一个显著特点是其可扩展能力：只需进行一些配置更改，就可以从运行 7B 模型转换为 70B 模型。如果您希望将 LLMs 投入生产，那么 vLLM 值得进一步探索。

### 3️⃣ Rust for UI
[Rust][Rust] 的影响力与日俱增，很多最近出现的构建工具和命令行工具都是由 Rust 编写的。我们现在观察到 Rust 有移植到 UI 开发领域的趋势。大部分偏向于在前后端使用统一代码语言的开发团队会选择 JavaScript 或者 TypeScript 作为后端语言。然而，开发者现在也可以通过WebAssembly在浏览器里使用 Rust 代码，而这正在变得越来越常见。另外，像 [Leptos]Leptos 和 [sauron]sauron 这样的框架会更关注在网页应用开发上，同时 [Dioxus][Dioxus] 还有其他的一些框架在网页应用开发之外还提供了跨平台桌面以及移动应用开发的支持。

### 3️⃣ [WebAssembly][WebAssembly]
WebAssembly（WASM）是一项 W3C 标准，旨在为浏览器提供执行代码的能力。它是二进制的编码格式，其设计目标是可以发挥硬件的能力，让代码以接近原生的速度在浏览器中运行，目前 WASM 已被所有的主流浏览器支持并向下兼容。前端开发编程语言早期主要聚焦在 C、C++ 以及 Rust 上，WASM 的出现拓宽了可选范围。同时 WASM 还被 LLVM 支持，纳入为一个编译目标。当 WASM 在浏览器的沙盒环境中运行时，能够与 JavaScript 交互并共享相同的权限和安全模型。凭借其可移植性和安全性这两项关键能力，WASM 可以适配包括移动端、IoT 在内的更多平台。

### 3️⃣ [Semantic Kernel][Semantic-Kernel] - 2023年9月
Semantic Kernel 是微软 Copilot 产品套件中的一个核心组件的开源版本。它是一个 Python 库，与 LangChain 类似，它可以帮助你在大语言模型（LLMs）之上构建应用程序。Semantic Kernel 的核心概念是计划器，它可以帮助你构建由 LLM 驱动的代理 ，这个代理可以为用户创建一个计划，然后在各种插件的帮助下逐步执行这个计划。

### 3️⃣ [LlamaIndex][LlamaIndex] - 2023年9月
LlamaIndex 是一个旨在促进私有或领域特定数据与大语言模型（LLMs）集成的数据框架。它提供了从各种数据源获取数据的工具，包括 API、数据库和 PDF，然后将这些数据结构化为 LLMs 能够轻松消费的格式。通过各种类型的“引擎”，LlamaIndex 使得对这些结构化数据进行自然语言交互变得可能，从而使其可用于从基于查询的检索到对话界面等各种应用。与 [LangChain][LangChain] 类似，LlamaIndex 的目标是加速跟大语言模型应用的开发，但它更多地采用了数据框架的方法。

### 4️⃣ [LangChain][LangChain] - 2024年4月
虽然这个框架为构建大语言模型应用提供了一套强大的功能，但我们发现它使用起来很困难且过于复杂。LangChain 在这个领域早期获得了人气和注意力，这使得它成为了许多人的默认选择。然而，随着 LangChain 试图发展并快速跟进最新变化，开发者越来越难以跟上这些概念和模式的变更。我们还发现其存在 API 设计不一致且冗长的情况。因此，它经常会掩盖底层实际发生的情况，使得开发者难以理解和控制 LLMs 及其周围的各种模式在背后实际是如何工作的。我们将 LangChain 移动到了“暂缓”环，以反映这一点。在我们的许多用例中，我们发现使用更轻量的的专门框架进行实现就足够了。根据用例，你还可以考虑其他框架，如 Semantic Kernel、Haystack 或 LiteLLM。

[PyTorch]: https://pytorch.org/
[PyTorch-Geometric]: https://pytorch-geometric.readthedocs.io/en/latest/
[TorchServe]: https://github.com/pytorch/serve
[Playwright]: https://playwright.dev/
[WebAssembly]: https://webassembly.org/
[Next.js]: https://nextjs.org/
[Ray]: https://github.com/ray-project/ray
[nanoGPT]: https://github.com/karpathy/nanoGPT
[GGML]: https://github.com/ggerganov/ggml
[GPTCache]: https://github.com/zilliztech/GPTCache
[promptfoo]: https://github.com/promptfoo/promptfoo
[LiteLLM]: https://github.com/BerriAI/litellm
[LLaMA-Factory]: https://github.com/hiyouga/LLaMA-Factory
[MLX]: https://github.com/ml-explore/mlx
[vLLM]: https://github.com/vllm-project/vllm
[SkyPilot]: https://github.com/skypilot-org/skypilot
[Rust]: http://www.rust-lang.org/
[Leptos]: https://leptos.dev/
[sauron]: https://github.com/ivanceras/sauron
[Dioxus]: https://dioxuslabs.com/
[LlamaIndex]: https://www.llamaindex.ai/
[LangChain]: https://www.langchain.com/
[Semantic-Kernel]: https://pypi.org/project/semantic-kernel/


## 参考资料
- [将截图转换为代码](https://screenshottocode.com/)
- [Awesome Code LLM](https://github.com/huybery/Awesome-Code-LLM)
- [Thoughtworks 技术雷达 第28期 2023年4月30日](https://www.thoughtworks.com/content/dam/thoughtworks/documents/radar/2023/04/tr_technology_radar_vol_28_cn.pdf)
- [Introducing NSQL: Open-source SQL Copilot Foundation Models](https://numbersstation.ai/introducing-nsql-open-source-sql-copilot-foundation-models/)
