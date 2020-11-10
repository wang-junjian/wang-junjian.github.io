---
layout: post
title:  "Kubernetes集群搭建Master节点"
date:   2020-11-06 00:00:00 +0800
categories: Kubernetes
tags: [Cluster, Ubuntu, Install]
---

## 登录 root 用户
```shell
su - root
```

## 一键安装
```shell
apt-get install -y kubelet=1.18.3-00 kubeadm=1.18.3-00 kubectl=1.18.3-00
```

## 拉取需要的基础镜像
```shell
kube_apiserver_v=v1.18.3
kube_controller_manager_v=v1.18.3
kube_scheduler_v=v1.18.3
kube_proxy_v=v1.18.3
pause_v=3.2
etcd_v=3.4.3-0
coredns_v=1.6.7

docker pull kubesphere/kube-apiserver:${kube_apiserver_v}
docker pull kubesphere/kube-controller-manager:${kube_controller_manager_v}
docker pull kubesphere/kube-scheduler:${kube_scheduler_v}
docker pull kubesphere/kube-proxy:${kube_proxy_v}
docker pull kubesphere/pause:${pause_v}
docker pull azhu/etcd:${etcd_v}
docker pull coredns/coredns:${coredns_v}

docker tag kubesphere/kube-apiserver:${kube_apiserver_v} k8s.gcr.io/kube-apiserver:${kube_apiserver_v}
docker tag kubesphere/kube-controller-manager:${kube_controller_manager_v} k8s.gcr.io/kube-controller-manager:${kube_controller_manager_v}
docker tag kubesphere/kube-scheduler:${kube_scheduler_v} k8s.gcr.io/kube-scheduler:${kube_scheduler_v}
docker tag kubesphere/kube-proxy:${kube_proxy_v} k8s.gcr.io/kube-proxy:${kube_proxy_v}
docker tag kubesphere/pause:${pause_v} k8s.gcr.io/pause:${pause_v}
docker tag azhu/etcd:${etcd_v} k8s.gcr.io/etcd:${etcd_v}
docker tag docker.io/coredns/coredns:${coredns_v} k8s.gcr.io/coredns:${coredns_v}

docker rmi kubesphere/kube-apiserver:${kube_apiserver_v}
docker rmi kubesphere/kube-controller-manager:${kube_controller_manager_v}
docker rmi kubesphere/kube-scheduler:${kube_scheduler_v}
docker rmi kubesphere/kube-proxy:${kube_proxy_v}
docker rmi kubesphere/pause:${pause_v}
docker rmi azhu/etcd:${etcd_v}
docker rmi coredns/coredns:${coredns_v}
```

