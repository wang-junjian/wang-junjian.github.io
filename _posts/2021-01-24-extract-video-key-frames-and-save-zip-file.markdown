---
layout: post
title:  "抽取视频关键帧保存zip文件"
date:   2021-01-24 00:00:00 +0800
categories: Linux Shell
tags: [Linux, Shell, ffmpeg, find, basename, dirname, zip, sed, mkdir, if]
---

> 抽取视频的关键帧，保存为zip文件。

## 目录结构
```
.
├── keyframes
│   ├── race
│   │   ├── race-0001.jpg
│   │   ├── race-0002.jpg
│   │   └── race-0096.jpg
│   └── race.zip
└── videos
    └── race.mp4
```

## 自动化脚本
```shell
_prompt='██'
#find返回的文件列表在macOS系统上不能使用for循环进行迭代。
video_files=$(find videos -type f \
  -iname '*.mov' -o \
  -iname '*.mts' -o \
  -iname '*.mp4' -o \
  -iname '*.mkv' -o \
  -iname '*.webm' -o \
  -iname '*.flv' -o \
  -iname '*.f4v' -o \
  -iname '*.vob' -o \
  -iname '*.ogg' -o \
  -iname '*.ogv' -o \
  -iname '*.avi' -o \
  -iname '*.wmv' -o \
  -iname '*.rm' -o \
  -iname '*.rmvb' -o \
  -iname '*.asf' -o \
  -iname '*.amv' -o \
  -iname '*.m4v' -o \
  -iname '*.3gp' -o \
  -iname '*.mng')

for file in $video_files
do
  echo "$_prompt Video file $file." 

  fname=`basename $file`
  filename=${fname%%.*}
  extname=${fname##*.}
  echo $_prompt $fname, $filename, $extname

  keyframe_file=`echo $file | sed 's/^videos/keyframes/g'`
  keyframe_dir=`dirname $keyframe_file`
  echo $_prompt $keyframe_dir, $keyframe_file

  extract_image_dir=$keyframe_dir/$filename
  if [ -d $extract_image_dir ] 
  then
    echo "$_prompt Directory $extract_image_dir exists." 
  else
    echo "$_prompt Mkdir extract image dir: $extract_image_dir"
    mkdir -p $extract_image_dir

    echo "$_prompt Extract keyframe."
    ffmpeg -y -vsync 0 -i $file -vf select='eq(pict_type\,I)' -f image2 $extract_image_dir/$filename-%04d.jpg
  fi

  zip_file=$extract_image_dir.zip
  if [ -f $zip_file ]
  then
    echo "$_prompt Zip file $zip_file exists." 
  else
    echo $_prompt Create zip file: $zip_file
    zip -qj $zip_file $extract_image_dir
  fi
done
```

## 相关命令
### 文件目录
```shell
file=/home/wjj/videos/race.mp4
dirname $file
```
```
/home/wjj/videos
```

### 文件名
```shell
file=/home/wjj/videos/race.mp4
basename $file
```
```
race.mp4
```

### 名字
```shell
file=/home/wjj/videos/race.mp4
filename=$(basename $file)
name=${fname%%.*}
echo $name
```
```
race
```

### 扩展名
```shell
file=/home/wjj/videos/race.mp4
filename=`basename $file`
extname=${fname##*.}
echo $extname
```
```
mp4
```

### find
> -i(大小写不敏感) -o -or(查找多种文件类型)
```shell
find videos -iname '*.mov' -o -iname '*.mts' -o -iname '*.mp4'
find videos -iname '*.mov' -or -iname '*.mts' -or -iname '*.mp4'
```

### ffmpeg
> 抽取关键帧(I)，输出时调整图片大小（RESIZE）。
```shell
file=/home/wjj/videos/race.mp4
ffmpeg -y -vsync 0 -i $file -vf scale=1024:-1,select='eq(pict_type\,I)' -f image2 %04d.jpg
```

### zip
> -q(静音模式，不输出压缩过程的信息) -j(仅存储保存文件的名称，不存储目录名称)
```shell
zip -qj race.zip race
```

## 参考资料
* [Linux常用命令-解压缩篇](https://zhuanlan.zhihu.com/p/47221234)
* [zip压缩文件处理](https://www.jianshu.com/p/15bdb508837e)
* [How To Check If a Directory Exists In a Shell Script](https://www.cyberciti.biz/faq/howto-check-if-a-directory-exists-in-a-bash-shellscript/)
* [Unix find: multiple file types](https://stackoverflow.com/questions/7190565/unix-find-multiple-file-types)
* [How can I find all video files on my system?](https://askubuntu.com/questions/844711/how-can-i-find-all-video-files-on-my-system)
* [特殊字符大全](http://xh.5156edu.com/page/18466.html)
