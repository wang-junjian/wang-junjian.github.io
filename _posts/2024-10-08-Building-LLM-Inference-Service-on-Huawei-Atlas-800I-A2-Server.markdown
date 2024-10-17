---
layout: post
title:  "在华为 Atlas 800I A2 服务器上搭建大模型推理服务"
date:   2024-10-08 10:00:00 +0800
categories: Atlas800 MindIE
tags: [Atlas800, NPU, 910B4, MindIE, LLM]
---

## 下载大模型
```shell
cd /home/luruan/disk1/models
```

### 大型语言模型

- Qwen1.5-7B
```shell
git clone https://www.modelscope.cn/Qwen/Qwen1.5-7B-Chat.git
```

- Qwen2-7B ❌
```shell
git clone https://www.modelscope.cn/Qwen/Qwen2-7B-Instruct.git
```

- Qwen2-72B
```shell
git clone https://www.modelscope.cn/Qwen/Qwen2-72B-Instruct.git
```

### 代码大模型

- DeepSeek-Coder-6.7B
```shell
git clone https://www.modelscope.cn/deepseek-ai/deepseek-coder-6.7b-instruct.git
```

- StarCoder2-15B ❌
```shell
git clone https://www.modelscope.cn/AI-ModelScope/starcoder2-15b.git
```

- CodeGeeX2-6B ❌
```shell
git clone https://www.modelscope.cn/ZhipuAI/codegeex2-6b.git
```

缺少软件包 `sentencepiece`。

### 模型格式转换（bin → safetensor）

因为 MindIE 不支持 `bin` 格式的模型，需要将模型转换为 `safetensor` 格式，使用下面的命令进行转换：
```shell
cd /home/disk1/models/deepseek-coder-6.7b-instruct/
python /home/luruan/cann8.0.rc2/examples/convert/convert_weights.py \
    --model_path /home/disk1/models/deepseek-coder-6.7b-instruct/
```

### 修改配置文件

修改配置文件：`Qwen2-7B-Instruct/config.json`
```json
{
  "torch_dtype": "float16",
}
```

`NPU` 不支持 `bfloat16`，有的模型配置文件需要修改为 `float16`。


## npu-smi
**NPU 不支持卡共享模式，同一个卡不能挂载到多个容器上**

```shell
sudo npu-smi info
```
```
+------------------------------------------------------------------------------------------------+
| npu-smi 24.1.rc2                 Version: 24.1.rc2                                             |
+---------------------------+---------------+----------------------------------------------------+
| NPU   Name                | Health        | Power(W)    Temp(C)           Hugepages-Usage(page)|
| Chip                      | Bus-Id        | AICore(%)   Memory-Usage(MB)  HBM-Usage(MB)        |
+===========================+===============+====================================================+
| 0     910B4               | OK            | 99.1        43                0    / 0             |
| 0                         | 0000:C1:00.0  | 0           0    / 0          30209/ 32768         |
+===========================+===============+====================================================+
| 1     910B4               | OK            | 92.1        41                0    / 0             |
| 0                         | 0000:C2:00.0  | 0           0    / 0          30208/ 32768         |
+===========================+===============+====================================================+
| 2     910B4               | OK            | 90.5        41                0    / 0             |
| 0                         | 0000:81:00.0  | 0           0    / 0          30206/ 32768         |
+===========================+===============+====================================================+
| 3     910B4               | OK            | 86.4        43                0    / 0             |
| 0                         | 0000:82:00.0  | 0           0    / 0          30207/ 32768         |
+===========================+===============+====================================================+
| 4     910B4               | OK            | 87.4        45                0    / 0             |
| 0                         | 0000:01:00.0  | 0           0    / 0          30207/ 32768         |
+===========================+===============+====================================================+
| 5     910B4               | OK            | 90.4        46                0    / 0             |
| 0                         | 0000:02:00.0  | 0           0    / 0          30206/ 32768         |
+===========================+===============+====================================================+
| 6     910B4               | OK            | 88.0        45                0    / 0             |
| 0                         | 0000:41:00.0  | 0           0    / 0          30207/ 32768         |
+===========================+===============+====================================================+
| 7     910B4               | OK            | 92.0        47                0    / 0             |
| 0                         | 0000:42:00.0  | 0           0    / 0          30207/ 32768         |
+===========================+===============+====================================================+
+---------------------------+---------------+----------------------------------------------------+
| NPU     Chip              | Process id    | Process name             | Process memory(MB)      |
+===========================+===============+====================================================+
| 0       0                 | 518867        | mindieservice_b          | 27474                   |
+===========================+===============+====================================================+
| 1       0                 | 518868        | mindieservice_b          | 27474                   |
+===========================+===============+====================================================+
| 2       0                 | 518869        | mindieservice_b          | 27474                   |
+===========================+===============+====================================================+
| 3       0                 | 518870        | mindieservice_b          | 27474                   |
+===========================+===============+====================================================+
| 4       0                 | 518871        | mindieservice_b          | 27474                   |
+===========================+===============+====================================================+
| 5       0                 | 518872        | mindieservice_b          | 27474                   |
+===========================+===============+====================================================+
| 6       0                 | 518873        | mindieservice_b          | 27474                   |
+===========================+===============+====================================================+
| 7       0                 | 518874        | mindieservice_b          | 27474                   |
+===========================+===============+====================================================+
```


