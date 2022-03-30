---
layout: post
title:  "OpenResty 内执行 Lua 脚本"
date:   2022-02-18 00:00:00 +0800
categories: Nginx
tags: [OpenResty, Nginx, Lua, Docker, inspect, jq, curl]
---

> OpenResty 是一款基于 NGINX 和 LuaJIT 的 Web 平台。

## 拉取 OpenResty 镜像
* Ubuntu
```shell
sudo docker pull openresty/openresty:xenial
```
* CentOS
```shell
sudo docker pull openresty/openresty:centos
```

查看镜像的标签
```shell
$ sudo docker inspect openresty/openresty:centos | jq '.[].Config.Labels'
```
```js
{
  "maintainer": "Evan Wies <evan@neomantra.net>",
  "org.label-schema.build-date": "20210915",
  "org.label-schema.license": "GPLv2",
  "org.label-schema.name": "CentOS Base Image",
  "org.label-schema.schema-version": "1.0",
  "org.label-schema.vendor": "CentOS",
  "resty_image_base": "centos",
  "resty_image_tag": "8",
  "resty_luarocks_version": "3.8.0",
  "resty_rpm_arch": "x86_64",
  "resty_rpm_dist": "el8",
  "resty_rpm_flavor": "",
  "resty_rpm_version": "1.19.9.1-1",
  "resty_yum_repo": "https://openresty.org/package/centos/openresty.repo"
}
```

## 编辑配置文件
```shell
$ vim nginx.conf
```
```conf
server {
    listen       80;
    server_name  localhost;

    location / {
        content_by_lua_block {
            ngx.say('# var host> '..ngx.var.host)
            ngx.say('# var request_uri> '..ngx.var.request_uri)
        }

        set_by_lua_block $host_str {
            local host = ngx.var.host

            local uuid = string.match(ngx.var.request_uri, '^/(%w+)/inference')
            if uuid ~= nil then
                host = uuid..'.apitest.dubhe.ai'
            end

            return host
        }

        add_header Host $host_str;

        root   /usr/local/openresty/nginx/html;
        index  index.html index.htm;
    }

    error_page   500 502 503 504  /50x.html;
    location = /50x.html {
        root   /usr/local/openresty/nginx/html;
    }
}
```

* add_header 设置响应头
* proxy_set_header 设置传递给代理服务器的请求头
* 每次讲求都会执行 set_by_lua_block 和 content_by_lua_block

### Lua 语法
#### 定义变量（local）
```lua
local var
```

#### 字符串连接（..）
```lua
str1..str2
```

#### 不等于（~=）
```lua
uuid ~= nil
```

#### 条件语句（if）
```lua
if condition then
end
```

#### 正则匹配（string.match）
```lua
string.match(str, pattern)
```

## 运行 OpenResty
```shell
sudo docker run -it --rm -p 80:80 -v `pwd`/nginx.conf:/etc/nginx/conf.d/default.conf openresty/openresty:xenial
```

## 测试
```shell
$ curl localhost/0ec2bde743d547a7a7d1ea5043230c69/inference/ -v
```
```
*   Trying ::1...
* Connected to localhost (::1) port 80 (#0)
> GET /0ec2bde743d547a7a7d1ea5043230c69/inference/ HTTP/1.1
> Host: localhost
> User-Agent: curl/7.47.0
> Accept: */*
>
< HTTP/1.1 200 OK
< Server: openresty/1.15.8.3
< Date: Fri, 18 Feb 2022 00:54:26 GMT
< Content-Type: application/octet-stream
< Transfer-Encoding: chunked
< Connection: keep-alive
< Host: 0ec2bde743d547a7a7d1ea5043230c69.apitest.dubhe.ai
<
# var host> localhost
# var request_uri> /0ec2bde743d547a7a7d1ea5043230c69/inference/
* Connection #0 to host localhost left intact
```

## 参考资料
* [OpenResty](https://openresty.org/cn/)
* [openresty/lua-nginx-module](https://github.com/openresty/lua-nginx-module)
* [NGINX Variables](https://www.javatpoint.com/nginx-variables)
* [Nginx Lua regex match first word](https://www.jscodetips.com/index.php/examples/nginx-lua-regex-match-first-word)
* [OpenResty Reference - Lua Nginx Module Directives](https://openresty-reference.readthedocs.io/en/latest/Directives/)
* [How to Use the OpenResty Web Framework for Nginx on Ubuntu 16.04](https://www.digitalocean.com/community/tutorials/how-to-use-the-openresty-web-framework-for-nginx-on-ubuntu-16-04)
* [Is it possible to have live reloading of lua scripts using openresty and docker?](https://stackoverflow.com/questions/62687216/is-it-possible-to-have-live-reloading-of-lua-scripts-using-openresty-and-docker)
* [docker-openresty/centos/Dockerfile](https://github.com/openresty/docker-openresty/blob/master/centos/Dockerfile)
* [docker-openresty - Docker tooling for OpenResty](https://github.com/openresty/docker-openresty/blob/master/README.md)
* [A Regular Expression Tester for NGINX and NGINX Plus](https://www.nginx.com/blog/regular-expression-tester-nginx/)
* [Nginx location regex examples](https://linuxhint.com/nginx-location-regex-examples/)
* [Creating NGINX Rewrite Rules](https://www.nginx.com/blog/creating-nginx-rewrite-rules/)
