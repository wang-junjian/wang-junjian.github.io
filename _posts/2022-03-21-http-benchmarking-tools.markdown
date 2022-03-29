---
layout: post
title:  "HTTP 基准测试工具"
date:   2022-03-21 08:00:00 +0800
categories: 测试
tags: [wrk, ab, make, nproc]
---

## wrk
wrk 使用的是 HTTP/1.1

### 安装
需要从 GitHub 上克隆代码自己编译，编译前需要安装 git, gcc。
```shell
git clone https://github.com/wg/wrk.git
cd wrk
#使用多线程（机器的处理器核数）加速编译，
make -j $(nproc)
cp wrk /usr/local/bin/
```

### 测试
#### 10 个线程，保持打开 100 个并发连接，持续 10 秒。
```shell
wrk -t10 -c100 -d10 http://www.baidu.com/
```
```
Running 10s test @ http://www.baidu.com/
  10 threads and 100 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency   138.46ms  219.05ms   1.89s    92.11%
    Req/Sec   128.07     79.83   700.00     94.40%
  12776 requests in 10.02s, 128.22MB read
  Socket errors: connect 0, read 57, write 0, timeout 3
Requests/sec:   1275.30
Transfer/sec:     12.80MB
```

#### 打印详细的延时分布信息
```shell
wrk -c10 -t4 --latency http://www.baidu.com/
```
```
Running 10s test @ http://www.baidu.com/
  4 threads and 10 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency    19.43ms    4.15ms 140.84ms   98.11%
    Req/Sec   103.13     10.00   121.00     75.75%
  Latency Distribution
     50%   18.64ms
     75%   19.05ms
     90%   21.04ms
     99%   27.75ms
  4110 requests in 10.01s, 41.14MB read
  Socket errors: connect 0, read 12, write 0, timeout 0
Requests/sec:    410.59
Transfer/sec:      4.11MB
```

### 不同的 HTTP 请求
#### 发起 GET 请求（带查询参数）
```shell
wrk -c10 -t10 "http://127.0.0.1:8000/users?name=wjj&age=30"
```
**URL 需要双引号，不然 &age=30 不会发送。**

#### 使用 POST 方式发送 键值 数据
##### Lua 脚本：post_x.lua
```lua
wrk.method = "POST"
wrk.body   = "name=wjj&age=40"
wrk.headers["Content-Type"] = "application/x-www-form-urlencoded"
```

##### 测试
```shell
wrk -c1 -t1 -d1 -s post_x.lua  "http://127.0.0.1:8000/users"
```

#### 使用 POST 方式发送 JSON 数据
##### Lua 脚本：post_json.lua
```lua
wrk.method = "POST"
wrk.body   = "{\"name\": \"wjj\", \"age\": 40}"
wrk.headers["Content-Type"] = "application/json"
```

##### 测试
```shell
wrk -c1 -t1 -d1 -s post_json.lua  "http://127.0.0.1:8000/users_by_json"
```

#### 使用 POST 方式发送文件
##### 组织数据
通过 [nc]({% post_url 2022-03-26-command-nc %}) 捕获到的 form-data 发送文件的数据格式:
```
--------------------------f512f8a3c3a9b436\r\n
Content-Disposition: form-data; name="file"; filename="test.jpg"\r\n
Content-type: image/jpeg\r\n
\r\n
file content binary
\r\n
--------------------------f512f8a3c3a9b436--\r\n
```

可以编写个程序按上面的格式生成二进制的文件数据

我这里生成的数据：postdata
```
--1234567890^M
Content-Disposition: form-data; name="file"; filename="test.jpg"^M
Content-type: image/jpeg^M
^M
iVBORw0KGgoAAAANSUhEUgAACl4AAAesCAIAAABa4uohAAAACXBIWXMAAAsTAAALEwEAmpwYAAAgAElEQVR4nOzdfXyTZZ73/V/ShIZSSgqVxtpiaBE6SzuUgrNIFYGWBcW9R……..^M
--1234567890--^M
```

##### Lua 脚本：post_file.lua
```lua
wrk.method = "POST"
local f = io.open("postdata", "rb")
wrk.body   = f:read("*all")
wrk.headers["Content-Type"] = "multipart/form-data; boundary=1234567890"
```

