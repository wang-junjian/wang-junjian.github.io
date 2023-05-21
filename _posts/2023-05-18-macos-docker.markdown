---
layout: post
title:  "macOS Docker"
date:   2023-05-18 08:00:00 +0800
categories: Docker
tags: [Uninstall, macOS]
---

今天用 Docker 构建镜像，突然就挂了。重启 Docker，发现 Docker 无法启动了。

## 出现的错误
```
🐳 Building platen-switch:arm64
[+] Building 0.0s (2/2) FINISHED                                                                                                                                                            
 => [internal] load build definition from Dockerfile                                                                                                                                   0.0s
 => => transferring dockerfile: 69B                                                                                                                                                    0.0s
 => [internal] load .dockerignore                                                                                                                                                      0.0s
 => => transferring context: 2B                                                                                                                                                        0.0s
ERROR: failed to solve: rpc error: code = Unknown desc = failed to solve with frontend dockerfile.v0: failed to read dockerfile: failed to create temp dir: mkdir /var/lib/docker/tmp/buildkit-mount1477620899: no space left on device
```


## 分析问题
### 运行诊断工具 com.docker.diagnose check
用于检查 Docker 的配置和运行状态，以及识别任何可能存在的问题和错误。

```bash
/Applications/Docker.app/Contents/MacOS/com.docker.diagnose check
```
```
[2023-05-18T13:04:49.501779000Z][com.docker.diagnose][I] set path configuration to OnHost
Starting diagnostics

[PASS] DD0027: is there available disk space on the host?
[PASS] DD0028: is there available VM disk space?
[PASS] DD0018: does the host support virtualization?
[PASS] DD0001: is the application running?
[PASS] DD0017: can a VM be started?
[PASS] DD0016: is the LinuxKit VM running?
[FAIL] DD0011: are the LinuxKit services running? failed to ping VM diagnosticsd with error: Get "http://ipc/ping": dial unix diagnosticd.sock: connect: no such file or directory
[2023-05-18T13:04:49.515685000Z][com.docker.diagnose][I] ipc.NewClient: 95c8a503-diagnose -> diagnosticd.sock diagnosticsd
[2023-05-18T13:04:49.515875000Z][com.docker.diagnose][I] (8f859b68) 95c8a503-diagnose C->S diagnosticsd GET /ping
[2023-05-18T13:04:49.516437000Z][com.docker.diagnose][W] (8f859b68) 95c8a503-diagnose C<-S NoResponse GET /ping (541.708µs): Get "http://ipc/ping": dial unix diagnosticd.sock: connect: no such file or directory

[FAIL] DD0004: is the Docker engine running? Get "http://ipc/docker": dial unix lifecycle-server.sock: connect: no such file or directory
[2023-05-18T13:04:49.516964000Z][com.docker.diagnose][I] ipc.NewClient: b94e2f4f-com.docker.diagnose -> lifecycle-server.sock VMDockerdAPI
[2023-05-18T13:04:49.517122000Z][com.docker.diagnose][I] (59598382) b94e2f4f-com.docker.diagnose C->S VMDockerdAPI GET /docker
[2023-05-18T13:04:49.517352000Z][com.docker.diagnose][W] (59598382) b94e2f4f-com.docker.diagnose C<-S NoResponse GET /docker (227.625µs): Get "http://ipc/docker": dial unix lifecycle-server.sock: connect: no such file or directory
[2023-05-18T13:04:49.517538000Z][com.docker.diagnose][I] (59598382-1) b94e2f4f-com.docker.diagnose C->S VMDockerdAPI GET /ping
[2023-05-18T13:04:49.517742000Z][com.docker.diagnose][W] (59598382-1) b94e2f4f-com.docker.diagnose C<-S NoResponse GET /ping (202.75µs): Get "http://ipc/ping": dial unix lifecycle-server.sock: connect: no such file or directory
[2023-05-18T13:04:50.518080000Z][com.docker.diagnose][I] (59598382-2) b94e2f4f-com.docker.diagnose C->S VMDockerdAPI GET /ping
[2023-05-18T13:04:50.520244000Z][com.docker.diagnose][W] (59598382-2) b94e2f4f-com.docker.diagnose C<-S NoResponse GET /ping (2.149209ms): Get "http://ipc/ping": dial unix lifecycle-server.sock: connect: no such file or directory
[2023-05-18T13:04:51.521621000Z][com.docker.diagnose][I] (59598382-3) b94e2f4f-com.docker.diagnose C->S VMDockerdAPI GET /ping
[2023-05-18T13:04:51.523699000Z][com.docker.diagnose][W] (59598382-3) b94e2f4f-com.docker.diagnose C<-S NoResponse GET /ping (2.065375ms): Get "http://ipc/ping": dial unix lifecycle-server.sock: connect: no such file or directory
[2023-05-18T13:04:52.524717000Z][com.docker.diagnose][I] (59598382-4) b94e2f4f-com.docker.diagnose C->S VMDockerdAPI GET /ping
[2023-05-18T13:04:52.527212000Z][com.docker.diagnose][W] (59598382-4) b94e2f4f-com.docker.diagnose C<-S NoResponse GET /ping (2.476917ms): Get "http://ipc/ping": dial unix lifecycle-server.sock: connect: no such file or directory
[2023-05-18T13:04:53.528780000Z][com.docker.diagnose][I] (59598382-5) b94e2f4f-com.docker.diagnose C->S VMDockerdAPI GET /ping
[2023-05-18T13:04:53.530506000Z][com.docker.diagnose][W] (59598382-5) b94e2f4f-com.docker.diagnose C<-S NoResponse GET /ping (1.718ms): Get "http://ipc/ping": dial unix lifecycle-server.sock: connect: no such file or directory
[2023-05-18T13:04:54.531471000Z][com.docker.diagnose][I] (59598382-6) b94e2f4f-com.docker.diagnose C->S VMDockerdAPI GET /ping
[2023-05-18T13:04:54.533004000Z][com.docker.diagnose][W] (59598382-6) b94e2f4f-com.docker.diagnose C<-S NoResponse GET /ping (1.521166ms): Get "http://ipc/ping": dial unix lifecycle-server.sock: connect: no such file or directory
[2023-05-18T13:04:55.533955000Z][com.docker.diagnose][I] (59598382-7) b94e2f4f-com.docker.diagnose C->S VMDockerdAPI GET /ping
[2023-05-18T13:04:55.535586000Z][com.docker.diagnose][W] (59598382-7) b94e2f4f-com.docker.diagnose C<-S NoResponse GET /ping (1.622459ms): Get "http://ipc/ping": dial unix lifecycle-server.sock: connect: no such file or directory
[2023-05-18T13:04:56.536569000Z][com.docker.diagnose][I] (59598382-8) b94e2f4f-com.docker.diagnose C->S VMDockerdAPI GET /ping
[2023-05-18T13:04:56.538624000Z][com.docker.diagnose][W] (59598382-8) b94e2f4f-com.docker.diagnose C<-S NoResponse GET /ping (2.049667ms): Get "http://ipc/ping": dial unix lifecycle-server.sock: connect: no such file or directory

[PASS] DD0015: are the binary symlinks installed?
[FAIL] DD0031: does the Docker API work? Cannot connect to the Docker daemon at unix://docker.raw.sock. Is the docker daemon running?
[PASS] DD0013: is the $PATH ok?
Error response from daemon: dial unix docker.raw.sock: connect: no such file or directory
[FAIL] DD0003: is the Docker CLI working? exit status 1
[PASS] DD0038: is the connection to Docker working?
[FAIL] DD0014: are the backend processes running? 1 error occurred:
	* com.docker.vpnkit is not running


[PASS] DD0007: is the backend responding?
[PASS] DD0008: is the native API responding?
[FAIL] DD0009: is the vpnkit API responding? dial unix vpnkit.diag.sock: connect: connection refused
[PASS] DD0010: is the Docker API proxy responding?
[SKIP] DD0030: is the image access management authorized?
[PASS] DD0033: does the host have Internet access?
[PASS] DD0018: does the host support virtualization?
[PASS] DD0001: is the application running?
[PASS] DD0017: can a VM be started?
[PASS] DD0016: is the LinuxKit VM running?
[WARN] DD0011: are the LinuxKit services running? failed to ping VM diagnosticsd with error: Get "http://ipc/ping": dial unix diagnosticd.sock: connect: no such file or directory
[WARN] DD0004: is the Docker engine running? Get "http://ipc/docker": dial unix lifecycle-server.sock: connect: no such file or directory
[PASS] DD0015: are the binary symlinks installed?
[WARN] DD0031: does the Docker API work? Cannot connect to the Docker daemon at unix://docker.raw.sock. Is the docker daemon running?
[WARN] DD0032: do Docker networks overlap with host IPs? Cannot connect to the Docker daemon at unix://docker.raw.sock. Is the docker daemon running?

Please note the following 4 warnings:

1 : The check: are the LinuxKit services running?
    Produced the following warning: failed to ping VM diagnosticsd with error: Get "http://ipc/ping": dial unix diagnosticd.sock: connect: no such file or directory

The Docker engine runs inside a Linux VM as a service. Therefore the services must have started.

2 : The check: is the Docker engine running?
    Produced the following warning: Get "http://ipc/docker": dial unix lifecycle-server.sock: connect: no such file or directory

The Docker engine manages all containers and images on the host. Check the dockerd.log to see why it failed to start.

3 : The check: does the Docker API work?
    Produced the following warning: Cannot connect to the Docker daemon at unix://docker.raw.sock. Is the docker daemon running?

If the Docker API is not available from the host then Docker Desktop will not work correctly.

4 : The check: do Docker networks overlap with host IPs?
    Produced the following warning: Cannot connect to the Docker daemon at unix://docker.raw.sock. Is the docker daemon running?

If the subnet used by a Docker network overlaps with an IP used by the host, then containers
won't be able to contact the overlapping IP addresses.

Try configuring the IP address range used by networks: in your docker-compose.yml.
See https://docs.docker.com/compose/compose-file/compose-file-v2/#ipv4_address-ipv6_address


Please investigate the following 2 issues:

1 : The test: are the LinuxKit services running?
    Failed with: failed to ping VM diagnosticsd with error: Get "http://ipc/ping": dial unix diagnosticd.sock: connect: no such file or directory

The Docker engine runs inside a Linux VM as a service. Therefore the services must have started.

2 : The test: are the backend processes running?
    Failed with: 1 error occurred:
	* com.docker.vpnkit is not running



Not all of the backend processes are running.
```

