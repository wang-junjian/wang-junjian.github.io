---
layout: post
title:  "whisper.cpp"
date:   2023-12-26 08:00:00 +0800
categories: Whisper
tags: [Whisper, NEON, MPS, CoreML, MacBookProM2Max]
---

## NEON & MPS 🆚 CoreML
### 下载模型（large-v3）
```shell
models/download-ggml-model.sh large-v3
```

### NEON & MPS
#### 编译
```shell
make clean
make -j
```

#### main 帮助
```shell
./main --help
```
```

usage: ./main [options] file0.wav file1.wav ...

options:
  -h,        --help              [default] show this help message and exit
  -t N,      --threads N         [4      ] number of threads to use during computation
  -p N,      --processors N      [1      ] number of processors to use during computation
  -ot N,     --offset-t N        [0      ] time offset in milliseconds
  -on N,     --offset-n N        [0      ] segment index offset
  -d  N,     --duration N        [0      ] duration of audio to process in milliseconds
  -mc N,     --max-context N     [-1     ] maximum number of text context tokens to store
  -ml N,     --max-len N         [0      ] maximum segment length in characters
  -sow,      --split-on-word     [false  ] split on word rather than on token
  -bo N,     --best-of N         [5      ] number of best candidates to keep
  -bs N,     --beam-size N       [5      ] beam size for beam search
  -wt N,     --word-thold N      [0.01   ] word timestamp probability threshold
  -et N,     --entropy-thold N   [2.40   ] entropy threshold for decoder fail
  -lpt N,    --logprob-thold N   [-1.00  ] log probability threshold for decoder fail
  -debug,    --debug-mode        [false  ] enable debug mode (eg. dump log_mel)
  -tr,       --translate         [false  ] translate from source language to english
  -di,       --diarize           [false  ] stereo audio diarization
  -tdrz,     --tinydiarize       [false  ] enable tinydiarize (requires a tdrz model)
  -nf,       --no-fallback       [false  ] do not use temperature fallback while decoding
  -otxt,     --output-txt        [false  ] output result in a text file
  -ovtt,     --output-vtt        [false  ] output result in a vtt file
  -osrt,     --output-srt        [false  ] output result in a srt file
  -olrc,     --output-lrc        [false  ] output result in a lrc file
  -owts,     --output-words      [false  ] output script for generating karaoke video
  -fp,       --font-path         [/System/Library/Fonts/Supplemental/Courier New Bold.ttf] path to a monospace font for karaoke video
  -ocsv,     --output-csv        [false  ] output result in a CSV file
  -oj,       --output-json       [false  ] output result in a JSON file
  -ojf,      --output-json-full  [false  ] include more information in the JSON file
  -of FNAME, --output-file FNAME [       ] output file path (without file extension)
  -ps,       --print-special     [false  ] print special tokens
  -pc,       --print-colors      [false  ] print colors
  -pp,       --print-progress    [false  ] print progress
  -nt,       --no-timestamps     [false  ] do not print timestamps
  -l LANG,   --language LANG     [en     ] spoken language ('auto' for auto-detect)
  -dl,       --detect-language   [false  ] exit after automatically detecting language
             --prompt PROMPT     [       ] initial prompt
  -m FNAME,  --model FNAME       [models/ggml-base.en.bin] model path
  -f FNAME,  --file FNAME        [       ] input WAV file path
  -oved D,   --ov-e-device DNAME [CPU    ] the OpenVINO device used for encode inference
  -ls,       --log-score         [false  ] log best decoder scores of tokens
  -ng,       --no-gpu            [false  ] disable GPU
```


