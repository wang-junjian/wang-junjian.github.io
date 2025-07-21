---
layout: single
title:  "华为 Atlas 800I A2 大模型部署实战（三）：MindIE 安装与配置"
date:   2025-07-19 10:00:00 +0800
categories: 昇腾 NPU
tags: [昇腾, NPU, 910B4, Atlas800IA2, MindIE, Docker, openEuler]
---

<!--more-->

## 服务器配置

**AI 服务器**：华为 Atlas 800I A2 推理服务器

| 组件 | 规格 |
|---|---|
| **CPU** | 鲲鹏 920（5250） |
| **NPU** | 昇腾 910B4（8X32G） |
| **内存** | 1024GB |
| **硬盘** | **系统盘**：450GB SSDX2 RAID1<br>**数据盘**：3.5TB NVME SSDX4 |
| **操作系统** | openEuler 22.03 LTS |


## [MindIE 安装方案](https://www.hiascend.com/document/detail/zh/mindie/20RC2/envdeployment/instg/mindie_instg_0001.html)

MindIE（Mind Inference Engine，昇腾推理引擎）

![](/images/2025/Atlas800IA2/install-mindie.png)


## 安装 Docker

openEuler 22.03 与 CentOS 8 软件栈基本兼容。

### 添加 Docker 仓库
```bash
dnf config-manager --add-repo https://mirrors.aliyun.com/docker-ce/linux/centos/8/aarch64/stable/

cat >/etc/yum.repos.d/docker-ce.repo <<'EOF'
[docker-ce-stable]
name=Docker CE Stable - aarch64
baseurl=https://mirrors.aliyun.com/docker-ce/linux/centos/8/aarch64/stable
enabled=1
gpgcheck=1
gpgkey=https://mirrors.aliyun.com/docker-ce/linux/centos/gpg
EOF
```

### 安装 Docker
```bash
dnf update
dnf install -y docker-ce docker-ce-cli containerd.io
```

### 启动 Docker 服务
```bash
systemctl enable --now docker
```


## 安装 MindIE

### 下载镜像
```bash
wget https://modelers.cn/coderepo/web/v1/file/xieyuxiang/mindie_2.0.RC1_image/main/media/2.0.RC1-800I-A2-py311-openeuler24.03-lts.tar.gz
```

### 导入镜像
```bash
docker load -i 2.0.RC1-800I-A2-py311-openeuler24.03-lts.tar.gz
```


## 准备模型

从内网服务器拷贝的。

```bash
mkdir /models
scp -r lnsoft@172.16.33.66:/data/models/llm/deepseek/DeepSeek-R1-Distill-Qwen-7B /models
```


## 运行 MindIE
### 启动容器
```bash
docker run --net=host --ipc=host -it \
    --name mindie \
    --device=/dev/davinci_manager \
    --device=/dev/hisi_hdc \
    --device=/dev/devmm_svm \
    --device=/dev/davinci0 \
    --device=/dev/davinci1 \
    --device=/dev/davinci2 \
    --device=/dev/davinci3 \
    --device=/dev/davinci4 \
    --device=/dev/davinci5 \
    --device=/dev/davinci6 \
    --device=/dev/davinci7 \
    -v /usr/local/Ascend/driver:/usr/local/Ascend/driver:ro \
    -v /usr/local/sbin:/usr/local/sbin:ro \
    -v /usr/local/dcmi:/usr/local/dcmi \
    -v /models:/models \
    swr.cn-south-1.myhuaweicloud.com/ascendhub/mindie:2.0.RC1-800I-A2-py311-openeuler24.03-lts /bin/bash
```
- --device: 表示映射的设备，可以挂载一个或者多个设备。
  - 需要挂载的设备如下：
    - /dev/davinci_manager：davinci相关的管理设备。
    - /dev/hisi_hdc：hdc相关管理设备。
    - /dev/devmm_svm：内存管理相关设备。
    - /dev/davinci0：需要挂载的卡号。

### 配置 MindIE 服务
```bash
vim /usr/local/Ascend/mindie/latest/mindie-service/conf/config.json
```

