---
name: publish-tool-release
description: |
  为 Astro 博客项目中的 HTML 工具生成 `type: release` 发布文档。
  当用户在 `tools/*.html` 中新增或修改了一个独立 HTML 工具，并说“发布”“生成文档”“写 release”“为这个工具写介绍”或类似意思时，使用此技能。
  也适用于用户想基于现有 HTML 工具补写一篇发布文章的场景。
  技能会读取 HTML 文件、参考已有 release 文章风格、生成 frontmatter 与正文，并在写入前征求用户确认。
---

# publish-tool-release

为项目 `tools/*.html` 下的独立 HTML 工具生成对应的 `type: release` 博客发布文档。

## 适用场景

- 用户在 `tools/` 下新增了一个 HTML 工具，需要写一篇发布文章。
- 用户更新了现有 HTML 工具，需要重新生成或补充发布文档。
- 用户说“为 xxx.html 生成 release 文档”“发布这个工具”“写个工具介绍”等。

## 输入

用户应提供一个 `tools/*.html` 文件的相对路径，例如：

```
tools/read-aloud.html
tools/minimalist-long-text-reader.html
```

如果用户没有提供路径，询问用户要发布的工具文件路径。

## 输出

在 `posts/YYYY/` 下生成一篇 Markdown 文件（`YYYY` 为年份）：

```
posts/YYYY/YYYY-MM-DD-release-<tool-slug>.md
```

其中：
- `YYYY-MM-DD` 为当前日期。
- `<tool-slug>` 为 HTML 文件名（不含 `.html` 后缀）。
- 如果当天已存在同名文件，覆盖更新。

## 执行步骤

### 1. 读取工具 HTML 文件

使用 Read 工具读取用户指定的 `tools/*.html` 文件，提取以下信息：

- `<title>` 标签内容
- `<meta name="description">` 内容
- `<meta name="keywords">` 内容
- `<meta name="date">` 内容（如果存在）
- 页面可见的按钮、控件、提示文本（用于推断功能）
- 页面结构和样式线索（分屏、弹窗、主题等）

### 2. 参考已有 release 文章

搜索 `posts/YYYY/` 下 `type: release` 且与工具相关的文章作为风格参考，例如：

```
posts/2026/2026-06-23-release-read-aloud.md
posts/2026/2026-06-23-release-minimalist-long-text-reader.md
```

优先读取最近 3 篇工具类 release 文章，观察：
- frontmatter 字段与顺序
- 标题风格
- 正文结构（简介 → 功能 → 使用方式 → 兼容性 → 技术栈）
- 是否包含对比表格、提示词、快捷方式等额外内容

### 3. 生成发布文档

根据提取的信息和参考文章风格，生成 Markdown 内容。

#### Frontmatter 要求

```yaml
---
type: release
title: "<中文标题>"
date: YYYY-MM-DD HH:MM:SS +0800
tags: [tool, <其他推断标签>]
linkUrl: https://wangjunjian.com/tools/<tool-slug>.html
---
```

说明：
- `title` 应为中文， announcing the tool，例如 `"Read Aloud：浏览器本地长文朗读器"`。
- `date` 使用当前日期时间，格式为 `YYYY-MM-DD HH:MM:SS +0800`。
- `tags` 必须包含 `tool`，其余根据工具特性推断，例如 `tts`、`reader`、`accessibility`、`browser` 等。
- `linkUrl` 固定为 `https://wangjunjian.com/tools/<tool-slug>.html`。

#### 正文要求

正文通常包含以下章节（可根据工具特性增删）：

1. **工具简介**：一句话说明工具是什么、解决什么问题。
2. **核心功能**：用无序列表列出 4–10 个主要功能。

语言要求：
- 全文使用中文。
- 保持与参考文章一致的语气和格式。
- 技术术语可保留英文，如 TTS、Web Speech API、HTML。

### 4. 写入前确认

在调用 Write 工具写入文件之前，必须向用户展示：

- 生成的文件路径
- 生成的 frontmatter
- 正文的简要摘要或完整内容

并明确询问：

```
是否将这篇发布文档写入 <文件路径>？
```

只有用户确认后，才执行 Write。

### 5. 写入文件

用户确认后，使用 Write 工具创建或覆盖文件。

### 6. 不处理 git 提交

本技能不执行 `git add`、`git commit` 或 `git push`。
如果用户要求提交，婉拒并说明：

```
发布文档已生成。如需提交，请单独使用 git 命令或告诉我帮你执行提交。
```

## 边界情况

- **HTML 文件不存在**：告知用户文件未找到，并请其确认路径。
- **HTML 缺少元数据**：基于页面可见文本和结构推断，不因此中断。
- **当天已存在同名 release 文件**：覆盖更新，但需告知用户这是覆盖操作。
- **用户未提供路径**：询问路径，不自行猜测。
- **工具不是纯前端或依赖特殊环境**：按实际情况描述，不夸大能力。

## 示例

**用户输入：**

```
为 tools/read-aloud.html 生成发布文档
```

**技能行为：**

1. 读取 `tools/read-aloud.html`。
2. 读取 `posts/2026/2026-06-23-release-minimalist-long-text-reader.md` 等参考文章。
3. 生成 `posts/2026/2026-06-23-release-read-aloud.md`。
4. 向用户展示 frontmatter 和正文摘要，询问是否写入。
5. 用户确认后写入文件。

## 项目约定

- 本项目为 Astro 博客，站点域名为 `wangjunjian.com`。
- HTML 工具页面遵循 `tools/*.html` 规范，要求中文界面和中文元数据。
- 发布文档统一放在 `posts/YYYY/`，文件名格式为 `YYYY-MM-DD-release-<slug>.md`。
- 内容类型使用 `type: release`。
