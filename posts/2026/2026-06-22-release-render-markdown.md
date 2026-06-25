---
type: release
title: "Markdown 渲染器：在线 Markdown 转 HTML 工具"
date: 2026-06-22 22:45:00 +0800
tags: [tool, markdown, 在线工具, github-flavored-markdown, github-api, html, converter, localstorage]
linkUrl: https://wangjunjian.com/tools/render-markdown.html
---

## Markdown 渲染器是什么

Markdown 渲染器是一款纯前端的在线 Markdown 转 HTML 工具。它调用 GitHub Markdown API 进行渲染，支持 GitHub Flavored Markdown (GFM) 标准，输出干净的 HTML 代码和实时预览，无需安装任何软件，打开浏览器即可使用。

---

## 核心功能

- **GitHub API 渲染**：调用 GitHub 官方 Markdown API，渲染结果与 GitHub 页面保持一致。
- **GFM 模式切换**：支持标准 Markdown 和 GitHub Flavored Markdown 两种模式，一键切换。
- **实时预览**：渲染后的结果即时显示在预览区，包括代码高亮、表格、引用块等样式。
- **自动清理 HTML**：可选清理隐藏元素（aria-hidden、nofollow 等），整理 heading 结构，输出更干净的 HTML。
- **自动生成目录**：根据文章中的 h2-h6 标题自动提取并生成可点击的目录导航。
- **复制 HTML**：一键复制清理后的 HTML 源码，方便粘贴到博客或编辑器中。
- **复制富文本**：一键复制带格式的富文本，可直接粘贴到 Word、Notion、邮件等支持富文本的地方。
- **自动保存**：输入内容自动保存到浏览器 localStorage，刷新页面不丢失。

---

## 使用方式

1. 打开 [Markdown 渲染器](https://wangjunjian.com/tools/render-markdown.html)。
2. 在编辑区粘贴需要渲染的 Markdown 文本。
3. 根据需要勾选"使用 GitHub Flavored Markdown (GFM)"。
4. 点击**渲染**按钮，预览区和 HTML 输出区会同步更新。
5. 点击**复制 HTML**或**复制富文本**获取渲染结果。

---

## 浏览器兼容性

本工具依赖 GitHub API（需联网）和浏览器 Clipboard API，建议使用 Chrome、Edge、Safari、Firefox 等现代浏览器。

---

## 技术栈

- HTML + CSS + JavaScript
- GitHub Markdown API（`https://api.github.com/markdown`）
- localStorage（本地自动保存）
- 无后端、纯静态页面
