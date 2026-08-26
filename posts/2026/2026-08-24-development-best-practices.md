---
type: article
title: "DeepSeek Harness 插件（dsh-github-trending）开发最佳实践"
date: 2026-08-24 22:00:00 +0800
tags: [dsh, cordis, deepseek, harness, architecture, plugin, best-practices]
---

> 一份面向本仓库（DeepSeek Harness 外部 Bundle 插件）的全面开发规范。
> 内容均基于本仓库真实代码（`src/`、`tsdown.config.ts`、`package.json`、`tests/` 等）提炼，
> 而非泛泛而谈的通用建议。改动代码前先读本文，能少踩 80% 的坑。

---

## 0. 项目定位速览

本仓库是一个 **DeepSeek Harness（以下简称 DSH）外部 Bundle 插件**，对外暴露一个面向模型（model-facing）的工具 `github_trending`，抓取 `https://github.com/trending` 的公开页面，返回结构化热门仓库列表。

| 维度 | 现状 |
|---|---|
| 包名 | `@wang-junjian/dsh-github-trending`（v0.1.0） |
| 宿主运行时 | Node.js（Cordis 插件，服务端） |
| 客户端运行时 | 浏览器（React 18，`shell.overlay` 浮层面板） |
| 构建链 | `tsc -b`（类型/声明产物） + `tsdown`（浏览器 CJS 懒加载工厂） |
| 测试 | Vitest 4（node 环境），22 个用例全绿 |
| 关键三方依赖 | `node-html-parser`（抓取）、`lightningcss`（CSS Modules）、`@deepseek-ai/schemastery`（配置 schema） |
| 仓库关系 | 通过 `link:` / `workspace:^` 依赖本地 `deepseek-harness` monorepo，不发布到本仓 |

**核心架构原则（务必记住）**：本插件被 DSH 以「外部 Bundle」方式加载，运行在宿主进程 + 浏览器两个环境里。
客户端打包时**只有白名单里的包（模块表）被外置**，其余全部内联进单文件；任何从非白名单 `@deepseek-ai/*` 包「取值导入」都会在打包期直接报错。这条约束贯穿全文。

---

## 1. 架构与目录约定

### 1.1 宿主端 / 客户端「双半体」

```
src/                       # 宿主端（Node/Cordis 插件）+ 客户端（React）的 TypeScript 源码
├── index.ts               # 插件入口：apply(ctx, config)，注册工具 + 缓存 + Web 路由
├── tool.ts                # github_trending 工具定义与渲染逻辑
├── parser.ts              # GitHub Trending HTML 解析器（爬取，无官方 API）
├── cache.ts               # 宿主侧进程内缓存 + 后台刷新
└── client/                # 浏览器半体（独立打包为 lib/client.js）
    ├── index.tsx          # 客户端入口：apply(ctx)，注入 shell.overlay
    ├── GithubTrendingPanel.tsx  # 右侧浮层面板 UI
    ├── store.ts           # 跨插槽共享的模块级单例 store
    ├── locales.ts         # i18n 字典（zh/en）+ 键类型
    ├── GithubTrendingAction.module.css  # CSS Modules（lightningcss 编译注入）
    └── css-modules.d.ts   # *.module.css 的类型声明
```

- **宿主端**（`index.ts`/`tool.ts`/`parser.ts`/`cache.ts`）运行在 Node，能访问 `ctx.web`、`node:http`、`globalThis.fetch`，可以注册 Web 路由、跑后台定时器。
- **客户端**（`src/client/*`）运行在浏览器沙箱，只能在「模块表」白名单内取值，不能引入 Node 内置模块，不能 `fetch` 跨域（须走宿主路由）。
- 两者通过 `cordis.patch.yml` 里同一个 `id: github-trending` 绑定成同一个 Bundle。

### 1.2 文件职责（改哪改哪）

