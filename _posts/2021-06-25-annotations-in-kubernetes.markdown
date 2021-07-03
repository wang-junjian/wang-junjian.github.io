---
layout: post
title:  "Kubernetes中的注解"
date:   2021-06-25 00:00:00 +0800
categories: Kubernetes
tags: [kubectl, annotate]
---

## 注解
注解也是键值对，和标签类似，但没有对象的选择器来进行分组筛选，它可以容纳更多的内容（总共不超过256KB），主要用于工具的使用。Kubernetes 会将一些注解自动添加到对象。

### 增加（key=value）
添加域名（gouchicao.com）前缀这种格式的注解键是避免键冲突的一个好方法。
```shell
$ kubectl annotate pod kubia-manual gouchicao.com/someannotation="test"
pod/kubia-manual annotated
```
需要增加多个注解只需要使用空格进行分隔即可。
```shell
$ kubectl annotate pod kubia-manual key1=value1 key2=value2
```

### 查看
* 获取完整的 YAML 描述（-o yaml）
```shell
$ kubectl get pod kubia-manual -o yaml
```
```yaml
apiVersion: v1
kind: Pod
metadata:
  annotations:
    gouchicao.com/someannotation: test
    kubectl.kubernetes.io/last-applied-configuration: |
      {"apiVersion":"v1","kind":"Pod","metadata":{"annotations":{},"name":"kubia-manual","namespace":"default"},"spec":{"containers":[{"image":"wangjunjian/kubia","name":"kubia","ports":[{"containerPort":8080,"protocol":"TCP"}]}]}}
```

* kubectl describe
```shell
$ kubectl describe pod kubia-manual
```
```yaml
Name:         kubia-manual
Namespace:    default
Annotations:  gouchicao.com/someannotation: test
```

### 更新（```--overwrite```）
```shell
$ kubectl annotate pod kubia-manual gouchicao.com/someannotation="TEST" --overwrite 
pod/kubia-manual annotated
```

### 删除（key-）
```shell
$ kubectl annotate pod kubia-manual gouchicao.com/someannotation-
pod/kubia-manual annotated
```
