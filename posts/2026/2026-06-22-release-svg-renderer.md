---
type: release
title: "SVG 渲染器：在线 SVG 实时预览工具"
date: 2026-06-22 23:24:00 +0800
tags: [tool, svg, renderer, preview, browser, graphics]
linkUrl: https://wangjunjian.com/tools/svg-renderer.html
---

## SVG 渲染器是什么

SVG 渲染器是一款纯前端的在线 SVG 预览工具。它支持粘贴 SVG 代码或从 URL 加载 SVG 文件，右侧实时渲染预览，全部处理都在浏览器内完成，无需上传、无需后端。

---

## 核心功能

- **双模式输入**：支持直接粘贴 SVG 代码，或输入 URL 从网络加载 SVG 文件。
- **实时预览**：左侧编辑或粘贴代码，右侧即时渲染 SVG 图形，所见即所得。
- **安全沙箱渲染**：使用 DOMPurify 对 SVG 进行安全过滤，并在沙箱 iframe 中渲染，防范 XSS 和恶意脚本。
- **智能宽高比**：自动解析 SVG 的 `viewBox` 或 `width`/`height` 属性，保持正确的图形比例。
- **URL 分享**：通过 URL hash 加载的 SVG 地址可直接分享，他人打开即可查看同一图形。
- **响应式布局**：桌面端左右分屏，移动端自动切换为上下堆叠，适配各种设备。
- **内置示例**：首次打开自动加载示例 SVG，快速体验渲染效果。

---

## 使用方式

1. 打开 [SVG 渲染器](https://wangjunjian.com/tools/svg-renderer.html)。
2. 点击 **粘贴** 标签，将 SVG 代码粘贴到左侧编辑区。
3. 或点击 **URL** 标签，输入 SVG 文件地址后点击 **加载**。
4. 右侧预览区即时显示渲染结果。

---

## 浏览器兼容性

SVG 渲染器为纯静态 HTML 页面，兼容所有现代浏览器。建议使用 Chrome、Edge、Safari 或 Firefox 最新版本。

---

## 技术栈

- HTML + CSS + JavaScript
- DOMPurify（SVG 安全过滤）
- 无后端、无依赖、纯静态页面
