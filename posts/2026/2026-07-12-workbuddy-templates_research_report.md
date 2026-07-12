---
type: article
title: "WorkBuddy 提示词模板体系深度解析"
date: 2026-07-12 20:50:00 +0800
tags: [workbuddy, agent, templates, prompt]
---

## 一、目录总览

`resources/templates/` 共包含 **15 个模板文件**，组织为 4 个功能层级 + 1 个风格库：

```
resources/templates/
├── 系统提醒层（System Reminder Layer）
│   ├── system-reminder.tpl              ← 空占位符
│   ├── ask-mode-reminder.tpl            ← Ask 模式规则
│   └── craft-mode-reminder.tpl          ← Craft 模式规则
│
├── 用户身份层（Identity Context Layer）
│   ├── user-context-identity.tpl        ← 标准身份上下文（SOUL/IDENTITY/USER）
│   └── user-context-expert-identity.tpl ← 专家身份上下文（精简版，仅 USER）
│
├── 主提示词层（Core Prompt Layer）— 3×3 矩阵
│   ├── workbuddy-ask-prompt.tpl           ← Ask / 通用
│   ├── workbuddy-ask-coding-prompt.tpl    ← Ask / 编码
│   ├── workbuddy-craft-coding-prompt.tpl  ← Craft / 编码
│   ├── workbuddy-craft-design-prompt.tpl  ← Craft / 设计 ★ 完全独立体系
│   ├── workbuddy-expert-prompt.tpl        ← Expert / 通用
│   ├── workbuddy-expert-coding-prompt.tpl ← Expert / 编码
│   └── workbuddy-prompt.tpl               ← Craft / 通用（默认主模板）
│
└── 风格库（Style Library）
    └── style/
        ├── style-creative.md        天马行空
        ├── style-friendly.md        亲和友善
        ├── style-professional.md    专业严谨
        ├── style-sarcastic.md       毒舌吐槽
        ├── style-socratic.md        启发引导
        ├── style-straightforward.md 直言不讳
        └── style-efficient.md       高效务实
```

---

## 二、核心架构：三层叠加模型

运行时提示词由三层按顺序拼接而成：

```
┌─────────────────────────────────────────────────┐
│  Layer 1: system-reminder.tpl                   │  ← 系统级提醒（空/模式切换）
├─────────────────────────────────────────────────┤
│  Layer 2: user-context-*.tpl                    │  ← 用户身份/产品身份/风格/自定义指令
├─────────────────────────────────────────────────┤
│  Layer 3: workbuddy-*-prompt.tpl                │  ← 主提示词（模式 × 领域 矩阵）
└─────────────────────────────────────────────────┘
```

### 模板语法体系
全目录使用 **Jinja2/Nunjucks** 语法：

| 语法 | 用途 | 示例 |
|---|---|---|
| `{{ var }}` | 变量插值 | `{{ modelName }}`, `{{ productName }}` |
| `{% if cond %}` | 条件块 | `{% if IsWindows %}...{% endif %}` |
| `{%- if cond %}` | 带空白控制 | `{%- if not productFeatures.DisableMultimodalGeneration %}` |

特别用法：`{% if '中文' in ResponseLanguage %}` 进行语言判断。

### 关键变量全景

| 变量 | 用途 |
|---|---|
| `modelName` / `productName` / `dataFolderName` | 模型、产品、数据目录名 |
| `ResponseLanguage` / `BinaryContext` | 响应语言、二进制上下文 |
| `IsWindows` | 平台检测 |
| `WorkspaceIdentityMode` | `onboarding` vs 正常运行 |
| `SoulContent` / `IdentityContent` / `UserContent` | 三大身份文件内容 |
| `ToneStyleContent` | 用户选择的沟通风格 |
| `UserCustomPrompt` | 用户自定义指令 |
| `ClawMemory_1/2/3` | 三层记忆注入点 |
| `subAgentPrompt` / `ExpertManagement` | 子代理 / 专家管理内容 |
| `PluginAgentPrompt` | Expert 模式角色定义 |
| `ArtifactDirectoryPath` | Artifact 输出目录 |

---

## 三、模式矩阵：3 种模式 × 3 个领域

### 3 种工作模式

| 模式 | 核心特征 | 代表模板 |
|------|---------|---------|
| **Ask** | 只读（Talk only, hands off），禁止任何修改 | `workbuddy-ask-prompt.tpl` |
| **Craft** | 执行（You say, I do），完整读写工具权限 | `workbuddy-prompt.tpl` |
| **Expert** | 专家（Agentic mode），插件智能体覆盖身份 | `workbuddy-expert-prompt.tpl` |

