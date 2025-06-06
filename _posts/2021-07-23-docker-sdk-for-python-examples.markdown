---
layout: single
title:  "Docker SDK for Python Examples"
date:   2021-07-23 00:00:00 +0800
categories: Docker
tags: [Python]
---

## 安装 Docker SDK for Python
```shell
pip install docker
```

## 例子
### 将本地文件或目录添加到容器，生成新的镜像。
* put_archive
* commit

```py
import docker
import tarfile
import tempfile
import os

def simple_tar(path):
    f = tempfile.NamedTemporaryFile()
    t = tarfile.open(mode='w', fileobj=f)
    abs_path = os.path.abspath(path)
    t.add(abs_path, arcname=os.path.basename(path))
    t.close()
    f.seek(0)
    return f

client = docker.from_env()
container = client.containers.create('alpine')
with simple_tar('test') as test_tar:
    container.put_archive('/', test_tar)

container.commit('test-alpine')

container.remove()
client.close()
```

## 参考资料
* [Docker SDK for Python](https://github.com/docker/docker-py)
* [Docker SDK for Python Document](https://docker-py.readthedocs.io/en/stable/index.html)
* [Develop with Docker Engine API](https://docs.docker.com/engine/api/)
* [docker-py : Docker Python sdk container.put_archive not working](https://stackoverflow.com/questions/66840278/docker-py-docker-python-sdk-container-put-archive-not-working)
