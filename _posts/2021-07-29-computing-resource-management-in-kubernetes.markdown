---
layout: post
title:  "Kubernetes中的计算资源管理"
date:   2021-07-29 00:00:00 +0800
categories: Kubernetes
tags: [kubectl, exec, LimitRange, ResourceQuota]
---

## 查看节点资源总量
```shell
$ kubectl describe nodes ln1

Name:               ln1
...
Capacity:
  cpu:                40
  ephemeral-storage:  574345384Ki
  hugepages-1Gi:      0
  hugepages-2Mi:      0
  memory:             264015508Ki
  pods:               110
Allocatable:
  cpu:                40
  ephemeral-storage:  529316705019
  hugepages-1Gi:      0
  hugepages-2Mi:      0
  memory:             263913108Ki
  pods:               110
```
* Capacity, 节点的资源总量
* Allocatable, 可分配给 Pod 的资源量

## Pod 中的容器申请资源
### 定义 Pod，通过容器指定 CPU 和内存的资源请求量
```yaml
#requests-pod.yaml
apiVersion: v1
kind: Pod
metadata:
  name: requests-pod
spec:
  containers:
  - image: busybox
    command: ['dd', 'if=/dev/zero', 'of=/dev/null']
    name: main
    resources:
      requests:
        cpu: 200m
        memory: 10Mi
```
* requests, 指定资源需求的最小值
  - cpu, 200m(毫核)相当于1/5个核，1个核是1000m，不带单位就是申请核的个数。
  - memory, 10MB
```
  1024 (Ki | Mi | Gi | Ti | Pi | Ei)
  1000 (k  | M  | G  | T  | P  | E)
```

### 查看容器内 CPU 和内存的使用情况
部署 Pod
```shell
kubectl apply -f requests-pod.yaml
```

容器内运行 top
```shell
kubectl exec -it requests-pod top
```
```
Mem: 369767748K used, 26208028K free, 51000K shrd, 3765588K buff, 294978160K cached
CPU:  3.1% usr  1.5% sys  0.0% nic 95.2% idle  0.0% io  0.0% irq  0.0% sirq
Load average: 1.44 1.65 1.66 4/6602 18
  PID  PPID USER     STAT   VSZ %VSZ CPU %CPU COMMAND
    1     0 root     R     1308  0.0  27  2.5 dd if /dev/zero of /dev/null
   13     0 root     R     1324  0.0  38  0.0 top
```
★ 在容器内看到的 CPU 和内存是节点的。

top 命令显示占用了 2.5% CPU，对于 40 核的系统来说显然是占用了一个核。requests 不会限制资源的使用数量，因为是单线程，最多也就能用满一个核。

### 创建一个不能调度的 Pod
修改 cpu: 200m 为 cpu: 200，重新部署后查看。
```shell
$ kubectl describe pod requests-pod
Name:         requests-pod
...
Status:  Pending
Conditions:
  Type           Status
  PodScheduled   False 
Events:
  Type     Reason            Age        From               Message
  ----     ------            ----       ----               -------
  Warning  FailedScheduling  <unknown>  default-scheduler  0/5 nodes are available: 5 Insufficient cpu.
  Warning  FailedScheduling  <unknown>  default-scheduler  0/5 nodes are available: 5 Insufficient cpu.
```

## Pod 中的容器限制资源
### 定义 Pod，通过容器指定 CPU 和内存的资源限制量
```yaml
#limits-pod.yaml
apiVersion: v1
kind: Pod
metadata:
  name: limits-pod
spec:
  containers:
  - image: busybox
    command: ['dd', 'if=/dev/zero', 'of=/dev/null']
    name: main
    resources:
      limits:
        cpu: 500m
        memory: 20Mi
```
* limits, 指定资源需求的最大值

### 查看容器内 CPU 和内存的使用情况
部署 Pod
```shell
kubectl apply -f limits-pod.yaml
```

容器内运行 top
```shell
kubectl exec -it limits-pod top
```
```shell
Mem: 370581688K used, 25394088K free, 50976K shrd, 3774664K buff, 292993444K cached
CPU:  1.3% usr  0.7% sys  0.0% nic 97.9% idle  0.0% io  0.0% irq  0.0% sirq
Load average: 0.48 0.64 0.63 3/6356 13
  PID  PPID USER     STAT   VSZ %VSZ CPU %CPU COMMAND
    1     0 root     R     1308  0.0  38  1.2 dd if /dev/zero of /dev/null
    7     0 root     R     1316  0.0  20  0.0 top
```

★ 这里因为没有设置 requests，将默认设置与 limits 相同的值。
```shell
$ kubectl describe pod limits-pod
Name:         limits-pod
...
Containers:
  main:
    Limits:
      cpu:     500m
      memory:  20Mi
    Requests:
      cpu:        500m
      memory:     20Mi
```

## Pod 的 QoS 等级
QoS 等级来源于 Pod 所包含的容器的资源 requests 和 limits 的配置。

### QoS 等级
* BestEffort（优先级最低）
  - requests 和 limits 都没有设置。
