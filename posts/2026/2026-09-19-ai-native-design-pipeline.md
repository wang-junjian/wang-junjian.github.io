---
type: article
title: "AI 原生设计流水线：从设计规范到 Figma 再到代码的实践指南"
date: 2026-09-19 14:00:00 +0800
tags: [ai-native, ai-sdlc, design-system, design-tokens, figma, claude-code, designmd, workflow]
---

> 实践记录：在[上一篇](/posts/2026/2026-09-18-ai-native-sdlc-practice/)里，我用 Claude Code + mattpocock-skills 走通了 AI 原生的开发流水线。这一次，我把目光投向开发之前被忽略的环节——**设计**。我基于 Google 的 DESIGN.md 规范，为「长辈计算器」建立了完整的设计流水线：从现有网站提炼设计规范 → 生成高保真 HTML 原型 → 导入 Figma → 与代码对齐。本文拆解每个阶段的做法、工具的能力边界，以及实战中踩过的六个坑。

## 一、范式转变：设计的事实源搬家了

传统 SDLC 中，设计的事实源（single source of truth）是 Figma：设计师在画板上创作，开发通过"交付"把设计变成代码。AI 原生 SDLC 中，事实源上移到**仓库里的文本规范**——因为文本是 AI 的原生格式：可读、可 diff、可 lint、可版本化。

| | 传统流向（人主导） | AI 原生流向（AI 主导） |
|---|---|---|
| 事实源 | Figma 画板 | 仓库里的 DESIGN.md |
| 设计稿形态 | Figma 帧 | HTML 高保真原型 |
| Figma 的角色 | 创作层 | 协作与存档层 |
| 迭代成本 | 分钟级（人工拖图层） | 秒级（改 prompt → 刷新） |

为什么流向变了？两个现实约束：

1. **Figma 对 AI 只读**。免费（Starter）账号下 REST API 只读且限流严格，官方 Dev Mode MCP 的完整能力需要付费席位。AI 没有"在 Figma 里创作"的手。
2. **HTML 是 AI 的天然设计稿**。真实排版引擎渲染、可交互、秒级迭代，保真度甚至高于画板。

两种流向并非互斥。长期维护的产品会形成**双向闭环**：AI 产出 HTML → 导入 Figma 供人评审 → 人在画板上微调 → AI 经 MCP 读回改动 → 同步代码。而 DESIGN.md 在两种流向里都是最上游的锚。

> AI 原生设计环节的本质：把设计从"图片"变成"文本 + 工具链"——规范可执行、原型可生成、偏离可审计、流程可复现。

## 二、阶段一：提炼设计规范（网站 → DESIGN.md）

