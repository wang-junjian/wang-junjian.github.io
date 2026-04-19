---
layout: single
title:  "使用 Python 自动进行工作量估算"
date:   2022-07-13 00:00:00 +0800
categories: 工作量估算
tags: [DIY, excel, openpyxl, typer]
---

## 安装依赖库
```shell
pip install typer python-docx
```

## 编写脚本 workload-evaluation.py
```py
import os
import logging
import shutil
import random
import zipfile
import openpyxl
import typer

from copy import copy
from openpyxl.utils import rows_from_range


# 日志设置
logger = logging.getLogger()
logger.setLevel(logging.DEBUG)

## 文件输出
file_handler = logging.FileHandler("log.txt")
file_handler.setLevel(logging.DEBUG)

## 控制台输出
stream_handler = logging.StreamHandler()
stream_handler.setLevel(logging.DEBUG)

formatter = logging.Formatter("%(asctime)s - %(levelname)s - %(message)s",datefmt="%Y-%m-%d %H:%M:%S")
file_handler.setFormatter(formatter)
stream_handler.setFormatter(formatter)

logger.addHandler(file_handler)
logger.addHandler(stream_handler)


def evaluation(excel_file):
    table_title_row = 2

    book = openpyxl.load_workbook(excel_file)
    for sheet_title in book.sheetnames:
        sheet = book[sheet_title]

        WORKLOAD_EVAL_CELL_RANGE = f'A1:L2'
        workload_eval_cell = _find_cell_in_sheet(sheet, '工作量估算（人天）', rows_from_range(WORKLOAD_EVAL_CELL_RANGE))
        if workload_eval_cell:
            workload_eval_cell_col = workload_eval_cell[0]
            table_title_row = int(workload_eval_cell[1:])
        else:
            continue

        fee_cell = _find_cell_in_sheet(sheet, '费用（万元）', rows_from_range(WORKLOAD_EVAL_CELL_RANGE))
        if fee_cell:
            target_cell = _right_cell(fee_cell)
            target_cell_col = target_cell[0]
        else:
            continue

        TOTAL_CELL_RANGE = f'A1:B200'
        total_cell = _find_cell_in_sheet(sheet, '合计', rows_from_range(TOTAL_CELL_RANGE))
        if total_cell:
            total_cell_row = int(total_cell[1:])
        else:
            continue

        # 拷贝单元值（包括样式）
        for row in range(table_title_row, total_cell_row+1):
            source_cell = sheet[f'{workload_eval_cell_col}{row}']
            target_cell = sheet[f'{target_cell_col}{row}']
            _copy_cell(source_cell, target_cell)

        # 设置合计公式
        target_cell.value = f'=SUM({target_cell_col}{table_title_row+1}:{target_cell_col}{total_cell_row-1})'

        # 修改工作量
        total_change_value = 0
        for row in range(table_title_row+1, total_cell_row):
            target_cell = sheet[f'{target_cell_col}{row}']
            change_value = _change_cell_value(target_cell)
            total_change_value += change_value
        
        if total_change_value:
            logger.info(f'🎚 工作表 [{sheet_title}] 微调工作量 [-{total_change_value}]')

    book.save(excel_file)
    book.close()


def _find_cell_in_sheet(sheet, cell_value, range):
    for row in range:
        for cell in row:
            if sheet[cell].value == cell_value:
                return cell
    return None


def _right_cell(cell):
    if len(cell) < 2 :
        return cell
    return chr(ord(cell[0])+1)+cell[1]


def _copy_cell(source_cell, target_cell):
    target_cell.value = source_cell.value

    # 复制单元格样式
    if source_cell.has_style:
        target_cell._style = copy(source_cell._style)
        target_cell.font = copy(source_cell.font)
        target_cell.border = copy(source_cell.border)
        target_cell.fill = copy(source_cell.fill)
        target_cell.number_format = copy(source_cell.number_format)
        target_cell.protection = copy(source_cell.protection)
        target_cell.alignment = copy(source_cell.alignment)


def _change_cell_value(cell):
    # 最低值
    LOWER_VALUE = 50
    value = cell.value
    if not value or (not type(value)==int) or value < LOWER_VALUE:
        return 0

    # 1/N 的概率
    N = 5
    if random.randint(0, N-1):
        return 0

    # 随机减值
    RATIO = 0.02    # 百分比
    if value > 100:
        RATIO = 0.03

    change_value = round(value*RATIO)
    value -= change_value
    cell.value = value

    return change_value


def _not_evaluation(filename):
    FILTER_WORDS = ['（竞争性）', '公司要求）']
    for word in FILTER_WORDS:
        if word in filename:
            return True

    return False


def get_file_paths(path):
    paths = []
    for filename in os.listdir(path):
        paths.append(os.path.join(path, filename))

    return paths


def zip_files(files, zip_filename):
    zip = zipfile.ZipFile(zip_filename, 'w', zipfile.ZIP_DEFLATED)
    for file in files:
        zip.write(file)
    zip.close()


def main(source_dir: str, target_dir: str):
    if os.path.exists(target_dir):
        shutil.rmtree(target_dir)

    os.makedirs(target_dir)

    for filename in os.listdir(source_dir):
        source_path = os.path.join(source_dir, filename)
        target_path = os.path.join(target_dir, filename)
        shutil.copy(source_path, target_path)

        if _not_evaluation(filename):
            logger.info(f'🚫 不需要评估：{target_path}')
        else:
            logger.info(f'😀 工作量评估：{target_path}')
            evaluation(target_path)

    files = get_file_paths(target_dir)
    zip_file = f'{target_dir}.zip'
    logger.info(f'🧰 创建压缩文件 {zip_file}')
    zip_files(files, zip_file)


if __name__ == '__main__':
    typer.run(main)
```

## 查看帮助
```shell
$ python workload-evaluation.py --help
```
```
Usage: workload-evaluation.py [OPTIONS] SOURCE_DIR TARGET_DIR

Arguments:
  SOURCE_DIR  [required]
  TARGET_DIR  [required]
```

## 参考资料
* [python-openxml/python-docx](https://github.com/python-openxml/python-docx)
* [OpenPyXL](https://openpyxl.readthedocs.io/en/stable/)
* [Typer](https://typer.tiangolo.com)
* [Typer Required CLI Options](https://typer.tiangolo.com/tutorial/options/required/)
* [Openpyxl](https://zetcode.com/python/openpyxl/)
* [How to Work with Excel Spreadsheets in Python](https://pythonexcel.com)
* [Openpyxl Tutorial](https://www.pythonexcel.com/openpyxl.php)
* [openpyxl how to set cell format as Date instead of Custom](https://stackoverflow.com/questions/61948513/openpyxl-how-to-set-cell-format-as-date-instead-of-custom)
* [openpyxl使用样式](https://www.osgeo.cn/openpyxl/styles.html)
* [python: openpyxl带格式复制excel](https://www.cnblogs.com/KeenLeung/p/14101049.html)
* [openpyxl 复制cell单元格包括所有样式](https://blog.csdn.net/a1053904672/article/details/98683741)
* [python办公自动化——压缩文件夹](https://zhuanlan.zhihu.com/p/355219471)
* [python openpyxl引用excel公式函数](https://blog.csdn.net/dayDreamer612/article/details/115379360)
* [Python choice() 函数](https://www.runoob.com/python/func-number-choice.html)
* [python logging将日志同时输出到文件和终端](https://www.cnblogs.com/pfeiliu/p/14587422.html)
* [关于python：openpyxl-“复制/粘贴”单元格范围](https://www.codenong.com/49518071/)
* [emoji符号大全](https://emoji6.com/emojiall/)
