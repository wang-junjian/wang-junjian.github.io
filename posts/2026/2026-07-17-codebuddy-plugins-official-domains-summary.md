---
type: article
title: "CodeBuddy 官方插件市场 · 四大领域插件"
date: 2026-07-17 20:11:00 +0800
tags: [workbuddy, codebuddy, agent, plugins, marketplace, coding, design, security, office]
---

> 数据来源：`codebuddy-plugins-official` 市场 manifest（共 207 个插件，2026-07-16）
> 整理口径：从 207 个插件中筛出 **软件开发生命周期、安全、办公、设计** 四个领域；一个插件只归入一个主领域，跨领域插件在说明中以「兼属 ××」标注；其余 32 个插件列入文末「未归入」。

**分类概览**：软件开发生命周期：134 | 安全：13 | 办公：15 | 设计：13 | 未归入：32

---

## 一、软件开发生命周期（134）

### 1.1 需求、规划与项目管理（8）

| 插件名 | 来源 | 说明 |
| --- | --- | --- |
| requirements-driven-workflow | 官方 | 需求驱动开发工作流，含 90% 质量门控的功能实现流程 |
| interview | 外部 | 访谈式命令，用于细化大型功能计划与规格 |
| conductor | 外部 | 上下文驱动开发：上下文 → 规格与计划 → 实施的结构化工作流 |
| agent-team-agile-workflow | 官方 | BMAD 敏捷工作流，含 PO、架构师、SM、开发、QA 角色代理与交互式审批 |
| taskmaster | 外部 | 基于 AI 的任务管理系统，提供命令、代理和 MCP 集成 |
| commands-project-setup | 外部 | 项目初始化与搭建命令 |
| commands-project-task-management | 外部 | 任务管理与项目跟踪命令 |
| feature-dev | 官方 | 全面功能开发工作流，含代码库探索、架构设计与质量审查智能体 |

### 1.2 架构与设计（软件架构）（7）

| 插件名 | 来源 | 说明 |
| --- | --- | --- |
| c4-architecture | 外部 | C4 架构文档工作流：代码分析、组件合成、容器映射与上下文图生成 |
| agents-development-architecture | 外部 | 软件架构、后端开发与系统设计专家代理 |
| api-scaffolding | 外部 | REST/GraphQL API 脚手架、框架选择与后端架构设计 |
| commands-api-development | 外部 | REST/GraphQL API 设计与文档化命令 |
| database-design | 外部 | 生产系统数据库架构、模式设计与 SQL 优化 |
| commands-database-operations | 外部 | 数据库模式设计、迁移与优化命令 |
| cloud-infrastructure | 外部 | 云架构设计（AWS/Azure/GCP）、K8s 配置、Terraform IaC 与多云成本优化 |

### 1.3 语言与编码支持（22）

| 插件名 | 来源 | 说明 |
| --- | --- | --- |
| clangd-lsp | 官方 | C/C++ 语言服务器，提供代码智能、重构与分析 |
| csharp-lsp | 官方 | C# 语言服务器 |
| gopls-lsp | 官方 | Go 语言服务器 |
| jdtls-lsp | 官方 | Java 语言服务器 |
| lua-lsp | 官方 | Lua 语言服务器 |
| php-lsp | 官方 | PHP 语言服务器（Intelephense），代码智能与诊断 |
| pyright-lsp | 官方 | Python 语言服务器（Pyright），类型检查与代码智能 |
| rust-analyzer-lsp | 官方 | Rust 语言服务器 |
| serena | 官方 | 语义代码分析 MCP 服务器：代码理解、重构建议与代码库导航 |
| swift-lsp | 官方 | Swift 语言服务器（SourceKit-LSP） |
| typescript-lsp | 官方 | TypeScript/JavaScript 语言服务器 |
| javascript-typescript | 外部 | JS/TS 开发：ES6+、Node.js、React 及现代 Web 框架 |
| functional-programming | 外部 | 函数式语言专家代理（Haskell、Elixir 等） |
| python-development | 外部 | 现代 Python（3.12+）、Django、FastAPI、异步模式与生产实践 |
| jvm-languages | 外部 | JVM 语言（Java、Scala、C#）企业级模式与框架 |
| systems-programming | 外部 | Rust/Go/C/C++ 系统编程，面向性能关键与底层开发 |
| web-scripting | 外部 | PHP/Ruby Web 脚本、CMS 与后端服务开发 |
| julia-development | 外部 | Julia 1.10+ 开发、包管理、科学计算与高性能数值代码 |
| shell-scripting | 外部 | 生产级 Bash 脚本：防御性编程、POSIX 合规与全面测试 |
| arm-cortex-microcontrollers | 外部 | ARM Cortex-M 固件开发（Teensy、STM32、nRF52、SAMD） |
| nextjs-expert | 外部 | Next.js 开发专长：App Router、Server Components、路由等 |
| payload | 外部 | Payload 开发指导：TypeScript 模式、字段配置、钩子与访问控制 |