#### 语音识别
```shell
time ./main -m models/ggml-large-v3.bin -f test.wav -l auto
```
```
whisper_init_from_file_with_params_no_state: loading model from 'models/ggml-large-v3.bin'
whisper_model_load: loading model
whisper_model_load: n_vocab       = 51866
whisper_model_load: n_audio_ctx   = 1500
whisper_model_load: n_audio_state = 1280
whisper_model_load: n_audio_head  = 20
whisper_model_load: n_audio_layer = 32
whisper_model_load: n_text_ctx    = 448
whisper_model_load: n_text_state  = 1280
whisper_model_load: n_text_head   = 20
whisper_model_load: n_text_layer  = 32
whisper_model_load: n_mels        = 128
whisper_model_load: ftype         = 1
whisper_model_load: qntvr         = 0
whisper_model_load: type          = 5 (large v3)
whisper_model_load: adding 1609 extra tokens
whisper_model_load: n_langs       = 100
whisper_backend_init: using Metal backend
ggml_metal_init: allocating
ggml_metal_init: found device: Apple M2 Max
ggml_metal_init: picking default device: Apple M2 Max
ggml_metal_init: default.metallib not found, loading from source
ggml_metal_init: loading '/Users/junjian/GitHub/ggerganov/whisper.cpp/ggml-metal.metal'
ggml_metal_init: GPU name:   Apple M2 Max
ggml_metal_init: GPU family: MTLGPUFamilyApple8 (1008)
ggml_metal_init: hasUnifiedMemory              = true
ggml_metal_init: recommendedMaxWorkingSetSize  = 51539.61 MB
ggml_metal_init: maxTransferRate               = built-in GPU
ggml_metal_add_buffer: allocated 'backend         ' buffer, size =  3117.88 MB, ( 3118.53 / 51539.61)
whisper_model_load:    Metal buffer size =  3117.87 MB
whisper_model_load: model size    = 3117.39 MB
whisper_backend_init: using Metal backend
ggml_metal_init: allocating
ggml_metal_init: found device: Apple M2 Max
ggml_metal_init: picking default device: Apple M2 Max
ggml_metal_init: default.metallib not found, loading from source
ggml_metal_init: loading '/Users/junjian/GitHub/ggerganov/whisper.cpp/ggml-metal.metal'
ggml_metal_init: GPU name:   Apple M2 Max
ggml_metal_init: GPU family: MTLGPUFamilyApple8 (1008)
ggml_metal_init: hasUnifiedMemory              = true
ggml_metal_init: recommendedMaxWorkingSetSize  = 51539.61 MB
ggml_metal_init: maxTransferRate               = built-in GPU
ggml_metal_add_buffer: allocated 'backend         ' buffer, size =   220.20 MB, ( 3338.73 / 51539.61)
whisper_init_state: kv self size  =  220.20 MB
ggml_metal_add_buffer: allocated 'backend         ' buffer, size =   245.76 MB, ( 3584.49 / 51539.61)
whisper_init_state: kv cross size =  245.76 MB
ggml_metal_add_buffer: allocated 'backend         ' buffer, size =     0.02 MB, ( 3584.51 / 51539.61)
whisper_init_state: compute buffer (conv)   =   32.36 MB
ggml_metal_add_buffer: allocated 'backend         ' buffer, size =     0.02 MB, ( 3584.52 / 51539.61)
whisper_init_state: compute buffer (encode) =  212.36 MB
ggml_metal_add_buffer: allocated 'backend         ' buffer, size =     0.02 MB, ( 3584.54 / 51539.61)
whisper_init_state: compute buffer (cross)  =    9.32 MB
ggml_metal_add_buffer: allocated 'backend         ' buffer, size =     0.02 MB, ( 3584.56 / 51539.61)
whisper_init_state: compute buffer (decode) =   99.17 MB
ggml_metal_add_buffer: allocated 'backend         ' buffer, size =    30.72 MB, ( 3615.28 / 51539.61)
ggml_metal_add_buffer: allocated 'backend         ' buffer, size =   210.73 MB, ( 3826.01 / 51539.61)
ggml_metal_add_buffer: allocated 'backend         ' buffer, size =     7.68 MB, ( 3833.69 / 51539.61)
ggml_metal_add_buffer: allocated 'backend         ' buffer, size =    97.53 MB, ( 3931.23 / 51539.61)

system_info: n_threads = 4 / 12 | AVX = 0 | AVX2 = 0 | AVX512 = 0 | FMA = 0 | NEON = 1 | ARM_FMA = 1 | METAL = 1 | F16C = 0 | FP16_VA = 1 | WASM_SIMD = 0 | BLAS = 1 | SSE3 = 0 | SSSE3 = 0 | VSX = 0 | CUDA = 0 | COREML = 0 | OPENVINO = 0 | 

main: processing 'test.wav' (6939648 samples, 433.7 sec), 4 threads, 1 processors, 5 beams + best of 5, lang = auto, task = transcribe, timestamps = 1 ...

whisper_full_with_state: auto-detected language: zh (p = 0.916022)

[00:00:00.000 --> 00:00:12.760]  三的前面的一个数字
[00:00:12.760 --> 00:00:21.520]  九的后面的一个数字
[00:00:21.520 --> 00:00:28.480]  八的前面的三个数字
[00:00:28.480 --> 00:00:34.940]  八的后面三个数字
[00:00:34.940 --> 00:00:46.080]  长方形 正方形 正方形 圆柱球
[00:00:46.080 --> 00:00:53.440]  同左边数D
[00:00:53.440 --> 00:00:57.340]  是D
[00:00:57.340 --> 00:01:05.080]  同左 同右边数
[00:01:05.080 --> 00:01:08.020]  是D几个
[00:01:08.020 --> 00:01:22.080]  有个 然后这个数
[00:01:22.080 --> 00:01:24.840]  这什么字啊 答案都不清楚
[00:01:24.840 --> 00:01:25.840]  最
[00:01:25.840 --> 00:01:27.080]  最多
[00:01:27.080 --> 00:01:34.820]  最多
[00:01:34.820 --> 00:01:40.820]  一共有几个减法
[00:01:40.820 --> 00:01:45.620]  还剩几个用
[00:01:45.620 --> 00:01:49.620]  用
[00:01:49.620 --> 00:01:55.620]  加法 减法
[00:01:55.620 --> 00:01:56.820]  一个
[00:01:56.820 --> 00:01:59.080]  三个数
[00:01:59.080 --> 00:02:02.180]  个位上是五
[00:02:02.180 --> 00:02:05.220]  十位上是一
[00:02:05.220 --> 00:02:12.620]  这个数是十个十
[00:02:12.620 --> 00:02:18.880]  和四个一合起来
[00:02:18.880 --> 00:02:26.560]  是一个十和九个一合起来
[00:02:26.560 --> 00:02:48.320]  是一个十六里面有个十和一个一二十里面有个十
[00:02:48.320 --> 00:02:56.300]  二十五和十几中间的数是
[00:02:56.300 --> 00:03:06.400]  和九相邻的两个数是
[00:03:06.400 --> 00:03:14.560]  比六比十六多一的数是
[00:03:14.560 --> 00:03:19.560]  比十六少三的数是
[00:03:19.560 --> 00:03:20.100]  比十六少三的数是
[00:03:20.100 --> 00:03:20.660]  比十六少三的数是
[00:03:20.660 --> 00:03:21.660]  比十六少三的数是
[00:03:21.660 --> 00:03:22.660]  比十六少三的数是
[00:03:22.660 --> 00:03:24.040]  比十六少三的数是
[00:03:24.040 --> 00:03:26.040]  比十六少三的数是
[00:03:26.040 --> 00:03:26.780]  比十六少三的数是
[00:03:26.780 --> 00:03:29.100]  被减数
[00:03:29.100 --> 00:03:31.500]  二是十一
[00:03:31.500 --> 00:03:34.280]  减数是三
[00:03:34.280 --> 00:03:39.380]  差是五
[00:03:39.380 --> 00:03:43.900]  最大的疑问数是
[00:03:43.900 --> 00:03:52.280]  最小的两位数是
[00:03:52.280 --> 00:03:55.780]  九
[00:03:55.780 --> 00:04:05.640]  十九这个数在位置
[00:04:05.640 --> 00:04:07.980]  漂亮的字我看
[00:04:07.980 --> 00:04:19.580]  表表快点就片不是吗
[00:04:19.580 --> 00:04:22.820]  表是
[00:04:22.820 --> 00:04:27.040]  个在位
[00:04:27.040 --> 00:04:32.040]  表示个
[00:04:32.040 --> 00:04:36.280]  这个
[00:04:36.280 --> 00:04:38.340]  算
[00:04:38.340 --> 00:04:44.680]  是中间数是和
[00:04:44.680 --> 00:04:47.740]  和是
[00:04:47.740 --> 00:04:49.320]  这个
[00:04:49.320 --> 00:04:57.760]  算是中
[00:04:57.760 --> 00:05:01.160]  被减数是
[00:05:01.160 --> 00:05:06.160]  减数是差是
[00:05:06.160 --> 00:05:12.880]  一个加数是十二
[00:05:12.880 --> 00:05:19.060]  一个加数是六
[00:05:19.060 --> 00:05:21.100]  和是十二
[00:05:21.100 --> 00:05:27.260]  被减数是十五
[00:05:27.260 --> 00:05:34.900]  减数是十三差是十五
[00:05:34.900 --> 00:05:48.800]  一个数从右边起第一位是位第二
[00:05:48.800 --> 00:06:03.140]  一个数是十二加数是十三里面有个十和个一
[00:06:03.140 --> 00:06:11.840]  一个数是十二加数是十二加数是十三里面有个十和个一
[00:06:11.840 --> 00:06:22.580]  和十二相邻的两个数是
[00:06:22.580 --> 00:06:34.880]  个三个一和一个十合起来是
[00:06:34.880 --> 00:06:41.580]  再过两小对
[00:06:41.580 --> 00:06:55.920]  一个数是十二加数是十三里面有个十和个一
[00:06:55.920 --> 00:07:00.780]  一个数是十二加数是十三里面有个十和个一
[00:07:00.780 --> 00:07:05.380]  一个数是十二加数是十三里面有个十和个一
[00:07:05.380 --> 00:07:11.320]  一个数是十二加数是十三里面有个十和个一
[00:07:11.320 --> 00:07:13.320]  謝謝


whisper_print_timings:     load time =  1007.19 ms
whisper_print_timings:     fallbacks =   5 p /   4 h
whisper_print_timings:      mel time =   216.87 ms
whisper_print_timings:   sample time =  3550.35 ms / 12205 runs (    0.29 ms per run)
whisper_print_timings:   encode time =  7821.69 ms /    17 runs (  460.10 ms per run)
whisper_print_timings:   decode time =  2958.22 ms /   198 runs (   14.94 ms per run)
whisper_print_timings:   batchd time = 88241.95 ms / 11913 runs (    7.41 ms per run)
whisper_print_timings:   prompt time =  1618.32 ms /  3783 runs (    0.43 ms per run)
whisper_print_timings:    total time = 105432.62 ms
ggml_metal_free: deallocating
ggml_metal_free: deallocating
./main -m models/ggml-large-v3.bin -f test.wav -l auto  11.65s user 1.89s system 12% cpu 1:45.50 total
```

