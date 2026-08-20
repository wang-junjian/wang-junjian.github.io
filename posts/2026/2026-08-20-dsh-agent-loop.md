---
type: article
title: "DeepSeek Harness 架构：Agent-Loop 工作原理"
date: 2026-08-20 22:32:00 +0800
tags: [dsh, cordis, deepseek, harness, agent-loop, architecture]
---

## 一、整体定位：一个"日志驱动"的反应式状态机

`ReactLoopAgent`（`packages/core/agent-loop/src/agent.ts`）不是传统意义上的 while-loop 脚本，它是一个**三态相机 + 事件日志回放器**的复合体：

```text
Phase = idle | maintenance | running
```

- `idle`：驱动器不存在，`lastTurn` 记住上次进度
- `maintenance`：独占的维护窗口（如 compaction），持有独立 AbortController
- `running`：驱动器存活，`turn`/`step` 计数 + `wakeRequested` 闩锁

关键设计：**同一时刻只有一个驱动器 promise**（`activityDone`），`wakeDriver()` 在驱动器存活时只设置闩锁而不重入，在 maintenance 或被 abort 的活动期间则把唤醒"挂账"，等收敛时重放（`agent.ts:172-193`）。这解决了 agent 系统最难的问题之一——**唤醒信号的丢失与重入**——用一个 latch 而不是消息队列。

## 二、输入侧：双通道 Inbox 的持久化设计

所有输入通过四个动词进来（`agent.ts:113-132`）：

| 方法 | 目标通道 | 立即唤醒？ | 语义 |
|---|---|---|---|
| `followup()` | next-turn | 是 | 排队等下一轮 |
| `steer()` | next-step | 是 | 打断当前 turn 的步间边界 |
| `inject()` | next-step | 否 | 注入上下文，搭便车进下一次请求 |
| `send()` | 二者之一 | 可选 | 底层原语 |

`Inbox`（`packages/core/agent/src/inbox.ts`）是最能体现这个项目设计哲学的地方：**它不是内存队列，而是持久化事件的增量投影**。每次 splice 先 `session.append('agent/inbox/spliced')` 落日志，再改内存（`inbox.ts:186-187`），构造时从日志重放恢复。这带来两个架构级收益：

1. **崩溃恢复免费**：进程重启后 inbox 状态从日志重建
2. **竞态免疫**：`send()` 在 splice 之前捕获 `wakingAfterAbort` 分类（`agent.ts:116`），防止 splice 观察者可重入的 cancel 把消息错误归类

细节：claim 操作是"纯删除"的 splice（`inbox.ts:71-78`）——`next-step` 全取，`next-turn` 只取**一条**。这就是"一步消费一条排队消息"的语义来源。

## 三、Turn：持久化边界优先于执行

`turn()`（`agent.ts:246-330`）的结构值得逐行品味：

```text
append('turn/start')          ← 先落日志，再执行（失败即 throwError）
loop:
  preStep()                    ← claim + 装配 prompt + agent/pre-step waterfall
  reject → turnEnds = blocked，不花任何模型调用
  append('step/start')
  append('user/message') × N   ← 进入模型的每条消息必须先成为日志事实
  step()                       ← 见下节
  finally: append('step/end')
  agent/turn-stopping (serial) ← 唯一的"阻止 turn 结束"扩展点
finally:
  append('turn/end', reason)   ← 无论何种退出，reason 必落日志
```

架构判断：

- **零花费 turn 是合法且被记录的**：第一条消息被 reject 或改写为空，turn 依然以 `completed` 关闭——日志记录了"这次尝试"，而不是假装它没发生
- **max-tokens 粘性**（`agent.ts:290`）：一旦某 step 触及上限，后续正常完成的 step 不得降级 turn 结局——这是对"汇总状态单调性"的显式建模
- **错误分级**：`LlmError` 保留结构化 facts，其他一切压平为 `errorChain` 文本 + `UNKNOWN` 码（`agent.ts:309-314`）——错误在进入日志前就被规范化

## 四、Step：请求构建 → 流式消费 → 工具回灌

### 4.1 buildRequest：冻结的、绑定注册的快照（`agent.ts:426-514`）

这是整个 loop 里防御密度最高的函数，它解决的问题是**热更新（HMR）下的请求一致性**：

1. 从持久化 `request/header` 折叠种子配置 → 剥离 adapter 派生默认值（`requestProposal`）
2. `agent/request` waterfall 让插件提议修改配置（改模型、调 effort）
3. `ctx.llm.prepareCall()` 把配置**绑定到解析时刻的 adapter 注册**——返回的 `PreparedLlmCall` 是一次性句柄，config 不匹配即抛 `INVALID_PREPARED_CALL`（`llm/index.ts:800-813`）。HMR 中途换掉 adapter，绝不会出现"用 A adapter 的能力探测结果去调 B adapter"
4. `request/header` 只在**变化时**追加新事件（`headerEquals` 比较），日志无冗余
5. 最终请求 `deepFreeze` + `markAgentLoopRequest`——不可变且带来源标记

### 4.2 流式消费：日志与装配分离（`agent.ts:339-419`）

```text
for await (chunk of stream):
  session.append('assistant/chunk', ...)   ← 原始 chunk 全部落日志（回放保真）
  assembler.push(chunk)                     ← BlockAssembler 增量装配
```

`BlockAssembler`（`llm/src/assembler.ts`）是唯一的规范装配算法，处理三种现实世界的混乱：

