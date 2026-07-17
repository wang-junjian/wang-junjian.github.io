---
type: article
title: "用单文件 HTML 写一个能对弈的中国象棋 AI——从规则引擎到 Alpha-Beta 剪枝"
date: 2026-07-17 23:03:00 +0800
tags: [ai, browser, chess, chinese-chess, game, html5-canvas, minimax, tool, web-audio-api]
---

> 一次「中国象棋 + 纯前端 + 自写搜索算法」的完整实践。零依赖、零构建，双击即玩。本文记录规则引擎、AI 搜索、Canvas 渲染的设计思路，以及布局调试中踩过的几个值得记住的坑。
>
> WorkBuddy + GLM-5.2 开发的，花了 200 积分。开发出来第一个版本并没有花多少钱，问题是反复修改一些小问题，积分用量就上来了，感觉缓存并没有起作用。

## 一、需求与技术选型

需求很朴素：**一款可以人机对弈的中国象棋 Web 应用**。

权衡后定的方案：

| 维度 | 选择 | 理由 |
|------|------|------|
| 形态 | 单文件 `index.html` | 双击即可运行，无需构建、无需服务器，便于分享 |
| 技术栈 | 原生 HTML5 + CSS3 + ES6 | 零依赖，引擎/AI/UI 全在一个文件里也能保持清晰 |
| 棋盘渲染 | Canvas | 棋盘线条、楚河汉界、九宫斜线用 Canvas 绘制最直接 |
| AI 算法 | Minimax + Alpha-Beta 剪枝 | 经典、可控、纯前端可跑，难度由搜索深度决定 |

架构上坚持一点：**引擎层（棋盘状态 + 走子规则 + AI）与 UI 层（渲染 + 交互）彻底解耦**。引擎函数只操作棋盘数组，不碰 DOM，方便单独测试和替换。

## 二、棋盘数据结构

中国象棋是 10 行 9 列的交叉点棋盘。用一个二维数组表示：

```js
// board[row][col]，row 0-9，col 0-8
// row 0 = 红方底线（下方），row 9 = 黑方底线（上方）
// 红方在下方，向上（row 递增）进攻
board = Array.from({length:10}, () => Array(9).fill(null));
// 棋子：{ t: 类型, s: 方向 }  t∈{k,a,e,n,r,c,p}  s∈{'r','b'}
```

初始布局函数：

```js
function initialBoard(){
  const b = Array.from({length:10}, () => Array(9).fill(null));
  const setup = (side, base) => {
    const dir = side === RED ? 1 : -1;   // 红向上、黑向下
    const back = ['r','n','e','a','k','a','e','n','r'];
    for(let c=0;c<9;c++) b[base][c] = {t:back[c], s:side};
    b[base + dir*2][1] = {t:'c', s:side};   // 炮
    b[base + dir*2][7] = {t:'c', s:side};
    [0,2,4,6,8].forEach(c => b[base + dir*3][c] = {t:'p', s:side}); // 兵
  };
  setup(RED, 0);    // 红方在 row 0-3
  setup(BLACK, 9);  // 黑方在 row 6-9
  return b;
}
```

**坐标约定的关键**：红方在 row 0，向上进攻意味着 row 递增；黑方在 row 9，向下进攻 row 递减。这个方向统一用 `dir = side===RED ? 1 : -1` 表达，兵的走法、飞将检测都复用它，避免写两套逻辑。

## 三、规则引擎：七种棋子的走法

核心是一个 `pieceMoves(b, r, c)` 函数，返回某棋子的所有「伪合法走法」（不考虑走完是否自将）。每种棋子单独处理，几个容易出错的点单独说明。

### 1. 通用工具

```js
const inBoard = (r,c) => r>=0 && r<10 && c>=0 && c<9;
function inPalace(side, r, c){
  if(c<3 || c>5) return false;
  return side===RED ? (r>=0 && r<=2) : (r>=7 && r<=9);
}
function crossedRiver(side, r){ return side===RED ? r>=5 : r<=4; }

const add = (b, side, moves, nr, nc) => {
  if(!inBoard(nr,nc)) return;
  const t = b[nr][nc];
  if(!t || t.s !== side) moves.push([nr,nc]);  // 空或吃对方
};
```

