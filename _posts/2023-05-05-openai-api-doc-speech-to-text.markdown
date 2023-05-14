---
layout: post
title:  "OpenAI API Documentation Speech to Text"
date:   2023-05-05 10:00:00 +0800
categories: OpenAI-API
tags: ["OpenAI API", "Whisper"]
---

## 开发文档
### [Speech to text](https://platform.openai.com/docs/guides/speech-to-text/speech-to-text-beta)
### [API reference Audio](https://platform.openai.com/docs/api-reference/audio)

## 查看音频文件信息
### file
```shell
data/podcast_clip.mp3: Audio file with ID3 version 2.4.0, contains: MPEG ADTS, layer III, v1, 64 kbps, 44.1 kHz, Stereo
```

### ffprobe
```shell
ffprobe -hide_banner data/podcast_clip.mp3
Input #0, mp3, from 'data/podcast_clip.mp3':
  Metadata:
    major_brand     : M4A 
    minor_version   : 512
    compatible_brands: M4A isomiso2
    date            : 2023-02-06 14:59
    title           : "Clip created on ListenNotes.com"
    encoder         : Lavf58.76.100
  Duration: 00:03:00.04, start: 0.025057, bitrate: 128 kb/s
    Stream #0:0: Audio: mp3, 44100 Hz, stereo, fltp, 128 kb/s
    Metadata:
      encoder         : Lavc58.13
```

## OpenAI API（Whisper）
### 功能
* transcribe（语音转文本）
* translate（语音翻译为英文文本）

文件上传目前限制为 25 MB，并且支持以下输入文件类型：`mp3`, `mp4`, `mpeg`, `mpga`, `m4a`, `wav`, `webm`

### 转录
默认输出 json 格式，默认自动检测音频文件的语言。

```py
import openai
audio_file= open("data/podcast_clip.mp3", "rb")
transcript = openai.Audio.transcribe("whisper-1", audio_file)
print(transcript['text'])
```
`欢迎来到 Onboard 真实的一线经验 走新的投资思考 我是 Monica 我是高宁 我们一起聊聊软件如何改变世界 大家好 欢迎来到 Onboard 我是 Monica 自从OpenAI发布的ChatGBT 掀起了席卷世界的AI热潮 不到三个月就积累了 超过一亿的越货用户 超过1300万的日货用户 真的是展现了AI让人惊讶的 也让很多人直呼 这就是下一个互联网的未来 有不少观众都说 希望我们再做一期AI的讨论 于是这次硬核讨论就来了 这次我们请来了 Google Brain的研究员雪芝 她是Google大语言模型PALM Pathway Language Model的作者之一 要知道这个模型的参数量 是GPT-3的三倍还多 另外还有两位AI产品大牛 一位来自著名的StableDM 背后的商业公司Stability AI 另一位来自某硅谷科技大厂 也曾在吴恩达教授的Landing AI中 担任产品负责人 此外 莫妮凯还邀请到一位 一直关注AI的投资人朋友Bill 当做我的特邀共同主持嘉宾 我们主要讨论几个话题 一方面从研究的视角 最前沿的研究者在关注什么 现在技术的天花板 和未来大的变量可能会在哪里 第二个问题是 未来大的变量可能会在哪里 从产品和商业的角度 什么是一个好的AI产品 整个生态可能随着技术 有怎样的演变 更重要的 我们又能从上一波 AI的创业热潮中学到什么 最后 莫妮凯和Bill还会从投资人的视角 做一个回顾 总结和畅想 这里还有一个小的update 在本集发布的时候 Google也对爆发式增长的 Chad GPT做出了回应 正在测试一个基于Lambda 模型的聊天机器人 ApprenticeBot 正式发布后会有怎样的惊喜 我们都拭目以待 AI无疑是未来几年 最令人兴奋的变量之一 莫妮凯也希望未来能邀请到更多 一线从业者 从不同角度讨论这个话题 不论是想要做创业 研究 产品 还是投资的同学 希望这些对话 对于大家了解这些技术演进 商业的可能 甚至未来对于我们每个人 每个社会意味着什么 都能引发一些思考 提供一些启发 这次的讨论有些技术硬核 需要各位对生成式AI 大模型都有一些基础了解 讨论中涉及到的论文和重要概念 也会总结在本集的简介中 供大家复习参考 几位嘉宾在北美工作生活多年 夹杂英文在所难免 也请大家体谅了 欢迎来到未来 希望大家enjoy`


指定输出文本格式。

提示：
* 通过提示对于纠正模型经常在音频中错误识别的特定单词或首字母缩略词非常有帮助。
* 模型可能会跳过文字记录中的标点符号。您可以使用包含标点符号的简单提示来避免这种情况：`大家好，欢迎收听我的讲座。`

