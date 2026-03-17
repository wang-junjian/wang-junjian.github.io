---
layout: single
title:  "OpenClaw 个人 AI 助手完整部署指南：从安装到模型调优的终极实战手册"
date:   2026-03-17 20:00:00 +0800
categories: OpenClaw Agent
tags: [OpenClaw, Agent, Install]
---

<!--more-->

## 安装 OpenClaw

### MacOS 环境下安装命令如下：

```bash
# 使用npm安装
npm install -g openclaw@latest

# 或使用pnpm安装
pnpm add -g openclaw@latest

# 或使用curl安装
curl -fsSL https://openclaw.ai/install.sh | bash
```

### Windows PowerShell 环境下安装命令如下：

```bash
iwr -useb https://openclaw.ai/install.ps1 | iex
```


## 快速启动

### 向导启动命令

```bash
openclaw onboard --install-daemon
```

### 向导配置选项说明

| 步骤 | 建议 |
| :--- | :--- |
| **Risk确认** | 选择 **yes** 继续 |
| **Onboarding mode** | 推荐选择 **QuickStart**，快速完成基础配置 |
| **Model/auth provider** | 选择 **Skip for now** |
| **Filter models by provider** | 选择 **All providers** |
| **Default model** | 选择 **Keep current** |
| **Select channel** | 选 **Skip for now**，后续再配置 |
| **Configure skills** | 推荐选 **Yes**，启用本地实用技能 |
| **Preferred node manager for skill installs** | 选择 **npm** |
| **Install missing skill dependencies** | 选择 **Skip for now** |
| **各种API Key设置** | 没有的话选 **No** 或 **Skip** |
| **Gateway service** | 选择 **Install** 或 **Reinstall** 安装 Gateway 服务 |
| **How to hatch your bot** | 推荐选 **Hatch in TUI** 体验交互式界面 |


## 模型

### LongCat

| 模型名称 | API格式 | 描述 |
| --- | --- | --- |
| LongCat-Flash-Chat | OpenAI/Anthropic | 高性能通用对话模型 |
| LongCat-Flash-Thinking | OpenAI/Anthropic | 深度思考模型 |
| LongCat-Flash-Thinking-2601 | OpenAI/Anthropic | 升级版深度思考模型 |
| LongCat-Flash-Lite | OpenAI/Anthropic | 高效轻量化MoE模型 |

#### 接入端点
- OpenAI格式：https://api.longcat.chat/openai
- Anthropic格式：https://api.longcat.chat/anthropic

### 方舟 Coding Plan

- doubao-seed-2.0-code
- doubao-seed-2.0-pro​
- doubao-seed-2.0-lite​
- doubao-seed-code
- minimax-m2.5​
- kimi-k2.5
- glm-4.7
- deepseek-v3.2

#### 接入端点
- OpenAI格式：https://ark.cn-beijing.volces.com/api/coding/v3
- Anthropic格式：https://ark.cn-beijing.volces.com/api/coding

### 方舟 API

#### 接入端点
- OpenAI格式：https://ark.cn-beijing.volces.com/api/v3
- Anthropic格式：https://ark.cn-beijing.volces.com/api/compatible


## 模型配置

编辑配置文件：

```bash
vim ~/.openclaw/openclaw.json
```

### LongCat 🆓

1. 增加自定义模型供应商

在 `openclaw.json` 中添加 `models` 字段：

```json
{
   "models": {
      "mode": "merge",
      "providers": {
         "longCat": {
            "baseUrl": "https://api.longcat.chat/openai",
            "apiKey": "YOUR_API_KEY",
            "api": "openai-completions",
            "authHeader": true,
            "models": [
               {
                  "id": "LongCat-Flash-Thinking-2601",
                  "name": "LongCat-Flash-Thinking-2601",
                  "reasoning": false,
                  "input": ["text"],
                  "contextWindow": 200000,
                  "maxTokens": 8192,
                  "compat": {
                     "maxTokensField": "max_tokens"
                  }
               }
            ]
         }
      }
   }
}
```

- `reasoning`：是否支持思考链
- `maxTokens: 8192`：单次最大输出 token

2. 修改默认模型设置

修改 `agents` 字段，设置默认模型：

```json
{
   "agents": {
      "defaults": {
         "model": {
            "primary": "longCat/LongCat-Flash-Thinking-2601"
         }
      }
   }
}
```