| 想改什么 | 改哪个文件 | 注意 |
|---|---|---|
| 工具名称/参数/输出 schema/渲染 | `src/tool.ts` | 同步改 `presentCall`/`presentResult`/`presentationMeta` |
| 抓取逻辑 / 选择器 | `src/parser.ts` + `tests/fixtures/` | 同步更新 fixture 与 `parser.spec.ts` |
| 缓存策略 / 刷新间隔 | `src/cache.ts` + `src/index.ts` | 默认 4h，`refreshIntervalMs` 可配 |
| 新 Web 接口 | `src/index.ts` 的 `createTrendingHandler` | 必须处理 405/502、stale 兜底 |
| 面板 UI / 交互 | `src/client/GithubTrendingPanel.tsx` | 只用 `dsh-client-ui-primitives` 图标 |
| 文案 / 多语言 | `src/client/locales.ts` | 键须加入 `GithubTrendingKey` 联合类型 |
| 面板样式 | `src/client/*.module.css` | 只用 `--dsw-*` 设计令牌 |
| 打包/外置清单 | `tsdown.config.ts` | 改外置前先读 §3.3 |
| Bundle 注册 | `cordis.patch.yml` | 一行 insert 即可，勿动其他 |

---

## 2. 开发环境与工作流

### 2.1 安装与本地依赖链接

```sh
pnpm install        # 安装依赖；@deepseek-ai/* 是 link: 到本地 deepseek-harness
pnpm run build      # tsc -b && tsdown
pnpm run test       # vitest run
pnpm run typecheck  # tsc --noEmit（快速只查类型，不发包）
```

> ⚠️ **本仓库强依赖本地 `~/GitHub/deepseek-ai/deepseek-harness`**（`package.json` 里 `link:` /
> `workspace:^`）。换机器或该路径不存在时 `pnpm install` 会失败。CI 或新成员环境必须先克隆并链接
> 那个 monorepo，否则类型与打包都跑不起来。建议把这条写在 `README` 顶部「前置条件」里。

### 2.2 三条核心命令（任何改动后都跑）

| 命令 | 作用 | 何时跑 |
|---|---|---|
| `pnpm run typecheck` | 只做类型检查 | 每次改完立即跑，最快反馈 |
| `pnpm run test` | 跑单测/集成测试 | 提交前必跑（已验证 22 例全绿） |
| `pnpm run build` | 完整产物（lib/ + lib/client.js） | 发包 / 验证客户端打包前 |

### 2.3 与 harness 的联调

```sh
# 从本地 checkout 加入某个 profile（不会改 deepseek-harness 仓库本身）
dsh plugin --profile headless add /Users/junjian/GitHub/wang-junjian/github-trending
```

改宿主端后通常只需重新 build + 重启 harness；改客户端后必须重新 `tsdown`（刷新浏览器加载的新 `client.js`）。

---

## 3. TypeScript 与构建

### 3.1 tsconfig：NodeNext + `.js` 扩展名（强制约定）

`tsconfig.json` 使用 `module/moduleResolution: NodeNext`，**所有相对导入必须带 `.js` 扩展名**
（`import { ... } from './tool.js'`），即使源文件是 `.ts`。原因：

- NodeNext 要求 ESM 显式扩展名；不带会在运行时报 `ERR_MODULE_NOT_FOUND`。
- Vitest 通过 `vitest.config.ts` 的 alias 把 `.js` 解析回 `.ts` 源码（见 §9.1），所以测试期也能跑。

**最佳实践**：新增任何相对 import 都写 `./foo.js`，不要写 `./foo`。

### 3.2 双产物编译

- 宿主端：`tsc -b` 产出 `lib/*.js` + `lib/types/**/*.d.ts`（`declaration`/`declarationMap`/`sourceMap` 全开）。
  `package.json` 的 `main`/`types`/`exports` 指向这些产物。
- 客户端：`tsdown` 单独把 `lib/client/index.js` 再打包成 `lib/client.js`（CJS 工厂格式）。

`build` 脚本顺序是 `tsc -b tsconfig.json && tsdown`——**必须先 tsc 后 tsdown**，因为 tsdown 的入口
`lib/client/index.js` 是 tsc 的产物（`tsdown.config.ts` 注释已说明）。

### 3.3 tsdown 客户端打包：模块表外置与「纯度门」

`tsdown.config.ts` 里有一套为外部 DSH 插件定制的打包规则，改动需极其谨慎：

1. **模块表外置（白名单）** `MODULE_TABLE_EXTERNALS`：`react`、`react-dom`、`react/jsx-runtime`、
   `@deepseek-ai/cordis`、`@deepseek-ai/dsh-client-ui-slots`、`@deepseek-ai/dsh-client-ui-primitives`、
   `@deepseek-ai/dsh-client-runtime/client`。这些由 Web Shell 的冻结模块表提供，**不内联**。
