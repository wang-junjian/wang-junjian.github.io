---
layout: post
title:  "在 MacBook Pro M2 Max 上构建开发环境"
date:   2023-02-07 08:00:00 +0800
categories: Environment
tags: [HomeBrew, Conda, Miniconda, MacBookProM2Max]
---

今天预订的 MacBook Pro M2Max 16寸 顶配 64G内存 2T硬盘到了，¥36097 。

## 硬件信息
### 芯片、内存
```shell
system_profiler SPHardwareDataType | head -n 9
Hardware:

    Hardware Overview:

      Model Name: MacBook Pro
      Model Identifier: Mac14,6
      Model Number: XXXXXXXXXXXX
      Chip: Apple M2 Max
      Total Number of Cores: 12 (8 performance and 4 efficiency)
      Memory: 64 GB
```

### 硬盘
```shell
system_profiler SPStorageDataType | head -n 8
Storage:

    Macintosh HD:

      Free: 1.37 TB (1,372,357,345,280 bytes)
      Capacity: 2 TB (1,995,218,165,760 bytes)
      Mount Point: /System/Volumes/Update/mnt1
      File System: APFS
```

## 更改主机名
```shell
sudo scutil --set HostName MBP

hostname
MBP
```


## HomeBrew
### 安装
```shell
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

```shell
# zsh => .zshrc  bash => .bashrc
vim ~/.zshrc
export PATH=$PATH:/opt/homebrew/bin
```

```shell
source ~/.zshrc
```

### 配置镜像源
```shell
vim ~/.bash_profile

export HOMEBREW_API_DOMAIN="https://mirrors.tuna.tsinghua.edu.cn/homebrew-bottles/api"
export HOMEBREW_BOTTLE_DOMAIN="https://mirrors.tuna.tsinghua.edu.cn/homebrew-bottles"
export HOMEBREW_BREW_GIT_REMOTE="https://mirrors.tuna.tsinghua.edu.cn/git/homebrew/brew.git"
export HOMEBREW_CORE_GIT_REMOTE="https://mirrors.tuna.tsinghua.edu.cn/git/homebrew/homebrew-core.git"
export HOMEBREW_PIP_INDEX_URL="https://pypi.tuna.tsinghua.edu.cn/simple"
```

```shell
source ~/.bash_profile
```

* [Homebrew](https://brew.sh/index_zh-tw)
* [Homebrew Formulae](https://formulae.brew.sh/)
* [Homebrew Documentation](https://docs.brew.sh/Installation)
* [Homebrew 清华大学开源软件镜像站](https://mirrors.tuna.tsinghua.edu.cn/help/homebrew/)


## Miniconda
### 安装
```shell
wget https://repo.anaconda.com/miniconda/Miniconda3-latest-MacOSX-arm64.sh
sudo sh Miniconda3-latest-MacOSX-arm64.sh
```

### ❌ 配置镜像源
```shell
vim ~/.condarc
```
```yaml
channels:
  - defaults
show_channel_urls: true
default_channels:
  - http://mirrors.aliyun.com/anaconda/pkgs/main
  - http://mirrors.aliyun.com/anaconda/pkgs/r
  - http://mirrors.aliyun.com/anaconda/pkgs/msys2
custom_channels:
  conda-forge: http://mirrors.aliyun.com/anaconda/cloud
  msys2: http://mirrors.aliyun.com/anaconda/cloud
  bioconda: http://mirrors.aliyun.com/anaconda/cloud
  menpo: http://mirrors.aliyun.com/anaconda/cloud
  pytorch: http://mirrors.aliyun.com/anaconda/cloud
  simpleitk: http://mirrors.aliyun.com/anaconda/cloud
```

```shell
conda clean -i
```

我配置了清华和阿里云的镜像源，但是都没有成功，最后还是使用了默认的源。

* [Using the .condarc conda configuration file](https://conda.io/projects/conda/en/latest/user-guide/configuration/use-condarc.html)
* [阿里云镜像站](https://developer.aliyun.com/mirror/anaconda)
* [清华大学开源软件镜像站](https://mirrors.tuna.tsinghua.edu.cn/help/anaconda/)

### 查看缓存目录
```shell
conda info | grep "package cache :"
          package cache : /opt/miniconda/pkgs
