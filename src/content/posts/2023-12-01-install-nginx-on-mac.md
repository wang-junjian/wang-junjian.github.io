---
layout: single
title:  "在 Mac 上安装 NGINX"
date:   2023-12-01 08:00:00 +0800
categories: NGINX
tags: [NGINX, MacBookProM2Max]
---

## 安装
```shell
brew update
brew install nginx
```

## 启动服务
```shell
brew services start nginx
```
```shell
Docroot is: /opt/homebrew/var/www

The default port has been set in /opt/homebrew/etc/nginx/nginx.conf to 8080 so that
nginx can run without sudo.

nginx will load all files in /opt/homebrew/etc/nginx/servers/.

To start nginx now and restart at login:
  brew services start nginx
Or, if you don't want/need a background service you can just run:
  /opt/homebrew/opt/nginx/bin/nginx -g daemon\ off\;
```

- 编辑 `/opt/homebrew/etc/nginx/nginx.conf` 修改端口号
- 编辑 `/opt/homebrew/var/www/index.html` 修改默认页面

## 停止服务
```shell
brew services stop nginx
```

## 重启服务
```shell
brew services restart nginx
```

## 查看服务状态
```shell
brew services info nginx
```
```shell
nginx (homebrew.mxcl.nginx)
Running: ✔
Loaded: ✔
Schedulable: ✘
User: junjian
PID: 60475
```

## 查看服务列表
```shell
brew services list
```
