---
layout: single
title:  "Python 自动生成周报"
date:   2022-03-20 00:00:00 +0800
categories: 周报
tags: [DIY, excel, openpyxl, typer]
---

## 安装依赖库
```shell
pip install typer python-docx
```

## 编写生成个人周报的应用
### 制作个人周报模版 个人周报－{}－{}.xlsx
### 编写应用 weekly.py
```py
import shutil
import openpyxl
import typer

from datetime import datetime, timedelta


def get_weekly_info():
    now = datetime.now()

    # 工作表的标题，格式: yymmdd(周一)-yymmdd(周五)
    monday = now-timedelta(now.weekday())
    friday = monday+timedelta(4)
    sheet_title = '{}-{}'.format(monday.strftime('%y%m%d'), friday.strftime('%y%m%d'))
    
    # 报告日期，格式: yyyy/mm/dd(周四)
    report_date = now.strftime("%Y/%m/%d")
    
    # 计划的开始时间与结束时间
    base_date = datetime(1899, 12, 30, 0, 0)
    work_tasks_begin_time = (monday-base_date).days
    work_tasks_end_time = (friday-base_date).days
    
    # 下周计划
    week_days = 7
    next_work_tasks_begin_time = work_tasks_begin_time + week_days
    next_work_tasks_end_time = work_tasks_end_time + week_days
    
    return sheet_title, report_date, work_tasks_begin_time, work_tasks_end_time, next_work_tasks_begin_time, next_work_tasks_end_time


def generate_weekly(weekly_filename, sheet_title, 
                    reporter, report_date, 
                    work_tasks, work_tasks_begin_time, work_tasks_end_time, 
                    next_work_tasks, next_work_tasks_begin_time, next_work_tasks_end_time):
    book = openpyxl.load_workbook(weekly_filename)
    
    sheet = book.active
    sheet.title = sheet_title
    
    sheet['B2'].value = reporter
    sheet['L2'].value = report_date
    
    sheet['B7'].value = work_tasks
    sheet['F7'].value = work_tasks_begin_time
    sheet['G7'].value = work_tasks_end_time
    
    sheet['B22'].value = next_work_tasks
    sheet['F22'].value = next_work_tasks_begin_time
    sheet['G22'].value = next_work_tasks_end_time
    
    book.save(weekly_filename)


def main(work_tasks: str, next_work_tasks: str, reporter='军舰'):
    weekly_template_filename = '个人周报－{}－{}.xlsx'
    weekly_filename = weekly_template_filename.format(reporter, datetime.now().strftime("%Y%m%d"))
    shutil.copy(weekly_template_filename, weekly_filename)

    sheet_title, report_date, work_tasks_begin_time, work_tasks_end_time, next_work_tasks_begin_time, next_work_tasks_end_time = get_weekly_info()
    generate_weekly(weekly_filename, sheet_title, reporter, report_date, 
        work_tasks, work_tasks_begin_time, work_tasks_end_time, 
        next_work_tasks, next_work_tasks_begin_time, next_work_tasks_end_time)


if __name__ == '__main__':
    typer.run(main)
```

* strftime 日期转字符串
    * '%y%m%d' => '220320'
    * '%Y%m%d' => '20220320'
* strptime 字符串转日期
* datetime.days 获得日期是星期几
* timedelta(days) days=0(周一)...days=6(周日)

## 使用
### 查看帮助
```shell
$ python weekly.py --help
```
```
Usage: weekly.py [OPTIONS] WORK_TASKS NEXT_WORK_TASKS

Arguments:
  WORK_TASKS       [required]
  NEXT_WORK_TASKS  [required]

Options:
  --reporter TEXT                 [default: 军舰]
  --install-completion [bash|zsh|fish|powershell|pwsh]
                                  Install completion for the specified shell.
  --show-completion [bash|zsh|fish|powershell|pwsh]
                                  Show completion for the specified shell, to
                                  copy it or customize the installation.
  --help                          Show this message and exit.
```

### 执行
```shell
python weekly.py "本周任务" "下周任务"
```

修改姓名
```shell
python weekly.py "本周任务" "下周任务" --reporter Warship
```

![](/images/2022/weekly.jpg)

## 参考资料
* [python-openxml/python-docx](https://github.com/python-openxml/python-docx)
* [OpenPyXL](https://openpyxl.readthedocs.io/en/stable/)
* [Typer](https://typer.tiangolo.com)
* [Typer Required CLI Options](https://typer.tiangolo.com/tutorial/options/required/)
* [Openpyxl](https://zetcode.com/python/openpyxl/)
* [How to Work with Excel Spreadsheets in Python](https://pythonexcel.com)
* [Openpyxl Tutorial](https://www.pythonexcel.com/openpyxl.php)
* [openpyxl how to set cell format as Date instead of Custom](https://stackoverflow.com/questions/61948513/openpyxl-how-to-set-cell-format-as-date-instead-of-custom)