2. **其余全部内联**：`deps.alwaysBundle` 反向覆盖，任何不在白名单里的 `@deepseek-ai/*` 都会被尝试内联。
3. **纯度门（bundle-purity 插件）**：若从非白名单的 `@deepseek-ai/*` 包做「取值导入」，打包直接 `throw`。
   目的是强制插件只能通过 Cordis 服务协作，避免把宿主内部包打进浏览器端导致体积爆炸或运行时崩溃。

**最佳实践**
- 客户端代码**只能**从白名单取值；需要宿主能力就通过 Cordis 服务（`ctx.slots`/`ctx.locale` 等）拿，
  不要 `import { X } from '@deepseek-ai/dsh-xxx-未白名单'`。
- 想新增一个外置包：先在 Web Shell 的模块表注册它，再加进 `MODULE_TABLE_EXTERNALS`，否则会双重打包。
- 输出是 `window.__ModuleLoader__.load({ id, factory })` 包裹的 CJS（复刻 `dsh-client-modules` 的格式），
  **不要**改成 ESM/IIFE，否则宿主加载器不认。

### 3.4 CSS Modules 经 lightningcss 注入（不走 tsdown 流水线）

- 客户端样式写在 `*.module.css`，由 `tsdown.config.ts` 的 `dsh-github-trending-css-modules` 插件处理：
  `resolveId` 把 `.module.css` 转成虚拟 id → `load` 用 `lightningcss` 编译（pattern `[hash]_[local]`、
  minify）→ 输出一个「注入 `<style>` 标签」的模块（见 `styleInjectionModule`）。
- 该插件**刻意绕开 tsdown 自带的 CSS 管线**，防止样式被错误打包。
- `src/client/css-modules.d.ts` 给 `*.module.css` 提供 `Readonly<Record<string,string>>` 默认导出类型。

**最佳实践**
- 客户端样式只用 CSS Modules（`import css from './x.module.css'`），类名为 `css.xxx`，禁止全局裸 class 污染。
- 任何颜色/间距/圆角**必须用 `--dsw-*` 设计令牌**（见 `GithubTrendingAction.module.css`），禁止写死 hex/rgb，
  以适配宿主明暗主题。唯一的例外是金/银/铜排名底色（语义化强调，已硬编码但仍属可接受的特例）。

---

## 4. Cordis 插件开发规范

### 4.1 插件形态：函数/命名空间插件（无默认导出）

`src/index.ts` 导出一个对象风格插件：`export function apply(ctx, config)` + `export const name/inject/Config`，
**没有 `export default`**。这是 Cordis「函数插件」写法，被 `dsh.plugin(id, pluginModule)` 加载。

### 4.2 inject / ctx.effect / 生命周期清理

- `export const inject = ['tools', 'systemPrompt', 'webServer']`：声明所需服务；缺任一则加载失败（早失败优于运行时 undefined）。
- 所有副作用注册（缓存、Web 路由）都用 `ctx.effect(() => cleanupFn, label)` 包裹，保证插件卸载时释放：
  - `ctx.effect(() => () => { cache.dispose() }, ...)` 停掉所有 `setInterval`。
  - `ctx.effect(() => ctx.webServer.register({...}), ...)` 注册 Web 路由，effect 返回值是注销函数。
- **最佳实践**：任何 `setInterval`/`addEventListener`/`register` 都必须成对写清理；忘记 `dispose()` 是后台定时器泄漏的头号来源（`cache.ts` 的 `dispose()` 已正确处理，照抄即可）。

### 4.3 Config schema 与 schemastery

- `Config` 用 `@deepseek-ai/schemastery` 定义，`enabled/timeoutMs/maxResults/refreshIntervalMs` 都带 `.default(...)`。
- `apply` 里把传入 `config` 当 `ResolvedConfig`（必需字段全有），并调用 `assertPositiveInteger` 做二次校验。
- `timeoutMs`/`maxResults` 还要 `Math.min(resolved.maxResults, MAX_RESULTS_LIMIT)` 夹到硬上限。

**最佳实践**
- 新增可配置项：在 `Config` 接口 + `z.object(...)` 里同步加，给默认值与边界；宿主端用前先断言。
- 用户可在 profile 的 `cordis.patch.yml` 覆盖配置（README 已示例），不要把值写死在代码里（除非是硬上限常量）。

