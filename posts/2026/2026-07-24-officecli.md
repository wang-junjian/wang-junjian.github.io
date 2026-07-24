---
type: article
title: "OfficeCLI 命令行工具完整使用手册（Skill）"
date: 2026-07-24 19:48:00 +0800
tags: [officecli, skill, command-line-tool, docx, xlsx, pptx, office, document-processing]
---

> 名称：officecli
> 
> 描述：通过 officecli 命令行工具创建、分析、校对、修改 Office 文档（.docx、.xlsx、.pptx）。适用于用户需要新建文档、查看内容、检查格式、排查问题、插入图表或修改 Office 文件的场景。

officecli

适配AI使用的命令行工具，支持 .docx、.xlsx、.pptx。单二进制文件，无外部依赖，**无需预先安装 Office**。

## 安装

若未安装 `officecli`：

```
# macOS / Linux
curl -fsSL https://d.officecli.ai/install.sh | bash

# Windows（PowerShell）
irm https://d.officecli.ai/install.ps1 | iex
```

执行 `officecli --version` 验证安装。安装完成仍提示命令不存在时，请打开新终端重试。

---

## 使用层级策略

**L1（读取操作） → L2（文档DOM编辑） → L3（原始XML）**
优先使用更高层级接口。添加参数 `--json` 可输出结构化数据。

**处理文档前，请查阅【专用技能模块】（文档底部）**
融资演示文稿、学术论文、财务模型、数据看板、平滑切换（Morph）动画需要先加载对应专用技能——执行一次 `load_skill` 后再执行操作。

---

## 帮助系统（重要）

**不清楚属性名称、取值格式、命令语法时，务必查看帮助文档，不要盲目猜测。**
一次帮助查询远优于反复试错。

`officecli help` 等价于 `officecli --help`；
`officecli <命令> --help` 等价于 `officecli help <命令>`，内容完全一致。

```
officecli help                                  # 列出全部命令、全局参数、结构入口
officecli help docx                             # 展示所有 Word 文档元素
officecli help docx paragraph                   # 完整结构定义：属性、别名、示例、读取方式
officecli help docx set paragraph               # 筛选修改可用项：仅展示 set 命令支持的属性
officecli help docx paragraph --json            # 输出机器可读的结构化定义
```

格式别名：`word`→`docx`，`excel`→`xlsx`，`ppt`/`powerpoint`→`pptx`
动作指令：`add`（新增）、`set`（修改）、`get`（读取）、`query`（筛选查询）、`remove`（删除）

MCP 协议通过唯一字符串参数 `command` 传递指令：
`{"command":"help docx paragraph"}`
**注意：并非结构化对象 `{"格式":...,"类型":...}`；MCP工具仅有一个 command 参数，原样转发给命令行程序。**

---

## 性能：常驻进程模式

**首次执行任意命令会自动启动常驻进程（闲置60秒自动释放）**，自动规避文件占用冲突。
长时间编辑（预期闲置超过12分钟）建议显式打开/关闭文件：

```
officecli open report.docx       # 将文件常驻内存
officecli set report.docx ...    # 消除重复磁盘IO开销
officecli close report.docx      # 保存变更并释放文件
```

关闭自动常驻机制：设置环境变量 `OFFICECLI_NO_AUTO_RESIDENT=1`

**刷新规则：仅在 officecli 外部程序读取文件前持久化。**
officecli 自身读取（`get`/`query`/`view`/`dump`）可以实时获取最新修改，流程中途无需手动保存。
仅当**外部程序读取文件前**执行 `save`（保持常驻）或 `close`（写入并释放），例如：python-docx/openpyxl、Office软件、渲染器、文件上传等场景。
闲置进程会在数秒内自动落盘；设置 `OFFICECLI_RESIDENT_FLUSH=each` 可令每一次修改操作执行完毕立刻写入磁盘。

---

## 快速上手

**PPT演示文稿：**

