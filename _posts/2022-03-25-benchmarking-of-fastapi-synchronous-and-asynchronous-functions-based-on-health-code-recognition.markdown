---
layout: post
title:  "基于健康码识别的 FastAPI 同步和异步函数的基准测试"
date:   2022-03-25 00:00:00 +0800
categories: 工作日志 测试
tags: [Linux, FastAPI, async, gunicorn, uvicorn, ab, Docker]
---

> 健康码识别服务使用了 FastAPI 进行开发的，本周主要工作是为了对健康码识别的服务进行性能调优。接口函数使用了 async 关键字，但是内部的实现并没有使用 await。由于改写成异步代码需要时间，这里并没有改写代码，只是删除了 async 关键字。部署服务使用了 uvicorn 和 gunicorn+uvicorn 两种方法。

> 基准测试工具使用的是 ab

## 测试流程
### 生成测试数据
准备测试图片 health.jpg
```shell
echo -n '{"base64": "' > health.json
base64 -w0 health.jpg >> health.json
echo -n '"}' >> health.json
```

### 部署服务
#### uvicorn
```shell
docker run --runtime=nvidia --rm -it -e NVIDIA_VISIBLE_DEVICES=2 -p 20001:8000 \
    -v $(pwd):/health_code_service --name=health-uvicorn  health-code-service \
    uvicorn controller:app --host 0.0.0.0 --workers 1
```
* workers 并发进程数

#### gunicorn + uvicorn
```shell
docker run --runtime=nvidia --rm -it -e NVIDIA_VISIBLE_DEVICES=2 -p 20001:8000 \
    -v $(pwd):/health_code_service --name=health-gunicorn-uvicorn  health-code-service:gunicorn-uvicorn \
    gunicorn app.main:app --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0 --workers 1
```

### 性能压测
```shell
ab -n200 -c20 -p health.json -T "application/json" http://172.16.33.66:20001/analysis/health-code
```

## 异步函数测试
### 函数
```py
@app.post("/analysis/{usage}")
async def detect_image(usage: str = None, json: Base64 = None):
    img = base64_to_image(json.base64)
    return detect(usage, img)
```

### uvicorn
#### 并发 2 个进程
```
Server Software:        uvicorn
Server Hostname:        172.16.33.66
Server Port:            20001

Document Path:          /analysis/health-code
Document Length:        170 bytes

Concurrency Level:      20
Time taken for tests:   44.203 seconds
Complete requests:      200
Failed requests:        0
Total transferred:      63000 bytes
Total body sent:        71540768
HTML transferred:       34000 bytes
Requests per second:    4.52 [#/sec] (mean)
Time per request:       4420.285 [ms] (mean)
Time per request:       221.014 [ms] (mean, across all concurrent requests)
Transfer rate:          1.39 [Kbytes/sec] received
                        1580.53 kb/s sent
                        1581.92 kb/s total

Connection Times (ms)
              min  mean[+/-sd] median   max
Connect:        0    1   0.4      0       2
Processing:   417 4176 2661.4   3205   11977
Waiting:      412 2453 1885.9   1739    7986
Total:        418 4177 2661.5   3207   11978
ERROR: The median and mean for the initial connection time are more than twice the standard
       deviation apart. These results are NOT reliable.

Percentage of the requests served within a certain time (ms)
  50%   3207
  66%   5827
  75%   6553
  80%   7226
  90%   8011
  95%   8013
  98%   8571
  99%  10970
 100%  11978 (longest request)
```

#### 并发 4 个进程
```
Server Software:        uvicorn
Server Hostname:        172.16.33.66
Server Port:            20001

Document Path:          /analysis/health-code
Document Length:        170 bytes

Concurrency Level:      20
Time taken for tests:   24.732 seconds
Complete requests:      200
Failed requests:        0
Total transferred:      63000 bytes
Total body sent:        69869776
HTML transferred:       34000 bytes
Requests per second:    8.09 [#/sec] (mean)
Time per request:       2473.190 [ms] (mean)
Time per request:       123.660 [ms] (mean, across all concurrent requests)
Transfer rate:          2.49 [Kbytes/sec] received
                        2758.87 kb/s sent
                        2761.36 kb/s total

Connection Times (ms)
              min  mean[+/-sd] median   max
Connect:        0    1   2.4      0      35
Processing:   418 2230 1520.5   2050    5614
Waiting:      414 1480 1084.2   1260    5590
Total:        419 2231 1520.6   2051    5614

Percentage of the requests served within a certain time (ms)
  50%   2051
  66%   2544
  75%   2894
  80%   3231
  90%   5181
  95%   5442
  98%   5613
  99%   5613
 100%   5614 (longest request)
```