## 部署 LLM 推理服务（MindIE）
```shell
sudo docker run -it \
    --name MindIE2 \
    -p 1025:1025 \
    -v /disk1/:/home/disk1 \
    --ipc=host \
    --device=/dev/davinci0 \
    --device=/dev/davinci1 \
    --device=/dev/davinci2 \
    --device=/dev/davinci3 \
    --device=/dev/davinci4 \
    --device=/dev/davinci5 \
    --device=/dev/davinci6 \
    --device=/dev/davinci7 \
    --device=/dev/davinci_manager \
    --device=/dev/devmm_svm \
    --device=/dev/hisi_hdc \
    -v /usr/local/dcmi:/usr/local/dcmi \
    -v /usr/local/bin/npu-smi:/usr/local/bin/npu-smi \
    -v /usr/local/Ascend/driver/lib64/common:/usr/local/Ascend/driver/lib64/common \
    -v /usr/local/Ascend/driver/lib64/driver:/usr/local/Ascend/driver/lib64/driver \
    -v /etc/ascend_install.info:/etc/ascend_install.info \
    -v /etc/vnpu.cfg:/etc/vnpu.cfg \
    -v /usr/local/Ascend/driver/version.info:/usr/local/Ascend/driver/version.info \
    -v /home/luruan:/home/luruan \
    mindie /bin/bash
```

进行 mindie 执行目录
```shell
cd /usr/local/Ascend/mindie/latest/mindie-service/bin
```