### CoreML
#### 安装依赖
```shell
pip install openai-whisper coremltools ane-transformers
```

#### 生成 CoreML 模型
```shell
models/generate-coreml-model.sh large-v3
```
```
ModelDimensions(n_mels=128, n_audio_ctx=1500, n_audio_state=1280, n_audio_head=20, n_audio_layer=32, n_vocab=51866, n_text_ctx=448, n_text_state=1280, n_text_head=20, n_text_layer=32)
/Users/junjian/GitHub/ggerganov/whisper.cpp/env/lib/python3.10/site-packages/whisper/model.py:166: TracerWarning: Converting a tensor to a Python boolean might cause the trace to be incorrect. We can't record the data flow of Python values, so this value will be treated as a constant in the future. This means that the trace might not generalize to other inputs!
  assert x.shape[1:] == self.positional_embedding.shape, "incorrect audio shape"
/Users/junjian/GitHub/ggerganov/whisper.cpp/env/lib/python3.10/site-packages/whisper/model.py:97: UserWarning: __floordiv__ is deprecated, and its behavior will change in a future version of pytorch. It currently rounds toward 0 (like the 'trunc' function NOT 'floor'). This results in incorrect rounding for negative values. To keep the current behavior, use torch.div(a, b, rounding_mode='trunc'), or for actual floor division, use torch.div(a, b, rounding_mode='floor').
  scale = (n_state // self.n_head) ** -0.25
Converting PyTorch Frontend ==> MIL Ops: 100%|███████████████████████████████████████████████████████████████████████▉| 2611/2612 [00:00<00:00, 4137.49 ops/s]
Running MIL frontend_pytorch pipeline: 100%|███████████████████████████████████████████████████████████████████████████████| 5/5 [00:00<00:00, 34.67 passes/s]
Running MIL default pipeline: 100%|██████████████████████████████████████████████████████████████████████████████████████| 71/71 [00:15<00:00,  4.46 passes/s]
Running MIL backend_mlprogram pipeline: 100%|███████████████████████████████████████████████████████████████████████████| 12/12 [00:00<00:00, 331.10 passes/s]
done converting
/Users/junjian/GitHub/ggerganov/whisper.cpp/models/coreml-encoder-large-v3.mlmodelc/coremldata.bin
models/coreml-encoder-large-v3.mlmodelc -> models/ggml-large-v3-encoder.mlmodelc
```

