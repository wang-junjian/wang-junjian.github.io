---
layout: single
title:  "WhisperLiveKit"
date:   2025-11-10 08:00:00 +0800
categories: WhisperLiveKit ASR
tags: [WhisperLiveKit, ASR, Whisper, JetsonThor]
---

<!--more-->

## WhisperLiveKit 演示

![](/images/2025/whisperlivekit/demo.jpeg)

> 实时、完全本地化的语音转文本，带说话人识别功能


## WhisperLiveKit 架构

![](/images/2025/whisperlivekit/architecture.png)


## 运行 vLLM 容器

```bash
docker run -it \
    --ipc=host \
    --net=host \
    --runtime=nvidia \
    --name=wlk \
    -v ~/.cache:/root/.cache \
    -v /models:/models \
    nvcr.io/nvidia/pytorch:25.10-py3 \
    bash
```

### 生成证书

```bash
mkdir -p .cert && cd .cert

openssl req -x509 -newkey rsa:4096 \
  -keyout key.pem \
  -out cert.pem \
  -days 365 \
  -nodes \
  -subj "/C=CN/ST=ShanDong/L=JiNan/O=LNSoft/OU=LNSoft/CN=192.168.55.1/emailAddress=wjj@163.com"
```

#### 参数解释：

* `-x509`：生成自签名证书
* `-newkey rsa:4096`：新建 4096 位 RSA 密钥
* `-keyout key.pem`：输出私钥文件
* `-out cert.pem`：输出证书文件
* `-days 365`：证书有效期 365 天
* `-nodes`：不加密私钥（即无需输入密码）
* `-subj`：直接指定证书主题，跳过交互式输入

### 验证生成结果

```bash
openssl x509 -in cert.pem -noout -subject -dates
```
```bash
subject=C = CN, ST = ShanDong, L = JiNan, O = LNSoft, OU = LNSoft, CN = 192.168.55.1, emailAddress = wjj@163.com
notBefore=Oct 26 11:22:28 2025 GMT
notAfter=Oct 26 11:22:28 2026 GMT
```

### 安装依赖

#### 安装 ffmpeg

- Ubuntu

```bash
apt update
apt install -y ffmpeg
```

- macOS

```bash
brew install ffmpeg
```

#### 安装 torchaudio
```bash
pip install torchaudio torchvision --index-url https://download.pytorch.org/whl/cu130
```

#### 安装 whisperlivekit

```bash
pip install whisperlivekit -i https://pypi.tuna.tsinghua.edu.cn/simple
pip install -U ml_dtypes -i https://pypi.tuna.tsinghua.edu.cn/simple
```

#### 安装 certifi

certifi 是一个提供最新 CA 根证书（Certificate Authority bundle）的 Python 包。它让 Python 能正确验证 HTTPS 站点是否可信。

```bash
pip install --upgrade certifi -i https://pypi.tuna.tsinghua.edu.cn/simple
```

#### 检查 CUDA 是否可用

```bash
python -c "import torch; print(torch.cuda.is_available())"
```

#### 可选依赖

| Optional | `pip install` |
|-----------|-------------|
| **Speaker diarization** | `git+https://github.com/NVIDIA/NeMo.git@main#egg=nemo_toolkit[asr]` |
| **Apple Silicon optimizations** | `mlx-whisper` |
| **Translation** | `nllw` |
| *[Not recommanded]*  Speaker diarization with Diart | `diart` |
| *[Not recommanded]*  Original Whisper backend | `whisper` |
| *[Not recommanded]*  Improved timestamps backend | `whisper-timestamped` |
| OpenAI API backend | `openai` |

参考 **[参数与配置](https://github.com/QuentinFuxa/WhisperLiveKit?tab=readme-ov-file#parameters--configuration)** 了解如何使用它们。

**安装可选依赖**

```bash
pip install "git+https://github.com/NVIDIA/NeMo.git@main#egg=nemo_toolkit[asr]"
pip install nllw openai -i https://pypi.tuna.tsinghua.edu.cn/simple
```

- macOS
```bash
pip install mlx-whisper -i https://pypi.tuna.tsinghua.edu.cn/simple
```

### 运行 WhisperLiveKit 服务器

```bash
whisperlivekit-server --model small \
    --host 0.0.0.0 --port 8000 \
    --ssl-certfile .cert/cert.pem \
    --ssl-keyfile .cert/key.pem \
    --language zh
```

#### model 参数

- tiny.en
- tiny
- base.en
- base
- small.en
- small
- medium.en
- medium
- large-v1
- large-v2
- large-v3
- large
- large-v3-turbo

#### 启用语音分离

```bash
# Diarization and server listening on */80 
whisperlivekit-server --model small \
    --host 0.0.0.0 --port 8000 \
    --ssl-certfile .cert/cert.pem \
    --ssl-keyfile .cert/key.pem \
    --diarization \
    --language zh
```


## 运行 WhisperLiveKit 客户端

浏览器访问 `https://192.168.55.1:8000`


## 参考资料
- [WhisperLiveKit](https://github.com/QuentinFuxa/WhisperLiveKit)
- [NVIDIA NeMo Framework](https://github.com/NVIDIA-NeMo/NeMo)
