---
type: article
title:  "Andrej Karpathy 的 CLAUDE 编码准则"
date:   2026-07-04 19:09:00 +0800
tags: [translation, claude, claude-code, claude.md, coding-guidelines, andrej-karpathy, agent, llm, ai]
---

下面是 **`CLAUDE.md`** 文件，用于改善 Claude Code 的行为，源自 [Andrej Karpathy 的观察](https://x.com/karpathy/status/2015883857489522876) 关于 LLM 编码陷阱的总结。

---

# CLAUDE.md

旨在减少大语言模型常见编码错误的行为准则。可根据项目特定说明按需合并。

**权衡：** 本准则偏向谨慎而非速度。对于琐碎任务，请自行判断。

## 1. 编码前先思考

**不要假设。不要掩饰困惑。要呈现权衡。**

实施之前：
- 明确陈述你的假设。如果不确定，就提问。
- 若存在多种解读，请呈现出来——不要默默选择一种。
- 若有更简单的做法，请说出来。在必要时坚持己见。
- 若某事不清楚，就停下来。指出困惑所在。提问。

## 2. 简单至上

**用最少的代码解决问题。不添加任何推测性内容。**

- 不添加需求以外的功能。
- 不为一次性代码创建抽象。
- 不提供未要求的“灵活性”或“可配置性”。
- 不对不可能发生的场景进行错误处理。
- 如果你写了 200 行，而本可以 50 行完成，那就重写。

问问自己：“一位资深工程师会认为这过于复杂吗？” 如果会，就简化它。

## 3. 外科手术式的修改

**只碰你必须改的。只清理你自己弄乱的。**

编辑现有代码时：
- 不要“改进”相邻的代码、注释或格式。
- 不要重构没有坏的东西。
- 即使你有不同做法，也要遵循现有风格。
- 若注意到无关的无效代码，提出来——但不要删除。

当你的修改造成孤立代码时：
- 删除由**你的**修改导致的未使用的导入/变量/函数。
- 除非有要求，不要删除此前就存在的无效代码。

检验标准：每一处改动都应直接追溯到用户的请求。

## 4. 目标驱动执行

**定义成功标准。循环直到验证通过。**

将任务转化为可验证的目标：
- “添加验证” → “为无效输入编写测试，然后让它们通过”
- “修复 bug” → “编写能复现此 bug 的测试，然后让它通过”
- “重构 X” → “确保重构前后测试均通过”

对于多步骤任务，给出简要计划：
1. [步骤] → 验证：[检查项]
2. [步骤] → 验证：[检查项]
3. [步骤] → 验证：[检查项]

强大的成功标准让你能独立循环。薄弱的标准（“让它能工作”）则需要不断澄清。

---

**这些准则奏效的标志是：** 差异中的不必要修改更少，因过度复杂导致的重写更少，澄清性问题出现在实现之前而非犯错之后。

## 这是英文原文：

```markdown
# CLAUDE.md

Behavioral guidelines to reduce common LLM coding mistakes. Merge with project-specific instructions as needed.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

---

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.
```

# [Andrej Karpathy 的观察（中文翻译）](https://x.com/karpathy/status/2015883857489522876)

过去几周用 Claude 编码的一些零散笔记

**编码工作流。** 随着近期 LLM 编码能力的大幅提升，我和许多人一样，从 11 月份大约 80% 手动+自动补全编码、20% 使用 agent，迅速转变到 12 月大约 80% agent 编码、20% 手工修改和润色。也就是说，我现在基本上是在用英语编程了，有点不好意思地用话语告诉 LLM 该写什么代码……用嘴巴说。这有点伤自尊，但能够以庞大的“代码动作”来操作软件，这带来的净收益实在太大了，尤其是当你适应它、配置它、学会使用它、并理清它能做什么不能做什么之后。这无疑是我近二十年编程生涯中基本编码工作流的最大变化，而这一切发生在几周之内。我估计，全球有两位数百分比的工程师正在经历类似的事情，而普通大众对此的认知度大概还只有个位数百分比。

**IDE/agent 集群/易错性。** 在我看来，现在“再也不需要 IDE”的炒作和“agent 集群”的炒作都太过头了。模型仍然会犯错，对于任何你真正在乎的代码，我都建议像鹰一样盯着它们，同时在一旁打开一个舒服的大屏 IDE。错误性质已经大变——不再是简单的语法错误，而是那种有点马虎、急躁的初级开发者会犯的细微概念性错误。最常见的一类就是模型替你做出错误假设，然后不经验证就一路跑下去。它们也不会管理自己的困惑，不去寻求澄清，不指出不一致之处，不呈现权衡方案，该反驳时不会反驳，还是有点过于谄媚。在计划模式下情况会好一些，但仍需要一种轻量级的内联计划模式。它们还特别喜欢把代码和 API 过度复杂化，让抽象臃肿膨胀，事后不清理自己留下的死代码等等。它们会用 1000 行代码实现一个低效、臃肿、脆弱的架构，然后你得说“呃，你难道不能这样做吗？”，它们会回答“当然可以！”，然后立刻砍成 100 行。有时它们仍然会把自己不喜欢或不完全理解的注释和代码当作副作用改掉或删掉，哪怕这些与手头任务毫无关系。尽管我在 CLAUDE.md 里加了几条简单指令试图修复这些问题，以上种种依然会发生。尽管毛病不少，但总体上仍然是巨大的提升，很难想象再回到手写代码的日子。长话短说，每个人都在摸索自己的工作流，我目前的配置是：左侧放几个小的 CC 会话（在 Ghostty 窗口/标签页里），右侧打开 IDE 用来查看代码和手动编辑。

**韧性。** 看着一个 agent 不知疲倦地努力做某件事，真的很有趣。它们永远不会累，永远不会灰心，只会不断尝试，而人类在那种情况下早就放弃，改日再战了。看着它长时间挣扎，最后在 30 分钟后凯旋，那真是一个“感受到 AGI”的瞬间。你会意识到，耐力是工作的一个核心瓶颈，而手握 LLM，这个瓶颈已被极大拓宽。

**加速。** 如何衡量 LLM 辅助带来的“加速”并不明确。我当然感觉做既定事情的净速度大大加快了，但更主要的影响是，我做的事情比以前多得多了，因为 1) 我可以编写各种以前根本不值得花时间写的代码，2) 我能涉足以前因知识或技能不足而无法接触的代码。所以这肯定是加速，但很可能更是一种扩张。