### 1.4 前端、移动与框架迁移（5）

| 插件名 | 来源 | 说明 |
| --- | --- | --- |
| frontend-mobile-development | 外部 | 跨平台前端 UI 开发与移动应用实现 |
| multi-platform-apps | 外部 | 跨平台应用开发，协调 Web、iOS、Android 与桌面端实现 |
| commands-framework-svelte | 外部 | Svelte/SvelteKit 开发专用命令 |
| commands-typescript-migration | 外部 | JavaScript 项目迁移 TypeScript 命令 |
| framework-migration | 外部 | 框架升级、迁移规划与架构转型工作流 |

### 1.5 后端、数据、AI 与云平台（12）

| 插件名 | 来源 | 说明 |
| --- | --- | --- |
| backend-development | 外部 | 后端 API 设计、GraphQL 架构、Temporal 工作流编排与 TDD |
| data-engineering | 外部 | ETL 管道构建、数据仓库设计与批处理工作流 |
| machine-learning-ops | 外部 | MLOps 工具包：ML 工程与 MLOps 基础设施专家代理 |
| llm-application-dev | 外部 | 生产级 LLM 应用、高级 RAG 系统与智能代理开发 |
| agents-data-ai | 外部 | 数据工程、机器学习与 AI 开发代理 |
| cloudbase | 官方 | CloudBase AI 全栈开发：Web、小程序、云函数、数据库、云存储、AI 模型 |
| firebase | 官方 | Firebase MCP 服务器，管理 Firestore 数据 |
| supabase | 官方 | Supabase MCP 集成：数据库、身份验证、存储与实时订阅 |
| tmap-lbs-plugin | 官方 | 腾讯地图位置服务开发：JS GL 地图、POI 搜索、路径规划、轨迹可视化 |
| payment-processing | 外部 | 支付网关集成（Stripe/PayPal）、订阅计费与 PCI 合规（兼属：安全） |
| blockchain-web3 | 外部 | Solidity 智能合约、DeFi 协议、NFT 平台与 Web3 应用架构 |
| agents-blockchain-web3 | 外部 | 区块链开发、智能合约与 Web3 应用专用代理 |

### 1.6 插件与生态扩展开发（5）

| 插件名 | 来源 | 说明 |
| --- | --- | --- |
| mcp-builder | 外部 | 高质量 MCP 服务器创建指南（Python/TypeScript），用于集成外部 API 与 LLM |
| plugin-dev | 官方 | CodeBuddy 插件开发工具包：钩子、MCP 集成、命令、代理等 7 个专家技能 |
| agent-sdk-dev | 官方 | CodeBuddy Agent SDK 应用创建与验证（Python/TypeScript） |
| skill-creator | 外部 | Claude 技能创建指南：专业知识、工作流与工具集成 |
| agent-orchestration | 外部 | 多智能体系统优化、智能体改进工作流与上下文管理 |

### 1.7 测试与质量保障（11）

