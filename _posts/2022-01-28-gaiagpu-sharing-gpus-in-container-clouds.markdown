---
layout: post
title:  "GaiaGPU: 在容器云中共享GPU"
date:   2022-01-28 00:00:00 +0800
categories: Kubernetes
tags: [GPU, CUDA, git, GitHub, ResourceQuota, port-forward, Dockerfile, kube-scheduler]
---

> 容器技术由于其轻量级和可伸缩的优势而被广泛使用。GPU也因为其强大的并行计算能力被用于应用程序加速。在云计算环境下，容器可能需要一块或者多块GPU计算卡来满足应程序的资源需求，但另一方面，容器独占GPU计算卡常常会带来资源利用率低的问题。因此，对于云计算资源提供商而言，如何解决在多个容器之间共享GPU计算卡是一个很有吸引力的问题。本文中我们提出了一种称为GaiaGPU的方法，用于在容器间共享GPU存储和GPU的计算资源。GaiaGPU会将物理GPU计算卡分割为多个虚拟GPU并且将虚拟GPU按需分配给容器。同时我们采用了弹性资源分配和动态资源分配的方法来提高资源利用率。实验结果表明GaiaGPU平均仅带来1.015%的性能损耗并且能够高效的为容器分配和隔离GPU资源。

## 编译 GaiaGPU 服务
### 配置 git 加速
```shell
$ git config --global url."https://github.com.cnpmjs.org".insteadOf "https://github.com"

$ vim /etc/profile
export GOPROXY=https://goproxy.cn,direct
export GO111MODULE=on
$ source /etc/profile
```

### [vCUDA Controller](https://github.com/tkestack/vcuda-controller)
```shell
$ git clone https://github.com/tkestack/vcuda-controller.git

$ cd vcuda-controller
$ vim Dockerfile
FROM nvidia/cuda:11.4.0-devel-ubuntu20.04 as build
ENV DEBIAN_FRONTEND=noninteractive

$ IMAGE_FILE=wangjunjian/vcuda:latest ./build-img.sh
```

### [GPU Manager](https://github.com/tkestack/gpu-manager)
#### 安装 CUDA Toolkit
```shell
wget https://developer.download.nvidia.com/compute/cuda/11.5.1/local_installers/cuda_11.5.1_495.29.05_linux.run
sudo sh cuda_11.5.1_495.29.05_linux.run
```

#### 配置环境变量
```shell
$ sudo vim /etc/profile
PATH=$PATH:/usr/local/cuda-11.5/bin
LD_LIBRARY_PATH=$LD_LIBRARY_PATH:/usr/local/cuda-11.5/lib64
$ source /etc/profile
```

#### 编译工程
```shell
$ sudo apt install golang
$ git clone https://github.com/tkestack/gpu-manager.git

$ gpu-manager
$ vim build/Dockerfile
ENV GOPROXY=https://goproxy.cn,direct
ENV GO111MODULE=on

$ vim hack/build.sh
  readonly local base_img=${BASE_IMG:-"wangjunjian/vcuda:latest"}

$ vim hack/common.sh
readonly IMAGE_FILE=${IMAGE_FILE:-"wangjunjian/gpu-manager"}

$ echo "latest">VERSION

$ make img
```

### [GPU Admission](https://github.com/tkestack/gpu-admission)
```shell
$ git clone https://github.com/tkestack/gpu-admission.git

$ gpu-admission
$ vim Dockerfile
ENV GOPROXY=https://goproxy.cn,direct
ENV GO111MODULE=on

$ IMAGE=wangjunjian/gpu-admission:latest make img
```

## 部署 GaiaGPU 服务
### GPU Manager
#### 创建 service account 和 clustercole
```shell
kubectl create sa gpu-manager -n kube-system
kubectl create clusterrolebinding gpu-manager-role --clusterrole=cluster-admin --serviceaccount=kube-system:gpu-manager
```

#### 给 GPU 节点打标签
```shell
kubectl label node gpu1 nvidia-device-enable=enable
```

#### 部署 GPU Manager
```shell
wget https://raw.githubusercontent.com/tkestack/gpu-manager/master/gpu-manager.yaml
sed -i 's/tkestack\/gpu-manager:1\.0\.3/wangjunjian\/gpu-manager:latest/g' gpu-manager.yaml
kubectl apply -f gpu-manager.yaml
```

部署指标的服务
```shell
kubectl apply -f  gpu-manager-svc.yaml
```

