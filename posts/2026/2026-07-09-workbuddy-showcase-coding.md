---
type: article
title:  "WorkBuddy 实战案例：代码开发"
date:   2026-07-09 22:28:00 +0800
tags: [workbuddy, agent, coding, webapp, skill]
---

## [WorkBuddy 介绍](https://www.codebuddy.cn/work/)

<div align="center">
<h1>全场景智能体工作搭子</h1>
<h3 style="margin: 0.2em 0; line-height: 1.2;">开启 AI Agent 办公新范式</h3>
</div>

---

<h1>AI 专家团 全场景办公</h1>
<h3 style="margin: 0.2em 0; line-height: 1.2;">WorkBuddy 是全能 AI 工作台，一人指挥，全行业专家执行，从策略到交付一站搞定</h3>
<h3 style="margin: 0.2em 0; line-height: 1.2;">免部署·安装即用 ｜ 多专家·多模型协同 ｜ 全平台·桌面 / 主流 IM / 小程序</h3>

---

<h3>100+ 领域专家组成你的虚拟团队，运营、设计、数据、开发等全角色场景覆盖</h3>
<h1 style="margin: 0.2em 0; line-height: 1.2;">一句话指令自主规划并交付完整结果</h1>
<h2 style="margin: 0.2em 0; line-height: 1.2;">多专家并行协作，一个人顶一支团队</h2>
<h2 style="margin: 0.2em 0; line-height: 1.2;">MCP 生态 + 自定义 Skills，能力无限扩展</h2>

---

![](/images/2026/workbuddy/coding.webp)

---


## 绘制架构图和流程图

### 输入

```PROMPT
@file:open-ai-eco 研究这个项目，绘制架构图和流程图。
```

### 输出

```PROCESS
我来研究这个 `open-ai-eco` 项目，先探索它的结构和内容。
这是一个 Astro 网站项目（开源 AI 生态研究）。让我深入读取核心文件来理解架构。
项目架构已经很清晰了：这是一个 **Astro 驱动的静态研究门户**，数据从 Excel 同步到 JSON，并带 SQLite 数据库与 API 路由。让我读取数据流、数据库和 API 相关核心文件。
让我再读取剩余的 API 路由、研究接口和几个页面/组件，以完整掌握架构。
我已经掌握了项目的核心架构。让我再读取全局样式以匹配项目的真实配色，并查看首页与交互组件以确认客户端交互流程。
我已经完整理解了项目架构。这是一个 **Astro 5.5 驱动的"开源 AI 生态研究门户"**，核心特征是：Excel → 同步脚本 → Content Collections 的构建期数据流，加上基于 SQLite + SSR API 的运行时交互统计（混合静态/服务端渲染）。

现在我来生成一套完整的架构图与流程图（独立 HTML，自包含 SVG，匹配项目配色），可直接打开查看。
已生成完整文档。让我记录本次工作到项目记忆，然后呈现成果。
```

我已经研究完 `open-ai-eco`（AI 生态实验室·技术雷达）项目并生成了一套完整的架构图与流程图。

#### 项目本质

这是一个 **Astro 5.5 驱动的开源 AI 技术雷达门户**，最关键的架构特征是 **Hybrid 混合渲染**——既有构建期生成的静态页面，又有运行时承载的 SSR API：

- **构建期数据流**：`Excel 主数据源` → `sync-projects.ts`（xlsx→JSON，列 A–P 映射、状态/类别/slug/视频派生、日期 +12h 缓冲修正）→ `Content Collections` 校验 → 静态页面
- **运行时交互**：`InteractionBar` 组件 → `SSR API`（/api/views、/api/likes、/api/research、/api/stats）→ `SQLite`（better-sqlite3，WAL + 触发器实时聚合），IP 用 HMAC-SHA256 哈希去重

#### 产出的 5 张图（单 HTML，自包含 SVG，配色对齐项目 `global.css` 设计令牌）

1. **系统整体架构** —— 六层（数据源 / 同步 / 构建 / 页面组件 / 运行时服务 / 客户端）+ 右侧运行时 API 回路
2. **数据同步流程** —— Excel→JSON 完整流程图，含三处派生逻辑（slug / 状态映射 / 类别映射 / 视频匹配）
3. **交互与统计流程** —— 客户端 / API / SQLite 三栏泳道，触发器聚合路径清晰标注
4. **信息架构 / 路由图** —— 7 类路由 + 约定式关联（文章↔项目、项目↔视频、合规风险、排序、KPI）
5. **技术栈总览** —— 按职责分组，区分构建期（xlsx）与运行时（better-sqlite3）用途

