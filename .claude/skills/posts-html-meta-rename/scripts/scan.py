#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""扫描 posts-html/ 下的 HTML 文档，产出标准化「工作清单」(JSON)。

只读，不修改任何文件。用于让主智能体在派生「一文档一子智能体」之前，
先拿到每份文档的确定性事实：缺哪些 meta、采用哪个日期、是否 HTML 片段、
文件名是否规范、是否需要处理。

用法：
  python3 scan.py                     # 扫描 ./posts-html，JSON 打到 stdout
  python3 scan.py --dir posts-html    # 指定根目录
  python3 scan.py --out /tmp/scan.json
  python3 scan.py --only-work         # 只输出 needs_work=True 的条目

条目字段：
  index               序号
  path                文件相对路径
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


def collect(root):
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
            entries.append({
                "index": idx,
                "path": os.path.relpath(full),
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
    args = ap.parse_args()

    if not os.path.isdir(args.dir):
        print("[scan] 目录不存在：%s" % args.dir, file=sys.stderr)
        sys.exit(2)

    entries = collect(args.dir)
    work = [e for e in entries if e["needs_work"]]

    print("=== posts-html 扫描 ===", file=sys.stderr)
    print("文件总数: %d | 待处理: %d" % (len(entries), len(work)), file=sys.stderr)
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
    print("=== 全文模式：每份文档由一个独立子智能体处理 ===", file=sys.stderr)

    out = {
        "root": args.dir,
        "total": len(entries),
        "work_count": len(work),
        "entries": work if args.only_work else entries,
    }
    text = json.dumps(out, ensure_ascii=False, indent=2)
    if args.out:
        open(args.out, "w", encoding="utf-8").write(text)
        print("[scan] 已写入 %s" % args.out, file=sys.stderr)
    print(text)


if __name__ == "__main__":
    main()
