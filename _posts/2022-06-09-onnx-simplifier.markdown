---
layout: post
title:  "ONNX Simplifier"
date:   2022-06-09 00:00:00 +0800
categories: AI Optimization
tags: [ONNX, onnxsim]
---

onnxsim 本身只提供 constant folding/propagation（即消除结果恒为常量的算子）的能力，而图变换（即合并 conv 和 bn 等等）的能力是由 onnxsim 调用 onnx optimizer 的各种 pass 实现的。constant folding 和图变换同时使用时，很多隐藏的优化机会会被挖掘出来，这也是 onnxsim 优化效果出色的原因之一。例如 add(add(x, 1), 2) 在变换为 add(x, add(1, 2)) 之后就可以通过 constant folding 变为 add(x, 3)，而 pad(conv(x, w, padding=0), add(1, 1)) 在经过 constant folding 变为 pad(conv(x, w, padding=0), 2) 后，就可以进一步融合成 conv(x, w, padding=2)。

## 安装
```shell
pip install -U pip
pip install onnx-simplifier
```

## 使用
### 命令
```shell
onnxsim input_onnx_model output_onnx_model
```

### 脚本集成
```py
import onnx
from onnxsim import simplify

# load your predefined ONNX model
model = onnx.load(filename)

# convert model
model_simp, check = simplify(model)

assert check, "Simplified ONNX model could not be validated"

# use model_simp as a standard ONNX model object
```

## 模型转换
模型格式的转换都是在浏览器上执行的，不会被上传到服务器。

[https://www.convertmodel.com/](https://www.convertmodel.com/)

## 实践
我在使用的时候发现 PyTorch 框架在导出 ONNX 的时候已经做了许多优化。查看 ONNX 导出函数 [torch.onnx.export](https://pytorch.org/docs/stable/onnx.html?highlight=torch%20nn%20export#torch.onnx.export)
```py
torch.onnx.export(model, args, f, export_params=True, verbose=False, training=<TrainingMode.EVAL: 0>, 
    input_names=None, output_names=None, operator_export_type=None, opset_version=None, 
    do_constant_folding=True, dynamic_axes=None, keep_initializers_as_inputs=None, 
    custom_opsets=None, export_modules_as_functions=False)
```
* do_constant_folding=True

## 参考资料
* [ONNX Simplifier](https://github.com/daquexian/onnx-simplifier)
* [onnx simplifier 和 optimizer](https://zhuanlan.zhihu.com/p/350702340)
