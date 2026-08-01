---
type: article
title: "基于 Strix 的 JavaSecLab 源代码深度渗透测试报告"
date: 2026-08-01 15:21:00 +0800
tags: [strix, javaseclab, agent, llm, security, fix, hacker]
---

![](/images/2026/strix/strix-scan-mode-deep-javaseclab.webp)

本文档基于Strix 多智能体网络安全渗透测试工具，对开源 Java 漏洞实训平台 JavaSecLab 开展深度白盒代码审计与系统性安全渗透测试。依托 Strix 多智能体协同检测能力，本次测试覆盖项目全部源代码、框架配置、业务逻辑及第三方依赖组件，完整挖掘、归类、验证项目内置的各类安全漏洞。

JavaSecLab 作为面向安全学习、代码审计、安全开发与工具测评的综合型 Java 漏洞靶场，集中复现了 Web 安全、代码缺陷、组件漏洞、业务逻辑风险等大量典型安全问题。本次通过 Strix 深度扫描模式，完成全量代码静态分析、漏洞溯源、数据流审计、风险定级与攻击路径复盘，累计检出严重、高危、中危、低危多维度安全漏洞，覆盖反序列化 RCE、SQL 注入、认证绕过、SSRF、XXE、XSS、模板注入、文件操作漏洞及第三方依赖高危 CVE 等核心风险场景。


## Strix 命令行帮助文档

```
用法: strix [-h] [-v] [--update] [-t TARGET] [--target-list PATH] [--mount PATH] [--instruction INSTRUCTION] [--instruction-file INSTRUCTION_FILE] [-n] [-m {quick,standard,deep}]
             [--scope-mode {auto,diff,full}] [--diff-base DIFF_BASE] [--config CONFIG] [--max-budget-usd MAX_BUDGET_USD] [--resume RUN_NAME]

Strix 多智能体网络安全渗透测试工具

可选参数:
  -h, --help            显示帮助信息并退出
  -v, --version         显示程序版本号并退出
  --update              将 Strix 更新至最新版本后退出。独立二进制程序安装方式将执行自更新；若通过 pip/pipx/uv 安装，则输出对应的升级命令
  -t, --target TARGET   待测试目标（网址、代码仓库、本地目录路径、域名或IP地址）。可多次指定实现多目标扫描。全新扫描至少需要指定 --target、--target-list、--mount 其中一项
  --target-list PATH    指定目标清单文件路径，文件内每行填写一个目标，空行、注释行会被忽略。可多次使用，支持与 --target 混用
  --mount PATH          将本地目录以只读方式绑定挂载至沙箱（而非逐文件复制）。适用于体积过大、无法传输至容器的大型代码仓库。支持多次指定
  --instruction INSTRUCTION
                        渗透测试自定义指令。可指定重点排查漏洞类型（例如："重点检测IDOR与XSS漏洞"）、测试方案（例如："全面开展身份认证测试"）、测试账号凭证（例如："使用账号admin:password123访问应用"）或关注范围（例如："检测登录接口存在的安全问题"）
  --instruction-file INSTRUCTION_FILE
                        自定义指令文件路径。当测试指令冗长复杂时使用（示例：`--instruction-file ./detailed_instructions.txt`）
  -n, --non-interactive
                        非交互模式运行（不启动交互式文本界面，扫描完成后自动退出）。默认启用带文本交互界面的交互模式
  -m, --scan-mode {quick,standard,deep}
                        扫描模式：quick（快速，适用于CI/CD流水线检测）、standard（标准，日常常规测试）、deep（深度，全面安全审计，默认选项）。默认：deep
  --scope-mode {auto,diff,full}
                        代码类目标扫描范围模式：auto（自动，CI/后台无交互运行时启用仅对比代码变更范围）、diff（强制仅扫描变更文件）、full（完整扫描，关闭变更范围模式）
  --diff-base DIFF_BASE
                        用于代码对比的目标分支/提交哈希（例如：origin/main），默认使用代码仓库的默认分支
  --config CONFIG       自定义JSON配置文件路径，替代默认配置 ~/.strix/cli-config.json
  --max-budget-usd MAX_BUDGET_USD
                        LLM调用最大费用上限（美元，数值大于0）。到达限额后工具将正常终止扫描
  --resume RUN_NAME     根据任务名称恢复历史扫描（任务目录存放于 ./strix_runs/）。恢复主任务以及所有未结束子智能体的LLM对话记录与智能体任务拓扑，不再重新生成新任务名称

示例：
  # Web应用渗透测试
  strix --target https://example.com

  # GitHub代码仓库安全分析
  strix --target https://github.com/user/repo
  strix --target git@github.com:user/repo.git

  # 本地源代码分析
  strix --target ./my-project

  # 大型本地代码仓库（只读挂载，不复制文件）
  strix --mount ./huge-monorepo

  # 域名渗透测试
  strix --target example.com

  # IP地址渗透测试
  strix --target 192.168.1.42

  # 多目标并行测试（例如源代码+线上业务系统白盒测试）
  strix --target https://github.com/user/repo --target https://example.com
  strix --target ./my-project --target https://staging.example.com --target https://prod.example.com

  # 从目标清单文件加载目标，每行一个目标
  strix --target-list ./targets.txt

  # 行内写入自定义测试指令
  strix --target example.com --instruction "重点检测身份认证相关漏洞"

  # 从文件加载自定义测试指令
  strix --target example.com --instruction-file ./instructions.txt
  strix --target https://app.com --instruction-file /path/to/detailed_instructions.md
```