### 2. 马——蹩马腿

马的八个方向，每个方向都有一个对应的「蹩腿点」。用 `[dr, dc, br, bc]` 四元组一次表达清楚：

```js
case 'n':{
  const d = [
    [-2,-1,-1,0],[-2,1,-1,0],[2,-1,1,0],[2,1,1,0],
    [-1,-2,0,-1],[1,-2,0,-1],[-1,2,0,1],[1,2,0,1]
  ];
  d.forEach(([dr,dc,br,bc]) => {
    const nr=r+dr, nc=c+dc;
    if(!inBoard(nr,nc)) return;
    if(b[r+br][c+bc]) return;   // 蹩马腿
    add(b, side, moves, nr, nc);
  });
  break;
}
```

`[dr,dc]` 是落点偏移，`[br,bc]` 是蹩腿点偏移。比如马往上跳两格（`dr=-2`），蹩腿点在正上方一格（`br=-1, bc=0`）。把方向和蹩腿点绑在一起，比单独写八个 if 清晰得多。

### 3. 象——塞象眼 + 不过河

```js
case 'e':{
  [[-2,-2],[-2,2],[2,-2],[2,2]].forEach(([dr,dc]) => {
    const nr=r+dr, nc=c+dc;
    if(!inBoard(nr,nc)) return;
    if(side===RED && nr>4) return;   // 红象不过河
    if(side===BLACK && nr<5) return; // 黑象不过河
    if(b[r+dr/2][c+dc/2]) return;    // 塞象眼（田字中心点）
    add(b, side, moves, nr, nc);
  });
  break;
}
```

`dr/2` 是整数（-1 或 1），刚好是田字中心点的行偏移。

### 4. 炮——隔山打牛

炮的移动同车（直线），但吃子必须隔且仅隔一个棋子。用一个 `jumped` 标志区分「移动阶段」和「吃子阶段」：

```js
case 'c':{
  [[-1,0],[1,0],[0,-1],[0,1]].forEach(([dr,dc]) => {
    let nr=r+dr, nc=c+dc, jumped=false;
    while(inBoard(nr,nc)){
      const t = b[nr][nc];
      if(!jumped){
        if(!t) moves.push([nr,nc]);   // 未翻山，空格可走
        else jumped=true;             // 遇到第一个子，翻山
      }else{
        if(t){ if(t.s!==side) moves.push([nr,nc]); break; } // 翻山后遇子，吃或挡
      }
      nr+=dr; nc+=dc;
    }
  });
  break;
}
```

### 5. 将——飞将照面

将帅的走法本身简单（九宫内一格），但有个特殊规则：**同列直接对面、中间无遮挡时，将帅可以"飞"过去吃对方将**。这其实等价于"将帅照面是非法的"——因为任何一方都可以"飞过去吃"，所以双方将帅不能在同列无遮挡相对。

```js
case 'k':{
  [[-1,0],[1,0],[0,-1],[0,1]].forEach(([dr,dc]) => {
    const nr=r+dr, nc=c+dc;
    if(inPalace(side,nr,nc)) add(b, side, moves, nr, nc);
  });
  // 飞将：沿本列向对方方向找，第一个子若是对方将则可吃
  const dir = side===RED ? 1 : -1;
  for(let nr=r+dir; inBoard(nr,c); nr+=dir){
    const t = b[nr][c];
    if(t){ if(t.t==='k' && t.s!==side) moves.push([nr,c]); break; }
  }
  break;
}
```

把飞将作为将的合法走法之一，"照面非法"就自动被 `allMoves` 的自将过滤覆盖了——任何导致照面的走法都会让自己被对方"飞吃"，从而被判定为自将而过滤掉。**用一个机制同时表达两条规则**，是这里最省事的写法。

