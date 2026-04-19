---
layout: single
title:  "Kubernetes API"
date:   2021-06-22 00:00:00 +0800
categories: Kubernetes
tags: [kubectl, api-resources, explain]
---

## Kubernetes 对象
在 Kubernetes 系统中，Kubernetes 对象是持久化的实体。 Kubernetes 使用这些实体去表示整个集群的状态。
* apiVersion - 创建该对象所使用的 Kubernetes API 的版本
* kind - 想要创建的对象的类别
* metadata - 帮助唯一性标识对象的一些数据，包括一个 name 字符串、UID 和可选的 namespace
* spec - 对象规约，描述你希望对象所具有的特征：期望状态（Desired State）。
* status - 对象状态，描述了对象的 当前状态（Current State），它是由 Kubernetes 系统和组件 设置并更新的。在任何时刻，Kubernetes 控制平面 都一直积极地管理着对象的实际状态，以使之与期望状态相匹配。

## 查看 Pod 对象的完整描述
```shell
$ kubectl get pod kubia-864465c9d-744qc -o yaml
```
```yaml
apiVersion: v1
kind: Pod
metadata:
  creationTimestamp: "2021-06-24T00:13:37Z"
  generateName: kubia-864465c9d-
  labels:
    app: kubia
    pod-template-hash: 864465c9d
  name: kubia-864465c9d-744qc
  namespace: default
  ownerReferences:
  - apiVersion: apps/v1
    blockOwnerDeletion: true
    controller: true
    kind: ReplicaSet
    name: kubia-864465c9d
    uid: b58d1566-9ae7-40a9-892d-39ad57ab6b98
  resourceVersion: "125315890"
  selfLink: /api/v1/namespaces/default/pods/kubia-864465c9d-744qc
  uid: 64e30f28-0e99-400a-8bfd-645d3f3fa9a8
spec:
  containers:
  - image: wangjunjian/kubia:latest
    imagePullPolicy: Always
    name: kubia
    ports:
    - containerPort: 8080
      protocol: TCP
    resources: {}
    terminationMessagePath: /dev/termination-log
    terminationMessagePolicy: File
    volumeMounts:
    - mountPath: /var/run/secrets/kubernetes.io/serviceaccount
      name: default-token-jnqtk
      readOnly: true
  dnsPolicy: ClusterFirst
  enableServiceLinks: true
  nodeName: ln6
  priority: 0
  restartPolicy: Always
  schedulerName: default-scheduler
  securityContext: {}
  serviceAccount: default
  serviceAccountName: default
  terminationGracePeriodSeconds: 30
  tolerations:
  - effect: NoExecute
    key: node.kubernetes.io/not-ready
    operator: Exists
    tolerationSeconds: 300
  - effect: NoExecute
    key: node.kubernetes.io/unreachable
    operator: Exists
    tolerationSeconds: 300
  volumes:
  - name: default-token-jnqtk
    secret:
      defaultMode: 420
      secretName: default-token-jnqtk
status:
  conditions:
  - lastProbeTime: null
    lastTransitionTime: "2021-06-24T00:13:37Z"
    status: "True"
    type: Initialized
  - lastProbeTime: null
    lastTransitionTime: "2021-06-24T00:13:43Z"
    status: "True"
    type: Ready
  - lastProbeTime: null
    lastTransitionTime: "2021-06-24T00:13:43Z"
    status: "True"
    type: ContainersReady
  - lastProbeTime: null
    lastTransitionTime: "2021-06-24T00:13:37Z"
    status: "True"
    type: PodScheduled
  containerStatuses:
  - containerID: docker://2d8613bbe6a270dce57c589d7e8152d0e505819358ae41d743ddeb070d1e382a
    image: wangjunjian/kubia:latest
    imageID: docker-pullable://wangjunjian/kubia@sha256:fdb849cb970cda935a8d2379f656e49964c94c961005ec2165c5d20b898f6930
    lastState: {}
    name: kubia
    ready: true
    restartCount: 0
    started: true
    state:
      running:
        startedAt: "2021-06-24T00:13:43Z"
  hostIP: 172.16.33.174
  phase: Running
  podIP: 10.34.0.6
  podIPs:
  - ip: 10.34.0.6
  qosClass: BestEffort
  startTime: "2021-06-24T00:13:37Z"
  ```