```
officecli create slides.pptx
officecli add slides.pptx / --type slide --prop title="第四季度报告" --prop background=1A1A2E
officecli add slides.pptx '/slide[1]' --type shape --prop text="营收增长25%" --prop x=2cm --prop y=5cm --prop font=Arial --prop size=24 --prop color=FFFFFF
```

**Word文档：**

```
officecli create report.docx
officecli add report.docx /body --type paragraph --prop text="执行摘要" --prop style=Heading1
officecli add report.docx /body --type paragraph --prop text="营收同比增长25%"
```

**Excel表格：**

```
officecli create data.xlsx
officecli set data.xlsx /Sheet1/A1 --prop value="姓名" --prop bold=true
officecli set data.xlsx /Sheet1/A2 --prop value="Alice"
```

---

## L1层级：新建、读取与检查

```
officecli create <文件路径>               # 创建空白 .docx/.xlsx/.pptx（由后缀识别类型）
officecli view <文件路径> <模式>          # outline | stats | issues | text | annotated | html
officecli get <文件路径> <路径> --depth N # 获取节点及其子元素 [支持--json]
officecli query <文件路径> <选择器>     # 类CSS筛选语法
officecli validate <文件路径>             # 根据OpenXML规范校验文档合法性
```

### view 查看模式

| 模式 | 说明 | 常用参数 |
| --- | --- | --- |
| `outline` | 文档大纲结构 |  |
| `stats` | 文档统计（页数、字数、图形数量） |  |
| `issues` | 格式/内容/结构异常 | `--type format\|content\|structure`、`--limit N` |
| `text` | 纯文本提取 | `--start N --end N`、`--max-lines N` |
| `annotated` | 带格式标记的文本 |  |
| `html` | 静态HTML快照，渲染引擎与watch一致，无需启动服务 | `--browser`、docx支持`--page N`、pptx支持`--start N --end N` |
| `screenshot` / `svg` / `pdf` / `forms` | 无头浏览器导出PNG / PPT页面SVG / 通过插件导出PDF / 表单字段JSON | `-o`、`--screenshot-width/-height`，PPT支持`--grid N` |

一次性快照场景（CI产物、归档、文本对比）使用 `view html`；
需要实时刷新、浏览器点击选取元素时使用 `watch`。

### get 读取节点

支持基于元素本地名称的XML路径；`--depth N` 控制展开子层级；`--json` 输出结构化数据。
默认文本输出便于grep检索：`路径 (类型) "文本内容" 参数=值 参数=值 …`

```
officecli get report.docx '/body/p[3]' --depth 2 --json
officecli get slides.pptx '/slide[1]' --depth 1          # 列出第1页所有形状
officecli get data.xlsx '/Sheet1/B2' --json
```

### 稳定ID寻址

拥有唯一稳定ID的元素使用 `@属性=值` 路径，而非数字位置索引。**多步骤自动化优先选用稳定ID路径**；插入、删除元素会改变位置索引，但稳定ID不受影响。

```
/slide[1]/shape[@id=550950021]                    # PPT形状
/slide[1]/table[@id=1388430425]/tr[1]/tc[2]       # PPT表格单元格
/body/p[@paraId=1A2B3C4D]                         # Word段落
/comments/comment[@commentId=1]                    # Word批注
```

PPT额外支持 `@name=`（如 `shape[@name=标题 1]`），兼容Morph动画 `!!` 前缀规则。
无稳定ID的元素（幻灯片、文本片段、表格行列、Excel行）只能使用位置索引。

### query 筛选查询

类CSS选择器语法：`[属性=值]`、`[属性!=值]`、`[属性~=文本]`、`[属性>=数值]`、`[属性<=数值]`、`:contains("文本")`、`:empty`、`:has(公式)`、`:no-alt`。
支持 `and`/`or` 逻辑运算，适用于 `query`/`set`/`remove`：
`cell[value>5000 or value<100]`、`cell[(type=Number or type=Date) and value>0]`
Excel支持工作表语法：`Sheet1!row[薪资>5000]`。
`set` 支持选择器与原生单元格路径，语法对齐 `get`/`query`。
`set`/`remove` 禁止使用无作用域的裸选择器。

