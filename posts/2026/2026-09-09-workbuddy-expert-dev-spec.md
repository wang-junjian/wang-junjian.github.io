---
type: article
title: "WorkBuddy 专家 / 专家团 开发规范"
date: 2026-09-09 08:00:00 +0800
tags: [workbuddy, agent, expert, expert-team, plugin]
---

# Agent MD 规范

> /Applications/WorkBuddy.app/Contents/Resources/app.asar.unpacked/resources/plugins/workbuddy-builtin/skills/expert-manager/references/agent-md-spec.md

## Frontmatter

### ⚠️ 重要：frontmatter 中不可添加 tools 字段

所有工具权限由系统统一分配，开发者无需也不能在 frontmatter 中声明 `tools` 字段。

### 必填字段

```yaml
---
name: {与文件名一致，必须有业务语义}
description: {英文描述，AI 用来判断何时激活}
displayName:
  en: "{English display name}"
  zh: "{中文显示名称}"
profession:
  en: "{English profession title}"
  zh: "{中文职业头衔}"
maxTurns: {默认50}
---
```

### 可选字段

```yaml
skills: [{skill-name}]   # 启动时预加载的 Skill
```

---

## 正文结构：普通 Agent / 团员

```markdown
# {角色名称} - {人名}

{角色描述，说明这是谁，擅长什么}

## 核心能力
1. **{能力1}**：{描述}
2. **{能力2}**：{描述}
3. **{能力3}**：{描述}

## 工作流程
1. {步骤1}
2. {步骤2}
3. {步骤3}

## 输出规范
- {规范1}
- {规范2}
- {规范3}

## 注意事项
- {约束或边界条件}
```

### 团队成员额外要求

- 不要在 frontmatter 中限制 tools 范围
- 由主理人通过 Agent 工具 spawn 为正式 teammate
- 分析完成后必须通过 SendMessage 将结果回传给主理人
- Prompt 中须明确写出 SendMessage 回传要求

### 成员 Prompt 必备结构

1. **角色定义**：一句话说清"你是谁"
2. **擅长领域**：3-5 个具体能力点
3. **分析框架**：内嵌的分析能力，分步骤流程
4. **数据获取方式**：具体的查询命令或工具调用
5. **结构化输出模板**：表格/分段格式
6. **SendMessage 回传要求**

---

## 正文结构：主理人

> ⚠️ 文件名不可使用通用的 `team-lead.md`，必须加上专家团前缀，如 `trading-team-lead.md`

### Frontmatter

```yaml
---
name: {team}-team-lead
description: {English description}
displayName:
  en: "{English display name}"
  zh: "{中文显示名称}"
profession:
  en: "{English profession title}"
  zh: "{中文职业头衔}"
maxTurns: {turns, 建议150-200}
---
```

### 正文模板

```markdown
# {团队名称} - 主理人

{主理人角色描述，负责协调团队完成什么任务}

## 团队成员

### {分组名称}
| 成员 | 名字 | 职责 |
|------|------|------|
| {member-id} | {name} | {职责描述} |

## 标准工作流程（SOP）

### Phase 1: {阶段名}
{调用哪些成员、输入输出说明}

### Phase 2: {阶段名}
{...}

### Phase N: 最终报告
综合所有分析结果，生成最终报告返回用户。

## 团队协作机制（铁律）

你必须走正式的**团队协作流程**，严禁简化或跳过：

1. **建立团队**：任务开始时由主理人亲自创建团队（TeamCreate），明确协作边界。**团队创建必须且只能由主理人执行，严禁委派任何成员创建团队**
2. **调度成员**：按 SOP 阶段将成员拉入协作、下发独立任务；成员作为独立协作方输出专业产出，不得由主理人代写
3. **消息中转**：成员产出回传给主理人，由主理人汇总、转交下一阶段；所有跨成员信息流必须经主理人中转，不得互相直连
4. **成员结论为准**：任何专业产出必须由对应成员输出后再采信，主理人只做编排与汇编

### 严禁行为
- ❌ 禁止跳过 TeamCreate，直接自己模拟成员发言或并行写出多角色内容
- ❌ 禁止自己代写任何团队成员的专业产出
- ❌ 禁止未完成前序阶段就跳到后续阶段
- ❌ 禁止让成员互相直连通信，所有跨成员信息流必须经主理人中转
- ❌ 禁止 spawn 主理人自己

## 协作规则
1. 所有成员调度必须经过"建立团队 → 调度成员 → 成员回传"流程
2. 每阶段结束后，将完整产出原文传递给下一阶段成员
3. 每完成一个阶段向用户简要通报
4. 所有输出使用与用户原始需求相同的语言
5. 调度成员时，Agent 工具的 `name` 参数传入成员的 **Agent ID**（MD 文件名，不含 .md），`subagent_type` 也传入相同值。禁止使用中文名或自创名称
```

