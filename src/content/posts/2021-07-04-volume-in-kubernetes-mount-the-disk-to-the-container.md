---
layout: single
title:  "Kubernetes中的卷：将磁盘挂载到容器"
date:   2021-07-04 00:00:00 +0800
categories: Kubernetes
tags: [volume, kubectl, date, Docker, Dockerfile, port-forward, nfs]
---

## 通过卷在容器之间共享数据
### Build [Date HTML Generator] Image
#### 编写 HTML 生成器（date-html-generator.sh）
```sh
#!/bin/sh
mkdir /var/htdocs
while :
do
  echo $(date +'%Y-%m-%d %H:%M:%S') Writing to /var/htdocs/index.html
  echo $(date +'%Y-%m-%d %H:%M:%S') > /var/htdocs/index.html
  sleep 1
done
```
* %Y : 完整年份 (0000-9999)
* %m : 月份 (01-12)
* %d : 日 (01-31)
* %H : 小时(00-23)
* %M : 分钟(00-59)
* %S : 秒(00-60)

#### 编写 Dockerfile
```shell
FROM busybox
ADD date-html-generator.sh /bin/date-html-generator.sh
RUN chmod +x /bin/date-html-generator.sh
ENTRYPOINT /bin/date-html-generator.sh
```

#### 生成 date-html-generator 镜像
```shell
docker build -t wangjunjian/date-html-generator .
```

### 编写 [Date HTML] Pod
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: date-html
spec:
  containers:
  - name: date-html-generator
    image: wangjunjian/date-html-generator
    volumeMounts:
    - name: html
      mountPath: /var/htdocs
  - name: web-server
    image: nginx:alpine
    volumeMounts:
    - name: html
      mountPath: /usr/share/nginx/html
      readOnly: true
    ports:
    - containerPort: 80
      protocol: TCP
  volumes:
  - name: html
    emptyDir: {}
```
* emptyDir 空目录卷。用于两个容器进行数据共享。
* 卷属于 Pod，可以挂载到同一个 Pod 中的多个容器中。
* 卷的生命周期与 Pod 的生命周期相关联。Pod 被删除，卷也将被删除。
* Nginx 默认的服务文件目录 /usr/share/nginx/html

### 访问 [Date HTML] 服务
#### 端口转发
```shell
$ kubectl port-forward date-html 8080:80
Forwarding from 127.0.0.1:8080 -> 80
Forwarding from [::1]:8080 -> 80
Handling connection for 8080
```

#### 访问服务
```shell
$ curl 127.0.0.1:8080
2021-08-02 05:16:15
```

### emptyDir 修改为内存进行存储
emptyDir 默认使用节点的存储磁盘，所以性能也取决于磁盘的类型。通过修改属性 medium 为 Memory，通知 Kubernetes 在 tmpfs 文件系统（在内存）上创建 emptyDir。
```yaml
  volumes:
  - name: html
    emptyDir: 
      medium: Memory
```

## 访问工作节点文件系统上的文件
hostPath 卷指向节点文件系统上的特定文件或目录。主要用于访问节点上的数据（日志文件、Kubernetes配置文件或CA证书），在单节点集群中可作持久化存储。

### 查看使用 hostPath 卷的 Pod
#### 查看 nvidia-device-plugin-ds Pod
```shell
$ kubectl get pods --namespace kube-system -l name=nvidia-device-plugin-ds
NAME                                   READY   STATUS    RESTARTS   AGE
nvidia-device-plugin-daemonset-2xqqs   1/1     Running   0          11d
nvidia-device-plugin-daemonset-6wn88   1/1     Running   1          129d
nvidia-device-plugin-daemonset-7lcv9   1/1     Running   0          11d
nvidia-device-plugin-daemonset-ssf4f   1/1     Running   0          11d
```

#### 查看 Pod 的 hostPath 卷信息
```shell
$ kubectl describe pod nvidia-device-plugin-daemonset-6wn88 --namespace kube-system
Name:                 nvidia-device-plugin-daemonset-6wn88
...
Volumes:
  device-plugin:
    Type:          HostPath (bare host directory volume)
    Path:          /var/lib/kubelet/device-plugins
    HostPathType:  
```

### 使用 hostPath 卷
#### 定义挂载系统日志（/var/log）的 Pod
```yaml
#hostpath.yaml
apiVersion: v1
kind: Pod
metadata:
  name: hostpath
spec:
  containers:
  - name: hostpath
    image: busybox
    command: ['sh', '-c', 'sleep 864000']
    volumeMounts:
    - name: hostpath
      mountPath: /var/log
  volumes:
  - name: hostpath
    hostPath:
      path: /var/log
```

#### 部署 hostpath.yaml
```shell
kubectl apply -f hostpath.yaml
```

#### 查看容器内挂载的系统日志目录（/var/log）
```shell
$ kubectl exec -it hostpath -- ls /var/log
alternatives.log       btmp                   kern.log.2.gz
apport.log             dmesg                  nvidia-uninstall.log
apport.log.1           dmesg.0                pods
apt                    dpkg.log.5.gz          syslog.4.gz
auth.log               dpkg.log.6.gz          syslog.5.gz
bootstrap.log          kern.log.1             wtmp
```

## 持久化存储
### NFS
#### 定义 Pod
```shell
#nfs.yaml
apiVersion: v1
kind: Pod
metadata:
  name: nfs
spec:
  nodeSelector:
    kubernetes.io/hostname: ln2
  containers:
  - name: nfs
    image: busybox
    command: ['sh', '-c', 'sleep 864000']
    volumeMounts:
    - name: nfs
      mountPath: /face_analysis/data
  volumes:
  - name: nfs
    nfs:
      server: 172.16.33.157
      path: /projects/face_analysis/v1.2/data
```
* nfs.server, NFS 服务器的 IP
* nfs.path, NFS 服务器的路径

#### 部署 nfs.yaml
```shell
kubectl apply -f nfs.yaml
```

#### 查看容器内挂载的 NFS 路径
```shell
$ kubectl exec -it nfs -- ls /face_analysis/data
face_features      pretrained_models
```

## 参考资料
* [Linux date命令的用法](https://www.cnblogs.com/asxe/p/9317811.html)
