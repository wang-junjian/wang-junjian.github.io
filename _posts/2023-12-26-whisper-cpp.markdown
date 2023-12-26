---
layout: post
title:  "whisper.cpp"
date:   2023-12-26 08:00:00 +0800
categories: Whisper
tags: [Whisper, MacBookProM2Max]
---

## 下载模型
### large-v3
```shell
models/download-ggml-model.sh large-v3
```

## NEON & MPS
### 编译
```shell
make clean
make -j
```

### 语音识别
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


## CoreML
### 安装依赖
```shell
pip install openai-whisper coremltools ane-transformers
```

### 生成 CoreML 模型
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

### 编译
```shell
make clean
WHISPER_COREML=1 make -j
```

### 语音识别
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

### 仅编码
感觉和上面的一样，包括效果和速度。

```shell
models/generate-coreml-model.sh large-v3 --encoder-only True
time ./main -m models/ggml-large-v3.bin -f test.wav -l auto 
```


## 对比
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


## 参考资料
- [Introducing Accelerated PyTorch Training on Mac](https://pytorch.org/blog/introducing-accelerated-pytorch-training-on-mac/)
- [ARM NEON优化（一）——NEON简介及基本架构](https://zyddora.github.io/2016/02/28/neon_1/)
