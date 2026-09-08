---
type: article
title: "WorkBuddy 专家 / 专家团机制研究"
date: 2026-09-08 11:44:00 +0800
tags: [workbuddy, agent, expert, expert-team]
---

> 目标：完整还原 WorkBuddy 中「专家（Expert）」与「专家团（Expert Team）」的定义方式，并给出可移植到自建智能体的落地方案。
> 所有结论均来自本机实际安装文件，路径可溯源。

---

## 0. 结论速览

| 问题 | 结论 |
|---|---|
| 专家是什么 | 一个**本地目录形态的插件包**，核心是 `plugin.json` 元数据 + `agents/*.md` 人格提示词。不是模型，不是微调，是纯 Prompt+资源的组合 |
| 专家包放在哪 | `$WORKBUDDY_CONFIG_DIR/plugins/marketplaces/<marketplace>/plugins/<expert-name>/`（默认 `~/.workbuddy/...`） |
| 元数据文件 | `.codebuddy-plugin/plugin.json`（兼容 `.workbuddy-plugin/`） |
| 怎么被发现的 | 写入 marketplace 根目录下的 `.codebuddy-plugin/marketplace.json` 的 `plugins[]` 数组 |
| 专家 vs 专家团 | 由 `expertType` 区分：`agent` = 单角色，`team` = 主理人 + N 个成员 |
| 专家团怎么协作 | 主理人执行 `TeamCreate` → `Agent spawn 成员` → 成员 `SendMessage` 回传主理人，**禁止成员互连** |
| 关键设计 | 专家模式下**不注入助手默认人格**（SOUL/IDENTITY），由专家 MD 自带的身份指令完全覆盖 |

---

## 1. 本质：专家 = 可安装的角色包

WorkBuddy 的专家不是一个独立模型或 API，它是三层结构的组合：

```
第 1 层  元数据层   plugin.json   —— 告诉系统"这是谁、属于哪类、怎么展示"
第 2 层  人格层     agents/*.md   —— 告诉模型"你是谁、怎么思考、怎么输出"
第 3 层  能力层     skills/ bin/  —— 可选，挂载专业技能与可执行脚本
```

**核心洞察**：专家的能力强弱 ≈ Agent MD 的质量，而不是模型本身。所有"专业性"都是提示词工程 + 流程约束的产物。

---

## 2. 数据结构

### 2.1 类型划分

| expertType | 含义 | 判定规则 |
|---|---|---|
| `agent` | 专家（单角色） | 1 个 Agent MD |
| `team` | 专家团（多角色协作） | 主理人 MD + N 个成员 MD，有 `teamInfo` 和 `members` |

判定不可随意指定，**必须按实际结构判断**：单角色 = agent，多角色协作 = team。

### 2.2 plugin.json 字段规范

来源：`resources/plugins/workbuddy-builtin/skills/expert-manager/references/plugin-json-spec.md`

#### 基础字段（必填）

| 字段 | 类型 | 说明 |
|---|---|---|
| `name` | string | 唯一标识，kebab-case，同时是技能命名空间前缀 |
| `version` | string | 语义化版本 |
| `description` | string | 英文一句话描述 |

#### 类型字段

| 字段 | 说明 |
|---|---|
| `expertType` | `"agent"` / `"team"` |
| `agentName` | 主 Agent 名 = `agents/` 下 MD 文件名（不含 .md）。**必须有业务语义**，禁用 `team-lead` 等通用名 |
| `teamInfo` | team 必填：`{leadAgent, memberAgents[]}`，`memberAgents` **不含主理人** |

#### 资源声明

| 字段 | 说明 |
|---|---|
| `agents` | string[]，Agent MD 路径，如 `["./agents/my-expert.md"]` |
| `skills` | string[]，Skill 目录路径，如 `["./skills/my-skill"]` |

#### 展示字段（上架市场必填）

| 字段 | 说明 | 硬约束 |
|---|---|---|
| `displayName` | `{en, zh}` 花名 | 可自由修改 |
| `profession` | `{en, zh}` 职业头衔 | Team 型须与 displayName 一致 |
| `displayDescription` | `{en, zh}` 能力介绍 | 中文 40-50 字 |
| `avatar` | 头像相对路径 | 512×512，≤500KB |
| `categoryId` | 行业分类 ID | 见 6.2 |
| `defaultInitPrompt` | `{en, zh}` 首次引导语 | **须与 quickPrompts[0] 一致** |
| `tags` | `{en, zh}[]` 擅长领域 | **固定 3 个** |
| `quickPrompts` | `{en, zh}[]` 推荐提问 | **固定 3 个** |

