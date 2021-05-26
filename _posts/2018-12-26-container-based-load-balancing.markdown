---
layout: post
title:  "基于容器的负载均衡"
date:   2018-12-26 00:00:00 +0800
categories: Docker
tags: [HAProxy, 负载均衡]
---

## HAProxy

### 编写 HAProxy 配置文件
```shell
nano haproxy.cfg
```
```
global
    log 127.0.0.1 local0
    maxconn 4096
    chroot /usr/local/sbin
    daemon
    nbproc 4
    pidfile /usr/local/sbin/haproxy.pid

defaults
    log global
    mode http
    option dontlognull
    option redispatch
    retries 2
    maxconn 2000
    balance roundrobin
    timeout connect 5000ms
    timeout client 50000ms
    timeout server 50000ms

frontend haproxynode
    bind *:8000
    default_backend backendnodes

backend backendnodes
    bind-process 2
    balance roundrobin
    option forwardfor
    option httpchk
    server APP1 APP1:80 check inter 2000 rise 2 fall 5
    server APP2 APP2:80 check inter 2000 rise 2 fall 5

    stats enable
    stats uri /admin?stats
```

### 运行 [hello-world](https://github.com/wang-junjian/docker-hello-world) 容器，生成两个实例。
```bash
docker run --rm -p 8001:80 --name APP1 --env NAME=APP1 vwarship/hello-world:latest
docker run --rm -p 8002:80 --name APP2 --env NAME=APP2 vwarship/hello-world:latest
```

### 运行 HAProxy 容器，负载均衡生效。
```bash
docker run --rm -d \
    --link APP1:APP1 \
    --link APP2:APP2 \
    -p 8000:8000 \
    -v haproxy.cfg:/usr/local/etc/haproxy/haproxy.cfg \
    --name haproxy \
    haproxy:latest
```

### 查看
* [APP1](http://localhost:8001)
* [APP2](http://localhost:8002)
* [HAProxy 负载均衡](http://localhost:8000)
* [HAProxy Stats](http://localhost:8000/admin?stats)

## 参考资料
* [vwarship/hello-world](https://hub.docker.com/r/vwarship/hello-world/)
* [How to Use HAProxy for Load Balancing](https://www.linode.com/docs/uptime/loadbalancing/how-to-use-haproxy-for-load-balancing/)
* [Hitless Reloads with HAProxy – HOWTO](https://www.haproxy.com/blog/hitless-reloads-with-haproxy-howto/#configuration-file-update)
* [HAProxy Management Guide](https://www.haproxy.org/download/1.7/doc/management.txt)
* [HAProxy Configuration Manual](https://cbonte.github.io/haproxy-dconv/1.7/configuration.html)
* [Docker Documentation](https://docs.docker.com)
* [haproxy.cfg](https://gist.github.com/strangeminds/1287134)
* [Layer4 “Connection refused” with haproxy](https://stackoverflow.com/questions/40729125/layer4-connection-refused-with-haproxy)
* [KubeCon EU 2016: Creating an Advanced Load Balancing Solution for Kubernetes with NGINX](https://www.slideshare.net/kubecon/kubecon-eu-2016-creating-an-advanced-load-balancing-solution-for-kubernetes-with-nginx)
