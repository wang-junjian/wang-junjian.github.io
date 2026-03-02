---
layout: single
title:  "Peter Steinberger 开发 OpenClaw 的工作流程及 Agent 编码秘诀分析"
date:   2026-03-02 18:00:00 +0800
categories: OpenClaw Agent
tags: [OpenClaw, Agent, AgentCoding, Peter Steinberger, steipete]
---

通过 2026 年 git 提交历史记录，分析 Peter Steinberger (steipete) 开发 OpenClaw 的工作流程及 Agent 编码秘诀。

## 关键洞察总结

### AI 是放大器，不是替代品

**AI 的作用：**
- ✅ 做人类不想做的重复工作（去重、重构）
- ✅ 快速覆盖大量代码（3天1400次提交）
- ✅ 标准化和系统化（按模板提交）

**人类的作用：**
- ✅ 创造性工作（新功能）
- ✅ 质量把关（代码审查）
- ✅ 决策和发布（版本管理）

---

### 可借鉴的经验

| 经验 | 说明 |
|------|------|
| **人机分工** | 人类做 creative，AI 做 repetitive |
| **明确周期** | 人类开发期 → AI 重构期 → 人类收尾期 |
| **标准化** | AI 喜欢模板，建立标准流程 |
| **小步快跑** | 每个阶段有明确目标，快速迭代 |


<!--more-->

## 一、提交统计概览

**总提交数**: 8443 次提交在两个月内

**峰值日产量**: 
- 2026-02-22: 578 次提交
- 2026-02-15: 478 次提交  
- 2026-02-16: 472 次提交

**提交类型分布**:
```
fix:     1557 (26%)
test:     815 (14%)
docs:     857 (14%)
refactor: 308 (5%)
feat:     363 (6%)
chore:    352 (6%)
style:    134 (2%)
build:     21 (0.3%)
```

---

## 二、工作流程核心模式

### 1️⃣ **"Land #PR" 工作流**

steipete 开发了一套独特的 PR 合并方式：

**早期模式（1月）**:
```
Merge pull request #108 from author/branch
```

**演进模式（2月底）**:
```
fix(telegram): land #31067 first-chunk voice-fallback reply refs (@xdanger)
fix(signal): land #31138 syncMessage presence filtering (@Sid-Qin)
```

**特点**:
- 不再使用 GitHub 的标准合并提交
- 把 PR 内容"着陆"（land）为单个提交
- 保留原作者署名 `(@author)`
- 在提交消息中明确 PR 编号 `#31067`

### 2️⃣ **原子化提交粒度**

steipete 的提交被拆分为**极小的原子单元**：

| 提交示例 | 改动规模 | 说明 |
|---------|---------|------|
| `fix: prefer explicit hook mappings` | 1 行修改 | 极简修复 |
| `refactor: share queued JSONL file writer` | 单模块重构 | 单一职责 |
| `docs: add missing message channels` | 5 行文档 | 文档更新 |
| `feat: add Signal provider support` | 1368 行 | 大功能也单独提交 |

**模式**: 每个提交只做一件事，且完整可运行。

### 3️⃣ **24小时全天候编码**

从 2026-02-22 的提交时间分布看：

```
00:00-01:00  53 提交
07:00-08:00  39
08:00-09:00  47
09:00-10:00  29
10:00-11:00  51
11:00-12:00  71  ← 早高峰
12:00-13:00  53
13:00-14:00  48
14:00-15:00  19
15:00-16:00  21
16:00-17:00   6
17:00-18:00   4  ← 短暂休息
18:00-19:00  44
19:00-20:00  72  ← 晚高峰
20:00-21:00  33
21:00-22:00  15
22:00-23:00  45
23:00-00:00  73  ← 夜高峰
```

**结论**: 几乎全天候有提交，这是多 Agent 并行工作的铁证。

---

## 三、Agent 编码的核心秘诀

### 秘诀 1: **技能系统 (Skills)**

项目内置了 `coding-agent` 技能:

```
skills/coding-agent/SKILL.md
├── 使用 bash + pty:true 运行 Codex/Claude Code
├── --full-auto 模式用于自动构建
├── background 模式用于长时间运行任务
├── process 工具用于监控和交互
└── PTY 是必需的！
```

**工作模式**:
```bash
# 启动后台 Agent
bash pty:true workdir:~/project background:true \
  command:"codex exec --full-auto 'Build feature X'"

# 监控进度
process action:log sessionId:XXX

# 发送输入
process action:submit sessionId:XXX data:"yes"
```

### 秘诀 2: **OpenProse VM - 多 Agent 编排语言**

在 `extensions/open-prose/` 中有一个完整的**多 Agent 编排系统**:

**核心思想**: *"LLMs are simulators — when given a detailed system description, they don't just describe it, they simulate it."*

**OpenProse 能力**:
- `.prose` 文件定义 Agent 工作流
- 支持并行执行 (`parallel`)
- 支持顺序执行 (`sequence`)
- 内置 37+ 个示例工作流
- 3 种状态管理模式: filesystem, in-context, sqlite

**示例工作流**:
```
examples/
├── 28-gas-town.prose          # 多 Agent 编排
├── 29-captains-chair.prose    # 持久化编排器
├── 33-pr-review-autofix.prose # PR 自动修复
├── 36-bug-hunter.prose        # Bug 猎人
└── 37-the-forge.prose         # 从零构建浏览器
```

### 秘诀 3: **"小盒子" (Little Box) 模式**

来自 coding-agent 技能的关键洞察:

