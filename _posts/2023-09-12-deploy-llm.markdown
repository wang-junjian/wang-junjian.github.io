---
layout: post
title:  "部署 LLM"
date:   2023-09-12 08:00:00 +0800
categories: LLM
tags: [Qwen-7B, ChatGLM2-6B, Baichuan2]
---

## 测试结果

### 模型 & 精度 & 显存 & 速度

| 模型 | 参数 | 精度   | 加速方式 | 显存 | 速度（每秒生成汉字数） | 效果 |
| --- | ---: | :---: | ------- | --: | -----------------: | :---: |
| [Qwen-7B-Chat][Qwen-7B-Chat]                         |  7B | float16 |                 | 20G |  7 |  |
| [Qwen-7B-Chat][Qwen-7B-Chat]                         |  7B | float16 | flash-attention | 20G |  9 |  |
| [ChatGLM2-6B][ChatGLM2-6B]                           |  6B | float16 |                 | 13G | 26 |  |
| [ChatGLM2-6B][ChatGLM2-6B]                           |  6B | float16 | fastllm         | 13G | 26 |  |
| [ChatGLM2-6B][ChatGLM2-6B]                           |  6B | float16 | chatglm.cpp     | 15G | 22 |  |
| [ChatGLM2-6B][ChatGLM2-6B] 🚀                        |  6B | int4    | chatglm.cpp     |  6G | 90 | ❌ |
| [Baichuan2-7B-Chat][Baichuan2-7B-Chat]               |  7B | float16 |                 | 14G |  2 |  |
| [Baichuan2-7B-Chat][Baichuan2-7B-Chat]               |  7B | int8    |                 | 11G | 16 |  |
| [Baichuan2-7B-Chat][Baichuan2-7B-Chat]               |  7B | int4    |                 |  8G | 30 |  |
| [Baichuan2-13B-Chat-4bits][Baichuan2-13B-Chat-4bits] | 13B | int4    |                 | 13G | 20 |  |

[Qwen-7B-Chat]: https://huggingface.co/tangger/Qwen-7B-Chat
[ChatGLM2-6B]: https://huggingface.co/THUDM/chatglm2-6b
[Baichuan2-7B-Chat]: https://huggingface.co/baichuan-inc/Baichuan2-7B-Chat
[Baichuan2-13B-Chat-4bits]: https://huggingface.co/baichuan-inc/Baichuan2-13B-Chat-4bits

### 测试速度的代码
```py
from time import time as time_now
begin_time = time_now()
### 你的代码
end_time = time_now()
words_per_second = len(response)/(end_time-begin_time)
a_hundred_word_total_seconds = 100/words_per_second
print(f"🚀 每秒生成{words_per_second:.2f}字, 100字需要{a_hundred_word_total_seconds:.2f}秒")
```


## [Qwen-7B](https://github.com/QwenLM/Qwen-7B)

克隆代码
```shell
git clone https://github.com/QwenLM/Qwen-7B QwenLM/Qwen-7B
cd QwenLM/Qwen-7B
```

创建虚拟环境
```shell
python -m venv env
source env/bin/activate
```

安装依赖
```shell
pip install -r requirements.txt
```

安装 `flash-attention` 加速推理，**使用 2 张 T4 GPU，测试加速了20%**。
```shell
git clone -b v1.0.8 https://github.com/Dao-AILab/flash-attention
cd flash-attention && pip install .
```

下载 Qwen-7B-Chat 模型
```shell
git clone https://huggingface.co/Qwen/Qwen-7B-Chat QWen/QWen-7B-Chat
```

### 启动 OpenAI API 服务
#### CPU
```shell
python openai_api.py --cpu-only
```

#### GPU
```shell
CUDA_VISIBLE_DEVICES=2,3 python openai_api.py --server-name 0.0.0.0 --server-port 8008
```