* Burstable
  - 只要不是其它两个等级。
* Guaranteed（优先级最高）
  - requests == limits；可以只设置 limits。

### 内存不足时哪个 Pod 优先被杀死
在超卖场景中，系统通过 QoS 等级来决定优先杀掉哪个 Pod。当内存不足时，BestEffort 等级的 Pod 首先被杀死，其次是 Burstable 等级的 Pod，最后是 Guaranteed 等级的 Pod。Guaranteed 等级的 Pod 只有在需要内在时才会被杀掉。如果是相同的 Qos 等级的 Pod，系统会通过比较所有运行进程的 OOM(OutOfMemory) 分数来决定要杀死哪个。OOM 分数由两个参数计算得出：Pod QoS 等级和使用内存占申请内存的比例。相同 Pod QoS 等级，使用内存占申请内存的比例高的优先杀死。

### 查看 Pod 的 QoS 等级
```shell
$ kubectl describe pod kubia-manual 
Name:         kubia-manual
...
QoS Class:       BestEffort
```

```shell
$ kubectl describe pod limits-pod 
Name:         limits-pod
...
QoS Class:       Guaranteed
```

## LimitRange
* 给每个名字空间指定容器配置的每种资源的最小和最大限额。
* 没有显示指定资源的　requests 和 limits 时为容器设置默认值。

### 创建 LimitRange 对象
```yaml
#limit-range.yaml
apiVersion: v1
kind: LimitRange
metadata:
  name: limit-range
spec:
  limits:
  - type: Pod
    min:
      cpu: 50m
      memory: 5Mi
    max:
      cpu: 1
      memory: 1Gi
  - type: Container
    defaultRequest:
      cpu: 100m
      memory: 10Mi
    default:
      cpu: 200m
      memory: 100Mi
    min:
      cpu: 50m
      memory: 5Mi
    max:
      cpu: 1
      memory: 1Gi
    maxLimitRequestRatio:
      cpu: 4
      memory: 10
```

部署 LimitRange
```shell
kubectl apply -f limit-range.yaml
```

查看 limit-range 对象的描述
```shell
$ kubectl describe limitranges limit-range 
Name:       limit-range
Namespace:  kubia
Type        Resource  Min  Max  Default Request  Default Limit  Max Limit/Request Ratio
----        --------  ---  ---  ---------------  -------------  -----------------------
Pod         cpu       50m  1    -                -              -
Pod         memory    5Mi  1Gi  -                -              -
Container   cpu       50m  1    100m             200m           4
Container   memory    5Mi  1Gi  10Mi             100Mi          10
```

### 应用资源 requests 和 limits 的默认值
创建 Pod 对象
```shell
#kubia-manual.yaml
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

部署 Pod
```shell
kubectl apply -f kubia-manual.yaml
```

查看 Pod 对象的描述，可以看到容器 kubia 应用了 LimitRange 对象定义的默认值。
```shell
$ kubectl describe pod kubia-manual
Name:         kubia-manual
...
Containers:
  kubia:
    Limits:
      cpu:     200m
      memory:  100Mi
    Requests:
      cpu:        100m
      memory:     10Mi
```

### 应用资源 max 的限制
创建 Pod 对象
```shell
#kubia-manual-max.yaml
apiVersion: v1
kind: Pod
metadata:
  name: kubia-manual-max
spec:
  containers:
  - image: wangjunjian/kubia
    name: kubia
    ports:
    - containerPort: 8080
      protocol: TCP
    resources:
      requests:
        cpu: 2
```

部署 Pod
```shell
$ kubectl apply -f kubia-manual-max.yaml 
The Pod "kubia-manual-max" is invalid: spec.containers[0].resources.requests: Invalid value: "2": must be less than or equal to cpu limit
```

### maxLimitRequestRatio
创建 Pod 对象
```shell
#kubia-manual-max-limit-request-ratio.yaml
apiVersion: v1
kind: Pod
metadata:
  name: kubia-manual-max-limit-request-ratio
spec:
  containers:
  - image: wangjunjian/kubia
    name: kubia
    ports:
    - containerPort: 8080
      protocol: TCP
    resources:
      requests:
        cpu: 200m
      limits:
        cpu: 1
```

部署 Pod
```shell
$ kubectl apply -f kubia-manual-max-limit-request-ratio.yaml 
Error from server (Forbidden): error when creating "kubia-manual-max-limit-request-ratio.yaml": pods "kubia-manual-max-limit-request-ratio" is forbidden: cpu max limit to request ratio per Container is 4, but provided ratio is 5.000000
```

## ResourceQuota 限制名字空间中的可用资源总量
### 创建 ResourceQuota 对象
```yaml
#resource-quota.yaml
apiVersion: v1
kind: ResourceQuota
metadata:
  name: resource-quota
spec:
  hard:
    requests.cpu: 400m
    requests.memory: 200Mi
    limits.cpu: 600m
    limits.memory: 500Mi
