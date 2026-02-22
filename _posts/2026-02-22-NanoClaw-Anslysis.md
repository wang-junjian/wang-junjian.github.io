---
layout: single
title:  "NanoClaw 深度分析：AI 原生、技能系统与核心设计思想"
date:   2026-02-22 14:00:00 +0800
categories: NanoClaw AI原生
tags: [NanoClaw, AI Native, Skill, Software Design, OpenClaw]
---

本文档深入分析了 NanoClaw — 一个轻量级、AI 原生的个人 AI 助手项目。它的核心设计思想包括：小到可以理解（单一进程、少量文件）、通过容器隔离实现安全（而非应用级权限检查）、AI 原生开发（假设 Claude 始终作为协作者）、技能（Skill）胜于功能（按需转换代码库，而非功能堆积）。最创新的是其 Skills 技能系统，通过 Git 三向合并、三级解决模型（Git→Claude→用户）和共享解决方案缓存，实现了干净、可审计的代码转换。NanoClaw 展示了 AI 原生软件开发的新范式：为 AI + 人类团队协作优化，而非为独立人类开发。

<!--more-->

## 目录

1. [项目概述](#项目概述)
2. [核心理念](#核心理念)
3. [AI 原生设计](#ai-原生设计)
4. [Skills 技能系统](#skills-技能系统)
5. [系统架构](#系统架构)
6. [安全模型](#安全模型)
7. [对比与启示](#对比与启示)

---

## 项目概述

**NanoClaw** 是一个轻量级、安全的个人 Claude 助手项目。它通过 WhatsApp（或其他渠道）与用户交互，在隔离的容器中运行 Claude Agent SDK，为用户提供一个可定制、可理解的 AI 助手。

```
WhatsApp (Baileys) → SQLite → 轮询循环 → 容器 (Claude Agent SDK) → 响应
```

### 为什么创建 NanoClaw？

NanoClaw 的诞生是对 OpenClaw（原 ClawBot）项目的反拨。OpenClaw 变成了一个"怪物"：
- 4-5 个不同的进程运行不同的网关
- 无尽的配置文件
- 无尽的集成
- 应用级权限系统而非真正的隔离
- 代码库庞大到无人能真正理解

NanoClaw 提供了相同的核心功能，但代码库小到可以在 8 分钟内理解。

---

## 核心理念

NanoClaw 的设计遵循 6 个核心理念：

### 1. 小到可以理解（Small enough to understand）

> 整个代码库应该是你可以阅读和理解的东西。

- **单一 Node.js 进程**：没有微服务，没有消息队列，没有抽象层
- **少量源文件**：核心逻辑集中在十几个文件中
- **无过度设计**：每个组件都有明确的单一职责

关键文件（约 36.8k tokens）：

| 文件 | 行数 | 职责 |
|------|------|------|
| `src/index.ts` | ~488 | 编排器：状态、消息循环、代理调用 |
| `src/channels/whatsapp.ts` | ~330 | WhatsApp 连接、认证、发送/接收 |
| `src/container-runner.ts` | ~646 | 生成带挂载的流传输代理容器 |
| `src/group-queue.ts` | - | 带全局并发限制的每群组队列 |
| `src/task-scheduler.ts` | - | 运行计划任务 |
| `src/ipc.ts` | - | IPC 观察器和任务处理 |
| `src/db.ts` | - | SQLite 操作 |
| `src/mount-security.ts` | - | 挂载验证 |

### 2. 通过真正的隔离实现安全（Security through true isolation）

> 代理在真实的 Linux 容器中运行，而不是在应用级权限检查后面。

**不是**这样：
```
应用 → 权限检查 → 允许列表 → 文件系统
```

**而是**这样：
```
应用 → 容器 → 仅显式挂载的内容可见
```

- **OS 级隔离**：容器提供进程和文件系统隔离
- **显式挂载**：代理只能看到明确挂载的内容
- **安全的 Bash**：命令在容器内运行，而不是在主机上
- **非 root 执行**：以非特权 `node` 用户（uid 1000）运行
- **临时容器**：每次调用都是新环境（`--rm`）

### 3. 为一个用户构建（Built for one user）

> 这不是框架或平台。这是满足我特定需求的可用软件。

- **WhatsApp 优先**：因为作者使用 WhatsApp
- **不需要通用化**：不为"可能的用户"添加功能
- **拒绝配置膨胀**：你想要不同的行为？修改代码
- **直接满足需求**：不尝试猜测每个人可能想要什么

### 4. 自定义 = 代码更改（Customization = code changes）

> 没有配置蔓延。如果你想要不同的行为，修改代码。

**传统方式**：
```yaml
# config.yaml
channels:
  - type: whatsapp
    enabled: true
    trigger: "@Andy"
    personality: "friendly"
    # ... 50 行更多配置
```

**NanoClaw 方式**：
```typescript
// 直接修改 src/config.ts
export const ASSISTANT_NAME = 'Andy';  // 改这里
```

为什么？
- 配置文件也是代码，只是用 YAML 写的
- 代码库足够小，直接修改是安全的
- 避免了配置验证、迁移、兼容性问题
- 一个真相来源：代码本身

### 5. AI 原生开发（AI-native development）

> 不需要安装向导 — Claude Code 指导设置。不需要监控仪表板 — 问 Claude Code 发生了什么。不需要调试工具 — 描述问题，Claude 修复它。

| 传统方式 | NanoClaw 方式 |
|----------|---------------|
| 安装向导 | `/setup` 技能 |
| 监控仪表板 | 问 Claude "发生了什么？" |
| 调试工具 | 向 Claude 描述问题 |
| 文档 | Claude 阅读代码并解释 |
| 配置 UI | 告诉 Claude 你想要什么 |

代码库假设你有一个 AI 协作者。它不需要过度自我文档化或自我调试，因为 Claude 总是在那里。

### 6. 技能胜于功能（Skills over features）

> 贡献者不应该向代码库添加功能（如 Telegram 支持）。相反，他们应该贡献像 `/add-telegram` 这样的技能来转换你的分支。

**不是**这样（功能堆积）：
```
项目支持：
  ✓ WhatsApp
  ✓ Telegram
  ✓ Slack
  ✓ Discord
  ✓ Email
  ✓ SMS
  ... 但你只用 WhatsApp
```

**而是**这样（技能转换）：
```
基础项目：
  ✓ WhatsApp (默认)

用户运行：
  /add-telegram → 现在你的版本支持 Telegram
  /add-gmail    → 现在也支持 Gmail
```

结果：每个用户都有干净、最小化的代码，只做他们需要的事情。

---

## AI 原生设计

NanoClaw 最具革命性的方面是它的**AI 原生**设计方法。让我们深入探讨这意味着什么。

### 什么是 AI 原生？

**AI 原生**不是"用 AI 构建"或"包含 AI"。它是：

1. **假设 AI 协作者始终存在**
2. **将 AI 纳入设计的每一层**
3. **为 AI 协作优化，而不是为独立人类开发**

### 传统开发 vs AI 原生开发

| 维度 | 传统开发 | AI 原生开发 |
|------|----------|-------------|
| **文档** | 详尽的文档供人类阅读 | 代码就是文档，AI 会解读 |
| **配置** | 配置文件、UI、向导 | 告诉 AI 你想要什么，它修改代码 |
| **调试** | 日志、调试器、监控 | 向 AI 描述问题，它诊断并修复 |
| **安装** | README、脚本、向导 | `/setup` 技能由 AI 执行 |
| **可维护性** | 代码必须让人类容易理解 | 代码必须让 AI + 人类容易理解 |
| **功能** | 内置所有可能的功能 | 基础功能 + 按需技能转换 |

### 实例：`/setup` 技能

让我们看一下 `/setup` 技能（在 `.claude/skills/setup/SKILL.md`）来理解 AI 原生的实际应用。

**传统安装程序会有：**
- 命令行标志和参数
- 交互式提示（用代码编写）
- 进度条和状态输出
- 错误处理代码路径
- 回滚机制

**NanoClaw 的 `/setup` 技能有：**
- 一个 Markdown 文件，告诉 Claude Code 该做什么
- Claude 决定何时提问、何时执行、何时重试

`setup/SKILL.md` 的关键部分：

```markdown
# NanoClaw Setup

运行设置脚本自动。只在需要用户操作时暂停（WhatsApp 认证、配置选择）。

**原则：** 当某些东西损坏或缺失时，修复它。不要告诉用户自己去修复，除非确实需要他们手动操作（例如扫描二维码、粘贴密钥）。

## 1. 检查环境

运行 `./.claude/skills/setup/scripts/01-check-environment.sh` 并解析状态块。

- 如果 HAS_AUTH=true → 注意 WhatsApp 认证存在，提供跳过步骤 5
- 如果 HAS_REGISTERED_GROUPS=true → 注意现有配置，提供跳过或重新配置
- 记录 PLATFORM、APPLE_CONTAINER 和 DOCKER 值用于步骤 3

**如果 NODE_OK=false：**

Node.js 缺失或版本过旧。询问用户是否希望你安装它。根据平台提供选项：

- macOS: `brew install node@22`（如果有 brew）或安装 nvm 然后 `nvm install 22`
- Linux: `curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash - && sudo apt-get install -y nodejs`，或 nvm
```

注意这个方法：
1. **指示，不编程**：告诉 AI 该做什么，而不是编码每一步
2. **委托判断**：让 AI 决定何时重试、何时询问、何时继续
3. **自然语言描述**：用 Markdown 写，而不是用 TypeScript
4. **灵活执行**：如果标准路径失败，AI 可以即兴发挥

### 另一个例子：`/customize` 技能

`customize/SKILL.md` 展示了 AI 原生的自定义方法：

```markdown
# NanoClaw Customization

这个技能帮助用户添加功能或修改行为。在进行更改之前，使用 AskUserQuestion 理解他们想要什么。

## 工作流程

1. **理解请求** - 问澄清问题
2. **计划更改** - 识别要修改的文件
3. **实现** - 直接对代码进行更改
4. **测试指导** - 告诉用户如何验证

## 常见自定义模式

### 添加新的输入通道（例如 Telegram、Slack、Email）

要问的问题：
- 哪个通道？（Telegram、Slack、Discord、email、SMS 等）
- 相同的触发词还是不同的？
- 相同的内存层次结构还是单独的？

实现模式：
1. 创建 `src/channels/{name}.ts` 实现 `Channel` 接口
2. 将通道实例添加到 `src/index.ts` 的 `main()` 中
```

同样，这是**AI 优先**的自定义方法：
- 没有配置 DSL
- 没有插件系统
- 没有回调钩子
- 只是：告诉 AI 你想要什么，它修改代码

### AI 原生的设计原则

NanoClaw 的代码库遵循这些 AI 原生设计原则：

#### 1. 代码清晰优于聪明（Clarity over cleverness）

AI 可以理解"愚蠢"的代码，但人类+AI 一起工作得最好，当代码是直截了当的。

```typescript
// 好：清晰、明显
if (isMainGroup) {
  mounts.push(projectRootMount);
}

// 避免：过于聪明的一行代码
isMainGroup && mounts.push(projectRootMount);
```

#### 2. 显式优于隐式（Explicit over implicit）

AI 可以推理显式代码，但隐式行为会让每个人都感到困惑。

```typescript
// 好：显式声明
const allowedEnvVars = ['CLAUDE_CODE_OAUTH_TOKEN', 'ANTHROPIC_API_KEY'];
for (const key of allowedEnvVars) {
  if (env[key]) secrets[key] = env[key];
}

// 避免：隐式接受一切
const secrets = { ...env };  // 太多了！
```

#### 3. 少量大文件优于许多小文件（A few big files > many small files）

AI 有大的上下文窗口。将相关代码保存在一起有助于 AI 理解整个系统。

```
src/
  index.ts           ← 488 行，编排所有内容
  container-runner.ts ← 646 行，所有容器逻辑
  whatsapp.ts        ← 330 行，所有 WhatsApp 逻辑
```

而不是：
```
src/
  orchestrator/
    index.ts
    state.ts
    message-loop.ts
    agent-invoker.ts
  container/
    index.ts
    mounts.ts
    runner.ts
    streaming.ts
  channels/
    whatsapp/
      index.ts
      auth.ts
      send.ts
      receive.ts
```

#### 4. 一致性优于完美（Consistency over perfection）

AI 擅长模式匹配。一致的代码结构有助于 AI 预测应该在哪里进行更改。

```typescript
// 一致的模式：每个模块都有类似的结构
export function initDatabase() { ... }
export function getMessagesSince() { ... }
export function storeMessage() { ... }
```

#### 5. 没有"为未来"的代码（No "for the future" code）

AI 可以添加功能。现在只构建你需要的东西。

```typescript
// 好：只做现在需要的
export const MAX_CONCURRENT_CONTAINERS = 5;

// 避免：为"未来"过度设计
export interface ContainerConfig {
  maxConcurrent: number;
  queueStrategy: 'fifo' | 'priority' | 'fair';
  backoffPolicy: BackoffPolicy;
  // ... 等等
}
```

---

## Skills 技能系统

Skills（技能）是 NanoClaw 最创新的特性。让我们深入理解这个系统。

### 问题：如何在保持代码库最小的同时支持多种配置？

**传统解决方案 #1：功能标志**
```typescript
if (config.telegramEnabled) {
  initTelegram();
}
if (config.slackEnabled) {
  initSlack();
}
// ... 更多
```

问题：代码库包含所有功能，即使你不使用它们。膨胀、复杂性、攻击面。

**传统解决方案 #2：插件系统**
```typescript
app.registerPlugin(new TelegramPlugin(config));
app.registerPlugin(new SlackPlugin(config));
```

问题：插件抽象、生命周期钩子、配置 DSL。又一个需要学习的框架。

**传统解决方案 #3：Fork 并修改**
```bash
git clone git@github.com:user/nanoclaw.git
# 手动修改代码添加 Telegram
```

问题：合并上游更改很痛苦，冲突解决是手动的，没有分享修改的好方法。

---

### NanoClaw 的解决方案：Skills 技能系统

Skills 是**自包含的、可审计的包，通过标准的 git 合并机制以编程方式应用。**

#### 核心思想

1. **使用 git，不要重新发明它**
   - `git merge-file` 用于三向合并
   - `git rerere` 用于缓存解决方案
   - `git apply` 用于自定义补丁

2. **三级解决模型**
   ```
   Git（确定性）→ Claude Code（AI）→ 用户（人类）
   ```

3. **一个共享基础**
   - `.nanoclaw/base/` 保存干净的核心
   - 所有合并都使用这个作为共同祖先
   - 只在核心更新时更改

4. **代码合并 vs 结构化操作**
   - 代码文件：三向合并
   - 结构化数据（package.json、docker-compose.yml）：确定性聚合

---

#### 技能包结构

```
.claude/skills/
  add-telegram/
    SKILL.md                    # 上下文、意图、这个技能做什么以及为什么
    manifest.yaml               # 元数据、依赖、env vars、应用后步骤
    tests/                      # 这个技能的集成测试
      telegram.test.ts
    add/                        # 新文件 — 直接复制
      src/channels/telegram.ts
    modify/                     # 修改的代码文件 — 通过 git merge-file 合并
      src/
        index.ts                # 完整文件：干净核心 + telegram 更改
        index.ts.intent.md     # "添加 Telegram 通道支持"
        config.ts               # 完整文件：干净核心 + telegram 配置
        config.ts.intent.md     # "添加 Telegram 配置选项"
```

##### 为什么是完整修改文件？

- `git merge-file` 需要三个完整文件
- Git 的三向合并使用上下文匹配，即使你移动了代码也能工作
- 可审计：`diff base/src/index.ts skills/add-telegram/modify/src/index.ts` 准确显示技能更改了什么
- 确定性：相同的三个输入总是产生相同的合并结果
- 大小可以忽略不计，因为 NanoClaw 的核心文件很小

##### Intent 文件（.intent.md）

每个修改的代码文件都有一个相应的 `.intent.md`，带有结构化标题：

```markdown
# Intent: index.ts modifications

## What this skill adds
添加 Telegram 通道支持和多通道路由。

## Key sections
- `TelegramChannel` 导入和实例化
- `findChannel()` 中的多通道路由
- 通道数组初始化

## Invariants
- 不得破坏现有的 WhatsApp 功能
- `Channel` 接口必须保持不变
- 错误处理必须传播到全局错误处理程序

## Must-keep sections
- WhatsApp 通道初始化流程必须保持完整
```

结构化标题（What、Key sections、Invariants、Must-keep）在冲突解决期间为 Claude Code 提供具体指导，而不是要求它从非结构化文本中推断。

---

#### 应用流程：当你运行 `/add-telegram` 时会发生什么

```
用户运行 /add-telegram
     ↓
[1] 预检查
     - 核心版本兼容性
     - 依赖项满足
     - 没有无法解决的冲突
     ↓
[2] 备份
     - 将所有将被修改的文件复制到 .nanoclaw/backup/
     ↓
[3] 文件操作
     - 重命名、删除、移动（如果有）
     ↓
[4] 复制新文件
     - 从 add/ 复制新文件
     ↓
[5] 三向合并
     - 对于每个修改的文件：
       git merge-file 当前文件 基础文件 技能修改文件
     ↓
[6] 冲突解决（三级）
     1. 共享解决方案缓存（哈希验证）→ 自动
     2. git rerere 本地缓存 → 自动
     3. Claude Code 带 SKILL.md + .intent.md → 解决
     4. 用户 → 仅在真正歧义时
     ↓
[7] 应用结构化操作
     - 合并 npm 依赖项
     - 追加 env vars
     - 合并 docker-compose 服务
     - 运行 npm install 一次
     ↓
[8] 验证
     - 运行技能测试（强制性）
     ↓
[9] 清理
     - 删除 .nanoclaw/backup/
```

---

#### 三级解决模型

每个操作都遵循这个升级过程：

##### Level 1: Git（确定性，无 AI）

使用标准 git 工具，确定性地，没有 AI 参与：

```bash
# 三向合并
git merge-file src/index.ts \
  .nanoclaw/base/src/index.ts \
  .claude/skills/add-telegram/modify/src/index.ts

# 如果之前见过，git rerere 自动解决
git rerere
```

这处理了绝大多数情况。

##### Level 2: Claude Code（AI 辅助）

当 Git 无法自动解决时：

1. Claude 读取：
   - `SKILL.md`（技能做什么以及为什么）
   - `.intent.md`（不变量、必须保留的部分）
   - 冲突标记本身
   - `state.yaml`（还应用了哪些其他技能）

2. Claude 解决冲突

3. `git rerere` 缓存解决方案，因此永远不需要解决相同的冲突两次

##### Level 3: 用户（人类判断）

只有当 Claude 无法确定意图时：
- 两个功能在应用程序级别真正冲突
- 需要人工决策所需的行为
- Claude 要求用户选择

---

#### 共享解决方案缓存

问题：`git rerere` 是本地的。但是 NanoClaw 有成千上万的用户应用相同的技能组合。每个用户遇到相同的冲突并等待 Claude Code 解决它是浪费的。

解决方案：NanoClaw 在 `.nanoclaw/resolutions/` 中维护一个经过验证的解决方案缓存，随项目一起提供。

```
.nanoclaw/
  resolutions/
    whatsapp@1.2.0+telegram@1.0.0/
      src/
        server.ts.resolution
        server.ts.preimage
        config.ts.resolution
        config.ts.preimage
      meta.yaml
```

**哈希强制执行**：只有在输入哈希完全匹配时才应用缓存的解决方案：

```yaml
# meta.yaml
skills:
  - whatsapp@1.2.0
  - telegram@1.0.0
apply_order: [whatsapp, telegram]
core_version: 0.6.0
resolved_at: 2026-02-15T10:00:00Z
tested: true
test_passed: true
resolution_source: maintainer
input_hashes:
  base: "aaa..."
  current_after_whatsapp: "bbb..."
  telegram_modified: "ccc..."
output_hash: "ddd..."
```

如果任何输入哈希不匹配，将跳过缓存的解决方案，系统继续进行 Level 2。

目标：**拥有任何常见官方技能组合的用户永远不应该遇到未解决的冲突。**

---

#### 结构化操作 vs 代码合并

并非所有文件都应该作为文本合并。系统区分：

| 类型 | 处理方式 | 示例 |
|------|----------|------|
| **代码文件** | 三向合并 | `src/index.ts`、`src/channels/whatsapp.ts` |
| **结构化数据** | 确定性聚合 | `package.json`、`docker-compose.yml`、`.env.example` |

**结构化操作是隐式的**。如果技能声明 `npm_dependencies`，系统会自动处理依赖项安装。

```yaml
# 在 manifest.yaml 中
structured:
  npm_dependencies:
    grammy: "^1.39.3"
  env_additions:
    - TELEGRAM_BOT_TOKEN
    - TELEGRAM_ONLY
```

当多个技能按顺序应用时，系统会批处理结构化操作：
1. 首先合并所有依赖项声明
2. 写入 `package.json` 一次
3. 最后运行 `npm install` 一次

---

#### 状态跟踪

`.nanoclaw/state.yaml` 记录有关安装的所有信息：

```yaml
skills_system_version: "0.1.0"
core_version: 0.1.0

applied_skills:
  - name: telegram
    version: 1.0.0
    applied_at: 2026-02-16T22:47:02.139Z
    file_hashes:
      src/channels/telegram.ts: "f627b9cf..."
      src/config.ts: "9ae28d1f..."
      src/index.ts: "46dbe495..."
    structured_outcomes:
      npm_dependencies:
        grammy: "^1.39.3"
      env_additions:
        - TELEGRAM_BOT_TOKEN
        - TELEGRAM_ONLY

custom_modifications:
  - description: "添加了自定义日志中间件"
    applied_at: 2026-02-15T12:00:00Z
    files_modified:
      - src/server.ts
    patch_file: .nanoclaw/custom/001-logging-middleware.patch
```

这使得：
- **重放**：在新机器上重现完全相同的安装
- **漂移检测**：查看用户是否直接修改了文件
- **审计**：确切知道应用了什么以及何时应用的

---

#### 技能卸载：不是反向补丁，而是重播

删除技能不是反向补丁操作。**卸载是在没有技能的情况下重播。**

工作原理：
1. 读取 `state.yaml` 以获取已应用技能的完整列表
2. 从列表中删除目标技能
3. 将当前代码库备份到 `.nanoclaw/backup/`
4. **从干净基础重播** — 按顺序应用每个剩余的技能，应用自定义补丁
5. 运行所有测试
6. 如果测试通过，删除备份并更新 `state.yaml`

---

#### 核心更新和迁移

核心更新必须尽可能以编程方式进行。NanoClaw 团队负责确保更新干净地应用于常见技能组合。

**破坏性更改** — 更改的默认值、删除的功能、移动到技能的功能 — 需要**迁移**。迁移是一个保留旧行为的技能，针对新核心编写。它在更新期间自动应用，因此用户的设置不会更改。

`migrations.yaml` 示例：

```yaml
- since: 0.6.0
  skill: apple-containers@1.0.0
  description: "保留 Apple Container（0.6 版默认更改为 Docker）"

- since: 0.7.0
  skill: add-whatsapp@2.0.0
  description: "保留 WhatsApp（0.7 版从核心移到技能）"
```

用户看到的内容：

```
核心更新: 0.5.0 → 0.8.0
  ✓ 所有补丁已应用

  保留当前设置:
    + apple-containers@1.0.0
    + add-whatsapp@2.0.0
    + legacy-auth@1.0.0

  技能更新:
    ✓ add-telegram 1.0.0 → 1.2.0

  接受新默认值: /remove-skill <name>
  ✓ 所有测试通过
```

更新期间没有提示，没有选择。用户的设置不会改变。如果他们以后想要接受新默认值，他们可以删除迁移技能。

---

#### 渐进式核心瘦身

迁移启用了一个清晰的路径，随着时间的推移缩小核心：

1. **破坏性更改**从核心中删除功能
2. **迁移技能**为现有用户保留它
3. **新用户**以最小核心开始并添加他们需要的内容
4. **随着时间的推移**，`state.yaml` 准确反映每个用户正在运行的内容

---

#### 技能设计原则

1. **一个技能，一个快乐路径**。没有预定义的配置选项。自定义就是更多的修补。
2. **技能分层和组合**。核心技能提供基础，扩展技能添加功能。
3. **意图是一流的和结构化的**。`SKILL.md`、`.intent.md`（What、Invariants、Must-keep）。
4. **技能经过测试**。每个技能的集成测试。CI 通过重叠进行成对测试。测试总是运行。

---

### 实际示例：`/add-telegram` 技能

让我们看一下 `add-telegram` 技能，了解它在实践中的工作原理。

#### 阶段 1：预检查

```markdown
### 检查是否已应用
读取 `.nanoclaw/state.yaml`。如果 `telegram` 在 `applied_skills` 中，跳至阶段 3（设置）。代码更改已就位。

### 询问用户
1. **模式**：替换 WhatsApp 还是与之一起添加？
   - 替换 → 将设置 `TELEGRAM_ONLY=true`
   - 一起 → 两个通道都活跃（默认）

2. **他们是否已经有机器人令牌？** 如果是，现在收集。如果否，我们将在阶段 3 创建一个。
```

#### 阶段 2：应用代码更改

```bash
npx tsx scripts/apply-skill.ts .claude/skills/add-telegram
```

这确定性地：
- 添加 `src/channels/telegram.ts`（实现 Channel 接口的 TelegramChannel 类）
- 添加 `src/channels/telegram.test.ts`（46 个单元测试）
- 三向合并 Telegram 支持到 `src/index.ts`（多通道支持、findChannel 路由）
- 三向合并 Telegram 配置到 `src/config.ts`（TELEGRAM_BOT_TOKEN、TELEGRAM_ONLY 导出）
- 安装 `grammy` npm 依赖
- 用 `TELEGRAM_BOT_TOKEN` 和 `TELEGRAM_ONLY` 更新 `.env.example`
- 在 `.nanoclaw/state.yaml` 中记录应用

#### 阶段 3-5：设置、注册、验证

技能的其余部分指导 Claude 完成交互式设置过程，再次使用自然语言指令。

---

## 系统架构

现在让我们看一下实际运行的系统架构。

### 高层视图

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         用户空间（不可信）                                 │
│  WhatsApp 消息（可能包含恶意内容）                                          │
└──────────────────────────────────┬──────────────────────────────────────┘
                                   │
                                   ▼ 触发检查、输入转义
┌─────────────────────────────────────────────────────────────────────────┐
│                      主机进程（可信）                                      │
│  • 消息路由                                                               │
│  • IPC 授权                                                              │
│  • 挂载验证（外部允许列表）                                                 │
│  • 容器生命周期                                                           │
│  • 凭证过滤                                                              │
└──────────────────────────────────┬──────────────────────────────────────┘
                                   │
                                   ▼ 仅显式挂载
┌─────────────────────────────────────────────────────────────────────────┐
│                   容器（隔离/沙箱）                                        │
│  • 代理执行                                                              │
│  • Bash 命令（沙箱化）                                                    │
│  • 文件操作（限于挂载）                                                    │
│  • 网络访问（不受限制）                                                    │
│  • 无法修改安全配置                                                        │
└─────────────────────────────────────────────────────────────────────────┘
```

### 启动流程

让我们跟踪 `src/index.ts` 中的 `main()` 函数：

```typescript
async function main(): Promise<void> {
  // 1. 确保容器运行时正在运行
  ensureContainerSystemRunning();

  // 2. 初始化数据库
  initDatabase();

  // 3. 从数据库加载状态
  loadState();
  //   - lastTimestamp
  //   - sessions（每个群组的 Claude 会话 ID）
  //   - registeredGroups（已注册的群组配置）

  // 4. 设置通道回调
  const channelOpts = {
    onMessage: storeMessage,
    onChatMetadata: storeChatMetadata,
    registeredGroups: () => registeredGroups,
  };

  // 5. 创建并连接 WhatsApp 通道
  whatsapp = new WhatsAppChannel(channelOpts);
  channels.push(whatsapp);
  await whatsapp.connect();

  // 6. 启动子系统
  startSchedulerLoop({...});      // 任务调度器
  startIpcWatcher({...});          // IPC 观察器
  queue.setProcessMessagesFn(processGroupMessages);

  // 7. 恢复崩溃后待处理的消息
  recoverPendingMessages();

  // 8. 启动主消息循环
  startMessageLoop();
}
```

### 消息流程

1. **WhatsApp 接收消息** → `whatsapp.ts`
2. **消息存储在 SQLite 中** → `db.ts`
3. **轮询循环获取新消息** → `index.ts:startMessageLoop()`
4. **按群组去重** → `Map<string, NewMessage[]>`
5. **检查触发词** → 非主要群组需要 `@Andy` 前缀
6. **入队处理** → `group-queue.ts`
7. **生成容器** → `container-runner.ts`
8. **代理处理提示** → 容器内的 Claude Agent SDK
9. **流式输出返回** → 通过 WhatsApp 发送给用户

### 容器挂载

| 路径 | 主要群组 | 其他群组 | 用途 |
|------|---------|----------|------|
| `/workspace/project` | 读/写 | - | 项目根目录 |
| `/workspace/group` | 读/写 | 读/写 | 群组文件夹 |
| `/workspace/global` | - | 只读 | 全局内存 |
| `/workspace/extra/*` | 可配置 | 可配置 | 额外挂载 |
| `/workspace/ipc` | 读/写 | 读/写 | IPC 目录 |
| `/home/node/.claude` | 读/写 | 读/写 | Claude 配置 |
| `/app/src` | 只读 | 只读 | 代理运行器源 |

### 内存系统

- **每群组内存**：每个群组在 `groups/{name}/` 下有自己的文件夹，带有自己的 `CLAUDE.md`
- **全局内存**：`groups/global/CLAUDE.md` 被所有群组读取，但只能从"主要"（自我聊天）写入
- **文件**：群组可以在其文件夹中创建/读取文件并引用它们
- **代理在群组文件夹中运行**，自动继承两个 CLAUDE.md 文件

### 会话管理

- 每个群组维护一个对话会话（通过 Claude Agent SDK）
- 会话 ID 存储在 SQLite 中
- 当上下文变得过长时，会话自动压缩，保留关键信息

### 并发控制

- **全局限制**：最多 5 个并发容器（可通过 `MAX_CONCURRENT_CONTAINERS` 配置）
- **每群组队列**：每个群组都有自己的队列，带有状态跟踪
- **重试逻辑**：5 次重试，指数退避（5s、10s、20s、40s、80s）
- **空闲超时**：容器在最后一次活动后保持活跃 30 分钟

---

## 安全模型

NanoClaw 的安全模型基于**真实隔离**，而不是应用级权限检查。

### 信任模型

| 实体 | 信任级别 | 理由 |
|------|----------|------|
| 主要群组 | 可信 | 私人自我聊天，管理员控制 |
| 非主要群组 | 不可信 | 其他用户可能是恶意的 |
| 容器代理 | 沙箱化 | 隔离的执行环境 |
| WhatsApp 消息 | 用户输入 | 潜在的提示注入 |

### 主要安全边界

#### 1. 容器隔离（主要边界）

代理在容器（轻量级 Linux VM）中执行，提供：
- **进程隔离**：容器进程无法影响主机
- **文件系统隔离**：只有显式挂载的目录可见
- **非 root 执行**：以非特权 `node` 用户（uid 1000）运行
- **临时容器**：每次调用都是新环境（`--rm`）

这是主要的安全边界。攻击面受限于挂载的内容，而不是依赖应用级权限检查。

#### 2. 挂载安全

**外部允许列表** — 挂载权限存储在 `~/.config/nanoclaw/mount-allowlist.json`：
- 在项目根目录之外
- 永远不会挂载到容器中
- 代理无法修改

**默认阻止的模式**：
```
.ssh, .gnupg, .aws, .azure, .gcloud, .kube, .docker,
credentials, .env, .netrc, .npmrc, id_rsa, id_ed25519,
private_key, .secret
```

**保护措施**：
- 验证前解析符号链接（防止遍历攻击）
- 容器路径验证（拒绝 `..` 和绝对路径）
- 如果配置，`nonMainReadOnly` 选项强制非主要群组只读

#### 3. 会话隔离

每个群组在 `data/sessions/{group}/.claude/` 下有隔离的 Claude 会话：
- 群组无法看到其他群组的对话历史
- 会话数据包括完整的消息历史和读取的文件内容
- 防止跨群组信息泄露

#### 4. IPC 授权

消息和任务操作根据群组身份进行验证：

| 操作 | 主要群组 | 非主要群组 |
|------|---------|-----------|
| 发送消息到自己的聊天 | ✓ | ✓ |
| 发送消息到其他聊天 | ✓ | ✗ |
| 为自己调度任务 | ✓ | ✓ |
| 为他人调度任务 | ✓ | ✗ |
| 查看所有任务 | ✓ | 仅自己的 |
| 管理其他群组 | ✓ | ✗ |

#### 5. 凭证处理

**挂载的凭证**：
- Claude 认证令牌（从 `.env` 过滤，只读）

**未挂载**：
- WhatsApp 会话（`store/auth/`）— 仅主机
- 挂载允许列表 — 外部，永远不挂载
- 任何匹配阻止模式的凭证

**凭证过滤**：
只有这些环境变量暴露给容器：
```typescript
const allowedVars = ['CLAUDE_CODE_OAUTH_TOKEN', 'ANTHROPIC_API_KEY'];
```

---

## 对比与启示

### NanoClaw vs 传统方法

| 维度 | 传统 | NanoClaw |
|------|------|----------|
| **配置** | 配置文件、DSL、UI | 直接修改代码 |
| **功能** | 内置所有功能 | 核心 + 按需技能 |
| **安全** | 应用级权限检查 | OS 级容器隔离 |
| **自定义** | 插件/扩展系统 | 技能转换代码库 |
| **更新** | 迁移脚本、向后兼容性 | 迁移技能保留行为 |
| **调试** | 日志、监控、调试器 | 向 AI 描述问题 |
| **代码库** | 膨胀以支持所有用例 | 最小，仅你需要的 |

### 对 AI 原生开发的启示

NanoClaw 为 AI 原生软件开发提供了一个蓝图：

#### 1. 重新思考"可维护性"

**传统观点**：代码必须让人类在没有帮助的情况下容易理解。

**AI 原生观点**：代码必须让 AI + 人类团队容易理解。清晰和一致性比聪明和简洁更重要。

#### 2. 重新思考"配置"

**传统观点**：用户应该能够在不修改代码的情况下自定义软件。

**AI 原生观点**：告诉 AI 你想要什么，它修改代码。代码是真相的来源。

#### 3. 重新思考"功能"

**传统观点**：软件应该支持所有合理的用例内置。

**AI 原生观点**：保持核心最小。用户通过技能应用他们需要的转换。

#### 4. 重新思考"文档"

**传统观点**：详尽的文档供人类阅读。

**AI 原生观点**：代码就是文档。AI 会解释它。保持代码清晰。

#### 5. 重新思考"调试"

**传统观点**：构建工具、仪表板、日志系统来帮助人类调试。

**AI 原生观点**：AI 可以从日志和错误消息中诊断大多数问题。向它描述症状。

### 我们可以从 NanoClaw 中学到什么

即使你没有构建个人 AI 助手，NanoClaw 的方法也有更广泛的经验：

1. **小即是美**：一个小的、可理解的代码库胜过一个大的、过度设计的代码库。

2. **AI 改变一切**：当你假设 AI 协作者时，你设计系统的方式完全不同。

3. **Git 是强大的构建块**：我们可以在 `git merge-file` 和 `git rerere` 之上构建整个技能系统，而不是重新发明合并和补丁。

4. **隔离 > 权限检查**：真实的 OS 级隔离比复杂的应用级权限系统更简单、更安全。

5. **直接性 > 间接性**：直接修改代码比通过配置层间接更简单、更不容易出错。

---

## 总结

NanoClaw 不是一个大项目，但它是一个重要的项目。它展示了一种完全不同的构建软件的方式 — **AI 原生方式**。

关键要点：

1. **小到可以理解**：一个进程，几个文件，没有过度设计。

2. **通过隔离实现安全**：容器，而不是应用级权限检查。

3. **AI 原生**：假设 AI 协作者始终存在。为 AI + 人类团队优化，而不是为独立人类开发。

4. **技能胜于功能**：保持核心最小。用户通过技能应用他们需要的转换。

5. **使用 git，不要重新发明它**：`git merge-file`、`git rerere`、`git apply` 是你的构建块。

6. **三级解决**：Git（确定性）→ Claude Code（AI）→ 用户（人类）。

NanoClaw 向我们展示了未来可能的样子：个人软件由 AI 协作者帮助塑造，代码库保持小而可理解，安全通过隔离而不是复杂的权限系统来保证，功能通过按需转换而不是预先内置来添加。

这是一个令人兴奋的愿景，NanoClaw 向我们展示了如何实现它。

---

## 参考资料
- [NanoClaw GitHub](https://github.com/qwibitai/nanoclaw)
- [Claude Code Skills 文档](https://code.claude.com/docs/en/skills)
