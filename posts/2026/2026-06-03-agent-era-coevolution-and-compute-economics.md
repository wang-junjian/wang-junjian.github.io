---
type: article
title:  "协同进化：寻找智能体时代效率与商业的平衡点（罗福莉）"
date:   2026-06-03 11:00:00 +0800
tags: [anthropic, mimo, claude-code, openclaw, opencode, token-plan, agent-harnesses, compute-economics, prompt-cache, 协同进化]
---

> 罗福莉 2026年4月6日

两天前，Anthropic 切断了第三方客户端（Harnesses）使用 Claude 订阅的通道——这并不令人意外。三天前，MiMo 推出了其 Token 计划（Token Plan）——这是一个我投入了大量精力去设计的方案，也是我认为在实现合理的算力分配和智能体客户端开发方面一次严肃的尝试。将这两件事结合起来，我有以下几点思考：

1. **Claude Code 的订阅制是一个专为平衡算力分配而设计的精美系统。** 我的猜测是——它并不赚钱，甚至可能在亏本，除非他们的 API 利润率高达 10-20 倍，但我对此深表怀疑。虽然我无法严密地计算出第三方客户端接入所带来的损失，但我近距离观察过 OpenClaw 的上下文管理——它真的很糟糕。在单个用户查询中，它会把一轮轮低价值的工具调用作为独立的 API 请求发送出去，每个请求都携带长达 100K 以上 Token 的长上下文窗口——即便有缓存命中，这也是极大的浪费，在极端情况下还会推高其他查询的缓存未命中率。其单次查询的实际请求次数最终比 Claude Code 自身框架高出数倍。折算成 API 定价的话，真实成本恐怕是订阅价格的几十倍。这不仅是一个差距，而是一个巨大的黑洞。
2. **像 OpenClaw/OpenCode 这样的第三方客户端依然可以通过 API 调用 Claude——它们只是不能再薅订阅制的羊毛了。** 短期内，这些智能体用户会感到阵痛，成本极有可能飙升几十倍。但这种压力恰恰会倒逼这些客户端去优化上下文管理、最大化提升提示词缓存（Prompt Cache）的命中率以复用已处理的上下文，并减少无谓的 Token 消耗。痛苦最终会转化为工程上的严谨与克制。
3. **我强烈呼吁大模型公司不要在搞清楚如何为编程套餐定价且不亏本之前，就盲目地进行价格战、卷到行业底层。** 廉价销售 Token 却对第三方客户端敞开大门，看似对用户友好，实则是一个陷阱——正是 Anthropic 刚刚踩进去又退出来的那个陷阱。更深层次的问题在于：如果用户把精力浪费在低质的智能体客户端、极度不稳定且缓慢的推理服务，以及为了削减成本而降级的大模型上，结果却发现依然什么事也做不成——这对于用户体验或留存率来说，绝不是一个健康的循环。
4. **关于 MiMo Token 计划——它支持第三方客户端，按 Token 配额计费，这与 Claude 最新推出的额外用量包逻辑一致。** 因为我们追求的是长期、稳定地交付高质量的模型与服务——而不是吸引你冲动消费后便任由你弃船而去。

### 宏观视角

全球的算力产能已经跟不上智能体（Agents）所创造的 Token 需求了。**未来的真正出路不是更便宜的 Token，而是协同进化。** 也就是：

$$\text{“更高效利用 Token 的智能体客户端”} \times \text{“更强大且高效的模型”}$$

Anthropic 的这一举措，无论其初衷如何，都在推动整个生态（无论是开源还是闭源）朝着这个方向发展。这或许是一件好事。

> **智能体时代不属于那个烧算力最多的人，而属于能够明智、高效利用算力的人。**


---

**原文**

Two days ago, Anthropic cut off third-party harnesses from using Claude subscriptions — not surprising. Three days ago, MiMo launched its Token Plan — a design I spent real time on, and what I believe is a serious attempt at getting compute allocation and agent harness development right. Putting these two things together, some thoughts:

1. Claude Code's subscription is a beautifully designed system for balanced compute allocation. My guess — it doesn't make money, possibly bleeds it, unless their API margins are 10-20x, which I doubt. I can't rigorously calculate the losses from third-party harnesses plugging in, but I've looked at OpenClaw's context management up close — it's bad. Within a single user query, it fires off rounds of low-value tool calls as separate API requests, each carrying a long context window (often >100K tokens) — wasteful even with cache hits, and in extreme cases driving up cache miss rates for other queries. The actual request count per query ends up several times higher than Claude Code's own framework. Translated to API pricing, the real cost is probably tens of times the subscription price. That's not a gap — that's a crater.

2. Third-party harnesses like OpenClaw/OpenCode can still call Claude via API — they just can't ride on subscriptions anymore. Short term, these agent users will feel the pain, costs jumping easily tens of times. But that pressure is exactly what pushes these harnesses to improve context management, maximize prompt cache hit rates to reuse processed context, cut wasteful token burn. Pain eventually converts to engineering discipline.

3. I'd urge LLM companies not to blindly race to the bottom on pricing before figuring out how to price a coding plan without hemorrhaging money. Selling tokens dirt cheap while leaving the door wide open to third-party harnesses looks nice to users, but it's a trap — the same trap Anthropic just walked out of. The deeper problem: if users burn their attention on low-quality agent harnesses, highly unstable and slow inference services, and models downgraded to cut costs, only to find they still can't get anything done — that's not a healthy cycle for user experience or retention.

4. On MiMo Token Plan — it supports third-party harnesses, billed by token quota, same logic as Claude's newly launched extra usage packages. Because what we're going for is long-term stable delivery of high-quality models and services — not getting you to impulse-pay and then abandon ship.

The bigger picture: global compute capacity can't keep up with the token demand agents are creating. The real way forward isn't cheaper tokens — it's co-evolution. "More token-efficient agent harnesses" × "more powerful and efficient models." Anthropic's move, whether they intended it or not, is pushing the entire ecosystem — open source and closed source alike — in that direction. That's probably a good thing. The Agent era doesn't belong to whoever burns the most compute. It belongs to whoever uses it wisely.