### 测试 OpanAI API 接口（curl）
```shell
curl http://172.16.33.66:8008/v1/chat/completions \
-H "Content-Type: application/json" \
-d '{"messages": [{"role": "user", "content": "使用以下上下文来回答最后的问题。 如果你不知道答案，就说你不知道，不要试图编造答案。\n\n3. 外出打卡：指外出办事打卡。提外出申请后，可以打外出卡，打外出卡时间需在申请时间内：\n（1）半天外出：如外出时间在上午(12点前) 或者下午(12点后)，则另外半天需正常出勤打卡。\n（2）跨12点外出：如外出跨度期间包含12点，则12点前、12点后分别打外出卡即可记为合格出勤。\n\n4. 加班打卡：指法定节假日加班打卡。\n（1）加班打卡：不设置固定上下班打卡要求，但必须形成打卡闭环，加班时间超过8小时即视为全天出勤，超过4小时但不足8小时视为半天出勤，不足4小时视为未出勤。\n（2）与加班申请比对：加班时长与申请时长对比，取小的一方数值。如加班8小时以上，但申请4小时，则统计出勤半天。\n\n二、出勤申请审批\n出勤申请审批包括：补卡、加班、请假、出差、外出采用企业微信审批，审批层级由各部门自定。特别说明：不符流程的申请、审批，按照无效处理，考勤视为未出勤。\n\n1. 补卡申请：\n（1）补卡次数：漏打、异常打卡可申请补卡(直接在当日打卡记录中申请补卡)，每月补卡次数不超过2次，超过部分补录无效。\n（2）补卡时间：补卡需要在3天内(从缺勤当日起算)提交申请，超出时限视为无效。\n\n七、重点注意事项说明\n（1）所有业务审批原则上要求次月8号之前完成审批，请在企业微信端留意各审批进度，以免因审批人延误影响个人实际出勤和费用结算情况。\n（2）出勤打卡如有漏打或者异常，于3天内(含当日)及时进行补卡；出勤打卡7天内(含当日)注意及时报工。\n（3）因系统允许每人挂多个项目，报工时请确定选择合适的报工项目和合适的审批人。\n（4）存在出差、加班、外出事宜注意提前及时申请，不要遗漏；请假期间如提前返回正常办公记得撤销原申请并重新提交与实际出勤相符的申请。\n（5）交通费报销单注意填报时要形成闭环，且应在出差申请时间内。\n（6）所有出勤相关申请及审批必须在结算本月费用之前完成，否则相应申请和审批无效。\n（7）申请审批、出勤打卡、报工必须都符合要求才能形成合格的结算考勤，缺一不可。\n（8）出勤、出差、报工、结算如有问题请直接联系部门管理员或业务主管部门专责。\n\n六、结算矫正\n每月8日之后系统可生成上月合作方结算预月报；在正式提交结算月报前，部门管理员可根据合作方人员出勤打卡补录申请、部门确认情况，进行矫正处理。请注意:部门管理员结算矫正时只允许对有报工但无出勤情况进行矫正，无报工情况无法矫正(具体矫正要求以公司管理制度为准)。一旦结算确认后将无法进行矫正。\n\n5. 外出申请：\n（1）申请范围：仅限于济南五区(历下区、市中 区、槐荫区、天桥区、历城区)范围内。不在固定办公地点外出办公时，要申请外出审批，使用外出打卡。\n（2）填写申请：“外出事由” 需要填写详细，有必要时需要上传“附件”。\n\n三、报工\n1. 报工\n（1）报工情况：正常出勤、出差、外出、加班情况均需进行报工，以半天为最小单位。\n（2）报工时限：报工人可填写当前提交日期(包含)前7天内报工，超期无法报工。\n（3）补报工情况：遇到不可控因素长时间无法报工(例:服务器维护等原因)，会开放固定时限和月份内补报工功能，届时会通过业务部门或企业微信-工作通知应用进行通知! \n（4）报工匹配：匹配合格：出勤打卡与报工审批一致(以半天为最小单位)，为合格报工，纳入结算。匹配异常：有报工无出勤打卡、有出勤打卡无报工均为异常。\n费用结算以报工匹配出勤为依据，报工不可矫正。\n\nQuestion: 每月补卡次数\nHelpful Answer:"}], "model": "Qwen-7B"}'
```
```json
{"model":"Qwen-7B","object":"chat.completion","choices":[{"index":0,"message":{"role":"assistant","content":"每月补卡次数有限制，漏打、异常打卡可申请补卡，每月补卡次数不超过2次，超过部分补录无效。","function_call":null},"finish_reason":"stop"}],"created":1694592394}
```