## 查看支持的 API 对象
```shell
$ kubectl api-resources
```
```
NAME                              SHORTNAMES        APIGROUP                       NAMESPACED   KIND
bindings                                                                           true         Binding
componentstatuses                 cs                                               false        ComponentStatus
configmaps                        cm                                               true         ConfigMap
endpoints                         ep                                               true         Endpoints
events                            ev                                               true         Event
limitranges                       limits                                           true         LimitRange
namespaces                        ns                                               false        Namespace
nodes                             no                                               false        Node
persistentvolumeclaims            pvc                                              true         PersistentVolumeClaim
persistentvolumes                 pv                                               false        PersistentVolume
pods                              po                                               true         Pod
podtemplates                                                                       true         PodTemplate
replicationcontrollers            rc                                               true         ReplicationController
resourcequotas                    quota                                            true         ResourceQuota
secrets                                                                            true         Secret
serviceaccounts                   sa                                               true         ServiceAccount
services                          svc                                              true         Service
mutatingwebhookconfigurations                       admissionregistration.k8s.io   false        MutatingWebhookConfiguration
validatingwebhookconfigurations                     admissionregistration.k8s.io   false        ValidatingWebhookConfiguration
customresourcedefinitions         crd,crds          apiextensions.k8s.io           false        CustomResourceDefinition
apiservices                                         apiregistration.k8s.io         false        APIService
controllerrevisions                                 apps                           true         ControllerRevision
daemonsets                        ds                apps                           true         DaemonSet
deployments                       deploy            apps                           true         Deployment
replicasets                       rs                apps                           true         ReplicaSet
statefulsets                      sts               apps                           true         StatefulSet
tokenreviews                                        authentication.k8s.io          false        TokenReview
localsubjectaccessreviews                           authorization.k8s.io           true         LocalSubjectAccessReview
selfsubjectaccessreviews                            authorization.k8s.io           false        SelfSubjectAccessReview
selfsubjectrulesreviews                             authorization.k8s.io           false        SelfSubjectRulesReview
subjectaccessreviews                                authorization.k8s.io           false        SubjectAccessReview
horizontalpodautoscalers          hpa               autoscaling                    true         HorizontalPodAutoscaler
cronjobs                          cj                batch                          true         CronJob
jobs                                                batch                          true         Job
cephblockpools                                      ceph.rook.io                   true         CephBlockPool
cephclients                                         ceph.rook.io                   true         CephClient
cephclusters                                        ceph.rook.io                   true         CephCluster
cephfilesystems                                     ceph.rook.io                   true         CephFilesystem
cephnfses                         nfs               ceph.rook.io                   true         CephNFS
cephobjectrealms                                    ceph.rook.io                   true         CephObjectRealm
cephobjectstores                                    ceph.rook.io                   true         CephObjectStore
cephobjectstoreusers              rcou,objectuser   ceph.rook.io                   true         CephObjectStoreUser
cephobjectzonegroups                                ceph.rook.io                   true         CephObjectZoneGroup
cephobjectzones                                     ceph.rook.io                   true         CephObjectZone
cephrbdmirrors                                      ceph.rook.io                   true         CephRBDMirror
certificatesigningrequests        csr               certificates.k8s.io            false        CertificateSigningRequest
leases                                              coordination.k8s.io            true         Lease
endpointslices                                      discovery.k8s.io               true         EndpointSlice
events                            ev                events.k8s.io                  true         Event
ingresses                         ing               extensions                     true         Ingress
alertmanagerconfigs                                 monitoring.coreos.com          true         AlertmanagerConfig
alertmanagers                                       monitoring.coreos.com          true         Alertmanager
podmonitors                                         monitoring.coreos.com          true         PodMonitor
probes                                              monitoring.coreos.com          true         Probe
prometheuses                                        monitoring.coreos.com          true         Prometheus
prometheusrules                                     monitoring.coreos.com          true         PrometheusRule
servicemonitors                                     monitoring.coreos.com          true         ServiceMonitor
thanosrulers                                        monitoring.coreos.com          true         ThanosRuler
ingressclasses                                      networking.k8s.io              false        IngressClass
ingresses                         ing               networking.k8s.io              true         Ingress
networkpolicies                   netpol            networking.k8s.io              true         NetworkPolicy
runtimeclasses                                      node.k8s.io                    false        RuntimeClass
objectbucketclaims                obc,obcs          objectbucket.io                true         ObjectBucketClaim
objectbuckets                     ob,obs            objectbucket.io                false        ObjectBucket
poddisruptionbudgets              pdb               policy                         true         PodDisruptionBudget
podsecuritypolicies               psp               policy                         false        PodSecurityPolicy
clusterrolebindings                                 rbac.authorization.k8s.io      false        ClusterRoleBinding
clusterroles                                        rbac.authorization.k8s.io      false        ClusterRole
rolebindings                                        rbac.authorization.k8s.io      true         RoleBinding
roles                                               rbac.authorization.k8s.io      true         Role
volumes                           rv                rook.io                        true         Volume
priorityclasses                   pc                scheduling.k8s.io              false        PriorityClass
csidrivers                                          storage.k8s.io                 false        CSIDriver
csinodes                                            storage.k8s.io                 false        CSINode
storageclasses                    sc                storage.k8s.io                 false        StorageClass
volumeattachments                                   storage.k8s.io                 false        VolumeAttachment
```

