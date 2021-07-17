---
layout: post
title:  "在Kubernetes上安装Ingress"
date:   2021-07-15 00:00:00 +0800
categories: Kubernetes
tags: [Helm]
---

## 官方的安装
```shell
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo update

helm install ingress-nginx ingress-nginx/ingress-nginx
```

## 在中国
1. 下载 [Ingress Release][ingress-nginx-releases]
```shell
wget https://github.com/kubernetes/ingress-nginx/releases/download/ingress-nginx-3.3.0/ingress-nginx-3.3.0.tgz
```

2. 解压
```shell
tar xzvf ingress-nginx-3.3.0.tgz
cd ingress-nginx
```

3. 替换镜像
```shell
vim values.yaml
```
```yaml
    repository: k8s.gcr.io/ingress-nginx/controller
    digest: sha256:fc4979d8b8443a831c9789b5155cded454cb7de737a8b727bc2ba0106d2eae8b
```
替换为下面的内容
```yaml
    repository: pollyduan/ingress-nginx-controller
    # digest: sha256:fc4979d8b8443a831c9789b5155cded454cb7de737a8b727bc2ba0106d2eae8b
```

4. Helm 使用本地目录的 Chart 进行安装
```shell
cd ..
helm install ingress-nginx ./ingress-nginx
```

[ingress-nginx-releases]: https://github.com/kubernetes/ingress-nginx/releases


## 参考资料
* [NGINX Ingress Controller](https://github.com/kubernetes/ingress-nginx/)
* [NGINX Ingress Controller Deploy](https://kubernetes.github.io/ingress-nginx/deploy/)
* [pollyduan/ingress-nginx-controller](https://hub.docker.com/r/pollyduan/ingress-nginx-controller)
* [Where are helm charts stored locally?](https://stackoverflow.com/questions/62924278/where-are-helm-charts-stored-locally)
