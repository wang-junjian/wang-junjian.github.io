---
layout: post
title:  "Continue 源码分析 - 向量数据库存储位置"
date:   2024-09-15 08:00:00 +0800
categories: Continue AICodingAssistant
tags: [Continue, LanceDB, GitHubCopilot]
---

## 向量数据库存储位置

**LanceDB 存储位置**：~/.continue/index/lancedb
  - UsersjunjianGitHubcontinuedevcontinue-0.9.191-vscodeextensionsvscodeNONEvectordb_OpenAIEmbeddingsProviderbge-base-zh-v1.5.lance
  - UsersjunjianGitHubcontinuedevcontinue-0.9.191-vscodeextensionsvscodeNONEvectordb_TransformersJsEmbeddingsProviderall-MiniLM-L6-v2.lance
  - UsersjunjianGitHubcontinuedevcontinue-0.9.191-vscodeextensionsvscodeNONEvectordb_TransformersJsEmbeddingsProviderbge-small-zh-v1.5.lance

向量数据库存储目录名字的组成部分：
- `IndexTag.directory`: /Users/junjian/GitHub/continuedev/continue-0.9.191-vscode/extensions/vscode
- `IndexTag.branch`: NONE
- `IndexTag.artifactId`: vectordb::_TransformersJsEmbeddingsProvider::bge-small-zh-v1.5

**变量**：`IDE Extensions`、`Branch`、`Embedding Provider`、`Embedding Model`

源代码：core/indexing/LanceDbIndex.ts
```typescript
export class LanceDbIndex implements CodebaseIndex {
  get artifactId(): string {
    return `vectordb::${this.embeddingsProvider.id}`;
  }

  private tableNameForTag(tag: IndexTag) {
    return tagToString(tag).replace(/[^\w-_.]/g, "");
  }

}
```

源代码：core/indexing/refreshIndex.ts
```typescript
export function tagToString(tag: IndexTag): string {
  return `${tag.directory}::${tag.branch}::${tag.artifactId}`;
}
```


## 参考资料
- [Lance Formats](https://lancedb.github.io/lance/format.html)