## 四、将军与终局判定

### 1. 是否被将军

枚举对方所有棋子的走法，看能否吃到己方将：

```js
function inCheck(b, side){
  const k = findKing(b, side);
  if(!k) return true;   // 将被吃了，视为被将军
  const opp = side===RED ? BLACK : RED;
  for(let r=0;r<10;r++) for(let c=0;c<9;c++){
    const p = b[r][c];
    if(p && p.s===opp){
      const ms = pieceMoves(b,r,c);
      for(const [nr,nc] of ms) if(nr===k[0] && nc===k[1]) return true;
    }
  }
  return false;
}
```

### 2. 合法走法 = 伪合法走法 − 自将

```js
function allMoves(b, side){
  const list = [];
  for(let r=0;r<10;r++) for(let c=0;c<9;c++){
    const p = b[r][c];
    if(p && p.s===side){
      const ms = pieceMoves(b,r,c);
      for(const [nr,nc] of ms)
        list.push({fr:r, fc:c, tr:nr, tc:nc, cap: b[nr][nc]?VAL[b[nr][nc].t]:0});
    }
  }
  // 过滤掉走完会让自己被将军的步
  return list.filter(m => {
    const t = b[m.tr][m.tc];
    b[m.tr][m.tc] = b[m.fr][m.fc]; b[m.fr][m.fc] = null;
    const safe = !inCheck(b, side);
    b[m.fr][m.fc] = b[m.tr][m.tc]; b[m.tr][m.tc] = t;  // 撤销
    return safe;
  });
}
```

**Make/Unmake 模式**：直接在原棋盘上做走子、检测、撤销，避免每步都深拷贝整个棋盘。性能上比 `cloneBoard` 快一个数量级。

### 3. 将死与困毙

```js
function isCheckmate(b, side){ return allMoves(b,side).length===0 && inCheck(b,side); }
function isStalemate(b, side){ return allMoves(b,side).length===0 && !inCheck(b,side); }
```

无棋可走 + 被将军 = 将死；无棋可走 + 未被将军 = 困毙（和棋）。

## 五、AI：Minimax + Alpha-Beta 剪枝

### 1. 评估函数

评估 = 棋子基础价值 + 位置加成。棋子价值表是常识，关键是**位置评估表**——同一枚兵在己方底线和对方九宫旁价值天差地别。

```js
const VAL = {k:6000, r:900, c:450, n:400, e:200, a:200, p:100};

// 兵的位置表（红方视角，row 0 = 红方底线）
const PP = [
  [0,0,0,0,0,0,0,0,0],
  // ... 过河前基本为 0
  [20,0,30,0,40,0,30,0,20],   // row 5：刚过河
  [40,40,55,60,65,60,55,40,40] // row 9：逼近九宫
];
```

黑方位置表取红方的镜像（`POSP[p.t][9-r][c]`），保证对称。评估函数返回**正数表示红方优势**：

```js
function evalBoard(b){
  let s = 0;
  for(let r=0;r<10;r++) for(let c=0;c<9;c++){
    const p = b[r][c]; if(!p) continue;
    const pos = POSP[p.t] ? (p.s===RED ? POSP[p.t][r][c] : POSP[p.t][9-r][c]) : 0;
    s += p.s===RED ? (VAL[p.t]+pos) : -(VAL[p.t]+pos);
  }
  return s;
}
```

### 2. Minimax + Alpha-Beta

红方最大化、黑方最小化。Alpha-Beta 剪枝靠 `alpha >= beta` 提前终止：

