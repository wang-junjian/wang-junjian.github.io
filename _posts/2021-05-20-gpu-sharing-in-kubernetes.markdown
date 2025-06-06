---
layout: single
title:  "Kubernetes中的GPU共享"
date:   2021-05-20 00:00:00 +0800
categories: Kubernetes
tags: [Nvidia, GPU, Docker, kubectl]
---

## 构建应用
### Scheduler Extender
```shell
git clone https://github.com/AliyunContainerService/gpushare-scheduler-extender.git && cd gpushare-scheduler-extender
docker build -t gouchicao/gpushare-scheduler-extender .
```

### Device Plugin
```shell
git clone https://github.com/AliyunContainerService/gpushare-device-plugin.git && cd gpushare-device-plugin
docker build -t gouchicao/gpushare-device-plugin .
```

### Kubectl Extension
```shell
wget https://github.com/AliyunContainerService/gpushare-device-plugin/releases/download/v0.3.0/kubectl-inspect-gpushare
```

## 安装
### 在控制平面中部署 GPU 共享调度程序扩展器
```shell
cd /etc/kubernetes
sudo wget https://raw.githubusercontent.com/AliyunContainerService/gpushare-scheduler-extender/master/config/scheduler-policy-config.json

mkdir ~/gpu-sharing
cd ~/gpu-sharing
wget https://raw.githubusercontent.com/AliyunContainerService/gpushare-scheduler-extender/master/config/gpushare-schd-extender.yaml
sed -i 's|registry.cn-hangzhou.aliyuncs.com/acs/k8s-gpushare-schd-extender:1.11-d170d8a|gouchicao/gpushare-scheduler-extender|g' gpushare-schd-extender.yaml
kubectl apply -f gpushare-schd-extender.yaml
```

### 配置调度程序策略
编辑 /etc/kubernetes/manifests/kube-scheduler.yaml 文件，使用 GPU 的调度策略 /etc/kubernetes/scheduler-policy-config.json 进行配置。
```shell
sudo vim /etc/kubernetes/manifests/kube-scheduler.yaml
```

1. 添加策略配置文件
```yaml
- --policy-config-file=/etc/kubernetes/scheduler-policy-config.json
```

2. 将卷挂载添加到Pod
```yaml
- mountPath: /etc/kubernetes/scheduler-policy-config.json
  name: scheduler-policy-config
  readOnly: true
```
```yaml
- hostPath:
      path: /etc/kubernetes/scheduler-policy-config.json
      type: FileOrCreate
  name: scheduler-policy-config
```

最终修改为
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
    image: k8s.gcr.io/kube-scheduler:v1.16.2
    imagePullPolicy: IfNotPresent
    livenessProbe:
      failureThreshold: 8
      httpGet:
        host: 127.0.0.1
        path: /healthz
        port: 10251
        scheme: HTTP
      initialDelaySeconds: 15
      timeoutSeconds: 15
    name: kube-scheduler
    resources:
      requests:
        cpu: 100m
    volumeMounts:
    - mountPath: /etc/kubernetes/scheduler.conf
      name: kubeconfig
      readOnly: true
    - mountPath: /etc/kubernetes/scheduler-policy-config.json
      name: scheduler-policy-config
      readOnly: true
  hostNetwork: true
  priorityClassName: system-cluster-critical
  volumes:
  - hostPath:
      path: /etc/kubernetes/scheduler.conf
      type: FileOrCreate
    name: kubeconfig
  - hostPath:
      path: /etc/kubernetes/scheduler-policy-config.json
      type: FileOrCreate
    name: scheduler-policy-config

status: {}
```

### 部署 Device Plugin

```shell
wget https://raw.githubusercontent.com/AliyunContainerService/gpushare-device-plugin/master/device-plugin-rbac.yaml
kubectl apply -f device-plugin-rbac.yaml
wget https://raw.githubusercontent.com/AliyunContainerService/gpushare-device-plugin/master/device-plugin-ds.yaml
sed -i 's|registry.cn-hangzhou.aliyuncs.com/acs/k8s-gpushare-plugin:v2-1.11-aff8a23|gouchicao/gpushare-device-plugin|g' device-plugin-ds.yaml
kubectl apply -f device-plugin-ds.yaml
```

### 将标签 gpushare 添加到需要 GPU 共享的节点
```shell
kubectl label node <target_node> gpushare=true
```
例如
```shell
kubectl label node k8s-gpu1 gpushare=true
```

### 安装 Kubectl extension
```shell
cd /usr/bin/
sudo wget https://github.com/AliyunContainerService/gpushare-device-plugin/releases/download/v0.3.0/kubectl-inspect-gpushare
sudo chmod u+x /usr/bin/kubectl-inspect-gpushare
```

## 使用
### 在应用中使用属性 aliyun.com/gpu-mem 申请显存
#### 申请 4G 显存
```yaml
apiVersion: apps/v1
kind: Deployment

metadata:
  name: binpack-4
  labels:
    app: binpack-4

