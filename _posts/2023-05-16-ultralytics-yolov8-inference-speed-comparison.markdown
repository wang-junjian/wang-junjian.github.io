---
layout: single
title:  "Ultralytics YOLOv8 推理速度对比"
date:   2023-05-16 08:00:00 +0800
categories: Inference
tags: [Ultralytics, YOLO, pt, ONNX, 知识扩展]
---

## CPU
### 服务器信息
#### lscpu
```
Architecture:                    x86_64
CPU op-mode(s):                  32-bit, 64-bit
Byte Order:                      Little Endian
Address sizes:                   46 bits physical, 48 bits virtual
CPU(s):                          40
On-line CPU(s) list:             0-39
Thread(s) per core:              2
Core(s) per socket:              10
Socket(s):                       2
NUMA node(s):                    2
Vendor ID:                       GenuineIntel
CPU family:                      6
Model:                           79
Model name:                      Intel(R) Xeon(R) CPU E5-2640 v4 @ 2.40GHz
Stepping:                        1
CPU MHz:                         1201.687
CPU max MHz:                     3400.0000
CPU min MHz:                     1200.0000
BogoMIPS:                        4788.86
Virtualization:                  VT-x
L1d cache:                       640 KiB
L1i cache:                       640 KiB
L2 cache:                        5 MiB
L3 cache:                        50 MiB
NUMA node0 CPU(s):               0-9,20-29
NUMA node1 CPU(s):               10-19,30-39
Vulnerability Itlb multihit:     KVM: Mitigation: Split huge pages
Vulnerability L1tf:              Mitigation; PTE Inversion; VMX conditional cache flushes, SMT vulnerable
Vulnerability Mds:               Mitigation; Clear CPU buffers; SMT vulnerable
Vulnerability Meltdown:          Mitigation; PTI
Vulnerability Spec store bypass: Mitigation; Speculative Store Bypass disabled via prctl and seccomp
Vulnerability Spectre v1:        Mitigation; usercopy/swapgs barriers and __user pointer sanitization
Vulnerability Spectre v2:        Mitigation; Full generic retpoline, IBPB conditional, IBRS_FW, STIBP conditional, RSB filling
Vulnerability Srbds:             Not affected
Vulnerability Tsx async abort:   Mitigation; Clear CPU buffers; SMT vulnerable
Flags:                           fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb rdtscp lm constant_tsc arch_perfmon pebs bts rep_good nop
                                 l xtopology nonstop_tsc cpuid aperfmperf pni pclmulqdq dtes64 ds_cpl vmx smx est tm2 ssse3 sdbg fma cx16 xtpr pdcm pcid dca sse4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c 
                                 rdrand lahf_lm abm 3dnowprefetch cpuid_fault epb cat_l3 cdp_l3 invpcid_single pti intel_ppin ssbd ibrs ibpb stibp tpr_shadow vnmi flexpriority ept vpid ept_ad fsgsbase tsc_adjust bmi1 hle avx2 sme
                                 p bmi2 erms invpcid rtm cqm rdt_a rdseed adx smap intel_pt xsaveopt cqm_llc cqm_occup_llc cqm_mbm_total cqm_mbm_local dtherm ida arat pln pts md_clear flush_l1d
```

### 模型推理（pt 格式）
```bash
yolo predict task=detect model=best.pt project=platen-switch imgsz=640 source=/usr/src/datasets/platen-switch/images/train
```

#### 训练中的模型（24MB）

```
Ultralytics YOLOv8.0.92 🚀 Python-3.10.7 torch-2.0.0+cpu CPU
Model summary (fused): 168 layers, 3006038 parameters, 0 gradients, 8.1 GFLOPs

image 1/304 /usr/src/datasets/platen-switch/images/train/1.jpg: 480x640 22 closes, 14 opens, 51.7ms
image 2/304 /usr/src/datasets/platen-switch/images/train/2.jpg: 384x640 12 closes, 24 opens, 45.7ms
image 3/304 /usr/src/datasets/platen-switch/images/train/3.jpg: 576x640 12 closes, 33 opens, 62.3ms

Speed: 3.7ms preprocess, 45.0ms inference, 1.3ms postprocess per image at shape (1, 3, 640, 640)
```

#### 训练后的模型（6MB）

```
image 1/304 /usr/src/datasets/platen-switch/images/train/1.jpg: 480x640 22 closes, 14 opens, 47.8ms
image 2/304 /usr/src/datasets/platen-switch/images/train/2.jpg: 384x640 12 closes, 24 opens, 40.4ms
image 3/304 /usr/src/datasets/platen-switch/images/train/3.jpg: 576x640 12 closes, 33 opens, 48.8ms

Speed: 2.9ms preprocess, 35.9ms inference, 1.2ms postprocess per image at shape (1, 3, 640, 640)
```