手动格式化
```shell
curl http://172.16.33.66:8008/v1/chat/completions \
-H "Content-Type: application/json" \
-d '
{
    "messages": [
        {
            "role": "user", 
            "content": "使用以下上下文来回答最后的问题。 如果你不知道答案，就说你不知道，不要试图编造答案。\n\n3. 外出打卡：指外出办事打卡。提外出申请后，可以打外出卡，打外出卡时间需在申请时间内：\n（1）半天外出：如外出时间在上午(12点前) 或者下午(12点后)，则另外半天需正常出勤打卡。\n（2）跨12点外出：如外出跨度期间包含12点，则12点前、12点后分别打外出卡即可记为合格出勤。\n\n4. 加班打卡：指法定节假日加班打卡。\n（1）加班打卡：不设置固定上下班打卡要求，但必须形成打卡闭环，加班时间超过8小时即视为全天出勤，超过4小时但不足8小时视为半天出勤，不足4小时视为未出勤。\n（2）与加班申请比对：加班时长与申请时长对比，取小的一方数值。如加班8小时以上，但申请4小时，则统计出勤半天。\n\n二、出勤申请审批\n出勤申请审批包括：补卡、加班、请假、出差、外出采用企业微信审批，审批层级由各部门自定。特别说明：不符流程的申请、审批，按照无效处理，考勤视为未出勤。\n\n1. 补卡申请：\n（1）补卡次数：漏打、异常打卡可申请补卡(直接在当日打卡记录中申请补卡)，每月补卡次数不超过2次，超过部分补录无效。\n（2）补卡时间：补卡需要在3天内(从缺勤当日起算)提交申请，超出时限视为无效。\n\n七、重点注意事项说明\n（1）所有业务审批原则上要求次月8号之前完成审批，请在企业微信端留意各审批进度，以免因审批人延误影响个人实际出勤和费用结算情况。\n（2）出勤打卡如有漏打或者异常，于3天内(含当日)及时进行补卡；出勤打卡7天内(含当日)注意及时报工。\n（3）因系统允许每人挂多个项目，报工时请确定选择合适的报工项目和合适的审批人。\n（4）存在出差、加班、外出事宜注意提前及时申请，不要遗漏；请假期间如提前返回正常办公记得撤销原申请并重新提交与实际出勤相符的申请。\n（5）交通费报销单注意填报时要形成闭环，且应在出差申请时间内。\n（6）所有出勤相关申请及审批必须在结算本月费用之前完成，否则相应申请和审批无效。\n（7）申请审批、出勤打卡、报工必须都符合要求才能形成合格的结算考勤，缺一不可。\n（8）出勤、出差、报工、结算如有问题请直接联系部门管理员或业务主管部门专责。\n\n六、结算矫正\n每月8日之后系统可生成上月合作方结算预月报；在正式提交结算月报前，部门管理员可根据合作方人员出勤打卡补录申请、部门确认情况，进行矫正处理。请注意:部门管理员结算矫正时只允许对有报工但无出勤情况进行矫正，无报工情况无法矫正(具体矫正要求以公司管理制度为准)。一旦结算确认后将无法进行矫正。\n\n5. 外出申请：\n（1）申请范围：仅限于济南五区(历下区、市中 区、槐荫区、天桥区、历城区)范围内。不在固定办公地点外出办公时，要申请外出审批，使用外出打卡。\n（2）填写申请：“外出事由” 需要填写详细，有必要时需要上传“附件”。\n\n三、报工\n1. 报工\n（1）报工情况：正常出勤、出差、外出、加班情况均需进行报工，以半天为最小单位。\n（2）报工时限：报工人可填写当前提交日期(包含)前7天内报工，超期无法报工。\n（3）补报工情况：遇到不可控因素长时间无法报工(例:服务器维护等原因)，会开放固定时限和月份内补报工功能，届时会通过业务部门或企业微信-工作通知应用进行通知! \n（4）报工匹配：匹配合格：出勤打卡与报工审批一致(以半天为最小单位)，为合格报工，纳入结算。匹配异常：有报工无出勤打卡、有出勤打卡无报工均为异常。\n费用结算以报工匹配出勤为依据，报工不可矫正。\n\nQuestion: 每月补卡次数\nHelpful Answer:"
        }
    ], 
    "model": "Qwen-7B"
}'
```
```json
{
  "model": "Qwen-7B",
  "object": "chat.completion",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "每月补卡次数有限制，漏打、异常打卡可申请补卡，每月补卡次数不超过2次，超过部分补录无效。",
        "function_call": null
      },
      "finish_reason": "stop"
    }
  ],
  "created": 1694592394
}
```