### GPU Admission
#### 在控制平面创建 gpu-admission.yaml 文件
```shell
sudo vim /etc/kubernetes/manifests/gpu-admission.yaml
```
```yaml
apiVersion: v1
kind: Pod
metadata:
  creationTimestamp: null
  labels:
    component: gpu-admission
    tier: control-plane
  name: gpu-admission
  namespace: kube-system
spec:
  containers:
  - command:
    - /usr/bin/gpu-admission
    - --address=0.0.0.0:3456
    - --logtostderr=true
    - --kubeconfig=/etc/kubernetes/scheduler.conf
    image: wangjunjian/gpu-admission:latest
    imagePullPolicy: IfNotPresent
    name: gpu-admission
    resources:
      requests:
        cpu: 100m
    volumeMounts:
    - mountPath: /etc/kubernetes/scheduler.conf
      name: kubeconfig
      readOnly: true
  hostNetwork: true
  priorityClassName: system-node-critical
  volumes:
  - hostPath:
      path: /etc/kubernetes/scheduler.conf
      type: FileOrCreate
    name: kubeconfig
status: {}
```

#### 编写 GPU 调度策略文件
```shell
sudo vim /etc/kubernetes/scheduler-policy-config.json
```
```json
{
    "kind": "Policy",
    "apiVersion": "v1",
    "predicates": [
        {
            "name": "PodFitsHostPorts"
        },
        {
            "name": "PodFitsResources"
        },
        {
            "name": "NoDiskConflict"
        },
        {
            "name": "MatchNodeSelector"
        },
        {
            "name": "HostName"
        }
    ],
    "extenders": [
        {
            "urlPrefix": "http://172.16.33.157:3456/scheduler",
            "apiVersion": "v1beta1",
            "filterVerb": "predicates",
            "enableHttps": false,
            "nodeCacheCapable": false
        }
    ],
    "hardPodAffinitySymmetricWeight": 10,
    "alwaysCheckAllPredicates": false
}
```

#### 配置控制平台的 kube-scheduler.yaml
```shell
sudo vim /etc/kubernetes/manifests/kube-scheduler.yaml
```
```yaml
apiVersion: v1
kind: Pod
metadata:
  creationTimestamp: null
  labels:
    component: kube-scheduler
    tier: control-plane
  name: kube-scheduler
  namespace: kube-system
spec:
  containers:
  - command:
    - kube-scheduler
    - --authentication-kubeconfig=/etc/kubernetes/scheduler.conf
    - --authorization-kubeconfig=/etc/kubernetes/scheduler.conf
    - --bind-address=127.0.0.1
    - --kubeconfig=/etc/kubernetes/scheduler.conf
    - --leader-elect=true
    - --policy-config-file=/etc/kubernetes/scheduler-policy-config.json
    - --use-legacy-policy-config=true
    - --port=0
    image: registry.aliyuncs.com/google_containers/kube-scheduler:v1.21.5
    imagePullPolicy: IfNotPresent
    livenessProbe:
      failureThreshold: 8
      httpGet:
        host: 127.0.0.1
        path: /healthz
        port: 10259
        scheme: HTTPS
      initialDelaySeconds: 10
      periodSeconds: 10
      timeoutSeconds: 15
    name: kube-scheduler
    resources:
      requests:
        cpu: 100m
    startupProbe:
      failureThreshold: 24
      httpGet:
        host: 127.0.0.1
        path: /healthz
        port: 10259
        scheme: HTTPS
      initialDelaySeconds: 10
      periodSeconds: 10
      timeoutSeconds: 15
    volumeMounts:
    - mountPath: /etc/kubernetes/scheduler.conf
      name: kubeconfig
      readOnly: true
    - mountPath: /etc/kubernetes/scheduler-policy-config.json
      name: gpu-scheduler-policy
      readOnly: true
  hostNetwork: true
  priorityClassName: system-node-critical
  volumes:
  - hostPath:
      path: /etc/kubernetes/scheduler.conf
      type: FileOrCreate
    name: kubeconfig
  - hostPath:
      path: /etc/kubernetes/scheduler-policy-config.json
      type: FileOrCreate
    name: gpu-scheduler-policy
status: {}
```
* --policy-config-file=/etc/kubernetes/scheduler-policy-config.json
* --use-legacy-policy-config=true

#### 编辑 clusterroles system:kube-scheduler
```shell
kubectl edit clusterroles system:kube-scheduler
```
```yaml
 - apiGroups:
  - ""
  resources:
  - pods
  verbs:
  - delete
  - get
  - patch
  - list
  - watch
```
* 增加 ```- patch```

