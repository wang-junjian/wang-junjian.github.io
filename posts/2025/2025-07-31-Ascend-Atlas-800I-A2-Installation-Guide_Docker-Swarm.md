---
layout: single
title:  "华为 Atlas 800I A2 大模型部署实战（九）：Docker Swarm 分布式部署"
date:   2025-07-31 10:00:00 +0800
categories: [硬件加速, AI 与大模型]
tags: [昇腾, NPU, 910B4, Atlas800IA2, vllm-ascend, vLLM, LLM, Docker]
---

该文本详细介绍了**在华为 Atlas 800I A2 推理服务器集群上使用 Docker Swarm 部署大型语言模型（LLM）的实践过程**。指导用户**初始化 Docker Swarm 管理器节点并添加工作节点**，以构建一个分布式计算环境。随后，文档展示了**如何创建一个 Docker Stack 配置文件**来部署两个不同的 LLM 服务（Qwen3-30B 和 Coder-32B），并说明了**如何将容器映射到昇腾 NPU 设备**。最后，文本提供了**部署、检查服务状态以及故障排除（如禁用 firewalld）的命令**，并指出此次实验部署`未能成功`❌。

<!-- more -->

## 服务器配置

**AI 服务器**：华为 Atlas 800I A2 推理服务器 X 5

| 组件 | 规格 |
|---|---|
| **CPU** | 鲲鹏 920（5250） |
| **NPU** | 昇腾 910B4（8X32G） |
| **内存** | 1024GB |
| **硬盘** | **系统盘**：450GB SSDX2 RAID1<br>**数据盘**：3.5TB NVME SSDX4 |
| **操作系统** | openEuler 22.03 LTS |


## 初始化 Swarm 集群

### 初始化 manager 节点
**选择一台服务器上初始化 Swarm (manager 节点):**

我们选择 `172.16.33.106` 作为 manager 节点。

```bash
docker swarm init --advertise-addr 172.16.33.106
```

执行后，会输出一段 `docker swarm join` 命令，类似下面这样：

```bash
docker swarm join --token SWMTKN-1-xxxxxxxxxxxxxxxxx 172.16.33.106:2377
```

### 加入 worker 节点
**在其他 4 台服务器 (worker 节点) 上执行加入命令:**

将上面 manager 节点生成的 join 命令，分别在 `172.16.33.107`、`172.16.33.108`、`172.16.33.109`、`172.16.33.110` 上执行。

### 验证集群状态

回到 manager 节点 (`172.16.33.106`)，运行以下命令查看所有节点是否都已加入并处于 Ready 状态：

```bash
docker node ls
```
```bash
docker node ls
ID                            HOSTNAME                STATUS    AVAILABILITY   MANAGER STATUS   ENGINE VERSION
3v1m964m90n336tytz92t8yh4     localhost.localdomain   Ready     Active                          26.1.3
i0d8i9pcy48ara4jxwr0534bj     localhost.localdomain   Ready     Active                          26.1.3
jrv5c27qsgni5h3tmvg331f7i     localhost.localdomain   Ready     Active                          26.1.3
sdpht2bguojhsqsh2km13xayn *   localhost.localdomain   Ready     Active         Leader           26.1.3
zqmocid54xpietlyqhh9d419b     localhost.localdomain   Ready     Active                          26.1.3
```

您应该能看到 1 个 Leader 和 4 个 Worker 节点。


## 创建 Docker Swarm Stack 文件

### 配置文件
文件命名为 `vllm-stack.yml`