### 模型推理（ONNX 格式）
```bash
yolo predict task=detect model=best.onnx project=platen-switch imgsz=640 source=/usr/src/datasets/platen-switch/images/train
```

#### 训练中的模型（12MB）

```
Ultralytics YOLOv8.0.92 🚀 Python-3.10.7 torch-2.0.0+cpu CPU
Loading wjj/platen-switch/train/weights/best.onnx for ONNX Runtime inference...

image 1/304 /usr/src/datasets/platen-switch/images/train/1.jpg: 640x640 22 closes, 14 opens, 178.1ms
image 2/304 /usr/src/datasets/platen-switch/images/train/2.jpg: 640x640 12 closes, 24 opens, 66.5ms
image 3/304 /usr/src/datasets/platen-switch/images/train/3.jpg: 640x640 12 closes, 33 opens, 75.7ms

Speed: 4.1ms preprocess, 62.5ms inference, 4.1ms postprocess per image at shape (1, 3, 640, 640)
```

#### 训练后的模型（12MB）

```
image 1/304 /usr/src/datasets/platen-switch/images/train/1.jpg: 640x640 22 closes, 14 opens, 72.8ms
image 2/304 /usr/src/datasets/platen-switch/images/train/2.jpg: 640x640 12 closes, 24 opens, 69.6ms
image 3/304 /usr/src/datasets/platen-switch/images/train/3.jpg: 640x640 12 closes, 33 opens, 66.0ms

Speed: 3.2ms preprocess, 53.0ms inference, 2.0ms postprocess per image at shape (1, 3, 640, 640)
```

### 模型推理速度对比（pt > ONNX 31% 🚀）

| 训练 | 模型 | 预处理速度 | 推理速度 | 后处理速度 | 总速度 |
| --- | --- | --- | --- | --- | --- |
| 训练中 | best.pt | 3.7ms | 45.0ms | 1.3ms | 50.0ms |
| 训练中 | best.onnx | 4.1ms | 62.5ms | 4.1ms | 70.7ms |
| 训练后 | best.pt | 2.9ms | 35.9ms | 1.2ms | 40.0ms |
| 训练后 | best.onnx | 3.2ms | 53.0ms | 2.0ms | 58.2ms |

🚀🚀🚀 训练后 best.pt 比 best.onnx 快 31% 左右。


## GPU
### 服务器信息
#### lscpu
```
Architecture:                    x86_64
CPU op-mode(s):                  32-bit, 64-bit
Byte Order:                      Little Endian
Address sizes:                   46 bits physical, 48 bits virtual
CPU(s):                          64
On-line CPU(s) list:             0-63
Thread(s) per core:              2
Core(s) per socket:              16
Socket(s):                       2
NUMA node(s):                    2
Vendor ID:                       GenuineIntel
CPU family:                      6
Model:                           85
Model name:                      Intel(R) Xeon(R) Silver 4216 CPU @ 2.10GHz
Stepping:                        7
CPU MHz:                         800.403
CPU max MHz:                     3200.0000
CPU min MHz:                     800.0000
BogoMIPS:                        4200.00
Virtualization:                  VT-x
L1d cache:                       1 MiB
L1i cache:                       1 MiB
L2 cache:                        32 MiB
L3 cache:                        44 MiB
NUMA node0 CPU(s):               0-15,32-47
NUMA node1 CPU(s):               16-31,48-63
Vulnerability Itlb multihit:     KVM: Mitigation: Split huge pages
Vulnerability L1tf:              Not affected
Vulnerability Mds:               Not affected
Vulnerability Meltdown:          Not affected
Vulnerability Mmio stale data:   Mitigation; Clear CPU buffers; SMT vulnerable
Vulnerability Retbleed:          Mitigation; Enhanced IBRS
Vulnerability Spec store bypass: Mitigation; Speculative Store Bypass disabled via prctl and seccomp
Vulnerability Spectre v1:        Mitigation; usercopy/swapgs barriers and __user pointer sanitization
Vulnerability Spectre v2:        Mitigation; Enhanced IBRS, IBPB conditional, RSB filling, PBRSB-eIBRS SW sequence
Vulnerability Srbds:             Not affected
Vulnerability Tsx async abort:   Mitigation; TSX disabled
Flags:                           fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb rdtscp lm constant_tsc art arch_perfmon pebs bts rep_good
                                  nopl xtopology nonstop_tsc cpuid aperfmperf pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2 ssse3 sdbg fma cx16 xtpr pdcm pcid dca sse4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsa
                                 ve avx f16c rdrand lahf_lm abm 3dnowprefetch cpuid_fault epb cat_l3 cdp_l3 invpcid_single intel_ppin ssbd mba ibrs ibpb stibp ibrs_enhanced tpr_shadow vnmi flexpriority ept vpid ept_ad fsgsbase ts
                                 c_adjust bmi1 avx2 smep bmi2 erms invpcid cqm mpx rdt_a avx512f avx512dq rdseed adx smap clflushopt clwb intel_pt avx512cd avx512bw avx512vl xsaveopt xsavec xgetbv1 xsaves cqm_llc cqm_occup_llc cq
                                 m_mbm_total cqm_mbm_local dtherm ida arat pln pts hwp hwp_act_window hwp_epp hwp_pkg_req pku ospke avx512_vnni md_clear flush_l1d arch_capabilities
```

