---
layout: post
title:  "加速 Docker 构建镜像"
date:   2023-05-12 10:00:00 +0800
categories: Docker
tags: [Cache, Python, pip, apt, Dockerfile, Mirror, Go, MacBookProM2Max]
---

## 配置镜像源
### Docker
打开 Docker Desktop 的设置，选择 Docker Engine，然后在 JSON 配置中添加镜像源，然后重启就生效，如下：
```json
{
  "registry-mirrors": [
    "https://75oltije.mirror.aliyuncs.com",
    "http://hub-mirror.c.163.com",
    "https://docker.mirrors.ustc.edu.cn"
  ]
}
```

配置文件在 `~/.docker/daemon.json`。

运行 `docker info` 查看配置是否生效。
```shell
$ docker info

Server:
 Registry Mirrors:
  https://75oltije.mirror.aliyuncs.com/
  http://hub-mirror.c.163.com/
  https://docker.mirrors.ustc.edu.cn/
```

### pip
```dockerfile
FROM python:3.10
RUN pip config set global.index-url https://pypi.tuna.tsinghua.edu.cn/simple
RUN pip install --no-cache-dir opencv-python
```

### apt
```dockerfile
FROM ubuntu:20.04
# 设置 apt 源（阿里云），设置完必须 update。
RUN sed -i 's/archive.ubuntu.com/mirrors.aliyun.com/g' /etc/apt/sources.list && apt update
```


## 使用缓存（RUN --mount=type=cache）加速构建
缓存目录的内容在构建器调用之间持续存在，而不使指令缓存无效。缓存挂载只应用于更好的性能。您的构建应该与缓存目录的任何内容一起工作，因为另一个构建可能会覆盖文件，或者如果需要更多存储空间，GC可能会清理它。

### Python
这里的关键要知道容器内 pip 缓存的目录，可以通过 `pip cache dir` 命令查看，如下：

```shell
docker run --rm -it python:3.10 bash
root@37fec7cb71f4:/# pip cache dir
/root/.cache/pip
```

通过 `RUN --mount=type=cache,target=/root/.cache/pip` 挂载到宿主机的目录，然后在宿主机上进行缓存。

```dockerfile
FROM python:3.10
RUN --mount=type=cache,target=/root/.cache/pip \
    pip install -r requirements.txt
```

通过实验发现软件包只要缓存过一次，后续的构建就不会再去下载了，加快了构建速度。

### apt
`/var/lib/apt` 目录包含了APT软件包管理器的状态信息，包括已安装软件包的列表、它们的版本信息和依赖关系等。这个目录还包含了APT软件包管理器的缓存信息，用于在安装、升级和删除软件包时进行快速查询。

`/var/cache/apt` 目录包含了APT软件包管理器的缓存信息，这些缓存信息包括已经下载但尚未安装的软件包文件、软件包索引文件和其他APT软件包管理器使用的文件。这个目录的作用是提高软件包下载和安装的速度，同时减少对软件包源服务器的负载。

这里的关键要知道容器内 apt 缓存的目录，可以通过 `apt-config dump | grep "/apt"` 命令查看，如下：

```shell
docker run --rm -it python:3.10 bash
root@2b614362d52f:/# apt-config dump | grep "/apt"
Dir::State "var/lib/apt";
Dir::Cache "var/cache/apt";
Dir::Etc "etc/apt";
Dir::Bin::methods "/usr/lib/apt/methods";
Dir::Bin::solvers:: "/usr/lib/apt/solvers";
Dir::Bin::planners:: "/usr/lib/apt/planners";
Dir::Media::MountPath "/media/apt";
Dir::Log "var/log/apt";
```

```dockerfile
FROM python:3.10
RUN rm -f /etc/apt/apt.conf.d/docker-clean; echo 'Binary::apt::APT::Keep-Downloaded-Packages "true";' > /etc/apt/apt.conf.d/keep-cache
RUN --mount=type=cache,target=/var/cache/apt,sharing=locked \
  --mount=type=cache,target=l,sharing=locked \
  apt update && apt-get install -y libgl1-mesa-glx
```

### Go
这里的关键要知道容器内 go 缓存的目录，可以通过 `go env GOCACHE` 命令查看，如下：

```shell
docker run --rm -it golang:latest bash
root@0141c5ab6dab:/go# go env GOCACHE
/root/.cache/go-build
```

```dockerfile
FROM golang
RUN --mount=type=cache,target=/root/.cache/go-build \
  go build ...
```

构建镜像的命令如下：
```shell
docker buildx build --platform=linux/arm64 --rm -f Dockerfile -t app:arm64 .
```

