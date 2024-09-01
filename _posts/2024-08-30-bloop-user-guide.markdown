---
layout: post
title:  "Bloop 使用指南"
date:   2024-08-30 08:00:00 +0800
categories: Bloop AICodingAssistant
tags: [Bloop, GitHubCopilot]
---

## bloop
bloop 是用 Rust 编写的快速代码搜索引擎

- [bloop GitHub](https://github.com/BloopAI/bloop)

### 克隆代码
```shell
git clone https://github.com/BloopAI/bloop
cd bloop
```


## [Bloop Server](https://github.com/BloopAI/bloop/blob/oss/server/README.md)
### 指定依赖库版本
```shell
cargo update -p qdrant-client --precise 1.5.0
cargo update -p reqwest --precise 0.11.20
```

### 编译
```shell
cargo build -p bleep --release
```

### 部署 Qdrant 服务
```shell
docker run -p 6333:6333 -p 6334:6334 \
    -v $(pwd)/qdrant_storage_1_5_0:/qdrant/storage:z \
    qdrant/qdrant:v1.5.0
```

### 运行
```shell
mkdir codes
RUST_BACKTRACE=1 cargo run -p bleep --release -- --source-dir /Users/junjian/GitHub/BloopAI/bloop/codes
```


## [Bloop App](https://github.com/BloopAI/bloop/blob/oss/apps/desktop/README.md)
### 安装依赖
- ONNX Runtime
```shell
brew install onnxruntime
brew install tauri
brew install vips
```

```shell
cp /opt/homebrew/lib/libonnxruntime.dylib \
    ./apps/desktop/src-tauri/frameworks/libonnxruntime.dylib
```

### 确保下载并安装依赖项
```shell
git lfs install
git lfs pull

npm install
```

### 编译
```shell
npm run build-app
```

### 在开发模式下运行
```shell
npm run start-app
```


## 使用

### 主界面
![](/images/2024/Bloop/home.png)

### 操作
![](/images/2024/Bloop/actions.png)

### 添加代码仓库
![](/images/2024/Bloop/add-new-repository.png)

### 代码聊天
![](/images/2024/Bloop/conversation.png)


## 参考
- [bloop](https://bloop.ai)
- [Modernising Legacy Code with AI](https://bloop.ai/blog/modernising-legacy-code)
- [Building an AI Agent (To Modernise COBOL)](https://bloop.ai/blog/building-an-ai-agent)
- [Cargo 手册 中文版](https://rustwiki.org/zh-CN/cargo/)
- [qdrant-client](https://github.com/qdrant/qdrant-client)