```py
with open("data/podcast_clip.mp3", "rb") as audio_file:
    transcript = openai.Audio.transcribe(
        file = audio_file,
        model = "whisper-1",
        response_format="text",
        prompt="大家好，让我们一起研究ChatGPT的使用吧。"
    )

print(transcript)
```
`欢迎来到onboard,真实的一线经验,走新的投资思考。我是Monica。 我是高宁。我们一起聊聊软件如何改变世界。 大家好,欢迎来到onboard,我是Monica。 自从OpenAI发布的ChatGPT掀起了席卷世界的AI热潮,不到三个月就积累了超过一亿的越活用户,超过1300万的日活用户。 真的是展现了AI让人惊叹的能力,也让很多人直呼这就是下一个互联网的未来。 有不少观众都说希望我们再做一期AI的讨论,于是这次硬核讨论就来了。 这次我们请来了Google Brain的研究员雪芝,她是Google大语言模型POM,Pathway Language Model的作者之一。 要知道,这个模型的参数量是GPT-3的三倍还多。 另外还有两位AI产品大牛,一位来自著名的Stable Diffusion背后的商业公司Surbility AI, 另一位来自某硅谷科技大厂,也曾在吴恩达教授的Landing AI中担任产品负责人。 此外,Monica还邀请到一位一直关注AI的投资人朋友Bill,当做我的特邀共同主持嘉宾。 我们主要讨论几个话题,一方面从研究的视角,最前沿的研究者在关注什么? 现在的技术的天花板和未来大的变量可能会在哪里? 从产品和商业的角度,什么是一个好的AI产品? 整个生态可能随着技术有怎样的演变? 更重要的,我们又能从上一波AI的创业热潮中学到什么? 最后,Monica和Bill还会从投资人的视角做一个回顾、总结和畅想。 这里还有一个小的update,在本集发布的时候,Google也对爆发式增长的Chat GPT做出了回应。 正在测试一个基于Lambda模型的聊天机器人ApprenticeBot。 证实发布后会有怎样的惊喜,我们都拭目以待。 AI无疑是未来几年最令人兴奋的变量之一。 Monica也希望未来能邀请到更多一线从业者从不同角度讨论这个话题。 不论是想要做创业、研究、产品还是投资的同学, 希望这些对话对于大家了解这些技术演进、商业的可能,甚至未来对于我们每个人、每个社会意味着什么都能引发一些思考,提供一些启发。 这次的讨论有些技术硬核,需要各位对生成式AI大模型都有一些基础了解。 讨论中涉及到的论文和重要概念也会总结在本集的简介中,供大家复习参考。 几位嘉宾在北美工作生活多年,夹杂英文在所难免,也请大家体谅了。 欢迎来到未来,大家enjoy!`


指定输出 srt 音频字幕格式，还指定了音频文件的语言。

```py
with open("data/podcast_clip.mp3", "rb") as audio_file:
    transcript = openai.Audio.transcribe(
        file = audio_file,
        model = "whisper-1",
        response_format="srt",
        prompt="大家好，最近在研究ChatGPT的应用。",
        language="zh"
    )

print(transcript)
```
```
1
00:00:01,000 --> 00:00:06,000
欢迎来到onboard,真实的一线经验,走新的投资思考。

2
00:00:06,000 --> 00:00:11,000
我是Monica,我是高宁,我们一起聊聊软件如何改变世界。

3
00:00:15,000 --> 00:00:18,000
大家好,欢迎来到onboard,我是Monica。

4
00:00:18,000 --> 00:00:23,000
自从OpenAI发布的ChatGPT掀起了席卷世界的AI热潮,

...

32
00:02:41,000 --> 00:02:47,000
几位嘉宾在北美工作生活多年,夹杂英文在所难免,也请大家体谅了。

33
00:02:47,000 --> 00:03:12,000
欢迎来到未来,大家enjoy!
```

### 翻译
```py
import openai

audio_file= open("data/podcast_clip.mp3", "rb")
transcript = openai.Audio.translate("whisper-1", audio_file)
print(transcript['text'])
```
`Welcome to Onboard, a new way to think about investing with real experience. I'm Monica. I'm Gao Ning. Let's talk about how software can change the world. Hello everyone, welcome to Onboard. I'm Monica. Since the launch of OpenAI, the trend of ChatGPT has been a hot topic in the world. In less than three months, it has accumulated more than 100 million active users, more than 13 million active users. It really shows the ability of AI to amaze people. It also makes many people say that this is the future of the next Internet. Many viewers said that they wanted us to do another AI discussion. So this time, the discussion came. This time we invited a researcher from Google Brain, Xue Zhi. He is one of the authors of Google's large-scale model PUM, Pathway Language Model. You should know that the number of parameters of this model is three times more than GPT-3. There are also two AI product bigwigs. One is from the famous Stable Diffusion business company, Stability AI. The other is from a Silicon Valley technology factory. He was also the product manager in Professor Wu Wenda's Landing AI. In addition, Monica also invited a friend of AI who has been paying attention to AI, Bill, as my special guest host. We mainly discuss several topics. On the one hand, from a research perspective, what are the most cutting-edge researchers paying attention to? Where are the cutting-edge technologies and the large variables of the future? From the perspective of products and business, what is a good AI product? What kind of evolution may the whole state follow? More importantly, what can we learn from the previous wave of AI entrepreneurship? Finally, Monica and Bill will also make a review, summary and reflection from the perspective of investors. Here is a small update. When this issue was released, Google also responded to the explosive growth of ChatGPT. We are testing an Apprentice Bot based on Lambda model. What kind of surprises will be released? We are looking forward to it. AI is undoubtedly one of the most exciting variables in the coming years. Monica also hopes to invite more frontline entrepreneurs to discuss this topic from different angles. Whether you want to start a business, research, product or investment, I hope these conversations will help you understand the possibilities of these technical horizons and business. Even in the future, it can cause some thoughts and inspire us to think about what it means to each person and each society. This discussion is a bit technical, and requires you to have some basic understanding of the biometric AI model. The discussion will also be summarized in this video. You are all welcome to come to the future. Enjoy! Let me give you a brief introduction. Here are some of your past experiences.`

