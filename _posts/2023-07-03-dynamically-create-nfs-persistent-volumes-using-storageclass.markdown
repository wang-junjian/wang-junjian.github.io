---
layout: single
title:  "使用 StorageClass 动态创建 NFS 持久卷"
date:   2023-07-03 08:00:00 +0800
categories: StorageClass
tags: [Kubernetes, PersistentVolumeClaim, PersistentVolume, Provisioner, NFS, mongo]
---

## PVC 操作流程

![](/images/2023/kubernetes/pvc-flow.png)

### [Volume](https://kubernetes.io/zh-cn/docs/concepts/storage/volumes/)
卷的核心是一个目录，其中可能存有数据，Pod 中的容器可以访问该目录中的数据。 所采用的特定的卷类型将决定该目录如何形成的、使用何种介质保存数据以及目录中存放的内容。

使用卷时, 在 `.spec.volumes` 字段中设置为 Pod 提供的卷，并在 `.spec.containers[*].volumeMounts` 字段中声明卷在容器中的挂载位置。

emptyDir 卷的存储介质（例如磁盘、SSD 等）是由保存 kubelet 数据的根目录（通常是 /var/lib/kubelet）的文件系统的介质确定。 Kubernetes 对 emptyDir 卷或者 hostPath 卷可以消耗的空间没有限制，容器之间或 Pod 之间也没有隔离。

### [PersistentVolume](https://kubernetes.io/zh-cn/docs/concepts/storage/persistent-volumes/)
持久卷（PersistentVolume，PV） 是集群中的一块存储，可以由管理员事先创建， 或者使用存储类（Storage Class）来动态创建。 持久卷是集群资源，就像节点也是集群资源一样。PV 持久卷和普通的 Volume 一样， 也是使用卷插件来实现的，只是它们拥有独立于任何使用 PV 的 Pod 的生命周期。 

PV 对象是由运维人员事先创建在 Kubernetes 集群里待用的。

### PersistentVolumeClaim
持久卷声明（PersistentVolumeClaim，PVC） 表达的是用户对存储的请求。概念上与 Pod 类似。 Pod 会耗用节点资源，而 PVC 申领会耗用 PV 资源。Pod 可以请求特定数量的资源（CPU 和内存）；同样 PVC 申领也可以请求特定的大小和访问模式 （例如，可以要求 PV 卷能够以 ReadWriteOnce、ReadOnlyMany 或 ReadWriteMany 模式之一来挂载）。

PVC 对象通常由开发人员创建。

### [StorageClass](https://kubernetes.io/zh-cn/docs/concepts/storage/storage-classes/)
StorageClass 为管理员提供了描述存储 "类" 的方法。 不同的类型可能会映射到不同的服务质量等级或备份策略，或是由集群管理员制定的任意策略。

每个 StorageClass 都包含 provisioner、parameters 和 reclaimPolicy 字段， 这些字段会在 StorageClass 需要动态制备 PersistentVolume 时会使用到。

#### 回收策略
由 StorageClass 动态创建的 PersistentVolume 会在类的 reclaimPolicy 字段中指定回收策略，可以是 Delete 或者 Retain。 如果 StorageClass 对象被创建时没有指定 reclaimPolicy，它将默认为 Delete。

## 在 Ubuntu 上安装 NFS 服务器
### 安装服务端
```shell
sudo apt install nfs-kernel-server
```

### 查看服务状态
```shell
sudo systemctl status nfs-server
```

### 查看开启的NFS协议
```shell
sudo cat /proc/fs/nfsd/versions
```
```
-2 +3 +4 +4.1 +4.2
```

### 创建存储目录
```shell
sudo mkdir /data/nfs
sudo chmod 777 /data/nfs
```

### 配置访问的路径
```shell
sudo vim /etc/exports
```
```
/data/nfs        172.16.33.0/24(rw,sync,no_subtree_check,no_root_squash)
```

* no_subtree_check
NFS 服务器将忽略子目录的检查。这意味着，无论请求的路径是否位于共享目录的子目录中，NFS服务器都将按照共享目录的权限设置来处理请求。这样可以提高性能，因为服务器不再需要进行额外的子目录检查。

