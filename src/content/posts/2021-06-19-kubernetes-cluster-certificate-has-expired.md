---
layout: single
title:  "Kubernetes集群证书过期"
date:   2021-06-19 00:00:00 +0800
categories: Kubernetes
tags: [certificate, openssl, kubeadm, systemctl]
---

## 证书一年过期了
```shell
kubectl get nodes
```
```
Unable to connect to the server: x509: certificate has expired or is not yet valid
```

## 查看API服务器的证书日期
* 方法1
```shell
openssl x509 -in /etc/kubernetes/pki/apiserver.crt -noout -text|grep -A2 'Validity'
```
```
        Validity
            Not Before: Jun 16 06:09:07 2020 GMT
            Not After : Jun 16 06:09:07 2021 GMT
```

* 方法2
```shell
openssl x509 -in /etc/kubernetes/pki/apiserver.crt -noout -text|grep ' Not '
```
```
            Not Before: Jun 16 06:09:07 2020 GMT
            Not After : Jun 16 06:09:07 2021 GMT
```

## 重新配置证书
```shell
sudo kubeadm alpha certs renew all
```
```
[renew] Reading configuration from the cluster...
[renew] FYI: You can look at this config file with 'kubectl -n kube-system get cm kubeadm-config -oyaml'
[renew] Error reading configuration from the Cluster. Falling back to default configuration

W0621 09:15:13.565535 1745938 configset.go:202] WARNING: kubeadm cannot validate component configs for API groups [kubelet.config.k8s.io kubeproxy.config.k8s.io]
certificate embedded in the kubeconfig file for the admin to use and for kubeadm itself renewed
certificate for serving the Kubernetes API renewed
certificate the apiserver uses to access etcd renewed
certificate for the API server to connect to kubelet renewed
certificate embedded in the kubeconfig file for the controller manager to use renewed
certificate for liveness probes to healthcheck etcd renewed
certificate for etcd nodes to communicate with each other renewed
certificate for serving etcd renewed
certificate for the front proxy client renewed
certificate embedded in the kubeconfig file for the scheduler manager to use renewed
```

## 复制配置到当前用户
```shell
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
```

## 重启服务
```shell
sudo systemctl daemon-reload && sudo systemctl restart kubelet
```

## 参考资料
* [k8s master 出现问题证书过期问题](https://q.cnblogs.com/q/133037/)
* [k8s集群升级](https://www.cnblogs.com/xiaoyuxixi/p/13152298.html)
* [how to renew the certificate when apiserver cert expired?](https://github.com/kubernetes/kubeadm/issues/581)
* [kubernetes证书过期处理](https://my.oschina.net/xiaozhublog/blog/3078480)
* [k8s踩坑(三)、kubeadm证书/etcd证书过期处理](https://blog.csdn.net/ywq935/article/details/88355832)