##### 测试
```shell
wrk -c1 -t1 -d1 -s post_file.lua  "http://127.0.0.1:8000/uploadfile"
```

## ab
ab 使用的是 HTTP/1.0，不支持 HTTP/1.1

### 安装
* CentOS
```shell
yum install httpd-tools -y
```

* Ubuntu
```shell
apt install apache2-utils -y
```

### 测试
#### 发起 200 个请求，并发 20 个请求。
```shell
ab -n200 -c20 http://www.baidu.com/
```

```shell
ab -p user.json -T "application/json" http://127.0.0.1:8000/users
```

#### 发起 100 个并发讲求，持续 10 秒。
```shell
ab -c100 -t10 http://www.baidu.com/
```
```
Server Software:        BWS/1.1
Server Hostname:        www.baidu.com
Server Port:            80

Document Path:          /
Document Length:        347543 bytes

Concurrency Level:      100
Time taken for tests:   10.037 seconds
Complete requests:      333
Failed requests:        323
   (Connect: 0, Receive: 0, Length: 323, Exceptions: 0)
Total transferred:      134429279 bytes
HTML transferred:       133909888 bytes
Requests per second:    33.18 [#/sec] (mean)
Time per request:       3014.048 [ms] (mean)
Time per request:       30.140 [ms] (mean, across all concurrent requests)
Transfer rate:          13079.75 [Kbytes/sec] received

Connection Times (ms)
              min  mean[+/-sd] median   max
Connect:       17   40 149.2     17    1074
Processing:    72 2161 1123.1   2068    6757
Waiting:       18   41  72.2     19     622
Total:         90 2201 1140.1   2106    6775

Percentage of the requests served within a certain time (ms)
  50%   2101
  66%   2538
  75%   2798
  80%   3059
  90%   3639
  95%   4103
  98%   5182
  99%   5521
 100%   6775 (longest request)
```

### 不同的 HTTP 请求
#### 发起 GET 请求
```shell
ab http://www.baidu.com/
```

##### 带参数的请求
```shell
ab "http://127.0.0.1:8000/users?name=wjj&age=30"
```

#### 使用 POST 方式发送 键值 数据
##### 文件：postdata.txt
```txt
name=wjj&age=40
```

##### 发起一次请求
```shell
ab -v4 -p postdata.txt -T "application/x-www-form-urlencoded" http://127.0.0.1:8000/users 
```

#### 使用 POST 方式发送 JSON 数据
##### 文件：postdata.json
```json
{
    "name": "wjj",
    "age": 40
}
```

##### 发起一次请求
```shell
ab -v4 -p postdata.json -T "application/json" http://127.0.0.1:8000/users_by_json
```

