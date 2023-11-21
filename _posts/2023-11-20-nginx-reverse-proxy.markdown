---
layout: post
title:  "NGINX Reverse Proxy 反向代理"
date:   2023-11-20 08:00:00 +0800
categories: NGINX
tags: [NGINX, WebSocket, 反向代理]
---

通过 CPU 服务器访问 GPU 服务器

## NGINX  配置文件
```shell
sudo vim /etc/nginx/sites-available/default
```

## 配置反向代理
```conf
server {
    listen 8888;
    server_name cpu1;

    location / {
        proxy_pass http://cpu1:8300/;
    }
}
```

## 配置 WebSocket 反向代理
```conf
server {
    listen 8001;
    server_name cpu1;

    location / {
        proxy_pass http://gpu1:8001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

`proxy_http_version 1.1`，`proxy_set_header Upgrade $http_upgrade`和`proxy_set_header Connection "upgrade"`这些行是为了支持WebSocket连接。

## 配置多个反向代理
```conf
server {
    listen 8888;
    server_name cpu1;

    location /oneapi {
        proxy_pass http://cpu1:8100/;
    }

    location /chatgpt {
        proxy_pass http://cpu1:8300/;
    }

    location /chatbot {
        proxy_pass http://gpu1:8001/;
    }

    location /chatbot-arena {
        proxy_pass http://gpu1:8002/;
    }
}
```

**没有达到目标。服务里面有引用绝对路径的情况，这时候就出现 404 了，这时候就需要配置 `proxy_redirect` 了。**

## 配置负载均衡
```json
```

## 重启
```shell
sudo systemctl restart nginx
```

## 调试
GitHub Copilot: 调试Nginx的一个常见方法是查看其错误日志。Nginx的错误日志通常位于`/var/log/nginx/error.log`，但这可能会根据你的系统和Nginx配置的不同而变化。

你可以使用以下命令查看错误日志：

```shell
sudo tail -f /var/log/nginx/error.log
```

这个命令会显示错误日志的最后几行，并在新的日志条目出现时实时更新。这可以帮助你找出问题的原因。

另外，你也可以尝试增加Nginx的错误日志级别，以获取更详细的信息。你可以在Nginx的配置文件中，将`error_log`指令的级别设置为`debug`。例如：

```nginx
error_log /var/log/nginx/error.log debug;
```

然后，你需要重新加载或重启Nginx以应用新的配置。

请注意，`debug`级别的日志非常详细，可能会占用大量的磁盘空间。因此，你应该只在需要调试问题时使用它，并在问题解决后将日志级别改回原来的设置。

## 日志查看
```shell
sudo tail -f /var/log/nginx/access.log
```
 
## 参考资料
* [NGINX Reverse Proxy](https://docs.nginx.com/nginx/admin-guide/web-server/reverse-proxy/)
* [Nginx专题（1）：Nginx之反向代理及配置](https://college.creditease.cn/detail/321)
* [Nginx专题（2）：Nginx的负载均衡策略及其配置](https://college.creditease.cn/detail/330)
* [Nginx reverse proxy + URL rewrite](https://serverfault.com/questions/379675/nginx-reverse-proxy-url-rewrite)
