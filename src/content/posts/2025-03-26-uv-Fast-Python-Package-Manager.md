---
layout: single
title:  "UV: An extremely fast Python package and project manager, written in Rust."
date:   2025-03-26 10:00:00 +0800
categories: uv Python
tags: [uv, Python, Package]
---

## 安装

```shell
# On macOS and Linux.
curl -LsSf https://astral.sh/uv/install.sh | sh
# On Windows.
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
```

### 更新

```shell
uv self update
```


## 依赖包

### 安装

```shell
uv add "mcp[cli]"
```

### 移除

```shell
uv remove "mcp[cli]"
```


## Python 项目

### 创建

```shell
uv init echo
cd echo
```

创建的文件：

```shell
.
├── .python-version
├── README.md
├── main.py
└── pyproject.toml
```

### 运行

```shell
uv run main.py
```
```
Hello from echo!
```


## 参考资料
- [UV](https://docs.astral.sh/uv/)
