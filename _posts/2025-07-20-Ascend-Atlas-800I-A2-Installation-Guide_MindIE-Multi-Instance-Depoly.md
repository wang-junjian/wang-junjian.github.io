---
layout: single
title:  "华为 Atlas 800I A2 大模型部署实战（四）：MindIE 多实例 LLM 部署"
date:   2025-07-20 10:00:00 +0800
categories: 昇腾 NPU
tags: [昇腾, NPU, 910B4, Atlas800IA2, MindIE, 防火墙, openEuler]
---

<!--more-->

## 模板

### 创建目录结构

```bash
mkdir -p template
cd template

touch config.json.template compose.yml entrypoint.sh

mkdir -p logs
chmod 750 logs

chmod +x entrypoint.sh
```

**列出目录结构**

```bash
tree template/
```

```plaintext
template/
├── config.json.template
├── compose.yml
├── entrypoint.sh
└── logs
```

### 配置文件

编辑 `config.json.template` 文件

```json
{
    "Version" : "1.0.0",

    "ServerConfig" :
    {
        "ipAddress" : "127.0.0.1",
        "managementIpAddress" : "127.0.0.2",
        "port" : ${MINDIE_PORT},
        "managementPort" : ${MINDIE_MANAGEMENT_PORT},
        "metricsPort" : ${MINDIE_METRICS_PORT},
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
        "npuDeviceIds" : [[${NPU_DEVICE_IDS}]],
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
            "maxSeqLen" : ${MAX_TOKEN_LEN},
            "maxInputTokenLen" : ${MAX_INPUT_TOKEN_LEN},
            "truncation" : false,
            "ModelConfig" : [
                {
                    "modelInstanceType" : "Standard",
                    "modelName" : "${MODEL_NAME}",
                    "modelWeightPath" : "${MODEL_WEIGHT_PATH}",
                    "worldSize" : ${NPU_DEVICE_COUNT},
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
            "maxIterTimes" : ${MAX_OUTPUT_TOKEN_LEN},
            "maxPreemptCount" : 0,
            "supportSelectBatch" : false,
            "maxQueueDelayMicroseconds" : 5000
        }
    }
}
```

定制配置文件中的变量：

- `${MINDIE_PORT}`: MindIE 服务端口
- `${MINDIE_MANAGEMENT_PORT}`: MindIE 管理端口
- `${MINDIE_METRICS_PORT}`: MindIE 监控端口
- `${MODEL_NAME}`: 模型名称
- `${MODEL_WEIGHT_PATH}`: 模型权重路径
- `${NPU_DEVICE_IDS}`: NPU 设备 ID 列表
- `${NPU_DEVICE_COUNT}`: NPU 设备数量
- `${MAX_TOKEN_LEN}`: 最大序列长度
- `${MAX_INPUT_TOKEN_LEN}`: 最大输入令牌长度
- `${MAX_OUTPUT_TOKEN_LEN}`: 最大输出令牌长度

> `MAX_TOKEN_LEN` = `MAX_INPUT_TOKEN_LEN` + `MAX_OUTPUT_TOKEN_LEN`。