## [JavaSecLab](https://github.com/whgojp/JavaSecLab)

### 项目概览
**JavaSecLab** 是 whgojp 维护的**综合型 Java 漏洞实验平台**（Spring Boot 构建，当前 v1.5，Apache-2.0 许可）。它不只是漏洞靶场，而是把"漏洞代码 + 修复代码 + 真实攻击场景 + source-to-sink 审计注释 + 流量分析示例"打包在一起，理念是让使用者从**代码视角**理解漏洞成因与修复，而非只看 PoC。

### 关键要点
- **覆盖极广**：XSS/CSRF/CORS、SQLi、文件任意读写、SSRF、XXE、RCE、IDOR、验证码/支付/并发安全、SpEL/SSTI/反序列化，以及 **Fastjson、Jackson、Log4j2、Shiro、SnakeYAML、XMLDecoder** 等组件案例，还有 Swagger/Actuator/Druid 等 Spring Boot 生态暴露。同类漏洞尽量给**多条触发路径**对比。
- **面向四类人群**：安全服务团队（解释成因）、企业安全团队（SDL/DevSecOps 培训）、安全研究员（验证 SAST/DAST/IAST/RASP 工具）、Java 开发者（从真实代码学安全）。
- **技术栈**：Spring Boot + Spring Security + MyBatis/MyBatis-Plus + JPA/Hibernate + Thymeleaf + Layui + MySQL；JDK 8、Maven、Docker Compose。
- **部署**：IDEA 本地（导入 `sql/JavaSecLab.sql` + 激活 `dev` profile）或 `docker-compose` 一键启动；官方在线 Demo 在 http://whgojp.top/（admin/admin）。
- **安全红线（项目明确声明）**：刻意保留危险端点与漏洞依赖，**仅限隔离/本地环境运行，严禁暴露公网**。


## JavaSecLab 安全渗透测试

### 克隆 JavaSecLab

```bash
git clone https://github.com/whgojp/JavaSecLab
```

### 深度安全审计执行

```bash
strix -n --target ./JavaSecLab --instruction "使用中文回复" --scan-mode deep
```

### 深度审计结果汇总

```bash
╭─ STRIX ───────────────────────────────────────────────────────────────────────────────────────────────────╮
│                                                                                                           │
│  Penetration test completed                                                                               │
│                                                                                                           │
│  Target  /Users/junjian/GitHub/JavaSecLab                                                                 │
│  Vulnerabilities  CRITICAL: 25 | HIGH: 28 | MEDIUM: 27 (Total: 80)                                        │
│                                                                                                           │
│  Input Tokens 21.2M  ·  Cached Tokens 16.0M  ·  Output Tokens 252.3K                                      │
│                                                                                                           │
│  Output  /Users/junjian/strix/strix_runs/javaseclab                                                       │
│                                                                                                           │
│  View         strix view javaseclab                                                                       │
│                                                                                                           │
╰───────────────────────────────────────────────────────────────────────────────────────────────────────────╯
```


## Strix 渗透测试输出目录结构

