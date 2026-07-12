---
type: article
title: "WorkBuddy：iOA 渠道模型完整对照表"
date: 2026-07-12 23:34:00 +0800
tags: [workbuddy, agent, models, ioa]
---

> 数据来源：`cli/product.ioa.json`（iOA 部署渠道覆盖层）  
> 共 **82** 个模型条目，按路由代号（vendor）分组。

## 一、概览

- **模型总数**：82
- **支持工具调用 (toolCall)**：67 / 82
- **支持图像 (images)**：67 / 82
- **支持推理 (reasoning)**：50 / 82
- **仅推理 (onlyReasoning)**：44 / 82
- **默认模型 (isDefault)**：1

### 路由代号（vendor）分布

| 路由代号 | 数量 | 说明 |
|---------|------|------|
| `e` | 33 | 外部聚合（多为国内厂商模型） |
| `f` | 22 | 首方/海外聚合 |
| `tencent` | 7 | TACO 代码补全/轻量子模型通道（非对话模型，能力字段为 None） |
| `j` | 7 | 特定海外模型 |
| `i` | 2 | iOA 专属条目 |
| `None` | 11 | 未标注（auto/default 等特殊聚合项） |

> **注意**：vendor 是后端路由代号，并非明文厂商名；同一逻辑模型在不同渠道 vendor 可能不同（例如 `minimax-m2.5` 在基座是 `f`、在 cloudhosted 是 `e`）。下表「推测来源」列按模型 id 名称推断，仅供参考，非配置字段。

### 推理档位（reasoning.effort）分布

| effort 档位 | 数量 |
|------------|------|
| medium | 25 |
| (无effort字段) | 17 |
| high | 8 |

### 计费倍率（credits）分布

> 空值 = 未显式声明（按渠道默认计费，多为 x1.00）。

| credits | 数量 |
|---------|------|
|  | 67 |
| x0.00 credits | 1 |
| x0.05 credits | 1 |
| x0.13 credits | 1 |
| x0.25 credits | 1 |
| x0.99 credits | 1 |
| x1.14 credits | 1 |
| x1.32 credits | 1 |
| x1.78 credits | 1 |
| x2.00 credits | 1 |
| x3.31 credits | 1 |
| x3.33 credits | 2 |
| x4.96 credits | 1 |
| x5.00 credits | 2 |

## 二、能力矩阵（按厂商）

| 厂商 | 总数 | 工具调用 | 图像 | 推理 | 仅推理 |
|------|------|---------|------|------|--------|
| `e` | 33 | 33 | 33 | 28 | 25 |
| `f` | 22 | 22 | 22 | 13 | 12 |
| `tencent` | 7 | 0 | 0 | 0 | 0 |
| `j` | 7 | 7 | 7 | 5 | 5 |
| `i` | 2 | 2 | 2 | 2 | 2 |

> **解读**：`tencent` 组的 7 个条目（如 `hunyuan-3b`、`hunyuan-7b-dense`、`*taco*`、`*completion*`、`nes-gf`）能力字段均为 `None`、`maxOutputTokens` 多为 256，属于 **TACO 代码补全/轻量子模型专用通道**，不承接普通对话，故工具/图像/推理计数为 0，并非「不支持」而是「未声明对话能力」。`None` 组 11 个均为图像/视频生成模型（见第四节）。

## 三、完整对照表（按厂商分组）

### 厂商 `e` — 外部聚合（多为国内厂商模型）（33 个）

