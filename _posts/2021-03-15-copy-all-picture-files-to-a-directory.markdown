---
layout: post
title:  "将所有的图片文件复制到一个目录"
date:   2021-03-15 00:00:00 +0800
categories: Linux Shell
tags: [Linux, Shell, find, if, for]
---

## 脚本
```shell
INPUT_DIR=''
OUTPUT_DIR=''

_prompt='██'

#find返回的文件列表在macOS系统上不能使用for循环进行迭代。
img_files=$(find $INPUT_DIR -type f \
  -iname '*.jpg' -o \
  -iname '*.jpeg' -o \
  -iname '*.png' -o \
  -iname '*.bmp' -o \
  -iname '*.tif')

for file in $img_files
do
  echo $_prompt $file
  cp $file $OUTPUT_DIR
done
```
