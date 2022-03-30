---
layout: post
title:  "Python实践"
date:   2021-02-28 00:00:00 +0800
categories: Python 实践
tags: [PYTHONPATH, exec, uuid]
---

* [Python 3 文档](https://docs.python.org/zh-cn/3/)
* [CPython GitHub](https://github.com/python/cpython)

## 语言
### 变量
* 变量的赋值，只是表示让变量指向了某个对象，并不表示拷贝对象给变量；而一个对象，可以被多个变量所指向。
* 可变对象（列表，字典，集合等等）的改变，会影响所有指向该对象的变量。
* 对于不可变对象（字符串、整型、元组等等），所有指向该对象的变量的值总是一样的，也不会改变。但是通过某些操作（+= 等等）更新不可变对象的值时，会返回一个新的对象。
* 变量可以被删除，但是对象无法被删除。

### 函数参数传递
Python 里所有的数据类型都是对象，所以参数传递时，只是让新变量与原变量指向相同的对象而已，并不存在值传递或是引用传递一说。

* 不可变参数
```py
>>> def func(x):
...     x=2
... 
>>> n=1
>>> func(n)
>>> n
1
```

* 可变参数
```py
>>> def func(x):
...     x.append(2)
... 
>>> l=[1]
>>> func(l)
>>> l
[1, 2]
```

* 最佳实践（不管参数是可变还是不可变，明确地返回值。）
```py
>>> def func(x):
...     pass
...     return x
... 
>>> n=1
>>> n = func(n)
>>> n
1
```

### == 和 is
```==``` 比较值；```is``` 比较对象的 ID。通过函数 id(name) 可以获得对象的标识。

出于对性能优化的考虑，Python 内部会对 -5 到 256 的整型维持一个数组，起到一个缓存的作用。这样，每次试图创建一个 -5 到 256 范围内的整型数字时，Python 都会从这个数组中返回相对应的引用，而不是重新开辟一块新的内存空间。如果整型数字超出了这个范围，Python 则会每次使用都使用新的内存区域。
```py
>>> n=10
>>> m=10
>>> n == m
True
>>> n is m
True
```

```py
>>> n=257
>>> m=257
>>> n == m
True
>>> n is m
False
```

比较操作符 ```is``` 的速度效率，通常要优于 ```==```。因为 ```is``` 操作符不能被重载，这样，Python 就不需要去寻找，程序中是否有其他地方重载了比较操作符，并去调用。执行比较操作符 ```is```，就仅仅是比较两个变量的 ID 而已。但是 ```==``` 操作符却不同，执行 a == b 相当于是去执行 ```a.__eq__(b)```，而 Python 大部分的数据类型都会去重载 ```__eq__``` 这个函数，其内部的处理通常会复杂一些。比如，对于列表，```__eq__``` 函数会去遍历列表中的元素，比较它们的顺序和值是否相等。

对于不可变（immutable）的变量，如果我们之前用 ```==``` 或者 ```is``` 比较过，结果是不是就一直不变了呢？不是的。这里使用元组(tuple)类型看一下，元组类型是不可变的，但是里面的元素列表对象是可变的。
```py
>>> t1 = (1, 2, [3, 4])
>>> t2 = (1, 2, [3, 4])
>>> t1 == t2
True
>>> t1[-1].append(5)
>>> t1
(1, 2, [3, 4, 5])
>>> t1 == t2
False
```

### 浅拷贝与深拷贝
* 浅拷贝：重新分配内存，生成新的对象，里面的元素是原对象中子对象的引用，对于不可变（immutable）的对象不是对象的引用。
* 深拷贝：重新分配内存，生成新的对象，将原对象中的元素以递归的方式全部拷贝。深拷贝中会维持一个字典，记录已经拷贝的对象以及对象的ID，防止出现无限递归。

### 装饰器
#### 函数装饰器
1. 实现函数装饰器
    ```py
    def func_decorator(func):
        def wrapper():
            print('wrapper of decorator')
            func()

        return wrapper

    def hello():
        print('Hello ')

    hello = func_decorator(hello)
    hello()
    ```
    ```
    wrapper of decorator
    Hello 
    ```

2. 使用 ```@``` 语法替代手动赋值
    ```py
    def func_decorator(func):
        def wrapper():
            print('wrapper of decorator')
            func()

        return wrapper

    @func_decorator
    def hello():
        print('Hello ')

    hello()
    ```
    ```
    wrapper of decorator
    Hello 
    ```

3. 带参数的函数
    ```py
    def func_decorator(func):
        def wrapper(name):
            print('wrapper of decorator')
            func(name)

        return wrapper

    @func_decorator
    def hello(name):
        print('Hello {}'.format(name))

    hello('World')
    ```
    ```
    wrapper of decorator
    Hello World
    ```

4. 带任意参数的函数
    ```py
    def func_decorator(func):
        def wrapper(*args, **kwargs):
            print('wrapper of decorator')
            func(*args, **kwargs)

        return wrapper

    @func_decorator
    def hello(name):
        print('Hello {}'.format(name))

    @func_decorator
    def my_sum(*args, **kwargs):
        total = 0
        if args:
            for arg in args:
                if type(arg) is list:
                    total += sum(arg)
                else:
                    total += arg
        elif kwargs:
            for _, v in kwargs.items():
                total += v
        print('Sum = {}'.format(total))

    hello('World')

    my_sum(1,2,3,4)
    my_sum([1,2,3,4])
    my_sum(x1=1, x2=2, x3=3, x4=4)
    my_sum(**{'x1':1, 'x2':2, 'x3':3, 'x4':4})
    ```
    ```
    wrapper of decorator
    Hello World
    wrapper of decorator
    Sum = 10
    wrapper of decorator
    Sum = 10
    wrapper of decorator
    Sum = 10
    wrapper of decorator
    Sum = 10
    ```

5. 如何保障装饰后还是原函数

    经装饰后的函数，就不是原函数了，这可能并不是我们想看到的。

    ```py
    def func_decorator(func):
        def wrapper(*args, **kwargs):
            print('wrapper of decorator')
            func(*args, **kwargs)

        return wrapper

    @func_decorator
    def hello(name):
        print('Hello {}'.format(name))

    print(hello.__name__)
    print(help(hello))
    ```
    ```
    wrapper
    Help on function wrapper in module __main__:
    wrapper()
    ```

    使用内置的装饰器 @functools.wrap，它会将原函数的元信息，拷贝到对应的装饰器函数里。

    ```py
    import functools

    def func_decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            print('wrapper of decorator')
            func(*args, **kwargs)

        return wrapper

    @func_decorator
    def hello(name):
        print('Hello {}'.format(name))

    print(hello.__name__)
    print(help(hello))
    ```
    ```
    hello
    Help on function hello in module __main__:
    hello()
    ```

#### 类装饰器
```py
class Count:
    def __init__(self, func):
        self.func = func
        self.call_num = 0

    def __call__(self, *args, **kwargs):
        self.call_num += 1
        print('Count call number: {}'.format(self.call_num))
        self.func(*args, **kwargs)

@Count
def hello():
    print('Hello World')

hello()
hello()
```
```
Count call number: 1
Hello World
Count call number: 2
Hello World
```

#### 装饰器的嵌套
```py
import functools

def func_decorator1(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        print('wrapper of decorator1')
        func(*args, **kwargs)

    return wrapper

def func_decorator2(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        print('wrapper of decorator2')
        func(*args, **kwargs)

    return wrapper

@func_decorator1
@func_decorator2
def hello(name):
    print('Hello {}'.format(name))

hello('World')
```
```
wrapper of decorator1
wrapper of decorator2
Hello World
```

#### 装饰器用法
* 身份认证
* 日志记录
* 输入合理性检查
* 缓存

下面是记录函数使用时间的装饰器

```py
import time
import functools

def use_time(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        start = time.perf_counter()
        res = func(*args, **kwargs)
        end = time.perf_counter()
        print('function: {} use time {} ms'.format(func.__name__, (end - start) * 1000))
        return res
    return wrapper
    
@use_time
def fib(n):
    a,b = 1,1
    for _ in range(n-1):
        a,b = b,a+b
    return a

fib(100)
```
```
function: fib use time 0.01016499999999948 ms
```

### metaclass
任何类型的基类都是 type。

### 迭代器
迭代器（iterator）提供了一个 next 的方法。调用这个方法后，获得容器的下一个对象，如果没有对象了会抛出 StopIteration 异常。
```py
it = iter([1, 2])
print(it)
print(next(it))
print(next(it))

try:
    print(next(it))
except StopIteration:
    print('StopIteration')
```
```
<list_iterator object at 0x1056542b0>
1
2
StopIteration
```

### 生成器
用小括号 ```()``` 括起来
```py
nums = (n for n in range(1, 3))
print(nums)
print(list(nums))
next(nums)
```
```
<generator object <genexpr> at 0x10447d930>
[1, 2]
Traceback (most recent call last):
  File "/examples.py", line 11, in <module>
    next(nums)
StopIteration
```

#### yield
调用 next() 函数，yield 会返回值，然后挂起等待，当下一次调用 next() 函数，接着 yield 下面的语句继续执行。
```py
def generator():
    n = 1
    while True:
        yield n
        n += 1

nums = generator()
for _ in range(3):
    n = next(nums)
    print(n)
```

#### 例子
给定两个序列，判定第一个是不是第二个的子序列。序列就是列表，子序列则指的是，一个列表的元素在第二个列表中都按顺序出现，但是并不必挨在一起。举个例子，[1, 3, 5] 是 [1, 2, 3, 4, 5] 的子序列，[1, 4, 3] 则不是。
```py
def is_subsequence(a, b):
    b = iter(b)
    return all(i in b for i in a)

print(is_subsequence([1, 3, 5], [1, 2, 3, 4, 5]))
print(is_subsequence([1, 4, 3], [1, 2, 3, 4, 5]))
```
```
True
False
```

## 模块
### import
解释器导入模块时，会通过特定的路径列表来查找，通过 sys.path 可以看到这个路径列表。
```py
>>> import sys
>>> sys.path
['', '/usr/lib/python38.zip', '/usr/lib/python3.8', '/usr/lib/python3.8/lib-dynload', '/home/lnsoft/.local/lib/python3.8/site-packages', '/usr/local/lib/python3.8/dist-packages', '/usr/lib/python3/dist-packages']
```

在运行程序前，可以通过配置环境变量 ```PYTHONPATH```，在运行程序后自动加入路径列表中。

```shell
export PYTHONPATH=/InferenceServing/app:$PYTHONPATH
python3
```

```py
>>> import sys
>>> sys.path
['', '/InferenceServing/app', '/usr/lib/python38.zip', '/usr/lib/python3.8', '/usr/lib/python3.8/lib-dynload', '/home/lnsoft/.local/lib/python3.8/site-packages', '/usr/local/lib/python3.8/dist-packages', '/usr/lib/python3/dist-packages']
```

### ```__init__.py```
在 Python 2 的规范中，需要在模块所在的文件夹新建一个 ```__init__.py```，内容可以为空，也可以用来表述包对外暴露的模块接口。在 Python 3 规范中，```__init__.py``` 并不是必须的。

## 协程
* import asyncio 实现协程所需工具
* async 声明异步函数。调用异步函数，便可得到一个协程对象（coroutine object）。
* asyncio.run(main()) 作为主程序的入口函数，在程序运行周期内，只调用一次 asyncio.run。
* asyncio.create_task 创建任务，进入事件循环等待运行。
* await asyncio.gather(*tasks) 等待所有任务完成。

```py
import asyncio
import time


async def sleep(id, second):
    print(f'id: {id} sleep {second}.')
    await asyncio.sleep(second)
    print(f'id: {id} end.')


async def main(seconds):
    tasks = [asyncio.create_task(sleep(id, second)) for id, second in enumerate(seconds)]
    await asyncio.gather(*tasks)


begin = time.time()
asyncio.run(main([1, 2, 3, 4]))
use_time = time.time()-begin
print(f'Use time: {use_time:.4f}!')
```
```
id: 0 sleep 1.
id: 1 sleep 2.
id: 2 sleep 3.
id: 3 sleep 4.
id: 0 end.
id: 1 end.
id: 2 end.
id: 3 end.
Use time: 4.0030!
```

通过执行下面的代码来了解相关的异步函数的执行流程。
```py
import asyncio

async def worker_1():
    print('* worker_1 start')
    await asyncio.sleep(1)
    print('* worker_1 done')

async def worker_2():
    print('- worker_2 start')
    await asyncio.sleep(2)
    print('- worker_2 done')

async def main():
    task1 = asyncio.create_task(worker_1())
    task2 = asyncio.create_task(worker_2())

    await asyncio.sleep(3)

    print('before await')
    await task1
    print('awaited worker_1')
    await task2
    print('awaited worker_2')

asyncio.run(main())
```
```
* worker_1 start
- worker_2 start
* worker_1 done
- worker_2 done
before await
awaited worker_1
awaited worker_2
```

return_exceptions=True，如果不设置这个参数，就会抛出（throw）异常，从而需要捕捉（try except），这就意味着其它还没被执行的任务会被全部取消掉。
```py
import asyncio

async def worker_1():
    print('* worker_1 start')
    await asyncio.sleep(1)
    print('* worker_1 done')

async def worker_2():
    print('- worker_2 start')
    await asyncio.sleep(2)
    print('- worker_2 done')

async def main():
    task1 = asyncio.create_task(worker_1())
    task2 = asyncio.create_task(worker_2())

    await asyncio.sleep(0.5)
    task2.cancel()

    res = await asyncio.gather(task1, task2, return_exceptions=True)
    print(res)

asyncio.run(main())
```
```
* worker_1 start
- worker_2 start
* worker_1 done
[None, CancelledError()]
```

## 库
### 时间（[strftime][strftime]）
```py
from datetime import datetime

now = datetime.now()
str = now.strftime("%Y-%m-%d %H:%M:%S")

print(str)
```
```
2021-08-18 07:39:22
```

### UUID
生成随机UUID
```py
import uuid

myuuid = uuid.uuid4()
print(str(myuuid))
```
```
f9e5d7c7-a708-4f2a-9a8b-5a42ca5e2e83
```

UUID字符串转成UUID对象
```py
import uuid

uuid.UUID('f9e5d7c7-a708-4f2a-9a8b-5a42ca5e2e83')
```

## 工程
### 配置项目的根路径
在一个 Virtual Environment 里，在 activate 文件的末尾配置 PYTHONHOME。
```
export PYTHONPATH="您的工程路径"
```

每次当您通过 activate 激活这个运行时环境的时候，它就会自动将项目的根路径添加到搜索路径中去。

### ```if __name__ == '__main__'```
运行 Python 脚本的第一个脚本的 ```__name__``` 值为 ```__main__```，在脚本中使用 import 语句时，```__name__``` 就会被赋值为该模块的名字了，这样导入进来的模块语句将不会执行。

### 指定要执行的命令
* 单语句
```shell
python -c "print('Hello World')"
```

* 多语句(使用;分割)
```shell
python -c "import time;time.sleep(1)"
```

* 带缩行的语句
```shell
python -c "exec('import time\\ntry:  time.sleep(1)\\nexcept:  pass\\n')"
```

可以把语句直接写到 test.py 文件。
```py
import time
try:
  time.sleep(1)
except:
  pass
```

通过读取文件来执行源代码
```shell
python -c "exec(open('test.py').read())"
```


[strftime]: https://www.programiz.com/python-programming/datetime/strftime

## 参考资料
* [Generate a UUID in Python](https://www.uuidgenerator.net/dev-corner/python)
