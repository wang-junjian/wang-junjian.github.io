---
layout: single
title:  "Claude 代码安全审查 (Claude Code Security Review)"
date:   2026-03-03 08:00:00 +0800
categories: ClaudeCode SecurityReview GitHubAction
tags: [Claude Code, Security Review, GitHub Action, LLM]
---

[Claude 代码安全审查 (Claude Code Security Review)](https://github.com/anthropics/claude-code-security-review/) 是一个基于 AI 的 GitHub Action 安全审查工具，利用 Claude 分析代码变更中的安全漏洞。

<!--more-->

![](/images/2026/Claude/claude-code-security-review/sast.jpeg)

# Claude 代码安全审查器 (Claude Code Security Reviewer)

这是一个基于 AI 驱动的 GitHub Action 安全审查工具，利用 Claude 分析代码变更中的安全漏洞。该 Action 使用 Anthropic 的 Claude Code 工具进行深度语义安全分析，为 Pull Request (PR) 提供智能且具备上下文感知能力的安全评估。

## 功能特性

* **AI 驱动分析**：利用 Claude 先进的推理能力，通过深度语义理解来检测安全漏洞。
* **差异感知扫描**：针对 PR，仅分析发生变更的文件。
* **PR 自动评论**：自动在 PR 中针对发现的安全问题发布评论。
* **上下文理解**：超越简单的模式匹配，深入理解代码的语义逻辑。
* **语言无关性**：支持任何编程语言。
* **误报过滤**：通过高级过滤功能减少干扰，专注于真正的安全漏洞。

## 快速入门

将以下内容添加到您仓库的 `.github/workflows/security.yml` 文件中：

```yaml
name: Security Review

permissions:
  pull-requests: write  # 发布 PR 评论所需权限
  contents: read

on:
  pull_request:

jobs:
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          ref: ${{ github.event.pull_request.head.sha || github.sha }}
          fetch-depth: 2
      
      - uses: anthropics/claude-code-security-review@main
        with:
          comment-pr: true
          claude-api-key: ${{ secrets.CLAUDE_API_KEY }}

```

## 安全注意事项

此 Action 未针对提示词注入（Prompt Injection）攻击进行防御加固，因此**仅应在大规模审查受信任的 PR 时使用**。我们建议[配置您的仓库](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/enabling-features-for-your-repository/managing-github-actions-settings-for-a-repository#controlling-changes-from-forks-to-workflows-in-public-repositories)开启“要求所有外部贡献者通过审批”选项，以确保工作流仅在维护者审查 PR 后运行。

## 配置选项

### Action 输入参数 (Inputs)

| 参数 | 描述 | 默认值 | 是否必填 |
| --- | --- | --- | --- |
| `claude-api-key` | 用于安全分析的 Anthropic Claude API 密钥。<br><br>*注意*：该密钥需同时开启 Claude API 和 Claude Code 使用权限。 | 无 | 是 |
| `comment-pr` | 是否在 PR 上发布发现结果的评论 | `true` | 否 |
| `upload-results` | 是否将结果作为 artifacts 上传 | `true` | 否 |
| `exclude-directories` | 以逗号分隔的排除扫描目录列表 | 无 | 否 |
| `claude-model` | 要使用的 Claude [模型名称](https://docs.anthropic.com/en/docs/about-claude/models/overview#model-names)。默认为 Opus 4.1。 | `claude-opus-4-1-20250805` | 否 |
| `claudecode-timeout` | ClaudeCode 分析超时时间（分钟） | `20` | 否 |
| `run-every-commit` | 对每个 commit 运行 ClaudeCode（跳过缓存检查）。警告：在 commit 较多的 PR 中可能会增加误报。 | `false` | 否 |
| `false-positive-filtering-instructions` | 自定义误报过滤指令文本文件的路径 | 无 | 否 |
| `custom-security-scan-instructions` | 附加到审计提示词中的自定义安全扫描指令文件路径 | 无 | 否 |

### Action 输出参数 (Outputs)

| 输出 | 描述 |
| --- | --- |
| `findings-count` | 发现的安全问题总数 |
| `results-file` | 结果 JSON 文件的路径 |

---

## 工作原理

### 架构设计

```
claudecode/
├── github_action_audit.py  # GitHub Actions 的主审计脚本
├── prompts.py              # 安全审计提示词模板
├── findings_filter.py      # 误报过滤逻辑
├── claude_api_client.py    # 用于误报过滤的 Claude API 客户端
├── json_parser.py          # 稳健的 JSON 解析工具
├── requirements.txt        # Python 依赖项
├── test_*.py               # 测试套件
└── evals/                  # 用于在任意 PR 上测试 CC 的评估工具
```

### 工作流程

1. **PR 分析**：当 PR 开启时，Claude 分析差异（diff）以理解变更内容。
2. **上下文审查**：Claude 结合上下文检查代码变更，理解其意图及潜在的安全影响。
3. **结果生成**：识别安全问题，并提供详细解释、严重级别评分和修复建议。
4. **误报过滤**：通过高级过滤剔除低影响或易误报的项，减少干扰信息。
5. **PR 评论**：将发现的问题以评论形式发布在具体的代码行处。

---

## 安全分析能力

### 可检测的漏洞类型

* **注入攻击**：SQL 注入、命令注入、LDAP 注入、XPath 注入、NoSQL 注入、XXE。
* **认证与授权**：失效的身份认证、权限提升、不安全的直接对象引用（IDOR）、绕过逻辑、会话缺陷。
* **数据泄露**：硬编码凭据、敏感数据日志记录、信息泄露、PII 处理违规。
* **密码学问题**：弱算法、密钥管理不当、不安全的随机数生成。
* **输入校验**：缺失校验、清理不当、缓冲区溢出。
* **业务逻辑漏洞**：竞态条件、检查时间与使用时间（TOCTOU）问题。
* **配置安全**：不安全的默认设置、缺失安全响应头、宽容的 CORS 策略。
* **供应链**：漏洞依赖项、抢注域名（Typosquatting）风险。
* **代码执行**：通过反序列化实现的 RCE、Pickle 注入、Eval 注入。
* **跨站脚本 (XSS)**：反射型、存储型和基于 DOM 的 XSS。

### 误报过滤

该工具会自动排除多种低影响或易产生误报的发现，以便专注于高影响漏洞：

* 拒绝服务 (DoS) 漏洞
* 频率限制（Rate limiting）相关问题
* 内存/CPU 耗尽问题
* 无证明影响的泛化输入校验
* 开放重定向（Open redirect）漏洞

误报过滤还可以根据特定项目的安全目标进行微调。

---

## 相比传统 SAST 的优势

* **上下文理解**：理解代码语义和意图，而非仅仅匹配模式。
* **更低的误报率**：AI 驱动的分析能识别代码在何时是真正脆弱的，从而减少干扰。
* **详尽的解释**：提供为何构成漏洞以及如何修复的清晰说明。
* **自适应学习**：可根据组织特定的安全要求进行自定义。

## 安装与设置

### GitHub Actions

遵循上方的“快速入门”指南。该 Action 会自动处理所有依赖项。

### 本地开发

如需在本地针对特定 PR 运行安全扫描，请参考 [评估框架文档](https://github.com/anthropics/claude-code-security-review/blob/main/claudecode/evals/README.md)。

## Claude Code 集成：`/security-review` 命令

默认情况下，Claude Code 提供了一个 `/security-review` [斜杠命令](https://docs.anthropic.com/en/docs/claude-code/slash-commands)，它提供与 GitHub Action 工作流相同的安全分析能力，但直接集成在您的 Claude Code 开发环境中。只需运行 `/security-review` 即可对所有待处理的变更进行全面的安全审查。

### 自定义命令

默认的 `/security-review` 命令适用于大多数情况，但也可以根据需求进行自定义：

1. 将本仓库中的 [`security-review.md`](https://github.com/anthropics/claude-code-security-review/blob/main/.claude/commands/security-review.md?plain=1) 文件复制到您项目的 `.claude/commands/` 文件夹中。
2. 编辑 `security-review.md` 以自定义分析逻辑。例如，您可以在误报过滤指令中添加特定于组织的规则。

---

## 测试

运行测试套件以验证功能：

```bash
cd claude-code-security-review
# 运行所有测试
pytest claudecode -v

```

## 支持

如有问题或疑问：

* 在本仓库中提交 Issue。
* 查看 [GitHub Actions 日志](https://docs.github.com/en/actions/monitoring-and-troubleshooting-workflows/viewing-workflow-run-history) 以获取调试信息。


------


# SAST 评估工具 (SAST Evaluation Tool)

本目录包含一个用于在单个 GitHub Pull Request (PR) 上评估 SAST（静态应用安全测试）工具的工具。

## 项目概览

该评估工具允许您在任何 GitHub PR 上运行 **Claude Code Security Reviewer**，以分析其安全检测结果。这对于以下场景非常有用：

* 在特定 PR 上测试工具效果
* 评估性能和准确性
* 调试安全分析中的问题

## 环境要求

* **Python 3.9+**
* **Git 2.20+**（需支持 worktree 功能）
* **GitHub CLI (`gh`)**：用于访问 GitHub API
* **环境变量**：
* `ANTHROPIC_API_KEY`：访问 Claude API 必填
* `GITHUB_TOKEN`：推荐配置，以避免 GitHub API 速率限制

## 使用方法

对单个 PR 运行评估：

```bash
python -m claudecode.evals.run_eval example/repo#123 --verbose
```

### 命令行选项

* **PR 指定**：必填参数，格式为 `所有者/仓库名#PR编号`（例如 `owner/repo#123`）
* `--output-dir PATH`：结果输出目录（默认：`./eval_results`）
* `--work-dir PATH`：Git 仓库克隆和存储的目录（默认：`~/code/audit`）
* `--verbose`：启用详细日志记录，以查看运行进度详情

## 输出结果

评估会在输出目录中生成一个 JSON 文件，包含以下内容：

* 运行成功/失败状态
* 运行耗时指标
* 安全漏洞发现总数
* 详细的发现结果（包含文件、行号、严重程度及描述）

示例输出文件：`pr_example_repo_123.json`

## 架构设计

该评估工具利用 **Git Worktrees** 进行高效的仓库管理：

1. **单次克隆**：仅将仓库作为基础库克隆一次。
2. **轻量化工作树**：为每个 PR 评估创建轻量级的 worktree。
3. **自动清理**：自动处理评估完成后的 worktree 清理工作。
4. **隔离运行**：在特定 PR 的 worktree 中执行 SAST 审计。


------


# Claude 命令：`/security-review`

这是一个预定义的 Claude Code 命令，提供与 GitHub Action 工作流相同的安全分析能力，但直接集成在您的 Claude Code 开发环境中。只需运行 `/security-review` 即可对所有待处理的变更进行全面的安全审查。

![](/images/2026/Claude/claude-code-security-review/security-review.jpeg)

```
---
allowed-tools: Bash(git diff:*), Bash(git status:*), Bash(git log:*), Bash(git show:*), Bash(git remote show:*), Read, Glob, Grep, LS, Task
description: 对当前分支上的待处理更改完成安全审查
---
```

你是一位资深安全工程师，正在对该分支的更改进行专项安全审查。

**GIT 状态：**

```
!`git status`
```

**修改的文件：**

```
!`git diff --name-only origin/HEAD...`
```

**提交记录：**

```
!`git log --no-decorate origin/HEAD...`
```

**DIFF 内容：**

```
!`git diff --merge-base origin/HEAD`
```

请审阅上方完整的 diff。其中包含了该 PR 中的所有代码更改。

### 目标：

进行以安全为核心的代码审查，识别具有真实利用潜力的**高可信度**安全漏洞。这不是普通的常规代码审查——请**仅**关注此 PR 新引入的安全影响。不要评论既有的安全问题。

### 关键指令：

1. **最小化误报**：仅标记你对实际可利用性具有 >80% 把握的问题。
2. **避免噪音**：跳过理论性问题、代码风格问题或低影响的发现。
3. **关注影响力**：优先处理可能导致未经授权访问、数据泄露或系统受损的漏洞。
4. **排除项**：切勿报告以下类型的问题：
* 拒绝服务 (DoS) 漏洞（即使它们会导致服务中断）。
* 存储在磁盘上的机密信息或敏感数据（这些由其他流程处理）。
* 频率限制或资源消耗问题。

### 需检查的安全类别：

**输入校验漏洞：**

* 通过未过滤用户输入进行的 SQL 注入
* 系统调用或子进程中的命令注入
* XML 解析中的 XXE 注入
* 模板引擎中的模板注入
* 数据库查询中的 NoSQL 注入
* 文件操作中的路径穿越

**认证与授权问题：**

* 认证绕过逻辑
* 权限提升路径
* 会话管理缺陷
* JWT 令牌漏洞
* 授权逻辑绕过

**加密与机密管理：**

* 硬编码的 API 密钥、密码或令牌
* 弱加密算法或实现
* 不当的密钥存储或管理
* 加密随机性问题
* 证书校验绕过

**注入与代码执行：**

* 通过反序列化实现的远程代码执行 (RCE)
* Python 中的 Pickle 注入
* YAML 反序列化漏洞
* 动态代码执行中的 Eval 注入
* Web 应用中的 XSS 漏洞（反射型、存储型、基于 DOM）

**数据暴露：**

* 敏感数据日志记录或存储
* PII（个人身份信息）处理违规
* API 端点数据泄露
* 调试信息泄露

补充说明：

* 即使某项内容仅能从本地网络利用，它仍可能是一个“高（HIGH）”严重级别的问题。

### 分析方法论：

**第一阶段 - 仓库上下文研究（使用文件搜索工具）：**

* 识别正在使用的现有安全框架和库。
* 在代码库中寻找已建立的安全编码模式。
* 检查现有的清理（Sanitization）和校验模式。
* 了解项目的安全模型和威胁模型。

**第二阶段 - 对比分析：**

* 将新的代码更改与现有的安全模式进行对比。
* 识别偏离已建立安全实践的情况。
* 寻找不一致的安全实现。
* 标记引入新攻击面的代码。

**第三阶段 - 漏洞评估：**

* 检查每个修改的文件所涉及的安全影响。
* 追踪从用户输入到敏感操作的数据流。
* 寻找被不安全穿越的权限边界。
* 识别注入点和不安全的反序列化。

### 要求的输出格式：

你**必须**使用 Markdown 输出你的发现。Markdown 输出应包含：文件、行号、严重程度、类别（例如 `sql_injection` 或 `xss`）、描述、利用场景和修复建议。

例如：

# 漏洞 1: XSS: `foo.py:42`

* 严重程度: High
* 描述: 来自 `username` 参数的用户输入未经过滤直接插值到 HTML 中，允许反射型 XSS 攻击。
* 利用场景: 攻击者构造类似 `/bar?q=<script>alert(document.cookie)</script>` 的 URL，在受害者浏览器中执行 JavaScript，从而实现会话劫持或数据窃取。
* 建议: 对所有渲染到 HTML 中的用户输入，使用 Flask 的 `escape()` 函数或启用自动转义的 Jinja2 模板。

### 严重程度指南：

* **HIGH（高）**：可直接利用的漏洞，导致 RCE、数据泄露或认证绕过。
* **MEDIUM（中）**：需要特定条件但影响力显著的漏洞。
* **LOW（低）**：纵深防御问题或影响较低的漏洞。

### 可信度评分：

* 0.9-1.0：已确定确切的利用路径，并在可能的情况下进行了测试。
* 0.8-0.9：具有已知利用方法的清晰漏洞模式。
* 0.7-0.8：可疑模式，需要特定条件才能利用。
* 0.7 以下：不要报告（过于投机）。

### 最终提醒：

仅关注“高（HIGH）”和“中（MEDIUM）”级别的发现。宁可漏掉一些理论性问题，也不要让报告充斥误报。每个发现都应该是安全工程师在 PR 审查中会自信提出的内容。

### 误报过滤：

> 你不需要运行命令来复现漏洞，只需阅读代码来判断是否为真实漏洞。不要使用 bash 工具或向任何文件写入内容。
> **硬性排除 - 自动排除符合以下模式的发现：**
> 1. 拒绝服务 (DoS) 漏洞或资源耗尽攻击。
> 2. 存储在磁盘上但已得到妥善保护的机密信息或凭证。
> 3. 频率限制问题或服务过载场景。
> 4. 内存消耗或 CPU 耗尽问题。
> 5. 非安全关键字段缺乏输入校验，且无证明存在安全影响。
> 6. GitHub Action 工作流中的输入清理问题，除非它们能明显通过不可信输入触发。
> 7. 缺乏加固措施。代码不被要求实现所有安全最佳实践，只需标记具体的漏洞。
> 8. 属于理论性而非实践性的竞态条件或定时攻击。仅在竞态条件具有具体问题时报告。
> 9. 与过时的第三方库相关的漏洞。这些由其他流程管理，不应在此报告。
> 10. Rust 中不可能出现缓冲区溢出或 Use-after-free 等内存安全问题。不要报告 Rust 或任何其他内存安全语言中的内存安全问题。
> 11. 仅作为单元测试或仅用于运行测试的文件。
> 12. 日志伪造（Log spoofing）问题。将未清理的用户输入输出到日志不属于漏洞。
> 13. 仅控制路径的 SSRF 漏洞。SSRF 仅在能控制主机（Host）或协议（Protocol）时才构成威胁。
> 14. 在 AI 系统提示词中包含用户控制的内容不属于漏洞。
> 15. 正则表达式注入。将不可信内容注入正则表达式不属于漏洞。
> 16. 正则表达式 DoS (ReDoS) 问题。
> 17. 不安全的文档。不要报告 Markdown 等文档文件中的任何发现。
> 18. 缺乏审计日志不属于漏洞。
> 
> **惯例参考 -**
> 1. 以明文形式记录高价值机密信息是漏洞。记录 URL 被认为是安全的。
> 2. UUID 可被假定为不可猜测的，不需要校验。
> 3. 环境变量和 CLI 标志是可信值。攻击者通常无法在安全环境中修改它们。任何依赖控制环境变量的攻击均视为无效。
> 4. 内存或文件描述符泄漏等资源管理问题无效。
> 5. 除非可信度极高，否则不应报告细微或低影响的 Web 漏洞，如 Tabnabbing、XS-Leaks、原型污染（Prototype pollution）和开放重定向。
> 6. React 和 Angular 通常能防御 XSS。除非使用了 `dangerouslySetInnerHTML`、`bypassSecurityTrustHtml` 或类似方法，否则这些框架不需要对用户输入进行清理或转义。不要报告 React/Angular 组件或 tsx 文件中的 XSS 漏洞，除非使用了不安全的方法。
> 7. 绝大多数 GitHub Action 工作流中的漏洞在实践中是不可利用的。在确认工作流漏洞之前，请确保它是具体的且具有非常明确的攻击路径。
> 8. 客户端 JS/TS 代码中缺乏权限检查或认证不属于漏洞。客户端代码不可信，不需要实现这些检查，它们应在服务端处理。同样适用于所有向后端发送不可信数据的流程，后端负责验证和清理所有输入。
> 9. 仅当“中（MEDIUM）”级别的发现是明显且具体的问题时才将其包含在内。
> 10. IPython Notebook (*.ipynb) 文件中的大多数漏洞在实践中不可利用。在确认 Notebook 漏洞前，请确保它是具体的，并具有不可信输入可触发漏洞的明确攻击路径。
> 11. 记录非 PII 数据不属于漏洞，即使数据可能具有敏感性。仅在暴露机密、密码或个人身份信息 (PII) 等敏感信息时才报告日志漏洞。
> 12. Shell 脚本中的命令注入漏洞通常在实践中不可利用，因为 Shell 脚本通常不带不可信用户输入运行。仅在具有不可信输入的具体且明确攻击路径时，才报告 Shell 脚本中的命令注入漏洞。
> 
> **信号质量标准 - 对于剩余的发现，评估：**
> 1. 是否存在具体的、可利用的且具有清晰攻击路径的漏洞？
> 2. 这是否代表了真实的安全风险，而非理论上的最佳实践？
> 3. 是否有具体的代码位置和复现步骤？
> 4. 此发现对于安全团队是否具有可操作性？
> 
> 为每个发现分配 1-10 的置信度分数：
> * 1-3：低置信度，可能是误报或噪音
> * 4-6：中置信度，需要调查
> * 7-10：高置信度，极可能是真实漏洞
> 

### 开始分析：

现在开始你的分析。请分三步进行：

1. 使用子任务（sub-task）识别漏洞。使用仓库探索工具了解代码库上下文，然后分析 PR 更改的安全影响。在此子任务的提示词中，包含上述所有内容。
2. 对于上述子任务识别出的每个漏洞，创建一个新的子任务来过滤误报。以并行子任务的形式启动这些任务。在这些子任务的提示词中，包含“误报过滤”指令中的所有内容。
3. 过滤掉任何子任务报告置信度低于 8 的漏洞。

**你的最终回复必须包含 Markdown 报告，且不得包含其他任何内容。**


------


*docs/custom-filtering-instructions.md*

# 自定义误报过滤指令 (Custom False Positive Filtering Instructions)

Claude 代码安全审查 Action 支持自定义误报过滤指令，允许您根据特定的环境和需求量身定制安全分析逻辑。

![](/images/2026/Claude/claude-code-security-review/custom-filtering-instructions.jpeg)

## 项目概览

默认情况下，该 SAST（静态应用安全测试）Action 包含了一套全面的排除规则和标准，用于过滤误报。然而，每个组织都有独特的安全要求、技术栈和威胁模型。通过 `false-positive-filtering-instructions` 输入项，您可以提供自己的自定义标准。

## 使用方法

1. 创建一个包含自定义过滤指令的文本文件（例如：`.github/false-positive-filtering.txt`）。
2. 在您的工作流文件中引用它：

```yaml
- uses: anthropics/claude-code-security-review@main
  with:
    false-positive-filtering-instructions: .github/false-positive-filtering.txt

```

## 文件格式

该文件应为纯文本格式，包含三个主要部分：

### 1. 硬性排除 (HARD EXCLUSIONS)

列出应自动从发现结果中排除的模式。

### 2. 信号质量标准 (SIGNAL QUALITY CRITERIA)

用于评估某项发现是否代表真实漏洞的衡量问题。

### 3. 惯例参考 (PRECEDENTS)

针对您环境中常见安全模式的具体指导建议。

## 示例

请参考 [examples/custom-false-positive-filtering.txt](https://www.google.com/search?q=../examples/custom-false-positive-filtering.txt)，查看为现代云原生应用量身定制的完整示例。

## 默认指令

如果未提供自定义文件，Action 将使用经过调优的默认指令，这些指令适用于大多数应用程序。

## 最佳实践

1. **从默认开始**：先使用默认指令，然后根据遇到的误报情况进行修改。
2. **具体化**：包含有关安全架构的详细信息（例如：“我们所有的身份验证均使用 AWS Cognito”）。
3. **记录假设前提**：解释排除某些模式的原因（例如：“k8s 资源限制可防止 DOS 攻击”）。
4. **版本控制**：像管理代码一样，在版本控制系统中追踪过滤指令的变更。
5. **团队评审**：让您的安全团队评审并批准过滤指令。

## 常见自定义内容

* **特定技术的排除**：排除不适用于您技术栈的发现。
* **基础设施假设**：记录基础设施层面的安全控制措施。
* **合规性要求**：根据您的合规性需求调整标准。
* **开发实践**：反映团队的安全实践和所使用的工具。


------


# examples/custom-false-positive-filtering.txt

**硬性排除 (HARD EXCLUSIONS) —— 自动排除符合以下模式的发现：**

1. **所有 DOS/资源耗尽** —— 我们已配置 K8s 资源限制和自动扩缩容。
2. **缺失频率限制** —— 由我们的 API 网关统一处理。
3. **Tabnabbing（标签页劫持）漏洞** —— 根据我们的威胁模型，此为可接受风险。
4. **测试文件** —— 以 `_test.go`、`_test.js` 结尾，或位于 `__tests__` 目录下的文件。
5. **文档文件** —— 如 `*.md`、`*.rst`。
6. **未暴露给用户的配置文件** ——（内部配置）。
7. **内存安全问题** —— 在 Rust、Go 或其他托管语言中。
8. **GraphQL 内省查询** —— 我们在开发环境中会有意暴露模式（Schema）。
9. **缺失 CSRF 防护** —— 我们专门使用无状态的 JWT 身份验证。
10. **针对非加密操作的定时攻击**。
11. **输入校验中的正则 DoS** —— 我们设置了请求超时机制。
12. **内部服务缺失安全响应头** ——（仅面向公众的服务才需要）。

**信号质量标准 (SIGNAL QUALITY CRITERIA) —— 对于剩余的发现，评估：**

1. **未经身份验证的外部攻击者**是否可以利用此漏洞？
2. 是否存在**实际的数据外泄**或系统受损的可能性？
3. 在我们的**生产 Kubernetes 环境**中是否可以利用？
4. 这是否绕过了我们 **API 网关的安全控制**？

**惯例参考 (PRECEDENTS) ——**

1. 我们所有的身份验证均使用 **AWS Cognito** —— 任何认证绕过都必须能击败 Cognito。
2. 所有 API 均要求提供经过网关层验证的有效 **JWT 令牌**。
3. **SQL 注入**仅在直接使用原始查询（Raw queries）时才成立（我们全程使用 **Prisma ORM**）。
4. 所有内部服务在 K8s 集群内均通过 **mTLS** 进行通信。
5. **机密信息（Secrets）** 存放于 AWS Secrets Manager 或 K8s Secrets 中，严禁出现在代码中。
6. 我们允许在开发/暂存环境（而非生产环境）中输出详细的错误信息。
7. **文件上传**通过预签名 URL 直接进入 **S3**（不涉及本地文件处理）。
8. 所有用户输入均被视为不可信，并在**后端进行验证**。
9. 前端验证仅用于提升用户体验（UX），不作为安全保障。
10. 我们使用 **CSP（内容安全策略）响应头**和严格的 `Content-Type` 校验。
11. **CORS** 跨域配置根据每个服务的实际需求进行配置。
12. 所有 **Webhook** 均使用 HMAC 签名验证。


------


*docs/custom-security-scan-instructions.md*

# 自定义安全扫描指令 (Custom Security Scan Instructions)

Claude 代码安全审查 Action 支持自定义安全扫描指令，允许您在安全审计中添加特定于组织或业务的漏洞类别。

![](/images/2026/Claude/claude-code-security-review/custom-security-scan-instructions.jpeg)

## 项目概览

默认的安全扫描涵盖了常见的漏洞类别，如 SQL 注入、XSS、身份验证问题等。然而，组织通常会基于以下因素产生特定的安全顾虑：

* **技术栈**（如 GraphQL、gRPC、特定的云服务商）
* **合规性要求**（如 GDPR、HIPAA、PCI DSS）
* **行业特定漏洞**（如金融服务、医疗保健）
* **自定义框架和库**

通过 `custom-security-scan-instructions` 输入项，您可以扩展 Claude 检查的安全类别。

## 使用方法

1. 创建一个包含自定义安全类别的文本文件（例如：`.github/custom-security-categories.txt`）。
2. 在您的工作流中引用它：

```yaml
- uses: anthropics/claude-code-security-review@main
  with:
    custom-security-scan-instructions: .github/custom-security-categories.txt
```

## 文件格式

该文件应包含额外的安全类别，格式与默认类别保持一致。每个类别应当：

* 以加粗的描述性标题开头（使用 `**类别名称:**`）
* 列出要检查的具体漏洞或模式
* 使用清晰、具有可操作性的描述

### 示例结构：

```
**类别名称:**
- 需要检查的具体漏洞或模式
- 另一个需要寻找的具体问题
- 关于构成该漏洞的详细描述

**另一个类别:**
- 更多具体检查项
- 待识别的额外模式
```

## 示例

### 行业特定示例

参考 [examples/custom-security-scan-instructions.txt](https://www.google.com/search?q=../examples/custom-security-scan-instructions.txt)，查看自定义 Claude Code 以寻找特定行业安全弱点的指令集示例，包括：

* 合规性检查（GDPR、HIPAA、PCI DSS）
* 金融服务安全
* 电子商务特定问题

## 工作原理

您的自定义指令将被附加在安全审计提示词中默认的“数据暴露（Data Exposure）”类别之后。这意味着：

1. **所有默认类别仍会被检查**。
2. 您的自定义类别是**扩展**而非替换默认扫描。
3. 同样的 HIGH/MEDIUM/LOW 严重程度指南依然适用。

## 最佳实践

1. **具体化**：提供构成各漏洞的清晰描述。
2. **包含上下文**：解释为什么某些内容在您的环境中属于漏洞。
3. **提供示例**：尽可能描述具体的攻击场景。
4. **避免重复**：检查默认类别以避免冗余。
5. **保持专注**：仅添加与您的代码库相关的类别。

## 默认类别参考

默认扫描已包含：

* **输入校验**（SQL 注入、命令注入、XXE 等）
* **认证与授权**
* **加密与机密管理**
* **注入与代码执行**
* **数据暴露**

您的自定义类别应当是对这些内容的补充，而不是重复。

## 编写有效类别的技巧

1. **针对特定技术栈**：
```
**GraphQL 安全:**
- 允许无限递归的查询深度攻击
- 字段级授权绕过
- 生产环境中的内省数据泄露
```


2. **专注于合规性**：
```
**GDPR 合规:**
- 未经同意机制的个人数据处理
- 缺失数据保留期限限制
- 缺乏数据可移植性 API
```


3. **业务逻辑**：
```
**支付处理:**
- 交易重放漏洞
- 货币转换汇率操纵
- 退款流程绕过
```


------


# examples/custom-security-scan-instructions.txt

**合规性专项检查：**

* **GDPR 第 17 条“被遗忘权（删除权）”**：实现过程中的功能缺失或漏洞。
* **HIPAA PHI（受保护健康信息）**：违反静态存储加密要求的行为。
* **PCI DSS**：信用卡数据保留时长超过允许期限。
* **SOC2 审计追踪**：系统具备篡改或删除审计日志的能力。
* **CCPA 数据可移植性**：相关 API 存在的安全漏洞。

**金融服务安全：**

* **交易重放攻击**：支付处理流程中的重复交易风险。
* **双花漏洞（Double-spending）**：账本系统中的资金双重支付漏洞。
* **利息计算操纵**：利用定时攻击篡改利率或利息结果。
* **监管报告篡改**：提交给监管机构的数据存在被非法修改的风险。
* **KYC（了解您的客户）绕过**：身份核验机制的绕过手段。

**电子商务专项：**

* **购物车篡改**：通过非法手段修改商品价格。
* **库存竞态条件**：允许商品超卖的逻辑漏洞。
* **优惠券/折扣叠加利用**：非法组合优惠代码以套取利益。
* **联盟营销追踪操纵**：篡改推广来源或返利数据。
* **评价系统认证绕过**：无需真实身份即可发布或修改评论。


------


# 使用 Claude Code 实现自动化安全审查

今天，我们正式在 Claude Code 中推出**自动化安全审查**功能。通过我们的 GitHub Actions 集成和全新的 `/security-review` 命令，开发者可以轻松地**让 Claude 识别安全隐患，并直接由其完成修复**。

随着开发者越来越多地依赖 AI 来加快交付速度和构建更复杂的系统，确保代码安全变得愈发关键。这些新功能允许你**将安全审查集成到现有工作流中，帮助你在漏洞进入生产环境之前将其截获**。

### 在终端中审查代码漏洞

全新的 `/security-review` 命令让你可以在提交代码前，直接从终端运行即时（ad-hoc）安全分析。在 Claude Code 中运行该命令，Claude 就会搜索你的代码库以寻找潜在漏洞，并对发现的任何问题提供详细解释。

该命令使用专门针对安全领域的提示词，检查常见的漏洞模式，包括：

* SQL 注入风险
* 跨站脚本 (XSS) 漏洞
* 身份验证与授权缺陷
* 不安全的数据处理
* 依赖项漏洞

在识别出问题后，你还可以要求 Claude Code 针对每个问题实施修复。这使安全审查保留在你的“内部开发循环”中，在问题最容易被修复的早期阶段就将其解决。

### 针对新 Pull Request 自动执行安全审查

全新的 Claude Code GitHub Action 将安全审查提升到了新高度——在每个 Pull Request (PR) 开启时对其进行自动分析。配置完成后，该 Action 将：

* 在新 PR 开启时自动触发
* 审查代码变更中的安全漏洞
* 应用可自定义的规则来过滤误报和已知问题
* 在 PR 中直接发布行内评论，指出发现的问题并提供修复建议

这为整个团队创建了一致的安全审查流程，确保没有任何代码在未经基础安全审查的情况下进入生产环境。该 Action 可与你现有的 CI/CD 流水线集成，并可根据团队的安全策略进行自定义。

![](/images/2026/Claude/claude-code-security-review/1.png)

### 在 Anthropic 内部提升产品安全性

我们自己也在使用这些功能来保障团队交付到生产环境的代码安全，其中也包括 Claude Code 自身。自设置该 GitHub Action 以来，它已经多次在我们的代码中发现安全漏洞，防止了它们被发布。

例如上周，我们的团队为一个小工具开发了新功能，该功能依赖于启动一个旨在接收本地连接的本地 HTTP 服务器。GitHub Action 识别出了一个可以通过 **DNS 重绑定（DNS Rebinding）** 利用的远程代码执行 (RCE) 漏洞，该漏洞在 PR 合并之前就得到了修复。

![](/images/2026/Claude/claude-code-security-review/2.png)

在另一个案例中，一位工程师构建了一个代理系统，用于安全管理内部凭据。GitHub Action 自动标记出该代理容易受到 **SSRF（服务端请求伪造）** 攻击，我们随后迅速修复了这一问题。

![](/images/2026/Claude/claude-code-security-review/3.png)

### 快速开始

这两项功能现已对所有 Claude Code 用户开放。开始使用自动化安全审查：

* **对于 `/security-review` 命令**：只需将 Claude Code 更新至最新版本，并在项目目录中运行 `/security-review`。你可以[查阅文档](https://github.com/anthropics/claude-code-security-review/tree/main?tab=readme-ov-file#security-review-slash-command)来定制属于你自己的命令版本。
* **对于 GitHub Action**：请[参阅文档](https://github.com/anthropics/claude-code-security-review)获取分步安装和配置说明。


------


# 基于代码仓库的安全评估结果示例

## 英文版

```
Evaluating entire repository: wang-junjian/LingMaster
------------------------------------------------------------
[EVAL] [11:09:54] Retrieved GitHub token from gh CLI
[EVAL] [11:09:54] Starting evaluation of entire repository: wang-junjian/LingMaster
[EVAL] [11:09:54] Cloning wang-junjian/LingMaster to /Users/junjian/code/audit/wang-junjian_LingMaster
[EVAL] [11:09:59] Running repository scan on /Users/junjian/code/audit/wang-junjian_LingMaster
[EVAL] [11:09:59] Executing repository scan for wang-junjian/LingMaster
[EVAL] [11:11:23] Cleaned up repository: /Users/junjian/code/audit/wang-junjian_LingMaster

============================================================
EVALUATION RESULTS:
Success: True
Runtime: 89.1 seconds
Vulnerabilities detected: True
Findings count: 9
```

Findings:
  - [HIGH] /Users/junjian/code/audit/wang-junjian_LingMaster/web/src/app/api/audio/route.ts:5
    - Description: The `/api/audio` endpoint accepts a `path` parameter from the user and directly passes it to `fs.existsSync()` and `fs.createReadStream()` without any validation or sanitization. This allows attackers to read arbitrary files on the server using path traversal attacks (e.g., `../`, `../../`).

  - [MEDIUM] /Users/junjian/code/audit/wang-junjian_LingMaster/web/src/lib/db.ts:4
    - Description: The SQLite database connection is created with a hardcoded absolute path (`/Users/junjian/GitHub/wang-junjian/LingMaster/lingmaster.db`). If this path changes or the application is deployed to a different environment, this will break functionality. Additionally, the database is opened in read-only mode, but the hardcoded path presents configuration management issues.

  - [HIGH] /Users/junjian/code/audit/wang-junjian_LingMaster/web/src/app/api:0
    - Description: All API endpoints (`/api/books`, `/api/units`, `/api/lessons`, `/api/segments`, `/api/audio`) are publicly accessible without any authentication or authorization checks. This allows unauthenticated users to access all data and potentially exploit other vulnerabilities.

  - [LOW] /Users/junjian/code/audit/wang-junjian_LingMaster/web/src/app/api/units/route.ts:9
    - Description: While the current SQLite implementation uses parameterized queries with `better-sqlite3`, which prevents SQL injection, the code structure shows potential risks if the query building logic becomes more complex. The use of string concatenation in query building (in `/api/units/route.ts`) is currently safe but should be monitored.

  - [MEDIUM] /Users/junjian/code/audit/wang-junjian_LingMaster/web/next.config.ts:0
    - Description: The application's `next.config.ts` and `layout.tsx` do not configure any security headers. This exposes the application to various attacks including XSS, clickjacking, and MIME sniffing.

  - [MEDIUM] /Users/junjian/code/audit/wang-junjian_LingMaster/web/next.config.ts:0
    - Description: There is no CORS (Cross-Origin Resource Sharing) configuration. This could lead to unexpected cross-origin requests if the application is accessed from different domains.

  - [MEDIUM] /Users/junjian/code/audit/wang-junjian_LingMaster/web/src/app/api:0
    - Description: All API endpoints accept query parameters without proper validation. For example, `bookId`, `unitId`, `lessonId`, and `type` parameters are accepted as strings and directly used without checking if they are valid numeric values or valid types.

  - [LOW] /Users/junjian/code/audit/wang-junjian_LingMaster/web/src/components/AudioPlayer.tsx:91
    - Description: The client-side code fetches and displays data from the API endpoints without any sanitization. While the current implementation doesn't render user-generated content in a dangerous way, the potential for XSS exists if the database stores malicious content.

  - [LOW] /Users/junjian/code/audit/wang-junjian_LingMaster/web/src/app/api:0
    - Description: All API endpoints have minimal or no error handling. Errors are caught at a high level, but no detailed error messages or logging are implemented. This makes debugging and security monitoring difficult.


Result saved to: eval_results/repo_wang-junjian_LingMaster.json

## 中文版

```
Evaluating entire repository: wang-junjian/LingMaster
------------------------------------------------------------
[EVAL] [14:58:21] Retrieved GitHub token from gh CLI
[EVAL] [14:58:21] Starting evaluation of entire repository: wang-junjian/LingMaster
[EVAL] [14:58:21] Cloning wang-junjian/LingMaster to /Users/junjian/code/audit/wang-junjian_LingMaster
[EVAL] [14:58:26] Running repository scan on /Users/junjian/code/audit/wang-junjian_LingMaster
[EVAL] [14:58:26] Executing repository scan for wang-junjian/LingMaster
[EVAL] [14:59:37] Cleaned up repository: /Users/junjian/code/audit/wang-junjian_LingMaster

============================================================
EVALUATION RESULTS:
Success: True
Runtime: 76.6 seconds
Vulnerabilities detected: True
Findings count: 9
```

Findings:
  - [HIGH] /Users/junjian/code/audit/wang-junjian_LingMaster/web/src/app/api/audio/route.ts:5
    - Description: audio API端点接受用户提供的`path`参数，并直接用于文件系统操作，没有进行任何安全验证或路径限制。攻击者可以使用路径遍历技术（如../）访问系统上的任意文件。

  - [MEDIUM] /Users/junjian/code/audit/wang-junjian_LingMaster/web/src/app/api/audio/route.ts:5
    - Description: audio API端点接受用户提供的路径参数并直接访问文件系统，虽然这不是传统的SSRF，但如果路径参数可以指向网络资源（如file://或http://），可能会导致类似SSRF的攻击。当前实现中，路径验证过于宽松。

  - [LOW] /Users/junjian/code/audit/wang-junjian_LingMaster/web/src/lib/db.ts:4
    - Description: 数据库连接配置中硬编码了绝对路径，可能导致敏感信息暴露。如果部署环境与开发环境不同，可能导致连接失败或安全问题。

  - [HIGH] /Users/junjian/code/audit/wang-junjian_LingMaster/web/src/app/api:0
    - Description: 所有API端点（/api/books、/api/units、/api/lessons、/api/segments、/api/audio）都没有实现身份验证机制，允许未授权用户访问敏感数据和资源。

  - [MEDIUM] /Users/junjian/code/audit/wang-junjian_LingMaster/web/src/app/api/units/route.ts:9
    - Description: 虽然使用了参数化查询，但units API端点使用了动态SQL拼接，存在SQL注入风险。虽然当前实现使用了参数化查询，但动态构建SQL语句仍需谨慎。

  - [MEDIUM] /Users/junjian/code/audit/wang-junjian_LingMaster/web/next.config.ts:0
    - Description: 应用程序没有配置适当的安全标头（如Content-Security-Policy、X-Frame-Options、X-XSS-Protection等），可能导致XSS和其他攻击。

  - [LOW] /Users/junjian/code/audit/wang-junjian_LingMaster/web/src/app/api:0
    - Description: API端点没有配置CORS（跨域资源共享）策略，可能导致跨域请求被阻止或允许不必要的来源访问API。

  - [MEDIUM] /Users/junjian/code/audit/wang-junjian_LingMaster/web/src/app/api/audio/route.ts:5
    - Description: audio API端点允许访问任意音频文件，没有验证请求的音频路径是否属于当前用户或有效课程，可能导致未授权访问敏感音频内容。

  - [LOW] /Users/junjian/code/audit/wang-junjian_LingMaster/web:0
    - Description: 应用程序没有使用环境变量管理配置，所有配置（如数据库路径）都硬编码在源代码中，可能导致敏感信息暴露和部署问题。

Result saved to: eval_results/repo_wang-junjian_LingMaster.json
