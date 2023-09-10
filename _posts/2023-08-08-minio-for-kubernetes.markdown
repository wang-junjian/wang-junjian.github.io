---
layout: post
title:  "MinIO for Kubernetes"
date:   2023-08-08 08:00:00 +0800
categories: MinIO
tags: [Kubernetes]
---

## DirectPV
### 安装 DirectPV plugin
#### Krew
```shell
kubectl krew update
kubectl krew install directpv
```

#### Release 二进制
```shell
release=$(curl -sfL "https://api.github.com/repos/minio/directpv/releases/latest" | awk '/tag_name/ { print substr($2, 3, length($2)-4) }')
curl -fLo kubectl-directpv https://github.com/minio/directpv/releases/download/v${release}/kubectl-directpv_${release}_linux_amd64
sudo chmod a+x kubectl-directpv
sudo mv kubectl-directpv /usr/local/bin/
```

### 安装 DirectPV CSI driver
```shell
kubectl directpv install
```
```

 ███████████████████████████████████████████████████████████████████████████ 100%

┌──────────────────────────────────────┬──────────────────────────┐
│ NAME                                 │ KIND                     │
├──────────────────────────────────────┼──────────────────────────┤
│ directpv                             │ Namespace                │
│ directpv-min-io                      │ ServiceAccount           │
│ directpv-min-io                      │ ClusterRole              │
│ directpv-min-io                      │ ClusterRoleBinding       │
│ directpv-min-io                      │ Role                     │
│ directpv-min-io                      │ RoleBinding              │
│ directpvdrives.directpv.min.io       │ CustomResourceDefinition │
│ directpvvolumes.directpv.min.io      │ CustomResourceDefinition │
│ directpvnodes.directpv.min.io        │ CustomResourceDefinition │
│ directpvinitrequests.directpv.min.io │ CustomResourceDefinition │
│ directpv-min-io                      │ CSIDriver                │
│ directpv-min-io                      │ StorageClass             │
│ node-server                          │ Daemonset                │
│ controller                           │ Deployment               │
└──────────────────────────────────────┴──────────────────────────┘

DirectPV installed successfully
```

