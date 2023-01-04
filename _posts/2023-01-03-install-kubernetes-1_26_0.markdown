---
layout: post
title:  "安装Kubernetes 1.26.0"
date:   2023-01-03 08:00:00 +0800
categories: Kubernetes
tags: [apt-cache, kubeadm, containerd]
---

## Master 节点
### 查询可用安装包的信息
```shell
$ apt-cache madison kubeadm | head
kubeadm |  1.26.0-00 | https://mirrors.aliyun.com/kubernetes/apt kubernetes-xenial/main amd64 Packages
kubeadm |  1.25.5-00 | https://mirrors.aliyun.com/kubernetes/apt kubernetes-xenial/main amd64 Packages
```

### 切换 root 用户
```shell
su - root
```

### 更新
```shell
apt -y update
apt -y install docker-ce docker-ce-cli containerd.io
apt -y install kubelet=1.26.0-00 kubeadm=1.26.0-00 kubectl=1.26.0-00
```

### 安装 Kubernetes
```shell
$ kubeadm reset -f
$ kubeadm init --kubernetes-version=1.26.0 --image-repository=registry.aliyuncs.com/google_containers
Your Kubernetes control-plane has initialized successfully!
To start using your cluster, you need to run the following as a regular user:
mkdir -p $HOME/.kube
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config
Alternatively, if you are the root user, you can run:
export KUBECONFIG=/etc/kubernetes/admin.conf
You should now deploy a pod network to the cluster.
Run "kubectl apply -f [podnetwork].yaml" with one of the options listed at:
https://kubernetes.io/docs/concepts/cluster-administration/addons/
Then you can join any number of worker nodes by running the following on each as root:
kubeadm join 172.16.33.157:6443 --token 8fskop.89xgqwv64i3pw7fc 
--discovery-token-ca-cert-hash sha256:e484088db824e5beaa10ae7ab19c2df75d4adcfb5dba554b77819eb19419ba7e
```

### 生成容器配置信息
```shell
containerd config default | tee /etc/containerd/config.toml
vim /etc/containerd/config.toml
sandbox_image = "registry.aliyuncs.com/google_containers/pause:3.6"
# 修改 pause 镜像的来源
docker pull registry.aliyuncs.com/google_containers/pause:3.6
```

### 检查 kubelet 配置文件和环境文件，然后启动 kubelet。
```shell
kubeadm init phase kubelet-start
```

### 重启 containerd 和 kubelet
```shell
systemctl daemon-reload
systemctl restart containerd
systemctl restart kubelet
```

### 安装网络插件 Weave
```shell
$ kubectl apply -f https://github.com/weaveworks/weave/releases/download/v2.8.1/weave-daemonset-k8s.yaml
Integrating Kubernetes via the Addon (weave.works)
```

## Worker 节点
### 切换 root 用户
```shell
su - root
```

### 更新
```shell
kubeadm reset -f
apt -y update
apt -y install docker-ce docker-ce-cli containerd.io
apt -y install kubelet=1.26.0-00 kubeadm=1.26.0-00 kubectl=1.26.0-00
```

### 生成容器配置信息
```shell
containerd config default | tee /etc/containerd/config.toml
vim /etc/containerd/config.toml
sandbox_image = "registry.aliyuncs.com/google_containers/pause:3.6"
# 修改 pause 镜像的来源
docker pull registry.aliyuncs.com/google_containers/pause:3.6
```

### 重启 containerd 和 kubelet
```shell
systemctl daemon-reload
systemctl restart containerd
systemctl restart kubelet
```

### 加入集群
```shell
kubeadm join 172.16.33.157:6443 --token 8fskop.89xgqwv64i3pw7fc --discovery-token-ca-cert-hash sha256:e484088db824e5beaa10ae7ab19c2df75d4adcfb5dba554b77819eb19419ba7e
```


## Master 节点
### 查看集群的节点信息
```shell
$ kubectl get nodes -o wide
NAME   STATUS   ROLES           AGE     VERSION   INTERNAL-IP     EXTERNAL-IP   OS-IMAGE           KERNEL-VERSION     CONTAINER-RUNTIME
cpu1   Ready    control-plane   23h     v1.26.0   172.16.33.157   <none>        Ubuntu 20.04 LTS   5.4.0-91-generic   containerd://1.6.14
cpu2   Ready    <none>          3h46m   v1.26.0   172.16.33.158   <none>        Ubuntu 20.04 LTS   5.4.0-91-generic   containerd://1.6.14
cpu3   Ready    <none>          10m     v1.26.0   172.16.33.159   <none>        Ubuntu 20.04 LTS   5.4.0-99-generic   containerd://1.6.14
```

### 安装 Metrics Server
```shell
wget https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml
```

### 修改 yaml 文档
```yaml
spec:
  template:
    spec:
      containers:
      - args:
        - --kubelet-insecure-tls #add
        image: bitnami/metrics-server:0.6.2 #k8s.gcr.io/metrics-server/metrics-server:v0.6.2
```

```shell
kubectl apply -f components.yaml
```

### 安装 Kubernetes Dashboard
部署 Dashboard
```shell
kubectl apply -f https://raw.githubusercontent.com/kubernetes/dashboard/v2.7.0/aio/deploy/recommended.yaml
```