| 插件名 | 来源 | 说明 |
| --- | --- | --- |
| testbuddy | 官方 | 测试用例生成插件 |
| unit-testing | 外部 | Python/JavaScript 单元测试与集成测试自动化，支持调试 |
| tdd-workflows | 外部 | 测试驱动开发：红-绿-重构循环与代码审查 |
| webapp-testing | 外部 | 用 Playwright 测试本地 Web 应用、调试 UI 行为与捕获截图 |
| playwright-cli | 官方 | 基于 Playwright 的 CLI 浏览器自动化：导航、交互、表单、截图、网络拦截与会话管理 |
| agent-browser | 官方 | agent-browser CLI 浏览器自动化：网页交互、截图、表单填写 |
| api-testing-observability | 外部 | API 测试自动化、请求模拟、OpenAPI 文档生成与可观测性配置 |
| data-validation-suite | 外部 | 模式验证、数据质量监控、流式验证管道与后端 API 输入验证 |
| performance-testing-review | 外部 | 性能分析、测试覆盖率审查与 AI 驱动的代码质量评估 |
| hooks-testing | 外部 | 测试相关事件驱动自动化钩子 |
| commands-code-analysis-testing | 外部 | 代码审查、测试与分析命令 |

### 1.8 评审、重构与技术债（6）

| 插件名 | 来源 | 说明 |
| --- | --- | --- |
| pr-review-toolkit | 官方 | PR 审查代理工具集：代码注释、测试覆盖、错误处理、类型设计与代码简化 |
| code-review-ai | 外部 | AI 驱动的架构审查与代码质量分析 |
| comprehensive-review | 外部 | 多维度代码分析：架构、安全性与最佳实践（兼属：安全） |
| code-simplifier | 官方 | 代码简化代理：提升清晰度、一致性与可维护性，聚焦近期修改 |
| code-refactoring | 外部 | 代码清理、重构自动化与技术债务管理，支持上下文恢复 |
| codebase-cleanup | 外部 | 技术债务削减、依赖更新与代码重构自动化 |

### 1.9 调试与诊断（6）

| 插件名 | 来源 | 说明 |
| --- | --- | --- |
| debugging-toolkit | 外部 | 交互式调试、开发者体验优化与智能调试工作流 |
| error-debugging | 外部 | 错误分析、堆栈追踪调试与多智能体问题诊断 |
| error-diagnostics | 外部 | 错误追踪、根因分析及生产系统智能调试 |
| distributed-debugging | 外部 | 分布式系统追踪与微服务调试工具 |
| commands-utilities-debugging | 外部 | 通用调试与实用工具命令 |
| superpowers-chrome | 外部 | 超轻量 Chrome DevTools Protocol MCP 服务器，支持自动捕获 |

### 1.10 版本控制与团队协作（10）

| 插件名 | 来源 | 说明 |
| --- | --- | --- |
| github | 官方 | GitHub MCP 服务器：仓库、Issue、PR、搜索管理 |
| gitlab | 官方 | GitLab MCP 服务器：项目、Issue、合并请求管理 |
| commit-commands | 官方 | 高效 Git 工作流命令，简化暂存、提交与推送 |
| git-pr-workflows | 外部 | Git 工作流自动化、PR 增强与团队入职流程 |
| commands-version-control-git | 外部 | Git 操作、提交与 PR 命令 |
| hooks-git | 外部 | Git 事件驱动自动化钩子 |
| team-collaboration | 外部 | 团队工作流、问题管理、站会自动化与开发者体验优化 |
| commands-team-collaboration | 外部 | 团队工作流、PR 审查与协作命令 |
| changelog-generator | 外部 | 从 Git 提交历史自动生成面向用户的变更日志/发布说明 |
| commands-documentation-changelogs | 外部 | 文档生成与变更日志管理命令 |

### 1.11 CI/CD、部署与运维（14）