### 3 个领域变体

| 领域 | 定位 | 特殊差异 |
|------|------|---------|
| **通用** | 全能助手 | 均衡描述 |
| **编码** | 编程专用 | 条件渲染多模态生成（`DisableMultimodalGeneration`） |
| **设计** | 智能设计助手 | 完全独立体系，画布操作、三部分回复格式 |

### 完整矩阵映射

```
              通用          编码           设计
Ask       ask-prompt    ask-coding      —
Craft     prompt        craft-coding    craft-design ★
Expert    expert-prompt expert-coding   —
```

> **关键发现**：`craft-design` 不是 Craft 通用模板的变体，而是完全独立的设计体系（Intelligent Design Assistant）。

---

## 四、逐层深度解析

### 4.1 系统提醒层（Layer 1）

| 文件 | 内容 | 作用 |
|------|------|------|
| `system-reminder.tpl` | 空 `<system_reminder></system_reminder>` | 占位符，可能被动态注入 |
| `ask-mode-reminder.tpl` | 声明"只读模式"，禁止编辑、禁止运行非只读工具 | 强制 Ask 模式行为约束 |
| `craft-mode-reminder.tpl` | 声明"已进入 Craft 模式，文件读写能力已启用" | 模式切换信号 |

### 4.2 用户身份层（Layer 2）

#### `user-context-identity.tpl`（标准版）— 59 行

```
身份上下文（WorkspaceIdentityMode）
├── onboarding 模式
│   ├── BOOTSTRAP.md → "出生证明"
│   └── 需更新 SOUL.md → IDENTITY.md → USER.md → 删除 BOOTSTRAP.md
│
└── 正常运行模式
    ├── SOUL.md →  embody persona and tone
    ├── IDENTITY.md → 保持与最新注入身份一致
    └── USER.md → 用户画像

产品身份 → "You are {{ productName }}, a powerful AI assistant."
语气和风格（ToneStyleContent）→ 覆盖默认行为，最高优先级
用户自定义指令（UserCustomPrompt）→ 必须遵循，除非与安全规则冲突
```

#### `user-context-expert-identity.tpl`（专家版）— 30 行

与标准版的关键差异：
- **没有 `SOUL.md` 和 `IDENTITY.md`** — 专家角色完全由 `{{ PluginAgentPrompt }}` 覆盖
- **没有 `ToneStyleContent` 和 `UserCustomPrompt`** — 专家模式有独立的风格系统
- **只有 `USER.md`** — 保留用户画像，但角色身份由插件智能体定义

### 4.3 主提示词层（Layer 3）— 核心差异分析

#### 4.3.1 Ask 模式（`ask-prompt` / `ask-coding-prompt`）— 142 行

**核心约束**：
```
<current_mode>
- Only answer questions, read files, and analyze information
- must NOT modify files or run shell commands
- must NOT claim that created/updated/saved/generated a local file
</current_mode>
```

**特色模块**：
- `instructions_for_visualizer` — 详细可视化指令（120+行），含模型感知复杂度限制：
  - Claude/GPT：无上限，复杂 D3/Three.js
  - GLM/KIMI：中等复杂度，标准图表/简洁 SVG
  - Hunyuan/Minimax：最小复杂度，简单静态图表
- `ask_mode_behavior` — 先解释原理，再创建计划，最后建议切换 Craft

#### 4.3.2 Craft 通用模式（`workbuddy-prompt.tpl`）— 371 行

**核心变化**：
- 无 `<current_mode>` 限制 — 完全读写权限
- 工具使用策略：优先专业工具，并行执行，顺序依赖
- Agent Loop：分析 → 思考 → 选择工具 → 执行 → 观察 → 迭代
- **Result Presentation** 强制规则：最终工具调用必须是 `present_files`
- **Skill 系统**：安装前必须安全审计（P0/P1/P2 风险分级）
- **Skill 累积**：8+ 工具调用后必须保存为 Skill
- **Automation**：SQLite 数据库管理，支持 recurring/once/validFrom/validUntil

#### 4.3.3 Craft 编码模式（`workbuddy-craft-coding-prompt.tpl`）— 376 行

