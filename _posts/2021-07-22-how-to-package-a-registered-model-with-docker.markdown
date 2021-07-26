---
layout: post
title:  "如何使用 Docker 打包已注册的模型"
date:   2021-07-22 00:00:00 +0800
categories: AI Kubernetes Docker
tags: [command]
---

## 模型打包成镜像
### 手工打包
```shell
project_dir=platen-switch
darknet_model_name=darknet-model-platen-switch

cd $project_dir
docker run -d --name $darknet_model_name alpine
docker cp model/ $darknet_model_name:/
docker commit -a 'wang-junjian@qq.com' -m 'darknet model [platen-switch recognition]' \
  $darknet_model_name gouchicao/$darknet_model_name:latest
docker rm -v $darknet_model_name

docker push gouchicao/$darknet_model_name:latest
```

### Python 脚本
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

darknet_model_name='gouchicao/darknet-model-platen-switch:latest'

client = docker.from_env()
container = client.containers.create('alpine')
with simple_tar('model') as test_tar:
    container.put_archive('/', test_tar)

container.commit(darknet_model_name)

container.remove()
client.close()
```

## 部署推理服务
### Docker
```shell
# 创建存储卷
docker run --name darknet-model-platen-switch --volume /model \
    gouchicao/darknet-model-platen-switch:latest

# 部署模型
docker run -it --name=darknet-serving-platen-switch -p 7713:7713 \
    --volumes-from darknet-model-platen-switch \
    gouchicao/darknet-serving:latest
```

### Kubernetes
#### 编写 Pod YAML（darknet-serving-pod.yaml）
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: darknet-serving
  labels:
    app: darknet-serving
spec:
  initContainers:
  - name: model
    image: gouchicao/darknet-model-platen-switch:latest
    command: ["sh", "-c", "cp /model/* /model-volume"]
    volumeMounts:
    - mountPath: /model-volume
      name: model-volume
  containers:
  - name: darknet-serving
    image: gouchicao/darknet-serving:latest
    ports:
    - containerPort: 7713
    volumeMounts:
    - mountPath: /model
      name: model-volume
  volumes:
  - name: model-volume
    emptyDir: {}
```

#### 编写 Service YAML（darknet-serving.yaml）
```yaml
apiVersion: v1
kind: Service
metadata:
  name: darknet-serving
  labels:
    app: darknet-serving
spec:
  ports:
  - name: http
    port: 80
    targetPort: http
  selector:
    app: darknet-serving

---

apiVersion: apps/v1
kind: Deployment
metadata:
  name: darknet-serving
  labels:
    app: darknet-serving
spec:
  selector:
    matchLabels:
      app: darknet-serving
  replicas: 1
  template:
    metadata:
      labels:
        app: darknet-serving
    spec:
      initContainers:
      - name: model
        image: gouchicao/darknet-model-platen-switch:latest
        command: ["sh", "-c", "cp /model/* /model-volume"]
        volumeMounts:
        - mountPath: /model-volume
          name: model-volume
      containers:
      - name: darknet-serving
        image: gouchicao/darknet-serving:latest
        command: ["sh", "-c", "python3 darknet_model_server.py -m=rest"]
        ports:
        - name: http
          containerPort: 7713
        volumeMounts:
        - mountPath: /model
          name: model-volume
      volumes:
      - name: model-volume
        emptyDir: {}
```

## 参考资料
* [darknet](https://github.com/gouchicao/darknet)
* [darknet-serving](https://github.com/gouchicao/darknet-serving)
* [model-zoo](https://github.com/gouchicao/darknet/tree/master/model-zoo)
* [Init Containers](https://kubernetes.io/docs/concepts/workloads/pods/init-containers/)
