---
layout: single
title:  "Claude Cowork 知识工作插件（Knowledge Work Plugins）"
date:   2026-02-27 08:00:00 +0800
categories: Cowork Plugins
tags: [Cowork, Plugins, Claude, Anthropics]
---

知识工作插件（Knowledge Work Plugins）能将 Claude 打造为适配你岗位、团队与公司的专业助手。专为 **Claude Cowork** 打造，同时兼容 **Claude Code**。

<!--more-->

## 为何使用插件
Cowork 让你设定目标，Claude 即可输出完整、专业的成果。而插件能进一步赋能：你可以告诉 Claude 你的工作偏好、需要调用的工具与数据、关键工作流的处理方式，以及开放哪些斜杠命令——让团队获得更优质、更统一的结果。

每个插件都为特定职能打包了**专业能力、工具连接器、斜杠命令和子智能体**。开箱即用，就能让 Claude 快速上手协助对应岗位人员。真正的强大之处在于**为你的公司定制化**——适配你的工具、术语与流程，让 Claude 仿佛为你的团队量身定制。

## 插件市场
我们开源了 11 个基于实际工作打造与启发的插件：

| 插件 | 作用 | 连接工具 |
|------|------|----------|
| **[生产力](./productivity)** | 管理任务、日历、日常工作流与个人上下文，减少重复沟通。 | Slack、Notion、Asana、Linear、Jira、Monday、ClickUp、Microsoft 365 |
| **[销售](./sales)** | 调研潜在客户、准备通话、梳理商机漏斗、撰写外联文案、制作竞品对比卡。 | Slack、HubSpot、Close、Clay、ZoomInfo、Notion、Jira、Fireflies、Microsoft 365 |
| **[客户支持](./customer-support)** | 工单分类、回复草稿、升级处理打包、客户信息调研、将已解决问题转为知识库文章。 | Slack、Intercom、HubSpot、Guru、Jira、Notion、Microsoft 365 |
| **[产品管理](./product-management)** | 撰写需求文档、规划路线图、整理用户调研、同步利益相关方、跟踪竞品动态。 | Slack、Linear、Asana、Monday、ClickUp、Jira、Notion、Figma、Amplitude、Pendo、Intercom、Fireflies |
| **[营销](./marketing)** | 内容撰写、活动策划、统一品牌语调、竞品简报、全渠道效果汇报。 | Slack、Canva、Figma、HubSpot、Amplitude、Notion、Ahrefs、SimilarWeb、Klaviyo |
| **[法务](./legal)** | 合同审核、保密协议处理、合规指引、风险评估、会议准备、模板化回复撰写。 | Slack、Box、Egnyte、Jira、Microsoft 365 |
| **[财务](./finance)** | 准备记账凭证、账目核对、生成财务报表、差异分析、结账管理、审计支持。 | Snowflake、Databricks、BigQuery、Slack、Microsoft 365 |
| **[数据](./data)** | 数据集查询、可视化与解读——编写 SQL、统计分析、搭建仪表盘，分享前完成校验。 | Snowflake、Databricks、BigQuery、Hex、Amplitude、Jira |
| **[企业搜索](./enterprise-search)** | 一键检索邮件、聊天、文档、维基全量内容，跨公司所有工具查询。 | Slack、Notion、Guru、Jira、Asana、Microsoft 365 |
| **[生物研究](./bio-research)** | 连接临床前研究工具与数据库（文献检索、基因组分析、靶点优先级筛选），加速生命科学早期研发。 | PubMed、BioRender、bioRxiv、ClinicalTrials.gov、ChEMBL、Synapse、Wiley、Owkin、Open Targets、Benchling |
| **[Cowork 插件管理](./cowork-plugin-management)** | 为组织专属工具与工作流创建新插件或定制现有插件。 | — |

可直接从 Cowork 安装，在 GitHub 浏览完整合集，或自行开发。