#### 查看节点信息
```shell
kubectl describe node gpu1
```
```
Name:               gpu1
Labels:             beta.kubernetes.io/arch=amd64
                    nvidia-device-enable=enable
Capacity:
  cpu:                       64
  ephemeral-storage:         575261800Ki
  hugepages-1Gi:             0
  hugepages-2Mi:             0
  memory:                    263781448Ki
  pods:                      110
  tencent.com/vcuda-core:    400
  tencent.com/vcuda-memory:  236
Allocatable:
  cpu:                       64
  ephemeral-storage:         530161274003
  hugepages-1Gi:             0
  hugepages-2Mi:             0
  memory:                    263679048Ki
  pods:                      110
  tencent.com/vcuda-core:    400
  tencent.com/vcuda-memory:  236
```
* tencent.com/vcuda-core 1张GPU卡等于100，400代表4张GPU卡。
* tencent.com/vcuda-memory 1个单位代表256Mi，一张GPU卡的计算方法是：16G(16×1000×1000×1000)/256M(256×1024×1024)=59，4×59＝236。

## 资源配额
### 创建 ResourceQuota
```shell
vim resource-quota.yaml
```
```yaml
apiVersion: v1
kind: ResourceQuota
metadata:
  name: resource-quota
spec:
  hard:
    requests.cpu: 100m
    requests.memory: 100Mi
    requests.tencent.com/vcuda-core: 100
    requests.tencent.com/vcuda-memory: 59
    limits.cpu: 10
    limits.memory: 10Gi
    limits.tencent.com/vcuda-core: 100
    limits.tencent.com/vcuda-memory: 59
```
```shell
kubectl apply -f resource-quota.yaml
```

### 查看资源配额的描述
```shell
kubectl describe resourcequotas resource-quota
```
```
Name:                              resource-quota
Namespace:                         default
Resource                           Used  Hard
--------                           ----  ----
limits.cpu                         0     10
limits.memory                      0     10Gi
limits.tencent.com/vcuda-core      0     100
limits.tencent.com/vcuda-memory    0     59
requests.cpu                       0     100m
requests.memory                    0     100Mi
requests.tencent.com/vcuda-core    0     100
requests.tencent.com/vcuda-memory  0     59
```

## 部署 GPU 应用
### 编写 GPU 应用的 yaml 文件
```shell
vim gpu-quota.yaml
```
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: vcuda
  annotations:
    tencent.com/vcuda-core-limit: "10"
spec:
  restartPolicy: Never
  containers:
  - image: tensorflow/tensorflow:2.7.0-gpu
    name: tensorflow
    command: ["/bin/sh", "-c", "sleep 86400"]
    resources:
      requests:
        cpu: 100m
        memory: 100Mi
        tencent.com/vcuda-core: 10
        tencent.com/vcuda-memory: 4
      limits:
        cpu: 1
        memory: 1Gi
        tencent.com/vcuda-core: 10
        tencent.com/vcuda-memory: 4
```
* requests 的 tencent.com/vcuda-core 必须等于 limits 的 tencent.com/vcuda-core
* requests 的 tencent.com/vcuda-memory 必须等于 limits 的 tencent.com/vcuda-memory

```shell
kubectl apply -f gpu-quota.yaml
```

### 查看资源配额的使用
```shell
kubectl describe resourcequotas resource-quota
```
```shell
Name:                              resource-quota
Namespace:                         default
Resource                           Used   Hard
--------                           ----   ----
limits.cpu                         1      10
limits.memory                      1Gi    10Gi
limits.tencent.com/vcuda-core      0      100
limits.tencent.com/vcuda-memory    0      59
requests.cpu                       100m   100m
requests.memory                    100Mi  100Mi
requests.tencent.com/vcuda-core    10     100
requests.tencent.com/vcuda-memory  4      59
```

### GPU 的应用
#### GPU共享
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: vcuda20
  annotations:
    tencent.com/vcuda-core-limit: "20"
spec:
  restartPolicy: Never
  containers:
  - image: tensorflow/tensorflow:2.7.0-gpu
    name: tensorflow
    command: ["/bin/sh", "-c", "sleep 86400"]
    resources:
      requests:
        tencent.com/vcuda-core: 20
        tencent.com/vcuda-memory: 12
      limits:
        tencent.com/vcuda-core: 20
        tencent.com/vcuda-memory: 12
```

#### GPU单卡
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: vcuda100
  annotations:
    tencent.com/vcuda-core-limit: "100"