#### 编译
```shell
make clean
WHISPER_COREML=1 make -j
```

#### 语音识别
```shell
time ./main -m models/ggml-large-v3.bin -f test.wav -l auto 
```
```
whisper_init_from_file_with_params_no_state: loading model from 'models/ggml-large-v3.bin'
whisper_model_load: loading model
whisper_model_load: n_vocab       = 51866
whisper_model_load: n_audio_ctx   = 1500
whisper_model_load: n_audio_state = 1280
whisper_model_load: n_audio_head  = 20
whisper_model_load: n_audio_layer = 32
whisper_model_load: n_text_ctx    = 448
whisper_model_load: n_text_state  = 1280
whisper_model_load: n_text_head   = 20
whisper_model_load: n_text_layer  = 32
whisper_model_load: n_mels        = 128
whisper_model_load: ftype         = 1
whisper_model_load: qntvr         = 0
whisper_model_load: type          = 5 (large v3)
whisper_model_load: adding 1609 extra tokens
whisper_model_load: n_langs       = 100
whisper_backend_init: using Metal backend
ggml_metal_init: allocating
ggml_metal_init: found device: Apple M2 Max
ggml_metal_init: picking default device: Apple M2 Max
ggml_metal_init: default.metallib not found, loading from source
ggml_metal_init: loading '/Users/junjian/GitHub/ggerganov/whisper.cpp/ggml-metal.metal'
ggml_metal_init: GPU name:   Apple M2 Max
ggml_metal_init: GPU family: MTLGPUFamilyApple8 (1008)
ggml_metal_init: hasUnifiedMemory              = true
ggml_metal_init: recommendedMaxWorkingSetSize  = 51539.61 MB
ggml_metal_init: maxTransferRate               = built-in GPU
ggml_metal_add_buffer: allocated 'backend         ' buffer, size =  3117.88 MB, ( 3118.53 / 51539.61)
whisper_model_load:    Metal buffer size =  3117.87 MB
whisper_model_load: model size    = 3117.39 MB
whisper_backend_init: using Metal backend
ggml_metal_init: allocating
ggml_metal_init: found device: Apple M2 Max
ggml_metal_init: picking default device: Apple M2 Max
ggml_metal_init: default.metallib not found, loading from source
ggml_metal_init: loading '/Users/junjian/GitHub/ggerganov/whisper.cpp/ggml-metal.metal'
ggml_metal_init: GPU name:   Apple M2 Max
ggml_metal_init: GPU family: MTLGPUFamilyApple8 (1008)
ggml_metal_init: hasUnifiedMemory              = true
ggml_metal_init: recommendedMaxWorkingSetSize  = 51539.61 MB
ggml_metal_init: maxTransferRate               = built-in GPU
ggml_metal_add_buffer: allocated 'backend         ' buffer, size =   220.20 MB, ( 3338.73 / 51539.61)
whisper_init_state: kv self size  =  220.20 MB
ggml_metal_add_buffer: allocated 'backend         ' buffer, size =   245.76 MB, ( 3584.49 / 51539.61)
whisper_init_state: kv cross size =  245.76 MB
whisper_init_state: loading Core ML model from 'models/ggml-large-v3-encoder.mlmodelc'
whisper_init_state: first run on a device may take a while ...
whisper_init_state: Core ML model loaded
ggml_metal_add_buffer: allocated 'backend         ' buffer, size =     0.02 MB, ( 3584.51 / 51539.61)
whisper_init_state: compute buffer (conv)   =   10.85 MB
ggml_metal_add_buffer: allocated 'backend         ' buffer, size =     0.02 MB, ( 3584.52 / 51539.61)
whisper_init_state: compute buffer (cross)  =    9.32 MB
ggml_metal_add_buffer: allocated 'backend         ' buffer, size =     0.02 MB, ( 3584.54 / 51539.61)
whisper_init_state: compute buffer (decode) =   99.17 MB
ggml_metal_add_buffer: allocated 'backend         ' buffer, size =     9.22 MB, ( 3593.76 / 51539.61)
ggml_metal_add_buffer: allocated 'backend         ' buffer, size =     7.68 MB, ( 3601.45 / 51539.61)
ggml_metal_add_buffer: allocated 'backend         ' buffer, size =    97.53 MB, ( 3698.98 / 51539.61)

system_info: n_threads = 4 / 12 | AVX = 0 | AVX2 = 0 | AVX512 = 0 | FMA = 0 | NEON = 1 | ARM_FMA = 1 | METAL = 1 | F16C = 0 | FP16_VA = 1 | WASM_SIMD = 0 | BLAS = 1 | SSE3 = 0 | SSSE3 = 0 | VSX = 0 | CUDA = 0 | COREML = 1 | OPENVINO = 0 | 

main: processing 'test.wav' (6939648 samples, 433.7 sec), 4 threads, 1 processors, 5 beams + best of 5, lang = auto, task = transcribe, timestamps = 1 ...

whisper_full_with_state: auto-detected language: zh (p = 0.916203)

[00:00:00.000 --> 00:00:12.760]  三的前面的一个数字
[00:00:12.760 --> 00:00:21.520]  九的后面的一个数字
[00:00:21.520 --> 00:00:28.480]  八的前面的三个数字
[00:00:28.480 --> 00:00:34.940]  八的后面三个数字
[00:00:34.940 --> 00:00:43.720]  长方形正方形
[00:00:43.720 --> 00:00:46.080]  圆柱球
[00:00:46.080 --> 00:00:53.740]  同左边数地
[00:00:53.740 --> 00:00:57.500]  是地
[00:00:57.500 --> 00:01:02.880]  同左
[00:01:02.880 --> 00:01:05.120]  同右边数
[00:01:05.120 --> 00:01:06.860]  是地
[00:01:06.860 --> 00:01:08.040]  几个
[00:01:08.040 --> 00:01:17.120]  有个
[00:01:17.120 --> 00:01:18.640]  有个
[00:01:18.640 --> 00:01:20.680]  然后这个
[00:01:20.680 --> 00:01:22.120]  数
[00:01:22.120 --> 00:01:24.840]  这什么字啊答案都不清楚
[00:01:24.840 --> 00:01:25.820]  最
[00:01:25.820 --> 00:01:27.460]  最多
[00:01:27.460 --> 00:01:27.480]  最多
[00:01:27.480 --> 00:01:38.520]  一共有几个减法
[00:01:38.520 --> 00:01:42.720]  还剩几个
[00:01:42.720 --> 00:01:44.080]  用
[00:01:44.080 --> 00:01:46.000]  用
[00:01:46.000 --> 00:01:50.960]  加法减法
[00:01:50.960 --> 00:01:51.480]  好
[00:01:51.480 --> 00:01:53.160]  这个
[00:01:53.160 --> 00:01:56.660]  一个
[00:01:56.660 --> 00:01:57.460]  一个
[00:01:57.460 --> 00:01:59.140]  这个数
[00:01:59.140 --> 00:02:02.200]  个位上是五
[00:02:02.200 --> 00:02:05.260]  十位上是一
[00:02:05.260 --> 00:02:08.060]  这个数是
[00:02:08.060 --> 00:02:12.820]  十个十
[00:02:12.820 --> 00:02:21.900]  和四个一合起来是一个
[00:02:21.900 --> 00:02:29.660]  十和九个一合起来是
[00:02:29.660 --> 00:02:33.980]  十六里面有
[00:02:33.980 --> 00:02:35.780]  个
[00:02:35.780 --> 00:02:38.540]  十和
[00:02:38.540 --> 00:02:42.460]  个一二十里面
[00:02:42.460 --> 00:02:44.620]  有
[00:02:44.620 --> 00:02:48.340]  个十
[00:02:48.340 --> 00:02:51.620]  五十五合十一
[00:02:51.620 --> 00:03:05.100]  中间的数是和9相邻的两个数是
[00:03:05.100 --> 00:03:19.280]  比16多1的数是比16少3的数是
[00:03:19.280 --> 00:03:35.280]  被解数是11解数是3差是
[00:03:35.280 --> 00:03:46.880]  最大的疑问数是最小的两位数是
[00:03:46.880 --> 00:03:47.280]  5
[00:03:47.280 --> 00:03:49.260]  最大的疑问数是最小的两位数是
[00:03:49.260 --> 00:03:49.260]  最大的疑问数是最小的两位数是
[00:03:49.260 --> 00:03:49.260]  最大的疑问数是最小的两位数是
[00:03:49.260 --> 00:03:49.260]  最大的疑问数是最小的两位数是
[00:03:49.260 --> 00:03:49.260]  最大的疑问数是最小的两位数是
[00:03:49.260 --> 00:04:19.240]  最大的疑问数是最小的两位数是
[00:04:19.240 --> 00:04:49.220]  最大的疑问数是最小的两位数是
[00:04:49.220 --> 00:05:19.200]  最大的疑问数是最小的两位数是
[00:05:19.200 --> 00:05:49.180]  最大的疑问数是最小的两位数是
[00:05:49.180 --> 00:06:19.160]  最大的疑问数是最小的两位数是
[00:06:19.160 --> 00:06:49.140]  最大的疑问数是最小的两位数是最小的两位数是
[00:06:49.140 --> 00:07:13.760]  最大的疑问数是最小的两位数是最小的两位数是


whisper_print_timings:     load time =   859.73 ms
whisper_print_timings:     fallbacks =   3 p /   1 h
whisper_print_timings:      mel time =   224.71 ms
whisper_print_timings:   sample time =  2659.66 ms /  8154 runs (    0.33 ms per run)
whisper_print_timings:   encode time =  5801.61 ms /    16 runs (  362.60 ms per run)
whisper_print_timings:   decode time =  4105.18 ms /   279 runs (   14.71 ms per run)
whisper_print_timings:   batchd time = 54016.19 ms /  7797 runs (    6.93 ms per run)
whisper_print_timings:   prompt time =  1218.58 ms /  2721 runs (    0.45 ms per run)
whisper_print_timings:    total time = 71318.02 ms
ggml_metal_free: deallocating
ggml_metal_free: deallocating
./main -m models/ggml-large-v3.bin -f test.wav -l auto  8.81s user 2.29s system 15% cpu 1:11.44 total
```

