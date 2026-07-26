---
type: article
title: "Strix 部署 · 架构 · 实践完整指南"
date: 2026-07-26 15:21:00 +0800
tags: [strix, agent, llm, security, fix, hacker]
---

> 基于 **strix 1.3.1** 源码（`https://github.com/usestrix/strix`）逐行核对 CLI 与运行逻辑编写。所有命令参数对应真实代码位置，可直接复制使用。
>
> ⚠️ **合规前提**：Strix 是自动化渗透测试工具，仅可用于你**拥有或已获书面授权**的应用/资产。未经授权扫描他人系统属于违法行为。本指南所有示例目标均假设你拥有测试权限。

---

## 一、项目定位

Strix 是一个开源 AI 渗透测试工具，部署自主 AI agent 团队对应用进行漏洞发现与验证。核心区别于静态扫描器（SAST）：agent 像真实红队一样**动态运行代码、构造 PoC、验证可利用性**，产出可复现的漏洞报告而非误报堆积。面向开发与安全团队，支持 CI/CD 集成。

仓库：`https://github.com/usestrix/strix` ｜ 版本：1.3.1 ｜ License：Apache-2.0

---

## 二、技术栈

| 层 | 技术 |
| --- | --- |
| 语言 | Python 3.12+（`pyproject.toml` + `uv.lock`，用 `uv` 管理依赖） |
| LLM 抽象 | LiteLLM（多 provider 统一接口） |
| Agent SDK | openai-agents（沙箱 agent、工具注册、运行循环） |
| HTTP 代理 | Caido（请求/响应拦截，容器内 sidecar，端口 48080） |
| 漏洞扫描 | Nuclei（模板化扫描） |
| 浏览器自动化 | agent-browser（基于 Chromium，XSS/CSRF/认证绕过测试） |
| TUI | Textual（交互式终端 UI） |
| Web 仪表盘 | React + Vite SPA（预构建，stdlib HTTPServer 托管） |
| 沙箱 | Docker（Kali Linux 镜像，含完整渗透工具链） |
| 报告 | Markdown / JSON / CSV / SARIF / PDF |

---

## 三、本地部署（已完成）

### 1. 克隆源码
```bash
git clone https://github.com/usestrix/strix.git
```

### 2. 安装依赖（用 uv）
```bash
cd strix
uv sync --no-dev          # 生产依赖，约 9 分钟（编译 cryptography 等）
```
依赖装进 `.venv/`，Python 3.14。直接调用：`.venv/bin/strix --version`

> ⚠️ 避免 `uv run strix`（会触发 dev group 同步，装 pyinstaller 等）。
> 也可拿官方预编译二进制：`curl -sSL https://strix.ai/install | bash`

### 3. 拉取 Docker 沙箱镜像
```bash
docker pull ghcr.io/usestrix/strix-sandbox:1.1.0
```
Kali-rolling 基础 + Go 编译的 ProjectDiscovery 工具链 + nmap/sqlmap/nuclei/ffuf/semgrep/trufflehog/gitleaks/trivy/Caido/agent-browser 等。体积大（3.77GB），下载耗时较长。

### 4. 配置 LLM（必需）
```bash
export STRIX_LLM="openai/gpt-5.4"          # 或 anthropic/claude-sonnet-4-6 等
export LLM_API_KEY="sk-..."
# 可选
export PERPLEXITY_API_KEY="..."            # 启用 web_search 工具
export STRIX_REASONING_EFFORT="high"       # high（默认，深入）/ medium（快速）
```
配置自动持久化到 `~/.strix/cli-config.json`。也可用 ChatGPT 订阅替代按量 API：`strix auth login chatgpt` → `STRIX_LLM=chatgpt/gpt-5.4`。

### 5. 验证安装
```bash
.venv/bin/strix --version   # → strix 1.3.1
.venv/bin/strix --help
```

### ✅ 当前部署状态（已就绪）

| 组件 | 状态 | 位置 / 说明 |
| --- | --- | --- |
| 源码 | ✅ 已克隆 | `./strix`（316 文件，Python 3.14 虚拟环境） |
| Python 依赖 | ✅ 已安装 | `uv sync --no-dev` → `.venv/` |
| CLI 入口 | ✅ 可用 | `.venv/bin/strix --version` → `strix 1.3.1` |
| Docker 沙箱镜像 | ✅ 已拉取 | `ghcr.io/usestrix/strix-sandbox:1.1.0` (3.77GB) |
| LLM 配置 | ✅ 已配 | LongCat-2.0（OpenAI 兼容），存于 `~/.strix/cli-config.json` |