### Virtual disk 大小
```bash
ll /Users/junjian/Library/Containers/com.docker.docker/Data/vms/0/data
```
```
total 123766216
-rw-r--r--  1 junjian  staff    60G  5 18 21:03 Docker.raw
```


## 解决问题
多次重启和重新安装 Docker 都没有解决问题，最后发现是 Docker.raw 文件60GB，Docker Engine 中设置的垃圾回收是 100GB，导致虚拟磁盘空间用完了，但是不能进行垃圾回收了。

### 删除 Docker 的相关文件
```bash
rm -rf ~/Library/Group\ Containers/group.com.docker
rm -rf ~/Library/Containers/com.docker.docker
rm -rf ~/Library/Application\ Support/Docker\ Desktop
rm -rf /Applications/Docker.app
```

### 安装 Docker Desktop
下载 [Docker Desktop](https://www.docker.com/products/docker-desktop/) 进行安装。

### 设置 Docker Desktop
#### Settings -> General
* [X] Use Virtualization framework

#### Settings -> Resources -> Advanced
* CPUs: 6
* Memory: 12.00 GB
* Swap: 0.00 GB
* Virtual disk limit: 200 GB

#### Settings -> Docker Engine
```json
{
  "builder": {
    "gc": {
      "defaultKeepStorage": "20GB",
      "enabled": true
    }
  },
  "experimental": true,
  "features": {
    "buildkit": true
  },
  "registry-mirrors": [
    "https://75oltije.mirror.aliyuncs.com",
    "http://hub-mirror.c.163.com",
    "https://docker.mirrors.ustc.edu.cn"
  ]
}
```

#### Settings -> Features in development -> Beta features
* [X] Use Rosetta for x86/amd64 emulation on Apple Silicon


## 参考资料
* [Docker Desktop/Troubleshoot and diagnose](https://docs.docker.com/desktop/troubleshoot/overview/#diagnosing-from-the-terminal)
* [如何在 Mac OS 上启动 docker 守护进程](https://ruslan.rocks/posts/how-to-start-docker-daemon-on-mac-os)
* [cannot launch docker desktop for mac](https://stackoverflow.com/questions/69552636/cannot-launch-docker-desktop-for-mac)
