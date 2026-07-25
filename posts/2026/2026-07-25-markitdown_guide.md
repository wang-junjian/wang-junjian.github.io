---
type: article
title: "MarkItDown 使用指南（实战版）"
date: 2026-07-25 14:49:00 +0800
tags: [markitdown, markdown, pdf, excel, word, html, zip, image, audio, youtube]
---

> 基于本地实测（markitdown v0.1.6 · Python 3.13）编写，输出均为真实命令捕获，非示意。
> 项目：https://github.com/microsoft/markitdown ｜ 许可证：MIT（可商用）｜ 维护：Microsoft AutoGen 团队
>
> **验证进度**：9 种格式中，Excel / Word / HTML / ZIP / **Image(EXIF)** / **Audio(容器元数据)** 已在本地用真实文件跑通；PPT / PDF 表现与直觉有出入（已标注）；YouTube 因本环境代理重置其 TLS 而未在本机跑通，命令与用法见第 5 节，可在能直连 YouTube 的机器上验证。

---

## 1. 它到底是什么

**一句话**：把任意文件（PDF / Office / 图片 / 音频 / 网页 / 压缩包…）转换成**对 LLM 友好的 Markdown** 的轻量 Python 工具。

**本质定位**：AI 应用链路里「模型前面的数据入口」——在喂给 RAG / 知识库 / 检索之前，先把杂乱格式洗干净。
**设计哲学**：*不追求高保真排版还原*，只保留对机器有用的**结构**（标题、列表、表格、链接），输出给文本分析工具消费。

> ⚠️ 它不是排版转换工具。如果你要的是「合同归档 / 视觉一致的 PDF 重排」，它不合适。

---

## 2. 30 秒上手

```bash
pip install 'markitdown[all]'     # 装全部格式支持
markitdown report.pdf > report.md # 一行转完
```

就这三步，你已经能转大多数文件了。下面讲清楚细节与「实测后才知道的坑」。

---

## 3. 安装

### 基础 / 全量 / 按需

```bash
pip install markitdown                 # 核心（仅基础文本格式）
pip install 'markitdown[all]'           # 全部可选格式（推荐起步）
pip install 'markitdown[pdf,docx,pptx]' # 只装你需要的，更轻
```

可用 extras（按需启用）：

| extra | 能力 |
|-------|------|
| `[pdf]` | PDF 文本/表格抽取 |
| `[docx]` / `[pptx]` / `[xlsx]` / `[xls]` | Word / PPT / Excel |
| `[outlook]` | Outlook `.msg` 邮件 |
| `[az-doc-intel]` | Azure Document Intelligence（提升扫描件识别） |
| `[az-content-understanding]` | Azure Content Understanding（结构化字段） |
| `[audio-transcription]` | 音频转写（whisper，较重） |
| `[youtube-transcription]` | YouTube 字幕 |

**环境要求**：Python ≥ 3.10，建议用 venv / uv 隔离。

### ⚠️ 一个 README 没强调、但实测很关键的系统依赖

图片和音频的 **EXIF 元数据抽取依赖外部二进制 `exiftool`**（它不是 pip 包！）：

```bash
brew install exiftool                 # macOS
# apt install libimage-exiftool-perl  # Linux
```

> 没装 `exiftool` 时，`markitdown xxx.jpg` / `markitdown xxx.wav` 会**直接输出空内容**——这不是 bug，是设计如此（见第 5 节源码级说明）。

---

## 4. 三种用法

### CLI（最常用）

```bash
markitdown report.pdf > report.md     # 文件 → Markdown 文件
markitdown slides.pptx -o out.md      # 指定输出
cat data.xlsx | markitdown            # 管道输入
```

### Python API

```python
from markitdown import MarkItDown

md = MarkItDown(enable_plugins=False)   # True 才启用插件
result = md.convert("test.xlsx")
print(result.text_content)
```

### Docker（适合 CI/CD 批量处理）

```bash
docker build -t markitdown:latest .
docker run --rm -i markitdown:latest < ~/your-file.pdf > output.md
```

---

## 5. 各格式真实表现（实测）

