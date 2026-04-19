---
layout: single
title:  "FastAPI 上传和下载文件的基准测试"
date:   2022-03-31 08:00:00 +0800
categories: 工作日志 测试
tags: [Linux, FastAPI, File, async, gunicorn, uvicorn, wrk]
---

> 使用 FastAPI 实现了文件的上传和下载，部署服务使用了 uvicorn 和 gunicorn+uvicorn 两种方法。

> 基准测试工具使用的是 wrk

> 服务器 CPU 40核，内存 256G，操作系统 Ubuntu 20.04，Python3.9

## 测试流程
使用的测试图片 health.jpg (256kb)

### 生成测试数据
生成通过 HTTP POST 发送二进制数据的文件。
```shell
python make_http_postdata.py make health.jpg postdata
```
```
file: /home/wjj/test/postdata
boundary: gouchicao0123456789
```

### 创建用于 wrk 的 lua 脚本：postfile.lua 
```lua
wrk.method = "POST"
local f = io.open("postdata", "rb")
wrk.body   = f:read("*all")
wrk.headers["Content-Type"] = "multipart/form-data; boundary=gouchicao0123456789"
```

### 部署 FastAPI 应用
#### uvicorn
```shell
uvicorn app.main:app --host 0.0.0.0 --workers $(nproc)
```

#### gunicorn + uvicorn
```shell
gunicorn app.main:app --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0 --workers $(nproc)
```

### 运行基准测试 wrk
```shell
wrk -c100 -t$(nproc) -d10 --latency -s postfile.lua  $RESTAPI
```

## RESTAPI
**stream** 有个 CHUNK_SIZE 每次只是读取一小块文件数据，这种方式非常适合大文件，如：图像、视频等。没有特别声明，默认每个 API 函数都是异步的 (async)。

* **stream** 异步读取上传的文件，同步写入 tempfile.NamedTemporaryFile() 生成的文件。
   * http://172.16.33.159:8000/files/upload/stream/async_read_and_memory_write
* **stream** 异步读取上传的文件，同步写入磁盘文件。
   * http://172.16.33.159:8000/files/upload/stream/async_read_and_disk_write
* **stream** 异步读取上传的文件，异步写入磁盘文件。
   * http://172.16.33.159:8000/files/upload/stream/async_read_and_async_write
* 异步```全量```读取上传的文件，异步写入磁盘文件。
   * http://172.16.33.159:8000/files/upload/single
* 异步```全量```读取上传的文件，异步写入磁盘文件。(API 函数定义时没有使用 async)
   * http://172.16.33.159:8000/files/upload/single/sync
* **stream** 异步读取上传的文件，异步写入磁盘文件。
   * http://172.16.33.159:8000/files/upload/single/stream
* 使用 base64 对文件进行编码，json 上传。
   * http://172.16.33.159:8000/files/upload/raw/json/base64decode
* **stream** 同步读取要下载的文件
   * http://172.16.33.159:8000/files/download/stream/sync_read
* **stream** 异步读取要下载的文件
   * http://172.16.33.159:8000/files/download/stream/async_read
* 直接返回文件路径（API 函数定义时使用 async）
   * http://172.16.33.159:8000/files/download/file
* 直接返回文件路径（API 函数定义时没有使用 async）
   * http://172.16.33.159:8000/files/download/file/sync

## 测试
### 多个进程提供服务
#### 服务器端（uvicorn）
```shell
uvicorn app.main:app --host 0.0.0.0 --workers $(nproc)
```

#### 客户端
```shell
wrk -c100 -t$(nproc) -d10 --latency -s postfile.lua  "http://172.16.33.159:8000/files/upload/stream/async_read_and_memory_write"
```
```
Running 10s test @ http://172.16.33.159:8000/files/upload/stream/async_read_and_memory_write
  40 threads and 100 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency    19.29ms   17.42ms  69.59ms   76.82%
    Req/Sec   113.64     23.72   240.00     72.08%
  Latency Distribution
     50%    8.17ms
     75%   28.75ms
     90%   47.35ms
     99%   52.19ms
  45725 requests in 10.10s, 6.85MB read
Requests/sec:   4527.22
Transfer/sec:    694.95KB
```

