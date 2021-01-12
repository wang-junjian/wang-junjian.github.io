---
layout: post
title:  "Dockerfile JDK-MCR(MATLAB Compiler Runtime)"
date:   2019-03-05 00:00:00 +0800
categories: Docker
tags: [Docker, Dockerfile, JDK, MCR]
---

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
