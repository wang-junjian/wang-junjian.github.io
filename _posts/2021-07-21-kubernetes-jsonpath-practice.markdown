---
layout: post
title:  "Kubernetes JSONPath实践"
date:   2021-07-21 00:00:00 +0800
categories: Kubernetes 实践
tags: [kubectl, JSONPath]
---

## Node
### 标签信息
#### 查看单个节点
```shell
$ kubectl get node ln1 -o=jsonpath='{.metadata.labels}{"\n"}'
map[beta.kubernetes.io/arch:amd64 beta.kubernetes.io/os:linux kubernetes.io/arch:amd64 kubernetes.io/hostname:ln1 kubernetes.io/os:linux node-role.kubernetes.io/master:]
```

#### 查看集群所有节点
```shell
$ kubectl get nodes -o=jsonpath='{range .items[*]}{.metadata.name}{"\t"}{.metadata.labels}{"\n"}{end}'
gpu1	map[beta.kubernetes.io/arch:amd64 beta.kubernetes.io/os:linux k8s.amazonaws.com/accelerator:vgpu kubernetes.io/arch:amd64 kubernetes.io/hostname:gpu1 kubernetes.io/os:linux]
ln1	map[beta.kubernetes.io/arch:amd64 beta.kubernetes.io/os:linux kubernetes.io/arch:amd64 kubernetes.io/hostname:ln1 kubernetes.io/os:linux node-role.kubernetes.io/master:]
ln2	map[beta.kubernetes.io/arch:amd64 beta.kubernetes.io/os:linux kubernetes.io/arch:amd64 kubernetes.io/hostname:ln2 kubernetes.io/os:linux]
ln3	map[beta.kubernetes.io/arch:amd64 beta.kubernetes.io/os:linux kubernetes.io/arch:amd64 kubernetes.io/hostname:ln3 kubernetes.io/os:linux]
ln6	map[beta.kubernetes.io/arch:amd64 beta.kubernetes.io/os:linux kubernetes.io/arch:amd64 kubernetes.io/hostname:ln6 kubernetes.io/os:linux]
```

### 污点信息
#### 查看单个节点
```shell
$ kubectl get node ln1 -o=jsonpath='{range .spec.taints[*]}{.key}{"="}{.value}{":"}{.effect}{"\n"}{end}'
node-role.kubernetes.io/master=:NoSchedule
```

#### 查看集群所有节点
```shell
$ kubectl get nodes -o=jsonpath='{range .items[*]}{.metadata.name}{"\t"}{.status.addresses[0].address}{"\n"}{range .spec.taints[*]}{"\t"}{.key}{"="}{.value}{":"}{.effect}{"\n"}{end}{end}'
gpu1	172.16.33.66
	node.kubernetes.io/unreachable=:NoSchedule
	node.kubernetes.io/unreachable=:NoExecute
ln1	172.16.33.157
	node-role.kubernetes.io/master=:NoSchedule
ln2	172.16.33.158
ln3	172.16.33.159
ln6	172.16.33.174
```

## Pod
### Pod 名字
#### 查看所有 Pod 的名字
```shell
$ kubectl get pods --output=jsonpath={.items..metadata.name}
kubia-864465c9d-6fxdr kubia-864465c9d-9qr6w kubia-864465c9d-fw8m6 kubia-864465c9d-w6n5m kubia-864465c9d-zd8lc
```

#### 查看所有 Pod 的名字（格式化）
```shell
$ kubectl get pods --output=jsonpath='{range .items[*]}{.metadata.name}{"\n"}{end}'
kubia-864465c9d-6fxdr
kubia-864465c9d-9qr6w
kubia-864465c9d-fw8m6
kubia-864465c9d-w6n5m
kubia-864465c9d-zd8lc
```


## 参考资料
* [JSONPath Support](https://kubernetes.io/docs/reference/kubectl/jsonpath/)
