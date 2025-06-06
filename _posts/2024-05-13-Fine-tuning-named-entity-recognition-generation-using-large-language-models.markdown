---
layout: single
title:  "使用大型语言模型微调命名实体识别生成"
date:   2024-05-13 08:00:00 +0800
categories: LLM Fine-Tuning NER
tags: [Qwen, LLaMA-Factory, Fine-Tuning, NER, LoRA, Text2SQL]
---

## 目标
这里探索了借助大型语言模型进行命名实体识别的标注，并在缺少相关类型实体的时候可以自动生成。

定义了一套电力领域的命名实体类型：
- Province: 省份。例如：山东省。
- City: 城市。例如：济南市、济南。
- Company: 供电公司。例如：长清区供电公司、市中供电中心。
- Substation: 供电所。例如：崮山供电所。
- Indicator: 指标。例如：投诉、意见。
- Date: 日期。例如：今天、昨天、今年、去年、本周、上周、本月、上月、3月、本季度、上季度、一季度、今年第一季度、2022年、2024年5月。

理想的情况下的输入可能是这样的：`{DATE}山东省菏泽巨野县供电公司麒麟供电所投诉数量`。

但是用户的输入是多种多样的：
- 山东省菏泽巨野县供电公司麒麟供电所投诉数量
- 菏泽巨野县供电公司麒麟供电所投诉数量
- 菏泽巨野投诉数量
- 菏泽麒麟投诉数量
- 巨野县供电公司麒麟供电所投诉数量
- 巨野麒麟投诉数量
- 巨野投诉数量
- 麒麟供电所投诉数量
- 麒麟投诉数量

通过微调后的模型可以生成如下实体标注：
```xml
<Date>本月</Date><Province>山东省</Province><City>菏泽</City><Company>巨野县供电公司</Company><Substation>麒麟供电所</Substation><Indicator>投诉</Indicator>个数
```


## 总结

使用的大模型 `Qwen1.5-4B-Chat` 微调，`--num_train_epochs` 设置 `2-3` 就可以了。

对于给了 `城市`+`供电所` 和 `供电所` 的情况，模型并不能很好的生成 `供电公司` 和 `城市`+`供电公司`。如下：

- 菏泽麒麟供电所意见个数
```xml
<Province>山东省</Province><City>菏泽</City><Company>曹县供电公司</Company><Substation>麒麟供电所</Substation><Indicator>意见</Indicator>个数
```

- 麒麟供电所投诉百万户量个数
```xml
<Province>山东省</Province><City>临沂</City><Company>莒南县供电公司</Company><Substation>麒麟供电所</Substation><Indicator>投诉百万户量</Indicator>个数
```

有条件可以尝试一下 Qwen1.5-7B-Chat 模型微调。


## 自定义数据集

### Prompt 模板
```
你将获得一个可能包含电力领域的用户消息。你还将获得一个电力领域实体类型列表。你的任务是检测并识别用户消息中提供的所有电力领域实体类型的实例。
## 要求
- 输出必须与输入内容相同。
- 只有在实体列表中匹配电力领域实体的标记应该被包含在XML标签内。
- XML标签来自下面列出的电力领域实体类型列表。
- 确保所有实体都被识别出来。
- 不要进行错误的识别。
- 只输出实体标注的结果，不需要对实体的标注进行解释。

## 电力领域实体类型列表
- Province: 省份。例如：山东省。
- City: 城市。例如：济南市、济南。
- Company: 供电公司。例如：长清区供电公司、市中供电中心。
- Substation: 供电所。例如：崮山供电所。
- Indicator: 指标。例如：投诉、意见。
- Date: 日期。例如：今天、昨天、今年、去年、本周、上周、本月、上月、3月、本季度、上季度、一季度、今年第一季度、2022年、2024年5月。

## 请你对下面的文本进行电力领域命名实体识别标注
{question}
```

### 样本规则
#### 模板 1
- `{city}{company}{substation}{indicator}{total}"`
- `<Province>{province}</Province><City>{city}</City><Company>{company}</Company><Substation>{substation}</Substation><Indicator>{indicator}</Indicator>{total}`

#### 模板 2
- `{city}{indicator}{total}"`
- `"<Province>{province}</Province><City>{city}</City><Indicator>{indicator}</Indicator>{total}`

#### 模板 3
- `{company}{indicator}{total}"`
- `"<Province>{province}</Province><City>{city}</City><Company>{company}</Company><Indicator>{indicator}</Indicator>{total}`

