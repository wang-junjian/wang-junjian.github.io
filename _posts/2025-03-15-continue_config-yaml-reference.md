---
layout: post
title:  "continue: config.yaml Reference"
date:   2025-03-15 10:00:00 +0800
categories: continue AICodingAssistant
tags: [continue, AICodingAssistant, config.yaml, GitHubCopilot]
---

[config.yaml Reference](https://docs.continue.dev/yaml-reference) 的翻译。

## 简介

Continue hub 助手使用 `config.yaml` 规范定义。本地助手也可以通过放置在全局 .continue 文件夹中的 YAML 文件 `config.yaml` 进行配置（Mac 上为 `~/.continue`，Windows 上为 `%USERPROFILE%\.continue`）

:::info
Config YAML 替代了 `config.json`。查看**迁移指南**。
:::

一个助手由以下部分组成：

1. **顶级属性**，用于指定助手的 `name`、`version` 和 `config.yaml` 的 `schema`
2. **块列表**，这些是可组合的编码助手构建块数组，可供助手使用，如模型、文档和上下文提供者。

块是编码助手的一个独立构建块，例如一个模型或一个文档来源。在 `config.yaml` 语法中，块包含与助手相同的顶级属性（`name`、`version` 和 `schema`），但在其所属的块类型下只有**一个**项目。

可以在 [Continue hub](https://hub.continue.dev/explore/assistants) 上找到块和助手的示例。

助手可以显式定义块（参见下面的属性），也可以导入和配置现有的 hub 块。

### 使用块

Hub 块和助手通过格式为 `owner-slug/block-or-assistant-slug` 的标识符识别，所有者可以是用户或组织。

可以通过在块类型下添加 `uses` 子句将块导入到助手中。这可以与该类型的其他 `uses` 子句或显式块一起使用。

:::info
注意，`uses` 块不能与本地 `config.yaml` 一起使用
:::

例如，以下助手导入了一个 Anthropic 模型并定义了一个 Ollama DeepSeek 模型。

```yaml
models:
  - uses: anthropic/claude-3.5-sonnet # 导入的模型块
  - model: deepseek-reasoner # 显式定义的模型块
    provider: ollama
```

### 输入

块可以接收用户输入，包括 hub 密钥和原始文本值。要创建具有输入的块，请使用 mustache 模板，如下所示：

```yaml
name: myprofile/custom-model
models:
  - name: My Favorite Model
    provider: anthropic
    apiKey: ${{ inputs.ANTHROPIC_API_KEY }}
    defaultCompletionOptions:
      temperature: ${{ inputs.TEMP }}
```

然后可以这样导入：

```yaml
name: myprofile/custom-assistant
models:
  - uses: myprofile/custom-model
    with:
      ANTHROPIC_API_KEY: ${{ secrets.MY_ANTHROPIC_API_KEY }}
      TEMP: 0.9
```

注意，hub 密钥可以作为输入传递，使用类似的 mustache 格式：`secrets.SECRET_NAME`。

### 覆盖

块属性也可以使用 `override` 直接覆盖。例如：

```yaml
name: myprofile/custom-assistant
models:
  - uses: myprofile/custom-model
    with:
      ANTHROPIC_API_KEY: ${{ secrets.MY_ANTHROPIC_API_KEY }}
      TEMP: 0.9
    override:
      roles:
        - chat
```

## 属性

以下是 `config.yaml` 中可以设置的每个属性的详细信息。

**除非明确标记为必需，否则所有级别的所有属性都是可选的。**

`config.yaml` 配置文件中的顶级属性有：

- `name` (**必需**)
- `version` (**必需**)
- `schema` (**必需**)
- `models`
- `context`
- `rules`
- `prompts`
- `docs`
- `mcpServers`
- `data`

---

### `name`

`name` 属性指定项目或配置的名称。

```yaml
name: MyProject
```

---

### `version`

`version` 属性指定项目或配置的版本。

### `schema`

`schema` 属性指定用于 `config.yaml` 的模式版本，例如 `v1`

---

### `models`

`models` 部分定义了配置中使用的语言模型。这些模型用于聊天、编辑和总结等功能。

**属性：**

- `name` (**必需**)：在配置中唯一标识模型的名称。
- `provider` (**必需**)：模型的提供者（例如，`openai`、`ollama`）。
- `model` (**必需**)：特定的模型名称（例如，`gpt-4`、`starcoder`）。
- `roles`：指定此模型可以执行的角色数组，如 `chat`、`autocomplete`、`embed`、`rerank`、`edit`、`apply`、`summarize`。默认值为 `[chat, edit, apply, summarize]`。注意，目前不使用 `summarize` 角色。
- `capabilities`：表示模型能力的字符串数组，将覆盖 Continue 基于提供者和模型的自动检测。支持的能力包括 `tool_use` 和 `image_input`。
- `embedOptions`：如果模型包含角色 `embed`，这些设置适用于嵌入：

  - `maxChunkSize`：每个文档块的最大标记数。最小为 128 个标记。
  - `maxBatchSize`：每个请求的最大块数。最小为 1 个块。

- `defaultCompletionOptions`：模型设置的默认完成选项。

  **属性：**

  - `contextLength`：模型的最大上下文长度，通常以标记计算。
  - `maxTokens`：在完成中生成的最大标记数。
  - `temperature`：控制完成的随机性。值范围从 `0.0`（确定性）到 `1.0`（随机）。
  - `topP`：核采样的累积概率。
  - `topK`：每一步考虑的最大标记数。
  - `stop`：将终止完成的停止标记数组。
  - `n`：要生成的完成数量。

- `requestOptions`：特定于模型的 HTTP 请求选项。

  **属性：**

  - `timeout`：每个语言模型请求的超时时间。
  - `verifySsl`：是否验证请求的 SSL 证书。
  - `caBundlePath`：HTTP 请求的自定义 CA 包的路径。
  - `proxy`：HTTP 请求的代理 URL。
  - `headers`：HTTP 请求的自定义头部。
  - `extraBodyProperties`：要与 HTTP 请求主体合并的附加属性。
  - `noProxy`：应绕过指定代理的主机名列表。
  - `clientCertificate`：HTTP 请求的客户端证书。
    - `cert`：客户端证书文件的路径。
    - `key`：客户端证书密钥文件的路径。
    - `passphrase`：客户端证书密钥文件的可选密码。

**示例：**

```yaml
models:
  - name: GPT-4o
    provider: openai
    model: gpt-4o
    roles:
      - chat
      - edit
      - apply
    defaultCompletionOptions:
      temperature: 0.7
      maxTokens: 1500

  - name: Codestral
    provider: mistral
    model: codestral-latest
    roles:
      - autocomplete

  - name: My Model - OpenAI-Compatible
    provider: openai
    apiBase: http://my-endpoint/v1
    model: my-custom-model
    capabilities:
      - tool_use
      - image_input
    roles:
      - chat
      - edit
```

---

### `context`

`context` 部分定义了上下文提供者，它们为语言模型提供额外的信息或上下文。每个上下文提供者可以配置特定参数。

关于每个上下文提供者的使用/参数的更多信息可以在这里找到

**属性：**

- `provider` (**必需**)：上下文提供者的标识符或名称（例如，`code`、docs、`web`）。
- `params`：用于配置上下文提供者行为的可选参数。

**示例：**

```yaml
context:
  - provider: files
  - provider: code
  - provider: codebase
    params:
      nFinal: 10
  - provider: docs
  - provider: diff
  - provider: folder
  - provider: terminal
```

---

### `rules`

LLM 应遵循的规则列表。这些会插入到所有聊天请求的系统消息中。

示例：

```yaml
rules:
  - uses: myprofile/my-mood-setter
    with:
      MOOD: happy
  - Always annotate Python functions with their parameter and return types
  - Always write Google style docstrings for functions and classes
```

---

### `prompts`

可以从聊天窗口调用的自定义提示列表。每个提示都有名称、描述和实际的提示文本。

```yaml
prompts:
  - name: check
    description: Check for mistakes in my code
    prompt: |
      Please read the highlighted code and check for any mistakes. You should look for the following, and be extremely vigilant:
        - Syntax errors
        - Logic errors
        - Security vulnerabilities
```

---

### docs

要索引的文档站点列表。

**属性：**

- `name` (**必需**)：文档站点的名称，显示在下拉菜单等中。
- `startUrl` (**必需**)：爬取的起始页面 - 通常是文档的根页面或介绍页面
<!-- - `rootUrl`：爬取器只会索引此域内的文档 - 包含此 URL 的页面 -->
- `maxDepth`：爬取的最大链接深度。默认为 `4`
- `favicon`：站点 favicon 的 URL（默认是 `startUrl` 的 `/favicon.ico`）。
- `useLocalCrawling`：跳过默认爬取器，只使用本地爬取器爬取。

示例：

```yaml
docs:
  - name: Continue
    startUrl: https://docs.continue.dev/intro
    favicon: https://docs.continue.dev/favicon.ico
```

---

### `mcpServers`

<!-- TODO is this correct? -->

[Model Context Protocol](https://modelcontextprotocol.io/introduction) 是 Anthropic 提出的一个标准，用于统一提示、上下文和工具使用。Continue 通过 MCP 上下文提供者支持任何 MCP 服务器。

**属性：**

- `name` (**必需**)：MCP 服务器的名称。
- `command` (**必需**)：用于启动服务器的命令。
- `args`：命令的可选参数数组。
- `env`：服务器进程的可选环境变量映射。

**示例：**

```yaml
mcpServers:
  - name: My MCP Server
    command: uvx
    args:
      - mcp-server-sqlite
      - --db-path
      - /Users/NAME/test.db
```

### `data`

开发数据将发送到的目的地。

**属性：**

- `name` (**必需**)：数据目的地的显示名称
- `destination` (**必需**)：接收数据的目的地/端点。可以是：
  - 接收 JSON blob 的 POST 请求的 HTTP 端点
  - 指向事件将被转储为 `.jsonl` 文件的目录的文件 URL
- `schema` (**必需**)：要发送的 JSON blob 的模式版本
- `events`：要包含的事件名称数组。如果未指定，默认包括所有事件。
- `level`：事件字段的预定义过滤器。选项包括 `all` 和 `noCode`；后者排除文件内容、提示和完成等数据。默认为 `all`
- `apiKey`：随请求一起发送的 API 密钥（Bearer 标头）
- `requestOptions`：事件 POST 请求的选项。格式与[模型 requestOptions](#models) 相同。

  **示例：**

```yaml
data:
  - name: Local Data Bank
    destination: file:///Users/dallin/Documents/code/continuedev/continue-extras/external-data
    schema: 0.2.0
    level: all
  - name: My Private Company
    destination: https://mycompany.com/ingest
    schema: 0.2.0
    level: noCode
    events:
      - autocomplete
      - chatInteraction
```

---

## 完整的 YAML 配置示例

将所有内容整合在一起，以下是一个完整的 `config.yaml` 配置文件示例：

```yaml
name: MyProject
version: 0.0.1
schema: v1

models:
  - uses: anthropic/claude-3.5-sonnet
    with:
      ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
    override:
      defaultCompletionOptions:
        temperature: 0.8
  - name: GPT-4
    provider: openai
    model: gpt-4
    roles:
      - chat
      - edit
    defaultCompletionOptions:
      temperature: 0.5
      maxTokens: 2000
    requestOptions:
      headers:
        Authorization: Bearer YOUR_OPENAI_API_KEY

  - name: Ollama Starcoder
    provider: ollama
    model: starcoder
    roles:
      - autocomplete
    defaultCompletionOptions:
      temperature: 0.3
      stop:
        - "\n"

rules:
  - Give concise responses
  - Always assume TypeScript rather than JavaScript

prompts:
  - name: test
    description: Unit test a function
    prompt: |
      Please write a complete suite of unit tests for this function. You should use the Jest testing framework.  The tests should cover all possible edge cases and should be as thorough as possible.  You should also include a description of each test case.
  - uses: myprofile/my-favorite-prompt

context:
  - provider: diff
  - provider: file
  - provider: codebase
  - provider: code
  - provider: docs
    params:
      startUrl: https://docs.example.com/introduction
      rootUrl: https://docs.example.com
      maxDepth: 3

mcpServers:
  - name: DevServer
    command: npm
    args:
      - run
      - dev
    env:
      PORT: "3000"

data:
  - name: My Private Company
    destination: https://mycompany.com/ingest
    schema: 0.2.0
    level: noCode
    events:
      - autocomplete
      - chatInteraction
```

## 使用 YAML 锚点避免配置重复

您还可以使用节点锚点来避免属性重复。为此，需要添加 YAML 版本头 `%YAML 1.1`，以下是使用锚点的 `config.yaml` 配置文件示例：

```yaml
%YAML 1.1
---
name: MyProject
version: 0.0.1

model_defaults: &model_defaults
  provider: openai
  apiKey: my-api-key
  apiBase: https://api.example.com/llm

models:
  - name: mistral
    <<: *model_defaults
    model: mistral-7b-instruct
    roles:
      - chat
      - edit

  - name: qwen2.5-coder-7b-instruct
    <<: *model_defaults
    model: qwen2.5-coder-7b-instruct
    roles:
      - chat
      - edit

  - name: qwen2.5-coder-7b
    <<: *model_defaults
    model: qwen2.5-coder-7b
    useLegacyCompletionsEndpoint: false
    roles:
      - autocomplete
```

### 完全弃用的设置

一些已弃用的 `config.json` 设置不再存储在配置中，已移到可通过用户设置页面编辑。如果在 `config.json` 中找到，它们将被迁移到用户设置页面并从 `config.json` 中删除。

- `allowAnonymousTelemetry`：此值将迁移为最安全的合并值（如果任一为 `false`，则为 `false`）。
- `promptPath`：此值将在迁移时覆盖。
- `disableIndexing`：此值将迁移为最安全的合并值（如果任一为 `true`，则为 `true`）。
- `disableSessionTitles`/`ui.getChatTitles`：此值将迁移为最安全的合并值（如果任一为 `true`，则为 `true`）。如果 `getChatTitles` 设置为 false，则优先使用。
- `tabAutocompleteOptions`
  - `useCache`：此值将在迁移时覆盖。
  - `disableInFiles`：此值将迁移为最安全的合并值（文件匹配数组合并/去重）
  - `multilineCompletions`：此值将在迁移时覆盖。
- `experimental`
  - `useChromiumForDocsCrawling`：此值将在迁移时覆盖。
  - `readResponseTTS`：此值将在迁移时覆盖。
- `ui` - 所有都将在迁移时覆盖

  - `codeBlockToolbarPosition`
  - `fontSize`
  - `codeWrap`
  - `displayRawMarkdown`
  - `showChatScrollbar`

  有关每个选项的更多信息，请参见用户设置页面。