- [LongCat OpenClaw 配置](https://longcat.chat/platform/docs/zh/OpenClaw.html)
- [LongCat 用量信息](https://longcat.chat/platform/usage)
- [LongCat API开放平台快速开始](https://longcat.chat/platform/docs/zh/)

### 方舟 Coding Plan

1. 增加自定义模型供应商

在 `openclaw.json` 中添加 `models` 字段：

```json
{
  "models": {
    "mode": "merge",
    "providers": {
      "custom-ark-cn-beijing-volces-com": {
        "baseUrl": "https://ark.cn-beijing.volces.com/api/coding/v3",
        "apiKey": "YOUR_API_KEY",
        "api": "openai-completions",
        "models": [
          {
            "id": "ark-code-latest",
            "name": "ark-code-latest (Custom Provider)",
            "reasoning": false,
            "input": [
              "text",
              "image"
            ],
            "contextWindow": 256000,
            "maxTokens": 8192
          }
        ]
      }
    }
  }
}
```

2. 修改默认模型设置

修改 `agents` 字段，设置默认模型：

```json
{
   "agents": {
      "defaults": {
         "model": {
            "primary": "custom-ark-cn-beijing-volces-com/ark-code-latest"
         }
      }
   }
}
```

- [火山方舟 > 模型调用 > 接入三方工具](https://www.volcengine.com/docs/82379/2160841?lang=zh)


## 智能体配置

```json
{
  "agents": {
    "defaults": {
      "model": {
        "primary": "custom-ark-cn-beijing-volces-com/ark-code-latest"
      },
      "models": {
        "custom-ark-cn-beijing-volces-com/ark-code-latest": {
          "alias": "ark-code-latest"
        }
      },
      "workspace": "/Users/junjian/.openclaw/workspace",
      "contextPruning": {
        "mode": "cache-ttl",
        "ttl": "1h"
      },
      "compaction": {
        "mode": "safeguard"
      },
      "heartbeat": {
        "every": "30m"
      },
      "maxConcurrent": 4,
      "subagents": {
        "maxConcurrent": 8
      }
    }
  }
}
```

### 模型配置 (Model Settings)
这部分决定了 Agent 的“大脑”是谁以及如何称呼它。

* **`primary`**: 指定默认使用的主模型。
* **`models` & `alias`**: 这是一个映射表。由于原始端点名称（如 `custom-ark-...`）太长且不便记忆，通过 `alias` 将其简化为 `ark-code-latest`，方便在后续指令中快速调用。

### 上下文与内存管理 (Context & Memory)
这是 OpenClaw 处理长对话和节约 Token 的关键机制。

* **`contextPruning` (上下文裁剪)**:
    * `mode: cache-ttl`: 采用基于时间的缓存清理。
    * `ttl: 1h`: 缓存有效期为 1 小时。这意味着如果一小时内没有交互，旧的上下文可能会被清理，从而节省资源。
* **`compaction` (压缩)**:
    * `mode: safeguard`: 启动“防御性”压缩模式。当对话长度接近模型极限时，它会自动总结或精简之前的对话，防止因 Token 超限导致的任务失败。

### 运行环境与生命周期 (Runtime & Lifecycle)
* **`workspace`**: Agent 的“工作台”路径。所有生成的文件、临时数据或索引都会存放在 `/Users/junjian/.openclaw/workspace` 下。
* **`heartbeat`**:
    * `every: 30m`: 每 30 分钟进行一次心跳检测。

### 并发与子智能体 (Concurrency & SubAgent)
这部分决定了系统的吞吐量，即“同时能干多少活”。

* **`maxConcurrent: 4`**: 主 Agent 同时处理的任务数上限为 4 个。
* **`subagents`**:
    * `maxConcurrent: 8`: 当主 Agent 拆分出子任务（Sub-agents）时，允许最多 8 个子智能体并行工作。这能显著加快复杂任务（如同时扫描多个仓库代码）的速度。


## 开始使用

### TUI

```bash
openclaw tui
```

### Web UI

```bash
openclaw dashboard
```


## 卸载 OpenClaw

### 重装 OpenClaw

配置乱了，想从干净状态重新来一遍。这个命令会重置本地配置和状态，但保留 CLI 安装。

```bash
openclaw reset
```

### 执行卸载

```bash
openclaw uninstall --all --yes
```

- `--all`：把服务和本地数据一起清掉（包括网关服务、配置文件、数据库等）
- `--yes`：自动确认，不用再中途一遍遍手动输入 Y

### 删除 CLI 工具

```bash
# npm 安装的
npm rm -g openclaw

# pnpm 安装的
pnpm remove -g openclaw

# bun 安装的
bun remove -g openclaw
```

### 重启电脑，处理旧密钥

把可能残留的后台进程清理干净。

最好去对应官网把旧密钥作废，再重新生成新的。
避免万一旧密钥泄露，别人拿着你的密钥烧 Token。


## 参考资料
- [LongCat Claude Code 配置](https://longcat.chat/platform/docs/zh/ClaudeCode.html)
- [龙虾🦞完全卸载教程，来了！](https://mp.weixin.qq.com/s/RPddahsdzYnqYQImKA0MEQ)