| 插件名 | 来源 | 说明 |
| --- | --- | --- |
| cicd-automation | 外部 | CI/CD 流水线配置、GitHub Actions/GitLab CI 工作流与自动化部署编排 |
| commands-ci-deployment | 外部 | CI/CD 搭建、容器化与部署自动化命令 |
| deployment-strategies | 外部 | 部署模式、回滚自动化与基础设施模板 |
| deployment-validation | 外部 | 部署前检查、配置验证与部署就绪性评估 |
| kubernetes-operations | 外部 | K8s 清单生成、网络配置、安全策略、可观测性、GitOps 与自动扩缩容 |
| agents-infrastructure-operations | 外部 | 云基础设施、DevOps 与数据库运维代理 |
| incident-response | 外部 | 生产事故管理、分级处理工作流与自动化事故解决方案 |
| observability-monitoring | 外部 | 指标收集、日志基础设施、分布式追踪、SLO 实施与监控仪表板 |
| commands-monitoring-observability | 外部 | 监控与可观测性搭建命令 |
| application-performance | 外部 | 应用性能工程专家代理：优化、可观测性等 |
| commands-performance-optimization | 外部 | 构建、包体积与性能优化命令 |
| hooks-performance | 外部 | 性能相关事件驱动自动化钩子 |
| database-cloud-optimization | 外部 | 数据库查询优化、云成本优化与可扩展性改进 |
| database-migrations | 外部 | 数据库迁移自动化、可观测性与跨数据库迁移策略 |

### 1.12 技术文档与项目知识（4）

| 插件名 | 来源 | 说明 |
| --- | --- | --- |
| code-documentation | 外部 | 文档生成、代码解释与技术写作，支持自动化文档与教程创建 |
| documentation-generation | 外部 | OpenAPI 规范生成、Mermaid 图表、教程编写与 API 参考文档 |
| context7 | 官方 | 通过 MCP 查询任意编程库的最新文档与代码示例 |
| codebuddy-md-management | 官方 | CODEBUDDY.md 项目记忆的维护：质量审核、会话学习内容捕获与更新 |

### 1.13 代码库分析与上下文管理（6）

| 插件名 | 来源 | 说明 |
| --- | --- | --- |
| repomix-mcp | 外部 | Repomix MCP 服务器：打包本地/远程仓库、搜索输出、读取文件并内置安全扫描 |
| repomix-commands | 外部 | Repomix 斜杠命令：/pack-local、/pack-remote 快速打包仓库 |
| repomix-explorer | 外部 | 在 CodeBuddy Code 中用 Repomix 探索与分析仓库结构 |
| context-management | 外部 | 上下文持久化、恢复与长期对话管理 |
| commands-context-loading-priming | 外部 | 为特定任务加载上下文与预热的命令 |
| ralph-loop | 官方 | 迭代开发的自引用 AI 循环（Ralph Wiggum 技术），重复执行直至完成 |

### 1.14 通用开发流程与自动化（13）

| 插件名 | 来源 | 说明 |
| --- | --- | --- |
| superpowers | 外部 | Claude Code 核心技能库：TDD、系统化调试、协作模式与经验证的技术方法 |
| developer-essentials | 外部 | 核心开发技能集：Git、SQL 优化、错误处理、代码审查、E2E 测试、认证、调试、Monorepo |
| development-essentials | 官方 | 核心开发命令集：编码、调试、测试、优化与文档生成 |
| full-stack-orchestration | 外部 | 全栈功能开发编排，含测试自动化等专家代理 |
| commands-automation-workflow | 外部 | 重复性任务与工作流自动化命令 |
| commands-integration-sync | 外部 | 外部服务集成与数据同步命令 |
| commands-workflow-orchestration | 外部 | 复杂工作流编排命令 |
| hookify | 官方 | 创建与管理自定义钩子，自动化工作流 |
| hooks-automation | 外部 | 通用事件驱动自动化钩子 |
| hooks-development | 外部 | 开发事件驱动自动化钩子 |
| hooks-formatting | 外部 | 代码格式化自动化钩子 |
| hooks-notifications | 外部 | 通知自动化钩子 |
| agents-language-specialists | 外部 | 特定编程语言（Python、Go、Rust 等）专家代理 |

### 1.15 游戏开发（5）

| 插件名 | 来源 | 说明 |
| --- | --- | --- |
| commands-game-development | 外部 | 游戏开发工作流命令 |
| game-development | 外部 | Unity 游戏开发与 C# 脚本、Minecraft 服务器插件（Bukkit/Spigot API）开发 |
| godot-mcp | 官方 | Godot 4 MCP 集成：场景管理、节点操作、脚本编辑、项目运行 |
| magicai-hub | 官方 | Godot 4.x AI 技能包：GDScript 生成、数据驱动配置、资源解析、无头验证等 |
| weixin-minigame-helper | 官方 | 微信小游戏 AI 调试、预览、运行、真机测试与上传发布 |

