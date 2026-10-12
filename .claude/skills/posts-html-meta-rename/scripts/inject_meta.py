#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""把标准四项 meta 注入单个 HTML 文档，并可顺带按规范重命名。

这是「一文档一子智能体」里子智能体调用的落盘工具：子智能体只负责
读取全文、撰写 description / keywords，然后把四个值交给本脚本，
由脚本负责「锚点安全」的插入与重命名，避免手写 Edit 踩坑。

用法：
  python3 inject_meta.py --file <abs.html> --json /tmp/meta.json [--rename] \
      [--slug my-slug] [--force] [--dry-run]

meta.json（UTF-8）：
  {"description": "...", "keywords": "a, b, c", "author": "军舰",
   "date": "2026-10-12", "slug": "optional-slug"}

规则：
  - 默认只补「缺失」字段；--force 时覆盖已存在字段。
  - 插入顺序固定：description → keywords → author → date。
  - 插入位置：有 viewport 则紧随其后；否则插在 <title> 之前；
    再否则插在 <head> 开标签之后。无 <head> 的片段文件即走 <title> 分支。
  - --rename：重命名为 <date>-<slug>.html（slug 取 --slug 或 json.slug）。
    目标与当前同名 → 跳过；目标已存在（同目录或全库同名 basename）→ 报错。
  - 幂等：字段齐全且 --rename 后名称已一致时，重复运行零改动。
"""

import argparse
import json
import os
import re
import sys

HEAD_RE = re.compile(r"<head(?=[\s>])[^>]*>", re.I)
TITLE_TAG_RE = re.compile(r"<title[^>]*>", re.I)
FIELDS = ["description", "keywords", "author", "date"]

META_TPL = '<meta name="%s" content="%s">'


def meta_re(name):
    return re.compile(
        r'<meta[^>]+name=["\']%s["\'][^>]+content=["\'][^"\']*["\'][^>]*>'
        r'|<meta[^>]+content=["\'][^"\']*["\'][^>]+name=["\']%s["\'][^>]*>' % (name, name),
        re.I,
    )


def has_meta(raw, name):
    return bool(meta_re(name).search(raw))


def validate(values):
    d = values.get("description") or ""
    if not d.strip():
        raise SystemExit("[inject] description 为空")
    if any(c in d for c in ['"', "\n", "\r", "<", ">"]):
        raise SystemExit('[inject] description 含非法字符（"、换行或 < >）')
    kw = values.get("keywords") or ""
    if not kw.strip():
        raise SystemExit("[inject] keywords 为空")
    date = values.get("date") or ""
    if not re.match(r"^\d{4}-\d{2}-\d{2}$", date):
        raise SystemExit("[inject] date 需为 YYYY-MM-DD，收到 %r" % date)
    if not (values.get("author") or "").strip():
        raise SystemExit("[inject] author 为空")


def build_block(missing_fields, values):
    lines = []
    for k in FIELDS:
        if k in missing_fields:
            lines.append(META_TPL % (k, values[k].strip()))
    return lines


def insert_block(raw, lines):
    """锚点安全地插入 meta 行，返回新文本。"""
    if not lines:
        return raw
    block = "\n".join(lines)

    # 1) 紧随 viewport 之后
    m = re.search(r'<meta[^>]+name=["\']viewport["\'][^>]*>', raw, re.I)
    if m:
        pos = m.end()
        return raw[:pos] + "\n" + block + raw[pos:]

    # 2) 插在 <title> 之前（含片段文件的隐式 head）
    m = TITLE_TAG_RE.search(raw)
    if m:
        pos = m.start()
        return raw[:pos] + block + "\n" + raw[pos:]

    # 3) 插在 <head ...> 之后
    m = HEAD_RE.search(raw)
    if m:
        pos = m.end()
        return raw[:pos] + "\n" + block + raw[pos:]

    raise SystemExit("[inject] 找不到插入锚点（既无 viewport/title 也无 <head>）")


def find_basename_conflict(root, target_base, self_path):
    """全库查找同名 basename（basename = 文章 id，必须唯一）。"""
    for dirpath, dirnames, filenames in os.walk(root):
        dirnames[:] = [d for d in dirnames if not d.startswith(".")]
        for fn in filenames:
            if not fn.endswith(".html"):
                continue
            full = os.path.join(dirpath, fn)
            if os.path.abspath(full) == os.path.abspath(self_path):
                continue
            if fn[:-5] == target_base:
                return full
    return None


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--file", required=True)
    ap.add_argument("--json", required=True, dest="json_path")
    ap.add_argument("--rename", action="store_true")
    ap.add_argument("--slug", default=None)
    ap.add_argument("--force", action="store_true")
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    full = os.path.abspath(args.file)
    if not os.path.isfile(full):
        raise SystemExit("[inject] 文件不存在：%s" % full)

    values = json.load(open(args.json_path, encoding="utf-8"))
    validate(values)
    raw = open(full, encoding="utf-8").read()

    to_insert = [k for k in FIELDS if args.force or not has_meta(raw, k)]
    lines = build_block(to_insert, values)
    new_raw = insert_block(raw, lines)

    changed = new_raw != raw
    if changed and not args.dry_run:
        open(full, "w", encoding="utf-8").write(new_raw)

    result = {"file": full, "inserted": to_insert, "content_changed": changed}

    # 重命名
    if args.rename:
        slug = args.slug or values.get("slug")
        if not slug:
            raise SystemExit("[inject] --rename 需要 --slug 或 json.slug")
        if not re.match(r"^[a-z0-9]+(?:-[a-z0-9]+)*$", slug):
            raise SystemExit("[inject] slug 只能用小写字母/数字/连字符：%r" % slug)
        target_base = "%s-%s" % (values["date"], slug)
        target_name = target_base + ".html"
        cur_name = os.path.basename(full)
        if cur_name == target_name:
            result["renamed"] = None
        else:
            root = os.path.dirname(full)
            while os.path.basename(root) == "2026" or re.match(r"^\d{4}$", os.path.basename(root)):
                root = os.path.dirname(root)
            conflict = find_basename_conflict(root, target_base, full)
            target_path = os.path.join(os.path.dirname(full), target_name)
            if conflict or (os.path.exists(target_path)):
                hit = conflict or target_path
                raise SystemExit("[inject] 目标 basename 冲突：%s" % hit)
            if not args.dry_run:
                os.rename(full, target_path)
            result["renamed"] = {"from": cur_name, "to": target_name}
    else:
        result["renamed"] = None

    print(json.dumps(result, ensure_ascii=False))


if __name__ == "__main__":
    main()
