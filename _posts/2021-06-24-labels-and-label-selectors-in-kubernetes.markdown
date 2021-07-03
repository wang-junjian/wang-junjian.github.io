---
layout: post
title:  "Kubernetes中的标签和标签选择器"
date:   2021-06-24 00:00:00 +0800
categories: Kubernetes
tags: [kubectl, label]
---

## 标签
标签是键值对的形式，用于组织 Kubernetes 资源，为对象进行分组。只要标签的 key 在资源内是唯一的，一个资源便可以拥有多个标签。

通过添加两个标签将 Pod 组织为两个维度（基于应用的横向维度和基于版本的纵向维度）

![](/images/2021/kubernetes/pod-labels.png)

### 编写带标签的 Pod YAML文件(kubia-manual-labels.yaml)
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: kubia-manual-v2
  labels:
    app: sc
    rel: stable
spec:
  containers:
  - image: wangjunjian/kubia
    name: kubia
    ports:
    - containerPort: 8080
      protocol: TCP
```

### 创建带标签的 Pod
```shell
$ kubectl apply -f kubia-manual-labels.yaml
pod/kubia-manual-v2 created
```

### 查看 Pod 的标签（```--show-labels```）
```shell
$ kubectl get pods --show-labels
NAME                    READY   STATUS    RESTARTS   AGE     LABELS
kubia-864465c9d-744qc   1/1     Running   0          5d3h    app=kubia,pod-template-hash=864465c9d
kubia-864465c9d-kzql7   1/1     Running   0          5d3h    app=kubia,pod-template-hash=864465c9d
kubia-manual            1/1     Running   0          19h     <none>
kubia-manual-v2         1/1     Running   0          3m34s   app=sc,rel=stable
```

### 查看 Pod 时，标签显示在列中（-L key,...）
```shell
$ kubectl get pods -L app,rel
NAME                    READY   STATUS    RESTARTS   AGE     APP     REL
kubia-864465c9d-744qc   1/1     Running   0          5d3h    kubia   
kubia-864465c9d-kzql7   1/1     Running   0          5d3h    kubia   
kubia-manual            1/1     Running   0          19h              
kubia-manual-v2         1/1     Running   0          7m15s   sc      stable
```

### 修改现有 Pod 的标签
* 增加（key=value）
```shell
$ kubectl label pod kubia-manual app=kubia
pod/kubia-manual labeled
```
```shell
$ kubectl get pods -L app,rel
NAME                    READY   STATUS    RESTARTS   AGE    APP     REL
kubia-864465c9d-744qc   1/1     Running   0          5d4h   kubia   
kubia-864465c9d-kzql7   1/1     Running   0          5d4h   kubia   
kubia-manual            1/1     Running   0          19h    kubia   
kubia-manual-v2         1/1     Running   0          19m    sc      stable
```

* 更新（```--overwrite```）
```shell
$ kubectl label pod kubia-manual-v2 app=kubia --overwrite
pod/kubia-manual-v2 labeled
```
```shell
$ kubectl get pods -L app,rel
NAME                    READY   STATUS    RESTARTS   AGE    APP     REL
kubia-864465c9d-744qc   1/1     Running   0          5d4h   kubia   
kubia-864465c9d-kzql7   1/1     Running   0          5d4h   kubia   
kubia-manual            1/1     Running   0          19h    kubia   
kubia-manual-v2         1/1     Running   0          22m    kubia   stable
```

* 删除（key-）
```shell
$ kubectl label pod kubia-manual-v2 rel-
pod/kubia-manual-v2 labeled
```
```shell
$ kubectl get pods -L app,rel
NAME                    READY   STATUS    RESTARTS   AGE    APP     REL
kubia-864465c9d-744qc   1/1     Running   0          5d4h   kubia   
kubia-864465c9d-kzql7   1/1     Running   0          5d4h   kubia   
kubia-manual            1/1     Running   0          19h    kubia   
kubia-manual-v2         1/1     Running   0          26m    kubia   
```

## 标签选择器
标签选择器允许我们选择标记有特定标签的资源子集，并对这些资源执行操作。简单来说就是结合标签对资源进行条件过滤。

标签选择器根据资源的以下条件来选择资源：
* 包含（不包含）使用特定键的标签
* 包含具有特定键和值的标签
* 包含具有特定键的标签，但其值与我们指定的不同

### 包含键值（key=value）
```shell
$ kubectl get pods -l app=kubia
NAME                    READY   STATUS    RESTARTS   AGE
kubia-864465c9d-744qc   1/1     Running   0          5d6h
kubia-864465c9d-kzql7   1/1     Running   0          5d6h
kubia-manual            1/1     Running   0          21h
kubia-manual-v2         1/1     Running   0          140m
```

### 包含键（key）
```shell
$ kubectl get pods -l rel
NAME              READY   STATUS    RESTARTS   AGE
kubia-manual-v2   1/1     Running   0          146m
```

### 不包含键（!rel）
```shell
$ kubectl get pods -l '!rel'
NAME                    READY   STATUS    RESTARTS   AGE
kubia-864465c9d-744qc   1/1     Running   0          5d6h
kubia-864465c9d-kzql7   1/1     Running   0          5d6h
kubia-manual            1/1     Running   0          21h
```

### 不包含键值（key!=value），key 不存在也符合条件
```shell
$ kubectl get pods -l app!=kubia
```

### in
```shell
$ kubectl get pods -l 'app in (kubia, sc)'
NAME                    READY   STATUS    RESTARTS   AGE
kubia-864465c9d-744qc   1/1     Running   0          5d6h
kubia-864465c9d-kzql7   1/1     Running   0          5d6h
kubia-manual            1/1     Running   0          21h
kubia-manual-v2         1/1     Running   0          150m
```

### notin，key 不存在也符合条件
```shell
$ kubectl get pods -l 'app notin (kubia, sc)'
```

## 使用标签分类工作节点
### 给节点打标签
```shell
$ kubectl label nodes ln6 gpu=true
node/ln6 labeled
```

### 通过标签查看节点
```shell
$ kubectl get nodes -l gpu=true
NAME   STATUS   ROLES    AGE   VERSION
ln6    Ready    <none>   80d   v1.18.3
```

### 编写 Pod YAML 文件（kubia-manual-node-gpu-labels.yaml）
```shell
apiVersion: v1
kind: Pod
metadata:
  name: kubia-manual-v3
  labels:
     app: kubia
