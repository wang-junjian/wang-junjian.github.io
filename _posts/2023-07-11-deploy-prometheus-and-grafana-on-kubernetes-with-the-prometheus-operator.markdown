---
layout: single
title:  "使用 Prometheus Operator 在 Kubernetes 上部署 Prometheus 和 Grafana"
date:   2023-07-11 08:00:00 +0800
categories: Prometheus-Operator
tags: [Prometheus, Grafana, Kubernetes, patch]
---

## 监控组件
### [Prometheus](https://github.com/prometheus)
Prometheus 是一个开源系统监控和警报工具包。

#### 架构图
![](/images/2023/prometheus/prometheus-architecture.png)

### [Grafana](https://grafana.com/grafana/)
Grafana 用于对收集并存储在 Prometheus 数据库中的指标进行分析和交互式可视化。 您可以以 Prometheus 作为数据源，为 Kubernetes 集群创建自定义图表、图形和警报。

## [Prometheus Operator](https://github.com/prometheus-operator/prometheus-operator)
### 概述
Prometheus Operator 提供 Prometheus 及相关监控组件的 Kubernetes 原生部署和管理。 该项目的目的是简化和自动化 Kubernetes 集群基于 Prometheus 的监控堆栈的配置。

### 架构图
![](/images/2023/prometheus/prometheus-operator-architecture.png)

### 部署 Prometheus 和 Grafana Monitoring Stack
#### 克隆 kube-prometheus 项目
```shell
git clone https://github.com/prometheus-operator/kube-prometheus.git
cd kube-prometheus/
```

#### 创建 monitoring namespace, CustomResourceDefinitions 和 operator pod

创建 namespace 和 CustomResourceDefinitions

```shell
kubectl create -f manifests/setup
```
```
customresourcedefinition.apiextensions.k8s.io/alertmanagerconfigs.monitoring.coreos.com created
customresourcedefinition.apiextensions.k8s.io/alertmanagers.monitoring.coreos.com created
customresourcedefinition.apiextensions.k8s.io/podmonitors.monitoring.coreos.com created
customresourcedefinition.apiextensions.k8s.io/probes.monitoring.coreos.com created
customresourcedefinition.apiextensions.k8s.io/prometheuses.monitoring.coreos.com created
customresourcedefinition.apiextensions.k8s.io/prometheusagents.monitoring.coreos.com created
customresourcedefinition.apiextensions.k8s.io/prometheusrules.monitoring.coreos.com created
customresourcedefinition.apiextensions.k8s.io/scrapeconfigs.monitoring.coreos.com created
customresourcedefinition.apiextensions.k8s.io/servicemonitors.monitoring.coreos.com created
customresourcedefinition.apiextensions.k8s.io/thanosrulers.monitoring.coreos.com created
namespace/monitoring created
```

查看自定义资源 monitoring

```shell
kubectl get ns monitoring
```
```
NAME         STATUS   AGE
monitoring   Active   47s
```

#### 部署 Prometheus Monitoring Stack