```
officecli query report.docx 'paragraph[style=Normal] > run[font!=Arial]'
officecli query slides.pptx 'shape[fill=FF0000]'
```

---

## 实时预览与交互式选取

启动HTML实时预览，文件变更自动刷新。浏览器支持单击、Shift多选、框选图形；命令行可读取浏览器选中项并执行操作。

```
officecli watch <文件> [--port N]      # 启动预览服务，默认端口26315
officecli unwatch <文件>               # 停止预览
officecli goto <文件> <路径>           # 浏览器自动滚动定位到目标元素（docx：段落/表格/行/单元格）
```

打开控制台输出的 `http://localhost:N` 地址。单击选中；Shift/Cmd/Ctrl+点击多选；空白处拖拽框选。
PPT/Word选中元素显示蓝色边框；Excel为原生绿色选区；双击单元格可在线编辑；拖拽图表调整位置。

### `get <文件> selected` — 获取浏览器选中对象

```
officecli get <文件> selected [--json]
```

返回当前选中的文档节点；无选中内容返回空。未启动watch服务时返回非0退出码。

```
# 用户在浏览器选中多个图形，执行命令统一修改为红色
PATHS=$(officecli get deck.pptx selected --json | jq -r '.data.Results[].path')
for p in $PATHS; do officecli set deck.pptx "$p" --prop fill=FF0000; done
```

### 选取功能关键特性

- **文件编辑后选区保持有效**：路径自动使用稳定ID格式
- **所有打开的浏览器共享同一套选区**：后操作覆盖先操作
- **同一文件仅允许一个watch进程**
- **组合图形整体选中**：v1版本暂不支持直接选中组合内部子元素
- **支持范围**：
.pptx：形状、图片、表格、图表、连接线、组合图形
.docx：顶层段落、表格
不支持母版装饰、Word深层内嵌元素（单元格、文本片段）
**.xlsx暂不生成选取路径**，标记/选区查询始终返回 stale=true（计划v2版本完善）

### mark标记：待人工审核的修改建议

变更需要人工确认再写入文件时使用mark。标记仅保存在watch进程中，需单独管道执行set确认修改。
一次性修改直接使用set；需要永久文档批注请使用 `add --type comment`（Office原生批注）。

```
officecli mark <文件> <路径> [--prop find=... color=... note=... tofix=... regex=true] [--json]
officecli unmark <文件> [--path <路径> | --all] [--json]
officecli get-marks <文件> [--json]
```

参数说明：
`find`：文本匹配（开启regex=true支持正则；原始写法 `find='r"[abc]"'`）
`color`：十六进制/rgb格式/内置命名颜色
`note`：备注信息
`tofix`：用于自动化批量确认管道
**路径必须使用watch页面输出的data-path格式**；完整流程参考子技能文档。

---

## L2层级：文档DOM操作

### set — 修改元素属性

```
officecli set <文件> <路径> --prop key=value [--prop ...]
```

**所有XML属性均可通过元素路径设置**（路径通过 `get --depth N` 查询），即使属性原本不存在。
不添加文本匹配 `find=` 时，格式修改作用于整个元素。

**取值格式规范**

| 类型 | 格式 | 示例 |
| --- | --- | --- |
| 颜色 | 带/不带#十六进制、命名色、RGB、主题色 | `FF0000`、`#FF0000`、`red`、`rgb(255,0,0)`、`accent1`~\`accent6\` |
| 间距 | 带单位 | `12pt`、`0.5cm`、`1.5x`、`150%` |
| 尺寸 | EMU单位 / 带后缀单位 | `914400`、`2.54cm`、`1in`、`72pt`、`96px` |

