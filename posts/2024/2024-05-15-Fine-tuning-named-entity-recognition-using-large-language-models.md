---
type: article
title:  "使用大型语言模型微调命名实体识别"
date:   2024-05-15 08:00:00 +0800
tags: [qwen, llama-factory, fine-tuning, ner, lora, named-entity-recognition, xml, supervised-fine-tuning, python]
---

## 目标
这里探索了借助大型语言模型微调进行命名实体识别的标注。

定义了一套电力领域的命名实体类型：
- Province: 省份。例如：山东省。
- City: 城市。例如：济南市、济南。
- Company: 供电公司。例如：长清区供电公司、市中供电中心。
- Substation: 供电所。例如：崮山供电所。
- Indicator: 指标。例如：投诉、意见。
- Date: 日期。例如：今天、昨天、今年、去年、本周、上周、本月、上月、3月、本季度、上季度、一季度、今年第一季度、2022年、2024年5月。

对用户的输入进行命名实体识别标注，输出的结果应该包含所有的电力领域实体类型的实例。
- 山东省菏泽巨野县供电公司麒麟供电所投诉数量

`<Province>山东省</Province><City>菏泽</City><Company>巨野县供电公司</Company><Substation>麒麟供电所</Substation><Indicator>投诉</Indicator>数量`

- 菏泽巨野县供电公司麒麟供电所投诉数量

`<City>菏泽</City><Company>巨野县供电公司</Company><Substation>麒麟供电所</Substation><Indicator>投诉</Indicator>数量`

- 菏泽巨野投诉数量

`<City>菏泽</City><Indicator>投诉</Indicator>数量`

- 菏泽麒麟投诉数量

`<City>菏泽</City><Substation>麒麟</Substation><Indicator>投诉</Indicator>数量`
- 巨野县供电公司麒麟供电所投诉数量

`<Company>巨野县供电公司</Company><Substation>麒麟供电所</Substation><Indicator>投诉</Indicator>数量`
- 巨野麒麟投诉数量

`<City>巨野</City><Substation>麒麟</Substation><Indicator>投诉</Indicator>数量`

- 巨野投诉数量

`<City>巨野</City><Indicator>投诉</Indicator>数量`

- 麒麟供电所投诉数量

`<Substation>麒麟供电所</Substation><Indicator>投诉</Indicator>数量`

- 麒麟投诉数量

`<Substation>麒麟</Substation><Indicator>投诉</Indicator>数量`


## 总结
这里使用了大型语言模型 Qwen1.5-1.8B-Chat 进行微调，完美地实现了电力领域的命名实体识别标注。

Qwen1.5-4B-Chat 也很好地实现了电力领域的命名实体识别标注。

Qwen1.5-0.5B-Chat 也实现了电力领域的命名实体识别标注，但有一点点错误，这里分别微调了 `--num_train_epochs` 设置 `2` 和 `3`。问题如下：

- 菏泽巨野县供电公司麒麟供电所意见个数
- ❌ `<Company>菏泽巨野县供电公司</Company><Substation>麒麟供电所</Substation><Indicator>意见</Indicator>个数`

目前只有这个有问题，其他的都是正确的，如：

- 菏泽曹县供电公司闫店楼供电所意见个数
- 菏泽曹县供电公司闫店楼供电所投诉百万户量个数
- 菏泽鄄城县供电公司闫什意见个数
- 济南长清区供电公司崮山意见总数


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

