---
layout: post
title:  "Open WebUI"
date:   2024-12-13 10:00:00 +0800
categories: OpenWebUI ChatGPT
tags: [OpenWebUI, ChatGPT, Ollama, OpenAI API]
---

## 下载镜像

- [Open WebUI](https://github.com/open-webui/open-webui)

```bash
docker pull ghcr.io/open-webui/open-webui:main
```

## 运行

### Docker Compose (Ollama)

编写配置文件：docker-compose.yml

```yaml
version: '3'
services:
  openwebui:
    image: ghcr.io/open-webui/open-webui:main
    extra_hosts:
      - host.docker.internal:host-gateway    
    ports:
      - "3000:8080"
    volumes:
      - open-webui:/app/backend/data
volumes:
  open-webui:
```

```bash
docker compose up
```

### Docker (OpenAI API)

```bash
docker run -d -p 3000:8080 --name open-webui --restart always \
    -e USE_EMBEDDING_MODEL= \
    -e OPENAI_API_BASE_URL=http://172.16.33.66:9997/v1 \
    -e OPENAI_API_KEY=NONE \
    -v open-webui:/app/backend/data \
    ghcr.io/open-webui/open-webui:main
```