配置文件：`../conf/config.json`
```json
{
    "OtherParam" :
    {
        "ResourceParam" :
        {
            "cacheBlockSize" : 128
        },
        "LogParam" :
        {
            "logLevel" : "Info",
            "logPath" : "logs/mindservice.log"
        },
        "ServeParam" :
        {
            "ipAddress" : "127.0.0.1",
            "managementIpAddress" : "127.0.0.2",
            "port" : 1025,
            "managementPort" : 1026,
            "maxLinkNum" : 1000,
            "httpsEnabled" : false,
            "tlsCaPath" : "security/ca/",
            "tlsCaFile" : ["ca.pem"],
            "tlsCert" : "security/certs/server.pem",
            "tlsPk" : "security/keys/server.key.pem",
            "tlsPkPwd" : "security/pass/mindie_server_key_pwd.txt",
            "tlsCrl" : "security/certs/server_crl.pem",
            "managementTlsCaFile" : ["management_ca.pem"],
            "managementTlsCert" : "security/certs/management_server.pem",
            "managementTlsPk" : "security/keys/management_server.key.pem",
            "managementTlsPkPwd" : "security/pass/management_mindie_server_key_pwd.txt",
            "managementTlsCrl" : "security/certs/management_server_crl.pem",
            "kmcKsfMaster" : "tools/pmt/master/ksfa",
            "kmcKsfStandby" : "tools/pmt/standby/ksfb",
            "multiNodesInferPort" : 1120,
            "interNodeTLSEnabled" : true,
            "interNodeTlsCaFile" : "security/ca/ca.pem",
            "interNodeTlsCert" : "security/certs/server.pem",
            "interNodeTlsPk" : "security/keys/server.key.pem",
            "interNodeTlsPkPwd" : "security/pass/mindie_server_key_pwd.txt",
            "interNodeKmcKsfMaster" : "tools/pmt/master/ksfa",
            "interNodeKmcKsfStandby" : "tools/pmt/standby/ksfb"
        }
    },
    "WorkFlowParam" :
    {
        "TemplateParam" :
        {
            "templateType" : "Standard",
            "templateName" : "Standard_llama"
        }
    },
    "ModelDeployParam" :
    {
        "engineName" : "mindieservice_llm_engine",
        "modelInstanceNumber" : 1,
        "tokenizerProcessNumber" : 8,
        "maxSeqLen" : 8192,
        "npuDeviceIds" : [[0,1,2,3,4,5,6,7]],
        "multiNodesInferEnabled" : false,
        "ModelParam" : [
            {
                "modelInstanceType" : "Standard",
                "modelName" : "qwen",
                "modelWeightPath" : "/home/luruan/disk1/models/Qwen1.5-7B-Chat",
                "worldSize" : 8,
                "cpuMemSize" : 5,
                "npuMemSize" : 8,
                "backendType" : "atb",
                "pluginParams" : ""
            }
        ]
    },
    "ScheduleParam" :
    {
        "maxPrefillBatchSize" : 50,
        "maxPrefillTokens" : 8192,
        "prefillTimeMsPerReq" : 150,
        "prefillPolicyType" : 0,
        "decodeTimeMsPerReq" : 50,
        "decodePolicyType" : 0,
        "maxBatchSize" : 200,
        "maxIterTimes" : 8000,
        "maxPreemptCount" : 0,
        "supportSelectBatch" : false,
        "maxQueueDelayMicroseconds" : 5000
    }
}
```
- `maxIterTimes` 要小于 `maxSeqLen`
- 通过设置 `maxIterTimes` 的值，可以控制最大输出长度。

运行模型推理服务：
```shell
./mindieservice_daemon
```


## 部署 LLM 推理服务（vLLM）
### [vLLM](https://github.com/wangshuai09/vllm.git)
- [[Hardware][Ascend] Add Ascend NPU backend #8054](https://github.com/vllm-project/vllm/pull/8054)


## 测试

### curl
```shell
curl 'http://localhost:1025/v1/chat/completions' \
    -H "Content-Type: application/json" \
    -d '{
        "model": "qwen",
        "messages": [ 
            { "role": "system", "content": "你是位人工智能专家。" }, 
            { "role": "user", "content": "解释人工智能" } 
        ]
    }'
```

**MindIE 没有对应的 `/v1/completions`**


## 参考资料
- [GPU Performance (Data Sheets) Quick Reference (2023)](http://arthurchiao.art/blog/gpu-data-sheets/)
- [GPU 进阶笔记（一）：高性能 GPU 服务器硬件拓扑与集群组网（2023](http://arthurchiao.art/blog/gpu-advanced-notes-1-zh/)
- [GPU 进阶笔记（二）：华为昇腾 910B GPU 相关（2023）](http://arthurchiao.art/blog/gpu-advanced-notes-2-zh/)
- [GPU 进阶笔记（三）：华为 NPU/GPU 演进（2024）](http://arthurchiao.art/blog/gpu-advanced-notes-3-zh/)
- [GPU 进阶笔记（四）：NVIDIA GH200 芯片、服务器及集群组网（2024）](http://arthurchiao.art/blog/gpu-advanced-notes-4-zh/)
- [Ascend NPU 架构 & CANN 平台入门学习](https://blog.csdn.net/weixin_44162047/article/details/141755989)
