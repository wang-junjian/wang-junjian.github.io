---
layout: post
title:  "Kubernetes中的名字空间"
date:   2021-06-26 00:00:00 +0800
categories: Kubernetes
tags: [kubectl, namespace]
---

## 名字空间
名字空间将对象分割成独立的组，为对象名字提供了作用域，名字在不同的名字空间可以是相同的。名字空间对正在运行的对象不提供任何隔离，名字空间之间是否提供网络隔离取决于 Kubernetes 所使用的网络解决方案。

### 查看当前集群中的所有名字空间
```shell
$ kubectl get namespaces 
```
```
NAME                   STATUS   AGE
default                Active   379d
kube-node-lease        Active   379d
kube-public            Active   379d
kube-system            Active   379d
kubernetes-dashboard   Active   377d
```

### 创建名字空间
* 使用命令
```shell
$ kubectl create namespace kubia
namespace/kubia created
```

* 编写 YAML 文件（kubia-namespace.yaml）
```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: kubia
```
```shell
$ kubectl apply -f kubia-namespace.yaml 
namespace/kubia created
```

查看新创建的名字空间，ns 是 namespace 的缩写。
```shell
$ kubectl get ns kubia
NAME    STATUS   AGE
kubia   Active   35s
```

### 删除名字空间
```shell
$ kubectl delete ns kubia
namespace "kubia" deleted
```

## 管理名字空间中的对象
### 编写 YAML 文件（kubia.yaml）
```yaml
apiVersion: v1
kind: Service
metadata:
  name: kubia 
  labels:
    app: kubia
spec:
  type: NodePort 
  ports:
  - port: 8080
    targetPort: 8080
    nodePort: 30087
  selector:
    app: kubia 

---

apiVersion: apps/v1
kind: Deployment
metadata:
  name: kubia 
spec:
  selector:
    matchLabels:
      app: kubia 
  replicas: 2
  template:
    metadata:
      labels:
        app: kubia 
    spec:
      containers:
      - name: kubia 
        image: wangjunjian/kubia:latest 
        ports:
        - containerPort: 8080 
```

### 在指定名字空间中部署应用
```shell
$ kubectl apply -f kubia.yaml --namespace kubia
service/kubia created
deployment.apps/kubia created
```

### 查看指定名字空间的所有实例
```shell
$ kubectl get all -n kubia
```
```
NAME                        READY   STATUS    RESTARTS   AGE
pod/kubia-864465c9d-5vntt   1/1     Running   0          99s
pod/kubia-864465c9d-xnq9t   1/1     Running   0          99s

NAME            TYPE       CLUSTER-IP       EXTERNAL-IP   PORT(S)          AGE
service/kubia   NodePort   10.107.215.133   <none>        8080:30087/TCP   7s

NAME                    READY   UP-TO-DATE   AVAILABLE   AGE
deployment.apps/kubia   2/2     2            2           99s

NAME                              DESIRED   CURRENT   READY   AGE
replicaset.apps/kubia-864465c9d   2         2         2       99s
```

### 删除指定名字空间的所有类型的所有实例
* ```all``` 所有资源类型
* ```--all``` 所有资料实例
```shell
$ kubectl delete all --all -n kubia 
pod "kubia-864465c9d-5vntt" deleted
pod "kubia-864465c9d-xnq9t" deleted
service "kubia" deleted
deployment.apps "kubia" deleted
replicaset.apps "kubia-864465c9d" deleted
```

### 删除指定名字空间及里面的所有类型的所有实例
```shell
$ kubectl delete namespaces kubia
namespace "kubia" deleted
```

### 查看所有名字空间中的标签 app=kubia 的 Pod 实例
```shell
$ kubectl get pods --all-namespaces -l app=kubia
```
```
NAMESPACE   NAME                    READY   STATUS    RESTARTS   AGE
default     kubia-864465c9d-744qc   1/1     Running   0          7d3h
default     kubia-864465c9d-kzql7   1/1     Running   0          7d3h
default     kubia-manual            1/1     Running   0          2d19h
default     kubia-manual-v2         1/1     Running   0          47h
kubia       kubia-864465c9d-x2xzx   1/1     Running   0          41s
kubia       kubia-864465c9d-xhsfq   1/1     Running   0          41s
```
也可以使用简写，A 是 all-namespaces 的缩写。
```shell
$ kubectl get pods -A -l app=kubia
```

## 切换名字空间
通过 kubectl config 可以设置当前上下文件的名字空间，可以避免在命令中频繁指定名字空间。
### 查看所有上下文
```shell
$ kubectl config get-contexts 
CURRENT   NAME                          CLUSTER      AUTHINFO           NAMESPACE
*         kubernetes-admin@kubernetes   kubernetes   kubernetes-admin   
```

### 查看当前上下文
```shell
$ kubectl config current-context
kubernetes-admin@kubernetes
```

### 设置指定上下文的名字空间
```shell
$ kubectl config set-context $(kubectl config current-context) --namespace kubia
Context "kubernetes-admin@kubernetes" modified.
```

### 查看 Pod 实例（现在默认的名字空间是 kubia）
```shell
$ kubectl get pod
NAME                    READY   STATUS    RESTARTS   AGE
kubia-864465c9d-x2xzx   1/1     Running   0          17m
kubia-864465c9d-xhsfq   1/1     Running   0          17m
```

### 恢复名字空间为 default
```shell
$ kubectl config set-context $(kubectl config current-context) --namespace default
Context "kubernetes-admin@kubernetes" modified.
```

### 将切换当前上下文的名字空间命令化
编写配置文件 ~/.bashrc
```
alias kcd='kubectl config set-context $(kubectl config current-context) --namespace'
```
让配置后的命令生效
```shell
source ~/.bashrc
```
使用定义的 kcd 命令进行名字空间切换
```shell
$ kcd kubia
Context "kubernetes-admin@kubernetes" modified.

$ kcd default
Context "kubernetes-admin@kubernetes" modified.
```
