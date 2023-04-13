---
layout: post
title:  "GitHub Copilot - Your AI pair programmer"
date:   2023-04-01 08:00:00 +0800
categories: Copilot
tags: [GitHub, vscode, Neovim]
---

## 注册

打开 [GitHub Copilot - Your AI pair programmer](https://github.com/features/copilot)，可以选择 **Copilot for Individuals（Copilot个人版）** 进行免费 2 个月的试用，每年 $100 ，可以使用 PayPal 进行支付。

* [Getting started with GitHub Copilot](https://docs.github.com/zh/copilot/getting-started-with-github-copilot)

## IDE 集成
### [VS Code](https://docs.github.com/zh/copilot/getting-started-with-github-copilot?tool=vscode)
#### [GitHub Copilot 扩展](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot)
#### [GitHub Copilot Labs 扩展](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot-labs)
* [GitHub Copilot Labs](https://githubnext.com/projects/copilot-labs/) 可以对代码进行解释，翻译到不同的编程语言。

### [Neovim](https://docs.github.com/zh/copilot/getting-started-with-github-copilot?tool=neovim)
#### 安装 Neovim
```shell
brew install neovim
brew install node
```

#### 安装 GitHub Copilot 扩展
* 使用 Neovim 的内置插件管理器安装 GitHub Copilot。
```shell
git clone https://github.com/github/copilot.vim \
   ~/.config/nvim/pack/github/start/copilot.vim
```

* 若要配置 GitHub Copilot，请打开 Neovim 并输入以下命令。
```
:Copilot setup
```

* 在 Neovim 配置中或使用 Neovim 命令启用 GitHub Copilot。
```
:Copilot enable
```

* [Neovim](https://github.com/neovim/neovim)
* [Node.js](https://nodejs.org/en)
* [macOS install Node.js](https://nodejs.org/en/download/package-manager#macos)

## 参考资料
* [Amazon CodeWhisperer](https://aws.amazon.com/cn/codewhisperer/)