#### 仅编码
感觉和上面的一样，包括效果和速度。

```shell
models/generate-coreml-model.sh large-v3 --encoder-only True
time ./main -m models/ggml-large-v3.bin -f test.wav -l auto 
```

### 总结

|  | Neon & MPS 👍 | CoreML 🚀 (47%) |
| --- | ---: | ---: |
| load time | 1007.19 ms | 859.73 ms |
| mel time | 216.87 ms | 224.71 ms |
| sample time | 3550.35 ms | 2659.66 ms |
| encode time | 7821.69 ms | 5801.61 ms |
| decode time | 2958.22 ms | 4105.18 ms |
| batchd time | 88241.95 ms | 54016.19 ms |
| prompt time | 1618.32 ms | 1218.58 ms |
| total time | 105432.62 ms | 71318.02 ms |
| cpu time | 1:45.50 | 1:11.44 |

**速度提高了，但效果下降了。**

## 性能对比（NEON & MPS）

### 下载模型 [ggerganov/whisper.cpp](https://huggingface.co/ggerganov/whisper.cpp)
```shell
git clone https://huggingface.co/ggerganov/whisper.cpp ggerganov/whisper.cpp
```

### 创建模型链接
编写脚本 `ln-models.sh`

```shell
#!/bin/bash

# 源目录
src_dir="/Users/junjian/HuggingFace/ggerganov/whisper.cpp"

# 目标目录
dst_dir="models"

# 遍历源目录下的所有文件
for src_file in "$src_dir"/*
do
    # 获取文件名
    file_name=$(basename "$src_file")

    # 获取文件扩展名
    extension="${file_name##*.}"

    # 如果文件名不是 README.md 并且文件扩展名不是 zip，则创建软链接
    if [ "$file_name" != "README.md" ] && [ "$extension" != "zip" ]
    then
        ln -s "$src_file" "$dst_dir/$file_name"
    fi
done
```

