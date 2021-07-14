---
layout: post
title:  "Kubernetes中的Service"
date:   2021-07-01 00:00:00 +0800
categories: Kubernetes
tags: [kubectl, Service, expose, exec, run, bash, curl, env]
---

## Service
为一组功能相同的 Pod 提供固定地址的访问。

### 集群内访问服务
#### 创建服务
先部署之前的 kubia Deployment (kubia.yaml)
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: kubia
  labels:
    app: kubia
spec:
  selector:
    matchLabels:
      app: kubia
  replicas: 2
  template:
    metadata:
      labels:
        app: kubia
    spec:
      containers:
      - name: kubia
        image: wangjunjian/kubia:latest
        ports:
        - containerPort: 8080
```

创建 Deployment 对象
```shell
$ kubectl apply -f kubia.yaml 
deployment.apps/kubia created
```

* 使用 YAML 文件

```yaml
apiVersion: v1
kind: Service
metadata:
  name: kubia
  labels:
    app: kubia
spec:
  ports:
  - port: 8080
    targetPort: 8080
  selector:
    app: kubia
```

创建 Service 对象
```shell
$ kubectl apply -f kubia-service.yaml 
service/kubia created
```

* 使用命令 kubectl expose

```shell
$ kubectl expose deployment kubia --name=kubia-http
service/kubia-http exposed
```

查看服务
```shell
$ kubectl get svc
NAME         TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)    AGE
kubia        ClusterIP   10.109.180.140   <none>        8080/TCP   11m
kubia-http   ClusterIP   10.101.40.142    <none>        8080/TCP   9m57s
```

#### 测试服务
* 创建一个 Pod，使用 curl 请求服务，通过日志查看结果。

```shell
$ kubectl run get-kubia --image=centos -- curl -s 10.109.180.140:8080
pod/get-kubia created
```

> 为什么使用双横杠 ```--``` ?
```--``` 代表着 kubectl 命令项的结束。之后的内容是指在 Pod 内部执行的命令。如果后面的命令没有 ```-```，也不需要指定 ```--```。

查看日志
```shell
$ kubectl logs get-kubia
You've hit kubia-864465c9d-tfdmk
```

curl 如果不使用 ```-s``` 参数，会显示进度和错误信息。
```shell
$ kubectl logs get-kubia
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100    33    0    33    0     0  11000      0 --:--:-- --:--:-- --:--:-- 11000
You've hit kubia-864465c9d-tfdmk
```

* 使用 ssh 登录到 Kubernetes 集群的节点上，然后使用 curl 请求服务。

```shell
$ ssh username@node
$ curl 10.109.180.140:8080
You've hit kubia-864465c9d-xwbkd
```

* 使用 kubectl exec 登录已经存在的 Pod，前提是这个 Pod 里面安装了 curl。

```shell
kubectl exec kubia-864465c9d-xwbkd -- curl -s 10.109.180.140:8080
```

#### 配置服务的会话亲和性
通过设置 sessionAffinity 的属性为 ClientIP。
```yaml
apiVersion: v1
kind: Service
spec:
  sessionAffinity: ClientIP
```
* sessionAffinity
  - ClientIP, 同一个客户端 IP 转发到同一个 Pod 上。
  - None (default), 随机转发一个 Pod。

当 sessionAffinity 使用默认值 None，测试服务。
```shell
$ kubectl run get-kubia --image=centos -- bash -c "for _ in {1..4}; do curl -s 10.109.180.140:8080; done"
pod/get-kubia created
```
★ 这里为了执行多个命令，使用了 ```bash -c ""``` 的技巧，对于 ```kubectl exec``` 也可以使用。

过一会，通过查看日志，可以看到是随机访问不同的 Pod。
```shell
$ kubectl logs get-kubia
You've hit kubia-864465c9d-xwbkd
You've hit kubia-864465c9d-tfdmk
You've hit kubia-864465c9d-xwbkd
You've hit kubia-864465c9d-tfdmk
```

当 sessionAffinity 使用 ClientIP，测试服务。
```shell
$ kubectl run get-kubia --image=centos -- bash -c "for _ in {1..4}; do curl -s 10.109.180.140:8080; done"
pod/get-kubia created
```

过一会，通过查看日志，可以看到一直访问同一个 Pod。
```shell
$ kubectl logs get-kubia
You've hit kubia-864465c9d-xwbkd
You've hit kubia-864465c9d-xwbkd
You've hit kubia-864465c9d-xwbkd
You've hit kubia-864465c9d-xwbkd
```

#### 同一个服务暴露多个端口
如果您的 Pod 监听多个端口，可以使用一个服务暴露多个端口。

★ 在创建多个端口的服务时，必须为每个端口指定名字（name）。
```yaml
apiVersion: v1
kind: Service
metadata:
  name: kubia
spec:
  ports:
  - name: http
    port: 80
    targetPort: 8080
  - name: https
    port: 443
    targetPort: 8443
  selector:
    app: kubia
