---
type: article
title:  "在 MacBook Pro M2 Max 上使用 FFmpeg"
date:   2023-03-04 08:00:00 +0800
tags: [ffmpeg, macos, macbookpro, apple-silicon, videotoolbox, audiotoolbox, hardware-acceleration, video, audio]
---

## Apple 芯片上进行硬件加速的框架
### [Video Toolbox](https://developer.apple.com/documentation/videotoolbox)
VideoToolbox 是一个低级框架，可提供对硬件编码器和解码器的直接访问。它提供视频压缩和解压缩服务，以及存储在 CoreVideo 像素缓冲区中的光栅图像格式之间的转换。这些服务以会话对象（压缩、解压缩和像素传输）的形式提供。

VideoToolbox还包括一些命令行工具，例如vttool、vtenc、vtdecode等，可以在终端中使用。这些工具可以用来检查视频的属性、转码视频、将视频转换为图像序列等任务。

### [Audio Toolbox](https://developer.apple.com/documentation/audiotoolbox)
AudioToolbox 是一个音频处理框架，支持音频处理的硬件加速，它提供了一系列用于音频编码、解码、转换和处理的API接口。

## 安装 FFmpeg
* [static FFmpeg binaries for macOS 64-bit](https://evermeet.cx/ffmpeg/)

### 创建目录
```shell
mkdir /opt/ffmpeg && cd /opt/ffmpeg
```

### 方法一：使用 curl
```shell
curl https://evermeet.cx/ffmpeg/ffmpeg-6.0.7z | tar -xz
curl https://evermeet.cx/ffmpeg/ffprobe-6.0.7z | tar -xz
curl https://evermeet.cx/ffmpeg/ffplay-6.0.7z | tar -xz
```

### 方法二：使用 wget
```shell
wget https://evermeet.cx/ffmpeg/ffmpeg-6.0.7z -O- | tar -xz
wget https://evermeet.cx/ffmpeg/ffprobe-6.0.7z -O- | tar -xz
wget https://evermeet.cx/ffmpeg/ffplay-6.0.7z -O- | tar -xz
```

## 查看 FFmpeg 中使用硬件加速的编解码器
### 使用 VideoToolbox 和 AudioToolbox 的编码器
```shell
ffmpeg -hide_banner -encoders | grep -i toolbox
```
```
 V..... h264_videotoolbox    VideoToolbox H.264 Encoder (codec h264)
 V..... hevc_videotoolbox    VideoToolbox H.265 Encoder (codec hevc)
 A....D aac_at               aac (AudioToolbox) (codec aac)
 A....D alac_at              alac (AudioToolbox) (codec alac)
 A....D ilbc_at              ilbc (AudioToolbox) (codec ilbc)
 A....D pcm_alaw_at          pcm_alaw (AudioToolbox) (codec pcm_alaw)
 A....D pcm_mulaw_at         pcm_mulaw (AudioToolbox) (codec pcm_mulaw)
```

### 使用 VideoToolbox 和 AudioToolbox 的解码器
```shell
ffmpeg -hide_banner -decoders | grep -i toolbox
```
```
 A....D aac_at               aac (AudioToolbox) (codec aac)
 A....D ac3_at               ac3 (AudioToolbox) (codec ac3)
 A....D adpcm_ima_qt_at      adpcm_ima_qt (AudioToolbox) (codec adpcm_ima_qt)
 A....D alac_at              alac (AudioToolbox) (codec alac)
 A....D amr_nb_at            amr_nb (AudioToolbox) (codec amr_nb)
 A....D eac3_at              eac3 (AudioToolbox) (codec eac3)
 A....D gsm_ms_at            gsm_ms (AudioToolbox) (codec gsm_ms)
 A....D ilbc_at              ilbc (AudioToolbox) (codec ilbc)
 A....D mp1_at               mp1 (AudioToolbox) (codec mp1)
 A....D mp2_at               mp2 (AudioToolbox) (codec mp2)
 A....D mp3_at               mp3 (AudioToolbox) (codec mp3)
 A....D pcm_alaw_at          pcm_alaw (AudioToolbox) (codec pcm_alaw)
 A....D pcm_mulaw_at         pcm_mulaw (AudioToolbox) (codec pcm_mulaw)
 A....D qdm2_at              qdm2 (AudioToolbox) (codec qdm2)
 A....D qdmc_at              qdmc (AudioToolbox) (codec qdmc)
```

## [视频] 使用 time 命令测试各种编码使用资源的详情

| user(s) | system(s) | cpu   | total(s) | FFmpeg 命令 | 输入大小 | 输出大小 |
| ------: | --------: | ----: | -------: | ---------- | ------: | ------: |
|  430.07 |      4.40 | 1080% |   40.194 | ffmpeg -hwaccel videotoolbox -i input.mts output.mp4 | 217M | 169M |
|  390.16 |      5.08 | 1081% |   36.547 | ffmpeg -hwaccel videotoolbox -i input.mts -c:v libx264 output.mp4 | 217M | 162M |
|    3.92 |      2.18 |   33% |   18.466 | 🚀 ```ffmpeg -hwaccel videotoolbox -i input.mts -c:v h264_videotoolbox output.mp4``` | 217M | 33M |
|   27.77 |      0.74 |  160% |   17.775 | ffmpeg -i input.mts -c:v h264_videotoolbox output.mp4 | 217M | 33M |
|   75.58 |      0.96 | 1136% |    6.734 | ffmpeg -i input.mts -preset ultrafast output.mp4 | 217M | 290M |
|    4.00 |      2.21 |   33% |   18.578 | ffmpeg -hwaccel videotoolbox -i input.mts -c:v h264_videotoolbox -preset ultrafast output.mp4 | 217M | 33M |
|   16.16 |      1.17 |   64% |   26.750 | ffmpeg -hwaccel videotoolbox -i input.mts -c:v h264_videotoolbox -c:a aac_at output.mp4 | 217M | 32M |
|    3.85 |      2.22 |   32% |   18.460 | ffmpeg -hwaccel videotoolbox -i input.mts -c:v h264_videotoolbox -c:a aac output.mp4 | 217M | 33M |

* -hwaccel videotoolbox 指定比不指定好。
* -preset 对软编码才起作用。
* -c:a 音频使用软编码更有效。

🚀 最佳使用方法：
```shell
ffmpeg -hwaccel videotoolbox -i input.mts -c:v <硬编码: x_videotoolbox> -c:a <软编码> output.mp4
```

## [音频]
### mp3 转 wav
```shell
ffmpeg -i input.mp3 -ar 16000 -ac 1 -c:a pcm_s16le output.wav
```

## FFmpeg 硬件加速
### Intel
* QSV(libmfx): 从 SDK 到 driver 都已开源，同时支持 Windows 和 Linux，Intel 主推方案。
* VAAPI: Linux 开源接口，可支持 AMD/Nvidia 驱动，FFmpeg 社区比较喜欢。

### Nvidia
* NVENC/CUVID/NVDEC
* VDPAU: 不支持 Encode，Nvidia 官方基本上不维护了。

### AMD
* AMF on Windows
* VAAPI on Linux

### OS 厂商
* Windows: D3D9(DXVA2), D3D11
* Android: MediaCodec, OpenMax
* Apple: VideoToolbox

## 视频相关资料
### I 帧、P 帧和 B 帧是视频编码中的三种基本帧类型
#### I 帧（Intra-coded picture）
I 帧也称为关键帧，它是一种独立编码的帧，不依赖于其他帧，包含完整的图像信息。I 帧通常在视频的开始或转场处出现，用于描述场景的静态特征或关键元素，如场景的背景、人物等。因为 I 帧包含完整的图像信息，所以它的文件大小通常比其他帧大，但是它的压缩率也相对较低，有助于提高视频质量。

#### P 帧（Predicted picture）
P 帧是一种参考帧，它依赖于前面的 I 帧或 P 帧。P 帧只编码图像中发生变化的部分，通过参考前面的帧预测当前帧的运动信息，并通过差分编码的方式来减小文件大小。P 帧通常用于描述场景的动态特征，如人物的动作、物体的移动等。因为 P 帧依赖于前面的帧，所以它的文件大小通常比 I 帧小，但是它的压缩率也相对较高，可能会导致一些细节的损失。

#### B 帧（Bi-predictive picture）
B 帧是一种双向参考帧，它既依赖于前面的 I 帧或 P 帧，也依赖于后面的 P 帧。B 帧可以在两个方向上预测运动信息，通过比较前后帧的运动信息来更加准确地编码图像信息。B 帧通常用于描述快速运动的场景，如球赛、车赛等。因为 B 帧既依赖于前面的帧又依赖于后面的帧，所以它的文件大小通常比 P 帧小，但是它的压缩率也相对较高，可能会导致更多的细节损失。

在视频编码过程中，I 帧、P 帧和 B 帧的比例对于视频质量和文件大小都有很大的影响。通常情况下，适当增加 I 帧的数量可以提高视频的质量，但会增加文件大小；适当增加 P 帧和 B 帧的数量可以减小文件大小，但可能会影响视频的细节和流畅度。

## 参考资料
* [Apple Silicon](https://developer.apple.com/documentation/apple-silicon)
* [使用 VideoToolbox 探索低延迟视频编码 WWDC 演讲实录](https://xie.infoq.cn/article/3d8b8a2110a2a3bd91e0cf90e)
* [得物视频编辑工具优化全指南](https://xie.infoq.cn/article/fd7009f37db27fb6471f5c180)
* [从 FFmpeg 性能加速到端云一体媒体系统优化](https://xie.infoq.cn/article/3e7d2f8b64b0d2c38663007f4)
* [如何使用 FFmpeg 命令处理音视频](https://xie.infoq.cn/article/9a7d4696d71f844dfe8fbe101)
* [FFmpeg 音视频处理工具三剑客（ffmpeg、ffprobe、ffplay](https://xie.infoq.cn/article/67a5f910b5281f6078415f35c)
* [FFMPEG – From Zero to Hero](https://ffmpegfromzerotohero.com/blog/)
* [how to use ffmpeg with gpu support on macos](https://stackoverflow.com/questions/52591553/how-to-use-ffmpeg-with-gpu-support-on-macos)
* [ffmpeg.git](https://git.ffmpeg.org/gitweb/ffmpeg.git)
* [FFmpeg package for Apple Silicon](https://stackoverflow.com/questions/65060304/ffmpeg-package-for-apple-silicon)
* [IOT DC3 FFmpeg](https://doc.dc3.site/#/tip/ffmpeg)
* [ggerganov/whisper.cpp](https://github.com/ggerganov/whisper.cpp)
* [How to convert any mp3 file to .wav 16khz mono 16bit](https://stackoverflow.com/questions/13358287/how-to-convert-any-mp3-file-to-wav-16khz-mono-16bit)
