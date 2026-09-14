---
type: article
title: "面向真正工程师的技能集：Matt Pocock’s Skills"
date: 2026-09-12 09:12:00 +0800
tags: [skill, mattpocock-skills, ai-coding, ai-agent, context-engineering]
---

在 AI 辅助编程风靡的今天，许多开发者沉浸于 **Vibe Coding（氛围感编码）**——直接抛出几句自然语言需求，交由 AI 自动生成代码。然而，这种“野蛮生长”的方式往往会导致需求理解偏差、架构快速腐化（Ball of Mud）、上下文遗忘以及越改 Bug 越多的困境。

Matt Pocock 的开源项目 `mattpocock/skills` 正是为了解决这一痛点而生。它不是一堆零散的 Prompt 集合，而是一套为 Claude Code、Codex 等 AI 编程智能体设计的系统化软件工程最佳实践。

官方体系将技能划分为两大类：

1. **User-Invoked（用户触发）**：由开发者在终端中通过命令显式调用（如 `/grill-with-docs`、`/to-spec`），用于任务编排与流程推进。
2. **Model-Invoked（模型自主调用）**：由 AI 在执行具体任务时自行判断并调用的工程纪律规范（如 `/tdd`、`/codebase-design`）。

---

## 工作流全景链路 (The Engineering Harness)

核心开发主流程遵循着从“模糊想法”到“高质量交付”的递进逻辑：

```text
  [ 模糊需求 / 架构困惑 ]
          │
          ▼
      /ask-matt      ───▶ (可选) 根据当前场景路由到最合适的技能或工作流
          │
          ▼
   /grill-with-docs  ───▶ 追问拷问、对齐认知、自动更新 CONTEXT.md & ADR
          │
          ▼
      /to-spec       ───▶ 提炼出结构严密的 SPEC-xxx.md 技术规格书
          │
          ▼
    /to-tickets      ───▶ 拆解为上下文安全的原子 Ticket 工单
          │
          ▼
     /implement      ───▶ 驱动 /tdd 编写代码，拉起子 Agent 双轴审查，执行 /code-review

```

---

## 核心工程技能与分类 (Skill Catalog)

### 1. 用户触发编排主流程 (User-Invoked Main Flow)

#### **`/setup-matt-pocock-skills`**
* **分类**：User-Invoked (配置文件生成)
* **作用**：项目初始化技能。在仓库中运行一次，扫描项目并提问配置：Issue 追踪器类型（GitHub Issues、Linear、GitLab 或本地 Markdown）、Triage 标签名称及文档目录。配置将写入 `docs/agents/` 供其他技能读取。
* **触发场景**：第一次在项目中使用该技能库。
* **调用示例**：`/setup-matt-pocock-skills`
* **预期产出**：生成 `docs/agents/issue-tracker.md`、`domain.md` 及全局架构配置。


#### **`/ask-matt`**
* **分类**：User-Invoked (流程路由)
* **作用**：技能导航路由。当你不知道当前开发阶段该调用哪个技能时，向它描述现状，它会为你匹配最适合的工程工作流。
* **触发场景**：面对复杂场景不确定接下来该用哪个技能时。
* **调用示例**：`/ask-matt 我现在刚拿到一份需求说明，该从哪一步开始？`
* **预期产出**：分析当前上下文，给出明确的技能调用顺序建议（如建议先运行 `/grill-with-docs`）。


#### **`/grill-with-docs`**（底层依托通用提问原语 `grilling`）
* **分类**：User-Invoked
* **作用**：高频核心技能。通过连续提问“拷问”开发者的计划，对照现有领域模型查漏补缺。AI 不会直接编写代码，而是厘清边界条件，并在会话中自动更新术语表（`CONTEXT.md`）与架构决策记录（ADRs），拉齐人机认知。若无需修改文档，亦可直接使用轻量版 `/grill-me`。
* **触发场景**：你有一个新想法（如“给电商系统增加限时秒杀功能”）。
* **调用示例**：`/grill-with-docs 我想加一个限时秒杀功能，每个用户限购 1 件，库存扣减要快。`
* **预期产出**：AI 追问高并发回滚与 Redis 预扣减细节，并在 `CONTEXT.md` 中补充 `FlashSale` 术语及生成 ADR。


