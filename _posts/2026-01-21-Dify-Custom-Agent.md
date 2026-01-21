---
layout: single
title:  "Dify 定制您的政策解读智能体"
date:   2026-01-21 10:00:00 +0800
categories: Dify Agent
tags: [Dify, Agent]
---

<!--more-->

![](/images/2026/Dify/PolicyReadingAgent.png)


## Dify

1. 克隆代码仓库
```bash
git clone https://github.com/langgenius/dify
```

2. Docker 部署

Dify 提供了 Docker 部署方式，您可以通过以下步骤快速部署：

```bash
cd dify
cd docker
cp .env.example .env
docker compose up -d
```

运行后，可以在浏览器上访问 [http://localhost/install](http://localhost/install) 进入 Dify 控制台并开始初始化安装操作。


## Ollama

1. 安装 Ollama 服务。
```bash
curl -fsSL https://ollama.com/install.sh | sh
```

2. 编辑 systemd 服务，调用 `systemctl edit ollama.service`。这将打开一个编辑器。
```bash
sudo systemctl edit ollama.service
```

3. 对于每个环境变量，在 [Service] 部分下添加一行 Environment：
```ini
[Service]
Environment="OLLAMA_HOST=0.0.0.0"
Environment="OLLAMA_NUM_PARALLEL=32"
```

4. 保存并关闭编辑器。

5. 重新加载 systemd 并重启 Ollama。
```bash
sudo systemctl daemon-reload
sudo systemctl restart ollama
```

6. 下载嵌入模型
```bash
ollama pull bge-m3
```

7. 测试嵌入模型
```bash
curl http://localhost:11434/v1/embeddings \
    -H "Content-Type: application/json" \
    -d '{
        "model": "bge-m3",
        "input": "Embedding text..."
    }'
```


## 参考资料
- [Dify 模板](https://docs.dify.ai/zh/use-dify/nodes/template)
- [Jinja - Template Designer Documentation](https://jinja.palletsprojects.com/en/stable/templates/)