**点分隔属性别名**：形状/文本片段/段落/表格行列样式支持 `font.<属性>`
例：`--prop font.color=red --prop font.bold=true --prop font.size=14pt`
执行 `officecli help <格式> <元素名>` 查看完整列表。

### find — 匹配文本并设置格式/替换文本

`set` 顶层参数支持 `--find` / `--replace`（旧写法 `--prop find=X` 仍兼容，但会提示迁移）

```
# 匹配文字设置格式（自动拆分文本片段）
officecli set doc.docx '/body/p[1]' --find weather --prop bold=true --prop color=red

# 正则匹配（regex仍作为prop参数）
officecli set doc.docx '/body/p[1]' --find '\d+%' --prop regex=true --prop color=red

# 全文替换文本（/ 代表整个文档）
officecli set doc.docx / --find draft --replace final

# Word：带修订记录的查找替换
officecli set doc.docx / --find draft --replace final --prop revision.author=Alice

# PPT语法一致，仅路径不同
officecli set slides.pptx / --find draft --replace final
```

**路径控制搜索范围**
`/` = 全文；`/body/p[1]`/`/slide[N]/shape[M]` = 指定元素；`/header[1]`/`/footer[1]` = 页眉页脚

**注意事项**

- 默认区分大小写；不区分大小写写法：`--prop 'find=(?i)error' --prop regex=true`
- 可跨文本片段匹配
- 无匹配项命令静默执行成功；`--json` 返回 `"matched": N` 匹配数量
- **Excel限制**：仅支持查找替换文本，不支持匹配文本单独设置格式

### add — 新增元素 / 克隆元素

```
officecli add <文件> <父容器> --type <类型> [--prop ...]
officecli add <文件> <父容器> --type <类型> --after <路径> [--prop ...]   # 在目标元素后方插入
officecli add <文件> <父容器> --type <类型> --before <路径> [--prop ...]  # 在目标元素前方插入
officecli add <文件> <父容器> --type <类型> --index N [--prop ...]        # 指定索引位置（旧语法）
officecli add <文件> <父容器> --from <路径>                               # 克隆已有元素
```

`--after` / `--before` / `--index` 互斥。不指定位置默认追加至末尾。

> 
> 各类文档支持元素类型过长，此处省略原文超长类型清单翻译，如需可告知完整翻译；核心说明：
> pptx：幻灯片、形状、图片、图表、表格、连接线、动画、切换效果等
> docx：段落、文本、表格、图片、页眉页脚、书签、批注、目录、公式、控件等
> xlsx：工作表、单元格、行列、图表、数据透视表、条件格式、数据验证、迷你图等

### Excel 数据透视表示例

```
officecli add data.xlsx /Sheet1 --type pivottable \
  --prop source="Sheet1!A1:E100" --prop rows=Region,Category \
  --prop cols=Year --prop values="Sales:sum,Qty:count" \
  --prop grandTotals=rows --prop subtotals=off --prop sort=asc
```

核心参数：`rows`行字段、`cols`列字段、`values`值字段（格式：字段:聚合方式\[:显示方式\]）、`filters`筛选字段、`source`数据源区域、`position`放置位置、`layout`布局样式等。
聚合函数：sum求和、count计数、average平均值、max/min最大最小等。日期字段支持自动分组。运行 `officecli help xlsx pivottable` 查看完整定义。

### 文档全局属性（全部格式通用）

```
officecli set doc.docx / --prop docDefaults.font=Arial --prop docDefaults.fontSize=11pt
officecli set doc.docx / --prop protection=forms --prop evenAndOddHeaders=true
officecli set data.xlsx / --prop calc.mode=manual --prop calc.refMode=r1c1
officecli set slides.pptx / --prop defaultFont=Arial --prop show.loop=true --prop print.what=handouts
```

执行 `officecli help <格式> /` 查看全部文档级别配置：默认样式、网格、CJK字符间距、计算选项、打印、放映、主题等。

### Excel 排序