文件已打开预览，可直接滚动查看，也可下载保存。每张图下方都附了要点解读（关键代码路径/表名/字段都标注了）。

如果你想要某张图单独导出（比如拆成 PNG、或用 mermaid 代码块形式嵌入博客仓库），或者补充一张「数据库 ER 图」，告诉我即可。

![](/images/2026/workbuddy/coding_open-ai-eco-draw-architecture-diagrams.webp)


## 生成架构设计文档

### 输入

```PROMPT
分析项目 @file:open-ai-eco 架构，帮我创建系统架构图和设计文档，说明核心模块和数据流。保存到项目的 docs 目录中，格式为 markdown 文档，每个核心模块独立文档。
```

### 输出

```PROCESS
我将分析 `open-ai-eco` 项目架构并编写设计文档，先从梳理项目目录结构入手。
本项目是基于 Astro 5 搭建的内容型网站，我会通过研读核心配置、数据文件与接口文件，深入拆解整体架构。
接下来我将查看接口路由、页面文件、布局组件以及现有说明文档与项目自述文件。
随后翻阅页面、布局和若干核心组件，理清页面渲染层的实现逻辑。
再读取剩余页面、交互组件、Mermaid 绘图插件以及项目现有的文档记忆文件。
目前我已对项目架构形成全面认知，再浏览余下页面与文档目录，完善整体认知。
现已完整掌握整套架构，接下来整理任务清单，再撰写全套设计文档。
首先编写架构总览文档，包含系统架构图与数据流转流程。
接下来编写数据同步模块文档：
再编写内容模型模块文档：
页面与路由模块文档：
接口与数据统计分析模块文档：
界面组件、构建工具链模块文档：
六大模块文档均已撰写完毕，标记该项任务完成，并核验文档目录。
共计 7 份文档全部生成完成，我会在项目原有记忆文件中补充一段简短记录。
此前会话已产出一份架构文档，我将查阅完整工作日志，精准补充本次交付成果记录。
全部文档制作完成，现将交付成果汇总呈现。
```

已完成对 `open-ai-eco` 项目的架构分析，并在 `docs/` 目录生成了 **7 篇模块化 Markdown 设计文档**（全部带 Mermaid 可渲染架构图/时序图/ER 图）。

#### 文档清单

| 文件 | 内容 |
|------|------|
| `00-系统架构总览.md` | 分层架构图、模块总览、构建期/运行期 **两条数据流**、技术栈、目录结构、文档索引 |
| `01-数据同步模块.md` | `sync-projects.ts`：Excel→JSON 流程、16 列映射、状态/分类/视频/日期映射 |
| `02-内容模型模块.md` | `config.ts` Zod schema、`projects`/`articles` 集合、项目↔文章↔视频关联 |
| `03-页面与路由模块.md` | 7 类页面的路由表、职责、`getStaticPaths`、筛选与 URL 同步 |
| `04-API与统计分析模块.md` | `/api/*` 端点契约、`better-sqlite3` 表/触发器、IP HMAC 哈希、`InteractionBar` 调用链 |
| `05-UI组件模块.md` | `Layout`/`Rail`/`Topbar`/`ProjectCard`/`InteractionBar` 等组件与配色约定 |
| `06-构建与工具链模块.md` | `astro.config`、自研 `remark-mermaid` 插件、Tailwind、脚本链、部署形态与已知约束 |

#### 架构核心结论

- **混合架构**：主体 `output: 'static'` 静态生成 + Node standalone 适配器承载运行期 API（`prerender=false`）。
- **数据链路（构建期）**：`开源 AI 生态研究与落地指南.xlsx` → `scripts/sync-projects.ts` → `src/content/projects/*.json` → Content Collections → SSG 页面。
- **互动链路（运行期）**：浏览器 `InteractionBar` → `POST/GET /api/{views,likes,research,stats}` → `better-sqlite3`（WAL + 触发器实时聚合 `page_stats`）→ 前端实时统计、首页 `LabPanel` 构建期读取快照。
- **隐私设计**：用户以 IP 的 HMAC-SHA256 哈希匿名标识，浏览按"日+IP"去重。

文档已存到项目 `docs/` 目录，可直接在 GitHub / VSCode / 仓库内查看（Mermaid 图会自动渲染）。

![](/images/2026/workbuddy/coding_open-ai-eco-docs.webp)

![](/images/2026/workbuddy/coding_open-ai-eco-docs-overview1.webp)

![](/images/2026/workbuddy/coding_open-ai-eco-docs-overview2.webp)

![](/images/2026/workbuddy/coding_open-ai-eco-docs-api.webp)


## 网站开发

### 输入（复刻竞品官网）

