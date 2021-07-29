---
layout: post
title:  "命令sed"
date:   2020-12-22 00:00:00 +0800
categories: Command
tags: [Linux, sed, exec]
---

## sed
### 字符串
#### 分隔符号可以自由更换
```shell
$ echo "Hi, John." | sed 's/Hi/HI/g'
HI, John.
$ echo "Hi, John." | sed 's#Hi#HI#g'
HI, John.
$ echo "Hi, John." | sed 's-Hi-HI-g'
HI, John.
```

#### 单引号'
```shell
$ echo "'s', 'm', 'l', 'x'" | sed 's/'"'"'s'"'"', '"'"'m'"'"', '"'"'l'"'"', '"'"'x'"'"'/'"'"'s'"'"', '"'"'l'"'"'/g'
's', 'l'
```

#### 使用转义符\ ([])
```shell
$ echo "['hello', 'world']" | sed 's/\[/</g'
<'hello', 'world']
```

### 文件
#### 读取文件的内容，替换后输出。
```shell
$ cat /etc/system-release
CentOS Linux release 8.1.1911 (Core) 

$ sed 's, release .*$,,g' /etc/system-release
CentOS Linux
```
> 这个示例来源于 CentOS8 的配置文件 /etc/default/grub

#### 编辑或更新文件内容 (-i)
```shell
sed -i 's/\['"'"'s'"'"', '"'"'m'"'"', '"'"'l'"'"', '"'"'x'"'"'\]/\['"'"'s'"'"', '"'"'l'"'"'\]/g' yolov5/weights/download_weights.sh
```

#### 多个文件 (-exec {}) ^指定行的开始位置
```shell
find labels/ -name '*.txt' -exec sed -i 's/^1 /0 /g' {} +
```

#### 同时匹配(OR |)
```shell
find labels/ -name '*.txt' -exec sed -i -E 's/^1|2 /0 /g' {} +
```

## 参考资料
* [sed, a stream editor](https://www.gnu.org/software/sed/manual/sed.html)
* [How do I escape double and single quotes in sed?](https://stackoverflow.com/questions/7517632/how-do-i-escape-double-and-single-quotes-in-sed)
* [sed Case Insensitive Search Matching and Replacement](https://www.cyberciti.biz/faq/unixlinux-sed-case-insensitive-search-replace-matching/)
* [find & sed (search and replace)](https://unix.stackexchange.com/questions/36795/find-sed-search-and-replace)
* [Regex alternation/or operator (foo bar) in GNU or BSD Sed](https://unix.stackexchange.com/questions/145402/regex-alternation-or-operator-foobar-in-gnu-or-bsd-sed)
