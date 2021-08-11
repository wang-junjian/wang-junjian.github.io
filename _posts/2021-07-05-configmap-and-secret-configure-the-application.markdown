---
layout: post
title:  "ConfigMap和Secret：配置应用程序"
date:   2021-07-05 00:00:00 +0800
categories: Kubernetes
tags: [ConfigMap, Secret, Docker, Dockerfile, kubectl, command, args, ENTRYPOINT, CMD, curl, nginx]
---

## 向容器传递命令行参数
### 在 Docker 中定义命令与参数
下面是 Dockerfile 中的指令 ENTRYPOINT 和 CMD。

| 指令 | 解释 |
| --- | --- |
| ENTRYPOINT | 容器启动时调用的命令 |
| CMD | 传递给 ENTRYPOINT 指定命令的参数 |

### 构建带参数的程序（date:args）
编写脚本 date.sh
```shell
#!/bin/sh
INTERVAL=$1
while :
do
  echo $(date)
  sleep $INTERVAL
done
```

编写 Dockerfile
```dockerfile
FROM busybox
ADD date.sh /date.sh
RUN chmod +x /date.sh
ENTRYPOINT ["/date.sh"]
CMD ["1"]
```
参数默认值为 1，在运行容器可以设置参数覆盖默认值。

构建镜像
```shell
docker build -t wangjunjian/date:args .
```

### 在 Docker 中覆盖命令和参数
使用 Docker 运行镜像来设置命令和参数
```shell
docker run [--entrypoint=] <image> [arg1, arg2, arg3]
```

启动镜像
```shell
$ docker run wangjunjian/date:args
Tue Aug 3 13:08:04 UTC 2021
Tue Aug 3 13:08:05 UTC 2021
```

设置参数覆盖默认睡眠时间
```shell
$ docker run wangjunjian/date:args 3
Tue Aug 3 13:08:46 UTC 2021
Tue Aug 3 13:08:49 UTC 2021
```

覆盖默认的命令
```shell
$ docker run --entrypoint=/bin/sh wangjunjian/date:args
/ # 
```

### 在 Kubernetes 中覆盖命令和参数
在定义 Pod 时设置命令和参数
```yaml
kind: Pod
spec:
  containers:
  - image: image
    command: ["/bin/command"]
    args: ["arg1", "arg2", "arg3"]
```

少量参数的设置可以使用上面的数组表示，当```参数过多```时可以使用下面的方式，如果参数是数值型需要使用引号。
```yaml
    args:
    - str
    - "3"
```

在 Docker 和 Kubernetes 中指定命令和参数

| Docker | Kubernetes | 描述 |
| ---    | ---        | --- |
| ENTRYPOINT | command | 容器中运行的命令 |
| CMD        | args    | 传给命令的参数 |

使用自定义睡眠时间运行 date

编写 date.yaml
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: date
spec:
  containers:
  - image: wangjunjian/date:args
    name: date
    args: ["3"]
```

部署 Pod
```shell
kubectl apply -f date.yaml
```

查看运行日志
```shell
$ kubectl logs date
Tue Aug 3 13:51:22 UTC 2021
Tue Aug 3 13:51:25 UTC 2021
```

## 为容器设置环境变量
### 构建通过环境变量配置的程序（date:env）
编写脚本 date.sh
```shell
#!/bin/sh
while :
do
  echo $(date)
  sleep $INTERVAL
done
```

| 编程语言 | 访问环境变量 |
| ---     | ---        |
| Shell   | $ENV_VAR |
| Python  | os.environ["ENV_VAR"] |
| Go      | os.Getenv("ENV_VAR") |
| C/C++   | getenv("ENV_VAR") |
| Java    | System.getenv("ENV_VAR") |
| Node.JS | process.env.ENV_VAR |

编写 Dockerfile
```dockerfile
FROM busybox
ADD date.sh /date.sh
RUN chmod +x /date.sh
ENV INTERVAL=1
ENTRYPOINT ["/date.sh"]
```
参数默认值为 1，在运行容器可以设置参数覆盖默认值。

构建镜像
```shell
docker build -t wangjunjian/date:env .
```

### 在 Docker 中设置环境变量
运行 Docker 镜像时设置环境变量
```shell
docker run [--env var1=value] <image>
```

启动镜像
```shell
$ docker run wangjunjian/date:env
Tue Aug 3 14:24:33 UTC 2021
Tue Aug 3 14:24:34 UTC 2021
```

设置环境变量覆盖默认睡眠时间
```shell
$ docker run -e INTERVAL=3 wangjunjian/date:env
Tue Aug 3 14:25:50 UTC 2021
Tue Aug 3 14:25:53 UTC 2021
```

### 在 Kubernetes 中设置环境变量
在定义 Pod 时设置环境变量
```yaml
kind: Pod
spec:
  containers:
  - image: image
    env:
    - name: var1
      value: "value"