#### 使用 POST 方式发送文件
参考上面的[组织数据](#组织数据)

##### 发起一次请求
```shell
ab -p postdata -T "multipart/form-data; boundary=1234567890" http://127.0.0.1:8000/uploadfile
```
**这里的 boundary 值要比上面的数据格式少两个 '-' 字符**

#### 使用 POST 方式发送文件（base64）
##### macOS
```shell
echo -n '--1234567890\r\n' > post_data.txt
echo -n 'Content-Disposition: form-data; name="file"; filename="test.png"\r\n'>> post_data.txt
echo -n 'Content-type: image/png\r\n' >> post_data.txt
echo -n 'Content-Transfer-Encoding: base64\r\n' >> post_data.txt
echo -n '\r\n' >> post_data.txt
base64 test.png >> post_data.txt
echo -n '\r\n' >> post_data.txt
echo -n '--1234567890--\r\n' >> post_data.txt
```

##### Ubuntu
> CentOS 运行下面命令，**\r\n** 变为4个字符而不是预期的2个字符。 

```shell
echo -n '--1234567890\r\n' > post_data.txt
echo -n 'Content-Disposition: form-data; name="file"; filename="test.png"\r\n'>> post_data.txt
echo -n 'Content-type: image/png\r\n' >> post_data.txt
echo -n 'Content-Transfer-Encoding: base64\r\n' >> post_data.txt
echo -n '\r\n' >> post_data.txt
base64 -w0 test.png >> post_data.txt
echo -n '\r\n' >> post_data.txt
echo -n '--1234567890--\r\n' >> post_data.txt
```

```shell
ab -p post_data.txt -T "multipart/form-data; boundary=1234567890" http://127.0.0.1:8000/uploadfile
```

**本来期望的是这个 base64 数据到了服务器端可以自动转成二进制的图像数据，没有成功，需要自己转。**

## 基准测试工具
* [wrk - a HTTP benchmarking tool](https://github.com/wg/wrk.git)
* [wrk2](https://github.com/giltene/wrk2)
* [ab - Apache HTTP server benchmarking tool](https://httpd.apache.org/docs/2.4/programs/ab.html)
* [WAF-Bench (wb): a benchmarking tool for Web Application Firewall (WAF)](https://microsoft.github.io/WAFBench/wb/)
* [JMeter](https://jmeter.apache.org)
* [autocannon - fast HTTP/1.1 benchmarking tool written in Node.js](https://github.com/mcollina/autocannon)

## 参考资料
* [ab(1) - Linux man page](https://linux.die.net/man/1/ab)
* [How To Benchmark HTTP Latency with wrk on Ubuntu 14.04](https://www.digitalocean.com/community/tutorials/how-to-benchmark-http-latency-with-wrk-on-ubuntu-14-04)
* [WRK the HTTP benchmarking tool - Advanced Example](http://czerasz.com/2015/07/19/wrk-http-benchmarking-tool-example/)
* [POST request with wrk?](https://stackoverflow.com/questions/15261612/post-request-with-wrk)
* [Web 高并发压测工具之 WRK, AB](https://zhuanlan.zhihu.com/p/281445698)
* [性能测试工具 wrk 使用教程](https://www.cnblogs.com/quanxiaoha/p/10661650.html)
* [Wrk](https://doc.networknt.com/tool/wrk-perf/)
* [腾讯云开发手册 HTTP Headers Content-Disposition](https://cloud.tencent.com/developer/section/1189916)
* [How to send binary file as body? #382](https://github.com/wg/wrk/issues/382)
* [MIME Headers Content-Type: application](https://docs.microsoft.com/en-us/previous-versions/office/developer/exchange-server-2010/aa494186(v=exchg.140))
* [Python binary file write directly from string](https://stackoverflow.com/questions/44769846/python-binary-file-write-directly-from-string)
* [save string to a binary file in python](https://stackoverflow.com/questions/15205199/save-string-to-a-binary-file-in-python)
* [Post请求Content-Type方式区分（PostMan示例form-data,x-www-form-urlencoded,raw,binary）](https://blog.csdn.net/xu622/article/details/84393419)
* [JMeter压力测试/并发测试/性能测试入门教程](https://zhuanlan.zhihu.com/p/64847409)
* [Apache bench test POST with image file contents](https://stackoverflow.com/questions/50484729/apache-bench-test-post-with-image-file-contents)
* [Use Apache Bench (AB) to Test a Website’s Server](https://www.holisticseo.digital/technical-seo/apache-bench/)
* [四种常见的 POST 提交数据方式（application/x-www-form-urlencoded，multipart/form-data，application/json，text/xml）](https://www.cnblogs.com/fengff/p/10843728.html)
* [Example of using Apache Bench (ab) to POST JSON to an API](https://gist.github.com/kelvinn/6a1c51b8976acf25bd78)
* [post使用form-data和x-www-form-urlencoded的本质区别](https://blog.csdn.net/u013827143/article/details/86222486)
* [Web性能测试篇：AB 压力测试](https://www.cnblogs.com/BenLam/p/9263927.html)
* [Multipart/form-data POST文件上传详解](https://blog.csdn.net/xiaojianpitt/article/details/6856536)
* [Difference between CR LF, LF and CR line break types?](https://stackoverflow.com/questions/1552749/difference-between-cr-lf-lf-and-cr-line-break-types)
* [POSTing multipart/form-data with Apache Bench (ab)](https://stackoverflow.com/questions/20220270/posting-multipart-form-data-with-apache-bench-ab)
* [Benchmarking file uploads](https://gist.github.com/chiller/dec373004894e9c9bb38ac647c7ccfa8)
* [POST Data to Load Test with ApacheBench](http://craigwickesser.com/2015/01/post-data-to-load-test-with-apachebench/)
* [HTTP POST Request Method](https://reqbin.com/Article/HttpPost)
