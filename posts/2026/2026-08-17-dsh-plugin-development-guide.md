---
type: article
title: "dsh（DeepSeek Harness）客户端 UI 插件开发指南"
date: 2026-08-17 20:53:00 +0800
tags: [dsh, dsh-plugin, ui, react, cordis, deepseek, harness]
---

![](/images/2026/dsh/dsh-plugin-ui-sprite.webp)

> 面向第一次接触 dsh 的开发者。读完本文你将能：理解 dsh 插件的运行原理、照着完整流程从零写一个 UI 插件、避开主题/背景/测试等高频坑。
>
> 全文以正在开发的 `ui-sprite`（精灵插件）为贯穿案例。

---

## 1. 心智模型：一句话理解 dsh 插件

**[dsh（DeepSeek Harness）](https://github.com/deepseek-ai/deepseek-harness)是一个基于 [Cordis](https://github.com/cordisjs/cordis) 依赖注入框架的插件系统**。一个"插件"就是一个可复用的功能单元，通过声明自己需要哪些服务、提供哪些能力，被宿主（host）动态加载和组合。

对**客户端 UI 插件**而言，一句话概括：

> 你在写一个 **React 组件 + 一份状态源 + 一段注册逻辑**。宿主负责在合适的时机、合适的位置把它挂载进界面，并通过"注入面"（inject face）把服务递给你。

一个 UI 插件（如右下角的精灵）由三样东西组成：

| 组成 | 作用 | 在 ui-sprite 里对应 |
|---|---|---|
| **组件** | 画出来的东西 | `SpriteMascot.tsx`（SVG 精灵 + 菜单 + 面板） |
| **状态源** | 组件读的数据（可观察） | `sprite-state.ts` / `background-source.ts` |
| **注册逻辑** | 告诉宿主"挂哪、需要什么" | `client/index.ts` 的 `apply` / `inject` |

---

## 2. 工作原理：插件是怎么被加载的

### 2.1 双端结构（node 端 / client 端）

dsh 的 Web 端插件是 **双端（dual-face）** 的，一个 npm 包里有两份产物：

```
packages/client/ui-sprite/
├── package.json          # 声明 dsh.client + exports
├── src/index.ts          # node 端：宿主加载入口（通常为空 apply）
├── src/client/index.ts   # client 端：浏览器里真正运行的代码
└── lib/
    ├── index.js          # node 端产物（仅导出 apply 空函数）
    └── client.js         # client 端产物（真正被浏览器加载）
```

- **node 端**（`lib/index.js`）：宿主（Node）在启动时扫描到它，只做"登记"，不运行 UI 逻辑。
- **client 端**（`lib/client.js`）：浏览器通过 HTTP 拉取并执行，是插件真正的运行体。

### 2.2 加载链路（一段流程图）

```
package.json 声明 "dsh.client"
        │
        ▼
宿主扫描 cordis 插件表，组合 window.__DSH_BOOT__ 图
        │
        ▼
浏览器解析图，按需请求 /plugins/<id>/client.js
        │
        ▼
client.js 执行，向 Cordis 注册插件（apply/inject）
        │
        ▼
插件挂载进界面（如 shell.overlay 槽位）
```

关键文件：

- **`package.json` 的 `dsh.client`** 声明这是一个浏览器端插件：

  ```jsonc
  "dsh": {
    "client": {
      "inject": ["@deepseek-ai/dsh-client-runtime", "@deepseek-ai/dsh-client-locale"],
      "platform": "web"
    }
  },
  "exports": {
    ".": { "default": "./lib/index.js" },       // node 端
    "./client": { "default": "./lib/client.js" } // client 端
  }
  ```

- **`web-app/cordis.patch.yml`** 的插件清单（browser plugin roster）里登记一行：

  ```yaml
  - id: ui-sprite
    name: '@deepseek-ai/dsh-client-ui-sprite'
  ```

- **`window.__DSH_BOOT__`**：宿主注入到 `<head>` 的插件图（entry 列表，含每个插件的 `url` + 内容哈希 `rev` 做缓存一致性）。浏览器按图加载 `/plugins/<id>/client.js?rev=<rev>`。

> 一句话：**package.json 声明能力 → cordis.patch.yml 登记 → 宿主扫描并注入图 → 浏览器拉取 client.js → Cordis 注册运行**。

### 2.3 运行时三件套：Cordis、Slot、Store

**Cordis（依赖注入）**：插件通过 `inject` 数组声明"我需要哪些服务"，宿主保证这些服务在 `apply` 执行时可用。`ctx`（Context）上挂载了所有已注册的服务。

**Slot（插槽）**：界面上的"挂载点"。`ui-layout` 声明了 `shell.overlay`（悬浮层）等槽位，你的插件往槽位里"注入"自己的组件。

**Store（状态源）**：可观察数据。组件用 `useSyncExternalStore` 订阅它，数据变了组件自动重渲染。

---

## 3. 核心概念速查

### 3.1 `apply` 与 `inject`（插件的两个入口）

```ts
// client/index.ts
export const inject = ['slots', 'sessions', 'workspaces', 'locale']  // 声明依赖

export function apply(ctx: ClientContext): void {
  // 1. 注册文案字典
  ctx.effect(() => ctx.locale.register('sprite', { zh, en }), 'ui-sprite: dictionaries')

  // 2. 等 ui-layout 声明 shell.overlay 槽位后，挂载组件
  ctx.slots.inject('shell.overlay', () => {
    const source = createSpriteStateSource(ctx.sessions)  // 创建状态源
    const dispose = ctx.slots.register({
      name: 'shell.overlay',
      id: 'sprite',
      locale: 'sprite',
      inject: () => ({ hooks: { sprite: source } }),  // inject face
    }, SpriteMascot)  // 组件
    return () => { dispose(); source.dispose() }  // 卸载时清理
  })
}
```

- `inject` 数组：声明依赖的服务名。
- `apply(ctx)`：插件被加载时执行一次，负责注册。
- `ctx.slots.inject(key, callback)`：等待某槽位被声明后执行 `callback`（`callback` 返回清理函数）。

### 3.2 inject face（注入面）

`ctx.slots.register(options, Component)` 的 `options.inject` 返回一个对象，它会作为 props 传给组件。这是**数据/动作从服务到组件的唯一通道**：

```ts
export interface SpriteMascotInjected {
  hooks: {
    sprite: HostObservable<SpriteState>       // 可观察状态源
    background: HostObservable<BackgroundState | null>
    spriteKind: HostObservable<SpriteKind>
  }
  startSession: () => void                     // 动作回调
  setBackground: (b: BackgroundState | null) => void
  setSpriteKind: (k: SpriteKind) => void
}
```

组件侧用 `useXxx(sel => sel)` 形式的 selector hook 读 `hooks` 里的状态，用 `startSession` 等回调触发动作。

### 3.3 Store（可观察状态源）

```ts
import { createSnapshotStore } from '@deepseek-ai/dsh-client-runtime/client'

const store = createSnapshotStore<SpriteKind>('blob', {
  persist: { name: 'dsh.sprite.kind' }  // 自动持久化到 localStorage
})
// store.getSnapshot() / store.subscribe(fn) / store.set(next)
```

- `createSnapshotStore`：zustand 之上的轻量可观察 store。
- `persist`：整值 JSON 持久化到 localStorage（写入失败只禁用持久化，不崩溃）。
- 组件里 `useSyncExternalStore(store.subscribe, store.getSnapshot)` 订阅。

---

## 4. 完整开发流程（从零到可运行）

### 第 1 步：建包骨架

在 `packages/client/` 下建新包目录，复制一个最小 UI 插件（如 `ui-sidebar`）的 4 个文件：

- `package.json`：`name`、`version`、`exports`（`.` 和 `./client`）、`dsh.client` 声明、`peerDependencies`（依赖的 dsh 包）
- `tsconfig.json`：继承 client 包通用配置
- `tsdown.config.ts`：构建配置（产出 `lib/index.js` + `lib/client.js`）
- `src/css-modules.d.ts`：CSS Modules 类型声明

### 第 2 步：定义契约类型

在 `src/client/` 下定义你的状态类型和 inject face 类型。**类型先行**，让组件和服务之间的契约清晰。

### 第 3 步：写状态源（纯函数 + 可观察源）

把"从服务数据推导 UI 状态"的逻辑写成**纯函数**（易测），再用可观察源包一层：

```ts
// sprite-state.ts
export function deriveSpriteState(snapshot: SessionsSnapshot): SpriteState {
  // 纯函数：从会话快照推导活动/工具名
}
export function createSpriteStateSource(sessions) {
  // 订阅 sessions，每次变化重新 derive，暴露 getSnapshot/subscribe
}
```

### 第 4 步：写组件

组件是纯展示：数据从 `useXxx` hook 进来，本地 state 只放"瞬态 UI 状态"（菜单开关、拖拽位置、庆祝动画）。

```tsx
export function SpriteMascot({ useSprite, useBackground, startSession, setBackground, t }: SpriteMascotProps) {
  const state = useSprite(sel => sel)
  const background = useBackground(sel => sel)
  // ...渲染 SVG + 菜单 + 面板
}
```

### 第 5 步：写注册逻辑（apply + inject）

如第 3.1 节所示，`apply` 里注册字典 + 挂载组件，`inject` 返回 inject face。

### 第 6 步：接入 web-app

三处注册，让宿主知道这个包：

1. `tsconfig.client.json` / `tsconfig.base.json`：加入包的 project reference 和 paths
2. `packages/bundle/web-app/cordis.patch.yml`：在 browser plugin roster 加一行 `- id: xx / name: '@deepseek-ai/dsh-...'`
3. `packages/bundle/web-app/package.json`：加 `workspace:^` 依赖

### 第 7 步：写测试

为纯函数（derive）、apply（注册逻辑）、组件（渲染/交互）各写一组测试。详见第 6 节。

### 第 8 步：构建验证

```bash
pnpm install                                  # 链接新包
pnpm --filter <你的包> bundle                 # 构建 lib
pnpm run build                                # 构建整个 web（tsc 类型检查 + tsdown）
pnpm dsh web                                  # 启动，浏览器验证
```

### 第 9 步：独立化与发布（可选）

要把插件分发出去，抽成独立仓库 + 标准 npm 包：去掉 monorepo 内部路径依赖、补 README/LICENSE、配 GitHub Actions 自动 publish 到 npm。

---

## 5. 关键实现模式（best practices）

### 5.1 主题 token 与配色（最重要的一条）

**dsh 的语义 token 有"黑色陷阱"**：`--dsw-alias-brand-primary`、`--dsw-alias-tooltip-bg`、`--dsw-alias-button-primary-fill` 在当前主题里**都 alias 到了近黑色**（`neutral-bluish-1000`）。

| 你要做的 | 正确做法 | 错误做法 |
|---|---|---|
| 鲜艳身份色（吉祥物/按钮/高亮） | raw 调色板 `var(--dsw-static-blue-500, #3B82F6)` | `var(--dsw-alias-brand-primary)` → 黑 |
| 白色（眼睛白、按钮文字） | `var(--dsw-static-neutral-bluish-50, #FFFFFF)` | `var(--dsw-alias-brand-primary-invert)` → 深色主题变黑 |
| 固定风格 UI（游戏 HUD） | 直接用固定色值 + 注释说明 | 硬套语义 token |

规则：**凡是"鲜艳/固定身份色"，用 raw 调色板 token + 字面 fallback，别走 `brand-*`/`button-primary-*` 语义 alias**。

### 5.2 全局背景系统（多层叠模型）

应用背景由**十几层表面共享同一个 token** `--dsw-alias-bg-base`（body、`.frame`、会话根、详情面板、侧边栏……）。

- **纯色/渐变**：直接覆盖 `--dsw-alias-bg-base` 变量，所有层统一变色。
- **图片/壁纸**：只在最底层（`body.style.background`）画一次，其余层 + `--dsw-alias-bg-base` 全设 `transparent`（否则图片在每个层各自重绘、尺寸错位叠加）。
- **侧边栏是独立 token** `--dsw-specific-sidebar-fill`，换背景必须一并设透明，否则侧边栏停在主题色。

**排查方法**：`Grep` 出引用该 token 的所有 `.css` 文件，看是不是"层层叠叠"；是的话，纯色走 token、图片走"单层画 + 其余 transparent"。

### 5.3 拖拽 / 菜单翻转 / 眼睛跟随

- **拖拽**：`pointerdown` 记录起点 + `setPointerCapture`，位移超过 4px 阈值才算拖拽；用 `suppressClick` ref 抑制拖拽后的尾随 click。
- **菜单四向翻转**：`useLayoutEffect` 里量真实菜单尺寸，按上下/左右两轴独立翻转（贴边不裁切），且菜单用 `position:absolute` 脱离文档流（否则打开时撑高锚点、精灵跳动）。
- **眼睛跟随鼠标**：把光标坐标**投影到 SVG viewBox 坐标系**（`(clientX - rect.left) / rect.width * 120`）再算方向向量，`requestAnimationFrame` 节流。

### 5.4 状态持久化与迁移

- 持久化用 `createSnapshotStore` 的 `persist`。
- 状态结构升级时写 `normalize()` 迁移旧格式（如旧字符串 → 新对象），非法值回退默认。
- 本地图片：`FileReader.readAsDataURL` 读成 data URL（base64 无引号、字符串安全），限制大小（如 2MB）防 localStorage 配额。

---

## 6. 测试要点

| 测试对象 | 方法 |
|---|---|
| 纯函数（derive/normalize） | 直接断言输入→输出 |
| apply 注册逻辑 | 用 `Context` + mock services，断言 `slots.entries('shell.overlay')` |
| 组件渲染/交互 | `@testing-library/react` + `fireEvent`，mock `useXxx` hook 用 `createSnapshotStore` |

高频坑：

- **jsdom 会规范化 `style.background` 简写**（`no-repeat center / contain` → `center center / contain no-repeat`），断言用宽松 `toContain` 子串。
- **`removeProperty('background')` 不会展开清除 longhand**，清除要用 `style.background = ''`。
- rAF 需要 mock：`vi.stubGlobal('requestAnimationFrame', cb => { cb(0); return 1 })`，`afterEach` 里 `vi.unstubAllGlobals()`。
- FileReader 等异步用 `await waitFor(() => expect(...))`。

---

## 7. 踩坑清单（症状 → 原因 → 解决）

1. **「改了代码但浏览器没变化」** → 很可能是 `pnpm run build` 失败导致 `apps/web` dist 没更新到新代码 → 先修构建、重新 build。
2. **吉祥物/按钮是黑的** → 用了 `--dsw-alias-brand-primary`/`button-primary-fill`（alias 到黑）→ 换 raw `--dsw-static-blue-*`。
3. **壁纸多张叠加、错位** → 图片塞进了共享 bg 变量，被十几层各自重绘 → 图片只在 body 画一次 + 其余 transparent。
4. **图片左对齐** → 侧边栏独立 token 没透明，裁切了图片左侧 → `--dsw-specific-sidebar-fill` 一并设 transparent。
5. **纯色/渐变侧边栏不跟随** → 只覆盖了 bg-base，没动 sidebar-fill → 所有背景类型都处理 sidebar-fill。
6. **`.tsx` import 报找不到模块** → import 路径写成了 `.ts` → 写 `./xx.tsx`。
7. **`<Mouth pose={...} />` 类型报错** → 组件函数写成了 `function Mouth(pose: Pose)` → 改成接收 props 对象 `{ pose }: { pose: Pose }`。

---

## 8. 完成前检查清单

- [ ] `package.json` 有 `dsh.client` 声明 + `exports["./client"]`
- [ ] `apply` 里注册了 locale + 通过 `ctx.slots.inject` 挂载组件，且返回清理函数
- [ ] `inject` 数组声明了所有用到的服务
- [ ] 鲜艳色用的是 raw 调色板 token（非 `brand-*` alias）
- [ ] 背景改动考虑了侧边栏独立 token
- [ ] 组件不直接 import Cordis/框架，数据全靠 inject face
- [ ] 纯函数有单测、apply 有注册测试、组件有交互测试
- [ ] `tsc -b`、`vitest`、`pnpm run build` 全绿
- [ ] 已登记到 `cordis.patch.yml` + `web-app/package.json` + `tsconfig`

---

## 附录：相关文档

- 架构总览：`docs/architecture.md`
- 加包 cookbook：`docs/cookbook/adding-a-package.md`
- 加会话节点：`docs/cookbook/adding-a-conversation-node.md`
- 扩展 cookbook：`docs/cookbook/extension-cookbook.md`
- 客户端模块加载：`docs/subsystems/client-modules.md`
- Slot 系统：`packages/client/ui-slots/`
- Store 引擎：`packages/client/runtime/src/client/contract/store.ts`
