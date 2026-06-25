---
type: article
title:  "MinIO Quickstart"
date:   2022-03-01 00:00:00 +0800
tags: [minio, storage, s3, docker, docker-compose, nginx, load-balancing]
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

## 单机分布式（docker-compose）
### 下载配置文件
```shell
wget https://raw.githubusercontent.com/minio/minio/master/docs/orchestration/docker-compose/docker-compose.yaml
wget https://raw.githubusercontent.com/minio/minio/master/docs/orchestration/docker-compose/nginx.conf
```

#### docker-compose.yaml
```yaml
version: '3.7'

# Settings and configurations that are common for all containers
x-minio-common: &minio-common
  image: quay.io/minio/minio:RELEASE.2022-03-03T21-21-16Z
  command: server --console-address ":9001" http://minio{1...4}/data{1...2}
  expose:
    - "9000"
    - "9001"
  environment:
    MINIO_ROOT_USER: minio
    MINIO_ROOT_PASSWORD: minio123
  healthcheck:
    test: ["CMD", "curl", "-f", "http://localhost:9000/minio/health/live"]
    interval: 30s
    timeout: 20s
    retries: 3

# starts 4 docker containers running minio server instances.
# using nginx reverse proxy, load balancing, you can access
# it through port 9000.
services:
  minio1:
    <<: *minio-common
    hostname: minio1
    volumes:
      - data1-1:/data1
      - data1-2:/data2

  minio2:
    <<: *minio-common
    hostname: minio2
    volumes:
      - data2-1:/data1
      - data2-2:/data2

  minio3:
    <<: *minio-common
    hostname: minio3
    volumes:
      - data3-1:/data1
      - data3-2:/data2

  minio4:
    <<: *minio-common
    hostname: minio4
    volumes:
      - data4-1:/data1
      - data4-2:/data2

  nginx:
    image: nginx:1.19.2-alpine
    hostname: nginx
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
    ports:
      - "9000:9000"
      - "9001:9001"
    depends_on:
      - minio1
      - minio2
      - minio3
      - minio4

## By default this config uses default local driver,
## For custom volumes replace with volume driver configuration.
volumes:
  data1-1:
  data1-2:
  data2-1:
  data2-2:
  data3-1:
  data3-2:
  data4-1:
  data4-2:
```

#### nginx.conf
```conf
user  nginx;
worker_processes  auto;

error_log  /var/log/nginx/error.log warn;
pid        /var/run/nginx.pid;

events {
    worker_connections  4096;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    access_log  /var/log/nginx/access.log  main;
    sendfile        on;
    keepalive_timeout  65;

    # include /etc/nginx/conf.d/*.conf;

    upstream minio {
        server minio1:9000;
        server minio2:9000;
        server minio3:9000;
        server minio4:9000;
    }

    upstream console {
        ip_hash;
        server minio1:9001;
        server minio2:9001;
        server minio3:9001;
        server minio4:9001;
    }

    server {
        listen       9000;
        listen  [::]:9000;
        server_name  localhost;

        # To allow special characters in headers
        ignore_invalid_headers off;
        # Allow any size file to be uploaded.
        # Set to a value such as 1000m; to restrict file size to a specific value
        client_max_body_size 0;
        # To disable buffering
        proxy_buffering off;

        location / {
            proxy_set_header Host $http_host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;

            proxy_connect_timeout 300;
            # Default is HTTP/1, keepalive is only enabled in HTTP/1.1
            proxy_http_version 1.1;
            proxy_set_header Connection "";
            chunked_transfer_encoding off;

            proxy_pass http://minio;
        }
    }

    server {
        listen       9001;
        listen  [::]:9001;
        server_name  localhost;

        # To allow special characters in headers
        ignore_invalid_headers off;
        # Allow any size file to be uploaded.
        # Set to a value such as 1000m; to restrict file size to a specific value
        client_max_body_size 0;
        # To disable buffering
        proxy_buffering off;

        location / {
            proxy_set_header Host $http_host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_set_header X-NginX-Proxy true;

            # This is necessary to pass the correct IP to be hashed
            real_ip_header X-Real-IP;

            proxy_connect_timeout 300;
            
            # To support websocket
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
            
            chunked_transfer_encoding off;

            proxy_pass http://console;
        }
    }
}
```

### 修改配置文件 docker-compose.yaml
```yaml
    MINIO_ROOT_USER: admin
    MINIO_ROOT_PASSWORD: 12345678
```

#### 使用默认的配置，卷的目录是 /var/lib/docker/volumes/ 

