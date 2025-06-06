---
layout: single
title:  "Kong AI Gateway"
date:   2024-09-11 08:00:00 +0800
categories: Kong AIGateway
tags: [Kong, AIGateway, LLM]
---

## Kong

![](/images/2024/Kong/Kong-Architecture.png)

- [Kong AI Gateway - Semantic AI Gateway to run and secure multi-LLM traffic](https://konghq.com/products/kong-ai-gateway)
- [Kong AI Gateway - Documentation](https://docs.konghq.com/gateway/latest/get-started/ai-gateway/)
- [GitHub - Kong](https://github.com/Kong/kong)

### 更快地构建生产就绪的 AI 应用程序（对于开发人员）
通过简单更改一行代码，使用现代基础设施构建具有多 LLM 支持和路由、高级 AI 负载均衡、LLM 可观察性、LLM 安全性和治理等功能的语义智能 AI 应用程序。

![](/images/2024/Kong/Build-production-ready-AI-applications-faster.png)

### 将语义智能注入到您的 AI 应用程序中（对于平台团队）
通过语义缓存加速每个 AI 应用程序，通过语义路由智能地跨多个模型路由，构建高级提示模板，检测和防止滥用，以及 AI 可观察性。

![](/images/2024/Kong/Inject-semantic-intelligence-into-your-AI-applications.png)

### AI 流量的 L7 可观察性，用于成本监控和调优（AI 指标和可观察性）
获取应用程序发送的每个 AI 请求的见解，并捕获详细信息以了解和优化您的 AI 使用和成本，支持 10 多个日志摄取器。

![](/images/2024/Kong/L7-observability-on-AI-traffic-for-cost-monitoring-and-tuning.png)


## 安装（Docker）
- [Install Kong Gateway on Docker](https://docs.konghq.com/gateway/latest/install/docker/?install=oss)

### PostgreSQL
```shell
docker run -d --name kong-database \
    -p 5432:5432 \
    -e "POSTGRES_USER=kong" \
    -e "POSTGRES_DB=kong" \
    -e "POSTGRES_PASSWORD=kong" \
    postgres:9.6
```
**要配置插件需要使用数据库。**

### 数据库迁移
```shell
docker run --rm \
    --link kong-database:kong-database \
    -e "KONG_DATABASE=postgres" \
    -e "KONG_PG_HOST=kong-database" \
    -e "KONG_PG_USER=kong" \
    -e "KONG_PG_PASSWORD=kong" \
    kong/kong-gateway:3.8 kong migrations bootstrap
```

### Kong Gateway
```shell
docker run -d --name kong \
    --link kong-database:kong-database \
    -e "KONG_DATABASE=postgres" \
    -e "KONG_PG_HOST=kong-database" \
    -e "KONG_PG_PASSWORD=kong" \
    -e "KONG_PROXY_ACCESS_LOG=/dev/stdout" \
    -e "KONG_ADMIN_ACCESS_LOG=/dev/stdout" \
    -e "KONG_PROXY_ERROR_LOG=/dev/stderr" \
    -e "KONG_ADMIN_ERROR_LOG=/dev/stderr" \
    -e "KONG_ADMIN_LISTEN=0.0.0.0:8001, 0.0.0.0:8444 ssl" \
    -e "KONG_ADMIN_GUI_URL=http://localhost:8002" \
    -p 8000:8000 \
    -p 8443:8443 \
    -p 8001:8001 \
    -p 8002:8002 \
    -p 8444:8444 \
    kong/kong-gateway:3.8
```
- `8000` - send traffic to your service via Kong
- `8001` - configure Kong using Admin API or via decK
- `8002` - access Kong's management Web UI (Kong Manager)
- Docker Hub
    - [kong/kong-gateway](https://hub.docker.com/r/kong/kong-gateway)
    - [kong](https://hub.docker.com/_/kong)

### Reload Kong Gateway in a running container
```shell
docker exec -it kong kong reload
```


## 配置 [Kong AI Gateway](https://docs.konghq.com/gateway/latest/ai-gateway/)

![](/images/2024/Kong/Services-and-Routes.png)
- [Services and Routes](https://docs.konghq.com/gateway/latest/get-started/services-and-routes/)

### 服务（Service）

- 创建
```shell
curl -X POST http://localhost:8001/services \
    --data "name=ai-proxy" \
    --data "url=http://localhost:32000"
```
**请记住，上游 URL 可以指向任何空的地方，因为插件不会使用它。**

- 查看
```shell
curl -X GET http://localhost:8001/services/ai-proxy | jq                   
```

- 删除
```shell
curl -X DELETE http://localhost:8001/services/ai-proxy
```

### 路由（Route）

- 创建
```shell
curl -X POST http://localhost:8001/services/ai-proxy/routes \
    --data "name=openai-chat" \
    --data "paths[]=~/openai-chat$"
```

- 查看
```shell
curl -X GET http://localhost:8001/routes/openai-chat | jq
```

- 删除
```shell
curl -X DELETE http://localhost:8001/routes/openai-chat
```

### AI Proxy 插件

- 创建

启用并配置 OpenAI 的 AI Proxy 插件，将 <openai_key> 替换为您自己的 API 密钥：
```shell
curl -X POST http://localhost:8001/routes/openai-chat/plugins \
    --data "name=ai-proxy" \
    --data "config.route_type=llm/v1/chat" \
    --data "config.auth.header_name=Authorization" \
    --data "config.auth.header_value=Bearer NONE" \
    --data "config.model.provider=openai" \
    --data "config.model.name=gpt-4-32k" \
    --data "config.model.options.max_tokens=512" \
    --data "config.model.options.upstream_url=http://172.16.33.66:9997/v1/chat/completions" \
    --data "config.model.options.temperature=1.0"
```

- 查看
```shell
curl -X GET http://localhost:8001/plugins/ai-proxy | jq
```

- 删除
```shell
curl -X DELETE http://localhost:8001/plugins/ai-proxy
```

- [AI Proxy](https://docs.konghq.com/hub/kong-inc/ai-proxy/)
- [AI Proxy Configuration](https://docs.konghq.com/hub/kong-inc/ai-proxy/configuration/)
- [Set up AI Proxy with OpenAI](https://docs.konghq.com/hub/kong-inc/ai-proxy/how-to/llm-provider-integration-guides/openai/)

### File Log 插件

- 创建
```shell
curl -X POST http://localhost:8001/routes/openai-chat/plugins \
    --data "name=file-log" \
    --data "config.path=/tmp/log.txt"
```

### 测试
```shell
curl -X POST http://localhost:8000/openai-chat \
    -H 'Content-Type: application/json' \
    --data-raw '{
        "messages": [ 
            { "role": "system", "content": "你是一名数学家。" }, 
            { "role": "user", "content": "1 + 1 = ?"} 
        ]
    }'
```

```shell
curl -X POST http://localhost:8000/openai-chat \
    -H 'Content-Type: application/json' \
    --data-raw '{
        "messages": [ 
            { "role": "system", "content": "你是一名人工智能助手。" }, 
            { "role": "user", "content": "你是谁？"} 
        ]
    }'
```

### 清理
```shell
curl -X DELETE http://localhost:8001/plugins/ai-proxy
curl -X DELETE http://localhost:8001/routes/openai-chat
curl -X DELETE http://localhost:8001/services/ai-proxy
```


## AI Gateway 插件

| 插件 | 描述 | <nobr>企业版</nobr> |
| --- | --- | :---: |
| AI Proxy | 可让您将请求转换和代理到多个 AI 提供程序和模型。 |  |
| AI Proxy Advanced | 允许您`同时`将请求转换和代理到多个 AI 提供程序和模型。 | ✅ |
| AI Request Transformer | 使用配置的 LLM 服务在上游代理请求之前内省和转换客户端的请求正文。 |  |
| AI Response Transformer | 使用配置的LLM服务来自省和转换上游的 HTTP（S）响应，然后再将其返回 client.It 也可以配置为终止或以其他方式取消响应，如果它未能通过（例如）来自配置的LLM服务的合规性或格式检查。 |  |
| AI Semantic Cache |  | ✅ |
| AI Semantic Prompt Guard |  | ✅ |
| <nobr>AI Rate Limiting Advanced</nobr> |  | ✅ |
| AI Azure Content Safety |  | ✅ |
| AI Prompt Template | 让您向用户提供经过调整的 AI 提示。 |  |
| AI Prompt Guard | 允许您将一系列与 PCRE 兼容的正则表达式配置为允许或拒绝列表。 |  |
| AI Prompt Decorator | 将`llm/v1/chat`消息数组添加到 LLM 消费者聊天历史的开始或结束。 |  |


## 参考资料
- [Basic config examples for AI Proxy](https://docs.konghq.com/hub/kong-inc/ai-proxy/how-to/basic-example/)
- [Configure Streaming with AI Proxy](https://docs.konghq.com/hub/kong-inc/ai-proxy/how-to/streaming/)
- [Kong AI Gateway 正式 GA](https://new.qq.com/rain/a/20240616A025ZL00)