spec:
  replicas: 1

  selector: # define how the deployment finds the pods it manages
    matchLabels:
      app: binpack-4

  template: # define the pods specifications
    metadata:
      labels:
        app: binpack-4

    spec:
      containers:
      - name: binpack-4
        image: cheyang/gpu-player:v2
        resources:
          limits:
            # GiB
            aliyun.com/gpu-mem: 4
```

#### 申请 6G 显存
```yaml
apiVersion: apps/v1
kind: Deployment

metadata:
  name: binpack-6
  labels:
    app: binpack-6

spec:
  replicas: 1

  selector: # define how the deployment finds the pods it manages
    matchLabels:
      app: binpack-6

  template: # define the pods specifications
    metadata:
      labels:
        app: binpack-6

    spec:
      containers:
      - name: binpack-6
        image: cheyang/gpu-player:v2
        resources:
          limits:
            # GiB
            aliyun.com/gpu-mem: 6
```

#### 申请 10G 显存
```yaml
apiVersion: apps/v1
kind: Deployment

metadata:
  name: binpack-10
  labels:
    app: binpack-10

spec:
  replicas: 1

  selector: # define how the deployment finds the pods it manages
    matchLabels:
      app: binpack-10

  template: # define the pods specifications
    metadata:
      labels:
        app: binpack-10

    spec:
      containers:
      - name: binpack-10
        image: cheyang/gpu-player:v2
        resources:
          limits:
            # GiB
            aliyun.com/gpu-mem: 10
```

### 部署应用
```shell
kubectl apply -f binpack-6G.yaml
kubectl apply -f binpack-10G.yaml
kubectl apply -f binpack-4G.yaml
```

### 查看 GPU 使用情况
```shell
kubectl inspect gpushare -d
```
```shell
NAME:       k8s-gpu1
IPADDRESS:  172.16.33.69

NAME                         NAMESPACE  GPU0(Allocated)  GPU1(Allocated)  GPU2(Allocated)  GPU3(Allocated)  
binpack-6-7d9f48946c-9strc   default    6                0                0                0                
binpack-10-6b5fcd9ddc-wzdzv  default    0                10               0                0                
binpack-4-5c857c579-5shjc    default    0                4                0                0                
Allocated :                  20 (35%)   
Total :                      56         
----------------------------------------------------------------------------------------------------------

Allocated/Total GPU Memory In Cluster:  20/56 (35%)
```

## 参考资料
* [GPU Sharing Scheduler Extender in Kubernetes](https://github.com/AliyunContainerService/gpushare-scheduler-extender)
* [GPU Sharing Scheduler Extender Installation guide](https://github.com/AliyunContainerService/gpushare-scheduler-extender/blob/master/docs/install.md)
* [GPU Sharing Scheduler Extender User Guide](https://github.com/AliyunContainerService/gpushare-scheduler-extender/blob/master/docs/userguide.md)
* [GPU Sharing Device Plugin in Kuberntes](https://github.com/AliyunContainerService/gpushare-device-plugin)
* [开源工具GPU Sharing：支持Kubernetes集群细粒度](https://developer.aliyun.com/article/690623)
* [Minimizing GPU Cost For Your Deep Learning Workload On Kubernetes](https://ucc.alicdn.com/download/首个普惠社区的平民化方案-GPU共享调度.pdf)
* [从零开始入门 K8s GPU 管理和 Device Plugin 工作机制](https://developer.aliyun.com/article/742566)
* [k8s中的GPU共享功能实现分析](https://blog.spider.im/post/gpu-share-in-k8s/)
* [如何在VMware開啟GPU passthrough給VM用](http://smcijohnny.blogspot.com/2015/04/vmwaregpu-passthroughvm.html)
* [NVIDIA device plugin for Kubernetes](https://github.com/NVIDIA/k8s-device-plugin/)
* [调度 GPUs](https://kubernetes.io/zh/docs/tasks/manage-gpus/scheduling-gpus/)
* [设备插件](https://kubernetes.io/zh/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/)
* [Install Kubernetes](https://docs.nvidia.com/datacenter/cloud-native/kubernetes/install-k8s.html)
* [Supporting Multi-Instance GPUs (MIG) in Kubernetes](https://github.com/NVIDIA/k8s-device-plugin/#deployment-via-helm)
* [Virtual GPU device plugin for inference workloads in Kubernetes](https://aws.amazon.com/cn/blogs/opensource/virtual-gpu-device-plugin-for-inference-workload-in-kubernetes/)
* [kubernetes 1.10 Failed to initialize NVML: could not load NVML library. #60](https://github.com/NVIDIA/k8s-device-plugin/issues/60)
* [污点和容忍度](https://kubernetes.io/zh/docs/concepts/scheduling-eviction/taint-and-toleration/)
* [Google Kubernetes Engine (GKE) 用节点污点控制调度](https://cloud.google.com/kubernetes-engine/docs/how-to/node-taints)
