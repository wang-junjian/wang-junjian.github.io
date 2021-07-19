---
layout: post
title:  "Kubernetes中的Service"
date:   2021-07-01 00:00:00 +0800
categories: Kubernetes
tags: [kubectl, Service, expose, exec, run, bash, curl, env, JSONPath]
---

## Service
为一组功能相同的 Pod 提供固定地址的访问。

### 集群内部的服务
在集群内部运行多个 Pod 服务。

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
  - port: 80
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
NAME         TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)   AGE
kubia        ClusterIP   10.109.180.140   <none>        80/TCP    11m
kubia-http   ClusterIP   10.101.40.142    <none>        80/TCP    9m57s
```
svc 是 Service 的缩写

#### 测试服务
* 创建一个 Pod，使用 curl 请求服务，通过日志查看结果。

```shell
$ kubectl run get-kubia --image=centos -- curl -s 10.109.180.140
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
$ curl 10.109.180.140
You've hit kubia-864465c9d-xwbkd
```

* 使用 kubectl exec 登录已经存在的 Pod，前提是这个 Pod 里面安装了 curl。

```shell
kubectl exec kubia-864465c9d-xwbkd -- curl -s 10.109.180.140
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
$ kubectl run get-kubia --image=centos -- bash -c "for _ in {1..4}; do curl -s 10.109.180.140; done"
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
$ kubectl run get-kubia --image=centos -- bash -c "for _ in {1..4}; do curl -s 10.109.180.140; done"
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
    port: 80
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
KUBIA_SERVICE_PORT=80
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
http://10.105.17.27
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

注意：这里的 ```kubia``` 是名字空间，如果您使用的是默认名字空间应该是 ```default```。

##### 通过全限定域名(FQDN)来访问
这里分别使用省略了不同的后缀来访问 kubia 服务。
* kubia 需要在同一个名字空间中
* kubia.kubia
* kubia.kubia.svc
* kubia.kubia.svc.cluster
* kubia.kubia.svc.cluster.local

```shell
$ kubectl run get-kubia --image=centos -- bash -c "curl -s kubia; curl -s kubia.kubia; curl -s kubia.kubia.svc; curl -s kubia.kubia.svc.cluster; curl -s kubia.kubia.svc.cluster.local"
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

### 连接集群外部的服务
通过服务访问集群外部的服务。

这样可以让您充分利用服务负载均衡和服务发现的能力。让集群内的客户端可以像连接内部服务一样连接外部服务。可以看到 Endpoints 属性里是一组 Pod 的 IP 和端口的列表。

#### Endpoint
服务并不是直接与 Pod 相连，它们之间有一种资源就是 Endpoint。通过 kubectl describe 可以查看到。
```shell
$ kubectl describe svc kubia
Name:              kubia
Namespace:         kubia
Labels:            app=kubia
Annotations:       Selector:  app=kubia
Type:              ClusterIP
IP:                10.105.17.27
Port:              http  80/TCP
TargetPort:        http/TCP
Endpoints:         10.32.0.18:8080,10.34.0.4:8080
Session Affinity:  None
Events:            <none>
```

可以像查看其它资源一样，查看 Endpoint 的基本信息。
```shell
$ kubectl get endpoints kubia
NAME    ENDPOINTS                        AGE
kubia   10.32.0.18:8080,10.34.0.4:8080   19h
```

#### 手动配置 Endpoint

编写服务的 YAML 文件（external-service.yaml），不要设置标签选择器。没有标签选择器，Kubernetes 将停止更新 Endpoints。
```yaml
apiVersion: v1
kind: Service
metadata:
  name: external-service
spec:
  ports:
  - port: 80
```

创建服务对象
```shell
$ kubectl apply -f external-service.yaml 
service/external-service created
```

编写 Endpoint 的 YAML 文件（external-service-endpoints.yaml）
```yaml
apiVersion: v1
kind: Endpoints
metadata:
  name: external-service
subsets:
  - addresses:
    - ip: 11.11.11.11
    - ip: 22.22.22.22
    ports:
    - port: 80