```shell
wrk -c100 -t$(nproc) -d10 --latency -s postfile.lua  "http://172.16.33.159:8000/files/upload/stream/async_read_and_disk_write"
```
```
Running 10s test @ http://172.16.33.159:8000/files/upload/stream/async_read_and_disk_write
  40 threads and 100 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency    19.25ms   17.36ms  68.48ms   77.00%
    Req/Sec   114.21     24.03   240.00     61.14%
  Latency Distribution
     50%    8.14ms
     75%   28.52ms
     90%   47.35ms
     99%   52.15ms
  45943 requests in 10.10s, 7.98MB read
Requests/sec:   4548.93
Transfer/sec:    809.38KB
```

```shell
wrk -c100 -t$(nproc) -d10 --latency -s postfile.lua  "http://172.16.33.159:8000/files/upload/stream/async_read_and_async_write"
```
```
Running 10s test @ http://172.16.33.159:8000/files/upload/stream/async_read_and_async_write
  40 threads and 100 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency    19.94ms   18.45ms  74.89ms   72.52%
    Req/Sec   104.69     19.98   202.00     71.23%
  Latency Distribution
     50%    8.15ms
     75%   45.04ms
     90%   48.38ms
     99%   52.91ms
  42120 requests in 10.10s, 7.32MB read
Requests/sec:   4169.88
Transfer/sec:    741.88KB
```

```shell
wrk -c100 -t$(nproc) -d10 --latency -s postfile.lua  "http://172.16.33.159:8000/files/upload/single"
```
```
Running 10s test @ http://172.16.33.159:8000/files/upload/single
  40 threads and 100 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency    29.36ms   19.81ms  86.17ms   60.83%
    Req/Sec    68.04     11.95   121.00     68.08%
  Latency Distribution
     50%   19.74ms
     75%   51.66ms
     90%   58.80ms
     99%   68.87ms
  27450 requests in 10.10s, 4.77MB read
Requests/sec:   2718.32
Transfer/sec:    483.70KB
```

```shell
wrk -c100 -t$(nproc) -d10 --latency -s postfile.lua  "http://172.16.33.159:8000/files/upload/single/sync"
```
```
Running 10s test @ http://172.16.33.159:8000/files/upload/single/sync
  40 threads and 100 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency    29.41ms   20.58ms  99.27ms   61.52%
    Req/Sec    68.18     15.02   121.00     73.82%
  Latency Distribution
     50%   19.42ms
     75%   51.52ms
     90%   59.05ms
     99%   72.01ms
  27513 requests in 10.10s, 4.78MB read
Requests/sec:   2723.91
Transfer/sec:    484.68KB
```

```shell
wrk -c100 -t$(nproc) -d10 --latency -s postfile.lua  "http://172.16.33.159:8000/files/upload/single/stream"
```
```
Running 10s test @ http://172.16.33.159:8000/files/upload/single/stream
  40 threads and 100 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency    29.55ms   19.77ms  89.30ms   59.62%
    Req/Sec    67.69     12.92   121.00     78.84%
  Latency Distribution
     50%   20.07ms
     75%   51.42ms
     90%   58.69ms
     99%   69.60ms
  27305 requests in 10.10s, 4.74MB read
Requests/sec:   2703.74
Transfer/sec:    481.04KB
```

```shell
wrk -c100 -t$(nproc) -d10 --latency -s postfile.lua  "http://172.16.33.159:8000/files/upload/single/stream/async_read_sync_write"
```
```
Running 10s test @ http://172.16.33.159:8000/files/upload/single/stream/async_read_sync_write
  40 threads and 100 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency    23.44ms   19.92ms  98.35ms   67.73%
    Req/Sec    86.29     16.29   150.00     76.63%
  Latency Distribution
     50%   10.92ms
     75%   47.74ms
     90%   52.12ms
     99%   61.83ms
  34760 requests in 10.10s, 6.04MB read
Requests/sec:   3441.92
Transfer/sec:    612.46KB
```

```shell
wrk -c100 -t$(nproc) -d10 --latency -s postfile.lua  "http://172.16.33.159:8000/files/upload/single/stream/sync_read_sync_write"
```
```
Running 10s test @ http://172.16.33.159:8000/files/upload/single/stream/sync_read_sync_write
  40 threads and 100 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency    23.29ms   19.88ms 115.56ms   67.66%
    Req/Sec    86.82     16.18   131.00     61.06%
  Latency Distribution
     50%   10.63ms
     75%   47.89ms
     90%   51.91ms
     99%   61.30ms
  34965 requests in 10.10s, 6.08MB read
Requests/sec:   3461.86
Transfer/sec:    615.96KB
```