#### 模板 4
- `{city}{company}{indicator}{total}"`
- `"<Province>{province}</Province><City>{city}</City><Company>{company}</Company><Indicator>{indicator}</Indicator>{total}`

#### 模板 5
- `{city}{substation}{indicator}{total}"`
- `<Province>{province}</Province><City>{city}</City><Company>{company}</Company><Substation>{substation}</Substation><Indicator>{indicator}</Indicator>{total}`

#### 模板 6
- `{substation}{indicator}{total}"`
- `<Province>{province}</Province><City>{city}</City><Company>{company}</Company><Substation>{substation}</Substation><Indicator>{indicator}</Indicator>{total}`

#### 模板 7
- `{date}{city}{company}{substation}{indicator}{total}"`
- `<Date>{date}</Date><Province>{province}</Province><City>{city}</City><Company>{company}</Company><Substation>{substation}</Substation><Indicator>{indicator}</Indicator>{total}`

#### 模板 8
- `{date}{city}{indicator}{total}"`
- `"<Date>{date}</Date><Province>{province}</Province><City>{city}</City><Indicator>{indicator}</Indicator>{total}`

#### 模板 9
- `{date}{company}{indicator}{total}"`
- `"<Date>{date}</Date><Province>{province}</Province><City>{city}</City><Company>{company}</Company><Indicator>{indicator}</Indicator>{total}`

#### 模板 10
- `{date}{city}{company}{indicator}{total}"`
- `"<Date>{date}</Date><Province>{province}</Province><City>{city}</City><Company>{company}</Company><Indicator>{indicator}</Indicator>{total}`

#### 模板 11
- `{date}{city}{substation}{indicator}{total}"`
- `<Date>{date}</Date><Province>{province}</Province><City>{city}</City><Company>{company}</Company><Substation>{substation}</Substation><Indicator>{indicator}</Indicator>{total}`

#### 模板 12
- `{date}{substation}{indicator}{total}"`
- `<Date>{date}</Date><Province>{province}</Province><City>{city}</City><Company>{company}</Company><Substation>{substation}</Substation><Indicator>{indicator}</Indicator>{total}`


### 数据集文件 data/ner.json
```json
[
  {
    "instruction": "你将获得一个可能包含电力领域的用户消息。你还将获得一个电力领域实体类型列表。你的任务是检测并识别用户消息中提供的所有电力领域实体类型的实例。\n## 要求\n- 输出必须与输入内容相同。\n- 只有在实体列表中匹配电力领域实体的标记应该被包含在XML标签内。\n- XML标签来自下面列出的电力领域实体类型列表。\n- 确保所有实体都被识别出来。\n- 不要进行错误的识别。\n- 只输出实体标注的结果，不需要对实体的标注进行解释。\n\n## 电力领域实体类型列表\n- Province: 省份。例如：山东省。\n- City: 城市。例如：济南市、济南。\n- Company: 供电公司。例如：长清区供电公司、市中供电中心。\n- Substation: 供电所。例如：崮山供电所。\n- Indicator: 指标。例如：投诉、意见。\n- Date: 日期。例如：今天、昨天、今年、去年、本周、上周、本月、上月、3月、本季度、上季度、一季度、今年第一季度、2022年、2024年5月。\n\n## 请你对下面的文本进行电力领域命名实体识别标注\n菏泽巨野县供电公司麒麟供电所投诉个数\n",
    "input": "",
    "output": "<Province>山东省</Province><City>菏泽</City><Company>巨野县供电公司</Company><Substation>麒麟供电所</Substation><Indicator>投诉</Indicator>个数"
  },
  {
    "instruction": "你将获得一个可能包含电力领域的用户消息。你还将获得一个电力领域实体类型列表。你的任务是检测并识别用户消息中提供的所有电力领域实体类型的实例。\n## 要求\n- 输出必须与输入内容相同。\n- 只有在实体列表中匹配电力领域实体的标记应该被包含在XML标签内。\n- XML标签来自下面列出的电力领域实体类型列表。\n- 确保所有实体都被识别出来。\n- 不要进行错误的识别。\n- 只输出实体标注的结果，不需要对实体的标注进行解释。\n\n## 电力领域实体类型列表\n- Province: 省份。例如：山东省。\n- City: 城市。例如：济南市、济南。\n- Company: 供电公司。例如：长清区供电公司、市中供电中心。\n- Substation: 供电所。例如：崮山供电所。\n- Indicator: 指标。例如：投诉、意见。\n- Date: 日期。例如：今天、昨天、今年、去年、本周、上周、本月、上月、3月、本季度、上季度、一季度、今年第一季度、2022年、2024年5月。\n\n## 请你对下面的文本进行电力领域命名实体识别标注\n菏泽市意见百万户量总数\n",
    "input": "",
    "output": "<Province>山东省</Province><City>菏泽</City><Indicator>意见百万户量</Indicator>总数"
  }
]
```