spec:
  nodeSelector:
    gpu: "true"
  containers:
  - image: wangjunjian/kubia
    name: kubia
    ports:
    - containerPort: 8080
      protocol: TCP
```

### 创建 Pod
```shell
$ kubectl apply -f kubia-manual-node-gpu-labels.yaml
pod/kubia-manual-v3 created
```

### 查看
```shell
$ kubectl get pods kubia-manual-v3 -o wide
NAME              READY   STATUS    RESTARTS   AGE     IP           NODE   NOMINATED NODE   READINESS GATES
kubia-manual-v3   1/1     Running   0          7m58s   10.34.0.10   ln6    <none>           <none>
```

每个节点都有一个唯一标签，其中键为 ```kubernetes.io/hostname```，值为该```节点的主机名```，因此可以将 Pod 调度到某个确定的节点。但绝不应该考虑这样使用，因为一旦节点离线了，这个 Pod 将不会重新调度运行，所以应该使用自定义标签，使用一组逻辑节点。

## 使用标签选择器删除对象
### 删除标签 app=kubia 的 Pod 对象
```shell
$ kubectl delete pods -l app=kubia
pod "kubia-864465c9d-x2xzx" deleted
pod "kubia-864465c9d-xhsfq" deleted
```

### 删除标签 app=kubia 的所有对象
```shell
$ kubectl delete all -l app=kubia
pod "kubia-864465c9d-p7dkp" deleted
pod "kubia-864465c9d-qzxs2" deleted
service "kubia" deleted
replicaset.apps "kubia-864465c9d" deleted
```