### 样本生成
```python
dataset = []
for city, companys in city_companys_map.items():
    for company in companys:
        substations = citycompany_substations_map.get(city+company, [])
        for substation in substations:
            # 不带省，不带时间
            DATASET_TEMPLATES = [
                (
                    "{city}{company}{substation}{indicator}{total}",
                    "<City>{city}</City><Company>{company}</Company><Substation>{substation}</Substation><Indicator>{indicator}</Indicator>{total}"
                ),
                (
                    "{city}{indicator}{total}",
                    "<City>{city}</City><Indicator>{indicator}</Indicator>{total}"
                ),
                (
                    "{company}{indicator}{total}",
                    "<Company>{company}</Company><Indicator>{indicator}</Indicator>{total}"
                ),
                (
                    "{city}{company}{indicator}{total}",
                    "<City>{city}</City><Company>{company}</Company><Indicator>{indicator}</Indicator>{total}"
                ),
                (
                    "{city}{substation}{indicator}{total}",
                    "<City>{city}</City><Substation>{substation}</Substation><Indicator>{indicator}</Indicator>{total}"
                ),
                (
                    "{substation}{indicator}{total}",
                    "<Substation>{substation}</Substation><Indicator>{indicator}</Indicator>{total}"
                )
            ]

            for question_template, response_template in DATASET_TEMPLATES:
                dataset.append(generate_dataset_item(question_template, response_template, PROVINCE, city, company, substation))
                
                # 带时间
                dataset.append(generate_dataset_item(
                    "{date}" + question_template, 
                    "<Date>{date}</Date>" + response_template, 
                    PROVINCE, city, company, substation)
                )

                # 带省，不带时间
                dataset.append(generate_dataset_item(
                    "{province}" + question_template, 
                    "<Province>{province}</Province>" + response_template, 
                    PROVINCE, city, company, substation)
                )

                # 带省，带时间
                dataset.append(generate_dataset_item(
                    "{date}{province}" + question_template, 
                    "<Date>{date}</Date><Province>{province}</Province>" + response_template, 
                    PROVINCE, city, company, substation)
                )
```

### 数据集文件 data/ner.json
```json
[
  {
    "instruction": "你将获得一个可能包含电力领域的用户消息。你还将获得一个电力领域实体类型列表。你的任务是检测并识别用户消息中提供的所有电力领域实体类型的实例。\n## 要求\n- 输出必须与输入内容相同。\n- 只有在实体列表中匹配电力领域实体的标记应该被包含在XML标签内。\n- XML标签来自下面列出的电力领域实体类型列表。\n- 确保所有实体都被识别出来。\n- 不要进行错误的识别。\n- 只输出实体标注的结果，不需要对实体的标注进行解释。\n\n## 电力领域实体类型列表\n- Province: 省份。例如：山东省。\n- City: 城市。例如：济南市、济南。\n- Company: 供电公司。例如：长清区供电公司、市中供电中心。\n- Substation: 供电所。例如：崮山供电所。\n- Indicator: 指标。例如：投诉、意见。\n- Date: 日期。例如：今天、昨天、今年、去年、本周、上周、本月、上月、3月、本季度、上季度、一季度、今年第一季度、2022年、2024年5月。\n\n## 请你对下面的文本进行电力领域命名实体识别标注\n菏泽巨野县供电公司麒麟供电所意见个数\n",
    "input": "",
    "output": "<City>菏泽</City><Company>巨野县供电公司</Company><Substation>麒麟供电所</Substation><Indicator>意见</Indicator>个数"
  },
  {
    "instruction": "你将获得一个可能包含电力领域的用户消息。你还将获得一个电力领域实体类型列表。你的任务是检测并识别用户消息中提供的所有电力领域实体类型的实例。\n## 要求\n- 输出必须与输入内容相同。\n- 只有在实体列表中匹配电力领域实体的标记应该被包含在XML标签内。\n- XML标签来自下面列出的电力领域实体类型列表。\n- 确保所有实体都被识别出来。\n- 不要进行错误的识别。\n- 只输出实体标注的结果，不需要对实体的标注进行解释。\n\n## 电力领域实体类型列表\n- Province: 省份。例如：山东省。\n- City: 城市。例如：济南市、济南。\n- Company: 供电公司。例如：长清区供电公司、市中供电中心。\n- Substation: 供电所。例如：崮山供电所。\n- Indicator: 指标。例如：投诉、意见。\n- Date: 日期。例如：今天、昨天、今年、去年、本周、上周、本月、上月、3月、本季度、上季度、一季度、今年第一季度、2022年、2024年5月。\n\n## 请你对下面的文本进行电力领域命名实体识别标注\n上个月菏泽市巨野县供电公司麒麟投诉总数\n",
    "input": "",
    "output": "<Date>上个月</Date><City>菏泽市</City><Company>巨野县供电公司</Company><Substation>麒麟</Substation><Indicator>投诉</Indicator>总数"
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
    --model_name_or_path qwen/$MODEL_NAME \
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
    --output_dir ner/saves/$MODEL_NAME/lora/sft \
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
    --model_name_or_path qwen/$MODEL_NAME \
    --adapter_name_or_path ner/saves/$MODEL_NAME/lora/sft \
    --template qwen \
    --finetuning_type lora
```

