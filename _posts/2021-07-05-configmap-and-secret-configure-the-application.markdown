---
layout: post
title:  "ConfigMap和Secret：配置应用程序"
date:   2021-07-05 00:00:00 +0800
categories: Kubernetes
tags: [ConfigMap, Secret, Docker, Dockerfile, docker-registry, kubectl, command, env, args, ENTRYPOINT, CMD, curl, nginx, JSONPath, openssl, HTTPS, DockerHub]
---

## **ConfigMap**

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

### 在 Pod 中引用不存在的 ConfigMap
创建 Pod 对象时，没有引用的 ConfigMap 对象。可以看到在调度时出现的错误信息。
```shell
$ kubectl describe pod date
Name:         date
...
Containers:
  date:
    Image:          wangjunjian/date:env
...
    State:          Waiting
      Reason:       CreateContainerConfigError
    Environment:
      INTERVAL:  <set to the key 'sleep-interval' of config map 'date-config'>  Optional: false
...
Events:
  Type     Reason     Age                From               Message
  ----     ------     ----               ----               -------
  Normal   Scheduled  28s                default-scheduler  Successfully assigned default/date to minikube
  Normal   Pulled     12s (x3 over 27s)  kubelet            Container image "wangjunjian/date:env" already present on machine
  Warning  Failed     12s (x3 over 27s)  kubelet            Error: configmap "date-config" not found
```

**可以设置对 ConfigMap 的引用是可选的，configMapKeyRef.optional: true。没有引用的 ConfigMap 对象，也可以调度成功。**

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
通过运行 nginx:alpine 容器可以看到在 /etc/nginx/conf.d 目录下有个 default.conf 文件。挂载我们的配置文件不想隐藏掉这个配置文件。
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
- defaultMode 设置文件权限。默认是 644(-rw-r--r--)，这里设置文件拥有者的用户和组可读写 660(-rw-rw----)。

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

### 配置热更新（更新应用配置且不重启应用程序）
修改 ConfigMap
```shell
kubectl edit configmap nginx-config
```

打开编辑器，修改 gzip  on 为 gzip  off，保存退出。等待一会，修改的配置会自动更新卷中对应的文件。

验证
```shell
kubectl exec -it nginx-pod-configmap-volume -- cat /etc/nginx/conf.d/nginx-config-gzip-on.conf
```

可以看到配置文件更新了，但 Nginx 并没有什么影响，这是因为 Nginx 没有监控文件的更新并重启。

手动重启
```shell
kubectl exec -it nginx-pod-configmap-volume -- nginx -s reload
```

**需要应用支持重载配置**

#### 文件被自动更新的过程
修改 ConfigMap 前
```shell
$ kubectl exec -it nginx-pod-configmap-volume -- ls -lA /etc/nginx/conf.d
total 0
drwxr-xr-x    2 root     root            61 Aug 12 01:39 ..2021_08_12_01_39_48.726754238
lrwxrwxrwx    1 root     root            31 Aug 12 01:39 ..data -> ..2021_08_12_01_39_48.726754238
lrwxrwxrwx    1 root     root            32 Aug 12 01:39 nginx-config-gzip-on.conf -> ..data/nginx-config-gzip-on.conf
lrwxrwxrwx    1 root     root            21 Aug 12 01:39 sleep-interval -> ..data/sleep-interval
```

修改 ConfigMap 后
```shell
$ kubectl exec -it nginx-pod-configmap-volume -- ls -lA /etc/nginx/conf.d
drwxr-xr-x    2 root     root            61 Aug 12 01:42 ..2021_08_12_01_42_24.017381129
lrwxrwxrwx    1 root     root            31 Aug 12 01:42 ..data -> ..2021_08_12_01_42_24.017381129
lrwxrwxrwx    1 root     root            32 Aug 12 01:39 nginx-config-gzip-on.conf -> ..data/nginx-config-gzip-on.conf
lrwxrwxrwx    1 root     root            21 Aug 12 01:39 sleep-interval -> ..data/sleep-interval
```