```shell
wrk -c100 -t$(nproc) -d10 --latency -s postfile_json.lua  "http://172.16.33.159:8000/files/upload/raw/json/base64decode"
```
```
Running 10s test @ http://172.16.33.159:8000/files/upload/raw/json/base64decode
  40 threads and 100 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency    23.46ms   19.84ms  77.10ms   67.37%
    Req/Sec    85.65     15.54   141.00     62.31%
  Latency Distribution
     50%   11.02ms
     75%   48.92ms
     90%   52.37ms
     99%   59.44ms
  34511 requests in 10.10s, 6.00MB read
Requests/sec:   3417.02
Transfer/sec:    608.06KB
```

```shell
wrk -c100 -t$(nproc) -d10 --latency "http://172.16.33.159:8000/files/download/stream/sync_read"
```
```
Running 10s test @ http://172.16.33.159:8000/files/download/stream/sync_read
  40 threads and 100 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency    18.33ms   12.48ms 226.80ms   86.04%
    Req/Sec   114.18     31.46   232.00     65.47%
  Latency Distribution
     50%   14.38ms
     75%   22.84ms
     90%   34.06ms
     99%   58.99ms
  45889 requests in 10.10s, 11.03GB read
Requests/sec:   4543.27
Transfer/sec:      1.09GB
```

```shell
wrk -c100 -t$(nproc) -d10 --latency "http://172.16.33.159:8000/files/download/stream/async_read"
```
```
Running 10s test @ http://172.16.33.159:8000/files/download/stream/async_read
  40 threads and 100 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency    18.30ms   11.93ms  87.35ms   85.41%
    Req/Sec   114.41     29.72   250.00     68.88%
  Latency Distribution
     50%   14.11ms
     75%   22.93ms
     90%   33.87ms
     99%   56.95ms
  46004 requests in 10.10s, 11.05GB read
Requests/sec:   4555.05
Transfer/sec:      1.09GB
```

```shell
wrk -c100 -t$(nproc) -d10 --latency "http://172.16.33.159:8000/files/download/file"
```
```
Running 10s test @ http://172.16.33.159:8000/files/download/file
  40 threads and 100 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency    51.29ms   21.92ms 239.03ms   61.22%
    Req/Sec    38.95     13.00    70.00     73.30%
  Latency Distribution
     50%   49.42ms
     75%   63.95ms
     90%   75.63ms
     99%  115.47ms
  15716 requests in 10.10s, 3.78GB read
Requests/sec:   1556.09
Transfer/sec:    383.57MB
```

```shell
wrk -c100 -t$(nproc) -d10 --latency "http://172.16.33.159:8000/files/download/file/sync"
```
```
Running 10s test @ http://172.16.33.159:8000/files/download/file/sync
  40 threads and 100 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency    53.35ms   24.83ms 207.07ms   66.09%
    Req/Sec    37.37     13.65   101.00     73.38%
  Latency Distribution
     50%   49.32ms
     75%   63.93ms
     90%   85.37ms
     99%  121.66ms
  15092 requests in 10.10s, 3.63GB read
Requests/sec:   1494.30
Transfer/sec:    368.34MB
```

#### 服务器端（gunicorn + uvicorn）
```shell
gunicorn app.main:app --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0 --workers $(nproc)
```

#### 客户端
```shell
wrk -c100 -t$(nproc) -d10 --latency -s postfile.lua  "http://172.16.33.159:8000/files/upload/stream/async_read_and_memory_write"
```
```
Running 10s test @ http://172.16.33.159:8000/files/upload/stream/async_read_and_memory_write
  40 threads and 100 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency    18.03ms   12.50ms 114.89ms   81.54%
    Req/Sec   114.72     71.81   323.00     71.57%
  Latency Distribution
     50%   13.98ms
     75%   25.04ms
     90%   36.60ms
     99%   56.09ms
  46175 requests in 10.10s, 6.91MB read
Requests/sec:   4572.33
Transfer/sec:    701.12KB
```

