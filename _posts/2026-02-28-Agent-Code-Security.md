---
layout: single
title:  "Agent 代码安全扫描、修复与渗透测试工具推荐"
date:   2026-02-28 12:00:00 +0800
categories: Agent 安全
tags: [Agent, 安全, 代码扫描, 自动修复, 渗透测试]
---

<!--more-->

## LLM/Agent 代码安全扫描 + 自动修复（扫描代码安全、修复）
这些项目用 LLM 驱动 Agent 动态运行/分析代码，找出真实漏洞并生成修复方案（远超传统静态扫描）。

**首推：Strix**（⭐ 20.6k）  
- **链接**：https://github.com/usestrix/strix  
- **核心功能**：自主 AI “黑客” Agent，动态运行你的代码/应用 → 发现 IDOR、注入、XSS、权限绕过、业务逻辑漏洞等 → 自动生成 PoC 验证 → 一键输出可合并的 PR 修复补丁。  
- 支持 GitHub repo / 本地目录 / 线上 URL 扫描，多 Agent 协作、浏览器自动化、完整工具链。  
- 支持 OpenAI、Claude、Gemini、本地 LLM（LiteLLM）。  
- 安装一行命令：`curl -sSL https://strix.ai/install | bash`  
- 非常适合 CI/CD 集成，已有 GitHub Actions 示例。  
- **强烈推荐**，目前最成熟的“找漏洞+自动修复”方案。

## LLM/Agent 模拟渗透测试（自主黑盒/白盒渗透）
这些项目让 LLM Agent 像真实渗透测试员一样：规划 → 执行工具 → 分析结果 → 迭代攻击。

**首推：PentestGPT**（⭐ 11.8k）  
- **链接**：https://github.com/GreyDGL/PentestGPT  
- 经典之作，Agentic 框架，专为渗透测试和 CTF 设计。  
- 支持 Web、Crypto、PWN、逆向、取证等全类别；实时交互界面、可保存会话、本地 LLM（Ollama/LM Studio）支持。  
- Docker 一键部署，已内置大量安全工具。  
- 基准测试成功率 86.5%，非常成熟。

**PentAGI**（⭐ 8.5k）  
- **链接**：https://github.com/vxcontrol/pentagi  
- **全自主多 Agent 系统**：研究 Agent + 执行 Agent + 开发者 Agent 协作，内置 nmap、Metasploit、sqlmap 等 20+ 工具。  
- 有 Web UI、知识图谱、详细报告、Docker 沙箱隔离。  
- 支持 OpenAI/Anthropic/Ollama，自托管友好。  
- 适合复杂、长时间的自动化红队任务。

## 使用建议
- **想同时扫描代码 + 自动修复** → 直接上 **Strix**。
- **想模拟完整渗透测试流程** → **PentestGPT**（简单易上手）或 **PentAGI**（功能最全）。
- 全部都支持本地/开源 LLM，注意合规使用（仅授权目标）。
- 大部分项目都有 Docker，一键启动。
