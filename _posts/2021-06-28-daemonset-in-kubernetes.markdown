---
layout: post
title:  "Kubernetes中的DaemonSet"
date:   2021-06-28 00:00:00 +0800
categories: Kubernetes
tags: [kubectl, DaemonSet, apply, label, taint, toleration]
---

## DaemonSet
确保每个节点运行一个 Pod。

### 使用场景
* 日志收集
* 资源监控
* 网络代理

### 编写 DaemonSet 的YAML文件（kubia-ds.yaml）
```yaml
apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: kubia
spec:
  selector:
    matchLabels:
      app: kubia
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

### 创建 DaemonSet 对象
```shell
$ kubectl apply -f kubia-ds.yaml 
daemonset.apps/kubia created
```

### 查看 DaemonSet 对象
ds 是 DaemonSet 的缩写
```shell
$ kubectl get ds
NAME    DESIRED   CURRENT   READY   UP-TO-DATE   AVAILABLE   NODE SELECTOR   AGE
kubia   3         3         2       3            2           <none>          22s
```

查看 Pod 对象
```shell
$ kubectl get pods -o wide
NAME          READY   STATUS              RESTARTS   AGE   IP           NODE   NOMINATED NODE   READINESS GATES
kubia-h48q8   1/1     Running             0          23s   10.38.0.19   ln2    <none>           <none>
kubia-tx5hz   1/1     Running             0          23s   10.34.0.10   ln6    <none>           <none>
kubia-x9479   0/1     ContainerCreating   0          23s   <none>       ln3    <none>           <none>
```

### 通过污点容忍度部署 Pod 到主节点
可以看到主节点（ln1）没有 Pod 运行，默认情况下 Kubernetes 集群不会部署 Pod 到主节点上，主节点设置了污点（Tain），如果主节点也需要部署 Pod，可以在 Pod 模版里设置污点容忍度（Toleration）。
```shell
$ kubectl describe nodes ln1 | grep Taints
Taints:             node-role.kubernetes.io/master:NoSchedule
```

修改 DaemonSet 的YAML文件（kubia-ds.yaml）
```yaml
apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: kubia
spec:
  selector:
    matchLabels:
      app: kubia
  template:
    metadata:
      labels:
        app: kubia 
    spec:
      tolerations:
      - key: node-role.kubernetes.io/master
        effect: NoSchedule
      containers:
      - name: kubia 
        image: wangjunjian/kubia:latest 
        ports:
        - containerPort: 8080
```

部署 DaemonSet
```shell
$ kubectl apply -f kubia-ds.yaml 
daemonset.apps/kubia configured
```

查看 DaemonSet 对象
```shell
$ kubectl get ds
NAME    DESIRED   CURRENT   READY   UP-TO-DATE   AVAILABLE   NODE SELECTOR   AGE
kubia   4         4         3       1            3           <none>          22m
```

查看 Pod 对象
```shell
$ kubectl get pods -o wide
NAME          READY   STATUS    RESTARTS   AGE     IP           NODE   NOMINATED NODE   READINESS GATES
kubia-4kwk4   1/1     Running   0          4m10s   10.36.0.0    ln1    <none>           <none>
kubia-9xt76   1/1     Running   0          3m19s   10.34.0.10   ln6    <none>           <none>
kubia-lssm8   1/1     Running   0          2m25s   10.38.0.19   ln2    <none>           <none>
kubia-sgsds   1/1     Running   0          105s    10.32.0.17   ln3    <none>           <none>
```

### 通过节点选择器部署 Pod 到一组节点
这里假设节点（ln6）是一台GPU服务器，DaemonSet 的 Pod 只需要部署到GPU节点。

编写 DaemonSet 的YAML文件（kubia-ds-gpu.yaml）
```yaml
apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: kubia
spec:
  selector:
    matchLabels:
      app: kubia
  template:
    metadata:
      labels:
        app: kubia 
    spec:
      nodeSelector:
        server-type: gpu
      containers:
      - name: kubia 
        image: wangjunjian/kubia:latest 
        ports:
        - containerPort: 8080
```

创建 DaemonSet
```shell
$ kubectl apply -f kubia-ds-gpu.yaml 
daemonset.apps/kubia created
```

查看 DaemonSet 对象，发现全都是0，这是因为没有满足节点选择器条件的节点。
```shell
$ kubectl get ds
NAME    DESIRED   CURRENT   READY   UP-TO-DATE   AVAILABLE   NODE SELECTOR     AGE
kubia   0         0         0       0            0           server-type=gpu   5s
```

给节点（ln6）打标签
```shell
$ kubectl label node ln6 server-type=gpu
node/ln6 labeled
```

查看 DaemonSet 对象
```shell
$ kubectl get ds
NAME    DESIRED   CURRENT   READY   UP-TO-DATE   AVAILABLE   NODE SELECTOR     AGE
kubia   1         1         1       1            1           server-type=gpu   4m51s
```

查看 Pod 对象
```shell
$ kubectl get pod
NAME          READY   STATUS    RESTARTS   AGE
kubia-9c849   1/1     Running   0          81s
```

### 删除 DaemonSet，它管理的 Pod 也会一起删除。
```shell
$ kubectl delete ds kubia
daemonset.apps "kubia" deleted
```