### gunicorn + uvicorn
#### 并发 2 个进程
```
Server Software:        uvicorn
Server Hostname:        172.16.33.66
Server Port:            20001

Document Path:          /analysis/health-code
Document Length:        170 bytes

Concurrency Level:      20
Time taken for tests:   48.839 seconds
Complete requests:      200
Failed requests:        1
   (Connect: 0, Receive: 0, Length: 1, Exceptions: 0)
Total transferred:      62685 bytes
Total body sent:        70457664
HTML transferred:       33830 bytes
Requests per second:    4.10 [#/sec] (mean)
Time per request:       4883.850 [ms] (mean)
Time per request:       244.193 [ms] (mean, across all concurrent requests)
Transfer rate:          1.25 [Kbytes/sec] received
                        1408.85 kb/s sent
                        1410.11 kb/s total

Connection Times (ms)
              min  mean[+/-sd] median   max
Connect:        0    1   0.4      0       3
Processing:   429 4644 2576.1   4605   11602
Waiting:        0 2617 1654.9   2447    7889
Total:        430 4644 2576.1   4606   11603
ERROR: The median and mean for the initial connection time are more than twice the standard
       deviation apart. These results are NOT reliable.

Percentage of the requests served within a certain time (ms)
  50%   4606
  66%   5409
  75%   6006
  80%   6530
  90%   7533
  95%  10271
  98%  11603
  99%  11603
 100%  11603 (longest request)
```

#### 并发 4 个进程
```
Server Software:        uvicorn
Server Hostname:        172.16.33.66
Server Port:            20001

Document Path:          /analysis/health-code
Document Length:        170 bytes

Concurrency Level:      20
Time taken for tests:   23.364 seconds
Complete requests:      200
Failed requests:        0
Total transferred:      63000 bytes
Total body sent:        69232656
HTML transferred:       34000 bytes
Requests per second:    8.56 [#/sec] (mean)
Time per request:       2336.394 [ms] (mean)
Time per request:       116.820 [ms] (mean, across all concurrent requests)
Transfer rate:          2.63 [Kbytes/sec] received
                        2893.78 kb/s sent
                        2896.41 kb/s total

Connection Times (ms)
              min  mean[+/-sd] median   max
Connect:        0    0   0.3      0       2
Processing:   409 2190 1281.7   1988    6548
Waiting:      404 1470 877.4   1328    4790
Total:        409 2190 1281.7   1990    6549

Percentage of the requests served within a certain time (ms)
  50%   1990
  66%   2618
  75%   2777
  80%   3006
  90%   4002
  95%   4807
  98%   5846
  99%   6448
 100%   6549 (longest request)
```

## 同步函数测试
### 函数
```py
@app.post("/analysis/{usage}")
def detect_image(usage: str = None, json: Base64 = None):
    img = base64_to_image(json.base64)
    return detect(usage, img)
```

### uvicorn
#### 1 个进程
```
Server Software:        uvicorn
Server Hostname:        172.16.33.66
Server Port:            20001

Document Path:          /analysis/health-code
Document Length:        170 bytes

Concurrency Level:      20
Time taken for tests:   41.372 seconds
Complete requests:      200
Failed requests:        80
   (Connect: 0, Receive: 0, Length: 80, Exceptions: 0)
Non-2xx responses:      21
Total transferred:      60470 bytes
Total body sent:        68694000
HTML transferred:       31302 bytes
Requests per second:    4.83 [#/sec] (mean)
Time per request:       4137.204 [ms] (mean)
Time per request:       206.860 [ms] (mean, across all concurrent requests)
Transfer rate:          1.43 [Kbytes/sec] received
                        1621.48 kb/s sent
                        1622.91 kb/s total

Connection Times (ms)
              min  mean[+/-sd] median   max
Connect:        0    0   0.3      0       2
Processing:   449 4021 501.4   4133    4906
Waiting:      445 3971 500.8   4067    4842
Total:        450 4022 501.4   4133    4907

Percentage of the requests served within a certain time (ms)
  50%   4133
  66%   4231
  75%   4288
  80%   4334
  90%   4458
  95%   4652
  98%   4705
  99%   4856
 100%   4907 (longest request)
```