```shell
wrk -c100 -t$(nproc) -d10 --latency -s postfile.lua  "http://172.16.33.159:8000/files/upload/stream/async_read_and_disk_write"
```
```
Running 10s test @ http://172.16.33.159:8000/files/upload/stream/async_read_and_disk_write
  40 threads and 100 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency    17.66ms   10.47ms  90.86ms   75.22%
    Req/Sec   114.74     61.60   323.00     72.04%
  Latency Distribution
     50%   15.42ms
     75%   23.78ms
     90%   33.15ms
     99%   47.20ms
  46170 requests in 10.10s, 8.01MB read
Requests/sec:   4571.55
Transfer/sec:    812.59KB
```

```shell
wrk -c100 -t$(nproc) -d10 --latency -s postfile.lua  "http://172.16.33.159:8000/files/upload/stream/async_read_and_async_write"
```
```
Running 10s test @ http://172.16.33.159:8000/files/upload/stream/async_read_and_async_write
  40 threads and 100 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency    17.67ms   10.04ms  78.45ms   73.79%
    Req/Sec   114.70     56.14   303.00     73.54%
  Latency Distribution
     50%   15.33ms
     75%   23.23ms
     90%   31.97ms
     99%   47.62ms
  46171 requests in 10.10s, 8.01MB read
Requests/sec:   4571.88
Transfer/sec:    812.64KB
```

```shell
wrk -c100 -t$(nproc) -d10 --latency -s postfile.lua  "http://172.16.33.159:8000/files/upload/single"
```
```
Running 10s test @ http://172.16.33.159:8000/files/upload/single
  40 threads and 100 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency    18.53ms    7.13ms  72.50ms   54.99%
    Req/Sec   108.24     32.51   232.00     70.19%
  Latency Distribution
     50%   17.99ms
     75%   24.77ms
     90%   27.27ms
     99%   36.32ms
  43567 requests in 10.10s, 7.56MB read
Requests/sec:   4313.97
Transfer/sec:    766.79KB
```

### 单个进程提供服务
#### 服务器端（uvicorn）
```shell
uvicorn app.main:app --host 0.0.0.0 --workers 1
```

#### 客户端
```shell
wrk -c100 -t$(nproc) -d10 --latency -s postfile.lua  "http://172.16.33.159:8000/files/upload/stream/async_read_and_memory_write"
```
```
Running 10s test @ http://172.16.33.159:8000/files/upload/stream/async_read_and_memory_write
  40 threads and 100 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency    96.59ms   32.50ms 270.84ms   81.38%
    Req/Sec    21.04      8.40    60.00     60.71%
  Latency Distribution
     50%   82.06ms
     75%   90.01ms
     90%  159.84ms
     99%  178.32ms
  8316 requests in 10.10s, 1.25MB read
Requests/sec:    823.50
Transfer/sec:    126.26KB
```

```shell
wrk -c100 -t$(nproc) -d10 --latency -s postfile.lua  "http://172.16.33.159:8000/files/upload/stream/async_read_and_disk_write"
```
```
Running 10s test @ http://172.16.33.159:8000/files/upload/stream/async_read_and_disk_write
  40 threads and 100 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency    89.87ms   30.53ms 226.20ms   78.76%
    Req/Sec    22.47      9.13    80.00     68.34%
  Latency Distribution
     50%   76.23ms
     75%   86.60ms
     90%  141.64ms
     99%  174.55ms
  8939 requests in 10.10s, 1.55MB read
Requests/sec:    885.13
Transfer/sec:    157.32KB
```

```shell
wrk -c100 -t$(nproc) -d10 --latency -s postfile.lua  "http://172.16.33.159:8000/files/upload/stream/async_read_and_async_write"
```
```
Running 10s test @ http://172.16.33.159:8000/files/upload/stream/async_read_and_async_write
  40 threads and 100 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency   112.99ms   13.66ms 199.98ms   75.23%
    Req/Sec    17.83      4.27    30.00     77.18%
  Latency Distribution
     50%  108.95ms
     75%  121.30ms
     90%  130.00ms
     99%  157.06ms
  7108 requests in 10.10s, 1.23MB read
Requests/sec:    703.82
Transfer/sec:    125.11KB
```

