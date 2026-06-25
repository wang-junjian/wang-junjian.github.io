---
type: release
title: "Read Aloud：浏览器本地长文朗读器"
date: 2026-06-23 22:10:00 +0800
tags: [tool, tts, text-to-speech, read-aloud, web-speech-api, speech-synthesis, browser, local-tts]
linkUrl: https://wangjunjian.com/tools/read-aloud.html
---

## Read Aloud 是什么

Read Aloud 是一款纯前端、无需上传文本的浏览器朗读工具。它基于 Web Speech API 实现，全部文本处理与语音合成都在本地完成，适合朗读英文范文、中文小说、演讲稿、技术文档等长文本。

---

## 核心功能

- **本地朗读**：文本不离开浏览器，无上传、无服务端、保护隐私。
- **自动分句**：按段落和标点自动切分长文，避免单次文本过长被浏览器截断。
- **当前句高亮**：朗读时文本区切换为阅读视图，当前句子高亮并自动滚动到视野中央。
- **点击跳转播放**：在阅读视图中单击任意句子，即可从该句开始播放。
- **语速与音调调节**：支持 0.5x ~ 2.0x 语速调节，以及 0.5 ~ 2.0 的音调调节。
- **多语音选择**：自动根据语言选择系统语音，也支持手动切换。
- **中英文支持**：自动检测中英文比例，或手动指定中文 / 英文。
- **进度与时间显示**：实时显示当前句数、总句数和已用时间。

---

## 使用方式

1. 打开 [Read Aloud](https://wangjunjian.com/tools/read-aloud.html)。
2. 将需要朗读的文本粘贴到编辑区。
3. 点击 **▶ 朗读** 开始播放。
4. 需要暂停时点击 **⏸ 暂停**，或点击 **⏹ 停止** 结束朗读并恢复编辑。

---

## 快捷键

- 在编辑区内按 `Ctrl / ⌘ + Space`：播放 / 暂停。
- 焦点在编辑区外时，按 `Space`：快速播放 / 暂停。
- 按 `Esc`：关闭帮助窗口。

---

## 浏览器兼容性

Read Aloud 依赖 Web Speech API，建议使用 Safari、Chrome、Edge 等现代浏览器。若语音列表为空，可稍等片刻，部分浏览器需要异步加载语音包。

---

## 技术栈

- HTML + CSS + JavaScript
- Web Speech API（`SpeechSynthesisUtterance`）
- 无后端、无依赖、纯静态页面

---

## 提示词

```
我要设计一个WEB应用（HTML），利用浏览器的朗读能力进行阅读，英文和中文都可以。有什么好的思路？可以进行长文的朗读，如朗读英文范文、中文小说等。在 safari 中优先选择 Samantha (en-US)，在chrome 中优先选择 Ava（优化音质）(en-US)，先分析需求，进行设计，再实现（一个html），存储到 @tools/ 目录。
```