#### 并发 2 个进程
```
Server Software:        uvicorn
Server Hostname:        172.16.33.66
Server Port:            20001

Document Path:          /analysis/health-code
Document Length:        170 bytes

Concurrency Level:      20
Time taken for tests:   18.655 seconds
Complete requests:      200
Failed requests:        26
   (Connect: 0, Receive: 0, Length: 26, Exceptions: 0)
Non-2xx responses:      5
Total transferred:      62428 bytes
Total body sent:        68694000
HTML transferred:       33388 bytes
Requests per second:    10.72 [#/sec] (mean)
Time per request:       1865.511 [ms] (mean)
Time per request:       93.276 [ms] (mean, across all concurrent requests)
Transfer rate:          3.27 [Kbytes/sec] received
                        3596.01 kb/s sent
                        3599.28 kb/s total

Connection Times (ms)
              min  mean[+/-sd] median   max
Connect:        0    0   0.4      0       3
Processing:   455 1777 410.4   1760    2785
Waiting:      450 1764 408.2   1750    2754
Total:        455 1778 410.5   1760    2786

Percentage of the requests served within a certain time (ms)
  50%   1760
  66%   1944
  75%   2058
  80%   2136
  90%   2324
  95%   2493
  98%   2724
  99%   2781
 100%   2786 (longest request)
```

#### 并发 4 个进程
```
Server Software:        uvicorn
Server Hostname:        172.16.33.66
Server Port:            20001

Document Path:          /analysis/health-code
Document Length:        170 bytes

Concurrency Level:      20
Time taken for tests:   9.289 seconds
Complete requests:      200
Failed requests:        5
   (Connect: 0, Receive: 0, Length: 5, Exceptions: 0)
Non-2xx responses:      1
Total transferred:      62860 bytes
Total body sent:        68694000
HTML transferred:       33852 bytes
Requests per second:    21.53 [#/sec] (mean)
Time per request:       928.936 [ms] (mean)
Time per request:       46.447 [ms] (mean, across all concurrent requests)
Transfer rate:          6.61 [Kbytes/sec] received
                        7221.59 kb/s sent
                        7228.20 kb/s total

Connection Times (ms)
              min  mean[+/-sd] median   max
Connect:        0    0   0.5      0       3
Processing:   480  850 373.1    757    2431
Waiting:      472  844 367.7    752    2412
Total:        480  851 373.5    757    2433

Percentage of the requests served within a certain time (ms)
  50%    757
  66%    821
  75%    909
  80%    935
  90%   1084
  95%   1904
  98%   2418
  99%   2429
 100%   2433 (longest request)
```

#### 并发 6 个进程
```
Server Software:        uvicorn
Server Hostname:        172.16.33.66
Server Port:            20001

Document Path:          /analysis/health-code
Document Length:        170 bytes

Concurrency Level:      20
Time taken for tests:   8.391 seconds
Complete requests:      200
Failed requests:        8
   (Connect: 0, Receive: 0, Length: 8, Exceptions: 0)
Non-2xx responses:      2
Total transferred:      62727 bytes
Total body sent:        68934368
HTML transferred:       33711 bytes
Requests per second:    23.84 [#/sec] (mean)
Time per request:       839.071 [ms] (mean)
Time per request:       41.954 [ms] (mean, across all concurrent requests)
Transfer rate:          7.30 [Kbytes/sec] received
                        8023.01 kb/s sent
                        8030.31 kb/s total

Connection Times (ms)
              min  mean[+/-sd] median   max
Connect:        0    0   0.4      0       3
Processing:   316  770 315.1    705    2297
Waiting:      312  765 310.8    702    2270
Total:        316  770 315.4    705    2299

Percentage of the requests served within a certain time (ms)
  50%    705
  66%    754
  75%    784
  80%    802
  90%    874
  95%   1162
  98%   2268
  99%   2291
 100%   2299 (longest request)
```