## Kubernetes 控制面初始化
```shell
# kubeadm init
W0616 06:09:06.113847  360011 configset.go:202] WARNING: kubeadm cannot validate component configs for API groups [kubelet.config.k8s.io kubeproxy.config.k8s.io]
[init] Using Kubernetes version: v1.18.3
[preflight] Running pre-flight checks
	[WARNING IsDockerSystemdCheck]: detected "cgroupfs" as the Docker cgroup driver. The recommended driver is "systemd". Please follow the guide at https://kubernetes.io/docs/setup/cri/
[preflight] Pulling images required for setting up a Kubernetes cluster
[preflight] This might take a minute or two, depending on the speed of your internet connection
[preflight] You can also perform this action in beforehand using 'kubeadm config images pull'
[kubelet-start] Writing kubelet environment file with flags to file "/var/lib/kubelet/kubeadm-flags.env"
[kubelet-start] Writing kubelet configuration to file "/var/lib/kubelet/config.yaml"
[kubelet-start] Starting the kubelet
[certs] Using certificateDir folder "/etc/kubernetes/pki"
[certs] Generating "ca" certificate and key
[certs] Generating "apiserver" certificate and key
[certs] apiserver serving cert is signed for DNS names [master kubernetes kubernetes.default kubernetes.default.svc kubernetes.default.svc.cluster.local] and IPs [10.96.0.1 192.168.1.100]
[certs] Generating "apiserver-kubelet-client" certificate and key
[certs] Generating "front-proxy-ca" certificate and key
[certs] Generating "front-proxy-client" certificate and key
[certs] Generating "etcd/ca" certificate and key
[certs] Generating "etcd/server" certificate and key
[certs] etcd/server serving cert is signed for DNS names [master localhost] and IPs [192.168.1.100 127.0.0.1 ::1]
[certs] Generating "etcd/peer" certificate and key
[certs] etcd/peer serving cert is signed for DNS names [master localhost] and IPs [192.168.1.100 127.0.0.1 ::1]
[certs] Generating "etcd/healthcheck-client" certificate and key
[certs] Generating "apiserver-etcd-client" certificate and key
[certs] Generating "sa" key and public key
[kubeconfig] Using kubeconfig folder "/etc/kubernetes"
[kubeconfig] Writing "admin.conf" kubeconfig file
[kubeconfig] Writing "kubelet.conf" kubeconfig file
[kubeconfig] Writing "controller-manager.conf" kubeconfig file
[kubeconfig] Writing "scheduler.conf" kubeconfig file
[control-plane] Using manifest folder "/etc/kubernetes/manifests"
[control-plane] Creating static Pod manifest for "kube-apiserver"
[control-plane] Creating static Pod manifest for "kube-controller-manager"
W0616 06:09:11.472637  360011 manifests.go:225] the default kube-apiserver authorization-mode is "Node,RBAC"; using "Node,RBAC"
[control-plane] Creating static Pod manifest for "kube-scheduler"
W0616 06:09:11.474568  360011 manifests.go:225] the default kube-apiserver authorization-mode is "Node,RBAC"; using "Node,RBAC"
[etcd] Creating static Pod manifest for local etcd in "/etc/kubernetes/manifests"
[wait-control-plane] Waiting for the kubelet to boot up the control plane as static Pods from directory "/etc/kubernetes/manifests". This can take up to 4m0s
[apiclient] All control plane components are healthy after 20.502741 seconds
[upload-config] Storing the configuration used in ConfigMap "kubeadm-config" in the "kube-system" Namespace
[kubelet] Creating a ConfigMap "kubelet-config-1.18" in namespace kube-system with the configuration for the kubelets in the cluster
[upload-certs] Skipping phase. Please see --upload-certs
[mark-control-plane] Marking the node master as control-plane by adding the label "node-role.kubernetes.io/master=''"
[mark-control-plane] Marking the node master as control-plane by adding the taints [node-role.kubernetes.io/master:NoSchedule]
[bootstrap-token] Using token: 95xez3.d8iq3qnxt535nz9q
[bootstrap-token] Configuring bootstrap tokens, cluster-info ConfigMap, RBAC Roles
[bootstrap-token] configured RBAC rules to allow Node Bootstrap tokens to get nodes
[bootstrap-token] configured RBAC rules to allow Node Bootstrap tokens to post CSRs in order for nodes to get long term certificate credentials
[bootstrap-token] configured RBAC rules to allow the csrapprover controller automatically approve CSRs from a Node Bootstrap Token
[bootstrap-token] configured RBAC rules to allow certificate rotation for all node client certificates in the cluster
[bootstrap-token] Creating the "cluster-info" ConfigMap in the "kube-public" namespace
[kubelet-finalize] Updating "/etc/kubernetes/kubelet.conf" to point to a rotatable kubelet client certificate and key
[addons] Applied essential addon: CoreDNS
[addons] Applied essential addon: kube-proxy

Your Kubernetes control-plane has initialized successfully!

To start using your cluster, you need to run the following as a regular user:

  mkdir -p $HOME/.kube
  sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
  sudo chown $(id -u):$(id -g) $HOME/.kube/config

You should now deploy a pod network to the cluster.
Run "kubectl apply -f [podnetwork].yaml" with one of the options listed at:
  https://kubernetes.io/docs/concepts/cluster-administration/addons/

Then you can join any number of worker nodes by running the following on each as root:

kubeadm join 172.16.33.157:6443 --token 95xez3.d8iq3qnxt535nz9q \
    --discovery-token-ca-cert-hash sha256:e7730904afd18d0b5b31d96249577cf385e5bd93d5925b701221a35de4d8b8ec
```

## 安装 Pod 网络插件 Weave Net
```shell
kubectl apply -f "https://cloud.weave.works/k8s/net?k8s-version=$(kubectl version | base64 | tr -d '\n')"
```

## 退出 root 用户
```shell
exit
```

## 用户配置
```shell
mkdir -p $HOME/.kube
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config
```
注：没有配置些项，在运行 kubectl get nodes 后会出现如下提示：The connection to the server localhost:8080 was refused - did you specify the right host or port?

## 查看节点信息
```shell
$kubectl get nodes
NAME     STATUS   ROLES    AGE   VERSION
master   Ready    master   20h   v1.18.3
```

## 查看 Pod 信息
```shell
$ kubectl get pods -A
NAMESPACE     NAME                          READY   STATUS    RESTARTS   AGE
kube-system   coredns-66bff467f8-89pfs      1/1     Running   0          170m
kube-system   coredns-66bff467f8-nt4wk      1/1     Running   0          170m
kube-system   etcd-ln1                      1/1     Running   0          170m
kube-system   kube-apiserver-ln1            1/1     Running   0          170m
kube-system   kube-controller-manager-ln1   1/1     Running   0          170m
kube-system   kube-proxy-6wv2z              1/1     Running   0          89m 
kube-system   kube-proxy-7x4k8              1/1     Running   0          170m
kube-system   kube-proxy-gbj9l              1/1     Running   0          90m 
kube-system   kube-scheduler-ln1            1/1     Running   0          170m
kube-system   weave-net-9vl5q               2/2     Running   11         74m 
kube-system   weave-net-d8zmb               2/2     Running   0          74m 
kube-system   weave-net-jntg6               2/2     Running   4          74m 
```
