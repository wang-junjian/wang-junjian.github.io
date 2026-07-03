---
type: link
title: "GraphvizOnline - 浏览器端的 DOT 语言即时图可视化工具"
date: 2026-07-04 03:02:00 +0800
tags: [browser, diagram, dot-language, graphviz, open-source, tool, visualization, viz-js]
linkUrl: https://dreampuf.github.io/GraphvizOnline/
---

**GraphvizOnline** 是一个纯客户端的在线 Graphviz 编辑器与查看器，让你在浏览器中直接编写 DOT 代码并即时渲染图表，无需安装任何软件或服务器端处理。

![](/images/2026/apps/graphviz-online.webp)

其核心定位可以概括为以下几个方面：

### 1. 产品核心能力

- **实时编辑与渲染**：左侧编写 DOT 代码，右侧即时预览渲染结果，即写即所得。
- **多格式导出**：支持导出为 **SVG**（矢量）、**PNG**（位图）和**纯文本 DOT**。
- **语法错误提示**：DOT 代码有误时显示编译错误信息，而非白屏崩溃。
- **URL 分享**：DOT 源码可编码进 URL 直接分享给他人。
- **Gist 加载**：通过 `?url=` 参数从 GitHub Gist 或其他公开 URL 加载图定义。
- **演示模式**：`?presentation=` 参数支持 `editable`、`hide-options`、`show-engine`、`show-format`、`show-raw`、`show-download`、`show-share` 等多种展示模式，可无缝嵌入技术文档或 PPT 链接。
- **暗色主题**：内置深色模式。
- **SVG 平移缩放**：渲染结果支持鼠标拖拽与滚轮缩放，也集成 Hammer.js 支持移动端触控操作。
- **零数据外传**：所有渲染都在浏览器本地完成，源代码不会发送到任何外部服务器。

### 2. 技术栈与开源信息

- 图渲染引擎基于 **Viz.js**，将 Graphviz C 代码通过 Emscripten 编译为 JavaScript，在浏览器内完成 DOT 解析与布局。
- SVG 渲染与过渡动画由 **d3-graphviz** 提供（基于 D3.js），交互体验更加平滑。
- 代码编辑器使用 **Ace-editor**，提供 DOT 语法高亮、行号、代码折叠等 IDE 级编辑体验。
- 整体为纯前端项目：**JavaScript 88.3%** / CSS 8.6% / HTML 3.1%，无任何后端服务。
- 采用 **BSD-3-Clause 许可证**，完全免费开源，可自由修改与商用。
- 在 GitHub 上已获得 **986 Stars** 和 **248 Forks**，共 57 次提交。

### 3. 生态集成

GraphvizOnline 不只是孤立的在线编辑器，它与开发者的日常工具链形成了良好的衔接：

- **GitHub Gist**：`.gv` 文件托管到 Gist 后，可通过 `?url=` 参数直接在 GraphvizOnline 中打开，实现图表定义的版本化管理与一键加载。
- **演示模式嵌入**：通过 `?presentation=hide-options,show-download` 等参数，可以隐藏编辑器面板、仅保留图表预览与下载按钮，适合嵌入到技术博客、Wiki、PPT 分享链接中。
- **Ace-editor 语法高亮**：DOT 语言的关键词、属性、注释均有着色，降低编写门槛。
- **导出兼容主流工具链**：SVG 兼容 Illustrator / Figma / 浏览器；PNG 兼容 Word / PPT / Slack 等任何支持图片的场景。

### 4. 适用场景

- 快速绘制**流程图、架构图、状态机、ER 图、依赖关系图**等各类 DOT 图表。
- 工程师写技术文档、做架构评审时需要**即写即渲染**的轻量可视化工具。
- 教学或学习 **Graphviz DOT 语言**——所见即所得的编辑器是新手友好的入门方式。
- 通过 URL 分享图表给同事或社区，对方打开链接即可看到完整渲染结果。

如果你常用 DOT 语言画图，或需要一个无需安装、打开浏览器就能工作的 Graphviz 在线渲染器，**GraphvizOnline** 是一个值得收藏的工具。在线版可直接访问 [dreampuf.github.io/GraphvizOnline](https://dreampuf.github.io/GraphvizOnline/)。