需要谨慎使用，以确保共享目录的访问权限受到正确的限制。

* no_root_squash
no_root_squash 选项用于取消 NFS 服务器对 root 用户的权限限制，允许 root 用户在客户端系统上拥有完全的访问权限。

默认情况下，NFS 服务器会将来自客户端的 root 用户请求映射为匿名用户或具有受限权限的用户。这样做是为了提高安全性，防止远程 root 用户对服务器文件系统进行未授权的更改。

然而，对于某些应用程序（如 MongoDB），需要在容器中以特权模式运行，并且可能需要更改文件系统的所有权。在这种情况下，如果 NFS 服务器将 root 用户请求映射为受限用户，那么容器将无法更改 /data/db 目录的所有权，因为它没有足够的权限。

通过在 NFS 服务器配置中添加 no_root_squash 选项，你明确指示服务器不对来自 root 用户的请求进行映射或限制，从而允许容器以 root 用户的身份操作文件系统，并成功更改 /data/db 目录的所有权。

请注意，启用 no_root_squash 选项可能会降低系统的安全性，因为允许远程 root 用户拥有对文件系统的完全访问权限。在进行此更改之前，请确保你已经评估了安全风险，并采取了适当的措施来保护服务器和数据的安全性。

**在 mongo 的例子中，NFS 服务器没有配置 `no_root_squash`，出现错误：`chown: changing ownership of '/data/db': Operation not permitted`**