#### nvidia-smi
```
+-----------------------------------------------------------------------------+
| NVIDIA-SMI 460.32.03    Driver Version: 460.32.03    CUDA Version: 11.2     |
|-------------------------------+----------------------+----------------------+
| GPU  Name        Persistence-M| Bus-Id        Disp.A | Volatile Uncorr. ECC |
| Fan  Temp  Perf  Pwr:Usage/Cap|         Memory-Usage | GPU-Util  Compute M. |
|                               |                      |               MIG M. |
|===============================+======================+======================|
|   0  Tesla T4            Off  | 00000000:43:00.0 Off |                    0 |
| N/A   31C    P8     9W /  70W |      3MiB / 15109MiB |      0%      Default |
|                               |                      |                  N/A |
+-------------------------------+----------------------+----------------------+
|   1  Tesla T4            Off  | 00000000:47:00.0 Off |                    0 |
| N/A   32C    P8     9W /  70W |      3MiB / 15109MiB |      0%      Default |
|                               |                      |                  N/A |
+-------------------------------+----------------------+----------------------+
|   2  Tesla T4            Off  | 00000000:8E:00.0 Off |                    0 |
| N/A   51C    P0    27W /  70W |   7900MiB / 15109MiB |      0%      Default |
|                               |                      |                  N/A |
+-------------------------------+----------------------+----------------------+
|   3  Tesla T4            Off  | 00000000:92:00.0 Off |                    0 |
| N/A   49C    P0    27W /  70W |   6628MiB / 15109MiB |      0%      Default |
|                               |                      |                  N/A |
+-------------------------------+----------------------+----------------------+
```

### 模型推理（pt 格式）
```bash
yolo predict task=detect model=best.pt project=platen-switch imgsz=640 source=/usr/src/datasets/platen-switch/images/train
```

#### 训练中的模型（24MB）

```
Ultralytics YOLOv8.0.100 🚀 Python-3.10.9 torch-2.0.0 CUDA:0 (Tesla T4, 15110MiB)
Model summary (fused): 168 layers, 3006038 parameters, 0 gradients, 8.1 GFLOPs

image 1/304 /usr/src/datasets/platen-switch/images/train/1.jpg: 480x640 22 closes, 14 opens, 45.7ms
image 2/304 /usr/src/datasets/platen-switch/images/train/2.jpg: 384x640 12 closes, 24 opens, 46.5ms
image 3/304 /usr/src/datasets/platen-switch/images/train/3.jpg: 576x640 12 closes, 33 opens, 44.9ms

Speed: 2.5ms preprocess, 7.3ms inference, 1.3ms postprocess per image at shape (1, 3, 640, 640)
```

#### 训练后的模型（6MB）

```
image 1/304 /usr/src/datasets/platen-switch/images/train/1.jpg: 480x640 22 closes, 14 opens, 48.7ms
image 2/304 /usr/src/datasets/platen-switch/images/train/2.jpg: 384x640 12 closes, 24 opens, 46.6ms
image 3/304 /usr/src/datasets/platen-switch/images/train/3.jpg: 576x640 12 closes, 33 opens, 45.4ms

Speed: 2.5ms preprocess, 7.3ms inference, 1.3ms postprocess per image at shape (1, 3, 640, 640)
```

### 模型推理（ONNX 格式）
```bash
yolo predict task=detect model=best.onnx project=platen-switch imgsz=640 source=/usr/src/datasets/platen-switch/images/train
```

#### 训练中的模型（12MB）