* [RUN --mount=type=cache](https://docs.docker.com/engine/reference/builder/#run---mounttypecache)


## 实验
### pip install --no-cache-dir 和 pip install 的区别
#### pip install
```dockerfile
FROM python:3.10
RUN pip install torch --index-url https://download.pytorch.org/whl/cpu
```

```shell
docker buildx build --platform=linux/arm64 --rm -f Dockerfile -t pycache:cache-dir .
```

#### 👍 pip install --no-cache-dir
```dockerfile
FROM python:3.10
RUN pip install --no-cache-dir torch --index-url https://download.pytorch.org/whl/cpu
```

```shell
docker buildx build --platform=linux/arm64 --rm -f Dockerfile -t pycache:no-cache-dir .
```

#### 查看镜像
```shell
docker images | grep pycache

pycache      no-cache-dir     e8f6d5d9e30b   3 minutes ago     1.12GB
pycache      cache-dir        cac074fd8cf3   24 seconds ago    1.33GB
```

在构建镜像应该加 `--no-cache-dir` 可以有效降低镜像的大小，如果不加下载的软件包会被缓存到镜像中，这个没有任何作用。


### RUN --mount=type=cache
#### 👍 RUN --mount=type=cache,target=/root/.cache/pip pip install
```dockerfile
# syntax=docker/dockerfile:1
FROM python:3.10
RUN --mount=type=cache,target=/root/.cache/pip \
    pip install numpy
```

```shell
docker buildx build --platform=linux/arm64 --progress=plain --rm -f Dockerfile -t pycache:volume_cache-dir .

#9 [builder 2/2] RUN --mount=type=cache,target=/root/.cache/pip     pip install numpy
#9 1.513 Collecting numpy
#9 2.354   Downloading numpy-1.24.3-cp310-cp310-manylinux_2_17_aarch64.manylinux2014_aarch64.whl (14.0 MB)
#9 4.304      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 14.0/14.0 MB 6.9 MB/s eta 0:00:00
#9 4.336 Installing collected packages: numpy
#9 5.210 Successfully installed numpy-1.24.3
```

```dockerfile
# syntax=docker/dockerfile:1
FROM python:3.10
RUN --mount=type=cache,target=/root/.cache/pip \
    pip install numpy tqdm
```

```shell
docker buildx build --platform=linux/arm64 --progress=plain --rm -f Dockerfile -t pycache:volume_cache-dir .

#9 [builder 2/2] RUN --mount=type=cache,target=/root/.cache/pip     pip install numpy tqdm
#9 1.484 Collecting numpy
#9 1.516   Using cached numpy-1.24.3-cp310-cp310-manylinux_2_17_aarch64.manylinux2014_aarch64.whl (14.0 MB)
#9 1.858 Collecting tqdm
#9 2.844   Downloading tqdm-4.65.0-py3-none-any.whl (77 kB)
#9 2.857      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 77.1/77.1 kB 9.5 MB/s eta 0:00:00
#9 2.910 Installing collected packages: tqdm, numpy
#9 3.800 Successfully installed numpy-1.24.3 tqdm-4.65.0
```

#### RUN --mount=type=cache,target=/root/.cache/pip pip install --no-cache-dir
```dockerfile
# syntax=docker/dockerfile:1
FROM python:3.10
RUN --mount=type=cache,target=/root/.cache/pip \
    pip install --no-cache-dir numpy
```

```shell
docker buildx build --platform=linux/arm64 --progress=plain --rm -f Dockerfile -t pycache:volume_no-cache-dir .

#9 [builder 2/2] RUN --mount=type=cache,target=/root/.cache/pip     pip install --no-cache-dir numpy
#9 1.762 Collecting numpy
#9 2.580   Downloading numpy-1.24.3-cp310-cp310-manylinux_2_17_aarch64.manylinux2014_aarch64.whl (14.0 MB)
#9 5.233      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 14.0/14.0 MB 4.3 MB/s eta 0:00:00
#9 5.293 Installing collected packages: numpy
#9 6.183 Successfully installed numpy-1.24.3
```

```dockerfile
# syntax=docker/dockerfile:1
FROM python:3.10
RUN --mount=type=cache,target=/root/.cache/pip \
    pip install --no-cache-dir numpy tqdm
```

```shell
docker buildx build --platform=linux/arm64 --progress=plain --rm -f Dockerfile -t pycache:volume_no-cache-dir .

#9 [builder 2/2] RUN --mount=type=cache,target=/root/.cache/pip     pip install --no-cache-dir numpy tqdm
#9 1.560 Collecting numpy
#9 2.437   Downloading numpy-1.24.3-cp310-cp310-manylinux_2_17_aarch64.manylinux2014_aarch64.whl (14.0 MB)
#9 6.461      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 14.0/14.0 MB 2.8 MB/s eta 0:00:00
#9 6.898 Collecting tqdm
#9 7.252   Downloading tqdm-4.65.0-py3-none-any.whl (77 kB)
#9 7.259      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 77.1/77.1 kB 63.8 MB/s eta 0:00:00
#9 7.317 Installing collected packages: tqdm, numpy
#9 8.240 Successfully installed numpy-1.24.3 tqdm-4.65.0
```

#### 查看镜像
```shell
docker images | grep pycache

pycache      volume_cache-dir        d4ac4fc0b423   7 minutes ago    925MB
pycache      volume_no-cache-dir     206036f38062   19 minutes ago   925MB
```


## 参考资料
* [pip Caching](https://pip.pypa.io/en/stable/topics/caching/)
* [Installing from local packages](https://pip.pypa.io/en/stable/user_guide/#installing-from-local-packages)
* [Anaconda Configuring a shared package cache](https://docs.anaconda.com/free/anaconda/packages/shared-pkg-cache/)
* [dockerd daemon](https://docs.docker.com/engine/reference/commandline/dockerd/)
