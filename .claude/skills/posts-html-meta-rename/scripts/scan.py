#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""扫描 posts-html/ 下的 HTML 文档，产出标准化「工作清单」(JSON)。

只读，不修改任何文件。用于让主智能体在派生「一文档一子智能体」之前，
先拿到每份文档的确定性事实：缺哪些 meta、采用哪个日期、是否 HTML 片段、
文件名是否规范、是否需要处理。

用法：
  python3 scan.py                     # 默认只扫 ./posts-html 下 git 未追踪的新文件
  python3 scan.py --scope all         # 全库扫描（含已追踪的旧文档）
  python3 scan.py --all               # 等价于 --scope all
  python3 scan.py --files a.html b.html   # 显式点名要处理的文件（忽略 --scope）
  python3 scan.py --dir posts-html    # 指定根目录
  python3 scan.py --out /tmp/scan.json
  python3 scan.py --only-work         # 只输出 needs_work=True 的条目

范围（--scope / --files）：
  untracked  仅 `git ls-files --others --exclude-standard` 列出的新文件（默认）。
             非 git 仓库 / 无 git 时自动回退为 all 并在 stderr 告警。
  all        全库所有 HTML（历史体检用，会一并列出已追踪文档的遗留问题）。
  files      由 --files 显式指定的文件集合，用于「用户点名处理某几份」。

条目字段：
  index               序号
  path                文件相对路径
  tracked             是否已被 git 追踪（all / files 模式下为 null）
  dir                 所在目录
  basename            当前 basename（不含 .html）
  is_fragment         True = 无 <head> 的 HTML 片段（直接以 <title> 开头）
  has_viewport        是否含 <meta name="viewport">
  has_title           是否含 <title>
  meta                {description,keywords,author,date} 当前值（缺失为 null）
  missing             [需要补的字段]，顺序 description,keywords,author,date
  mtime               YYYY-MM-DD 文件修改日期
  date_value          该文档最终采用的日期 D
  date_source         'meta' | 'mtime'
  conform_name        文件名是否符合 <yyyy-mm-dd>-<slug>.html
  name_date_prefix    文件名日期前缀（不合规则为 null）
  name_date_mismatch  文件名日期前缀与 D 不一致
  needs_work          是否需要处理
  warnings            可疑项说明
