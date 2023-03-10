---
layout: page
title: 快捷键
permalink: /shortcuts/
---

| 类别      | 列表 |
| ------   | ---- |
| 操作系统  | [macOS](#macos) |
| Terminal | [Terminal](#terminal) [Tmux&Screen](#tmux--screen) |
| IDE      | [VSCode](#vscode) [Vim](#vim) |


## Mac 键盘修饰键

| Command（或 Cmd）⌘ | Shift ⇧ | Option（或 Alt）⌥ | Control（或 Ctrl）⌃ | Caps Lock ⇪ | Fn 🌐 |


## macOS

| 快捷键 | 功能 |
| ----- | --- |
| Control + Shift + Command + 3 | 拍摄整个屏幕到剪切板。 |
| Control + Shift + Command + 4 | 拍摄截屏到剪切板。 |
| Shift + Command + 3           | 拍摄整个屏幕到文件。 |
| Shift + Command + 4           | 拍摄截屏到文件。 |
| Shift + Command + 5           | 拍摄截屏或录制屏幕。 |
| Command + H                   | 隐藏最前面的 App 的窗口。 |
| Option + Command + H          | 查看最前面的 App 但隐藏所有其他 App。 |
| Control + Command + F         | 当前窗口全屏。 |
| Command + ,                   | 打开最前面的 App 的偏好设置。 |
| Shift + Command + N           | 在“访达”中创建一个新文件夹。 |
| Option + Command + V          | 将剪贴板中的文件从原始位置移动到当前位置。 |
| Control + Command + Q         | 立即锁定屏幕。 |

* [Mac 键盘快捷键](https://support.apple.com/zh-cn/HT201236)
* [在 Mac 上拍摄截屏](https://support.apple.com/zh-cn/HT201361)
* [macOS实践]({% post_url 2018-07-03-macos-practice %})


## Terminal

| 快捷键 | 功能 |
| ----- | --- |
| Ctrl + A | 将光标移动到行首。 |
| Ctrl + E | 将光标移动到行尾。 |
| Ctrl + W | 删除光标前面的单词。 |
| Ctrl + U | 删除当前行的所有内容。 |
| Ctrl + L | 清空终端屏幕。 |
| Ctrl + D | 退出当前 shell。 |
| Ctrl + Z | 将当前进程挂起，并放入后台运行。 使用 fg 命令可以把挂起的进程带到前台。 |


## Tmux & Screen

| Tmux  | Screen | 功能 |
| ----- | ------ | --- |
| tmux new -s ```session-name```          | screen -S ```session-name``` | 新建一个指定名称的会话 |
| tmux ls                                 | screen -ls                   | 查看所有的 Tmux 会话 |
| tmux attach -t ```session-name```       | screen -r ```session-name``` | 重新接入某个会话 |
| tmux kill-session -t ```session-name``` |                              | 杀死某个会话 |     
| Ctrl + B, D                             | Ctrl + A, D                  | 分离当前会话 |
| Ctrl + D                                | Ctrl + D                     | 退出当前会话 |

* [tmux](https://github.com/tmux/tmux)
* [tmux - Getting Started](https://github.com/tmux/tmux/wiki/Getting-Started)
* [Tmux 使用教程](https://www.ruanyifeng.com/blog/2019/10/tmux.html)


## VSCode

| 快捷键 | 功能 |
| ----- | --- |
| Shift + Command + P | 命令面板 |

* [Visual Studio Code Tips and Tricks](https://code.visualstudio.com/docs/getstarted/tips-and-tricks)


## Vim

| 快捷键 | 功能 |
| ----- | --- |
|  |  |

* [Vim](https://www.vim.org)
* [Vim 实践]({% post_url 2021-01-16-vim-practice %})
