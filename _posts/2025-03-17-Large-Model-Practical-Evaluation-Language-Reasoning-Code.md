---
layout: single
title:  "大模型实战评测：语言 vs 推理 vs 代码"
date:   2025-03-17 10:00:00 +0800
categories: Benchmark LLM
tags: [Benchmark, LLM, Qwen, DeepSeek]
---

## 总结

| 模型类型 | 模型 | 评估结果 |
| --- | --- | --- |
| 语言模型 | Qwen2.5-0.5B | ❌ |
|         | Qwen2.5-1.5B | ✅ |
|         | Qwen2.5-7B | ✅ |
|         | Qwen2.5-14B-Instruct | ✅ |
|         | Qwen2.5-32B-Instruct | ✅ |
| 推理模型 | DeepSeek-R1-Distill-Qwen2.5-1.5B | ❌ |
|         | DeepSeek-R1-Distill-Qwen2.5-7B | ❌ |
|         | DeepSeek-R1-Distill-Qwen2.5-14B | ✅ |
|         | DeepSeek-R1-Distill-Qwen2.5-32B | ✅ |
|         | Qwen/QwQ-32B | ✅ |
|         | Qwen/QwQ-32B-Preview | ✅ |
|         | Qwen/QwQ-32B-AWQ | ❌ |
| 代码模型 | Qwen2.5-Coder-0.5B | ❌ |
|         | Qwen2.5-Coder-1.5B | ✅ |
|         | Qwen2.5-Coder-3B | ✅ |

对于这样的`阅读理解任务`，推理模型的表现要反而不如语言模型和代码模型，通过分析发现在思考的过程可能会出错而导致答案错误。对于大参数模型，进行了量化会导致模型性能下降，如：Qwen/QwQ-32B-AWQ。


## 提示词
```
收入		
截至12月31日止年度 2024年 人民幣千元	2023年 人民幣千元
商品收入：		
醫藥和健康產品銷售	48,795,702	45,652,922
服務收入：		
平台、廣告及其他服務	9,364,179	7,877,019
58,159,881	53,529,941
收入確認的時間		
某一時間點	57,725,324	53,055,774
一段時間內	434,557	474,167
58,159,881	53,529,941
除稅前盈利		
截至12月31日止年度	
2024年	2023年
人民幣千元	人民幣千元
已出售存貨的成本	44,744,578	
41,366,786
員工福利開支	2,409,732	2,877,031
物流與倉儲服務開支	4,203,081	
3,509,732
由京東集團提供的技術和流量支持服務的開支	2,228,270	2,056,136
推廣及廣告開支	1,564,179	
1,304,873
支付服務開支	405,338	435,718
物業及設備及使用權資產折舊以及無形資產攤銷	214,695	
227,458
核數師酬金	7,860	7,860


上面的内容是京东健康2024年年度报告里的数据。京东健康2024年收入
```


## 评估模型

### 语言模型
- Qwen2.5-0.5B（阿里云百炼）
- Qwen2.5-1.5B（阿里云百炼）
- Qwen2.5-7B（阿里云百炼）
- Qwen2.5-14B-Instruct（硅基流动）
- Qwen2.5-32B-Instruct（硅基流动）

### 推理模型
- DeepSeek-R1-Distill-Qwen2.5-1.5B（硅基流动）
- DeepSeek-R1-Distill-Qwen2.5-7B（硅基流动）
- DeepSeek-R1-Distill-Qwen2.5-14B（硅基流动）
- DeepSeek-R1-Distill-Qwen2.5-32B（硅基流动）
- Qwen/QwQ-32B（硅基流动）
- Qwen/QwQ-32B-Preview（硅基流动）
- Qwen/QwQ-32B-AWQ（本地 vLLM 部署）

### 代码模型
- Qwen2.5-Coder-3B（阿里云百炼）
- Qwen2.5-Coder-1.5B（阿里云百炼）
- Qwen2.5-Coder-0.5B（阿里云百炼）


## 评估结果

### 语言模型

- Qwen2.5-0.5B ❌

![](/images/2025/LLMEval/Qwen2.5-0.5B.png)

- Qwen2.5-1.5B ✅

![](/images/2025/LLMEval/Qwen2.5-1.5B.png)

- Qwen2.5-7B ✅

![](/images/2025/LLMEval/Qwen2.5-7B.png)

- Qwen2.5-14B-Instruct ✅

![](/images/2025/LLMEval/Qwen2.5-14B-Instruct.png)

- Qwen2.5-32B-Instruct ✅

![](/images/2025/LLMEval/Qwen2.5-32B-Instruct.png)

### 推理模型

- DeepSeek-R1-Distill-Qwen2.5-1.5B ❌

![](/images/2025/LLMEval/DeepSeek-R1-Distill-Qwen2.5-1.5B.png)

- DeepSeek-R1-Distill-Qwen2.5-7B ❌

![](/images/2025/LLMEval/DeepSeek-R1-Distill-Qwen2.5-7B.png)

- DeepSeek-R1-Distill-Qwen2.5-14B ✅

![](/images/2025/LLMEval/DeepSeek-R1-Distill-Qwen2.5-14B.png)

- DeepSeek-R1-Distill-Qwen2.5-32B ✅

![](/images/2025/LLMEval/DeepSeek-R1-Distill-Qwen2.5-32B.png)

- Qwen/QwQ-32B ✅

![](/images/2025/LLMEval/Qwen-QwQ-32B.png)

- Qwen/QwQ-32B-Preview ✅

![](/images/2025/LLMEval/Qwen-QwQ-32B-Preview.png)

- Qwen/QwQ-32B-AWQ ❌

![](/images/2025/LLMEval/Qwen-QwQ-32B-AWQ-vLLM.png)

### 代码模型

- Qwen2.5-Coder-0.5B ❌

![](/images/2025/LLMEval/Qwen2.5-Coder-0.5B.png)

- Qwen2.5-Coder-1.5B ✅

![](/images/2025/LLMEval/Qwen2.5-Coder-1.5B.png)

- Qwen2.5-Coder-3B ✅

![](/images/2025/LLMEval/Qwen2.5-Coder-3B.png)


## 参考资料
- [硅基流动](https://siliconflow.cn/zh-cn/)
- [阿里云百炼](https://bailian.console.aliyun.com/)
