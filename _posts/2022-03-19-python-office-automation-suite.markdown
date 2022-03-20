---
layout: post
title:  "Python办公自动化套件"
date:   2022-03-19 00:00:00 +0800
categories: Python
tags: [word, python-docx, excel, openpyxl]
---

## 操作 Word 文档
### 安装依赖库 [python-docx](https://python-docx.readthedocs.io/en/latest/index.html)
```shell
pip install python-docx
```

### 示例
```py
from docx import Document
from docx.shared import Inches

document = Document()

document.add_heading('Document Title', 0)

p = document.add_paragraph('A plain paragraph having some ')
p.add_run('bold').bold = True
p.add_run(' and some ')
p.add_run('italic.').italic = True

document.add_heading('Heading, level 1', level=1)
document.add_paragraph('Intense quote', style='Intense Quote')

document.add_paragraph(
    'first item in unordered list', style='List Bullet'
)
document.add_paragraph(
    'first item in ordered list', style='List Number'
)

document.add_picture('monty-truth.png', width=Inches(1.25))

records = (
    (3, '101', 'Spam'),
    (7, '422', 'Eggs'),
    (4, '631', 'Spam, spam, eggs, and spam')
)

table = document.add_table(rows=1, cols=3)
hdr_cells = table.rows[0].cells
hdr_cells[0].text = 'Qty'
hdr_cells[1].text = 'Id'
hdr_cells[2].text = 'Desc'
for qty, id, desc in records:
    row_cells = table.add_row().cells
    row_cells[0].text = str(qty)
    row_cells[1].text = id
    row_cells[2].text = desc

document.add_page_break()

document.save('demo.docx')
```
![](https://python-docx.readthedocs.io/en/latest/_images/example-docx-01.png)

## 操作 Excel 文档
### 安装依赖库 [openpyxl](https://openpyxl.readthedocs.io/en/stable/)
```shell
pip install openpyxl
```

### 示例
```py
from openpyxl import Workbook
wb = Workbook()

# grab the active worksheet
ws = wb.active

# Data can be assigned directly to cells
ws['A1'] = 42

# Rows can also be appended
ws.append([1, 2, 3])

# Python types will automatically be converted
import datetime
ws['A2'] = datetime.datetime.now()

# Save the file
wb.save("sample.xlsx")
```

## 参考资料
* [python-docx](https://python-docx.readthedocs.io/en/latest/index.html)
* [python-openxml/python-docx](https://github.com/python-openxml/python-docx)
* [OpenPyXL](https://openpyxl.readthedocs.io/en/stable/)
* [Python自动化办公之Word，全网最全看这一篇就够了](https://zhuanlan.zhihu.com/p/317074324)
* [Openpyxl](https://zetcode.com/python/openpyxl/)