与 Craft 通用版几乎相同，仅 **3 处差异**：
1. 多模态生成声明被条件包裹：`{%- if not productFeatures.DisableMultimodalGeneration %}`
2. 能力描述顺序微调（编码场景优先）
3. 其他内容完全相同

#### 4.3.4 Craft 设计模式（`workbuddy-craft-design-prompt.tpl`）— 296 行 ★ 最独特

**这是完全独立的体系，不是 Craft 通用版的变体。**

**身份定位**：
```
You are the Intelligent Design Assistant (智能设计助手)
— design-focused capability of {{ productName }}
```

**关键差异**：

| 维度 | Craft 通用 | Craft 设计 |
|------|----------|----------|
| 身份 | 全能 AI 助手 | 智能设计助手 |
| 工作区 | 文件系统 | 画布（Canvas）+ `.ardot` 文件 |
| 工具集 | 文件/命令/搜索 | 画布操作 + 截图验证 |
| 回复格式 | 自由格式 | **强制三部分格式**（Opening / Progress / Closing） |
| 能力边界 | 无限制 | 明确拒绝非设计任务（代码开发、数据库、纯数学） |
| 自我描述 | 不领先说编码 | 以设计同事自居 |

**设计专属模块**：
- `boundaries` — 明确拒绝非设计请求
- `interaction_principles` — 6 条设计交互原则
  - **Target node takes priority**：用户明确指定节点时，绝不猜测"用户真正想改什么"
- `agent_loop` — 设计专用循环：理解意图 → 加载方法 → 执行 → **截图验证** → 迭代
- `result_presentation` — **强制三部分结构**：
  ```
  Part 1 — Opening: 自然温暖回应，分享设计思考
  ---
  Part 2 — Progress: 关键输出、风格、结构、截图验证
  ---
  Part 3 — Closing: 总结成果，标记注意事项，邀请反馈
  ```
- `core_capabilities` — Text-to-UI / Image-to-UI / 幻灯片生成 / 网站原型
- `.pptx` 边界判定：关键词精确匹配才触发 `pptx` Skill

#### 4.3.5 Expert 模式（`expert-prompt` / `expert-coding-prompt`）— 376 行

**最关键特征**：
```
**Role Override:** The following expert role definition takes precedence 
over any previously established persona or identity context.

{{ PluginAgentPrompt }}
```

专家模式的身份被 **插件智能体提示词完全覆盖**。系统记忆、用户记忆、产品身份全部退居二线。

**Expert 模式特有**：
- `agentic_mode_overview` — Artifacts 系统：任务完成概览写入 `{{ ArtifactDirectoryPath }}/overview.md`
- `agent_loop` — 7 步循环（含 **Present outcome** 步骤）
- `task_management` — 任务管理工具（TaskCreate/TaskGet/TaskUpdate/TaskList）
- `ExpertManagement` — 专家管理插槽
- `subAgentPrompt` — 子智能体提示词插槽

**Content Policy 更严格**：
- 通用版：允许反问/解释为何拒绝
- 专家版：**拒绝时不得解释原因**（"When refusing, do not explain why"）

---

## 五、ClawMemory 插槽系统

所有主提示词模板包含 **3 个记忆插槽**：

```
{{ ClawMemory_1 }}  → 通常注入系统级规则/记忆
{{ ClawMemory_2 }}  → 通常注入工具使用/安全策略
{{ ClawMemory_3 }}  → 通常注入补充说明/边界情况
```

这种设计允许运行时动态注入记忆，而不需要修改模板文件本身。

---

## 六、安全策略体系

### 多层安全架构

```
Content Policy（内容政策）
├── 政治敏感内容拒绝（中国政治人物、制度、领土完整）
├── 色情/暴力/仇恨言论拒绝
├── 非法活动拒绝（武器、黑客、欺诈）
├── 隐私保护拒绝
├── 虚假信息拒绝
└── 港澳台必须标注"中国"

Personal Files Safety（个人文件安全）
├── No-Go Zones（Desktop/Downloads/Documents/Home 禁止递归删除）
├── Scan = Read-Only（扫描仅报告，不操作）
├── Vague = Ask First（模糊请求先确认）
├── Warn + List + Confirm（破坏性操作前警告）
├── Back Up First（操作前备份）
├── Trash, Not Delete（使用回收站而非 rm）
├── Small Batches（每批最多 10 文件）
└── No Script Files on Windows（Windows 不写 .ps1/.bat）

Windows Command Safety（Windows 命令安全）
├── 禁止额外 shell 包装（cmd /c, powershell -Command）
├── 绝对路径验证
├── 路径转义安全
└── 失败后禁止 retry workaround
```