### 4.4 cordis.patch.yml：Bundle 注册

```yaml
- insert:
    - id: github-trending
      name: '@wang-junjian/dsh-github-trending'
```

这一行把 Bundle 插到 harness 的 `dsh.profile.bundles` 里。`package.json` 的 `dsh.bundle.patch` 指向它。
**最佳实践**：保持 `id` 与 `src/index.ts` 的 `export const name` 一致（`github-trending`）；改动注册信息只动这里，
不要去改 harness 仓库。

---

## 5. 工具（Tool）设计

### 5.1 defineTool 与 JSON Schema 输出

`applyGithubTrendingTool`（`src/tool.ts`）用 `ctx.tools.register(defineTool({...}))` 注册。要点：

- `parameters`：`language`/`since`/`maxResults` 三参，类型与描述齐全；`maxResults` 说明 `1-25`。
- `output.schema`：用 JSON Schema 描述返回结构（`repositories[]` + `truncated`），字段带 `required`、
  `additionalProperties: false`——模型拿到的结构严格、可校验。
- `output.render`：把结果渲染成给模型看的 markdown 文本（见 `formatTrendingOutput`）。

**最佳实践**：工具返回**永远带 `truncated` 标记**，让模型知道结果被截断、可能需要更窄的 `language`/`maxResults`。

### 5.2 渲染与「可重放」展示（render / presentationMeta / presentCall / presentResult）

DSH 工具区分两种输出：给模型的（文本）和给 UI 的（卡片）。本项目完整实现了四件套：

- `presentCall`：调用中展示「搜索卡」（标题含语言+时间窗）。
- `output.render`：模型侧 markdown 列表（含排名、语言、星标、今日增量、描述）。
- `output.presentationMeta`：把结果压缩成轻量 JSON（fullName/url/starsToday），用于回放/卡片。
- `presentResult`：完成时搜索结果卡（`paths` 指向各仓库 URL）。
- `trendingMetaFromResult`：对侧**反序列化 + 校验**回放元数据（类型守卫，malformed 返回 `undefined`），防止脏数据崩 UI。

**最佳实践**：`presentationMeta` 与 `presentResult` 必须对称；任何新增展示字段都先改 `TrendingMeta` 类型与
`presentResult` 的 `trendingMetaFromResult` 校验，保证「写出的 meta 能被读回来且类型安全」。

### 5.3 取消信号、超时与并发安全

- `execute` 接收 `exec.signal`，转发给 `fetchTrendingRepositories(url, exec.signal)` → 真正 `fetch(..., { signal })`。
  用户中断对话时请求立即中止。
- `timeoutMs` 来自插件配置，传给 `defineTool({ timeoutMs })` 作为工具级预算。
- `isConcurrencySafe: () => true`：声明该工具无共享可变状态、可并发执行（缓存只读、抓取无副作用）。

**最佳实践**：宿主端所有外部 IO 都要把 `AbortSignal` 一路透传；新建会发网络请求的工具务必标 `isConcurrencySafe` 并确认无竞态。

### 5.4 参数校验与上限

- `resolveMaxResults(requested, configCap)`：先夹到 `Math.min(configCap, MAX_RESULTS_LIMIT)`，再 `Math.max(1, round(...))`。
- 常量 `DEFAULT_MAX_RESULTS=10`、`MAX_RESULTS_LIMIT=25` 集中在 `tool.ts`，不要散落魔法数。

**最佳实践**：模型可能传 `-5`/`0`/`100`，一律夹到 `[1, 25]`；`language` 用 `trim()` + `encodeURIComponent` 防注入/防空格。

---

## 6. HTML 抓取与解析健壮性

### 6.1 node-html-parser 选择器

`parseTrendingHtml` 用 `root.querySelectorAll('article.Box-row')` 定位卡片，逐项 `parseArticle`：
- 仓库名优先用 `<h2 a[href^="/"]>` 的 `href`（`/owner/repo`），比文本更可靠（`parseRepoName` 同时兜底文本解析）。
- 语言：`span[itemprop="programmingLanguage"]`；星标：`a[href$="/stargazers"]`；fork：`a[href$="/forks"]`。

### 6.2 优雅降级（核心健壮性原则）

