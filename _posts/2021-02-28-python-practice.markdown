---
layout: post
title:  "Python实践"
date:   2021-02-28 00:00:00 +0800
categories: Python 实践
tags: []
---

## 语法
### import
解释器导入模块时，会通过特定的路径列表来查找，通过 sys.path 可以看到这个路径列表。
```py
>>> import sys
>>> sys.path
['', '/usr/lib/python38.zip', '/usr/lib/python3.8', '/usr/lib/python3.8/lib-dynload', '/home/lnsoft/.local/lib/python3.8/site-packages', '/usr/local/lib/python3.8/dist-packages', '/usr/lib/python3/dist-packages']
```


## 模块
### ```__init__.py```
在 Python 2 的规范中，需要在模块所在的文件夹新建一个 ```__init__.py```，内容可以为空，也可以用来表述包对外暴露的模块接口。在 Python 3 规范中，```__init__.py``` 并不是必须的。

## 工程
### 配置项目的根路径
在一个 Virtual Environment 里，在 activate 文件的末尾配置 PYTHONHOME。
```
export PYTHONPATH="您的工程路径"
```

每次当您通过 activate 激活这个运行时环境的时候，它就会自动将项目的根路径添加到搜索路径中去。

### ```if __name__ == '__main__'```
运行 Python 脚本的第一个脚本的 ```__name__``` 值为 ```__main__```，在脚本中使用 import 语句时，```__name__``` 就会被赋值为该模块的名字了，这样导入进来的模块语句将不会执行。