| ID | 名称 | 推测来源 | 工具 | 图像 | 推理 | 仅推理 | effort | credits | 上下文(in/out) | 默认 | 关联(lite→reasoning) |
|----|------|---------|------|------|------|--------|--------|---------|----------------|------|----------------------|
| `claude-3.7` | Claude-3.7-Sonnet | Anthropic | ✓ | ✓ | ✓ | ✓ |  |  | 200000/8192 |  | — |
| `claude-4.0` | Claude-Sonnet-4.0 | Anthropic | ✓ | ✓ | ✓ | ✓ |  |  | 176000/24000 | ★ | — |
| `claude-4.5` | Claude-Sonnet-4.5 | Anthropic | ✓ | ✓ | ✓ | ✓ |  |  | 176000/24000 |  | — |
| `claude-haiku-4.5` | Claude-Haiku-4.5 | Anthropic | ✓ | ✓ | ✓ | ✓ |  |  | 176000/24000 |  | claude-haiku-4.5→claude-opus-4.8 |
| `claude-opus-4.5` | Claude-Opus-4.5 | Anthropic | ✓ | ✓ | ✓ | ✓ |  |  | 176000/24000 |  | — |
| `claude-opus-4.6` | Claude-Opus-4.6 | Anthropic | ✓ | ✓ | ✓ | ✓ |  |  | 176000/24000 |  | claude-haiku-4.5→claude-opus-4.6 |
| `claude-opus-4.6-1m` | Claude-Opus-4.6 (1M context) | Anthropic | ✓ | ✓ | ✓ | ✓ |  |  | 1000000/24000 |  | claude-haiku-4.5→claude-opus-4.6-1m |
| `claude-opus-4.7` | Claude-Opus-4.7 | Anthropic | ✓ | ✓ | ✓ | ✓ |  |  | 176000/24000 |  | claude-haiku-4.5→claude-opus-4.7 |
| `claude-opus-4.7-1m` | Claude-Opus-4.7 (1M context) | Anthropic | ✓ | ✓ | ✓ | ✓ |  |  | 1000000/24000 |  | claude-haiku-4.5→claude-opus-4.7-1m |
| `claude-opus-4.8` | Claude-Opus-4.8 | Anthropic | ✓ | ✓ | ✓ | — |  | x3.33 credits | 176000/24000 |  | claude-haiku-4.5→claude-opus-4.8 |
| `claude-opus-4.8-1m` | Claude-Opus-4.8-1M | Anthropic | ✓ | ✓ | ✓ | — |  | x3.33 credits | 1000000/24000 |  | claude-haiku-4.5→claude-opus-4.8-1m |
| `claude-sonnet-4.6` | Claude-Sonnet-4.6 | Anthropic | ✓ | ✓ | ✓ | — |  | x2.00 credits | 176000/24000 |  | claude-haiku-4.5→claude-opus-4.6 |
| `claude-sonnet-4.6-1m` | Claude-Sonnet-4.6 (1M context) | Anthropic | ✓ | ✓ | ✓ | ✓ |  |  | 1000000/24000 |  | claude-haiku-4.5→claude-opus-4.6-1m |
| `default-1.2` | Claude-4.0-Sonnet | 兜底模型 | ✓ | ✓ | ✓ | ✓ |  |  | 200000/24000 |  | — |
| `gemini-3.1-flash-lite` | Gemini-3.1-flash-lite | Google | ✓ | ✓ | ✓ | ✓ | medium |  | 200000/65536 |  | — |
| `gemini-3.5-flash` | Gemini-3.5-Flash | Google | ✓ | ✓ | ✓ | ✓ | medium | x0.99 credits | 1000000/65536 |  | claude-haiku-4.5→gemini-3.5-flash |
| `glm-5.0-turbo-ioa` | GLM-5.0-Turbo | 智谱 AI | ✓ | ✓ | ✓ | ✓ | medium |  | 200000/48000 |  | — |
| `glm-5.1-ioa` | GLM-5.1 | 智谱 AI | ✓ | ✓ | ✓ | ✓ | medium |  | 200000/48000 |  | glm-5.1-ioa→glm-5.1-ioa |
| `glm-5v-turbo-ioa` | GLM-5v-Turbo | 智谱 AI | ✓ | ✓ | ✓ | ✓ | medium |  | 200000/38000 |  | glm-5v-turbo-ioa→glm-5v-turbo-ioa |
| `gpt-5` | GPT-5 | OpenAI | ✓ | ✓ | — | — |  |  | 272000/72000 |  | — |
| `gpt-5-codex` | GPT-5-Codex | OpenAI | ✓ | ✓ | — | — |  |  | 272000/72000 |  | — |
| `gpt-5-mini` | GPT-5-Mini | OpenAI | ✓ | ✓ | — | — |  |  | 272000/72000 |  | — |
| `gpt-5-nano` | GPT-5-nano | OpenAI | ✓ | ✓ | — | — |  |  | 200000/72000 |  | — |
| `gpt-5.1` | GPT-5.1 | OpenAI | ✓ | ✓ | ✓ | ✓ | medium |  | 272000/72000 |  | — |
| `gpt-5.1-codex` | GPT-5.1-Codex | OpenAI | ✓ | ✓ | ✓ | ✓ | medium |  | 272000/72000 |  | claude-haiku-4.5→gpt-5.1-codex |
| `gpt-5.1-codex-max` | GPT-5.1-Codex-Max | OpenAI | ✓ | ✓ | ✓ | ✓ | medium |  | 272000/72000 |  | — |
| `gpt-5.1-codex-mini` | GPT-5.1-Codex-Mini | OpenAI | ✓ | ✓ | ✓ | ✓ | medium |  | 272000/72000 |  | gpt-5.1-codex-mini→gpt-5.1-codex-mini |
| `gpt-5.2` | GPT-5.2 | OpenAI | ✓ | ✓ | ✓ | ✓ | medium |  | 272000/72000 |  | — |
| `gpt-5.2-codex` | GPT-5.2-Codex | OpenAI | ✓ | ✓ | ✓ | ✓ | medium |  | 272000/72000 |  | — |
| `gpt-5.3-codex` | GPT-5.3-Codex | OpenAI | ✓ | ✓ | ✓ | ✓ | medium |  | 272000/72000 |  | claude-haiku-4.5→gpt-5.3-codex |
| `gpt-5.4` | GPT-5.4 | OpenAI | ✓ | ✓ | ✓ | ✓ | high |  | 272000/72000 |  | claude-haiku-4.5→gpt-5.4 |
| `gpt-5.5` | GPT-5.5 | OpenAI | ✓ | ✓ | ✓ | ✓ | high | x3.31 credits | 1000000/72000 |  | claude-haiku-4.5→gpt-5.5 |
| `o4-mini` | GPT-4o-Mini | OpenAI | ✓ | ✓ | — | — |  |  | 104000/24000 |  | — |

