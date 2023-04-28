---
layout: post
title:  "OpenAI API Documentation Embeddings"
date:   2023-04-25 08:00:00 +0800
categories: OpenAI-API-Embedding
tags: ["OpenAI API", Embedding, Faiss]
---

## [什么是 Embedding？](https://platform.openai.com/docs/guides/embeddings/what-are-embeddings)
文本嵌入用于衡量文本字符串的相关性。嵌入通常用于：
* 搜索（结果按与查询字符串的相关性排序）
* 聚类（其中文本字符串按相似性分组）
* 推荐（推荐具有相关文本字符串的项目）
* 异常检测（识别出相关性很小的异常值）
* 多样性测量（分析相似性分布）
* 分类（其中文本字符串按其最相似的标签分类）

`嵌入是浮点数的向量（列表）。两个向量之间的距离衡量它们的相关性。小距离表示高相关性，大距离表示低相关性。`

## [如何获得 Embedding？](https://platform.openai.com/docs/guides/embeddings/how-to-get-embeddings)
### [Embedding API](https://platform.openai.com/docs/api-reference/embeddings)
#### 请求格式
```json
{
  "input": "A string to be embedded",
  "model": "text-embedding-ada-002"
}
```

#### 响应格式
```json
{
  "data": [
    {
      "embedding": [
        -0.02181987278163433,
        ...
        -0.0034146346151828766
      ],
      "index": 0,
      "object": "embedding"
    }
  ],
  "model": "text-embedding-ada-002-v2",
  "object": "list",
  "usage": {
    "prompt_tokens": 1,
    "total_tokens": 1
  }
}
```

### 获得一个字符串的 Embedding
```py
embedding = openai.Embedding.create(input = "Hello", model="text-embedding-ada-002").data[0].embedding
print(len(embedding), embedding)
```
```
1536 [-0.021849708631634712, -0.007138177752494812, ..., -0.004309536889195442, -0.0034034624695777893]
```

### 获得多个字符串的 Embedding
```py
embeddings = [data.embedding for data in openai.Embedding.create(input = ['Hi', 'Hello', '你好', '您好'], model="text-embedding-ada-002").data]
```

## [余弦相似性](https://zh.wikipedia.org/wiki/%E4%BD%99%E5%BC%A6%E7%9B%B8%E4%BC%BC%E6%80%A7)
### 介绍
余弦相似性通过测量两个向量的夹角的余弦值来度量它们之间的相似性。0度角的余弦值是1，而其他任何角度的余弦值都不大于1；并且其最小值是-1。从而两个向量之间的角度的余弦值确定两个向量是否大致指向相同的方向。两个向量有相同的指向时，余弦相似度的值为1；两个向量夹角为90°时，余弦相似度的值为0；两个向量指向完全相反的方向时，余弦相似度的值为-1。这结果是与向量的长度无关的，仅仅与向量的指向方向相关。余弦相似度通常用于正空间，因此给出的值为0到1之间。

注意这上下界对任何维度的向量空间中都适用，而且余弦相似性最常用于高维正空间。例如在信息检索中，每个词项被赋予不同的维度，而一个文档由一个向量表示，其各个维度上的值对应于该词项在文档中出现的频率。余弦相似度因此可以给出两篇文档在其主题方面的相似度。

OpenAI 推荐余弦相似度计算距离。距离函数的选择通常无关紧要，但是，余弦相似度计算距离的速度比欧几里得距离快得多，因为它不需要计算平方根。此外，余弦相似度的范围是[-1,1]，而欧几里得距离的范围是[0,∞)。因此，余弦相似度的范围更适合于搜索。

## 零样本分类
### 好评差评分类（cosine_similarity）
```py

from openai.embeddings_utils import cosine_similarity, get_embedding

# 选择使用最小的ada模型
model = "text-embedding-ada-002"

# 获取"好评"和"差评"的
good_embedding = get_embedding("好", engine=model)
bad_embedding = get_embedding("坏", engine=model)
class_embeddings = (good_embedding, bad_embedding)

good_example = get_embedding("买的银色版真的很好看，一天就到了，晚上就开始拿起来完系统很丝滑流畅，做工扎实，手感细腻，很精致哦苹果一如既往的好品质", engine=model)
bad_example = get_embedding("降价厉害，保价不合理，不推荐", engine=model)

def get_score(embedding, class_embeddings):
  good_embedding, bad_embedding = class_embeddings
  return cosine_similarity(embedding, good_embedding) - cosine_similarity(embedding, bad_embedding)

print("好评例子的评分 : %f" % get_score(good_example, class_embeddings))
print("差评例子的评分 : %f" % get_score(bad_example, class_embeddings))
```

```
好评例子的评分 : 0.036553
差评例子的评分 : -0.026165
```


{% highlight wjj %}
值 = 评论的embedding与好评embedding的余弦相似度 - 评论embedding与差评embedding的余弦相似度
值 > 0，倾向于好评
值 < 0，倾向于差评
{% endhighlight %}


### 好评差评分类（distances_from_embeddings）
```py
import pandas as pd
from openai.embeddings_utils import distances_from_embeddings, get_embedding

# 选择使用最小的ada模型
model = "text-embedding-ada-002"

# 获取评价的 embedding
df_good_bad = pd.DataFrame({'evaluation': ['好', '坏']})
df_good_bad['embedding'] = df_good_bad['evaluation'].apply(lambda x: get_embedding(x, engine=model))

comments = [
    '买的银色版真的很好看，一天就到了，晚上就开始拿起来完系统很丝滑流畅，做工扎实，手感细腻，很精致哦苹果一如既往的好品质',
    '降价厉害，保价不合理，不推荐',
]

df_comments = pd.DataFrame({'comment': comments, 'evaluation': ['', '']})
df_comments['embedding'] = df_comments['comment'].apply(lambda x: get_embedding(x, engine=model))
df_comments['evaluation'] = '' # 增加空列

for i, row in df_comments.iterrows():
    df_good_bad['distance'] = distances_from_embeddings(row['embedding'], df_good_bad['embedding'])
    df_comments.at[i, 'evaluation'] = df_good_bad.sort_values(by='distance', ascending=True)['evaluation'].values[0]

df_comments[['comment', 'evaluation']]
```

