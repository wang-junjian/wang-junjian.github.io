---
layout: post
title:  "在 MacBook Pro M2 Max 上测试 ChatGLM-6B"
date:   2023-04-13 08:00:00 +0800
categories: ChatGLM-6B
tags: [ChatGLM, GLM, ChatGPT, MacBookProM2Max]
---

ChatGLM-6B 是一个开源的、支持中英双语的对话语言模型，基于 General Language Model (GLM) 架构，具有 62 亿参数。

## [聊天 ChatGLM-6B](https://github.com/THUDM/ChatGLM-6B)
### 下载
#### 克隆
```bash
https://github.com/THUDM/ChatGLM-6B.git
cd ChatGLM-6B
```

#### 下载模型
* 从 [Hugging Face Hub](https://huggingface.co/THUDM/chatglm-6b) 下载模型

```bash
git clone https://huggingface.co/THUDM/chatglm-6b THUDM/chatglm-6b
```

* 在国内为了加快下载速度，模型文件可以单独从 [清华云](https://cloud.tsinghua.edu.cn/d/fb9f16d6dc8f482596c2/?p=%2F&mode=list) 下载。

```bash
GIT_LFS_SKIP_SMUDGE=1 git clone https://huggingface.co/THUDM/chatglm-6b THUDM/chatglm-6b

wget "https://cloud.tsinghua.edu.cn/d/fb9f16d6dc8f482596c2/files/?p=%2Fice_text.model&dl=1" -O THUDM/chatglm-6b/ice_text.model
for i in {1..8}; do wget "https://cloud.tsinghua.edu.cn/d/fb9f16d6dc8f482596c2/files/?p=%2Fpytorch_model-0000${i}-of-00008.bin&dl=1" -O THUDM/chatglm-6b/pytorch_model-0000${i}-of-00008.bin; done
```

### 搭建环境
#### 创建虚拟环境
```bash
conda create --name pytorch python
conda activate pytorch
```

#### 安装最新版 PyTorch
```bash
pip install --upgrade --pre torch torchvision torchaudio --index-url https://download.pytorch.org/whl/nightly/cpu
```

#### 安装依赖
```bash
pip install -r requirements.txt
```

### 运行
需要修改以下文件，指定计算设备：
* cli_demo.py 命令行交互
* web_demo.py Web 交互（Gradio）
* web_demo2.py Web 交互（Streamlit）
* api.py REST API 服务

#### CUDA (默认)
```py
model = AutoModel.from_pretrained("THUDM/chatglm-6b", trust_remote_code=True).half().cuda()
```

#### MPS
```py
model = AutoModel.from_pretrained("THUDM/chatglm-6b", trust_remote_code=True).half().to('mps')
```

#### CPU
```py
model = AutoModel.from_pretrained("THUDM/chatglm-6b", trust_remote_code=True).float()
```

默认对话的最大长度为 2048，所以聊天的时候，如果超过 2048 个字，就会报错。
```
Input length of input_ids is 2059, but `max_length` is set to 2048. This can lead to unexpected behavior. You should consider increasing `max_new_tokens`.
```

#### 资源使用

| 模型参数 | 模型大小 | 量化精度 | CPU | MPS | GPU |
| --- | --- | --- | --- | --- | --- |
| 6.2B    | 13G    | FP16    | 22G | 13G | 12G |

使用 MPS 的时候，内存会随着聊天持续且快速增长。


## [微调 ChatGLM-6B-PT](https://github.com/THUDM/ChatGLM-6B/blob/main/ptuning/README.md)
### 搭建环境
#### 创建虚拟环境
```bash
conda create -n chatglm6b python==3.10.9
conda activate chatglm6b
```

#### 安装依赖
```bash
conda install -n chatglm6b  pytorch==1.12 torchvision torchaudio cudatoolkit -c pytorch
pip install rouge_chinese nltk jieba datasets
pip install protobuf==3.20 transformers==4.27.1 cpm_kernels gradio mdtex2html sentencepiece
pip install absl-py wrapt opt_einsum astunparse termcolor flatbuffers chardet cchardet
```

### 数据集
#### 下载 [ADGEN](https://aclanthology.org/D19-1321.pdf) 数据集
```bash
```bash
wget https://cloud.tsinghua.edu.cn/f/b3f119a008264b1cabd1/?dl=1 -O AdvertiseGen.tar.gz
tar xzvf AdvertiseGen.tar.gz
```

#### ADGEN 数据集任务为根据输入（content）生成一段广告词（summary）。
```json
{
    "content": "类型#上衣*版型#宽松*版型#显瘦*图案#线条*衣样式#衬衫*衣袖型#泡泡袖*衣款式#抽绳",
    "summary": "这件衬衫的款式非常的宽松，利落的线条可以很好的隐藏身材上的小缺点，穿在身上有着很好的显瘦效果。领口装饰了一个可爱的抽绳，漂亮的绳结展现出了十足的个性，配合时尚的泡泡袖型，尽显女性甜美可爱的气息。"
}
```

### 预训练模型
```bash
cp -r ../THUDM .
```

### 训练 P-tuning v2
#### 默认量化精度 INT4
```bash
sh train.sh
```

可以根据需要修改 `train.sh` 中的参数。

#### 量化精度是 FP6
```bash
PRE_SEQ_LEN=128
LR=2e-2

CUDA_VISIBLE_DEVICES=0 python3 main.py \
    --do_train \
    --train_file AdvertiseGen/train.json \
    --validation_file AdvertiseGen/dev.json \
    --prompt_column content \
    --response_column summary \
    --overwrite_cache \
    --model_name_or_path THUDM/chatglm-6b \
    --output_dir output/adgen-chatglm-6b-pt-$PRE_SEQ_LEN-$LR \
    --overwrite_output_dir \
    --max_source_length 64 \
    --max_target_length 64 \
    --per_device_train_batch_size 1 \ 
    --per_device_eval_batch_size 1 \ 
    --gradient_accumulation_steps 16 \
    --predict_with_generate \
    --max_steps 3000 \
    --logging_steps 10 \
    --save_steps 1000 \
    --learning_rate $LR \
    --pre_seq_len $PRE_SEQ_LEN 
```

### 评估
如果使用量化精度是 FP6，需要移除 `--quantization_bit 4` 参数。

```bash
sh evaluate.sh
```

### 模型部署
#### DEMO
```py
import os
import platform
import signal
import torch
from transformers import AutoConfig, AutoTokenizer, AutoModel


# 加载预训练模型
PRE_TRAINING_MODEL_PATH = 'THUDM/chatglm-6b'
tokenizer = AutoTokenizer.from_pretrained(PRE_TRAINING_MODEL_PATH, trust_remote_code=True)
config = AutoConfig.from_pretrained(PRE_TRAINING_MODEL_PATH, trust_remote_code=True, pre_seq_len=128)
model = AutoModel.from_pretrained(PRE_TRAINING_MODEL_PATH, config=config, trust_remote_code=True)

# 加载微调的参数
CHECKPOINT_PATH = 'output/adgen-chatglm-6b-pt-128-2e-2/checkpoint-3000/'
prefix_state_dict = torch.load(os.path.join(CHECKPOINT_PATH, "pytorch_model.bin"))
new_prefix_state_dict = {}
for k, v in prefix_state_dict.items():
    if k.startswith("transformer.prefix_encoder."):
        new_prefix_state_dict[k[len("transformer.prefix_encoder."):]] = v 
model.transformer.prefix_encoder.load_state_dict(new_prefix_state_dict)

# model = model.quantize(4) # 使用 FP16 量化
model = model.half().cuda()
model.transformer.prefix_encoder.float()
model = model.eval()

os_name = platform.system()
clear_command = 'cls' if os_name == 'Windows' else 'clear'
stop_stream = False


def build_prompt(history):
    prompt = "欢迎使用 ChatGLM-6B 模型，输入内容即可进行对话，clear 清空对话历史，stop 终止程序"
    for query, response in history:
        prompt += f"\n\n用户：{query}"
        prompt += f"\n\nChatGLM-6B：{response}"
    return prompt


def signal_handler(signal, frame):
    global stop_stream
    stop_stream = True


def main():
    history = []
    global stop_stream
    print("欢迎使用 ChatGLM-6B 模型，输入内容即可进行对话，clear 清空对话历史，stop 终止程序")
    while True:
        query = input("\n用户：")
        if query.strip() == "stop":
            break
        if query.strip() == "clear":
            history = []
            os.system(clear_command)
            print("欢迎使用 ChatGLM-6B 模型，输入内容即可进行对话，clear 清空对话历史，stop 终止程序")
            continue
        count = 0 
        for response, history in model.stream_chat(tokenizer, query, history=history):
            if stop_stream:
                stop_stream = False
                break
            else:
                count += 1
                if count % 8 == 0:
                    os.system(clear_command)
                    print(build_prompt(history), flush=True)
                    signal.signal(signal.SIGINT, signal_handler)
        os.system(clear_command)
        print(build_prompt(history), flush=True)


if __name__ == "__main__":
    main()
```

### 资源使用
#### 训练

| 精度 | 显存 | 用时 | 
| --- | ---: | ---: |
| FP16 | 13.5G | 4 小时 33 分 |
| INT4 |  5.3G | 9 小时 43 分 |

* 训练指标(FP16)
```
  epoch                    =       0.42
  train_loss               =     3.9119
  train_runtime            = 4:33:44.72
  train_samples            =     114599
  train_samples_per_second =      2.922
  train_steps_per_second   =      0.183
```

* 训练指标(INT4)
```
  epoch                    =       0.42
  train_loss               =     3.9329
  train_runtime            = 9:43:08.80
  train_samples            =     114599
  train_samples_per_second =      1.372
  train_steps_per_second   =      0.086
```

#### 评估

| 精度 | 显存 | 用时 | 
| --- | ---: | ---: |
| FP16 |  13G | 1 小时 |
| INT4 | 5.7G | 2 小时 32 分 |

* 评估指标(FP16)
```
  predict_bleu-4             =     7.8867
  predict_rouge-1            =    31.1265
  predict_rouge-2            =     7.0495
  predict_rouge-l            =    24.8459
  predict_runtime            = 0:59:45.02
  predict_samples            =       1070
  predict_samples_per_second =      0.298
  predict_steps_per_second   =      0.298
```

* 评估指标(INT4)
```
  predict_bleu-4             =     8.0218
  predict_rouge-1            =    31.4474
  predict_rouge-2            =     7.2794
  predict_rouge-l            =    25.0934
  predict_runtime            = 2:32:33.50
  predict_samples            =       1070
  predict_samples_per_second =      0.117
  predict_steps_per_second   =      0.117
```

#### 推理

| 精度 | 显存 |
| --- | ---: |
| FP16 | 13G |
| INT4 | 4.7G |

### 对话效果
#### 示例1
```json
{
    "content": "类型#裙*裙下摆#弧形*裙腰型#高腰*裙长#半身裙*裙款式#不规则*裙款式#收腰", 
    "summary": "这款来自梵凯的半身裙富有十足的设计感，采用了别致的不规则设计，凸显出时尚前卫的格调，再搭配俏皮的高腰设计，收腰提臀的同时还勾勒出优美迷人的身材曲线，而且还帮你拉长腿部比例，释放出优雅娇俏的小女人味。并且独特的弧形下摆还富有流畅的线条美，一颦一动间展现出灵动柔美的气质。"
}
```

##### 微调前
```
高腰收腰连衣裙
类型：裙
版型：弧形
裙腰型：高腰
裙长：半身裙
设计元素：不规则
裙款式：收腰
```

##### 微调后(FP16)
```
半身裙是春季的必备单品，收腰的版型设计，修饰出纤细的身姿。腰部弧形设计，凸显曼妙身姿，收腰的版型设计，拉长身材比例，尽显高挑曼妙的身姿。裙摆不规则设计，灵动飘逸，凸显个性，让你穿出与众不同的时尚。高腰的版型设计，提高腰线，展现高挑
```

##### 微调后(INT4)
```
一款优雅大气的半身裙，高腰的版型，修饰腰身，更显身材高挑，不规则的裙摆，展现女性的独特气质，更加优雅大气。收腰的弧形设计，修饰腰部，更显身材纤细。
```

#### 示例2
```json
{
    "content": "类型#上衣*版型#宽松*风格#英伦*风格#复古*图案#格子*图案#复古*图案#线条*衣样式#外套*衣样式#西装*衣领型#翻领", 
    "summary": "这件西装外套选用了经久不衰的格纹元素，通过色彩的明暗对比，展现出丰富的视觉层次，又缔造了英伦风的复古气息。法式的大翻领，延长颈部线条，彰显出女性帅气干练的特殊魅力。宽松舒适的版型完美掩藏了身材的小秘密，给身体自由活动空间。"
}
```

##### 微调前
```
宽松复古外套
类型：上衣
版型：宽松
风格：英伦
复古
图案：格子
复古
图案：线条
衣领型：翻领
设计元素：外套
```

##### 微调后(FP16)
```
西装外套是春季必备单品，宽松的版型设计，凸显随性慵懒的气质。复古的格子图案，凸显复古的英伦风，尽显个性。高腰的收腰设计，拉长身材比例，尽显高挑曼妙的身姿。不规则裙摆设计，灵动飘逸，展现灵动飘逸的韵味。
```

##### 微调后(INT4)
```
这款外套采用了经典的西装翻领设计，展现女性干练优雅的一面，搭配修身的的版型，展现女性高挑的身材。宽松的衣身，修饰腿部线条，更显高挑。收腰的弧形设计，修饰腰部，更显纤细。不规则的裙摆，展现女性独特的气质。
```

#### 示例3
```json
{
    "content": "类型#裤*版型#显瘦*版型#h*材质#蕾丝*风格#ol*风格#潮*图案#蝴蝶结*图案#蕾丝*裤款式#绑带*裤腰型#高腰*裤口#微喇裤", 
    "summary": "优雅气质的花边领口设计，凸显服装的时尚新潮。时尚喇叭袖口搭配绑带蝴蝶结，蕾丝裙摆设计，穿着飘>     逸大方，彰显女神范。高腰设计，拉长腿部比例，a字裙摆，遮肉显瘦，有范优雅显气质，谁都能hold住的实穿款。"
}
```

##### 微调前
```
高腰微喇裤
类型：裤
版型：显瘦
材质：h
风格：ol
潮
图案：蝴蝶结
蕾丝
裤款式：绑带
裤腰型：高腰
微喇裤
```

##### 微调后(FP16)
```
这是一款非常时尚个性的裤子，高腰的设计，提高腰线，拉长身材比例，展现高挑曼妙的身姿。时尚的蕾丝设计，彰显浪漫气质。不规则裙摆设计，灵动飘逸，尽显个性。蝴蝶结的绑带设计，更显甜美气质。微喇的裤型设计，修身显瘦，尽显苗条身姿
```

##### 微调后(INT4)
```
一款时尚又优雅的半身裙，采用经典的蕾丝设计，展现女性优雅的气质。高腰的版型，修饰腰部，更显纤细，同时展现女性高挑的身材。微喇的裤型，修饰腿部线条，更显高挑。蝴蝶结的绑带设计，展现女性的浪漫情怀。
```

## FAQ
* RuntimeError: Internal: a\sentencepiece\sentencepiece\src\sentencepiece_processor.cc(1102) [model_proto->ParseFromArray(serialized.data(), serialized.size())]
这个问题是因为我的模型文件分开下载的，我没有从清华云下载 `ice_text.model` 文件，版本不一致导致的。

* RuntimeError: Currently topk on mps works only for k<=16 

我重新安装了最新版的 PyTorch 就可以了。
```bash
pip install --upgrade --pre torch torchvision torchaudio --index-url https://download.pytorch.org/whl/nightly/cpu
```

## 参考资料
* [ChatGLM](https://chatglm.cn/)
* [ChatGLM：千亿基座的对话模型开启内测⸺对应单卡版本开源](https://chatglm.cn/blog)
* [THUDM/ChatGLM-6B](https://github.com/THUDM/ChatGLM-6B)
* [Hugging Face THUDM/chatglm-6b](https://huggingface.co/THUDM/chatglm-6b)
* [THUDM/GLM](https://github.com/THUDM/GLM)
* [BELLE: Be Everyone's Large Language model Engine](https://github.com/LianjiaTech/BELLE)
* [ModelNet](https://modelnet.ai/home)
* [Guanaco: A Multilingual Instruction-Following Language Model Based on LLaMA 7B](https://guanaco-model.github.io)
* [P-tuning v2](https://github.com/THUDM/P-tuning-v2)
* [大模型LLM-微调经验分享&总结](https://www.cvmart.net/community/detail/7517)
* [ChatGLM-6B 在 ModelWhale 平台的部署与微调教程](https://www.heywhale.com/mw/project/6436d82948f7da1fee2be59e)
* [ChatGLM-6B-PT](https://github.com/THUDM/ChatGLM-6B/blob/main/ptuning/README.md)
* [DoctorGLM](https://github.com/xionghonglin/DoctorGLM)
* [Chinese medical dialogue data 中文医疗对话数据集](https://github.com/Toyhom/Chinese-medical-dialogue-data)
* [基于prompt tuning v2训练好一个垂直领域的chatglm-6b](https://www.jb51.net/article/280637.htm)
* [基于本地知识的 ChatGLM 应用实现](https://www.githubs.cn/projects/621799276-langchain-chatglm)
* [基于本地知识的 ChatGLM 应用实现](https://www.heywhale.com/mw/notebook/643a53a948f7da1fee63d1f6)
* [本地安装部署运行 ChatGLM-6B 的常见问题解答以及后续优化](https://www.tjsky.net/tutorial/667)
