---
layout: post
title:  "Kubernetes集群加入Worker节点"
date:   2020-11-02 00:00:00 +0800
categories: Kubernetes
tags: [Linux, Ubuntu, Docker, Mirror]
---

## 在 Master 节点创建加入节点用的 Token
```shell
kubeadm token create --print-join-command
W1106 05:52:12.234596 1947512 configset.go:202] WARNING: kubeadm cannot validate component configs for API groups [kubelet.config.k8s.io kubeproxy.config.k8s.io]
kubeadm join 172.16.33.157:6443 --token xxx.yyyyyy     --discovery-token-ca-cert-hash sha256:zzzzzzzzzzzzzzzzzzzzzz
```

## Worker 节点登录 root 用户
```shell
su - root
```

## 配置 Kubernetes 镜像源
```shell
apt-get update && apt-get install -y apt-transport-https
curl https://mirrors.aliyun.com/kubernetes/apt/doc/apt-key.gpg | apt-key add - 
cat <<EOF >/etc/apt/sources.list.d/kubernetes.list
deb https://mirrors.aliyun.com/kubernetes/apt/ kubernetes-xenial main
EOF
apt-get update
apt-get install -y kubelet=1.18.3-00 kubeadm=1.18.3-00 kubectl=1.18.3-00
```

## 加入集群（命令来源于上面的 Master 节点）
```shell
kubeadm join 172.16.33.157:6443 --token xxx.yyyyyy     --discovery-token-ca-cert-hash sha256:zzzzzzzzzzzzzzzzzzzzzz
```

## 查看 Worker 节点的问题
```shell
journalctl -xe
```

## 拉取 Worker 节点需要的最基础的镜像
```shell
kube_proxy_v=v1.18.3
docker pull kubesphere/kube-proxy:${kube_proxy_v}
docker tag kubesphere/kube-proxy:${kube_proxy_v} k8s.gcr.io/kube-proxy:${kube_proxy_v}
docker rmi kubesphere/kube-proxy:${kube_proxy_v}

pause_v=3.2
docker pull kubesphere/pause:${pause_v}
docker tag kubesphere/pause:${pause_v} k8s.gcr.io/pause:${pause_v}
docker rmi kubesphere/pause:${pause_v}

docker pull weaveworks/weave-kube:2.6.5
docker pull weaveworks/weave-npc:2.6.5
```

## 在 Master 节点查看集群的状态
```shell
$ kubectl get nodes
NAME   STATUS   ROLES    AGE     VERSION
gpu1   Ready    <none>   3h15m   v1.18.3
gpu2   Ready    <none>   3h8m    v1.18.3
ln1    Ready    master   143d    v1.18.3
ln2    Ready    <none>   143d    v1.18.3
ln3    Ready    <none>   143d    v1.18.3
```

## 参考资料
* [阿里云-Kubernetes 镜像](https://developer.aliyun.com/mirror/kubernetes)
* [kubeadm join failed: unable to fetch the kubeadm-config ConfigMap #1596](https://github.com/kubernetes/kubeadm/issues/1596)
* [runtime network not ready: NetworkReady=false reason:NetworkPluginNotReady message:docker: network plugin is not ready: cni config uninitialized #1031](https://github.com/kubernetes/kubeadm/issues/1031)
