---
type: article
title:  "UV: An extremely fast Python package and project manager, written in Rust."
date:   2025-03-26 10:00:00 +0800
tags: [uv, Python, Package]
---

## 安装

### On macOS and Linux

```shell
curl -LsSf https://astral.sh/uv/install.sh | sh
```

### On Windows

```shell
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
```

### 更新

```shell
uv self update
```


## 一键同步环境

**创建/同步完整的开发环境**

```shell
uv sync
```

执行该命令后，主要做了以下事：

1. 读取项目配置 `pyproject.toml`
2. 创建/激活虚拟环境 `.venv`
3. 安装所有依赖（含开发依赖）
4. 以可编辑模式（-e / editable）安装当前项目
5. 生成/锁定依赖版本 `uv.lock`


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