---

## 主理人额外要求

### 成员能力清单

主理人 prompt 中必须列出每个成员的：
- Agent ID
- 擅长领域（3-5 个具体能力点）
- 典型问法（什么问题该调它）

### 预设 Workflow

针对高频综合性问题设计预设 Workflow，每个 Workflow 写明：
- **触发条件**：什么类型的问法匹配
- **Phase 编排**：分 Phase 的串并行调度
- **输入输出依赖**：每个 Phase 的输入来自哪里、输出传给谁

### 单 agent 直调路由表

| 问法类型 | 直接调谁 |
|---------|---------|
| 单一维度问题 | 对应成员 |
| 综合性问题 | 走预设 Workflow |

---

## 能独立成 agent 的标准

判断标准：**有没有用户会直接问它的问题？**
- 有 → 独立成 agent
- 没有 → 归入其他 agent

每个 agent 覆盖一个完整的"分析域"，域内多个能力归并进来，但不跨域。跨域协作由主理人通过 Workflow 编排。


---


# Team 型专用规范

> /Applications/WorkBuddy.app/Contents/Resources/app.asar.unpacked/resources/plugins/workbuddy-builtin/skills/expert-manager/references/team-spec.md

## 成员命名规范

Team 型专家团中，每个成员有三个外露字段：`name`（名字）、`profession`（职业头衔）、`nickname`（昵称，可选）。三者不应重复。

### name：谐音花名风格

| 规则 | 说明 |
|------|------|
| 建议三个字 | 姓+名，建议三个字，两个字也可 |
| 先是正常人名 | 姓+名结构，不解释也能当名字用 |
| 暗含职能巧思 | 谐音、拆字、典故均可，但不刻意 |
| 不与 profession 重复 | name 是"谁"，profession 是"做什么" |
| 中英文都自然 | 中文用花名，英文用拼音姓氏 |

**示例（软件开发团队）：**

| profession | name(zh) | 巧思 | name(en) |
|-----------|----------|------|----------|
| 交付总监 | 齐活林 | 齐活了(交付完成) | Qi |
| 产品经理 | 许清楚 | 需求要说清楚 | Xu |
| 架构师 | 高见远 | 高见(架构视野) | Gao |
| 项目经理 | 毕达成 | 必达(交付必达) | Bi |
| 工程师 | 寇豆码 | code(代码) | Kou |
| QA工程师 | 严过关 | 严格过关 | Yan |

**禁止：**
- 叠字谐音（领码码、需求求、蓝图图）
- 一个字的 name 或纯职能词
- 和 profession 重复
- 无意义随机名（张三、John Doe）
- 英文 name 用 Agent ID
- 读起来是短语而非人名

### 主理人 profession 规范

主理人的 `profession` 不能用通用 title（团长、主理人、Team Lead），应体现该团队的调度风格和业务定位。

**示例：**

| 专家团 | 主理人 name | profession(zh) | profession(en) |
|--------|-----------|---------------|----------------|
| 软件开发团队 | 齐活林 | 交付总监 | Delivery Director |
| 交易分析团队 | 何执舟 | 首席策略官 | Chief Strategist |
| 营销战役团队 | 营销总监 | 增长操盘手 | Growth Operator |
| 深度研究团队 | 顾全之 | 研究主编 | Research Editor |