下面每个示例都是本地真实构造文件 + 真实 `markitdown` 命令的输出。

### ✅ Excel → Markdown 表格（开箱即用）

输入 `sales.xlsx`（sheet 名 `sales`），输出：

```markdown
## sales
| Product | Q1 | Q2 | Q3 |
| --- | --- | --- | --- |
| Laptop | 120 | 135 | 142 |
| Monitor | 89 | 94 | 101 |
| Keyboard | 230 | 245 | 268 |
```

> 表头/分隔行准确。**注意**：工作表名被映射为 `##`（二级标题），不是 `#`。

### ✅ Word → 结构完整保留

输入 `report.docx`（标题 + 加粗 + 超链接 + 项目符号），输出：

```markdown
# Quarterly Report

## Executive Summary

Our **revenue** grew by 18% this quarter. See the full **dashboard**[dashboard](https://example.com)

* Expanded to 3 new regions
* Shipped the v2.0 platform
* Reduced churn by 4%
```

> 标题/加粗/列表都保留，URL 正确。**坑**：链接会被渲染成「加粗文本 + 超链接」双份（`**dashboard**[dashboard](...)`），不是单独一个链接。

### ⚠️ PowerPoint → 标题保留，正文不转列表

输入 `roadmap.pptx`，输出：

```markdown
<!-- Slide number: 1 -->
# Product Roadmap
Q3: Launch mobile app
Q4: Enterprise SSO
2027: AI assistant
```

> **重要坑**：正文占位符里的内容**不会**被转成 Markdown 列表（`- `），而是逐行纯文本；并多一行 `<!-- Slide number: 1 -->` 注释。标题 `#` 正确。

### ⚠️ PDF → 只抽纯文本，不输出标题层级

输入 `whitepaper.pdf`（"Introduction" 标题 + 2 段），输出：

```markdown
Introduction
Retrieval-Augmented Generation combines a retriever with a generator to ground model outputs in
external knowledge.

This paper evaluates three retrieval strategies on the MS-MARCO benchmark.
```

> **重要坑**：PDF 转换器（pdfminer/pdfplumber）**只抽文本，不推断标题层级**——"Introduction" 是普通文本，没有 `#`。正文段落完整。符合其定位，但与「保留标题」的直觉不同。

### ✅ HTML → 结构准确

输入 `page.html`，输出：

```markdown
# Welcome

Read our [docs](/docs).

* Fast
* Free
```

> 准确。无序列表用 `*` 而非 `-`。

### ✅ ZIP → 自动遍历并内联各文件

输入 `archive.zip`（内含 docx/xlsx/pptx），输出会依次展开每个文件的完整转换（比想象中更完整）：

```markdown
Content from the zip file `.../archive.zip`:

## File: report.docx
# Quarterly Report
...（完整 Word 转换）

## File: roadmap.pptx
<!-- Slide number: 1 -->
# Product Roadmap
...（完整 PPT 转换）

## File: sales.xlsx
## sales
| Product | Q1 | Q2 | Q3 |
...（完整 Excel 转换）
```

### ✅ Image → EXIF 元数据（装 exiftool 后真实可用）

装好 `exiftool` 后，对一张带 EXIF/GPS 的 `offsite.jpg` 真实输出（字段由 exiftool 提取，白名单过滤）：

```markdown
ImageSize: 320x200
DateTimeOriginal: 2026:05:12 10:00:00
GPSPosition: 35 deg 0' 41.00" N, 135 deg 0' 46.00" E
```

> **已实测**：上述三行是 `markitdown offsite.jpg` 的真实 stdout。EXIF 真的能出来（本例 GPS 指向京都）。
> ⚠️ 两件事要注意：
> 1. **没装 `exiftool` → 空输出**（设计如此，见第 3 节）。
> 2. **OCR 文字 / LLM 图像描述不会出现在这里**——那需要额外 `markitdown-ocr` 插件 + OpenAI 兼容客户端，且会在输出里追加 `# Description:` 段落。仅 EXIF 元数据不需要任何模型。