```js
function search(b, depth, alpha, beta, side){
  if(depth===0) return evalBoard(b);
  const moves = allMoves(b, side);
  if(moves.length===0){
    return inCheck(b,side) ? (side===RED ? -100000-depth : 100000+depth) : 0;
  }
  moves.sort((x,y) => y.cap - x.cap);   // 吃子优先，提升剪枝效率
  const next = side===RED ? BLACK : RED;
  if(side===RED){
    let best = -Infinity;
    for(const m of moves){
      const t = makeMove(b,m);
      const v = search(b, depth-1, alpha, beta, next);
      unmakeMove(b,m,t);
      if(v>best) best=v;
      if(v>alpha) alpha=v;
      if(alpha>=beta) break;   // β 截断
    }
    return best;
  }else{
    let best = Infinity;
    for(const m of moves){
      const t = makeMove(b,m);
      const v = search(b, depth-1, alpha, beta, next);
      unmakeMove(b,m,t);
      if(v<best) best=v;
      if(v<beta) beta=v;
      if(alpha>=beta) break;   // α 截断
    }
    return best;
  }
}
```

### 3. 两个实战要点

**走法排序**：Alpha-Beta 的剪枝效率高度依赖走法顺序。把吃子（尤其吃大子）的走法排前面，能尽早产生紧的边界，剪掉更多分支。简单一行 `moves.sort((x,y)=>y.cap-x.cap)` 就能让搜索效率提升数倍。

**终局深度惩罚**：`-100000-depth` 而不是 `-100000`，让 AI 在同样被判负的局面里**偏好拖更久才输**（深度越大，绝对值越小，对最大化方越"好"），避免 AI 一发现要输就立刻送将。这是 minimax 里常用的小技巧。

### 4. 难度分级

难度直接对应搜索深度：

| 档位 | 深度 | 特点 |
|------|------|------|
| 入门 | 2 | 几乎只看一步，会送子 |
| 业余 | 3 | 能看两步组合，常见战术可见 |
| 高手 | 4 | 开局思考 1–2 秒，棋力明显增强 |

纯前端同步搜索，深度 4 在开局（分支因子大）会有 1–2 秒卡顿。后续可上 Web Worker 后台搜索 + Zobrist 置换表，能再深一两层。

## 六、Canvas 渲染与响应式坐标

### 1. 棋盘绘制

棋盘宽 9 列、高 10 行，交叉点落子。Canvas 物理尺寸固定 `480×534`（`8*54 + 24*2` / `9*54 + 24*2`），用 `GX=GY=24` 作为内边距：

```js
const CW=480, CH=534, CELL=54, GX=24, GY=24;
```

绘制要点：
- 横线 10 条、竖线 9 条，**中间竖线在楚河汉界处断开**（第 4、5 行之间）
- 九宫格画两条对角线（上下各一个九宫）
- 兵炮位置画小十字标记
- 棋子用径向渐变模拟木质立体感 + 书法字体

### 2. 响应式缩放与点击精度

这是 Canvas 应用最容易踩的坑：**Canvas 物理像素固定，但 CSS 可以缩放显示，点击坐标必须换算回物理像素**。

```js
function cellFromXY(x, y){
  const rect = cvs.getBoundingClientRect();
  const sx = CW / rect.width, sy = CH / rect.height;  // 缩放比
  const px = x * sx, py = y * sy;
  const c = Math.round((px - GX) / CELL);
  const r = Math.round((py - GY) / CELL);
  if(!inBoard(r,c)) return null;
  // 容差：距离不超过半格
  if(Math.abs(px-(GX+c*CELL)) > CELL/2) return null;
  if(Math.abs(py-(GY+r*CELL)) > CELL/2) return null;
  return [r, c];
}
```

CSS 端只要 `canvas{max-width:100%; height:auto}`，Canvas 就能随容器缩放，而上面的换算保证缩放后点击依然精准。**这是 Canvas 响应式的标准套路，记下来不亏**。

## 七、布局踩坑实录（重点）

这次调试花时间最多的不是 AI，而是 CSS 布局。几次反复值得记下来。

### 坑 1：flex 默认 stretch 把侧栏拉到同高

三栏布局 `[棋谱 | 棋盘 | 控制]`，控制区有三个堆叠卡片比棋盘高。结果棋谱卡片被默认的 `align-items: stretch` 拉到和控制区一样高，出现大片空白。