```shell
kubectl create -f manifests/
```
```
alertmanager.monitoring.coreos.com/main created
networkpolicy.networking.k8s.io/alertmanager-main created
poddisruptionbudget.policy/alertmanager-main created
prometheusrule.monitoring.coreos.com/alertmanager-main-rules created
secret/alertmanager-main created
service/alertmanager-main created
serviceaccount/alertmanager-main created
servicemonitor.monitoring.coreos.com/alertmanager-main created
clusterrole.rbac.authorization.k8s.io/blackbox-exporter created
clusterrolebinding.rbac.authorization.k8s.io/blackbox-exporter created
configmap/blackbox-exporter-configuration created
deployment.apps/blackbox-exporter created
networkpolicy.networking.k8s.io/blackbox-exporter created
service/blackbox-exporter created
serviceaccount/blackbox-exporter created
servicemonitor.monitoring.coreos.com/blackbox-exporter created
secret/grafana-config created
secret/grafana-datasources created
configmap/grafana-dashboard-alertmanager-overview created
configmap/grafana-dashboard-apiserver created
configmap/grafana-dashboard-cluster-total created
configmap/grafana-dashboard-controller-manager created
configmap/grafana-dashboard-grafana-overview created
configmap/grafana-dashboard-k8s-resources-cluster created
configmap/grafana-dashboard-k8s-resources-multicluster created
configmap/grafana-dashboard-k8s-resources-namespace created
configmap/grafana-dashboard-k8s-resources-node created
configmap/grafana-dashboard-k8s-resources-pod created
configmap/grafana-dashboard-k8s-resources-workload created
configmap/grafana-dashboard-k8s-resources-workloads-namespace created
configmap/grafana-dashboard-kubelet created
configmap/grafana-dashboard-namespace-by-pod created
configmap/grafana-dashboard-namespace-by-workload created
configmap/grafana-dashboard-node-cluster-rsrc-use created
configmap/grafana-dashboard-node-rsrc-use created
configmap/grafana-dashboard-nodes-darwin created
configmap/grafana-dashboard-nodes created
configmap/grafana-dashboard-persistentvolumesusage created
configmap/grafana-dashboard-pod-total created
configmap/grafana-dashboard-prometheus-remote-write created
configmap/grafana-dashboard-prometheus created
configmap/grafana-dashboard-proxy created
configmap/grafana-dashboard-scheduler created
configmap/grafana-dashboard-workload-total created
configmap/grafana-dashboards created
deployment.apps/grafana created
networkpolicy.networking.k8s.io/grafana created
prometheusrule.monitoring.coreos.com/grafana-rules created
service/grafana created
serviceaccount/grafana created
servicemonitor.monitoring.coreos.com/grafana created
prometheusrule.monitoring.coreos.com/kube-prometheus-rules created
clusterrole.rbac.authorization.k8s.io/kube-state-metrics created
clusterrolebinding.rbac.authorization.k8s.io/kube-state-metrics created
deployment.apps/kube-state-metrics created
networkpolicy.networking.k8s.io/kube-state-metrics created
prometheusrule.monitoring.coreos.com/kube-state-metrics-rules created
service/kube-state-metrics created
serviceaccount/kube-state-metrics created
servicemonitor.monitoring.coreos.com/kube-state-metrics created
prometheusrule.monitoring.coreos.com/kubernetes-monitoring-rules created
servicemonitor.monitoring.coreos.com/kube-apiserver created
servicemonitor.monitoring.coreos.com/coredns created
servicemonitor.monitoring.coreos.com/kube-controller-manager created
servicemonitor.monitoring.coreos.com/kube-scheduler created
servicemonitor.monitoring.coreos.com/kubelet created
clusterrole.rbac.authorization.k8s.io/node-exporter created
clusterrolebinding.rbac.authorization.k8s.io/node-exporter created
daemonset.apps/node-exporter created
networkpolicy.networking.k8s.io/node-exporter created
prometheusrule.monitoring.coreos.com/node-exporter-rules created
service/node-exporter created
serviceaccount/node-exporter created
servicemonitor.monitoring.coreos.com/node-exporter created
clusterrole.rbac.authorization.k8s.io/prometheus-k8s created
clusterrolebinding.rbac.authorization.k8s.io/prometheus-k8s created
networkpolicy.networking.k8s.io/prometheus-k8s created
poddisruptionbudget.policy/prometheus-k8s created
prometheus.monitoring.coreos.com/k8s created
prometheusrule.monitoring.coreos.com/prometheus-k8s-prometheus-rules created
rolebinding.rbac.authorization.k8s.io/prometheus-k8s-config created
rolebinding.rbac.authorization.k8s.io/prometheus-k8s created
rolebinding.rbac.authorization.k8s.io/prometheus-k8s created
rolebinding.rbac.authorization.k8s.io/prometheus-k8s created
role.rbac.authorization.k8s.io/prometheus-k8s-config created
role.rbac.authorization.k8s.io/prometheus-k8s created
role.rbac.authorization.k8s.io/prometheus-k8s created
role.rbac.authorization.k8s.io/prometheus-k8s created
service/prometheus-k8s created
serviceaccount/prometheus-k8s created
servicemonitor.monitoring.coreos.com/prometheus-k8s created
clusterrole.rbac.authorization.k8s.io/prometheus-adapter created
clusterrolebinding.rbac.authorization.k8s.io/prometheus-adapter created
clusterrolebinding.rbac.authorization.k8s.io/resource-metrics:system:auth-delegator created
clusterrole.rbac.authorization.k8s.io/resource-metrics-server-resources created
configmap/adapter-config created
deployment.apps/prometheus-adapter created
networkpolicy.networking.k8s.io/prometheus-adapter created
poddisruptionbudget.policy/prometheus-adapter created
rolebinding.rbac.authorization.k8s.io/resource-metrics-auth-reader created
service/prometheus-adapter created
serviceaccount/prometheus-adapter created
servicemonitor.monitoring.coreos.com/prometheus-adapter created
clusterrole.rbac.authorization.k8s.io/prometheus-operator created
clusterrolebinding.rbac.authorization.k8s.io/prometheus-operator created
deployment.apps/prometheus-operator created
networkpolicy.networking.k8s.io/prometheus-operator created
prometheusrule.monitoring.coreos.com/prometheus-operator-rules created
service/prometheus-operator created
serviceaccount/prometheus-operator created
servicemonitor.monitoring.coreos.com/prometheus-operator created
```

