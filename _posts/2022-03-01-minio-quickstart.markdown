---
layout: post
title:  "MinIO Quickstart"
date:   2022-03-01 00:00:00 +0800
categories: Storage
tags: [MinIO, Docker, mkdir]
---

使用容器的方式部署 MinIO

## Standalone
```shell
docker run --rm \
  -p 9000:9000 \
  -p 9001:9001 \
  --name minio \
  -v /data/minio/data:/data \
  -e "MINIO_ROOT_USER=admin" \
  -e "MINIO_ROOT_PASSWORD=12345678" \
  minio/minio server /data --console-address ":9001"
```
```
API: http://172.17.0.2:9000  http://127.0.0.1:9000 

Console: http://172.17.0.2:9001 http://127.0.0.1:9001 

Documentation: https://docs.min.io
```

## 单机分布式
```shell
# 创建4个目录
mkdir -p /data/minio/erasure-code/data{1..4}

docker run --rm \
  -p 9000:9000 \
  -p 9001:9001 \
  --name minio-erasure-code \
  -v /data/minio/erasure-code/data1:/data1 \
  -v /data/minio/erasure-code/data2:/data2 \
  -v /data/minio/erasure-code/data3:/data3 \
  -v /data/minio/erasure-code/data4:/data4 \
  -e "MINIO_ROOT_USER=admin" \
  -e "MINIO_ROOT_PASSWORD=12345678" \
  minio/minio server /data{1...4} --console-address ":9001"
```

## 客户端
```shell
$ docker run --rm --entrypoint='' -it minio/mc bash

# 添加云存储，命名为 minio。
mc alias set minio http://172.17.0.2:9000 admin 12345678
mc: Configuration written to `/root/.mc/config.json`. Please update your access credentials.
mc: Successfully created `/root/.mc/share`.
mc: Initialized share uploads `/root/.mc/share/uploads.json` file.
mc: Initialized share downloads `/root/.mc/share/downloads.json` file.
Added `minio` successfully.

# 在 minio 云存储内创建 test 存储桶。
mc mb minio/test
Bucket created successfully `minio/test`.

echo 'Hello World!' > hello.txt
# 拷贝本地文件到云存储内。
mc cp hello.txt minio/test
/hello.txt:                         13 B / 13 B ┃▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓┃ 1.33 KiB/s 0s

# 查看 test 存储桶的文件。
mc ls minio/test
[2022-02-28 08:28:01 UTC]    13B STANDARD hello.txt

# 显示云存储中文件的内容。
mc cat minio/test/hello.txt
Hello World!
```

## 参考资料
* [Multi-Cloud Object Storage](https://min.io)
* [MinIO Client Quickstart Guide](https://docs.min.io/docs/minio-client-quickstart-guide.html)
* [Distributed MinIO Quickstart Guide](https://docs.min.io/docs/distributed-minio-quickstart-guide)
* [Deploy MinIO on Docker Compose](https://docs.min.io/docs/deploy-minio-on-docker-compose.html)
* [Creating numerous directories using mkdir](https://unix.stackexchange.com/questions/48750/creating-numerous-directories-using-mkdir)
