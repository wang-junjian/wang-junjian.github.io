---
layout: post
title:  "安装Kubernetes Dashboard"
date:   2021-10-23 00:00:00 +0800
categories: Kubernetes
tags: [kubectl, macOS]
---

## 用户界面 Dashboard
Dashboard 是基于网页的 Kubernetes 用户界面。您可以使用 Dashboard 将容器应用部署到 Kubernetes 集群中，也可以对容器应用排错，还能管理集群资源。您可以使用 Dashboard 获取运行在集群中的应用的概览信息，也可以创建或者修改 Kubernetes 资源（如 Deployment，Job，DaemonSet 等等）。例如，您可以对 Deployment 实现弹性伸缩、发起滚动升级、重启 Pod 或者使用向导创建新的应用。

## 部署 Dashboard
### 安装 Dashboard
```bash
kubectl apply -f https://raw.githubusercontent.com/kubernetes/dashboard/v2.4.0/aio/deploy/recommended.yaml
```

过几分钟后您将看到 kubernetes-dashboard 名字空间下会有 Pod 运行。
```bash
kubectl get pods -n kubernetes-dashboard

NAME                                         READY   STATUS    RESTARTS   AGE
dashboard-metrics-scraper-6b4884c9d5-27xf6   1/1     Running   0          4m
kubernetes-dashboard-7b544877d5-mfmbp        1/1     Running   0          4m
```

### 创建 admin-user 用户，绑定 RBAC 角色。
为了保护您的集群数据，默认情况下，Dashboard 会使用最少的 RBAC 配置进行部署。 当前，Dashboard 仅支持使用 Bearer 令牌登录。 

```bash
cat <<EOF | kubectl apply -f -
---
apiVersion: v1
kind: ServiceAccount
metadata:
  name: admin-user
  namespace: kubernetes-dashboard
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: admin-user
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: cluster-admin
subjects:
- kind: ServiceAccount
  name: admin-user
  namespace: kubernetes-dashboard
---
EOF
```

### 获得 admin-user 的 Token
```bash
kubectl -n kubernetes-dashboard describe secret admin-user-token | grep ^token
```

## 访问 Dashboard
创建代理服务器连接本地主机和Kubernetes API服务器。(可以使用参数--port=number来指定端口。)
```bash
kubectl proxy
```

### 在创建代理服务器的系统中访问 Dashboard
在浏览器里输入地址 [http://localhost:8001/api/v1/namespaces/kubernetes-dashboard/services/https:kubernetes-dashboard:/proxy/](http://localhost:8001/api/v1/namespaces/kubernetes-dashboard/services/https:kubernetes-dashboard:/proxy/) 访问。

输入 Token 信息登录。完成后，我们可以看到 Kubernetes 集群信息。

### 远程访问Dashboard（在本地创建ssh隧道）
```bash
# -L 8001 本机的端口号，可以是任意。
ssh -L 8001:127.0.0.1:8001 -N -f -l <username> <kubernetes master hostname or ip> 
```

在您的本地浏览器输入地址 [http://localhost:8001/api/v1/namespaces/kubernetes-dashboard/services/https:kubernetes-dashboard:/proxy/](http://localhost:8001/api/v1/namespaces/kubernetes-dashboard/services/https:kubernetes-dashboard:/proxy/) 访问。

### NodePort
这种方式只推荐在开发环境下单节点安装。

编辑 ```kubernetes-dashboard``` 服务。
```bash
sudo kubectl -n kubernetes-dashboard edit service kubernetes-dashboard
```

修改内容 ```type: ClusterIP``` 为 ```type: NodePort``` ，保存文件。
```yaml
# Please edit the object below. Lines beginning with a '#' will be ignored,
# and an empty file will abort the edit. If an error occurs while saving this file will be
# reopened with the relevant failures.
#
apiVersion: v1
kind: Service
metadata:
  annotations:
    kubectl.kubernetes.io/last-applied-configuration: |
      {"apiVersion":"v1","kind":"Service","metadata":{"annotations":{},"labels":{"k8s-app":"kubernetes-dashboard"},"name":"kubernete
  creationTimestamp: "2020-05-14T08:58:29Z"
  labels:
    k8s-app: kubernetes-dashboard
  name: kubernetes-dashboard
  namespace: kubernetes-dashboard
  resourceVersion: "129620"
  selfLink: /api/v1/namespaces/kubernetes-dashboard/services/kubernetes-dashboard
  uid: 81872828-d6b4-4673-b1c1-4744e3a7659c
spec:
  clusterIP: 10.43.33.68
  externalTrafficPolicy: Cluster
  ports:
  - nodePort: 32339
    port: 443
    protocol: TCP
    targetPort: 8443
  selector:
    k8s-app: kubernetes-dashboard
  sessionAffinity: None
  type: NodePort
status:
  loadBalancer: {}
```

查看服务的端口
```bash
sudo kubectl -n kubernetes-dashboard get service kubernetes-dashboard
NAME                   TYPE       CLUSTER-IP    EXTERNAL-IP   PORT(S)         AGE
kubernetes-dashboard   NodePort   10.43.33.68   <none>        443:32339/TCP   2d
```
您会看到 Dashboard 暴露出端口 ```32339(HTTPS)```，现在可以在您的浏览器中访问```https://<master-ip>:32339```。如果您是多节点的集群，也可以使用节点IP访问，```https://<node-ip>:<nodePort>```。

## 本地访问 Dashboard
### 在本地计算机[安装kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/) ，下面是我在macOS下安装的步骤。
* 下载最新的版本。
```bash
curl -LO "https://storage.googleapis.com/kubernetes-release/release/$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)/bin/darwin/amd64/kubectl"
```
* 下载指定的版本。
```bash
curl -LO "https://dl.k8s.io/release/v1.21.5/bin/darwin/amd64/kubectl"
```
* 增加 kubectl 可执行权限。
```bash
chmod +x ./kubectl
```
* 移动 kubectl 到您的PATH下。
```bash
sudo mv kubectl /usr/local/bin/kubectl
```
* 验证您安装的版本。
```bash
kubectl version --client
```

### 拷贝master节点的 /etc/kubernetes/admin.conf 文件到本地 ~/.kube/config
```bash
scp lnsoft@172.16.33.157:/etc/kubernetes/admin.conf ~/.kube/config
```

### 在本地创建代理服务器
```bash
kubectl proxy
```

### 在本地浏览器里输入地址访问。
[http://localhost:8001/api/v1/namespaces/kubernetes-dashboard/services/https:kubernetes-dashboard:/proxy/](http://localhost:8001/api/v1/namespaces/kubernetes-dashboard/services/https:kubernetes-dashboard:/proxy/)

## 参考资料
* [网页界面 (Dashboard)](https://kubernetes.io/zh/docs/tasks/access-application-cluster/web-ui-dashboard/)
* [Accessing Dashboard](https://github.com/kubernetes/dashboard/blob/master/docs/user/accessing-dashboard/README.md)
* [Is accessing kubernetes dashboard remotely possible?](https://www.edureka.co/community/31282/is-accessing-kubernetes-dashboard-remotely-possible)
* [[Day 16]K3s 叢集搭建](https://ithelp.ithome.com.tw/articles/10223759)
* [(3/8) Install and configure a Kubernetes cluster with k3s to self-host applications](https://kauri.io/38-install-and-configure-a-kubernetes-cluster-with/418b3bc1e0544fbc955a4bbba6fff8a9/a)