**杠杆。** LLM 极其擅长在达成特定目标之前一直循环，这正是大部分“感受到 AGI”的魔力所在。别告诉它该做什么，给它成功标准，然后看着它行动。让它先写测试，然后让测试通过。把它放进与浏览器 MCP 的循环中。先写出大概率正确的朴素算法，然后要求它在保持正确性的前提下优化。把你的方法从命令式转变为声明式，让 agent 循环更久，从而获得更大的杠杆效应。

**乐趣。** 我没想到，有了 agent，编程反而变得*更有趣*了，因为大量填空式的苦差事被移除了，剩下的是创造性的部分。我也更少感到卡壳或被困住（这不有趣），而且我体验到了更多的勇气，因为几乎总有办法和它携手合作，取得一些积极的进展。我也看到过其他人有相反的感受；LLM 编程会把工程师分成两类：一类是本来就喜欢写代码的人，另一类是本来就喜欢构建东西的人。

**退化。** 我已经注意到，自己手写代码的能力正在慢慢退化。生成代码（写）和辨别代码（读）是大脑中不同的能力。很大程度上，由于编程涉及大量主要是语法层面的细节，即使你写起来很吃力，也完全能正常审阅代码。

**垃圾内容泛滥。** 我预感 2026 年将是“垃圾内容泛滥年”，席卷整个 GitHub、Substack、arxiv、X/Instagram 以及几乎所有数字媒体。在真实、实质性进步的另一面，我们还会看到更多 AI 炒作下的生产力作秀（这还有可能更多吗？）。

**一些问题。** 我脑海中有几个问题：
- “10 倍工程师”会怎样？即工程师平均生产率和最高生产率之间的比率？这个比率很可能会*大幅*增长。
- 借助 LLM，通才是否会越来越胜过专才？LLM 更擅长填空补白（微观），而非宏大战略（宏观）。
- 未来的 LLM 编码感觉像什么？像玩《星际争霸》？《异星工厂》？还是演奏音乐？
- 社会在多大程度上受到数字知识工作的瓶颈制约？

**太长不看版：** 这一切把我们带到了哪里？LLM agent 的能力（尤其是 Claude 和 Codex）大约在 2025 年 12 月跨越了某种连贯性门槛，在软件工程及相关领域引发了一次相变。智能部分突然感觉远远领先于其余所有东西——集成（工具、知识）、对新组织工作流和流程的需求，以及更广泛的传播。2026 年将是充满高能量的一年，整个行业将消化这项新能力。