```

使用环境变量设置睡眠时间运行 date

编写 date.yaml
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: date
spec:
  containers:
  - image: wangjunjian/date:env
    name: date
    env:
    - name: INTERVAL
      value: "3"
```

部署 Pod
```shell
kubectl apply -f date.yaml
```

查看运行日志
```shell
$ kubectl logs date
Tue Aug 3 14:44:32 UTC 2021
Tue Aug 3 14:44:35 UTC 2021
```

### 在环境变量中引用环境变量
```yaml
env:
- name: VAR1
  value: "value1"
- name: VAR2
  value: "$(VAR1) value2"
```
```command``` 和 ```args``` 也可以这样用。

## 利用 ConfigMap 解耦配置
**在 Pod 定义中进行硬编码，导致部署在不同环境（开发、测试、生产）需要分别定义不同的 Pod。**

ConfigMap 本质就是键/值对。

### ConfigMap 操作
#### 创建
字面量
```shell
kubectl create configmap date-config --from-literal=sleep-interval=3
# 创建多项
kubectl create configmap date-config --from-literal=one=1 --from-literal=two=2
```

文件
```shell
# 默认文件名就是键名
kubectl create configmap date-config --from-file=requests-pod.yaml
# 设置键名
kubectl create configmap date-config --from-file=customkey=requests-pod.yaml
```

目录
```shell
# 文件夹下的每个文件单独创建一项
kubectl create configmap date-config --from-file=dir/
```

混合
```shell
kubectl create configmap date-config --from-literal=sleep-interval=3 \
  --from-file=requests-pod.yaml \
  --from-file=hello/
```

使用 Kubernetes API创建。
定义 ConfigMap YAML 文件（date-config.yaml）
```yaml
apiVersion: v1
kind: ConfigMap
data:
  sleep-interval: "3"
metadata:
  name: date-config
```

```shell
kubectl apply -f date-config.yaml
```

#### 查看
get
```shell
$ kubectl get configmap date-config -o yaml
apiVersion: v1
data:
  sleep-interval: "3"
kind: ConfigMap
metadata:
  creationTimestamp: "2021-08-11T01:08:53Z"
  name: date-config
  namespace: default
  resourceVersion: "1383722"
  uid: 887229e7-4934-483f-9890-9cd33cbf7237
```

describe
```shell
$ kubectl describe configmap date-config
Name:         date-config
Namespace:    default
Labels:       <none>
Annotations:  <none>

Data
====
sleep-interval:
----
3
Events:  <none>
```

#### 修改
```shell
kubectl edit configmap date-config
```

#### 删除
```shell
kubectl delete configmap date-config
```

### 给容器传递 ConfigMap 条目作为环境变量
定义 Pod YAML (date-config.yaml)
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: date
spec:
  containers:
  - image: wangjunjian/date:env
    name: date
    env:
    - name: INTERVAL
      valueFrom:
        configMapKeyRef:
          name: date-config
          key: sleep-interval
```

创建 Pod 对象
```shell
kubectl apply -f date-config.yaml
```

### 一次性传递 ConfigMap 的所有条目作为环境变量
上面的 Pod 定义，需要一个条目一个条目的描述，当条目太多时比较麻烦，可以一次性传递多个条目。

定义 Pod YAML (test.yaml)
```shell
apiVersion: v1
kind: Pod
metadata:
  name: test
spec:
  containers:
  - image: busybox
    name: test
    command: ["/bin/sh", "-c", "sleep 86400"]
    envFrom:
    - prefix: CONFIG_
      configMapRef:
        name: test-config
```
- prefix 是可选的

创建 ConfigMap 对象
```shell
kubectl create configmap test-config --from-literal=sleep-interval=3 --from-literal=one=1 --from-literal=two=2
```

创建 Pod 对象
```shell
kubectl apply -f test.yaml
```

查看容器中的环境变量
```shell
$ kubectl exec -it test -- env
HOSTNAME=test
CONFIG_one=1
CONFIG_sleep-interval=3
CONFIG_two=2
```

### 使用 configMap 卷将条目暴露为文件
**Nginx 默认配置文件 /etc/nginx/nginx.conf，默认配置文件会自动嵌入子文件夹 /etc/nginx/conf.d/ 下所有的 .conf 文件。**

通过 Nginx 的配置文件开启压缩功能，让服务器使用压缩传递给客户端响应。
这里编写我们的配置文件（nginx-config-gzip-on.conf）挂载到 /etc/nginx/conf.d/ 文件夹。
```conf
server {
    listen       80;
    server_name  localhost;

    gzip  on;
    gzip_types text/plain application/xml;

    location / {
        root   /usr/share/nginx/html;
        index  index.html index.htm;
    }
}
```

创建 ConfigMap 对象
```shell
kubectl create configmap nginx-config --from-file=nginx-config-gzip-on.conf --from-literal=sleep-interval=3
```

查看 nginx-config
```shell
$ kubectl get configmap nginx-config -o yaml
apiVersion: v1
data:
  nginx-config-gzip-on.conf: |
    server {
        listen       80;
        server_name  localhost;

        gzip  on;
        gzip_types text/plain application/xml;

        location / {
            root   /usr/share/nginx/html;
            index  index.html index.htm;
        }
    }
  sleep-interval: "3"
