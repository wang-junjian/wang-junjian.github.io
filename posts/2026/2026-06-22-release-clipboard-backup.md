---
type: release
title: "剪贴板备份：浏览器本地剪贴板历史管理工具"
date: 2026-06-22 23:35:00 +0800
tags: [tool, clipboard, backup, browser, indexeddb, local-storage]
linkUrl: https://wangjunjian.com/tools/clipboard-backup.html
---

## 剪贴板备份是什么

剪贴板备份是一款纯前端、无需后端的浏览器剪贴板历史管理工具。它支持保存文本、HTML、RTF、图片等多种剪贴板格式，利用浏览器 IndexedDB 本地持久化存储，随时恢复或下载历史内容。

---

## 核心功能

- **多格式剪贴板捕获**：支持保存文本、HTML、RTF、URL 列表、PNG / JPEG / GIF / WebP 图片等多种剪贴板格式。
- **本地持久化存储**：所有备份数据通过 IndexedDB 存储在浏览器本地，刷新页面或关闭浏览器后数据不丢失。
- **多格式预览**：支持按格式切换预览，文本、HTML、图片分别渲染，HTML 内容经 DOMPurify 安全过滤。
- **一键恢复复制**：点击复制按钮即可将备份内容还原到系统剪贴板，图片自动转换为 PNG 格式以兼容 Clipboard API。
- **逐格式下载**：每个备份的每种格式均可单独下载为对应文件（txt、html、rtf、png 等）。
- **相对时间显示**：备份时间以"刚刚""5 分钟前""2 小时前"等相对时间展示，直观易读。
- **全页粘贴支持**：不仅可以在粘贴区域粘贴，在页面任意位置按 Ctrl+V 均可触发备份。
- **批量清空**：支持一键删除所有备份，操作前需确认，防止误删。

---

## 使用方式

1. 打开 [剪贴板备份](https://wangjunjian.com/tools/clipboard-backup.html)。
2. 点击页面粘贴区域并按 `Ctrl + V` 粘贴内容，或在页面任意位置直接粘贴。
3. 备份自动保存并显示在列表中，可预览、复制或下载。
4. 点击 **清空全部** 可删除所有历史备份。

---

## 浏览器兼容性

剪贴板备份依赖 Clipboard API 和 IndexedDB，建议使用 Chrome、Edge、Safari 等现代浏览器。部分格式（如 RTF）受浏览器剪贴板支持程度限制，可复制但可能无法完整还原。

---

## 技术栈

- HTML + CSS + JavaScript
- IndexedDB（本地数据持久化）
- Clipboard API（剪贴板读写）
- DOMPurify（HTML 内容安全过滤）
- 无后端、无依赖、纯静态页面