### 👍 Qwen1.5-1.8B-Chat

- 🙋‍♂️ 菏泽巨野县供电公司麒麟供电所意见个数
- 🤖 `<City>菏泽</City><Company>巨野县供电公司</Company><Substation>麒麟供电所</Substation><Indicator>意见</Indicator>个数`

- 🙋‍♂️ 上个月菏泽市巨野县供电公司麒麟投诉总数
- 🤖 `<Date>上个月</Date><City>菏泽市</City><Company>巨野县供电公司</Company><Substation>麒麟</Substation><Indicator>投诉</Indicator>总数`

- 🙋‍♂️ 山东菏泽巨野县供电公司麒麟投诉总数
- 🤖 `<Province>山东</Province><City>菏泽</City><Company>巨野县供电公司</Company><Substation>麒麟</Substation><Indicator>投诉</Indicator>总数`

- 🙋‍♂️ 今年山东菏泽市巨野县供电公司麒麟意见百万户量个数
- 🤖 `<Date>今年</Date><Province>山东</Province><City>菏泽市</City><Company>巨野县供电公司</Company><Substation>麒麟</Substation><Indicator>意见百万户量</Indicator>个数`

- 🙋‍♂️ 菏泽市投诉百万户量数量
- 🤖 `<City>菏泽市</City><Indicator>投诉百万户量</Indicator>数量`

- 🙋‍♂️ 上个月菏泽意见百万户量数量
- 🤖 `<Date>上个月</Date><City>菏泽</City><Indicator>意见百万户量</Indicator>数量`

- 🙋‍♂️ 山东菏泽投诉总数
- 🤖 `<Province>山东</Province><City>菏泽</City><Indicator>投诉</Indicator>总数`

- 🙋‍♂️ 10月山东省菏泽市意见个数
- 🤖 `<Date>10月</Date><Province>山东省</Province><City>菏泽市</City><Indicator>意见</Indicator>个数`

- 🙋‍♂️ 巨野县供电公司意见百万户量总数
- 🤖 `<Company>巨野县供电公司</Company><Indicator>意见百万户量</Indicator>总数`

- 🙋‍♂️ 7月巨野县供电公司意见百万户量个数
- 🤖 `<Date>7月</Date><Company>巨野县供电公司</Company><Indicator>意见百万户量</Indicator>个数`

- 🙋‍♂️ 山东省巨野县供电公司意见数量
- 🤖 `<Province>山东省</Province><Company>巨野县供电公司</Company><Indicator>意见</Indicator>数量`

- 🙋‍♂️ 4月山东省巨野县供电公司投诉总数
- 🤖 `<Date>4月</Date><Province>山东省</Province><Company>巨野县供电公司</Company><Indicator>投诉</Indicator>总数`

- 🙋‍♂️ 菏泽市巨野县供电公司意见总数
- 🤖 `<City>菏泽市</City><Company>巨野县供电公司</Company><Indicator>意见</Indicator>总数`

- 🙋‍♂️ 上个周菏泽市巨野县供电公司投诉个数
- 🤖 `<Date>上个周</Date><City>菏泽市</City><Company>巨野县供电公司</Company><Indicator>投诉</Indicator>个数`

- 🙋‍♂️ 山东省菏泽巨野县供电公司投诉总数
- 🤖 `<Province>山东省</Province><City>菏泽</City><Company>巨野县供电公司</Company><Indicator>投诉</Indicator>总数`

- 🙋‍♂️ 前天山东省菏泽市巨野县供电公司意见数量
- 🤖 `<Date>前天</Date><Province>山东省</Province><City>菏泽市</City><Company>巨野县供电公司</Company><Indicator>意见</Indicator>数量`

- 🙋‍♂️ 菏泽市麒麟供电所投诉数量
- 🤖 `<City>菏泽市</City><Substation>麒麟供电所</Substation><Indicator>投诉</Indicator>数量`

- 🙋‍♂️ 6月菏泽市麒麟投诉百万户量数量
- 🤖 `<Date>6月</Date><City>菏泽市</City><Substation>麒麟</Substation><Indicator>投诉百万户量</Indicator>数量`