```shell
wrk -c100 -t$(nproc) -d10 --latency -s postfile.lua  "http://172.16.33.159:8000/files/upload/single"
```
```
Running 10s test @ http://172.16.33.159:8000/files/upload/single
  40 threads and 100 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency   328.19ms   29.37ms 500.77ms   82.39%
    Req/Sec     6.51      2.39    10.00     58.24%
  Latency Distribution
     50%  324.66ms
     75%  338.80ms
     90%  356.56ms
     99%  434.69ms
  2414 requests in 10.10s, 429.05KB read
Requests/sec:    239.01
Transfer/sec:     42.48KB
```

```shell
wrk -c100 -t$(nproc) -d10 --latency -s postfile.lua  "http://172.16.33.159:8000/files/upload/single/sync"
```
```
Running 10s test @ http://172.16.33.159:8000/files/upload/single/sync
  40 threads and 100 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency   319.79ms   32.85ms 604.46ms   94.57%
    Req/Sec     6.51      2.16    20.00     68.95%
  Latency Distribution
     50%  312.26ms
     75%  321.47ms
     90%  329.32ms
     99%  466.96ms
  2487 requests in 10.10s, 442.03KB read
Requests/sec:    246.24
Transfer/sec:     43.77KB
```

#### 服务器端（gunicorn + uvicorn）
```shell
gunicorn app.main:app --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0 --workers 1
```

#### 客户端
```shell
wrk -c100 -t$(nproc) -d10 --latency -s postfile.lua  "http://172.16.33.159:8000/files/upload/stream/async_read_and_memory_write"
```
```
Running 10s test @ http://172.16.33.159:8000/files/upload/stream/async_read_and_memory_write
  40 threads and 100 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency    86.14ms   14.24ms 214.63ms   96.34%
    Req/Sec    23.22      7.66    80.00     82.08%
  Latency Distribution
     50%   84.01ms
     75%   85.24ms
     90%   88.13ms
     99%  169.96ms
  9329 requests in 10.10s, 1.40MB read
Requests/sec:    923.78
Transfer/sec:    141.63KB
```

```shell
wrk -c100 -t$(nproc) -d10 --latency -s postfile.lua  "http://172.16.33.159:8000/files/upload/stream/async_read_and_disk_write"
```
```
Running 10s test @ http://172.16.33.159:8000/files/upload/stream/async_read_and_disk_write
  40 threads and 100 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency    80.17ms   17.79ms 225.24ms   93.34%
    Req/Sec    24.99      9.03    80.00     72.24%
  Latency Distribution
     50%   76.21ms
     75%   79.08ms
     90%   79.93ms
     99%  153.31ms
  10040 requests in 10.10s, 1.74MB read
Requests/sec:    994.07
Transfer/sec:    176.68KB
```

```shell
wrk -c100 -t$(nproc) -d10 --latency -s postfile.lua  "http://172.16.33.159:8000/files/upload/stream/async_read_and_async_write"
```
```
Running 10s test @ http://172.16.33.159:8000/files/upload/stream/async_read_and_async_write
  40 threads and 100 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency   100.81ms   11.80ms 184.01ms   79.71%
    Req/Sec    19.87      3.94    40.00     85.02%
  Latency Distribution
     50%   97.71ms
     75%  105.44ms
     90%  115.18ms
     99%  142.87ms
  7969 requests in 10.10s, 1.38MB read
Requests/sec:    789.09
Transfer/sec:    140.25KB
```

```shell
wrk -c100 -t$(nproc) -d10 --latency -s postfile.lua  "http://172.16.33.159:8000/files/upload/single"
```
```
Running 10s test @ http://172.16.33.159:8000/files/upload/single
  40 threads and 100 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency   316.31ms   29.88ms 536.05ms   85.42%
    Req/Sec     6.69      2.31    10.00     61.84%
  Latency Distribution
     50%  310.75ms
     75%  323.71ms
     90%  342.53ms
     99%  440.83ms
  2517 requests in 10.10s, 447.36KB read
Requests/sec:    249.20
Transfer/sec:     44.29KB
```

## 总结
wrk 使用了 40 个线程，100 个并发，持续 10 秒。服务器端 **uvicorn**，40个进程并行服务。

