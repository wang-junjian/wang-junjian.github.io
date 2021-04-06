---
layout: post
title:  "命令tar"
date:   2021-01-20 00:00:00 +0800
categories: Command
tags: [Linux, tar]
---

## 打包
### 不压缩
```shell
tar -cvf filename.tar filename
```

### 压缩
```shell
tar -zcvf filename.tar filename
```

## 解包
### 不压缩
```shell
tar -xvf filename.tar
```

### 压缩
```shell
tar -zxvf filename.tar
```

### 解包到指定目录(目录需要是存在的)
```shell
tar -xf filename.tar -C dir
```

## 查看包里的文件
```shell
tar -tf filename.tar
```

## 参考资料
* [How to extract files to another directory using 'tar' command?](https://askubuntu.com/questions/45349/how-to-extract-files-to-another-directory-using-tar-command)
