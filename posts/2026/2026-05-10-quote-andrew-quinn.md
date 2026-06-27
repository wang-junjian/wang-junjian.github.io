---
type: quote
author: Andrew Quinn
title: 发表于《Replacing a 3 GB SQLite database with a 10 MB FST binary》脚注
linkUrl: https://til.andrew-quinn.me/posts/replacing-a-3-gb-sqlite-database-with-a-10-mb-fst-finite-state-transducer-binary/
date: 2026-05-10 12:00:00 +0800
tags: [sqlite, careers, andrew-quinn, fst, programming, learning, wheel]
---

可以说，在我人生的前四分之一个世纪里，尽管我对编程一直充满痴迷，却始终无法摆脱一种内疚感——我总是在怀疑，自己手头正在构建的工具，是不是早在 30 年或 40 年前就已经被别人用更好、更完美的方式实现了。比如，我可能会自己写一个支持 TSV（标签分隔值）的查找与替换程序，但随后却发现早就有了一个叫 `awk` 的工具，能一举解决这一整类问题。

而我核心的论点在于：**这其实是一个陷阱**。

你**必须**去重新发明几个轮子，才能触及人类对“**造轮子**”这件事的认知边界。不是发明一千个轮子，也不是一个都不发明。在大多数领域，重新发明四五个轮子就足够了；而在**数学**或**计算机科学**这种在认识论上极度严密且成熟的领域，这个数字可能更接近`二十`或`三十`个。**你所重新发明的每一个轮子，以及一路上提出的每一个针对性问题，都会把你推向真正的技术前沿——其速度之快，是把同样的时间花在盲目死板的学习上，甚至是花上其五倍的时间，都无法比拟的。**
来源: [Simon Willison 的网络日志](https://simonwillison.net/2026/May/10/andrew-quinn/)
