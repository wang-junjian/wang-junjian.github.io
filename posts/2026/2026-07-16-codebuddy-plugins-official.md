---
type: article
title: "CodeBuddy 官方插件市场 · 插件分类清单"
date: 2026-07-16 10:24:00 +0800
tags: [workbuddy, codebuddy, agent, plugins, marketplace]
---

> 数据来源：`codebuddy-plugins-official` 市场 manifest（共 **207** 个插件）

> 分类方式：基于插件 `name` / `description` 关键词的中文功能聚类（官方 `category` 字段缺失较多，故采用描述推断）。


**分类概览**：腾讯安全实验室：7 | 语言服务器 LSP：11 | 文档与办公：11 | 前端与 UI 设计：37 | 游戏开发：5 | 腾讯生态与 MCP 集成：16 | 工作流与生产力：77 | 内容创作与写作：7 | 系统与脚本开发：5 | 外部领域合集：31


## 腾讯安全实验室（7）

| 插件名 | 版本 | 来源 | 许可证 | 说明 |
| --- | --- | --- | --- | --- |
| atuin | 1.1.0 | 官方 | 未声明 | 腾讯玄武实验室安全插件 |
| chainguard | 1.1.3 | 官方 | 未声明 | 腾讯云鼎实验室出品，AI 编程供应链安全防护，自动拦截依赖安装操作进行安全审计，检测漏洞组件、License 合规及 SBOM 白名单。 |
| dependency-management | 1.2.0 | 外部 | MIT | 依赖审计、版本管理和安全漏洞扫描 |
| security-guidance | ? | 官方 | 未声明 | 安全提醒钩子，在编辑文件时警告潜在的安全问题，包括命令注入、XSS 和不安全的代码模式 |
| security-rules | 2.1.0 | 官方 | 未声明 | 腾讯云鼎实验室出品，将安全专家经验融入代码生成过程，实时对常见漏洞的防护规则和安全函数约束，让 AI直接生成安全代码，从源头保障代码安全质量。 |
| security-scan | 3.5.13 | 官方 | 未声明 | 腾讯云鼎实验室出品，专业的代码安全审计插件。支持 Fast（极速扫描）、Light（快速扫描）和 Deep（深度扫描）三种模式。基于 SQLite 语义索引 +… |
| skills-security-check | 1.0.0 | 官方 | 未声明 | 腾讯云鼎实验室出品，Skill安全审查工具。对用户指定的skill.md文件及其配套的文档、程序、脚本等进行全面安全审计，确保引用安全 |


## 语言服务器 LSP（11）

| 插件名 | 版本 | 来源 | 许可证 | 说明 |
| --- | --- | --- | --- | --- |
| clangd-lsp | ? | 官方 | 未声明 | C/C++ Language Server,为 CodeBuddy 提供代码智能、重构和分析功能。 |
| csharp-lsp | ? | 官方 | 未声明 | C# Language Server,为 CodeBuddy 提供代码智能、重构和分析功能。 |
| gopls-lsp | ? | 官方 | 未声明 | Go Language Server,为 CodeBuddy 提供代码智能、重构和分析功能。 |
| jdtls-lsp | ? | 官方 | 未声明 | Java Language Server,为 CodeBuddy 提供代码智能、重构和分析功能。 |
| lua-lsp | ? | 官方 | 未声明 | Lua Language Server,为 CodeBuddy 提供代码智能、重构和分析功能。 |
| php-lsp | 1.0.0 | 官方 | 未声明 | PHP 语言服务器（Intelephense），提供代码智能和诊断 |
| pyright-lsp | 1.0.0 | 官方 | 未声明 | Python 语言服务器（Pyright），提供类型检查和代码智能提示 |
| rust-analyzer-lsp | 1.0.0 | 官方 | 未声明 | Rust 语言服务器，提供代码智能和分析功能 |
| serena | ? | 官方 | 未声明 | 语义代码分析 MCP 服务器，通过语言服务器协议集成提供智能代码理解、重构建议和代码库导航功能。 |
| swift-lsp | 1.0.0 | 官方 | 未声明 | Swift 语言服务器（SourceKit-LSP），提供代码智能支持 |
| typescript-lsp | 1.0.0 | 官方 | 未声明 | TypeScript/JavaScript 语言服务器，提供增强的代码智能功能 |


## 文档与办公（11）

