---
layout: post
title:  "ConfigMap和Secret：配置应用程序"
date:   2021-07-05 00:00:00 +0800
categories: Kubernetes
tags: [ConfigMap, Secret, Docker, Dockerfile, kubectl, command, args, ENTRYPOINT, CMD]
---

## 向容器传递命令行参数
### 在 Docker 中定义命令与参数
下面是 Dockerfile 中的指令 ENTRYPOINT 和 CMD。

| 指令 | 解释 |
| --- | --- |
| ENTRYPOINT | 容器启动时调用的命令 |
| CMD | 传递给 ENTRYPOINT 指定命令的参数 |

### 构建带参数的程序
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
### 构建通过环境变量配置的程序
编写脚本 date.sh
```shell
#!/bin/sh
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
command 和 args 也可以这样用。

## 参考资料
* [python](https://hub.docker.com/_/python)
