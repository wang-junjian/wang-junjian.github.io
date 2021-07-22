---
layout: post
title:  "Kubernetes中的节点亲和性和Pod亲和性"
date:   2021-07-03 00:00:00 +0800
categories: Kubernetes
tags: [kubectl, affinity, nodeAffinity, podAffinity, command, curl]
---

## 节点亲和性（nodeAffinity）
### 实现 nodeSelector 一样的功能
#### 编写 YAML 文件（kubia.yaml）
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: kubia
  labels:
    app: kubia
spec:
  selector:
    matchLabels:
      app: kubia
  replicas: 4
  template:
    metadata:
      labels:
        app: kubia
    spec:
      affinity:
        nodeAffinity:
          requiredDuringSchedulingIgnoredDuringExecution:
            nodeSelectorTerms:
            - matchExpressions:
              - key: node-type
                operator: In
                values:
                - inference
      containers:
      - name: kubia
        image: wangjunjian/kubia:latest
        ports:
        - containerPort: 8080
```
* requiredDuringSchedulingIgnoredDuringExecution 必须
* preferredDuringSchedulingIgnoredDuringExecution 优先

#### 为节点打标签
```shell
kubectl label nodes ln2 node-type=training
kubectl label nodes ln3 node-type=training
kubectl label nodes ln6 node-type=inference
```

#### 部署
```shell
kubectl apply -f kubia.yaml 
```

#### 查看 Pod 的部署
```shell
$ kubectl get pods -o wide
NAME                    READY   STATUS    RESTARTS   AGE    IP          NODE   NOMINATED NODE   READINESS GATES
kubia-c6c7ff5c5-82vdr   1/1     Running   0          102s   10.34.0.7   ln6    <none>           <none>
kubia-c6c7ff5c5-bz7tf   1/1     Running   0          2m2s   10.34.0.5   ln6    <none>           <none>
kubia-c6c7ff5c5-j5mgr   1/1     Running   0          2m2s   10.34.0.6   ln6    <none>           <none>
kubia-c6c7ff5c5-sdxd5   1/1     Running   0          83s    10.34.0.8   ln6    <none>           <none>
```

### 优先考虑指定表达式的调度
```yaml
    spec:
      affinity:
        nodeAffinity:
          preferredDuringSchedulingIgnoredDuringExecution:
          - weight: 100
            preference:
              matchExpressions:
              - key: node-type
                operator: In
                values:
                - inference
```

## Pod 亲和性（podAffinity）
### 服务器端与客户端调度运行到同一个节点
#### 编写服务器端 YAML 文件（kubia-podaffinity.yaml）
```yaml
apiVersion: v1
kind: Service
metadata:
  name: kubia
  labels:
    app: kubia
spec:
  ports:
  - name: http
    port: 80
    targetPort: http
  selector:
    app: kubia

---

apiVersion: apps/v1
kind: Deployment
metadata:
  name: kubia
  labels:
    app: kubia
spec:
  selector:
    matchLabels:
      app: kubia
  replicas: 1
  template:
    metadata:
      labels:
        app: kubia
    spec:
      containers:
      - name: kubia
        image: wangjunjian/kubia:latest
        ports:
        - name: http
          containerPort: 8080
```

#### 部署服务器端
```shell
kubectl apply -f kubia-podaffinity.yaml
```

#### 编写客户端 YAML 文件（get-kubia-podaffinity.yaml）
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: get-kubia
  labels:
    app: kubia
spec:
  selector:
    matchLabels:
      app: kubia
  replicas: 4
  template:
    metadata:
      labels:
        app: kubia
    spec:
      affinity:
        podAffinity:
          requiredDuringSchedulingIgnoredDuringExecution:
          - topologyKey: kubernetes.io/hostname
            labelSelector:
              matchLabels:
                app: kubia
      containers:
      - name: get-kubia
        image: centos:latest
        command: ["bash", "-c", "curl $KUBIA_SERVICE_HOST; sleep 86400"]
```

