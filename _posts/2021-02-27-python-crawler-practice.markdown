---
layout: post
title:  "Python爬虫实践"
date:   2021-02-27 00:00:00 +0800
categories: Python 实践
tags: [crawler]
---

## HTTP Status Code
### [418 I'm a teapot](https://developer.mozilla.org/zh-TW/docs/Web/HTTP/Status/418)
```py
import requests

url = "https://movie.douban.com/cinema/later/beijing/"
page = requests.get(url)
print(page.status_code)
```
```
418
```

在头信息中加入 User-Agent 来解决。在 Safari 浏览器中通过选择菜单[开发]->[显示JavaScript控制台]，然后选择[网络]->[文稿]->[标头]，在内容里的[请求]节可以找到 User-Agent。
![](/images/2021/safari/javascript-console.png)
```py
import requests

url = "https://movie.douban.com/cinema/later/beijing/"
headers = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Safari/605.1.15'}
page = requests.get(url, headers=headers)
print(page.status_code)
```
```
200
```