使用 `jq` 自动格式化结果
```shell
curl -X POST http://172.16.33.66:8008/v1/chat/completions \
-H "Content-Type: application/json" \
-d '
{
    "messages": [
        {
            "role": "user", 
            "content": "使用以下上下文来回答最后的问题。 如果你不知道答案，就说你不知道，不要试图编造答案。\n\n3. 外出打卡：指外出办事打卡。提外出申请后，可以打外出卡，打外出卡时间需在申请时间内：\n（1）半天外出：如外出时间在上午(12点前) 或者下午(12点后)，则另外半天需正常出勤打卡。\n（2）跨12点外出：如外出跨度期间包含12点，则12点前、12点后分别打外出卡即可记为合格出勤。\n\n4. 加班打卡：指法定节假日加班打卡。\n（1）加班打卡：不设置固定上下班打卡要求，但必须形成打卡闭环，加班时间超过8小时即视为全天出勤，超过4小时但不足8小时视为半天出勤，不足4小时视为未出勤。\n（2）与加班申请比对：加班时长与申请时长对比，取小的一方数值。如加班8小时以上，但申请4小时，则统计出勤半天。\n\n二、出勤申请审批\n出勤申请审批包括：补卡、加班、请假、出差、外出采用企业微信审批，审批层级由各部门自定。特别说明：不符流程的申请、审批，按照无效处理，考勤视为未出勤。\n\n1. 补卡申请：\n（1）补卡次数：漏打、异常打卡可申请补卡(直接在当日打卡记录中申请补卡)，每月补卡次数不超过2次，超过部分补录无效。\n（2）补卡时间：补卡需要在3天内(从缺勤当日起算)提交申请，超出时限视为无效。\n\n七、重点注意事项说明\n（1）所有业务审批原则上要求次月8号之前完成审批，请在企业微信端留意各审批进度，以免因审批人延误影响个人实际出勤和费用结算情况。\n（2）出勤打卡如有漏打或者异常，于3天内(含当日)及时进行补卡；出勤打卡7天内(含当日)注意及时报工。\n（3）因系统允许每人挂多个项目，报工时请确定选择合适的报工项目和合适的审批人。\n（4）存在出差、加班、外出事宜注意提前及时申请，不要遗漏；请假期间如提前返回正常办公记得撤销原申请并重新提交与实际出勤相符的申请。\n（5）交通费报销单注意填报时要形成闭环，且应在出差申请时间内。\n（6）所有出勤相关申请及审批必须在结算本月费用之前完成，否则相应申请和审批无效。\n（7）申请审批、出勤打卡、报工必须都符合要求才能形成合格的结算考勤，缺一不可。\n（8）出勤、出差、报工、结算如有问题请直接联系部门管理员或业务主管部门专责。\n\n六、结算矫正\n每月8日之后系统可生成上月合作方结算预月报；在正式提交结算月报前，部门管理员可根据合作方人员出勤打卡补录申请、部门确认情况，进行矫正处理。请注意:部门管理员结算矫正时只允许对有报工但无出勤情况进行矫正，无报工情况无法矫正(具体矫正要求以公司管理制度为准)。一旦结算确认后将无法进行矫正。\n\n5. 外出申请：\n（1）申请范围：仅限于济南五区(历下区、市中 区、槐荫区、天桥区、历城区)范围内。不在固定办公地点外出办公时，要申请外出审批，使用外出打卡。\n（2）填写申请：“外出事由” 需要填写详细，有必要时需要上传“附件”。\n\n三、报工\n1. 报工\n（1）报工情况：正常出勤、出差、外出、加班情况均需进行报工，以半天为最小单位。\n（2）报工时限：报工人可填写当前提交日期(包含)前7天内报工，超期无法报工。\n（3）补报工情况：遇到不可控因素长时间无法报工(例:服务器维护等原因)，会开放固定时限和月份内补报工功能，届时会通过业务部门或企业微信-工作通知应用进行通知! \n（4）报工匹配：匹配合格：出勤打卡与报工审批一致(以半天为最小单位)，为合格报工，纳入结算。匹配异常：有报工无出勤打卡、有出勤打卡无报工均为异常。\n费用结算以报工匹配出勤为依据，报工不可矫正。\n\nQuestion: 每月补卡次数\nHelpful Answer:"
        }
    ], 
    "model": "Qwen-7B"
}' | jq
```
```json
{
  "model": "Qwen-7B",
  "object": "chat.completion",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "每月补卡次数为2次，超过部分补录无效。",
        "function_call": null
      },
      "finish_reason": "stop"
    }
  ],
  "created": 1694594189
}
```

