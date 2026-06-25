---
type: article
title: "浏览器原生语音合成（TTS）开发经验"
date: 2026-06-24 22:45:00 +0800
tags: [tts, text-to-speech, web-speech-api, speech-synthesis, browser, frontend, javascript]
---

最近先后在站点上线了两个纯前端的朗读工具：[Read Aloud](/tools/read-aloud.html) 和 [智能朗读阅读器](/tools/reading-companion.html)。两者都基于浏览器的 Web Speech API 实现，没有后端、没有上传、没有第三方语音服务。开发过程中踩了一些坑，也积累了一些可复用的经验，记录如下。

---

## 一、Web Speech API 基础

浏览器 TTS 的入口非常简洁：

```javascript
const synth = window.speechSynthesis;
const utterance = new SpeechSynthesisUtterance(text);
synth.speak(utterance);
```

`window.speechSynthesis` 负责全局的语音队列，`SpeechSynthesisUtterance` 则是每一次发音的单元。在真正可用之前，建议先做兼容性判断：

```javascript
if (!window.speechSynthesis) {
  alert('当前浏览器不支持 Web Speech API，无法使用朗读功能。');
  return;
}
```

目前 Safari、Chrome、Edge 等现代浏览器都支持该 API，但不同浏览器在语音质量、语音名、事件触发等方面差异明显，后面会详细说。

---

## 二、语音列表是异步加载的

第一次调用 `speechSynthesis.getVoices()` 时，返回的数组经常为空。这是因为浏览器需要异步加载系统语音包。正确做法是监听 `voiceschanged` 事件，并设置超时兜底：

```javascript
function loadVoices() {
  return new Promise((resolve) => {
    const voices = speechSynthesis.getVoices();
    if (voices && voices.length > 0) {
      resolve(voices);
      return;
    }
    const handler = () => {
      const all = speechSynthesis.getVoices();
      if (all.length > 0) {
        speechSynthesis.removeEventListener('voiceschanged', handler);
        resolve(all);
      }
    };
    speechSynthesis.addEventListener('voiceschanged', handler);
    setTimeout(() => {
      resolve(speechSynthesis.getVoices());
    }, 3000);
  });
}
```

这段逻辑来自 `tools/reading-companion.html:1209`。经验是：**页面初始化时绝不要假设语音列表已经就绪**，否则下拉框会显示为空，用户误以为浏览器不支持。

---

## 三、语音选择策略

不同系统、不同浏览器提供的语音名字千差万别。例如 macOS Safari 常见 `Samantha`，Chrome 常见 `Ava`，Windows 可能是 `Microsoft Zira`、`Microsoft Xiaoxiao` 等。因此需要多层回退策略：

1. 若用户手动选了某个语音，优先使用。
2. 按目标语言过滤：`v.lang.startsWith(lang)`。
3. 同语言下优先本地语音：`v.localService === true`。
4. 按浏览器偏好选择高质量默认语音。
5. 最后回退到 `voices.find(v => v.default)` 或列表第一个。

`tools/read-aloud.html:476` 中的实现大致如下：

```javascript
function pickVoice(lang) {
  if (lang.startsWith('en')) {
    const priority = isSafari ? ['Samantha']
                   : isChrome ? ['Ava']
                   : ['Samantha', 'Ava', 'Google US English'];
    const byName = getVoiceByName(priority);
    if (byName) return byName;
  }

  const langVoices = voices.filter(v => v.lang.toLowerCase().startsWith(lang.toLowerCase()));
  if (langVoices.length) {
    return langVoices.find(v => v.localService) || langVoices[0];
  }

  return voices.find(v => v.default) || voices[0] || null;
}
```

不要只依赖 `speechSynthesis.getVoices()[0]`，否则在不同环境下读出来的可能是意想不到的语言。

---

## 四、中英文自动检测

同一个页面里可能中英文混排，而中文语音读英文、英文语音读中文都会很别扭。可以在朗读前根据文本内容自动判断语言：

```javascript
function detectLang(text) {
  const chineseChars = (text.match(/[一-龥]/g) || []).length;
  const totalLetters = (text.replace(/\s/g, '').match(/[a-zA-Z]/g) || []).length;
  return chineseChars > totalLetters ? 'zh-CN' : 'en-US';
}
```

`read-aloud.html` 用的是简单 majority 比较；`reading-companion.html` 则按前 500 个字符中汉字占比是否超过 25% 来判断。阈值可以根据实际场景调整，核心思路是：**不要让用户为了混排文本反复切语言**。

---

## 五、长文本必须分句

浏览器对单条 `SpeechSynthesisUtterance` 的长度是有限制的，太长会被截断或卡住。因此必须按标点把长文本切成短句。两个工具用了略有不同的策略。

`read-aloud.html:408` 先按句末标点切，若句子仍超过 300 字符，再按逗号/分号二次切：

```javascript
function splitSentences(text) {
  const sentences = [];
  const parts = text.replace(/([。！？.?!]+)(?=[\s\S]|$)/g, '$1\n').split('\n');
  // ... 合并缓冲并按 300 字符上限二次切分
  return result.filter(Boolean);
}
```

