---
layout: post
title:  "Docker 构建多平台镜像"
date:   2023-05-21 08:00:00 +0800
categories: multi-platform
tags: [Docker, buildx]
---

## 多平台构建器
当前构建器实例是驱动程序 `docker-container`，可以同时指定多个平台。在这种情况下，它会构建一个清单列表，其中包含所有指定架构的镜像。在构建的时候可以并行构建多个架构的镜像。

`docker run` 当您在使用此镜像时 `docker service`，Docker 会根据节点的平台选择正确的镜像。

**有个缺点：必须发布到 Docker Hub 或者私有仓库，因为 Docker 不支持多架构的本地镜像。**

### 查看构建器
```bash
docker buildx ls
```
```
NAME/NODE       DRIVER/ENDPOINT STATUS  BUILDKIT             PLATFORMS
default         docker                                       
  default       default         running v0.11.6+616c3f613b54 linux/arm64, linux/riscv64, linux/ppc64le, linux/s390x, linux/386, linux/mips64, linux/arm/v7, linux/arm/v6, linux/amd64, linux/amd64/v2
desktop-linux * docker                                       
  desktop-linux desktop-linux   running v0.11.6+616c3f613b54 linux/arm64, linux/riscv64, linux/ppc64le, linux/s390x, linux/386, linux/mips64, linux/arm/v7, linux/arm/v6, linux/amd64, linux/amd64/v2
```

### 创建一个新的构建器并使用它
```bash
docker buildx create --name mybuilder --driver docker-container --bootstrap --use
```

查看构建器
```bash
docker buildx ls
```
```
NAME/NODE       DRIVER/ENDPOINT  STATUS  BUILDKIT             PLATFORMS
mybuilder *     docker-container                              
  mybuilder0    desktop-linux    running v0.9.3               linux/arm64, linux/amd64, linux/riscv64, linux/ppc64le, linux/s390x, linux/386, linux/mips64, linux/arm/v7, linux/arm/v6
default         docker                                        
  default       default          running v0.11.6+616c3f613b54 linux/arm64, linux/riscv64, linux/ppc64le, linux/s390x, linux/386, linux/mips64, linux/arm/v7, linux/arm/v6, linux/amd64, linux/amd64/v2
desktop-linux   docker                                        
  desktop-linux desktop-linux    running v0.11.6+616c3f613b54 linux/arm64, linux/riscv64, linux/ppc64le, linux/s390x, linux/386, linux/mips64, linux/arm/v7, linux/arm/v6, linux/amd64, linux/amd64/v2
```

### 切换到默认构建器
```bash
docker buildx use default
```

### 删除构建器
```bash
docker buildx rm mybuilder
```

### 检查当前构建器实例
```bash
docker buildx inspect mybuilder 
```
```
Name:          mybuilder
Driver:        docker-container
Last Activity: 2023-10-12 06:35:08 +0000 UTC

Nodes:
Name:      mybuilder0
Endpoint:  desktop-linux
Status:    running
Buildkit:  v0.9.3
Platforms: linux/arm64, linux/amd64, linux/riscv64, linux/ppc64le, linux/s390x, linux/386, linux/mips64, linux/arm/v7, linux/arm/v6
Labels:
 org.mobyproject.buildkit.worker.executor:    oci
 org.mobyproject.buildkit.worker.hostname:    6e176585c465
 org.mobyproject.buildkit.worker.snapshotter: overlayfs
GC Policy rule#0:
 All:           false
 Filters:       type==source.local,type==exec.cachemount,type==source.git.checkout
 Keep Duration: 48h0m0s
 Keep Bytes:    488.3MiB
GC Policy rule#1:
 All:           false
 Keep Duration: 1440h0m0s
 Keep Bytes:    17.7GiB
GC Policy rule#2:
 All:        false
 Keep Bytes: 17.7GiB
GC Policy rule#3:
 All:        true
 Keep Bytes: 17.7GiB
```
```bash
docker buildx inspect default  
```
```
Name:   default
Driver: docker

Nodes:
Name:      default
Endpoint:  default
Status:    running
Buildkit:  v0.11.6+616c3f613b54
Platforms: linux/arm64, linux/riscv64, linux/ppc64le, linux/s390x, linux/386, linux/mips64, linux/arm/v7, linux/arm/v6, linux/amd64, linux/amd64/v2
Labels:
 org.mobyproject.buildkit.worker.moby.host-gateway-ip: 192.168.65.254
GC Policy rule#0:
 All:           false
 Filters:       type==source.local,type==exec.cachemount,type==source.git.checkout
 Keep Duration: 172.8µs
 Keep Bytes:    2.764GiB
GC Policy rule#1:
 All:           false
 Keep Duration: 5.184ms
 Keep Bytes:    20GiB
GC Policy rule#2:
 All:        false
 Keep Bytes: 20GiB
GC Policy rule#3:
 All:        true
 Keep Bytes: 20GiB
```