```PROMPT
根据 https://www.codebuddy.ai/ 网站的信息，生成一个鲁软慧码的官网。鲁软慧码的能力等同于 CodeBuddy。
```

### 输出

已完成。我根据 CodeBuddy 官网及官方文档资料，为**鲁软慧码**生成了一套能力对标的官网，单文件 `/Users/junjian/工作/2026/WorkBuddy实战/luruan-huima/index.html`，可直接在浏览器打开预览。

**网站还原了 CodeBuddy 的核心能力（等价映射）：**
- **三大产品形态**：慧码 IDE（产设研一体·对话即编程）/ 慧码插件（即插即用）/ 慧码 Code（CLI 智能体·系统级操作）
- **全流程覆盖**：规划 → 设计 → 开发 → 测试 → 部署
- **12 项核心能力**：Craft 自主智能体、智能补全、设计稿转代码、工程理解、单元测试、智能评审、安全扫描、MCP 生态、知识库 RAG、多模态对话、Plan 规划、多模型引擎
- **Craft 智能体**专题区、**应用场景**（个人/团队/企业/行业四Tab）、**生态集成**（Figma/CloudBase/EdgeOne/CloudStudio/MCP 等）、**硬核指标**（200+ 语言、50+ IDE、5 步生命周期、3 端形态）、用户评价与 CTA

**交互与视觉：** 深色 Hero + 浅色正文、滚动揭示动画、数字滚动计数、Hero 打字机风格代码窗、场景 Tab 切换，移动端响应式适配。

**说明：** codebuddy.ai 首页是 JS 渲染页，直接抓取只拿到标题，所以能力信息我综合了 codebuddy.cn 官方文档与公开搜索资料来对齐，确保内容真实准确。如需我把它拆成多页、替换 Logo/配色、补充下载页或接入真实下载链接，告诉我即可。

![](/images/2026/workbuddy/coding_web-smart-coding.webp)

### 输入（中英文，国网绿）

```PROMPT
支持中英文，颜色以国网绿为主色
```

### 输出

已更新。两处改动都已完成：

**1. 国网绿主色**
- 主色 `#00A887`（国网绿），配亮绿 `#11C9A0`、深绿 `#00805F` 做层次。
- Hero、Craft 专题区改为深绿底，按钮、渐变文字、卡片悬停、阴影、时间轴连线等全部绿色化，整体观感统一为「国网绿」体系。

**2. 中英文双语**
- 全站 188 处文案均做了中英双版本（用 `<span class="zh">` / `<span class="en">` 包裹，按 `body` 语言类切换）。
- 导航右上角新增「中 / EN」切换按钮，点击即时切换整站语言；英文品牌名定为 **Lusoft CodeMind**。
- 覆盖：导航、Hero、三端形态、全流程、12 项核心能力、Craft 专题、四大应用场景、生态集成、硬核指标、用户评价、CTA、页脚。

技术校验通过：HTML 结构闭合（section/div 配对正常），188 对双语文案数量一致，语言切换与数字滚动动画均保留。直接刷新预览即可看到右上角语言按钮，点击在中文/English 间切换。

如需把国网绿换成更精确的某个色值（如官网指定的 `#00865A` 或 `#00A887` 之外的版本），或给双语加上「记住选择 / URL 参数」持久化，告诉我即可。

![](/images/2026/workbuddy/coding_web-smart-coding-en.webp)


## Skill 开发

### 输入（创建开源 AI 项目研究技能）

- **技能**：`skill-creator`
- **技能**：`Excel 文件处理`

```PROMPT
@command:skill-creator  使用 @command:Excel 文件处理 读取文档开源 AI 生态研究与落地指南.xlsx ，理解项目的列（项目名称、类别、GitHub URL、定位、应用场景、依赖、许可证）的内容。整理规则创建研究项目的技能，用户输入 GitHub URL，输出：项目名称、类别、GitHub URL、定位、应用场景、依赖、许可证。
```

### 输出

```PROCESS
好的，我来先读取 Excel 文件理解数据结构，然后按照 skill-creator 的流程创建技能。

首先，读取 Excel 文件：
好，我理解了 Excel 文件的结构——它是一个**研究字段定义文档**，定义了记录开源 AI 项目时需要填写的各个字段含义。现在按照 skill-creator 流程创建技能。

先找到 init_skill.py 脚本的位置：
技能目录已创建。现在清理示例文件并编写技能内容。
包中包含了一个多余的示例文件，清理后重新打包：
```

#### ✅ 技能创建完成！`open-source-ai-researcher`

##### 做了什么

基于「开源 AI 生态研究与落地指南.xlsx」的字段定义结构，创建了一个完整的 **开源 AI 项目研究技能**。