```yaml
version: '3.8'

services:
  # 服务一：部署 Qwen3-30B 模型
  vllm-qwen3:
    image: quay.io/ascend/vllm-ascend:v0.9.2rc1
    init: true
    # 使用 overlay 网络，不再使用 host 模式
    networks:
      - vllm-net
    shm_size: 1g
    # 设备映射对于每个节点都是相同的
    devices:
      - /dev/davinci_manager:/dev/davinci_manager
      - /dev/hisi_hdc:/dev/hisi_hdc
      - /dev/devmm_svm:/dev/devmm_svm
      - /dev/davinci0:/dev/davinci0
      - /dev/davinci1:/dev/davinci1
      - /dev/davinci2:/dev/davinci2
      - /dev/davinci3:/dev/davinci3
    # 卷映射，必须保证所有节点上路径都存在
    volumes:
      - /usr/local/dcmi:/usr/local/dcmi
      - /usr/local/bin/npu-smi:/usr/local/bin/npu-smi
      - /usr/local/Ascend/driver/lib64/:/usr/local/Ascend/driver/lib64/
      - /usr/local/Ascend/driver/version.info:/usr/local/Ascend/driver/version.info
      - /etc/ascend_install.info:/etc/ascend_install.info
      - /root/.cache:/root/.cache
      - /models:/models
    environment:
      - VLLM_USE_MODELSCOPE=True
      - PYTORCH_NPU_ALLOC_CONF=max_split_size_mb:256
    entrypoint: ["vllm"]
    command: >
      serve /models/Qwen/Qwen3-30B-A3B
      --served-model-name Qwen/Qwen3-30B-A3B
      --tensor-parallel-size 4
      --enable_expert_parallel
      --port 8001
      --max-model-len 32768
    deploy:
      # 全局模式：在每个节点上都运行一个此服务的实例
      mode: global
      # Swarm 会自动处理重启
      restart_policy:
        condition: on-failure

  # 服务二：部署 Coder-32B 模型
  vllm-coder:
    image: quay.io/ascend/vllm-ascend:v0.9.2rc1
    init: true
    networks:
      - vllm-net
    shm_size: 1g
    devices:
      - /dev/davinci_manager:/dev/davinci_manager
      - /dev/hisi_hdc:/dev/hisi_hdc
      - /dev/devmm_svm:/dev/devmm_svm
      - /dev/davinci4:/dev/davinci4
      - /dev/davinci5:/dev/davinci5
      - /dev/davinci6:/dev/davinci6
      - /dev/davinci7:/dev/davinci7
    volumes:
      - /usr/local/dcmi:/usr/local/dcmi
      - /usr/local/bin/npu-smi:/usr/local/bin/npu-smi
      - /usr/local/Ascend/driver/lib64/:/usr/local/Ascend/driver/lib64/
      - /usr/local/Ascend/driver/version.info:/usr/local/Ascend/driver/version.info
      - /etc/ascend_install.info:/etc/ascend_install.info
      - /root/.cache:/root/.cache
      - /models:/models
    environment:
      - VLLM_USE_MODELSCOPE=True
      - PYTORCH_NPU_ALLOC_CONF=max_split_size_mb:256
    entrypoint: ["vllm"]
    command: >
      serve /models/Qwen/Qwen2.5-Coder-32B-Instruct
      --served-model-name Qwen/Qwen2.5-Coder-32B-Instruct
      --tensor-parallel-size 4
      --port 8002
      --max-model-len 32768
    deploy:
      mode: global
      restart_policy:
        condition: on-failure

# 定义 overlay 网络
networks:
  vllm-net:
    driver: overlay
    attachable: true

# 注意：此 stack 文件中没有 `ports` 映射，因为容器内的 vLLM 服务
# 监听在 8001 和 8002 端口。如果需要从外部直接访问，您需要
# 添加 ports 映射，但这会引入端口冲突问题，因为 global 模式下
# 每个节点都会尝试映射相同的端口。
# 解决方案是在服务前加一个反向代理（如 Nginx），或者在不同
# 节点上访问不同的服务。
#
# 对于 API 调用，最佳方式是部署一个 API 网关或者负载均衡器来
# 统一入口，并转发到 `vllm-qwen3:8001` 或 `vllm-coder:8002`
```

### 部署一个应用栈（stack）

```bash
docker stack deploy -c vllm-stack.yml vllm_cluster
```

### 查看服务运行状态

```bash
docker service ps vllm_cluster_vllm-qwen3
```

### 查看一个特定任务（容器）的详细配置和状态

```bash
docker inspect vllm_cluster_vllm-qwen3.sdpht2bguojhsqsh2km13xayn.45xmyeicmds98hf36t8mq2q3r
```
```bash
"ExitCode": 128,
"Error": "error creating external connectivity network: Failed to Setup IP tables: Unable to enable SKIP DNAT rule:  (iptables failed: iptables --wait -t nat -I DOCKER -i docker_gwbridge -j RETURN: iptables: No chain/target/match by that name.\n (exit status 1))"
```

- 停止并禁用 `firewalld`

Docker 官方文档建议，在使用 Docker 的服务器上禁用 `firewalld`，以避免对 `iptables` 规则的争抢。

```bash
systemctl stop firewalld
systemctl disable firewalld
systemctl restart docker
```

### 查看服务的所有日志（实时跟踪）

```bash
docker service logs -f vllm_cluster_vllm-qwen3
```

### 移除一个应用栈（stack）

```bash
docker stack rm vllm_cluster
```

📌 没有试验成功。
