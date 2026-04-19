---
layout: single
title:  "华为 Atlas A2 上使用 LLaMA-Factory 模型微调"
date:   2024-11-07 10:00:00 +0800
categories: Atlas800 LLaMA-Factory
tags: [Atlas800, NPU, LLaMA-Factory, Fine-Tuning, LLM]
---

## [济南人工智能计算中心](https://uconsole.jnaicc.com/)

### 菜单

- 云资源
  - ModelArts
    - 开发环境
      - Notebook

### 创建 Notebook

- 自定义镜像：llama2
- 类型：ASCEND
- 规格：Ascend: 8*Ascend910 ARM: 192核 768GB
- 存储配置：云硬盘EVS
  - 磁盘规格：200GB

工作目录：/home/ma-user/work


## 下载模型

### 安装 modelscope

```bash
pip install --upgrade modelscope
```

### SDK 下载模型脚本

编辑 `download.py` 文件

```python
#模型下载
from modelscope import snapshot_download
model_dir = snapshot_download('Qwen/Qwen1.5-7B-Chat')
```

### 设置下载路径

```shell
export MODELSCOPE_CACHE=/home/ma-user/work
```

### 下载

```shell
python download.py
```

### 查看下载的模型

```shell
ll /home/ma-user/work/hub/Qwen/Qwen1___5-7B-Chat
```

### 修改模型配置文件

修改配置文件：`Qwen/Qwen1___5-7B-Chat/config.json`
```json
{
  "torch_dtype": "float16",
}
```

`NPU` 不支持 `bfloat16`，模型配置文件需要修改为 `float16`。


## LLaMA-Factory

### 克隆

```bash
git clone https://github.com/hiyouga/LLaMA-Factory
```

**❌ 网络不稳定，多试几次。**

```
Cloning into 'LLaMA-Factory'...
fatal: unable to access 'https://github.com/hiyouga/LLaMA-Factory/': Received HTTP code 503 from proxy after CONNECT
```

### 安装
  
```bash
cd LLaMA-Factory
pip install -e .[metrics]
```

### 设置环境变量

```bash
export ASCEND_HOME_PATH=/usr/local/Ascend/ascend-toolkit/latest
```

### 查看版本信息

```bash
llamafactory-cli version
```
```
----------------------------------------------------------
| Welcome to LLaMA Factory, version 0.9.1.dev0           |
|                                                        |
| Project page: https://github.com/hiyouga/LLaMA-Factory |
----------------------------------------------------------
```


## 模型微调

### 编辑配置文件 `examples/qwen1_5_7B_chat.yaml`

```yaml
### model
model_name_or_path: /home/ma-user/work/hub/Qwen/Qwen1___5-7B-Chat/

### method
stage: sft
do_train: true
finetuning_type: lora
lora_target: all

### ddp
deepspeed: examples/deepspeed/ds_z3_config.json
ddp_timeout: 180000000

### dataset
dataset: identity,alpaca_zh_demo
template: qwen
cutoff_len: 1024
max_samples: 1000
overwrite_cache: true
preprocessing_num_workers: 16

### output
output_dir: saves/Qwen1_5-7B-Chat/lora/sft
logging_steps: 10
save_steps: 100
plot_loss: true
overwrite_output_dir: true

### train
per_device_train_batch_size: 1
gradient_accumulation_steps: 2
learning_rate: 1.0e-4
num_train_epochs: 1
lr_scheduler_type: cosine
warmup_ratio: 0.1
fp16: true

### eval
val_size: 0.1
per_device_eval_batch_size: 1
eval_strategy: steps
eval_steps: 500
```

### 训练

```bash
ASCEND_RT_VISIBLE_DEVICES=0,1,2,3,4,5,6,7 llamafactory-cli train examples/qwen1_5_7B_chat.yaml
```


## 模型评估
- [LLaMA-Factory 评估](https://llamafactory.readthedocs.io/zh-cn/latest/getting_started/eval.html)

### 评估

评估任务的名称：
- mmlu_test
- ceval_validation
- cmmlu_test

```bash
ASCEND_RT_VISIBLE_DEVICES=0,1,2,3,4,5,6,7 llamafactory-cli eval \
  --task mmlu \
  --model_name_or_path /home/ma-user/work/hub/Qwen/Qwen1___5-7B-Chat/ \
  --adapter_name_or_path saves/Qwen1_5-7B-Chat/lora/sft \
  --template qwen \
  --split validation \
  --batch_size 1
```


## 模型推理

### 编辑配置文件 `examples/qwen1_5_7B_chat-infer.yaml`

```yaml
model_name_or_path: /home/ma-user/work/hub/Qwen/Qwen1___5-7B-Chat/
template: qwen
do_sample: false
```

### 推理

```bash
ASCEND_RT_VISIBLE_DEVICES=0,1,2,3 llamafactory-cli chat examples/qwen1_5_7B_chat-infer.yaml
```

- User: 编写快速排序的python代码
- Assistant: 
快速排序是一种常用的排序算法，其基本思想是通过一趟排序将待排记录分隔成独立的两部分，其中一部分记录的关键字均比另一部分的关键字小，然后分别对这两部分记录继续进行排序，以达到整个序列有序。

以下是快速排序的Python代码实现：

```python
def quicksort(arr):
    if len(arr) <= 1:
        return arr  # 如果数组只有一个元素或者为空，直接返回
    else:
        pivot = arr[0]  # 选择第一个元素作为基准
        less = [x for x in arr[1:] if x <= pivot]  # 小于或等于基准的元素
        greater = [x for x in arr[1:] if x > pivot]  # 大于基准的元素
        return quicksort(less) + [pivot] + quicksort(greater)  # 递归排序两部分并合并

# 测试
arr = [3,6,8,10,1,2,1]
print(quicksort(arr))  # 输出：[1, 1, 2, 3, 6, 8, 10]
```

这个代码首先检查数组的长度，如果长度小于等于1，那么就直接返回，因为长度为1或者0的数组已经是有序的。然后选择第一个元素作为基准，将数组分为两部分，一部分是小于等于基准的元素，另一部分是大于基准的元素。然后对这两部分递归地进行快速排序，最后将结果合并。

