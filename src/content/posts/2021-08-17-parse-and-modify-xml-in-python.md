---
layout: single
title:  "在 Python 中解析和修改 XML"
date:   2021-08-17 00:00:00 +0800
categories: Python
tags: [Python, XML]
---

## XML 数据
```xml
xml_data = '''<?xml version="1.0" encoding="UTF-8"?>
<books>
    <book SN="12460901">
        <name>国富论</name>
        <author nation="English">亚当·斯密</author>
        <price>108</price>
        <ISBN>9787511373229</ISBN>
    </book>
    <book SN="12257413">
        <name>原则</name>
        <author nation="America">瑞·达利欧</author>
        <price>98</price>
        <ISBN>9787508684031</ISBN>
    </book>
</books>
'''
```

## xml.etree.ElementTree
### 导入
```py
import xml.etree.ElementTree as ET
```

### 读取 XML 数据
#### 文件读取
```py
with open(xml_file) as file:
    root = ET.parse(file)
```

#### 字符串读取
```py
root = ET.fromstring(xml_data)
```

### 标签名
```py
root.tag
```
```
books
```

### 元素文本
```py
root.find('book/name').text
```
```
国富论
```
* find 找到的第一个元素

### 属性值
```py
root.find('book/author').get('nation')
root.find('book/author').attrib['nation']
```
```
English
English
```

### 通过路径选择元素
```py
root.find('book/author')
```
```
<Element 'author' at 0x126d290e8>
```

### 通过属性选择元素
```py
root.find('book/[@SN="12257413"]')
```
```
<Element 'book' at 0x11ee431d8>
```

### 找到所有的元素
```py
for book in root.findall('book'):
    name = book.findtext('name')
```
```
国富论
原则
```

### 获得元素下面的所有子元素
```py
for book in root.getchildren():
    print(book)
```
```
<Element 'book' at 0x11de5e048>
<Element 'book' at 0x11de5e1d8>
```

### 遍历所有的元素
```py
for name in root.iter('name'):
    print(name.text)
```
```
国富论
原则
```

### 示例
```py
import xml.etree.ElementTree as ET

root = ET.fromstring(xml_data)
for book in root.findall('book'):
    SN = book.get('SN')
    name = book.findtext('name')
    author = book.find('author')
    author_name = author.text
    author_nation = author.get('nation')
    price = book.findtext('price')
    ISBN = book.findtext('ISBN')

    book_str = f'Book Name: {name} SN={SN}\n Author Name: {author_name}, Nation: {author_nation}\n Price: {price}\n ISBN: {ISBN}'
    print(book_str)
```
```
Book Name: 国富论 SN=12460901
 Author Name: 亚当·斯密, Nation: English
 Price: 108
 ISBN: 9787511373229
Book Name: 原则 SN=12257413
 Author Name: 瑞·达利欧, Nation: America
 Price: 98
 ISBN: 9787508684031
```

## 参考资料
* [Edit XML file text based on path](https://stackoverflow.com/questions/29382104/edit-xml-file-text-based-on-path)
* [How to Parse and Modify XML in Python?](https://www.edureka.co/blog/python-xml-parser-tutorial/)
* [untangle XML parsing](https://docs.python-guide.org/scenarios/xml/)
* [XML parsing in Python?](https://www.tutorialspoint.com/xml-parsing-in-python)
