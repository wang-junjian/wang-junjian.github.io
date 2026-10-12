# posts-html meta & 命名 踩坑记录

本文件是本技能在实践中沉淀的细节坑，供排查问题时查阅。SKILL.md 已覆盖主流程。

## 1. 锚点：`<head[^>]*>` 会误匹配 `<header ...>`

正则会从 `<head` 开始匹配，`<header class="...">` 同样以 `head` 开头，于是被当成 `<head>` 的锚点，meta 被插进了正文（`<body>` 里），而页面**不会报错**，只在渲染/结构上错位。

正解（脚本内置）：`<head(?=[\s>])[^>]*>`——要求 `head` 之后紧跟空白或 `>`。

插入锚点优先级（脚本 `insert_block`）：

1. 有 `<meta name="viewport">` → 紧随其后；
2. 否则有 `<title>` → 插在它之前；
3. 否则有 `<head ...>` → 紧随其后；
4. 都没有 → 报错。

第 2 步天然覆盖了「片段文件」（无 head、直接以 `<title>` 开头）。

## 2. 注释/脚本里的假 meta

`metaContent` 用正则在整个文件里找 meta，**不区分是否在注释里**。若文档在 `<!-- -->` 里留有示例 `<meta name="description">`，会被误判为「已存在」。

处理：靠人工/子智能体通读确认；必要时先清理注释中的示例 meta。`--force` 会覆盖首个匹配项，但无法区分注释与真身，慎用。

## 3. 日期来源与漂移

- 落盘写 meta **会更新 mtime**。因此 D 必须在改动前确定。
- 本技能口径：**已有 date meta 用它；否则用 mtime**。这让「无元数据的新文档」拿到修改日期，又让「已有日期」的文档重跑稳定。
- 若某文档的 mtime 被工具/同步软件改动过，其 D 会随之变化——如需固定，请先手工补 `<meta name="date">`，再运行本技能。
- 站点解析顺序（`htmlPosts.ts`）：meta date → 文件名日期前缀 → mtime；缺日期会 `console.warn`。

## 4. basename 唯一性（硬约束）

`assertUniqueBasenames` 在构建时对全库 basename 去重，**冲突直接抛错**，不是警告。典型来源：

- 同名 slug 的两个文档；
- 只改了日期前缀、slug 未变的重复文件。

`inject_meta.py --rename` 会在重命名前做一次**全库 basename 扫描**（排除自身）并拦截冲突。并行派发时，主智能体应给子智能体分配互斥 slug。

## 5. description 宽度 vs 字数的取舍

- 宽度口径：中日韩全角字符按 2、其余按 1，上限 250。
- 字数口径：总字符数 100–130（含英文术语、数字、标点）。
- **英文术语密集**的文档（OpenSpec / Spec Kit / API 名较多）会出现「总字符到 130 但中文字数不足 100」——这是宽度约束下的必然结果。若强行让纯中文字数 ≥100，宽度会突破 250。
- 判定脚本：`verify.py` 同时检查宽度与字数，任一越界即报错。

## 6. 片段文件清单（历史）

早期目录里出现过 6 个片段文件（无 doctype/html/head，直接 `<title>` 开头）：`ai-native-design-pipeline`、`ai-native-sdlc-playbook-deep-dive`、`mattpocock-skills-workflow`、`openspec-workflow`、`sdd-tools-vs-ai-native-sdlc-stages`、`spec-kit-workflow`。`scan.py` 的 `is_fragment` 会自动识别，无需硬编码。

## 7. 未被 git 跟踪的文件

`posts-html/` 下新放入的 HTML 通常**不在 git 索引里**。因此：

- 重命名用普通 `mv`（脚本 `os.rename`）即可，不要用 `git mv`；
- 回滚靠 `/tmp` 备份，而非 `git checkout`；
- 若要纳入版本管理，需主智能体另行 `git add`（本技能不代做提交）。

## 8. 幂等性验证方法

```bash
# 处理一遍后再跑一次，应零改动
python3 scripts/scan.py --only-work     # 期望 work_count = 0
python3 scripts/verify.py               # 期望「全部通过」
python3 scripts/inject_meta.py --file <已处理文件> --json <同名 json> --rename
# 期望：{"inserted": [], "content_changed": false, "renamed": null}
```
