---
name: posts-html-meta-rename
description: |
  为站点 posts-html/ 目录下的 HTML 文档统一补全/校正四项 <meta>（description、keywords、author、date），并按 <yyyy-mm-dd>-<小写英文 slug>.html 规范重命名。
  **默认只处理「新放入、尚未被 git 追踪」的 HTML**；只有用户显式指定（点名文件或要求全库）时才扩大到其他文档。
  当用户说“新文档补元数据”“补 meta”“加 description/keywords”“规范 posts-html 文件名”“重命名 HTML 文档”“把新放进来的 HTML 处理一下”“posts-html 目录整理”或往 posts-html/ 里放了新 HTML 需要入库时，使用此技能。
  强制要求：每一份文档都由一个独立子智能体完成（读全文→写 description/keywords→落盘→重命名），主智能体只做扫描、派发与终检。
---

# posts-html-meta-rename

把 `posts-html/` 下的 HTML 文档标准化：**补全四项 meta** + **规范重命名**。

站点构建时，`src/utils/htmlPosts.ts` 会把**文件名 basename 当作文章 id / URL slug**，把 `<meta>` 映射为列表页字段：

| meta | 用途 |
| --- | --- |
| `description` | 列表页 excerpt / og / RSS 描述 |
| `keywords` | 标签 tags（按 `,` 或 `，` 拆分） |
| `author` | 作者 |
| `date` | 文章日期（再回退文件名日期前缀，最后回退 mtime） |

因此这两件事必须同时做对，否则列表页与 URL 都会出问题。

## 处理范围（默认：只做新放入的未追踪文件）

**默认范围 = `posts-html/` 下「git 未追踪」(`git ls-files --others --exclude-standard`) 的 HTML 文件**，也就是用户新放进来、还没入库的那些。已追踪的历史文档**一律不碰**——它们可能带着遗留问题（description 偏短、文件名日期与 meta date 不一致等），但顺手改动有副作用（见「边界与常见坑」）。

扩大范围只有两种正当途径，且**必须由用户明确要求**：

| 途径 | 命令 | 场景 |
| --- | --- | --- |
| 点名文件 | `--files a.html b.html` | 「把 X 和 Y 处理一下」 |
| 全库 | `--scope all` | 「全部重跑一遍 / 做一次全库体检」 |

扫描与终检共用同一套范围语义：**范围外的问题只报告、不计入结果、不修改**。

## 核心约束（务必遵守）

### 1. 四项 meta

- 必含：`description`、`keywords`、`author`、`date`。
- **插入顺序固定**：`description → keywords → author → date`。
- **位置**：`<meta name="viewport">` 之后、`<title>` 之前；无 `<head>` 的「片段文件」插在 `<title>` 之前（浏览器会归入隐式 head）。**由脚本负责，不要手写 Edit。**
- `author` 统一为 `军舰`。
- `keywords`：5–6 个，逗号分隔，英文一律小写、多词用连字符（如 `ai-native-sdlc`）。
- `description`：**纯文本**（不得含英文双引号 `"`、换行、任何 HTML 标签），用中文标点与「」。
  - **显示宽度 ≤ 250 半角单位**（中日韩全角字符按 2、其余按 1 计）。
  - **总字符数 100–130**（含英文术语与数字）。
  - 要求：概括**全文**（覆盖各主要部分）＋有吸引力，点出独特价值、核心结论或亮眼数字。

### 2. 日期 D 的确定（按优先级）

1. 文档已有合法 `<meta name="date">`（`YYYY-MM-DD`）→ **D = 该值**；重命名用 D，**不改写** date meta。
2. 否则 → **D = 文件修改日期（mtime，本地时区，`YYYY-MM-DD`）**，并把 `<meta name="date">` 写成 D。

> 这覆盖两种真实场景：**新放入、无元数据**的文档取「修改日期」；**已有日期**的文档按 meta date 重命名，不会被 mtime 反复漂移。因为落盘会更新 mtime，D 必须在改动前一次性确定并显式传给子智能体。

### 3. 命名规范

- 文件名：`<yyyy-mm-dd>-<小写英文 slug>.html`。
- **日期前缀必须等于 meta `date`（即 D）**。
- slug 仅用小写字母、数字、连字符；精简、概括主题。
- **basename 全库唯一**（`assertUniqueBasenames` 会因冲突直接让构建报错）。