#### Team 专用

```jsonc
"members": [
  { "id": "trading-team-lead", "name": {"en":"He","zh":"何执舟"},
    "profession": {"en":"Chief Strategist","zh":"首席策略官"},
    "avatar": "avatars/team-lead.png", "role": "lead" }
]
```

- `role` 取值 `"lead"` / `"member"`
- **主理人也必须在 `members` 里**（role=lead），但 `teamInfo.memberAgents` 不含它

### 2.3 Agent MD 规范

来源：`references/agent-md-spec.md`

#### Frontmatter（必填）

```yaml
---
name: {与文件名一致，必须有业务语义}
description: {英文描述，AI 用来判断何时激活}
displayName: { en: "...", zh: "..." }
profession:  { en: "...", zh: "..." }
maxTurns: 50          # 主理人建议 150-200
---
```

**禁止在 frontmatter 声明 `tools` 字段** —— 工具权限由系统统一分配。

#### 正文结构

```markdown
# {角色名称} - {人名}
{角色描述}

## 核心能力
## 工作流程
## 输出规范
## 注意事项
```

**团队成员额外要求**：必须在 prompt 中明确写出「分析完成后通过 SendMessage 回传给主理人」。

**主理人额外要求**：
- 文件名必须是 `{team}-team-lead.md`（禁用通用 `team-lead.md`）
- 必须包含：成员能力清单（Agent ID + 擅长领域 + 典型问法）、预设 Workflow、单 agent 直调路由表

### 2.4 目录结构

```
my-expert/
├── .codebuddy-plugin/
│   └── plugin.json          # 元数据（核心）
├── settings.json            # Team 型必需：{"agent": "{team}-team-lead"}
├── agents/
│   ├── {team}-team-lead.md  # 主理人（Team 型）
│   ├── {member-a}.md        # 成员
│   └── {member-b}.md
├── avatars/
│   ├── team.png             # 团队头像
│   ├── {team}-team-lead.png
│   └── {member-a}.png
├── skills/                  # 可选，专业技能
│   └── {skill-name}/SKILL.md
├── bin/                     # 可选，CLI 工具
└── .created-by-session      # 注册脚本自动写入
```

Team 型的 `settings.json` 值必须与 `plugin.json` 的 `agentName`、主理人 MD 的 `name` 三者一致。

---

## 3. 生命周期：7 步流水线

由 `expert-manager` skill 定义（`resources/plugins/workbuddy-builtin/skills/expert-manager/SKILL.md`）：

```
1. 收集信息（交互提问 / 资料转化）
2. init_expert.py     初始化目录骨架（带 [TODO] 占位符）
3. AI 填充内容        按 references/ 规范写 plugin.json、agents/*.md
4. 生成头像           ImageGen，参考 avatar-spec.md
5. validate_expert.py 校验
6. register_expert.py 注册到 marketplace.json
7. package_expert.py  打包分发
```

对应脚本（均在 `skills/expert-manager/scripts/`）：

| 脚本 | 作用 |
|---|---|
| `init_expert.py` | 建 `.codebuddy-plugin/`、`agents/`、`avatars/`，写模板文件 |
| `validate_expert.py` | 校验必填字段、i18n 双语、categoryId 合法性、`tools` 字段违禁等 |
| `register_expert.py` | 二次校验（拒绝 `[TODO]`）+ 写 `marketplace.json` + 写 `.created-by-session` |
| `package_expert.py` | 打包分发 |
| `batch_create.py` | 批量创建（必须串行走 init→validate→register） |

### 唯一标识铁律（不可修改）

以下字段/文件名是专家的身份锚，改动会导致专家丢失：

- `plugin.json` 的 `name`
- `plugin.json` 的 `agentName`
- 专家目录名
- `agents/` 下的 `.md` 文件名（因为 `agentName` = MD 文件名）

改名 = 重新创建，不支持原地改名。

---

## 4. 发现与注册机制

专家不会自动被扫描到，必须**显式注册**。

`register_expert.py` 的关键逻辑：

