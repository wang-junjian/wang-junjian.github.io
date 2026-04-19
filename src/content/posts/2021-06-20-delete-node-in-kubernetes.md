---
layout: single
title:  "Kubernetes中删除节点"
date:   2021-06-20 00:00:00 +0800
categories: Kubernetes
tags: [kubectl, drain, delete]
---

## 查看集群节点
```shell
kubectl get nodes
```
```
NAME   STATUS   ROLES    AGE    VERSION
gpu1   Ready    <none>   227d   v1.18.3
gpu2   Ready    <none>   31d    v1.18.3
ln1    Ready    master   370d   v1.18.3
ln2    Ready    <none>   370d   v1.18.3
ln3    Ready    <none>   370d   v1.18.3
```

## 驱逐节点
```shell
kubectl drain gpu2 --delete-local-data --ignore-daemonsets --force 
```
```
node/gpu2 already cordoned
WARNING: ignoring DaemonSet-managed Pods: default/dcgm-exporter-1617245566-6gvdw, kube-system/kube-proxy-jhfh5, kube-system/nvidia-device-plugin-daemonset-spflp, kube-system/weave-net-ktsbp, monitoring/kube-prometheus-stack-prometheus-node-exporter-dpnzx, rook-ceph/csi-cephfsplugin-sg7tw, rook-ceph/csi-rbdplugin-p88cr, rook-ceph/rook-discover-6gptl; deleting Pods not managed by ReplicationController, ReplicaSet, Job, DaemonSet or StatefulSet: default/kubia
evicting pod default/kubia
evicting pod rook-ceph/rook-ceph-crashcollector-gpu2-7cd6f99bcf-c8vl6
evicting pod rook-ceph/rook-ceph-osd-3-87b47b595-q2st8
```

## 查看集群节点
```shell
kubectl get nodes
```
```
NAME   STATUS   ROLES    AGE    VERSION
NAME   STATUS                        ROLES    AGE    VERSION
gpu1   Ready                         <none>   228d   v1.18.3
gpu2   NotReady,SchedulingDisabled   <none>   32d    v1.18.3
ln1    Ready                         master   371d   v1.18.3
ln2    Ready                         <none>   370d   v1.18.3
ln3    Ready                         <none>   370d   v1.18.3
```

## 删除节点
```shell
kubectl delete nodes gpu2
```
```
node "gpu2" deleted
```

## 查看集群节点
```shell
kubectl get nodes
```
```
NAME   STATUS   ROLES    AGE    VERSION
gpu1   Ready    <none>   228d   v1.18.3
ln1    Ready    master   371d   v1.18.3
ln2    Ready    <none>   370d   v1.18.3
ln3    Ready    <none>   370d   v1.18.3
```

## 参考资料
* [安全地清空一个节点](https://kubernetes.io/zh/docs/tasks/administer-cluster/safely-drain-node/)