- 🙋‍♂️ 山东菏泽市麒麟投诉百万户量个数
- 🤖 `<Province>山东</Province><City>菏泽市</City><Substation>麒麟</Substation><Indicator>投诉百万户量</Indicator>个数`

- 🙋‍♂️ 昨天山东省菏泽市麒麟投诉百万户量总数
- 🤖 `<Date>昨天</Date><Province>山东省</Province><City>菏泽市</City><Substation>麒麟</Substation><Indicator>投诉百万户量</Indicator>总数`

- 🙋‍♂️ 麒麟意见百万户量总数
- 🤖 `<Substation>麒麟</Substation><Indicator>意见百万户量</Indicator>总数`

- 🙋‍♂️ 前天麒麟投诉数量
- 🤖 `<Date>前天</Date><Substation>麒麟</Substation><Indicator>投诉</Indicator>数量`

- 🙋‍♂️ 山东麒麟意见数量
- 🤖 `<Province>山东</Province><Substation>麒麟</Substation><Indicator>意见</Indicator>数量`

- 🙋‍♂️ 12月山东麒麟意见百万户量数量
- 🤖 `<Date>12月</Date><Province>山东</Province><Substation>麒麟</Substation><Indicator>意见百万户量</Indicator>数量`

**使用 `chat` 每次提问前先运行命令 `clear`，避免历史记录影响了。**


### Qwen1.5-0.5B-Chat

- 🙋‍♂️ 菏泽巨野县供电公司麒麟供电所意见个数
- 🤖(❌) `<Company>菏泽巨野县供电公司</Company><Substation>麒麟供电所</Substation><Indicator>意见</Indicator>个数`

- 🙋‍♂️ 上个月菏泽市巨野县供电公司麒麟投诉总数
- 🤖 `<Date>上个月</Date><City>菏泽市</City><Company>巨野县供电公司</Company><Substation>麒麟</Substation><Indicator>投诉</Indicator>总数`

- 🙋‍♂️ 山东菏泽巨野县供电公司麒麟投诉总数
- 🤖 `<Province>山东</Province><City>菏泽</City><Company>巨野县供电公司</Company><Substation>麒麟</Substation><Indicator>投诉</Indicator>总数`

- 🙋‍♂️ 今年山东菏泽市巨野县供电公司麒麟意见百万户量个数
- 🤖 `<Date>今年</Date><Province>山东</Province><City>菏泽市</City><Company>巨野县供电公司</Company><Substation>麒麟</Substation><Indicator>意见百万户量</Indicator>个数`

- 🙋‍♂️ 菏泽市投诉百万户量数量
- 🤖 `<City>菏泽市</City><Indicator>投诉百万户量</Indicator>数量`

- 🙋‍♂️ 上个月菏泽意见百万户量数量
- 🤖 `<Date>上个月</Date><City>菏泽</City><Indicator>意见百万户量</Indicator>数量`

- 🙋‍♂️ 山东菏泽投诉总数
- 🤖 `<Province>山东</Province><City>菏泽</City><Indicator>投诉</Indicator>总数`

- 🙋‍♂️ 10月山东省菏泽市意见个数
- 🤖 `<Date>10月</Date><Province>山东省</Province><City>菏泽市</City><Indicator>意见</Indicator>个数`

- 🙋‍♂️ 巨野县供电公司意见百万户量总数
- 🤖 `<Company>巨野县供电公司</Company><Indicator>意见百万户量</Indicator>总数`

- 🙋‍♂️ 7月巨野县供电公司意见百万户量个数
- 🤖 `<Date>7月</Date><Company>巨野县供电公司</Company><Indicator>意见百万户量</Indicator>个数`

- 🙋‍♂️ 山东省巨野县供电公司意见数量
- 🤖 `<Province>山东省</Province><Company>巨野县供电公司</Company><Indicator>意见</Indicator>数量`

- 🙋‍♂️ 4月山东省巨野县供电公司投诉总数
- 🤖 `<Date>4月</Date><Province>山东省</Province><Company>巨野县供电公司</Company><Indicator>投诉</Indicator>总数`

