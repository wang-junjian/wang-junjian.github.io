---
type: article
title:  "Google DESIGN.md 规范与实践指南"
date:   2026-06-28 19:56:00 +0800
tags: [translation, design.md, design, agent, google-labs, cli]
---

# [DESIGN.md是什么？](https://stitch.withgoogle.com/docs/design-md/overview/)

每个项目都有自己的视觉标识：颜色、字体、间距、组件样式。传统上，这些内容存储在 Figma 文件、品牌 PDF 或设计师的脑海中。AI 智能体无法读取这些格式。

**`DESIGN.md` 改变了这一点。** 它是一个纯文本设计系统文档，人类和智能体都可以阅读、编辑和执行。可以将其视为 `AGENTS.md` 的设计对应物：

| 文件 | 阅读者 | 定义内容 |
|---|---|---|
| `README.md` | 人类 | 项目是什么 |
| `AGENTS.md` | 编码智能体 | 如何构建项目 |
| `DESIGN.md` | 设计智能体 | 项目应该长什么样、什么感觉 |

## 它能给你带来什么

当像 Stitch 这样的设计智能体读取你的 `DESIGN.md` 时，它生成的每个屏幕都遵循相同的视觉规则：你的调色板、你的排版、你的组件模式。没有它，每个屏幕都是孤立的；有了它，它们看起来属于同一个产品。

`DESIGN.md` 是一个**活的产物**，而不是静态配置文件。它随着你的设计演变而演变。智能体生成它，你完善它，并在迭代过程中重新应用到屏幕上。

在底层，每个 `DESIGN.md` 都有两层：**YAML 前置元数据**包含机器可读的设计令牌（精确的十六进制值、字体属性、间距尺度）和**Markdown 正文**提供人类可读的设计原理说明。令牌为智能体提供精确值。散文告诉它们*为什么*这些值存在。完整的格式请参阅[规范](/docs/design-md/specification/)。

## 设计理念

DESIGN.md 规范是一个**基础，而非规定**。它提供了一个智能体、工具和团队可以依赖的共同基础——一个关于颜色、排版、布局和组件的共享词汇——同时保留扩展格式以满足特定领域需求的自由。未知的部分和自定义令牌是被接受的，而不是被拒绝的。

## 如何创建它们

创建 `DESIGN.md` 有三种路径，从毫不费力到精确控制。

![在 Stitch 中从提示创建设计系统](/images/2026/design/design-systems-create.webp)

### 让智能体生成它

描述氛围。智能体将你的美学意图转化为令牌和指南。

> 一个有趣的咖啡店点餐应用，使用暖色调、圆角和友好的感觉

Stitch 生成一个完整的设计系统（颜色、排版、间距、组件样式）并将其总结为 `DESIGN.md`。

### 从品牌中提取

如果你已经有品牌，提供一个 URL 或图片。智能体从你的现有内容中提取调色板、排版和样式模式来构建 `DESIGN.md`。

![在 Stitch 中从网站 URL 导入设计系统](/images/2026/design/design-system-import-from-website.webp)

### 手写它

高级用户可以直接编写 `DESIGN.md`，编码精确的设计偏好。每个部分都只是 Markdown，可选的 YAML 前置元数据用于设计令牌。除了标准 Markdown 和 YAML 之外，没有特殊语法。

## 示例

下面是一个深色主题生产力应用的极简 `DESIGN.md`。YAML 前置元数据定义了精确的令牌值；Markdown 正文解释了设计意图。

```markdown
---
name: DevFocus Dark
colors:
  primary: "#2665fd"
  secondary: "#475569"
  surface: "#0b1326"
  on-surface: "#dae2fd"
  error: "#ffb4ab"
typography:
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: 400
rounded:
  md: 8px
---

# 设计系统

## 概述
一个专注、极简的深色界面，用于开发者生产力工具。
干净的线条、低视觉噪音、高信息密度。

## 颜色
- **主色** (#2665fd)：行动按钮、激活状态、关键交互元素
- **次要色** (#475569)：辅助界面、标签、次要操作
- **表面色** (#0b1326)：页面背景
- **表面上的文字** (#dae2fd)：深色背景上的主要文字
- **错误色** (#ffb4ab)：验证错误、破坏性操作

## 排版
- **标题**：Inter，半粗体
- **正文**：Inter，常规体，14–16px
- **标签**：Inter，中等体，12px，区块标题使用大写

## 组件
- **按钮**：圆角（8px），主色使用品牌蓝色填充
- **输入框**：1px 边框，微妙的表面变体背景
- **卡片**：无阴影，依赖边框和背景对比度

## 注意事项
- 主色要节制使用，只用于最重要的操作
- 不要在同一个视图中混合使用圆角和直角
- 所有文字保持 4:1 对比度比例
```