可以看到文件都链接当前文件夹 data 下的文件，文件夹 data 链接到另一个文件夹 yyyy_mm_dd_hh_mm_ss.f，修改 ConfigMap 后，只需要重新生成文件夹 yyyy_mm_dd_hh_mm_ss.f，把修改后的文件放到这个文件夹中，然后 data 重新链接到新的文件夹 yyyy_mm_dd_hh_mm_ss.f。

**挂载到已存在文件夹的文件不会被更新**

通过查看，文件并没有链接的存在，所以不能动态更新。
```shell
$ kubectl exec -it nginx-pod-configmap-volume-with-items-no-hide-files -- ls -lA /etc/nginx/conf.d
total 8
-rw-r--r--    1 root     root          1093 Aug 12 01:52 default.conf
-rw-rw----    1 root     root           217 Aug 12 01:52 nginx-config-gzip-on.conf
```

## **Secret**
存储配置的敏感数据，如：证书和私钥。Secret 只会存储在节点的内存中。

**如果一个配置文件同时包含敏感与非敏感数据，该文件应该被存储在 Secret 中。**

### 默认令牌 Secret
默认被挂载到所有容器中的 Secret，通过 kubectl describe pods 命令可以查看到下面的信息。每个 Pod 都会自动挂载一个 secret 卷。
```shell
$ kubectl describe pods
Containers:
  kubia:
    Image:          wangjunjian/kubia:latest
    Mounts:
      /var/run/secrets/kubernetes.io/serviceaccount from default-token-d98km (ro)
Volumes:
  default-token-d98km:
    Type:        Secret (a volume populated by a Secret)
    SecretName:  default-token-d98km
```

secret 卷会被挂载到容器的 ```/var/run/secrets/kubernetes.io/serviceaccount``` 目录。

查看描述信息，可以看到 Secret 包含三个条目：```ca.crt```, ```namespace```, ```token```。包含了从 Pod 内部安全访问 Kubernetes API 服务器所需的全部信息。
```shell
$ kubectl describe secrets default-token-d98km
Name:         default-token-d98km
Namespace:    kubia
Labels:       <none>
Annotations:  kubernetes.io/service-account.name: default
              kubernetes.io/service-account.uid: 1aa99b7d-20a9-461e-b79a-c6bcd712f832

Type:  kubernetes.io/service-account-token

Data
====
ca.crt:     1025 bytes
namespace:  5 bytes
token:      eyJhbGciOiJSUzI1NiIsImtpZCI6IkZmZkdQXzBoMkNRLXpNVDA4UWxNcmlyNzYxTzVHYnVJZE5xZXN3T1lzazgifQ...
```

**default-token Secret 默认会被挂载到每个容器。可以通过设置 Pod 定义中的 spec.automountServiceAccountToken 为 false，或者设置 Pod 使用的 ServiceAccount 中相同的字段为 false 来关闭这种默认行为。**

查看 secret 卷挂载到容器文件夹包含的三个文件。
```shell
$ kubectl exec kubia-manual -- ls /var/run/secrets/kubernetes.io/serviceaccount
ca.crt
namespace
token
```

### 创建 Secret
生成证书和私钥
```shell
openssl genrsa -out https.key 2048
openssl req -new -x509 -key https.key -out https.cert -days 3650 -subj /CN=www.wangjunjian.com
```

创建 generic Secret
```shell
kubectl create secret generic nginx-https --from-file=https.key --from-file=https.cert --from-literal=sleep-interval=3
```

查看 Secret YAML
```shell
$ kubectl get secret nginx-https -o yaml
apiVersion: v1
data:
  https.cert: LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSURIVENDQWdXZ0F3SUJBZ0lVZjlJekoxSnl6cEp0...
  https.key: LS0tLS1CRUdJTiBSU0EgUFJJVkFURSBLRVktLS0tLQpNSUlFb3dJQkFBS0NBUUVBcDlNU0xrWkNzN0RHZ...
  sleep-interval: Mw==
kind: Secret
...
```

可以看到 Secret 条目的值被以 Base64 格式编码。

**Secret 可以用来存储非敏感二进制数据。Secret 的大小限于 1MB。**

