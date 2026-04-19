---
layout: single
title:  "使用 Python 临时文件模块"
date:   2021-08-02 00:00:00 +0800
categories: Python
tags: [tempfile, f-strings]
---

## file.write() 内容超过 4K 才会写入磁盘
### 验证代码
```py
import os
import tempfile

for count in range(1, 4100):
    content = '0'*count
    with tempfile.NamedTemporaryFile() as file:
        print(file.name)
        file.write(content.encode())

        with open(file.name, 'r') as tf:
            content_len = len(tf.read())
            if content_len > 0:
                print(f'{count} bytes written successfully.')
```

### 运行结果
```
/var/folders/bc/7lz308t90gb1h1xw6k4j65x80000gn/T/tmpj458ozas
/var/folders/bc/7lz308t90gb1h1xw6k4j65x80000gn/T/tmpmrxo8sg1
/var/folders/bc/7lz308t90gb1h1xw6k4j65x80000gn/T/tmp0hu_i4hz
4097 bytes written successfully.
/var/folders/bc/7lz308t90gb1h1xw6k4j65x80000gn/T/tmpdu_tycee
4098 bytes written successfully.
/var/folders/bc/7lz308t90gb1h1xw6k4j65x80000gn/T/tmplbtytgnk
4099 bytes written successfully.
```

### 修复 4K 以内写入磁盘的问题
```py
file.write(content.encode()) 后面加入
file.flush()
```

### 默认 file.close() 临时文件会自动删除
参数 delete 设置为 False 时，关闭文件后不会自动删除
```py
tempfile.NamedTemporaryFile(delete=False)
```

## 参考资料
* [tempfile — Generate temporary files and directories](https://docs.python.org/3/library/tempfile.html)
* [Built-in Functions](https://docs.python.org/3/library/functions.html)
