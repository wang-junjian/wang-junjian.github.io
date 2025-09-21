---
layout: single
title:  "Claude Code 的配置与权限"
date:   2025-09-13 08:00:00 +0800
categories: ClaudeCode Agent
tags: [ClaudeCode, Agent, Claude, CLI, Doc]
---

<!--more-->

## [Claude Code](https://www.anthropic.com/claude-code)

- [Claude Code 文档](https://docs.anthropic.com/zh-CN/docs/claude-code/overview)
- [GitHub claude-code](https://github.com/anthropics/claude-code)

### 安装

```shell
npm install -g @anthropic-ai/claude-code
```


## [设置](https://docs.anthropic.com/en/docs/claude-code/settings)

### 设置文件

`settings.json` 文件是通过分层设置配置 Claude Code 的官方机制：

* **用户设置** 在 `~/.claude/settings.json` 中定义，适用于所有项目。
* **项目设置** 保存在您的项目目录中：
  * `.claude/settings.json` 用于检入源代码控制并与团队共享的设置
  * `.claude/settings.local.json` 用于不检入的设置，对个人偏好和实验很有用。Claude Code 会在创建时配置 git 忽略 `.claude/settings.local.json`。
* 对于 Claude Code 的企业部署，还支持**企业托管策略设置**。这些设置优先于用户和项目设置。系统管理员可以将策略部署到：
  * macOS: `/Library/Application Support/ClaudeCode/managed-settings.json`
  * Linux 和 WSL: `/etc/claude-code/managed-settings.json`
  * Windows: `C:\ProgramData\ClaudeCode\managed-settings.json`

**示例 settings.json**

```JSON
{
  "permissions": {
    "allow": [
      "Bash(npm run lint)",
      "Bash(npm run test:*)",
      "Read(~/.zshrc)"
    ],
    "deny": [
      "Bash(curl:*)",
      "Read(./.env)",
      "Read(./.env.*)",
      "Read(./secrets/**)"
    ]
  },
  "env": {
    "CLAUDE_CODE_ENABLE_TELEMETRY": "1",
    "OTEL_METRICS_EXPORTER": "otlp"
  }
}
```

### 可用设置

`settings.json` 支持多个选项：

| 键                            | 描述 | 示例 |
| :--------------------------- | :--- | :--- |
| `apiKeyHelper`               | 自定义脚本，在 `/bin/sh` 中执行，生成认证值。此值将作为 `X-Api-Key` 和 `Authorization: Bearer` 标头发送给模型请求 | `/bin/generate_temp_api_key.sh`|
| `cleanupPeriodDays`          | 基于最后活动日期本地保留聊天记录的时间（默认：30天） | `20` |
| `env`                        | 将应用于每个会话的环境变量 | `{"FOO": "bar"}` |
| `includeCoAuthoredBy`        | 是否在 git 提交和拉取请求中包含 `co-authored-by Claude` 署名（默认：`true`）                          | `false` |
| `permissions`                | 权限结构见下表。👇 |   |
| `hooks`                      | 配置在工具执行前后运行的自定义命令。参见[钩子文档](hooks) | `{"PreToolUse": {"Bash": "echo 'Running command...'"}}`     |
| `disableAllHooks`            | 禁用所有[钩子](hooks)  | `true` |
| `model`                      | 覆盖 Claude Code 使用的默认模型  | `"claude-3-5-sonnet-20241022"` |
| `statusLine`                 | 配置自定义状态行以显示上下文。参见[statusLine 文档](statusline) | `{"type": "command", "command": "~/.claude/statusline.sh"}` |
| `outputStyle`                | 配置输出样式以调整系统提示。参见[输出样式文档](output-styles) | `"Explanatory"`                |
| `forceLoginMethod`           | 使用 `claudeai` 限制登录到 Claude.ai 账户，`console` 限制登录到 Anthropic Console（API 使用计费）账户    | `claudeai` |
| `forceLoginOrgUUID`          | 指定组织的 UUID 以在登录期间自动选择它，绕过组织选择步骤。需要设置 `forceLoginMethod` | `"xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"` |
| `enableAllProjectMcpServers` | 自动批准项目 `.mcp.json` 文件中定义的所有 MCP 服务器 | `true` |
| `enabledMcpjsonServers`      | 从 `.mcp.json` 文件中批准的特定 MCP 服务器列表 | `["memory", "github"]` |
| `disabledMcpjsonServers`     | 从 `.mcp.json` 文件中拒绝的特定 MCP 服务器列表 | `["filesystem"]` |

### 权限设置

| 键 | 描述 | 示例 |
| :--- | :--- | :--- |
| `allow` | 允许工具使用的[权限规则](/zh-CN/docs/claude-code/iam#configuring-permissions)数组。**注意：** Bash 规则使用前缀匹配，不是正则表达式 | `[ "Bash(git diff:*)" ]` |
| `ask` | 在工具使用时要求确认的[权限规则](/zh-CN/docs/claude-code/iam#configuring-permissions)数组。 | `[ "Bash(git push:*)" ]` |
| `deny` | 拒绝工具使用的[权限规则](/zh-CN/docs/claude-code/iam#configuring-permissions)数组。使用此选项也可以排除敏感文件不被 Claude Code 访问。**注意：** Bash 模式是前缀匹配，可以被绕过（参见[Bash 权限限制](/zh-CN/docs/claude-code/iam#tool-specific-permission-rules)） | `[ "WebFetch", "Bash(curl:*)", "Read(./.env)", "Read(./secrets/**)" ]` |
| `additionalDirectories` | Claude 可以访问的额外[工作目录](iam#working-directories) |
| `defaultMode` | 打开 Claude Code 时的默认[权限模式](iam#permission-modes) | `"acceptEdits"` |
| `disableBypassPermissionsMode` | 设置为 `"disable"` 以防止激活 `bypassPermissions` 模式。参见[托管策略设置](iam#enterprise-managed-policy-settings) | `"disable"` |

### 设置优先级

设置按优先级顺序应用（从高到低）：

1. **企业托管策略**（`managed-settings.json`）
   * 由 IT/DevOps 部署
   * 无法被覆盖

2. **命令行参数**
   * 特定会话的临时覆盖

3. **本地项目设置**（`.claude/settings.local.json`）
   * 个人项目特定设置

4. **共享项目设置**（`.claude/settings.json`）
   * 源代码控制中的团队共享项目设置

5. **用户设置**（`~/.claude/settings.json`）
   * 个人全局设置

此层次结构确保企业安全策略始终得到执行，同时仍允许团队和个人自定义其体验。

### 配置系统的关键点

* **内存文件（CLAUDE.md）**：包含 Claude 在启动时加载的指令和上下文
* **设置文件（JSON）**：配置权限、环境变量和工具行为
* **斜杠命令**：可以在会话期间使用 `/command-name` 调用的自定义命令
* **MCP 服务器**：使用额外的工具和集成扩展 Claude Code
* **优先级**：更高级别的配置（企业）覆盖较低级别的配置（用户/项目）
* **继承**：设置被合并，更具体的设置添加到或覆盖更广泛的设置

### 排除敏感文件

要防止 Claude Code 访问包含敏感信息的文件（例如，API 密钥、秘密、环境文件），请在您的 `.claude/settings.json` 文件中使用 `permissions.deny` 设置：

```json
{
  "permissions": {
    "deny": [
      "Read(./.env)",
      "Read(./.env.*)",
      "Read(./secrets/**)",
      "Read(./config/credentials.json)",
      "Read(./build)"
    ]
  }
}
```

匹配这些模式的文件将对 Claude Code 完全不可见，防止任何意外暴露敏感数据。

### 环境变量

Claude Code 支持以下环境变量来控制其行为：

> 这作为自动为每个会话设置环境变量的方式很有用，或者为您的整个团队或组织推出一组环境变量。

| 变量 | 目的 |
| :----------------------------------------- | :--- |
| `ANTHROPIC_API_KEY`                        | 作为 `X-Api-Key` 标头发送的 API 密钥，通常用于 Claude SDK（对于交互式使用，运行 `/login`） |
| `ANTHROPIC_AUTH_TOKEN`                     | `Authorization` 标头的自定义值（您在此处设置的值将以 `Bearer ` 为前缀） |
| `ANTHROPIC_CUSTOM_HEADERS`                 | 您想要添加到请求的自定义标头（以 `Name: Value` 格式） |
| `ANTHROPIC_MODEL`                          | 要使用的模型设置名称 |
| `BASH_DEFAULT_TIMEOUT_MS`                  | 长时间运行的 bash 命令的默认超时    |
| `BASH_MAX_OUTPUT_LENGTH`                   | bash 输出在中间截断之前的最大字符数  |
| `BASH_MAX_TIMEOUT_MS`                      | 模型可以为长时间运行的 bash 命令设置的最大超时 |
| `CLAUDE_BASH_MAINTAIN_PROJECT_WORKING_DIR` | 在每个 Bash 命令后返回到原始工作目录 |
| `CLAUDE_CODE_API_KEY_HELPER_TTL_MS`        | 凭证应刷新的间隔（毫秒）（使用 `apiKeyHelper` 时）  |
| `CLAUDE_CODE_IDE_SKIP_AUTO_INSTALL`        | 跳过 IDE 扩展的自动安装        |
| `CLAUDE_CODE_MAX_OUTPUT_TOKENS`            | 为大多数请求设置最大输出令牌数   |
| `CLAUDE_CODE_SUBAGENT_MODEL`               | 参见[模型配置](/zh-CN/docs/claude-code/model-config)    |
| `DISABLE_TELEMETRY`                        | 设置为 `1` 以选择退出 Statsig 遥测（注意 Statsig 事件不包括用户数据，如代码、文件路径或 bash 命令） |
| `MAX_MCP_OUTPUT_TOKENS`                    | MCP 工具响应中允许的最大令牌数。当输出超过 10,000 个令牌时，Claude Code 显示警告（默认：25000）    |
| `MAX_THINKING_TOKENS`                      | 强制模型预算的思考             |
| `MCP_TIMEOUT`                              | MCP 服务器启动的超时（毫秒）    |
| `MCP_TOOL_TIMEOUT`                         | MCP 工具执行的超时（毫秒）      |
| `USE_BUILTIN_RIPGREP`                      | 设置为 `0` 以使用系统安装的 `rg` 而不是 Claude Code 包含的 `rg` |

### 子代理配置

Claude Code 支持可以在用户和项目级别配置的自定义 AI 子代理。这些子代理存储为带有 YAML 前言的 Markdown 文件：

* **用户子代理**：`~/.claude/agents/` - 在您的所有项目中可用
* **项目子代理**：`.claude/agents/` - 特定于您的项目，可以与您的团队共享

子代理文件定义具有自定义提示和工具权限的专门 AI 助手。在[子代理文档](/zh-CN/docs/claude-code/sub-agents)中了解更多关于创建和使用子代理的信息。

### 可用的工具

Claude Code 可以访问一组强大的工具，帮助它理解和修改您的代码库：

| 工具              | 描述                         | 需要权限 |
| :--------------- | :--------------------------- | :--- |
| **Bash**         | 在您的环境中执行 shell 命令     | 是    |
| **LS**           | 列出当前工作目录中的文件         | 否    |
| **Glob**         | 基于模式匹配查找文件            | 否    |
| **Grep**         | 在文件内容中搜索模式            | 否    |
| **Read**         | 读取文件内容                    | 否    |
| **Write**        | 创建或覆盖文件                  | 是    |
| **Edit**         | 对特定文件进行有针对性的编辑      | 是    |
| **MultiEdit**    | 在单个文件上原子性地执行多个编辑   | 是    |
| **NotebookEdit** | 修改 Jupyter notebook 单元格   | 是    |
| **NotebookRead** | 读取和显示 Jupyter notebook 内容 | 否    |
| **Task**         | 运行子代理来处理复杂的多步骤任务   | 否    |
| **TodoWrite**    | 创建和管理结构化任务列表          | 否    |
| **WebFetch**     | 从指定 URL 获取内容             | 是    |
| **WebSearch**    | 执行带有域过滤的网络搜索          | 是    |

- [Tools and system prompt of Claude Code](https://gist.github.com/wong2/e0f34aac66caf890a332f7b6f9e2ba8f)

## 访问控制和权限

支持细粒度权限，以便您能够精确指定代理被允许做什么（例如运行测试、运行linter）以及不被允许做什么（例如更新云基础设施）。这些权限设置可以检入版本控制并分发给您组织中的所有开发者，也可以由个别开发者自定义。

### 权限系统

Claude Code使用分层权限系统来平衡功能和安全性：

| 工具类型 | 示例 | 需要批准 | "是的，不要再问"行为 |
| :----- | :----------- | :--- | :------------ |
| 只读     | 文件读取、LS、Grep | 否    | 不适用           |
| Bash命令 | Shell执行      | 是    | 每个项目目录和命令永久生效 |
| 文件修改   | 编辑/写入文件      | 是    | 直到会话结束        |

### 配置权限

您可以使用`/permissions`查看和管理Claude Code的工具权限。此UI列出所有权限规则和它们来源的settings.json文件。

* **允许**规则将允许Claude Code使用指定工具而无需进一步的手动批准。
* **询问**规则将在Claude Code尝试使用指定工具时询问用户确认。询问规则优先于允许规则。
* **拒绝**规则将阻止Claude Code使用指定工具。拒绝规则优先于允许和询问规则。
* **附加目录**将Claude的文件访问扩展到初始工作目录之外的目录。
* **默认模式**控制Claude在遇到新请求时的权限行为。

权限规则使用格式：`工具`或`工具(可选说明符)`

仅为工具名称的规则匹配该工具的任何使用。例如，将`Bash`添加到允许规则列表中将允许Claude Code使用Bash工具而无需用户批准。

#### 权限模式

Claude Code支持几种权限模式，可以在[设置文件](/zh-CN/docs/claude-code/settings#settings-files)中设置为`defaultMode`：

| 模式                 | 描述 |
| :------------------ | :--- |
| `default`           | 标准行为 - 在首次使用每个工具时提示权限 |
| `acceptEdits`       | 自动接受会话的文件编辑权限 |
| `plan`              | 计划模式 - Claude可以分析但不能修改文件或执行命令 |
| `bypassPermissions` | 跳过所有权限提示（需要安全环境 - 请参阅下面的警告）|

#### 工作目录

默认情况下，Claude可以访问启动它的目录中的文件。您可以扩展此访问权限：

* **启动期间**：使用`--add-dir <path>` CLI参数
* **会话期间**：使用`/add-dir`斜杠命令
* **持久配置**：添加到[设置文件](/zh-CN/docs/claude-code/settings#settings-files)中的`additionalDirectories`

附加目录中的文件遵循与原始工作目录相同的权限规则 - 它们变得可读而无需提示，文件编辑权限遵循当前权限模式。

#### 工具特定权限规则

某些工具支持更细粒度的权限控制：

**Bash**

* `Bash(npm run build)` 匹配确切的Bash命令`npm run build`
* `Bash(npm run test:*)` 匹配以`npm run test`开头的Bash命令
* `Bash(curl http://site.com/:*)` 匹配以确切的`curl http://site.com/`开头的curl命令

> Claude Code了解shell操作符（如`&&`），因此像`Bash(safe-cmd:*)`这样的前缀匹配规则不会给它运行命令`safe-cmd && other-cmd`的权限

**Bash权限模式的重要限制**：

  1. 此工具使用**前缀匹配**，而不是正则表达式或glob模式
  2. 通配符`:*`只能在模式末尾使用以匹配任何延续
  3. 像`Bash(curl http://github.com/:*)`这样的模式可以通过多种方式绕过：
     * URL前的选项：`curl -X GET http://github.com/...`不会匹配
     * 不同协议：`curl https://github.com/...`不会匹配
     * 重定向：`curl -L http://bit.ly/xyz`（重定向到github）
     * 变量：`URL=http://github.com && curl $URL`不会匹配
     * 额外空格：`curl  http://github.com`不会匹配

  为了更可靠的URL过滤，请考虑：

  * 使用带有`WebFetch(domain:github.com)`权限的WebFetch工具
  * 通过CLAUDE.md指示Claude Code您允许的curl模式
  * 使用钩子进行自定义权限验证

**读取和编辑**

`Edit`规则适用于所有编辑文件的内置工具。Claude将尽力将`Read`规则应用于所有读取文件的内置工具，如`Grep`、`Glob`和`LS`。

读取和编辑规则都遵循[gitignore](https://git-scm.com/docs/gitignore)规范，具有四种不同的模式类型：

| 模式 | 含义 | 示例 | 匹配 |
| --- | --- | --- | --- |
| `//path` | 从文件系统根目录的**绝对**路径 | `Read(//Users/alice/secrets/**)` | `/Users/alice/secrets/**` |
| `~/path` | 从**主**目录的路径  | `Read(~/Documents/*.pdf)` | `/Users/alice/Documents/*.pdf` |
| `/path` | **相对于设置文件**的路径 | `Edit(/src/**/*.ts)` | `<设置文件路径>/src/**/*.ts` |
| `path`或`./path` | **相对于当前目录**的路径 | `Read(*.env)` | `<cwd>/*.env` |

> 像`/Users/alice/file`这样的模式不是绝对路径 - 它是相对于您的设置文件的！使用`//Users/alice/file`表示绝对路径。

* `Edit(/docs/**)` - 在`<项目>/docs/`中编辑（不是`/docs/`！）
* `Read(~/.zshrc)` - 读取您主目录的`.zshrc`
* `Edit(//tmp/scratch.txt)` - 编辑绝对路径`/tmp/scratch.txt`
* `Read(src/**)` - 从`<当前目录>/src/`读取

**WebFetch**

* `WebFetch(domain:example.com)` 匹配对`example.com`的获取请求

**MCP**

* `mcp__puppeteer` 匹配`puppeteer`服务器提供的任何工具（在Claude Code中配置的名称）
* `mcp__puppeteer__puppeteer_navigate` 匹配`puppeteer`服务器提供的`puppeteer_navigate`工具
* 与其他权限类型不同，MCP权限不支持通配符（`*`）。


## 斜杠命令

> 在交互式会话中使用斜杠命令控制 Claude 的行为。

### 内置斜杠命令

| 命令                       | 用途 |
| :------------------------ | :--- |
| `/add-dir`                | 添加额外的工作目录 |
| `/agents`                 | 管理用于专门任务的自定义 AI 子代理 |
| `/bug`                    | 报告错误（将对话发送给 Anthropic）|
| `/clear`                  | 清除对话历史              |
| `/compact [instructions]` | 压缩对话，可选择性地提供重点指令 |
| `/config`                 | 查看/修改配置             |
| `/cost`                   | 显示令牌使用统计 |
| `/doctor`                 | 检查您的 Claude Code 安装的健康状况 |
| `/help`                   | 获取使用帮助              |
| `/init`                   | 使用 CLAUDE.md 指南初始化项目|
| `/login`                  | 切换 Anthropic 账户     |
| `/logout`                 | 从您的 Anthropic 账户注销  |
| `/mcp`                    | 管理 MCP 服务器连接和 OAuth 身份验证 |
| `/memory`                 | 编辑 CLAUDE.md 内存文件   |
| `/model`                  | 选择或更改 AI 模型         |
| `/permissions`            | 查看或更新[权限](/zh-CN/docs/claude-code/iam#configuring-permissions)  |
| `/pr_comments`            | 查看拉取请求评论           |
| `/review`                 | 请求代码审查              |
| `/status`                 | 查看账户和系统状态          |
| `/terminal-setup`         | 安装 Shift+Enter 键绑定用于换行（仅限 iTerm2 和 VSCode）|
| `/vim`                    | 进入 vim 模式以在插入和命令模式之间切换 |

### 自定义斜杠命令

自定义斜杠命令允许您将经常使用的提示定义为 Markdown 文件，Claude Code 可以执行这些文件。命令按范围（项目特定或个人）组织，并通过目录结构支持命名空间。

#### 语法

```
/<command-name> [arguments]
```

**参数**

| 参数               | 描述 |
| :--------------- | :--- |
| `<command-name>` | 从 Markdown 文件名派生的名称（不包含 `.md` 扩展名） |
| `[arguments]`    | 传递给命令的可选参数                         |

#### 命令类型

##### 项目命令

存储在您的存储库中并与您的团队共享的命令。在 `/help` 中列出时，这些命令在其描述后显示"(project)"。

**位置**: `.claude/commands/`

在以下示例中，我们创建 `/optimize` 命令：

```bash
# 创建项目命令
mkdir -p .claude/commands
echo "分析此代码的性能问题并建议优化：" > .claude/commands/optimize.md
```

##### 个人命令

在您的所有项目中可用的命令。在 `/help` 中列出时，这些命令在其描述后显示"(user)"。

**位置**: `~/.claude/commands/`

在以下示例中，我们创建 `/security-review` 命令：

```bash
# 创建个人命令
mkdir -p ~/.claude/commands
echo "审查此代码的安全漏洞：" > ~/.claude/commands/security-review.md
```

#### 功能

##### 命名空间

在子目录中组织命令。子目录用于组织并出现在命令描述中，但它们不影响命令名称本身。描述将显示命令是来自项目目录（`.claude/commands`）还是用户级目录（`~/.claude/commands`），以及子目录名称。

不支持用户级和项目级命令之间的冲突。否则，具有相同基本文件名的多个命令可以共存。

例如，位于 `.claude/commands/frontend/component.md` 的文件创建命令 `/component`，描述显示"(project:frontend)"。
同时，位于 `~/.claude/commands/component.md` 的文件创建命令 `/component`，描述显示"(user)"。

##### 参数

使用参数占位符将动态值传递给命令：

###### 使用 `$ARGUMENTS` 的所有参数

`$ARGUMENTS` 占位符捕获传递给命令的所有参数：

```bash
# 命令定义
echo '按照我们的编码标准修复问题 #$ARGUMENTS' > .claude/commands/fix-issue.md

# 使用
> /fix-issue 123 high-priority
# $ARGUMENTS 变为："123 high-priority"
```

###### 使用 `$1`、`$2` 等的单个参数

使用位置参数单独访问特定参数（类似于 shell 脚本）：

```bash
# 命令定义  
echo '审查 PR #$1，优先级为 $2，分配给 $3' > .claude/commands/review-pr.md

# 使用
> /review-pr 456 high alice
# $1 变为 "456"，$2 变为 "high"，$3 变为 "alice"
```

在以下情况下使用位置参数：

* 需要在命令的不同部分单独访问参数
* 为缺失的参数提供默认值
* 构建具有特定参数角色的更结构化的命令

##### Bash 命令执行

使用 `!` 前缀在斜杠命令运行之前执行 bash 命令。输出包含在命令上下文中。您*必须*包含带有 `Bash` 工具的 `allowed-tools`，但您可以选择要允许的特定 bash 命令。

例如：

```markdown
---
allowed-tools: Bash(git add:*), Bash(git status:*), Bash(git commit:*)
description: 创建 git 提交
---

## 上下文

- 当前 git 状态：!`git status`
- 当前 git 差异（已暂存和未暂存的更改）：!`git diff HEAD`
- 当前分支：!`git branch --show-current`
- 最近的提交：!`git log --oneline -10`

## 您的任务

基于上述更改，创建单个 git 提交。
```

##### 文件引用

使用 `@` 前缀在命令中包含文件内容以[引用文件](/zh-CN/docs/claude-code/common-workflows#reference-files-and-directories)。

例如：

```markdown
# 引用特定文件

审查 @src/utils/helpers.js 中的实现

# 引用多个文件

比较 @src/old-version.js 与 @src/new-version.js
```

##### 思考模式

斜杠命令可以通过包含[扩展思考关键词](/zh-CN/docs/claude-code/common-workflows#use-extended-thinking)来触发扩展思考。

#### 前置元数据

命令文件支持前置元数据，对于指定命令的元数据很有用：

| 前置元数据           | 用途                     | 默认值      |
| :-------------- | :---------------------------------------------------------------------------------------- | :------- |
| `allowed-tools` | 命令可以使用的工具列表            | 从对话中继承   |
| `argument-hint` | 斜杠命令期望的参数。示例：`argument-hint: add [tagId] \| remove [tagId] \| list`。此提示在用户自动完成斜杠命令时显示给用户。 | 无        |
| `description`   | 命令的简要描述                | 使用提示的第一行 |
| `model`         | 特定的模型字符串（参见[模型概述](/zh-CN/docs/about-claude/models/overview)）                              | 从对话中继承   |

例如：

```markdown
---
allowed-tools: Bash(git add:*), Bash(git status:*), Bash(git commit:*)
argument-hint: [message]
description: 创建 git 提交
model: claude-3-5-haiku-20241022
---

使用消息创建 git 提交：$ARGUMENTS
```

使用位置参数的示例：

```markdown
---
argument-hint: [pr-number] [priority] [assignee]
description: 审查拉取请求
---

审查 PR #$1，优先级为 $2，分配给 $3。
专注于安全性、性能和代码风格。
```

### MCP 斜杠命令

MCP 服务器可以将提示公开为斜杠命令，这些命令在 Claude Code 中变为可用。这些命令从连接的 MCP 服务器动态发现。

#### 命令格式

MCP 命令遵循以下模式：

```
/mcp__<server-name>__<prompt-name> [arguments]
```

#### 功能

##### 动态发现

MCP 命令在以下情况下自动可用：

* MCP 服务器已连接并处于活动状态
* 服务器通过 MCP 协议公开提示
* 在连接期间成功检索提示

##### 参数

MCP 提示可以接受服务器定义的参数：

```
# 不带参数
> /mcp__github__list_prs

# 带参数
> /mcp__github__pr_review 456
> /mcp__jira__create_issue "Bug title" high
```

##### 命名约定

* 服务器和提示名称被规范化
* 空格和特殊字符变为下划线
* 名称小写以保持一致性

#### 管理 MCP 连接

使用 `/mcp` 命令来：

* 查看所有配置的 MCP 服务器
* 检查连接状态
* 使用启用 OAuth 的服务器进行身份验证
* 清除身份验证令牌
* 查看每个服务器的可用工具和提示

#### MCP 权限和通配符

在[为 MCP 工具配置权限](/zh-CN/docs/claude-code/iam#tool-specific-permission-rules)时，请注意**不支持通配符**：

* ✅ **正确**: `mcp__github`（批准来自 github 服务器的所有工具）
* ✅ **正确**: `mcp__github__get_issue`（批准特定工具）
* ❌ **错误**: `mcp__github__*`（不支持通配符）

要批准来自 MCP 服务器的所有工具，只需使用服务器名称：`mcp__servername`。要仅批准特定工具，请单独列出每个工具。


## 参考资料
- https://docs.anthropic.com/en/docs/claude-code/overview.md
- https://docs.anthropic.com/en/docs/claude-code/quickstart.md
- https://docs.anthropic.com/en/docs/claude-code/common-workflows.md
- https://docs.anthropic.com/en/docs/claude-code/sub-agents.md
- https://docs.anthropic.com/en/docs/claude-code/output-styles.md
- https://docs.anthropic.com/en/docs/claude-code/hooks-guide.md
- https://docs.anthropic.com/en/docs/claude-code/github-actions.md
- https://docs.anthropic.com/en/docs/claude-code/mcp.md
- https://docs.anthropic.com/en/docs/claude-code/troubleshooting.md
- https://docs.anthropic.com/en/docs/claude-code/sdk/sdk-overview.md
- https://docs.anthropic.com/en/docs/claude-code/sdk/sdk-headless.md
- https://docs.anthropic.com/en/docs/claude-code/sdk/sdk-python.md
- https://docs.anthropic.com/en/docs/claude-code/sdk/sdk-typescript.md
- https://docs.anthropic.com/en/docs/claude-code/third-party-integrations.md
- https://docs.anthropic.com/en/docs/claude-code/llm-gateway.md
- https://docs.anthropic.com/en/docs/claude-code/devcontainer.md
- https://docs.anthropic.com/en/docs/claude-code/setup.md
- https://docs.anthropic.com/en/docs/claude-code/iam.md
- https://docs.anthropic.com/en/docs/claude-code/security.md
- https://docs.anthropic.com/en/docs/claude-code/data-usage.md
- https://docs.anthropic.com/en/docs/claude-code/monitoring-usage.md
- https://docs.anthropic.com/en/docs/claude-code/costs.md
- https://docs.anthropic.com/en/docs/claude-code/analytics.md
- https://docs.anthropic.com/en/docs/claude-code/settings.md
- https://docs.anthropic.com/en/docs/claude-code/ide-integrations.md
- https://docs.anthropic.com/en/docs/claude-code/terminal-config.md
- https://docs.anthropic.com/en/docs/claude-code/model-config.md
- https://docs.anthropic.com/en/docs/claude-code/memory.md
- https://docs.anthropic.com/en/docs/claude-code/statusline.md
- https://docs.anthropic.com/en/docs/claude-code/cli-reference.md
- https://docs.anthropic.com/en/docs/claude-code/interactive-mode.md
- https://docs.anthropic.com/en/docs/claude-code/slash-commands.md
- https://docs.anthropic.com/en/docs/claude-code/hooks.md