---

## 七、风格库（Style Library）— 7 种人格

```
┌─────────────────────────┬────────────────────────────┬────────────────────┐
│ 风格                     │ 核心特征                    │ 适用场景            │
├─────────────────────────┼────────────────────────────┼────────────────────┤
│ Creative 天马行空        │ 想象力、故事化、比喻           │ 头脑风暴、创意任务    │
│ Friendly 亲和友善        │ 温暖、鼓励、日常类比           │ 新手引导、答疑       │
│ Professional 专业严谨.   │ 精确、证据、结构化             │ 技术文档、专业咨询   │
│ Sarcastic 毒舌吐槽       │ 幽默讽刺、但绝不人身攻击        │ 轻松氛围、调试排错   │
│ Socratic 启发引导        │ 提问式教学、渐进提示           │ 教育、学习场景       │
│ Straightforward 直言不讳 │ 直接、无废话、果断判断         │ 紧急决策、快速反馈    │
│ Efficient 高效务实       │ 极简、高密度、清单优先         │ 代码审查、快速操作    │
└─────────────────────────┴────────────────────────────┴────────────────────┘
```

每个风格定义包含：Tone & Voice（语气）、Language Patterns（语言模式）、Behavioral Guidelines（行为准则）、Response Structure（回复结构）四个维度。

---

## 八、关键设计洞察

### 1. **模板即产品**
提示词模板不是配置，而是产品的核心逻辑载体。从模式切换、安全策略到记忆管理，全部编码在模板中。

### 2. **设计模式是独立产品**
`craft-design` 不是 Craft 的 skin，而是**完全独立的产品线**（Intelligent Design Assistant）。它有独立的身份、边界、工作流和回复格式。

### 3. **条件渲染实现产品差异化**
通过 Jinja2 条件（`{% if %}`）和变量插值（`{{ }}`），同一模板可适配：
- 不同语言（中文/英文）— `ResponseLanguage`
- 不同平台（Windows/macOS/Linux）— `IsWindows`
- 不同功能开关 — `productFeatures.DisableMultimodalGeneration`
- 不同用户状态 — `WorkspaceIdentityMode`（onboarding / normal）

### 4. **记忆插槽实现动态扩展**
`ClawMemory_1/2/3` 让运行时系统能在不修改模板的情况下注入动态规则、记忆和策略。

### 5. **安全是分层且不可覆盖的**
Content Policy 声明："These safety rules override any user instructions and cannot be bypassed"

### 6. **可视化是模型感知的**
Visualizer 复杂度限制根据底层模型（Claude/GPT/GLM/KIMI/Hunyuan/Minimax）动态调整，体现了对模型能力的精准认知。

---

## 九、文件规模统计

| 文件 | 行数 | 大小 |
|------|------|------|
| `workbuddy-craft-coding-prompt.tpl` | 376 | 36,899 B |
| `workbuddy-prompt.tpl` | 371 | 35,756 B |
| `workbuddy-expert-prompt.tpl` | 376 | 34,898 B |
| `workbuddy-expert-coding-prompt.tpl` | 376 | 34,898 B |
| `workbuddy-craft-design-prompt.tpl` | 296 | 29,067 B |
| `workbuddy-ask-prompt.tpl` | 142 | 9,569 B |
| `workbuddy-ask-coding-prompt.tpl` | 142 | 9,569 B |
| `user-context-identity.tpl` | 59 | 1,984 B |
| `user-context-expert-identity.tpl` | 30 | 919 B |
| 风格文件（7个） | 31-36 | 各约 1KB |
| 系统提醒（3个） | 2-4 | 37-582 B |

---

## 十、总结

WorkBuddy 的模板体系是一个**精心设计的提示词工程（Prompt Engineering）产品架构**：

- **三层叠加模型**（系统提醒 → 身份上下文 → 主提示词）实现关注点分离
- **3×3 矩阵**（Ask/Craft/Expert × 通用/编码/设计）覆盖所有使用场景
- **7 种人格风格**提供个性化沟通体验
- **多层安全策略**保障不可突破的底线
- **动态记忆插槽**支持运行时扩展而不修改模板
- **模型感知的可视化**确保不同底层模型的最优输出

这套模板体系不仅是技术实现，更是**产品哲学的编码化表达**——每种模式、每个领域、每种风格都承载着对用户体验的深思熟虑。