- 🙋‍♂️ 菏泽市巨野县供电公司意见总数
- 🤖 `<City>菏泽市</City><Company>巨野县供电公司</Company><Indicator>意见</Indicator>总数`

- 🙋‍♂️ 上个周菏泽市巨野县供电公司投诉个数
- 🤖 `<Date>上个周</Date><City>菏泽市</City><Company>巨野县供电公司</Company><Indicator>投诉</Indicator>个数`

- 🙋‍♂️ 山东省菏泽巨野县供电公司投诉总数
- 🤖 `<Province>山东省</Province><City>菏泽</City><Company>巨野县供电公司</Company><Indicator>投诉</Indicator>总数`

- 🙋‍♂️ 前天山东省菏泽市巨野县供电公司意见数量
- 🤖 `<Date>前天</Date><Province>山东省</Province><City>菏泽市</City><Company>巨野县供电公司</Company><Indicator>意见</Indicator>数量`

- 🙋‍♂️ 菏泽市麒麟供电所投诉数量
- 🤖 `<City>菏泽市</City><Substation>麒麟供电所</Substation><Indicator>投诉</Indicator>数量`

- 🙋‍♂️ 6月菏泽市麒麟投诉百万户量数量
- 🤖 `<Date>6月</Date><City>菏泽市</City><Substation>麒麟</Substation><Indicator>投诉百万户量</Indicator>数量`

- 🙋‍♂️ 山东菏泽市麒麟投诉百万户量个数
- 🤖 `<Province>山东</Province><City>菏泽市</City><Substation>麒麟</Substation><Indicator>投诉百万户量</Indicator>个数`

- 🙋‍♂️ 昨天山东省菏泽市麒麟投诉百万户量总数
- 🤖 `<Date>昨天</Date><Province>山东省</Province><City>菏泽市</City><Substation>麒麟</Substation><Indicator>投诉百万户量</Indicator>总数`

- 🙋‍♂️ 麒麟意见百万户量总数
- 🤖 `<Substation>麒麟</Substation><Indicator>意见百万户量</Indicator>总数`

- 🙋‍♂️ 前天麒麟投诉数量
- 🤖 `<Date>前天</Date><Substation>麒麟</Substation><Indicator>投诉</Indicator>数量`

- 🙋‍♂️ 山东麒麟意见数量
- 🤖 `<Province>山东</Province><Substation>麒麟</Substation><Indicator>意见</Indicator>数量`

- 🙋‍♂️ 12月山东麒麟意见百万户量数量
- 🤖 `<Date>12月</Date><Province>山东</Province><Substation>麒麟</Substation><Indicator>意见百万户量</Indicator>数量`

### 👍 Qwen1.5-4B-Chat

- 🙋‍♂️ 菏泽巨野县供电公司麒麟供电所意见个数
- 🤖 `<City>菏泽</City><Company>巨野县供电公司</Company><Substation>麒麟供电所</Substation><Indicator>意见</Indicator>个数`

- 🙋‍♂️ 上个月菏泽市巨野县供电公司麒麟投诉总数
- 🤖 `<Date>上个月</Date><City>菏泽市</City><Company>巨野县供电公司</Company><Substation>麒麟</Substation><Indicator>投诉</Indicator>总数`

- 🙋‍♂️ 山东菏泽巨野县供电公司麒麟投诉总数
- 🤖 `<Province>山东</Province><City>菏泽</City><Company>巨野县供电公司</Company><Substation>麒麟</Substation><Indicator>投诉</Indicator>总数`

- 🙋‍♂️ 今年山东菏泽市巨野县供电公司麒麟意见百万户量个数
- 🤖 `<Date>今年</Date><Province>山东</Province><City>菏泽市</City><Company>巨野县供电公司</Company><Substation>麒麟</Substation><Indicator>意见百万户量</Indicator>个数`

- 🙋‍♂️ 菏泽市投诉百万户量数量
- 🤖 `<City>菏泽市</City><Indicator>投诉百万户量</Indicator>数量`

- 🙋‍♂️ 上个月菏泽意见百万户量数量
- 🤖 `<Date>上个月</Date><City>菏泽</City><Indicator>意见百万户量</Indicator>数量`

- 🙋‍♂️ 山东菏泽投诉总数
- 🤖 `<Province>山东</Province><City>菏泽</City><Indicator>投诉</Indicator>总数`

