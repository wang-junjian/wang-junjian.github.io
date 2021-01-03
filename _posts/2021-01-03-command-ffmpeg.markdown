---
layout: post
title:  "命令ffmpeg"
date:   2021-01-03 00:00:00 +0800
categories: Linux
tags: [Linux, Command, ffmpeg, GPU, NVIDIA]
---

## FFmpeg
* 格式转换
```shell
ffmpeg -i input.mp4 output.avi
```

* 每秒(-r)抽取一张图片
```shell
ffmpeg -i input.mp4 -r 1 -s 1024x768 -f image2 input-%03d.jpeg
```

* 抽取关键帧(IPB)图片
```shell
ffmpeg -y -vsync 0 -i input.mp4 -vf select='eq(pict_type\,I)' -f image2 I-input-%03d.jpeg
ffmpeg -y -vsync 0 -i input.mp4 -vf select='eq(pict_type\,P)' -f image2 P-input-%03d.jpeg
ffmpeg -y -vsync 0 -i input.mp4 -vf select='eq(pict_type\,B)' -f image2 B-input-%03d.jpeg
```

* 使用一组图片生成视频
```shell
ffmpeg -f image2 -framerate 3 -i input-%03d.jpeg -s 1024x768 foo.avi
```

## NVIDIA GPU 加速
* 格式转换
```shell
ffmpeg -y -vsync 0 -hwaccel cuda -hwaccel_output_format cuda -i input.mp4 -c:a copy -c:v h264_nvenc -b:v 5M output.mp4
```

* 缩放
```shell
ffmpeg -y -vsync 0 -hwaccel cuda -hwaccel_output_format cuda -i input.mp4 \
    -vf scale_npp=1920:1080 -c:a copy -c:v h264_nvenc -b:v 5M output-1080p.mp4 \
    -vf scale_npp=1280:720 -c:a copy -c:v h264_nvenc -b:v 8M output-720p.mp4
```

* GPU解码视频，CPU抽取图片。
```shell
ffmpeg -y -hwaccel cuvid -c:v h264_cuvid -i input.mp4 -vf "hwdownload,format=nv12" -r 1 input-%03d.jpeg
ffmpeg -y -hwaccel cuvid -c:v h264_cuvid -i input.mp4 -vf "scale_npp=format=yuv420p,hwdownload,format=yuv420p" -r 1 input-%03d.jpeg
```

## FFmpeg容器
### Alpine
* 使用
```shell
docker run --rm -v $(pwd):$(pwd) -w $(pwd) jrottenberg/ffmpeg:4.3-alpine 参数
```

* 例子
```shell
docker run --rm -v $(pwd):$(pwd) -w $(pwd) jrottenberg/ffmpeg:4.3-alpine \
    -y -vsync 0 -i input.mp4 -vf select='eq(pict_type\,I)' \
    -f image2 I-input-%03d.jpeg
```

### NVIDIA
* 使用
```shell
docker run --rm --runtime nvidia -v $(pwd):$(pwd) -w $(pwd) jrottenberg/ffmpeg:4.3-nvidia 参数
```

* 例子
```shell
docker run --rm --runtime nvidia -v $(pwd):$(pwd) -w $(pwd) jrottenberg/ffmpeg:4.3-nvidia \
    -y -vsync 0 -hwaccel cuda -hwaccel_output_format cuda \
    -i input.mp4 -c:a copy -c:v h264_nvenc -b:v 5M output.mp4
```

## 参考资料
* [FFmpeg](https://ffmpeg.org/)
* [ffmpeg Documentation](https://ffmpeg.org/ffmpeg.html)
* [Using FFmpeg with NVIDIA GPU Hardware Acceleration](https://docs.nvidia.com/video-technologies/video-codec-sdk/ffmpeg-with-nvidia-gpu/index.html)
* [FFmpeg Docker image](https://hub.docker.com/r/jrottenberg/ffmpeg)
* [ffmpeg hwaccel options](https://trac.ffmpeg.org/wiki/HWAccelIntro)
* [分辨率、帧速率、比特率、视频格式的关系](https://zhuanlan.zhihu.com/p/60868555)
* [FFmpeg硬解码](https://blog.csdn.net/tosonw/article/details/90178195)
* [How to extract a video frame using NVIDIA card](https://video.stackexchange.com/questions/24283/how-to-extract-a-video-frame-using-nvidia-card)
* [Extract key frame from video with ffmpeg](https://video.stackexchange.com/questions/19725/extract-key-frame-from-video-with-ffmpeg)
* [THUMBNAILS (IFRAME / SCENE CHANGE) - 2020](https://www.bogotobogo.com/FFMpeg/ffmpeg_thumbnails_select_scene_iframe.php)
* [Key Frame Extraction From Video](https://stackoverflow.com/questions/9064962/key-frame-extraction-from-video)
* [How to extract all key frames from a video clip?](https://superuser.com/questions/669716/how-to-extract-all-key-frames-from-a-video-clip)
* [Trying to do keyframes for a list of videos in a folder](https://www.reddit.com/r/ffmpeg/comments/k2a770/trying_to_do_keyframes_for_a_list_of_videos_in_a/)
* [How to use GPU to accelerate the processing speed of ffmpeg filter?](https://stackoverflow.com/questions/55687189/how-to-use-gpu-to-accelerate-the-processing-speed-of-ffmpeg-filter/55747785)
* [Hands-On-FFMPEG](https://github.com/Hong-Bo/hands-on-ffmpeg)
