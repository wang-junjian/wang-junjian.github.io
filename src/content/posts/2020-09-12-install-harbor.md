---
layout: single
title:  "安装Harbor"
date:   2020-09-12 00:00:00 +0800
categories: Docker
tags: [Docker, Harbor, Ubuntu, Registry, wget, cat, openssl]
---

## 下载最新的 [Harbar Release](https://github.com/goharbor/harbor/releases)
```shell
wget -c https://github.com/goharbor/harbor/releases/download/v2.1.3/harbor-offline-installer-v2.1.3.tgz
tar -zxvf harbor-offline-installer-v2.1.3.tgz
cd harbor
```

## 生成证书（用于支持 HTTPS 访问）
在生产环境中，请始终使用HTTPS，您应该从CA获得证书。 在测试或开发环境中，您可以生成自己的CA。

### 生成CA证书
1. 生成CA证书私钥
```shell
openssl genrsa -out ca.key 4096
```
```
Generating RSA private key, 4096 bit long modulus (2 primes)
.............................................................................................................................................++++
............................................................................................................................................................................................................++++
e is 65537 (0x010001)
```

2. 生成CA证书
```shell
openssl req -x509 -new -nodes -sha512 -days 3650 \
 -subj "/C=CN/ST=Shandong/L=Jinan/O=LNSoft/OU=AI/CN=lnsoft.com" \
 -key ca.key \
 -out ca.crt
```

### 生成服务器证书
证书通常包含一个.crt文件和一个.key文件，例如yourdomain.com.crt和yourdomain.com.key。

1. 生成私钥
```
openssl genrsa -out lnsoft.com.key 4096
```

2. 生成证书签名请求（CSR）
> 调整-subj选项中的值以反映您的组织。 如果使用FQDN连接Harbor主机，则必须将其指定为公用名（CN）属性，并在密钥和CSR文件名中使用它。
```
openssl req -sha512 -new \
    -subj "/C=CN/ST=Shandong/L=Jinan/O=LNSoft/OU=AI/CN=lnsoft.com" \
    -key lnsoft.com.key \
    -out lnsoft.com.csr
```

3. 生成一个x509 v3扩展文件
```shell
cat > v3.ext <<-EOF
authorityKeyIdentifier=keyid,issuer
basicConstraints=CA:FALSE
keyUsage = digitalSignature, nonRepudiation, keyEncipherment, dataEncipherment
extendedKeyUsage = serverAuth
subjectAltName = @alt_names
[alt_names]
DNS.1=lnsoft.com
DNS.2=lnsoft
DNS.3=hostname
EOF
```

4. 使用v3.ext文件为您的Harbor主机生成证书
> 将CRS和CRT文件名中的yourdomain.com替换为Harbor主机名。
```shell
openssl x509 -req -sha512 -days 3650 \
    -extfile v3.ext \
    -CA ca.crt -CAkey ca.key -CAcreateserial \
    -in lnsoft.com.csr \
    -out lnsoft.com.crt
```
```
Signature ok
subject=C = CN, ST = Shandong, L = Jinan, O = LNSoft, OU = AI, CN = lnsoft.com
Getting CA Private Key
```

## 配置
### Harbor
1. 复制证书
```
sudo mkdir -p /data/harbor/cert
sudo cp lnsoft.com.key /data/harbor/cert/
sudo cp lnsoft.com.crt /data/harbor/cert/
```

2. 编辑配置文件
```shell
harbor.yml.tmpl harbor.yml
nano harbor.yml
```
```
hostname: lnsoft.com
  certificate: /data/harbor/cert/lnsoft.com.crt
  private_key: /data/harbor/cert/lnsoft.com.key
harbor_admin_password: 123456
data_volume: /data/harbor
```

### Docker
1. 将yourdomain.com.crt转换为yourdomain.com.cert，以供Docker使用。
> Docker守护程序将.crt文件解释为CA证书，并将.cert文件解释为客户端证书。
```shell
openssl x509 -inform PEM -in lnsoft.com.crt -out lnsoft.com.cert
```

2. 复制证书
```shell
sudo mkdir -p /etc/docker/certs.d/lnsoft.com
sudo cp lnsoft.com.cert /etc/docker/certs.d/lnsoft.com/
sudo cp lnsoft.com.key /etc/docker/certs.d/lnsoft.com/
sudo cp ca.crt /etc/docker/certs.d/lnsoft.com/
```

3. 重启Docker服务
```shell
sudo systemctl restart docker
```

## 安装
```shell
sudo apt install docker-compose -y
sudo ./prepare
sudo ./install.sh
```

## 操作
* 如果Harbor正在运行，请停止并删除现有实例。
```shell
sudo docker-compose down -v
```

* 重启Harbor
```shell
sudo docker-compose up -d
```

## 客户端
1. 配置DNS
```shell
sudo nano /etc/hosts
```
```
172.16.33.174 lnsoft.com
......
......
```

2. 拷贝证书
```shell
sudo mkdir -p /etc/docker/certs.d/lnsoft.com/
sudo scp lnsoft@ln6:/home/lnsoft/ai/harbor/cert/ca.crt /etc/docker/certs.d/lnsoft.com/ca.crt
```

3. 登录
```shell
sudo docker login lnsoft.com
```

4. 推送和拉取镜像
```shell
sudo docker push lnsoft.com/library/yolov5:latest
sudo docker pull lnsoft.com/library/yolov5:latest
```

## 参考资料
* [Harbor](https://goharbor.io)
* [安装Harbor](https://github.com/gouchicao/ai-cloud/blob/master/harbor/README.md)
