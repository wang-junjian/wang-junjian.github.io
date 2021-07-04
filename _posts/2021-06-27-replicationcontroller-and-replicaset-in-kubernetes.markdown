---
layout: post
title:  "Kubernetes中的ReplicationController和ReplicaSet"
date:   2021-06-27 00:00:00 +0800
categories: Kubernetes
tags: [kubectl, ReplicationController, ReplicaSet, scale]
---

## ReplicationController
保证 Pod 对象始终处于期望的运行状态。不管 Pod 因何种原因消失（节点从集群消失或pod从节点中逐出）。

### 控制器的协调流程
**LOOP**
1. 通过标签选择器匹配 Pod
2. 比较匹配的数量与期望的副本数量
  - 少了。使用当前的模板创建 Pod
  - 多了。删除超出数量的 Pod
  - 等于。

### ReplicationController 的三个主要部分
* selector, 标签选择器
* replicas, 副本个数
* template, Pod 模板

### 编写 ReplicationController 的YAML文件（kubia-rc.yaml）
```yaml
apiVersion: v1
kind: ReplicationController
metadata:
  name: kubia
spec:
  selector:
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
★ 可以不指定标签选择器（selector），它会自动根据 Pod 模板中的标签设置。
```yaml
apiVersion: v1
kind: ReplicationController
metadata:
  name: kubia
spec:
  replicas: 2
  template:
    ......
```

### 创建 ReplicationController 对象
rc 是 ReplicationController 的缩写
```shell
$ kubectl get rc
NAME    DESIRED   CURRENT   READY   AGE
kubia   2         2         1       33s
```

```shell
$ kubectl get pods
NAME          READY   STATUS              RESTARTS   AGE
kubia-j8tth   0/1     ContainerCreating   0          35s
kubia-jkt8g   1/1     Running             0          35s
```

```shell
$ kubectl describe rc kubia
Name:         kubia
Namespace:    kubia
Selector:     app=kubia
Labels:       app=kubia
Annotations:  Replicas:  2 current / 2 desired
Pods Status:  1 Running / 1 Waiting / 0 Succeeded / 0 Failed
Pod Template:
  Labels:  app=kubia
  Containers:
   kubia:
    Image:        wangjunjian/kubia:latest
    Port:         8080/TCP
    Host Port:    0/TCP
    Environment:  <none>
    Mounts:       <none>
  Volumes:        <none>
Events:
  Type    Reason            Age    From                    Message
  ----    ------            ----   ----                    -------
  Normal  SuccessfulCreate  2m42s  replication-controller  Created pod: kubia-jkt8g
  Normal  SuccessfulCreate  2m42s  replication-controller  Created pod: kubia-j8tth
