---
type: article
title: "DeepSeek Harness 架构分析"
date: 2026-08-20 22:00:00 +0800
tags: [dsh, cordis, deepseek, harness, agent-loop, architecture]
---

## 1. 一句话定位

DeepSeek Harness 是一个**"一切皆插件"的 Agent 运行时**：以 vendored Cordis 为插件内核，把模型、工具、会话、执行环境、子代理全部抽象成可替换的能力接缝（capability seam），再用分层配置（profile / bundle / patch）组合成产品。它的本质不是"一个 agent"，而是**一条生产 agent 的装配线**。

## 2. 分层架构总览

```text
┌─────────────────────────────────────────────────────────────┐
│ 接口层    host(Web GUI 后端) · client(浏览器) · api(Typert     │
│           RPC 网关) · sdk(JSON-RPC 进程外) · acp(自动化协议)    │
├─────────────────────────────────────────────────────────────┤
│ 组合层    profile → bundle(dsh-base/web-app/headless) →      │
│           cordis.patch.yml → --patch     （启动时叠加成树）    │
├─────────────────────────────────────────────────────────────┤
│ 核心脊柱  session(日志) · system-prompt(装配) ·                │
│           tools(注册+管线) · agent(接口) · agent-loop(驱动)    │
├─────────────────────────────────────────────────────────────┤
│ 能力接缝  llm · shell · subprocess · fs · sandbox ·          │
│           terminal · lsp · skill · web · subagent ·         │
│           workflow · compaction · spill · jobs · ...        │
│           每条 seam = Definition + Provider + Consumer       │
├─────────────────────────────────────────────────────────────┤
│ 横切关注  settings · credentials · approval · permission ·   │
│           session-persistence · telemetry · storage ·       │
│           invariants · hooks(Claude Code/Codex 桥)          │
├─────────────────────────────────────────────────────────────┤
│ 内核      Cordis: Service · ctx 服务仓库 · inject 依赖 ·       │
│           类型化事件(emit/waterfall/parallel/serial) ·        │
│           ctx.effect 可逆注册 · Loader(配置即代码 + HMR)       │
└─────────────────────────────────────────────────────────────┘
```

仓库布局：`packages/<group>/<pkg>/` 共 44+ 包组，npm scope 统一 `@deepseek-ai/dsh-*`；`vendor/` 为钉住 SHA 的 Cordis 源码拷贝；`docs/` 持有架构文档与生成目录；`.agents/notes/` 是架构决策的考古层。

## 3. 四个基石性架构决策

### 3.1 没有特权核心——插件化是彻底的

连 agent loop 本身（`ctx.agentLoop`）都只是可替换插件；扩展插件依赖 `dsh-agent` 接口而非 loop 实现（纪律："Extension plugins depend on Service Definitions, never concrete providers"）。

- 换模型 provider = 在 `ctx.llm` 注册 adapter
- 换执行环境 = 把 `ctx.subprocess`/`ctx.fs` 指向 E2B 远程沙箱，Bash、PTY、LSP 一起搬走，零 fork
- 测试替身是自然产物：`llm-replay` 作为 adapter 注册即实现无 API key 快照回放
- 代价：跨层通信必须走事件/服务抽象，直接 import 被纪律禁止，新手学习曲线陡

### 3.2 日志即真相（Event Sourcing）

Session 是一条 append-only 的 `SessionEvent` 日志，是系统**单一事实来源**：

- 模型上下文 = `deriveMessages()` 从日志投影
- Inbox = `agent/inbox/spliced` 事件的增量投影（每次 splice 先落日志再改内存）
- UI = `session/event` 广播的渲染
- 铁律 **Model-visible ⟺ Logged**，由运行时 invariant 强制；新增模型可见输入 = 扩展 `SessionEventMap`
- fork / resume / 回放 / 遥测 / 持久化 / session-query 全文搜索全部从同一流派生
- 代价：`SESSION_FORMAT_VERSION` 钉在 0，预发布不做兼容承诺

### 3.3 能力接缝三角色制

每个可替换能力强制拆成 **Service Definition / Provider / Consumer** 三角色，"一个角色不构成 seam"：

| Seam | Provider 举例 | Consumer 举例 |
|---|---|---|
| `ctx.shell` | bash-local / bash-sandbox / pwsh-local | tool-bash、hooks 桥 |
| `ctx.subagents` | spawn/fork in-process、ACP、Codex、Claude Code、dsh-sdk | tool-subagent、tool-ralph |
| `ctx.sessionPersistence` | JSONL / SQLite | agent-loop、session-query |
| `ctx.fs` | local / sandbox / e2b | tool-fs |

