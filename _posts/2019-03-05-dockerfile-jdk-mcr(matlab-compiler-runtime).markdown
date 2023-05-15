---
layout: post
title:  "Dockerfile JDK-MCR(MATLAB Compiler Runtime)"
date:   2019-03-05 00:00:00 +0800
categories: Docker
tags: [Docker, Dockerfile, JDK, MCR]
---

## JDK-MCR(MATLAB Compiler Runtime)
```dockerfile
FROM openjdk:latest
LABEL maintainer="wang-junjian@qq.com"

MAINTAINER Wang Junjian

RUN apt-get update && apt-get install -y curl wget unzip xorg

#Install MATLAB runtime
RUN mkdir /mcr-install && cd /mcr-install && \
    wget -nv http://ssd.mathworks.com/supportfiles/downloads/R2018b/deployment_files/R2018b/installers/glnxa64/MCR_R2018b_glnxa64_installer.zip && \
    unzip MCR_R2018b_glnxa64_installer.zip && \
    ./install -mode silent -agreeToLicense yes && \
    rm -Rf /mcr-install

ENV LD_LIBRARY_PATH /usr/local/MATLAB/MATLAB_Runtime/v95/runtime/glnxa64:/usr/local/MATLAB/MATLAB_Runtime/v95/bin/glnxa64:/usr/local/MATLAB/MATLAB_Runtime/v95/sys/os/glnxa64:/usr/local/MATLAB/MATLAB_Runtime/v95/extern/bin/glnxa64

CMD /bin/sh
```

## Java 镜像的例子
### Dockerfile
```
FROM anapsix/alpine-java
COPY testprj-1.0.jar /home/testprj-1.0.jar
CMD ["java","-jar","/home/testprj-1.0.jar"]
```

### 构建镜像
```shell
docker build -t imageName .
```

### 运行镜像
```shell
docker run --name myProgram imageName
```


## 参考资料
* [Run jar file in docker image](https://stackoverflow.com/questions/35061746/run-jar-file-in-docker-image)
