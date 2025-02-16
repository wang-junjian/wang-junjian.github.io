---
layout: post
title:  "部署 DeepSeek-R1 蒸馏模型"
date:   2025-02-14 10:00:00 +0800
categories: DeepSeek-R1 vLLM
tags: [DeepSeek-R1, vLLM, Qwen, Jan, LLM]
---

## GPU 服务器

T4 GPU 服务器，4卡16G。


## 安装 vLLM

```bash
conda create -n deepseek-r1 python=3.12 -y
conda activate deepseek-r1

pip install vllm
```

- [Installation GPU](https://docs.vllm.ai/en/latest/getting_started/installation/gpu/index.html)

### 错误处理

#### ImportError: undefined symbol: __nvJitLinkComplete_12_4, version libnvJitLink.so.12

```bash
Traceback (most recent call last):
  File "/data/miniconda3/envs/deepseek-r1/bin/vllm", line 5, in <module>
    from vllm.scripts import main
  File "/data/miniconda3/envs/deepseek-r1/lib/python3.12/site-packages/vllm/__init__.py", line 5, in <module>
    import torch
  File "/data/miniconda3/envs/deepseek-r1/lib/python3.12/site-packages/torch/__init__.py", line 367, in <module>
    from torch._C import *  # noqa: F403
    ^^^^^^^^^^^^^^^^^^^^^^
ImportError: /data/miniconda3/envs/deepseek-r1/lib/python3.12/site-packages/torch/lib/../../nvidia/cusparse/lib/libcusparse.so.12: undefined symbol: __nvJitLinkComplete_12_4, version libnvJitLink.so.12
```

解决方法：

查找 `libnvJitLink.so.12` 文件路径：

```bash
find /usr/local/ -name libnvJitLink.so.12
/usr/local/cuda-12.4/targets/x86_64-linux/lib/libnvJitLink.so.12
/usr/local/cuda-12.2/targets/x86_64-linux/lib/libnvJitLink.so.12
```

创建软链接：

```bash
ln -s /usr/local/cuda-12.4/targets/x86_64-linux/lib/libnvJitLink.so.12 /data/miniconda3/envs/deepseek-r1/lib/python3.12/site-packages/nvidia/cusparse/lib/libnvJitLink.so.12
export LD_LIBRARY_PATH=/data/miniconda3/envs/deepseek-r1/lib/python3.12/site-packages/nvidia/cusparse/lib:$LD_LIBRARY_PATH
```

#### ValueError: Bfloat16 is only supported on GPUs with compute capability of at least 8.0

```bash
ValueError: Bfloat16 is only supported on GPUs with compute capability of at least 8.0. Your Tesla T4 GPU has compute capability 7.5. You can use float16 instead by explicitly setting the`dtype` flag in CLI, for example: --dtype=half.
```

解决方法：

T4 GPU 不支持 Bfloat16，需要设置 `--dtype=half`：

```bash
CUDA_VISIBLE_DEVICES=3 vllm serve DeepSeek-R1-Distill-Qwen-1.5B --enable-reasoning --reasoning-parser deepseek_r1 --dtype=half
```


## 下载 DeepSeek-R1 模型

- DeepSeek-R1-Distill-Qwen-1.5B
```bash
git clone https://www.modelscope.cn/deepseek-ai/DeepSeek-R1-Distill-Qwen-1.5B.git
```

- DeepSeek-R1-Distill-Qwen-7B
```bash
git clone https://www.modelscope.cn/deepseek-ai/DeepSeek-R1-Distill-Qwen-7B.git
```

- DeepSeek-R1-Distill-Qwen-14B
```bash
git clone https://www.modelscope.cn/deepseek-ai/DeepSeek-R1-Distill-Qwen-14B.git
```

- DeepSeek-R1-Distill-Qwen-32B
```bash
git clone https://www.modelscope.cn/deepseek-ai/DeepSeek-R1-Distill-Qwen-32B.git
```


## 部署 DeepSeek-R1 模型

```bash
vllm serve DeepSeek-R1-Distill-Qwen-14B \
  --served-model-name deepseek_r1 \
  --tensor-parallel-size 4 \
  --enable-reasoning \
  --reasoning-parser deepseek_r1 \
  --dtype=half \
  --gpu-memory-utilization 0.99 \
  --max-model-len 20000
```

> 单卡可以部署 1.5B 模型，4卡最多部署 14B 模型，需要将最大模型长度设置为 16000（默认：32K）。

- 指定 GPU 卡
  - 单卡：export CUDA_VISIBLE_DEVICES=3
  - 多卡：export CUDA_VISIBLE_DEVICES=0,1

## 聊天测试

### vLLM

```bash
curl 'http://localhost:8000/v1/chat/completions' \
    -H "Content-Type: application/json" \
    -d '{
        "model": "deepseek_r1",
        "messages": [ 
            { "role": "user", "content": "解释人工智能" } 
        ]
    }' | jq
```

```json
{
  "id": "chatcmpl-5c8ad704534544ed86a0d8d053de518d",
  "object": "chat.completion",
  "created": 1739525638,
  "model": "deepseek_r1",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "reasoning_content": null,
        "content": "嗯，用户的问题是“解释人工智能”。我需要先理解什么是人工智能，然后用简单易懂的话解释清楚。\n\n首先，人工智能，简称AI，是模拟人类智能的系统或机器。这个概念挺广泛的，包括很多方面，比如学习、推理、问题解决。其实，AI就是让计算机能执行那些通常需要人类智慧的任务。\n\n接下来，我应该分几个部分来解释。先介绍什么是人工智能，然后说说它的主要特征，比如学习和自适应，还有推理和问题解决。接着，可以讲讲常见的AI技术，像是机器学习、深度学习、自然语言处理，这些用户可能听过，但是可能不太清楚具体是什么。\n\n然后，应用领域也很重要。医疗、金融、交通、家居、教育……这些都是人工智能已经发挥作用的地方。用户可能对这些应用比较感兴趣，所以举一些具体的例子会更有帮助，比如Siri或者自动驾驶。\n\n还有，不能不提AI的优缺点和伦理问题。优点包括提高效率、辅助决策、改善生活质量。但同时，也有就业影响、隐私问题和潜在的滥用风险。这部分能让用户全面了解，不只是技术层面，还有社会影响。\n\n最后，结语部分要总结一下，说明人工智能的广泛影响，并展望未来的发展趋势。告诉用户AI将继续改变社会，但这也是一个需要共同面对挑战和机遇的领域。\n\n在组织语言时，要用口语化的表达，避免太学术化的术语，让用户容易理解。同时，分段清晰，每部分用标题来突出重点，这样看起来更有条理。\n\n现在，我需要把这些思路整理成一个连贯的解释，确保内容全面但不过于复杂，让用户能轻松掌握人工智能的基本概念和影响。\n</think>\n\n人工智能（Artificial Intelligence，简称AI）是指由人创造的能够执行通常需要人类智能的任务的系统。这些任务包括学习、推理、问题解决、感知、语言理解、规划等。\n\n人工智能的核心在于它的智能表现，主要体现在以下几个方面：\n\n1. **学习与自适应**：人工智能系统能够通过数据和经验来学习并改进性能。例如，机器学习算法可以通过分析大量数据来识别模式，并根据这些模式做出预测。\n\n2. **推理与问题解决**：人工智能能够通过逻辑推理解决问题，计算机会根据给定的信息进行分析，并推导出合理的解决方案。\n\n3. **模式识别与感知**：人工智能能够通过传感器或数据输入识别模式，比如计算机视觉（图像识别）和自然语言处理（语音识别、文本理解）。\n\n4. **自主决策**：在某些情况下，人工智能系统可以在没有明确的外部控制的情况下，做出决策，如自动驾驶汽车。\n\n人工智能通过多种技术实现，包括：\n\n- **机器学习（Machine Learning）**：通过大量数据训练模型，使模型能够学习任务。\n- **深度学习（Deep Learning）**：机器学习的一个分支，使用多层的神经网络处理复杂数据。\n- **自然语言处理（NLP）**：使计算机能够理解、处理和生成人类语言。\n- **计算机视觉（Computer Vision）**：使计算机能够从图像或视频中识别和理解视觉信息。\n- **机器人技术（Robotics）**：结合AI，使机器人能够感知环境并执行任务。\n\n人工智能应用广泛，如智能助手（Siri、Alexa）、推荐系统、自动驾驶、医疗诊断、金融分析、游戏AI等。随着技术的发展，AI的影响将扩展到更多领域。\n\n人工智能的优势在于它可以提高效率、提供精确的分析和决策支持，但也有其挑战和争议，例如数据隐私、就业岗位的替代、以及伦理问题等。",
        "tool_calls": []
      },
      "logprobs": null,
      "finish_reason": "stop",
      "stop_reason": null
    }
  ],
  "usage": {
    "prompt_tokens": 7,
    "total_tokens": 750,
    "completion_tokens": 743,
    "prompt_tokens_details": null
  },
  "prompt_logprobs": null
}
```

> 生成的内容缺少 &lt;think&gt; 标签，导致 vLLM 不能正确解析到 `reasoning_content`。

- [本地部署DeepSeek-R1-Distill-Qwen-32B,输出仅有&lt;/think>，没有&lt;think>](https://github.com/deepseek-ai/DeepSeek-R1/issues/352)
- [Bug: Use DeepSeek-R1-Distill-Qwen-32B, the result don't have start <think> and can not parse reasoning_content.](https://github.com/vllm-project/vllm/issues/13125)
- [Reasoning Outputs](https://docs.vllm.ai/en/latest/features/reasoning_outputs.html)

### Ollama

```bash
curl 'http://localhost:11434/v1/chat/completions' \
    -H "Content-Type: application/json" \
    -d '{
        "model": "deepseek-r1:latest",
        "messages": [ 
            { "role": "user", "content": "股票交易额突然放大，我应该怎么做？" } 
        ]
    }' | jq
```

```json
{
  "id": "chatcmpl-622",
  "object": "chat.completion",
  "created": 1739541793,
  "model": "deepseek-r1:latest",
  "system_fingerprint": "fp_ollama",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "<think>\n嗯，股票交易额突然放大了，这让我有点困惑。为什么会发生这种情况呢？是不是有什么消息让人兴奋或者担忧了？首先，我需要确认是不是我记错了数据或平台的问题。有时候电脑崩溃或者数据延迟会导致数值看起来不对。\n\n如果我确定是交易量真的增加了，那么为什么会这样？上涨的话可能是因为利好消息，比如公司不错的方向或行业趋势。下跌的话，可能是因为负面消息或市场情绪转差。不管怎么样，大交易量通常意味着有重要事件即将发生，所以我需要特别关注。\n\n接下来，我应该怎么处理这种情况呢？首先，我要仔细检查数据源的合法性，确保没有被篡改或错误加载。然后，及时获取最新的 market data，看看是不是发生了什么重大新闻或者公司的公告影响了市场。\n\n另外，我也要监控其他相关的指标，比如成交量带量吗？有没有突破关键阻力位或支撑位？这些可能提示股票即将进入一个趋势期。\n\n在确认无误的情况下，如果决定持有或加仓，我应该控制好仓位，避免高位追高导致风险增大。如果是有套现需求，也应该考虑什么时候更安全地出手。\n\n此外，在情绪管理上，我要保持冷静，不被短期波动所左右。记住，股市是长期投资的舞台，不应该过于在意短期的变化。\n\n总的来说，面对突然放大交易额的情况，我需要先验证数据的真实性，然后结合市场趋势和新闻来决策下一步行动，并在过程中做好风险控制。\n</think>\n\n当您注意到股票交易额突然放大时，可以按照以下步骤进行处理：\n\n1. **验证数据真实性：** 确认自己是否记错了或数据是否存在异常。检查多个渠道获取最新信息。\n\n2. **分析市场趋势：**\n   - 如果交易量激增 accompanied by price movement, 考虑市场情绪转向。\n   - 检查是否有重大新闻、公告或其他事件即将影响股票价格。\n\n3. **技术分析：** \n   - 查看成交量是否持续放大，以及股价是否在关键位附近出现反转或突破。\n   - 注意有没有趋势线被突破的情况。\n\n4. **设置止损和止盈：**\n   - 根据市场状况和发展趋势选择合适的数量比例，控制风险。\n   - 在可能的不利情况下及时了结，避免过大的亏损。\n\n5. **策略调整——灵活应对：** \n   - 如果判断当前股价上涨有确定性且市况好转，考虑适度加仓。\n   - 如果没有明确利好或风险迹象，考虑暂时观望或控制仓位。\n\n6. **情绪管理：** 保持冷静和理性，避免因为短期波动影响决策。记住，股市是长期的投资战场，短期的涨跌不代表全部。\n\n7. **市场整体评估：** 考虑当前市场的整体状况及投资策略是否与大势相符。如果市场持续看好，可能保持长期持有的可能性；反之，则进行必要的调整。\n\n通过以上步骤，您可以更有效地应对突然出现的大交易量情况，并根据市场变化做出合理的决策，以减少不必要的风险和优化投资策略。"
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 13,
    "completion_tokens": 636,
    "total_tokens": 649
  }
}
```


## 客户端

下载 [Jan](https://jan.ai/) 客户端。

### 设置

![](/images/2025/Jan/Jan-Settings.png) 

### 聊天

![](/images/2025/Jan/Jan.png)


## 参考资料
- [DeepSeek API 文档：推理模型 (deepseek-reasoner)](https://api-docs.deepseek.com/zh-cn/guides/reasoning_model)
- [Qwen - vLLM](https://qwen.readthedocs.io/en/latest/deployment/vllm.html)
