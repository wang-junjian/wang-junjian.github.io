---
type: release
title: "Kimi K3开发的小游戏：塔塔合成"
date: 2026-08-02 19:07:00 +0800
tags: [game, tower-defense, html5-canvas, web-audio-api, kimi-k3]
linkUrl: https://github.com/wang-junjian/tower-defense
---

![](/images/2026/games/tower-defense/demo.webp)

**塔塔合成**：一款合成塔防小游戏。拖拽放置防御塔、同类型两两合成升级，守住 20 波进攻，基地 HP 归零则失败。

**技术栈**：Vite + 纯 TypeScript + HTML5 Canvas 2D（零游戏引擎、零音频资源，音效全部由 Web Audio API 实时合成）。

## 快速开始

```bash
npm install
npm run dev       # 开发服务器，默认 http://localhost:5173
npm run build     # 类型检查（tsc strict）+ 打包到 dist/
npm run preview   # 预览打包产物
```

## 玩法

- **放置**：底部 3 张卡池，拖拽塔到战场空格（路径格不可放置）。
- **合成**：两座同类型同等级塔拖拽重叠，合成更高一级（最高 Lv5），Lv5 有质变特效。
- **抽卡**：消耗金币抽新塔，价格随抽取次数递增（30 × 1.2ⁿ）。
- **强化**：每波清完获得一次强化（默认自动随机，设置中可改为手动三选一）；持续型强化生效 4 波后过期。
- **目标**：守住 20 波（第 5/10/15/20 波为 Boss 波），基地 HP 归零则失败。
- 右上角提供暂停、2 倍速、静音、设置按钮；暂停界面可返回主菜单。

### 塔（7 种）

| 塔 | 颜色 | 特性 | 对空 |
|---|---|---|---|
| 箭塔 | 绿 | 均衡单体，Lv5 穿透 3 个敌人 | ✓ |
| 法师塔 | 蓝 | 减速 20%，Lv5 范围冰冻 1.5s | ✓ |
| 炮塔 | 红 | 范围溅射，Lv5 大溅射 + 灼烧 | ✗ |
| 圣光塔 | 金 | 攻击同时治疗基地，Lv5 全屏回血 | ✗ |
| 冰塔 | 青 | 减速 15%，Lv5 群体冻结 2s | ✗ |
| 毒塔 | 紫 | 叠层毒 DoT（上限 5 层），Lv5 遗留毒云 | ✗ |
| 雷塔 | 黄 | 链电跳 2 目标，Lv5 跳 4 + 麻痹 | ✓ |

### 敌人

圆形史莱姆（普通）、菱形蝙蝠（快速）、方形骷髅（高血）、飞蝠（第 6 波起，直线飞基地，仅对空塔可打）、大史莱姆（第 7 波起，死亡分裂 2 只小史莱姆）、虚影骷髅（第 8 波起，隐身，进入塔 1.5 格显形圈才可被攻击）、Boss（第 5/10/15/20 波，受减速/冰冻效果减半）。

### 战场（3 张，开始界面选择）

| 地图 | 入口 | 特点 |
|---|---|---|
| 翠绿草原 | 2（第 11 波开第二入口） | 均衡图 |
| 熔岩峡谷 | 1 | 超长蛇形路径，中央岩浆格不可放塔，塔位少而输出时间足 |
| 苍穹空港 | 3（第 6/14 波陆续开放） | 飞行怪权重 ×2，考验对空配比与多线调度 |

![](/images/2026/games/tower-defense/demo1.webp)

![](/images/2026/games/tower-defense/demo2.webp)

## 项目结构

```
├── index.html                  # 画布容器 + 等比居中样式
├── src/
│   ├── config.ts               # 全局数值配置（平衡调参的唯一入口）
│   ├── config/maps.ts          # 战场定义：路径/入口/地形/配色/机制修饰
│   ├── types.ts                # Vec2 + GameEvents 事件类型
│   ├── main.ts                 # 入口、DPR 适配、等比缩放
│   ├── core/
│   │   ├── EventEmitter.ts     # 类型安全事件总线
│   │   ├── Game.ts             # 主循环（固定 60Hz 逻辑步长）+ 状态机 + 总调度
│   │   └── SoundManager.ts     # Web Audio 合成音效（按名节流）
│   ├── entities/               # Tower / Enemy / Projectile / Particle
│   ├── systems/                # WaveManager（组波/分流）/ Economy / Modifiers（强化 buff）/ Upgrades（强化池）
│   ├── ui/                     # HUD / CardBar / Button
│   ├── input/DragHandler.ts    # Pointer 事件 → 逻辑坐标
│   └── render/drawUtils.ts
└── scripts/
    └── simulate.ts             # 无头平衡仿真（AI 自动打 20 波）
```

## 架构要点

- **游戏循环**：`requestAnimationFrame` + 累积器，固定 60Hz 逻辑步长，单帧最多补 8 步；2 倍速通过放大累积时长实现。
- **状态机**：`menu / playing / paused / upgrade / victory / defeat`。
- **事件解耦**：`enemyKilled / enemyLeaked / towerMerged / waveStarted / waveCleared / towerFired / uiClick ...` 全部走 `EventEmitter`，结算、飘字、音效各自订阅。
- **Modifiers**：所有强化 buff 集中管理（每层持续 4 波），塔属性统一经修饰器计算——新增强化或羁绊只需在这里挂一个新乘区。
- **地图数据驱动**：新增战场 = 在 `src/config/maps.ts` 加一条 `MapDef`（路径点 + 开放波 + 配色 + 机制修饰），无需改逻辑代码。

## 调参与平衡

- 所有数值集中在 `src/config.ts`（塔/敌人/经济/合成/波次）与 `src/config/maps.ts`（地图），改完直接生效。
- 平衡仿真：

```bash
npx tsx scripts/simulate.ts                 # 默认地图 + 默认种子
MAP=sky SEED=1 npx tsx scripts/simulate.ts  # 指定地图/种子（grass / lava / sky）
NO_MERGE=1 npx tsx scripts/simulate.ts      # 禁用合成对照组
```

仿真输出每波结束时的基地 HP、漏怪数与塔阵容，用于验证难度曲线"前松后紧、能赢不轻松"。

## 后续迭代方向

- 羁绊/元素反应（同色系塔组合光环）
- 主题皮肤包（仙界 / 太空 / 龙猫森林 / 潘多拉）
- 无尽模式 + 每日种子
- 局外成长（天赋树）
