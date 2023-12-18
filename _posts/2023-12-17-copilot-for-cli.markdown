---
layout: post
title:  "Copilot for CLI"
date:   2023-12-17 08:00:00 +0800
categories: Copilot
tags: [Copilot, GitHub, CLI, MacbookProM2MAX]
---

[Copilot for CLI](https://githubnext.com/projects/copilot-cli/)

## [GitHub CLI](https://cli.github.com/)

### 在 macOS 安装 [GitHub CLI](https://github.com/cli/cli#installation)
- 安装
```shell
brew install gh
```

- 升级
```shell
brew upgrade gh
```

- 登录
```shell
gh auth login
```

```shell
? What account do you want to log into? GitHub.com
? What is your preferred protocol for Git operations on this host? HTTPS
? Authenticate Git with your GitHub credentials? Yes
? How would you like to authenticate GitHub CLI? Login with a web browser

! First copy your one-time code: EA2E-F864
Press Enter to open github.com in your browser... 
✓ Authentication complete.
```

- 查看登录状态
```shell
gh auth status
```
```shell
github.com
  ✓ Logged in to github.com account wang-junjian (keyring)
  - Active account: true
  - Git operations protocol: https
  - Token: gho_************************************
  - Token scopes: 'gist', 'read:org', 'repo', 'workflow'
```

## [Copilot for CLI](https://githubnext.com/projects/copilot-cli/)

[使用 GitHub Copilot（CLI 版）](https://docs.github.com/zh/copilot/github-copilot-in-the-cli/using-github-copilot-in-the-cli)

- 安装
```shell
gh extension install github/gh-copilot
```

- 升级
```shell
gh extension upgrade gh-copilot
```

### gh copilot 帮助
```shell
gh copilot -h
Your AI command line copilot.

Usage:
  copilot [command]

Examples:

$ gh copilot suggest "Install git"
$ gh copilot explain "traceroute github.com"


Available Commands:
  config      Configure options
  explain     Explain a command
  suggest     Suggest a command

Flags:
  -h, --help      help for copilot
  -v, --version   version for copilot

Use "copilot [command] --help" for more information about a command.
```

### gh copilot explain

```shell
gh copilot explain
```
```
? Allow GitHub to collect optional usage data to help us improve? This data does not include your queries.
> Yes

Welcome to GitHub Copilot in the CLI!
version 0.5.3-beta (2023-11-09)

I'm powered by AI, so surprises and mistakes are possible. Make sure to verify any generated code or suggestions, and share feedback so that we can learn and improve.

? Which command would you like to explain? 
> find ~/.cache -name '*.gguf'

Explanation:
  • find is used to search for files and directories. 
    • ~/.cache specifies the starting directory for the search as the .cache folder in the user`s home directory. 
    • -name *.gguf`` specifies that we are searching for files with the extension .gguf.
```

```shell
gh copilot explain -t shell "find ~/.cache -name '*.gguf'"
```

### gh copilot suggest

```shell
gh copilot suggest -t shell "Install git"
```
```
Welcome to GitHub Copilot in the CLI!
version 0.5.3-beta (2023-11-09)

I'm powered by AI, so surprises and mistakes are possible. Make sure to verify any generated code or suggestions, and share feedback so that we can learn and improve.

Suggestion:
  sudo apt-get install git                      

? Select an option
> Copy command to clipboard

Command copied to clipboard!
```

### `??`, `git?`, `gh?`
在我的 Macbook Pro M2 MAX 上，`??`, `git?`, `gh?` 命令不可用，出现错误信息：`zsh: no matches found: ??`。

可以参考如下链接解决：
- [Inclusion of Helper Commands (??, git?, gh?) from Private Beta in New Copilot CLI Public Beta](https://github.com/github/gh-copilot/issues/5)

编辑 `~/.zshrc` 文件，添加如下内容：
```shell
# Check if the gh copilot extension is installed and load aliases accordingly
if gh extension list | grep -q 'github/gh-copilot'; then
  copilot_shell_suggest() {
    gh copilot suggest -t shell "$*"
  }
  alias '??'='copilot_shell_suggest'

  # Function to handle Git command suggestions
  copilot_git_suggest() {
    gh copilot suggest -t git "$*"
  }
  alias 'git?'='copilot_git_suggest'

  # Function to handle GitHub CLI command suggestions
  copilot_gh_suggest() {
    gh copilot suggest -t gh "$*"
  }
  alias 'gh?'='copilot_gh_suggest'
fi
```

加载配置文件 `~/.zshrc`
```shell
source ~/.zshrc
```

使用 `??`, `git?`, `gh?` 命令
```shell
?? "install git"
```
```
Welcome to GitHub Copilot in the CLI!
version 0.5.3-beta (2023-11-09)

I'm powered by AI, so surprises and mistakes are possible. Make sure to verify any generated code or suggestions, and share feedback so that we can learn and improve.

Suggestion:
  sudo apt-get install git
```

## 参考资料
- [使用 GitHub Copilot（CLI 版）](https://docs.github.com/zh/copilot/github-copilot-in-the-cli/using-github-copilot-in-the-cli)
- [GitHub CLI 命令行工具（gh)](https://zhuanlan.zhihu.com/p/601200139)
- [设置 Git](https://docs.github.com/zh/get-started/quickstart/set-up-git)
- [Git 文档](https://cg-td-course.readthedocs.io/zh-cn/latest/parts/Git.html)
- [什么是适用于 Visual Studio 的 GitHub Copilot 扩展？](https://learn.microsoft.com/zh-cn/visualstudio/ide/visual-studio-github-copilot-extension?view=vs-2022)
- [The tools you need to build what you want.](https://github.com/features/)