|    | comment                                                                                                              | evaluation   |
|---:|:---------------------------------------------------------------------------------------------------------------------|:-------------|
|  0 | 买的银色版真的很好看，一天就到了，晚上就开始拿起来完系统很丝滑流畅，做工扎实，手感细腻，很精致哦苹果一如既往的好品质                     | 好           |
|  1 | 降价厉害，保价不合理，不推荐                                                                                              | 坏           |


{% highlight wjj %}
distances_from_embeddings 返回的值越小，越相似。
{% endhighlight %}


## [Kaggle 提供的亚马逊耳机评论数据集](https://www.kaggle.com/datasets/shitalkat/amazonearphonesreviews)
### 生成 Embedding
```py
model = "text-embedding-ada-002"

def get_good_bad_embeddings(good='good', bad='bad', model=model):
    good_embedding = get_embedding(good, engine=model)
    bad_embedding = get_embedding(bad, engine=model)
    return [good_embedding, bad_embedding]

def is_good_bad(comment_embedding, good_bad_embeddings):
    good_embedding, bad_embedding = good_bad_embeddings
    return 'Good' if cosine_similarity(comment_embedding, good_embedding) - cosine_similarity(comment_embedding, bad_embedding)>0 else 'Bad'

good_bad_embeddings = get_good_bad_embeddings(good='good', bad='bad')

# 加载数据
df_all_product_reviews = pd.read_csv('Datasets/AllProductReviews.csv')

# 随机抽取100条评论
df_product_reviews = df_all_product_reviews.sample(100).copy().reset_index(drop=True)

# 将评论标题和评论内容拼接起来生成 Embedding
df_product_reviews['embedding'] = df_product_reviews.apply(lambda x: get_embedding(x['ReviewTitle']+x['ReviewBody'], engine=model), axis=1)
```

### 评价好坏分类
```py
def check_human_and_ai(review_star, review):
    return True if (review_star>=3 and review=='Good') or (review_star<3 and review=='Bad') else False

df_product_reviews['HumanReview'] = df_product_reviews['ReviewStar'].apply(lambda x: 'Good' if x>=3 else 'Bad')
df_product_reviews['AIReview'] = df_product_reviews['embedding'].apply(lambda x: is_good_bad(x, good_bad_embeddings))
df_product_reviews['Check_Human_AI'] = df_product_reviews.apply(lambda x: check_human_and_ai(x['ReviewStar'], x['AIReview']), axis=1)

# 结果统计
df_product_reviews['Check_Human_AI'].value_counts()
```
```
Check_Human_AI
True     91
False     9
Name: count, dtype: int64
```

### 指标评估（Precision, Recall, F1-Score）
```py
from sklearn.metrics import classification_report

# 评估
report = classification_report(df_product_reviews['HumanReview'], df_product_reviews['AIReview'])
print(report)
```
```
              precision    recall  f1-score   support

         Bad       0.85      0.74      0.79        23
        Good       0.93      0.96      0.94        77

    accuracy                           0.91       100
   macro avg       0.89      0.85      0.87       100
weighted avg       0.91      0.91      0.91       100
```

### 绘制 Precision-Recall 曲线
```py
import matplotlib.pyplot as plt
from sklearn.metrics import precision_recall_curve, PrecisionRecallDisplay

# 绘图不能使用字符串类型的数据，需要转换成数值类型
y_true = [1 if x=='Good' else 0 for x in df_product_reviews['HumanReview']]
y_pred = [1 if x=='Good' else 0 for x in df_product_reviews['AIReview']]

# 绘制 Precision-Recall 曲线
precision, recall, _ = precision_recall_curve(y_true, y_pred)
disp = PrecisionRecallDisplay(precision=precision, recall=recall)
disp.plot()
plt.show()
```

## 语义检索
### 跟每一条评论计算距离，然后升序排序
```py
query_embedding = get_embedding('Best Bluetooth headset', engine=model)

def search_product(df, query_embedding, top_k=3):
    df['distance'] = distances_from_embeddings(query_embedding, df['embedding'])
    return df.sort_values(by='distance', ascending=True).head(top_k)

search_product(df_product_reviews, query_embedding)[['ReviewTitle', 'ReviewBody', 'ReviewStar', 'distance']]
```

### 使用 [Faiss](https://faiss.ai) 加速
Faiss 是一个用于`高效相似性搜索`和`密集向量聚类`的库。它包含搜索任何大小的向量集的算法，数据存储在内存中。

```py
import faiss
import numpy as np

def load_faiss_index(df, column='embedding'):
    embeddings = df[column].tolist()
    embeddings = np.array(embeddings).astype('float32')
    index = faiss.IndexFlatL2(embeddings.shape[1])
    index.add(embeddings)
    return index

index = load_faiss_index(df_product_reviews)
distances, indexes = index.search(np.array(query_embedding).astype('float32').reshape(1, -1), k=3)
df_product_reviews.iloc[indexes[0]][['ReviewTitle', 'ReviewBody', 'ReviewStar']]
```
