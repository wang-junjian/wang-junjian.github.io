#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""校验 posts-html/ 下所有 HTML 文档是否满足元数据与命名规范。

用法：
  python3 verify.py [--dir posts-html] [--max-width 250] \
      [--min-chars 100] [--max-chars 130] [--no-len-check]

检查项：
  1. 四项 meta 齐全：description / keywords / author / date
  2. description：纯文本（无换行、无 <、无英文双引号）
     显示宽度 ≤ max-width（中文/全角=2、半角=1）
     总字符数 ∈ [min-chars, max-chars]（--no-len-check 可关）
  3. author 统一「军舰」（不一致仅告警）
  4. date 为 YYYY-MM-DD
  5. 文件名符合 <yyyy-mm-dd>-<slug>.html，且日期前缀 == meta date
  6. basename 全库唯一（站点 assertUniqueBasenames 的硬约束）

退出码：0 全部通过；1 存在错误。
"""

import argparse
import os
import re
import sys
import unicodedata

FIELDS = ["description", "keywords", "author", "date"]
CONFORM_RE = re.compile(r"^(\d{4}-\d{2}-\d{2})-([a-z0-9]+(?:-[a-z0-9]+)*)$")
DATE_RE = re.compile(r"^\d{4}-\d{2}-\d{2}$")


def meta_content(raw, name):
    pats = [
        r'<meta[^>]+name=["\']%s["\'][^>]+content=["\']([^"\']+)["\'][^>]*>' % name,
        r'<meta[^>]+content=["\']([^"\']+)["\'][^>]+name=["\']%s["\'][^>]*>' % name,
    ]
    for p in pats:
        m = re.search(p, raw, re.I)
        if m:
            return m.group(1).strip()
    return None


def disp_width(s):
    return sum(2 if unicodedata.east_asian_width(c) in ("W", "F") else 1 for c in s)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--dir", default="posts-html")
    ap.add_argument("--max-width", type=int, default=250)
    ap.add_argument("--min-chars", type=int, default=100)
    ap.add_argument("--max-chars", type=int, default=130)
    ap.add_argument("--no-len-check", action="store_true")
    ap.add_argument("--author", default="军舰")
    args = ap.parse_args()

    if not os.path.isdir(args.dir):
        print("目录不存在：%s" % args.dir, file=sys.stderr)
        sys.exit(2)

    errors = []
    warns = []
    basenames = {}
    files = []
    for dirpath, dirnames, filenames in os.walk(args.dir):
        dirnames[:] = [d for d in dirnames if not d.startswith(".")]
        for fn in sorted(filenames):
            if fn.endswith(".html") and not fn.startswith("_"):
                files.append(os.path.join(dirpath, fn))

    for full in sorted(files):
        rel = os.path.relpath(full)
        base = os.path.basename(full)[:-5]
        raw = open(full, encoding="utf-8", errors="replace").read()

        def err(msg):
            errors.append("%s: %s" % (rel, msg))

        # 1. 齐全性
        vals = {k: meta_content(raw, k) for k in FIELDS}
        for k in FIELDS:
            if vals[k] is None:
                err("缺少 meta %s" % k)

        d = vals.get("description")
        if d is not None:
            if any(c in d for c in ("\n", "\r", "<", ">")):
                err("description 含换行或标签")
            if '"' in d:
                err("description 含英文双引号")
            width = disp_width(d)
            if width > args.max_width:
                err("description 宽度 %d > %d" % (width, args.max_width))
            if not args.no_len_check and not (args.min_chars <= len(d) <= args.max_chars):
                err("description 字数 %d 不在 [%d,%d]" % (len(d), args.min_chars, args.max_chars))

        a = vals.get("author")
        if a is not None and a != args.author:
            warns.append("%s: author=%r（约定 %r）" % (rel, a, args.author))

        dt = vals.get("date")
        if dt is not None and not DATE_RE.match(dt):
            err("date 格式非法：%r" % dt)

        # 2. 命名
        m = CONFORM_RE.match(base)
        if not m:
            err("文件名不合规范（应为 <yyyy-mm-dd>-<slug>.html）")
        else:
            prefix = m.group(1)
            if dt and prefix != dt:
                err("文件名日期 %s != meta date %s" % (prefix, dt))

        # 3. basename 唯一
        if base in basenames:
            err("basename 冲突，与 %s 重复" % os.path.relpath(basenames[base]))
        else:
            basenames[base] = full

    print("=== posts-html 校验 ===")
    print("文件数：%d" % len(files))
    if warns:
        print("\n-- 告警 --")
        for w in warns:
            print("  ! " + w)
    if errors:
        print("\n-- 错误（%d）--" % len(errors))
        for e in errors:
            print("  x " + e)
        print("\n结果：未通过")
        sys.exit(1)
    print("\n结果：全部通过 ✓")
    sys.exit(0)


if __name__ == "__main__":
    main()
