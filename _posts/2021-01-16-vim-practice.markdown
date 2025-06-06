---
layout: single
title:  "vim实践"
date:   2021-01-16 00:00:00 +0800
categories: Linux 实践 快捷键
tags: [Linux, vim]
---

## 安装
### 版本
* vim
* vim-gtk (KDE)
* vim-gtk3 (GNOME)
* vim-tiny (最小功能)

### 查看安装的 vim 版本
```shell
apt list --installed | grep vim
yum list installed | grep vim
```

### 安装带图形界面的版本
macOS [MacVim](https://github.com/macvim-dev/macvim/releases)

Ubuntu
```shell
sudo apt install vim-gtk3
```

运行
```shell
vim -g
gvim
```

### 查看可用插件
* ```vim --version```
* 打开 vim，输入命令 ```:version```


## 四种模式
* 正常模式
* 插入模式
    * 进入方式
        * ```i``` 光标当前位置进入
        * ```Shift+i``` 光标所在行的开头位置进入
        * ```a``` 光标当前位置下一个字符进入
        * ```Shift+a``` 光标所在行的行尾位置进入
        * ```o``` 光标所在行下插入空行
        * ```Shift+o``` 光标所在行上插入空行
    * 退出
        * 按esc键
* 命令模式
    * 进入方式
        * ```:``` 设置命令
        * ```/``` 向下搜索
        * ```?``` 向上搜索
    * 退出
        * 按两次esc键
* 可视模式
    * 进入方式
        * ```v``` 字符
        * ```Shift+v``` 行
        * ```Ctrl+v``` 块
    * 操作
        * ```d``` 删除选择
        * ```y``` 复制
        * ```Shift+i``` [块插入](https://stackoverflow.com/questions/12399572/vim-how-to-insert-in-visual-block-mode) (输入插入字符后，按两次esc键。)
    * 退出
        * 按两次esc键

---


## 文件
* ```:q``` 没有修改直接退出
* ```:q!``` 放弃修改退出
* ```:w``` 保存
* ```:wq``` 保存退出
    * ```:wq filename``` 保存退出
* ```ZZ``` 保存退出

* ```:!command``` 运行shell命令
    * ```:!ls -l``` 查看当前目录列表
    * ```:!ifconfig``` 查看本地IP地址

### 多文件
* 浏览（explore）当前目录
    * ```:E```
    * ```:e .```
* 从当前文件返回目录
    * ```:e#```
    * ```Ctrl+^```
* ```:e filename``` 浏览文件filename
* ```:ls``` 列出当前打开过的文件，浏览过的文件都会放在缓存中。
* ```:bd``` 缓存（buffer）删除（delete），删除之前打开过的文件列表。
* ```:bn``` 打开缓存ID对应的文件。
    * ```:b1```
    * ```:b2```
* ```Ctrl+o``` 切换上一次打开的文件。

## 编辑
* ```u``` 撤消（Undo）
* ```Ctrl+r``` 恢复（Redo）

* 选择
    * ```v``` 进入字符可视
        * ```w``` 选择下一个单词
        * ```0``` 选择到行首
        * ```$``` 选择到行尾
    * ```c``` 剪切选择的字符
    * ```d``` 删除选择的字符
    * ```x``` 删除选择的字符
    * ```ggVG``` 选择所有的字符

* 复制
    * ```y``` 复制选择的字符
    * ```:%y``` 复制所有的字符
    * 当前行
        * ```dd``` 剪切当前行
            * ```3dd``` 剪切3行
        * ```y$``` 复制当前字符到行尾
        * ```:y``` 复制当前行
        * ```yy``` 复制当前行
            * ```3yy``` 复制3行
    * 剪切板（用于应用之间的交换）
        * ```:y+``` 复制光标所在行（也可以先使用块的方式进行选择再复制）
        * ```:%y+``` 复制所有数据

* ```p``` 粘贴

* 删除
    * ```x``` 删除当前字符
    * ```:1,$d``` 删除所有行（1第一行开始，$直到文件末尾，d删除）
    * ```dw``` 删除光标所在字符到单词的末尾
    * ```diw``` 删除光标所在的整个单词
    * ```d0``` 删除光标所在字符到行首
    * ```d$``` 删除光标所在字符到行尾
    * ```dG``` 删除光标所在行到文件末尾

## 导航
* 字符
    * ```h``` 光标左移
    * ```j``` 光标下移
    * ```k``` 光标上移
    * ```l``` 光标右移
* 单词
    * ```w``` 移至下一个单词的开头
    * ```b``` 向后移到上一个单词的开头
* 当前行
    * ```0``` 移至当前行的开头
    * ```^``` 移至当前行的开头
    * ```$``` 移至当前行的末尾
* 行
    * ```gg``` 移至文件的第一行
        * ```1G``` 移至文件的第一行
        * ```100G``` 移至文件的第100行
    * ```G``` 移至文件的最后一行
* 屏幕
    * ```Ctrl+f``` 向前（forward）翻一屏
    * ```Ctrl+b``` 向后（backward）翻一屏
    * ```H``` 移至屏幕的第一行
    * ```M``` 移至画面中间（middle）
    * ```L``` 移至屏幕的最后一行

## 搜索
* ```/word``` 向前（下）搜索
    * ```n``` 下一个（next）
    * ```Shift+n``` 上一个
* ```?word``` 向后（上）搜索
    * ```n``` 上一个
    * ```Shift+n``` 下一个

* ```:%s/search_word/replace_word/g``` 替换(全文)
    * ```:1,$s/search_word/replace_word/g``` 替换(全文)
    * ```:3,4s/search_word/replace_word/g``` 替换(3-4行)
* ```:%s/search_word//g``` 删除(全文)
    * ```:1,$s/search_word//g``` 删除(全文)
    * ```:3,4s/search_word//g``` 删除(3-4行)

## 设置
### 配置文件 
```
/etc/vimrc
~/.vimrc
```

### 显示 | 隐藏行号
```
:set nu
:set number

:set nonu
:set nonumber
```

### 会用空格替换 Tab
```
set ts=4
set expandtab
set autoindent
```

### 换行 | 不换行
```
:set wrap
:set nowrap
```

### 搜索高亮显示 | 不高亮显示
```
:set hlsearch
:set nohlsearch
```

### 搜索时忽略大小写敏感 | 大小写敏感 （默认：大小写敏感）
```
:set ic
:set ignorecase

:set noic
:set noignorecase
```

### 设置为二进制
```
:set binary
```

### 不可显示字符显示为 16 进制
```
--1234567890^M
```
**^M 是 CR（回车符）**

```
:set display=uhex
```

现在 ^M 显示为 <0d>
```
--1234567890<0d>
```

还原为原显示格式
```
:set display=
```

## 其它
### 二进制打开文件
```shell
vim -b file.txt
```

### 比较两个文件的内容
```shell
vim -d file1 file2
```

```shell
vimdiff file1 file2
```

### 转换为 16 进制编辑器
```
:%!xxd
```

还原为原显示
```
:%!xxd -r
```

命令解读 : enters command-line mode, % matches whole file as a range, ! filters that range through an external command, xxd is that external shell command

---

## 参考资料
* [20+ vi and vim editor tutorials](http://alvinalexander.com/linux/vi-vim-editor-tutorials-collection/)
* [VIM and Python – A Match Made in Heaven](https://realpython.com/vim-and-python-a-match-made-in-heaven/)
* [Vim: How to insert in visual block mode?](https://stackoverflow.com/questions/12399572/vim-how-to-insert-in-visual-block-mode)
* [Deleting Words in Vim](https://til.hashrocket.com/posts/fbfwnjxgtd-deleting-words-in-vim)
* [How to select/delete until end of file in vim/gvim?](https://unix.stackexchange.com/questions/13904/how-to-select-delete-until-end-of-file-in-vim-gvim)
* [How to switch to the directory listing from file view in vim?](https://unix.stackexchange.com/questions/52179/how-to-switch-to-the-directory-listing-from-file-view-in-vim/52189)
* [Linux vi/vim多标签和多窗口, Tab页浏览目录, 多Tab页编辑](https://justcode.ikeepstudying.com/2018/03/linux-vi-vim多标签和多窗口-tab页浏览目录-多tab页编辑/)
* [Opening and Switching Between Multiple Files and Windows in VI](https://linuxhint.com/opening_switching_multiple_files_vim/)
* [How to Vim Save/Vim Exit/Quit in Editor?](https://monovm.com/blog/how-to-save-and-exit-in-vim-editor/)
* [How To “Select All” In Vim/Vi?](https://linuxtect.com/how-to-select-all-in-vim-vi/)
* [How to copy all the text from vim editor using vim command line?](https://stackoverflow.com/questions/30838436/how-to-copy-all-the-text-from-vim-editor-using-vim-command-line)
* [vim回车和换行](https://www.jianshu.com/p/00476400ef20)
* [Use vim to search by hex code](https://stackoverflow.com/questions/2266383/use-vim-to-search-by-hex-code)
* [How can I use Vim as a hex editor? ](https://vi.stackexchange.com/questions/2232/how-can-i-use-vim-as-a-hex-editor)
* [Basic Vim Commands Every Linux User Must Know](https://linuxhandbook.com/basic-vim-commands/)