整个结果目录可以分成 **3 类：给人看的报告、给机器/工具用的数据、Strix 内部运行状态**。

### 一、给人看的报告（直接读这些）

| 文件 | 大小 | 是什么 |
|------|------|--------|
| **`penetration_test_report.md`** | 14 KB | **主报告**，包含执行摘要、方法论、漏洞分类统计、系统性根因分析、典型攻击路径、分 P0/P1/P2 的修复建议。先看这个。 |
| **`vulnerabilities/`** | 80 个 `.md` | **每条漏洞的详情页**。命名 `vuln-0001.md` ~ `vuln-0080.md`，每个都含：描述、严重度/CWE/CVSS、证据（含可复现请求和 PoC 代码）、代码定位（文件+行号）、修复 diff、前提假设。这是最有用的部分。 |
| **`strix.log`** | 915 KB | **原始运行日志**。Strix 整个扫描过程的流水记录（智能体调度、工具调用、提示词往返等）。排查"为什么报/没报某项"时翻它。 |

### 二、给机器/工具用的数据（导入 CI、二次处理）

| 文件 | 大小 | 是什么 |
|------|------|--------|
| **`findings.sarif`** | 537 KB | **SARIF 2.1.0 标准格式**（行业通用的静态分析结果交换格式）。可被 GitHub code scanning、GitLab、VS Code SARIF 查看器等直接导入，也能喂给别的扫描器做对比。**适合接 CI。** |
| **`vulnerabilities.json`** | 410 KB | **80 条漏洞的结构化全集**（JSON）。字段比 CSV 全，含每条的完整元数据。做统计、建看板、写脚本时用它。 |
| **`vulnerabilities.csv`** | 9.5 KB | **漏洞索引表**。只有 5 列：`id, title, severity, timestamp, file`。一眼看全貌、做透视表最方便，但信息最薄。 |
| **`run.json`** | 195 KB | **本次运行的全部元数据**：`run_id`、起止时间、扫描模式（deep/auto）、鉴权方式、目标路径、LLM 用量（306 次调用 / 约 21.5M tokens）、8 个智能体信息，以及 `scan_results`（执行摘要/方法论/技术分析/建议的原文）。相当于这次任务的"档案"。 |

### 三、Strix 内部运行状态（一般不用管）

| 路径 | 是什么 |
|------|--------|
| **`.state/`** | 扫描过程中的内部状态目录，正常不需要碰。里面有：<br>• `agents.db`（2.5 MB，SQLite）— 智能体运行的底层数据库<br>• `agents.json` — 各审计子智能体的状态<br>• `notes.json` / `todos.json` — 智能体留下的笔记和任务清单 |

### 一句话怎么用

- **想快速了解全貌** → 读 `penetration_test_report.md` + `vulnerabilities.csv`
- **想看某条漏洞怎么打、怎么修** → 打开 `vulnerabilities/vuln-XXXX.md`
- **想接 CI / 做自动化 / 建看板** → 用 `findings.sarif` 或 `vulnerabilities.json`
- **想查"为什么这么报"** → 翻 `strix.log` 和 `run.json`


## Strix 渗透测试输出报告详情

### 主报告（`penetration_test_report.md`）

