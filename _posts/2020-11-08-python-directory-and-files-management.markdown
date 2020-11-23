---
layout: post
title:  "Python Directory and Files Management"
date:   2020-11-08 00:00:00 +0800
categories: Python
tags: [Python, Directory, File, Path]
---

## 导入包
```python
>>> import os
>>> import shutil
```

## 目录

### 拷贝目录树
```python
>>> shutil.copytree('/home/python/test', '/home/python/test_bak')
```

### 新建目录
* 单级目录
```python
>>> os.mkdir('python')
```

* 多级目录
```python
>>> os.makedirs('dirs/sub_dir')
```

### 修改目录名
> 只能修改叶子节点，有无文件都可以。
```python
>>> os.rename('dir', 'new_dir')
```

### 读取目录信息
* 当前目录
```python
>>> os.getcwd()
'/home/python'
```

* 列出文件和目录
```python
>>> os.listdir('/home/python')
['app', 'config', 'main.py', 'test']
```

### 删除目录
* 空目录
```python
>>> os.rmdir('test')
```

* 多级目录
```python
>>> shutil.rmtree('/home/python')
```

## 文件

### 拷贝文件
> 目录路径可以是目录名
```python
>>> shutil.copy('/home/python/main.py', '/home/python/main.py.bak')
>>> shutil.copy('/home/python/main.py', '/home/python/bak/')
```

### 创建文件
* 方法1
```python
open(filename, 'w').close()
```

* 方法2
```python
def touch(path):
    with open(path, 'a'):
        os.utime(path, None)
```

* 方法3
> OS X需要root特权
```python
os.mknod(filename)
```

### 
```python
```

### 删除文件
```python
>>> os.remove('/home/python/main.py')
```

## 路径

### 文件名
```python
>>> os.path.basename('/home/python/main.py')
'main.py'
>>> os.path.basename('/home/python')
'python'
>>> os.path.basename('/home/python/')
''
```

### 目录名
```python
>>> os.path.dirname('/home/python/main.py')
'/home/python'
>>> os.path.dirname('/home/python')
'/home'
>>> os.path.dirname('/home/python/')
'/home/python'
```

### 路径是否存在
```python
>>> os.path.exists('/home/python')
True
```

### 分离扩展名
```python
>>> os.path.splitext('main.py')
('main', '.py')
```

## 参考资料
* [Create empty file using python](https://stackoverflow.com/questions/12654772/create-empty-file-using-python)
* [Python Directory and Files Management](https://www.programiz.com/python-programming/directory)
* [Python : How to copy files from one location to another using shutil.copy()](https://thispointer.com/python-how-to-copy-files-from-one-location-to-another-using-shutil-copy/)
* [Print string to text file](https://stackoverflow.com/questions/5214578/print-string-to-text-file)