- `parseCount` 支持 `47,534` 与 `1.2k`/`12k`/`1.2m`，无法解析返回 `undefined`（调用方默认 `0`）。
- 字段缺失 → `undefined` 或 `0`，**绝不抛异常**。整页无 `article.Box-row` → 返回 `[]`（见 `parser.spec.ts` 的空/无关 HTML 用例）。
- `starsToday` 用正则 `^(count) stars? (today|this week|this month)$` 同时覆盖日/周/月三种文案。

**最佳实践**：抓取第三方无 API 页面时，所有字段都按「可能不存在」处理；单个卡片解析失败只 `skip`，不中断整页。

### 6.3 GitHub 页面改版风险与回归测试

README「Known limitations」已明确：**GitHub Trending 无官方 API，解析器针对当前服务端 HTML，改版即需更新**。
`tests/fixtures/github-trending-python.html` 是某次真实页面快照，`parser.spec.ts` 断言了具体数值
（`anthropics/claude-plugins-community` 的 stars 690 / forks 116 / starsToday 190）。

**最佳实践**
- 任何 GitHub 改版或解析异常，**先更新 fixture 再改 parser**，让测试从「快照」层面卡住 markup 结构。
- 不要为了绿而放宽断言；断言里保留真实数值能第一时间发现抓取口径漂移。

---

## 7. 缓存与后台刷新策略

### 7.1 宿主侧进程内缓存

`TrendingCache`（`src/cache.ts`）是简单的 `Map<"${lang}:${since}", entry>`，**刻意不持久化**
（README：host 重启即从冷启动，避免存第三方数据）。

### 7.2 预加载与定时刷新

`src/index.ts` 在 `apply` 时：
- 对 `daily/weekly/monthly` 各调 `ensureScheduled` 启动 `setInterval` 后台刷新（间隔 = `refreshIntervalMs`，默认 4h）。
- 同时 `cache.refresh(...).catch(()=>{})` 立即预填，使面板切换时间窗「秒开」。

### 7.3 重试、超时、stale-while-revalidate

- `refresh` 内 `AbortController` + `setTimeout(timeoutMs)` 实现请求超时；失败重试 `MAX_RETRIES=3`，每次间隔 `500ms`。
- `createTrendingHandler`：正常走缓存；`?refresh=1` 强制 `refreshAll`；**缓存未命中才刷新，刷新失败则回退到 stale 数据**（仍 200），只有连 stale 都没有才 502。

**最佳实践**：对不可靠外部源永远做「超时 + 重试 + stale 兜底」三件套；面板/工具不可因 GitHub 抖动而完全不可用。

### 7.4 Web 路由与 CORS

- 宿主端注册 `GET /github-trending`，浏览器侧 `fetch('/github-trending?...')` 走同源，**绕过 CORS**（README 指出：插件直接 fetch GitHub 而不经 `ctx.web`，故不继承 harness 的 fetch 策略）。
- 路由只接受 `GET`/`HEAD`，其余返回 `405`；`cache-control: no-cache` 保证每次拿最新缓存时间戳。

**最佳实践**：客户端任何跨源数据都通过宿主 Web 路由中转，不要在浏览器直连 `github.com`（会被 CORS 拦 + 暴露逻辑）。

---

## 8. 客户端 UI 开发

### 8.1 shell.overlay 注入与「布局推动」（useLayoutPush）

外部插件**不能**在本版 DSH 声明新的 AppFrame 网格列，所以面板住在 `shell.overlay`，并用 `useLayoutPush`
给 AppFrame 根元素加 CSS 变量 `--dsh-github-trending-width` + class，把中间/详情列 `margin-right` 推开，
避免遮挡对话（`GithubTrendingPanel.tsx`）。

**最佳实践**
- 这种「注入样式 + 改宿主 DOM」是脆弱 hack：选择器用 `[data-shell-overlay]` 兜底查找，改动前先确认宿主 DOM 结构未变。
- 卸载时清理 style 标签（`useEffect` 返回 `style.remove()`），防止多次挂载叠加重复样式。

### 8.2 panelStore：模块级单例跨插槽同步

`store.ts` 的 `panelStore` 是单例，用 `subscribe/getSnapshot/setXxx` 的发布订阅模式，让「侧栏动作按钮」与
「浮层面板」共享 `open/collapsed/since/width` 状态，无需跨 slot 传 props。

