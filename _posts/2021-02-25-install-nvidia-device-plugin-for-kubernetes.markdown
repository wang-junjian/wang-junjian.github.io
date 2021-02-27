---
layout: post
title:  "Install NVIDIA device plugin for Kubernetes"
date:   2021-02-25 00:00:00 +0800
categories: Kubernetes
tags: [Ubuntu, Helm, GPU, docker, nvidia-docker2, kubectl]
---

## 配置NVIDIA GPU节点的Docker
1. 增加```"default-runtime": "nvidia"```
```json
$ sudo vim /etc/docker/daemon.json
{
    "registry-mirrors": ["https://75oltije.mirror.aliyuncs.com"],
    "default-runtime": "nvidia",
    "runtimes": {
        "nvidia": {
            "path": "nvidia-container-runtime",
            "runtimeArgs": []
        }
    }
}
```

2. 重启服务
```shell
sudo systemctl restart docker
```

## 安装
1. 更新Helm仓库
```shell
helm repo add nvdp https://nvidia.github.io/k8s-device-plugin
helm repo update
```

2. 使用Helm安装
```shell
helm install --generate-name nvdp/nvidia-device-plugin
```

## 查看状态
### 查看DaemonSet
```shell
$ kubectl get daemonset -n kube-system nvidia-device-plugin-1614240442 
NAME                              DESIRED   CURRENT   READY   UP-TO-DATE   AVAILABLE   NODE SELECTOR   AGE
nvidia-device-plugin-1614240442   6         6         1       6            1           <none>          22h
```

### 查看Pod
```shell
$ kubectl get pod -n kube-system -o wide | grep nvidia-device-plugin
NAME                                    READY   STATUS              RESTARTS   AGE     IP              NODE   NOMINATED NODE   READINESS GATES
nvidia-device-plugin-1614240442-6qz7w   1/1     Running             14         22h     10.46.0.5       gpu1   <none>           <none>
nvidia-device-plugin-1614240442-wfh6c   0/1     CrashLoopBackOff    273        22h     10.34.0.4       gpu2   <none>           <none>
nvidia-device-plugin-1614240442-jn8k9   0/1     CrashLoopBackOff    273        22h     10.38.0.13      ln2    <none>           <none>
nvidia-device-plugin-1614240442-tbjqx   0/1     CrashLoopBackOff    273        22h     10.32.0.14      ln3    <none>           <none>
nvidia-device-plugin-1614240442-s9brf   0/1     CrashLoopBackOff    273        22h     10.42.0.2       ln4    <none>           <none>
nvidia-device-plugin-1614240442-wg5tv   0/1     CrashLoopBackOff    273        22h     10.45.0.2       ln5    <none>           <none>
```

### 查看Pod日志
* 成功
```shell
$ kubectl logs -n kube-system nvidia-device-plugin-1614240442-6qz7w 
2021/02/25 08:53:42 Loading NVML
2021/02/25 08:53:42 Starting FS watcher.
2021/02/25 08:53:42 Starting OS watcher.
2021/02/25 08:53:42 Retreiving plugins.
2021/02/25 08:53:42 Starting GRPC server for 'nvidia.com/gpu'
2021/02/25 08:53:42 Starting to serve 'nvidia.com/gpu' on /var/lib/kubelet/device-plugins/nvidia-gpu.sock
2021/02/25 08:53:42 Registered device plugin for 'nvidia.com/gpu' with Kubelet
```

* 失败（gpu2节点的Docker没有配置好）
```shell
$ kubectl logs -n kube-system nvidia-device-plugin-1614240442-wfh6c 
2021/02/26 07:03:48 Loading NVML
2021/02/26 07:03:48 Failed to initialize NVML: could not load NVML library.
2021/02/26 07:03:48 If this is a GPU node, did you set the docker default runtime to `nvidia`?
2021/02/26 07:03:48 You can check the prerequisites at: https://github.com/NVIDIA/k8s-device-plugin#prerequisites
2021/02/26 07:03:48 You can learn how to set the runtime at: https://github.com/NVIDIA/k8s-device-plugin#quick-start
2021/02/26 07:03:48 If this is not a GPU node, you should set up a toleration or nodeSelector to only deploy this plugin on GPU nodes
```

### 查看节点的GPU资源
* 有效GPU资源
```shell
$ kubectl describe node gpu1
......
Capacity:
  cpu:                64
  ephemeral-storage:  575261800Ki
  hugepages-1Gi:      0
  hugepages-2Mi:      0
  memory:             263781748Ki
  nvidia.com/gpu:     4
  pods:               110
Allocatable:
  cpu:                64
  ephemeral-storage:  530161274003
  hugepages-1Gi:      0
  hugepages-2Mi:      0
  memory:             263679348Ki
  nvidia.com/gpu:     4
  pods:               110
......
```

* 无效GPU资源
```shell
$ kubectl describe node gpu2
......
Capacity:
  cpu:                64
  ephemeral-storage:  575261800Ki
  hugepages-1Gi:      0
  hugepages-2Mi:      0
  memory:             263781756Ki
  pods:               110
Allocatable:
  cpu:                64
  ephemeral-storage:  530161274003
  hugepages-1Gi:      0
  hugepages-2Mi:      0
  memory:             263679356Ki
  pods:               110
......
```

## 测试
1. 编辑gpu-pod.yaml
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: gpu-pod
spec:
  restartPolicy: OnFailure
  containers:
  - image: nvcr.io/nvidia/cuda:9.0-devel
    name: cuda9
    command: ["sleep"]
    args: ["100000"]

    resources:
      limits:
        nvidia.com/gpu: 1
```

2. 创建Pod
```shell
kubectl apply -f gpu-pod.yaml 
```

3. 查看Pod状态
```shell
$ kubectl get pod gpu-pod -o wide
NAME      READY   STATUS    RESTARTS   AGE   IP          NODE   NOMINATED NODE   READINESS GATES
gpu-pod   1/1     Running   0          22h   10.46.0.8   gpu1   <none>           <none>
```

## 参考资料
* [NVIDIA device plugin for Kubernetes](https://github.com/NVIDIA/k8s-device-plugin/)
* [调度 GPUs](https://kubernetes.io/zh/docs/tasks/manage-gpus/scheduling-gpus/)
* [设备插件](https://kubernetes.io/zh/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/)
* [Install Kubernetes](https://docs.nvidia.com/datacenter/cloud-native/kubernetes/install-k8s.html)
* [Supporting Multi-Instance GPUs (MIG) in Kubernetes](https://github.com/NVIDIA/k8s-device-plugin/#deployment-via-helm)
* [Virtual GPU device plugin for inference workloads in Kubernetes](https://aws.amazon.com/cn/blogs/opensource/virtual-gpu-device-plugin-for-inference-workload-in-kubernetes/)
* [kubernetes 1.10 Failed to initialize NVML: could not load NVML library. #60](https://github.com/NVIDIA/k8s-device-plugin/issues/60)