> **"workdir matters": Agent wakes up in a focused directory, doesn't wander off reading unrelated files.**

**应用**:
- 每个 Agent 有独立的 `workdir`
- 不读无关文件（避免"读灵魂文档"）
- 使用 `git worktree` 进行 PR 评审
- **永远**不在主项目目录 checkout 分支

### 秘诀 4: **并行 Agent 大军**

从提交模式可以看出大规模并行:

**证据**:
- 同一分钟内有多个提交
- 提交来自不同的"关注领域"（security, discord, telegram, docs, refactor 同时进行）
- 2月22日 24 小时内 578 次提交 = **平均每 2.5 分钟 1 次提交**

**策略** (来自 OpenProse 示例):
```prose
# Deploy the army - one Codex per PR!
parallel "Review PR #86" do
  session "review-86" { ... }
end
parallel "Review PR #87" do
  session "review-87" { ... }
end
```

### 秘诀 5: **重构=提取+共享模式**

steipete 的 refactor 提交揭示了一个系统化的重构方法:

**模式序列**:
1. `refactor: share X helper` - 提取共享助手
2. `refactor: dedupe Y flow` - 消除重复流程
3. `refactor: centralize Z` - 中心化管理
4. `refactor: unify W` - 统一接口
5. `refactor: split A and B` - 拆分关注点

**2月17日的例子**（30分钟内完成）:
```
refactor(shared): reuse chat content extractor
refactor: replace memory manager prototype mixing
refactor(test): share heartbeat sandbox fixtures
refactor(test): share embedded runner overflow mocks
refactor: reuse sandbox path expansion
refactor: reuse runtime requires evaluation
refactor: centralize plugin allowlist mutation
refactor: dedupe process-scoped lock maps
... 等等
```

### 秘诀 6: **AI 透明度文化**

从 `CONTRIBUTING.md` 可以看出他们对 AI 的态度:

```
## AI/Vibe-Coded PRs Welcome! 🤖

Built with Codex, Claude, or other AI tools? **Awesome - just mark it!**

Please include in your PR:
- [ ] Mark as AI-assisted in the PR title
- [ ] Note degree of testing
- [ ] Include prompts/session logs if possible
- [ ] Confirm you understand what the code does

AI PRs are first-class citizens here. We just want transparency.
```

**Co-authored-by 模式**:
早期提交有:
```
Co-authored-by: Clawd <clawdbot@gmail.com>
```

---

## 四、工具链与基础设施

| 工具 | 用途 |
|-----|------|
| **Codex** | 主要编码 Agent (GPT-5.2-codex) |
| **Claude Code** | 代码审查和复杂任务 |
| **Pi** | 轻量级任务，支持多 provider |
| **OpenProse VM** | 多 Agent 编排 |
| **bash + pty:true** | Agent 运行时（必需 PTY!） |
| **process tool** | 后台会话监控 |
| **git worktree** | 并行 PR 处理 |

---

## 五、关键洞察总结

### steipete 的工作流秘诀:

1. **原子化提交** - 每个提交一件事，可独立运行
2. **"Land #PR"** - PR 作为单个提交着陆，保留原作者
3. **多 Agent 并行** - 使用 OpenProse 编排多个 Codex/Claude
4. **小盒子原则** - 每个 Agent 有独立 workdir，不读无关文件
5. **重构=提取共享** - 系统化地 deduplicate 和 centralize
6. **AI 透明度** - 明确标记 AI 辅助的工作
7. **全天候运行** - Agent 24小时工作，峰值在深夜和清晨

### 为什么这有效:

- **可审计性**: 每个小提交都有明确目的
- **可回滚性**: 出错容易 revert 单个提交
- **并行化**: 多个 Agent 可同时工作在不同部分
- **知识保留**: 提交历史就是完整的开发日志
- **社区协作**: "land #PR" 模式让贡献者获得荣誉

这就是 steipete 如何在两个月内完成 8443 次提交的秘密！


------


## 2026 年提交统计命令

```bash
git log --author="steipete" --since="2026-01-01" --until="2026-03-02" --pretty=format:"%ad" --date=short | sort | uniq -c | sort -k2
```

```plaintext
  75 2026-01-01
 127 2026-01-02
 174 2026-01-03
 122 2026-01-04
 136 2026-01-05
 177 2026-01-06
 172 2026-01-07
 272 2026-01-08
 349 2026-01-09
 252 2026-01-10
 158 2026-01-11
 283 2026-01-12
 156 2026-01-13
  63 2026-01-14
 202 2026-01-15
 164 2026-01-16
 256 2026-01-17
 262 2026-01-18
  77 2026-01-19
 170 2026-01-20
 181 2026-01-21
 161 2026-01-22
 144 2026-01-23
 162 2026-01-24
  92 2026-01-25
  36 2026-01-26
  29 2026-01-27
   9 2026-01-28
   5 2026-01-29
  20 2026-01-30
  19 2026-01-31
  21 2026-02-01
  32 2026-02-02
  26 2026-02-03
   9 2026-02-04
   7 2026-02-05
  22 2026-02-06
   7 2026-02-07
  15 2026-02-09
   1 2026-02-10
   2 2026-02-11
   6 2026-02-12
 117 2026-02-13
 450 2026-02-14
 478 2026-02-15
 472 2026-02-16
  64 2026-02-17
 304 2026-02-18
 233 2026-02-19
 361 2026-02-21
 578 2026-02-22
 111 2026-02-23
 171 2026-02-24
  73 2026-02-25
 214 2026-02-26
   9 2026-02-27
  27 2026-03-01
 128 2026-03-02
```
