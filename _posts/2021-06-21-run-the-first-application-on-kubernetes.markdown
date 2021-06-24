---
layout: post
title:  "在Kubernetes上运行第一个应用"
date:   2021-06-21 00:00:00 +0800
categories: Kubernetes
tags: [Service, Deployment, Node.js, docker, for]
---

## 基于Node构建应用
### app.js
```js
const http = require('http');
const os = require('os');

console.log("Kubia server starting...");

var handler = function(request, response) {
  console.log("Received request from " + request.connection.remoteAddress);
  response.writeHead(200);
  response.end("You've hit " + os.hostname() + "\n");
};

var www = http.createServer(handler);
www.listen(8080);
```

### Dockerfile
```dockerfile
FROM node:16-slim
ADD app.js /app.js
ENTRYPOINT ["node", "app.js"]
```

### 构建
```shell
docker build -t wangjunjian/kubia .
```

### 运行
```shell
docker run -d -p 8080:8080 wangjunjian/kubia:latest
```

### 查看运行的容器
```shell
docker ps
```
```
CONTAINER ID        IMAGE                              COMMAND                  CREATED              STATUS              PORTS                     NAMES
2fe47d1cbcde        wangjunjian/kubia:latest           "node app.js"            About a minute ago   Up About a minute   0.0.0.0:8080->8080/tcp   wonderful_ramanujan
```

### 访问应用
```shell
curl http://localhost:8080
```
```
You've hit 2fe47d1cbcde
```

**可以看到容器的ID作为主机名**

### 发布应用
```shell
docker push wangjunjian/kubia:latest
```

## 基于Kubernetes部署应用
### 编写kubia.yaml
```yaml
apiVersion: v1
kind: Service
metadata:
  name: kubia
  labels:
    app: kubia
spec:
  type: NodePort
  ports:
  - port: 8080
    targetPort: 8080
    nodePort: 30088
  selector:
    app: kubia

---

apiVersion: apps/v1
kind: Deployment
metadata:
  name: kubia
spec:
  selector:
    matchLabels:
      app: kubia
  replicas: 2
  template:
    metadata:
      labels:
        app: kubia
    spec:
      containers:
      - name: kubia
        image: wangjunjian/kubia:latest
        ports:
        - containerPort: 8080
```

### 部署
```shell
kubectl apply -f kubia.yaml
```

### 访问服务
```shell
for _ in {1..5}; do curl http://localhost:30088; done
```
```
You've hit kubia-864465c9d-744qc
You've hit kubia-864465c9d-kzql7
You've hit kubia-864465c9d-kzql7
You've hit kubia-864465c9d-744qc
You've hit kubia-864465c9d-kzql7
```

**如果在集群外访问，将localhost替换为集群中的任意一台服务器的IP即可。**

## 参考资料
* [How do I iterate over a range of numbers defined by variables in Bash?](https://stackoverflow.com/questions/169511/how-do-i-iterate-over-a-range-of-numbers-defined-by-variables-in-bash)
