# CLAUDE.md

本文件为 Claude Code 提供项目上下文与约定。详细配置请直接查看对应源文件。

## 1. 项目类型

个人博客/技术网站，使用 Astro 构建。

## 2. 技术栈

- **框架**：Astro v6.1.8
- **语言**：JavaScript / TypeScript
- **样式**：Tailwind CSS v4.2.2
- **Markdown**：MDX / GFM，语法高亮 Shiki（github-dark）
- **Node 版本**：>= 22.12.0
- **站点**：https://wangjunjian.com

## 3. 常用命令

```bash
npm install       # 安装依赖
npm run dev       # 本地开发 localhost:4321
npm run build     # 构建生产版本到 ./dist/
npm run preview   # 预览生产构建
```

## 4. 项目结构

- `src/content/posts/`：博客文章，命名格式 `YYYY-MM-DD-slug.md`
- `src/components/`：Astro 组件
- `src/layouts/`：页面布局
- `src/pages/`：站点页面
- `public/`：静态资源
- `astro.config.mjs`：Astro 配置
- `.github/workflows/deploy.yml`：GitHub Pages 部署配置

## 5. 部署

GitHub Actions 自动部署到 GitHub Pages，自定义域名 `wangjunjian.com`。

## 6. 文章 Frontmatter 约定

常用字段：
- `title`：标题
- `date`：发布日期
- `tags`：标签（字符串或数组）
- `excerpt`：摘要

## 7. HTML 工具页面规范

`tools/*.html` 下的独立 HTML 工具页面需遵循：

- `<html lang="zh-CN">`
- `<title>` 使用中文
- 页面可见文本、按钮、提示、示例数据均使用中文
- `<head>` 必须包含：
  - `<meta charset="UTF-8">`
  - `<meta name="viewport" content="width=device-width, initial-scale=1.0">`
  - `<meta name="description" content="...">`（中文描述）
  - `<meta name="keywords" content="...">`（中文关键词，可保留必要英文术语）
  - `<meta name="author" content="军舰">`
  - `<meta name="date" content="YYYY-MM-DD">`（当前日期）