### 厂商 `f` — 首方/海外聚合（22 个）

| ID | 名称 | 推测来源 | 工具 | 图像 | 推理 | 仅推理 | effort | credits | 上下文(in/out) | 默认 | 关联(lite→reasoning) |
|----|------|---------|------|------|------|--------|--------|---------|----------------|------|----------------------|
| `codewise-default-model-v2` | Default | 兜底模型 | ✓ | ✓ | — | — |  |  | 96000/32000 |  | — |
| `deepseek-r1-0528-gf` | DeepSeek-R1-0528 | DeepSeek | ✓ | ✓ | — | — |  |  | 96000/8192 |  | — |
| `deepseek-r1-0528-lkeap` | DeepSeek-R1-0528 | DeepSeek | ✓ | ✓ | — | — |  |  | 96000/16000 |  | — |
| `deepseek-v3-0324-gf` | DeepSeek-V3-0324 | DeepSeek | ✓ | ✓ | — | — |  |  | 96000/8192 |  | — |
| `deepseek-v3-0324-lkeap` | DeepSeek-V3-0324 | DeepSeek | ✓ | ✓ | — | — |  |  | 112000/16000 |  | — |
| `deepseek-v3-1` | DeepSeek-V3.1 | DeepSeek | ✓ | ✓ | — | — |  |  | 96000/32000 |  | — |
| `deepseek-v3-1-gf` | DeepSeek-V3-1 | DeepSeek | ✓ | ✓ | — | — |  |  | 64000/8192 |  | — |
| `deepseek-v3-1-lkeap` | DeepSeek-V3-1 | DeepSeek | ✓ | ✓ | — | — |  |  | 96000/32000 |  | — |
| `deepseek-v3-1-volc` | DeepSeek-V3-1-Terminus | DeepSeek | ✓ | ✓ | — | — |  |  | 96000/32000 |  | — |
| `deepseek-v3-2-volc-ioa` | DeepSeek-V3.2 | DeepSeek | ✓ | ✓ | ✓ | ✓ | medium |  | 96000/32000 |  | deepseek-v3-2-volc-ioa→deepseek-v3-2-volc-ioa |
| `deepseek-v4-flash-ioa` | Deepseek-V4-Flash | DeepSeek | ✓ | ✓ | ✓ | ✓ | high | x0.05 credits | 1000000/50000 |  | deepseek-v4-flash-ioa→deepseek-v4-pro-ioa |
| `deepseek-v4-pro-ioa` | Deepseek-V4-Pro | DeepSeek | ✓ | ✓ | ✓ | ✓ | high | x0.13 credits | 1000000/50000 |  | deepseek-v4-flash-ioa→deepseek-v4-pro-ioa |
| `glm-4.6-ioa` | GLM-4.6 | 智谱 AI | ✓ | ✓ | ✓ | — |  |  | 168000/32000 |  | glm-4.6-ioa→glm-4.6-ioa |
| `glm-4.6v-ioa` | GLM-4.6V | 智谱 AI | ✓ | ✓ | ✓ | ✓ | medium |  | 128000/32000 |  | glm-4.6v-ioa→glm-4.6v-ioa |
| `glm-4.7-ioa` | GLM-4.7 | 智谱 AI | ✓ | ✓ | ✓ | ✓ | medium |  | 200000/48000 |  | glm-4.7-ioa→glm-4.7-ioa |
| `glm-5.0-ioa` | GLM-5.0 | 智谱 AI | ✓ | ✓ | ✓ | ✓ | medium |  | 200000/48000 |  | glm-5.0-ioa→glm-5.0-ioa |
| `kimi-k2-thinking` | Kimi-K2-Thinking | 月之暗面 | ✓ | ✓ | ✓ | ✓ | medium |  | 256000/32000 |  | kimi-k2-thinking→kimi-k2-thinking |
| `kimi-k2.5-ioa` | Kimi-K2.5 | 月之暗面 | ✓ | ✓ | ✓ | ✓ | medium |  | 256000/32000 |  | — |
| `kimi-k2.6-ioa` | Kimi-K2.6 | 月之暗面 | ✓ | ✓ | ✓ | ✓ | medium |  | 256000/32000 |  | kimi-k2.6-ioa→kimi-k2.6-ioa |
| `minimax-m2.5-ioa` | MiniMax-M2.5 | MiniMax | ✓ | ✓ | ✓ | ✓ | medium |  | 200000/48000 |  | minimax-m2.5-ioa→minimax-m2.5-ioa |
| `minimax-m2.7-ioa` | MiniMax-M2.7 | MiniMax | ✓ | ✓ | ✓ | ✓ | medium |  | 200000/48000 |  | minimax-m2.7-ioa→minimax-m2.7-ioa |
| `minimax-m3-ioa` | MiniMax-M3 | MiniMax | ✓ | ✓ | ✓ | ✓ | medium | x0.25 credits | 512000/48000 |  | minimax-m3-ioa→minimax-m3-ioa |

