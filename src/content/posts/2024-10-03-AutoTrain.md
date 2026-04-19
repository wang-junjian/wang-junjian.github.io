---
layout: single
title:  "AutoTrain"
date:   2024-10-03 10:00:00 +0800
categories: AutoTrain LLM
tags: [AutoTrain, LLM, HuggingFace]
---

- [AutoTrain Advanced](https://github.com/huggingface/autotrain-advanced)
- [AutoTrain Quickstart](https://huggingface.co/docs/autotrain/quickstart)

## 安装
### macOS
```shell
conda create -n autotrain python=3.10
conda activate autotrain
pip install autotrain-advanced
conda install pytorch torchvision torchaudio -c pytorch
pip install numpy==1.26.0
export HF_TOKEN=xxx
autotrain app --port 8080 --host 127.0.0.1
```

浏览器打开 [http://127.0.0.1:8080/ui/](http://127.0.0.1:8080/ui/) 以查看 AutoTrain 的界面。

![](/images/2024/AutoTrain/main-ui.png)
