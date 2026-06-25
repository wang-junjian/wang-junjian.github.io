---
type: article
title:  "Speech To Speech：使用开源模型构建本地语音智能体"
date:   2026-05-13 20:00:00 +0800
tags: [Speech To Speech, 语音智能体, Hugging Face, Reachy Mini]
---

## 方法

### 架构
本仓库实现了一个语音到语音的级联管道，包含以下部分：
1. **语音活动检测（VAD）**
2. **语音转文本（STT）**
3. **语言模型（LM）**
4. **文本转语音（TTS）**

### 模块化
该管道提供了一种完全开放且模块化的方法，重点是利用 Hugging Face Hub 上 Transformers 库提供的模型。代码设计易于修改，我们已经支持特定设备和外部库的实现：

**VAD**
- [Silero VAD v5](https://github.com/snakers4/silero-vad)

**STT**
- 通过 Transformers 🤗 在 Hugging Face Hub 上的任何 [Whisper](https://huggingface.co/docs/transformers/en/model_doc/whisper) 模型检查点，包括 [whisper-large-v3](https://huggingface.co/openai/whisper-large-v3) 和 [distil-large-v3](https://huggingface.co/distil-whisper/distil-large-v3)
- [Lightning Whisper MLX](https://github.com/mustafaaljadery/lightning-whisper-mlx?tab=readme-ov-file#lightning-whisper-mlx)
- [MLX Audio Whisper](https://github.com/huggingface/mlx-audio) - 在 Apple Silicon 上快速推理 Whisper
- [Parakeet TDT](https://huggingface.co/nvidia/parakeet-tdt-1.1b) - 在 Apple Silicon 上实现亚 100 毫秒延迟的实时流式 STT（通过 nano-parakeet 支持 CUDA/CPU，无需 NeMo）
- [Paraformer - FunASR](https://github.com/modelscope/FunASR)

**LLM**
- 通过 Transformers 🤗 在 [Hugging Face Hub](https://huggingface.co/models?pipeline_tag=text-generation&sort=trending) 上的任何指令遵循模型
- [mlx-lm](https://github.com/ml-explore/mlx-examples/blob/main/llms/README.md)
- [OpenAI API](https://platform.openai.com/docs/quickstart)

**TTS**
- [ChatTTS](https://github.com/2noise/ChatTTS?tab=readme-ov-file)
- [Pocket TTS](https://github.com/kyutai-labs/pocket-tts) - Kyutai Labs 提供的支持语音克隆的流式 TTS
- [Kokoro-82M](https://huggingface.co/hexgrad/Kokoro-82M) - 针对 Apple Silicon 优化的快速高质量 TTS
- [Qwen3-TTS](https://huggingface.co/Qwen/Qwen3-TTS-12Hz-1.7B-CustomVoice)

## 安装

从 PyPI 安装默认包：
```bash
pip install speech-to-speech
```

默认安装限定为标准实时语音智能体路径：
- Parakeet TDT 用于 STT
- 兼容 OpenAI 的 API 用于语言模型
- Qwen3-TTS 用于语音输出
- 本地音频和实时服务端模式

可选后端可通过附加依赖安装：

```bash
pip install "speech-to-speech[kokoro]"
pip install "speech-to-speech[pocket]"
pip install "speech-to-speech[faster-whisper]"
pip install "speech-to-speech[paraformer]"
pip install "speech-to-speech[mlx-lm]"
pip install "speech-to-speech[websocket]"
```

已弃用的模型实现（包括 MeloTTS）位于 [`archive/`](https://github.com/huggingface/speech-to-speech/tree/main/archive) 中，不再连接到 CLI。

从源码开发：
```bash
git clone https://github.com/huggingface/speech-to-speech.git
cd speech-to-speech
uv sync
```

这将安装 `speech_to_speech` 包（可编辑模式）并使 `speech-to-speech` CLI 命令可用。该项目使用单个 `pyproject.toml` 配合平台标记，因此 macOS 和非 macOS 依赖项从一个文件自动解析。

⚠️ **DeepFilterNet 注意：** DeepFilterNet（用于 VAD 中可选的音频增强）需要 `numpy<2`，与需要 `numpy>=2` 的 Pocket TTS 冲突。请仅在不使用 Pocket TTS 的环境中手动安装 DeepFilterNet。

## 使用说明

默认 CLI 等同于实时 Parakeet + 兼容 OpenAI 的 LLM + Qwen3-TTS 设置。它使用环境中的 `OPENAI_API_KEY`，除非提供了 `--responses_api_api_key`：
```bash
speech-to-speech
```

管道可以通过四种方式运行：
- **实时方法**：模型在本地或服务器上运行，并为其他应用暴露兼容 OpenAI Realtime 的 WebSocket API。
- **服务端/客户端方法**：模型在服务器上运行，客户端使用 TCP 套接字流式传输音频输入/输出。
- **WebSocket方法**：模型在服务器上运行，客户端使用 WebSocket 流式传输音频输入/输出。
- **本地方法**：本地运行。

### 推荐设置

### 实时方法

默认实时设置使用 `--llm_backend responses-api`，适用于任何支持 OpenAI Responses API 协议的提供商。在启动前导出带有提供商密钥的 `OPENAI_API_KEY`，或使用 `--responses_api_api_key` 显式传递。对于非 OpenAI 提供商，还需设置 `--responses_api_base_url`。

```bash
export OPENAI_API_KEY=...
```

默认模式启动兼容 OpenAI Realtime 的服务器：
```bash
speech-to-speech
```

等同于：
```bash
speech-to-speech \
    --thresh 0.6 \
    --stt parakeet-tdt \
    --llm_backend responses-api \
    --tts qwen3 \
    --qwen3_tts_model_name Qwen/Qwen3-TTS-12Hz-1.7B-CustomVoice \
    --qwen3_tts_speaker Aiden \
    --qwen3_tts_language auto \
    --qwen3_tts_non_streaming_mode True \
    --qwen3_tts_mlx_quantization 6bit \
    --model_name gpt-5.4-mini \
    --chat_size 30 \
    --responses_api_stream \
    --enable_live_transcription \
    --mode realtime
```

### 服务端/客户端方法

1. 在服务器上运行管道：
   ```bash
   speech-to-speech --recv_host 0.0.0.0 --send_host 0.0.0.0
   ```

2. 在本地运行客户端处理麦克风输入并接收生成的音频：
   ```bash
   python scripts/listen_and_play.py --host <你服务器的 IP 地址>
   ```

### WebSocket方法

1. 以 WebSocket 模式运行管道：
   ```bash
   speech-to-speech --mode websocket --ws_host 0.0.0.0 --ws_port 8765
   ```

2. 从客户端应用连接到 `ws://<服务器-ip>:8765` 的 WebSocket 服务器。服务器处理双向音频流：
   - 向服务器发送原始音频字节（16kHz，int16，单声道）
   - 从服务器接收生成的音频字节

### 本地方法（Mac）

1. Mac 优化设置：
   ```bash
   speech-to-speech --local_mac_optimal_settings
   ```

   也可以指定特定的 LLM 模型：
   ```bash
   speech-to-speech \
       --local_mac_optimal_settings \
       --model_name mlx-community/Qwen3-4B-Instruct-2507-bf16
   ```

此设置：
   - 添加 `--device mps` 为所有模型使用 MPS
   - 设置 [Parakeet TDT](https://huggingface.co/nvidia/parakeet-tdt-1.1b) 用于 STT（Apple Silicon 上的快速流式 ASR）
   - 设置 MLX LM 作为 LLM 后端
   - 设置 Qwen3-TTS 用于 TTS
   - `--tts pocket` 和 `--tts kokoro` 在 macOS 上也是有效的 TTS 选项
   - Apple Silicon 上的 Qwen3 使用 `mlx-audio`，默认使用 `6bit` MLX 变体，除非明确选择不同的量化或模型后缀
   - 要在本地比较 MLX 变体，运行：
     ```bash
     python scripts/benchmark_tts.py \
         --handlers qwen3 \
         --iterations 3 \
         --qwen3_mlx_quantizations bf16 4bit 6bit 8bit
     ```

### 实时模式

实时模式（`--mode realtime`）使用 OpenAI Realtime 协议通过 WebSocket 流式传输音频，支持实时转录和低延迟的轮流对话。服务器暴露 `/v1/realtime` 的 WebSocket 端点，任何兼容 OpenAI Realtime 的客户端都可以连接。

#### 使用 OpenAI Realtime 客户端连接

```python
from openai import OpenAI

client = OpenAI(base_url="http://localhost:8765/v1", api_key="not-needed")

with client.beta.realtime.connect(model="model_name") as conn:
    conn.session.update(
      session={
        "instructions": "你是一个乐于助人的助手。",
        "turn_detection": {"type": "server_vad", "interrupt_response": True},
      }
    )

    # 发送音频，接收事件等
    for event in conn:
        print(event.type)
```

#### 支持的事件

**客户端 -> 服务端**

| 事件 | 描述 |
|---|---|
| `input_audio_buffer.append` | 流式传输 base64 PCM 音频。解码、重采样到 16 kHz，并为 VAD 分块。 |
| `session.update` | 深度合并会话配置（指令、工具、语音、轮次检测、音频格式）。 |
| `conversation.item.create` | 将 `input_text` 或 `function_call_output` 注入 LLM 上下文而不触发生成。 |
| `response.create` | 触发 LLM 生成。支持按响应覆盖 `instructions` 和 `tool_choice`。 |
| `response.cancel` | 取消进行中的响应并重新启用监听。 |

**服务端 -> 客户端**

| 事件 | 描述 |
|---|---|
| `session.created` | 连接时发送，包含当前会话配置。 |
| `error` | 协议错误（`session_limit_reached`、`unknown_or_invalid_event`、`invalid_session_type`、`conversation_already_has_active_response` 等） |
| `input_audio_buffer.speech_started` | VAD 检测到用户语音。 |
| `input_audio_buffer.speech_stopped` | 用户语音段结束。 |
| `conversation.item.created` | 确认从 `conversation.item.create` 注入的 `input_text`。 |
| `conversation.item.input_audio_transcription.delta` | 流式部分转录（启用实时转录时）。 |
| `conversation.item.input_audio_transcription.completed` | 用户轮次的最终转录（包含时长使用信息）。 |
| `response.created` | 在第一个出站音频块时发出（响应处于 `in_progress` 状态）。 |
| `response.output_audio.delta` | TTS 生成的 base64 PCM 音频块。 |
| `response.output_audio.done` | 当前输出项的音频流完成。 |
| `response.output_audio_transcript.done` | 轮次的完整助手文本转录。 |
| `response.function_call_arguments.done` | 工具调用，包含 `call_id`、`name` 和 JSON `arguments`。 |
| `response.done` | 响应完成（`completed`、`cancelled`，取消原因为 `turn_detected` 或 `client_cancelled`）。 |

有关完整架构和设计细节，请参阅 [Realtime Engine README](https://github.com/huggingface/speech-to-speech/tree/main/src/speech_to_speech/api/openai_realtime/README.md)。

### LLM后端

LLM 是管道中计算最密集、延迟最高的组件。单次大模型前向传播很容易主导端到端响应时间，因此根据硬件和延迟预算选择合适的后端非常重要。为了给用户最大的灵活性，我们支持全范围的推理解决方案：

- **本地推理** — `transformers`（CUDA / CPU）和 `mlx-lm`（Apple Silicon）完全在本地运行模型，无外部依赖。
- **自托管服务器** — `--llm_backend responses-api` 可以指向本地 [vLLM](https://github.com/vllm-project/vllm) 或 [llama.cpp](https://github.com/ggerganov/llama.cpp) 服务器，让您控制量化、批处理和硬件，同时保持流量在本地。
- **提供商 API** — 相同的 `responses-api` 后端适用于 OpenAI、[HuggingFace Inference Providers](https://huggingface.co/inference-providers)、[OpenRouter](https://openrouter.ai) 以及任何其他实现 OpenAI Responses API 的提供商。

使用 `--llm_backend` 选择后端（默认为 `responses-api`），并配合 `--model_name`。后端特定选项（`--responses_api_base_url`、`--responses_api_api_key`、`--responses_api_stream` 等）仅在 `responses-api` 后端时需要。

> 以下示例将 Parakeet TDT（本地 STT）和 Qwen3-TTS（本地 TTS）与不同的 LLM 后端配对。

#### 兼容 OpenAI 的后端（`--llm_backend responses-api`）

`--llm_backend responses-api` 适用于任何实现 OpenAI Chat Completions API 的服务器 — 将 `--responses_api_base_url` 指向正确的端点并相应设置 `--model_name`：

| 后端 | `--responses_api_base_url` | `--responses_api_api_key` |
|---|---|---|
| OpenAI | *（省略，使用 OpenAI 默认值）* | `$OPENAI_API_KEY` |
| HF Inference Providers | `https://router.huggingface.co/v1` | `$HF_TOKEN` |
| OpenRouter | `https://openrouter.ai/api/v1` | `$OPENROUTER_API_KEY` |
| vLLM（本地） | `http://localhost:8000/v1` | *（省略或任意字符串）* |
| llama.cpp（本地） | `http://localhost:8080/v1` | *（省略或任意字符串）* |

```bash
# OpenAI
speech-to-speech \
    --mode local \
    --stt parakeet-tdt \
    --llm_backend responses-api \
    --tts qwen3 \
    --qwen3_tts_mlx_quantization 6bit \
    --model_name "gpt-4o-mini" \
    --responses_api_api_key "$OPENAI_API_KEY" \
    --responses_api_stream \
    --enable_live_transcription
```

```bash
# HF Inference Providers — 通过 Together 使用 Qwen3.5-9B
speech-to-speech \
    --mode local \
    --stt parakeet-tdt \
    --llm_backend responses-api \
    --tts qwen3 \
    --qwen3_tts_mlx_quantization 6bit \
    --model_name "Qwen/Qwen3.5-9B:together" \
    --responses_api_base_url "https://router.huggingface.co/v1" \
    --responses_api_api_key "$HF_TOKEN" \
    --responses_api_stream \
    --enable_live_transcription
```

```bash
# HF Inference Providers — 通过 Groq 使用 GPT-oss-20B
speech-to-speech \
    --stt parakeet-tdt \
    --llm_backend responses-api \
    --tts qwen3 \
    --qwen3_tts_mlx_quantization 6bit \
    --model_name "openai/gpt-oss-20b:groq" \
    --responses_api_base_url "https://router.huggingface.co/v1" \
    --responses_api_api_key "$HF_TOKEN" \
    --responses_api_stream \
    --enable_live_transcription
```

#### 完全本地（Apple Silicon）

```bash
# MLX 后端（Apple Silicon）
speech-to-speech \
    --mode local \
    --stt parakeet-tdt \
    --llm_backend mlx-lm \
    --tts qwen3 \
    --qwen3_tts_mlx_quantization 6bit \
    --model_name "mlx-community/Qwen3-4B-Instruct-2507-bf16" \
    --enable_live_transcription
```

```bash
# Transformers 后端
speech-to-speech \
    --mode local \
    --stt parakeet-tdt \
    --llm_backend transformers \
    --tts qwen3 \
    --model_name "Qwen/Qwen3-4B-Instruct-2507" \
    --enable_live_transcription
```

### Docker服务端

#### 安装 NVIDIA Container Toolkit

https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/install-guide.html

#### 启动 Docker 容器
```docker compose up```

### 使用 Cuda 的推荐用法

利用 Torch Compile 配合 Whisper 和 Pocket TTS，实现简单的低延迟设置：

```bash
speech-to-speech \
    --stt parakeet-tdt \
    --llm_backend transformers \
    --tts qwen3 \
    --model_name "Qwen/Qwen3-4B-Instruct-2507" \
    --enable_live_transcription
```

### 多语言支持

该管道目前支持英语、法语、西班牙语、中文、日语和韩语。
考虑两种使用场景：

- **单语言对话**：使用 `--language` 标志强制执行语言设置，指定目标语言代码（默认为 'en'）。
- **语言切换**：将 `--language` 设置为 'auto'。STT 检测每个语音提示的语言并传递给 LLM。可选择启用 `--enable_lang_prompt`，附加"请用……回复我的消息"指令，让 LLM 以检测到的语言回复。该标志默认为 `False` — 大型 LLM 通常能从上下文中自行识别语言，但显式指令可以帮助较小的模型保持在正确的语言中。

请注意，您必须使用与目标语言兼容的 STT 和 LLM 检查点。对于多语言 TTS，使用 ChatTTS 或其他支持目标语言的后端。

#### 服务端版本：

自动语言检测：

```bash
speech-to-speech \
    --stt parakeet-tdt \
    --language auto \
    --llm_backend mlx-lm \
    --model_name "mlx-community/Qwen3-4B-Instruct-2507-bf16"
```

或指定特定语言，例如中文：

```bash
speech-to-speech \
    --stt whisper-mlx \
    --stt_model_name large-v3 \
    --language zh \
    --llm_backend mlx-lm \
    --model_name mlx-community/Qwen3-4B-Instruct-2507-bf16
```

#### 本地 Mac 设置

自动语言检测（注意：`--stt whisper-mlx` 会覆盖优化设置中的默认 parakeet-tdt，因为 Whisper `large-v3` 具有更广泛的语言覆盖）：

```bash
speech-to-speech \
    --local_mac_optimal_settings \
    --stt parakeet-tdt \
    --language auto \
    --model_name mlx-community/Qwen3-4B-Instruct-2507-bf16
```

或指定特定语言，例如中文：

```bash
speech-to-speech \
    --local_mac_optimal_settings \
    --stt whisper-mlx \
    --stt_model_name large-v3 \
    --language zh \
    --model_name mlx-community/Qwen3-4B-Instruct-2507-bf16
```

### 使用 Pocket TTS

Kyutai Labs 的 Pocket TTS 提供支持语音克隆的流式 TTS。使用方法：

```bash
speech-to-speech \
    --tts pocket \
    --pocket_tts_voice jean \
    --pocket_tts_device cpu
```

可用的语音预设：`alba`、`marius`、`javert`、`jean`、`fantine`、`cosette`、`eponine`、`azelma`。您也可以使用自定义语音文件或 HuggingFace 路径。

## 命令行使用

> **_注意：_** 所有 CLI 参数的参考信息可以直接在 [arguments classes](https://github.com/huggingface/speech-to-speech/tree/main/src/speech_to_speech/arguments_classes) 中找到，或通过运行 `speech-to-speech -h` 查看。

### 模块级参数
参见 [ModuleArguments](https://github.com/huggingface/speech-to-speech/tree/main/src/speech_to_speech/arguments_classes/module_arguments.py) 类。允许设置：
- 通用的 `--device`（如果希望每个部分在同一设备上运行）
- `--mode`：`realtime`（默认）、`local`、`socket` 或 `websocket`
- 选择的 STT 实现（`--stt`）
- 选择的 LLM 后端（`--llm_backend`：`transformers`、`mlx-lm` 或 `responses-api`）
- 选择的 TTS 实现（`--tts`）
- 日志级别

### VAD参数
参见 [VADHandlerArguments](https://github.com/huggingface/speech-to-speech/tree/main/src/speech_to_speech/arguments_classes/vad_arguments.py) 类。值得注意的是：
- `--thresh`：触发语音活动检测的阈值。
- `--min_speech_ms`：被视为语音的检测到语音活动的最小持续时间。
- `--min_silence_ms`：用于分割语音的静音间隔最小长度，平衡句子切割和延迟降低。

### STT、LLM 和 TTS 参数

`model_name`、`torch_dtype` 和 `device` 为每个 STT、LLM 和 TTS 实现暴露。STT 和 TTS 参数使用处理器前缀（例如 `--stt_model_name`、`--llm_device`）。LLM 模型选择和聊天设置通过无前缀标志在后端之间共享（例如 `--model_name`、`--chat_size`）；后端特定标志对 `responses-api` 后端使用 `responses_api_` 前缀，对本地后端使用 `llm_` 前缀。完整列表请参阅 [arguments classes](https://github.com/huggingface/speech-to-speech/tree/main/src/speech_to_speech/arguments_classes)。

例如：
```bash
# 本地 transformers/mlx-lm 后端
--model_name google/gemma-2b-it

# 兼容 OpenAI 的后端
--llm_backend responses-api --model_name deepseek-chat --responses_api_base_url https://api.deepseek.com
```

### 生成参数

其他生成参数可以使用处理器前缀 + `_gen_` 设置，例如 `--stt_gen_max_new_tokens 128` 或 `--llm_gen_temperature 0.7`。如果尚未暴露，这些参数可以添加到管道部分的参数类中。

## 引用

### Silero VAD
```bibtex
@misc{Silero VAD,
  author = {Silero Team},
  title = {Silero VAD: pre-trained enterprise-grade Voice Activity Detector (VAD), Number Detector and Language Classifier},
  year = {2021},
  publisher = {GitHub},
  journal = {GitHub repository},
  howpublished = {\url{https://github.com/snakers4/silero-vad}},
  commit = {insert_some_commit_here},
  email = {hello@silero.ai}
}
```

### Distil-Whisper
```bibtex
@misc{gandhi2023distilwhisper,
      title={Distil-Whisper: Robust Knowledge Distillation via Large-Scale Pseudo Labelling},
      author={Sanchit Gandhi and Patrick von Platen and Alexander M. Rush},
      year={2023},
      eprint={2311.00430},
      archivePrefix={arXiv},
      primaryClass={cs.CL}
}
```

### Parler-TTS
```bibtex
@misc{lacombe-etal-2024-parler-tts,
  author = {Yoach Lacombe and Vaibhav Srivastav and Sanchit Gandhi},
  title = {Parler-TTS},
  year = {2024},
  publisher = {GitHub},
  journal = {GitHub repository},
  howpublished = {\url{https://github.com/huggingface/parler-tts}}
}
```


## 命令行参数

**选项**:

```
-h, --help          显示此帮助信息并退出
--device DEVICE     如果指定，将覆盖所有处理器的设备。（默认：None）
--mode {local,socket,websocket,realtime}
    运行流水线的模式。可选 'local', 'socket', 'websocket', 或 'realtime'。默认是 'realtime'。
    （默认：realtime）
--local_mac_optimal_settings [LOCAL_MAC_OPTIMAL_SETTINGS], --local-mac-optimal-settings [LOCAL_MAC_OPTIMAL_SETTINGS]
    如果指定，将为 Mac OS 设置最优配置。为 STT 设置 Parakeet TDT，为语言模型设置 MLX LM，为 TTS 设置 Qwen3-TTS，使用 MPS 设备和本地模式。（默认：False）
--stt {whisper,whisper-mlx,mlx-audio-whisper,faster-whisper,parakeet-tdt,paraformer}
    要使用的 STT。可选 'whisper', 'whisper-mlx', 'mlx-audio-whisper', 'faster-whisper', 'parakeet-tdt' 或 'paraformer'。默认是 'parakeet-tdt'。（默认：parakeet-tdt）
--llm_backend {transformers,mlx-lm,responses-api}, --llm-backend {transformers,mlx-lm,responses-api}
    要使用的 LLM 后端。可选 'transformers', 'mlx-lm' 或 'responses-api'。默认是 'responses-api'。（默认：responses-api）
--tts {melo,chatTTS,facebookMMS,pocket,kokoro,qwen3}
    要使用的 TTS。可选 'chatTTS', 'facebookMMS', 'pocket', 'kokoro' 或 'qwen3'。默认是 'qwen3'。（默认：qwen3）
--log_level LOG_LEVEL, --log-level LOG_LEVEL
    提供日志级别。例如 --log_level debug，默认=info。（默认：info）
--enable_live_transcription [ENABLE_LIVE_TRANSCRIPTION], --enable-live-transcription [ENABLE_LIVE_TRANSCRIPTION]
    启用用户说话时的实时转录显示（适用于 parakeet-tdt）。默认是 true。（默认：True）
--no_enable_live_transcription, --no-enable-live-transcription
    启用用户说话时的实时转录显示（适用于 parakeet-tdt）。默认是 true。（默认：False）
--live_transcription_update_interval LIVE_TRANSCRIPTION_UPDATE_INTERVAL, --live-transcription-update-interval LIVE_TRANSCRIPTION_UPDATE_INTERVAL
    实时转录的更新间隔，单位为秒（默认：0.25 秒 = 250毫秒）（默认：0.25）
--live_transcription_min_silence_ms LIVE_TRANSCRIPTION_MIN_SILENCE_MS, --live-transcription-min-silence-ms LIVE_TRANSCRIPTION_MIN_SILENCE_MS
    启用实时转录时，结束语音前的最小静音持续时间（毫秒）（默认：500毫秒）（默认：500）
--recv_host RECV_HOST, --recv-host RECV_HOST
    Socket 连接的主机 IP 地址。默认是 '0.0.0.0'，绑定到主机所有可用接口。（默认：localhost）
--recv_port RECV_PORT, --recv-port RECV_PORT
    Socket 服务器监听的端口号。默认是 12346。（默认：12345）
--chunk_size CHUNK_SIZE, --chunk-size CHUNK_SIZE
    通过 socket 发送或接收的每个数据块的大小。默认是 1024 字节。（默认：1024）
--send_host SEND_HOST, --send-host SEND_HOST
    Socket 连接的主机 IP 地址。默认是 '0.0.0.0'，绑定到主机所有可用接口。（默认：localhost）
--send_port SEND_PORT, --send-port SEND_PORT
    Socket 服务器监听的端口号。默认是 12346。（默认：12346）
--ws_host WS_HOST, --ws-host WS_HOST
    WebSocket 服务器的主机 IP 地址。默认是 '0.0.0.0'，绑定到主机所有可用接口。（默认：0.0.0.0）
--ws_port WS_PORT, --ws-port WS_PORT
    WebSocket 服务器监听的端口号。默认是 8765。（默认：8765）
--thresh THRESH       Voice Activity Detection (VAD) 的阈值。值范围通常为 0 到 1，值越高表示语音检测所需的置信度越高。（默认：0.6）
--sample_rate SAMPLE_RATE, --sample-rate SAMPLE_RATE
    音频的采样率，单位为赫兹。默认是 16000 Hz，这是语音音频的常用设置。（默认：16000）
--min_silence_ms MIN_SILENCE_MS, --min-silence-ms MIN_SILENCE_MS
    用于分割语音的静音段的最小长度。以毫秒为单位。默认是 250 毫秒。（默认：300）
--min_speech_ms MIN_SPEECH_MS, --min-speech-ms MIN_SPEECH_MS
    被视为有效语音的语音段的最小长度。以毫秒为单位。默认是 500 毫秒。（默认：500）
--max_speech_ms MAX_SPEECH_MS, --max-speech-ms MAX_SPEECH_MS
    强制分割前连续语音的最大长度。默认为无限，允许不间断的语音段。（默认：inf）
--speech_pad_ms SPEECH_PAD_MS, --speech-pad-ms SPEECH_PAD_MS
    在 VAD 触发前保留并添加到检测到的语音段开头的音频量。一旦检测到语音，会继续保留音频直到 VAD 宣告段结束。以毫秒为单位。默认是 500 毫秒。（默认：500）
--audio_enhancement [AUDIO_ENHANCEMENT], --audio-enhancement [AUDIO_ENHANCEMENT]
    通过应用降噪、均衡和回声消除等技术提高音质。默认是 False。（默认：False）
--enable_realtime_transcription [ENABLE_REALTIME_TRANSCRIPTION], --enable-realtime-transcription [ENABLE_REALTIME_TRANSCRIPTION]
    启用渐进式音频释放，用于说话期间的实时转录。默认是 False。（默认：False）
--realtime_processing_pause REALTIME_PROCESSING_PAUSE, --realtime-processing-pause REALTIME_PROCESSING_PAUSE
    说话期间释放渐进式音频块的时间间隔（秒）。默认是 0.2 秒。（默认：0.2）
--stt_model_name STT_MODEL_NAME, --stt-model-name STT_MODEL_NAME
    要使用的预训练 Whisper 模型。默认是 'distil-whisper/distil-large-v3'。（默认：distil-whisper/distil-large-v3）
--stt_device STT_DEVICE, --stt-device STT_DEVICE
    模型运行的设备类型。默认是 'cuda' 用于 GPU 加速。（默认：cuda）
--stt_torch_dtype STT_TORCH_DTYPE, --stt-torch-dtype STT_TORCH_DTYPE
    模型和输入张量的 PyTorch 数据类型。可选 `float32`（全精度）、`float16` 或 `bfloat16`（半精度）。（默认：float16）
--stt_compile_mode STT_COMPILE_MODE, --stt-compile-mode STT_COMPILE_MODE
    torch 编译的编译模式。可选 'default', 'reduce-overhead' 和 'max-autotune'。默认为 None（不编译）（默认：None）
--stt_gen_max_new_tokens STT_GEN_MAX_NEW_TOKENS, --stt-gen-max-new-tokens STT_GEN_MAX_NEW_TOKENS
    生成的最大新令牌数。默认是 128。（默认：128）
--stt_gen_num_beams STT_GEN_NUM_BEAMS, --stt-gen-num-beams STT_GEN_NUM_BEAMS
    束搜索的束数量。默认是 1，表示贪婪解码。（默认：1）
--stt_gen_return_timestamps [STT_GEN_RETURN_TIMESTAMPS], --stt-gen-return-timestamps [STT_GEN_RETURN_TIMESTAMPS]
    是否返回转录的时间戳。默认是 False。（默认：False）
--stt_gen_task STT_GEN_TASK, --stt-gen-task STT_GEN_TASK
    要执行的任务，通常是转录的 'transcribe'。默认是 'transcribe'。（默认：transcribe）
--language LANGUAGE   对话的语言。可选 'en'（英语）、'fr'（法语）、'es'（西班牙语）、'zh'（中文）、'ko'（韩语）、'ja'（日语）、'hi'（印地语）或 'None'。如果使用 'auto'，语言会自动检测并可能在对话过程中改变。默认是 'en'。（默认：en）
--paraformer_stt_model_name PARAFORMER_STT_MODEL_NAME, --paraformer-stt-model-name PARAFORMER_STT_MODEL_NAME
    要使用的预训练模型。默认是 'paraformer-zh'。可以从 https://github.com/modelscope/FunASR 选择（默认：paraformer-zh）
--paraformer_stt_device PARAFORMER_STT_DEVICE, --paraformer-stt-device PARAFORMER_STT_DEVICE
    模型运行的设备类型。默认是 'cuda' 用于 GPU 加速。（默认：cuda）
--faster_whisper_stt_model_name FASTER_WHISPER_STT_MODEL_NAME, --faster-whisper-stt-model-name FASTER_WHISPER_STT_MODEL_NAME
    要使用的预训练 Faster Whisper 模型。可选 ('tiny', 'tiny.en', 'base', 'base.en', 'small', 'small.en', 'distil-small.en', 'medium', 'medium.en', 'distil-medium.en', 'large-v1', 'large-v2', 'large-v3', 'large', 'distil-large-v2', 'distil-large-v3')。默认是 'small'。（默认：tiny.en）
--faster_whisper_stt_device FASTER_WHISPER_STT_DEVICE, --faster-whisper-stt-device FASTER_WHISPER_STT_DEVICE
    模型运行的设备类型。可选 ('cpu', 'cuda', 'auto')。默认是 'auto'。（默认：auto）
--faster_whisper_stt_compute_type FASTER_WHISPER_STT_COMPUTE_TYPE, --faster-whisper-stt-compute-type FASTER_WHISPER_STT_COMPUTE_TYPE
    计算使用的数据类型。可选 ('default', 'auto', 'int8', 'int8_float32', 'int8_float16', 'int8_bfloat16', 'int16', 'float16', 'float32', 'bfloat16')。默认是 'auto'。参考 'https://opennmt.net/CTranslate2/quantization.html#quantize-on-model-loading'（默认：auto）
--faster_whisper_stt_gen_max_new_tokens FASTER_WHISPER_STT_GEN_MAX_NEW_TOKENS, --faster-whisper-stt-gen-max-new-tokens FASTER_WHISPER_STT_GEN_MAX_NEW_TOKENS
    生成的最大新令牌数。默认是 128。（默认：128）
--faster_whisper_stt_gen_beam_size FASTER_WHISPER_STT_GEN_BEAM_SIZE, --faster-whisper-stt-gen-beam-size FASTER_WHISPER_STT_GEN_BEAM_SIZE
    束搜索的束数量。默认是 1，表示贪婪解码。（默认：1）
--faster_whisper_stt_gen_return_timestamps [FASTER_WHISPER_STT_GEN_RETURN_TIMESTAMPS], --faster-whisper-stt-gen-return-timestamps [FASTER_WHISPER_STT_GEN_RETURN_TIMESTAMPS]
    是否返回转录的时间戳。默认是 False。（默认：False）
--faster_whisper_stt_gen_task FASTER_WHISPER_STT_GEN_TASK, --faster-whisper-stt-gen-task FASTER_WHISPER_STT_GEN_TASK
    要执行的任务，通常是转录的 'transcribe'。默认是 'transcribe'。（默认：transcribe）
--faster_whisper_stt_gen_language FASTER_WHISPER_STT_GEN_LANGUAGE, --faster-whisper-stt-gen-language FASTER_WHISPER_STT_GEN_LANGUAGE
    要转录的语音的语言。默认是 'en' 表示英语。（默认：en）
--mlx_audio_whisper_model_name MLX_AUDIO_WHISPER_MODEL_NAME, --mlx-audio-whisper-model-name MLX_AUDIO_WHISPER_MODEL_NAME
    要使用的预训练 MLX Audio Whisper 模型。默认是 'mlx-community/whisper-large-v3-turbo'。（默认：mlx-community/whisper-large-v3-turbo）
--mlx_audio_whisper_gen_kwargs MLX_AUDIO_WHISPER_GEN_KWARGS, --mlx-audio-whisper-gen-kwargs MLX_AUDIO_WHISPER_GEN_KWARGS
    传递给模型的其他生成参数。默认是空字典。（默认：{}）
--parakeet_tdt_model_name PARAKEET_TDT_MODEL_NAME, --parakeet-tdt-model-name PARAKEET_TDT_MODEL_NAME
    要使用的 Parakeet TDT 模型。对于 MPS 默认是 'mlx-community/parakeet-tdt-0.6b-v3'，对于 CUDA/CPU 默认是 'nvidia/parakeet-tdt-0.6b-v3'。（默认：None）
--parakeet_tdt_device PARAKEET_TDT_DEVICE, --parakeet-tdt-device PARAKEET_TDT_DEVICE
    运行模型的设备。'auto' 在 macOS 上使用 MPS，否则使用 CUDA。可选：'auto', 'cuda', 'mps', 'cpu'。默认是 'auto'。（默认：auto）
--parakeet_tdt_compute_type PARAKEET_TDT_COMPUTE_TYPE, --parakeet-tdt-compute-type PARAKEET_TDT_COMPUTE_TYPE
    模型的计算类型。可选：'float16', 'float32'。默认是 'float16'。（默认：float16）
--parakeet_tdt_language PARAKEET_TDT_LANGUAGE, --parakeet-tdt-language PARAKEET_TDT_LANGUAGE
    转录的目标语言代码。如果未指定，模型将自动检测语言。支持 25 种欧洲语言。（默认：None）
--model_name MODEL_NAME, --model-name MODEL_NAME
    与 OpenAI 兼容 API 一起使用的模型。默认是 'gpt-5.4-mini'。（默认：gpt-5.4-mini）
--user_role USER_ROLE, --user-role USER_ROLE
    在聊天上下文中分配给用户的角色。默认是 'user'。（默认：user）
--init_chat_role INIT_CHAT_ROLE, --init-chat-role INIT_CHAT_ROLE
    设置聊天上下文的初始角色。默认是 'system'。（默认：system）
--init_chat_prompt INIT_CHAT_PROMPT, --init-chat-prompt INIT_CHAT_PROMPT
    为语言模型建立上下文的初始聊天提示。（默认：You are a helpful and friendly AI assistant. You are polite, respectful, and aim to provide concise responses of less than 20 words.）
--chat_size CHAT_SIZE, --chat-size CHAT_SIZE
    聊天中保留的助手-用户交互次数。（默认：30）
--stream_batch_sentences STREAM_BATCH_SENTENCES, --stream-batch-sentences STREAM_BATCH_SENTENCES
    在产生批处理前累积的句子数量。设置为 1 可实现逐句流式传输。默认是 3。（默认：3）
--enable_lang_prompt [ENABLE_LANG_PROMPT], --enable-lang-prompt [ENABLE_LANG_PROMPT]
    如果为 True，则附加一条用户消息，指示模型以检测到/选择的语言回复（例如 '请用法语回复我的消息。'）。默认是 False。（默认：False）
--responses_api_api_key RESPONSES_API_API_KEY, --responses-api-api-key RESPONSES_API_API_KEY
    用于验证 OpenAI 兼容 API 访问的 API 密钥。默认是 None。（默认：None）
--responses_api_base_url RESPONSES_API_BASE_URL, --responses-api-base-url RESPONSES_API_BASE_URL
    OpenAI 兼容 API 端点的基础 URL。默认是 None（使用 OpenAI）。（默认：None）
--responses_api_stream [RESPONSES_API_STREAM], --responses-api-stream [RESPONSES_API_STREAM]
    stream 参数通常表示数据是否应以连续流的形式传输，而不是单个完整响应，常用于处理大量或实时数据。默认是 True。（默认：True）
--no_responses_api_stream, --no-responses-api-stream
    stream 参数通常表示数据是否应以连续流的形式传输，而不是单个完整响应，常用于处理大量或实时数据。默认是 True。（默认：False）
--responses_api_disable_thinking [RESPONSES_API_DISABLE_THINKING], --responses-api-disable-thinking [RESPONSES_API_DISABLE_THINKING]
    当 OpenAI 兼容后端支持时，禁用提供商端的思考/推理。对于 Together Qwen3.5 模型，这会发送 chat_template_kwargs.enable_thinking=false。（默认：True）
--no_responses_api_disable_thinking, --no-responses-api-disable-thinking
    当 OpenAI 兼容后端支持时，禁用提供商端的思考/推理。对于 Together Qwen3.5 模型，这会发送 chat_template_kwargs.enable_thinking=false。（默认：False）
--chat_tts_stream [CHAT_TTS_STREAM], --chat-tts-stream [CHAT_TTS_STREAM]
    TTS 模式是流式。默认是 'stream'。（默认：True）
--no_chat_tts_stream, --no-chat-tts-stream
    TTS 模式是流式。默认是 'stream'。（默认：False）
--chat_tts_device CHAT_TTS_DEVICE, --chat-tts-device CHAT_TTS_DEVICE
    用于语音合成的设备。默认是 'cuda'。（默认：cuda）
--chat_tts_chunk_size CHAT_TTS_CHUNK_SIZE, --chat-tts-chunk-size CHAT_TTS_CHUNK_SIZE
    设置每个周期处理的音频数据块的大小，以平衡播放延迟和 CPU 负载。默认是 512。（默认：512）
--facebook_mms_model_name FACEBOOK_MMS_MODEL_NAME, --facebook-mms-model-name FACEBOOK_MMS_MODEL_NAME
    要使用的模型名称。默认是 'facebook/mms-tts-eng'。（默认：facebook/mms-tts-eng）
--tts_language TTS_LANGUAGE, --tts-language TTS_LANGUAGE
    TTS 模型的语言代码。默认是 'en' 表示英语。（默认：en）
--facebook_mms_device FACEBOOK_MMS_DEVICE, --facebook-mms-device FACEBOOK_MMS_DEVICE
    用于 TTS 模型的设备。默认是 'cuda'。（默认：cuda）
--facebook_mms_torch_dtype FACEBOOK_MMS_TORCH_DTYPE, --facebook-mms-torch-dtype FACEBOOK_MMS_TORCH_DTYPE
    用于 TTS 模型的 torch 数据类型。默认是 'float32'。（默认：float32）
--pocket_tts_device POCKET_TTS_DEVICE, --pocket-tts-device POCKET_TTS_DEVICE
    Pocket TTS 模型运行的设备类型。可选：'cpu', 'cuda', 'mps'。默认是 'cpu'。（默认：cpu）
--pocket_tts_voice POCKET_TTS_VOICE, --pocket-tts-voice POCKET_TTS_VOICE
    用于 Pocket TTS 的声音。可以是预设名称（'alba', 'marius', 'javert', 'jean', 'fantine', 'cosette', 'eponine', 'azelma'）、本地音频文件路径或 HuggingFace 路径，如 'hf://kyutai/tts-voices/...'。默认是 'jean'。（默认：jean）
--pocket_tts_sample_rate POCKET_TTS_SAMPLE_RATE, --pocket-tts-sample-rate POCKET_TTS_SAMPLE_RATE
    Pocket TTS 的输出采样率（Hz）。Pocket TTS 内部使用 24kHz，但会被重采样到此速率以匹配音频输出。默认是 16000，以匹配流水线的音频流媒体。（默认：16000）
--pocket_tts_blocksize POCKET_TTS_BLOCKSIZE, --pocket-tts-blocksize POCKET_TTS_BLOCKSIZE
    在 Pocket TTS 中流式传输产生的音频块大小。默认是 512。（默认：512）
--pocket_tts_max_tokens POCKET_TTS_MAX_TOKENS, --pocket-tts-max-tokens POCKET_TTS_MAX_TOKENS
    Pocket TTS 中每个句子生成的最大令牌数。默认是 50。（默认：50）
--kokoro_model_name KOKORO_MODEL_NAME, --kokoro-model-name KOKORO_MODEL_NAME
    要使用的 Kokoro TTS 模型。根据设备自动选择：MPS 使用 'mlx-community/Kokoro-82M-bf16'，CUDA/CPU 使用 'hexgrad/Kokoro-82M'。（默认：None）
--kokoro_device KOKORO_DEVICE, --kokoro-device KOKORO_DEVICE
    运行 Kokoro TTS 的设备。可选：'auto', 'cuda', 'cpu', 'mps'。默认是 'auto'（在 Mac 上使用 MPS，在 GPU 系统上使用 CUDA）。（默认：auto）
--kokoro_voice KOKORO_VOICE, --kokoro-voice KOKORO_VOICE
    用于合成的声音。有关选项，请参阅 Kokoro 仓库中的 VOICES.md。默认是 'bm_fable'（英式男声）。（默认：bm_fable）
--kokoro_lang_code KOKORO_LANG_CODE, --kokoro-lang-code KOKORO_LANG_CODE
    语言代码：'a' 表示美式英语，'b' 表示英式英语，'j' 表示日语等。默认是 'b'。（默认：b）
--kokoro_speed KOKORO_SPEED, --kokoro-speed KOKORO_SPEED
    语速乘数。值 > 1.0 加速，< 1.0 减速。默认是 1.0。（默认：1.0）
--kokoro_blocksize KOKORO_BLOCKSIZE, --kokoro-blocksize KOKORO_BLOCKSIZE
    流式输出的音频块大小（样本数）。默认是 512。（默认：512）
--qwen3_tts_model_name QWEN3_TTS_MODEL_NAME, --qwen3-tts-model-name QWEN3_TTS_MODEL_NAME
    要使用的 Qwen3-TTS 模型（HuggingFace Hub ID 或本地路径）。默认是 'Qwen/Qwen3-TTS-12Hz-1.7B-CustomVoice'。在 Apple Silicon 上，Qwen/* 模型 ID 会尽可能自动映射到相应的 mlx-community/* 模型，除非模型名称已指定特定后缀，否则默认使用 6bit MLX 变体。（默认：Qwen/Qwen3-TTS-12Hz-1.7B-CustomVoice）
--qwen3_tts_device QWEN3_TTS_DEVICE, --qwen3-tts-device QWEN3_TTS_DEVICE
    Qwen3-TTS 的首选设备。可选：'cuda', 'cpu', 'mps', 'auto'。默认是 'cuda'。在 Apple Silicon 上会自动选择 mlx-audio 后端。（默认：cuda）
--qwen3_tts_dtype QWEN3_TTS_DTYPE, --qwen3-tts-dtype QWEN3_TTS_DTYPE
    推理的数据类型。可选：'auto', 'float16', 'bfloat16', 'float32'。默认是 'auto'。（默认：auto）
--qwen3_tts_attn_implementation QWEN3_TTS_ATTN_IMPLEMENTATION, --qwen3-tts-attn-implementation QWEN3_TTS_ATTN_IMPLEMENTATION
    注意力实现。可选：'eager', 'flash_attention_2', 'sdpa'。在 Jetson 上使用 'eager'。默认是 'eager'。（默认：eager）
--qwen3_tts_ref_audio QWEN3_TTS_REF_AUDIO, --qwen3-tts-ref-audio QWEN3_TTS_REF_AUDIO
    用于声音克隆的参考音频文件的可选路径。使用 CustomVoice 模型时请保持未设置状态。（默认：None）
--qwen3_tts_ref_text QWEN3_TTS_REF_TEXT, --qwen3-tts-ref-text QWEN3_TTS_REF_TEXT
    用于声音克隆的参考音频的转录文本。（默认：I'm confused why some people have super short timelines, yet at the same time are bullish on scaling up reinforcement learning atop LLMs. If we're actually close to a human-like learner, then this whole approach of training on verifiable outcomes.）
--qwen3_tts_speaker QWEN3_TTS_SPEAKER, --qwen3-tts-speaker QWEN3_TTS_SPEAKER
    用于 CustomVoice 模型的说话人名称。默认是 'Aiden'。如果未提供，当可用时使用第一个支持的说话人。（默认：Aiden）
--qwen3_tts_instruct QWEN3_TTS_INSTRUCT, --qwen3-tts-instruct QWEN3_TTS_INSTRUCT
    用于 VoiceDesign 模型的指令文本（声音设计需要）。（默认：None）
--qwen3_tts_xvec_only [QWEN3_TTS_XVEC_ONLY], --qwen3-tts-xvec-only [QWEN3_TTS_XVEC_ONLY]
    仅使用 x-vector 声音克隆模式（推荐用于更清晰的开头和语言切换）。默认是 False。（默认：False）
--qwen3_tts_parity_mode [QWEN3_TTS_PARITY_MODE], --qwen3-tts-parity-mode [QWEN3_TTS_PARITY_MODE]
    禁用 CUDA-graph 流式传输路径并使用奇偶校验模式以提高稳定性。默认是 False。（默认：False）
--qwen3_tts_non_streaming_mode [QWEN3_TTS_NON_STREAMING_MODE], --qwen3-tts-non-streaming-mode [QWEN3_TTS_NON_STREAMING_MODE]
    Qwen3-TTS 文本预填充行为的可选覆盖。默认值为 true，即在 faster-qwen3-tts 上解码前预填充完整的目标文本。
```
