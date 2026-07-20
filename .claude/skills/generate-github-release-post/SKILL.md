---
name: generate-github-release-post
description: |
  根据用户提供的 GitHub 仓库 URL，自动生成 `type: release` 的发布文档。
  当用户输入一个 GitHub 仓库链接并说“生成 release 文档”“为这个项目写介绍”“生成 GitHub 发布文档”“把仓库整理成文章”或类似意思时，使用此技能。
  技能会抓取仓库 README 内容，提炼项目信息，生成符合项目风格的 Markdown 文件，并写入 `posts/YYYY/YYYY-MM-DD-release-<repo-name>.md`。
---

# generate-github-release-post

为项目 `posts/YYYY/*.md` 生成基于 GitHub 仓库的 `type: release` 发布文档。

## 适用场景

- 用户分享一个 GitHub 仓库 URL，希望将其整理成一篇 release 类型的博客文章。
- 用户说“为 https://github.com/xxx/yyy 生成 release 文档”“把这个仓库写成发布文章”“生成 GitHub 项目介绍”等。
- 需要基于外部开源项目快速产出中文摘要、标签和 frontmatter。

## 输入

用户应提供一个 GitHub 仓库 URL，例如：

```
https://github.com/wang-junjian/exam-helper
https://github.com/excalidraw/excalidraw
```

如果用户没有提供 URL，询问用户要处理的 GitHub 仓库地址。

## 输出

在 `posts/YYYY/` 下生成一篇 Markdown 文件（`YYYY` 为当前年份）：

```
posts/YYYY/YYYY-MM-DD-release-<repo-name>.md
```

其中：

- `YYYY-MM-DD` 为当前日期。
- `<repo-name>` 为 GitHub 仓库名（URL 中最后一个路径段，不含所有者）。
- 如果当天已存在同名文件，覆盖更新，但需告知用户。

## 执行步骤

### 1. 抓取 GitHub 仓库内容

使用 FetchURL 工具抓取用户提供的 GitHub 仓库页面内容。优先读取页面中的 README 文本，包括：

- 仓库名称与简介
- 项目描述 / 一句话定位
- 核心特性与功能列表
- 使用方法 / 快速开始
- 技术栈与项目结构
- 配置说明、数据格式或 API 文档
- 开源许可信息

如果 README 内容不足，可辅以 WebSearch 搜索补充信息。

如果 URL 无效或无法访问，告知用户失败原因，停止处理。

### 2. 参考已有 release 文章风格

搜索 `posts/YYYY/` 下 `type: release` 的文章作为风格参考，例如：

```
posts/2026/2026-07-20-release-exam-helper.md
posts/2026/2026-06-23-release-read-aloud.md
```

优先读取最近 3 篇 release 文章，观察：

- frontmatter 字段与顺序
- 标题风格
- 正文结构（简介 → 核心特性 → 快速开始 → 格式/结构说明 → 许可）
- 是否包含表格、代码块、提示语等

### 3. 生成发布文档

#### Frontmatter 要求

```yaml
---
type: release
title: "<中文标题>"
date: YYYY-MM-DD HH:MM:SS +0800
tags: [<小写英文标签列表>]
linkUrl: <用户提供的 GitHub 仓库 URL>
---
```

说明：

- `title` 应为中文，突出项目主题，例如 `"考试助手：单文件离线题库检索工具"`。
- `date` 使用当前日期时间，格式为 `YYYY-MM-DD HH:MM:SS +0800`。
  - 固定采用北京时间（东八区）。如果获取到的当前时间是 UTC，必须先加上 8 小时再写入，避免把 UTC 时间直接填成 `+0800`。
  - 例如：UTC 时间为 `2026-07-20 13:29:16`，则应写成 `date: 2026-07-20 21:29:16 +0800`。
- `linkUrl` 为用户提供的原始 GitHub 仓库 URL。
- `tags` 控制在 5–10 个，全部使用小写英文，多词标签用 `-` 连接。详见下方 tags 生成规则。