## 执行流程

### 第 0 步：扫描（主智能体）

```bash
# 默认：只扫 git 未追踪的新文件（绝大多数情况用这一条）
python3 .claude/skills/posts-html-meta-rename/scripts/scan.py --only-work --out /tmp/posts-html-scan.json

# 仅在用户明确指定时使用：
#   点名文件  python3 .../scan.py --files posts-html/2026/a.html posts-html/2026/b.html --only-work
#   全库体检  python3 .../scan.py --scope all --only-work
```

只读。产出每份待处理文档的：缺哪些 meta、`is_fragment`、`date_value`（即 D）、`date_source`、`conform_name`、`name_date_mismatch`。**待处理 = 缺字段 ∪ 命名不规范 ∪ 文件名日期 ≠ D。**

stderr 摘要会分两段打印：**本次范围内待处理** 与 **范围外（已追踪）遗留项**。后者只作为信息呈现给用户，**不要动手改**；若用户表示要一并处理，再用 `--scope all` 或 `--files` 重跑扫描。

JSON 里的 `scope` / `work_count` / `out_of_scope_work_count` 可直接判断本次要派几份。若 `work_count = 0` 而用户坚持说「有新文件」，先看「边界与常见坑」里的**自动提交**一条。

### 第 1 步：备份（主智能体）

```bash
cp -r posts-html /tmp/posts-html-backup-$(date +%Y%m%d-%H%M%S)
```

**注意**：`posts-html/` 下的新文档通常**未被 git 跟踪**，重命名请直接用 `mv`/脚本，不要依赖 `git mv`。

（全目录备份最省心；若目录已很大，也可只备份本次要动的文件。）

### 第 2 步：一份文档一个子智能体（强制）

对待处理清单里的**每一份**文档，派生一个 `general-purpose` 子智能体；**一份文档一个子智能体，不要合并**。建议每批 8–16 个并行（既控速又避免上下文混淆）。

主智能体在派发前，应为每份文档确定并写入 prompt：

- 目标文件**绝对路径**；
- **D**（来自 scan 的 `date_value`）与 `date_source`；
- 需要写入的字段（通常四项；若只缺部分则只写缺失项）；
- `is_fragment`（用于提醒锚点）；
- 本批已分配的 slug 集合（降低并行撞名概率）。

**子智能体 prompt 模板**（填空后用）：

```
你是中文内容编辑。请为一份 HTML 文档补全 meta 并规范重命名。

目标文件：<ABSOLUTE_PATH>
日期 D：<YYYY-MM-DD>（来源：<meta|mtime>）
需写入字段：description, keywords, author, date
片段文件(is_fragment)：<true|false>
本批已用 slug（不得重复）：<slug1, slug2, ...>

步骤：
1. 通读全文（务必覆盖整篇，不要只看开头）：
   python3 - <<'PY'
   import re,html
   p="<ABSOLUTE_PATH>"
   s=open(p,encoding='utf-8',errors='ignore').read()
   s=re.sub(r'<(script|style|svg|noscript)\b[^>]*>.*?</\1>',' ',s,flags=re.S|re.I)
   s=re.sub(r'<[^>]+>',' ',s); s=html.unescape(s); s=re.sub(r'\s+',' ',s)
   print(len(s)); print(s[:7000]); print('...TAIL...'); print(s[-4000:])
   PY
   若不足把握全文，再分段读取中段与末段，并抓取所有 h1/h2/h3 标题。
2. 撰写：
   - description：概括全文 + 有吸引力，纯文本，不含英文双引号/换行/标签；
     总字符数 100–130，显示宽度 ≤250 半角单位（中文/全角≈2，其余≈1），中文标点用「」。
   - keywords：5–6 个，逗号分隔，英文小写、多词用连字符。
   - author：军舰；date：<YYYY-MM-DD>；slug：<你拟定的小写英文 slug，只含 a-z0-9 与 ->。
3. 用 Write 工具写一个 JSON 到 /tmp/posts-html-meta/<basename>.json：
   {"description":"...","keywords":"a, b, c","author":"军舰","date":"<D>","slug":"<slug>"}
4. 调用脚本落盘（不要用 Edit 手改 HTML）：
   python3 .claude/skills/posts-html-meta-rename/scripts/inject_meta.py \
     --file "<ABSOLUTE_PATH>" --json /tmp/posts-html-meta/<basename>.json --rename
5. 仅回复一行：
   DONE <旧文件名> -> <新文件名> | <description 全文>

边界：只处理这一个文件；只新增 meta 与重命名；不改正文、不删标签、不新建 HTML。
```

