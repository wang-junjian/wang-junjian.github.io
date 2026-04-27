---
layout: single
title:  "打包 Python 工程到 PyPI：构建 LLM 压测工具 evalscope-perf"
date:   2024-10-16 10:00:00 +0800
categories: [操作系统, AI 与大模型]
tags: [Python, PyPI, Packaging, evalscope-perf]
---

![](/images/2024/Python_packages_to_Py_PI.avif)

## 创建 Python 工程 [evalscope-perf](https://github.com/wang-junjian/evalscope-perf)

### 工程的目录结构
```shell
evalscope-perf/
├── evalscope_perf/
│   ├── __init__.py
│   └── main.py
├── README.md
├── LICENSE
├── pyproject.toml
└── setup.py
```

### evalscope_perf/__init__.py
没有可以不写。

### evalscope_perf/main.py
```python
import subprocess
import re
import typer
import matplotlib.pyplot as plt

from typing import List
from typing_extensions import Annotated


app = typer.Typer()

def run_evalscope(url, model, dataset_path, max_prompt_length, stop, read_timeout, parallel, n):
    cmd = [
        'evalscope', 'perf',
        '--api', 'openai',
        '--url', url,
        '--model', model,
        '--dataset', 'openqa',
        '--dataset-path', dataset_path,
        '--max-prompt-length', str(max_prompt_length),
        '--stop', stop,
        '--read-timeout', str(read_timeout),
        '--parallel', str(parallel),
        '-n', str(n)
    ]
    result = subprocess.run(cmd, stdout=subprocess.PIPE, text=True)

    # 将输出保存到文件
    dataset_name = dataset_path.split('/')[-1].split('.')[0]
    output_filename = f'{model}_{dataset_name}_p{parallel}.txt'
    with open(output_filename, 'w') as f:
        f.write(result.stdout)

    return result.stdout

def parse_output(output):
    print(output)
    metrics = {}
    patterns = {
        'Average QPS': r'Average QPS:\s+([\d.]+)',
        'Average latency': r'Average latency:\s+([\d.]+)',
        'Throughput': r'Throughput\(average output tokens per second\):\s+([\d.]+)'
    }
    for key, pattern in patterns.items():
        match = re.search(pattern, output)
        if match:
            metrics[key] = float(match.group(1))
    print('📌 Metrics:', metrics)
    return metrics

@app.command()
def main(
    url: str = typer.Argument(..., help="OpenAI URL"),
    model: str = typer.Argument(..., help="模型名称"),
    dataset_path: str = typer.Argument(..., help="数据集路径"),
    max_prompt_length: int = typer.Option(256, help="最大提示长度"),
    stop: str = typer.Option("<|im_end|>", help="停止标记"),
    read_timeout: int = typer.Option(30, help="读取超时"),
    parallels: Annotated[List[int], "并行数"] = typer.Option([1], help="并行数"),
    n: int = typer.Option(1, help="请求数")
):
    data = {'Parallel': [], 'Average QPS': [], 'Average latency': [], 'Throughput': []}

    for parallel in parallels:
        print(f'Running with parallel={parallel}')
        output = run_evalscope(url, model, dataset_path, max_prompt_length, stop, read_timeout, parallel, n)
        metrics = parse_output(output)
        data['Parallel'].append(parallel)
        data['Average QPS'].append(metrics.get('Average QPS', 0))
        data['Average latency'].append(metrics.get('Average latency', 0))
        data['Throughput'].append(metrics.get('Throughput', 0))

    # 绘制子图
    fig, axs = plt.subplots(2, 2, figsize=(18, 9))

    axs[0, 0].plot(data['Parallel'], data['Average QPS'], marker='o')
    axs[0, 0].set_title('Average QPS vs Parallel Number')
    axs[0, 0].set_xlabel('Parallel Number')
    axs[0, 0].set_ylabel('Average QPS')

    axs[0, 1].plot(data['Parallel'], data['Average latency'], marker='o', color='orange')
    axs[0, 1].set_title('Average Latency vs Parallel Number')
    axs[0, 1].set_xlabel('Parallel Number')
    axs[0, 1].set_ylabel('Average Latency (s)')

    axs[1, 0].plot(data['Parallel'], data['Throughput'], marker='o', color='green')
    axs[1, 0].set_title('Throughput vs Parallel Number')
    axs[1, 0].set_xlabel('Parallel Number')
    axs[1, 0].set_ylabel('Throughput (token/s)')

    fig.delaxes(axs[1, 1])  # Remove the empty subplot

    plt.tight_layout()
    plt.savefig('performance_metrics.png')

if __name__ == "__main__":
    app()
```