| 插件名 | 版本 | 来源 | 许可证 | 说明 |
| --- | --- | --- | --- | --- |
| canvas-design | ? | 外部 | Apache-2.0 | 使用设计哲学和美学原则创建精美的视觉艺术作品，支持生成海报、设计稿和静态艺术品的 PNG 和 PDF 文档。 |
| docx | ? | 官方 | Proprietary | 全面的 Word 文档创建、编辑和分析工具，支持修订跟踪、评论、格式保留和文本提取。用于处理专业 Word 文档(.docx) |
| image-enhancer | ? | 外部 | 未声明 | 通过提升分辨率、锐度和清晰度来改善图像和截图质量，适用于专业演示文稿和文档制作。 |
| invoice-organizer | ? | 外部 | 未声明 | 发票整理工具 |
| pdf | ? | 官方 | Proprietary | 全面的 PDF 处理工具包，支持提取文本和表格、创建新 PDF、合并/拆分文档、表单填写、加密解密、OCR 扫描等功能 |
| ppt-writer | 1.0.0 | 官方 | MIT | AI驱动的PPT创作助手，支持智能内容生成、多格式导出和专业模板 |
| pptx | ? | 官方 | Proprietary | PowerPoint 演示文稿创建、编辑和分析技能。支持创建新演示文稿、修改内容、处理布局、添加注释或演讲者备注等操作 |
| raffle-winner-picker | ? | 外部 | 未声明 | 从列表、电子表格或 Google Sheets 中随机选择获奖者，用于抽奖和比赛，采用密码学安全的随机性确保公平。 |
| tencent-docs | 1.0.6 | 官方 | 未声明 | 腾讯文档插件，提供完整的腾讯文档操作能力，包括创建各类在线文档、查询搜索文档、管理空间节点、读取编辑智能表和智能文档。 |
| theme-factory | ? | 外部 | Apache-2.0 | 为演示文稿、文档、报告和 HTML 落地页等制品应用专业的字体和配色主题，提供 10 套预设主题方案。 |
| xlsx | ? | 官方 | Proprietary | 全面的电子表格创建、编辑和分析工具，支持公式、格式化、数据分析和可视化。适用于 .xlsx、.xlsm、.csv、.tsv 等表格文件的处理 |


## 前端与 UI 设计（37）