设计规范采用 Google 开源的 [DESIGN.md](https://github.com/google-labs-code/design.md) 格式（npm 包 `@google/design.md`）：一个双层 Markdown 文件，YAML front matter 存机器可读的 design tokens，正文存人类可读的设计理念。**Tokens 给 AI 精确的值，prose 告诉它为什么。**

### 2.1 抓取参考来源

我选的参考对象是某央企门户官网——这类"庄重、清晰、高对比"的风格，恰好契合适老化产品的需要。直接 curl 抓取时撞上了瑞数反爬（返回 412 和 JS 挑战页），退路是 Wayback Machine：

```bash
# 查最近快照
curl "http://web.archive.org/cdx/search/cdx?url=example.com&output=json&limit=-3&filter=statuscode:200"
# 抓快照页面与主样式表
curl -L "http://web.archive.org/web/<时间戳>/http://www.example.com/"
```

拿到 658 行真实 CSS 后，颜色、字阶、圆角、间距、组件模式全部有据可依。

### 2.2 编写 DESIGN.md

```yaml
---
name: Enterprise Portal · 央企门户绿
colors:
  primary: "#00796A"      # 全站唯一交互强调色
  accent:  "#F6AB00"      # 琥珀金，每屏至多一处
typography:
  body:
    fontFamily: Microsoft YaHei, sans-serif
    fontSize: 14px
components:
  button-page:
    backgroundColor: "{colors.primary}"
    textColor: "#FFFFFF"
    rounded: "{rounded.sm}"
---
```

正文按固定章节顺序写设计理念（Overview 必须有且排第一）。三条写作心法，全部在实践中得到验证：

- **一个具体引用胜过一串形容词。**"央企门户、机关报式排版"比"简洁、现代、大气"信息量大得多——后者只会生成平庸的中间态。
- **负面约束是免费的。** 引用足够具体时，"不要渐变、不要大圆角"这类限制直接封死风格漂移，不必逐条罗列。
- **格式靠生长，不靠 spec。** 规范只规定最小结构，项目可自由扩展章节，linter 对未知内容宽容（保留，不报错）。

### 2.3 质量门：lint 必须 0/0

```bash
designmd lint DESIGN.md      # 0 errors / 0 warnings 才放行
designmd diff 旧 新           # 版本对比，审计偏离
designmd export --format css-tailwind DESIGN.md > theme.css  # tokens 直达代码
```

lint 内置 11 条规则，最实用的三条：`broken-ref`（token 引用悬空，error）、`contrast-ratio`（组件前景/背景低于 WCAG AA 4.5:1，warning）、`orphaned-tokens`（定义了却没被组件引用的颜色）。值得一提的是，**对比度检查与适老化设计天然同向**——规范工具本身就是无障碍守门员。

## 三、阶段二：HTML 高保真原型（DESIGN.md → 设计稿）

HTML 是 AI 的设计稿，原因有三：

- **迭代速度**：改 prompt → 刷新，几秒一轮；
- **保真度**：真实排版引擎、真实字体渲染，高于画板；
- **可交互**：hover、锚点、流程可直接体验。

生成规则四条：

1. **单文件、零依赖**：tokens 内联为 `:root` CSS 变量，整页自包含，随处可开；
2. **内容对齐领域文档**：文案、功能描述必须来自项目的领域文档（我的项目是 CONTEXT.md），AI 不杜撰产品行为；
3. **规范忠实**：颜色、字号、圆角、间距全部取自 tokens，组件模式按规范组件实现；
4. **项目偏离显式化**：确需偏离（如适老化把正文从 14px 提到 16px），写入 `DESIGN.overrides.md` 并在 HTML 头部注释引用（见"设计治理"一节）。

一条经验：**在 HTML 阶段把设计定稿。** HTML 阶段的修改成本是秒，Figma 阶段是分钟级且无法由 AI 代劳。我的原型一次通过评审后才进 Figma——顺序反了就得重来。

## 四、阶段三：导入 Figma（HTML → 协作层）

Figma 在 AI 原生流程中的角色是**协作与存档**：给人看、给人评论、留版本、做交付。先认清工具的能力边界：

| 途径 | 能力 | 适用 |
|---|---|---|
| Figma REST API | 只读（文件、节点、样式、导出图） | 免费账号可用；回读校验 |
| 官方 Dev Mode MCP | 读选中图层的结构化数据与设计变量 | 完整功能需付费席位 |
| Framelink MCP（figma-developer-mcp） | 只读，用 personal token | 设计稿 → 喂给 AI → 生成代码 |
| html.to.design（扩展 + 插件） | 单向写入：HTML 页面 → 可编辑画板 | 本流程的导入桥 |

操作步骤（这是流程中唯一的人工段落，约 2 分钟）：

1. AI 在原型目录起本地服务器：`python3 -m http.server 8901 --bind 127.0.0.1`；
2. Chrome 打开页面，点 html.to.design 扩展 → **Capture this page**；
3. **Send to Figma** → 桌面端唤起，配套插件自动落地为可编辑画板；
4. 把文件链接发回给 AI，进入对齐校验。

**禁止路径**：不要在 Figma 插件里直接粘贴 localhost URL。插件的渲染在厂商服务器上进行，访问不到你的本机——我因此产出过一个空文件。本地页面必须走 Chrome 扩展（扩展在本机抓取渲染结果，不受网络可达性限制）；同理，直接双击打开的 `file://` 页面扩展无权访问，必须起本地服务器。

## 五、阶段四：对齐与实现（规范 ⇄ 设计稿 ⇄ 代码）

- **规范直达代码**：`export --format css-tailwind` 产出的 `@theme` CSS 变量块，即使不用 Tailwind 也能直接贴进任何项目当 design tokens 用。规范与实现同源，不存在"设计稿和代码两个版本"。
- **设计稿回读校验**：新会话中通过 Framelink MCP 的 `get_figma_data` 读取画板，与 DESIGN.md tokens 比对。**不要轮询 REST API**——Starter 账号限流阈值低，轮询必触发 429。校验用一次性读取或人工目测，别把流程卡在自动化校验上。
- **变更审计**：规范或产出变更时跑 `designmd diff 旧 新`，token 级增删改一目了然；回归（错误/警告变多）时退出码为 1，可直接接 CI。

## 六、设计治理：标准只读，偏离显式

实践中冒出来一个真问题：我把适老化的 16px 正文写进原型后，差点顺手回写进 DESIGN.md——但 DESIGN.md 提炼自公司标准，**项目没有资格修改标准**。AI 会顺手改文件，治理规则必须前置。最终确立三层模型：

```
公司标准 DESIGN.md（只读消费）
    │
    ▼
项目偏离 DESIGN.overrides.md（只记 delta + 理由）
    │
    ▼
产出物（原型 / Figma / 代码）
```

- **标准不被项目修改**：DESIGN.md 是输入，不是草稿；
- **偏离必须带理由**：例——"正文 14px → 16px：目标用户为 60–80 岁老花眼人群，适老化可读性优先"；
- **偏离可审计**：定期用 diff 对照标准，确认没有隐性漂移；
- **回流有门槛**：某条偏离在多个项目反复验证有效后，由标准维护者走评审回流入公司标准——项目侧不代劳。

## 七、工具链配置（一次性）

**Figma token 管理**：personal access token 放入 shell 环境，绝不进 git：

```bash
# ~/.zshrc
export FIGMA_TOKEN="figd_xxxxxxxx"
```

**Figma MCP 注册（Claude Code）**：注册在**用户级**且 token 直接内嵌——GUI 启动的编辑器不读 `~/.zshrc`，用 `${VAR}` 引用会取到空值：

```bash
claude mcp add figma --scope user -- \
  npx -y figma-developer-mcp --figma-api-key figd_xxxxxxxx --stdio

claude mcp list   # 期望输出：figma: ... ✔ Connected
```

**DESIGN.md CLI**：可用 `npx @google/design.md`，或克隆仓库后用 `bun run cli <cmd>` 本地调用——后者绕开包下载的权限拦截，也便于锁定版本。

## 八、踩坑记录：每个坑只踩一次

| 坑 | 现象 | 正确路径 |
|---|---|---|
| 目标站反爬 | curl 返回 412 与 JS 挑战页（瑞数类保护） | 改走 Wayback Machine 快照（CDX API 查档） |
| npx 权限拦截 | `npx @google/design.md` 被安全策略拦下 | 本地克隆仓库，`bun run cli lint` |
| file:// 抓不了 | Chrome 扩展默认无权访问本地文件页 | `python3 -m http.server` 起 localhost |
| 插件抓 localhost | Figma 插件粘贴 localhost URL → 生成空文件 | 必须走 Chrome 扩展本机抓取 |
| REST 限流 | Starter 账号轮询校验 → 429 Rate limit | 一次性读取 / MCP 回读 / 人工目测 |
| 环境变量取空 | GUI 启动的编辑器不读 ~/.zshrc，MCP 报 missing env | MCP 配置用户级注册、token 内嵌 |

这些坑的解法最终全部固化进了项目的 `docs/agents/design-pipeline.md`——固化的意义就是把"试错"变成"照做"，下次直接进入正确路径。

## 九、人工介入点：AI 与人的分界

| 步骤 | 执行者 |
|---|---|
| 提炼规范、生成原型、lint / export / diff、起本地服务器 | **AI 全自动** |
| 安装扩展与插件、点 Capture、发回文件链接 | **人**（约 2 分钟） |
| 设计评审拍板、偏离回流标准的决策 | **人** |

把这张表写进流程文档后，AI 能自动跑到"需要人点扩展"那一步并把指引递过来。**人机分工显式化，是流程可复现的前提。**

## 十、落地检查清单

设计环节嵌入 ticket 生命周期：界面类 ticket 标记 `ready-for-agent` 之前，逐项确认：

- [ ] **规范就绪**——DESIGN.md 存在且 lint 0 errors / 0 warnings
- [ ] **原型就绪**——HTML 原型通过评审，tokens 全部取自规范，内容与领域文档对齐
- [ ] **偏离显式**——所有项目级偏离已写入 DESIGN.overrides.md 并附理由
- [ ] **Figma 存档**——画板已生成（扩展路径），链接记录在 ticket 中
- [ ] **实现同源**——代码使用的 tokens 来自 export 产物，非手抄色值
- [ ] **标准纯净**——公司标准文件本次零改动（git diff 为空）

## 附录：实操实录

以下截图记录了「长辈计算器」项目完整走完这条流水线的实际产出：Claude Code 基于 DESIGN.md 与 CONTEXT.md 生成单文件 HTML 高保真原型（做法见第三节），评审通过后导入 Figma。

### 网站转换为 Figma 设计稿

导入桥用的是 divRIOTS 的 html.to.design，由两个配套组件组成：

- **Chrome 扩展**：[html.to.design](https://chromewebstore.google.com/detail/htmltodesign/ldnheaepmnmbjjjahokphckbpgciiaed)——应用商店搜「html.to.design」即可。它抓取页面的 DOM/CSS 结构（不是截图），转换为可编辑的 Figma 图层，因此需要调用 Chrome 的调试功能。
- **Figma 插件**：[html.to.design（Figma 社区）](https://www.figma.com/community/plugin/1159123024924461424/html-to-design-by-divriots-import-websites-to-figma-designs-web-html-css)——接收扩展发来的抓取结果并落地为画板。

抓取结果有四种去处：保存为 `.h2d` 文件拖入插件、直接发送至插件、下载 `.make` 文件给 Figma Make、复制到剪贴板直接 ⌘+V 粘贴进画布。本流程用第二种。具体操作步骤（起本地服务器 → Capture → Send to Figma）见第四节，此处不再重复；文件链接生成后发回给 AI，即进入第五节的对齐校验。

![html.to.design 插件将网页导入 Figma 的界面](/images/2026/figma/html.to.design-import-to-figma.webp)

### 设计稿及预览

导入完成后的可编辑画板与预览效果：

![长辈计算器导入 Figma 后的设计稿](/images/2026/figma/elder-friendly-calculator-design.webp)

![长辈计算器设计稿的预览效果](/images/2026/figma/elder-friendly-calculator-present.webp)

### Figma Make 内置 AI 设计高保真原型

画板导入后，还可以用 Figma Make 内置的 AI 在设计稿基础上继续生成和迭代高保真原型，人工微调与 AI 生成在同一画板上衔接：

![Figma Make 中的原型预览](/images/2026/figma/figma-make-preview.webp)

![Figma Make 生成的代码视图](/images/2026/figma/figma-make-code.webp)


## 结语

一句话总结：**规范先行、原型即设计、Figma 为协作层、偏离可审计、流程可复现。**

回头看，AI 原生设计环节和 AI 原生开发环节共享同一个世界观：上下文会消失，所以共识必须落盘；产出无限而判断有限，所以质量门必须工具化；AI 的能力有明确边界，所以人机分工必须显式。设计不再是开发之前的"即兴活动"，而是流水线上不可跳过的闸门。