---

## 二、安全（13）

### 2.1 代码与 Skill 安全审计（5）

| 插件名 | 来源 | 说明 |
| --- | --- | --- |
| security-scan | 官方 | 云鼎实验室代码安全审计：Fast/Light/Deep 三种扫描模式，基于 SQLite 语义索引 |
| atuin | 官方 | 腾讯玄武实验室安全插件 |
| security-guidance | 官方 | 编辑文件时的安全提醒钩子：命令注入、XSS 与不安全的代码模式 |
| skills-security-check | 官方 | 云鼎实验室 Skill 安全审查：对 skill.md 及配套文档、程序、脚本全面审计 |
| agents-quality-security | 外部 | 代码审查、安全审计、调试与质量保障代理（兼属：软件开发生命周期） |

### 2.2 供应链与依赖安全（2）

| 插件名 | 来源 | 说明 |
| --- | --- | --- |
| chainguard | 官方 | 云鼎实验室 AI 编程供应链防护：拦截依赖安装进行安全审计，检测漏洞组件、License 合规及 SBOM 白名单 |
| dependency-management | 外部 | 依赖审计、版本管理与安全漏洞扫描（兼属：软件开发生命周期） |

### 2.3 应用与全栈安全（3）

| 插件名 | 来源 | 说明 |
| --- | --- | --- |
| security-rules | 官方 | 云鼎实验室安全规则融入代码生成：常见漏洞防护规则与安全函数约束，从源头生成安全代码 |
| frontend-mobile-security | 外部 | 前端与移动开发安全代理，含 XSS 漏洞等检测 |
| backend-api-security | 外部 | API 安全加固：身份验证、授权模式、速率限制与输入验证 |

### 2.4 合规与自动化钩子（3）

| 插件名 | 来源 | 说明 |
| --- | --- | --- |
| security-compliance | 外部 | SOC2、HIPAA、GDPR 合规验证、密钥扫描、合规检查清单与监管文档 |
| commands-security-audit | 外部 | 安全审计与漏洞扫描命令 |
| hooks-security | 外部 | 安全事件驱动自动化钩子 |

---

## 三、办公（15）

### 3.1 办公文档处理（5）

| 插件名 | 来源 | 说明 |
| --- | --- | --- |
| docx | 官方 | Word 文档创建、编辑与分析：修订跟踪、评论、格式保留与文本提取 |
| xlsx | 官方 | 电子表格创建、编辑与分析：公式、格式化、数据分析与可视化（.xlsx/.xlsm/.csv/.tsv） |
| pptx | 官方 | PowerPoint 演示文稿创建、编辑与分析：布局处理、注释与演讲者备注 |
| ppt-writer | 官方 | AI 驱动的 PPT 创作助手：智能内容生成、多格式导出与专业模板 |
| pdf | 官方 | PDF 工具包：文本/表格提取、创建、合并/拆分、表单填写、加密解密、OCR 扫描 |

### 3.2 在线协作与知识库（4）

| 插件名 | 来源 | 说明 |
| --- | --- | --- |
| tencent-docs | 官方 | 腾讯文档操作：创建各类在线文档、查询搜索、空间节点管理、智能表与智能文档读写 |
| lexiang-knowledge | 官方 | 乐享企业协同知识库：文档读写、内容搜索、目录结构、标签评论、文件与附件管理 |
| doc-coauthoring | 官方 | 结构化协作写作工作流：文档、提案、技术规格、决策文档（兼属：软件开发生命周期） |
| obsidian-skills | 外部 | Obsidian 文件技能：含 wikilinks、嵌入等 Markdown 操作 |

### 3.3 职场文书与会议（4）

| 插件名 | 来源 | 说明 |
| --- | --- | --- |
| internal-comms | 外部 | 内部沟通文档撰写：三要素更新、公司通讯、FAQ、状态报告与项目更新 |
| meeting-insights-analyzer | 外部 | 会议记录分析：冲突回避、发言比例、填充词使用与领导风格等行为模式 |
| tailored-resume-generator | 外部 | 分析职位描述并生成定制简历，突出相关经验与成就 |
| hr-legal-compliance | 外部 | HR 政策文档、法律合规模板（GDPR/SOC2/HIPAA）、雇佣合同与监管文件（兼属：安全） |