##### 技能用法

用户输入一个 **GitHub URL**（例如 `https://github.com/langgenius/dify`），技能会自动：

1. 访问 GitHub 仓库页面和 README
2. 查阅 LICENSE 文件确认许可证
3. 提取并整理以下 7 项结构化信息：

| # | 字段 | 说明 |
|---|------|------|
| 1 | **项目名称** | 官方标准名称 |
| 2 | **类别** | AI 框架/智能体/RAG引擎 等归类 |
| 3 | **GitHub URL** | 用户提供的仓库地址 |
| 4 | **定位** | 底层逻辑，通俗解释 |
| 5 | **应用场景** | 能解决什么具体业务问题 |
| 6 | **依赖** | 基础设施需求（LLM、数据库等） |
| 7 | **许可证** | 合规性分析与建议 |

##### 技能文件

技能包已导出：**`open-source-ai-researcher.zip`**

如需安装，解压后将 `open-source-ai-researcher/` 文件夹放入 `~/.workbuddy/skills/` 目录即可。

### 输入（使用技能）

```PROMPT
研究 https://github.com/usestrix/strix
```

### 输出

#### 项目研究报告

##### 项目名称
**Strix**

##### 类别
AI 渗透测试工具 / AI 安全测试工具

##### GitHub URL
https://github.com/usestrix/strix

##### 定位
**开源 AI 渗透测试工具**——自主 AI 黑客能够发现并修复应用漏洞。Strix 是一个自主的 AI 渗透测试代理，其行为模式与真实黑客完全一致：**动态运行你的代码**，发现漏洞，并通过实际的 **概念验证（PoC）** 来验证它们。专为需要快速、准确安全测试的开发者和安全团队打造，省去了手动渗透测试的开销，也避免了静态分析工具的误报问题。

##### 应用场景
- **应用程序安全测试** — 检测并验证应用程序中的关键漏洞（OWASP Top 10 全覆盖）
- **快速渗透测试** — 在几小时（而非几周）内完成渗透测试并生成合规报告
- **漏洞赏金自动化** — 自动化漏洞赏金研究并生成 PoC，以便更快地提交报告
- **CI/CD 集成** — 与 GitHub Actions、GitLab CI 等集成，在漏洞进入生产环境前拦截
- **DevSecOps 流水线** — 支持 GitHub、GitLab、Bitbucket、Slack、Jira、Linear 等

##### 依赖
| 依赖项 | 说明 |
|--------|------|
| **Docker** | 运行中状态，用于沙箱环境隔离 |
| **LLM API 密钥** | 必须，支持 OpenAI（GPT-5.4）、Anthropic（Claude Sonnet 4.6）、Google（Gemini 3 Pro）等 |
| 可选：Perplexity API 密钥 | 用于搜索能力增强 |
| 可选：本地模型 | 支持通过 `LLM_API_BASE` 配置 Ollama / LMStudio 等本地模型 |
| 底层依赖 | LiteLLM（LLM 调用）、Caido（HTTP 代理）、Nuclei（漏洞扫描）、Playwright（浏览器自动化）、Textual（CLI 交互） |

##### 许可证
**Apache License 2.0**（Copyright 2025 OmniSecure Inc.）

**合规分析**：Apache 2.0 对商业使用非常友好，允许在公司内部使用、修改和分发，无需公开衍生代码的源代码。适合企业内网私有化部署和商业化集成。

---

**补充信息**：Strix 也提供了托管云平台 [app.strix.ai](https://app.strix.ai)，可直接注册使用。文档地址：[docs.strix.ai](https://docs.strix.ai)

### 输入（写入 Excel）

```PROMPT
把研究的结果增加到 Excel 文档中
```

### 输出

已完成！Strix 的研究结果已追加到 **「开源 AI 生态研究与落地指南.xlsx」→「趋势洞察和研究落地」工作表** 第 41 行。

新增的记录概览：

| 字段 | 内容 |
|------|------|
| **项目名称** | Strix |
| **类别** | AI 安全测试工具 |
| **GitHub URL** | https://github.com/usestrix/strix |
| **定位** | 开源 AI 渗透测试工具——自主 AI 黑客能够发现并修复应用漏洞 |
| **应用场景** | 应用安全测试、快速渗透测试、漏洞赏金自动化、CI/CD 集成、DevSecOps |
| **依赖** | Docker + LLM API（OpenAI/Anthropic/Google 等） |
| **许可证** | Apache-2.0（商业友好） |
| **来源/状态** | GitHub趋势 / 趋势 |
| **完成日期** | 2026-07-08 |