* [What's the correct URL to test OpenAI API?](https://stackoverflow.com/questions/75041247/whats-the-correct-url-to-test-openai-api)
* [How do I POST JSON data with cURL?](https://stackoverflow.com/questions/7172784/how-do-i-post-json-data-with-curl)
* [Qwen-7B Dockerfile](https://github.com/wysaid/Qwen-7B/blob/main/Dockerfile)


## [ChatGLM2-6B](https://github.com/THUDM/ChatGLM2-6B)
克隆代码
```shell
git clone https://github.com/THUDM/ChatGLM2-6B THUDM/ChatGLM2-6B
cd THUDM/ChatGLM2-6B
```

创建虚拟环境
```shell
python -m venv env
source env/bin/activate
```

安装依赖
```shell
pip install -r requirements.txt
```

安装 [flashllm](https://github.com/ztxz16/fastllm/)（加速），没有效果。
```shell
git clone https://github.com/ztxz16/fastllm/
cd fastllm
mkdir build && cd build
cmake .. -DUSE_CUDA=ON # 如果不使用GPU编译，那么使用 cmake .. -DUSE_CUDA=OFF
make -j
cd tools && python setup.py install
```

下载 chatglm2-6b 模型
```shell
git clone https://huggingface.co/THUDM/chatglm2-6b THUDM/chatglm2-6b
```

### 启动服务
#### CPU
修改 api.py

```shell
if __name__ == '__main__':
    model_path = "THUDM/chatglm2-6b"
    tokenizer = AutoTokenizer.from_pretrained(model_path, trust_remote_code=True)
    model = AutoModel.from_pretrained(model_path, trust_remote_code=True).float()
    model.eval()

    uvicorn.run(app, host='0.0.0.0', port=8000, workers=1)
```

执行下面命令

```shell
python api.py
```

测试生成速度

```shell
🚀 每秒生成0.23字, 100字需要436.59秒
🚀 每秒生成0.26字, 100字需要380.50秒
```

#### 单GPU
修改 api.py

```shell
if __name__ == '__main__':
    model_path = "THUDM/chatglm2-6b"
    tokenizer = AutoTokenizer.from_pretrained(model_path, trust_remote_code=True)
    model = AutoModel.from_pretrained(model_path, trust_remote_code=True).cuda()
    model.eval()

    uvicorn.run(app, host='0.0.0.0', port=8000, workers=1)
```

执行下面命令

```shell
CUDA_VISIBLE_DEVICES=1 python api.py
```

测试生成速度

```shell
🚀 每秒生成26.86字, 100字需要3.72秒
🚀 每秒生成26.40字, 100字需要3.79秒
🚀 每秒生成25.88字, 100字需要3.86秒
🚀 每秒生成25.78字, 100字需要3.88秒
```

#### 多GPU
修改 api.py

```shell
if __name__ == '__main__':
    # 多显卡支持，将num_gpus改为你实际的显卡数量
    from utils import load_model_on_gpus
    model_path = "THUDM/chatglm2-6b"
    tokenizer = AutoTokenizer.from_pretrained(model_path, trust_remote_code=True)
    model = load_model_on_gpus(model_path, num_gpus=2)
    model.eval()

    uvicorn.run(app, host='0.0.0.0', port=8000, workers=1)
```

执行下面命令

```shell
CUDA_VISIBLE_DEVICES=0,1 python api.py
```

测试生成速度

```shell
🚀 每秒生成21.89字, 100字需要4.57秒
🚀 每秒生成25.03字, 100字需要3.99秒
🚀 每秒生成26.47字, 100字需要3.78秒
🚀 每秒生成25.01字, 100字需要4.00秒
```

#### fastllm + GPU
修改 api.py

```shell
if __name__ == '__main__':
    model_path = "THUDM/chatglm2-6b"
    tokenizer = AutoTokenizer.from_pretrained(model_path, trust_remote_code=True)
    model = AutoModel.from_pretrained(model_path, trust_remote_code=True)

    # 加入下面这两行，将huggingface模型转换成fastllm模型
    # 目前from_hf接口只能接受原始模型，或者ChatGLM的int4, int8量化模型，暂时不能转换其它量化模型
    from fastllm_pytools import llm
    model = llm.from_hf(model, tokenizer, dtype = "float16") # dtype支持 "float16", "int8", "int4"

    uvicorn.run(app, host='0.0.0.0', port=8000, workers=1)
```

执行下面命令

```shell
python api.py
```

测试生成速度

* float16
```shell
🚀 每秒生成27.41字, 100字需要3.65秒
🚀 每秒生成26.14字, 100字需要3.83秒
🚀 每秒生成25.69字, 100字需要3.89秒
🚀 每秒生成24.76字, 100字需要4.04秒
```

* int8
```shell
🚀 每秒生成33.05字, 100字需要3.03秒
🚀 每秒生成35.62字, 100字需要2.81秒
🚀 每秒生成31.60字, 100字需要3.16秒
🚀 每秒生成31.23字, 100字需要3.20秒
```

* int4
```shell
🚀 每秒生成31.78字, 100字需要3.15秒
🚀 每秒生成31.55字, 100字需要3.17秒
🚀 每秒生成30.65字, 100字需要3.26秒
🚀 每秒生成30.57字, 100字需要3.27秒
```


## [chatglm.cpp](https://github.com/li-plus/chatglm.cpp.git)
克隆代码
```shell
git clone --recursive https://github.com/li-plus/chatglm.cpp.git
cd chatglm.cpp
```

创建虚拟环境
```shell
python -m venv env
source env/bin/activate
```

安装依赖
```shell
# 使用上面的 chatglm2-6b 创建的虚拟环境
source ../env/bin/activate
pip install tabulate
```

### 量化模型
量化为 int4
```shell
python chatglm_cpp/convert.py -i ../THUDM/chatglm2-6b/ -t q4_0 -o chatglm2-6b-q4_0-ggml.bin
```

量化为 float16
```shell
python chatglm_cpp/convert.py -i ../THUDM/chatglm2-6b/ -t f16 -o chatglm2-6b-f16-ggml.bin
```

### 编译
#### CPU
```shell
cmake -B build
cmake --build build -j --config Release
```

#### CPU - OpenBLAS（没有效果）
```shell
cmake -B build -DGGML_OPENBLAS=ON
cmake --build build -j --config Release
```

#### GPU - cuBLAS（非常快）
```shell
cmake -B build -DGGML_CUBLAS=ON
cmake --build build -j --config Release
```

聊天测试，加参数 `-i` 可以交互式输入。
```shell
./build/bin/main -m chatglm2-6b-ggml.bin -p 你好
你好👋！我是人工智能助手 ChatGLM2-6B，很高兴见到你，欢迎问我任何问题。
```

### 安装 Python API
#### CPU
```shell
pip install 'chatglm-cpp[api]'
```

#### GPU
```shell
CMAKE_ARGS="-DGGML_CUBLAS=ON" pip install 'chatglm-cpp[api]' --force-reinstall -v --no-cache
```

#### 运行 ChatGLM API 服务
```shell
CUDA_VISIBLE_DEVICES=3 MODEL=chatglm.cpp/chatglm2-6b-q4_0-ggml.bin uvicorn chatglm_cpp.langchain_api:app --host 0.0.0.0 --port 8000
```


## [Baichuan2](https://github.com/baichuan-inc/Baichuan2)

克隆代码
```shell
git clone https://github.com/baichuan-inc/Baichuan2
cd Baichuan2
```

创建虚拟环境
```shell
python -m venv env
source env/bin/activate
```

安装依赖
```shell
pip install -r requirements.txt
```

训练加速可安装 `xformers`
```shell
pip install xformers[memory_efficient_attention]
```
* [Baichuan2笔记](https://zhuanlan.zhihu.com/p/655750580)

下载模型
* Baichuan2-7B-Chat
```shell
git clone https://www.modelscope.cn/baichuan-inc/Baichuan2-7B-Chat.git baichuan-inc/Baichuan2-7B-Chat
```

* Baichuan2-13B-Chat-4bits
```shell
git clone https://www.modelscope.cn/baichuan-inc/Baichuan2-13B-Chat-4bits.git baichuan-inc/Baichuan2-13B-Chat-4bits
```

### 启动服务

#### Baichuan2-13B-Chat-4bits
需要修改模型路径 `baichuan-inc/Baichuan2-13B-Chat` 为 `baichuan-inc/Baichuan2-13B-Chat-4bits`

```shell
CUDA_VISIBLE_DEVICES=2 streamlit run web_demo.py
```

```
显存：12.4G
🚀 每秒生成20.69字, 100字需要4.83秒
🚀 每秒生成18.69字, 100字需要5.35秒
🚀 每秒生成19.86字, 100字需要5.03秒
```

#### Baichuan2-7B-Chat（float16）
需要修改模型路径 `baichuan-inc/Baichuan2-13B-Chat` 为 `baichuan-inc/Baichuan2-7B-Chat`

```shell
CUDA_VISIBLE_DEVICES=2 streamlit run web_demo.py
```

```
显存：13.7G
🚀 每秒生成2.60字, 100字需要38.44秒
🚀 每秒生成2.49字, 100字需要40.16秒
```

#### Baichuan2-7B-Chat（8bits）
在线量化
```py
model = AutoModelForCausalLM.from_pretrained("baichuan-inc/Baichuan2-7B-Chat", torch_dtype=torch.float16, trust_remote_code=True)
model = model.quantize(8).cuda()
```

```
显存：10.4G
🚀 每秒生成15.07字, 100字需要6.64秒
🚀 每秒生成16.72字, 100字需要5.98秒
🚀 每秒生成16.47字, 100字需要6.07秒
```


#### Baichuan2-7B-Chat（4bits）
在线量化
```py
model = AutoModelForCausalLM.from_pretrained("baichuan-inc/Baichuan2-7B-Chat", torch_dtype=torch.float16, trust_remote_code=True)
model = model.quantize(4).cuda()
```

```
显存：7.4G
🚀 每秒生成31.35字, 100字需要3.19秒
🚀 每秒生成30.28字, 100字需要3.30秒
🚀 每秒生成29.69字, 100字需要3.37秒
```


## 下载 HuggingFace 上的模型
### Git LFS（Large File Storage）
Git LFS（Large File Storage），它是 Git 版本控制系统的一个扩展，专门用于管理大型文件。Git LFS 的目标是在版本控制中更有效地处理大型二进制文件，例如图像、音频、视频等。

使用 Git LFS 有助于减轻 Git 仓库因大型文件而变得庞大和不稳定的问题。它通过将实际文件存储在 Git 仓库之外，并在仓库中保存指向这些文件的指针来实现。这样可以提高仓库的性能，加快克隆、拉取和提交操作。

### 安装 Git LFS
```shell
sudo apt-get install git-lfs
git lfs install
```

## 参考资料
* [ChatGLM2-6B](https://github.com/THUDM/ChatGLM2-6B)
* [FLASH：可能是近来最有意思的高效Transformer设计](https://kexue.fm/archives/8934)
* [ModelScope 模型的下载](https://www.modelscope.cn/docs/%E6%A8%A1%E5%9E%8B%E7%9A%84%E4%B8%8B%E8%BD%BD)
