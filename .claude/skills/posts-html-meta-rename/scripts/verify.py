#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""校验 posts-html/ 下 HTML 文档是否满足元数据与命名规范。

用法：
  python3 verify.py                    # 默认只校验 git 未追踪的新文件
  python3 verify.py --scope all        # 全库校验（含已追踪的旧文档）
  python3 verify.py --all              # 等价于 --scope all
  python3 verify.py --dir posts-html [--max-width 250] \
      [--min-chars 100] [--max-chars 130] [--no-len-check]

范围（--scope）：
  untracked  只把「git 未追踪的新文件」的问题计入结果（默认）。
             范围外（已追踪）的遗留问题仅以「范围外提示」列出，不影响退出码。
  all        全库所有问题均计入结果。

检查项：
  1. 四项 meta 齐全：description / keywords / author / date
  2. description：纯文本（无换行、无 <、无英文双引号）
     显示宽度 ≤ max-width（中文/全角=2、半角=1）
     总字符数 ∈ [min-chars, max-chars]（--no-len-check 可关）
  3. author 统一「军舰」（不一致仅告警）
  4. date 为 YYYY-MM-DD
  5. 文件名符合 <yyyy-mm-dd>-<slug>.html，且日期前缀 == meta date
  6. basename 全库唯一（站点 assertUniqueBasenames 的硬约束）——**始终全库建索引**，
     与 scope 无关，避免漏检「范围内文件撞上范围外文件」的情况。

退出码：0 全部通过；1 存在范围内错误。
"""

import argparse
import os
import re
import subprocess
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


def git_untracked(root):
    """root 下 git 未追踪文件的绝对路径集合；非 git / 失败时返回 None。

    路径经 os.path.realpath 归一：macOS 上 /tmp 是 /private/tmp 的软链，
    git 回报仓库根为 /private/tmp/...，与 /tmp/... 直比会全部失配。
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
        except ValueError:
            continue
    return res


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--dir", default="posts-html")
    ap.add_argument("--max-width", type=int, default=250)
    ap.add_argument("--min-chars", type=int, default=100)
    ap.add_argument("--max-chars", type=int, default=130)
    ap.add_argument("--no-len-check", action="store_true")
    ap.add_argument("--author", default="军舰")
    ap.add_argument("--scope", choices=["untracked", "all"], default="untracked",
                    help="untracked=只校验 git 未追踪的新文件（默认）；all=全库")
    ap.add_argument("--all", action="store_true", help="等价于 --scope all")
    ap.add_argument("--files", nargs="*", default=None,
                    help="显式指定只校验这些 HTML 文件；给出时忽略 --scope")
    args = ap.parse_args()

    if not os.path.isdir(args.dir):
        print("目录不存在：%s" % args.dir, file=sys.stderr)
        sys.exit(2)

    scope = "all" if args.all else args.scope
    explicit = None
    if args.files:
        explicit = {os.path.realpath(f) for f in args.files}
        scope = "files"
    untracked = git_untracked(args.dir)
    if scope == "untracked" and untracked is None:
        print("! 非 git 仓库或 git 不可用，--scope untracked 自动回退为全库校验",
              file=sys.stderr)
        scope = "all"

    # 收集文件（全库，用于建 basename 索引）
    files = []
    for dirpath, dirnames, filenames in os.walk(args.dir):
        dirnames[:] = [d for d in dirnames if not d.startswith(".")]
        for fn in sorted(filenames):
            if fn.endswith(".html") and not fn.startswith("_"):
                files.append(os.path.realpath(os.path.join(dirpath, fn)))

    if scope == "files":
        missing = sorted(explicit - set(files))
        for m in missing:
            print("! 指定的文件不在此目录下或不存在，已忽略：%s" % m, file=sys.stderr)

    per_file_errors = {}
    warns = []
    by_basename = {}

    for full in sorted(files):
        rel = os.path.relpath(full)
        base = os.path.basename(full)[:-5]
        raw = open(full, encoding="utf-8", errors="replace").read()
        errs = []

        # 1. 齐全性
        vals = {k: meta_content(raw, k) for k in FIELDS}
        for k in FIELDS:
            if vals[k] is None:
                errs.append("缺少 meta %s" % k)

        d = vals.get("description")
        if d is not None:
            if any(c in d for c in ("\n", "\r", "<", ">")):
                errs.append("description 含换行或标签")
            if '"' in d:
                errs.append("description 含英文双引号")
            width = disp_width(d)
            if width > args.max_width:
                errs.append("description 宽度 %d > %d" % (width, args.max_width))
            if not args.no_len_check and not (args.min_chars <= len(d) <= args.max_chars):
                errs.append("description 字数 %d 不在 [%d,%d]" % (len(d), args.min_chars, args.max_chars))

        a = vals.get("author")
        if a is not None and a != args.author:
            warns.append("%s: author=%r（约定 %r）" % (rel, a, args.author))

        dt = vals.get("date")
        if dt is not None and not DATE_RE.match(dt):
            errs.append("date 格式非法：%r" % dt)

        # 2. 命名
        m = CONFORM_RE.match(base)
        if not m:
            errs.append("文件名不合规范（应为 <yyyy-mm-dd>-<slug>.html）")
        else:
            prefix = m.group(1)
            if dt and prefix != dt:
                errs.append("文件名日期 %s != meta date %s" % (prefix, dt))

        per_file_errors[full] = [("%s: %s" % (rel, e)) for e in errs]
        by_basename.setdefault(base, []).append(full)

    # 3. basename 全库唯一（与 scope 无关，始终检查）
    for base, hits in by_basename.items():
        if len(hits) > 1:
            for h in hits:
                others = [os.path.relpath(x) for x in hits if x != h]
                per_file_errors[h].append(
                    "%s: basename 冲突，与 %s 重复" % (os.path.relpath(h), "、".join(others)))

    # 按范围分区
    def in_scope(full):
        if scope == "all":
            return True
        if scope == "files":
            return full in explicit
        return untracked is not None and full in untracked

    scope_errors, out_errors = [], []
    for full in sorted(per_file_errors):
        for e in per_file_errors[full]:
            (scope_errors if in_scope(full) else out_errors).append(e)

    scope_files = [f for f in files if in_scope(f)]

    print("=== posts-html 校验 ===")
    print("范围：%s | 校验文件数：%d" % (scope, len(scope_files)))
    if warns:
        print("\n-- 告警 --")
        for w in warns:
            print("  ! " + w)
    if scope_errors:
        print("\n-- 范围内错误（%d）--" % len(scope_errors))
        for e in scope_errors:
            print("  x " + e)
    if out_errors and scope == "untracked":
        print("\n-- 范围外提示（已追踪文档的遗留问题，%d 条，不计入结果）--" % len(out_errors))
        for e in out_errors:
            print("  · " + e)
        print("  如需一并处理，请显式使用 --scope all")
    if scope_errors:
        print("\n结果：未通过")
        sys.exit(1)
    if not scope_files:
        print("\n本次范围内没有待校验的文件（未追踪的新 HTML；可用 --files 点名或 --scope all）。")
    print("\n结果：全部通过 ✓")
    sys.exit(0)


if __name__ == "__main__":
    main()