"""

import argparse
import datetime
import json
import os
import re
import subprocess
import sys

# 注意：必须用 <head(?=[\s>])...>，`<head[^>]*>` 会误匹配 `<header ...>`
HEAD_RE = re.compile(r"<head(?=[\s>])[^>]*>", re.I)
TITLE_RE = re.compile(r"<title[^>]*>", re.I)
CONFORM_RE = re.compile(r"^(\d{4}-\d{2}-\d{2})-([a-z0-9]+(?:-[a-z0-9]+)*)$")
DATE_RE = re.compile(r"^\d{4}-\d{2}-\d{2}$")
FIELDS = ["description", "keywords", "author", "date"]


def meta_content(raw, name):
    """复刻 src/utils/htmlMeta.ts：两种属性顺序均支持。"""
    pats = [
        r'<meta[^>]+name=["\']%s["\'][^>]+content=["\']([^"\']+)["\'][^>]*>' % name,
        r'<meta[^>]+content=["\']([^"\']+)["\'][^>]+name=["\']%s["\'][^>]*>' % name,
    ]
    for p in pats:
        m = re.search(p, raw, re.I)
        if m:
            return m.group(1).strip()
    return None


def has_meta(raw, name):
    return meta_content(raw, name) is not None


def git_untracked(root):
    """返回 root 下 git 未追踪文件的绝对路径集合。

    用 `git ls-files --others --exclude-standard --full-name`（尊重 .gitignore，
    staged/已提交文件不算）。非 git 仓库、无 git 命令或调用失败时返回 None，
    由调用方决定回退策略。

    路径一律经 os.path.realpath 归一：macOS 上 /tmp 是 /private/tmp 的软链，
    git 回报仓库根为 /private/tmp/...，与 /tmp/... 直接比较会全部失配。
    """
    root_abs = os.path.realpath(root)
    try:
        top = subprocess.run(
            ["git", "-C", root_abs, "rev-parse", "--show-toplevel"],
            capture_output=True, text=True, timeout=15,
        )
        if top.returncode != 0:
            return None
        repo = os.path.realpath(top.stdout.strip())
        out = subprocess.run(
            ["git", "-C", root_abs, "-c", "core.quotePath=false",
             "ls-files", "--others", "--exclude-standard", "--full-name"],
            capture_output=True, text=True, timeout=60,
        )
        if out.returncode != 0:
            return None
    except (OSError, subprocess.SubprocessError):
        return None

    res = set()
    for line in out.stdout.splitlines():
        line = line.strip()
        if not line:
            continue
        full = os.path.realpath(os.path.join(repo, line))
        try:
            if os.path.commonpath([full, root_abs]) == root_abs:
                res.add(full)
        except ValueError:  # 跨盘符等异常，忽略
            continue
    return res


def collect(root, untracked=None):
    entries = []
    idx = 0
    for dirpath, dirnames, filenames in os.walk(root):
        dirnames[:] = [d for d in dirnames if not d.startswith(".")]
        for fn in sorted(filenames):
            if not fn.endswith(".html") or fn.startswith("_"):
                continue
            full = os.path.join(dirpath, fn)
            try:
                raw = open(full, encoding="utf-8", errors="replace").read()
            except OSError as e:
                print("[scan] 无法读取 %s: %s" % (full, e), file=sys.stderr)
                continue

            idx += 1
            base = fn[:-5]
            mtime = datetime.datetime.fromtimestamp(os.path.getmtime(full)).strftime("%Y-%m-%d")
            meta = {k: meta_content(raw, k) for k in FIELDS}
            missing = [k for k in FIELDS if meta[k] is None]

            warnings = []
            d_meta = meta.get("date")
            if d_meta and DATE_RE.match(d_meta):
                date_value, date_source = d_meta, "meta"
            else:
                if d_meta:
                    warnings.append("date meta 格式非法(%r)，改回 mtime" % d_meta)
                date_value, date_source = mtime, "mtime"

            m = CONFORM_RE.match(base)
            conform = bool(m)
            prefix = m.group(1) if m else None
            mismatch = bool(conform and prefix != date_value)

            needs_work = bool(missing) or (not conform) or mismatch

            frag = not HEAD_RE.search(raw)
            tracked = None if untracked is None else (os.path.realpath(full) not in untracked)
            entries.append({
                "index": idx,
                "path": os.path.relpath(full),
                "tracked": tracked,
                "dir": os.path.relpath(dirpath),
                "basename": base,
                "is_fragment": frag,
                "has_viewport": has_meta(raw, "viewport"),
                "has_title": bool(TITLE_RE.search(raw)),
                "meta": meta,
                "missing": missing,
                "mtime": mtime,
                "date_value": date_value,
                "date_source": date_source,
                "conform_name": conform,
                "name_date_prefix": prefix,
                "name_date_mismatch": mismatch,
                "needs_work": needs_work,
                "warnings": warnings,
            })
    return entries


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--dir", default="posts-html")
    ap.add_argument("--out", default=None)
    ap.add_argument("--only-work", action="store_true")
    ap.add_argument("--scope", choices=["untracked", "all"], default="untracked",
                    help="untracked=仅 git 未追踪的新文件（默认）；all=全库")
    ap.add_argument("--all", action="store_true",
                    help="等价于 --scope all（含已追踪的旧文档）")
    ap.add_argument("--files", nargs="*", default=None,
                    help="显式指定要处理的 HTML 文件路径（相对或绝对）；给出时忽略 --scope")
    args = ap.parse_args()

    if not os.path.isdir(args.dir):
        print("[scan] 目录不存在：%s" % args.dir, file=sys.stderr)
        sys.exit(2)

    scope = "all" if args.all else args.scope
    explicit = None
    if args.files:
        explicit = {os.path.realpath(f) for f in args.files}
        scope = "files"
    untracked = git_untracked(args.dir)
    if scope == "untracked" and untracked is None:
        print("[scan] ⚠ 非 git 仓库或 git 不可用，--scope untracked 自动回退为全库扫描",
              file=sys.stderr)
        scope = "all"
    if scope == "all":
        untracked = None  # 不做范围过滤，tracked 字段亦置空

    all_entries = collect(args.dir, untracked)
    entries = all_entries
    if scope == "untracked":
        entries = [e for e in entries if e["tracked"] is False]
        out_of_scope = [e for e in all_entries if e["tracked"] is True and e["needs_work"]]
    elif scope == "files":
        entries = [e for e in entries if os.path.realpath(e["path"]) in explicit]
        found = {os.path.realpath(e["path"]) for e in entries}
        for miss in sorted(explicit - found):
            print("[scan] ⚠ 指定的文件不在此目录下或不存在，已忽略：%s" % miss, file=sys.stderr)
        out_of_scope = []
    else:
        out_of_scope = []
    work = [e for e in entries if e["needs_work"]]

    print("=== posts-html 扫描 ===", file=sys.stderr)
    print("范围: %s | 文件数: %d | 待处理: %d"
          % (scope, len(entries), len(work)), file=sys.stderr)
    for e in work:
        bits = []
        if e["missing"]:
            bits.append("缺 " + ",".join(e["missing"]))
        if not e["conform_name"]:
            bits.append("命名不规范")
        if e["name_date_mismatch"]:
            bits.append("文件名日期!=%s" % e["date_value"])
        flag = " [片段]" if e["is_fragment"] else ""
        print("  - %s%s  日期=%s(%s)  %s"
              % (e["basename"], flag, e["date_value"], e["date_source"], "; ".join(bits)),
              file=sys.stderr)
    if scope == "untracked" and out_of_scope:
        print("--- 范围外（已追踪，本次不处理，如需一并处理请显式 --scope all）---",
              file=sys.stderr)
        for e in out_of_scope:
            bits = []
            if e["missing"]:
                bits.append("缺 " + ",".join(e["missing"]))
            if not e["conform_name"]:
                bits.append("命名不规范")
            if e["name_date_mismatch"]:
                bits.append("文件名日期!=%s" % e["date_value"])
            print("  · %s  %s" % (e["basename"], "; ".join(bits) or "见 verify"),
                  file=sys.stderr)
    print("=== 全文模式：每份文档由一个独立子智能体处理 ===", file=sys.stderr)

    out = {
        "root": args.dir,
        "scope": scope,
        "total": len(entries),
        "work_count": len(work),
        "out_of_scope_work_count": len(out_of_scope),
        "entries": work if args.only_work else entries,
    }
    text = json.dumps(out, ensure_ascii=False, indent=2)
    if args.out:
        open(args.out, "w", encoding="utf-8").write(text)
        print("[scan] 已写入 %s" % args.out, file=sys.stderr)
    print(text)


if __name__ == "__main__":
    main()
