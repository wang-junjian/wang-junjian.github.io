---
layout: post
title:  "Continue 源码分析 - SQLite 数据库设计"
date:   2024-08-24 08:00:00 +0800
categories: Continue AICodingAssistant
tags: [Continue, SQLite, BM25, GitHubCopilot]
---

## SQLite 数据库设计
```sql
CREATE TABLE tag_catalog (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    dir STRING NOT NULL,
    branch STRING NOT NULL,
    artifactId STRING NOT NULL,
    path STRING NOT NULL,
    cacheKey STRING NOT NULL,
    lastUpdated INTEGER NOT NULL
)

CREATE TABLE sqlite_sequence(name,seq)

CREATE TABLE global_cache (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cacheKey STRING NOT NULL,
    dir STRING NOT NULL,
    branch STRING NOT NULL,
    artifactId STRING NOT NULL
)

CREATE TABLE chunks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cacheKey TEXT NOT NULL,
    path TEXT NOT NULL,
    idx INTEGER NOT NULL,
    startLine INTEGER NOT NULL,
    endLine INTEGER NOT NULL,
    content TEXT NOT NULL
)

CREATE TABLE chunk_tags (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tag TEXT NOT NULL,
    chunkId INTEGER NOT NULL,
    FOREIGN KEY (chunkId) REFERENCES chunks (id)
)

CREATE TABLE code_snippets (
    id INTEGER PRIMARY KEY,
    path TEXT NOT NULL,
    cacheKey TEXT NOT NULL,
    content TEXT NOT NULL,
    title TEXT NOT NULL,
    startLine INTEGER NOT NULL,
    endLine INTEGER NOT NULL
)

CREATE TABLE code_snippets_tags (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tag TEXT NOT NULL,
    snippetId INTEGER NOT NULL,
    FOREIGN KEY (snippetId) REFERENCES code_snippets (id)
)

CREATE TABLE lance_db_cache (
    uuid TEXT PRIMARY KEY,
    cacheKey TEXT NOT NULL,
    path TEXT NOT NULL,
    artifact_id TEXT NOT NULL,
    vector TEXT NOT NULL,
    startLine INTEGER NOT NULL,
    endLine INTEGER NOT NULL,
    contents TEXT NOT NULL
)

CREATE TABLE fts_metadata (
    id INTEGER PRIMARY KEY,
    path TEXT NOT NULL,
    cacheKey TEXT NOT NULL,
    chunkId INTEGER NOT NULL,
    FOREIGN KEY (chunkId) REFERENCES chunks (id),
    FOREIGN KEY (id) REFERENCES fts (rowid)
)

CREATE VIRTUAL TABLE fts USING fts5(
    path,
    content,
    tokenize = 'trigram'
)

CREATE TABLE 'fts_data'(id INTEGER PRIMARY KEY, block BLOB)
CREATE TABLE 'fts_idx'(segid, term, pgno, PRIMARY KEY(segid, term)) WITHOUT ROWID
CREATE TABLE 'fts_content'(id INTEGER PRIMARY KEY, c0, c1)
CREATE TABLE 'fts_docsize'(id INTEGER PRIMARY KEY, sz BLOB)
CREATE TABLE 'fts_config'(k PRIMARY KEY, v) WITHOUT ROWID

CREATE UNIQUE INDEX idx_tag_catalog_unique 
     ON tag_catalog(dir, branch, artifactId, path, cacheKey)
CREATE UNIQUE INDEX idx_global_cache_unique 
     ON global_cache(cacheKey, dir, branch, artifactId)
```

### 虚拟表 fts
```sql
CREATE VIRTUAL TABLE fts USING fts5(
    path,
    content,
    tokenize = 'trigram'
)
```
- USING fts5: 指明这个虚拟表使用 FTS5 模块，FTS5 是 SQLite 的一个扩展，用于高效的全文搜索。
- tokenize = 'trigram': 分词方式：指定使用三元组（trigram）作为分词策略。三元组分词会将文本分解为连续的三个字符的组合，这有助于提高模糊搜索的准确性和效率。

#### 三元组分词的工作原理
三元组分词会将文本分解为连续的三个字符的组合，例如：`"Hello, World!"` 会被分解为 
- `Hel`
- `ell`
- `llo`
- `lo,`
- `o, `
- `, W`
- ` Wo`
- `Wor`
- `orl`
- `rld`
- `ld!`

三元组分词的优势在于，它可以将文本中的单词分解为更小的片段，这样就可以更容易的匹配到包含拼写错误的单词，或者匹配到相似的单词。


