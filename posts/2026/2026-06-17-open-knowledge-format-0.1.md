---
type: article
title:  "Open Knowledge Format (OKF)"
date:   2026-06-17 11:00:00 +0800
tags: [Open Knowledge Format, OKF, 知识表示, 智能体知识库]
---

**版本 0.1 — 草案**

OKF 是一种开放、对人类和智能体友好的格式，用于表示*知识*——即围绕数据和系统的元数据、上下文和精心整理的洞察。它旨在由人类编写、由智能体生成、跨组织交换，并由两者共同消费。

该格式有意保持极简：一个由 Markdown 文件和 YAML 前置元数据组成的目录。没有 Schema 注册中心，没有中央权威机构，也不需要任何特定工具。如果你能 `cat` 一个文件，你就能读取 OKF；如果你能 `git clone` 一个仓库，你就能分发它。

![](/images/2026/knowledge/okf.webp)

---

## 1. 动机

面向 AI 智能体的知识表示领域正在快速演进，许多互不兼容的约定正在涌现。OKF 的立场是，知识最好用常见、已建立的格式来表示，这些格式应具备以下特性：

- **无需工具即可被人类阅读**。
- **无需定制 SDK 即可被智能体解析**。
- **可在版本控制中进行差异比较**。
- **可跨工具、组织和时间迁移**。

该格式保持最低限度的主观性。它仅标准化一小套结构约定，使知识语料库能够*自我描述*——除此之外的一切留给生产者自行决定。

### 目标

1. 定义一种通用格式，**增强型智能体**可以写入其中。
2. 告知**消费型智能体**应如何读取和遍历它。
3. 促进知识跨系统和组织的**交换**。
4. 标准化少量**必需**字段，使内容能够被有意义地消费。

### 非目标

- 定义固定的概念类型分类体系。
- 规定存储、服务或查询基础设施。
- 取代领域特定 Schema（Avro、Protobuf、OpenAPI 等）——OKF *引用*它们，而非*包含*它们。

---

## 2. 术语

- **知识 Bundle** — 一个自包含的、层次化的知识文档集合。是分发单元。
- **概念** — Bundle 中的单个知识单元。以一个 Markdown 文档表示。可以描述有形资产（表、API），也可以描述抽象概念（指标、业务流程），或介于两者之间的任何事物。
- **概念 ID** — 概念文件在 Bundle 中的路径，去掉 `.md` 后缀。例如，`tables/users.md` 的概念 ID 是 `tables/users`。
- **前置元数据（Frontmatter）** — 位于 Markdown 文件顶部的 YAML 元数据块，由 `---` 分隔。
- **正文（Body）** — 前置元数据之后文件中的所有内容。
- **链接** — 从一个概念到另一个概念的标准 Markdown 链接，用于表达超出隐式父子层次结构的关系。
- **引用** — 从概念到支持正文中某个论断的外部来源的链接。

---

## 3. Bundle 结构

Bundle 是一个 Markdown 文件的目录树。目录结构与领域无关——生产者以任何适合所捕获知识的方式来组织概念。

```
path/to/bundle/
├── index.md                      # 可选。目录列表，用于渐进式展示。
├── log.md                        # 可选。更新的时序历史。
├── <concept>.md                  # Bundle 根目录下的概念。
└── <subdirectory>/               # 子目录将概念分组。
    ├── index.md
    ├── <concept>.md
    └── <subdirectory>/
        └── …
```

Bundle 可以按以下方式分发：

- git 仓库（推荐——提供历史、归属和差异比较）。
- 目录的 tarball 或 zip 压缩包。
- 更大仓库中的一个子目录。

### 3.1 保留文件名

以下文件名在层次结构的任何级别都有定义好的含义，**不得**用于概念文档：

| 文件名       | 用途                                                   |
|--------------|--------------------------------------------------------|
| `index.md`   | 目录列表。见 §6。                                       |
| `log.md`     | 更新历史。见 §7。                                       |

所有其他 `.md` 文件都是概念文档。

标签本身仍是一等概念——参见 §4.1 中的 `tags` 前置元数据字段。OKF 没有为按标签聚合文档指定单独的文件格式；希望提供标签浏览视图的生产者可以在消费时通过扫描前置元数据来合成。

---

## 4. 概念文档

每个概念都是一个 UTF-8 Markdown 文件。它包含两部分：

1. 一个 **YAML 前置元数据块**，由文件开头和结尾各一个独立行上的 `---` 分隔。
2. 一个 **Markdown 正文**，包含自由形式的内容。

### 4.1 前置元数据

```yaml
---
type: <类型名称>                  # 必需
title: <可选显示名称>
description: <可选单行摘要>
resource: <可选底层资产的规范 URI>
tags: [<标签>, <标签>, …]         # 可选
timestamp: <ISO 8601 日期时间>    # 可选最后修改时间
# … 其他生产者定义的键值对
---
```

**必需字段：**