执行脚本

```
sh ln-models.sh
```

下面的性能测试使用的是一个 `5 分钟`的音频文件 `test.wav`。

### 模型 tiny

```shell
time ./main -f test.wav -l zh -m models/ggml-tiny.bin
```
```
whisper_print_timings:     load time =    73.39 ms
whisper_print_timings:     fallbacks =   0 p /   0 h
whisper_print_timings:      mel time =   132.73 ms
whisper_print_timings:   sample time =  1967.16 ms /  8244 runs (    0.24 ms per run)
whisper_print_timings:   encode time =   259.27 ms /    13 runs (   19.94 ms per run)
whisper_print_timings:   decode time =    69.91 ms /    38 runs (    1.84 ms per run)
whisper_print_timings:   batchd time =  5104.22 ms /  8130 runs (    0.63 ms per run)
whisper_print_timings:   prompt time =    55.85 ms /  2175 runs (    0.03 ms per run)
whisper_print_timings:    total time =  7675.59 ms
./main -f test.wav -l zh -m models/ggml-tiny.bin  5.40s user 0.50s system 76% cpu 7.704 total
```

### 模型 tiny-q5_1

```shell
time ./main -f test.wav -l zh -m models/ggml-tiny-q5_1.bin
```
```
whisper_print_timings:     load time =    68.97 ms
whisper_print_timings:     fallbacks =   1 p /   0 h
whisper_print_timings:      mel time =   134.27 ms
whisper_print_timings:   sample time =  2650.25 ms / 10960 runs (    0.24 ms per run)
whisper_print_timings:   encode time =   232.78 ms /    11 runs (   21.16 ms per run)
whisper_print_timings:   decode time =     7.82 ms /     5 runs (    1.56 ms per run)
whisper_print_timings:   batchd time =  7218.69 ms / 10898 runs (    0.66 ms per run)
whisper_print_timings:   prompt time =    69.42 ms /  2452 runs (    0.03 ms per run)
whisper_print_timings:    total time = 10395.01 ms
./main -f test.wav -l zh -m models/ggml-tiny-q5_1.bin  7.20s user 0.63s system 75% cpu 10.422 total
```

### 模型 base

```shell
time ./main -f test.wav -l zh -m models/ggml-base.bin
```
```
whisper_print_timings:     load time =    81.90 ms
whisper_print_timings:     fallbacks =   0 p /   0 h
whisper_print_timings:      mel time =   133.21 ms
whisper_print_timings:   sample time =  2283.01 ms /  9560 runs (    0.24 ms per run)
whisper_print_timings:   encode time =   396.49 ms /    11 runs (   36.04 ms per run)
whisper_print_timings:   decode time =     7.37 ms /     3 runs (    2.46 ms per run)
whisper_print_timings:   batchd time =  8629.71 ms /  9505 runs (    0.91 ms per run)
whisper_print_timings:   prompt time =    88.45 ms /  2226 runs (    0.04 ms per run)
whisper_print_timings:    total time = 11631.52 ms
./main -f test.wav -l zh -m models/ggml-base.bin  6.29s user 0.60s system 59% cpu 11.664 total
```

### 模型 base-q5_1

```shell
time ./main -f test.wav -l zh -m models/ggml-base-q5_1.bin
```
```
whisper_print_timings:     load time =    63.39 ms
whisper_print_timings:     fallbacks =   0 p /   0 h
whisper_print_timings:      mel time =   132.60 ms
whisper_print_timings:   sample time =  2266.66 ms /  9567 runs (    0.24 ms per run)
whisper_print_timings:   encode time =   424.01 ms /    11 runs (   38.55 ms per run)
whisper_print_timings:   decode time =     7.25 ms /     3 runs (    2.42 ms per run)
whisper_print_timings:   batchd time =  8911.47 ms /  9512 runs (    0.94 ms per run)
whisper_print_timings:   prompt time =    98.58 ms /  2227 runs (    0.04 ms per run)
whisper_print_timings:    total time = 11916.36 ms
./main -f test.wav -l zh -m models/ggml-base-q5_1.bin  6.18s user 0.56s system 56% cpu 11.948 total
```

### 模型 small

