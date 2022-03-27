---
layout: post
title:  "阿里云服务器 ECS 开放端口"
date:   2022-03-27 00:00:00 +0800
categories: 工作日志, 阿里云
tags: [uvicorn, gunicorn]
---

## 开放端口设置
### 配置路径
* [云服务器 ECS](https://ecs.console.aliyun.com/)
    * 网络与安全
        * 安全组
            * 安全组规则
                * 入方向

### 配置规则

| 授权策略 | 优先级 | 协议类型 | 端口范围 | 授权对象 | 描述 |
| --- | --- | --- | --- | --- | --- |
| 允许 | 1 | 自定义 TCP | 目的:5000/5000 | 源:0.0.0.0/0 | Flask |
| 允许 | 1 | 自定义 TCP | 目的:8000/8000 | 源:0.0.0.0/0 | FastAPI |

## 问题
今天通过上面的配置后，发现不能访问，上网搜索了半天，看到有说需要配置 iptables ，于是开始了一顿搜索和学习([Linux上iptables基础应用](https://developer.aliyun.com/article/490333))，进行了如下配置，发现还是访问不了。
```shell
iptables -A INPUT -p tcp --dport 5000 -j ACCEPT
iptables -A INPUT -p tcp --dport 8000 -j ACCEPT
```

## 解决
突然想到了 Web 应用服务器的配置 --host，我这里用的是 uvicorn，默认使用的 127.0.0.1，这样只能接收本机的访问，需要接收其它主机的访问就需要配置为 0.0.0.0。

### Web 应用服务器的配置
* uvicorn --host 0.0.0.0
* gunicorn --bind 0.0.0.0

最后测试了一下，发现根本不需要使用 iptables 配置。

## 参考资料
* [云服务器 ECS](https://ecs.console.aliyun.com/)
* [添加安全组规则](https://help.aliyun.com/document_detail/25471.html)
* [阿里云服务器8080端口开启教程](https://developer.aliyun.com/ask/254678)
* [Linux上iptables基础应用](https://developer.aliyun.com/article/490333)
