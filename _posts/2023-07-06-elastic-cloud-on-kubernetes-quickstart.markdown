---
layout: single
title:  "Elastic Cloud on Kubernetes 快速入门"
date:   2023-07-06 08:00:00 +0800
categories: ECK
tags: [Quickstart, Elasticsearch, Kibana, Filebeat, NTP, Kubernetes]
---

## 在 Kubernetes 集群中部署 ECK（Elastic Cloud Kubernetes）
### 安装自定义资源定义（Custom Resource Definition, CRD）

```shell
kubectl create -f https://download.elastic.co/downloads/eck/2.8.0/crds.yaml
```
```
customresourcedefinition.apiextensions.k8s.io/agents.agent.k8s.elastic.co created
customresourcedefinition.apiextensions.k8s.io/apmservers.apm.k8s.elastic.co created
customresourcedefinition.apiextensions.k8s.io/beats.beat.k8s.elastic.co created
customresourcedefinition.apiextensions.k8s.io/elasticmapsservers.maps.k8s.elastic.co created
customresourcedefinition.apiextensions.k8s.io/elasticsearchautoscalers.autoscaling.k8s.elastic.co created
customresourcedefinition.apiextensions.k8s.io/elasticsearches.elasticsearch.k8s.elastic.co created
customresourcedefinition.apiextensions.k8s.io/enterprisesearches.enterprisesearch.k8s.elastic.co created
customresourcedefinition.apiextensions.k8s.io/kibanas.kibana.k8s.elastic.co created
customresourcedefinition.apiextensions.k8s.io/logstashes.logstash.k8s.elastic.co created
customresourcedefinition.apiextensions.k8s.io/stackconfigpolicies.stackconfigpolicy.k8s.elastic.co created
```

查看安装的自定义资源

```shell
kubectl get crd
```
```
NAME                                                   CREATED AT
agents.agent.k8s.elastic.co                            2023-07-06T04:00:51Z
apmservers.apm.k8s.elastic.co                          2023-07-06T04:00:51Z
beats.beat.k8s.elastic.co                              2023-07-06T04:00:51Z
elasticmapsservers.maps.k8s.elastic.co                 2023-07-06T04:00:51Z
elasticsearchautoscalers.autoscaling.k8s.elastic.co    2023-07-06T04:00:51Z
elasticsearches.elasticsearch.k8s.elastic.co           2023-07-06T04:00:51Z
enterprisesearches.enterprisesearch.k8s.elastic.co     2023-07-06T04:00:51Z
kibanas.kibana.k8s.elastic.co                          2023-07-06T04:00:51Z
logstashes.logstash.k8s.elastic.co                     2023-07-06T04:00:51Z
stackconfigpolicies.stackconfigpolicy.k8s.elastic.co   2023-07-06T04:00:51Z
```

### 安装 Operator 及其 RBAC 规则

```shell
kubectl apply -f https://download.elastic.co/downloads/eck/2.8.0/operator.yaml
```
```
namespace/elastic-system created
serviceaccount/elastic-operator created
secret/elastic-webhook-server-cert created
configmap/elastic-operator created
clusterrole.rbac.authorization.k8s.io/elastic-operator created
clusterrole.rbac.authorization.k8s.io/elastic-operator-view created
clusterrole.rbac.authorization.k8s.io/elastic-operator-edit created
clusterrolebinding.rbac.authorization.k8s.io/elastic-operator created
service/elastic-webhook-server created
statefulset.apps/elastic-operator created
validatingwebhookconfiguration.admissionregistration.k8s.io/elastic-webhook.k8s.elastic.co created
```

### 监控 Operator 日志

```shell
kubectl -n elastic-system logs -f statefulset.apps/elastic-operator
```

## 部署 Elasticsearch 集群

### 创建 Elasticsearch 集群
创建一个简单的 Elasticsearch 集群，使用一个节点。

```shell
cat <<EOF | kubectl apply -f -
apiVersion: elasticsearch.k8s.elastic.co/v1
kind: Elasticsearch
metadata:
  name: quickstart
spec:
  version: 8.8.2
  nodeSets:
  - name: default
    count: 1
    config:
      node.store.allow_mmap: false
EOF
```
```
elasticsearch.elasticsearch.k8s.elastic.co/quickstart created
```

### 监控集群健康状况和创建进度
获取 Kubernetes 集群中当前 Elasticsearch 集群的概览，包括运行状况、版本和节点数量。

```shell
kubectl get elasticsearch
```
```
NAME         HEALTH    NODES   VERSION   PHASE             AGE
quickstart   unknown           8.8.2     ApplyingChanges   2m22s
```