脚本已内置保护：非法 description（含 `"`/换行/`<>`）、非法 slug、目标 basename 冲突都会**报错退出**——按提示修正后重试即可。

### 第 3 步：终检（主智能体）

```bash
# 默认：只把「本次范围（git 未追踪文件）」的问题计入结果
python3 .claude/skills/posts-html-meta-rename/scripts/verify.py

# 与第 0 步范围保持一致：用户点名过就加同样的 --files；用户要全库就加 --scope all
```

校验：四项齐全 / description 宽度与字数 / 无换行与标签 / author 约定 / date 格式 / 命名规范且日期前缀 == meta date / **basename 全库唯一**（此项始终全库建索引，与范围无关）。

输出分两区：

- **范围内错误** → 决定退出码（1），必须回到第 2 步定向修复，直至「全部通过」；
- **范围外提示**（已追踪文档的遗留问题）→ 只打印、不影响退出码，原样报给用户，等其决定是否另行处理。

> basename 唯一性检查**不受范围限制**，因此「范围内新文件与范围外旧文件撞名」也能被捕获。

### 第 4 步：记录

在 `.workbuddy/memory/YYYY-MM-DD.md` 追加一条简短记录（处理了哪些文档、日期来源、遗留项）。若发现新的约定或坑，同步更新 `MEMORY.md`。

## 脚本

| 脚本 | 作用 | 关键参数 |
| --- | --- | --- |
| `scripts/scan.py` | 只读扫描，产出工作清单 JSON；默认只扫未追踪新文件 | `--scope untracked\|all`（默认 untracked）`--all` `--files` `--dir` `--out` `--only-work` |
| `scripts/inject_meta.py` | 锚点安全注入四项 meta，可选重命名 | `--file` `--json` `--rename` `--slug` `--force` `--dry-run` |
| `scripts/verify.py` | 终检；默认只校验未追踪新文件，范围外问题仅提示 | `--scope untracked\|all`（默认 untracked）`--all` `--files` `--dir` `--max-width` `--min-chars` `--max-chars` `--no-len-check` |

三个脚本均**幂等**：字段齐全 + 名称规范时重复运行零改动。
`inject_meta.py` 不涉及范围选择（永远只作用在 `--file` 指定的那一份）。

## 边界与常见坑

- **`<head[^>]*>` 会误匹配 `<header ...>`**：脚本统一用 `<head(?=[\s>])[^>]*>`，别在手写正则时踩坑。
- **片段文件**（无 `<!DOCTYPE>`/`<html>`/`<head>`，直接以 `<title>` 开头）：meta 插在 `<title>` 之前。
- **两次运行的日期漂移**：D 在扫描时确定并显式传递；已有 date meta 的文档不再按 mtime 覆盖，故重跑稳定。
- **中文文件名**：需要子智能体把中文/中文短语转成小写英文 slug（如「内部信息化系统…调研」→ `enterprise-agentic-coding-survey`）。
- **只补缺失项**：默认不覆盖已存在的 meta；确需刷新某字段用 `--force`（谨慎）。
- **并行撞名**：子智能体各自拟 slug；主智能体派发时给出已用 slug 集合，终检仍会兜底查 basename 唯一性。
- **自动提交会让「未追踪」窗口提前关闭**：本仓库环境存在**逐文件自动提交**（提交信息形如 `Create <文件名>.html`），新放进来几分钟后就变成「已追踪」，此后 `--scope untracked` 扫不到它。表现为「用户说有新增，但 `work_count = 0`」。处理办法：`git log --diff-filter=A --name-only -5 -- posts-html` 找出最近新增的文件，用 `--files` 点名处理。
- **范围外的遗留项不要顺手改**：改文件名日期前缀会**改变文章 URL**（basename 即 slug），可能打断已有外链/分享。范围外问题一律先报告、由用户决定。
- 仅新增 meta 与重命名，**不改正文、不 `git add`、不提交**；重命名用 `mv`/脚本 `os.rename`，**绝不用 `git mv`**（目标文件通常不在索引里）。

更细的踩坑记录见 `references/pitfalls.md`。