**最佳实践**：跨插槽共享状态用模块单例 + 订阅，别试图用 React context 跨 DSH slot 边界（不通）。
所有 setter 先判等再 emit，避免无意义重渲染。

### 8.3 国际化（locale 命名空间 + 模块增强）

- `locales.ts` 导出 `GithubTrendingKey`（联合类型）+ `zh`/`en` 字典。
- `index.tsx` 用 `declare module '@deepseek-ai/dsh-client-ui-slots'` 做**模块增强**，把 `'github-trending'`
  命名空间映射到 `GithubTrendingKey`，使 `ctx.locale.register(NS, { zh, en })` 类型安全。

**最佳实践**：新增文案必须先在 `GithubTrendingKey` 加键，再补 zh/en 两值；遗漏任一会在 `t(...)` 处类型报错，
逼你做到双语齐全。面板里 `t(`panel.${value}`)` 这类动态键要断言成 `GithubTrendingKey`。

### 8.4 图标与设计令牌

- 图标只从 `@deepseek-ai/dsh-client-ui-primitives` 取（`IconRefreshOutline16` 等），不自己画 SVG。
- 颜色/字号/边框全用 `--dsw-*` 令牌（`--dsw-bg-float`、`--dsw-text-brand`、`--dsw-border-subtle`…），
  自动跟随宿主主题。

**最佳实践**：客户端视觉**永远不要**硬编码品牌色/间距；若设计令牌里没有需要的语义，先在宿主设计系统里确认有没有对应变量，不要随手写 `#222`。

### 8.5 可访问性

- 所有图标按钮带 `aria-label` + `title`（中英文案均来自 locale）。
- 拖拽缩放用 Pointer Events + `setPointerCapture`，比 mouse 事件对触屏更友好。
- 折叠态保留 `aria-label` 让屏幕阅读器可聚焦。

---

## 9. 测试策略

### 9.1 单元 / 集成 / 抓取 fixture（Vitest）

`vitest.config.ts` 关键设定：`environment: 'node'`、`globals: false`，并 alias `/^(\.\.?\/.*)\.js$/` → `.$1.ts`
（让测试直接吃 `.ts` 源码，配合 NodeNext 的 `.js` 导入）。

| 测试文件 | 内容 | 手法 |
|---|---|---|
| `tests/parser.spec.ts` | 解析真实 fixture + 构造 HTML | 读 `tests/fixtures/*.html` |
| `tests/tool.spec.ts` | URL 构建、maxResults 夹取、markdown 渲染、`fetch` 异常 | `globalThis.fetch` 替换回 `orig`（try/finally） |
| `tests/plugin.spec.ts` | 真实 Cordis ctx + `SystemPrompt`/`ToolRuntime` + `webServer` stub | `ctx.plugin(...)` 注册、断言 `tools.schemas()` |

**最佳实践**
- 需要网络的地方**一律 mock `globalThis.fetch`** 并在 `finally` 还原，绝不在单测里真打 GitHub（慢 + 被限流 + 不确定）。
- 集成测试用 `ctx.provide('webServer', { register: vi.fn() })` 注入最小桩，验证插件在真实 Cordis 生命周期里注册/禁用/执行工具。
- 断言保留 fixture 真实数值（见 §6.3），把「页面结构」钉死在测试里。

### 9.2 截图验证（Playwright）

`scripts/screenshot_test.py` 用 `playwright.sync_api` 打开 `http://127.0.0.1:3080`，分别截「默认展开 /
收起 rail / 再次展开」三张图到 `tmp/`。它不是单测，是**视觉回归**辅助。

**最佳实践**：UI 大改后跑一次截图脚本人工核对布局推动、折叠、滚动是否正常；`tmp/` 已被 `.gitignore` 忽略，不入仓。

---

## 10. 安全与合规

- **URL 编码**：`buildTrendingUrl` 对 `language` 做 `encodeURIComponent`，防路径注入（`c++` → `c%2B%2B`）。
- **礼貌抓取**：自定义 `User-Agent`（`USER_AGENT` 含包名+仓库链接），不伪装浏览器 UA。
- **限流意识**：无认证请求受 GitHub IP 限流，故默认 4h 才刷一次 + 缓存兜底，不要把刷新间隔改到分钟级。
- **不持久化第三方数据**：缓存仅进程内，重启即丢，符合「不落地第三方内容」的隐私默认。
- **CORS/同源**：客户端经宿主路由中转，不把 GitHub 直连逻辑暴露给浏览器。