发现健康的状态是 `unknown`，它来自 Elasticsearch 的集群健康 API。通过查看事件，找到 PVC 没有设置 Storage Class。

```shell
kubectl events
```
```
LAST SEEN               TYPE      REASON                  OBJECT                                                             MESSAGE
2m38s                   Normal    SuccessfulCreate        StatefulSet/quickstart-es-default                                  create Claim elasticsearch-data-quickstart-es-default-0 Pod quickstart-es-default-0 in StatefulSet quickstart-es-default success
2m38s                   Normal    SuccessfulCreate        StatefulSet/quickstart-es-default                                  create Pod quickstart-es-default-0 in StatefulSet quickstart-es-default successful
2m36s (x2 over 2m38s)   Warning   FailedScheduling        Pod/quickstart-es-default-0                                        0/3 nodes are available: pod has unbound immediate PersistentVolumeClaims. preemption: 0/3 nodes are available: 3 No preemption victims found for incoming pod..
6s (x13 over 2m38s)     Normal    FailedBinding           PersistentVolumeClaim/elasticsearch-data-quickstart-es-default-0   no persistent volumes available for this claim and no storage class is set
```

编辑 PVC 对象，在 `spec` 中设置 `storageClassName: nfs-client`

```shell
kubectl edit pvc elasticsearch-data-quickstart-es-default-0
```
```yaml
spec:
  storageClassName: nfs-client
```

需要等几分钟的时间，查看 Elasticsearch 集群的概览。

```shell
kubectl get elasticsearch
```
```
NAME         HEALTH    NODES   VERSION   PHASE             AGE
quickstart   unknown           8.8.2     ApplyingChanges   7m44s
```

还没有成功。通过查看事件，出现错误：`Readiness probe failed: {"timestamp": "2023-07-06T04:20:17+00:00", "message": "readiness probe failed", "curl_rc": "7"}`

```shell
kubectl events
```
```
LAST SEEN                TYPE      REASON                  OBJECT                                                             MESSAGE
9m27s                    Normal    SuccessfulCreate        StatefulSet/quickstart-es-default                                  create Pod quickstart-es-default-0 in StatefulSet quickstart-es-default successful
9m27s                    Normal    SuccessfulCreate        StatefulSet/quickstart-es-default                                  create Claim elasticsearch-data-quickstart-es-default-0 Pod quickstart-es-default-0 in StatefulSet quickstart-es-default success
4m25s (x23 over 9m27s)   Normal    FailedBinding           PersistentVolumeClaim/elasticsearch-data-quickstart-es-default-0   no persistent volumes available for this claim and no storage class is set
4m13s                    Normal    ProvisioningSucceeded   PersistentVolumeClaim/elasticsearch-data-quickstart-es-default-0   Successfully provisioned volume pvc-c3408e99-c65b-49aa-b39f-5ed3285d5815
4m13s (x4 over 9m27s)    Warning   FailedScheduling        Pod/quickstart-es-default-0                                        0/3 nodes are available: pod has unbound immediate PersistentVolumeClaims. preemption: 0/3 nodes are available: 3 No preemption victims found for incoming pod..
4m13s                    Normal    ExternalProvisioning    PersistentVolumeClaim/elasticsearch-data-quickstart-es-default-0   waiting for a volume to be created, either by external provisioner "k8s-sigs.io/nfs-subdir-external-provisioner" or manually created by system administrator
4m13s                    Normal    Provisioning            PersistentVolumeClaim/elasticsearch-data-quickstart-es-default-0   External provisioner is provisioning volume for claim "default/elasticsearch-data-quickstart-es-default-0"
4m4s                     Normal    Scheduled               Pod/quickstart-es-default-0                                        Successfully assigned default/quickstart-es-default-0 to cpu2
4m3s                     Normal    Pulling                 Pod/quickstart-es-default-0                                        Pulling image "docker.elastic.co/elasticsearch/elasticsearch:8.8.2"
112s                     Normal    Pulled                  Pod/quickstart-es-default-0                                        Successfully pulled image "docker.elastic.co/elasticsearch/elasticsearch:8.8.2" in 2m11.360542724s (2m11.360557388s including waiting)
112s                     Normal    Started                 Pod/quickstart-es-default-0                                        Started container elastic-internal-init-filesystem
112s                     Normal    Created                 Pod/quickstart-es-default-0                                        Created container elastic-internal-init-filesystem
109s                     Normal    Created                 Pod/quickstart-es-default-0                                        Created container elastic-internal-suspend
109s                     Normal    Pulled                  Pod/quickstart-es-default-0                                        Container image "docker.elastic.co/elasticsearch/elasticsearch:8.8.2" already present on machine
108s                     Normal    Created                 Pod/quickstart-es-default-0                                        Created container elasticsearch
108s                     Normal    Pulled                  Pod/quickstart-es-default-0                                        Container image "docker.elastic.co/elasticsearch/elasticsearch:8.8.2" already present on machine
108s                     Normal    Started                 Pod/quickstart-es-default-0                                        Started container elastic-internal-suspend
107s                     Normal    Started                 Pod/quickstart-es-default-0                                        Started container elasticsearch
93s                      Warning   Unhealthy               Pod/quickstart-es-default-0                                        Readiness probe failed: {"timestamp": "2023-07-06T04:20:17+00:00", "message": "readiness probe failed", "curl_rc": "7"}
```

