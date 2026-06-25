---
type: article
title:  "加速 Docker 构建镜像"
date:   2023-05-12 10:00:00 +0800
tags: [docker, buildx, buildkit, dockerfile, cache, pip, apt, mirror, macos, macbookpro]
---

## 查看镜像信息
### 操作系统版本
```shell
cat /etc/os-release 
```

* Debian
```
PRETTY_NAME="Debian GNU/Linux 11 (bullseye)"
NAME="Debian GNU/Linux"
VERSION_ID="11"
VERSION="11 (bullseye)"
VERSION_CODENAME=bullseye
ID=debian
HOME_URL="https://www.debian.org/"
SUPPORT_URL="https://www.debian.org/support"
BUG_REPORT_URL="https://bugs.debian.org/"
```

* Ubuntu
```
PRETTY_NAME="Ubuntu Jammy Jellyfish (development branch)"
NAME="Ubuntu"
VERSION_ID="22.04"
VERSION="22.04 (Jammy Jellyfish)"
VERSION_CODENAME=jammy
ID=ubuntu
ID_LIKE=debian
HOME_URL="https://www.ubuntu.com/"
SUPPORT_URL="https://help.ubuntu.com/"
BUG_REPORT_URL="https://bugs.launchpad.net/ubuntu/"
PRIVACY_POLICY_URL="https://www.ubuntu.com/legal/terms-and-policies/privacy-policy"
UBUNTU_CODENAME=jammy
```

* Alpine
```
NAME="Alpine Linux"
ID=alpine
VERSION_ID=3.15.0
PRETTY_NAME="Alpine Linux v3.15"
HOME_URL="https://alpinelinux.org/"
BUG_REPORT_URL="https://bugs.alpinelinux.org/"
```

### 支持的架构
```shell
uname -m
aarch64
```


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
#### Debian
```dockerfile
FROM python:3.10

RUN sed -i '1i\
deb https://mirrors.aliyun.com/debian/ bullseye main non-free contrib\
# deb-src https://mirrors.aliyun.com/debian/ bullseye main non-free contrib\
deb https://mirrors.aliyun.com/debian-security/ bullseye-security main\
# deb-src https://mirrors.aliyun.com/debian-security/ bullseye-security main\
deb https://mirrors.aliyun.com/debian/ bullseye-updates main non-free contrib\
# deb-src https://mirrors.aliyun.com/debian/ bullseye-updates main non-free contrib\
deb https://mirrors.aliyun.com/debian/ bullseye-backports main non-free contrib\
# deb-src https://mirrors.aliyun.com/debian/ bullseye-backports main non-free contrib\
' /etc/apt/sources.list
```

