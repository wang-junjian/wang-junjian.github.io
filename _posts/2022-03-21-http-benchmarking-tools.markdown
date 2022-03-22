---
layout: post
title:  "HTTP 基准测试工具"
date:   2022-03-21 08:00:00 +0800
categories: 测试
tags: [wrk, ab, make, nproc]
---

## wrk
### 安装
需要从 GitHub 上克隆代码自己编译，编译前需要安装 git, gcc。
```shell
git clone https://github.com/wg/wrk.git
cd wrk

# 使用多线程（机器的处理器核数）加速编译，
make -j $(nproc)
cp wrk /usr/local/bin/
```

### 测试
10 个线程，保持打开 100 个并发连接，持续 10 秒。
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

## ab
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
100 个并发讲求，持续 10 秒。
```shell
ab -c100 -t10 http://www.baidu.com/
```
```
This is ApacheBench, Version 2.3 <$Revision: 1843412 $>
Copyright 1996 Adam Twiss, Zeus Technology Ltd, http://www.zeustech.net/
Licensed to The Apache Software Foundation, http://www.apache.org/

Benchmarking www.baidu.com (be patient)
Finished 333 requests


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

## 参考资料
* [wrk - a HTTP benchmarking tool](https://github.com/wg/wrk.git)
* [How To Benchmark HTTP Latency with wrk on Ubuntu 14.04](https://www.digitalocean.com/community/tutorials/how-to-benchmark-http-latency-with-wrk-on-ubuntu-14-04)
* [WRK the HTTP benchmarking tool - Advanced Example](http://czerasz.com/2015/07/19/wrk-http-benchmarking-tool-example/)
* [ab - Apache HTTP server benchmarking tool](https://httpd.apache.org/docs/2.4/programs/ab.html)
* [POST request with wrk?](https://stackoverflow.com/questions/15261612/post-request-with-wrk)
* [Web 高并发压测工具之 WRK, AB](https://zhuanlan.zhihu.com/p/281445698)
* [性能测试工具 wrk 使用教程](https://www.cnblogs.com/quanxiaoha/p/10661650.html)
* [Wrk](https://doc.networknt.com/tool/wrk-perf/)
