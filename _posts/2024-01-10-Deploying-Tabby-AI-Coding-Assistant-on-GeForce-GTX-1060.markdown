---
layout: post
title:  "在 GeForce GTX 1060 上部署 Tabby - AI编码助手"
date:   2024-01-10 12:00:00 +0800
categories: Tabby
tags: [Tabby, GitHubCopilot, CodeLLM, GeForce, GTX1060, GPU, NVIDIA-Driver, Docker, Ubuntu]
---

## 我的 GPU：GP106 [GeForce GTX 1060 6GB]

## 安装 NVIDIA 驱动
### 查看哪些进程正在使用 NVIDIA 设备
```shell
lsof -n -w /dev/nvidia*
```

`lsof` 是一个在 Unix 和类 Unix 系统（如 Linux）上的命令行工具，用于列出当前系统打开的文件。在这里，"文件" 的概念很广泛，除了常见的文件和目录，还包括网络套接字、设备、管道等。

- -n 参数告诉 lsof 不要将网络号转换为主机名，这可以加快 lsof 的运行速度。
- -w 参数告诉 lsof 不要抑制警告信息。
- /dev/nvidia* 是要查看的文件的路径，* 是通配符，表示所有以 /dev/nvidia 开头的文件。在这里，这些文件通常代表 NVIDIA 的设备。

所以，sudo lsof -n -w /dev/nvidia* 命令的作用是查看哪些进程正在使用 NVIDIA 设备。

### 杀死使用 NVIDIA 设备的进程或停止服务
- `kill -9 <pid>`
- `sudo systemctl stop <service_name>`

### 列出系统中所有需要驱动的设备
```shell
sudo ubuntu-drivers devices
```
```
WARNING:root:_pkg_get_support nvidia-driver-525: package has invalid Support PBheader, cannot determine support level
WARNING:root:_pkg_get_support nvidia-driver-525-server: package has invalid Support PBheader, cannot determine support level
WARNING:root:_pkg_get_support nvidia-driver-545: package has invalid Support PBheader, cannot determine support level
WARNING:root:_pkg_get_support nvidia-driver-390: package has invalid Support Legacyheader, cannot determine support level
WARNING:root:_pkg_get_support nvidia-driver-515-server: package has invalid Support PBheader, cannot determine support level
WARNING:root:_pkg_get_support nvidia-driver-535: package has invalid Support PBheader, cannot determine support level
== /sys/devices/pci0000:00/0000:00:01.0/0000:01:00.0 ==
modalias : pci:v000010DEd00001C03sv00001043sd00008618bc03sc00i00
vendor   : NVIDIA Corporation
model    : GP106 [GeForce GTX 1060 6GB]
manual_install: True
driver   : nvidia-driver-410 - third-party non-free
driver   : nvidia-driver-418-server - distro non-free
driver   : nvidia-driver-525 - third-party non-free
driver   : nvidia-driver-470 - third-party non-free recommended
driver   : nvidia-driver-525-server - distro non-free
driver   : nvidia-driver-545 - third-party non-free
driver   : nvidia-driver-390 - distro non-free
driver   : nvidia-driver-515-server - distro non-free
driver   : nvidia-driver-470-server - distro non-free
driver   : nvidia-driver-535 - third-party non-free
driver   : nvidia-driver-450-server - distro non-free
driver   : xserver-xorg-video-nouveau - distro free builtin
```

### 安装 NVIDIA 驱动
```shell
sudo apt install nvidia-driver-525 -y
```

### 重启系统
```shell
sudo reboot
```

### 查看 NVIDIA 驱动是否安装成功
```shell
nvidia-smi
```
```
Tue Jan  9 21:48:15 2024       
+-----------------------------------------------------------------------------+
| NVIDIA-SMI 525.147.05   Driver Version: 525.147.05   CUDA Version: 12.0     |
|-------------------------------+----------------------+----------------------+
| GPU  Name        Persistence-M| Bus-Id        Disp.A | Volatile Uncorr. ECC |
| Fan  Temp  Perf  Pwr:Usage/Cap|         Memory-Usage | GPU-Util  Compute M. |
|                               |                      |               MIG M. |
|===============================+======================+======================|
|   0  NVIDIA GeForce ...  Off  | 00000000:01:00.0 Off |                  N/A |
|  0%   47C    P8     5W / 120W |      2MiB /  6144MiB |      0%      Default |
|                               |                      |                  N/A |
+-------------------------------+----------------------+----------------------+
                                                                               
+-----------------------------------------------------------------------------+
| Processes:                                                                  |
|  GPU   GI   CI        PID   Type   Process name                  GPU Memory |
|        ID   ID                                                   Usage      |
|=============================================================================|
|  No running processes found                                                 |
+-----------------------------------------------------------------------------+
```


## 安装 Docker
1. 设置 Docker 的 apt 源
```shell
# Add Docker's official GPG key:
sudo apt-get update
sudo apt-get install ca-certificates curl gnupg
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

# Add the repository to Apt sources:
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
```