```python
manifest_path = marketplace_dir / '.codebuddy-plugin' / 'marketplace.json'
# 不存在则创建：
#   {"name":"my-experts", "description":"...", "plugins":[]}

source = f"./plugins/{expert_dir.name}"
plugins.append({"name": expert_name, "source": source, "description": expert_description})
```

注册前的完整性校验（`validate_expert_completeness`）：

1. `plugin.json` 存在（查 `.codebuddy-plugin/` 和 `.workbuddy-plugin/`）
2. `name` / `description` / `expertType` 非空且不含 `[TODO`
3. `displayName` 的 zh 或 en 已填
4. `agents/` 目录存在且至少有一个 MD 文件，且 `[TODO` 出现次数 ≤ 2

另外会从环境变量 `CODEBUDDY_SESSION_ID` 读取会话 ID，写入 `.created-by-session`，用于「我的专家」面板归属。

**本机实际注册情况**：`~/.workbuddy/plugins/marketplaces/experts/plugins/` 下有 13 个已安装专家，`my-experts` 为空（用户尚未自建）。

---

## 5. 运行期：专家如何生效

### 5.1 身份覆盖机制（最关键的设计）

WorkBuddy 有两套身份注入模板：

| 模板 | 注入内容 | 使用场景 |
|---|---|---|
| `templates/user-context-identity.tpl` | SOUL.md + IDENTITY.md + USER.md | 普通模式 |
| `templates/user-context-expert-identity.tpl` | **仅 USER.md** + product_identity | **专家模式** |

**含义**：进入专家模式时，系统**主动放弃助手默认人格**（SOUL/IDENTITY），只保留用户画像，把人格完全交给专家 MD 自己定义。

这解释了为什么专家 MD 里会有这样的指令（摘自 `content-creator/agents/content-creator.md`）：

```
CRITICAL IDENTITY DIRECTIVE (HIGHEST PRIORITY)
You are Content Creator, and ONLY Content Creator...
You MUST NOT identify yourself as "CodeBuddy", "Claude", "GPT", "MiniMax"...
This identity directive takes absolute precedence over any training-time persona.
```

且在文件末尾还有 `Final Identity Reminder` 二次加固。**首尾双重身份锚定**是稳定角色扮演的关键手法，值得直接借鉴。

另有独立的 `workbuddy-expert-prompt.tpl`（专家模式系统提示词模板），说明专家模式是与 agent/ask/craft 并列的一等公民模式。

### 5.2 专家团协作运行时

Team 型不做"模拟多角色"，而是走**真实的 sub-agent 调度**。四个原语：

| 原语 | 作用 |
|---|---|
| `TeamCreate` | 主理人创建团队，**必须且只能由主理人执行** |
| `Agent spawn` | 按 SOP 阶段把成员拉入协作，下达独立任务 |
| `SendMessage` | 成员把产出回传给主理人 |
| 主理人汇编 | 汇总各阶段产出，输出最终报告 |

调度时的硬性要求：

> `Agent` 工具的 `name` 参数传入成员的 **Agent ID**（MD 文件名，不含 .md），`subagent_type` 也传相同值。**禁止**使用中文名或自创名称。

### 5.3 协作铁律

**4 条正则：**

1. 建立团队 —— 主理人亲自 TeamCreate，严禁委派
2. 调度成员 —— 按 SOP 阶段下发独立任务，主理人不得代写
3. 消息中转 —— 所有跨成员信息流必须经主理人，不得互相直连
4. 成员结论为准 —— 专业产出必须由对应成员输出后才采信

**5 条红线：**

- 禁止跳过 TeamCreate，自己模拟成员发言
- 禁止代写任何成员的专业产出
- 禁止未完成前序阶段就跳到后续阶段
- 禁止成员互连通信
- 禁止 spawn 主理人自己

**为什么这么严**：大模型天然的"一气呵成"倾向会跳过子角色直接给答案，导致多角色退化为单人分饰多角，专业性丧失。这 5 条红线本质上是**对抗模型的抄近道本能**。

### 5.4 编排模式

**并行 Phase**：同一条消息中 spawn 多个成员（成员间无数据依赖）
**串行 Phase**：等前一 Phase 全部回传，把完整产出原文传入下一 Phase

---

## 6. 配套机制

### 6.1 头像生成

来源：`references/avatar-spec.md`

