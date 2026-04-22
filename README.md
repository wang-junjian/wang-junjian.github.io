# 军舰日志

个人技术博客，基于 Astro 构建，部署于 GitHub Pages。

## 技术栈

- [Astro](https://astro.build/) v6 — 静态站点生成器
- [Tailwind CSS](https://tailwindcss.com/) v4 — 样式框架
- [Shiki](https://shiki.style/) + highlight.js — 代码高亮
- Ollama — 本地向量嵌入
- OpenAI 兼容 API — 问答生成

## 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

## AI 问答功能

博客集成了基于本地向量搜索 + LLM 的智能问答助手，实现 RAG（检索增强生成）流程。

### 前置条件

1. **Ollama** — 用于生成文章和查询的向量嵌入
   - 安装：[ollama.com](https://ollama.com)
   - 拉取嵌入模型：`ollama pull bge-m3:latest`
   - 确保服务运行：`http://localhost:11434`

2. **LLM API** — 用于生成回答
   - 支持任何 OpenAI 兼容格式的 API
   - 示例：OpenAI、LongCat、Gemini（OpenAI 兼容模式）等

### 生成向量索引

问答功能依赖 `public/embeddings.json`，需要通过以下命令生成：

```bash
# 使用默认配置（Ollama 本地服务 + bge-m3 模型）
npm run embed

# 或使用自定义环境变量
OLLAMA_BASE_URL=http://localhost:11434/v1 \
OLLAMA_EMBEDDING_MODEL=bge-m3:latest \
npm run embed
```

脚本行为：
- 扫描 `src/content/posts/` 下的所有 Markdown 文章
- 将文章切分为 512 词左右的片段（重叠 50 词）
- 通过 Ollama 的 `/embeddings` 接口生成向量
- 写入 `public/embeddings.json`
- **支持增量更新**：通过文件 hash 检测变更，仅处理新增或修改的文章

> 构建前必须先生成 `embeddings.json`，否则问答功能会提示"未找到向量索引"。

### 前端配置

点击聊天窗口右上角的 ⚙️ 按钮进行配置：

| 配置项 | 说明 | 默认值 |
|--------|------|--------|
| Ollama Base URL | 本地 Ollama 服务地址 | `http://localhost:11434/v1` |
| Ollama Embedding Model | 嵌入模型名称 | `bge-m3:latest` |
| LLM Base URL | LLM API 地址 | `https://api.openai.com/v1` |
| LLM API Key | API 密钥 | 空 |
| LLM Chat Model | 对话模型名称 | `gpt-4o-mini` |

配置保存在浏览器的 `localStorage` 中，仅在本地生效。

### 快捷操作

| 操作 | 快捷键 |
|------|--------|
| 打开 / 关闭 AIChat | `Ctrl + Command + I` |

### 问答流程

1. 用户输入问题
2. 前端通过 Ollama 将问题转换为向量
3. 在本地 `embeddings.json` 中计算余弦相似度，检索最相关的文章片段
4. **如果用户正在阅读某篇文章**，自动提取当前页面文章标题和正文（前 8000 字符）作为附加上下文
5. 将检索到的片段 + 当前文章内容（如有）作为上下文，调用 LLM API 生成回答
6. 回答末尾自动附加引用到的文章链接

## 部署

通过 GitHub Actions 自动部署到 GitHub Pages：

- 触发条件：`main` 分支推送
- 工作流文件：`.github/workflows/deploy.yml`
- 自定义域名：`wangjunjian.com`（`CNAME` 文件）

## 项目结构

```
.
├── public/                 # 静态资源（embeddings.json 生成于此）
├── scripts/
│   └── embed-posts.ts      # 向量索引生成脚本
├── src/
│   ├── components/
│   │   └── AIChat.astro    # AI 问答组件
│   ├── content/
│   │   └── posts/          # 博客文章（Markdown）
│   ├── layouts/
│   ├── pages/
│   └── utils/
│       └── ai.ts           # 向量搜索工具函数
├── astro.config.mjs
└── package.json
```