能力图（`docs/capability-seams.md`）由脚本从代码提取并 CI freshness-gate——**架构文档不可能腐烂**。

### 3.4 配置即组合，组合可热更

- 分层：`dsh-base` bundle → 模式 bundle → profile patch → home patch → `--patch`
- `!!js` 表达式实现平台分叉：`disabled: !!js process.platform === 'win32'` 一份配置，每宿主恰好一个 shell 栈
- `watchUserPatches` 热重载；patch 改错 → 保留最后可用树运行 + 广播 `hmr/config-update-failed`，降级而非崩溃
- `renderConfigDump` 用 include 自己的 patch 算法离线渲染——**dump 的树与实际 boot 的树同源一致**

## 4. 运行时核心：Turn 调用链

### 4.1 输入侧：四动词 + 持久化 Inbox

| 方法 | 通道 | 唤醒 | 语义 |
|---|---|---|---|
| `followup()` | next-turn | 是 | 排队等下一轮 |
| `steer()` | next-step | 是 | 打断步间边界 |
| `inject()` | next-step | 否 | 注入上下文搭便车 |
| `send()` | 二者 | 可选 | 底层原语 |

`Inbox` 是日志事件的增量投影：splice 先 `session.append('agent/inbox/spliced')` 再改内存，构造时重放恢复——崩溃恢复与竞态免疫由此免费获得（`send()` 在 splice 前捕获 `wakingAfterAbort` 分类，防可重入 cancel 错归类）。

### 4.2 驱动器：三态机 + 唤醒闩锁

`Phase = idle | maintenance | running`；同一时刻只有一个驱动器 promise。驱动器存活时 `wakeDriver()` 只设闩锁不重入；maintenance / abort 期间的唤醒挂账、收敛时重放——解决唤醒丢失与重入问题。

### 4.3 Turn / Step 流水

```text
turn/start（先落日志再执行）
  loop:
    preStep: claim 输入 → 装配 prompt → agent/pre-step waterfall（可改写/拒绝）
      reject 或空首批 → 关闭 turn，不花模型调用（尝试仍被记录）
    step/start → user/message ×N（进入模型必先成为日志事实）
    step:
      buildRequest: request/header 折叠 → agent/request waterfall
        → prepareCall 绑定 adapter 注册（一次性句柄，HMR 安全）→ deepFreeze
      流式: 每 chunk 落 assistant/chunk 日志 + BlockAssembler 增量装配
        error/aborted finish → agent/request-error waterfall（compaction 在此挂压缩重试）
      assistant/message 落日志（max-tokens 截断丢弃 tool-call 块）
      工具调用 → executeToolCalls → 欠模型一次请求则循环
    step/end
    agent/turn-stopping（serial，唯一阻止 turn 结束的扩展点）
turn/end（任何退出路径 reason 必落日志；max-tokens 结局粘性不可降级）
```

### 4.4 工具调度与执行管线

调度器（`tool-calls.ts`）：exclusive 调用为屏障，parallel 调用进有界滚动池；**派发可重叠、提交必须模型序**；启动前重分类使注册表变更即时制造屏障。abort 时已启动调用排空保留真实结果、未启动补合成错误结果——日志绝无"有 call 无 result"的洞。调度器自身失败则排空在途、抛首个错误、**不伪造工具结果**。

执行管线（`ctx.tools`）五阶段：

```text
createExecution（参数快照+冻结；code-mode 折叠先于策略拒绝）
→ tools/pre-execute  waterfall（allow/deny/ask，审批桥在此；无应答 fail-closed）
→ 单调守卫（超时/重复调用提醒）
→ tools/execute      waterfall（around；信号融合使 wrapper 无法剥离调用方取消）
→ tools/post-execute waterfall（spill 大结果外溢）
→ finalizeContent → tools/result（emit 冻结快照）
```

取消结果按 `bodyInvoked` 二分：`ABORTED_BEFORE_DISPATCH` vs `ABORTED`——模型能区分"没跑"与"跑了被掐断"。

### 4.5 LLM seam 故障域分层

- adapter 选择/派发/迭代失败 → 流内终态 chunk（`finish: error|aborted`），不逃逸为未处理拒绝
- 中间件/消费者失败 → 照常抛出（两类故障策略刻意不同）
- 换 provider 时剥离历史消息中属于其他 adapter 的 replay state

