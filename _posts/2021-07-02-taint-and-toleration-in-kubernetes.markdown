---
layout: single
title:  "Kubernetes中的污点和容忍度"
date:   2021-07-02 00:00:00 +0800
categories: Kubernetes
tags: [kubectl, taint, toleration, JSONPath]
---

## 污点
通过给节点添加污点，可以拒绝 Pod 调度到节点上。

### 污点样式
```
<key>=[value]:<effect>
```
* value 可以为空
* effect
  - NoSchedule, Pod 必须添加容忍度才能调度到这个节点。
  - PreferNoSchedule, 没有可调度的节点，Pod 会调度到这个节点。（宽松版 NoSchedule）
  - NoExecute, 不仅影响调度，也影响运行的 Pod，没有这个污点容忍度的运行 Pod 都会从这个节点删除。

例子
```
dedicated=foo:PreferNoSchedule
node-role.kubernetes.io/master:NoSchedule
node.kubernetes.io/unreachable:NoExecute
node.kubernetes.io/unreachable:NoSchedule
```

### 增加
```shell
kubectl taint node ln6 key1=value1:NoSchedule
# 增加多个
kubectl taint node ln6 key1=value1:NoSchedule key1=value1:PreferNoSchedule
```

**一个 key 可以有多个 effect**

### 删除
```shell
kubectl taint node ln6 key1=value1:NoSchedule-
# 使用 key 删除
kubectl taint node ln6 key1-
```

### 更新
```shell
kubectl taint node ln6 key1=value2:NoSchedule --overwrite
```

### 查看
#### kubectl describe
```shell
$ kubectl describe node ln6
......
Taints:             key1=value1:NoSchedule
                    key1=value1:PreferNoSchedule
```

#### 使用 JSONPath
* 查看单个节点的污点信息
```shell
$ kubectl get node ln6 -o=jsonpath='{range .spec.taints[*]}{.key}{"="}{.value}{":"}{.effect}{"\n"}{end}'
key1=value1:NoSchedule
key1=value1:PreferNoSchedule
```

* 查看集群所有节点的污点信息
```shell
$ kubectl get nodes -o=jsonpath='{range .items[*]}{.metadata.name}{"\t"}{.status.addresses[0].address}{"\n"}{range .spec.taints[*]}{"\t"}{.key}{"="}{.value}{":"}{.effect}{"\n"}{end}{end}'
gpu1	172.16.33.66
	node.kubernetes.io/unreachable=:NoSchedule
	node.kubernetes.io/unreachable=:NoExecute
ln1	172.16.33.157
	node-role.kubernetes.io/master=:NoSchedule
ln2	172.16.33.158
ln3	172.16.33.159
ln6	172.16.33.174
	key1=value1:NoSchedule
	key1=value1:PreferNoSchedule
```

## 容忍度
通过给 Pod 添加污点的容忍度，Pod有可能（没有污点的节点也可能被调度）被调度到节点上。

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
  replicas: 2
  template:
    metadata:
      labels:
        app: kubia
    spec:
      tolerations:
      - key: node-type
        operator: Equal
        value: training
        effect: PreferNoSchedule
      containers:
      - name: kubia
        image: wangjunjian/kubia:latest
        ports:
        - containerPort: 8080
```
* tolerations 可以添加多个表达式。
* operator 默认值是 Equal。
  - Exists （此时容忍度不能指定 value）
  - Equal 则它们的 value 应该相等

### 分隔集群
ln2 和 ln3 作为训练节点，ln6 作为推理节点。之所以训练节点 effect 设置为 PreferNoSchedule，这样不设置容忍度也可以调试到训练节点。

* 查看集群节点
```shell
$ kubectl get nodes 
NAME   STATUS     ROLES    AGE    VERSION
ln1    Ready      master   399d   v1.18.3
ln2    Ready      <none>   399d   v1.18.3
ln3    Ready      <none>   399d   v1.18.3
ln6    Ready      <none>   14d    v1.18.3
```

* 给节点打标签
```shell
kubectl taint nodes ln2 node-type=training:PreferNoSchedule
kubectl taint nodes ln3 node-type=training:PreferNoSchedule
kubectl taint nodes ln6 node-type=inference:NoSchedule
```

* 为 Pod 设置 tolerations
  - 部署到训练节点（也可以不设置）
  ```shell
        tolerations:
        - key: node-type
          operator: Equal
          value: training
          effect: PreferNoSchedule
  ```
  - 部署到推理节点
  ```shell
        tolerations:
        - key: node-type
          operator: Equal
          value: inference
          effect: NoSchedule
  ```

* 部署训练应用
```shell
kubectl apply -f kubia.yaml
```

* 查看 Pod
```shell
$ kubectl get pod -o wide
NAME                    READY   STATUS    RESTARTS   AGE   IP           NODE   NOMINATED NODE   READINESS GATES
kubia-df54ddcf6-cw2v2   1/1     Running   0          16s   10.38.0.14   ln2    <none>           <none>
kubia-df54ddcf6-d6tnq   1/1     Running   0          16s   10.32.0.16   ln3    <none>           <none>
kubia-df54ddcf6-pj9hx   1/1     Running   0          16s   10.38.0.15   ln2    <none>           <none>
kubia-df54ddcf6-pjcjx   1/1     Running   0          16s   10.32.0.15   ln3    <none>           <none>
kubia-df54ddcf6-rzgn6   1/1     Running   0          16s   10.32.0.17   ln3    <none>           <none>
```

* 使用 NoExecute 对节点 ln2 上的 Pod 进行驱除
```shell
kubectl taint nodes ln2 node-type=training:NoExecute
```

可以看到运行在 ln2 节点上的2个 Pod 被删除，在 ln3 节点上进行了重新创建。
```shell
$ kubectl get pod -o wide
NAME                    READY   STATUS              RESTARTS   AGE    IP           NODE   NOMINATED NODE   READINESS GATES
kubia-df54ddcf6-c6cdz   0/1     ContainerCreating   0          10s    10.32.0.23   ln3    <none>           <none>
kubia-df54ddcf6-cw2v2   1/1     Terminating         0          4m3s   10.38.0.14   ln2    <none>           <none>
kubia-df54ddcf6-d6tnq   1/1     Running             0          4m3s   10.32.0.16   ln3    <none>           <none>
kubia-df54ddcf6-k6q8g   0/1     ContainerCreating   0          10s    10.32.0.18   ln3    <none>           <none>
kubia-df54ddcf6-pj9hx   1/1     Terminating         0          4m3s   10.38.0.15   ln2    <none>           <none>
kubia-df54ddcf6-pjcjx   1/1     Running             0          4m3s   10.32.0.15   ln3    <none>           <none>
kubia-df54ddcf6-rzgn6   1/1     Running             0          4m3s   10.32.0.17   ln3    <none>           <none>
```

### 容忍任意污点
如果一个容忍度的 key 为空且 operator 为 Exists， 表示这个容忍度与任意的 key 、value 和 effect 都匹配，即这个容忍度能容忍任意 taint。
```yaml
    spec:
      tolerations:
      - operator: Exists
```

### 忽略 effect
如果 effect 为空，则可以与所有键名 key 的效果相匹配。
```yaml
    spec:
      tolerations:
      - key: node-type
        operator: Equal
        value: training
```

## 参考资料
* [JSONPath Support](https://kubernetes.io/docs/reference/kubectl/jsonpath/)
* [污点和容忍度](https://kubernetes.io/zh/docs/concepts/scheduling-eviction/taint-and-toleration/)
