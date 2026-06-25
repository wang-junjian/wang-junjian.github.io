---
layout: single
title:  "Whisper 语音识别"
date:   2023-05-26 08:00:00 +0800
categories: [AI 与大模型, 编程开发]
tags: [openai, pydub]
---

## Whisper
### 功能
* 将音频转录成音频所使用的任何语言。
* 将音频翻译并转录成英文。

文件上传目前限制为 `25 MB`，并且支持以下输入文件类型：`mp3`, `mp4`, `mpeg`, `mpga`, `m4a`, `wav`, `webm`.

### 语音内容
Mira Murati 是一位对人工智能技术充满热情的科技领袖，她的理念和影响对人工智能技术的发展和应用产生了深远的影响。

她认为人工智能技术应该是以人为本的，强调人工智能技术应该是一种能够服务于人类的工具，而不是取代人类的工具。

她指出，人工智能技术的最终目的是为人类服务，因此人工智能技术应该以人类的利益和需求为中心，以解决人类面临的实际问题。人工智能技术的应用需要深入了解人类社会的需要和价值，将其应用到真正有意义的领域中。

## OpenAI Whisper
### 安装 OpenAI
```bash
!pip install -U openai
```

### 测试
#### 语音识别
```py
import openai
audio_file= open("data/audios/test.m4a", "rb")
transcript = openai.Audio.transcribe("whisper-1", audio_file)
print(transcript["text"])
```

Miramurati是一位对人工智能技术充满热情的科技领袖 他的理念和影响对人工智能技术的发展和应用产生了深远的影响 他认为人工智能技术应该是以人为本的 强调人工智能技术应该是一种能够服务于人类的工具 而不是取代人类的工具 他指出人工智能技术的最终目的是为人类服务 因此人工智能技术应该以人类的利益和需求为中心 以解决人类面临的实际问题 人工智能技术的应用需要深入了解人类社会的需要和价值 将其应用到真正有意义的领域中

👍 **可以看到转换的非常准确，但是缺少了标点符号，英文名字也有一点小小的问题。**

#### 通过提示（prompt）改进语音识别
```py
import openai
audio_file= open("data/audios/test.m4a", "rb")
transcript = openai.Audio.transcribe("whisper-1", audio_file,
                                     prompt="欢迎收听 Mira Murati 的理念与影响的讲座。")
print(transcript["text"])
```

Mira Murati 是一位对人工智能技术充满热情的科技领袖。 她的理念和影响对人工智能技术的发展和应用产生了深远的影响。 她认为人工智能技术应该是以人为本的, 强调人工智能技术应该是一种能够服务于人类的工具, 而不是取代人类的工具。 她指出,人工智能技术的最终目的是为人类服务, 因此人工智能技术应该以人类的利益和需求为中心, 以解决人类面临的实际问题。 人工智能技术的应用需要深入了解人类社会的需要和价值, 将其应用到真正有意义的领域中。

**这里还有个小问题，每个标点符号后面都有一个空格。这个小问题不好解决啊。**

### 更长的输入

默认情况下，Whisper API 仅支持小于 25 MB 的文件。如果您有比这更长的音频文件，则需要将其分成 25 MB 或更小的块或使用压缩音频格式。为了获得最佳性能，我们建议您避免在句子中间打断音频，因为这可能会导致某些上下文丢失。