#### 部署客户端
```shell
kubectl apply -f get-kubia-podaffinity.yaml
```

#### 查看 Pod
```shell
$ kubectl get pod -o wide
NAME                         READY   STATUS    RESTARTS   AGE    IP           NODE   NOMINATED NODE   READINESS GATES
get-kubia-847f947cb4-8gb96   1/1     Running   0          107s   10.32.0.10   ln3    <none>           <none>
get-kubia-847f947cb4-d6548   1/1     Running   0          107s   10.32.0.12   ln3    <none>           <none>
get-kubia-847f947cb4-rfcp2   1/1     Running   0          107s   10.32.0.9    ln3    <none>           <none>
get-kubia-847f947cb4-vp8q5   1/1     Running   0          107s   10.32.0.11   ln3    <none>           <none>
kubia-6fdc7ff55d-hv8nt       1/1     Running   0          31m    10.32.0.8    ln3    <none>           <none>
```

## Pod 非亲和性（podAntiAffinity）
### 每个节点只运行一个
#### 编写 YAML 文件（kubia-podantiaffinity.yaml）
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: kubia
  labels:
    app: kubia
spec:
  selector:
    matchLabels:
      app: kubia
  replicas: 4
  template:
    metadata:
      labels:
        app: kubia
    spec:
      affinity:
        podAntiAffinity:
          requiredDuringSchedulingIgnoredDuringExecution:
            - topologyKey: kubernetes.io/hostname
              labelSelector:
                matchLabels:
                  app: kubia
      containers:
      - name: kubia
        image: wangjunjian/kubia:latest
        ports:
        - containerPort: 8080
```

#### 部署
```shell
kubectl apply -f kubia-podantiaffinity.yaml
```

#### 查看 Pod
```shell
$ kubectl get pod -o wide
NAME                     READY   STATUS    RESTARTS   AGE   IP           NODE     NOMINATED NODE   READINESS GATES
kubia-5c7457c795-fth74   1/1     Running   0          20s   10.38.0.23   ln2      <none>           <none>
kubia-5c7457c795-fx8wt   1/1     Running   0          20s   10.34.0.5    ln6      <none>           <none>
kubia-5c7457c795-ggm7c   1/1     Running   0          20s   10.32.0.8    ln3      <none>           <none>
kubia-5c7457c795-m8twr   0/1     Pending   0          20s   <none>       <none>   <none>           <none>
```
可以看到通过 Pod 非亲和性的设置，kubia 的每个 Pod 在每个节点只能有一个，因为有3个工作节点，所以有一个没能调度到节点上运行。

### 优先考虑指定表达式的调度
#### 为满足 Pod 的调度运行，可以使用 preferredDuringSchedulingIgnoredDuringExecution。
```shell
    spec:
      affinity:
        podAntiAffinity:
          preferredDuringSchedulingIgnoredDuringExecution:
          - weight: 100
            podAffinityTerm:
              topologyKey: kubernetes.io/hostname
              labelSelector:
                matchLabels:
                  app: kubia
```

#### 查看 Pod
```shell
$ kubectl get pod -o wide
NAME                     READY   STATUS    RESTARTS   AGE    IP           NODE   NOMINATED NODE   READINESS GATES
kubia-57c5f5fcc9-4xk2v   1/1     Running   0          2m3s   10.34.0.5    ln6    <none>           <none>
kubia-57c5f5fcc9-4zw2b   1/1     Running   0          2m3s   10.32.0.8    ln3    <none>           <none>
kubia-57c5f5fcc9-nfdk6   1/1     Running   0          2m3s   10.38.0.23   ln2    <none>           <none>
kubia-57c5f5fcc9-rjhwr   1/1     Running   0          2m3s   10.34.0.6    ln6    <none>           <none>
```
可以看到调度在满足 Pod 非亲和性的设置，多余的 Pod 也被调度运行。

## 参考资料
* [将 Pod 分配给节点](https://kubernetes.io/zh/docs/concepts/scheduling-eviction/assign-pod-node/)
