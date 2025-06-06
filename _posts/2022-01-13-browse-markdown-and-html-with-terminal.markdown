---
layout: single
title:  "使用终端浏览Markdown和HTML"
date:   2022-01-13 00:00:00 +0800
categories: Linux
tags: [apt, lynx, pandoc, grip, Markdown]
---

## 浏览Markdown
```shell
sudo apt install lynx
sudo apt install pandoc

pandoc README.md | lynx -stdin
```

```shell
sudo pip install grip
sudo apt install lynx

grip -b README.md
lynx http://localhost:6419/
```

```shell
sudo apt install pandoc
pandoc README.md -t plain | less
```

## 浏览HTML
```shell
sudo apt install w3m

w3m index.html
```

```shell
sudo apt install lynx
sudo apt install pandoc

pandoc index.html | lynx -stdin
```

```shell
sudo pip install grip

grip -b index.html
```

## 参考资料
* [How can I run a html file from terminal?](https://stackoverflow.com/questions/27760105/how-can-i-run-a-html-file-from-terminal)
* [Markdown Viewer](https://unix.stackexchange.com/questions/4140/markdown-viewer)
* [Four Web Browsers for the Linux Command Line](https://vitux.com/four-web-browsers-for-the-linux-command-line/)