## [开源 Whisper](https://github.com/openai/whisper)
### [论文](https://cdn.openai.com/papers/whisper.pdf)
### [Introducing Whisper](https://openai.com/research/whisper)

![](https://raw.githubusercontent.com/openai/whisper/main/approach.png)

![](https://openaicom.imgix.net/d9c13138-366f-49d3-b8bd-cb3f5a973a5b/asr-summary-of-model-architecture-desktop.svg)

![](https://openaicom.imgix.net/18ff9c06-7853-4e3b-946f-508f0cd7ed13/asr-details-desktop.svg)

### [模型](https://github.com/openai/whisper/blob/main/model-card.md)

|  Size  | Parameters | English-only model | Multilingual model | Required VRAM | Relative speed |
|:------:|:----------:|:------------------:|:------------------:|:-------------:|:--------------:|
|  tiny  |    39 M    |     `tiny.en`      |       `tiny`       |     ~1 GB     |      ~32x      |
|  base  |    74 M    |     `base.en`      |       `base`       |     ~1 GB     |      ~16x      |
| small  |   244 M    |     `small.en`     |      `small`       |     ~2 GB     |      ~6x       |
| medium |   769 M    |    `medium.en`     |      `medium`      |     ~5 GB     |      ~2x       |
| large  |   1550 M   |        N/A         |      `large`       |    ~10 GB     |       1x       |

### Python 开发
```py
import whisper

model = whisper.load_model("large")
result = model.transcribe("data/podcast_clip.mp3", initial_prompt="大家好，最近在研究ChatGPT的应用。")

print(result["text"])
```
`欢迎来到onboard,真实的一线经验,走新的投资思考。我是Monica,我是高宁,我们一起聊聊软件如何改变世界。大家好,欢迎来到onboard,我是Monica。自从OpenAI发布的ChatGPT掀起了席卷世界的AI热潮,不到三个月就积累了超过一亿的越活用户,超过1300万的日活用户。真的是展现了AI让人惊叹的能力,也让很多人直呼这就是下一个互联网的未来。有不少观众都说希望我们再做一期AI的讨论,于是这次硬核讨论就来了。这次我们请来了Google Brain的研究员雪芝,她是Google大语言模型PALM Pathway Language Model的作者之一。要知道,这个模型的参数量是GPT-3的三倍还多。另外还有两位AI产品大牛,一位来自著名的Stable Diffusion背后的商业公司Stability AI,另一位来自某硅谷科技大厂,也曾在吴恩达教授的Landing AI中担任产品负责人。此外,Monica还邀请到一位一直关注AI的投资人朋友Bill,当做我的特邀共同主持嘉宾。我们主要讨论几个话题,一方面从研究的视角,最前沿的研究者在关注什么?现在的技术的天花板和未来大的变量可能会在哪里?从产品和商业的角度,什么是一个好的AI产品?整个生态可能随着技术有怎样的演变?更重要的,我们又能从上一波AI的创业热潮中学到什么?最后,Monica和Bill还会从投资人的视角做一个回顾、总结和畅想。这里还有一个小的update,在本集发布的时候,Google也对爆发式增长的ChatGPT做出了回应,正在测试一个基于Lambda模型的聊天机器人ApprenticeBot,正式发布后会有怎样的惊喜?我们都拭目以待。AI无疑是未来几年最令人兴奋的变量之一,Monica也希望未来能邀请到更多一线从业者从不同角度讨论这个话题,不论是想要做创业、研究、产品还是投资的同学,希望这些对话对于大家了解这些技术演进、商业的可能,甚至未来对于我们每个人、每个社会意味着什么都能引发一些思考,提供一些启发。这次的讨论有些技术硬核,需要各位对生成式AI、大模型都有一些基础了解,讨论中涉及到的论文和重要概念也会总结在本集的简介中,供大家复习参考。几位嘉宾在北美工作生活多年,夹杂英文在所难免,也请大家体谅了。欢迎来到未来,大家enjoy!`

在我的 Macbook Pro M2 Max 上运行了 2 分 23.5 秒。

## 参考资料
* [Listen Notes: 最好的播客搜索引擎](https://www.listennotes.com/zh-hans/)
* [useWhisper: React hook for OpenAI Whisper with speech recorder, real-time transcription, and silence removal built-in](https://github.com/chengsokdara/use-whisper)