```

#### 使用命名的端口
在 Pod 中对 ports 的端口命名，然后在服务中的 ports 的 targetPort 属性值里引用。

★ 最大的好处是 Pod 的端口改变不会影响到服务的修改。
```yaml
apiVersion: v1
kind: Service
metadata:
  name: kubia
  labels:
    app: kubia
spec:
  ports:
  - name: http
    port: 8080
    targetPort: http
  selector:
    app: kubia

---

apiVersion: apps/v1
kind: Deployment
metadata:
  name: kubia
  labels:
    app: kubia
spec:
  selector:
    matchLabels:
      app: kubia
  replicas: 2
  template:
    metadata:
      labels:
        app: kubia
    spec:
      containers:
      - name: kubia
        image: wangjunjian/kubia:latest
        ports:
        - name: http
          containerPort: 8080
```

#### 服务发现
##### 通过环境变量发现服务
通过在现有的 Pod 中执行命令 env，这个 Pod 必须是在服务创建之后运行的。
```shell
$ kubectl exec kubia-6fdc7ff55d-qknsf -- env
PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
HOSTNAME=kubia-6fdc7ff55d-qknsf
KUBIA_SERVICE_HOST=10.105.17.27
KUBIA_SERVICE_PORT=8080
KUBERNETES_SERVICE_HOST=10.96.0.1
KUBERNETES_SERVICE_PORT=443
```
★ 可以看出环境变量的规则是：
  - HOST: ```服务名字大写（如果有横杠变为下划线）_SERVICE_HOST```
  - PORT: ```服务名字大写（如果有横杠变为下划线）_SERVICE_PORT```

下面创建一个 Pod，读取 kubia 服务的环境变量生成 URL。
```shell
$ kubectl run read-env-var --image=python:alpine -- python -c "import os; print('http://{}:{}'.format(os.environ['KUBIA_SERVICE_HOST'], os.environ['KUBIA_SERVICE_PORT']));"
pod/read-env-var created
```

查看日志
```shell
$ kubectl logs read-env-var
http://10.105.17.27:8080
```

##### 通过 DNS 发现服务
通过标签 k8s-app=kube-dns 在 kube-system 名字空间中查看 Kubernetes 的 DNS 服务。
```shell
$ kubectl get all -n kube-system -l k8s-app=kube-dns
NAME                           READY   STATUS    RESTARTS   AGE
pod/coredns-66bff467f8-89pfs   1/1     Running   6          392d
pod/coredns-66bff467f8-nt4wk   1/1     Running   6          392d

NAME               TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)                  AGE
service/kube-dns   ClusterIP   10.96.0.10   <none>        53/UDP,53/TCP,9153/TCP   392d

NAME                      READY   UP-TO-DATE   AVAILABLE   AGE
deployment.apps/coredns   2/2     2            2           392d

NAME                                 DESIRED   CURRENT   READY   AGE
replicaset.apps/coredns-66bff467f8   2         2         2       392d
```

在 Kubernetes 上运行的 Pod 都被配置成使用其作为 DNS（Kubernetes 通过修改容器的 ```/etc/resolv.conf``` 文件实现），运行在 Pod 上的进程 DNS 查询时都会被 Kubernetes 的 DNS 服务器响应，该服务知道系统里的所有服务。
```shell
$ kubectl exec -it kubia-6fdc7ff55d-qknsf -- cat /etc/resolv.conf
nameserver 10.96.0.10
search kubia.svc.cluster.local svc.cluster.local cluster.local
options ndots:5
```
可以看到 /etc/resolv.conf 文件里配置的 nameserver ```10.96.0.10``` 地址就是服务 kube-dns 的集群 IP。

注意：这里的 ```kubia``` 是名字空间。

##### 通过全限定域名(FQDN)来访问
这里分别使用省略了不同的后缀来访问 kubia 服务。
* kubia:8080 需要在同一个名字空间中
* kubia.kubia:8080
* kubia.kubia.svc:8080
* kubia.kubia.svc.cluster:8080
* kubia.kubia.svc.cluster.local:8080

```shell
$ kubectl run get-kubia --image=centos -- bash -c "curl -s kubia:8080; curl -s kubia.kubia:8080; curl -s kubia.kubia.svc:8080; curl -s kubia.kubia.svc.cluster:8080; curl -s kubia.kubia.svc.cluster.local:8080"
pod/get-kubia created
```

查看日志，可以看到都可以正确访问。
```shell
$ kubectl logs get-kubia
You've hit kubia-6fdc7ff55d-g9zfs
You've hit kubia-6fdc7ff55d-qknsf
You've hit kubia-6fdc7ff55d-g9zfs
You've hit kubia-6fdc7ff55d-qknsf
```

也可以使用 kubectl exec 连接到现有 Pod 访问服务。

## 参考资料
* [python image](https://hub.docker.com/_/python)
* [Working with Environment Variables in Python](https://www.twilio.com/blog/environment-variables-python)
* [string --- 常见的字符串操作](https://docs.python.org/zh-cn/3/library/string.html)
