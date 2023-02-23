---
layout: post
title:  "在 MacBook Pro M2 Max 上构建开发环境"
date:   2023-02-07 08:00:00 +0800
categories: MacBookProM2Max AI
tags: [HomeBrew, Conda, Miniconda]
---

今天预订的 MacBook Pro M2Max 16寸 顶配 64G内存 2T硬盘到了，¥36097 。

## 更改主机名
```shell
sudo scutil --set HostName MBP

hostname
MBP
```

## 安装 HomeBrew
```shell
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# zsh => .zshrc  bash => .bashrc
vim ~/.zshrc
export PATH=$PATH:/opt/homebrew/bin

source ~/.zshrc
```
* [Homebrew](https://brew.sh/index_zh-tw)
* [Homebrew Documentation](https://docs.brew.sh/Installation)

## 安装 Miniconda
```shell
wget https://repo.anaconda.com/miniconda/Miniconda3-latest-MacOSX-arm64.sh
sudo sh Miniconda3-latest-MacOSX-arm64.sh
```

### 当前 conda 显示信息
```shell
conda info
```
```
     active environment : base
    active env location : /opt/miniconda
            shell level : 1
       user config file : /Users/junjian/.condarc
 populated config files : 
          conda version : 23.1.0
    conda-build version : not installed
         python version : 3.10.9.final.0
       virtual packages : __archspec=1=arm64
                          __osx=13.2=0
                          __unix=0=0
       base environment : /opt/miniconda  (writable)
      conda av data dir : /opt/miniconda/etc/conda
  conda av metadata url : None
           channel URLs : https://repo.anaconda.com/pkgs/main/osx-arm64
                          https://repo.anaconda.com/pkgs/main/noarch
                          https://repo.anaconda.com/pkgs/r/osx-arm64
                          https://repo.anaconda.com/pkgs/r/noarch
          package cache : /opt/miniconda/pkgs
                          /Users/junjian/.conda/pkgs
       envs directories : /opt/miniconda/envs
                          /Users/junjian/.conda/envs
               platform : osx-arm64
             user-agent : conda/23.1.0 requests/2.28.1 CPython/3.10.9 Darwin/22.3.0 OSX/13.2
                UID:GID : 501:20
             netrc file : None
           offline mode : False
```

### 创建虚拟环境（将 base 虚拟环境中的 python 链接到新建的虚拟环境中）
```shell
sudo conda create --name tensorflow python
```

### 激活虚拟环境
```shell
conda activate tensorflow
```

### 退出虚拟环境
```shell
conda deactivate
```

### 查看虚拟环境
```shell
conda env list
# conda environments:
#
base                  *  /opt/miniconda
```

### 指定虚拟环境安装软件包（默认安装到base环境）
```shell
sudo conda install -c apple -n tensorflow tensorflow-deps
sudo conda install -c pytorch -n pytorch pytorch torchvision torchaudio
```

## 参考资料
* [Miniconda](https://docs.conda.io/en/latest/miniconda.html)
* [PyTorch GET STARTED](https://pytorch.org/get-started/locally/)
* [TRAINING A CLASSIFIER](https://pytorch.org/tutorials/beginner/blitz/cifar10_tutorial.html)
* [pip install 和 conda install 的区别](https://www.zhihu.com/question/395145313)