#### tags 生成规则

1. **推断标签**：根据仓库主题、功能、技术栈和核心概念，推断出一组候选标签。标签必须满足：
   - 全部小写英文字母
   - 多个单词用连字符 `-` 连接，例如 `question-bank-tool`、`single-file-app`、`open-source-release`
   - 不使用中文标签
   - 不使用空格、下划线或其他分隔符
2. **复用已有标签**：读取项目根目录的 `tags.txt`，在候选标签中优先使用已存在的标签。
3. **追加新标签**：如果某个候选标签在 `tags.txt` 中不存在，则将其追加到 `tags.txt` 文件末尾，**每个标签独占一行**。
4. **最终 frontmatter**：`tags` 字段按语义或字母顺序排列，例如：

   ```yaml
   tags: [exam-helper, html, javascript, open-source-release, question-bank-tool, single-file-app]
   ```

> 注意：不要重复添加 `tags.txt` 中已有的标签；追加新标签时不要在行尾添加多余标点或空行。

#### 正文要求

正文基于抓取的 README 内容组织，通常包含以下章节（可根据仓库内容增删，信息不足时可跳过）：

1. **项目简介**：用 1–2 句话概括项目是什么、解决什么问题。
2. **核心特性**：用无序列表列出 4–10 个主要功能或亮点。
3. **快速开始**：简要说明安装、构建或运行方式，可包含代码块。
4. **使用说明 / 数据格式**：如果项目有特定输入格式、配置或数据结构，用表格或列表说明。
5. **项目结构 / 技术栈**：简要说明关键文件、目录或依赖。
6. **开源许可**：说明许可证类型。

语言要求：

- 全文使用中文。
- 语气为简洁、信息密度适中的技术博客风格。
- 技术术语、项目名、API 名、文件名等保留英文。
- 博客文章应简洁可读，避免直接大段复制 README。

### 4. 写入前确认

在调用 Write 工具写入文件之前，必须向用户展示：

- 生成的文件路径
- 生成的 frontmatter
- 正文的简要摘要或完整内容

并明确询问：

```
是否将这篇 release 文档写入 <文件路径>？
```

只有用户确认后，才执行 Write。

### 5. 写入文件

用户确认后，使用 Write 工具创建或覆盖文件。

### 6. 不处理 git 提交

本技能不执行 `git add`、`git commit` 或 `git push`。
如果用户要求提交，婉拒并说明：

```
Release 文档已生成。如需提交，请单独使用 git 命令或告诉我帮你执行提交。
```

## 边界情况

- **URL 无效或无法访问**：告知用户失败原因，停止处理。
- **URL 不是 GitHub 仓库**：告知用户本技能仅支持 GitHub 仓库 URL，并请其提供正确链接。
- **README 内容极少**：基于已有信息生成简短文档，不因此中断。
- **当天已存在同名 release 文件**：覆盖更新，但需告知用户这是覆盖操作。
- **用户未提供 URL**：询问 URL，不自行猜测。

## 示例

**用户输入：**

```
https://github.com/wang-junjian/exam-helper
```

或

```
为 https://github.com/wang-junjian/exam-helper 生成 release 文档
```

**技能行为：**

1. 使用 FetchURL 抓取 GitHub 仓库页面，读取 README 内容。
2. 参考 `posts/2026/` 下已有的 release 文章风格。
3. 生成 `posts/2026/2026-07-20-release-exam-helper.md`，frontmatter 中 `tags` 为小写英文并用 `-` 连接。
4. 向用户展示 frontmatter 和正文摘要，询问是否写入。
5. 用户确认后写入文件。

## 项目约定

- 本项目为 Astro 博客，站点域名为 `wangjunjian.com`。
- Release 文档统一放在 `posts/YYYY/`，文件名格式为 `YYYY-MM-DD-release-<repo-name>.md`。
- 内容类型使用 `type: release`。
- 日期时区统一使用 `+0800`。
- 标签统一使用小写英文，多词用 `-` 连接。