`reading-companion.html:1301` 则用正则 `(?<=[。！？.!?…;；\n])\s*` 切分，并设置 800 字符的硬上限：

```javascript
function splitSentences(text) {
  const pattern = /(?<=[。！？.!?…;；\n])\s*/;
  let rawParts = text.split(pattern);
  // ... 缓冲合并，超过 800 字符强制切段
  return result.filter(s => s.replace(/\s/g, '').length > 0);
}
```

分句不仅是为了稳定，更是后续**高亮、跳转、循环、进度统计**的最小粒度。

---

## 六、状态管理是核心难点

TTS 播放涉及的状态比想象中多：

```javascript
let isPlaying = false;
let isPaused = false;
let currentIndex = 0;
let pausedElapsed = 0;
```

需要区分三种用户操作：
- 未播放 → 开始
- 播放中 → 暂停
- 已暂停 → 继续

`speechSynthesis.pause()` 和 `resume()` 在不同浏览器上行为不一致，Safari 尤其不可靠。更稳妥的做法是：不依赖底层 resume，而是在 `onend` 中手动推进 `currentIndex`，通过串行调用 `speakNext()` 实现连续朗读。暂停时只标记状态并 `cancel()`，继续时从当前索引重新 `speak()`。

---

## 七、高亮、进度与交互

把每句话渲染成可点击的 `<span>`，朗读时给当前句加 `active` 类，并自动滚到视野中央：

```javascript
const active = readerBoard.querySelector(
  `.chunk[data-pidx="${pIdx}"][data-sidx="${sIdx}"]`
);
if (active) {
  active.classList.add('active');
  active.scrollIntoView({ behavior: 'smooth', block: 'center' });
}
```

`reading-companion.html` 还额外做了已读句子淡化（`spoken` 类）、当前句脉冲高亮、底部整体进度条。这些视觉反馈对长文朗读体验影响很大。

另外，**点击任意句子即可跳转**是高频需求。实现方式是为每个 `<span>` 绑定点击事件，计算对应的 `currentIndex`，然后 `cancel()` 并重新 `speak()`。

---

## 八、稳定性与异常处理

浏览器 TTS 在以下场景容易出问题：

- 网络语音加载失败或超时
- 切换后台标签页后暂停
- 单句过长导致卡住
- 用户快速点击导致状态混乱

`reading-companion.html:1508` 中加了 watchdog 机制，单句超过 18 秒没有结束就强制推进：

```javascript
function resetWatchdog() {
  clearWatchdog();
  watchdogTimer = setTimeout(() => {
    if (!speechSynthesis.speaking && isPlaying && !isPaused) {
      markAsSpoken(currentSentenceIndex);
      currentSentenceIndex++;
      if (currentSentenceIndex >= sentences.length) {
        finishReading();
        return;
      }
      highlightSentence(currentSentenceIndex);
      speechSynthesis.resume();
      speakCurrentSentence();
    }
  }, 18000);
}
```

`onerror` 中要注意过滤用户主动操作引发的 `canceled` 和 `interrupted`，避免误报。页面 `beforeunload` 时也应 `speechSynthesis.cancel()`，防止切换页面后仍有声音残留。

---

## 九、踩坑记录

| 现象 | 原因 | 处理 |
|------|------|------|
| 语音下拉框为空 | `getVoices()` 异步加载 | 监听 `voiceschanged` + 超时兜底 |
| 长文本被截断 | 单条 utterance 过长 | 按标点分句，限制单句长度 |
| 中英文混读语气怪 | 没有按内容切换语音 | 按汉字/字母比例自动选语音 |
| Safari 读英文像机器人 | 默认语音质量差 | 优先选 Samantha / Ava |
| 切后台后卡住 | 浏览器后台限制 | `visibilitychange` + watchdog |
| 快速暂停/继续状态错乱 | `pause()`/`resume()` 不可靠 | 用 `cancel()` + 重新 speak |
| 已读标记不更新 | `onend` 未触发 | 加 watchdog 兜底 |

---

## 十、小结

浏览器原生 TTS 适合构建**轻量、离线、隐私友好**的朗读工具。它的 API 调用很简单，但要把体验做稳，需要重点关注以下几点：

1. **异步加载语音列表**，不要假设初始化时可用。
2. **多层回退的语音选择策略**，适配不同浏览器和系统。
3. **中英文自动检测**，减少用户手动切换。
4. **合理分句**，避免截断，也便于高亮和跳转。
5. **清晰的状态机**，区分播放、暂停、继续、停止。
6. **watchdog 与异常兜底**，处理浏览器不稳定行为。
7. **足够的视觉反馈**：当前句高亮、已读淡化、进度条、滚动同步。

如果只需要一个最小可用版本，可以参考 [Read Aloud](/tools/read-aloud.html)；如果需要更完整的阅读器体验，可以参考 [智能朗读阅读器](/tools/reading-companion.html)。