spec:
  restartPolicy: Never
  containers:
  - image: tensorflow/tensorflow:2.7.0-gpu
    name: tensorflow
    command: ["/bin/sh", "-c", "sleep 86400"]
    resources:
      requests:
        tencent.com/vcuda-core: 100
        tencent.com/vcuda-memory: 59
      limits:
        tencent.com/vcuda-core: 100
        tencent.com/vcuda-memory: 59
```

#### GPU多卡
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: vcuda200
  annotations:
    tencent.com/vcuda-core-limit: "200"
spec:
  restartPolicy: Never
  containers:
  - image: tensorflow/tensorflow:2.7.0-gpu
    name: tensorflow
    command: ["/bin/sh", "-c", "sleep 86400"]
    resources:
      requests:
        tencent.com/vcuda-core: 200
        tencent.com/vcuda-memory: 128
      limits:
        tencent.com/vcuda-core: 200
        tencent.com/vcuda-memory: 128
```

## 指标服务
### 部署指标服务
```shell
cd gpu-manager
kubectl apply -f  gpu-manager-svc.yaml
```

### 查看指标服务的IP和端口
```shell
$ kubectl -n kube-system get endpoints gpu-manager-metric
NAME                 ENDPOINTS        AGE
gpu-manager-metric   10.36.0.0:5678   15h
```

### 调试（获取指标数据）

#### 本地网络端口转发到 Pod
```shell
kubectl port-forward svc/gpu-manager-metric -n kube-system 5678:5678
```

打开一个新的终端，获取 GPU 指标数据的统计。
```shell
curl http://127.0.0.1:5678/metric
```
```
# HELP container_gpu_memory_total gpu memory usage in MiB
# TYPE container_gpu_memory_total gauge
container_gpu_memory_total{container_name="tensorflow",gpu_memory="gpu0",namespace="default",node="gpu1",pod_name="vcuda"} 0
container_gpu_memory_total{container_name="tensorflow",gpu_memory="total",namespace="default",node="gpu1",pod_name="vcuda"} 0
# HELP container_gpu_utilization gpu utilization
# TYPE container_gpu_utilization gauge
container_gpu_utilization{container_name="tensorflow",gpu="gpu0",namespace="default",node="gpu1",pod_name="vcuda"} 0
container_gpu_utilization{container_name="tensorflow",gpu="total",namespace="default",node="gpu1",pod_name="vcuda"} 0
# HELP container_request_gpu_memory request of gpu memory in MiB
# TYPE container_request_gpu_memory gauge
container_request_gpu_memory{container_name="tensorflow",namespace="default",node="gpu1",pod_name="vcuda",req_of_gpu_memory="total"} 1024
# HELP container_request_gpu_utilization request of gpu utilization
# TYPE container_request_gpu_utilization gauge
container_request_gpu_utilization{container_name="tensorflow",namespace="default",node="gpu1",pod_name="vcuda",req_of_gpu="total"} 0.10000000149011612
```

#### 直接在容器内部访问
```shell
kubectl exec -it vcuda -- curl http://10.36.0.0:5678/metric
```

## 资源配额
### 设置资源配额
```shell
vim resource-quota.yaml
```
```yaml
apiVersion: v1
kind: ResourceQuota
metadata:
  name: resource-quota
spec:
  hard:
    requests.cpu: 100m
    requests.memory: 100Mi
    requests.tencent.com/vcuda-core: 100
    requests.tencent.com/vcuda-memory: 59
    limits.cpu: 10
    limits.memory: 10Gi
    limits.tencent.com/vcuda-core: 100
    limits.tencent.com/vcuda-memory: 59
```

在当前名字空间中部署GPU资源的配额
```shell
kubectl apply -f resource-quota.yaml
```

### 部署应用，将会受到上面设置资源配额的限制。

### 查看资源配额使用详情
```shell
kubectl describe resourcequotas resource-quota
```
```
Name:                              resource-quota
Namespace:                         default
Resource                           Used   Hard
--------                           ----   ----
limits.cpu                         1      10
limits.memory                      1Gi    10Gi
limits.tencent.com/vcuda-core      0      100
limits.tencent.com/vcuda-memory    0      59
requests.cpu                       100m   100m
requests.memory                    100Mi  100Mi
requests.tencent.com/vcuda-core    10     100
requests.tencent.com/vcuda-memory  4      59
```

## 参考资料
* [GaiaGPU: Sharing GPUs in Container Clouds](https://ieeexplore.ieee.org/abstract/document/8672318)