```shell
time ./main -f test.wav -l zh -m models/ggml-small.bin
```
```
whisper_print_timings:     load time =   200.65 ms
whisper_print_timings:     fallbacks =   0 p /   0 h
whisper_print_timings:      mel time =   132.19 ms
whisper_print_timings:   sample time =  2134.68 ms /  8277 runs (    0.26 ms per run)
whisper_print_timings:   encode time =  1222.70 ms /    12 runs (  101.89 ms per run)
whisper_print_timings:   decode time =    24.96 ms /     5 runs (    4.99 ms per run)
whisper_print_timings:   batchd time = 15979.48 ms /  8208 runs (    1.95 ms per run)
whisper_print_timings:   prompt time =   218.47 ms /  2191 runs (    0.10 ms per run)
whisper_print_timings:    total time = 19925.94 ms
./main -f test.wav -l zh -m models/ggml-small.bin  6.21s user 0.67s system 34% cpu 19.968 total
```

### 模型 small-q5_1

```shell
time ./main -f test.wav -l zh -m models/ggml-small-q5_1.bin
```
```
whisper_print_timings:     load time =    99.42 ms
whisper_print_timings:     fallbacks =   0 p /   0 h
whisper_print_timings:      mel time =   131.74 ms
whisper_print_timings:   sample time =  2121.60 ms /  8218 runs (    0.26 ms per run)
whisper_print_timings:   encode time =  1419.51 ms /    13 runs (  109.19 ms per run)
whisper_print_timings:   decode time =   147.85 ms /    33 runs (    4.48 ms per run)
whisper_print_timings:   batchd time = 15960.53 ms /  8116 runs (    1.97 ms per run)
whisper_print_timings:   prompt time =   266.62 ms /  2419 runs (    0.11 ms per run)
whisper_print_timings:    total time = 20160.34 ms
./main -f test.wav -l zh -m models/ggml-small-q5_1.bin  6.03s user 0.59s system 32% cpu 20.191 total
```

### 模型 medium

```shell
time ./main -f test.wav -l zh -m models/ggml-medium.bin
```
```
whisper_print_timings:     load time =   476.85 ms
whisper_print_timings:     fallbacks =   0 p /   0 h
whisper_print_timings:      mel time =   132.37 ms
whisper_print_timings:   sample time =  2233.07 ms /  9028 runs (    0.25 ms per run)
whisper_print_timings:   encode time =  2951.15 ms /    11 runs (  268.29 ms per run)
whisper_print_timings:   decode time =    42.86 ms /     4 runs (   10.72 ms per run)
whisper_print_timings:   batchd time = 38405.30 ms /  8972 runs (    4.28 ms per run)
whisper_print_timings:   prompt time =   550.54 ms /  2232 runs (    0.25 ms per run)
whisper_print_timings:    total time = 44803.71 ms
./main -f test.wav -l zh -m models/ggml-medium.bin  7.14s user 1.01s system 18% cpu 44.848 total
```

### 模型 medium-q5_0

```shell
time ./main -f test.wav -l zh -m models/ggml-medium-q5_0.bin
```
```
whisper_print_timings:     load time =   203.72 ms
whisper_print_timings:     fallbacks =   0 p /   0 h
whisper_print_timings:      mel time =   132.13 ms
whisper_print_timings:   sample time =  2251.24 ms /  9072 runs (    0.25 ms per run)
whisper_print_timings:   encode time =  3288.98 ms /    11 runs (  299.00 ms per run)
whisper_print_timings:   decode time =    55.99 ms /     6 runs (    9.33 ms per run)
whisper_print_timings:   batchd time = 39768.11 ms /  9014 runs (    4.41 ms per run)
whisper_print_timings:   prompt time =   624.49 ms /  2234 runs (    0.28 ms per run)
whisper_print_timings:    total time = 46336.09 ms
./main -f test.wav -l zh -m models/ggml-medium-q5_0.bin  7.02s user 0.81s system 16% cpu 46.372 total
```

### 模型 large-v3

```shell
time ./main -f test.wav -l zh -m models/ggml-large-v3.bin
```
```
whisper_print_timings:     load time =   859.78 ms
whisper_print_timings:     fallbacks =   0 p /   0 h
whisper_print_timings:      mel time =   151.76 ms
whisper_print_timings:   sample time =  2201.30 ms /  8640 runs (    0.25 ms per run)
whisper_print_timings:   encode time =  5561.91 ms /    12 runs (  463.49 ms per run)
whisper_print_timings:   decode time =  1033.94 ms /    67 runs (   15.43 ms per run)
whisper_print_timings:   batchd time = 55377.50 ms /  8503 runs (    6.51 ms per run)
whisper_print_timings:   prompt time =   820.89 ms /  1975 runs (    0.42 ms per run)
whisper_print_timings:    total time = 66020.98 ms
./main -f test.wav -l zh -m models/ggml-large-v3.bin  7.45s user 1.40s system 13% cpu 1:06.08 total
```

### 模型 large-v3-q5_0

```shell
time ./main -f test.wav -l zh -m models/ggml-large-v3-q5_0.bin
```
```
whisper_print_timings:     load time =   341.02 ms
whisper_print_timings:     fallbacks =   0 p /   0 h
whisper_print_timings:      mel time =   159.70 ms
whisper_print_timings:   sample time =  2230.36 ms /  8311 runs (    0.27 ms per run)
whisper_print_timings:   encode time =  5895.91 ms /    11 runs (  535.99 ms per run)
whisper_print_timings:   decode time =   344.94 ms /    25 runs (   13.80 ms per run)
whisper_print_timings:   batchd time = 57613.93 ms /  8239 runs (    6.99 ms per run)
whisper_print_timings:   prompt time =  1062.95 ms /  2198 runs (    0.48 ms per run)
whisper_print_timings:    total time = 67659.70 ms
./main -f test.wav -l zh -m models/ggml-large-v3-q5_0.bin  7.25s user 1.03s system 12% cpu 1:07.71 total
```