查看 Secret 条目的原值
```shell
$ kubectl get secret nginx-https -o jsonpath='{.data.sleep-interval}' | base64 -d
3
```

### 在 Pod 中使用 Secret 条目
**通过 secret 卷将 Secret 暴露给容器之后，Secret 条目的值会被解码并以真实形式写入对应的文件。**

#### 编写 Nginx 配置，开发 HTTPS
编写 Nginx 配置文件（nginx-config-https.conf）。
```conf
server {
    listen       80;
    listen       443 ssl;
    server_name  www.kubia-example.com;

    ssl_certificate     certs/https.cert;
    ssl_certificate_key certs/https.key;
    ssl_protocols       TLSv1 TLSv1.1 TLSv1.2;
    ssl_ciphers         HIGH:!aNULL:!MD5;

    location / {
        root   /usr/share/nginx/html;
        index  index.html index.htm;
    }
}
```
配置了服务器从 /etc/nginx/certs 中读取证书和私钥文件。

创建 ConfigMap 对象
```shell
kubectl create configmap date-html-config --from-file=nginx-config-https.conf --from-literal=sleep-interval=3
```

创建 Secret 对象
```shell
kubectl create secret generic date-html-https --from-file=https.key --from-file=https.cert
```

#### 挂载 ConfigMap 和 Secret 到 Pod
定义 Pod YAML（date-html.yaml）
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: date-html
spec:
  containers:
  - name: date-html-generator
    image: wangjunjian/date-html-generator
    env:
    - name: INTERVAL
      valueFrom:
        configMapKeyRef:
          name: date-html-config
          key: sleep-interval
    volumeMounts:
    - name: html
      mountPath: /var/htdocs
  - name: web-server
    image: nginx:alpine
    volumeMounts:
    - name: html
      mountPath: /usr/share/nginx/html
      readOnly: true
    - name: config
      mountPath: /etc/nginx/conf.d
      readOnly: true
    - name: https
      mountPath: /etc/nginx/certs
      readOnly: true
    ports:
    - containerPort: 80
      protocol: TCP 
  volumes:
  - name: html
    emptyDir:
      medium: Memory
  - name: config
    configMap:
      name: date-html-config
      items:
      - key: nginx-config-https.conf
        path: https.conf
  - name: https
    secret:
      secretName: date-html-https
