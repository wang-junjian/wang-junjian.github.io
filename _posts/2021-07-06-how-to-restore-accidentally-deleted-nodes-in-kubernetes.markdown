---
layout: post
title:  "Kubernetes中如何恢复误删的节点"
date:   2021-07-06 00:00:00 +0800
categories: Kubernetes
tags: [kubectl, delete, kubeadm, token, reset, join]
---

> 在删除标签的时候不小心删除了节点。
```shell
$ kubectl delete nodes ln6 server-type-
node "ln6" deleted
Error from server (NotFound): nodes "server-type-" not found
```

## 主节点
### 在 Master 节点创建加入节点用的 Token
```shell
kubeadm token create --print-join-command
W0706 08:09:27.126498  609025 configset.go:202] WARNING: kubeadm cannot validate component configs for API groups [kubelet.config.k8s.io kubeproxy.config.k8s.io]
kubeadm join 172.16.33.157:6443 --token xxx.yyyyyy     --discovery-token-ca-cert-hash sha256:zzzzzzzzzzzzzzzzzzzzzz
```

## 工作节点（被删除的）
### 登录 root 用户
```shell
su - root
```

### 重置
```shell
# kubeadm reset
```
```shell
[reset] WARNING: Changes made to this host by 'kubeadm init' or 'kubeadm join' will be reverted.
[reset] Are you sure you want to proceed? [y/N]: y
[preflight] Running pre-flight checks
W0706 16:51:36.533542  641688 removeetcdmember.go:79] [reset] No kubeadm config, using etcd pod spec to get data directory
[reset] No etcd config found. Assuming external etcd
[reset] Please, manually reset etcd to prevent further issues
[reset] Stopping the kubelet service
[reset] Unmounting mounted directories in "/var/lib/kubelet"
[reset] Deleting contents of config directories: [/etc/kubernetes/manifests /etc/kubernetes/pki]
[reset] Deleting files: [/etc/kubernetes/admin.conf /etc/kubernetes/kubelet.conf /etc/kubernetes/bootstrap-kubelet.conf /etc/kubernetes/controller-manager.conf /etc/kubernetes/scheduler.conf]
[reset] Deleting contents of stateful directories: [/var/lib/kubelet /var/lib/dockershim /var/run/kubernetes /var/lib/cni]

The reset process does not clean CNI configuration. To do so, you must remove /etc/cni/net.d

The reset process does not reset or clean up iptables rules or IPVS tables.
If you wish to reset iptables, you must do so manually by using the "iptables" command.

If your cluster was setup to utilize IPVS, run ipvsadm --clear (or similar)
to reset your system's IPVS tables.

The reset process does not clean your kubeconfig files and you must remove them manually.
Please, check the contents of the $HOME/.kube/config file.
```

### 加入集群（使用主节点创建的Token）
```shell
# kubeadm join 172.16.33.157:6443 --token xxx.yyyyyy     --discovery-token-ca-cert-hash sha256:zzzzzzzzzzzzzzzzzzzzzz
```
```shell
W0706 16:51:47.421225  645358 join.go:346] [preflight] WARNING: JoinControlPane.controlPlane settings will be ignored when control-plane flag is not set.
[preflight] Running pre-flight checks
	[WARNING IsDockerSystemdCheck]: detected "cgroupfs" as the Docker cgroup driver. The recommended driver is "systemd". Please follow the guide at https://kubernetes.io/docs/setup/cri/
	[WARNING SystemVerification]: this Docker version is not on the list of validated versions: 20.10.2. Latest validated version: 19.03
[preflight] Reading configuration from the cluster...
[preflight] FYI: You can look at this config file with 'kubectl -n kube-system get cm kubeadm-config -oyaml'
[kubelet-start] Downloading configuration for the kubelet from the "kubelet-config-1.18" ConfigMap in the kube-system namespace
[kubelet-start] Writing kubelet configuration to file "/var/lib/kubelet/config.yaml"
[kubelet-start] Writing kubelet environment file with flags to file "/var/lib/kubelet/kubeadm-flags.env"
[kubelet-start] Starting the kubelet
[kubelet-start] Waiting for the kubelet to perform the TLS Bootstrap...

This node has joined the cluster:
* Certificate signing request was sent to apiserver and a response was received.
* The Kubelet was informed of the new secure connection details.

Run 'kubectl get nodes' on the control-plane to see this node join the cluster.
```

## 主节点
### 查看集群的状态
```shell
$ kubectl get nodes -o wide
```
```shell
NAME   STATUS     ROLES    AGE    VERSION   INTERNAL-IP     EXTERNAL-IP   OS-IMAGE           KERNEL-VERSION     CONTAINER-RUNTIME
gpu1   NotReady   <none>   242d   v1.18.3   172.16.33.66    <none>        Ubuntu 20.04 LTS   5.4.0-53-generic   docker://20.10.6
ln1    Ready      master   385d   v1.18.3   172.16.33.157   <none>        Ubuntu 20.04 LTS   5.4.0-26-generic   docker://19.3.12
ln2    Ready      <none>   385d   v1.18.3   172.16.33.158   <none>        Ubuntu 20.04 LTS   5.4.0-26-generic   docker://19.3.11
ln3    Ready      <none>   385d   v1.18.3   172.16.33.159   <none>        Ubuntu 20.04 LTS   5.4.0-26-generic   docker://19.3.11
ln6    NotReady   <none>   9s     v1.18.3   172.16.33.174   <none>        Ubuntu 20.04 LTS   5.4.0-72-generic   docker://20.10.2
```
可以看到 ln6 节点了，再等一会状态（STATUS）就可以恢复为 Ready。

## 参考资料
* [Readd a deleted node to kubernetes](https://stackoverflow.com/questions/45913034/readd-a-deleted-node-to-kubernetes)
* [Kubernetes Master Worker Node Kubeadm Join issue](https://stackoverflow.com/questions/55767652/kubernetes-master-worker-node-kubeadm-join-issue)
