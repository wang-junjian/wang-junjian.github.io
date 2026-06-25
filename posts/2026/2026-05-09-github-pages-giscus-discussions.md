---
type: article
title:  "给 GitHub Pages 博客加评论：用 Giscus 开启原生的 Discussions 方案"
date:   2026-05-09 22:00:00 +0800
tags: [GitHub Pages, Giscus, 评论系统, GitHub Discussions]
---

## 1. 开启仓库的 Discussions 功能

默认情况下，GitHub 仓库没有开启讨论（Discussions）功能。

* 进入 [wang-junjian.github.io](https://github.com/wang-junjian/wang-junjian.github.io) 仓库。
* 点击顶部的 **Settings**（设置）。
* 在 **General** 页面向下滚动，找到 **Features** 区域。
* 勾选 **Discussions** 选项。

![](/images/2026/comment-giscus/blog-settings-features-discussions.webp)


## 2. 安装并授权 giscus app

为了让 Giscus 有权限向你的仓库写入评论，你需要：

* 访问 [github.com/apps/giscus](https://github.com/apps/giscus)。
* 点击 **Install**，并选择将其安装到你的 `wang-junjian.github.io` 仓库上。

![](/images/2026/comment-giscus/giscus-install.webp)

![](/images/2026/comment-giscus/giscus-install-to-blog.webp)

![](/images/2026/comment-giscus/github-app-giscus.webp)


## 3. 配置分类 (Category)

在你的 Discussions 页面中，建议创建一个专门的类别（例如命名为 `Announcements` 或 `Comments`），并确保该类别的 **Discussion format** 设置为 **Announcement**，这样普通用户就不能直接在 GitHub 页面随意发起讨论，只能通过你的博客留言板生成。

![](/images/2026/comment-giscus/blog-discussions.webp)

![](/images/2026/comment-giscus/blog-discussions-category.webp)

![](/images/2026/comment-giscus/blog-discussions-category-created.webp)


## 4. 获取配置代码

访问 [giscus.app](https://giscus.app/zh-CN)，在“仓库”栏输入 `wang-junjian/wang-junjian.github.io`，它会自动检测并生成一段配置代码。

![](/images/2026/comment-giscus/giscus-config-script1.webp)

![](/images/2026/comment-giscus/giscus-config-script2.webp)


## 5. 博客中评论

![](/images/2026/comment-giscus/giscus-comments.webp)

![](/images/2026/comment-giscus/blog-discussions-comments.webp)