#### 并发 8 个进程
```
Server Software:        uvicorn
Server Hostname:        172.16.33.66
Server Port:            20001

Document Path:          /analysis/health-code
Document Length:        170 bytes

Concurrency Level:      20
Time taken for tests:   7.878 seconds
Complete requests:      200
Failed requests:        5
   (Connect: 0, Receive: 0, Length: 5, Exceptions: 0)
Non-2xx responses:      1
Total transferred:      62882 bytes
Total body sent:        68694000
HTML transferred:       33874 bytes
Requests per second:    25.39 [#/sec] (mean)
Time per request:       787.831 [ms] (mean)
Time per request:       39.392 [ms] (mean, across all concurrent requests)
Transfer rate:          7.79 [Kbytes/sec] received
                        8515.03 kb/s sent
                        8522.82 kb/s total

Connection Times (ms)
              min  mean[+/-sd] median   max
Connect:        0    0   0.4      0       3
Processing:   439  718 177.8    674    1453
Waiting:      434  713 172.4    671    1432
Total:        440  719 178.0    674    1454

Percentage of the requests served within a certain time (ms)
  50%    674
  66%    711
  75%    749
  80%    765
  90%    906
  95%   1156
  98%   1436
  99%   1453
 100%   1454 (longest request)
```

### gunicorn + uvicorn
#### 1 个进程
```
Server Software:        uvicorn
Server Hostname:        172.16.33.66
Server Port:            20001

Document Path:          /analysis/health-code
Document Length:        170 bytes

Concurrency Level:      20
Time taken for tests:   41.205 seconds
Complete requests:      200
Failed requests:        62
   (Connect: 0, Receive: 0, Length: 62, Exceptions: 0)
Non-2xx responses:      18
Total transferred:      60884 bytes
Total body sent:        68694000
HTML transferred:       31740 bytes
Requests per second:    4.85 [#/sec] (mean)
Time per request:       4120.517 [ms] (mean)
Time per request:       206.026 [ms] (mean, across all concurrent requests)
Transfer rate:          1.44 [Kbytes/sec] received
                        1628.05 kb/s sent
                        1629.49 kb/s total

Connection Times (ms)
              min  mean[+/-sd] median   max
Connect:        0    0   0.5      0       3
Processing:   430 4011 518.4   4091    4911
Waiting:      425 3970 513.4   4072    4886
Total:        431 4011 518.5   4091    4913

Percentage of the requests served within a certain time (ms)
  50%   4091
  66%   4220
  75%   4279
  80%   4322
  90%   4434
  95%   4605
  98%   4874
  99%   4896
 100%   4913 (longest request)
```

#### 并发 2 个进程
```
Server Software:        uvicorn
Server Hostname:        172.16.33.66
Server Port:            20001

Document Path:          /analysis/health-code
Document Length:        170 bytes

Concurrency Level:      20
Time taken for tests:   18.574 seconds
Complete requests:      200
Failed requests:        29
   (Connect: 0, Receive: 0, Length: 29, Exceptions: 0)
Non-2xx responses:      7
Total transferred:      62130 bytes
Total body sent:        68694000
HTML transferred:       33074 bytes
Requests per second:    10.77 [#/sec] (mean)
Time per request:       1857.429 [ms] (mean)
Time per request:       92.871 [ms] (mean, across all concurrent requests)
Transfer rate:          3.27 [Kbytes/sec] received
                        3611.66 kb/s sent
                        3614.92 kb/s total

Connection Times (ms)
              min  mean[+/-sd] median   max
Connect:        0    0   1.2      0      15
Processing:   447 1769 526.4   1770    3360
Waiting:      442 1755 522.6   1756    3329
Total:        448 1769 526.4   1770    3362

Percentage of the requests served within a certain time (ms)
  50%   1770
  66%   1889
  75%   2002
  80%   2039
  90%   2184
  95%   3156
  98%   3315
  99%   3325
 100%   3362 (longest request)
```

#### 并发 4 个进程
```
Server Software:        uvicorn
Server Hostname:        172.16.33.66
Server Port:            20001

Document Path:          /analysis/health-code
Document Length:        170 bytes

Concurrency Level:      20
Time taken for tests:   10.056 seconds
Complete requests:      200
Failed requests:        13
   (Connect: 0, Receive: 0, Length: 13, Exceptions: 0)
Non-2xx responses:      5
Total transferred:      62382 bytes
Total body sent:        68694000
HTML transferred:       33342 bytes
Requests per second:    19.89 [#/sec] (mean)
Time per request:       1005.629 [ms] (mean)
Time per request:       50.281 [ms] (mean, across all concurrent requests)
Transfer rate:          6.06 [Kbytes/sec] received
                        6670.85 kb/s sent
                        6676.91 kb/s total

Connection Times (ms)
              min  mean[+/-sd] median   max
Connect:        0    0   0.3      0       3
Processing:   422  921 292.0    836    1931
Waiting:      419  915 286.9    833    1899
Total:        422  921 292.3    836    1932

Percentage of the requests served within a certain time (ms)
  50%    836
  66%    931
  75%   1007
  80%   1082
  90%   1275
  95%   1697
  98%   1788
  99%   1901
 100%   1932 (longest request)
```