#### **`/to-spec`**
* **分类**：User-Invoked
* **作用**：整理讨论结论。AI 会分析当前对话，生成结构严密的 `SPEC-xxx.md` 技术规格书并发布至配置好的 Issue 追踪器中，包含用户故事、模块边界、数据流向图及具体的验收标准（Acceptance Criteria）。
* **触发场景**：通过 `/grill-with-docs` 厘清思路后，需要形成正式技术规格文档。
* **调用示例**：`/to-spec 将刚刚讨论的秒杀功能整理为技术规格书。`
* **预期产出**：生成 `SPEC-004-flash-sale.md`，明确包含并发 1000QPS 下不超卖等验收标准。


#### **`/to-tickets`**
* **分类**：User-Invoked
* **作用**：将庞大的 Spec 或 PRD 拆解为颗粒度小、支持显式依赖阻塞（blocking edges）、且不会超出 AI 上下文窗口的原子工单（Tickets），并记录在看板或本地文件中。
* **触发场景**：技术规格书过于庞大，AI 无法一次性完成编写，需要任务拆分。
* **调用示例**：`/to-tickets 基于 SPEC-004 生成具体的执行工单。`
* **预期产出**：拆解为 Ticket #1（数据库表结构）、Ticket #2（Redis Lua 预扣库存）、Ticket #3（高并发压测脚本）等原子任务。


#### **`/implement`**
* **分类**：User-Invoked
* **作用**：根据指定的工单或 Spec 正式编写代码。AI 在编写时会自动触发 `/tdd` 在预设缝隙处编写测试，并在提交前自动拉起子 Agent 调用 `/code-review` 进行合规审查。
* **触发场景**：准备动手编写第一个具体工单的代码。
* **调用示例**：`/implement Ticket #2 (Redis 预扣库存逻辑)`
* **预期产出**：编写实现代码，自动运行 TDD 测试并通过子 Agent 完成代码审查后准备提交。



---

### 2. 模型自主调用的工程纪律 (Model-Invoked Disciplines)

这类技能无需用户频繁手动输入，当 AI 执行 `/implement` 或调试任务时，会根据上下文自主触发调用：

#### **`/tdd`**
* **分类**：Model-Invoked (也可显式调用)
* **作用**：严格执行“红-绿-重构”的测试驱动开发循环。AI 先编写包含测试用例的测试文件（红），接着编写最简实现代码使测试通过（绿），最后在保证测试全绿的前提下重构代码。全程强制以垂直切片（Vertical Slice）方式小步快跑。
* **触发场景**：AI 编写具体业务函数或开发者明确要求进行 TDD 开发时。
* **调用示例**：`/tdd 编写一个计算会员生日特惠折扣的函数。`
* **预期产出**：先后生成 `discount.test.ts`（测试标红）与最简实现（测试变绿），最后完成代码重构。


#### **`/diagnosing-bugs`**
* **分类**：Model-Invoked / Maintenance
* **作用**：规范化的 Debug 技能。强制 AI 遵循严密的科学调试步骤：建立反馈回路（编写复现脚本）→ 提出可证伪假设 → 插桩埋点 → 修复与回归测试 → 清理临时埋点。
* **触发场景**：线上报错或遇到难以定位的程序 Bug（如偶发性 500 报错）。
* **调用示例**：`/diagnosing-bugs 用户结算时偶发 500 错误，日志显示 Connection Timeout。`
* **预期产出**：执行科学 Debug 流程，打印复现、假设（如连接池耗尽）、埋点注入、验证与清理步骤。


#### **`/domain-modeling`** 与 **`/codebase-design`**
* **分类**：Model-Invoked
* **作用**：维护代码库的设计深度与语言一致性。前者主动打磨统一语言（Ubiquitous Language）字典；后者引入约翰·欧斯特霍特（John Ousterhout）的深层模块（Deep Modules）、缝隙（Seams）与适配器（Adapters）设计原则，隐藏底层复杂性。
* **触发场景**：AI 定义新实体、重构结构或设计模块接口时自主调用。
* **调用示例**：`/domain-modeling 为我们的仓储物流系统建模。`
* **预期产出**：产出标准术语字典（如 `SKU`、`Bin`、`InboundReceive`）及高内聚低耦合的抽象接口。