* [Debian 镜像](https://developer.aliyun.com/mirror/debian)

#### Ubuntu
##### amd64
```dockerfile
FROM ubuntu:22.04

RUN cat << EOF > /etc/apt/sources.list
# 默认注释了源码镜像以提高 apt update 速度，如有需要可自行取消注释
deb http://mirrors.tuna.tsinghua.edu.cn/ubuntu/ jammy main restricted universe multiverse
# deb-src http://mirrors.tuna.tsinghua.edu.cn/ubuntu/ jammy main restricted universe multiverse
deb http://mirrors.tuna.tsinghua.edu.cn/ubuntu/ jammy-updates main restricted universe multiverse
# deb-src http://mirrors.tuna.tsinghua.edu.cn/ubuntu/ jammy-updates main restricted universe multiverse
deb http://mirrors.tuna.tsinghua.edu.cn/ubuntu/ jammy-backports main restricted universe multiverse
# deb-src http://mirrors.tuna.tsinghua.edu.cn/ubuntu/ jammy-backports main restricted universe multiverse

# deb http://mirrors.tuna.tsinghua.edu.cn/ubuntu/ jammy-security main restricted universe multiverse
# # deb-src http://mirrors.tuna.tsinghua.edu.cn/ubuntu/ jammy-security main restricted universe multiverse

deb http://security.ubuntu.com/ubuntu/ jammy-security main restricted universe multiverse
# deb-src http://security.ubuntu.com/ubuntu/ jammy-security main restricted universe multiverse

# 预发布软件源，不建议启用
# deb http://mirrors.tuna.tsinghua.edu.cn/ubuntu/ jammy-proposed main restricted universe multiverse
# # deb-src http://mirrors.tuna.tsinghua.edu.cn/ubuntu/ jammy-proposed main restricted universe multiverse
EOF
```

* [Ubuntu 软件仓库镜像使用帮助](https://mirrors.tuna.tsinghua.edu.cn/help/ubuntu/)

`EOF` 语法是一种多行输入的技巧，它的含义是 `End Of File`，表示输入的结束。在 Shell 命令中，这种语法通常与重定向符号（>或>>）一起使用，将多行文本输入到一个文件中。
* 重定向符号（>）表示将输出重定向到文件并覆盖现有内容。
* 重定向符号（>>）表示将输出重定向到文件并追加到现有内容的末尾。

##### arm64
```dockerfile
FROM ubuntu:22.04

RUN cat << EOF > /etc/apt/sources.list
# 默认注释了源码镜像以提高 apt update 速度，如有需要可自行取消注释
deb http://mirrors.tuna.tsinghua.edu.cn/ubuntu-ports/ jammy main restricted universe multiverse
# deb-src http://mirrors.tuna.tsinghua.edu.cn/ubuntu-ports/ jammy main restricted universe multiverse
deb http://mirrors.tuna.tsinghua.edu.cn/ubuntu-ports/ jammy-updates main restricted universe multiverse
# deb-src http://mirrors.tuna.tsinghua.edu.cn/ubuntu-ports/ jammy-updates main restricted universe multiverse
deb http://mirrors.tuna.tsinghua.edu.cn/ubuntu-ports/ jammy-backports main restricted universe multiverse
# deb-src http://mirrors.tuna.tsinghua.edu.cn/ubuntu-ports/ jammy-backports main restricted universe multiverse

# deb http://mirrors.tuna.tsinghua.edu.cn/ubuntu-ports/ jammy-security main restricted universe multiverse
# # deb-src http://mirrors.tuna.tsinghua.edu.cn/ubuntu-ports/ jammy-security main restricted universe multiverse

deb http://ports.ubuntu.com/ubuntu-ports/ jammy-security main restricted universe multiverse
# deb-src http://ports.ubuntu.com/ubuntu-ports/ jammy-security main restricted universe multiverse

# 预发布软件源，不建议启用
# deb http://mirrors.tuna.tsinghua.edu.cn/ubuntu-ports/ jammy-proposed main restricted universe multiverse
# # deb-src http://mirrors.tuna.tsinghua.edu.cn/ubuntu-ports/ jammy-proposed main restricted universe multiverse
EOF
```

* [Ubuntu Ports 软件仓库镜像使用帮助](https://mirrors.tuna.tsinghua.edu.cn/help/ubuntu-ports/)

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

* [Dockerfile reference](https://github.com/moby/buildkit/blob/master/frontend/dockerfile/docs/reference.md)
* [Buildkit, buildx and docker-compose](https://github.com/FernandoMiguel/Buildkit)
* [docker buildx caching](https://seankhliao.com/blog/12021-01-23-docker-buildx-caching/)

### apt install build-essential --no-install-recommends
```shell
apt-get install build-essential
After this operation, 283 MB of additional disk space will be used.
```

```shell
apt-get install build-essential --no-install-recommends
After this operation, 250 MB of additional disk space will be used.
```


## 知识扩展
### apt 和 apt-get 的区别
apt 和 apt-get 都是 Debian 系统下的包管理工具，但它们在一些方面有所不同：

1. 命令行选项和语法：apt 命令的语法更加简洁和直观，而 apt-get 命令的语法相对复杂一些，需要使用较多的选项和参数。

2. 进度显示：apt-get 命令在安装和升级软件包时会显示完整的进度条，而 apt 命令则只显示简单的进度信息。

3. 快速缓存：apt 命令引入了一个名为“快速缓存”的新特性，可以快速地更新软件包列表信息，从而提高软件包管理的效率。

4. 安全性：apt 命令在软件包安装过程中会自动验证软件包的数字签名，以确保软件包的完整性和安全性。

总体来说，apt 命令相对于 apt-get 命令更加现代化和用户友好，同时也具备更高的安全性和效率。但是，由于 apt 命令是相对较新的工具，它可能在某些旧的 Debian 系统上不可用。此外，一些老练的 Linux 用户可能更熟悉 apt-get 命令，因此在实际使用中，需要根据具体情况选择使用哪个工具。

需要注意的是，apt 和 apt-get 命令虽然有所不同，但它们的底层机制是相同的，都是通过 dpkg 工具来管理软件包的。因此，无论是使用 apt 还是 apt-get，都可以安全地管理和升级 Debian 系统中的软件包。

### apt install `--no-install-recommends`
加入 `--no-install-recommends` 参数可以让 `apt` 在安装软件包时只安装必要的依赖包，而不会安装推荐的依赖包。推荐的依赖包是软件包的建议依赖项，它们通常是可选的，并且不是绝对必需的。这些推荐依赖项通常是为了增强软件包的功能或提供更好的用户体验，但对于某些特定的应用场景来说，这些推荐依赖项可能不是必要的。

使用 `--no-install-recommends` 参数可以减少软件包的安装量，缩短安装时间，并减少系统上的存储空间占用。此外，这也可以避免安装不必要的依赖项，从而提高系统的安全性。

### 安装 OpenGL 库 libgl1-mesa-glx
执行 `apt-get install -y libgl1-mesa-glx` 是为了安装OpenGL库，这是一种用于图形渲染和加速的标准库，它是OpenCV中一些图像处理和计算的基础。在使用OpenCV进行图像处理、计算和显示时，需要使用OpenGL库来实现高效的图形渲染和加速，因此需要先安装 libgl1-mesa-glx 库。

### pip wheel
pip wheel命令是将源代码打包成wheel文件的命令，它的作用是将Python项目打包成单独的wheel文件，以便于在其他机器上安装和使用。这个命令会在当前目录下生成一个.whl文件，这个文件包含了源代码以及项目所依赖的库和资源。

使用pip wheel命令可以将一个Python项目打包成一个wheel文件，这个文件可以被其他人安装和使用，而不需要重新编译和构建项目。这对于需要在多个机器上部署同一个Python项目的情况非常有用。

另外，pip wheel还可以用于将Python项目打包成二进制文件，这可以提高项目的执行效率，特别是项目中包含大量计算密集型的操作时。

## 参考资料
* [pip Caching](https://pip.pypa.io/en/stable/topics/caching/)
* [Installing from local packages](https://pip.pypa.io/en/stable/user_guide/#installing-from-local-packages)
* [Anaconda Configuring a shared package cache](https://docs.anaconda.com/free/anaconda/packages/shared-pkg-cache/)
* [dockerd daemon](https://docs.docker.com/engine/reference/commandline/dockerd/)
* [阿里云镜像](https://developer.aliyun.com/mirror/)
* [清华大学开源软件镜像站](https://mirrors.tuna.tsinghua.edu.cn/)
* [在搭载 M1 及 M2 芯片 MacBook 设备上玩 Stable Diffusion 模型](https://zhuanlan.zhihu.com/p/590869015)
* [The secret gems behind building container images, Enter: BuildKit & Docker Buildx](https://blog.kubesimplify.com/the-secret-gems-behind-building-container-images-enter-buildkit-and-docker-buildx)