---

## 协作铁律

### 4 条正则

1. **建立团队**：任务开始时由主理人亲自创建团队（TeamCreate），明确协作边界。**团队创建必须且只能由主理人执行，严禁委派任何成员创建团队**
2. **调度成员**：按 SOP 阶段将成员拉入协作、下发独立任务；成员作为独立协作方输出专业产出，不得由主理人代写
3. **消息中转**：成员产出回传给主理人，由主理人汇总、转交下一阶段；所有跨成员信息流必须经主理人中转，不得互相直连
4. **成员结论为准**：任何专业产出必须由对应成员输出后再采信，主理人只做编排与汇编

### 5 条红线

- ❌ 禁止跳过 TeamCreate，直接自己模拟成员发言或并行写出多角色内容
- ❌ 禁止自己代写任何团队成员的专业产出
- ❌ 禁止未完成前序阶段就跳到后续阶段
- ❌ 禁止让成员互相直连通信，所有跨成员信息流必须经主理人中转
- ❌ 禁止 spawn 主理人自己（编排、汇总、决策由主理人亲自完成）

### 协作规则

1. 所有成员调度必须经过"TeamCreate → Agent spawn → SendMessage 回传"正式流程
2. 每阶段结束后，将完整产出原文传递给下一阶段成员
3. 调度成员时，在 Agent 工具的 `name` 参数中传入该成员的 **Agent ID**（agents/ 下的 MD 文件名，不含 .md），`subagent_type` 也传入相同值。**禁止**使用中文名或自创名称
4. 裁决型角色（如研究主管、风险主管）必须给出明确结论，不得回避决策
5. 每完成一个阶段向用户简要通报进度

---

## SOP 工作流编排

### 并行 vs 串行

- **并行 Phase**：同一条消息中 spawn 多个成员（使用 TeamCreate），适用于成员间无数据依赖
- **串行 Phase**：等前一 Phase 全部回传后，将结论传入下一 Phase 的成员 prompt

### 示例 SOP

```
Phase 1（并行）：
  stock-researcher → 基本面+财务
  valuation-pricer → 估值判断
  money-tracker   → 资金态度

Phase 2（串行，Phase 1 结论传入）：
  risk-doctor → 综合风险诊断

主理人汇编 → 输出
```

### 预设 Workflow 设计原则

每个 Workflow 写明：
- **触发条件**：什么类型的问法匹配此 Workflow
- **Phase 编排**：分 Phase 的串并行调度
- **输入输出依赖**：每个 Phase 的输入来自哪里、输出传给谁

Workflow 数量根据用户实际高频场景设计，不是越多越好。

---

## settings.json

Team 型必须有 `settings.json`：

```json
{
  "agent": "{team}-team-lead"
}
```

值必须与 plugin.json 的 `agentName` 和主理人 MD 文件的 `name` 一致。


---


# 头像生成规范

> /Applications/WorkBuddy.app/Contents/Resources/app.asar.unpacked/resources/plugins/workbuddy-builtin/skills/expert-manager/references/avatar-spec.md

## 基本要求

| 项目 | 要求 |
|------|------|
| 格式 | PNG（推荐）或 JPG |
| 尺寸 | 512×512 px（正方形） |
| 大小 | 单张不超过 500KB |
| 风格 | 统一漫画/插画风格，专业自然 |
| 内容 | 符合角色定位，不含违规内容 |

> 使用 `ImageGen` 工具生成，`size` 参数设为 `"1024x1024"`（高清大图，市场缩放为 512×512 展示）。

## 生成策略

**Agent 型**：1 张头像
- `avatars/expert.png`

**Team 型**：N+1 张头像
- `avatars/team.png` — 团队整体头像
- `avatars/{team}-team-lead.png` — 主理人头像
- `avatars/{member-name}.png` — 每个团员头像

---

## Prompt 构建核心原则

**每个头像的 prompt 必须从对应的 MD 文件描述中提取角色特征，不使用通用模板硬编码。**