### 3.4 事务工具（2）

| 插件名 | 来源 | 说明 |
| --- | --- | --- |
| invoice-organizer | 外部 | 发票整理工具 |
| raffle-winner-picker | 外部 | 从列表、电子表格或 Google Sheets 随机抽奖，采用密码学安全的随机性 |

---

## 四、设计（13）

### 4.1 UI/UX 与界面设计（5）

| 插件名 | 来源 | 说明 |
| --- | --- | --- |
| frontend-design | 官方 | 创建独特的生产级前端界面，高设计质量，避免千篇一律的 AI 审美（兼属：软件开发生命周期） |
| frontend-design-pro | 外部 | 高级前端设计插件：交互式向导、趋势研究、情绪板等（兼属：软件开发生命周期） |
| ui-ux-pro-max-skill | 外部 | AI 驱动的 UI/UX 设计系统生成器，含 100+ 行业推理规则 |
| agents-design-experience | 外部 | UI/UX 设计、无障碍与用户体验优化代理 |
| accessibility-compliance | 外部 | WCAG 无障碍审计、合规验证、屏幕阅读器 UI 测试、键盘导航与包容性设计（兼属：软件开发生命周期） |

### 4.2 前端制品构建（1）

| 插件名 | 来源 | 说明 |
| --- | --- | --- |
| web-artifacts-builder | 官方 | 用 React、Tailwind CSS、shadcn/ui 创建复杂多组件 HTML 工件，支持状态管理与路由（兼属：软件开发生命周期） |

### 4.3 品牌、图标与主题（3）

| 插件名 | 来源 | 说明 |
| --- | --- | --- |
| brand-guidelines | 外部 | 将品牌配色与排版规范应用于工件，确保视觉识别一致与专业设计标准 |
| lucide-icons | 官方 | 搜索、下载与自定义 Lucide 图标（1000+ SVG），支持生成 React 组件 |
| theme-factory | 外部 | 10 套预设字体与配色主题，应用于演示文稿、文档、报告与 HTML 落地页（兼属：办公） |

### 4.4 视觉艺术与图像处理（4）

| 插件名 | 来源 | 说明 |
| --- | --- | --- |
| canvas-design | 外部 | 以设计哲学与美学原则创建视觉艺术作品：海报、设计稿与静态艺术品，输出 PNG/PDF |
| algorithmic-art | 官方 | 用 p5.js 创建算法艺术：生成艺术、流场、粒子系统，支持种子随机与交互式参数 |
| image-enhancer | 外部 | 提升图像与截图的分辨率、锐度与清晰度，适用于专业演示文稿与文档（兼属：办公） |
| slack-gif-creator | 外部 | 创建针对 Slack 优化的动画 GIF：文件大小约束验证与可组合动画基元 |

---

## 五、未归入四大领域的插件（32）

### 5.1 商业分析与金融（5）

| 插件名 | 来源 | 说明 |
| --- | --- | --- |
| startup-business-analyst | 外部 | 初创企业综合业务分析：市场规模分析（TAM/SAM/SOM）、财务建模、团队规划与战略研究 |
| agents-business-finance | 外部 | 商业分析、财务建模与 KPI 跟踪代理 |
| business-analytics | 外部 | 业务指标分析、KPI 跟踪、财务报告与数据驱动的决策制定 |
| quantitative-trading | 外部 | 量化分析、算法交易策略、金融建模、投资组合风险管理与回测 |
| agents-crypto-trading | 外部 | 加密货币交易、DeFi 策略与市场分析专家代理 |

### 5.2 营销、销售与 SEO（10）