* [chown: changing ownership of ‘/var/lib/postgresql/data’: Operation not permitted, when running in kubernetes with mounted "/var/lib/postgres/data" volume](https://github.com/kubernetes/kubernetes/issues/54601)

### 应用配置
```shell
sudo exportfs -ra
```

**应用配置后就生效了，不需要再重启服务。**

### 查看当前应用
```shell
sudo exportfs -v
```
```
/data/nfs     	172.16.33.0/24(rw,wdelay,no_root_squash,no_subtree_check,sec=sys,rw,secure,no_root_squash,no_all_squash)
```

### 重启服务
```shell
sudo systemctl restart nfs-server
```

## 使用 NFS 存储卷
这里使用了 [mongo](https://hub.docker.com/_/mongo) 来做实验。

Pod 清单：mongodb-pod-nfs.yaml
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: mongodb
spec:
  containers:
  - name: mongodb
    image: mongo
    volumeMounts:
    - name: mongodb-data
      mountPath: /data/db
    ports:
    - containerPort: 27017
      protocol: TCP
  volumes:
  - name: mongodb-data
    nfs:
      server: 172.16.33.157
      path: /data/nfs/mongo-data
```

可以通过 `sudo exportfs -v` 命令在 NFS 服务器上查看共享目录。`/data/nfs/mongo-data` 目录需要在 NFS 服务器上创建。

创建 Pod
```shell
kubectl apply -f mongodb-pod-nfs.yaml
```

通过 MongoDB Shell 写入数据
```shell
kubectl exec -it mongodb -- mongosh
Current Mongosh Log ID:	64a51200ddc2fd10f7cd6bde
Connecting to:		mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.10.1
Using MongoDB:		6.0.7
Using Mongosh:		1.10.1

For mongosh info see: https://docs.mongodb.com/mongodb-shell/

test> db.wjj.insertOne({name:'wjj', age:42})
{
  acknowledged: true,
  insertedId: ObjectId("64a5134fddc2fd10f7cd6bdf")
}
```

删除并创建 Pod 进行验证
```shell
kubectl delete -f mongodb-pod-nfs.yaml
kubectl apply -f mongodb-pod-nfs.yaml
```

通过 MongoDB Shell 检索之前存储的数据
```shell
kubectl exec -it mongodb -- mongosh
Current Mongosh Log ID:	64a513cfbb3e3bae96a38d35
Connecting to:		mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.10.1
Using MongoDB:		6.0.7
Using Mongosh:		1.10.1

For mongosh info see: https://docs.mongodb.com/mongodb-shell/

test> db.wjj.find()
[ { _id: ObjectId("64a5134fddc2fd10f7cd6bdf"), name: 'wjj', age: 42 } ]
```

可以看到删除并创建 Pod，数据依然存在。

## 使用 PersistentVolumeClaim（持久卷声明）和 PersistentVolume（持久卷）解耦
持久卷清单：mongodb-pv-nfs.yaml
```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: mongodb-pv
spec:
  capacity:
    storage: 1Gi
  accessModes:
    - ReadWriteOnce
    - ReadOnlyMany
  persistentVolumeReclaimPolicy: Retain
  nfs:
    server: 172.16.33.157
    path: /data/nfs/mongo-data
```

创建 PV
```shell
kubectl apply -f mongodb-pv-nfs.yaml
```

查看所有 PV，mongodb-pv 的状态是 `Available`
```shell
kubectl get pv
NAME         CAPACITY   ACCESS MODES   RECLAIM POLICY   STATUS      CLAIM   STORAGECLASS   REASON   AGE
mongodb-pv   1Gi        RWO,ROX        Retain           Available                                   40s
```

持久卷声明清单：mongodb-pvc.yaml 
```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: mongodb-pvc
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 1Gi
```

创建 PVC
```shell
kubectl apply -f mongodb-pvc.yaml
```

查看所有 PVC, PV，mongodb-pvc 和 mongodb-pv 的状态都为 `Bound`，mongodb-pvc 的 VOLUME 为 `mongodb-pv`。
```shell
kubectl get pvc,pv
NAME                                STATUS   VOLUME       CAPACITY   ACCESS MODES   STORAGECLASS   AGE
persistentvolumeclaim/mongodb-pvc   Bound    mongodb-pv   1Gi        RWO,ROX                       35s

NAME                          CAPACITY   ACCESS MODES   RECLAIM POLICY   STATUS   CLAIM                 STORAGECLASS   REASON   AGE
persistentvolume/mongodb-pv   1Gi        RWO,ROX        Retain           Bound    default/mongodb-pvc                           8m17s
```

Pod 清单：mongodb-pod-nfs.yaml
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: mongodb
spec:
  containers:
  - name: mongodb
    image: mongo
    volumeMounts:
    - name: mongodb-data
      mountPath: /data/db
    ports:
    - containerPort: 27017
      protocol: TCP
  volumes:
  - name: mongodb-data
    persistentVolumeClaim:
      claimName: mongodb-pvc
```

创建 Pod
```shell
kubectl apply -f mongodb-pod-nfs.yaml
```

通过 MongoDB Shell 检索之前存储的数据
```shell
kubectl exec -it mongodb -- mongosh
Current Mongosh Log ID:	64a524a394110078b49c1ce6
Connecting to:		mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.10.1
Using MongoDB:		6.0.7
Using Mongosh:		1.10.1

For mongosh info see: https://docs.mongodb.com/mongodb-shell/

test> db.wjj.find()
[ { _id: ObjectId("64a5134fddc2fd10f7cd6bdf"), name: 'wjj', age: 42 } ]
```

删除 Pod, PVC, PV
```shell
kubectl delete -f .
```

查看 NFS 服务器上的数据还存在

```shell
ll /data/nfs/mongo-data/
-rw------- 1 systemd-coredump systemd-coredump 20480 Jul  5 16:08 collection-0--7871518737263603795.wt
-rw------- 1 systemd-coredump systemd-coredump 36864 Jul  5 16:08 collection-2--7871518737263603795.wt
-rw------- 1 systemd-coredump systemd-coredump 36864 Jul  5 16:08 collection-4--7871518737263603795.wt
-rw------- 1 systemd-coredump systemd-coredump 20480 Jul  5 16:08 collection-7--7871518737263603795.wt
drwx------ 2 systemd-coredump systemd-coredump  4096 Jul  5 16:08 diagnostic.data/
-rw------- 1 systemd-coredump systemd-coredump 20480 Jul  5 16:08 index-1--7871518737263603795.wt
-rw------- 1 systemd-coredump systemd-coredump 36864 Jul  5 16:08 index-3--7871518737263603795.wt
-rw------- 1 systemd-coredump systemd-coredump 24576 Jul  5 16:08 index-5--7871518737263603795.wt
-rw------- 1 systemd-coredump systemd-coredump 12288 Jul  5 16:08 index-6--7871518737263603795.wt
-rw------- 1 systemd-coredump systemd-coredump 20480 Jul  5 14:54 index-8--7871518737263603795.wt
drwx------ 2 systemd-coredump systemd-coredump  4096 Jul  5 16:06 journal/
-rw------- 1 systemd-coredump systemd-coredump 36864 Jul  5 16:08 _mdb_catalog.wt
drwx------ 3 systemd-coredump root              4096 Jul  5 14:47 .mongodb/
-rw------- 1 systemd-coredump systemd-coredump     0 Jul  5 16:08 mongod.lock
-rw------- 1 systemd-coredump systemd-coredump 36864 Jul  5 16:08 sizeStorer.wt
-rw------- 1 systemd-coredump systemd-coredump   114 Jul  5 14:38 storage.bson
-rw------- 1 systemd-coredump systemd-coredump    50 Jul  5 14:38 WiredTiger
-rw------- 1 systemd-coredump systemd-coredump  4096 Jul  5 16:08 WiredTigerHS.wt
-rw------- 1 systemd-coredump systemd-coredump    21 Jul  5 14:39 WiredTiger.lock
-rw------- 1 systemd-coredump systemd-coredump  1467 Jul  5 16:08 WiredTiger.turtle
-rw------- 1 systemd-coredump systemd-coredump 53248 Jul  5 16:08 WiredTiger.wt
```

## 使用 StorageClass 动态创建持久卷
### NFS Provisioner
#### [Kubernetes NFS Subdir External Provisioner](https://github.com/kubernetes-sigs/nfs-subdir-external-provisioner)
NFS Subdir External Provisioner 是一个自动配置程序，它使用现有且已配置的 NFS 服务器来支持通过持久卷声明动态配置 Kubernetes 持久卷。持久卷配置为 `${namespace}-${pvcName}-${pvName}`。

#### [NFS Ganesha server and external provisioner](https://github.com/kubernetes-sigs/nfs-ganesha-server-and-external-provisioner)
它的工作方式：StorageClass 对象可以指定 nfs-ganesha-server-and-external-provisioner 的实例作为其配置器，就像指定内置配置器（例如 GCE 或 AWS）一样。 然后，nfs-ganesha-server-and-external-provisioner 的实例将监视请求 StorageClass 的 PersistentVolumeClaims，并自动为它们创建 NFS 支持的 PersistentVolume。

### 构建 NFS Subdir External Provisioner 镜像
`gcr.io` 和 `registry.k8s.io` 仓库，在国内都访问不了，自己动手吧。

#### 下载依赖的基础镜像 `gcr.io/distroless/static:latest`
```shell
docker pull gcr.m.daocloud.io/distroless/static:latest
docker tag gcr.m.daocloud.io/distroless/static:latest gcr.io/distroless/static:latest
docker rmi gcr.m.daocloud.io/distroless/static:latest
```

#### 克隆和构建
```shell
git clone https://github.com/kubernetes-sigs/nfs-subdir-external-provisioner
cd nfs-subdir-external-provisioner/

make build
make container
```

#### 上传到我的 Docker Hub 上
```shell
docker tag nfs-subdir-external-provisioner:latest wangjunjian/nfs-subdir-external-provisioner:latest
docker push wangjunjian/nfs-subdir-external-provisioner:latest
```

### 使用 Kustomize 部署
创建 `kustomize` 目录
```shell
mkdir kustomize
cd kustomize
```

#### 创建 Namespace

namespace.yaml
```shell
apiVersion: v1
kind: Namespace
metadata:
  name: nfs-provisioner
```

#### 配置 Deployment

patch_nfs_details.yaml
```shell
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    app: nfs-client-provisioner
  name: nfs-client-provisioner
spec:
  template:
    spec:
      containers:
        - name: nfs-client-provisioner
          env:
            - name: NFS_SERVER
              value: 172.16.33.157
            - name: NFS_PATH
              value: /data/nfs
      volumes:
        - name: nfs-client-root
          nfs:
            server: 172.16.33.157
            path: /data/nfs
```

配置您的 NFS 服务器的 `IP` 和`共享目录`。

#### 添加资源
将 deploy 目录添加为 base。

kustomization.yaml
```shell
namespace: nfs-provisioner
bases:
  - github.com/kubernetes-sigs/nfs-subdir-external-provisioner//deploy
resources:
  - namespace.yaml
patchesStrategicMerge:
  - patch_nfs_details.yaml
```

#### 部署
```shell
kubectl apply -k .
```

替换我们自己构建的镜像。

```shell
kubectl edit deployment.apps/nfs-client-provisioner -n nfs-provisioner
```

把 `image: registry.k8s.io/sig-storage/nfs-subdir-external-provisioner:v4.0.2` 替换为 `image: wangjunjian/nfs-subdir-external-provisioner:latest`

### 使用 Helm 部署
```shell
helm repo add nfs-subdir-external-provisioner https://kubernetes-sigs.github.io/nfs-subdir-external-provisioner/
```

```shell
helm install nfs-subdir-external-provisioner nfs-subdir-external-provisioner/nfs-subdir-external-provisioner \
    --set nfs.server=172.16.33.157 \
    --set nfs.path=/data/nfs
```
```
NAME: nfs-subdir-external-provisioner
LAST DEPLOYED: Thu Jun 29 13:08:34 2023
NAMESPACE: nfs
STATUS: deployed
REVISION: 1
TEST SUITE: None
```

国内不能访问仓库 `registry.k8s.io`，可以考虑使用其它方式把镜像下载下来。可以参考这篇文章：[如何轻松的下载海外镜像](https://www.cnblogs.com/wubolive/p/17317586.html)

```shell
docker pull k8s.m.daocloud.io/sig-storage/nfs-subdir-external-provisioner:v4.0.2
docker tag k8s.m.daocloud.io/sig-storage/nfs-subdir-external-provisioner:v4.0.2 registry.k8s.io/sig-storage/nfs-subdir-external-provisioner:v4.0.2

docker pull k8s.m.daocloud.io/busybox:latest
docker tag k8s.m.daocloud.io/busybox:latest registry.k8s.io/busybox:latest
```

### 手动部署
#### 下载部署的 YAML 文件
下载 [NFS Subdir External Provisioner](https://github.com/kubernetes-sigs/nfs-subdir-external-provisioner) 仓库的 [deploy](https://github.com/kubernetes-sigs/nfs-subdir-external-provisioner/tree/master/deploy) 下的所有的文件。

#### 设置授权
```shell
$ kubectl apply -f deploy/rbac.yaml
serviceaccount/nfs-client-provisioner created
clusterrole.rbac.authorization.k8s.io/nfs-client-provisioner-runner created
clusterrolebinding.rbac.authorization.k8s.io/run-nfs-client-provisioner created
role.rbac.authorization.k8s.io/leader-locking-nfs-client-provisioner created
rolebinding.rbac.authorization.k8s.io/leader-locking-nfs-client-provisioner created
```

#### 配置 NFS subdir external provisioner
deploy/deployment.yaml
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nfs-client-provisioner
  labels:
    app: nfs-client-provisioner
  # replace with namespace where provisioner is deployed
  namespace: default
spec:
  replicas: 1
  strategy:
    type: Recreate
  selector:
    matchLabels:
      app: nfs-client-provisioner
  template:
    metadata:
      labels:
        app: nfs-client-provisioner
    spec:
      serviceAccountName: nfs-client-provisioner
      containers:
        - name: nfs-client-provisioner
          image: wangjunjian/nfs-subdir-external-provisioner:latest
          volumeMounts:
            - name: nfs-client-root
              mountPath: /persistentvolumes
          env:
            - name: PROVISIONER_NAME
              value: k8s-sigs.io/nfs-subdir-external-provisioner
            - name: NFS_SERVER
              value: 172.16.33.157
            - name: NFS_PATH
              value: /data/nfs
      volumes:
        - name: nfs-client-root
          nfs:
            server: 172.16.33.157
            path: /data/nfs
```

```shell
kubectl apply -f deploy/deployment.yaml
deployment.apps/nfs-client-provisioner created
```

#### 部署您的 Storage Class
deploy/class.yaml
```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: nfs-client
provisioner: k8s-sigs.io/nfs-subdir-external-provisioner # or choose another name, must match deployment's env PROVISIONER_NAME'
parameters:
  archiveOnDelete: "false"
```

```shell
kubectl apply -f deploy/class.yaml
```

### 测试

* 创建 test 目录
```shell
mkdir test
cd test
```

* 下载测试资源
```shell
wget https://raw.githubusercontent.com/kubernetes-sigs/nfs-subdir-external-provisioner/master/deploy/test-claim.yaml
wget https://raw.githubusercontent.com/kubernetes-sigs/nfs-subdir-external-provisioner/master/deploy/test-pod.yaml
```

test-claim.yaml 
```yaml
kind: PersistentVolumeClaim
apiVersion: v1
metadata:
  name: test-claim
spec:
  storageClassName: nfs-client
  accessModes:
    - ReadWriteMany
  resources:
    requests:
      storage: 1Mi
```

test-pod.yaml 
```yaml
kind: Pod
apiVersion: v1
metadata:
  name: test-pod
spec:
  containers:
  - name: test-pod
    image: busybox:stable
    command:
      - "/bin/sh"
    args:
      - "-c"
      - "touch /mnt/SUCCESS.txt && exit 0 || exit 1"
    volumeMounts:
      - name: nfs-pvc
        mountPath: "/mnt"
  restartPolicy: "Never"
  volumes:
    - name: nfs-pvc
      persistentVolumeClaim:
        claimName: test-claim
```

* 部署测试资源
```shell
kubectl apply -f .
```

* 查看资源
```shell
kubectl get pvc,pv,sc,pod
```

```
NAME                               STATUS   VOLUME                                     CAPACITY   ACCESS MODES   STORAGECLASS   AGE
persistentvolumeclaim/test-claim   Bound    pvc-5fdc6fa2-f665-4807-b0ad-4013acce7115   1Mi        RWX            nfs-client     61s

NAME                                                        CAPACITY   ACCESS MODES   RECLAIM POLICY   STATUS   CLAIM                STORAGECLASS   REASON   AGE
persistentvolume/pvc-5fdc6fa2-f665-4807-b0ad-4013acce7115   1Mi        RWX            Delete           Bound    default/test-claim   nfs-client              61s

NAME                                     PROVISIONER                                   RECLAIMPOLICY   VOLUMEBINDINGMODE   ALLOWVOLUMEEXPANSION   AGE
storageclass.storage.k8s.io/nfs-client   k8s-sigs.io/nfs-subdir-external-provisioner   Delete          Immediate           false                  61s

NAME           READY   STATUS      RESTARTS   AGE
pod/test-pod   0/1     Completed   0          61s
```

* 检查 NFS Server 的 PVC 的目录下是否有文件 `SUCCESS`
```shell
ll /data/nfs/default-test-claim-pvc-416c5245-fe98-4868-8e76-567bd5a41274/
-rw-r--r-- 1 nobody nogroup    0 Jun 30 13:23 SUCCESS
```

* 删除资源
```shell
kubectl delete -f .
```

检查 NFS Server 的 PVC 的目录是否删除。

## 参考资料
* [StorageClass（存储类）](https://kubernetes.io/zh-cn/docs/concepts/storage/storage-classes/)
* [Kubernetes NFS Subdir External Provisioner](https://github.com/kubernetes-sigs/nfs-subdir-external-provisioner)
* [如何轻松的下载海外镜像](https://www.cnblogs.com/wubolive/p/17317586.html)
* [Day 21 — 鯨魚的萬應儲物小間：StorageClass (使用 NFS)](https://ithelp.ithome.com.tw/articles/10304306)
* [Create PVCs](https://docs.cloud.f5.com/docs/how-to/storage-management/create-pvcs)
* [NFS 於 Kubernetes 內的各種應用](https://www.hwchiu.com/kubernetes-storage-ii.html)
