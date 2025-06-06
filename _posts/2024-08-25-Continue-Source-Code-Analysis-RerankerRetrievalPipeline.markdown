---
layout: single
title:  "Continue 源码分析 - RerankerRetrievalPipeline"
date:   2024-08-25 08:00:00 +0800
categories: Continue AICodingAssistant
tags: [Continue, FTS, SQLite, BM25, LanceDB, GitHubCopilot]
---

![](/images/2024/Continue/sql-diagram.png)


## RerankerRetrievalPipeline

源代码：core/context/retrieval/pipelines/RerankerRetrievalPipeline.ts

```typescript
export default class RerankerRetrievalPipeline extends BaseRetrievalPipeline {
  private async _retrieveInitial(): Promise<Chunk[]> {
    const { input, nRetrieve } = this.options;

    const retrievalResults: Chunk[] = [];

    const ftsChunks = await this.retrieveFts(input, nRetrieve);
    const embeddingsChunks = await this.retrieveEmbeddings(input, nRetrieve);
    const recentlyEditedFilesChunks =
      await this.retrieveAndChunkRecentlyEditedFiles(nRetrieve);

    retrievalResults.push(
      ...recentlyEditedFilesChunks,
      ...ftsChunks,
      ...embeddingsChunks,
    );

    const deduplicatedRetrievalResults: Chunk[] =
      deduplicateChunks(retrievalResults);

    return deduplicatedRetrievalResults;
  }
}
```
- recentlyEditedFilesChunks: 最近编辑的文件
- ftsChunks: 全文检索
- embeddingsChunks: 向量检索


## 全文检索（FTS，Full-Text Search）数据库表设计

- 源代码：core/indexing/FullTextSearch.ts
- SQLite 存储位置：~/.continue/index/index.sqlite

### 创建
```sql
CREATE VIRTUAL TABLE IF NOT EXISTS fts USING fts5(
    path,
    content,
    tokenize = 'trigram'
)

CREATE TABLE IF NOT EXISTS fts_metadata (
    id INTEGER PRIMARY KEY,
    path TEXT NOT NULL,
    cacheKey TEXT NOT NULL,
    chunkId INTEGER NOT NULL,
    FOREIGN KEY (chunkId) REFERENCES chunks (id),
    FOREIGN KEY (id) REFERENCES fts (rowid)
)
```

### 更新
```sql
SELECT * FROM chunks WHERE path = ? AND cacheKey = ?

INSERT INTO fts (path, content) VALUES (?, ?)
INSERT INTO fts_metadata (id, path, cacheKey, chunkId) 
    VALUES (?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
    path = excluded.path,
    cacheKey = excluded.cacheKey,
    chunkId = excluded.chunkId
```
- ON CONFLICT(id) DO UPDATE SET
    - 指定冲突处理策略。当插入时遇到 id 列的冲突（即 id 已经存在），执行更新操作而不是插入操作。
- path = excluded.path, cacheKey = excluded.cacheKey, chunkId = excluded.chunkId
    - excluded 是一个特殊的表别名，表示插入操作中冲突的行。
    - 将现有记录的 path, cacheKey, chunkId 列更新为新插入值（即 excluded.path, excluded.cacheKey, excluded.chunkId）。

### 检索
```sql
SELECT fts_metadata.chunkId, fts_metadata.path, fts.content, rank
    FROM fts
    JOIN fts_metadata ON fts.rowid = fts_metadata.id
    JOIN chunk_tags ON fts_metadata.chunkId = chunk_tags.chunkId
    WHERE fts MATCH '"user input"' AND chunk_tags.tag IN (?)
    ORDER BY rank
    LIMIT ?
```

## 向量检索

- LanceDB 存储位置：~/.continue/index/lancedb

### 创建
```sql
CREATE TABLE IF NOT EXISTS lance_db_cache (
    uuid TEXT PRIMARY KEY,
    cacheKey TEXT NOT NULL,
    path TEXT NOT NULL,
    artifact_id TEXT NOT NULL,
    vector TEXT NOT NULL,
    startLine INTEGER NOT NULL,
    endLine INTEGER NOT NULL,
    contents TEXT NOT NULL
)
```

### 增加
```sql
INSERT INTO lance_db_cache (uuid, cacheKey, path, artifact_id, vector, startLine, endLine, contents) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
```

### 检索
```sql
SELECT * FROM lance_db_cache WHERE uuid in (?)
```


## 全文检索源代码

在聊天窗口中输入：
> `@Codebase` 用户提问

### 全文检索

| 文件 | 类 | 函数 | 事件 |
| --- | --- | --- | --- |
| extensions/vscode/src/webviewProtocol.ts | VsCodeWebviewProtocol | set webview |  |
| extensions/vscode/src/extension/VsCodeMessenger.ts | VsCodeMessenger | constructor | WEBVIEW_TO_CORE_PASS_THROUGH |
| core/core.ts | Core | constructor | context/getContextItems |
| core/context/retrieval/retrieval.ts |  | retrieveContextItemsFromEmbeddings |  |
| core/context/retrieval/pipelines/RerankerRetrievalPipeline.ts | RerankerRetrievalPipeline | _retrieveInitial |  |
| core/context/retrieval/fullTextSearch.ts |  | retrieveFts |  |
| core/indexing/FullTextSearch.ts | FullTextSearchCodebaseIndex | retrieve |  |

### 向量检索

| 文件 | 类 | 函数 |
| --- | --- | --- |
| core/context/retrieval/pipelines/RerankerRetrievalPipeline.ts | RerankerRetrievalPipeline | _retrieveInitial |
| core/context/retrieval/pipelines/BaseRetrievalPipeline.ts | BaseRetrievalPipeline | retrieveEmbeddings |
| core/indexing/LanceDbIndex.ts | LanceDbIndex | retrieve |
