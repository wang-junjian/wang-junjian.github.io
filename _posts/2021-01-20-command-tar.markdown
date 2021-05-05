---
layout: post
title:  "命令tar"
date:   2021-01-20 00:00:00 +0800
categories: Command
tags: [Linux, tar]
---

```
    -c, --create Create a new archive.  Arguments supply the names of the files to be archived.
    -x, --extract, --get Extract files from an archive.
    -z, --gzip, --gunzip, --ungzip Filter the archive through gzip(1).
    -j, --bzip2 Filter the archive through bzip2(1).
    -f, --file=ARCHIVE Use archive file or device ARCHIVE.  If this option is not given, tar will first examine the environment variable `TAPE'.  If it is set, its value will be used as the archive  name.   Otherwise, tar will assume the compiled-in default.
    -t, --list List the contents of an archive.
    -v, --verbose Verbosely list files processed.
```

## 打包
### 不压缩
```shell
tar cvf filename.tar filename
```

### 压缩
* gzip (*.tgz *.tar.gz)
```shell
tar czvf filename.tgz filename
```

* bzip2 (*.tbz2 *.tar.bz2)
```shell
tar cjvf filename.tbz2 filename
```

## 解包
### 不压缩
```shell
tar xvf filename.tar
```

### 压缩
* gzip (*.tgz *.tar.gz)
```shell
tar xzvf filename.tgz
```

* bzip2 (*.tbz2 *.tar.bz2)
```shell
tar xjvf filename.tbz2
```

### 解包到指定目录
* 方法一（目录需要是存在的）
```shell
tar xf filename.tar -C dir
```

* 方法二
```shell
tar xf filename.tar --one-top-level=dir
```

## 查看包里的文件
```shell
tar tf filename.tar
```

## 参考资料
* [How to extract files to another directory using 'tar' command?](https://askubuntu.com/questions/45349/how-to-extract-files-to-another-directory-using-tar-command)
