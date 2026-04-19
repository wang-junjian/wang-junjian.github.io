---
layout: single
title:  "Introducing deep research"
date:   2025-02-06 10:00:00 +0800
categories: DeepResearch Agent
tags: [DeepResearch, Agent, o3, arXiv, OpenAI]
---

## [Deep research](https://openai.com/index/introducing-deep-research/)

- [Introduction to Deep Research from OpenAI [LIVESTREAM]](https://community.openai.com/t/introduction-to-deep-research-from-openai-livestream/1110988)
- [Open-source DeepResearch – Freeing our search agents](https://huggingface.co/blog/open-deep-research)

An agent that uses reasoning to synthesize large amounts of online information and complete multi-step research tasks for you. 

一个代理，使用推理来综合大量在线信息，并为您完成多步研究任务。 

Today we’re launching deep research in ChatGPT, a new agentic capability that conducts multi-step research on the internet for complex tasks. It accomplishes in tens of minutes what would take a human many hours.

今天我们在 ChatGPT 中推出了 deep research，这是一种新的代理能力，可以在互联网上进行复杂任务的多步研究。 它可以在几十分钟内完成人类需要花费数小时才能完成的任务。

Deep research is OpenAI's next agent that can do work for you independently—you give it a prompt, and ChatGPT will find, analyze, and synthesize hundreds of online sources to create a comprehensive report at the level of a research analyst. Powered by a version of the upcoming OpenAI o3 model that’s optimized for web browsing and data analysis, it leverages reasoning to search, interpret, and analyze massive amounts of text, images, and PDFs on the internet, pivoting as needed in reaction to information it encounters.

Deep research 是 OpenAI 的下一个代理，可以独立为您工作-您给它一个提示，ChatGPT 将查找、分析和综合数百个在线来源，以创建研究分析师水平的全面报告。 它由即将推出的 OpenAI o3 模型的一个版本提供支持，该模型针对网络浏览和数据分析进行了优化，利用推理来搜索、解释和分析互联网上的大量文本、图像和 PDF，根据需要在遇到的信息反应中进行转向。

The ability to synthesize knowledge is a prerequisite for creating new knowledge. For this reason, deep research marks a significant step toward our broader goal of developing AGI, which we have long envisioned as capable of producing novel scientific research.

**综合知识的能力是创造新知识的前提。** 出于这个原因，deep research 标志着我们朝着开发 AGI 的更广泛目标迈出了重要一步，我们长期以来一直设想 AGI 能够产生新颖的科学研究。


## Why we built deep research（为什么我们构建了 deep research）

Deep research is built for people who do intensive knowledge work in areas like finance, science, policy, and engineering and need thorough, precise, and reliable research. It can be equally useful for discerning shoppers looking for hyper-personalized recommendations on purchases that typically require careful research, like cars, appliances, and furniture. Every output is fully documented, with clear citations and a summary of its thinking, making it easy to reference and verify the information. It is particularly effective at finding niche, non-intuitive information that would require browsing numerous websites. Deep research frees up valuable time by allowing you to offload and expedite complex, time-intensive web research with just one query.

Deep research 是为那些在金融、科学、政策和工程等领域进行密集知识工作的人们构建的，他们需要彻底、精确和可靠的研究。 对于寻找超个性化购买建议的挑剔购物者来说，它同样有用，这些购买建议通常需要仔细研究，如汽车、家电和家具。 每个输出都有完整的文档，清晰的引用和其思维摘要，使其易于引用和验证信息。 它特别擅长查找需要浏览大量网站的小众、非直观信息。 Deep research 通过允许您仅使用一个查询就可以卸载和加速复杂、耗时的网络研究，从而节省宝贵的时间。

Deep research independently discovers, reasons about, and consolidates insights from across the web. To accomplish this, it was trained on real-world tasks requiring browser and Python tool use, using the same reinforcement learning methods behind OpenAI o1, our first reasoning model. While o1 demonstrates impressive capabilities in coding, math, and other technical domains, many real-world challenges demand extensive context and information gathering from diverse online sources. Deep research builds on these reasoning capabilities to bridge that gap, allowing it to take on the types of problems people face in work and everyday life.

Deep research 独立发现、推理和整合来自网络的见解。 为了实现这一目标，它在需要浏览器和 Python 工具使用的真实任务上进行了训练，使用了 OpenAI o1 背后的相同强化学习方法，这是我们的第一个推理模型。 虽然 o1 在编码、数学和其他技术领域展示了令人印象深刻的能力，但许多现实世界的挑战需要从多样化的在线来源中收集广泛的上下文和信息。 Deep research 建立在这些推理能力之上，以弥合这一差距，使其能够解决人们在工作和日常生活中面临的问题。


## How to use deep research（如何使用 deep research）

In ChatGPT, select ‘deep research’ in the message composer and enter your query. Tell ChatGPT what you need—whether it’s a competitive analysis on streaming platforms or a personalized report on the best commuter bike. You can attach files or spreadsheets to add context to your question. Once it starts running, a sidebar appears with a summary of the steps taken and sources used.

在 ChatGPT 中，在消息编辑器中选择 “deep research” 并输入您的查询。 告诉 ChatGPT 您需要什么-无论是关于流媒体平台的竞争分析，还是关于最佳通勤自行车的个性化报告。 您可以附加文件或电子表格以为您的问题添加上下文。 一旦开始运行，侧边栏将显示所采取的步骤和使用的来源的摘要。

Deep research may take anywhere from 5 to 30 minutes to complete its work, taking the time needed to dive deep into the web. In the meantime, you can step away or work on other tasks—you’ll get a notification once the research is complete. The final output arrives as a report within the chat – in the next few weeks, we will also be adding embedded images, data visualizations, and other analytic outputs in these reports for additional clarity and context.

Deep research 可能需要 5 到 30 分钟的时间来完成其工作，需要深入研究网络。 与此同时，您可以离开或处理其他任务-一旦研究完成，您将收到通知。 最终输出将作为报告出现在聊天中-在接下来的几周内，我们还将在这些报告中添加嵌入式图像、数据可视化和其他分析输出，以提供更清晰的上下文。

Compared to deep research, GPT-4o is ideal for real-time, multimodal conversations. For **multi-faceted, domain-specific** inquiries where depth and detail are critical, deep research’s ability to conduct extensive exploration and cite each claim is the difference between a quick summary and a well-documented, verified answer that can be usable as a work product.

与 deep research 相比，GPT-4o 更适合实时、多模态对话。 对于深度和细节至关重要的 **多方面、领域特定** 的查询，deep research 进行广泛探索并引用每个声明的能力是快速摘要和详细记录、可验证的答案之间的区别，这些答案可以作为工作产品使用。

### Business

### Needle in a Haystack

#### GPT-4o

**User:**

```markdown
There is a TV show that I watched a while ago. I forgot the name but I do remember what happened in one of the episodes. Can you help me find the name? Here is what I remember in one of the episodes:

- Two men play poker. One folds after another tells him to bet. The one who folded actually had a good hand and fell for the bluff. On the second hand, the same man folds again, but this time with a bad hand.
- A man gets locked in the room, and then his daughter knocks on the door.
- Two men go to a butcher shop, and one man brings a gift of vodka.

Please browse the web deeply to find the TV show episode where this happened exactly
```

```markdown
我有一段时间前看过的一部电视剧。 我忘记了名字，但我确实记得其中一集发生了什么。 你能帮我找到名字吗？ 这是我记得的其中一集中发生的事情：

- 两个男人玩扑克。 其中一个在另一个告诉他下注后弃牌。 那个弃牌的人实际上有一手好牌，却上了对方的虚张声势。 在第二手中，同一个人再次弃牌，但这次是一手烂牌。
- 一个男人被锁在房间里
- 两个男人去了一家肉店，其中一个人带了一瓶伏特加作为礼物。

请深入浏览网络，找到发生这一切的电视剧集的确切名称
```

**Assistant:**

```markdown
Based on the details you've provided, it seems you're referring to an episode from the television series Servant. This psychological horror series, created by Tony Basgallop and executive produced by M. Night Shyamalan, premiered on Apple TV+ in 2019. The narrative centers on a Philadelphia couple who, after experiencing a profound loss, hire a young nanny, leading to a series of unsettling events within their home.

In one of the episodes, there is a scene where two characters engage in a tense poker game, with one character folding to a bluff despite holding a strong hand. In another scene, a man finds himself locked in a room, only to have his daughter knock on the door shortly after. Additionally, two characters visit a butcher shop, where one presents a bottle of vodka as a gift.

If this aligns with your recollection, then Servant is likely the show you're thinking of.
```

```markdown
根据您提供的细节，似乎您指的是电视剧《仆人》（Servant）中的一集。 这部心理恐怖剧由 Tony Basgallop 创作，由 M. Night Shyamalan 执行制片，于 2019 年在 Apple TV+ 上首播。 故事围绕着一对费城夫妇展开，他们在经历了巨大的损失后雇佣了一名年轻的保姆，导致他们家中发生了一系列令人不安的事件。

在其中一集中，有一个场景，两个角色参与了一场紧张的扑克游戏，其中一个角色尽管手中有一手强牌，却因为虚张声势而弃牌。 在另一个场景中，一个男人发现自己被锁在房间里，不久后他的女儿敲门。 此外，两个角色去了一家肉店，其中一个人带了一瓶伏特加作为礼物。

如果这符合您的记忆，那么《仆人》很可能是您想到的那部电视剧。
```

#### Deep research

**User:**

```markdown
There is a TV show that I watched a while ago. I forgot the name but I do remember what happened in one of the episodes. Can you help me find the name? Here is what I remember in one of the episodes:

- Two men play poker. One folds after another tells him to bet. The one who folded actually had a good hand and fell for the bluff. On the second hand, the same man folds again, but this time with a bad hand.
- A man gets locked in the room, and then his daughter knocks on the door.
- Two men go to a butcher shop, and one man brings a gift of vodka.

Please browse the web deeply to find the TV show episode where this happened exactly
```

```markdown
我有一段时间前看过的一部电视剧。 我忘记了名字，但我确实记得其中一集发生了什么。 你能帮我找到名字吗？ 这是我记得的其中一集中发生的事情：

- 两个男人玩扑克。 其中一个在另一个告诉他下注后弃牌。 那个弃牌的人实际上有一手好牌，却上了对方的虚张声势。 在第二手中，同一个人再次弃牌，但这次是一手烂牌。
- 一个男人被锁在房间里
- 两个男人去了一家肉店，其中一个人带了一瓶伏特加作为礼物。

请深入浏览网络，找到发生这一切的电视剧集的确切名称
```

**Assistant:**

```markdown
All three described events occur in the Starz series Counterpart, Season 1 Episode 4, titled “Both Sides Now.” In this episode:

- Poker game bluff: Howard Silk (from Dimension 2) plays poker with his kinder Dimension 1 counterpart. He taunts the other to bet, but Howard-1 folds a winning hand (he had top pair) after falling for the bluff. On the next hand, Howard-1 folds again (this time correctly, with a bad hand).
- Locked in a room & daughter knocks: Howard-1 is locked in an apartment by Howard-2. A knock comes – it’s Howard-2’s daughter, Anna, calling “Dad.” She says her mother is in the hospital and drags “Howard” out, not realizing he’s the other version of her father.
- Butcher shop with vodka: Later, Howard-2 and Peter Quayle visit an old ally, Heinrich, at his butcher shop. Howard-2 brings a bottle of Russian Standard vodka as a gift. Heinrich happily breaks out glasses, saying he misses the stuff, and they toast.

Each of these moments is a plot point in “Both Sides Now” (Counterpart S1E4), confirming it as the episode in question.

Sources: The Counterpart episode summary on the Counterpart Wiki details the poker bluff, the locked-room encounter with the daughter, and the butcher shop vodka scene, all in Season 1, Episode 4: “Both Sides Now.”
```

```markdown
所有这三件事都发生在 Starz 电视剧《对照世界》（Counterpart）第一季第四集，标题为 “Both Sides Now”。在这一集中：

- 扑克游戏虚张声势：来自第二维度的霍华德·丝克（Howard Silk）与他那更善良的第一维度对应者玩扑克。他挑衅对方下注，但霍华德-1中了圈套，弃掉了本该是顶对的胜牌。下一手牌中，霍华德-1再次弃牌（这次弃牌是正确的，因为他的手牌很差）。
- 被锁在房间 & 女儿敲门：霍华德-2将霍华德-1锁在一间公寓内。突然传来敲门声——原来是霍华德-2的女儿安娜在呼唤“爸爸”。她说她的母亲在医院，并把“霍华德”拉了出来，却没意识到他是她父亲的另一版本。
- 肉铺里的伏特加：之后，霍华德-2和彼得·奎尔（Peter Quayle）拜访了他们的老盟友海因里希，地点在他的肉铺。霍华德-2带来了一瓶俄罗斯标准伏特加作为礼物。海因里希欣喜地拿出酒杯，说很怀念这酒，然后大家共同碰杯。

以上这些情节都是《Both Sides Now》（Counterpart S1E4）中的剧情关键点，确认了这正是讨论中的那一集。

资料来源：Counterpart Wiki 中的该集简介详细记录了扑克虚张声势、被锁房及女儿敲门的情节，以及肉铺伏特加场景，这些均出自第一季第四集“Both Sides Now”。
```

### Medical Research

### UX Design

### Shopping

### General Knowledge

#### GPT-4o

**User:**

```markdown
What’s the average retirement age for NFL kickers?
```

```markdown
NFL 踢球手的平均退休年龄是多少？
```

**Assistant:**

```markdown
Determining the exact average retirement age for NFL kickers is challenging due to variations in individual careers and the lack of comprehensive data. However, kickers generally enjoy longer careers compared to other positions in the NFL. The average career length for kickers and punters is approximately 4.87 years, which is notably higher than the league-wide average of 3.3 years.

In terms of age, the average NFL kicker is around 29 years old. Many kickers continue playing into their late 30s and even early 40s. For instance, as of 2024, Nick Folk and Matt Prater were both active at 40 years old.

Given these figures, it's reasonable to infer that the average retirement age for NFL kickers falls between 35 and 40 years old, allowing for individual differences in performance, health, and team needs.
```

```markdown
由于个人职业生涯的变化和缺乏全面数据，确定 NFL 踢球手的确切平均退休年龄是具有挑战性的。 但是，与 NFL 中的其他位置相比，踢球手通常享有更长的职业生涯。 踢球手和擦脚者的平均职业生涯长度约为 4.87 年，明显高于联盟范围内的 3.3 年的平均值。

就年龄而言，NFL 踢球手的平均年龄约为 29 岁。 许多踢球手继续比赛到 30 多岁甚至 40 多岁。 例如，截至 2024 年，尼克·福克（Nick Folk）和马特·普雷特（Matt Prater）都在 40 岁时仍在活跃。

鉴于这些数据，可以合理推断 NFL 踢球手的平均退休年龄在 35 到 40 岁之间，考虑到个人表现、健康状况和球队需求的差异。
```

#### Deep research

**User:**

```markdown
What’s the average retirement age for nfl kickers?
```

```markdown
NFL 踢球手的平均退休年龄是多少？
```

**Assistant:**

```markdown
NFL kickers tend to retire significantly later than most other players. While the average NFL player retires around age 27–28 due to the league’s physical toll, kickers often play well beyond 30. In fact, kickers have the longest careers on average of any position – roughly 4.8 seasons on average, compared to about 3.3 for all players (running backs average only ~2.5). Starting their careers in their early 20s, an “average” kicker might retire around age 30. However, it’s very common for successful NFL kickers to continue into their late 30s and even their 40s. A reliable, productive kicker can stick around for two decades in the league.

Range: On the low end, some kickers see their careers end in their 20s if they struggle or are replaced by younger competition. But at the high end, kickers are the ones who often push the boundaries of age in the NFL. Many of the oldest players in NFL history have been kickers. For example, George Blanda (who was also a quarterback) retired at 48 years old, the oldest ever. The next-oldest were all placekickers: Morten Andersen retired at 47, and John Carney and Adam Vinatieri each played until 46. It’s not unusual to see active kickers around 40; in 2025, two NFL kickers (Nick Folk and Matt Prater) were 40 years old. By contrast, players at high-contact positions (like running back or linebacker) rarely last past their early 30s.

Why kickers last longer: The main reason is that the physical demands of kicking are lower than other positions. Kickers aren’t subject to bone-crunching hits on every play. As one analysis notes, due to “less physical contact, positions like kickers (and quarterbacks) typically have longer careers” than collision-heavy positions. With fewer traumatic injuries and less wear-and-tear, a kicker’s body can hold up longer. Also, kicking is a specialized skill that relies more on technique, accuracy, and leg strength than on the raw speed or all-around athleticism that declines rapidly with age. Many kickers can maintain their leg power and refine their technique well into their late 30s or 40s.

Of course, kickers aren’t immune to aging. They do eventually experience diminishing leg strength or accuracy, which can prompt retirement. For instance, even legends like Vinatieri (the NFL’s all-time scoring leader) hung up the cleats once their performance started slipping in their mid-40s. Some kickers also decide to retire if they lose their job and opportunities dry up – effectively being “forced out” in their 20s or 30s despite not being physically broken. And on rare occasions, a kicker might retire early by choice (e.g. to pursue other careers or due to a persistent injury), though this is less common than at other positions.

In summary, NFL kickers enjoy unusual longevity. Many retire in their mid-to-late 30s – considerably later than the overall NFL average. It’s not uncommon for a top kicker to play 15+ years and approach age 40 before retiring. A handful of outliers have even kicked into their mid-40s. This longevity comes from the position’s lower physical strain and the fact that as long as a kicker stays accurate and effective, teams will keep him around. Meanwhile, the high-contact roles see careers end much sooner. As one sports writer put it, a dependable kicker can be in the NFL “for upwards of two decades,” whereas players taking the biggest pounding (running backs, linemen, etc.) tend to have the earliest retirements.

Sources:

- NFL career length and retirement data (InvestingFuse/Statista, RBC study)
- “The Brief Career of NFL Players” – longevity by position (RBC Wealth Mgmt. study)
- Oldest NFL players records (BetMGM)
- Position longevity explanation (NFL Exclusive)
- Average ages by position (JokerMag/Briefly)
```

```markdown
NFL 踢球手的退休年龄通常比大多数其他球员晚得多。 虽然由于联盟的身体负担，平均 NFL 球员在 27-28 岁左右退休，但踢球手通常会在 30 岁之后继续比赛。 实际上，踢球手的职业生涯平均最长-平均约 4.8 个赛季，而所有球员的平均职业生涯约为 3.3 个赛季（跑锋平均只有约 2.5 个赛季）。 一个“平均”踢球手可能在 30 岁左右退休。 但是，成功的 NFL 踢球手继续到 30 多岁甚至 40 多岁是非常常见的。 一名可靠、高效的踢球手可以在联盟中坚持两个十年。

范围：在低端，如果踢球手表现不佳或被年轻对手取代，有些踢球手的职业生涯可能在 20 多岁结束。 但在高端，踢球手通常是推动 NFL 年龄界限的人。 NFL 历史上许多最年长的球员都是踢球手。 例如，乔治·布兰达（George Blanda）（他也是四分卫）在 48 岁时退休，是有史以来最年长的球员。 接下来年龄最大的都是大力踢球手：莫腾·安德森（Morten Andersen）在 47 岁时退休，约翰·卡尼（John Carney）和亚当·维纳提里（Adam Vinatieri）各自退休时都已经 46 岁。 看到 40 岁左右的活跃踢球手并不罕见；2025 年，两名 NFL 踢球手（尼克·福克（Nick Folk）和马特·普雷特（Matt Prater））都已经 40 岁。 相比之下，高接触位置的球员（如跑锋或中锋）很少能在 30 多岁之后持续下去。

为什么踢球手的职业生涯更长：主要原因是踢球的身体要求比其他位置低。 踢球手不会在每次比赛中都受到骨碎裂的打击。 正如一项分析所指出的那样，由于“较少的身体接触，像踢球手（和四分卫）这样的位置通常比碰撞密集的位置拥有更长的职业生涯”。 由于较少的创伤性伤害和较少的磨损，踢球手的身体可以更长时间地保持。 此外，踢球是一种依赖技术、准确性和腿部力量的专业技能，而不是依赖于随着年龄迅速下降的原始速度或全面运动能力。 许多踢球手可以在 30 多岁或 40 多岁时保持腿部力量并完善他们的技术。

当然，踢球手并不免于衰老。 他们最终会经历腿部力量或准确性下降，这可能促使他们退休。 例如，即使像维纳提里（NFL 历史上得分最高的球员）这样的传奇人物在 40 多岁时表现开始下滑，他们也会挂起球鞋。 一些踢球手也会决定退休，如果他们失去工作并且机会变少-尽管他们并没有身体受损，但实际上在 20 多岁或 30 多岁时就被“迫退”。 而在极少数情况下，踢球手可能会出于选择（例如追求其他职业或由于持续的伤病）而提前退休，尽管这比其他位置更少见。

总之，NFL 踢球手享有非凡的长寿。 许多人在 30 多岁或 40 多岁退休-比整体 NFL 平均年龄晚得多。 一名顶级踢球手在退休前可能会踢 15 年以上，并接近 40 岁。 少数离群值甚至踢到 40 多岁。 这种长寿来自于这个位置的较低的身体压力，以及只要踢球手保持准确和有效，球队就会留下他。 与此同时，高接触角色的职业生涯要早得多。 正如一位体育作家所说，一名可靠的踢球手可以在 NFL 中“持续两个十年以上”，而承受最大冲击的球员（跑锋、前锋等）往往会提前退休。

资料来源：

- NFL 职业生涯长度和退休数据（InvestingFuse/Statista，RBC 研究）
- “NFL 球员的简短职业生涯”-按职位的长寿（RBC 财富管理研究）
- 最年长的 NFL 球员记录（BetMGM）
- 职位长寿解释（NFL 独家）
- 按职位的平均年龄（JokerMag/Briefly）
```

> In this example, deep research is given an ambiguous query that would be hard for a human to find the answer to, because there are no key words that would easily reveal the answer to the query. Deep research is able to search creatively and persistently until it finds an answer that exactly matches the criteria.

> 在这个例子中，deep research 得到了一个模糊的查询，这对于人类来说很难找到答案，因为没有关键词可以轻松揭示查询的答案。 Deep research 能够创造性地和坚持不懈地搜索，直到找到一个完全符合标准的答案。


## How it works（它是如何工作的）

Deep research was trained using end-to-end reinforcement learning on hard browsing and reasoning tasks across a range of domains. Through that training, it learned to plan and execute a multi-step trajectory to find the data it needs, backtracking and reacting to real-time information where necessary. The model is also able to browse over user uploaded files, plot and iterate on graphs using the python tool, embed both generated graphs and images from websites in its responses, and cite specific sentences or passages from its sources. As a result of this training, it reaches new highs on a number of public evaluations focused on real-world problems.

Deep research 是通过端到端强化学习在各个领域的困难浏览和推理任务上进行训练的。 通过这种训练，它学会了计划和执行多步轨迹，以找到所需的数据，必要时回溯和对实时信息做出反应。 该模型还能够浏览用户上传的文件，使用 python 工具绘制和迭代图表，将生成的图表和来自网站的图像嵌入其响应中，并引用其来源的特定句子或段落。 由于这种训练，它在一些专注于现实世界问题的公共评估中取得了新的高度。


### Humanity's Last Exam（人类的最后一次考试）

On [Humanity’s Last Exam](https://lastexam.ai/), a recently released evaluation that tests AI across a broad range of subjects on expert-level questions, the model powering deep research scores a new high at 26.6% accuracy. This test consists of over 3,000 multiple choice and short answer questions across more than 100 subjects from linguistics to rocket science, classics to ecology. Compared to OpenAI o1, the largest gains appeared in chemistry, humanities and social sciences, and mathematics. The model powering deep research showcased a human-like approach by effectively seeking out specialized information when necessary.

在 [Humanity’s Last Exam](https://lastexam.ai/) 上，这是一个最近发布的评估，它在专家级问题上测试 AI 在广泛的主题上的表现，支持 deep research 的模型在准确率上达到了 26.6% 的新高。 这项测试包括超过 3,000 个多项选择题和简答题，涵盖了从语言学到火箭科学、古典学到生态学的 100 多个主题。 与 OpenAI o1 相比，最大的增长出现在化学、人文社会科学和数学领域。 支持 deep research 的模型展示了一种类似人类的方法，有效地在必要时有效地寻找专业信息。

| Model | Accuracy (%) |
| --- | --- |
| GPT-4o | 3.3 |
| Grok-2 | 3.8 |
| Claude 3.5 Sonnet | 4.3 |
| Gemini Thinking | 6.2 |
| OpenAI o1 | 9.1 |
| DeepSeek-R1* | 9.4 |
| OpenAI o3-mini (medium)* | 10.5 |
| OpenAI o3-mini (high)* | 13.0 |
| OpenAI deep research** | 26.6 |

- `*` 模型不是多模态的，仅在文本子集上进行评估。
- `**` 带有浏览 + python 工具


### GAIA

On [GAIA⁠](https://openreview.net/forum?id=fibxvahvs3), a public benchmark that evaluates AI on real-world questions, the model powering deep research reaches a new state of the art (SOTA), topping the external [leaderboard⁠](https://huggingface.co/spaces/gaia-benchmark/leaderboard). Encompassing questions across three levels of difficulty, successful completion of these tasks requires abilities including reasoning, multi-modal fluency, web browsing, and tool-use proficiency.

在 [GAIA⁠](https://openreview.net/forum?id=fibxvahvs3) 上，这是一个公共基准，它在现实世界问题上评估 AI，支持 deep research 的模型达到了一个新的技术水平（SOTA），超过了外部 [排行榜](https://huggingface.co/spaces/gaia-benchmark/leaderboard)。 这些任务涵盖了三个难度级别的问题，成功完成这些任务需要包括推理、多模态流畅性、网络浏览和工具使用熟练度在内的能力。

|  | Level 1 | Level 2 | Level 3 | Avg. |
| --- | --- | --- | --- | --- |
| [Previous SOTA](https://huggingface.co/spaces/gaia-benchmark/leaderboard) | 67.92 | 67.44 | 42.31 | 63.64 |
| Deep Research (pass@1) | 74.29 | 69.06 | 47.6 | 67.36 |
| Deep Research (cons@64) | 78.66 | 73.21 | 58.03 | 72.57 |

#### Level 1

**User:**

```markdown
In Nature journal's Scientific Reports conference proceedings from 2012, in the article that did not mention plasmons or plasmonics, what nano-compound is studied? Don't use the prefix nano in your answer if there is one.
```

```markdown
在 2012 年的 Nature 期刊的 Scientific Reports 会议论文中，没有提到 plasmons 或 plasmonics 的文章中，研究了哪种纳米化合物？ 如果有前缀 nano，请在回答中不使用它。
```

**思维链**

🤖 **Clarifying the search（澄清搜索）**

I’m piecing together the request for an article from 2012 in Scientific Reports that details a nano-compound, excluding any related to plasmonics. Likely, this involves filtering specific topics or compounds, like silver or graphene.

我正在梳理 2012 年 Scientific Reports 中的一篇文章的请求，该文章详细介绍了一种纳米化合物，不包括任何与等离子体共振相关的内容。可能，这涉及到过滤特定主题或化合物，如银或石墨烯。

**Piecing together details（梳理细节）**

I'm sub-searching "Scientific Reports 2012 nanoparticle," likely seeking nano-compounds. Interested in filtering out plasmon-related topics, possibly focusing on silver, graphene, or quantum dots.

我正在搜索“Scientific Reports 2012 纳米粒子”，可能在寻找纳米化合物。有兴趣过滤掉与等离子体相关的主题，可能会关注银、石墨烯或量子点。

🔍 [search action]

🤖 **Navigating search filters（浏览搜索过滤器）**

I’m digging into advanced search filters on nature.com and Scientific Reports for 2012, trying to pinpoint articles on amorphous carbon nanoparticles in food caramels.

我正在深入研究 nature.com 和 Scientific Reports 的高级搜索过滤器，试图找到 2012 年关于食品焦糖中非晶碳纳米颗粒的文章。

🤖 **Identifying conference proceedings（识别会议记录）**

The search results reveal a conference proceeding titled "2D quasiperiodic plasmonic crystals" from 2012, likely found under the "Conference Proceedings" category in Scientific Reports.

搜索结果显示了一篇名为“2D准周期等离子晶体”的 2012 年会议论文，可能是在 Scientific Reports 的“会议论文”类别下找到的。

🌐 [browse action]

🤖 **Reflecting on potential issues（反思潜在问题）**

I'm considering the reasons behind a web page misconception, likely due to an outdated agent type or inadvertent blockage.

我正在考虑网页误解背后的原因，可能是由于过时的代理类型或无意的阻塞。

🌐 [browse action]

🤖 **Considering dynamic options（考虑动态选项）**

I'm thinking about a nature site with dynamic content or a cached version. Alternatively, trying a search for specific phrases might help.

我正在考虑一个具有动态内容或缓存版本的 nature 网站。 或者，尝试搜索特定短语可能会有所帮助。

🔍 [search action]

🤖 **Pinpointing key features（确定关键特征）**

OK, I'm identifying four conference proceedings from 2012 in Sci Rep. Notably, some mention "plasmonic" and should be excluded.

好的，我正在确定 Sci Rep 中 2012 年的四篇会议论文。 值得注意的是，有些提到了“等离子体”，应该排除在外。

🌐 [browse action]

🤖 **Piecing together insights（整合见解）**

I’m gathering info on accessing cached versions or snippet expansions for specific titles to ensure comprehensive analysis.

我正在收集有关访问缓存版本或特定标题的片段扩展的信息，以确保全面分析。

🔍 [search action]

🤖 **Pulling together the details（汇总细节）**

I’m noting the progression from the 2012 European Materials Research Society Spring Meeting to the scientific report, focusing on conference proceedings. This approach helps establish context and relevance.

我注意到了从 2012 年欧洲材料研究学会春季会议到科学报告的进展，重点关注会议记录。 这种方法有助于建立上下文和相关性。

🔍 [search action]

🤖 **Tracking journal clues（追踪日记线索）**

Trying to connect conference proceedings from late 2012 with "Scientific Reports" journal, focusing on plasmonic 2D quasiperiodic materials. This approach feels methodical and precise.

尝试将 2012 年底的会议记录与“科学报告”杂志联系起来，重点关注等离子体 2D 准周期材料。 这种方法感觉有条不紊和精确。

🔍 [search action]

🤖 **Analyzing event details（分析事件详细信息）**

Noting that the search results [8] include a page likely summarizing the European Materials Research Society 2012 Spring Meeting, including 25 symposia.

注意到搜索结果包括一个页面，可能总结了 2012 年欧洲材料研究学会春季会议，包括 25 个专题讨论会。

🌐 [browse action]

🤖 **Piecing together research（整合研究）**

I’m examining a likely collection page with 4 articles, considering plasmonic and metamaterial topics, and identifying key references from the European Materials Research Society 2012 Spring Meeting.

我正在检查一个可能的收藏页面，其中包含 4 篇文章，考虑等离子体和超材料主题，并从 2012 年欧洲材料研究学会春季会议中识别关键参考文献。

🌐 [browse action]

🤖 **Pinpointing the focus（明确重点）**

I’m focusing on the 2012 conference proceedings in "Scientific Reports" from E-MRS, likely involving topics like "2D quasiperiodic plasmonic crystals" and "Layered plasmonic cloaks to tailor the optical scattering at the nanoscale."

我正在关注来自 E-MRS 的“科学报告”中的 2012 年会议记录，可能涉及主题如“2D 准周期等离子晶体”和“分层等离子体披风，以定制纳米尺度的光散射”。

🌐 [browse action]

🤖 **Evaluating library sources（评估图书馆资源）**

Thinking about special issue E-MRS 2012 Sci rep invited paper Monticone and metamaterials lab at News Archives – 2012.

考虑到 E-MRS 2012 Sci rep 特刊邀请论文 Monticone 和 2012 年新闻档案中的超材料实验室。

🌐 [browse action]

🤖 **Assessing accessibility（评估可访问性）**

I'm gathering info on potential site access issues, considering outdated status or blockages. Also, evaluating the Monticone site for a list reference.

我正在收集有关潜在网站访问问题的信息，考虑到过时状态或阻塞。 此外，评估 Monticone 网站以获取列表参考。

🌐 [browse action]

🤖 **Piecing together E-MRS 2012（拼凑 E-MRS 2012）**

I'm trying to link "Layered Plasmonic Cloaks" to E-MRS 2012. Considering other possible topics like graphene and catalysis.

我正在尝试将“分层等离子体披风”与 E-MRS 2012 相联系。 考虑其他可能的主题，如石墨烯和催化。

🌐 [browse action]

🤖 **Identifying relevant topics（确定相关主题）**

I’m gathering info on topics like graphene, photovoltaics, and nanostructured compounds, while excluding plasmonic-related ones. This leads me to focus on nanotechnology aspects more broadly.

我正在收集关于石墨烯、光伏和纳米结构化合物等主题的信息，同时排除与等离子体相关的主题。 这使我更广泛地关注纳米技术方面。

🌐 [browse action]

🤖 **Adjusting my focus（调整我的焦点）**

I’m broadening the search parameters by entering specific site and scholar identifiers to pinpoint articles about 2D quasiperiodic plasmonic crystals in Nature Scientific Reports from 2012.

我正在通过输入特定的站点和学者标识符来扩大搜索参数，以确定 2012 年 Nature Scientific Reports 中关于 2D 准周期等离子晶体的文章。

🔍 [search action]

🤖 **Identifying non-plasmonic possibilities（识别非等离子体的可能性）**

I'm narrowing down the search to identify articles from the 2012 E-MRS special issue in Scientific Reports. This involves checking titles for non-plasmonic topics, like graphene or functional oxides. Progress is evident through focused searches and exclusion of plasmonic articles.

我正在缩小搜索范围，以确定 2012 年 E-MRS 在 Scientific Reports 中的特刊文章。 这涉及检查标题以查找非等离子体主题，如石墨烯或功能氧化物。 通过专注搜索和排除等离子体文章，取得了进展。

🔍 [search action]

🤖 **Piecing together clues（拼凑线索）**

I'm analyzing interactions in a graphene superlattice, likely from a Sci Rep article. Considering titles by authors like Padooru, Yakovlev, Chen, and Alu.

我正在分析石墨烯超晶格中的相互作用，可能来自 Sci Rep 文章。 考虑到作者如 Padooru、Yakovlev、Chen 和 Alu 的标题。

🔍 [search action]

🤖 **Piecing together the puzzle（拼凑谜团）**

I’m gathering info on E-MRS 2012 Spring Meeting's Sci Rep proceedings, focusing on invited papers, without plasmonic phenomena. Types under review are graphene, catalysis, energy materials, nanomedicine, and sensors.

我正在收集关于 E-MRS 2012 春季会议 Sci Rep 论文的信息，重点关注邀请论文，而不涉及等离子体现象。 正在审查的类型包括石墨烯、催化、能源材料、纳米医学和传感器。

🔍 [search action]

**Assistant:**

```markdown
[The remaining Chain-of-Thought messages and the final answer are hidden to protect the benchmark's ground truth answer.]
```

```markdown
[为了保护基准的真实答案，剩余的思维链消息和最终答案被隐藏。]
```


### Expert-Level Tasks（专家级任务）

In an internal evaluation of expert-level tasks across a range of areas, deep research was rated by domain experts to have automated multiple hours of difficult, manual investigation. 

在一项涵盖各个领域的专家级任务的内部评估中，领域专家评价 deep research 已经自动化了多个小时的困难、手动调查。

1. 通过率 vs 最大工具调用

![](/images/2025/DeepResearch/Figure1.png)

模型浏览和思考其浏览内容的次数越多，它的表现就越好，这就是为什么给它思考的时间很重要。

#### Expert-level task examples（专家级任务示例）

- Chemistry（化学）
- Linguistics（语言学）
- Healthcare（医疗保健）

2. 根据估计的经济价值的专家级任务通过率

![](/images/2025/DeepResearch/Figure2.png)

估计的经济价值

3. 根据估计的小时数的专家级任务通过率

![](/images/2025/DeepResearch/Figure3.png)

估计的小时数

任务的估计经济价值与通过率的相关性比人类需要的小时数更高-模型发现困难的事情与人类发现耗时的事情不同。


## Limitations（限制）

Deep research unlocks significant new capabilities, but it’s still early and has limitations. It can sometimes hallucinate facts in responses or make incorrect inferences, though at a notably lower rate than existing ChatGPT models, according to internal evaluations. It may struggle with distinguishing authoritative information from rumors, and currently shows weakness in confidence calibration, often failing to convey uncertainty accurately. At launch, there may be minor formatting errors in reports and citations, and tasks may take longer to kick off. We expect all these issues to quickly improve with more usage and time.

Deep research 解锁了重要的新功能，但仍处于早期阶段，存在一些限制。 它有时会在响应中产生幻觉或做出错误的推断，尽管根据内部评估，其错误率明显低于现有的 ChatGPT 模型。 它可能会在权威信息和谣言之间产生困难，并且目前在置信度校准方面表现出弱点，通常无法准确传达不确定性。 在推出时，报告和引文中可能会出现轻微的格式错误，任务可能需要更长的时间才能启动。 我们预计所有这些问题将随着更多的使用和时间迅速得到改善。


## Access（访问）

Deep research in ChatGPT is currently very compute intensive. The longer it takes to research a query, the more inference compute is required. We are starting with a version optimized for Pro users today, with up to 100 queries per month. Plus and Team users will get access next, followed by Enterprise. We are still working on bringing access to users in the United Kingdom, Switzerland, and the European Economic Area. 

ChatGPT 中的 deep research 目前需要大量计算。 研究查询所需的时间越长，就需要更多的推理计算。 我们从今天开始为 Pro 用户提供优化版本，每月最多 100 个查询。 接下来将为 Plus 和 Team 用户提供访问权限，然后是 Enterprise。 我们仍在努力为英国、瑞士和欧洲经济区的用户提供访问权限。

All paid users will soon get significantly higher rate limits when we release a faster, more cost-effective version of deep research powered by a smaller model that still provides high quality results. 

当我们发布由更小的模型提供高质量结果的更快、更具成本效益的 deep research 版本时，所有付费用户的速率限制将很快得到显着提高。

In the coming weeks and months, we’ll be working on the technical infrastructure, closely monitoring the current release, and conducting even more rigorous testing. This aligns with our principle of iterative deployment. If all safety checks continue to meet our release standards, we anticipate releasing deep research to Plus users in about a month.

在未来的几周和几个月里，我们将致力于技术基础设施，密切监控当前版本，并进行更严格的测试。 这符合我们的迭代部署原则。 如果所有安全检查继续符合我们的发布标准，我们预计在大约一个月内向 Plus 用户发布 deep research。


## What's next（接下来是什么）

Deep research is available today on ChatGPT web, and will be rolled out to mobile and desktop apps within the month. Currently, deep research can access the open web and any uploaded files. In the future, you’ll be able to connect to more specialized data sources—expanding its access to subscription-based or internal resources—to make its output even more robust and personalized.

Deep research 今天可以在 ChatGPT web 上使用，并将在一个月内推出到移动和桌面应用程序。 目前，deep research 可以访问开放网络和任何上传的文件。 将来，您将能够连接到更多专业数据源-扩展其访问范围到基于订阅或内部资源-以使其输出更加强大和个性化。

Looking further ahead, we envision agentic experiences coming together in ChatGPT for asynchronous, real-world research and execution. The combination of deep research, which can perform asynchronous online investigation, and Operator, which can take real-world action, will enable ChatGPT to carry out increasingly sophisticated tasks for you.

展望未来，我们设想在 ChatGPT 中汇聚代理体验，用于异步、现实世界的研究和执行。 deep research 可以进行异步在线调查，而 Operator 可以采取实际行动，这两者的结合将使 ChatGPT 能够为您执行越来越复杂的任务。

Update on February 3, 2025: We conducted rigorous safety testing, preparedness evaluations, and governance reviews on the early version of o3 that powers deep research, identifying it as Medium⁠ risk. We also ran additional safety testing to better understand incremental risks associated with deep research's ability to browse the web, and we have added new mitigations. We will continue to thoroughly test and closely monitor the current limited release. We will share our safety insights and safeguards for deep research in a system card when we widen access to Plus users.

2025 年 2 月 3 日更新：我们对支持 deep research 的 **o3** 早期版本进行了严格的安全测试、准备评估和治理审查，确定其为[中等风险](https://cdn.openai.com/openai-preparedness-framework-beta.pdf)。 我们还进行了额外的安全测试，以更好地了解 deep research 浏览网络的能力所带来的增量风险，并增加了新的缓解措施。 我们将继续对当前有限版本进行彻底测试和密切监控。 当我们向 Plus 用户扩大访问权限时，我们将在系统卡中分享 deep research 的安全见解和保障。