这就是智能体在生成你的下一个屏幕时读取的内容。完整的格式规范请参阅[规范](/docs/design-md/specification/)。要验证你的 DESIGN.md 是否符合规范，请参阅[使用 CLI 验证](/docs/design-md/cli/)。


# [从您的代码库导入](https://stitch.withgoogle.com/docs/design-md/get-instructions/)

你的代码库已经拥有设计语言——颜色散落在样式表中，间距模式埋在组件文件里，排版选择锁定在 Tailwind 配置中。`DESIGN.md` 将所有内容集中在一个地方，这样 Stitch 就能生成看起来属于你的产品而非空白默认模板的屏幕。

有两种方法可以实现：一个快速提示，你可以粘贴到任何编码智能体中；或者一个专门的技能，自动化整个流程。

## 快速提示

将此提示复制到任何编码智能体（Gemini、Claude Code、Cursor、Antigravity）中，从项目目录运行。不需要技能或插件——智能体读取你的源文件，并根据它发现的内容编写 `DESIGN.md`。

> [上下文 — 可选] 添加关于你的代码库用途、关键文件和目标的详细信息。
> 
> [说明] 在设计之前先阅读代码库和/或网站。仓库和/或网站是事实来源。从真实内容开始。从产品名称、标语和文案中从 README 中提取。从配置文件、CLI 帮助文本、模式和错误消息中提取标签、值和术语。不虚构，不填充——如果仓库中没有，设计中就不展示。
> 
> 查看现有代码中的视觉标识：颜色值、字体尺度、间距令牌、组件模式。如果存在设计系统，就继承它。如果值分散在多个文件中，就收集它们——即使未记录，它们也揭示了视觉意图。阅读核心逻辑和数据结构，而不仅仅是文档。它们告诉你产品的原生形态——时间线、图表、目录、流水线。让这种形态来组织页面，而不是使用区块模板。
> 
> 找到 README 首先介绍的内容。该功能主导页面。在放置其他内容之前先确定它的权重——重要的东西先于可测量的东西。

### 提示的作用

该提示告诉智能体从你的代码反向工作，而不是从模板正向工作。它提取三个层次：

1. **内容** — 直接从源代码中提取的产品名称、标签和文案。没有填充文本，没有 lorem ipsum。
2. **视觉标识** — 从样式表、主题文件和 Tailwind 配置中收集的颜色、字体、间距和组件模式。
3. **信息架构** — 产品数据的自然形态，决定了页面的组织方式。

输出是一个 `DESIGN.md`，你可以将其放入 `.stitch/DESIGN.md` 并立即用于屏幕生成。

### 获得更好结果的技巧

- **指向特定目录。** 添加类似"关注 `src/styles/`、`tailwind.config.ts` 和 `src/components/`"的行到上下文块中。
- **命名你的技术栈。** 告诉智能体"这是一个 React + Tailwind + shadcn/ui 项目"有助于它在正确的地方查找。
- **迭代。** 第一次提取捕捉大局。完善它："强调色应该是导航栏中的蓝绿色，而不是页脚中的蓝色。"

## 使用 Stitch 设计技能自动提取

上面的提示在任何地方都有效，但它依赖智能体的一般推理能力。**Stitch 设计技能**是专门为每个主要框架——React、Vue、Svelte、Angular、纯 CSS 和 Tailwind——精确查找设计令牌而构建的智能体指令。

### 什么是 Stitch 设计技能？

