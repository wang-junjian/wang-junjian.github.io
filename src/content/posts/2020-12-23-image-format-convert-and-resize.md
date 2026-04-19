---
layout: single
title:  "图像格式转换、尺寸调整"
date:   2020-12-23 00:00:00 +0800
categories: ImageMagick
tags: [Linux, Command, Image, file, find, convert, ShellScript, for]
---

## 查看图像信息
```shell
$ file test.jpg
test.jpg: JPEG image data, JFIF standard 1.02, resolution (DPI), density 96x96, segment length 16, Exif Standard: [TIFF image data, big-endian, direntries=7, orientation=upper-left, xresolution=98, yresolution=106, resolutionunit=2, software=Adobe Photoshop CS Windows, datetime=2013:03:18 11:45:34], baseline, precision 8, 750x499, frames 3
```

## [ImageMagick](https://imagemagick.org/index.php)
> ImageMagick是一个用于查看、编辑位图文件以及进行图像格式转换的开放源代码软件套装。它可以读取、编辑超过100种图像格式。

### 安装
* Ubuntu
```shell
sudo apt-get install imagemagick
```

* macOS
```shell
brew install imagemagick
```

### 格式转换
```shell
convert test.jpg test.png
```

### 灰度
```shell
convert -colorspace gray input_file output_file
```

### 反转
```shell
convert -negate input_file output_file
```

### 尺寸调整
* 按照指定宽等比调整
```shell
convert test.jpg -resize 640 test.jpg
```

* 按照指定高等比调整
```shell
convert test.jpg -resize x640 test.jpg
```

* 按照指定宽高等比调整
```shell
convert test.jpg -resize 640x640 test.jpg
```

* 按照指定宽高调整
```shell
convert test.jpg -resize 640x640! test.jpg
```

### 批量处理
* 方法1
```shell
for file in *.jpg; do convert $file -resize 640x640 resize-$file; done
```

* 方法2
```shell
find . -name '*.png' -exec convert {} -resize 640x640 {} \;
```

### 转换所有的 png 图像到 jpg 格式，保存到 new_dir。
```shell
mogrify -path new_dir -format jpg images/*.png
```

### 所有图像缩放 50% 的尺寸。
```shell
mogrify -resize 50% images/*.jpg
```

## 参考资料
* [How to Quickly Resize, Convert & Modify Images from the Linux Terminal](https://www.howtogeek.com/109369/how-to-quickly-resize-convert-modify-images-from-the-linux-terminal/)
* [How to convert jpg files into png files with linux command? + Difficulty = Subfolders](https://stackoverflow.com/questions/20975025/how-to-convert-jpg-files-into-png-files-with-linux-command-difficulty-subfo)
* [Unix shell script find out which directory the script file resides?](https://stackoverflow.com/questions/242538/unix-shell-script-find-out-which-directory-the-script-file-resides)
* [Invert colors with ImageMagick](https://superuser.com/questions/1194468/invert-colors-with-imagemagick)