kind: ConfigMap
metadata:
  creationTimestamp: "2021-08-11T07:12:28Z"
  name: nginx-config
  namespace: default
  resourceVersion: "1399157"
  uid: 7f350db5-536d-40fd-b553-43e8a9575f29
```

编写 Pod YAML 文件（nginx-pod-configmap-volume.yaml）
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx-pod-configmap-volume
spec:
  containers:
  - image: nginx:alpine
    name: nginx
    volumeMounts:
    - name: config
      mountPath: /etc/nginx/conf.d
      readOnly: true
  volumes:
  - name: config
    configMap:
      name: nginx-config
```

创建 Pod 对象
```shell
kubectl apply -f nginx-pod-configmap-volume.yaml
```

通过端口转发连接 Pod
```shell
$ kubectl port-forward nginx-pod-configmap-volume 8080:80
Forwarding from 127.0.0.1:8080 -> 80
Forwarding from [::1]:8080 -> 80
```

利用 curl 检查服务器响应来验证配置是否生效。
```shell
$ curl -H "Accept-Encoding: gzip" -I localhost:8080
HTTP/1.1 200 OK
Server: nginx/1.21.1
Date: Wed, 11 Aug 2021 07:33:37 GMT
Content-Type: text/html
Last-Modified: Tue, 06 Jul 2021 15:21:03 GMT
Connection: keep-alive
ETag: W/"60e474df-264"
Content-Encoding: gzip
```

检查被挂载的 configMap 卷的内容。如果 ConfigMap 有多个条目会出现多个文件。
```shell
$ kubectl exec nginx-pod-configmap-volume -c nginx -- ls /etc/nginx/conf.d
nginx-config-gzip-on.conf
sleep-interval
```

### 卷内暴露指定的 ConfigMap 条目
对于上面的 sleep-interval 项，Nginx 服务器并不需要。

编写 Pod YAML 文件（nginx-pod-configmap-volume-with-items.yaml）
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx-pod-configmap-volume-with-items
spec:
  containers:
  - image: nginx:alpine
    name: nginx
    volumeMounts:
    - name: config
      mountPath: /etc/nginx/conf.d
      readOnly: true
  volumes:
  - name: config
    configMap:
      name: nginx-config
      items:
      - key: nginx-config-gzip-on.conf
        path: gzip-on.conf
```
- path 必须指定。

创建 Pod 对象
```shell
kubectl apply -f nginx-pod-configmap-volume-with-items.yaml
```

检查被挂载的 configMap 卷的内容。
```shell
$ kubectl exec nginx-pod-configmap-volume-with-items -c nginx -- ls /etc/nginx/conf.d
gzip-on.conf
```

### ConfigMap 独立条目作为文件被挂载且不隐藏文件夹中的其它文件
通过运行 nginx:alpine 容器可以看到在 /etc/nginx/conf.d 目录下有个　default.conf 文件。挂载我们的配置文件不想隐藏掉这个配置文件。
```shell
$ docker run --rm nginx:alpine ls /etc/nginx/conf.d
default.conf
```

编写 Pod YAML 文件（nginx-pod-configmap-volume-with-items-no-hide-files.yaml）
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx-pod-configmap-volume-with-items-no-hide-files
spec:
  containers:
  - image: nginx:alpine
    name: nginx
    volumeMounts:
    - name: config
      mountPath: /etc/nginx/conf.d/nginx-config-gzip-on.conf
      subPath: nginx-config-gzip-on.conf
      readOnly: true
  volumes:
  - name: config
    configMap:
      name: nginx-config
      defaultMode: 0660
```
- mountPath 挂载的是文件路径
- subPath 指定条目 nginx-config-gzip-on.conf
- defaultMode 默认权限是 644(-rw-r--r--)，这里设置用户和组可以读写权限 660(-rw-rw----)

创建 Pod 对象
```shell
kubectl apply -f nginx-pod-configmap-volume-with-items-no-hide-files.yaml
```

检查被挂载的 configMap 卷的内容。
```shell
$ kubectl exec nginx-pod-configmap-volume-with-items-no-hide-files -c nginx -- ls -l /etc/nginx/conf.d
-rw-r--r--    1 root     root          1093 Aug 11 09:19 default.conf
-rw-rw----    1 root     root           217 Aug 11 09:19 nginx-config-gzip-on.conf
```

## 参考资料
* [python](https://hub.docker.com/_/python)
* [nginx](https://hub.docker.com/_/nginx)
* [curl](https://hub.docker.com/r/curlimages/curl)