**解法**：给棋谱栏去掉 `align-self: stretch`，或父容器用 `align-items: flex-start`，让各栏顶部对齐、互不强制等高。需要等高时再用固定 `height`。

### 坑 2：Canvas 固定尺寸撑爆窄屏

桌面下 Canvas 480px 宽没问题，手机视口 390px 时 `board-wrap`（508px）直接撑爆，出现横向滚动。

**解法**：
```css
canvas{ max-width:100%; height:auto; }
.board-wrap{ max-width:480px; width:100%; }
```
配合上面的坐标换算，缩放后点击不偏。**Canvas 一定要配合坐标换算做响应式，不能只改 CSS**。

### 坑 3：窄屏下控制区三卡片横排溢出

媒体查询里给 `.side` 设了 `flex-direction: row`，三个卡片 `min-width:200px`，在 390px 视口下 `200*3=600 > 390` 溢出错位。

**解法**：再加一层断点，手机宽度下控制区改回竖排：
```css
@media(max-width:540px){
  .side{ flex-direction:column; }
  .side .card{ width:100%; min-width:0; flex:none; }
}
```
**断点要分级**，一套断点打天下往往会顾此失彼。

### 坑 4：覆盖全局样式时漏掉属性（最隐蔽）

这是最折磨人的一坑。全局 `.log` 里有：
```css
.log{ max-height:150px; overflow:auto; ... }
```

棋谱移到左侧后，我给 `.side-left .log` 加了：
```css
.side-left .log{ flex:1; min-height:0; overflow:auto; }
```

看起来很合理——覆盖了 `overflow`、加了 `flex:1`。但 **`max-height:150px` 没被覆盖**！结果列表被 150px 锁死，`flex:1` 根本撑不开，棋谱只显示 4 行就停住，下面大片空白。

调试时反复在 `height`、`flex` 上找原因，完全没想到是全局的 `max-height` 在作祟。直到逐条对比 `.log` 和 `.side-left .log` 的属性才发现。

**解法**：
```css
.side-left .log{ flex:1; min-height:0; overflow:auto; max-height:none; }
```

**教训（划重点）**：
> 覆盖全局样式时，要把相关属性**全部列出来**——`flex / overflow / max-height / min-height`，不能只覆盖"我以为冲突的"那几个。CSS 的层叠是按属性逐个算的，漏一个就埋一个雷。

调试这类问题最快的方法：**打开 DevTools，选中元素，看 Computed 面板里每个属性最终值来自哪条规则**，比盯着源码猜快得多。

## 八、成果与后续

### 当前功能
- 完整七种棋子规则（含蹩马腿、塞象眼、隔山打牛、飞将、过河兵）
- 将军 / 将死 / 困毙判定 + 自将拦截
- Minimax + Alpha-Beta 剪枝 AI，三档难度
- 棋谱中文记法（如「炮二平五」）、双方计时、Web Audio 合成音效
- 执红/执黑切换、悔棋、认输、AI 提示
- 桌面三栏 + 移动端响应式

### 可优化方向
1. **Web Worker 后台搜索**：把 AI 计算移出主线程，深度 4 不再卡 UI
2. **Zobrist 哈希 + 置换表**：缓存已搜局面，加深有效搜索层
3. **开局库 / 残局库**：减少搜索、提升棋力
4. **执黑时棋盘翻转**：让玩家始终在下方视角

### 一点感想

这次最大的体会是：**纯前端做一个"能下"的象棋 AI，门槛比想象中低**。Minimax + Alpha-Beta 加起来不到 50 行，评估函数靠一张棋子价值表 + 一张位置表就能下得有模有样。真正耗时的是规则引擎的边界情况（飞将、塞象眼这些）和 CSS 布局的细枝末节。

后者尤其值得警惕——AI 算法的正确性靠逻辑推理，CSS 的正确性靠"逐属性核对"。两种调试思维完全不同，混在一个项目里时记得切换频道。