| 插件名 | 版本 | 来源 | 许可证 | 说明 |
| --- | --- | --- | --- | --- |
| accessibility-compliance | 1.2.1 | 外部 | MIT | WCAG 无障碍审计、合规性验证、屏幕阅读器 UI 测试、键盘导航和包容性设计 |
| agents-blockchain-web3 | ? | 外部 | MIT | Specialized agents for blockchain development, smart contracts, and Web3 applica… |
| agents-design-experience | ? | 外部 | MIT | Agents for UI/UX design, accessibility, and user experience optimization |
| agents-development-architecture | ? | 外部 | MIT | Expert agents for software architecture, backend development, and system design |
| algorithmic-art | ? | 官方 | Apache-2.0 | 使用 p5.js 创建算法艺术，支持种子随机性和交互式参数探索。适用于生成艺术、流场、粒子系统等代码艺术创作。 |
| api-scaffolding | 1.2.1 | 外部 | MIT | REST 和 GraphQL API 脚手架、框架选择、后端架构设计与 API 生成 |
| backend-development | 1.2.4 | 外部 | MIT | 后端 API 设计、GraphQL 架构、Temporal 工作流编排及测试驱动的后端开发 |
| brand-guidelines | ? | 外部 | Apache-2.0 | 将 Anthropic 官方品牌配色和排版应用于工件，确保视觉识别和专业设计标准的一致性。 |
| c4-architecture | 1.0.0 | 外部 | MIT | 全面的 C4 架构文档工作流,采用自底向上的代码分析、组件合成、容器映射和上下文图生成 |
| cloud-infrastructure | 1.2.2 | 外部 | MIT | 云架构设计（AWS/Azure/GCP），Kubernetes 集群配置，Terraform 基础设施即代码，混合云网络，以及多云成本优化 |
| cloudbase | 1.0.0 | 官方 | MIT | CloudBase AI 开发插件，提供 Web、小程序、云函数、CloudRun、数据库（NoSQL/MySQL）、云存储、AI 模型、UI 设计等全栈开发能… |
| commands-api-development | ? | 外部 | MIT | Commands for designing and documenting REST and GraphQL APIs |
| commands-database-operations | ? | 外部 | 未声明 | Commands for database schema design, migrations, and optimization |
| commands-performance-optimization | ? | 外部 | MIT | Commands for optimizing build, bundle size, and performance |
| data-engineering | 1.2.2 | 外部 | MIT | ETL管道构建、数据仓库设计、批处理工作流和数据驱动的功能开发 |
| data-validation-suite | 1.2.0 | 外部 | MIT | 模式验证、数据质量监控、流式验证管道以及后端API的输入验证 |
| database-design | 1.2.0 | 外部 | MIT | 生产系统的数据库架构设计、模式设计和 SQL 优化 |
| doc-coauthoring | ? | 官方 | Apache-2.0 | 引导用户通过结构化工作流协作撰写文档。适用于编写文档、提案、技术规格、决策文档等结构化内容。 |
| feature-dev | ? | 官方 | 未声明 | 全面的功能开发工作流，配备专门的智能体用于代码库探索、架构设计和质量审查 |
| frontend-design | ? | 官方 | 未声明 | 创建独特的生产级前端界面,具有高设计质量。生成富有创意、精致的代码,避免千篇一律的AI审美。 |
| frontend-design-pro | ? | 外部 | 未声明 | Advanced frontend design plugin with interactive wizard, trend research, moodboa… |
| frontend-mobile-development | 1.2.1 | 外部 | MIT | 跨平台前端 UI 开发和移动应用实现 |
| frontend-mobile-security | 1.2.0 | 外部 | MIT | Specialized security agents for frontend and mobile development. Includes XSS vu… |
| functional-programming | 1.2.0 | 外部 | MIT | Expert agents for functional programming languages including Haskell and Elixir.… |
| javascript-typescript | 1.2.1 | 外部 | MIT | JavaScript 和 TypeScript 开发，支持 ES6+、Node.js、React 及现代 Web 框架 |
| llm-application-dev | 1.2.2 | 外部 | MIT | Build production-ready LLM applications, advanced RAG systems, and intelligent a… |
| lucide-icons | ? | 官方 | MIT | 搜索、下载和自定义 Lucide 图标（1000+ 精美 SVG 图标），支持生成 React 组件 |
| machine-learning-ops | 1.2.1 | 外部 | MIT | Complete MLOps toolkit with specialized agents for ML engineering, MLOps infrast… |
| mcp-builder | ? | 外部 | Apache-2.0 | 指导创建高质量的 MCP（模型上下文协议）服务器,用于将外部 API 和服务与大语言模型集成,支持 Python 和 TypeScript 开发 |
| obsidian-skills | ? | 外部 | 未声明 | Skills for working with Obsidian files including Markdown with wikilinks/embeds/… |
| playwright-cli | 0.1.0 | 官方 | Apache-2.0 | 基于 Playwright 的 CLI 浏览器自动化工具，专为编程代理优化。通过命令行控制浏览器进行网页导航、元素交互、表单填写、截图、网络拦截和会话管理，比 … |
| pr-review-toolkit | ? | 官方 | 未声明 | 全面的 PR 审查代理工具集,专注于代码注释、测试覆盖、错误处理、类型设计、代码质量和代码简化 |
| requirements-driven-workflow | 1.0.0 | 官方 | MIT | 需求驱动开发工作流，包含 90% 质量门控的实用功能实现流程 |
| startup-business-analyst | 1.0.3 | 外部 | 未声明 | 面向初创企业的综合业务分析工具，提供市场规模分析（TAM/SAM/SOM）、财务建模、团队规划和战略研究功能 |
| ui-ux-pro-max-skill | ? | 外部 | 未声明 | AI-powered UI/UX design system generator with 100+ industry-specific reasoning r… |
| web-artifacts-builder | ? | 官方 | Apache-2.0 | 使用现代前端技术（React、Tailwind CSS、shadcn/ui）创建复杂多组件 HTML 工件的工具套件。适用于需要状态管理、路由或 shadcn/… |
| webapp-testing | ? | 外部 | Apache-2.0 | 使用 Playwright 测试本地 Web 应用，支持验证前端功能、调试 UI 行为和捕获浏览器截图。 |


## 游戏开发（5）

