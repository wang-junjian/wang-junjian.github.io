---
layout: single
title:  "Continue 开发环境搭建时遇到了 esbuild 缺失问题"
date:   2025-03-25 10:00:00 +0800
categories: Continue AICodingAssistant
tags: [Continue, GitHubCopilot, esbuild]
---

```shell
sh ./scripts/install-dependencies.sh
```

- [Contributing to Continue](https://github.com/continuedev/continue/blob/main/CONTRIBUTING.md)

❌ `File out/node_modules/@esbuild/darwin-arm64/bin/esbuild does not exist`

```shell
 *  正在执行任务: node /Users/junjian/GitHub/continuedev/continue/extensions/vscode/scripts/prepackage.js 

[info] Using target:  darwin-arm64
[info] Packaging extension for target  darwin-arm64
[info] npm install in extensions/vscode completed
[info] npm install in gui completed
[info] Copied gui build to JetBrains extension
Copied gui build to VSCode extension
[info] Copied onnxruntime-node
[info] Copied tree-sitter.wasm
[info] Copied llamaTokenizerWorkerPool.mjs
[info] Copied llamaTokenizer.mjs
[info] Copied tiktokenWorkerPool.mjs
[info] Copied start_ollama.sh
npm installing esbuild binary
Copying esbuild@0.17.19 to @esbuild
npm warn using --force Recommended protections disabled.
Contents of: esbuild@0.17.19 []
[info] Copying sqlite node binding from core
[info] Copied @esbuild
[info] Copied workerpool
[info] Copied @vscode/ripgrep
[info] Copied esbuild
[info] Copied @lancedb
[info] Copied esbuild, @esbuild, @lancedb, @vscode/ripgrep, workerpool
File out/node_modules/@esbuild/darwin-arm64/bin/esbuild does not exist
Parent folder out/node_modules/@esbuild/darwin-arm64/bin does not exist
Grandparent folder out/node_modules/@esbuild/darwin-arm64 does not exist
Contents of grandgrandparent folder: []
/Users/junjian/GitHub/continuedev/continue/scripts/util/index.js:92
    throw new Error(
          ^

Error: The following files were missing:
- out/node_modules/@esbuild/darwin-arm64/bin/esbuild

The following files were empty:
- 
    at validateFilesPresent (/Users/junjian/GitHub/continuedev/continue/scripts/util/index.js:92:11)
    at /Users/junjian/GitHub/continuedev/continue/extensions/vscode/scripts/prepackage.js:466:3
    at process.processTicksAndRejections (node:internal/process/task_queues:105:5)

Node.js v22.9.0

 *  终端进程“/bin/zsh '-l', '-c', 'node /Users/junjian/GitHub/continuedev/continue/extensions/vscode/scripts/prepackage.js'”已终止，退出代码: 1。 
 *  终端将被任务重用，按任意键关闭。 
```

解决方案：

```shell
rm -fr /tmp/continue-node_modules-esbuild0.17.19
```

- [Issue with installing esbuild in prepackage script #3461](https://github.com/continuedev/continue/issues/3461)

这个问题困扰了半个晚上，开始一直在用 `LLM` 解决问题，`GitHub Copilot`、`通义千问`、`豆包`、`DeepSeek`、`Kimi`、`Gemini`都试过了，用的时候都带上了`深度思考`和`联网搜索`，但是都没有解决问题，最后想到去看 `issue`，果然有人遇到了同样的问题，解决方案是删除缓存目录，然后再次运行脚本，问题就解决了。