> ⚠️ **模型能力提醒**：官方推荐 frontier 模型（`openai/gpt-5.4`、`anthropic/claude-sonnet-4-6` 等，见 `strix/config/models.py:188`）。当前用的 LongCat-2.0 已验证支持 function calling（agent 必需），但复杂安全推理质量可能弱于推荐模型，跑真实扫描时注意观察漏洞发现质量。

---

## 四、架构与原理

### 4.1 入口流程
`strix/interface/main.py:919` `main()` 是唯一入口：
1. 先分派 `strix view` / `strix auth` 子命令
2. 扫描分支：`parse_arguments` → 校验环境/Docker → 拉镜像 → `warm_up_llm`
3. 分派到 `run_cli()`（非交互）或 `run_tui()`（交互）
4. 两者都调 `run_strix_scan()`（`strix/core/runner.py`）——核心编排器：起沙箱、构建 root agent、驱动循环

### 4.2 多 Agent 系统（`strix/core/agents.py` `AgentCoordinator`）
- **无预定义 agent 类型**：root agent 通过 `create_agent` 工具按需动态派生子 agent
- 协调器管：状态（running/waiting/completed/stopped/crashed/failed）、父子关系、跨 agent 消息（send / wait_for_message）、快照/恢复
- 工厂：`strix/agents/factory.py:402` `build_strix_agent()` 构建 `SandboxAgent`
- root agent 装 `finish_scan`；子 agent 装 `agent_finish`

**典型工作流**（系统 prompt 强制）：
```
root agent（只做编排，不亲自测）
  ├─ recon 子 agent → 发现攻击面
  ├─ discovery 子 agent（按漏洞类型 × 组件）→ 发现疑似点
  │    └─ validation 子 agent → 构造 PoC 证明可利用
  │         └─ reporting 子 agent → create_vulnerability_report
  │              （白盒：报告内含 inline 修复 fix_before/fix_after + fix_pr_body）
  └─ ...并行多链路
```
- 黑盒：Discovery → Validation → Reporting（3 个 agent/漏洞）
- 白盒：Discovery → Validation → Reporting-with-fix（报告即修复，不分流）

