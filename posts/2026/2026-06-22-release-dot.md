---
type: release
title: "DOT 文件渲染器：在线 Graphviz 图形预览工具"
date: 2026-06-22 22:45:00 +0800
tags: [tool, dot, graphviz, graph, diagram, visualization, viz-js, svg]
linkUrl: https://wangjunjian.com/tools/dot.html
---

## DOT 文件渲染器是什么

DOT 文件渲染器是一款纯前端的在线 Graphviz 图形预览工具。只需在浏览器中粘贴 DOT 语言描述的图结构代码，即可实时渲染为有向图或无向图 SVG，支持通过 URL 片段直接分享图形代码，无需安装任何本地软件。

---

## 核心功能

- **实时渲染**：输入 DOT 代码后自动防抖渲染，500ms 内即时出图。
- **URL 分享**：图形代码自动编码到 URL 片段中，复制链接即可分享完整图形。
- **加载示例**：内置完整流程图示例，一键体验渲染效果。
- **错误提示**：DOT 语法错误时，在输出区显示详细错误信息。
- **纯浏览器运行**：基于 Viz.js 在浏览器端完成全部渲染，无后端、无上传。

---

## 使用方式

1. 打开 [DOT 文件渲染器](https://wangjunjian.com/tools/dot.html)。
2. 在输入区粘贴您的 `.dot` 文件内容。
3. 图形会自动渲染到下方的输出区。
4. 复制当前浏览器地址栏中的 URL 即可分享图形。

---

## 支持的图类型

- 有向图（`digraph`）
- 无向图（`graph`）
- 节点样式、边标签、布局方向（`rankdir`）等 Graphviz 标准属性

---

## 技术栈

- HTML + CSS + JavaScript
- [Viz.js](https://github.com/viz-js/viz)（WebAssembly 版 Graphviz）
- 无后端、无依赖、纯静态页面

---

## 提示词

```
我要设计一个WEB应用（HTML），在线渲染DOT文件。有什么好的思路？先分析需求，进行设计，再实现（一个html），存储到 @tools/ 目录。
```
