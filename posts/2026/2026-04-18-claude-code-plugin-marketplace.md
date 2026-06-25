---
layout: single
title:  "Claude Code 插件市场指南"
date:   2026-04-18 08:00:00 +0800
categories: [AI 与大模型, 开源生态]
tags: [ClaudeCode, Plugin, Marketplace, Skill]
---

<!-- more -->

## Claude Code

|  | User（用户范围） | Project（项目范围） | Local（本地范围） |
|:---:|---|---|---|
| **生效范围**	| 当前用户（跨所有项目）	| 该仓库的所有协作人员 | 仅限当前项目的当前用户 |
| **Settings<br>配置文件路径** | `~/.claude/settings.json` | `.claude/settings.json` | `.claude/settings.local.json` |
| **CLAUDE.md<br>指令文档** | `~/.claude/CLAUDE.md` | `CLAUDE.md` or `.claude/CLAUDE.md` | `CLAUDE.local.md` |
| **Skills<br>技能安装路径** | `~/.claude/skills/` | `.claude/skills/` |  |
| **Plugins<br>插件安装路径** | `~/.claude/plugins/` | `.claude/plugins/` |  |
| **MCP Server<br>MCP 服务器配置** | `~/.claude.json` | `.mcp.json` |  |
| **Subagents<br>子智能体配置** | `~/.claude/agents/` | `.claude/agents/` |  |