```md
# Security Penetration Test Report

**Generated:** 2026-07-29 01:31:59 UTC

# Executive Summary

# 执行摘要

## 概述

本次安全评估针对 **JavaSecLab**（Java 综合漏洞平台）进行了全面的源代码安全审计。该项目是一个基于 Spring Boot 的 Web 应用，包含 129 个 Java 文件，集成了多种常见安全漏洞用于教学演示。

## 整体风险状况：**严重**

评估共发现 **90+ 个安全漏洞**，其中包括大量 Critical 和 High 级别的漏洞。攻击者可以利用这些漏洞实现远程代码执行、完全数据库控制、身份认证绕过、敏感数据泄露等严重危害。

## 关键发现

### 严重漏洞（Critical）
- **远程代码执行（RCE）**：通过 SSTI、反序列化（Fastjson/Jackson/XStream/Log4j2/Shiro）、OS 命令注入、Groovy/SpEL 表达式注入等多种方式可实现
- **完全数据库控制**：JDBC Statement 拼接、MyBatis `${}` 注入、Hibernate/JPQL 注入等 16 个 SQL 注入漏洞
- **认证绕过**：JWT 密钥硬编码、算法混淆攻击、密码重置流程绕过
- **敏感信息泄露**：RSA 私钥、AES 密钥、MD5 签名密钥等硬编码在代码中

### 高风险漏洞（High）
- 存储型 XSS、WebSocket XSS（CVSS 7.1）
- 任意文件上传/下载/删除
- XXE 文件读取、SSRF 内网探测
- 验证码绕过（万能验证码、短信绕过）
- 支付逻辑漏洞（金额篡改、流程绕过）

### 业务影响
- **数据泄露**：可获取数据库中所有敏感数据（用户凭证、个人信息等）
- **系统接管**：通过 RCE 可完全控制服务器，执行任意命令
- **身份冒用**：JWT 伪造可冒充任意用户（包括管理员）
- **横向移动**：利用 SSRF 探测内网服务，进一步渗透

## 建议措施

1. **立即修复所有 Critical 级别漏洞**（JWT 密钥、反序列化、RCE、SQL 注入）
2. **升级存在已知 CVE 的依赖**（Log4j2、Fastjson、XStream、Shiro、Commons Collections 等）
3. **实施安全编码规范**：参数化查询、输入验证、输出编码
4. **建立密钥管理体系**：使用 Vault 或环境变量替代硬编码密钥
5. **部署 WAF 和 RASP** 作为纵深防御

# Methodology

# 方法论

## 评估框架

本次评估遵循 **OWASP Web 安全测试指南（WSTG）** 和 **OWASP 十大安全风险（Top 10）** 标准，采用 **白盒代码审计 + 静态分析工具链** 相结合的方法。

## 评估范围

| 范围项 | 内容 |
|--------|------|
| 目标系统 | JavaSecLab v1.5.0 |
| 代码仓库 | /workspace/JavaSecLab-i18n-bilingual |
| 技术栈 | Spring Boot 2.4.1 + Spring Security + MyBatis Plus + JPA + Hibernate + Thymeleaf |
| 代码规模 | 129 个 Java 文件，约 15,000+ 行代码 |
| 第三方依赖 | 40+ 个 Maven 依赖 |

## 评估活动

### 1. 静态分析扫描（SAST）
- **Semgrep**：执行默认 Java 安全规则集（378 条规则），发现 316 个代码安全问题
- **Gitleaks**：扫描代码中的硬编码密钥和凭据
- **Trivy FS**：扫描依赖漏洞和配置错误，发现 8 个 Critical、35+ 个 High 级别依赖 CVE

### 2. 代码安全审计
由 6 个专业审计子代理并行执行，覆盖：

1. **认证授权模块**：JWT 实现、Spring Security 配置、权限控制、会话管理
2. **SQL 注入模块**：JDBC、MyBatis、JPA、Hibernate 所有数据库操作
3. **反序列化模块**：Fastjson、Jackson、XStream、Log4j2、Shiro、SnakeYaml、XMLDecoder
4. **XSS 模块**：反射型、存储型、DOM 型、JSONP、PostMessage、WebSocket
5. **SSRF/XXE/SSTI/RCE 模块**：模板注入、命令执行、SpEL 注入、CORS、XPath
6. **文件操作与逻辑漏洞**：文件上传/下载/删除、支付逻辑、验证码、并发控制

### 3. 漏洞验证方法
- 代码静态分析确认漏洞根因
- 追踪从 HTTP 输入到危险函数的完整数据流
- 分析框架配置和版本中的已知 CVE
- 验证安全控制（如过滤器、拦截器）的有效性

## 限制与约束
- 本次为纯代码审计，未执行动态渗透测试
- 部分漏洞为教学演示用途，实际生产环境可能已添加防护
- 依赖 CVE 扫描基于 Trivy 漏洞数据库，可能存在误报或遗漏

# Technical Analysis

# 技术分析

## 漏洞分类统计

| 漏洞类型 | Critical | High | Medium | Low | 合计 |
|----------|----------|------|--------|-----|------|
| 反序列化/RCE | 7 | 3 | 0 | 0 | 10 |
| SQL 注入 | 6 | 10 | 0 | 0 | 16 |
| 认证绕过 | 5 | 3 | 7 | 0 | 15 |
| SSRF/XXE | 0 | 6 | 2 | 0 | 8 |
| SSTI/模板注入 | 3 | 0 | 1 | 0 | 4 |
| 文件操作 | 3 | 1 | 1 | 0 | 5 |
| XSS | 0 | 2 | 8 | 1 | 11 |
| 逻辑漏洞 | 0 | 3 | 9 | 1 | 13 |
| 依赖 CVE | 8 | 35+ | 25+ | 5+ | 73+ |
| **合计** | **32** | **63** | **53** | **7** | **155+** |

## 系统性根因分析

### 1. 安全架构缺陷
- **全局 CSRF 防护禁用**：`http.csrf().disable()` 使所有 POST 请求免受 CSRF 保护
- **CORS 通配符配置**：允许任意域名跨域请求，增加 CSRF 和数据泄露风险
- **过度宽松的 Security 配置**：`/api/**` 等敏感路径被 `permitAll()`
- **JWT 弱密钥**：密钥明文存储且可被算法混淆攻击绕过

### 2. 输入验证缺失
- **无统一输入校验框架**：各模块自行处理输入，缺乏标准化
- **黑名单过滤可绕过**：SQL 黑名单、XXE 黑名单均存在绕过方式
- **文件上传无内容验证**：仅检查扩展名，未验证 Magic Bytes 和内容

### 3. 输出编码缺失
- **Thymeleaf `th:utext`**：未编码渲染用户输入，导致 XSS
- **JSONP 无回调验证**：`callback` 参数直接返回，允许任意 JavaScript 执行
- **DOM 操作使用 innerHTML**：前端未使用安全的 textContent

### 4. 危险函数滥用
- **字符串拼接 SQL**：JDBC Statement、MyBatis `${}` 直接拼接用户输入
- **不安全反序列化**：`JSON.parseObject`、`ObjectInputStream.readObject`、`Yaml.load`
- **直接命令执行**：`Runtime.exec`、`ProcessBuilder`、Groovy/SpEL 表达式注入

### 5. 密钥管理缺陷
- **硬编码密钥**：JWT 密钥、AES 密钥、RSA 私钥、MD5 签名密钥均明文存储
- **未使用环境变量或 Vault**：所有敏感配置直接写在 application.yml 和代码中

## 典型攻击路径

### 路径 1：RCE 完全系统控制
攻击者 → SSTI 模板注入 / 反序列化漏洞 → 执行任意代码 → 获取服务器 Shell

### 路径 2：数据库完全控制
攻击者 → SQL 注入（JDBC/MyBatis/JPA/Hibernate）→ 执行任意 SQL → 窃取/篡改/删除数据

### 路径 3：身份冒充
攻击者 → JWT 密钥伪造 / 密码重置绕过 → 获取管理员令牌 → 访问管理功能 → 进一步攻击

### 路径 4：内网渗透
攻击者 → SSRF 探测内网 → 访问云元数据/内部服务 → 横向移动

## 修复优先级

### P0 - 立即修复（1-3 天）
1. 升级 Log4j2 到 2.20+（修复 CVE-2021-44228）
2. 升级 Fastjson 到 2.x 或替换为 Jackson（修复 autoType RCE）
3. 升级 XStream 到 1.4.20+（修复多个 RCE CVE）
4. 升级 Shiro 到 1.12.0+（修复反序列化 CVE）
5. 修复所有 SQL 注入：使用参数化查询

### P1 - 短期修复（1-2 周）
1. 实现 JWT 安全：强随机密钥、强制算法验证、令牌过期
2. 修复文件上传：白名单扩展名 + Magic Bytes 验证 + 存储隔离
3. 修复 XXE：禁用外部实体和 DTD
4. 修复 SSRF：URL 白名单、禁止访问内网 IP
5. 修复 SSTI：输入验证 + 沙箱执行

### P2 - 中期修复（1 个月）
1. 实施统一输入验证框架
2. 部署密钥管理系统（Vault/环境变量）
3. 启用 CSRF 防护和严格 CORS 策略
4. 修复 XSS：输出编码 + CSP 策略
5. 修复业务逻辑漏洞：支付流程、验证码、并发控制

# Recommendations

# 修复建议

## 即时修复措施（P0）

### 1. 依赖升级
<!-- Log4j2: 升级到 2.20.0+ -->
<dependency>
    <groupId>org.apache.logging.log4j</groupId>
    <artifactId>log4j-core</artifactId>
    <version>2.20.0</version>
</dependency>

<!-- Fastjson: 升级到 2.0.43+ 或替换为 Jackson -->
<dependency>
    <groupId>com.alibaba</groupId>
    <artifactId>fastjson2</artifactId>
    <version>2.0.43</version>
</dependency>

<!-- XStream: 升级到 1.4.20+ -->
<dependency>
    <groupId>com.thoughtworks.xstream</groupId>
    <artifactId>xstream</artifactId>
    <version>1.4.20</version>
</dependency>

<!-- Shiro: 升级到 1.12.0+ -->
<dependency>
    <groupId>org.apache.shiro</groupId>
    <artifactId>shiro-spring</artifactId>
    <version>1.12.0</version>
</dependency>

### 2. SQL 注入修复
- **JDBC**: 使用 `PreparedStatement` 参数化查询
- **MyBatis**: 使用 `#{}` 替代 `${}`
- **JPA/Hibernate**: 使用 `setParameter()` 命名参数
- **动态字段**: 使用白名单验证 ORDER BY/LIKE 字段名

### 3. 反序列化修复
- **Fastjson**: 禁用 `autoType`，使用 `@type` 白名单
- **Jackson**: 禁用 `enableDefaultTyping`，使用 `@JsonTypeInfo` 注解
- **XStream**: 使用 `XStream.setupDefaultSecurity()` 设置类型白名单
- **SnakeYaml**: 使用 `SafeConstructor`
- **Java原生**: 使用 `ObjectInputFilter` 过滤反序列化类

## 短期加固措施（P1）

### 1. JWT 安全加固
// 使用强随机密钥（至少 256 位）
SecretKey key = Keys.secretKeyFor(SignatureAlgorithm.HS256);

// 强制验证算法
Jwts.parserBuilder()
    .setSigningKey(key)
    .requireIssuer("your-app")
    .build()
    .parseClaimsJws(token);

### 2. 文件上传安全
// 白名单验证
List<String> ALLOWED_EXTENSIONS = Arrays.asList("jpg", "png", "pdf");
String ext = FilenameUtils.getExtension(filename);
if (!ALLOWED_EXTENSIONS.contains(ext.toLowerCase())) {
    throw new SecurityException("File type not allowed");
}

// Magic Bytes 验证
byte[] header = Arrays.copyOf(fileBytes, 4);
if (!isValidMagicBytes(header, ext)) {
    throw new SecurityException("Invalid file content");
}

// 存储隔离：上传目录不可执行
String uploadPath = "/var/uploads/non-executable/";

### 3. XXE 防护
// SAXParserFactory
SAXParserFactory spf = SAXParserFactory.newInstance();
spf.setFeature("http://apache.org/xml/features/disallow-doctype-decl", true);
spf.setFeature("http://xml.org/sax/features/external-general-entities", false);
spf.setFeature("http://xml.org/sax/features/external-parameter-entities", false);

### 4. SSRF 防护
// URL 白名单 + 内网 IP 过滤
private static final Pattern INTERNAL_IP = Pattern.compile(
    "^(127\\.|10\\.|172\\.(1[6-9]|2[0-9]|3[01])\\.|192\\.168\\.)"
);

URL url = new URL(inputUrl);
String host = url.getHost();
if (INTERNAL_IP.matcher(host).find() || !ALLOWED_HOSTS.contains(host)) {
    throw new SecurityException("Access to internal resources is forbidden");
}

### 5. SSTI 防护
// 输入验证：禁止 Thymeleaf 表达式语法
if (input.contains("${") || input.contains("#") || input.contains("__")) {
    throw new SecurityException("Invalid input detected");
}

// 沙箱执行：使用受限的 Context
Context ctx = new Context();
ctx.setVariable("user_input", sanitizedInput);

## 长期安全建设（P2）

### 1. 统一输入验证框架
@RestController
public class ValidatedController {
    
    @PostMapping("/api/action")
    public ResponseEntity<?> action(@Valid @RequestBody UserInput input) {
        // 自动触发 Bean Validation
        return ResponseEntity.ok(service.process(input));
    }
}

public class UserInput {
    @NotBlank
    @Size(max = 100)
    @Pattern(regexp = "^[a-zA-Z0-9]+$")
    private String name;
    
    @Email
    private String email;
}

### 2. 密钥管理
# application.yml - 使用占位符
jwt:
  secret: ${JWT_SECRET}  # 从环境变量读取
  expiration: 3600

# 启动时注入
export JWT_SECRET=$(openssl rand -base64 32)

### 3. CSRF 和 CORS 配置
@Configuration
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf
                .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
            )
            .cors(cors -> cors
                .configurationSource(corsConfigurationSource())
            );
        return http.build();
    }
    
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(Arrays.asList("https://yourdomain.com"));
        config.setAllowedMethods(Arrays.asList("GET", "POST"));
        config.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type"));
        config.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", config);
        return source;
    }
}

### 4. 安全响应头
http.headers(headers -> headers
    .contentSecurityPolicy(csp -> csp.policyDirectives("default-src 'self'"))
    .frameOptions(frame -> frame.deny())
    .xssProtection(xss -> xss.disable())  // 现代浏览器使用 CSP
    .contentTypeOptions(Customizer.withDefaults())
);

### 5. 监控和日志
@Aspect
@Component
public class SecurityAuditAspect {
    
    @Around("@annotation(Auditable)")
    public Object audit(ProceedingJoinPoint joinPoint) throws Throwable {
        // 记录安全审计日志
        log.info("User {} accessing {} with args {}", 
            SecurityContextHolder.getContext().getAuthentication().getName(),
            joinPoint.getSignature().getName(),
            Arrays.toString(joinPoint.getArgs()));
        
        return joinPoint.proceed();
    }
}

## 验证与测试

修复完成后，应进行以下验证：
1. **回归测试**：确保功能正常
2. **安全扫描**：使用 Semgrep、OWASP ZAP 重新扫描
3. **渗透测试**：验证漏洞已修复
4. **代码审查**：人工审核修复代码
5. **CI/CD 集成**：将安全检查集成到持续集成流程
```

### 每条漏洞的详情页（`vulnerabilities/vuln-XXXX.md`）

#### vuln-0001.md

```md
# SSRF - URLConnection 任意请求漏洞可访问内部服务和云元数据

**ID:** vuln-0001
**Severity:** HIGH
**Found:** 2026-07-29 01:06:52 UTC
**Target:** /workspace/JavaSecLab-i18n-bilingual
**Endpoint:** /ssrf/vul
**Method:** GET
**CWE:** CWE-918
**CVSS:** 7.5
**Fix Effort:** Medium

## Description

SSRF 接口 `/ssrf/vul` 接收用户提供的 URL 参数，未经任何校验直接通过 `URLConnection` 发起请求。攻击者可利用该漏洞探测内网服务、访问云厂商元数据端点（AWS/阿里云/腾讯云等）、读取本地文件，甚至发起端口扫描。

## Evidence

// 第66-67行：用户输入未校验直接发起请求
URL u = new URL(url);
URLConnection conn = u.openConnection();

## Impact

攻击者可读取云服务器元数据中的 IAM 凭证/Access Key，进而控制云资源；可探测内网存活主机和开放端口，获取内部服务信息；可通过 file:// 协议读取服务器本地敏感文件（如 /etc/passwd、配置文件等）。

## Technical Analysis

`SsrfController.vul()` 方法接收 `url` 参数后，直接使用 `new URL(url)` 创建 URL 对象，然后调用 `u.openConnection()` 发起请求。代码未实现：协议校验（允许 file://、gopher:// 等）、域名白名单、内网 IP 校验、重定向控制。URLConnection 支持多种协议，可用于访问内部 HTTP 服务、云元数据端点（169.254.169.254）等。

## Proof of Concept

1. 访问 `/ssrf/vul?url=http://169.254.169.254/latest/meta-data/` 可读取云服务器元数据\n2. 访问 `/ssrf/vul?url=http://127.0.0.1:8080/` 探测内部 Web 服务\n3. 访问 `/ssrf/vul?url=file:///etc/passwd` 读取本地文件\n4. 使用 `/ssrf/vul?url=http://ssrf.redogs.sorian.top/` 进行 OOB 盲打

import requests

# PoC: 访问模拟的云元数据服务
url = "http://localhost:8080/ssrf/vul?url=http://127.0.0.1:8080/ssrf/internal/metadata"
resp = requests.get(url)
print(resp.text)

# PoC: 通过 file 协议读取文件
url2 = "http://localhost:8080/ssrf/vul?url=file:///etc/passwd"
resp2 = requests.get(url2)
print(resp2.text)

## Code Analysis

**Location 1:** `src/main/java/top/whgojp/modules/ssrf/controller/SsrfController.java` (lines 60-81)
  SSRF 漏洞根因：未校验的 URLConnection
  public String vul(@RequestParam String url) {
      try {
          URL u = new URL(url);
          URLConnection conn = u.openConnection();
          ...
      }
  }

  **Suggested Fix:**
- URL u = new URL(url);
- URLConnection conn = u.openConnection();
+ if (!checkUserInput.isHttp(url)) {
+     return msg("ssrf.result.invalidProtocol");
+ } else if (!checkUserInput.ssrfWhiteList(url)) {
+     return msg("ssrf.result.notAllowlisted");
+ }
+ URL u = new URL(url);
+ HttpURLConnection conn = (HttpURLConnection) u.openConnection();
+ conn.setInstanceFollowRedirects(false);
+ conn.setConnectTimeout(3000);
+ conn.setReadTimeout(3000);

## Remediation

实施 URL 白名单校验：仅允许 HTTP/HTTPS 协议，域名必须在白名单内；解析目标域名获取 IP，校验 IP 不在内网/RFC1918/回环/链路本地地址段；禁用自动重定向；设置合理的连接和读取超时时间；参考代码中 `/ssrf/safe` 实现的白名单过滤逻辑。

## Assumptions

假设攻击者可以访问 SSRF 接口且服务器具有外网或内网访问能力
```

#### vuln-0004.md

```md
# SSRF - redirect 接口开放重定向可被用于钓鱼攻击

**ID:** vuln-0004
**Severity:** MEDIUM
**Found:** 2026-07-29 01:07:35 UTC
**Target:** /workspace/JavaSecLab-i18n-bilingual
**Endpoint:** /ssrf/redirect
**Method:** GET
**CWE:** CWE-601
**CVSS:** 4.3
**Fix Effort:** Low

## Description

`/ssrf/redirect` 接口接收任意 URL 参数并直接通过 `response.sendRedirect(target)` 发起 302 重定向。攻击者可构造恶意链接诱导用户跳转至钓鱼网站，由于重定向来源是可信的 JavaSecLab 域名，用户更容易放松警惕。

## Evidence

// 第57行：未校验直接重定向
response.sendRedirect(target);

## Impact

攻击者可构造 `http://localhost:8080/ssrf/redirect?url=http://evil.com/fake-login` 这样的链接，利用可信域名进行钓鱼攻击，窃取用户凭据或分发恶意软件。该漏洞也可被用于绕过某些基于 URL 的安全检查。

## Technical Analysis

`redirect` 方法接收 `target` 参数后，直接调用 `response.sendRedirect(target)` 将用户重定向至目标 URL，未对目标 URL 进行任何域名白名单校验或安全评估。

## Proof of Concept

1. 构造恶意链接 `http://localhost:8080/ssrf/redirect?url=http://evil.com/fake-login`\n2. 诱导受害者点击该链接\n3. 受害者浏览器将被重定向至攻击者控制的钓鱼网站

import requests

# PoC: 开放重定向
url = "http://localhost:8080/ssrf/redirect?url=http://evil.com/fake-login"
resp = requests.get(url, allow_redirects=False)
print(f"Status Code: {resp.status_code}")
print(f"Location: {resp.headers.get('Location')}")

## Code Analysis

**Location 1:** `src/main/java/top/whgojp/modules/ssrf/controller/SsrfController.java` (lines 55-58)
  开放重定向漏洞
  @GetMapping("/redirect")
  public void redirect(@RequestParam String target, HttpServletResponse response) throws IOException {
      response.sendRedirect(target);
  }

  **Suggested Fix:**
- response.sendRedirect(target);
+ if (!checkUserInput.checkURL(target)) {
+     response.sendError(HttpServletResponse.SC_FORBIDDEN);
+     return;
+ }
+ response.sendRedirect(target);

## Remediation

实施 URL 白名单校验：重定向目标必须在预设的域名白名单内；或仅允许相对路径重定向（如 `/dashboard` 而非完整 URL）；对于必须支持外部 URL 的场景，应进行安全提示确认。

## Assumptions

假设攻击者能够诱导受害者点击恶意链接
```