#### 并发 6 个进程
```
Server Software:        uvicorn
Server Hostname:        172.16.33.66
Server Port:            20001

Document Path:          /analysis/health-code
Document Length:        170 bytes

Concurrency Level:      20
Time taken for tests:   9.188 seconds
Complete requests:      200
Failed requests:        7
   (Connect: 0, Receive: 0, Length: 7, Exceptions: 0)
Non-2xx responses:      2
Total transferred:      62787 bytes
Total body sent:        68694000
HTML transferred:       33771 bytes
Requests per second:    21.77 [#/sec] (mean)
Time per request:       918.756 [ms] (mean)
Time per request:       45.938 [ms] (mean, across all concurrent requests)
Transfer rate:          6.67 [Kbytes/sec] received
                        7301.61 kb/s sent
                        7308.28 kb/s total

Connection Times (ms)
              min  mean[+/-sd] median   max
Connect:        0    0   0.3      0       2
Processing:   349  822 204.3    764    1435
Waiting:      346  816 199.3    760    1418
Total:        349  822 204.5    765    1436

Percentage of the requests served within a certain time (ms)
  50%    765
  66%    830
  75%    885
  80%    919
  90%   1100
  95%   1369
  98%   1435
  99%   1435
 100%   1436 (longest request)
```

#### 并发 8 个进程
```
Server Software:        uvicorn
Server Hostname:        172.16.33.66
Server Port:            20001

Document Path:          /analysis/health-code
Document Length:        170 bytes

Concurrency Level:      20
Time taken for tests:   7.959 seconds
Complete requests:      200
Failed requests:        4
   (Connect: 0, Receive: 0, Length: 4, Exceptions: 0)
Non-2xx responses:      1
Total transferred:      62889 bytes
Total body sent:        68694000
HTML transferred:       33881 bytes
Requests per second:    25.13 [#/sec] (mean)
Time per request:       795.879 [ms] (mean)
Time per request:       39.794 [ms] (mean, across all concurrent requests)
Transfer rate:          7.72 [Kbytes/sec] received
                        8428.92 kb/s sent
                        8436.64 kb/s total

Connection Times (ms)
              min  mean[+/-sd] median   max
Connect:        0    0   1.5      0      20
Processing:   444  728 175.0    677    1586
Waiting:      440  723 169.6    674    1542
Total:        445  728 175.3    677    1587

Percentage of the requests served within a certain time (ms)
  50%    677
  66%    729
  75%    771
  80%    827
  90%    928
  95%   1026
  98%   1494
  99%   1570
 100%   1587 (longest request)
```

## 总结
![](/images/2022/ai-health-benchmarking.png)

* 4 个进程可以发挥到最佳效果
* 8 个进程已经到了上限了
* 在部署这种密集计算的应用下，gunicorn + uvicorn 并没有比 uvicorn 强，但如果您需要管理进程，它们就是最佳组合。
* 通过基准测试发现，最大的瓶颈不是 GPU，而且 CPU，GPU 一张卡的负载还没有 40 核 CPU 的负载高。

**异步（使用了 async 关键字）函数，在压测的过程中基本上不会失败（Failed）,同步函数，在压测过程中会经常失败，随着并发数的增加而增加。目前还没有找到原因**

## 参考资料
* [FastAPI](https://fastapi.tiangolo.com/zh/)
* [Uvicorn - An ASGI web server, for Python.](https://www.uvicorn.org)
* [Gunicorn - WSGI server](https://docs.gunicorn.org/en/stable/index.html)
* [Hướng dẫn sử dụng AB Benchmarking Tool trên Ubuntu 18.04](https://blog.devopsviet.com/2020/05/17/huong-dan-su-dung-ab-benchmarking-tool-tren-ubuntu-18-04/)
* [Concurrency and async / await](https://fastapi.tiangolo.com/zh/async/)
* [FastAPI官档精编004 - 并发与异步](https://www.jianshu.com/p/354ee7189918)
