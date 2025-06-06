---
layout: single
title:  "Python 配置共享软件包缓存"
date:   2023-05-11 08:00:00 +0800
categories: Cache
tags: [Conda, pip, MacBookProM2Max]
---

共享软件包缓存的好处是，一旦用户已经下载了软件包的特定版本，它将不会再次下载并存储在单独的缓存中。这节省了磁盘使用量并加快了安装速度，因为它不需要再次下载软件包。

## Conda
### 查看 Conda 当前环境的信息
```shell
conda info     

     active environment : base
    active env location : /opt/miniconda
            shell level : 1
       user config file : /Users/junjian/.condarc
 populated config files : 
          conda version : 23.3.1
    conda-build version : not installed
         python version : 3.10.9.final.0
       virtual packages : __archspec=1=arm64
                          __osx=13.2.1=0
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
             user-agent : conda/23.3.1 requests/2.27.1 CPython/3.10.9 Darwin/22.3.0 OSX/13.2.1
                UID:GID : 501:20
             netrc file : None
           offline mode : False
```

通过查看了解到我现在已经配置了共享软件包的缓存目录（package cache）：`/opt/miniconda/pkgs` 和 `/Users/junjian/.conda/pkgs`，根据顺序优先存放在 `/opt/miniconda/pkgs` 目录中。

### 共享软件包缓存设置
编辑 `~/.condarc`，指定共享缓存目录的完整路径：
```yaml
pkgs_dirs:
    - /path/to/shared_directory
```

配置完成后，可以通过运行 `conda info` 来查看配置是否生效。

* [Anaconda Configuring a shared package cache](https://docs.anaconda.com/free/anaconda/packages/shared-pkg-cache/)

## pip
### 查看缓存目录
```shell
pip cache dir
/Users/junjian/Library/Caches/pip
```

### 查看缓存信息
```shell
pip cache info

Package index page cache location: /Users/junjian/Library/Caches/pip/http
Package index page cache size: 1958.8 MB
Number of HTTP files: 1153
Locally built wheels location: /Users/junjian/Library/Caches/pip/wheels
Locally built wheels size: 33.1 MB
Number of locally built wheels: 47
```

### 缓存设置
查看 pip 的配置文件

```shell
pip config list -v

For variant 'global', will try loading '/Library/Application Support/pip/pip.conf'
For variant 'user', will try loading '/Users/junjian/.pip/pip.conf'
For variant 'user', will try loading '/Users/junjian/.config/pip/pip.conf'
For variant 'site', will try loading '/opt/miniconda/pip.conf'
```

选择一个在不同虚拟环境中都会出现的文件，用于配置共享软件包缓存目录

```shell
mkdir /Users/junjian/.config/pip
vim /Users/junjian/.config/pip/pip.conf
```
```conf
[global]
cache-dir=/Users/junjian/.cache/pip
```

配置完成后，可以通过运行 `pip cache dir` 来查看配置是否生效。

可以运行 `pip cache -h` 了解更多的功能。

## 我的缓存目录
### Conda - /opt/miniconda/pkgs
### pip - /Users/junjian/Library/Caches/pip

* [pip Caching](https://pip.pypa.io/en/stable/topics/caching/)
* [Installing from local packages](https://pip.pypa.io/en/stable/user_guide/#installing-from-local-packages)