### 厂商 `tencent` — TACO 代码补全/轻量子模型通道（非对话模型，能力字段为 None）（7 个）

| ID | 名称 | 推测来源 | 工具 | 图像 | 推理 | 仅推理 | effort | credits | 上下文(in/out) | 默认 | 关联(lite→reasoning) |
|----|------|---------|------|------|------|--------|--------|---------|----------------|------|----------------------|
| `deepseek-r1-0528` | deepseek-r1 | DeepSeek | — | — | — | — |  |  | 96000/8192 |  | — |
| `deepseek-v3-0324` | deepseek-v3 | DeepSeek | — | — | — | — |  |  | 96000/8192 |  | — |
| `deepseek-v3-0324-taco` | deepseek-v3-taco | DeepSeek | — | — | — | — |  |  | /8192 |  | — |
| `deepseek-v3-0324-taco-completion` | deepseek-v3-0324 | DeepSeek | — | — | — | — |  |  | /256 |  | — |
| `hunyuan-3b` | hunyuan-3b | 腾讯混元 | — | — | — | — |  |  | /256 |  | — |
| `hunyuan-7b-dense` | hunyuan-7b | 腾讯混元 | — | — | — | — |  |  | /256 |  | — |
| `nes-gf` | nes-gf | — | — | — | — | — |  |  | /256 |  | — |

### 厂商 `j` — 特定海外模型（7 个）

