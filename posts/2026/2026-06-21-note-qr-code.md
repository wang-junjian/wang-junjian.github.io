---
type: note
date: 2026-06-21 13:30:00 +0800
tags: [qr-code, javascript, jsqr, textdecoder, utf-8, encoding, frontend, browser, note]
---

# 调试二维码识别与生成工具的几点经验

下午折腾了两个纯前端二维码工具：一个识别器、一个生成器。记录下调试过程中踩过的几个坑，免得以后重复踩。

## 1. 中文二维码识别出来是空的

用的是 [jsQR](https://github.com/cozmo/jsQR)。识别英文二维码没问题，但中文二维码识别结果直接为空。

查了下，jsQR 返回的对象里有两个字段：

- `code.data`：legacy 字符串，对多字节字符支持不好
- `code.binaryData`：原始字节数组

正确做法是用 `binaryData` 配合 `TextDecoder` 按 UTF-8 解码：

```javascript
function decodeQRData(code) {
  if (code.binaryData && code.binaryData.length) {
    const bytes = new Uint8Array(code.binaryData);
    return new TextDecoder('utf-8').decode(bytes);
  }
  return code.data || '';
}
```

图片识别和摄像头扫码两处都要走这个解码逻辑。

## 2. 中文二维码生成后扫描乱码

生成器中 `qr.addData(value)` 对中文支持不行，需要先做一次 UTF-16 到 UTF-8 的字节转换：

```javascript
function utf16to8(str) {
  let out = "";
  for (let i = 0; i < str.length; i++) {
    const c = str.charCodeAt(i);
    if (c >= 0x0001 && c <= 0x007F) {
      out += str.charAt(i);
    } else if (c > 0x07FF) {
      out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
      out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
      out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
    } else {
      out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
      out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
    }
  }
  return out;
}

qr.addData(utf16to8(value));
```

这样才能保证扫描出来的中文不乱码。

## 3. 换行符在页面上显示不出来

识别结果里有换行，但页面展示时全被折叠成空格。原因是 HTML 默认会把空白字符折叠。

给结果容器加 `white-space: pre-wrap;` 解决：

```css
#result,
.qr-url {
  white-space: pre-wrap;
  word-break: break-word;
}
```

## 4. 多行文本居中显示很怪

生成器把结果文本区域设了 `text-align: center`，多行代码类文本看起来每行都居中，很不自然。改成 `text-align: left` 才像原样展示。

## 5. 输入框太小，长文本体验差

一开始用 `input[type="text"]`，只能单行。后面改成 `textarea`，设置 `min-height: 140px` 和 `resize: vertical`，长文本和代码片段舒服很多。

提交键也做了适配：普通 Enter 换行，`Ctrl/⌘ + Enter` 生成二维码。

## 6. 左右布局要注意移动端

生成器把结果从下方移到右侧，桌面端用 flex 左右两栏：

```css
.workspace {
  display: flex;
  gap: 24px;
  align-items: flex-start;
}
```

移动端通过 media query 恢复成上下堆叠：

```css
@media (max-width: 768px) {
  .workspace { flex-direction: column; }
}
```

## 小结

- 中文处理要关注编码：识别用 `TextDecoder`，生成用 `utf16to8` 转 UTF-8 字节。
- 页面展示换行要用 `white-space: pre-wrap`。
- 代码/长文本用 `textarea`，并考虑键盘交互。
- 结果文本左对齐更符合原样展示的预期。
- 工具类页面布局要兼顾桌面和移动端。