- [Configuration Scopes](https://code.claude.com/docs/en/settings#configuration-scopes)


## 插件市场

### 注册插件市场

**命令行运行：**

```bash
claude plugin marketplace add obra/superpowers-marketplace
```

**Claude Code 中运行：**

```bash
/plugin marketplace add obra/superpowers-marketplace
```

### 查看已注册的插件市场

```bash
claude plugin marketplace list
```
```
Configured marketplaces:

  ❯ claude-plugins-official
    Source: GitHub (anthropics/claude-plugins-official)

  ❯ superpowers-marketplace
    Source: GitHub (obra/superpowers-marketplace)
```

### 更新插件市场

```bash
claude plugin marketplace update
```

### 创建插件市场

#### 创建 GitHub 仓库

如：`https://github.com/wang-junjian/lnsoft-plugins-official`

#### 添加 `.claude-plugin/marketplace.json` 文件

内容示例：

```json
{
  "name": "lnsoft-plugins-official",
  "description": "Directory of popular Claude Code extensions including development tools, productivity plugins, and MCP integrations",
  "owner": {
    "name": "Wang Junjian",
    "email": "wang-junjian@qq.com"
  },
  "metadata": {
    "description": "Skills, workflows, and productivity tools",
    "version": "1.0.0"
  },
  "plugins": [
    {
      "name": "document-skills",
      "description": "Collection of document processing suite including Excel, Word, PowerPoint, and PDF capabilities",
      "source": "./",
      "skills": [
        "./skills/xlsx",
        "./skills/docx",
        "./skills/pptx",
        "./skills/pdf"
      ]
    },
    {
      "name": "superpowers",
      "source": {
        "source": "url",
        "url": "https://github.com/obra/superpowers.git"
      },
      "description": "Core skills library: TDD, debugging, collaboration patterns, and proven techniques",
      "version": "5.0.7",
      "strict": true
    },
    {
      "name": "frontend-design",
      "description": "Create distinctive, production-grade frontend interfaces with high design quality. Generates creative, polished code that avoids generic AI aesthetics.",
      "author": {
        "name": "Anthropic",
        "email": "support@anthropic.com"
      },
      "source": "./plugins/frontend-design",
      "category": "development",
      "homepage": "https://github.com/anthropics/claude-plugins-public/tree/main/plugins/frontend-design"
    },
    {
      "name": "github",
      "description": "Official GitHub MCP server for repository management. Create issues, manage pull requests, review code, search repositories, and interact with GitHub's full API directly from Claude Code.",
      "category": "productivity",
      "source": "./external_plugins/github",
      "homepage": "https://github.com/anthropics/claude-plugins-public/tree/main/external_plugins/github"
    },
    {
      "name": "gitlab",
      "description": "GitLab DevOps platform integration. Manage repositories, merge requests, CI/CD pipelines, issues, and wikis. Full access to GitLab's comprehensive DevOps lifecycle tools.",
      "category": "productivity",
      "source": "./external_plugins/gitlab",
      "homepage": "https://github.com/anthropics/claude-plugins-public/tree/main/external_plugins/gitlab"
    }
  ]
}
```

#### 增加相对路径的插件和技能

**例如**：github 插件的 MCP Server 代码放在 `./external_plugins/github`。

- `external_plugins/gitlab/.claude-plugin/plugin.json`

> 遵循标准做法的插件，方便独立使用和发布，也更利于维护。

```json
{
  "name": "gitlab",
  "description": "GitLab DevOps platform integration. Manage repositories, merge requests, CI/CD pipelines, issues, and wikis. Full access to GitLab's comprehensive DevOps lifecycle tools.",
  "author": {
    "name": "GitLab"
  }
}
```

- `external_plugins/gitlab/.mcp.json`

```json
{
  "gitlab": {
    "type": "http",
    "url": "https://gitlab.com/api/v4/mcp"
  }
}
```

#### 🧩 插件说明

| 插件名称 | 类型 | 说明 |
|---------|------|------|
| `document-skills` | 技能集合 | 包含 Excel、Word、PowerPoint、PDF 处理能力 |
| `superpowers` | 技能库 | 核心技能：TDD、调试、协作模式等（版本 5.0.7） |
| `frontend-design` | 前端设计 | 生成高质量前端界面，避免通用 AI 风格 |
| `github` | MCP 集成 | GitHub API 交互：Issue、PR、代码审查等 |
| `gitlab` | MCP 集成 | GitLab DevOps 集成：仓库、MR、CI/CD、Wiki 等 |


## 插件

### 安装插件

```bash
claude plugin install <plugin-name>@<marketplace-name>
# claude plugin install <plugin-name>
```

```bash
/plugin install <plugin-name>@<marketplace-name>
# /plugin install <plugin-name>
```

#### 安装 frontend-design 插件

```bash
claude plugin install frontend-design@claude-plugins-official
```

#### 安装 superpowers 插件

```bash
claude plugin install superpowers@superpowers-marketplace
```

### 查看已安装的插件

```bash
claude plugin list
```
```
Installed plugins:

  ❯ frontend-design@claude-plugins-official
    Version: 2cd88e7947b7
    Scope: user
    Status: ✘ enabled

  ❯ superpowers@superpowers-marketplace
    Version: 5.0.7
    Scope: user
    Status: ✔ enabled
```

### `enable` / `disable` 插件

```bash
claude plugin disable frontend-design@claude-plugins-official
```

```bash
claude plugin enable frontend-design@claude-plugins-official
```

### 卸载插件

```bash
claude plugin install <plugin-name>@<marketplace-name>
# claude plugin install <plugin-name>
```

```bash
/plugin install <plugin-name>@<marketplace-name>
# /plugin install <plugin-name>
```

#### 卸载 frontend-design 插件

```bash
claude plugin uninstall frontend-design@claude-plugins-official
```


## Skill

- [Agent Skills](https://agentskills.io/)
- [Agent Skills 规范](https://agentskills.io/specification)

### [Agent Skills Tool](https://github.com/vercel-labs/skills)

这是 Vercel Labs 开源的 **AI 智能体技能管理 CLI 工具**，可一键安装、管理、创建跨多种 AI 编码助手的可复用技能，支持 Cursor、Claude Code、GitHub Copilot 等数十种 AI 编码工具。

```bash
npx skills
```
```
███████╗██╗  ██╗██╗██╗     ██╗     ███████╗
██╔════╝██║ ██╔╝██║██║     ██║     ██╔════╝
███████╗█████╔╝ ██║██║     ██║     ███████╗
╚════██║██╔═██╗ ██║██║     ██║     ╚════██║
███████║██║  ██╗██║███████╗███████╗███████║
╚══════╝╚═╝  ╚═╝╚═╝╚══════╝╚══════╝╚══════╝

The open agent skills ecosystem

  $ npx skills add <package>        Add a new skill
  $ npx skills remove               Remove installed skills
  $ npx skills list                 List installed skills
  $ npx skills find [query]         Search for skills

  $ npx skills update               Update installed skills

  $ npx skills experimental_install Restore from skills-lock.json
  $ npx skills init [name]          Create a new skill
  $ npx skills experimental_sync    Sync skills from node_modules

try: npx skills add vercel-labs/agent-skills

Discover more skills at https://skills.sh/
```

#### 列出已安装的技能(全局)

```bash
npx skills list -g
```

#### 支持的 Agent

| Agent                                 | `--agent`                                | Project Path           | Global Path                     |
| ------------------------------------- | ---------------------------------------- | ---------------------- | ------------------------------- |
| Amp, Kimi Code CLI, Replit, Universal | `amp`, `kimi-cli`, `replit`, `universal` | `.agents/skills/`      | `~/.config/agents/skills/`      |
| Antigravity                           | `antigravity`                            | `.agents/skills/`      | `~/.gemini/antigravity/skills/` |
| Augment                               | `augment`                                | `.augment/skills/`     | `~/.augment/skills/`            |
| IBM Bob                               | `bob`                                    | `.bob/skills/`         | `~/.bob/skills/`                |
| Claude Code                           | `claude-code`                            | `.claude/skills/`      | `~/.claude/skills/`             |
| OpenClaw                              | `openclaw`                               | `skills/`              | `~/.openclaw/skills/`           |
| Cline, Warp                           | `cline`, `warp`                          | `.agents/skills/`      | `~/.agents/skills/`             |
| CodeBuddy                             | `codebuddy`                              | `.codebuddy/skills/`   | `~/.codebuddy/skills/`          |
| Codex                                 | `codex`                                  | `.agents/skills/`      | `~/.codex/skills/`              |
| Command Code                          | `command-code`                           | `.commandcode/skills/` | `~/.commandcode/skills/`        |
| Continue                              | `continue`                               | `.continue/skills/`    | `~/.continue/skills/`           |
| Cortex Code                           | `cortex`                                 | `.cortex/skills/`      | `~/.snowflake/cortex/skills/`   |
| Crush                                 | `crush`                                  | `.crush/skills/`       | `~/.config/crush/skills/`       |
| Cursor                                | `cursor`                                 | `.agents/skills/`      | `~/.cursor/skills/`             |
| Deep Agents                           | `deepagents`                             | `.agents/skills/`      | `~/.deepagents/agent/skills/`   |
| Droid                                 | `droid`                                  | `.factory/skills/`     | `~/.factory/skills/`            |
| Firebender                            | `firebender`                             | `.agents/skills/`      | `~/.firebender/skills/`         |
| Gemini CLI                            | `gemini-cli`                             | `.agents/skills/`      | `~/.gemini/skills/`             |
| GitHub Copilot                        | `github-copilot`                         | `.agents/skills/`      | `~/.copilot/skills/`            |
| Goose                                 | `goose`                                  | `.goose/skills/`       | `~/.config/goose/skills/`       |
| Junie                                 | `junie`                                  | `.junie/skills/`       | `~/.junie/skills/`              |
| iFlow CLI                             | `iflow-cli`                              | `.iflow/skills/`       | `~/.iflow/skills/`              |
| Kilo Code                             | `kilo`                                   | `.kilocode/skills/`    | `~/.kilocode/skills/`           |
| Kiro CLI                              | `kiro-cli`                               | `.kiro/skills/`        | `~/.kiro/skills/`               |
| Kode                                  | `kode`                                   | `.kode/skills/`        | `~/.kode/skills/`               |
| MCPJam                                | `mcpjam`                                 | `.mcpjam/skills/`      | `~/.mcpjam/skills/`             |
| Mistral Vibe                          | `mistral-vibe`                           | `.vibe/skills/`        | `~/.vibe/skills/`               |
| Mux                                   | `mux`                                    | `.mux/skills/`         | `~/.mux/skills/`                |
| OpenCode                              | `opencode`                               | `.agents/skills/`      | `~/.config/opencode/skills/`    |
| OpenHands                             | `openhands`                              | `.openhands/skills/`   | `~/.openhands/skills/`          |
| Pi                                    | `pi`                                     | `.pi/skills/`          | `~/.pi/agent/skills/`           |
| Qoder                                 | `qoder`                                  | `.qoder/skills/`       | `~/.qoder/skills/`              |
| Qwen Code                             | `qwen-code`                              | `.qwen/skills/`        | `~/.qwen/skills/`               |
| Roo Code                              | `roo`                                    | `.roo/skills/`         | `~/.roo/skills/`                |
| Trae                                  | `trae`                                   | `.trae/skills/`        | `~/.trae/skills/`               |
| Trae CN                               | `trae-cn`                                | `.trae/skills/`        | `~/.trae-cn/skills/`            |
| Windsurf                              | `windsurf`                               | `.windsurf/skills/`    | `~/.codeium/windsurf/skills/`   |
| Zencoder                              | `zencoder`                               | `.zencoder/skills/`    | `~/.zencoder/skills/`           |
| Neovate                               | `neovate`                                | `.neovate/skills/`     | `~/.neovate/skills/`            |
| Pochi                                 | `pochi`                                  | `.pochi/skills/`       | `~/.pochi/skills/`              |
| AdaL                                  | `adal`                                   | `.adal/skills/`        | `~/.adal/skills/`               |


### 安装 Vercel Labs 的 Agent Skills

```bash
npx skills add vercel-labs/agent-skills -a claude-code -g \
  --skill "vercel-react-best-practices" \
  --skill "web-design-guidelines" \
  --skill "vercel-react-native-skills" \
  --skill "vercel-react-view-transitions" \
  --skill "vercel-composition-patterns"
```

这条命令的作用是**将一组特定的技能（Skills）安装到 Claude Code 中，并将其配置为全局可用**。

* **`npx skills add vercel-labs/agent-skills`**:
    这是核心指令。它使用 `npx` 运行 `skills` CLI 工具，并从 GitHub 仓库 `vercel-labs/agent-skills` 获取并添加技能。
* **`-a claude-code`**:
    指定安装的目标智能体（Agent）为 **Claude Code**。该工具会将这些技能安装到 `.claude/skills/` 目录下。
* **`-g` (或 `--global`)**:
    指定安装范围为**全局（Global）**。这意味着这些技能将安装在 `~/.claude/skills/` 目录下，而不是当前项目的本地目录中，从而使它们在所有项目中都能使用。
* **`--skill "..."`**:
    后面跟随的五个 `--skill` 选项，明确指定了需要从该仓库中安装的具体技能名称。程序将仅安装这五个指定的技能，而不是仓库中的全部技能。


## 推荐插件

### 官方

- [Frontend Design](https://claude.com/plugins/frontend-design)
- [Code Simplifier](https://claude.com/plugins/code-simplifier)
- [Skill Creator](https://claude.com/plugins/skill-creator)
- [Plugin Developer Toolkit](https://claude.com/plugins/plugin-dev)
- [Chrome DevTools](https://claude.com/plugins/chrome-devtools-mcp)
- [Feature Dev](https://claude.com/plugins/feature-dev)
- [Security Guidance](https://claude.com/plugins/security-guidance)
- [Claude Code Setup](https://claude.com/plugins/claude-code-setup)
- [Serena](https://claude.com/plugins/serena)
- [Firecrawl](https://claude.com/plugins/firecrawl)

#### [Frontend Design](https://claude.com/plugins/frontend-design)
这是一个**生产级前端开发辅助专家**。其核心能力在于能够超越“AI 审美”，根据自然语言描述直接生成符合工业标准的 UI 代码。它不仅能处理布局和组件逻辑，还特别强调避免生成“通用 AI 风格”的界面，而是产出具有独特设计感、可直接投入生产环境的各种前端框架代码。

**安装**

```bash
claude plugin install frontend-design@claude-plugins-official
```

**卸载**

```bash
claude plugin uninstall frontend-design@claude-plugins-official
```

#### [Code Simplifier](https://claude.com/plugins/code-simplifier)
代码清晰智能体：在保留功能和一致性的同时，简化并优化最近修改的代码。

**安装**

```bash
claude plugin install code-simplifier@claude-plugins-official
```

**卸载**

```bash
claude plugin uninstall code-simplifier@claude-plugins-official
```

#### [Skill Creator](https://claude.com/plugins/skill-creator)
这是一个**AI 能力定义与优化工具**。它允许用户从零开始创建新技能、修改或增强现有技能。其专业性体现在它能运行 Evals（评估测试）来衡量技能性能，进行方差分析以基准测试稳定性，并能自动优化技能的描述（Description），从而提高 Claude 在调用工具时的触发准确率。

**安装**

```bash
claude plugin install skill-creator@claude-plugins-official
```

**卸载**

```bash
claude plugin uninstall skill-creator@claude-plugins-official
```

#### [Plugin Developer Toolkit](https://claude.com/plugins/plugin-dev)
这是专为**插件开发者设计的 7 合 1 专家工具包**。它涵盖了从 MCP（Model Context Protocol）接入、Hooks 钩子函数定义、指令逻辑校验到最佳实践指导的完整生命周期。它的核心能力是让开发者能快速构建出像 Figma 插件那样集成了 MCP 连接和专业技能的复合型插件。

**安装**

```bash
claude plugin install plugin-dev@claude-plugins-official
```

**卸载**

```bash
claude plugin uninstall plugin-dev@claude-plugins-official
```

#### [Chrome DevTools](https://claude.com/plugins/chrome-devtools-mcp)
这是一个**赋予 AI 浏览器操控与调试权力的 MCP 服务**。它允许 Claude 直接控制并检查正在运行的 Chrome 浏览器实例。其核心能力包括：记录性能轨迹（Performance Traces）、实时分析网络请求、操控页面 DOM 元素。它将 AI 变成了一个能直接在浏览器中诊断并修复问题的远程自动化工程师。

**安装**

```bash
claude plugin install chrome-devtools-mcp@claude-plugins-official
```

**卸载**

```bash
claude plugin uninstall chrome-devtools-mcp@claude-plugins-official
```

#### [Feature Dev](https://claude.com/plugins/feature-dev)
这是一个**结构化功能开发框架**。它通过内置的“7 阶段工作流”取代了零散的 Prompt 交互。其核心能力是启动 2-3 个具备不同侧重点（如：最小改动优先、整洁架构优先）的“代码架构代理”，引导 AI 经历 codebase 探索、架构设计、实现、质量审查等闭环，确保复杂功能在多文件间的一致性。

**安装**

```bash
claude plugin install feature-dev@claude-plugins-official
```

**卸载**

```bash
claude plugin uninstall feature-dev@claude-plugins-official
```

#### [Security Guidance](https://claude.com/plugins/security-guidance)
这是一个**预防性代码安全钩子（Hook）**。它在文件编辑阶段实时介入，其能力在于自动识别并预警潜在的安全隐患，如命令注入、跨站脚本（XSS）风险以及不安全的代码模式。它通过将安全审查嵌入编写过程，确保产出的代码在逻辑正确的同时具备防御性。

**安装**

```bash
claude plugin install security-guidance@claude-plugins-official
```

**卸载**

```bash
claude plugin uninstall security-guidance@claude-plugins-official
```

#### [Claude Code Setup](https://claude.com/plugins/claude-code-setup)
这是**本地 CLI 环境的配置总线**。它负责引导用户完成 Claude Code 终端工具的初始化，其关键能力在于管理模型工作模式（如：自动接受编辑 vs 询问确认）、上下文清理策略以及本地权限的自动化绑定。它解决了 AI 与本地开发环境（如 shell、git）对接的第一公里问题。

**安装**

```bash
claude plugin install claude-code-setup@claude-plugins-official
```

**卸载**

```bash
claude plugin uninstall claude-code-setup@claude-plugins-official
```

#### [Serena](https://claude.com/plugins/serena)
这是**面向 Agent 的“语义级 IDE”**。不同于传统的行号查找，Serena 基于代码的符号理解（Symbolic Understanding）提供检索和重构能力。其核心优势在于它集成了 LSP（语言服务器协议），让 AI 代理能够像人类资深开发者一样利用语义关系、全局引用分析来精准地定位、阅读和修改跨模块的代码逻辑。

**安装**

```bash
claude plugin install serena@claude-plugins-official
```

**卸载**

```bash
claude plugin uninstall serena@claude-plugins-official
```

#### [Firecrawl](https://claude.com/plugins/firecrawl)
这是一个**将全网转化为 LLM 友好数据的强力引擎**。它能绕过反爬虫和 JavaScript 渲染难题，将复杂的动态网页直接映射为结构化的 Markdown 或 JSON。其核心能力包括：`/map`（发现站点所有 URL）、`/crawl`（递归爬取整个域）以及 `/agent`（通过自然语言跨站寻找并提取特定数据），为 AI 提供了极高质量的实时信息输入。

**安装**

```bash
claude plugin install firecrawl@claude-plugins-official
```

**卸载**

```bash
claude plugin uninstall firecrawl@claude-plugins-official
```

### Anthropic Agent Skills

**注册插件市场**

```bash
claude plugin marketplace add anthropics/skills
```

```bash
/plugin marketplace add anthropics/skills
```

**卸载插件市场**

```bash
claude plugin marketplace rm anthropics/skills
```

```bash
/plugin marketplace rm anthropics/skills
```

#### Document Skills

一套集文档处理功能的套件，包含 Excel、Word、PowerPoint 及 PDF 处理能力。

**安装**

```bash
claude plugin install document-skills@anthropic-agent-skills
```

```bash
/plugin install document-skills@anthropic-agent-skills
```

**卸载**

```bash
claude plugin uninstall document-skills@anthropic-agent-skills
```

```bash
/plugin uninstall document-skills@anthropic-agent-skills
```

### [Superpowers](https://github.com/obra/superpowers)

这是一套**面向 AI Agent 的工程化方法论与技能框架**，实现了可组合的“技能”。它的核心能力是将人类资深工程师的“纪律性”注入 AI。它强制 AI 告别盲目写码，转而遵循从**头脑风暴（Brainstorming）**明确需求、到**编写详尽计划（Writing Plans）**、再到执行**测试驱动开发（TDD）**与**系统化调试（Systematic Debugging）** 的严谨流程。

**注册插件市场**

```bash
claude plugin marketplace add superpowers@superpowers-marketplace
```

```bash
/plugin marketplace add superpowers@superpowers-marketplace
```

**卸载插件市场**

```bash
claude plugin marketplace rm superpowers@superpowers-marketplace
```

```bash
/plugin marketplace rm superpowers@superpowers-marketplace
```

**安装插件**

```bash
claude plugin install superpowers@superpowers-marketplace
```

```bash
/plugin install superpowers@superpowers-marketplace
```

**卸载插件**

```bash
claude plugin uninstall superpowers@superpowers-marketplace
```

```bash
/plugin uninstall superpowers@superpowers-marketplace
```

### [Understand-Anything](https://github.com/Lum1104/Understand-Anything)

这是一个通过多智能体（multi-agent）流水线将代码库或知识库转化为交互式知识图谱，并提供可视化看板和 AI 问答功能的 Claude Code 插件。

**注册插件市场**

```bash
claude plugin marketplace add Lum1104/Understand-Anything
```

```bash
/plugin marketplace add Lum1104/Understand-Anything
```

**卸载插件市场**

```bash
claude plugin marketplace rm Lum1104/Understand-Anything
```

```bash
/plugin marketplace rm Lum1104/Understand-Anything
```

**安装插件**

```bash
claude plugin install understand-anything
```

```bash
/plugin install understand-anything
```

**卸载插件**

```bash
claude plugin uninstall understand-anything
```

```bash
/plugin uninstall understand-anything
```

### [Claude for Financial Services Plugins](https://github.com/anthropics/financial-services-plugins)

这是 Anthropic 开源的**金融服务专用 Claude 插件库**，面向投行、行研、私募、财富管理等场景，通过内置专业技能、快捷指令与 MCP 数据接口，让 Claude 直接完成从数据获取、财务建模到生成 Excel/PPT/ 正式报告的完整金融工作流，支持企业自定义适配内部流程与模板。

### [Knowledge Work Plugins](https://github.com/anthropics/knowledge-work-plugins)

面向 Claude Cowork 与 Claude Code 打造的**专业岗位插件**，通过集成领域技能、工具连接与斜杠命令，让 Claude 适配不同职业场景与企业工作流，高效输出标准化专业工作成果。


## 推荐 Skill

### [Anthropic Agent Skills](https://github.com/anthropics/skills)

**安装**

```bash
npx skills add anthropics/skills -a claude-code -g \
  --skill "xlsx" \
  --skill "docx" \
  --skill "pptx" \
  --skill "pdf"
```

**卸载**

```bash
npx skills remove anthropics/skills -a claude-code -g \
  --skill "xlsx" \
  --skill "docx" \
  --skill "pptx" \
  --skill "pdf"
```

### [Vercel Agent Skills](https://github.com/vercel-labs/agent-skills)

**安装**

```bash
npx skills add vercel-labs/agent-skills -a claude-code -g \
  --skill "vercel-react-best-practices" \
  --skill "web-design-guidelines" \
  --skill "vercel-react-native-skills" \
  --skill "vercel-react-view-transitions" \
  --skill "vercel-composition-patterns"
```

**卸载**

```bash
npx skills remove vercel-labs/agent-skills -a claude-code -g \
  --skill "vercel-react-best-practices" \
  --skill "web-design-guidelines" \
  --skill "vercel-react-native-skills" \
  --skill "vercel-react-view-transitions" \
  --skill "vercel-composition-patterns"
```


## 参考资料
- [Claude Plugins](https://claude.com/plugins)
- [Claude Code Plugins](https://github.com/anthropics/claude-plugins-official)
  - [.claude-plugin/marketplace.json](https://github.com/anthropics/claude-plugins-official/blob/main/.claude-plugin/marketplace.json)
- [Claude Plugins — Community](https://github.com/anthropics/claude-plugins-community)
  - [.claude-plugin/marketplace.json](https://github.com/anthropics/claude-plugins-community/blob/main/.claude-plugin/marketplace.json)
- [Claude Code Skills Marketplace](https://github.com/daymade/claude-code-skills)
- [PM Skills Marketplace: The AI Operating System for Better Product Decisions](https://github.com/phuryn/pm-skills)
- [gemma-skills](https://github.com/google-gemma/gemma-skills)