| ID | 名称 | 推测来源 | 工具 | 图像 | 推理 | 仅推理 | effort | credits | 上下文(in/out) | 默认 | 关联(lite→reasoning) |
|----|------|---------|------|------|------|--------|--------|---------|----------------|------|----------------------|
| `completion-gf` | completion-gf | — | ✓ | ✓ | — | — |  |  | 200000/8192 |  | — |
| `hunyuan-2.0-instruct-ioa` | Hunyuan-2.0-Instruct | 腾讯混元 | ✓ | ✓ | ✓ | ✓ | medium |  | 128000/16000 |  | — |
| `hunyuan-2.0-thinking-ioa` | Hunyuan-2.0-Thinking | 腾讯混元 | ✓ | ✓ | ✓ | ✓ | medium |  | 128000/24000 |  | — |
| `hunyuan-chat` | Hunyuan-Turbos | 腾讯混元 | ✓ | ✓ | — | — |  |  | 128000/8192 |  | — |
| `hy3-dev-0402` | HY3-dev0402 | — | ✓ | ✓ | ✓ | ✓ | high |  | 223000/32000 |  | — |
| `hy3-preview-agent-ioa` | Hy3 preview | — | ✓ | ✓ | ✓ | ✓ | high | x0.00 credits | 192000/64000 |  | hy3-preview-agent-ioa→hy3-preview-agent-ioa |
| `hy3-preview-ioa` | Hy3 preview | — | ✓ | ✓ | ✓ | ✓ | high |  | 192000/64000 |  | hy3-preview-ioa→hy3-preview-ioa |

### 厂商 `i` — iOA 专属条目（2 个）

| ID | 名称 | 推测来源 | 工具 | 图像 | 推理 | 仅推理 | effort | credits | 上下文(in/out) | 默认 | 关联(lite→reasoning) |
|----|------|---------|------|------|------|--------|--------|---------|----------------|------|----------------------|
| `gemini-3.0-flash` | Gemini-3.0-Flash | Google | ✓ | ✓ | ✓ | ✓ | medium |  | 200000/32000 |  | — |
| `gemini-3.0-pro` | Gemini-3.0-Pro | Google | ✓ | ✓ | ✓ | ✓ | high |  | 200000/32000 |  | — |

### 厂商 `None` — 未标注（auto/default 等特殊聚合项）（11 个）

| ID | 名称 | 推测来源 | 工具 | 图像 | 推理 | 仅推理 | effort | credits | 上下文(in/out) | 默认 | 关联(lite→reasoning) |
|----|------|---------|------|------|------|--------|--------|---------|----------------|------|----------------------|
| `default-image-generation` | default-image | 兜底模型 | — | — | — | — |  |  | — |  | — |
| `gemini-2.5-flash` | Gemini-2.5-Flash | Google | ✓ | ✓ | — | — |  |  | 200000/32000 |  | — |
| `gemini-2.5-flash-image` | Gemini-2.5-Flash-Image | Google | — | — | — | — |  | x1.14 credits | — |  | — |
| `gemini-2.5-pro` | Gemini-2.5-Pro | Google | ✓ | ✓ | ✓ | — |  |  | 200000/64000 |  | claude-haiku-4.5→gemini-2.5-pro |
| `gemini-3.0-pro-image` | Gemini-3.0-Pro-Image | Google | — | — | — | — |  | x4.96 credits | — |  | — |
| `gemini-3.1-flash-image` | Gemini-3.1-Flash-Image | Google | — | — | — | — |  | x1.78 credits | — |  | — |
| `gemini-3.1-pro` | Gemini-3.1-Pro | Google | ✓ | ✓ | ✓ | — |  | x1.32 credits | 400000/64000 |  | claude-haiku-4.5→gemini-3.1-pro |
| `hunyuan-image-v2.0-general-edit-ioa` | Hunyuan-Image-Edit | 腾讯混元 | — | — | — | — |  | x5.00 credits | — |  | — |
| `hunyuan-image-v3.0-ioa` | Hunyuan-Image-V3 | 腾讯混元 | — | — | — | — |  | x5.00 credits | — |  | — |
| `kling-v3-i2v` | Kling-V3-I2V | — | — | — | — | — |  |  | — |  | — |
| `kling-v3-t2v` | Kling-V3-T2V | — | — | — | — | — |  |  | — |  | — |

## 四、特殊条目说明

### 未标注 vendor 的条目（11 个）

> **解读**：这 11 个全部是**图像/视频生成模型**（ID 含 `image` / `video` / `kling`，或 `default-image-generation` 兜底项）。它们走专门的生成通道而非对话路由，因此 `vendor` 为空是设计使然，并非配置缺失。