- 🙋‍♂️ 10月山东省菏泽市意见个数
- 🤖 `<Date>10月</Date><Province>山东省</Province><City>菏泽市</City><Indicator>意见</Indicator>个数`

- 🙋‍♂️ 巨野县供电公司意见百万户量总数
- 🤖 `<Company>巨野县供电公司</Company><Indicator>意见百万户量</Indicator>总数`

- 🙋‍♂️ 7月巨野县供电公司意见百万户量个数
- 🤖 `<Date>7月</Date><Company>巨野县供电公司</Company><Indicator>意见百万户量</Indicator>个数`

- 🙋‍♂️ 山东省巨野县供电公司意见数量
- 🤖 `<Province>山东省</Province><Company>巨野县供电公司</Company><Indicator>意见</Indicator>数量`

- 🙋‍♂️ 4月山东省巨野县供电公司投诉总数
- 🤖 `<Date>4月</Date><Province>山东省</Province><Company>巨野县供电公司</Company><Indicator>投诉</Indicator>总数`

- 🙋‍♂️ 菏泽市巨野县供电公司意见总数
- 🤖 `<City>菏泽市</City><Company>巨野县供电公司</Company><Indicator>意见</Indicator>总数`

- 🙋‍♂️ 上个周菏泽市巨野县供电公司投诉个数
- 🤖 `<Date>上个周</Date><City>菏泽市</City><Company>巨野县供电公司</Company><Indicator>投诉</Indicator>个数`

- 🙋‍♂️ 山东省菏泽巨野县供电公司投诉总数
- 🤖 `<Province>山东省</Province><City>菏泽</City><Company>巨野县供电公司</Company><Indicator>投诉</Indicator>总数`

- 🙋‍♂️ 前天山东省菏泽市巨野县供电公司意见数量
- 🤖 `<Date>前天</Date><Province>山东省</Province><City>菏泽市</City><Company>巨野县供电公司</Company><Indicator>意见</Indicator>数量`

- 🙋‍♂️ 菏泽市麒麟供电所投诉数量
- 🤖 `<City>菏泽市</City><Substation>麒麟供电所</Substation><Indicator>投诉</Indicator>数量`

- 🙋‍♂️ 6月菏泽市麒麟投诉百万户量数量
- 🤖 `<Date>6月</Date><City>菏泽市</City><Substation>麒麟</Substation><Indicator>投诉百万户量</Indicator>数量`

- 🙋‍♂️ 山东菏泽市麒麟投诉百万户量个数
- 🤖 `<Province>山东</Province><City>菏泽市</City><Substation>麒麟</Substation><Indicator>投诉百万户量</Indicator>个数`

- 🙋‍♂️ 昨天山东省菏泽市麒麟投诉百万户量总数
- 🤖 `<Date>昨天</Date><Province>山东省</Province><City>菏泽市</City><Substation>麒麟</Substation><Indicator>投诉百万户量</Indicator>总数`

- 🙋‍♂️ 麒麟意见百万户量总数
- 🤖 `<Substation>麒麟</Substation><Indicator>意见百万户量</Indicator>总数`

- 🙋‍♂️ 前天麒麟投诉数量
- 🤖 `<Date>前天</Date><Substation>麒麟</Substation><Indicator>投诉</Indicator>数量`

- 🙋‍♂️ 山东麒麟意见数量
- 🤖 `<Province>山东</Province><Substation>麒麟</Substation><Indicator>意见</Indicator>数量`

- 🙋‍♂️ 12月山东麒麟意见百万户量数量
- 🤖 `<Date>12月</Date><Province>山东</Province><Substation>麒麟</Substation><Indicator>意见百万户量</Indicator>数量`


## 参考
- [LLaMA-Factory 微调 Text2SQL]([2024-05-07-LLaMA-Factory-Fine-Tuning-Text2SQL](/posts/2024-05-07-LLaMA-Factory-Fine-Tuning-Text2SQL))
- [微调大型语言模型进行命名实体识别](https://new.qq.com/rain/a/20240316A01HGA00)
- [awesome-chinese-ner 中文命名实体识别](https://github.com/taishan1994/awesome-chinese-ner)