```

创建 Pod 对象
```shell
kubectl apply -f date-html.yaml
```

#### 测试 Nginx 是否正确使用了 Secret 中的证书和密钥
通过 port-forward 访问 Pod
```shell
kubectl port-forward date-html 8443:443 &
```

发送请求，检查响应中服务器证书是否与之前生成的证书匹配。
```shell
$ curl https://localhost:8443 -k
2021-08-13 02:02:25
```

可以通过选项 -v 查看详细日志
```shell
$ curl https://localhost:8443 -k -v
*   Trying 127.0.0.1:8443...
* TCP_NODELAY set
* Connected to localhost (127.0.0.1) port 8443 (#0)
Handling connection for 8443
* ALPN, offering h2
* ALPN, offering http/1.1
* successfully set certificate verify locations:
*   CAfile: /etc/ssl/certs/ca-certificates.crt
  CApath: /etc/ssl/certs
* TLSv1.3 (OUT), TLS handshake, Client hello (1):
* TLSv1.3 (IN), TLS handshake, Server hello (2):
* TLSv1.2 (IN), TLS handshake, Certificate (11):
* TLSv1.2 (IN), TLS handshake, Server key exchange (12):
* TLSv1.2 (IN), TLS handshake, Server finished (14):
* TLSv1.2 (OUT), TLS handshake, Client key exchange (16):
* TLSv1.2 (OUT), TLS change cipher, Change cipher spec (1):
* TLSv1.2 (OUT), TLS handshake, Finished (20):
* TLSv1.2 (IN), TLS handshake, Finished (20):
* SSL connection using TLSv1.2 / ECDHE-RSA-AES256-GCM-SHA384
* ALPN, server accepted to use http/1.1
* Server certificate:
*  subject: CN=www.wangjunjian.com
*  start date: Aug 12 07:38:18 2021 GMT
*  expire date: Aug 10 07:38:18 2031 GMT
*  issuer: CN=www.wangjunjian.com
*  SSL certificate verify result: self signed certificate (18), continuing anyway.
> GET / HTTP/1.1
> Host: localhost:8443
> User-Agent: curl/7.68.0
> Accept: */*
> 
* Mark bundle as not supporting multiuse
< HTTP/1.1 200 OK
< Server: nginx/1.21.1
< Date: Fri, 13 Aug 2021 02:03:15 GMT
< Content-Type: text/html
< Content-Length: 20
< Last-Modified: Fri, 13 Aug 2021 02:03:13 GMT
< Connection: keep-alive
< ETag: "6115d2e1-14"
< Accept-Ranges: bytes
< 
2021-08-13 02:03:13
```
可以看到 ```Server certificate``` 字段显示的证书信息。

#### secret 卷存储于内存
```shell
$ kubectl exec date-html -c web-server -- mount | grep certs
tmpfs on /etc/nginx/certs type tmpfs (ro,relatime)
```
使用的是 tmpfs。

### 通过环境变量暴露 Secret 条目
创建 Secret 对象
```shell
kubectl create secret generic date-config --from-literal=sleep-interval=3
```

查看 Secret 对象
```shell
$ kubectl get secret date-config -o yaml
apiVersion: v1
data:
  sleep-interval: Mw==
kind: Secret
```

定义 Pod YAML (date-secret.yaml)
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
        secretKeyRef:
          name: date-config
          key: sleep-interval
```

创建 Pod 对象
```shell
kubectl apply -f date-secret.yaml
```

查看环境变量
```shell
$ kubectl exec date -- env
INTERVAL=3
```

查看日志
```shell
$ kubectl logs date
Fri Aug 13 00:42:00 UTC 2021
Fri Aug 13 00:42:03 UTC 2021
```

**通过环境变量传递 Secret 给容器可能会暴露敏感数据，请始终采用 secret 卷的方式暴露 Secret。**

### 镜像拉取 Secret（imagePullSecrets）
可以在自己的 Docker Hub 上找到一个仓库，通过 Settings -> Visibility Settings -> Make Private 进行设置为私有。

#### 创建 docker-registry Secret
```shell
kubectl create secret docker-registry mydockerhubsecret \
  --docker-username=myusername \
  --docker-password=mypassword \
  --docker-email=myemail
```

查看 Secret 对象，可以看到仅有一个条目 .dockerconfigjson
```shell
$ kubectl get secrets mydockerhubsecret -o yaml
apiVersion: v1
data:
  .dockerconfigjson: eyJhdXRocyI6eyJodHRwczovL2luZGV4LmRvY2tlci5pby92MS8iOnsidXNlcm5hbWUiOiJ3Y...
kind: Secret
```

#### 在 Pod 定义中使用 docker-registry Secret
通过在 Pod 定义中配置 imagePullSecrets 字段引用 docker-registry Secret。
```shell
apiVersion: v1
kind: Pod
metadata:
  name: private
spec:
  imagePullSecrets:
  - name: mydockerhubsecret
  containers:
  - image: wangjunjian/private:latest
    name: private
```

创建 Pod 对象
```shell
kubectl apply -f private.yaml
```

查看日志
```shell
$ kubectl logs private 
Hello World
```

如果没有配置 docker-registry Secret，将会出现下面的错误：
```
Failed to pull image "wangjunjian/private:latest": rpc error: code = Unknown desc = Error response from daemon: pull access denied for wangjunjian/private, repository does not exist or may require 'docker login': denied: requested access to the resource is denied
```

## 参考资料
* [管理 Secrets](https://kubernetes.io/zh/docs/tasks/configmap-secret/)
* [python](https://hub.docker.com/_/python)
* [nginx](https://hub.docker.com/_/nginx)
* [curl](https://hub.docker.com/r/curlimages/curl)
* [wangjunjian/private](https://hub.docker.com/r/wangjunjian/private)
* [Python strftime](https://www.programiz.com/python-programming/datetime/strftime)
