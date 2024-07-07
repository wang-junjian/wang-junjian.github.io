---
layout: post
title:  "FastEmbed"
date:   2024-07-06 08:00:00 +0800
categories: FastEmbed
tags: [FastEmbed, Qdrant]
---

## [FastEmbed](https://github.com/qdrant/fastembed)

FastEmbed 是一个轻量级、快速的 Python 库，专为嵌入生成而构建。

### 安装

```bash
pip install -Uqq fastembed
```

### 支持的嵌入模型

```python
import pandas as pd

from fastembed import TextEmbedding


supported_models = (
    pd.DataFrame(TextEmbedding.list_supported_models())
    .sort_values("size_in_GB")
    .drop(columns=["sources", "model_file", "additional_files"])
    .reset_index(drop=True)
)

print(supported_models)
```

|    |                                             model | dim |                                       description | size_in_GB |
|---:|--------------------------------------------------:|----:|--------------------------------------------------:|-----------:|
| 1  |                            BAAI/bge-small-en-v1.5 | 384 |                    Fast and Default English model |      0.067 |
| 2  |            sentence-transformers/all-MiniLM-L6-v2 | 384 |          Sentence Transformer model, MiniLM-L6-v2 |      0.090 |
| 3  |                            BAAI/bge-small-zh-v1.5 | 512 |                Fast and recommended Chinese model |      0.090 |
| 4  |               snowflake/snowflake-arctic-embed-xs | 384 | Based on all-MiniLM-L6-v2 model with only 22m ... |      0.090 |
| 5  |                jinaai/jina-embeddings-v2-small-en | 512 | English embedding model supporting 8192 sequen... |      0.120 |
| 6  |                                 BAAI/bge-small-en | 384 |                                Fast English model |      0.130 |
| 7  |                snowflake/snowflake-arctic-embed-s | 384 | Based on infloat/e5-small-unsupervised, does n... |      0.130 |
| 8  |                  nomic-ai/nomic-embed-text-v1.5-Q | 768 |       Quantized 8192 context length english model |      0.130 |
| 9  |                             BAAI/bge-base-en-v1.5 | 768 |                          Base English model, v1.5 |      0.210 |
| 10 | sentence-transformers/paraphrase-multilingual-... | 384 | Sentence Transformer model, paraphrase-multili... |      0.220 |
| 11 |                         Qdrant/clip-ViT-B-32-text | 512 |                                 CLIP text encoder |      0.250 |
| 12 |                 jinaai/jina-embeddings-v2-base-de | 768 | German embedding model supporting 8192 sequenc... |      0.320 |
| 13 |                                  BAAI/bge-base-en | 768 |                                Base English model |      0.420 |
| 14 |                snowflake/snowflake-arctic-embed-m | 768 | Based on intfloat/e5-base-unsupervised model, ... |      0.430 |
| 15 |                    nomic-ai/nomic-embed-text-v1.5 | 768 |                 8192 context length english model |      0.520 |
| 16 |                 jinaai/jina-embeddings-v2-base-en | 768 | English embedding model supporting 8192 sequen... |      0.520 |
| 17 |                      nomic-ai/nomic-embed-text-v1 | 768 |                 8192 context length english model |      0.520 |
| 18 |           snowflake/snowflake-arctic-embed-m-long | 768 | Based on nomic-ai/nomic-embed-text-v1-unsuperv... |      0.540 |
| 19 |                mixedbread-ai/mxbai-embed-large-v1 |1024 | MixedBread Base sentence embedding model, does... |      0.640 |
| 20 | sentence-transformers/paraphrase-multilingual-... | 768 | Sentence-transformers model for tasks like clu... |      1.000 |
| 21 |                snowflake/snowflake-arctic-embed-l |1024 | Based on intfloat/e5-large-unsupervised, large... |      1.020 |
| 22 |                            BAAI/bge-large-en-v1.5 |1024 |                         Large English model, v1.5 |      1.200 |
| 23 |                                thenlper/gte-large |1024 |               Large general text embeddings model |      1.200 |
| 24 |                    intfloat/multilingual-e5-large |1024 | Multilingual model, e5-large. Recommend using ... |      2.240 |