### 提取步骤

1. **读取 Agent MD 文件**
2. **提取角色身份**：从标题和首段提取
3. **提取专业特征**：从"核心能力"章节提取关键词，转化为视觉元素
4. **推断工作风格**：从"工作流程"和"注意事项"推断性格气质
5. **推断人物属性**：从 name 字段推断性别和风格基调

---

## 个人头像 Prompt 组装

```
[风格前缀] + [角色身份] + [外观特征] + [表情气质] + [背景元素] + [质量后缀]
```

| 部分 | 说明 | 示例 |
|------|------|------|
| 风格前缀 | 统一漫画/插画风格 | `Professional cartoon-style illustration avatar,` |
| 角色身份 | 从 MD 标题/首段提取 | `a female design system document architect` |
| 外观特征 | 从核心能力推断穿着/配饰 | `wearing stylish glasses, holding a design specification document` |
| 表情气质 | 从工作风格推断 | `confident and meticulous expression` |
| 背景元素 | 从专业领域提取视觉符号 | `subtle design tokens and color palette swatches in background` |
| 质量后缀 | 固定 | `Bust shot, facing forward. Clean simple background. High quality, professional, natural.` |

### 示例 1：设计系统架构师

MD 核心内容：角色=设计系统文档架构师，能力=9大标准章节、AI可读格式，输出=Markdown+HEX+CSS

```
Professional cartoon-style illustration avatar, a female design system document architect,
wearing stylish glasses, holding a design guideline document, modern creative smart casual attire,
confident and meticulous expression with a creative yet precise aura,
subtle color palette swatches, typography samples and design token symbols in the background.
Bust shot, facing forward. Clean simple warm-toned background. High quality, professional, natural.
```

### 示例 2：技术分析师

MD 核心内容：角色=技术分析师，能力=K线形态、均线分析、MACD/RSI/KDJ

```
Professional cartoon-style illustration avatar, a male technical stock market analyst named Marco,
wearing a sharp vest over dress shirt, looking at holographic candlestick charts,
focused and analytical expression with sharp observant eyes,
K-line charts, moving average lines and MACD indicators floating in the background.
Bust shot, facing forward. Clean simple blue-toned background. High quality, professional, natural.
```

---

## 团队头像 Prompt 构建

**输入来源**：plugin.json 的 `displayDescription` + 主理人 MD 的团队描述

### 提取步骤

1. **团队定位**：从 displayDescription 提取团队做什么
2. **协作模式**：从主理人 MD 的 SOP 提取工作阶段
3. **成员构成**：从成员列表提取角色类型的多样性
4. **视觉表达**：将以上信息转化为体现团队协作的场景

### Prompt 组装

```
[风格前缀] + [团队场景描述] + [协作元素] + [成员象征] + [质量后缀]
```

### 示例：交易分析团队

```
Professional cartoon-style illustration, a dynamic stock trading analysis team scene,
multiple diverse analysts gathered around a central holographic display showing candlestick charts,
a bull figure and a bear figure debating on opposite sides symbolizing bull-bear debate,
risk gauges and decision dashboards floating around,
warm collaborative atmosphere with focused professional energy.
Clean simple multi-tone gradient background. High quality, professional, team composition.
```

---

## 同一团队风格统一规则

Team 型的所有头像必须在 prompt 中保持一致的**风格锚定词**：

**固定风格前缀（每个 prompt 开头）：**
```
Professional cartoon-style illustration avatar, consistent art style with warm lighting and soft shadows,
```

**固定质量后缀（每个 prompt 结尾）：**
```
Bust shot, facing forward. Clean simple {color}-toned background. High quality, professional, natural.
```

### 背景色调映射

| categoryId | 背景色调 |
|------------|---------|
| 01-ProductDesign | warm orange-coral |
| 02-Engineering | blue-purple |
| 03-GameSpatial | purple-red gradient |
| 04-DataAI | cyan-teal |
| 05-MarketingGrowth | red-orange |
| 06-ContentCreative | pink-magenta |
| 07-SalesCommerce | golden-amber |
| 08-FinanceInvestment | dark blue with gold accent |
| 09-OperationsHR | navy slate-blue |
| 10-ProjectQuality | green-emerald |
| 11-SecurityCompliance | dark grey-blue |
| 12-IndustryConsultant | deep teal with silver accent |