```

名字必须和服务的相同。

创建 Endpoint 对象
```shell
$ kubectl apply -f external-service-endpoints.yaml 
endpoints/external-service created
```

#### 为外部服务创建别名

编写服务的 YAML 文件（external-service-externalname.yaml）
```yaml
apiVersion: v1
kind: Service
metadata:
  name: external-service
spec:
  type: ExternalName
  externalName: api.github.com
```
尝试测试 https 的访问，设置了 port: 443，不能访问。

创建服务对象
```shell
$ kubectl apply -f external-service-externalname.yaml
service/external-service created
```

创建一个 Pod 用于测试
```shell
$ kubectl run get-external-service --image=centos -- bash -c "sleep 1000"
pod/get-external-service created
```

进入容器内，使用 ```curl 服务名``` 进行访问。
```shell
$ kubectl exec -it get-external-service -- bash
[root@get-external-service /]# curl external-service
```

查看服务信息
```shell
$ kubectl get svc external-service 
NAME               TYPE           CLUSTER-IP   EXTERNAL-IP      PORT(S)   AGE
external-service   ExternalName   <none>       api.github.com   443/TCP   24m
```

★ 可以看到服务并没有集群IP。是因为 Kubernetes 为服务创建了简单的 CNAME DNS 记录。连接服务的客户端直接连接外部的服务，完全绕过了服务代理。

### 将服务暴露给外部客户端
将集群内部的服务开放给外部的用户使用。

有多种方式设置：
* NodePort
* LoadBalancer
* Ingress

#### NodePort 类型的服务
设置为 NodePort 类型，将在集群的每个节点上打开一个端口，当连接进来后，转发给集群内的服务。

编写服务的 YAML 文件（kubia-nodeport.yaml）
```yaml
apiVersion: v1
kind: Service
metadata:
  name: kubia-nodeport
  labels:
    app: kubia
spec:
  type: NodePort
  ports:
  - port: 80
    targetPort: 8080
    nodePort: 30123
  selector:
    app: kubia
```
* type: NodePort
* nodePort: 30123 设置固定的 Node 端口，如果没有设置，Kubernetes 将随机指定端口。

创建服务对象
```shell
$ kubectl apply -f kubia.yaml 
deployment.apps/kubia created
$ kubectl apply -f kubia-nodeport.yaml
service/kubia-nodeport created
```

查看服务信息
```shell
$ kubectl get svc kubia 
NAME             TYPE       CLUSTER-IP      EXTERNAL-IP   PORT(S)        AGE
kubia-nodeport   NodePort   10.106.34.250   <none>        80:30123/TCP   3m48s
```

可以通过以下地址访问服务
* 10.106.34.250（服务IP，只能在集群内有效）
* 集群内的节点IP:30123（NodePort方式，可以在集群外访问）

查看集群节点的 IP
* JSONPath
```shell
$ kubectl get nodes -o jsonpath='{.items[*].status.addresses[?(@.type=="InternalIP")].address}'
172.16.33.157 172.16.33.158 172.16.33.159 172.16.33.174
```

* wide
```shell
$ kubectl get nodes -o wide
NAME   STATUS     ROLES    AGE     VERSION   INTERNAL-IP     EXTERNAL-IP   OS-IMAGE           KERNEL-VERSION     CONTAINER-RUNTIME
ln1    Ready      master   393d    v1.18.3   172.16.33.157   <none>        Ubuntu 20.04 LTS   5.4.0-26-generic   docker://19.3.12
ln2    Ready      <none>   393d    v1.18.3   172.16.33.158   <none>        Ubuntu 20.04 LTS   5.4.0-26-generic   docker://19.3.11
ln3    Ready      <none>   393d    v1.18.3   172.16.33.159   <none>        Ubuntu 20.04 LTS   5.4.0-26-generic   docker://19.3.11
ln6    Ready      <none>   7d22h   v1.18.3   172.16.33.174   <none>        Ubuntu 20.04 LTS   5.4.0-72-generic   docker://20.10.2
```

访问服务
```shell
$ curl 172.16.33.157:30123
You've hit kubia-864465c9d-qc7mn
$ curl 172.16.33.158:30123
You've hit kubia-864465c9d-nm7rw
```

#### LoadBalancer 类型的服务
NodePort 的扩展，需要云基础设施的支持，是对所有 NodePort 的负载均衡，避免了某个节点失效了不能访问到服务，保障了请求路由到健康的节点。

编写服务的 YAML 文件（kubia-loadbalancer.yaml）
```yaml
apiVersion: v1
kind: Service
metadata:
  name: kubia-loadbalancer
  labels:
    app: kubia
