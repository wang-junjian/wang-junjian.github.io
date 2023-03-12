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

| 文件         |      | 导航 |     |
| ---------   | --- | ---- | --- |
| :e {file}   | 编辑另一个文件 | h（←） j（↓） k（↑） l（→）                              | 字符    |
| :w          | 写入文件      | w（下一个） b（上一个）                                   | 单词    |
| :wq / ⇧ZZ   | 写入且退出    | 0｜^（行首） $（行尾）                                    | 当前行  |
| :q! / ⇧ZQ   | 不保存退出    | {（上一个） }（下一个）                                    | 段落   |
|             |             | gg（begin of buffer） G（end of buffer） nG（移动到 n 行） | Buffer |
| **插入模式** | | | |
| i           | 在光标前插入文本 | I | 从行首插入文本 |
| a           | 在光标后追加文本 | A | 在行尾追加文本 |
| o           | 在光标下方的新行中插入文本 | O | 在光标上方的新行中插入文本 |
| **编辑**     | | | |
| u           | 撤消                              | Ctrl + r       | 恢复                             |
| yy / [n]yy  | 复制当前行                         | | |
| y0          | 复制光标到行首                      | y$             | 复制光标到行尾                     |
| :y+         | 复制当前行到剪切板                  | :%y+           | 复制所有数据到剪切板                |
| p           | 粘贴到光标所在行的下一行             | P              | 粘贴到光标所在行的上一行             |
| "+p         | 粘贴(来源自剪切板)到光标所在行的下一行 | "+P            | 粘贴(来源自剪切板)到光标所在行的上一行 |
| dd / [n]dd  | 删除当前行                         | | |
| d0          | 删除光标到行首                     | D / d$         | 删除光标到行尾                     |
| dgg         | 删除当前行到文件头                  | dG             | 删除当前行到文件尾                  |

* [Vim](https://www.vim.org)
* [Vim 实践]({% post_url 2021-01-16-vim-practice %})
* [Vim Keyboard Shortcuts](https://scaron.info/blog/vim-keyboard-shortcuts.html)
