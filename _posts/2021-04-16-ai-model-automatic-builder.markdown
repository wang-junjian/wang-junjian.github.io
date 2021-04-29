---
layout: post
title:  "AI 模型自动构建器"
date:   2021-04-16 00:00:00 +0800
categories: AI Docker
tags: [Shell, Dockerfile, if, sed, tar, scp, ssh]
---

## 工程目录
```
model-builder/
├── Dockerfile
├── Dockerfile.ubuntu
├── main.sh
└── .ssh
    ├── id_rsa
    ├── id_rsa.pub
    └── known_hosts
```

## main.sh
```shell
#!/usr/bin/sh

# 模型和配置文件
FILE_CONFIG=config.yaml
FILE_MODEL=model.onnx

# 用于构建模型压缩包的目录结构
DIR_MODELS=models

if [ -z $1 ]
then
  echo "Usage: "
  echo "Environment variable："
  echo "    MODEL_SERVER_USERNAME Default: username"
  echo "    MODEL_SERVER_IP       Default: ip"
  echo ""
  echo "docker run --rm -v /home/ai/models/sign.yaml:/app/config.yaml \\"
  echo "                -v /home/ai/models/sign.onnx:/app/model.onnx \\"
  echo "                lnsoft.com/library/model-builder:latest model-name"
  echo ""
  echo "Missing name parameter."
  exit 1
fi

# 压缩包的名字
TAR_FILE=$1.tar.gz
TAR_FILE2=$1-$(date '+%Y%m%d').tar.gz


# 构建压缩包的目录结构
mkdir -p $DIR_MODELS

if test -f "$FILE_CONFIG"
then
    echo "$FILE_CONFIG exists."
    cp $FILE_CONFIG $DIR_MODELS
else
    echo "$FILE_CONFIG not exists."
fi

if test -f "$FILE_MODEL"
then
    echo "$FILE_MODEL exists."
    cp $FILE_MODEL $DIR_MODELS
else
    echo "$FILE_MODEL not exists."
fi

# 修改配置文件的更新时间，sed 使用变量要使用双引号(")。
DATE=$(date '+%Y-%m-%d %H:%M:%S')
sed -i "s|update_time.*$|update_time: $DATE|g" $DIR_MODELS$FILE_CONFIG

# 修改模型的路径
sed -i "s|model_file.*$|model_file: '$FILE_MODEL'|g" $DIR_MODELS$FILE_CONFIG

tar czvf $TAR_FILE $DIR_MODELS

# 上传到模型服务器
if [ -z $MODEL_SERVER_USERNAME ]
then
    MODEL_SERVER_USERNAME=username
fi

if [ -z $MODEL_SERVER_IP ]
then
    MODEL_SERVER_IP=ip
fi

MODEL_SERVER_PATH=$MODEL_SERVER_USERNAME@$MODEL_SERVER_IP:/data/models
scp $TAR_FILE $MODEL_SERVER_PATH
scp $TAR_FILE $MODEL_SERVER_PATH/$TAR_FILE2

echo "Model Path: http://$MODEL_SERVER_IP/models/$TAR_FILE"

rm -rf $DIR_MODELS $TAR_FILE
```

## 生成公私钥
```shell
$ ssh-keygen -t rsa
Generating public/private rsa key pair.
Enter file in which to save the key (/home/wjj/.ssh/id_rsa): .ssh
Enter passphrase (empty for no passphrase): 
Enter same passphrase again: 
Your identification has been saved in /home/wjj/model-builder/.ssh/id_rsa
Your public key has been saved in /home/wjj/model-builder/.ssh/id_rsa.pub
The key fingerprint is:
SHA256:rnyFfHM0VgPOzwrebeu9Wx5twYm0gMXmHjyMKJjrsYk wjj@gpu
The key's randomart image is:
+---[RSA 3072]----+
|          ....   |
|          o=  o  |
|    o   ..*.oo . |
|   o . . . **o+ .|
|    . ..S.ooo+o+ |
|   o   .o.++.o  o|
|  o +   .o.oo o.+|
| E + . ..    . =o|
|      o.     .oo=|
+----[SHA256]-----+
```

## 创建用户（模型服务器）
```shell
useradd -m -s /bin/bash ai
passwd ai
```

## 使用新用户 ai 登录（模型服务器）
```shell
mkdir /home/ai/.ssh
```

## 发布公钥到模型服务器新用户 .ssh 目录
```shell
scp .ssh/id_rsa.pub ai@hostname:/home/ai/.ssh/authorized_keys
```

## 生成授权文件 known_hosts

## Dockerfile.ubuntu 构建自己的 Ubuntu20.04
```dockerfile
FROM ubuntu:20.04
LABEL maintainer="wang-junjian@qq.com"

# 设置本地 apt 安装源
RUN sed -i 's/archive.ubuntu.com/hostname/g' /etc/apt/sources.list

# 设置本地时区
ENV DEBIAN_FRONTEND=noninteractive
RUN apt-get update && apt-get install -y tzdata && \
    ln -fs /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
ENV DEBIAN_FRONTEND=
```

## 构建 Ubuntu20.04 镜像
```shell
docker build -t lnsoft.com/library/ubuntu:20.04 -f Dockerfile.ubuntu .
```

## Dockerfile 构建模型生成器
```dockerfile
FROM lnsoft.com/library/ubuntu:20.04
LABEL maintainer="wang-junjian@qq.com"

# 安装 scp
RUN apt-get update && apt-get install -y openssh-client

# 用户的私钥和授权信息，让 scp 无需密码操作。
ADD .ssh/ /root/.ssh/

WORKDIR /app
COPY main.sh /app/
RUN chmod +x main.sh

ENTRYPOINT [ "./main.sh" ]
```

## 构建 model-builder 镜像
```shell
docker build -t lnsoft.com/library/model-builder .
```

## 模型打包发布
```shell
docker run --rm -v /home/ai/models/sign.yaml:/app/config.yaml \
                -v /home/ai/models/sign.onnx:/app/model.onnx \
                lnsoft.com/library/model-builder:latest model-name
```

## 参考资料
* [How can I add a help method to a shell script?](https://stackoverflow.com/questions/5474732/how-can-i-add-a-help-method-to-a-shell-script)
* [YYYY-MM-DD format date in shell script](https://stackoverflow.com/questions/1401482/yyyy-mm-dd-format-date-in-shell-script)
* [Using Variables with Sed in Bash](https://www.brianchildress.co/using-variables-with-sed/)
* [How to Check if a File or Directory Exists in Bash](https://linuxize.com/post/bash-check-if-file-exists/)
