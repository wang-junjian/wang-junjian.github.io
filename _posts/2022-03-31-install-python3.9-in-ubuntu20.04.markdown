---
layout: post
title:  "Install Python3.9 in Ubuntu20.04"
date:   2022-03-31 00:00:00 +0800
categories: 工作日志 Python
tags: [Linux, Ubuntu, pip, Install, Python3.9]
---

## 问题
基于之前安装 Python3.8 的经验，运行下面的命令就可以成功安装 Python3.9 和 pip，但是这回失败了。
```shell
sudo apt install build-essential python3.9 python3.9-dev -y
sudo ln -s /usr/bin/python3.9 /usr/bin/python
curl https://bootstrap.pypa.io/get-pip.py | sudo python -
```
```
Traceback (most recent call last):
  File "/home/lnsoft/wjj/get-pip.py", line 33324, in <module>
    main()
  File "/home/lnsoft/wjj/get-pip.py", line 135, in main
    bootstrap(tmpdir=tmpdir)
  File "/home/lnsoft/wjj/get-pip.py", line 111, in bootstrap
    monkeypatch_for_cert(tmpdir)
  File "/home/lnsoft/wjj/get-pip.py", line 92, in monkeypatch_for_cert
    from pip._internal.commands.install import InstallCommand
  File "<frozen zipimport>", line 259, in load_module
  File "/tmp/tmpcw3afq6v/pip.zip/pip/_internal/commands/__init__.py", line 9, in <module>
  File "<frozen zipimport>", line 259, in load_module
  File "/tmp/tmpcw3afq6v/pip.zip/pip/_internal/cli/base_command.py", line 15, in <module>
  File "<frozen zipimport>", line 259, in load_module
  File "/tmp/tmpcw3afq6v/pip.zip/pip/_internal/cli/cmdoptions.py", line 23, in <module>
  File "<frozen zipimport>", line 259, in load_module
  File "/tmp/tmpcw3afq6v/pip.zip/pip/_internal/cli/parser.py", line 12, in <module>
  File "<frozen zipimport>", line 259, in load_module
  File "/tmp/tmpcw3afq6v/pip.zip/pip/_internal/configuration.py", line 26, in <module>
  File "<frozen zipimport>", line 259, in load_module
  File "/tmp/tmpcw3afq6v/pip.zip/pip/_internal/utils/logging.py", line 27, in <module>
  File "<frozen zipimport>", line 259, in load_module
  File "/tmp/tmpcw3afq6v/pip.zip/pip/_internal/utils/misc.py", line 39, in <module>
  File "<frozen zipimport>", line 259, in load_module
  File "/tmp/tmpcw3afq6v/pip.zip/pip/_internal/locations/__init__.py", line 14, in <module>
  File "<frozen zipimport>", line 259, in load_module
  File "/tmp/tmpcw3afq6v/pip.zip/pip/_internal/locations/_distutils.py", line 9, in <module>
ModuleNotFoundError: No module named 'distutils.cmd'
```

在看到这个错误，首先想到的就是安装包 python3.9-distutils，但是在安装的时候看到它依赖的安装包都是 python3.8 的。没有找到更好的解决方法，这里找到[一个解释](https://github.com/pypa/get-pip/issues/124#issuecomment-907441196)：
```
I believe this is a bug in Debian's Python package. Their modifications to Python have been a source of a long standing debate: https://gist.github.com/tiran/2dec9e03c6f901814f6d1e8dad09528e has a lot of discussion.
I think that is the issue, Ubuntu packages are inconsistent, i.e. python3.8 and python3.9 bring different set of modules, as well as have different set of decencies, while all that should really differ is just Python version. Same applies for python3.[89]-minimal. However, all 4 are consentient in one thing - not having sys.prefix/lib/pythonX.Y/site-packages in sys.path
To have that (and distutils) sorted, one needs to install a collection of python3 packages, but those are Python3.8 (and bring tons of semi-random libraries and so).

All Ubuntu provided Python3.[89] 'installations' have ensurepip removed. I think, the 'logic' is to force people to use python3-pip that (unless --no-install-recommends is used) brings whole tone of things including make, cpp and perl(!)

I strongly recommend filing an issue with Debian and Ubuntu for this -- while pip can do things to paper over the issue, the fundamental problem is that the Python installation is not proper. Part of the problem is that Debian users don't ask Debian's maintainers to make fixes for the things they break.
I will consider that.

manually installing distutils
How did you do this? If you've used what is available in CPython's source tree, then you've installed an incompatible distutils for the Python interpreter -- Debian relies on patches they make to distutils to keep things working.
Installing might be a bit of overstatement, since I am working with Docker container I am doing:

COPY --from=python:3.9-slim /usr/local/lib/python3.9/distutils /usr/lib/python3.9/distutils
I would do FROM python:3.9-slim but I have to rely on specific 'base' container.
python:3.9-slim has FROM debian:bullseye-slim
```

## 解决方案
```shell
sudo apt install build-essential python3.9 python3.9-dev python3.9-distutils -y
sudo ln -s /usr/bin/python3.9 /usr/bin/python
curl https://bootstrap.pypa.io/get-pip.py | sudo python -
```

**install python3.9-distutils**
