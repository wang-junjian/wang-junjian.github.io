---
layout: post
title:  "LLaMA-Factory 微调 Text2SQL"
date:   2024-05-07 08:00:00 +0800
categories: LLaMA-Factory Fine-Tuning
tags: [LLaMA-Factory, Fine-Tuning, Text2SQL, LoRA, Qwen]
---

## 安装 [LLaMA-Factory](https://github.com/hiyouga/LLaMA-Factory/blob/main/README_zh.md)

```shell
git clone https://github.com/hiyouga/LLaMA-Factory.git
cd LLaMA-Factory

python -m venv env
source env/bin/activate

pip install -e .[metrics]
```


## 下载模型

- [通义千问1.5-4B-Chat](https://modelscope.cn/models/qwen/Qwen1.5-4B-Chat)

```shell
git clone https://www.modelscope.cn/qwen/Qwen1.5-4B-Chat.git
```


## 自定义数据集

### data/text2sql.json
```json
[
  {
    "instruction": "You are an SQLite database expert. Help users write SQL statements based on the following table schema.\n\n### Table Schema:\n\nCREATE TABLE yxdsj_wshbb_gdfw_day(\n  prov_name varchar(200) DEFAULT NULL COMMENT '省公司名称',\n  city_name varchar(200) DEFAULT NULL COMMENT '地市公司名称',\n  county_name varchar(200) DEFAULT NULL COMMENT '区县公司名称',\n  tousu int(11) DEFAULT NULL COMMENT '投诉数量',\n  yijian int(11) DEFAULT NULL COMMENT '意见数量',\n  acpt_time varchar(200) DEFAULT NULL COMMENT '受理时间',\n  tousu_bwhl  varchar(200) DEFAULT NULL COMMENT '投诉百万户量',\n  yijian_bwhl  varchar(200) DEFAULT NULL COMMENT '意见百万户量'\n)\n\n\n### Question:\n查询今天投诉总数\n\nAnswer:\n",
    "input": "",
    "output": "select sum(tousu) AS 投诉总数 from yxdsj_wshbb_gdfw_day WHERE DATE(acpt_time) = CURDATE()"
  },
  {
    "instruction": "You are an SQLite database expert. Help users write SQL statements based on the following table schema.\n\n### Table Schema:\n\nCREATE TABLE yxdsj_wshbb_gdfw_day(\n  prov_name varchar(200) DEFAULT NULL COMMENT '省公司名称',\n  city_name varchar(200) DEFAULT NULL COMMENT '地市公司名称',\n  county_name varchar(200) DEFAULT NULL COMMENT '区县公司名称',\n  tousu int(11) DEFAULT NULL COMMENT '投诉数量',\n  yijian int(11) DEFAULT NULL COMMENT '意见数量',\n  acpt_time varchar(200) DEFAULT NULL COMMENT '受理时间',\n  tousu_bwhl  varchar(200) DEFAULT NULL COMMENT '投诉百万户量',\n  yijian_bwhl  varchar(200) DEFAULT NULL COMMENT '意见百万户量'\n)\n\n\n### Question:\n查询昨天投诉总数\n\nAnswer:\n",
    "input": "",
    "output": "select sum(tousu) AS 投诉总数 from yxdsj_wshbb_gdfw_day WHERE DATE(acpt_time) = CURDATE() - INTERVAL 1 day"
  }
]
```

### data/dataset_info.json
```json
{
  "text2sql": {
    "file_name": "text2sql.json",
    "columns": {
      "prompt": "instruction",
      "query": "input",
      "response": "output"
    }
  }
}
```


## LoRA 微调

### text2sql/qwen1.5-4b-chat_lora_sft.yaml
```yaml
# model
model_name_or_path: qwen/Qwen1.5-4B-Chat 

# method
stage: sft
do_train: true
finetuning_type: lora
lora_target: q_proj,v_proj

# dataset
dataset: text2sql
template: qwen
cutoff_len: 1024
max_samples: 500
val_size: 0.1
overwrite_cache: true
preprocessing_num_workers: 16

# output
output_dir: text2sql/saves/qwen1.5-4b-chat/lora/sft
logging_steps: 10
save_steps: 1000
plot_loss: true
overwrite_output_dir: true

# train
per_device_train_batch_size: 2
gradient_accumulation_steps: 8
learning_rate: 0.0001
num_train_epochs: 3.0
lr_scheduler_type: cosine
warmup_steps: 0.1
fp16: true

# eval
per_device_eval_batch_size: 1
evaluation_strategy: steps
eval_steps: 500
```

```shell
CUDA_VISIBLE_DEVICES=0 llamafactory-cli train text2sql/qwen1.5-4b-chat_lora_sft.yaml
```


## 推理

### text2sql/qwen1.5-4b-chat_lora_sft-inference.yaml
```yaml
model_name_or_path: qwen/Qwen1.5-4B-Chat
adapter_name_or_path: text2sql/saves/qwen1.5-4b-chat/lora/sft
template: qwen
finetuning_type: lora
```

```shell
CUDA_VISIBLE_DEVICES=0 llamafactory-cli chat text2sql/qwen1.5-4b-chat_lora_sft-inference.yaml
```


## 合并

### text2sql/qwen1.5-4b-chat_lora_sft-merge.yaml
```yaml
# Note: DO NOT use quantized model or quantization_bit when merging lora weights

# model
model_name_or_path:  qwen/Qwen1.5-4B-Chat
adapter_name_or_path: text2sql/saves/qwen1.5-4b-chat/lora/sft
template: qwen
finetuning_type: lora

# export
export_dir: text2sql/models
export_size: 2
export_device: cpu
export_legacy_format: false
```

```shell
CUDA_VISIBLE_DEVICES=0 llamafactory-cli export text2sql/qwen1.5-4b-chat_lora_sft-merge.yaml 
```


## 推理合并后的模型

### text2sql/text2sql-inference.yaml
```yaml
model_name_or_path:  text2sql/models
template: qwen
```

```shell
CUDA_VISIBLE_DEVICES=0 llamafactory-cli chat text2sql/text2sql-inference.yaml
```


## 参考资料
### [自定义数据集](https://github.com/hiyouga/LLaMA-Factory/blob/main/data/README_zh.md)

支持两种格式的数据集：`alpaca` 和 `sharegpt` ，这里使用的是 `alpaca` 格式。

#### alpaca 格式
```json
[
  {
    "instruction": "用户指令（必填）",
    "input": "用户输入（选填）",
    "output": "模型回答（必填）",
    "system": "系统提示词（选填）",
    "history": [
      ["第一轮指令（选填）", "第一轮回答（选填）"],
      ["第二轮指令（选填）", "第二轮回答（选填）"]
    ]
  }
]
```

对于上述格式的数据，dataset_info.json 中的描述应为：

```json
"数据集名称": {
  "file_name": "data.json",
  "columns": {
    "prompt": "instruction",
    "query": "input",
    "response": "output",
    "system": "system"
  }
}
```

#### 参考数据集
- [alpaca_gpt4_data_zh.json](https://github.com/hiyouga/LLaMA-Factory/blob/main/data/alpaca_gpt4_data_zh.json)

```json
[
  {
    "instruction": "保持健康的三个提示。",
    "input": "",
    "output": "以下是保持健康的三个提示：\n\n1. 保持身体活动。每天做适当的身体运动，如散步、跑步或游泳，能促进心血管健康，增强肌肉力量，并有助于减少体重。\n\n2. 均衡饮食。每天食用新鲜的蔬菜、水果、全谷物和脂肪含量低的蛋白质食物，避免高糖、高脂肪和加工食品，以保持健康的饮食习惯。\n\n3. 睡眠充足。睡眠对人体健康至关重要，成年人每天应保证 7-8 小时的睡眠。良好的睡眠有助于减轻压力，促进身体恢复，并提高注意力和记忆力。"
  },
  {
    "instruction": "三原色是什么？",
    "input": "",
    "output": "三原色通常指的是红色、绿色和蓝色（RGB）。它们是通过加色混合原理创建色彩的三种基础颜色。在以发光为基础的显示设备中（如电视、计算机显示器、智能手机和平板电脑显示屏）, 三原色可混合产生大量色彩。其中红色和绿色可以混合生成黄色，红色和蓝色可以混合生成品红色，蓝色和绿色可以混合生成青色。当红色、绿色和蓝色按相等比例混合时，可以产生白色或灰色。\n\n此外，在印刷和绘画中，三原色指的是以颜料为基础的红、黄和蓝颜色（RYB）。这三种颜色用以通过减色混合原理来创建色彩。不过，三原色的具体定义并不唯一，不同的颜色系统可能会采用不同的三原色。"
  }
]
```

- [oaast_sft_zh.json](https://github.com/hiyouga/LLaMA-Factory/blob/main/data/oaast_sft_zh.json)

```json
[
  {
    "instruction": "布洛芬和对乙酰氨基酚的区别是？",
    "input": "",
    "output": "根据维基百科，\n布洛芬（英语：Ibuprofen），是一种非类固醇消炎药（NSAID），常用来止痛、退烧、消炎。可用于治疗经痛、偏头痛，和类风湿性关节炎。\n对乙酰氨基酚（英语：Acetaminophen、Paracetamol、简称：APAP），又称乙酰胺酚、扑热息痛，是一种用于治疗疼痛与发烧的药物。\n这是两种不同的药，详情可以参考维基百科.\n参考链接：\n布洛芬：https://zh.wikipedia.org/wiki/%E5%B8%83%E6%B4%9B%E8%8A%AC\n对乙酰氨基酚：https://zh.wikipedia.org/zh-hans/%E5%AF%B9%E4%B9%99%E9%85%B0%E6%B0%A8%E5%9F%BA%E9%85%9A",
    "history": []
  },
  {
    "instruction": "布洛芬和对乙酰氨基酚的区别是？",
    "input": "",
    "output": "布洛芬 (Ibuprofen) 和对乙酰氨基酚 (Acetaminophen) 是两种常见的非处方药，用于缓解疼痛、发热和关节痛。它们有一些明显的区别：\n\n1. 功效：布洛芬是一种非甾体类消炎药，特别有效于缓解关节痛、肌肉痛和头痛；而对乙酰氨基酚主要用于缓解疼痛和发热。 \n\n2. 方式：布洛芬通过抑制炎症产生的痛觉信号来缓解疼痛；对乙酰氨基酚通过影响大脑对疼痛的感知来缓解疼痛。\n\n3. 肝脏毒性：对乙酰氨基酚可能对肝脏产生毒性，特别是在长期大量使用或与酒精消耗有关时。布洛芬则更少对肝脏产生毒性。\n\n4. 药物相互作用：布洛芬可能与其他药物产生相互作用，特别是与某些血小板减少药物和降压药相互作用。对乙酰氨基酚则不太可能与其他药物产生相互作用。\n\n总体而言，布洛芬和对乙酰氨基酚有各自的特点和适用范围，应该在医生的指导下选择并使用。",
    "history": []
  }
]
```

### yaml 配置参考

#### 参数 examples 目录
```shell
examples/
├── accelerate
│   ├── fsdp_config.yaml
│   ├── master_config.yaml
│   ├── single_config.yaml
│   └── slave_config.yaml
├── deepspeed
│   ├── ds_z2_config.json
│   ├── ds_z2_offload_config.json
│   ├── ds_z3_config.json
│   └── ds_z3_offload_config.json
├── extras
│   ├── badam
│   │   └── llama3_lora_sft.yaml
│   ├── fsdp_qlora
│   │   ├── llama3_lora_sft.yaml
│   │   └── single_node.sh
│   ├── galore
│   │   └── llama3_full_sft.yaml
│   ├── llama_pro
│   │   ├── expand.sh
│   │   └── llama3_freeze_sft.yaml
│   ├── loraplus
│   │   └── llama3_lora_sft.yaml
│   └── mod
│       └── llama3_full_sft.yaml
├── full_multi_gpu
│   ├── llama3_full_predict.yaml
│   ├── llama3_full_sft.yaml
│   ├── multi_node.sh
│   ├── predict.sh
│   └── single_node.sh
├── inference
│   ├── llama3_lora_sft.yaml
│   ├── llama3_vllm.yaml
│   └── llama3.yaml
├── lora_multi_gpu
│   ├── ds_zero3.sh
│   ├── llama3_lora_sft_ds.yaml
│   ├── llama3_lora_sft.yaml
│   ├── multi_node.sh
│   └── single_node.sh
├── lora_single_gpu
│   ├── llama3_lora_dpo.yaml
│   ├── llama3_lora_eval.yaml
│   ├── llama3_lora_orpo.yaml
│   ├── llama3_lora_ppo.yaml
│   ├── llama3_lora_predict.yaml
│   ├── llama3_lora_pretrain.yaml
│   ├── llama3_lora_reward.yaml
│   ├── llama3_lora_sft.yaml
│   ├── llama3_preprocess.yaml
│   └── llava1_5_lora_sft.yaml
├── merge_lora
│   ├── llama3_gptq.yaml
│   └── llama3_lora_sft.yaml
├── qlora_single_gpu
│   ├── llama3_lora_sft_aqlm.yaml
│   ├── llama3_lora_sft_awq.yaml
│   ├── llama3_lora_sft_bitsandbytes.yaml
│   └── llama3_lora_sft_gptq.yaml
├── README.md
└── README_zh.md
```

- [StarCoder](https://github.com/bigcode-project/starcoder)
- [PEFT](https://github.com/huggingface/peft)
- [torchtune](https://github.com/pytorch/torchtune)