spec:
  type: LoadBalancer
  ports:
  - port: 80
    targetPort: 8080
  selector:
    app: kubia
```

查看服务信息
```shell
$ kubectl get svc kubia-loadbalancer 
NAME                 TYPE           CLUSTER-IP       EXTERNAL-IP   PORT(S)        AGE
kubia-loadbalancer   LoadBalancer   10.102.116.207   <pending>     80:32288/TCP   2m31s
```

正常情况下会在 EXTERNAL-IP 看到一个 IP。如果 Kubernetes 在不支持 LoadBalancer 服务的环境中运行，服务将和 NodePort 的表现是一样的，可以像使用 NodePort 服务一样访问。

服务访问
```shell
$ curl EXTERNAL-IP
```

##### 外部连接的特性
* 不必要的网络跳转
```yaml
spec:
  externalTrafficPolicy: Local #选择本地运行的Pod
```
★ 缺点：1、如果本地没有 Pod，连接将被挂起；2、可能导致跨 Pod 的负载分布不均衡。

* 不记录客户端 IP
当通过节点端口访问时，跳转到 Pod 前会对数据包做源网络地址转换(SNAT)，所以源 IP 会被修改。

#### Ingress 类型的服务

编写 Ingress 的 YAML 文件（kubia-ingress.yaml）
```yaml
apiVersion: extensions/v1beta1
kind: Ingress
metadata:
  name: kubia
spec:
  backend:
    serviceName: kubia-nodeport
    servicePort: 80
  rules:
  - host: kubia.example.com
    http:
      paths:
      - path: /
        backend:
          serviceName: kubia-nodeport
          servicePort: 80
```

```shell
$ kubectl apply -f kubia-deployment.yaml 
deployment.apps/kubia created
$ kubectl apply -f kubia-nodeport.yaml
service/kubia-nodeport created
$ kubectl apply -f kubia-ingress.yaml
ingress.extensions/kubia created
```

查看 Ingress 对象
```shell
$ kubectl get ingress
NAME    CLASS    HOSTS               ADDRESS         PORTS   AGE
kubia   <none>   kubia.example.com   172.16.33.157   80      89s
```

在客户端配置 DNS。打开 /etc/hosts 文件（Windows 系统为 C:\windows\system32\drivers\etc\hosts），增加下面的配置信息。
```
172.16.33.157   kubia.example.com
```

通过 Ingress 访问服务。
```shell
curl http://kubia.example.com
```

## 参考资料
* [服务](https://kubernetes.io/zh/docs/concepts/services-networking/service/)
* [kubectl 命令帮助](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands)
* [JSONPath Online Evaluator](https://jsonpath.com)
* [python image](https://hub.docker.com/_/python)
* [Working with Environment Variables in Python](https://www.twilio.com/blog/environment-variables-python)
* [string --- 常见的字符串操作](https://docs.python.org/zh-cn/3/library/string.html)
* [curl 的用法指南](https://www.ruanyifeng.com/blog/2019/09/curl-reference.html)
* [GitHub REST API overview](https://docs.github.com/en/rest/overview)
* [How to test a REST api from command line with curl](https://www.codepedia.org/ama/how-to-test-a-rest-api-from-command-line-with-curl/)
* [Jinja](https://jinja.palletsprojects.com/en/3.0.x/)
* [Ingress](https://kubernetes.io/zh/docs/concepts/services-networking/ingress/)
* [Empty ADDRESS kubernetes ingress](https://stackoverflow.com/questions/51511547/empty-address-kubernetes-ingress)
* [Lab 10.1 - <error: endpoints "default-http-backend" not found> - Solved](https://forum.linuxfoundation.org/discussion/857080/lab-10-1-solved)