* [安装 DirectPV](https://github.com/minio/directpv/blob/master/docs/installation.md)

查看安装的对象

```shell
kubectl -n directpv get all
```
```
NAME                              READY   STATUS    RESTARTS      AGE
pod/controller-78d74455f8-64kqk   3/3     Running   0             24h
pod/controller-78d74455f8-jkvd7   3/3     Running   0             24h
pod/controller-78d74455f8-r5wd9   3/3     Running   0             24h
pod/node-server-5zkjg             4/4     Running   2 (24h ago)   24h
pod/node-server-nfcn2             4/4     Running   2 (24h ago)   24h

NAME                         DESIRED   CURRENT   READY   UP-TO-DATE   AVAILABLE   NODE SELECTOR   AGE
daemonset.apps/node-server   2         2         2       2            2           <none>          24h

NAME                         READY   UP-TO-DATE   AVAILABLE   AGE
deployment.apps/controller   3/3     3            3           24h

NAME                                    DESIRED   CURRENT   READY   AGE
replicaset.apps/controller-78d74455f8   3         3         3       24h
```

查看 `StorageClass` 对象 `directpv-min-io`

```shell
kubectl get sc directpv-min-io
```
```
NAME              PROVISIONER       RECLAIMPOLICY   VOLUMEBINDINGMODE      ALLOWVOLUMEEXPANSION   AGE
directpv-min-io   directpv-min-io   Delete          WaitForFirstConsumer   true                   46h
```

```shell
kubectl describe sc directpv-min-io
```
```
Name:                  directpv-min-io
IsDefaultClass:        No
Annotations:           <none>
Provisioner:           directpv-min-io
Parameters:            fstype=xfs
AllowVolumeExpansion:  True
MountOptions:          <none>
ReclaimPolicy:         Delete
VolumeBindingMode:     WaitForFirstConsumer
AllowedTopologies:     
  Term 0:              directpv.min.io/identity in [directpv-min-io]
Events:                <none>
```

### Drive 管理
#### umount
**如果节点的 Drive 已经挂载使用，需要先进行卸载。**

```shell
sudo umount /data
sudo vim /etc/fstab
```
```
#/dev/sdb1       /data ext4 defaults 0 0
```

没有 umount 会出现下面的显示。

```shell
kubectl directpv discover
```
```

 Discovered node 'cpu2' ✔
 Discovered node 'cpu3' ✔

No drives are available to initialize
```


#### Add drives
- 1.discover

```shell
kubectl directpv discover
```
```
 Discovered node 'cpu2' ✔
 Discovered node 'cpu3' ✔

┌─────────────────────┬──────┬───────┬─────────┬────────────┬──────────────────────┬───────────┬─────────────┐
│ ID                  │ NODE │ DRIVE │ SIZE    │ FILESYSTEM │ MAKE                 │ AVAILABLE │ DESCRIPTION │
├─────────────────────┼──────┼───────┼─────────┼────────────┼──────────────────────┼───────────┼─────────────┤
│ 8:17$WXh/3EDsYmd... │ cpu2 │ sdb1  │ 2.0 TiB │ ext4       │ PM8060- ln2 (Part 1) │ YES       │ -           │
│ 8:17$4FPY/iJfMKt... │ cpu3 │ sdb1  │ 2.0 TiB │ ext4       │ PM8060- ln1 (Part 1) │ YES       │ -           │
└─────────────────────┴──────┴───────┴─────────┴────────────┴──────────────────────┴───────────┴─────────────┘

Generated 'drives.yaml' successfully.
```

drives.yaml
```yaml
version: v1
nodes:
    - name: cpu2
      drives:
        - id: 8:17$WXh/3EDsYmdG7I7R1ElzTxEf7lOngT2QjaB6QG0a2OA=
          name: sdb1
          size: 2199022206976
          make: PM8060- ln2 (Part 1)
          fs: ext4
          select: "yes"
    - name: cpu3
      drives:
        - id: 8:17$4FPY/iJfMKtxIqiMjW8eMoFKyCTXlTNKPZugnr2RETs=
          name: sdb1
          size: 2199022206976
          make: PM8060- ln1 (Part 1)
          fs: ext4
          select: "yes"
```

- 2.init

```shell
kubectl directpv init drives.yaml --dangerous
```
```
 ███████████████████████████████████████████████████████████████████████████ 100%

 Processed initialization request '591db6bf-e927-4aae-87ef-be9471bcfa5e' for node 'cpu2' ✔
 Processed initialization request 'a38466e9-2d86-40b3-803b-1edf156e5cb3' for node 'cpu3' ✔

┌──────────────────────────────────────┬──────┬───────┬─────────┐
│ REQUEST_ID                           │ NODE │ DRIVE │ MESSAGE │
├──────────────────────────────────────┼──────┼───────┼─────────┤
│ 591db6bf-e927-4aae-87ef-be9471bcfa5e │ cpu2 │ sdb1  │ Success │
│ a38466e9-2d86-40b3-803b-1edf156e5cb3 │ cpu3 │ sdb1  │ Success │
└──────────────────────────────────────┴──────┴───────┴─────────┘
```

#### 获得安装信息
```shell
kubectl directpv info
```
```
┌────────┬──────────┬───────────┬─────────┬────────┐
│ NODE   │ CAPACITY │ ALLOCATED │ VOLUMES │ DRIVES │
├────────┼──────────┼───────────┼─────────┼────────┤
│ • cpu2 │ 2.0 TiB  │ 0 B       │ 0       │ 1      │
│ • cpu3 │ 2.0 TiB  │ 0 B       │ 0       │ 1      │
└────────┴──────────┴───────────┴─────────┴────────┘

0 B/4.0 TiB used, 0 volumes, 2 drives
```

#### List drives
```shell
kubectl directpv list drives
```
```
┌──────┬──────┬──────────────────────┬─────────┬─────────┬─────────┬────────┐
│ NODE │ NAME │ MAKE                 │ SIZE    │ FREE    │ VOLUMES │ STATUS │
├──────┼──────┼──────────────────────┼─────────┼─────────┼─────────┼────────┤
│ cpu2 │ sdb1 │ PM8060- ln2 (Part 1) │ 2.0 TiB │ 2.0 TiB │ -       │ Ready  │
│ cpu3 │ sdb1 │ PM8060- ln1 (Part 1) │ 2.0 TiB │ 2.0 TiB │ -       │ Ready  │
└──────┴──────┴──────────────────────┴─────────┴─────────┴─────────┴────────┘
```

### 卸载 DirectPV CSI driver
```shell
kubectl directpv uninstall
```

* [MinIO DIRECTPV](https://min.io/directpv)


## MinIO
### 安装 [MinIO Operator](https://github.com/minio/operator)
```shell
curl https://github.com/minio/operator/releases/download/v5.0.7/kubectl-minio_5.0.7_linux_amd64 -o kubectl-minio
chmod +x kubectl-minio
mv kubectl-minio /usr/local/bin/
```

#### 查看版本
```shell
kubectl minio version
v5.0.7
```

#### 初始化 MinIO Operator
```shell
kubectl minio init
```
```
namespace/minio-operator created
serviceaccount/minio-operator created
clusterrole.rbac.authorization.k8s.io/minio-operator-role created
clusterrolebinding.rbac.authorization.k8s.io/minio-operator-binding created
customresourcedefinition.apiextensions.k8s.io/tenants.minio.min.io created
customresourcedefinition.apiextensions.k8s.io/policybindings.sts.min.io created
service/operator created
service/sts created
deployment.apps/minio-operator created
serviceaccount/console-sa created
secret/console-sa-secret created
clusterrole.rbac.authorization.k8s.io/console-sa-role created
clusterrolebinding.rbac.authorization.k8s.io/console-sa-binding created
configmap/console-env created
service/console created
deployment.apps/console created
-----------------

To open Operator UI, start a port forward using this command:

kubectl minio proxy -n minio-operator 

-----------------
```

#### 验证 MinIO Operator 的安装
```shell
kubectl get all --namespace minio-operator
```
```
NAME                                  READY   STATUS    RESTARTS   AGE
pod/console-686884ff5b-mwn7b          1/1     Running   0          74s
pod/minio-operator-599d6c9bbc-4cbnt   1/1     Running   0          74s
pod/minio-operator-599d6c9bbc-fdwrx   1/1     Running   0          74s

NAME               TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)             AGE
service/console    ClusterIP   10.98.151.69    <none>        9090/TCP,9443/TCP   74s
service/operator   ClusterIP   10.98.189.226   <none>        4221/TCP            74s
service/sts        ClusterIP   10.103.1.60     <none>        4223/TCP            74s

NAME                             READY   UP-TO-DATE   AVAILABLE   AGE
deployment.apps/console          1/1     1            1           74s
deployment.apps/minio-operator   2/2     2            2           74s

NAME                                        DESIRED   CURRENT   READY   AGE
replicaset.apps/console-686884ff5b          1         1         1       74s
replicaset.apps/minio-operator-599d6c9bbc   2         2         2       74s
```

### 访问 MinIO Operator 控制台
```shell
kubectl minio proxy -n minio-operator
```
```
Starting port forward of the Console UI.

To connect open a browser and go to http://localhost:9090

Current JWT to login: TOKENSTRING

Forwarding from 0.0.0.0:9090 -> 9090
```

#### 创建租户（Tenant）

需要保证 `Total Volumes` 至少为 `4`，否则会报错：`pool #0 with 2 servers must have at least 4 volumes in total`。

我的 Kubernetes 集群是 3 台服务器，2 台 Worker 节点，每台服务器有 1 块 2T 的硬盘，所以我这里设置 `Number of Servers` 为 2，`Drives per Server*` 为 2 。

![](/images/2023/minio/create-tanant.jpg)

创建成功后，会显示租户的 Access Key 和 Secret Key，需要保存下来，以便后续使用。

![](/images/2023/minio/tanant-key.jpg)

#### 查看租户（Tenant）的详细信息

![](/images/2023/minio/tanant-details.jpg)

#### 租户（Tenant）管理
[http://localhost:9090/namespaces/tenant1/tenants/tenant1/hop](http://localhost:9090/namespaces/tenant1/tenants/tenant1/hop)

### 租户（Tenant）
#### 通过命令创建租户（Tenant）
```shell
kubectl create namespace tenant2
namespace/tenant2 created
```

```shell
kubectl minio tenant create tenant2 --servers 2 --volumes 4 --capacity 1Ti --namespace tenant2
```
```
W0816 15:04:55.788343 2135116 warnings.go:70] unknown field "spec.pools[0].volumeClaimTemplate.metadata.creationTimestamp"

Tenant 'tenant2' created in 'tenant2' Namespace

  Username: 56NBHQRMB4G5KRUSS11H 
  Password: p5tlVfFneR8NMoLrz7temCtFo3QuWIBAIYmtbWvt 
  Note: Copy the credentials to a secure location. MinIO will not display these again.

APPLICATION	SERVICE NAME   	NAMESPACE	SERVICE TYPE	SERVICE PORT 
MinIO      	minio          	tenant2  	ClusterIP   	443         	
Console    	tenant2-console	tenant2  	ClusterIP   	9443
```

#### 列出所有的租户（Tenant）
```shell
kubectl minio tenant list
```
```

Tenant 'tenant1', Namespace 'tenant1', Total capacity 1.0 TiB

  Current status: Initialized 
  MinIO version: minio/minio:RELEASE.2023-08-09T23-30-22Z 

Tenant 'tenant2', Namespace 'tenant2', Total capacity 1.0 TiB

  Current status: Provisioning initial users 
  MinIO version: minio/minio:RELEASE.2023-07-21T21-12-44Z 
```

#### 查看租户（Tenant）创建的 Kubernetes 对象
```shell
kubectl -n tenant1 get all -o wide
```
```
NAME                   READY   STATUS    RESTARTS   AGE     IP           NODE   NOMINATED NODE   READINESS GATES
pod/tenant1-pool-0-0   2/2     Running   0          5d21h   10.32.0.19   cpu2   <none>           <none>
pod/tenant1-pool-0-1   2/2     Running   0          5d21h   10.42.0.17   cpu3   <none>           <none>

NAME                      TYPE           CLUSTER-IP      EXTERNAL-IP   PORT(S)          AGE     SELECTOR
service/minio             LoadBalancer   10.106.35.89    <pending>     443:30779/TCP    5d21h   v1.min.io/tenant=tenant1
service/tenant1-console   LoadBalancer   10.103.138.18   <pending>     9443:32004/TCP   5d21h   v1.min.io/tenant=tenant1
service/tenant1-hl        ClusterIP      None            <none>        9000/TCP         5d21h   v1.min.io/tenant=tenant1

NAME                              READY   AGE     CONTAINERS      IMAGES
statefulset.apps/tenant1-pool-0   2/2     5d21h   minio,sidecar   minio/minio:RELEASE.2023-08-09T23-30-22Z,minio/operator:v5.0.7
```

#### 查看租户（Tenant）的状态
```shell
kubectl minio tenant status tenant1
```
```
=====================
Pools:              1 
Revision:           0 
Sync version:        
Write quorum:       3 
Health status:      green 
Drives online:      4 
Drives offline:     0 
Drives healing:     0 
Current status:     Initialized 
Usable capacity:    0 B 
Provisioned users:  true 
Available replicas: 2 
```

#### 查看租户（Tenant）的 Volumn 信息
```shell
kubectl minio tenant info tenant1
```
```
Tenant 'tenant1', Namespace 'tenant1', Total capacity 1.0 TiB

Current status: Initialized
MinIO version: minio/minio:RELEASE.2023-08-09T23-30-22Z
MinIO service: minio/ClusterIP (port 443)
Console service: tenant1-console/ClusterIP (port 9443)

POOL	SERVERS	VOLUMES(SERVER)	CAPACITY(VOLUME) 
0   	2      	2              	256 GiB         	

MinIO Root User Credentials:
MINIO_ROOT_USER="ZZMWXMJS2WTNR2FJ"
MINIO_ROOT_PASSWORD="BQ1DRJZ5WCS3CMTFSIO0NWJJTNDRX4GW"
```

#### 删除租户（Tenant）
```shell
kubectl minio tenant delete tenant2 -n tenant2
```
```
This will delete the Tenant tenant2 and ALL its data. Do you want to proceed: y
Deleting MinIO Tenant:  tenant2
Deleting MinIO Tenant Configuration Secret:  tenant2-env-configuration
Deleting MinIO Tenant user:  tenant2-user-1
```

### 创建 Bucket
Tenant -> Metrics -> Info -> Buckets -> Browse -> Create Bucket
- Bucket Name: `bucket1`


Access Keys -> Create Access Key
* Access Key: nFg9LOrz3Ju1atdpgTMZ
* Secret Key: nHkgdvk292apIYBbnNw6ZkJVjPuNXXUYufil9Lf5

安装 mc
brew install minio/stable/mc
mc --help

2QIc4adOfPItepGk
Flef1D8ufTORK5a2m6XHLsq4TNNEpL3g

HSRMqwVniCzIdiWIGaVS
R4NcStgw3BiksYfdacp3ZKzK9cJEOTsoGbEJXhtE


## 参考资料
* [MinIO Object Store](https://play.min.io:9443/browser)
* [MinIO for Kubernetes](https://min.io/product/kubernetes)
* [MinIO Object Storage for Kubernetes](https://min.io/docs/minio/kubernetes/upstream/index.html)
* [[Fastify] Day24 - Upload File to Object Storage (MinIO)](https://ithelp.ithome.com.tw/articles/10306493?sc=rss.iron)
* [如何通过minio operator在k8s中部署minio租户（tenant）集群](https://www.cnblogs.com/chuanzhang053/p/16190774.html)
* [506.【kubernetes】在 k8s 集群上部署 Minio Operator 和 Minio Plugin](https://www.jianshu.com/p/f970c6fdc8cb)
* [0195.K Kubernetes上部署MinIO Operator](https://www.modb.pro/db/639460)
* [Kubernetes1.26.3 高可用集群](https://blog.csdn.net/gyfghh/article/details/130592003)
* [HwameiStor 对 Minio 的支持](https://hwameistor.io/cn/blog/minio)
* [Stuck on "Provisioning MinIO Headless Service" #632](https://github.com/minio/operator/issues/632)