## 查看支持的资源字段描述
```
<type>.<fieldName>[.<fieldName>]
```

### 查看 Pod 资源的字段描述
```yaml
kubectl explain pods
KIND:     Pod
VERSION:  v1

DESCRIPTION:
     Pod is a collection of containers that can run on a host. This resource is
     created by clients and scheduled onto hosts.

FIELDS:
   apiVersion	<string>
     APIVersion defines the versioned schema of this representation of an
     object. Servers should convert recognized schemas to the latest internal
     value, and may reject unrecognized values. More info:
     https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources

   kind	<string>
     Kind is a string value representing the REST resource this object
     represents. Servers may infer this from the endpoint the client submits
     requests to. Cannot be updated. In CamelCase. More info:
     https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds

   metadata	<Object>
     Standard object's metadata. More info:
     https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

   spec	<Object>
     Specification of the desired behavior of the pod. More info:
     https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status

   status	<Object>
     Most recently observed status of the pod. This data may not be up to date.
     Populated by the system. Read-only. More info:
     https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status
```

### 查看 Pod 资源的 spec 字段描述
```yaml
kubectl explain pod.spec
KIND:     Pod
VERSION:  v1

RESOURCE: spec <Object>

DESCRIPTION:
     Specification of the desired behavior of the pod. More info:
     https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status

     PodSpec is a description of a pod.

FIELDS:
   ...

   containers	<[]Object> -required-
     List of containers belonging to the pod. Containers cannot currently be
     added or removed. There must be at least one container in a Pod. Cannot be
     updated.

   ...

   volumes	<[]Object>
     List of volumes that can be mounted by containers belonging to the pod.
     More info: https://kubernetes.io/docs/concepts/storage/volumes
```

## 参考资料
* [理解 Kubernetes 对象](https://kubernetes.io/zh/docs/concepts/overview/working-with-objects/kubernetes-objects/)
* [API 概述](https://kubernetes.io/zh/docs/reference/using-api/)
* [Kubernetes API](https://kubernetes.io/zh/docs/concepts/overview/kubernetes-api/)
* [Kubernetes API 参考](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.21/)
* [Kubernetes API 约定](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-architecture/api-conventions.md)