```
officecli set data.xlsx /Sheet1 --prop sort="C desc" --prop sortHeader=true
officecli set data.xlsx '/Sheet1/A1:D100' --prop sort="A asc" --prop sortHeader=true
```

格式：`列 升降序[,列 升降序...]`。不支持包含合并单元格、数组公式的区域。超链接、批注、条件格式、图表等附属内容跟随行同步移动。

### 根据文本定位插入 `--after find:X` / `--before find:X`

通过文本匹配定位插入点。行内元素（文本、图片、超链接）插入段落内部；块元素（表格、段落）会自动拆分原段落。PPT仅支持行内插入。

```
# Word：匹配文字后方新增一段文字
officecli add doc.docx '/body/p[1]' --type run --after find:weather --prop text=" (晴朗)"

# Word：匹配文字后方插入表格（自动拆分段落）
officecli add doc.docx '/body/p[1]' --type table --after "find:第一句话。" --prop rows=2 --prop cols=2
```

### 克隆元素

`officecli add <文件> / --from '/slide[1]'` — 完整复制元素，保留内部关联资源。

### move、swap、remove

```
officecli move <文件> <路径> [--to <父容器>] [--index N] [--after <路径>] [--before <路径>]
officecli swap <文件> <路径1> <路径2>
officecli remove <文件> '/body/p[4]'
```

使用 `--after`/`--before` 时，可省略 `--to`，程序自动识别目标父容器。

### batch批量执行：单次保存周期执行多条操作

**v1.0.137+ 默认原子事务：**
所有命令依次执行并输出结果（统计成功/失败数量），**只要任意一条失败，整体全部回滚，磁盘文件维持原始状态**。
添加 `--best-effort` 恢复旧模式：保留执行成功的修改（适合批量导入场景，不希望单条失败导致全部作废）。
`--stop-on-error` 仅控制是否立刻终止后续任务，不影响事务回滚规则；如需「出错停止且保留已执行内容」需要同时搭配 `--best-effort`。
`--force` 和事务无关，仅用于解除docx文档保护限制。
失败结果携带标准化错误码；事务回滚成功时JSON输出 `"atomicRolledBack": true`。

`officecli dump <文件> [<路径>]` 导出可回放的批量操作JSON：
docx覆盖完整；pptx支持文本、表格、图片、图表、母版、多媒体；xlsx支持单元格、公式、样式、透视表、条件格式等。
路径默认为 `/`（整个文档）；可指定子树：`/body`、`/Sheet1`等。
`officecli refresh <文件.docx>` 重新计算目录页码、交叉引用。
`officecli plugins list` 查看扩展插件，支持 .doc、.hwpx、PDF导出。

```
echo '[
  {"command":"set","path":"/Sheet1/A1","props":{"value":"姓名","bold":"true"}},
  {"command":"set","path":"/Sheet1/B1","props":{"value":"分数","bold":"true"}}
]' | officecli batch data.xlsx --json

officecli batch data.xlsx --commands '[{"op":"set","path":"/Sheet1/A1","props":{"value":"完成"}}]' --json
officecli batch data.xlsx --input updates.json --best-effort --json   # 保留成功项，失败不回滚
```

支持指令：`add`、`set`、`get`、`query`、`remove`、`move`、`swap`、`view`、`raw`、`raw-set`、`validate`。
字段：`command`（别名op）、`path`、`parent`、`type`、`from`、`to`、`index`、`after`、`before`、`props`、`selector`、`mode`、`depth`、`part`、`xpath`、`action`、`xml`。

---

## L3层级：原始XML操作

L2接口无法满足需求时使用。无需手动声明命名空间前缀，程序自动注册。

```
officecli raw <文件> <部件名称>                          # 查看原始XML
officecli raw-set <文件> <部件> --xpath "..." --action replace --xml '<w:p>...</w:p>'
officecli add-part <文件> <父容器>                   # 创建新文档资源部件，返回资源ID(rId)
```

