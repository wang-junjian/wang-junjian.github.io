---
layout: single
title:  "vscode-extension-samples/chat-sample 源码分析"
date:   2024-12-13 10:00:00 +0800
categories: ChatExtensions GitHubCopilot
tags: [ChatExtensions, GitHubCopilot, VSCode, VSCodeExtensionSamples]
---

## 运行 Chat Sample

### 克隆仓库
```bash
git clone https://github.com/microsoft/vscode-extension-samples
```

### 安装依赖
```bash
cd vscode-extension-samples/chat-sample
npm install
```

### 调试

在 Debug View 中运行 `Run Extension`。


## Chat Sample 源码分析

### 扩展入口

文件：src/extension.ts

```typescript
export function activate(context: vscode.ExtensionContext) {
    registerSimpleParticipant(context);
    registerToolUserChatParticipant(context);
    registerChatLibChatParticipant(context);

    registerChatTools(context);
}
```

### 注册参与者

文件：src/simple.ts

```typescript
export function registerSimpleParticipant(context: vscode.ExtensionContext) {

}
```