修改不能拉取的镜像，`registry.k8s.io/prometheus-adapter/prometheus-adapter:v0.10.0` 修改为 `m.daocloud.io/registry.k8s.io/prometheus-adapter/prometheus-adapter:v0.10.0`
```shell
kubectl --namespace monitoring patch deployment prometheus-adapter \
    -p '{"spec": {"template": {"spec": {"containers": [{"name": "prometheus-adapter", "image": "m.daocloud.io/registry.k8s.io/prometheus-adapter/prometheus-adapter:v0.10.0"}]}}}}'
```

修改不能拉取的镜像，`registry.k8s.io/kube-state-metrics/kube-state-metrics:v2.9.2` 修改为 `m.daocloud.io/registry.k8s.io/kube-state-metrics/kube-state-metrics:v2.9.2`

```shell
kubectl --namespace monitoring patch deployment kube-state-metrics \
    -p '{"spec": {"template": {"spec": {"containers": [{"name": "kube-state-metrics", "image": "m.daocloud.io/registry.k8s.io/kube-state-metrics/kube-state-metrics:v2.9.2"}]}}}}'
```

#### 查看 monitoring 名字空间中的所有 Pod

```shell
kubectl get pods -n monitoring -w
```
```
NAME                                   READY   STATUS    RESTARTS   AGE
alertmanager-main-0                    2/2     Running   0          20m
alertmanager-main-1                    2/2     Running   0          20m
alertmanager-main-2                    2/2     Running   0          20m
blackbox-exporter-7d8c77d7b9-l2czf     3/3     Running   0          22m
grafana-79f47474f7-wpb8q               1/1     Running   0          22m
kube-state-metrics-8cc8f7df6-hk9qt     3/3     Running   0          22m
node-exporter-dl85m                    2/2     Running   0          22m
node-exporter-g85bc                    2/2     Running   0          22m
node-exporter-gw29m                    2/2     Running   0          22m
prometheus-adapter-6b88dfd544-6fwfh    1/1     Running   0          22m
prometheus-adapter-6b88dfd544-x9g5p    1/1     Running   0          22m
prometheus-k8s-0                       2/2     Running   0          20m
prometheus-k8s-1                       2/2     Running   0          20m
prometheus-operator-557b4f4977-f7xk2   2/2     Running   0          22m
```

### 访问 Prometheus, Grafana 和 Alertmanager Dashboards

#### Grafana Dashboard
```shell
kubectl --namespace monitoring port-forward svc/grafana 3000
```

在浏览器中访问 [http://localhost:3000](http://localhost:3000)

默认用户名和密码
```
Username: admin
Password: admin
```

##### 支持中文
通过导航菜单：首页 > 管理 > 默认首选项，修改属性
* Timezone: Browser Time
* Language: English

#### Prometheus Dashboard
```shell
kubectl --namespace monitoring port-forward svc/prometheus-k8s 9090
```

在浏览器中访问 [http://localhost:9090](http://localhost:9090)

#### Alert Manager Dashboard
```shell
kubectl --namespace monitoring port-forward svc/alertmanager-main 9093
```

在浏览器中访问 [http://localhost:9093](http://localhost:9093)

### 卸载 Prometheus monitoring stack
```shell
kubectl delete --ignore-not-found=true -f manifests/ -f manifests/setup
```

## 参考资料
* [Prometheus](https://github.com/prometheus)
* [Prometheus Docs](https://prometheus.io/docs/introduction/overview/)
* [Prometheus 中文文档](https://prometheus.fuckcloudnative.io/)
* [Prometheus Operator](https://github.com/prometheus-operator/prometheus-operator)
* [Grafana](https://grafana.com/grafana/)
* [Setup Prometheus and Grafana on Kubernetes using prometheus-operator](https://computingforgeeks.com/setup-prometheus-and-grafana-on-kubernetes/)
* [How can I edit a Deployment without modify the file manually?](https://stackoverflow.com/questions/36920171/how-can-i-edit-a-deployment-without-modify-the-file-manually)