## 快速开始
### Cowork
从 [claude.com/plugins](https://claude.com/plugins/) 安装插件。

### Claude Code
```bash
# 先添加插件市场
claude plugin marketplace add anthropics/knowledge-work-plugins

# 再安装指定插件
claude plugin install sales@knowledge-work-plugins
```

安装后插件自动激活。相关场景会自动触发能力，会话中可使用斜杠命令（如 `/sales:call-prep`、`/data:write-query`）。

## 插件工作原理
所有插件结构统一：
```
插件名/
├── .claude-plugin/plugin.json   # 插件清单
├── .mcp.json                    # 工具连接配置
├── commands/                    # 手动调用的斜杠命令
└── skills/                      # Claude 自动调用的领域知识
```

- **Skills（能力）**：封装 Claude 提供有效协助所需的领域专业知识、最佳实践与分步工作流，相关场景自动调用。
- **Commands（命令）**：手动触发的明确操作（如 `/finance:reconciliation`、`/product-management:write-spec`）。
- **Connectors（连接器）**：通过 **MCP 服务** 将 Claude 连接到岗位依赖的外部工具（CRM、项目管理、数据仓库、设计工具等）。

所有组件均为文件形式：Markdown 与 JSON，**无需代码、无需基础设施、无需构建步骤**。

## 定制为你所用
这些插件是通用起点，适配公司实际流程后价值倍增：
- **更换连接器**：编辑 `.mcp.json` 指向你的工具栈。
- **添加公司上下文**：将术语、组织架构、流程写入能力文件，让 Claude 适配你的业务。
- **调整工作流**：修改能力指令，匹配团队真实工作方式而非理论流程。
- **开发新插件**：使用 `cowork-plugin-management` 插件或参照上述结构，创建未覆盖的岗位与流程插件。

随着团队开发与共享插件，Claude 会成为跨职能专家。你定义的上下文会融入每一次相关交互，让管理者与管理员少做流程管控，多做流程优化。

## 贡献
插件仅由 Markdown 文件构成。Fork 本仓库，修改后提交 PR 即可。


# cowork-plugin-management（开发新插件）

**目录结构**：

```plaintext
cowork-plugin-management/
├── .claude-plugin/
│   └── plugin.json                   # 插件清单（元数据、版本、作者）
├── skills/                           # 插件管理相关的领域知识
│   ├── cowork-plugin-customizer/     # 定制现有插件以适配组织工具与流程
│   |   ├── SKILL.md                  # 核心技能：理解插件结构、Schema 规范
|   |   ├── examples/         
│   |   |   └── customized-mcp.json   # 示例 MCP 配置，展示如何连接不同工具
│   |   └── references/               # 详细参考资料
│   |       ├── mcp-servers.md        # MCP 服务器配置指南
│   |       └── search-strategies.md  # 定位插件组件的搜索策略
│   └── create-cowork-plugin/
│       ├── SKILL.md                  # 核心技能：理解插件结构、Schema 规范
│       └── references/               # 详细参考资料
│           ├── component-schemas.md  # 插件组件的 Schema 规范
│           └── example-plugins.md    # 现有插件的结构示例
└── README.md                         # 插件的使用说明文档
```

- 📌 .claude-plugin/plugin.json

```json
{
  "name": "cowork-plugin-management",
  "version": "0.2.2",
  "description": "创建、定制和管理适配你所在组织工具与工作流的插件。配置 MCP 服务器、调整插件行为，并修改模板以匹配团队的工作方式。",
  "author": {
    "name": "Anthropic"
  }
}
```

- 📌 skills/cowork-plugin-customizer/SKILL.md

```markdown
---
name: cowork-plugin-customizer
description: > 为特定组织的工具和工作流定制 Claude Code 插件。 适用场景：定制插件、设置插件、配置插件、调整插件设置、定制插件连接器、定制插件技能、定制插件命令、微调插件、修改插件配置。
compatibility: 需要 Cowork 桌面应用环境，并能访问挂载的插件目录（mnt/.local-plugins, mnt/.plugins）。
---
```

# Cowork 插件定制

为特定组织定制插件——无论是首次设置通用插件模板，还是对已配置的插件进行微调和优化。

> **查找插件**：要找到插件的源文件，请运行 `find mnt/.local-plugins mnt/.plugins -type d -name "*<plugin-name>*"` 来定位插件目录，然后在进行更改之前阅读其文件以了解其结构。如果找不到插件目录，用户可能是在远程容器中运行此对话。请停止操作并告知用户：“插件定制功能目前仅在桌面应用的 Cowork 模式下可用。”

## 确定定制模式

定位插件后，检查是否存在以 `~~` 为前缀的占位符：`grep -rn '~~\w' /path/to/plugin --include='*.md' --include='*.json'`

> **默认规则**：如果存在 `~~` 占位符，除非用户明确要求定制插件的特定部分，否则默认为**通用插件设置**。

**1. 通用插件设置** — 插件包含以 `~~` 为前缀的占位符。这些是模板中的定制点，需要替换为真实值（例如：`~~Jira` → `Asana`，`~~your-team-channel` → `#engineering`）。

**2. 局部定制** — 不存在 `~~` 占位符，且用户要求定制插件的特定部分（例如：“定制连接器”、“更新 standup 命令”、“更改工单工具”）。阅读插件文件以找到相关部分，并仅关注这些部分。不要扫描整个插件或展示无关的定制项。

**3. 全面定制** — 不存在 `~~` 占位符，且用户希望广泛修改插件。阅读插件文件以了解其当前配置，然后询问用户想要更改什么。

> **重要提示**：切勿更改正在定制的插件或技能的名称。不要重命名目录、文件或插件/技能名称字段。

> **非技术性输出**：所有面向用户的输出（待办事项列表、问题、总结）必须使用通俗易懂的非技术语言编写。切勿向用户提及 `~~` 前缀、占位符或定制点。请根据插件的功能和组织的工具来描述所有内容。

## 定制工作流

### 第 0 阶段：收集用户意图（仅限局部定制和全面定制）

对于**局部定制**和**全面定制**（非通用插件设置），检查用户是否在请求中提供了自由格式的背景信息（例如：“定制 standup 命令——我们每天早上在 #eng-updates 频道进行异步站会”）。

* **如果用户提供了背景信息**：记录并使用它在第 3 阶段预填答案——跳过询问用户已回答过的问题。
* **如果用户未提供背景信息**：在继续之前使用 AskUserQuestion 询问一个开放式问题。根据他们的定制请求量身定制问题——例如：“对于 brief 命令，您有什么具体的修改想法吗？”或“您想对该插件的工作方式进行哪些更改？”保持简短并针对其请求。
将他们的回答（如有）作为后续阶段的额外背景信息。

### 第 1 阶段：从知识库 MCP 收集背景信息

使用组织内部知识库 MCP 收集与定制范围相关的背景信息。有关按类别划分的详细查询模式，请参阅 `references/search-strategies.md`。

**需要收集的信息**（视范围而定）：

* 组织使用的工具名称和服务
* 组织流程和工作流
* 团队惯例（命名、状态、评估规模）
* 配置值（工作区 ID、项目名称、团队标识符）

**搜索来源：**

1. **聊天/Slack MCP** — 工具提及、集成、工作流讨论
2. **文档 MCP** — 入职文档、工具指南、设置说明
3. **邮件 MCP** — 许可证通知、管理员邮件、设置邀请

记录所有发现以供第 3 阶段使用。

### 第 2 阶段：创建待办事项列表

构建要执行的更改清单，并进行适当的范围限定：

* **对于局部定制**：仅包含与用户要求的特定部分相关的项目。
* **对于通用插件设置**：运行 `grep -rn '~~\w' /path/to/plugin --include='*.md' --include='*.json'` 查找所有占位符定制点。按主题对其进行分组。
* **对于全面定制**：阅读插件文件，了解当前配置，并根据用户的请求确定需要更改的内容。

使用以插件用途为核心的、用户友好的描述：

* **推荐**： “了解公司如何进行站会准备”
* **不推荐**： “替换 commands/standup-prep.md 中的占位符”

### 第 3 阶段：完成待办事项

利用第 0 阶段和第 1 阶段的背景信息，逐项完成任务。

**如果用户的输入（第 0 阶段）或知识库 MCP（第 1 阶段）提供了明确答案**：直接应用，无需确认。

**否则**：使用 AskUserQuestion。不要假设“行业标准”默认值是正确的——如果用户输入和知识库 MCP 都没有提供具体答案，请询问。注意：AskUserQuestion 始终包含“跳过”按钮和自定义答案文本框，因此不要包含 `无` 或 `其他` 选项。

**更改类型：**

1. **占位符替换**（通用设置）：`~~Jira` → `Asana`，`~~your-org-channel` → `#engineering`
2. **内容更新**：修改指令、命令、工作流或引用，以匹配组织情况
3. **URL 模式更新**：`tickets.example.com/your-team/123` → `app.asana.com/0/PROJECT_ID/TASK_ID`
4. **配置值**：工作区 ID、项目名称、团队标识符

如果用户不知道或跳过，请保持原值不变（或保留通用设置中的 `~~` 前缀占位符）。

### 第 4 阶段：搜索有用的 MCP

完成定制项后，为已识别或已更改的任何工具连接 MCP。有关完整工作流、类别与关键字的映射以及配置文件格式，请参阅 `references/mcp-servers.md`。

对于定制过程中识别出的每个工具：

1. 搜索注册表：使用 `references/mcp-servers.md` 中的类别关键字执行 `search_mcp_registry(keywords=[...])`，或者如果已知工具名称，则直接搜索。
2. 如果未连接：执行 `suggest_connectors(directoryUuids=["chosen-uuid"])` — 用户完成授权。
3. 更新插件的 MCP 配置文件（检查 `plugin.json` 中的自定义位置，否则为根目录下的 `.mcp.json`）。

收集所有 MCP 结果并在总结输出中统一展示（见下文）——不要在此阶段逐个展示 MCP。

## 封装插件

应用所有定制后，将插件封装为 `.plugin` 文件供用户使用：

1. **压缩插件目录**（排除不再需要的 `setup/`）：
```bash
cd /path/to/plugin && zip -r /tmp/plugin-name.plugin . -x "setup/*" && cp /tmp/plugin-name.plugin /path/to/outputs/plugin-name.plugin

```


2. **向用户提供带有 `.plugin` 扩展名的文件**，以便他们可以直接安装。（向用户展示 .plugin 文件时，会显示一个丰富的预览界面，用户可以在其中浏览插件文件，并可以通过点击按钮接受定制。）

> **重要提示**：务必先在 `/tmp/` 中创建 zip，然后复制到输出文件夹。由于权限问题，直接写入输出文件夹可能会失败并留下临时文件。

> **命名**：为 `.plugin` 文件使用原始插件目录名称（例如：如果插件目录是 `coder`，输出文件应为 `coder.plugin`）。在定制过程中不要重命名插件或其文件——仅替换占位符值并更新内容。

## 总结输出

定制完成后，向用户展示按来源分组的发现总结。务必包含 MCP 部分，显示在设置期间连接了哪些 MCP，以及用户仍应连接哪些 MCP：

```markdown
## 从 Slack 搜索中发现
- 您使用 Asana 进行项目管理
- 冲刺（Sprint）周期为 2 周

## 从文档搜索中发现
- 故事点使用 T 恤尺码

## 根据您的回答
- 工单状态包括：Backlog、进行中、审核中、已完成

```

然后展示在设置期间连接的 MCP 以及用户仍应连接的任何 MCP，并附上如何连接的说明。

如果第 1 阶段没有可用的知识库 MCP，且用户必须手动回答至少一个问题，请在末尾添加一条说明：

> 顺便提一下，下次定制插件时，如果连接了 Slack 或 Microsoft Teams 等来源，我就可以自动找到答案。

## 附加资源

* **`references/mcp-servers.md`** — MCP 发现工作流、类别与关键字映射、配置文件位置
* **`references/search-strategies.md`** — 用于查找工具名称和组织值的知识库 MCP 查询模式
* **`examples/customized-mcp.json`** — 完整配置的 `.mcp.json` 示例

- 📌 skills/cowork-plugin-customizer/examples/customized-mcp.json

```json
{
  "mcpServers": {
    "github": {
      "type": "http",
      "url": "https://api.githubcopilot.com/mcp/",
      "headers": {
        "Authorization": "Bearer ${GITHUB_TOKEN}"
      }
    },
    "asana": {
      "type": "sse",
      "url": "https://mcp.asana.com/sse"
    },
    "slack": {
      "type": "http",
      "url": "https://slack.mcp.claude.com/mcp"
    },
    "figma": {
      "type": "http",
      "url": "https://mcp.figma.com/mcp"
    },
    "datadog": {
      "type": "http",
      "url": "https://api.datadoghq.com/mcp",
      "headers": {
        "DD-API-KEY": "${DATADOG_API_KEY}",
        "DD-APPLICATION-KEY": "${DATADOG_APP_KEY}"
      }
    }
  },
  "recommendedCategories": [
    "source-control",
    "project-management",
    "chat",
    "documents",
    "wiki-knowledge-base",
    "design-graphics",
    "analytics-bi"
  ]
}
```

- 📌 skills/cowork-plugin-customizer/references/mcp-servers.md

# MCP 发现与连接

如何在插件定制过程中查找并连接 MCP。

## 可用工具

### `search_mcp_registry`

在 MCP 目录中搜索可用的连接器。

**输入：** `{ "keywords": ["搜索", "关键词", "数组"] }`

**输出：** 最多 10 条结果，每条包含：

* `name`: MCP 显示名称
* `description`: 简短描述
* `tools`: 该 MCP 提供的工具列表
* `url`: MCP 终端 URL（用于 `.mcp.json`）
* `directoryUuid`: 用于 `suggest_connectors` 的 UUID
* `connected`: 布尔值 - 用户是否已连接此 MCP

### `suggest_connectors`

显示“连接”按钮，允许用户安装/连接 MCP。

**输入：** `{ "directoryUuids": ["uuid1", "uuid2"] }`

**输出：** 为每个 MCP 渲染带有“连接”按钮的 UI

## 类别与关键字映射表

| 类别 | 搜索关键字 |
| --- | --- |
| `project-management` (项目管理) | `["asana", "jira", "linear", "monday", "tasks"]` |
| `software-coding` (软件编程) | `["github", "gitlab", "bitbucket", "code"]` |
| `chat` (聊天) | `["slack", "teams", "discord"]` |
| `documents` (文档) | `["google docs", "notion", "confluence"]` |
| `calendar` (日历) | `["google calendar", "calendar"]` |
| `email` (电子邮件) | `["gmail", "outlook", "email"]` |
| `design-graphics` (设计制图) | `["figma", "sketch", "design"]` |
| `analytics-bi` (分析与商业智能) | `["datadog", "grafana", "analytics"]` |
| `crm` (客户关系管理) | `["salesforce", "hubspot", "crm"]` |
| `wiki-knowledge-base` (维基知识库) | `["notion", "confluence", "outline", "wiki"]` |
| `data-warehouse` (数据仓库) | `["bigquery", "snowflake", "redshift"]` |
| `conversation-intelligence` (会话智能) | `["gong", "chorus", "call recording"]` |

## 工作流

1. **查找定制点**：寻找以 `~~` 为前缀的值（例如：`~~Jira`）。
2. **检查前期阶段的发现**：是否已经了解到他们使用哪种工具？
* **是**：搜索该特定工具以获取其 `url`，跳至第 5 步。
* **否**：继续执行第 3 步。


3. **搜索**：使用映射的关键字调用 `search_mcp_registry`。
4. **展示选项并询问用户**：展示所有结果，询问用户使用哪一个。
5. **必要时连接**：如果未连接，调用 `suggest_connectors`。
6. **更新 MCP 配置**：使用搜索结果中的 `url` 添加配置。

## 更新插件 MCP 配置

### 查找配置文件

1. **检查 `plugin.json`** 中的 `mcpServers` 字段：
```json
{
  "name": "my-plugin",
  "mcpServers": "./config/servers.json"
}

```


如果存在，请编辑该路径下的文件。
2. **如果没有 `mcpServers` 字段**，请使用插件根目录下的 `.mcp.json`（默认值）。
3. **如果 `mcpServers` 仅指向 `.mcpb` 文件**（捆绑服务器），请在插件根目录下创建一个新的 `.mcp.json`。

### 配置文件格式

支持包装（Wrapped）和未包装（Unwrapped）格式：

```json
{
  "mcpServers": {
    "github": {
      "type": "http",
      "url": "https://api.githubcopilot.com/mcp/"
    }
  }
}

```

请使用 `search_mcp_registry` 结果中的 `url` 字段。

### 无 URL 的目录项

某些目录项没有 `url`，因为其终端是动态的——由管理员在连接服务器时提供。这些服务器仍可以通过**名称**在插件的 MCP 配置中引用：如果配置中的 MCP 服务器名称与目录项名称匹配，则其处理方式与 URL 匹配相同。

- 📌 skills/cowork-plugin-customizer/references/search-strategies.md

# 知识库 MCP 搜索策略

在插件定制过程中收集组织背景信息的查询模式。

## 查找工具名称

**源码控制：**

* 搜索："GitHub" OR "GitLab" OR "Bitbucket"
* 搜索："pull request" OR "merge request" (拉取请求或合并请求)
* 寻找：代码库链接、CI/CD 相关的提及

**项目管理：**

* 搜索："Asana" OR "Jira" OR "Linear" OR "Monday"
* 搜索："sprint" AND "tickets" (冲刺与工单)
* 寻找：任务链接、项目看板相关的提及

**即时通讯：**

* 搜索："Slack" OR "Teams" OR "Discord"
* 寻找：频道提及、集成讨论

**数据分析：**

* 搜索："Datadog" OR "Grafana" OR "Mixpanel"
* 搜索："monitoring" OR "observability" (监控或可观测性)
* 寻找：仪表板链接、告警配置

**设计：**

* 搜索："Figma" OR "Sketch" OR "Adobe XD"
* 寻找：设计文件链接、交付讨论

**客户关系管理 (CRM)：**

* 搜索："Salesforce" OR "HubSpot"
* 寻找：交易提及、客户记录链接

## 查找组织特定值

**工作区/项目 ID：**

* 搜索现有的集成信息或书签链接
* 寻找管理员/设置文档

**团队惯例：**

* 搜索："story points" (故事点) OR "estimation" (估算)
* 搜索："workflow" (工作流) OR "ticket status" (工单状态)
* 寻找工程流程文档

**频道/团队名称：**

* 搜索："standup" (站会) OR "engineering" (工程) OR "releases" (发布)
* 寻找频道命名模式

## 当知识库 MCP 不可用时

如果未配置任何知识库 MCP，请跳过自动发现阶段，直接针对所有类别使用 AskUserQuestion 询问用户。注意：AskUserQuestion 始终包含“跳过”按钮和自定义答案文本框，因此不要在选项中包含 `无` 或 `其他`。

- 📌 skills/create-cowork-plugin/SKILL.md

---

## name: create-cowork-plugin description: > 引导用户在 Cowork 会话中从零开始创建一个新插件。 当用户想要创建插件、构建插件、制作新插件、开发插件、搭建插件脚手架、从头开始启动插件或设计插件时使用。 此技能需要 Cowork 模式，并能访问 outputs 目录，以便交付最终的 .plugin 文件。 compatibility: 需要 Cowork 桌面应用环境，并能访问用于交付 .plugin 文件的 outputs 目录。

# 创建 Cowork 插件

通过引导式对话从零开始构建一个新插件。引导用户完成发现、规划、设计、实现和封装的全过程，并在最后交付一个可直接安装的 `.plugin` 文件。

## 概览

插件是一个独立的目录，通过命令 (Commands)、技能 (Skills)、智能体 (Agents)、钩子 (Hooks) 和 MCP 服务器集成来扩展 Claude 的能力。本技能包含了完整的插件架构以及通过对话创建插件的五个阶段工作流。

流程如下：

1. **需求发现** — 了解用户想要构建什么
2. **组件规划** — 确定需要哪些类型的组件
3. **设计与澄清** — 详细定义每个组件
4. **实现** — 创建所有插件文件
5. **评审与封装** — 交付 `.plugin` 文件

> **非技术性输出**：所有面向用户的对话请使用通俗易懂的语言。除非用户主动询问，否则不要暴露实现细节（如文件路径、目录结构或 Schema 字段）。请围绕“插件将实现什么功能”来描述所有内容。

## 插件架构

### 目录结构

每个插件都遵循以下布局：

```
plugin-name/
├── .claude-plugin/
│   └── plugin.json           # 必填：插件清单文件
├── commands/                 # 斜杠命令 (.md 文件)
├── agents/                   # 子智能体定义 (.md 文件)
├── skills/                   # 技能（带有 SKILL.md 的子目录）
│   └── skill-name/
│       ├── SKILL.md
│       └── references/
├── .mcp.json                 # MCP 服务器定义
└── README.md                 # 插件文档

```

**规范：**

* `.claude-plugin/plugin.json` 始终是必填项。
* 组件目录（`commands/`、`agents/`、`skills/`）位于插件根目录下，而不是在 `.claude-plugin/` 内部。
* 仅为插件实际使用的组件创建目录。
* 所有目录和文件名均使用短横线命名法 (kebab-case)。

### plugin.json 清单

位于 `.claude-plugin/plugin.json`。最少必填字段为 `name`。

```json
{
  "name": "plugin-name",
  "version": "0.1.0",
  "description": "插件用途的简要说明",
  "author": {
    "name": "作者名称"
  }
}

```

**命名规则：** 短横线命名法 (kebab-case)，小写字母加连字符，不含空格或特殊字符。
**版本号：** 语义化版本格式 (MAJOR.MINOR.PATCH)。从 `0.1.0` 开始。

可选字段：`homepage` (主页), `repository` (仓库), `license` (许可证), `keywords` (关键字)。

可以指定自定义组件路径（作为自动发现的补充而非替代）：

```json
{
  "commands": "./custom-commands",
  "agents": ["./agents", "./specialized-agents"],
  "hooks": "./config/hooks.json",
  "mcpServers": "./.mcp.json"
}

```

### 组件 Schema

每种组件类型的详细 Schema 见 `references/component-schemas.md`。摘要如下：

| 组件 | 位置 | 格式 |
| --- | --- | --- |
| 命令 (Commands) | `commands/*.md` | Markdown + YAML 前置元数据 |
| 技能 (Skills) | `skills/*/SKILL.md` | Markdown + YAML 前置元数据 |
| MCP 服务器 | `.mcp.json` | JSON |
| 智能体 (Agents) | `agents/*.md` | Markdown + YAML 前置元数据 |
| 钩子 (Hooks) | `hooks/hooks.json` | JSON |

此 Schema 与 Claude Code 插件系统共享，但您是在为 Claude Cowork（一个用于知识工作的桌面应用）创建插件。
Cowork 用户通常会发现“命令”和“技能”最为实用。

### 使用 `~~` 占位符的可定制插件

> **默认情况下不要使用或询问此模式。** 只有当用户明确表示希望组织以外的人员使用该插件时，才引入 `~~` 占位符。
> 如果用户似乎想要对外分发插件，您可以提到这是一个选项，但不要主动通过 AskUserQuestion 询问。

当插件旨在与公司外部人员共享时，可能需要适配不同用户的部分。
您可能需要按类别而非特定产品引用外部工具（例如使用“项目追踪器”而非“Jira”）。
当需要共享时，请使用通用语言，并使用两个波浪号标记这些需要定制的部分，例如 `在 ~~project tracker 中创建任务`。
如果使用了任何工具类别，请在插件根目录编写一个 `CONNECTORS.md` 文件进行说明：

```markdown
# 连接器 (Connectors)

## 工具引用工作原理

插件文件使用 `~~类别` 作为用户在该类别下连接的任何工具的占位符。
插件与具体工具无关——它们根据类别而非特定产品来描述工作流。

## 此插件的连接器

| 类别 | 占位符 | 选项 |
|----------|-------------|-----------------|
| 聊天 | `~~chat` | Slack, Microsoft Teams, Discord |
| 项目追踪器 | `~~project tracker` | Linear, Asana, Jira |

```

### ${CLAUDE_PLUGIN_ROOT} 变量

在钩子和 MCP 配置中，所有插件内部路径引用均使用 `${CLAUDE_PLUGIN_ROOT}`。切勿硬编码绝对路径。

## 引导式工作流

向用户询问时，请使用 AskUserQuestion。不要假设“行业标准”默认值是正确的。注意：AskUserQuestion 始终包含“跳过”按钮和自定义答案文本框，因此不要包含 `无` 或 `其他` 选项。

### 第 1 阶段：需求发现

**目标**：了解用户想要构建什么以及原因。

提问（仅针对不明确的部分——如果用户的初始请求已回答，则跳过）：

* 这个插件应该做什么？它解决什么问题？
* 谁会使用它？在什么场景下使用？
* 它是否需要与任何外部工具或服务集成？
* 是否有类似的插件或工作流可以参考？

总结理解并确认后继续。

**输出**：关于插件用途和范围的清晰说明。

### 第 2 阶段：组件规划

**目标**：确定插件需要哪些类型的组件。

根据需求发现阶段的回答，确定：

* **技能 (Skills)** — 它是否需要 Claude 按需加载的专业知识？（领域专家知识、参考 Schema、工作流指南）
* **命令 (Commands)** — 是否有用户发起的动作？（部署、配置、分析、评审）
* **MCP 服务器** — 是否需要外部服务集成？（数据库、API、SaaS 工具）
* **智能体 (Agents)（不常用）** — 是否有自主的多步任务？（验证、生成、分析）
* **钩子 (Hooks)（罕见）** — 是否需要在特定事件发生时自动执行操作？（执行策略、加载上下文、验证操作）

展示组件规划表，包括您决定不创建的组件类型：

```
| 组件         | 数量 | 用途 |
|-------------|------|---------|
| 技能 (Skills)   | 1 | X 领域的知识 |
| 命令 (Commands) | 2 | /do-thing, /check-thing |
| 智能体 (Agents) | 0 | 不需要 |
| 钩子 (Hooks)    | 1 | 验证写入操作 |
| MCP 服务器      | 1 | 连接到服务 Y |

```

在继续之前获得用户的确认或调整建议。

**输出**：确认要创建的组件列表。

### 第 3 阶段：设计与澄清

**目标**：详细定义每个组件。在实现前解决所有模糊点。

针对计划中的每种组件类型，提出针对性的设计问题。按组件类型分组展示问题。等待回答后再继续。

**技能 (Skills)：**

* 哪些用户查询应该触发此技能？
* 它涵盖哪些知识领域？
* 是否应包含详细内容的参考文件？

**命令 (Commands)：**

* 每个命令接受哪些参数？
* 每个命令需要什么工具？（Read, Write, Bash, Grep 等）
* 命令是交互式的还是自动化的？

**智能体 (Agents)：**

* 智能体应该是主动触发还是仅在请求时触发？
* 它需要什么工具？
* 输出格式应该是怎样的？

**钩子 (Hooks)：**

* 针对哪些事件？（PreToolUse, PostToolUse, Stop, SessionStart 等）
* 执行什么行为 — 验证、拦截、修改、添加上下文？
* 基于提示词（LLM 驱动）还是基于命令（确定性脚本）？

**MCP 服务器：**

* 服务器类型？（本地 stdio，带 OAuth 的托管型 SSE，REST API 的 HTTP）
* 认证方式？
* 应该暴露哪些工具？

如果用户说“按你认为最好的来”，请提供具体的建议并获得明确确认。

**输出**：每个组件的详细规格说明。

### 第 4 阶段：实现

**Goal**: 遵循最佳实践创建所有插件文件。

**操作顺序：**

1. 创建插件目录结构
2. 创建 `plugin.json` 清单文件
3. 创建各个组件（参考 `references/component-schemas.md` 获取准确格式）
4. 创建 `README.md` 以记录插件信息

**实现指南：**

* **命令 (Commands)** 是给 Claude 的指令，不是给用户的消息。将其编写为关于“该做什么”的指令。
* **技能 (Skills)** 使用渐进式披露：SKILL.md 正文保持精简（3000 字以内），详细内容放在 `references/` 目录中。前置元数据描述必须使用第三人称并包含特定触发词。
* **智能体 (Agents)** 需要包含 `<example>` 块的描述以展示触发条件，并在 Markdown 正文中包含系统提示词。
* **钩子 (Hooks)** 配置位于 `hooks/hooks.json`。脚本路径使用 `${CLAUDE_PLUGIN_ROOT}`。复杂逻辑优先使用基于提示词的钩子。
* **MCP 配置** 位于插件根目录的 `.mcp.json`。本地服务器路径使用 `${CLAUDE_PLUGIN_ROOT}`。在 README 中记录所需的环境变量。

### 第 5 阶段：评审与封装

**目标**：交付完成的插件。

1. 总结创建的内容 — 列出每个组件及其用途
2. 询问用户是否需要调整
3. 运行 `claude plugin validate <插件清单路径>`；修复任何错误和警告
4. 封装为 `.plugin` 文件：

```bash
cd /path/to/plugin-dir && zip -r /tmp/plugin-name.plugin . -x "*.DS_Store" && cp /tmp/plugin-name.plugin /path/to/outputs/plugin-name.plugin

```

> **重要提示**：务必先在 `/tmp/` 中创建 zip，然后复制到输出文件夹。由于权限问题，直接写入输出文件夹可能会失败。

> **命名**：为 `.plugin` 文件使用 `plugin.json` 中的插件名称（例如：如果名称是 `code-reviewer`，则输出 `code-reviewer.plugin`）。

`.plugin` 文件将作为丰富预览出现在聊天中，用户可以浏览文件并点击按钮接受插件。

## 最佳实践

* **从小处着手**：从最小可行组件集开始。一个制作精良的技能比五个半成品组件更有用。
* **技能的渐进式披露**：核心知识放在 SKILL.md，详细参考资料放在 `references/`，运行示例放在 `examples/`。
* **清晰的触发短语**：技能描述应包含用户会说的具体短语。智能体描述应包含 `<example>` 块。
* **命令是写给 Claude 的**：将命令内容编写为 Claude 遵循的指令，而不是用户阅读的文档。
* **祈使句式写作风格**：在技能中使用动词开头的指令（“解析配置文件”，而不是“你应该解析配置文件”）。
* **可移植性**：插件内部路径始终使用 `${CLAUDE_PLUGIN_ROOT}`，切勿使用硬编码路径。
* **安全性**：使用环境变量存储凭据，远程服务器使用 HTTPS，遵循最小权限原则访问工具。

## 附加资源

* **`references/component-schemas.md`** — 每种组件类型的详细格式规范（命令、技能、智能体、钩子、MCP、CONNECTORS.md）
* **`references/example-plugins.md`** — 三种不同复杂程度的完整示例插件结构

- 📌 skills/create-cowork-plugin/references/component-schemas.md

# 组件 Schema (Component Schemas)

各类插件组件的详细格式规范。在第 4 阶段（实现阶段）编写组件时请参考此文档。

## 命令 (Commands)

**位置**：`commands/command-name.md`
**格式**：带有可选 YAML 前置元数据 (Frontmatter) 的 Markdown

### 前置元数据字段

| 字段 | 必填 | 类型 | 描述 |
| --- | --- | --- | --- |
| `description` | 否 | 字符串 | 在 `/help` 中显示的简短描述（60 字符以内） |
| `allowed-tools` | 否 | 字符串或数组 | 该命令允许调用的工具 |
| `model` | 否 | 字符串 | 强制指定的模型：`sonnet`, `opus`, `haiku` |
| `argument-hint` | 否 | 字符串 | 文档化预期参数以实现自动补全 |

### 命令示例

```markdown
---
description: 评审代码是否存在安全问题
allowed-tools: Read, Grep, Bash(git:*)
argument-hint: [文件路径]
---

请评审 @$1 中的安全漏洞，包括：
- SQL 注入
- XSS 攻击
- 身份验证绕过
- 不安全的数据处理

请提供具体的行号、严重性评级和修复建议。

```

### 核心规则

* **命令是写给 Claude 的指令**，不是发给用户的消息。请使用指令式语气。
* `$ARGUMENTS` 将所有参数捕获为一个字符串；`$1`, `$2`, `$3` 捕获位置参数。
* `@path` 语法会将文件内容包含在命令上下文中。
* `!` 反引号语法用于执行内联 bash 命令以获取动态上下文（例如：`!`git diff --name-only``）。
* 使用 `${CLAUDE_PLUGIN_ROOT}` 以便以可移植的方式引用插件内部文件。

### allowed-tools 模式

```yaml
# 指定工具
allowed-tools: Read, Write, Edit, Bash(git:*)

# 仅允许带有特定指令的 Bash
allowed-tools: Bash(npm:*), Read

# MCP 工具 (特定)
allowed-tools: ["mcp__plugin_name_server__tool_name"]

```

## 技能 (Skills)

**位置**：`skills/skill-name/SKILL.md`
**格式**：带有 YAML 前置元数据的 Markdown

### 前置元数据字段

| 字段 | 必填 | 类型 | 描述 |
| --- | --- | --- | --- |
| `name` | 是 | 字符串 | 技能标识符 |
| `description` | 是 | 字符串 | 包含触发短语的第三人称描述 |
| `version` | 否 | 字符串 | 语义化版本号 |

### 技能示例

```yaml
---
name: api-design
description: >
  当用户要求“设计 API”、“创建 API 端点”、“评审 API 结构”，
  或需要关于 REST API 最佳实践、端点命名、请求/响应设计方面的指导时，
  应使用此技能。
version: 0.1.0
---

```

### 写作风格规则

* **前置元数据描述**：使用第三人称（“当……时，应使用此技能”），并将具体的触发短语放在引号内。
* **正文**：使用祈使句/动词原形（“解析配置文件”，而不是“你应该解析配置文件”）。
* **长度**：SKILL.md 正文保持在 3,000 字以内（理想为 1,500-2,000 字）。详细内容请移至 `references/` 目录。

### 技能目录结构

```
skill-name/
├── SKILL.md              # 核心知识（必填）
├── references/           # 按需加载的详细文档
│   ├── patterns.md
│   └── advanced.md
├── examples/             # 可运行的代码示例
│   └── sample-config.json
└── scripts/              # 辅助脚本
    └── validate.sh

```

### 渐进式披露级别

1. **元数据**（始终在上下文中）：名称 + 描述（约 100 字）
2. **SKILL.md 正文**（技能触发时加载）：核心知识（<5,000 字）
3. **捆绑资源**（按需加载）：参考资料、示例、脚本（无限制）

## 智能体 (Agents)

**位置**：`agents/agent-name.md`
**格式**：带有 YAML 前置元数据的 Markdown

### 前置元数据字段

| 字段 | 必填 | 类型 | 描述 |
| --- | --- | --- | --- |
| `name` | 是 | 字符串 | 小写、短横线命名、3-50 字符 |
| `description` | 是 | 字符串 | 包含 `<example>` 块的触发条件描述 |
| `model` | 是 | 字符串 | `inherit`, `sonnet`, `opus`, 或 `haiku` |
| `color` | 是 | 字符串 | `blue`, `cyan`, `green`, `yellow`, `magenta`, `red` |
| `tools` | 否 | 数组 | 限制可使用的特定工具 |

### 智能体示例

```markdown
---
name: code-reviewer
description: 当用户要求进行彻底的代码评审，或需要对代码质量、安全性和最佳实践进行详细分析时，请使用此智能体。

<example>
上下文：用户刚刚编写了一个新模块
user: "你能深入评审一下这段代码吗？"
assistant: "我将使用 code-reviewer 智能体来提供透彻的分析。"
<commentary>
用户明确要求详细评审，这符合该智能体的专业领域。
</commentary>
</example>

model: inherit
color: blue
tools: ["Read", "Grep", "Glob"]
---

你是一位代码评审专家，专注于发现安全、性能、可维护性和正确性方面的问题。

**你的核心职责：**
1. 分析代码结构和组织
2. 识别安全漏洞
3. 指出性能隐患
4. 检查是否符合最佳实践

...（后续系统提示词内容）

```

## 钩子 (Hooks)

**位置**：`hooks/hooks.json`
**格式**：JSON

### 可用事件

| 事件 | 触发时机 |
| --- | --- |
| `PreToolUse` | 工具调用执行前 |
| `PostToolUse` | 工具调用完成后 |
| `Stop` | Claude 完成回复时 |
| `SessionStart` | 会话开始时 |
| `UserPromptSubmit` | 用户发送消息时 |

### 钩子类型

**基于提示词 (Prompt-based)**（推荐用于复杂逻辑）：

```json
{
  "type": "prompt",
  "prompt": "评估此文件写入是否符合项目惯例：$TOOL_INPUT",
  "timeout": 30
}

```

**基于命令 (Command-based)**（用于确定性检查）：

```json
{
  "type": "command",
  "command": "bash ${CLAUDE_PLUGIN_ROOT}/hooks/scripts/validate.sh",
  "timeout": 60
}

```

## MCP 服务器

**位置**：插件根目录下的 `.mcp.json`
**格式**：JSON

### 服务器类型

**stdio**（本地进程）：

```json
{
  "mcpServers": {
    "my-server": {
      "command": "node",
      "args": ["${CLAUDE_PLUGIN_ROOT}/servers/server.js"]
    }
  }
}

```

**SSE / HTTP**（远程服务器）：

```json
{
  "mcpServers": {
    "asana": {
      "type": "sse",
      "url": "https://mcp.asana.com/sse"
    }
  }
}

```

### 环境变量扩展

所有 MCP 配置均支持 `${VAR_NAME}` 替换：

* `${CLAUDE_PLUGIN_ROOT}` — 插件目录（为了可移植性，请务必使用此变量）
* `${ANY_ENV_VAR}` — 用户环境变量

## CONNECTORS.md

**位置**：插件根目录
**适用场景**：当插件按“类别”而非“具体产品”引用外部工具时创建。

### 格式示例

```markdown
# 连接器 (Connectors)

## 工具引用工作原理

插件文件使用 `~~category` 作为用户在该类别下连接的任何工具的占位符。
例如，`~~project tracker` 可能代表 Asana、Linear 或 Jira。

## 此插件的连接器

| 类别 | 占位符 | 包含的服务器 | 其他选项 |
|----------|-------------|-----------------|---------------|
| 聊天 | `~~chat` | Slack | Microsoft Teams, Discord |

```

## README.md

每个插件都应包含一个 README，涵盖：

1. **概览** — 插件的功能
2. **组件** — 命令、技能、智能体等列表
3. **设置** — 所需的环境变量或配置
4. **用法** — 如何使用命令或触发技能

- 📌 skills/create-cowork-plugin/references/example-plugins.md

# 插件示例 (Example Plugins)

这里提供了三个不同复杂度层级的完整插件结构。在执行第 4 阶段的实施时，请将这些作为模板使用。

## 基础插件：单一命令 (Minimal Plugin)

一个仅包含一个斜杠命令（slash command）且无其他组件的简单插件。

### 目录结构

```
meeting-notes/
├── .claude-plugin/
│   └── plugin.json
├── commands/
│   └── meeting-notes.md
└── README.md

```

### plugin.json

```json
{
  "name": "meeting-notes",
  "version": "0.1.0",
  "description": "根据会议录音文本生成结构化的会议纪要",
  "author": {
    "name": "用户"
  }
}

```

### commands/meeting-notes.md

```markdown
---
description: 从录音文本生成结构化的会议纪要
argument-hint: [录音文件路径]
allowed-tools: Read, Write
---

读取位于 @$1 的录音文本并生成结构化的会议纪要。

需包含以下章节：
1. **参会人员** — 列出提及的所有参与者
2. **摘要** — 用 2-3 句话概述会议内容
3. **关键决策** — 决策事项的编号列表
4. **待办事项** — 包含以下列的表格：负责人、任务、截止日期
5. **未决问题** — 任何尚未解决的事项

将纪要写入一个新文件，文件名以原录音文件名命名并添加 `-notes` 后缀。

```

---

## 标准插件：技能 + 命令 + MCP (Standard Plugin)

结合了领域知识、用户命令以及外部服务集成的插件。

### 目录结构

```
code-quality/
├── .claude-plugin/
│   └── plugin.json
├── commands/
│   ├── review.md
│   └── fix-lint.md
├── skills/
│   └── coding-standards/
│       ├── SKILL.md
│       └── references/
│           └── style-rules.md
├── .mcp.json
└── README.md

```

### plugin.json

```json
{
  "name": "code-quality",
  "version": "0.1.0",
  "description": "通过评审、Lint 检查和风格指导强制执行代码规范",
  "author": {
    "name": "用户"
  }
}

```

### commands/review.md

```markdown
---
description: 评审代码更改中的风格和质量问题
allowed-tools: Read, Grep, Bash(git:*)
---

获取已更改的文件列表：!`git diff --name-only`

针对每个更改的文件：
1. 读取文件
2. 根据 coding-standards 技能检查是否存在风格违规
3. 识别潜在的 Bug 或反模式（anti-patterns）
4. 标记任何安全隐患

展示包含以下内容的摘要：
- 文件路径
- 问题严重程度（错误、警告、提示）
- 描述及修复建议

```

### commands/fix-lint.md

```markdown
---
description: 自动修复更改文件中的 Lint 问题
allowed-tools: Read, Write, Edit, Bash(npm:*)
---

运行 Linter：!`npm run lint -- --format json 2>&1`

解析 Linter 输出并修复每个问题：
- 对于可自动修复的问题，直接应用修复
- 对于需手动修复的问题，遵循项目规范进行修正
- 跳过需要架构变更的问题

完成所有修复后，再次运行 Linter 以确认输出已清洁。

```

### skills/coding-standards/SKILL.md

```yaml
---
name: coding-standards
description: >
  当用户询问“代码规范”、“风格指南”、“命名约定”、“代码格式化规则”
  或需要有关项目特定代码质量预期的指导时，应使用此技能。
version: 0.1.0
---

```

```markdown
# 代码规范 (Coding Standards)

项目代码规范和约定，用于保持代码的一致性和高质量。

## 核心规则

- 变量和函数使用 camelCase（小驼峰）
- 类和类型使用 PascalCase（大驼峰）
- 优先使用 const 而非 let；严禁使用 var
- 最大行宽：100 字符
- 所有导出的函数必须有明确的返回类型

## 导入顺序

1. 外部包（External packages）
2. 内部包（使用 @/ 别名）
3. 相对路径导入
4. 仅类型导入（Type-only imports）排在最后

## 附加资源

- **`references/style-rules.md`** — 按语言分类的完整风格规则

```

### .mcp.json

```json
{
  "mcpServers": {
    "github": {
      "type": "http",
      "url": "https://api.githubcopilot.com/mcp/"
    }
  }
}

```

---

## 全功能插件：所有组件类型 (Full-Featured Plugin)

一个综合使用技能、命令、智能体（Agent）、钩子（Hook）以及带有工具无关连接器（Connectors）的 MCP 集成插件。

### 目录结构

```
engineering-workflow/
├── .claude-plugin/
│   └── plugin.json
├── commands/
│   ├── standup-prep.md
│   └── create-ticket.md
├── skills/
│   └── team-processes/
│       ├── SKILL.md
│       └── references/
│           └── workflow-guide.md
├── agents/
│   └── ticket-analyzer.md
├── hooks/
│   └── hooks.json
├── .mcp.json
├── CONNECTORS.md
└── README.md

```

### plugin.json

```json
{
  "name": "engineering-workflow",
  "version": "0.1.0",
  "description": "优化工程工作流：站会准备、工单管理和代码质量",
  "author": {
    "name": "用户"
  },
  "keywords": ["工程", "工作流", "工单", "站会"]
}

```

### agents/ticket-analyzer.md

```markdown
---
name: ticket-analyzer
description: 当用户需要分析工单、分类新问题或排列积压任务（Backlog）优先级时，使用此智能体。

<example>
上下文：用户正在准备 Sprint 规划会议
用户："帮我分类这些新工单"
助手："我将使用 ticket-analyzer 智能体来审查并分类这些工单。"
<commentary>
工单分类需要多维度的系统分析，因此使用智能体非常合适。
</commentary>
</example>

<example>
上下文：用户有大量的积压任务
用户："为我下个 Sprint 的积压任务排列优先级"
助手："让我使用 ticket-analyzer 智能体分析积压任务并提供优先级建议。"
<commentary>
积压任务优先级排序是一个多步骤的自主任务，非常适合智能体处理。
</commentary>
</example>

model: inherit
color: cyan
tools: ["Read", "Grep"]
---

你是一名工单分析专家。负责分析工单的优先级、工作量和依赖关系。

**核心职责：**
1. 按类型分类工单（Bug、新功能、技术债、改进）
2. 估算相对工作量（S, M, L, XL）
3. 识别工单间的依赖关系
4. 推荐优先级排序

**分析流程：**
1. 阅读所有工单描述
2. 按类型进行分类
3. 根据范围估算工作量
4. 映射依赖关系
5. 按“影响与工作量比”进行排名

**输出格式：**
| 工单 | 类型 | 工作量 | 依赖关系 | 优先级 |
|------|------|--------|---------|-------|
| ...  | ...  | ...    | ...     | ...   |

最后附上针对前 5 项优先级的简要说明。

```

### hooks/hooks.json

```json
{
  "SessionStart": [
    {
      "matcher": "",
      "hooks": [
        {
          "type": "command",
          "command": "echo '## 团队上下文\n\nSprint 周期：2 周。站会：每日上午 9:30。使用 ~~project tracker 进行工单管理。'",
          "timeout": 5
        }
      ]
    }
  ]
}

```

### CONNECTORS.md

```markdown
# 连接器 (Connectors)

## 工具引用机制

插件文件使用 `~~category` 作为占位符，代表用户在该类别中连接的任何工具。插件本身是“工具无关”的。

## 此插件的连接器

| 类别 | 占位符 | 包含的服务 | 其他选项 |
|------|--------|-----------|---------|
| 项目追踪器 | `~~project tracker` | Linear | Asana, Jira, Monday |
| 聊天软件 | `~~chat` | Slack | Microsoft Teams |
| 源码控制 | `~~source control` | GitHub | GitLab, Bitbucket |

```

### .mcp.json

```json
{
  "mcpServers": {
    "linear": {
      "type": "sse",
      "url": "https://mcp.linear.app/sse"
    },
    "github": {
      "type": "http",
      "url": "https://api.githubcopilot.com/mcp/"
    },
    "slack": {
      "type": "http",
      "url": "https://slack.mcp.claude.com/mcp"
    }
  }
}

```