|    | async | API | Body | stream | Requests | Requests/sec | Avg Latency (ms) |
| -- | -- | -- | -- | -- | -- | -- | -- |
| 👍 | async | upload/stream/async_read_and_memory_write | binary | Yes | 45725 | 4527.22 | 19.29 |
| 👍 | async | upload/stream/async_read_and_disk_write | binary | Yes | 45943 | 4548.93 | 19.25 |
|    | async | upload/stream/async_read_and_async_write | binary | Yes | 42120 | 4169.88 | 19.94 |
|    | async | upload/single | form-data |  | 27450 | 2718.32 | 29.36 |
|    |       | upload/single/sync | form-data |  | 27513 | 2723.91 | 29.41 |
|    | async | upload/single/stream | form-data | Yes | 27305 | 2703.74 | 29.55 |
|    | async | upload/single/stream/async_read_sync_write | form-data | Yes | 34760 | 3441.92 | 23.44 |
|    | async | upload/single/stream/sync_read_sync_write | form-data | Yes | 34965 | 3461.86 | 23.29 |
|    | async | upload/raw/json/base64decode | raw |  | 34511 | 3417.02 | 23.46 |
| 👍 | async | download/stream/sync_read |  | Yes | 45889 | 4543.27 | 18.33 |
| 👍 | async | download/stream/async_read |  | Yes | 46004 | 4555.05 | 18.30 |
|    | async | download/file |  |  | 15716 | 1556.09 | 51.29 |
|    |       | download/file/sync |  |  | 15092 | 1494.30 | 53.35 |

* binary 比 form-data 效率高🚀
* 上传和下载都是流式传输效率最棒🚀
* 写入 tempfile.NamedTemporaryFile() 生成的内存文件，没有看到效率的提升。
* 读和写都做了异步处理，不但没有带来效率的提升反而下降了。

| 服务器 | API | stream | Requests | Requests/sec | Avg Latency(ms) |
| -- | -- | -- | -- | -- | -- |
| uvicorn | upload/stream/async_read_and_memory_write | Yes | 45725 | 4527.22 | 19.29 |
| uvicorn | upload/stream/async_read_and_disk_write | Yes | 45943 | 4548.93 | 19.25 |
| uvicorn | upload/stream/async_read_and_async_write | Yes | 42120 | 4169.88 | 19.94 |
| uvicorn | upload/single |  | 27450 | 2718.32 | 29.36 |
| gunicorn uvicorn | upload/stream/async_read_and_memory_write | Yes | 46175 | 4572.33 | 18.03 |
| gunicorn uvicorn | upload/stream/async_read_and_disk_write | Yes | 46170 | 4571.55 | 17.66 |
| gunicorn uvicorn | upload/stream/async_read_and_async_write | Yes | 46171 | 4571.88 | 17.67 |
| gunicorn uvicorn | upload/single |  | 43567 | 4313.97 | 18.53 |

**gunicorn + uvicorn** 表现比较稳定，整体效率有一点点拉升，异步读和异步写叠加（async_read_and_async_write）和一个文件全量读取（single）的效率提升非常大🚀。这里的测试我并没有考虑到服务器端的负载。

### 上传文件
```py
async def create_file(request: Request):
    file_path = 'video.mp4'

    with open(file_path, "wb") as file:
        async for chunk in request.stream():
            file.write(chunk)
            
    return {'file_path': file_path}
```

### 下载文件
```py
async def read_file():
    file_path = 'video.mp4'
    
    async def iterfile(file_path, chunk_size):
        async with aiofiles.open(file_path, 'rb') as f:
            while chunk := await f.read(chunk_size):
                yield chunk

    CHUNK_SIZE = 262144 #256*1024
    return StreamingResponse(iterfile(file_path, CHUNK_SIZE), media_type="application/octet-stream")
```

## 参考资料
* [FastAPI](https://fastapi.tiangolo.com/zh/)
* [Uvicorn - An ASGI web server, for Python.](https://www.uvicorn.org)
* [Gunicorn - WSGI server](https://docs.gunicorn.org/en/stable/index.html)
* [Hướng dẫn sử dụng AB Benchmarking Tool trên Ubuntu 18.04](https://blog.devopsviet.com/2020/05/17/huong-dan-su-dung-ab-benchmarking-tool-tren-ubuntu-18-04/)
* [Concurrency and async / await](https://fastapi.tiangolo.com/zh/async/)
* [FastAPI官档精编004 - 并发与异步](https://www.jianshu.com/p/354ee7189918)
* [FastAPI (已解决，RuntimeWarning: coroutine 'UploadFile.read' was never awaited)](https://zhuanlan.zhihu.com/p/387545883)
