---
layout: single
title:  "基于PyPIServer创建私有Python软件包存储库"
date:   2021-01-12 00:00:00 +0800
categories: Python
tags: [Python, pip, PyPI, PyPIServer, Docker, htpasswd]
---

## 服务端
### 拉取PyPIServer镜像
```shell
docker pull pypiserver/pypiserver:latest
```

### 部署PyPIServer
* 只用于客户端下载（用作缓存加速）
```shell
docker run -d --restart=always --name pypiserver -p 8080:8080 \
    -v /data/pypi-packages/:/data/packages \
    pypiserver/pypiserver:latest
```

* 客户端不仅可以下载还可以上传（当我们自己开发了Python的软件时）
```shell
#创建用户名和密码
sudo apt install apache2-utils -y
sudo mkdir /data/pypi-packages
sudo htpasswd -sc /data/pypi-packages/htpasswd.txt wjj
#当您需要再创建用户名时就不需要加参数 -c
sudo htpasswd -s /data/pypi-packages/htpasswd.txt test
#容器部署
docker run -d --restart=always --name pypiserver -p 8080:8080 \
    -v /data/pypi-packages/:/data/packages \
    pypiserver/pypiserver:latest -P /data/packages/htpasswd.txt
```

### 下载软件包到私有存储库（局域网内加速）
```shell
sudo pip3 download -d /data/pypi-packages/ tensorflow -i https://mirrors.aliyun.com/pypi/simple/
sudo pip3 download -d /data/pypi-packages/ -r requirements.txt -i https://mirrors.aliyun.com/pypi/simple/

```

## 客户端
### 使用私有存储库安装软件包
* 配置 ```pip.conf```
```shell
nano ~/.config/pip/pip.conf
```
```conf
[global]
index-url = http://172.16.33.174:8080/simple/
extra-index-url = https://mirrors.aliyun.com/pypi/simple/
[install]
trusted-host = 172.16.33.174
```

* 安装
```shell
pip3 install tensorflow
```
```
Looking in indexes: http://172.16.33.174:8080/simple/, https://mirrors.aliyun.com/pypi/simple/
Collecting tensorflow
  Downloading http://172.16.33.174:8080/packages/tensorflow-2.4.0-cp38-cp38-manylinux2010_x86_64.whl (394.8 MB)
```

### 上传开发的软件包到私有存储库
* 配置 ```.pypirc```
```shell
nano ~/.pypirc
```
```conf
[distutils]
index-servers =
  local
[local]
repository: http://172.16.33.174:8080
username: wjj
password: 123456
```

* 上传
```shell
pip3 install twine
twine upload onnxruntime_gpu-1.6.0-cp38-cp38-linux_x86_64.whl -r local
twine upload onnxruntime_gpu-1.6.0-cp38-cp38-linux_x86_64.whl --repository-url http://172.16.33.174:8080/
```

## 参考资料
* [pypiserver/pypiserver](https://github.com/pypiserver/pypiserver)
* [pypiserver/pypiserver/docker-compose.yml](https://github.com/pypiserver/pypiserver/blob/master/docker-compose.yml)
* [pypiserver](https://pypi.org/project/pypiserver/)
* [How to Create a Private Python Package Repository](https://www.linode.com/docs/guides/how-to-create-a-private-python-package-repository/)
* [How do you upload a single wheel file to a pypi server?](https://stackoverflow.com/questions/51635611/how-do-you-upload-a-single-wheel-file-to-a-pypi-server)
* [pip Usage](https://pip.pypa.io/en/stable/reference/pip/)
* [Welcome to twine’s documentation!](https://twine.readthedocs.io/en/latest/)
* [pypa/twine](https://github.com/pypa/twine)
* [基于 pypiserver 的 PyPI 私有仓库搭建实践](https://www.jianshu.com/p/c260b59cd3d0)
* [搭建pypi私有仓库](https://www.cnblogs.com/-wenli/p/13994155.html)