---

## 执行流程

1. **读取 Agent MD** — 逐个读取 agents/ 下每个 MD
2. **提取角色特征** — 从角色定义、核心能力、工作流程中提取
3. **构建个人 prompt** — 按上述步骤将特征转化为视觉描述
4. **构建团队 prompt**（Team 型）— 从 displayDescription 和主理人 MD 提取
5. **统一风格锚定** — 确保所有 prompt 使用相同的风格前缀和后缀
6. **调用 ImageGen** — 逐张生成，`output_dir` 为专家包的 `avatars/`，`size` 为 `"1024x1024"`
7. **重命名文件** — 将生成的图片重命名为 plugin.json 中声明的文件名
8. **验证** — 确认所有头像文件已存在于 avatars/

## 注意事项

1. **必须基于 MD 描述生成**：不要使用通用 prompt
2. **团队头像体现协作**：不是简单人物剪影
3. **同一团队画风一致**：共用风格锚定词和背景色调
4. **生成失败处理**：在 README.md 中标注需手动补充的头像，附推荐 prompt
5. **用户可替换**：提醒自动生成的头像可手动替换（512×512，PNG/JPG，≤500KB）


---


# plugin.json 字段规范

> /Applications/WorkBuddy.app/Contents/Resources/app.asar.unpacked/resources/plugins/workbuddy-builtin/skills/expert-manager/references/plugin-json-spec.md

## 基础字段（必填）

| 字段 | 类型 | 说明 |
|------|------|------|
| `name` | string | 唯一标识，小写字母+连字符，也是技能命名空间前缀 |
| `version` | string | 语义化版本号（MAJOR.MINOR.PATCH） |
| `description` | string | 英文一句话描述 |

## 可选基础字段

| 字段 | 类型 | 说明 |
|------|------|------|
| `author` | `{name, email}` | 作者信息 |
| `homepage` | string 或 `{url, type}` | 项目主页 |
| `license` | string | 许可证 |
| `keywords` | string[] | 搜索标签 |

## 类型字段

| 字段 | 说明 |
|------|------|
| `expertType` | `"agent"` / `"team"` |
| `agentName` | 主 Agent 名称（对应 agents/ 下 MD 文件名，不含 .md）。**必须有业务语义**，不能使用 `team-lead` 等通用名 |
| `teamInfo` | team 时必填：`{leadAgent, memberAgents[]}` |

## 资源声明

| 字段 | 类型 | 说明 |
|------|------|------|
| `agents` | string[] | Agent 定义文件路径列表（如 `["./agents/my-expert.md"]`） |
| `skills` | string[] | Skill 目录路径列表（如 `["./skills/my-skill"]`） |

## 展示字段（agent/team 上架市场时必填）

| 字段 | 类型 | 说明 |
|------|------|------|
| `displayName` | `{en, zh}` | 展示名称 |
| `profession` | `{en, zh}` | 职业/定位。**Team 型须与 displayName 一致** |
| `displayDescription` | `{en, zh}` | 展示描述。**中文 40-50 字，突出核心能力** |
| `avatar` | string | 头像相对路径 |
| `categoryId` | string | 行业分类 ID |
| `defaultInitPrompt` | `{en, zh}` | 默认引导语。**须与 quickPrompts 第一条一致** |
| `tags` | `{en, zh}[]` | 擅长领域标签（**固定 3 个**） |
| `quickPrompts` | `{en, zh}[]` | 推荐提示词（**固定 3 个**） |
| `plugin` | string | 值与 `name` 一致 |

## Team 专用字段

| 字段 | 说明 |
|------|------|
| `members[]` | 每个成员含 `{id, name:{en,zh}, profession:{en,zh}, avatar, role}` |