```
* requests.cpu, 名字空间中所有 Pod 最多可申请的 CPU 数量为 400m
* requests.memory, 名字空间中所有 Pod 最多可申请的 Memory 数量为 200Mi
* limits.cpu, 名字空间中所有 Pod 最多可使用的 CPU 数量为 600m
* limits.memory, 名字空间中所有 Pod 最多可使用的 Memory 数量为 500Mi

部署 ResourceQuota
```shell
kubectl apply -f resource-quota.yaml
```

查看 ResourceQuota 对象的描述，可以看到资源配额的情况。
```shell
$ kubectl describe resourcequotas resource-quota 
Name:            resource-quota
Namespace:       kubia
Resource         Used   Hard
--------         ----   ----
limits.cpu       200m   600m
limits.memory    100Mi  500Mi
requests.cpu     100m   400m
requests.memory  10Mi   200Mi
```

### 超过名字空间中的可申请资源配额
```yaml
#kubia-manual-quota.yaml
apiVersion: v1
kind: Pod
metadata:
  name: kubia-manual-quota
spec:
  containers:
  - image: wangjunjian/kubia
    name: kubia
    ports:
    - containerPort: 8080
      protocol: TCP
    resources:
      requests:
        cpu: 500m
        memory: 400Mi
```

部署 Pod
```shell
$ kubectl apply -f kubia-manual-quota.yaml 
Error from server (Forbidden): error when creating "kubia-manual-quota.yaml": pods "kubia-manual-quota" is forbidden: exceeded quota: resource-quota, requested: requests.cpu=500m,requests.memory=400Mi, used: requests.cpu=0,requests.memory=0, limited: requests.cpu=400m,requests.memory=200Mi
```

### NVIDIA GPU 资源的使用
修改 resource-quota 对象，增加 nvidia.com/gpu 资源的请求与限制。
```yaml
#resource-quota.yaml
apiVersion: v1
kind: ResourceQuota
metadata:
  name: resource-quota
spec:
  hard:
    requests.cpu: 40
    requests.memory: 200Gi
    requests.nvidia.com/gpu: 2
    limits.cpu: 60
    limits.memory: 500Gi
    limits.nvidia.com/gpu: 2
```

创建 Pod 对象
```yaml
#request-gpu.yaml
apiVersion: v1
kind: Pod
metadata:
  name: request-gpu
spec:
  nodeSelector:
    node-type: "gpu"
  containers:
  - image: nvcr.io/nvidia/cuda:9.0-devel
    name: cuda
    command: ['sh', '-c',  'sleep 86400']
    resources:
      requests:
        cpu: 500m
        memory: 200Mi
        nvidia.com/gpu: 1
      limits:
        cpu: 1
        memory: 1Gi
        nvidia.com/gpu: 1
```

部署 Pod
```shell
kubectl apply -f request-gpu.yaml
```

查看资源配额使用情况
```shell
$ kubectl describe resourcequotas 
Name:                    resource-quota
Namespace:               kubia
Resource                 Used   Hard
--------                 ----   ----
limits.cpu               1      60
limits.memory            1Gi    500Gi
limits.nvidia.com/gpu    0      2
requests.cpu             500m   40
requests.memory          200Mi  200Gi
requests.nvidia.com/gpu  1      2
```

查看节点描述信息
```shell
$ kubectl describe node gpu1
Name:               gpu1
...
Allocated resources:
  (Total limits may be over 100 percent, i.e., overcommitted.)
  Resource           Requests    Limits
  --------           --------    ------
  cpu                520m (0%)   1 (1%)
  memory             200Mi (0%)  1Gi (0%)
  ephemeral-storage  0 (0%)      0 (0%)
  hugepages-1Gi      0 (0%)      0 (0%)
  hugepages-2Mi      0 (0%)      0 (0%)
  nvidia.com/gpu     1           1
```

### ResourceQuota 最好使用 LimitRange 配合
删除 LimitRange 对象
```shell
kubectl delete limitranges limit-range
```

部署 kubia-manual.yaml，因为定义的 Pod 中没有设置 requests 和 limits，如果创建了 LimitRange 对象后，会自动设置默认值。
```shell
$ kubectl apply -f kubia-manual.yaml 
Error from server (Forbidden): error when creating "kubia-manual.yaml": pods "kubia-manual" is forbidden: failed quota: resource-quota: must specify limits.cpu,limits.memory,requests.cpu,requests.memory
```

### 限制可创建对象的个数
```yaml
#objects-count.yaml
apiVersion: v1
kind: ResourceQuota
metadata:
  name: objects-count
spec:
  hard:
    pods: 10
    replicationcontrollers: 4
    secrets: 4
    configmaps: 4
    persistentvolumeclaims: 4
    services: 4
    services.loadbalancers: 1
    services.nodeports: 1
    ssd.storageclass.storage.k8s.io/persistentvolumeclaims: 1
```

## 参考资料
* [限制范围](https://kubernetes.io/zh/docs/concepts/policy/limit-range/)
* [资源配额](https://kubernetes.io/zh/docs/concepts/policy/resource-quotas/)
