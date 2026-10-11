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

- `posts/YYYY/`：Markdown 博客文章，按年份分目录，命名格式 `YYYY-MM-DD-slug.md`
- `posts-html/YYYY/`：HTML 独立文档（见第 7 节），按年份分目录
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

## 7. HTML 文章规范

智能体生成的独立 HTML 文档可作为"HTML 文章"直接放入 `posts-html/YYYY/`，与 `posts/YYYY/` 下的 Markdown 文章并存。站点会自动将其收录进首页/归档/年度/月度/标签页/RSS/搜索索引，点击后跳转到保留原样的独立页面 `/posts/<文件名>.html`（URL 为扁平结构，年份目录会被剥掉）。

约定：
- 文件名建议 `YYYY-MM-DD-slug.html`；**basename（去扩展名）必须全库唯一**，冲突会导致构建报错
- 必须是**自包含文档**（内联 CSS/JS，或使用 `/images/...` 等绝对路径资源）——相对路径资源会因 URL 压平而 404
- `<head>` 必需：
  - `<title>`（列表与 RSS 标题，缺省回退文件名）
  - `<meta name="date" content="YYYY-MM-DD">`（缺省尝试文件名日期前缀，再缺构建时告警）
- `<head>` 推荐：
  - `<meta name="description" content="...">`（列表摘要、RSS、搜索摘要）
  - `<meta name="keywords" content="a, b">`（映射为标签，支持中英文逗号；缺失则不进标签页）
  - `<meta name="author" content="军舰">`
- `_` 前缀的 HTML 文件不会被收录
- 同名 `.md` 与 `.html` 共存时，列表中两者都展示（Markdown 渲染为常规文章页，HTML 直达独立页）

实现见 `src/utils/htmlPosts.ts`（扫描/解析/合并）与 `src/integrations/htmlPostsStatic.ts`（dev 服务 + build 复制）。

## 8. HTML 工具页面规范

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

## 9. Git 工作流

- 本项目为个人站点，日常小改动直接在 `main` 分支上提交，不必为每个小功能新建独立分支。
- 只有涉及较大重构、实验性功能或需要长时间隔离的改动，才考虑新建分支。
- 提交信息使用中文，遵循约定式提交（Conventional Commits），末尾保留 `Co-Authored-By: Claude <noreply@anthropic.com>`。
