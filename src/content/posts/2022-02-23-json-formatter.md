---
layout: single
title:  "Json Formatter"
date:   2022-02-23 00:00:00 +0800
categories: Command
tags: [Linux, JSON, jq, Python, vim]
---

test.json
```json
{ "stuff": { "that": [1,2,3], "isin": true, "json": "end"}}
```

## jq
### 在命令行运行
```shell
jq . <<< '{ "stuff": { "that": [1,2,3], "isin": true, "json": "end"}}'
```

```shell
jq . test.json
```

### 在vim的命令模式下运行
```shell
%!jq .
```

## python json.tool
### 在命令行运行
```shell
python -m json.tool <<< '{ "stuff": { "that": [1,2,3], "isin": true, "json": "end"}}'
```

```shell
python -m json.tool test.json
```

### 在vim的命令模式下运行
```shell
%!python -m json.tool
```

## 在线格式化
* [Format JSON](https://formatjson.com)
* [JSON Formatter](https://jsononline.net/json-formatter)
* [JSON Formatter, Validator, Viewer, Editor & Beautifier](https://www.jsonformatter.io)
* [Json Formatter - JSToolSet](https://www.jstoolset.com/json-formatter)

## 参考资料
* [JSON command line formatter tool for Linux](https://stackoverflow.com/questions/5243885/json-command-line-formatter-tool-for-linux)
