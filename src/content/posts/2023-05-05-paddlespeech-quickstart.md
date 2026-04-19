---
layout: single
title:  "PaddleSpeech 快速入门"
date:   2023-05-05 08:00:00 +0800
categories: PaddleSpeech
tags: [Quickstart]
---

## [PaddleSpeech](https://github.com/PaddlePaddle/PaddleSpeech/blob/develop/README_cn.md)
### 介绍
[PaddleSpeech](https://github.com/PaddlePaddle/PaddleSpeech) 是基于飞桨 [PaddlePaddle](https://www.paddlepaddle.org.cn) 的语音方向的开源模型库，用于语音和音频中的各种关键任务的开发，包含大量基于深度学习前沿和有影响力的模型。

### 功能
* 语音识别
* 语音合成
* 声音分类
* 声纹提取
* 标点恢复
* 语音翻译

### 学习
* [飞桨PaddleSpeech语音技术课程](https://aistudio.baidu.com/aistudio/education/group/info/25130)
* [教程文档](https://github.com/PaddlePaddle/PaddleSpeech/blob/develop/README_cn.md#教程文档)

## 安装
```py
conda create -n paddlespeech python==3.10.9
conda activate paddlespeech

pip install paddlepaddle -i https://mirror.baidu.com/pypi/simple
pip install pytest-runner paddlespeech

pip install "numpy<1.24"
```

测试数据下载
```shell
wget -c https://paddlespeech.bj.bcebos.com/PaddleAudio/zh.wav
wget -c https://paddlespeech.bj.bcebos.com/PaddleAudio/en.wav
```

## FAQ
### paddlespeech asr --lang zh --input zh.wav
```
Traceback (most recent call last):
  File "/opt/miniconda/envs/paddlespeech/bin/paddlespeech", line 8, in <module>
    sys.exit(_execute())
  File "/opt/miniconda/envs/paddlespeech/lib/python3.10/site-packages/paddlespeech/cli/entry.py", line 40, in _execute
    exec("from {} import {}".format(module, cls))
  File "<string>", line 1, in <module>
  File "/opt/miniconda/envs/paddlespeech/lib/python3.10/site-packages/paddlespeech/cli/asr/__init__.py", line 14, in <module>
    from .infer import ASRExecutor
  File "/opt/miniconda/envs/paddlespeech/lib/python3.10/site-packages/paddlespeech/cli/asr/infer.py", line 24, in <module>
    import librosa
  File "/opt/miniconda/envs/paddlespeech/lib/python3.10/site-packages/librosa/__init__.py", line 211, in <module>
    from . import core
  File "/opt/miniconda/envs/paddlespeech/lib/python3.10/site-packages/librosa/core/__init__.py", line 9, in <module>
    from .constantq import *  # pylint: disable=wildcard-import
  File "/opt/miniconda/envs/paddlespeech/lib/python3.10/site-packages/librosa/core/constantq.py", line 1059, in <module>
    dtype=np.complex,
  File "/opt/miniconda/envs/paddlespeech/lib/python3.10/site-packages/numpy/__init__.py", line 305, in __getattr__
    raise AttributeError(__former_attrs__[attr])
AttributeError: module 'numpy' has no attribute 'complex'.
`np.complex` was a deprecated alias for the builtin `complex`. To avoid this error in existing code, use `complex` by itself. Doing this will not modify any behavior and is safe. If you specifically wanted the numpy scalar type, use `np.complex128` here.
The aliases was originally deprecated in NumPy 1.20; for more details and guidance see the original release note at:
    https://numpy.org/devdocs/release/1.20.0-notes.html#deprecations. Did you mean: 'complex_'?
```

需要降低 numpy 版本

```
pip install "numpy<1.24"
```

* [How can I solve error "module 'numpy' has no attribute 'float'" in Python?](https://stackoverflow.com/questions/74844262/how-can-i-solve-error-module-numpy-has-no-attribute-float-in-python)

### paddlespeech tts --input "你好，欢迎使用百度飞桨深度学习框架！" --output output.wav
```
Traceback (most recent call last):
  File "/opt/miniconda/envs/paddlespeech/bin/paddlespeech", line 8, in <module>
    sys.exit(_execute())
  File "/opt/miniconda/envs/paddlespeech/lib/python3.10/site-packages/paddlespeech/cli/entry.py", line 40, in _execute
    exec("from {} import {}".format(module, cls))
  File "<string>", line 1, in <module>
  File "/opt/miniconda/envs/paddlespeech/lib/python3.10/site-packages/paddlespeech/cli/tts/__init__.py", line 14, in <module>
    from .infer import TTSExecutor
  File "/opt/miniconda/envs/paddlespeech/lib/python3.10/site-packages/paddlespeech/cli/tts/infer.py", line 33, in <module>
    from paddlespeech.t2s.exps.syn_utils import get_am_inference
  File "/opt/miniconda/envs/paddlespeech/lib/python3.10/site-packages/paddlespeech/t2s/__init__.py", line 18, in <module>
    from . import frontend
  File "/opt/miniconda/envs/paddlespeech/lib/python3.10/site-packages/paddlespeech/t2s/frontend/__init__.py", line 16, in <module>
    from .phonectic import *
  File "/opt/miniconda/envs/paddlespeech/lib/python3.10/site-packages/paddlespeech/t2s/frontend/phonectic.py", line 20, in <module>
    from g2p_en import G2p
  File "/opt/miniconda/envs/paddlespeech/lib/python3.10/site-packages/g2p_en/__init__.py", line 1, in <module>
    from .g2p import G2p
  File "/opt/miniconda/envs/paddlespeech/lib/python3.10/site-packages/g2p_en/g2p.py", line 22, in <module>
    nltk.data.find('taggers/averaged_perceptron_tagger.zip')
  File "/opt/miniconda/envs/paddlespeech/lib/python3.10/site-packages/nltk/data.py", line 542, in find
    return ZipFilePathPointer(p, zipentry)
  File "/opt/miniconda/envs/paddlespeech/lib/python3.10/site-packages/nltk/compat.py", line 41, in _decorator
    return init_func(*args, **kwargs)
  File "/opt/miniconda/envs/paddlespeech/lib/python3.10/site-packages/nltk/data.py", line 394, in __init__
    zipfile = OpenOnDemandZipFile(os.path.abspath(zipfile))
  File "/opt/miniconda/envs/paddlespeech/lib/python3.10/site-packages/nltk/compat.py", line 41, in _decorator
    return init_func(*args, **kwargs)
  File "/opt/miniconda/envs/paddlespeech/lib/python3.10/site-packages/nltk/data.py", line 935, in __init__
    zipfile.ZipFile.__init__(self, filename)
  File "/opt/miniconda/envs/paddlespeech/lib/python3.10/zipfile.py", line 1267, in __init__
    self._RealGetContents()
  File "/opt/miniconda/envs/paddlespeech/lib/python3.10/zipfile.py", line 1334, in _RealGetContents
    raise BadZipFile("File is not a zip file")
zipfile.BadZipFile: File is not a zip file
```

缺少 nltk_data

```
cd ~/
wget https://paddlespeech.bj.bcebos.com/Parakeet/tools/nltk_data.tar.gz
rm -rf ./nltk_data
tar -zxf nltk_data.tar.gz
```

* [[nltk_data] zipfile.BadZipFile: File is not a zip file #1925](https://github.com/PaddlePaddle/PaddleSpeech/issues/1925)

## 参考资料
* [PaddleSpeech](https://github.com/PaddlePaddle/PaddleSpeech)
* [PaddlePaddle](https://www.paddlepaddle.org.cn)
* [PaddleGAN](https://github.com/PaddlePaddle/PaddleGAN/blob/develop/README_cn.md)
* [Speech Synthesis Markup Language (SSML) Version 1.1](https://www.w3.org/TR/speech-synthesis/)
* [GitHub 3.1K，业界首个流式语音合成系统开源！](https://cloud.tencent.com/developer/article/2010269)