```

当删除 Pod 对象后，ReplicationController 会自动创建新的 Pod 对象来满足期望的副本个数。
```shell
$ kubectl delete pod kubia-jkt8g 
pod "kubia-jkt8g" deleted
```

```shell
$ kubectl get pods
NAME          READY   STATUS              RESTARTS   AGE
kubia-b42sb   0/1     ContainerCreating   0          6s
kubia-j8tth   1/1     Running             0          7m25s
kubia-jkt8g   1/1     Terminating         0          7m25s
```

```shell
$ kubectl get rc
NAME    DESIRED   CURRENT   READY   AGE
kubia   2         2         1       7m33s
```

### 将 Pod 对象移出 ReplicationController 的管理
通过修改标签的值，当不满足 ReplicationController 的标签选择器，Pod 对象的数量少于期望个数，便会自动创建新的 Pod。这项操作对于有问题的 Pod 或者要对其进行测试会比较有用。
```shell
$ kubectl label pod kubia-b42sb app=test --overwrite
pod/kubia-b42sb labeled
```

```shell
$ kubectl get pods
NAME          READY   STATUS              RESTARTS   AGE
kubia-b42sb   1/1     Running             0          10m
kubia-j8tth   1/1     Running             0          18m
kubia-rjfqq   0/1     ContainerCreating   0          6s
```

```shell
$ kubectl get pods --show-labels
NAME          READY   STATUS    RESTARTS   AGE   LABELS
kubia-b42sb   1/1     Running   0          12m   app=test
kubia-j8tth   1/1     Running   0          19m   app=kubia
kubia-rjfqq   1/1     Running   0          89s   app=kubia
```

```shell
$ kubectl get pods -L app
NAME          READY   STATUS    RESTARTS   AGE    APP
kubia-b42sb   1/1     Running   0          12m    test
kubia-j8tth   1/1     Running   0          20m    kubia
kubia-rjfqq   1/1     Running   0          2m2s   kubia
```

#### metadata.ownerReferences
被 ReplicationController 管理的 Pod 对象，Pod 对象的 YAML 配置中 metadata.ownerReferences 属性会引用 ReplicationController 对象，通过 kubectl edit 命令可以查看到。移出的 Pod 对象相应的 metadata.ownerReferences 属性也会被删除。

### 修改 Pod 模板
```shell
$ kubectl edit rc kubia
replicationcontroller/kubia edited
```
使用默认的文本编辑器打开 ReplicationController 的 YAML 配置。找到 Pod 模板部分，在其中加入一个新的标签 rel: beta，保存退出。

通过查看当前运行的 Pod 对象，发现并没有改变，这是因为 Pod 模板的修改只对新创建的 Pod 对象起作用。
```shell
$ kubectl get pods --show-labels 
NAME          READY   STATUS    RESTARTS   AGE   LABELS
kubia-j8tth   1/1     Running   0          43m   app=kubia
kubia-rjfqq   1/1     Running   0          25m   app=kubia
```

现在修改一下 Pod 的副本个数为3试试。
```shell
$ kubectl edit rc kubia
replicationcontroller/kubia edited
```

新创建的 Pod 的对象的标签多了 rel=beta
```shell
$ kubectl get pods --show-labels 
NAME          READY   STATUS              RESTARTS   AGE   LABELS
kubia-j8tth   1/1     Running             0          51m   app=kubia
kubia-rjfqq   1/1     Running             0          33m   app=kubia
kubia-wft2k   0/1     ContainerCreating   0          10s   app=kubia,rel=beta
```

#### 配置 kubectl edit 使用不同的文本编辑器
可以通过编辑环境变量 KUBE_EDITOR 来告诉 kubectl 使用期望的文本编辑器。可以执行以下命令或者将它放入 ~/.bashrc文件中，就可以使用 nano 来编辑 Kubernetes 资源的 YAML 配置。
```shell
export KUBE_EDITOR="/usr/bin/nano"
```

### 水平缩放 Pod
上面使用的 kubectl edit 来编辑 ReplicationController 的 YAML 配置，修改 replicas 属性。还可以通过命令 kubectl scale 来完成。

扩容
```shell
$ kubectl scale rc kubia --replicas=5
replicationcontroller/kubia scaled
```

```shell
$ kubectl get rc kubia
NAME    DESIRED   CURRENT   READY   AGE
kubia   5         5         3       62m
```

```shell
$ kubectl get pods --show-labels
NAME          READY   STATUS              RESTARTS   AGE   LABELS
kubia-2f95m   0/1     ContainerCreating   0          4s    app=kubia,rel=beta
kubia-j8tth   1/1     Running             0          62m   app=kubia
kubia-rjfqq   1/1     Running             0          44m   app=kubia
kubia-wft2k   1/1     Running             0          11m   app=kubia,rel=beta
kubia-wnmp5   0/1     ContainerCreating   0          4s    app=kubia,rel=beta
```

缩容
```shell
$ kubectl scale rc kubia --replicas=2
replicationcontroller/kubia scaled
```

```shell
$ kubectl get rc kubia
NAME    DESIRED   CURRENT   READY   AGE
kubia   2         2         2       68m
```

```shell
$ kubectl get pods --show-labels
NAME          READY   STATUS        RESTARTS   AGE     LABELS
kubia-2f95m   1/1     Terminating   0          4m42s   app=kubia,rel=beta
kubia-j8tth   1/1     Running       0          67m     app=kubia
kubia-rjfqq   1/1     Running       0          49m     app=kubia
kubia-wft2k   1/1     Terminating   0          16m     app=kubia,rel=beta
kubia-wnmp5   1/1     Terminating   0          4m42s   app=kubia,rel=beta
```

### 删除 ReplicationController 对象
ReplicationController 管理的 Pod 对象也会被删除。
```shell
$ kubectl delete rc kubia
replicationcontroller "kubia" deleted
```

Pod kubia-b42sb 是之前移出 ReplicationController 管理的，需要手动删除。
```shell
$ kubectl get pods
NAME          READY   STATUS        RESTARTS   AGE
kubia-b42sb   1/1     Running       0          75m
kubia-j8tth   1/1     Terminating   0          83m
kubia-rjfqq   1/1     Terminating   0          65m
```

```shell
$ kubectl delete pod kubia-b42sb
pod "kubia-b42sb" deleted
```

使用 ```--cascade=false``` 删除 ReplicationController 对象时，可以不删除管理的 Pod 对象。
```shell
$ kubectl delete rc kubia --cascade=false
replicationcontroller "kubia" deleted
```
```shell
$ kubectl get pods
NAME          READY   STATUS    RESTARTS   AGE
kubia-dg7kd   1/1     Running   0          4m3s
kubia-q7dfr   1/1     Running   0          4m3s
```

## ReplicaSet
ReplicaSet 是新一代的 ReplicationController，增强了 Pod 选择器的表达能力。

### 编写 ReplicaSet 的YAML文件（kubia-rs.yaml）
```yaml
apiVersion: apps/v1
kind: ReplicaSet
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
* apps 后续 Kubernetes 版本中引入的其它资源，被分为几个API组。在核心API组中不需要在 apiVersion 中指定。如果不知道如何写，可以通过 kubectl explain rs 来查看。
* matchLabels 可以达到 ReplicationController 中标签选择器一样的效果。

### 创建 ReplicaSet 对象
```shell
$ kubectl apply -f kubia-rs.yaml 
replicaset.apps/kubia created
```
```shell
$ kubectl get all
NAME              READY   STATUS    RESTARTS   AGE
pod/kubia-dg7kd   1/1     Running   0          18m
pod/kubia-q7dfr   1/1     Running   0          18m

NAME                    DESIRED   CURRENT   READY   AGE
replicaset.apps/kubia   2         2         2       22s
```

这里可以看到之前没有删除的 Pod 对象被 ReplicaSet 管理起来了，因为使用的是同样的标签。

### 更富表达能力的标签选择器 matchExpressions
* In: 标签值必须与 values 中的一个匹配。
* NotIn: 标签值与 values 中的任何一个都不匹配。
* Exists: pod 必须包含一个指定的标签名，不应指定 values 属性。
* DoesNotExists: pod 不包含指定的标签名，不应指定 values 属性。

matchExpressions 可以指定多个表达式，也可以同时使用 matchLabels 和 matchExpressions。

下面使用 matchExpressions 重新改写 ReplicaSet 的 YAML 配置
```yaml
apiVersion: apps/v1
kind: ReplicaSet
metadata:
  name: kubia
spec:
  selector:
    matchExpressions:
      - key: app
        operator: In
        values:
          - kubia
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