[Stitch 设计技能](https://github.com/google-labs-code/stitch-skills) 是一个开源的 13 个智能体技能集合，分为三个插件：

| 插件 | 功能 |
|--------|-------------|
| **stitch-design** | 创建和捕获设计——从代码中提取令牌、快照运行中的应用、上传到 Stitch |
| **stitch-build** | 将设计转化为代码——React 组件、演示视频、shadcn/ui 集成 |
| **stitch-utilities** | 提升质量——提示优化、高级设计系统、自主多页面生成 |

技能遵循 [Agent Skills](https://agentskills.io) 开放标准，与任何兼容的编码智能体配合使用。

### 安装插件套件

```bash
npx plugins add google-labs-code/stitch-skills --scope project --target claude-code
```

将 `claude-code` 替换为 `cursor`、`gemini-cli` 或 `antigravity`，取决于你使用的智能体。

### 从源代码提取 DESIGN.md

`extract-design-md` 技能扫描你的源代码树，无需构建或运行应用：

> 从 ./src 提取设计系统并写入 .stitch/DESIGN.md

该技能自动检测你的技术栈（Tailwind 配置、CSS 自定义属性、主题文件、styled-components）并处理每个设计维度：

- **视觉氛围** — 整体氛围、留白哲学、色温
- **调色板** — 每种独特颜色，去重并分配功能角色
- **排版** — 字体族、字体尺度层级、字重和间距模式
- **组件样式** — 按钮、卡片、导航、输入框和特定领域元素
- **布局原则** — 网格系统、响应式断点、间距策略

输出包括 YAML 前置元数据（机器可读令牌）和 Markdown 散文（人类可读设计原理）。这种双模格式使 `DESIGN.md` 对工具和 AI 智能体都有效。

### 上传到 Stitch

一旦你有了 `DESIGN.md`，将其推送到 Stitch 项目，这样每个生成的屏幕都遵循你的设计系统：

> 将 .stitch/DESIGN.md 上传到 Stitch 并从中创建设计系统。

`manage-design-system` 技能处理上传并在项目级别注册设计系统。所有未来的屏幕自动继承你的令牌。

### 完整的代码到设计流程

对于完整导入——设计系统提取、静态 HTML 捕获和 Stitch 上传一步到位——使用编排器技能：

> 将 ./my-app 的前端上传到名为 "My App Migration" 的 Stitch 项目。

`code-to-design` 技能链式执行三个步骤：从运行中的应用提取静态 HTML、从源代码逆向工程设计系统，以及将所有内容上传到 Stitch。

## 我应该使用哪种方法？

| 场景 | 推荐方法 |
|-----------|---------------------|
| 快速提取，无需设置 | 将上面的提示复制到任何智能体中 |
| 彻底、框架感知的提取 | 安装技能，使用 `extract-design-md` |
| 完整迁移到 Stitch | 安装技能，使用 `code-to-design` |
| 从头编写 DESIGN.md | 格式请参阅 [什么是 DESIGN.md？](/docs/design-md/overview/) |


# [DESIGN.md 规范](https://stitch.withgoogle.com/docs/design-md/specification/)

DESIGN.md 文件有两层。**YAML 前置元数据**包含机器可读的设计令牌——智能体用于强制执行一致性的精确值。**Markdown 正文**提供人类可读的设计原理，组织成 `##` 章节。正文可以使用描述性颜色名称（例如"午夜森林绿"），对应系统化的令牌名称（例如 `primary`）。令牌是规范值；正文提供如何应用它们的上下文。

该规范是一个**基础，而非规定**。它为智能体、工具和团队提供可以依赖的共同基础，同时保留扩展格式以满足特定领域需求的自由。

## 设计令牌

DESIGN.md 将设计令牌嵌入为文件开头的 YAML 前置元数据。前置元数据块必须以恰好包含 `---` 的行开始，以恰好包含 `---` 的行结束。这些分隔符之间的 YAML 内容遵循下面定义的架构。

令牌系统受 [W3C 设计令牌格式](https://www.designtokens.org/) 启发。令牌可以轻松转换为 `tokens.json`、Figma 变量和 Tailwind 主题配置，以及反向转换。

```yaml
---
version: alpha
name: Daylight Prestige
colors:
  primary: "#1A1C1E"
  secondary: "#6C7278"
  tertiary: "#B8422E"
typography:
  h1:
    fontFamily: Public Sans
    fontSize: 48px
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: -0.02em
rounded:
  sm: 4px
  md: 8px
spacing:
  sm: 8px
  md: 16px
components:
  button-primary:
    backgroundColor: "{colors.primary-60}"
    textColor: "{colors.primary-20}"
    rounded: "{rounded.md}"
    padding: 12px
---
```

### 架构

```yaml
version: <string>          # 可选，当前版本："alpha"
name: <string>
description: <string>      # 可选
colors:
  <token-name>: 
typography:
  <token-name>: 
rounded:
  <scale-level>: 
spacing:
  <scale-level>: 
components:
  <component-name>:
    <token-name>: <string | token reference>
```

`<scale-level>` 占位符代表尺寸或间距尺度中的命名级别。常见级别名称包括 `xs`、`sm`、`md`、`lg`、`xl` 和 `full`。任何描述性字符串键都是有效的。

## 令牌类型

| 类型 | 格式 | 示例 |
|---|---|---|
| **颜色** | `#` + 十六进制代码（sRGB） | `"#1A1C1E"` |
| **尺寸** | 数字 + 单位（`px`、`em`、`rem`） | `48px`、`-0.02em` |
| **令牌引用** | `{path.to.token}` | `{colors.primary}` |
| **排版** | 复合对象 | 见下方属性 |

### 排版属性

| 属性 | 类型 | 描述 |
|---|---|---|
| `fontFamily` | 字符串 | 字体族名称 |
| `fontSize` | 尺寸 | 字体大小 |
| `fontWeight` | 数字 | 数字字重（例如 `400`、`700`）。在 YAML 中，裸数字和引号字符串是等效的 |
| `lineHeight` | 尺寸 \| 数字 | 尺寸（例如 `24px`）或无单位倍数（例如 `1.6`）。推荐使用无单位 |
| `letterSpacing` | 尺寸 | 字间距调整 |
| `fontFeature` | 字符串 | 配置 [`font-feature-settings`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/font-feature-settings) |
| `fontVariation` | 字符串 | 配置 [`font-variation-settings`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/font-variation-settings) |

### 令牌引用

令牌引用用花括号包裹，包含指向 YAML 树中另一个值的对象路径。对于大多数令牌组，引用必须指向原始值（例如 `{colors.primary-60}`），而不是一个组。在 `components` 部分内，允许引用复合值（例如 `{typography.label-md}`）。

```yaml
components:
  button-primary:
    backgroundColor: "{colors.primary-60}"
    textColor: "{colors.primary-20}"
    rounded: "{rounded.md}"
```

## 章节

每个 DESIGN.md 遵循相同的结构。如果与项目无关，章节可以省略，但存在的章节应按下面列出的顺序出现。所有章节使用 `##` 标题。可选的 `#` 标题可用于文档标题，但不会被解析为章节。

章节结构故意保持开放。规范章节提供共享词汇；设计系统可以自由添加超出这些的特定领域章节。

### 章节顺序

| # | 章节 | 别名 |
|---|---|---|
| 1 | 概述 | 品牌与风格 |
| 2 | 颜色 | |
| 3 | 排版 | |
| 4 | 布局 | 布局与间距 |
| 5 | 高度与深度 | 高度 |
| 6 | 形状 | |
| 7 | 组件 | |
| 8 | 注意事项 | |

### 概述

也称为"品牌与风格"。对产品外观和感觉的整体描述。本节定义品牌个性、目标受众以及 UI 应唤起的情感反应。当特定规则或令牌未定义时，它作为基础上下文。

```markdown
## 概述
一个平静、专业的医疗预约平台界面。
以无障碍为先的设计，高对比度和充足的触摸目标。
```

### 颜色

定义设计系统的调色板。至少应定义 `primary` 调色板。可以任意命名额外的调色板；常见约定是 `primary`、`secondary`、`tertiary` 和 `neutral`。

```markdown
## 颜色

调色板以高对比度中性色和单一强调色为根基。

- **主色 (#1A1C1E)：** 深墨色，用于标题和核心文字。
- **次要色 (#6C7278)：** 精致的石板色，用于边框、说明文字、元数据。
- **第三色 (#B8422E)：** 交互的唯一驱动色。
- **中性色 (#F7F5F2)：** 温暖的石灰岩基础色。
```

**设计令牌：** 一个 `map<string, Color>`，将令牌名称映射到其十六进制值。

```yaml
colors:
  primary: "#1A1C1E"
  secondary: "#6C7278"
  tertiary: "#B8422E"
  neutral: "#F7F5F2"
```

### 排版

定义排版层级。大多数设计系统有 9–15 个层级，每个都有语义角色（标题、正文、标签）和尺寸变体（小、中、大）。

```markdown
## 排版

- **标题：** Public Sans 半粗体，营造机构感。
- **正文：** Public Sans 常规体，16px，用于长文阅读。
- **标签：** Space Grotesk，用于技术数据和元数据。
```

**设计令牌：** 一个 `map<string, Typography>`，将令牌名称映射到其排版属性。

```yaml
typography:
  h1:
    fontFamily: Public Sans
    fontSize: 48px
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: -0.02em
  body-md:
    fontFamily: Public Sans
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.6
  label-caps:
    fontFamily: Space Grotesk
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1
    letterSpacing: 0.1em
```

### 布局

也称为"布局与间距"。描述布局和间距策略——网格模型、间距尺度和包含原则。

```markdown
## 布局

布局在移动端使用流体网格模型，在桌面端使用固定最大宽度网格（最大 1200px）。使用严格的 8px 间距尺度。
```

**设计令牌：** 一个 `map<string, Dimension | number>`，将间距尺度标识符映射到尺寸或无单位数字（例如列数或比例）。

```yaml
spacing:
  base: 16px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 32px
  xl: 64px
  gutter: 24px
  margin: 32px
```

### 高度与深度

也称为"高度"。描述如何传达视觉层级。对于使用阴影的设计，它定义阴影属性。对于扁平设计，它解释替代方法（边框、色调层、颜色对比）。

```markdown
## 高度与深度

深度通过色调层而非厚重阴影来实现。
背景使用柔和的米白色；主要内容放置在纯白色卡片上。
```

### 形状

描述视觉元素的形状——圆角、边缘处理和整体形状语言。

```markdown
## 形状

所有交互元素使用最小的 4px 圆角。
足够现代以感觉当代，足够硬朗以感觉工程化。
```

**设计令牌：** 一个 `map<string, Dimension>`，将尺度级别映射到圆角半径。

```yaml
rounded:
  sm: 4px
  md: 8px
  lg: 12px
  full: 9999px
```

### 组件

组件原子的样式指南。规范定义了常见组件类型——按钮、标签、列表、输入框、复选框、单选按钮、工具提示——但鼓励设计系统定义与其领域相关的额外组件。

```markdown
## 组件
- **按钮**：圆角（8px），主色使用品牌蓝色填充，次要色使用描边
- **输入框**：1px 边框，表面变体背景，12px 内边距
- **卡片**：无阴影，1px 描边边框，12px 圆角
```

**设计令牌：** 一个 `map<string, map<string, string>>`，将组件标识符映射到一组子令牌属性。令牌值可以是字面量或引用先前定义的令牌。

**变体。** 组件可以为不同的 UI 状态（悬停、激活、按下）定义变体。变体作为具有相关键名的单独组件条目定义。

```yaml
components:
  button-primary:
    backgroundColor: "{colors.primary-60}"
    textColor: "{colors.primary-20}"
    rounded: "{rounded.md}"
    padding: 12px
  button-primary-hover:
    backgroundColor: "{colors.primary-70}"
```

#### 组件属性令牌

| 属性 | 类型 |
|---|---|
| `backgroundColor` | 颜色 |
| `textColor` | 颜色 |
| `typography` | 排版 |
| `rounded` | 尺寸 |
| `padding` | 尺寸 |
| `size` | 尺寸 |
| `height` | 尺寸 |
| `width` | 尺寸 |

### 注意事项

实用指南和常见陷阱。这些在生成过程中充当护栏。

```markdown
## 注意事项

- 主色每屏只用于单个最重要的操作
- 不要在同一个视图中混合使用圆角和直角
- 保持 WCAG AA 对比度比例（普通文字 4.5:1）
- 单屏不要使用超过两种字重
```

## 未知内容的消费者行为

该规范设计为可扩展的。当消费者遇到本规范未定义的内容时：

| 场景 | 行为 | 示例 |
|---|---|---|
| 未知章节标题 | 保留；不报错 | `## 图标设计` |
| 未知颜色令牌名称 | 如果值有效则接受 | `surface-container-high: '#ede7dd'` |
| 未知排版令牌名称 | 作为有效排版接受 | `telemetry-data` |
| 未知间距值 | 接受；如果不是有效尺寸则存储为字符串 | `grid-columns: '5'` |
| 未知组件属性 | 接受并警告 | `borderColor` |
| 重复章节标题 | 错误；拒绝文件 | 两个 `## 颜色` 标题 |

## 推荐的令牌名称

以下名称在设计系统中常用。它们不是必需的，但为一致性提供指导。

**颜色：** `primary`、`secondary`、`tertiary`、`neutral`、`surface`、`on-surface`、`error`

**排版：** `headline-display`、`headline-lg`、`headline-md`、`body-lg`、`body-md`、`body-sm`、`label-lg`、`label-md`、`label-sm`

**圆角：** `none`、`sm`、`md`、`lg`、`xl`、`full`
