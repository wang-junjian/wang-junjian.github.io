---
layout: single
title:  "Dockerfile 中 ARG 指令的作用范围"
date:   2023-10-11 08:00:00 +0800
categories: [编程开发, 容器与云原生]
tags: [dockerfile, arg]
---

> 这里主要是了解 Dockerfile 中 ARG 指令的作用范围。

## 总结
1. FROM 前定义的参数，只能在 FROM 指令中使用，且能够在多阶段中起作用。

```dockerfile
ARG BASE_IMAGE=python:3.10.9
FROM ${BASE_IMAGE} AS builder
...

FROM ${BASE_IMAGE}
...
```

2. FROM 后定义的参数，只能作用在本 Stage 阶段。

```dockerfile
FROM python:3.10.9 AS builder
ARG APP_HOME=/WALL-E-AI
WORKDIR ${APP_HOME}

FROM python:3.10.9
ARG APP_HOME=/WALL-E-AI
WORKDIR ${APP_HOME}

```

## 实验

```dockerfile
ARG BASE_IMAGE=python:3.10.9

FROM ${BASE_IMAGE} AS builder

RUN du -sh /usr/lib >> /app.log
RUN echo "🚀 stage-1 范围，在 FROM 指令前定义 ARG BASE_IMAGE: ${BASE_IMAGE}" >> /app.log
RUN echo "🚀 stage-1 范围，未定义 ARG APP_HOME: ${APP_HOME}" >> /app.log

ARG APP_HOME=/WALL-E-AI

RUN echo "🚀 stage-1 范围，定义 ARG APP_HOME: ${APP_HOME}" >> /app.log

WORKDIR ${APP_HOME}


# 发布应用
FROM ${BASE_IMAGE}

COPY --from=builder  /app.log /app.log
RUN du -sh /usr/lib >> /app.log
RUN echo "🟥 stage-2 范围，在 FROM 指令前定义 ARG BASE_IMAGE: ${BASE_IMAGE}" >> /app.log
RUN echo "🟥 stage-2 范围，未定义 ARG APP_HOME: ${APP_HOME}" >> /app.log

ARG APP_HOME=/WALL-E-AI

RUN echo "🟥 stage-2 范围，定义 ARG APP_HOME: ${APP_HOME}" >> /app.log

WORKDIR ${APP_HOME}

RUN cat /app.log
```

构建镜像，使用默认的参数值。

```bash
docker buildx build --progress=plain --platform=linux/amd64 --rm -f Dockerfile -t test:amd64 .
```
```
#17 [stage-1 8/8] RUN cat /app.log
#17 0.218 501M  /usr/lib
#17 0.218 🚀 stage-1 范围，在 FROM 指令前定义 ARG BASE_IMAGE: 
#17 0.218 🚀 stage-1 范围，未定义 ARG APP_HOME: 
#17 0.218 🚀 stage-1 范围，定义 ARG APP_HOME: /WALL-E-AI
#17 0.218 501M  /usr/lib
#17 0.218 🟥 stage-2 范围，在 FROM 指令前定义 ARG BASE_IMAGE: 
#17 0.218 🟥 stage-2 范围，未定义 ARG APP_HOME: 
#17 0.218 🟥 stage-2 范围，定义 ARG APP_HOME: /WALL-E-AI
#17 DONE 0.2s
```

构建镜像，使用指定的参数值。

```bash
docker buildx build --progress=plain --platform=linux/arm64 --build-arg BASE_IMAGE=python:3.10.9-slim --build-arg APP_HOME=wall-e-ai --rm -f Dockerfile -t test:arm64 .
```
```
#16 [stage-1 8/8] RUN cat /app.log
#16 0.091 38M   /usr/lib
#16 0.091 🚀 stage-1 范围，在 FROM 指令前定义 ARG BASE_IMAGE: 
#16 0.091 🚀 stage-1 范围，未定义 ARG APP_HOME: 
#16 0.091 🚀 stage-1 范围，定义 ARG APP_HOME: wall-e-ai
#16 0.091 38M   /usr/lib
#16 0.091 🟥 stage-2 范围，在 FROM 指令前定义 ARG BASE_IMAGE: 
#16 0.091 🟥 stage-2 范围，未定义 ARG APP_HOME: 
#16 0.091 🟥 stage-2 范围，定义 ARG APP_HOME: wall-e-ai
#16 DONE 0.1s
```

## 参考资料
* [Dockerfile reference](https://docs.docker.com/engine/reference/builder/)
* [如何使用“COPY –link”加速 Docker 构建和优化缓存](https://cn.linux-console.net/?p=7889)
