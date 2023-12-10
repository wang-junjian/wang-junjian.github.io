---
layout: post
title:  "SeamlessM4T — Massively Multilingual & Multimodal Machine Translation（大规模多语言和多模式机器翻译）"
date:   2023-12-09 08:00:00 +0800
categories: SeamlessM4T
tags: [SeamlessM4T, MacBookProM2Max]
---

[Seamless Communication](https://ai.meta.com/research/seamless-communication/)

![](/images/2023/seamless-m4t/SeamlessM4T.jpg)

- ASR: Automatic speech recognition for 96 languages.
- S2ST: Speech-to-Speech translation from 100 source speech languages into 35 target speech languages.
- S2TT: Speech-to-text translation from 100 source speech languages into 95 target text languages.
- T2ST: Text-to-Speech translation from 95 source text languages into 35 target speech languages.
- T2TT: Text-to-text translation (MT) from 95 source text languages into 95 target text languages.

## SeamlessM4T 概述
![](/images/2023/seamless-m4t/SeamlessM4T-Overview.png)

## 安装 [Seamless Communication][seamless_communication]

### 克隆仓库
```shell
git clone https://github.com/facebookresearch/seamless_communication
cd seamless_communication
```

### 创建虚拟环境

```shell
conda create -n seamless-m4t python==3.10.9 -y
conda activate seamless-m4t
```

### 增加 MPS 的支持
**经过测试，使用 `MPS` 在 `S2ST`, `S2TT`, `ASR` 这三个任务都有问题，`输入是语音`就有问题。**

cli/m4t/predict/predict.py

```py
    if torch.cuda.is_available():
        device = torch.device("cuda:0")
        dtype = torch.float16
    elif torch.backends.mps.is_available():
        device = torch.device("mps")
        dtype = torch.float32
    else:
        device = torch.device("cpu")
        dtype = torch.float32
```

- [How to check mps availability?](https://discuss.pytorch.org/t/how-to-check-mps-availability/152015)
- [How to move PyTorch model to GPU on Apple M1 chips?](https://stackoverflow.com/questions/72416726/how-to-move-pytorch-model-to-gpu-on-apple-m1-chips)

设置环境变量：`PYTORCH_ENABLE_MPS_FALLBACK=1` 解决 MPS 没有实现的操作 ❌

```
NotImplementedError: The operator 'aten::_weight_norm_interface' is not currently implemented for the MPS device. If you want this op to be added in priority during the prototype phase of this feature, please comment on https://github.com/pytorch/pytorch/issues/77764. As a temporary fix, you can set the environment variable `PYTORCH_ENABLE_MPS_FALLBACK=1` to use the CPU as a fallback for this op. WARNING: this will be slower than running natively on MPS.
```

设置环境变量

```shell
conda env config vars set PYTORCH_ENABLE_MPS_FALLBACK=1
```

查看环境变量

```shell
conda env config vars list
```

- [Pytorch Enable MPS Fallback help?](https://www.reddit.com/r/pytorch/comments/1335lwu/pytorch_enable_mps_fallback_help/)

### 安装 Seamless Communication

```shell
pip install .
conda install -c conda-forge libsndfile==1.0.31 -y

mkdir -p /opt/homebrew/opt/libsndfile/lib/
ln -s /opt/miniconda/envs/seamless-m4t/lib/libsndfile.1.0.31.dylib /opt/homebrew/opt/libsndfile/lib/libsndfile.1.dylib
```

## 准备数据

```shell
CHINESE_TEXT="荷兰发布了一份主题为“宣布即将对先进半导体制造设备采取的出口管制措施”的公告表示，鉴于技术的发展和地缘政治的背景，政府已经得出结论，有必要扩大现有的特定半导体制造设备的出口管制。"
ENGLISH_TEXT="The Netherlands issued an announcement titled \"Announcement of Upcoming Export Control Measures on Advanced Semiconductor Manufacturing Equipment\" stating that given the development of technology and the geopolitical context, the government has concluded that it is necessary to expand existing specific semiconductor manufacturing Export controls on equipment."
```
- 中文语音文件：`chinese.wav`
- 英文语音文件：`english.wav`

## Languages List

### Source Languages（S2ST / S2TT）

| Code | Language Name | Code | Language Name | Code | Language Name | Code | Language Name | Code | Language Name | Code | Language Name |
| ---- | ------------- | ---- | ------------- | ---- | ------------- | ---- | ------------- | ---- | ------------- | ---- | ------------- |
| afr | Afrikaans | cym | Welsh | hye | Armenian | lit | Lithuanian | oci | Occitan | swh | Swahili |
| amh | Amharic | dan | Danish | ibo | Igbo | ltz | Luxembourgish | ory | Odia | tam | Tamil |
| arb | Modern Standard Arabic | deu | German | ind | Indonesian | lug | Ganda | pan | Punjabi | tel | Telugu |
| ary | Moroccan Arabic | ell | Greek | isl | Icelandic | luo | Luo | pbt | Southern Pashto | tgk | Tajik |
| arz | Egyptian Arabic | **eng** | **English** | ita | Italian | lvs | Standard Latvian | pes | Western Persian | tgl | Tagalog |
| asm | Assamese | est | Estonian | jav | Javanese | mai | Maithili | pol | Polish | tha | Thai |
| ast | Asturian | eus | Basque | jpn | Japanese | mal | Malayalam | por | Portuguese | tur | Turkish |
| azj | North Azerbaijani | fin | Finnish | kam | Kamba | mar | Marathi | ron | Romanian | ukr | Ukrainian |
| bel | Belarusian | fra | French | kan | Kannada | mkd | Macedonian | rus | Russian | urd | Urdu |
| ben | Bengali | gaz | West Central Oromo | kat | Georgian | mlt | Maltese | slk | Slovak | uzn | Northern Uzbek |
| bos | Bosnian | gle | Irish | kaz | Kazakh | mni | Meitei | slv | Slovenian | vie | Vietnamese |
| bul | Bulgarian | glg | Galician | kea | Kabuverdianu | mya | Burmese | sna | Shona | xho | Xhosa |
| cat | Catalan | guj | Gujarati | khk | Halh Mongolian | nld | Dutch | snd | Sindhi | yor | Yoruba |
| ceb | Cebuano | heb | Hebrew | khm | Khmer | nno | Norwegian Nynorsk | som | Somali | yue | Cantonese |
| ces | Czech | hin | Hindi | kir | Kyrgyz | nob | Norwegian Bokmål | spa | Spanish | zlm | Colloquial Malay |
| ckb | Central Kurdish | hrv | Croatian | kor | Korean | npi | Nepali | srp | Serbian | zsm | Standard Malay |
| **cmn** | **Mandarin Chinese** | hun | Hungarian | lao | Lao | nya | Nyanja | swe | Swedish | zul | Zulu |

### Source Languages（T2TT / T2ST）

| Code | Language Name | Code | Language Name | Code | Language Name | Code | Language Name | Code | Language Name | Code | Language Name |
| ---- | ------------- | ---- | ------------- | ---- | ------------- | ---- | ------------- | ---- | ------------- | ---- | ------------- |
| afr | Afrikaans | cym | Welsh | hye | Armenian | lit | Lithuanian |  |  | swh | Swahili |
| amh | Amharic | dan | Danish | ibo | Igbo |  |  | ory | Odia | tam | Tamil |
| arb | Modern Standard Arabic | deu | German | ind | Indonesian | lug | Ganda | pan | Punjabi | tel | Telugu |
| ary | Moroccan Arabic | ell | Greek | isl | Icelandic | luo | Luo | pbt | Southern Pashto | tgk | Tajik |
| arz | Egyptian Arabic | eng | English | ita | Italian | lvs | Standard Latvian | pes | Western Persian | tgl | Tagalog |
| asm | Assamese | est | Estonian | jav | Javanese | mai | Maithili | pol | Polish | tha | Thai |
|  |  | eus | Basque | jpn | Japanese | mal | Malayalam | por | Portuguese | tur | Turkish |
| azj | North Azerbaijani | fin | Finnish |  |  | mar | Marathi | ron | Romanian | ukr | Ukrainian |
| bel | Belarusian | fra | French | kan | Kannada | mkd | Macedonian | rus | Russian | urd | Urdu |
| ben | Bengali | gaz | West Central Oromo | kat | Georgian | mlt | Maltese | slk | Slovak | uzn | Northern Uzbek |
| bos | Bosnian | gle | Irish | kaz | Kazakh | mni | Meitei | slv | Slovenian | vie | Vietnamese |
| bul | Bulgarian | glg | Galician |  |  | mya | Burmese | sna | Shona |  |  |
| cat | Catalan | guj | Gujarati | khk | Halh Mongolian | nld | Dutch | snd | Sindhi | yor | Yoruba |
| ceb | Cebuano | heb | Hebrew | khm | Khmer | nno | Norwegian Nynorsk | som | Somali | yue | Cantonese |
| ces | Czech | hin | Hindi | kir | Kyrgyz | nob | Norwegian Bokmål | spa | Spanish |  |  |
| ckb | Central Kurdish | hrv | Croatian | kor | Korean | npi | Nepali | srp | Serbian | zsm | Standard Malay |
| cmn | Mandarin Chinese | hun | Hungarian | lao | Lao | nya | Nyanja | swe | Swedish | zul | Zulu |

### Target Languages（S2ST / T2ST）

| Code | Language Name | 中文名 | Code | Language Name | 中文名 | Code | Language Name | 中文名 |
| ---- | ------------- | ----- | ---- | ------------- | ----- | ---- | ------------- | ----- |
| eng | English | 英语 | hin | Hindi | 印地语 | slk | Slovak | 斯洛伐克语 |
| arb | Modern Standard Arabic | 现代标准阿拉伯语 | ind | Indonesian | 印度尼西亚语 | spa | Spanish | 西班牙语 |
| ben | Bengali | 孟加拉语 | ita | Italian | 意大利语 | swe | Swedish | 瑞典语 |
| cat | Catalan | 加泰罗尼亚语 | jpn | Japanese | 日语 | swh | Swahili | 斯瓦希里语 |
| ces | Czech | 捷克语 | kor | Korean | 韩语 | tel | Telugu | 泰卢固语 |
| cmn | Mandarin Chinese | 普通话 | mlt | Maltese |  | tgl | Tagalog | 他加禄语 |
| cym | Welsh | 威尔士语 | nld | Dutch | 荷兰语 | tha | Thai | 泰语 |
| dan | Danish | 丹麦语 | pes | Western Persian | 波斯语 | tur | Turkish | 土耳其语 |
| deu | German | 德语 | pol | Polish | 波兰语 | ukr | Ukrainian | 乌克兰语 |
| est | Estonian | 爱沙尼亚语 | por | Portuguese | 葡萄牙语 | urd | Urdu | 乌尔都语 |
| fin | Finnish | 芬兰语 | ron | Romanian | 罗马尼亚语 | uzn | Northern Uzbek | 北乌兹别克语 |
| fra | French | 法语 | rus | Russian | 俄语 | vie | Vietnamese | 越南语 |


## SeamlessM4T 命令行（m4t_predict）

```shell
m4t_predict -h
```
```
usage: m4t_predict [-h] [--task TASK] [--tgt_lang TGT_LANG] [--src_lang SRC_LANG] [--output_path OUTPUT_PATH] [--model_name MODEL_NAME] [--vocoder_name VOCODER_NAME] [--text_generation_beam_size TEXT_GENERATION_BEAM_SIZE]
                   [--text_generation_max_len_a TEXT_GENERATION_MAX_LEN_A] [--text_generation_max_len_b TEXT_GENERATION_MAX_LEN_B] [--text_generation_ngram_blocking TEXT_GENERATION_NGRAM_BLOCKING]
                   [--no_repeat_ngram_size NO_REPEAT_NGRAM_SIZE] [--unit_generation_beam_size UNIT_GENERATION_BEAM_SIZE] [--unit_generation_max_len_a UNIT_GENERATION_MAX_LEN_A]
                   [--unit_generation_max_len_b UNIT_GENERATION_MAX_LEN_B] [--unit_generation_ngram_blocking UNIT_GENERATION_NGRAM_BLOCKING] [--unit_generation_ngram_filtering UNIT_GENERATION_NGRAM_FILTERING]
                   [--text_unk_blocking TEXT_UNK_BLOCKING]
                   input

M4T inference on supported tasks using Translator.

positional arguments:
  input                 Audio WAV file path or text input.

options:
  -h, --help            show this help message and exit
  --task TASK           Task type
  --tgt_lang TGT_LANG   Target language to translate/transcribe into.
  --src_lang SRC_LANG   Source language, only required if input is text.
  --output_path OUTPUT_PATH
                        Path to save the generated audio.
  --model_name MODEL_NAME
                        Base model name (`seamlessM4T_medium`, `seamlessM4T_large`, `seamlessM4T_v2_large`)
```

- --src_lang S2ST / S2TT / ASR 不需要指定，T2ST / T2TT 需要指定

### S2ST: Speech-to-Speech translation

中文 → 英文
```shell
m4t_predict chinese.wav --task s2st --tgt_lang eng --output_path eng.wav
```

英文 → 中文
```shell
m4t_predict english.wav --task s2st --tgt_lang cmn --output_path cmn.wav
```

### S2TT: Speech-to-text translation

中文 → 中文
```shell
m4t_predict chinese.wav --task s2tt --tgt_lang cmn
```
```
荷兰发布了一份主题为 宣布即将对先进半导体制造设备采取的出口管制措施 的公告 表示 鉴于技术的发展和地缘政治的背景 政府已经得出结论 有必要扩大现有的特定半导体制造设备的出口管制
```

中文 → 英文
```shell
m4t_predict chinese.wav --task s2tt --tgt_lang eng
```
```
The announcement, titled "Announcing Imminent Export Control Measures for Advanced Semiconductor Manufacturing Equipment", said that given the development of technology and geopolitics, the government has concluded that it is necessary to expand export controls on existing specific semiconductor manufacturing equipment.
```

英文 → 中文（❌）
```shell
m4t_predict english.wav --task s2tt --tgt_lang cmn
```
```
The announcement titled announcing export control measures for advanced semiconductor manufacturing equipment that given the development of technology and geopolitics, the government has concluded that it is necessary to expand export controls on specific semiconductor manufacturing equipment.
```

### T2ST: Text-to-Speech translation

中文 → 中文
```shell
m4t_predict $CHINESE_TEXT --task t2st --src_lang cmn --tgt_lang cmn --output_path cmn.wav
```
```
荷兰发布了一份主题为 ⁇ 宣布即将对先进半导体制造设备采取的出口管制措施 ⁇ 的公告表示,鉴于技术的发展和地缘政治的背景,政府已经得出结论,有必要扩大现有的特定半导体制造设备的出口管制 ⁇
```

中文 → 英文
```shell
m4t_predict $CHINESE_TEXT --task t2st --src_lang cmn --tgt_lang eng --output_path eng.wav
```
```
The Netherlands issued an announcement titled "Announcing Imminent Export Control Measures for Advanced Semiconductor Manufacturing Equipment" stating that, given the technological development and geopolitical context, the government has concluded that it is necessary to expand existing export controls for certain semiconductor manufacturing equipment.
```

英文 → 中文
```shell
m4t_predict $ENGLISH_TEXT --task t2st --src_lang eng --tgt_lang cmn --output_path cmn.wav
```
```
荷兰发布了题为 ⁇ 关于先进半导体制造设备即将实施出口管制措施的公告 ⁇ ,该公告指出,鉴于技术发展和地缘政治背景,政府得出结论,有必要扩大现有的特定半导体制造设备出口管制 ⁇ 
```

### T2TT: Text-to-text translation

中文 → 英文
```shell
m4t_predict $CHINESE_TEXT --task t2tt --src_lang cmn --tgt_lang eng
```
```
The Netherlands issued an announcement titled "Announcing Imminent Export Control Measures for Advanced Semiconductor Manufacturing Equipment" stating that, given the technological development and geopolitical context, the government has concluded that it is necessary to expand existing export controls for certain semiconductor manufacturing equipment.
```

中文 → 法语
```shell
m4t_predict $CHINESE_TEXT --task t2tt --src_lang cmn --tgt_lang fra
```
```
Les Pays-Bas ont publié un thème pour  ⁇  annoncer les prochaines mesures de contrôle des exportations prises sur des équipements de fabrication de semi-conducteurs  ⁇  l'annonce indique que, compte tenu du développement technologique et du contexte géopolitique, le gouvernement a conclu qu'il est nécessaire d'étendre les exportations existantes de certains équipements de fabrication de semi-conducteurs  ⁇
```

英文 → 中文
```shell
m4t_predict $ENGLISH_TEXT --task t2tt --src_lang eng --tgt_lang cmn
```
```
荷兰发布了题为 ⁇ 关于先进半导体制造设备即将实施出口管制措施的公告 ⁇ ,该公告指出,鉴于技术发展和地缘政治背景,政府得出结论,有必要扩大现有的特定半导体制造设备出口管制 ⁇
```

### ASR: Automatic speech recognition

中文 → 中文
```shell
m4t_predict chinese.wav --task asr --tgt_lang cmn
```
```
荷兰发布了一份主题为 宣布即将对先进半导体制造设备采取的出口管制措施 的公告 表示 鉴于技术的发展和地缘政治的背景 政府已经得出结论 有必要扩大现有的特定半导体制造设备的出口管制
```

中文 → 英文
```shell
m4t_predict chinese.wav --task asr --tgt_lang eng
```
```
The announcement, titled "Announcing Imminent Export Control Measures for Advanced Semiconductor Manufacturing Equipment", said that given the development of technology and geopolitics, the government has concluded that it is necessary to expand export controls on existing specific semiconductor manufacturing equipment.
```

英文 → 英文
```shell
m4t_predict english.wav --task asr --tgt_lang eng
```
```
The announcement, titled "Announcing Important Export Control Measures for Advanced Semiconductor Manufacturing Equipment", said that given the development of technology and geopolitics, the government has decided that it is necessary to expand export controls on specific semiconductor manufacturing equipment.
```

## SeamlessM4T Web UI

安装依赖 `gradio`

```shell
pip install gradio                                                                          
```

设置环境变量

```shell
conda env config vars set CHECKPOINTS_PATH=/Users/junjian/GitHub/facebookresearch/seamless_communication/seamless-m4t-v2-large
```

运行应用

```shell
python demo/m4tv2/app.py
```

![](/images/2023/seamless-m4t/SeamlessM4T-WebUI.png)


## 参考资料
- [Meta AI发布SeamlessM4T模型，近100种多语种多模态语音识别，已开源](https://hub.baai.ac.cn/view/29132)
- [facebook/seamless-m4t-v2-large](https://huggingface.co/facebook/seamless-m4t-v2-large)
- [Bringing the world closer together with a foundational multimodal model for speech translation](https://ai.meta.com/blog/seamless-m4t/)
- [HuggingFace SeamlessM4T-v2](https://huggingface.co/docs/transformers/main/en/model_doc/seamless_m4t_v2)
- [Setting Up Meta AI’s SeamlessM4T — Massively Multilingual & Multimodal Machine Translation Model](https://brandolosaria.medium.com/setting-up-meta-ais-seamlessm4t-massively-multilingual-multimodal-machine-translation-model-5d2904956761)
- [SeamlessM4T—Massively Multilingual & Multimodal Machine Translation](https://ai.meta.com/research/publications/seamlessm4t-massively-multilingual-multimodal-machine-translation/)
- [Meta Seamless 2: Working examples](https://www.kaggle.com/code/vmvmvmvm/meta-seamless-2-working-examples)
- [microsoft/SpeechT5](https://github.com/microsoft/SpeechT5)
- [coqui-ai/TTS](https://github.com/coqui-ai/TTS)
- [Sambert语音合成模型训练教程](https://modelscope.cn/docs/sambert)
- [Sambert-Hifigan模型介绍](https://modelscope.cn/models/damo/speech_sambert-hifigan_tts_zh-cn_16k/summary)


[seamless_communication]: https://github.com/facebookresearch/seamless_communication