### README.md
```markdown
evalscope-perf: Model inference performance stress test
```

### pyproject.toml
```toml
[build-system]
requires = ["setuptools>=42", "wheel"]
build-backend = "setuptools.build_meta"
```

### setup.py
```python
from setuptools import setup, find_packages

import os

# 获取当前文件所在目录
this_directory = os.path.abspath(os.path.dirname(__file__))

# 读取 README.md 内容
with open(os.path.join(this_directory, "README.md"), encoding="utf-8") as fh:
    long_description = fh.read()

setup(
    name='evalscope-perf',
    version='0.1.2',
    author = 'Junjian Wang',
    author_email = 'vwarship@163.com',
    description = '大模型性能压测可视化',
    long_description = long_description,
    long_description_content_type = 'text/markdown',
    url = 'http://www.wangjunjian.com',
    packages=find_packages(),
    install_requires=[
        # 在这里添加你的依赖包，例如：
        # 'requests',
        'typer',
        'pandas',
        'matplotlib',
        # 'evalscope',  # 太大了，不建议直接依赖
    ],
    entry_points={
        'console_scripts': [
            # 在这里添加你的命令行工具，例如：
            'evalscope-perf=evalscope_perf.main:app',
        ],
    },
    classifiers=[
        "Programming Language :: Python :: 3",
        "License :: OSI Approved :: MIT License",
        "Operating System :: OS Independent",
    ],
    python_requires='>=3.6',
)
```
**📌 这里要注意命令行 `evalscope-perf=evalscope_perf.main:app` 使用的是 `app`**

如果需要增加非 Python 代码的文件，可以在 `setup.py` 中添加 `package_data` 字段，例如：
```python
    include_package_data=True,
    package_data={
        'evalscope_perf': ['assets/*.*'],
    },
```


## 开发
### 生成源代码分发包
```shell
python setup.py sdist
```

### 安装源代码分发包
```shell
pip install -e .
```
- `-e` `--editable` 表示安装到当前目录，方便开发时修改代码后立即生效。


## 打包 Python 工程
### 同时生成源代码和二进制 wheel 分发包
```shell
python setup.py sdist bdist_wheel
```
- sdist
    - 功能：生成源代码分发包。
    - 产物：通常为 .tar.gz 或 .zip 文件，包含项目的源代码。
    - 用途：用户可以通过源代码安装包，适用于所有平台。
- bdist_wheel
    - 功能：生成二进制 whell 包。
    - 产物：.whl 文件，预编译的包，包含二进制文件（如果有的话）。
    - 用途：加快安装速度，适用于支持的特定平台和Python版本。

同时生成源代码和二进制 wheel 分发包的优点：提供更灵活的安装选项，满足不同用户的需求。


## 发布 Python 工程到 PyPI
### 安装 twine
```shell
pip install twine
```

### 注册 PyPI 账号
- [https://pypi.org/account/register/](https://pypi.org/account/register/)
- 注册后，登录到 [https://pypi.org/account/login/](https://pypi.org/account/login/)，创建一个 `API token`。

### 编辑 PyPI 配置文件 ~/.pypirc
```ini
[pypi]
  username = __token__
  password = pypi-api-token_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 上传包到 PyPI
```shell
twine upload dist/*
```
- `dist/*` 表示上传 dist 目录下的所有文件。


## 安装发布的包
```shell
pip install evalscope-perf -i https://pypi.org/simple
```


## evalscope-perf 使用示例

```bash
evalscope-perf http://127.0.0.1:8000/v1/chat/completions lnsoft-chat \
    ./datasets/open_qa.jsonl \
    --read-timeout=120 \
    --parallels 16 \
    --parallels 32 \
    --parallels 64 \
    --parallels 100 \
    --parallels 128 \
    --parallels 150 \
    --parallels 200 \
    --parallels 300 \
    --parallels 400 \
    --parallels 500 \
    --n 1000
```

### SGLang

![](/images/2025/StressTest/performance_metrics-sglang.png)


## 参考资料
- [Packaging Python Projects](https://packaging.python.org/en/latest/tutorials/packaging-projects/)
- [huggingface_hub/setup.py](https://github.com/huggingface/huggingface_hub/blob/main/setup.py)
- [Typer - Multiple CLI Options](https://typer.tiangolo.com/tutorial/multiple-values/multiple-options/)