| 插件名 | 来源 | 说明 |
| --- | --- | --- |
| agents-sales-marketing | 外部 | 内容营销、客户支持与销售自动化代理 |
| customer-sales-automation | 外部 | 客户支持工作流自动化、销售管道管理、邮件营销活动与 CRM 系统集成 |
| content-marketing | 外部 | 内容营销策略、网络调研与信息综合处理的营销运营工具 |
| competitive-ads-extractor | 外部 | 从广告库提取并分析竞争对手广告，洞察能引发共鸣的营销信息与创意方法 |
| lead-research-assistant | 外部 | 分析产品、搜索目标公司并提供可行联系策略，识别筛选高质量潜在客户 |
| content-research-writer | 外部 | 高质量内容写作协助：研究调查、添加引用、改进开篇、逐节反馈 |
| domain-name-brainstormer | 外部 | 为项目生成创意域名并检查 .com、.io、.dev、.ai 等顶级域名可用性 |
| seo-analysis-monitoring | 外部 | SEO 内容新鲜度分析、关键词竞食检测与权威建设 |
| seo-content-creation | 外部 | SEO 内容创作、规划与质量审计，支持 E-E-A-T 优化 |
| seo-technical-optimization | 外部 | 技术 SEO 优化：元标签、关键词、结构与精选摘要 |

### 5.3 元工具与大合集（14）

| 插件名 | 来源 | 说明 |
| --- | --- | --- |
| find-skills | 官方 | AI Agent 技能发现与安装，支持 Vercel Skills 和 ClawHub 两个技能仓库 |
| hot-skills | 官方 | 精选热门 AI Agent 技能合集，汇集社区高下载量技能于一处 |
| plugin-finder | 官方 | 智能插件发现与管理助手：智能搜索、多插件并行对比、多插件协同工作流（sequence-run）、插件详解、许愿新插件 |
| all-agents | 外部 | 11 个类别共 117 个专用 AI 代理完整合集 |
| all-commands | 外部 | 22 个类别共 174 个斜杠命令完整合集 |
| all-hooks | 外部 | 28 个事件驱动自动化钩子完整合集 |
| all-skills | 外部 | 26 个 Claude Code 技能完整合集，覆盖文档处理、开发等 |
| oh-my-codebuddy | 官方 | 完整的 OMC（Oh My CodeBuddy）插件：含 agents、commands、skills、hooks、tools 与 MCP 服务器 |
| mcp-servers-docker | 外部 | Docker 官方 MCP 注册表的 Docker 化 MCP 服务器，含 199+ 个 |
| agents-specialized-domains | 外部 | 研究、文档与专门任务的领域专家代理合集 |
| scientific-skills | 外部 | 139 个即用科学技能合集 |
| template-skill | 外部 | 演示如何创建新 Claude 技能的结构与格式的模板技能 |
| claude-hud | 外部 | Claude Code 实时状态栏 HUD：显示上下文用量、工具活动等 |
| developer-growth-analysis | 外部 | 分析近期 Claude Code 聊天历史，识别编码模式与能力缺口，生成个性化成长报告 |

### 5.4 通用工具（3）

| 插件名 | 来源 | 说明 |
| --- | --- | --- |
| commands-miscellaneous | 外部 | 通用实用命令 |
| commands-simulation-modeling | 外部 | 情景模拟与决策建模命令 |
| video-downloader | 外部 | 从 YouTube 等平台下载视频：多种格式与画质，支持离线观看、编辑或存档 |

---

## 附：跨领域插件速查

| 插件名 | 主归类 | 兼属领域 |
| --- | --- | --- |
| agents-quality-security | 安全 | 软件开发生命周期（质量保障） |
| dependency-management | 安全 | 软件开发生命周期（依赖管理） |
| comprehensive-review | 软件开发生命周期 | 安全（安全性分析） |
| payment-processing | 软件开发生命周期 | 安全（PCI 合规） |
| hr-legal-compliance | 办公 | 安全（法规合规） |
| doc-coauthoring | 办公 | 软件开发生命周期（技术文档） |
| theme-factory | 设计 | 办公（文档/演示美化） |
| image-enhancer | 设计 | 办公（文档配图增强） |
| frontend-design / frontend-design-pro / web-artifacts-builder | 设计 | 软件开发生命周期（前端实现） |
| accessibility-compliance | 设计 | 软件开发生命周期（前端测试） |