| 插件名 | 版本 | 来源 | 许可证 | 说明 |
| --- | --- | --- | --- | --- |
| commands-game-development | ? | 外部 | MIT | Commands for game development workflows |
| game-development | 1.2.1 | 外部 | MIT | Unity游戏开发与C#脚本编程，Minecraft服务器插件开发（支持Bukkit/Spigot API） |
| godot-mcp | 1.0.1 | 官方 | MIT | Godot 4 MCP 集成插件，通过 AI 对话直接操作 Godot Editor。支持场景管理、节点操作、脚本编辑、项目运行等功能。 |
| magicai-hub | 1.0.0 | 官方 | MIT | Godot 4.x 游戏开发 AI 技能工具包。提供 GDScript 代码生成、数据驱动配置、场景/资源文件格式解析、资产路径修复、无头验证、工具函数库等专业… |
| weixin-minigame-helper | 0.1.4 | 官方 | MIT | 微信小游戏AI调试、预览、运行、真机测试上传发布微信小游戏 |


## 腾讯生态与 MCP 集成（16）

| 插件名 | 版本 | 来源 | 许可证 | 说明 |
| --- | --- | --- | --- | --- |
| agent-browser | 1.3.0 | 官方 | MIT | 基于 Vercel agent-browser CLI 的浏览器自动化插件。首次使用时自动安装，让 CodeBuddy 能够进行网页交互、截图、表单填写等浏览器… |
| cicd-automation | 1.2.1 | 外部 | MIT | CI/CD 流水线配置、GitHub Actions/GitLab CI 工作流设置及自动化部署流水线编排 |
| context7 | ? | 官方 | 未声明 | 通过 MCP 集成查询任何编程库的最新文档和代码示例。 |
| find-skills | 1.0.0 | 官方 | MIT | 帮助用户发现和安装 AI Agent 技能，支持从 Vercel Skills 和 ClawHub 两个技能仓库搜索和安装 |
| firebase | ? | 官方 | 未声明 | Firebase MCP 服务器,用于管理 Firestore 数据。 |
| github | ? | 官方 | 未声明 | GitHub MCP 服务器,用于管理仓库、问题、PR、搜索等功能。 |
| gitlab | ? | 官方 | 未声明 | GitLab MCP 服务器,用于管理项目、问题、合并请求等。 |
| lexiang-knowledge | ? | 官方 | 未声明 | 乐享知识库, 企业协同知识库，提供获取文档内容与元数据、搜索文档内容、查询知识库与目录结构、创建/编辑/移动文档、管理标签与评论、上传文件及维护附件等知识库操作… |
| mcp-servers-docker | ? | 外部 | MIT | Docker-based MCP servers from the official Docker MCP registry - includes 199+ v… |
| oh-my-codebuddy | 1.0.0 | 官方 | MIT | 完整的 OMC (Oh My CodeBuddy) 插件，包含 agents、commands、skills、hooks、tools 和 MCP servers… |
| plugin-dev | ? | 官方 | 未声明 | 用于开发 CodeBuddy Code 插件的综合工具包。包含 7 个专家技能，涵盖钩子、MCP 集成、命令、代理和最佳实践。支持 AI 辅助的插件创建和验证。 |
| repomix-mcp | ? | 外部 | MIT | Repomix MCP 服务器，用于 AI 驱动的代码库分析。打包本地/远程仓库，搜索输出内容，读取文件并内置安全扫描。这是在 Claude Code 中启用所… |
| supabase | ? | 官方 | 未声明 | Supabase MCP 集成，用于数据库操作、身份验证、存储和实时订阅。管理您的 Supabase 项目，运行 SQL 查询，并直接与后端交互。 |
| superpowers-chrome | 1.6.2 | 外部 | MIT | 超轻量级 Chrome DevTools Protocol MCP 服务器，支持自动捕获。通过 Chrome DevTools Protocol 实现直接浏览器… |
| taskmaster | ? | 外部 | MIT WITH Commons-Clause | Claude Code 插件 - 基于AI的任务管理系统，提供命令、代理和 MCP 集成 |
| tmap-lbs-plugin | 1.0.0 | 官方 | 未声明 | 腾讯地图位置服务开发插件，提供 JavaScript GL 地图开发指南和 Web 服务 API（POI搜索、路径规划、旅游规划、轨迹可视化等）能力。 |


## 工作流与生产力（77）

