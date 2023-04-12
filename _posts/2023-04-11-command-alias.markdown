---
layout: post
title:  "命令 alias"
date:   2023-04-11 00:00:00 +0800
categories: alias
tags: [Command, Shell, zsh, Docker]
---

`zsh` 中使用单引号（`'`），不对特殊符号进行解释，使用双引号（`"`）会对特殊符号进行解释，如：`$` 
## docker rmi none
```shell
alias docker.rmi.none='docker rmi --force $(docker images -q --filter "dangling=true")'
```

## 在终端通过 Safari 打开网址
```shell
alias open.chatgpt='open -a Safari https://platform.openai.com/playground\?mode\=chat'
```