- `type` — 一个短字符串，标识概念的种类。消费者用它来进行路由、过滤和展示。示例值：`BigQuery Table`、`BigQuery Dataset`、`API Endpoint`、`Metric`、`Playbook`、`Reference`。

  类型值**不**进行集中注册。生产者**应**选择描述性强且自解释的值；消费者**必须**优雅地容忍未知类型（通常将其视为通用概念）。

**推荐字段（按优先级排序）：**

- `title` — 人类可读的显示名称。如果省略，消费者**可以**从文件名派生标题。
- `description` — 一个单句摘要，总结该概念。被 `index.md` 生成器、搜索摘要和预览使用。
- `resource` — 一个 URI，唯一标识该概念所描述的底层资产。对于描述抽象概念而非物理资源的概念，此字段可省略。
- `tags` — 一个 YAML 短字符串列表，用于跨领域分类。
- `timestamp` — 最后一次有意义变更的 ISO 8601 日期时间。

**扩展：** 生产者**可以**包含任何额外的键。消费者在往返处理时**应**保留未知键，且**不应**因无法识别的字段而拒绝文档。

### 4.2 正文

正文是标准 Markdown。生产者**应**优先使用结构化 Markdown——标题、列表、表格、围栏代码块——而非自由形式散文，因为结构有助于人类阅读和智能体检索。

没有必需的正文章节。以下章节标题具有**约定俗成**的含义，适用时**应**使用：

| 标题           | 用途                                                   |
|----------------|--------------------------------------------------------|
| `# Schema`     | 资产的列/字段的结构化描述。                             |
| `# Examples`   | 具体使用示例，通常以围栏代码块呈现。                   |
| `# Citations`  | 支持正文中论断的外部来源。见 §8。                       |

### 4.3 示例：绑定到资源的概念

```markdown
---
type: BigQuery Table
title: Customer Orders
description: One row per completed customer order across all channels.
resource: https://console.cloud.google.com/bigquery?p=acme&d=sales&t=orders
tags: [sales, orders, revenue]
timestamp: 2026-05-28T14:30:00Z
---

# Schema

| Column        | Type      | Description                              |
|---------------|-----------|------------------------------------------|
| `order_id`    | STRING    | Globally unique order identifier.        |
| `customer_id` | STRING    | Foreign key into [customers](/tables/customers.md). |
| `total_usd`   | NUMERIC   | Order total in US dollars.               |
| `placed_at`   | TIMESTAMP | When the customer submitted the order.   |

# Joins

Joined with [customers](/tables/customers.md) on `customer_id`.

# Citations

[1] [BigQuery table schema](https://console.cloud.google.com/bigquery?p=acme&d=sales&t=orders)
```

### 4.4 示例：未绑定到资源的概念

```markdown
---
type: Playbook
title: Incident response — data freshness alert
description: Steps to triage a freshness alert on the orders pipeline.
tags: [oncall, incident]
timestamp: 2026-04-12T09:00:00Z
---

# Trigger

A freshness alert fires when `orders` lags more than 30 minutes behind
its expected SLA. See the [orders table](/tables/orders.md).

# Steps

1. Check the [ingestion job dashboard](https://example.com/dash).
2. …
```

---

## 5. 交叉链接

概念**可以**使用标准 Markdown 链接链接到其他概念。支持两种形式：

### 5.1 绝对路径（Bundle 相对）链接

以 `/` 开头，相对于 Bundle 根目录解析。

```markdown
See the [customers table](/tables/customers.md) for the join key.
```

这是**推荐**的形式，因为当文档在其子目录内移动时，它保持稳定。

### 5.2 相对路径链接

标准 Markdown 相对路径。

```markdown
See the [neighboring concept](./other.md).
```

### 5.3 链接语义

从概念 A 到概念 B 的链接断言了一种*关系*。关系的具体类型（父子、引用、关联、依赖等）由周围的散文传达，而非由链接本身传达。构建图形视图的消费者通常将所有链接视为无类型关系的有向边。

消费者**必须**容忍断链——指向 Bundle 中不存在目标的链接不是格式错误；它可能仅仅代表尚未编写的知识。

---

## 6. 索引文件

`index.md` 文件**可以**出现在任何目录中，包括 Bundle 根目录。它枚举目录的内容，以支持**渐进式展示**——让人类或智能体在打开单个文档之前就能看到可用的内容。

索引文件不包含前置元数据。正文使用一个或多个章节，每个章节将概念分组在标题下：

```markdown
# 章节 / 分组标题

* [标题 1](relative-url-1) - 项目 1 的简短描述
* [标题 2](relative-url-2) - 项目 2 的简短描述

# 另一个章节

* [子目录](subdir/) - 子目录的简短描述
```

条目**应**包含所链接概念前置元数据中的描述。生产者**可以**自动生成 `index.md`；消费者**可以**在没有时即时合成一个。

---

## 7. 日志文件（可选）

