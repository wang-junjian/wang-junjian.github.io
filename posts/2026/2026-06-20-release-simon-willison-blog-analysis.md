---
type: release
title: "研究 Simon Willison 的博客设计风格和内容组织方式"
date: 2026-06-20 16:00:00 +0800
tags: [blog, blog-design, content-organization, simon-willison, personal-knowledge-management, astro, django, content-types]
linkUrl: https://www.kimi.com/share/19eea1ae-0fc2-8756-8000-00008ad27425
---

`User:` 研究这个网站设计的风格和功能：https://simonwillison.net/
这里有许多不同类型的内容（如Link、TIL、Tool、Entries、Quotes、Notes、Guides等），它是如何融合到一起的。
https://wangjunjian.com/ 是我的博客，我想参考一下。
Kimi: 让我先浏览这两个网站，了解它们的设计风格和内容组织方式。
我已经仔细浏览了这两个网站。Simon Willison 的博客是一个非常经典的"个人知识流"设计，它将 Entries、Links、Quotes、Notes、Guides、TILs、Tools 等多种内容类型按时间线无缝融合，配合极简的排版和强大的标签系统。你的博客"军舰的日志"则是更传统的技术博客布局，内容质量很高，主要围绕 AI Agent、LLM 等技术主题。

在我深入研究并给出具体建议之前，想先确认几个关键问题：

1. **你想借鉴的侧重点是什么？** 是 primarily 学习 Simon 的**视觉设计风格和布局**（极简、时间流、多种内容类型混排），还是想在自己的博客中也**引入多种内容类型**（如 Link、TIL、Quotes 等），还是两者都想？

2. **你目前的博客是基于什么技术栈？** 比如 Jekyll、Hugo、Next.js、VuePress 等？这决定了我给出的建议在技术实现上的可行性。

3. **你希望的变化程度有多大？** 是做一些小的布局调整（如加入时间流混排、调整侧边栏），还是考虑做一次较大的 redesign？

`User:` 1. 两者都想
2. Tech Stack

- **Framework**: Astro v6.1.8
- **Language**: JavaScript/TypeScript
- **Styling**: Tailwind CSS v4.2.2
- **Markdown Support**: MDX and GitHub Flavored Markdown
- **Image Processing**: Sharp
- **Syntax Highlighting**: Shiki (github-dark theme) + highlight.js
- **Features**: RSS feed, sitemap generation, SEO optimization
- 部署到 github pages

3. 现在我的内容类型单一，比如好的链接、文字片断、图像、视频、等，如何进行发布并展示。

我现在是在  vs code 中编写 markdown 文档，然后提交到 github 上，github 就会自动构建并部署到 github pages 上了。
我是不是还应该做一个发布内容的客户端？
Kimi: 让我深入调研 Simon Willison 网站的设计细节，然后进行综合分析。
现在我已经完成了充分的调研，让我为你撰写一份全面的研究报告。
研究报告已完成！以下是核心发现的总结：

---

## 核心发现

### Simon Willison 博客的六种内容类型

通过分析其开源的 [Django 源码](https://github.com/simonw/simonwillisonblog/blob/main/blog/models.py)，Simon 的博客包含 **Entry（长文）、Blogmark（链接）、Quotation（引文）、Note（笔记）、Beat（外部活动）、Chapter（指南章节）** 六种独立但统一关联的内容类型。它们通过共享的 `created`、`tags`、`slug` 字段实现跨类型关联，首页使用 SQL `UNION ALL` 将六种类型合并为统一时间流。

### 融合机制的关键设计

1. **首页统一时间流** — 所有类型按天分组混排，不显示类型徽章，仅通过内容形态差异（引号、链接样式、有无标题）隐式区分
2. **内容类型导航栏** — Entries | Links | Quotes | Notes | Guides | Elsewhere 作为过滤器
3. **标签是唯一组织维度** — 无分类系统，标签页聚合所有类型的相关内容
4. **极简排版** — 系统字体、黑蓝灰三色、无装饰元素，22年风格一致

### 关于发布客户端

你当前 **VS Code → Git → GitHub Actions → Pages** 的工作流对长文合适，但对碎片内容（链接、引文、笔记）门槛过高。**建议优先做**：

| 优先级 | 方案 | 成本 |
|--------|------|------|
| 立即 | VS Code 代码片段模板 | 零成本 |
| 短期 | GitHub Issue 模板 + Actions 自动转 Markdown | 低成本 |
| 中期 | 简易 Web 表单或浏览器扩展 | 中低成本 |

**不需要**一开始就做一个完整的桌面客户端。

### 给你的核心建议

1. **利用 Astro Content Collections** 引入 `links`、`quotes`、`notes` 三个新集合
2. **首页改为统一时间流** — 合并所有集合并按 `pubDate` 排序
3. **导航添加内容类型过滤器** — [全部] [文章] [链接] [引文] [笔记]
4. **标签系统优化** — 合并过于细化的标签（如把各种模型名称标签合并）
5. **保持当前排版克制** — 重点在内容结构，而非视觉 redesign