- **delta-only 协议**（无 block-start/end）也能容错装配
- **straggler delta**（block-end 后迟到的增量）被忽略，防止劣质 adapter 撑爆内存
- **max-tokens 截断**：丢弃无法安全执行的 tool-call 块，且 `blocks()` 与 `replayState` 从同一个 keep/drop 决策派生（`assembler.ts:134-148`）——**两个消费方不可能不一致**，这是"一个事实来源"原则的教科书应用

### 4.3 错误恢复作为 waterfall（`agent.ts:373-390`）

流以 error/aborted finish 结束时，不直接重试，而是发 `agent/request-error` waterfall——**compaction-basic 就是在这里挂接的**（`compaction-basic/src/index.ts:179`）：context window 爆了 → 压缩 → 返回 `{kind:'retry'}` → loop `continue` 重发。错误恢复策略完全插件化，loop 本身不知道什么叫"压缩"。

### 4.4 工具调用回灌

`assistant/message` 落日志后，tool-call 块交给调度器；返回 `concluded` 则 turn 完成，否则 `return null`——**null 意味着"还欠模型一次请求"**，turn 循环继续。这就是 ReAct 循环的收口点。

## 五、工具调度器：并发与顺序的正交分离

`executeToolCalls`（`tool-calls.ts`）的设计决策非常清晰：

- **exclusive 调用是屏障**，parallel 调用组成**有界滚动池**（`maxParallelToolCalls`）
- **派发可重叠，提交必须模型序**：`slots[]` 按模型顺序 finalize + 落 `tool/result` 日志（`tool-calls.ts:146-160`），`commitReady` 只推进连续已就绪前缀
- **启动前重分类**：pool 填充时重新查询 `executionMode`（`tool-calls.ts:200-204`），注册表变更可即时制造屏障
- **取消语义分级**：abort 时，已启动的调用**排空并保留真实结果**，未启动的补记**合成错误结果**（`TOOL_ABORTED_BEFORE_DISPATCH`）——回放永远有效，日志里绝不存在"有 call 无 result"的洞
- **调度器自身失败**：停止新派发、排空在途、抛首个错误，**但不伪造工具结果**（`tool-calls.ts:231-235`）——区分"工具失败"和"编排失败"两类事故

## 六、工具管线：五阶段守卫管道

`ctx.tools` 的执行管线（`tools/src/index.ts:1342+`）：

```text
createExecution        ← 参数 JSON 快照 + 冻结；code-mode 折叠在策略之前拒绝
  → tools/pre-execute  (waterfall)  ← allow / deny / ask（审批桥在此）
  → guardReason        (单调守卫：guard 包的超时/重复调用提醒)
  → tools/execute      (waterfall, around)  ← 超时/重试/metrics 包装层
      → dispatchToolBody             ← 信号融合：调用方 abort 不可被 wrapper 剥离
  → tools/post-execute (waterfall)  ← spill 策略在此决定大结果外溢
  → finalizeContent    (工具自定义收尾，如 diff 卡片)
  → tools/result       (emit，冻结快照，UI/遥测观察)
```

两个信号处理的精妙之处：

1. **信号融合**（`dispatchToolBody`，`index.ts:1537`）：around wrapper 可以替换 `exec.signal` 实现超时，但注册表在调用工具体前把**原始调用方信号融合回来**——wrapper 永远无法让工具"看不到用户的取消"
2. **取消结果二选一**：`bodyInvoked` 标志决定返回 `ABORTED_BEFORE_DISPATCH` 还是 `ABORTED`——模型能区分"没跑"和"跑了但被掐断"

## 七、LLM seam：故障域隔离

`LlmRuntime`（`llm/index.ts:284+`）的边界设计：

- **adapter 故障 → 终态 chunk**：选择失败、派发失败、迭代抛错全部转化为 `finish: {kind:'error'|'aborted'}` chunk（`adapterStream`，`index.ts:843-900`）——**流协议内消化**，不让异常逃逸成未处理拒绝
- **中间件/消费者故障 → 照常抛出**：`llm/stream` waterfall 的监听器错误不属于 adapter 故障域，保持 thrown——两类故障的处理策略刻意不同
- **replay state 的跨 adapter 清除**（`forAdapter`，`index.ts:823-836`）：历史消息里属于别的 adapter 的回放状态被剥离——换 provider 时不会把 DeepSeek 的 reasoning 状态喂给别家

## 八、架构师总评：五个核心设计决策

1. **日志即真相的彻底性**：inbox、request/header、chunk 级流、工具结果、甚至 inbox splice 全部是持久事件。任何内存状态都是日志的投影，replay/fork/恢复/遥测全部零额外成本
2. **扩展点即 waterfall**：`agent/pre-step`（改写输入）、`agent/request`（改配置）、`llm/stream`（包流）、`tools/*`（三层策略）——所有拦截都是 around-middleware，监听器必须显式 `next()`，短路是显式决策而非意外
3. **取消是一等公民**：每个边界都有 `signal.throwIfAborted()`；取消不产生日志洞（合成结果补齐）；abort 期间的唤醒被闩锁而非丢弃
4. **并发与顺序解耦**：工具派发并行以拿吞吐，日志提交串行以保模型序——两个关注点互不妥协
5. **故障域分层**：adapter 故障→流内终态、工具故障→错误结果、调度器故障→抛出且绝不伪造、插件监听器故障→隔离告警。每一层的故障语义都是显式选择
