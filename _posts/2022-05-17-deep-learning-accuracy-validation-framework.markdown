---
layout: post
title:  "Deep Learning Accuracy Validation Framework"
date:   2022-05-17 08:00:00 +0800
categories:  AI OpenVINO
tags: [accuracy_check, tar]
---

## 深度学习准确性验证框架

## [例子](https://docs.openvino.ai/latest/omz_tools_accuracy_checker_sample.html)
### 进入 accuracy_checker 目录
```shell
cd open_model_zoo/tools/accuracy_checker
```

### 下载数据集
```shell
wget https://www.cs.toronto.edu/~kriz/cifar-10-python.tar.gz
tar xvf cifar-10-python.tar.gz -C sample
```

### 配置文件结构
```yml
models:
  - name: model_name

    launchers:
      - framework: openvino
        adapter: adapter_name

    datasets:
      - name: dataset_name
```

### 评估
```shell
accuracy_check -c sample/sample_config.yml -m data/test_models/ -s sample/
```
```
2022-05-18 11:18:38.663810: I tensorflow/stream_executor/platform/default/dso_loader.cc:53] Successfully opened dynamic library libcudart.so.11.0
Processing info:
model: SampLeNet_example
launcher: openvino
device: CPU
dataset: sample_dataset
OpenCV version: 4.5.1
Annotation conversion for sample_dataset dataset has been started
Parameters to be used for conversion:
converter: cifar
data_batch_file: sample/cifar-10-batches-py/test_batch
convert_images: True
converted_images_dir: sample/sample_dataset/test
num_classes: 10
Annotation conversion for sample_dataset dataset has been finished

IE version: 2022.1.0-7019-cdb9bec7210-releases/2022/1
Loaded CPU plugin version:
    CPU - openvino_intel_cpu_plugin: 2022.1.2022.1.0-7019-cdb9bec7210-releases/2022/1
Found model data/test_models/SampLeNet.xml
Found weights data/test_models/SampLeNet.bin
Input info:
	Node name: data
	Tensor names: data
	precision: f32
	shape: (1, 3, 32, 32)

Output info
	Node name: fc3/sink_port_0
	Tensor names: fc3
	precision: f32
	shape: (1, 10)

10000 objects processed in 12.915 seconds
accuracy: 75.02%
```

## [Accuracy Checker 的自定义评估器](https://docs.openvino.ai/latest/omz_tools_accuracy_checker_custom_evaluators.html)
### Standard Accuracy Checker validation pipeline: 
  1. Annotation Reading
  2. Data Reading
  3. Preprocessing
  4. Inference
  5. Postprocessing
  6. Metrics


## [Metrics](https://docs.openvino.ai/latest/omz_tools_accuracy_checker_metrics.html)
增加参数 ```--profile True``` 可以进行指标分析
```shell
accuracy_check -c sample/sample_config.yml -m data/test_models/ -s sample/ --profile True
```

可以看到在目录下使用当前时间生成新目录。
```
$ head -n 4 2022-05-18_11-17-20/SampLeNet_example_openvino_CPU__sample_dataset_classification.csv 
identifier,annotation_label,prediction_label,accuracy_result
domestic_cat_s_000907.png,3,[3],1.0
hydrofoil_s_000078.png,8,[8],1.0
sea_boat_s_001456.png,8,[8],1.0
```


## FAQ
### 问题
```shell
2022-05-17 08:46:59.637346: I tensorflow/stream_executor/platform/default/dso_loader.cc:53] Successfully opened dynamic library libcudart.so.11.0
Traceback (most recent call last):
  File "/home/wjj/.local/bin/accuracy_check", line 5, in <module>
    from openvino.tools.accuracy_checker.main import main
  File "/home/wjj/.local/lib/python3.8/site-packages/openvino/tools/accuracy_checker/main.py", line 26, in <module>
    from .evaluators import ModelEvaluator, ModuleEvaluator
  File "/home/wjj/.local/lib/python3.8/site-packages/openvino/tools/accuracy_checker/evaluators/__init__.py", line 17, in <module>
    from .model_evaluator import ModelEvaluator
  File "/home/wjj/.local/lib/python3.8/site-packages/openvino/tools/accuracy_checker/evaluators/model_evaluator.py", line 24, in <module>
    from ..dataset import Dataset
  File "/home/wjj/.local/lib/python3.8/site-packages/openvino/tools/accuracy_checker/dataset.py", line 25, in <module>
    from .annotation_converters import (
  File "/home/wjj/.local/lib/python3.8/site-packages/openvino/tools/accuracy_checker/annotation_converters/__init__.py", line 60, in <module>
    from .squad import SQUADConverter
  File "/home/wjj/.local/lib/python3.8/site-packages/openvino/tools/accuracy_checker/annotation_converters/squad.py", line 24, in <module>
    from ._nlp_common import SquadWordPieseTokenizer, _is_whitespace
  File "/home/wjj/.local/lib/python3.8/site-packages/openvino/tools/accuracy_checker/annotation_converters/_nlp_common.py", line 30, in <module>
    from transformers import AutoTokenizer
  File "/home/wjj/.local/lib/python3.8/site-packages/transformers/__init__.py", line 30, in <module>
    from . import dependency_versions_check
  File "/home/wjj/.local/lib/python3.8/site-packages/transformers/dependency_versions_check.py", line 36, in <module>
    from .file_utils import is_tokenizers_available
  File "/home/wjj/.local/lib/python3.8/site-packages/transformers/file_utils.py", line 51, in <module>
    from huggingface_hub import HfFolder, Repository, create_repo, list_repo_files, whoami
  File "/home/wjj/.local/lib/python3.8/site-packages/huggingface_hub/__init__.py", line 63, in <module>
    from .keras_mixin import (
  File "/home/wjj/.local/lib/python3.8/site-packages/huggingface_hub/keras_mixin.py", line 24, in <module>
    import tensorflow as tf
  File "/home/wjj/.local/lib/python3.8/site-packages/tensorflow/__init__.py", line 444, in <module>
    _ll.load_library(_main_dir)
  File "/home/wjj/.local/lib/python3.8/site-packages/tensorflow/python/framework/load_library.py", line 154, in load_library
    py_tf.TF_LoadLibrary(lib)
tensorflow.python.framework.errors_impl.NotFoundError: /usr/local/lib/python3.8/dist-packages/tensorflow/core/kernels/libtfkernel_sobol_op.so.1: undefined symbol: _ZN10tensorflow6thread10ThreadPool26TransformRangeConcurrentlyExxRKSt8functionIFvxxEE
```

### 解决
```shell
cd /usr/local/lib/python3.8/dist-packages/tensorflow/core/kernels/
sudo mv  libtfkernel_sobol_op.so libtfkernel_sobol_op_so
```

## 参考资料
* [Sample](https://docs.openvino.ai/latest/omz_tools_accuracy_checker_sample.html)
* [Deep Learning accuracy validation framework](https://docs.openvino.ai/latest/omz_tools_accuracy_checker_sample.html)
* [Deep Learning accuracy validation framework - GitHub](https://github.com/openvinotoolkit/open_model_zoo/blob/master/tools/accuracy_checker/README.md)
* [How to use predefined configuration files](https://docs.openvino.ai/latest/omz_tools_accuracy_checker_configs.html)
* [Dataset Preparation Guide](https://docs.openvino.ai/latest/omz_data_datasets.html)