通过 [Elasticsearch pod readiness probe fails with "message": "readiness probe failed", "curl rc": "7"](https://stackoverflow.com/questions/69466911/elasticsearch-pod-readiness-probe-fails-with-message-readiness-probe-failed) 了解到可以是时间同步出了问题。我检查了一下集群服务器并没有设置时间同步。

#### 设置时间同步
需要在集群里的每一台服务器都进行时间同步的设置。

* 安装 ntp
```shell
sudo apt update
sudo apt install ntp -y
```

* 配置 NTP 服务器
```shell
sudo vim /etc/ntp.conf
server pool.ntp.org
```

* 启动 NTP 服务
```shell
sudo systemctl start ntp     # Systemd 系统
sudo service ntp start       # SysV 系统
```

* 设置 NTP 服务开机自启动
确保 NTP 服务在机器重启后自动启动。

```shell
sudo systemctl enable ntp    # Systemd 系统
sudo chkconfig ntp on        # SysV 系统
```

* 等待 NTP 客户端与配置的 NTP 服务器同步时间

通过查看 ntp 服务的状态，发现了错误：`kernel reports TIME_ERROR: 0x2041: Clock Unsynchronized`

```shell
sudo systemctl status ntp
```
```
● ntp.service - Network Time Service
     Loaded: loaded (/lib/systemd/system/ntp.service; enabled; vendor preset: enabled)
     Active: active (running) since Thu 2023-07-06 12:33:15 CST; 9min ago
       Docs: man:ntpd(8)
   Main PID: 899729 (ntpd)
      Tasks: 2 (limit: 309287)
     Memory: 2.2M
     CGroup: /system.slice/ntp.service
             └─899729 /usr/sbin/ntpd -p /var/run/ntpd.pid -g -u 116:119

Jul 06 12:33:19 cpu1 ntpd[899729]: Soliciting pool server 119.28.206.193
Jul 06 12:33:20 cpu1 ntpd[899729]: Soliciting pool server 162.159.200.123
Jul 06 12:33:20 cpu1 ntpd[899729]: Soliciting pool server 202.112.29.82
Jul 06 12:33:20 cpu1 ntpd[899729]: Soliciting pool server 185.125.190.58
Jul 06 12:33:21 cpu1 ntpd[899729]: Soliciting pool server 91.189.94.4
Jul 06 12:33:22 cpu1 ntpd[899729]: Soliciting pool server 185.125.190.57
Jul 06 12:33:23 cpu1 ntpd[899729]: Soliciting pool server 185.125.190.56
Jul 06 12:33:24 cpu1 ntpd[899729]: Soliciting pool server 91.189.91.157
Jul 06 12:33:25 cpu1 ntpd[899729]: Soliciting pool server 2620:2d:4000:1::40
Jul 06 12:39:02 cpu1 ntpd[899729]: kernel reports TIME_ERROR: 0x2041: Clock Unsynchronized
```

需要使用手动同步时钟来解决。

```shell
sudo hwclock --hctosys     # 从硬件时钟同步到系统时钟
sudo hwclock --systohc     # 从系统时钟同步到硬件时钟
```


查看 Elasticsearch 集群的概览。

```shell
kubectl get elasticsearch
```
```
NAME         HEALTH   NODES   VERSION   PHASE   AGE
quickstart   green    1       8.8.2     Ready   36m
```

终于成功了。


查看 Elasticsearch 集群中的 Pod。

```shell
kubectl get pods --selector='elasticsearch.k8s.elastic.co/cluster-name=quickstart'
```
```
NAME                      READY   STATUS    RESTARTS   AGE
quickstart-es-default-0   1/1     Running   0          144m
```

查看 Pod 的日志

```shell
kubectl logs -f quickstart-es-default-0
```

### 请求 Elasticsearch 访问权限

系统会自动为您的集群创建 ClusterIP 服务

```shell
kubectl get service quickstart-es-http
```
```
NAME                 TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)    AGE
quickstart-es-http   ClusterIP   10.97.81.206   <none>        9200/TCP   155m
```

#### 获取凭据（credentials）。

系统会自动创建一个名为 `elastic` 的默认用户，其密码存储在 Kubernetes secret。

```shell
PASSWORD=$(kubectl get secret quickstart-es-elastic-user -o go-template='{{.data.elastic | base64decode}}')
```

#### 请求 Elasticsearch endpoint。
方法一：从 Kubernetes 集群内部：
```shell
kubectl exec -it quickstart-es-default-0 -- curl -u "elastic:$PASSWORD" -k "https://quickstart-es-http:9200"
```
```json
{
  "name" : "quickstart-es-default-0",
  "cluster_name" : "quickstart",
  "cluster_uuid" : "4_JCkqNDRxiHpWcEQq05DQ",
  "version" : {
    "number" : "8.8.2",
    "build_flavor" : "default",
    "build_type" : "docker",
    "build_hash" : "98e1271edf932a480e4262a471281f1ee295ce6b",
    "build_date" : "2023-06-26T05:16:16.196344851Z",
    "build_snapshot" : false,
    "lucene_version" : "9.6.0",
    "minimum_wire_compatibility_version" : "7.17.0",
    "minimum_index_compatibility_version" : "7.0.0"
  },
  "tagline" : "You Know, for Search"
}
```

方法二：通过 `kubectl port-forward`，在本地访问。
```shell
kubectl port-forward service/quickstart-es-http 9200
```

```shell
curl -u "elastic:$PASSWORD" -k "https://localhost:9200"
```

### 删除 Elasticsearch 集群
```shell
kubectl delete Elasticsearch quickstart 
```

## 部署 Kibana 实例
### 创建一个 Kibana 实例并将其与您的 Elasticsearch 集群关联

```shell
cat <<EOF | kubectl apply -f -
apiVersion: kibana.k8s.elastic.co/v1
kind: Kibana
metadata:
  name: quickstart
spec:
  version: 8.8.2
  count: 1
  config:
    i18n.locale: zh-CN
  elasticsearchRef:
    name: quickstart
EOF
```
```
kibana.kibana.k8s.elastic.co/quickstart created
```

* [how to add i18n.locale: zh-CN to kibana](https://github.com/elastic/cloud-on-k8s/issues/1182)


### 监控 Kibana 健康状况
```shell
kubectl get kibana
```
```
NAME         HEALTH   NODES   VERSION   AGE
quickstart   green    1       8.8.2     2m18s
```

关联的 Pod

```shell
kubectl get pod --selector='kibana.k8s.elastic.co/name=quickstart'
```
```
NAME                             READY   STATUS    RESTARTS   AGE
quickstart-kb-847cb7879d-8pgcv   1/1     Running   0          3m6s
```

### 访问 Kibana

会自动为 Kibana 创建 ClusterIP 服务。

```shell
kubectl get service quickstart-kb-http
```
```
NAME                 TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)    AGE
quickstart-kb-http   ClusterIP   10.101.36.136   <none>        5601/TCP   5m20s
```

通过 `kubectl port-forward`，在本地访问。
```shell
kubectl port-forward service/quickstart-kb-http 5601
```

在浏览器中使用 `https://localhost:5601` 进行访问。

使用 `elastic` 用户和通过下面的命令获得的密码登录。

```shell
kubectl get secret quickstart-es-elastic-user -o=jsonpath='{.data.elastic}' | base64 --decode; echo
```

## 部署 Filebeat 实例

```shell
cat <<EOF | kubectl apply -f -
apiVersion: beat.k8s.elastic.co/v1beta1
kind: Beat
metadata:
  name: quickstart
spec:
  type: filebeat
  version: 8.8.2
  elasticsearchRef:
    name: quickstart
  kibanaRef:
    name: quickstart
  config:
    # 排障时打开
    # logging.level: debug 
    filebeat.inputs:
    - type: container
      paths:
      - /var/log/containers/*.log
  daemonSet:
    podTemplate:
      spec:
        # 影响Pod中的/etc/resolv.conf 
        # DNS 请求会在优先在集群域查询，即使 hostNetwork: true
        dnsPolicy: ClusterFirstWithHostNet
        hostNetwork: true
        securityContext:
          runAsUser: 0
        containers:
        - name: filebeat
          resources:
            requests:
              memory:
              cpu:
            limits:
              memory:
              cpu:
          volumeMounts:
          - name: varlogcontainers
            mountPath: /var/log/containers
          - name: varlogpods
            mountPath: /var/log/pods
        volumes:
        - name: varlogcontainers
          hostPath:
            path: /var/log/containers
        - name: varlogpods
          hostPath:
            path: /var/log/pods
EOF
```

查看部署的 Filebeat 实例

```shell
kubectl get pods -o wide --selector='beat.k8s.elastic.co/name=quickstart'
```
```
NAME                             READY   STATUS    RESTARTS      AGE   IP              NODE   NOMINATED NODE   READINESS GATES
quickstart-beat-filebeat-56z5s   1/1     Running   5 (31m ago)   32m   172.16.33.159   cpu3   <none>           <none>
quickstart-beat-filebeat-wqtq8   1/1     Running   4 (31m ago)   32m   172.16.33.158   cpu2   <none>           <none>
```


创建一个应用，每秒产生一条日志。

```shell
apiVersion: v1
kind: Pod
metadata:
  name: time-pod
spec:
  containers:
  - name: time-container
    image: python:3
    command: ["python"]
    args: ["-u", "-c", "exec(\"import time\\nwhile True:\\n  print('[custom_field_name] Current time:', time.strftime('%Y-%m-%d %H:%M:%S'))\\n  time.sleep(1)\")"]
```

在浏览器中使用 `https://localhost:5601` 进行日志浏览和策略设置。


## 升级您的部署
您可以添加和修改原始集群规范的大多数元素，前提是它们转换为底层 Kubernetes 资源的有效转换（例如，现有卷声明无法缩小）。 操作员将尝试应用您的更改，同时将对现有集群的干扰降至最低。 您应该确保 Kubernetes 集群有足够的资源来适应更改（额外的存储空间、足够的内存和 CPU 资源来临时启动新的 pod 等）。

例如，您可以将集群扩展到三个 Elasticsearch 节点：

```shell
cat <<EOF | kubectl apply -f -
apiVersion: elasticsearch.k8s.elastic.co/v1
kind: Elasticsearch
metadata:
  name: quickstart
spec:
  version: 8.8.2
  nodeSets:
  - name: default
    count: 3
    config:
      node.store.allow_mmap: false
EOF
```

## 查看 Elasticsearch CRD 规范
```shell
kubectl describe crd elasticsearch
```


## 参考资料
* [Elastic Cloud on Kubernetes Quickstart](https://www.elastic.co/guide/en/cloud-on-k8s/current/k8s-quickstart.html)
* [Elasticsearch Guide](https://www.elastic.co/guide/en/elasticsearch/reference/8.8/index.html)
* [Kibana 用户手册](https://www.elastic.co/guide/cn/kibana/current/index.html)
* [Elastic Docs](https://www.elastic.co/guide/index.html)
* [Elasticsearch (ECK) Operator](https://operatorhub.io/operator/elastic-cloud-eck)
* [Elastic Cloud On Kubernetes (ECK) 讓 ELK 部署變簡單 – 概念介紹與快速上手指南！](https://www.omniwaresoft.com.tw/techcolumn/elastic-techcolumn/eck-elastic-cloud-on-kubernetes-quickstart/)
* [Elastic Stack 实战手册](https://developer.aliyun.com/ebook/7687)
* [使用 ECK 在 Kubernetes 集群中管理 Elastic Stack](https://zhuanlan.zhihu.com/p/610315721)
* [使用 ECK 在 Kubernetes 集群中管理 Elastic Stack](https://www.se7enshare.cn/shi-yong-eck-zai-kubernetes-ji-qun-zhong-guan-li-elastic-stack/)
* [从ElasticStack构建Kubernetes日志采集系统](https://k8s.dayang.link/docs/note/%E4%BB%8EElasticStack%E6%9E%84%E5%BB%BAKubernetes%E6%97%A5%E5%BF%97%E9%87%87%E9%9B%86%E7%B3%BB%E7%BB%9F/)
* [Elasticsearch data node 重啟導致 sharding 找不到家](https://shazi.info/elasticsearch-data-node-%E9%87%8D%E5%95%9F%E5%B0%8E%E8%87%B4-sharding-%E6%89%BE%E4%B8%8D%E5%88%B0%E5%AE%B6/)
* [Elasticsearch集群健康状态显示为yellow排查](https://www.cnblogs.com/charles101/p/14488609.html)
* [kubernetes(k8s)构建elk(filebeat)日志收集系统 - k8s系列(四)](https://blog.51cto.com/lzcit/5173977)
