---
type: link
title: "MinerU - 高精度文档解析引擎，为 LLM / RAG / Agent 提供结构化数据"
date: 2026-06-27 09:09:57 +0800
tags: [mineru, opendatalab, document-parsing, pdf, rag, llm, ocr, vlm, open-source, python]
linkUrl: https://github.com/opendatalab/MinerU
---

**MinerU** 是 OpenDataLab 开源的一款高精度文档解析引擎，能把 PDF、DOCX、PPTX、XLSX、图片和网页转换成结构化的 Markdown 或 JSON，方便下游 LLM、RAG 和 Agent 工作流直接消费。

### What｜是什么

MinerU 的定位是“为 LLM 准备数据”的文档解析基础设施。它支持多种输入格式，输出则强调人类阅读顺序和语义结构：

- 输入：PDF、图片、DOCX、PPTX、XLSX、网页
- 输出：Markdown、JSON（按阅读顺序）、多模态 Markdown，以及可可视化的中间格式
- 核心能力：自动去除页眉页脚页码、识别多栏与复杂版式、提取表格/图片/公式、公式转 LaTeX、表格转 HTML、OCR 识别 109 种语言
- 提供 CLI、FastAPI、Gradio WebUI、Docker 和 `mineru-router` 等多种使用形态

### Why｜为什么值得关注

MinerU 诞生于 InternLM 预训练过程中的实际需求，最初是为了解决科技文献中的符号转换问题。相比直接购买商业文档解析服务，它的几个亮点很突出：

- **VLM + OCR 双引擎**：`pipeline` 后端快且省资源，`vlm-engine` / `hybrid-engine` 后端精度更高，可按场景选择
- **全格式原生解析**：3.0 以后陆续加入 DOCX、PPTX、XLSX 原生解析，避免先转 PDF 再解析带来的信息损失
- **许可更友好**：从 AGPLv3 切换到基于 Apache 2.0 的 MinerU Open Source License，降低了商业部署门槛
- **数据说话**：`pipeline` 后端在 OmniDocBench v1.6 上整体得分 86.47，`hybrid` 后端可达 95.39（high 模式）

### Who｜谁在维护

项目由 **OpenDataLab**（上海人工智能实验室相关团队）维护，核心团队来自 InternLM 数据生产链路。GitHub 仓库活跃度高，更新频繁，社区通过 Discord、微信和 GitHub Issues 反馈问题。官方还提供了在线演示（mineru.net）和 Gradio Demo，方便用户先体验再部署。

### When｜时间线

- 2024 年：项目首次在 arXiv 发布论文《MinerU: An Open-source Solution for Precise Document Content Extraction》
- 2026/03：3.0.0 发布，新增 DOCX 原生解析、API/CLI/Router 编排升级、去掉 AGPL 模型依赖
- 2026/04：3.1.0 发布，许可升级、VLM 主模型升级、补齐 PPTX/XLSX 原生解析
- 2026/06：3.4 发布，OCR 模型升级到 PP-OCRv6，OCR 处理速度提升约 100%

### Where｜技术栈与生态

MinerU 主要基于 Python 构建，兼容 Windows、Linux 和 macOS，支持纯 CPU 或 GPU/MPS 加速：

- **后端选择**：`pipeline`（兼容好、可 CPU）、`vlm-engine`（高精度、需 GPU）、`hybrid-engine`（高精度 + 原生文本提取）
- **推理框架**：支持 vLLM、LMDeploy、mlx 等生态
- **芯片适配**：兼容 Ascend、Cambricon、Enflame、MetaX、Moore Threads、Kunlunxin 等 10 余家国产 AI 芯片
- **集成生态**：提供 MCP Server，可直接接入 Cursor / Claude Desktop / Windsurf；也原生支持 LangChain、LlamaIndex、RAGFlow、Dify、FastGPT、Flowise 等 RAG 框架

### How｜如何工作

MinerU 的解析流程可以简单理解为“版式分析 → 内容识别 → 结构化输出”：

1. 通过版面分析模型识别文档中的段落、标题、列表、表格、图片、公式等区域
2. 对扫描件、手写内容、乱码 PDF 自动启用 OCR；对清晰文本直接抽取
3. 按人类阅读顺序重新组织块级内容，并输出成 Markdown / JSON / HTML 等格式
4. `hybrid-engine` 还会引入 VLM 对复杂版面、跨页表格、图表等进行更高精度的理解

### How much｜成本与门槛

- **许可证**：MinerU Open Source License，基于 Apache 2.0，商业使用比原 AGPLv3 更友好
- **安装**：`uv pip install -U "mineru[all]"` 即可；也支持源码安装和 Docker
- **硬件门槛**：
  - `pipeline` 后端：最低 16GB 内存、20GB 磁盘，纯 CPU 可跑
  - `hybrid` / `vlm` 后端：最低 8GB 显存、16GB 内存
- **Python 版本**：3.10–3.13（Windows 因 ray 限制最高 3.12）

如果你正在为 RAG 知识库、Agent 工具链或大模型预训练准备文档数据，MinerU 是一个值得关注的开源解析方案。