### 4.3 工具层（`strix/tools/`）
host 侧函数工具（注入 agent 的工具集）：
- **agents_graph/** — `create_agent`、`send_message_to_agent`、`wait_for_message`、`stop_agent`、`view_agent_graph`（多 agent 编排）
- **reporting/** — `create_vulnerability_report`、`create_dependency_report`
- **proxy/** — Caido 集成：`list_requests`、`view_request`、`repeat_request`、`list_sitemap`、`view_sitemap_entry`、`scope_rules`
- **web_search/** — Perplexity 驱动的研究工具
- **todo/**、**notes/**、**thinking/** — 规划与草稿
- **finish/**、**load_skill/** — 生命周期与技能加载
- 容器内 SDK 能力（Shell、Filesystem、agent-browser）在 `factory.py` 按 run 绑定

基础工具集定义在 `factory.py` `_BASE_TOOLS`。

### 4.4 技能库（`strix/skills/`，Jinja 模板注入系统 prompt）
每个 agent 运行时最多加载 5 个技能，动态注入系统提示词。类别：
| 类别 | 内容 |
| --- | --- |
| `vulnerabilities/` | 25 种漏洞深度技法（SQLi、XSS、SSRF、IDOR、JWT、RCE、XXE、CSRF、SSTI、业务逻辦、竞态、反序列化、请求走私、LLM 提示注入、越权…） |
| `frameworks/` | Django / Express / FastAPI / Next.js 等框架专项 |
| `technologies/` | Supabase / Firebase / Auth0 / 支付网关 |
| `protocols/` | GraphQL / WebSocket / OAuth |
| `tooling/` | nmap / nuclei / httpx / ffuf / subfinder / sqlmap 命令手册 |
| `cloud/` | AWS / Azure / GCP / Kubernetes |
| `reconnaissance/` | 信息收集与攻击面测绘 |
| `coordination/` | root agent 编排剧本 |
| `custom/` | 社区/自定义（含 SAST、依赖 CVE 扫描） |

agent 可在运行时 `load_skill` 按需拉取未预装的技能。

### 4.5 沙箱运行时（`strix/runtime/`）
- `backends.py` — 可插拔后端注册，目前只有 Docker（`_docker_backend`）
- `session_manager.py` `create_or_reuse` — 每次扫描的会话生命周期：构建 manifest（LocalDir 条目 + bind mounts）、配 Caido 作容器内代理 sidecar、返回 `{client, session, caido_client}`
- `docker_client.py` `StrixDockerSandboxClient` — 注入 NET_ADMIN/NET_RAW cap、host-gateway、资源限制、bind mount
- 代码执行：SDK 的 Shell + Filesystem 能力，绑到沙箱会话

### 4.6 配置与 LLM Provider（`strix/config/`）
- `settings.py` — pydantic-settings 模型：`LlmSettings`、`RuntimeSettings`、`TelemetrySettings`、`IntegrationSettings`、`ViewerSettings`
- 加载优先级：**env > `~/.strix/cli-config.json` > 默认**
- `models.py` `StrixProvider`（MultiProvider 子类）—— 按 `<provider>/<model>` 前缀经 LiteLLM 路由
- 支持：OpenAI、Anthropic、Gemini/Vertex AI、DeepSeek、DashScope/Qwen、Moonshot/Kimi、Bedrock、Ollama、OpenRouter
- `chatgpt/` 前缀走 ChatGPT 订阅 OAuth（`config/codex.py`），token 存 `~/.strix/subscription-auth.json`
- 关键默认值：`STRIX_REASONING_EFFORT=high`、`LLM_TIMEOUT=300s`、沙箱镜像、`STRIX_MAX_LOCAL_COPY_MB=1024`

### 4.7 报告（`strix/report/`）
- `state.py` `ReportState` — 中心状态管理，累积漏洞报告
- `writer.py` — 写产物：单漏洞 Markdown（`vulnerabilities/<id>.md`）、`vulnerabilities.csv`、`vulnerabilities.json`、执行摘要 `penetration_test_report.md`
- `sarif.py` — SARIF 2.1.0 `findings.sarif`（CI/代码扫描集成）
- `dedupe.py` — LLM 去重（重复提交会被拒）

### 4.8 本地 Web 仪表盘（`strix/viewer/`）
- `server.py` — stdlib `ThreadingHTTPServer`，托管预构建 React SPA（`viewer/static/`）
- 前端源码在 `viewer/frontend/`（Vite + React + TS），`make viewer` 重新构建
- JSON API（`/api/run`、`/api/vulnerabilities`、`/api/report`、`/api/transcript`、`/api/runs`）直接从磁盘读 run 数据，实时/历史 run 同等服务
- 认证：每进程 session token + HttpOnly cookie；跨 run 历史可选邮箱 OTP
- `cli.py` `run_view` 是 `strix view` 入口；TUI 内可挂 `steer_handler` 向在跑的 agent 发指令

### 4.9 研究要点
1. **动态验证优于静态扫描** —— agent 真跑代码、发请求、构造 PoC，误报低
2. **root agent 纯编排** —— 系统 prompt 明确禁止 root 亲自动手，强制走 Discovery → Validation → Reporting 三段式子 agent 链
3. **报告即修复（白盒）** —— `create_vulnerability_report` 内含 `fix_before`/`fix_after` + `fix_pr_body`，分析和修复合一
4. **沙箱隔离** —— 所有工具在 Kali Docker 容器内跑，host 侧只做编排与报告
5. **技能可扩展** —— Markdown 技能文件注入 prompt，新增漏洞类型/工具/框架只需加文件
6. **可插拔 LLM** —— LiteLLM 支持十余家 provider，ChatGPT 订阅也能跑
7. **安全设计** —— 系统 prompt 注入授权范围（system-verified scope），用户指令不能扩 scope

---

## 五、核心概念（先建立心智模型）

Strix 不是传统"规则扫描器"（如 nuclei/sqlmap），而是 **多 Agent 编排器**：
- **Host 侧（你的机器）**：只做编排、LLM 调度、报告生成
- **沙箱侧（Docker 容器）**：所有真实攻击动作（发请求、跑工具、执行 PoC 代码）都在 Kali 容器内隔离执行，host 永远不会直接发起攻击流量

**三种测试视角**：
| 视角 | 目标形式 | 说明 |
| --- | --- | --- |
| 黑盒 | `https://...` / 域名 / IP | 无源码，纯外部探测 |
| 白盒 | 本地目录 / 仓库 | 有源码，结合 SAST + 动态验证 |
| 混合 | 多 `--target` | 源码 + 部署实例一起测 |

---

## 六、快速开始（5 分钟跑通）

```bash
cd /Users/junjian/WorkBuddy/2026-07-25-09-13-34/strix

# ① 黑盒：测一个你拥有的 Web 应用（交互式 TUI）
.venv/bin/strix --target https://your-app.example.com

# ② 无头模式（CI / 后台跑，结束即退出）
.venv/bin/strix -n --target https://your-app.example.com

# ③ 跑完后查看报告仪表盘
.venv/bin/strix view
```
首次运行会自动拉镜像（已跳过，已就绪）、校验 LLM 连通性（warm-up）、克隆/拷贝目标，然后进入 TUI。

---

## 七、目标类型（`--target`）详解

`--target`（简写 `-t`）可多次使用，自动推断类型（`infer_target_type`，`main.py:683`）。

### 7.1 Web 应用（黑盒）
```bash
strix --target https://your-app.com
```

### 7.2 Git 仓库
```bash
strix --target https://github.com/user/repo
strix --target git@github.com:user/repo.git
# 仓库会被克隆进沙箱，白盒分析
```

### 7.3 本地代码目录（白盒）
```bash
strix --target ./my-project
```
> 默认把目录**逐文件拷贝**进沙箱。超过 `STRIX_MAX_LOCAL_COPY_MB`（默认 1024MB）会报错，改用 `--mount`。

### 7.4 域名 / IP（基础设施）
```bash
strix --target example.com          # 域名渗透
strix --target 192.168.1.42         # IP 渗透
```

### 7.5 多目标（混合白盒+黑盒）
```bash
strix --target ./my-project --target https://staging.example.com --target https://prod.example.com
```

### 7.6 目标清单文件（`--target-list`）
每行一个目标，空行/ `#` 注释忽略。可多次指定，也可与 `--target` 混用。
```bash
strix --target-list ./targets.txt
# targets.txt:
# https://app1.com
# https://github.com/user/repo
# ./local-service
```

### 7.7 大仓库挂载（`--mount`）
不拷贝、只读 bind-mount 进沙箱，适合 monorepo。
```bash
strix --mount ./huge-monorepo --target https://app.com
```

---

## 八、扫描模式（`--scan-mode`）

| 模式 | 用途 | 适用场景 |
| --- | --- | --- |
| `quick` | 快速 | CI/CD 门禁、提交前检查 |
| `standard` | 常规 | 例行安全测试 |
| `deep` | 彻底（**默认**） | 正式安全评审 |

```bash
strix -n --scan-mode quick --target https://your-app.com
```

---

## 九、自定义指令（`--instruction` / `--instruction-file`）

精准引导 agent 关注点，二选一（不能同时用，见 `main.py:634`）。

```bash
# 内联：聚焦特定漏洞类型
strix --target https://app.com --instruction "Focus on IDOR and XSS"

# 内联：提供测试凭据（白盒常见）
strix --target https://app.com --instruction "Use these creds: admin:password123"

# 内联：指定测试范围
strix --target https://app.com --instruction "Check the /api/login endpoint for auth issues"

# 从文件读取长篇指令
strix --target https://app.com --instruction-file ./detailed_instructions.md
```

> 在 CI/headless 下可用 `--scope-mode`（auto/diff/full）+ `--diff-base` 限定只测 PR 改动文件（`--scope-mode diff --diff-base origin/main`），避免每次全量扫。

---

## 十、成本控制（`--max-budget-usd`）

LLM 调用是主要开销。设上限后到达即干净停止（不中断已写报告）。

```bash
strix -n --max-budget-usd 5 --target https://your-app.com
```

---

## 十一、LLM 配置

### 11.1 三种配置来源（优先级：环境变量 > `~/.strix/cli-config.json` > 默认）
**A. 环境变量**（最灵活）：
```bash
export STRIX_LLM="openai/gpt-5.4"
export LLM_API_KEY="sk-..."
export LLM_API_BASE="https://api.openai.com/v1"   # 本地/兼容端点才需要
export PERPLEXITY_API_KEY="pplx-..."               # 可选，实时网络检索
export STRIX_REASONING_EFFORT="high"               # none/minimal/low/medium/high/xhigh
export LLM_TIMEOUT="300"                            # 请求超时秒
```

**B. 持久化配置文件** `~/.strix/cli-config.json`（你的环境已生成）：
```json
{
  "env": {
    "STRIX_LLM": "openai/LongCat-2.0",
    "LLM_API_KEY": "ak_xxxx",
    "LLM_API_BASE": "https://api.longcat.chat/openai/"
  }
}
```
> 配置文件中**未设置**的环境变量才会被读取，env 始终优先（`loader.py:108`）。

**C. 单次覆盖** `--config /path/to/custom.json`。

### 11.2 Provider 写法
`<provider>/<model>`，经 LiteLLM 路由。支持（部分）：
- `openai/gpt-5.4`、`anthropic/claude-sonnet-4-6`
- `bedrock/...`（需 `pipx install "strix-agent[bedrock]"`）
- `vertex/...`（需 `pipx install "strix-agent[vertex]"`）
- 本地模型：`openai/...` + `LLM_API_BASE=http://localhost:11434`（Ollama/LMStudio）

### 11.3 ChatGPT 订阅登录（`strix auth`）
不走按量 API，用 Plus/Pro 订阅跑：
```bash
strix auth login chatgpt      # 浏览器 OAuth，存 ~/.strix/subscription-auth.json
strix auth status
strix auth logout
# 之后设 STRIX_LLM=chatgpt/gpt-5.4 即可走订阅
```

---

## 十二、查看结果（`strix view`）

启动本地 Web 仪表盘（前端 SPA + 后端 server），展示实时/历史的 agent 轨迹与漏洞报告。

```bash
strix view                 # 打开最近一次 run
strix view <run-name>      # 指定 run（目录名，见 ./strix_runs/）
strix view --port 8080     # 指定端口
strix view --no-open       # 不自动开浏览器
```

> 🔒 **安全要点**：`view` 打印的 URL 带 token，**任何拿到该链接的人都能操控正在跑的 live 扫描并浏览历史**。不要在公共频道分享。Ctrl-C 停止服务。
>
> ⚠️ 若报 "Viewer UI is not built"，需先构建前端：
> ```bash
> cd strix/viewer/frontend && npm ci && npm run build
> ```

---

## 十三、报告产物与解读

每次扫描结果落在 **`./strix_runs/<run-name>/`**：

| 文件 | 内容 |
| --- | --- |
| `penetration_test_report.md` | 主报告（人类可读，含漏洞摘要、修复建议） |
| `vulnerabilities/<id>.md` | 每个漏洞的独立详细报告（含 PoC、影响、修复） |
| `vulnerabilities.json` | 结构化漏洞数据（程序消费） |
| `vulnerabilities.csv` | 表格化清单（导入表格/工单系统） |
| `findings.sarif` | SARIF 2.1.0，可直接喂 CI（GitHub CodeQL 上传） |
| `run.json` | 运行元数据（目标、模式、状态、起止时间） |

**读报告的正确姿势**：
1. 先看 `penetration_test_report.md` 的摘要与严重级别分布。
2. 逐个打开 `vulnerabilities/<id>.md`，重点看 `validation`（agent 是否真构造 PoC 确认过）和 `fix_before/fix_after`（白盒模式直接给修复 diff）。
3. 接入 CI 用 `findings.sarif`，工单系统用 `vulnerabilities.csv`。

> 白盒模式下，`create_vulnerability_report` 内含 `fix_before`/`fix_after` + PR body，可直接用于提修复 PR。

---

## 十四、断点续跑（`--resume`）

扫描中断（Ctrl-C / 崩溃 / 预算耗尽）后，用 run 名恢复，会接管原 root + 所有未完成子 agent 的完整 LLM 历史与拓扑。

```bash
strix --resume <run-name>
# 不能和 --target/--target-list/--mount 混用（原目标已记录）
```

---

## 十五、技能系统（扩展 Strix 能力）

技能是 Markdown 知识包，动态注入 agent 系统提示词（见 4.4）。

**自定义技能**：在对应目录新建 `<name>.md`，带 YAML frontmatter（`name` + `description`），内容包含：高级技法、可用 payload 示例、验证方法（去误报）、版本/配置相关边界。agent 会按相关性自动选 ≤5 个注入。贡献方式见 `strix/skills/README.md`。

---

## 十六、CI/CD 集成（SARIF）

`findings.sarif` 可直接上传到 GitHub 安全面板：
```yaml
name: strix-penetration-test
on: pull_request
jobs:
  security-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6
        with: { fetch-depth: 0 }
      - name: Install Strix
        run: curl -sSL https://strix.ai/install | bash
      - name: Run Strix
        env:
          STRIX_LLM: ${{ secrets.STRIX_LLM }}
          LLM_API_KEY: ${{ secrets.LLM_API_KEY }}
        run: strix -n -t ./ --scan-mode quick
```
PR 运行自动把 quick 模式范围收窄到改动文件（`--scope-mode diff`）。本地等价命令：
```bash
strix -n --scan-mode quick --scope-mode diff --diff-base origin/main --target ./my-project
```

---

## 十七、最佳实践

1. **先用 `quick` 模式探路**，确认链路通、LLM 质量够，再上 `deep`。
2. **永远设 `--max-budget-usd`**，防止长扫描失控烧钱。
3. **白盒优先给源码**：比纯黑盒发现率高得多（结合 SAST + 动态验证）。
4. **用 `--instruction` 聚焦**：限定范围/凭据，比"全扫"更快更准。
5. **本地/大仓库用 `--mount`**：避免拷贝超大目录报错。
6. **LongCat 用户**：复杂任务留意质量警告；关键资产建议切官方推荐模型交叉验证。
7. **报告落地即归档**：`strix_runs/` 是证据链，按 run-name 保留。

---

## 十八、故障排查

| 现象 | 原因 / 解决 |
| --- | --- |
| `MISSING REQUIRED ENVIRONMENT VARIABLES: STRIX_LLM` | 未设模型。设 `STRIX_LLM`（见 11.1）。 |
| `LLM CONNECTION FAILED` | API Key/Base 错或网络问题；检查 `LLM_API_KEY`/`LLM_API_BASE`。 |
| `MODEL QUALITY WARNING` | 非推荐 frontier 模型（如 LongCat），可继续但质量可能下降。 |
| `MODEL NOT AVAILABLE ON SUBSCRIPTION` | ChatGPT 订阅不含该模型，或登录过期（`strix auth login chatgpt`）。 |
| `DOCKER NOT INSTALLED` | 装 Docker Desktop 并启动 daemon。 |
| `Local target too large to stream` | 超 1024MB，改用 `--mount`。 |
| `Viewer UI is not built` | 构建前端：`cd strix/viewer/frontend && npm ci && npm run build`。 |
| `UNKNOWN MODEL NAME` | 裸模型名默认走 OpenAI；非 OpenAI 用 `<provider>/<model>`。 |

---

## 十九、关键文件速查

| 关注点 | 文件:行 |
| --- | --- |
| CLI 入口 | `strix/interface/main.py:919` |
| 扫描编排 | `strix/core/runner.py` |
| Agent 协调器 | `strix/core/agents.py` |
| Agent 工厂 | `strix/agents/factory.py:402` |
| 系统 prompt 模板 | `strix/agents/prompts/system_prompt.jinja` |
| 基础工具集 | `strix/agents/factory.py` `_BASE_TOOLS` |
| 沙箱会话管理 | `strix/runtime/session_manager.py` |
| Docker client | `strix/runtime/docker_client.py` |
| LLM provider | `strix/config/models.py` `StrixProvider` |
| 推荐模型列表 | `strix/config/models.py:188` |
| 配置加载优先级 | `strix/config/loader.py:108` |
| 报告状态 | `strix/report/state.py` |
| Viewer 服务 | `strix/viewer/server.py` |
| 运行目录约定 | `strix/core/paths.py` `RUNS_DIR_NAME="strix_runs"` |
| 沙箱镜像 | `containers/Dockerfile`（Kali + 全工具链） |

---

## 二十、常用命令速查

```bash
# 版本 / 帮助
.venv/bin/strix --version
.venv/bin/strix --help

# 黑盒快速扫（无头 + 预算上限）
.venv/bin/strix -n --scan-mode quick --max-budget-usd 3 --target https://your-app.com

# 白盒深度扫 + 聚焦指令
.venv/bin/strix --scan-mode deep --instruction "Focus on auth and IDOR" --target ./my-project

# 混合：源码 + 部署实例
.venv/bin/strix --target ./my-project --target https://staging.example.com

# CI 改动扫描
.venv/bin/strix -n --scan-mode quick --scope-mode diff --diff-base origin/main --target ./my-project

# 续跑 / 查看
.venv/bin/strix --resume <run-name>
.venv/bin/strix view <run-name>

# 更新 / 登录
.venv/bin/strix --update
.venv/bin/strix auth login chatgpt
```

---

*基于 strix 1.3.1 源码逐行核对 CLI 与运行逻辑生成，命令参数与文件结构均经代码验证。*
