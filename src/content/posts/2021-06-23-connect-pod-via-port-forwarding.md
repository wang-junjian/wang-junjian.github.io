---
layout: single
title:  "通过端口转发连接Pod"
date:   2021-06-23 00:00:00 +0800
categories: Kubernetes
tags: [kubectl, apply, logs, port-forward]
---

通过端口转发（port-forward）可以连接到 Pod，方便测试和调试服务。

## 创建 Pod
### 编写 Pod YAML文件(kubia-manual.yaml)
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: kubia-manual
spec:
  containers:
  - image: wangjunjian/kubia
    name: kubia
    ports:
    - containerPort: 8080
      protocol: TCP
```

### 创建 Pod
```shell
$ kubectl apply -f kubia-manual.yaml 
pod/kubia-manual created
```

### 查看 Pod
```shell
$ kubectl get pod kubia-manual
```
```
NAME           READY   STATUS    RESTARTS   AGE
kubia-manual   1/1     Running   0          77s
```

### 查看 Pod 的完整描述
* YAML 格式
```shell
$ kubectl get pod kubia-manual -o yaml
```

* JSON 格式
```shell
$ kubectl get pod kubia-manual -o json
```

## 日志查看
logs 是查看容器的日志，Pod 只有一个容器时，可以忽略容器名。

```shell
$ kubectl logs kubia-manual 
Kubia server starting...
```

### 使用容器名：kubia
```shell
$ kubectl logs kubia-manual kubia
Kubia server starting...
```

## 向 Pod 发送请求
### 将本地网络端口转发到 Pod 中的端口
```shell
$ kubectl port-forward kubia-manual 8888:8080
```
```
Forwarding from 127.0.0.1:8888 -> 8080
Forwarding from [::1]:8888 -> 8080
Handling connection for 8888
```

### 通过端口转发连接到 Pod
```shell
$ curl localhost:8888
You've hit kubia-manual
```

### 查看日志
```shell
$ kubectl logs kubia-manual 
Kubia server starting...
Received request from ::ffff:127.0.0.1
```