| 插件名 | 版本 | 来源 | 许可证 | 说明 |
| --- | --- | --- | --- | --- |
| agent-orchestration | 1.2.0 | 外部 | MIT | 多智能体系统优化、智能体改进工作流和上下文管理 |
| agent-sdk-dev | 1.0.0 | 官方 | 未声明 | 用于创建和验证 CodeBuddy Agent SDK 应用程序的综合插件，支持 Python 和 TypeScript。包含 /new-sdk-app 命令用… |
| agent-team-agile-workflow | 1.0.0 | 官方 | MIT | 完整的 BMAD 敏捷工作流插件，包含角色化代理（PO、架构师、SM、开发、QA）和交互式审批流程 |
| agents-business-finance | ? | 外部 | MIT | Agents for business analysis, financial modeling, and KPI tracking |
| agents-crypto-trading | ? | 外部 | 未声明 | Expert agents for cryptocurrency trading, DeFi strategies, and market analysis |
| agents-data-ai | ? | 外部 | MIT | Agents for data engineering, machine learning, and AI development |
| agents-infrastructure-operations | ? | 外部 | MIT | Agents for cloud infrastructure, DevOps, and database operations |
| agents-language-specialists | ? | 外部 | MIT | Expert agents for specific programming languages (Python, Go, Rust, etc.) |
| agents-quality-security | ? | 外部 | MIT | Agents for code review, security audits, debugging, and quality assurance |
| agents-sales-marketing | ? | 外部 | MIT | Agents for content marketing, customer support, and sales automation |
| agents-specialized-domains | ? | 外部 | MIT | Domain-specific expert agents for research, documentation, and specialized tasks |
| all-agents | ? | 外部 | MIT | Complete collection of 117 specialized AI agents across 11 categories |
| all-commands | ? | 外部 | MIT | Complete collection of 174 slash commands across 22 categories |
| all-hooks | ? | 外部 | 未声明 | Complete collection of 28 automation hooks for event-driven workflows |
| all-skills | ? | 外部 | MIT | Complete collection of 26 Claude Code skills for document processing, developmen… |
| api-testing-observability | 1.2.0 | 外部 | MIT | API 测试自动化、请求模拟、OpenAPI 文档生成、可观测性配置与监控 |
| application-performance | 1.2.1 | 外部 | MIT | Expert performance engineering agents for application optimization, observabilit… |
| changelog-generator | ? | 外部 | 未声明 | 自动从 git 提交历史生成面向用户的变更日志，将技术性的提交记录转换为易于理解的发布说明 |
| claude-hud | ? | 外部 | MIT | Real-time statusline HUD for Claude Code - displays context usage, tool activity… |
| code-simplifier | 1.0.0 | 官方 | 未声明 | 专注于简化代码以提升清晰度、一致性和可维护性的智能代理,在保留完整功能的前提下优化代码结构。主要关注最近修改的代码。 |
| codebuddy-md-management | 1.0.0 | 官方 | 未声明 | 用于维护和改进 CODEBUDDY.md 文件的工具 - 审核质量、捕获会话学习内容，并保持项目记忆最新。 |
| commands-automation-workflow | ? | 外部 | MIT | Commands for automating repetitive tasks and workflows |
| commands-ci-deployment | ? | 外部 | MIT | Commands for CI/CD setup, containerization, and deployment automation |
| commands-code-analysis-testing | ? | 外部 | MIT | Commands for code review, testing, and analysis |
| commands-context-loading-priming | ? | 外部 | MIT | Commands for loading context and priming Claude for specific tasks |
| commands-documentation-changelogs | ? | 外部 | 未声明 | Commands for generating documentation and managing changelogs |
| commands-framework-svelte | ? | 外部 | MIT | Specialized commands for Svelte and SvelteKit development |
| commands-integration-sync | ? | 外部 | MIT | Commands for integrating with external services and syncing data |
| commands-miscellaneous | ? | 外部 | MIT | General-purpose utility commands |
| commands-monitoring-observability | ? | 外部 | 未声明 | Commands for setting up monitoring and observability |
| commands-project-setup | ? | 外部 | MIT | Commands for initializing and setting up new projects |
| commands-project-task-management | ? | 外部 | 未声明 | Commands for task management and project tracking |
| commands-security-audit | ? | 外部 | MIT | Commands for security auditing and vulnerability scanning |
| commands-simulation-modeling | ? | 外部 | MIT | Commands for scenario simulation and decision modeling |
| commands-team-collaboration | ? | 外部 | MIT | Commands for team workflows, PR reviews, and collaboration |
| commands-typescript-migration | ? | 外部 | MIT | Commands for migrating JavaScript projects to TypeScript |
| commands-utilities-debugging | ? | 外部 | MIT | General debugging and utility commands |
| commands-version-control-git | ? | 外部 | MIT | Commands for Git operations, commits, and PRs |
| commands-workflow-orchestration | ? | 外部 | MIT | Commands for orchestrating complex workflows |
| commit-commands | ? | 官方 | 未声明 | 高效 Git 工作流命令,简化暂存、提交和推送流程。 |
| conductor | 1.2.0 | 外部 | Apache-2.0 | 上下文驱动开发插件，将 Claude Code 转变为项目管理工具，采用结构化工作流：上下文 → 规格与计划 → 实施 |
| customer-sales-automation | 1.2.0 | 外部 | MIT | 客户支持工作流自动化、销售管道管理、邮件营销活动及客户关系管理系统集成 |
| debugging-toolkit | 1.2.0 | 外部 | MIT | 交互式调试、开发者体验优化和智能调试工作流 |
| developer-essentials | 1.0.1 | 外部 | MIT | 包含 Git 工作流、SQL 优化、错误处理、代码审查、端到端测试、身份认证、调试和 Monorepo 管理的核心开发技能集 |
| developer-growth-analysis | ? | 外部 | 未声明 | 分析你最近的 Claude Code 聊天历史，识别编码模式、发现开发能力缺口和需要改进的领域，从 HackerNews 精选相关学习资源，并自动将个性化成长报… |
| development-essentials | 1.0.0 | 官方 | MIT | 核心开发命令集，包含编码、调试、测试、优化和文档生成等常用开发工作流 |
| framework-migration | 1.2.2 | 外部 | MIT | 框架升级、迁移规划与架构转型工作流 |
| full-stack-orchestration | 1.2.1 | 外部 | MIT | Orchestrate full-stack feature development with specialized agents for test auto… |
| git-pr-workflows | 1.2.1 | 外部 | MIT | Git 工作流自动化、拉取请求增强和团队入职流程 |
| hookify | ? | 官方 | 未声明 | 创建和管理自定义钩子,自动化你的工作流程。 |
| hooks-automation | ? | 外部 | MIT | Automation Hooks - Event-driven automation hooks |
| hooks-development | ? | 外部 | MIT | Development Hooks - Event-driven automation hooks |
| hooks-formatting | ? | 外部 | 未声明 | Formatting Hooks - Event-driven automation hooks |
| hooks-git | ? | 外部 | MIT | Git Hooks - Event-driven automation hooks |
| hooks-notifications | ? | 外部 | 未声明 | Notification Hooks - Event-driven automation hooks |
| hooks-performance | ? | 外部 | MIT | Performance Hooks - Event-driven automation hooks |
| hooks-security | ? | 外部 | MIT | Security Hooks - Event-driven automation hooks |
| hooks-testing | ? | 外部 | 未声明 | Testing Hooks - Event-driven automation hooks |
| hot-skills | ? | 官方 | MIT | 精选热门 AI Agent 技能合集，汇集社区高下载量技能于一处。 |
| incident-response | 1.2.2 | 外部 | MIT | 生产事故管理、分级处理工作流和自动化事故解决方案 |
| interview | ? | 外部 | MIT | Interview command for fleshing out big feature plans and specifications |
| kubernetes-operations | 1.2.1 | 外部 | MIT | Kubernetes 清单生成、网络配置、安全策略、可观测性配置、GitOps 工作流和自动扩缩容 |
| nextjs-expert | ? | 外部 | 未声明 | Next.js development expertise with skills for App Router, Server Components, Rou… |
| payload | 0.0.1 | 外部 | MIT | 为 Payload 开发提供全面指导的 Claude Code 技能，包含 TypeScript 模式、字段配置、钩子、访问控制和 API 示例。 |
| performance-testing-review | 1.2.0 | 外部 | MIT | 性能分析、测试覆盖率审查和 AI 驱动的代码质量评估 |
| plugin-finder | 0.2.0 | 官方 | 未声明 | 智能插件发现和管理助手 - 支持智能搜索、多插件并行对比、多插件协同工作流（sequence-run）、插件信息详解、许愿新插件等功能 |
| ralph-loop | ? | 官方 | 未声明 | 用于迭代开发的交互式自引用AI循环，实现Ralph Wiggum技术。Claude重复执行同一任务，查看之前的工作，直到完成为止。 |
| repomix-commands | ? | 外部 | MIT | 用于快速执行 Repomix 操作的斜杠命令。通过 /pack-local 和 /pack-remote 等简单命令打包本地和远程代码仓库。 |
| repomix-explorer | ? | 外部 | 未声明 | 在 CodeBuddy Code 中使用 Repomix 能力探索和分析仓库结构 |
| scientific-skills | ? | 外部 | MIT | A comprehensive collection of 139 ready-to-use scientific skills for CodeBuddy, … |
| skill-creator | ? | 外部 | Apache-2.0 | 提供创建高效 Claude 技能的指南,通过专业知识、工作流程和工具集成来扩展 AI 助手的能力 |
| superpowers | 4.0.3 | 外部 | MIT | Claude Code 核心技能库：包含测试驱动开发、系统化调试、协作模式和经过验证的技术方法 |
| tdd-workflows | 1.2.1 | 外部 | MIT | 测试驱动开发方法论,提供红-绿-重构循环和代码审查 |
| team-collaboration | 1.2.0 | 外部 | MIT | 团队工作流、问题管理、站会自动化和开发者体验优化 |
| template-skill | ? | 外部 | 未声明 | 一个演示如何创建新 Claude 技能的结构和格式的模板技能 |
| testbuddy | 1.6.7 | 官方 | 未声明 | 测试用例生成插件 |
| unit-testing | 1.2.0 | 外部 | MIT | Python 和 JavaScript 的单元测试与集成测试自动化，支持调试功能 |


