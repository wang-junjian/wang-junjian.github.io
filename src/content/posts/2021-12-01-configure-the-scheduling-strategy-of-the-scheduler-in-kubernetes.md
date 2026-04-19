---
layout: single
title:  "Kubernetes中配置调度器"
date: 2021-12-01 00:00:00 +0800
categories: Kubernetes
tags: [kubectl, events, Priority, Scheduler, grep]
---

> 我们遇到一个场景，压榨出每一台节点的性能，需要优先调度到资源（CPU、Memory）使用最多的节点上。

## 了解默认调度
现有的通用调度程序是平台默认提供的调度程序引擎，它可通过三步操作来选择托管 pod 的节点：
### 过滤节点
根据指定的约束或要求过滤可用的节点。这可以通过名为predicates的过滤函数列表筛选每个节点来完成。
### 排列过滤后节点列表的优先顺序
实现方式是让每个节点通过一系列优先级函数，以为其分配从 0 到 10 的一个分数。0 代表不适合的节点，10 则代表最适合托管该 pod。调度程序配置还可以为每个优先级函数使用简单的权重（正数值）。每个优先级函数提供的节点分数乘以权重（大多数优先级的默认权重为 1），然后将每个节点从所有优先级获得的分数相加。管理员可以使用这个权重属性，为一些优先级赋予更高的重要性。
### 选择最适合的节点
节点按照分数排序，系统选择分数最高的节点来托管该 pod。如果多个节点的分数相同，则随机选择其中一个。

