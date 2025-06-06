---
layout: single
title:  "搭建 Private Docker Registry"
date:   2019-02-20 00:00:00 +0800
categories: Docker
tags: [docker-registry, docker-registry-frontend, docker-registry-web]
---

## Registry

### 配置hosts
```bash
sudo nano /etc/hosts
```
```
10.10.10.10    HOSTNAME
```

### 运行registry
```bash
docker pull registry:2

sudo docker run -d \
    -p 5000:5000 \
    -v /home/ailab/docker-registry:/var/lib/registry \
    --restart=always \
    --name docker-registry \
    registry:2
```

### 修改Docker配置
```bash
sudo nano /etc/docker/daemon.json
```
```
{
    "live-restore": true,
    "group": "dockerroot",
    "insecure-registries": ["HOSTNAME:5000"]
}
```

### 重启Docker Engine
```bash
sudo systemctl restart docker
```

### 推送镜像
```bash
sudo docker tag hello-world:latest HOSTNAME:5000/hello-world:latest
sudo docker push HOSTNAME:5000/hello-world:latest
```

## Registry UI

### Docker Registry Frontend
* 部署
```bash
sudo docker pull konradkleine/docker-registry-frontend:v2
sudo docker run -d \
    -e ENV_DOCKER_REGISTRY_HOST=10.10.10.10 \
    -e ENV_DOCKER_REGISTRY_PORT=5000 \
    -p 8080:80 \
    --name docker-registry-frontend \
    konradkleine/docker-registry-frontend:v2
```

* 浏览器访问
```txt
http://HOSTNAME:8080
```

### Docker Registry Web
* 部署
```bash
sudo docker pull hyper/docker-registry-web:latest
docker run -d \
    --link docker-registry \
    -e REGISTRY_URL=http://docker-registry:5000/v2 \
    -e REGISTRY_NAME=HOSTNAME:5000 \
    -p 8080:8080 \
    --name docker-registry-web \
    hyper/docker-registry-web 
```

* 浏览器访问
```txt
http://HOSTNAME:8080
```

## 客户机

### 配置hosts
```bash
sudo nano /etc/hosts
```
```
10.10.10.10    HOSTNAME
```

### 修改Docker配置
```bash
sudo nano /etc/docker/daemon.json
```
```
{
    "live-restore": true,
    "group": "dockerroot",
    "insecure-registries": ["HOSTNAME:5000"]
}
```

### 拉取镜像
```bash
sudo docker pull HOSTNAME:5000/hello-world:latest
```
