---
type: release
title: "免费在线翻译工具：无需注册的多源翻译与朗读"
date: 2026-06-25 22:36:00 +0800
tags: [tool, browser, localstorage, machine-translation, online-translator, speech-synthesis, translation, web-speech-api]
linkUrl: https://wangjunjian.com/tools/online-translator.html
---

## 免费在线翻译工具是什么

免费在线翻译工具是一款纯前端的浏览器翻译工具，支持 MyMemory、Lingva、LibreTranslate 三种翻译源，无需注册、无需 API Key 即可使用。它采用左右分屏设计，输入内容后会实时翻译，并支持基于 Web Speech API 的本地语音朗读。所有设置与偏好都保存在浏览器本地，文本不会上传至任何服务端。

---

## 核心功能

- **多翻译源可选**：支持 MyMemory（免费在线）、Lingva（免费代理）、LibreTranslate（自托管）三种后端，可在设置中一键切换。
- **实时翻译**：输入内容 600ms 防抖后自动发起翻译，切换语言或翻译源时也会即时更新译文。
- **语言标签页**：源语言支持「检测语言」，目标语言覆盖中文、英语、日语、德语、法语、西班牙语等常用语言。
- **一键互换语言**：点击中间互换按钮即可交换源语言与目标语言，并自动重新翻译。
- **语音朗读**：基于 Web Speech API，支持朗读原文与译文；中英文自动检测，英文优先使用 Ava / Samantha 等高质量语音。
- **朗读播放/停止切换**：朗读按钮可一键停止当前播放，再次点击则重新朗读。
- **长文本分句**：朗读时按句末标点自动切分，避免单条语音过长被浏览器截断。
- **复制译文**：点击复制按钮即可将翻译结果复制到剪贴板。
- **本地记忆偏好**：使用 localStorage 自动保存源语言、目标语言、翻译源及服务地址，下次打开无需重新设置。
- **响应式布局**：桌面端左右分屏，窗口自适应高度；移动端自动上下堆叠，小屏也能流畅使用。

---

## 使用方式

1. 打开 [免费在线翻译工具](https://wangjunjian.com/tools/online-translator.html)。
2. 在左侧输入框粘贴或输入要翻译的文本。
3. 顶部选择源语言和目标语言，译文会实时出现在右侧。
4. 点击底部 🔊 可朗读原文或译文，点击 📋 可复制译文。

---

## 浏览器兼容性

本工具依赖 fetch、Web Speech API 与 localStorage，建议使用 Safari、Chrome、Edge 等现代浏览器。部分浏览器的语音列表需要异步加载，若为空可稍等片刻再试。LibreTranslate 需要自行部署服务后方可使用。

---

## 技术栈

- HTML + CSS + JavaScript
- MyMemory / Lingva / LibreTranslate API
- Web Speech API（`SpeechSynthesisUtterance`）
- localStorage（本地偏好持久化）
- 无后端、无依赖、纯静态页面