- 512×512 PNG，≤500KB，用 `ImageGen` 以 `1024x1024` 生成后缩放
- Agent 型 1 张（`avatars/expert.png`）；Team 型 N+1 张（团队 + 主理人 + 每个成员）
- Prompt 组装：`[风格前缀] + [角色身份] + [外观特征] + [表情气质] + [背景元素] + [质量后缀]`
- **必须从 Agent MD 内容提取特征**，禁止通用模板硬编码
- 同一团队共用风格锚定词；背景色调由 `categoryId` 映射（如金融 = dark blue with gold accent）

### 6.2 行业分类体系（12 类）

| categoryId | 分类 | | categoryId | 分类 |
|---|---|---|---|---|
| `01-ProductDesign` | 产品设计 | | `07-SalesCommerce` | 销售商务 |
| `02-Engineering` | 技术工程 | | `08-FinanceInvestment` | 金融投资 |
| `03-GameSpatial` | 游戏空间 | | `09-OperationsHR` | 运营人力 |
| `04-DataAI` | 数据智能 | | `10-ProjectQuality` | 项目质量 |
| `05-MarketingGrowth` | 营销增长 | | `11-SecurityCompliance` | 法务安全 |
| `06-ContentCreative` | 内容创作 | | `12-IndustryConsultant` | 行业顾问 |

判定优先级：主要输出物 → 服务对象 → 跨领域时选最核心的一个。

> 注意：`validate_expert.py` 的 `VALID_CATEGORY_IDS` 只含上述 12 个，但本机 `andon-q-expert` 实际使用 `13-TencentZone`，说明存在未公开的扩展分类。

### 6.3 内置推荐候选

`resources/builtin-expert-recommendations/curated-experts.json` 含 60 个候选（50 专家 + 10 专家团），用于「推荐专家」场景：

```json
{
  "id": "SeniorDeveloper",
  "type": "expert",
  "scenarios": ["高级开发", "架构设计", "代码质量"],
  "description": "10年以上全栈经验，精通多种语言和框架，是团队的技术中坚",
  "priority": 300
}
```

`priority` 从 300 递减（步长 5），`scenarios` 用于意图匹配。这是**轻量推荐索引**，不是完整专家包。

### 6.4 团队成员命名规范

| 规则 | 说明 |
|---|---|
| 建议三个字 | 姓+名结构，先是正常人名 |
| 暗含职能巧思 | 谐音/拆字/典故，但不刻意 |
| 不与 profession 重复 | name 是"谁"，profession 是"做什么" |
| 中英文都自然 | 中文花名，英文拼音姓氏 |

示例：交付总监→齐活林（齐活了）、架构师→高见远（高见）、工程师→寇豆码（code）、QA→严过关。

禁止：叠字谐音、纯职能词、无意义随机名（张三/John Doe）、英文用 Agent ID。

---

## 7. 真实案例：trading-agent（13 角色 5 阶段）

路径：`~/.workbuddy/plugins/marketplaces/experts/plugins/trading-agent/`

**配置**：`expertType: team`，`agentName: trading-team-lead`，`categoryId: 08-FinanceInvestment`

**5 阶段 SOP**：

```
Phase 1 数据收集（4人并行）
  技术分析师 + 基本面分析师 + 新闻分析师 + 情绪分析师
      ↓
Phase 2 多空辩论（串行）
  多头研究员 → 空头研究员 → 研究主管裁决 → [投资计划]
      ↓
Phase 3 交易决策
  交易员 → FINAL TRANSACTION PROPOSAL
      ↓
Phase 4 风险评估（3人并行 + 裁决）
  激进/保守/中性风险分析师 → 风险主管 → [最终交易决策]
      ↓
Phase 5 主理人汇编 → 最终投资分析报告
```

**设计亮点（可直接复用）**：

1. **辩论式裁决**：多头/空头对立 → 研究主管裁决，强制输出明确结论不和稀泥
2. **三方风险视角**：激进/保守/中性并行 → 风险主管拍板
3. **单 agent 直调路由表**：只问 K 线就直调 `market-analyst`，不跑完整 Workflow（省 token）
4. **数据源锁定**：明令"禁止使用非 `neodata-financial-search` 的数据源"，防止成员各查各的
5. **花名系统**：何执舟（首席策略官）、涂一线、季本实、牛正阳/熊正寒（多空对偶）、严控风（风险主管）