## [QuickDBD](https://app.quickdbd.com/) 绘制数据库图表
- [QuickDBD](https://www.quickdbd.com/)
- [dbdiagram.io](https://dbdiagram.io/)

```sql
tag_catalog
---
id PK int
dir string
branch string
artifactId string
path string
cacheKey string
lastUpdated int

sqlite_sequence
---
name
seq

global_cache
---
id PK int
cacheKey string
dir string
branch string
artifactId string

chunks
---
id PK int
cacheKey text
path text
idx int
startLine int
endLine int
content text

chunk_tags
---
id PK int
tag text
chunkId int FK >- chunks.id

code_snippets
---
id PK int
path text
cacheKey text
content text
title text
startLine int
endLine int

code_snippets_tags
---
id PK int
tag text
snippetId int FK >- code_snippets.id

lance_db_cache
---
uuid PK text
cacheKey text
path text
artifact_id text
vector text
startLine int
endLine int
content text

fts
---
rowid PK int
path text
content text

fts_metadata
---
id int FK >- fts.rowid
path text
cacheKey text
chunkId FK >- chunks.id
```

![](/images/2024/Continue/sql-diagram.png)


## 查询
### 全文搜索（FTS，Full-Text Search）
```sql
SELECT fts_metadata.chunkId, fts_metadata.path, fts.content, rank
    FROM fts
    JOIN fts_metadata ON fts.rowid = fts_metadata.id
    JOIN chunk_tags ON fts_metadata.chunkId = chunk_tags.chunkId
    WHERE fts MATCH '"Element"' AND chunk_tags.tag IN ('/continuedev/continue-0.9.191-vscode/extensions/vscode::NONE::chunks')
    ORDER BY rank
    LIMIT 2
```
- fts MATCH '"Element"': 使用 MATCH 子句进行全文搜索，查找包含单词 "Element" 的记录。
- ORDER BY rank: 根据 rank 列对结果进行排序，通常用于根据相关性排序搜索结果。

| chunkId | path | content | rank |
| --- | --- | --- | --- |
| 21 | /continuedev/continue-0.9.191-vscode/extensions/vscode/wjj/ast.py | class Element(object):... | -5.55171868921467 |
| 22 | /continuedev/continue-0.9.191-vscode/extensions/vscode/wjj/ast.py | class Statement(Element):... | -5.18734716780418 |
| 23 | /continuedev/continue-0.9.191-vscode/extensions/vscode/wjj/ast.py | class Expression(Element): | -5.18208586231724 |
| 53 | /continuedev/continue-0.9.191-vscode/extensions/vscode/wjj/ast.py | class ChainContextPosStatement(Statement):... | -4.21839840515926 |

```sql
SELECT fts.content, rank, bm25(fts)
    FROM fts
    JOIN fts_metadata ON fts.rowid = fts_metadata.id
    JOIN chunk_tags ON fts_metadata.chunkId = chunk_tags.chunkId
    WHERE fts MATCH '"Element"' AND chunk_tags.tag IN ('/continuedev/continue-0.9.191-vscode/extensions/vscode::NONE::chunks')
    LIMIT 2
```
BM25 算法是一种基于概率的信息检索算法，它通过计算查询词与文档之间的相关性来对搜索结果进行排序。

所有 FTS5 表都有一个特殊的隐藏列，名为“rank”。如果当前查询不是全文搜索查询（即不包含 MATCH 操作符），则“rank”列的值始终为 NULL。否则，在全文搜索查询中，rank 列默认包含与执行 bm25() 辅助函数返回的值相同的值。

从 rank 列读取和在查询中直接使用 bm25() 函数之间的区别在于仅在按返回值排序时才显著。在这种情况下，使用“rank”比使用 bm25() 更快。

| content | rank | bm25(fts) |
| --- | --- | --- |
| class Element(object):... | -5.55171868921467 | -5.55171868921467 |
| class Statement(Element):... | -5.18734716780418 | -5.18734716780418 |

- [SQLite FTS5 Extension](https://www.sqlite.org/fts5.html)
    - [The bm25() function](https://www.sqlite.org/fts5.html#the_bm25_function)
    - [Sorting by Auxiliary Function Results](https://www.sqlite.org/fts5.html#sorting_by_auxiliary_function_results)

源代码：core/indexing/FullTextSearch.ts
- retrieve
```typescript
RETRIEVAL_PARAMS.bm25Threshold = -2.5
filter: result.rank <= bm25Threshold
```
