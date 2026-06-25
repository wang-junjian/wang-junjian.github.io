---
type: article
title:  "Reachy Mini Conversation App"
date:   2026-05-18 20:00:00 +0800
tags: [reachy_mini_conversation_app, 语音智能体, Hugging Face, Reachy Mini]
---

## 源码安装

### 克隆 Reachy Mini Conversation App

```bash
git clone https://github.com/wang-junjian/reachy_mini_conversation_app
cd reachy_mini_conversation_app
```

### 创建虚拟环境并安装依赖

```bash
uv venv --python 3.12
source .venv/bin/activate
uv sync
```

⚠️ **注意**：要完全复现此仓库 uv.lock 文件中的依赖关系，请运行 `uv sync --frozen` 命令。这将确保 uv 直接从 lock 文件安装依赖项，而无需重新解析或更新任何版本。

### 安装可选功能

```bash
uv sync --extra local_vision         # Local PyTorch/Transformers vision
uv sync --extra yolo_vision          # YOLO face-detection backend for head tracking
uv sync --extra mediapipe_vision     # MediaPipe-based head-tracking
uv sync --extra all_vision           # All vision features
```

合并额外功能或包含开发依赖项：

```bash
uv sync --extra all_vision --group dev
```


## 运行 Speech to Speech（实时模式）

```bash
speech-to-speech \
    --mode realtime \
    --device mps \
    --stt faster-whisper \
    --faster_whisper_stt_model_name small \
    --faster_whisper_stt_gen_language zh \
    --language zh \
    --llm_backend mlx-lm \
    --model_name mlx-community/Qwen3.5-4B-OptiQ-4bit \
    --init_chat_prompt "你是一位乐于助人、待人友善的人工智能助手。你礼貌谦和、尊重他人，且回复力求简洁。" \
    --tts qwen3 \
    --no_enable_live_transcription
```


## 运行应用

### 配置环境变量

编辑配置文件 `.env`

```
HF_REALTIME_CONNECTION_MODE=local
HF_REALTIME_WS_URL=ws://localhost:8765/v1/realtime
BACKEND_PROVIDER=huggingface
```

### 运行 Reachy Mini Conversation App

实时语音对话

```bash
reachy-mini-conversation-app
```

实时语音对话，使用 `mediapipe` 进行头部追踪。

```bash
reachy-mini-conversation-app --head-tracker mediapipe
```


## 架构分析

**Reachy Mini Conversation App** 是一个**分层实时对话机器人应用**。

### 📐 整体架构

项目采用**四层分层架构**：

```
用户 → UI层 → 后端处理 → 工具执行 → 机器人运动
       ↑                           ↓
       ←—— 音频/结果反馈 ←———————←
```

---

### 🔧 核心模块详解

#### **1. 后端处理层** (base_realtime.py, huggingface_realtime.py, `openai_realtime.py`, gemini_live.py)

| 后端 | 特点 | 应用场景 |
|------|------|--------|
| **Hugging Face** | 默认，支持本地端点 | 快速原型，隐私优先 |
| **OpenAI Realtime** | 低延迟GPT-4对话 | 高质量对话 |
| **Gemini Live** | 多模态能力 | 复杂推理任务 |

- 统一抽象：ConversationHandler 基类定义通用接口
- 核心职责：音频流处理、工具调用分发、实时转录

#### **2. 对话处理器** (ConversationHandler)

**实现**：`HuggingFaceRealtimeHandler` / `OpenAIRealtimeHandler` / `GeminiLiveHandler`

**关键方法**：
- `receive()` - 接收音频帧
- `emit()` - 输出音频或事件
- `apply_personality()` - 应用个性化配置
- `change_voice()` - 切换语音

#### **3. 工具层** (`tools/` 目录)

**核心工具框架**：
- core_tools.py 基类 - 所有工具的抽象
- core_tools.py - 工具运行时依赖注入

**内置工具**：
```
move_head          - 头部姿态控制
dance / stop_dance - 编舞库集成
play_emotion / stop_emotion - 情感动作
camera             - 图像捕获与分析
head_tracking      - 面部追踪
idle_do_nothing    - 空闲模式
```

**异步调度**：BackgroundToolManager
- 非阻塞工具执行
- 可追踪、可取消
- 完成通知机制

#### **4. 运动控制层** (MovementManager)

**分层设计**：
```
主要动作（互斥）       次要动作（加性）
─────────────────     ──────────────
舞蹈                 头部摇晃（语音同步）
情感                 头部追踪（面部识别）
呼吸                 
姿态转移
```

**控制特点**：
- 独立工作线程 + 命令队列
- 60Hz 控制环，单点控制 `robot.set_target()`
- 安全插值避免跳跃

#### **5. 摄像头与视觉** (CameraWorker)

- 线程安全的帧缓冲
- 可选头部追踪：YOLO / MediaPipe
- 面部丢失延迟（2s）+ 平滑插值

**视觉处理**：
- 远端：调用后端LLM分析
- 本地（可选）：SmolVLM2本地部署 (`--local-vision`)

---

### 📦 个性化系统 (Profiles)

**结构**：`profiles/<name>/`
```
instructions.txt     - 系统提示词模板
tools.txt           - 启用工具列表
voice.txt           - 声音选择（可选）
sweep_look.py       - 自定义工具（可选）
```

**特性**：
- 内置配置 vs 外部配置
- 配置热加载（Gradio UI）
- 个性化管理：PersonalityUI / HeadlessPU
- 锁定模式：`LOCKED_PROFILE` 常量禁用切换

---

### 🎛️ UI层

**双UI支持**：

| UI类型 | 特点 | 适用 |
|--------|------|------|
| **Gradio** (`--gradio`) | 完整Web界面 | 交互、实时转录 |
| **控制台** (默认) | 终端输出 | 无头部署、服务器 |
| **设置面板** | FastAPI REST | 后台配置管理 |

---

### 🔌 配置与扩展性

**配置**：config.py
- 环境变量驱动：.env / 启动参数
- 后端选择、API密钥、连接模式、本地模型

**外部扩展**：
```env
REACHY_MINI_EXTERNAL_PROFILES_DIRECTORY=./external_content/external_profiles
REACHY_MINI_EXTERNAL_TOOLS_DIRECTORY=./external_content/external_tools
AUTOLOAD_EXTERNAL_TOOLS=1  # 便捷模式自动加载
```

---

### 📊 数据流示例

```
用户语音 
  ↓
UI (Gradio/Console) 
  ↓
后端 (HF/OpenAI/Gemini)
  ├→ LLM理解意图
  ├→ 生成工具调用
  └→ 返回音频
  ↓
工具调度器
  ├→ dance: 运动队列
  ├→ camera: 图像捕获
  ├→ move_head: 头部控制
  └→ 返回结果
  ↓
运动管理器 → 机器人控制
  ├→ 主动作执行
  ├→ 次动作混合
  └→ 60Hz 实时控制
```

---

### 🎯 核心设计优势

1. **多后端支持** - 灵活切换LLM服务
2. **可扩展工具系统** - 内置+自定义+外部工具
3. **实时性** - 低延迟音频流、60Hz运动控制
4. **分层架构** - 各层相对独立，便于修改
5. **个性化** - 配置文件驱动，无需代码改动
6. **安全运动** - 线程隔离、平滑插值、互斥控制