一种处理方法是使用 [PyDub](https://github.com/jiaaro/pydub) 开源 Python 包来分割音频：

#### 安装 Pydub
```
pip install pydub
```

#### 手动分割测试
```py
from pydub import AudioSegment

audio = AudioSegment.from_file("data/audios/test.m4a")

# Pydub handles time in milliseconds
thirty_seconds = 30 * 1000

first_30_seconds = audio[:thirty_seconds]
first_30_seconds.export("tmp/test1.mp3", format="mp3")

last_seconds = audio[thirty_seconds:]
last_seconds.export("tmp/test2.mp3", format="mp3")

import openai

for file in ["tmp/test1.mp3", "tmp/test2.mp3"]:
    audio_file= open(file, "rb")
    transcript = openai.Audio.transcribe("whisper-1", audio_file,
                                        prompt="大家好，欢迎收听 Mira Murati 的理念与影响的讲座。")
    print(transcript["text"])
```

Mira Murati 是一位对人工智能技术充满热情的科技领袖。 她的理念和影响对人工智能技术的发展和应用产生了深远的影响。 她认为人工智能技术应该是以人为本的, 强调人工智能技术应该是一种能够服务于人类的工具, 而不是一种工具。

人工智能技术不是取代人类的工具。 他指出,人工智能技术的最终目的是为人类服务, 因此人工智能技术应该以人类的利益和需求为中心, 以解决人类面临的实际问题。 人工智能技术应用需要深入了解人类社会的需要和价值, 将其应用到真正有意义的领域中。

**可以看出暴力分割，对于分割的句子是有影响的。接下来我们看看如何在标点符号处进行分割。**

#### 自动分割测试
```py
import os
import shutil
from pydub import AudioSegment, silence

def audio_transcribe(file, prompt):
    audio_file= open(file, "rb")
    transcript = openai.Audio.transcribe("whisper-1", audio_file, prompt=prompt)
    return transcript["text"]

def detect_first_silent(audio, start_time, time_step=10, min_silence_len=500, silence_thresh=-40):
    slice_audio = audio[start_time:start_time+time_step*1000]
    silents = silence.detect_silence(slice_audio, min_silence_len=min_silence_len, silence_thresh=silence_thresh)
    if len(silents):
        return (start_time+silents[0][0], start_time+silents[0][1])
    return (start_time, start_time)

def split_audio_file(filename, interval_seconds, save_dir):
    audio_files = []

    name = os.path.splitext(os.path.basename(filename))[0]
    audio = AudioSegment.from_file(filename)
    audio_len = len(audio)
    index = 1
    start_time = 0
    while start_time < audio_len:
        end_time = start_time + interval_seconds*1000
        if end_time > audio_len:
            end_time = audio_len

        silent_start_time, slient_end_time = detect_first_silent(audio, end_time)
        end_time = silent_start_time
        
        audio_file = os.path.join(save_dir, f"{name}{index}.mp3")
        audio[start_time:end_time].export(audio_file, format="mp3")
        audio_files.append(audio_file)

        start_time = slient_end_time
        index += 1

    return audio_files

def transcribe_audio_files(audio_files, prompt, prompt_len=100):
    text_files = []
    for audio_file in audio_files:
        print("😍", prompt)
        text = audio_transcribe(audio_file, prompt)
        print(text)

        text_file = os.path.splitext(audio_file)[0]+".txt"
        with open(text_file, "a") as f:
            f.write(text)
        text_files.append(text_file)

        prompt = text[-prompt_len:] if len(text) > prompt_len else text

    return text_files

def merge_text_files(text_files, output_file):
    with open(output_file, "a") as f:
        for text_file in text_files:
            with open(text_file, "r") as f_text:
                f.write(f_text.read())

save_dir = "tmp"

shutil.rmtree(save_dir)
os.mkdir(save_dir)

filename = "data/audios/test.m4a"
audio_files = split_audio_file(filename, 20, save_dir)

prompt = "大家好，欢迎收听 Mira Murati 的理念与影响的讲座。"
text_files = transcribe_audio_files(audio_files, prompt)

text_file = os.path.join(save_dir, "test.txt")
merge_text_files(text_files, text_file)
```


## 本地 Whisper
### 安装 Whisper
```bash
pip install -U openai-whisper
```

### 本地语音识别
```py
import os
import shutil
import whisper
from pydub import AudioSegment, silence


def audio_transcribe_with_openai(whisper_service, file, prompt):
    audio_file= open(file, "rb")
    transcript = whisper_service.transcribe("whisper-1", audio_file, prompt=prompt)
    return transcript["text"]

def audio_transcribe_with_local(whisper_service, file, prompt):
    transcript = whisper_service.transcribe(file, initial_prompt=prompt)
    return transcript["text"]

def detect_first_silent(audio, start_time, time_step=10, min_silence_len=500, silence_thresh=-40):
    slice_audio = audio[start_time:start_time+time_step*1000]
    silents = silence.detect_silence(slice_audio, min_silence_len=min_silence_len, silence_thresh=silence_thresh)
    if len(silents):
        return (start_time+silents[0][0], start_time+silents[0][1])
    return (start_time, start_time)

def split_audio_file(filename, interval_seconds, save_dir):
    audio_files = []

    name = os.path.splitext(os.path.basename(filename))[0]
    audio = AudioSegment.from_file(filename)
    audio_len = len(audio)
    index = 1
    start_time = 0
    while start_time < audio_len:
        end_time = start_time + interval_seconds*1000
        if end_time > audio_len:
            end_time = audio_len

        silent_start_time, slient_end_time = detect_first_silent(audio, end_time)
        end_time = silent_start_time
        
        audio_file = os.path.join(save_dir, f"{name}{index}.mp3")
        audio[start_time:end_time].export(audio_file, format="mp3")
        audio_files.append(audio_file)

        start_time = slient_end_time
        index += 1

    return audio_files

def transcribe_audio_files(audio_transcribe, whisper_service, audio_files, prompt, prompt_len=100):
    text_files = []
    for audio_file in audio_files:
        print("😍", prompt)
        text = audio_transcribe(whisper_service, audio_file, prompt)
        print(text)

        text_file = os.path.splitext(audio_file)[0]+".txt"
        with open(text_file, "a") as f:
            f.write(text)
        text_files.append(text_file)

        prompt = text[-prompt_len:] if len(text) > prompt_len else text

    return text_files

def merge_text_files(text_files, output_file):
    with open(output_file, "a") as f:
        for text_file in text_files:
            with open(text_file, "r") as f_text:
                f.write(f_text.read())

save_dir = "tmp"

shutil.rmtree(save_dir)
os.mkdir(save_dir)

filename = "data/audios/test.m4a"
audio_files = split_audio_file(filename, 20, save_dir)

model = whisper.load_model("large")
whisper_handlers = [(audio_transcribe_with_local, model),
                    (audio_transcribe_with_openai, openai.Audio)]

prompt = "大家好，欢迎收听 Mira Murati 的理念与影响的讲座。"
text_files = transcribe_audio_files(*whisper_handlers[0], audio_files, prompt)

text_file = os.path.join(save_dir, "test.txt")
merge_text_files(text_files, text_file)
```


## 参考资料
* [Whisper](https://github.com/openai/whisper)
* [OpenAI Python Library](https://github.com/openai/openai-python)
* [Pydub](https://github.com/jiaaro/pydub)
* [AutoCut: 通过字幕来剪切视频](https://github.com/mli/autocut)