角色绑定
```shell
kubectl create clusterrolebinding kubernetes-dashboard-cluster-admin --clusterrole=cluster-admin --serviceaccount=kubernetes-dashboard:kubernetes-dashboard
```

本机运行
```shell
scp root@172.16.33.157:/etc/kubernetes/admin.conf ~/.kube/config
kubectl proxy
http://localhost:8001/api/v1/namespaces/kubernetes-dashboard/services/https:kubernetes-dashboard:/proxy/#/node?namespace=default
```

服务器端获取 Token
```shell
kubectl -n kubernetes-dashboard create token kubernetes-dashboard
```

## FAQ
### 安装 kubeadm 出现错误
```
$ sudo kubeadm init --kubernetes-version=1.26.0 --image-repository=registry.aliyuncs.com/google_containers
[init] Using Kubernetes version: v1.26.0
[preflight] Running pre-flight checks
error execution phase preflight: [preflight] Some fatal errors occurred:
[ERROR CRI]: container runtime is not running: output: E1228 09:58:39.298328  649377 remote_runtime.go:948] "Status from runtime service failed" err                                   ="rpc error: code = Unimplemented desc = unknown service runtime.v1alpha2.RuntimeService"
time="2022-12-28T09:58:39+08:00" level=fatal msg="getting status of runtime: rpc error: code = Unimplemented desc = unknown service runtime.v1alpha2.Runtime                                   Service"
, error: exit status 1
[preflight] If you know what you are doing, you can make a check non-fatal with --ignore-preflight-errors=...
To see the stack trace of this error execute with --v=5 or higher
```

解决方法：
```
sudo mv /etc/containerd/config.toml /tmp/
sudo systemctl restart containerd
```

### 安装 kubeadm 出现错误
```
$ sudo kubeadm init --kubernetes-version=1.26.0 --image-repository=registry.aliyuncs.com/google_containers
[wait-control-plane] Waiting for the kubelet to boot up the control plane as static Pods from directory "/etc/kubernetes/manifests". This can take up to 4m0                                   s
[kubelet-check] Initial timeout of 40s passed.
[kubelet-check] It seems like the kubelet isn't running or healthy.

Unfortunately, an error has occurred:
timed out waiting for the condition
This error is likely caused by:
- The kubelet is not running
- The kubelet is unhealthy due to a misconfiguration of the node in some way (required cgroups disabled)
If you are on a systemd-powered system, you can try to troubleshoot the error with the following commands:
- 'systemctl status kubelet'
- 'journalctl -xeu kubelet'

Additionally, a control plane component may have crashed or exited when started by the container runtime.
To troubleshoot, list all containers using your preferred container runtimes CLI.
Here is one example how you may list all running Kubernetes containers by using crictl:
- 'crictl --runtime-endpoint unix:///var/run/containerd/containerd.sock ps -a | grep kube | grep -v pause'
Once you have found the failing container, you can inspect its logs with:
- 'crictl --runtime-endpoint unix:///var/run/containerd/containerd.sock logs CONTAINERID'
error execution phase wait-control-plane: couldn't initialize a Kubernetes cluster
To see the stack trace of this error execute with --v=5 or higher
```

解决方法：
```
sudo systemctl daemon-reload
sudo systemctl enable kubelet
sudo systemctl restart kubelet
sudo systemctl status kubelet
```

### containerd 服务出现错误：level=error msg="failed to initialize a tracing processor "otlp"" error="no OpenTelemetry endpoint: skip plugin"
```
$ sudo systemctl status containerd
● containerd.service - containerd container runtime
Loaded: loaded (/lib/systemd/system/containerd.service; enabled; vendor preset: enabled)
Active: active (running) since Wed 2022-12-28 16:16:19 CST; 22min ago
Docs: https://containerd.io
Main PID: 736660 (containerd)
Tasks: 27
Memory: 17.2M
CGroup: /system.slice/containerd.service
└─736660 /usr/bin/containerd
Dec 28 16:16:19 cpu1 containerd[736660]: time="2022-12-28T16:16:19.631240096+08:00" level=error msg="failed to initialize a tracing processor "otlp"" error="no OpenTelemetry endpoint: skip plugin"
```

解决方法：
```
Stop the Docker daemon
systemctl stop kubelet
systemctl disable docker.service --now
Configure containerd
sudo mkdir -p /etc/containerd
containerd config default | sudo tee /etc/containerd/config.toml
Restart containerd
sudo systemctl restart containerd
```

### 安装 Metrics Server 时出现　Error: failed to create containerd container: get apparmor_parser version: exec: "apparmor_parser": executable file not found in $PATH
```
Warning  Failed     46m (x12 over 49m)     kubelet            Error: failed to create containerd container: get apparmor_parser version: exec: "apparmor_parser": executable file not found in $PATH
```

解决方法：
```
在目标机器上安装 apparmor-utils
sudo apt-get install apparmor-utils
```

### 安装 Metrics Server 时出现　Readiness probe failed: HTTP probe failed with statuscode: 500
```
Warning  Unhealthy  4s (x18 over 2m34s)  kubelet            Readiness probe failed: HTTP probe failed with statuscode: 500
```

解决方法：
```
在 https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml 文档中属性 args 下增加参数 --kubelet-insecure-tls。
```


## 参考资料
* [Kubernetes](https://kubernetes.io/zh-cn/)
* [Metrics Server](https://github.com/kubernetes-sigs/metrics-server)
