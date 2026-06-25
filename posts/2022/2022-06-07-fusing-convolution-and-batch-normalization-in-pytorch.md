---
type: article
title:  "在 PyTorch 中融合卷积和批量标准化"
date:   2022-06-07 00:00:00 +0800
tags: [fusion, convolution, batchnorm, pytorch, timeit]
---

## 融合卷积和批量标准化的原理
![](/images/2022/fusion/fusing-convolution-and-batch-normalization.png)
* [PyTorch 卷积与BatchNorm的融合](https://zhuanlan.zhihu.com/p/49329030)

## [PyTorch 的实现](https://github.com/pytorch/pytorch/blob/master/torch/nn/utils/fusion.py)
```py
def fuse_conv_bn_eval(conv, bn, transpose=False):
    assert(not (conv.training or bn.training)), "Fusion only for eval!"
    fused_conv = copy.deepcopy(conv)

    fused_conv.weight, fused_conv.bias = \
        fuse_conv_bn_weights(fused_conv.weight, fused_conv.bias,
                             bn.running_mean, bn.running_var, bn.eps, bn.weight, bn.bias, transpose)

    return fused_conv

def fuse_conv_bn_weights(conv_w, conv_b, bn_rm, bn_rv, bn_eps, bn_w, bn_b, transpose=False):
    if conv_b is None:
        conv_b = torch.zeros_like(bn_rm)
    if bn_w is None:
        bn_w = torch.ones_like(bn_rm)
    if bn_b is None:
        bn_b = torch.zeros_like(bn_rm)
    bn_var_rsqrt = torch.rsqrt(bn_rv + bn_eps)

    if transpose:
        shape = [1, -1] + [1] * (len(conv_w.shape) - 2)
    else:
        shape = [-1, 1] + [1] * (len(conv_w.shape) - 2)

    conv_w = conv_w * (bn_w * bn_var_rsqrt).reshape(shape)
    conv_b = (conv_b - bn_rm) * bn_var_rsqrt * bn_w + bn_b

    return torch.nn.Parameter(conv_w), torch.nn.Parameter(conv_b)
```

## 这里使用预训练模型 ResNet18 的两个层测试
```py
import torch
import torchvision

torch.set_grad_enabled(False)
x = torch.randn(16, 3, 256, 256)

rn18 = torchvision.models.resnet18(pretrained=True)
rn18.eval()
net = torch.nn.Sequential(
	rn18.conv1,
	rn18.bn1
)

y1 = net.forward(x)

fused_conv = torch.nn.utils.fusion.fuse_conv_bn_eval(net[0], net[1])
y2 = fused_conv.forward(x)

d = (y1 - y2).norm().div(y1.norm()).item()
print("error: %.8f" % d)
```
```
error: 0.00000022
```
* [Fusing batch normalization and convolution in runtime](https://nenadmarkus.com/p/fusing-batchnorm-and-conv/)

## 性能测量(🚀25%)
```py
import timeit

starttime = timeit.default_timer()
[net.forward(x) for _ in range(100)]
print("融合前推理100次的时间 :", timeit.default_timer() - starttime)


starttime = timeit.default_timer()
[fused_conv.forward(x) for _ in range(100)]
print("融合后推理100次的时间 :", timeit.default_timer() - starttime)
```
```
融合前推理100次的时间 : 2.601980792125687
融合后推理100次的时间 : 2.0703182069119066
```
* [Python Timeit() with Examples](https://www.guru99.com/timeit-python-examples.html)

## 参考资料
* [PyTorch 卷积与BatchNorm的融合](https://zhuanlan.zhihu.com/p/49329030)
* [Fusing batch normalization and convolution in runtime](https://nenadmarkus.com/p/fusing-batchnorm-and-conv/)
* [OpenVINO 性能优化指南](https://docs.openvino.ai/cn/latest/openvino_docs_optimization_guide_dldt_optimization_guide.html)
* [CONV2D](https://pytorch.org/docs/stable/generated/torch.nn.Conv2d.html)
* [BATCHNORM1D](https://pytorch.org/docs/stable/generated/torch.nn.BatchNorm1d.html)
* [FUSING CONVOLUTION AND BATCH NORM USING CUSTOM FUNCTION](https://pytorch.org/tutorials/intermediate/custom_function_conv_bn_tutorial.html)
* [TORCH.RSQRT](https://pytorch.org/docs/stable/generated/torch.rsqrt.html)
* [深度学习CNN网络推理时Batchnorm层和卷积层的融合，以提升推理速度。](https://blog.csdn.net/zengwubbb/article/details/109317661)
* [Batch Normalization in Convolutional Neural Networks](https://www.baeldung.com/cs/batch-normalization-cnn)
