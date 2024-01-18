---
layout: post
title:  "Tabby 的基准测试"
date:   2024-01-15 10:00:00 +0800
categories: Tabby Benchmark
tags: [Tabby, Benchmark, wrk, tcpdump, CodeLLM, AICodingAssistant]
---

## [wrk](https://github.com/wg/wrk)
- [HTTP 基准测试工具](https://wangjunjian.com/测试/2022/03/21/http-benchmarking-tools.html)

### 安装
```bash
git clone https://github.com/wg/wrk.git
cd wrk
#使用多线程（机器的处理器核数）加速编译，
make -j $(nproc)
cp wrk /usr/local/bin/
```

## Tabby Server
### 服务器：NVIDIA T4 16GB X 4
### 部署
- 模型：TabbyML/DeepseekCoder-6.7B
```bash
docker run -d --gpus all -p 8080:8080 \
  -v /data/zhw/tabby/data:/data \
  tabbyml/tabby:latest \
  serve --model TabbyML/DeepseekCoder-6.7B \
  --device cuda --parallelism 4
```

- 模型：TabbyML/DeepseekCoder-1.3B
```bash
docker run -d --gpus all -p 8080:8080 \
  -v /data/zhw/tabby/data:/data \
  tabbyml/tabby:latest \
  serve --model TabbyML/DeepseekCoder-1.3B \
  --device cuda --parallelism 12
```

## curl 测试
```bash
curl http://127.0.0.1:8080/v1/completions   -H "Content-Type: application/json"   -d '{
  "language": "python",
  "segments": {
    "prefix": "#实现一个快速排序\n  def "
  }
}'|jq
```
```json
{
  "id": "cmpl-6ef400f4-86da-43cc-b27a-eeae9394c316",
  "choices": [
    {
      "index": 0,
      "text": "quick_sort(arr):\n    if len(arr) <= 1:\n      return arr\n    pivot = arr[0]\n    left = [x for x in arr[1:] if x <= pivot]\n    right = [x for x in arr[1:] if x > pivot]\n    return quick_sort(left) + [pivot] + quick_sort(right)"
    }
  ]
}
```

### [Token 计算](https://platform.openai.com/tokenizer)

### 输入 12 个 Tokens
```py
#实现一个快速排序
  def 
```

### 输出 74 个 Tokens
```py
quick_sort(arry):
    if len(arr) <= 1:
      return arr
    pivot = arr[0]
    left = [x for x in arr[1:] if x <= pivot]
    right = [x for x in arr[1:] if x > pivot]
    return quick_sort(left) + [pivot] + quick_sort(right)
```


## 准备
### 编辑测试脚本 post_json.lua
```lua
wrk.method = "POST"
wrk.body   = "{\"language\": \"python\", \"segments\": {\"prefix\": \"#Implement a quick sort\\n  def \"}}"
wrk.headers["Content-Type"] = "application/json"
```

`\\n` 不能写为 `\n`，否则会报错：Failed to parse the request body as JSON: segments.prefix: control character (\u0000-\u001F) found while parsing a string at line 2 column 0

### 监控 8080 端口
```bash
sudo tcpdump -i any -A 'tcp port 8080 and (((ip[2:2] - ((ip[0]&0xf)<<2)) - ((tcp[12]&0xf0)>>2)) != 0)' -w -
```

## 基准测试

- `基准测试工具`：wrk
- `持续时间`：1 分钟
- `超时时间`：10 秒

### 总结
#### TabbyML/DeepseekCoder-6.7B（并发 4）

|       | 并发连接数 | 线程数 | 平均延迟 | 最大延迟 | 完成请求数 | 超时请求数 | 平均每秒请求数 |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
|       | 1 | 1 | 3.75s | 3.81s | 16 | 0 | 0.27 |
|       | 2 | 2 | 5.00s | 5.11s | 24 | 0 | 0.40 |
|       | 3 | 3 | 5.80s | 5.99s | 30 | 0 | 0.50 |
| 👍    | 4 | 4 | 5.43s | 5.62s | 43 | 0 | 0.72 |
|       | 5 | 5 | 6.12s | 6.30s | 40 | 9 | 0.67 |
|       | 6 | 6 | 7.42s | 9.14s | 41 | 9 | 0.68 |
|       | 8 | 8 | 7.29s | 9.85s | 40 | 34 | 0.67 |

#### TabbyML/DeepseekCoder-1.3B（并发 12）

|       | 并发连接数 | 线程数 | 平均延迟 | 最大延迟 | 完成请求数 | 超时请求数 | 平均每秒请求数 |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
|       | 1 | 1 | 1.03s | 1.11s | 57 | 0 | 0.95 |
|       | 4 | 4 | 1.46s | 1.79s | 161 | 0 | 2.68 |
|       | 8 | 8 | 1.95s | 2.18s | 241 | 0 | 4.02 |
| 👍    | 12 | 12 | 2.79s | 3.06s | 251 | 0 | 4.18 |
|       | 16 | 16 | 4.19s | 6.40s | 221 | 0 | 3.68 |
|       | 20 | 20 | 6.43s | 8.16s | 177 | 0 | 2.95 |
|       | 24 | 24 | 9.01s | 10.00s | 143 | 42 | 2.38 |

### 测试数据
#### TabbyML/DeepseekCoder-6.7B
- 1 个并发连接，1 个线程，持续 1 分钟，超时时间 10 秒
```bash
wrk -c1 -t1 -d1m --timeout 10s --latency -s post_json.lua http://127.0.0.1:8080/v1/completions
```
```
Running 1m test @ http://127.0.0.1:8080/v1/completions
  1 threads and 1 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     3.75s    29.55ms   3.81s    68.75%
    Req/Sec     0.00      0.00     0.00    100.00%
  Latency Distribution
     50%    3.75s 
     75%    3.78s 
     90%    3.79s 
     99%    3.81s 
  16 requests in 1.00m, 9.05KB read
Requests/sec:      0.27
Transfer/sec:     154.21B
```

- 2 个并发连接，2 个线程，持续 1 分钟，超时时间 10 秒
```bash
wrk -c2 -t2 -d1m --timeout 10s --latency -s post_json.lua http://127.0.0.1:8080/v1/completions
```
```
Running 1m test @ http://127.0.0.1:8080/v1/completions
  2 threads and 2 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     5.00s    43.20ms   5.11s    87.50%
    Req/Sec     0.00      0.00     0.00    100.00%
  Latency Distribution
     50%    5.00s 
     75%    5.01s 
     90%    5.01s 
     99%    5.11s 
  24 requests in 1.00m, 13.57KB read
Requests/sec:      0.40
Transfer/sec:     231.57B
```

- 3 个并发连接，3 个线程，持续 1 分钟，超时时间 10 秒
```bash
wrk -c3 -t3 -d1m --timeout 10s --latency -s post_json.lua http://127.0.0.1:8080/v1/completions
```
```
Running 1m test @ http://127.0.0.1:8080/v1/completions
  3 threads and 3 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     5.80s    91.00ms   5.99s    73.33%
    Req/Sec     0.00      0.00     0.00    100.00%
  Latency Distribution
     50%    5.81s 
     75%    5.84s 
     90%    5.88s 
     99%    5.99s 
  30 requests in 1.00m, 16.96KB read
Requests/sec:      0.50
Transfer/sec:     289.48B
```

- 4 个并发连接，4 个线程，持续 1 分钟，超时时间 10 秒
```bash
wrk -c4 -t4 -d1m --timeout 10s --latency -s post_json.lua http://127.0.0.1:8080/v1/completions
```
```
Running 1m test @ http://127.0.0.1:8080/v1/completions
  4 threads and 4 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     5.43s   143.39ms   5.62s    72.09%
    Req/Sec     0.00      0.00     0.00    100.00%
  Latency Distribution
     50%    5.46s 
     75%    5.52s 
     90%    5.60s 
     99%    5.62s 
  43 requests in 1.00m, 24.31KB read
Requests/sec:      0.72
Transfer/sec:     414.28B
```

- 5 个并发连接，5 个线程，持续 1 分钟，超时时间 10 秒
```bash
wrk -c5 -t5 -d1m --timeout 10s --latency -s post_json.lua http://127.0.0.1:8080/v1/completions
```
```
Running 1m test @ http://127.0.0.1:8080/v1/completions
  5 threads and 5 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     6.12s    98.11ms   6.30s    64.52%
    Req/Sec     0.00      0.00     0.00    100.00%
  Latency Distribution
     50%    6.13s 
     75%    6.17s 
     90%    6.25s 
     99%    6.30s 
  40 requests in 1.00m, 22.62KB read
  Socket errors: connect 0, read 0, write 0, timeout 9
Requests/sec:      0.67
Transfer/sec:     385.36B
```

- 6 个并发连接，6 个线程，持续 1 分钟，超时时间 10 秒
```bash
wrk -c6 -t6 -d1m --timeout 10s --latency -s post_json.lua http://127.0.0.1:8080/v1/completions
```
```
Running 1m test @ http://127.0.0.1:8080/v1/completions
  6 threads and 6 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     7.42s     1.62s    9.14s    71.88%
    Req/Sec     0.00      0.00     0.00    100.00%
  Latency Distribution
     50%    7.83s 
     75%    9.01s 
     90%    9.12s 
     99%    9.14s 
  41 requests in 1.00m, 22.94KB read
  Socket errors: connect 0, read 0, write 0, timeout 9
Requests/sec:      0.68
Transfer/sec:     390.83B
```

- 8 个并发连接，8 个线程，持续 1 分钟，超时时间 10 秒
```bash
wrk -c8 -t8 -d1m --timeout 10s --latency -s post_json.lua http://127.0.0.1:8080/v1/completions
```
```
Running 1m test @ http://127.0.0.1:8080/v1/completions
  8 threads and 8 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     7.29s     1.89s    9.85s    66.67%
    Req/Sec     0.00      0.00     0.00    100.00%
  Latency Distribution
     50%    6.29s 
     75%    9.58s 
     90%    9.85s 
     99%    9.85s 
  40 requests in 1.00m, 22.47KB read
  Socket errors: connect 0, read 0, write 0, timeout 34
Requests/sec:      0.67
Transfer/sec:     382.82B
```

#### TabbyML/DeepseekCoder-1.3B
- 1 个并发连接，1 个线程，持续 1 分钟，超时时间 10 秒
```bash
wrk -c1 -t1 -d1m --timeout 10s --latency -s post_json.lua http://127.0.0.1:8080/v1/completions
```
```
Running 1m test @ http://127.0.0.1:8080/v1/completions
  1 threads and 1 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     1.03s    12.40ms   1.11s    89.47%
    Req/Sec     0.04      0.19     1.00     96.49%
  Latency Distribution
     50%    1.03s 
     75%    1.04s 
     90%    1.04s 
     99%    1.11s 
  57 requests in 1.00m, 32.40KB read
Requests/sec:      0.95
Transfer/sec:     552.85B
```

- 4 个并发连接，4 个线程，持续 1 分钟，超时时间 10 秒
```bash
wrk -c4 -t4 -d1m --timeout 10s --latency -s post_json.lua http://127.0.0.1:8080/v1/completions
```
```
Running 1m test @ http://127.0.0.1:8080/v1/completions
  4 threads and 4 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     1.46s    93.34ms   1.79s    85.09%
    Req/Sec     0.00      0.00     0.00    100.00%
  Latency Distribution
     50%    1.40s 
     75%    1.55s 
     90%    1.56s 
     99%    1.79s 
  161 requests in 1.00m, 92.53KB read
Requests/sec:      2.68
Transfer/sec:      1.54KB
```

- 8 个并发连接，8 个线程，持续 1 分钟，超时时间 10 秒
```bash
wrk -c8 -t8 -d1m --timeout 10s --latency -s post_json.lua http://127.0.0.1:8080/v1/completions
```
```
Running 1m test @ http://127.0.0.1:8080/v1/completions
  8 threads and 8 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     1.95s   115.96ms   2.18s    59.34%
    Req/Sec     0.00      0.00     0.00    100.00%
  Latency Distribution
     50%    1.98s 
     75%    2.05s 
     90%    2.09s 
     99%    2.16s 
  241 requests in 1.00m, 138.75KB read
Requests/sec:      4.02
Transfer/sec:      2.31KB
```

- 12 个并发连接，12 个线程，持续 1 分钟，超时时间 10 秒
```bash
wrk -c12 -t12 -d1m --timeout 10s --latency -s post_json.lua http://127.0.0.1:8080/v1/completions
```
```
Running 1m test @ http://127.0.0.1:8080/v1/completions
  12 threads and 12 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     2.79s   173.15ms   3.06s    58.57%
    Req/Sec     0.00      0.00     0.00    100.00%
  Latency Distribution
     50%    2.78s 
     75%    2.95s 
     90%    3.01s 
     99%    3.05s 
  251 requests in 1.00m, 144.62KB read
Requests/sec:      4.18
Transfer/sec:      2.41KB
```

- 16 个并发连接，16 个线程，持续 1 分钟，超时时间 10 秒
```bash
wrk -c16 -t16 -d1m --timeout 10s --latency -s post_json.lua http://127.0.0.1:8080/v1/completions
```
```
Running 1m test @ http://127.0.0.1:8080/v1/completions
  16 threads and 16 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     4.19s   874.57ms   6.40s    61.99%
    Req/Sec     0.00      0.00     0.00    100.00%
  Latency Distribution
     50%    3.82s 
     75%    5.06s 
     90%    5.49s 
     99%    6.04s 
  221 requests in 1.00m, 127.01KB read
Requests/sec:      3.68
Transfer/sec:      2.11KB
```

- 20 个并发连接，20 个线程，持续 1 分钟，超时时间 10 秒
```bash
wrk -c20 -t20 -d1m --timeout 10s --latency -s post_json.lua http://127.0.0.1:8080/v1/completions
```
```
Running 1m test @ http://127.0.0.1:8080/v1/completions
  20 threads and 20 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     6.43s     1.25s    8.16s    61.58%
    Req/Sec     0.00      0.00     0.00    100.00%
  Latency Distribution
     50%    6.98s 
     75%    7.38s 
     90%    7.72s 
     99%    8.09s 
  177 requests in 1.00m, 102.04KB read
Requests/sec:      2.95
Transfer/sec:      1.70KB
```

- 24 个并发连接，24 个线程，持续 1 分钟，超时时间 10 秒
```bash
wrk -c24 -t24 -d1m --timeout 10s --latency -s post_json.lua http://127.0.0.1:8080/v1/completions
```
```
Running 1m test @ http://127.0.0.1:8080/v1/completions
  24 threads and 24 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     9.01s     1.39s   10.00s    88.12%
    Req/Sec     0.00      0.00     0.00    100.00%
  Latency Distribution
     50%    9.52s 
     75%    9.74s 
     90%    9.82s 
     99%   10.00s 
  143 requests in 1.00m, 82.42KB read
  Socket errors: connect 0, read 0, write 0, timeout 42
Requests/sec:      2.38
Transfer/sec:      1.37KB
```