#### 修改卷定义指定目录。
```yaml
volumes:
  data1-1:
          driver: local
          driver_opts:
                  type: none
                  o: bind
                  device: /data/minio/distributed/data1-1
  data1-2:
          driver: local
          driver_opts:
                  type: none
                  o: bind
                  device: /data/minio/distributed/data1-2
  data2-1:
          driver: local
          driver_opts:
                  type: none
                  o: bind
                  device: /data/minio/distributed/data2-1
  data2-2:
          driver: local
          driver_opts:
                  type: none
                  o: bind
                  device: /data/minio/distributed/data2-2
  data3-1:
          driver: local
          driver_opts:
                  type: none
                  o: bind
                  device: /data/minio/distributed/data3-1
  data3-2:
          driver: local
          driver_opts:
                  type: none
                  o: bind
                  device: /data/minio/distributed/data3-2
  data4-1:
          driver: local
          driver_opts:
                  type: none
                  o: bind
                  device: /data/minio/distributed/data4-1
  data4-2:
          driver: local
          driver_opts:
                  type: none
                  o: bind
                  device: /data/minio/distributed/data4-2
```

#### 删除卷定义，直接在容器中指定目录。
```yaml
services:
  minio1:
    <<: *minio-common
    hostname: minio1
    volumes:
      - /data/minio/distributed/data1-1:/data1
      - /data/minio/distributed/data1-2:/data2

  minio2:
    <<: *minio-common
    hostname: minio2
    volumes:
      - /data/minio/distributed/data2-1:/data1
      - /data/minio/distributed/data2-2:/data2

  minio3:
    <<: *minio-common
    hostname: minio3
    volumes:
      - /data/minio/distributed/data3-1:/data1
      - /data/minio/distributed/data3-2:/data2

  minio4:
    <<: *minio-common
    hostname: minio4
    volumes:
      - /data/minio/distributed/data4-1:/data1
      - /data/minio/distributed/data4-2:/data2

#volumes:
#  data1-1:
#  data1-2:
#  data2-1:
#  data2-2:
#  data3-1:
#  data3-2:
#  data4-1:
#  data4-2:
```

### 部署
```shell
# 指定挂载目录，需要创建目录
mkdir -p /data/minio/distributed/data{1..4}-{1..2}

docker-compose pull
docker-compose up
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

## 查看挂载的目录
### Standalone
```shell
$ tree /data/minio/data/
```
```
/data/minio/data/
└── test
    └── hello.txt
```

### 单机分布式
```shell
$ tree /data/minio/erasure-code/
```
```
/data/minio/erasure-code/
├── data1
│   └── test
│       └── hello.txt
│           └── xl.meta
├── data2
│   └── test
│       └── hello.txt
│           └── xl.meta
├── data3
│   └── test
│       └── hello.txt
│           └── xl.meta
└── data4
    └── test
        └── hello.txt
            └── xl.meta
```

### 单机分布式（docker-compose）
```shell
$ sudo tree /var/lib/docker/volumes/distributed_data{1..4}-{1..2}
$ sudo tree /data/minio/distributed/data{1..4}-{1..2}
```
```
/var/lib/docker/volumes/distributed_data1-1
└── _data
    └── test
        └── hello.txt
            └── xl.meta
/var/lib/docker/volumes/distributed_data1-2
└── _data
    └── test
        └── hello.txt
            └── xl.meta
/var/lib/docker/volumes/distributed_data2-1
└── _data
    └── test
        └── hello.txt
            └── xl.meta
/var/lib/docker/volumes/distributed_data2-2
└── _data
    └── test
        └── hello.txt
            └── xl.meta
/var/lib/docker/volumes/distributed_data3-1
└── _data
    └── test
        └── hello.txt
            └── xl.meta
/var/lib/docker/volumes/distributed_data3-2
└── _data
    └── test
        └── hello.txt
            └── xl.meta
/var/lib/docker/volumes/distributed_data4-1
└── _data
    └── test
        └── hello.txt
            └── xl.meta
/var/lib/docker/volumes/distributed_data4-2
└── _data
    └── test
        └── hello.txt
            └── xl.meta
```

## 参考资料
* [Multi-Cloud Object Storage](https://min.io)
* [MinIO Client Quickstart Guide](https://docs.min.io/docs/minio-client-quickstart-guide.html)
* [Distributed MinIO Quickstart Guide](https://docs.min.io/docs/distributed-minio-quickstart-guide)
* [Deploy MinIO on Docker Compose](https://docs.min.io/docs/deploy-minio-on-docker-compose.html)
* [Creating numerous directories using mkdir](https://unix.stackexchange.com/questions/48750/creating-numerous-directories-using-mkdir)
* [docker-compose volumes syntax for local driver to mount a file](https://stackoverflow.com/questions/61071981/docker-compose-volumes-syntax-for-local-driver-to-mount-a-file)
* [Volumes in Docker Compose tutorial](http://sefidian.com/2021/11/05/volumes-in-docker-compose-tutorial/)
* [Docker Compose file version 3 reference](https://docs.docker.com/compose/compose-file/compose-file-v3/#volumes-for-services-swarms-and-stack-files)
* [Use volumes](https://docs.docker.com/storage/volumes/)