2. 安装 Docker 包
```shell
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

3. 设置无需 sudo 权限就可以运行 docker 命令
```shell
sudo usermod -aG docker wjunjian
```

这个命令是用来将用户 wjunjian 添加到 docker 用户组中。

- sudo：用于以 root 用户权限运行命令。
- usermod：是一个用于修改用户账户的命令。
- -aG：这是 usermod 命令的两个选项，-a 表示追加用户到指定的组，而不是替换用户所在的组，-G 用于指定组名。
- docker：这是要添加的用户组的名称。
- wjunjian：这是要添加到用户组的用户名。

执行这个命令后，用户 wjunjian 将成为 docker 用户组的成员。这通常用于允许用户无需 sudo 权限就可以运行 docker 命令，因为 docker 用户组的成员被授予了执行 docker 命令的权限。


## 卸载 Docker
1. Uninstall the Docker Engine, CLI, containerd, and Docker Compose packages:

```shell
sudo apt-get purge docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin docker-ce-rootless-extras
```

2. Images, containers, volumes, or custom configuration files on your host aren't automatically removed. To delete all images, containers, and volumes:

```shell
sudo rm -rf /var/lib/docker
sudo rm -rf /var/lib/containerd
```


## 安装 NVIDIA Container Toolkit

运行 `docker run --gpus all ...`，出现错误： `docker: Error response from daemon: could not select device driver "" with capabilities: [[gpu]].`

### 设置 nvidia-container-runtime 的 apt 源
```shell
curl -s -L https://nvidia.github.io/nvidia-container-runtime/gpgkey | \
	  sudo apt-key add -
distribution=$(. /etc/os-release;echo $ID$VERSION_ID)
curl -s -L https://nvidia.github.io/nvidia-container-runtime/$distribution/nvidia-container-runtime.list | \
	  sudo tee /etc/apt/sources.list.d/nvidia-container-runtime.list
sudo apt-get update
```
- [docker/nvidia-container-runtime-script.sh](https://github.com/inisis/doc/blob/master/docker/nvidia-container-runtime-script.sh)

### 安装 nvidia-container-runtime
```shell
sudo apt install nvidia-container-runtime
```
- [docker: Error response from daemon: could not select device driver "" with capabilities: [[gpu]].](https://blog.csdn.net/boon_228/article/details/131823459)

### 重启 Docker

```shell
sudo systemctl restart docker
```

## 运行 Tabby 服务
### 代码模型：DeepseekCoder-1.3B
```shell
docker run --rm -it --gpus all --name tabby -p 8080:8080 \
    -v ~/.tabby:/data tabbyml/tabby \
    serve --model TabbyML/DeepseekCoder-1.3B  --device cuda
```
```
2024-01-09T15:59:08.283475Z  INFO tabby::serve: crates/tabby/src/serve.rs:111: Starting server, this might takes a few minutes...
ggml_init_cublas: GGML_CUDA_FORCE_MMQ:   no
ggml_init_cublas: CUDA_USE_TENSOR_CORES: yes
ggml_init_cublas: found 1 CUDA devices:
  Device 0: NVIDIA GeForce GTX 1060 6GB, compute capability 6.1
2024-01-09T15:59:10.445063Z  INFO tabby::routes: crates/tabby/src/routes/mod.rs:35: Listening at 0.0.0.0:8080
```

### 查看 NVIDIA 显卡使用情况
```
+-----------------------------------------------------------------------------+
| NVIDIA-SMI 525.147.05   Driver Version: 525.147.05   CUDA Version: 12.0     |
|-------------------------------+----------------------+----------------------+
| GPU  Name        Persistence-M| Bus-Id        Disp.A | Volatile Uncorr. ECC |
| Fan  Temp  Perf  Pwr:Usage/Cap|         Memory-Usage | GPU-Util  Compute M. |
|                               |                      |               MIG M. |
|===============================+======================+======================|
|   0  NVIDIA GeForce ...  Off  | 00000000:01:00.0 Off |                  N/A |
|  0%   49C    P8     5W / 120W |   2606MiB /  6144MiB |      0%      Default |
|                               |                      |                  N/A |
+-------------------------------+----------------------+----------------------+
                                                                               
+-----------------------------------------------------------------------------+
| Processes:                                                                  |
|  GPU   GI   CI        PID   Type   Process name                  GPU Memory |
|        ID   ID                                                   Usage      |
|=============================================================================|
|    0   N/A  N/A     26131      C   /opt/tabby/bin/tabby             2600MiB |
+-----------------------------------------------------------------------------+
```

## 测试代码生成服务
```shell
curl -X 'POST' \
  'http://gpu1060:8080/v1/completions' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "language": "python",
  "segments": {
    "prefix": "def swap(x, y):\n    ",
    "suffix": "\n    return x, y"
  }
}'
```
```py
{
  "id": "cmpl-4f3f4974-7c19-4a17-86ad-d6cb92515181",
  "choices": [
    {
      "index": 0,
      "text": "x, y = y, x"
    }
  ]
}
```