### 配置数据集 data/dataset_info.json
```json
{
  "ner": {
    "file_name": "ner.json",
    "columns": {
      "prompt": "instruction",
      "query": "input",
      "response": "output"
    }
  }
}
```

## LoRA 微调

```shell
CUDA_VISIBLE_DEVICES=3 llamafactory-cli train \
    --stage sft \
    --do_train True \
    --model_name_or_path qwen/Qwen1.5-4B-Chat \
    --finetuning_type lora \
    --template qwen \
    --flash_attn auto \
    --dataset_dir data \
    --dataset ner \
    --cutoff_len 1024 \
    --learning_rate 5e-05 \
    --num_train_epochs 2.0 \
    --max_samples 100000 \
    --per_device_train_batch_size 2 \
    --gradient_accumulation_steps 8 \
    --lr_scheduler_type cosine \
    --max_grad_norm 1.0 \
    --logging_steps 5 \
    --save_steps 100 \
    --warmup_steps 0 \
    --optim adamw_torch \
    --packing False \
    --report_to none \
    --output_dir ner/saves/Qwen1.5-4B-Chat/lora/sft \
    --overwrite_output_dir True \
    --fp16 True \
    --lora_rank 8 \
    --lora_alpha 16 \
    --lora_dropout 0 \
    --lora_target q_proj,v_proj \
    --plot_loss True
```
- `--max_samples` 可以设置一个很大的值，程序自己会查找数据集的大小。

## 测试

```shell
CUDA_VISIBLE_DEVICES=3 llamafactory-cli chat \
    --model_name_or_path qwen/Qwen1.5-4B-Chat \
    --adapter_name_or_path ner/saves/Qwen1.5-4B-Chat/lora/sft \
    --template qwen \
    --finetuning_type lora
```

### --num_train_epochs 2

- 🙋‍♂️ 菏泽巨野县供电公司麒麟供电所投诉个数
- 🤖 `<Province>山东省</Province><City>菏泽</City><Company>巨野县供电公司</Company><Substation>麒麟供电所</Substation><Indicator>投诉</Indicator>个数`

- 🙋‍♂️ 菏泽市意见百万户量总数
- 🤖 `<Province>山东省</Province><City>菏泽</City><Indicator>意见百万户量</Indicator>总数`

- 🙋‍♂️ 巨野县供电公司投诉总数
- 🤖 `<Province>山东省</Province><City>菏泽</City><Company>巨野县供电公司</Company><Indicator>投诉</Indicator>总数`

- 🙋‍♂️ 菏泽巨野县供电公司意见百万户量总数
- 🤖 `<Province>山东省</Province><City>菏泽</City><Company>巨野县供电公司</Company><Indicator>意见百万户量</Indicator>总数`

- 🙋‍♂️ 菏泽麒麟供电所意见个数
- 🤖 `<Province>山东省</Province><City>菏泽</City><Company>巨野县供电公司</Company><Substation>麒麟供电所</Substation><Indicator>意见</Indicator>个数`

- 🙋‍♂️ 麒麟供电所投诉百万户量个数
- 🤖(❌) `<Province>山东省</Province><City>青岛</City><Company>平度市供电公司</Company><Substation>麒麟供电所</Substation><Indicator>投诉百万户量</Indicator>个数`

- 🙋‍♂️ 本月菏泽市巨野县供电公司麒麟供电所投诉个数
- 🤖 `<Date>本月</Date><Province>山东省</Province><City>菏泽</City><Company>巨野县供电公司</Company><Substation>麒麟供电所</Substation><Indicator>投诉</Indicator>个数`

- 🙋‍♂️ 4月菏泽市意见百万户量总数
- 🤖 `<Date>4月</Date><Province>山东省</Province><City>菏泽</City><Indicator>意见百万户量</Indicator>总数`

- 🙋‍♂️ 三季度巨野县供电公司意见数量
- 🤖 `<Date>三季度</Date><Province>山东省</Province><City>菏泽</City><Company>巨野县供电公司</Company><Indicator>意见</Indicator>数量`