### 总结

|  | tiny | tiny-q5_1 | base | base-q5_1 | small | small-q5_1 | medium | medium-q5_0 | large-v3 | large-v3-q5_0 |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| load time | 73.39 ms | 68.97 ms | 81.90 ms | 63.39 ms | 200.65 ms | 99.42 ms | 476.85 ms | 203.72 ms | 859.78 ms | 341.02 ms |
| mel time | 132.73 ms | 134.27 ms | 133.21 ms | 132.60 ms | 132.19 ms | 131.74 ms | 132.37 ms | 132.13 ms | 151.76 ms | 159.70 ms |
| sample time | 1967.16 ms | 2650.25 ms | 2283.01 ms | 2266.66 ms | 2134.68 ms | 2121.60 ms | 2233.07 ms | 2251.24 ms | 2201.30 ms | 2230.36 ms |
| encode time | 259.27 ms | 232.78 ms | 396.49 ms | 424.01 ms | 1222.70 ms | 1419.51 ms | 2951.15 ms | 3288.98 ms | 5561.91 ms | 5895.91 ms |
| decode time | 69.91 ms | 7.82 ms | 7.37 ms | 7.25 ms | 24.96 ms | 55.99 ms | 42.86 ms | 55.99 ms | 1033.94 ms | 344.94 ms |
| batchd time | 5104.22 ms | 7218.69 ms | 8629.71 ms | 8911.47 ms | 15979.48 ms | 15960.53 ms | 38405.30 ms | 39768.11 ms | 55377.50 ms | 57613.93 ms |
| prompt time | 55.85 ms | 69.42 ms | 88.45 ms | 98.58 ms | 218.47 ms | 266.62 ms | 550.54 ms | 624.49 ms | 820.89 ms | 1062.95 ms |
| total time | 7675.59 ms | 10395.01 ms | 11631.52 ms | 11916.36 ms | 19925.94 ms | 20160.34 ms | 44803.71 ms | 46336.09 ms | 66020.98 ms | 67659.70 ms |
| cpu time | 0:07.70 | 0:10.42 | 0:11.66 | 0:11.94 | 0:19.96 | 0:20.19 | 0:44.84 | 0:46.37 | 1:06.08 | 1:07.71 |
|  |  |  | 🚀 | 🚀 | 🚀🚀 | 🚀🚀 | 🚀🚀🚀🚀 | 🚀🚀🚀🚀 | 🚀🚀🚀🚀🚀🚀 | 🚀🚀🚀🚀🚀🚀 |


## 性能对比（MLX）

### 编写脚本 `test-speed.py` 

```py
import argparse
import whisper

# 创建一个解析器
parser = argparse.ArgumentParser(description='Transcribe a speech file using a specific model.')
parser.add_argument('speech_file', type=str, help='The path to the speech file.')
parser.add_argument('model', type=str, help='The model to use for transcription.')

# 解析命令行参数
args = parser.parse_args()

# 使用指定的音频文件和模型进行转录
text = whisper.transcribe(args.speech_file, model=args.model, initial_prompt='大家好！')["text"]
print(text)
```

执行脚本
    
```shell
time python test-speed.py test.wav base
```

下面的性能测试使用的是一个 `5 分钟`的音频文件 `test.wav`。

### 模型 tiny
```
9.83s user 8.39s system 142% cpu 12.813 total
```

### 模型 base
```
7.93s user 6.82s system 143% cpu 10.297 total
```

### 模型 small
```
14.49s user 9.87s system 129% cpu 18.812 total
```

### 模型 medium
```
30.05s user 17.96s system 122% cpu 39.291 total
```

### 模型 large-v3
```
47.01s user 28.10s system 119% cpu 1:02.96 total
```

### 总结

|  | tiny | base | small | medium | large-v3 |
| --- | ---: | ---: | ---: | ---: | ---: |
| cpu time | 0:12.81 | 0:10.30 | 0:18.81 | 0:39.29 | 1:02.96 |


## 性能对比（NEON & MPS 🆚 MLX）

| | tiny | base | small | medium | large-v3 |
| --- | ---: | ---: | ---: | ---: | ---: |
| NEON & MPS | 0:07.70 | 0:11.66 | 0:19.96 | 0:44.84 | 1:06.08 |
| MLX        | 0:12.81 | 0:10.30 | 0:18.81 | 0:39.29 | 1:02.96 |

**MLX 的性能已经超过了 whisper.cpp 的性能了。**

## 参考资料
- [Introducing Accelerated PyTorch Training on Mac](https://pytorch.org/blog/introducing-accelerated-pytorch-training-on-mac/)
- [ARM NEON优化（一）——NEON简介及基本架构](https://zyddora.github.io/2016/02/28/neon_1/)
- [Cannot build CoreML models](https://github.com/ggerganov/whisper.cpp/issues/898)
- [openai-whisper](https://pypi.org/project/openai-whisper/)
- [openai/whisper-large-v3](https://huggingface.co/openai/whisper-large-v3/)
- [Sound to Script: Using OpenAI's Whisper Model and Whisper.cpp](https://mariochavez.io/desarrollo/2023/12/10/sound-to-script-openia-whisper/)
- [Whisper: Nvidia RTX 4090 vs. M1 Pro with MLX](https://news.ycombinator.com/item?id=38628184)
