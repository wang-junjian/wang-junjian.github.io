---
layout: post
title:  "抽取视频关键帧保存zip文件"
date:   2021-01-24 00:00:00 +0800
categories: Linux
tags: [Linux, shell, ffmpeg, find, basename, dirname, zip, sed, mkdir, if]
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
video_files=$(find videos -iname '*.mov' -o -iname '*.mts' -o -iname '*.mp4')
for file in $video_files
do
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
    ffmpeg -y -vsync 0 -i $file -vf select='eq(pict_type\,I)' -f image2 $extract_image_dir/$filename-%04d.jpg;
  fi

  zip_file=$extract_image_dir.zip
  if [ -f $zip_file ]
  then
    echo "$_prompt Zip file $zip_file exists." 
  else
    echo $_prompt Create zip file: $extract_image_dir.zip
    zip -qrj $extract_image_dir.zip $extract_image_dir
  fi
done
```
