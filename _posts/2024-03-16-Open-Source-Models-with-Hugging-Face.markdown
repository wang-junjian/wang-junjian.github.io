---
layout: post
title:  "Open Source Models with Hugging Face"
date:   2024-03-16 08:00:00 +0800
categories: DeepLearningAI HuggingFace
tags: [DeepLearningAI, HuggingFace, Gradio, NLP, ASR, TTS]
---

## Natural Language Processing (NLP)

安装依赖库

```bash
pip install transformers
```

### Conversational
- [blenderbot-400M-distill](https://huggingface.co/facebook/blenderbot-400M-distill)

```py
from transformers.utils import logging
logging.set_verbosity_error()

from transformers import pipeline
chatbot = pipeline(task="conversational", model="facebook/blenderbot-400M-distill")

from transformers import Conversation
user_message = "What are some fun activities I can do in the winter?"
conversation = Conversation(user_message)
conversation = chatbot(conversation)
print(conversation)

# 继续对话：要在 LLM 上下文中包含之前的对话，您可以添加一条“消息”以包含之前的聊天历史记录。
conversation.add_message(
    {
        "role": "user",
        "content": "What else do you recommend?"
    })
conversation = chatbot(conversation)
print(conversation)
```

```
Conversation id: 3b72aee6-6fa1-4ff5-bda1-b8d4526d7d8a
user: 
What are some fun activities I can do in the winter?

assistant:  I like snowboarding and skiing.  What do you like to do in winter?
```

```
Conversation id: 3b72aee6-6fa1-4ff5-bda1-b8d4526d7d8a
user: 
What are some fun activities I can do in the winter?

assistant:  I like snowboarding and skiing.  What do you like to do in winter?
user: 
What else do you recommend?

assistant:  Snowboarding is a lot of fun.  You can do it indoors or outdoors.
```

### Leaderboard

- [Open LLM Leaderboard](https://huggingface.co/spaces/HuggingFaceH4/open_llm_leaderboard)
- [LMSYS Chatbot Arena Leaderboard](https://huggingface.co/spaces/lmsys/chatbot-arena-leaderboard)


## Translation and Summarization

安装依赖库

```bash
pip install transformers
pip install torch
```

### Translation

NLLB: No Language Left Behind: [nllb-200-distilled-600M](https://huggingface.co/facebook/nllb-200-distilled-600M).

To choose other languages, you can find the other language codes on the page: [Languages in FLORES-200](https://github.com/facebookresearch/flores/blob/main/flores200/README.md#languages-in-flores-200)

For example:
- Afrikaans: afr_Latn
- Chinese: zho_Hans
- Egyptian Arabic: arz_Arab
- French: fra_Latn
- German: deu_Latn
- Greek: ell_Grek
- Hindi: hin_Deva
- Indonesian: ind_Latn
- Italian: ita_Latn
- Japanese: jpn_Jpan
- Korean: kor_Hang
- Persian: pes_Arab
- Portuguese: por_Latn
- Russian: rus_Cyrl
- Spanish: spa_Latn
- Swahili: swh_Latn
- Thai: tha_Thai
- Turkish: tur_Latn
- Vietnamese: vie_Latn
- Zulu: zul_Latn

```py
from transformers import pipeline
import torch

translator = pipeline(task="translation", 
                      model="facebook/nllb-200-distilled-600M",
                      torch_dtype=torch.bfloat16)

text = """
My puppy is adorable, Your kitten is cute.
Her panda is friendly.
His llama is thoughtful. 
We all have nice pets!
"""
text_translated = translator(text,
                             src_lang="eng_Latn",
                             tgt_lang="zho_Hans")
print(text_translated)
```

```
[{'translation_text': '我的狗很可爱,你的小猫很可爱,她的熊猫很友好,他的拉马很有心情.我们都有好物!'}]
```

释放内存

```py
import gc
del translator
gc.collect()
```

### Summarization

Model info: [bart-large-cnn](https://huggingface.co/facebook/bart-large-cnn)

```py
summarizer = pipeline(task="summarization",
                      model="facebook/bart-large-cnn",
                      torch_dtype=torch.bfloat16)

text = """Paris is the capital and most populous city of France, with
          an estimated population of 2,175,601 residents as of 2018,
          in an area of more than 105 square kilometres (41 square
          miles). The City of Paris is the centre and seat of
          government of the region and province of Île-de-France, or
          Paris Region, which has an estimated population of
          12,174,880, or about 18 percent of the population of France
          as of 2017."""

summary = summarizer(text,
                     min_length=10,
                     max_length=100)
print(summary)
```

```py
[{'summary_text': 'Paris is the capital and most populous city of France, with an estimated population of 2,175,601 residents as of 2018. The City of Paris is the centre and seat of the government of the region and province of Île-de-France.'}]
```

```py
text="""
巴黎是法国的首都和人口最多的城市
截至 2018 年，居民人口估计为 2,175,601 人，
面积超过105平方公里（41平方公里）
英里）。 巴黎市是巴黎的中心和所在地
法兰西岛大区和省政府，或
巴黎大区估计人口为
12,174,880 人，约占法国人口的 18%
截至 2017 年。
"""

summary = summarizer(text,
                     min_length=10,
                     max_length=100)
print(summary)
```

```py
[{'summary_text': "2,175,601 人， 2,175,.601  personnel, 18% of the world's population.  \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0巴黎是法国的首都和人口最多的城市 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0截至 2018 年） 2,150,000,000 people, 18%, 2,200,000."}]
```

**中文有问题**


## Sentence Embeddings

安装依赖库

```bash
pip install sentence-transformers
```

More info on [all-MiniLM-L6-v2](https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2).

```py
from sentence_transformers import SentenceTransformer
model = SentenceTransformer("all-MiniLM-L6-v2")

sentences1 = ['The cat sits outside',
              'A man is playing guitar',
              'The movies are awesome']
embeddings1 = model.encode(sentences1, convert_to_tensor=True)
sentences2 = ['The dog plays in the garden',
              'A woman watches TV',
              'The new movie is so great']
embeddings2 = model.encode(sentences2, convert_to_tensor=True)
```

计算两个句子之间的余弦相似度来衡量它们之间的相似程度。

余弦相似度是通过测量两个向量的夹角的余弦值来确定它们之间的相似程度。余弦相似度的值范围从 -1（完全不相似）到 1（完全相似），值为 0 表示两个向量在空间中是正交的，即它们之间没有线性相关性。

```py
from sentence_transformers import util
cosine_scores = util.cos_sim(embeddings1,embeddings2)
print(cosine_scores)
for i in range(len(sentences1)):
    print("{} \t\t {} \t\t Score: {:.4f}".format(sentences1[i],
                                                 sentences2[i],
                                                 cosine_scores[i][i]))
```
```
tensor([[ 0.2838,  0.1310, -0.0029],
        [ 0.2277, -0.0327, -0.0136],
        [-0.0124, -0.0465,  0.6571]])

The cat sits outside        The dog plays in the garden     Score: 0.2838
A man is playing guitar     A woman watches TV              Score: -0.0327
The movies are awesome      The new movie is so great       Score: 0.6571
```

这里使用了一个支持中文的模型 [distiluse-base-multilingual-cased-v1](https://huggingface.co/sentence-transformers/distiluse-base-multilingual-cased-v1)

```py
model = SentenceTransformer("distiluse-base-multilingual-cased-v1")

sentences1 = ['猫坐在外面',
              '一个男人正在弹吉他',
              '电影很棒']
embeddings1 = model.encode(sentences1, convert_to_tensor=True)
sentences2 = ['狗在花园里玩耍',
              '一个女人看电视',
              '新电影太棒了']
embeddings2 = model.encode(sentences2, convert_to_tensor=True)

from sentence_transformers import util
cosine_scores = util.cos_sim(embeddings1,embeddings2)
print(cosine_scores)
for i in range(len(sentences1)):
    print("{} \t\t {} \t\t Score: {:.4f}".format(sentences1[i],
                                                 sentences2[i],
                                                 cosine_scores[i][i]))
```
```
tensor([[ 0.3036,  0.2320, -0.0023],
        [ 0.2456,  0.2042,  0.0757],
        [ 0.0512,  0.1783,  0.8136]])

猫坐在外面             狗在花园里玩耍       Score: 0.3036
一个男人正在弹吉他      一个女人看电视       Score: 0.2042
电影很棒               新电影太棒了        Score: 0.8136
```


## Zero-Shot Audio Classification

安装依赖库

```bash
pip install transformers
pip install datasets
pip install soundfile
pip install librosa
```

The `librosa` library may need to have [ffmpeg](https://www.ffmpeg.org/download.html) installed. 
- This page on [librosa](https://pypi.org/project/librosa/) provides installation instructions for ffmpeg.

```py
from datasets import load_dataset, load_from_disk

# This dataset is a collection of different sounds of 5 seconds
dataset = load_dataset("ashraq/esc50",
                       split="train[0:10]")

audio_sample = dataset[0]
print(audio_sample)
```
```py
{'filename': '1-100032-A-0.wav',
 'fold': 1,
 'target': 0,
 'category': 'dog',
 'esc10': True,
 'src_file': 100032,
 'take': 'A',
 'audio': {'path': None,
  'array': array([0., 0., 0., ..., 0., 0., 0.]),
  'sampling_rate': 44100}}
```

在 Jupyter Notebook 中播放音频

```py
from IPython.display import Audio as IPythonAudio
IPythonAudio(audio_sample["audio"]["array"],
             rate=audio_sample["audio"]["sampling_rate"])
```

CLAP：对比语言-音频预训练

More info on [laion/clap-htsat-unfused](https://huggingface.co/laion/clap-htsat-unfused).

```py
from transformers import pipeline
zero_shot_classifier = pipeline(
    task="zero-shot-audio-classification",
    model="./models/laion/clap-htsat-unfused")
```

查看模型的采样率

```py
zero_shot_classifier.feature_extractor.sampling_rate
```
```
48000
```

查看 ESC-50 数据集的采样率

```py
audio_sample["audio"]["sampling_rate"]
```
```
44100
```

在这种情况下，我们需要将音频数据重采样为 48kHz。

```py
from datasets import Audio

dataset = dataset.cast_column("audio", Audio(sampling_rate=48_000))
audio_sample = dataset[0]
print(audio_sample)
```
```py
{'filename': '1-100032-A-0.wav',
 'fold': 1,
 'target': 0,
 'category': 'dog',
 'esc10': True,
 'src_file': 100032,
 'take': 'A',
 'audio': {'path': None,
  'array': array([0., 0., 0., ..., 0., 0., 0.]),
  'sampling_rate': 48000}}
```

在Python中，48_000 是一个整数，使用了Python 3.8及以上版本中引入的"下划线表示法"（underscore separator）。这种表示法允许在数字中使用下划线来分隔位，使得数字更易于阅读。这在表示非常大的数字时特别有用，因为它可以减少视觉上的混乱。

```py
candidate_labels = ["Sound of a dog",
                    "Sound of vacuum cleaner"]
zero_shot_classifier(audio_sample["audio"]["array"],
                     candidate_labels=candidate_labels)
```
```py
[{'score': 0.9985589385032654, 'label': 'Sound of a dog'},
 {'score': 0.0014411123702302575, 'label': 'Sound of vacuum cleaner'}]
```

```py
candidate_labels = ["狗的声音",
                    "吸尘器的声音"]
zero_shot_classifier(audio_sample["audio"]["array"],
                     candidate_labels=candidate_labels)
```
```py
[{'score': 0.5011800527572632, 'label': '吸尘器的声音'},
 {'score': 0.4988199770450592, 'label': '狗的声音'}]
```

**❌不支持中文**


## Automatic Speech Recognition

安装依赖库

```bash
pip install transformers
pip install datasets
pip install soundfile
pip install librosa
pip install gradio
```

The `librosa` library may need to have [ffmpeg](https://www.ffmpeg.org/download.html) installed. 

This page on [librosa](https://pypi.org/project/librosa/) provides installation instructions for ffmpeg.

### 流式（Streaming）加载数据集

```py
from datasets import load_dataset

dataset = load_dataset("librispeech_asr",
                       split="train.clean.100",
                       streaming=True,
                       trust_remote_code=True)

example = next(iter(dataset))
print(example)
```
```py
{'file': '374-180298-0000.flac',
 'audio': {'path': '374-180298-0000.flac',
  'array': array([ 7.01904297e-04,  7.32421875e-04,  7.32421875e-04, ...,
         -2.74658203e-04, -1.83105469e-04, -3.05175781e-05]),
  'sampling_rate': 16000},
 'text': 'CHAPTER SIXTEEN I MIGHT HAVE TOLD YOU OF THE BEGINNING OF THIS LIAISON IN A FEW LINES BUT I WANTED YOU TO SEE EVERY STEP BY WHICH WE CAME I TO AGREE TO WHATEVER MARGUERITE WISHED',
 'speaker_id': 374,
 'chapter_id': 180298,
 'id': '374-180298-0000'}
```

取前 5 条数据

```py
dataset_head = dataset.take(5)
list(dataset_head)
```

### 自动语音识别

Model Info about [distil-whisper/distil-small.en](https://huggingface.co/distil-whisper)

```py
from transformers import pipeline
asr = pipeline(task="automatic-speech-recognition",
               model="distil-whisper/distil-small.en")
```

对比采样率，如果不一致，需要重采样。

```py
print(asr.feature_extractor.sampling_rate)
print(example['audio']['sampling_rate'])
```
```
16000
16000
```

模型的采样率是 16kHz，数据集的采样率也是 16kHz。

```py
asr(example["audio"]["array"]) # 语音识别
```
```py
{'text': ' Chapter 16 I might have told you of the beginning of this liaison in a few lines, but I wanted you to see every step by which we came. I too agree to whatever Marguerite wished.'}
```
```py
example["text"] # 实际文本
```
```py
'CHAPTER SIXTEEN I MIGHT HAVE TOLD YOU OF THE BEGINNING OF THIS LIAISON IN A FEW LINES BUT I WANTED YOU TO SEE EVERY STEP BY WHICH WE CAME I TO AGREE TO WHATEVER MARGUERITE WISHED'
```

### 使用 Gradio 构建可共享的应用程序

```py
import os
import gradio as gr

demo = gr.Blocks()

def transcribe_speech(filepath):
    if filepath is None:
        gr.Warning("No audio found, please retry.")
        return ""
    output = asr(filepath)
    return output["text"]

mic_transcribe = gr.Interface(
    fn=transcribe_speech,
    inputs=gr.Audio(sources="microphone",
                    type="filepath"),
    outputs=gr.Textbox(label="Transcription",
                       lines=3),
    allow_flagging="never")

file_transcribe = gr.Interface(
    fn=transcribe_speech,
    inputs=gr.Audio(sources="upload",
                    type="filepath"),
    outputs=gr.Textbox(label="Transcription",
                       lines=3),
    allow_flagging="never",
)

with demo:
    gr.TabbedInterface(
        [mic_transcribe,
         file_transcribe],
        ["Transcribe Microphone",
         "Transcribe Audio File"],
    )

demo.launch(share=True, 
            server_port=int(os.environ['PORT1']))
```

关闭 Gradio

```py
demo.close()
```

### 长音频文件

转录长音频

![](/images/2024/DeepLearningAI-ShortCourses/Open-Source-Models-with-Hugging-Face/Lesson6_Automatic-Speech-Recognition_Transcribing-long-recordings.png)

```py
import io
import soundfile as sf

audio, sampling_rate = sf.read('narration_example.wav')

print(sampling_rate)
print(asr.feature_extractor.sampling_rate)
print(audio.shape)
```
```
44100
16000
(3572352, 2)
```

采样率不一致，需要重采样，因为模型一般都是只接受单声道，需要将立体声（双声道）转换为单声道。

将音频从立体声转换为单声道（使用 librosa）

```py
import numpy as np
# audio.shape (3572352, 2)
audio_transposed = np.transpose(audio) # 转置
# audio_transposed.shape (2, 3572352)

import librosa
audio_mono = librosa.to_mono(audio_transposed)
IPythonAudio(audio_mono,
             rate=sampling_rate)

audio_16KHz = librosa.resample(audio_mono,
                               orig_sr=sampling_rate,
                               target_sr=16000)
asr(
    audio_16KHz,
    chunk_length_s=30, # 30 seconds
    batch_size=4,
    return_timestamps=True,
)["chunks"]
```
```py
[{'timestamp': (0.0, 13.0),
  'text': ' They run. They laugh. I see the glow shining on their eyes. Not like hers. She seems distant, strange, somehow cold.'},
 {'timestamp': (13.0, 27.0),
  'text': " A couple of days after, I receive the call. I curse, scream, and cry. They're gone. I drink and cry and dream over and over. Why?"},
 {'timestamp': (27.0, 33.0),
  'text': ' Time drags me, expending days, months, or maybe years.'},
 {'timestamp': (33.0, 39.0),
  'text': ' But the pain still remains. It grows. It changes me.'},
 {'timestamp': (39.0, 43.0),
  'text': ' Someone tells me she got released from the psychiatric ward.'},
 {'timestamp': (43.0, 46.08),
  'text': ' 426 days after. I got confused. the psychiatric ward. 426 days after.'},
 {'timestamp': (46.08, 47.08), 'text': ' My head spins.'},
 {'timestamp': (47.08, 49.4), 'text': ' I got confused.'},
 {'timestamp': (49.4, 51.08), 'text': ' The loneliness.'},
 {'timestamp': (51.08, 52.56), 'text': " It's time."},
 {'timestamp': (52.56, 55.04), 'text': ' The road has become endless.'},
 {'timestamp': (55.04, 57.4), 'text': ' I feel the cold wind on my face.'},
 {'timestamp': (57.4, 59.52), 'text': ' My eyes burn.'},
 {'timestamp': (59.52, 61.08), 'text': ' I get to the house.'},
 {'timestamp': (61.08, 62.76), 'text': ' It all looks the same.'},
 {'timestamp': (62.76, 66.84),
  'text': ' I can hear them, laughing like there were no souls taken.'},
 {'timestamp': (66.84, 73.36),
  'text': ' And then she comes. She sees me with kindness in her eyes. She looks at the flowers and'},
 {'timestamp': (73.36, 80.44),
  'text': ' she says she still loves me. Those words hurt me like a razor blade. Good bye, my love.'}]
```

### 构建 Gradio 应用程序

```py
import gradio as gr

demo = gr.Blocks()

def transcribe_long_form(filepath):
    if filepath is None:
        gr.Warning("No audio found, please retry.")
        return ""
    output = asr(
      filepath,
      max_new_tokens=256,
      chunk_length_s=30,
      batch_size=8,
    )
    return output["text"]

mic_transcribe = gr.Interface(
    fn=transcribe_long_form,
    inputs=gr.Audio(sources="microphone",
                    type="filepath"),
    outputs=gr.Textbox(label="Transcription",
                       lines=3),
    allow_flagging="never")

file_transcribe = gr.Interface(
    fn=transcribe_long_form,
    inputs=gr.Audio(sources="upload",
                    type="filepath"),
    outputs=gr.Textbox(label="Transcription",
                       lines=3),
    allow_flagging="never",
)

with demo:
    gr.TabbedInterface(
        [mic_transcribe,
         file_transcribe],
        ["Transcribe Microphone",
         "Transcribe Audio File"],
    )
demo.launch(share=True, 
            server_port=int(os.environ['PORT1']))
```

关闭 Gradio

```py
demo.close()
```


## Text to Speech

安装依赖库

```bash
pip install transformers
pip install gradio
pip install timm
pip install timm
pip install inflect
pip install phonemizer
```

Note: py-espeak-ng is only available Linux operating systems.

To run locally in a Linux machine, follow these commands:

```bash
sudo apt-get update
sudo apt-get install espeak-ng
pip install py-espeak-ng
```

Model Info [kakao-enterprise/vits-ljs](https://huggingface.co/kakao-enterprise/vits-ljs)

```py
from transformers import pipeline

narrator = pipeline("text-to-speech",
                    model="kakao-enterprise/vits-ljs")
```

```py
text = """
Researchers at the Allen Institute for AI, \
HuggingFace, Microsoft, the University of Washington, \
Carnegie Mellon University, and the Hebrew University of \
Jerusalem developed a tool that measures atmospheric \
carbon emitted by cloud servers while training machine \
learning models. After a model’s size, the biggest variables \
were the server’s location and time of day it was active.
"""
narrated_text = narrator(text)
print(narrated_text)
```
```py
{
    'audio': array([[-0.00111276, -0.00131025, -0.00137879, ...,  0.00099993, 0.00127255,  0.00132276]], dtype=float32), 
    'sampling_rate': 22050
}
```

```py
from IPython.display import Audio as IPythonAudio

IPythonAudio(narrated_text["audio"][0],
             rate=narrated_text["sampling_rate"])
```


## Object Detection

安装依赖库

```bash
pip install transformers
pip install gradio
pip install timm
pip install inflect
pip install phonemizer
```

- Linux
```bash
sudo apt-get update
sudo apt-get install espeak-ng
pip install py-espeak-ng
```

### Build the `object-detection` pipeline using 🤗 Transformers Library

- This model was release with the paper [End-to-End Object Detection with Transformers](https://arxiv.org/abs/2005.12872) from Carion et al. (2020)

Model Info about [facebook/detr-resnet-50](https://huggingface.co/facebook/detr-resnet-50)

```py
from helper import load_image_from_url, render_results_in_image
from transformers import pipeline

# Suppressing warning messages
from transformers.utils import logging
logging.set_verbosity_error()

from helper import ignore_warnings
ignore_warnings()

od_pipe = pipeline("object-detection", "facebook/detr-resnet-50")

from PIL import Image
raw_image = Image.open('huggingface_friends.jpg')
raw_image.resize((569, 491))
pipeline_output = od_pipe(raw_image)
processed_image = render_results_in_image(
    raw_image, 
    pipeline_output)
processed_image
```

### Using `Gradio` as a Simple Interface

- Use [Gradio](https://www.gradio.app) to create a demo for the object detection app.
- The demo makes it look friendly and easy to use.
- You can share the demo with your friends and colleagues as well.

```py
import os
import gradio as gr

def get_pipeline_prediction(pil_image):
    pipeline_output = od_pipe(pil_image)
    processed_image = render_results_in_image(pil_image, pipeline_output)
    return processed_image

demo = gr.Interface(
  fn=get_pipeline_prediction,
  inputs=gr.Image(label="Input image", 
                  type="pil"),
  outputs=gr.Image(label="Output image with predicted instances",
                   type="pil")
)

demo.launch(share=True, server_port=int(os.environ['PORT1']))
```

### Close the app
- Remember to call `.close()` on the Gradio app when you're done using it.

### Make an AI Powered Audio Assistant
- Combine the object detector with a text-to-speech model that will help dictate what is inside the image.
- Inspect the output of the object detection pipeline.

More info about [kakao-enterprise/vits-ljs](https://huggingface.co/kakao-enterprise/vits-ljs).

```py
from helper import summarize_predictions_natural_language
text = summarize_predictions_natural_language(pipeline_output)

tts_pipe = pipeline("text-to-speech", model="kakao-enterprise/vits-ljs")
narrated_text = tts_pipe(text)

# Play the audio
from IPython.display import Audio as IPythonAudio
IPythonAudio(narrated_text["audio"][0],
             rate=narrated_text["sampling_rate"])
```


## Deployment

- [ZeroGPU Explorers](https://huggingface.co/zero-gpu-explorers)


## 参考资料
- [Open Source Models with Hugging Face](https://learn.deeplearning.ai/courses/open-source-models-hugging-face)
- [Open Source Models with Hugging Face 中文](https://www.bilibili.com/video/BV16u4m1u7t4)
- [DeepLearning.AI - Short Courses](https://www.deeplearning.ai/short-courses/)
- [Arxiv-CS-RAG](https://huggingface.co/spaces/bishmoy/Arxiv-CS-RAG)
- [LLM 应用生态的基础设施——用 serverless Rust 和 WebAssembly 开发 LLM 应用](https://www.youtube.com/watch?v=pE3jw-P8OcU)
- [Rust是AGI超级人工智能的语言吗？（续）](https://www.youtube.com/watch?v=6M9CUeYztHE)
- [WasmEdge 中文](https://www.youtube.com/@WasmEdgeRuntime)