`log.md` 文件**可以**出现在层次结构的任何级别，以记录该范围内变更的历史。格式是一个按日期分组的条目平面列表，最新的在前：

```markdown
# 目录更新日志

## 2026-05-22
* **更新**：为 [Customer Metrics](/tables/customer-metrics.md) 添加了新的 BigQuery 表引用。
* **创建**：建立了 [Dataplex Playbook](/playbooks/dataplex.md)。

## 2026-05-15
* **初始化**：创建了基础目录结构。
* **更新**：向根目录 [index](/index.md) 添加了渐进式展示指南。
```

日期标题**必须**使用 ISO 8601 `YYYY-MM-DD` 格式。日志条目是散文；开头的粗体词（`**更新**`、`**创建**`、`**弃用**` 等）是约定，而非要求。

---

## 8. 引用

当概念正文引用外部材料做出论断时，这些来源**应**列在文档底部的 `# Citations` 标题下，并编号：

```markdown
# 引用

[1] [BigQuery 公开数据集公告](https://cloud.google.com/blog/products/data-analytics/...)
[2] [内部数据质量运行手册](https://wiki.acme.internal/data/quality)
```

引用链接**可以**是绝对 URL、Bundle 相对路径，或指向 `references/` 子目录的路径，该子目录将外部材料镜像为一等 OKF 概念。

---

## 9. 合规性

如果满足以下条件，Bundle 即符合 OKF v0.1：

1. 树中的每个非保留 `.md` 文件都包含可解析的 YAML 前置元数据块。
2. 每个前置元数据块都包含非空的 `type` 字段。
3. 每个保留文件名（`index.md`、`log.md`）在存在时遵循 §6 和 §7 中描述的结构。

消费者**应**将所有其他约束视为软性指导。特别是，消费者**不得**因以下原因拒绝 Bundle：

- 缺少可选前置元数据字段。
- 未知的 `type` 值。
- 未知的额外前置元数据键。
- 断链。
- 缺少 `index.md` 文件。

这种宽松的消费模式是有意为之：OKF 旨在在 Bundle 增长、重构和部分由智能体生成时仍然保持可用。

---

## 10. 与其他格式的关系

OKF 有意接近几种已建立的模式：

- **LLM "wiki" 仓库**，使用 Markdown + 前置元数据作为智能体可读的知识库。
- **个人知识工具**，如 Obsidian 和 Notion，使用带交叉链接的层次化 Markdown。
- **"元数据即代码"** 方法，将目录元数据存储在源代码旁边，而非单独的注册中心。

OKF 的主要区别在于它是**被规范化的**——确定了实现互操作性所需的一小套规则，而不规定工具。

---

## 11. 版本控制

本文档指定 OKF 版本 **0.1**。未来的修订将使用 `<major>.<<minor>` 形式进行版本控制：

- **次要**版本升级引入向后兼容的增补（新的可选字段、新的约定章节标题）。
- **主要**版本升级可能做出破坏性变更（重命名必需字段、更改保留文件名）。

Bundle **可以**通过在 Bundle 根目录 `index.md` 前置元数据块中包含 `okf_version: "0.1"` 来声明其目标 OKF 版本（这是 `index.md` 中唯一允许前置元数据的地方）。不理解所声明版本的消费者**应**尝试尽力消费，而非拒绝该 Bundle。

---

## 附录 A — 最小示例 Bundle

```
my_bundle/
├── index.md
├── datasets/
│   ├── index.md
│   └── sales.md
└── tables/
    ├── index.md
    ├── orders.md
    └── customers.md
```

`datasets/sales.md`：

```markdown
---
type: BigQuery Dataset
title: Sales
description: All sales-related tables for the retail business.
resource: https://console.cloud.google.com/bigquery?p=acme&d=sales
tags: [sales]
timestamp: 2026-05-28T00:00:00Z
---

The sales dataset contains transactional tables, including
[orders](/tables/orders.md) and [customers](/tables/customers.md).
```

`tables/orders.md`：

```markdown
---
type: BigQuery Table
title: Orders
description: One row per completed customer order.
resource: https://console.cloud.google.com/bigquery?p=acme&d=sales&t=orders
tags: [sales, orders]
timestamp: 2026-05-28T00:00:00Z
---

# Schema

| Column        | Type      | Description                  |
|---------------|-----------|------------------------------|
| `order_id`    | STRING    | Unique order identifier.     |
| `customer_id` | STRING    | FK to [customers](/tables/customers.md). |
| `total_usd`   | NUMERIC   | Order total in USD.          |

Part of the [sales dataset](/datasets/sales.md).
```


## 参考资料
- [Open Knowledge Format (OKF)](https://github.com/GoogleCloudPlatform/knowledge-catalog/blob/main/okf/SPEC.md)
- [Introducing the Open Knowledge Format](https://cloud.google.com/blog/products/data-analytics/how-the-open-knowledge-format-can-improve-data-sharing)
- [Knowledge Catalog](https://github.com/GoogleCloudPlatform/knowledge-catalog)
