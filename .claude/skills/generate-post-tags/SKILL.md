---
name: generate-post-tags
description: |
  为 Astro 博客项目中 `posts/YYYY/*.md` 下的 Markdown 文章生成或优化 `tags:` 前置元数据。
  当用户说“提取标签”“生成 tags”“优化 tags”“为这篇文章写 tags”或类似意思时，使用此技能。
  技能会阅读文档内容，分析核心主题、技术栈和关键概念，生成一组简洁、准确的标签，英文全部小写，中文保持原样，并在写入前征求用户确认。
---

# generate-post-tags

为项目 `posts/YYYY/*.md` 下的 Markdown 文章生成或优化 `tags:` 字段。

## 适用场景

- 用户为一篇新文章需要生成合适的 `tags:`。
- 用户觉得现有 tags 不够准确，想要优化。
- 用户说“为这篇文章提取标签”“生成 tags”“优化 tags”“帮我写 tags”等。

## 输入

用户应提供一个或多个 `posts/YYYY/*.md` 文件的相对路径，例如：

```
posts/2026/2026-06-24-browser-tts-experience.md
posts/2026/2026-06-10-audio2sub.md
```

如果用户没有提供路径，询问用户要处理的 Markdown 文件路径。

## 输出

针对每篇文章输出：

1. 文档核心内容分析
2. 原有 `tags:` 值（如果存在）
3. 建议的最终 `tags:` 值
4. 变更说明
5. 询问用户是否写入文件

## 执行步骤

### 1. 读取 Markdown 文件

使用 Read 工具读取用户指定的 Markdown 文件，重点分析：

- `title:` 标题
- `categories:` 分类
- 原有 `tags:` 值（作为参考）
- 正文各级标题
- 正文核心段落和关键词
- 代码片段中涉及的技术、工具、API、库
- 提到的格式、平台、语言、框架

### 2. 提取核心要素

从文档中识别以下要素：

- **工具/项目名**：如 `audio2sub`、`read-aloud`
- **核心功能/概念**：如 `音频转字幕`、`语音合成`、`文本转语音`
- **技术领域**：如 `语音识别`、`前端开发`、`容器化部署`
- **关键工具/库/API**：如 `openai-whisper`、`web-speech-api`、`ffmpeg`、`pytorch`
- **实现语言/平台**：如 `python`、`javascript`、`browser`
- **输出格式**（如果相关）：如 `vtt`、`srt`

### 3. 生成标签

按以下原则生成标签列表：

- 数量控制在 **5–10 个**。
- **所有英文字母必须小写**（如 `OpenAI Whisper` → `openai-whisper`，`VTT` → `vtt`）。
- 中文标签保持原样（如 `音频转字幕`、`语音识别`）。
- 优先保留工具名、核心功能、关键技术和技术领域。
- 避免过于细碎或仅在文中一句话带过的词汇。
- 使用连字符连接多英文词（如 `web-speech-api`、`speech-recognition`）。

### 4. 与原有 tags 对比

- 如果文件已有 tags，列出原有值。
- 说明保留、新增、删除、修改（小写化）的标签。
- 解释为什么这样调整。

### 5. 输出建议并征求确认

以清晰格式输出：

```markdown
## 文档核心内容分析
...

## 原有 tags
```yaml
tags: [...]
```

## 最终建议值
```yaml
tags: [...]
```

## 变更说明
- 保留：...
- 新增：...
- 删除：...
- 小写化：...
```

然后询问用户：是否将建议的 tags 写入文件？

### 6. 写入文件（用户确认后）

- 仅修改 frontmatter 中的 `tags:` 行。
- 不要改动正文、标题、categories 等其他字段。
- 保持文件原有换行和编码。

## 示例

### 示例 1：技术工具类文章

**文档**：`posts/2026/2026-06-10-audio2sub.md`

原有 tags：
```yaml
tags: [audio2sub, OpenAI Whisper, 音频转字幕, VTT, SRT, Python, ffmpeg]
```

最终建议值：
```yaml
tags: [audio2sub, 音频转字幕, openai-whisper, speech-recognition, python, ffmpeg, vtt, srt]
```

变更说明：
- `OpenAI Whisper` → `openai-whisper`：英文小写化。
- `VTT` → `vtt`、`SRT` → `srt`：英文小写化。
- `Python` → `python`：英文小写化。
- 新增 `speech-recognition`：更准确地描述 Whisper 所属技术领域。

### 示例 2：前端经验类文章

**文档**：`posts/2026/2026-06-24-browser-tts-experience.md`

原有 tags：
```yaml
tags: [tts, web-speech-api, browser, javascript, speech-synthesis]
```

最终建议值：
```yaml
tags: [tts, text-to-speech, web-speech-api, speech-synthesis, browser, frontend, javascript]
```

变更说明：
- 新增 `text-to-speech`：TTS 的全称，更标准。
- 新增 `frontend`：文章属于前端开发领域。
- 其余标签保留并小写化。

## 注意事项

- 不要为没有阅读过的文档凭空生成标签。
- 如果文档内容跨多个技术领域，优先选择最能代表文章主题的标签。
- 标签不是越多越好，避免把文中所有提及的技术都列为标签。
- 写入前必须征求用户确认，不要直接修改文件。
