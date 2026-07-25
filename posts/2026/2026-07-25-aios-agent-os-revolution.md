---
type: article
title: "AI OS：智能体操作系统的范式革命 —— 巨头布局、核心本质与架构设计深度调研"
date: 2026-07-25 20:25:00 +0800
tags: [aios, agent, step, android, linux, rtos, kimi-k3]
---

> 多智能体深度调研成果
>
> **一句话结论**：六家科技巨头已全部下场做 AI OS，2025–2026 年集中爆发；学界与产业界对其核心要素（记忆 / 决策 / 行动 / 安全四大系统原语）的定义高度收敛——AI OS 已从营销概念变成架构共识，竞争焦点转向「协议路线 vs GUI 路线」与「重构 vs 叠加」。

- [【Kimi】AI OS:智能体操作系统的范式革命
六巨头布局、核心本质与架构设计深度调研](https://5s7dly6oinj3i.ok.kimi.link)

---

## Section 01 · 新闻背景

### 2026-07-13：阶跃星辰「四件套」发布，AI OS 之争进入白热化

上海「阶跃终端品牌暨新一代智能体战略发布会」上，大模型公司阶跃星辰一口气发布四件产品，宣称构建「模、软、硬」三位一体闭环，并提出智能体落地的「三堵墙」理论。[1][2]

- **品牌**：**STEPX** —— 大模型原生 AI 终端品牌。阶跃公式：「Step 模型矩阵 × Step Agentic-native OS」。[3]
- **操作系统**：**Step AOS** —— 「全球首个智能体原生操作系统」。官方口径为在 Android/Linux/RTOS 之上重构的智能体原生中间层，向下兼容。[4]
- **个人智能体**：**阶跃Amoo** —— 拥有操作系统级身份：跨应用调度、端云协同、多设备任务接续，「越用越懂用户」。
- **硬件**：**STEPX Neo** —— 大模型原生智能体手机，背部点阵 LED 像素副屏，华勤技术代工；WAIC 2026 首秀即获「镇馆之宝」。[5][6]

#### 关键事实与争议点

- **「三堵墙」理论**：印奇提出智能体落地的结构性障碍：**记忆墙**（数据割裂在 App 沙箱）、**决策墙**（端云各自为政）、**行动墙**（智能体无原生接口，只能模拟点击）。阶跃的解法是「为智能体盖一座房子，而非开一扇门」。[1]
- **原子能力引擎**：以 MCP 标准把系统底层能力拆为 **通讯 / 应用 / 文件 / 系统** 四大类最小能力单元，智能体经协议直接调用底层 API——被称为给了智能体「合法双手」。[9]
- **双域记忆 · 15ms**：「用户域 + 智能体域」双域、「记—理—忆」三步链路；官方自报日常问答记忆召回最快 **15ms**，宣称多项国际记忆基准达 SOTA（尚无第三方验证）。
- **国标 L3 认证**：STEPX Neo 通过首批《人工智能终端智能化分级》国标 **L3 级** 测试，为目前唯一获 L3 证书的智能体手机；阶跃并联合上海 AI 实验室发布智能体安全白皮书。[7][17]
- **生态伙伴名单**：美团、支付宝、携程、高德、百度、京东、滴滴、WPS 等已接入；但 **微信、淘宝、抖音缺席**——腾讯是阶跃重要股东，微信却未站台，被指是「流量主权」问题。[11]
- **未公布售价 · 备案缺席**：硬件参数、售价、上市时间均未公布，首批或采用邀请制；首批手机端侧生成式 AI 备案名单（7 款）中 **阶跃与荣耀双双缺席**，被视为能否公开发售的关键变量。[8][12]

> 新闻眼的另一面：发布会无真机体验区，印奇自评「产品答案完成约 70%」，并与行业立下「100 天之约」——约 2026 年 10 月下旬的「下半场」发布会才公布完整硬件与成熟系统。多家媒体以「没有真机的发布会」「只发布了一半」为题报道；分析普遍认为这场发布会同时是其港股 IPO 叙事的一环（5 月完成近 25 亿美元 Pre-IPO 轮融资）。[12]

---

## Section 02 · 核心问题一

### 「这几家是不是都在做 AI OS？」——是，全部都在做

2025–2026 年集中爆发，但分属两条技术路线，对「AI OS」的定义与深度差异很大。以下矩阵经九份维度报告交叉验证（置信度：高）。

| 公司 | 核心产品 / 系统 | 路线 | 关键架构特征 | 状态(截至 2026-07) | 开放性 |
|------|----------------|------|--------------|---------------------|--------|
| 阶跃星辰 | Step AOS + 阶跃Amoo + STEPX Neo | AI 原生重构（模型公司视角） | 原子能力引擎(MCP 化系统调用)；双域三步记忆(15ms 召回)；端云多脑决策；四维安全；Step Edge 端侧模型 | 2026-07-13 发布；唯一获国标 L3 的智能体手机；参数售价未公布，端侧备案缺席 | 模型已开源(Apache 2.0)；OS 未开源；生态走 API 协议 |
| 华为 | HarmonyOS 6/7 + 小艺 + HMAF | 新 OS 地基上的 AI 原生深化 | 鸿蒙智能；HMAF 智能体框架；系统能力 Skill 化；「意图即服务」；鸿蒙 7 内核嵌入盘古 6.0 | 国内最深、最体系化；余承东称「首个完成 AI 化改造的操作系统」；Pura X Max 等获首批 L3 认证[14][15] | OpenHarmony 开源底座；AI 框架部分开放 |
| 荣耀 | MagicOS 10 → Agentic OS + YOYO | 渐进演进（终端厂商中最激进） | 8.0 意图识别 → 9.0「首个智能体 AI OS」→ 10「自进化」→ Agentic OS；系统级 MCP、4000+ 生态；UI Agent + MCP 双轨 | 阿尔法战略(5 年 100 亿美元)；YOYO 获信通院 L3 卓越型；Robot Phone 2026-08 首发 Agentic OS 内核[19][21] | 部分能力开放给开发者；生态协议路线 |
| 苹果 | Apple Intelligence + Siri AI | OS+AI 渐进（最保守） | WWDC26 发布 Siri AI：Google Gemini 云端合作 + AFM 3 端云五模型(3B 端侧 + 20B 稀疏)；App Intents 跨应用接口；Private Cloud Compute | 2025 延期、2.5 亿美元诉讼和解、高管换血；国行 2026-07-08 完成备案(阿里千问+百度)，上线待定；EU 因 DMA 搁浅[23][26] | Foundation Models 框架开放端侧模型；整体封闭 |
| 谷歌 | Android + Gemini(AICore / Nano) | OS+AI 渐进（渗透最深） | Gemini Nano / AICore 端侧底座；Pixel 10 / S26 落地屏幕自动化跨 App 执行；Android 17 引入 AppFunctions + 端侧 MCP；Android Halo 智能体枢纽 | Gemini 2026 年内全面替换 Assistant；Pichai 定调「agentic Gemini era」；ChromeOS 并入 Android[27][30] | Android/AOSP 开源底座；模型封闭 |
| 微软 | Windows → agentic OS + Copilot | 桌面 OS 叠加 Agent 层（表述最明确） | 「Windows is evolving into an agentic OS」；MCP 端侧注册表、Agent Workspace 隔离容器、独立 Agent 账户；Build 2026 发布 Windows Agent Runtime 与 Agent 365 | 企业 Agent 生态最强；2026 初因用户反弹回调 UI 层 Copilot，底层投入未变[31][33] | MCP 共同发起方；部分开源(Agent Framework) |

> 一行结论：六家全部在做 AI OS——中国厂商在「行动闭环」上集体快于苹果；阶跃/荣耀/华为偏「重构」，苹果/谷歌/微软偏「叠加」，但终点正在收敛。
> 判断依据：九份维度报告、300+ 条来源交叉验证；关键分歧点（如 Step AOS 是否为独立 OS）已并列呈现双方表述。

### 其他重要玩家

- **字节跳动 × 努比亚**：NaviX Ultra（WAIC 2026 亮相，「全球首款量产 AI 智能体手机」）：系统级 **GUI Agent**（看屏模拟点击）+ MCP/A2A 双轨；率先完成智能体大模型备案；一代工程机曾被微信等 App 封杀。[48][49]
- **小米**：澎湃OS 4（2026 年 7–8 月发布）：超级小爱 × miclaw 智能体（自研 MiMo 大模型、系统底层高权限、50+ 系统功能调度），从「对话式」转向「行动式」。[47]
- **vivo**：蓝河 BlueOS 3：全栈 Rust、「为原生 AI 设备而来」，**内核已开源**；OriginOS 6 + 蓝心智能体。周围 2023 年即预言「蓝河是为未来有智能体的手机做的 OS」。[46]
- **OPPO / OpenAI**：ColorOS 16 以「小布记忆」+ 一键闪记 + 小布智能体为核心。另有报道 OpenAI 推进智能体手机计划（2027–2028，立讯精密，单源待验证）。

---

## Section 03 · 路线之争

### 两条技术路线：「OS+AI 渐进叠加」 vs 「AI 原生重构」

路线分野的本质：是在既有 OS 上为智能体「开一扇门」，还是为智能体「盖一座房子」。两条路线并存，长期看协议化的能力开放比 GUI 模拟点击更可持续。

#### OS+AI 渐进叠加（Incremental Overlay · 苹果 / 谷歌 / 微软）

- **思路**：在成熟 OS 之上叠加 AI 能力与 Agent 层，不动地基，生态兼容性最好
- **苹果**：App Intents / App Schemas 作为跨应用执行接口，Private Cloud Compute 保隐私，最保守
- **谷歌**：AICore/Gemini Nano 渗透系统底层；屏幕自动化（虚拟窗口+云端推理+人在回路）先落地
- **微软**：桌面 OS 叠加 Agent 基础设施（MCP 注册表 / Agent Workspace / 独立 Agent 账户），默认关闭的安全模型
- **风险**：「在旧系统上给 Agent 开门，它永远是访客」——记忆与行动仍受应用沙箱约束

#### AI 原生重构（AI-Native Rebuild · 阶跃 / 荣耀 / 华为）

- **思路**：为智能体重构运行环境，把记忆、决策、行动、安全做成系统原语
- **阶跃**：原子能力引擎（MCP 化系统调用）+ 双域记忆 + 端云多脑，API 协议路线「与豆包 GUI 路径截然不同」
- **荣耀**：MagicOS 十年演进至 Agentic OS，「以任务为本重构操作系统」，系统级 MCP
- **华为**：在新 OS（鸿蒙）地基上做 AI 原生深化，内核嵌入盘古，「意图即服务」
- **风险**：生态冷启动难——无硬件入口与头部 App 配合，重构越深越难落地

> 第三条路径并存：GUI Agent（豆包 / 谷歌屏幕自动化）用「看屏+模拟点击」绕过协议谈判，见效快但脆弱——豆包一代曾被微信等 App 以「外挂」风控封杀；协议路线（MCP）正在成为智能体时代的「系统调用标准」。谁掌握原子能力的标准化拆分，谁就掌握 Agent 时代的 POSIX。[34]

---

## Section 04 · 核心问题二

### 「AI OS 的核心应该是什么？」

学界与产业界答案高度收敛（置信度：高）。

AI OS 为「能自主理解意图、持续规划、跨应用行动的智能体」提供 **一等公民级的运行环境**——把 **记忆、决策、行动与安全** 组织成系统原语，而非应用层叠加功能。

### 从「三堵墙」到「四大系统原语」

- **01 记忆墙**：个人数据割裂在各 App 沙箱中，智能体无法形成连续、可沉淀的用户认知。
- **02 决策墙**：端侧与云端模型各自为政，缺乏按任务复杂度、成本、隐私统一调度的决策中枢。
- **03 行动墙**：智能体没有原生系统接口，只能「用肉眼识别按钮、模拟点击」，脆弱且易触发风控。

> 三堵墙是 OS 层面的结构性问题，应用内功能叠加无法解决 —— 破墙需要四个系统原语

- **忆 · 记忆 Memory**：双域分层记忆（用户域/智能体域），「记—理—忆」三步链路 + 后台整理（sleep-time compute）
- **策 · 决策 Decision**：端云多脑路由，「能端则端、需云得云」，按延迟-隐私-成本三变量动态选模
- **行 · 行动 Action**：原子能力引擎 + MCP 协议化系统调用，让智能体获得「合法双手」而非模拟点击
- **安 · 安全 Trust**：可信 / 可见 / 可控 / 可逆：TEE、最小权限用完即收、全程可审计、误操作一键撤回

### 传统 OS → AI OS 概念映射（核心科普）

| 传统 OS | AI OS |
|---------|-------|
| 内核(Kernel) | LLM / 推理内核(Reasoning Kernel) |
| 进程 / 线程 | Agent 实例 / 任务 |
| 系统调用(syscall) | 工具调用 / MCP 原子能力 |
| 物理内存 + 虚拟内存 | 上下文窗口 + 外部记忆分层(分页 / 换入换出) |
| 调度器 | Agent / 模型调度器(端云路由:延迟-隐私-成本三变量) |
| 文件系统 | 记忆系统(用户域 / 智能体域；记-理-忆) |
| 权限 / 用户账户 | Capability 最小权限 + Agent 独立账户 + 审计 |
| 设备驱动 / 硬件抽象 | 原子能力引擎 / 系统 Skill 化 |
| GUI / 桌面 | NUI 自然交互(语音 / 视觉 / 文字多模态，意图驱动) |

### 权威声音

> 在旧系统上给 Agent 开一扇门，它永远是访客；为 Agent 盖一座房子，它才是原住民。
> **印奇** · 阶跃星辰董事长，2026-07-13 发布会「三堵墙」理论[1]

> Agentic OS 的本质是以任务为本重构操作系统，让任务的最终完成取代功能的简单堆叠。程序是一条线，智能是一个环。
> **黄非** · 荣耀 AI 首席科学家；调度对象从进程/线程质变为「意图与任务」[45]

> 传统 OS 管硬件和人写的应用软件，Agentic OS 管的是智能体——多个智能体的调度、协作和安全，相当于在原来的 OS 上加一层认知。
> **郑纬民** · 中国工程院院士，WAIC 2026；阿里许主洪同场：「表面看是入口之争，其实是 Agent 智能之争」[45]

---

## Section 05 · 核心问题三

### 「AI OS 架构怎么设计？」——六层参考架构

综合学界（AIOS / MemGPT / AgentOS / Quine）与产业（阶跃 / 荣耀 / 华为 / 微软 / 谷歌）的收敛模型，自上而下六层，安全与信任横切其中。

1. **交互层(NUI) · Natural User Interface**
   语音 / 视觉 / 文字多模态输入，意图驱动的「结果式交互」：「人操作应用」→「人表达意图，Agent 闭环」。GUI 不消失，但退为 Agent 的展示与确认界面。
   - 阶跃 NUI 结果交互 / Android Halo 智能体枢纽 / 荣耀任意门

2. **智能体层(Agent 运行时) · Agent Runtime**
   个人智能体常驻；任务拆解与规划（ReAct / Planner）、多智能体协作（A2A）；Agent 调度与生命周期管理——类进程管理。
   - 阶跃Amoo / 荣耀 YOYO / 华为小艺 / Siri AI / Gemini / Copilot / Scout

3. **AI 内核层 · AI Kernel · Reasoning Kernel**
   模型调度（端云多脑路由）、上下文管理（语义切片 / 时间对齐）、记忆系统（双域分层 + 后台整理 sleep-time compute）、决策引擎。
   - Step AOS 端云多脑 + 双域记忆 / 鸿蒙 7 内核嵌入盘古 6.0 / 苹果 AFM 3 端云五模型

4. **能力层(行动通道) · Atomic Capabilities · MCP**
   原子能力引擎——把通讯 / 应用 / 文件 / 系统能力拆为可调用的最小单元；MCP 作为「系统调用协议」。API 协议路线 vs GUI Agent 路线并存，长期看协议路线更可持续。
   - Step AOS 原子能力引擎 / 微软 MCP 端侧注册表 / 荣耀系统级 MCP / Android 17 AppFunctions + 端侧 MCP / 苹果 App Intents

5. **底座层 · Foundation**
   传统 OS（Android / Linux / RTOS / Windows / 鸿蒙）+ 端侧模型（1–3B 黄金档）+ NPU 算力 + 云端旗舰模型。
   - Step Edge + Step Inference NPU / Gemini Nano / AICore / Phi Silica + 40 TOPS NPU / OpenHarmony / 蓝河 BlueOS(Rust)

6. **安全与信任层(横切)**
   TEE 可信执行环境 · 最小权限按需授予、用完即收 · 全程可审计 · 操作可逆一键撤回 · Agent 独立身份 / 账户。中国已出现反不正当竞争法层面的跨 App 合规争议。
   - 阶跃四维安全 / 微软 Agent Workspace 隔离容器 / 苹果 Private Cloud Compute / 信通院 L1–L4 分级国标

> ▲ 自上而下：L1 交互层 → L2 智能体运行时层 → L3 AI 内核层(核心创新区) → L4 能力层 → L5 底座层；安全与信任层横切全部层级。

### 学术谱系：从论文到产业

- **2023 · UC Berkeley · MemGPT**：把上下文窗口视为虚拟内存：主上下文 ≈ RAM，外部上下文 ≈ 磁盘，LLM 自主分页换入换出。「LLM 只是 CPU，需要造一台完整计算机」。[36]
- **2024 · Rutgers · AIOS**：「LLM as OS, Agents as Apps」：LLM 内核 + 六模块（调度/上下文/记忆/存储/工具/权限），开源实现 6.1k stars。[35]
- **2026 · arXiv · AgentOS**：把 LLM 重定义为 Reasoning Kernel：Deep Context Management，将上下文概念化为「可寻址语义空间」，语义切片 + 时间对齐。[37]
- **2026 · arXiv · Quine**：反向路径：把 Agent 的身份、接口、状态、生命周期直接映射为 POSIX 进程语义（fork/exec/管道），OS 成为 Agent 的一等运行时基底。[38]

---

## Section 06 · 开源机会

### 想做一个开源原生 AI OS？先看版图与窗口

协议生态已定局（MCP + A2A 已入 Linux 基金会），不可另造协议，应在协议之上做实现。stars 数据为 GitHub API 2026-07-25 实查。

### 已有项目盘点

- **384k** OpenClaw stars——本地优先个人智能体现象级爆发，证明隐私 / 数据主权 / 本地运行是真实需求[40]
- **220k** Hermes Agent stars——自我进化路线，8 周 9.9 万 stars 创 2026 年增速纪录
- **6.1k** AIOS(Rutgers) stars——验证 LLM 内核架构，但生态未满，产业化缺口明显[39]
- **24k / 2k** Letta(MemGPT 商业化，记忆 OS 化) / OpenDAN(个人 AI OS，冷启动基本停滞)
- 反面样本同样值得注意：OSUniverse（24 stars）与 Open Interpreter 01 硬件计划均已失败或停滞；阶跃已开源 Step 3 / 3.5 Flash（Apache 2.0）但缺端侧小模型；vivo 开源蓝河内核（Rust）。[50]

### 四个差异化切入点（机会窗口）

- **切入点 01 · 安全内核 + 权限模型**：巨头各自为政，开源世界缺一个 **可审计、最小权限、可逆操作** 的 Agent 安全运行时——横切信任层是共识最薄弱处，也是开源社区唯一可能建立事实标准的层。
- **切入点 02 · 个人数据主权 + 本地优先记忆系统**：OpenClaw 现象验证了需求；「用户域 / 智能体域」双域记忆目前 **尚无开源标杆实现**。
- **切入点 03 · MCP 之上的 Agent 内核**：调度器 + 上下文管理 + 记忆管理 + 工具管理的参考实现——补上 AIOS 的产业化缺口，做「Agent 时代的微内核」。
- **切入点 04 · 端侧小模型适配层**：1–3B 端侧模型与 OS 能力的桥接；阶跃开源模型缺端侧档、蓝河内核刚开源，缝隙尚在。

### 风险警告

- **最大的风险不是技术，而是生态位**
  - **巨头环伺**：六家全部下场，框架层（LangGraph / CrewAI / AutoGen）、平台层（Dify 150k）、协议层（MCP / A2A）、个人代理层（OpenClaw / Hermes）四面合围；
  - **生态冷启动**：无硬件入口，OpenDAN、OSUniverse、01 硬件均是前车之鉴；
  - **可靠性鸿沟**：实验室基准与真实工作流差距巨大（见下节），商业化节奏受限；
  - **合规不确定性**：跨 App 操作在中国已触发反不正当竞争法层面争议，豆包一代被封杀是警示。

> 开源的最优解不是「再造一个 Android」，而是做「Agent 时代的安全内核与记忆层」——协议已定局、硬件入口无望，横切信任层与个人数据主权是唯一可能建立事实标准的层。

---

## Section 07 · 挑战与展望

### 可靠性鸿沟、合规争议与 2026 下半年看点

### 可靠性鸿沟：实验室分数 ≠ 真实世界

- **72.6%** OSWorld 基准上 Agent 成功率（2025-12，Simular Agent S，首超人类基线 72.36%；但依赖多次采样，且公开基准可被 exploit agent 攻破）[44]
- **<5%** SCUBA（Salesforce 真实企业工作流，300 任务）上开源 Agent 零样本成功率不足 5%，闭源最好也仅 39%[43]

> 这条鸿沟解释了产业界的共性谨慎：阶跃「概念先行、邀请制试水」，微软「底层投入、UI 回调」，苹果反复延期——在跨 App 任务成功率可验证之前，「全球首款」更多是定义权卡位。

### 合规争议

- **跨 App 操作的法律边界**：豆包一代曾被微信 / 美团 / 淘宝 / 银行 App 以「外挂」风控封杀；跨 App 操作已触发反不正当竞争法层面争议。「能自主转账、订票、读写隐私文件的数字管家，一旦授权失控便有从助手变内鬼的风险。」
- **接口议价权博弈**：「封不封」解决后，博弈变成「开多深」——接口开放深度成为新的定价权力杠杆；2026 年 6 月微信、支付宝、京东、银联集体进入 AI 支付协议层，大厂意在自主掌控最高价值接口。[1]

### 2026 下半年看点时间线

- **2026 · 8月**：小米澎湃OS 4 发布——全量 AI 能力为核心设计主线，超级小爱 × miclaw 智能体深度融合；消息称 8 月推送 70+ 机型。[47]
- **2026 · 8月**：荣耀 Robot Phone 首发 Agentic OS 内核——阿尔法战略三步走的关键落子，机器人形态手机承载「以任务为本」的下一代系统。[21]
- **2026 · 待定(备案后)**：STEPX Neo 上市与端侧备案——端侧备案缺席是关键变量；「100 天之约」下半场（约 10 月下旬）将公布完整硬件与成熟系统。
- **2026 · 待定**：国行 Apple Intelligence 上线——2026-07-08 已完成备案（阿里千问 + 百度合作），正式上线时间待定。[26]
- **2026 · 下半年**：Android 17——引入 AppFunctions + 端侧 MCP，迈向「智能系统」；Gemini 年内全面替换 Assistant。[29]

---

## Section 08 · 参考资料

### 主要来源（节选 50 条）

自 9 份维度报告、300+ 条来源中选取最重要者，按主题排序；正文括号内编号与此处一一对应。

1. 每日经济新闻《三堵墙、百日期、生态壁垒……印奇硬闯硬件红海》, 2026-07-15 — [mrjjxw.com](https://www.mrjjxw.com/articles/2026-07-14/4472667.html)
2. 财新《阶跃星辰发布智能体操作系统 展示首款AI手机STEPX Neo》, 2026-07-14 — [caixin.com](https://www.caixin.com/2026-07-14/102464043.html)
3. 雷峰网《为智能体重新设计操作系统:全球首个智能体原生操作系统Step AOS发布》, 2026-07-13 — [finance.sina.cn](https://finance.sina.cn/stock/jdts/2026-07-14/detail-inihtvtz7339387.d.html)
4. 蓝鲸新闻《印奇:阶跃手机与豆包手机有何不同?》, 2026-07-14 — [10jqka.com.cn](https://m.10jqka.com.cn/20260714/c678166143.shtml)
5. 新华报业《WAIC 2026「镇馆之宝」揭晓:STEPX Neo智能体手机正式亮相》, 2026-07-17 — [xhby.net](https://www.xhby.net/content/s6a59f61be4b03d9ce7970a2e.html)
6. IT之家《WAIC 2026现场实拍:阶跃终端首款智能体手机STEPX Neo亮相》, 2026-07-17 — [view.inews.qq.com](https://view.inews.qq.com/a/20260717A07FX700)
7. 财联社 / 科创板日报《阶跃与上海人工智能实验室发布〈新一代智能体系统安全技术白皮书〉》, 2026-07-13 — [cls.cn](https://www.cls.cn/detail/2424865)
8. 南方都市报《苹果AI、豆包手机通过备案,刚发布AI手机的阶跃星辰缺席》, 2026-07-15 — [eastmoney.com](https://wap.eastmoney.com/a/202607153807672882.html)
9. 36氪《中国基模的压哨入局者,先一步布局智能体时代》, 2026-07-16 — [36kr.com](https://www.36kr.com/p/3895632583394947)
10. 36氪 / 虎嗅《阶跃星辰怎么会这么完美?》, 2026-07-15 — [36kr.com](http://www.36kr.com/p/3896188092400773)
11. 界面新闻《阶跃手机的AI原生叙事,听听就好》, 2026-07-13 — [jiemian.com](https://m.jiemian.com/article/14771551.html)
12. 经济观察报《阶跃星辰闯入手机红海》, 2026-07-15 — [eeo.com.cn](http://m.eeo.com.cn/2026/0715/958428.shtml)
13. 与非网《AI手机的真问题从来不是智能,是信任》, 2026-07-20 — [eefocus.com](https://www.eefocus.com/article/2053283.html)
14. 华为官网《HarmonyOS 7 开发者 Beta 正式启动,全场景智能操作系统再升级》, 2026-06-12 — [huawei.com](https://www.huawei.com/cn/news/2026/6/harmonyos7-hdc)
15. IT之家《鸿蒙 HarmonyOS 7 正式发布:从「万物互联」正式迈进「Agent 时代」》, 2026-06-12 — [ithome.com](https://www.ithome.com/0/963/594.htm)
16. 新华社《经济参考报》《抢滩智能体底层架构 中国AI谋求定义权》, 2026-07-17 — [jjckb.xinhuanet.com](http://jjckb.xinhuanet.com/20260717/a4454b9bc05e4be38fde14c782d1f1e6/c.html)
17. 财新《首批人工智能终端L3级认证结果公布 17家企业共66款产品获证》, 2026-07-17 — [caixin.com](https://www.caixin.com/2026-07-17/102465349.html)
18. 爱范儿《鸿蒙全面向Agent架构演进,小艺做了这三件事》, 2026-06-14 — [ifanr.com](https://www.ifanr.com/1668931)
19. 荣耀官网《MWC上海|荣耀定义 Agentic OS 下一代移动终端操作系统》, 2026-06-24 — [honor.com](https://www.honor.com/cn/news/honor-agentic-os/)
20. 人民网深圳《荣耀发布新一代移动终端操作系统Agentic OS》, 2026-06-26 — [people.com.cn](http://sz.people.com.cn/n2/2026/0626/c202846-41622443.html)
21. IT之家《荣耀 AgenticOS 发布,8 月 Robot Phone 首发内核》, 2026-07-19 — [ithome.com](https://www.ithome.com/0/978/621.htm)
22. 荣耀官网《荣耀阿尔法战略发布,以开放向全球领先的AI终端生态公司转型》, 2025-03-03 — [honor.com](https://www.honor.com/cn/news/honor-alpha-mwc-2025/)
23. Apple Newsroom《WWDC26: Apple unveils next generation of Apple Intelligence, Siri AI…》, 2026-06-08 — [apple.com](https://www.apple.com/newsroom/2026/06/apple-unveils-next-generation-of-apple-intelligence-siri-ai-and-more/)
24. Apple Machine Learning Research《Introducing the Third Generation of Apple's Foundation Models》, 2026-06-08 — [machinelearning.apple.com](https://machinelearning.apple.com/research/introducing-third-generation-of-apple-foundation-models)
25. MacRumors《Apple to Pay $250 Million to Settle Class Action Over Delayed Siri Features》, 2026-05-05 — [macrumors.com](https://www.macrumors.com/2026/05/05/apple-class-action-siri-lawsuit-settlement/)
26. 财新《Apple智能等7款手机端侧模型完成备案 阿里千问将集成至国行苹果终端》, 2026-07-15 — [caixin.com](https://www.caixin.com/2026-07-15/102464614.html)
27. 9to5Google《Gemini automation on Pixel 10, S26 can book rides and place orders》, 2026-02-25 — [9to5google.com](https://9to5google.com/2026/02/25/gemini-automation-android/)
28. Google 官方博客《The Android Show: I/O Edition 2026》, 2026-05-12 — [blog.google](https://blog.google/products-and-platforms/platforms/android/android-show-io-edition-2026/)
29. ByteIota《Android AppFunctions API Powers Gemini Intelligence Now》, 2026-05-17 — [byteiota.com](https://byteiota.com/android-appfunctions-api-powers-gemini-intelligence-now/)
30. The Verge《The 13 biggest announcements at Google I/O 2026》, 2026-05-19 — [theverge.com](https://www.theverge.com/tech/933415/google-io-2026-biggest-announcements-ai-gemini)
31. VentureBeat《Microsoft remakes Windows for an era of autonomous AI agents》, 2025-11-18 — [venturebeat.com](https://venturebeat.com/technology/microsoft-remakes-windows-for-an-era-of-autonomous-ai-agents)
32. Windows Experience Blog(官方)《Securing AI agents on Windows》, 2025-10-16 — [blogs.windows.com](https://blogs.windows.com/windowsexperience/2025/10/16/securing-ai-agents-on-windows/)
33. Redmondmag《The 4 Microsoft Build 2026 Announcements That Matter Most》, 2026-06-08 — [redmondmag.com](https://redmondmag.com/articles/2026/06/08/the-4-microsoft-build-2026-announcements-that-matter-most.aspx)
34. The New Stack《Why the Model Context Protocol Won》, 2025-12-07 — [thenewstack.io](https://thenewstack.io/why-the-model-context-protocol-won/)
35. arXiv 论文《AIOS: LLM Agent Operating System》(Mei et al., Rutgers, COLM 2025), 2024-03 / v5 2025-08 — [arxiv.org/abs/2403.16971](https://arxiv.org/abs/2403.16971)
36. arXiv 论文《MemGPT: Towards LLMs as Operating Systems》(Packer et al.), 2023-10 — [arxiv.org/abs/2310.08560](https://arxiv.org/abs/2310.08560)
37. arXiv 论文《Architecting AgentOS: From Token-Level Context to Emergent System-Level Intelligence》, 2026-02 — [arxiv.org/abs/2602.20934](https://arxiv.org/abs/2602.20934)
38. arXiv 论文《Quine: Realizing LLM Agents as Native POSIX Processes》, 2026-04 — [arxiv.org/abs/2603.18030](https://arxiv.org/html/2603.18030v2)
39. GitHub agiresearch/AIOS 官方仓库(架构与引用文献), 实查 2026-07-25 — [github.com/agiresearch/AIOS](https://github.com/agiresearch/AIOS)
40. agenticera《OpenClaw 2026: The Open-Source Agent That Quietly Changed Everything》, 2026-05-17 — [agenticera.fyi](https://agenticera.fyi/openclaw-the-open-source-agent-that-quietly-changed-everything/)
41. Linux Foundation《Announces the Formation of the Agentic AI Foundation (AAIF)》, 2025-12-09 — [linuxfoundation.org](https://www.linuxfoundation.org/press/linux-foundation-announces-the-formation-of-the-agentic-ai-foundation)
42. Linux Foundation《A2A Protocol Surpasses 150 Organizations》, 2026-04-09 — [linuxfoundation.org](https://www.linuxfoundation.org/press/a2a-protocol-surpasses-150-organizations-lands-in-major-cloud-platforms-and-sees-enterprise-production-use-in-first-year)
43. arXiv 论文《SCUBA: Salesforce Computer Use Benchmark》, 2025-09 — [arxiv.org/abs/2509.26506](https://arxiv.org/abs/2509.26506)
44. OSWorld 官方项目页(xlang-ai,真实 OS 环境 Agent 基准), 持续更新 — [osworld-v1.xlang.ai](https://osworld-v1.xlang.ai/)
45. 富途资讯《手机不会「消亡」,但它正在变成另一个物种|WAIC 观察》(郑纬民 / 许主洪 / 黄非言论), 2026-07-19 — [futunn.com](https://news.futunn.com/en/post/76235338)
46. vivo 官方 BlueOS 蓝河操作系统官网(全栈 Rust,内核已开源), 访问于 2026-07 — [blueos.vivo.com](https://blueos.vivo.com/)
47. 中关村在线《小米官宣澎湃OS 2026 年夏发布:AI 深度融合、架构全面重构》, 2026-05-28 — [zol.com.cn](https://ai.zol.com.cn/1188/11883133.html)
48. 东方财富《二代豆包手机将亮相 WAIC 2026,AI 智能体成终端标配战升温》, 2026-07-16 — [eastmoney.com](https://wap.eastmoney.com/a/202607163809281481.html)
49. ZAKER《努比亚 NaviX Ultra 亮相 WAIC:全球首款量产 AI 智能体手机》, 2026-07-19 — [myzaker.com](https://app.myzaker.com/news/article.php?pk=6a5b5e518e9f09185c581f79)
50. GitHub stepfun-ai/Step-3.5-Flash(阶跃开源模型,Apache 2.0,含 Agent 基准表), 实查 2026-07-25 — [github.com/stepfun-ai/Step-3.5-Flash](https://github.com/stepfun-ai/Step-3.5-Flash)
