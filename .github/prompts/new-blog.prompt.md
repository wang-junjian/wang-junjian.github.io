---
mode: 'agent'
tools: []
description: '创建日志'
---
# 生成新日志文件名
获取当前时间并将其格式化为 "YYYY-MM-DD" 的字符串。
如果用户输入为空，则默认值为 "New-Blog"。
将用户输入翻译为英文，每个单词第一个字母大写，使用 "-" 连接翻译后的单词。
把当前文件的名称改为 {"YYYY-MM-DD-用户输入翻译后的单词连接成的字符串"}，文件扩展名为`.md`。
请注意，文件名不能包含特殊字符或空格。

# 创建新日志文件
在 "_posts" 目录下创建一个新的 Markdown 文件，文件名为上一步生成的文件名。

# 把下面的模板内容复制到新文件中，{{TITLE}} 替换为用户输入的标题，{{CURRENT_DATE}} 替换为当前时间，时间格式为 "YYYY-MM-DD"。
```md
---
layout: single
title:  "{{TITLE}}"
date:   {{CURRENT_DATE}} 08:00:00 +0800
categories: 
tags: []
---


<!--more-->


## 参考资料
- []()
- []()

```