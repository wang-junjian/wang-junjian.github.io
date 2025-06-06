---
layout: single
title:  "Higress AI Gateway"
date:   2024-09-10 08:00:00 +0800
categories: Higress AIGateway
tags: [Higress, AIGateway, Envoy, Istio, LLM]
---

## Higress

[Higress](https://github.com/alibaba/higress) 是基于阿里内部多年的 Envoy Gateway 实践沉淀，以开源 [Istio](https://github.com/istio/istio) 与 [Envoy](https://github.com/envoyproxy/envoy) 为核心构建的云原生 API 网关。

- [Higress是什么?](https://higress.cn/docs/latest/overview/what-is-higress/)
- [Higress 博客](https://higress.cn/blog/)
- [多层网关统一成趋势，如何构建全能型网关](https://higress.cn/blog/higress-gvr7dx_awbbpb_dxp91huk34ts4nik/)
- [如何使用 Higress 快速构建 AI 应用？](https://higress.io/blog/higress-gvr7dx_awbbpb_uddq0l7v5a5vadc6/)
- [天池大赛Higress插件官方demo详细部署+调试](https://tianchi.aliyun.com/forum/post/747789)
- [Higress 优势对比 - Higress, Nginx, Spring Cloud Gateway](https://higress.cn/advantage/)
- [Higress Plugin Hub](https://higress.cn/plugin/)
- [higress/plugins/wasm-go/extensions/ai-proxy/](https://github.com/alibaba/higress/tree/main/plugins/wasm-go/extensions/ai-proxy)
- [Higress Demo](http://demo.higress.io/)
- [Higress FAQ](https://higress.cn/faq/wuyi-intro/)


## 安装

```shell
# 创建一个工作目录
mkdir higress; cd higress
# 启动 higress，配置文件会写到工作目录下
docker run -d --rm --name higress-ai -v ${PWD}:/data \
    -p 8001:8001 -p 8080:8080 -p 8443:8443  \
    higress-registry.cn-hangzhou.cr.aliyuncs.com/higress/all-in-one:latest
```
- `8001` 端口：Higress UI 控制台入口
- `8080` 端口：网关 HTTP 协议入口
- `8443` 端口：网关 HTTPS 协议入口


## 配置

访问 [http://localhost:8001](http://localhost:8001) 进入 Higress 控制台。

### 服务来源
创建服务来源
- `类型`：固定地址
- `名称`：openai-api-service
- `服务地址`：http://localhost:8000

### 路由配置
创建路由
- `路由名称`: openai-api-route
- `路径（Path）`
    - `前缀匹配`：/v1
- `附加注解（Annotation）`
    - `Key`: higress.io/backend-protocol `值`: http
- `目标服务`: openai-api-service.static

### 插件配置
#### AI 代理
- `开启状态`: `ON`
- `数据编辑器 - YAML`

```yaml
provider:
  apiTokens:
  - "NONE"
  modelMapping:
    '*': "Qwen2-7B"
  type: "openai"
```

**不配置也可以正常使用**


## 测试
```shell
curl http://127.0.0.1:8080/v1/chat/completions \
    -H 'Accept: application/json, text/event-stream' \
    -H 'Content-Type: application/json' \
    -d '{
        "model":"Qwen2-7B",
        "messages":[{
            "role":"user",
            "content":"你是谁？"
        }],
        "temperature": 0.3
    }'
```