### ✅ Audio → 容器元数据（装 exiftool 后真实可用）

装好 `exiftool` 后，对 `meeting.wav` 真实输出（WAV 头部信息）：

```markdown
NumChannels: 1
SampleRate: 16000
AvgBytesPerSec: 32000
BitsPerSample: 16
```

> **已实测**：上述四行是 `markitdown meeting.wav` 的真实 stdout——exiftool 把容器层元数据抽出来了。
> ⚠️ **真正的「语音转写」不在这里**：转写需要 `pip install 'markitdown[audio-transcription]'` + 本地/远程 whisper 模型，输出才会追加 `# Audio Transcript:` 段落。容器元数据本身不需要模型。

### 🔶 YouTube → 需联网（本环境代理拦截，命令本身正确）

```bash
pip install 'markitdown[youtube-transcription]'   # 拉字幕需要这个 extra
markitdown "https://www.youtube.com/watch?v=xxxx"
```

> 转换器走 `youtube_transcript_api` 拉字幕，**需要出站网络**，输出是按字幕语言分组的纯文本。
>
> **本环境实测结果（重要）**：在写这份文档的沙箱里，代理（127.0.0.1:1087）对 **YouTube 的 TLS 做了专项重置**——`CONNECT` 隧道能建立（google.com 正常），但到 `www.youtube.com:443` 的握手被上游 `SSL_ERROR_SYSCALL / UNEXPECTED_EOF` 断开，连 `curl -k` 也拿不到内容，markitdown 因此报 `502 Bad Gateway`。
> **这不代表命令错**：在你本机（浏览器能上 YouTube）直接运行上方命令即可拿到字幕。若你也走代理，请确保代理放行 YouTube 的 TLS，或把 YouTube 加入 `NO_PROXY`。

---

## 6. 实测经验总结（避坑清单）

| 现象 | 原因 / 对策 |
|------|------------|
| `markitdown xxx.jpg` 输出为空 | 没装外部 `exiftool` 二进制 → `brew install exiftool`（装好后输出真实 EXIF） |
| `markitdown xxx.wav` 输出为空 | 同上（缺 exiftool）；转写还需 `audio-transcription` extra + whisper |
| 图片/音频 EXIF 出来了，但没 OCR/转写 | 那部分要 `markitdown-ocr`（图）或 `audio-transcription`（声）+ 模型，EXIF 本身无需模型 |
| PDF 的标题没变成 `#` | 设计如此，PDF 只抽纯文本，不推断层级 |
| PPT 正文没变成列表 | 设计如此，正文逐行纯文本 + slide 注释 |
| Word 里链接出现两次 | markitdown 把「加粗文字」和「超链接」分别渲染，属正常 |
| 表格标题是 `##` 不是 `#` | 工作表名映射为 H2 |
| YouTube 报 `502 Bad Gateway` / SSL 错误 | 多为代理拦截 YouTube TLS（google 却正常）→ 换能直连 YouTube 的网络，或将 youtube 加入 `NO_PROXY` |

---

## 7. 什么时候用 / 什么时候不用

**适合**：
- 给 RAG / 知识库批量清洗历史文档（Word/PDF/PPT/Excel）
- 把网页、CSV/JSON、压缩包统一转成模型可消费的文本
- 配合 `markitdown-mcp` 接入 Claude Desktop 等 LLM 应用

**不适合**：
- 高保真排版还原 / 合同归档（它不是排版工具）
- 离线环境做图片 OCR / 音频转写 / YouTube 字幕（需外部模型或联网；但 EXIF 元数据只需 `exiftool`，可离线）

---

## 8. 一页速查

```bash
# 安装
pip install 'markitdown[all]' && brew install exiftool

# 转文件
markitdown in.pdf > out.md

# 转压缩包（自动遍历）
markitdown archive.zip > out.md

# Python
from markitdown import MarkItDown
print(MarkItDown().convert("in.xlsx").text_content)
```

> 记住三句话：**装 `[all]` + `exiftool`**；**PDF/PPT 只给纯文本结构**；**图片/音频/YouTube 的「智能」部分要额外依赖**。