raw-set支持动作：`append`追加、`prepend`前置、`insertbefore`前方插入、`insertafter`后方插入、`replace`替换、`remove`删除、`setattr`修改属性。
运行 `officecli help <格式> raw` 查看可用文档部件列表。

---

## 常见踩坑清单

| 错误写法 | 正确方案 |
| --- | --- |
| `--name "foo"` | 使用 `--prop name="foo"`；所有属性统一通过 `--prop` 传入 |
| zsh/bash 路径 `[N]` 不加引号 | 始终引号包裹：`'/slide[1]'`，防止shell把\[\]当成通配符解析 |
| PPT直接用 `shape[1]` 查找正文 | shape\[1\]通常是标题占位框；正文一般从shape\[2\]开始 |
| `/shape[myname]` | 不支持名称直接索引；PPT可用数字索引或 `@name=` |
| 凭猜测写属性名 | 执行 `officecli help <格式> <元素>` 查询准确参数名 |
| 修改正在Office/WPS打开的文件 | 先在软件内关闭文档 |
| shell字符串 `\n` 换行 | 参数内换行写成 `\\n`：`--prop text="line1\\nline2"` |
| shell文本内含 `$` | `--prop text="$15M"` 会丢失内容，改用单引号 `--prop text='$15M'` 或批量脚本 |

---

## 专用技能模块

`officecli load_skill <技能名>`，执行后输出SKILL.md规范文档，请遵循规则操作。

### 加载规则

1. 优先匹配场景；无匹配场景则加载对应文档默认技能（word/pptx/excel）
2. 场景内置基础格式规则；**一份文档只加载一项技能，不可叠加**
3. 加载规则会话持续生效，无需每条指令重复加载
4. 处理多个独立文档，需要分别加载对应技能

### Word (.docx)

| 技能名称 | 使用场景 |
| --- | --- |
| `word` | 报告、信函、备忘录、方案、通用文档 |
| `academic-paper` | 期刊/会议论文、学位论文：APA/芝加哥/IEEE/MLA引用、公式、交叉引用、多栏排版、参考文献。**业务报告、信函不要使用此技能** |

### PowerPoint (.pptx)

| 技能名称 | 使用场景 |
| --- | --- |
| `pptx` | 通用演示：董事会汇报、销售PPT、全员大会、产品发布会 |
| `pitch-deck` | **仅限融资路演PPT**：种子轮/A/B/C轮、SAFE协议、可转债融资。销售/产品/董事会PPT使用普通pptx技能 |
| `morph-ppt` | 使用平滑Morph切换动画的演示文稿；静态PPT选用普通pptx |
| `morph-ppt-3d` | 3D Morph动画：GLB模型、镜头移动、景深；仅2D平滑动画使用morph-ppt |

### Excel (.xlsx)

| 技能名称 | 使用场景 |
| --- | --- |
| `excel` | 通用工作簿、公式、数据透视表、台账 |
| `financial-model` | 财务模型、情景测算、预测报表；普通数据分析使用excel技能 |
| `data-dashboard` | 表格数据生成KPI/分析看板，包含图表、迷你图；原始数据台账使用excel技能 |

示例：制作融资路演PPT → `officecli load_skill pitch-deck` → 按照输出规范操作。

---

## 重要备注

- **路径使用1起始编号（XPath规范）**：`'/body/p[3]'` = 第3个段落
- **`--index` 参数为0起始数组编号**：`--index 0` = 第一个位置
- **Excel特例**：`add --type row` / `add --type col` 的 `--index N` 使用**1起始编号**，匹配OOXML行号/列号规则。`--index 5` 插入至第5行/第5列。
- 修改完成后，建议使用 `validate` 校验文档或执行 `view issues` 检查异常
- **参数不确定时，优先执行 `officecli help <格式> <元素名>` 查询，不要猜测**

如果你需要，我可以把这份译文整理成**纯简体中文无英文对照版本**，方便直接保存为文档使用。