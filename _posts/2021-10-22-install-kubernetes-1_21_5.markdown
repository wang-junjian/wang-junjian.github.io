---
layout: post
title:  "安装Kubernetes 1.21.5"
date:   2021-10-22 00:00:00 +0800
categories: Kubernetes
tags: [Docker, timedatectl, hostnamectl, apt, curl, cat, kubeadm, export, cp, chown, kubectl]
---

> 删除 Kubernetes 旧版本，安装 Kubernetes 1.21.5。

## 必备安装
> 每台服务器都需要

### root 登录
```shell
su - root
```

### 设置时区
```shell
timedatectl set-timezone Asia/Shanghai
```

### 设置主机名
```shell
hostnamectl set-hostname new-hostname
```

### 安装 Docker-CE
```shell
apt-get -y update
apt-get -y install apt-transport-https ca-certificates curl software-properties-common

# 安装GPG证书
curl -fsSL https://mirrors.aliyun.com/docker-ce/linux/ubuntu/gpg | apt-key add -

# 写入软件源信息
add-apt-repository "deb [arch=amd64] https://mirrors.aliyun.com/docker-ce/linux/ubuntu $(lsb_release -cs) stable"

# 更新并安装
apt-get -y update
apt-get -y install docker-ce docker-ce-cli containerd.io
```

### 设置 Docker 的 cgroupDriver=systemd
```shell
# vim /lib/systemd/system/docker.service
ExecStart=/usr/bin/dockerd -H fd:// --containerd=/run/containerd/containerd.sock --exec-opt native.cgroupdriver=systemd
```

重启服务
```shell
systemctl daemon-reload
systemctl restart docker
```

### 安装 Kubernetes
```shell
# 安装GPG证书
curl https://mirrors.aliyun.com/kubernetes/apt/doc/apt-key.gpg | apt-key add - 

# 写入软件源信息
cat <<EOF >/etc/apt/sources.list.d/kubernetes.list
deb https://mirrors.aliyun.com/kubernetes/apt/ kubernetes-xenial main
EOF

# 更新并安装
apt-get -y update
apt-get -y install kubelet=1.21.5-00 kubeadm=1.21.5-00 kubectl=1.21.5-00
```

## 清理集群
### 清理 Worker 节点
```shell
kubectl drain <node name> --delete-emptydir-data --force --ignore-daemonsets
```

### 在每台 Worker 节点上重置
```shell
kubeadm reset -f
```

### 删除 Worker 节点
```shell
kubectl delete node <node name>
```

### 清理控制平面
```shell
kubeadm reset -f
```

### 删除旧版本 Kubernetes
```shell
apt-get -y remove --purge kubelet kubeadm kubectl
rm -rf /etc/systemd/system/kubelnet.service.d
```

## Master 节点
### 安装控制平面
```shell
kubeadm init --kubernetes-version=1.21.5 --image-repository=registry.aliyuncs.com/google_containers
```
```
......
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

kubeadm join 172.16.33.157:6443 --token 1b4d4t.mkcxrylj4ncdhpi7 \
	--discovery-token-ca-cert-hash sha256:c08b680766b950e7d26dde4b301163283b349280dd0448f45da4550aae8438f8 
```

### 安装 Weave Net 支持集群网络
```shell
kubectl apply -f "https://cloud.weave.works/k8s/net?k8s-version=$(kubectl version | base64 | tr -d '\n')"
```

## Worker 节点加入集群
在每台 Worker 服务器上运行
```shell
kubeadm join 172.16.33.157:6443 --token 1b4d4t.mkcxrylj4ncdhpi7 \
	--discovery-token-ca-cert-hash sha256:c08b680766b950e7d26dde4b301163283b349280dd0448f45da4550aae8438f8 
```
```
......
This node has joined the cluster:
* Certificate signing request was sent to apiserver and a response was received.
* The Kubelet was informed of the new secure connection details.

Run 'kubectl get nodes' on the control-plane to see this node join the cluster.
```

## 控制平面下查看集群中的节点
### root 用户下设置
```shell
export KUBECONFIG=/etc/kubernetes/admin.conf
```

### 其它用户下设置
```shell
mkdir -p $HOME/.kube
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config
```

### 查看集群中的节点
```shell
kubectl get nodes
```
```
NAME   STATUS   ROLES                  AGE     VERSION
cpu1   Ready    control-plane,master   4h14m   v1.21.5
cpu2   Ready    <none>                 22m     v1.21.5
cpu3   Ready    <none>                 10m     v1.21.5
cpu4   Ready    <none>                 110s    v1.21.5
gpu1   Ready    <none>                 14s     v1.21.5
```

## 参考资料
* [Install Docker Engine on Ubuntu](https://docs.docker.com/engine/install/ubuntu/)
* [How to Change Hostname on Ubuntu 20.04](https://phoenixnap.com/kb/ubuntu-20-04-change-hostname)
* [How to install Kubernetes Cluster on Azure Ubuntu Virtual Machine 20.04 LTS](https://stackoverflow.com/questions/69085180/how-to-install-kubernetes-cluster-on-azure-ubuntu-virtual-machine-20-04-lts/69128645#69128645)
* [Kubernetes 安装扩展（Addons）](https://kubernetes.io/zh/docs/concepts/cluster-administration/addons/)
* [Integrating Kubernetes via the Addon](https://www.weave.works/docs/net/latest/kubernetes/kube-addon/)
* [How to merge kubectl config file with ~/.kube/config?](https://stackoverflow.com/questions/46184125/how-to-merge-kubectl-config-file-with-kube-config)
* [Не удается установить третий главный узел kubernetes: тайм-аут Kubelet TLS bootstrapping в соединении kubeadm](https://coderoad.ru/52664098/Не-удается-установить-третий-главный-узел-kubernetes-тайм-аут-Kubelet-TLS)
* [Image garbage collection failed once. Stats initialization may not have completed yet: failed to get imageFs info: unable to find data for container / #1025](https://github.com/kubernetes/kubeadm/issues/1025)
* [配置 cgroup 驱动](https://kubernetes.io/zh/docs/tasks/administer-cluster/kubeadm/configure-cgroup-driver/)
* [kubeadm init shows kubelet isn't running or healthy](https://stackoverflow.com/questions/52119985/kubeadm-init-shows-kubelet-isnt-running-or-healthy)
* [为什么要修改docker的cgroup driver](https://blog.51cto.com/riverxyz/2537914)
* [[Kubeadm initialization error] failed to run kubelet: Misconfiguration: Kubelet CGROUP DRIVER: "CGROUPFS" IS DIFFERENT from Docker CGROUP DRIVER: "Systemd"](https://www.programmerall.com/article/57231708132/)
* [kubeadm从0到1搭建k8s集群](https://zhuanlan.zhihu.com/p/415297992)
* [Kubeadm创建Kubernetes集群](https://www.ityoudao.cn/posts/kubernetes-cluster-kubeadm/)
* [菜鸟学K8S之安装Kubernetes（使用kubeadm安装）](https://blog.csdn.net/ARPOSPF/article/details/114279773)
