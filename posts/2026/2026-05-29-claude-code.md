---
type: article
title:  "Claude Code 安装、更新与卸载指南"
date:   2026-05-29 18:00:00 +0800
tags: [Claude Code, Install, cURL, Homebrew, NPM]
---

## 安装 Claude Code

### 1. Native 安装（推荐）

⚠️ *国内用户会出现不能访问或卡住的问题。*

```bash
curl -fsSL https://claude.ai/install.sh | bash
```

安装后的可执行文件路径：`/Users/junjian/.local/bin/claude`

**下面是安装卡住，但是程序已经下载成功，我手动安装完成的过程**：

下载的二进制文件会被保存在 `~/.claude/downloads` 目录下：

```bash
ll ~/.claude/downloads
```

```bash
-rwxr-xr-x  1 junjian  staff   205M  5月 29 22:56 claude-2.1.156-darwin-arm64
```

我们需要把它移动到 `~/.local/share/claude/versions` 目录下，并创建一个软链接到 `~/.local/bin`：

```bash
mkdir -p /Users/junjian/.local/share/claude/versions

cp ~/.claude/downloads/claude-2.1.156-darwin-arm64 /Users/junjian/.local/share/claude/versions/2.1.156
chmod +x /Users/junjian/.local/share/claude/versions/2.1.156

ln -s /Users/junjian/.local/share/claude/versions/2.1.156 /Users/junjian/.local/bin/claude
```

### 2. Homebrew 安装

⚠️ *版本可能不是最新的。*

```bash
brew update
brew install --cask claude-code
```

安装后的可执行文件路径：`/opt/homebrew/bin/claude`

### 3. NPM 安装

❌ *官方已停止使用 NPM 方式。*

```bash
npm install -g @anthropic-ai/claude-code
```

安装后的可执行文件路径：`/Users/junjian/.nvm/versions/node/v22.17.0/bin/claude`


## 更新 Claude Code

### 方法一（Native）

```bash
claude update
```

### 方法二（Homebrew）

```bash
brew upgrade --cask claude-code
```

### 方法三（NPM）

```bash
npm update -g @anthropic-ai/claude-code
```


## 删除 Claude Code

### 方法一（Native）

```bash
# 删除软链接
rm -rf /Users/junjian/.local/bin/claude

# 删除实际的程序本体及所有历史版本目录
rm -rf /Users/junjian/.local/share/claude
```

### 方法二（Homebrew）

```bash
brew uninstall --cask claude-code
```

### 方法三（NPM）

```bash
npm uninstall -g @anthropic-ai/claude-code
```