- [MindIE Server 配置参数说明](https://www.hiascend.com/document/detail/zh/mindie/20RC1/mindieservice/servicedev/mindie_service0285.html)

#### 对外开放

外网访问 MindIE 服务时，需要配置：
- `ipAddress`：0.0.0.0            # 默认值：127.0.0.1
- `managementIpAddress`：0.0.0.0  # 默认值：127.0.0.2
- `allowAllZeroIpListening`：true

> 如果外网不能访问，可以查看防火墙设置，确保端口开放，或者禁用防火墙。

### 入口脚本

编辑 `entrypoint.sh` 文件

```bash
#!/bin/bash

# 检查 envsubst 是否存在，如果不存在则尝试安装（取决于基础镜像）
# 在基于 Debian/Ubuntu 的镜像中，envsubst 在 gettext 包里
if ! command -v envsubst &> /dev/null
then
    echo "envsubst not found, attempting to install gettext..."
    # 假设容器内有 apt-get 或 yum，这取决于 MindIE 镜像的基础系统
    # 如果 MindIE 镜像不支持包管理，你可能需要构建一个带有 envsubst 的自定义镜像
    if command -v apt-get &> /dev/null; then
        apt-get update && apt-get install -y gettext-base
    elif command -v yum &> /dev/null; then
        yum install -y gettext
    else
        echo "Could not install envsubst. Please ensure 'gettext' is available in your image."
        exit 1
    fi
fi

echo "##############################################################################################"
env

# 确保所有必要的环境变量都已设置，否则使用默认值
: "${MINDIE_PORT:=1025}"
: "${MINDIE_MANAGEMENT_PORT:=1026}"
: "${MINDIE_METRICS_PORT:=1027}"
: "${MODEL_NAME:=qwen2.5}"
: "${MODEL_WEIGHT_PATH:=/models/Qwen/Qwen2.5-0.5B-Instruct}"
: "${NPU_DEVICE_IDS:=0,1,2,3}"
: "${NPU_DEVICE_COUNT:=4}"
: "${MAX_TOKEN_LEN:=8192}"
: "${MAX_INPUT_TOKEN_LEN:=4096}"
: "${MAX_OUTPUT_TOKEN_LEN:=4096}"

# 使用 envsubst 替换模板文件中的变量，并将其写入目标路径
envsubst < /usr/local/Ascend/mindie/latest/mindie-service/conf/config.json.template \
    > /usr/local/Ascend/mindie/latest/mindie-service/conf/config.json

echo "Generated config.json:"
cat /usr/local/Ascend/mindie/latest/mindie-service/conf/config.json

# 执行 MindIE 服务的原始守护进程
exec /usr/local/Ascend/mindie/latest/mindie-service/bin/mindieservice_daemon
```

### Docker Compose 配置

编辑 `compose.yml` 文件

```yaml
name: mindie

services:
  mindie-instance-1:
    image: swr.cn-south-1.myhuaweicloud.com/ascendhub/mindie:2.0.RC1-800I-A2-py311-openeuler24.03-lts
    container_name: mindie1
    restart: unless-stopped

    init: true
    network_mode: host
    shm_size: "1g"

    # 设备映射
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
      - /models:/models
      - ./config.json.template:/usr/local/Ascend/mindie/latest/mindie-service/conf/config.json.template:ro
      - ./entrypoint.sh:/usr/local/Ascend/mindie/latest/mindie-service/entrypoint.sh:ro
      - ./logs:/root/mindie

    # 定义此实例的环境变量
    environment:
      - MINDIE_PORT=1025
      - MINDIE_MANAGEMENT_PORT=1026
      - MINDIE_METRICS_PORT=1027
      - MODEL_NAME=deepseek-r1
      - MODEL_WEIGHT_PATH=/models/deepseek-ai/DeepSeek-R1-Distill-Qwen-7B
      - NPU_DEVICE_IDS=0,1,2,3,4,5,6,7
      - NPU_DEVICE_COUNT=8
      - MAX_TOKEN_LEN=8192
      - MAX_INPUT_TOKEN_LEN=4096
      - MAX_OUTPUT_TOKEN_LEN=4096

    entrypoint: ["/usr/local/Ascend/mindie/latest/mindie-service/entrypoint.sh"]
```

- `init: true`: 确保容器在启动时正确初始化。
- `network_mode: host`: 使用主机网络模式，确保容器可以直接访问主机的网络资源。
- `shm_size: "1g"`: 设置共享内存大小为 1GB。
- `devices`: 映射必要的设备文件，以便容器可以访问 NPU 设备。
- `volumes`: 映射必要的卷，包括模型目录、配置文件和日志目录。
- `environment`: 定义 MindIE 服务的环境变量。

### 日志目录

`logs/`

> MindIE 服务的日志存储目录需要设置为 `750` 权限，以确保只有 root 用户和同组用户可以访问。


## 防火墙设置

### 方法1：临时关闭防火墙（重启后失效）
```bash
systemctl stop firewalld
```

验证防火墙状态：
```bash
systemctl status firewalld
```
如果显示 `inactive (dead)`，说明防火墙已关闭。

### 方法2：永久禁用防火墙（重启后仍关闭）​
```bash
systemctl disable firewalld
```
验证防火墙状态：
```bash
systemctl status firewalld
```
如果显示 `disabled`，说明防火墙已被永久禁用。

### 方法3：指定开放端口（推荐）

如果不想完全关闭防火墙，可以仅放行 MindIE 服务使用的端口（假设端口为 端口号，需替换为实际端口）：
```bash
firewall-cmd --permanent --add-port=端口号/tcp
firewall-cmd --reload
```

验证端口是否放行：
```bash
firewall-cmd --list-ports
```


## 查看 MindIE 服务监听的端口

输出会显示类似 0.0.0.0:端口号或 :::端口号的信息，确认服务是否监听所有 IP（0.0.0.0表示允许外部访问）。

### ss 命令
```bash
ss -tulnp | grep mindie
```
```bash
tcp   LISTEN 0      5             0.0.0.0:2026       0.0.0.0:*    users:(("mindieservice_d",pid=528325,fd=34))
tcp   LISTEN 0      5             0.0.0.0:2027       0.0.0.0:*    users:(("mindieservice_d",pid=528325,fd=36))
tcp   LISTEN 0      5             0.0.0.0:1025       0.0.0.0:*    users:(("mindieservice_d",pid=528326,fd=35))
tcp   LISTEN 0      5             0.0.0.0:1026       0.0.0.0:*    users:(("mindieservice_d",pid=528326,fd=34))
tcp   LISTEN 0      5             0.0.0.0:1027       0.0.0.0:*    users:(("mindieservice_d",pid=528326,fd=36))
tcp   LISTEN 0      5             0.0.0.0:2025       0.0.0.0:*    users:(("mindieservice_d",pid=528325,fd=35))
```

### netstat 命令
```bash
netstat -tulnp | grep mindie
```
```bash
tcp        0      0 0.0.0.0:2026            0.0.0.0:*               LISTEN      528325/mindieservic 
tcp        0      0 0.0.0.0:2027            0.0.0.0:*               LISTEN      528325/mindieservic 
tcp        0      0 0.0.0.0:1025            0.0.0.0:*               LISTEN      528326/mindieservic 
tcp        0      0 0.0.0.0:1026            0.0.0.0:*               LISTEN      528326/mindieservic 
tcp        0      0 0.0.0.0:1027            0.0.0.0:*               LISTEN      528326/mindieservic 
tcp        0      0 0.0.0.0:2025            0.0.0.0:*               LISTEN      528325/mindieservic
```


## 防火墙
### 防火墙服务

- 启动防火墙服务
```bash
systemctl start firewalld
```

- 停止防火墙服务
```bash
systemctl stop firewalld
```

- 查看防火墙服务状态
```bash
systemctl status firewalld
```

- 永久禁用防火墙
```bash
systemctl disable firewalld
```

### 防火墙命令

- 列出当前激活区域的完整防火墙配置
```bash
firewall-cmd --list-all
```

- 只列出当前激活区域中明确开放的端口
```bash
firewall-cmd --list-ports
```

- 检查 firewalld 服务是否正在运行
```bash
firewall-cmd --state
```

- 添加端口
```bash
firewall-cmd --permanent --add-port=端口号/tcp
firewall-cmd --reload
```

- 删除端口
```bash
firewall-cmd --permanent --remove-port=端口号/tcp
firewall-cmd --reload
```


## 单实例部署

拷贝 `template/` 目录到 `deepseek-r1/` 目录

```bash
cp -r template/ deepseek-r1/
```

进入 `deepseek-r1/` 目录

```bash
cd deepseek-r1/
```

启动 MindIE 服务

```bash
docker compose up -d
```

## 多实例部署

拷贝 `template/` 目录到 `deepseek-r1_qwen2.5/` 目录

```bash
cp -r template/ deepseek-r1_qwen2.5/
```

进入 `deepseek-r1_qwen2.5/` 目录

```bash
cd deepseek-r1_qwen2.5/
```

创建日志目录

```bash
mkdir -p logs/mindie1 logs/mindie2
chmod 750 logs/mindie1 logs/mindie2
```

修改 `compose.yml` 文件

```yaml
name: mindie

services:
  mindie-instance-1:
    image: swr.cn-south-1.myhuaweicloud.com/ascendhub/mindie:2.0.RC1-800I-A2-py311-openeuler24.03-lts
    container_name: mindie1
    restart: unless-stopped

    init: true
    network_mode: host
    shm_size: "1g"

    # 设备映射
    devices:
      - /dev/davinci_manager
      - /dev/hisi_hdc
      - /dev/devmm_svm
      - /dev/davinci0
      - /dev/davinci1
      - /dev/davinci2
      - /dev/davinci3

    # 卷映射
    volumes:
      - /usr/local/Ascend/driver:/usr/local/Ascend/driver:ro
      - /usr/local/sbin:/usr/local/sbin:ro
      - /usr/local/dcmi:/usr/local/dcmi
      - /models:/models
      - ./config.json.template:/usr/local/Ascend/mindie/latest/mindie-service/conf/config.json.template:ro
      - ./entrypoint.sh:/usr/local/Ascend/mindie/latest/mindie-service/entrypoint.sh:ro
      - ./logs/mindie1:/root/mindie

    # 定义此实例的环境变量
    environment:
      - MINDIE_PORT=1025
      - MINDIE_MANAGEMENT_PORT=1026
      - MINDIE_METRICS_PORT=1027
      - MODEL_NAME=deepseek-r1
      - MODEL_WEIGHT_PATH=/models/deepseek-ai/DeepSeek-R1-Distill-Qwen-7B
      - NPU_DEVICE_IDS=0,1,2,3
      - NPU_DEVICE_COUNT=4
      - MAX_TOKEN_LEN=8192
      - MAX_INPUT_TOKEN_LEN=4096
      - MAX_OUTPUT_TOKEN_LEN=4096

    entrypoint: ["/usr/local/Ascend/mindie/latest/mindie-service/entrypoint.sh"]

  mindie-instance-2:
    image: swr.cn-south-1.myhuaweicloud.com/ascendhub/mindie:2.0.RC1-800I-A2-py311-openeuler24.03-lts
    container_name: mindie2
    restart: unless-stopped

    init: true
    network_mode: host
    shm_size: "1g"

    # 设备映射
    devices:
      - /dev/davinci_manager
      - /dev/hisi_hdc
      - /dev/devmm_svm
      - /dev/davinci4
      - /dev/davinci5
      - /dev/davinci6
      - /dev/davinci7

    # 卷映射
    volumes:
      - /usr/local/Ascend/driver:/usr/local/Ascend/driver:ro
      - /usr/local/sbin:/usr/local/sbin:ro
      - /usr/local/dcmi:/usr/local/dcmi
      - /models:/models
      - ./config.json.template:/usr/local/Ascend/mindie/latest/mindie-service/conf/config.json.template:ro
      - ./entrypoint.sh:/usr/local/Ascend/mindie/latest/mindie-service/entrypoint.sh:ro
      - ./logs/mindie2:/root/mindie

    # 定义此实例的环境变量
    environment:
      - MINDIE_PORT=2025
      - MINDIE_MANAGEMENT_PORT=2026
      - MINDIE_METRICS_PORT=2027
      - MODEL_NAME=qwen2.5
      - MODEL_WEIGHT_PATH=/models/Qwen/Qwen2.5-7B-Instruct
      - NPU_DEVICE_IDS=0,1,2,3
      - NPU_DEVICE_COUNT=4
      - MAX_TOKEN_LEN=8192
      - MAX_INPUT_TOKEN_LEN=4096
      - MAX_OUTPUT_TOKEN_LEN=4096

    entrypoint: ["/usr/local/Ascend/mindie/latest/mindie-service/entrypoint.sh"]
```

启动 MindIE 服务

```bash
docker compose up -d
```


## 测试 MindIE 服务

- 测试 DeepSeek-R1 模型
```bash
curl 'http://localhost:1025/v1/chat/completions'     -H "Content-Type: application/json"     -d '{
        "model": "deepseek-r1",
        "messages": [ 
            { "role": "system", "content": "你是为用户解决问题的AI助手。" }, 
            { "role": "user", "content": "你是谁？" } 
        ]
    }'
```

- 测试 Qwen2.5 模型
```bash
curl 'http://localhost:2025/v1/chat/completions'     -H "Content-Type: application/json"     -d '{
        "model": "qwen2.5",
        "messages": [ 
            { "role": "system", "content": "你是为用户解决问题的AI助手。" }, 
            { "role": "user", "content": "你是谁？" } 
        ]
    }'
```
