---
layout: post
title:  "在 MacBook Pro M2 Max 上测试 Whisper"
date:   2023-03-11 08:00:00 +0800
categories: Whisper
tags: [ffmpeg, MacBookProM2Max]
---

## 准备音频文件
### macOS 上打开 QuickTimePlayer
1. [文件] -> [新建音频录制]
2. 录制
3. 朗读：荷兰发布了一份主题为“宣布即将对先进半导体制造设备采取的出口管制措施”的公告表示，鉴于技术的发展和地缘政治的背景，政府已经得出结论，有必要扩大现有的特定半导体制造设备的出口管制。
4. 停止
5. 保存(test.m4a)

* [荷兰限制部分型号光刻机出口 中国市场影响几何](https://www.163.com/dy/article/HVFHDTT905199DKK.html)

### m4a 转换 wav
```shell
ffmpeg -i test.m4a -ar 16000 -ac 1 -c:a pcm_s16le test.wav
```


## [OpenAI Whisper](https://github.com/openai/whisper)

### 创建虚拟环境
```shell
conda create --name whisper python
conda activate whisper
```

### 安装
```shell
pip install --upgrade --no-deps --force-reinstall git+https://github.com/openai/whisper.git

wget https://raw.githubusercontent.com/openai/whisper/main/requirements.txt
pip install -r requirements.txt
```

### 测试
模型默认保存在 ```~/.cache/whisper```
```shell
ls ~/.cache/whisper
base.pt     large-v2.pt medium.pt   small.pt    tiny.pt
```

转录(X->X)
```shell
whisper test.wav --model small
```

翻译(X->English)
```shell
whisper test.wav --model small --task translate
```

### 测试不同模型的使用情况
测试脚本
```shell
for type in 'tiny' 'base' 'small' 'medium' 'large'
do
    echo '>> ' $type
    time whisper --language zh --model $type test.wav
    print
done
```

使用 time 命令测试使用资源详情和度量

| model  | user(s) | system(s) | cpu   | total(s) | 内存 |
| :----: | ------: | --------: | ----: | -------: | ---: |
| tiny   |    7.13 |      6.01 |  358% |    3.664 | 370M |
| base   |   12.21 |     10.29 |  362% |    6.211 | 430M |
| small  |   39.15 |     23.90 |  380% |   16.569 | 1.2G |
| medium |  117.27 |     68.43 |  377% |   49.172 | 3.2G |
| large  |  184.13 |    114.85 |  361% |  1:22.73 | 6.3G |

* tiny
```
[00:00.000 --> 00:04.000] 荷蘭发布了一份主题为
[00:04.000 --> 00:09.500] 宣布即将对先进半道体知道设备采取的
[00:09.500 --> 00:13.000] 出口管制措施的公告表示
[00:13.000 --> 00:17.000] 坚于技术的发展和地缘政治的背景
[00:17.000 --> 00:20.000] 政府已经得出结论
[00:20.000 --> 00:24.000] 有必要扩大现有的特定半道体
[00:24.000 --> 00:27.000] 知道设备的出口管制
```

* base
```
[00:00.000 --> 00:12.800] 格蘭發布了一份主題為宣布即將對先進半導體製造設備採取的出口管制措施的公告表示
[00:12.800 --> 00:17.140] 監獄技術的發展和地緣政治的背景
[00:17.140 --> 00:26.880] 政府已經得出結論有必要擴大現有的特定半導體製造設備的出口管制
```

* small
```
[00:00.000 --> 00:13.000] 格兰发布了一份主题为,宣布即将对先进半导体制造设备采取的出口管制措施的公告表示,
[00:13.000 --> 00:27.000] 监狱技术的发展和地缘政治的背景,政府已经得出结论有必要扩大现有的特定半导体制造设备的出口管制。
```

* medium
```
[00:00.000 --> 00:03.840] 格兰发布了一份主题为
[00:03.840 --> 00:08.440] 宣布即将对先进半导体制造设备
[00:08.440 --> 00:12.800] 采取的出口管制措施的公告表示
[00:12.800 --> 00:17.040] 坚于技术的发展和地缘政治的背景
[00:17.040 --> 00:19.840] 政府已经得出结论
[00:19.840 --> 00:24.080] 有必要扩大现有的特定半导体
[00:24.080 --> 00:26.880] 制造设备的出口管制
```

* large
```
[00:00.000 --> 00:04.000] 格兰发布了一份主题为
[00:04.000 --> 00:13.000] 宣布即将对先进半导体制造设备采取的出口管制措施的公告表示
[00:13.000 --> 00:17.000] 鉴于技术的发展和地缘政治的背景
[00:17.000 --> 00:20.000] 政府已经得出结论
[00:20.000 --> 00:27.000] 有必要扩大现有的特定半导体制造设备的出口管制
```


## [whisper.cpp](https://github.com/ggerganov/whisper.cpp)

### 克隆
```shell
git clone https://github.com/ggerganov/whisper.cpp
```

### 编译
```shell
cd whisper.cpp
make
```

### 下载模型
```shell
bash ./models/download-ggml-model.sh base.en
bash ./models/download-ggml-model.sh tiny
bash ./models/download-ggml-model.sh base
bash ./models/download-ggml-model.sh small
bash ./models/download-ggml-model.sh medium
bash ./models/download-ggml-model.sh large
```

### 测试
```shell
./main -f samples/jfk.wav
```
```
whisper_init_from_file_no_state: loading model from 'models/ggml-base.en.bin'
whisper_model_load: loading model
whisper_model_load: n_vocab       = 51864
whisper_model_load: n_audio_ctx   = 1500
whisper_model_load: n_audio_state = 512
whisper_model_load: n_audio_head  = 8
whisper_model_load: n_audio_layer = 6
whisper_model_load: n_text_ctx    = 448
whisper_model_load: n_text_state  = 512
whisper_model_load: n_text_head   = 8
whisper_model_load: n_text_layer  = 6
whisper_model_load: n_mels        = 80
whisper_model_load: f16           = 1
whisper_model_load: type          = 2
whisper_model_load: mem required  =  215.00 MB (+    6.00 MB per decoder)
whisper_model_load: adding 1607 extra tokens
whisper_model_load: model ctx     =  140.60 MB
whisper_model_load: model size    =  140.54 MB
whisper_init_state: kv self size  =    5.25 MB
whisper_init_state: kv cross size =   17.58 MB

system_info: n_threads = 4 / 12 | AVX = 0 | AVX2 = 0 | AVX512 = 0 | FMA = 0 | NEON = 1 | ARM_FMA = 1 | F16C = 0 | FP16_VA = 1 | WASM_SIMD = 0 | BLAS = 1 | SSE3 = 0 | VSX = 0 | 

main: processing 'samples/jfk.wav' (176000 samples, 11.0 sec), 4 threads, 1 processors, lang = en, task = transcribe, timestamps = 1 ...


[00:00:00.000 --> 00:00:11.000]   And so my fellow Americans, ask not what your country can do for you, ask what you can do for your country.


whisper_print_timings:     load time =    64.96 ms
whisper_print_timings:     fallbacks =   0 p /   0 h
whisper_print_timings:      mel time =    14.07 ms
whisper_print_timings:   sample time =    10.42 ms /    27 runs (    0.39 ms per run)
whisper_print_timings:   encode time =   217.08 ms /     1 runs (  217.08 ms per run)
whisper_print_timings:   decode time =    62.48 ms /    27 runs (    2.31 ms per run)
whisper_print_timings:    total time =   378.26 ms
```

### 测试不同模型的使用情况
测试脚本
```shell
for type in 'tiny' 'base' 'small' 'medium' 'large'
do
    echo '>> ' $type
    time ./main -m models/ggml-$type.bin -f test.wav -l auto
    print
done
```

使用 time 命令测试使用资源详情和度量

| model  | user(s) | system(s) | cpu   | total(s) | 内存 |
| :----: | ------: | --------: | ----: | -------: | ---: |
| tiny   |    1.67 |      0.05 |  334% |    0.514 | 130M |
| base   |    2.93 |      0.08 |  355% |    0.848 | 220M |
| small  |    9.16 |      0.20 |  377% |    2.475 | 620M |
| medium |   23.74 |      0.60 |  381% |    6.383 | 1.8G |
| large  |   43.18 |      1.07 |  384% |   11.512 | 3.4G |

* tiny
```
[00:00:00.000 --> 00:00:12.760]  荷蘭發布了一份主題為宣布即將對先進半導體知道社會採取的出口管制措施的公告表示
[00:00:12.760 --> 00:00:17.080]  間於技術的發展和地緣政治的背景
[00:00:17.080 --> 00:00:24.120]  政府已經得出結論有必要擴大現有的特定半導體
[00:00:24.120 --> 00:00:26.760]  知道社會的出口管制
```

* base
```
[00:00:00.000 --> 00:00:12.800]  隔然发布了一份主题为宣布即将对先进半导体制到设备采取的出口管制措施的公告表示
[00:00:12.800 --> 00:00:17.140]  监与技术的发展和地缘政治的背景
[00:00:17.140 --> 00:00:26.880]  政府已经得出结论有必要扩大现有的特定半导体制到设备的出口管制
```

* small
```
[00:00:00.000 --> 00:00:12.360]  荷兰发布了一份主题为,宣布即将对先进半导体制造设备采取的出口管制措施的公告表示,
[00:00:12.360 --> 00:00:26.560]  监狱技术的发展和地缘政治的背景,政府已经得出结论有必要扩大现有的特定半导体制造设备的出口管制。
```

* medium
```
[00:00:00.000 --> 00:00:03.760]  格兰发布了一份主题为
[00:00:03.760 --> 00:00:08.440]  宣布即将对先进半导体制造设备
[00:00:08.440 --> 00:00:12.680]  采取的出口管制措施的公告表示
[00:00:12.680 --> 00:00:16.920]  兼于技术的发展和地缘政治的背景
[00:00:16.920 --> 00:00:19.720]  政府已经得出结论
[00:00:19.720 --> 00:00:26.600]  有必要扩大现有的特定半导体制造设备的出口管制
```

* large
```
[00:00:00.000 --> 00:00:04.000]  格兰发布了一份主题为
[00:00:04.000 --> 00:00:13.000]  宣布即将对先进半导体制造设备采取的出口管制措施的公告表示
[00:00:13.000 --> 00:00:17.000]  鉴于技术的发展和地缘政治的背景
[00:00:17.000 --> 00:00:20.000]  政府已经得出结论
[00:00:20.000 --> 00:00:27.000]  有必要扩大现有的特定半导体制造设备的出口管制
```


## OpenAI Whisper & Whisper.cpp

| model  | OpenAI Whisper Total(s) | Whisper.cpp Total(s) | 🚀(x) | OpenAI Whisper Memory | Whisper.cpp Memory | 🚀(x) | 
| :----: | ----------------------: | -------------------: | ----: | --------------------: | -----------------: | ---: | 
| tiny   |                   3.664 |                0.514 |   6.1 |                  370M |               130M |  1.8 |
| base   |                   6.211 |                0.848 |   6.3 |                  430M |               220M |  1.0 |
| small  |                  16.569 |                2.475 |   5.7 |                  1.2G |               620M |  0.9 |
| medium |                  49.172 |                6.383 |   6.7 |                  3.2G |               1.8G |  0.8 |
| large  |                 1:22.73 |               11.512 |   6.2 |                  6.3G |               3.4G |  0.9 |


## 参考资料
* [openai/whisper](https://github.com/openai/whisper)
* [ggerganov/whisper.cpp](https://github.com/ggerganov/whisper.cpp)
* [How to convert any mp3 file to .wav 16khz mono 16bit](https://stackoverflow.com/questions/13358287/how-to-convert-any-mp3-file-to-wav-16khz-mono-16bit)
* [I think I can make 4-bit LLaMA-65B inference run on a 64 GB M1 Pro](https://twitter.com/ggerganov/status/1632422491682484230)
* [Fine-Tune Whisper For Multilingual ASR with 🤗 Transformers](https://huggingface.co/blog/fine-tune-whisper)
