---
layout: single
title:  "命令helm"
date:   2021-04-07 00:00:00 +0800
categories: Kubernetes Command
tags: [Helm, curl]
---

> Helm 帮助您管理 Kubernetes 应用程序 —— Helm Charts 帮助您定义、安装和升级即使是最复杂的 Kubernetes 应用程序。

## 安装 Helm
```shell
$ curl -fsSL -o get_helm.sh https://raw.githubusercontent.com/helm/helm/master/scripts/get-helm-3
$ chmod 700 get_helm.sh
$ ./get_helm.sh 
Downloading https://get.helm.sh/helm-v3.3.1-linux-amd64.tar.gz
Verifying checksum... Done.
Preparing to install helm into /usr/local/bin
helm installed into /usr/local/bin/helm
```

## Helm 的环境变量
```shell
$ helm env
HELM_BIN="helm"
HELM_CACHE_HOME="/home/username/.cache/helm"
HELM_CONFIG_HOME="/home/username/.config/helm"
HELM_DATA_HOME="/home/username/.local/share/helm"
HELM_DEBUG="false"
HELM_KUBEAPISERVER=""
HELM_KUBECONTEXT=""
HELM_KUBETOKEN=""
HELM_NAMESPACE="default"
HELM_PLUGINS="/home/username/.local/share/helm/plugins"
HELM_REGISTRY_CONFIG="/home/username/.config/helm/registry.json"
HELM_REPOSITORY_CACHE="/home/username/.cache/helm/repository"
HELM_REPOSITORY_CONFIG="/home/username/.config/helm/repositories.yaml"
```

## 仓库
### 设置 Chart 仓库(阿里云)
```shell
$ helm repo add stable https://kubernetes.oss-cn-hangzhou.aliyuncs.com/charts
"stable" has been added to your repositories
```
* [微软](http://mirror.azure.cn/kubernetes/charts/)
* [阿里云](https://kubernetes.oss-cn-hangzhou.aliyuncs.com/charts)

### 列出 Chart 仓库
```shell
$ helm repo list
NAME    URL                                                      
stable	https://kubernetes.oss-cn-hangzhou.aliyuncs.com/charts 
```

### 更新 Chart 仓库的 Chart 信息
```shell
$ helm repo update
Hang tight while we grab the latest from your chart repositories...
...Successfully got an update from the "stable" chart repository
Update Complete. ⎈Happy Helming!⎈
```

### 基于 update 后的缓存搜索 Chart
```shell
$ helm search repo prometheus
NAME                                              	CHART VERSION	APP VERSION	DESCRIPTION                                       
stable/prometheus                                 	5.4.0        	           	Prometheus is a monitoring system and time seri...
stable/prometheus-to-sd                           	0.1.0        	0.2.2      	Scrape metrics stored in prometheus format and ...
stable/elasticsearch-exporter                     	0.1.2        	1.0.2      	Elasticsearch stats exporter for Prometheus       
stable/weave-cloud                                	0.1.2        	           	Weave Cloud is a add-on to Kubernetes which pro...
stable/kube-state-metrics                         	0.5.3        	1.1.0      	Install kube-state-metrics to generate and expo...
stable/mariadb                                    	2.1.6        	10.1.31    	Fast, reliable, scalable, and easy to use open-...
```

## 安装与卸载
### 安装
```shell
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo update

helm install ingress-nginx ingress-nginx/ingress-nginx
```

### 卸载
```shell
helm uninstall ingress-nginx
```

## 参考资料
* [Helm](https://helm.sh)
* [Where are helm charts stored locally?](https://stackoverflow.com/questions/62924278/where-are-helm-charts-stored-locally)
* [Helm chart指南-系列（1）-charts](https://www.kubernetes.org.cn/3884.html)