## 配置调度策略
### 编写调度策略文件，配置优先级。
配置参与打分项及权重。这里使用了 MostRequestedPriority，优先使用占用 CPU 和 Memory 多的节点。
```shell
sudo vim /etc/kubernetes/scheduler-policy-config.json
```
```yaml
{
  "kind": "Policy",
  "apiVersion": "v1",
  "priorities" : [
    {"name" : "MostRequestedPriority", "weight" : 1}
  ]
}
```
- [优先级](https://kubernetes.io/zh/docs/reference/scheduling/policies/#priorities)
  * MostRequestedPriority 优先选择具有最多所请求资源的节点。它计算节点上调度的 pod 所请求的内存与 CPU 百分比，并根据请求量对容量的平均占比的最大值来排列优先级。
    - weight 非零正数
  * LeastRequestedPriority 优先选择请求资源较少的节点。它计算节点上调度的 pod 所请求的内存和 CPU 百分比，并优先选择可用/剩余容量最高的节点。
  * BalancedResourceAllocation 优先选择资源使用率均衡的节点。它以占容量比形式计算 CPU 和内存已使用量的差值，并基于两个指标相互接近的程度来优先选择节点。这应该始终与 LeastRequestedPriority 一同使用。
  
### 在 kube-scheduler.yaml 文件中增加调度策略的配置文件
```shell
sudo vim /etc/kubernetes/manifests/kube-scheduler.yaml
```
```yaml
apiVersion: v1
kind: Pod
metadata:
  labels:
    component: kube-scheduler
    tier: control-plane
  name: kube-scheduler
  namespace: kube-system
spec:
  containers:
  - command:
    - kube-scheduler
    ......
    - --policy-config-file=/etc/kubernetes/scheduler-policy-config.json
    ......
```
**修改了 kube-scheduler.yaml 文件后，kube-scheduler 会自动加载修改后的配置**

## 验证
### 监控集群事件（需要新开一个窗口）
```shell
sudo kubectl get events --watch
```
执行下面的部署 Pod 命令后，就可以实时地观察如下的调度事件。
```
LAST SEEN   TYPE      REASON           OBJECT           MESSAGE
<unknown>   Normal    Scheduled        pod/pod1         Successfully assigned default/pod1 to k8s-cpu2
4m25s       Normal    Pulling          pod/pod1         Pulling image "busybox"
4m24s       Normal    Pulled           pod/pod1         Successfully pulled image "busybox"
4m24s       Normal    Created          pod/pod1         Created container main
4m23s       Normal    Started          pod/pod1         Started container main
<unknown>   Normal    Scheduled        pod/pod11        Successfully assigned default/pod11 to k8s-cpu2
......
<unknown>   Normal    Scheduled        pod/pod12        Successfully assigned default/pod12 to k8s-cpu2
......
<unknown>   Normal    Scheduled        pod/pod13        Successfully assigned default/pod13 to k8s-cpu2
......
```

### 编辑 Pod
使用下面的 Pod 模板编辑多个 yaml 文件来进行测试，每个 name 文件需要不同，也可以修改 cpu 和 memory 的值。
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pod1
spec:
  containers:
  - image: busybox
    command: ['dd', 'if=/dev/zero', 'of=/dev/null']
    name: main
    resources:
      limits:
        cpu: 2
        memory: 10Gi
```

### 部署 Pod
```shell
sudo kubectl apply -f pod1.yaml
......
```

### 查看集群中所有节点的资源使用情况
```shell
sudo kubectl describe nodes | grep -A6 Allocated
```
```
Allocated resources:
  (Total limits may be over 100 percent, i.e., overcommitted.)
  Resource           Requests    Limits
  --------           --------    ------
  cpu                1250m (3%)  2 (5%)
  memory             2Gi (0%)    4Gi (1%)
  ephemeral-storage  0 (0%)      0 (0%)
--
Allocated resources:
  (Total limits may be over 100 percent, i.e., overcommitted.)
  Resource           Requests       Limits
  --------           --------       ------
  cpu                16450m (41%)   28 (70%)
  memory             58458Mi (15%)  65Gi (17%)
  ephemeral-storage  0 (0%)         0 (0%)
--
Allocated resources:
  (Total limits may be over 100 percent, i.e., overcommitted.)
  Resource              Requests      Limits
  --------              --------      ------
  cpu                   11250m (17%)  12 (18%)
  memory                19756Mi (7%)  21804Mi (8%)
  ephemeral-storage     0 (0%)        0 (0%)
--
Allocated resources:
  (Total limits may be over 100 percent, i.e., overcommitted.)
  Resource           Requests    Limits
  --------           --------    ------
  cpu                1100m (6%)  500m (3%)
  memory             240Mi (0%)  2840Mi (4%)
  ephemeral-storage  0 (0%)      0 (0%)
```

## 参考资料
* [调度策略](https://kubernetes.io/zh/docs/reference/scheduling/policies/)
* [调度器配置](https://kubernetes.io/zh/docs/reference/scheduling/config/)
* [2.2. 配置默认调度程序以控制 POD 放置](https://access.redhat.com/documentation/zh-cn/openshift_container_platform/4.2/html/nodes/nodes-scheduler-default)
* [kube-scheduler-configuration.yaml](https://gist.github.com/everpeace/3438a70b14cfd727b991541bceac5fcd)
* [scheduler-policy-config.json](https://github.com/kubernetes/kubernetes/blob/release-1.5/examples/scheduler-policy-config.json)
* [kubernetes/pkg/scheduler/algorithm/priorities](https://github.com/kubernetes/kubernetes/blob/v1.11.1/pkg/scheduler/algorithm/priorities/)
* [How to change weight of priorities in Kubernetes Scheduler?](https://stackoverflow.com/questions/57186222/how-to-change-weight-of-priorities-in-kubernetes-scheduler)
* [Troubleshoot Clusters](https://kubernetes.io/docs/tasks/debug-application-cluster/debug-cluster/)
* [kube-controller-manager is not logging details](https://stackoverflow.com/questions/65049488/kube-controller-manager-is-not-logging-details)
* [Checking kubernetes pod CPU and memory](https://stackoverflow.com/questions/54531646/checking-kubernetes-pod-cpu-and-memory)