---

## 11. 发布与版本管理

- `package.json` 的 `files` 白名单只发包需产物：`lib/index.js`、`lib/tool.js`、`lib/parser.js`、`lib/client.js`、
  `lib/types/**/*.d.ts`、`cordis.patch.yml`——**不要把 `src/`/`tests/`/`tmp/` 打进 npm 包**（除非用 `./src/*` 导出留源码）。
- `exports` 同时暴露根、`/client`、`/cordis.patch.yml`，保证宿主能取到 patch 与客户端入口。
- `prepare` 脚本 = `build`，发包前自动重构建。
- 版本号 `0.1.0`，DSH 外部插件目前靠 `dsh plugin --profile X add <path|pkg>` 安装，发布到 registry 后改用包名。

**最佳实践**：改 `exports`/`files` 后本地 `npm pack` 看一眼 tarball 内容，确认没漏 `cordis.patch.yml`、没带 `src`。

---

## 12. 常见陷阱与排查

| 现象 | 根因 | 处理 |
|---|---|---|
| 客户端打包直接 `throw: "... is not in the module table"` | 从非白名单 `@deepseek-ai/*` 取值导入 | 改协作方式为 Cordis 服务，或把包加进 `MODULE_TABLE_EXTERNALS`（需先在 Web Shell 模块表注册） |
| 运行时 `ERR_MODULE_NOT_FOUND` | 相对 import 漏写 `.js` | 补 `.js` 扩展名（NodeNext 强制） |
| 改了 `client.tsx` 浏览器没变 | 忘了重新 `tsdown` | 跑 `pnpm run build` 再刷新 |
| 面板遮挡对话 | `useLayoutPush` 的宿主 DOM 选择器失效 | 检查 `[data-shell-overlay]` 结构；确认 `PUSH_CLASS`/CSS 变量已注入并被清理 |
| 测试真连 GitHub 超时 | 没 mock `fetch` | 用 `globalThis.fetch = vi.fn(...)` 并在 `finally` 还原 |
| 抓取返回空列表 | GitHub 改版或 fixture 过期 | 更新 `tests/fixtures` 并重写 `parseArticle` 选择器 |
| 宿主重启后面板空白 | 缓存是进程内、冷启动 | 这是预期行为；首屏 `refresh().catch()` 会预热 |
| 新增文案报错 `t(...)` 类型不符 | `GithubTrendingKey` 漏加键 | 在 `locales.ts` 联合类型 + zh/en 同时补 |

---

## 13. 提交前检查清单（PR Checklist）

- [ ] `pnpm run typecheck` 无错
- [ ] `pnpm run test` 全绿（22 例）
- [ ] 宿主端改动：`pnpm run build` 成功，无 bundle-purity 报错
- [ ] 客户端改动：重新 `tsdown`，浏览器实测面板展开/收起/缩放/切时间窗
- [ ] 新增配置项：接口 + schemastery + 断言三处同步
- [ ] 新增工具展示字段：`presentationMeta` 与 `trendingMetaFromResult` 对称 + 类型安全
- [ ] 抓取逻辑变更：更新 `tests/fixtures` 与 `parser.spec.ts`（保留真实数值断言）
- [ ] 网络请求：mock `fetch` 的单测覆盖成功/异常/超时
- [ ] 文案：zh/en 双语齐全，`GithubTrendingKey` 已扩展
- [ ] 样式：仅用 `--dsw-*` 令牌，仅 CSS Modules
- [ ] 副作用：所有 `setInterval`/`addEventListener`/`register` 有成对 `ctx.effect` 清理
- [ ] 不把 `src/`、`tests/`、`tmp/` 误打入 npm 包

---

## 附：一句话总结本仓库的工程哲学

**「宿主端做重、客户端做轻；外部 IO 全超时重试 + stale 兜底；UI 只走设计令牌与白名单模块表；解析无 API 页面时优雅降级并用 fixture 钉死结构。」**
遵循以上，本插件能在 GitHub 页面改版、网络抖动、宿主升级三种不确定下保持可用与可维护。