---

### 3. 日常维护、演进与规划 (Upkeep & Shaping)

#### **`/improve-codebase-architecture`**
* **分类**：User-Invoked
* **作用**：盘点代码库健康度。分析依赖图谱，扫描架构腐化或可加深封装的机会。生成直观的 **可视化 HTML 报告**，并允许用户挑选其中一项深挖重构。
* **触发场景**：项目维护时间较长，代码库逐渐臃肿膨胀。
* **调用示例**：`/improve-codebase-architecture 扫描 src/orders 目录的架构健康度。`
* **预期产出**：生成 HTML 评估报告，识别出 `OrderService` 职责过载问题并提供重构建议。


#### **`/triage`**
* **分类**：User-Invoked
* **作用**：Issue 状态机流转工具。根据 `docs/agents/triage-labels.md` 配置的标签，自动推进 GitHub/Linear 上的 Issue 状态（如 `needs-triage` -> `ready-for-agent`）。
* **触发场景**：开源项目或团队项目中处理大量待分类 Issue 时。
* **调用示例**：`/triage`
* **预期产出**：将所有未分类工单按规则打上对应标签并指派优先级。


#### **`/wayfinder`**
* **分类**：User-Invoked
* **作用**：大跨度任务导航器。用于规划超出单次会话上下文的大型重构或长周期开发，在 Issue 追踪器上构建决策树拓扑图，并逐个击破。
* **触发场景**：需要执行跨越数天的大型跨会话开发任务（如数据库迁移）。
* **调用示例**：`/wayfinder 我们要把数据库从 MySQL 迁移到 PostgreSQL，帮我规划路线。`
* **预期产出**：生成多阶段导航图，并在新会话开启时提示当前阶段与下一步目标。


#### **`/prototype`**
* **分类**：User-Invoked / Shaping
* **作用**：快速构建抛弃型原型。在一个隔离目录或单文件中快速验证技术路线，控制台会显式标明非生产代码 warnings，防止直接污染主分支。
* **触发场景**：不确定新技术方案的可行性，需要快速搭建临时原型进行验证。
* **调用示例**：`/prototype 用 Hono.js 快速搭一个 Mock 服务器，看看性能如何。`
* **预期产出**：生成可运行的临时原型代码，并输出明确的非生产环境警告说明。



---

## 如何在项目中安装与使用

官方提供了两种主流接入方式：

### 方式 A：Claude Code 官方 Marketplace 插件（推荐）

如果你使用的是 Claude Code，官方提供了只读且自动随 upstream 更新的 Managed Bundle：

```bash
# 在终端中安装
claude plugins install mattpocock-skills

# 或者在 Claude Code 会话内部运行
/plugin install mattpocock-skills

```

### 方式 B：npx 跨 Agent 通用安装器（支持 Codex 及其他工具）

如果你使用的是 Codex、Cursor 或希望本地自由改写 Skill 源码：

```bash
npx skills@latest add mattpocock/skills

```

安装器会让你勾选所需的 Skill 模块并自动写入项目中（请务必勾选 `setup-matt-pocock-skills`）。后续可通过 `npx skills update` 进行同步。

### 初始化运行

安装完成后，在仓库中**运行一次**初始化指令：

```bash
/setup-matt-pocock-skills

```

根据交互提示设定你的 Issue Tracker（GitHub / Linear / Local Markdown）及文档存放目录。配置将提交在 `docs/agents/` 目录中，团队所有成员与 Agent 即可共享此工程治理规范。

---

AI 时代，软件工程师的底层价值正在从“动手写代码的速度”转向“定义边界、设计架构与设定工程约束的能力”。Matt Pocock 的 skills 体系本质上是在给 AI 绑定安全绳与铺设轨道。只有学会用严密的工程纪律治理 AI，才能在保持代码库健康的同时，真正释放十倍的开发效能。
