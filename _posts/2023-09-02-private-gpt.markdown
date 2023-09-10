---
layout: post
title:  "Private GPT"
date:   2023-09-02 08:00:00 +0800
categories: PrivateGPT
tags: [Chroma, Faiss, Gunicorn, Uvicorn, SQLite3, GPT, Shell]
---

## 模型
### [Taiyi-CLIP-Roberta-102M-Chinese 中文CLIP模型](https://huggingface.co/IDEA-CCNL/Taiyi-CLIP-Roberta-102M-Chinese)
使用电网的图片测试了一下，效果不理想。

### HuggingFace 下载
* [The pipeline API](https://huggingface.co/docs/transformers.js/pipelines)
* [using pipelines with a local model](https://stackoverflow.com/questions/68536546/using-pipelines-with-a-local-model)
* [How to download hugging face sentiment-analysis pipeline to use it offline?](https://stackoverflow.com/questions/66906652/how-to-download-hugging-face-sentiment-analysis-pipeline-to-use-it-offline)
* [How to Download Hugging Face Sentiment-Analysis Pipeline for Offline Use](https://saturncloud.io/blog/how-to-download-hugging-face-sentimentanalysis-pipeline-for-offline-use/)
* [pipeline does not load from local folder, instead, it always downloads models from the internet.](https://github.com/huggingface/transformers/issues/21613)
* []()

## 向量数据库
### [Chroma](https://www.trychroma.com/)

`Chroma` 向量数据库依赖于 `sqlite3`，而且需要 sqlite3 >= 3.35.0。

制作镜像时，使用的是 `python:3.10` 和 `python:3.10-slim`，使用 `apt install sqlite3` 能够安装的 `sqlite3` 最高版本是 3.34.1，所以会出现下面的错误。

```shell
    import chromadb
  File "/usr/local/lib/python3.10/site-packages/chromadb/__init__.py", line 69, in <module>
    raise RuntimeError(
RuntimeError: Your system has an unsupported version of sqlite3. Chroma requires sqlite3 >= 3.35.0.
Please visit https://docs.trychroma.com/troubleshooting#sqlite to learn how to upgrade.
```

* [Troubleshooting](https://docs.trychroma.com/troubleshooting#sqlite)
* [LangChain Chroma](https://python.langchain.com/docs/integrations/vectorstores/chroma)

这里采用编译源码的方式安装 `sqlite3`。

```shell
wget https://www.sqlite.org/2023/sqlite-autoconf-3430000.tar.gz
tar -zxvf sqlite-autoconf-3430000.tar.gz
cd sqlite-autoconf-3430000
./configure --prefix=/usr/local
make install
```
```
make[1]: Entering directory '/sqlite-autoconf-3430000'
 /bin/mkdir -p '/usr/local/lib'
 /bin/bash ./libtool   --mode=install /usr/bin/install -c   libsqlite3.la '/usr/local/lib'
libtool: install: /usr/bin/install -c .libs/libsqlite3.so.0.8.6 /usr/local/lib/libsqlite3.so.0.8.6
libtool: install: (cd /usr/local/lib && { ln -s -f libsqlite3.so.0.8.6 libsqlite3.so.0 || { rm -f libsqlite3.so.0 && ln -s libsqlite3.so.0.8.6 libsqlite3.so.0; }; })
libtool: install: (cd /usr/local/lib && { ln -s -f libsqlite3.so.0.8.6 libsqlite3.so || { rm -f libsqlite3.so && ln -s libsqlite3.so.0.8.6 libsqlite3.so; }; })
libtool: install: /usr/bin/install -c .libs/libsqlite3.lai /usr/local/lib/libsqlite3.la
libtool: install: /usr/bin/install -c .libs/libsqlite3.a /usr/local/lib/libsqlite3.a
libtool: install: chmod 644 /usr/local/lib/libsqlite3.a
libtool: install: ranlib /usr/local/lib/libsqlite3.a
libtool: finish: PATH="/usr/local/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/sbin" ldconfig -n /usr/local/lib
----------------------------------------------------------------------
Libraries have been installed in:
   /usr/local/lib

If you ever happen to want to link against installed libraries
in a given directory, LIBDIR, you must either use libtool, and
specify the full pathname of the library, or use the '-LLIBDIR'
flag during linking and do at least one of the following:
   - add LIBDIR to the 'LD_LIBRARY_PATH' environment variable
     during execution
   - add LIBDIR to the 'LD_RUN_PATH' environment variable
     during linking
   - use the '-Wl,-rpath -Wl,LIBDIR' linker flag
   - have your system administrator add LIBDIR to '/etc/ld.so.conf'

See any operating system documentation about shared libraries for
more information, such as the ld(1) and ld.so(8) manual pages.
----------------------------------------------------------------------
 /bin/mkdir -p '/usr/local/bin'
  /bin/bash ./libtool   --mode=install /usr/bin/install -c sqlite3 '/usr/local/bin'
libtool: install: /usr/bin/install -c sqlite3 /usr/local/bin/sqlite3
 /bin/mkdir -p '/usr/local/include'
 /usr/bin/install -c -m 644 sqlite3.h sqlite3ext.h '/usr/local/include'
 /bin/mkdir -p '/usr/local/share/man/man1'
 /usr/bin/install -c -m 644 sqlite3.1 '/usr/local/share/man/man1'
 /bin/mkdir -p '/usr/local/lib/pkgconfig'
 /usr/bin/install -c -m 644 sqlite3.pc '/usr/local/lib/pkgconfig'
make[1]: Leaving directory '/sqlite-autoconf-3430000'
```

* x86
```shell
cp /usr/local/lib/libsqlite3.so.0.8.6 /usr/lib/x86_64-linux-gnu/libsqlite3.so.0
```

* arm64
```shell
cp /usr/local/lib/libsqlite3.so.0.8.6 /usr/lib/aarch64-linux-gnu/libsqlite3.so.0
```

* [SQLite Download Page](https://www.sqlite.org/download.html)
* [How to Install SQLite3 from Source on Linux (With a Sample Database)](https://www.thegeekstuff.com/2011/07/install-sqlite3/)
* [Load embedding from disk - Langchain Chroma DB](https://community.openai.com/t/load-embedding-from-disk-langchain-chroma-db/290297)

### [Milvus](https://milvus.io)
#### 图片搜索
```shell
import os
import numpy as np
from pymilvus import FieldSchema, CollectionSchema, Collection, DataType, connections, utility

from app.models.search_image import SearchImageModel
from app.config import Config

config = Config()
model = SearchImageModel()
model.load(config)


def get_images(path):
    image_paths = []

    ext_names = ['.png', '.jpg', '.jpeg']

    for filename in os.listdir(path):
        _, ext_name = os.path.splitext(filename.lower())
        if ext_name.lower() in ext_names:
            image_paths.append(filename)

    return image_paths


image_path = 'data/images/20190128155421222575013.jpg'
image_features = model.get_image_features_with_path(image_path)
print('*'*100, image_features.shape)
images = get_images('data/images')
for image in images:
    file_path = f'data/images/{image}'
    image_features = model.get_image_features(file_path)
    collection.insert([[file_path], [image_features]])


COLLECTION_NAME = 'PrivateGPTImage'  # Collection name
connections.connect(host='localhost', port=19530)

if utility.has_collection(COLLECTION_NAME):
    utility.drop_collection(COLLECTION_NAME)

fields = [
    FieldSchema(name='path', dtype=DataType.VARCHAR, description='Image path', is_primary=True, auto_id=False, max_length=1024),
    FieldSchema(name='embedding', dtype=DataType.FLOAT_VECTOR, description='Embedding vectors', dim=512)
]
schema = CollectionSchema(fields=fields, description='Image Collection')
collection = Collection(name=COLLECTION_NAME, schema=schema)

images = get_images('data/images')
for image in images:
    file_path = f'data/images/{image}'
    image_features = model.get_image_features_with_path(file_path)
    image_features /= np.linalg.norm(image_features)
    # image_features = image_features / image_features.norm(dim=-1, keepdim=True)
    collection.insert([[file_path], image_features.numpy()])

index_params = {
    'index_type': 'IVF_FLAT',
    'metric_type': 'L2',
    'params': {'nlist': 512}
}
collection.create_index(field_name="embedding", index_params=index_params)
collection.load()


collection = Collection(COLLECTION_NAME)
collection.load()

def search_image(text):
    # Search parameters for the index
    search_params={
        "metric_type": "L2"
    }

    data = model.get_text_features(text)
    data /= np.linalg.norm(data)
    # data /= data.norm(dim=-1, keepdim=True)
    search_param = {
        "data": data.numpy(),
        "anns_field": "embedding",
        "param": {"metric_type": "L2", "offset": 1},
        "limit": 10,
        "output_fields": ["path"],
    }
    results=collection.search(**search_param)

    ret=[]
    for hit in results[0]:
        row=[]
        row.extend([hit.id, hit.score, hit.entity.get('path')])  # Get the id, distance, and title for the results
        ret.append(row)
    return ret

results = search_image('Working at heights wearing a helmet') # 戴着安全帽高空作业
for result in results:
    print(result)

utility.drop_collection(COLLECTION_NAME)
```

#### 文本搜索
```shell
from langchain.vectorstores import Milvus
from langchain.text_splitter import CharacterTextSplitter
from langchain.document_loaders import TextLoader

EMBEDDING_MODEL_NAME='BAAI/bge-base-zh'
EMBEDDING_MODEL_CACHE_DIRECTORY='models/embeddings'

from langchain.embeddings import HuggingFaceEmbeddings
embeddings = HuggingFaceEmbeddings(model_name=EMBEDDING_MODEL_NAME, 
                                   cache_folder=EMBEDDING_MODEL_CACHE_DIRECTORY)
vector_store = Milvus(embedding_function=embeddings, 
                      collection_name="PrivateGPT", 
                      connection_args={"host": 'localhost', "port": 19530},
                      drop_old = True)

loader = TextLoader('data/docs/test.txt')
documents = loader.load()
text_splitter = CharacterTextSplitter(chunk_size=200, chunk_overlap=0)
texts = text_splitter.split_documents(documents)

vector_store.add_documents(texts)
docs = vector_store.similarity_search("有多少张图片")
for i, doc in enumerate(docs):
    print(f'{i} - {len(doc.page_content)}', doc.page_content[:100])
```

* [Milvus Docs](https://milvus.io/docs)
* [Question Answering Using Milvus and Hugging Face](https://milvus.io/docs/integrate_with_hugging-face.md)
* [Similarity Search with Milvus and OpenAI](https://milvus.io/docs/integrate_with_openai.md)
* [Build a Milvus Powered Text-Image Search Engine in Minutes](https://github.com/towhee-io/examples/blob/main/image/text_image_search/1_build_text_image_search_engine.ipynb)
* [Deep Dive into Text-Image Search Engine with Towhee](https://github.com/towhee-io/examples/blob/main/image/text_image_search/2_deep_dive_text_image_search.ipynb)
* [基于Milvus的向量搜索实践（一）](https://mp.weixin.qq.com/s?__biz=MzU3OTY2MjQ2NQ==&mid=2247485325&idx=1&sn=f62c471d2e7cf9051f17602c12a364c3)
* [基于Milvus的向量搜索实践（二）](https://mp.weixin.qq.com/s?__biz=MzU3OTY2MjQ2NQ==&mid=2247485384&idx=1&sn=fee83ac6c9d5d2b6ed76a5699f137c50)
* [基于Milvus的向量搜索实践（三）](https://mp.weixin.qq.com/s?__biz=MzU3OTY2MjQ2NQ==&mid=2247485412&idx=1&sn=9f0f790355e4867f26822d1a7e86fffa)
* [向量检索：如何取舍 Milvus 索引实现搜索优化？](https://time.geekbang.org/dailylesson/detail/100075742)
* [笔记︱几款多模态向量检索引擎：Faiss 、milvus、Proxima、vearch、Jina等](https://zhuanlan.zhihu.com/p/364923722)
* [PyMilvus](https://pymilvus.readthedocs.io/en/latest/)
* [A purposeful rendezvous with Milvus — the vector database](https://medium.com/@indirakrigan/a-purposeful-rendezvous-with-milvus-the-vector-database-2acee4da25e2)
* [Install Milvus Standalone with Docker Compose (CPU)](https://milvus.io/docs/install_standalone-docker.md)

### [Faiss](https://faiss.ai/index.html)


## 文件重复检测
### Redis

运行 Redis 服务。

```shell
docker run --name redis -it -p 6379:6379 -v $(pwd)/data/redis:/data redis redis-server --save 60 1
```

安装 `redis` Python 包。

```shell
pip install redis
```

测试。

```shell
import redis
from redis.exceptions import ConnectionError

try:
    r = redis.Redis(host='localhost', port=6379, decode_responses=True)
    r.ping()
    print('Connected!')
except ConnectionError as ex:
    print('Error:', ex)
    raise Exception

r.set('hello', 'world')
r.get('hello')
```

### 使用 Redis 保存图片的 MD5 值

```shell
import os, hashlib

dir = 'images'
for filename in os.listdir(dir):
    file_path = f'{dir}/{filename}'
    file_hash = hashlib.md5(open(file_path, 'rb').read()).hexdigest()
    if not r.get(file_hash):
        r.set(file_hash, file_path)
        print(file_hash, file_path)
```

* [Redis](https://redis.io/)
* [Redis Docker Hub](https://hub.docker.com/_/redis)
* [Finding duplicate files and removing them](https://stackoverflow.com/questions/748675/finding-duplicate-files-and-removing-them)
* [Finding Duplicate Files with Python](https://www.geeksforgeeks.org/finding-duplicate-files-with-python/)

## Gunicorn
### 服务多进程运行，出现竞争问题。

执行下面的命令出现错误信息。

```shell
gunicorn --worker-class uvicorn.workers.UvicornWorker --config app/gunicorn_conf.pyc app.main:app
```

错误信息

```shell
Traceback (most recent call last):
  File "/usr/local/bin/gunicorn", line 8, in <module>
    sys.exit(run())
  File "/usr/local/lib/python3.10/site-packages/gunicorn/app/wsgiapp.py", line 67, in run
    WSGIApplication("%(prog)s [OPTIONS] [APP_MODULE]").run()
  File "/usr/local/lib/python3.10/site-packages/gunicorn/app/base.py", line 236, in run
    super().run()
  File "/usr/local/lib/python3.10/site-packages/gunicorn/app/base.py", line 72, in run
    Arbiter(self).run()
  File "/usr/local/lib/python3.10/site-packages/gunicorn/arbiter.py", line 229, in run
    self.halt(reason=inst.reason, exit_status=inst.exit_status)
  File "/usr/local/lib/python3.10/site-packages/gunicorn/arbiter.py", line 342, in halt
    self.stop()
  File "/usr/local/lib/python3.10/site-packages/gunicorn/arbiter.py", line 396, in stop
    time.sleep(0.1)
  File "/usr/local/lib/python3.10/site-packages/gunicorn/arbiter.py", line 242, in handle_chld
    self.reap_workers()
  File "/usr/local/lib/python3.10/site-packages/gunicorn/arbiter.py", line 530, in reap_workers
    raise HaltServer(reason, self.WORKER_BOOT_ERROR)
gunicorn.errors.HaltServer: <HaltServer 'Worker failed to boot.' 3>
```

使用 `--preload` 参数可以解决这个问题。

```shell
gunicorn --worker-class uvicorn.workers.UvicornWorker --config app/gunicorn_conf.pyc --preload app.main:app
```

* [gunicorn 报错 Worker failed to boot. 解决办法](https://blog.csdn.net/m0_38007695/article/details/88780594)

### 进程运行数量过多，出现内存不足的错误。

```shell
MAX_WORKERS=10 gunicorn --worker-class uvicorn.workers.UvicornWorker --config app/gunicorn_conf.pyc --preload app.main:app
```

错误信息

```shell
[2023-09-02 09:14:07 +0000] [1] [ERROR] Worker (pid:212) was sent SIGKILL! Perhaps out of memory?
```

使用 `MAX_WORKERS` 参数减少进程数量。

```shell
MAX_WORKERS=3 gunicorn --worker-class uvicorn.workers.UvicornWorker --config app/gunicorn_conf.pyc --preload app.main:app
```

* [Gunicorn worker terminated with signal 9](https://stackoverflow.com/questions/67637004/gunicorn-worker-terminated-with-signal-9)
* [tiangolo/uvicorn-gunicorn-fastapi-docker](https://github.com/tiangolo/uvicorn-gunicorn-fastapi-docker)

## Python
### 文本转换为 bool 类型

```python
>>> eval('True')
True
>>> eval('False')
False
```

直接使用 `bool` 函数会出现下面的错误。

```python
>>> bool('True')
True
>>> bool('False')
True
```

* [Converting from a string to boolean in Python](https://stackoverflow.com/questions/715417/converting-from-a-string-to-boolean-in-python)

## Gradio
### Gallery
* [Cannot drag and drop image from Gallery to Image](https://github.com/gradio-app/gradio/issues/4377)
* [Specifying Gallery's height causes unexpected display of images](https://github.com/gradio-app/gradio/issues/3515)
* [Adjust width / height of image preview in the Image Component?](https://github.com/gradio-app/gradio/issues/654)

### mount_gradio_app
* [gradio/demo/custom_path/run.py](https://github.com/gradio-app/gradio/blob/main/demo/custom_path/run.py)
* [mount_gradio_app causing reload loop](https://github.com/gradio-app/gradio/issues/2427)
* [gradio HTML component with javascript code don't work](https://stackoverflow.com/questions/76071586/gradio-html-component-with-javascript-code-dont-work)

* [Build a demo with Gradio](https://huggingface.co/learn/audio-course/chapter5/demo)
* [Gradio Controlling Layout](https://www.gradio.app/guides/controlling-layout)
* [LoRA the Explorer](https://huggingface.co/spaces/multimodalart/LoraTheExplorer)
* [LoraTheExplorer/app.py](https://huggingface.co/spaces/multimodalart/LoraTheExplorer/blob/main/app.py)
* [LoraTheExplorer/custom.css](https://huggingface.co/spaces/multimodalart/LoraTheExplorer/blob/main/custom.css)
* [Gradio tutorial (Build machine learning applications)](https://www.machinelearningnuggets.com/gradio-tutorial/)
* [Gradio File](https://www.gradio.app/docs/file)

## Shell
### 查找文件软链接的绝对路径

```shell
ls -l /usr/lib/aarch64-linux-gnu/libsqlite3.so.0
```
```
lrwxrwxrwx 1 root root 19 Feb 24  2021 /usr/lib/aarch64-linux-gnu/libsqlite3.so.0 -> libsqlite3.so.0.8.6
```

```shell
readlink -f /usr/lib/aarch64-linux-gnu/libsqlite3.so.0
```
```
/usr/lib/aarch64-linux-gnu/libsqlite3.so.0.8.6
```

* [Find out symbolic link target via command line](https://serverfault.com/questions/76042/find-out-symbolic-link-target-via-command-line)

## 构建镜像
### Dockerfile
```dockerfile
FROM python:3.10-slim

ARG SQLITE3_PATH
ENV APP_HOME=/private-gpt

WORKDIR ${APP_HOME}

# 编译Sqlite3
RUN wget https://www.sqlite.org/2023/sqlite-autoconf-3430000.tar.gz \
    && tar -zxvf sqlite-autoconf-3430000.tar.gz \
    && cd sqlite-autoconf-3430000 \
    && ./configure --prefix=/usr/local \
    && make \
    && make install \
    && cd .. \
    && rm -rf sqlite-autoconf-3430000 \
    && rm -rf sqlite-autoconf-3430000.tar.gz

# 拷贝Sqlite3
COPY --from=builder /usr/local/lib/libsqlite3.so.0.8.6 ${SQLITE3_PATH}
```

### 构建多平台镜像的脚本
```shell
build_image() {
    local dockerfile=$1
    local app_name=$2
    local platforms=($3)
    local platform_sqlite3_paths=($4)

    for ((i=0; i<${#platforms[@]}; ++i))
    do
        echo "🐳 Building $app_name:${platforms[i]}, Sqlite3 Path: ${platform_sqlite3_paths[i]}"
        docker buildx build --progress=plain --platform=linux/${platforms[i]} --rm -f $dockerfile \
            --build-arg SQLITE3_PATH=${platform_sqlite3_paths[i]} \
            -t wangjunjian/$app_name:${platforms[i]} "."
        echo "💯\n"
    done

}

APP_NAME=private-gpt
PLATFORMS=(amd64 arm64)
PLATFORM_SQLITE3_PATHS=(/usr/lib/x86_64-linux-gnu/libsqlite3.so.0 /usr/lib/aarch64-linux-gnu/libsqlite3.so.0)
build_image Dockerfile $APP_NAME "${PLATFORMS[*]}" "${PLATFORM_SQLITE3_PATHS[*]}"
```

### 测试镜像
```shell
docker run --rm -it -p 8000:80 -e MAX_WORKERS=1 wangjunjian/private-gpt:arm64
```

### 上传镜像
```shell
docker push wangjunjian/private-gpt:amd64
```

### 下载镜像
```shell
docker pull wangjunjian/private-gpt:amd64
``` 

### 运行镜像
```shell
docker run -d --name private-gpt -p 8888:80 -v $(pwd)/storage:/private-gpt/storage -e MAX_WORKERS=1 wangjunjian/private-gpt:amd64
``` 

* [bash shell script two variables in for loop](https://stackoverflow.com/questions/11215088/bash-shell-script-two-variables-in-for-loop)
* [wangjunjian/ultralytics-serving](https://hub.docker.com/r/wangjunjian/ultralytics-serving/tags)


## 参考资料
* [OpenAI CLIP](https://github.com/openai/CLIP)
* [Hugging Face CLIP](https://huggingface.co/docs/transformers/model_doc/clip)
* [How do I persist to disk a temporary file using Python?](https://stackoverflow.com/questions/94153/how-do-i-persist-to-disk-a-temporary-file-using-python)
* [Making Neural Search Queries Accessible to Everyone with Gradio — Deploying Haystack’s Semantic Document Search with Hugging Face models in Gradio in Three Easy Steps](https://medium.com/@duerr.sebastian/making-neural-search-queries-accessible-to-everyone-with-gradio-haystack-726e77aca047)
* [Towhee](https://github.com/towhee-io/towhee)
* [Visualize nearest neighbor search on reverse image search](https://codelabs.towhee.io/visualize-nearest-neighbor-search-on-reverse-image-search/index)
* [Fine-Grained Image Similarity Detection Using Facebook AI Similarity Search(FAISS)](https://medium.com/swlh/fine-grained-image-similarity-detection-using-facebook-ai-similarity-search-faiss-b357da4f1644)
* [Building an image search engine with Python and Faiss](https://thetisdev.hashnode.dev/building-an-image-search-engine-with-python-and-faiss)
* [Fast and Simple Image Search with Foundation Models](https://www.ivanzhou.me/blog/2023/3/19/fast-and-simple-image-search-with-foundation-models)
* [250+ Free Machine Learning Datasets for Instant Download](https://datasets.activeloop.ai/docs/ml/datasets/)
* [Image search with 🤗 datasets](https://huggingface.co/blog/image-search-datasets)
* [FAISS (Facebook AI Similarity Search)](https://www.activeloop.ai/resources/glossary/faiss-facebook-ai-similarity-search/)
* [Deep Lake Docs](https://docs.activeloop.ai/)
* [Weaviate](https://weaviate.io/)
* [Weaviate GitHub](https://github.com/weaviate/weaviate)
* [Milvus makes it easy to add similarity search to your applications](https://milvus.io/milvus-demos/)
* [Milvus](https://github.com/milvus-io/milvus)
* [8 Best Vector Databases to Unleash the True Potential of AI](https://geekflare.com/best-vector-databases/)
* [12 Vector Databases For 2023: A Review](https://lakefs.io/blog/12-vector-databases-2023/)
* [HuggingFaceEmbeddings](https://api.python.langchain.com/en/latest/embeddings/langchain.embeddings.huggingface.HuggingFaceEmbeddings.html)
* [How to Use FAISS to Build Your First Similarity Search](https://medium.com/loopio-tech/how-to-use-faiss-to-build-your-first-similarity-search-bf0f708aa772)
* [LangChain Vector stores](https://python.langchain.com/docs/integrations/vectorstores/)
* [Introduction to Facebook AI Similarity Search (Faiss)](https://www.pinecone.io/learn/series/faiss/faiss-tutorial/)
* [Faiss: A library for efficient similarity search](https://engineering.fb.com/2017/03/29/data-infrastructure/faiss-a-library-for-efficient-similarity-search/)
* [DocArray](https://github.com/docarray/docarray)
* [Welcome to DocArray!](https://docarray.jina.ai/index.html)
* [Qwen-7B-Chat](https://huggingface.co/Qwen/Qwen-7B-Chat)
* [Private GPT](https://github.com/imartinez/privateGPT/blob/main/ingest.py)
* [基于localGPT 和 streamlit 打造个人知识库问答机器人](https://zhuanlan.zhihu.com/p/649697654)
* [gpt4-pdf-chatbot-langchain](https://github.com/mayooear/gpt4-pdf-chatbot-langchain)
* [Knowledge QA LLM](https://github.com/RapidAI/Knowledge-QA-LLM)
* [Knowledge-QA-LLM: 基于本地知识库+LLM的开源问答系统](https://zhuanlan.zhihu.com/p/646768641)
* [闻达：一个大规模语言模型调用平台](https://github.com/wenda-LLM/wenda)
* [Building a FastAPI App with the Gradio Python Client](https://www.gradio.app/guides/fastapi-app-with-the-gradio-client)
* [How to use your own data with Dolly](https://huggingface.co/databricks/dolly-v2-12b/discussions/88)
* [Using Langchain, Chroma, and GPT for document-based retrieval-augmented generation](https://developer.dataiku.com/latest/tutorials/machine-learning/genai/nlp/gpt-lc-chroma-rag/index.html)
* [face_recognition](https://face-recognition.readthedocs.io/en/latest/face_recognition.html)
* [Chat completions API](https://platform.openai.com/docs/guides/gpt/chat-completions-api)
* [ImageSearcher/image_searcher/embedders/face_embedder.py](https://github.com/ManuelFay/ImageSearcher/blob/master/image_searcher/embedders/face_embedder.py)
* [GPT best practices](https://platform.openai.com/docs/guides/gpt-best-practices)
* [Jina](https://jina.ai/)
* [PromptPerfect 专业一流的提示词工程开发工具](https://promptperfect.jina.ai/)