- **`gemini-3.1-pro`** — Gemini-3.1-Pro：supportsReasoning=True, onlyReasoning=None, isDefault=None, credits=x1.32 credits
- **`gemini-2.5-pro`** — Gemini-2.5-Pro：supportsReasoning=True, onlyReasoning=None, isDefault=None, credits=
- **`gemini-3.0-pro-image`** — Gemini-3.0-Pro-Image：supportsReasoning=None, onlyReasoning=None, isDefault=None, credits=x4.96 credits
- **`gemini-3.1-flash-image`** — Gemini-3.1-Flash-Image：supportsReasoning=None, onlyReasoning=None, isDefault=None, credits=x1.78 credits
- **`gemini-2.5-flash-image`** — Gemini-2.5-Flash-Image：supportsReasoning=None, onlyReasoning=None, isDefault=None, credits=x1.14 credits
- **`hunyuan-image-v3.0-ioa`** — Hunyuan-Image-V3：supportsReasoning=None, onlyReasoning=None, isDefault=None, credits=x5.00 credits
- **`hunyuan-image-v2.0-general-edit-ioa`** — Hunyuan-Image-Edit：supportsReasoning=None, onlyReasoning=None, isDefault=None, credits=x5.00 credits
- **`kling-v3-t2v`** — Kling-V3-T2V：supportsReasoning=None, onlyReasoning=None, isDefault=None, credits=
- **`kling-v3-i2v`** — Kling-V3-I2V：supportsReasoning=None, onlyReasoning=None, isDefault=None, credits=
- **`gemini-2.5-flash`** — Gemini-2.5-Flash：supportsReasoning=None, onlyReasoning=None, isDefault=None, credits=
- **`default-image-generation`** — default-image：supportsReasoning=None, onlyReasoning=None, isDefault=None, credits=

### 默认与智能路由

> **iOA 渠道无 `auto` 智能路由模型**（基座 `product.json` 中 `auto` 才带 `isDefault`）。本渠道默认模型由覆盖层改为 **`claude-4.0`**（vendor `e`，`isDefault=true`）。

- **`claude-4.0`** — Claude-Sonnet-4.0：`isDefault ✓`  适合日常使用，在大多数任务上表现良好

## 五、仅推理（onlyReasoning）模型清单

共 44 个（推理专用，不承接普通对话）：

- `claude-3.7` （vendor `e`）
- `claude-4.0` （vendor `e`）
- `claude-4.5` （vendor `e`）
- `claude-haiku-4.5` （vendor `e`）
- `claude-opus-4.5` （vendor `e`）
- `claude-opus-4.6` （vendor `e`）
- `claude-opus-4.6-1m` （vendor `e`）
- `claude-opus-4.7` （vendor `e`）
- `claude-opus-4.7-1m` （vendor `e`）
- `claude-sonnet-4.6-1m` （vendor `e`）
- `deepseek-v3-2-volc-ioa` （vendor `f`）
- `deepseek-v4-flash-ioa` （vendor `f`）
- `deepseek-v4-pro-ioa` （vendor `f`）
- `default-1.2` （vendor `e`）
- `gemini-3.0-flash` （vendor `i`）
- `gemini-3.0-pro` （vendor `i`）
- `gemini-3.1-flash-lite` （vendor `e`）
- `gemini-3.5-flash` （vendor `e`）
- `glm-4.6v-ioa` （vendor `f`）
- `glm-4.7-ioa` （vendor `f`）
- `glm-5.0-ioa` （vendor `f`）
- `glm-5.0-turbo-ioa` （vendor `e`）
- `glm-5.1-ioa` （vendor `e`）
- `glm-5v-turbo-ioa` （vendor `e`）
- `gpt-5.1` （vendor `e`）
- `gpt-5.1-codex` （vendor `e`）
- `gpt-5.1-codex-max` （vendor `e`）
- `gpt-5.1-codex-mini` （vendor `e`）
- `gpt-5.2` （vendor `e`）
- `gpt-5.2-codex` （vendor `e`）
- `gpt-5.3-codex` （vendor `e`）
- `gpt-5.4` （vendor `e`）
- `gpt-5.5` （vendor `e`）
- `hunyuan-2.0-instruct-ioa` （vendor `j`）
- `hunyuan-2.0-thinking-ioa` （vendor `j`）
- `hy3-dev-0402` （vendor `j`）
- `hy3-preview-agent-ioa` （vendor `j`）
- `hy3-preview-ioa` （vendor `j`）
- `kimi-k2-thinking` （vendor `f`）
- `kimi-k2.5-ioa` （vendor `f`）
- `kimi-k2.6-ioa` （vendor `f`）
- `minimax-m2.5-ioa` （vendor `f`）
- `minimax-m2.7-ioa` （vendor `f`）
- `minimax-m3-ioa` （vendor `f`）
