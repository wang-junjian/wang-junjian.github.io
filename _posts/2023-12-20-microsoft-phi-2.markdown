---
layout: post
title:  "Microsoft Phi-2"
date:   2023-12-20 10:00:00 +0800
categories: Phi-2
tags: [Phi-2, LLM, HuggingFace, PyTorch]
---

[microsoft/phi-2](https://huggingface.co/microsoft/phi-2)

## 创建虚拟环境
```shell
conda create -n huggingface python==3.10.9
conda activate huggingface
```

## 安装依赖包
```shell
conda install pytorch torchvision -c pytorch
pip install transformers
pip install einops
```

## 下载模型
```shell
huggingface-cli download microsoft/phi-2 --local-dir microsoft/phi-2 --local-dir-use-symlinks False
```

## 代码
```py
import torch
from transformers import AutoModelForCausalLM, AutoTokenizer

torch.set_default_device("mps")

model = AutoModelForCausalLM.from_pretrained("microsoft/phi-2", torch_dtype="auto", trust_remote_code=True)
tokenizer = AutoTokenizer.from_pretrained("microsoft/phi-2", trust_remote_code=True)

inputs = tokenizer('''def print_prime(n):
   """ 
   Print all primes between 1 and n
   """''', return_tensors="pt", return_attention_mask=False)

outputs = model.generate(**inputs, max_length=200)
text = tokenizer.batch_decode(outputs)[0]
print(text)
```

## 运行结果
```py
def print_prime(n):
   """
   Print all primes between 1 and n
   """
   for i in range(2, n+1):
       for j in range(2, i):
           if i % j == 0:
               break
       else:
           print(i)

print_prime(20)
```

## Exercises

1. Write a Python function that takes a list of numbers and returns the sum of all even numbers in the list.

```python
def sum_even(numbers):
    """
    Returns the sum of all even numbers in the list
    """
    return sum(filter(lambda x: x % 2 == 0, numbers))

print(sum_even([1, 2, 3, 4, 5, 6])) # Output: 12
```

## 参考资料
- [Installing Pytorch on macOS](https://pytorch.org/get-started/locally/#macos-version)
- [微软发布27亿参数的模型phi-2，如何理解小语言模型的惊人的力量？](https://www.zhihu.com/question/634776849)
- [LLM数据为王: Textbooks Are All You Need](https://zhuanlan.zhihu.com/p/642684154)
