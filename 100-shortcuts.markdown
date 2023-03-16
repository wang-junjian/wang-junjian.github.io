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

| **文件**     | | | |
| ---------   | --- | ---- | --- |
| :e {file}   | 编辑另一个文件     | :w          | 写入文件  |
| :wq / ZZ    | 写入且退出        | :q! / ZQ   | 不保存退出 |
| **导航**     | | | |
| h（←） j（↓） k（↑） l（→） | 字符    | | |
| w           | 下一个单词        | b           | 上一个单词 |
| 0｜^        | 当前行首          | $           | 当前行尾 |
| {           | 上一个段落        | }           | 下一个段落 |
| gg / [[     | 文件首           | G / ]]      | 文件尾 |
| [n]G        | 移动到 n 行      | | |
| **插入模式** | | | |
| i           | 在光标前插入文本 | I | 从行首插入文本 |
| a           | 在光标后追加文本 | A | 在行尾追加文本 |
| o           | 在光标下方的新行中插入文本 | O | 在光标上方的新行中插入文本 |
| **编辑**     | | | |
| u           | 撤消                              | Ctrl + r       | 恢复 |
| _复制_ | | | |
| yw          | 复制单词                           | | |
| yy          | 复制当前行                         | [n]yy          | 从当前行复制 n 行 |
| y0          | 复制光标到行首                      | y$             | 复制光标到行尾 |
| ygg         | 复制光标到文件首                    | yG             | 复制光标到文件尾 |
| :y+         | 复制当前行到剪切板                  | :%y+           | 复制所有数据到剪切板 |
| _粘贴_ | | | |
| p           | 粘贴到光标所在行的下一行             | P              | 粘贴到光标所在行的上一行 |
| "+p         | 粘贴(来源自剪切板)到光标所在行的下一行 | "+P            | 粘贴(来源自剪切板)到光标所在行的上一行 |
| _删除_ | | | |
| x           | 删除当前光标的字符                  | X              | 删除当前光标前的字符 |
| dw          | 删除单词                           | | |
| dd          | 删除当前行                         | [n]dd          | 从当前行删除 n 行 |
| d0          | 删除光标到行首                     | D / d$         | 删除光标到行尾 |
| dgg         | 删除当前行到文件首                  | dG             | 删除当前行到文件尾 |
| _查找_ | | | |
| /search_term                   | 搜索循环匹配 | /search_term\c | 搜索循环匹配（大小写不敏感） |
| :%s/search_term/replace_term/g | 搜索替换全文 | | |

* [Vim](https://www.vim.org)
* [VIM REFERENCE MANUAL](https://vimhelp.org/quickref.txt.html)
* [Vim 实践]({% post_url 2021-01-16-vim-practice %})
* [Vim Keyboard Shortcuts](https://scaron.info/blog/vim-keyboard-shortcuts.html)