```
Ultralytics YOLOv8.0.100 🚀 Python-3.10.9 torch-2.0.0 CUDA:0 (Tesla T4, 15110MiB)
Loading platen-switch/train-cpu/best.onnx for ONNX Runtime inference...

image 1/304 /usr/src/datasets/platen-switch/images/train/1.jpg: 640x640 22 closes, 14 opens, 7.5ms
image 2/304 /usr/src/datasets/platen-switch/images/train/2.jpg: 640x640 12 closes, 24 opens, 9.0ms
image 3/304 /usr/src/datasets/platen-switch/images/train/3.jpg: 640x640 12 closes, 33 opens, 7.2ms

Speed: 2.8ms preprocess, 13.5ms inference, 1.4ms postprocess per image at shape (1, 3, 640, 640)
```

#### 训练后的模型（12MB）

```
image 1/304 /usr/src/datasets/platen-switch/images/train/1.jpg: 640x640 22 closes, 14 opens, 7.8ms
image 2/304 /usr/src/datasets/platen-switch/images/train/2.jpg: 640x640 12 closes, 24 opens, 10.9ms
image 3/304 /usr/src/datasets/platen-switch/images/train/3.jpg: 640x640 12 closes, 33 opens, 7.2ms

Speed: 2.8ms preprocess, 13.8ms inference, 1.5ms postprocess per image at shape (1, 3, 640, 640)
```

### 模型推理速度对比（pt > ONNX 38% 🚀）

| 训练 | 模型 | 预处理速度 | 推理速度 | 后处理速度 | 总速度 |
| --- | --- | --- | --- | --- | --- |
| 训练中 | best.pt | 2.5ms | 7.3ms | 1.3ms | 11.1ms |
| 训练中 | best.onnx | 2.8ms | 13.5ms | 1.4ms | 17.7ms |
| 训练后 | best.pt | 2.5ms | 7.3ms | 1.3ms | 11.1ms |
| 训练后 | best.onnx | 2.8ms | 13.8ms | 1.5ms | 18.1ms |

🚀🚀🚀 best.pt 比 best.onnx 快 38% 左右。

🚀🚀🚀 GPU 比 CPU 快 4 倍左右。（best.pt）


## 知识扩展
### PyTorch 训练过程中生成的best.pt文件24M，训练完成后为6M，这是怎么回事？
这可能是因为在训练过程中，PyTorch 会生成一些临时文件，如优化器状态、梯度等信息，这些文件会随着训练进程更新。而在训练完成后，PyTorch 会根据模型的参数和结构生成一个最终的模型文件（如best.pt），该文件只包含模型的参数和结构，不包含临时文件和训练过程中的其他信息，因此文件大小会比训练过程中的文件小很多。

### pt转成onnx，模型增长了1倍（12M），而且推理速度还慢了，这正常？
在将 PyTorch 模型转换为 ONNX 格式时，可能会发生模型大小增加和推理速度变慢的情况。这可能是由于以下原因：

1. ONNX 格式需要保存更多的模型信息，以便在不同的框架和平台上进行转换和运行。因此，转换后的 ONNX 模型通常会比原始 PyTorch 模型大一些。

2. ONNX 运行时的实现可能与 PyTorch 有所不同，这可能会导致推理效率的差异。例如，ONNX 运行时可能使用不同的算法或优化技术，这可能会影响模型的性能。

如果您的 ONNX 模型的大小和推理速度都比原始 PyTorch 模型差很多，可以尝试调整模型转换的参数或使用其他的转换工具。此外，您还可以尝试优化 ONNX 模型的运行时性能，如使用 ONNX Runtime 或使用 ONNX 的优化工具集（如ONNX Model Optimizer）对模型进行优化。

另外，还需要注意的是，模型的大小和推理速度并不是唯一的模型性能指标。在选择模型时，还需要考虑诸如准确率、泛化能力、训练时间等因素。因此，如果您的 ONNX 模型在这些方面表现良好，则可能不必担心模型大小和推理速度的差异。


## 参考资料
* [uvicorn-gunicorn-docker](https://github.com/tiangolo/uvicorn-gunicorn-docker)
* [uvicorn-gunicorn-docker/docker-images/start.sh](https://github.com/tiangolo/uvicorn-gunicorn-docker/blob/master/docker-images/start.sh)
* [uvicorn-gunicorn-docker/docker-images/gunicorn_conf.py](https://github.com/tiangolo/uvicorn-gunicorn-docker/blob/master/docker-images/gunicorn_conf.py)
* [How do I pass environment variables to Docker containers?](https://stackoverflow.com/questions/30494050/how-do-i-pass-environment-variables-to-docker-containers)
