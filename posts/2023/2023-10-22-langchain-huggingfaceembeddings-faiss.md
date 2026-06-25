---
type: article
title:  "LangChain HuggingFaceEmbeddings + FAISS"
date:   2023-10-22 08:00:00 +0800
tags: [langchain, embeddings, hugging-face, faiss, vector-search, machine-learning, python]
---

## 数据
```py
weather_texts = [
    "😀 今天天气舒适，心情大好。",
    "😀 今天天气晴朗，阳光明媚。",
    "😀 今天天气宜人，适合出门游玩。",
    "😀 今天天气没有下雨，真是太好了。",
    "😀 今天天气比昨天好多了，真是令人欣喜。",
    "😀 今天天气晴空万里，蓝天白云，真是美不胜收。",
    "😀 今天天气温暖如春，空气清新，让人心旷神怡。",
    "😀 今天天气风和日丽，微风徐徐，让人心情舒畅。",
    "😀 今天天气万里无云，阳光灿烂，让人精神振奋。",
    "😀 今天天气秋高气爽，天朗气清，让人心胸开阔。",
    "🥶 今天天气很糟糕。",
    "🥶 今天天气阴沉沉的，让人心情烦躁。",
    "🥶 今天天气下雨了，真是让人沮丧。",
    "🥶 今天天气太热了，出门都觉得热得受不了。",
    "🥶 今天天气太冷了，出门都要穿上厚衣服。",
    "🥶 今天天气乌云密布，风雨欲来，真是让人提心吊胆。",
    "🥶 今天天气寒风刺骨，道路结冰，真是让人寸步难行。",
    "🥶 今天天气闷热潮湿，空气污浊，真是让人喘不过气来。",
    "🥶 今天天气灰蒙蒙的，看不到蓝天白云，真是让人心情沉重。",
    "🥶 今天天气狂风暴雨，树木倒伏，道路封闭，真是让人措手不及。"
]
```

## Embedding Model 加载本地缓存（HuggingFaceEmbeddings）
### 模型文件中有 modules.json
```py
from langchain.embeddings import HuggingFaceEmbeddings

embeddings = HuggingFaceEmbeddings(model_name='BAAI/bge-base-zh', 
                                   cache_folder='models/embeddings/', 
                                   encode_kwargs={'normalize_embeddings': True})
```

### 模型文件中没有 modules.json
需要先下载模型文件，然后再使用本地缓存加载模型，这样才能不依赖网络。

```py
from langchain.embeddings import HuggingFaceEmbeddings

HuggingFaceEmbeddings(model_name='infgrad/stella-base-zh-v2', cache_folder='models/embeddings/')

embeddings = HuggingFaceEmbeddings(model_name='models/embeddings/infgrad_stella-base-zh-v2', 
                                   encode_kwargs={'normalize_embeddings': True})
```

## LangChain HuggingFaceEmbeddings + FAISS（相似度搜索）
```py
from langchain.vectorstores import FAISS
from langchain.embeddings import HuggingFaceEmbeddings

def download_huggingface_embedding_model(model_name, cache_folder):
    HuggingFaceEmbeddings(model_name=model_name, cache_folder=cache_folder)

def get_huggingface_embedding_model(model_name, cache_folder='models/embeddings/', encode_kwargs={'normalize_embeddings': True}):
    return HuggingFaceEmbeddings(model_name=model_name, cache_folder=cache_folder, encode_kwargs=encode_kwargs)

def docsearch(query, texts, embedding):
    faiss = FAISS.from_texts(texts, embedding)

    retriever = faiss.as_retriever(
        search_type="similarity_score_threshold",
        search_kwargs={'score_threshold': 0.5, 'k': 3}
    )

    return retriever.get_relevant_documents(query)

def print_docsearch_result(query, docs):
    print('🔥 Query: ', query)
    for i, doc in enumerate(docs):
        print(f'📕 {i+1}: ', doc.page_content)
```

## 测试
### [infgrad/stella-base-zh-v2](https://huggingface.co/infgrad/stella-base-zh-v2)
```py
embedding = get_huggingface_embedding_model('models/embeddings/infgrad_stella-base-zh-v2')

query = '今天天气不错'
docs = docsearch(query, weather_texts, embedding)
print_docsearch_result(query, docs)
```
```
🔥 Query:  今天天气不错
📕 1:  😀 今天天气比昨天好多了，真是令人欣喜。
📕 2:  😀 今天天气宜人，适合出门游玩。
📕 3:  😀 今天天气舒适，心情大好。
```

### [sensenova/piccolo-large-zh](https://huggingface.co/sensenova/piccolo-large-zh)
```py
embedding = get_huggingface_embedding_model('models/embeddings/sensenova_piccolo-large-zh')

query = '今天天气不错'
docs = docsearch(query, weather_texts, embedding)
print_docsearch_result(query, docs)
```
```
🔥 Query:  今天天气不错
📕 1:  😀 今天天气没有下雨，真是太好了。
📕 2:  😀 今天天气宜人，适合出门游玩。
📕 3:  😀 今天天气比昨天好多了，真是令人欣喜。
```

### [BAAI/bge-base-zh](https://huggingface.co/BAAI/bge-base-zh)
```py
embedding = get_huggingface_embedding_model('BAAI/bge-base-zh')

query = '今天天气不错'
docs = docsearch(query, weather_texts, embedding)
print_docsearch_result(query, docs)
```
```
🔥 Query:  今天天气不错
📕 1:  😀 今天天气晴朗，阳光明媚。
📕 2:  😀 今天天气舒适，心情大好。
📕 3:  😀 今天天气比昨天好多了，真是令人欣喜。
```

### [BAAI/bge-base-zh-v1.5](https://huggingface.co/BAAI/bge-base-zh-v1.5)
```py
embedding = get_huggingface_embedding_model('BAAI/bge-base-zh-v1.5')

query = '今天天气不错'
docs = docsearch(query, weather_texts, embedding)
print_docsearch_result(query, docs)
```
```
🔥 Query:  今天天气不错
📕 1:  😀 今天天气比昨天好多了，真是令人欣喜。
📕 2:  😀 今天天气舒适，心情大好。
📕 3:  😀 今天天气宜人，适合出门游玩。
```

## 参考资料
* [Langchain-Chatchat](https://github.com/chatchat-space/Langchain-Chatchat)
* [When search_type="similarity_score_threshold, retriever returns negative scores #10864](https://github.com/langchain-ai/langchain/issues/10864)
* [LangChain:通过LLM实现QA问答中的一些细节笔记（二）](https://zhuanlan.zhihu.com/p/627439522)
* [【LangChain】向量存储之FAISS](https://blog.csdn.net/u013066244/article/details/132014791)
* [langchain.vectorstores.faiss.FAISS](https://api.python.langchain.com/en/latest/vectorstores/langchain.vectorstores.faiss.FAISS.html)
* [How to retrieve source documents via LangChain's get_relevant_documents method only if the answer is from the custom knowledge base](https://stackoverflow.com/questions/77178370/how-to-retrieve-source-documents-via-langchains-get-relevant-documents-method-o)
* [Problem with embedding model #9486](https://github.com/langchain-ai/langchain/issues/9486)