```json
{
    "Version" : "1.0.0",

    "ServerConfig" :
    {
        "ipAddress" : "127.0.0.1",
        "managementIpAddress" : "127.0.0.2",
        "port" : 1025,
        "managementPort" : 1026,
        "metricsPort" : 1027,
        "allowAllZeroIpListening" : false,
        "maxLinkNum" : 1000,
        "httpsEnabled" : false,
        "fullTextEnabled" : false,
        "tlsCaPath" : "security/ca/",
        "tlsCaFile" : ["ca.pem"],
        "tlsCert" : "security/certs/server.pem",
        "tlsPk" : "security/keys/server.key.pem",
        "tlsPkPwd" : "security/pass/key_pwd.txt",
        "tlsCrlPath" : "security/certs/",
        "tlsCrlFiles" : ["server_crl.pem"],
        "managementTlsCaFile" : ["management_ca.pem"],
        "managementTlsCert" : "security/certs/management/server.pem",
        "managementTlsPk" : "security/keys/management/server.key.pem",
        "managementTlsPkPwd" : "security/pass/management/key_pwd.txt",
        "managementTlsCrlPath" : "security/management/certs/",
        "managementTlsCrlFiles" : ["server_crl.pem"],
        "kmcKsfMaster" : "tools/pmt/master/ksfa",
        "kmcKsfStandby" : "tools/pmt/standby/ksfb",
        "inferMode" : "standard",
        "interCommTLSEnabled" : true,
        "interCommPort" : 1121,
        "interCommTlsCaPath" : "security/grpc/ca/",
        "interCommTlsCaFiles" : ["ca.pem"],
        "interCommTlsCert" : "security/grpc/certs/server.pem",
        "interCommPk" : "security/grpc/keys/server.key.pem",
        "interCommPkPwd" : "security/grpc/pass/key_pwd.txt",
        "interCommTlsCrlPath" : "security/grpc/certs/",
        "interCommTlsCrlFiles" : ["server_crl.pem"],
        "openAiSupport" : "vllm",
        "tokenTimeout" : 600,
        "e2eTimeout" : 600,
        "distDPServerEnabled":false
    },

    "BackendConfig" : {
        "backendName" : "mindieservice_llm_engine",
        "modelInstanceNumber" : 1,
        "npuDeviceIds" : [[0,1,2,3]],
        "tokenizerProcessNumber" : 8,
        "multiNodesInferEnabled" : false,
        "multiNodesInferPort" : 1120,
        "interNodeTLSEnabled" : true,
        "interNodeTlsCaPath" : "security/grpc/ca/",
        "interNodeTlsCaFiles" : ["ca.pem"],
        "interNodeTlsCert" : "security/grpc/certs/server.pem",
        "interNodeTlsPk" : "security/grpc/keys/server.key.pem",
        "interNodeTlsPkPwd" : "security/grpc/pass/mindie_server_key_pwd.txt",
        "interNodeTlsCrlPath" : "security/grpc/certs/",
        "interNodeTlsCrlFiles" : ["server_crl.pem"],
        "interNodeKmcKsfMaster" : "tools/pmt/master/ksfa",
        "interNodeKmcKsfStandby" : "tools/pmt/standby/ksfb",
        "ModelDeployConfig" :
        {
            "maxSeqLen" : 2560,
            "maxInputTokenLen" : 2048,
            "truncation" : false,
            "ModelConfig" : [
                {
                    "modelInstanceType" : "Standard",
                    "modelName" : "deepseek-r1",
                    "modelWeightPath" : "/models/DeepSeek-R1-Distill-Qwen-7B",
                    "worldSize" : 4,
                    "cpuMemSize" : 5,
                    "npuMemSize" : -1,
                    "backendType" : "atb",
                    "trustRemoteCode" : false
                }
            ]
        },

        "ScheduleConfig" :
        {
            "templateType" : "Standard",
            "templateName" : "Standard_LLM",
            "cacheBlockSize" : 128,

            "maxPrefillBatchSize" : 50,
            "maxPrefillTokens" : 8192,
            "prefillTimeMsPerReq" : 150,
            "prefillPolicyType" : 0,

            "decodeTimeMsPerReq" : 50,
            "decodePolicyType" : 0,

            "maxBatchSize" : 200,
            "maxIterTimes" : 512,
            "maxPreemptCount" : 0,
            "supportSelectBatch" : false,
            "maxQueueDelayMicroseconds" : 5000
        }
    }
}
```

- "httpsEnabled" : false
  - 不启用 HTTPS。
- "modelName" : "deepseek-r1"
  - 模型名称。
- "modelWeightPath" : "/models/DeepSeek-R1-Distill-Qwen-7B"
  - 模型权重路径。

### 启动 MindIE 服务
```bash
cd /usr/local/Ascend/mindie/latest/mindie-service/bin
./mindieservice_daemon
```

### 测试 MindIE 服务

curl 访问 OpenAI 兼容 API