---

## 8. 移植到自建智能体的落地方案

### 8.1 最小数据模型

只需要三个概念即可复刻：

```
ExpertPackage  = Meta(plugin.json) + Agents(MD[]) + Optional(Skills)
ExpertRegistry = {name, source, description}[]      # 即 marketplace.json
TeamRuntime    = TeamCreate / spawn / sendMessage / collect
```

### 8.2 目录与注册表

```
experts/
├── registry.json                 # 等价于 marketplace.json
└── packages/
    ├── my-expert/
    │   ├── meta.json             # 等价于 plugin.json
    │   ├── agents/{name}.md
    │   └── avatars/
    └── my-team/
        ├── meta.json
        ├── settings.json         # {"agent": "xxx-team-lead"}
        └── agents/*.md
```

### 8.3 加载器（核心逻辑）

```python
def load_expert(pkg_dir) -> SystemPrompt:
    meta = json.load(open(f"{pkg_dir}/meta.json"))
    agent_name = meta["agentName"]
    md = read(f"{pkg_dir}/agents/{agent_name}.md")
    frontmatter, body = split_frontmatter(md)

    if meta.get("expertType") == "team":
        # 主理人 prompt + 成员能力清单 + 协作铁律
        members = [load_member(m) for m in meta["teamInfo"]["memberAgents"]]
        return compose_lead_prompt(body, members, collab_rules)

    # agent 型：身份指令 + 正文，直接作为 system prompt
    return body
```

### 8.4 团队编排运行时（必须实现的 4 个原语）

```
TeamCreate(team_name)                       # 主理人独占
spawn(agent_id, task_prompt)                # agent_id = MD 文件名
sendMessage(from_member, to_lead, result)   # 成员回传，禁止成员间直连
collect(phase_results) -> next_phase_input  # 主理人汇编
```

**移植时必须保留的约束**（否则多角色会退化）：

1. 主理人不得代写成员产出 —— 实现上可通过「主理人 prompt 里禁写、成员必须回传」双重约束
2. 跨成员信息流必须经主理人 —— 通信拓扑强制为星型，不提供成员间 channel
3. 阶段依赖强校验 —— 前一 Phase 未回传完，不允许 spawn 下一 Phase
4. 身份双重锚定 —— 专家 MD 开头 + 结尾各一次身份指令

### 8.5 需要避开的坑

| 坑 | 说明 |
|---|---|
| 规范与实现不一致 | `plugin-json-spec.md` 的 Team 模板写 `displayName`，实际专家（trading-agent）用 `name`。以实际实现为准 |
| 老专家不符合新规范 | trading-agent 无 `tags`/`quickPrompts`，content-creator 无 `plugin` 字段。v2.0 规范是渐进演进的 |
| 分类 ID 校验过严 | 校验器只认 12 类，但实际存在 `13-TencentZone` 等扩展 |
| 改名即丢失 | name/agentName/目录名/MD 文件名四者绑定，改任一都断裂 |
| 头像必须基于 MD 生成 | 用通用模板会导致同一团队画风分裂 |

---

## 9. 源码路径索引

| 内容 | 路径 |
|---|---|
| 专家包管理 Skill | `resources/plugins/workbuddy-builtin/skills/expert-manager/SKILL.md` |
| plugin.json 规范 | `.../expert-manager/references/plugin-json-spec.md` |
| Agent MD 规范 | `.../expert-manager/references/agent-md-spec.md` |
| Team 协作规范 | `.../expert-manager/references/team-spec.md` |
| 头像规范 | `.../expert-manager/references/avatar-spec.md` |
| 注册脚本 | `.../expert-manager/scripts/register_expert.py` |
| 校验脚本 | `.../expert-manager/scripts/validate_expert.py` |
| 初始化脚本 | `.../expert-manager/scripts/init_expert.py` |
| 专家模式系统提示词 | `resources/templates/workbuddy-expert-prompt.tpl` |
| 专家模式身份注入 | `resources/templates/user-context-expert-identity.tpl` |
| 内置推荐候选 | `resources/builtin-expert-recommendations/curated-experts.json` |
| 已安装专家实例 | `~/.workbuddy/plugins/marketplaces/experts/plugins/` |

（以上相对路径基于 `/Applications/WorkBuddy.app/Contents/Resources/app.asar.unpacked/`）
