---
layout: post
title:  "命令sed"
date:   2020-12-22 00:00:00 +0800
categories: Linux
tags: [Linux, Command, sed]
---

## sed
* 分隔符号可以自由更换
```shell
$ echo "Hi, John." | sed 's/Hi/HI/g'
HI, John.
$ echo "Hi, John." | sed 's#Hi#HI#g'
HI, John.
$ echo "Hi, John." | sed 's-Hi-HI-g'
HI, John.
```

* 单引号'
```shell
$ echo "'s', 'm', 'l', 'x'" | sed 's/'"'"'s'"'"', '"'"'m'"'"', '"'"'l'"'"', '"'"'x'"'"'/'"'"'s'"'"', '"'"'l'"'"'/g'
's', 'l'
```

* 使用转义符\ ([])
```shell
$ echo "['hello', 'world']" | sed 's/\[/</g'
<'hello', 'world']
```

* 编辑或更新文件内容 (-i)
```shell
sed -i 's/\['"'"'s'"'"', '"'"'m'"'"', '"'"'l'"'"', '"'"'x'"'"'\]/\['"'"'s'"'"', '"'"'l'"'"'\]/g' yolov5/weights/download_weights.sh
```

## 参考资料
* [sed, a stream editor](https://www.gnu.org/software/sed/manual/sed.html)
* [How do I escape double and single quotes in sed?](https://stackoverflow.com/questions/7517632/how-do-i-escape-double-and-single-quotes-in-sed)
* [sed Case Insensitive Search Matching and Replacement](https://www.cyberciti.biz/faq/unixlinux-sed-case-insensitive-search-replace-matching/)
