---
layout: post
title:  "Kubernetes API 服务器的安全防护"
date:   2021-07-11 00:00:00 +0800
categories: Kubernetes
tags: [ServiceAccount, RBAC]
---

## 认证机制
API 服务器接收的请求经过认证插件列表，当遇到第一个成功返回用户名、用户ID和组信息给 API 服务器后，将停止剩余的认证调用，进入授权阶段。

### ServiceAccount

### 镜像拉取密钥
**向 ServiceAccount 中添加 imagePullSecrets，可以不必对每个 Pod 单独添加 imagePullSecrets。**

创建 docker-registry Secret
```shell
kubectl create secret docker-registry mydockerhubsecret \
  --docker-username=myusername \
  --docker-password=mypassword \
  --docker-email=myemail
```

编写 ServiceAccount YAML 文件（sa-image-pull-secret.yaml）
```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: image-pull-secret
imagePullSecrets:
- name: mydockerhubsecret
```

创建 ServiceAccount 对象
```shell
kubectl apply -f sa-image-pull-secret.yaml
```

编写 Pod YAML 文件（private-serviceaccount.yaml），指定 serviceAccountName 为 image-pull-secret。
```shell
apiVersion: v1
kind: Pod
metadata:
  name: private
spec:
  containers:
  - image: wangjunjian/private:latest
    name: private
  serviceAccountName: image-pull-secret
```

创建 Pod 对象
```shell
kubectl apply -f private-serviceaccount.yaml
```

## RBAC
> 基于角色的访问控制（Role-Based Access Control）

### HTTP 动词与请求动词的映射关系

| HTTP 动词 | 请求动词 |
| ---      | ---     |
| POST | create |
| GET, HEAD | get （针对单个资源）、list（针对集合） |
| PUT | update |
| PATCH | patch |
| DELETE | delete（针对单个资源）、deletecollection（针对集合） |

### 四种 RBAC 资源
RBAC API 声明了四种 Kubernetes 对象：Role、ClusterRole、RoleBinding 和 ClusterRoleBinding。

可以通过 kubectl api-resources 查看
```shell
$ kubectl api-resources | grep rbac
NAME                  SHORTNAMES   APIGROUP                    NAMESPACED   KIND
clusterrolebindings                rbac.authorization.k8s.io   false        ClusterRoleBinding
clusterroles                       rbac.authorization.k8s.io   false        ClusterRole
rolebindings                       rbac.authorization.k8s.io   true         RoleBinding
roles                              rbac.authorization.k8s.io   true         Role
```

### 测试准备
创建两个名字空间 foo 和 bar 用于接下来的测试。
```shell
$ kubectl create namespace foo
namespace/foo created
$ kubectl create namespace bar
namespace/bar created
```

分别在两个名字空间中创建 Pod 对象
```shell
$ kubectl run test --image=luksa/kubectl-proxy -n foo
pod/test created
$ kubectl run test --image=luksa/kubectl-proxy -n bar
pod/test created
```

列出 foo 名字空间中的所有 Pod 对象
```shell
$ kubectl exec -it -n foo test -- curl localhost:8001/api/v1/namespaces/foo/pods
{
  "kind": "Status",
  "apiVersion": "v1",
  "metadata": {
    
  },
  "status": "Failure",
  "message": "pods is forbidden: User \"system:serviceaccount:foo:default\" cannot list resource \"pods\" in API group \"\" in the namespace \"foo\"",
  "reason": "Forbidden",
  "details": {
    "kind": "pods"
  },
  "code": 403
}
```
这说明没有权限。

### Role（角色）
编写角色 YAML 文件（pod-reader.yaml）
```shell
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  namespace: foo
  name: pod-reader
rules:
- apiGroups: [""] # "" 标明 core API 组
  resources: ["pods"]
  verbs: ["get", "watch", "list"]
```

创建角色
```shell
$ kubectl apply -f pod-reader.yaml 
role.rbac.authorization.k8s.io/pod-reader created
```

查看角色对象
```shell
$ kubectl get role -n foo
NAME         CREATED AT
pod-reader   2021-08-04T08:53:50Z
```

这里通过命令的方式创建角色
```shell
$ kubectl create role pod-reader --verb=get --verb=watch --verb=list \
    --resource=pods -n bar
role.rbac.authorization.k8s.io/pod-reader created
```

删除角色
```shell
$ kubectl delete role pod-reader -n bar
role.rbac.authorization.k8s.io "pod-reader" deleted
```

### RoleBinding（角色绑定）
编写角色绑定 YAML 文件（read-pods.yaml）
```shell
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: read-pods
  namespace: foo
subjects:
- kind: ServiceAccount
  name: default
  namespace: foo
- kind: ServiceAccount
  name: default
  namespace: bar
roleRef:
  kind: Role
  name: pod-reader    
  apiGroup: rbac.authorization.k8s.io
```

创建角色绑定
```shell
$ kubectl apply -f read-pods.yaml 
rolebinding.rbac.authorization.k8s.io/read-pods created
```

通过命令创建角色绑定
```shell
$ kubectl create rolebinding read-pods --role=pod-reader \
    --serviceaccount=foo:default -n foo
rolebinding.rbac.authorization.k8s.io/read-pods created
```

列出 foo 名字空间中的所有 Pod 对象
```shell
kubectl exec -it -n foo test -- curl localhost:8001/api/v1/namespaces/foo/pods
{
  "kind": "PodList",
  "apiVersion": "v1",
  "metadata": {
    "resourceVersion": "984933"
  },
  "items": [
    {
      "metadata": {
        "name": "test",
        "namespace": "foo",
        "uid": "55366a1f-307e-495e-8575-c2b61a462329",
        "resourceVersion": "983870",
        "creationTimestamp": "2021-08-04T10:42:28Z",
        "labels": {
          "run": "test"
        },
...
    }
  ]
}
```

删除角色绑定
```shell
$ kubectl delete rolebinding read-pods -n foo
rolebinding.rbac.authorization.k8s.io "read-pods" deleted
```

运行编辑命令在 subjects: 下面增加 bar 名字空间下的默认 ServiceAccount
```shell
kubectl edit rolebinding read-pods -n foo
```
```yaml
- kind: ServiceAccount
  name: default
  namespace: bar
```

现在可以在 bar 名字空间下通过容器访问 foo 名字空间里的所有 Pod 对象。
```shell
$ kubectl exec -it -n bar test -- curl localhost:8001/api/v1/namespaces/foo/pods
```

## 参考资料
* [Multitenancy and role-based access control in Red Hat OpenShift](https://developer.ibm.com/technologies/containers/tutorials/multitenancy-and-role-based-access-control/)