### 安装 Emulators
使用 [tonistiigi/binfmt](https://github.com/tonistiigi/binfmt) 安装
```bash
docker run --privileged --rm tonistiigi/binfmt --install linux/arm64,linux/amd64
```
```
installing: arm64 cannot register "/usr/bin/qemu-aarch64" to /proc/sys/fs/binfmt_misc/register: write /proc/sys/fs/binfmt_misc/register: no such file or directory
installing: amd64 OK
{
  "supported": [
    "linux/arm64",
    "linux/amd64",
    "linux/riscv64",
    "linux/ppc64le",
    "linux/s390x",
    "linux/386",
    "linux/mips64",
    "linux/arm/v7",
    "linux/arm/v6"
  ],
  "emulators": [
    "qemu-arm",
    "qemu-i386",
    "qemu-mips64",
    "qemu-ppc64le",
    "qemu-riscv64",
    "qemu-s390x",
    "qemu-x86_64",
    "rosetta"
  ]
}
```

### 卸载 Emulators
```bash
docker run --privileged --rm tonistiigi/binfmt --uninstall "qemu-*"
```

## 构建多平台镜像
### Dockerfile
```dockerfile
FROM python:3.10-slim

RUN --mount=type=cache,target=/var/cache/apt,sharing=locked --mount=type=cache,target=l,sharing=locked \
    apt update && apt install -y git
```

### 构建

```bash
docker buildx build --platform linux/amd64,linux/arm64 -t <username>/<image>:latest --push .
```
* <username> Docker ID, <image> Docker Hub 上的仓库名
* --platform 创建 amd64, arm64 架构的 Linux 映像。
* --push 生成一个多架构清单并将所有图像推送到 Docker Hub。
* --load 生成一个单架构清单并将所有图像加载到本地镜像库。不支持多架构的本地镜像，如：linux/amd64,linux/arm64

### 查看镜像
```bash
docker buildx imagetools inspect wangjunjian/test:apt
```
```
Name:      docker.io/wangjunjian/test:apt
MediaType: application/vnd.docker.distribution.manifest.list.v2+json
Digest:    sha256:82d7b9c3ecdcc37468a4a314950ae4993b9c6790f61c4cfcef04f77f1b4fd096
           
Manifests: 
  Name:      docker.io/wangjunjian/test:apt@sha256:469670d4c09ab6540cb64ce011cc1d4771426108f1784ba7a6c4f755b2dfe146
  MediaType: application/vnd.docker.distribution.manifest.v2+json
  Platform:  linux/arm64
             
  Name:      docker.io/wangjunjian/test:apt@sha256:e43f743ae58e7ef9fc740d50e301a1caac34632a7e47561c5312b4b1869832a0
  MediaType: application/vnd.docker.distribution.manifest.v2+json
  Platform:  linux/amd64
```

## 运行不同架构的镜像
### arm64
```bash
docker run --rm docker.io/wangjunjian/test:apt@sha256:469670d4c09ab6540cb64ce011cc1d4771426108f1784ba7a6c4f755b2dfe146 uname -m
aarch64
```

### amd64
```bash
docker run --rm docker.io/wangjunjian/test:apt@sha256:e43f743ae58e7ef9fc740d50e301a1caac34632a7e47561c5312b4b1869832a0 uname -m
x86_64
```

## 查看系统和架构
```bash
docker image inspect wangjunjian/test:apt --format '{{.Os}}/{{.Architecture}}'
linux/arm64
```

## 默认构建器
默认的 docker 驱动程序目前不支持多平台功能。 请切换到不同的驱动程序（例如“docker buildx create --use”）⬆

### 切换默认构建器
```bash
docker buildx use desktop-linux
```

### 分别创建不同架构的镜像
#### amd64
```bash
docker buildx build --platform linux/amd64 -t wangjunjian/apt:amd64 .
docker push wangjunjian/apt:amd64
```

#### arm64
```bash
docker buildx build --platform linux/arm64 -t wangjunjian/apt:arm64 .
docker push wangjunjian/apt:arm64
```

### 创建清单列表并推送到 Docker Hub
```bash
docker manifest create wangjunjian/apt:latest wangjunjian/apt:amd64 wangjunjian/apt:arm64
docker manifest push wangjunjian/apt:latest
```

也可以不创建清单列表，直接推送。合并清单列表的好处是多个架构使用同一个镜像名，而不是不同架构使用不同的镜像名。


## 参考资料
* [Multi-platform images](https://docs.docker.com/build/building/multi-platform/)
* [Faster Multi-Platform Builds: Dockerfile Cross-Compilation Guide](https://www.docker.com/blog/faster-multi-platform-builds-dockerfile-cross-compilation-guide/)
* [How to Build Multi-Arch Docker Images](https://speedscale.com/blog/how-to-build-multi-arch-docker-images/)
* [Docker Build architecture](https://docs.docker.com/build/architecture/)
* [Dockerfile 参考](https://docs.docker.com/engine/reference/builder/)
* [buildx](https://github.com/docker/buildx/)
* [Binfmt](https://github.com/tonistiigi/binfmt)
* [BuildKit](https://github.com/moby/buildkit)
* [Building Multi-Arch Images for Arm and x86 with Docker Desktop](https://www.docker.com/blog/multi-arch-images/)
* [Docker: Exporting Image for Multiple Architectures](https://stackoverflow.com/questions/73515781/docker-exporting-image-for-multiple-architectures)
* [Relation between linux/arm64 and linux/arm64/v8: are these aliases for each other?](https://stackoverflow.com/questions/70819028/relation-between-linux-arm64-and-linux-arm64-v8-are-these-aliases-for-each-othe)
* [Docker Buildx 版本更新引起的镜像血案](https://z.itpub.net/article/detail/0CDEB0CB6B793FD6B38611B9E15B6FA6)
* [Dockerfile RUN command (shell form) fails for multi-arch builds #2437](https://github.com/moby/buildkit/issues/2437)
* [Building Multi-Architecture Docker Images With Buildx](https://medium.com/@artur.klauser/building-multi-architecture-docker-images-with-buildx-27d80f7e2408)
* [How to build x86 (and others!) Docker images on an M1 Mac](https://blog.jaimyn.dev/how-to-build-multi-architecture-docker-images-on-an-m1-mac/)
* [docker buildx prune](https://docs.docker.com/engine/reference/commandline/buildx_prune/)
* [Docker之磁盘清理](https://www.cnblogs.com/xingxia/p/docker_fdisk.html)
* [Docker container driver](https://docs.docker.com/build/drivers/docker-container/)
* [Frequently asked questions for Mac](https://docs.docker.com/desktop/faqs/macfaqs/)