```

### 命令
#### 当前 conda 信息
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

#### 创建虚拟环境（将 base 虚拟环境中的 python 链接到新建的虚拟环境中）
```shell
sudo conda create --name tensorflow python
```

#### 删除虚拟环境
```shell
conda env remove --name ultralytics
```

#### 激活虚拟环境
```shell
conda activate tensorflow
```

#### 退出虚拟环境
```shell
conda deactivate
```

#### 查看虚拟环境
```shell
conda env list
# conda environments:
#
base                  *  /opt/miniconda
```

#### 指定虚拟环境安装软件包（默认安装到base环境）
```shell
sudo conda install -c apple -n tensorflow tensorflow-deps
sudo conda install -c pytorch -n pytorch pytorch torchvision torchaudio
```


## pip
配置文件在 `~/.config/pip/pip.conf`。

### 配置镜像源
```shell
pip config set global.index-url https://pypi.tuna.tsinghua.edu.cn/simple
```

### 查看缓存目录
```shell
pip cache dir
/Users/junjian/Library/Caches/pip
```


## Docker
### [安装 Docker Desktop](https://docs.docker.com/desktop/install/mac-install/)
### 配置镜像源
打开 Docker Desktop 的设置，选择 Docker Engine，然后在 JSON 配置中添加镜像源，然后重启就生效，如下：
```json
{
  "registry-mirrors": [
    "https://75oltije.mirror.aliyuncs.com",
    "http://hub-mirror.c.163.com",
    "https://docker.mirrors.ustc.edu.cn"
  ]
}
```

配置文件在 `~/.docker/daemon.json`。

运行 `docker info` 查看配置是否生效。
```shell
$ docker info

Server:
 Registry Mirrors:
  https://75oltije.mirror.aliyuncs.com/
  http://hub-mirror.c.163.com/
  https://docker.mirrors.ustc.edu.cn/
```


## 样本标注工具
### [labelImg](https://github.com/heartexlabs/labelImg)
#### 安装
```shell
conda create -n labelimg
conda activate labelimg
conda install -n labelimg python=3.9
conda install -c conda-forge labelimg -n labelimg
```

必须指定 python 的版本，高版本会出现下面的错误：
```
2023-03-26 17:28:36.037 python3.10[13381:279105] TSM AdjustCapsLockLEDForKeyTransitionHandling - _ISSetPhysicalKeyboardCapsLockLED Inhibit
Traceback (most recent call last):
  File "/opt/miniconda/lib/python3.10/site-packages/libs/canvas.py", line 530, in paintEvent
    p.drawLine(self.prev_point.x(), 0, self.prev_point.x(), self.pixmap.height())
TypeError: arguments did not match any overloaded call:
  drawLine(self, QLineF): argument 1 has unexpected type 'float'
  drawLine(self, QLine): argument 1 has unexpected type 'float'
  drawLine(self, int, int, int, int): argument 1 has unexpected type 'float'
  drawLine(self, QPoint, QPoint): argument 1 has unexpected type 'float'
  drawLine(self, Union[QPointF, QPoint], Union[QPointF, QPoint]): argument 1 has unexpected type 'float'
[1]    13381 abort      labelImg ./ classes.txt
```
* [I can't install lableImg Annotation tool in M1 Mac](https://stackoverflow.com/questions/68311672/i-cant-install-lableimg-annotation-tool-in-m1-mac)

#### 使用
```shell
labelImg images classes.txt labels
```

### [Label Studio](https://labelstud.io)
```shell
pip install -U label-studio
label-studio start
```


## 参考资料
* [Miniconda](https://docs.conda.io/en/latest/miniconda.html)
* [PyTorch GET STARTED](https://pytorch.org/get-started/locally/)
* [TRAINING A CLASSIFIER](https://pytorch.org/tutorials/beginner/blitz/cifar10_tutorial.html)
* [pip install 和 conda install 的区别](https://www.zhihu.com/question/395145313)
