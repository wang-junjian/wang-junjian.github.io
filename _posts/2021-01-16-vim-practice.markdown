---
layout: post
title:  "vim实践"
date:   2021-01-16 00:00:00 +0800
categories: Linux 实践
tags: [Linux, vim]
---

## 文件
* ```:q``` 没有修改直接退出
* ```:q!``` 放弃修改退出
* ```:wq``` 保存退出
    * ```:wq filename``` 保存退出
* ```ZZ``` 保存退出


## 编辑
* ```u``` 撤消（Undo）
* ```Ctrl+r``` 恢复（Redo）
---
* ```dd``` 剪切当前行
    * ```3dd``` 剪切3行
* ```yy``` 复制当前行
    * ```3yy``` 复制3行
* ```p``` 粘贴
---
* ```x``` 删除当前字符
* ```:1,$d``` 删除所有行（1第一行开始，$直到文件末尾，d删除）


## 导航
* ```0``` 移至当前行的开头
* ```$``` 移至当前行的末尾
---
* ```w``` 移至下一个单词的开头
* ```b``` 向后移到上一个单词的开头
---
* ```Ctrl+f``` 向前（forward）翻一屏
* ```Ctrl+b``` 向后（backward）翻一屏
---
* ```1G``` 移至文件的第一行
    * ```100G``` 移至文件的第100行
* ```G``` 移至文件的最后一行
---
* ```H``` 移至屏幕的第一行
* ```M``` 移至画面中间（middle）
* ```L``` 移至屏幕的最后一行


## 搜索
* ```/word``` 向前（下）搜索
* ```?word``` 向后（上）搜索
* ```n``` 下一个（next）
* ```:1,$s/search_word/replace_word/g``` 替换
* ```:1,$s/search_word//g``` 删除


## 设置
### 显示 | 隐藏行号
```
:set number
:set nonumber
```

### 换行 | 不换行
```
:set wrap
:set nowrap
```

### 搜索时忽略大小写敏感 | 大小写敏感
```
:set ignorecase
:set noignorecase
```


## 参考资料
* [20+ vi and vim editor tutorials](http://alvinalexander.com/linux/vi-vim-editor-tutorials-collection/)
