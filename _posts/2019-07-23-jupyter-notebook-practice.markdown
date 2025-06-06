---
layout: single
title:  "Jupyter Notebook实践"
date:   2019-07-23 00:00:00 +0800
categories: IDE 实践 快捷键
tags: [Jupyter, JupyterHub]
---

## 本地安装
* [Installing the Jupyter Software](https://jupyter.org/install.html)
  - JupyterLab
  - classic Jupyter Notebook

## 云端环境
### Binder
* [Binder](https://gke.mybinder.org)
  - [例子](https://mybinder.org/v2/gh/gouchicao/python-practice/master)
* [Binder 文档](https://mybinder.readthedocs.io/en/latest/index.html)

### Google Colab
* [Google 提供的 Colaboratory](https://colab.research.google.com/notebooks/welcome.ipynb)

## 多用户版本
* [JupyterHub](https://jupyter.org/hub)

### 部署
* [Zero to JupyterHub for Kubernetes](https://z2jh.jupyter.org/en/latest/)
  > 使用Docker在Kubernetes上部署JupyterHub，允许它为大量用户进行有效扩展和维护。

* [The Littlest JupyterHub](https://tljh.jupyter.org/en/latest/)
  > 专为小型部署而设计的最新版本，是一种在单个虚拟机上安装JupyterHub的轻量级方法。适用于单个服务器上的（0-100）个少量用户。
    
  - 在自己的服务器上安装 [Installing on your own server](https://tljh.jupyter.org/en/latest/install/custom-server.html)
    * [List of provided nbextensions](https://jupyter-contrib-nbextensions.readthedocs.io/en/latest/nbextensions.html)
    * [我和Jupyter notebook的日常](https://zhuanlan.zhihu.com/p/35430879)
    * [jupyter自动代码补全](https://www.lefer.cn/posts/15473/)

  ```bash
  # 翻墙安装成功
  sudo apt install python3 git curl
  sudo dpkg --configure -a
  ## 最后面的admin是管理员的名字
  curl https://raw.githubusercontent.com/jupyterhub/the-littlest-jupyterhub/master/bootstrap/bootstrap.py | sudo -E python3 - --admin admin
  ## 当最后出现 Done!，代表安装成功。
  
  # 安装python包
  sudo -E conda install -y numpy
  sudo -E conda install -y pandas
  sudo -E conda install -y matplotlib
  sudo -E conda install -y sklearn
  
  # 安装jupyter nbextensions
  sudo -E pip install jupyter_contrib_nbextensions
  sudo -E jupyter contrib nbextension install
  sudo -E pip install jupyter_nbextensions_configurator
  sudo -E jupyter nbextensions_configurator enable
  
  # 用户根据自己的需求配置扩展插件
  ```
      
  - 分享GitHub [Distributing materials to users with nbgitpuller](https://tljh.jupyter.org/en/latest/howto/content/nbgitpuller.html)
    * 生成nbgitpuller链接 [mybinder.org based application](https://mybinder.org/v2/gh/jupyterhub/nbgitpuller/master?urlpath=apps/binder%2Flink_generator.ipynb)
    * 分享链接
    * 访问链接，导入自己登录的 JupyterHub 账号
      
  - 使用只读文件夹共享数据 [Share data with your users](https://tljh.jupyter.org/en/latest/howto/content/share-data.html)
    * New -> Terminal
    * sudo mkdir -p /srv/data/my_shared_data_folder
    * 把共享的文件放到my_shared_data_folder目录里
    * sudo ln -s /srv/data/my_shared_data_folder /etc/skel/my_shared_data_folder
    * 用户共享
      - 新用户。创建并登录
      - 老用户。在`cell`中运行 `sudo ln -s /srv/data/my_shared_data_folder /home/jupyter-<username>/my_shared_data_folder`
      
## 工作模式
### 命令行模式
当光标在某个cell中时，就是编辑模式。

### 编辑模式
当光标不在任意一个cell中时，就是命令行模式。在编辑模式中，按`Esc`键，进入命令行模式。

## 帮助
### 查看帮助文档的快捷键
当前光标放在模块、类、函数处，按 **`Shift+Tab, Shift+Tab`** 。

### 查看帮助文档。**`?`** 放在模块、类、函数的前后都可以
```py
?sum
sum?
```

### 查看源代码。**`??`** 放在模块、类、函数的前后都可以
```py
import pandas as pd

??pd.DataFrame
pd.DataFrame??
```

### 显示所有快捷键
在`命令行模式`下按 **`h`** 键。

### 显示所有 `magic`
```py
%lsmagic
```
```
Available line magics:
%alias  %alias_magic  %autoawait  %autocall  %automagic  %autosave  %bookmark  %cat  %cd  %clear  %colors  %config  %connect_info  %cp  %debug  %dhist  %dirs  %doctest_mode  %ed  %edit  %env  %gui  %hist  %history  %killbgscripts  %ldir  %less  %lf  %lk  %ll  %load  %load_ext  %loadpy  %logoff  %logon  %logstart  %logstate  %logstop  %ls  %lsmagic  %lx  %macro  %magic  %man  %matplotlib  %mkdir  %more  %mv  %notebook  %page  %pastebin  %pdb  %pdef  %pdoc  %pfile  %pinfo  %pinfo2  %popd  %pprint  %precision  %prun  %psearch  %psource  %pushd  %pwd  %pycat  %pylab  %qtconsole  %quickref  %recall  %rehashx  %reload_ext  %rep  %rerun  %reset  %reset_selective  %rm  %rmdir  %run  %save  %sc  %set_env  %store  %sx  %system  %tb  %time  %timeit  %unalias  %unload_ext  %who  %who_ls  %whos  %xdel  %xmode

Available cell magics:
%%!  %%HTML  %%SVG  %%bash  %%capture  %%debug  %%file  %%html  %%javascript  %%js  %%latex  %%markdown  %%perl  %%prun  %%pypy  %%python  %%python2  %%python3  %%ruby  %%script  %%sh  %%svg  %%sx  %%system  %%time  %%timeit  %%writefile

Automagic is ON, % prefix IS NOT needed for line magics.
```

### 运行 shell 命令。开始加上 **`!`**
```py
!ls
```

## magic
### time
```py
%time
# 用于一行语句的性能分析
for _ in range(10000):
    d = {'id': 1, 'name': 'wjj'}
```
```
CPU times: user 3 µs, sys: 1 µs, total: 4 µs
Wall time: 8.34 µs
```

```py
%%time
# 整个cell的性能分析
for _ in range(10000):
    d = {'id': 1, 'name': 'wjj'}
```
```
CPU times: user 1.56 ms, sys: 1 µs, total: 1.57 ms
Wall time: 1.57 ms
```

## 探索式学习
### dir() 显示属性信息
* 查看对象的属性
```py
import random
dir(random)
```
```
['BPF',
 'LOG4',
 ......
 'uniform',
 'weibullvariate']
```

* 查看方法的属性
```py
import random
dir(random.randint)
```
```
['__call__',
 '__class__',
 ......
 '__str__',
 '__subclasshook__']
```

* 查看对象的属性
```py
l = list()
dir(l)
```
```
['__add__',
 '__class__',
 ......
 'index',
 'insert',
 'pop',
 'remove',
 'reverse',
 'sort']
```

### help() 查看帮助信息
* 查看random模块的帮助信息
```py
import random
help(random)
```
```
Help on module random:
NAME
    random - Random variable generators.
......
```

* 查看方法randint的帮助信息
```py
import random
help(random.randint)
```
```
Help on method randint in module random:
randint(a, b) method of random.Random instance
    Return random integer in range [a, b], including both end points.
```

* 查看类list的帮助信息
```py
help(list)
```
```
Help on class list in module builtins:
class list(object)
 |  list(iterable=(), /)
 |  
 |  Built-in mutable sequence.
......
```

* 查看对象l的帮助信息
```py
l = list()
help(l)
```
```
Help on list object:
class list(object)
 |  list(iterable=(), /)
 |  
 |  Built-in mutable sequence.
......
```

### dis() 查看CPython生成的字节码。分析性能时很有用
```py
import dis
help(dis.dis)
```
```
Help on function dis in module dis:

dis(x=None, *, file=None, depth=None)
    Disassemble classes, methods, functions, and other compiled objects.
    
    With no argument, disassemble the last traceback.
    
    Compiled objects currently include generator objects, async generator
    objects, and coroutine objects, all of which store their code object
    in a special attribute.
```

```py
def f1():
    l = []
    
dis.dis(f1)
```
```
  2           0 BUILD_LIST               0
              2 STORE_FAST               0 (l)
              4 LOAD_CONST               0 (None)
              6 RETURN_VALUE
```

```py
def f2():
    l = list()
    
dis.dis(f2)
```
```
  2           0 LOAD_GLOBAL              0 (list)
              2 CALL_FUNCTION            0
              4 STORE_FAST               0 (l)
              6 LOAD_CONST               0 (None)
              8 RETURN_VALUE
```

### type() 查看对象的类型
```py
l = []
type(l)
```
```
list
```

```py
d = {}
type(d)
```
```
dict
```

```py
import random
type(random)
```
```
module
```

```py
from random import randint
type(randint)
```
```
method
```

```py
def func():
    pass

type(func)
```
```
function
```

### id() 对象的内存地址
```py
l = []
id(l)
```
```
4359219400
```

### timeit() 性能测试
```py
from timeit import timeit
timeit('list([1, 2, 3, 4, 5, 6])', number=1000000)
```
```
0.25840137399973173
```

## 参考资料
* [Python实践](https://github.com/gouchicao/python-practice)
* [Python官方文档](https://www.python.org/doc/)
* [cpython源代码](https://github.com/python/cpython)
* [关于Jupyter Notebook的28个技巧](https://zhuanlan.zhihu.com/p/32600329)
* [27 个Jupyter Notebook的小提示与技巧](http://liuchengxu.org/pelican-blog/jupyter-notebook-tips.html)
