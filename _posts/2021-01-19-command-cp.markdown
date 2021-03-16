---
layout: post
title:  "命令cp"
date:   2021-01-19 00:00:00 +0800
categories: Command
tags: [Linux, cp]
---

## 拷贝一批文本文件(10000)到目录
### cp
* time: 0.470s
* 当文件更新了或者缺少时才拷贝。(-u)
* 速度最快
```shell
cp -u labels/*/*.txt datasets/yolo/sign/labels/
```

### xargs
* time: 30.003s
```shell
ls labels/*/*.txt | xargs -I {} cp {} datasets/yolo/sign/labels/
```

### find -exec
* time: 32.521s
```shell
find labels/ -type f -iname '*.txt' -exec cp {} datasets/yolo/sign/labels/ \;
```

### for
* time: 41.259s
```shell
for i in `ls labels/*/*.txt`; do cp $i datasets/yolo/sign/labels/; done
```

## 参考资料
* [Cp Command in Linux (Copy Files)](https://linuxize.com/post/cp-command-in-linux/)
* [HowTo: Use bash For Loop In One Line](https://www.cyberciti.biz/faq/linux-unix-bash-for-loop-one-line-command/)