```bash
curl 'http://localhost:1025/v1/chat/completions'     -H "Content-Type: application/json"     -d '{
        "model": "deepseek-r1",
        "messages": [ 
            { "role": "system", "content": "你是位人工智能专家。" }, 
            { "role": "user", "content": "解释人工智能" } 
        ]
    }'
```
```json
{"id":"endpoint_common_1","object":"chat.completion","created":1752806878,"model":"deepseek-r1","choices":[{"index":0,"message":{"role":"assistant","tool_calls":null,"content":"嗯，用户问的是“解释人工智能”，这看起来是一个比较常见的问题。首先，我得理解用户的需求是什么。可能他们想了解人工智能的基本概念，或者是在某个特定领域应用人工智能，但不太清楚具体是什么。也有可能他们对AI的概念感到困惑，想通过简单的解释来打消疑虑。\n\n我应该先从AI的定义入手，说明它是一个多学科交叉的领域，涉及计算机科学、认知科学等。然后，分点解释，这样结构清晰，用户容易理解。比如，AI的定义、主要特点、主要技术、应用场景和挑战。\n\n接下来，每个部分要详细一点，但不要太深入，因为用户可能只是想有个初步了解。比如，在定义部分，可以提到AI是模拟人类智能的系统，同时也要指出它不是人类智能的复制，而是智能的模拟。\n\n在主要特点部分，要强调学习和自适应能力，以及处理复杂任务的能力。这样用户能明白AI在解决问题时的效率和灵活性。\n\n技术方面，要简单解释一些关键的技术，比如机器学习、深度学习，以及自然语言处理，这样用户能有个大致的概念。同时，应用场景要列举一些常见的例子，比如自动驾驶、医疗诊断、客服系统等，这样用户能联想到实际生活中的应用。\n\n最后，挑战部分也很重要，说明AI虽然取得了进展，但还有许多问题，比如伦理和安全问题，以及技术瓶颈。这样用户能有一个全面的认识，知道AI的发展还有待完善。\n\n整体上，语言要简洁明了，避免使用太多专业术语，让用户容易理解。同时，结构要清晰，分点列出，方便阅读和记忆。这样用户不仅能了解AI的基本概念，还能对它的应用和发展方向有一个初步的了解。\n</think>\n\n人工智能（Artificial Intelligence，AI）是指模拟人类智能的系统或技术，能够执行如学习、推理、问题解决、感知和语言理解等任务。简单来说，人工智能是让计算机具备人类-like的智能特征。\n\n人工智能的核心目标是开发能够执行复杂任务的系统，而这些任务通常需要人类智能才能高效完成。以下是一些关键点来解释人工智能：\n\n### 1. **定义**\n人工智能是研究、开发和应用能够模拟人类智能的系统或技术。AI系统通过算法和数据训练，能够执行任务，如：\n   - **学习**：从经验中自适应和改进。\n   - **推理**：基于数据和规则做出决策或预测。\n   - **感知**："},"logprobs":null,"finish_reason":"length"}],"usage":{"prompt_tokens":12,"completion_tokens":512,"total_tokens":524},"prefill_time":625,"decode_time_arr":[52,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,9,10,10,10,9,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,9,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,9,10,10,10,10,10,10,10,10,9,9,10,10,9,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,11,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,13,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,11,10,10,10,10,10,10,10,10,10,10,11,11,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,11,11,10,10,10,10,10,10,10,10,10,12,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,11,10,10,10,10,10,10,10,10,13,12,11,10,10,10,10,10,11,10,10,10,10,10,10,10,10,10,10,10,10,10,10,13,12,12,12,11,10,10,10,10,10,10,10,11,11,10,10,10,10,10,10,10,10,10,11,10,10,10,10,10,10,10,10,12,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,11,11,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,11]}
```


## Docker Compose 部署 MindIE 服务

### 配置文件

**存储目录**：conf/config.json

> 内容参考上面的配置。

### 日志目录

**存储目录**：logs

```bash
mkdir logs
chmod 750 logs
```

### docker-compose.yml

```yaml
version: "3.8"

services:
  mindie:
    image: swr.cn-south-1.myhuaweicloud.com/ascendhub/mindie:2.0.RC1-800I-A2-py311-openeuler24.03-lts
    container_name: mindie
    restart: unless-stopped

    # [2025-07-18 16:08:07.105+08:00] [1] [1] [server] [ERROR] [llm_daemon.cpp:218] : [MIE04E01011C] [daemon] Failed to set process group. errno is 2
    init: true

    # 网络 & 设备
    network_mode: host
    shm_size: 1g
    devices:
      - /dev/davinci_manager
      - /dev/hisi_hdc
      - /dev/devmm_svm
      - /dev/davinci0
      - /dev/davinci1
      - /dev/davinci2
      - /dev/davinci3
      - /dev/davinci4
      - /dev/davinci5
      - /dev/davinci6
      - /dev/davinci7

    # 卷映射
    volumes:
      - /usr/local/Ascend/driver:/usr/local/Ascend/driver:ro
      - /usr/local/sbin:/usr/local/sbin:ro
      - /usr/local/dcmi:/usr/local/dcmi
      # 挂载模型目录
      - /models:/models
      # 把主机准备好的配置挂进去
      - ./conf/config.json:/usr/local/Ascend/mindie/latest/mindie-service/conf/config.json:ro
      # 挂载日志目录
      - ./logs:/root/mindie

    # 启动命令：直接拉起 daemon
    entrypoint: ["/usr/local/Ascend/mindie/latest/mindie-service/bin/mindieservice_daemon"]
```

### 启动服务

```bash
docker-compose up -d
```

### 停止服务

```bash
docker-compose down
```


## 参考资料
- [MindIE 使用指导](https://www.hiascend.com/doc_center/source/zh/mindie/100/mindieservice/servicedev/mindie_service0286.html)
- [MindIE 配置参数说明](https://www.hiascend.com/doc_center/source/zh/mindie/100/mindieservice/servicedev/mindie_service0285.html)