- [Supported Models](https://qdrant.github.io/fastembed/examples/Supported_Models/)


## FastEmbed 检索

```python
import numpy as np

from typing import List
from fastembed import TextEmbedding


documents: List[str] = [
    "玛哈拉纳·普拉塔普是来自梅瓦尔的拉其普特战士国王",
    "他与阿克巴领导的莫卧儿帝国作战",
    "1576 年的哈尔迪加蒂战役是他最著名的战役",
    "他拒绝向阿克巴屈服,继续进行游击战",
    "他的首都是奇托加尔,后来被莫卧儿人占领",
    "他于 1597 年去世,享年 57 岁",
    "玛哈拉纳·普拉塔普被认为是拉其普特反抗外国统治的象征",
    "他的遗产在拉贾斯坦邦通过节日和纪念碑来庆祝",
    "他有 11 个妻子和 17 个儿子,包括继任他成为梅瓦尔统治者的阿玛尔·辛格一世",
    "他的一生出现在各种电影、电视节目和书籍中",
]

embedding_model = TextEmbedding(model_name="BAAI/bge-small-zh-v1.5")

embeddings: List[np.ndarray] = list(
    embedding_model.passage_embed(documents)
)

def print_top_k(query_embedding, embeddings, documents, k=5):
    # 使用 numpy 计算查询和文档之间的余弦相似度
    scores = np.dot(embeddings, query_embedding)
    # 降序排列分数
    sorted_scores = np.argsort(scores)[::-1]
    # print the top 5
    for i in range(k):
        print(f"{i+1}: {documents[sorted_scores[i]]}")

query = "玛哈拉纳·普拉塔普是哪个国家的国王？"
query_embedding = list(embedding_model.query_embed(query))[0]

print_top_k(query_embedding, embeddings, documents)
```
```
1: 玛哈拉纳·普拉塔普是来自梅瓦尔的拉其普特战士国王
2: 玛哈拉纳·普拉塔普被认为是拉其普特反抗外国统治的象征
3: 他的遗产在拉贾斯坦邦通过节日和纪念碑来庆祝
4: 1576 年的哈尔迪加蒂战役是他最著名的战役
5: 他与阿克巴领导的莫卧儿帝国作战
```

`query_embed` 专为查询而设计，可带来更相关、更符合上下文的结果。检索到的文档往往与查询意图紧密相关。

- [Retrieval with FastEmbed](https://qdrant.github.io/fastembed/qdrant/Retrieval_with_FastEmbed/)


## FastEmbed & Qdrant

Qdrant 是一个开源向量相似性搜索引擎，用于存储、组织和查询高维向量集合。

### 安装
```bash
pip install 'qdrant-client[fastembed]' --quiet --upgrade
```

```python
from typing import List
from qdrant_client import QdrantClient


documents: List[str] = [
    "玛哈拉纳·普拉塔普是来自梅瓦尔的拉其普特战士国王",
    "他与阿克巴领导的莫卧儿帝国作战",
    "1576 年的哈尔迪加蒂战役是他最著名的战役",
    "他拒绝向阿克巴屈服,继续进行游击战",
    "他的首都是奇托加尔,后来被莫卧儿人占领",
    "他于 1597 年去世,享年 57 岁",
    "玛哈拉纳·普拉塔普被认为是拉其普特反抗外国统治的象征",
    "他的遗产在拉贾斯坦邦通过节日和纪念碑来庆祝",
    "他有 11 个妻子和 17 个儿子,包括继任他成为梅瓦尔统治者的阿玛尔·辛格一世",
    "他的一生出现在各种电影、电视节目和书籍中",
]

# client = QdrantClient("localhost", port=6333) # For production
client = QdrantClient(":memory:")

# List of supported models: https://qdrant.github.io/fastembed/examples/Supported_Models
client.set_model(embedding_model_name="BAAI/bge-small-zh-v1.5")

client.add(collection_name="test_collection", documents=documents)

query = "玛哈拉纳·普拉塔普是哪个国家的国王？"
search_result = client.query(collection_name="test_collection", query_text=query, limit=5)
for result in search_result:
    print(f'score: {result.score:.2f}, doc: {result.document}')
```
```
score: 0.83, doc: 玛哈拉纳·普拉塔普是来自梅瓦尔的拉其普特战士国王
score: 0.76, doc: 玛哈拉纳·普拉塔普被认为是拉其普特反抗外国统治的象征
score: 0.44, doc: 他的遗产在拉贾斯坦邦通过节日和纪念碑来庆祝
score: 0.40, doc: 1576 年的哈尔迪加蒂战役是他最著名的战役
score: 0.39, doc: 他与阿克巴领导的莫卧儿帝国作战
```

`set_model` 方法用于设置嵌入模型，`add` 方法用于添加文档，`query` 方法用于查询文档。

插入带有 `metadata` 的文档：

```python
# Prepare your documents, metadata, and IDs
docs = ["Qdrant has Langchain integrations", "Qdrant also has Llama Index integrations"]
metadata = [
    {"source": "Langchain-docs"},
    {"source": "Linkedin-docs"},
]
ids = [42, 2]

# Use the new add method
client.add(collection_name="demo_collection", documents=docs, metadata=metadata, ids=ids)
```

- [Usage With Qdrant](https://qdrant.github.io/fastembed/qdrant/Usage_With_Qdrant/)