## 内容创作与写作（7）

| 插件名 | 版本 | 来源 | 许可证 | 说明 |
| --- | --- | --- | --- | --- |
| competitive-ads-extractor | ? | 外部 | 未声明 | 从广告库中提取并分析竞争对手的广告,以了解能够引起共鸣的营销信息和创意方法。 |
| content-research-writer | ? | 外部 | 未声明 | 协助撰写高质量内容，包括研究调查、添加引用、改进开篇、提供逐节反馈等功能。 |
| domain-name-brainstormer | ? | 外部 | 未声明 | 为项目生成创意域名并检查多个顶级域名（包括 .com、.io、.dev 和 .ai 等）的可用性 |
| internal-comms | ? | 外部 | Apache-2.0 | 帮助撰写内部沟通文档，包括三要素更新（进展/计划/问题）、公司通讯、常见问题解答、状态报告和项目更新，遵循公司特定格式规范。 |
| lead-research-assistant | ? | 外部 | 未声明 | 通过分析您的产品、搜索目标公司并提供可行的联系策略，识别和筛选高质量潜在客户。 |
| meeting-insights-analyzer | ? | 外部 | 未声明 | 分析会议记录以揭示行为模式，包括冲突回避、发言比例、填充词使用和领导风格。 |
| tailored-resume-generator | ? | 外部 | 未声明 | 分析职位描述并生成量身定制的简历，突出相关经验、技能和成就，最大化面试机会。 |