- 🙋‍♂️ 12月菏泽市巨野县供电公司意见总数
- 🤖 `<Date>12月</Date><Province>山东省</Province><City>菏泽</City><Company>巨野县供电公司</Company><Indicator>意见</Indicator>总数`

- 🙋‍♂️ 2020年04月28号菏泽麒麟意见个数
- 🤖(❌) `<Date>2020年04月28号</Date><Province>山东省</Province><City>菏泽</City><Company>曹县供电公司</Company><Substation>麒麟供电所</Substation><Indicator>意见</Indicator>个数`

- 🙋‍♂️ 9月麒麟供电所意见百万户量总数
- 🤖(❌) `<Date>9月</Date><Province>山东省</Province><City>青岛</City><Company>即墨市供电公司</Company><Substation>麒麟供电所</Substation><Indicator>意见百万户量</Indicator>总数`

**使用 `chat` 每次提问前先运行命令 `clear`，避免历史记录影响了。**


### --num_train_epochs 5

- 🙋‍♂️ 菏泽巨野县供电公司麒麟供电所投诉个数
- 🤖 `<Province>山东省</Province><City>菏泽</City><Company>巨野县供电公司</Company><Substation>麒麟供电所</Substation><Indicator>投诉</Indicator>个数`

- 🙋‍♂️ 菏泽市意见百万户量总数
- 🤖 `<Province>山东省</Province><City>菏泽</City><Indicator>意见百万户量</Indicator>总数`

- 🙋‍♂️ 巨野县供电公司投诉总数
- 🤖 `<Province>山东省</Province><City>菏泽</City><Company>巨野县供电公司</Company><Indicator>投诉</Indicator>总数`

- 🙋‍♂️ 菏泽巨野县供电公司意见百万户量总数
- 🤖 `<Province>山东省</Province><City>菏泽</City><Company>巨野县供电公司</Company><Indicator>意见百万户量</Indicator>总数`

- 🙋‍♂️ 菏泽麒麟供电所意见个数
- 🤖(❌) `<Province>山东省</Province><City>菏泽</City><Company>曹县供电公司</Company><Substation>麒麟供电所</Substation><Indicator>意见</Indicator>个数`
    - `有时会成功`

- 🙋‍♂️ 麒麟供电所投诉百万户量个数
- 🤖(❌) `<Province>山东省</Province><City>临沂</City><Company>莒南县供电公司</Company><Substation>麒麟供电所</Substation><Indicator>投诉百万户量</Indicator>个数`

- 🙋‍♂️ 本月菏泽市巨野县供电公司麒麟供电所投诉个数
- 🤖 `<Date>本月</Date><Province>山东省</Province><City>菏泽</City><Company>巨野县供电公司</Company><Substation>麒麟供电所</Substation><Indicator>投诉</Indicator>个数`

- 🙋‍♂️ 4月菏泽市意见百万户量总数
- 🤖 `<Date>4月</Date><Province>山东省</Province><City>菏泽</City><Indicator>意见百万户量</Indicator>总数`

- 🙋‍♂️ 三季度巨野县供电公司意见数量
- 🤖 `<Date>三季度</Date><Province>山东省</Province><City>菏泽</City><Company>巨野县供电公司</Company><Indicator>意见</Indicator>数量`

- 🙋‍♂️ 12月菏泽市巨野县供电公司意见总数
- 🤖 `<Date>12月</Date><Province>山东省</Province><City>菏泽</City><Company>巨野县供电公司</Company><Indicator>意见</Indicator>总数`

- 🙋‍♂️ 2020年04月28号菏泽麒麟意见个数
- 🤖(❌) `<Date>2020年04月28号</Date><Province>山东省</Province><City>菏泽</City><Company>曹县供电公司</Company><Substation>麒麟供电所</Substation><Indicator>意见</Indicator>个数`
    - `有时会成功`

- 🙋‍♂️ 9月麒麟供电所意见百万户量总数
- 🤖(❌) `<Date>9月</Date><Province>山东省</Province><City>潍坊</City><Company>安丘市供电公司</Company><Substation>麒麟供电所</Substation><Indicator>意见百万户量</Indicator>总数`


## 参考
- [LLaMA-Factory 微调 Text2SQL]({% post_url 2024-05-07-LLaMA-Factory-Fine-Tuning-Text2SQL %})
- [微调大型语言模型进行命名实体识别](https://new.qq.com/rain/a/20240316A01HGA00)
- [awesome-chinese-ner 中文命名实体识别](https://github.com/taishan1994/awesome-chinese-ner)