## 5. 横切机制

### 5.1 事件系统

三种事件域：**session 事件**（持久事实）、**agent 事件**（`agent/*`，携带活句柄，拦截进行中工作）、**能力事件**（`fs/*`、`tools/*`，策略挂 seam 不 import loop）。四种派发模式：`emit` / `waterfall`（around-middleware，必须 `next()`）/ `parallel` / `serial`。

### 5.2 安全模型（纵深防御）

- **进程围栏**：`ctx.sandbox`（bwrap/Landlock/Seatbelt/Windows ACL）在 argv 层包裹；`sandbox-policy` 是唯一策略源，bash 与 fs 两个执行家族读同一策略——不可能围栏到不同根
- **审批**：`approval/request` waterfall，ask 由监听器拥有，无应答者 fail-closed 到 `unavailable`
- **凭证**：配置只放引用，按操作解析，轮换即下一次请求生效；UI 只见无值视图
- **失败哲学**：misconfiguration 加载时 fail loud；boot 失败先 dispose 半成品 context 再退出（终端 raw mode 不残留）

### 5.3 可观测与诊断

`ctx.invariants` 包级运行时断言注册表（验证"拥有关系"而非表面存在性）；session-telemetry OTel seam；会话标题、投影缓存、session-query 全文搜索均从日志派生。

## 6. 工程质量体系

| 机制 | 作用 |
|---|---|
| 生成文档图（module-graph / capability-seams / config-catalog / tool-catalog） | 文档与代码不可漂移，CI freshness-gate |
| keyless 快照测试（ACP/headless 回放真实 example） | 模型/用户可见行为变更必须同 PR 附转录 |
| `llm-replay` adapter | 真实 API 与回放共用同一流路径 |
| 覆盖率 per-file 100%、duplication、knip/publint/NodeNext | 静态卫生全家桶 |
| Agent Notes 制度 | 非平凡变更同 PR 写决策笔记 |
| 双语 `.i18n.yaml` + VitePress 投影 | 文档双语同步与站点死链检查 |

## 7. 架构师评估

### 优势

1. **可替换性极致**：模型到 loop 到执行环境全部可换，替换方式是配置而非 fork
2. **事件溯源使衍生能力免费化**：fork/resume/replay/telemetry/search 同源
3. **取消与故障语义是一等设计**：信号融合、合成结果补洞、故障域分层
4. **文档即代码**：架构图、配置目录、工具目录全部生成并 CI 保鲜

### 权衡与风险

1. **复杂度前置**：44+ 包组、三角色制、事件域分类，贡献者认知门槛高（AGENTS.md 与 defensive-patterns.md 的厚度即证据）
2. **预发布策略双刃剑**：`SESSION_FORMAT_VERSION = 0`、拒绝旧格式、自由重命名——地基优先，但第一个 tagged release 前无外部迁移路径
3. **vendored Cordis 维护负担**：钉 SHA 拷贝 + 本地修改清单，上游同步为手工流程
4. **waterfall 调试难度**：漏调 `next()` 即静默短路，表现为"行为消失"而非报错，靠纪律而非类型系统兜底

### 结论

这是按"十年生命周期"设计的架构：用短期复杂度（插件纪律、事件溯源、三角色 seam）购买长期可演化性。最接近的参照物不是 LangChain 类 agent 框架，而是 **VS Code 扩展模型 + Git 日志溯源 + Kubernetes 声明式组合**在 agent 运行时上的融合形态。

## 附录：关键源码索引

| 主题 | 文件 |
|---|---|
| 驱动器 / turn / step | `packages/core/agent-loop/src/agent.ts` |
| 工具调度器 | `packages/core/agent-loop/src/tool-calls.ts` |
| 持久化 Inbox | `packages/core/agent/src/inbox.ts` |
| 工具注册表与五阶段管线 | `packages/core/tools/src/index.ts` |
| LLM seam（adapter 注册 / prepareCall / 流边界） | `packages/llm/llm/src/index.ts` |
| chunk→message 装配 | `packages/llm/llm/src/assembler.ts` |
| 会话日志与 deriveMessages | `packages/core/session/src/index.ts` |
| 压缩与错误恢复挂载 | `packages/compaction/compaction-basic/src/index.ts` |
| 启动与 profile 组合 | `packages/boot/app-boot/README.md` |
| 能力接缝全景图 | `docs/capability-seams.md` |
| 架构总纲 | `docs/architecture.md` |