## 系统与脚本开发（5）

| 插件名 | 版本 | 来源 | 许可证 | 说明 |
| --- | --- | --- | --- | --- |
| arm-cortex-microcontrollers | 1.2.0 | 外部 | MIT | 面向 Teensy、STM32、nRF52 和 SAMD 的 ARM Cortex-M 固件开发，提供外设驱动和内存安全模式 |
| julia-development | 1.0.0 | 外部 | MIT | 现代 Julia 开发工具，支持 Julia 1.10+ 版本、包管理、科学计算、高性能数值代码和生产环境最佳实践 |
| shell-scripting | 1.2.1 | 外部 | MIT | 生产级 Bash 脚本编写，包含防御性编程、POSIX 合规性和全面测试 |
| slack-gif-creator | ? | 外部 | Apache-2.0 | 创建针对 Slack 优化的动画 GIF,提供文件大小约束验证和可组合的动画基元。 |
| video-downloader | ? | 外部 | 未声明 | 从 YouTube 和其他平台下载视频，支持离线观看、编辑或存档，提供多种格式和画质选项。 |


## 外部领域合集（31）

| 插件名 | 版本 | 来源 | 许可证 | 说明 |
| --- | --- | --- | --- | --- |
| backend-api-security | 1.2.0 | 外部 | MIT | API 安全加固、身份验证实现、授权模式、速率限制和输入验证 |
| blockchain-web3 | 1.2.1 | 外部 | MIT | 使用 Solidity 进行智能合约开发、DeFi 协议实现、NFT 平台和 Web3 应用架构 |
| business-analytics | 1.2.1 | 外部 | MIT | 业务指标分析、KPI 跟踪、财务报告和数据驱动的决策制定 |
| code-documentation | 1.2.0 | 外部 | MIT | 文档生成、代码解释和技术写作，支持自动化文档生成和教程创建 |
| code-refactoring | 1.2.0 | 外部 | MIT | 代码清理、重构自动化和技术债务管理,支持上下文恢复 |
| code-review-ai | 1.2.0 | 外部 | MIT | AI 驱动的架构审查和代码质量分析 |
| codebase-cleanup | 1.2.0 | 外部 | MIT | 技术债务削减、依赖更新和代码重构自动化 |
| comprehensive-review | 1.2.1 | 外部 | MIT | 多维度代码分析,覆盖架构、安全性和最佳实践 |
| content-marketing | 1.2.0 | 外部 | MIT | 内容营销策略、网络调研和信息综合处理的营销运营工具 |
| context-management | 1.2.0 | 外部 | MIT | 上下文持久化、恢复和长期对话管理 |
| database-cloud-optimization | 1.2.0 | 外部 | MIT | 数据库查询优化、云成本优化和可扩展性改进 |
| database-migrations | 1.2.0 | 外部 | MIT | 数据库迁移自动化、可观测性和跨数据库迁移策略 |
| deployment-strategies | 1.2.0 | 外部 | MIT | 部署模式、回滚自动化和基础设施模板 |
| deployment-validation | 1.2.0 | 外部 | MIT | 部署前检查、配置验证和部署就绪性评估 |
| distributed-debugging | 1.2.0 | 外部 | MIT | 分布式系统追踪与微服务调试工具 |
| documentation-generation | 1.2.1 | 外部 | MIT | OpenAPI规范生成、Mermaid图表创建、教程编写、API参考文档 |
| error-debugging | 1.2.0 | 外部 | MIT | 错误分析、堆栈追踪调试和多智能体问题诊断 |
| error-diagnostics | 1.2.0 | 外部 | MIT | 错误追踪、根因分析及生产系统智能调试 |
| hr-legal-compliance | 1.2.1 | 外部 | MIT | 人力资源政策文档、法律合规模板（GDPR/SOC2/HIPAA）、雇佣合同及监管文件 |
| jvm-languages | 1.2.0 | 外部 | MIT | JVM 语言开发，包括 Java、Scala 和 C#，涵盖企业级模式和框架 |
| multi-platform-apps | 1.2.1 | 外部 | MIT | 跨平台应用开发,协调 Web、iOS、Android 和桌面端的实现 |
| observability-monitoring | 1.2.1 | 外部 | MIT | 指标收集、日志基础设施、分布式追踪、SLO 实施和监控仪表板 |
| payment-processing | 1.2.1 | 外部 | MIT | 支付网关集成,包含 Stripe 和 PayPal,实现结账流程、订阅计费和 PCI 合规性 |
| python-development | 1.2.1 | 外部 | MIT | 现代 Python 开发工具，支持 Python 3.12+、Django、FastAPI、异步编程模式及生产环境最佳实践 |
| quantitative-trading | 1.2.1 | 外部 | MIT | 量化分析、算法交易策略、金融建模、投资组合风险管理和回测 |
| security-compliance | 1.2.0 | 外部 | MIT | SOC2、HIPAA 和 GDPR 合规性验证、密钥扫描、合规性检查清单和监管文档 |
| seo-analysis-monitoring | 1.2.0 | 外部 | MIT | SEO 内容新鲜度分析、关键词竞食检测和权威建设 |
| seo-content-creation | 1.2.0 | 外部 | MIT | SEO 内容创作、规划与质量审计工具，支持 E-E-A-T 优化 |
| seo-technical-optimization | 1.2.0 | 外部 | MIT | 技术SEO优化,包括元标签、关键词、结构和精选摘要 |
| systems-programming | 1.2.1 | 外部 | MIT | 使用 Rust、Go、C 和 C++ 进行系统编程，适用于性能关键和底层开发 |
| web-scripting | 1.2.0 | 外部 | MIT | 使用 PHP 和 Ruby 进行 Web 脚本开发，支持 Web 应用、CMS 开发和后端服务 |