- `role` 取值：`"lead"` 或 `"member"`
- 主理人也必须在 members 中，role 为 `"lead"`
- `teamInfo.memberAgents` **不含**主理人

---

## 模板：Agent 型

```json
{
  "name": "{kebab-case-name}",
  "version": "1.0.0",
  "description": "{English one-line description}",
  "author": {
    "name": "{author-name}",
    "email": "{author-email}"
  },
  "agents": ["./agents/{agent-name}.md"],
  "skills": ["./skills/{skill-name}"],

  "expertType": "agent",
  "agentName": "{agent-name}",

  "displayName": {
    "en": "{English display name}",
    "zh": "{中文显示名称}"
  },
  "profession": {
    "en": "{English profession}",
    "zh": "{中文职业头衔}"
  },
  "displayDescription": {
    "en": "{English detailed description}",
    "zh": "{中文详细描述，40-50字}"
  },
  "avatar": "avatars/expert.png",
  "categoryId": "{XX-CategoryName}",
  "defaultInitPrompt": {
    "zh": "{中文首次对话提示}",
    "en": "{English first prompt}"
  },
  "plugin": "{kebab-case-name}",
  "tags": [
    { "en": "{Tag1 EN}", "zh": "{标签1}" },
    { "en": "{Tag2 EN}", "zh": "{标签2}" },
    { "en": "{Tag3 EN}", "zh": "{标签3}" }
  ],
  "quickPrompts": [
    { "en": "{Prompt1 EN}", "zh": "{提示词1}" },
    { "en": "{Prompt2 EN}", "zh": "{提示词2}" },
    { "en": "{Prompt3 EN}", "zh": "{提示词3}" }
  ]
}
```

> 如果没有 skills，则省略 `"skills"` 字段。

## 模板：Team 型

```json
{
  "name": "{kebab-case-name}",
  "version": "1.0.0",
  "description": "{English one-line description}",
  "author": {
    "name": "{author-name}",
    "email": "{author-email}"
  },
  "agents": [
    "./agents/{team}-team-lead.md",
    "./agents/{member-a}.md",
    "./agents/{member-b}.md"
  ],
  "skills": ["./skills/{skill-name}"],

  "expertType": "team",
  "agentName": "{team}-team-lead",
  "teamInfo": {
    "leadAgent": "{team}-team-lead",
    "memberAgents": ["{member-a}", "{member-b}"]
  },

  "displayName": {
    "en": "{English team name}",
    "zh": "{中文团队名称}"
  },
  "profession": {
    "en": "{English team name}",
    "zh": "{中文团队名称}"
  },
  "displayDescription": {
    "en": "{English team description}",
    "zh": "{中文团队描述，40-50字}"
  },
  "avatar": "avatars/team.png",
  "categoryId": "{XX-CategoryName}",
  "defaultInitPrompt": {
    "zh": "{中文首次问候}",
    "en": "{English first prompt}"
  },
  "plugin": "{kebab-case-name}",
  "tags": [
    { "en": "{Tag1 EN}", "zh": "{标签1}" },
    { "en": "{Tag2 EN}", "zh": "{标签2}" },
    { "en": "{Tag3 EN}", "zh": "{标签3}" }
  ],
  "quickPrompts": [
    { "en": "{Prompt1 EN}", "zh": "{提示词1}" },
    { "en": "{Prompt2 EN}", "zh": "{提示词2}" },
    { "en": "{Prompt3 EN}", "zh": "{提示词3}" }
  ],
  "members": [
    {
      "id": "{team}-team-lead",
      "displayName": { "en": "{EN}", "zh": "{ZH}" },
      "profession": { "en": "{EN}", "zh": "{ZH}" },
      "avatar": "avatars/{team}-team-lead.png",
      "role": "lead"
    },
    {
      "id": "{member-name}",
      "displayName": { "en": "{EN}", "zh": "{ZH}" },
      "profession": { "en": "{EN}", "zh": "{ZH}" },
      "avatar": "avatars/{member-name}.png",
      "role": "member"
    }
  ]
}
```
